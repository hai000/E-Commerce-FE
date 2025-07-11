import NextAuth from "next-auth"
import Credentials from "@auth/core/providers/credentials";
import {getInfo, getUserById, login, refreshToken} from "@/lib/api/user";
import {ILogin} from "@/lib/response/login";
import {jwtDecode, JwtPayload} from "jwt-decode";
import {JWT} from "@auth/core/jwt";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const providers: any[] = [
    Credentials({
        credentials: {
            username: {
                label: "username",
            },
            password: {
                label: "password",
            },
        },
        authorize: async (credentials) => {
            const pw = credentials.password as string;
            const username = credentials.username as string;
            try {
                const res = await login({ username, password: pw });
                if (typeof res === "string") {
                    console.log("Login API error:", res);
                    return null;
                }
                const loginResponse = res as ILogin;
                const userInfo = await getInfo({ accessToken: loginResponse.accessToken });
                if (typeof userInfo === "string") {
                    console.log("GetInfo API error:", userInfo);
                    return null;
                }
                return {
                    id: `${userInfo.id}`,
                    name: userInfo.fullName,
                    email: userInfo.email || '',
                    role: userInfo.role,
                    accessToken: loginResponse.accessToken,
                    refreshToken: loginResponse.refreshToken
                };
            } catch (err) {
                console.log("Authorize error:", err);
                return null;
            }
        }
    })
]

export const { handlers ,signIn, signOut, auth } = NextAuth({
    providers: providers,
    callbacks: {
        jwt: async ({ token, user }) => {
            if (token?.accessToken) {
                try {
                    const decodedToken = jwtDecode<JwtPayload>(token.accessToken as string);
                    if (decodedToken?.exp) {
                        token.accessTokenExpires = decodedToken.exp*1000;
                    }
                } catch (error) {
                    console.error("Failed to decode JWT:", error);
                    // Handle the error as needed
                }
            }

            if (user) {
                const decodedToken = jwtDecode<JwtPayload>(user.accessToken)
                return {
                    ...token,
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    accessToken: user.accessToken,
                    refreshToken: user.refreshToken,
                    // @ts-expect-error Expected type mismatch due to legacy code
                    accessTokenExpires: decodedToken.exp*1000,
                    role: user.role
                };
            }
            // @ts-expect-error Expected type mismatch due to legacy code
            if (Date.now() < token.accessTokenExpires) {
                //token is valid
                return token
            }
            const refreshed = await refreshTokens(token);
            // Đảm bảo refreshTokens trả về token có role!
            return {
                ...refreshed,
                role: token.role,
            };
        },
        session: async ({ session, token }) => {
            if (token) {
                const user = await getInfo({accessToken: token.accessToken as string})
                if (typeof user !== "string") {
                    session.user = session.user || {};
                    session.user.id = user.id as string;
                    session.user.name = user.fullName;
                    session.user.email = user.email || '';
                    session.user.role = user.role;
                }else {
                    session.user = session.user || {};
                    session.user.id = token.id as string;
                    session.user.name = token.name as string;
                    session.user.email = token.email as string;
                    session.user.role = `${token.role}`;
                }
                session.accessToken = token.accessToken as string ;
                session.refreshToken = token.refreshToken as string;

            }
            return session;
        },
    },
})
async function refreshTokens(token: JWT) {
    const iLogin = await refreshToken({
        refreshToken: token.refreshToken as string
    });
    if (typeof iLogin === "string") {
        return null
    }
    return {
        ...token,
        accessToken: iLogin.accessToken,
        refreshToken: iLogin.refreshToken,
    }
}

import {DefaultSession} from "next-auth";
import {DefaultUser} from "@auth/core/types";

declare module 'next-auth/jwt' {
    import { DefaultJWT } from 'next-auth';

    interface JWT extends DefaultJWT {
        id: string; // Unique identifier for the user
        accessToken?: string; // JWT access token
        accessTokenExpires: number; // Expiration time for access token
        refreshToken?: string; // Optional refresh token
        role: string; // User role
        error?: "RefreshTokenError"; // Optional error property
    }
}
declare module 'next-auth' {
    interface Session {
        accessToken: string
        refreshToken: string
        user: {
            role: string
        } & DefaultSession['user']
    }
    interface User extends DefaultUser {
        accessToken: string
        refreshToken: string
        role: string
    }

}
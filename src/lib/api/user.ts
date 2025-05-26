'use server'
import {callApiToObject, generateHeaderAccessTokenString} from "@/lib/utils";
import {POST_METHOD, PUT_METHOD} from "@/lib/constants";
import {IUser} from "@/lib/response/user";
import {IUserLoginRequest, IUserRegisterRequest, UpdateUserRequest} from "@/lib/request/user";
import {ILogin} from "@/lib/response/login";
import { signIn, signOut} from "@/auth";
import {redirect} from "next/navigation";
import {getTranslations} from "next-intl/server";
export async function updateUser(accessToken: string,request: UpdateUserRequest) {
    return callApiToObject({url: '/identity/users/changeInfo', method: PUT_METHOD,data: request,headers: generateHeaderAccessTokenString(accessToken)})
}
export async function login(request: IUserLoginRequest) {
    return callApiToObject<ILogin>({url: '/identity/users/login',method: POST_METHOD, data: request});
}
export async function signInWithCredentials(user: IUserLoginRequest) {
    return await signIn('credentials', { ...user, redirect: false })
}
export async function refreshToken(request:{refreshToken?: string}) {
    const t = await getTranslations("User")
    if (!request.refreshToken) {
        return t('Refresh token is not valid');
    }
    return callApiToObject<ILogin>({url: '/identity/users/refreshToken',method: POST_METHOD, data: request});
}
export async function register(request:IUserRegisterRequest) {
    return callApiToObject<IUser>({url: '/identity/users/register', method: POST_METHOD, data: request});
}
export const SignOut = async () => {
    const redirectTo = await signOut({ redirect: false })
    redirect(redirectTo.redirect)
}
export async function getInfo({
    accessToken,
                              }: {
    accessToken: string;
}) {
    return callApiToObject<IUser>({url:`/identity/users/myInfo`,headers: generateHeaderAccessTokenString(accessToken)});
}


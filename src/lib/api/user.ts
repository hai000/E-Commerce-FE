'use server'
import { signIn } from "next-auth/react";
import {
    ArrayWithPage,
    callApiToArrayWithPage,
    callApiToObject,
    generateHeaderAccessToken,
    generateHeaderAccessTokenString
} from "@/lib/utils";
import {PAGE_SIZE, POST_METHOD, PUT_METHOD} from "@/lib/constants";
import {IUser} from "@/lib/response/user";
import {IUserLoginRequest, IUserRegisterRequest, UpdateUserRequest} from "@/lib/request/user";
import {ILogin} from "@/lib/response/login";
import {auth, signOut} from "@/auth";
import {redirect} from "next/navigation";
import {getTranslations} from "next-intl/server";

export async function updateUser(request: UpdateUserRequest) {
    const session = await auth()
    if (!session || !session.accessToken) {
        return redirect('/sign-in');
    }

    return callApiToObject<IUser>({
        url: '/identity/users/changeInfo',
        method: PUT_METHOD,
        data: request,
        headers: generateHeaderAccessToken(session)
    })
}
export async function getUserById(id: string) {
    return callApiToObject<IUser>({
        url: `/identity/users/id/${id}`,
    });
}
export async function login(request: IUserLoginRequest) {
    return callApiToObject<ILogin>({url: '/identity/users/login', method: POST_METHOD, data: request});
}

export async function signInWithCredentials(user: IUserLoginRequest) {
    return await signIn('credentials', {...user, redirect: false})
}

export async function refreshToken(request: { refreshToken?: string }) {
    const t = await getTranslations("User")
    if (!request.refreshToken) {
        return t('Refresh token is not valid');
    }
    return callApiToObject<ILogin>({url: '/identity/users/refreshToken', method: POST_METHOD, data: request});
}

export async function register(request: IUserRegisterRequest) {
    return callApiToObject<IUser>({url: '/identity/users/register', method: POST_METHOD, data: request});
}

export const SignOut = async () => {
    const redirectTo = await signOut({redirect: false})
    redirect(redirectTo.redirect)
}

export async function getAllUsers({
                                      search = "",
                                      page = 1,
                                      size = PAGE_SIZE,
                                      role = "",
                                  }) : Promise<ArrayWithPage<IUser>> {
    const session = await auth()
    if (!session || !session.accessToken) {
        return redirect('/sign-in');
    }
    return callApiToArrayWithPage<IUser>({
        url: `/identity/users?search=${search}&page=${page}&size=${size}&role=${role}`,
        headers: generateHeaderAccessToken(session),
    })
}

export async function getInfo({
                                  accessToken,
                              }: {
    accessToken: string;
}) {
    return callApiToObject<IUser>({
        url: `/identity/users/myInfo`,
        headers: generateHeaderAccessTokenString(accessToken)
    });
}


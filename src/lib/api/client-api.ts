'use client'
import {IUserLoginRequest} from "@/lib/request/user";
import {signIn} from "next-auth/react";

export async function signInWithCredentials(user: IUserLoginRequest) {
    return await signIn('credentials', {...user, redirect: false})
}
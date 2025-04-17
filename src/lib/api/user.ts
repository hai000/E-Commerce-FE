'use server'
import {callApiGetStatus, callApiToObject, generateHeaderAccessToken} from "@/lib/utils";
import {DOMAIN, POST_METHOD} from "@/lib/constants";
import {IUser} from "@/lib/response/user";
import {IUserLoginRequest, IUserRegisterRequest} from "@/lib/request/user";
import {ILogin} from "@/lib/response/login";

export async function login(request: IUserLoginRequest) {
    return callApiToObject<ILogin>({url: '/identity/user/login',method: POST_METHOD, data: request});
}
export async function register(request:IUserRegisterRequest) {
    return callApiToObject<IUser>({url: '/identity/user/register', method: POST_METHOD, data: request});
}
export async function logOut(){
    return {
        redirect: "",
    }
}
export async function getInfo(request:ILogin) {
    return callApiToObject<IUser>({url:`/identity/user/getInfo`,headers: generateHeaderAccessToken(request)});
}
async function checkValidToken(request:ILogin) {
    return callApiGetStatus({url:'/identity/user/validToken',method: POST_METHOD, data:request});
}
export async function auth(data: {
    accessToken?: string;
    refreshToken?: string;
}) {
    if (data.accessToken&&data.refreshToken) {
       return await checkValidToken({accessToken: data.accessToken, refreshToken:data.refreshToken})
    }else {
        return false
    }

}
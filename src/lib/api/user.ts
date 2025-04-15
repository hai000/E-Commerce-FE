import {callApiGetStatus, callApiToObject} from "@/lib/utils";
import {POST_METHOD} from "@/lib/constants";
import {IUser} from "@/lib/response/user";
import {IUserLoginRequest, IUserRegisterRequest} from "@/lib/request/user";
import {ILogin} from "@/lib/response/login";
import {redirect} from "next/navigation";
export async function login(request: IUserLoginRequest) {
    return callApiToObject<ILogin>('/identity/user/login', POST_METHOD, request);
}
export async function register(request:IUserRegisterRequest) {
    return callApiToObject<IUser>('/identity/user/register', POST_METHOD, request);
}
export const logOut = async () => {
    redirect("")
}
async function checkValidToken(request:ILogin) {
    return callApiGetStatus('/identity/user/validToken', POST_METHOD, request);
}
export async function auth(cookieStore:any) {
    const accessToken = cookieStore.get('accessToken')
    const refreshToken = cookieStore.get('refreshToken')
    if (accessToken&&refreshToken) {
       return await checkValidToken({accessToken: accessToken.value, refreshToken:refreshToken.value})
    }else {
        return false
    }

}
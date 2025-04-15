export interface IUserRegisterRequest {
    password: string;
    confirmPassword: string;
    username: string;
    email: string;
    phoneNumber: string;
}
export interface IUserLoginRequest {
    username: string;
    password: string;
}

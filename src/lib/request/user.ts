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
export interface UpdateUserRequest {
    password: string;
    email: string;
    phoneNumber: string;
    fullName: string;
    avtPath: string;
    dateOfBirth: string;
    gender: number;
}
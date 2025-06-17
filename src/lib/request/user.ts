export interface IUserRegisterRequest {
    password: string;
    confirmPassword: string;
    username: string;
    email: string;
    phoneNumber: string;
}
export interface CreateUserAdminRequest {
    username: string;
    password: string;
    fullName: string;
    dateOfBirth?: string;
    phoneNumber: string;
    email: string;
    gender: number;
    role: string;
}
export interface IUserLoginRequest {
    username: string;
    password: string;
}
export interface UpdateUserRequest {
    email: string;
    phoneNumber: string;
    fullName: string;
    avtPath: string;
    dateOfBirth: string;
    gender: number;
}
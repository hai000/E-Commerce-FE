export interface IUser {
    id: string
    username: string
    phoneNumber?: string
    email?: string
    fullName: string
    avtPath: string
    dateOfBirth?: string
    gender: number
    role: string
    createdAt?: Date
    updatedAt?: Date
}
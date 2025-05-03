import {z} from "zod";
import {formatNumberWithDecimal} from "@/lib/utils";
export const Price = (field: string) =>
    z.coerce
        .number()
        .refine(
            (value) => /^\d+(\.\d{2})?$/.test(formatNumberWithDecimal(value)),
            `${field} must have exactly two decimal places (e.g., 49.99)`
        )

export const CategorySchema = z.object({
    id: z.union([
        z.string().min(1, 'Category is required'),
        z.number().transform((num) => num.toString()),
    ]),
    name: z.string().min(1, 'Category is required'),
    imagePath: z.nullable(z.string().min(1, 'Image is required')),
    description: z.nullable(z.string().min(1, 'Description is required')),
});
const UserName = z
    .string()
    .min(2, { message: 'Username must be at least 2 characters' })
    .max(50, { message: 'Username must be at most 30 characters' })
const Email = z.string().min(1, 'Email is required').email('Email is invalid')
const Password = z.string().min(3, 'Password must be at least 3 characters')
const Phone = z
    .string()
    .min(9, 'Phone number is required')
    .regex(/^\d+$/, 'Phone number must contain only digits')
export const UserSignInSchema = z.object({
    username: UserName,
    password: Password,
})
export const UserSignUpSchema = UserSignInSchema.extend({
    email: Email,
    confirmPassword: Password,
    phoneNumber: Phone
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
})

export const ShippingAddressSchema = z.object({
    fullName: z.string().min(1, 'Full name is required'),
    street: z.string().min(1, 'Address is required'),
    city: z.string().min(1, 'City is required'),
    district: z.string().min(1, 'District is required'),
    phone: Phone,
    ward: z.string().min(1, 'Ward is required'),
})
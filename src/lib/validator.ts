import {z} from "zod";

export const getCategorySchema = (t: (key: string) => string) =>
    z.object({
        id: z.union([
            z.string().min(1, { message: t("category_required") }),
            z.number().transform((num) => num.toString()),
        ]),
        name: z.string().min(1, { message: t("category_required") }),
        imagePath: z.nullable(z.string().min(1, { message: t("image_required") })),
        description: z.nullable(z.string().min(1, { message: t("description_required") })),
    });
export const getReviewSchema = (t: (key: string) => string) =>
    z.object({
            ratingScore: z
                .string()
                .min(1, { message: t("rating_required") })
                .refine((val) => !isNaN(Number(val)), { message: t("rating_must_be_number") })
                .refine((val) => Number(val) >= 1 && Number(val) <= 5, { message: t("rating_max") }),
        content: z.string().min(1, { message: t("comment_required") }),
    });
export const Email = (t: (key: string) => string) =>
    z.string().min(1, { message: t("email_required") }).email({ message: t("email_invalid") });

export const Password = (t: (key: string) => string) =>
    z.string().min(3, { message: t("password_min") });

export const Phone = (t: (key: string) => string) =>
    z
        .string()
        .regex(/^\d+$/, { message: t("phone_digits") })
        .min(10, { message: t("phone_min") })

export const UserName = (t: (key: string) => string) =>
    z
        .string()
        .min(5, { message: t("username_min") })
        .max(30, { message: t("username_max") });

export const getUserSignInSchema = (t: (key: string) => string) =>
    z.object({
        username: UserName(t),
        password: Password(t),
    });
export const getUserEditSchema = (t: (key: string) => string) =>
    z.object({
        username: UserName(t),
        email: Email(t),
        phoneNumber: Phone(t),
        fullName: z.string().min(1, { message: t("full_name_required") }),
        dateOfBirth: z.string().optional().or(z.literal("")),
        gender: z.enum(["0", "1"], {
            required_error: t("Please select a gender"),
        }),
        role: z.enum(["ADMIN", "USER"], {
            required_error: "Please select a role",
        }),
    })
export const getUserSignUpSchema = (t: (key: string) => string) =>
    getUserSignInSchema(t)
        .extend({
            email: Email(t),
            confirmPassword: Password(t),
            phoneNumber: Phone(t),
        })
        .refine((data) => data.password === data.confirmPassword, {
            message: t("passwords_not_match"),
            path: ["confirmPassword"],
        });

export const getShippingAddressSchema = (t: (key: string) => string) =>
    z.object({
        fullName: z.string().min(1, { message: t("full_name_required") }),
        street: z.string().min(1, { message: t("street_required") }),
        city: z.string().min(1, { message: t("city_required") }),
        district: z.string().min(1, { message: t("district_required") }),
        phone: Phone(t),
        ward: z.string().min(1, { message: t("ward_required") }),
    });
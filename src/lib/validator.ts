import {z} from "zod";

export const getCategorySchema = (t: (key: string) => string) =>
    z.object({
        id: z.union([
            z.string().min(1, {message: t("category_required")}),
            z.number().transform((num) => num.toString()),
        ]),
        name: z.string().min(1, {message: t("category_required")}),
        imagePath: z.nullable(z.string().min(1, {message: t("image_required")})),
        description: z.nullable(z.string().min(1, {message: t("description_required")})),
    });

export const AddressSchema = (t:(key:string)=> string) => z.object({
    houseNumber: z.string().min(1, t("House number is required")),
    provinceId: z.string().min(1, t("Please select a province")),
    districtId: z.string().min(1, t("Please select a district")),
    wardId: z.string().min(1, t("Please select a ward")),
})
export const getReviewSchema = (t: (key: string) => string) =>
    z.object({
        ratingScore: z
            .string()
            .min(1, {message: t("rating_required")})
            .refine((val) => !isNaN(Number(val)), {message: t("rating_must_be_number")})
            .refine((val) => Number(val) >= 1 && Number(val) <= 5, {message: t("rating_max")}),
        content: z.string().min(1, {message: t("comment_required")}),
    });
export const Email = (t: (key: string) => string) =>
    z.string().min(1, {message: t("email_required")}).email({message: t("email_invalid")});

export const Password = (t: (key: string) => string) =>
    z.string().min(3, {message: t("password_min")});

export const Phone = (t: (key: string) => string) =>
    z
        .string().refine(
        (val) => {
            // Loại bỏ khoảng trắng
            const phone = val.replace(/\s+/g, "");
            // 0xxxxxxxxx (10 số)
            if (/^0\d{9}$/.test(phone)) return true;
            // +84xxxxxxxxx (bắt đầu +84, sau đó 9 số)
            if (/^\+84\d{9}$/.test(phone)) return true;
            return false;
        },
        {
            message: t("phone_invalid"),
        }
    );
export const CreateUserSchema = (t: (key: string) => string) => z
    .object({
        username: UserName(t),
        email: Email(t),
        phoneNumber: Phone(t),
        fullName: FullName(t),
        dateOfBirth: DateOfBirth(t),
        gender: Gender(t),
        role: Role(t),
        password: Password(t),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: t("passwords_not_match"),
        path: ["confirmPassword"],
    })
export const Gender = (t: (key: string) => string) => z.enum(["0", "1", "2", "3"], {
    required_error: t("Please select a gender"),
})
export const UserName = (t: (key: string) => string) =>
    z
        .string()
        .min(5, {message: t("username_min")})
        .max(30, {message: t("username_max")});

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
        fullName: UserName(t),
        dateOfBirth: DateOfBirth(t),
        gender: Gender(t),
        role: Role(t),
    })
export const Role = (t: (key: string) => string) => z.enum(["ADMIN", "USER"], {
    required_error: t("Please select a role"),
})
export const DateOfBirth = (t: (key: string) => string) => z.string().optional().or(z.literal(t("")))
export const FullName = (t: (key: string) => string) =>
    z.string().min(1, {message: t("full_name_required")});
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
        id: z.string().min(1, {message: t("address_required")}),
        fullName: UserName(t),
        phone: Phone(t),
    });
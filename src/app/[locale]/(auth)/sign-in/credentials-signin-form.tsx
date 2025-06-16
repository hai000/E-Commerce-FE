'use client'; // Đánh dấu component này là client component

import { useRouter, useSearchParams } from 'next/navigation'; // Hook cho điều hướng
import { Button } from '@/components/ui/button'; // Component Button
import { Input } from '@/components/ui/input'; // Component Input
import Link from 'next/link'; // Component Link cho điều hướng
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'; // Các component form
import { useForm } from 'react-hook-form'; // Hook để quản lý form
import { APP_NAME } from '@/lib/constants'; // Hằng tên ứng dụng
import { IUserLoginRequest } from "@/lib/request/user"; // Kiểu cho yêu cầu đăng nhập
import { toast } from "@/hooks/use-toast"; // Hook thông báo
import { zodResolver } from '@hookform/resolvers/zod'; // Giải quyết xác thực với Zod
import useCartStore from "@/hooks/use-cart-store"; // Hook quản lý giỏ hàng
import { signInWithCredentials } from "@/lib/api/user"; // API để đăng nhập
import { useTranslations } from "next-intl"; // Hook cho dịch ngôn ngữ
import { getUserSignInSchema } from "@/lib/validator"; // Schema xác thực

// Giá trị mặc định dựa trên môi trường
const signInDefaultValues =
    process.env.NODE_ENV === 'development'
        ? {
            username: 'admin',
            password: '123123',
        }
        : {
            username: '',
            password: '',
        }

export default function CredentialsSignInForm() {
    const t = useTranslations(); // Hook dịch ngôn ngữ
    const { reloadCart } = useCartStore(); // Làm mới giỏ hàng sau khi đăng nhập
    const searchParams = useSearchParams(); // Lấy tham số tìm kiếm từ URL
    const callbackUrl = searchParams.get('callbackUrl') || '/'; // URL điều hướng sau khi đăng nhập
    const router = useRouter(); // Hook cho điều hướng
    const form = useForm<IUserLoginRequest>({ // Khởi tạo xử lý form
        resolver: zodResolver(getUserSignInSchema(t)), // Schema xác thực
        defaultValues: signInDefaultValues, // Giá trị mặc định
    });
    const { control, handleSubmit, setError, clearErrors } = form;

    // Hàm kiểm tra độ dài username và password
    const validateInput = (fieldName: string, value: string) => {
        if (fieldName === 'username' && value.length < 5) {
            setError('username', { type: 'manual', message: t('Login.Username invalid') });
            return true; // Trả về true nếu có lỗi
        } else if (fieldName === 'password' && value.length < 6) {
            setError('password', { type: 'manual', message: t('Login.Password invalid') });
            return true; // Trả về true nếu có lỗi
        }
        clearErrors(fieldName); // Xóa lỗi nếu hợp lệ
        return false; // Trả về false nếu không có lỗi
    };

    const onSubmit = async (data: IUserLoginRequest) => {
        // Kiểm tra đầu vào trước khi gửi
        const usernameError = validateInput('username', data.username);
        const passwordError = validateInput('password', data.password);

        if (usernameError || passwordError) {
            if (usernameError) {
                toast({
                    title: t('Toast.Error'),
                    description: t('Login.Username invalid'),
                    variant: 'destructive',
                });
            }
            if (passwordError) {
                toast({
                    title: t('Toast.Error'),
                    description: t('Login.Password invalid'),
                    variant: 'destructive',
                });
            }
            return; // Ngăn không cho gửi form
        }

        try {
            const res = await signInWithCredentials({
                username: data.username,
                password: data.password,
            });

            if (res?.error) {
                toast({
                    title: t('Toast.Error'),
                    description: res.error || t('User.Username or password is incorrect'),
                    variant: 'destructive',
                });
                return;
            }
            await reloadCart(); // Làm mới giỏ hàng
            router.push(callbackUrl); // Điều hướng đến URL đã chỉ định
        } catch (error) {
            console.error('Lỗi đăng nhập:', error);
            toast({
                title: t('Toast.Error'),
                description: t('User.Username or password is incorrect'),
                variant: 'destructive',
            });
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <input type="hidden" name="callbackUrl" value={callbackUrl} />
                <div className="space-y-6">
                    <FormField
                        control={control}
                        name="username"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>{t("User.Username")}</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder={t("Placeholder.Enter username")}
                                        {...field}
                                        onChange={(e) => {
                                            field.onChange(e); // Cập nhật giá trị
                                            validateInput('username', e.target.value); // Kiểm tra độ dài
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={control}
                        name="password"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>{t("User.Password")}</FormLabel>
                                <FormControl>
                                    <Input
                                        type="password"
                                        placeholder={t("Placeholder.Enter password")}
                                        {...field}
                                        onChange={(e) => {
                                            field.onChange(e); // Cập nhật giá trị
                                            validateInput('password', e.target.value); // Kiểm tra độ dài
                                        }}

                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div>
                        <Button type="submit">{t('Login.Sign In')}</Button>
                    </div>
                    <div className="text-sm">
                        {t('About.By signing in, you agree to')} {APP_NAME}&apos;s{' '}
                        <Link href="/page/conditions-of-use">{t('About.Conditions of Use')}</Link> {t('About.And')}{' '}
                        <Link href="/page/privacy-policy">{t('About.Privacy Notice')}.</Link>
                    </div>
                </div>
            </form>
        </Form>
    );
}
'use client';
import { redirect, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { toast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { APP_NAME } from '@/lib/constants';
import { IUserRegisterRequest } from "@/lib/request/user";
import {
    login,
    register,
    signInWithCredentials,
    validatePhoneNumber,
    validEmail,
    validPhoneNumber
} from "@/lib/api/user";
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from "next-intl";
import useCartStore from "@/hooks/use-cart-store";
import { getUserSignUpSchema } from "@/lib/validator";

const signUpDefaultValues =
    process.env.NODE_ENV === 'development'
        ? {
            username: '',
            email: '',
            password: '',
            phoneNumber: '',
            confirmPassword: '',
        }
        : {
            username: '',
            email: '',
            password: '',
            phoneNumber: '',
            confirmPassword: '',
        }

export default function SignUpForm() {
    const searchParams = useSearchParams();
    const t = useTranslations();
    const callbackUrl = searchParams.get('callbackUrl') || '/';
    const { reloadCart } = useCartStore();
    const form = useForm<IUserRegisterRequest>({
        resolver: zodResolver(getUserSignUpSchema(t)),
        defaultValues: signUpDefaultValues,
    })

    // const { control, handleSubmit } = form;
    const { control, handleSubmit, setError, clearErrors } = form;
    // Hàm kiểm tra email qua API
    const validateEmail = async (email: string) => {
        try {
            const res = await validEmail(email);
            if (res.success === false) {
                setError('email', { type: 'manual', message: res.data }); // Hiển thị thông báo lỗi từ API
            }
        } catch (error) {
            console.error('Lỗi khi kiểm tra email:', error);
        }
    };
    const validPhoneNumber = async (phoneNumber: string) => {
        try {
            const res = await validatePhoneNumber(phoneNumber);
            if (res.success === false) {
                setError('phoneNumber', { type: 'manual', message: res.data }); // Hiển thị thông báo lỗi từ API
            }
        } catch (error) {
            console.error('Lỗi khi kiểm tra email:', error);
        }
    };

    const onSubmit = async (data: IUserRegisterRequest) => {
        const res = await register(data);
        if (typeof res === 'string') {
            toast({
                title: t('Toast.Error'),
                description: res,
                variant: 'destructive',
            });
        } else {
            const user = await login({
                username: data.username,
                password: data.password,
            });
            if (typeof user === 'string') {
                toast({
                    title: t('Toast.Error'),
                    description: user,
                    variant: 'destructive',
                });
            } else {
                toast({
                    title: t('Toast.Success'),
                    description: t('Login.Create account successfully'),
                    variant: 'success',
                });
                try {
                    await signInWithCredentials({
                        username: data.username,
                        password: data.password,
                    });
                    await reloadCart();
                    redirect(callbackUrl);
                } catch (e) {
                    console.log(e);
                }
            }
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <input type="hidden" name="callbackUrl" value={callbackUrl} />
                <div className='space-y-6'>
                    <FormField
                        control={control}
                        name="username"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>{t('User.Username')}</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder={t('Placeholder.Enter username')}
                                        {...field}
                                        onChange={(e) => {
                                            field.onChange(e); // Cập nhật giá trị
                                            if (e.target.value.length < 5) {
                                                setError('username', { type: 'manual', message: t('Login.Username invalid') });
                                            } else {
                                                clearErrors('username'); // Xóa lỗi nếu hợp lệ
                                            }
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={control}
                        name="email"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>{t('User.Email')}</FormLabel>
                                <FormControl>
                                    <Input
                                        type="email"
                                        placeholder={t("Placeholder.Enter email")}
                                        {...field}
                                        onChange={(e) => {
                                            field.onChange(e); // Cập nhật giá trị
                                            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                                            if (!emailPattern.test(e.target.value)) {
                                                setError('email', { type: 'manual', message: t('email_invalid') });
                                            } else {
                                                clearErrors('email'); // Xóa lỗi nếu hợp lệ
                                                validateEmail(e.target.value); // Kiểm tra email đã tồn tại
                                            }
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={control}
                        name="phoneNumber"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>{t('User.Phone number')}</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder={t('Placeholder.Enter phone number')}
                                        {...field}
                                        onChange={(e) => {
                                            field.onChange(e); // Cập nhật giá trị
                                            const PHONE_REGEX_1 = /^0\d{9}$/;
                                            const PHONE_REGEX_2 = /^\+\d{2} \d{9}$/;
                                            if (!PHONE_REGEX_1.test(e.target.value) && !PHONE_REGEX_2.test(e.target.value)) {
                                                setError('phoneNumber', { type: 'manual', message: t('phone number invalid') });
                                            } else {
                                                clearErrors('phoneNumber'); // Xóa lỗi nếu hợp lệ
                                                validPhoneNumber(e.target.value); // Kiểm tra email đã tồn tại
                                            }
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
                                <FormLabel>{t('User.Password')}</FormLabel>
                                <FormControl>
                                    <Input
                                        type="password"
                                        placeholder={t('Placeholder.Enter password')}
                                        {...field}
                                        onChange={(e) => {
                                            field.onChange(e); // Cập nhật giá trị
                                            if (e.target.value.length < 6) {
                                                setError('password', { type: 'manual', message: t('Login.Password invalid') });
                                            } else {
                                                clearErrors('password'); // Xóa lỗi nếu hợp lệ
                                            }
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>{t('User.Confirm Password')}</FormLabel>
                                <FormControl>
                                    <Input
                                        type="password"
                                        placeholder={t('User.Confirm Password')}
                                        {...field}
                                        onChange={(e) => {
                                            field.onChange(e); // Cập nhật giá trị
                                            if (e.target.value !== form.getValues('password')) {
                                                setError('confirmPassword', { type: 'manual', message: t('User.Confirm Password incorrect') });
                                            } else {
                                                clearErrors('confirmPassword'); // Xóa lỗi nếu hợp lệ
                                            }
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div>
                        <Button type='submit'>{t('Login.Sign Up')}</Button>
                    </div>

                    <div className='text-sm'>
                        {t('Login.By creating an account, you agree to')} {APP_NAME}&apos;s{' '}
                        <Link href="/page/conditions-of-use">{t('About.Conditions of Use')}</Link> {t('About.And')}{' '}
                        <Link href="/page/privacy-policy">{t('About.Privacy Notice')}.</Link>
                    </div>
                    <Separator className='mb-4' />
                    <div className='text-sm'>
                        {t('Login.Already have an account')}?{' '}
                        <Link className='link' href={`/sign-in?callbackUrl=${callbackUrl}`}>
                            {t('Login.Sign In')}
                        </Link>
                    </div>
                </div>
            </form>
        </Form>
    );
}
'use client'
import {redirect, useSearchParams} from 'next/navigation'

import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import Link from 'next/link'
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from '@/components/ui/form'
import {useForm} from 'react-hook-form'
import {toast} from '@/hooks/use-toast'
import {Separator} from '@/components/ui/separator'
import {APP_NAME} from '@/lib/constants'
import {IUserRegisterRequest} from "@/lib/request/user";
import {login, register, signInWithCredentials} from "@/lib/api/user";
import { zodResolver } from '@hookform/resolvers/zod'
import {useTranslations} from "next-intl";
import useCartStore from "@/hooks/use-cart-store";
import {getUserSignUpSchema} from "@/lib/validator";
const signUpDefaultValues =
    process.env.NODE_ENV === 'development'
        ? {
            name: 'john doe',
            email: 'john@me.com',
            password: '123456',
            phoneNumber: '',
            confirmPassword: '123456',
        }
        : {
            name: '',
            email: '',
            password: '',
            phoneNumber: '',
            confirmPassword: '',
        }

export default function SignUpForm() {
    const searchParams = useSearchParams()
    const t = useTranslations()
    const callbackUrl = searchParams.get('callbackUrl') || '/'
    const {reloadCart} = useCartStore()
    const form = useForm<IUserRegisterRequest>({
        resolver: zodResolver(getUserSignUpSchema(t)),
        defaultValues: signUpDefaultValues,
    })

    const {control, handleSubmit} = form

    const onSubmit = async (data: IUserRegisterRequest) => {
        const res = await register(data)
        if (typeof res === 'string') {
            toast({
                title: t('Toast.Error'),
                description: res,
                variant: 'destructive',
            })
        } else {
            const user = await login({
                username: data.username,
                password: data.password,
            })
            if (typeof user === 'string') {
                toast({
                    title: t('Toast.Error'),
                    description: user,
                    variant: 'destructive',
                })
            } else {
                toast({
                    title: t('Toast.Success'),
                    description: t('Login.Create account successfully'),
                    variant: 'success',
                })
                try {
                    await signInWithCredentials({
                        username: data.username,
                        password: data.password,
                    })
                    await reloadCart()
                    redirect(callbackUrl)
                } catch {
                }
            }
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <input type="hidden" name="callbackUrl" value={callbackUrl}/>
                <div className='space-y-6'>
                    <FormField
                        control={control}
                        name="username"
                        render={({field}) => (
                            <FormItem className="w-full">
                                <FormLabel>{t('User.Username')}</FormLabel>
                                <FormControl>
                                    <Input placeholder={t('Placeholder.Enter username')} {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
                        name="email"
                        render={({field}) => (
                            <FormItem className="w-full">
                                <FormLabel>{t('User.Email')}</FormLabel>
                                <FormControl>
                                    <Input type="email" placeholder={t("Placeholder.Enter email")} {...field} />
                                </FormControl>
                                <FormMessage/>
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
                                    <Input placeholder={t('Placeholder.Enter phone number')} {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
                        name="password"
                        render={({field}) => (
                            <FormItem className="w-full">
                                <FormLabel>{t('User.Password')}</FormLabel>
                                <FormControl>
                                    <Input
                                        type="password"
                                        placeholder={t('Placeholder.Enter password')}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
                        name="confirmPassword"
                        render={({field}) => (
                            <FormItem className="w-full">
                                <FormLabel>{t('User.Confirm Password')}</FormLabel>
                                <FormControl>
                                    <Input
                                        type="password"
                                        placeholder={t('User.Confirm Password')}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage/>
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
                    <Separator className='mb-4'/>
                    <div className='text-sm'>
                        {t('Login.Already have an account')}?{' '}
                        <Link className='link' href={`/sign-in?callbackUrl=${callbackUrl}`}>
                            {t('Login.Sign In')}
                        </Link>
                    </div>
                </div>
            </form>
        </Form>
    )
}
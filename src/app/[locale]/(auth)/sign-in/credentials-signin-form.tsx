'use client'
import {useRouter, useSearchParams} from 'next/navigation'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import Link from 'next/link'
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from '@/components/ui/form'
import {useForm} from 'react-hook-form'
import {APP_NAME} from '@/lib/constants'
import {IUserLoginRequest} from "@/lib/request/user";
import {toast} from "@/hooks/use-toast";
import {zodResolver} from '@hookform/resolvers/zod'
import useCartStore from "@/hooks/use-cart-store";
import {signInWithCredentials} from "@/lib/api/user";
import {useTranslations} from "next-intl";
import {getUserSignInSchema} from "@/lib/validator";

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
    const t = useTranslations()
    const {reloadCart} = useCartStore()
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get('callbackUrl') || '/'
    const router = useRouter();
    const form = useForm<IUserLoginRequest>({
        resolver: zodResolver(getUserSignInSchema(t)),
        defaultValues: signInDefaultValues,
    })

    const {control, handleSubmit} = form
    const onSubmit = async (data: IUserLoginRequest) => {
        try {
            await signInWithCredentials({
                username: data.username,
                password: data.password,
            })
            await reloadCart()
            router.push("/");
        } catch (error) {
            console.error('Sign in error:', error)
            toast({
                title: t('Toast.Error'),
                description: t('User.Username or password is incorrect'),
                variant: 'destructive',
            })
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <input type="hidden" name="callbackUrl" value={callbackUrl}/>
                <div className="space-y-6">
                    <FormField
                        control={control}
                        name="username"
                        render={({field}) => (
                            <FormItem className="w-full">
                                <FormLabel>{t("User.Username")}</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder={t("Placeholder.Enter username")}
                                        {...field}
                                    />
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
                                <FormLabel>{t("User.Password")}</FormLabel>
                                <FormControl>
                                    <Input
                                        type="password"
                                        placeholder={t("Placeholder.Enter password")}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage/>
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
    )
}
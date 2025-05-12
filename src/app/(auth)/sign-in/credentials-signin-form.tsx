'use client'
import {redirect, useSearchParams} from 'next/navigation'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import Link from 'next/link'
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from '@/components/ui/form'
import {useForm} from 'react-hook-form'
import {APP_NAME} from '@/lib/constants'
import {IUserLoginRequest} from "@/lib/request/user";
import {toast} from "@/hooks/use-toast";
import {UserSignInSchema} from "@/lib/validator";
import {zodResolver} from '@hookform/resolvers/zod'
import useCartStore from "@/hooks/use-cart-store";
import {isRedirectError} from "next/dist/client/components/redirect-error";
import {signInWithCredentials} from "@/lib/api/user";

const signInDefaultValues =
    process.env.NODE_ENV === 'development'
        ? {
            username: 'admin',
            password: '123',
        }
        : {
            username: '',
            password: '',
        }

export default function CredentialsSignInForm() {
    const {reloadCart} = useCartStore()
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get('callbackUrl') || '/'

    const form = useForm<IUserLoginRequest>({
        resolver: zodResolver(UserSignInSchema),
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
            redirect(callbackUrl)
        } catch (e) {
            if (isRedirectError(e)) {
                throw e
            }
            console.log(e)
            toast({
                title: 'Error',
                description: "Invalid credentials.",
                variant: 'destructive',
            })
        }

        // if (typeof user === 'string') {
        //     toast({
        //         title: 'Error',
        //         description: user,
        //         variant: 'destructive',
        //     })
        // } else {
        //     const tokens = { accessToken: user.accessToken, refreshToken: user.refreshToken };
        //     await fetch('/api/auth/set-cookies', {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json',
        //         },
        //         body: JSON.stringify(tokens),
        //     });
        //     reloadCart()
        //     console.log('Set up successfully');
        //     redirect(callbackUrl)
        // }
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
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Enter username"
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
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input
                                        type="password"
                                        placeholder="Enter password"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <div>
                        <Button type="submit">Sign In</Button>
                    </div>
                    <div className="text-sm">
                        By signing in, you agree to {APP_NAME}&apos;s{' '}
                        <Link href="/page/conditions-of-use">Conditions of Use</Link> and{' '}
                        <Link href="/page/privacy-policy">Privacy Notice.</Link>
                    </div>
                </div>
            </form>
        </Form>
    )
}
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
import {login, register} from "@/lib/api/user";
import {UserSignUpSchema} from "@/lib/validator";
import { zodResolver } from '@hookform/resolvers/zod'
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
    const callbackUrl = searchParams.get('callbackUrl') || '/'

    const form = useForm<IUserRegisterRequest>({
        resolver: zodResolver(UserSignUpSchema),
        defaultValues: signUpDefaultValues,
    })

    const {control, handleSubmit} = form

    const onSubmit = async (data: IUserRegisterRequest) => {
        const res = await register(data)
        if (typeof res === 'string') {
            toast({
                title: 'Error',
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
                    title: 'Error',
                    description: user,
                    variant: 'destructive',
                })
            } else {
                const tokens = { accessToken: user.accessToken, refreshToken: user.refreshToken };
                await fetch('/api/auth/set-cookies', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(tokens),
                });
                redirect(callbackUrl)
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
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder='Enter username' {...field} />
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
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input type="email" placeholder="Enter email address" {...field} />
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
                                <FormLabel>Phone number</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter phone number" {...field} />
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
                    <FormField
                        control={control}
                        name="confirmPassword"
                        render={({field}) => (
                            <FormItem className="w-full">
                                <FormLabel>Confirm Password</FormLabel>
                                <FormControl>
                                    <Input
                                        type="password"
                                        placeholder="Confirm Password"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <div>
                        <Button type='submit'>Sign Up</Button>
                    </div>
                    <div className='text-sm'>
                        By creating an account, you agree to {APP_NAME}&apos;s{' '}
                        <Link href='/page/conditions-of-use'>Conditions of Use</Link> and{' '}
                        <Link href='/page/privacy-policy'> Privacy Notice. </Link>
                    </div>
                    <Separator className='mb-4'/>
                    <div className='text-sm'>
                        Already have an account?{' '}
                        <Link className='link' href={`/sign-in?callbackUrl=${callbackUrl}`}>
                            Sign In
                        </Link>
                    </div>
                </div>
            </form>
        </Form>
    )
}
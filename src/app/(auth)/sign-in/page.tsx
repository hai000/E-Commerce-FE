import { Metadata } from 'next'
import Link from 'next/link'
import SeparatorWithOr from '@/components/shared/separator-or'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import CredentialsSignInForm from './credentials-signin-form'
import { Button } from '@/components/ui/button'
import { APP_NAME } from '@/lib/constants'
import {auth} from "@/lib/api/user";
import {Toaster} from "@/components/ui/toaster";
import {cookies} from "next/headers";
import {redirect} from "next/navigation";
export const metadata: Metadata = {
    title: 'Sign In',
}

export default async function SignIn(props: {
    searchParams: Promise<{
        callbackUrl: string
    }>
}) {
    const searchParams = await props.searchParams

    const { callbackUrl = '/' } = searchParams
    const cook = await cookies()
    const session = await auth(cook)
    if (session) {
        return redirect(callbackUrl)
    }

    return (
        <div className='w-full'>
            <Card>
                <CardHeader>
                    <CardTitle className='text-2xl'>Sign In</CardTitle>
                </CardHeader>
                <CardContent>
                    <div>
                        <CredentialsSignInForm />
                    </div>
                </CardContent>
            </Card>
            <SeparatorWithOr>New to {APP_NAME}?</SeparatorWithOr>
            <Toaster/>
            <Link href={`/sign-up?callbackUrl=${encodeURIComponent(callbackUrl)}`}>
                <Button className='w-full' variant='outline'>
                    Create your {APP_NAME} account
                </Button>
            </Link>
        </div>
    )
}
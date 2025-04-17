import { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import SignUpForm from './signup-form'
import {auth} from "@/lib/api/user";
import {cookies} from "next/headers";
import {Toaster} from "@/components/ui/toaster";
import {getILogin} from "@/lib/utils";

export const metadata: Metadata = {
    title: 'Sign Up',
}

export default async function SignUpPage(props: {
    searchParams: Promise<{
        callbackUrl: string
    }>
}) {
    const searchParams = await props.searchParams

    const { callbackUrl } = searchParams
    const cook = await cookies()
    const iLogin = getILogin(cook)
    const session = await auth(iLogin)
    if (session) {
        return redirect(callbackUrl || '/')
    }

    return (
        <div className='w-full'>
            <Card>
                <CardHeader>
                    <CardTitle className='text-2xl'>Create account</CardTitle>
                </CardHeader>
                <CardContent>
                    <SignUpForm />
                </CardContent>
                <Toaster/>
            </Card>
        </div>
    )
}
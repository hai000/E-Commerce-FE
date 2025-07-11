import { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import SignUpForm from './signup-form'
import {Toaster} from "@/components/ui/toaster";
import {auth} from "../../../../auth";
import {getTranslations} from "next-intl/server";

export const metadata: Metadata = {
    title: 'Sign Up',
}

export default async function SignUpPage(props: {
    searchParams: Promise<{
        callbackUrl: string
    }>
}) {
    const searchParams = await props.searchParams
    const t = await getTranslations()
    const { callbackUrl } = searchParams
    const session = await auth()
    if (session) {
        return redirect(callbackUrl || '/')
    }

    return (
        <div className='w-full'>
            <Card>
                <CardHeader>
                    <CardTitle className='text-2xl'>{t('Login.Create account')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <SignUpForm />
                </CardContent>
                <Toaster/>
            </Card>
        </div>
    )
}
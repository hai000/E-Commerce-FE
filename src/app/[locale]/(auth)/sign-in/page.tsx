import { Metadata } from 'next'
import Link from 'next/link'
import SeparatorWithOr from '@/components/shared/separator-or'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import CredentialsSignInForm from './credentials-signin-form'
import { Button } from '@/components/ui/button'
import { APP_NAME } from '@/lib/constants'
import {Toaster} from "@/components/ui/toaster";
import {redirect} from "next/navigation";
import {auth} from "../../../../auth";
import {getTranslations} from "next-intl/server";
export const metadata: Metadata = {
    title: 'Sign In',
}

export default async function SignIn(props: {
    searchParams: Promise<{
        callbackUrl: string
    }>
}) {
    const t = await getTranslations()
    const searchParams = await props.searchParams
    const { callbackUrl = '/' } = searchParams
    const session = await auth()
    if (session) {
        return redirect(callbackUrl)
    }
    return (
        <div className='w-full'>
            <Card>
                <CardHeader>
                    <CardTitle className='text-2xl'>{t('Login.Sign In')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div>
                        <CredentialsSignInForm />
                    </div>
                </CardContent>
            </Card>
            <SeparatorWithOr>{t('Login.New to')} {APP_NAME}?</SeparatorWithOr>
            <Toaster/>
            <Link href={`/sign-up?callbackUrl=${encodeURIComponent(callbackUrl)}`}>
                <Button className='w-full' variant='outline'>
                    {t('Login.Create your')} {APP_NAME} {t('Login.Account')}
                </Button>
            </Link>
        </div>
    )
}
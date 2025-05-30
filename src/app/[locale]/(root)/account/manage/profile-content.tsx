'use client'

import { useState } from 'react'
import { SessionProvider } from 'next-auth/react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {UpdateUserRequest} from "@/lib/request/user";
import {IUser} from "@/lib/response/user";
import {updateUser} from "@/lib/api/user";
import {DialogEditProfile} from "@/app/[locale]/(root)/account/manage/edit-profile";
import {Session} from "@auth/core/types";
import {toast} from "@/hooks/use-toast";
import {useTranslations} from "next-intl";


interface ProfileContentProps {
    user: IUser
    session: Session
}


export default function ProfileContent({ user: initialUser, session}: ProfileContentProps) {
    // eslint-disable-next-line
    const [user, setUser] = useState<IUser>(initialUser)
    const t = useTranslations()
    const PAGE_TITLE = t("Profile")
    const handleEditProfile = async (request: UpdateUserRequest) => {
        const response = await updateUser(session.accessToken, request)
        if (typeof response === 'string'){
            toast({
                title: t("Toast.Error"),
                description: response,
                variant: "destructive"
            })
        }else {
            toast({
                title: t("Toast.Success"),
                description: t('Update profile successfully'),
                variant: "success"
            })
        }

    }
    return (
        <SessionProvider session={session}>
            <div className='flex gap-2 '>
                <Link href='/account'>{t('Your Account')}</Link>
                <span>›</span>
                <span>{PAGE_TITLE}</span>
            </div>
            <h1 className='h1-bold py-4'>{PAGE_TITLE}</h1>
            <Card className='max-w-2xl '>
                <CardContent className='p-4 flex justify-between flex-wrap'>
                    <div>
                        <h3 className='font-bold'>{t('Full name')}</h3>
                        <p>{user.fullName}</p>
                    </div>
                </CardContent>
                <Separator />
                <CardContent className='p-4 flex justify-between flex-wrap'>
                    <div>
                        <h3 className='font-bold'>Email</h3>
                        <p>{user.email ?? t('None')}</p>
                    </div>
                </CardContent>
                <Separator />
                <CardContent className='p-4 flex justify-between flex-wrap'>
                    <div>
                        <h3 className='font-bold'>{t('Checkout.Phone number')}</h3>
                        <p>{user.phoneNumber ?? t('None')}</p>
                    </div>
                </CardContent>
                <Separator />
                <CardContent className='p-4 flex justify-between flex-wrap'>
                    <div>
                        <h3 className='font-bold'>{t('DOB')}</h3>
                        <p>{user.dateOfBirth ?? t('None')}</p>
                    </div>
                </CardContent>
                <Separator />
                <CardContent className='p-4 flex justify-between flex-wrap'>
                    <div>
                        <h3 className='font-bold'>{t('Gender')}</h3>
                        <p>{user.gender === 0 ? t('Male') :t('Female')}</p>
                    </div>
                </CardContent>
                <Separator />
                <CardContent className='p-4 flex justify-between flex-wrap'>
                    <div>
                        <h3 className='font-bold'>{t('User.Password')}</h3>
                        <p>************</p>
                    </div>
                </CardContent>
            </Card>
            <div className='mt-4 flex gap-2'>
                <DialogEditProfile handleEditProfile={handleEditProfile} user={user} />
            </div>
        </SessionProvider>
    )
}
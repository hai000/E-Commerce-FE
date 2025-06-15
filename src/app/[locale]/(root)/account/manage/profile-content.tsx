'use client'
import Link from 'next/link'
import {Card, CardContent} from '@/components/ui/card'
import {Separator} from '@/components/ui/separator'
import {UpdateUserRequest} from "@/lib/request/user";
import {IUser} from "@/lib/response/user";
import {DialogEditProfile} from "@/app/[locale]/(root)/account/manage/edit-profile";
import {useTranslations} from "next-intl";
import {useEffect, useState} from "react";
import {updateUser} from "@/lib/api/user";
import {toast} from "@/hooks/use-toast";

export default function ProfileContent({user}: {
    user: IUser,
}) {
    const t = useTranslations()
    const [currentUser, setCurrentUser] = useState<IUser>(user)
    useEffect(() => {
        setCurrentUser(user)
    },[user])
    const handleUpdateUser = async (request: UpdateUserRequest) => {
        const res = await updateUser(request)
        if (typeof res === "string") {
           toast({
                title: t("Toast.Error"),
                description: res,
                variant: "destructive"
           })
        } else {
            toast({
                title: t("Toast.Success"),
                description: t("UpdateProfileSuccess"),
                variant: "success"
            })
            setCurrentUser(res)
        }
    }
    // eslint-disable-next-line
    const PAGE_TITLE = t("Profile")
    return (
        <>
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
                        <p>{currentUser.fullName}</p>
                    </div>
                </CardContent>
                <Separator/>
                <CardContent className='p-4 flex justify-between flex-wrap'>
                    <div>
                        <h3 className='font-bold'>Email</h3>
                        <p>{currentUser.email ?? t('None')}</p>
                    </div>
                </CardContent>
                <Separator/>
                <CardContent className='p-4 flex justify-between flex-wrap'>
                    <div>
                        <h3 className='font-bold'>{t('Checkout.Phone number')}</h3>
                        <p>{currentUser.phoneNumber ?? t('None')}</p>
                    </div>
                </CardContent>
                <Separator/>
                <CardContent className='p-4 flex justify-between flex-wrap'>
                    <div>
                        <h3 className='font-bold'>{t('DOB')}</h3>
                        <p>{currentUser.dateOfBirth ?? t('None')}</p>
                    </div>
                </CardContent>
                <Separator/>
                <CardContent className='p-4 flex justify-between flex-wrap'>
                    <div>
                        <h3 className='font-bold'>{t('Gender')}</h3>
                        <p>{currentUser.gender === 0 ? t('Female') : t('Male')}</p>
                    </div>
                </CardContent>
                <Separator/>
                <CardContent className='p-4 flex justify-between flex-wrap'>
                    <div>
                        <h3 className='font-bold'>{t('User.Password')}</h3>
                        <p>**********</p>
                    </div>
                </CardContent>
            </Card>
            <div className='mt-4 flex gap-2'>
                <DialogEditProfile handleEditProfile={handleUpdateUser} user={user}/>
            </div>
        </>
    )
}
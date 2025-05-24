'use client'

import { useState } from 'react'
import { SessionProvider } from 'next-auth/react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {UpdateUserRequest} from "@/lib/request/user";
import {IUser} from "@/lib/response/user";
import {DialogEditProfile} from "@/app/(root)/account/manage/edit_profile";
import {Session} from "@auth/core/types";
import {updateUser} from "@/lib/api/user";

interface ProfileContentProps {
    user: IUser
    session: any
}

const PAGE_TITLE = "Profile"

export default function ProfileContent({ user: initialUser, session }: ProfileContentProps) {
    const [user, setUser] = useState<IUser>(initialUser)

    const handleEditProfile = async (request: UpdateUserRequest) => {
        try {
            const response = await updateUser(session.accessToken, request)
        } catch (error) {

        }
    }

    return (
        <SessionProvider session={session}>
            <div className='flex gap-2 '>
                <Link href='/account'>Your Account</Link>
                <span>›</span>
                <span>{PAGE_TITLE}</span>
            </div>
            <h1 className='h1-bold py-4'>{PAGE_TITLE}</h1>
            <Card className='max-w-2xl '>
                <CardContent className='p-4 flex justify-between flex-wrap'>
                    <div>
                        <h3 className='font-bold'>Full name</h3>
                        <p>{user.fullName}</p>
                    </div>
                </CardContent>
                <Separator />
                <CardContent className='p-4 flex justify-between flex-wrap'>
                    <div>
                        <h3 className='font-bold'>Email</h3>
                        <p>{user.email ?? 'None'}</p>
                    </div>
                </CardContent>
                <Separator />
                <CardContent className='p-4 flex justify-between flex-wrap'>
                    <div>
                        <h3 className='font-bold'>Phone number</h3>
                        <p>{user.phoneNumber ?? 'None'}</p>
                    </div>
                </CardContent>
                <Separator />
                <CardContent className='p-4 flex justify-between flex-wrap'>
                    <div>
                        <h3 className='font-bold'>DOB</h3>
                        <p>{user.dateOfBirth ?? 'None'}</p>
                    </div>
                </CardContent>
                <Separator />
                <CardContent className='p-4 flex justify-between flex-wrap'>
                    <div>
                        <h3 className='font-bold'>Gender</h3>
                        <p>{user.gender === 0 ? 'Nam' : 'Nữ'}</p>
                    </div>
                </CardContent>
                <Separator />
                <CardContent className='p-4 flex justify-between flex-wrap'>
                    <div>
                        <h3 className='font-bold'>Password</h3>
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
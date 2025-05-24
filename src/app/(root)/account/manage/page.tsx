import { Metadata } from 'next'
import {auth} from "@/app/auth";
import {getInfo} from "@/lib/api/user";
import {IUser} from "@/lib/response/user";
import {redirect} from "next/navigation";
import ProfileContent from "@/app/(root)/account/manage/profile_content";

const PAGE_TITLE = 'Login & Security'
export const metadata: Metadata = {
    title: PAGE_TITLE,
}
export default async function ProfilePage() {
    const session = await auth()
    const user = await getInfo({accessToken: session?.accessToken as string})

    if (typeof user === "string") {
        redirect("/sign-in")
    }

    return (
        <div className='mb-24'>
            <ProfileContent user={user} session={session} />
        </div>
    )
}

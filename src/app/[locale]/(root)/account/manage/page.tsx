import { Metadata } from 'next'
import {getInfo, updateUser} from "@/lib/api/user";
import {redirect} from "next/navigation";
import ProfileContent from "@/app/[locale]/(root)/account/manage/profile-content";
import {auth} from "@/auth";

const PAGE_TITLE = 'Login & Security'
export const metadata: Metadata = {
    title: PAGE_TITLE,
}
export default async function ProfilePage() {
    const session = await auth()
    if (session == null) {
        redirect("/sign-in")
    }
    let user = await getInfo({accessToken: session?.accessToken as string})
    if (typeof user === "string") {
        redirect("/sign-in")
    }
    return (
        <div className='mb-24'>
            <ProfileContent user={user}/>
        </div>
    )
}

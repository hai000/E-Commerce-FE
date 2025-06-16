import type { Metadata } from "next"
import { getUserById } from "@/lib/api/user"
import UserEditPageClient from "@/app/[locale]/dashboard/customers/edit/[id]/user-edit-client";
import {notFound} from "next/navigation";

export const metadata: Metadata = {
    title: "Edit User",
    description: "Edit user information",
}

export default async function UserEditPage(props: {
    params: {
        id: string
    }
}) {
    const { id } = props.params
    try {
        const user = await getUserById(id)
        if (!user || typeof user === "string") {
            notFound()
        }

        return <UserEditPageClient user={user} />
    } catch (error) {
        notFound()
    }
}

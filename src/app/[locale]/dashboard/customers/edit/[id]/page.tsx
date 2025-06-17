import type { Metadata } from "next"
import { getUserById } from "@/lib/api/user"
import UserEditPageClient from "@/app/[locale]/dashboard/customers/edit/[id]/user-edit-client";
import {notFound} from "next/navigation";

export const metadata: Metadata = {
    title: "Edit User",
    description: "Edit user information",
}

export default async function UserEditPage(props: {
    params: Promise<{ id: string }>
}) {
    const { id } = await props.params
    try {
        const user = await getUserById(id)
        if (!user || typeof user === "string") {
            notFound()
        }

        return <UserEditPageClient user={user} />
    } catch (
        // eslint-disable-next-line
        error) {
        notFound()
    }
}

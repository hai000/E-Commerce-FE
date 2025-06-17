import type { Metadata } from "next"
import { notFound } from "next/navigation"
import {getUserById} from "@/lib/api/user";
import UserDetailPageClient from "@/app/[locale]/dashboard/customers/[id]/user-detail-client";

export const metadata: Metadata = {
    title: "User Details",
    description: "View detailed user information",
}

export default async function UserDetailPage(props: {
    params: Promise<{ id: string }>
}) {
    const { id } = await props.params
    if (!id) {
        notFound()
    }
    try {
        const user = await getUserById(id)
        console.log("User Detail Page - User:", user)
        if (!user || typeof user === "string") {
            notFound()
        }

        return <UserDetailPageClient user={user} />
    } catch (error) {
        console.error("Error fetching user:", error)
        notFound()
    }
}

import type { Metadata } from "next"
import { PAGE_SIZE } from "@/lib/constants"
import UserManagementPageClient from "@/app/[locale]/dashboard/customers/user-management-client";
import {getAllUsers} from "@/lib/api/user";

export const metadata: Metadata = {
    title: "User Management",
    description: "Manage users and their information",
}

export default async function UserManagementPage(props: {
    searchParams: {
        search?: string
        page?: string
        size?: string
        role?: string
    }
}) {
    const searchParams = await props.searchParams;
    const { search = "", page = "1", size = PAGE_SIZE.toString(), role = "" } = searchParams;

    const users = await getAllUsers({
        search,
        page: Number.parseInt(page),
        size: Number.parseInt(size),
        role,
    })
    console.log("users", users)
    return (
        <UserManagementPageClient
            usersWithPage={users}
        />
    )
}

import type { Metadata } from "next"
import UserCreatePageClient from "@/app/[locale]/dashboard/customers/create/create-client";

export const metadata: Metadata = {
    title: "Create User",
    description: "Create a new user account",
}

export default function UserCreatePage() {
    return <UserCreatePageClient />
}

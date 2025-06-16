import type { Metadata } from "next"
import AddressCreatePageClient from "@/app/[locale]/(root)/account/addresses/create/add-address-client";


export const metadata: Metadata = {
    title: "Thêm địa chỉ mới",
    description: "Thêm địa chỉ giao hàng mới",
}

export default function AddressCreatePage() {
    return <AddressCreatePageClient />
}

import type { Metadata } from "next"
import {getMyAddresses} from "@/lib/api/address";
import AddressManagementPageClient from "@/app/[locale]/(root)/account/addresses/addresses-client";

export const metadata: Metadata = {
    title: "Quản lý địa chỉ",
    description: "Xem và chỉnh sửa địa chỉ giao hàng",
}

export default async function AddressManagementPage() {
    const addresses = await getMyAddresses()

    return (
        <AddressManagementPageClient
            addressesI={
               typeof addresses ==='string'?[]: addresses
            }
        />
    )
}

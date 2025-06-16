import {notFound} from "next/navigation"
import {getMyAddresses} from "@/lib/api/address";
import AddressEditPageClient from "@/app/[locale]/(root)/account/addresses/edit/[id]/address-edit-client";

export default async function AddressEditPage(props: {
    params: {
        id: string
    }
}) {
    const {id} = await props.params
    let address
    if (!id) {
        notFound()
    }
    try {
        address = await getMyAddresses()
        if (!address || typeof address === "string") {
            notFound()
        }else {
            const foundAddress = address.find((addr) => addr.id == id)
            if (!foundAddress) {
                notFound()
            }
            address = foundAddress
            return <AddressEditPageClient address={address}/>
        }
    } catch (error) {
        console.error("Error fetching address:", error)
        notFound()
    }
}

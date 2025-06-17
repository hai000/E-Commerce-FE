import {notFound} from "next/navigation"
import {getMyAddresses} from "@/lib/api/address";
import AddressEditPageClient from "@/app/[locale]/(root)/account/addresses/edit/[id]/address-edit-client";

export default async function AddressEditPage(props: {
    params: Promise<{
        id: string
    }>
}) {
    const params = await props.params
    const { id } = params
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
        // eslint-disable-next-line
    } catch (error) {
        console.error("Error fetching address:", error)
        notFound()
    }
}

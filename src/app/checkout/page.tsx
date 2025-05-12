import {Metadata} from "next";
import { redirect } from 'next/navigation'
import CheckoutForm from "@/app/checkout/checkout-form";
import {getMyAddresses} from "@/lib/api/address";
import {auth} from "@/app/auth";

export const metadata: Metadata = {
    title: 'Checkout',
}
export default async function CheckoutPage() {
    const session = await auth()
    if (!session) {
        redirect('/sign-in?callbackUrl=/checkout');
    }
    const allAddress = await getMyAddresses()

    return (<CheckoutForm allAddress={typeof allAddress === "string"? undefined : allAddress}/>)
}
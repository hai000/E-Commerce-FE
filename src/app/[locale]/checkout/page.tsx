import {Metadata} from "next";
import { redirect } from 'next/navigation'
import {auth} from "@/auth";
import CheckoutForm from "@/app/[locale]/checkout/checkout-form";
import {AVAILABLE_PAYMENT_METHODS} from "@/lib/constants";

export const metadata: Metadata = {
    title: 'Checkout',
}
export default async function CheckoutPage() {
    const session = await auth()
    if (!session) {
        redirect('/sign-in?callbackUrl=/checkout');
    }
    const paymentMethods  = await AVAILABLE_PAYMENT_METHODS()
    return (<CheckoutForm paymentMethods={paymentMethods} />)
}
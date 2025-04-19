import {Metadata} from "next";
import { redirect } from 'next/navigation'
import {auth} from "@/lib/api/user";
import {cookies} from "next/headers";
import {getILogin} from "@/lib/utils";
import CheckoutForm from "@/app/checkout/checkout-form";
export const metadata: Metadata = {
    title: 'Checkout',
}
export default async function CheckoutPage() {
    const cook = await cookies()
    const iLogin = getILogin(cook)
    const session = await auth(iLogin)
    if (!session) {
        redirect('/sign-in?callbackUrl=/checkout');
    }
    return <CheckoutForm/>
}
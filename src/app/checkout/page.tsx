import {Metadata} from "next";
import { redirect } from 'next/navigation'
import {auth} from "@/lib/api/user";
import {cookies} from "next/headers";
export const metadata: Metadata = {
    title: 'Checkout',
}
export default async function CheckoutPage() {
    const cook = await cookies()
    const session = await auth(cook)
    if (!session) {
        redirect('/sign-in?callbackUrl=/checkout');
    }
    return <div>Checkout Form</div>
}
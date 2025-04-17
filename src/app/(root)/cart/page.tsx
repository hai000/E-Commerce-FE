import React from "react";
import CartPageClient from "@/app/(root)/cart/cart-client";
import {cookies} from "next/headers";
import {getILogin} from "@/lib/utils";
import {auth} from "@/lib/api/user";
import {redirect} from "next/navigation";

export default async function CartPage() {
    const cook = await cookies()
    const iLogin = getILogin(cook)
    const session = await auth(iLogin)

    if (!session) {
        redirect('/sign-in?callbackUrl=/cart');
    }
    return <CartPageClient/>
}
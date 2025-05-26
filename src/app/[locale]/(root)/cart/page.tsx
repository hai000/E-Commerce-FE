import React from "react";
import {redirect} from "next/navigation";
import CartPageClient from "@/app/[locale]/(root)/cart/cart-client";
import {auth} from "@/auth";

export default async function CartPage() {
    const session = await auth()
    if (!session) {
        redirect('/sign-in?callbackUrl=/cart');
    }
    return <CartPageClient/>
}
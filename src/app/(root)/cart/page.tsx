import React from "react";
import CartPageClient from "@/app/(root)/cart/cart-client";
import {redirect} from "next/navigation";
import {auth} from "@/app/auth";

export default async function CartPage() {
    const session = await auth()
    if (!session) {
        redirect('/sign-in?callbackUrl=/cart');
    }
    return <CartPageClient/>
}
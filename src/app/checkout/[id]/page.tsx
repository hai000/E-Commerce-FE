import { notFound } from 'next/navigation'
import React from 'react'
import PaymentForm from './payment-form'
import {getOrderById} from "@/lib/api/order";
import {auth} from "@/app/auth";

export const metadata = {
    title: 'Payment',
}

const CheckoutPaymentPage = async (props: {
    params: Promise<{
        id: string
    }>
}) => {
    const params = await props.params

    const { id } = params

    const order = await getOrderById(id)
    if (typeof order === 'string') notFound()

    const session = await auth()

    return (
        <PaymentForm
            order={order}
            paypalClientId={process.env.PAYPAL_CLIENT_ID || 'sb'}
            isAdmin={session?.user?.role === 'ADMIN' || false}
        />
    )
}

export default CheckoutPaymentPage
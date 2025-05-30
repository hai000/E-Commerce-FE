import { notFound } from 'next/navigation'
import React from 'react'
import OrderDetailsForm from '@/components/shared/order/order-details-form'
import Link from 'next/link'
import { formatId } from '@/lib/utils'
import {getOrderById} from "@/lib/api/order";
import {auth} from "@/auth";
import {getTranslations} from "next-intl/server";

export async function generateMetadata(props: {
    params: Promise<{ id: string }>
}) {
    const params = await props.params

    return {
        title: `Order ${formatId(params.id)}`,
    }
}

export default async function OrderDetailsPage(props: {
    params: Promise<{
        id: string
    }>
}) {
    const params = await props.params

    const { id } = params
    const session = await auth()
    const order = await getOrderById(id)
    if (typeof order === 'string') notFound()
    const t = await getTranslations()
    return (
        <>
            <div className='flex gap-2'>
                <Link href='/account'>{t('Your Account')}</Link>
                <span>›</span>
                <Link href='/account/orders'>{t('Your Orders')}</Link>
                <span>›</span>
                <span>{t('Order.Order')} {order.orderId}</span>
            </div>
            <h1 className='h1-bold py-4'>{t('Order.Order')} {order.orderId}</h1>
            <OrderDetailsForm
                order={order}
                isAdmin={session?.user?.role === 'ADMIN' || false}
            />
        </>
    )
}
'use server'
import {callApiToArray, callApiToArrayWithPage, callApiToObject, generateHeaderAccessToken, round2} from '../utils'
import {CartItem} from "@/lib/response/cart";
import {Order} from "@/lib/response/order";
import {CreateOrderRequest} from "@/lib/request/order";
import {HOST_API, PAGE_SIZE, POST_METHOD} from "@/lib/constants";
import {paypal} from "@/lib/paypal";
import {revalidatePath} from "next/cache";
import {auth} from "@/auth";
import {getTranslations} from "next-intl/server";

export async function createMyOrder(createOrderRequest: CreateOrderRequest) {
    const t = await getTranslations("Product")
    const session = await auth()
    if (!session) {
        return t('Session timeout');
    }
    return callApiToObject<Order>({
        url: '/identity/orders',
        method: POST_METHOD,
        data: createOrderRequest,
        headers: generateHeaderAccessToken(session)
    })
}

export async function getAllOrders() {
    return callApiToArray<Order>({url: '/identity/orders'})
}

export async function getMyOrders({
                                      limit,
                                      page,
                                  }: {
    limit?: number
    page: number
}) {
    limit = limit || PAGE_SIZE
    const t = await getTranslations("Product")
    const session = await auth()
    if (!session) {
        return t('Session timeout');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const skipAmount = (Number(page) - 1) * limit
    return callApiToArrayWithPage<Order>({url: `/identity/orders/myOrders?page=${page}&size=${limit}`, headers: generateHeaderAccessToken(session)})
}

export async function getOrderById(orderId: string) {
    return callApiToObject<Order>({url: `/identity/orders/${orderId}`})
}

export async function createPayPalOrder(orderId: string) {
    const t = await getTranslations("Order")
    try {
        const res = await fetch(`${HOST_API}/identity/payment/paypal/create-order?orderId=${orderId}`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
        });
        const data = await res.json()
        return {
            success: true,
            message: t('PayPal order created successfully'),
            data: data.orderId,
        }
        // const orderRes = await getOrderById(orderId);
        // if (typeof orderRes !== "string") {
        //     const paypalOrder = await paypal.createOrder(orderRes.totalPrice, orderId)
        //     return {
        //         success: true,
        //         message: t('PayPal order created successfully'),
        //         data: paypalOrder.id,
        //     }
        // } else {
        //     throw new Error(t('Order not found'))
        // }
    } catch (err) {
        return {success: false, message: err}
    }
}

export async function approvePayPalOrder(
    orderId: string,
    data: { orderID: string }
) {
    const t = await getTranslations("Order")
    try {
        const captureData = await paypal.capturePayment(data.orderID)
        if (
            !captureData ||
            captureData.result != 'COMPLETED'
        ){
            throw new Error(t('Error in paypal payment'))
        }
        revalidatePath(`/account/orders/${orderId}`)
        return {
            success: true,
            message: t('Your order has been successfully paid by PayPal'),
        }
    } catch (err) {
        return {success: false, message: err}
    }
}


export const calcDeliveryDateAndPrice = async ({
                                                   items,
                                                   shippingPrice,
                                                   deliveryDateIndex
                                               }: {
    items: CartItem[],
    shippingPrice: number,
    deliveryDateIndex: number

}) => {
    const itemsPrice = items.reduce((prePrice, item) => item.isChecked ? prePrice + item.cartItemQuantity * item.price * (100-item.discount)/100 : 0, 0)
    const totalPrice = round2(
        itemsPrice +
        (shippingPrice ? round2(shippingPrice) : 0)
    )
    return {
        deliveryDateIndex,
        itemsPrice,
        shippingPrice,
        totalPrice: totalPrice,
    }
}
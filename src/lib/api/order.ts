import { round2 } from '../utils'
import { FREE_SHIPPING_MIN_PRICE } from '../constants'
import {CartItem} from "@/lib/response/cart";
import {ShippingAddress} from "@/lib/request/location";


export const calcDeliveryDateAndPrice = async ({
                                                   items,
                                                   shippingPrice,
                                                   deliveryDateIndex
                                               }: {
    items: CartItem[],
    shippingPrice: number,
    deliveryDateIndex: number

}) => {
    const itemsPrice = items.reduce((prePrice, item) => item.isChecked? prePrice + item.cartItemQuantity*item.price: 0, 0)
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
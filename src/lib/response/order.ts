import {Address, InfoShippingAddress} from "@/lib/response/address";
import {IProductColor, IProductSize} from "@/lib/response/product";

export interface Order {
    orderId: string,
    orderUser: OrderUser,
    receiverAddress: Address
    deliveryMethod: InfoShippingAddress,
    orderItems: OrderItem[]
    status: number
    productDecrease: number
    shipDecrease: number
    totalPrice: number
    totalPayment: number
    createdAt: Date
    updatedAt: Date
}
export interface OrderItem {
    productId: string,
    productName: string,
    productImages: string[],
    color: IProductColor
    size: IProductSize
    originalPrice: number
    discount: number
    quantity: number
    createdAt: Date
    updatedAtL: Date
}
export interface OrderUser{
    id: string,
    username: string,
    phoneNumber: string,
    email: string,
    fullName: string,
}
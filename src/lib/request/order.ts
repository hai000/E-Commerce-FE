import {InfoShippingAddress} from "@/lib/response/address";

export interface CreateOrderRequest{
    cartItemIds: string[]
    addressId: string,
    deliveryMethod: InfoShippingAddress
    freeshipVcId: string
    productVcId: string
}
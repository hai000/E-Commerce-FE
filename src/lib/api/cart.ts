'use server'
import {callApiGetStatus, callApiToObject, generateHeaderAccessToken} from "@/lib/utils";
import {Cart, CartItem} from "@/lib/response/cart";
import {DELETE_METHOD, POST_METHOD, PUT_METHOD} from "@/lib/constants";
import {auth} from "@/app/auth";

export async function getMyCart() {
    const session = await auth()
    if (!session) {
        return 'Session timeout';
    }
    return await callApiToObject<Cart>({url:'/identity/carts/myCart',headers: generateHeaderAccessToken(session)});
}
export async function updateCartItem(data: {
    cartItemId: string,
    quantity: number
}) {
    const session = await auth()
    if (!session) {
        return 'Session timeout';
    }
    return await callApiToObject<CartItem>({url:`/identity/carts/items?cartItemId=${data.cartItemId}&quantity=${data.quantity}`,method:PUT_METHOD,headers: generateHeaderAccessToken(session)});
}
export async function deleteCartItem(cartItemId:string) {
    const session = await auth()
    if (!session) {
        return 'Session timeout';
    }
    return callApiGetStatus({url: `/identity/carts/items/${cartItemId}`,method: DELETE_METHOD, headers: generateHeaderAccessToken(session)});
}
export async function addToCart(data: {
    productId: string,
    productSize:string,
    productColor:string,
    quantity:string,
}) {
    const session = await auth()
    if (!session) {
        return 'Session timeout';
    }
    return callApiToObject<CartItem>({url:'/identity/carts/items',method:POST_METHOD,data: data,headers: generateHeaderAccessToken(session)});
}

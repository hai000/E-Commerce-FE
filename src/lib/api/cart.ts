import {callApiGetStatus, callApiToArray, callApiToObject, generateHeaderAccessToken} from "@/lib/utils";
import {Cart, CartItem} from "@/lib/response/cart";
import {ILogin} from "@/lib/response/login";
import {DELETE_METHOD, POST_METHOD, PUT_METHOD} from "@/lib/constants";

export async function getMyCart(request:ILogin) {
    return callApiToObject<Cart>({url:'/identity/cart/getMyCart',headers: generateHeaderAccessToken(request)});
}
export async function updateCartItem(request:ILogin,data: {
    cartItemId: string,
    quantity: number
}) {
    return callApiToObject<CartItem>({url:`/identity/cart/updateQuantity?cartItemId=${data.cartItemId}&quantity=${data.quantity}`,method:PUT_METHOD,headers: generateHeaderAccessToken(request)});
}
export async function deleteCartItem(request:ILogin, cartItemId:string) {
    return callApiGetStatus({url: `/identity/cart/deleteItem/${cartItemId}`,method: DELETE_METHOD, headers: generateHeaderAccessToken(request)});
}
export async function addToCart(request:ILogin, data: {
    productId: string,
    productSize:string,
    productColor:string,
    quantity:string,
}) {
    return callApiToObject<CartItem>({url:'/identity/cart/addItem',method:POST_METHOD,data: data,headers: generateHeaderAccessToken(request)});
}

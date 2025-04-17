import {cookies} from "next/headers";
import {getILogin} from "@/lib/utils";
import {addToCart, deleteCartItem, getMyCart, updateCartItem} from "@/lib/api/cart";
import {ILogin} from "@/lib/response/login";
import {NextResponse} from "next/server";

export async function POST(request: Request) {
    const { cartItemId,productId, quantity, productColor, productSize,action } = await request.json();
    const cook = await cookies()
    const iLogin = getILogin(cook) as ILogin;
    let res;
    if (action == 'addItem') {
        res = await addToCart(iLogin, {
            productId: productId,
            quantity: quantity,
            productColor: productColor,
            productSize: productSize
        })

    }else if (action == 'getCart') {
        res = await getMyCart(iLogin)
    }else if (action == 'deleteItem') {
        res = await  deleteCartItem(iLogin,cartItemId)
    }else if (action == 'updateItem') {
        res = await updateCartItem(iLogin,{
            cartItemId: cartItemId,
            quantity: quantity,
        })
    }
    return NextResponse.json(res);

}
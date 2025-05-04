import {cookies} from "next/headers";
import {getILogin} from "@/lib/utils";
import {ILogin} from "@/lib/response/login";
import {addToCart} from "@/lib/api/cart";
import {NextResponse} from "next/server";
import {getAllProduct} from "@/lib/api/product";

export async function POST(request: Request) {
    const { categoryId,action,} = await request.json();
    const cook = await cookies()
    const iLogin = getILogin(cook) as ILogin;
    let res;
    return NextResponse.json(res);
}
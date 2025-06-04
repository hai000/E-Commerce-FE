'use server'
import {callApiToArray, callApiToObject} from "@/lib/utils";
import {IProductDetail} from "@/lib/response/product";
import {PUT_METHOD} from "@/lib/constants";

export async function getProductDetailById({productId}: {productId: string}) {
    return await callApiToArray<IProductDetail>({url: `/identity/productDetails/product/${productId}`})
}
export async function updateProductDetail(data:{
    productDetailId: string,
    discount: number,
    price: number
}) {
    return await callApiToObject<IProductDetail>({
        url: `/identity/productDetails`,
        method: PUT_METHOD,
        data: data,
    });
}
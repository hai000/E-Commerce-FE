import {callApiToArray} from "@/lib/utils";
import {IProductDetail} from "@/lib/response/product";

export async function getProductDetailById({productId}: {productId: string}) {
    return await callApiToArray<IProductDetail>({url: `/identity/productDetails/product/${productId}`})
}
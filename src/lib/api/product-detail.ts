'use server'
import {callApiToArray, callApiToObject, generateHeaderAccessToken} from "@/lib/utils";
import {IProductDetail} from "@/lib/response/product";
import {PUT_METHOD} from "@/lib/constants";
import {auth} from "@/auth";
import {getTranslations} from "next-intl/server";

export async function getProductDetailById({productId}: { productId: string }) {
    return await callApiToArray<IProductDetail>({url: `/identity/productDetails/product/${productId}`})
}

export async function getProductDetailByIdAndSizeId({
                                                        productId,
                                                        sizeId
                                                    }: {
    productId: string,
    sizeId: string
}) {
    return await callApiToArray<IProductDetail>({
        url: `/identity/productDetails/product/${productId}/size/${sizeId}`
    });
}

export async function getProductDetailByIdAndColorId({
                                                         productId,
                                                         colorId
                                                     }: {
    productId: string,
    colorId: string
}) {
    return await callApiToArray<IProductDetail>({
        url: `/identity/productDetails/product/${productId}/color/${colorId}`
    });
}

export async function getProductDetailByIdAndColorIdAndSizeId({
                                                                  productId,
                                                                  colorId,
                                                                  sizeId
                                                              }: {
    productId: string,
    colorId: string,
    sizeId: string
}) {
    return await callApiToArray<IProductDetail>({
        url: `/identity/productDetails/product/${productId}/color/${colorId}/size/${sizeId}`
    });
}

export async function updateProductDetail(data: {
    productDetailId: string,
    discount: number,
    price: number
}) {
    const t = await getTranslations()
    const session = await auth()
    if (!session || !session.accessToken) {
        return t('Session timeout')
    }
    return await callApiToObject<IProductDetail>({
        url: `/identity/productDetails`,
        method: PUT_METHOD,
        headers: generateHeaderAccessToken(session),
        data: data,
    });
}
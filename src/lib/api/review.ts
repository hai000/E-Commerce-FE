'use server'
import {callApiToObject, generateHeaderAccessToken} from "@/lib/utils";
import {ReviewAddRequest} from "@/lib/request/review";
import {PAGE_SIZE, POST_METHOD} from "@/lib/constants";
import {Review} from "@/lib/response/review";
import {auth} from "@/auth";
import {getTranslations} from "next-intl/server";

export async function addReview(review: ReviewAddRequest) {
    const session = await auth()
    if (session === null) {
        const t = await getTranslations()
        return t('Session timeout');
    }
    return callApiToObject<Review>({url:'/identity/productReview',data: review,method: POST_METHOD,headers: generateHeaderAccessToken(session)})
}
export async function getProductReviews(productId: string,page = 1,pageSize?: number): Promise<ProductReview> {
    const quantity = pageSize?? PAGE_SIZE;
    const data = await callApiToObject<ProductReview>({url: `/identity/productReview/product/${productId}?page=${page}&quantity=${quantity}`});

    if (typeof data === "string") {
        return {
            error: data,
            data: [],
            totalItem: 0,
            totalPage: 0
        }
    }else {
        return {...data,
        totalPage: Math.ceil(data.totalItem/page)
        };
    }
}

export interface ProductReview {
    error?: string
    data: Review[]
    totalItem: number
    totalPage: number
}
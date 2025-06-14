'use server';
import {ProductImportAddRequest} from "@/lib/request/product-import";
import {callApiToObject, generateHeaderAccessToken} from "@/lib/utils";
import {ProductImport} from "@/lib/response/product-import";
import {POST_METHOD} from "@/lib/constants";
import {auth} from "@/auth";

export async function addProductImport(data: ProductImportAddRequest) {
    const session = await auth()
    if (!session) {
        return 'Session timeout';
    }
    return await callApiToObject<ProductImport>({url: '/identity/productImports', method: POST_METHOD, data: data,headers: generateHeaderAccessToken(session)});
}
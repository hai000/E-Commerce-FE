/* eslint-disable @typescript-eslint/no-unused-vars */
'use server'

import {IProduct, IProductColor, IProductSize} from "@/lib/response/product";
import {products_fake} from "@/lib/data";
import {PAGE_SIZE, POST_METHOD, PUT_METHOD} from "@/lib/constants";
import {callApiToArray, callApiToObject} from "@/lib/utils";
import {AddColorRequest, AddSizeRequest} from "@/lib/request/product";
export async function getAllProduct() {
   return callApiToArray<IProduct>({url: '/identity/products'})
}
export async function getProductsForCard({
                                             tag,
                                             limit = 4,
                                         }: {
    tag: string
    limit?: number
}) {

    tag = tag || "";
    limit = limit || 10;
    const products = {
        name: 1,
        href: {$concat: ['/product/', '$slug']},
        image: {$arrayElemAt: ['$images', 0]},
    }

    return JSON.parse(JSON.stringify(products)) as {
        name: string
        href: string
        image: string
    }[]
}
// export async function getProductsByTag({
//                                            tag,
//                                            limit = 10,
//                                        }: {
//     tag: string
//     limit?: number
// }) {
//     const products = products_fake
//     return JSON.parse(JSON.stringify(products)) as IProduct[]
// }
export async function updateProduct(product?:IProduct) {
    if (!product) {
        return "Product can't missing"
    }
    console.log(JSON.stringify(product));
    const updateProductRequest = {
        id: product.id,
        name: product.name,
        slug: product.slug,
        categoryId: product.category.id,
        defaultPrice: product.defaultPrice,
        defaultDiscount: product.defaultDiscount,
        published: product.published,
        description: product.description,
        brand: product.brand,
    }
    return callApiToObject<IProduct>({url: '/identity/products/update',data: updateProductRequest,method: PUT_METHOD})
}
export async function getProductById(id: string) {
    return callApiToObject<IProduct>({url: `/identity/products/${id}`})
}
export async function addColorForProduct(productId: string, colorRequests: AddColorRequest[]) {
    return callApiToArray<IProductColor>({url: `/identity/products/addColors/${productId}`,data: colorRequests,method: POST_METHOD})
}
export async function addSizeForProduct(productId: string, sizeRequests: AddSizeRequest[]) {
    return callApiToArray<IProductSize>({url: `/identity/products/addSizes/${productId}`,data: sizeRequests,method: POST_METHOD})
}
export async function getRelatedProductsByCategory({
                                                       // @typescript-eslint/no-unused-vars
                                                       categoryId,
                                                       // @typescript-eslint/no-unused-vars
                                                       productId,
                                                       limit = PAGE_SIZE,
                                                       // @typescript-eslint/no-unused-vars
                                                       page = 1,
                                                   }: {
    categoryId: string
    productId: string
    limit?: number
    page: number
}) {
    // const skipAmount = (Number(page.tsx) - 1) * limit
    // const conditions = {
    //     isPublished: true,
    //     categoryId,
    //     _id: { $ne: productId },
    // }
    const products = [products_fake[0]]
    const productsCount = products_fake.length
    return {
        data: JSON.parse(JSON.stringify(products)) as IProduct[],
        totalPages: Math.ceil(productsCount / limit),
    }
}
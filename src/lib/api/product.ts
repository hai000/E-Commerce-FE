'use server'

import {IProduct} from "@/lib/response/product";
import {products_fake} from "@/lib/data";
import {PAGE_SIZE} from "@/lib/constants";

export async function getProductsForCard({
                                             tag,
                                             limit = 4,
                                         }: {
    tag: string
    limit?: number
}) {
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
export async function getProductsByTag({
                                           tag,
                                           limit = 10,
                                       }: {
    tag: string
    limit?: number
}) {
    const products = products_fake
    return JSON.parse(JSON.stringify(products)) as IProduct[]
}

export async function getProductBySlug(slug: string) {
    const product = products_fake[0]
    if (!product) throw new Error('Product not found')
    return JSON.parse(JSON.stringify(product)) as IProduct
}
// GET RELATED PRODUCTS: PRODUCTS WITH SAME CATEGORY
export async function getRelatedProductsByCategory({
                                                       categoryId,
                                                       productId,
                                                       limit = PAGE_SIZE,
                                                       page = 1,
                                                   }: {
    categoryId: string
    productId: string
    limit?: number
    page: number
}) {
    const skipAmount = (Number(page) - 1) * limit
    const conditions = {
        isPublished: true,
        categoryId,
        _id: { $ne: productId },
    }
    const products = [products_fake[0]]
    const productsCount = products_fake.length
    return {
        data: JSON.parse(JSON.stringify(products)) as IProduct[],
        totalPages: Math.ceil(productsCount / limit),
    }
}
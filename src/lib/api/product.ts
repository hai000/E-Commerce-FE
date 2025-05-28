/* eslint-disable @typescript-eslint/no-unused-vars */
'use server'

import {IProduct, IProductColor, IProductSize} from "@/lib/response/product";
import {products_fake} from "@/lib/data";
import {PAGE_SIZE, POST_METHOD, PUT_METHOD} from "@/lib/constants";
import {callApiToArray, callApiToObject} from "@/lib/utils";
import {AddColorRequest, AddProductRequest, AddSizeRequest} from "@/lib/request/product";
import {getTranslations} from "next-intl/server";

export async function getAllProductByFilter(filter: Filter) {
    filter.limit = filter.limit || PAGE_SIZE;

    let products: IProduct[] = [];
    if (filter.query && filter.query !== 'all') {
        const resp = await getProductsByName(filter.query);
        if (typeof resp !== 'string') {
            products = resp;
        }
    } else if (filter.category && filter.category !== 'all') {
        const resp = await getProductsByCategory(filter.category);
        if (typeof resp !== 'string') {
            products = resp;
        }
    } else {
        const resp = await getAllProduct();
        if (typeof resp !== 'string') {
            products = resp;
        }
    }
    products = applyClientFilters(products, filter);
    products = applySorting(products, filter.sort);
    const countProducts = products.length;
    const startIndex = ((filter.page || 1) - 1) * filter.limit;
    products = products.slice(startIndex, startIndex + filter.limit);

    return {
        products: products as IProduct[],
        totalPages: Math.ceil(countProducts / filter.limit),
        totalProducts: countProducts,
        from: filter.limit * (Number(filter.page) - 1) + 1,
        to: filter.limit * (Number(filter.page) - 1) + products.length,
    }
}

function applyClientFilters(products: IProduct[], filter: Filter): IProduct[] {
    let filtered = [...products];

    if (filter.tag && filter.tag !== 'all') {
        filtered = filtered.filter(product =>
            product.tags?.includes(filter.tag!)
        );
    }

    if (filter.price && filter.price !== 'all') {
        const [minPrice, maxPrice] = filter.price.split('-').map(Number);
        filtered = filtered.filter(product =>
            product.defaultPrice >= minPrice && product.defaultPrice <= maxPrice
        );
    }

    return filtered;
}

function applySorting(products: IProduct[], sort?: string): IProduct[] {
    const sorted = [...products];

    switch (sort) {
        case 'best-selling':
            return sorted.sort((a, b) => (b.totalSale || 0) - (a.totalSale || 0));
        case 'price-low-to-high':
            return sorted.sort((a, b) => a.defaultPrice - b.defaultPrice);
        case 'price-high-to-low':
            return sorted.sort((a, b) => b.defaultPrice - a.defaultPrice);
        case 'avg-customer-review':
            return sorted.sort((a, b) => (b.avgRating || 0) - (a.avgRating || 0));
        default:
            return sorted.sort((a, b) =>
                new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
            );
    }
}

export async function getProductsByCategory(categoryId: string) {
    return callApiToArray<IProduct>({url: `/identity/products/category/${categoryId}`})
}

export async function getProductsByName(name: string) {
    return callApiToArray<IProduct>({url: `/identity/products/name/${name}`})
}

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
export async function updateProduct(product?: IProduct) {
    const t = await getTranslations("Product")
    if (!product) {
        return t("Product can't missing")
    }
    // console.log(JSON.stringify(product));
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
    return callApiToObject<IProduct>({url: '/identity/products', data: updateProductRequest, method: PUT_METHOD})
}

export async function getProductById(id: string) {
    return callApiToObject<IProduct>({url: `/identity/products/${id}`})
}

export async function addColorForProduct(productId: string, colorRequests: AddColorRequest[]) {
    return callApiToArray<IProductColor>({
        url: `/identity/products/colors/${productId}`,
        data: colorRequests,
        method: POST_METHOD
    })
}
export async function addProduct(product: AddProductRequest) {
    return await callApiToObject<IProduct>({url:'/identity/products', data: product, method: POST_METHOD})
}
export async function addSizeForProduct(productId: string, sizeRequests: AddSizeRequest[]) {
    return callApiToArray<IProductSize>({
        url: `/identity/products/sizes/${productId}`,
        data: sizeRequests,
        method: POST_METHOD
    })
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

export interface Filter {
    query: string
    category: string
    tag: string
    limit?: number
    page: number
    price?: string
    rating?: string
    sort?: string
}
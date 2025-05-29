export interface AddColorRequest {
    colorCode: string,
    colorName: string,
}
export interface AddSizeRequest {
    size: string,
    description: string,
}
export interface AddProductRequest {
    name: string,
    slug: string,
    categoryId: string,
    defaultPrice: number,
    defaultDiscount: number,
    description: string,
    brand: string,
    colors: AddColorRequest[],
    sizes: AddSizeRequest[],
    images: string[],
    tags: string[],
}
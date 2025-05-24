export interface IProduct {
    id: string
    name: string
    slug: string
    defaultPrice: number
    defaultDiscount: number
    published: boolean
    category: {
        id:string
        name: string
        imagePath: string
        description: string
    }
    description: string
    images: IProductImage[]
    colors?: IProductColor[]
    sizes?: IProductSize[]
    tags: string[]
    totalSale: number
    quantity: number
    avgRating:number
    numReviews: number
    brand: string
    createdAt: Date
    updatedAt: Date
}
export interface IProductDetail {
    id: string
    color: IProductColor
    size:IProductSize
    discount: number
    price: number
    quantity: number
}
export interface IProductColor {
    id: string
    colorCode: string
    colorName: string
}
export interface IProductSize {
    id: string
    size: string
    description: string
}
export interface IProductImage {
    id: string
    imagePath: string
}
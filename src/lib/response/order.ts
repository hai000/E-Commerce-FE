export interface ICart {
    items: IOrderItem[]
    itemsPrice: number
    taxPrice?: number
    shippingPrice?: number
    totalPrice: number
    paymentMethod?:string
    deliveryDateIndex?: number
    expectedDeliveryDate?: Date
}

export interface IOrderItem {
    id: string
    productId: string
    name: string
    slug: string
    category: {
        id:string
        name: string
        imagePath?: string
        description?: string
    }
    quantity: number
    countInStock: number
    image: string
    price: number
    sizeId?: string
    colorId?: string
    color?: string
    size?:string
}
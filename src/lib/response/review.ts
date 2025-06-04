import {OrderUser} from "@/lib/response/order";

export interface Review{
    id: string
    productId: string
    productName: string
    orderUser: OrderUser
    images: string[]
    ratingScore: number
    content: string
    createdAt: Date
    updatedAt: Date

}

import {Category} from "@/lib/response/category";
import {IProductColor, IProductImage, IProductSize} from "@/lib/response/product";

export interface Cart{
    id: string,
    itemsPrice: number
    userId: string
    cartItems:CartItem[]
    createdAt: Date | null
    updatedAt: Date | null
}
export interface CartItem {
    id: string,
    productId:string,
    productName:string,
    slug:string,
    price:number,
    discount:number,
    published:boolean,
    category:Category,
    color:IProductColor
    size: IProductSize,
    images:string[],
    description:string,
    brand:string,
    cartItemQuantity:number,
    productQuantity:number
}
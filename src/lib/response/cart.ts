import {Category} from "@/lib/response/category";
import {IProductColor, IProductSize} from "@/lib/response/product";
import {ShippingAddress} from "@/lib/request/location";

export interface Cart{
    id: string,
    itemsPrice: number
    userId: string
    cartItems:CartItem[]
    createdAt: Date | null
    updatedAt: Date | null
    paymentMethod?: string,
    shippingAddress?: ShippingAddress,
    deliveryDateIndex: number,
    shippingPrice: number,
    totalPrice: number,

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
    color?:IProductColor
    size?: IProductSize,
    images:string[],
    description:string,
    brand:string,
    cartItemQuantity:number,
    productQuantity:number,
    isChecked?: boolean
}
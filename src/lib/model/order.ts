import {z} from "zod";
import {
    CartSchema,
    OrderItemSchema
} from '@/lib/validator'
export type OrderItem = z.infer<typeof OrderItemSchema>
export type Cart = z.infer<typeof CartSchema>
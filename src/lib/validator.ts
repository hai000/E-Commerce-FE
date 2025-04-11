import {z} from "zod";
import {formatNumberWithDecimal} from "@/lib/utils";
const Price = (field: string) =>
    z.coerce
        .number()
        .refine(
            (value) => /^\d+(\.\d{2})?$/.test(formatNumberWithDecimal(value)),
            `${field} must have exactly two decimal places (e.g., 49.99)`
        )
export const OrderItemSchema = z.object({
    clientId: z.string().min(1, 'clientId is required'),
    product: z.string().min(1, 'Product is required'),
    name: z.string().min(1, 'Name is required'),
    slug: z.string().min(1, 'Slug is required'),
    category: z.string().min(1, 'Category is required'),
    quantity: z
        .number()
        .int()
        .nonnegative('Quantity must be a non-negative number'),
    countInStock: z
        .number()
        .int()
        .nonnegative('Quantity must be a non-negative number'),
    image: z.string().min(1, 'Image is required'),
    price: Price('Price'),
    size: z.string().optional(),
    color: z.string().optional(),
})

export const CartSchema = z.object({
    items: z
        .array(OrderItemSchema)
        .min(1, 'Order must contain at least one item'),
    itemsPrice: z.number(),

    taxPrice: z.optional(z.number()),
    shippingPrice: z.optional(z.number()),
    totalPrice: z.number(),
    paymentMethod: z.optional(z.string()),
    deliveryDateIndex: z.optional(z.number()),
    expectedDeliveryDate: z.optional(z.date()),
})
export const CategorySchema = z.object({
    id: z.union([
        z.string().min(1, 'Category is required'),
        z.number().transform((num) => num.toString()),
    ]),
    name: z.string().min(1, 'Category is required'),
    imagePath: z.nullable(z.string().min(1, 'Image is required')),
    description: z.nullable(z.string().min(1, 'Description is required')),
});
import {z} from "zod";
import {getShippingAddressSchema} from "@/lib/validator";

export type ShippingAddress = z.infer<ReturnType<typeof getShippingAddressSchema>>;
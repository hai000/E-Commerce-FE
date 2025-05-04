import {ShippingAddressSchema} from "@/lib/validator";
import {z} from "zod";

export type ShippingAddress = z.infer<typeof ShippingAddressSchema>
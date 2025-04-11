import {CategorySchema} from "@/lib/validator";
import {z} from "zod";

export type Category = z.infer<typeof CategorySchema>
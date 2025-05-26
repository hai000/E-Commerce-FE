import {z} from "zod";
import {getCategorySchema} from "@/lib/validator";

export type Category =  z.infer<ReturnType<typeof getCategorySchema>>;
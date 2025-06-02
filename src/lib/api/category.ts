'use server'
import {Category} from "@/lib/response/category";
import {callApiToArray, callApiToArrayWithPage} from "@/lib/utils";
import {PAGE_SIZE} from "@/lib/constants";

export async function getAllCategories() {
    return await callApiToArray<Category>({url:`/identity/categories`});
}
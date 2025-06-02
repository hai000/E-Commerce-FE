'use server'
import {Category} from "@/lib/response/category";
import {callApiToArray} from "@/lib/utils";

export async function getAllCategories() {
    return await callApiToArray<Category>({url:`/identity/categories`});
}
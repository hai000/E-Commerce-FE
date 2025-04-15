import {Category} from "@/lib/response/category";
import {callApiToArray} from "@/lib/utils";

export async function getAllCategories() {
    return callApiToArray<Category>('/identity/category/getAll');
}
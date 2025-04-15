import {HOST_API} from "@/lib/constants";
import {ITag} from "@/lib/response/tag";
import {callApiToArray} from "@/lib/utils";

export async function getAllTags() {
    return callApiToArray<ITag>('/identity/tag/getAll')
}
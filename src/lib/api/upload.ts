import {callApiToAll, fileToBase64} from "@/lib/utils";
import {POST_METHOD} from "@/lib/constants";

export async function uploadFile(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    return callApiToAll<string>({
        url: "/identity/upload",
        method: POST_METHOD,
        data: formData
    });
}
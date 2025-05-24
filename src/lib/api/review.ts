import {callApiToArray} from "@/lib/utils";
import {ReviewAddRequest} from "@/lib/request/review";
import {POST_METHOD} from "@/lib/constants";

export async function addReview(review: ReviewAddRequest) {
    return callApiToArray({url:'/identity/productReview',data: review,method: POST_METHOD})
}
import {callApiToArray} from "@/lib/utils";
import {PaymentMethod} from "@/lib/response/payment";

export async function getPaymentMethods() {
    return callApiToArray<PaymentMethod>({url:'/identity/payment'})
}
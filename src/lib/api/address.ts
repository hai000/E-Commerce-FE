import {callApiToArray, generateHeaderAccessToken} from "@/lib/utils";
import {Address, InfoShippingAddress} from "@/lib/response/address";
import {ILogin} from "@/lib/response/login";

export async function getMyAddresses(request:ILogin) {
    return callApiToArray<Address>({url:'/identity/address/getMyAddesses', headers: generateHeaderAccessToken(request)});
}
export async function getInfoShips(addressId?:string) {
    return callApiToArray<InfoShippingAddress>({url:`/identity/address/getInfoShips/${addressId}`});
}
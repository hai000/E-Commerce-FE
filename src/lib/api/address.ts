'use server'
import {callApiToArray, generateHeaderAccessToken} from "@/lib/utils";
import {Address, InfoShippingAddress} from "@/lib/response/address";
import {auth} from "@/app/auth";

export async function getMyAddresses() {
    const session = await auth()
    if (!session) {
        return 'Session timeout';
    }
    return callApiToArray<Address>({url:'/identity/addresses/myAddesses', headers: generateHeaderAccessToken(session)});
}
export async function getInfoShips(addressId?:string) {
    return callApiToArray<InfoShippingAddress>({url:`/identity/addresses/infoShips/${addressId}`});
}
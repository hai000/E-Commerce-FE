'use server'
import {callApiToArray, generateHeaderAccessToken} from "@/lib/utils";
import {Address, InfoShippingAddress} from "@/lib/response/address";
import {auth} from "../../auth";
import {getTranslations} from "next-intl/server";

export async function getMyAddresses() {
    const t = await getTranslations("Product")
    const session = await auth()
    if (!session) {
        return t('Session timeout');
    }
    return callApiToArray<Address>({url:'/identity/addresses/myAddesses', headers: generateHeaderAccessToken(session)});
}
export async function getInfoShips(addressId?:string) {
    return callApiToArray<InfoShippingAddress>({url:`/identity/addresses/infoShips/${addressId}`});
}
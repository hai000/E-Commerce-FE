'use server'
import {callApiGetStatus, callApiToAll, callApiToArray, callApiToObject, generateHeaderAccessToken} from "@/lib/utils";
import {Address, InfoShippingAddress} from "@/lib/response/address";
import {auth} from "@/auth";
import {getTranslations} from "next-intl/server";
import {AddAddressRequest, UpdateAddressRequest} from "@/lib/request/addresses";
import {DELETE_METHOD, PUT_METHOD} from "@/lib/constants";

export async function getMyAddresses() {
    const t = await getTranslations("Product")
    const session = await auth()
    if (!session) {
        return t('Session timeout');
    }
    return callApiToArray<Address>({url:'/identity/addresses/myAddesses', headers: generateHeaderAccessToken(session)});
}
export async function updateAddress(data: UpdateAddressRequest) {
    const t = await getTranslations("Product")
    const session = await auth()
    if (!session) {
        return t('Session timeout')
    }
    return callApiToObject<Address>({
        url: `/identity/addresses`,
        method: PUT_METHOD,
        data: data,
        headers: generateHeaderAccessToken(session)
    })
}
export async function deleteAddress(addressId: string) {
    const t = await getTranslations("Product")
    const session = await auth()
    if (!session) {
        return {
            code: 500,
            success: false,
            data: t('Session timeout')
        };
    }
    return callApiToAll<string>({
        url: `/identity/addresses/${addressId}`,
        method: DELETE_METHOD,
        headers: generateHeaderAccessToken(session)
    });
}
export async function addAddress(data: AddAddressRequest) {
    const t = await getTranslations("Product")
    const session = await auth()
    if (!session) {
        return t('Session timeout');
    }
    return callApiToObject<Address>({
        url: '/identity/addresses',
        method: 'POST',
        data: data,
        headers: generateHeaderAccessToken(session)
    });
}
export async function getInfoShips(addressId?:string) {
    return callApiToArray<InfoShippingAddress>({url:`/identity/addresses/infoShips/${addressId}`});
}
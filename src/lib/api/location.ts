import {callApiToArray} from "@/lib/utils";
import {District, Province, Ward} from "@/lib/response/abstract-location";

export async function getAllProvinces() {
    return callApiToArray<Province>({url:'/identity/location/getAllProvinces'})
}
export async function getAllDistricts() {
    return callApiToArray<District>({url:'/identity/location/getAllDistricts'})
}
export async function getAllWards() {
    return callApiToArray<Ward>({url:'/identity/location/getAllWards'})
}
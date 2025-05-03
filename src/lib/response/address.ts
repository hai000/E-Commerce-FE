import {District, Province, Ward} from "@/lib/response/abstract-location";

export interface Address {
    id: string
    province: Province
    district: District
    ward: Ward
    houseNumber: string
}
export interface InfoShippingAddress {
    ten_dichvu: string,
    thoi_gian: string,
    gia_cuoc: string,
}
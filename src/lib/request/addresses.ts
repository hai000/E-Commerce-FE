export interface AddAddressRequest {
    provinceId: string;
    districtId: string;
    wardId: string;
    houseNumber: string;
}
export interface UpdateAddressRequest extends AddAddressRequest {
    addressId: string
}
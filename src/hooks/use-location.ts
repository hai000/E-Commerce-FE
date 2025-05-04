import {District, Province, Ward} from "@/lib/response/abstract-location";
import {create} from "zustand/index";
import {persist} from "zustand/middleware";
import {getAllDistricts, getAllProvinces, getAllWards} from "@/lib/api/location";
import {Address} from "@/lib/response/address";

interface LocationStore {
    isInitialized: boolean,
    provinces?: Province[],
    districts?: District[],
    wards?: Ward[],
    myAddresses?: Address[] | null,
    districtByProvince?: District[] | null,
    wardsByDistrict?: Ward[] | null,
    provinceSelected: Province | null,
    districtSelected: District | null,
    myAddressSelected: Address | null,
    wardSelected: Ward | null,
}

const initialState: LocationStore = {
    isInitialized: false,
    provinceSelected: null,
    districtSelected: null,
    myAddressSelected: null,
    wardSelected: null
}

interface LocationState {
    location: LocationStore;
    init: () => Promise<void>,
    setProvinceSelected: (province: Province) => void,
    setDistrictSelected: (district: District) => void,
    setWardSelected: (ward: Ward) => void,
    setMyAddresses: (myAddresses: Address[]) => void,
}

export const useLocationStore = create(
    persist<LocationState>((set, get) => ({
            location: initialState,
            setProvinceSelected: (province: Province) => {
                set(state => ({
                    location: {
                        ...state.location,
                        districtSelected: null,
                        wardSelected: null,
                        provinceSelected: province,
                        districtByProvince: get().location.districts?.filter((district) => district.provinceId == province.id),
                        wardsByDistrict: null
                    },
                }));
            },
            setDistrictSelected: (district: District) => {
                set(state => ({
                    location: {
                        ...state.location,
                        districtSelected: district,
                        wardSelected: null,
                        wardsByDistrict: get().location.wards?.filter((ward) => ward.districtId == district.id),
                    },
                }));

            }, setWardSelected: (ward: Ward) => {
                set(state => ({
                    location: {
                        ...state.location,
                        wardSelected: ward,
                    },
                }));
            },
            setMyAddresses: (myAddresses: Address[]) => {
                const myAddressDefault = myAddresses[0];
                set(state => ({
                    ...state,
                    location: {
                        ...state.location,
                        myAddressSelected: myAddressDefault,
                        districtSelected: myAddressDefault.district,
                        wardSelected: myAddressDefault.ward,
                        provinceSelected: myAddressDefault.province,
                        districtByProvince: get().location.districts?.filter((district) => district.provinceId == myAddressDefault.province.id),
                        wardsByDistrict: get().location.wards?.filter((ward) => ward.districtId == myAddressDefault.ward.id),
                        myAddresses: myAddresses,
                    }
                }))
            },
            init: async () => {
                const provincesRes = await getAllProvinces();
                const districtsRes = await getAllDistricts();
                const wardsRes = await getAllWards();
                let isInitialized = false;
                let provinces
                let districts
                let wards
                if (typeof provincesRes !== "string" && typeof districtsRes !== "string" && typeof wardsRes !== "string") {
                    provinces = provincesRes
                    districts = districtsRes
                    wards = wardsRes
                    isInitialized = true
                }
                set({
                    location: {
                        ...get().location,
                        isInitialized: isInitialized,
                        provinces: provinces,
                        districts: districts,
                        wards: wards,
                    },
                })
            },
        }),
        {
            name: 'location-store',
        }
    )
)
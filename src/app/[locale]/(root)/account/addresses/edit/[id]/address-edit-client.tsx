"use client"

import {useEffect, useState} from "react"
import {useRouter} from "next/navigation"
import {ArrowLeft, Loader2, MapPin, Save} from "lucide-react"
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import * as z from "zod"

import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form"
import {useToast} from "@/hooks/use-toast"
import {useLocationStore} from "@/hooks/use-location";
import {District, Province, Ward} from "@/lib/response/abstract-location";
import {Address} from "@/lib/response/address";
import {AddressSchema} from "@/lib/validator";
import {useTranslations} from "next-intl";
import {updateAddress} from "@/lib/api/address";
import {UpdateAddressRequest} from "@/lib/request/addresses";

export default function AddressEditPageClient({address}: { address: Address }) {
    const router = useRouter()
    const t = useTranslations()
    const {toast} = useToast()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [provinces, setProvinces] = useState<Province[]>([])
    const [districts, setDistricts] = useState<District[]>([])
    const [wards, setWards] = useState<Ward[]>([])
    const {location, init} = useLocationStore()
    const addressEditSchema = AddressSchema(t)
    type AddressEditFormData = z.infer<typeof addressEditSchema>
    const form = useForm<AddressEditFormData>({
        resolver: zodResolver(addressEditSchema),
        defaultValues: {
            houseNumber: address.houseNumber,
            provinceId: '',
            districtId: '',
            wardId: '',
        },
    })

    useEffect(() => {
        const initial = async () => {
            if (!location.isInitialized) {
                await init()
            }
            handleProvinceChange(address.province.id)
            setProvinces(location.provinces)
        }
        initial()
    }, [address])

    // Load districts when province changes
    const handleProvinceChange = (provinceId: string) => {
        form.setValue("provinceId", provinceId)
        form.setValue("districtId", "")
        form.setValue("wardId", "")
        setDistricts([])
        setWards([])
        if (!provinceId) return
        const districtsData = location.districts.filter(district => district.provinceId == provinceId)
        setDistricts(districtsData)
    }

    // Load wards when district changes
    const handleDistrictChange = (districtId: string) => {
        form.setValue("districtId", districtId)
        form.setValue("wardId", "")
        setWards([])

        if (!districtId) return
        const wardsData = location.wards.filter(ward => ward.districtId == districtId)
        setWards(wardsData)
    }

    const onSubmit = async (data: AddressEditFormData) => {
        setIsSubmitting(true)
        try {
            // Find selected province, district, ward objects
            const selectedProvince = provinces.find((p) => p.id == data.provinceId)
            const selectedDistrict = districts.find((d) => d.id == data.districtId)
            const selectedWard = wards.find((w) => w.id == data.wardId)

            if (!selectedProvince || !selectedDistrict || !selectedWard) {
                throw new Error("Không tìm thấy thông tin địa danh")
            }

            // Update address via API
            const updateData = {
                addressId: address.id,
                houseNumber: data.houseNumber,
                provinceId: selectedProvince.id,
                districtId: selectedDistrict.id,
                wardId: selectedWard.id,
            } as UpdateAddressRequest

            const res =await updateAddress( updateData)
            if (typeof res === "string") {
                toast({
                    title: t("Toast.Error"),
                    description: res,
                    variant: "destructive",
                })
            }else {
                toast({
                    title: t("Toast.Success"),
                    description: "Địa chỉ đã được cập nhật thành công.",
                    variant: "success",
                })
                router.push("/account/addresses")
            }

        } catch (
            // eslint-disable-next-line
            error: any) {
            console.error("Error updating address:", error)
            toast({
                title: "Lỗi",
                description: error.message || "Không thể cập nhật địa chỉ. Vui lòng thử lại.",
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleBack = () => {
        router.push("/account/addresses")
    }

    const handleCancel = () => {
        router.push("/account/addresses")
    }

    return (
        <div className="container mx-auto py-8 px-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" onClick={handleBack}>
                        <ArrowLeft className="h-4 w-4 mr-2"/>
                        Quay lại
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">Chỉnh sửa địa chỉ</h1>
                        <p className="text-muted-foreground">Cập nhật thông tin địa chỉ</p>
                    </div>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5"/>
                        Thông tin địa chỉ
                    </CardTitle>
                    <CardDescription>Cập nhật thông tin chi tiết cho địa chỉ</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            {/* Current Address Display */}
                            <div className="p-4 bg-muted rounded-lg">
                                <h4 className="font-medium mb-2">Địa chỉ hiện tại:</h4>
                                <p className="text-sm">
                                    {address.houseNumber}, {address.ward.name}, {address.district.name}, {address.province.name}
                                </p>
                            </div>
                            {/* Address Information */}
                            <div>
                                <h3 className="text-lg font-medium mb-4">Cập nhật địa chỉ</h3>
                                <div className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="houseNumber"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Số nhà, tên đường *</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Ví dụ: 123 Đường Lê Lợi" {...field} />
                                                </FormControl>
                                                <FormDescription>Nhập số nhà và tên đường cụ thể</FormDescription>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="provinceId"
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>Tỉnh/Thành phố *</FormLabel>
                                                    <Select onValueChange={handleProvinceChange} value={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Chọn tỉnh/thành phố"/>
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {provinces.map((province) => (
                                                                <SelectItem key={province.id}
                                                                            value={province.id.toString()}>
                                                                    {province.name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="districtId"
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>Quận/Huyện *</FormLabel>
                                                    <Select
                                                        onValueChange={handleDistrictChange}
                                                        value={field.value}
                                                        disabled={!form.watch("provinceId")}
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder={"Chọn quận/huyện"}/>
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {districts.map((district) => (
                                                                <SelectItem key={district.id} value={district.id.toString()}>
                                                                    {district.name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="wardId"
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>Phường/Xã *</FormLabel>
                                                    <Select
                                                        onValueChange={field.onChange}
                                                        value={field.value}
                                                        disabled={!form.watch("districtId")}
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder={"Chọn phường/xã"}/>
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {wards.map((ward) => (
                                                                <SelectItem key={ward.id} value={ward.id.toString()}>
                                                                    {ward.name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Form Actions */}
                            <div className="flex justify-end gap-4 pt-6">
                                <Button type="button" variant="outline" onClick={handleCancel} disabled={isSubmitting}>
                                    Hủy
                                </Button>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                            Đang cập nhật...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="mr-2 h-4 w-4"/>
                                            Cập nhật địa chỉ
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}

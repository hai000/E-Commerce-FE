"use client"

import {useEffect, useState} from "react"
import {useRouter} from "next/navigation"
import {ArrowLeft, Loader2, MapPin, Save} from 'lucide-react'
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import * as z from "zod"

import {Button} from "@/components/ui/button"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form"
import {useToast} from "@/hooks/use-toast"
import {District, Province, Ward} from "@/lib/response/abstract-location";
import {useLocationStore} from "@/hooks/use-location";
import {addAddress} from "@/lib/api/address";
import {AddAddressRequest} from "@/lib/request/addresses";
import {useTranslations} from "next-intl";
import {AddressSchema} from "@/lib/validator";


export default function AddressCreatePageClient() {
    const t = useTranslations()
    const router = useRouter()
    const {toast} = useToast()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [provinces, setProvinces] = useState<Province[]>([])
    const [districts, setDistricts] = useState<District[]>([])
    const [wards, setWards] = useState<Ward[]>([])
    const {location, init} = useLocationStore()
    const addressCreateSchema = AddressSchema(t)
    type AddressCreateFormData = z.infer<typeof addressCreateSchema>
    const form = useForm<AddressCreateFormData>({
        resolver: zodResolver(addressCreateSchema),
        defaultValues: {
            houseNumber: "",
            provinceId: "",
            districtId: "",
            wardId: "",
        },
    })
    useEffect(() => {
        const initialize = async () => {
            if (!location.isInitialized) {
                await init()
            }
            setProvinces(location.provinces)
        }
        initialize()
    }, []);

    // Load districts when province changes
    const handleProvinceChange = async (provinceId: string) => {
        console.log(provinceId)
        form.setValue("provinceId", provinceId)
        form.setValue("districtId", "")
        form.setValue("wardId", "")
        setDistricts([])
        setWards([])
        if (!provinceId) return
        const districtsData = location.districts.filter(districts => districts.provinceId == provinceId)
        setDistricts(districtsData)
    }

    // Load wards when district changes
    const handleDistrictChange = async (districtId: string) => {
        form.setValue("districtId", districtId)
        form.setValue("wardId", "")
        setWards([])
        if (!districtId) return
        const wardsData = location.wards.filter(wards => wards.districtId == districtId)
        setWards(wardsData)
    }


    const onSubmit = async (data: AddressCreateFormData) => {
        setIsSubmitting(true)

        try {
            // Find selected province, district, ward objects
            const selectedProvince = provinces.find((p) => p.id == data.provinceId)
            const selectedDistrict = districts.find((d) => d.id == data.districtId)
            const selectedWard = wards.find((w) => w.id == data.wardId)

            if (!selectedProvince || !selectedDistrict || !selectedWard) {
                throw new Error("Cannot find selected province district or ward")
            }

            // Create address via API
            const addressData = {
                provinceId: selectedProvince.id,
                wardId: selectedWard.id,
                districtId: selectedDistrict.id,
                houseNumber: data.houseNumber,
            } as AddAddressRequest

            const res = await addAddress(addressData)
            if (typeof res === "string") {

            } else {
                toast({
                    title: t("Toast.Success"),
                    description: t("Address added successfully"),
                    variant: "success"
                })
                router.push("/account/addresses")
            }
        // eslint-disable-next-line
        } catch (error: any) {
            toast({
                title: t("Toast.Error"),
                description: t(error.message || "Cannot add address"),
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
                        {t('Back')}
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">{t('Add new address')}</h1>
                        <p className="text-muted-foreground">{t('Add new address')}</p>
                    </div>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5"/>
                        {t('Address Information')}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            {/* Address Information */}
                            <div>
                                <h3 className="text-lg font-medium mb-4">{t('Detail Address')}</h3>
                                <div className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="houseNumber"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>{t('House street')} *</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="123" {...field} />
                                                </FormControl>
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
                                                    <FormLabel>{t('Province City')} *</FormLabel>
                                                    <Select onValueChange={handleProvinceChange} value={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder={t('Select Province City')}/>
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
                                                    <FormLabel>{t('District')} *</FormLabel>
                                                    <Select
                                                        onValueChange={handleDistrictChange}
                                                        value={field.value}
                                                        disabled={!form.watch("provinceId")}
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue
                                                                    placeholder={
                                                                        t('Select District')
                                                                    }
                                                                />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {districts.map((district) => (
                                                                <SelectItem key={district.id}
                                                                            value={district.id.toString()}>
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
                                                    <FormLabel>{t('Ward')} *</FormLabel>
                                                    <Select
                                                        onValueChange={field.onChange}
                                                        value={field.value}
                                                        disabled={!form.watch("districtId")}
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue
                                                                    placeholder={t("Select Ward")}
                                                                />
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
                                            {t('Adding')}...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="mr-2 h-4 w-4"/>
                                            {t('Add address')}
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

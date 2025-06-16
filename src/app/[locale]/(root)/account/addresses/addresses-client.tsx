"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, MapPin, Home, Building, MoreHorizontal, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import type {Address} from "@/lib/response/address"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import {useTranslations} from "next-intl";
import {deleteAddress} from "@/lib/api/address";

export default function AddressManagementPageClient({addressesI}:{addressesI: Address[]}) {
    const router = useRouter()
    const { toast } = useToast()
    const [addresses, setAddresses] = useState<Address[]>(addressesI)
    const [isDeleting, setIsDeleting] = useState<string | null>(null)
    const t = useTranslations()
    // Pagination state
    useEffect(() => {
        setAddresses(addressesI)
    }, [addressesI])
    // Handle create address
    const handleCreateAddress = () => {
        router.push("/account/addresses/create")
    }

    // Handle edit address
    const handleEditAddress = (addressId: string) => {
        router.push(`/account/addresses/edit/${addressId}`)
    }

    // Handle delete address
    const handleDeleteAddress = async (addressId: string) => {
        setIsDeleting(addressId)
        try {
            const res = await deleteAddress(addressId)
            if (res.success) {
                // Remove address from local state
                setAddresses(addresses.filter((address) => address.id !== addressId))
                toast({
                    variant: 'success',
                    title: t("Toast.Success"),
                    description: res.data,
                })
            }else {
                toast({
                    title: t("Toast.Error"),
                    description: res.data,
                    variant: "destructive",
                })
            }
        } catch (error) {
            console.error("Error deleting address:", error)
            toast({
                title: t("Toast.Error"),
                description: t("Cant delete address"),
                variant: "destructive",
            })
        } finally {
            setIsDeleting(null)
        }
    }


    return (
        <div className="container mx-auto py-8 px-4">
            <Card className="shadow-lg">
                <CardHeader>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <CardTitle className="text-2xl font-bold">{t('Address Management')}</CardTitle>
                            <CardDescription>{t('View and edit your address')}</CardDescription>
                        </div>
                        <Button onClick={handleCreateAddress} className="flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            {t('Add address')}
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {addresses.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {addresses.map((address) => (
                                <Card key={address.id} className={`max-w-64 relative`}>
                                    <CardHeader className="pb-3">
                                        <div>
                                            <p className="font-medium">ID: {address.id}</p>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="flex flex-row items-center  justify-between pt-0">
                                        <div className="space-y-2">
                                            <div className="text-sm">
                                                <p>{address.houseNumber}</p>
                                                <p>
                                                    {address.ward.name}, {address.district.name}
                                                </p>
                                                <p>{address.province.name}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start justify-between">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <span className="sr-only">{t('Open menu')}</span>
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>{t('Actions')}</DropdownMenuLabel>
                                                    <DropdownMenuItem onClick={() => handleEditAddress(address.id)}>
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        {t('Edit')}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <DropdownMenuItem
                                                                className="text-red-600"
                                                                onSelect={(e) => e.preventDefault()}
                                                                disabled={isDeleting === address.id}
                                                            >
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                {isDeleting === address.id ? t('Deleting') : t('Delete')}
                                                            </DropdownMenuItem>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    {t('Are you sure you want to delete this address This action cannot be undone')}
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>{t('Cancel')}</AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    onClick={() => handleDeleteAddress(address.id)}
                                                                    className="bg-red-600 hover:bg-red-700"
                                                                >
                                                                    {t('Delete')}
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-medium mb-2">{t('Not yet addressed')}</h3>
                            <p className="text-muted-foreground mb-4">{t('Add first address to use')}</p>
                            <Button onClick={handleCreateAddress}>
                                <Plus className="h-4 w-4 mr-2" />
                                {t('Add new address')}
                            </Button>
                        </div>
                    )}

                </CardContent>
            </Card>
        </div>
    )
}

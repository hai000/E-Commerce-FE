"use client"

import { ArrowLeft, Edit, Mail, Phone, Calendar, User, Shield, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { IUser } from "@/lib/response/user"
import { useRouter } from "next/navigation"
import {useLocale, useTranslations} from "next-intl";
import {getGenderText, getRoleIntl} from "@/lib/utils";


const formatDateTime = (date: Date | string | undefined,local: string, t: (key: string)=> string): string => {
    if (!date) return t("Not available")
    return new Date(date).toLocaleString(local, {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    })
}
// Role color mapping
const getRoleColor = (role: string): string => {
    switch (role.toLowerCase()) {
        case "admin":
            return "destructive"
        case "manager":
            return "default"
        case "user":
            return "secondary"
        default:
            return "outline"
    }
}

// Get user initials for avatar fallback
const getUserInitials = (fullName: string): string => {
    return fullName
        .split(" ")
        .map((name) => name.charAt(0))
        .join("")
        .toUpperCase()
        .slice(0, 2)
}

// Format date
const formatDate = (date: Date | string | undefined,local: string,t: (key: string)=> string): string => {
    if (!date) return t("Not provided")
    return new Date(date).toLocaleDateString(local, {
        year: "numeric",
        month: "long",
        day: "numeric",
    })
}


// Calculate age from date of birth
const calculateAge = (dateOfBirth: string | undefined,t : (key:string)=> string): string => {
    if (!dateOfBirth) return t("Not provided")
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--
    }

    return `${age}`
}

export default function UserDetailPageClient({ user }: { user: IUser }) {
    const router = useRouter()
    const t = useTranslations()
    const local = useLocale()
    const handleEdit = () => {
        router.push(`/dashboard/customers/edit/${user.id}`)
    }
    const handleBack = () => {
        router.back()
    }

    return (
        <div className="container mx-auto py-8 px-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" onClick={handleBack}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        {t('Back')}
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">{t('User Details')}</h1>
                        <p className="text-muted-foreground">{t('View and manage user information')}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button onClick={handleEdit} className="flex items-center gap-2">
                        <Edit className="h-4 w-4" />
                       {t('Edit user')}
                    </Button>

                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* User Profile Card */}
                <div className="lg:col-span-1">
                    <Card>
                        <CardHeader className="text-center">
                            <div className="flex justify-center mb-4">
                                <Avatar className="h-24 w-24">
                                    <AvatarImage src={user.avtPath || "/placeholder.svg"} alt={user.fullName} />
                                    <AvatarFallback className="text-2xl">{getUserInitials(user.fullName)}</AvatarFallback>
                                </Avatar>
                            </div>
                            <CardTitle className="text-xl">{user.fullName}</CardTitle>
                            <CardDescription>{user.username}</CardDescription>
                            <div className="flex justify-center mt-2">
                                <Badge variant={getRoleColor(user.role) as any} className="text-sm">
                                    {user.role}
                                </Badge>
                            </div>
                        </CardHeader>
                    </Card>

                    {/* Quick Stats */}
                    <Card className="mt-6">
                        <CardHeader>
                            <CardTitle className="text-lg"> {t('Quick Info')}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">{t('Gender')}</p>
                                    <p className="text-sm text-muted-foreground">{getGenderText(user.gender,t)}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">{t('Age')}</p>
                                    <p className="text-sm text-muted-foreground">{calculateAge(user.dateOfBirth,t)}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Shield className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">{t('Role')}</p>
                                    <p className="text-sm text-muted-foreground capitalize">{getRoleIntl(user.role,t)}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Detailed Information */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Personal Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                {t('Personal Information')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">{t('Full Name')}</label>
                                    <p className="text-sm mt-1">{user.fullName}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">{t('Username')}</label>
                                    <p className="text-sm mt-1">{user.username}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">{t('Gender')}</label>
                                    <p className="text-sm mt-1">{getGenderText(user.gender,t)}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">{t('Date of Birth')}</label>
                                    <p className="text-sm mt-1">{formatDate(user.dateOfBirth,local,t)}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Contact Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Mail className="h-5 w-5" />
                                {t('Contact Information')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                        <p className="text-sm">{user.email || t("Not provided")}</p>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">{t('User.Phone number')}</label>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                        <p className="text-sm">{user.phoneNumber || t("Not provided")}</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Account Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="h-5 w-5" />
                                {t("Account Information")}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">{t("User ID")}</label>
                                    <p className="text-sm mt-1 font-mono">{user.id}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">{t("Role")}</label>
                                    <div className="mt-1">
                                        <Badge variant={getRoleColor(user.role) as any}>{user.role}</Badge>
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">{t('Account Created')}</label>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                        <p className="text-sm">{formatDateTime(user.createdAt,local,t)}</p>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">{t('Last Updated')}</label>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                        <p className="text-sm">{formatDateTime(user.updatedAt,local,t)}</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

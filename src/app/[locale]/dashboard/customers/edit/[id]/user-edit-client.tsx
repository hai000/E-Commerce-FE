"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useToast } from "@/hooks/use-toast"
import type { IUser } from "@/lib/response/user"
import {getUserEditSchema} from "@/lib/validator";
import {useTranslations} from "next-intl";

// Validation schema

// Get user initials for avatar fallback
const getUserInitials = (fullName: string): string => {
    return fullName
        .split(" ")
        .map((name) => name.charAt(0))
        .join("")
        .toUpperCase()
        .slice(0, 2)
}



export default function UserEditPageClient({ user }: { user: IUser }) {
    const router = useRouter()
    const t = useTranslations()
    const { toast } = useToast()
    const [isSubmitting, setIsSubmitting] = useState(false)
// Gender options
    const genderOptions = [
        { value: "0", label: "Female" },
        { value: "1", label: "Male" },
    ]
    const shema = getUserEditSchema(t)
    type UserEditFormData = z.infer<typeof shema>
// Role options
    const roleOptions = [
        { value: "ADMIN", label: "Admin" },
        { value: "USER", label: "User" },
    ]
    const form = useForm<UserEditFormData>({
        resolver: zodResolver(shema),
        defaultValues: {
            username: user.username,
            email: user.email || "",
            phoneNumber: user.phoneNumber || "",
            fullName: user.fullName,
            dateOfBirth: user.dateOfBirth || "",
            gender: user.gender.toString() as "0" | "1",
            role: user.role as "ADMIN" | "USER",
        },
    })

    const onSubmit = async (data: UserEditFormData) => {
        setIsSubmitting(true)

        try {
            // Convert form data to match API expectations
            const updateData = {
                ...data,
                gender: Number.parseInt(data.gender),
                email: data.email || undefined,
                phoneNumber: data.phoneNumber || undefined,
                dateOfBirth: data.dateOfBirth || undefined,
            }

            // Here you would implement your API call to update the user
            // await updateUser(user.id, updateData)

            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1500))

            toast({
                variant: "success",
                title: "Success",
                description: "User information has been updated successfully.",
            })

            // Navigate back to user detail page
            router.push(`/dashboard/customers/${user.id}`)
        } catch (error) {
            console.error("Error updating user:", error)
            toast({
                title: "Error",
                description: "Failed to update user information. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleBack = () => {
        router.back()
    }

    const handleCancel = () => {
        router.push(`/dashboard/users/${user.id}`)
    }

    return (
        <div className="container mx-auto py-8 px-4 max-w-4xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" onClick={handleBack}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">Edit User</h1>
                        <p className="text-muted-foreground">Update user information and settings</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* User Profile Preview */}
                <div className="lg:col-span-1">
                    <Card>
                        <CardHeader className="text-center">
                            <div className="flex justify-center mb-4">
                                <Avatar className="h-24 w-24">
                                    <AvatarImage src={user.avtPath || "/placeholder.svg"} alt={user.fullName} />
                                    <AvatarFallback className="text-2xl">{getUserInitials(user.fullName)}</AvatarFallback>
                                </Avatar>
                            </div>
                            <CardTitle className="text-xl">{form.watch("fullName") || user.fullName}</CardTitle>
                            <CardDescription>@{form.watch("username") || user.username}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center text-sm text-muted-foreground">
                                <p>User ID: {user.id}</p>
                                <p>Created: {new Date(user.createdAt || "").toLocaleDateString()}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Edit Form */}
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>User Information</CardTitle>
                            <CardDescription>Update the user's personal and account information</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                    {/* Personal Information */}
                                    <div>
                                        <h3 className="text-lg font-medium mb-4">Personal Information</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <FormField
                                                control={form.control}
                                                name="fullName"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Full Name</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Enter full name" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="username"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Username</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Enter username" {...field} />
                                                        </FormControl>
                                                        <FormDescription>
                                                            Username must be unique and contain only letters, numbers, and underscores
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="gender"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Gender</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select gender" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {genderOptions.map((option) => (
                                                                    <SelectItem key={option.value} value={option.value}>
                                                                        {option.label}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="dateOfBirth"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Date of Birth</FormLabel>
                                                        <FormControl>
                                                            <Input type="date" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>

                                    <Separator />

                                    {/* Contact Information */}
                                    <div>
                                        <h3 className="text-lg font-medium mb-4">Contact Information</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <FormField
                                                control={form.control}
                                                name="email"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Email Address</FormLabel>
                                                        <FormControl>
                                                            <Input type="email" placeholder="Enter email address" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="phoneNumber"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Phone Number</FormLabel>
                                                        <FormControl>
                                                            <Input type="tel" placeholder="Enter phone number" {...field} />
                                                        </FormControl>
                                                        <FormDescription>Optional - Include country code if international</FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>

                                    <Separator />

                                    {/* Account Settings */}
                                    <div>
                                        <h3 className="text-lg font-medium mb-4">Account Settings</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <FormField
                                                control={form.control}
                                                name="role"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Role</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select role" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {roleOptions.map((option) => (
                                                                    <SelectItem key={option.value} value={option.value}>
                                                                        {option.label}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        <FormDescription>Determines user permissions and access level</FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>

                                    {/* Form Actions */}
                                    <div className="flex justify-end gap-4 pt-6">
                                        <Button type="button" variant="outline" onClick={handleCancel} disabled={isSubmitting}>
                                            Cancel
                                        </Button>
                                        <Button type="submit" disabled={isSubmitting}>
                                            {isSubmitting ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Updating...
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="mr-2 h-4 w-4" />
                                                    Update User
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

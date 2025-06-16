"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, Loader2, User } from "lucide-react"
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
import {register} from "@/lib/api/user";
import {IUserRegisterRequest} from "@/lib/request/user";
import {genderOptions, roleOptions} from "@/lib/utils";
import {useTranslations} from "next-intl";
import {CreateUserSchema} from "@/lib/validator";


// Get user initials for avatar fallback
const getUserInitials = (fullName: string): string => {
    if (!fullName) return "N/A"
    return fullName
        .split(" ")
        .map((name) => name.charAt(0))
        .join("")
        .toUpperCase()
        .slice(0, 2)
}


export default function UserCreatePageClient() {
    const router = useRouter()
    const { toast } = useToast()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const t = useTranslations()
    const createUserSchema = CreateUserSchema(t)
    type UserCreateFormData = z.infer<typeof createUserSchema>
    const form = useForm<UserCreateFormData>({
        resolver: zodResolver(createUserSchema),
        defaultValues: {
            username: "",
            email: "",
            phoneNumber: "",
            fullName: "",
            dateOfBirth: "",
            gender: '0',
            role: "USER",
            password: "",
            confirmPassword: "",
        },
    })

    const onSubmit = async (data: UserCreateFormData) => {
        setIsSubmitting(true)

        try {
            // Convert form data to match API expectations
            const createData = {
                confirmPassword: data.confirmPassword,
                username: data.username,
                email: data.email,
                phoneNumber: data.phoneNumber || undefined,
                fullName: data.fullName,
                dateOfBirth: data.dateOfBirth || undefined,
                gender: Number.parseInt(data.gender),
                role: data.role,
                password: data.password,
                avtPath: "", // Default empty avatar path
            } as IUserRegisterRequest

            // Create user via API
            const newUser = await register(createData)

            toast({
                title: "Success",
                description: `User "${data.fullName}" has been created successfully.`,
            })

            // Navigate to the new user's detail page or back to users list
            if (newUser && typeof newUser !== "string") {
                router.push(`/dashboard/users/${newUser.id}`)
            } else {
                router.push("/dashboard/users")
            }
        } catch (error: any) {
            console.error("Error creating user:", error)

            // Handle specific error messages
            let errorMessage = "Failed to create user. Please try again."
            if (error.message?.includes("username")) {
                errorMessage = "Username already exists. Please choose a different username."
            } else if (error.message?.includes("email")) {
                errorMessage = "Email already exists. Please use a different email address."
            }

            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleBack = () => {
        router.push("/dashboard/customers")
    }

    const handleCancel = () => {
        router.push("/dashboard/customers")
    }

    // Watch form values for live preview
    const watchedValues = form.watch()

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
                        <h1 className="text-2xl font-bold">Create New User</h1>
                        <p className="text-muted-foreground">Add a new user to the system</p>
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
                                    <AvatarImage src="/placeholder.svg" alt="New User" />
                                    <AvatarFallback className="text-2xl">{getUserInitials(watchedValues.fullName)}</AvatarFallback>
                                </Avatar>
                            </div>
                            <CardTitle className="text-xl">{watchedValues.fullName || "New User"}</CardTitle>
                            <CardDescription>@{watchedValues.username || "username"}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center text-sm text-muted-foreground">
                                <p>Role: {watchedValues.role || "Not selected"}</p>
                                <p>Email: {watchedValues.email || "Not provided"}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Password Requirements */}
                    <Card className="mt-6">
                        <CardHeader>
                            <CardTitle className="text-lg">Password Requirements</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-muted-foreground"></div>
                                <span>At least 8 characters long</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-muted-foreground"></div>
                                <span>One uppercase letter</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-muted-foreground"></div>
                                <span>One lowercase letter</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-muted-foreground"></div>
                                <span>One number</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Create Form */}
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                User Information
                            </CardTitle>
                            <CardDescription>Enter the new user's personal and account information</CardDescription>
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
                                                        <FormLabel>Full Name *</FormLabel>
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
                                                        <FormLabel>Username *</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Enter username" {...field} />
                                                        </FormControl>
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
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {genderOptions(t).map((option) => (
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
                                                        <FormDescription>Optional</FormDescription>
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
                                                        <FormLabel>Email Address *</FormLabel>
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
                                                        <FormLabel>Phone Number *</FormLabel>
                                                        <FormControl>
                                                            <Input type="tel" placeholder="Enter phone number" {...field} />
                                                        </FormControl>
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
                                                        <FormLabel>Role *</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select role" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {roleOptions(t).map((option) => (
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

                                    <Separator />

                                    {/* Password Settings */}
                                    <div>
                                        <h3 className="text-lg font-medium mb-4">Password Settings</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <FormField
                                                control={form.control}
                                                name="password"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Password *</FormLabel>
                                                        <FormControl>
                                                            <Input type="password" placeholder="Enter password" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="confirmPassword"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Confirm Password *</FormLabel>
                                                        <FormControl>
                                                            <Input type="password" placeholder="Confirm password" {...field} />
                                                        </FormControl>
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
                                                    Creating User...
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="mr-2 h-4 w-4" />
                                                    Create User
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

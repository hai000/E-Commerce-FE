"use client"

import {useState} from "react"
import {useRouter} from "next/navigation"
import {ArrowLeft, Loader2, Save, User} from "lucide-react"
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import * as z from "zod"

import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import {Separator} from "@/components/ui/separator"
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form"
import {useToast} from "@/hooks/use-toast"
import {createUserAdmin} from "@/lib/api/user";
import {CreateUserAdminRequest} from "@/lib/request/user";
import {genderOptions, getUserInitials, roleOptions} from "@/lib/utils";
import {useTranslations} from "next-intl";
import {CreateUserSchema} from "@/lib/validator";



export default function UserCreatePageClient() {
    const router = useRouter()
    const {toast} = useToast()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const t = useTranslations()
    const createUserSchema = CreateUserSchema(t)
    type UserCreateFormData = z.infer<typeof createUserSchema>
    const form = useForm<UserCreateFormData>({
        resolver: zodResolver(createUserSchema),
        mode:"onChange",
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
                email: data.email,
                phoneNumber: data.phoneNumber,
                dateOfBirth: data.dateOfBirth,
                fullName: data.fullName,
                gender: parseInt(data.gender)||0,
                password: data.password,
                role: data.role,
                username: data.username
            } as CreateUserAdminRequest

            // Create user via API
            const newUser = await createUserAdmin(createData)

            if (newUser && typeof newUser !== "string" && typeof newUser!== "undefined") {
                toast({
                    title: t("Toast.Success"),
                    description: `${t("User.User")} ${data.fullName} ${t('has been created successfully')}.`,
                    variant: "success",
                })
                router.push(`/dashboard/customers/${newUser.id}`)
            } else {
                toast({
                    title: t("Toast.Error"),
                    description: newUser,
                    variant: "success",
                })
            }
            // eslint-disable-next-line
        } catch (error: any) {

            toast({
                title: t("Toast.Error"),
                description: t("Failed to create user Please try again"),
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
        <div className="container mx-auto py-8 px-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" onClick={handleBack}>
                        <ArrowLeft className="h-4 w-4 mr-2"/>
                        {t('Back')}
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">{t('Create New User')}</h1>
                        <p className="text-muted-foreground">{t('Add a new user to the system')}</p>
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
                                    <AvatarImage src="/placeholder.svg" alt="New User"/>
                                    <AvatarFallback
                                        className="text-2xl">{getUserInitials(watchedValues.fullName)}</AvatarFallback>
                                </Avatar>
                            </div>
                            <CardTitle className="text-xl">{watchedValues.fullName || "New User"}</CardTitle>
                            <CardDescription>@{watchedValues.username || "username"}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center text-sm text-muted-foreground">
                                <p>{t('Role')}: {watchedValues.role || t("Not selected")}</p>
                                <p>Email: {watchedValues.email || t("Not provided")}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Password Requirements */}
                    {/*<Card className="mt-6">*/}
                    {/*    <CardHeader>*/}
                    {/*        <CardTitle className="text-lg">{t('Password Requirements')}</CardTitle>*/}
                    {/*    </CardHeader>*/}
                    {/*    <CardContent className="space-y-2 text-sm">*/}
                    {/*        <div className="flex items-center gap-2">*/}
                    {/*            <div className="w-2 h-2 rounded-full bg-muted-foreground"></div>*/}
                    {/*            <span>At least 8 characters long</span>*/}
                    {/*        </div>*/}
                    {/*        <div className="flex items-center gap-2">*/}
                    {/*            <div className="w-2 h-2 rounded-full bg-muted-foreground"></div>*/}
                    {/*            <span>One uppercase letter</span>*/}
                    {/*        </div>*/}
                    {/*        <div className="flex items-center gap-2">*/}
                    {/*            <div className="w-2 h-2 rounded-full bg-muted-foreground"></div>*/}
                    {/*            <span>One lowercase letter</span>*/}
                    {/*        </div>*/}
                    {/*        <div className="flex items-center gap-2">*/}
                    {/*            <div className="w-2 h-2 rounded-full bg-muted-foreground"></div>*/}
                    {/*            <span>One number</span>*/}
                    {/*        </div>*/}
                    {/*    </CardContent>*/}
                    {/*</Card>*/}
                </div>

                {/* Create Form */}
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5"/>
                                {t('User Information')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                    {/* Personal Information */}
                                    <div>
                                        <h3 className="text-lg font-medium mb-4">{t('Personal Information')}</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <FormField
                                                control={form.control}
                                                name="fullName"
                                                render={({field}) => (
                                                    <FormItem>
                                                        <FormLabel>{t('Full Name')} *</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder={t('Placeholder.Enter full name')} {...field} />
                                                        </FormControl>
                                                        <FormMessage/>
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="username"
                                                render={({field}) => (
                                                    <FormItem>
                                                        <FormLabel>{t('Username')} *</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder={t("Placeholder.Enter username")} {...field} />
                                                        </FormControl>
                                                        <FormMessage/>
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="gender"
                                                render={({field}) => (
                                                    <FormItem>
                                                        <FormLabel>{t('Gender')}</FormLabel>
                                                        <Select onValueChange={field.onChange}
                                                                defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue/>
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
                                                        <FormMessage/>
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="dateOfBirth"
                                                render={({field}) => (
                                                    <FormItem>
                                                        <FormLabel>{t('Date of Birth')}</FormLabel>
                                                        <FormControl>
                                                            <Input type="date" {...field} />
                                                        </FormControl>
                                                        <FormDescription>{t('Optional')}</FormDescription>
                                                        <FormMessage/>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>

                                    <Separator/>

                                    {/* Contact Information */}
                                    <div>
                                        <h3 className="text-lg font-medium mb-4">{t('Contact Information')}</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <FormField
                                                control={form.control}
                                                name="email"
                                                render={({field}) => (
                                                    <FormItem>
                                                        <FormLabel>Email *</FormLabel>
                                                        <FormControl>
                                                            <Input type="email"
                                                                   placeholder={t("Placeholder.Enter email")} {...field} />
                                                        </FormControl>
                                                        <FormMessage/>
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="phoneNumber"
                                                render={({field}) => (
                                                    <FormItem>
                                                        <FormLabel>{t('Checkout.Phone number')} *</FormLabel>
                                                        <FormControl>
                                                            <Input type="tel"
                                                                   placeholder={t("Placeholder.Enter phone number")} {...field} />
                                                        </FormControl>
                                                        <FormMessage/>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>

                                    <Separator/>

                                    {/* Account Settings */}
                                    <div>
                                        <h3 className="text-lg font-medium mb-4">{t('Account Settings')}</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <FormField
                                                control={form.control}
                                                name="role"
                                                render={({field}) => (
                                                    <FormItem>
                                                        <FormLabel>{t('Role')} *</FormLabel>
                                                        <Select onValueChange={field.onChange}
                                                                defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select role"/>
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
                                                        <FormMessage/>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>

                                    <Separator/>

                                    {/* Password Settings */}
                                    <div>
                                        <h3 className="text-lg font-medium mb-4">{t('Password Settings')}</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <FormField
                                                control={form.control}
                                                name="password"
                                                render={({field}) => (
                                                    <FormItem>
                                                        <FormLabel>{t('User.Password')} *</FormLabel>
                                                        <FormControl>
                                                            <Input type="password"
                                                                   placeholder={t("Placeholder.Enter password")} {...field} />
                                                        </FormControl>
                                                        <FormMessage/>
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="confirmPassword"
                                                render={({field}) => (
                                                    <FormItem>
                                                        <FormLabel>{t('User.Confirm Password')} *</FormLabel>
                                                        <FormControl>
                                                            <Input type="password"
                                                                   placeholder={t("User.Confirm Password")} {...field} />
                                                        </FormControl>
                                                        <FormMessage/>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>

                                    {/* Form Actions */}
                                    <div className="flex justify-end gap-4 pt-6">
                                        <Button type="button" variant="outline" onClick={handleCancel}
                                                disabled={isSubmitting}>
                                            {t('Cancel')}
                                        </Button>
                                        <Button type="submit" disabled={isSubmitting}>
                                            {isSubmitting ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                                    {t('Creating User')}...
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="mr-2 h-4 w-4"/>
                                                    {t('Create User')}

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

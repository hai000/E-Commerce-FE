"use client"

import { useState, useEffect } from "react"
import { Search, Plus, Edit, Trash2, Eye, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import type { IUser } from "@/lib/response/user"
import type { ArrayWithPage } from "@/lib/utils"
import { useRouter, useSearchParams } from "next/navigation"
import {useTranslations} from "next-intl";

// Gender mapping
const getGenderText = (gender: number): string => {
    switch (gender) {
        case 0:
            return "Female"
        case 1:
            return "Male"
        case 2:
            return "Other"
        default:
            return "Unknown"
    }
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

export default function UserManagementPageClient({
                                                     usersWithPage,
                                                 }: {
    usersWithPage: ArrayWithPage<IUser>
}) {
    const t = useTranslations()
    const router = useRouter()
    const searchParams = useSearchParams()
    const [users, setUsers] = useState<IUser[]>(usersWithPage.data)
    const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "")
    const [selectedRole, setSelectedRole] = useState(searchParams.get("role") || "all")

    // Pagination state
    const currentPage = usersWithPage.page || 1
    const totalPages = Math.ceil(usersWithPage.totalItem / usersWithPage.size)

    // Update users when data changes
    useEffect(() => {
        setUsers(usersWithPage.data)
    }, [usersWithPage.data])

    // Handle search
    const handleSearch = () => {
        const params = new URLSearchParams(searchParams.toString())
        if (searchTerm) {
            params.set("search", searchTerm)
        } else {
            params.delete("search")
        }
        params.set("page", "1") // Reset to first page
        router.push(`?${params.toString()}`)
    }

    // Handle role filter
    const handleRoleFilter = (role: string) => {
        setSelectedRole(role)
        const params = new URLSearchParams(searchParams.toString())
        if (role && role !== "all") {
            params.set("role", role)
        } else {
            params.delete("role")
        }
        params.set("page", "1") // Reset to first page
        router.push(`?${params.toString()}`)
    }

    // Handle page change
    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set("page", page.toString())
        router.push(`?${params.toString()}`)
    }

    // Handle user actions
    const handleViewUser = (userId: string) => {
        router.push(`/dashboard/customers/${userId}`)
    }

    const handleEditUser = (userId: string) => {
        router.push(`/dashboard/customers/edit/${userId}`)
    }

    const handleDeleteUser = async (userId: string) => {
        if (confirm("Are you sure you want to delete this user?")) {
            try {
                // Implement delete API call here
                // await deleteUser(userId)

                // Remove user from local state
                setUsers(users.filter((user) => user.id !== userId))
                // Show success message
                console.log("User deleted successfully")
            } catch (error) {
                console.error("Error deleting user:", error)
                // Show error message
            }
        }
    }

    // Format date
    const formatDate = (date: Date | string | undefined): string => {
        if (!date) return "N/A"
        return new Date(date).toLocaleDateString()
    }

    // Generate pagination items
    const renderPaginationItems = () => {
        const items = []
        const maxPageLinks = 5
        let startPage = 1
        let endPage = totalPages

        if (totalPages > maxPageLinks) {
            const halfWay = Math.ceil(maxPageLinks / 2)

            if (currentPage > halfWay) {
                startPage = Math.max(currentPage - halfWay + 1, 1)
                endPage = Math.min(startPage + maxPageLinks - 1, totalPages)
            } else {
                endPage = Math.min(maxPageLinks, totalPages)
            }

            if (endPage - startPage + 1 < maxPageLinks && startPage > 1) {
                startPage = Math.max(endPage - maxPageLinks + 1, 1)
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            items.push(
                <PaginationItem key={i}>
                    <PaginationLink onClick={() => handlePageChange(i)} isActive={currentPage === i}>
                        {i}
                    </PaginationLink>
                </PaginationItem>,
            )
        }

        if (startPage > 1) {
            items.unshift(
                <PaginationItem key="start-ellipsis">
                    <PaginationEllipsis />
                </PaginationItem>,
            )
        }

        if (endPage < totalPages) {
            items.push(
                <PaginationItem key="end-ellipsis">
                    <PaginationEllipsis />
                </PaginationItem>,
            )
        }

        return items
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <Card className="shadow-lg">
                <CardHeader>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <CardTitle className="text-2xl font-bold">{t('User Management')}</CardTitle>
                            <CardDescription>{t('Manage users and their information')}</CardDescription>
                        </div>
                        <Button onClick={() => router.push("/customers/users/create")} className="flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                           {t('Add User')}
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                            <div className="relative w-full md:w-80">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Search users..."
                                    className="pl-8 w-full"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                />
                            </div>
                            <Button onClick={handleSearch} variant="outline">
                                {t('Search')}
                            </Button>
                        </div>
                        <div className="flex gap-2 w-full md:w-auto">
                            <Select value={selectedRole} onValueChange={handleRoleFilter}>
                                <SelectTrigger className="w-[150px]">
                                    <SelectValue placeholder={t('Placeholder.Filter by role')} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">{t('All roles')}</SelectItem>
                                    <SelectItem value="admin">{t('Admin')}</SelectItem>
                                    <SelectItem value="user">{t('Customer')}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="rounded-md border overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>{t('User.User')}</TableHead>
                                    <TableHead className="hidden md:table-cell">{t('Contact')}</TableHead>
                                    <TableHead className="hidden lg:table-cell">{t('Gender')}</TableHead>
                                    <TableHead>{t('Role')}</TableHead>
                                    <TableHead className="hidden lg:table-cell">{t('Created')}</TableHead>
                                    <TableHead className="text-right">{t('Actions')}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.length > 0 ? (
                                    users.map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-10 w-10">
                                                        <AvatarImage src={user.avtPath || "/placeholder.svg"} alt={user.fullName} />
                                                        <AvatarFallback>{getUserInitials(user.fullName)}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <div className="font-medium">{user.fullName}</div>
                                                        <div className="text-sm text-muted-foreground">@{user.username}</div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                <div className="text-sm">
                                                    {user.email && <div>{user.email}</div>}
                                                    {user.phoneNumber && <div className="text-muted-foreground">{user.phoneNumber}</div>}
                                                </div>
                                            </TableCell>
                                            <TableCell className="hidden lg:table-cell">
                                                <span className="text-sm">{getGenderText(user.gender)}</span>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={getRoleColor(user.role) as any}>{user.role}</Badge>
                                            </TableCell>
                                            <TableCell className="hidden lg:table-cell">
                                                <span className="text-sm text-muted-foreground">{formatDate(user.createdAt)}</span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                            <span className="sr-only">Open menu</span>
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuItem onClick={() => handleViewUser(user.id)}>
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            View Details
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleEditUser(user.id)}>
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            Edit User
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem onClick={() => handleDeleteUser(user.id)} className="text-red-600">
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Delete User
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-24 text-center">
                                            {t('No users found')}.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {totalPages > 1 && (
                        <div className="mt-4">
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious
                                            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                                            aria-disabled={currentPage == 1}
                                            className={currentPage == 1 ? "pointer-events-none opacity-50" : ""}
                                        />
                                    </PaginationItem>

                                    {renderPaginationItems()}

                                    <PaginationItem>
                                        <PaginationNext
                                            onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                                            aria-disabled={currentPage == totalPages}
                                            className={currentPage == totalPages ? "pointer-events-none opacity-50" : ""}
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </div>
                    )}

                    <div className="mt-4 text-sm text-muted-foreground">
                        <p>
                            {t('Showing')} {usersWithPage.data.length}  {t('of')} {usersWithPage.totalItem} {t('users')}
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

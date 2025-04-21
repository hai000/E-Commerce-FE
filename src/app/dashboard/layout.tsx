import React from 'react'
import {Toaster} from "@/components/ui/toaster";
import {HeaderDashboard} from "@/app/dashboard/components/header-dashboard";
import {Search} from "@/app/dashboard/components/search";
import {AdminNav} from "@/app/dashboard/components/admin-nav";

export default function DashboardLayout({
                                            children,
                                        }: {
    children: React.ReactNode
}) {
    return (
        <div className='flex flex-col min-h-screen'>
            <div className="hidden flex-col md:flex">
                <div className="border-b">
                    <div className="flex h-16 items-center px-4">
                        <HeaderDashboard className="mx-6"/>
                        <div className="ml-auto flex items-center space-x-4">
                            <Search/>
                            <AdminNav/>
                        </div>
                    </div>
                </div>
                <main className='flex-1 flex flex-col p-4'>{children}</main>
                <Toaster/>
            </div>
        </div>
    )
}
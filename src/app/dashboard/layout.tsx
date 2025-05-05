"use client"
import React from 'react'
import {Toaster} from "@/components/ui/toaster";
import {HeaderDashboard} from "@/app/dashboard/components/header-dashboard";
import {AdminNav} from "@/app/dashboard/components/admin-nav";

import { usePathname} from "next/navigation";

export default function DashboardLayout({
                                            children,
                                        }: {
    children: React.ReactNode
}) {

    const pathname = usePathname();
    const pathAfterDashboard = pathname.split('/dashboard/')[1];
    return (
        <div className='flex flex-col min-h-screen'>
            <div className="flex-col flex-row">
                <div className="border-b">
                    <div className="bg-primary  text-white flex pt-4 pb-4 justify-between items-center px-4 md:flex-wrap flex-wrap">
                        <HeaderDashboard property={pathAfterDashboard} className=" mx-6"/>
                        <div className="mx-6 flex items-center md:space-x-4 ">
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
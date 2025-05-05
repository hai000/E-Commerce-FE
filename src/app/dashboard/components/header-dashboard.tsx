import Link from "next/link"

import { cn } from "@/lib/utils"

export function HeaderDashboard({
                            className,
                            ...props
                        }: React.HTMLAttributes<HTMLElement>) {
    return (
        <nav
            className={cn("flex items-center space-x-4 lg:space-x-6", className)}
            {...props}
        >
            <Link
                href="/dashboard/overview"
                className={cn("text-sm font-medium transition-colors hover:text-secondary",props.property?.startsWith("overview")|| typeof props.property === "undefined"?"": "text-secondary-foreground" )}
            >
                Overview
            </Link>
            <Link
                href="/dashboard/customers"
                className={cn("text-sm font-medium transition-colors hover:text-secondary",props.property?.startsWith("customers")?"": "text-secondary-foreground")}
            >
                Customers
            </Link>
            <Link
                href="/dashboard/products"
                className={cn("text-sm font-medium transition-colors hover:text-secondary",props.property?.startsWith("products")?"": "text-secondary-foreground")}
            >
                Products
            </Link>
        </nav>
    )
}
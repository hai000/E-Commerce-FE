'use client'
import Link from "next/link"

import { cn } from "@/lib/utils"
import {useTranslations} from "next-intl";

export function HeaderDashboard({
                            className,
                            ...props
                        }: React.HTMLAttributes<HTMLElement>) {
    const t = useTranslations()
    return (
        <nav
            className={cn("flex items-center space-x-4 lg:space-x-6", className)}
            {...props}
        >
            <Link
                href="/dashboard/overview"
                className={cn("text-sm font-medium transition-colors hover:text-secondary",props.property?.startsWith("overview")|| typeof props.property === "undefined"?"": "text-secondary-foreground" )}
            >
                {t('Overview')}
            </Link>
            <Link
                href="/dashboard/customers"
                className={cn("text-sm font-medium transition-colors hover:text-secondary",props.property?.startsWith("customers")?"": "text-secondary-foreground")}
            >
                {t('Customers')}
            </Link>
            <Link
                href="/dashboard/products"
                className={cn("text-sm font-medium transition-colors hover:text-secondary",props.property?.startsWith("products")?"": "text-secondary-foreground")}
            >
                {t('Products')}
            </Link>
            <Link
                href="/dashboard/product-quantities"
                className={cn("text-sm font-medium transition-colors hover:text-secondary",props.property?.startsWith("product-quantities")?"": "text-secondary-foreground")}
            >
                {t('Product Quantities')}
            </Link>
        </nav>
    )
}
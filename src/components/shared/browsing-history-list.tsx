'use client'
import useBrowsingHistory from '@/hooks/use-browsing-history'
import React, { useEffect } from 'react'
import { Separator } from '../ui/separator'
import {ArrayWithPage, cn} from '@/lib/utils'
import ProductSlider from "@/components/shared/product/product-carousel";
import { useTranslations } from 'next-intl'
import {HOST_API} from "@/lib/constants";
import {IProduct} from "@/lib/response/product";
export default function BrowsingHistoryList({
                                                className,
                                            }: {
    className?: string
}) {
    const t = useTranslations('Home')
    return (
            <div className='bg-background'>
                <Separator className={cn('mb-4', className)} />
                <ProductList
                    title={t('Your browsing history')}
                    type='history'
                />
            </div>

    )
}

function ProductList({
                         title,
                         type = 'history',
                         hideDetails = false,
                     }: {
    title: string
    type: 'history' | 'related'
    hideDetails?: boolean
}) {
    const { products } = useBrowsingHistory()
    const [data, setData] = React.useState<IProduct[]>([])
    useEffect(() => {
        const fetchProducts = async () => {
            if (type === 'related') {

            }else if (type === 'history') {
                const res = await fetch(`${HOST_API}/identity/products/history`)
                if (res.ok) {
                    const products = (await res.json()).data as ArrayWithPage<IProduct>
                    setData(products.data)
                } else {
                    setData([])
                }
            }
        }
       fetchProducts()
    }, [products, type])
    console.log("data",data)
    return (
        data.length > 0 && (
            <ProductSlider
                title={title}
                products={data}
                hideDetails={hideDetails}
            />
        )
    )
}
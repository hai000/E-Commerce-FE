'use client'

import {useCurrency} from "@/hooks/use-currency"
import {cn} from "@/lib/utils"
import {useTranslations} from "next-intl";

function formatCurrency(amount: number, currency: string) {
    return new Intl.NumberFormat(undefined, {style: "currency", currency}).format(amount);
}

const ProductPrice = ({
                          price,
        //eslint-disable-next-line
                          isDeal,
                          className,
                          discount = 0,
                          plain = false,
                      }: {
    isDeal?: boolean
    price: number
    discount?: number
    className?: string
    plain?: boolean
}) => {
    const t = useTranslations()
    const {currency, rates, isReady} = useCurrency();
    if (!isReady) return <span>...</span>;
    const rate = rates?.[currency] || 1
    const finalPrice = price * rate

    // Xử lý discount nếu có
    const hasDiscount = discount > 0
    const discountedPrice = hasDiscount ? finalPrice * (1 - discount / 100) : finalPrice


    if (plain) return <span className={className}>{formatCurrency(discountedPrice, currency)}</span>
    return (
        <div>
            <div className='flex justify-center gap-3'>
                {hasDiscount && (
                    <div className='text-2xl content-center text-red-700'>-{discount}%</div>
                )}
                <div className={cn('text-3xl', className)}>
                    {formatCurrency(discountedPrice, currency)}
                </div>
            </div>
            {hasDiscount && (
                <div className='text-lg text-muted-foreground line-through'>
                    {t('Origin price')}:  {formatCurrency(finalPrice, currency)}
                </div>
            )}
        </div>
    )
}

export default ProductPrice
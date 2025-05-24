'use client'
import { cn, formatCurrency } from '@/lib/utils'

const ProductPrice = ({
                          price,
                          className,
                          discount = 0,
                          isDeal = false,
                          forListing = true,
                          plain = false,
                      }: {
    price: number
    isDeal?: boolean
    discount?: number
    className?: string
    forListing?: boolean
    plain?: boolean
}) => {
    const discountPercent = discount
    const stringValue = `${price}`
    const [intValue, floatValue] = stringValue.includes('.')
        ? stringValue.split('.')
        : [stringValue, '']

    return plain ? (
        formatCurrency(price)
    ) : (
        <div className=''>
            <div className='flex justify-center gap-3'>
                {discountPercent>0 && <div className='text-3xl text-orange-700'>-{discountPercent}%</div>}
                <div className={cn('text-3xl', className)}>
                    <span className='text-xs align-super'>$</span>
                    {intValue}
                    <span className='text-xs align-super'>{floatValue}</span>
                </div>
            </div>
        </div>
    )
}

export default ProductPrice
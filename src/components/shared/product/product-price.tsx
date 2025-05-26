'use client'
import { cn, formatCurrency } from '@/lib/utils'

const ProductPrice = ({
                          price,
                          // eslint-disable-next-line @typescript-eslint/no-unused-vars
                          isDeal,
                          className,
                          discount = 0,
                          plain = false,
                      }: {
    isDeal?:boolean
    price: number
    discount?: number
    className?: string
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
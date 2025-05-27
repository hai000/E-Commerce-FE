'use client'
import ProductPrice from '@/components/shared/product/product-price'
import {buttonVariants} from '@/components/ui/button'
import {Card, CardContent} from '@/components/ui/card'
import {cn} from '@/lib/utils'
import {CheckCircle2Icon} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import {notFound} from 'next/navigation'
import useCartStore from '@/hooks/use-cart-store'
import BrowsingHistoryList from '@/components/shared/browsing-history-list'
import {useTranslations} from "next-intl";

export default function CartAddItem({itemId}: { itemId: string }) {
    const {
        cart: {cartItems, itemsPrice},
    } = useCartStore()
    const t = useTranslations()
    const item = cartItems.find((x) => x.id == itemId)
    if (!item) return notFound()
    return (
        <div>
            <div className='grid grid-cols-1 md:grid-cols-2 md:gap-4'>
                <Card className='w-full rounded-none'>
                    <CardContent className='flex h-full items-center justify-center  gap-3 py-4'>
                        <Link href={`/product/${item.slug}`}>
                            <Image
                                src={item.images[0]}
                                alt={item.productName}
                                width={80}
                                height={80}
                                style={{
                                    maxWidth: '100%',
                                    height: 'auto',
                                }}
                            />
                        </Link>
                        <div>
                            <h3 className='text-xl font-bold flex gap-2 my-2'>
                                <CheckCircle2Icon className='h-6 w-6 text-green-700'/>
                                {t('Cart.Added to cart')}
                            </h3>
                            {item.color?.colorName ? <p className='text-sm'>
                                <span className='font-bold'>{t('Product.Color')}: </span>{' '}
                                {item.color.colorName ?? '-'}
                            </p> : <div/>}
                            {
                                item.size?.size ? <p className='text-sm'>
                                    <span className='font-bold'>{t('Product.Size')}: </span>{' '}
                                    {item.size.size ?? '-'}
                                </p> : <div/>
                            }

                        </div>
                    </CardContent>
                </Card>
                <Card className='w-full rounded-none'>
                    <CardContent className='p-4 h-full'>
                        <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
                            <div className='flex justify-center items-center'>
                                <div className='flex items-center'>
                                    <div>
                                        {t('Cart.Choose this option at checkout')}.
                                    </div>
                                </div>
                            </div>
                            <div className='lg:border-l lg:border-muted lg:pl-3 flex flex-col items-center gap-3  '>
                                <div className='flex gap-3'>
                                    <span className='text-lg font-bold'> {t('Cart.Cart Subtotal')}:</span>
                                    <ProductPrice className='text-2xl' price={itemsPrice}/>
                                </div>
                                <Link
                                    href='/checkout'
                                    className={cn(buttonVariants(), 'rounded-full w-full')}
                                >
                                    {t('Cart.Proceed to checkout')} (
                                    {cartItems.reduce((a, c) => a + c.cartItemQuantity, 0)} items)
                                </Link>
                                <Link
                                    href='/cart'
                                    className={cn(
                                        buttonVariants({variant: 'outline'}),
                                        'rounded-full w-full'
                                    )}
                                >
                                    {t('Cart.Go to Cart')}
                                </Link>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <BrowsingHistoryList/>
        </div>
    )
}
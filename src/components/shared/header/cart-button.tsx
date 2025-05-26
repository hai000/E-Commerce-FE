'use client'

import { ShoppingCartIcon } from 'lucide-react'
import Link from 'next/link'
import useIsMounted from '@/hooks/use-is-mounted'
import { cn } from '@/lib/utils'
import useCartStore from '@/hooks/use-cart-store'
import {useTranslations} from "next-intl";

export default function CartButton() {
    const isMounted = useIsMounted()
    const {
        cart: { cartItems },
    } = useCartStore()
    const t = useTranslations()
    const cartItemsCount = cartItems.reduce((a, c) => a + c.cartItemQuantity, 0)
    return (
        <Link href='/cart' className='px-1 header-button'>
            <div className='flex items-end text-xs relative'>
                <ShoppingCartIcon className='h-8 w-8' />
                {isMounted && (
                    <span
                        className={cn(
                            `bg-black  px-1 rounded-full text-primary text-base font-bold absolute right-[30px] top-[-4px] z-10`,
                            cartItemsCount >= 10 && 'text-sm px-0 p-[1px]'
                        )}
                    >
            {cartItemsCount}
          </span>
                )}
                <span className='font-bold'>{t('Cart.Cart')}</span>
            </div>
        </Link>
    )
}
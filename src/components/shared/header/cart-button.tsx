'use client'

import { ShoppingCartIcon } from 'lucide-react'
import Link from 'next/link'
import useIsMounted from '@/hooks/use-is-mounted'
import useCartStore from '@/hooks/use-cart-store'

export default function CartButton() {
    const isMounted = useIsMounted()
    const {
        cart: { cartItems },
    } = useCartStore()
    const cartItemsCount = cartItems.reduce((a, c) => a + c.cartItemQuantity, 0)
    return (
        <Link href='/cart' className='px-1 header-button'>
            <div className='flex items-end text-lg relative'>
                <ShoppingCartIcon className='h-8 w-8' />
                {isMounted && (<p>{cartItemsCount}</p>)}
            </div>
        </Link>
    )
}
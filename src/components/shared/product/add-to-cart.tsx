'use client'

import { Button } from '@/components/ui/button'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import useCartStore from '@/hooks/use-cart-store'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import {CartItem} from "@/lib/response/cart";

export default function AddToCart({
                                      item,
                                      minimal = false,
                                  }: {
    item: CartItem
    minimal?: boolean
}) {
    const router = useRouter()
    const { toast } = useToast()

    const { addItem } = useCartStore()

    const [quantity, setQuantity] = useState(1)

    return minimal ? (
        <Button
            className='rounded-full w-auto'
            onClick={ async () => {
                try {
                    await addItem(item, 1)
                    toast({
                        description: 'Added to Cart',
                        action: (
                            <Button
                                onClick={() => {
                                    router.push('/cart')
                                }}
                            >
                                Go to Cart
                            </Button>
                        ),
                    })

                } catch (
                    // @ts-expect-error Expected type mismatch due to legacy code
                    error: Error) {
                    toast({
                        variant: 'destructive',
                        description: error.message,
                    })
                }
            }}
        >
            Add to Cart
        </Button>
    ) : (
        <div className='w-full space-y-2'>
            <Select
                value={quantity.toString()}
                onValueChange={(i) => setQuantity(Number(i))}
            >
                <SelectTrigger className=''>
                    <SelectValue>Quantity: {quantity}</SelectValue>
                </SelectTrigger>
                <SelectContent position='popper'>
                    {Array.from({ length: item.productQuantity }).map((_, i) => (
                        <SelectItem key={i + 1} value={`${i + 1}`}>
                            {i + 1}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Button
                className='rounded-full w-full'
                type='button'
                onClick={async () => {
                    try {
                        const itemId = await addItem(item, quantity)
                        router.push(`/cart/${itemId}`)
                    } catch (
                        // @ts-expect-error Expected type mismatch due to legacy code
                        error: Error) {
                        toast({
                            variant: 'destructive',
                            description: error.message,
                        })
                    }
                }}
            >
                Add to Cart
            </Button>
            <Button
                variant='secondary'
                onClick={async () => {
                    try {
                        await addItem(item, quantity)
                        router.push(`/checkout`)
                    } catch (
                        // @ts-expect-error Expected type mismatch due to legacy code
                        error: Error) {
                        console.log("Error in 108 add-to-cart.tsx" )
                        toast({
                            variant: 'destructive',
                            description: error.message,
                        })
                    }
                }}
                className='w-full rounded-full '
            >
                Buy Now
            </Button>
        </div>
    )
}
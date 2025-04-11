import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {IProduct} from "@/lib/model/product";

export default function SelectVariant({
                                          product,
                                          size,
                                          color,
                                      }: {
    product: IProduct
    color: string
    size: string
}) {
    const selectedColor = color || product.colors[0].id
    const selectedSize = size || product.sizes[0].size

    // @ts-ignore
    return (
        <>
            {product.colors.length > 0 && (
                <div className='space-x-2 space-y-2'>
                    <div>Color:</div>
                    {product.colors.map(colorObject  => (
                        <Button
                            asChild
                            variant='outline'
                            className={
                                selectedColor == colorObject.id ? 'border-2 border-primary' : 'border-2'
                            }
                            key={colorObject.id}
                        >
                            <Link
                                replace
                                scroll={false}
                                href={`?${new URLSearchParams({
                                    color: colorObject.id,
                                    size: selectedSize,
                                })}`}
                                key={colorObject.id}
                            >
                                <div
                                    style={{ backgroundColor: colorObject.colorCode }}
                                    className='h-4 w-4 rounded-full border border-muted-foreground'
                                ></div>
                                {colorObject.colorName}
                            </Link>
                        </Button>
                    ))}
                </div>
            )}
            {product.sizes.length > 0 && (
                <div className='mt-2 space-x-2 space-y-2'>
                    <div>Size:</div>
                    {product.sizes.map(sizeObject => (
                        <Button
                            asChild
                            variant='outline'
                            className={
                                selectedSize === sizeObject.size ? 'border-2  border-primary' : 'border-2  '
                            }
                            key={sizeObject.size}
                        >
                            <Link
                                replace
                                scroll={false}
                                href={`?${new URLSearchParams({
                                    color: selectedColor,
                                    size: sizeObject.size,
                                })}`}
                            >
                                {sizeObject.size}
                            </Link>
                        </Button>
                    ))}
                </div>
            )}
        </>
    )
}
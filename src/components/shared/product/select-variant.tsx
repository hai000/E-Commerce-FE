import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {IProduct} from "@/lib/response/product";

export default function SelectVariant({
                                          product,
                                          colorId,
                                          sizeId,
                                          color,
                                          size,
                                      }: {
    product: IProduct
    colorId: string
    sizeId: string
    color: string
    size: string
}) {
    const selectedColorId = colorId
    const selectedSizeId = sizeId
    const selectedColor = color
    const selectedSize = size
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
                                selectedColorId == colorObject.id ? 'border-2 border-primary' : 'border-2'
                            }
                            key={colorObject.id}
                        >
                            <Link
                                replace
                                scroll={false}
                                href={`?${new URLSearchParams({
                                    colorId: colorObject.id,
                                    sizeId: selectedSizeId,
                                    color: colorObject.colorName,
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
                                selectedSizeId == sizeObject.id ? 'border-2  border-primary' : 'border-2  '
                            }
                            key={sizeObject.id}
                        >
                            <Link
                                replace
                                scroll={false}
                                href={`?${new URLSearchParams({
                                    colorId: selectedColorId,
                                    sizeId: sizeObject.id,
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
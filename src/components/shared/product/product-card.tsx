import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import {Card, CardContent, CardFooter, CardHeader} from '@/components/ui/card'

import Rating from './rating'
import {formatNumber, round2} from '@/lib/utils'
import ProductPrice from './product-price'
import ImageHover from "@/components/shared/product/image-hover";
import {IProduct} from "@/lib/response/product";
import AddToCart from "@/components/shared/product/add-to-cart";
const ProductCard = ({
                         product,
                         hideBorder = false,
                         hideDetails = false,
                         hideAddToCart = false,
                     }: {
    product: IProduct
    hideDetails?: boolean
    hideBorder?: boolean
    hideAddToCart?: boolean
}) => {
    const ProductImage = () => (
        <Link href={`/product/${product.id}`}>
            <div className='relative h-52'>
                {product.images.length > 1 ? (
                    <ImageHover
                        src={product.images[0].imagePath}
                        hoverSrc={product.images[1].imagePath}
                        alt={product.name}
                    />
                ) : (
                    <div className='relative h-52'>
                        <Image
                            src={product.images[0].imagePath}
                            alt={product.name}
                            fill
                            sizes='80vw'
                            className='object-contain'
                        />
                    </div>
                )}
            </div>
        </Link>
    )
    const ProductDetails = () => (
        <div className='flex-1 space-y-2'>
            <p className='font-bold'>{product.brand}</p>
            <Link
                href={`/product/${product.id}`}
                className='overflow-hidden text-ellipsis'
                style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                }}
            >
                {product.name}
            </Link>
            <div className='flex gap-2 justify-center'>
                <Rating rating={product.avgRating} />
                <span>({formatNumber(product.numReviews)})</span>
            </div>

            <ProductPrice
                isDeal={product.tags.includes('todays-deal')}
                price={product.defaultPrice}
            />
        </div>
    )
    const AddButton = () => (
        <div className='w-full text-center'>
            <AddToCart
                minimal
                item={{
                    id: '',
                    productId: product.id,
                    productName: product.name,
                    size: product.sizes?.[0],
                    color: product.colors?.[0],
                    productQuantity: product.quantity,
                    slug: product.slug,
                    category: product.category,
                    price: round2(product.defaultPrice),
                    cartItemQuantity: 1,
                    images: product.images.map(x=> x.imagePath),
                    description: product.description,
                    brand: product.brand,
                    discount:product.defaultDiscount,
                    published: product.published
                }}
            />
        </div>
    )
    return hideBorder ? (
        <div className='flex flex-col'>
            <ProductImage />
            {!hideDetails && (
                <>
                    <div className='p-3 flex-1 text-center'>
                        <ProductDetails />
                    </div>
                    {!hideAddToCart && <AddButton/>}
                </>
            )}
        </div>
    ) : (
        <Card className='flex flex-col  '>
            <CardHeader className='p-3'>
                <ProductImage />
            </CardHeader>
            {!hideDetails && (
                <>
                    <CardContent className='p-3 flex-1  text-center'>
                        <ProductDetails />
                    </CardContent>
                    <CardFooter className='p-3'>
                        {!hideAddToCart && <AddButton/>}
                    </CardFooter>
                </>
            )}
        </Card>
    )
}

export default ProductCard
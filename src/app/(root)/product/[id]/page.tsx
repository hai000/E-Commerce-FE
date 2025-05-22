import { Card, CardContent } from '@/components/ui/card'
import {
    getProductById,
    getRelatedProductsByCategory,
} from '@/lib/api/product'
import AddToCart from '@/components/shared/product/add-to-cart'
import SelectVariant from '@/components/shared/product/select-variant'
import ProductPrice from '@/components/shared/product/product-price'
import ProductGallery from '@/components/shared/product/product-gallery'
import { Separator } from '@/components/ui/separator'
import Rating from "@/components/shared/product/rating";
import ProductSlider from "@/components/shared/product/product-carousel";
import BrowsingHistoryList from "@/components/shared/browsing-history-list";
import AddToBrowsingHistory from "@/components/shared/product/add-to-browsing-history";
import {IProductColor, IProductSize} from "@/lib/response/product";
import {Toaster} from "@/components/ui/toaster";

export async function generateMetadata(props: {
    params: Promise<{ id: string }>
}) {
    const params = await props.params
    const product = await getProductById(params.id)
    if (typeof product === "string") {
        return { title: 'Product not found' }
    }
    return {
        title: product.name,
        description: product.description,
    }
}

export default async function ProductDetails(props: {
    params: Promise<{ id: string }>,
    searchParams: Promise<{page: string; colorId: string; sizeId: string; color:string,size:string }>
}) {
    const {page, colorId, sizeId, color, size } = await props.searchParams
    const colorNow = colorId ? {
        id: colorId,
        colorName: color,
        color: '',
    } as unknown as IProductColor : undefined
    const sizeNow = sizeId ? {
        id: sizeId,
        size: size,
        description: '',
    } as unknown as IProductSize : undefined
    const { id } = await props.params

    const product = await getProductById(id)
    if (typeof product === 'string') {
        return<div>Product not found or an error occurred.</div>
    }
    const relatedProducts = await getRelatedProductsByCategory({
        categoryId: product.category.id,
        productId: product.id,
        page: Number(page || '1'),
    })

    return (
        <div>
            <AddToBrowsingHistory id={product.id} category={product.category.name}/>
            <section>
                <div className='grid grid-cols-1 md:grid-cols-5  '>
                    <div className='col-span-2'>
                        <ProductGallery images={product.images.map(images => images.imagePath)} />
                    </div>

                    <div className='flex w-full flex-col gap-2 md:p-5 col-span-2'>
                        <div className='flex flex-col gap-3'>
                            <p className='p-medium-16 rounded-full bg-grey-500/10   text-grey-500'>
                                Brand {product.brand} {product.category.name}
                            </p>
                            <h1 className='font-bold text-lg lg:text-xl'>
                                {product.name}
                            </h1>
                            <div className='flex items-center gap-2'>
                                <span>{product.avgRating.toFixed(1)}</span>
                                <Rating rating={product.avgRating} />
                                <span>{product.numReviews} ratings</span>
                            </div>
                            <Separator />
                            <div className='flex flex-col gap-3 sm:flex-row sm:items-center'>
                                <div className='flex gap-3'>
                                    <ProductPrice
                                        price={product.defaultPrice}
                                        isDeal={product.tags.includes('todays-deal')}
                                        forListing={false}
                                    />
                                </div>
                            </div>
                        </div>
                        <div>
                            <SelectVariant
                                product={product}
                                colorId={colorId || product.colors?.[0]?.id || '' }
                                sizeId={sizeId || product.sizes?.[0]?.id || ''}
                                color={color||product.colors?.[0]?.colorName || ''}
                                size={size || product.sizes?.[0]?.size || ''}
                            />
                        </div>
                        <Separator className='my-2' />
                        <div className='flex flex-col gap-2'>
                            <p className='p-bold-20 text-grey-600'>Description:</p>
                            <p className='p-medium-16 lg:p-regular-18'>
                                {product.description}
                            </p>
                        </div>
                    </div>
                    <div>
                        <Card>
                            <CardContent className='p-4 flex flex-col  gap-4'>
                                <ProductPrice price={product.defaultPrice} />

                                {product.quantity > 0 && product.quantity <= 3 && (
                                    <div className='text-destructive font-bold'>
                                        {`Only ${product.quantity} left in stock - order soon`}
                                    </div>
                                )}
                                {product.quantity !== 0 ? (
                                    <div className='text-green-700 text-xl'>In Stock</div>
                                ) : (
                                    <div className='text-destructive text-xl'>
                                        Out of Stock
                                    </div>
                                )}
                                {product.quantity !== 0 && (
                                    <div className='flex justify-center items-center'>
                                        <AddToCart
                                            item={{
                                                id: '',
                                                productId: product.id,
                                                productName: product.name,
                                                slug: product.slug,
                                                price: product.defaultPrice,
                                                discount: product.defaultDiscount,
                                                published: product.published,
                                                category: product.category,
                                                color: colorNow || product.colors?.[0],
                                                size: sizeNow || product.sizes?.[0],
                                                images: product.images.map(x => x.imagePath),
                                                description: product.description,
                                                brand: product.brand,
                                                cartItemQuantity: product.quantity,
                                                productQuantity: product.quantity,
                                            }}
                                        />
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            <section className='mt-10'>
                <ProductSlider
                    products={relatedProducts.data}
                    title={`Best Sellers in ${product.category.name}`}
                />
            </section>

            <section>
                <BrowsingHistoryList className='mt-10' />
            </section>
            <Toaster/>
        </div>
    )
}
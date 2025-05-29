'use client'
import useCartStore from "@/hooks/use-cart-store";
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import Link from "next/link";
import {APP_NAME} from "@/lib/constants";
import Image from "next/image";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Button} from "@/components/ui/button";
import ProductPrice from "@/components/shared/product/product-price";
import BrowsingHistoryList from "@/components/shared/browsing-history-list";
import React from "react";
import {useRouter} from "next/navigation";
import {Checkbox} from "@/components/ui/checkbox";
import {toast} from "@/hooks/use-toast";
import {useTranslations} from "next-intl";

export default function CartPageClient() {
    const {
        cart: {cartItems, itemsPrice},
        checkCartItems,
        updateItem,
        removeItem,
    } = useCartStore()
    const router = useRouter()
    const t = useTranslations()
    return (<div>
            <div className='grid grid-cols-1 md:grid-cols-4  md:gap-4'>
                {cartItems.length === 0 ? (
                    <Card className='col-span-4 rounded-none'>
                        <CardHeader className='text-3xl  '>
                            {t('Cart.Your cart is empty')}
                        </CardHeader>
                        <CardContent>
                            {t('Cart.Continue shopping on')} <Link href='/'>{APP_NAME}</Link>
                        </CardContent>
                    </Card>
                ) : (
                    <>
                        <div className='col-span-3'>
                            <Card className='rounded-md'>
                                <CardHeader className='text-3xl font-medium pb-0'>
                                    {t('Cart.Shopping Cart')}
                                </CardHeader>
                                <CardContent className='p-4'>
                                    <div className='flex justify-end font-bold border-b mb-4'>{t('Price')}</div>

                                    {cartItems.map((item) => (
                                        <div
                                            key={item.id}
                                            className='flex flex-col md:flex-row justify-between md:items-center lg:items-center py-4 border-b gap-4'
                                        >
                                            <Checkbox className='w-9 h-9 align-items: center'
                                                      defaultChecked={item.isChecked}
                                                      onCheckedChange={(checkedState) => {
                                                          if (typeof checkedState.valueOf() == "boolean") {
                                                              checkCartItems(checkedState.valueOf() as boolean, item.id)
                                                          }

                                                      }} id={item.id}/>

                                            <Link href={`/product/${item.productId}`}>
                                                <div className='relative w-40 h-40'>
                                                    <Image
                                                        src={item.images[0]}
                                                        alt={item.productName}
                                                        fill
                                                        sizes='20vw'
                                                        style={{
                                                            objectFit: 'contain',
                                                        }}
                                                    />
                                                </div>
                                            </Link>

                                            <div className='flex-1 space-y-4'>
                                                <Link
                                                    href={`/product/${item.productId}`}
                                                    className='font-bold text-lg hover:no-underline  '
                                                >
                                                    {item.productName}
                                                </Link>
                                                <div>
                                                    {
                                                        item.color ? <p className='text-sm'>
                                                            <span
                                                                className='font-bold'>{t('Product.Color')}: </span>{' '}
                                                            {item.color.colorName}
                                                        </p> : <div/>
                                                    }
                                                    {
                                                        item.size ? <p className='text-sm'>
                                                            <span
                                                                className='font-bold'>{t('Product.Size')}: </span>{' '}
                                                            {item.size.size}
                                                        </p> : <div/>
                                                    }

                                                </div>
                                                <div className='flex gap-2 items-center'>
                                                    <Select
                                                        value={item.cartItemQuantity.toString()}
                                                        onValueChange={(value) =>
                                                            updateItem(item, Number(value))
                                                        }
                                                    >
                                                        <SelectTrigger className='w-auto'>
                                                            <SelectValue>
                                                                {t('Cart.Quantity')}: {item.cartItemQuantity}
                                                            </SelectValue>
                                                        </SelectTrigger>
                                                        <SelectContent position='popper'>
                                                            {Array.from({
                                                                length: item.productQuantity,
                                                            }).map((_, i) => (
                                                                <SelectItem key={i + 1} value={`${i + 1}`}>
                                                                    {i + 1}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <Button
                                                        variant={'outline'}
                                                        onClick={() => removeItem(item)}
                                                    >
                                                        {t('Delete')}
                                                    </Button>
                                                </div>
                                            </div>
                                            <div>
                                                <p className='text-right'>
                                                    {item.cartItemQuantity > 1 && (
                                                        <>
                                                            {item.cartItemQuantity} x
                                                            <ProductPrice price={item.price} plain/>
                                                            <br/>
                                                        </>
                                                    )}

                                                    <span className='font-bold text-lg'>
                            <ProductPrice
                                price={item.price * item.cartItemQuantity}
                                plain
                            />
                          </span>
                                                </p>
                                            </div>
                                        </div>
                                    ))}

                                    <div className='flex justify-end text-lg my-2'>
                                        {t('Subtotal')} (
                                        {cartItems.reduce((acc, item) => acc + item.cartItemQuantity, 0)}{' '}
                                        {t('Items')}):{' '}
                                        <span className='font-bold ml-1'>
                      <ProductPrice price={itemsPrice} plain/>
                    </span>{' '}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                        <div>
                            <Card className='rounded-md'>
                                <CardContent className='py-4 space-y-4'>
                                    <div className='flex-1'>
                                        {t('Cart.Choose this option at checkout')}
                                    </div>
                                    <div className='text-lg'>
                                        {t('Subtotal')} (
                                        {cartItems.reduce((acc, item) => acc + item.cartItemQuantity, 0)}{' '}
                                        {t('Items')}):{' '}
                                        <span className='font-bold'>
                      <ProductPrice price={itemsPrice} plain/>
                    </span>{' '}
                                    </div>
                                    <Button
                                        onClick={() => {
                                            const hasBuy = cartItems.find(cartItem => cartItem.isChecked)
                                            if (hasBuy) {
                                                toast({
                                                    title: t('Toast.Success'),
                                                    description: t('Cart.Lets check out'),
                                                    variant: 'success',
                                                })
                                                router.push('/checkout')
                                            } else {
                                                toast({
                                                    title: t('Toast.Error'),
                                                    description: t('Cart.Please select your item'),
                                                    variant: 'destructive',
                                                })
                                            }
                                        }
                                        }
                                        className='rounded-full w-full'
                                    >
                                        {t('Cart.Proceed to checkout')}
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </>
                )}
            </div>
            <BrowsingHistoryList className='mt-10'/>
        </div>
    )
}
'use client'

import Image from 'next/image'
import Link from 'next/link'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {calculateFutureDate, cn, formatDateTime, getImageUrl} from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import ProductPrice from '../product/product-price'
import {Order} from "@/lib/response/order";
import {useLocale, useTranslations} from "next-intl";

export default function OrderDetailsForm({
                                             order,
                                         }: {
    order: Order
    isAdmin: boolean
}) {
    const {
        user,
        items,
        shippingAddress,
        paymentMethod,
    } = {
        user: order.orderUser,
        items: order.orderItems,
        shippingAddress: order.receiverAddress,
        paymentMethod: 'PayPal'
    }
    const isPaid = order.totalPayment<=0
    const t = useTranslations()
    const local = useLocale()

    return (
        <div className='grid md:grid-cols-3 md:gap-5'>
            <div className='overflow-x-auto md:col-span-2 space-y-4'>
                <Card>
                    <CardContent className='p-4 gap-4'>
                        <h2 className='text-xl pb-4'>{t('Shipping Address')}</h2>
                        <p>
                            {user.fullName} {user.phoneNumber}
                        </p>
                        <p>
                            {shippingAddress.houseNumber}, {shippingAddress.ward.name},{' '}
                            {shippingAddress.district.name}, {shippingAddress.province.name}
                        </p>

                            <div>
                                {' '}
                                <Badge variant={order.status.statusCode>=0&&order.status.statusCode<6?'default':'destructive'}>{order.status.statusName}</Badge>
                                <div>
                                    {t('Expected delivery at')}{' '}
                                    {formatDateTime(calculateFutureDate(order.deliveryMethod.thoi_gian)!,local).dateTime}
                                </div>
                            </div>
                        {/*)}*/}
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className='p-4 gap-4'>
                        <h2 className='text-xl pb-4'>{t('Payment Method')}</h2>
                        <p>{paymentMethod}</p>
                        {isPaid? (
                            <Badge>{t('Paid')}</Badge>
                        ) : (
                            <Badge variant='destructive'>{t('Not paid')}</Badge>
                        )}
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className='p-4 gap-4'>
                        <h2 className='text-xl pb-4'>{t('Order Items')}</h2>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>{t('Item')}</TableHead>
                                    <TableHead>{t('Cart.Quantity')}</TableHead>
                                    <TableHead>{t('Price')}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {items.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>
                                            <Link
                                                href={`/product/${item.productId}`}
                                                className='flex items-center'
                                            >
                                                <Image
                                                    src={getImageUrl(item.productImages[0])}
                                                    alt={item.productName}
                                                    width={50}
                                                    height={50}
                                                    onError={
                                                        (e) => {
                                                            e.currentTarget.srcset= "/images/imagenotfound.png";
                                                        }
                                                    }
                                                />
                                                <span className='px-2'>{item.productName}</span>
                                            </Link>
                                        </TableCell>
                                        <TableCell>
                                            <span className='px-2'>{item.quantity}</span>
                                        </TableCell>
                                        <TableCell>${item.originalPrice*(1-item.discount/100)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
            <div>
                <Card>
                    <CardContent className='p-4  space-y-4 gap-4'>
                        <h2 className='text-xl pb-4'>{t('Order Summary')}</h2>
                        <div className='flex justify-between'>
                            <div>{t('Items')}</div>
                            <div>
                                {' '}
                                <ProductPrice price={order.orderItems.reduce((a, c) => a + c.originalPrice*(1-c.discount/100)*c.quantity, 0)} plain />
                            </div>
                        </div>
                        <div className='flex justify-between'>
                            <div>{t('Shipping')}</div>
                            <div>
                                {' '}
                                <ProductPrice price={parseFloat(order.deliveryMethod.gia_cuoc)} plain />
                            </div>
                        </div>
                        <div className='flex justify-between'>
                            <div>{t('Total')}</div>
                            <div>
                                {' '}
                                <ProductPrice price={order.totalPrice} plain />
                            </div>
                        </div>
                        {/*important*/}
                        {!isPaid && ['Stripe', 'PayPal'].includes(paymentMethod) && (
                            <Link
                                className={cn(buttonVariants(), 'w-full')}
                                href={`/checkout/${order.orderId}`}
                            >
                                Pay Order
                            </Link>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
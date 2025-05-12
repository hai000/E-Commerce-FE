'use client'

import {Card, CardContent} from '@/components/ui/card'
import {useToast} from '@/hooks/use-toast'
import CheckoutFooter from '../checkout-footer'
import {redirect, useRouter} from 'next/navigation'
import {Button} from '@/components/ui/button'
import ProductPrice from '@/components/shared/product/product-price'
import {PayPalButtons, PayPalScriptProvider, usePayPalScriptReducer,} from '@paypal/react-paypal-js'
import {Order} from "@/lib/response/order";
import {approvePayPalOrder, createPayPalOrder} from "@/lib/api/order";

export default function OrderPaymentForm({
                                             order,
                                             paypalClientId,
                                         }: {
    order: Order
    paypalClientId: string
    isAdmin: boolean
}) {
    const router = useRouter()
    const {toast} = useToast()
    const {isPaid,paymentMethod} = {isPaid: order.totalPayment <= 0,paymentMethod: 'PayPal' }
    console.log(order.orderItems[0])
    if (isPaid) {
        redirect(`/account/orders/${order.orderId}`)
    }

    function PrintLoadingState() {
        const [{isPending, isRejected}] = usePayPalScriptReducer()
        let status = ''
        if (isPending) {
            status = 'Loading PayPal...'
        } else if (isRejected) {
            status = 'Error in loading PayPal.'
        }
        return status
    }

    const handleCreatePayPalOrder = async () => {
        const res = await createPayPalOrder(order.orderId)
        if (!res.success)
            return toast({
                description: res.message as string,
                variant: 'destructive',
            })
        return res.data
    }
    const handleApprovePayPalOrder = async (data: { orderID: string }) => {
        const res = await approvePayPalOrder(order.orderId, data)
        toast({
            description: res.message as string,
            variant: res.success ? 'success' : 'destructive',
        })
    }
    const priceShip = parseFloat(order.deliveryMethod.gia_cuoc)-(order.shipDecrease)
    const itemsPrice = order.orderItems.reduce((pre, item) => pre + item.quantity*item.originalPrice*((100-item.discount)/100) ,0)
    const CheckoutSummary = () => (
        <Card>
            <CardContent className='p-4'>
                <div>
                    {/*<div className='text-lg font-bold'>Order Summary</div>*/}
                    <div className='space-y-2'>
                        <div className='flex justify-between'>
                            <span>Items:</span>
                            <span>
                {' '}
                                <ProductPrice price={itemsPrice} plain/>
              </span>
                        </div>
                        <div className='flex justify-between'>
                            <span>Shipping & Handling:</span>
                            <span>
                {priceShip === undefined ? (
                    '--'
                ) : priceShip == 0 ? (
                    'FREE'
                ) : (
                    <ProductPrice price={priceShip} plain/>
                )}
              </span>
                        </div>
              {/*          <div className='flex justify-between'>*/}
              {/*              <span> Tax:</span>*/}
              {/*              <span>*/}
              {/*  {taxPrice === undefined ? (*/}
              {/*      '--'*/}
              {/*  ) : (*/}
              {/*      <ProductPrice price={taxPrice} plain/>*/}
              {/*  )}*/}
              {/*</span>*/}
              {/*          </div>*/}
                        <div className='flex justify-between  pt-1 font-bold text-lg'>
                            <span> Order Total:</span>
                            <span>
                {' '}
                                <ProductPrice price={order.totalPrice} plain/>
              </span>
                        </div>

                        {!isPaid && paymentMethod === 'PayPal' && (
                            <div>
                                <PayPalScriptProvider options={{clientId: paypalClientId}}>
                                    <PrintLoadingState/>
                                    <PayPalButtons
                                        createOrder={handleCreatePayPalOrder}
                                        onApprove={handleApprovePayPalOrder}
                                    />
                                </PayPalScriptProvider>
                            </div>
                        )}

                        {!isPaid && paymentMethod === 'Cash On Delivery' && (
                            <Button
                                className='w-full rounded-full'
                                onClick={() => router.push(`/account/orders/${order.orderId}`)}
                            >
                                View Order
                            </Button>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    )

    return (
        <main className='max-w-6xl mx-auto'>
            <div className='grid md:grid-cols-4 gap-6'>
                <div className='md:col-span-3'>
                    {/* Shipping Address */}
                    <div>
                        <div className='grid md:grid-cols-3 my-3 pb-3'>
                            <div className='text-lg font-bold'>
                                <span>Shipping Address</span>
                            </div>
                            <div className='col-span-2'>
                                <p>
                                    {order.receiverAddress.houseNumber} <br/>
                                    {`${order.receiverAddress.ward.name}, ${order.receiverAddress.district.name}, ${order.receiverAddress.province.name}`}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* payment method */}
                    <div className='border-y'>
                        <div className='grid md:grid-cols-3 my-3 pb-3'>
                            <div className='text-lg font-bold'>
                                <span>Payment Method</span>
                            </div>
                            <div className='col-span-2'>
                                <p>{paymentMethod}</p>
                            </div>
                        </div>
                    </div>

                    <div className='grid md:grid-cols-3 my-3 pb-3'>
                        <div className='flex text-lg font-bold'>
                            <span>Items and shipping</span>
                        </div>
                        <div className='col-span-2'>
                            <p>
                                Delivery in: {order.deliveryMethod.thoi_gian}
                            </p>
                            <ul>
                                {order.orderItems.map((item) => (
                                    <li key={item.productId}>
                                        {item.productName} ({item.originalPrice}) x {item.quantity} = {item.quantity*item.originalPrice*((100-item.discount)/100)} {(100-item.discount) ==0? '' : `(-${(item.discount)}%)`}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className='block md:hidden'>
                        <CheckoutSummary/>
                    </div>

                    <CheckoutFooter/>
                </div>
                <div className='hidden md:block'>
                    <CheckoutSummary/>
                </div>
            </div>
        </main>
    )
}
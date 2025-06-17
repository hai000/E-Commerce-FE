'use client'
import {Button} from '@/components/ui/button'
import {Card, CardContent, CardFooter, CardHeader} from '@/components/ui/card'
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from '@/components/ui/form'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import {RadioGroup, RadioGroupItem} from '@/components/ui/radio-group'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from '@/components/ui/select'
import {calculateFutureDate, formatDateTime, getImageUrl, timeUntilMidnight,} from '@/lib/utils'
import {zodResolver} from '@hookform/resolvers/zod'
import Image from 'next/image'
import {useRouter} from 'next/navigation'
import {useEffect, useState} from 'react'
import {SubmitHandler, useForm} from 'react-hook-form'
import CheckoutFooter from './checkout-footer'
import useIsMounted from '@/hooks/use-is-mounted'
import Link from 'next/link'
import useCartStore from '@/hooks/use-cart-store'
import ProductPrice from '@/components/shared/product/product-price'
import {APP_NAME} from '@/lib/constants'
import {ShippingAddress} from "@/lib/request/location";
import {useLocationStore} from "@/hooks/use-location";
import {Address, InfoShippingAddress} from "@/lib/response/address";
import {getInfoShips, getMyAddresses} from "@/lib/api/address";
import {toast} from "@/hooks/use-toast";
import {createMyOrder} from "@/lib/api/order";
import {getShippingAddressSchema} from "@/lib/validator";
import {useLocale, useTranslations} from "next-intl";
import {PaymentMethod} from "@/lib/response/payment";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Edit, MapPin, MoreHorizontal, Plus} from "lucide-react";


const CheckoutForm = ({paymentMethods}: { paymentMethods: PaymentMethod[] }) => {
    const router = useRouter()
    const {
        cart: {
            cartItems,
            itemsPrice,
            shippingPrice,
            totalPrice,
            shippingAddress,
            deliveryDateIndex,
            paymentMethod = paymentMethods[0].methodName,
        },
        cartChecked,
        createOrder,
        setShippingAddress,
        setPaymentMethod,
        updateItem,
        removeItem,
        setDeliveryDateIndex,
        clearCart
    } = useCartStore()
    const t = useTranslations();
    const {
        location,
        init,
        setProvinceSelected,
        setDistrictSelected,
        setWardSelected,
        setMyAddresses
    } = useLocationStore()
    const [defaultShippingAddress, setDefaultShippingAddress] = useState<ShippingAddress>({
        fullName: '',
        phone: '',
        id: '',
    });
    const shippingAddressForm = useForm<ShippingAddress>({
        resolver: zodResolver(getShippingAddressSchema(t)),
        defaultValues: defaultShippingAddress,
    });
    const [allAddress, setAllAddress] = useState<Address[]>([]);
    const [addSelected, setAddSelected] = useState<Address | null>(null);
    // Khi allAddress có dữ liệu, gán địa chỉ đầu làm mặc định
    useEffect(() => {
        if (cartChecked.length === 0) {
            router.push('/cart');
        }
        if (!location.isInitialized) {
            init();
        }
        const initialAddress = async () => {
            const allAddress = await getMyAddresses()
            if (allAddress && typeof allAddress !== 'string' && allAddress.length > 0) {
                const addressDef = allAddress[0];
                setMyAddresses(allAddress);
                setProvinceSelected(addressDef.province);
                setDistrictSelected(addressDef.district);
                setWardSelected(addressDef.ward);
                setDefaultShippingAddress({
                    fullName: '',
                    phone: '',
                    id: ''
                });
                setAllAddress(allAddress);
                setAddSelected(addressDef)
                shippingAddressForm.setValue('id', addressDef.id);
            }
        }
        initialAddress()
    }, []);
    const isMounted = useIsMounted();

    const handleCreateAddress = () => {
        router.push("/account/addresses/create")
    }
    const handleEditAddress = (addressId: string) => {
        router.push(`/account/addresses/edit/${addressId}`)
    }
    const [isAddressSelected, setIsAddressSelected] = useState(false);
    const [infoShips, setInfoShips] = useState<InfoShippingAddress[]>([]);
    const [indexInfoShips, setIndexInfoShips] = useState(0);
    const [isPaymentMethodSelected, setIsPaymentMethodSelected] = useState(false);
    const [isDeliveryDateSelected, setIsDeliveryDateSelected] = useState(false);

    useEffect(() => {
        shippingAddressForm.reset(defaultShippingAddress);
    }, [defaultShippingAddress, shippingAddressForm]);

    useEffect(() => {
        if (!isMounted || !shippingAddress) return;
        shippingAddressForm.setValue('fullName', shippingAddress.fullName || '');
        shippingAddressForm.setValue('phone', shippingAddress.phone || '');
        shippingAddressForm.setValue('id', shippingAddress.id || '');
    }, [isMounted, shippingAddress, shippingAddressForm]);
    const local = useLocale()
    const handleSelectAddressSelect = (address: Address) => {
        setAddSelected(address);
        shippingAddressForm.setValue('id', address.id.toString());
    }
    const onSubmitShippingAddress: SubmitHandler<ShippingAddress> = async (values) => {
        // Lấy phí ship
        const infoShips = await getInfoShips(addSelected?.id);
        let priceShip = 0;
        if (typeof infoShips !== 'string' && infoShips.length > 0) {
            setInfoShips(infoShips);
            priceShip = parseInt(infoShips[indexInfoShips].gia_cuoc);
        }
        setShippingAddress(values, priceShip);
        setIsAddressSelected(true);
    };
    const handlePlaceOrder = async () => {
        // order
        if (addSelected && addSelected.id) {
            if (cartItems.length > 0) {
                const idPaymentMethod = paymentMethods.find(
                    (method) => method.methodName == paymentMethod
                )?.id;
                const createOrderTemp = createOrder(
                    addSelected.id,
                    infoShips[indexInfoShips],
                    '',
                    '',
                    idPaymentMethod ?? '',
                )
                const res = await createMyOrder(createOrderTemp)
                if (typeof res === 'string') {
                    toast({
                        description: res,
                        variant: 'destructive',
                    })
                } else {
                    toast({
                        description: 'Successfully created order',
                        variant: 'success',
                    })
                    await clearCart()
                    router.push(`/checkout/${res.orderId}`)

                }
            } else {
                toast({
                    title: 'Error',
                    description: 'Your cart is empty',
                    variant: 'destructive',
                })
            }

        }
    }
    const handleSelectPaymentMethod = () => {
        setIsAddressSelected(true)
        setIsPaymentMethodSelected(true)
    }
    const handleSelectShippingAddress = async () => {
        await shippingAddressForm.handleSubmit(onSubmitShippingAddress)()
    }
    const CheckoutSummary = () => (
        <Card>
            <CardContent className='p-4'>
                {!isAddressSelected && (
                    <div className='border-b mb-4'>
                        <Button
                            className='rounded-full w-full'
                            onClick={handleSelectShippingAddress}
                        >
                            {t('Checkout.Ship to this address')}
                        </Button>
                        <p className='text-xs text-center py-2'>
                            {t('Checkout.Choose a shipping address')}

                        </p>
                    </div>
                )}
                {isAddressSelected && !isPaymentMethodSelected && (
                    <div className=' mb-4'>
                        <Button
                            className='rounded-full w-full'
                            onClick={handleSelectPaymentMethod}
                        >
                            {t('Checkout.Use this payment method')}
                        </Button>

                        <p className='text-xs text-center py-2'>
                            {t('Checkout.Choose a payment method to continue')}
                        </p>
                    </div>
                )}
                {isPaymentMethodSelected && isAddressSelected && (
                    <div>
                        <Button onClick={handlePlaceOrder} className='rounded-full w-full'>
                            {t('Place Your Order')}
                        </Button>
                        <p className='text-xs text-center py-2'>
                            {t('By placing your order')} {APP_NAME}&apos;s{' '}
                            <Link href='/page/privacy-policy'>{t('privacy notice')}</Link> {t('and')}
                            <Link href='/page/conditions-of-use'>{t('conditions of use')}</Link>.
                        </p>
                    </div>
                )}

                <div>
                    <div className='text-lg font-bold'>{t('Checkout.Order Summary')}</div>
                    <div className='space-y-2'>
                        <div className='flex justify-between'>
                            <span>{t('Items')}:</span>
                            <span>
                <ProductPrice price={itemsPrice} plain/>
              </span>
                        </div>
                        <div className='flex justify-between'>
                            <span>{t('Checkout.Shipping & Handling')}:</span>
                            <span>
                {shippingPrice === undefined ? (
                    '--'
                ) : shippingPrice === 0 ? (
                    'FREE'
                ) : (
                    <ProductPrice price={shippingPrice} plain/>
                )}
              </span>
                        </div>
                        <div className='flex justify-between  pt-4 font-bold text-lg'>
                            <span>{t('Checkout.Order Total')}:</span>
                            <span>
                <ProductPrice price={totalPrice} plain/>
              </span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
    return (cartChecked.length === 0 || !cartChecked) ? null : (
        <main className='max-w-6xl mx-auto highlight-link'>
            <div className='grid md:grid-cols-4 gap-6'>
                <div className='md:col-span-3'>
                    {/* shipping address */}
                    <div>
                        {isAddressSelected && shippingAddress ? (
                            <div className='grid grid-cols-1 md:grid-cols-12    my-3  pb-3'>
                                <div className='col-span-5 flex text-lg font-bold '>
                                    <span className='w-8'>1 </span>
                                    <span>{t('Checkout.Shipping address')}</span>
                                </div>
                                <div className='col-span-5 '>
                                    <p>
                                        {shippingAddress.fullName} <br/>
                                        {addSelected?.houseNumber ?? ''} <br/>
                                        {`${addSelected?.province.name ?? ''}, ${addSelected?.district.name ?? ''}, ${addSelected?.ward.name ?? ''}`}
                                    </p>
                                </div>
                                <div className='col-span-2'>
                                    <Button
                                        variant={'outline'}
                                        onClick={() => {
                                            setIsAddressSelected(false)
                                            setIsPaymentMethodSelected(true)
                                            setIsDeliveryDateSelected(true)
                                        }}
                                    >
                                        {t('Change')}
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className='flex text-primary text-lg font-bold my-2'>
                                    <span className='w-8'>1 </span>
                                    <span>{t('Checkout.Enter shipping address')}</span>
                                </div>
                                <Form {...shippingAddressForm}>
                                    <form
                                        method='post'
                                        onSubmit={shippingAddressForm.handleSubmit(
                                            onSubmitShippingAddress
                                        )}
                                        className='space-y-4'
                                    >
                                        <Card className='md:ml-8 my-4'>
                                            <CardContent className='p-4 space-y-2'>
                                                <div className='text-lg font-bold mb-2'>
                                                    {t('Checkout.Your address')}
                                                </div>

                                                <div className='flex flex-col gap-5 md:flex-row'>
                                                    <FormField
                                                        control={shippingAddressForm.control}
                                                        name='fullName'
                                                        render={({field}) => (
                                                            <FormItem className='w-full'>
                                                                <FormLabel>{t('Checkout.Full Name')}</FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        placeholder={t('Placeholder.Enter full name')}
                                                                        {...field}
                                                                    />
                                                                </FormControl>
                                                                <FormMessage/>
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={shippingAddressForm.control}
                                                        name='phone'
                                                        render={({field}) => (
                                                            <FormItem className='w-full'>
                                                                <FormLabel>{t('Checkout.Phone number')}</FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        placeholder={t('Placeholder.Enter phone number')}
                                                                        {...field}
                                                                    />
                                                                </FormControl>
                                                                <FormMessage/>
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                                <FormField
                                                    control={shippingAddressForm.control}
                                                    name='id'
                                                    render={() => (
                                                        <FormItem className='w-full'>
                                                            <FormLabel>{t('Select your address')}</FormLabel>
                                                            <FormMessage/>
                                                        </FormItem>
                                                    )}
                                                />
                                                {allAddress.length > 0 ? (
                                                    <div
                                                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                        {allAddress.map((address) => (
                                                            <Card key={address.id} className={` ${addSelected?.id == address.id ? "border-2 border-black" : ""} max-w-64 relative`}
                                                                  onClick={()=>{handleSelectAddressSelect(address)}}
                                                            >
                                                                <CardHeader className="pb-3">
                                                                    <div>
                                                                        <p className="font-medium">ID: {address.id}</p>
                                                                    </div>
                                                                </CardHeader>
                                                                <CardContent
                                                                    className="flex flex-row items-center  justify-between pt-0">
                                                                    <div className="space-y-2">
                                                                        <div className="text-sm">
                                                                            <p>{address.houseNumber}</p>
                                                                            <p>
                                                                                {address.ward.name}, {address.district.name}
                                                                            </p>
                                                                            <p>{address.province.name}</p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex items-start justify-between">
                                                                        <DropdownMenu>
                                                                            <DropdownMenuTrigger asChild>
                                                                                <Button variant="ghost"
                                                                                        className="h-8 w-8 p-0">
                                                                                    <span
                                                                                        className="sr-only">{t('Open menu')}</span>
                                                                                    <MoreHorizontal
                                                                                        className="h-4 w-4"/>
                                                                                </Button>
                                                                            </DropdownMenuTrigger>
                                                                            <DropdownMenuContent align="end">
                                                                                <DropdownMenuLabel>{t('Actions')}</DropdownMenuLabel>
                                                                                <DropdownMenuItem
                                                                                    onClick={() => handleEditAddress(address.id)}>
                                                                                    <Edit className="mr-2 h-4 w-4"/>
                                                                                    {t('Edit')}
                                                                                </DropdownMenuItem>
                                                                                <DropdownMenuSeparator/>
                                                                            </DropdownMenuContent>
                                                                        </DropdownMenu>
                                                                    </div>
                                                                </CardContent>
                                                            </Card>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="text-center py-12">
                                                        <MapPin
                                                            className="h-12 w-12 text-muted-foreground mx-auto mb-4"/>
                                                        <h3 className="text-lg font-medium mb-2">{t('Not yet addressed')}</h3>
                                                        <p className="text-muted-foreground mb-4">{t('Add first address to use')}</p>
                                                        <Button onClick={handleCreateAddress}>
                                                            <Plus className="h-4 w-4 mr-2"/>
                                                            {t('Add new address')}
                                                        </Button>
                                                    </div>
                                                )
                                                }
                                            </CardContent>
                                            <CardFooter className='  p-4'>
                                                <Button
                                                    type='submit'
                                                    className='rounded-full font-bold'
                                                >
                                                    {t('Checkout.Ship to this address')}
                                                </Button>
                                            </CardFooter>
                                        </Card>
                                    </form>
                                </Form>
                            </>
                        )}
                    </div>
                    {/* payment method */}
                    <div className='border-y'>
                        {isPaymentMethodSelected && paymentMethod ? (
                            <div className='grid  grid-cols-1 md:grid-cols-12  my-3 pb-3'>
                                <div className='flex text-lg font-bold  col-span-5'>
                                    <span className='w-8'>2 </span>
                                    <span>{t('Payment Method')}</span>
                                </div>
                                <div className='col-span-5 '>
                                    <p>{paymentMethod}</p>
                                </div>
                                <div className='col-span-2'>
                                    <Button
                                        variant='outline'
                                        onClick={() => {
                                            setIsPaymentMethodSelected(false)
                                            if (paymentMethod) setIsDeliveryDateSelected(true)
                                        }}
                                    >
                                        {t('Change')}
                                    </Button>
                                </div>
                            </div>
                        ) : isAddressSelected ? (
                            <>
                                <div className='flex text-primary text-lg font-bold my-2'>
                                    <span className='w-8'>2 </span>
                                    <span>{t('Choose a payment method')}</span>
                                </div>
                                <Card className='md:ml-8 my-4'>
                                    <CardContent className='p-4'>
                                        <RadioGroup
                                            value={paymentMethod}
                                            onValueChange={(value) => setPaymentMethod(value)}
                                        >
                                            {paymentMethods.map((pm) => (
                                                <div key={pm.methodName} className='flex items-center py-1 '>
                                                    <RadioGroupItem
                                                        value={pm.methodName}
                                                        id={`payment-${pm.methodName}`}
                                                    />
                                                    <Label
                                                        className='font-bold pl-2 cursor-pointer'
                                                        htmlFor={`payment-${pm.methodName}`}
                                                    >
                                                        {pm.methodName}
                                                    </Label>
                                                </div>
                                            ))}
                                        </RadioGroup>
                                    </CardContent>
                                    <CardFooter className='p-4'>
                                        <Button
                                            onClick={handleSelectPaymentMethod}
                                            className='rounded-full font-bold'
                                        >
                                            {t('Checkout.Use this payment method')}
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </>
                        ) : (
                            <div className='flex text-muted-foreground text-lg font-bold my-4 py-3'>
                                <span className='w-8'>2 </span>
                                <span> {t('Choose a payment method')}</span>
                            </div>
                        )}
                    </div>
                    {/* items and delivery date */}
                    <div>
                        {isDeliveryDateSelected && deliveryDateIndex != undefined ? (
                            <div className='grid  grid-cols-1 md:grid-cols-12  my-3 pb-3'>
                                <div className='flex text-lg font-bold  col-span-5'>
                                    <span className='w-8'>3 </span>
                                    <span>{t('Items and shipping')}</span>
                                </div>
                                <div className='col-span-5'>
                                    <p>
                                        {t('Delivery date')}:{' '}
                                        {
                                            formatDateTime(
                                                calculateFutureDate(
                                                    infoShips[deliveryDateIndex]
                                                        .thoi_gian
                                                ),
                                                local
                                            ).dateOnly
                                        }
                                    </p>
                                    <ul>
                                        {cartItems.map((item, _index) => (
                                            <li key={_index}>
                                                {item.productName} x {item.cartItemQuantity} = {item.price}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className='col-span-2'>
                                    <Button
                                        variant={'outline'}
                                        onClick={() => {
                                            setIsPaymentMethodSelected(true)
                                            setIsDeliveryDateSelected(false)
                                        }}
                                    >
                                        {t('Change')}
                                    </Button>
                                </div>
                            </div>
                        ) : isPaymentMethodSelected && isAddressSelected ? (
                            <>
                                <div className='flex text-primary  text-lg font-bold my-2'>
                                    <span className='w-8'>3 </span>
                                    <span>{t('Review items and shipping')}</span>
                                </div>
                                <Card className='md:ml-8'>
                                    <CardContent className='p-4'>
                                        <p className='mb-2'>
                      <span className='text-lg font-bold text-green-700'>
                        {t('Arriving')}{' '}
                          {
                              formatDateTime(
                                  calculateFutureDate(
                                      infoShips[deliveryDateIndex!]
                                          .thoi_gian
                                  ),
                                  local
                              ).dateOnly
                          }
                      </span>{' '}
                                            {t('If you order in the next')} {timeUntilMidnight().hours} {t('hours and')} {timeUntilMidnight().minutes} {t('minutes')}.
                                        </p>
                                        <div className='grid md:grid-cols-2 gap-6'>
                                            <div>
                                                {cartItems.map((item, _index) => (
                                                    <div key={_index} className='flex gap-4 py-2'>
                                                        <div className='relative w-16 h-16'>
                                                            <Image
                                                                onError={
                                                                    (e) => {
                                                                        e.currentTarget.srcset = "/images/imagenotfound.png";
                                                                    }
                                                                }
                                                                src={getImageUrl(item.images[0])}
                                                                alt={item.productName}
                                                                fill
                                                                sizes='20vw'
                                                                style={{
                                                                    objectFit: 'contain',
                                                                }}
                                                            />
                                                        </div>

                                                        <div className='flex-1'>
                                                            <p className='font-semibold'>
                                                                {item.productName}, {item.color?.colorName ? item.color?.colorName + ', ' : ''} {item.size?.size}
                                                            </p>
                                                            <p className='font-bold'>
                                                                <ProductPrice price={item.price} plain/>
                                                            </p>

                                                            <Select
                                                                value={item.cartItemQuantity.toString()}
                                                                onValueChange={(value) => {
                                                                    if (value === '0') removeItem(item)
                                                                    else {
                                                                        updateItem(item, Number(value))
                                                                    }
                                                                }}
                                                            >
                                                                <SelectTrigger className='w-30'>
                                                                    <SelectValue>
                                                                        {t('Qty')}: {item.cartItemQuantity}
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
                                                                    <SelectItem key='delete' value='0'>
                                                                        {t('Delete')}
                                                                    </SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <div>
                                                <div className=' font-bold'>
                                                    <p className='mb-2'>{t('Choose a shipping speed')}:</p>

                                                    <ul>
                                                        <RadioGroup
                                                            value={
                                                                infoShips[deliveryDateIndex!]
                                                                    .ten_dichvu
                                                            }
                                                            onValueChange={(value) => {
                                                                const index = infoShips.findIndex((address) => address.ten_dichvu === value)!
                                                                setIndexInfoShips(index)
                                                                setDeliveryDateIndex(index, parseInt(infoShips[index].gia_cuoc))
                                                            }
                                                            }
                                                        >
                                                            {infoShips.map((infoShipping: InfoShippingAddress) => (
                                                                <div key={infoShipping.ten_dichvu} className='flex'>
                                                                    <RadioGroupItem
                                                                        value={infoShipping.ten_dichvu}
                                                                        id={`address-${infoShipping.ten_dichvu}`}
                                                                    />
                                                                    <Label
                                                                        className='pl-2 space-y-2 cursor-pointer'
                                                                        htmlFor={`address-${infoShipping.ten_dichvu}`}
                                                                    >
                                                                        <div className='text-green-700 font-semibold'>
                                                                            {
                                                                                formatDateTime(
                                                                                    calculateFutureDate(
                                                                                        infoShipping.thoi_gian
                                                                                    ),
                                                                                    local
                                                                                ).dateOnly
                                                                            }
                                                                        </div>
                                                                        <div>
                                                                            <ProductPrice
                                                                                price={parseInt(infoShipping.gia_cuoc)}
                                                                                plain
                                                                            />
                                                                        </div>
                                                                    </Label>
                                                                </div>
                                                            ))}
                                                        </RadioGroup>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </>
                        ) : (
                            <div className='flex text-muted-foreground text-lg font-bold my-4 py-3'>
                                <span className='w-8'>3 </span>
                                <span>{t('Items and shipping')}</span>
                            </div>
                        )}
                    </div>
                    {isPaymentMethodSelected && isAddressSelected && (
                        <div className='mt-6'>
                            <div className='block md:hidden'>
                                <CheckoutSummary/>
                            </div>

                            <Card className='hidden md:block '>
                                <CardContent
                                    className='p-4 flex flex-col md:flex-row justify-between items-center gap-3'>
                                    <Button onClick={handlePlaceOrder} className='rounded-full'>
                                        {t('Place Your Order')}
                                    </Button>
                                    <div className='flex-1'>
                                        <p className='font-bold text-lg'>
                                            {t('Checkout.Order Total')}: <ProductPrice price={totalPrice} plain/>
                                        </p>
                                        <p className='text-xs'>
                                            {' '}
                                            {t('Checkout.By placing your order')} {APP_NAME}&apos;s <Link
                                            href='/page/privacy-policy'>
                                            {t('privacy notice')}
                                        </Link> and
                                            <Link href='/page/conditions-of-use'>
                                                {' '}
                                                {t('conditions of use')}
                                            </Link>
                                            .
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                    <CheckoutFooter/>
                </div>
                <div className='hidden md:block'>
                    <CheckoutSummary/>
                </div>
            </div>
        </main>
    )
}
export default CheckoutForm
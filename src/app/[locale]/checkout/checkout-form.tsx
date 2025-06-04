'use client'
import {Button} from '@/components/ui/button'
import {Card, CardContent, CardFooter} from '@/components/ui/card'
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from '@/components/ui/form'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import {RadioGroup, RadioGroupItem} from '@/components/ui/radio-group'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from '@/components/ui/select'
import {calculateFutureDate, cn, formatDateTime, getImageUrl, timeUntilMidnight,} from '@/lib/utils'
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
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Check, ChevronsUpDown} from "lucide-react";
import {Command, CommandGroup, CommandInput, CommandItem, CommandList} from "@/components/ui/command";
import {useLocationStore} from "@/hooks/use-location";
import {Address, InfoShippingAddress} from "@/lib/response/address";
import {getInfoShips} from "@/lib/api/address";
import {toast} from "@/hooks/use-toast";
import {createMyOrder} from "@/lib/api/order";
import {getShippingAddressSchema} from "@/lib/validator";
import {useLocale, useTranslations} from "next-intl";
import {PaymentMethod} from "@/lib/response/payment";


const CheckoutForm = ({allAddress,paymentMethods}: { paymentMethods: PaymentMethod[],allAddress?: Address[] }) => {
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
        street: '',
        city: '',
        district: '',
        ward: '',
        phone: '',
    });
    // Khi allAddress có dữ liệu, gán địa chỉ đầu làm mặc định
    useEffect(() => {
        if (cartChecked.length === 0) {
            router.push('/cart');
        }
        if (!location.isInitialized) {
            init();
        }
        if (allAddress && allAddress.length > 0) {
            const addressDef = allAddress[0];
            setMyAddresses(allAddress);
            setProvinceSelected(addressDef.province);
            setDistrictSelected(addressDef.district);
            setWardSelected(addressDef.ward);
            setDefaultShippingAddress({
                fullName: '',
                street: addressDef.houseNumber || '',
                city: addressDef.province?.name || '',
                district: addressDef.district?.name || '',
                ward: addressDef.ward?.name || '',
                phone: '',
            });
        }
    }, [allAddress]);
    const t = useTranslations();
    const isMounted = useIsMounted();
    const shippingAddressForm = useForm<ShippingAddress>({
        resolver: zodResolver(getShippingAddressSchema(t)),
        defaultValues: defaultShippingAddress,
    });

    const [isAddressSelected, setIsAddressSelected] = useState(false);
    const [infoShips, setInfoShips] = useState<InfoShippingAddress[]>([]);
    const [indexInfoShips, setIndexInfoShips] = useState(0);
    const [isPaymentMethodSelected, setIsPaymentMethodSelected] = useState(false);
    const [isDeliveryDateSelected, setIsDeliveryDateSelected] = useState(false);

    useEffect(() => {
        shippingAddressForm.reset(defaultShippingAddress);
    }, [defaultShippingAddress, shippingAddressForm]);

    // Đồng bộ shippingAddress vào form
    useEffect(() => {
        if (!isMounted || !shippingAddress) return;
        shippingAddressForm.setValue('fullName', shippingAddress.fullName || '');
        shippingAddressForm.setValue('street', shippingAddress.street || '');
        shippingAddressForm.setValue('city', shippingAddress.city || '');
        shippingAddressForm.setValue('district', shippingAddress.district || '');
        shippingAddressForm.setValue('ward', shippingAddress.ward || '');
        shippingAddressForm.setValue('phone', shippingAddress.phone || '');
    }, [isMounted, shippingAddress, shippingAddressForm]);
    const local = useLocale()
    const onSubmitShippingAddress: SubmitHandler<ShippingAddress> = async (values) => {
        // Lấy phí ship
        const infoShips = await getInfoShips(location.myAddressSelected?.id);
        let priceShip = 0;
        if (typeof infoShips !== 'string') {
            setInfoShips(infoShips);
            priceShip = parseInt(infoShips[indexInfoShips].gia_cuoc);
        }
        setShippingAddress(values, priceShip);
        setIsAddressSelected(true);
    };
    const handlePlaceOrder = async () => {
        // order
        if (location.myAddressSelected?.id) {
            if (cartItems.length>0) {
                const idPaymentMethod = paymentMethods.find(
                    (method) => method.methodName == paymentMethod
                )?.id;
                const createOrderTemp = createOrder(
                    location.myAddressSelected.id,
                    infoShips[indexInfoShips],
                    '',
                    '',
                    idPaymentMethod??'',
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
            }else {
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
    return (cartChecked.length === 0 || !cartChecked) ? null :(
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
                                        {shippingAddress.street} <br/>
                                        {`${shippingAddress.city}, ${shippingAddress.district}, ${shippingAddress.ward}`}
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
                                                </div>
                                                <div className='flex flex-col gap-5 md:flex-row'>
                                                    <FormField
                                                        control={shippingAddressForm.control}
                                                        name='street'
                                                        render={({field}) => (
                                                            <FormItem className='w-full'>
                                                                <FormLabel>{t('Checkout.Address')}</FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        placeholder={t('Placeholder.Enter address')}
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
                                                <div className='flex flex-row flex-wrap gap-5'>
                                                    {!location.provinces || !location.districts || !location.wards ?
                                                        ( `<p>${t("Cant load page")}</p>`) : (
                                                            <>
                                                                <FormField
                                                                    control={shippingAddressForm.control}
                                                                    name='city'
                                                                    render={({field}) => (
                                                                        <FormItem className='w-[250px]'>
                                                                            <FormLabel>{t('Checkout.City')}</FormLabel>
                                                                            <FormControl>
                                                                                <Popover>
                                                                                    <PopoverTrigger asChild>
                                                                                        <FormControl>
                                                                                            <Button
                                                                                                variant="outline"
                                                                                                role="combobox"
                                                                                                className={cn(
                                                                                                    "w-[250px] justify-between",
                                                                                                    !field.value && "text-muted-foreground"
                                                                                                )}
                                                                                            >
                                                                                                {field.value && field.value != ""
                                                                                                    ? location.provinces?.find(
                                                                                                        (province) => location.provinceSelected?.id == province.id
                                                                                                    )?.name
                                                                                                    : t("Checkout.Select city")}
                                                                                                <ChevronsUpDown
                                                                                                    className="opacity-50"/>
                                                                                            </Button>
                                                                                        </FormControl>
                                                                                    </PopoverTrigger>
                                                                                    <PopoverContent
                                                                                        className="w-[200px] p-0">
                                                                                        <Command>
                                                                                            <CommandInput
                                                                                                placeholder={t("Placeholder.Search city")}
                                                                                                className="h-9"
                                                                                            />
                                                                                            <CommandList>
                                                                                                <CommandGroup>
                                                                                                    {location.provinces?.map((province) => (
                                                                                                        <CommandItem
                                                                                                            value={province.id}
                                                                                                            key={province.id}
                                                                                                            onSelect={() => {
                                                                                                                setProvinceSelected(province)
                                                                                                                shippingAddressForm.setValue("city", province.name)
                                                                                                                shippingAddressForm.setValue('district', '')
                                                                                                                shippingAddressForm.setValue('ward', '')
                                                                                                            }}
                                                                                                        >
                                                                                                            {province.name}
                                                                                                            <Check
                                                                                                                className={cn(
                                                                                                                    "ml-auto",
                                                                                                                    province.id == location.provinceSelected?.id
                                                                                                                        ? "opacity-100"
                                                                                                                        : "opacity-0"
                                                                                                                )}
                                                                                                            />
                                                                                                        </CommandItem>
                                                                                                    ))}
                                                                                                </CommandGroup>
                                                                                            </CommandList>
                                                                                        </Command>
                                                                                    </PopoverContent>
                                                                                </Popover>
                                                                            </FormControl>
                                                                            <FormMessage/>
                                                                        </FormItem>
                                                                    )}
                                                                />
                                                                <FormField
                                                                    control={shippingAddressForm.control}
                                                                    name='district'
                                                                    render={({field}) => (
                                                                        <FormItem className='w-[250px]'> {/* hoặc flex-1 min-w-[200px] */}
                                                                            <FormLabel>{t('Checkout.District')}</FormLabel>
                                                                            <FormControl>
                                                                                <Popover>
                                                                                    <PopoverTrigger asChild>
                                                                                        <FormControl>
                                                                                            <Button
                                                                                                variant="outline"
                                                                                                role="combobox"
                                                                                                className={cn(
                                                                                                    "w-[250px] justify-between",
                                                                                                    !field.value && "text-muted-foreground"
                                                                                                )}
                                                                                            >
                                                                                                {field.value && field.value != ""
                                                                                                    ? location.districtByProvince?.find(
                                                                                                        (district) => location.districtSelected?.id == district.id
                                                                                                    )?.name
                                                                                                    : t("Placeholder.Select district")}
                                                                                                <ChevronsUpDown
                                                                                                    className="opacity-50"/>
                                                                                            </Button>
                                                                                        </FormControl>
                                                                                    </PopoverTrigger>
                                                                                    <PopoverContent
                                                                                        className="w-[200px] p-0">
                                                                                        <Command>
                                                                                            <CommandInput
                                                                                                placeholder="Search district..."
                                                                                                className="h-9"
                                                                                            />
                                                                                            <CommandList>
                                                                                                <CommandGroup>
                                                                                                    {location.districtByProvince?.map((district) => (
                                                                                                        <CommandItem
                                                                                                            value={district.id}
                                                                                                            key={district.id}
                                                                                                            onSelect={() => {
                                                                                                                setDistrictSelected(district)
                                                                                                                shippingAddressForm.setValue('district', district.name)
                                                                                                                shippingAddressForm.setValue('ward', '')
                                                                                                            }}
                                                                                                        >
                                                                                                            {district.name}
                                                                                                            <Check
                                                                                                                className={cn(
                                                                                                                    "ml-auto",
                                                                                                                    district.id == location.districtSelected?.id
                                                                                                                        ? "opacity-100"
                                                                                                                        : "opacity-0"
                                                                                                                )}
                                                                                                            />
                                                                                                        </CommandItem>
                                                                                                    ))}
                                                                                                </CommandGroup>
                                                                                            </CommandList>
                                                                                        </Command>
                                                                                    </PopoverContent>
                                                                                </Popover>
                                                                            </FormControl>
                                                                            <FormMessage/>
                                                                        </FormItem>
                                                                    )}
                                                                />
                                                                <FormField
                                                                    control={shippingAddressForm.control}
                                                                    name='ward'
                                                                    render={({field}) => (
                                                                        <FormItem className='w-[250px]'> {/* hoặc flex-1 min-w-[200px] */}
                                                                            <FormLabel>{t('Checkout.Ward')}</FormLabel>
                                                                            <FormControl>
                                                                                <Popover>
                                                                                    <PopoverTrigger asChild>
                                                                                        <FormControl>
                                                                                            <Button
                                                                                                variant="outline"
                                                                                                role="combobox"
                                                                                                className={cn(
                                                                                                    "w-[250px] justify-between",
                                                                                                    !field.value && "text-muted-foreground"
                                                                                                )}
                                                                                            >
                                                                                                {field.value && field.value != ""
                                                                                                    ? location.wardsByDistrict?.find(
                                                                                                        (ward) => location.wardSelected?.id == ward.id
                                                                                                    )?.name
                                                                                                    : t("Placeholder.Select ward")}
                                                                                                <ChevronsUpDown
                                                                                                    className="opacity-50"/>
                                                                                            </Button>
                                                                                        </FormControl>
                                                                                    </PopoverTrigger>
                                                                                    <PopoverContent
                                                                                        className="w-[200px] p-0">
                                                                                        <Command>
                                                                                            <CommandInput
                                                                                                placeholder="Search ward..."
                                                                                                className="h-9"
                                                                                            />
                                                                                            <CommandList>
                                                                                                <CommandGroup>
                                                                                                    {location.wardsByDistrict?.map((ward) => (
                                                                                                        <CommandItem
                                                                                                            value={ward.id}
                                                                                                            key={ward.id}
                                                                                                            onSelect={() => {
                                                                                                                setWardSelected(ward)
                                                                                                                shippingAddressForm.setValue("ward", ward.name)
                                                                                                            }}
                                                                                                        >
                                                                                                            {ward.name}
                                                                                                            <Check
                                                                                                                className={cn(
                                                                                                                    "ml-auto",
                                                                                                                    ward.id == location.wardSelected?.id
                                                                                                                        ? "opacity-100"
                                                                                                                        : "opacity-0"
                                                                                                                )}
                                                                                                            />
                                                                                                        </CommandItem>
                                                                                                    ))}
                                                                                                </CommandGroup>
                                                                                            </CommandList>
                                                                                        </Command>
                                                                                    </PopoverContent>
                                                                                </Popover>
                                                                            </FormControl>
                                                                            <FormMessage/>
                                                                        </FormItem>
                                                                    )}
                                                                />
                                                            </>
                                                        )}
                                                </div>
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
                                                                        e.currentTarget.srcset= "/images/imagenotfound.png";
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
                                                                {item.productName}, {item.color?.colorName?item.color?.colorName+ ', ': ''} {item.size?.size}
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
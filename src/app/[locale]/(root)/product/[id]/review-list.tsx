'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { Calendar, StarIcon, User } from 'lucide-react'
import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useInView } from 'react-intersection-observer'
import { z } from 'zod'

import Rating from '@/components/shared/product/rating'
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import RatingSummary from '@/components/shared/product/rating-summary'
import { Separator } from '@/components/ui/separator'
import {IProduct} from "@/lib/response/product";
import {Review} from "@/lib/response/review";
import {addReview, getProductReviews} from "@/lib/api/review";
import {ReviewAddRequest} from "@/lib/request/review";
import Link from "next/link";
import {getReviewSchema} from "@/lib/validator";
import {useTranslations} from "next-intl";
import {getMyOrders} from "@/lib/api/order";
import {Order} from "@/lib/response/order";

const reviewFormDefaultValues = {
    content: '',
    ratingScore: '',
}

export default function ReviewList({
                                       userId,
                                       product,
                                   }: {
    userId: string | undefined
    product: IProduct
}) {
    const t = useTranslations();
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [reviews, setReviews] = useState<Review[]>([]);
    const { ref, inView } = useInView({ triggerOnce: true });
    const [orderId, setOrderId] = useState<string | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(true);
    const [loadingReviews, setLoadingReviews] = useState(false);

    // Lấy thông tin đã mua chưa
    useEffect(() => {
        const fetchIsBought = async () => {
            setOrderId(await isBoughtF(product.id));
            setIsLoading(false);
        }
        fetchIsBought();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [product.id]);

    // Lấy review khi inView
    useEffect(() => {
        const loadReviews = async () => {
            setLoadingReviews(true);
            try {
                const res = await getProductReviews(product.id, 1);
                setReviews([...res.data]);
                setTotalPages(res.totalPage);
                setPage(2);
            } catch {
                toast({
                    variant: 'destructive',
                    description: 'Error in fetching reviews',
                });
            }
            setLoadingReviews(false);
        }
        if (inView) {
            loadReviews();
        }
        // eslint-disable-next-line
    }, [inView, product.id]);

    // Tải thêm review
    const loadMoreReviews = async () => {
        if (loadingReviews) return;
        if (totalPages !== 0 && page > totalPages) return;
        setLoadingReviews(true);
        try {
            const res = await getProductReviews(product.id, page);
            setReviews(prev => [...prev, ...res.data]);
            setTotalPages(res.totalPage);
            setPage(prev => prev + 1);
        } catch  {
            toast({
                variant: 'destructive',
                description: 'Error in fetching reviews',
            });
        }
        setLoadingReviews(false);
    }

    // Hàm reload dùng để refresh lại reviews
    const reload = async () => {
        setIsLoading(true);
        setLoadingReviews(true);
        try {
            setOrderId(await isBoughtF(product.id));
            const res = await getProductReviews(product.id, 1);
            setReviews([...res.data]);
            setTotalPages(res.totalPage);
            setPage(2);
        } catch {
            toast({
                variant: 'destructive',
                description: 'Error in fetching reviews',
            });
        }
        setIsLoading(false);
        setLoadingReviews(false);
    }

    const ReviewSchema = getReviewSchema(t)
    type CustomerReview = z.infer<typeof ReviewSchema>
    const form = useForm<CustomerReview>({
        resolver: zodResolver(ReviewSchema),
        defaultValues: reviewFormDefaultValues,
    })
    const [open, setOpen] = useState(false)
    const { toast } = useToast()
    const onSubmit: SubmitHandler<CustomerReview> = async (values) => {
        const reviewAddRequest: ReviewAddRequest = {
            content: values.content,
            ratingScore: parseInt(values.ratingScore.toString(), 10),
            productId: product.id,
            orderId: orderId??'',
            images: [],
        }
        const res = await addReview(reviewAddRequest)
        console.log(res)
        if (typeof res === 'string') {
            return toast({
                variant: 'destructive',
                description: res,
            })
        }
        setOpen(false)
        reload()
    }
    const handleOpenForm = async () => {
        if (userId && orderId) {
            setOpen(true)
        }
    }
    return (
        <div className='space-y-2'>
            {reviews.length === 0 && <div>{t('No reviews yet')}</div>}
            <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
                <div className='flex flex-col gap-2'>
                    {reviews.length !== 0 && (
                        <RatingSummary
                            avgRating={product.avgRating}
                            numReviews={product.numReviews}
                        />
                    )}
                    <Separator className='my-3' />
                    <div className='space-y-3'>
                        <h3 className='font-bold text-lg lg:text-xl'>
                            {t('Review this product')}
                        </h3>
                        <p className='text-sm'>{t('Share your thoughts with other customers')}</p>
                        {isLoading ? (
                            <div className='flex items-center justify-center h-10'>
                                {t('Loading')}
                            </div>
                        ) : (userId && orderId) ? (
                            <Dialog open={open} onOpenChange={setOpen}>
                                <Button
                                    onClick={handleOpenForm}
                                    variant='outline'
                                    className=' rounded-full w-full'
                                >
                                    {t('Write a customer review')}
                                </Button>

                                <DialogContent className='sm:max-w-[425px]'>
                                    <Form {...form}>
                                        <form method='post' onSubmit={form.handleSubmit(onSubmit)}>
                                            <DialogHeader>
                                                <DialogTitle>{t('Write a customer review')}</DialogTitle>
                                                <DialogDescription>
                                                    {t('Share your thoughts with other customers')}
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className='grid gap-4 py-4'>
                                                <div className='flex flex-col gap-5  '>
                                                    <FormField
                                                        control={form.control}
                                                        name='content'
                                                        render={({ field }) => (
                                                            <FormItem className='w-full'>
                                                                <FormLabel>{t('Comment')}</FormLabel>
                                                                <FormControl>
                                                                    <Textarea
                                                                        placeholder={t('Placeholder.Enter your review')}
                                                                        {...field}
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                                <div>
                                                    <FormField
                                                        control={form.control}
                                                        name='ratingScore'
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>{t('Rating')}</FormLabel>
                                                                <Select
                                                                    onValueChange={field.onChange}
                                                                    value={field.value.toString()}
                                                                >
                                                                    <FormControl>
                                                                        <SelectTrigger>
                                                                            <SelectValue placeholder={t('Select a rating')} />
                                                                        </SelectTrigger>
                                                                    </FormControl>
                                                                    <SelectContent>
                                                                        {Array.from({ length: 5 }).map(
                                                                            (_, index) => (
                                                                                <SelectItem
                                                                                    key={index}
                                                                                    value={(index + 1).toString()}
                                                                                >
                                                                                    <div className='flex items-center gap-1'>
                                                                                        {index + 1}{' '}
                                                                                        <StarIcon className='h-4 w-4' />
                                                                                    </div>
                                                                                </SelectItem>
                                                                            )
                                                                        )}
                                                                    </SelectContent>
                                                                </Select>

                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                            </div>

                                            <DialogFooter>
                                                <Button
                                                    type='submit'
                                                    size='lg'
                                                    disabled={form.formState.isSubmitting}
                                                >
                                                    {form.formState.isSubmitting
                                                        ? t('Submitting')
                                                        : t('Submit')}
                                                </Button>
                                            </DialogFooter>
                                        </form>
                                    </Form>
                                </DialogContent>
                            </Dialog>
                        ) : !userId ? (
                            <div>
                                {t('Please')}{' '}
                                <Link
                                    href={`/sign-in?callbackUrl=/product/${product.id}`}
                                    className='highlight-link'
                                >
                                    {t('sign in')}
                                </Link>{' '}
                                {t('to write a review')}
                            </div>
                        ): (
                            <div>
                                {t('You need to buy this product to write a review')}
                            </div>
                        )}
                    </div>
                </div>
                <div className='md:col-span-3 flex flex-col gap-3'>
                    {reviews.map((review) => (
                        <Card key={review.id}>
                            <CardHeader>
                                <div className='flex-between'>
                                    <CardTitle>{review.orderUser.fullName}</CardTitle>
                                </div>
                                <CardDescription>{review.content}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className='flex space-x-4 text-sm text-muted-foreground'>
                                    <Rating rating={review.ratingScore} />
                                    <div className='flex items-center'>
                                        <User className='mr-1 h-3 w-3' />
                                        {review.orderUser ? review.orderUser.username : 'Deleted User'}
                                    </div>
                                    <div className='flex items-center'>
                                        <Calendar className='mr-1 h-3 w-3' />
                                        {review.createdAt.toString().substring(0, 10)}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    <div ref={ref}>
                        {page <= totalPages && (
                            <Button variant={'link'} onClick={loadMoreReviews}>
                                {t('See more reviews')}
                            </Button>
                        )}

                        {page < totalPages && loadingReviews && 'Loading'}
                    </div>
                </div>
            </div>
        </div>
    )
}
async function isBoughtF(productId: string) : Promise<string | undefined>{
    const limit = 50;
    const ordersRes = await getMyOrders({page:1,limit:limit});
    const orders = [] as Order[]
    if (typeof ordersRes !== 'string') {
        orders.push(...ordersRes.data);
        const totalPage = Math.ceil(ordersRes.totalItem/limit);
        if (totalPage>1) {
            for (let i = 2; i <= totalPage; i++) {
                const orderPage = await getMyOrders({page:i,limit:limit});
                if (typeof orderPage !== 'string') {
                    orders.push(...orderPage.data);
                }
            }
        }
        return orders.find(o => o.status.statusCode ==5 && o.orderItems.find(oi => oi.productId === productId)
        )?.orderId;
    }
    return undefined

}
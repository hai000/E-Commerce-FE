'use client'

import Rating from './rating'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { ChevronDownIcon } from 'lucide-react'
import {useTranslations} from "next-intl";

type RatingSummaryProps = {
    asPopover?: boolean
    avgRating: number
    numReviews: number
}

export default function RatingSummary({
                                          asPopover,
                                          avgRating = 0,
                                          numReviews = 0,

                                      }: RatingSummaryProps) {
    const  t = useTranslations()
    const RatingDistribution = () => {


        return (
            <>
                <div className='flex flex-wrap items-center gap-1 cursor-help'>
                    <Rating rating={avgRating} />
                    <span className='text-lg font-semibold'>
            {avgRating.toFixed(1)} {t('out of 5')}
          </span>
                </div>
                <div className='text-lg '>{numReviews} {t('ratings')}</div>
            </>
        )
    }

    return asPopover ? (
        <div className='flex items-center gap-1'>
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant='ghost' className='px-2 [&_svg]:size-6 text-base'>
                        <span>{avgRating.toFixed(1)}</span>
                        <Rating rating={avgRating} />
                        <ChevronDownIcon className='w-5 h-5 text-muted-foreground' />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className='w-auto p-4' align='end'>
                    <div className='flex flex-col gap-2'>
                        <RatingDistribution />
                        <Separator />
                        <Link className='highlight-link text-center' href='#reviews'>
                            {t('See customer reviews')}
                        </Link>
                    </div>
                </PopoverContent>
            </Popover>
            <div className=' '>
                <Link href='#reviews' className='highlight-link'>
                    {numReviews} {t('ratings')}
                </Link>
            </div>
        </div>
    ) : (
        <RatingDistribution />
    )
}
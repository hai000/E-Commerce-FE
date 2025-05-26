'use client'
import { ChevronUp } from 'lucide-react'
import { Button } from '../ui/button'
import Link from 'next/link'
import { APP_NAME } from '@/lib/constants'
import {useTranslations} from "next-intl";

export default function Footer() {
    const t = useTranslations()
    return (
        <footer className='bg-white  text-black underline-link'>
            <div className='w-full'>
                <Button
                    variant='ghost'
                    className='bg-orange-400 w-full  rounded-none '
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                    <ChevronUp className='mr-2 h-4 w-4' />
                    Back to top
                </Button>
            </div>
            <div className='p-4'>
                <div className='flex justify-center  gap-3 text-sm'>
                    <Link href='/(home)/page.tsx/conditions-of-use'>{t('About.Conditions of Use')}</Link>
                    <Link href='/(home)/page.tsx/privacy-policy'>{t('About.Privacy Notice')}</Link>
                    <Link href='/(home)/page.tsx/help'>{t('About.Help')}</Link>
                </div>
                <div className='flex justify-center text-sm'>
                    <p> © 2000-2024, {APP_NAME}, Inc. or its affiliates</p>
                </div>
                <div className='mt-8 flex justify-center text-sm text-gray-400'>
                    123, Main Street, Anytown, CA, Zip 12345 | +1 (123) 456-7890
                </div>
            </div>
        </footer>
    )
}
import { APP_NAME } from '@/lib/constants'
import Link from 'next/link'
import React from 'react'
import {useTranslations} from "next-intl";

export default function CheckoutFooter() {
    const t = useTranslations()
    return (
        <div className='border-t-2 space-y-2 my-4 py-4'>
            <p>
                {t('About.Need help Check our')} <Link href='/page/help'>{t('About.Help Center')}</Link> {t('or')}{' '}
                <Link href='/page/contact-us'>{t('About.Contact Us')}</Link>{' '}
            </p>
            <p>
                {t('For an item ordered from')} {APP_NAME}: {t('When you click the')} &apos;{t('Place Your Order')}&apos; {t('we will send')} {APP_NAME}
                &apos; <Link href='/page/privacy-policy'>{t('privacy notice')}</Link> {t('and')}
                <Link href='/page/conditions-of-use'> {t('conditions of use')}</Link>.
            </p>
            <p>
                {t('with in')}.{' '}
                <Link href='/page/returns-policy'>
                    {t('See')} {APP_NAME}&apos;s {t('Returns Policy')}.
                </Link>
            </p>
        </div>
    )
}
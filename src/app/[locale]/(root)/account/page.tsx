import BrowsingHistoryList from '@/components/shared/browsing-history-list'
import { Card, CardContent } from '@/components/ui/card'
import { Home, PackageCheckIcon, User } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import {getTranslations} from "next-intl/server";

const PAGE_TITLE = async () => {
    const t = await getTranslations()
    return t('Your account')
}
export const metadata: () => Promise<{ title: string }> = async () => {
    return {
        title: await PAGE_TITLE(),
    }
}
export default async function AccountPage() {
    const t = await getTranslations()
    return (
        <div>
            <h1 className='h1-bold py-4'>{t('Your account')}</h1>
            <div className='grid md:grid-cols-3 gap-4 items-stretch'>
                <Card>
                    <Link href='/account/orders'>
                        <CardContent className='flex items-start gap-4 p-6'>
                            <div>
                                <PackageCheckIcon className='w-12 h-12' />
                            </div>
                            <div>
                                <h2 className='text-xl font-bold'>{t('Orders')}</h2>
                                <p className='text-muted-foreground'>
                                    {t('Track return cancel')}

                                </p>
                            </div>
                        </CardContent>
                    </Link>
                </Card>

                <Card>
                    <Link href='/account/manage'>
                        <CardContent className='flex items-start gap-4 p-6'>
                            <div>
                                <User className='w-12 h-12' />
                            </div>
                            <div>
                                <h2 className='text-xl font-bold'>{t('Login & security')}</h2>
                                <p className='text-muted-foreground'>
                                    {t('Manage password email and mobile number')}
                                </p>
                            </div>
                        </CardContent>
                    </Link>
                </Card>

                <Card>
                    <Link href='/account/addresses'>
                        <CardContent className='flex items-start gap-4 p-6'>
                            <div>
                                <Home className='w-12 h-12' />
                            </div>
                            <div>
                                <h2 className='text-xl font-bold'>{t('Addresses')}</h2>
                                <p className='text-muted-foreground'>
                                    {t('Edit remove or set default address')}
                                </p>
                            </div>
                        </CardContent>
                    </Link>
                </Card>
            </div>
            <BrowsingHistoryList className='mt-16' />
        </div>
    )
}
'use client'
import * as React from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import {useLocale, useTranslations} from 'next-intl'
import {Link, usePathname} from '@/i18n/routing'
import {i18n} from '@/i18n-config'
import {ChevronDownIcon} from 'lucide-react'

export default function LanguageSwitcher() {
    const {locales} = i18n
    const locale = useLocale()
    const pathname = usePathname()
    const t = useTranslations()
    return (
        <div className='w-[88px] flex items-center'>
            <DropdownMenu>
                <DropdownMenuTrigger className='w-full header-button'>
                    <div className='w-full flex justify-between items-center'>
                          <span className='text-xs'>
                            {locales.find((l) => l.code === locale)?.name}
                          </span>
                        <ChevronDownIcon/>
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className='w-56'>
                    <DropdownMenuLabel>{t('Language')}</DropdownMenuLabel>
                    <DropdownMenuRadioGroup value={locale}>
                        {locales.map((c) => (
                            <DropdownMenuRadioItem key={c.name} value={c.code}>
                                <Link
                                    className='w-full flex items-center gap-1'
                                    href={pathname}
                                    locale={c.code}
                                >
                                    <span className='text-xs'>{c.icon} | {c.name}</span>
                                </Link>
                            </DropdownMenuRadioItem>
                        ))}
                    </DropdownMenuRadioGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
import {Geist, Geist_Mono} from 'next/font/google'
import '../globals.css'
import {NextIntlClientProvider} from 'next-intl'
import {getMessages} from 'next-intl/server'
import {routing} from '@/i18n/routing'
import {notFound} from 'next/navigation'
import data from "@/lib/data";
import {CurrencyProvider} from "@/hooks/use-currency";
import {SessionProvider} from "next-auth/react";

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
})

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
})

export async function generateMetadata() {
    const {
        site: {slogan, name, description, url},
    } = data.settings[0]
    return {
        title: {
            template: `%s | ${name}`,
            default: `${name}. ${slogan}`,
        },
        description: description,
        metadataBase: new URL(url),
    }
}

export default async function AppLayout({
                                            params,
                                            children,
                                        }: {
    params: { locale: string }
    children: React.ReactNode
}) {
    const {locale} = await params
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!routing.locales.includes(locale as any)) {
        notFound()
    }
    const messages = await getMessages()
    return (
        <html
            lang={locale}
            suppressHydrationWarning
        >
        <body
            className={`min-h-screen ${geistSans.variable} ${geistMono.variable} antialiased`}
        >

        <NextIntlClientProvider locale={locale} messages={messages}>
            <SessionProvider>
                <CurrencyProvider>
                    {children}
                </CurrencyProvider>
            </SessionProvider>
        </NextIntlClientProvider>
        </body>
        </html>
    )
}
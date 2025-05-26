import * as React from 'react'
import Link from 'next/link'
import {ChevronRight, MenuIcon, UserCircle, X} from 'lucide-react'
import {Button} from '@/components/ui/button'
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from '@/components/ui/drawer'
import {auth} from "@/auth";
import {SignOut} from "@/lib/api/user";
import {Category} from "@/lib/response/category";
import {getTranslations} from "next-intl/server";

export default async function Sidebar({
                                          categories,
                                      }: {
    categories: Category[]
}) {
    const t = await getTranslations()
    const session = await auth()
    return (
        <Drawer direction='left'>
            <DrawerTrigger className='header-button flex items-center !p-2  '>
                <MenuIcon className='h-5 w-5 mr-1'/>
                {t('all')}
            </DrawerTrigger>
            <DrawerContent className='w-[350px] mt-0 top-0'>
                <div className='flex flex-col h-full'>
                    <div className='dark bg-primary text-foreground flex items-center justify-between  '>
                        <DrawerHeader>
                            <DrawerTitle className='flex items-center'>
                                <UserCircle className='h-6 w-6 mr-2'/>
                                {session ? (
                                    <DrawerClose asChild>
                                        <Link href='/account'>
                                          <span className='text-lg font-semibold'>
                                             {t('hello')}, {session.user.name}
                                          </span>
                                        </Link>
                                    </DrawerClose>
                                ) : (
                                    <DrawerClose asChild>
                                        <Link href='/sign-in'>
                                          <span className='text-lg font-semibold'>
                                            {t('Hello, sign in')}
                                          </span>
                                        </Link>
                                    </DrawerClose>
                                )}
                            </DrawerTitle>
                        </DrawerHeader>
                        <DrawerClose asChild>
                            <Button variant='ghost' size='icon' className='mr-2'>
                                <X className='h-5 w-5'/>
                                <span className='sr-only'>{t('Close')}</span>
                            </Button>
                        </DrawerClose>
                    </div>
                    <div className='flex-1 overflow-y-auto'>
                        <div className='p-4 border-b'>
                            <h2 className='text-lg font-semibold'>{t('Shop By Department')}</h2>
                        </div>
                        <nav className='flex flex-col'>
                            {categories.map((category) => (
                                <DrawerClose asChild key={category.id}>
                                    <Link
                                        href={`/search?category=${category.id}`}
                                        className={`flex items-center justify-between item-button`}
                                    >
                                        <span>{category.name}</span>
                                        <ChevronRight className='h-4 w-4'/>
                                    </Link>
                                </DrawerClose>
                            ))}
                        </nav>
                    </div>


                    <div className='border-t flex flex-col '>
                        <div className='p-4'>
                            <h2 className='text-lg font-semibold'>{t('About.Help and setting')}</h2>
                        </div>
                        <DrawerClose asChild>
                            <Link href='/account' className='item-button'>
                                {t('User.Your account')}
                            </Link>
                        </DrawerClose>{' '}
                        <DrawerClose asChild>
                            <Link href='/page/customer-service' className='item-button'>
                                {t('About.Customer Service')}

                            </Link>
                        </DrawerClose>
                        {session ? (
                            <form action={SignOut} className='w-full'>
                                <Button
                                    className='w-full justify-start item-button text-base'
                                    variant='ghost'
                                >
                                    {t('Login.Sign out')}
                                </Button>
                            </form>
                        ) : (
                            <Link href='/sign-in' className='item-button'>
                                {t('Login.Sign In')}
                            </Link>
                        )}
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    )
}
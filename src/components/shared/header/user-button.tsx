import {cn} from "@/lib/utils";
import {auth} from "@/auth";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup, DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {ChevronDown} from "lucide-react";
import Link from "next/link";
import {Button, buttonVariants} from "@/components/ui/button";
import React from "react";
import {SignOut} from "@/lib/api/user";
import {getTranslations} from "next-intl/server";

export default async function UserButton() {
    const session = await auth()
    const t = await getTranslations()
    return (
        <div className='flex gap-2 items-center'>
            <DropdownMenu>
                <DropdownMenuTrigger className='header-button' asChild>
                    <div className='flex items-center'>
                        <div className='flex flex-col text-xs text-left'>
                            <span>{t('hello')}, {session ? session.user.name : t('sign in')}</span>
                            <span className='font-bold'>{t('Account & Orders')}</span>
                        </div>
                        <ChevronDown />
                    </div>
                </DropdownMenuTrigger>
                {session ? (
                    <DropdownMenuContent className='w-56' align='end' forceMount>
                        <DropdownMenuLabel className='font-normal'>
                            <div className='flex flex-col space-y-1'>
                                <p className='text-sm font-medium leading-none'>
                                    {session.user.name}
                                </p>
                                <p className='text-xs leading-none text-muted-foreground'>
                                    {session.user.email}
                                </p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuGroup>
                            <Link className='w-full' href='/account'>
                                <DropdownMenuItem>{t('User.Your account')}</DropdownMenuItem>
                            </Link>
                            <Link className='w-full' href='/account/orders'>
                                <DropdownMenuItem>{t('Order.Your orders')}</DropdownMenuItem>
                            </Link>

                            {session.user.role == 'ADMIN' && (
                                <Link className='w-full' href='/admin/overview'>
                                    <DropdownMenuItem>{t('User.Admin')}</DropdownMenuItem>
                                </Link>
                            )}
                        </DropdownMenuGroup>
                        <DropdownMenuItem className='p-0 mb-1'>
                            <form action={SignOut} className='w-full'>
                                <Button
                                    className='w-full py-4 px-2 h-4 justify-start'
                                    variant='ghost'
                                >
                                    {t('Login.Sign out')}

                                </Button>
                            </form>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                ) : (
                    <DropdownMenuContent className='w-56' align='end' forceMount>
                        <DropdownMenuGroup>
                            <DropdownMenuItem>
                                <Link
                                    className={cn(buttonVariants(), 'w-full')}
                                    href='/sign-in'
                                >
                                    Sign in
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuLabel>
                            <div className='font-normal'>
                                New Customer? <Link href='/sign-up'>Sign up</Link>
                            </div>
                        </DropdownMenuLabel>
                    </DropdownMenuContent>
                )}
            </DropdownMenu>
        </div>
    )
}

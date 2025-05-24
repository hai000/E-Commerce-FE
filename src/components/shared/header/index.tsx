import { APP_NAME } from '@/lib/constants'
import Image from 'next/image'
import Link from 'next/link'
import Menu from './menu'
import data from '@/lib/data'
import Search from './search'
import Sidebar from "@/components/shared/header/sidebar";
import {getAllCategories} from "@/lib/api/category";
import {Category} from "@/lib/response/category";
import {getAllTags} from "@/lib/api/tag";
import {ITag} from "@/lib/response/tag";

export default async function Header() {
    let tags = await getAllTags()
    const categories = await getAllCategories()
    if (typeof tags === "string") {
        tags = []
    }
    const headerMenus: {
        name: string
        href: string }[] = []
    let subTags: ITag[] = tags
    if (subTags.length>4) {
        subTags = subTags.slice(0,4)
    }
    subTags.forEach((t) => {
        headerMenus.push({
            name: t.name,
            href: `/search?tag=${t.name}`,
        })
    })
    return (
        <header className='bg-orange-600  text-white'>
            <div className='px-2'>
                <div className='flex items-center justify-between'>
                    <div className='flex items-center'>
                        <Link
                            href='/'
                            className='flex items-center header-button font-extrabold text-2xl m-1 '
                        >
                            <Image
                                src='/icons/logo.svg'
                                width={40}
                                height={40}
                                alt={`${APP_NAME} logo`}
                            />
                            {APP_NAME}
                        </Link>
                    </div>
                    <div className='hidden md:block flex-1 max-w-xl'>
                        <Search />
                    </div>
                    <Menu />
                </div>
                <div className='md:hidden block py-2'>
                    <Search />
                </div>
            </div>
            <div className='flex items-center px-3 mb-[1px]  bg-orange-500'>
                <Sidebar categories={categories as Category[]} />
                <div className='flex items-center flex-wrap gap-3 overflow-hidden   max-h-[42px]'>
                    {headerMenus.map((menu) => (
                        <Link
                            href={menu.href}
                            key={menu.href}
                            className='header-button !p-2'
                        >
                            {menu.name}
                        </Link>
                    ))}
                </div>
            </div>
        </header>
    )
}
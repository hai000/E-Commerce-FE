
import Link from 'next/link'
import Menu from './menu'
import Search from './search'
import Sidebar from "@/components/shared/header/sidebar";
import {getAllCategories} from "@/lib/api/category";
import {Category} from "@/lib/response/category";
import {getAllTags} from "@/lib/api/tag";
import {ITag} from "@/lib/response/tag";
import {IconIndex} from "@/components/shared/header/icon-index";

export default async function Header() {
    let tags = await getAllTags()
    const resCategories = await getAllCategories()
    const categories = typeof resCategories ==="string"?[] as Category[] :resCategories
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
                        <IconIndex/>
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
                <div className="flex flex-nowrap gap-3 overflow-x-auto max-h-[42px] hide-scrollbar">
                    {headerMenus.map((menu) => (
                        <Link
                            href={menu.href}
                            key={menu.href}
                            className="header-button !p-2 whitespace-nowrap"
                        >
                            {menu.name}
                        </Link>
                    ))}
                </div>
            </div>
        </header>
    )
}
import { SearchIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { APP_NAME } from '@/lib/constants'
import {getAllCategories} from "@/lib/api/category";
import {getTranslations} from "next-intl/server";
export default async function Search() {
    let categories = await getAllCategories()
    if(typeof categories === "string") {
        categories = []
    }
    const t =await getTranslations()
    return (
        <form
            action='/search'
            method='GET'
            className='flex  items-stretch h-10 '
        >
                <Select name='category'>
                    <SelectTrigger className='w-24 h-full dark:border-gray-200 bg-gray-100 text-black border-r  rounded-r-none rounded-l-md'>
                        <SelectValue placeholder={t('all')} />
                    </SelectTrigger>
                    <SelectContent className={'max-w-[180px]'} position='popper'>
                        <SelectItem value='all'>{t('all')}</SelectItem>
                        {(categories).map((category) => (
                            <SelectItem key={category.id} value={category.id.toString()}>
                                <span className="max-w-[180px]">{category.name}</span>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            <Input
                className='flex-1 rounded-none dark:border-gray-200 bg-gray-100 text-black text-base h-full'
                placeholder={`${t('Search Site')} ${APP_NAME}`}
                name='q'
                type='search'
            />
            <button
                type='submit'
                className='bg-primary text-primary-foreground text-black rounded-s-none rounded-e-md h-full px-3 py-2 '
            >
                <SearchIcon className='w-6 h-6' />
            </button>
        </form>
    )
}
import Link from 'next/link'

import Pagination from '@/components/shared/pagination'
import ProductCard from '@/components/shared/product/product-card'
import { Button } from '@/components/ui/button'
import ProductSortSelector from '@/components/shared/product/product-sort-selector'
import { getFilterUrl } from '@/lib/utils'
import {getAllCategories} from "@/lib/api/category";
import {getAllTags} from "@/lib/api/tag";
import {Filter, getAllProductByFilter} from "@/lib/api/product";
import CollapsibleOnMobile from "@/components/shared/mobile/collapsible-for-mobile";
import {IProduct} from "@/lib/response/product";

const sortOrders = [
    { value: 'price-low-to-high', name: 'Price: Low to high' },
    { value: 'price-high-to-low', name: 'Price: High to low' },
    { value: 'newest-arrivals', name: 'Newest arrivals' },
    { value: 'avg-customer-review', name: 'Avg. customer review' },
    { value: 'best-selling', name: 'Best selling' },
]

const prices = [
    {
        name: '100000-200000',
        value: '100000-200000',
    },
    {
        name: '200000 to 500000',
        value: '200000-500000',
    },
    {
        name: '500000 to 1000000',
        value: '500000-1000000',
    },
]

export async function generateMetadata(props: {
    searchParams: Promise<{
        q: string
        category: string
        tag: string
        price: string
        rating: string
        sort: string
        page: string
    }>
}) {
    const searchParams = await props.searchParams
    const {
        q = 'all',
        category = 'all',
        tag = 'all',
        price = 'all',
        rating = 'all',
    } = searchParams

    if (
        (q !== 'all' && q !== '') ||
        category !== 'all' ||
        tag !== 'all' ||
        rating !== 'all' ||
        price !== 'all'
    ) {
        return {
            title: `Search ${q !== 'all' ? q : ''}
          ${category !== 'all' ? ` : Category ${category}` : ''}
          ${tag !== 'all' ? ` : Tag ${tag}` : ''}
          ${price !== 'all' ? ` : Price ${price}` : ''}
          ${rating !== 'all' ? ` : Rating ${rating}` : ''}`,
        }
    } else {
        return {
            title: 'Search Products',
        }
    }
}

export default async function SearchPage(props: {
    searchParams: Promise<{
        q: string
        category: string
        tag: string
        price: string
        rating: string
        sort: string
        page: string
        category_name: string
    }>
}) {
    const searchParams = await props.searchParams

    const {
        q = 'all',
        category = 'all',
        tag = 'all',
        price = 'all',
        rating = 'all',
        sort = 'best-selling',
        page = '1',
        category_name= '',
    } = searchParams

    const params = { q, category_name, tag, price, rating, sort, page }

    const categories = await getAllCategories()
    const tags = await getAllTags()
    const data = await getAllProductByFilter({
        category_name,
        tag,
        query: q,
        price,
        rating,
        page: Number(page),
        sort,
    } as Filter)
    return (
        <div>
            <div className='mb-2 py-2 md:border-b justify-between flex flex-col md:flex-row '>
                <div className='flex items-center'>
                    {data.totalProducts === 0
                        ? 'No'
                        : `${data.from}-${data.to} of ${data.totalProducts}`}{' '}
                    results
                    {(q !== 'all' && q !== '') ||
                    (category !== 'all' && category !== '') ||
                    (tag !== 'all' && tag !== '') ||
                    rating !== 'all' ||
                    price !== 'all'
                        ? ` for `
                        : null}
                    {q !== 'all' && q !== '' && '"' + q + '"'}
                    {category !== 'all' && category !== '' && `  Category: ` + category_name}
                    {tag !== 'all' && tag !== '' && `   Tag: ` + tag}
                    {price !== 'all' && `    Price: ` + price}
                    {rating !== 'all' && `   Rating: ` + rating + ` & up`}
                    &nbsp;
                    {(q !== 'all' && q !== '') ||
                    (category !== 'all' && category !== '') ||
                    (tag !== 'all' && tag !== '') ||
                    rating !== 'all' ||
                    price !== 'all' ? (
                        <Button variant={'link'} asChild>
                            <Link href='/search'>Clear</Link>
                        </Button>
                    ) : null}
                </div>
                <div>
                    <ProductSortSelector
                        sortOrders={sortOrders}
                        sort={sort}
                        params={params}
                    />
                </div>
            </div>
            <div className='bg-card grid md:grid-cols-5 md:gap-4'>
                <CollapsibleOnMobile title='Filters'>
                    <div className='space-y-4'>
                        <div>
                            <div className='font-bold'>Department</div>
                            <ul>
                                <li>
                                    <Link
                                        className={`${
                                            ('all' === category || '' === category) && 'text-primary'
                                        }`}
                                        href={getFilterUrl({ category: 'all', params })}
                                    >
                                        All
                                    </Link>
                                </li>
                                {typeof categories!== "string" && categories.map((c) => (
                                    <li key={c.id}>
                                        <Link
                                            className={`${c.id == category && 'text-primary'}`}
                                            href={getFilterUrl({category_name: c.name, category: c.id, params })}
                                        >
                                            {c.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <div className='font-bold'>Price</div>
                            <ul>
                                <li>
                                    <Link
                                        className={`${'all' == price && 'text-primary'}`}
                                        href={getFilterUrl({ price: 'all', params })}
                                    >
                                        All
                                    </Link>
                                </li>
                                {prices.map((p) => (
                                    <li key={p.value}>
                                        <Link
                                            href={getFilterUrl({ price: p.value, params })}
                                            className={`${p.value === price && 'text-primary'}`}
                                        >
                                            {p.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <div className='font-bold'>Tag</div>
                            <ul>
                                <li>
                                    <Link
                                        className={`${
                                            ('all' == tag || '' == tag) && 'text-primary'
                                        }`}
                                        href={getFilterUrl({ tag: 'all', params })}
                                    >
                                        All
                                    </Link>
                                </li>
                                {typeof tags !== "string" &&tags.map((t) => (
                                    <li key={t.name}>
                                        <Link
                                            className={`${t.name === tag && 'text-primary'}`}
                                            href={getFilterUrl({ tag: t.name, params })}
                                        >
                                            {t.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </CollapsibleOnMobile>

                <div className='md:col-span-4 space-y-4'>
                    <div>
                        <div className='font-bold text-xl'>Results</div>
                        <div>Check each product page for other buying options</div>
                    </div>

                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2  lg:grid-cols-3  '>
                        {data.products.length === 0 && <div>No product found</div>}
                        {data.products.map((product: IProduct) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                    {data!.totalPages! > 1 && (
                        <Pagination page={page} totalPages={data!.totalPages} />
                    )}
                </div>
            </div>
        </div>
    )
}
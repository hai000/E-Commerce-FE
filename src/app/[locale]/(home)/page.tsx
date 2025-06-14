

import {HomeCard} from '@/components/shared/home/home-card'
import {HomeCarousel} from '@/components/shared/home/home-carousel'
import {getAllProduct} from "@/lib/api/product";
import data from "@/lib/data";
import {Card, CardContent} from "@/components/ui/card";
import ProductSlider from "@/components/shared/product/product-carousel";
import BrowsingHistoryList from "@/components/shared/browsing-history-list";
import {getAllCategories} from "@/lib/api/category";
import {Category} from "@/lib/response/category";
import {getTranslations} from "next-intl/server";
import {getAllTags} from "@/lib/api/tag";
import {ITag} from "@/lib/response/tag";
import {getCardItemFromTagToArray} from "@/lib/utils";

export default async function HomePage() {
    const t = await getTranslations('Home')
    const resCategories = await getAllCategories();
    const categories = (typeof resCategories ==="string"?[] as Category[] :resCategories).slice(0, 4) as Category[];
    let tags = (await getAllTags())
    if (typeof tags === "string") {
        tags = []
    }
    tags = tags.map(value => ({value, sort: Math.random()}))
        .sort((a, b) => a.sort - b.sort).slice(0, 3).map(({value}) => value) as ITag[]
    const tagCards = await Promise.all(
        tags.map(async tag => ({
            title: tag.name,
            link: {
                text: t('See More'),
                href: '/search?tag=' + tag.name,
            },
            items: await getCardItemFromTagToArray(tag.name)
        }))
    );

    const cards = [
        {
            title: 'Danh mục',
            link: {
                text: t('See More'),
                href: '/search',
            },
            items: categories.map((category: Category) => ({
                name: category.name,
                image: category.imagePath,
                href: `/search?category=${category.id}&category_name=${category.name}`,
            })),
        },
        ...tagCards,
    ];
    const todaysDeals = await getAllProduct({})
    return (
        <>
            <HomeCarousel items={data.carousels}/>
            <div className='md:p-4 md:space-y-4 bg-border'>
                <HomeCard cards={cards}/>
                <Card className='w-full rounded-none'>
                    <CardContent className='p-4 items-center gap-3'>
                        {typeof todaysDeals === "string" ? <div/> :
                            <ProductSlider title={t('today_deals')} products={todaysDeals.data}
                            />}
                    </CardContent>
                </Card>
            </div>
            <div className='p-4 bg-background'>
                <BrowsingHistoryList/>
            </div>
        </>
    )
}

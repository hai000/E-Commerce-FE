import { HomeCard } from '@/components/shared/home/home-card'
import { HomeCarousel } from '@/components/shared/home/home-carousel'
import {getAllProduct, getProductsForCard} from "@/lib/api/product";
import data from "@/lib/data";
import {Card, CardContent} from "@/components/ui/card";
import ProductSlider from "@/components/shared/product/product-carousel";
import BrowsingHistoryList from "@/components/shared/browsing-history-list";
import {getAllCategories} from "@/lib/api/category";
import {Category} from "@/lib/response/category";

export default async function HomePage() {
    const categories = (await getAllCategories()).slice(0, 4) as Category[];
    const newArrivals = await getProductsForCard({
        tag: 'new-arrival',
        limit: 4,
    })
    const featureds = await getProductsForCard({
        tag: 'featured',
        limit: 4,
    })
    const bestSellers = await getProductsForCard({
        tag: 'best-seller',
        limit: 4,
    })
    const cards = [
        {
            title: 'Categories to explore',
            link: {
                text: 'See More',
                href: '/search',
            },
            items: categories.map((category: Category) => ({
                name: category.name,
                image: category.imagePath,
                href: `/search?category=${category.name}`,
            })),
        },
        {
            title: 'Explore New Arrivals',
            items: newArrivals,
            link: {
                text: 'View All',
                href: '/search?tag=new-arrival',
            },
        },
        {
            title: 'Discover Best Sellers',
            items: bestSellers,
            link: {
                text: 'View All',
                href: '/search?tag=new-arrival',
            },
        },
        {
            title: 'Featured Products',
            items: featureds,
            link: {
                text: 'Shop Now',
                href: '/search?tag=new-arrival',
            },
        },
    ]
    const todaysDeals = await getAllProduct()
    return (
        <>
            <HomeCarousel items={data.carousels} />
            <div className='md:p-4 md:space-y-4 bg-border'>
                <HomeCard cards={cards} />
                <Card className='w-full rounded-none'>
                    <CardContent className='p-4 items-center gap-3'>
                        {typeof todaysDeals ==="string" ? <div/>:
                            <ProductSlider title={"Today's Deals"} products={todaysDeals}
                            />}
                    </CardContent>
                </Card>
            </div>
            <div className='p-4 bg-background'>
                <BrowsingHistoryList />
            </div>
        </>
    )
}
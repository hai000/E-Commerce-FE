import {Metadata} from "next";
import {PAGE_SIZE} from "@/lib/constants";
import {getAllProduct} from "@/lib/api/product";
import ProductQuantityPageClient from "@/app/[locale]/dashboard/product-quantities/product_quantity_client";

export const metadata: Metadata = {
    title: "Product Quantity Management",
    description: "Add or update quantities for imported products",
}
export default async function ProductQuantityPage(props: {
                                                searchParams: Promise<{
                                                    id: string
                                                    page: number
                                                    size: number
                                                }>
                                            }
) {
    const searchParams = await props.searchParams
    const { page = 1, size=PAGE_SIZE  } = searchParams
    const products = await getAllProduct({
        page: page,
        size: size,
    })
    return (<>
        <ProductQuantityPageClient productsWithPage={typeof products === 'string'?{
            size: 0, totalItem: 0, data: [],page:page
        }:products } />
    </>)
}
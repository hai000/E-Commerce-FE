'use client'
import {cn} from "@/lib/utils";
import {IProduct} from "@/lib/response/product";
import {ProductCard} from "@/app/[locale]/dashboard/products/product-card";
import {useRouter} from "next/navigation";

export function ProductList({
                                className,
                                products,
                                productIdSelected
                            }: {
    className: string;
    products: IProduct[]
    productIdSelected?: string;
}) {
    const router = useRouter();
    return (
        <div className={cn("grid xsm:grid-cols-1 xlsm:grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-center items-center", className)}>
            {products.map((product) => (
                <div onClick={() => router.push(`/dashboard/products?id=${product.id}`)} key={product.id} className="cursor-pointer flex items-center justify-center">
                    <ProductCard isSelected={product.id == productIdSelected} product={product} classname={""} />
                </div>
            ))}
        </div>
    )
}
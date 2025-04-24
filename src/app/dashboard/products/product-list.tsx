'use client'
import {ProductCard} from "@/app/dashboard/products/product-card";
import {cn} from "@/lib/utils";
import {IProduct} from "@/lib/response/product";

export function ProductList({
                                className,
                                products,
                                productIdSelected
                            }: {
    className: string;
    products: IProduct[]
    productIdSelected?: string;
}) {
    return (
        <div className={cn("grid xsm:grid-cols-1 xlsm:grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-center items-center", className)}>
            {products.map((product) => (
                <div key={product.id} className="flex items-center justify-center h-full">
                    <ProductCard isSelected={product.id == productIdSelected} product={product} classname={""} />
                </div>
            ))}
        </div>
    )
}
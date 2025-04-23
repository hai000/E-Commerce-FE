"use client"
import {Card} from "@/components/ui/card";
import Image from "next/image";
import {cn} from "@/lib/utils";
import {IProduct} from "@/lib/response/product";

export function ProductCard({product,isSelected,classname}: {product:IProduct,isSelected: boolean,classname:string}) {
    return(
        <Card className={cn(isSelected? "bg-gray-50 border-2 border-foreground " : "bg-white", "h-[235px] rounded-md w-[150px]",classname)}>
            <div className="items-center flex flex-col mt-2 space-y-2">
                <Image src={product.images[0].imagePath} width={80} height={80} alt=""/>
            </div>
            <div className="ml-2 mr-2 space-y-1">
                <p className=" whitespace-nowrap overflow-hidden text-ellipsis font-bold text-lg">{product.name}</p>
                <p className="text-lg font-semibold">${product.defaultPrice}</p>
                <div className="flex justify-between space-x-2">
                    <div className="flex space-x-2" >
                        <p className="text-sm font-normal text-muted-foreground">Stock</p>
                        <p className="text-sm font-semibold">{product.quantity}</p>
                    </div>
                    <div className="flex space-x-2" >
                        <p className="text-sm font-normal text-muted-foreground">Sold</p>
                        <p className="text-sm font-semibold">{product.totalSale}</p>
                    </div>
                </div>
            </div>
        </Card>
    )
}
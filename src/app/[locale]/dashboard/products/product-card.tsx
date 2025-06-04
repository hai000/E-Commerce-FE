"use client"
import {Card} from "@/components/ui/card";
import Image from "next/image";
import {cn, getImageUrl} from "@/lib/utils";
import {IProduct} from "@/lib/response/product";

export function ProductCard({product,isSelected,classname}: {product:IProduct,isSelected: boolean,classname:string}) {
    return(
        <Card className={cn(isSelected? "bg-gray-50 border-2 border-foreground " : "bg-white", "h-[160px] rounded-md w-[140px]",classname)}>
            <div className="items-center  flex flex-col mt-1 space-y-1">
                <Image onError={
                    (e) => {
                        e.currentTarget.srcset= "/images/imagenotfound.png";
                    }
                } className=" max-h-[70px] max-w-[70px]" src={getImageUrl(product.images[0].imagePath)} width={70} height={70} alt=""/>
            </div>
            <div className="ml-2 mr-2">
                <p className="whitespace-nowrap overflow-hidden text-ellipsis font-bold">{product.name}</p>
                <p style={{fontSize: 16+'px'}} className=" font-semibold">${product.defaultPrice}</p>
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
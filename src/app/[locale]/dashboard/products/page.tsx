'use server'
import {getAllProduct} from "@/lib/api/product";
import {toast} from "@/hooks/use-toast";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {getProductDetailById} from "@/lib/api/product-detail";
import {IProductDetail} from "@/lib/response/product";
import {ProductList} from "@/app/[locale]/dashboard/products/product-list";
import {EditDescriptionProduct, EditDetailProduct} from "@/app/[locale]/dashboard/products/edit-product";
import {DialogAddProduct} from "@/app/[locale]/dashboard/products/dialog-add-product";
import {PAGE_SIZE} from "@/lib/constants";
import Pagination from "@/components/shared/pagination";
import * as React from "react";

export default async function ProductsPage(props: {
    searchParams: Promise<{
        id: string
        page: number
        size: number
    }>
    }
) {
    const searchParams = await props.searchParams
    const { id = "" , page = 1, size=PAGE_SIZE  } = searchParams
    const products = await getAllProduct({
        page: page,
        size: size,
    })
    if (typeof products === "string") {
        toast({
            title: 'Error',
            description: products,
            variant: 'destructive',
        })
        return;
    }
    let productSelected = undefined
    let productDetails = [] as IProductDetail[]
    if (id != "") {
        productSelected = products.data.find((product) => product.id == id)
        const productDetailsTemp = await getProductDetailById({productId: id})
        if (typeof productDetailsTemp !== "string") {
            productDetails = productDetailsTemp;
        }
    }

    return (
            <div className=" grid gap-4 xsm:grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 items-stretch">
                <Card className="">
                    <CardHeader>
                        <CardTitle className="flex justify-between text-xl font-bold">
                            Products
                            <DialogAddProduct/>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col justify-between h-[79vh] space-y-3">
                        <ProductList className={'xsm:overflow-auto xlsm:overflow-auto sm:overflow-auto'} currentPage={page} products={products.data} productIdSelected={productSelected?.id} />
                        <div className={'align-bottom'}>
                            <Pagination page={page} totalPages={Math.ceil(products.totalItem / size)!}/>
                        </div>
                    </CardContent>
                </Card>
                <Tabs defaultValue="descriptions" className="space-y-4">
                    <TabsList className="flex">
                        <TabsTrigger value="descriptions" className="flex-grow min-w-0 text-center">
                            Description
                        </TabsTrigger>
                        <TabsTrigger value="details" className="flex-grow min-w-0 text-center">
                            Detail
                        </TabsTrigger>
                    </TabsList>
                    {productSelected &&
                        <Card className={"w-full rounded-md gap-4"}>
                            <CardHeader className="flex-wrap">
                                <CardTitle className="text-xl font-bold ">
                                    Edit Products
                                </CardTitle>
                            </CardHeader>
                            <div className={'h-[73vh] overflow-auto'}>
                                <EditDescriptionProduct initialProduct={productSelected}/>
                                <EditDetailProduct productDetails={productDetails}  productSelected={productSelected}/>
                            </div>

                        </Card>
                    }

                </Tabs>
            </div>
    )
}
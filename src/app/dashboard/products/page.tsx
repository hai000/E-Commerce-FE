import {ProductList} from "@/app/dashboard/products/product-list"
import {getAllProduct} from "@/lib/api/product";
import {toast} from "@/hooks/use-toast";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {EditDescriptionProduct, EditDetailProduct} from "@/app/dashboard/products/edit-product";
import {getProductDetailById} from "@/lib/api/product-detail";
import {IProductDetail} from "@/lib/response/product";

export default async function ProductsPage(props: {
    searchParams: Promise<{
        id: string
    }>
    }
) {
    const searchParams = await props.searchParams
    const { id = "" } = searchParams
    const products = await getAllProduct()
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
        productSelected = products.find((product) => product.id == id)
        const productDetailsTemp = await getProductDetailById({productId: id})
        if (typeof productDetailsTemp !== "string") {
            productDetails = productDetailsTemp;
        }
    }

    return (
            <div className="grid gap-4 xsm:grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 items-stretch">
                <Card className="h-full">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold">
                            Products
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="w-full">
                        <ProductList className={"h-full "} products={products} productIdSelected={productSelected?.id} />
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
                    {productSelected && (
                        <div>
                            <EditDescriptionProduct className="h-full" initialProduct={productSelected}/>
                            <EditDetailProduct className="h-full" productDetails={productDetails}  productSelected={productSelected}/>

                        </div>
                    )}

                </Tabs>
            </div>
    )
}
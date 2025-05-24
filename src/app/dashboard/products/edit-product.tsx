'use client'
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {cn} from "@/lib/utils";
import {IProduct, IProductDetail} from "@/lib/response/product";
import EditTabDescriptionContent, {EditTabDetailContent} from "@/app/dashboard/products/edit-component";
import {TabsContent} from "@/components/ui/tabs";
import * as React from "react";
import {useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import {getProductById, updateProduct} from "@/lib/api/product";
import {toast} from "@/hooks/use-toast";
import {getProductDetailById} from "@/lib/api/product-detail";

export function EditDescriptionProduct({
                                           className,
                                           initialProduct,
                                       }: { className?: string, initialProduct?: IProduct }) {
    const [product, setProduct] = useState(initialProduct ? {...initialProduct} : undefined);
    const discard = () => {
        setProduct(initialProduct ? {...initialProduct} : undefined);
    };
    const handleProductChange = (newProduct: IProduct) => {
        setProduct(newProduct);
    };

    const save = async () => {
        const productUpdated = await updateProduct(product);
        if (typeof productUpdated !== "string") {
            toast(
                {
                    title: "Success",
                    description: `${productUpdated.name} updated successfully.`,
                    variant: "success"
                }
            )
        } else {
            toast(
                {
                    title: "Failed",
                    description: `${productUpdated}`,
                    variant: "destructive"
                }
            )
        }
    }
    return (
        <>
            <TabsContent value="descriptions" className="space-y-4">
                {product ?
                    <Card className={cn(className, "w-full rounded-md gap-4")}>
                        <CardHeader className="flex-wrap">
                            <CardTitle className="text-xl font-bold ">
                                Edit Products
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <EditTabDescriptionContent onProductChange={handleProductChange} product={product}/>
                            <div className="flex justify-end space-x-4 w-full">
                                <Button onClick={discard} className="hover:bg-destructive bg-red-600  w-[70px]">
                                    Discard
                                </Button>
                                <Button onClick={save} className="w-[70px]">
                                    Save
                                </Button>
                            </div>

                        </CardContent>
                    </Card>
                    : <Card className={cn("rounded-md", className)}/>
                }
            </TabsContent>
        </>
    )
}

export function EditDetailProduct({
                                      className, productSelected, productDetails
                                  }: {
    className?: string,
    productSelected?: IProduct,
    productDetails: IProductDetail[]
}) {
    const [product, setProduct] = useState(productSelected ? {...productSelected} : undefined);
    const [productDe, setProductDe] = useState(productDetails ? productDetails : []);
    const [selectedColorId, setSelectedColorId] = useState(product?.colors[0]?.id || '');
    const [selectedSizeId, setSelectedSizeId] = useState(product?.sizes[0]?.id || '');
    const [isReload, setIsReload] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const productFetch = await getProductById(product?.id||'');
            if (typeof productFetch === 'string') {
                toast({
                    title: "Error",
                    description: `${productFetch}`,
                    variant: "destructive"
                })
            } else {
                setProduct(productFetch);
            }
            const productDetailsTemp = await getProductDetailById({ productId: product?.id || '' });
            if (typeof productDetailsTemp === "string") {
                toast({
                    title: "Error",
                    description: `${productDetailsTemp}`,
                    variant: "destructive"
                })
            } else {
                setProductDe(productDetailsTemp)
            }
        };
        fetchData();
    }, [isReload]);
    useEffect(() => {
        if (product) {
            setSelectedColorId(product.colors[0]?.id || '');
            setSelectedSizeId(product.sizes[0]?.id || '');
        }
    }, [product]);
    return (
        <>
            <TabsContent value="details" className="space-y-4">
                {product ?
                    <Card className={cn(className, "w-full rounded-md gap-4")}>
                        <CardHeader className="flex-wrap">
                            <CardTitle className="text-xl font-bold ">
                                Edit Products
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <EditTabDetailContent isReload={isReload}
                                                  setIsReload={setIsReload}
                                                  productDetails={productDe} productSelected={product}
                                                  setSelectedColorId={setSelectedColorId}
                                                  setSelectedSizeId={setSelectedSizeId}
                                                  selectedColorId={selectedColorId} selectedSizeId={selectedSizeId}/>
                        </CardContent>
                    </Card>
                    : <Card className={cn("rounded-md", className)}/>
                }
            </TabsContent>
        </>
    )
}
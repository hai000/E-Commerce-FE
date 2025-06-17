'use client'
import {Card, CardContent} from "@/components/ui/card";
import {cn} from "@/lib/utils";
import {IProduct, IProductDetail} from "@/lib/response/product";
import {TabsContent} from "@/components/ui/tabs";
import * as React from "react";
import {useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import {getProductById, updateProduct} from "@/lib/api/product";
import {toast} from "@/hooks/use-toast";
import {getProductDetailById} from "@/lib/api/product-detail";
import EditTabDescriptionContent, {EditTabDetailContent} from "@/app/[locale]/dashboard/products/edit-component";
import {useTranslations} from "next-intl";

export function EditDescriptionProduct({
                                           className,
                                           initialProduct,
                                       }: { className?: string, initialProduct?: IProduct }) {
    const [product, setProduct] = useState(initialProduct ? {...initialProduct} : undefined);
    const discard = () => {
        setProduct(initialProduct ? {...initialProduct} : undefined);
    };
    const t = useTranslations()
    const handleProductChange = (newProduct: IProduct) => {
        setProduct(newProduct);
    };
    useEffect(() => {
        setProduct(initialProduct ? {...initialProduct} : undefined);
    }, [initialProduct]);
    const save = async () => {
        const productUpdated = await updateProduct(product);
        if (typeof productUpdated !== "string") {
            toast(
                {
                    title: t("Toast.Success"),
                    description: `${productUpdated.name} updated successfully.`,
                    variant: "success"
                }
            )
        } else {
            toast(
                {
                    title: t("Toast.Error"),
                    description: `${productUpdated}`,
                    variant: "destructive"
                }
            )
        }
    }
    return (
        <>
            <TabsContent value="descriptions" className={"space-y-3"}>
                {product ?
                    <CardContent className="space-y-2 flex-1">
                        <EditTabDescriptionContent onProductChange={handleProductChange} product={product}/>
                        <div className="flex justify-end space-x-4 w-full">
                            <Button onClick={discard} className="hover:bg-destructive bg-red-600  w-[70px]">
                                {t('Discard')}
                            </Button>
                            <Button onClick={save} className="w-[70px]">
                                {t('Save')}
                            </Button>
                        </div>
                    </CardContent>
                    : <Card className={cn("rounded-md", className)}/>
                }
            </TabsContent>
        </>
    )
}

export function EditDetailProduct({
                                       productSelected, productDetails
                                  }: {
    productSelected?: IProduct,
    productDetails: IProductDetail[]
}) {
    const [product, setProduct] = useState(productSelected ? {...productSelected} : undefined);
    const [productDe, setProductDe] = useState(productDetails ? productDetails : []);
    const [isReload, setIsReload] = useState(false);
    const t = useTranslations()
    useEffect(() => {
        const fetchData = async () => {
            const productFetch = await getProductById(product?.id || '');
            if (typeof productFetch === 'string') {
                toast({
                    title: t("Toast.Error"),
                    description: `${productFetch}`,
                    variant: "destructive"
                })
            } else {
                setProduct(productFetch);
            }
            const productDetailsTemp = await getProductDetailById({productId: product?.id || ''});
            if (typeof productDetailsTemp === "string") {
                toast({
                    title: t("Toast.Error"),
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
        setProduct(productSelected ? {...productSelected} : undefined)
        setProductDe(productDetails ? productDetails : [])
    }, [productSelected, productDetails]);

    return (
        <>
            <TabsContent value="details" className="space-y-4">
                {product && <CardContent className="space-y-2">
                    <EditTabDetailContent isReload={isReload}
                                          setIsReload={setIsReload}
                                          productDetails={productDe} productSelected={product}
                    />
                </CardContent>
                }
            </TabsContent>
        </>
    )
}
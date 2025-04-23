import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {cn} from "@/lib/utils";
import {IProduct, IProductDetail, IProductSize} from "@/lib/response/product";
import {EditTabDetailContent} from "@/app/dashboard/products/edit-component";
import {TabsContent} from "@/components/ui/tabs";
import * as React from "react";
import EditTabDescriptionContent from "@/app/dashboard/products/edit-component";
import {Button} from "@/components/ui/button";

export function EditDescriptionProduct({
                                           className,
                                           product,
                                       }: { className?: string, product?: IProduct }) {
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
                            <EditTabDescriptionContent product={product}/>
                            <div className="flex justify-end space-x-4 w-full">
                                <Button className="hover:bg-destructive bg-red-600  w-[70px]">
                                    Discard
                                </Button>
                                <Button className="w-[70px]">
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
                               className,
                               product,
                           }: { className?: string, product?: IProduct }) {

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
                            <EditTabDetailContent product={product}/>
                        </CardContent>
                    </Card>
                    : <Card className={cn("rounded-md", className)}/>
                }
            </TabsContent>
        </>
    )
}
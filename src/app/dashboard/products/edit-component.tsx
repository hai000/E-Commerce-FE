'use client'
import {IProduct, IProductDetail, IProductSize} from "@/lib/response/product";
import {Card} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import * as React from "react";
import {useEffect, useState} from "react";
import {Check, ChevronsUpDown} from "lucide-react"

import {Button} from "@/components/ui/button"
import {Category} from "@/lib/response/category";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "@/components/ui/command";
import {getProductDetailById} from "@/lib/api/product-detail";
import {toast} from "@/hooks/use-toast";


export default function EditTabDescriptionContent({
                                                      product
                                                  }: {
    product: IProduct
}) {
    const category = product.category;
    return (
        <div className="space-y-4 w-full">
            <div className="">
                <p className="p-2 text-lg font-semibold">Description</p>
                <Card className={"w-full rounded-md p-4 space-y-2"}>
                    <p className="text-sm text-muted-foreground">Product name</p>
                    <Input defaultValue={product.name} onChange={(e) => product.name = e.target.value}/>
                    <p className="text-sm text-muted-foreground">Description</p>
                    <Textarea className={"resize-none"} rows={6} defaultValue={product.description}
                              onChange={(e) => product.description = e.target.value}/>
                </Card>
                <p className="p-2 text-lg font-semibold">Category</p>
                <Card className={" rounded-md p-4 space-y-2"}>
                    <p className="text-sm text-muted-foreground">Product category</p>
                    <Combobox categories={[category]}/>
                </Card>
            </div>
        </div>
    );
}

export function EditTabDetailContent({
                                         product
                                     }: {
    product: IProduct
}) {
    const [colorId, setColorId] = useState(product.colors[0].id)
    const [sizeId, setSizeId] = useState("")
    const [productDetails, setProductDetails] = useState([] as IProductDetail[])
    const [sizes, setSizes] = useState([] as IProductSize[])
    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!colorId) {
                    return;
                }
                const response = await getProductDetailById({
                    productId: product.id,
                });
                if (typeof response === "string") {
                    toast({
                        title: 'Error',
                        description: response,
                        variant: 'destructive',
                    })
                } else {
                    setProductDetails(response)
                }
            } catch (error) {
                console.log("Error fetching data:", error);
            }
        };
        fetchData()
    }, []);
    useEffect(() => {
        setSizes(productDetails.filter(productDetail => productDetail?.color.id == colorId).map(products => products.size))
        setSizeId(sizes[0]?.id)
    }, [colorId]);
    return (
        <div className="space-y-4 w-full">
            <div className="">
                <p className="p-2 text-lg font-semibold">Detail</p>
                <Card className={"rounded-md p-4 space-y-2"}>
                    <div className={product.colors?.length > 0 ? "" : "hidden"}>
                        <p className={"text-sm text-muted-foreground"}>Color</p>
                        {product.colors.length > 0 && (
                            <div className='space-x-2 space-y-2'>
                                {product.colors.map(colorObject => (
                                    <Button
                                        onClick={() => {
                                            setColorId(colorObject.id)
                                        }}
                                        variant='outline'
                                        className={
                                            colorObject.id == colorId ? 'border-2 border-primary' : 'border-2'
                                        }
                                        key={colorObject.id}
                                    >
                                        <div
                                            style={{backgroundColor: colorObject.colorCode}}
                                            className='h-3 w-3 rounded-full border border-muted-foreground'
                                        ></div>
                                        {colorObject.colorName}
                                        {/*</Link>*/}
                                    </Button>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className={sizes.length > 0 ? "" : "hidden"}>
                        <p className={"text-sm text-muted-foreground"}>Size</p>
                        {sizes.length > 0 && (
                            <div className='space-x-2 space-y-2'>
                                {sizes.map(sizeObject => (
                                    <Button
                                        onClick={() => {
                                            setSizeId(sizeObject.id)
                                        }}
                                        variant='outline'
                                        className={
                                            sizeObject.id == sizeId ? 'border-2 border-primary' : 'border-2'
                                        }
                                        key={sizeObject.id}
                                    >
                                        <div
                                            className='h-3 w-3 rounded-full border border-muted-foreground'
                                        ></div>
                                        {sizeObject.size}
                                        {/*</Link>*/}
                                    </Button>
                                ))}
                            </div>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    )
}

function Combobox({categories}: { categories: Category[] }) {
    const [open, setOpen] = useState(false);
    const [id, setId] = useState("");
    // console.log(id)
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between overflow-hidden"
                >
                    {id ? categories.find((category) => category.id == id)?.name : "Select category..."}
                    <ChevronsUpDown className="opacity-50"/>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command>
                    <CommandInput placeholder="Search category..." className=" h-9"/>
                    <CommandList>
                        <CommandEmpty>No category found.</CommandEmpty>
                        <CommandGroup>
                            {categories.map((category) => (
                                <CommandItem
                                    key={category.id}
                                    value={category.id}
                                    onSelect={() => {
                                        setId(category.id);
                                        setOpen(false);
                                    }}
                                >
                                    {category.name}
                                    <Check className={`ml-auto ${id == category.id ? "opacity-100" : "opacity-0"}`}/>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
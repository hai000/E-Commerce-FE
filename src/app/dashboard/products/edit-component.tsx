'use client'
import {IProduct, IProductSize} from "@/lib/response/product";
import {Card} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import * as React from "react";
import {useState} from "react";
import {Check, ChevronsUpDown} from "lucide-react"

import {Button} from "@/components/ui/button"
import {Category} from "@/lib/response/category";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "@/components/ui/command";
import {useEditProduct} from "@/hooks/use-edit-product";


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
                    <Combobox categoryIdSelected={product.category.id} categories={[category]}/>
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
    const {updateCurrentProduct, editProduct, setColorSelected, setSizeSelected} = useEditProduct()
    return (
        <div className="space-y-4 w-full">
            <div className="">
                <p className="p-2 text-lg font-semibold">Detail</p>
                <Card className={"rounded-md p-4 space-y-4"}>
                    <div className={product.colors?.length > 0 ? "" : "hidden"}>
                        <p className={"text-sm"}>Color</p>
                        {product.colors.length > 0 && (
                            <div className='space-x-2 space-y-2'>
                                {product.colors.map(colorObject => (
                                    <Button
                                        onClick={() => {
                                            setColorSelected(colorObject)
                                        }}
                                        variant='outline'
                                        className={
                                            colorObject.id == editProduct.colorSelected?.id ? 'border-2 border-primary' : 'border-2'
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
                    <div className={editProduct.sizes.length > 0 ? "" : "hidden"}>
                        <p className={"text-sm"}>Size</p>
                        {editProduct.sizes.length > 0 && (
                            <div className='space-x-2 space-y-2'>
                                {editProduct.sizes.map((sizeObject: IProductSize) => (
                                    <Button
                                        onClick={() => {
                                            setSizeSelected(sizeObject)
                                        }}
                                        variant='outline'
                                        className={
                                            sizeObject.id == editProduct.sizeSelected?.id ? 'border-2 border-primary' : 'border-2'
                                        }
                                        key={sizeObject.id}
                                    >
                                        <div
                                            className='h-3 w-3 rounded-full border border-muted-foreground'
                                        ></div>
                                        {sizeObject.size}
                                    </Button>
                                ))}
                            </div>
                        )}
                    </div>
                    <p className={"text-sm "}>Price</p>

                    <Input type={"number"} onChange={(event) => {
                        updateCurrentProduct({
                            discount: 0,
                            price: parseFloat(event.target.value),
                            quantity: 0
                        })
                    }
                    }  value={editProduct.curProduct ? editProduct.curProduct.price : 0}/>
                </Card>
            </div>
        </div>
    )
}

function Combobox({categoryIdSelected, categories}: { categoryIdSelected: string, categories: Category[] }) {
    const [open, setOpen] = useState(false);
    const [id, setId] = useState(categoryIdSelected);
    // console.log(id)
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild className="font-normal">
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

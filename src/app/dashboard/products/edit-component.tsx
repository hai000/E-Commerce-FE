'use client'
import {IProduct, IProductDetail, IProductSize} from "@/lib/response/product";
import {Card} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import * as React from "react";
import {useEffect, useState} from "react";
import {BadgePlus, Check, ChevronsUpDown} from "lucide-react"
import {Button} from "@/components/ui/button"
import {Category} from "@/lib/response/category";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "@/components/ui/command";
import {Label} from "@/components/ui/label";
import {AddColorRequest, AddSizeRequest} from "@/lib/request/product";
import {addColorForProduct, addSizeForProduct} from "@/lib/api/product";
import {toast} from "@/hooks/use-toast";
import {isValidHexColor} from "@/lib/utils";

interface EditTabDescriptionContentProps {
    product: IProduct;
    onProductChange: (newProduct: IProduct) => void;
}

export default function EditTabDescriptionContent({
                                                      product: initialProduct,
                                                      onProductChange
                                                  }: EditTabDescriptionContentProps) {
    const [name, setName] = useState(initialProduct.name);
    const [description, setDescription] = useState(initialProduct.description || "");
    const [category, setCategory] = useState(initialProduct.category);
    const [brand, setBrand] = useState(initialProduct.brand);

    useEffect(() => {
        setName(initialProduct.name);
        setDescription(initialProduct.description || "");
        setCategory(initialProduct.category);
        setBrand(initialProduct.brand);
    }, [initialProduct]);

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
        onProductChange({...initialProduct, name: e.target.value});
    };
    const handleBrandChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBrand(e.target.value);
        onProductChange({...initialProduct, brand: e.target.value});
    }
    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(e.target.value);
        onProductChange({...initialProduct, description: e.target.value});
    };

    const handleCategoryChange = (newCategory: any) => {
        setCategory(newCategory);
        onProductChange({...initialProduct, category: newCategory});
    };

    return (
        <div className="space-y-4 w-full">
            <div className="">
                <p className="p-2 text-lg font-semibold">Description</p>
                <Card className={"w-full rounded-md p-4 space-y-2"}>
                    <p className="text-sm text-muted-foreground">Product name</p>
                    <Input value={name} onChange={handleNameChange}/>
                    <p className="text-sm text-muted-foreground">Brand</p>
                    <Input value={brand} onChange={handleBrandChange}/>
                    <p className="text-sm text-muted-foreground">Description</p>
                    <Textarea className={"resize-none"} rows={6} value={description}
                              onChange={handleDescriptionChange}/>
                    <p className="text-sm text-muted-foreground">Default price</p>
                    <Input disabled={true} value={initialProduct.defaultPrice}/>
                </Card>
                <p className="p-2 text-lg font-semibold">Category</p>
                <Card className={" rounded-md p-4 space-y-2"}>
                    <p className="text-sm text-muted-foreground">Product category</p>
                    <Combobox categoryIdSelected={category.id} categories={[category]}/>
                </Card>
            </div>
        </div>
    );
}

export function EditTabDetailContent({
                                         isReload,
                                         setIsReload,
                                         productDetails,
                                         productSelected,
                                         selectedColorId,
                                         selectedSizeId,
                                         setSelectedSizeId,
                                         setSelectedColorId
                                     }: {
    isReload: boolean;
    setIsReload: (isReload: boolean) => void;
    productDetails: IProductDetail[],
    productSelected?: IProduct,
    selectedColorId: string,
    selectedSizeId: string,
    setSelectedSizeId: (id: string) => void,
    setSelectedColorId: (id: string) => void,
}) {
    const [colors, setColors] = useState(productSelected?.colors || []);
    const [sizes, setSizes] = useState(productSelected?.sizes || []);
    const [price, setPrice] = useState(0);
    useEffect(() => {
        setPrice(productDetails.find(p => p.color.id === selectedColorId && p.size.id === selectedSizeId)?.price ?? 0)
    }, [selectedColorId, selectedSizeId]);
    useEffect(() => {
        setColors(productSelected?.colors || []);
    }, [productSelected?.colors]);
    useEffect(() => {
        setSizes(productSelected?.sizes || []);
    }, [productSelected?.sizes]);
    const handleAddColor = async (color: AddColorRequest) => {
        if (isValidHexColor(color.colorCode)) {
            const response = await addColorForProduct(productSelected?.id || '', [color])
            if (typeof response === 'string') {
                toast({
                        title: "Error",
                        description: response,
                        variant: "destructive"
                    }
                )
            } else {
                if (response.length < 1) {
                    toast({
                            title: "Error",
                            description: "Size added",
                            variant: "destructive"
                        }
                    )
                }else {
                    toast({
                            title: "Success",
                            description: "Add color success",
                            variant: "success"
                        }
                    )
                    setIsReload(!isReload);
                }
            }
        } else {
            toast({
                    title: "Error",
                    description: "Color code is not valid",
                    variant: "destructive"
                }
            )
        }
    };
    const handleAddSize = async (sizeRequest: AddSizeRequest) => {
        const response = await addSizeForProduct(productSelected?.id || '', [sizeRequest])
        if (typeof response === 'string') {
            toast({
                    title: "Error",
                    description: response,
                    variant: "destructive"
                }
            )
        } else {
            if (response.length < 1) {
                toast({
                        title: "Error",
                        description: "Size added",
                        variant: "destructive"
                    }
                )
            }else {
                toast({
                        title: "Success",
                        description: "Add size success",
                        variant: "success"
                    }
                )
                setIsReload(!isReload);
            }
        }
    };
    return (
        <div className="space-y-4 w-full">
            <div className="">
                <p className="p-2 text-lg font-semibold">Detail</p>
                <Card className={"rounded-md p-4 space-y-4"}>
                    <div className={colors.length > 0 ? "" : "hidden"}>
                        <p className={"text-sm"}>Color</p>
                        <div className='space-x-2 space-y-2'>
                            {colors?.map(colorObject => (
                                <Button
                                    onClick={() => {
                                        setSelectedColorId(colorObject.id)
                                    }}
                                    variant='outline'
                                    className={
                                        colorObject.id == selectedColorId ? 'border-2 border-primary' : 'border-2'
                                    }
                                    key={colorObject.id}
                                >
                                    <div
                                        style={{backgroundColor: colorObject.colorCode}}
                                        className='h-3 w-3 rounded-full border border-muted-foreground'
                                    ></div>
                                    {colorObject.colorName}
                                </Button>
                            ))}
                            <DialogProductColorProperty addColor={handleAddColor}/>
                        </div>

                    </div>
                    <p className={"text-sm"}>Size</p>
                    <div className='space-x-2 space-y-2'>
                        {(sizes.map((sizeObject: IProductSize) => (
                                <Button
                                    onClick={() => {
                                        setSelectedSizeId(sizeObject.id);
                                    }}
                                    variant='outline'
                                    className={
                                        sizeObject.id == selectedSizeId ? 'border-2 border-primary' : 'border-2'
                                    }
                                    key={sizeObject.id}
                                >
                                    <div
                                        className='h-3 w-3 rounded-full border border-muted-foreground'
                                    ></div>
                                    {sizeObject.size}
                                </Button>
                            ))
                        )}
                        <DialogProductSizeProperty addSize={handleAddSize}/>
                    </div>
                    <p className={"text-sm "}>Price</p>
                    <Input type={"number"} value={price} onChange={(e) => {
                        setPrice(e.target.valueAsNumber)
                    }}/>
                </Card>
            </div>
        </div>
    )
}

export function DialogProductColorProperty({addColor}: { addColor: (color: AddColorRequest) => void }) {
    const [color, setColor] = useState<AddColorRequest>({
        colorCode: "",
        colorName: "",
    })
    const addColors = (e: React.FormEvent) => {
        e.preventDefault();
        addColor(color);
        setColor({colorName: "", colorCode: ""});
    };
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">
                    Add color<BadgePlus/>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Color</DialogTitle>
                    <DialogDescription>Add your color</DialogDescription>
                </DialogHeader>
                <form onSubmit={addColors}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="colorName" className="text-right">
                                Color name
                            </Label>
                            <Input
                                id="colorName"
                                value={color.colorName}
                                onChange={(e) =>
                                    setColor({...color, colorName: e.target.value})
                                }
                                placeholder={"White,..."}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="colorCode" className="text-right">
                                Color code
                            </Label>
                            <Input
                                id="colorCode"
                                value={color.colorCode}
                                onChange={(e) =>
                                    setColor({...color, colorCode: e.target.value})
                                }
                                placeholder={"#FFF"}
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit">Add</Button>
                        <DialogClose asChild>
                            <Button type="button" variant="destructive">
                                Close
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export function DialogProductSizeProperty({addSize}: { addSize: (size: AddSizeRequest) => void }) {
    const [size, setSize] = useState<AddSizeRequest>({
        size: "",
        description: "",
    })
    const addSizes = (e: React.FormEvent) => {
        e.preventDefault();
        addSize(size);
        setSize({size: "", description: ""});
    };
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">
                    Add size<BadgePlus/>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Size</DialogTitle>
                    <DialogDescription>Add your size</DialogDescription>
                </DialogHeader>
                <form onSubmit={addSizes}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="sizeName" className="text-right">
                                Size name
                            </Label>
                            <Input
                                id="sizeName"
                                value={size.size}
                                onChange={(e) =>
                                    setSize({...size, size: e.target.value})
                                }
                                placeholder={"L,..."}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="description" className="text-right">
                                Description
                            </Label>
                            <Input
                                id="description"
                                value={size.description}
                                onChange={(e) =>
                                    setSize({...size, description: e.target.value})
                                }
                                placeholder={"Kích thước w-100,..."}
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit">Add</Button>
                        <DialogClose asChild>
                            <Button type="button" variant="destructive">
                                Close
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
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

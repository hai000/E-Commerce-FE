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
import {useTranslations} from "next-intl";
import {ComboboxCategories} from "@/app/[locale]/dashboard/products/dialog-add-product";
import {getAllCategories} from "@/lib/api/category";
import {updateProductDetail} from "@/lib/api/product-detail";

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
    const [category, setCategory] = useState<Category>(initialProduct.category);
    const [brand, setBrand] = useState(initialProduct.brand);
    const [allCategories, setAllCategories] = useState<Category[]>([]);
    const t = useTranslations()
    useEffect(() => {
        setName(initialProduct.name);
        setDescription(initialProduct.description || "");
        setCategory(initialProduct.category);
        setBrand(initialProduct.brand);
    }, [initialProduct]);
    useEffect(() => {
        const fetchData = async () => {
            getAllCategories().then(
                (categories) => {
                    if (typeof categories !== "string") {
                        setAllCategories(categories)
                    }
                }
            ).catch(
                (error) => {
                    toast({
                        title: "Error",
                        description: error.message,
                        variant: "destructive"
                    });
                }
            )
        }
        fetchData();
    }, []);
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
// eslint-disable-next-line
    const handleCategoryChange = (newCategory: any) => {
        setCategory(newCategory);
        onProductChange({...initialProduct, category: newCategory});
    };

    return (
        <div className="space-y-4 w-full">
            <div className="">
                <p className="p-2 text-lg font-semibold">{t('Product.Description')}</p>
                <Card className={"w-full rounded-md p-4 space-y-2"}>
                    <p className="text-sm text-muted-foreground">{t('Product name')}</p>
                    <Input value={name} onChange={handleNameChange}/>
                    <p className="text-sm text-muted-foreground">{t('Product.Brand')}</p>
                    <Input value={brand} onChange={handleBrandChange}/>
                    <p className="text-sm text-muted-foreground">{t('Product.Description')}</p>
                    <Textarea className={"resize-none"} rows={6} value={description}
                              onChange={handleDescriptionChange}/>
                    <p className="text-sm text-muted-foreground">{t('Default price')} (VND)</p>
                    <Input disabled={true} value={initialProduct.defaultPrice}/>
                </Card>
                <p className="p-2 text-lg font-semibold">{t('Product.Category')}</p>
                <Card className={"rounded-md p-4 space-y-2"}>
                    <p className="text-sm text-muted-foreground">{t('Product category')}</p>
                    <div className={"grid-cols-7 grid"}>
                        <ComboboxCategories setCategoryId={(id) => {
                            const category = allCategories.find(category => category.id == id);
                            if (category) {
                                handleCategoryChange(category)
                            }
                        }} categoryId={category.id} categories={allCategories}/>
                    </div>
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
                                     }: {
    isReload: boolean;
    setIsReload: (isReload: boolean) => void;
    productDetails: IProductDetail[],
    productSelected?: IProduct,
}) {
    const t = useTranslations();
    const [selectedColorId, setSelectedColorId] = useState(productSelected?.colors?.[0]?.id || '');
    const [selectedSizeId, setSelectedSizeId] = useState(productSelected?.sizes?.[0]?.id || '');
    // eslint-disable-next-line
    const [colors, setColors] = useState(productSelected?.colors || []);
    // eslint-disable-next-line
    const [sizes, setSizes] = useState(productSelected?.sizes || []);
    const [price, setPrice] = useState(0);

    const save = async () => {
        const pDFind = productDetails.find(p => p.color?.id === selectedColorId && p.size?.id === selectedSizeId);
        if (pDFind) {
            const res = await updateProductDetail(
                {
                    productDetailId: pDFind.id,
                    price: price,
                    discount: 0
                }
            )
            if (typeof res === 'string') {
                toast({
                    title: t("Toast.Error"),
                    description: res,
                    variant: "destructive"
                })
            } else {
                toast({
                    title: t("Toast.Success"),
                    description: t("Manage.Update product detail success"),
                    variant: "success"
                })
                setIsReload(!isReload);
            }
        } else {
            toast({
                title: t("Toast.Error"),
                description: t("Something went wrong"),
                variant: "destructive"
            })
        }
    }
    useEffect(() => {
        setPrice(productDetails.find(p => p.color?.id === selectedColorId && p.size?.id === selectedSizeId)?.price ?? 0)
    }, [selectedColorId, selectedSizeId]);
    useEffect(() => {
        if (productSelected) {
            setSelectedColorId(productSelected.colors?.[0]?.id || '');
            setSelectedSizeId(productSelected.sizes?.[0]?.id || '');
        }
    }, [productSelected]);
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
                } else {
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
            } else {
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
                <p className="p-2 text-lg font-semibold">{t('Detail')}</p>
                <Card className={"rounded-md p-4 space-y-4"}>
                    <div className={colors.length > 0 ? "" : "hidden"}>
                        <p className={"text-sm"}>{t('Product.Color')}</p>
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
                    <p className={"text-sm"}>{t('Product.Size')}</p>
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
                    <p className={"text-sm "}>{t('Price')}</p>
                    <Input type={"number"} value={price} onChange={(e) => {
                        setPrice(e.target.valueAsNumber)
                    }}/>
                </Card>
            </div>
            <div className="flex justify-end space-x-4 w-full">
                <Button onClick={save} className="w-[70px]">
                    Save
                </Button>
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

export function Combobox({categoryIdSelected, categories}: { categoryIdSelected: string, categories: Category[] }) {
    const t = useTranslations()
    const [open, setOpen] = useState(false);
    const [id, setId] = useState(categoryIdSelected);
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild className="font-normal">
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between overflow-hidden"
                >
                    {id ? categories.find((category) => category.id == id)?.name : t("Manage.Select category")}
                    <ChevronsUpDown className="opacity-50"/>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command>
                    <CommandInput placeholder={t("Manage.Search category")} className=" h-9"/>
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

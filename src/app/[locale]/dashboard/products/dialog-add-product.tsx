'use client'
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,} from "@/components/ui/command"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Check, ChevronsUpDown, Loader, PlusIcon, XCircleIcon} from "lucide-react";
import {useTranslations} from "next-intl";
import * as React from "react";
import {useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import {getAllCategories} from "@/lib/api/category";
import {Category} from "@/lib/response/category";
import {ITag} from "@/lib/response/tag";
import {getAllTags} from "@/lib/api/tag";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {Checkbox} from "@/components/ui/checkbox";
import {isValidHexColor, toSlug} from "@/lib/utils";
import {AddColorRequest, AddProductRequest, AddSizeRequest} from "@/lib/request/product";
import {ScrollArea} from "@/components/ui/scroll-area";
import MultiImageUpload from "@/components/shared/imag-upload-on-submit";
import {z} from "zod";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {addProduct} from "@/lib/api/product";
import {toast} from "@/hooks/use-toast";
import {uploadFile} from "@/lib/api/upload";

export function DialogAddProduct() {
    const t = useTranslations();
    const [categories, setCategories] = useState<Category[]>([]);
    const [tags, setTags] = useState<ITag[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setMyError] = useState<string | null>(null);
    const [open, setOpen] = useState(false);
    const [sizes, setSizes] = useState<AddSizeRequest[]>([]);
    const [colors, setColors] = useState<AddColorRequest[]>([]);
    const productSchema = z.object({
        name_product: z.string().min(1, "Tên sản phẩm không được để trống"),
        brand_product: z.string().min(1, "Thương hiệu không được để trống"),
        description_product: z.string().min(1, "Mô tả không được để trống"),
        categoryId: z.string().min(1, "Chọn danh mục"),
        selectedTags: z.array(z.string()).min(1, "Chọn ít nhất 1 tag"),
        defaultPrice: z.string()
            .min(1, "Giá phải lớn hơn 0")
            .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
                message: "Giá phải là số không âm",
            }),
        defaultDiscount: z.string()
            .min(1, "Không được để trống")
            .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
                message: "Giảm giá phải là số không âm",
            }),
        images: z.array(z.instanceof(File)).min(1, "Phải chọn ít nhất 1 ảnh"),
    });
    const {
        control,
        handleSubmit,
        setValue,
        formState: {errors},
        reset,
    } = useForm<ProductFormType>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name_product: "",
            brand_product: "",
            description_product: "",
            categoryId: "",
            selectedTags: [],
            defaultPrice: "0",
            defaultDiscount: "0",
            images: [],
        },
    });

    type ProductFormType = z.infer<typeof productSchema>;
    useEffect(() => {
        const fetchData = async () => {
            const categoriesResponse = await getAllCategories();
            if (typeof categoriesResponse === "string") {
                setMyError(categoriesResponse);
            } else {
                setCategories(categoriesResponse);
                const tagsResponse = await getAllTags();
                if (typeof tagsResponse === "string") {
                    setMyError(tagsResponse);
                } else {
                    setTags(tagsResponse);
                }
            }
            setIsLoading(false);
        };
        fetchData();
    }, []);
    const onSubmit = async (data: ProductFormType) => {
        // Xử lý dữ liệu sản phẩm ở đây
        const addProductRequest = async () => {
            const imagesString = (await Promise.all(data.images.map(file => uploadFile(file)))).map(
                (resImage) => {
                   if (resImage.success){
                       return resImage.data
                   }else {
                       toast({
                            title: t("Toast.Error"),
                            description: resImage.data,
                            variant: "destructive"
                          });
                       return "/images/imagenotfound.png";
                   }
                }
            );
            console.log(imagesString)
            const productRequest = {
                name: data.name_product,
                categoryId: data.categoryId,
                brand: data.brand_product,
                description: data.description_product,
                defaultPrice: Number(data.defaultPrice),
                defaultDiscount: Number(data.defaultDiscount),
                images: imagesString,
                tags: data.selectedTags,
                colors: colors,
                sizes: sizes,
                slug: toSlug(data.name_product)
            } as AddProductRequest
            const res = await addProduct(productRequest)
            if (typeof res!== "string") {
                toast({
                    title: t("Toast.Success"),
                    description: t("Manage.Add Product Success"),
                    variant: "success"
                })
                reset()
            }else {
                toast({
                    title: t("Toast.Error"),
                    description: res,
                    variant: "destructive"
                })
            }
        }
        addProductRequest()
    };

    if (isLoading) {
        return <div><Loader/></div>;
    }
    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <Dialog open={open} onOpenChange={(e) => setOpen(e)}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <PlusIcon/>{t('Manage.Add Product')}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <ScrollArea className="p-4 max-h-[500px] w-full">
                    <DialogHeader>
                        <DialogTitle>{t('Manage.Add Product')}</DialogTitle>
                        <DialogDescription>
                            {t('Manage.Create a new product by filling out the information below')}.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid gap-4 py-4">

                            {/* Tên sản phẩm */}
                            <div className="grid grid-cols-10 items-center gap-4">
                                <Label htmlFor="name" className="text-left col-span-3">
                                    {t('Manage.Product Name')}
                                </Label>
                                <Controller
                                    name="name_product"
                                    control={control}
                                    render={({field}) => (
                                        <div className="col-span-7">
                                            <Input {...field} placeholder={t('Placeholder.Enter product name')}
                                                   id="name"/>
                                            {errors.name_product && <span
                                                className="text-destructive text-xs">{errors.name_product.message}</span>}
                                        </div>
                                    )}
                                />
                            </div>

                            {/* Thương hiệu */}
                            <div className="grid grid-cols-10 items-center gap-4">
                                <Label htmlFor="brand" className="text-left col-span-3">
                                    {t('Product.Brand')}
                                </Label>
                                <Controller
                                    name="brand_product"
                                    control={control}
                                    render={({field}) => (
                                        <div className="col-span-7">
                                            <Input {...field} placeholder={t('Placeholder.Enter brand name')}
                                                   id="brand"/>
                                            {errors.brand_product && <span
                                                className="text-destructive text-xs">{errors.brand_product.message}</span>}
                                        </div>
                                    )}
                                />
                            </div>

                            {/* Mô tả */}
                            <div className="grid grid-cols-10 items-center gap-4">
                                <Label htmlFor="description" className="text-left col-span-3">
                                    {t('Product.Description')}
                                </Label>
                                <Controller
                                    name="description_product"
                                    control={control}
                                    render={({field}) => (
                                        <div className="col-span-7">
                                            <Input {...field} placeholder={t('Placeholder.Enter description')}
                                                   id="description"/>
                                            {errors.description_product && <span
                                                className="text-destructive text-xs">{errors.description_product.message}</span>}
                                        </div>
                                    )}
                                />
                            </div>

                            {/* Danh mục */}
                            <div className="grid grid-cols-10 items-center gap-4">
                                <Label className="text-left col-span-3">
                                    {t('Product.Category')}
                                </Label>
                                <Controller
                                    name="categoryId"
                                    control={control}
                                    render={({field}) => (
                                        <div className="col-span-7">
                                            <ComboboxCategories
                                                categoryId={field.value}
                                                setCategoryId={value => setValue("categoryId", String(value))}
                                                categories={categories}
                                            />
                                            {errors.categoryId && (
                                                <span className="ml-1 text-destructive text-xs">
                        {errors.categoryId.message}
                    </span>
                                            )}
                                        </div>
                                    )}
                                />
                            </div>

                            {/* Tag */}
                            <div className="grid grid-cols-10 gap-4">
                                <Label className="text-left col-span-3">
                                    {t('Product.Tag')}
                                </Label>
                                <Controller
                                    name="selectedTags"
                                    control={control}
                                    render={({field}) => (
                                        <div className="col-span-7">
                                            <CheckBoxTags
                                                selectedTags={field.value}
                                                setSelectedTags={value => setValue("selectedTags", value)}
                                                tags={tags}
                                            />
                                            {errors.selectedTags && <span
                                                className="text-destructive text-xs">{errors.selectedTags.message}</span>}
                                        </div>
                                    )}
                                />
                            </div>
                            <div className={"grid grid-cols-10 gap-4"}>
                                <Label className="flex items-center text-left col-span-3">
                                    {t('Manage.Add Color')}
                                </Label>
                                <div className={"space-x-2 col-span-7"}>
                                    {colors.map((color, index) => (
                                            <Button
                                                key={index}
                                                style={{backgroundColor: color.colorCode}}
                                                size="icon"
                                                onClick={() => {
                                                    setColors(colors.filter((_, i) => i !== index));
                                                }}
                                            >
                                                {color.colorName}
                                            </Button>
                                        )
                                    )}
                                    <DialogAddColor
                                        colors={colors}
                                        setColors={setColors}/>
                                </div>

                            </div>
                            <div className={"grid grid-cols-10 gap-4"}>
                                <Label className="flex items-center text-left col-span-3">
                                    {t('Manage.Add Size')}
                                </Label>
                                <div className={"space-x-2 col-span-7"}>
                                    {sizes.map((size, index) => (
                                            <Button
                                                variant={"outline"}
                                                key={index}
                                                size="icon"
                                                onClick={() => {
                                                    setSizes(sizes.filter((_, i) => i !== index));
                                                }}
                                            >
                                                {size.size}
                                            </Button>
                                        )
                                    )}
                                    <DialogAddSize
                                        sizes={sizes}
                                        setSizes={setSizes}/>
                                </div>

                            </div>
                            {/* Giá */}
                            <div className="grid grid-cols-10 items-center gap-4">
                                <Label htmlFor="default_price" className="text-left col-span-3">
                                    {t('Product.Default Price')}
                                </Label>
                                <Controller
                                    name="defaultPrice"
                                    control={control}
                                    render={({field}) => (
                                        <div className="col-span-7">
                                            <Input type="number" {...field} id="default_price"/>
                                            {errors.defaultPrice && <span
                                                className="text-destructive text-xs">{errors.defaultPrice.message}</span>}
                                        </div>
                                    )}
                                />
                            </div>

                            {/* Discount */}
                            <div className="grid grid-cols-10 items-center gap-4">
                                <Label htmlFor="default_discount" className="text-left col-span-3">
                                    {t('Product.Default Discount')}
                                </Label>
                                <Controller
                                    name="defaultDiscount"
                                    control={control}
                                    render={({field}) => (
                                        <div className="col-span-7">
                                            <Input type="number" {...field} id="default_discount"/>
                                            {errors.defaultDiscount && <span
                                                className="text-destructive text-xs">{errors.defaultDiscount.message}</span>}
                                        </div>
                                    )}
                                />
                            </div>

                            {/* Ảnh */}
                            <div className="grid grid-cols-10 items-center gap-4">
                                <Label htmlFor="images" className="text-left col-span-3">
                                    {t('Product.Images')}
                                </Label>
                                <Controller
                                    name="images"
                                    control={control}
                                    render={({field}) => (
                                        <div className="col-span-7 items-center flex flex-wrap">
                                            <MultiImageUpload
                                                files={field.value}
                                                setFiles={value => setValue("images", value)}
                                            />
                                            {errors.images &&
                                                <span
                                                    className="ml-1 text-red-500 text-xs">{errors.images.message}</span>}
                                        </div>
                                    )}
                                />
                            </div>

                        </div>
                        <DialogFooter>
                            <Button type="submit">{t('Manage.Save changes')}</Button>
                        </DialogFooter>
                    </form>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}

export function CheckBoxTags({
                                 setSelectedTags,
                                 selectedTags,
                                 tags,
                             }: {
    setSelectedTags: (value: string[]) => void,
    selectedTags: string[],
    tags: ITag[]
}) {
    const handleChange = (id: string, checked: boolean) => {
        if (checked) {
            // Thêm tag nếu chưa có
            if (!selectedTags.includes(id)) setSelectedTags([...selectedTags, id]);
        } else {
            // Bỏ tag nếu đã có
            setSelectedTags(selectedTags.filter(tagId => tagId !== id));
        }
    };

    return (
        <div className="col-span-7">
            {tags.map(tag => (
                <div
                    key={tag.name}
                    className="flex flex-row items-start space-x-3 space-y-0"
                >
                    <Checkbox
                        checked={selectedTags.includes(tag.name)}
                        onCheckedChange={(checked) => {
                            const e = typeof checked === 'boolean' ? checked : false;
                            handleChange(tag.name, e)
                        }}
                    />
                    <Label className="text-sm font-normal">{tag.name}</Label>
                </div>
            ))}
        </div>
    );
}

export function DialogAddSize({
                                  sizes,
                                  setSizes,
                              }: {
    sizes: AddSizeRequest[],
    setSizes: React.Dispatch<React.SetStateAction<AddSizeRequest[]>>
}) {
    const t = useTranslations();
    const [open, setOpen] = useState(false);
    const [size, setSize] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState(''); // State lưu thông báo lỗi

    const handleAddSize = () => {
        if (size.trim() === '') {
            setError(t("Manage.Please enter size"));
            return;
        }
        if (sizes.some(item => item.size === size.trim())) {
            setError(t("Manage.Size already exists"));
            return;
        }
        setSizes([...sizes, {size: size.trim(), description}]);
        setSize('');
        setDescription('');
        setError('');
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={(v) => {
            setOpen(v);
            setError('');
        }}>
            <DialogTrigger asChild>
                <Button variant="outline" className="col-span-7">
                    {/*{t("Manage.Add Size")}*/}
                    <XCircleIcon/>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{t("Manage.Add Size")}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <Input
                        placeholder={t("Placeholder.Enter size")}
                        value={size}
                        onChange={(e) => {
                            setSize(e.target.value);
                            setError('');
                        }}
                    />
                    <Input
                        placeholder={t("Placeholder.Enter description")}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    {error && (
                        <div className="text-destructive">{error}</div>
                    )}
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={handleAddSize}>
                        {t("Manage.Save changes")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export function DialogAddColor({
                                   colors,
                                   setColors,
                               }: {
    colors: AddColorRequest[],
    setColors: React.Dispatch<React.SetStateAction<AddColorRequest[]>>
}) {
    const t = useTranslations();
    const [open, setOpen] = useState(false);
    const [colorName, setColorName] = useState('');
    const [colorCode, setColorCode] = useState('');
    const [error, setError] = useState(''); // State lưu thông báo lỗi

    const handleAddColor = () => {
        if (colorName.trim() === '') {
            setError(t("Manage.Please enter color name"));
            return;
        }
        if (colors.some(item => item.colorName === colorName.trim())) {
            setError(t("Manage.Color name already exists"));
            return;
        }
        if (!isValidHexColor(colorCode)) {
            setError(t("Manage.Color code is invalid"));
            return;
        }
        setColors([...colors, {colorName: colorName.trim(), colorCode}]);
        setColorName('');
        setColorCode('');
        setError('');
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={(v) => {
            setOpen(v);
            setError('');
        }}>
            <DialogTrigger asChild>
                <Button variant="outline" className="col-span-7">
                    {/*{t("Manage.Add Color")}*/}
                    <XCircleIcon/>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{t("Manage.Add Color")}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <Input
                        placeholder={t("Placeholder.Enter color name")}
                        value={colorName}
                        onChange={(e) => {
                            setColorName(e.target.value);
                            setError('');
                        }}
                    />
                    <Input
                        placeholder={t("Placeholder.Enter color code")}
                        value={colorCode}
                        onChange={(e) => setColorCode(e.target.value)}
                    />
                    {error && (
                        <div className="text-destructive">{error}</div>
                    )}
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={handleAddColor}>
                        {t("Manage.Save changes")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export function ComboboxCategories({categories, categoryId, setCategoryId}: {
    categoryId: string,
    categories: Category[],
    setCategoryId: (id: string) => void
}) {
    const t = useTranslations()
    const [open, setOpen] = React.useState(false)
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="col-span-7 justify-between"
                >
                    {categoryId
                        ? categories.find((categories) => categories.id == categoryId)?.name
                        : t("Manage.Select category")}
                    <ChevronsUpDown className="opacity-50"/>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0 col-span-7">
                <Command>
                    <CommandInput placeholder={t("Manage.Search category")} className="h-9"/>
                    <CommandList>
                        <CommandEmpty>No framework found.</CommandEmpty>
                        <CommandGroup>
                            {categories.map((category) => (
                                <CommandItem
                                    key={category.id}
                                    value={category.id}
                                    onSelect={() => {
                                        setCategoryId(category.id);
                                        setOpen(false);
                                    }}
                                >
                                    {category.name}
                                    <Check
                                        className={`ml-auto ${categoryId == category.id ? "opacity-100" : "opacity-0"}`}/>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
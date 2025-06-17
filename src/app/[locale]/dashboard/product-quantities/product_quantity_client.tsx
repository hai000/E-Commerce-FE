"use client"

import {useEffect, useState} from "react"
import {RefreshCw, Save, Search} from "lucide-react"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import type {IProduct} from "@/lib/response/product"
import {ArrayWithPage, cn,} from "@/lib/utils"
import {useRouter, useSearchParams} from "next/navigation"
import {getProductDetailById} from "@/lib/api/product-detail";
import {toast} from "@/hooks/use-toast";
import {addProductImport} from "@/lib/api/product-import";
import {ProductImportAddRequest} from "@/lib/request/product-import";
import {useTranslations} from "next-intl";

// Update the getVariantKey function to handle products without colors or sizes
const getVariantKey = (productId: string, colorId?: string, sizeId?: string) => {
    if (!colorId && !sizeId) {
        return productId
    }
    if (!colorId) {
        return `${productId}||${sizeId}`
    }
    if (!sizeId) {
        return `${productId}|${colorId}|`
    }
    return `${productId}|${colorId}|${sizeId}`
}

// Update the parseVariantKey function to handle products without colors or sizes
const parseVariantKey = (key: string) => {
    const parts = key.split("|")
    if (parts.length === 1) {
        return {
            productId: parts[0],
            colorId: undefined,
            sizeId: undefined,
        }
    }
    return {
        productId: parts[0],
        colorId: parts[1] || undefined,
        sizeId: parts[2] || undefined,
    }
}

export default function ProductQuantityPageClient({
                                                      productsWithPage,
                                                  }: {
    productsWithPage: ArrayWithPage<IProduct>
}) {
    const t = useTranslations()
    const router = useRouter()
    const searchParams = useSearchParams()
    const [products, setProducts] = useState<IProduct[]>(productsWithPage.data)
    const [searchTerm, setSearchTerm] = useState("")
    const [quantities, setQuantities] = useState<Record<string, number>>({})
    const [pricingInit, setPricingInit] = useState<Record<string, {
        quantity: number;
        price: number;
    }>>({})
    const [selectedVariants, setSelectedVariants] = useState<Record<string, { colorId?: string; sizeId?: string }>>({})
    const [importData, setImportData] = useState<Record<string, {
        quantity: number;
        price: number;
    }>>({})
    const [refresh, setRefresh] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const minStock = 10
    // Pagination state
    const currentPage = productsWithPage.page || 1
    const totalPages = Math.ceil(productsWithPage.totalItem / productsWithPage.size)
    // Initialize selected variants with first option for each product
    useEffect(() => {
        const fetchData = async () => {
            const initialVariants: Record<string, { colorId?: string; sizeId?: string }> = {}
            const initialVariantsQuantity: Record<string, {
                quantity: number;
                price: number;
            }> = {}
            await Promise.all(productsWithPage.data.map(async (product) => {
                if (product.colors?.length || product.sizes?.length) {
                    initialVariants[product.id] = {
                        colorId: product.colors?.[0]?.id,
                        sizeId: product.sizes?.[0]?.id,
                    }

                    const productDetail = await getProductDetailById({productId: product.id})
                    if (typeof productDetail === "string") {
                        toast({
                            title: t("Toast.Error"),
                            description: productDetail,
                            variant: "destructive",
                        })
                        return
                    } else {
                        productDetail.forEach((detail) => {
                            const variantKey = getVariantKey(product.id, detail.color?.id, detail.size?.id)
                            initialVariantsQuantity[variantKey] = {
                                quantity: detail.quantity,
                                price: detail.price,
                            }
                        })
                    }
                } else {
                    initialVariantsQuantity[product.id] = {
                        quantity: product.quantity,
                        price: product.defaultPrice,
                    }
                }
            }))
            setQuantities({})
            setPricingInit({...initialVariantsQuantity});
            setImportData(initialVariantsQuantity);
            setSelectedVariants(initialVariants)
            setProducts(productsWithPage.data)
        }
        fetchData()
    }, [productsWithPage])
    // Filter products based on search term
    const filteredProducts = products.filter(
        (product) =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (product.category?.name || "").toLowerCase().includes(searchTerm.toLowerCase()),
    )

    // Handle page change
    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set("page", page.toString())
        router.push(`?${params.toString()}`)
    }
    // update quantity when change variant
    const getImportData = (productId: string): {
        quantity: number;
        price: number;
    } => {
        const variant = selectedVariants[productId]
        if (!variant) return importData[productId]

        const product = products.find((p) => p.id == productId)
        if (!product) return {quantity: 0, price: 0}

        const variantKey = getVariantKey(productId, variant.colorId, variant.sizeId)
        return importData[variantKey]
    }


    // Handle color change
    const handleColorChange = (productId: string, colorId: string) => {
        setSelectedVariants((prev) => ({
            ...prev,
            [productId]: {
                ...prev[productId],
                colorId,
            },
        }))
    }

    // Handle size change
    const handleSizeChange = (productId: string, sizeId: string) => {
        setSelectedVariants((prev) => ({
            ...prev,
            [productId]: {
                ...prev[productId],
                sizeId,
            },
        }))
    }


    // Update the handleQuantityChange function to handle products without variants
    const handleQuantityChange = (productId: string, value: string) => {
        const numValue = Number.parseInt(value) || 0
        const variant = selectedVariants[productId]
        const product = products.find((p) => p.id === productId) // Declare the product variable
        // If the product has no variants, use the product ID directly
        if (!variant || (!product?.colors?.length && !product?.sizes?.length)) {
            setQuantities({
                ...quantities,
                [productId]: numValue,
            })
            return
        }

        // Otherwise use the variant key
        const variantKey = getVariantKey(productId, variant.colorId, variant.sizeId)

        setQuantities({
            ...quantities,
            [variantKey]: numValue,
        })
    }

    const handlePriceChange = (productId: string, value: string) => {
        const numValue = Number.parseFloat(value) || 0
        const variant = selectedVariants[productId]
        const product = products.find((p) => p.id === productId) // Declare the product variable
        // If the product has no variants, use the product ID directly
        if (!variant || (!product?.colors?.length && !product?.sizes?.length)) {
            setImportData(prev => ({
                ...prev,
                [productId]: { ...prev[productId], price: numValue }
            }));
            return
        }
        // Otherwise use the variant key
        const variantKey = getVariantKey(productId, variant.colorId, variant.sizeId)
        setImportData(prev => ({
            ...prev,
            [variantKey]: { ...prev[variantKey], price: numValue }
        }));
        setRefresh(!refresh)
    }

    // Update the getCurrentQuantity function to handle products without variants
    const getCurrentQuantity = (product: IProduct): string => {
        // If the product has no variants, use the product ID directly
        if (!product.colors?.length && !product.sizes?.length) {
            return quantities[product.id]?.toString() || ""
        }

        const variant = selectedVariants[product.id]
        if (!variant) return ""

        const variantKey = getVariantKey(product.id, variant.colorId, variant.sizeId)

        return quantities[variantKey]?.toString() || ""
    }

    const getCurrentPrice = (product: IProduct): string => {
        // If the product has no variants, use the product ID directly
        if (!product.colors?.length && !product.sizes?.length) {
            return importData[product.id]?.price.toString() || ""
        }

        const variant = selectedVariants[product.id]
        if (!variant) return ''

        const variantKey = getVariantKey(product.id, variant.colorId, variant.sizeId)

        return importData[variantKey]?.price.toString() || ""
    }

    // Update the handleSaveChanges function to handle products without variants
    const handleSaveChanges = async () => {
        setIsSaving(true)
        try {
            // Update local state to reflect changes
            const updatedProducts = await Promise.all(products.map(async (product) => {
                let additionalQuantity = 0
                // Check for direct product quantity update (no variants)
                if (quantities[product.id]) {
                    const productImportAddRequest: ProductImportAddRequest = {
                        quantity: quantities[product.id],
                        productId: product.id,
                        sizeId: '-1',
                        colorId: '-1',
                        importedAt: new Date(),
                        userImported: '-1',
                        price: importData[product.id]?.price || 0.1
                    }
                    const resProductImport = await addProductImport(productImportAddRequest)
                    if (typeof resProductImport !== "string") {
                        setImportData(prev => ({
                            ...prev,
                            [product.id]: { ...prev[product.id],
                                price: importData[product.id]?.price || 0.1, quantity: (quantities[product.id] || 0) + (importData[product.id]?.quantity || 0)}
                        }));
                        setPricingInit(prev=> ({
                            ...prev,
                            [product.id]: { ...prev[product.id], quantity: (quantities[product.id] || 0) + (importData[product.id]?.quantity || 0)}
                        }))
                        additionalQuantity += quantities[product.id]
                    } else {
                        toast(
                            {
                                title: t("Toast.Error"),
                                description: resProductImport,
                                variant: "destructive",
                            },
                        )
                    }
                }
                // Calculate additional quantity from all variants of this product
                for (const [variantKey, quantity] of Object.entries(quantities)) {
                    if (variantKey == product.id) continue; // Skip direct product updates (already handled)
                    const {productId, colorId, sizeId} = parseVariantKey(variantKey)
                    if (productId == product.id && quantity > 0) {
                        const productImportAddRequest: ProductImportAddRequest = {
                            quantity: quantity,
                            productId: productId,
                            sizeId: sizeId ?? '-1',
                            colorId: colorId ?? '-1',
                            importedAt: new Date(),
                            userImported: '-1',
                            price: importData[variantKey]?.price || 0.1
                        }
                        const resProductImport = await addProductImport(productImportAddRequest)
                        if (typeof resProductImport !== "string") {
                            additionalQuantity += quantity
                            setPricingInit(prev => ({
                                ...prev,
                                [variantKey]: {
                                    ...prev[variantKey],
                                    price: importData[variantKey]?.price || 0.1,
                                    quantity: (importData[variantKey]?.quantity || 0) + quantity,
                                }
                            }));

                            setImportData(prev => ({
                                ...prev,
                                [variantKey]: {
                                    ...prev[variantKey],
                                    quantity: (importData[variantKey]?.quantity || 0) + quantity,
                                }
                            }));

                        } else {
                            toast(
                                {
                                    title: t("Toast.Error"),
                                    description: resProductImport,
                                    variant: "destructive",
                                },
                            )
                        }
                    }
                }
                if (additionalQuantity > 0) {
                    return {
                        ...product,
                        quantity: product.quantity + additionalQuantity,
                    }
                }
                return product
            }))
            setProducts(updatedProducts)
            setQuantities({})
            // Show success message or notification here
        } catch (error) {
            console.error("Error updating quantities:", error)
            // Show error message or notification here
        } finally {
            setIsSaving(false)
        }
    }

    // Reset all quantities
    const handleReset = () => {
        console.log(pricingInit)
        setQuantities({})
        setImportData(pricingInit)
    }

    // Find color name by ID
    const getColorName = (product: IProduct, colorId: string): string => {
        return product.colors?.find((c) => c.id === colorId)?.colorName || ""
    }

    // Find size name by ID
    const getSizeName = (product: IProduct, sizeId: string): string => {
        return product.sizes?.find((s) => s.id === sizeId)?.size || ""
    }

    // Generate pagination items
    const renderPaginationItems = () => {
        const items = []

        // Maximum number of page links to show
        const maxPageLinks = 5
        let startPage = 1
        let endPage = totalPages

        if (totalPages > maxPageLinks) {
            // Calculate start and end page
            const halfWay = Math.ceil(maxPageLinks / 2)

            if (currentPage > halfWay) {
                startPage = Math.max(currentPage - halfWay + 1, 1)
                endPage = Math.min(startPage + maxPageLinks - 1, totalPages)
            } else {
                endPage = Math.min(maxPageLinks, totalPages)
            }

            // Adjust if we're near the end
            if (endPage - startPage + 1 < maxPageLinks && startPage > 1) {
                startPage = Math.max(endPage - maxPageLinks + 1, 1)
            }
        }

        // Add page links
        for (let i = startPage; i <= endPage; i++) {
            items.push(
                <PaginationItem key={i}>
                    <PaginationLink onClick={() => handlePageChange(i)} isActive={currentPage === i}>
                        {i}
                    </PaginationLink>
                </PaginationItem>,
            )
        }

        // Add ellipsis if needed
        if (startPage > 1) {
            items.unshift(
                <PaginationItem key="start-ellipsis">
                    <PaginationEllipsis/>
                </PaginationItem>,
            )
        }

        if (endPage < totalPages) {
            items.push(
                <PaginationItem key="end-ellipsis">
                    <PaginationEllipsis/>
                </PaginationItem>,
            )
        }

        return items
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">{t('Update Product Quantities')}</CardTitle>
                    <CardDescription>{t('Add or update quantities for imported products by color and size')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                        <div className="relative w-full md:w-80">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"/>
                            <Input
                                type="search"
                                placeholder={t("Placeholder.Search products")}
                                className="pl-8 w-full"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2 w-full md:w-auto">
                            <Button variant="outline" onClick={handleReset} className="flex items-center gap-1">
                                <RefreshCw className="h-4 w-4"/>
                                {t('Reset')}
                            </Button>
                            <Button
                                onClick={handleSaveChanges}
                                disabled={isSaving || Object.keys(quantities).length === 0}
                                className="flex items-center gap-1"
                            >
                                <Save className="h-4 w-4"/>
                                    {isSaving ? t("Saving") : t("Save Changes")}
                            </Button>
                        </div>
                    </div>

                    <div className="rounded-md border overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>{t('Product name')}</TableHead>
                                    <TableHead className="hidden md:table-cell">{t('Product.Category')}</TableHead>
                                    <TableHead className="text-right">{t('Total Stock')}</TableHead>
                                    <TableHead>{t('Product.Color')}</TableHead>
                                    <TableHead>{t('Product.Size')}</TableHead>
                                    <TableHead className="text-center">{t('Variant Stock')}</TableHead>
                                    <TableHead className="text-center">{t('Price')}</TableHead>
                                    <TableHead className="text-center">{t('Add Quantity')}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredProducts.length > 0 ? (
                                    filteredProducts.map((product) => (
                                        <TableRow key={product.id}>
                                            <TableCell className="font-medium">{product.name}</TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                {product.category?.name || "Uncategorized"}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <span
                                                    className={cn(product.quantity < minStock ? "text-destructive" : "", "font-medium")}>{product.quantity}</span>
                                            </TableCell>
                                            <TableCell>
                                                {product.colors && product.colors.length > 0 ? (
                                                    <Select
                                                        value={selectedVariants[product.id]?.colorId || product.colors[0].id}
                                                        onValueChange={(value) => handleColorChange(product.id, value)}
                                                    >
                                                        <SelectTrigger className="w-[120px]">
                                                            <SelectValue>
                                                                {getColorName(product, selectedVariants[product.id]?.colorId || product.colors[0].id)}
                                                            </SelectValue>
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {product.colors.map((color) => (
                                                                <SelectItem key={color.id} value={color.id}>
                                                                    <div className="flex items-center gap-2">
                                                                        <div
                                                                            className="w-3 h-3 rounded-full"
                                                                            style={{backgroundColor: color.colorCode}}
                                                                        ></div>
                                                                        {color.colorName}
                                                                    </div>
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                ) : (
                                                    <span className="text-muted-foreground">N/A</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {product.sizes && product.sizes.length > 0 ? (
                                                    <Select
                                                        value={selectedVariants[product.id]?.sizeId || product.sizes[0].id}
                                                        onValueChange={(value) => handleSizeChange(product.id, value)}
                                                    >
                                                        <SelectTrigger className="w-[100px]">
                                                            <SelectValue>
                                                                {getSizeName(product, selectedVariants[product.id]?.sizeId || product.sizes[0].id)}
                                                            </SelectValue>
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {product.sizes.map((size) => (
                                                                <SelectItem key={size.id} value={size.id}>
                                                                    {size.size}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                ) : (
                                                    <span className="text-muted-foreground">N/A</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <span className="">{getImportData(product.id)?.quantity || 0}</span>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex justify-center">
                                                    <Input
                                                        type="number"
                                                        min="0"
                                                        className="w-28 text-center"
                                                        value={getCurrentPrice(product)}
                                                        onChange={(e) => handlePriceChange(product.id, e.target.value)}
                                                    />
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex justify-center">
                                                    <Input
                                                        type="number"
                                                        min="0"
                                                        className="w-20 text-center"
                                                        value={getCurrentQuantity(product)}
                                                        onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                                                    />
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-24 text-center">
                                            {t('No products found')}
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {totalPages > 1 && (
                        <div className="mt-4">
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious
                                            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                                            aria-disabled={currentPage === 1}
                                            className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                                        />
                                    </PaginationItem>

                                    {renderPaginationItems()}

                                    <PaginationItem>
                                        <PaginationNext
                                            onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                                            aria-disabled={currentPage === totalPages}
                                            className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </div>
                    )}

                    <div className="mt-4 text-sm text-muted-foreground">
                        <p className="mt-1">
                            {t('Showing')} {productsWithPage.data.length} {t('of')} {productsWithPage.totalItem} {t('products')}
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

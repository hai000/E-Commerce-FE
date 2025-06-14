export interface ProductImportAddRequest {
    userImported: string;
    productId: string;
    colorId: string
    sizeId: string;
    quantity: number;
    price: number;
    importedAt:Date;
}
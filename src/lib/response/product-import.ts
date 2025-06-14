import {IProductColor, IProductSize} from "@/lib/response/product";

export interface ProductImport{
    id: string;
    userImported: {
        userId: string;
        fullName: string;
        role: string;
    };
    productId: string;
    productName: string;
    color?: IProductColor;
    productSize?: IProductSize;
    quantityImport: number;
    priceImport: number;
    importedAt: Date;
}
import {IProductColor, IProductDetail, IProductSize} from "@/lib/response/product";
import {create} from "zustand/index";
import {persist} from "zustand/middleware";
import {getProductDetailById} from "@/lib/api/product-detail";

export interface EditProduct {
    colorSelected?: IProductColor,
    sizeSelected?: IProductSize,
    curProduct?: IProductDetail,
    productDetails: IProductDetail[],
    productDetailsEdit: IProductDetail[],
    sizes: IProductSize[],
    colors: IProductColor[]
}
const initialState: EditProduct = {
        productDetails: [] as IProductDetail[],
        productDetailsEdit: [] as IProductDetail[],
        sizes: [] as IProductSize[],
        colors: [] as IProductColor[]
}
interface EditProductState {
    editProduct: EditProduct;
    init: (productId: string) => Promise<void>,
    reload: () => Promise<void>,
    setColorSelected: (color:IProductColor) => void,
    setSizeSelected: (size: IProductSize) => void,
    setProductDetails: (productDetails: IProductDetail[]) => void,
    removeProductDetail: (productDetailId:string) => void,
    addProductDetail: (productDetail: IProductDetail) => void,
    updateCurrentProduct: ({discount,price,quantity}: {
        discount: number,
        price: number,
        quantity: number
    }) => void,
}

export const useEditProduct = create(
    persist<EditProductState>(
        (set, get) => ({
            editProduct: initialState,
            init: async (productId) => {
                    const response = await getProductDetailById({
                        productId:productId,
                    });
                    if (typeof response !== "string") {
                        get().setProductDetails(response);
                    }
            },
            reload: () => Promise.resolve(),
            setColorSelected: (color) => {
                const productFilterColor = get().editProduct.productDetailsEdit.filter(p => p.color.id == color.id)
                const sizesFilter = productFilterColor.map(p => p.size)
                const sizeSelectedFilter = sizesFilter[0]
                const curProductFilter = productFilterColor.filter(p => p.size.id == sizeSelectedFilter.id)[0]
                set((state) => ({
                    editProduct: {
                        ...state.editProduct,
                        colorSelected: color,
                        sizes: sizesFilter,
                        sizeSelected: sizeSelectedFilter,
                        curProduct: curProductFilter,
                    },
                }));
            },
            setSizeSelected: (size) => {
                const curProductFilter =  get().editProduct.productDetailsEdit.filter(p => p.size.id == size.id && p.color.id ==  get().editProduct.colorSelected?.id)[0]
                set((state) => ({
                    editProduct: {
                        ...state.editProduct,
                        sizeSelected: size,
                        curProduct: curProductFilter,
                    },
                }));
            },
            setProductDetails: (response: IProductDetail[]) => {
                set((state) => {
                    const productDetails = response;
                    const colors = response.length > 0 ? response.map(p => p.color) : [];
                    const colorSelected = colors.length > 0 ? colors[0] : state.editProduct.colorSelected;
                    const sizes = response.length > 0 && colorSelected
                        ? response.filter(p => p.color.id === colorSelected.id).map(p => p.size)
                        : state.editProduct.sizes; // Giữ lại giá trị cũ nếu mảng rỗng hoặc không có colorIdSelected
                    const sizeSelected = sizes.length > 0 ? sizes[0] : state.editProduct.sizeSelected; // Giữ lại giá trị cũ nếu mảng rỗng
                    const curProductFilter = productDetails.filter(p => p.size.id == sizeSelected?.id && p.color.id == colorSelected?.id)[0]
                    return {
                        editProduct: {
                            ...state.editProduct,
                            productDetailsEdit: productDetails,
                            productDetails: productDetails,
                            colors: colors,
                            colorSelected: colorSelected,
                            sizes: sizes,
                            sizeSelected: sizeSelected,
                            curProduct: curProductFilter,
                        },
                    };
                });
            },
            removeProductDetail: (productDetailId) => {
                set((state) => ({
                    editProduct: {
                        ...state.editProduct,
                        productDetailsEdit: state.editProduct.productDetailsEdit.filter(p => p.id !== productDetailId),
                    },
                }));
            },
            updateCurrentProduct: ({ discount, price, quantity }) => {
                const editProduct = get().editProduct.curProduct
                if (editProduct) {
                    editProduct.discount = discount;
                    editProduct.price = price;
                    editProduct.quantity = quantity;
                    set((state) => ({
                        editProduct: {
                            ...state.editProduct,
                            curProduct: editProduct,
                            productDetailsEdit: [...state.editProduct.productDetailsEdit],
                        },
                    }));
                }
            },
            addProductDetail: (productDetail: IProductDetail) => {
                set((state) => ({
                    editProduct: {
                        ...state.editProduct,
                        productDetailsEdit: [...state.editProduct.productDetailsEdit, productDetail],
                    },
                }));
            },
        }),
        {
            name: 'edit-product-store', // Tên lưu trữ cho giỏ hàng
        }
    )
)
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {ICart, IOrderItem} from "@/lib/response/order";
import { calcDeliveryDateAndPrice } from "@/lib/api/order";

// Khởi tạo trạng thái ban đầu của giỏ hàng
const initialState: ICart = {
    items: [], // Danh sách sản phẩm
    itemsPrice: 0, // Tổng giá sản phẩm
    taxPrice: undefined, // Giá thuế
    shippingPrice: undefined, // Giá vận chuyển
    totalPrice: 0, // Tổng giá (bao gồm thuế và vận chuyển)
    paymentMethod: undefined, // Phương thức thanh toán
    deliveryDateIndex: undefined, // Chỉ số ngày giao hàng
}

// Định nghĩa kiểu trạng thái giỏ hàng
interface CartState {
    cart: ICart,
    // reload: () => Promise<IOrderItem[]>,
    addItem: (item: IOrderItem, quantity: number) => Promise<string> // Hàm thêm sản phẩm vào giỏ hàng
    updateItem: (item: IOrderItem, quantity: number) => Promise<void>
    removeItem: (item: IOrderItem) => void
}

// Tạo store giỏ hàng với Zustand và middleware persist
const useCartStore = create(
    persist<CartState>(
        (set, get) => ({
            cart: initialState, // Khởi tạo giỏ hàng
            // Hàm thêm sản phẩm vào giỏ hàng
            addItem: async (item: IOrderItem, quantity: number) => {
                const { items } = get().cart // Lấy danh sách sản phẩm hiện tại
                const existItem = items.find( // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
                    (x) =>
                        x.id === item.id &&
                        x.color === item.color &&
                        x.size === item.size
                )

                // Kiểm tra số lượng sản phẩm trong kho
                if (existItem) {
                    if (existItem.countInStock < quantity + existItem.quantity) {
                        throw new Error('Không đủ hàng trong kho') // Thông báo nếu không đủ hàng
                    }
                } else {
                    if (item.countInStock < item.quantity) {
                        throw new Error('Không đủ hàng trong kho') // Thông báo nếu không đủ hàng
                    }
                }

                // Cập nhật danh sách sản phẩm trong giỏ hàng
                const updatedCartItems = existItem
                    ? items.map((x) =>
                        x.id === item.id &&
                        x.color === item.color &&
                        x.size === item.size
                            ? { ...existItem, quantity: existItem.quantity + quantity } // Cập nhật số lượng nếu đã có
                            : x
                    )
                    : [...items, { ...item, quantity }] // Thêm sản phẩm mới nếu chưa có

                // Cập nhật trạng thái giỏ hàng và tính toán giá
                set({
                    cart: {
                        ...get().cart,
                        items: updatedCartItems,
                        ...(await calcDeliveryDateAndPrice({
                            items: updatedCartItems,
                        })),
                    },
                })
                // Trả về clientId của sản phẩm vừa thêm vào
                return updatedCartItems.find(
                    (x) =>
                        x.id == item.id &&
                        x.color == item.color &&
                        x.size == item.size
                )?.id!
            },
            updateItem: async (item: IOrderItem, quantity: number) => {
                const { items } = get().cart
                const exist = items.find(
                    (x) =>
                        x.id === item.id &&
                        x.color === item.color &&
                        x.size === item.size
                )
                if (!exist) return
                const updatedCartItems = items.map((x) =>
                    x.id === item.id &&
                    x.color === item.color &&
                    x.size === item.size
                        ? { ...exist, quantity: quantity }
                        : x
                )
                set({
                    cart: {
                        ...get().cart,
                        items: updatedCartItems,
                        ...(await calcDeliveryDateAndPrice({
                            items: updatedCartItems,
                        })),
                    },
                })
            },
            removeItem: async (item: IOrderItem) => {
                const { items } = get().cart
                const updatedCartItems = items.filter(
                    (x) =>
                        x.id !== item.id ||
                        x.color !== item.color ||
                        x.size !== item.size
                )
                set({
                    cart: {
                        ...get().cart,
                        items: updatedCartItems,
                        ...(await calcDeliveryDateAndPrice({
                            items: updatedCartItems,
                        })),
                    },
                })
            },
            // reload: () => Promise.resolve(null),
            // Hàm khởi tạo lại giỏ hàng
            init: () => set({ cart: initialState }),
        }),
        {
            name: 'cart-store', // Tên lưu trữ cho giỏ hàng
        }
    )
)
export default useCartStore
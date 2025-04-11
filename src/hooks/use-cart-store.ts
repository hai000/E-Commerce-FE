import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Cart, OrderItem } from "@/lib/model/order";
import { calcDeliveryDateAndPrice } from "@/lib/api/order";

// Khởi tạo trạng thái ban đầu của giỏ hàng
const initialState: Cart = {
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
    cart: Cart
    addItem: (item: OrderItem, quantity: number) => Promise<string> // Hàm thêm sản phẩm vào giỏ hàng
}

// Tạo store giỏ hàng với Zustand và middleware persist
const useCartStore = create(
    persist<CartState>(
        (set, get) => ({
            cart: initialState, // Khởi tạo giỏ hàng
            // Hàm thêm sản phẩm vào giỏ hàng
            addItem: async (item: OrderItem, quantity: number) => {
                const { items } = get().cart // Lấy danh sách sản phẩm hiện tại
                const existItem = items.find( // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
                    (x) =>
                        x.product === item.product &&
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
                        x.product === item.product &&
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
                        x.product == item.product &&
                        x.color == item.color &&
                        x.size == item.size
                )?.clientId!
            },
            // Hàm khởi tạo lại giỏ hàng
            init: () => set({ cart: initialState }),
        }),
        {
            name: 'cart-store', // Tên lưu trữ cho giỏ hàng
        }
    )
)
export default useCartStore
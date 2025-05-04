import {create} from 'zustand'
import {persist} from 'zustand/middleware'
import {calcDeliveryDateAndPrice} from "@/lib/api/order";
import {Cart, CartItem} from "@/lib/response/cart";
import {ShippingAddress} from "@/lib/request/location";
const initCartChecked = [] as CartChecked[]

const initialState: Cart = {
    id: '',
    userId: '',
    createdAt: null,
    updatedAt: null,
    cartItems: [],
    itemsPrice: 0,
    paymentMethod: undefined,
    shippingAddress: undefined,
    deliveryDateIndex: 0,
    shippingPrice: 0,
    totalPrice: 0,
}
interface CartChecked{
    idCartItem: string,
    isChecked: boolean,
}
interface CartState {
    cart: Cart,
    cartChecked: CartChecked[],
    checkCartItems: (isChecked: boolean, cartItemId: string) => void,
    reloadCart: () => Promise<void>,
    init: () => Promise<void>,
    addItem: (item: CartItem, quantity: number) => Promise<string>
    updateItem: (item: CartItem, quantity: number) => Promise<void>
    removeItem: (item: CartItem) => void,
    setShippingAddress: (shippingAddress: ShippingAddress,priceShip:number) => Promise<void>
    setPaymentMethod: (paymentMethod: string) => void
    setDeliveryDateIndex: (index: number, price: number) => Promise<void>
}

// Tạo store giỏ hàng với Zustand và middleware persist
const useCartStore = create(
    persist<CartState>(
        (set, get) => ({
            cart: initialState,
            cartChecked: initCartChecked,
            addItem: async (item: CartItem, quantity: number) => {
                const res = await addItem(item, quantity);
                if (typeof res === "string") {
                    throw new Error(res)
                } else {
                    await get().reloadCart()
                    return res.id
                }
            },
            checkCartItems: (isChecked, cartItemId) => {
                const existingCartChecked = get().cartChecked.find(cartItem => cartItem.idCartItem === cartItemId);

                if (existingCartChecked) {
                    // Cập nhật trạng thái isChecked
                    set(state => ({
                        cartChecked: state.cartChecked.map(cartChecked =>
                            cartChecked.idCartItem == cartItemId
                                ? { ...cartChecked, isChecked } // Cập nhật giá trị isChecked
                                : cartChecked
                        ),
                    }));
                } else {
                    set(state => ({
                        cartChecked: [
                            ...state.cartChecked,
                            { idCartItem: cartItemId, isChecked },
                        ],
                    }));
                }
                get().reloadCart()
            },
            updateItem: async (item: CartItem, quantity: number) => {
                const res = await updateItem(item,quantity)
                if (typeof res === "string") {
                    throw new Error(
                        res
                    )
                } else {
                    get().reloadCart()
                }
            },
            removeItem: async (item: CartItem) => {
                const res = await deleteItem(item)
                if (res) {
                    get().reloadCart()
                } else {
                    throw new Error(
                        `Delete item failed`
                    )
                }
            },
            reloadCart: async () => {
                const myCart = await getMyCart()
                if (typeof myCart === "string") {
                    set({
                        cart: initialState,
                    })
                    throw new Error(
                        `Can't update cart \n ${myCart}`
                    )
                } else {
                    get().init()
                    const cartItems = myCart.cartItems
                    const cartChecked = get().cartChecked
                    cartItems.forEach((cartItem) => {
                        for (let i = 0; i < cartChecked.length; i++) {
                            if (cartChecked[i].idCartItem == cartItem.id) {
                                cartItem.isChecked = cartChecked[i].isChecked
                                break;
                            }
                        }
                    })
                    const all_prices = myCart.cartItems.reduce((prePrice, item) => item.isChecked? prePrice + item.cartItemQuantity*item.price: 0, 0)
                    set({
                        cart: {
                            ...get().cart,
                            itemsPrice: all_prices,
                            cartItems: myCart.cartItems,
                        },
                    })
                }
            },
            init: async () => {
                set({
                    cart: initialState,
                })
            },
            setShippingAddress: async (shippingAddress: ShippingAddress, priceShip: number) => {
                const { cartItems } = get().cart
                set({
                    cart: {
                        ...get().cart,
                        shippingAddress: shippingAddress,
                        ...(await calcDeliveryDateAndPrice({
                            items: cartItems,
                            shippingPrice: priceShip,
                            deliveryDateIndex: 0,
                        })),

                    },
                })
            },
            setPaymentMethod: (paymentMethod: string) => {
                set({
                    cart: {
                        ...get().cart,
                        paymentMethod,
                    },
                })
            },
            setDeliveryDateIndex: async (index: number, priceShip: number) => {
                const { cartItems } = get().cart
                set({
                    cart: {
                        ...get().cart,
                        ...(await calcDeliveryDateAndPrice({
                            items: cartItems,
                            deliveryDateIndex: index,
                            shippingPrice: priceShip
                        })),

                    },
                })
            },
            clearCart: () => {
                set({
                    cart: {
                        ...get().cart,
                        cartItems: [],
                    },
                })
            },
        }),

        {
            name: 'cart-store', // Tên lưu trữ cho giỏ hàng
        }
    )
)
async function getMyCart() {
    const request = {
        action: 'getCart',
    }
    const response = await fetch('/api/auth/cart', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
    });
    const json = await response.json();
    if (typeof json === "string") {
        return json
    } else {
        return json as Cart
    }
}

async function deleteItem(item: CartItem) {
    const request = {
        action: 'deleteItem',
        cartItemId: item.id
    }
    const response = await fetch('/api/auth/cart', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
    });
    const json = await response.json();
    return json as boolean
}
async function updateItem(item: CartItem,quantity: number) {
    const request = {
        action: 'updateItem',
        cartItemId: item.id,
        quantity: quantity
    }
    const response = await fetch('/api/auth/cart', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
    });
    const json = await response.json();
    return json as CartItem | string;
}
async function addItem(item: CartItem, quantity: number) {
    const request = {
        productId: item.productId,
        quantity: `${quantity}`,
        productSize: item.size.id,
        productColor: item.color.id,
        action: 'addItem',
    }
    const response = await fetch('/api/auth/cart', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
    });
    const json = await response.json();
    if (typeof json === "string") {
        return json
    } else {
        return json as CartItem
    }
}

export default useCartStore
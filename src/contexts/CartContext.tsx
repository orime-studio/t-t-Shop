import React, { createContext, useContext, useState, useEffect, Dispatch, SetStateAction, FC } from 'react';
import { ICartWithTotals, ICartItem, IImage, CartContextProps } from '../@Types/productType';
import { useAuth } from '../hooks/useAuth';
import { addProductToCart, getCart, removeProductFromCart, updateProductQuantity, clearCartFromDb } from '../services/cart-service';
import { ContextProviderProps } from '../@Types/types';

export const CartContext = createContext<CartContextProps | undefined>(undefined);

export const CartProvider: FC<ContextProviderProps> = ({ children }) => {
    const { token } = useAuth();
    const [cart, setCart] = useState<ICartWithTotals | null>(null);
    const [isGuest, setIsGuest] = useState<boolean>(false);

    const fetchCart = async () => {
        if (!token) {
            setIsGuest(true);
            const guestCart = localStorage.getItem('guestCart');
            if (guestCart) {
                setCart(JSON.parse(guestCart));
            } else {
                setCart(null);
            }
            return;
        }
        try {
            const response = await getCart();
            setCart(response.data);
            setIsGuest(false);
        } catch (error) {
            console.error('Error fetching cart', error);
        }
    };

    useEffect(() => {
        fetchCart();
    }, [token]);

    const addToCart = async (productId: string, variantId: string, productTitle: string = '', quantity: number, size: string, price: number, image: IImage = { url: '' }, color: string = '') => {
        try {
            console.log('Sending request to add to cart:', { productId, productTitle, variantId, quantity, size, price, image, color });

            if (isGuest) {
                const guestCart = localStorage.getItem('guestCart');
                let cart: ICartWithTotals = guestCart ? JSON.parse(guestCart) : { items: [], totalQuantity: 0, totalPrice: 0 };
                const itemIndex = cart.items.findIndex(item => item.productId === productId && item.variantId === variantId && item.size === size && item.color === color);

                if (itemIndex > -1) {
                    cart.items[itemIndex].quantity += quantity;
                } else {
                    cart.items.push({ productId, variantId, quantity, size, title: productTitle, price, mainImage: image, color });
                }

                cart.totalQuantity += quantity;
                cart.totalPrice += price * quantity;

                localStorage.setItem('guestCart', JSON.stringify(cart));
                setCart(cart);
            } else {
                await addProductToCart(productId, variantId, productTitle, quantity, size, price, image, color);
                fetchCart();
            }
        } catch (error) {
            console.error('Error adding to cart', error);
        }
    };

    const mergeGuestCartToUserCart = async () => {
        const guestCart = localStorage.getItem('guestCart');
        if (guestCart && token) {
            const cartItems: ICartItem[] = JSON.parse(guestCart).items;
            for (const item of cartItems) {
                try {
                    await addToCart(item.productId, item.variantId, item.title, item.quantity, item.size, item.price, item.mainImage, item.color);
                } catch (error) {
                    console.error('Error merging item to user cart', error);
                }
            }
            localStorage.removeItem('guestCart');
            fetchCart();
        }
    };

    useEffect(() => {
        if (token) {
            mergeGuestCartToUserCart();
            console.log('Merged guest cart to user cart');
        }
    }, [token]);

    const removeFromCart = async (variantId: string) => {
        try {
            if (isGuest) {
                const guestCart = localStorage.getItem('guestCart');
                if (guestCart) {
                    let cart: ICartWithTotals = JSON.parse(guestCart);
                    const itemIndex = cart.items.findIndex(item => item.variantId === variantId);

                    if (itemIndex > -1) {
                        const itemQuantity = cart.items[itemIndex].quantity;
                        const itemPrice = cart.items[itemIndex].price;

                        cart.totalQuantity -= itemQuantity;
                        cart.totalPrice -= itemPrice * itemQuantity;

                        cart.items.splice(itemIndex, 1);

                        localStorage.setItem('guestCart', JSON.stringify(cart));
                        setCart(cart);
                    }
                }
            } else {
                await removeProductFromCart(variantId);
                fetchCart();
            }
        } catch (error) {
            console.error('Error removing from cart', error);
        }
    };

    const updateItemQuantity = async (variantId: string, newQuantity: number) => {
        try {
            if (isGuest) {
                const guestCart = localStorage.getItem('guestCart');
                if (guestCart) {
                    let cart: ICartWithTotals = JSON.parse(guestCart);
                    const itemIndex = cart.items.findIndex(item => item.variantId === variantId);

                    if (itemIndex > -1) {
                        const item = cart.items[itemIndex];
                        const quantityDifference = newQuantity - item.quantity;

                        item.quantity = newQuantity;

                        cart.totalQuantity += quantityDifference;
                        cart.totalPrice += item.price * quantityDifference;

                        localStorage.setItem('guestCart', JSON.stringify(cart));
                        setCart(cart);
                    }
                }
            } else {
                await updateProductQuantity(variantId, newQuantity);
                fetchCart();
            }
        } catch (error) {
            console.error('Error updating item quantity in cart', error);
        }
    };

    const clearCart = () => {
        if (isGuest) {
            localStorage.removeItem('guestCart');
            setCart(null);
        } else {
            clearCartFromDb();
            fetchCart();
        }
    };

    return (
        <CartContext.Provider value={{
            cart,
            setCart,
            fetchCart,
            addToCart,
            mergeGuestCartToUserCart,
            removeFromCart,
            clearCart,
            updateItemQuantity,
            isGuest
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export default useCart;
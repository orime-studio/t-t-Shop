import { createContext, FC, useEffect, useState, Dispatch, SetStateAction } from 'react';
import { CartContextProps, ICartItem, ICartWithTotals, IImage } from '../@Types/productType';
import { ContextProviderProps } from '../@Types/types';
import { useAuth } from '../hooks/useAuth';
import { addProductToCart, clearCartFromDb, getCart, removeProductFromCart, updateProductQuantity } from '../services/cart-service';

export const CartContext = createContext<CartContextProps | undefined>(undefined);

export const CartProvider: FC<ContextProviderProps> = ({ children }) => {
    const { token } = useAuth(); // שולף את הטוקן מההוק
    const [cart, setCart] = useState<ICartWithTotals | null>(null);
    const [isGuest, setIsGuest] = useState<boolean>(false); // הוספת state למצב אורח

    const fetchCart = async () => {
        if (!token) {
            // במידה ואין טוקן, משתמש אורח - נשלוף עגלה מהלוקל סטורג'
            setIsGuest(true);  // הגדרת מצב אורח
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
            setIsGuest(false);  // לא משתמש אורח, משתמש מחובר
        } catch (error) {
            console.error('Error fetching cart', error);
        }
    };

    useEffect(() => {
        fetchCart();
    }, [token]);

    // פונקציה להוסיף מוצר לעגלה
    const addToCart = async (productId: string, variantId: string, productTitle: string = '', quantity: number, size: string, price: number, image: IImage = { url: '' }, color: string = '') => {
        try {
            console.log('Sending request to add to cart:', { productId, productTitle, variantId, quantity, size, price, image, color });

            if (isGuest) {
                // הוספה לעגלה בלוקל סטורג' עבור משתמש אורח
                const guestCart = localStorage.getItem('guestCart');
                let cart: ICartWithTotals = guestCart ? JSON.parse(guestCart) : { items: [], totalQuantity: 0, totalPrice: 0 };
                const itemIndex = cart.items.findIndex(item => item.productId === productId && item.variantId === variantId && item.size === size && item.color === color);

                if (itemIndex > -1) {
                    cart.items[itemIndex].quantity += quantity;
                } else {
                    cart.items.push({ productId, variantId, quantity, size, title: productTitle, price, mainImage: image, color });
                }

                // עדכון סה"כ כמות ומחיר
                cart.totalQuantity += quantity;
                cart.totalPrice += price * quantity;

                localStorage.setItem('guestCart', JSON.stringify(cart));
                setCart(cart);
            } else {
                // הוספה לעגלה בשרת עבור משתמש מחובר
                await addProductToCart(productId, variantId, productTitle, quantity, size, price, image, color);
                fetchCart();
            }
        } catch (error) {
            console.error('Error adding to cart', error);
        }
    };

    // פונקציה למיזוג עגלת אורח לעגלה של משתמש מחובר
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

    // פונקציה להסרת מוצר מהעגלה
    const removeFromCart = async (variantId: string) => {
        try {
            if (isGuest) {
                // הסרת מוצר מהעגלה בלוקל סטורג' עבור משתמש אורח
                const guestCart = localStorage.getItem('guestCart');
                if (guestCart) {
                    let cart: ICartWithTotals = JSON.parse(guestCart);
                    const itemIndex = cart.items.findIndex(item => item.variantId === variantId);

                    if (itemIndex > -1) {
                        const itemQuantity = cart.items[itemIndex].quantity;
                        const itemPrice = cart.items[itemIndex].price;

                        // עדכון סה"כ כמות ומחיר
                        cart.totalQuantity -= itemQuantity;
                        cart.totalPrice -= itemPrice * itemQuantity;

                        // הסרת הפריט מהעגלה
                        cart.items.splice(itemIndex, 1);

                        // עדכון המידע ב-localStorage
                        localStorage.setItem('guestCart', JSON.stringify(cart));
                        setCart(cart);
                    }
                }
            } else {
                // הסרת מוצר מהעגלה בשרת עבור משתמש מחובר
                await removeProductFromCart(variantId);
                fetchCart();
            }
        } catch (error) {
            console.error('Error removing from cart', error);
        }
    };

    // פונקציה לעדכון כמות של מוצר בעגלה
    const updateItemQuantity = async (variantId: string, newQuantity: number) => {
        try {
            if (isGuest) {
                // עדכון כמות בלוקל סטורג' עבור משתמש אורח
                const guestCart = localStorage.getItem('guestCart');
                if (guestCart) {
                    let cart: ICartWithTotals = JSON.parse(guestCart);
                    const itemIndex = cart.items.findIndex(item => item.variantId === variantId);

                    if (itemIndex > -1) {
                        const item = cart.items[itemIndex];
                        const quantityDifference = newQuantity - item.quantity;

                        // עדכון הכמות החדשה
                        item.quantity = newQuantity;

                        // עדכון סה"כ כמות ומחיר
                        cart.totalQuantity += quantityDifference;
                        cart.totalPrice += item.price * quantityDifference;

                        // שמירה של העגלה המעודכנת ב-localStorage
                        localStorage.setItem('guestCart', JSON.stringify(cart));
                        setCart(cart);
                    }
                }
            } else {
                // עדכון כמות בשרת עבור משתמש מחובר
                await updateProductQuantity(variantId, newQuantity);
                fetchCart(); // רענון העגלה לאחר העדכון
            }
        } catch (error) {
            console.error('Error updating item quantity in cart', error);
        }
    };

    // פונקציה לנקות את כל העגלה עבור משתמש אורח
    const clearCart = () => {
        if (isGuest) {
            // נקות את כל העגלה בלוקל סטורג' עבור משתמש אורח
            localStorage.removeItem('guestCart');
            setCart(null);
        } else {
            // נקות את כל העגלה בשרת עבור משתמש מחובר
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
            isGuest // מוסיף את state של משתמש אורח
        }}>
            {children}
        </CartContext.Provider>
    );
};
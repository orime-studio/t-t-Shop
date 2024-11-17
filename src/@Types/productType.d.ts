export type IImage = {
    url?: string;
};

export type IVariant = {
    _id?: string;
    size: string;
    quantity: number;
    price: number;
};

//types for product
export type IProductInput = {
    title: string;
    subtitle: string;
    description: string;
    image: IImage;
    alt: string;
    sizes: string[];
    barcode: number;
    variants: IVariant[];
};

//types for product with more properties
export type IProduct = IProductInput & {
    _id: string;
    createdAt: Date;
    shoppingCart: string[];
    sold: number;
    userId: string;
};

export interface AddToCartButtonProps {
    productId: string;
    variants: IVariant[];
    title: string;
    image: IImage;
}

export interface ICartItem {
    productId: string;
    variantId: string;
    title: string;
    price: number;
    size: string;
    quantity: number;
    image: IImage;
}


export interface ICart {
    userId?: string; // הפיכת userId לאופציונלי כדי לתמוך במשתמשי אורח
    items: ICartItem[];
    isGuest?: boolean; // הוספת שדה חדש לזיהוי האם מדובר במשתמש אורח
}

import { Dispatch, SetStateAction } from 'react';
import { ICartWithTotals, ICartItem, IImage } from '../@Types/productType';

export interface CartContextProps {
    cart: ICartWithTotals | null;
    setCart: Dispatch<SetStateAction<ICartWithTotals | null>>;
    fetchCart: () => void;
    addToCart: (productId: string, variantId: string, title: string, quantity: number, size: string, price: number, image?: IImage) => Promise<void>;
    mergeGuestCartToUserCart: () => void; // פונקציה למיזוג עגלת אורח
    removeFromCart: (variantId: string) => void; // פונקציה להסרת מוצר מהעגלה, מתבססת רק על variantId
    clearCart: () => void; // פונקציה לניקוי כל העגלה
    updateItemQuantity: (variantId: string, newQuantity: number) => void; // פונקציה לעדכון כמות של מוצר בעגלה, מתבססת רק על variantId ו-newQuantity
    isGuest: boolean;
}


// טיפוס עבור עגלת קניות עם סיכומים
export interface ICartWithTotals extends ICart {
    totalQuantity: number;
    totalPrice: number;
} 




export type IOrderProduct = {
    productId: string;
    quantity: number;
    size: string;
    title: string;
    price: number;
};

export type IOrder = {
    _id: string;
    orderId: string;
    userId: string;
    products: IOrderProduct[];
    totalAmount: number;
    status: string;
    createdAt: string; // Assuming it's a string, convert it if necessary
    orderNumber: string;

};

export type OrderResponse = {
    count: number;
    orders: IOrder[];
};


export interface DateRangePickerProps {
    startDate: Date | null;
    endDate: Date | null;
    onStartDateChange: (date: Date | null) => void;
    onEndDateChange: (date: Date | null) => void;
}

// Types עבור Parasha

export type IParashaComponent = {
    type: 'banner' | 'image' | 'title' | 'text';
    content: string;
    image?: IImage;
    alt?: string;
};

export type IParashaInput = {
    title: string;
    components: IParashaComponent[];
};

export type IParasha = IParashaInput & {
    _id: string;
    createdAt: Date;
};

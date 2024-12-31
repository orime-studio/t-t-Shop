import axios from 'axios';
import { ICartItem, IImage } from '../@Types/productType';

const baseUrl = "https://node-tandt-shop.onrender.com/api/v1";

const cartUrl = `${baseUrl}/cart`;

export const getCart = () => {
    return axios.get(cartUrl, {
        headers: {
            "x-auth-token": localStorage.getItem("token"),
        }
    });
};

export const addProductToCart = (productId: string, variantId: string, title: string, quantity: number, size: string, price: number, image: IImage, color: string) => {
    return axios.post(`${cartUrl}/add`, {
        productId,
        variantId,
        title,
        quantity,
        size,
        price,
        image,
        color,
    }, {
        headers: {
            "x-auth-token": localStorage.getItem("token"),
        }
    });
};

// Update product quantityconst 
export const updateProductQuantity = async (variantId: string, quantity: number) => {
    console.log('שולח ל-API:', { variantId, quantity });
    return axios.patch(`${cartUrl}/update`, {
        variantId,
        quantity
    }, {
        headers: {
            "x-auth-token": localStorage.getItem("token"),
        }
    });
};

export const removeProductFromCart = (variantId: string) => {
    return axios.post(`${cartUrl}/remove`, {
        variantId
    }, {
        headers: {
            "x-auth-token": localStorage.getItem("token"),
        }
    });
};

export const clearCartFromDb = (/* token: string */) => {
    return axios.delete(`${cartUrl}/clear`, {
        headers: {
            "x-auth-token": localStorage.getItem("token"),
        }
    });
};

/* export const bulkAddToCart = (items: ICartItem[]) => {
    return axios.post(`${cartUrl}/bulk-add`, { items }, {
        headers: {
            "x-auth-token": localStorage.getItem("token"),
        }
    });
}; */


export const cartService = {
    getCart,
    addProductToCart,
    updateProductQuantity,
    removeProductFromCart,
    clearCartFromDb,
/*     bulkAddToCart
 */};

export default cartService;
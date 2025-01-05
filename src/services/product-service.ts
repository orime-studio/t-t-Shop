import axios from "axios";

export const baseUrl = "https://node-tandt-shop.onrender.com/api/v1/products";

// get all products
/* export const getAllProducts = () => axios.get(baseUrl);
 */

// product-service.ts
export const getAllProducts = (filters?: {
    minPrice?: number;
    maxPrice?: number;
    sizes?: string[];
    searchTerm?: string;
    category?: string; // <-- נוסיף כאן

}) => {
    const queryParams = new URLSearchParams();

    if (filters?.minPrice !== undefined)
        queryParams.append("minPrice", String(filters.minPrice));
    if (filters?.maxPrice !== undefined)
        queryParams.append("maxPrice", String(filters.maxPrice));
    if (filters?.sizes && filters.sizes.length > 0)
        queryParams.append("size", filters.sizes.join(','));
    if (filters?.searchTerm)
        queryParams.append("searchTerm", filters.searchTerm);
    if (filters?.category) {
        queryParams.append("category", filters.category);
      }

    const url = `${baseUrl}?${queryParams.toString()}`;
    return axios.get(url);
};
  


//get product by id
export const getProductById = (id: string) => axios.get(`${baseUrl}/${id}`);

//create new product

export const createNewProduct = async (data: FormData) => {
    const url = `${baseUrl}/`;
    try {
        const response = await axios.post(url, data, {
            headers: {
                "x-auth-token": localStorage.getItem("token"),
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error creating product:", error.response || error.message);
        throw error;
    }
};

//delete product
export const deleteProductById = (id: string) => {
    const url = `${baseUrl}/${id}`;
    return axios.delete(url, {
        headers: {
            "x-auth-token": localStorage.getItem("token"),
        },
    });
};

//update product
export const updateProduct = (id: string, data: FormData) => {
    const url = `${baseUrl}/${id}`;
    return axios.put(url, data, {
        headers: {
            "x-auth-token": localStorage.getItem("token"),
            "Content-Type": "multipart/form-data",
        },
    });
};

export const product = {
    getAllProducts,
    getProductById,
    createNewProduct,
    deleteProductById,
    updateProduct,
};

export default product;
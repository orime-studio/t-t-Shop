import axios from "axios";
import { IParashaInput } from "../@Types/productType";

export const parashaBaseUrl = "https://node-tandt-shop.onrender.com/api/v1/parasha";

// קבלת כל ה-Parashot


export const getAllParashot = async () => {
  try {
    const response = await axios.get(parashaBaseUrl);  // ללא פרמטר last
    console.log(response.data);  // כל הפרשות
  } catch (error) {
    console.error("Error fetching all parashot:", error);
  }
};


// קבלת Parasha לפי מזהה
export const getParashaById = (id: string) => axios.get(`${parashaBaseUrl}/${id}`);

// יצירת Parasha חדשה
export const createNewParasha = (data: FormData) => {
    return axios.post(parashaBaseUrl, data, {
        headers: {
            "x-auth-token": localStorage.getItem("token"),
          
        },
    });
};

// עדכון Parasha
export const updateParasha = (id: string, data: IParashaInput) => {
    return axios.put(`${parashaBaseUrl}/${id}`, data, {
        headers: {
            "x-auth-token": localStorage.getItem("token"),
            "Content-Type": "application/json",
        },
    });
};

// מחיקת Parasha לפי מזהה
export const deleteParashaById = (id: string) => {
    return axios.delete(`${parashaBaseUrl}/${id}`, {
        headers: {
            "x-auth-token": localStorage.getItem("token"),
        },
    });
};


// בקשה לקבלת הפרשה האחרונה
export const getLatestParasha = () => {
    return axios.get(`${parashaBaseUrl}?sort=-createdAt&limit=1`);
};

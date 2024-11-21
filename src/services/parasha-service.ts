import axios from "axios";
import { IParashaInput } from "../@Types/productType";

// כתובת הבסיס לאסוף את כל הנתונים
const parashaBaseUrl = "/api/parashot";

// פונקציה לקבלת כל הפרשות
export const getAllParashot = async () => {
    try {
        const response = await axios.get(parashaBaseUrl);
        return response.data;  // מחזיר את הנתונים (כל הפרשות)
    } catch (error) {
        console.error("Error fetching all parashot:", error);
        throw error;  // שגיאה במקרה של כשלון
    }
};

// פונקציה לקבלת הפרשה לפי מזהה
export const getParashaById = (id: string) => axios.get(`${parashaBaseUrl}/${id}`);

// פונקציה לקבלת הפרשה האחרונה
export const getLastParasha = async () => {
    try {
        const response = await axios.get(parashaBaseUrl, {
            params: { last: "true" },  // שליחה של פרמטר last כדי לקבל את הפרשה האחרונה
        });
        return response.data;  // מחזיר את הנתונים של הפרשה האחרונה
    } catch (error) {
        console.error("Error fetching last parasha:", error);
        throw error;  // שגיאה במקרה של כשלון
    }
};

// יצירת פרשה חדשה
export const createNewParasha = (data: FormData) => {
    return axios.post(parashaBaseUrl, data, {
        headers: {
            "x-auth-token": localStorage.getItem("token"),
        },
    });
};

// עדכון פרשה
export const updateParasha = (id: string, data: IParashaInput) => {
    return axios.put(`${parashaBaseUrl}/${id}`, data, {
        headers: {
            "x-auth-token": localStorage.getItem("token"),
            "Content-Type": "application/json",
        },
    });
};

// מחיקת פרשה לפי מזהה
export const deleteParashaById = (id: string) => {
    return axios.delete(`${parashaBaseUrl}/${id}`, {
        headers: {
            "x-auth-token": localStorage.getItem("token"),
        },
    });
};

// בקשה לקבלת הפרשה האחרונה (עם מיון)
/* export const getLatestParasha = () => {
    return axios.get(`${parashaBaseUrl}?sort=-createdAt&limit=1`);
}; */

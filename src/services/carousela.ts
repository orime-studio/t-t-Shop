// services/client-carousel-service.ts

import axios from "axios";

const carouselBaseUrl = "https://node-tandt-shop.onrender.com/api/v1/carousela";

// קבלת כל התמונות של הקרוסלה
export const getCarouselImages = async () => {
  try {
    const response = await axios.get(carouselBaseUrl);
    return response.data;
  } catch (error) {
    console.error("Error fetching carousel images:", error);
    throw error;
  }
};

// הוספת תמונה חדשה לקרוסלה
export const addCarouselImage = async (data: FormData) => {
  try {
    const response = await axios.post(carouselBaseUrl, data, {
      headers: {
        "x-auth-token": localStorage.getItem("token"),
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding carousel image:", error);
    throw error;
  }
};

// עדכון תמונה בקרוסלה
export const updateCarouselImage = async (id: string, data: FormData) => {
  try {
    const response = await axios.put(`${carouselBaseUrl}/${id}`, data, {
      headers: {
        "x-auth-token": localStorage.getItem("token"),
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating carousel image:", error);
    throw error;
  }
};

// מחיקת תמונה מהקרוסלה
export const deleteCarouselImage = async (id: string) => {
  try {
    const response = await axios.delete(`${carouselBaseUrl}/${id}`, {
      headers: {
        "x-auth-token": localStorage.getItem("token"),
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting carousel image:", error);
    throw error;
  }
};

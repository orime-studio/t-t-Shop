// services/client-article-service.ts

import axios from "axios";

// Base URL for the article API
const articleBaseUrl = "https://node-tandt-shop.onrender.com/api/v1/article";

// Function to get all articles or the latest article
export const getAllArticles = async () => {
  try {
    const response = await axios.get(articleBaseUrl);
    return response.data;
  } catch (error) {
    console.error("Error fetching all articles:", error);
    throw error;
  }
};

export const getLatestArticles = async () => {
  try {
    const response = await axios.get(articleBaseUrl, {
      params: { last: "true" },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching the latest article:", error);
    throw error;
  }
};

// Get an article by ID
export const getArticleById = (id: string) => axios.get(`${articleBaseUrl}/${id}`);

// Create a new article
export const createNewArticle = (data: FormData) => {
  return axios.post(articleBaseUrl, data, {
    headers: {
      "x-auth-token": localStorage.getItem("token"),
    },
  });
};

// Update an article
export const updateArticle = (id: string, data: FormData) => {
  return axios.put(`${articleBaseUrl}/${id}`, data, {
    headers: {
      "x-auth-token": localStorage.getItem("token"),
      "Content-Type": "multipart/form-data",
    },
  });
};

// Delete an article by ID
export const deleteArticleById = (id: string) => {
  return axios.delete(`${articleBaseUrl}/${id}`, {
    headers: {
      "x-auth-token": localStorage.getItem("token"),
    },
  });
};

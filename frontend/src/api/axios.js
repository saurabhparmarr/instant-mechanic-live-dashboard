import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const message =
        error.response.data?.message ||
        "Something went wrong on the server.";

      error.userMessage = message;
    } else if (error.request) {
      error.userMessage =
        "Unable to connect to the server. Please check your connection.";
    } else {
      error.userMessage = error.message || "Something went wrong.";
    }

    return Promise.reject(error);
  }
);

export default api;
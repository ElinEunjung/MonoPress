import axios from "axios";
import { GLOBAL_BASE_URI } from "../constants/global-base-uri";

const api = axios.create({
  baseURL: GLOBAL_BASE_URI.BACKEND,
  withCredentials: true,
});

// Add a response interceptor
api.interceptors.response.use(
  (response) => {
    // If the response is successful, just return it
    return response;
  },
  (error) => {
    // Check if the error is a 401 Unauthorized response
    if (error.response && error.response.status === 401) {
      console.log("Interceptor: Session outdated or unauthorized.");
      // You could dispatch a Redux action or update a global state here
    }
    return Promise.reject(error);
  },
);
export { api };

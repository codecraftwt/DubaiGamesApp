import axios from 'axios';
import store from '../Redux/store/store';
import { logout } from '../Redux/Slices/authSlice';

export const API_BASE_URL = 'https://staging.rdnidhi.com/api';

// Create a singleton axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
});

// Add a response interceptor
api.interceptors.response.use(
    response => response,
    error => {
        console.log("vvvvvvvvvvvvvvvvvvvvvv", error)
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            // Dispatch logout action
            store.dispatch(logout());
        }
        return Promise.reject(error);
    }
);

export default api;


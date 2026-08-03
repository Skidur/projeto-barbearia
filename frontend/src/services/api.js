import axios from 'axios';

const STORAGE_KEY = 'barberflow:auth';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        const { token } = JSON.parse(stored);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

export default api;

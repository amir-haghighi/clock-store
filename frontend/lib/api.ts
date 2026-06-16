// lib/api.ts
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const api = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api/v1`,
    withCredentials: true,
});
let isRefreshing = false;
let failedQueue: Array<{
    resolve: (value?: unknown) => void;
    reject: (reason?: unknown) => void;
}> = [];
const processQueue = (error: AxiosError | null) => {
    failedQueue.forEach((p) => error ? p.reject(error) : p.resolve());
    failedQueue = [];
};
api.interceptors.response.use(
    (res) => {
        console.log("reeeeeeeeeeeeeees", res);
        return res
    },
    async (error: AxiosError) => {
        console.log("erorr", error)
        const original = error.config as InternalAxiosRequestConfig & {
            _retry?: boolean;
        };
        console.log({ original })

        if (error.response?.status !== 401 || original._retry) {
            return Promise.reject(error);
        }

        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            }).then(() => api(original));
        }

        original._retry = true;
        isRefreshing = true;

        try {
            await api.post('/auth/refresh-token');
            processQueue(null);
            return api(original);
        } catch (refreshError) {
            processQueue(refreshError as AxiosError);
            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    }
);
export default api;
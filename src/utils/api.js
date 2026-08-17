import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    timeout: 10000,
});

export const setupResponseInterceptor = (navigate, showToast) =>{
    api.interceptors.response.use(
        (response)=> response,
        (error) => {
            if(error.response && (error.response?.status === 401 || error.response?.status === 403)){
                if(localStorage.getItem('token')){
                    localStorage.removeItem("token");
                    localStorage.removeItem('user');
                    showToast("error", "Session Expired. Please login again.");
                    navigate("/login");
                }  
            }
            return Promise.reject(error);
        }   
    )
};
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error)
    }
);



export default api;
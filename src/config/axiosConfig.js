import axios from 'axios';
import config from './config';

const axiosInstance = axios.create({
  baseURL: config.apiUrl,
});

axiosInstance.interceptors.request.use((axiosConfig) => {
  const token = localStorage.getItem(config.tokenKey);
  if (token) {
    axiosConfig.headers.Authorization = `Bearer ${token}`;
  }
  return axiosConfig;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem(config.tokenKey);
      localStorage.removeItem(config.userKey);
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

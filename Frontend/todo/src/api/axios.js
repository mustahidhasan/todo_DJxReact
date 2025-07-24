// src/api/axios.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api/', // Change to your actual backend URL
  withCredentials: true, // Optional, if using cookies
});

export default axiosInstance;

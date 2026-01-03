import axios from 'axios';

// This checks if a production URL exists; otherwise, it uses localhost for you
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export default api;

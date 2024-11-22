import axios from 'axios';

axios.defaults.withCredentials = true;

export const axiosInstance = axios.create({
  baseURL: 'http://localhost:5003/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

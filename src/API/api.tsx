import axios from 'axios';

const baseURL = 'http://localhost:8889/car/';  
const bookingURL = 'http://localhost:8889/booking/';
const payURL = 'http://localhost:8889/payment/'
const token = localStorage.getItem('token');  

const api = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,  // ใช้ Token ในการยืนยันตัวตน
  },
});

const apibooking = axios.create({
    baseURL: bookingURL,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,  // ใช้ Token ในการยืนยันตัวตน
    },
  });
  const apipay = axios.create({
    baseURL: payURL,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,  // ใช้ Token ในการยืนยันตัวตน
    },
  });

export const getMarket = () => api.get('/markets')
export const getlock = () => api.get('/lock')
export const getidlock = (lock) => api.get(`/loocks/${lock}/`)
export const postbooking = (booking) => apibooking.post('/bookings', booking)
export const getuser = () => api.get('/user')
export const postpay = (payment) => apipay.post('/payments', payment)
export const getpayuser = () => apipay.get('/paymentuser')


export default api;
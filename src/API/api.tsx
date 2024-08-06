import axios from 'axios';

const baseURL = 'http://localhost:8889/car/';  
const bookingURL = 'http://localhost:8889/booking/';
const payURL = 'http://localhost:8889/payment/';
const token = localStorage.getItem('token');

const api = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`, 
  },
});

const apibooking = axios.create({
    baseURL: bookingURL,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,  
    },
  });
  const apipay = axios.create({
    baseURL: payURL,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`, 
    },
  });

export const getMarket = () => api.get('/markets')
export const getlock = () => api.get('/lock')
export const getidlock = (lock) => api.get(`/loocks/${lock}/`)
export const postbooking = (booking) => apibooking.post('/bookings', booking)
export const getuser = () => api.get('/user')
export const postpay = (payment) => apipay.post('/payments', payment)
export const getpayuser = () => apipay.get('/paymentuser')
export const getpayment = () => apipay.get('/payments')
export const postparking = (parking) => api.post('/parking', parking)
export const postlock = (lock) => api.post('/lockpost', lock)
export const deletelock = (id) => api.delete(`/lockdelete/${id}`)
export const deleteParking = (id) => api.delete(`/parking/${id}`);
export const shbookingall = () => apibooking.get('/shbookin')
export const putuptime = (data) => apipay.put(`/payment/${data.booking_id}/status`, data);
export const deleterPayment = (id) => apipay.delete(`/paymentusdeleter/${id}`)
export const updatePaymentStatus = (id, status) => apipay.patch(`/payment/${id}/status`, { id, status });


export default api;
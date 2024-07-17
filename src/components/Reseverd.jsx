import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { postbooking, getidlock, getuser } from '../API/api';
import loginImage from '../assets/logologin.png';

const Reserved = () => {
  const { id } = useParams();
  const [user, setUser] = useState([]);
  const [lock, setLock] = useState([]);
  const navigate = useNavigate();
  const [booking, setBooking] = useState({
    booking_date: '',
    total_amount: '',
    discount: 0,
    vehicle_number: '',
    brand: '',
    user_id: '',
    lockId: ''
  });

  useEffect(() => {
    const fetchLock = async () => {
      try {
        const rsd = await getidlock(id);
        const lockData = rsd.data[0];
        setLock(lockData);
        const rs = await getuser();
        setUser(rs.data);
        setBooking(prevBooking => ({
          ...prevBooking,
          total_amount: lockData.lock_price,
          lockId: lockData.id
        }));
      } catch (err) {
        console.error(err);
      }
    };
    fetchLock();
  }, [id]);

  const hdlChange = (e) => {
    const { name, value } = e.target;
    setBooking(prevBooking => ({
      ...prevBooking,
      [name]: value
    }));
  };

  const postBookings = async (e) => {
    e.preventDefault();
    try {
      // Update booking object to only include the date part in English format (YYYY-MM-DD)
      const dateOnly = booking.booking_date.substring(0, 10);
  
      // Create postData with only the date part
      const postData = {
        ...booking,
        booking_date: dateOnly
      };
  
      const rs = await postbooking(postData);
      console.log(rs.data);
      navigate(`/userpay/${rs.data.booking.id}`);
    } catch (err) {
      console.error('Error posting booking:', err);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const getMinDate = () => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    const yyyy = today.getFullYear();
    return yyyy + '-' + mm + '-' + dd;
  };

  const getMaxDate = () => {
    const today = new Date();
    const nextWeek = new Date(today.setDate(today.getDate() + 7));
    const dd = String(nextWeek.getDate()).padStart(2, '0');
    const mm = String(nextWeek.getMonth() + 1).padStart(2, '0'); // January is 0!
    const yyyy = nextWeek.getFullYear();
    return yyyy + '-' + mm + '-' + dd;
  };

  return (
    <div className="container mx-auto p-8 flex justify-center items-center">
      <div className="w-1/2">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h1 className="text-2xl mb-4 font-semibold text-gray-900">เลขพื้นที่จอง</h1>
          {lock && (
            <form onSubmit={postBookings} className="space-y-4">
              <div>
                <label className="block text-gray-900">ยี่ห้อ:</label>
                <input
                  type="text"
                  name="brand"
                  value={booking.brand}
                  onChange={hdlChange}
                  required
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-gray-900">ทะเบียนรถ:</label>
                <input
                  type="text"
                  name="vehicle_number"
                  value={booking.vehicle_number}
                  onChange={hdlChange}
                  required
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-gray-900">ราคา:</label>
                <input
                  type="number"
                  name="total_amount"
                  value={booking.total_amount}
                  readOnly
                  className="w-full px-3 py-2 border rounded-lg bg-gray-100 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-gray-900">วันเวลา:</label>
                <input
                  type="date"
                  name="booking_date"
                  value={booking.booking_date}
                  onChange={hdlChange}
                  min={getMinDate()}
                  max={getMaxDate()}
                  required
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <p>{formatDate(booking.booking_date)}</p> {/* Displaying the date in YYYY-MM-DD format */}
              <input
                type="hidden"
                name="user_id"
                value={booking.user_id = user.id}
              />
              <input
                type="hidden"
                name="lockId"
                value={booking.lockId}
                readOnly
              />
              <input
                type="hidden"
                name="discount"
                value={booking.discount}
              />
              <div className="flex justify-end">
                <button 
                  type="submit" 
                  className="w-full px-3 py-2 border rounded-lg bg-blue-500 text-white"
                >
                  ตกลง
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
      <div className="w-1/2 flex justify-center">
        <img src={loginImage} className="login-image" alt="Login" />
      </div>
    </div>
  );
};

export default Reserved;

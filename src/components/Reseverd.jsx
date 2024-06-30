import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { postbooking, getidlock, getuser } from '../API/api';

const Reseverd = () => {
  const { id } = useParams();
  const [ user, setUser] = useState([])
  const [lock, setLock] = useState([]);
  const navigate = useNavigate();
  const [booking, setBooking] = useState({
    booking_date: '',
    total_amount: '',
    discount: 0,
    Vehiclenumber: '',
    brand: '',
    user_id: '',
    lockId: ''
  });

  useEffect(() => {
    const fetchLock = async () => {
      try {
        const rsd = await getidlock(id);
        console.log(rsd.data.id)
        // if (rsd.data.length > 0) {
          const lockData = rsd.data[0];
          setLock(lockData);
          // setBooking(prevBooking => ({
          //   ...prevBooking,
          //   total_amount: lockData.lock_price,
          //   lockId: lockData.id
          // }));
          console.log(lockData.id);
        // }
        const rs = await getuser()
        setUser(rs.data)
        console.log(rs.data.id)
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
      const rs = await postbooking(booking);
      console.log('Booking successful:', rs.data.booking.id);
      console.log('Booking successful:', rs.data.id);
      navigate(`/userpay/${rs.data.booking.id}`);
    } catch (err) {
      console.error('Error posting booking:', err);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <div className="bg-gray-300 shadow-md rounded-lg p-6">
        {/* <h1 className="text-3xl mb-4 font-semibold text-gray-700">Reserved Page</h1> */}
        {lock && (
          <form onSubmit={postBookings} className="space-y-4">
            <div>
              <label className="block text-gray-900">Booking Date:</label>
              <input
                type="date"
                name="booking_date"
                value={booking.booking_date}
                onChange={hdlChange}
                required
                className="w-full px-3 py-2 border rounded-lg bg-gray-500 cursor-not-allowed"
              />
            </div>
            <div>
              <p className="text-gray-700">Lock Price: {lock.lock_price}</p>
              <label className="block text-gray-700">Total Amount:</label>
              <input
                type="number"
                name="total_amount"
                value={booking.total_amount = lock.lock_price}
                onChange={hdlChange}
                readOnly
                className="w-full px-3 py-2 border rounded-lg bg-blue-50 cursor-not-allowed"
              />
            </div>
            {/* <div>
              <label className="block text-gray-700">Discount:</label>
              <input
                type="number"
                name="discount"
                value={booking.discount}
                onChange={hdlChange}
                required
                className="w-full px-3 py-2 border rounded-lg bg-blue-50 cursor-not-allowed"
              />
            </div> */}
            <div>
              <label className="block text-gray-700">Vehicle Number:</label>
              <input
                type="text"
                name="Vehiclenumber"
                value={booking.Vehiclenumber}
                onChange={hdlChange}
                required
                className="w-full px-3 py-2 border rounded-lg bg-blue-50 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-gray-700">Brand:</label>
              <input
                type="text"
                name="brand"
                value={booking.brand}
                onChange={hdlChange}
                required
                className="w-full px-3 py-2 border rounded-lg bg-blue-50 cursor-not-allowed"
              />
            </div>
            <input
              type="hidden"
              name="user_id"
              value={booking.user_id = user.id}
            />
            <input
              type="hidden"
              name="lockId"
              value={booking.lockId = lock.id}
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
                className="w-full px-3 py-2 border rounded-lg bg-blue-50 cursor-not-allowed"
              >
                Submit Booking
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Reseverd;
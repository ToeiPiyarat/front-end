import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { getlock, shbookingall } from '../API/api';

function Userzone() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [locks, setLocks] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); // Default to today's date
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const bookingResponse = await shbookingall();
        console.log('Booking Response:', bookingResponse.data);
        setBookings(Array.isArray(bookingResponse.data) ? bookingResponse.data : []);
        
        const lockResponse = await getlock();
        console.log('Lock Response:', lockResponse.data);
        const filteredLocks = lockResponse.data.filter(lock => lock.parking_id === parseInt(id));
        filteredLocks.sort((a, b) => a.lock_name.localeCompare(b.lock_name));
        setLocks(filteredLocks);
      } catch (err) {
        setError('Failed to fetch data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const checkAvailability = useCallback((lockId) => {
    const booking = bookings.find(booking => booking.lockId === lockId );
    const date = bookings.find(booking => {
      const formattedDate = new Date(booking.booking_date).toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' }).split('/').reverse().join('-');
      console.log("Formatted Date:", formattedDate, "Selected Date:", selectedDate);
      return formattedDate === selectedDate;
    });
    bookings.map(b=> {
      console.log(b.booking_date, selectedDate, date , booking)
    })
      // console.log("ddffffff",booking.id, "df", booking.booking_date, selectedDate)
      if (booking) {
        if(date){
          console.log("e")
          return 'ไม่ว่าง';
        }else{
          return 'ว่าง';
        }
      } else {
        console.log("m")
        return 'ว่าง';
      }

    
  }, [bookings, selectedDate]);

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  return (
    <div className="container mx-auto p-8">
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
          <div className="mb-4">
            <label htmlFor="booking-date" className="block mb-2">เลือกวันที่:</label>
            <input 
              type="date" 
              id="booking-date" 
              value={selectedDate} 
              min={new Date().toISOString().split('T')[0]}  // ให้ min เป็นวันที่ปัจจุบัน
              max={new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}  // ให้ max เป็น 7 วันจากวันที่ปัจจุบัน
              onChange={handleDateChange} 
              className="border p-2 rounded-md" 
            />

          </div>
          <div>
            {/* {bookings.map(bookin => (
            <div key={bookin.id}>
              <p>{new Date(bookin.booking_date).toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' }).split('/').reverse().join('-')}</p>
            </div>
            ))} */}
          </div>

          {locks.length === 0 ? (
            <p>No locks available for this parking lot.</p>
          ) : (
            <div className="grid grid-cols-5 gap-4">
              {locks.map((lock) => {
                const availability = checkAvailability(lock.id);
                return (
                  <div key={lock.id} className={`p-4 rounded-md ${availability === 'ไม่ว่าง' ? 'bg-red-200' : 'bg-green-200'}`} onClick={availability === 'ว่าง' ? () => navigate(`/booking/${lock.id}`) : null}>
                    <p><strong>ที่จองที่:</strong> {lock.lock_name}</p>
                    <p><strong>ราคา:</strong> {lock.lock_price}</p>
                    <p><strong>ชื่อสถานที่:</strong> {lock.parking.parking_name}</p>
                    <p><strong>ที่อยู่:</strong> {lock.parking.parking_location}</p>
                    <p><strong>เมือง:</strong> {lock.parking.city}</p>
                    <p><strong>จังหวัด:</strong> {lock.parking.province}</p>
                    <img src={lock.parking.photo} alt={lock.parking.parking_name} className="mt-2 rounded-md" style={{ maxWidth: '100%' }} />
                    <p className="mt-2"><strong>สถานะ:</strong> {availability}</p>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Userzone;

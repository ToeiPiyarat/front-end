import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { postpay } from '../API/api';
import Swal from 'sweetalert2';

function Userpay() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [payment, setPayment] = useState({
    booking_id: id,
    amount: 50,
    date: new Date().toISOString().slice(0, 16), // Set initial date to current datetime
    payment_method: '',
    status: 'ชำระแล้ว'
  });

  const hdlChange = (e) => {
    const { name, value } = e.target;
    setPayment((prevPayment) => ({
      ...prevPayment,
      [name]: value
    }));
  };

  const submitPayment = async (e) => {
    e.preventDefault();
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, submit it!'
    });

    if (result.isConfirmed) {
      try {
        const formData = new FormData();
        Object.keys(payment).forEach((key) => {
          formData.append(key, payment[key]);
        });

        const rs = await postpay(payment);
        console.log(rs.data);
        
        Swal.fire({
          title: 'Submitted!',
          text: 'Your payment has been submitted.',
          icon: 'success'
        });
        
        navigate('/');
      } catch (err) {
        console.error(err);
        Swal.fire({
          title: 'Error!',
          text: 'There was an error submitting your payment.',
          icon: 'error'
        });
      }
    }
  };

  return (
    <div className="container mx-auto p-8">
      <div className="bg-gray-400 shadow-md rounded-lg p-6">
        <h1 className="text-3xl mb-4 font-semibold text-gray-700">Payment Page</h1>
        <form onSubmit={submitPayment} className="space-y-4">
          <img src="../car_park02.jpg" alt="" width={400} />
          {/* <div>
            <label className="block text-gray-700">Booking ID:</label>
            <input
              type="number"
              name="booking_id"
              value={payment.booking_id}
              readOnly
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div> */}
          <input
              type="hidden"
              name="booking_id"
              value={payment.booking_id}
            />
          <div>
            <label className="block text-gray-700">Amount:</label>
            <input
              type="number"
              name="amount"
              value={payment.amount}
              onChange={hdlChange}
              readOnly
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700">Date:</label>
            <input
              type="datetime-local" // Use datetime-local to include time
              name="date"
              value={payment.date}
              onChange={hdlChange}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700">Payment Method:</label>
            <input
              type="file"
              name="payment_method"
              value={payment.payment_method}
              onChange={hdlChange}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            {/* <label className="block text-gray-700">Status:</label> */}
            <input
              type="hidden"
              name="status"
              value={payment.status}
              readOnly
              className="w-full px-3 py-2 border rounded-lg bg-gray-200 cursor-not-allowed"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Submit Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Userpay;

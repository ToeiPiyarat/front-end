import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { postpay } from '../API/api';
import Swal from 'sweetalert2';
import qrCodeImage from '../assets/pay.jpg';
import { format } from 'date-fns-tz';

function Userpay() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [payment, setPayment] = useState({
    booking_id: id,
    amount: 50,
    date: format(new Date(), "yyyy-MM-dd'T'HH:mm", { timeZone: 'Asia/Bangkok' }),
    payment_method: '',
    status: 'ชำระแล้ว'
  });

  const hdlChange = (e) => {
    const { name, value } = e.target;
    if (name === 'date') {
      const isoDate = format(new Date(value), "yyyy-MM-dd'T'HH:mm", { timeZone: 'Asia/Bangkok' });
      setPayment((prevPayment) => ({
        ...prevPayment,
        [name]: isoDate
      }));
    } else {
      setPayment((prevPayment) => ({
        ...prevPayment,
        [name]: value
      }));
    }
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
        const thaiTimeZone = 'Asia/Bangkok';
        const utcDate = new Date(payment.date);
        const thaiDate = utcToZonedTime(utcDate, thaiTimeZone);
        const isoDate = format(thaiDate, "yyyy-MM-dd'T'HH:mm", { timeZone: thaiTimeZone });

        const formData = new FormData();
        Object.keys(payment).forEach((key) => {
          formData.append(key, key === 'date' ? isoDate : payment[key]);
        });

        const rs = await postpay(formData);
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
    <div className="container mx-auto p-8 flex justify-end items-start">
      <div className="w-1/2">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h1 className="text-3xl mb-4 font-semibold text-gray-700">ชำระเงิน</h1>
          <div className="bg-white shadow-md rounded-lg p-6 text-center">
            <p className="text-gray-700 mb-2">จำนวน 50.00 บาท</p>
            <p className="text-gray-700 mb-4">กรุณาชำระเพื่อใช้บริการ</p>
            <img src={qrCodeImage} alt="QR Code" className="w-64 h-64 mx-auto" />
          </div>
          <form onSubmit={submitPayment} className="space-y-4">
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
                type="datetime-local"
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
            <input
              type="hidden"
              name="status"
              value={payment.status}
            />
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                ยืนยันการชำระ
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Userpay;

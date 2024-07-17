import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getpayuser } from '../API/api';

function PaymentUserId() {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await getpayuser(); // Adjust this URL as per your backend setup
        setPayments(response.data);
      } catch (error) {
        console.error('Error fetching payments:', error);
        // Handle error state or display a message to the user
      }
    };

    fetchPayments();
  }, []);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl mb-4 font-semibold text-gray-700">User Payment History</h1>
      <div className="bg-gray-400 shadow-md rounded-lg p-6">
        {payments.length === 0 ? (
          <p>No payments found.</p>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Booking ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payments.map((payment) => (
                <tr key={payment.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{payment.booking.locks.parking.parking_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{payment.booking.locks.lock_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{new Date(payment.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{payment.booking.brand}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{payment.booking.Vehiclenumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{payment.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default PaymentUserId;


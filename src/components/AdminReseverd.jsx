import React, { useEffect, useState } from 'react';
import { getpayment } from '../API/api';

const AdminReseverd = () => {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const paymentsGet = async () => {
      try {
        const rs = await getpayment();
        console.log(rs.data);
        setPayments(rs.data);
      } catch (err) {
        console.error(err);
      }
    };
    paymentsGet();
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
                  Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Username
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
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payments.map((payment, index) => (
                <tr key={payment.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {payment.booking && payment.booking.user && payment.booking.user.lastname && payment.booking.user.firstname 
                      ? `${payment.booking.user.lastname} ${payment.booking.user.firstname}`
                      : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{payment.amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(payment.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{payment.payment_method}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{payment.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminReseverd;

import React, { useEffect, useState } from 'react';
import { getpayment } from '../API/api';

const AdminReseverd = () => {
  const [payments, setPayments] = useState([]);
  const [expandedRows, setExpandedRows] = useState([]);

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

  const toggleRow = (index) => {
    if (expandedRows.includes(index)) {
      setExpandedRows(expandedRows.filter(row => row !== index));
    } else {
      setExpandedRows([...expandedRows, index]);
    }
  };

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
                  ลำดับที่
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ผู้ใช้งาน
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  พื้นที่จอง
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  โซนที่จอง
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  เวลา
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  สถานะ
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payments.map((payment, index) => (
                <React.Fragment key={payment.id}>
                  <tr onClick={() => toggleRow(index)} className="cursor-pointer">
                    <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{payment.booking.user.username}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{payment.booking.locks.parking.parking_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{payment.booking.locks.lock_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(payment.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{payment.status}</td>
                  </tr>
                  {expandedRows.includes(index) && (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 bg-gray-100">
                        {/* ข้อมูลเพิ่มเติมที่ต้องการแสดงเมื่อคลิก */}
                        <div className="p-4 bg-white shadow-md rounded-lg">
                          <p className="mb-2"><strong>ลำดับที่ :</strong> {payment.id}</p>
                          <p className="mb-2"><strong>ชื่อผู้ใช้งาน : </strong> {payment.booking.user.username}</p>
                          <p className="mb-2"><strong>ชื่อผู้ใช้งาน : </strong> {payment.booking.user.firstname}</p>
                          <p className="mb-2"><strong>ชื่อผู้ใช้งาน : </strong> {payment.booking.user.lastname}</p>
                          <p className="mb-2"><strong>อีเมล : </strong> {payment.booking.user.email}</p>
                          <p className="mb-2"><strong>สถานที่จอด : </strong> {payment.booking.locks.parking.parking_name}</p>
                          <p className="mb-2"><strong>โซนที่จอง : </strong> {payment.booking.locks.lock_name}</p>
                          <p className="mb-2"><strong>ชื่อผู้ใช้งาน : </strong> {payment.date}</p>
                          {/* ข้อมูลเพิ่มเติมอื่น ๆ */}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminReseverd;

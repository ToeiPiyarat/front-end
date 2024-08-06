import React, { useState, useEffect } from 'react';
import { getpayuser } from '../API/api';
import { format, isBefore, subDays } from 'date-fns';
import { th } from 'date-fns/locale';
import domtoimage from 'dom-to-image'; // Import dom-to-image

function PaymentUserId() {
  const [payments, setPayments] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await getpayuser();
        const updatedPayments = response.data.map(payment => {
          const bookingTime = new Date(payment.date);
          const oneDayAgo = subDays(new Date(), 1);
          const status = isBefore(bookingTime, oneDayAgo) ? 'สิ้นสุดดำเนินการ' : payment.status;
          return {
            ...payment,
            status: status,
            bookingTime // Add the booking time for sorting
          };
        });

        // Sort payments by bookingTime in descending order
        updatedPayments.sort((a, b) => b.bookingTime - a.bookingTime);

        setPayments(updatedPayments);
      } catch (error) {
        console.error('Error fetching payments:', error);
      }
    };

    fetchPayments();
    const interval = setInterval(fetchPayments, 86400000); // 24 hours

    return () => clearInterval(interval);
  }, []);

  const toggleRow = (index) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const formatDateTime = (dateTime) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateTime).toLocaleDateString('th-TH', options);
  };

  const filteredPayments = payments.filter((payment) => {
    const paymentData = [
      payment.booking.locks.parking.parking_name,
      payment.booking.locks.lock_name,
      payment.booking.brand,
      payment.booking.vehicle_number
    ].join(' ').toLowerCase();

    return paymentData.includes(searchQuery.toLowerCase());
  });

  // Pagination logic
  const indexOfLastPayment = currentPage * itemsPerPage;
  const indexOfFirstPayment = indexOfLastPayment - itemsPerPage;
  const currentPayments = filteredPayments.slice(indexOfFirstPayment, indexOfLastPayment);
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Function to handle download of details as image
  const handleDownload = (index) => {
    const element = document.getElementById(`expanded-details-${index}`);
    domtoimage.toPng(element)
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `payment-details-${index}.png`;
        link.click();
      })
      .catch((error) => {
        console.error('Error generating image:', error);
      });
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl mb-4 font-semibold text-gray-700">สถานะของผู้ใช้งาน</h1>
      <div className="bg-gray-400 shadow-md rounded-lg p-6">
        <div className="w-full mb-4">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        {filteredPayments.length === 0 ? (
          <p>No payments found.</p>
        ) : (
          <>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ลำดับที่
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    พื้นที่จอง
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    โซนที่จอง
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    เวลาที่จอง
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ยี่ห้อ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ทะเบียน
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    สถานะ
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentPayments.map((payment, index) => (
                  <React.Fragment key={payment.id}>
                    <tr onClick={() => toggleRow(index)} className="cursor-pointer">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {indexOfFirstPayment + index + 1} {/* Calculate the correct index for pagination */}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{payment.booking.locks.parking.parking_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{payment.booking.locks.lock_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{formatDateTime(payment.date)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{payment.booking.brand}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{payment.booking.vehicle_number}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{payment.status}</td>
                    </tr>
                    {expandedRow === index && (
                      <tr>
                        <td colSpan="7" className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-6">
                          <div id={`expanded-details-${index}`} className="bg-white rounded-lg max-w-4xl w-full h-auto p-6 relative">
                            <button
                              onClick={() => setExpandedRow(null)}
                              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDownload(index)}
                              className="absolute top-4 right-16 text-gray-600 hover:text-gray-900"
                            >
                              Download
                            </button>
                            <p className="mb-2"><strong>ลำดับที่ : </strong> {indexOfFirstPayment + index + 1}</p>
                            <p className="mb-2"><strong>พื้นที่จอง: </strong> {payment.booking.locks.parking.parking_name}</p>
                            <p className="mb-2"><strong>โซนที่จอง: </strong> {payment.booking.locks.lock_name}</p>
                            <p className="mb-2"><strong>วันเวลาที่จอง: </strong> {formatDateTime(payment.date)}</p>
                            <p className="mb-2"><strong>ยี่ห้อ: </strong> {payment.booking.brand}</p>
                            <p className="mb-2"><strong>ทะเบียน: </strong> {payment.booking.vehicle_number}</p>
                            <p className="mb-2"><strong>สถานะ: </strong> {payment.status}</p>
                            <p className="mb-2"><strong>สลิปแนบ: </strong></p>
                            <img src={payment.payment_method} alt="Payment Method" className="w-full h-auto max-h-96 object-contain" />
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
            <div className="flex justify-between mt-4">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg"
              >
                Previous
              </button>
              <div className="flex space-x-2">
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index}
                    onClick={() => handlePageChange(index + 1)}
                    className={`px-4 py-2 rounded-lg ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default PaymentUserId;

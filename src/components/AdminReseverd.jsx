import React, { useEffect, useState } from "react";
import Swal from "sweetalert2"; // Import SweetAlert2
import { getpayment, deleterPayment, updatePaymentStatus } from "../API/api";
import { format, addDays, isAfter } from "date-fns";
import { th } from "date-fns/locale";

const ITEMS_PER_PAGE = 10;

const AdminReserved = () => {
  const [payments, setPayments] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await getpayment();
        const currentTime = new Date();
        const updatedPayments = response.data.map((payment) => {
          const bookingTime = new Date(payment.date);
          const completionTime = addDays(bookingTime, 1); // ตรวจสอบว่าล่วงเลยไป 1 วัน
          const status = isAfter(currentTime, completionTime)
            ? "สิ้นสุดดำเนินการ"
            : payment.status;
          return {
            ...payment,
            status: status,
          };
        });
  
        // อัปเดตสถานะสำหรับการจองที่ล่วงเลยเวลา
        await Promise.all(
          updatedPayments
            .filter((payment) => payment.status === "สิ้นสุดดำเนินการ")
            .map((payment) => updatePaymentStatus(payment.id, "สิ้นสุดดำเนินการ"))
        );
  
        const sortedPayments = updatedPayments.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        setPayments(sortedPayments);
      } catch (error) {
        console.error("Error fetching payments:", error);
      }
    };
  
    fetchPayments();
    const interval = setInterval(fetchPayments, 60000);
  
    return () => clearInterval(interval);
  }, []);  

  const toggleRow = (index) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const formatDateTime = (dateTime) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateTime).toLocaleDateString('th-TH', options);
  };

  const filteredPayments = payments.filter((payment, index) => {
    const paymentData = [
      (index + 1).toString(),
      payment.booking.user.username,
      payment.booking.locks.parking.parking_name,
      payment.booking.locks.lock_name,
    ]
      .join(" ")
      .toLowerCase();

    return paymentData.includes(searchQuery.toLowerCase());
  });

  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = filteredPayments.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredPayments.length / ITEMS_PER_PAGE);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: "ยืนยันการลบ",
        text: "คุณแน่ใจว่าต้องการลบข้อมูลการจองนี้?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "ใช่, ลบเลย!",
        cancelButtonText: "ยกเลิก",
      });

      if (result.isConfirmed) {
        await deleterPayment(id);
        setPayments(payments.filter((payment) => payment.id !== id));
        Swal.fire("ลบสำเร็จ!", "ข้อมูลการจองได้ถูกลบแล้ว.", "success");
      }
    } catch (error) {
      console.error("Error deleting payment:", error);
      Swal.fire("เกิดข้อผิดพลาด!", "ไม่สามารถลบข้อมูลการจองได้.", "error");
    }
  };

  const handleStatusUpdate = async (id) => {
    try {
      // แสดงกล่องยืนยันการเปลี่ยนสถานะ
      const result = await Swal.fire({
        title: "ยืนยันการเปลี่ยนสถานะ",
        text: "คุณแน่ใจว่าต้องการเปลี่ยนสถานะการจองนี้?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "ใช่, เปลี่ยนสถานะ!",
        cancelButtonText: "ยกเลิก",
      });
  
      if (result.isConfirmed) {
        // หากยืนยัน, ดำเนินการอัปเดตสถานะ
        await updatePaymentStatus(id, "จองเรียบร้อยแล้ว");
        setPayments(
          payments.map((payment) =>
            payment.id === id
              ? { ...payment, status: "จองเรียบร้อยแล้ว" }
              : payment
          )
        );
        Swal.fire(
          "อัปเดตสำเร็จ!",
          'สถานะการจองได้รับการอัปเดตเป็น "จองเรียบร้อยแล้ว".',
          "success"
        );
      }
    } catch (error) {
      console.error("Error updating payment status:", error);
      Swal.fire("เกิดข้อผิดพลาด!", "ไม่สามารถอัปเดตสถานะการจองได้.", "error");
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl mb-4 font-semibold text-gray-700">
        สถานะผู้ใช้งาน
      </h1>
      <div className="bg-gray-400 shadow-md rounded-lg p-6">
        <div className="w-full mb-4">
          <input
            type="text"
            placeholder="ค้นหา..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        {currentItems.length === 0 ? (
          <p>ไม่พบข้อมูล.</p>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ลำดับที่
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ชื่อผู้ใช้งาน
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  สถานที่จอง
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  โซนที่
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  เวลาที่เลือกจอง
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  เปลี่ยนสถานะ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ยกเลิกการจอง
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.map((payment, index) => (
                <React.Fragment key={payment.id}>
                  <tr
                    onClick={() => toggleRow(index)}
                    className="cursor-pointer"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      {indexOfFirstItem + index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {payment.booking.user.username}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {payment.booking.locks.parking.parking_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {payment.booking.locks.lock_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {formatDateTime(payment.booking.booking_date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {payment.booking.brand}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {payment.booking.vehicle_number}
                        </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {payment.status}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {payment.status !== "สิ้นสุดดำเนินการ" &&
                        payment.status !== "จองเรียบร้อยแล้ว" && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent row toggle
                              handleStatusUpdate(payment.id);
                            }}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded"
                          >
                            เปลี่ยนสถานะ
                          </button>
                        )}
                      {payment.status === "ชำระเงิน" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent row toggle
                            handleStatusUpdate(payment.id);
                          }}
                          className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded"
                        >
                          ชำระเงิน
                        </button>
                      )}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent row toggle
                          handleDelete(payment.id);
                        }}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
                      >
                        ยกเลิก
                      </button>
                    </td>
                  </tr>
                  {expandedRow === index && (
                    <tr>
                      <td
                        colSpan="7"
                        className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-6"
                      >
                        <div className="bg-white rounded-lg max-w-4xl w-full h-auto p-6 relative">
                          <button
                            onClick={() => setExpandedRow(null)}
                            className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>

                          <p className="mb-2 text-lg font-semibold">
                            <strong>ชื่อผู้ใช้งาน: </strong>{" "}
                            {payment.booking.user.username}
                          </p>
                          <p className="mb-2 text-lg">
                            <strong>ชื่อ: </strong>{" "}
                            {payment.booking.user.firstname}
                          </p>
                          <p className="mb-2 text-lg">
                            <strong>นามสกุล: </strong>{" "}
                            {payment.booking.user.lastname}
                          </p>
                          <p className="mb-2 text-lg">
                            <strong>อีเมลล์: </strong>{" "}
                            {payment.booking.user.email}
                          </p>
                          <p className="mb-2 text-lg">
                            <strong>เบอร์โทร: </strong>{" "}
                            {payment.booking.user.phone}
                          </p>
                          <p className="mb-2 text-lg">
                            <strong>พื้นที่จอง: </strong>{" "}
                            {payment.booking.locks.parking.parking_name}
                          </p>
                          <p className="mb-2 text-lg">
                            <strong>โซนที่จอง: </strong>{" "}
                            {payment.booking.locks.lock_name}
                          </p>
                          <p className="mb-2 text-lg">
                            <strong>แบรนด์: </strong> {payment.booking.brand}
                          </p>
                          <p className="mb-2 text-lg">
                            <strong>ทะเบียน: </strong>{" "}
                            {payment.booking.vehicle_number}
                          </p>
                          <p className="mb-2 text-lg">
                            <strong>วันที่เลือกจอง: </strong>{" "}
                            {formatDateTime(payment.booking.booking_date)}
                          </p>
                          <div className="flex justify-center">
                            <img
                              src={payment.payment_method}
                              alt="Payment Method"
                              className="max-w-full h-auto max-h-64"
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        )}
        <div className="mt-4 flex justify-between items-center">
          <div>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2"
            >
              ก่อนหน้า
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            >
              ถัดไป
            </button>
          </div>
          <div>
            <span>
              หน้า {currentPage} จาก {totalPages}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReserved;

import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import qrCodeImage from "../assets/pay.jpg";
import { format, isBefore } from "date-fns";
import { postpay, putuptime } from "../API/api";
import loginImage from "../assets/iconpay.jpg";

function Userpay() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const [payment, setPayment] = useState({
    booking_id: id,
    amount: 50,
    date: "", // Initialize with empty string
    payment_method: "",
    status: "ชำระแล้ว",
  });
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  // Extract bookingDate from location state
  const bookingDate = location.state?.bookingDate || "";

  useEffect(() => {
    if (bookingDate) {
      const formattedDate = format(new Date(bookingDate), "yyyy-MM-dd");
      setPayment((prevPayment) => ({
        ...prevPayment,
        date: formattedDate,
      }));
    }
  }, [bookingDate]);

  const hdlChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "payment_method" && files.length > 0) {
      const selectedFile = files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Url = event.target.result;
        setImageUrl(base64Url);
        setPayment((prevPayment) => ({
          ...prevPayment,
          [name]: base64Url,
        }));
      };
      reader.readAsDataURL(selectedFile);
      setFile(selectedFile);
    } else {
      setPayment((prevPayment) => ({
        ...prevPayment,
        [name]: value,
      }));
    }
  };

  const submitPayment = async (e) => {
    e.preventDefault();
    const result = await Swal.fire({
      title: "คุณแน่ใจหรือไม่?",
      text: "คุณต้องการทำการชำระเงินนี้หรือไม่?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ใช่, ยืนยัน!",
      cancelButtonText: "ยกเลิก",
    });

    if (result.isConfirmed) {
      try {
        const isoDate = format(
          new Date(`${payment.date}T00:00`),
          "yyyy-MM-dd'T'HH:mm"
        );
        const now = new Date();
        const selectedDate = new Date(isoDate);

        let status = "ชำระแล้ว";
        if (isBefore(selectedDate, now)) {
          status = "สิ้นสุดการจอง";
        }

        const formData = new FormData();
        Object.keys(payment).forEach((key) => {
          formData.append(key, key === "date" ? isoDate : payment[key]);
        });

        if (file) {
          formData.append("file", file);
        }

        const rs = await postpay(formData);
        console.log(rs.data);

        if (status === "สิ้นสุดการจอง") {
          await putuptime({ booking_id: id, status: status });
        }

        Swal.fire({
          title: "สำเร็จ!",
          text: "การชำระเงินของคุณถูกส่งเรียบร้อยแล้ว.",
          icon: "success",
        });

        navigate("/");
      } catch (err) {
        console.error("API Error:", err.response?.data || err.message);
        Swal.fire({
          title: "เกิดข้อผิดพลาด!",
          text: "มีข้อผิดพลาดในการส่งการชำระเงินของคุณ.",
          icon: "error",
        });
      }
    }
  };

  return (
    <div className="container mx-auto p-8 flex">
      <div className="w-1/2 flex justify-center items-center">
        <img src={loginImage} alt="Login" className="w-96 h-auto" />
      </div>
      <div className="w-1/2">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h1 className="text-3xl mb-4 font-semibold text-gray-700">
            ชำระเงิน
          </h1>
          <div className="bg-white shadow-md rounded-lg p-6 text-center">
            <p className="text-gray-700 mb-2">จำนวน 50.00 บาท</p>
            <p className="text-gray-700 mb-4">กรุณาชำระเพื่อใช้บริการ</p>
            <img
              src={qrCodeImage}
              alt="QR Code"
              className="w-48 h-48 mx-auto"
            />
          </div>
          <form onSubmit={submitPayment} className="space-y-4">
            <input type="hidden" name="booking_id" value={payment.booking_id} />
            <div>
              <label className="block text-gray-700">ราคา:</label>
              <input
                type="number"
                name="amount"
                value={payment.amount}
                readOnly
                className="w-full px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700">วันที่จะใช้บริการ:</label>
              <input
                type="date"
                name="date"
                value={payment.date}
                readOnly
                className="w-full px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700">แนบสลิป:</label>
              <input
                type="file"
                name="payment_method"
                onChange={hdlChange}
                required
                className="w-full px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <input type="hidden" name="status" value={payment.status} />
            {imageUrl && (
              <div className="mt-4">
                <p className="text-gray-700 mb-2">Selected Image:</p>
                <div className="relative w-32 h-32 mx-auto">
                  <img
                    src={imageUrl}
                    alt="Selected"
                    className="object-cover w-full h-full rounded-md"
                  />
                </div>
              </div>
            )}
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

import React from "react";
import { useNavigate } from "react-router-dom";

export default function UserReserved() {
  const navigate = useNavigate();
  const linkToReserved = () => {
    navigate("/reservation");
  };
  return (
    <div className="card w-96 bg-gradient-to-br from-pink-200 to-purple-200 shadow-xl mx-auto rounded-lg p-8">
      <h2 className="card-title text-3xl text-center font-semibold mb-4 text-gray-800">ยินดีต้อนรับ</h2>
      <div className="card-body text-center">
        <h2 className="card-title text-2xl font-semibold mb-4 text-gray-800">ทำการจอง</h2>
        <p className="text-lg mb-2 text-gray-700">ตอนนี้ท่านเข้าสู่ระบบแล้ว</p>
        <p className="text-lg mb-4 text-gray-700">สามารถทำการจองรถได้แล้ว</p>
        <div className="card-actions flex justify-center">
          <button onClick={linkToReserved} className="btn btn-primary bg-gradient-to-r from-green-300 to-green-400 hover:from-green-400 hover:to-green-500 text-white 
            px-4 py-2 rounded-md shadow-md transition-colors duration-300">จองตรงนี้</button>
        </div>
      </div>
    </div>
  );
}

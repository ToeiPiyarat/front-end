import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import loginImage from '../assets/bg.png';

export default function Admin() {
  const navigate = useNavigate();
  const linkToReserved = () => {
    navigate("/History");
  };

  return (
    <div className="flex">
      <div className="flex-1 p-4 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">ยินดีต้อนรับ</h2>
        <h3 className="text-6xl text-gray-600 mb-4">SopaEnjoyPark</h3>
        <div className="flex justify-center items-center flex-col h-full">
          <p className="text-lg text-gray-700 mb-8">สามารถตรวจสอบสถานะผู้ใช้งานได้เลย</p>
          <button
            onClick={linkToReserved}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            ตรวจสอบสถานะ
          </button>
        </div>
      </div>
      {/* Image on the Right */}
      <div className="flex-1 flex justify-center items-center">
        <img
          src={loginImage}
          style={{ maxWidth: "100%", height: "auto", maxHeight: "550px" }}
          alt="Login"
        />
      </div>
    </div>
  );
}

import React from 'react'
import UserReseverd from '../components/UserReseverd'
import { useNavigate } from "react-router-dom";

export default function Admin() {
  const navigate = useNavigate();
  const linkToReserved = () => {
    navigate("/reserved/edit");
  };
  

  return (
    <><br /><br /><br />
        <div className="flex justify-center items-center mx-auto">
      <div className="card w-96 bg-gradient-to-br from-orange-200 to-pink-200 shadow-xl mx-auto p-6 rounded-lg">
        <h2 className="text-2xl font-bold text-center mb-4 text-orange-800">ยินดีต้อนรับ</h2>
        <div className="card-body text-center">
          <h2 className="text-xl font-bold mb-2 text-pink-800">ทำการเช็คระบบ</h2>
          <p className="text-gray-700 mb-2">ตอนนี้ท่านเข้าสู่ระบบแล้ว</p>
            <p className="text-gray-700 mb-4">สามารถทำการเช็คระบบได้แล้วตอนนี้</p>
              <div className="card-actions flex justify-center">
              <button onClick={linkToReserved} className="btn btn-primary bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded-md shadow-md transition-colors duration-300">ดูสถานะตรงนี้</button>
            </div>
          </div>
        </div>
      </div>
       </>
  )
}
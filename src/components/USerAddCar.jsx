import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function USerAddCar() {
  const navigate = useNavigate();
  const [newCar, setNewCar] = useState({
    vehicleNumber: "",
    brand: "",
    model: "",
  });

  const hdlChange = (e) => {
    setNewCar(prv => ({...prv, [e.target.name]: e.target.value}))
  };

  const Addcar = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }
      await axios.post("http://localhost:8889/car/add", newCar, {
        headers: {Authorization: `Bearer ${token}`}
      })
    //   alert(555)
      navigate("/vechinumber");
    } catch (error) {
      alert(error);
    }
    history.go(0);
  };

  return (
    <form onSubmit={Addcar} className="min-h-[70vh] flex items-center justify-center">
      <div className="bg-pink-100 p-6 rounded-lg ">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            เลขทะเบียน:
          </label>
          <input
            type="text"
            value={newCar.vehicleNumber}
            name="vehicleNumber"
            onChange={hdlChange}
            className="mt-1 p-2 block w-full border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            ยี่ห้อ:
          </label>
          <input
            type="text"
            value={newCar.brand}
            name="brand"
            onChange={hdlChange}
            className="mt-1 p-2 block w-full border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            รุ่น:
          </label>
          <input
            type="text"
            value={newCar.model}
            name="model"
            onChange={hdlChange}
            className="mt-1 p-2 block w-full border-gray-300 rounded-md"
          />
        </div>
        <button className="bg-pink-500 text-white p-2 rounded-md">
          เพิ่มข้อมูล
        </button>
      </div>
    </form>
  );
}

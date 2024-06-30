import React, { useContext, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CarNumberContext from '../contexts/CarNumberContext';
import ReservedContext from '../contexts/ReservedContext';

export default function EditReserved() {
    const { car } = useContext(CarNumberContext);
    const { editReserved } = useContext(ReservedContext);
    const navigate = useNavigate();

    const [update, setUpdate] = useState({
        reserverDate:'',
        vehicleNumber: '',
    });

    const hdlChange = (e) => {
        setUpdate(prevUpdate => ({
            ...prevUpdate,
            [e.target.name]: e.target.value
        }));
    };

    const id = location.pathname.split('/')[2];

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Check if all fields are filled
        if (!update.reserverDate || !update.vehicleNumber) {
            alert("กรุณากรอกข้อมูลให้ครบถ้วน");
            return;
        }

        // Check if reserverDate is in the future
        const currentDate = new Date().toISOString().split('T')[0]; // Get current date in format YYYY-MM-DD
        if (update.reserverDate < currentDate) {
            alert("ไม่สามารถเลือกเวลาในอดีตได้");
            return;
        }

        // Confirmation dialog
        const confirmEdit = window.confirm("คุณต้องการแก้ไขข้อมูลนี้ใช่หรือไม่?");
        if (confirmEdit) {
            // Proceed with editing reservation
            editReserved(id, update);
            navigate('/reserved/show');
        }
    };

    const foundCar = car?.find((item) => item.vehicleNumber === update.vehicleNumber);
    const brand = foundCar ? foundCar.brand : '';
    const model = foundCar ? foundCar.model : '';

    return (
        <div>
            <div className="p-5 border w-4/6 min-w-[100px] mx-auto rounded mt-5 bg-red-100 max-w-[30vw]">
                <div className="text-3xl mb-5">แก้ไขการจอง</div>
                <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                    <label className="form-control w-full max-w-xs">
                        <div className="dropdown">
                            <select
                                name="vehicleNumber"
                                value={update.vehicleNumber}
                                onChange={hdlChange}
                                className="btn m-1 bg-transparent"
                            >
                                <option value="">เลือกหมายเลขทะเบียน</option>
                                {car &&
                                    car.map((item) => (
                                        <option key={item.id} value={item.vehicleNumber}>
                                            {item.vehicleNumber}
                                        </option>
                                    ))}
                            </select>
                        </div>
                    </label>
                    <label className="form-control w-full max-w-[220px] ">
                        <div className="label">
                            <span className="label-text">ยี่ห้อ</span>
                        </div>
                        <input type="text" value={brand} readOnly />
                    </label>
                    <label className="form-control w-full max-w-[220px] ">
                        <div className="label">
                            <span className="label-text">รุ่น</span>
                        </div>
                        <input type="text" value={model} readOnly />
                    </label>
                    <label className="form-control w-full max-w-[220px] ">
                        <div className="label">
                            <span className="label-text">วัน เวลาที่จอง</span>
                        </div>
                        <input
                            type="datetime-local"
                            name="reserverDate"
                            value={update.reserverDate}
                            onChange={hdlChange}
                        />
                    </label>
                    <div className="flex gap-5 ">
                        <button
                            type="submit"
                            className="btn btn-outline bg-green-500 hover:bg-green-600 focus:bg-green-600 hover:text-white focus:text-white"
                        >
                            ยืนยันการแก้ไข
                        </button>
                        <button
                            onClick={() => navigate('/reserved/show')}
                            className="btn btn-outline bg-green-500 hover:bg-green-600 focus:bg-green-600 hover:text-white focus:text-white"
                        >
                            ยกเลิก
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

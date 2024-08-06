import React, { useContext, useState } from 'react';
import axios from 'axios';
import AuthContext from '../contexts/AuthContext';

export default function UserProfile() {
    const [isUpdate, setIsUpdate] = useState(false);
    const { user, updateProfile } = useContext(AuthContext);

    const [update, setUpdate] = useState({
        email: user.email,
        phone: user.phone,
        firstname: user.firstname,
        lastname: user.lastname
    });

    const hdlClick = (e) => {
        e.preventDefault();
        setIsUpdate(!isUpdate);
    };

    const hdlChange = (e) => {
        setUpdate(prevUpdate => ({
            ...prevUpdate,
            [e.target.name]: e.target.value
        }));
    };

    const hdlSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token'); // Retrieve token from local storage
            await axios.patch(`http://localhost:8889/auth/update/${user.id}`, update, {
                headers: { Authorization: `Bearer ${token}` }
            });
            updateProfile(update); 
            setIsUpdate(false);
            window.location.reload();
        } catch (error) {
            console.error('Profile update failed:', error);
        }
    };

    const hdlCancel = () => {
        setIsUpdate(false);
    };

    return (
        <div className="container mx-auto">
            <br />
            {isUpdate ? (
                <div className="max-w-md mx-auto bg-blue-200 shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    <form onSubmit={hdlSubmit}>
                        <div className="mb-4">
                            <label htmlFor="firstname" className="block text-gray-700 text-sm font-bold mb-2">ชื่อ</label>
                            <input onChange={hdlChange} type="text" name="firstname" value={update.firstname} className="mt-1 p-2 border border-gray-300 rounded-md w-full" />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="lastname" className="block text-gray-700 text-sm font-bold mb-2">นามสกุล</label>
                            <input onChange={hdlChange} type="text" name="lastname" value={update.lastname} className="mt-1 p-2 border border-gray-300 rounded-md w-full" />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">อีเมลล์</label>
                            <input onChange={hdlChange} type="text" name="email" value={update.email} className="mt-1 p-2 border border-gray-300 rounded-md w-full" />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="phone" className="block text-gray-700 text-sm font-bold mb-2">เบอร์โทรศัพท์</label>
                            <input onChange={hdlChange} type="text" name="phone" value={update.phone} className="mt-1 p-2 border border-gray-300 rounded-md w-full" />
                        </div>

                        <div className="text-center">
                            <button type="submit" className="btn btn-primary mr-2">บันทึกข้อมูล</button>
                            <button onClick={hdlCancel} className="btn btn-secondary">ยกเลิก</button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="max-w-md mx-auto bg-blue-300 shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    <form>
                        <div className="mb-4">
                            <label htmlFor="firstname" className="block text-gray-700 text-sm font-bold mb-2">ชื่อ</label>
                            <input readOnly type="text" value={update.firstname} name="firstname" className="mt-1 p-2 border border-gray-300 rounded-md w-full text-gray-400" />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="lastname" className="block text-gray-700 text-sm font-bold mb-2">นามสกุล</label>
                            <input readOnly type="text" value={update.lastname} name="lastname" className="mt-1 p-2 border border-gray-300 rounded-md w-full text-gray-400" />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">อีเมลล์</label>
                            <input readOnly type="text" value={update.email} name="email" className="mt-1 p-2 border border-gray-300 rounded-md w-full text-gray-400" />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="phone" className="block text-gray-700 text-sm font-bold mb-2">เบอร์โทรศัพท์</label>
                            <input readOnly type="tel" name="phone" value={update.phone} className="mt-1 p-2 border border-gray-300 rounded-md w-full text-gray-400" />
                        </div>

                        <div className="text-center">
                            <button onClick={hdlClick} className="btn btn-primary">แก้ไขข้อมูล</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}

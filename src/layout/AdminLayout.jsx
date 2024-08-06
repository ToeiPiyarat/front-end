// src/layout/AdminLayout.jsx
import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth'; // นำเข้า useAuth เพื่อจัดการการออกจากระบบ

const adminNav = [
  { to: '/admin', text: 'หน้าหลัก' },
  { to: '/History', text: 'เช็คสถานะผู้ใช้งาน' },
  { to: '/addcar', text: 'เพิ่มข้อมูล' },
];

const AdminLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); 
    navigate('/homepage'); 
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-1/6 bg-gray-100 p-4 flex flex-col">
        {adminNav.map((el) => (
          <Link
            key={el.to}
            to={el.to}
            className="text-purple-800 hover:bg-gray-600 hover:text-white px-4 py-2 rounded-md mb-2 transition-colors duration-300"
          >
            {el.text}
          </Link>
        ))}
        <button
          onClick={handleLogout}
          className="text-red-600 hover:bg-red-200 px-4 py-2 rounded-md mt-auto transition-colors duration-300"
        >
          ออกจากระบบ
        </button>
      </div>

      {/* Main Content */}
      <div className="w-4/5 p-4">
        <Outlet /> {/* This will render the child routes */}
      </div>
    </div>
  );
};

export default AdminLayout;

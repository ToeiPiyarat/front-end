import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { getlock, postlock, deletelock } from '../API/api';
import Swal from 'sweetalert2';

const AdminAbbLock = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [locks, setLocks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [lock, setLock] = useState({
    lock_name: '',
    status: 'ว่าง',
    lock_price: '50', // เปลี่ยนให้ราคาล็อคเป็นค่าคงที่ 50 บาท
    parking_id: id
  });

  const hdlChange = (e) => {
    const { name, value } = e.target;
    setLock((prevLock) => ({
      ...prevLock,
      [name]: value
    }));
  };

  const submitLock = async (e) => {
    e.preventDefault();
  
    const confirmAdd = await Swal.fire({
      icon: 'question',
      title: 'คุณต้องการที่จะเพิ่มข้อมูล Lock ใช่หรือไม่?',
      showCancelButton: true,
      confirmButtonText: 'ใช่, เพิ่มข้อมูล',
      cancelButtonText: 'ยกเลิก'
    });
  
    if (confirmAdd.isConfirmed) {
      try {
        const rs = await postlock(lock);
        setShowForm(false);
        Swal.fire({
          icon: 'success',
          title: 'เพิ่มข้อมูลสำเร็จ',
          text: 'ข้อมูล Lock ได้ถูกเพิ่มเข้าสู่ระบบแล้ว!',
          confirmButtonText: 'ตกลง'
        });
  
        // Update locks state correctly
        const updatedLocks = [...locks, rs.data].filter(lock => lock.lock_name !== undefined).sort((a, b) => a.lock_name.localeCompare(b.lock_name));
        setLocks(updatedLocks);
      } catch (err) {
        console.error(err);
        Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด',
          text: 'ไม่สามารถเพิ่มข้อมูล Lock ได้ในขณะนี้',
          confirmButtonText: 'ตกลง'
        });
      }
    }
  };

  const fetchLocks = async () => {
    try {
      const rs = await getlock();
      const updatedLocks = rs.data.map(lock => ({
        ...lock,
        status: lock.status === 'จองแล้ว' ? 'ไม่ว่าง' : lock.status
      })).filter(lock => lock.parking_id === parseInt(id) && lock.lock_name !== undefined).sort((a, b) => a.lock_name.localeCompare(b.lock_name));
      
      setLocks(updatedLocks);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (id) {
      fetchLocks();
    }
  }, [id]);

  const deleteLockById = async (lockId) => {
    const confirmDelete = await Swal.fire({
      icon: 'question',
      title: 'คุณต้องการที่จะลบข้อมูล Lock ใช่หรือไม่?',
      showCancelButton: true,
      confirmButtonText: 'ใช่, ลบข้อมูล',
      cancelButtonText: 'ยกเลิก'
    });

    if (confirmDelete.isConfirmed) {
      try {
        await deletelock(lockId); 
        setLocks(prevLocks => prevLocks.filter(lock => lock.id !== lockId));
        Swal.fire({
          icon: 'success',
          title: 'ลบข้อมูลสำเร็จ',
          text: 'ข้อมูล Lock ได้ถูกลบออกจากระบบแล้ว!',
          confirmButtonText: 'ตกลง'
        });
      } catch (err) {
        console.error(err);
        Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด',
          text: 'ไม่สามารถลบข้อมูล Lock ได้ในขณะนี้',
          confirmButtonText: 'ตกลง'
        });
      }
    }
  };

  return (
    <div className="container mx-auto p-8">
      <button
        onClick={() => setShowForm(!showForm)}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
      >
        เพิ่มข้อมูล
      </button>
      {showForm && (
        <form onSubmit={submitLock} className="mb-8 bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lock_name">
              Lock Name
            </label>
            <input
              type="text"
              name="lock_name"
              value={lock.lock_name}
              onChange={hdlChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <input
            type="hidden"
            name="lock_price"
            value="50"
          />
          <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Submit Lock
          </button>
        </form>
      )}
      <div className="flex flex-wrap">
        {locks.map((lock) => (
          <div key={lock.id} className="border p-4 mb-4 rounded-md mr-4" style={{ flexBasis: '20%' }}>
            <p><strong>โซนที่ : </strong> {lock.lock_name}</p>
            <p><strong>Lock Price:</strong> 50 บาท</p>
            {lock.parking && (
              <div>
                <p><strong>สถานที่จอง :</strong> {lock.parking.parking_name}</p>
                <p><strong>Parking Location:</strong> {lock.parking.parking_location}</p>
                <p><strong>เมือง :</strong> {lock.parking.city}</p>
                <p><strong>จังหวัด :</strong> {lock.parking.province}</p>
                <img src={lock.parking.photo} alt={lock.parking.parking_name} className="mt-2 rounded-md" style={{ maxWidth: '100%' }} />
                {lock.status === 'ว่าง' && (
                  <button className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline' onClick={() => deleteLockById(lock.id)}>ลบข้อมูล</button>
                )}
                {lock.status === 'จองแล้ว' && (
                  <p className="text-red-500">Lock นี้ถูกจองแล้ว</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminAbbLock;

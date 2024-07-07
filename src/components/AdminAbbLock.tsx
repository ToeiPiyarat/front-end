import React, { useEffect, useState } from 'react';
import { useNavigate, Link, useParams } from "react-router-dom";
import { getlock, postlock, deletelock } from '../API/api';

const AdminAbbLock = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [locks, setLocks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [lock, setLock] = useState({
    lock_name: '',
    status: 'ว่าง',
    lock_price: '',
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
    try {
      const rs = await postlock(lock);
      setLock(rs.data); 
      setShowForm(false);
      alert("Lock information submitted successfully!");

      setLocks(prevLocks => [...prevLocks, rs.data]);
    } catch (err) {
      console.error(err);
      alert("Failed to submit lock information.");
    }
  };

  useEffect(() => {
    const fetchLocks = async () => {
      try {
        const rs = await getlock();
        const filteredLocks = rs.data.filter(lock => lock.parking_id === parseInt(id));
        setLocks(filteredLocks);
        console.log(filteredLocks);
      } catch (err) {
        console.error(err);
      }
    };

    if (id) {
      fetchLocks();
    }
  }, [id]);

  const deleteLockById = async (lockId) => {
    try {
      await deletelock(lockId); 
      setLocks(prevLocks => prevLocks.filter(lock => lock.id !== lockId));
      alert("Lock information deleted successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to delete lock information.");
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
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lock_price">
              Lock Price
            </label>
            <input
              type="text"
              name="lock_price"
              value={lock.lock_price}
              onChange={hdlChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Submit Lock
          </button>
        </form>
      )}
      <div>
        <h1 className="text-3xl mb-4">Locks in Userzone</h1>
        {locks.map((lock) => (
          <div key={lock.id} className="border p-4 mb-4 rounded-md">
            <p><strong>Lock Name:</strong> {lock.lock_name}</p>
            <p><strong>Status:</strong> {lock.status}</p>
            <p><strong>Lock Price:</strong> {lock.lock_price}</p>
            {lock.parking && (
              <div>
                <p><strong>Parking Name:</strong> {lock.parking.parking_name}</p>
                <p><strong>Parking Location:</strong> {lock.parking.parking_location}</p>
                <p><strong>City:</strong> {lock.parking.city}</p>
                <p><strong>Province:</strong> {lock.parking.province}</p>
                <img src={lock.parking.photo} alt={lock.parking.parking_name} className="mt-2 rounded-md" style={{ maxWidth: '100%' }} />
                <button className='btn btn-error' onClick={() => deleteLockById(lock.id)}>ลบข้อมูล</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminAbbLock;


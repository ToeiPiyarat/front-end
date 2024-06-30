import React, { useEffect, useState } from 'react';
import { useNavigate, Link, useParams } from "react-router-dom";
import { getlock } from '../API/api';

function Userzone() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [locks, setLocks] = useState([]);

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

  return (
    <div className="container mx-auto p-8">
      <div>
        <h1 className="text-3xl mb-4">Locks in Userzone</h1>
        {locks.map((lock) => (
          <div key={lock.id} className="border p-4 mb-4 rounded-md">
            <Link to={`/booking/${lock.id}`}>
            <p><strong>Lock Name:</strong> {lock.lock_name}</p>
            <p><strong>Status:</strong> {lock.status}</p>
            <p><strong>Lock Price:</strong> {lock.lock_price}</p>
            <p><strong>Parking Name:</strong> {lock.parking.parking_name}</p>
            <p><strong>Parking Location:</strong> {lock.parking.parking_location}</p>
            <p><strong>City:</strong> {lock.parking.city}</p>
            <p><strong>Province:</strong> {lock.parking.province}</p>
            <img src={lock.parking.photo} alt={lock.parking.parking_name} className="mt-2 rounded-md" style={{ maxWidth: '100%' }} />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Userzone;

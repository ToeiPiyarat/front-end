import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { getMarket, postparking } from '../API/api';

export const AdminHistory = () => {
  const navigate = useNavigate();
  const [market, setMarket] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [parking, setparking] = useState({
    parking_name: '',
    parking_location: '',
    city: '',
    province: '',
    photo: ''
  });

  const hdlChange = (e) => {
    const { name, value } = e.target;
    setparking((prevParking) => ({
      ...prevParking,
      [name]: value
    }));
  };

  const submitparking = async (e) => {
    e.preventDefault();
    try {
      const rs = await postparking(parking);
      setparking(rs.data);
      console.log(rs.data);
      alert("Parking information submitted successfully!");
      setShowForm(false); 
    } catch (err) {
      console.error(err);
      alert("Failed to submit parking information.");
    }
  };

  useEffect(() => {
    const fetchMarket = async () => {
      try {
        const rs = await getMarket();
        setMarket(rs.data);
        console.log(rs.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMarket();
  }, []);

  const handleSelection = (image) => {
    setSelectedImage(image);
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
        <form onSubmit={submitparking} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Parking Name:</label>
            <input
              type="text"
              name="parking_name"
              value={parking.parking_name}
              onChange={hdlChange}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Parking Location:</label>
            <input
              type="text"
              name="parking_location"
              value={parking.parking_location}
              onChange={hdlChange}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">City:</label>
            <input
              type="text"
              name="city"
              value={parking.city}
              onChange={hdlChange}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Province:</label>
            <input
              type="text"
              name="province"
              value={parking.province}
              onChange={hdlChange}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Photo URL:</label>
            <input
              type="text"
              name="photo"
              value={parking.photo}
              onChange={hdlChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Submit Parking
          </button>
        </form>
      )}

      <div>
        {market.map((markets) => (
          <div key={markets.id} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <Link to={`/addlock/${markets.id}`} className="text-blue-500 hover:underline">
              <p className="text-lg font-bold">{markets.parking_name}</p>
              <p>{markets.parking_location}</p>
              <p>{markets.city}</p>
              <p>{markets.province}</p>
            </Link>
            <button
              onClick={() => handleSelection(markets.photo)}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mt-2"
            >
              Show Image
            </button>
          </div>
        ))}
      </div>
      {selectedImage && (
        <div className="mt-4">
          <img src={selectedImage} alt="Market" className="w-full h-auto" />
        </div>
      )}
    </div>
  )
}

export default AdminHistory;


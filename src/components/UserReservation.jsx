import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { getMarket } from '../API/api';

export const AdminHistory = () => {
  const navigate = useNavigate();
  const [market, setMarket] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

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
    if (selectedImage === image) {
      setSelectedImage(null); // ปิดรูปภาพเมื่อกดอีกที
    } else {
      setSelectedImage(image);
    }
  };

  return (
    <div className="container mx-auto p-8">
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
              {selectedImage === markets.photo ? 'ปิดรูปภาพ' : 'ดูรูปภาพ'}
            </button>
            {selectedImage === markets.photo && (
              <div className="mt-2">
                <img
                  src={markets.photo}
                  alt="Market"
                  className="w-60 h-60 object-cover rounded-lg"
                  style={{ maxWidth: '300px', maxHeight: '300px' }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminHistory;

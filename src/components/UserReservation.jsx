import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { getMarket } from '../API/api';

export default function ReservedSelection() {
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
    setSelectedImage(image);
  };

  return (
    <div className="container mx-auto p-8">
      <div>
        {market.map((markets) => (
          <div key={markets.id}>
            <Link to={`/zone/${markets.id}`}>
              <p>{markets.parking_name}</p>
              <p>{markets.parking_location}</p>
              <p>{markets.city}</p>
              <p>{markets.province}</p>
            </Link>
            <button onClick={() => handleSelection(markets.photo)}>Show Image</button>
          </div>
        ))}
      </div>
      {selectedImage && (
        <div className="mt-4">
          <img src={selectedImage} alt="Market" />
        </div>
      )}
    </div>
  );
}

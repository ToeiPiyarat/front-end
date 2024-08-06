import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { getMarket, postparking, deleteParking } from '../API/api';
import Swal from 'sweetalert2';

export const AdminHistory = () => {
  const navigate = useNavigate();
  const [market, setMarket] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [parking, setParking] = useState({
    parking_name: '',
    parking_location: '',
    city: '',
    province: '',
    photo: ''
  });

  const hdlChange = (e) => {
    const { name, value } = e.target;
    setParking((prevParking) => ({
      ...prevParking,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setParking((prevParking) => ({
          ...prevParking,
          photo: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const submitParking = async (e) => {
    e.preventDefault();
    const swalConfirm = await Swal.fire({
      title: 'ยืนยันการเพิ่มข้อมูล',
      text: 'คุณต้องการที่จะเพิ่มข้อมูลที่จอดรถนี้ใช่หรือไม่?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ใช่, ฉันต้องการเพิ่ม!',
      cancelButtonText: 'ยกเลิก'
    });

    if (swalConfirm.isConfirmed) {
      try {
        await postparking(parking);
        setParking({
          parking_name: '',
          parking_location: '',
          city: '',
          province: '',
          photo: ''
        }); // Clear the form fields
        Swal.fire('สำเร็จ!', 'ข้อมูลที่จอดรถถูกเพิ่มเรียบร้อยแล้ว', 'success');
        setShowForm(false); 
        fetchMarket(); // Refresh market data
      } catch (err) {
        console.error(err);
        Swal.fire('ผิดพลาด!', 'มีปัญหาในการเพิ่มข้อมูลที่จอดรถ', 'error');
      }
    }
  };

  const fetchMarket = async () => {
    try {
      const rs = await getMarket();
      setMarket(rs.data);
      console.log(rs.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMarket();
  }, []);

  const handleSelection = (id) => {
    if (selectedImages.includes(id)) {
      setSelectedImages(selectedImages.filter(imageId => imageId !== id));
    } else {
      setSelectedImages([...selectedImages, id]);
    }
  };

  const handleDelete = async (id) => {
    const swalConfirm = await Swal.fire({
      title: 'ยืนยันการลบข้อมูล',
      text: 'คุณต้องการที่จะลบข้อมูลที่จอดรถนี้ใช่หรือไม่?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'ใช่, ฉันต้องการลบ!',
      cancelButtonText: 'ยกเลิก'
    });

    if (swalConfirm.isConfirmed) {
      try {
        await deleteParking(id);
        Swal.fire('สำเร็จ!', 'ข้อมูลที่จอดรถถูกลบเรียบร้อยแล้ว', 'success');
        fetchMarket(); // Refresh market data
      } catch (err) {
        console.error(err);
        Swal.fire('ผิดพลาด!', 'มีปัญหาในการลบข้อมูลที่จอดรถ', 'error');
      }
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl mb-4 font-semibold text-gray-700">
        เพิ่มที่จอดรถ
      </h1>
      <button
        onClick={() => setShowForm(!showForm)}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
      >
        เพิ่มข้อมูล
      </button>
      {showForm && (
        <form onSubmit={submitParking} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">ชื่อที่จอดรถ:</label>
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
            <label className="block text-gray-700 text-sm font-bold mb-2">ที่ตั้งที่จอดรถ:</label>
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
            <label className="block text-gray-700 text-sm font-bold mb-2">เมือง:</label>
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
            <label className="block text-gray-700 text-sm font-bold mb-2">จังหวัด:</label>
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
            <label className="block text-gray-700 text-sm font-bold mb-2">รูปภาพ:</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            {parking.photo && (
              <div className="mt-2">
                <img
                  src={parking.photo}
                  alt="Preview"
                  className="w-40 h-40 object-cover rounded-lg"
                  style={{ maxWidth: '200px', maxHeight: '200px' }}
                />
              </div>
            )}
          </div>
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            เพิ่มที่จอดรถ
          </button>
        </form>
      )}

      {market.map((markets) => (
        <div key={markets.id} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <Link to={`/addlock/${markets.id}`} className="text-blue-500 hover:underline">
            <p className="text-lg font-bold">{markets.parking_name}</p>
            <p>{markets.parking_location}</p>
            <p>{markets.city}</p>
            <p>{markets.province}</p>
          </Link>
          <button
            onClick={() => handleSelection(markets.id)}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mt-2"
          >
            {selectedImages.includes(markets.id) ? 'ซ่อนรูปภาพ' : 'แสดงรูปภาพ'}
          </button>
          <button
            onClick={() => handleDelete(markets.id)}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-2 ml-2"
          >
            ลบ
          </button>
          {selectedImages.includes(markets.id) && (
            <div className="mt-2">
              <img
                src={markets.photo}
                alt="Parking"
                className="w-40 h-40 object-cover rounded-lg"
                style={{ maxWidth: '200px', maxHeight: '200px' }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default AdminHistory;

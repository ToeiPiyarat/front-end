import axios from "axios";
import React, { createContext, useEffect, useState } from "react";

const ReservedContext = createContext();
function ReservedContextProvider(props) {
  const [data, setData] = useState(null)
  const [adminData, setAdminData] = useState(null)
  const [trigger, setTrigger] = useState(false)

  useEffect(() => {
    const showReserved = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {return}
        const rs = await axios.get("http://localhost:8889/reserved/show", {
          headers: {Authorization: `Bearer ${token}`}
        });
        // console.log(rs.data)
        setData(rs.data)

      } catch (error) {
        alert(error);
      }
    };
    showReserved();

  }, [trigger]);


  useEffect(() => {
    const showReserved = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {return}
        const rs = await axios.get("http://localhost:8889/reserved/adminShow", {
          headers: {Authorization: `Bearer ${token}`}
        });
        // console.log(rs.data)
        setAdminData(rs.data)
        // console.log(adminData);

      } catch (error) {
        alert(error);
      }
    };
    showReserved();

  }, []);

  const deleteReserved = async (reservedId) => {
    try {
        const re = await axios.delete(`http://localhost:8889/reserved/delete/${reservedId}`);
        if (re.status === 200) {
        }
        setTrigger(prv => !prv)

    } catch (error) {
        alert(error.message)
        
    }
};

const editReserved = async (id, data) => {
  try {
    const token = localStorage.getItem('token');
    await axios.patch(`http://localhost:8889/reserved/updateReseved/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    alert('การจองได้รับการอัปเดตเรียบร้อยแล้ว');
    setTrigger(prv => !prv)
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการอัปเดตการจอง:', error);
  }
};

  return (
    <ReservedContext.Provider value={{ data, adminData, deleteReserved, editReserved }}>
      {props.children}
    </ReservedContext.Provider>
  );
}

export default ReservedContext;
export { ReservedContextProvider };

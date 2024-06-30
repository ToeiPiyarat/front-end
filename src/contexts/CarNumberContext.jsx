import axios from "axios";
import React, { createContext, useEffect, useState } from "react";

const CarNumberContext = createContext();
function CarNumberContextProvider(props) {
  const [car, setcar] = useState(null);

  useEffect(() => {
    const Showcar = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          return;
        }
        const rs = await axios.get("http://localhost:8889/car/show", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setcar(rs.data);
        // console.log(car)
      } catch (error) {
        alert(error);
      }
    };
    Showcar();
  }, []);

  const deletecar = async (vehiclenumberId) => {
    try {
      let token = localStorage.getItem("token");

      const re = await axios.delete(`http://localhost:8889/car/delete/${vehiclenumberId}`, {
        headers:{
          Authorization:`Bearer ${token}`
        }
      });
      
      if (re.status === 200){
      }
    } catch (error) {
      alert(error.message)
    }
  };

  return (
    <CarNumberContext.Provider value={{car, deletecar}}>
      {props.children}
    </CarNumberContext.Provider>
  );
}

export default CarNumberContext
export {CarNumberContextProvider}

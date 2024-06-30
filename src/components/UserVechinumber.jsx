// import axios from "axios";
// import React, { useContext } from "react";
// import { createContext, useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import CarNumberContext from "../contexts/CarNumberContext";

// export default function UserVechinumber() {
//   const { car } = useContext(CarNumberContext);

//   const navigate = useNavigate();
//   const click = () => {
//     navigate("/add");
//   };

//   return (
//     <div>
//       <div className="flex justify-center mb-4">
//         <button
//           onClick={click}
//           className="bg-green-500 hover:bg-green-600 focus:bg-green-600 text-white px-2 py-1 rounded-md"
//         >
//           เพิ่มเลขทะเบียนรถ
//         </button>
//       </div>
//       {car?.map((item) => (
//         <ReseverdItem key={item.id} item={item} />
//       ))}
//     </div>
//   );
// }

// function ReseverdItem({ item }) {
//   const { deletecar } = useContext(CarNumberContext);

//   const handleDelete = (id) => {
//     const isConfirmed = window.confirm(
//       "คุณต้องการลบทะเบียนที่ลงไว้แล้วหรือไม่?"
//     );
//     if (isConfirmed) {
//       deletecar(id);
//       alert("ท่านได้ลบทะเบียนที่ลงไว้แล้ว");
//     }
//   };

//   return (
//     <div>
//       <div className="overflow-x-auto relative flex justify-center">
//         <div className="mx-auto max-w-[700px] my-4">
//           <table className="table-auto bg-white border border-green-200 rounded-lg">
//             <thead>
//               <tr>
//                 <th className="px-3 py-2 text-center text-xs font-medium text-gray-600 uppercase tracking-wider border-b border-gray-200">
//                   ทะเบียน
//                 </th>
//                 <th className="px-3 py-2 text-center text-xs font-medium text-gray-600 uppercase tracking-wider border-b border-gray-200">
//                   ยี่ห้อ
//                 </th>
//                 <th className="px-3 py-2 text-center text-xs font-medium text-gray-600 uppercase tracking-wider border-b border-gray-200">
//                   รุ่น
//                 </th>
//                 <th className="px-3 py-2 text-center text-xs font-medium text-gray-600 uppercase tracking-wider border-b border-gray-200">
//                   ทำการยกเลิก
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               <tr className="bg-green-50">
//                 <td className="px-3 py-2 text-center border-b border-gray-200">
//                   {item.vehicleNumber}
//                 </td>
//                 <td className="px-3 py-2 text-center border-b border-gray-200">
//                   {item.brand}
//                 </td>
//                 <td className="px-3 py-2 text-center border-b border-gray-200">
//                   {item.model}
//                 </td>
//                 <td className="px-3 py-2 text-center border-b border-gray-200">
//                   <button
//                     onClick={() => handleDelete(item.id)}
//                     className="bg-red-500 hover:bg-red-600 focus:bg-red-600 text-white px-2 py-1 rounded-md"
//                   >
//                     ยกเลิก
//                   </button>
//                 </td>
//               </tr>
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }

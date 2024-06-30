import axios from 'axios';
import { useState } from "react";
import { useNavigate } from 'react-router-dom';

export default function RegisterForm() {

  const navigate = useNavigate();
  const [input, setInput] = useState({
    username: '', 
    password: '',
    confirmPassword: '',
    email: '',
    phone: '',
    vehicleNumber: '',
    firstname: '',
    lastname: ''
  });

  const hdlChange = e => {
    setInput(prv => ({ ...prv, [e.target.name]: e.target.value }));
  }

  const hdlSubmit = async e => {
    try {
      e.preventDefault();
      // validation
      if (input.password !== input.confirmPassword) {
        return alert('Please check confirm password');
      }
      const rs = await axios.post('http://localhost:8889/auth/register', input);
      console.log(rs);
      if (rs.status === 200) {
        alert('Register Successful');
        navigate('/login');
      }
    } catch (err) {
      console.log(err.message);
    }
  }

  return (
    <div className="p-5 border w-4/6 min-w-[100px] mx-auto rounded mt-5 bg-red-100 max-w-[30vw]">
      <div className="text-3xl mb-5">กรอกข้อมูลเพื่อสมัครใช้งาน</div>
      <form className="flex flex-col gap-2" onSubmit={hdlSubmit}>
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">ชื่อผู้ใช้งาน</span>
          </div>
          <input
            type="text"
            className="input input-bordered w-full max-w-xs"
            name="username"
            value={input.username}
            onChange={hdlChange}
          />
        </label>
        
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">รหัสผ่าน</span>
          </div>
          <input
            type="password"
            className="input input-bordered w-full max-w-xs"
            name="password"
            value={input.password}
            onChange={hdlChange}
          />
        </label>
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">ยื่นยันรหัสผ่าน</span>
          </div>
          <input
            type="password"
            className="input input-bordered w-full max-w-xs"
            name="confirmPassword"
            value={input.confirmPassword}
            onChange={hdlChange}
          />
        </label>
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">อีเมล์</span>
          </div>
          <input
            type="email"
            className="input input-bordered w-full max-w-xs"
            name="email"
            value={input.email}
            onChange={hdlChange}
          />
        </label>
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">เบอร์โทร</span>
          </div>
          <input
            type="text"
            className="input input-bordered w-full max-w-xs"
            name="phone"
            value={input.phone}
            onChange={hdlChange}
          />
        </label>
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">ชื่อ</span>
          </div>
          <input
            type="text"
            className="input input-bordered w-full max-w-xs"
            name="firstname"
            value={input.firstname}
            onChange={hdlChange}
          />
        </label>
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">นามสกุล</span>
          </div>
          <input
            type="text"
            className="input input-bordered w-full max-w-xs"
            name="lastname"
            value={input.lastname}
            onChange={hdlChange}
          />
        </label>
        <div className="flex gap-5 ">
          <button type="submit" className="btn btn-outline bg-green-500 hover:bg-green-600 focus:bg-green-600 hover:text-white focus:text-white">สมัคร</button>
          {/* <button type="reset" className="btn btn-outline bg-green-500 hover:bg-green-600 focus:bg-green-600 hover:text-white focus:text-white">รีเซ็ด</button> */}
        </div>
      </form>
    </div>
  );
}

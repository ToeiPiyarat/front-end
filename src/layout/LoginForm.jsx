// LoginForm.js
import axios from 'axios';
import { useState } from 'react';
import useAuth from '../hooks/useAuth';
import '../styles.css';

export default function LoginForm() {
  const { setUser, user } = useAuth();
  const [input, setInput] = useState({
    username: '',
    password: ''
  });
  const [errorMessage, setErrorMessage] = useState('');

  const hdlChange = e => {
    setInput(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const hdlSubmit = async e => {
    try {
      e.preventDefault();
      const rs = await axios.post('http://localhost:8889/auth/login', input);
      localStorage.setItem('token', rs.data.token);
      const rs1 = await axios.get('http://localhost:8889/auth/me', {
        headers: { Authorization: `Bearer ${rs.data.token}` }
      });
      setUser(rs1.data);
      console.log(rs.data)
      window.location.reload();
    } catch (err) {
      setErrorMessage('ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง');
    }
  };

  return (
    <div className="p-5 border w-2/6 min-w-[100px] mx-auto rounded mt-5 bg-red-100 max-w-[30vw]">
      <div className="flex justify-center">
        <img src="car.jpg" className="w-24 h-24 rounded-full border border-black" />
      </div>
      <div className="text-3xl mb-5 flex-grow-0 text-center">กรุณาเข้าสู่ระบบของท่าน</div>
      <form className="flex flex-col gap-2" onSubmit={hdlSubmit}>
        <label className="form-control w-full max-w-full flex justify-start items-center">
          <span className="label-text mr-2">ชื่อผู้ใช้งาน</span>
          <input
            type="text"
            className="input input-bordered w-full max-w-full"
            name="username"
            value={input.username}
            onChange={hdlChange}
          />
        </label>

        <label className="form-control w-full max-w-full flex justify-start items-center">
          <span className="label-text mr-2">รหัสผ่าน</span>
          <input
            type="password"
            className="input input-bordered w-full max-w-full"
            name="password"
            value={input.password}
            onChange={hdlChange}
          />
        </label>

        {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}

        <div className="flex justify-center">
          <button type="submit" className="btn btn-outline bg-green-500 hover:bg-green-600 focus:bg-green-600 hover:text-white focus:text-white">ล็อคอิน</button>
        </div>
      </form>
    </div>
  );
}

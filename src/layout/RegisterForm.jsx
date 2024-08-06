import axios from 'axios';
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './RegisterForm.css'; // Import the CSS file

export default function RegisterForm() {
  const navigate = useNavigate();
  const [input, setInput] = useState({
    username: '', 
    password: '',
    confirmPassword: '',
    email: '',
    phone: '',
    firstname: '',
    lastname: ''
  });

  const hdlChange = e => {
    setInput(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const hdlSubmit = async (e) => {
    e.preventDefault();

    if (input.password !== input.confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please check confirm password!',
      });
      return;
    }

    const confirmRegister = await Swal.fire({
      icon: 'question',
      title: 'ยืนยันการสมัคร',
      text: 'คุณต้องการที่จะสมัครด้วยบัญชีนี้จริงหรือไม่?',
      showCancelButton: true,
      confirmButtonText: 'ใช่, สมัคร',
      cancelButtonText: 'ยกเลิก'
    });

    if (!confirmRegister.isConfirmed) {
      return;
    }

    try {
      const rs = await axios.post('http://localhost:8889/auth/register', input);
      if (rs.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'สมัครสมาชิกสำเร็จ!',
          text: 'คุณได้ทำการสมัครสมาชิกเรียบร้อยแล้ว',
        }).then(() => {
          navigate('/login');
        });
      }
    } catch (err) {
      if (err.response && err.response.status === 409) {
        Swal.fire({
          icon: 'error',
          title: 'สมัครสมาชิกไม่สำเร็จ',
          text: 'มีบัญชีผู้ใช้นี้อยู่ในระบบแล้ว กรุณาเลือกชื่อผู้ใช้งานอื่น',
        });
      } else {
        console.error(err);
        Swal.fire({
          icon: 'error',
          title: 'สมัครสมาชิกไม่สำเร็จ',
          text: 'เกิดข้อผิดพลาดในการสมัครสมาชิก กรุณาลองอีกครั้งภายหลัง',
        });
      }
    }
  };

  return (
    <div className="register-container">
      <div className="register-form">
        <h2 className="form-title">กรอกข้อมูล เพื่อสมัครใช้งาน</h2>
        <form onSubmit={hdlSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">ชื่อ</label>
              <input
                type="text"
                className="form-input"
                name="firstname"
                value={input.firstname}
                onChange={hdlChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label">นามสกุล</label>
              <input
                type="text"
                className="form-input"
                name="lastname"
                value={input.lastname}
                onChange={hdlChange}
              />
            </div>
          </div>
          <div className="form-group-full">
            <label className="form-label">ชื่อผู้ใช้งาน</label>
            <input
              type="text"
              className="form-input"
              name="username"
              value={input.username}
              onChange={hdlChange}
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">รหัสผ่าน</label>
              <input
                type="password"
                className="form-input"
                name="password"
                value={input.password}
                onChange={hdlChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label">ยืนยันรหัสผ่าน</label>
              <input
                type="password"
                className="form-input"
                name="confirmPassword"
                value={input.confirmPassword}
                onChange={hdlChange}
              />
            </div>
          </div>
          <div className="form-group-full">
            <label className="form-label">อีเมล์</label>
            <input
              type="email"
              className="form-input"
              name="email"
              value={input.email}
              onChange={hdlChange}
            />
          </div>
          <div className="form-group-full">
            <label className="form-label">เบอร์โทร</label>
            <input
              type="text"
              className="form-input"
              name="phone"
              value={input.phone}
              onChange={hdlChange}
            />
          </div>
          <div className="form-button">
            <button type="submit" className="submit-button">
              สมัครสมาชิก
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

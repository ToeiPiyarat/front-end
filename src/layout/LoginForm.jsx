import axios from 'axios';
import { useState } from 'react';
import useAuth from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import './login.css';
import loginImage from '../assets/login2.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faEye, faEnvelope } from '@fortawesome/free-solid-svg-icons';

export default function LoginForm() {
  const { setUser } = useAuth();
  const [input, setInput] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = e => {
    setInput(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8889/auth/login', input);
      const token = response.data.token;
      localStorage.setItem('token', token);
      console.log(response.data);
      const userResponse = await axios.get('http://localhost:8889/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      setUser(userResponse.data);
  
      // Navigate to the home page and use the key prop to force refresh
      navigate('/', { replace: true });
      
      // Optionally, you can use a state management tool or context to update other components
    } catch (error) {
      if (error.response) {
        setErrorMessage('ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง');
      } else if (error.request) {
        setErrorMessage('ไม่สามารถติดต่อเซิร์ฟเวอร์ได้');
      } else {
        setErrorMessage('เกิดข้อผิดพลาดบางอย่าง');
      }
    }
  };  

  return (
    <div className="login-container">
      <div className="login-left">
        <img src={loginImage} className="login-image" alt="Login" />
      </div>
      <div className="login-right">
        <div className="login-header">
          ให้ท่านกรอกข้อมูลด้านล่างเพื่อเข้าสู่ระบบ
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
            <input
              type="text"
              placeholder="ชื่อผู้ใช้งาน"
              className="input-field"
              name="username"
              value={input.username}
              onChange={handleChange}
            />
          </div>
          <div className="input-group">
            <FontAwesomeIcon icon={faLock} className="input-icon" />
            <div className="password-input">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="รหัสผ่าน"
                className="input-field"
                name="password"
                value={input.password}
                onChange={handleChange}
              />
              <FontAwesomeIcon
                icon={faEye}
                className="password-toggle"
                onClick={togglePasswordVisibility}
              />
            </div>
          </div>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <div className="button-group">
            <button type="submit" className="login-button">เข้าสู่ระบบ</button>
              <div className="register-link">
                ยังไม่มีบัญชี? <a href="/register">สมัครใช้งาน</a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

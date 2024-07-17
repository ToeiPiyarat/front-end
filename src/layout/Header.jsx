import {Link, useNavigate} from 'react-router-dom'
import useAuth from '../hooks/useAuth';

const guestNav = [
  { to : '/homepage', text: 'หน้าหลัก'},
  { to : '/login', text: 'ล็อคอิน' },
  { to : '/register', text: 'สมัคร' },
]

const userNav = [
  { to : '/home', text: 'ทำการจอง' },
  { to : '/payuser', text: 'เช็คสถานะ' },
  { to : '/profire', text:'แก้ไขข้อมูลส่วนตัว' },
  
]

const adminNav = [
  { to : '/admin', text: 'หน้าหลัก' },
  { to : '/History', text: 'เช็คสถานะผู้ใช้งาน' },
  { to : '/addcar', text: 'เพิ่มข้อมูล'}
]

export default function Header() {
  const {user, logout} = useAuth()

  // console.log(user?.role);
  // const finalNav = user?.id ?  userNav : guestNav
  const finalNav = user?.id ? user?.role === 'ADMIN' ? adminNav : userNav : guestNav;
  
  

  const navigate = useNavigate()

  const hdlLogout = () => {
    logout()
    navigate('/')
  }

  return (
      <div className="navbar  bg-[#c2c7cc] hover:bg-[#cccccc] focus:bg-[#7aa5d0] text-white py-3 px-4 flex items-center justify-between">
        <div className="flex items-center">
            <div className="text-2xl font-bold bg-gradient-to-br from-blue-400 to-purple-600 bg-clip-text text-transparent cursor-pointer hover:text-4xl">{user?.id ? user.username : ''}</div>
        </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1 flex items-center">
          {finalNav.map(el => (
        <li key={el.to} className="mx-2">
          <Link to={el.to} className="text-purple-800 hover:bg-gray-600 hover:text-white px-4 py-2 rounded-md transition-colors duration-300">{el.text}</Link>
        </li>
      ))}
      {user?.id && (
        <li><Link to='#' onClick={hdlLogout} className="text-purple-800 hover:bg-gray-600 hover:text-white px-4 py-2 rounded-md transition-colors duration-300">ออกจากระบบ</Link></li>
      )}
    </ul>
  </div>
</div>
  );
}

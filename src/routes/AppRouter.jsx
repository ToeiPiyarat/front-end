import {createBrowserRouter, RouterProvider, Outlet} from 'react-router-dom'
import LoginForm from '../layout/LoginForm'
import RegisterForm from '../layout/RegisterForm'
import useAuth from '../hooks/useAuth'
import Header from '../layout/Header'
import HOME from '../layout/HOME'
// import ReservedDashboard from '../components/Reseverd'
// import AdminReseverd  from '../components/AdminReseverd'
import Admin from '../layout/Admin'
import AdminReseverd from'../components/AdminReseverd'
import UserProfire from '../components/UserProfire'
// import UserVechinumber from '../components/UserVechinumber'
// import USerAddCar from '../components/USerAddCar'
// import EditReseved from '../components/EditReseved'
import Homepage from '../layout/Homepage'
import UserReservation from '../components/UserReservation'
import Userzone from '../components/Userzone'
import Userpay from '../components/Userpay'
import Reseverd from '../components/Reseverd'
import PaymentUserId from '../components/paymentuserid'
import AdminInputData  from '../components/AdminInputData'
import AdminAbbLock from '../components/AdminAbbLock'
import AdminLayout from '../layout/AdminLayout'

const guestRouter = createBrowserRouter([
  {
    path: '/',
    element: <>
      <Header />
      <Outlet />
    </>,
    children: [
      { index: true, element: <Homepage /> },
      { path: '/homepage', element: <Homepage /> },
      { path: '/login', element: <LoginForm /> },
      { path: '/register', element: <RegisterForm />},

    ]
  }
])

const userRouter = createBrowserRouter([
  {
    path: '/',
    element: <>
      <Header />
      <Outlet />
    </>,
    children : [
      { index: true, element: <HOME /> },
      { path: '/login', element: <LoginForm /> },
      { path: '/home', element:<HOME/> },
      { path: '/profire', element: <UserProfire/> },
      { path: '/reservation', element: <UserReservation/>},
      { path: '/addlock/:id', element: <Userzone/>},
      { path: '/booking/:id', element: <Reseverd/> },
      { path: '/userpay/:id', element: <Userpay/>},
      { path: '/payuser', element: <PaymentUserId/>}

    ]
  }
])

const adminRouter = createBrowserRouter([
  {
    path: '/',
    element: <AdminLayout />,
    children : [
      { index: true, element: <Admin /> },
      { path: '/login', element: <LoginForm /> },
      { path: '/home', element:<HOME/> },
      { path: '/admin', element:<Admin/> },
      { path: '*', element: <p> PAGE NOT FOUND</p>},
      { path: '/History', element: <AdminReseverd/> },
      { path: '/addcar', element: <AdminInputData/>},
      { path: '/addlock/:id', element: <AdminAbbLock/>}
      
      
    ]
  }
])

export default function AppRouter() {
  const {user} = useAuth()
  const finalRouter = user?.id ? user?.role === 'ADMIN' ? adminRouter : userRouter : guestRouter;


  return (
    <RouterProvider router={finalRouter} />
  )
}
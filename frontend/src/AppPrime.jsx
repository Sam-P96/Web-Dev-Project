import { Routes, Route } from 'react-router-dom';

import HomePagePrime from './pages/HomePagePrime.jsx';
import Login from './pages/Login';
import UserProfile from './pages/UserProfile';
import WorkerAppointments from './pages/WorkerAppointments';
import SubmitCar from './pages/SubmitCar';
import FindCarsPrime from './pages/FindCarsPrime';
import CreateAccount from './pages/CreateAccount';
import Navbar from './components/Navbar.jsx';
import BookingAppointment from './components/BookingAppointment.jsx';
import WorkerOffers from './pages/WorkerOffers.jsx';

function AppPrime() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePagePrime />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/employee_booking" element={<WorkerAppointments />} />
        <Route path="/submit_page" element={<SubmitCar />} />
        <Route path="/find_cars" element={<FindCarsPrime />} />
        <Route path="/register" element={<CreateAccount />} />
        <Route path="/appointment" element={<BookingAppointment />} />
        <Route path="/appointment/:carId" element={<BookingAppointment />} />
        <Route path="/offers" element={<WorkerOffers />} />
      </Routes>
    </div>
  );
}

export default AppPrime;

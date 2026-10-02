import { Routes, Route } from 'react-router-dom';

import HomePagePrime from './pages/HomePagePrime.jsx';
import Login from './pages/Login';
import UserProfile from './pages/UserProfile';
import WorkerAppointments from './pages/WorkerAppointments';
import SubmitCar from './pages/SubmitCar';
import FindCarsPrime from './pages/FindCarsPrime';
import CreateAccount from './pages/CreateAccount';
import Navbar from './components/Navbar.jsx';
import ChatWidget from './components/chat/ChatWidget.jsx';
import BookingAppointment from './components/BookingAppointment.jsx';
import WorkerOffers from './pages/WorkerOffers.jsx';
import { RequireAuth, GuestOnly } from './components/RouteGuards.jsx';

const STAFF = ['worker', 'admin'];

function AppPrime() {
  return (
    <div>
      <Navbar />
      {/* Outside <Routes>: shown on every page and keeps its state across navigation */}
      <ChatWidget />
      <Routes>
        {/* Public */}
        <Route path="/" element={<HomePagePrime />} />
        <Route path="/find_cars" element={<FindCarsPrime />} />

        {/* Logged out only */}
        <Route path="/login" element={<GuestOnly><Login /></GuestOnly>} />
        <Route path="/register" element={<GuestOnly><CreateAccount /></GuestOnly>} />

        {/* Any logged-in user */}
        <Route path="/profile" element={<RequireAuth><UserProfile /></RequireAuth>} />
        <Route path="/submit_page" element={<RequireAuth><SubmitCar /></RequireAuth>} />
        <Route path="/appointment" element={<RequireAuth><BookingAppointment /></RequireAuth>} />

        {/* Staff only (same roles as backend requireRole) */}
        <Route path="/employee_booking" element={<RequireAuth roles={STAFF}><WorkerAppointments /></RequireAuth>} />
        <Route path="/offers" element={<RequireAuth roles={STAFF}><WorkerOffers /></RequireAuth>} />
      </Routes>
    </div>
  );
}

export default AppPrime;

import { useState } from 'react';

import './index.css';
import SubmitCar from './pages/SubmitCar.jsx';
import Navbar from './components/Navbar.jsx';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Login from './pages/Login.jsx';
import Calendar from './components/BookingAppointment.jsx';
import CreateAccount from './pages/CreateAccount';
import PriceEstimateDisplay from './components/PriceEstimateDisplay';
import BookingAppointment from './components/BookingAppointment.jsx';
import UserProfile from './pages/UserProfile';
import WorkerAppointments from './pages/WorkerAppointments';
import WorkerOffers from './pages/WorkerOffers';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SubmitCar />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/booking" element={<BookingAppointment />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/worker/appointments" element={<WorkerAppointments />} />
        <Route path="/worker/offers" element={<WorkerOffers />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

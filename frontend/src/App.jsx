import { useState } from 'react';
import './index.css';

// Aapke naye components
import UserProfile from './pages/UserProfile.jsx';
import WorkerOffers from './pages/WorkerOffers.jsx';
import WorkerAppointments from './pages/WorkerAppointments.jsx';

function App() {
  const [activeTab, setActiveTab] = useState('offers');

  return (
    <>
      {/* Testing Navigation Bar */}
      <div className="bg-gray-800 text-white p-4 flex justify-center gap-4 shadow-md sticky top-0 z-50">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 rounded-md font-semibold text-sm transition ${
            activeTab === 'profile' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
          }`}
        >
          User Profile
        </button>

        <button
          onClick={() => setActiveTab('offers')}
          className={`px-4 py-2 rounded-md font-semibold text-sm transition ${
            activeTab === 'offers' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
          }`}
        >
          Worker Offers
        </button>

        <button
          onClick={() => setActiveTab('appointments')}
          className={`px-4 py-2 rounded-md font-semibold text-sm transition ${
            activeTab === 'appointments' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
          }`}
        >
          Worker Appointments
        </button>
      </div>

      {/* Selected Page Display */}
      <div>
        {activeTab === 'profile' && <UserProfile />}
        {activeTab === 'offers' && <WorkerOffers />}
        {activeTab === 'appointments' && <WorkerAppointments />}
      </div>
    </>
  );
}

export default App;
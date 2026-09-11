import React, { useState } from 'react';

const initialAppointments = [
  {
    id: 'APT-101',
    sellerName: 'Mikko',
    make: 'Mercedes-Benz',
    model: 'C-Class',
    year: 2023,
    date: '2026-09-15',
    timeSlot: '10:00 AM',
    status: 'Scheduled'
  },
  {
    id: 'APT-102',
    sellerName: 'Sanna',
    make: 'BMW',
    model: '3 Series',
    year: 2021,
    date: '2026-09-16',
    timeSlot: '02:00 PM',
    status: 'Completed'
  },
  {
    id: 'APT-103',
    sellerName: 'Juho',
    make: 'Audi',
    model: 'A4',
    year: 2020,
    date: '2026-09-17',
    timeSlot: '11:30 AM',
    status: 'Cancelled'
  }
];

export default function WorkerAppointments() {
  const [appointments, setAppointments] = useState(initialAppointments);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAptId, setSelectedAptId] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');

  const openRescheduleModal = (apt) => {
    setSelectedAptId(apt.id);
    setNewDate(apt.date);
    setNewTime(apt.timeSlot);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAptId('');
  };

  const handleSaveReschedule = () => {
    const updatedList = appointments.map((apt) => {
      if (apt.id === selectedAptId) {
        return {
          ...apt,
          date: newDate,
          timeSlot: newTime,
          status: 'Scheduled'
        };
      }
      return apt;
    });

    setAppointments(updatedList);
    closeModal();
  };

  const handleStatusChange = (id, newStatus) => {
    const updatedList = appointments.map((apt) => {
      if (apt.id === id) {
        return { ...apt, status: newStatus };
      }
      return apt;
    });

    setAppointments(updatedList);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Worker Appointments</h1>

      <div className="bg-white border rounded-lg overflow-x-auto shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 text-sm font-semibold text-gray-700 border-b">
            <tr>
              <th className="p-3">Appointment ID</th>
              <th className="p-3">Car Details</th>
              <th className="p-3">Seller Name</th>
              <th className="p-3">Date & Time</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y text-sm">
            {appointments.map((apt) => (
              <tr key={apt.id} className="hover:bg-gray-50">
                <td className="p-3 font-mono">{apt.id}</td>
                <td className="p-3 font-medium">
                  {apt.year} {apt.make} {apt.model}
                </td>
                <td className="p-3">{apt.sellerName}</td>
                <td className="p-3">
                  {apt.date} at {apt.timeSlot}
                </td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      apt.status === 'Scheduled'
                        ? 'bg-blue-100 text-blue-800'
                        : apt.status === 'Completed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {apt.status}
                  </span>
                </td>
                <td className="p-3 text-right space-x-2">
                  <button
                    onClick={() => openRescheduleModal(apt)}
                    disabled={apt.status !== 'Scheduled'}
                    className={`px-3 py-1 text-xs rounded font-medium ${
                      apt.status !== 'Scheduled'
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-yellow-500 text-white hover:bg-yellow-600'
                    }`}
                  >
                    Reschedule
                  </button>

                  <button
                    onClick={() => handleStatusChange(apt.id, 'Completed')}
                    disabled={apt.status !== 'Scheduled'}
                    className={`px-3 py-1 text-xs rounded font-medium ${
                      apt.status !== 'Scheduled'
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    Complete
                  </button>

                  <button
                    onClick={() => handleStatusChange(apt.id, 'Cancelled')}
                    disabled={apt.status !== 'Scheduled'}
                    className={`px-3 py-1 text-xs rounded font-medium ${
                      apt.status !== 'Scheduled'
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-red-600 text-white hover:bg-red-700'
                    }`}
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg border">
            <h2 className="text-lg font-bold mb-4">Reschedule Appointment</h2>
            <p className="text-sm text-gray-600 mb-4">
              Editing Appointment ID: <strong>{selectedAptId}</strong>
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">New Date</label>
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full border p-2 rounded text-sm"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">New Time Slot</label>
              <input
                type="text"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="w-full border p-2 rounded text-sm"
                placeholder="e.g. 03:00 PM"
              />
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveReschedule}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

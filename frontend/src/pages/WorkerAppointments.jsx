import React, { useState } from 'react';

const initialAppointments = [
  {
    id: 'APT-301',
    sellerName: 'Mikko ',
    phone: '+358 40 123 4567',
    carModel: '2022 Mercedes-Benz C-Class',
    date: '2026-09-10',
    timeSlot: '09:00 - 11:00',
    status: 'Scheduled',
    location: 'Autotori Helsinki Hub'
  },
  {
    id: 'APT-302',
    sellerName: 'Sanna ',
    phone: '+358 45 987 6543',
    carModel: '2021 BMW 3 Series',
    date: '2026-09-10',
    timeSlot: '11:00 - 13:00',
    status: 'Completed',
    location: 'Autotori Espoo Hub'
  },
  {
    id: 'APT-303',
    sellerName: 'Juho  ',
    phone: '+358 50 555 1234',
    carModel: '2020 Audi A4',
    date: '2026-09-11',
    timeSlot: '13:00 - 15:00',
    status: 'Cancelled',                                                                        
    location: 'Autotori Vantaa Hub'
  }
];

const availableSlots = [
  '09:00 - 11:00',
  '11:00 - 13:00',
  '13:00 - 15:00',
  '15:00 - 17:00'
];

export default function WorkerAppointments() {
  const [appointments, setAppointments] = useState(initialAppointments);
  const [editingApt, setEditingApt] = useState(null);
  const [newDate, setNewDate] = useState('');
  const [newSlot, setNewSlot] = useState('');

  const handleCancel = (id) => {
    setAppointments(prev =>
      prev.map(item => item.id === id ? { ...item, status: 'Cancelled' } : item)
    );
  };

  const handleOpenEdit = (apt) => {
    setEditingApt(apt);
    setNewDate(apt.date);
    setNewSlot(apt.timeSlot);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingApt) return;

    setAppointments(prev =>
      prev.map(item =>
        item.id === editingApt.id
          ? { ...item, date: newDate, timeSlot: newSlot, status: 'Rescheduled' }
          : item
      )
    );
    setEditingApt(null);
  };

  const getBadgeStyle = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Rescheduled':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Cancelled':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      default:
        return 'bg-amber-100 text-amber-800 border-amber-300';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Inspection Appointments</h1>
            <p className="text-sm text-gray-500">Manage in-person car valuation schedules</p>
          </div>
          <span className="text-xs bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200 font-medium">
            Shift Hours: 09:00 - 17:00 (Mon - Fri)
          </span>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100/75 text-gray-600 text-xs font-semibold uppercase tracking-wider border-b border-gray-200">
                  <th className="p-4">Appt ID</th>
                  <th className="p-4">Seller & Contact</th>
                  <th className="p-4">Car Model</th>
                  <th className="p-4">Date & Time Slot</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-sm">
                {appointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-gray-50/80 transition">
                    <td className="p-4 font-mono font-semibold text-gray-700">{apt.id}</td>
                    <td className="p-4">
                      <div className="font-semibold text-gray-900">{apt.sellerName}</div>
                      <div className="text-xs text-gray-500">{apt.phone}</div>
                    </td>
                    <td className="p-4 text-gray-800">{apt.carModel}</td>
                    <td className="p-4">
                      <div className="font-medium text-gray-900">{apt.date}</div>
                      <div className="text-xs text-blue-600 font-medium">{apt.timeSlot}</div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-full border ${getBadgeStyle(apt.status)}`}>
                        {apt.status}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(apt)}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs px-3 py-1.5 rounded-md font-medium border border-gray-300 transition"
                      >
                        Reschedule
                      </button>
                      {apt.status !== 'Cancelled' && (
                        <button
                          onClick={() => handleCancel(apt.id)}
                          className="bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs px-3 py-1.5 rounded-md font-medium border border-rose-200 transition"
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {editingApt && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl border border-gray-200 max-w-md w-full p-6 space-y-4">
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <h3 className="text-lg font-bold text-gray-900">Reschedule - {editingApt.id}</h3>
                <button onClick={() => setEditingApt(null)} className="text-gray-400 hover:text-gray-600 font-bold">✕</button>
              </div>

              <form onSubmit={handleSaveEdit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Select Date</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    required
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Select 2-Hour Slot (9am - 5pm)</label>
                  <select
                    value={newSlot}
                    onChange={(e) => setNewSlot(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    {availableSlots.map(slot => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setEditingApt(null)}
                    className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

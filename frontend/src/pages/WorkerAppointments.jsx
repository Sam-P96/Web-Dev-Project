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
    location: 'Autotori Helsinki Hub',
  },
  {
    id: 'APT-302',
    sellerName: 'Sanna ',
    phone: '+358 45 987 6543',
    carModel: '2021 BMW 3 Series',
    date: '2026-09-10',
    timeSlot: '11:00 - 13:00',
    status: 'Completed',
    location: 'Autotori Espoo Hub',
  },
  {
    id: 'APT-303',
    sellerName: 'Juho  ',
    phone: '+358 50 555 1234',
    carModel: '2020 Audi A4',
    date: '2026-09-11',
    timeSlot: '13:00 - 15:00',
    status: 'Cancelled',
    location: 'Autotori Vantaa Hub',
  },
];

const availableSlots = ['09:00 - 11:00', '11:00 - 13:00', '13:00 - 15:00', '15:00 - 17:00'];

export default function WorkerAppointments() {
  const [appointments, setAppointments] = useState(initialAppointments);
  const [editingApt, setEditingApt] = useState(null);
  const [newDate, setNewDate] = useState('');
  const [newSlot, setNewSlot] = useState('');

  const handleCancel = (id) => {
    setAppointments((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'Cancelled' } : item)),
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

    setAppointments((prev) =>
      prev.map((item) =>
        item.id === editingApt.id
          ? {
              ...item,
              date: newDate,
              timeSlot: newSlot,
              status: 'Rescheduled',
            }
          : item,
      ),
    );

    setEditingApt(null);
  };

  const getBadgeStyle = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';

      case 'Rescheduled':
        return 'bg-blue-50 text-blue-700 border-blue-200';

      case 'Cancelled':
        return 'bg-rose-50 text-rose-700 border-rose-200';

      default:
        return 'bg-amber-50 text-amber-700 border-amber-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="bg-white p-6 rounded-xl border border-[#d8dcd8] shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <p className="text-sm font-semibold text-[#2f9449] mb-2">WORKER DASHBOARD</p>

            <h1 className="text-3xl font-bold text-[#151815]">Inspection Appointments</h1>

            <p className="text-sm text-[#4c524e] mt-1">Manage in-person car valuation schedules</p>
          </div>

          <span className="text-xs bg-[#f4f6f4] text-[#4c524e] px-3 py-1.5 rounded-[7px] border border-[#d8dcd8] font-semibold">
            Shift Hours: 09:00 - 17:00 (Mon - Fri)
          </span>
        </div>

        {/* APPOINTMENTS TABLE */}
        <div className="bg-white rounded-xl border border-[#d8dcd8] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f4f6f4] text-[#4c524e] text-xs font-bold uppercase tracking-wider border-b border-[#d8dcd8]">
                  <th className="p-4">Appt ID</th>
                  <th className="p-4">Seller & Contact</th>
                  <th className="p-4">Car Model</th>
                  <th className="p-4">Date & Time Slot</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#e8eae7] text-sm">
                {appointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-[#f8faf8] transition">
                    <td className="p-4 font-mono font-semibold text-[#4c524e]">{apt.id}</td>

                    <td className="p-4">
                      <div className="font-semibold text-[#151815]">{apt.sellerName}</div>

                      <div className="text-xs text-[#6b716d]">{apt.phone}</div>
                    </td>

                    <td className="p-4 text-[#151815]">{apt.carModel}</td>

                    <td className="p-4">
                      <div className="font-semibold text-[#151815]">{apt.date}</div>

                      <div className="text-xs text-[#247f3d] font-semibold">{apt.timeSlot}</div>
                    </td>

                    <td className="p-4">
                      <span
                        className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-full border ${getBadgeStyle(
                          apt.status,
                        )}`}
                      >
                        {apt.status}
                      </span>
                    </td>

                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(apt)}
                        className="bg-white hover:bg-[#f4f6f4] text-[#247f3d] text-xs px-3 py-1.5 rounded-[7px] font-semibold border border-[#d8dcd8] transition"
                      >
                        Reschedule
                      </button>

                      {apt.status !== 'Cancelled' && (
                        <button
                          onClick={() => handleCancel(apt.id)}
                          className="bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs px-3 py-1.5 rounded-[7px] font-semibold border border-rose-200 transition"
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

        {/* RESCHEDULE MODAL */}
        {editingApt && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl border border-[#d8dcd8] max-w-md w-full p-6 space-y-4">
              <div className="flex justify-between items-center border-b border-[#e8eae7] pb-3">
                <h3 className="text-lg font-bold text-[#151815]">Reschedule - {editingApt.id}</h3>

                <button
                  onClick={() => setEditingApt(null)}
                  className="text-[#6b716d] hover:text-[#151815] font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold mb-2">Select Date</label>

                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    required
                    className="w-full h-12 p-4 border border-[#d8dcd8] rounded-[7px] outline-none text-sm bg-white focus:border-[#247f3d] focus:shadow-[0_0_0_3px_rgba(36,127,61,0.1)]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2">
                    Select 2-Hour Slot (9am - 5pm)
                  </label>

                  <select
                    value={newSlot}
                    onChange={(e) => setNewSlot(e.target.value)}
                    className="w-full h-12 px-4 border border-[#d8dcd8] rounded-[7px] outline-none text-sm bg-white focus:border-[#247f3d] focus:shadow-[0_0_0_3px_rgba(36,127,61,0.1)]"
                  >
                    {availableSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-[#e8eae7]">
                  <button
                    type="button"
                    onClick={() => setEditingApt(null)}
                    className="px-4 py-2 text-sm font-semibold text-[#4c524e] hover:bg-[#f4f6f4] rounded-[7px] transition"
                  >
                    Close
                  </button>

                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-bold text-white bg-[#247f3d] hover:bg-[#1b6730] rounded-[7px] shadow-sm transition"
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

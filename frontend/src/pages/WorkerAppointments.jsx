import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/authContext';
import { getAppointmentsByWorker, updateAppointment } from '@/api/appointmentApi';
import { errorMessage } from '@/api/client';

// const initialAppointments = [
//   {
//     id: 'APT-101',
//     sellerName: 'Mikko',
//     make: 'Mercedes-Benz',
//     model: 'C-Class',
//     year: 2023,
//     date: '2026-09-15',
//     timeSlot: '10:00 AM',
//     status: 'Scheduled'
//   }
// ];

// Trang thai con "song" -> worker con duoc thao tac
const isActive = (s) => s === 'booked' || s === 'confirmed';

//ADAPTER
const pad = (n) => String(n).padStart(2, '0');

// Tach 1 Date ISO thanh 2 field hop voi <input type="date"> va <input type="time">
const splitDateTime = (iso) => {
  const d = new Date(iso);
  return {
    date: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`, // yyyy-mm-dd
    timeSlot: `${pad(d.getHours())}:${pad(d.getMinutes())}`,                  // HH:mm
  };
};

const toRow = (a) => {
  return {
    id: a._id,
    sellerName: a.seller?.name ?? '—',
    make: a.car?.make ?? '',
    model: a.car?.model ?? '',
    year: a.car?.year ?? '',
    ...splitDateTime(a.scheduledAt),
    status: a.status,
  };
};

// PUT tra ve document KHONG populate (findByIdAndUpdate) nen chi merge field thay doi,
// giu lai sellerName / car cua dong cu.
const mergeRow = (row, updated) => ({
  ...row,
  ...splitDateTime(updated.scheduledAt),
  status: updated.status,
});


export default function WorkerAppointments() {

  // Route is staff-only (RequireAuth), so user is always set here
  const workerId = useAuth().user._id;

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!workerId) {
      setLoading(false);
      return

    }   
    const ctrl = new AbortController();
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const { ok, status, data } = await getAppointmentsByWorker(workerId, {
          signal: ctrl.signal,
        });
        if (!ok) throw new Error(errorMessage(data, `HTTP ${status}`));

        setAppointments(data.map(toRow));
      } catch (e) {
        if (e.name !== 'AbortError') setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
    return () => ctrl.abort();
  }, [workerId]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAptId, setSelectedAptId] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');

  // id cua dong dang goi PUT -> de disable nut, tranh double click
  const [savingId, setSavingId] = useState(null);
  const [actionError, setActionError] = useState(null);

  // PUT /appointments/:id , body chi chua field can doi
  const patchAppointment = async (id, body) => {
    setSavingId(id);
    setActionError(null);
    try {
      const { ok, status, data: updated } = await updateAppointment(id, body);
      if (!ok) throw new Error(errorMessage(updated, `HTTP ${status}`));

      setAppointments((prev) =>
        prev.map((apt) => (apt.id === id ? mergeRow(apt, updated) : apt))
      );
      return true;
    } catch (e) {
      setActionError(e.message);
      return false;
    } finally {
      setSavingId(null);
    }
  };

  const openRescheduleModal = (apt) => {
    setSelectedAptId(apt.id);
    setNewDate(apt.date);
    setNewTime(apt.timeSlot);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAptId('');
    setActionError(null);
  };

  const handleSaveReschedule = async () => {
    if (!newDate || !newTime) {
      setActionError('Vui long chon ca ngay va gio');
      return;
    }

    // `${yyyy-mm-dd}T${HH:mm}` khong co Z -> parse theo gio dia phuong,
    // khop voi cach splitDateTime doc nguoc lai
    const scheduledAt = new Date(`${newDate}T${newTime}`);
    if (Number.isNaN(scheduledAt.getTime())) {
      setActionError('Ngay gio khong hop le');
      return;
    }

    const ok = await patchAppointment(selectedAptId, {
      scheduledAt: scheduledAt.toISOString(),
    });

    if (ok) closeModal();
  };

  const handleStatusChange = (id, newStatus) => {
    return patchAppointment(id, { status: newStatus });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Worker Appointments</h1>

      {loading && <p className="mb-3 text-sm text-gray-500">Loading…</p>}
      {error && (
        <p className="mb-3 text-sm text-red-600">Lỗi tải dữ liệu: {error}</p>
      )}
      {actionError && !isModalOpen && (
        <p className="mb-3 text-sm text-red-600">Cập nhật thất bại: {actionError}</p>
      )}
      {!loading && !error && appointments.length === 0 && (
        <p className="mb-3 text-sm text-gray-500">Chưa có lịch hẹn nào.</p>
      )}

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
            {appointments.map((apt) => {
              const busy = savingId === apt.id;
              const locked = !isActive(apt.status) || busy;

              return (
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
                    className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${
                      isActive(apt.status)
                        ? 'bg-blue-100 text-blue-800'
                        : apt.status === 'completed'
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
                    disabled={locked}
                    className={`px-3 py-1 text-xs rounded font-medium ${
                      locked
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-yellow-500 text-white hover:bg-yellow-600'
                    }`}
                  >
                    Reschedule
                  </button>

                  <button
                    onClick={() => handleStatusChange(apt.id, 'completed')}
                    disabled={locked}
                    className={`px-3 py-1 text-xs rounded font-medium ${
                      locked
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {busy ? 'Saving…' : 'Complete'}
                  </button>

                  <button
                    onClick={() => handleStatusChange(apt.id, 'cancelled')}
                    disabled={locked}
                    className={`px-3 py-1 text-xs rounded font-medium ${
                      locked
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-red-600 text-white hover:bg-red-700'
                    }`}
                  >
                    Cancel
                  </button>
                </td>
              </tr>
              );
            })}
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
                type="time"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="w-full border p-2 rounded text-sm"
              />
            </div>

            {actionError && (
              <p className="mb-2 text-sm text-red-600">{actionError}</p>
            )}

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={closeModal}
                disabled={savingId === selectedAptId}
                className="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveReschedule}
                disabled={savingId === selectedAptId}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {savingId === selectedAptId ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

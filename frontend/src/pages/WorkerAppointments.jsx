import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/authContext';
import { getAllAppointments, updateAppointment } from '@/api/appointmentApi';
import { errorMessage } from '@/api/client';
import { getAllUsers } from '@/api/userApi';

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



// Appointment is still "active" -> the worker can still act on it
const isActive = (s) => s === 'booked' || s === 'confirmed';

//ADAPTER
const pad = (n) => String(n).padStart(2, '0');

// Split an ISO date into the 2 fields used by <input type="date"> and <input type="time">
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
    worker: a.worker ?? null,
  };
};

// PUT returns an UNPOPULATED document (findByIdAndUpdate), so only merge the changed fields
// and keep sellerName / car from the existing row.
const mergeRow = (row, updated) => ({
  ...row,
  ...splitDateTime(updated.scheduledAt),
  status: updated.status,
  worker: updated.worker ?? null,
});


export default function WorkerAppointments() {

  const [showPast, setShowPast] = useState(false);

  // users with role "worker", for the Assigned To dropdown
  const [workers, setWorkers] = useState([]);

  // false = only "my" (the user if they are the worker) appointments (default), true = everyone's
  const [showAll, setShowAll] = useState(false);

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
        const { ok, status, data } = await getAllAppointments({
          signal: ctrl.signal,
        });
        if (!ok) throw new Error(errorMessage(data, `HTTP ${status}`));

        setAppointments(data.map(toRow));
        // Load users for the dropdown
        const users = await getAllUsers({ signal: ctrl.signal });
        if (users.ok) {
          setWorkers(users.data.filter((u) => u.role === 'worker'));
        }
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

  // id of the row being saved -> disable its buttons to prevent double clicks
  const [savingId, setSavingId] = useState(null);
  const [actionError, setActionError] = useState(null);

  // PUT /appointments/:id, body only contains the fields to change
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
      setActionError('Please choose both a date and a time');
      return;
    }

    // `${yyyy-mm-dd}T${HH:mm}` has no Z -> parsed as local time,
    // matching how splitDateTime reads it back
    const scheduledAt = new Date(`${newDate}T${newTime}`);
    if (Number.isNaN(scheduledAt.getTime())) {
      setActionError('Invalid date or time');
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

  // here so that if we dont assign a wroker, its gonna be set to null.
  const handleWorkerChange = (id, newWorker) => {
    return patchAppointment(id, { worker: newWorker || null });
  };


  // based on the toggle, it shows either all or only the user(worker)'s stuff
  const visibleAppointments = showAll
    ? appointments
    : appointments.filter((apt) => apt.worker === workerId);

  const today = splitDateTime(new Date()).date;

  // toggle past and future appointments
  const shownAppointments = visibleAppointments.filter((apt) =>
    showPast ? apt.date < today : apt.date >= today
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-[#151815] mb-5">Worker Appointments</h1>
      <button
        onClick={() => setShowAll(!showAll)}
        className="mb-5 cursor-pointer rounded-[7px] border border-[#d8dcd8] bg-white px-4 py-2 text-sm font-semibold text-[#151815] transition hover:border-[#247f3d] hover:text-[#247f3d]"
      >
        {showAll ? 'Show only my appointments' : 'Show all appointments'}
      </button>
      <button
        onClick={() => setShowPast(!showPast)}
        className="mb-5 ml-2 cursor-pointer rounded-[7px] border border-[#d8dcd8] bg-white px-4 py-2 text-sm font-semibold text-[#151815] transition hover:border-[#247f3d] hover:text-[#247f3d]"
      >
        {showPast ? 'Show upcoming appointments' : 'Show past appointments'}
      </button>

      {loading && <p className="mb-3 text-sm text-[#6b716d]">Loading…</p>}
      {error && (
        <p className="mb-3 text-sm text-rose-600">Failed to load appointments: {error}</p>
      )}
      {actionError && !isModalOpen && (
        <p className="mb-3 text-sm text-rose-600">Update failed: {actionError}</p>
      )}
      {!loading && !error && shownAppointments.length === 0 && (
        <p className="mb-3 text-sm text-[#6b716d]">No appointments yet.</p>
      )}

      <div className="bg-white border border-[#d8dcd8] rounded-xl overflow-x-auto shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#f4f6f4] text-xs font-bold uppercase tracking-wider text-[#4c524e] border-b border-[#d8dcd8]">
            <tr>
              <th className="p-4 whitespace-nowrap">Appointment ID</th>
              <th className="p-4 whitespace-nowrap">Car Details</th>
              <th className="p-4 whitespace-nowrap">Seller Name</th>
              <th className="p-4 whitespace-nowrap">Date & Time</th>
              <th className="p-4 whitespace-nowrap">Status</th>
              <th className="p-4 whitespace-nowrap">Assigned To</th>
              <th className="p-4 whitespace-nowrap text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e8eae7] text-sm">
            {shownAppointments.map((apt) => {
              const busy = savingId === apt.id;
              const locked = !isActive(apt.status) || busy;

              return (
                <tr key={apt.id} className="hover:bg-[#f8faf8] transition">
                  <td className="p-4 font-mono text-xs text-[#4c524e]">{apt.id}</td>
                  <td className="p-4 font-semibold text-[#151815] whitespace-nowrap">
                    {apt.year} {apt.make} {apt.model}
                  </td>
                  <td className="p-4 text-[#151815] whitespace-nowrap">{apt.sellerName}</td>
                  <td className="p-4 text-[#151815] whitespace-nowrap">
                    {apt.date} at {apt.timeSlot}
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full border text-xs font-semibold capitalize ${isActive(apt.status)
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : apt.status === 'completed'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}
                    >
                      {apt.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <select
                      value={apt.worker ?? ''}
                      onChange={(e) => handleWorkerChange(apt.id, e.target.value)}
                      disabled={busy}
                      className="h-9 cursor-pointer rounded-[7px] border border-[#d8dcd8] bg-white px-2 text-sm text-[#151815] outline-none focus:border-[#247f3d] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Unassigned</option>
                      {workers.map((w) => (
                        <option key={w._id} value={w._id}>
                          {w.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-4 text-right whitespace-nowrap space-x-2">
                    <button
                      onClick={() => openRescheduleModal(apt)}
                      disabled={locked}
                      className={`px-3 py-1.5 text-xs rounded-[7px] border font-bold transition ${locked
                        ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                        : 'bg-amber-500 text-white border-amber-500 hover:bg-amber-600 cursor-pointer'
                        }`}
                    >
                      Reschedule
                    </button>

                    <button
                      onClick={() => handleStatusChange(apt.id, 'completed')}
                      disabled={locked}
                      className={`px-3 py-1.5 text-xs rounded-[7px] border font-bold transition ${locked
                        ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                        : 'bg-[#247f3d] text-white border-[#247f3d] hover:bg-[#1b6730] cursor-pointer'
                        }`}
                    >
                      {busy ? 'Saving…' : 'Complete'}
                    </button>

                    <button
                      onClick={() => handleStatusChange(apt.id, 'cancelled')}
                      disabled={locked}
                      className={`px-3 py-1.5 text-xs rounded-[7px] border font-bold transition ${locked
                        ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                        : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100 cursor-pointer'
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
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl border border-[#d8dcd8]">
            <h2 className="text-lg font-bold text-[#151815] mb-4">Reschedule Appointment</h2>
            <p className="text-sm text-[#4c524e] mb-4">
              Editing Appointment ID: <strong>{selectedAptId}</strong>
            </p>

            <div className="mb-4">
              <label className="block text-sm font-bold text-[#151815] mb-1.5">New Date</label>
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full h-11 rounded-[7px] border border-[#d8dcd8] bg-white px-3 text-sm outline-none focus:border-[#247f3d] focus:shadow-[0_0_0_3px_rgba(36,127,61,0.1)]"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-bold text-[#151815] mb-1.5">New Time Slot</label>
              <input
                type="time"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="w-full h-11 rounded-[7px] border border-[#d8dcd8] bg-white px-3 text-sm outline-none focus:border-[#247f3d] focus:shadow-[0_0_0_3px_rgba(36,127,61,0.1)]"
              />
            </div>

            {actionError && (
              <p className="mb-2 text-sm text-rose-600">{actionError}</p>
            )}

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={closeModal}
                disabled={savingId === selectedAptId}
                className="cursor-pointer px-4 py-2 text-sm font-semibold rounded-[7px] border border-[#d8dcd8] bg-white text-[#151815] hover:bg-[#f4f6f4] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveReschedule}
                disabled={savingId === selectedAptId}
                className="cursor-pointer px-4 py-2 text-sm font-bold rounded-[7px] bg-[#247f3d] text-white hover:bg-[#1b6730] disabled:cursor-not-allowed disabled:opacity-50"
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
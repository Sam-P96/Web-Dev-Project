import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { createAppointment } from "../api/appointmentApi";

const BookingAppointment = ({ importSeller, importCarId }) => {
  //we can take the slots as the props, then filter this availableSlots=availableSlots.filter

  const availableSlots = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "01:00 PM",
    "02:30 PM",
    "04:00 PM",
  ];

  // Original useState declerations
  const [selectDate, setSelectDate] = useState("");
  const [selectTime, setSelectTime] = useState("");
  const [selectService, setSelectService] = useState("");

  // new useState declerations
  const { carId } = useParams();
  const [car, setCar] = useState(importCarId || carId);
  // const [seller, setSeller] = useState(importSeller);
  // placeholder SELLER
  const [seller, setSeller] = useState("6aba7e356af774660cbf46ff");
  // for worker, lets fetch the worker with the least numnber of appointments then automatically assign
  // this might throw an error, I mightve planned for this to be an ID, this is a placeholder for now.
  const [worker, setWorker] = useState("6aba7e356af774660cbf46ff");
  const [scheduledAt, setScheduledAt] = useState(null);
  const [location, setLocation] = useState("Helsinki");
  const [notes, setNotes] = useState("No Notes");
  const [status, setStatus] = useState("booked");

  // to transform the original imput into scheduledAt
  const toScheduledAt = (date, time) => {
    const [clock, period] = time.split(" "); // "02:30", "PM"
    let [hours, minutes] = clock.split(":").map(Number); // 2, 30

    if (period === "PM" && hours !== 12) hours += 12; // 2 PM → 14
    if (period === "AM" && hours === 12) hours = 0; // 12 AM → 0

    const [year, month, day] = date.split("-").map(Number);
    return new Date(year, month - 1, day, hours, minutes); // months are 0-based
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!scheduledAt) {
      alert("Please pick a date and time");
      return;
    }

    const appointmentData = {
      car,
      seller,
      worker,
      scheduledAt,
      location,
      notes,
      status,
    };

    try {
      const { ok, data } = await createAppointment(appointmentData);

      if (!ok) {
        console.error("Booking failed:", data);
        alert("Booking failed, check the console");
        return;
      }

      console.log("Booked:", data);
      alert("Appointment booked!");
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  return (
    <div>
      <div className="mx-auto max-w-md relative overflow-hidden rounded-[14px] border border-[#388e3c]/20 bg-linear-to-b from-[#1b3d24] via-[#152e1c] to-[#0f2013] p-6 text-white shadow-xl m-5">
        <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[#2f9449]/20 blur-2xl" />

        <div className="relative z-10 border-b border-white/10 pb-4">
          <span className="text-3 font-semibold uppercase tracking-wider text-[#a3e635]">
            Booking Appointment
          </span>
        </div>

        <div className="relative z-10 my-5 grid grid-cols-2 gap-2">
          <button
            type="button"
            value={selectService}
            onClick={() => setSelectService("inspection")}
            className={`rounded-xl border p-3 text-left transition duration-200 ${
              selectService === "inspection"
                ? "border-[#a3e635] bg-white/10 text-white"
                : "border-white/10 bg-black/20 text-white/60 hover:bg-white/5"
            }`}
          >
            <div className="text-3.25 font-bold">Vehicle Inspection</div>
          </button>

          <button
            type="button"
            value={selectService}
            onClick={() => setSelectService("test-drive")}
            className={`rounded-xl border p-3 text-left transition duration-200 ${
              selectService === "test-drive"
                ? "border-[#a3e635] bg-white/10 text-white"
                : "border-white/10 bg-black/20 text-white/60 hover:bg-white/5"
            }`}
          >
            <div className="text-3.25 font-bold">Test Drive</div>
          </button>
        </div>

        {/* DATE INPUT & TIME SLOT GRID */}
        <div className="relative z-10 my-5 space-y-4 rounded-xl border border-white/10 bg-black/20 p-4 backdrop-blur-md">
          <div>
            <label className="mb-1.5 block text-2.75 font-semibold uppercase tracking-wider text-white/70">
              Select Date
            </label>
            <input
              type="date"
              value={selectDate}
              onChange={(e) => {
                setSelectDate(e.target.value);
                if (selectTime) {
                  setScheduledAt(
                    toScheduledAt(e.target.value, selectTime).toISOString(),
                  );
                }
              }}
              className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-3.5 text-white outline-none focus:border-[#a3e635]"
            />
          </div>

          <div>
            <label className="mb-2 block text-2.75 font-semibold uppercase tracking-wider text-white/70">
              Available Time Slots
            </label>
            <div className="grid grid-cols-3 gap-2">
              {availableSlots.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  value={selectTime}
                  onClick={() => {
                    setSelectTime(slot);
                    if (selectDate) {
                      setScheduledAt(
                        toScheduledAt(selectDate, slot).toISOString(),
                      );
                    }
                  }}
                  className={`rounded-lg py-2 text-3 font-semibold transition duration-200 ${
                    selectTime === slot
                      ? "bg-[#a3e635] text-[#0f2013] shadow-[0_0_12px_rgba(163,230,53,0.4)]"
                      : "border border-white/10 bg-white/5 text-white/80 hover:bg-white/10"
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          className="relative z-10 w-full rounded-xl bg-[#247f3d] py-3.5 text-3.5 font-bold text-white transition duration-200 hover:bg-[#1b6730] shadow-lg"
        >
          Confirm Booking for {selectTime} →
        </button>
      </div>
    </div>
  );
};

export default BookingAppointment;

import React, { useState } from 'react';

const BookingAppointment = () => {
  //we can take the slots as the props, then filter this availableSlots=availableSlots.filter

  const availableSlots = [
    '09:00 AM',
    '10:00 AM',
    '11:00 AM',
    '01:00 PM',
    '02:30 PM',
    '04:00 PM',
  ];
  const [selectDate, setSelectDate] = useState('');
  const [selectTime, setSelectTime] = useState('');
  const [selectService, setSelectService] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const values = {
      selectDate,
      selectTime,
      selectService,
    };
    console.log(values);
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
            onClick={() => setSelectService('inspection')}
            className={`rounded-xl border p-3 text-left transition duration-200 ${
              selectService === 'inspection'
                ? 'border-[#a3e635] bg-white/10 text-white'
                : 'border-white/10 bg-black/20 text-white/60 hover:bg-white/5'
            }`}
          >
            <div className="text-3.25 font-bold">Vehicle Inspection</div>
          </button>

          <button
            type="button"
            value={selectService}
            onClick={() => setSelectService('test-drive')}
            className={`rounded-xl border p-3 text-left transition duration-200 ${
              selectService === 'test-drive'
                ? 'border-[#a3e635] bg-white/10 text-white'
                : 'border-white/10 bg-black/20 text-white/60 hover:bg-white/5'
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
              onChange={(e) => setSelectDate(e.target.value)}
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
                  onClick={() => setSelectTime(slot)}
                  className={`rounded-lg py-2 text-3 font-semibold transition duration-200 ${
                    selectTime === slot
                      ? 'bg-[#a3e635] text-[#0f2013] shadow-[0_0_12px_rgba(163,230,53,0.4)]'
                      : 'border border-white/10 bg-white/5 text-white/80 hover:bg-white/10'
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

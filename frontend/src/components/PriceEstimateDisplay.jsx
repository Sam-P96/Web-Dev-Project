import React from 'react';


// Had claude help me with this, cus I wasnt sure how to make the UI for this. But its all basic stuff we all understand.
const PriceEstimateDisplay = ({ estimate, loading, error }) => {
  if (loading) {
    return (
      <div className="mt-4 rounded-[7px] border border-[#d8dcd8] bg-[#f5f6f4] px-5 py-4">
        <p className="text-sm text-[#777d78]">Estimating your car's value…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-4 rounded-[7px] border border-red-300 bg-red-50 px-5 py-4">
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  if (!estimate) return null;

  return (
    <div className="mt-4 rounded-[7px] border border-[#247f3d] bg-[#eef6f0] px-5 py-5">
      <p className="text-3 font-extrabold tracking-[1.5px] text-[#2f9449]">
        ESTIMATED VALUE
      </p>

      <p className="mt-1 text-4xl font-bold text-[#1b6730]">
        €{estimate.estimatedPrice.toLocaleString('fi-FI')}
      </p>

      {estimate.summary && (
        <p className="mt-2 text-sm text-[#3a423c]">{estimate.summary}</p>
      )}

      <div className="mt-4 border-t border-[#c9e0d1] pt-4">
        <p className="text-sm text-[#3a423c]">
          If your car meets this claim —{' '}
          <span className="font-semibold text-[#1b6730]">{estimate.claim}</span>{' '}
          — we will offer at least{' '}
          <span className="font-bold text-[#1b6730]">
            €{estimate.minimumOffer.toLocaleString('fi-FI')}
          </span>
          .
        </p>

        <p className="mt-3 text-sm font-semibold text-[#303631]">
          Would you like to book an appointment?
        </p>

        <a
          href="https://www.google.com"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-block rounded-[7px] bg-[#247f3d] px-5.5 py-3.25 text-sm font-bold text-white transition duration-200 hover:bg-[#1b6730]"
        >
          Book an Appointment →
        </a>
      </div>
    </div>
  );
};

export default PriceEstimateDisplay ;
import React from 'react';

const SalePage = () => {
  return (
    <div className="min-h-screen bg-[#f4f6f4] p-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
        {/* LEFT COLUMN */}
        <div className="flex flex-col gap-4">
          {/* Title + Price header */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#202522]">Buy Details</h1>
              <p className="text-sm text-[#777d78]">Subtitle</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-extrabold text-[#1f7a38]">Price</p>
              <p className="text-sm text-[#238636]">Monthly price</p>
            </div>
          </div>

          {/* Meta row: updated date, location, id */}
          <div className="flex items-center justify-between text-sm text-[#777d78] border-b border-[#e3e6e2] pb-3">
            <span>Updated date • Location</span>
            <span>ID</span>
          </div>

          {/* Main image */}
          <div className="relative w-full h-96 bg-[#e8eae7] rounded-[14px] overflow-hidden">
            <img src="unknown" className="w-full h-full object-cover" />
          </div>

          {/* Details / description section */}
          <div className="bg-white border border-[#e3e6e2] rounded-[14px] p-5 mt-2">
            <h2 className="text-lg font-bold text-[#202522] mb-2">Details</h2>
            <p className="text-sm text-[#777d78]">Description text</p>
          </div>
        </div>

        {/* RIGHT COLUMN — Seller card */}
        <aside className="flex flex-col gap-4">
          <div className="bg-white border border-[#e3e6e2] rounded-[14px] p-5">
            <h3 className="text-base font-bold text-[#202522] mb-1">Seller</h3>
            <p className="text-sm text-[#777d78] mb-3">Seller type • Member since 2006</p>

            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-[#e8eae7] rounded-[6px]" />
              <strong className="text-sm text-[#202522]">Seller name</strong>
            </div>

            <p className="text-sm text-[#777d78] mb-1">Address line 1</p>
            <p className="text-sm text-[#777d78] mb-4">Address line 2</p>

            <div className="border-t border-[#e8ebe8] pt-4 flex flex-col gap-2 text-sm font-bold text-[#1f7a38]">
              <a href="#" className="hover:text-[#238636]">
                Email : JohnDoe@gmail.com
              </a>
              <a href="#" className="hover:text-[#238636]">
                Contact Info: +358 41 9999999
              </a>
            </div>
          </div>

          {/* Action buttons */}
          <div className="bg-white border border-[#e3e6e2] rounded-[14px] p-5 flex flex-col gap-3">
            <h4 className="text-sm font-bold text-[#202522] mb-1">
              Agent Contact: i think we can put AI here
            </h4>
            <button className="bg-[#1f7a38] text-white font-bold text-sm rounded-[8px] py-2.5 hover:bg-[#238636] transition duration-200">
              Send a message
            </button>
            <button className="bg-[#1f7a38] text-white font-bold text-sm rounded-[8px] py-2.5 hover:bg-[#238636] transition duration-200">
              Show number
            </button>
            <button className="border border-[#1f7a38] text-[#1f7a38] font-bold text-sm rounded-[8px] py-2.5 hover:bg-[#f0f8f1] transition duration-200">
              WhatsApp
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default SalePage;

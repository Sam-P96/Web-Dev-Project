import React from 'react'

const Header = () => {
  return (
    <div>



      <section className="bg-[#202522] text-white px-[6%] py-13.75">

        <div className="max-w-300 mx-auto">
          {/* .section-label — color:#2f9449; font-size:12px; font-weight:800; letter-spacing:1.5px */}
          <p className="text-[#2f9449] text-xs font-extrabold tracking-[1.5px]">
            SELL YOUR CAR
          </p>

          {/* h1 — font-size:38px; margin:5px 0 */}
          <h1 className="text-[38px] font-bold my-1.25">
            List Your Car
          </h1>

          {/* p:last-child — color:#c9cfca */}
          <p className="text-[#c9cfca]">
            Reach thousands of potential buyers across Finland.
          </p>
        </div>
      </section>
    </div>
  )
}

export default Header
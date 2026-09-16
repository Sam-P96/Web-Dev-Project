import React, { useState } from 'react'


const Navbar = () => {
  const [isOpen,setIsOpen]=useState(false)
  return (
    <div><header className="w-full min-h-19 bg-white flex items-center justify-between px-[6%] border-b border-[#e8eae7] gap-8.75 relative">
    <div className="text-[28px] font-extrabold tracking-[2px] text-[#151815]">AutoTori</div>
    <nav className='hidden md:flex items-center gap-6.5 ml-auto '>
      <a href="index.html" className='text-sm font-semibold text-[#4c524e] transition duration-200 ease-in-out whitespace-nowrap hover:text-[#238636]'>Home</a>
      <a href="listings.html"  className="text-sm font-semibold text-[#4c524e] transition duration-200 ease-in-out whitespace-nowrap hover:text-[#238636]">Cars</a>
      <a href="car-form.html" className="text-sm font-semibold text-[#4c524e] transition duration-200 ease-in-out whitespace-nowrap hover:text-[#238636]">Sell Your Car</a>
      <a href="#" className="text-sm font-semibold text-[#4c524e] transition duration-200 ease-in-out whitespace-nowrap hover:text-[#238636]">About Us</a>
      <a href="#" className="text-sm font-semibold text-[#4c524e] transition duration-200 ease-in-out whitespace-nowrap hover:text-[#238636]">Financing</a>
      <a href="#" className="text-sm font-semibold text-[#4c524e] transition duration-200 ease-in-out whitespace-nowrap hover:text-[#238636]">Contact</a>
    </nav>
    <div className="hidden md:flex items-center gap-3.75 shrink-0">
      <select aria-label="Language" className='border-none bg-transparent font-semibold cursor-pointer outline-none'>
        <option>EN</option>
        <option>FI</option>
        <option>SV</option>
      </select>
      <a href="login.html"  className="bg-[#1f7a38] text-white! px-4.5 py-2.5 rounded-[7px] font-bold transition duration-200 ease-in-out hover:bg-[#185f2c]">
        Login
      </a>
    </div>
     <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden flex flex-col justify-center gap-1.25 w-8 h-8"
          aria-label="Toggle menu"
        >
          <span className={`block h-0.5 w-6 bg-[#151815] transition-transform duration-200 ${isOpen ? 'rotate-45 translate-y-1.75' : ''}`} />
          <span className={`block h-0.5 w-6 bg-[#151815] transition-opacity duration-200 ${isOpen ? 'opacity-0' : ''}`} />
          <span className={`block h-0.5 w-6 bg-[#151815] transition-transform duration-200 ${isOpen ? '-rotate-45 -translate-y-1.75' : ''}`} />
        </button>
        {isOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-[#e8eae7] flex flex-col gap-4.5 px-[6%] py-6 shadow-md z-50">
            <a href="" className="text-sm font-semibold text-[#4c524e] transition duration-200 ease-in-out hover:text-[#238636]">
              Home
            </a>
            <a href="listings.html" className="text-sm font-semibold text-[#4c524e] transition duration-200 ease-in-out hover:text-[#238636]">
              Cars
            </a>
            <a href="car-form.html" className="text-sm font-semibold text-[#4c524e] transition duration-200 ease-in-out hover:text-[#238636]">
              Sell Your Car
            </a>
            <a href="#" className="text-sm font-semibold text-[#4c524e] transition duration-200 ease-in-out hover:text-[#238636]">
              About Us
            </a>
            <a href="#" className="text-sm font-semibold text-[#4c524e] transition duration-200 ease-in-out hover:text-[#238636]">
              Financing
            </a>
            <a href="#" className="text-sm font-semibold text-[#4c524e] transition duration-200 ease-in-out hover:text-[#238636]">
              Contact
            </a>

            <div className="flex items-center gap-4 pt-4 border-t border-[#e8eae7]">
              <select aria-label="Language" className="border-none bg-transparent font-semibold cursor-pointer outline-none">
                <option>EN</option>
                <option>FI</option>
                <option>SV</option>
              </select>

              <a
                href="login.html"
                className="bg-[#1f7a38] text-white! px-4.5 py-2.5 rounded-[7px] font-bold transition duration-200 ease-in-out hover:bg-[#185f2c]">
                Login
                </a>
                </div>
                </div>
        )}

  </header></div>
  )
}

export default Navbar
import { Link } from "react-router-dom";
// Heavy use of AI when adding Tailwind

function NavbarPrime() {
  return (
    <header className="w-full min-h-19 bg-white flex items-center justify-between px-[6%] border-b border-[#e8eae7] gap-8.75 relative">
      <div className="text-[28px] font-extrabold tracking-[2px] text-[#151815]">AutoTori</div>
      <nav className="flex items-center gap-6.5 ml-auto">
        <Link to="/" className="text-sm font-semibold text-[#4c524e] transition duration-200 ease-in-out whitespace-nowrap hover:text-[#238636]">
          Home
        </Link>
        <a href="listings.html" className="text-sm font-semibold text-[#4c524e] transition duration-200 ease-in-out whitespace-nowrap hover:text-[#238636]">
          Cars
        </a>
        <Link to="/submit_page" className="text-sm font-semibold text-[#4c524e] transition duration-200 ease-in-out whitespace-nowrap hover:text-[#238636]">
          Sell Your Car
        </Link>
        <Link to="/employee_booking" className="text-sm font-semibold text-[#4c524e] transition duration-200 ease-in-out whitespace-nowrap hover:text-[#238636]">
          Bookings
        </Link>
        <a href="#" className="text-sm font-semibold text-[#4c524e] transition duration-200 ease-in-out whitespace-nowrap hover:text-[#238636]">
          About Us
        </a>
        {/* <a href="#" className="text-sm font-semibold text-[#4c524e] transition duration-200 ease-in-out whitespace-nowrap hover:text-[#238636]">
          Financing
        </a> */}
        <a href="#" className="text-sm font-semibold text-[#4c524e] transition duration-200 ease-in-out whitespace-nowrap hover:text-[#238636]">
          Contact
        </a>
        
        <Link to="/profile" className="text-sm font-semibold text-[#4c524e] transition duration-200 ease-in-out whitespace-nowrap hover:text-[#238636]">
          Account
        </Link>
        
      </nav>
      <div className="flex items-center gap-3.75 shrink-0">
        <select
          aria-label="Language"
          className="border-none bg-transparent font-semibold cursor-pointer outline-none"
        >
          <option>EN</option>
          <option>FI</option>
          <option>SV</option>
        </select>
        <Link
          to="/login"
          className="bg-[#1f7a38] text-white! px-4.5 py-2.5 rounded-[7px] font-bold transition duration-200 ease-in-out hover:bg-[#185f2c]"
        >
          Login
        </Link>
      </div>
    </header>

  )
}

export default NavbarPrime;
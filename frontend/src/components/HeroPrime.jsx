import { Link } from 'react-router-dom';

import heroBg from '../assets/hero.jpg';


function HeroPrime() {
  return (
    <section className="bg-[#202522] text-white px-[6%] py-24 max-[700px]:py-16" style={{ backgroundImage: `url(${heroBg})` }}>
      <div className="max-w-[1200px] mx-auto flex flex-col gap-4">
        <p className="text-[#2f9449] text-xs font-extrabold tracking-[1.5px]">
          YOUR JOURNEY STARTS HERE
        </p>
        <h1 className="text-[52px] font-bold leading-tight max-[700px]:text-[36px]">
          Find Your Perfect Car
        </h1>
        <p className="text-[#c9cfca] text-lg max-w-[520px]">
          Discover quality cars from trusted sellers across Finland.
        </p>
        <div className="flex gap-3.75 mt-4 max-[500px]:flex-col">
          <Link
            to="/find_cars"
            className="bg-[#1f7a38] text-white px-6 py-3.25 rounded-[7px] font-bold text-center transition duration-200 hover:bg-[#185f2c]"
          >
            Browse Cars
          </Link>

          <Link
            to="submit_page"
            className="border border-white/40 text-white px-6 py-3.25 rounded-[7px] font-bold text-center transition duration-200 hover:bg-white hover:text-[#202522]"
          >
            Sell Your Car
          </Link>
        </div>
      </div>
    </section>
  );
}

export default HeroPrime;

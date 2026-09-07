import React from 'react';

const Footer = () => {
  return (
    <footer className="border-t border-[#e8ebe8] bg-[#1a1f1c] pt-12.5 pb-8 text-[#a3aab0]">
      <div className="mx-auto flex max-w-250 flex-wrap justify-between gap-8 px-5 pb-10 max-[700px]:flex-col max-[700px]:gap-6">
        <div className="max-w-70">
          <div className="mb-2.5 text-5.5 font-bold tracking-tight text-white">
            AutoTori
          </div>
          <p className="mb-1.25 text-3.5 leading-relaxed">
            Your trusted marketplace to buy and sell cars.
          </p>
          <p className="text-3.5 leading-relaxed text-[#777d78]">
            Helsinki, Finland
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="mb-1 text-3.5 font-bold tracking-wider text-white uppercase">
            Explore
          </h3>
          <a href="index.html" className="text-3.5 transition duration-200 hover:text-white">
            Home
          </a>
          <a href="listings.html" className="text-3.5 transition duration-200 hover:text-white">
            Cars
          </a>
          <a href="car-form.html" className="text-3.5 transition duration-200 hover:text-white">
            Sell Your Car
          </a>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="mb-1 text-3.5 font-bold tracking-wider text-white uppercase">
            Company
          </h3>
          <a href="#" className="text-3.5 transition duration-200 hover:text-white">
            About Us
          </a>
          <a href="#" className="text-3.5 transition duration-200 hover:text-white">
            Financing
          </a>
          <a href="#" className="text-3.5 transition duration-200 hover:text-white">
            Contact
          </a>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="mb-1 text-3.5 font-bold tracking-wider text-white uppercase">
            Help
          </h3>
          <a href="#" className="text-3.5 transition duration-200 hover:text-white">
            FAQ
          </a>
          <a href="#" className="text-3.5 transition duration-200 hover:text-white">
            Privacy
          </a>
          <a href="#" className="text-3.5 transition duration-200 hover:text-white">
            Terms
          </a>
        </div>
      </div>

      <div className="mx-auto flex max-w-250 flex-row justify-between border-t border-[#2a302c] px-5 pt-6 text-3 max-[700px]:flex-col max-[700px]:gap-2">
        <span>© 2026 AutoTori. All rights reserved.</span>
        <span>Helsinki, Finland</span>
      </div>
    </footer>
  );
};

export default Footer;
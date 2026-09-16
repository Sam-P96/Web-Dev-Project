function FooterPrime() {
  return (
    <footer className="bg-[#202522] text-[#c9cfca]">
      <div className="max-w-[1200px] mx-auto px-[6%] py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="flex flex-col gap-2">
          <div className="text-2xl font-extrabold tracking-[2px] text-white">AUTOTORI</div>
          <p className="text-sm">Your trusted marketplace to buy and sell cars.</p>
          <p className="text-sm">Helsinki, Finland</p>
        </div>
        <div className="flex flex-col gap-2.5">
          <h3 className="text-white text-sm font-bold mb-1">Explore</h3>
          <a href="index.html" className="text-sm transition duration-200 hover:text-[#2f9449]">Home</a>
          <a href="listings.html" className="text-sm transition duration-200 hover:text-[#2f9449]">Cars</a>
          <a href="car-form.html" className="text-sm transition duration-200 hover:text-[#2f9449]">Sell Your Car</a>
        </div>
        <div className="flex flex-col gap-2.5">
          <h3 className="text-white text-sm font-bold mb-1">Company</h3>
          <a href="#" className="text-sm transition duration-200 hover:text-[#2f9449]">About Us</a>
          <a href="#" className="text-sm transition duration-200 hover:text-[#2f9449]">Financing</a>
          <a href="#" className="text-sm transition duration-200 hover:text-[#2f9449]">Contact</a>
        </div>
        <div className="flex flex-col gap-2.5">
          <h3 className="text-white text-sm font-bold mb-1">Help</h3>
          <a href="#" className="text-sm transition duration-200 hover:text-[#2f9449]">FAQ</a>
          <a href="#" className="text-sm transition duration-200 hover:text-[#2f9449]">Privacy</a>
          <a href="#" className="text-sm transition duration-200 hover:text-[#2f9449]">Terms</a>
        </div>
      </div>
      <div className="border-t border-white/10 px-[6%] py-5 flex justify-between text-xs text-[#999f9a] max-[600px]:flex-col max-[600px]:gap-2">
        <span>© 2026 AUTOTORI. All rights reserved.</span>
        <span>Helsinki, Finland</span>
      </div>
    </footer>
  );
}

export default FooterPrime;
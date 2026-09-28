 
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function SearchPrime() {
  const navigate = useNavigate();
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [MaxPrice, setMaxPrice] = useState("");



  return (

    <section className="bg-[#f5f6f4] px-[6%] py-16">
      <div className="max-w-[1200px] mx-auto flex flex-col gap-2 mb-6">
        <p className="text-[#2f9449] text-xs font-extrabold tracking-[1.5px]">
          FIND YOUR CAR
        </p>
        <h2 className="text-[32px] font-bold text-[#202522] max-[700px]:text-[26px]">
          Search Cars
        </h2>
      </div>

      <div className="max-w-[1200px] mx-auto bg-white border border-[#e3e6e2] rounded-[14px] p-6 flex items-end gap-5 max-[800px]:flex-col max-[800px]:items-stretch">
        <div className="flex-1 grid grid-cols-3 gap-5 max-[800px]:grid-cols-1">
          <div>
            <label htmlFor="make" className="mb-1.75 block text-[13px] font-bold text-[#303631]">
              Make
            </label>
            <select
              id="make"
              value={make}
              onChange={(e) => setMake(e.target.value)}
              className="h-11.5 w-full rounded-[7px] border border-[#d8dcd8] bg-white px-3.25 text-sm text-[#202522] outline-none transition duration-200 focus:border-[#247f3d] focus:ring-4 focus:ring-[#247f3d]/10"
            >
              <option>All Makes</option>
              <option>Audi</option>
              <option>BMW</option>
              <option>Mercedes-Benz</option>
              <option>Volvo</option>
              <option>Toyota</option>
              <option>Tesla</option>
            </select>
          </div>

          <div>
            <label htmlFor="model" className="mb-1.75 block text-[13px] font-bold text-[#303631]">
              Model
            </label>
            <select
              id="model"
              value={model}

              onChange={(e) => setModel(e.target.value)}

              className="h-11.5 w-full rounded-[7px] border border-[#d8dcd8] bg-white px-3.25 text-sm text-[#202522] outline-none transition duration-200 focus:border-[#247f3d] focus:ring-4 focus:ring-[#247f3d]/10"
            >
              <option>All Models</option>
              <option>A4</option>
              <option>3 Series</option>
              <option>C-Class</option>
              <option>XC60</option>
              <option>RAV4</option>
              <option>Model 3</option>
            </select>
          </div>

          <div>
            <label htmlFor="price" className="mb-1.75 block text-[13px] font-bold text-[#303631]">
              Price
            </label>
            <select
              id="price"
              className="h-11.5 w-full rounded-[7px] border border-[#d8dcd8] bg-white px-3.25 text-sm text-[#202522] outline-none transition duration-200 focus:border-[#247f3d] focus:ring-4 focus:ring-[#247f3d]/10"
            >
              <option>Any Price</option>
              <option>Under €15,000</option>
              <option>€15,000 - €25,000</option>
              <option>€25,000 - €35,000</option>
              <option>€35,000+</option>
            </select>
          </div>
        </div>
        <Link to="/find_cars" className="h-11.5 flex items-center justify-center px-8 shrink-0 bg-[#1f7a38] text-white rounded-[7px] font-bold transition duration-200 hover:bg-[#185f2c]"
        >
          Search
        </Link>
      </div>
    </section>
  );
}

export default SearchPrime;
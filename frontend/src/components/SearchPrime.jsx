import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SearchPrime() {
  const navigate = useNavigate();
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [MaxPrice, setMaxPrice] = useState("");
  const [yearRange, setYearRange] = useState("");

  const handleSearch = () => {
    let minYear = "";
    let maxYear = "";

    if (yearRange === "2015-2018") {
      minYear = 2015;
      maxYear = 2018;
    } else if (yearRange === "2019-2022") {
      minYear = 2019;
      maxYear = 2022;
    } else if (yearRange === "2023+") {
      minYear = 2023;
    }

    navigate(`/find_cars?make=${make}&model=${model}&maxPrice=${MaxPrice}&minYear=${minYear}&maxYear=${maxYear}`);
  };

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
        <div className="flex-1 grid grid-cols-4 gap-5 max-[800px]:grid-cols-1">
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
              <option value="">All Makes</option>
              <option value="Audi">Audi</option>
              <option value="BMW">BMW</option>
              <option value="Mercedes-Benz">Mercedes-Benz</option>
              <option value="Volvo">Volvo</option>
              <option value="Toyota">Toyota</option>
              <option value="Tesla">Tesla</option>
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
              <option value="">All Models</option>
              <option value="A4">A4</option>
              <option value="3 Series">3 Series</option>
              <option value="C-Class">C-Class</option>
              <option value="XC60">XC60</option>
              <option value="RAV4">RAV4</option>
              <option value="Model 3">Model 3</option>
            </select>
          </div>

          <div>
            <label htmlFor="year" className="mb-1.75 block text-[13px] font-bold text-[#303631]">
              Year
            </label>
            <select
              id="year"
              value={yearRange}
              onChange={(e) => setYearRange(e.target.value)}
              className="h-11.5 w-full rounded-[7px] border border-[#d8dcd8] bg-white px-3.25 text-sm text-[#202522] outline-none transition duration-200 focus:border-[#247f3d] focus:ring-4 focus:ring-[#247f3d]/10"
            >
              <option value="">Any Year</option>
              <option value="2015-2018">2015 - 2018</option>
              <option value="2019-2022">2019 - 2022</option>
              <option value="2023+">2023+</option>
            </select>
          </div>

          <div>
            <label htmlFor="price" className="mb-1.75 block text-[13px] font-bold text-[#303631]">
              Price
            </label>
            <select
              id="price"
              value={MaxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="h-11.5 w-full rounded-[7px] border border-[#d8dcd8] bg-white px-3.25 text-sm text-[#202522] outline-none transition duration-200 focus:border-[#247f3d] focus:ring-4 focus:ring-[#247f3d]/10"
            >
              <option value="">Any Price</option>
              <option value="15000">Under €15,000</option>
              <option value="25000">€15,000 - €25,000</option>
              <option value="35000">€25,000 - €35,000</option>
            </select>
          </div>
        </div>
        <button
          onClick={handleSearch}
          className="h-11.5 flex items-center justify-center px-8 shrink-0 bg-[#1f7a38] text-white rounded-[7px] font-bold transition duration-200 hover:bg-[#185f2c]"
        >
          Search
        </button>
      </div>
    </section>
  );
}

export default SearchPrime;
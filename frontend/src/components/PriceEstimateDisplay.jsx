import React from 'react'

const PriceEstimateDisplay = ({min = 23500, average = 25000, max = 26800}) => {


    const formatEuro = (val) =>
    new Intl.NumberFormat('fi-FI', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(val);


  return (

   <div className=" rounded-[10px] border border-[#e3e6e2] bg-[#f9faf8] p-5 shadow-sm m-8">

      <div className="flex items-center justify-between pb-3.5 border-b border-[#e8ebe8]">
        <div>
          <h3 className="mt-1.5 text-4 font-bold text-[#202522]">
            Estimated Market Value
          </h3>
        </div>
      </div>

      {/* AVERAGE PRICE DISPLAY */}

      <div className="py-4">
        <p className="text-3 font-medium text-[#777d78]">Average Listing Price</p>
        <div className="text-7.5 font-extrabold tracking-tight text-[#247f3d]">
          {formatEuro(average)}
        </div>
      </div>


      {/* ESTIMATED RANGE BAR */}

      <div className="rounded-[8px] border border-[#e8ebe8] bg-white p-3.5">
        <div className="mb-2 flex justify-between text-3 font-semibold text-[#303631]">
          <span>Estimated Range </span>
          <span className='flex justify-between'>{formatEuro(min)}  –  {formatEuro(max)}</span>
        </div>



        <div className="relative h-2 w-full overflow-hidden rounded-full bg-[#e8ebe8]">
          <div className="absolute left-[15%] right-[15%] h-full rounded-full bg-[#247f3d]" />
        </div>
      </div>



      <p className="mt-3 ml-2.5 text-sm text-[#777d78] leading-normal">
        Valuation is calculated based on market data for similar vehicles, condition, and mileage.
      </p>
    </div>
  )
}

export default PriceEstimateDisplay
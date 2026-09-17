import { Link } from "react-router-dom";

function SellCtaPrime() {
    return (
        <section className="bg-[#f5f6f4] px-[6%] py-16 flex items-center justify-between gap-8 max-[700px]:flex-col max-[700px]:items-start">
            <div className="flex flex-col gap-2">
                <p className="text-[#2f9449] text-xs font-extrabold tracking-[1.5px]">SELL YOUR CAR</p>
                <h2 className="text-[32px] font-bold text-[#202522] max-[700px]:text-[26px]">Ready to sell your car?</h2>
                <p className="text-[#777d78]">Reach thousands of potential buyers across Finland.</p>
            </div>
            <Link to="/find_cars" className="bg-[#1f7a38] text-white px-6 py-3.25 rounded-[7px] font-bold text-center transition duration-200 hover:bg-[#185f2c] shrink-0 whitespace-nowrap">
            Sell Your Car →
        </Link>
        </section >

    )
}

export default SellCtaPrime;
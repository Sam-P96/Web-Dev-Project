import { Link } from 'react-router-dom';

function ListCard({ id, image, name, year, km, location, price }) {
  return (
    <article className="bg-white border border-[#e3e6e2] rounded-[14px] overflow-hidden transition duration-200 hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
      <img src={image} alt={name} className="w-full h-47.5 object-cover bg-[#e8eae7]" />
      <div className="p-5 flex flex-col gap-1.5">
        <p className="text-xs text-[#777d78]">
          {year} • {km}
        </p>
        <h3 className="text-lg font-bold text-[#202522]">{name}</h3>
        <span className="text-sm text-[#777d78]">{location}</span>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#e8ebe8]">
          <strong className="text-xl font-extrabold text-[#1f7a38]"> {price}</strong>
          <Link
            to={`/sale-page/${id}`}
            className="text-sm font-bold text-[#202522] transition duration-200 hover:text-[#238636]"
          >
            Details
          </Link>
        </div>
      </div>
    </article>
  );
}

export default ListCard;

import { getCarById, deleteCar } from '@/api/carApi';
import { useAuth } from '@/context/authContext';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const SalePage = () => {
  const { carId } = useParams();
  const [car, setCar] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const result = await getCarById(carId);
        setCar(result);
        console.log(result);
      } catch (error) {
        console.error('Failed to fetch car:', error);
      }
    };
    fetchCar();
  }, [carId]);
  if (!car) return <p>Loading...</p>;

  const isOwner = user?._id === car.client?._id;

  const handleDelete = async () => {
    if (!window.confirm('Delete this car?')) return;

    const result = await deleteCar(carId);
    if (result.ok) {
      alert('Car deleted');
      navigate('/find_cars');
    } else {
      alert('Delete failed, check the console');
      console.log(result.data);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f6f4] p-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
        {/* LEFT COLUMN */}
        <div className="flex flex-col gap-4">
          {/* Title + Price header */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#202522]">Buy Details</h1>
              <p className="text-xl font-extrabold tracking-tight text-[#138f44] transition duration-200 group-hover:text-[#1f7a38]">{`${car.make} ${car.model}`}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-extrabold text-[#1f7a38]"> € {car.price}</p>
              <p className="text-sm text-[#238636]">Monthly Klarna Pay</p>
            </div>
          </div>

          {/* Meta row: updated date, location, id */}
          <div className="flex items-center justify-between text-sm text-[#777d78] border-b border-[#e3e6e2] pb-3">
            <span>
              {car.year} • {car.location}
            </span>
            <span>ID </span>
          </div>

          {/* Main image */}
          <div className="relative w-full h-96 bg-[#e8eae7] rounded-[14px] overflow-hidden">
            <img src={car.image} className="w-full h-full object-cover" />
          </div>

          {/* Details / description section */}
          <div className="bg-white border border-[#e3e6e2] rounded-[14px] p-5 mt-2">
            <h2 className="text-lg font-bold text-[#202522] mb-2">Details</h2>
            <p className="text-sm text-[#777d78]">{car.description}</p>

            <div className="grid grid-cols-2 gap-x-6 gap-y-3 border-t border-[#e8ebe8] mt-4 pt-4 text-sm max-[600px]:grid-cols-1">
              <div className="flex justify-between">
                <span className="text-[#777d78]">Make</span>
                <span className="font-bold text-[#202522]">{car.make}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#777d78]">Model</span>
                <span className="font-bold text-[#202522]">{car.model}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#777d78]">Year</span>
                <span className="font-bold text-[#202522]">{car.year}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#777d78]">Mileage</span>
                <span className="font-bold text-[#202522]">{car.mileage.toLocaleString()} km</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#777d78]">Fuel</span>
                <span className="font-bold text-[#202522]">{car.fuel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#777d78]">Transmission</span>
                <span className="font-bold text-[#202522]">{car.transmission}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#777d78]">Condition</span>
                <span className="font-bold text-[#202522] capitalize">{car.condition}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#777d78]">Location</span>
                <span className="font-bold text-[#202522]">{car.location}</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN — Seller card */}
        <aside className="flex flex-col gap-4">
          <div className="bg-white border border-[#e3e6e2] rounded-[14px] p-5">
            <h3 className="text-base font-bold text-[#202522] mb-1">Seller</h3>
            <p className="text-sm text-[#777d78] mb-3">Seller type • Member since 2006</p>

            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-[#e8eae7] rounded-[6px]" />
              <strong className="text-sm text-[#202522]">{car.client.name}</strong>
            </div>

            <p className="text-sm text-[#777d78] mb-1">{car.client.address}</p>
            {/* <p className="text-sm text-[#777d78] mb-4">{car.client.address}</p> */}

            <div className="border-t border-[#e8ebe8] pt-4 flex flex-col gap-2 text-sm font-bold text-[#1f7a38]">
              <a href={`mailto:${car.client.email}`} className="hover:text-[#238636]">
                Email : {car.client.email}
              </a>
              <a href={`tel:${car.client.phone}`} className="hover:text-[#238636]">
                Contact Info: {car.client.phone}
              </a>
            </div>
          </div>

          {/* Action buttons */}
          <div className="bg-white border border-[#e3e6e2] rounded-[14px] p-5 flex flex-col gap-3">
            {/*<h4 className="text-sm font-bold text-[#202522] mb-1">
              Agent Contact: i think we can put AI here
            </h4>
             <button className="bg-[#1f7a38] text-white font-bold text-sm rounded-[8px] py-2.5 hover:bg-[#238636] transition duration-200">
              Send a message
            </button>
            <button className="bg-[#1f7a38] text-white font-bold text-sm rounded-[8px] py-2.5 hover:bg-[#238636] transition duration-200">
              Show number
            </button>
            <button className="border border-[#1f7a38] text-[#1f7a38] font-bold text-sm rounded-[8px] py-2.5 hover:bg-[#f0f8f1] transition duration-200">
              WhatsApp
            </button> */}
            {isOwner && (
              <button
                onClick={handleDelete}
                className="border border-[#c62828] text-[#c62828] font-bold text-sm rounded-[8px] py-2.5 hover:bg-[#fdecea] transition duration-200"
              >
                Delete car
              </button>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default SalePage;
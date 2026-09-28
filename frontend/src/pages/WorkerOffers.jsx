import { getAllCars, updateCar } from '@/api/carApi';
import React, { useEffect, useState } from 'react';

// const initialOffers = [
//   {
//     id: 'OFF-101',
//     carName: '2023 Mercedes-Benz C-Class',
//     sellerName: 'Mikko',
//     price: 34990,
//     status: 'Pending',
//     submittedDate: '2026-09-05',
//     mileage: '38,500 km',
//     location: 'Helsinki',
//     image:
//       'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=600&q=80',
//   },
//   {
//     id: 'OFF-102',
//     carName: '2021 BMW 3 Series',
//     sellerName: 'Sanna',
//     price: 31500,
//     status: 'Accepted',
//     submittedDate: '2026-09-04',
//     mileage: '45,200 km',
//     location: 'Espoo',
//     image:
//       'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=600&q=80',
//   },
//   {
//     id: 'OFF-103',
//     carName: '2020 Audi A4',
//     sellerName: 'Juho',
//     price: 28990,
//     status: 'Rejected',
//     submittedDate: '2026-09-02',
//     mileage: '52,000 km',
//     location: 'Vantaa',
//     image:
//       'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=600&q=80',
//   },
// ];

export default function WorkerOffers() {
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const data = await getAllCars();

        console.log(data);

        const formattedOffers = data.map((car) => ({
          id: car._id,
          carName: `${car.make} ${car.model}`,
          mileage: `${car.mileage.toLocaleString()} km`,
          location: 'Unknown',
          sellerName: car.seller,
          price: car.estimatedPrice,
          status: car.isVerified,
          image: '',
          submittedDate: car.year,
        }));

        setOffers(formattedOffers);
      } catch (error) {
        console.error('Failed to fetch cars:', error);
      }
    };

    fetchCars();
  }, []);

  const [offers, setOffers] = useState([]);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');

  const handleStatusChange = async (id, status) => {
    console.log(id);
    const updateStatus = await updateCar(id, status);
    console.log(updateStatus);
    setOffers((prevOffers) =>
      prevOffers.map((offer) =>
        offer.id === id ? { ...offer, status: updateCar.isVerified } : offer,
      ),
    );
    setSelectedOffer((prev) => ({ ...prev, status: updateCar.isVerified }));
  };

  const filteredOffers = offers.filter((offer) => {
    if (filterStatus === 'All') return true;
    return offer.status === filterStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Accepted':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';

      case 'Rejected':
        return 'bg-rose-50 text-rose-700 border-rose-200';

      default:
        return 'bg-amber-50 text-amber-700 border-amber-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="bg-white p-6 rounded-xl border border-[#d8dcd8] shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <p className="text-sm font-semibold text-[#2f9449] mb-2">WORKER DASHBOARD</p>

            <h1 className="text-3xl font-bold text-[#151815]">Car Offers</h1>

            <p className="text-sm text-[#4c524e] mt-1">Review and manage seller submissions</p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-[#4c524e]">Filter:</span>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="h-11 px-4 border border-[#d8dcd8] rounded-[7px] outline-none text-sm bg-white text-[#151815] focus:border-[#247f3d] focus:shadow-[0_0_0_3px_rgba(36,127,61,0.1)]"
            >
              <option value="All">All Offers</option>
              <option value="Pending">Pending</option>
              <option value="Accepted">Accepted</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* OFFERS TABLE */}
        <div className="bg-white rounded-xl border border-[#d8dcd8] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f4f6f4] text-[#4c524e] text-xs font-bold uppercase tracking-wider border-b border-[#d8dcd8]">
                  <th className="p-4">Offer ID</th>
                  <th className="p-4">Car Info</th>
                  <th className="p-4">Seller</th>
                  <th className="p-4">Estimated Price</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#e8eae7] text-sm">
                {filteredOffers.map((item) => (
                  <tr key={item.id} className="hover:bg-[#f8faf8] transition">
                    <td className="p-4 font-mono font-semibold text-[#4c524e]">{item.id}</td>

                    <td className="p-4">
                      <div className="font-semibold text-[#151815]">{item.carName}</div>

                      <div className="text-xs text-[#6b716d]">
                        {item.mileage} • {item.location}
                      </div>
                    </td>

                    <td className="p-4 text-[#151815]">{item.sellerName}</td>

                    <td className="p-4 font-bold text-[#151815]">€{item.price.toLocaleString()}</td>

                    <td className="p-4">
                      <span
                        className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-full border ${getStatusBadge(
                          item.status,
                        )}`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedOffer(item)}
                        className="bg-[#247f3d] hover:bg-[#1b6730] text-white font-bold text-xs px-3.5 py-2 rounded-[7px] transition shadow-sm"
                      >
                        Review Offer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* REVIEW MODAL */}
        {selectedOffer && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl border border-[#d8dcd8] max-w-2xl w-full overflow-hidden">
              {/* MODAL HEADER */}
              <div className="flex justify-between items-center p-5 border-b border-[#e8eae7] bg-white">
                <div>
                  <p className="text-xs font-semibold text-[#2f9449] mb-1">OFFER REVIEW</p>

                  <h2 className="text-lg font-bold text-[#151815]">
                    Review Offer - {selectedOffer.id}
                  </h2>
                </div>

                <button
                  onClick={() => setSelectedOffer(null)}
                  className="text-[#6b716d] hover:text-[#151815] text-lg font-bold transition"
                >
                  ✕
                </button>
              </div>

              {/* MODAL CONTENT */}
              <div className="p-6 space-y-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <img
                    src={selectedOffer.image}
                    alt={selectedOffer.carName}
                    className="w-full md:w-1/2 h-48 object-cover rounded-[7px] border border-[#d8dcd8]"
                  />

                  <div className="space-y-3 flex-1">
                    <h3 className="text-xl font-bold text-[#151815]">{selectedOffer.carName}</h3>

                    <div className="space-y-2">
                      <p className="text-sm text-[#4c524e]">
                        <span className="font-bold text-[#151815]">Seller:</span>{' '}
                        {selectedOffer.sellerName}
                      </p>

                      <p className="text-sm text-[#4c524e]">
                        <span className="font-bold text-[#151815]">Location:</span>{' '}
                        {selectedOffer.location}
                      </p>

                      <p className="text-sm text-[#4c524e]">
                        <span className="font-bold text-[#151815]">Mileage:</span>{' '}
                        {selectedOffer.mileage}
                      </p>

                      <p className="text-sm text-[#4c524e]">
                        <span className="font-bold text-[#151815]">Submitted:</span>{' '}
                        {selectedOffer.submittedDate}
                      </p>
                    </div>

                    <div className="pt-2">
                      <span className="text-xs text-[#6b716d] block mb-1">Offer Amount</span>

                      <span className="text-2xl font-black text-[#247f3d]">
                        €{selectedOffer.price.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* CURRENT STATUS */}
                <div className="flex items-center justify-between p-4 bg-[#f4f6f4] rounded-[7px] border border-[#d8dcd8]">
                  <span className="text-sm font-bold text-[#4c524e]">Current Status:</span>

                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusBadge(
                      selectedOffer.status,
                    )}`}
                  >
                    {selectedOffer.status}
                  </span>
                </div>
              </div>

              {/* MODAL ACTIONS */}
              {selectedOffer.status === 'Pending' && (
                <div className="flex items-center justify-end gap-3 p-5 border-t border-[#e8eae7] bg-[#fafbfa]">
                  <button
                    onClick={() => handleStatusChange(selectedOffer.id, 'Rejected')}
                    className="bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-sm px-4 py-2 rounded-[7px] border border-rose-200 transition  disabled:cursor-not-allowed"
                    disabled={
                      selectedOffer.status === 'Accepted' || selectedOffer.status === 'Rejected'
                    }
                  >
                    Reject Offer
                  </button>

                  <button
                    onClick={() => handleStatusChange(selectedOffer.id, 'Accepted')}
                    className="bg-[#247f3d] hover:bg-[#1b6730] text-white font-bold text-sm px-4 py-2 rounded-[7px] transition shadow-sm  disabled:cursor-not-allowed"
                    disabled={
                      selectedOffer.status === 'Accepted' || selectedOffer.status === 'Rejected'
                    }
                  >
                    Verify Offer
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

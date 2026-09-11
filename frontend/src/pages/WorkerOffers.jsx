import React, { useState } from 'react';

const initialOffers = [
  {
    id: 'OFF-101',
    make: 'Mercedes-Benz',
    model: 'C-Class',
    year: 2023,
    mileage: '38,500 km',
    fuel: 'Petrol',
    transmission: 'Automatic',
    price: 34990,
    condition: 'Used - Excellent',
    carImage: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=600&q=80',
    sellerName: 'Mikko',
    status: 'Pending',
    submittedDate: '2026-09-05'
  },
  {
    id: 'OFF-102',
    make: 'BMW',
    model: '3 Series',
    year: 2021,
    mileage: '45,200 km',
    fuel: 'Diesel',
    transmission: 'Automatic',
    price: 31500,
    condition: 'Used - Good',
    carImage: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=600&q=80',
    sellerName: 'Sanna',
    status: 'Accepted',
    submittedDate: '2026-09-04'
  },
  {
    id: 'OFF-103',
    make: 'Audi',
    model: 'A4',
    year: 2020,
    mileage: '52,000 km',
    fuel: 'Petrol',
    transmission: 'Manual',
    price: 28990,
    condition: 'Used - Fair',
    carImage: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=600&q=80',
    sellerName: 'Juho',
    status: 'Rejected',
    submittedDate: '2026-09-02'
  }
];

export default function WorkerOffers() {
  const [offers, setOffers] = useState(initialOffers);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');

  const handleStatusChange = (id, newStatus) => {
    const updatedOffers = offers.map((item) => {
      if (item.id === id) {
        return { ...item, status: newStatus };
      }
      return item;
    });

    setOffers(updatedOffers);

    if (selectedOffer && selectedOffer.id === id) {
      setSelectedOffer({ ...selectedOffer, status: newStatus });
    }
  };

  const filteredOffers = offers.filter((offer) => {
    if (filterStatus === 'All') return true;
    return offer.status === filterStatus;
  });

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Worker Offers</h1>
          <p className="text-sm text-gray-600">Manage car seller submissions</p>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Filter:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border p-2 rounded text-sm bg-white"
          >
            <option value="All">All Offers</option>
            <option value="Pending">Pending</option>
            <option value="Accepted">Accepted</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="bg-white border rounded-lg overflow-x-auto shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 text-sm font-semibold text-gray-700 border-b">
            <tr>
              <th className="p-3">Offer ID</th>
              <th className="p-3">Car Details</th>
              <th className="p-3">Seller</th>
              <th className="p-3">Price</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y text-sm">
            {filteredOffers.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="p-3 font-mono">{item.id}</td>
                <td className="p-3 font-medium">
                  <div>{item.year} {item.make} {item.model}</div>
                  <div className="text-xs text-gray-500">
                    {item.mileage} | {item.fuel} | {item.transmission}
                  </div>
                </td>
                <td className="p-3">{item.sellerName}</td>
                <td className="p-3 font-bold">€{item.price}</td>
                <td className="p-3">
                  <span className="px-2.5 py-1 text-xs font-semibold rounded-full border bg-gray-100">
                    {item.status}
                  </span>
                </td>
                <td className="p-3 text-right">
                  <button
                    onClick={() => setSelectedOffer(item)}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1.5 rounded"
                  >
                    Review Offer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedOffer && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full shadow-lg border">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h2 className="text-lg font-bold">Review Offer - {selectedOffer.id}</h2>
              <button
                onClick={() => setSelectedOffer(null)}
                className="text-gray-500 hover:text-black font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <img
                src={selectedOffer.carImage}
                alt={selectedOffer.model}
                className="w-full h-40 object-cover rounded border"
              />
              <h3 className="text-xl font-bold">
                {selectedOffer.year} {selectedOffer.make} {selectedOffer.model}
              </h3>
              <p><strong>Seller:</strong> {selectedOffer.sellerName}</p>
              <p><strong>Mileage:</strong> {selectedOffer.mileage}</p>
              <p><strong>Fuel:</strong> {selectedOffer.fuel}</p>
              <p><strong>Transmission:</strong> {selectedOffer.transmission}</p>
              <p><strong>Condition:</strong> {selectedOffer.condition}</p>
              <p><strong>Submitted Date:</strong> {selectedOffer.submittedDate}</p>
              <p className="text-lg font-bold text-blue-600">
                Price: €{selectedOffer.price}
              </p>
              <p>
                <strong>Status:</strong>{' '}
                <span className="px-2 py-0.5 text-xs bg-gray-100 rounded border">
                  {selectedOffer.status}
                </span>
              </p>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => handleStatusChange(selectedOffer.id, 'Rejected')}
                disabled={selectedOffer.status !== 'Pending'}
                className={`px-4 py-2 text-sm rounded text-white ${
                  selectedOffer.status !== 'Pending'
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                Reject Offer
              </button>
              <button
                onClick={() => handleStatusChange(selectedOffer.id, 'Accepted')}
                disabled={selectedOffer.status !== 'Pending'}
                className={`px-4 py-2 text-sm rounded text-white ${
                  selectedOffer.status !== 'Pending'
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                Accept Offer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
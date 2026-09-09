import React, { useState } from 'react';
const initialOffers = [
  {
    id: 'OFF-101',
    carName: '2023 Mercedes-Benz C-Class',
    sellerName: 'Mikko',
    price: 34990,
    status: 'Pending',
    submittedDate: '2026-09-05',
    mileage: '38,500 km',
    location: 'Helsinki',
    image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'OFF-102',
    carName: '2021 BMW 3 Series',
    sellerName: 'Sanna ',
    price: 31500,
    status: 'Accepted ',
    submittedDate: '2026-09-04',
    mileage: '45,200 km',
    location: 'Espoo',
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'OFF-103',
    carName: '2020 Audi A4',
    sellerName: 'Juho ',
    price: 28990,
    status: 'Rejected',
    submittedDate: '2026-09-02',
    mileage: '52,000 km',
    location: 'Vantaa',
    image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=600&q=80'


  }


];

export default function WorkerOffers() {

  const [offers, setOffers] = useState(initialOffers);

  const [selectedOffer, setSelectedOffer] = useState(null);


  const [filterStatus, setFilterStatus] = useState('All');

  const handleStatusChange = (id, newStatus) =>
  { 

    setOffers(prev => prev.map(item => (item.id === id ? { ...item, status: newStatus } : item)));


    if (selectedOffer && selectedOffer.id === id) 
      
      {
      setSelectedOffer(prev => ({ ...prev, status: newStatus }));
    }


  };

  const filteredOffers = offers.filter(offer => { if (filterStatus === 'All') return true; return offer.status === filterStatus; }

  
);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Accepted':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Rejected':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      default:
        return 'bg-amber-100 text-amber-800 border-amber-300';
    }
  };

  return (
    //*dashboard container using tailwind for css styling *//
    
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Autotori Worker Dashboard</h1>
            <p className="text-sm text-gray-500">Manage seller submissions and car offers</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-600">Filter:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-800 rounded-lg text-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="All">All Offers</option>
              <option value="Pending">Pending</option>
              <option value="Accepted">Accepted</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100/75 text-gray-600 text-xs font-semibold uppercase tracking-wider border-b border-gray-200">
                  <th className="p-4">Offer ID</th>
                  <th className="p-4">Car Info</th>
                  <th className="p-4">Seller</th>
                  <th className="p-4">Estimated Price</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-sm">
                {filteredOffers.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/80 transition">
                    <td className="p-4 font-mono font-medium text-gray-700">{item.id}</td>
                    <td className="p-4">
                      <div className="font-semibold text-gray-900">{item.carName}</div>
                      <div className="text-xs text-gray-500">{item.mileage} • {item.location}</div>
                    </td>
                    <td className="p-4 text-gray-700">{item.sellerName}</td>
                    <td className="p-4 font-bold text-gray-900">€{item.price.toLocaleString()}</td>
                    <td className="p-4">
                      <span className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-full border ${getStatusBadge(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedOffer(item)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs px-3 py-1.5 rounded-md transition"
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

        {selectedOffer && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl border border-gray-200 max-w-2xl w-full overflow-hidden">
              <div className="flex justify-between items-center p-5 border-b border-gray-200 bg-gray-50">
                <h2 className="text-lg font-bold text-gray-900">Review Offer - {selectedOffer.id}</h2>
                <button
                  onClick={() => setSelectedOffer(null)}
                  className="text-gray-400 hover:text-gray-600 text-lg font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <img
                    src={selectedOffer.image}
                    alt={selectedOffer.carName}
                    className="w-full md:w-1/2 h-44 object-cover rounded-lg border border-gray-200"
                  />
                  <div className="space-y-2 flex-1">
                    <h3 className="text-xl font-bold text-gray-900">{selectedOffer.carName}</h3>
                    <p className="text-sm text-gray-600"><span className="font-semibold">Seller:</span> {selectedOffer.sellerName}</p>
                    <p className="text-sm text-gray-600"><span className="font-semibold">Location:</span> {selectedOffer.location}</p>
                    <p className="text-sm text-gray-600"><span className="font-semibold">Mileage:</span> {selectedOffer.mileage}</p>
                    <p className="text-sm text-gray-600"><span className="font-semibold">Submitted:</span> {selectedOffer.submittedDate}</p>
                    <div className="pt-2">
                      <span className="text-xs text-gray-500 block">Offer Amount</span>
                      <span className="text-2xl font-black text-blue-600">€{selectedOffer.price.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <span className="text-sm font-medium text-gray-700">Current Status:</span>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusBadge(selectedOffer.status)}`}>
                    {selectedOffer.status}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 p-5 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={() => handleStatusChange(selectedOffer.id, 'Rejected')}
                  className="bg-rose-600 hover:bg-rose-700 text-white font-medium text-sm px-4 py-2 rounded-lg transition"
                >
                  Reject Offer
                </button>
                <button
                  onClick={() => handleStatusChange(selectedOffer.id, 'Accepted')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm px-4 py-2 rounded-lg transition"
                >
                  Accept Offer
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
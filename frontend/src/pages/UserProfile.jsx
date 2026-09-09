import React, { useState } from 'react';

export default function UserProfile() 
{
  const [isEditing, setIsEditing] = useState(false);

  const [userInfo, setUserInfo] = useState({

    fullName: 'Ridhi  ',

    email: 'ridhi@autotori.fi',

    phone: '+358 234 567 890',

    address: 'tulkinkuja 3, espoo, finland',
    

    role: 'Seller / Worker'

  });

  const handleChange = (e) => {

    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });

  };

  const handleSave = (e) => {
    e.preventDefault();

    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">User Profile</h1>
            <p className="text-sm text-gray-500">Manage your Autotori account details</p>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
          >
            {isEditing ? 'Cancel Edit' : 'Edit Profile'}
          </button>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={userInfo.fullName}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full bg-gray-50 disabled:bg-gray-100 border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={userInfo.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full bg-gray-50 disabled:bg-gray-100 border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  value={userInfo.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full bg-gray-50 disabled:bg-gray-100 border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Account Role</label>
                <input
                  type="text"
                  value={userInfo.role}
                  disabled
                  className="w-full bg-gray-100 border border-gray-300 rounded-lg p-2.5 text-sm text-gray-500 cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Address</label>
              <input
                type="text"
                name="address"
                value={userInfo.address}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full bg-gray-50 disabled:bg-gray-100 border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {isEditing && (
              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm px-6 py-2.5 rounded-lg transition shadow-sm"
                >
                  Save Profile Changes
                </button>
              </div>
            )}
          </form>
        </div>

      </div>
    </div>
  );
}

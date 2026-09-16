import React, { useState } from 'react';

export default function UserProfile() {
  const [isEditing, setIsEditing] = useState(false);

  const [userInfo, setUserInfo] = useState({
    fullName: 'Ridhi  ',
    email: 'ridhi@autotori.fi',
    phone: '+358 234 567 890',
    address: 'tulkinkuja 3, espoo, finland',
    role: 'Seller / Worker',
  });

  const handleChange = (e) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();

    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="bg-white p-6 rounded-xl border border-[#d8dcd8] shadow-sm flex justify-between items-center">
          <div>
            <p className="text-sm font-semibold text-[#2f9449] mb-2">ACCOUNT</p>

            <h1 className="text-3xl font-bold text-[#151815]">User Profile</h1>

            <p className="text-sm text-[#4c524e] mt-1">Manage your Autotori account details</p>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="bg-[#247f3d] hover:bg-[#1b6730] text-white text-sm font-bold px-4 py-2.5 rounded-[7px] transition"
          >
            {isEditing ? 'Cancel Edit' : 'Edit Profile'}
          </button>
        </div>

        {/* PROFILE FORM */}
        <div className="bg-white rounded-xl border border-[#d8dcd8] shadow-sm p-6">
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
              {/* FULL NAME */}
              <div>
                <label className="block text-sm font-bold mb-2">Full Name</label>

                <input
                  type="text"
                  name="fullName"
                  value={userInfo.fullName}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full h-12 p-4 border border-[#d8dcd8] rounded-[7px] outline-none text-sm bg-white disabled:bg-gray-100 focus:border-[#247f3d] focus:shadow-[0_0_0_3px_rgba(36,127,61,0.1)]"
                />
              </div>

              {/* EMAIL */}
              <div>
                <label className="block text-sm font-bold mb-2">Email Address</label>

                <input
                  type="email"
                  name="email"
                  value={userInfo.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full h-12 p-4 border border-[#d8dcd8] rounded-[7px] outline-none text-sm bg-white disabled:bg-gray-100 focus:border-[#247f3d] focus:shadow-[0_0_0_3px_rgba(36,127,61,0.1)]"
                />
              </div>

              {/* PHONE */}
              <div>
                <label className="block text-sm font-bold mb-2">Phone Number</label>

                <input
                  type="text"
                  name="phone"
                  value={userInfo.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full h-12 p-4 border border-[#d8dcd8] rounded-[7px] outline-none text-sm bg-white disabled:bg-gray-100 focus:border-[#247f3d] focus:shadow-[0_0_0_3px_rgba(36,127,61,0.1)]"
                />
              </div>

              {/* ROLE */}
              <div>
                <label className="block text-sm font-bold mb-2">Account Role</label>

                <input
                  type="text"
                  value={userInfo.role}
                  disabled
                  className="w-full h-12 p-4 border border-[#d8dcd8] rounded-[7px] outline-none text-sm bg-gray-100 text-[#4c524e] cursor-not-allowed"
                />
              </div>
            </div>

            {/* ADDRESS */}
            <div>
              <label className="block text-sm font-bold mb-2">Address</label>

              <input
                type="text"
                name="address"
                value={userInfo.address}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full h-12 p-4 border border-[#d8dcd8] rounded-[7px] outline-none text-sm bg-white disabled:bg-gray-100 focus:border-[#247f3d] focus:shadow-[0_0_0_3px_rgba(36,127,61,0.1)]"
              />
            </div>

            {/* SAVE */}
            {isEditing && (
              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="bg-[#247f3d] hover:bg-[#1b6730] text-white font-bold text-sm px-6 py-3 rounded-[7px] transition shadow-sm"
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

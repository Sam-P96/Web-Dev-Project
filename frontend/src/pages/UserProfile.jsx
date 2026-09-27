import React, { useEffect, useState } from 'react';
import { getMe } from '@/api/authApi';
import { updateUser } from '@/api/userApi';
import { errorMessage } from '@/api/client';
import { useAuth } from '@/context/authContext';

const EMPTY = { fullName: '', email: '', phone: '', address: '', role: '' };

// API user -> form fields
const toForm = (u) => ({
  fullName: u.name ?? '',
  email: u.email ?? '',
  phone: u.phone ?? '',
  address: u.address ?? '',
  role: u.role ?? '',
});

export default function UserProfile() {
  const { user, saveUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const [userInfo, setUserInfo] = useState(EMPTY);
  // Last saved values, restored on "Cancel Edit"
  const [savedInfo, setSavedInfo] = useState(EMPTY);
  const [status, setStatus] = useState(null); // { type: 'error' | 'success', text }

  useEffect(() => {
    let ignore = false;
    getMe().then(({ ok, data }) => {
      if (ignore) return;
      if (!ok) {
        setStatus({ type: 'error', text: errorMessage(data, 'Could not load profile') });
        return;
      }
      setUserInfo(toForm(data));
      setSavedInfo(toForm(data));
    });
    return () => {
      ignore = true;
    };
  }, []);

  const handleChange = (e) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  const toggleEdit = () => {
    if (isEditing) setUserInfo(savedInfo); // cancel -> discard changes
    setStatus(null);
    setIsEditing(!isEditing);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const { ok, data } = await updateUser(user._id, {
      name: userInfo.fullName,
      email: userInfo.email,
      phone: userInfo.phone,
      address: userInfo.address,
    });

    if (!ok) {
      setStatus({ type: 'error', text: errorMessage(data, 'Could not save changes') });
      return;
    }

    setUserInfo(toForm(data));
    setSavedInfo(toForm(data));
    // Keep the token, refresh name/email shown in the Navbar
    saveUser({ ...user, name: data.name, email: data.email });
    setStatus({ type: 'success', text: 'Profile updated' });
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
            onClick={toggleEdit}
            className="bg-[#247f3d] hover:bg-[#1b6730] text-white text-sm font-bold px-4 py-2.5 rounded-[7px] transition"
          >
            {isEditing ? 'Cancel Edit' : 'Edit Profile'}
          </button>
        </div>

        {status && (
          <p
            className={`text-sm font-semibold ${status.type === 'error' ? 'text-red-500' : 'text-[#2f9449]'}`}
          >
            {status.text}
          </p>
        )}

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

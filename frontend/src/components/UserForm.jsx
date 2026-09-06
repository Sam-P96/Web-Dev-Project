import React from 'react'


const inputClasses= "w-full h-12 p-4 border border-[#d8dcd8] rounded-[7px] outline-none text-sm bg-white focus:border-[#247f3d] focus:shadow-[0_0_0_3px_rgba(36,127,61,0.1)]"
const labelClasses = "block text-sm font-bold mb-2"
export const UserForm = () => {




    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        const values = Object.fromEntries(formData.entries())

        console.log(values);


    }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8 "> <main className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8">
    <form onSubmit={handleSubmit} className=''>
      {/* User INFORMATION */}
      <div className="text-center mb-10 ">
        <p className="text-sm font-semibold text-[#2f9449] p-5">USER INFORMATION</p>
        <h2 className='text-4xl font-bold'>Create Your Account</h2>
      </div>
      <div className=" grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">

         <div>
          <label htmlFor="FirstName" className='block text-sm font-bold mb-2'>First Name</label>
          <input
            type="text"
            id="FirstName"
            name="FirstName"
            placeholder="e.g. John"
            className='w-full h-12 p-4 border border-[#d8dcd8] rounded-[7px] outline-none text-sm bg-white focus:border-[#247f3d] focus:shadow-[0_0_0_3px_rgba(36,127,61,0.1)]'

            required=""
          />
        </div>

        <div>
          <label htmlFor="LastName" className='block text-sm font-bold mb-2'>Last Name</label>
          <input
            type="text"
            id="LastName"
            name="LastName"
            placeholder="e.g. Doe"
            required=""
            className='w-full h-12 p-4 border border-[#d8dcd8] rounded-[7px] outline-none text-sm bg-white focus:border-[#247f3d] focus:shadow-[0_0_0_3px_rgba(36,127,61,0.1)] '
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="email" className='block text-sm font-bold mb-[7px]'>Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="e.g. john.doe@example.com"
            required=""
            className={inputClasses}
          />
        </div>
        <div className="">
          <label htmlFor="password" className={labelClasses}>Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Create a strong password"
            required=""
            className={inputClasses}
          />
        </div>
        <div className="">
          <label htmlFor="confirm-password" className={labelClasses}>Confirm Password</label>
          <input
            type="password"
            id="confirm-password"
            name="confirm-password"
            placeholder="Confirm your password"
            required=""
            className={inputClasses}
          />
        </div>

        <div>
          <label htmlFor="seller-phone" className={labelClasses}>Phone</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            placeholder="+358..."
            className={inputClasses}
          />
        </div>
      </div>
      {/* SUBMIT */}
      <div className="flex items-center justify-center p-4">
        <button type="submit" className="w-50 border-none  rounded-[7px] bg-[#247f3d] text-white text-lg font-bold cursor-pointer p-4 mt-8 hover:bg-[#1b6730] ">
          Submit
        </button>
      </div>
    </form>
  </main>
  </div>
  )
}

export default UserForm
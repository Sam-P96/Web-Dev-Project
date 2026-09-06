import React from 'react'


export const UserForm = () => {




    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        const values = Object.fromEntries(formData.entries())

        console.log(values);


    }

  return (
    <div className="flex flex-row items-center justify-center gap-4 border rounded-lg p-4"> <main className="">
    <form className="" onSubmit={handleSubmit}>
      {/* UserForm INFORMATION */}
      <div className="">
        <p className="">USER INFORMATION</p>
        <h2>Create Your Account</h2>
      </div>
      <div className="">

         <div className="">
          <label htmlFor="FirstName">First Name</label>
          <input
            type="text"
            id="FirstName"
            name="FirstName"
            placeholder="e.g. John"

            required=""
          />
        </div>

        <div className="">
          <label htmlFor="LastName">Last Name</label>
          <input
            type="text"
            id="LastName"
            name="LastName"
            placeholder="e.g. Doe"
            required=""
          />
        </div>

        <div className="">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="e.g. john.doe@example.com"
            required=""
          />
        </div>
        <div className="">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Create a strong password"
            required=""
          />
        </div>
        <div className="">
          <label htmlFor="confirm-password">Confirm Password</label>
          <input
            type="password"
            id="confirm-password"
            name="confirm-password"
            placeholder="Confirm your password"
            required=""
          />
        </div>

        <div className="">
          <label htmlFor="seller-phone">Phone</label>
          <input
            type="tel"
            id="seller-phone"
            name="seller-phone"
            placeholder="+358..."
          />
        </div>
      </div>
      {/* SUBMIT */}
      <div className="form-submit">
        <button type="submit" className="primary-button">
          Submit Car Listing →
        </button>
      </div>
    </form>
  </main>
  </div>
  )
}

export default UserForm
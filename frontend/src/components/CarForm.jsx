import React from 'react'

export const CarForm = () => {




    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        const values = Object.fromEntries(formData.entries())

        console.log(values);


    }

  return (
    <div> <main className="form-page">
    <form className="car-form" onSubmit={handleSubmit}>
      {/* CAR INFORMATION */}
      <div className="form-title">
        <p className="section-label">CAR DETAILS</p>
        <h2>Tell us about your car</h2>
      </div>
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="make">Make</label>
          <select id="make" name="make" required="" >
            <option value="">Select Make</option>
            <option>Audi</option>
            <option>BMW</option>
            <option>Mercedes-Benz</option>
            <option>Volvo</option>
            <option>Toyota</option>
            <option>Tesla</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="model">Model</label>
          <input
            type="text"
            id="model"
            name="model"
            placeholder="e.g. A4"
            required=""
          />
        </div>
        <div className="form-group">
          <label htmlFor="year">Year</label>
          <select id="year" name="year" required="" >
            <option value="">Select Year</option>
            <option>2026</option>
            <option>2025</option>
            <option>2024</option>
            <option>2023</option>
            <option>2022</option>
            <option>2021</option>
            <option>2020</option>
            <option>2019</option>
            <option>2018</option>
            <option>2017</option>
            <option>2016</option>
            <option>2015</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="mileage">Mileage (km)</label>
          <input
            type="number"
            id="mileage"
            name="mileage"
            placeholder="e.g. 45000"
            required=""
          />
        </div>
        <div className="form-group">
          <label htmlFor="fuel">Fuel Type</label>
          <select id="fuel" name="fuel" required="">
            <option value="">Select Fuel Type</option>
            <option>Petrol</option>
            <option>Diesel</option>
            <option>Hybrid</option>
            <option>Electric</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="transmission">Transmission</label>
          <select id="transmission" name="transmission" required="">
            <option value="">Select Transmission</option>
            <option>Automatic</option>
            <option>Manual</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="price">Asking Price (€)</label>
          <input
            type="number"
            id="price"
            name="price"
            placeholder="e.g. 29990"
            required=""
          />
        </div>
        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            placeholder="e.g. Helsinki"
            required=""
          />
        </div>
      </div>
      {/* CONDITION */}
      <div className="form-group">
        <label htmlFor="condition">Condition</label>
        <select id="condition" name="condition" required="">
          <option value="">Select Condition</option>
          <option>Excellent</option>
          <option>Good</option>
          <option>Fair</option>
        </select>
      </div>
      {/* DESCRIPTION */}
      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          rows={6}
          placeholder="Tell buyers about your car..."
          defaultValue={""}
        />
      </div>
      {/* IMAGE */}
      <div className="form-group">
        <label htmlFor="car-image">Car Image</label>
        <input type="file" id="car-image" name="car-image" accept="image/*" />
        <p className="form-help">Upload a clear photo of your car.</p>
      </div>
      {/* SELLER INFORMATION */}
      <div className="form-title seller-title">
        <p className="section-label">SELLER DETAILS</p>
        <h2>Your Contact Information</h2>
      </div>
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="seller-name">Full Name</label>
          <input
            type="text"
            id="seller-name"
            name="seller-name"
            placeholder="Your full name"
            required=""
          />
        </div>
        <div className="form-group">
          <label htmlFor="seller-email">Email</label>
          <input
            type="email"
            id="seller-email"
            name="seller-email"
            placeholder="you@example.com"
            required=""
          />
        </div>
        <div className="form-group">
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
  </main></div>
  )
}

export default CarForm
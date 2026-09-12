import React, { useState } from 'react';
import { z } from 'zod';

const CarSchema = z.object({
  make: z.string().min(1, 'please select one'),
  model: z.string().min(2, 'please enter the model'),
  year: z.string().min(1, 'please select the model'),
  mileage: z.coerce.number().max(70, 'you gotta be kidding me'),
  fuel: z.string().min(1, 'please select one'),
  transmission: z.string().min(1, 'please select one'),
  price: z.coerce.number().min(1000, "don't hesitate, we will do the rest"),
  condition: z.string().min(1, 'please select one'),
  carImage: z
    .custom((file) => file instanceof File && file.size > 0, {
      message: 'please select an image',
    })
    .refine((file) => file?.size <= 5 * 1024 * 1024, {
      message: 'image size must be under 5MB',
    }),
});

export const CarForm = () => {
  const [errors, setErrors] = useState('');

  const handleChange = (e) => {
    const fieldName = e.target.name;
    const fieldValue = e.target.value;
    const fieldSchema = CarSchema.shape[fieldName];
    const validate = fieldSchema.safeParse(fieldValue);
    if (!validate.success) {
      const errorsMessage = validate.error.issues[0].message;
      setErrors((prev) => ({ ...prev, [fieldName]: errorsMessage }));
    } else {
      setErrors((prev) => ({ ...prev, [fieldName]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const values = Object.fromEntries(formData.entries());
    console.log(values);
    const validate = CarSchema.safeParse(values);
    if (!validate.success) {
      const errors = z.flattenError(validate.error).fieldErrors;
      setErrors(errors);
      return;
    }
    setErrors({});
    console.log(values);
  };

  return (
    <div>
      <main className="min-h-162.5 bg-[#f5f6f4] px-5 py-13.75 pb-20 max-[700px]:px-3.75 max-[700px]:py-8.75 max-[700px]:pb-15">
        <form
          className="mx-auto w-full max-w-250 rounded-[14px] border border-[#e3e6e2] bg-white p-10 shadow-[0_10px_30px_rgba(0,0,0,0.04)] max-[700px]:rounded-[11px] max-[700px]:px-5 max-[700px]:py-6.25"
          onSubmit={handleSubmit}
        >
          {/* CAR INFORMATION */}
          <div className="mb-7">
            <p className="text-3 font-extrabold tracking-[1.5px] text-[#2f9449]">
              CAR DETAILS
            </p>
            <h2 className="mt-1.25 text-6.25 font-bold text-[#202522] max-[700px]:text-5.5">
              Tell us about your car
            </h2>
          </div>

          <div className="mb-5 grid grid-cols-2 gap-5 max-[700px]:grid-cols-1 max-[700px]:gap-0">
            <div className="mb-0 max-[700px]:mb-5">
              <label
                htmlFor="make"
                className="mb-1.75 block text-3.25 font-bold text-[#303631]"
              >
                Make
              </label>
              <select
                id="make"
                name="make"
                required
                onChange={handleChange}
                className={`h-11.5 w-full rounded-[7px] border border-[#d8dcd8] bg-white px-3.25 text-3.5 text-[#202522] outline-none transition duration-200 focus:border-[#247f3d] focus:ring-4 focus:ring-[#247f3d]/10 ${errors.make ? 'border-red-500' : 'focus:border-[#247f3d]'}`}
              >
                <option value="">Select Make</option>
                <option>Audi</option>
                <option>BMW</option>
                <option>Mercedes-Benz</option>
                <option>Volvo</option>
                <option>Toyota</option>
                <option>Tesla</option>
              </select>
              {errors.make && (
                <p className="mt-1 text-xs text-red-500">{errors.make}</p>
              )}
            </div>

            <div className="mb-0 max-[700px]:mb-5">
              <label
                htmlFor="model"
                className="mb-1.75 block text-3.25 font-bold text-[#303631]"
              >
                Model
              </label>
              <input
                type="text"
                id="model"
                name="model"
                onChange={handleChange}
                placeholder="e.g. A4"
                required
                className={`h-11.5 w-full rounded-[7px] border border-[#d8dcd8] bg-white px-3.25 text-3.5 text-[#202522] outline-none transition duration-200 focus:border-[#247f3d] focus:ring-4 focus:ring-[#247f3d]/10 ${errors.model ? 'border-red-500' : 'focus:border-[#247f3d]'}`}
              />
              {errors.model && (
                <p className="mt-1 text-xs text-red-500">{errors.model}</p>
              )}
            </div>

            <div className="mb-0 max-[700px]:mb-5">
              <label
                htmlFor="year"
                className="mb-1.75 block text-3.25 font-bold text-[#303631]"
              >
                Year
              </label>
              <select
                id="year"
                name="year"
                onChange={handleChange}
                required
                className={`h-11.5 w-full rounded-[7px] border border-[#d8dcd8] bg-white px-3.25 text-3.5 text-[#202522] outline-none transition duration-200 focus:border-[#247f3d] focus:ring-4 focus:ring-[#247f3d]/10 ${errors.year ? 'border-red-500' : 'focus:border-[#247f3d]'}`}
              >
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
              {errors.year && (
                <p className="mt-1 text-xs text-red-500">{errors.year}</p>
              )}
            </div>

            <div className="mb-0 max-[700px]:mb-5">
              <label
                htmlFor="mileage"
                className="mb-1.75 block text-3.25 font-bold text-[#303631]"
              >
                Mileage (km)
              </label>
              <input
                type="number"
                id="mileage"
                name="mileage"
                placeholder="e.g. 45000"
                onChange={handleChange}
                required
                className={`h-11.5 w-full rounded-[7px] border border-[#d8dcd8] bg-white px-3.25 text-3.5 text-[#202522] outline-none transition duration-200 focus:border-[#247f3d] focus:ring-4 focus:ring-[#247f3d]/10 ${errors.mileage ? 'border-red-500' : 'focus:border-[#247f3d]'}`}
              />
              {errors.mileage && (
                <p className="mt-1 text-xs text-red-500">{errors.mileage}</p>
              )}
            </div>

            <div className="mb-0 max-[700px]:mb-5">
              <label
                htmlFor="fuel"
                className="mb-1.75 block text-3.25 font-bold text-[#303631]"
              >
                Fuel Type
              </label>
              <select
                id="fuel"
                name="fuel"
                required
                onChange={handleChange}
                className={`h-11.5 w-full rounded-[7px] border border-[#d8dcd8] bg-white px-3.25 text-3.5 text-[#202522] outline-none transition duration-200 focus:border-[#247f3d] focus:ring-4 focus:ring-[#247f3d]/10 ${errors.fuel ? 'border-red-500' : 'focus:border-[#247f3d]'}`}
              >
                <option value="">Select Fuel Type</option>
                <option>Petrol</option>
                <option>Diesel</option>
                <option>Hybrid</option>
                <option>Electric</option>
              </select>
              {errors.fuel && (
                <p className="mt-1 text-xs text-red-500">{errors.fuel}</p>
              )}
            </div>

            <div className="mb-0 max-[700px]:mb-5">
              <label
                htmlFor="transmission"
                className="mb-1.75 block text-3.25 font-bold text-[#303631]"
              >
                Transmission
              </label>
              <select
                id="transmission"
                name="transmission"
                onChange={handleChange}
                required
                className={`h-11.5 w-full rounded-[7px] border border-[#d8dcd8] bg-white px-3.25 text-3.5 text-[#202522] outline-none transition duration-200 focus:border-[#247f3d] focus:ring-4 focus:ring-[#247f3d]/10 ${errors.transmission ? 'border-red-500' : 'focus:border-[#247f3d]'}`}
              >
                <option value="">Select Transmission</option>
                <option>Automatic</option>
                <option>Manual</option>
              </select>
              {errors.transmission && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.transmission}
                </p>
              )}
            </div>

            <div className="mb-0 max-[700px]:mb-5">
              <label
                htmlFor="price"
                className="mb-1.75 block text-3.25 font-bold text-[#303631]"
              >
                Asking Price (€)
              </label>
              <input
                type="number"
                id="price"
                onChange={handleChange}
                name="price"
                placeholder="e.g. 29990"
                required
                className={`h-11.5 w-full rounded-[7px] border border-[#d8dcd8] bg-white px-3.25 text-3.5 text-[#202522] outline-none transition duration-200 focus:border-[#247f3d] focus:ring-4 focus:ring-[#247f3d]/10 ${errors.price ? 'border-red-500' : 'focus:border-[#247f3d]'}`}
              />
              {errors.price && (
                <p className="mt-1 text-xs text-red-500">{errors.price}</p>
              )}
            </div>

            <div className="mb-0 max-[700px]:mb-5">
              <label
                htmlFor="location"
                className="mb-1.75 block text-3.25 font-bold text-[#303631]"
              >
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                placeholder="e.g. Helsinki"
                required
                className="h-11.5 w-full rounded-[7px] border border-[#d8dcd8] bg-white px-3.25 text-3.5 text-[#202522] outline-none transition duration-200 placeholder:text-[#9aa09b] focus:border-[#247f3d] focus:ring-4 focus:ring-[#247f3d]/10"
              />
            </div>
          </div>

          {/* CONDITION */}
          <div className="mb-5">
            <label
              htmlFor="condition"
              className="mb-1.75 block text-3.25 font-bold text-[#303631]"
            >
              Condition
            </label>
            <select
              id="condition"
              name="condition"
              onChange={handleChange}
              required
              className={`h-11.5 w-full rounded-[7px] border border-[#d8dcd8] bg-white px-3.25 text-3.5 text-[#202522] outline-none transition duration-200 focus:border-[#247f3d] focus:ring-4 focus:ring-[#247f3d]/10 ${errors.condition ? 'border-red-500' : 'focus:border-[#247f3d]'}`}
            >
              <option value="">Select Condition</option>
              <option>Excellent</option>
              <option>Good</option>
              <option>Fair</option>
            </select>
            {errors.condition && (
              <p className="mt-1 text-xs text-red-500">{errors.condition}</p>
            )}
          </div>

          {/* DESCRIPTION */}
          <div className="mb-5">
            <label
              htmlFor="description"
              className="mb-1.75 block text-3.25 font-bold text-[#303631]"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={6}
              placeholder="Tell buyers about your car..."
              defaultValue=""
              className="min-h-35 w-full resize-y rounded-[7px] border border-[#d8dcd8] bg-white px-3.25 py-3 text-3.5 text-[#202522] outline-none transition duration-200 placeholder:text-[#9aa09b] focus:border-[#247f3d] focus:ring-4 focus:ring-[#247f3d]/10"
            />
          </div>

          {/* IMAGE */}
          <div className="mb-5">
            <label
              htmlFor="carImage"
              className="mb-1.75 block text-3.25 font-bold text-[#303631]"
            >
              Car Image
            </label>
            <input
              type="file"
              id="carImage"
              name="carImage"
              accept="image/*"
              className={`h-11.5 w-full rounded-[7px] border border-[#d8dcd8] bg-white px-3.25 text-3.5 text-[#202522] outline-none transition duration-200 focus:border-[#247f3d] focus:ring-4 focus:ring-[#247f3d]/10 ${errors.carImage ? 'border-red-500' : 'focus:border-[#247f3d]'}`}
            />
            {errors.carImage && (
              <p className="mt-1 text-xs text-red-500">{errors.carImage}</p>
            )}
            <p className="mt-1.75 text-3 text-[#777d78]">
              Upload a clear photo of your car.
            </p>
          </div>

          {/* SELLER INFORMATION
          <div className="mt-3.75 mb-7 border-t border-[#e8ebe8] pt-7.5">
            <p className="text-3 font-extrabold tracking-[1.5px] text-[#2f9449]">
              SELLER DETAILS
            </p>
            <h2 className="mt-1.25 text-6.25 font-bold text-[#202522] max-[700px]:text-5.5">
              Your Contact Information
            </h2>
          </div>

          <div className="mb-5 grid grid-cols-2 gap-5 max-[700px]:grid-cols-1 max-[700px]:gap-0">
            <div className="mb-0 max-[700px]:mb-5">
              <label
                htmlFor="seller-name"
                className="mb-1.75 block text-3.25 font-bold text-[#303631]"
              >
                Full Name
              </label>
              <input
                type="text"
                id="seller-name"
                name="seller-name"
                placeholder="Your full name"
                required
                className="h-11.5 w-full rounded-[7px] border border-[#d8dcd8] bg-white px-3.25 text-3.5 text-[#202522] outline-none transition duration-200 placeholder:text-[#9aa09b] focus:border-[#247f3d] focus:ring-4 focus:ring-[#247f3d]/10"
              />
            </div>

            <div className="mb-0 max-[700px]:mb-5">
              <label
                htmlFor="seller-email"
                className="mb-1.75 block text-3.25 font-bold text-[#303631]"
              >
                Email
              </label>
              <input
                type="email"
                id="seller-email"
                name="seller-email"
                placeholder="you@example.com"
                required
                className="h-11.5 w-full rounded-[7px] border border-[#d8dcd8] bg-white px-3.25 text-3.5 text-[#202522] outline-none transition duration-200 placeholder:text-[#9aa09b] focus:border-[#247f3d] focus:ring-4 focus:ring-[#247f3d]/10"
              />
            </div>

            <div className="mb-0 max-[700px]:mb-5">
              <label
                htmlFor="seller-phone"
                className="mb-1.75 block text-3.25 font-bold text-[#303631]"
              >
                Phone
              </label>
              <input
                type="tel"
                id="seller-phone"
                name="seller-phone"
                placeholder="+358..."
                className="h-11.5 w-full rounded-[7px] border border-[#d8dcd8] bg-white px-3.25 text-3.5 text-[#202522] outline-none transition duration-200 placeholder:text-[#9aa09b] focus:border-[#247f3d] focus:ring-4 focus:ring-[#247f3d]/10"
              />
            </div>
          </div> */}

          {/* SUBMIT */}
          <div className="mt-2.5 flex justify-end border-t border-[#e8ebe8] pt-6.25 max-[700px]:justify-stretch">
            <button
              type="submit"
              className="inline-block rounded-[7px] bg-[#247f3d] px-5.5 py-3.25 text-3.5 font-bold text-white transition duration-200 hover:bg-[#1b6730] max-[700px]:w-full max-[700px]:text-center"
            >
              Submit Car Listing →
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default CarForm;

import { createCar } from '../api/carApi';
import { errorMessage } from '../api/client';
import React, { useState, useRef } from 'react';
import { z } from 'zod';
import { estimatePrice } from '../api/estimateApi';
import PriceEstimateDisplay from './PriceEstimateDisplay';
import { useNavigate } from 'react-router-dom';

// PLACE HODLER CLIENT ID
// const PLACEHOLDER_CLIENT_ID = '6ab1575f4b02b92e8a25e7e3';

// I dont remember doing this, I assume it was fe people.
const CarSchema = z.object({
  make: z.string().min(1, 'please select one'),
  model: z.string().min(2, 'please enter the model'),
  year: z.string().min(1, 'please select the year'),
  mileage: z.coerce.number().min(0, 'mileage cannot be negative'),
  fuel: z.string().min(1, 'please select one'),
  transmission: z.string().min(1, 'please select one'),
  price: z.coerce.number().min(1000, "don't hesitate, we will do the rest"),
  condition: z.string().min(1, 'please select one'),
  // TODO: ADD CAR IMAGE FOR LATER ⚠️ Aakash over here!!! Or i can cover this, idk.
  carImage: z
    .custom((file) => file instanceof File && file.size > 0, {
      message: 'please select an image',
    })
    .refine((file) => file?.size <= 5 * 1024 * 1024, {
      message: 'image size must be under 5MB',
    }),
});

// Had claude help me with this, but it looks fine.
const EstimateSchema = CarSchema.pick({
  make: true,
  model: true,
  year: true,
  mileage: true,
  fuel: true,
  transmission: true,
  condition: true,
});

export const CarForm = () => {
  const [errors, setErrors] = useState({});
  const [gotEstimate, setGotEstimate] = useState(null);
  const [estimateLoading, setEstimateLoading] = useState(false);
  const [estimateError, setEstimateError] = useState(null);
  const [submitStatus, setSubmitStatus] = useState(null);

  const formRef = useRef(null);

  const handleEstimate = async () => {
    const formData = new FormData(formRef.current);
    const values = Object.fromEntries(formData.entries());

    const validate = EstimateSchema.safeParse(values);

    if (!validate.success) {
      setErrors(z.flattenError(validate.error).fieldErrors);
      setEstimateError('Please fill in the car details above first.');
      setGotEstimate(null);
      return;
    }

    setErrors({});
    setEstimateError(null);
    setGotEstimate(null);
    setEstimateLoading(true);

    const result = await estimatePrice({
      make: validate.data.make,
      model: validate.data.model,
      year: validate.data.year,
      mileage: validate.data.mileage,
      fuel: validate.data.fuel,
      transmission: validate.data.transmission,
      condition: validate.data.condition,
      location: values.location,
      description: values.description,
    });

    setEstimateLoading(false);

    if (result.ok) {
      setGotEstimate(result.data);
    } else {
      setEstimateError(result.data.message || 'Could not get an estimate. Please try again.');
    }
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);
    const values = Object.fromEntries(formData.entries());

    const validate = CarSchema.safeParse(values);

    if (!validate.success) {
      // man, idk who made this, but what is this? -> this is just extraction of particular field errors from the object response like we did in python!!!!
      const errors = z.flattenError(validate.error).fieldErrors;
      setErrors(errors);
      return;
    }
    setErrors({});
    console.log(values);
    //?---i dont think we do need this extra carData when we already have the form data---------------

    // const carData = {
    //   // no `client`: the server sets the owner from the login token
    //   make: validate.data.make,
    //   model: validate.data.model,
    //   year: Number(validate.data.year),
    //   mileage: validate.data.mileage,
    //   fuel: validate.data.fuel,
    //   transmission: validate.data.transmission,
    //   estimatedPrice: validate.data.price,
    //   condition: validate.data.condition,
    //   location: values.location,
    //   description: values.description,
    // };
    //?------------------------------------------------------------------------------------------------------
    const result = await createCar(formData);

    if (result.ok) {
      setSubmitStatus({ type: 'success', text: 'Your car has been listed!' });
      form.reset();
      setGotEstimate(null);
      setEstimateError(null);
    } else {
      setSubmitStatus({ type: 'error', text: result.data.message });
    }
  };

  // Reworked Aakash's Code
  const navigate = useNavigate();
  const handlePostCar = async () => {
    const formData = new FormData(formRef.current);
    const values = Object.fromEntries(formData.entries());

    const validate = CarSchema.safeParse(values);

    if (!validate.success) {
      const errors = z.flattenError(validate.error).fieldErrors;
      setErrors(errors);
      return;
    }
    setErrors({});

    // const carData = {
    //   client: PLACEHOLDER_CLIENT_ID,
    //   make: validate.data.make,
    //   model: validate.data.model,
    //   year: Number(validate.data.year),
    //   mileage: validate.data.mileage,
    //   fuel: validate.data.fuel,
    //   transmission: validate.data.transmission,
    //   estimatedPrice: validate.data.price,
    //   condition: validate.data.condition,
    //   location: values.location,
    //   description: values.description,
    // };
    formData.append('company', true);
    const result = await createCar(formData);

    if (!result.ok) {
      setSubmitStatus({ type: 'error', text: result.data.message });
      return;
    }

    // The backend sends back the saved car, including its new ID
    const carId = result.data._id;

    // THIS IS A PLACEHOLDER LINK, SOMEONE WORK WITH ME TO MAKE THIS WORK WITH THE BOOK APPOINTMENT
    navigate(`/appointment/${carId}`);
  };

  return (
    <div>
      <main className="min-h-162.5 bg-[#f5f6f4] px-5 py-13.75 pb-20 max-[700px]:px-3.75 max-[700px]:py-8.75 max-[700px]:pb-15">
        <form
          ref={formRef}
          className="mx-auto w-full max-w-250 rounded-[14px] border border-[#e3e6e2] bg-white p-10 shadow-[0_10px_30px_rgba(0,0,0,0.04)] max-[700px]:rounded-[11px] max-[700px]:px-5 max-[700px]:py-6.25"
          onSubmit={handleSubmit}
        >
          {/* CAR INFORMATION */}
          <div className="mb-7">
            <p className="text-3 font-extrabold tracking-[1.5px] text-[#2f9449]">CAR DETAILS</p>
            <h2 className="mt-1.25 text-6.25 font-bold text-[#202522] max-[700px]:text-5.5">
              Tell us about your car
            </h2>
          </div>

          <div className="mb-5 grid grid-cols-2 gap-5 max-[700px]:grid-cols-1 max-[700px]:gap-0">
            <div className="mb-0 max-[700px]:mb-5">
              <label htmlFor="make" className="mb-1.75 block text-3.25 font-bold text-[#303631]">
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
              {errors.make && <p className="mt-1 text-xs text-red-500">{errors.make}</p>}
            </div>

            <div className="mb-0 max-[700px]:mb-5">
              <label htmlFor="model" className="mb-1.75 block text-3.25 font-bold text-[#303631]">
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
              {errors.model && <p className="mt-1 text-xs text-red-500">{errors.model}</p>}
            </div>

            <div className="mb-0 max-[700px]:mb-5">
              <label htmlFor="year" className="mb-1.75 block text-3.25 font-bold text-[#303631]">
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
                <option>2014</option>
                <option>2013</option>
                <option>2012</option>
                <option>2011</option>
                <option>2010</option>
                <option>2009</option>
              </select>
              {errors.year && <p className="mt-1 text-xs text-red-500">{errors.year}</p>}
            </div>

            <div className="mb-0 max-[700px]:mb-5">
              <label htmlFor="mileage" className="mb-1.75 block text-3.25 font-bold text-[#303631]">
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
              {errors.mileage && <p className="mt-1 text-xs text-red-500">{errors.mileage}</p>}
            </div>

            <div className="mb-0 max-[700px]:mb-5">
              <label htmlFor="fuel" className="mb-1.75 block text-3.25 font-bold text-[#303631]">
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
              {errors.fuel && <p className="mt-1 text-xs text-red-500">{errors.fuel}</p>}
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
                <p className="mt-1 text-xs text-red-500">{errors.transmission}</p>
              )}
            </div>

            <div className="mb-0 max-[700px]:mb-5">
              <label htmlFor="price" className="mb-1.75 block text-3.25 font-bold text-[#303631]">
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
              {errors.price && <p className="mt-1 text-xs text-red-500">{errors.price}</p>}
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
            <label htmlFor="condition" className="mb-1.75 block text-3.25 font-bold text-[#303631]">
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
              <option value="excellent">Excellent</option>
              <option value="good">Good</option>
              <option value="fair">Fair</option>
            </select>
            {errors.condition && <p className="mt-1 text-xs text-red-500">{errors.condition}</p>}
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
            <label htmlFor="carImage" className="mb-1.75 block text-3.25 font-bold text-[#303631]">
              Car Image
            </label>
            <input
              type="file"
              id="carImage"
              name="carImage"
              accept="image/*"
              className={`h-11.5 w-full rounded-[7px] border border-[#d8dcd8] bg-white px-3.25 text-3.5 text-[#202522] outline-none transition duration-200 focus:border-[#247f3d] focus:ring-4 focus:ring-[#247f3d]/10 ${errors.carImage ? 'border-red-500' : 'focus:border-[#247f3d]'}`}
            />
            {errors.carImage && <p className="mt-1 text-xs text-red-500">{errors.carImage}</p>}
            <p className="mt-1.75 text-3 text-[#777d78]">Upload a clear photo of your car.</p>
          </div>

          {
            // Recommended by claude when I was debugging
            submitStatus && (
              <p
                className={`mb-4 text-sm font-semibold ${
                  submitStatus.type === 'success' ? 'text-[#247f3d]' : 'text-red-500'
                }`}
              >
                {submitStatus.text}
              </p>
            )
          }

          {/* AI PRICE ESTIMATE */}
          <PriceEstimateDisplay
            estimate={gotEstimate}
            loading={estimateLoading}
            error={estimateError}
            handlePostCar={handlePostCar}
          />

          {/* BUTTONS AREA */}
          <div className="mt-2.5 flex justify-end gap-3 border-t border-[#e8ebe8] pt-6.25 max-[700px]:flex-col max-[700px]:justify-stretch">
            {/* ESTIMATE BUTTON */}
            <button
              type="button"
              onClick={handleEstimate}
              disabled={estimateLoading}
              className="mr-auto inline-block rounded-[7px] bg-[#247f3d] px-5.5 py-3.25 text-sm font-bold text-white transition duration-200 hover:bg-[#1b6730] disabled:cursor-not-allowed disabled:opacity-60 max-[700px]:mr-0 max-[700px]:w-full max-[700px]:text-center"
            >
              {estimateLoading ? 'Estimating…' : 'Estimate Price'}
            </button>
            {/* SUBMIT BUTTON */}
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

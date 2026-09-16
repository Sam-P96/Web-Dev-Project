import React, { useState } from 'react';
import { z } from 'zod';
import { fi } from 'zod/v4/locales';

const inputClasses =
  'w-full h-12 p-4 border border-[#d8dcd8] rounded-[7px] outline-none text-sm bg-white focus:border-[#247f3d] focus:shadow-[0_0_0_3px_rgba(36,127,61,0.1)]';
const labelClasses = 'block text-sm font-bold mb-2';

const UserFormSchema = z
  .object({
    firstName: z.string().min(3, 'must be at least 3 character'),
    lastName: z.string().min(3, 'must be at least 3 characters'),
    email: z.email('Invalid email'),
    password: z.string().min(6, 'must be at least 6 digits'),
    confirmPassword: z.string().min(6, 'must be at least 6 digit'),
    dob: z.string().min(1, 'Please select the date'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'password must match',
    path: ['confirmPassword'],
  });

export const UserForm = () => {
  const [errors, setErrors] = useState('');

  const handleChange = (e) => {
    const fieldName = e.target.name;
    const fieldValue = e.target.value;
    const fieldSchema = UserFormSchema.shape[fieldName];

    if (fieldSchema) {
      const validate = fieldSchema.safeParse(fieldValue);
      if (!validate.success) {
        const errorsMessage = validate.error.issues[0].message;
        setErrors((prev) => ({ ...prev, [fieldName]: errorsMessage }));
      } else {
        setErrors((prev) => ({ ...prev, [fieldName]: '' }));
      }
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const values = Object.fromEntries(formData.entries());

    const result = UserFormSchema.safeParse(values);
    if (!result.success) {
      const errors = z.flattenError(result.error).fieldErrors;
      setErrors({
        firstName: errors.firstName?.[0] || '',
        lastName: errors.lastName?.[0] || '',
        email: errors.email?.[0] || '',
        password: errors.password?.[0] || '',
        confirmPassword: errors.confirmPassword?.[0] || '',
        dob: errors.dob?.[0] || '',
      });
    } else {
      console.log(result.data);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-5 ">
      <main className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8">
        <form onSubmit={handleSubmit} className="">
          {/* User INFORMATION */}
          <div className="text-center mb-5 ">
            <p className="text-sm font-semibold text-[#2f9449] p-5">USER INFORMATION</p>
            <h2 className="text-4xl font-bold">Create Your Account</h2>
          </div>
          <div className=" grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
            <div>
              <label htmlFor="firstName" className="block text-sm font-bold mb-2">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                onChange={handleChange}
                placeholder="e.g. John"
                className={`w-full h-12 p-4 border border-[#d8dcd8] rounded-[7px] outline-none text-sm bg-white focus:border-[#247f3d] focus:shadow-[0_0_0_3px_rgba(36,127,61,0.1)] ${errors.firstName ? 'border-red-500' : 'border-[#d8dcd8] focus:border-[#247f3d]'}`}
              />
              {errors.firstName && <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>}
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-bold mb-2">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                onChange={handleChange}
                placeholder="e.g. Doe"
                className={`w-full h-12 p-4 border border-[#d8dcd8] rounded-[7px] outline-none text-sm bg-white focus:border-[#247f3d] focus:shadow-[0_0_0_3px_rgba(36,127,61,0.1)] ${errors.lastName ? 'border-red-500' : 'border-[#d8dcd8] focus:border-[#247f3d]'} `}
              />
              {errors.lastName && <p className="mt-1 text-xs text-red-500">{errors.lastName}</p>}
            </div>

            <div className="md:col-span-2">
              <label htmlFor="address" className="block text-sm font-bold mb-1.75">
                Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                placeholder="e.g. 123 Main St"
                className={inputClasses}
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="email" className="block text-sm font-bold mb-1.75">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                onChange={handleChange}
                placeholder="e.g. john.doe@example.com"
                className={`${inputClasses} ${errors.email ? 'border-red-500' : 'border-[#d8dcd8] focus:border-[#247f3d]'}`}
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>
            <div className="">
              <label htmlFor="password" className={labelClasses}>
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                onChange={handleChange}
                placeholder="Create a strong password"
                className={`${inputClasses} ${errors.password ? 'border-red-500' : 'border-[#d8dcd8] focus:border-[#247f3d]'}`}
              />
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
            </div>
            <div className="">
              <label htmlFor="confirmPassword" className={labelClasses}>
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm your password"
                onChange={handleChange}
                className={`${inputClasses} ${errors.confirmPassword ? 'border-red-500' : 'border-[#d8dcd8] focus:border-[#247f3d]'}`}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className={labelClasses}>
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                placeholder="+358..."
                className={inputClasses}
              />
            </div>

            <div>
              <label htmlFor="dob" className={labelClasses}>
                Date of Birth
              </label>
              <input
                type="date"
                id="dob"
                name="dob"
                onChange={handleChange}
                className={`${inputClasses} ${errors.dob ? 'border-red-500' : 'border-[#d8dcd8] focus:border-[#247f3d]'}`}
              />
              {errors.dob && <p className="mt-1 text-xs text-red-500">{errors.dob}</p>}
            </div>
          </div>
          {/* SUBMIT */}
          <div className="flex items-center justify-center p-4">
            <button
              type="submit"
              className="w-50 border-none  rounded-[7px] bg-[#247f3d] text-white text-lg font-bold cursor-pointer p-4 mt-8 hover:bg-[#1b6730] "
            >
              Submit
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default UserForm;

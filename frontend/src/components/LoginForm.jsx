import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { z } from 'zod';

const LoginSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(6, 'must be at least 6 characters'),
});

const LoginForm = () => {
  const [errors, setErrors] = useState('');

  const handleChange = (e) => {
    const fieldName = e.target.name;
    const fieldValue = e.target.value;
    const fieldSchema = LoginSchema.shape[fieldName];

    if (fieldSchema) {
      const validate = fieldSchema.safeParse(fieldValue);
      // console.log(validate);
      if (!validate.success) {
        const errorMessage = validate.error.issues[0].message;
        setErrors((prev) => ({ ...prev, [fieldName]: errorMessage }));
      } else {
        setErrors((prev) => ({ ...prev, [fieldName]: '' }));
      }
    }
    // console.log(fieldSchema);

    // const validate = LoginSchema.safeParse(field);
    // console.log(field);
    // console.log(validate);
    // if (!validate.success) {
    //   const flattened = z.flattenError(validate.error);
    //   const fieldErrors = flattened.fieldErrors;
    //   // console.log(flattened);
    //   // console.log(fieldErrors);
    //   setErrors({
    //     field: fieldErrors.field ? fieldErrors.field[0] : '',
    //   });
    // } else {
    //   setErrors({});
    // }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const values = Object.fromEntries(formData.entries());
    const validate = LoginSchema.safeParse(values);

    if (!validate.success) {
      const error = z.flattenError(validate.error).fieldErrors;

      setErrors({
        email: error.email?.[0] || '',
        password: error.password?.[0] || '',
      });
      return;
    }
    console.log('sending to server:', validate.data);
  };

  return (
    <div>
      <main className="min-h-162.5 bg-[#f5f6f4] flex justify-center items-center px-5 py-15 max-[600px]:px-3.75 max-[600px]:py-10">
        <div className=" w-full max-w-115 bg-white border border-[#e3e6e2] rounded-[14px] p-10 shadow-[0_10px_30px_rgba(0,0,0,0.06)] max-[600px]:px-5.5 max-[600px]:py-7">
          <div className="text-center mb-7.5">
            <p className="text-[#2f9449] text-xs font-extrabold tracking-[1.5px]">
              WELCOME BACK
            </p>
            <h1 className="text-[30px] font-bold mt-1.25 mb-2 max-[600px]:text-[26px]">
              Login to AutoTori
            </h1>
            <p className="text-[#777d78] text-sm">
              Sign in to manage your cars and account.
            </p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label
                htmlFor="email"
                className="block text-sm font-bold mb-1.75"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                required=""
                onChange={handleChange}
                className={`w-full h-12 px-3.75 border border-[#d8dcd8] rounded-[7px]
                  outline-none text-sm bg-white
                  focus:border-[#247f3d] focus:shadow-[0_0_0_3px_rgba(36,127,61,0.1)] ${errors.email ? 'border-red-500' : 'border-[#d8dcd8] focus:border-[#247f3d]'}`}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">{errors.email}</p>
              )}
            </div>
            <div className="mb-5">
              <label
                htmlFor="password"
                className="block text-sm font-bold mb-1.75"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                required=""
                onChange={handleChange}
                className={`w-full h-12 px-3.75 border border-[#d8dcd8] rounded-[7px]
                  outline-none text-sm bg-white
                  focus:border-[#247f3d] focus:shadow-[0_0_0_3px_rgba(36,127,61,0.1)] ${errors.password ? 'border-red-500' : 'border-[#d8dcd8] focus:border-[#247f3d]'}`}
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">{errors.password}</p>
              )}
            </div>
            <div
              className="flex justify-between items-center mt-1.25 mb-5.5 text-[13px]
                max-[600px]:items-start max-[600px]:gap-3.75"
            >
              <label className="flex items-center gap-1.75 text-[#555b57]">
                <input type="checkbox" name="remember" />
                Remember me
              </label>
              <a href="#" className="text-[#247f3d] font-semibold">
                Forgot password?
              </a>
            </div>
            <button
              type="submit"
              className="w-full h-12 border-none rounded-[7px] bg-[#247f3d] text-white
                text-[15px] font-bold cursor-pointer
                hover:bg-[#1b6730]"
            >
              Login
            </button>
          </form>
          <div className="flex items-center gap-3.75 my-7 text-[#999f9a] text-[11px]">
            <span className="flex-1 h-px bg-[#e2e5e2]" />
            OR
            <span className="flex-1 h-px bg-[#e2e5e2]" />
          </div>
          <div className="text-center text-[#707671] text-[13px]">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#247f3d] font-bold">
              Create Account
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};
export default LoginForm;

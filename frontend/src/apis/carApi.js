//This is car api.js

const BASE_URL = 'http://localhost:3000/cars';

export const getAllCars = async () => {
  try {
    const res = await fetch(`${BASE_URL}`);
    const data = await res.json();
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const createCar = async (carData) => {
  try {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(carData),
    });
    const data = await res.json(); // turn the response text into an object
    // fetch does NOT throw on 400 errors, so we pass res.ok (true for 2xx) to the form
    return { ok: res.ok, data };
  } catch (error) {
    // Only runs if the server couldn't be reached at all (or the reply wasn't JSON)
    console.error('Error: ', error);
    // Same { ok, data } shape as above, so the form can always check result.ok
    return { ok: false, data: { message: 'Could not reach the server' } };
  }
};

export const updateCar = async (id, status) => {
  try {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        isVerified: status,
      }),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};
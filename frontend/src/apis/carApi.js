//This is car api.ts

const BASE_URL = 'http://localhost:3000/cars';
// console.log(BASE_URL);

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

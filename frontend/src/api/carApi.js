//This is car api.js
import { apiFetch } from './client';

// GET is public; POST/PUT need a token (sent automatically by apiFetch)

export const getAllCars = async () => {
  const { ok, data } = await apiFetch('/cars');
  if (!ok) {
    console.log(data);
    return [];
  }
  return data;
};

// Returns { ok, data } so the form can check result.ok
// (server sets the owner from the token; any `client` in carData is ignored)
export const createCar = async (carData) => {
  const { ok, data } = await apiFetch('/cars', { method: 'POST', body: carData });
  return { ok, data };
};

export const updateCar = async (id, status) => {
  const { data } = await apiFetch(`/cars/${id}`, {
    method: 'PUT',
    body: { isVerified: status },
  });
  return data;
};

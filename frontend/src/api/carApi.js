//This is car api.js
import { apiFetchFormData, apiFetch } from './client';

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
export const createCar = async (formData) => {
  const { ok, data } = await apiFetchFormData('/cars', formData);
  return { ok, data };
};

export const updateCar = async (id, status) => {
  const { data } = await apiFetch(`/cars/${id}`, {
    method: 'PUT',
    body: { isVerified: status },
  });
  return data;
};

export const getCarById = async (id) => {
  const { ok, data } = await apiFetch(`/cars/${id}`);
  if (!ok) {
    console.log(data);
    return [];
  }
  return data;
};

// Ridhi's search (GET /cars/search is public)
export async function searchCars(filters) {
  const params = new URLSearchParams();

  if (filters.make) params.append("make", filters.make);
  if (filters.model) params.append("model", filters.model);
  if (filters.minPrice) params.append("minPrice", filters.minPrice);
  if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);
  if (filters.minYear) params.append("minYear", filters.minYear);
  if (filters.maxYear) params.append("maxYear", filters.maxYear);

  const { ok, data } = await apiFetch(`/cars/search?${params.toString()}`);
  if (!ok) {
    console.log(data);
    return [];
  }
  return data;
}
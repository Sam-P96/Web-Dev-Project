export async function searchCars(filters) {
  const params = new URLSearchParams();

  if (filters.make) params.append("make", filters.make);
  if (filters.model) params.append("model", filters.model);
  if (filters.minPrice) params.append("minPrice", filters.minPrice);
  if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);
  if (filters.minYear) params.append("minYear", filters.minYear);
  if (filters.maxYear) params.append("maxYear", filters.maxYear);

  const response = await fetch(`http://localhost:3000/cars/search?${params.toString()}`);
  const data = await response.json();
  return data;
}

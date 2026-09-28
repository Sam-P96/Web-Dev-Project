export async function searchCars(filters) {
    const queryParams = new URLSearchParams(filters).toString();
    const response = await fetch(`http://localhost:3000/cars/search?${queryParams}`);
    const data = await response.json();
    return data;

}
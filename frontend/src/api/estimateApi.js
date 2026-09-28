const API = import.meta.env.VITE_API_URL || '/api';


export const estimatePrice = async (carData) => {
  try {
    const response = await fetch(`${API}/ai/estimate-price`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(carData),
    });

    const data = await response.json();
    return { ok: response.ok, data };
  } catch (error) {
    return { ok: false, data: { message: error.message } };
  }
};

// Asked claude to debug, it says to remove this.. but I will keep this here cus why not?
// less likely to experience errors this way. I think.
export default estimatePrice
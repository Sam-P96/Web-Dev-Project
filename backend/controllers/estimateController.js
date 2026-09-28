import askGemini from '../gemini/gemini.js';

// Cleaning the response (suggested by claude)
const parseJsonFromAI = (text) => {
  const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    return null;
  }
};


// POST /api/ai/estimate-price
// Body: { make, model, year, mileage, fuel, transmission, condition, location, description }
const estimateCarPrice = async (req, res) => {
  const {
    make,
    model: carModel,
    year,
    mileage,
    fuel,
    transmission,
    condition,
    location,
    description,
  } = req.body;

  // makes sure all inputs are there before wasting tokens
  if (!make || !carModel || !year || !mileage || !fuel || !transmission || !condition) {
    return res.status(400).json({ message: 'All car details are required.' });
  }

  // Had claude generated this cus IDK how to make sure its awlays consistent, but this works! :D
  const prompt = `
    You are a car valuation assistant for a used-car dealership in Finland.

    Estimate the value of this car in euros:
    - Make: ${make}
    - Model: ${carModel}
    - Year: ${year}
    - Mileage: ${mileage} km
    - Fuel: ${fuel}
    - Transmission: ${transmission}
    - Condition claimed by the seller: ${condition}
    - Location: ${location || 'Finland'}
    - Seller's description: ${description || 'none given'}

    Reply with ONLY a JSON object. No markdown, no code fences, no extra text.
    Use exactly this shape:
    {
      "estimatedPrice": <whole number, realistic market price in euros>,
      "minimumOffer": <whole number, roughly 80-90% of estimatedPrice>,
      "claim": "<one sentence describing the condition the seller claims, which the car must actually match>",
      "summary": "<one or two sentences explaining how you reached this estimate>"
    }

    Use whole numbers only. No currency symbols, no thousands separators.
  `;

  try {
    const result = await askGemini(prompt);
    const estimate = parseJsonFromAI(result.text);

    // Just incase the response is broken somehow. Sometimes you just need to reenter the thing, cus it doesn't always work. AI..
    if (!estimate || typeof estimate.estimatedPrice !== 'number') {
      return res.status(502).json({ message: 'Could not read the AI response. Please try again.' });
    }

    res.json(estimate);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default estimateCarPrice;
import { GoogleGenAI } from '@google/genai';


// Always check the damn model's name! Anyway, the other one didnt work, so I used this instead
const MODEL_NAME = 'models/gemini-3.8-flash';

// ignore this
// const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

//Claude suggested changes: 
let genAI = null;

const getClient = () => {
  if (!genAI) {
    genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return genAI;
};

// Takes string and returns google's response object
const askGemini = async (prompt) => {
  const contents = [{ role: 'user', parts: [{ text: prompt }] }];

  try {
    const response = await getClient().models.generateContent({
      model: MODEL_NAME,
      contents,
      // apparently this changes the answer up a little bit, so its not always the same
      config: { temperature: 0.1 },
    });

    return response; // full object, so the controller can read result.text
  } catch (error) {
    console.error('GEMINI API error:', error);
    throw error;
  }
};

export default askGemini;
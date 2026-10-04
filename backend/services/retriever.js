import KbChunk from "../models/kbChunkModel.js";
import { embed, EMBED_MODEL } from "./llm.js";

/* Finds the FAQ chunks closest to a question.
The whole knowledge base is small (tens of chunks), so it is kept in memory and compared with
plain cosine similarity: no vector database needed. If it ever grows to thousands of chunks,
replace search() with MongoDB Atlas $vectorSearch. */

const TOP_K = 3;
// Below this the chunk is unrelated to the question; better no context than a misleading one.
// Measured with gemini-embedding-001: matching questions ~0.70-0.77, off-topic ones ~0.50-0.54
const MIN_SCORE = 0.6;

let chunksPromise = null;

// Loaded once, on the first question (restart the server after `npm run ingest`)
const loadChunks = () => {
  chunksPromise ??= KbChunk.find({}, { section: 1, question: 1, text: 1, embedding: 1, embedModel: 1 })
    .lean()
    .then((chunks) => {
      if (chunks.length === 0) console.warn("Knowledge base is empty: run `npm run ingest`");
      const outdated = chunks.find((chunk) => chunk.embedModel !== EMBED_MODEL);
      if (outdated) {
        throw new Error(`Knowledge base was embedded with ${outdated.embedModel}, not ${EMBED_MODEL}: run \`npm run ingest\``);
      }
      return chunks;
    })
    .catch((err) => {
      chunksPromise = null; // retry on the next question instead of caching the failure
      throw err;
    });
  return chunksPromise;
};

const cosineSimilarity = (a, b) => {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return normA && normB ? dot / Math.sqrt(normA * normB) : 0;
};

// -> [{ section, question, text, score }], best first
const search = async (query, k = TOP_K) => {
  const chunks = await loadChunks();
  if (chunks.length === 0) return [];

  const [queryVector] = await embed([query], "RETRIEVAL_QUERY");

  return chunks
    .map(({ section, question, text, embedding }) => ({
      section,
      question,
      text,
      score: cosineSimilarity(queryVector, embedding),
    }))
    .filter((chunk) => chunk.score >= MIN_SCORE)
    .sort((a, b) => b.score - a.score)
    .slice(0, k);
};

// Tests insert their own chunks and need a fresh load
const clearCache = () => {
  chunksPromise = null;
};

export { search, cosineSimilarity, clearCache };

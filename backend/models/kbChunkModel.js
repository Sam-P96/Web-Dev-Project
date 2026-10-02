import mongoose from "mongoose";

/* One chunk of the chatbot knowledge base (backend/knowledge/autotori-faq.md), written by `npm run ingest`.
One "### question" of the FAQ = one chunk.

Fields:
    section     the "## " heading, sent to the frontend as a source
    question    the "### " heading
    text        what gets embedded and given to the LLM ("section > question" + answer)
    hash        sha256 of embedModel + text: unchanged chunks are not embedded again
    embedding   vector from the embedding model
    embedModel  which model made the vector: queries must be embedded with the same one
*/
const kbChunkSchema = new mongoose.Schema(
  {
    section: { type: String, required: true },
    question: { type: String, required: true },
    text: { type: String, required: true },
    hash: { type: String, required: true, unique: true },
    embedding: { type: [Number], required: true },
    embedModel: { type: String, required: true },
  },
  { timestamps: true }
);

const KbChunk = mongoose.model("KbChunk", kbChunkSchema);

export default KbChunk;

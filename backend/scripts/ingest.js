import "dotenv/config";
import mongoose from "mongoose";
import { readFile } from "node:fs/promises";
import { getMongoUri } from "../db.js";
import KbChunk from "../models/kbChunkModel.js";
import { parseFaq, chunkHash } from "../services/knowledge.js";
import { embed, EMBED_MODEL } from "../services/llm.js";

/* Loads backend/knowledge/autotori-faq.md into the kbchunks collection for the chatbot.

Usage (from backend/):
    npm run ingest

Safe to run many times: only new or changed chunks are embedded (costs API quota),
chunks removed from the FAQ are deleted. Restart the backend afterwards: the
retriever keeps the chunks in memory.
*/

const FAQ_FILE = new URL("../knowledge/autotori-faq.md", import.meta.url);

const ingest = async () => {
  const chunks = parseFaq(await readFile(FAQ_FILE, "utf8")).map((chunk) => ({
    ...chunk,
    hash: chunkHash(chunk.text, EMBED_MODEL),
  }));
  if (chunks.length === 0) throw new Error("No chunks found: the FAQ needs '## section' and '### question' headings");

  const existing = new Set((await KbChunk.find({}, { hash: 1 })).map((chunk) => chunk.hash));
  const toEmbed = chunks.filter((chunk) => !existing.has(chunk.hash));

  if (toEmbed.length > 0) {
    const vectors = await embed(toEmbed.map((chunk) => chunk.text), "RETRIEVAL_DOCUMENT");
    await KbChunk.insertMany(
      toEmbed.map((chunk, i) => ({ ...chunk, embedding: vectors[i], embedModel: EMBED_MODEL }))
    );
  }

  const { deletedCount } = await KbChunk.deleteMany({ hash: { $nin: chunks.map((chunk) => chunk.hash) } });

  console.log(
    `${chunks.length} chunks in the FAQ: ${toEmbed.length} embedded with ${EMBED_MODEL}, ` +
      `${chunks.length - toEmbed.length} unchanged, ${deletedCount} removed.`
  );
};

const uri = getMongoUri();
if (!uri) {
  console.error("MONGODB_URI is not set in .env");
  process.exit(1);
}

try {
  await mongoose.connect(uri);
  console.log(`Connected to ${mongoose.connection.host}/${mongoose.connection.name}`);
  await ingest();
} catch (err) {
  console.error(`Ingest failed: ${err.message}`);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}

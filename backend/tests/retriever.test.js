import KbChunk from "../models/kbChunkModel.js";
import { embed, EMBED_MODEL } from "../services/llm.js";
import { search, cosineSimilarity, clearCache } from "../services/retriever.js";
import { clearDatabase } from "./helpers.js";

// Real test database, fake embeddings: 2-dimensional vectors are enough to check the ranking
vi.mock("../services/llm.js");

const addChunk = (section, embedding, embedModel = EMBED_MODEL) =>
  KbChunk.create({ section, question: `${section}?`, text: `${section} text`, hash: section, embedding, embedModel });

beforeEach(async () => {
  await clearDatabase();
  clearCache();
  embed.mockReset();
});

describe("cosineSimilarity", () => {
  it("is 1 for the same direction, 0 for perpendicular vectors", () => {
    expect(cosineSimilarity([1, 2], [2, 4])).toBeCloseTo(1);
    expect(cosineSimilarity([1, 0], [0, 1])).toBeCloseTo(0);
  });

  it("is 0 (not NaN) for a zero vector", () => {
    expect(cosineSimilarity([0, 0], [1, 1])).toBe(0);
  });
});

describe("search", () => {
  it("returns the closest chunks first and drops unrelated ones", async () => {
    await addChunk("Fees", [1, 0]);
    await addChunk("Offers", [0.8, 0.6]);
    await addChunk("Contact", [0, 1]); // perpendicular to the query -> below MIN_SCORE
    embed.mockResolvedValue([[1, 0]]);

    const results = await search("is it free");

    expect(embed).toHaveBeenCalledWith(["is it free"], "RETRIEVAL_QUERY");
    expect(results.map((r) => r.section)).toEqual(["Fees", "Offers"]);
    expect(results[0]).toMatchObject({ question: "Fees?", text: "Fees text" });
    expect(results[0].embedding).toBeUndefined();
  });

  it("returns at most k chunks", async () => {
    await addChunk("A", [1, 0]);
    await addChunk("B", [1, 0.1]);
    await addChunk("C", [1, 0.2]);
    embed.mockResolvedValue([[1, 0]]);

    expect(await search("q", 2)).toHaveLength(2);
  });

  it("returns [] without calling the embedding API when the knowledge base is empty", async () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(await search("anything")).toEqual([]);
    expect(embed).not.toHaveBeenCalled();
  });

  it("refuses chunks embedded with another model", async () => {
    await addChunk("Old", [1, 0], "some-old-model");
    await expect(search("q")).rejects.toThrow(/npm run ingest/);
  });
});

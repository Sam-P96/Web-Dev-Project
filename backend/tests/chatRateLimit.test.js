import { api } from "./helpers.js";
import { chat } from "../services/llm.js";

vi.mock("../services/llm.js");
beforeEach(() => chat.mockResolvedValue("Mock reply"));

// Own file on purpose: the limiter's counter lives in memory for the whole test file,
// and Vitest reloads modules per file -> this file starts with a fresh counter.
const LIMIT = 20;
const body = { messages: [{ role: "user", content: "hi" }] };

describe("POST /api/chat rate limit", () => {
  it(`returns 429 { error } after ${LIMIT} requests`, async () => {
    for (let i = 0; i < LIMIT; i++) {
      await api.post("/api/chat").send(body).expect(200);
    }

    const res = await api.post("/api/chat").send(body).expect(429).expect("Content-Type", /json/);
    expect(res.body.error).toEqual(expect.any(String));
    expect(res.headers["ratelimit"]).toBeDefined();
  });

  it("does not rate limit the rest of the API", async () => {
    // the chat limit is already used up by the test above
    await api.post("/api/chat").send(body).expect(429);
    await api.get("/api/cars").expect(200);
  });
});

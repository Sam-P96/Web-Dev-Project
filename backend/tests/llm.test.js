import { chat, toContents } from "../services/llm.js";

// The Gemini SDK is replaced by a fake: these tests check our tool loop, never the real API
const { generateContent } = vi.hoisted(() => ({ generateContent: vi.fn() }));
vi.mock("@google/genai", () => ({
  GoogleGenAI: class {
    models = { generateContent };
  },
}));

describe("toContents", () => {
  it("maps assistant to Gemini's 'model' role", () => {
    expect(toContents([
      { role: "user", content: "hi" },
      { role: "assistant", content: "hello" },
      { role: "user", content: "help" },
    ])).toEqual([
      { role: "user", parts: [{ text: "hi" }] },
      { role: "model", parts: [{ text: "hello" }] },
      { role: "user", parts: [{ text: "help" }] },
    ]);
  });

  it("drops assistant messages before the first user message", () => {
    expect(toContents([
      { role: "assistant", content: "old answer" },
      { role: "user", content: "hi" },
    ])).toEqual([{ role: "user", parts: [{ text: "hi" }] }]);
  });

  it("merges consecutive messages with the same role", () => {
    expect(toContents([
      { role: "user", content: "first try" },
      { role: "user", content: "second try" },
    ])).toEqual([{ role: "user", parts: [{ text: "first try" }, { text: "second try" }] }]);
  });
});

describe("chat tool loop", () => {
  const tools = [{ name: "search_knowledge_base", description: "Search the FAQ", parameters: { type: "object" } }];
  const messages = [{ role: "user", content: "Is it free?" }];

  const toolCall = (query) => ({
    functionCalls: [{ id: "call-1", name: "search_knowledge_base", args: { query } }],
    candidates: [{ content: { role: "model", parts: [{ functionCall: { name: "search_knowledge_base", args: { query } } }] } }],
  });
  const answer = (text) => ({ text, candidates: [{ content: { role: "model", parts: [{ text }] } }] });

  beforeEach(() => {
    vi.stubEnv("LLM_API_KEY", "test-key");
    generateContent.mockReset();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("runs the requested tool, sends the result back and returns the final answer", async () => {
    generateContent.mockResolvedValueOnce(toolCall("fees")).mockResolvedValueOnce(answer("  It is free.  "));
    const runTool = vi.fn().mockResolvedValue({ results: ["Fees > Is it free?\nYes."] });

    const reply = await chat({ system: "prompt", messages, tools, runTool });

    expect(reply).toBe("It is free.");
    expect(runTool).toHaveBeenCalledWith("search_knowledge_base", { query: "fees" });

    const secondRequest = generateContent.mock.calls[1][0];
    expect(secondRequest.contents.at(-1)).toEqual({
      role: "user",
      parts: [{ functionResponse: { id: "call-1", name: "search_knowledge_base", response: { results: ["Fees > Is it free?\nYes."] } } }],
    });
    expect(secondRequest.config.tools[0].functionDeclarations[0]).toMatchObject({ name: "search_knowledge_base" });
  });

  it("stops after 3 tool rounds and forces an answer", async () => {
    generateContent
      .mockResolvedValueOnce(toolCall("a"))
      .mockResolvedValueOnce(toolCall("b"))
      .mockResolvedValueOnce(toolCall("c"))
      .mockResolvedValueOnce(answer("Final answer"));
    const runTool = vi.fn().mockResolvedValue({ results: [] });

    expect(await chat({ system: "prompt", messages, tools, runTool })).toBe("Final answer");
    expect(runTool).toHaveBeenCalledTimes(3);
    expect(generateContent).toHaveBeenCalledTimes(4);
    expect(generateContent.mock.calls[3][0].config.toolConfig).toEqual({ functionCallingConfig: { mode: "NONE" } });
  });

  it("throws on an empty answer (e.g. blocked by the safety filter)", async () => {
    generateContent.mockResolvedValueOnce({ text: undefined, candidates: [{ finishReason: "SAFETY" }] });
    await expect(chat({ system: "prompt", messages })).rejects.toThrow(/SAFETY/);
  });
});

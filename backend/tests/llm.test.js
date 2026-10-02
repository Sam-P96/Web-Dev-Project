import { toContents } from "../services/llm.js";

// Only the pure history -> Gemini format conversion; chat() itself is never called in tests

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

import { parseFaq, chunkHash } from "../services/knowledge.js";

describe("parseFaq", () => {
  it("makes one chunk per ### question, prefixed with its ## section", () => {
    const markdown = `<!-- team note: ignore me -->
# AutoTori FAQ

## Fees

### Is it free?
Yes.

It costs nothing.

### Empty question?

## Contact
### How do I contact you?
Email us.`;

    expect(parseFaq(markdown)).toEqual([
      { section: "Fees", question: "Is it free?", text: "Fees > Is it free?\nYes.\n\nIt costs nothing." },
      { section: "Contact", question: "How do I contact you?", text: "Contact > How do I contact you?\nEmail us." },
    ]);
  });
});

describe("chunkHash", () => {
  it("changes when the text or the embedding model changes", () => {
    const hash = chunkHash("text", "model-a");
    expect(chunkHash("text", "model-a")).toBe(hash);
    expect(chunkHash("text!", "model-a")).not.toBe(hash);
    expect(chunkHash("text", "model-b")).not.toBe(hash);
  });
});

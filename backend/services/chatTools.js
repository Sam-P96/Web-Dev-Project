import { search } from "./retriever.js";

/* Tools the LLM may call (function calling). Every tool is read-only: even a prompt injection
can only make the bot read public information. search_cars comes in Phase 4. */

const MAX_QUERY_LENGTH = 500;

const TOOLS = [
  {
    name: "search_knowledge_base",
    description:
      "Search the AutoTori help center (FAQ) about selling a car, price estimates, offers, appointments, " +
      "accounts, privacy, fees and contact details. Use it before answering any question about AutoTori.",
    parameters: {
      type: "object",
      properties: {
        query: { type: "string", description: "The user's question, rephrased as a short search query in English" },
      },
      required: ["query"],
    },
  },
];

// -> { output, sources }: output goes back to the LLM, sources (FAQ sections) go to the frontend.
// Never throws for bad input from the model: it gets an error message and can try again.
const runTool = async (name, args) => {
  if (name === "search_knowledge_base") {
    const query = typeof args.query === "string" ? args.query.trim().slice(0, MAX_QUERY_LENGTH) : "";
    if (!query) return { output: { error: "query must be a non-empty string" }, sources: [] };

    const chunks = await search(query);
    if (chunks.length === 0) return { output: { results: [], note: "Nothing found in the help center." }, sources: [] };

    return {
      output: { results: chunks.map(({ text }) => text) },
      sources: chunks.map(({ section }) => section),
    };
  }

  return { output: { error: `Unknown tool: ${name}` }, sources: [] };
};

export { TOOLS, runTool };

import { GoogleGenAI } from "@google/genai";

/* The only file that knows which LLM provider we use (Gemini).
Switching provider = rewrite this file, keep the same chat() signature.

chat({ system, messages, tools, runTool }) -> reply text
    system      system prompt (string)
    messages    [{ role: "user" | "assistant", content }] (already validated by the controller)
    tools       optional [{ name, description, parameters (JSON schema) }]
    runTool     async (name, args) => result object, called when the model asks for a tool

embed(texts, taskType) -> one vector per text
    taskType    "RETRIEVAL_DOCUMENT" for the knowledge base, "RETRIEVAL_QUERY" for user questions

Both throw on any provider problem (missing key, timeout, quota, empty answer); the controller turns that into 502.
*/

// Fast (~1s), no thinking step, works on the free tier (checked 2026-10-02: 2.5-flash is closed
// to new keys, 3.8-flash was overloaded). Override with LLM_MODEL in .env.
const MODEL = process.env.LLM_MODEL || "gemini-3.5-flash-lite";
const TIMEOUT_MS = 15_000;
// The model may call tools a few times before answering; never loop forever
const MAX_TOOL_ROUNDS = 3;

// Changing EMBED_MODEL or EMBED_DIMENSIONS means re-running `npm run ingest`
// (the retriever refuses to compare vectors from different models)
const EMBED_MODEL = process.env.LLM_EMBED_MODEL || "gemini-embedding-001";
const EMBED_DIMENSIONS = 768;
const EMBED_BATCH_SIZE = 100;

let client;
// Created on first use: tests mock this file, and the server can start without a key
const getClient = () => {
  if (!process.env.LLM_API_KEY) throw new Error("LLM_API_KEY is not set in .env");
  client ??= new GoogleGenAI({ apiKey: process.env.LLM_API_KEY });
  return client;
};

// Gemini calls the assistant "model" and expects the conversation to start with the user
// and to alternate roles. Our history can break that (sliced to 10, or two user messages
// in a row after a failed request) -> drop leading assistant turns and merge same-role turns.
const toContents = (messages) => {
  const contents = [];
  for (const { role, content } of messages) {
    const geminiRole = role === "assistant" ? "model" : "user";
    if (contents.length === 0 && geminiRole === "model") continue;

    const last = contents.at(-1);
    if (last?.role === geminiRole) last.parts.push({ text: content });
    else contents.push({ role: geminiRole, parts: [{ text: content }] });
  }
  return contents;
};

const chat = async ({ system, messages, tools = [], runTool }) => {
  const contents = toContents(messages);
  const toolConfig = tools.length
    ? { tools: [{ functionDeclarations: tools.map(({ name, description, parameters }) => ({ name, description, parametersJsonSchema: parameters })) }] }
    : {};

  for (let round = 0; ; round++) {
    const canUseTools = round < MAX_TOOL_ROUNDS;
    const response = await getClient().models.generateContent({
      model: MODEL,
      contents,
      config: {
        systemInstruction: system,
        temperature: 0.3, // support answers: consistent rather than creative
        httpOptions: { timeout: TIMEOUT_MS },
        ...toolConfig,
        // Last round: tools stay declared (the history contains tool calls) but the model must answer
        ...(tools.length && !canUseTools && { toolConfig: { functionCallingConfig: { mode: "NONE" } } }),
      },
    });

    const calls = response.functionCalls;
    if (canUseTools && calls?.length) {
      // Keep the model's turn as-is (Gemini needs its thought signatures back), then answer every call
      contents.push(response.candidates[0].content);
      const parts = [];
      for (const call of calls) {
        const result = await runTool(call.name, call.args ?? {});
        parts.push({ functionResponse: { id: call.id, name: call.name, response: result } });
      }
      contents.push({ role: "user", parts });
      continue;
    }

    const reply = response.text?.trim();
    // e.g. blocked by Gemini's safety filter
    if (!reply) throw new Error(`Empty response from ${MODEL} (finishReason: ${response.candidates?.[0]?.finishReason})`);
    return reply;
  }
};

const embed = async (texts, taskType) => {
  const vectors = [];
  for (let i = 0; i < texts.length; i += EMBED_BATCH_SIZE) {
    const response = await getClient().models.embedContent({
      model: EMBED_MODEL,
      contents: texts.slice(i, i + EMBED_BATCH_SIZE),
      config: { taskType, outputDimensionality: EMBED_DIMENSIONS, httpOptions: { timeout: TIMEOUT_MS } },
    });
    vectors.push(...response.embeddings.map((embedding) => embedding.values));
  }
  if (vectors.length !== texts.length) throw new Error(`Expected ${texts.length} embeddings, got ${vectors.length}`);
  return vectors;
};

export { chat, embed, toContents, MODEL, EMBED_MODEL };

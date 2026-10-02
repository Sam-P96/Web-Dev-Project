import { GoogleGenAI } from "@google/genai";

/* The only file that knows which LLM provider we use (Gemini).
Switching provider = rewrite this file, keep the same chat() signature.

chat({ system, messages }) -> reply text
    system      system prompt (string)
    messages    [{ role: "user" | "assistant", content }] (already validated by the controller)
Throws on any provider problem (missing key, timeout, quota, empty answer); the controller turns that into 502.
*/

// Fast (~1s), no thinking step, works on the free tier (checked 2026-10-02: 2.5-flash is closed
// to new keys, 3.8-flash was overloaded). Override with LLM_MODEL in .env.
const MODEL = process.env.LLM_MODEL || "gemini-3.5-flash-lite";
const TIMEOUT_MS = 15_000;

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

const chat = async ({ system, messages }) => {
  const response = await getClient().models.generateContent({
    model: MODEL,
    contents: toContents(messages),
    config: {
      systemInstruction: system,
      temperature: 0.3, // support answers: consistent rather than creative
      httpOptions: { timeout: TIMEOUT_MS },
    },
  });

  const reply = response.text?.trim();
  // e.g. blocked by Gemini's safety filter
  if (!reply) throw new Error(`Empty response from ${MODEL} (finishReason: ${response.candidates?.[0]?.finishReason})`);
  return reply;
};

export { chat, toContents };

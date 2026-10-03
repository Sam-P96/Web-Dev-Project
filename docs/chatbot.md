# AutoTori Support Chatbot

An AI assistant in the bottom-right corner of every page. It answers questions about AutoTori (selling a car, price estimates, offers, appointments, accounts, privacy, fees) using the AutoTori FAQ as its only source of facts.

**What it can do**
- Answer questions in English, based on `backend/knowledge/autotori-faq.md`. Each answer lists the FAQ sections it was based on ("Sources").
- Follow a short conversation (the last 10 messages).
- Politely decline off-topic questions and ignore attempts to change its instructions.

**What it cannot do (yet)**
- Search or recommend cars for sale (see [Future work](#future-work)).
- Answer in other languages: it always replies in English.
- Remember a conversation after the browser tab is closed.

---

## Contents

- [Setup](#setup)
- [How it works](#how-it-works)
- [Updating what the bot knows](#updating-what-the-bot-knows)
- [API reference](#api-reference)
- [Testing](#testing)
- [Configuration and limits](#configuration-and-limits)
- [File overview](#file-overview)
- [Troubleshooting](#troubleshooting)
- [Future work](#future-work)

---

## Setup

You need a free Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey).

1. Add the key to `backend/.env` (see `backend/.env.example`):

   ```env
   LLM_API_KEY="your-gemini-api-key"
   ```

   The key is used **only by the backend**. Never put it in a `VITE_*` variable: Vite copies those into the JavaScript bundle that every visitor downloads.

2. Load the FAQ into MongoDB (once per database, and again after every FAQ change):

   ```bash
   cd backend
   npm run ingest
   ```

   This creates the `kbchunks` collection in the database from `MONGODB_URI`.

3. Start (or restart) the backend and frontend as usual. The chat button appears on every page.

> **Note:** `LLM_API_KEY` is separate from `GEMINI_API_KEY`, which the price estimate feature uses. Both can hold the same key.

---

## How it works

The chatbot uses **RAG** (retrieval-augmented generation). The model does not memorise the FAQ. For each question it searches the FAQ and answers using only the results.

```
ChatWidget (React)
   │  POST /api/chat  { messages: last 10 messages }
   ▼
chatRouter ── rate limit: 20 requests / 5 min / IP
   ▼
chatControllers ── validate the body, then getChatReply()
   ▼
llm.chat() ── Gemini + system prompt + tools
   │   ▲
   │   │ the model calls the tool search_knowledge_base(query)  (max 3 rounds)
   ▼   │
chatTools.runTool() → retriever.search()
                         ├─ embed the query (gemini-embedding-001)
                         └─ cosine similarity against the FAQ chunks (kbchunks, cached in memory)
                            → top 3 chunks with score ≥ 0.6
   ▼
{ reply, sources: ["Appointments", ...] }
```

Key design decisions:

- **Stateless backend.** The server stores no conversations. The frontend sends the recent history with every request. The backend still checks the limits itself (max 10 messages, 1000 characters each) because the client cannot be trusted to trim it.
- **Tool calling instead of keyword triggers.** The model decides when to search the FAQ, and it can search again with a different query if the first results do not fit.
- **No vector database.** The FAQ is about 30 chunks, so all vectors are kept in memory and compared with plain cosine similarity. If the knowledge base ever grows to thousands of chunks, switch `retriever.search()` to MongoDB Atlas `$vectorSearch`.
- **Read-only tools.** Even a successful prompt injection can only make the bot read public FAQ text.
- **One file per provider.** Only `services/llm.js` knows about Gemini. To switch provider, rewrite that file and keep the same `chat()` / `embed()` signatures.
- **Rules live in the system prompt** (`backend/prompts/systemPrompt.js`): only AutoTori topics, never promise a price, no made-up facts, English only, short answers.

---

## Updating what the bot knows

All facts come from **`backend/knowledge/autotori-faq.md`**. You do not need to change any code to teach the bot something new.

1. Edit the FAQ. Format rules:
   - `## Section` = a topic. The section name is what users see under "Sources".
   - `### Question` + the answer below it = one chunk. Keep every answer **self-contained**, because the bot may see only that one chunk.
   - `<!-- HTML comments -->` are notes for the team and are ignored.
   - English only.
2. Run `npm run ingest` (in `backend/`). Only new or changed chunks are embedded, and removed ones are deleted, so it is safe to run many times.
3. **Restart the backend.** The retriever caches the chunks in memory, and nodemon does not restart when a `.md` file changes.
4. Run `npm run eval` to check that the answers are still correct (see [Testing](#testing)).

> ⚠️ The FAQ is still a **draft**: everything marked `[PLACEHOLDER]` (e.g. the support email and phone number) must be confirmed by the Product Owner. The bot treats placeholder text as fact.

---

## API reference

### `POST /api/chat`

Public (no login needed). Rate limited.

**Request body**

```json
{
  "messages": [
    { "role": "user", "content": "How do I book an appointment?" },
    { "role": "assistant", "content": "Once your car has been submitted, ..." },
    { "role": "user", "content": "What should I bring?" }
  ]
}
```

| Rule | Value |
|---|---|
| `messages` | non-empty array, at most **10** items |
| `role` | `"user"` or `"assistant"` |
| `content` | non-empty string, at most **1000** characters |
| last message | must have `role: "user"` |

Any other fields on a message are dropped before it is sent to the model.

**Response `200`**

```json
{
  "reply": "You should bring the car, all keys, the vehicle registration certificate, service history, and a photo ID.",
  "sources": ["Appointments"]
}
```

`sources` is left out when the answer was not based on the FAQ (for example, an off-topic question).

**Errors** (always `{ "error": "message" }`)

| Status | When |
|---|---|
| `400` | Invalid body (see the rules above), or malformed JSON |
| `413` | Body too large |
| `429` | More than 20 requests in 5 minutes from the same IP. `RateLimit-*` headers say when to retry |
| `502` | The AI provider failed: missing key, timeout (15 s), quota exceeded, or Gemini overloaded. Details are logged on the server, never sent to the user |

**Example**

```bash
curl -X POST http://localhost:4000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Do you charge any fees?"}]}'
```

---

## Testing

### Unit and integration tests: `npm test`

`backend/tests/chat.test.js`, `chatRateLimit.test.js` and `chatTools.test.js` cover validation, error responses, rate limiting and the tool logic.

They **never call the real Gemini API**: `services/llm.js` is mocked with `vi.mock`. That keeps them free and deterministic, and they work in CI without a key.

### Answer quality: `npm run eval`

`backend/scripts/eval.js` sends the 30 questions from `backend/eval/chatbot-eval.json` through the **real** pipeline (Gemini + knowledge base). The questions cover FAQ topics, multi-turn conversations, off-topic questions, prompt injection, price guarantees and other languages.

```bash
cd backend
npm run eval                # all cases
npm run eval -- faq inj     # only cases whose id or category contains "faq" or "inj"
```

- Each case can have automatic checks: `sources` (expected FAQ sections), `noSources`, `mustMatch` and `mustNotMatch` (case-insensitive regexes).
- A Markdown report with every question and answer is written to `backend/eval/results/` (git-ignored). The automatic checks are only a first filter, so **read the report and grade the answers by hand.**
- Run it after every change to the system prompt or the FAQ.
- It calls the pipeline directly (no HTTP, no rate limit), costs about 3 API calls per case and waits 4 s between cases to stay within the free tier. It needs `npm run ingest` first.

Last run (2026-10-03): **30/30** automatic checks passed. Manual grading found no wrong answers apart from the placeholder contact details.

---

## Configuration and limits

Environment variables (`backend/.env`):

| Variable | Required | Default | Notes |
|---|---|---|---|
| `LLM_API_KEY` | yes | — | Gemini API key |
| `LLM_MODEL` | no | `gemini-3.5-flash-lite` | Chosen for speed (~1–3 s per answer) and free-tier availability |
| `LLM_EMBED_MODEL` | no | `gemini-embedding-001` | Changing it requires `npm run ingest` again |

Constants in code:

| Setting | Value | Where |
|---|---|---|
| History sent per request | 10 messages | `MAX_HISTORY` in `chatConstants.js` (FE), `MAX_MESSAGES` in `chatControllers.js` (BE) |
| Message length | 1000 characters | `MAX_MESSAGE_LENGTH` (FE), `MAX_CONTENT` (BE) |
| Rate limit | 20 requests / 5 min / IP | `routes/chatRouter.js` |
| Tool rounds per answer | 3 | `MAX_TOOL_ROUNDS` in `services/llm.js` |
| Provider timeout | 15 s | `TIMEOUT_MS` in `services/llm.js` |
| Temperature | 0.3 | `services/llm.js` |
| Chunks per search | top 3, similarity ≥ 0.6 | `TOP_K`, `MIN_SCORE` in `services/retriever.js` |
| Embedding size | 768 | `EMBED_DIMENSIONS` in `services/llm.js` |

---

## File overview

**Backend**

| File | Purpose |
|---|---|
| `routes/chatRouter.js` | `POST /api/chat` + rate limiter |
| `controllers/chatControllers.js` | `validateMessages()`, `getChatReply()` (the whole pipeline without HTTP), `sendChatMessage()` |
| `prompts/systemPrompt.js` | The bot's rules |
| `services/llm.js` | Gemini client: `chat()` with the tool loop, `embed()` |
| `services/chatTools.js` | Tool definitions (`search_knowledge_base`) and `runTool()` |
| `services/retriever.js` | Loads chunks into memory, cosine similarity search |
| `services/knowledge.js` | Splits the FAQ markdown into chunks |
| `models/kbChunkModel.js` | `kbchunks` collection: section, question, text, embedding, embedModel, hash |
| `knowledge/autotori-faq.md` | **The knowledge base** |
| `scripts/ingest.js` | `npm run ingest` |
| `scripts/eval.js`, `eval/chatbot-eval.json` | `npm run eval` |

**Frontend** (`frontend/src/`)

| File | Purpose |
|---|---|
| `components/chat/ChatWidget.jsx` | Owns the chat state: messages, loading, errors, retry, unread dot. Saves the conversation in `sessionStorage`. Mounted once in `AppPrime.jsx`, outside `<Routes>`, so the chat survives page navigation |
| `components/chat/ChatWindow.jsx`, `ChatLauncher.jsx`, `MessageBubble.jsx`, … | Presentational components (no data fetching) |
| `components/chat/chatConstants.js` | Limits, welcome message, quick replies, storage key |
| `api/chatApi.js` | `sendMessage()`: turns `429` / network errors into messages for the user |

Frontend behaviour worth knowing:
- The welcome message ("How can I help you today?") is rendered by the frontend only and is **not** sent to the backend.
- The conversation is kept in `sessionStorage`. It survives a page reload and is cleared when the tab is closed.
- If a request fails, the user's message stays in the list with a retry button.

---

## Troubleshooting

| Symptom | Cause / fix |
|---|---|
| Every answer is *"The assistant is unavailable right now"* (502) | Check the backend log for `LLM error:`. Usually `LLM_API_KEY` is missing, the quota is used up, or Gemini is overloaded (503); in that case try again later |
| The bot answers *"I do not know"* to everything, and no sources are shown | The knowledge base is empty: the log says `Knowledge base is empty: run npm run ingest`. Run it, then restart the backend |
| The bot still gives an old answer after the FAQ was edited | Run `npm run ingest` **and** restart the backend |
| Log says `Knowledge base was embedded with X, not Y` | `LLM_EMBED_MODEL` changed. Run `npm run ingest` again |
| *"Too many messages. Please wait a few minutes"* | Rate limit (20 per 5 min per IP). Normal during heavy testing |

**Deployment note:** behind a reverse proxy (Render, Railway, Nginx, …), add `app.set("trust proxy", 1)` in `app.js`. Otherwise every user appears to have the proxy's IP address and they all share one rate limit.

---

## Future work

1. **Car search** (user story: *"As a buyer, I need to ask an AI shopping assistant for recommendations…"*). On hold because cars are currently submitted *to the company*, not listed for buyers. Planned design:
   - a read-only `search_cars` tool with filters (make, model, year, mileage, fuel, transmission, location, max price), validated with zod. The backend builds the MongoDB query from a whitelist, escaping regexes;
   - only `isVerified: "Accepted"` cars, without the `client` field, max 5 results;
   - the response gets a `cars` array. The frontend already has `ChatCarCard.jsx` to display it.

   Until then, the "Find me a car" quick reply leads to the bot politely declining.
2. **Streaming answers** (Server-Sent Events), so the text appears word by word. This is less valuable while answers take only 1–3 s, and harder than usual because of the tool-calling rounds.
3. **Better resilience:** automatic retry when Gemini is overloaded (503), instead of showing an error.

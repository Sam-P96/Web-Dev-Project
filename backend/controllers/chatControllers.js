import { chat } from "../services/llm.js";
import { TOOLS, runTool } from "../services/chatTools.js";
import SYSTEM_PROMPT from "../prompts/systemPrompt.js";

// Chat is stateless: the frontend sends the recent history with every request.
// The backend re-checks the limits itself — never trust the client to trim history.
const MAX_MESSAGES = 10;
const MAX_CONTENT = 1000;
const ROLES = ["user", "assistant"];

// Returns an error message, or null when the body is valid
const validateMessages = (messages) => {
    if (!Array.isArray(messages) || messages.length === 0) {
        return "messages must be a non-empty array";
    }
    if (messages.length > MAX_MESSAGES) {
        return `messages can contain at most ${MAX_MESSAGES} items`;
    }

    for (const message of messages) {
        if (!message || !ROLES.includes(message.role)) {
            return `role must be one of: ${ROLES.join(", ")}`;
        }
        if (typeof message.content !== "string" || message.content.trim() === "") {
            return "content must be a non-empty string";
        }
        if (message.content.length > MAX_CONTENT) {
            return `content can be at most ${MAX_CONTENT} characters`;
        }
    }

    if (messages.at(-1).role !== "user") {
        return "the last message must come from the user";
    }

    return null;
};

// The whole chatbot pipeline (LLM + tools), without HTTP: also used by `npm run eval`.
// messages must already be validated. -> { reply, sources? }
const getChatReply = async (messages) => {
    // Rebuild each message: never forward extra fields from the client to the provider
    const history = messages.map(({ role, content }) => ({ role, content: content.trim() }));
    // FAQ sections the answer was based on, shown under the reply by the frontend
    const sources = new Set();
    const reply = await chat({
        system: SYSTEM_PROMPT,
        messages: history,
        tools: TOOLS,
        runTool: async (name, args) => {
            const result = await runTool(name, args);
            result.sources.forEach((source) => sources.add(source));
            return result.output;
        },
    });
    return { reply, ...(sources.size > 0 && { sources: [...sources] }) };
};

// POST /api/chat
const sendChatMessage = async (req, res) => {
    const { messages } = req.body ?? {};

    const error = validateMessages(messages);
    if (error) return res.status(400).json({ error });

    try {
        res.json(await getChatReply(messages));
    } catch (err) {
        // Provider problems (missing key, timeout, quota...) are logged, never shown to the user
        console.error("LLM error:", err.message);
        res.status(502).json({ error: "The assistant is unavailable right now. Please try again later." });
    }
};

export { sendChatMessage, getChatReply, validateMessages };

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

// POST /api/chat
// Phase 1: echoes the last message. Phase 2 replaces the echo with the LLM call.
const sendChatMessage = async (req, res) => {
    const { messages } = req.body ?? {};

    const error = validateMessages(messages);
    if (error) return res.status(400).json({ error });

    const lastMessage = messages.at(-1).content.trim();
    res.json({ reply: `You said: ${lastMessage}` });
};

export { sendChatMessage, validateMessages };

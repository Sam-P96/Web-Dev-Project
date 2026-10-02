// Shared by the chat components. Kept out of the .jsx files so Vite fast refresh works.

// Same limit as the backend validation for POST /api/chat (see CHATBOT-PLAN.md 4.5)
export const MAX_MESSAGE_LENGTH = 1000;

export const DEFAULT_QUICK_REPLIES = ['Find me a car', 'How does selling work?', 'Book an appointment'];

// Rendered by the FE only — strip it before sending the history to the backend
export const WELCOME_MESSAGE_ID = 'welcome';

export const INITIAL_MESSAGES = [
  { id: WELCOME_MESSAGE_ID, role: 'assistant', content: 'How can I help you today?' },
];

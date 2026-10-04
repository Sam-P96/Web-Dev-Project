import { apiFetch, errorMessage } from './client';

// POST /api/chat is public and stateless: send the recent history, get { reply, cars?, sources? } back.
// Returns { ok, data } on success or { ok: false, error } with a message ready to show in the chat.
export const sendMessage = async (messages) => {
  const { ok, status, data } = await apiFetch('/chat', { method: 'POST', body: { messages } });
  if (ok) return { ok, data };

  if (status === 429) {
    return { ok, error: 'Too many messages. Please wait a few minutes and try again.' };
  }
  if (status === 0) {
    return { ok, error: 'Could not reach the server. Check your connection and try again.' };
  }
  return { ok, error: errorMessage(data, 'Something went wrong. Please try again.') };
};

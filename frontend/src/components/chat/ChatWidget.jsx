import { useCallback, useEffect, useRef, useState } from 'react';
import ChatLauncher from './ChatLauncher.jsx';
import ChatWindow from './ChatWindow.jsx';
import { INITIAL_MESSAGES, MAX_HISTORY, WELCOME_MESSAGE_ID } from './chatConstants.js';
import { sendMessage } from '../../api/chatApi.js';

// crypto.randomUUID() only exists on https/localhost, so use a simple counter instead
let nextId = 0;
const createId = () => `msg-${Date.now()}-${nextId++}`;

// Shape the backend expects: no FE-only welcome message, newest MAX_HISTORY, only { role, content }
const toHistory = (messages) =>
  messages
    .filter((message) => message.id !== WELCOME_MESSAGE_ID)
    .slice(-MAX_HISTORY)
    .map(({ role, content }) => ({ role, content }));

// Owns the chat state; ChatLauncher/ChatWindow are presentational.
// Mounted once in AppPrime (outside <Routes>) so the conversation survives page navigation.
export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasUnread, setHasUnread] = useState(false);
  const isOpenRef = useRef(isOpen);
  // Latest messages for async callbacks (handleSend/handleRetry) without re-creating them
  const messagesRef = useRef(messages);

  // Read inside async callbacks, where the isOpen from render may be stale
  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const requestReply = useCallback(async (conversation) => {
    setIsLoading(true);
    setError(null);

    const { ok, data, error } = await sendMessage(toHistory(conversation));

    setIsLoading(false);
    if (!ok) {
      setError(error);
      return;
    }
    setMessages((prev) => [
      ...prev,
      { id: createId(), role: 'assistant', content: data.reply, cars: data.cars, createdAt: new Date().toISOString() },
    ]);
    if (!isOpenRef.current) setHasUnread(true);
  }, []);

  const handleSend = useCallback(
    (text) => {
      // Optimistic: show the user's message right away
      const userMessage = { id: createId(), role: 'user', content: text, createdAt: new Date().toISOString() };
      const conversation = [...messagesRef.current, userMessage];
      messagesRef.current = conversation;
      setMessages(conversation);
      requestReply(conversation);
    },
    [requestReply],
  );

  // The failed user message is still the last one in the list -> just resend the history
  const handleRetry = useCallback(() => requestReply(messagesRef.current), [requestReply]);
  const handleClose = useCallback(() => setIsOpen(false), []);
  const handleToggle = useCallback(() => {
    // Opening the window counts as reading the new reply
    if (!isOpenRef.current) setHasUnread(false);
    setIsOpen((open) => !open);
  }, []);

  return (
    <>
      <ChatWindow
        isOpen={isOpen}
        messages={messages}
        onSend={handleSend}
        onClose={handleClose}
        onRetry={handleRetry}
        isLoading={isLoading}
        error={error}
      />
      <ChatLauncher isOpen={isOpen} hasUnread={hasUnread} onClick={handleToggle} />
    </>
  );
}

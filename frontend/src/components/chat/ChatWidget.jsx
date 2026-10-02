import { useCallback, useEffect, useRef, useState } from 'react';
import ChatLauncher from './ChatLauncher.jsx';
import ChatWindow from './ChatWindow.jsx';
import { INITIAL_MESSAGES } from './chatConstants.js';

// crypto.randomUUID() only exists on https/localhost, so use a simple counter instead
let nextId = 0;
const createId = () => `msg-${Date.now()}-${nextId++}`;

// TEMP (until POST /api/chat exists, Phase 1): fake replies so the UI can be tested.
// Replace fakeReply() with chatApi.sendMessage(history) — see CHATBOT-PLAN.md section 7.
const SAMPLE_CARS = [
  { _id: 'c1', make: 'Toyota', model: 'Corolla', year: 2021, mileage: 48200, fuel: 'Hybrid', transmission: 'Automatic', location: 'Helsinki', estimatedPrice: 21900 },
  { _id: 'c2', make: 'Skoda', model: 'Octavia', year: 2020, mileage: 81500, fuel: 'Diesel', transmission: 'Manual', location: 'Tampere', estimatedPrice: 17450 },
  { _id: 'c3', make: 'Volvo', model: 'XC40', year: 2022, mileage: 29800, fuel: 'Electric', transmission: 'Automatic', location: 'Espoo', estimatedPrice: null },
];

function fakeReply(text) {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (/error/i.test(text)) {
        resolve({ ok: false, status: 502, data: { error: 'We couldn’t reach the assistant. Please try again.' } });
        return;
      }
      const wantsCars = /car|find/i.test(text);
      resolve({
        ok: true,
        status: 200,
        data: {
          reply: wantsCars
            ? 'Here are a few cars that match popular searches right now:'
            : 'Thanks! This is a preview reply — the real assistant is coming soon.',
          cars: wantsCars ? SAMPLE_CARS : undefined,
        },
      });
    }, 1200);
  });
}

// Owns the chat state; ChatLauncher/ChatWindow are presentational.
// Mounted once in AppPrime (outside <Routes>) so the conversation survives page navigation.
export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasUnread, setHasUnread] = useState(false);
  const lastText = useRef('');
  const isOpenRef = useRef(isOpen);

  // Read inside async callbacks, where the isOpen from render may be stale
  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  const requestReply = useCallback(async (text) => {
    setIsLoading(true);
    setError(null);

    const { ok, data } = await fakeReply(text);

    setIsLoading(false);
    if (!ok) {
      setError(data?.error || 'Something went wrong. Please try again.');
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
      lastText.current = text;
      // Optimistic: show the user's message right away
      setMessages((prev) => [
        ...prev,
        { id: createId(), role: 'user', content: text, createdAt: new Date().toISOString() },
      ]);
      requestReply(text);
    },
    [requestReply],
  );

  const handleRetry = useCallback(() => requestReply(lastText.current), [requestReply]);
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

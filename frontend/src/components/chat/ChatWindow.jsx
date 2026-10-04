import { useEffect, useRef, useState } from 'react';
import { ChevronDown, SendHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import BotAvatar from './BotAvatar.jsx';
import { ErrorBubble, MessageBubble } from './MessageBubble.jsx';
import TypingIndicator from './TypingIndicator.jsx';
import { DEFAULT_QUICK_REPLIES, INITIAL_MESSAGES, MAX_MESSAGE_LENGTH } from './chatConstants.js';

// Presentational only: all data and handlers come from ChatWidget via props.
export default function ChatWindow({
  isOpen = true,
  messages = INITIAL_MESSAGES,
  onSend,
  onClose,
  onRetry,
  isLoading = false,
  error = null,
  quickReplies = DEFAULT_QUICK_REPLIES,
  getCarHref,
  className,
}) {
  const [draft, setDraft] = useState('');
  const inputRef = useRef(null);
  const scrollRef = useRef(null);

  const trimmed = draft.trim();
  const canSend = trimmed.length > 0 && !isLoading;
  const nearLimit = draft.length >= MAX_MESSAGE_LENGTH * 0.9;

  // Focus the input on open, Esc closes.
  useEffect(() => {
    if (!isOpen) return;
    const id = requestAnimationFrame(() => inputRef.current?.focus());
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      cancelAnimationFrame(id);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, onClose]);

  // Keep the newest message in view.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollTo({ top: el.scrollHeight, behavior: reduceMotion ? 'auto' : 'smooth' });
  }, [messages, isLoading, error, isOpen]);

  function send(text) {
    const value = text.trim();
    if (!value || isLoading) return;
    onSend?.(value.slice(0, MAX_MESSAGE_LENGTH));
    setDraft('');
    inputRef.current?.focus();
  }

  function handleSubmit(event) {
    event.preventDefault();
    send(draft);
  }

  // Enter sends, Shift+Enter adds a new line. Ignore Enter while an IME is composing.
  function handleKeyDown(event) {
    if (event.key !== 'Enter' || event.shiftKey) return;
    if (event.nativeEvent.isComposing || event.keyCode === 229) return;
    event.preventDefault();
    send(draft);
  }

  return (
    <section
      id="autotori-chat-window"
      role="dialog"
      aria-modal="false"
      aria-labelledby="autotori-chat-title"
      aria-hidden={!isOpen}
      inert={!isOpen}
      data-state={isOpen ? 'open' : 'closed'}
      className={cn(
        'fixed inset-0 z-[1001] flex flex-col overflow-hidden bg-background',
        'sm:inset-auto sm:right-6 sm:bottom-24 sm:h-[560px] sm:max-h-[calc(100dvh-7.5rem)] sm:w-[380px] sm:rounded-xl sm:border sm:border-border',
        'sm:shadow-[0_24px_48px_-12px_rgb(32_37_34/0.25)]',
        'origin-bottom-right transition-[opacity,transform,visibility] duration-200 ease-out motion-reduce:transition-none',
        isOpen ? 'visible scale-100 opacity-100' : 'invisible pointer-events-none translate-y-2 scale-95 opacity-0',
        className,
      )}
    >
      <header className="flex items-center gap-3 border-b border-border bg-background px-4 py-3">
        <BotAvatar className="size-9 [&_svg]:size-4.5" />
        <div className="flex min-w-0 flex-1 flex-col">
          <h2 id="autotori-chat-title" className="truncate text-sm font-semibold text-foreground">
            AutoTori Assistant
          </h2>
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span aria-hidden="true" className="size-2 rounded-full bg-primary" />
            Online
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onClose}
          aria-label="Minimize chat"
          className="text-muted-foreground"
        >
          <ChevronDown aria-hidden="true" className="size-5" />
        </Button>
      </header>

      <div
        ref={scrollRef}
        role="log"
        aria-live="polite"
        aria-relevant="additions"
        aria-label="Chat messages"
        className="flex flex-1 flex-col gap-3 overflow-y-auto overscroll-contain px-4 py-4"
      >
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} getCarHref={getCarHref} />
        ))}
        {isLoading && <TypingIndicator />}
        {error && !isLoading && <ErrorBubble error={error} onRetry={onRetry} />}
      </div>

      <footer className="border-t border-border bg-background px-3 pt-2.5 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        {quickReplies?.length > 0 && (
          <ul
            aria-label="Suggested questions"
            className="-mx-3 mb-2.5 flex gap-1.5 overflow-x-auto px-3 [scrollbar-width:none]"
          >
            {quickReplies.map((reply) => (
              <li key={reply} className="shrink-0">
                <button
                  type="button"
                  onClick={() => send(reply)}
                  disabled={isLoading}
                  className="rounded-full border border-border bg-muted px-3 py-1.5 text-xs font-medium text-foreground outline-none transition-colors hover:border-primary/40 hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50"
                >
                  {reply}
                </button>
              </li>
            ))}
          </ul>
        )}

        <form
          onSubmit={handleSubmit}
          className="flex items-end gap-2 rounded-lg border border-input bg-background p-1.5 pl-3 transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/20"
        >
          <label htmlFor="autotori-chat-input" className="sr-only">
            Type your message
          </label>
          <textarea
            id="autotori-chat-input"
            ref={inputRef}
            rows={1}
            value={draft}
            maxLength={MAX_MESSAGE_LENGTH}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message…"
            aria-describedby="autotori-chat-counter"
            className="field-sizing-content max-h-32 min-h-8 flex-1 resize-none bg-transparent py-1.5 text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
          <Button
            type="submit"
            size="icon"
            disabled={!canSend}
            aria-label="Send message"
            className="size-8 shrink-0"
          >
            <SendHorizontal aria-hidden="true" />
          </Button>
        </form>

        <div className="mt-1.5 flex items-center justify-between px-1 text-[11px] text-muted-foreground">
          <span className="max-sm:hidden">
            <kbd className="font-sans font-medium">Enter</kbd> to send,{' '}
            <kbd className="font-sans font-medium">Shift + Enter</kbd> for new line
          </span>
          <span
            id="autotori-chat-counter"
            aria-live={nearLimit ? 'polite' : 'off'}
            className={cn('ml-auto tabular-nums', nearLimit && 'text-destructive')}
          >
            {draft.length}/{MAX_MESSAGE_LENGTH}
            <span className="sr-only"> characters</span>
          </span>
        </div>
      </footer>
    </section>
  );
}

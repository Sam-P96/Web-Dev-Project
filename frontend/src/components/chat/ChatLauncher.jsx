import { useEffect, useRef } from 'react';
import { Headset, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ChatLauncher({ onClick, isOpen = false, hasUnread = false, className }) {
  const buttonRef = useRef(null);
  const wasOpen = useRef(isOpen);

  // Return focus to the launcher when the window closes.
  useEffect(() => {
    if (wasOpen.current && !isOpen) buttonRef.current?.focus();
    wasOpen.current = isOpen;
  }, [isOpen]);

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={onClick}
      aria-label={isOpen ? 'Close support chat' : 'Open support chat'}
      aria-expanded={isOpen}
      aria-controls="autotori-chat-window"
      className={cn(
        'fixed right-6 bottom-6 z-[1000] flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground',
        'shadow-[0_6px_20px_-4px_rgb(36_127_61/0.45)] outline-none transition-transform duration-200',
        'hover:scale-105 active:scale-95 focus-visible:ring-4 focus-visible:ring-ring/35',
        'motion-reduce:transition-none motion-reduce:hover:scale-100',
        isOpen && 'max-sm:hidden',
        className,
      )}
    >
      <span className="relative flex size-6 items-center justify-center">
        <Headset
          aria-hidden="true"
          className={cn(
            'absolute size-6 transition-all duration-200 motion-reduce:transition-none',
            isOpen ? 'scale-50 rotate-45 opacity-0' : 'scale-100 rotate-0 opacity-100',
          )}
        />
        <X
          aria-hidden="true"
          className={cn(
            'absolute size-6 transition-all duration-200 motion-reduce:transition-none',
            isOpen ? 'scale-100 rotate-0 opacity-100' : 'scale-50 -rotate-45 opacity-0',
          )}
        />
      </span>

      {hasUnread && !isOpen && (
        <span className="absolute top-0.5 right-0.5 flex size-3.5" aria-hidden="true">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-destructive opacity-70 motion-reduce:animate-none" />
          <span className="relative inline-flex size-3.5 rounded-full border-2 border-white bg-destructive" />
        </span>
      )}
      {hasUnread && !isOpen && <span className="sr-only">You have unread messages</span>}
    </button>
  );
}

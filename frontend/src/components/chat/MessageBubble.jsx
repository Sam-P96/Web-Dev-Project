import { AlertCircle, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import BotAvatar from './BotAvatar.jsx';
import { ChatCarList } from './ChatCarCard.jsx';
import { formatTime } from './formatters.js';

// message = { id, role: 'user' | 'assistant', content, cars?, createdAt? }
export function MessageBubble({ message, getCarHref }) {
  const isUser = message.role === 'user';
  const time = formatTime(message.createdAt);
  const hasCars = !isUser && message.cars?.length > 0;

  return (
    <div className={cn('group flex items-start gap-2', isUser ? 'justify-end' : 'justify-start')}>
      {!isUser && <BotAvatar />}

      <div
        className={cn(
          'flex min-w-0 flex-col gap-1',
          isUser ? 'max-w-[80%] items-end' : 'max-w-[85%] items-start',
          hasCars && 'w-full',
        )}
      >
        {message.content && (
          <div
            className={cn(
              'rounded-2xl px-3.5 py-2 text-sm leading-relaxed break-words whitespace-pre-wrap',
              isUser
                ? 'rounded-br-md bg-primary text-primary-foreground'
                : 'rounded-bl-md border border-border bg-muted text-foreground',
            )}
          >
            <span className="sr-only">{isUser ? 'You said: ' : 'Assistant said: '}</span>
            {message.content}
          </div>
        )}

        {hasCars && (
          <div className="w-full">
            <ChatCarList cars={message.cars} getCarHref={getCarHref} />
          </div>
        )}

        {time && (
          <time
            dateTime={new Date(message.createdAt).toISOString()}
            className="h-4 px-1 text-[11px] text-muted-foreground opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100 motion-reduce:transition-none"
          >
            {time}
          </time>
        )}
      </div>
    </div>
  );
}

export function ErrorBubble({ error, onRetry }) {
  const text = typeof error === 'string' ? error : error?.message || 'Something went wrong. Please try again.';

  return (
    <div className="flex items-start gap-2" role="alert">
      <BotAvatar className="bg-destructive/10 text-destructive" />
      <div className="flex max-w-[85%] flex-col items-start gap-2 rounded-2xl rounded-bl-md border border-destructive/25 bg-destructive/5 px-3.5 py-2.5 text-sm text-destructive">
        <p className="flex items-start gap-1.5 leading-relaxed">
          <AlertCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          <span>{text}</span>
        </p>
        {onRetry && (
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={onRetry}
            className="border-destructive/30 bg-white text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            <RotateCw aria-hidden="true" />
            Retry
          </Button>
        )}
      </div>
    </div>
  );
}

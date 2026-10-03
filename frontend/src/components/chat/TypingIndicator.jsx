import BotAvatar from './BotAvatar.jsx';

export default function TypingIndicator() {
  return (
    <div className="flex items-start gap-2">
      <BotAvatar />
      <div
        role="status"
        className="flex h-9 items-center gap-1 rounded-2xl rounded-bl-md border border-border bg-muted px-3.5"
      >
        <span className="sr-only">AutoTori Assistant is typing</span>
        {[0, 150, 300].map((delay) => (
          <span
            key={delay}
            aria-hidden="true"
            className="size-1.5 animate-bounce rounded-full bg-muted-foreground/70 motion-reduce:animate-none"
            style={{ animationDelay: `${delay}ms`, animationDuration: '1s' }}
          />
        ))}
      </div>
    </div>
  );
}

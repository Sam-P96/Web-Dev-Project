import { Headset } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function BotAvatar({ className }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'flex size-7 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground',
        className,
      )}
    >
      <Headset className="size-3.5" />
    </span>
  );
}

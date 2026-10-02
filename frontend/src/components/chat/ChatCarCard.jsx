import { Link } from 'react-router-dom';
import { ArrowRight, Fuel, Gauge, MapPin, Settings2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatMileage, formatPrice } from './formatters.js';

// No car detail page yet -> point to the search page. Pass getCarHref once /cars/:id exists.
// <Link>, not <a>: a full page reload would wipe the chat history kept in ChatWidget state.
const DEFAULT_CAR_HREF = '/find_cars';

export function ChatCarCard({ car, href, className }) {
  const { make, model, year, mileage, fuel, transmission, location, estimatedPrice } = car;
  const title = `${make} ${model}`;

  return (
    <article
      className={cn(
        'flex flex-col gap-2.5 rounded-lg border border-border bg-card p-3 text-card-foreground',
        className,
      )}
      aria-label={`${title}, ${year}`}
    >
      <header className="flex items-baseline justify-between gap-2">
        <h3 className="truncate text-sm font-semibold">
          {title} <span className="font-normal text-muted-foreground">{'· '}{year}</span>
        </h3>
      </header>

      <dl className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs text-muted-foreground">
        <Spec icon={Gauge} label="Mileage" value={formatMileage(mileage)} />
        <Spec icon={Fuel} label="Fuel" value={fuel} />
        <Spec icon={Settings2} label="Transmission" value={transmission} />
        <Spec icon={MapPin} label="Location" value={location} />
      </dl>

      <div className="flex items-end justify-between gap-2 border-t border-border pt-2.5">
        <div className="flex flex-col">
          <span className="text-[11px] text-muted-foreground">Estimated price</span>
          <span className="text-base font-semibold text-primary tabular-nums">
            {formatPrice(estimatedPrice)}
          </span>
        </div>
        <Link
          to={href ?? DEFAULT_CAR_HREF}
          className="inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-xs font-medium text-primary outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring/50"
        >
          View details
          <ArrowRight aria-hidden="true" className="size-3.5" />
          <span className="sr-only">for {title} {year}</span>
        </Link>
      </div>
    </article>
  );
}

function Spec({ icon: Icon, label, value }) {
  return (
    <div className="flex min-w-0 items-center gap-1.5">
      <Icon aria-hidden="true" className="size-3.5 shrink-0" />
      <dt className="sr-only">{label}</dt>
      <dd className="truncate text-foreground/80">{value || '—'}</dd>
    </div>
  );
}

export function ChatCarList({ cars, getCarHref }) {
  if (!cars?.length) return null;

  if (cars.length === 1) {
    return <ChatCarCard car={cars[0]} href={getCarHref?.(cars[0])} />;
  }

  return (
    <ul
      aria-label={`${cars.length} matching cars`}
      className="-mx-1 flex snap-x snap-mandatory gap-2 overflow-x-auto px-1 pb-1.5 [scrollbar-width:thin]"
    >
      {cars.map((car) => (
        <li key={car._id} className="w-60 shrink-0 snap-start">
          <ChatCarCard car={car} href={getCarHref?.(car)} className="h-full" />
        </li>
      ))}
    </ul>
  );
}

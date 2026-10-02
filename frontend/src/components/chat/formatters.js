const priceFormatter = new Intl.NumberFormat('fi-FI', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
});
const numberFormatter = new Intl.NumberFormat('fi-FI');
const timeFormatter = new Intl.DateTimeFormat('fi-FI', { hour: '2-digit', minute: '2-digit' });

// estimatedPrice is often null in the Car model -> show a dash
export function formatPrice(value) {
  return typeof value === 'number' ? priceFormatter.format(value) : '—';
}

export function formatMileage(value) {
  return typeof value === 'number' ? `${numberFormatter.format(value)} km` : '—';
}

export function formatTime(value) {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : timeFormatter.format(date);
}

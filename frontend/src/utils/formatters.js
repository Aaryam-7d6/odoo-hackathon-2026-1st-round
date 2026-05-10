export function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function formatDateRange(startDate, endDate) {
  if (!startDate && !endDate) return 'No dates set';
  if (startDate && !endDate) return formatDate(startDate);
  if (!startDate && endDate) return `Until ${formatDate(endDate)}`;
  return `${formatDate(startDate)} — ${formatDate(endDate)}`;
}

export function getDaysBetween(startDate, endDate) {
  if (!startDate || !endDate) return 0;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff + 1 : 1;
}

export function formatCurrency(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getCostIndexDisplay(costIndex) {
  const filled = Math.round(costIndex / 2);
  return '$'.repeat(filled) + '$'.repeat(10 - filled).replace(/\$/g, '-').replace(/-/g, '$');
}

export function getDurationDisplay(hours) {
  if (hours < 1) return `${Math.round(hours * 60)}min`;
  if (hours === Math.floor(hours)) return `${hours}h`;
  return `${Math.floor(hours)}h ${Math.round((hours % 1) * 60)}m`;
}

export function getRelativeTime(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return formatDate(dateString);
}

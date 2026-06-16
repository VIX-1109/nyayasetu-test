import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Relative time string for an ISO timestamp, e.g. "5m ago", "3h ago", or a
// localized date once it's a day+ old. Single source of truth — was
// previously duplicated as formatTime() / formatRelativeTime() in two files.
export function formatRelativeTime(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.max(1, Math.floor(diff / 60000));
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return new Date(iso).toLocaleDateString('en-IN');
}



import type { Locale } from "@/lib/i18n/locales";
import { toBcp47 } from "@/lib/i18n/bcp47";

export function formatMiles(n: number, locale: Locale): string {
  return n.toLocaleString(toBcp47(locale));
}

export function formatDuration(totalMinutes: number, locale: Locale): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const paddedMinutes = minutes.toString().padStart(2, "0");
  // Dutch conventionally abbreviates "uur" as "u" with no minutes suffix;
  // the other four locales share the common "Xh Ym" shorthand.
  return locale === "nl" ? `${hours}u ${paddedMinutes}` : `${hours}h ${paddedMinutes}m`;
}

export function formatDateLabel(dateStr: string, locale: Locale): string {
  const d = new Date(`${dateStr}T00:00:00Z`);
  return d.toLocaleDateString(toBcp47(locale), {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function formatDateShort(dateStr: string, locale: Locale): string {
  const d = new Date(`${dateStr}T00:00:00Z`);
  return d.toLocaleDateString(toBcp47(locale), {
    weekday: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function addDays(dateStr: string, days: number): string {
  const d = new Date(`${dateStr}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Helpers for event calendar dates (day only, no meaningful time).
 * Avoids the classic bug where local midnight → toISOString() shifts to the previous day in UTC.
 */

/** Local calendar day → stable noon-UTC ISO string */
export function toCalendarDateISO(date: Date): string {
  return new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0),
  ).toISOString();
}

/**
 * Value from `<input type="datetime-local">` or `YYYY-MM-DD`
 * → noon-UTC ISO for that calendar day.
 */
export function datetimeLocalToCalendarISO(value: string): string {
  const datePart = value.split("T")[0] ?? value;
  const [year, month, day] = datePart.split("-").map(Number);

  if (!year || !month || !day) {
    throw new Error("Data inválida");
  }

  return new Date(Date.UTC(year, month - 1, day, 12, 0, 0)).toISOString();
}

/** ISO string → value for `<input type="datetime-local">` (UTC calendar day) */
export function toDatetimeLocalValue(dateStr: string): string {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return "";

  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}T12:00`;
}

/** Format event start date for UI (calendar day in UTC parts) */
export function formatEventDate(dateStr: string): string {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;

  const day = date.getUTCDate();
  const months = [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ];
  const month = months[date.getUTCMonth()];
  const year = date.getUTCFullYear();
  return `${day} de ${month}. ${year}`;
}

const EDIT_WINDOW_MS = 24 * 60 * 60 * 1000;

/**
 * Edit rules:
 * - Not approved yet → always editable
 * - Approved → editable only within 24h of creation
 */
export function canEditEvent(event: {
  status: string;
  createdAt: string;
}): boolean {
  if (event.status !== "APPROVED") return true;

  const createdAt = new Date(event.createdAt).getTime();
  if (Number.isNaN(createdAt)) return false;

  return Date.now() - createdAt <= EDIT_WINDOW_MS;
}

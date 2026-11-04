/**
 * What `check` and the build say when `lastUpdated` is on and the clone is shallow. A shallow history stops at
 * some commit, so every file would get the date of that commit.
 */
export const SHALLOW_CLONE_WARNING =
  "lastUpdated is on, but this is a shallow clone, so the date would be the same for every page. No dates are shown. Fetch the full history, with fetch-depth: 0 in actions/checkout.";

/** The date of the last change of a page, in the two forms the page shows. */
export interface LastChange {
  /** `YYYY-MM-DD`, the value of the `datetime` attribute. */
  datetime: string;
  /** The readable text, for example `30 October 2026`. */
  text: string;
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/**
 * Turn the strict ISO date that `git log --format=%aI` prints into a date for the page, or undefined
 * when it is not one. The day is the one in the commit itself, so the page does not depend on the
 * time zone of the machine that builds it. The month is spelled out, so `03/04` is never read two ways.
 */
export function describeLastChange(iso: string | undefined): LastChange | undefined {
  const match = /^(\d{4})-(\d{2})-(\d{2})(?:T|$)/.exec(iso?.trim() ?? "");
  if (!match) return undefined;
  const [, year, month, day] = match as unknown as [string, string, string, string];
  const monthIndex = Number(month) - 1;
  const date = new Date(Date.UTC(Number(year), monthIndex, Number(day)));
  // A day that rolls over (31 February) is not a date.
  if (
    date.getUTCFullYear() !== Number(year) ||
    date.getUTCMonth() !== monthIndex ||
    date.getUTCDate() !== Number(day)
  ) {
    return undefined;
  }
  return {
    datetime: `${year}-${month}-${day}`,
    text: `${Number(day)} ${MONTHS[monthIndex]} ${year}`,
  };
}

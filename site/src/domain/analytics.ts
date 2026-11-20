/** The analytics providers a site can load: Google Tag Manager and Google Analytics 4. */
export const ANALYTICS_PROVIDERS = ["gtm", "ga4"] as const;

/** A provider of `analytics.provider`. */
export type AnalyticsProvider = (typeof ANALYTICS_PROVIDERS)[number];

/** The prefix each provider's id starts with, and the letters and digits that follow it. */
const ID_PATTERNS: Record<AnalyticsProvider, { prefix: string; pattern: RegExp; example: string }> =
  {
    gtm: { prefix: "GTM-", pattern: /^GTM-[A-Za-z0-9]+$/, example: "GTM-XXXXXXX" },
    ga4: { prefix: "G-", pattern: /^G-[A-Za-z0-9]+$/, example: "G-XXXXXXXXXX" },
  };

/**
 * The problem with an analytics id for its provider, or undefined when the id is right. `GTM-` belongs to Google
 * Tag Manager and `G-` to Google Analytics 4, so an id of the other provider is an error, not a guess.
 */
export function analyticsIdProblem(provider: AnalyticsProvider, id: string): string | undefined {
  const { prefix, pattern, example } = ID_PATTERNS[provider];
  if (pattern.test(id)) return undefined;
  return `analytics.id for provider "${provider}" must start with "${prefix}" and continue with letters and digits, such as ${example}. Got "${id}".`;
}

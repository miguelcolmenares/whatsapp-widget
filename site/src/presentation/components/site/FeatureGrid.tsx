import type { BrandGlyph } from "../../../domain/brands";
import { Icon } from "./Icon";

/** One feature: an icon (a lucide name or `brand:<slug>`), an eyebrow, a title and a sentence. */
export interface FeatureItem {
  /** A lucide name in kebab-case, or `brand:<slug>` for a logo. */
  icon: string;
  /** A short line in mono type over the title. */
  eyebrow: string;
  /** The title of the feature. */
  title: string;
  /** One sentence. */
  text: string;
}

/** Features as cards, two columns from the `md` breakpoint. */
export function FeatureGrid({
  features,
  brands,
}: {
  /** The features, in the order shown. */
  features: readonly FeatureItem[];
  /** The custom logos of the site, for `brand:custom/<name>` icons. */
  brands?: Record<string, BrandGlyph>;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {features.map((feature) => (
        <article
          key={`${feature.eyebrow}-${feature.title}`}
          className="rounded-lg border border-border bg-surface p-6"
        >
          <div className="mb-5 flex size-9 items-center justify-center rounded-md border border-border-strong bg-surface-2 text-brand">
            <Icon name={feature.icon} brands={brands} className="size-4.5" />
          </div>
          <p className="mb-2 font-mono text-[11px] tracking-[0.14em] text-brand uppercase">
            {feature.eyebrow}
          </p>
          <h3 className="text-lg font-semibold tracking-tight text-fg-bright">{feature.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-fg-muted">{feature.text}</p>
        </article>
      ))}
    </div>
  );
}

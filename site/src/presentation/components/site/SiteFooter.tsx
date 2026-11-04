import { ArrowUpRight, Box } from "lucide-react";
import { Icon } from "./Icon";

/** A titled column of footer links. */
export interface FooterColumn {
  /** The heading of the column, and the name of its navigation. */
  title: string;
  /**
   * The links. `icon` is a lucide name or `brand:<slug>`, drawn before the label, and `external` opens the link in
   * a new tab.
   */
  links: readonly { label: string; href: string; external?: boolean; icon?: string }[];
}

/** The brand, link columns and a legal line, one grid track per column. */
export function SiteFooter({
  name,
  description,
  command,
  columns,
  license,
  version,
  credit,
}: {
  /** The name of the site, in the brand and in the legal line. */
  name: string;
  /** One sentence under the brand. */
  description?: string;
  /** A command shown under the description. */
  command?: string;
  /** The link columns, one grid track each. */
  columns: readonly FooterColumn[];
  /** The license, after the name in the legal line. */
  license?: string;
  /** Shown after the license, linked when `href` is given. */
  version?: { label: string; href?: string };
  /** A credit at the right of the legal line. */
  credit?: { prefix: string; label: string; href: string };
}) {
  // One explicit track for the brand and one per column, so columns sit side by side on desktop.
  const tracks = `minmax(0,2fr) repeat(${Math.max(columns.length, 1)}, minmax(0,1fr))`;
  return (
    <footer className="border-t border-border bg-bg-subtle">
      <div className="mx-auto max-w-site px-5 pt-14 pb-8">
        <div
          className="grid grid-cols-1 gap-10 md:[grid-template-columns:var(--footer-tracks)]"
          style={{ "--footer-tracks": tracks } as React.CSSProperties}
        >
          <div>
            <a href="./" className="inline-flex items-center gap-2 font-semibold text-fg-bright">
              <Box className="size-5 text-brand" aria-hidden="true" /> {name}
            </a>
            {description && (
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-fg-muted">{description}</p>
            )}
            {command && (
              <code className="mt-5 inline-block rounded-md border border-border bg-surface px-3 py-1.5 font-mono text-xs text-fg-muted">
                {command}
              </code>
            )}
          </div>
          {columns.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h2 className="mb-4 font-mono text-[11px] tracking-[0.14em] text-fg-dim uppercase">
                {column.title}
              </h2>
              <ul className="space-y-0.5">
                {column.links.map((link) => (
                  <li key={`${link.href}-${link.label}`}>
                    <a
                      href={link.href}
                      {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="inline-flex min-h-11 items-center gap-1.5 text-sm text-fg-muted transition-colors hover:text-fg-bright md:min-h-8"
                    >
                      {link.icon && <Icon name={link.icon} className="size-4" />}
                      {link.label}
                      {link.external && <ArrowUpRight className="size-3.5" aria-hidden="true" />}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6 text-xs text-fg-dim">
          <span>
            © {new Date().getFullYear()} {name}
            {license ? ` · ${license} licensed` : ""}
            {version && (
              <>
                {" · "}
                {version.href ? (
                  <a
                    href={version.href}
                    className="underline underline-offset-2 hover:text-fg-bright"
                  >
                    {version.label}
                  </a>
                ) : (
                  version.label
                )}
              </>
            )}
          </span>
          {credit && (
            <span>
              {credit.prefix}{" "}
              <a
                href={credit.href}
                className="text-fg-muted underline underline-offset-2 hover:text-fg-bright"
              >
                {credit.label}
              </a>
            </span>
          )}
        </div>
      </div>
    </footer>
  );
}

import type { AstroIntegration } from "astro";
import { formatFinding, summarizeFindings } from "../domain";
import { loadSite } from "./loadSite";

/**
 * An Astro integration that prints what is wrong with the markdown when a build ends, one line per
 * finding as `docs/guide.md:42: warning: ...`, then the count. It never fails the build: a build that
 * completes is what `sitekit check` then judges, and it exits non-zero on any error.
 */
export function reportFindings(): AstroIntegration {
  return {
    name: "sitekit-report-findings",
    hooks: {
      "astro:build:done": () => {
        const { findings } = loadSite();
        if (findings.length === 0) return;
        console.warn("");
        for (const finding of findings) console.warn(formatFinding(finding));
        console.warn(`\nContent: ${summarizeFindings(findings)}.`);
        if (findings.some((finding) => finding.severity === "error"))
          console.warn("`sitekit check` fails on an error.");
      },
    },
  };
}

import { Circle, icons } from "lucide-react";
import type { LucideProps } from "lucide-react";
import { brandGlyph, findBrand, parseIconName } from "../../../domain/brands";
import type { BrandGlyph } from "../../../domain/brands";

const toPascal = (name: string) =>
  name.replace(/(^|-)([a-z0-9])/g, (_, __, char: string) => char.toUpperCase());

/**
 * What the component takes: an icon name, and optionally a name for the icon, and the logos the author added.
 * `name` is a lucide icon in kebab-case (`shield-check`), a brand that ships (`brand:github`) or a custom
 * logo (`brand:custom/my-logo`). A name that resolves to nothing shows a plain circle.
 */
export interface IconProps extends LucideProps {
  /** A lucide icon in kebab-case, `brand:<slug>` for a logo that ships, or `brand:custom/<name>` for your own. */
  name: string;
  /**
   * Give the icon a name when it stands alone. The icon then has `role="img"` and that name, and a brand
   * logo also carries it as a `<title>`, which a browser shows on hover. Without it the icon is decorative
   * and hidden from assistive technology, because the text next to it already names the brand.
   */
  label?: string;
  /** The custom logos of the site, by icon value. The page passes them in: the component reads no files. */
  brands?: Record<string, BrandGlyph>;
}

/** Draw a lucide icon or a brand logo. A logo is an inline SVG filled with `currentColor`: it asks for nothing from any host. */
export function Icon({ name, label, brands, size = 24, ...props }: IconProps) {
  const accessible = label
    ? ({ role: "img", "aria-label": label } as const)
    : ({ "aria-hidden": "true" } as const);
  const ref = parseIconName(name);
  if (ref && ref.kind !== "lucide") {
    const brand = ref.kind === "brand" ? findBrand(ref.slug) : undefined;
    const glyph = ref.kind === "brand" ? brand && brandGlyph(brand) : brands?.[name];
    if (glyph) {
      // The stroke props of lucide mean nothing on a filled shape.
      const { color, ...svgProps } = props;
      delete svgProps.strokeWidth;
      delete svgProps.absoluteStrokeWidth;
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox={glyph.viewBox}
          width={size}
          height={size}
          fill={color ?? "currentColor"}
          focusable="false"
          {...accessible}
          {...svgProps}
        >
          {label && <title>{label}</title>}
          {glyph.paths.map((path, index) => (
            <path key={index} d={path.d} fillRule={path.fillRule} />
          ))}
        </svg>
      );
    }
  }
  const Component = icons[toPascal(name) as keyof typeof icons] ?? Circle;
  return <Component size={size} {...accessible} {...props} />;
}

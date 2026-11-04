import { isHighlighted, parseCodeMeta, readDiffLanguage, readDiffMarkers } from "../domain";
import type { CodeMeta, DiffKind } from "../domain";

/** The value of a hast property, as hast types it. */
type HastValue = string | number | boolean | (string | number)[] | null | undefined;
/** The part of a hast tree these transformers build and read. The shapes are the ones of the `hast` types. */
interface HastElement {
  type: "element";
  tagName: string;
  properties: Record<string, HastValue>;
  children: HastContent[];
}
type HastContent = HastElement | { type: "text" | "comment"; value: string };
interface HastRoot {
  type: "root";
  children: (HastContent | { type: "doctype" })[];
}

/** What is known about one block between the hooks of one highlight. */
interface BlockState {
  meta: CodeMeta;
  marks: (DiffKind | null)[];
  /** True when the signs come from `[!code ++]` markers, so the page draws them. In a `diff` block they are in the text. */
  drawnSigns: boolean;
}

/**
 * The hooks these transformers use, in the shape Shiki gives them. The type is written here because the
 * template does not depend on Shiki directly: it reaches it through the Astro markdown package.
 */
export interface CodeBlockTransformer {
  name: string;
  preprocess(
    this: { meta: object; options: { meta?: { __raw?: string } } },
    code: string,
    options: { lang?: string },
  ): string | void;
  line(this: { meta: object }, node: HastElement, line: number): void;
  root(this: { meta: object }, root: HastRoot): HastRoot | void;
}

const KEY = "sitekitCodeBlock";

/** Where the hooks of one block leave what they know: the `meta` of the context, which Shiki makes new for each block. */
const store = (context: { meta: object }) => context.meta as Record<string, BlockState | undefined>;

const element = (
  tagName: string,
  properties: Record<string, HastValue>,
  children: HastContent[] = [],
): HastElement => ({ type: "element", tagName, properties, children });
const text = (value: string): HastContent => ({ type: "text", value });

// The label of the copy button, and the message it shows and announces after a copy. The page script reads both from the button.
const COPY_LABEL = "Copy";
const COPIED_LABEL = "Copied";

/**
 * Shiki transformers that give a fenced code block its title, highlighted lines and diff lines, and wrap it with
 * the controls the page script uses. They read the meta string after the language, so a block without one is
 * only wrapped, and its lines get no mark.
 *
 * The output of a block is a `div` (a `figure` with a `figcaption` when it has a title) that holds the `pre`, a
 * copy button that is hidden until the page script shows it, and an empty polite status region for the message.
 * Lines carry `data-highlighted` and `data-diff="add"` or `"remove"`. A line marked with a `[!code ++]` comment
 * also carries `data-sign`, which the style draws as a plus or a minus. The comment is taken out of the code
 * before it is highlighted, so it is neither shown nor copied.
 */
export function codeBlockTransformers(): CodeBlockTransformer[] {
  return [
    {
      name: "sitekit-code-blocks",
      preprocess(code, options) {
        const meta = parseCodeMeta(this.options.meta?.__raw);
        const read = readDiffMarkers(code);
        let marks = read.marks;
        const hasMarkers = marks.some(Boolean);
        if (options.lang === "diff") {
          const fromSigns = readDiffLanguage(read.code);
          marks = fromSigns.map((mark, index) => marks[index] ?? mark);
        }
        const state: BlockState = {
          meta,
          marks,
          drawnSigns: hasMarkers && options.lang !== "diff",
        };
        store(this)[KEY] = state;
        return read.code;
      },
      line(node, line) {
        const state = store(this)[KEY];
        if (!state) return;
        const mark = state.marks[line - 1];
        if (isHighlighted(state.meta.highlighted, line)) node.properties.dataHighlighted = "";
        if (mark) {
          node.properties.dataDiff = mark;
          if (state.drawnSigns) node.properties.dataSign = "";
        }
      },
      root(root) {
        const state = store(this)[KEY];
        const pre = root.children[0];
        if (!state || pre?.type !== "element" || pre.tagName !== "pre") return;
        const { title } = state.meta;
        const parts: HastContent[] = [];
        if (title) parts.push(element("figcaption", { className: ["code-title"] }, [text(title)]));
        parts.push(
          pre,
          element(
            "button",
            {
              type: "button",
              className: ["copy-code"],
              ariaLabel: "Copy code",
              dataCopy: COPY_LABEL,
              dataCopied: COPIED_LABEL,
              hidden: true,
            },
            [text(COPY_LABEL)],
          ),
          element("span", { className: ["code-status"], role: "status", ariaLive: "polite" }),
        );
        const block = element(title ? "figure" : "div", { className: ["code-block"] }, parts);
        if (title) block.properties.dataTitled = "";
        return { type: "root", children: [block] };
      },
    },
  ];
}

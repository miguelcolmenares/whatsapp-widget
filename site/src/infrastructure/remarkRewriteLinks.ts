import { resolveLink } from "../domain";
import type { LinkContext } from "../domain";

interface Node {
  type: string;
  url?: string;
  children?: Node[];
}

/**
 * Remark plugin: rewrite relative links the way `resolveLink` decides. Code spans and fences
 * are never touched, because they are not link nodes.
 */
export function remarkRewriteLinks(options: {
  context: LinkContext;
  base: string;
  onWarning?: (message: string) => void;
}) {
  const visit = (node: Node) => {
    if (!node.children) return;
    node.children = node.children.flatMap((child) => {
      if (child.type === "link" && typeof child.url === "string") {
        const resolution = resolveLink(child.url, options.context);
        if (resolution.kind === "text-only") {
          options.onWarning?.(`${options.context.file}: ${resolution.warning}`);
          visit(child);
          return child.children ?? [];
        }
        if (resolution.kind === "missing")
          options.onWarning?.(`${options.context.file}: ${resolution.warning}`);
        if (
          resolution.kind === "route" ||
          resolution.kind === "repository" ||
          resolution.kind === "unchanged"
        ) {
          child.url = resolution.href;
        }
      }
      visit(child);
      return [child];
    });
  };
  return (tree: Node) => visit(tree);
}

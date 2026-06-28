import type { Code, Parent, Root } from "mdast";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";

export type RemarkMermaidCaptionOptions = {
  /**
   * "light" | "dark" — injected into the diagram's frontmatter config.theme
   * so rehype-mermaid renders with the correct theme. Pass undefined to
   * skip theme injection entirely (e.g. if theme is handled elsewhere).
   */
  theme?: "light" | "dark";
};

const CAPTION_ATTR_PATTERN = /caption\s*=\s*"([^"]*)"|caption\s*=\s*'([^']*)'/;

function extractCaption(meta: string | null | undefined): {
  caption: string | null;
  remainingMeta: string;
} {
  if (!meta) {
    return { caption: null, remainingMeta: "" };
  }

  const match = meta.match(CAPTION_ATTR_PATTERN);

  if (!match) {
    return { caption: null, remainingMeta: meta };
  }

  const caption = match[1] ?? match[2] ?? null;
  const remainingMeta = meta.replace(CAPTION_ATTR_PATTERN, "").trim();

  return { caption, remainingMeta };
}

function extractFrontmatterCaption(diagramSource: string): {
  caption: string | null;
  remainingSource: string;
} {
  const frontmatterMatch = diagramSource.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!frontmatterMatch) {
    return { caption: null, remainingSource: diagramSource };
  }

  const lines = frontmatterMatch[1].split("\n");
  let caption: string | null = null;
  const remainingLines: string[] = [];

  for (const line of lines) {
    const match = line.match(
      /^\s*caption:\s*(?:"([^"]*)"|'([^']*)'|([^#\n]*))/
    );
    if (match) {
      caption = match[1] ?? match[2] ?? match[3] ?? null;
      if (caption) {
        caption = caption.trim();
      }
    } else {
      remainingLines.push(line);
    }
  }

  const body = diagramSource.slice(frontmatterMatch[0].length);
  const hasRemainingContent = remainingLines.some((l) => l.trim() !== "");
  const remainingSource = hasRemainingContent
    ? `---\n${remainingLines.join("\n")}\n---\n${body}`
    : body;

  return { caption, remainingSource };
}

function injectThemeFrontmatter(
  diagramSource: string,
  theme: "light" | "dark"
): string {
  const mermaidThemeName = theme === "dark" ? "dark" : "default";

  const frontmatterMatch = diagramSource.match(/^---\n([\s\S]*?)\n---\n?/);

  if (!frontmatterMatch) {
    return `---\nconfig:\n  theme: ${mermaidThemeName}\n---\n${diagramSource}`;
  }

  const existingFrontmatter = frontmatterMatch[1];
  const body = diagramSource.slice(frontmatterMatch[0].length);

  const hasConfigBlock = /^config:/m.test(existingFrontmatter);
  const hasThemeLine = /^\s*theme:/m.test(existingFrontmatter);

  let newFrontmatter: string;

  if (hasConfigBlock && hasThemeLine) {
    newFrontmatter = existingFrontmatter.replace(
      /^(\s*)theme:.*$/m,
      `$1theme: ${mermaidThemeName}`
    );
  } else if (hasConfigBlock) {
    newFrontmatter = existingFrontmatter.replace(
      /^config:\s*$/m,
      `config:\n  theme: ${mermaidThemeName}`
    );
  } else {
    newFrontmatter = `${existingFrontmatter}\nconfig:\n  theme: ${mermaidThemeName}`;
  }

  return `---\n${newFrontmatter}\n---\n${body}`;
}

/**
 * Remark plugin: detects ```mermaid fences with a `caption="..."` attribute
 * in the fence info string, or a `caption:` entry in the diagram frontmatter,
 * strips that attribute/entry from the rendered code element, optionally
 * injects a theme into the diagram's own frontmatter, and wraps the code node
 * inside a nested <figure> HAST node structure with a <figcaption>.
 */
const remarkMermaidCaption: Plugin<[RemarkMermaidCaptionOptions?], Root> = (
  options
) => {
  return (tree: Root) => {
    visit(tree, "code", (node: Code, index, parent: Parent | undefined) => {
      if (
        node.lang !== "mermaid" ||
        !parent ||
        index === null ||
        index === undefined
      ) {
        return;
      }

      // Extract caption from node.meta (e.g. ```mermaid caption="hello")
      const metaCaptionResult = extractCaption(node.meta);
      node.meta = metaCaptionResult.remainingMeta || null;

      // Extract caption from node.value frontmatter (e.g. --- caption: hello ---)
      const frontmatterCaptionResult = extractFrontmatterCaption(node.value);
      node.value = frontmatterCaptionResult.remainingSource;

      const caption =
        metaCaptionResult.caption ?? frontmatterCaptionResult.caption;

      if (options?.theme) {
        node.value = injectThemeFrontmatter(node.value, options.theme);
      }

      if (!caption) {
        return;
      }

      // Wrap the code block in a structured <figure> and <figcaption> node
      const figureNode = {
        type: "paragraph",
        data: {
          hName: "figure",
          hProperties: { className: ["mermaid-figure"] }
        },
        children: [
          node,
          {
            type: "paragraph",
            data: {
              hName: "figcaption",
              hProperties: { className: ["text-center italic"] }
            },
            children: [{ type: "text", value: caption }]
          }
        ]
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      parent.children.splice(index, 1, figureNode as any);

      // Skip past the figure node we just inserted
      return index + 1;
    });
  };
};

export default remarkMermaidCaption;

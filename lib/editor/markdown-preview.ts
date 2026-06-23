import DOMPurify from "dompurify";
import type { TocHeading } from "@/components/editor/types";
import { resolveLocalImages } from "./resolve-local-images";

export type MarkdownPreviewResult = {
  headings: TocHeading[];
  html: string;
};

type FeatureFlags = {
  hasCode: boolean;
  hasDirective: boolean;
  hasMath: boolean;
  hasMermaid: boolean;
  hasRawHtml: boolean;
  hasEmoji: boolean;
};

const previewCache = new Map<string, MarkdownPreviewResult>();
const MAX_CACHE_ENTRIES = 5;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let coreModulesPromise: Promise<any[]> | null = null;

function getCoreModules() {
  if (!coreModulesPromise) {
    coreModulesPromise = Promise.all([
      import("remark"),
      import("remark-gfm"),
      import("remark-rehype"),
      import("rehype-stringify"),
      import("rehype-slug"),
      import("rehype-autolink-headings")
    ]);
  }

  return coreModulesPromise;
}

function detectFeatures(markdown: string): FeatureFlags {
  return {
    hasCode: /```/.test(markdown),
    hasDirective: /:::[\w-]+/.test(markdown),
    hasMath: /(^|[^\\])(\$\$|\$[^$\n]+\$|\\\(|\\\[)/m.test(markdown),
    hasMermaid: /```mermaid\b|:::\s*mermaid\b/.test(markdown),
    hasRawHtml: /<\/?[a-z][\s\S]*?>/i.test(markdown),
    // :rocket: :heart: :+1: etc.
    hasEmoji: /:[a-zA-Z0-9_+-]+:/.test(markdown)
  };
}

function sanitizeHtml(html: string) {
  return DOMPurify.sanitize(html, {
    ADD_ATTR: ["class", "id", "target", "rel", "src", "href", "alt", "style"],
    ALLOW_ARIA_ATTR: true,
    ALLOW_DATA_ATTR: false,
    FORBID_ATTR: ["onerror", "onload", "onclick", "onmouseover"],
    FORBID_TAGS: ["embed", "form", "iframe", "object", "script"],
    USE_PROFILES: { html: true }
  });
}

function extractHeadings(html: string): MarkdownPreviewResult {
  if (!/<h[1-4]/i.test(html)) {
    return {
      headings: [],
      html
    };
  }

  const parser = new DOMParser();
  const document = parser.parseFromString(html, "text/html");

  const headings: TocHeading[] = [];

  document.body
    .querySelectorAll("h1,h2,h3,h4,h5,h6")
    .forEach((heading, index) => {
      const text = heading.textContent?.trim() ?? `Section ${index + 1}`;

      const baseId = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

      const id = heading.id || baseId || `section-${index + 1}`;

      heading.id = id;

      headings.push({
        id,
        level: Number(heading.tagName.slice(1)),
        text
      });
    });

  return {
    headings,
    html: document.body.innerHTML
  };
}

export async function processMarkdownPreview(
  markdown: string,
  theme: "light" | "dark"
): Promise<MarkdownPreviewResult> {
  const cacheKey = `${theme}:${markdown}`;

  const cached = previewCache.get(cacheKey);

  if (cached) {
    return cached;
  }

  const features = detectFeatures(markdown);

  const [
    { remark },
    { default: remarkGfm },
    { default: remarkRehype },
    { default: rehypeStringify },
    { default: rehypeSlug },
    { default: rehypeAutolinkHeadings }
  ] = await getCoreModules();

  const processor = remark();

  // ------------------
  // Remark plugins
  // ------------------

  processor.use(remarkGfm);

  if (features.hasEmoji) {
    const { default: remarkEmoji } = await import("remark-emoji");

    processor.use(remarkEmoji);
  }

  if (features.hasDirective) {
    const [{ default: remarkDirective }, { default: remarkCustomDirectives }] =
      await Promise.all([
        import("remark-directive"),
        import("@/plugins/remarkCustomDirectives")
      ]);

    processor.use(remarkDirective);
    processor.use(remarkCustomDirectives);
  }

  if (features.hasMath) {
    const { default: remarkMath } = await import("remark-math");

    processor.use(remarkMath);
  }

  processor.use(remarkRehype, {
    allowDangerousHtml: true
  });

  // ------------------
  // Rehype plugins
  // ------------------

  if (features.hasRawHtml) {
    const { default: rehypeRaw } = await import("rehype-raw");

    processor.use(rehypeRaw);
  }

  if (features.hasMath) {
    const { default: rehypeKatex } = await import("rehype-katex");

    processor.use(rehypeKatex);
  }

  processor.use(rehypeSlug);

  processor.use(rehypeAutolinkHeadings, {
    behavior: "append"
  });

  if (features.hasMermaid) {
    const { default: rehypeMermaid } = await import("rehype-mermaid");

    processor.use(rehypeMermaid, {
      colorScheme: "light",
      strategy: "img-png"
    });
  }

  if (features.hasCode) {
    const { default: rehypePrettyCode } = await import("rehype-pretty-code");

    processor.use(rehypePrettyCode, {
      theme: theme === "dark" ? "github-dark" : "github-light",

      keepBackground: true,
      defaultLang: "plaintext",
      grid: false,
      tokensMap: {
        fn: "entity.name.function"
      }
    });
  }

  processor.use(rehypeStringify, {
    allowDangerousHtml: true
  });

  const file = await processor.process(markdown);

  const rawHtml = String(file);

  const resolvedHtml = await resolveLocalImages(rawHtml);

  const html = features.hasRawHtml ? sanitizeHtml(resolvedHtml) : resolvedHtml;

  const result = extractHeadings(html);

  previewCache.set(cacheKey, result);

  if (previewCache.size > MAX_CACHE_ENTRIES) {
    const oldestKey = previewCache.keys().next().value;

    if (oldestKey) {
      previewCache.delete(oldestKey);
    }
  }

  return result;
}

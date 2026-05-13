import DOMPurify from "dompurify";
import type { TocHeading } from "@/components/editor/types";

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
};

const previewCache = new Map<string, MarkdownPreviewResult>();
const MAX_CACHE_ENTRIES = 20;

function detectFeatures(markdown: string): FeatureFlags {
  return {
    hasCode: /```/.test(markdown),
    hasDirective: /:::[\w-]+/.test(markdown),
    hasMath: /(^|[^\\])(\$\$|\$[^$\n]+\$|\\\(|\\\[)/m.test(markdown),
    hasMermaid: /```mermaid\b|:::\s*mermaid\b/.test(markdown),
    hasRawHtml: /<\/?[a-z][\s\S]*?>/i.test(markdown),
  };
}

function sanitizeHtml(html: string) {
  return DOMPurify.sanitize(html, {
    ADD_ATTR: ["class", "id", "target", "rel", "src", "href", "alt", "style"],
    ALLOW_ARIA_ATTR: true,
    ALLOW_DATA_ATTR: false,
    FORBID_ATTR: ["onerror", "onload", "onclick", "onmouseover"],
    FORBID_TAGS: ["embed", "form", "iframe", "object", "script"],
    USE_PROFILES: { html: true },
  });
}

function extractHeadings(sanitizedHtml: string): MarkdownPreviewResult {
  const parser = new window.DOMParser();
  const document = parser.parseFromString(sanitizedHtml, "text/html");
  const headings: TocHeading[] = [];
  const headingElements = document.body.querySelectorAll("h1, h2, h3, h4");

  headingElements.forEach((heading, index) => {
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
      text,
    });
  });

  return {
    headings,
    html: document.body.innerHTML,
  };
}

function remember(markdown: string, result: MarkdownPreviewResult) {
  previewCache.set(markdown, result);

  if (previewCache.size <= MAX_CACHE_ENTRIES) {
    return;
  }

  const oldestKey = previewCache.keys().next().value;
  if (oldestKey) {
    previewCache.delete(oldestKey);
  }
}

export async function processMarkdownPreview(
  markdown: string,
): Promise<MarkdownPreviewResult> {
  const cached = previewCache.get(markdown);
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
    { default: rehypeAutolinkHeadings },
  ] = await Promise.all([
    import("remark"),
    import("remark-gfm"),
    import("remark-rehype"),
    import("rehype-stringify"),
    import("rehype-slug"),
    import("rehype-autolink-headings"),
  ]);

  const processor = remark().use(remarkGfm);

  if (features.hasDirective) {
    const [{ default: remarkDirective }, { default: remarkCustomDirectives }] =
      await Promise.all([
        import("remark-directive"),
        import("@/plugins/remarkCustomDirectives"),
      ]);

    processor.use(remarkDirective).use(remarkCustomDirectives);
  }

    if (features.hasMath) {
    const { default: remarkMath } = await import("remark-math");
    processor.use(remarkMath);
  }

  if (features.hasCode) {
    console.log("hasCode");
    const { default: rehypePrettyCode } = await import("rehype-pretty-code");
    processor.use(rehypePrettyCode, {
      theme: "github-dark",
      keepBackground: true,
      defaultLang: "plaintext",
      grid: false,
      tokensMap: {
        fn: "entity.name.function",
      },
    });
  }
  processor.use(remarkRehype, {
    allowDangerousHtml: true,
  });

  if (true) {
    const { default: rehypeRaw } = await import("rehype-raw");
    processor.use(rehypeRaw);
  }

  processor.use(rehypeSlug).use(rehypeAutolinkHeadings);


  if (features.hasMath) {
    const { default: rehypeKatex } = await import("rehype-katex");
    processor.use(rehypeKatex);
  }

  if (features.hasMermaid) {
    const { default: rehypeMermaid } = await import("rehype-mermaid");
    processor.use(rehypeMermaid, {
      colorScheme: "light",
      strategy: "img-png",
    });
  }



  processor.use(rehypeStringify, {
    allowDangerousHtml: true,
  });

  const file = await processor.process(markdown);
  const sanitizedHtml = sanitizeHtml(String(file));
  const result = extractHeadings(sanitizedHtml);
  remember(markdown, result);
  return result;
}

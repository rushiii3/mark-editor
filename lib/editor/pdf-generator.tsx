/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Image,
  Link
} from "@react-pdf/renderer";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkDirective from "remark-directive";
import { emojify } from "node-emoji";
import { getImageBlob } from "@/db/image";
import { mermaidToPng } from "@/lib/mermaid";
// Register Google Font Inter
Font.register({
  family: "Inter",
  fonts: [
    {
      src: "https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-400-normal.ttf",
      fontWeight: "normal",
      fontStyle: "normal"
    },
    {
      src: "https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-700-normal.ttf",
      fontWeight: "bold",
      fontStyle: "normal"
    },
    {
      src: "https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-400-italic.ttf",
      fontWeight: "normal",
      fontStyle: "italic"
    },
    {
      src: "https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-700-italic.ttf",
      fontWeight: "bold",
      fontStyle: "italic"
    }
  ]
});

Font.registerEmojiSource({
  format: "png",
  url: "/emoji/"
});

async function resolveEmoji(node: AstNode) {
  if (typeof node.value === "string") {
    console.log(emojify(node.value));
    node.value = emojify(node.value);
  }
  if (node.children) {
    node.children.forEach(resolveEmoji);
  }
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

const CAPTION_ATTR_PATTERN = /caption\s*=\s*"([^"]*)"|caption\s*=\s*'([^']*)'/;

function extractCaptionFromMeta(
  meta: string | null | undefined
): string | null {
  if (!meta) return null;
  const match = meta.match(CAPTION_ATTR_PATTERN);
  if (!match) return null;
  return match[1] ?? match[2] ?? null;
}

async function renderMermaidDiagrams(node: AstNode) {
  if (node.type === "code" && node.lang === "mermaid" && node.value) {
    try {
      const frontmatterResult = extractFrontmatterCaption(node.value);
      const cleanValue = frontmatterResult.remainingSource;

      const metaCaption = extractCaptionFromMeta(node.meta);
      const caption = metaCaption ?? frontmatterResult.caption ?? "";

      const png = await mermaidToPng(cleanValue);

      node.type = "image";
      node.url = png;
      node.alt = caption || undefined;

      delete node.value;
      delete node.lang;
      delete node.meta;
    } catch (err) {
      console.error("Mermaid render failed", err);
    }
  }

  if (node.children) {
    await Promise.all(node.children.map(renderMermaidDiagrams));
  }
}

interface AstNode {
  type: string;
  value?: string;
  url?: string;
  caption?: string;
  lang?: string;
  alt?: string;
  meta?: string;
  depth?: 1 | 2 | 3 | 4 | 5 | 6;
  ordered?: boolean;
  break?: boolean;
  name?: string;
  data?: {
    directiveLabel?: boolean;
    [key: string]: unknown;
  };
  children?: AstNode[];
}

const getStyles = (fontFamily: string) =>
  StyleSheet.create({
    page: {
      paddingTop: "20mm",
      paddingBottom: "22mm",
      paddingLeft: "18mm",
      paddingRight: "18mm",
      fontFamily,
      fontSize: 12,
      lineHeight: 1.55,
      color: "#000000"
    },
    h1: {
      fontFamily,
      fontSize: 22,
      fontWeight: "bold",
      marginBottom: 10,
      marginTop: 18,
      color: "#000000",
      lineHeight: 1.4
    },
    h2: {
      fontFamily,
      fontSize: 16,
      fontWeight: "bold",
      marginBottom: 8,
      marginTop: 14,
      color: "#000000",
      paddingBottom: 4
    },
    h3: {
      fontFamily,
      fontSize: 12,
      fontWeight: "bold",
      marginBottom: 6,
      marginTop: 10,
      color: "#000000"
    },
    paragraph: {
      fontFamily,
      marginBottom: 8
    },
    listItem: {
      fontFamily,
      flexDirection: "row",
      marginBottom: 4
    },
    listBullet: {
      fontFamily,
      width: 14,
      color: "#9CA3AF"
    },
    listContent: {
      fontFamily,
      flex: 1
    },
    bold: {
      fontFamily,
      fontWeight: "bold"
    },
    italic: {
      fontFamily,
      fontStyle: "italic"
    },
    inlineCode: {
      fontFamily: "Courier",
      backgroundColor: "#F3F4F6",
      color: "#1F2937",
      paddingTop: 2,
      paddingBottom: 2,
      paddingLeft: 4,
      paddingRight: 4,
      borderRadius: 3
    },
    codeBlock: {
      fontFamily: "Courier",
      backgroundColor: "#0F172A",
      color: "#F8FAFC",
      padding: 10,
      borderRadius: 6,
      marginBottom: 8,
      fontSize: 9
    },
    blockquote: {
      fontFamily,
      borderLeftWidth: 3,
      borderLeftColor: "#D1D5DB",
      paddingLeft: 10,
      marginBottom: 8,
      color: "#4B5563",
      fontStyle: "italic"
    },
    table: {
      fontFamily,
      width: "100%",
      borderWidth: 1,
      borderColor: "#E5E7EB",
      borderStyle: "solid",
      marginBottom: 10
    },

    tableRow: {
      fontFamily,
      flexDirection: "row",
      borderBottomWidth: 1,
      borderBottomColor: "#E5E7EB"
    },

    tableCell: {
      fontFamily,
      flex: 1,
      padding: 6,
      fontSize: 9,
      borderRightWidth: 1,
      borderRightColor: "#E5E7EB"
    },

    tableHeaderCell: {
      fontFamily,
      fontWeight: "bold",
      backgroundColor: "#F9FAFB",
      color: "#111827"
    },
    callout: {
      fontFamily,
      padding: 10,
      borderLeftWidth: 4,
      borderRadius: 4,
      marginBottom: 10
    },
    calloutHeader: {
      fontFamily,
      fontWeight: "bold",
      fontSize: 9,
      marginBottom: 4
    },
    calloutContent: {
      fontFamily,
      fontSize: 9.5
    },
    footer: {
      fontFamily,
      position: "absolute",
      bottom: 20,
      left: 46,
      right: 46,
      borderTopWidth: 1,
      borderTopColor: "#E5E7EB",
      paddingTop: 8,
      flexDirection: "row",
      justifyContent: "space-between",
      fontSize: 8,
      color: "#9CA3AF"
    }
  });

async function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;

    reader.readAsDataURL(blob);
  });
}

export async function webpToPng(url: string): Promise<string> {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return url;
  }
  const img = new window.Image(); // ✅ Native browser Image
  img.crossOrigin = "anonymous";
  img.decoding = "async";

  return new Promise((resolve, reject) => {
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Failed to get canvas context"));
        return;
      }

      ctx.drawImage(img, 0, 0);

      resolve(canvas.toDataURL("image/png"));
    };

    img.onerror = () => reject(new Error(`Failed to load image: ${url}`));

    img.src = url;
  });
}

function isWebpUrl(url: string): boolean {
  if (!url) return false;
  const normalized = url.toLowerCase();
  if (normalized.startsWith("data:image/webp")) {
    return true;
  }
  const pathPart = url.split("?")[0].split("#")[0];
  return pathPart.toLowerCase().endsWith(".webp");
}

async function convertWebpImagesToPng(node: AstNode) {
  if (node.type === "image" && node.url && isWebpUrl(node.url)) {
    try {
      const pngUrl = await webpToPng(node.url);
      node.url = pngUrl;
      console.log(
        "Converted webp image to png for PDF:",
        node.url.substring(0, 50)
      );
    } catch (error) {
      console.error(
        "Failed to convert webp image to png for PDF:",
        node.url,
        error
      );
      // Keep original url as fallback
    }
  }

  if (node.children) {
    await Promise.all(node.children.map(convertWebpImagesToPng));
  }
}

async function resolveAstLocalImages(node: AstNode) {
  if (
    node.type === "image" &&
    node.url &&
    node.url.startsWith("local-image:")
  ) {
    const id = node.url.replace("local-image:", "");

    try {
      const blob = await getImageBlob(id);

      if (blob) {
        node.url = await blobToDataUrl(blob);
        console.log("Resolved image:", node.url.substring(0, 50));
      }
    } catch (error) {
      console.error("Failed to resolve local image for PDF:", id, error);
    }
  }

  if (node.children) {
    await Promise.all(node.children.map(resolveAstLocalImages));
  }
}

function renderChildren(children: AstNode[] | undefined, styles: any) {
  if (!children) return null;
  return children.map((child, index) => renderInlineNode(child, index, styles));
}

function renderInlineNode(
  node: AstNode,
  index: number,
  styles: any
): React.ReactNode {
  switch (node.type) {
    case "text":
      return node.value;
    case "strong":
      return (
        <Text key={index} style={styles.bold}>
          {renderChildren(node.children, styles)}
        </Text>
      );
    case "emphasis":
      return (
        <Text key={index} style={styles.italic}>
          {renderChildren(node.children, styles)}
        </Text>
      );
    case "delete":
      return (
        <Text
          key={index}
          style={{
            textDecoration: "line-through",
            fontFamily: styles.page.fontFamily
          }}
        >
          {renderChildren(node.children, styles)}
        </Text>
      );
    case "inlineCode":
      return (
        <Text key={index} style={styles.inlineCode}>
          {node.value}
        </Text>
      );
    case "link":
      return (
        <Link
          key={index}
          style={{
            color: "#2563EB",
            textDecoration: "underline",
            fontFamily: styles.page.fontFamily
          }}
          src={node.url}
        >
          {renderChildren(node.children, styles)}
        </Link>
      );
    case "break":
      return "\n";
    default:
      return null;
  }
}

function renderBlockNode(
  node: AstNode,
  index: number,
  styles: any
): React.ReactNode {
  console.log("Node type:", node.type, node);
  switch (node.type) {
    case "heading": {
      const headingStyle =
        node.depth === 1 ? styles.h1 : node.depth === 2 ? styles.h2 : styles.h3;
      return (
        <Text key={index} style={headingStyle} break={node.break}>
          {renderChildren(node.children, styles)}
        </Text>
      );
    }
    case "paragraph": {
      const hasImage = node.children?.some((c) => c.type === "image");

      if (hasImage) {
        return (
          <View key={index} style={styles.paragraph}>
            {node.children?.map((child, i) => {
              if (child.type === "image") {
                return renderBlockNode(child, i, styles);
              }

              return (
                <Text key={i} style={{ fontFamily: styles.page.fontFamily }}>
                  {renderInlineNode(child, i, styles)}
                </Text>
              );
            })}
          </View>
        );
      }

      return (
        <Text key={index} style={styles.paragraph}>
          {renderChildren(node.children, styles)}
        </Text>
      );
    }
    case "blockquote":
      return (
        <View key={index} style={styles.blockquote} break={node.break}>
          {node.children?.map((child, i) => renderBlockNode(child, i, styles))}
        </View>
      );
    case "code":
      return (
        <View key={index} style={styles.codeBlock} break={node.break}>
          <Text>{node.value}</Text>
        </View>
      );
    case "list": {
      const isOrdered = node.ordered;
      return (
        <View key={index} style={{ marginBottom: 8 }} break={node.break}>
          {node.children?.map((item: AstNode, i: number) => {
            const bullet = isOrdered ? `${i + 1}. ` : "• ";
            return (
              <View key={i} style={styles.listItem}>
                <Text style={styles.listBullet}>{bullet}</Text>
                <View style={styles.listContent}>
                  {item.children?.map((child, idx) =>
                    renderBlockNode(child, idx, styles)
                  )}
                </View>
              </View>
            );
          })}
        </View>
      );
    }
    case "thematicBreak":
      return (
        <View
          key={index}
          style={{
            borderBottomWidth: 1,
            borderBottomColor: "#E5E7EB",
            marginVertical: 10
          }}
          break={node.break}
        />
      );
    case "table":
      return (
        <View key={index} style={styles.table} break={node.break}>
          {node.children?.map((row: AstNode, rowIndex: number) => (
            <View key={rowIndex} style={styles.tableRow}>
              {row.children?.map((cell: AstNode, cellIndex: number) => {
                const isHeader = rowIndex === 0;
                return (
                  <View
                    key={cellIndex}
                    style={
                      isHeader
                        ? [styles.tableCell, styles.tableHeaderCell]
                        : styles.tableCell
                    }
                  >
                    <Text style={{ fontFamily: styles.page.fontFamily }}>
                      {renderChildren(cell.children, styles)}
                    </Text>
                  </View>
                );
              })}
            </View>
          ))}
        </View>
      );
    case "image":
      return (
        <View
          key={index}
          style={{ marginVertical: 8, alignItems: "center" }}
          break={node.break}
        >
          <Image
            src={node.url}
            style={{ width: "100%", objectFit: "contain" }}
          />
          {node.alt && (
            <Text
              style={{
                fontSize: 8,
                color: "#6B7280",
                marginTop: 4,
                fontFamily: styles.page.fontFamily
              }}
            >
              {node.alt}
            </Text>
          )}
        </View>
      );
    case "containerDirective": {
      if (node.name === "callout") {
        const labelNode = node.children?.find(
          (child: AstNode) => child.data?.directiveLabel === true
        );
        let type = "info";
        if (labelNode && labelNode.children && labelNode.children[0]) {
          type = labelNode.children[0].value || "info";
        }
        type = type.toLowerCase();

        const contentChildren =
          node.children?.filter(
            (child: AstNode) => !child.data?.directiveLabel
          ) || [];

        let borderColor = "#D1D5DB";
        let bgColor = "#F3F4F6";
        let textColor = "#1F2937";
        let label = "Note";

        if (type === "warning") {
          borderColor = "#FBBF24";
          bgColor = "#FEF3C7";
          textColor = "#92400E";
          label = "Warning";
        } else if (type === "error") {
          borderColor = "#EF4444";
          bgColor = "#FEE2E2";
          textColor = "#991B1B";
          label = "Error";
        } else if (type === "success") {
          borderColor = "#10B981";
          bgColor = "#D1FAE5";
          textColor = "#065F46";
          label = "Success";
        } else if (type === "tip") {
          borderColor = "#14B8A6";
          bgColor = "#CCFBF1";
          textColor = "#0F766E";
          label = "Tip";
        } else if (type === "important") {
          borderColor = "#8B5CF6";
          bgColor = "#EDE9FE";
          textColor = "#5B21B6";
          label = "Important";
        }

        return (
          <View
            key={index}
            style={[
              styles.callout,
              { borderLeftColor: borderColor, backgroundColor: bgColor }
            ]}
            break={node.break}
          >
            <Text style={[styles.calloutHeader, { color: textColor }]}>
              {label}
            </Text>
            <View style={styles.calloutContent}>
              {contentChildren.map((child, idx) =>
                renderBlockNode(child, idx, styles)
              )}
            </View>
          </View>
        );
      }
      if (node.name === "collapse") {
        const labelNode = node.children?.find(
          (child: AstNode) => child.data?.directiveLabel === true
        );
        let title = "Details";
        if (labelNode && labelNode.children && labelNode.children[0]) {
          title = labelNode.children[0].value || "Details";
        }

        const contentChildren =
          node.children?.filter(
            (child: AstNode) => !child.data?.directiveLabel
          ) || [];

        return (
          <View
            key={index}
            style={{
              borderWidth: 1,
              borderColor: "#E5E7EB",
              borderRadius: 4,
              padding: 8,
              marginVertical: 6
            }}
            break={node.break}
          >
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 9,
                color: "#374151",
                fontFamily: styles.page.fontFamily
              }}
            >
              {title}
            </Text>
            <View style={{ marginTop: 4 }}>
              {contentChildren.map((child, idx) =>
                renderBlockNode(child, idx, styles)
              )}
            </View>
          </View>
        );
      }
      return (
        <View key={index}>
          {node.children?.map((child, idx) =>
            renderBlockNode(child, idx, styles)
          )}
        </View>
      );
    }
    case "leafDirective": {
      if (node.name === "pagebreak" || node.name === "page-break") {
        return <View key={index} break />;
      }
      return null;
    }
    case "html": {
      if (node.value && node.value.includes("page-break")) {
        return <View key={index} break />;
      }
      return null;
    }
    default:
      return null;
  }
}

interface MarkdownPdfDocumentProps {
  ast: AstNode;
  activeFont?: string;
}

export function MarkdownPdfDocument({
  ast,
  activeFont = "Inter"
}: MarkdownPdfDocumentProps) {
  const styles = getStyles(activeFont);

  return (
    <Document>
      <Page size="A4" style={[styles.page, { fontFamily: activeFont }]}>
        <View>
          {/* {ast.children?.map((child: AstNode, index: number) =>
            renderBlockNode(child, index)
          )} */}
          {ast.children?.map((child, index) => {
            console.log(index, child.type, child.children?.length);

            return renderBlockNode(child, index, styles);
          })}
        </View>
      </Page>
    </Document>
  );
}

export async function generateMarkdownPdfBlob(
  markdown: string,
  activeFont: string = "Inter"
): Promise<Blob> {
  const processor = remark()
    .use(remarkGfm)
    // .use(remarkEmoji)
    .use(remarkDirective);
  const ast = processor.parse(markdown) as unknown as AstNode;
  console.log(ast);

  // Resolve local image Blobs asynchronously from IndexedDB before rendering
  await resolveAstLocalImages(ast);

  // Convert WebP images to PNG format for react-pdf compatibility
  await convertWebpImagesToPng(ast);

  await renderMermaidDiagrams(ast);

  await resolveEmoji(ast);

  // Register custom user-uploaded fonts dynamically
  if (
    activeFont !== "Inter" &&
    activeFont !== "Helvetica" &&
    activeFont !== "Courier"
  ) {
    try {
      const { getFontsByFamily } = await import("@/db/font");
      const storedFonts = await getFontsByFamily(activeFont);
      console.log(storedFonts);

      if (storedFonts && storedFonts.length > 0) {
        // Find specific variants or fallback gracefully to avoid react-pdf crashes
        const regular =
          storedFonts.find(
            (f) => f.weight === "normal" && f.style === "normal"
          ) || storedFonts[0];
        const bold =
          storedFonts.find(
            (f) => f.weight === "bold" && f.style === "normal"
          ) || regular;
        const italic =
          storedFonts.find(
            (f) => f.weight === "normal" && f.style === "italic"
          ) || regular;
        const boldItalic =
          storedFonts.find(
            (f) => f.weight === "bold" && f.style === "italic"
          ) ||
          italic ||
          bold ||
          regular;

        const fontFaces = [
          {
            src: URL.createObjectURL(regular.blob),
            fontWeight: "normal" as never,
            fontStyle: "normal" as never
          },
          {
            src: URL.createObjectURL(bold.blob),
            fontWeight: "bold" as never,
            fontStyle: "normal" as never
          },
          {
            src: URL.createObjectURL(italic.blob),
            fontWeight: "normal" as never,
            fontStyle: "italic" as never
          },
          {
            src: URL.createObjectURL(boldItalic.blob),
            fontWeight: "bold" as never,
            fontStyle: "italic" as never
          }
        ];

        console.log(fontFaces);

        Font.register({
          family: activeFont,
          fonts: fontFaces
        });
      }
    } catch (err) {
      console.error(
        `Failed to dynamically load/register custom font ${activeFont}:`,
        err
      );
    }
  }

  const { pdf } = await import("@react-pdf/renderer");
  const resolvedPdf = await pdf(
    <MarkdownPdfDocument ast={ast} activeFont={activeFont} />
  ).toBlob();
  console.log(resolvedPdf);
  return resolvedPdf;
}

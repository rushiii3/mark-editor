/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
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
import { Math } from "@react-pdf/math";
import { getImageBlob } from "@/db/image";

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

function hashString(str: string): string {
  let hash = 0x811c9dc5; // FNV-1a offset basis
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = globalThis.Math.imul(hash, 0x01000193); // FNV prime
  }
  return (hash >>> 0).toString(36);
}
const mermaidPngCache = new Map<string, string>();

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
  style: any;
  children?: AstNode[];
}

const stylesCache = new Map<string, ReturnType<typeof StyleSheet.create>>();

const getDynamicStyles = (fontFamily: string, layoutConfig?: any) => {
  const cacheKey = fontFamily + "_" + JSON.stringify(layoutConfig || {});
  const cached = stylesCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const baseFontSize = layoutConfig?.bodyFontSize || 12;
  const baseLineHeight = layoutConfig?.bodyLineHeight || 1.55;
  const paragraphSpacing = layoutConfig?.paragraphSpacing !== undefined ? layoutConfig.paragraphSpacing : 8;
  const alignment = layoutConfig?.bodyAlignment || "left";
  const margins = layoutConfig?.margins || { top: 20, bottom: 22, left: 18, right: 18 };
  const accent = layoutConfig?.accentColor || "#000000";

  const isDarkCode = layoutConfig?.codeBlockTheme === "dark";
  const codeBg = isDarkCode ? "#1e1e1e" : "#F3F4F6";
  const codeColor = isDarkCode ? "#d4d4d4" : "#1F2937";
  const inlineBg = isDarkCode ? "#2d2d2d" : "#f3f4f6";
  const inlineColor = isDarkCode ? "#e06c75" : "#d63384";

  const styles = StyleSheet.create({
    page: {
      paddingTop: `${margins.top}mm`,
      paddingBottom: `${margins.bottom}mm`,
      paddingLeft: `${margins.left}mm`,
      paddingRight: `${margins.right}mm`,
      fontFamily,
      fontSize: baseFontSize,
      lineHeight: baseLineHeight,
      color: "#000000",
      textAlign: alignment as any
    },
    h1: {
      fontFamily,
      fontSize: globalThis.Math.round(baseFontSize * 1.83), // 22 when base is 12
      fontWeight: "bold",
      marginBottom: 10,
      marginTop: 18,
      color: accent,
      lineHeight: 1.4
    },
    h2: {
      fontFamily,
      fontSize: globalThis.Math.round(baseFontSize * 1.33), // 16 when base is 12
      fontWeight: "bold",
      marginBottom: 8,
      marginTop: 14,
      color: accent,
      paddingBottom: 4
    },
    h3: {
      fontFamily,
      fontSize: baseFontSize,
      fontWeight: "bold",
      marginBottom: 6,
      marginTop: 10,
      color: "#000000"
    },
    paragraph: {
      fontFamily,
      paddingBottom: paragraphSpacing
    },
    listItem: {
      fontFamily,
      flexDirection: "row",
      marginBottom: 4
    },
    listBullet: {
      fontFamily,
      width: 14,
      color: accent
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
      fontSize: baseFontSize * 0.75,
      color: inlineColor,
      backgroundColor: inlineBg,
      letterSpacing: 0.2,
      lineHeight: 1.2
    },
    codeBlock: {
      fontFamily: "Courier",
      backgroundColor: codeBg,
      color: codeColor,
      paddingTop: 6,
      paddingHorizontal: 6,
      borderRadius: 6,
      marginBottom: 8,
      fontSize: baseFontSize * 0.75
    },
    blockquote: {
      fontFamily,
      borderLeftWidth: 2.5,
      borderLeftColor: accent,
      paddingLeft: 10,
      marginBottom: 8,
      color: "#4B5563",
      fontStyle: "italic",
      paddingTop: 4
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
      fontSize: baseFontSize * 0.75,
      borderRightWidth: 1,
      borderRightColor: "#E5E7EB"
    },
    tableHeaderCell: {
      fontFamily,
      fontWeight: "bold",
      backgroundColor: "#F9FAFB",
      color: "#111827",
      lineHeight: 1
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
      fontSize: baseFontSize * 0.75,
      marginBottom: 4
    },
    calloutContent: {
      fontFamily,
      fontSize: baseFontSize * 0.79
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
    },
    watermark: {
      position: "absolute",
      top: "35%",
      left: "-25%",
      width: "150%",
      textAlign: "center",
      fontSize: 60,
      fontWeight: "bold",
      color: "#a1a1a1",
      transform: "rotate(-30deg)",
      zIndex: -1
    },
    watermarkCover: {
      position: "absolute",
      top: "35%",
      left: "-25%",
      width: "150%",
      textAlign: "center",
      fontSize: 60,
      fontWeight: "bold",
      color: "#a1a1a1",
      transform: "rotate(-30deg)",
      zIndex: -1
    }
  });

  stylesCache.set(cacheKey, styles);
  return styles;
};

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

function renderChildren(children: AstNode[] | undefined, styles: any) {
  if (!children) return null;
  return children.map((child, index) => renderInlineNode(child, index, styles));
}

function getMathHeight(latex: string, inline: boolean) {
  if (!inline) {
    return 18;
  }

  const hasTallContent = /\\frac|\\sqrt|\\sum|\\int|\\prod|\\begin/.test(latex);

  return hasTallContent ? 13 : 10;
}
function renderInlineNode(
  node: AstNode,
  index: number,
  styles: any
): React.ReactNode {
  switch (node.type) {
    case "text":
      return (
        <Text key={index} style={[styles.paragraph, node.style]}>
          {node.value ?? ""}
        </Text>
      );
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
      // console.log("inline code: ", node.value);
      return (
        <Text style={styles.inlineCode} key={index}>
          {node.value}test
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
    case "inlineMath":
      console.log("inline math: ", node.value);

      return (
        <Math
          inline
          height={node.value && getMathHeight(node.value, true)}
          color="black"
          key={index}
        >
          {typeof node.value === "string" ? node.value : ""}
        </Math>
      );
    default:
      return null;
  }
}

function renderBlockNode(
  node: AstNode,
  index: number,
  styles: any,
  headingPageBreak?: boolean
): React.ReactNode {
  switch (node.type) {
    case "heading": {
      const headingStyle =
        node.depth === 1 ? styles.h1 : node.depth === 2 ? styles.h2 : styles.h3;
      const shouldBreak = node.break || (node.depth === 1 && headingPageBreak);
      return (
        <Text key={index} style={[headingStyle, node.style]} break={shouldBreak}>
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
                return renderBlockNode(child, i, styles, headingPageBreak);
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
        <View
          key={index}
          style={{
            flexDirection: "row",
            alignItems: "flex-start",
            flexWrap: "wrap"
            // alignItems: "flex-ce"
          }}
        >
          {node.children?.map((child, i) => renderInlineNode(child, i, styles))}
        </View>
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
        <View
          key={index}
          style={styles.table}
          // break={node.br/eak}
        >
          {node.children?.map((row: AstNode, rowIndex: number) => (
            <View key={rowIndex} style={styles.tableRow} wrap={false}>
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
                    wrap={false}
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
    case "math":
      return (
        <Math
          inline={false}
          height={node.value && getMathHeight(node.value, false)}
          color="black"
          key={index}
        >
          {typeof node.value === "string" ? node.value : ""}
        </Math>
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
      if (
        node.name === "justify" ||
        node.name === "left" ||
        node.name === "right" ||
        node.name === "center"
      ) {
        {
          node.children?.map((child) => {
            return (child.style = { textAlign: node.name });
          });
        }
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
      if (node.name === "linebreak" || node.name === "line-break") {
        console.log(node);
        return (
          <View
            key={index}
            style={{
              marginVertical: 10
            }}
            break={node.break}
          />
        );
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
  layoutConfig?: any;
  metadata?: any;
}

const resolvePdfText = (text: string, metadata: Record<string, string>) => {
  let resolved = text || "";
  resolved = resolved.replace(/\{\{title\}\}/gi, metadata.title || "");
  resolved = resolved.replace(/\{\{file_name\}\}/gi, metadata.file_name || "");
  resolved = resolved.replace(/\{\{author\}\}/gi, metadata.author || "");
  resolved = resolved.replace(/\{\{company\}\}/gi, metadata.company || "");
  resolved = resolved.replace(/\{\{version\}\}/gi, metadata.version || "");
  resolved = resolved.replace(/\{\{date\}\}/gi, metadata.date || "");
  resolved = resolved.replace(/\{\{time\}\}/gi, metadata.time || "");
  return resolved;
};

const PdfRegion = ({
  region,
  metadata,
  align,
  layoutConfig
}: {
  region: any;
  metadata: Record<string, string>;
  align: string;
  layoutConfig?: any;
}) => {
  if (!region) return null;
  const text = region.text || "";
  const hasPage = /\{\{page\}\}/i.test(text);
  const hasPages = /\{\{pages\}\}/i.test(text);

  const baseStyle: any = {
    fontFamily: region.fontFamily || "Inter",
    fontSize: parseFloat(region.fontSize || "9") || 9,
    fontWeight: region.bold ? "bold" : "normal",
    fontStyle: region.italic ? "italic" : "normal",
    textDecoration: region.underline ? "underline" : "none",
    color: region.color || "#64748b"
  };

  const containerStyle: any = {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: align === "right" ? "flex-end" : align === "center" ? "center" : "flex-start",
    flex: 1
  };

  const formatPageNumber = (num: number, format?: string) => {
    if (num <= 0) return "";
    if (format === "roman") {
      const romanMap: Record<number, string> = {
        1: "I", 2: "II", 3: "III", 4: "IV", 5: "V",
        6: "VI", 7: "VII", 8: "VIII", 9: "IX", 10: "X"
      };
      return romanMap[num] || num.toString();
    }
    if (format === "alphabetical") {
      const alphaMap: Record<number, string> = {
        1: "A", 2: "B", 3: "C", 4: "D", 5: "E",
        6: "F", 7: "G", 8: "H", 9: "I", 10: "J"
      };
      return alphaMap[num] || num.toString();
    }
    return num.toString();
  };

  const renderContent = (pageNumber?: number, totalPages?: number) => {
    let resolved = text;
    if (pageNumber !== undefined) {
      const startOffset = layoutConfig?.pageNumberStart !== undefined ? layoutConfig.pageNumberStart : 1;
      const pageIndex = layoutConfig?.autoCoverPage
        ? (pageNumber === 1 ? 0 : (pageNumber - 2) + startOffset)
        : (pageNumber - 1) + startOffset;
      const formattedNum = formatPageNumber(pageIndex, layoutConfig?.pageNumberFormat);
      resolved = resolved.replace(/\{\{page\}\}/gi, formattedNum);
    }
    if (totalPages !== undefined) {
      resolved = resolved.replace(/\{\{pages\}\}/gi, totalPages.toString());
    }
    return resolvePdfText(resolved, metadata);
  };

  return (
    <View style={containerStyle}>
      {region.image && (
        <Image src={region.image} style={{ height: 11, marginRight: 5 }} />
      )}
      {hasPage || hasPages ? (
        <Text
          style={baseStyle}
          render={({ pageNumber, totalPages }) => renderContent(pageNumber, totalPages)}
        />
      ) : (
        <Text style={baseStyle}>
          {renderContent()}
        </Text>
      )}
    </View>
  );
};

function parseCssForPdf(css: string): { header: any; footer: any } {
  const result = {
    header: {},
    footer: {}
  };
  if (!css) return result;

  const cleanCss = css.replace(/\/\*[\s\S]*?\*\//g, "");

  const headerMatch = cleanCss.match(/\.header\s*\{([^}]+)\}/i);
  const footerMatch = cleanCss.match(/\.footer\s*\{([^}]+)\}/i);

  const parseRules = (ruleStr: string) => {
    const styles: any = {};
    const rules = ruleStr.split(";");
    for (const rule of rules) {
      const parts = rule.split(":");
      if (parts.length < 2) continue;
      const key = parts[0].trim().toLowerCase();
      const val = parts[1].trim();

      if (key === "border-bottom" || key === "border-top") {
        const borderMatch = val.match(/([\d.]+)(px|pt|mm)?\s+(\w+)\s+(#\w+|rgb\([^)]+\)|\w+)/i);
        const prefix = key === "border-bottom" ? "borderBottom" : "borderTop";
        if (borderMatch) {
          styles[`${prefix}Width`] = parseFloat(borderMatch[1]) || 1;
          styles[`${prefix}Color`] = borderMatch[4];
          styles[`${prefix}Style`] = borderMatch[3] === "dashed" ? "dashed" : "solid";
        } else {
          const sizeVal = parseFloat(val);
          if (!isNaN(sizeVal)) {
            styles[`${prefix}Width`] = sizeVal;
            styles[`${prefix}Color`] = "#e2e8f0";
            styles[`${prefix}Style`] = "solid";
          }
        }
      } else if (key === "padding-bottom" || key === "padding-top") {
        const prop = key === "padding-bottom" ? "paddingBottom" : "paddingTop";
        const valNum = parseFloat(val);
        if (!isNaN(valNum)) styles[prop] = valNum;
      } else if (key === "margin-bottom" || key === "margin-top") {
        const prop = key === "margin-bottom" ? "marginBottom" : "marginTop";
        const valNum = parseFloat(val);
        if (!isNaN(valNum)) styles[prop] = valNum;
      } else if (key === "color") {
        styles.color = val;
      }
    }
    return styles;
  };

  if (headerMatch) result.header = parseRules(headerMatch[1]);
  if (footerMatch) result.footer = parseRules(footerMatch[1]);

  return result;
}

function MarkdownPdfDocument({
  ast,
  activeFont = "Inter",
  layoutConfig,
  metadata = {}
}: MarkdownPdfDocumentProps) {
  // Use dynamic configuration styling
  const styles = getDynamicStyles(activeFont, layoutConfig);

  // Compile CSS rules for pdf renderer
  const cssStyles = parseCssForPdf(layoutConfig?.advancedCss);

  const headerStyle = {
    position: "absolute" as const,
    top: 20,
    left: 46,
    right: 46,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
    borderBottomWidth: layoutConfig?.headerDividerWidth || 0,
    borderBottomColor: layoutConfig?.headerDividerColor || "#cbd5e1",
    borderBottomStyle: "solid" as const,
    paddingBottom: 4,
    ...cssStyles.header
  };

  const footerStyle = {
    position: "absolute" as const,
    bottom: 20,
    left: 46,
    right: 46,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
    borderTopWidth: layoutConfig?.footerDividerWidth || 0,
    borderTopColor: layoutConfig?.footerDividerColor || "#cbd5e1",
    borderTopStyle: "solid" as const,
    paddingTop: 6,
    ...cssStyles.footer
  };

  // Compile PDF permissions parameters mapping
  const pdfPermissions = {
    contentAccessibility: layoutConfig?.allowCopying !== undefined ? layoutConfig.allowCopying : true,
    printing: layoutConfig?.allowPrinting || "highResolution",
    modifying: layoutConfig?.allowModifying !== undefined ? layoutConfig.allowModifying : true,
    copying: layoutConfig?.allowCopying !== undefined ? layoutConfig.allowCopying : true,
    annotating: layoutConfig?.allowModifying !== undefined ? layoutConfig.allowModifying : true
  };

  return (
    <Document
      title={metadata.title || "Untitled Document"}
      author={metadata.author || "Manus MD Editor"}
      subject={layoutConfig?.subject || metadata.subject || ""}
      creator={layoutConfig?.creator || metadata.creator || "Manus MD Editor"}
      keywords={layoutConfig?.keywords || metadata.keywords || ""}
      userPassword={layoutConfig?.userPassword || undefined}
      ownerPassword={layoutConfig?.ownerPassword || undefined}
      permissions={pdfPermissions}
      producer="Manus MarkDown Editor"
      pdfVersion="1.7"
      language="English"
    >
      {/* Cover Page */}
      {layoutConfig?.autoCoverPage && (
        <Page
          size={layoutConfig.pageSize || "A4"}
          orientation={layoutConfig.orientation || "portrait"}
          style={[styles.page, { justifyContent: "center", alignItems: "center", padding: 30 }]}
        >
          {layoutConfig.watermarkText && (
            <Text
              style={[
                styles.watermarkCover,
                { opacity: layoutConfig.watermarkOpacity !== undefined ? layoutConfig.watermarkOpacity : 0.08 }
              ]}
            >
              {layoutConfig.watermarkText}
            </Text>
          )}
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center", width: "100%" }}>
            <Text style={{ fontSize: 32, fontWeight: "bold", marginBottom: 15, textAlign: "center" }}>
              {metadata.title}
            </Text>
            <View style={{ width: 60, height: 3, backgroundColor: layoutConfig?.accentColor || "#3b82f6", marginBottom: 20 }} />
            {metadata.description && (
              <Text style={{ fontSize: 13, color: "#475569", marginBottom: 40, textAlign: "center", lineHeight: 1.5 }}>
                {metadata.description}
              </Text>
            )}
            <View style={{ marginTop: 20, alignItems: "center" }}>
              {metadata.author && (
                <Text style={{ fontSize: 11, color: "#1e293b", fontWeight: "bold", marginBottom: 4 }}>
                  {metadata.author}
                </Text>
              )}
              {metadata.company && (
                <Text style={{ fontSize: 10, color: "#64748b", marginBottom: 4 }}>
                  {metadata.company}
                </Text>
              )}
              {metadata.version && (
                <Text style={{ fontSize: 9, color: "#94a3b8", marginBottom: 15, fontFamily: "Courier" }}>
                  Version {metadata.version}
                </Text>
              )}
              {metadata.date && (
                <Text style={{ fontSize: 9, color: "#64748b" }}>
                  {metadata.date}
                </Text>
              )}
            </View>
          </View>
        </Page>
      )}

      {/* Main Content Pages */}
      <Page
        wrap={true}
        size={layoutConfig?.pageSize || "A4"}
        orientation={layoutConfig?.orientation || "portrait"}
        style={[styles.page, { fontFamily: activeFont }]}
      >
        {/* Scoped Diagonal Watermark */}
        {layoutConfig?.watermarkText && (
          <Text
            fixed
            style={[
              styles.watermark,
              { opacity: layoutConfig.watermarkOpacity !== undefined ? layoutConfig.watermarkOpacity : 0.08 }
            ]}
          >
            {layoutConfig.watermarkText}
          </Text>
        )}

        {/* Scoped Running Header */}
        {layoutConfig?.header && (
          <View
            fixed
            style={headerStyle}
            render={({ pageNumber }) => {
              const startPage = layoutConfig.autoCoverPage ? 2 : 1;
              if (layoutConfig.excludeHeaderFooterFirstPage && pageNumber === startPage) {
                return null;
              }
              const isEven = pageNumber % 2 === 0;
              const mirror = !!layoutConfig.mirrorHeaderFooterOddEven;
              const leftRegion = isEven && mirror ? layoutConfig.header.right : layoutConfig.header.left;
              const rightRegion = isEven && mirror ? layoutConfig.header.left : layoutConfig.header.right;
              const leftAlign = isEven && mirror ? "right" : "left";
              const rightAlign = isEven && mirror ? "left" : "right";

              return (
                <View style={{ flexDirection: "row", justifyContent: "space-between", width: "100%" }}>
                  <PdfRegion region={leftRegion} metadata={metadata} align={leftAlign} layoutConfig={layoutConfig} />
                  <PdfRegion region={layoutConfig.header.center} metadata={metadata} align="center" layoutConfig={layoutConfig} />
                  <PdfRegion region={rightRegion} metadata={metadata} align={rightAlign} layoutConfig={layoutConfig} />
                </View>
              );
            }}
          />
        )}

        <View>
          {ast.children?.map((child, index) => {
            return renderBlockNode(child, index, styles, !!layoutConfig?.headingPageBreak);
          })}
        </View>

        {/* Scoped Running Footer */}
        {layoutConfig?.footer && (
          <View
            fixed
            style={footerStyle}
            render={({ pageNumber }) => {
              const startPage = layoutConfig.autoCoverPage ? 2 : 1;
              if (layoutConfig.excludeHeaderFooterFirstPage && pageNumber === startPage) {
                return null;
              }
              const isEven = pageNumber % 2 === 0;
              const mirror = !!layoutConfig.mirrorHeaderFooterOddEven;
              const leftRegion = isEven && mirror ? layoutConfig.footer.right : layoutConfig.footer.left;
              const rightRegion = isEven && mirror ? layoutConfig.footer.left : layoutConfig.footer.right;
              const leftAlign = isEven && mirror ? "right" : "left";
              const rightAlign = isEven && mirror ? "left" : "right";

              return (
                <View style={{ flexDirection: "row", justifyContent: "space-between", width: "100%" }}>
                  <PdfRegion region={leftRegion} metadata={metadata} align={leftAlign} layoutConfig={layoutConfig} />
                  <PdfRegion region={layoutConfig.footer.center} metadata={metadata} align="center" layoutConfig={layoutConfig} />
                  <PdfRegion region={rightRegion} metadata={metadata} align={rightAlign} layoutConfig={layoutConfig} />
                </View>
              );
            }}
          />
        )}
      </Page>
    </Document>
  );
}

async function processAstNode(node: AstNode, emojifyFn: (s: string) => string) {
  // 1. Resolve local-image: URLs from IndexedDB (must run before webp check,
  //    since the resolved blob may itself be webp)
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

  // 2. Convert webp -> png (runs on the now-resolved url, local or remote)
  if (node.type === "image" && node.url && isWebpUrl(node.url)) {
    try {
      node.url = await webpToPng(node.url);
    } catch (error) {
      console.error(
        "Failed to convert webp image to png for PDF:",
        node.url,
        error
      );
    }
  }

  // 3. Render mermaid code blocks to PNG images
  if (node.type === "code" && node.lang === "mermaid" && node.value) {
    try {
      const frontmatterResult = extractFrontmatterCaption(node.value);
      const cleanValue = frontmatterResult.remainingSource;

      const metaCaption = extractCaptionFromMeta(node.meta);
      const caption = metaCaption ?? frontmatterResult.caption ?? "";

      const cacheKey = hashString(cleanValue);
      let png = mermaidPngCache.get(cacheKey);

      if (!png) {
        const { mermaidToPng } = await import("@/lib/mermaid");
        png = await mermaidToPng(cleanValue);
        mermaidPngCache.set(cacheKey, png);
      }

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

  // 4. Emojify any remaining string value (skips mermaid nodes, since their
  //    value was just deleted above — matches original pass ordering)
  if (typeof node.value === "string") {
    node.value = emojifyFn(node.value);
  }

  if (node.children) {
    await Promise.all(
      node.children.map((child) => processAstNode(child, emojifyFn))
    );
  }
}

const extractDocumentMetadata = (markdownText: string) => {
  const metadata: Record<string, string> = {};
  const frontmatterMatch = markdownText.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (frontmatterMatch) {
    const lines = frontmatterMatch[1].split("\n");
    for (const line of lines) {
      const parts = line.split(":");
      if (parts.length >= 2) {
        const key = parts[0].trim().toLowerCase();
        const value = parts.slice(1).join(":").trim().replace(/^["']|["']$/g, "");
        metadata[key] = value;
      }
    }
  }
  return metadata;
};

export async function generateMarkdownPdfBlob(
  markdown: string,
  activeFont: string = "Inter",
  layoutConfig?: any
): Promise<Blob> {
  const [
    { remark },
    { default: remarkGfm },
    { default: remarkDirective },
    { emojify },
    { default: remarkMath }
  ] = await Promise.all([
    import("remark"),
    import("remark-gfm"),
    import("remark-directive"),
    import("node-emoji"),
    import("remark-math")
  ]);

  const processor = remark()
    .use(remarkGfm)
    // .use(remarkEmoji)
    .use(remarkDirective)
    .use(remarkMath);
  const ast = processor.parse(markdown) as unknown as AstNode;

  await processAstNode(ast, emojify);

  // await TextAlignment(ast);

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

  const metadata = extractDocumentMetadata(markdown);
  // Establish default values for running header/footer replacements
  if (!metadata.title) metadata.title = "Manus Markdown Studio";
  if (!metadata.author) metadata.author = "Sarah Connor";
  if (!metadata.date) {
    metadata.date = new Date().toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  }
  if (!metadata.time) {
    metadata.time = new Date().toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  const { pdf } = await import("@react-pdf/renderer");
  const resolvedPdf = await pdf(
    <MarkdownPdfDocument
      ast={ast}
      activeFont={activeFont}
      layoutConfig={layoutConfig}
      metadata={metadata}
    />
  ).toBlob();
  // console.log(resolvedPdf);
  return resolvedPdf;
}

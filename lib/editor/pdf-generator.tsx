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

interface AstNode {
  type: string;
  value?: string;
  url?: string;
  alt?: string;
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

const styles = StyleSheet.create({
  page: {
    paddingTop: "20mm",
    paddingBottom: "22mm",
    paddingLeft: "18mm",
    paddingRight: "18mm",
    fontFamily: "Inter",
    fontSize: 10,
    lineHeight: 1.55,
    color: "#1F2937"
  },
  h1: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 18,
    color: "#111827",
    lineHeight: 1.4
  },
  h2: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    marginTop: 14,
    color: "#111827",
    // borderBottomWidth: 1,
    // borderBottomColor: "#E5E7EB",
    paddingBottom: 4
  },
  h3: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 6,
    marginTop: 10,
    color: "#111827"
  },
  paragraph: {
    marginBottom: 8
  },
  listItem: {
    flexDirection: "row",
    marginBottom: 4
  },
  listBullet: {
    width: 14,
    color: "#9CA3AF"
  },
  listContent: {
    flex: 1
  },
  bold: {
    fontWeight: "bold"
  },
  italic: {
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
    borderLeftWidth: 3,
    borderLeftColor: "#D1D5DB",
    paddingLeft: 10,
    marginBottom: 8,
    color: "#4B5563",
    fontStyle: "italic"
  },
  table: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderStyle: "solid",
    marginBottom: 10
  },

  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB"
  },

  tableCell: {
    flex: 1,
    padding: 6,
    fontSize: 9,
    borderRightWidth: 1,
    borderRightColor: "#E5E7EB"
  },

  tableHeaderCell: {
    fontWeight: "bold",
    backgroundColor: "#F9FAFB",
    color: "#111827"
  },
  callout: {
    padding: 10,
    borderLeftWidth: 4,
    borderRadius: 4,
    marginBottom: 10
  },
  calloutHeader: {
    fontWeight: "bold",
    fontSize: 9,
    marginBottom: 4
  },
  calloutContent: {
    fontSize: 9.5
  },
  footer: {
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

function renderChildren(children?: AstNode[]): React.ReactNode[] {
  if (!children) return [];
  return children.map((child, index) => renderInlineNode(child, index));
}

function renderInlineNode(node: AstNode, index: number): React.ReactNode {
  switch (node.type) {
    case "text":
      return node.value;
    case "strong":
      return (
        <Text key={index} style={styles.bold}>
          {renderChildren(node.children)}
        </Text>
      );
    case "emphasis":
      return (
        <Text key={index} style={styles.italic}>
          {renderChildren(node.children)}
        </Text>
      );
    case "delete":
      return (
        <Text key={index} style={{ textDecoration: "line-through" }}>
          {renderChildren(node.children)}
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
          style={{ color: "#2563EB", textDecoration: "underline" }}
          src={node.url}
        >
          {renderChildren(node.children)}
        </Link>
      );
    case "break":
      return "\n";
    default:
      return null;
  }
}

function renderBlockNode(node: AstNode, index: number): React.ReactNode {
  console.log("Node type:", node.type, node);
  switch (node.type) {
    case "heading": {
      const headingStyle =
        node.depth === 1 ? styles.h1 : node.depth === 2 ? styles.h2 : styles.h3;
      return (
        <Text key={index} style={headingStyle} break={node.break}>
          {renderChildren(node.children)}
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
                return renderBlockNode(child, i);
              }

              return <Text key={i}>{renderInlineNode(child, i)}</Text>;
            })}
          </View>
        );
      }

      return (
        <Text key={index} style={styles.paragraph}>
          {renderChildren(node.children)}
        </Text>
      );
    }
    case "blockquote":
      return (
        <View key={index} style={styles.blockquote} break={node.break}>
          {node.children?.map((child, i) => renderBlockNode(child, i))}
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
                    renderBlockNode(child, idx)
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
                    <Text>{renderChildren(cell.children)}</Text>
                  </View>
                );
              })}
            </View>
          ))}
        </View>
      );
    case "image":
      console.log(node.url);
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
            <Text style={{ fontSize: 8, color: "#6B7280", marginTop: 4 }}>
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
              {contentChildren.map((child, idx) => renderBlockNode(child, idx))}
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
            <Text style={{ fontWeight: "bold", fontSize: 9, color: "#374151" }}>
              {title}
            </Text>
            <View style={{ marginTop: 4 }}>
              {contentChildren.map((child, idx) => renderBlockNode(child, idx))}
            </View>
          </View>
        );
      }
      return (
        <View key={index}>
          {node.children?.map((child, idx) => renderBlockNode(child, idx))}
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
}

export function MarkdownPdfDocument({ ast }: MarkdownPdfDocumentProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View>
          {/* {ast.children?.map((child: AstNode, index: number) =>
            renderBlockNode(child, index)
          )} */}
          {ast.children?.map((child, index) => {
            console.log(index, child.type, child.children?.length);

            return renderBlockNode(child, index);
          })}
        </View>
      </Page>
    </Document>
  );
}

export async function generateMarkdownPdfBlob(markdown: string): Promise<Blob> {
  const processor = remark().use(remarkGfm).use(remarkDirective);
  const ast = processor.parse(markdown) as unknown as AstNode;
  console.log(ast);

  // Resolve local image Blobs asynchronously from IndexedDB before rendering
  await resolveAstLocalImages(ast);

  const { pdf } = await import("@react-pdf/renderer");
  const resolvedPdf = await pdf(<MarkdownPdfDocument ast={ast} />).toBlob();
  console.log(resolvedPdf);
  return resolvedPdf;
}

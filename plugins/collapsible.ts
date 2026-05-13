import type { Html, Paragraph, PhrasingContent, Root } from "mdast";
import { visit } from "unist-util-visit";

function getTextValue(node: PhrasingContent | undefined) {
  if (!node || !("value" in node) || typeof node.value !== "string") {
    return "";
  }

  return node.value.trim();
}

export default function remarkCollapse() {
  return (tree: Root) => {
    visit(tree, "paragraph", (node: Paragraph, index, parent) => {
      if (!parent || index === undefined || node.children.length === 0) {
        return;
      }

      const text = getTextValue(node.children[0]);
      if (!text || !text.startsWith(":::collapse")) {
        return;
      }

      const title = text.replace(":::collapse", "").trim();
      const cursor = index + 1;
      const content = [];
      let foundClosing = false;

      while (cursor < parent.children.length) {
        const nextNode = parent.children[cursor];
        const nextText =
          nextNode.type === "paragraph" ? getTextValue(nextNode.children[0]) : "";

        if (nextText === ":::") {
          foundClosing = true;
          parent.children.splice(cursor, 1);
          break;
        }

        content.push(nextNode);
        parent.children.splice(cursor, 1);
      }

      if (!foundClosing) {
        return;
      }

      const openingNode: Html = {
        type: "html",
        value: `<details><summary>${title}</summary>`,
      };
      const closingNode: Html = {
        type: "html",
        value: "</details>",
      };

      parent.children[index] = openingNode;
      parent.children.splice(index + 1, 0, ...content);
      parent.children.splice(index + content.length + 1, 0, closingNode);
    });
  };
}

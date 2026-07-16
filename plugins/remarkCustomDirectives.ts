import type { BlockContent, DefinitionContent, Html, Root } from "mdast";
import type {
  ContainerDirective,
  LeafDirective,
  TextDirective
} from "mdast-util-directive";
import { visit } from "unist-util-visit";

type Directive = ContainerDirective | LeafDirective | TextDirective;
type ContainerChild = BlockContent | DefinitionContent;

const CALLOUT_STYLES: Record<
  string,
  { bg: string; border: string; icon: string; label: string }
> = {
  caution: {
    bg: "bg-orange-50",
    border: "border-orange-400",
    icon: "🔥",
    label: "Caution"
  },
  error: {
    bg: "bg-red-50",
    border: "border-red-400",
    icon: "❌",
    label: "Error"
  },
  important: {
    bg: "bg-purple-50",
    border: "border-purple-400",
    icon: "📌",
    label: "Important"
  },
  info: {
    bg: "bg-blue-50",
    border: "border-blue-400",
    icon: "ℹ️",
    label: "Info"
  },
  note: {
    bg: "bg-gray-50",
    border: "border-gray-400",
    icon: "📝",
    label: "Note"
  },
  success: {
    bg: "bg-green-50",
    border: "border-green-400",
    icon: "✅",
    label: "Success"
  },
  tip: {
    bg: "bg-teal-50",
    border: "border-teal-400",
    icon: "💡",
    label: "Tip"
  },
  warning: {
    bg: "bg-yellow-50",
    border: "border-yellow-400",
    icon: "⚠️",
    label: "Warning"
  }
};

function isDirective(node: unknown): node is Directive {
  return (
    typeof node === "object" &&
    node !== null &&
    "type" in node &&
    (node.type === "containerDirective" ||
      node.type === "leafDirective" ||
      node.type === "textDirective")
  );
}

function isContainerDirective(node: Directive): node is ContainerDirective {
  return node.type === "containerDirective";
}

function hasDirectiveLabel(child: ContainerChild) {
  return Boolean(
    "data" in child &&
    child.data &&
    "directiveLabel" in child.data &&
    child.data.directiveLabel === true
  );
}

function getLabelValue(child: ContainerChild | undefined, fallback: string) {
  if (
    !child ||
    !("children" in child) ||
    !Array.isArray(child.children) ||
    child.children.length === 0
  ) {
    return fallback;
  }

  const firstChild = child.children[0];
  if (
    !firstChild ||
    !("value" in firstChild) ||
    typeof firstChild.value !== "string"
  ) {
    return fallback;
  }

  return firstChild.value || fallback;
}

function createHtmlNode(value: string): Html {
  return {
    type: "html",
    value
  };
}

export default function remarkCustomDirectives() {
  return (tree: Root) => {
    visit(tree, (node) => {
      if (!isDirective(node)) {
        return;
      }

      if (node.name === "center") {
        node.data = {
          hName: "div",
          hProperties: {
            className: ["text-center"]
          }
        };
      }

      if (node.name === "right") {
        node.data = {
          hName: "div",
          hProperties: {
            className: ["text-right"]
          }
        };
      }

      if (node.name === "justify") {
        node.data = {
          hName: "div",
          hProperties: {
            className: ["text-justify"]
          }
        };
      }

      if (node.name === "callout" && isContainerDirective(node)) {
        const labelNode = node.children.find(hasDirectiveLabel);
        const calloutType = getLabelValue(labelNode, "info").toLowerCase();
        const style = CALLOUT_STYLES[calloutType] ?? CALLOUT_STYLES.note;
        const contentChildren = node.children.filter(
          (child) => !hasDirectiveLabel(child)
        );

        node.data = {
          hName: "div",
          hProperties: {
            className: `my-4 overflow-hidden border-l-4 ${style.border} ${style.bg} text-black`
          }
        };

        node.children = [
          createHtmlNode(
            `<div class="flex items-center gap-2 border-b px-4 py-2 text-sm font-semibold ${style.border}"><span>${style.icon}</span><span>${style.label}</span></div><div class="pl-2 text-sm">`
          ),
          ...contentChildren,
          createHtmlNode("</div>")
        ];
      }

      if (node.name === "collapse" && isContainerDirective(node)) {
        const labelNode = node.children.find(hasDirectiveLabel);
        const title = getLabelValue(labelNode, "Details");
        const contentChildren = node.children.filter(
          (child) => !hasDirectiveLabel(child)
        );

        node.data = {
          hName: "details",
          hProperties: {
            className: "my-4 rounded-lg border bg-muted/30 p-3"
          }
        };

        node.children = [
          createHtmlNode(
            `<summary class="cursor-pointer select-none font-medium">${title}</summary>`
          ),
          ...contentChildren
        ];
      }

      if (node.name === "pagebreak") {
        node.data = {
          hName: "div",
          hProperties: {
            className: "page-break"
          }
        };
        node.children = [];
      }

      if (node.name === "linebreak") {
        node.data = {
          hName: "br"
        };
        node.children = [];
      }
    });
  };
}

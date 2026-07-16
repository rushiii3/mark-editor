import type { EditorView } from "@uiw/react-codemirror";
// import { undo, redo } from "@codemirror/commands";
// import type { ChangeSpec } from "@codemirror/state";

export interface OffsetRange {
  from: number;
  to: number;
}

export function applyUndo(view: EditorView) {
  // undo(view);
}

export function applyRedo(view: EditorView) {
  // redo(view);
}

export function applyWrap(
  view: EditorView,
  prefix: string,
  suffix: string = prefix
) {
  const { state } = view;
  const selection = state.selection.main;

  const selectedText = state.sliceDoc(selection.from, selection.to);
  const insertText = `${prefix}${selectedText}${suffix}`;

  view.dispatch({
    changes: {
      from: selection.from,
      to: selection.to,
      insert: insertText
    },
    selection: selectedText
      ? {
          anchor: selection.from + prefix.length,
          head: selection.from + prefix.length + selectedText.length
        }
      : {
          anchor: selection.from + prefix.length
        },
    scrollIntoView: true
  });

  view.focus();
}

export function applyLinePrefix(view: EditorView, prefix: string) {
  const { state } = view;
  const selection = state.selection.main;

  const startLine = state.doc.lineAt(selection.from);
  const endLine = state.doc.lineAt(selection.to);

  // const changes: ChangeSpec[] = [];

  const changes = [];
  for (
    let lineNumber = startLine.number;
    lineNumber <= endLine.number;
    lineNumber += 1
  ) {
    const line = state.doc.line(lineNumber);
    changes.push({ from: line.from, insert: prefix });
  }

  const totalLines = endLine.number - startLine.number + 1;
  const newEndOffset = endLine.to + prefix.length * totalLines;

  view.dispatch({
    changes,
    selection: {
      anchor: startLine.from,
      head: newEndOffset
    },
    scrollIntoView: true
  });

  view.focus();
}

export function applyBold(view: EditorView) {
  applyWrap(view, "**");
}

export function applyItalic(view: EditorView) {
  applyWrap(view, "*");
}

export function applyStrikethrough(view: EditorView) {
  applyWrap(view, "~~");
}

export function applyInlineCode(view: EditorView) {
  applyWrap(view, "`");
}

export function applyList(view: EditorView) {
  applyLinePrefix(view, "- ");
}

export function applyOrderedList(view: EditorView) {
  applyLinePrefix(view, "1. ");
}

export function applyTaskList(view: EditorView) {
  applyLinePrefix(view, "- [ ] ");
}

export function applyBlockQuote(view: EditorView) {
  applyLinePrefix(view, "> ");
}

export function applyHeading(view: EditorView, level: number) {
  applyLinePrefix(view, `${"#".repeat(level)} `);
}

export function insertSnippet(
  view: EditorView,
  text: string,
  cursorOffset = text.length
) {
  const selection = view.state.selection.main;

  view.dispatch({
    changes: {
      from: selection.from,
      to: selection.to,
      insert: text
    },
    selection: {
      anchor: selection.from + cursorOffset
    },
    scrollIntoView: true
  });

  view.focus();
}

export function replaceSnippet(
  view: EditorView,
  range: OffsetRange,
  text: string,
  cursorOffset = text.length
) {
  view.dispatch({
    changes: {
      from: range.from,
      to: range.to,
      insert: text
    },
    selection: {
      anchor: range.from + cursorOffset
    },
    scrollIntoView: true
  });

  view.focus();
}

export function insertHorizontalLine(view: EditorView) {
  insertSnippet(view, "\n---\n", 5);
}

export function insertLink(view: EditorView, markdown: string) {
  insertSnippet(view, markdown, 1);
}

export function insertImage(view: EditorView, markdown: string) {
  insertSnippet(view, markdown, 2);
}

export function insertTable(view: EditorView, table: string) {
  insertSnippet(view, table, 13);
}

export function applyToggle(view: EditorView) {
  insertSnippet(view, ":::collapse[Title]\n\nYour content\n\n:::");
}

export function applyCodeBlock(view: EditorView) {
  const selection = view.state.selection.main;
  const selectedText = view.state.sliceDoc(selection.from, selection.to);
  const text = `\n\`\`\`\n${selectedText}\n\`\`\`\n`;

  insertSnippet(view, text, 5);
}

export function applyCallout(view: EditorView, type: string) {
  const text = `\n:::callout[${type}]\n\nYour content\n\n:::\n`;
  insertSnippet(view, text, 6);
}

export function applyLineBreak(view: EditorView) {
  insertSnippet(view, "::linebreak", 1);
}

import type { editor, IRange } from "monaco-editor";

export function applyUndo(editorInstance: editor.IStandaloneCodeEditor) {
  editorInstance.trigger("keyboard", "undo", null);
}

export function applyRedo(editorInstance: editor.IStandaloneCodeEditor) {
  editorInstance.trigger("keyboard", "redo", null);
}

export function applyWrap(
  editorInstance: editor.IStandaloneCodeEditor,
  prefix: string,
  suffix: string = prefix
) {
  const selection = editorInstance.getSelection();
  const model = editorInstance.getModel();

  if (!model || !selection) {
    return;
  }

  const selectedText = model.getValueInRange(selection);
  const insertText = `${prefix}${selectedText}${suffix}`;

  const startOffset = model.getOffsetAt({
    lineNumber: selection.startLineNumber,
    column: selection.startColumn
  });

  editorInstance.pushUndoStop();
  editorInstance.executeEdits("markdown-toolbar", [
    {
      range: selection,
      text: insertText,
      forceMoveMarkers: true
    }
  ]);
  editorInstance.pushUndoStop();

  if (selectedText) {
    const selectionStart = model.getPositionAt(startOffset + prefix.length);
    const selectionEnd = model.getPositionAt(
      startOffset + prefix.length + selectedText.length
    );

    editorInstance.setSelection({
      startLineNumber: selectionStart.lineNumber,
      startColumn: selectionStart.column,
      endLineNumber: selectionEnd.lineNumber,
      endColumn: selectionEnd.column
    });
  } else {
    editorInstance.setPosition(
      model.getPositionAt(startOffset + prefix.length)
    );
  }

  editorInstance.focus();
}

export function applyLinePrefix(
  editorInstance: editor.IStandaloneCodeEditor,
  prefix: string
) {
  const model = editorInstance.getModel();
  const selection = editorInstance.getSelection();

  if (!model || !selection) {
    return;
  }

  const startLine = selection.startLineNumber;
  const endLine = selection.endLineNumber;
  const edits: editor.IIdentifiedSingleEditOperation[] = [];

  for (let line = startLine; line <= endLine; line += 1) {
    edits.push({
      range: {
        startLineNumber: line,
        startColumn: 1,
        endLineNumber: line,
        endColumn: 1
      },
      text: prefix,
      forceMoveMarkers: true
    });
  }

  editorInstance.pushUndoStop();
  editorInstance.executeEdits("markdown-toolbar", edits);
  editorInstance.pushUndoStop();

  const endLineLength = model.getLineMaxColumn(endLine);
  editorInstance.setSelection({
    startLineNumber: startLine,
    startColumn: 1,
    endLineNumber: endLine,
    endColumn: endLineLength
  });
  editorInstance.focus();
}

export function applyBold(editorInstance: editor.IStandaloneCodeEditor) {
  applyWrap(editorInstance, "**");
}

export function applyItalic(editorInstance: editor.IStandaloneCodeEditor) {
  applyWrap(editorInstance, "*");
}

export function applyStrikethrough(
  editorInstance: editor.IStandaloneCodeEditor
) {
  applyWrap(editorInstance, "~~");
}

export function applyInlineCode(editorInstance: editor.IStandaloneCodeEditor) {
  applyWrap(editorInstance, "`");
}

export function applyList(editorInstance: editor.IStandaloneCodeEditor) {
  applyLinePrefix(editorInstance, "- ");
}

export function applyOrderedList(editorInstance: editor.IStandaloneCodeEditor) {
  applyLinePrefix(editorInstance, "1. ");
}
export function applyTaskList(editorInstance: editor.IStandaloneCodeEditor) {
  applyLinePrefix(editorInstance, "- [ ] ");
}

export function applyBlockQuote(editorInstance: editor.IStandaloneCodeEditor) {
  applyLinePrefix(editorInstance, "> ");
}

export function applyHeading(
  editorInstance: editor.IStandaloneCodeEditor,
  level: number
) {
  applyLinePrefix(editorInstance, `${"#".repeat(level)} `);
}

export function insertSnippet(
  editorInstance: editor.IStandaloneCodeEditor,
  text: string,
  cursorOffset = text.length
) {
  const selection = editorInstance.getSelection();
  const model = editorInstance.getModel();

  if (!model || !selection) {
    return;
  }

  editorInstance.pushUndoStop();
  editorInstance.executeEdits("markdown-toolbar", [
    {
      range: selection,
      text: text,
      forceMoveMarkers: true
    }
  ]);
  editorInstance.pushUndoStop();

  const startOffset = model.getOffsetAt({
    lineNumber: selection.startLineNumber,
    column: selection.startColumn
  });

  const position = model.getPositionAt(startOffset + cursorOffset);
  editorInstance.setPosition(position);
  editorInstance.focus();
}

export function replaceSnippet(
  editorInstance: editor.IStandaloneCodeEditor,
  range: IRange,
  text: string,
  cursorOffset = text.length
) {
  const model = editorInstance.getModel();

  if (!model) {
    return;
  }

  const startOffset = model.getOffsetAt({
    lineNumber: range.startLineNumber,
    column: range.startColumn
  });

  editorInstance.pushUndoStop();
  editorInstance.executeEdits("markdown-toolbar", [
    {
      range,
      text,
      forceMoveMarkers: true
    }
  ]);
  editorInstance.pushUndoStop();

  const position = model.getPositionAt(startOffset + cursorOffset);
  editorInstance.setPosition(position);
  editorInstance.focus();
}

export function insertHorizontalLine(
  editorInstance: editor.IStandaloneCodeEditor
) {
  insertSnippet(editorInstance, "\n---\n", 5);
}

export function insertLink(
  editorInstance: editor.IStandaloneCodeEditor,
  markdown: string
) {
  insertSnippet(editorInstance, markdown, 1);
}

export function insertImage(
  editorInstance: editor.IStandaloneCodeEditor,
  markdown: string
) {
  insertSnippet(editorInstance, markdown, 2);
}

export function insertTable(
  editorInstance: editor.IStandaloneCodeEditor,
  table: string
) {
  insertSnippet(editorInstance, table, 13);
}

export function applyToggle(editorInstance: editor.IStandaloneCodeEditor) {
  insertSnippet(editorInstance, ":::collapse[Title]\n\nYour content\n\n:::");
}

export function applyCodeBlock(editorInstance: editor.IStandaloneCodeEditor) {
  const selection = editorInstance.getSelection();
  const model = editorInstance.getModel();

  if (!model || !selection) {
    return;
  }

  const selectedText = model.getValueInRange(selection);
  const text = `\n\`\`\`\n${selectedText}\n\`\`\`\n`;

  insertSnippet(editorInstance, text, 5);
}

export function applyCallout(
  editorInstance: editor.IStandaloneCodeEditor,
  type: string
) {
  const text = `\n:::callout[${type}]\n\nYour content\n\n:::\n`;
  insertSnippet(editorInstance, text, 6);
}

export function applyLineBreak(editorInstance: editor.IStandaloneCodeEditor) {
  insertSnippet(editorInstance, "<br>", 1);
}

import { useCallback, useRef, useState } from "react";
// import { EditorView } from "@codemirror/view";
import { ViewUpdate, type EditorView } from "@uiw/react-codemirror";

export function useCodeMirrorHandler() {
  const editorRef = useRef<EditorView | null>(null);

  const [cursorPosition, setCursorPosition] = useState({
    line: 1,
    column: 1
  });

  const [slashMenuState, setSlashMenuState] = useState({
    open: false,
    top: 0,
    left: 0,
    range: null
  });

  const closeSlashMenu = useCallback(() => {
    setSlashMenuState({
      open: false,
      top: 0,
      left: 0,
      range: null
    });
  }, []);

  const handleCreateEditor = useCallback((view: EditorView) => {
    editorRef.current = view;
    // view.se
  }, []);

  const handleUpdate = useCallback(
    (update: ViewUpdate) => {
      if (!update.docChanged && !update.selectionSet) return;

      const view = update.view;

      const pos = view.state.selection.main.head;
      const line = view.state.doc.lineAt(pos);

      setCursorPosition({
        line: line.number,
        column: pos - line.from + 1
      });

      if (update.docChanged) {
        // const inserted = update.transactions.flatMap((t: Transaction) =>
        //   t.changes.iterChanges() ? [] : []
        // );

        const text = view.state.doc.toString();

        if (text[pos - 1] === "/") {
          const coords = view.coordsAtPos(pos);

          if (coords) {
            setSlashMenuState({
              open: true,
              top: coords.bottom + 8,
              left: coords.left,
              // range: pos
              range: null
            });
          }
        } else {
          closeSlashMenu();
        }
      }
    },
    [closeSlashMenu]
  );

  return {
    editorRef,
    cursorPosition,
    slashMenuState,
    closeSlashMenu,
    handleCreateEditor,
    handleUpdate
  };
}

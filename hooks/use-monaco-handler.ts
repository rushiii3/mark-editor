import { useCallback, useRef, useState } from "react";
import type { OnMount } from "@monaco-editor/react";
import type { editor, IRange, Position } from "monaco-editor";
import type { SlashMenuState } from "@/components/editor/types";

export function useMonacoHandler() {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const editorContainerRef = useRef<HTMLElement | null>(null);
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });
  const [slashMenuState, setSlashMenuState] = useState<SlashMenuState>({
    open: false,
    top: 0,
    left: 0,
    range: null
  });

  const closeSlashMenu = useCallback(() => {
    setSlashMenuState((current) =>
      current.open ? { open: false, top: 0, left: 0, range: null } : current
    );
  }, []);

  const getEditorContainer = useCallback(() => {
    if (editorContainerRef.current) {
      return editorContainerRef.current;
    }

    const editorDomNode = editorRef.current?.getDomNode();
    if (editorDomNode) {
      editorContainerRef.current = editorDomNode;
      return editorDomNode;
    }

    return null;
  }, []);

  const openSlashMenu = useCallback(
    (position: Position, range: IRange) => {
      const editorInstance = editorRef.current;
      const container = getEditorContainer();

      if (!editorInstance || !container) {
        return;
      }

      const visiblePosition =
        editorInstance.getScrolledVisiblePosition(position);

      if (!visiblePosition) {
        return;
      }

      setSlashMenuState({
        open: true,
        top: visiblePosition.top + visiblePosition.height + 12,
        left: Math.min(
          visiblePosition.left + 12,
          Math.max(16, container.clientWidth - 220)
        ),
        range
      });
    },
    [getEditorContainer]
  );

  const handleEditorMount: OnMount = useCallback(
    (editorInstance, monaco) => {
      editorRef.current = editorInstance;
      editorContainerRef.current = editorInstance.getDomNode();

      editorInstance.onDidBlurEditorText(() => {
        closeSlashMenu();
      });

      editorInstance.onKeyDown((event) => {
        if (event.keyCode === monaco.KeyCode.Escape) {
          closeSlashMenu();
        }
      });

      editorInstance.onDidChangeCursorPosition(() => {
        const currentPosition = editorInstance.getPosition();
        if (currentPosition) {
          setCursorPosition({
            line: currentPosition.lineNumber,
            column: currentPosition.column
          });
        }

        setSlashMenuState((current) => {
          if (!current.open) {
            return current;
          }

          const position = editorInstance.getPosition();
          const container = getEditorContainer();

          if (!position || !container) {
            return current;
          }

          const visiblePosition =
            editorInstance.getScrolledVisiblePosition(position);

          if (!visiblePosition) {
            return current;
          }

          return {
            ...current,
            top: visiblePosition.top + visiblePosition.height + 12,
            left: Math.min(
              visiblePosition.left + 12,
              Math.max(16, container.clientWidth - 220)
            )
          };
        });
      });

      editorInstance.onDidChangeModelContent((event) => {
        const change = event.changes.at(-1);

        if (!change) {
          return;
        }

        if (change.text === "/" && change.rangeLength === 0) {
          const position = editorInstance.getPosition();
          if (!position) {
            return;
          }

          const range = new monaco.Range(
            change.range.startLineNumber,
            change.range.startColumn,
            change.range.startLineNumber,
            change.range.startColumn + 1
          );

          openSlashMenu(position, range);
          return;
        }

        closeSlashMenu();
      });
    },
    [closeSlashMenu, getEditorContainer, openSlashMenu]
  );

  return {
    editorRef,
    cursorPosition,
    slashMenuState,
    handleEditorMount,
    closeSlashMenu
  };
}

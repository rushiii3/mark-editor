// import { loader } from "@monaco-editor/react";
// import * as monaco from "monaco-editor";

// loader.config({ monaco });

// import { loader } from "@monaco-editor/react";
// import * as monaco from "monaco-editor";

// import editorWorker from "monaco-editor/esm/vs/editor/editor.worker.js";
// import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker.js";
// import cssWorker from "monaco-editor/esm/vs/language/css/css.worker.js";
// import htmlWorker from "monaco-editor/esm/vs/language/html/html.worker.js";
// import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker.js";

// self.MonacoEnvironment = {
//   getWorker(_: unknown, label: string) {
//     switch (label) {
//       case "json":
//         return new jsonWorker();
//       case "css":
//       case "scss":
//       case "less":
//         return new cssWorker();
//       case "html":
//       case "handlebars":
//       case "razor":
//         return new htmlWorker();
//       case "typescript":
//       case "javascript":
//         return new tsWorker();
//       default:
//         return new editorWorker();
//     }
//   }
// };

// loader.config({ monaco });

import { loader } from "@monaco-editor/react";

loader.config({
  paths: {
    vs: "/monaco/vs"
  }
});

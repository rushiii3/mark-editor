import { cpSync, existsSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const src = resolve(__dirname, "./node_modules/monaco-editor/min/vs");

const dest = resolve(__dirname, "./public/monaco/vs");

if (!existsSync(dirname(dest))) {
  mkdirSync(dirname(dest), { recursive: true });
}

cpSync(src, dest, {
  recursive: true,
  force: true
});

console.log("✓ Monaco copied to public/monaco/vs");

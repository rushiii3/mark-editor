# Manus

[![MIT License](https://img.shields.io/badge/license-MIT-amber.svg)](https://github.com/rushiii3/mark-editor/blob/main/LICENSE)
[![Open Source](https://img.shields.io/badge/open--source-yes-emerald.svg)](https://github.com/rushiii3/mark-editor)
[![Works Offline](https://img.shields.io/badge/offline-ready-blue.svg)](https://github.com/rushiii3/mark-editor)
[![Privacy First](https://img.shields.io/badge/privacy-secure-purple.svg)](https://github.com/rushiii3/mark-editor)

**Manus** is a free, open-source, local-first markdown studio designed for developers. It features a cross-platform native desktop app (via Tauri v2) and a sandboxed browser environment with CodeMirror markdown editing, custom font upload/management, slash command overlays, live preview, local image compression/galleries, A4 page guides, and native client-side PDF vector compilation.

Write clean technical documents, format math equations, upload local assets, and export high-fidelity PDF guides completely offline.

---

## Key Features

- **GFM Markdown Engine**: Compile GitHub-flavored markdown with full support for KaTeX math symbols, emojis, and custom containers like `:::callout[tip]` and `:::collapse[details]`.
- **A4 PDF Page Guides**: Work with physical document constraints. Preview page boundaries and inject `::pagebreak` or HTML page-breaks to separate layout pages cleanly.
- **Native PDF Vector Exports**: Generates lightweight, searchable, and selectable vector PDFs client-side using `@react-pdf/renderer` (replacing low-resolution canvas screenshots).
- **IndexedDB Client Sandbox**: No servers, no tracking, and no telemetry. All markdown text files and media are stored locally in your browser's IndexedDB database sandbox.
- **Local Image Gallery**: Upload and compress local images directly. They are saved as binary Blobs in IndexedDB and resolved instantly inside the editor using local object URLs.
- **CodeMirror Markdown Editor**: Write with a high-performance editor featuring GitHub-flavored markdown syntax highlighting, line wrapping, history, bracket matching, and customizable slash commands.
- **Custom Font Management**: Upload, select, and delete custom fonts dynamically. Uploaded fonts are stored persistently in IndexedDB and resolved seamlessly in live previews and PDF exports.
- **Cross-Platform Desktop Client**: Powered by Tauri v2, Manus runs natively on macOS, Windows, and Linux with full desktop optimizations.
- **Instant Auto-Save**: A debounced auto-save listener writes workspace documents to storage on every keystroke, preventing data loss.

---

## Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack) & React 19
- **Desktop Shell**: Tauri v2
- **State Management**: Zustand
- **Local Database**: IndexedDB (using `idb` wrapper)
- **Editor**: CodeMirror (`@uiw/react-codemirror` and `codemirror`)
- **PDF Compilation**: `@react-pdf/renderer`
- **Markdown Parsing**: `remark` & `rehype` plugins
- **Components**: Shadcn UI (using `radix-mira` primitives)
- **Icon Library**: Hugeicons
- **Styling**: Tailwind CSS v4

---

## Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org) (v18+) and a package manager (such as `pnpm`, `npm`, or `yarn`) installed on your device.

### Local Development

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/rushiii3/mark-editor.git
   cd mark-editor
   ```

2. **Install Dependencies**:
   ```bash
   pnpm install # or 'npm install' or 'yarn install'
   ```

3. **Run Development Server (Web)**:
   ```bash
   pnpm run dev # or 'npm run dev' or 'yarn dev'
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser (use `http://localhost:3000/editor` to access the editor workspace).

4. **Run Development Server (Desktop)**:
   Ensure you have the Tauri prerequisites installed on your system.
   ```bash
   pnpm run tauri:dev # or 'npm run tauri:dev' or 'yarn tauri:dev'
   ```

5. **Lint and Type Check**:
   ```bash
   pnpm run lint # or 'npm run lint' or 'yarn lint'
   ```

6. **Build Web App for Production**:
   ```bash
   pnpm run build # or 'npm run build' or 'yarn build'
   ```

7. **Build Desktop App for Production**:
   ```bash
   pnpm run tauri:build # or 'npm run tauri:build' or 'yarn tauri:build'
   ```

---

## Deployment

Since **Manus** is a client-first static React application, you can export the static bundles and deploy them to any CDN hosting platform (e.g. Vercel, Netlify, Cloudflare Pages, GitHub Pages) or host it on your own server.

---

## Contributing

We welcome contributions! Please read our [CONTRIBUTING.md](./CONTRIBUTING.md) to learn how to set up the workspace, understand the project architecture, and submit improvements.

---

## License

MIT License &mdash; Copyright (c) 2026. See the [LICENSE](./LICENSE) file for details.

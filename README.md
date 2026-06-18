# Manus

[![MIT License](https://img.shields.io/badge/license-MIT-amber.svg)](https://github.com/rushiii3/mark-editor/blob/main/LICENSE)
[![Open Source](https://img.shields.io/badge/open--source-yes-emerald.svg)](https://github.com/rushiii3/mark-editor)
[![Works Offline](https://img.shields.io/badge/offline-ready-blue.svg)](https://github.com/rushiii3/mark-editor)
[![Privacy First](https://img.shields.io/badge/privacy-secure-purple.svg)](https://github.com/rushiii3/mark-editor)

**Manus** is a free, open-source, local-first markdown studio designed for developers. It features a sandboxed browser environment with Monaco core editing, slash command overlays, live preview, local image compression/galleries, A4 page guides, and native client-side PDF vector compilation.

Write clean technical documents, format math equations, upload local assets, and export high-fidelity PDF guides completely offline.

---

## Key Features

- **GFM Markdown Engine**: Compile GitHub-flavored markdown with full support for KaTeX math symbols, emojis, and custom containers like `:::callout[tip]` and `:::collapse[details]`.
- **A4 PDF Page Guides**: Work with physical document constraints. Preview page boundaries and inject `::pagebreak` or HTML page-breaks to separate layout pages cleanly.
- **Native PDF Vector Exports**: Generates lightweight, searchable, and selectable vector PDFs client-side using `@react-pdf/renderer` (replacing low-resolution canvas screenshots).
- **IndexedDB Client Sandbox**: No servers, no tracking, and no telemetry. All markdown text files and media are stored locally in your browser's IndexedDB database sandbox.
- **Local Image Gallery**: Upload and compress local images directly. They are saved as binary Blobs in IndexedDB and resolved instantly inside the editor using local object URLs.
- **Monaco Core Editor**: Leverage VS Code's editor features—including autocomplete, multi-cursor, bracket matching, line wrapping, and customizable slash commands.
- **Instant Auto-Save**: A debounced auto-save listener writes workspace documents to storage on every keystroke, preventing data loss.

---

## Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack) & React 19
- **State Management**: Zustand
- **Local Database**: IndexedDB (using `idb` wrapper)
- **Editor**: Monaco Editor (`@monaco-editor/react`)
- **PDF Compilation**: `@react-pdf/renderer`
- **Markdown Parsing**: `remark` & `rehype` plugins
- **Components**: Shadcn UI (using `radix-mira` primitives)
- **Styling**: Tailwind CSS v4

---

## Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org) (v18+) and [pnpm](https://pnpm.io) installed on your device.

### Local Development

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/rushiii3/mark-editor.git
   cd mark-editor
   ```

2. **Install Dependencies**:
   ```bash
   pnpm install
   ```

3. **Run Development Server**:
   ```bash
   pnpm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Lint and Type Check**:
   ```bash
   pnpm run lint
   ```

5. **Build for Production**:
   ```bash
   pnpm run build
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

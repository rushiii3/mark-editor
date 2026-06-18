# Contributing to Manus

Thank you for your interest in contributing to **Manus**! We appreciate your help in building a secure, local-first markdown editor and PDF studio.

Before making a contribution, please review this guide to understand our workspace configuration, style rules, and contribution workflow.

---

## Code of Conduct

As a contributor, you agree to foster an open, welcoming, and inclusive community. Respect fellow developers, provide constructive feedback, and keep user data privacy at the core of all decisions.

---

## Development Setup

### 1. Pruning & Installation
Make sure you are using `pnpm` as the package manager. To setup the project:
```bash
# Install dependencies
pnpm install
```

### 2. Running Local Dev Server
```bash
pnpm run dev
```
Open `http://localhost:3000` to preview your changes.

### 3. Verification Before Submitting
Before opening a Pull Request, ensure that all linting and compile steps pass successfully:
```bash
# Check formatting and lint rules
pnpm run lint

# Verify typescript compilation and next build
pnpm run build
```

---

## Architecture Guidelines

To keep the application fast, maintainable, and robust, please adhere to these core rules:

### 1. Separation of Concerns
- **Presentation (UI)**: Keep UI components small, focused, and free of database operations. Use existing components from the **Shadcn UI** library rather than custom markup.
- **State Management**: Manage workspace documents, settings, and active folders using **Zustand** stores (`store/`).
- **Persistence**: Abstract all IndexedDB queries inside services or hooks (`db/`). Components should never invoke IndexedDB methods directly.
- **Side Effects**: Debounce database writes (e.g. auto-save) and keep asynchronous tasks isolated from rendering logic.

### 2. React Performance
- Prevent unnecessary re-renders. Use `React.memo` for static or heavy components.
- Use `useCallback` and `useMemo` strategically to stable references.
- Subscribe only to relevant slices of state in Zustand (avoid selecting the entire store context) to prevent broad re-renders.

### 3. Strict Type Safety
- **No `any`**: Avoid the `any` keyword in TypeScript. Use strict typing, union types, or `unknown` with type guards.
- **Casting ASTs**: When dealing with markdown parser AST nodes, cast variables safely to explicit types (e.g., using a type-safe `AstNode` interface).

### 4. Client-Only Context
- Since Manus is local-first, verify that browser-only APIs (`window`, `localStorage`, `IndexedDB`) are protected from server-side rendering errors:
  - Add `"use client"` where state hooks are used.
  - Wrap client integrations or external components with dynamic imports if they require window context on page paint.

---

## Pull Request Guidelines

1. **Create a Topic Branch**: Fork the repo and create your branch from `main` (e.g. `feature/slash-commands` or `fix/pdf-pagebreaks`).
2. **Commit Message Format**: Write clear, descriptive commits. Prefix your messages with standard prefixes (e.g., `feat:`, `fix:`, `docs:`, `style:`, `refactor:`).
3. **Open a PR**:
   - Provide a summary describing the changes, what problem was solved, and how you verified the changes.
   - Include any console errors resolved or visual previews if updating UI components.
   - Ensure the branch compiles cleanly on your local environment.

We look forward to your contributions!

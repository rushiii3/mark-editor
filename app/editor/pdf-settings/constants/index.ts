import { LayoutConfig } from "../types";

export const TEMPLATES: Record<string, LayoutConfig> = {
  minimal: {
    header: {
      left: { text: "{{title}}", fontFamily: "Inter", fontSize: "9pt", bold: false, italic: false, underline: false, color: "#64748b", align: "left", image: null },
      center: { text: "", fontFamily: "Inter", fontSize: "9pt", bold: false, italic: false, underline: false, color: "#64748b", align: "center", image: null },
      right: { text: "{{date}}", fontFamily: "Inter", fontSize: "9pt", bold: false, italic: false, underline: false, color: "#64748b", align: "right", image: null }
    },
    footer: {
      left: { text: "", fontFamily: "Inter", fontSize: "9pt", bold: false, italic: false, underline: false, color: "#64748b", align: "left", image: null },
      center: { text: "Page {{page}}", fontFamily: "Inter", fontSize: "9pt", bold: false, italic: false, underline: false, color: "#64748b", align: "center", image: null },
      right: { text: "", fontFamily: "Inter", fontSize: "9pt", bold: false, italic: false, underline: false, color: "#64748b", align: "right", image: null }
    },
    advancedCss: `/* Scoped Minimal Layout Styles */
.header {
  border-bottom: 1px solid var(--border);
  padding-bottom: 6px;
  margin-bottom: 20px;
}

.footer {
  border-top: 1px solid var(--border);
  padding-top: 6px;
  margin-top: 20px;
}`
  },
  academic: {
    header: {
      left: { text: "", fontFamily: "Times New Roman", fontSize: "10pt", bold: false, italic: false, underline: false, color: "#1e293b", align: "left", image: null },
      center: { text: "{{title}}", fontFamily: "Times New Roman", fontSize: "10pt", bold: true, italic: true, underline: false, color: "#1e293b", align: "center", image: null },
      right: { text: "", fontFamily: "Times New Roman", fontSize: "10pt", bold: false, italic: false, underline: false, color: "#1e293b", align: "right", image: null }
    },
    footer: {
      left: { text: "Author: {{author}}", fontFamily: "Times New Roman", fontSize: "10pt", bold: false, italic: false, underline: false, color: "#475569", align: "left", image: null },
      center: { text: "", fontFamily: "Times New Roman", fontSize: "10pt", bold: false, italic: false, underline: false, color: "#475569", align: "center", image: null },
      right: { text: "Page {{page}} of {{pages}}", fontFamily: "Times New Roman", fontSize: "10pt", bold: false, italic: false, underline: false, color: "#475569", align: "right", image: null }
    },
    advancedCss: `/* Scoped Academic Layout Styles */
.header {
  border-bottom: 1px double #94a3b8;
  padding-bottom: 4px;
  margin-bottom: 25px;
}

.footer {
  border-top: 1px solid #cbd5e1;
  padding-top: 6px;
  margin-top: 25px;
}`
  },
  corporate: {
    header: {
      left: { text: "", fontFamily: "Inter", fontSize: "9pt", bold: false, italic: false, underline: false, color: "#0f172a", align: "left", image: null },
      center: { text: "{{company}}", fontFamily: "Inter", fontSize: "10pt", bold: true, italic: false, underline: false, color: "#0f172a", align: "center", image: null },
      right: { text: "Version {{version}}", fontFamily: "Inter", fontSize: "9pt", bold: false, italic: false, underline: false, color: "#64748b", align: "right", image: null }
    },
    footer: {
      left: { text: "CONFIDENTIAL - BUSINESS USE ONLY", fontFamily: "Inter", fontSize: "8pt", bold: true, italic: false, underline: false, color: "#ef4444", align: "left", image: null },
      center: { text: "", fontFamily: "Inter", fontSize: "9pt", bold: false, italic: false, underline: false, color: "#64748b", align: "center", image: null },
      right: { text: "Page {{page}}", fontFamily: "Inter", fontSize: "9pt", bold: false, italic: false, underline: false, color: "#0f172a", align: "right", image: null }
    },
    advancedCss: `/* Scoped Corporate Layout Styles */
.header {
  border-bottom: 2px solid #0f172a;
  padding-bottom: 8px;
  margin-bottom: 24px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.footer {
  border-top: 1px solid #e2e8f0;
  padding-top: 8px;
  margin-top: 24px;
}`
  },
  book: {
    header: {
      left: { text: "Chapter 1: Introduction", fontFamily: "Georgia", fontSize: "9pt", bold: false, italic: true, underline: false, color: "#334155", align: "left", image: null },
      center: { text: "", fontFamily: "Georgia", fontSize: "9pt", bold: false, italic: false, underline: false, color: "#334155", align: "center", image: null },
      right: { text: "{{title}}", fontFamily: "Georgia", fontSize: "9pt", bold: false, italic: false, underline: false, color: "#334155", align: "right", image: null }
    },
    footer: {
      left: { text: "", fontFamily: "Georgia", fontSize: "10pt", bold: false, italic: false, underline: false, color: "#000", align: "left", image: null },
      center: { text: "{{page}}", fontFamily: "Georgia", fontSize: "10pt", bold: false, italic: false, underline: false, color: "#000", align: "center", image: null },
      right: { text: "", fontFamily: "Georgia", fontSize: "10pt", bold: false, italic: false, underline: false, color: "#000", align: "right", image: null }
    },
    advancedCss: `/* Scoped Book Design Styles */
.header {
  border-bottom: 0.5px solid #94a3b8;
  padding-bottom: 6px;
  margin-bottom: 30px;
}

.footer {
  padding-top: 12px;
  margin-top: 30px;
}`
  },
  report: {
    header: {
      left: { text: "{{file_name}}", fontFamily: "Inter", fontSize: "9.5pt", bold: false, italic: false, underline: false, color: "#475569", align: "left", image: null },
      center: { text: "", fontFamily: "Inter", fontSize: "9.5pt", bold: false, italic: false, underline: false, color: "#475569", align: "center", image: null },
      right: { text: "{{date}}", fontFamily: "Inter", fontSize: "9.5pt", bold: false, italic: false, underline: false, color: "#475569", align: "right", image: null }
    },
    footer: {
      left: { text: "{{company}}", fontFamily: "Inter", fontSize: "9.5pt", bold: false, italic: false, underline: false, color: "#475569", align: "left", image: null },
      center: { text: "", fontFamily: "Inter", fontSize: "9.5pt", bold: false, italic: false, underline: false, color: "#475569", align: "center", image: null },
      right: { text: "Page {{page}}", fontFamily: "Inter", fontSize: "9.5pt", bold: false, italic: false, underline: false, color: "#475569", align: "right", image: null }
    },
    advancedCss: `/* Scoped Report Layout Styles */
.header {
  border-bottom: 1px solid #cbd5e1;
  padding-bottom: 8px;
  margin-bottom: 22px;
}

.footer {
  border-top: 1px solid #cbd5e1;
  padding-top: 8px;
  margin-top: 22px;
}`
  },
  resume: {
    header: {
      left: { text: "{{author}}", fontFamily: "Inter", fontSize: "14pt", bold: true, italic: false, underline: false, color: "#1d4ed8", align: "left", image: null },
      center: { text: "", fontFamily: "Inter", fontSize: "9pt", bold: false, italic: false, underline: false, color: "#64748b", align: "center", image: null },
      right: { text: "Curriculum Vitae", fontFamily: "Inter", fontSize: "10pt", bold: false, italic: true, underline: false, color: "#475569", align: "right", image: null }
    },
    footer: {
      left: { text: "", fontFamily: "Inter", fontSize: "9pt", bold: false, italic: false, underline: false, color: "#64748b", align: "left", image: null },
      center: { text: "Page {{page}} of {{pages}}", fontFamily: "Inter", fontSize: "9pt", bold: false, italic: false, underline: false, color: "#64748b", align: "center", image: null },
      right: { text: "", fontFamily: "Inter", fontSize: "9pt", bold: false, italic: false, underline: false, color: "#64748b", align: "right", image: null }
    },
    advancedCss: `/* Scoped Resume Layout Styles */
.header {
  border-bottom: 2px solid #2563eb;
  padding-bottom: 10px;
  margin-bottom: 20px;
}

.footer {
  border-top: 1px solid #e2e8f0;
  padding-top: 6px;
  margin-top: 20px;
}`
  },
  legal: {
    header: {
      left: { text: "", fontFamily: "Courier New", fontSize: "10pt", bold: false, italic: false, underline: false, color: "#000", align: "left", image: null },
      center: { text: "CONTRACT OF SERVICE", fontFamily: "Courier New", fontSize: "10pt", bold: true, italic: false, underline: false, color: "#000", align: "center", image: null },
      right: { text: "", fontFamily: "Courier New", fontSize: "10pt", bold: false, italic: false, underline: false, color: "#000", align: "right", image: null }
    },
    footer: {
      left: { text: "CONFIDENTIAL & PRIVILEGED", fontFamily: "Courier New", fontSize: "9pt", bold: false, italic: false, underline: false, color: "#000", align: "left", image: null },
      center: { text: "", fontFamily: "Courier New", fontSize: "10pt", bold: false, italic: false, underline: false, color: "#000", align: "center", image: null },
      right: { text: "Page {{page}}", fontFamily: "Courier New", fontSize: "10pt", bold: false, italic: false, underline: false, color: "#000", align: "right", image: null }
    },
    advancedCss: `/* Scoped Legal Document Styles */
.header {
  border-top: 1px solid #000;
  border-bottom: 1px solid #000;
  padding: 4px 0;
  margin-bottom: 30px;
  text-transform: uppercase;
}

.footer {
  border-top: 1px solid #000;
  padding-top: 6px;
  margin-top: 30px;
}`
  }
};

export const VARIABLES = [
  { id: "title", label: "Title", token: "{{title}}" },
  { id: "file_name", label: "File Name", token: "{{file_name}}" },
  { id: "author", label: "Author", token: "{{author}}" },
  { id: "company", label: "Company", token: "{{company}}" },
  { id: "date", label: "Current Date", token: "{{date}}" },
  { id: "time", label: "Current Time", token: "{{time}}" },
  { id: "page", label: "Page Number", token: "{{page}}" },
  { id: "pages", label: "Total Pages", token: "{{pages}}" },
  { id: "version", label: "Version", token: "{{version}}" }
];

export const FONTS = [
  "Inter",
  "Outfit",
  "Times New Roman",
  "Georgia",
  "Courier New",
  "Helvetica",
  "Arial",
  "Fira Code"
];

export const FONT_SIZES = [
  "8pt",
  "9pt",
  "9.5pt",
  "10pt",
  "11pt",
  "12pt",
  "14pt",
  "16pt"
];

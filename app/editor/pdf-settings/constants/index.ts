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
}`,
    pageSize: "A4",
    orientation: "portrait",
    margins: { top: 20, bottom: 22, left: 18, right: 18 },
    excludeHeaderFooterFirstPage: false,
    mirrorHeaderFooterOddEven: false,
    bodyFontSize: 12,
    bodyLineHeight: 1.55,
    bodyAlignment: "left",
    paragraphSpacing: 8,
    codeBlockTheme: "light",
    watermarkText: "",
    watermarkOpacity: 0.08,
    autoCoverPage: false,

    // Phase 2 Defaults
    accentColor: "#64748b",
    headerDividerWidth: 0.5,
    headerDividerColor: "#cbd5e1",
    footerDividerWidth: 0,
    footerDividerColor: "#cbd5e1",
    pageNumberFormat: "arabic",
    pageNumberStart: 1,
    headingPageBreak: false,
    subject: "",
    keywords: "",
    creator: "Manus MD Editor",
    userPassword: "",
    ownerPassword: "",
    allowPrinting: "highResolution",
    allowCopying: true,
    allowModifying: true
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
}`,
    pageSize: "A4",
    orientation: "portrait",
    margins: { top: 22, bottom: 25, left: 20, right: 20 },
    excludeHeaderFooterFirstPage: true,
    mirrorHeaderFooterOddEven: false,
    bodyFontSize: 11,
    bodyLineHeight: 1.6,
    bodyAlignment: "justify",
    paragraphSpacing: 10,
    codeBlockTheme: "light",
    watermarkText: "",
    watermarkOpacity: 0.08,
    autoCoverPage: false,

    // Phase 2 Defaults
    accentColor: "#1e3a8a",
    headerDividerWidth: 0.5,
    headerDividerColor: "#94a3b8",
    footerDividerWidth: 0.5,
    footerDividerColor: "#cbd5e1",
    pageNumberFormat: "roman",
    pageNumberStart: 1,
    headingPageBreak: true,
    subject: "Academic Research Paper",
    keywords: "Research, Draft, Science",
    creator: "Manus Academic Compiler",
    userPassword: "",
    ownerPassword: "",
    allowPrinting: "highResolution",
    allowCopying: true,
    allowModifying: true
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
}`,
    pageSize: "LETTER",
    orientation: "portrait",
    margins: { top: 20, bottom: 20, left: 19, right: 19 },
    excludeHeaderFooterFirstPage: false,
    mirrorHeaderFooterOddEven: false,
    bodyFontSize: 11,
    bodyLineHeight: 1.5,
    bodyAlignment: "left",
    paragraphSpacing: 8,
    codeBlockTheme: "dark",
    watermarkText: "",
    watermarkOpacity: 0.08,
    autoCoverPage: false,

    // Phase 2 Defaults
    accentColor: "#0f172a",
    headerDividerWidth: 1.5,
    headerDividerColor: "#0f172a",
    footerDividerWidth: 0.5,
    footerDividerColor: "#e2e8f0",
    pageNumberFormat: "arabic",
    pageNumberStart: 1,
    headingPageBreak: false,
    subject: "Corporate Briefing",
    keywords: "Business, Strategy, Briefing",
    creator: "Manus Corporate Engine",
    userPassword: "",
    ownerPassword: "",
    allowPrinting: "highResolution",
    allowCopying: true,
    allowModifying: true
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
}`,
    pageSize: "A5",
    orientation: "portrait",
    margins: { top: 18, bottom: 20, left: 15, right: 15 },
    excludeHeaderFooterFirstPage: true,
    mirrorHeaderFooterOddEven: true,
    bodyFontSize: 11,
    bodyLineHeight: 1.6,
    bodyAlignment: "justify",
    paragraphSpacing: 6,
    codeBlockTheme: "light",
    watermarkText: "",
    watermarkOpacity: 0.08,
    autoCoverPage: false,

    // Phase 2 Defaults
    accentColor: "#7c2d12",
    headerDividerWidth: 0.5,
    headerDividerColor: "#cbd5e1",
    footerDividerWidth: 0,
    footerDividerColor: "#cbd5e1",
    pageNumberFormat: "arabic",
    pageNumberStart: 1,
    headingPageBreak: true,
    subject: "Novel Manuscript",
    keywords: "Fiction, Chapters, Draft",
    creator: "Manus Publishing Suite",
    userPassword: "",
    ownerPassword: "",
    allowPrinting: "highResolution",
    allowCopying: true,
    allowModifying: true
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
}`,
    pageSize: "A4",
    orientation: "portrait",
    margins: { top: 20, bottom: 20, left: 18, right: 18 },
    excludeHeaderFooterFirstPage: false,
    mirrorHeaderFooterOddEven: false,
    bodyFontSize: 12,
    bodyLineHeight: 1.55,
    bodyAlignment: "left",
    paragraphSpacing: 8,
    codeBlockTheme: "light",
    watermarkText: "",
    watermarkOpacity: 0.08,
    autoCoverPage: true,

    // Phase 2 Defaults
    accentColor: "#2563eb",
    headerDividerWidth: 1,
    headerDividerColor: "#e2e8f0",
    footerDividerWidth: 1,
    footerDividerColor: "#e2e8f0",
    pageNumberFormat: "arabic",
    pageNumberStart: 1,
    headingPageBreak: true,
    subject: "Project Report",
    keywords: "Analysis, Metrics, Report",
    creator: "Manus Report Engine",
    userPassword: "",
    ownerPassword: "",
    allowPrinting: "highResolution",
    allowCopying: true,
    allowModifying: true
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
}`,
    pageSize: "LETTER",
    orientation: "portrait",
    margins: { top: 15, bottom: 15, left: 15, right: 15 },
    excludeHeaderFooterFirstPage: true,
    mirrorHeaderFooterOddEven: false,
    bodyFontSize: 10,
    bodyLineHeight: 1.4,
    bodyAlignment: "left",
    paragraphSpacing: 6,
    codeBlockTheme: "light",
    watermarkText: "",
    watermarkOpacity: 0.08,
    autoCoverPage: false,

    // Phase 2 Defaults
    accentColor: "#1d4ed8",
    headerDividerWidth: 2,
    headerDividerColor: "#2563eb",
    footerDividerWidth: 0,
    footerDividerColor: "#e2e8f0",
    pageNumberFormat: "arabic",
    pageNumberStart: 1,
    headingPageBreak: false,
    subject: "Professional Resume",
    keywords: "CV, Resume, Career",
    creator: "Manus Resume Builder",
    userPassword: "",
    ownerPassword: "",
    allowPrinting: "highResolution",
    allowCopying: true,
    allowModifying: true
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
}`,
    pageSize: "LEGAL",
    orientation: "portrait",
    margins: { top: 25, bottom: 25, left: 25, right: 25 },
    excludeHeaderFooterFirstPage: false,
    mirrorHeaderFooterOddEven: false,
    bodyFontSize: 11,
    bodyLineHeight: 1.8,
    bodyAlignment: "left",
    paragraphSpacing: 10,
    codeBlockTheme: "light",
    watermarkText: "CONFIDENTIAL",
    watermarkOpacity: 0.05,
    autoCoverPage: false,

    // Phase 2 Defaults
    accentColor: "#000000",
    headerDividerWidth: 1,
    headerDividerColor: "#000000",
    footerDividerWidth: 1,
    footerDividerColor: "#000000",
    pageNumberFormat: "arabic",
    pageNumberStart: 1,
    headingPageBreak: false,
    subject: "Legal Agreement",
    keywords: "Legal, NDA, Contract",
    creator: "Manus Legal Compiler",
    userPassword: "",
    ownerPassword: "secureownerpassword123",
    allowPrinting: "highResolution",
    allowCopying: false,
    allowModifying: false
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

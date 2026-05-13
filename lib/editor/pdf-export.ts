export async function exportHtmlAsPdf(
  html: string,
  filename = "document.pdf",
) {
  const html2pdf = (await import("html2pdf.js")).default;
  const exportNode = createPdfExportNode(html);

  try {
    await html2pdf()
      .set({
        filename,
        html2canvas: {
          backgroundColor: "#ffffff",
          scale: 2,
          useCORS: true,
        },
        jsPDF: {
          format: "a4",
          orientation: "portrait",
          unit: "mm",
        },
        margin: 0,
      })
      .from(exportNode)
      .save();
  } finally {
    exportNode.remove();
  }
}

export async function exportPreviewAsPdf(
  previewElement: HTMLDivElement,
  filename = "document.pdf",
) {
  return exportHtmlAsPdf(previewElement.innerHTML, filename);
}

function createPdfExportNode(html: string) {
  const container = document.createElement("div");
  container.setAttribute("aria-hidden", "true");
  container.style.background = "#ffffff";
  container.style.left = "-20000px";
  container.style.position = "fixed";
  container.style.top = "0";
  container.style.width = "210mm";
  container.style.zIndex = "-1";

  const style = document.createElement("style");
  style.textContent = `
    .pdf-export-root {
      width: 210mm;
      background: #ffffff;
      color: #111827;
      font-family: Inter, Arial, sans-serif;
      font-size: 14px;
      line-height: 1.65;
      padding: 18mm 16mm 20mm;
      box-sizing: border-box;
    }
    .pdf-export-root, .pdf-export-root * {
      box-sizing: border-box;
    }
    .pdf-export-root h1, .pdf-export-root h2, .pdf-export-root h3, .pdf-export-root h4, .pdf-export-root h5, .pdf-export-root h6 {
      color: #111827;
      line-height: 1.2;
      margin: 0 0 12px;
      break-after: avoid-page;
    }
    .pdf-export-root h1 { font-size: 30px; margin-top: 0; }
    .pdf-export-root h2 {
      font-size: 24px;
      margin-top: 32px;
      padding-bottom: 8px;
      border-bottom: 1px solid #e5e7eb;
    }
    .pdf-export-root h3 { font-size: 19px; margin-top: 24px; }
    .pdf-export-root h4 { font-size: 16px; margin-top: 20px; }
    .pdf-export-root p,
    .pdf-export-root ul,
    .pdf-export-root ol,
    .pdf-export-root blockquote,
    .pdf-export-root pre,
    .pdf-export-root table {
      margin: 0 0 16px;
    }
    .pdf-export-root ul,
    .pdf-export-root ol {
      padding-left: 20px;
    }
    .pdf-export-root li + li { margin-top: 4px; }
    .pdf-export-root a {
      color: #2563eb;
      text-decoration: underline;
    }
    .pdf-export-root blockquote {
      border-left: 3px solid #d1d5db;
      color: #374151;
      padding-left: 14px;
    }
    .pdf-export-root pre {
      overflow: hidden;
      white-space: pre-wrap;
      word-break: break-word;
      background: #0f172a;
      color: #f8fafc;
      border: 1px solid #0f172a;
      border-radius: 10px;
      padding: 14px 16px;
    }
    .pdf-export-root code {
      font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
      font-size: 0.92em;
    }
    .pdf-export-root :not(pre) > code {
      background: #f3f4f6;
      color: #111827;
      border-radius: 4px;
      padding: 2px 5px;
    }
    .pdf-export-root table {
      width: 100%;
      border-collapse: collapse;
    }
    .pdf-export-root th,
    .pdf-export-root td {
      border: 1px solid #d1d5db;
      padding: 8px 10px;
      text-align: left;
      vertical-align: top;
    }
    .pdf-export-root th {
      background: #f9fafb;
      font-weight: 600;
    }
    .pdf-export-root img,
    .pdf-export-root svg {
      max-width: 100%;
      height: auto;
    }
    .pdf-export-root .page-break {
      display: block;
      height: 1px;
      margin: 0;
      padding: 0;
      border: 0;
      break-before: page;
      page-break-before: always;
    }
  `;

  const content = document.createElement("div");
  content.className = "pdf-export-root";
  content.innerHTML = html;

  container.append(style, content);
  document.body.appendChild(container);

  return container;
}

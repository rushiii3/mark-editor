import mermaid from "mermaid";
import { Canvg } from "canvg";

let initialized = false;

function initMermaid() {
  if (initialized) return;

  mermaid.initialize({
    startOnLoad: false,
    securityLevel: "loose",
    theme: "default",
    fontFamily: "Arial, Helvetica, sans-serif",
    htmlLabels: false, // Critical: Avoid foreignObject generation which taints the canvas

    flowchart: {
      useMaxWidth: false,
      htmlLabels: false
    },

    sequence: {
      useMaxWidth: false
    },

    er: {
      useMaxWidth: false
    }
  });

  initialized = true;
}

export interface MermaidToPngOptions {
  scale?: number;
  backgroundColor?: string;
}

export async function mermaidToPng(
  code: string,
  { scale = 2, backgroundColor = "#ffffff" }: MermaidToPngOptions = {}
): Promise<string> {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return "";
  }

  initMermaid();

  const id = `mermaid-${crypto.randomUUID()}`;

  // Create a temporary hidden container in the DOM so Mermaid can compute text sizes
  const container = document.createElement("div");
  container.id = `container-${id}`;
  container.style.position = "absolute";
  container.style.top = "-9999px";
  container.style.left = "-9999px";
  container.style.visibility = "hidden";
  document.body.appendChild(container);

  let svg = "";
  try {
    const result = await mermaid.render(id, code, container);
    svg = result.svg;
  } catch (err) {
    console.error("Mermaid compilation failed inside render:", err);
    throw err;
  } finally {
    container.remove();
  }

  if (!svg) {
    throw new Error("Failed to render Mermaid SVG");
  }

  // Parse SVG to determine its intrinsic size
  const parser = new DOMParser();
  const doc = parser.parseFromString(svg, "image/svg+xml");
  const svgElement = doc.documentElement;

  // Safe viewBox parsing
  const viewBoxAttr = svgElement.getAttribute("viewBox");
  let width = 800;
  let height = 600;
  if (viewBoxAttr) {
    const parts = viewBoxAttr.split(/\s+/).map(Number);
    if (parts.length === 4 && !parts.some(Number.isNaN)) {
      width = parts[2];
      height = parts[3];
    }
  } else {
    width = parseFloat(svgElement.getAttribute("width") ?? "800") || 800;
    height = parseFloat(svgElement.getAttribute("height") ?? "600") || 600;
  }

  const canvasWidth = Math.ceil(width * scale);
  const canvasHeight = Math.ceil(height * scale);

  // Helper function to render using Canvg (safest fallback since it doesn't taint the canvas)
  const renderWithCanvg = async (): Promise<string> => {
    const canvas = document.createElement("canvas");
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Failed to get 2D canvas context for Canvg");
    }

    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    ctx.scale(scale, scale);

    const canvg = await Canvg.from(ctx, svg, {
      ignoreMouse: true,
      ignoreAnimation: true,
      ignoreDimensions: true,
      ignoreClear: true
    });

    await canvg.render();
    return canvas.toDataURL("image/png");
  };

  // Try the native Image method first. If it throws SecurityError (due to tainted canvas), fall back to Canvg.
  return new Promise((resolve, reject) => {
    const img = new Image();

    // Safely encode the SVG into a blob URL
    const svgBlob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);

    img.onload = async () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          throw new Error("Failed to get 2D canvas context");
        }

        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const dataUrl = canvas.toDataURL("image/png");
        URL.revokeObjectURL(url);
        resolve(dataUrl);
      } catch (err) {
        URL.revokeObjectURL(url);
        // Catch SecurityError (tainted canvas) or other canvas exceptions and fallback to Canvg
        console.warn("Native SVG image canvas render failed, falling back to Canvg:", err);
        try {
          const canvgDataUrl = await renderWithCanvg();
          resolve(canvgDataUrl);
        } catch (canvgErr) {
          reject(canvgErr);
        }
      }
    };

    img.onerror = async (err) => {
      URL.revokeObjectURL(url);
      console.warn("Native SVG image load failed, falling back to Canvg");
      try {
        const canvgDataUrl = await renderWithCanvg();
        resolve(canvgDataUrl);
      } catch (canvgErr) {
        reject(canvgErr);
      }
    };

    img.src = url;
  });
}

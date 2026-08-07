export interface RegionConfig {
  text: string;
  fontFamily: string;
  fontSize: string;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  color: string;
  align: "left" | "center" | "right";
  image: string | null;
}

export interface LayoutConfig {
  header: {
    left: RegionConfig;
    center: RegionConfig;
    right: RegionConfig;
  };
  footer: {
    left: RegionConfig;
    center: RegionConfig;
    right: RegionConfig;
  };
  advancedCss: string;
  activeTemplate?: string;

  // Page Geometry & Layout Settings
  pageSize?: "A4" | "LETTER" | "A5" | "LEGAL" | "EXECUTIVE";
  orientation?: "portrait" | "landscape";
  margins?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };

  // Header & Footer Advanced Controls
  excludeHeaderFooterFirstPage?: boolean;
  mirrorHeaderFooterOddEven?: boolean;

  // Typography & Styling Customizations
  bodyFontSize?: number;
  bodyLineHeight?: number;
  bodyAlignment?: "left" | "justify";
  paragraphSpacing?: number;
  codeBlockTheme?: "light" | "dark";

  // Professional Document Elements
  watermarkText?: string;
  watermarkOpacity?: number;
  autoCoverPage?: boolean;

  // Brand Styling Customizations
  accentColor?: string;
  headerDividerWidth?: number;
  headerDividerColor?: string;
  footerDividerWidth?: number;
  footerDividerColor?: string;

  // Advanced Pagination
  pageNumberFormat?: "arabic" | "roman" | "alphabetical";
  pageNumberStart?: number;

  // Heading Layout
  headingPageBreak?: boolean;

  // PDF Security & Metadata
  subject?: string;
  keywords?: string;
  creator?: string;
  userPassword?: string;
  ownerPassword?: string;
  allowPrinting?: "none" | "lowResolution" | "highResolution";
  allowCopying?: boolean;
  allowModifying?: boolean;
}

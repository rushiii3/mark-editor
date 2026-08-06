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
}

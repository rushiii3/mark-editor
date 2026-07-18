import * as React from "react";

const MOBILE_BREAKPOINT = 768;
const TABLET_BREAKPOINT = 1024;

function getWidth() {
  return typeof window !== "undefined" ? window.innerWidth : 0;
}

function useWindowWidth() {
  const [width, setWidth] = React.useState(getWidth);

  React.useEffect(() => {
    const update = () => setWidth(window.innerWidth);
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return width;
}

export function useIsMobile() {
  const width = useWindowWidth();
  return width < MOBILE_BREAKPOINT;
}

export function useIsTablet() {
  const width = useWindowWidth();
  return width >= MOBILE_BREAKPOINT && width < TABLET_BREAKPOINT;
}

export function useIsDesktop() {
  const width = useWindowWidth();
  return width >= TABLET_BREAKPOINT;
}

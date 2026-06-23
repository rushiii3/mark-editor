import * as React from "react";

const MOBILE_BREAKPOINT = 768;
const TABLET_BREAKPOINT = 1024;

function useWindowWidth() {
  const [width, setWidth] = React.useState(0);

  React.useEffect(() => {
    const update = () => setWidth(window.innerWidth);

    update();

    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return width;
}

export function useIsMobile() {
  return useWindowWidth() < MOBILE_BREAKPOINT;
}

export function useIsTablet() {
  const width = useWindowWidth();
  return width >= MOBILE_BREAKPOINT && width < TABLET_BREAKPOINT;
}

export function useIsDesktop() {
  return useWindowWidth() >= TABLET_BREAKPOINT;
}

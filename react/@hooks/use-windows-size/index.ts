import { useSyncExternalStore } from "react";

function useWindowSize() {
  return useSyncExternalStore(
    // Subscribe function that returns cleanup
    (callback) => {
      window.addEventListener("resize", callback);
      return () => window.removeEventListener("resize", callback);
    },
    // Get current value
    () => ({ width: window.innerWidth, height: window.innerHeight })
  );
}

// USAGE:
// function ResponsiveUI() {
//   const { width } = useWindowSize();
//   return width < 768 ? <MobileLayout /> : <DesktopLayout />;
// }

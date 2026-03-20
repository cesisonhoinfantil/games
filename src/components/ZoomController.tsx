import { useSettingsStore } from "@/store/useSettingsStore";
import { useEffect } from "react";

export function ZoomController() {
  const zoomPrevention = useSettingsStore((state) => state.zoomPrevention);

  useEffect(() => {
    if (!zoomPrevention) {
      document.body.style.touchAction = "auto";
      return;
    }

    // Block zoom through touch-action CSS
    document.body.style.touchAction = "pan-x pan-y"; // allows scrolling but prevents pinch-zoom

    // Prevent pinch-to-zoom on touchscreens
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    // Prevent double-tap to zoom
    let lastTouchEnd = 0;
    const handleTouchEnd = (e: TouchEvent) => {
      const now = new Date().getTime();
      if (now - lastTouchEnd <= 300) {
        e.preventDefault();
      }
      lastTouchEnd = now;
    };

    // Prevent zoom with Ctrl + Mouse Wheel
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();
      }
    };

    // Passive: false is required to be able to call e.preventDefault()
    document.addEventListener("touchstart", handleTouchStart, { passive: false });
    document.addEventListener("touchend", handleTouchEnd, { passive: false });
    document.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      document.body.style.touchAction = "auto";
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchend", handleTouchEnd);
      document.removeEventListener("wheel", handleWheel);
    };
  }, [zoomPrevention]);

  return null;
}

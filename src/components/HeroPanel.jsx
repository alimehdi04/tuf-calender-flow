"use client";

// ✅ Brought useEffect back to handle fast-loading local cache
import { useRef, useState, useEffect } from "react";
import { format } from "date-fns";

// ✅ Updated to correct Next.js public paths (starting with '/')
const monthImages = {
  0:  "/januarybg.jpg",
  1:  "/februarybg.jpg",
  2:  "/marchbg.jpg",
  3:  "/aprilbg.jpg",
  4:  "/maybg.jpg",
  5:  "/junebg.jpg",
  6:  "/julybg.jpg",
  7:  "/augustbg.jpg",
  8:  "/september.jpg",
  9:  "/octoberbg.jpg",
  10: "/novemberbg.jpg",
  11: "/decemberbg.jpg",
};

export default function HeroPanel({ viewingMonth, setThemeColor, themeColor }) {
  const imgRef = useRef(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const monthIndex = viewingMonth.getMonth();
  const currentImageSrc = monthImages[monthIndex];

  const handleImageLoad = async () => {
    setIsImageLoaded(true);
    try {
      const { getColorSync } = await import("colorthief");
      const color = getColorSync(imgRef.current);
      setThemeColor(color.css());
    } catch (error) {
      console.error("Color extraction failed, falling back to default.", error);
      setThemeColor("#0ea5e9"); // Fallback color
    }
  };

  // ✅ Catch cached images when swapping between months
  useEffect(() => {
    setIsImageLoaded(false); // Reset fade

    // If the browser loaded the image instantly from cache, force the extraction
    if (imgRef.current && imgRef.current.complete) {
      handleImageLoad();
    }
  }, [currentImageSrc]);

  return (
    <div className="relative w-full h-full overflow-hidden bg-slate-100">
      <img
        ref={imgRef}
        key={currentImageSrc}
        src={currentImageSrc}
        alt={`Calendar Hero for ${format(viewingMonth, "MMMM")}`}
        // ❌ Removed crossOrigin="anonymous" because all images are local now
        onLoad={handleImageLoad}
        onError={() => console.error(`Failed to load ${currentImageSrc}`)}
        className={`object-cover w-full h-full transition-opacity duration-700 ${
          isImageLoaded ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Angled Overlay */}
      <div
        className="absolute bottom-0 w-full h-24 sm:h-32 flex items-end justify-end p-6 sm:p-8 text-white transition-colors duration-500"
        style={{
          backgroundColor: themeColor,
          clipPath: "polygon(100% 0%, 100% 100%, 0% 100%, 0% 80%)",
        }}
      >
        <div className="text-right z-10 flex flex-col items-end justify-end">
          {/* Added mb-1 (mobile) and sm:mb-2 (desktop) to create breathing room */}
          <div className="text-lg sm:text-xl font-light tracking-widest mb-1 sm:mb-2 text-white/90">
            {format(viewingMonth, "yyyy")}
          </div>
          {/* Ensured the month stays prominent without clipping */}
          <div className="text-3xl sm:text-5xl font-extrabold uppercase tracking-widest shadow-sm leading-none">
            {format(viewingMonth, "MMMM")}
          </div>
        </div>
      </div>
    </div>
  );
}
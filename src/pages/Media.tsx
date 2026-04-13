import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";

// Unsplash abstract/art images (demo)
const UNSPLASH_ABSTRACT = [
  "1618005182384-a83a8bd57fbe",
  "1579546929518-9e396f3cc809",
  "1557683311-eac922eeaaab",
  "1558591514-d8c2d8dc2c9e",
  "1557682250-0bd0d86f3bf1",
  "1614850523296-b2e22af400c9",
  "1557682268-e60e6a2e8b0c",
  "1518531933037-91c3f0a4b8e5",
  "1557683304-5eb7c6d0e8a9",
  "1519681393784-d120267933ba",
  "1579546929662-711f0c2c8e8a",
  "1618005182384-a83a8bd57fbe",
  "1557682250-0bd0d86f3bf1",
  "1579546929518-9e396f3cc809",
  "1557683311-eac922eeaaab",
  "1518531933037-91c3f0a4b8e5",
  "1557682268-e60e6a2e8b0c",
  "1557683304-5eb7c6d0e8a9",
  "1614850523296-b2e22af400c9",
  "1519681393784-d120267933ba",
];

const Media = () => {
  const mainRef = useRef<HTMLDivElement>(null);
  const lightboxOverlayRef = useRef<HTMLDivElement>(null);
  const lightboxImageRef = useRef<HTMLImageElement>(null);
  const directionRef = useRef<"next" | "prev" | null>(null);
  const initialOpenRef = useRef(true);
  const isTransitioningRef = useRef(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const localImages: Record<number, string> = {
    0: "img-1.png",
    1: "img-2.png",
    2: "img-3.png",
    3: "img-4.png",
    4: "img-5.png",
    5: "img-6.png",
    6: "img-7.png",
    7: "img-8.png",
    8: "img-9.png",
    9: "img-10.png",
    10: "img-11.png",
    11: "media-12.png",
    12: "media-13.png",
    13: "media-14.png",
    14: "media-15.png",
    15: "media-16.png",
    16: "media-17.png",
    17: "media-18.png",
    18: "media-19.png",
    19: "media-20.png",
  };
  const items = UNSPLASH_ABSTRACT.map((id, i) => {
    const local = localImages[i];
    return {
      id: i + 1,
      src: local ? `/${local}` : `https://images.unsplash.com/photo-${id}?w=600&q=80`,
      srcLarge: local ? `/${local}` : `https://images.unsplash.com/photo-${id}?w=1200&q=85`,
      alt: local ? `Image ${i + 1}` : `Abstract ${i + 1}`,
    };
  });

  const openLightbox = (index: number) => {
    initialOpenRef.current = true;
    directionRef.current = null;
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = useCallback(() => {
    const overlay = lightboxOverlayRef.current;
    const img = lightboxImageRef.current;
    if (overlay && img) {
      gsap.to(img, { scale: 0.92, opacity: 0, duration: 0.25, ease: "power2.in" });
      gsap.to(overlay, { opacity: 0, duration: 0.25, ease: "power2.in", onComplete: () => setLightboxOpen(false) });
    } else {
      setLightboxOpen(false);
    }
  }, []);

  const slideDuration = 0.35;
  const slideOffset = 72;

  const goPrev = useCallback(() => {
    if (isTransitioningRef.current) return;
    const img = lightboxImageRef.current;
    directionRef.current = "prev";
    if (img) {
      isTransitioningRef.current = true;
      gsap.to(img, {
        x: slideOffset,
        opacity: 0,
        duration: slideDuration,
        ease: "power2.inOut",
        onComplete: () => {
          setLightboxIndex((i) => (i <= 0 ? items.length - 1 : i - 1));
        },
      });
    } else {
      setLightboxIndex((i) => (i <= 0 ? items.length - 1 : i - 1));
    }
  }, [items.length]);

  const goNext = useCallback(() => {
    if (isTransitioningRef.current) return;
    const img = lightboxImageRef.current;
    directionRef.current = "next";
    if (img) {
      isTransitioningRef.current = true;
      gsap.to(img, {
        x: -slideOffset,
        opacity: 0,
        duration: slideDuration,
        ease: "power2.inOut",
        onComplete: () => {
          setLightboxIndex((i) => (i >= items.length - 1 ? 0 : i + 1));
        },
      });
    } else {
      setLightboxIndex((i) => (i >= items.length - 1 ? 0 : i + 1));
    }
  }, [items.length]);

  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    const grid = el.querySelector(".grid");
    if (!grid) return;
    gsap.from(grid, {
      opacity: 0,
      y: 24,
      duration: 0.5,
      ease: "power2.out",
    });
  }, []);

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [lightboxOpen, closeLightbox, goPrev, goNext]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const overlay = lightboxOverlayRef.current;
    const img = lightboxImageRef.current;
    if (!overlay || !img) return;

    const dir = directionRef.current;

    if (initialOpenRef.current) {
      initialOpenRef.current = false;
      gsap.set(overlay, { opacity: 0 });
      gsap.set(img, { scale: 0.88, opacity: 0, x: 0 });
      gsap.to(overlay, { opacity: 1, duration: 0.3, ease: "power2.out" });
      gsap.to(img, { scale: 1, opacity: 1, duration: 0.45, ease: "power2.out", delay: 0.05 });
      return;
    }

    if (dir === "next") {
      gsap.set(img, { x: slideOffset, opacity: 0, scale: 1 });
      gsap.to(img, {
        x: 0,
        opacity: 1,
        duration: slideDuration,
        ease: "power2.out",
        onComplete: () => {
          isTransitioningRef.current = false;
        },
      });
      directionRef.current = null;
    } else if (dir === "prev") {
      gsap.set(img, { x: -slideOffset, opacity: 0, scale: 1 });
      gsap.to(img, {
        x: 0,
        opacity: 1,
        duration: slideDuration,
        ease: "power2.out",
        onComplete: () => {
          isTransitioningRef.current = false;
        },
      });
      directionRef.current = null;
    }
  }, [lightboxOpen, lightboxIndex]);

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />

      <main ref={mainRef} className="pt-[120px] w-full px-8 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-[4px] w-full">
          {items.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => openLightbox(index)}
              className="bg-background aspect-square overflow-hidden rounded-[4px] block w-full text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset"
            >
              <img
                src={item.src}
                alt={item.alt}
                className="w-full h-full object-cover rounded-[4px]"
              />
            </button>
          ))}
        </div>
      </main>

      {/* Lightbox carousel — 100dvh */}
      {lightboxOpen && (
        <div
          ref={lightboxOverlayRef}
          className="fixed inset-0 z-[100] h-[100dvh] flex flex-col bg-black/95"
          role="dialog"
          aria-modal="true"
          aria-label="Image carousel"
        >
          <div className="absolute top-0 right-0 z-10 p-4">
            <button
              type="button"
              onClick={closeLightbox}
              className="w-10 h-10 rounded-[4px] flex items-center justify-center text-white hover:bg-white/10 transition-colors"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center min-h-0 p-4 md:p-12">
            <img
              ref={lightboxImageRef}
              key={lightboxIndex}
              src={items[lightboxIndex].srcLarge}
              alt={items[lightboxIndex].alt}
              className="max-w-full max-h-[calc(100dvh-80px)] w-auto h-auto object-contain rounded-[4px]"
            />
          </div>

          <div className="absolute left-0 bottom-4 md:bottom-auto md:top-1/2 md:-translate-y-1/2 z-10 p-2 md:p-4">
            <button
              type="button"
              onClick={goPrev}
              className="w-10 h-10 md:w-12 md:h-12 rounded-[4px] overflow-hidden flex items-center justify-center text-white hover:bg-white/10 transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" strokeWidth={1} />
            </button>
          </div>
          <div className="absolute right-0 bottom-4 md:bottom-auto md:top-1/2 md:-translate-y-1/2 z-10 p-2 md:p-4">
            <button
              type="button"
              onClick={goNext}
              className="w-10 h-10 md:w-12 md:h-12 rounded-[4px] overflow-hidden flex items-center justify-center text-white hover:bg-white/10 transition-colors"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6 md:w-8 md:h-8" strokeWidth={1} />
            </button>
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-neutral-400 text-sm">
            {lightboxIndex + 1} / {items.length}
          </div>
        </div>
      )}
    </div>
  );
};

export default Media;

import { useEffect, useRef } from "react";
import gsap from "gsap";
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

  const items = UNSPLASH_ABSTRACT.map((id, i) => ({
    id: i + 1,
    src: `https://images.unsplash.com/photo-${id}?w=600&q=80`,
    alt: `Abstract ${i + 1}`,
  }));

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

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />

      <main ref={mainRef} className="pt-[120px] w-full px-8 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 w-full">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-background aspect-square overflow-hidden"
            >
              <img
                src={item.src}
                alt={item.alt}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Media;

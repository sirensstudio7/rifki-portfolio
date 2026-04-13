import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { SiteNav } from "@/components/SiteNav";
import { MusicPlayer, type TrackItem } from "@/components/MusicPlayer";

const MUSIC_ITEMS: TrackItem[] = [
  { artist: "Vills", track: "The Circle" },
  { artist: "Minatami", track: "Tides" },
  { artist: "Divine", track: "Vessels" },
  { artist: "Deadminds", track: "dnb" },
  { artist: "Will I Am", track: "Will I Am" },
  { artist: "Artist", track: "Track" },
  { artist: "Artist", track: "Track" },
  { artist: "Artist", track: "Track" },
];

const Music = () => {
  const mainRef = useRef<HTMLDivElement>(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    const topBlock = el.querySelector("div.max-w-2xl");
    const grid = el.querySelector(".grid");
    const bottomBlock = el.querySelectorAll(".max-w-2xl")[1];
    const targets = [topBlock, grid, bottomBlock].filter(Boolean);
    gsap.from(targets, {
      opacity: 0,
      y: 24,
      duration: 0.5,
      stagger: 0.15,
      ease: "power2.out",
    });
  }, []);

  return (
  <div className="min-h-screen bg-black">
    <SiteNav />

    <main ref={mainRef} className="pt-[120px] max-w-6xl mx-auto px-4 md:px-8 pb-28">
      <div className="max-w-2xl pl-0 pr-4 md:px-6 mr-auto md:mx-auto w-full">
        <div className="text-[16px] md:text-[20px] text-[#8F8F8F] mb-8 text-left">
          <p className="mb-8">
            Music is another part of how I express myself.
          </p>
          <p>
            I explore different genres and sounds, always curious about how emotion and energy translate through music. I like experimenting, blending influences, and letting the process evolve naturally.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-2 gap-y-6 mb-16">
        {MUSIC_ITEMS.map((item, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setCurrentTrackIndex(i)}
            className="text-left hover:opacity-80 transition-opacity"
          >
            <div className="aspect-square bg-white mb-3 rounded-[4px]" />
            <p className="text-white font-mono text-[16px]">{item.artist}</p>
            <p className="text-white font-mono text-[16px] mt-1">{item.track}</p>
          </button>
        ))}
      </div>

      <MusicPlayer
        tracks={MUSIC_ITEMS}
        currentIndex={currentTrackIndex}
        onTrackChange={setCurrentTrackIndex}
      />

      <div className="max-w-2xl pl-0 pr-4 md:px-6 mr-auto md:mx-auto w-full">
        <div className="text-[16px] md:text-[20px] text-[#8F8F8F]">
          <p className="mb-8">
            I play guitar in a metal band called Vills. Heavy riffs, raw energy, and honest expression. It is where intensity meets creativity.
          </p>
          <p>
            For me, music and design are connected. Both are about rhythm, balance, tension, and feeling. Different mediums, same mindset.
          </p>
        </div>
      </div>
    </main>
  </div>
  );
};

export default Music;

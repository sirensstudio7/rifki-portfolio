import { useEffect, useRef, useState } from "react";

const GLITCH_CHARS =
  "☺Σ×Π#-_¯—→↓↑←0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ!@$%&*?/\\";

function randomInt(min: number, max: number) {
  return min + Math.floor(Math.random() * (max - min + 1));
}

function shuffledCharPool() {
  return [...GLITCH_CHARS].sort(() => Math.random() - 0.5);
}

type HoverGlitchTextProps = {
  text: string;
  className?: string;
};

export function HoverGlitchText({ text, className }: HoverGlitchTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const intervalRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);

  const stopGlitch = () => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setDisplayText(text);
  };

  const startGlitch = () => {
    stopGlitch();

    const strippedLen = text.replace(/\s/g, "").length;
    if (strippedLen === 0) return;

    const burstDuration = randomInt(180, 520);
    const stepMs = randomInt(26, 72);
    const maxGlitched = Math.min(strippedLen, randomInt(2, 7));
    const charPool = shuffledCharPool();

    const randomize = () => {
      const chars = text.split("");
      const nonSpaceIndexes = chars
        .map((ch, idx) => ({ ch, idx }))
        .filter(({ ch }) => ch !== " ")
        .map(({ idx }) => idx);

      const count = Math.min(maxGlitched, nonSpaceIndexes.length);
      const shuffled = [...nonSpaceIndexes].sort(() => Math.random() - 0.5);
      const picked = shuffled.slice(0, count);

      for (const idx of picked) {
        const rand = Math.floor(Math.random() * charPool.length);
        chars[idx] = charPool[rand];
      }

      return chars.join("");
    };

    intervalRef.current = window.setInterval(() => {
      setDisplayText(randomize());
    }, stepMs);

    timeoutRef.current = window.setTimeout(() => {
      stopGlitch();
    }, burstDuration);
  };

  useEffect(() => {
    setDisplayText(text);
  }, [text]);

  useEffect(() => stopGlitch, []);

  return (
    <span
      className={className}
      onMouseEnter={startGlitch}
      onFocus={startGlitch}
      onMouseLeave={stopGlitch}
      onBlur={stopGlitch}
    >
      {displayText}
    </span>
  );
}

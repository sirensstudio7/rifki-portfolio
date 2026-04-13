import { useState, useRef, useEffect } from "react";
import { SkipBack, SkipForward, Volume2 } from "lucide-react";

export type TrackItem = { artist: string; track: string; src?: string };

type MusicPlayerProps = {
  tracks: TrackItem[];
  currentIndex?: number;
  onTrackChange?: (index: number) => void;
};

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
};

export const MusicPlayer = ({
  tracks,
  currentIndex = 0,
  onTrackChange,
}: MusicPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const audioRef = useRef<HTMLAudioElement>(null);
  const currentTrack = tracks[currentIndex];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (currentTrack?.src) {
      audio.src = currentTrack.src;
      audio.load();
      if (isPlaying) audio.play();
    } else {
      setDuration(0);
      setCurrentTime(0);
      setProgress(0);
    }
  }, [currentIndex, currentTrack?.src]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      setProgress(audio.duration ? (audio.currentTime / audio.duration) * 100 : 0);
    };
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      if (currentIndex < tracks.length - 1 && onTrackChange) {
        onTrackChange(currentIndex + 1);
      }
    };
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);
    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [currentIndex, tracks.length, onTrackChange]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (currentTrack?.src && audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      setIsPlaying(!isPlaying);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) audio.volume = volume;
  }, [volume]);

  const goPrev = () => {
    if (currentIndex > 0 && onTrackChange) onTrackChange(currentIndex - 1);
  };
  const goNext = () => {
    if (currentIndex < tracks.length - 1 && onTrackChange) onTrackChange(currentIndex + 1);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setProgress(value);
    const audio = audioRef.current;
    if (audio && currentTrack?.src) {
      audio.currentTime = (value / 100) * audio.duration;
      setCurrentTime(audio.currentTime);
    } else if (duration) {
      setCurrentTime((value / 100) * duration);
    }
  };

  if (!currentTrack) return null;

  const progressBar = (
    <div className="w-full max-w-[400px] mx-auto flex items-center gap-2">
      <span className="text-neutral-500 text-xs w-7 md:w-8 tabular-nums shrink-0">
        {formatTime(currentTime)}
      </span>
      <input
        type="range"
        min={0}
        max={100}
        value={progress}
        onChange={handleSeek}
        className="flex-1 min-w-0 h-1 accent-white/80 bg-neutral-600 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-[50%] [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:cursor-pointer"
      />
      <span className="text-neutral-500 text-xs w-7 md:w-8 tabular-nums text-right shrink-0">
        {duration ? formatTime(duration) : "0:00"}
      </span>
    </div>
  );

  const nowPlaying = (
    <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1 md:flex-initial md:min-w-[180px]">
      <div className="w-10 h-10 md:w-14 md:h-14 bg-neutral-700 shrink-0 flex items-center justify-center rounded-[4px] overflow-hidden">
        <div className="w-full h-full bg-white/10 rounded-[4px]" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-white font-medium text-xs md:text-sm truncate">{currentTrack.track}</p>
        <p className="text-neutral-400 text-xs md:text-sm truncate">{currentTrack.artist}</p>
      </div>
    </div>
  );

  const controls = (
    <div className="flex items-center gap-2 md:gap-4 shrink-0">
      <button
        type="button"
        onClick={goPrev}
        className="text-neutral-400 hover:text-white transition-colors p-1 disabled:opacity-40"
        disabled={currentIndex === 0}
        aria-label="Previous"
      >
        <SkipBack className="w-4 h-4 md:w-5 md:h-5" />
      </button>
      <button
        type="button"
        onClick={togglePlay}
        className="w-10 h-10 md:w-12 md:h-12 rounded-[50%] bg-white text-black flex items-center justify-center hover:scale-105 transition-transform shrink-0 overflow-hidden"
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? (
          <svg className="w-5 h-5 md:w-6 md:h-6 rounded-[2px]" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <rect x="6" y="4" width="4" height="16" rx="1" />
            <rect x="14" y="4" width="4" height="16" rx="1" />
          </svg>
        ) : (
          <svg className="w-5 h-5 md:w-6 md:h-6 ml-0.5 rounded-[2px]" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>
      <button
        type="button"
        onClick={goNext}
        className="text-neutral-400 hover:text-white transition-colors p-1 disabled:opacity-40"
        disabled={currentIndex === tracks.length - 1}
        aria-label="Next"
      >
        <SkipForward className="w-4 h-4 md:w-5 md:h-5" />
      </button>
    </div>
  );

  const volumeControl = (
    <div className="flex items-center gap-2 min-w-[120px]">
      <Volume2 className="w-5 h-5 text-neutral-400 shrink-0" />
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={volume}
        onChange={(e) => setVolume(Number(e.target.value))}
        className="w-20 h-1 accent-white/80 bg-neutral-600 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:rounded-[50%] [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:cursor-pointer"
      />
    </div>
  );

  return (
    <>
      <audio ref={audioRef} />
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-neutral-900 border-t border-neutral-700 px-3 py-2 md:px-4 md:py-3">
        <div className="max-w-6xl mx-auto">
          {/* Mobile: two clear rows — (now playing + controls) then progress */}
          <div className="flex flex-col gap-2 md:hidden">
            <div className="flex items-center gap-3 min-w-0">
              {nowPlaying}
              {controls}
            </div>
            {progressBar}
          </div>

          {/* Desktop: single row — now playing | controls + progress | volume */}
          <div className="hidden md:flex md:items-center md:gap-6 md:flex-nowrap">
            {nowPlaying}
            <div className="flex-1 flex flex-col items-center justify-center gap-2 min-w-0">
              {controls}
              <div className="w-full flex justify-center">{progressBar}</div>
            </div>
            {volumeControl}
          </div>
        </div>
      </div>
    </>
  );
};

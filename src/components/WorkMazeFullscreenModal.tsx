import { useEffect } from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { WorkDetailComingSoonMaze } from "@/components/WorkDetailComingSoonMaze";

type WorkMazeFullscreenModalProps = {
  open: boolean;
  onClose: () => void;
};

export function WorkMazeFullscreenModal({ open, onClose }: WorkMazeFullscreenModalProps) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[110] flex h-[100dvh] max-h-[100dvh] flex-col bg-background"
      role="dialog"
      aria-modal="true"
      aria-labelledby="work-maze-modal-title"
    >
      <header className="flex shrink-0 items-center justify-between gap-4 px-4 py-4 md:px-6">
        <Link
          id="work-maze-modal-title"
          to="/"
          className="flex h-12 w-12 shrink-0 items-center justify-center md:h-16 md:w-16"
          aria-label="Home"
        >
          <img
            src="/rifki-logo.svg"
            alt=""
            className="h-10 w-10 object-contain md:h-14 md:w-14"
            aria-hidden
          />
        </Link>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[4px] border border-border text-foreground transition-colors hover:bg-secondary"
        >
          <X className="h-5 w-5" strokeWidth={2} aria-hidden />
        </button>
      </header>
      <div className="min-h-0 flex-1 overflow-hidden px-3 py-2 sm:px-4 sm:py-3 md:px-6 md:py-4">
        <div className="mx-auto h-full min-h-0 w-full max-w-3xl max-md:max-w-full">
          <WorkDetailComingSoonMaze fillViewport />
        </div>
      </div>
    </div>
  );
}

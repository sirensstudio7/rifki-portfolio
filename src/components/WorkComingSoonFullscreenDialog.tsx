import { useEffect } from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { HoverGlitchText } from "@/components/HoverGlitchText";

export type WorkComingSoonSecondary =
  | { kind: "link"; to: string; label: string }
  | { kind: "button"; label: string; onClick: () => void };

type WorkComingSoonFullscreenDialogProps = {
  open: boolean;
  titleId: string;
  hasMiniGame?: boolean;
  secondary: WorkComingSoonSecondary;
  onClose: () => void;
};

export function WorkComingSoonFullscreenDialog({
  open,
  titleId,
  hasMiniGame = false,
  secondary,
  onClose,
}: WorkComingSoonFullscreenDialogProps) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const description = hasMiniGame
    ? "Write-up still in draft. There's a mini-game here if you want to try it meanwhile."
    : "Case study still in draft. I'll publish once the notes and frames are sorted.";

  return (
    <div
      className="fixed inset-0 z-[100] bg-card"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <Link
        to="/"
        className="absolute left-4 top-4 z-[1] flex h-12 w-12 items-center justify-center md:left-6 md:top-6 md:h-16 md:w-16"
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
        className="absolute right-4 top-4 z-[1] inline-flex h-10 w-10 items-center justify-center rounded-[4px] border border-border text-foreground transition-colors hover:bg-secondary md:right-6 md:top-6"
      >
        <X className="h-5 w-5" strokeWidth={2} aria-hidden />
      </button>
      <div className="flex min-h-[100dvh] w-full flex-col items-center justify-center px-6 py-10 md:px-10">
        <div className="flex w-full max-w-2xl flex-col items-center text-center font-mono">
          <h2
            id={titleId}
            className="text-3xl font-bold tracking-tight text-foreground md:text-5xl"
          >
            Coming Soon
          </h2>
          <p className="mt-4 max-w-md text-[16px] text-muted-foreground leading-relaxed md:mt-6">
            {description}
          </p>
          <div className="mt-10 flex w-full max-w-md flex-col gap-3 sm:mt-12 sm:flex-row sm:justify-center">
            <Link
              to="/"
              className="inline-flex h-11 items-center justify-center rounded-[4px] border border-border px-6 text-sm text-foreground transition-colors hover:bg-secondary"
            >
              <HoverGlitchText text="Home" />
            </Link>
            {secondary.kind === "link" ? (
              <Link
                to={secondary.to}
                className="inline-flex h-11 items-center justify-center rounded-[4px] bg-primary px-6 text-sm font-medium text-black transition-colors hover:bg-primary/90"
              >
                <HoverGlitchText text={secondary.label} />
              </Link>
            ) : (
              <button
                type="button"
                onClick={secondary.onClick}
                className="inline-flex h-11 items-center justify-center rounded-[4px] bg-primary px-6 text-sm font-medium text-black transition-colors hover:bg-primary/90"
              >
                <HoverGlitchText text={secondary.label} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

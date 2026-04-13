import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { attachWorkDetailMazeGame } from "@/lib/workDetailMazeGame";

type WorkDetailComingSoonMazeProps = {
  /** Fill available height (use with a parent that is 100dvh or flex-1 min-h-0). */
  fillViewport?: boolean;
};

export function WorkDetailComingSoonMaze({ fillViewport = false }: WorkDetailComingSoonMazeProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    return attachWorkDetailMazeGame(el);
  }, []);

  return (
    <div
      ref={rootRef}
      className={cn("workdetail-maze-game font-mono", fillViewport && "workdetail-maze-game--fill-dvh")}
    >
      <div data-maze-cont>
        <div className="workdetail-maze-mbox">
          <div className="workdetail-maze-board-wrap">
            <div data-maze-board className="workdetail-maze-board">
              <div data-maze-player className="workdetail-maze-thingie">
                <div className="workdetail-maze-emo" data-maze-emo>
                  🐱
                </div>
              </div>
              <div data-maze-home className="workdetail-maze-home">
                <div className="workdetail-maze-emo">🐭</div>
              </div>
              <div className="workdetail-maze-barrier workdetail-maze-barrier--top" />
              <div className="workdetail-maze-barrier workdetail-maze-barrier--bottom" />
              <div className="workdetail-maze-level-row" aria-live="polite">
                <p className="workdetail-maze-level text-sm text-muted-foreground font-mono md:text-base">
                  Level <span data-maze-level>1</span>
                </p>
                <div className="workdetail-maze-timer-inline">
                  <span className="workdetail-maze-timer-label">Time</span>
                  <span data-maze-timer className="workdetail-maze-timer-value tabular-nums">
                    —
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="workdetail-maze-controls">
          <div className="workdetail-maze-buttons">
            <button type="button" className="workdetail-maze-btn" data-maze-bu aria-label="Up">
              <span className="workdetail-maze-chevron">↑</span>
            </button>
            <button type="button" className="workdetail-maze-btn" data-maze-bd aria-label="Down">
              <span className="workdetail-maze-chevron">↓</span>
            </button>
            <button type="button" className="workdetail-maze-btn" data-maze-bl aria-label="Left">
              <span className="workdetail-maze-chevron">←</span>
            </button>
            <button type="button" className="workdetail-maze-btn" data-maze-br aria-label="Right">
              <span className="workdetail-maze-chevron">→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

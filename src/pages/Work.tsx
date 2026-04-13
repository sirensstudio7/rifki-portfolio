import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { SiteNav } from "@/components/SiteNav";
import { WorkComingSoonFullscreenDialog } from "@/components/WorkComingSoonFullscreenDialog";
import { WorkMazeFullscreenModal } from "@/components/WorkMazeFullscreenModal";
import { getWorkItemBySlug, WORK_ITEMS, workItemOpensComingSoonFromIndex } from "@/data/workItems";

const Work = () => {
  const introRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [comingSoonModalSlug, setComingSoonModalSlug] = useState<string | null>(null);
  const [mazeModalOpen, setMazeModalOpen] = useState(false);

  const closeMazeModal = useCallback(() => setMazeModalOpen(false), []);

  useEffect(() => {
    const intro = introRef.current;
    if (intro) {
      const paragraphs = intro.querySelectorAll("p");
      gsap.fromTo(
        paragraphs,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.15,
          ease: "power2.out",
        }
      );
    }
    const el = sectionRef.current;
    if (!el) return;
    const cards = el.querySelectorAll("[data-work-card]");
    gsap.fromTo(
      cards,
      { opacity: 0, y: 24 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.12,
        ease: "power2.out",
        delay: 0.2,
      }
    );
  }, []);

  const comingSoonModalItem = comingSoonModalSlug
    ? getWorkItemBySlug(comingSoonModalSlug)
    : undefined;

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />

      {comingSoonModalItem ? (
        <WorkComingSoonFullscreenDialog
          open
          titleId="work-index-coming-soon-title"
          hasMiniGame
          onClose={() => setComingSoonModalSlug(null)}
          secondary={{
            kind: "button",
            label: "Play Game",
            onClick: () => {
              setComingSoonModalSlug(null);
              setMazeModalOpen(true);
            },
          }}
        />
      ) : null}

      <WorkMazeFullscreenModal open={mazeModalOpen} onClose={closeMazeModal} />

      <main className="max-w-2xl mx-auto px-6 pt-[120px]">
        <div ref={introRef}>
          <p className="text-[20px] text-[#8F8F8F] mb-8">
            Selected projects focused on clarity, precision, and strong visual direction.
          </p>
          <p className="text-[20px] text-[#8F8F8F] mb-8">
            Every detail is intentional. Every pixel has a purpose.
          </p>
        </div>
        <section className="mb-16" ref={sectionRef}>
          <div className="w-screen relative left-1/2 -translate-x-1/2">
            <div className="max-w-3xl mx-auto px-6 flex flex-col gap-[8px]">
              {WORK_ITEMS.map((item) => {
                const card = (
                  <article
                    data-work-card
                    className="group bg-background p-6 font-mono border border-border rounded-[4px] hover:bg-card transition-colors cursor-pointer"
                  >
                    <div className="flex flex-col md:flex-row gap-4 md:gap-8 md:items-baseline">
                      <span className="text-sm text-muted-foreground whitespace-nowrap min-w-[120px]">
                        {item.date}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-2 mb-3">
                          <h2 className="text-base font-bold text-foreground group-hover:text-primary transition-colors min-w-0">
                            {item.title}
                          </h2>
                          {workItemOpensComingSoonFromIndex(item) ? (
                            <span
                              className="shrink-0 text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.08em] px-2 py-1 rounded-[4px] border border-border bg-secondary/60 text-muted-foreground"
                              aria-label="Coming soon"
                            >
                              Coming soon
                            </span>
                          ) : null}
                        </div>
                        <p className="text-[14px] font-normal text-muted-foreground leading-[1.4]">
                          {item.shortDescription}
                        </p>
                      </div>
                    </div>
                  </article>
                );

                if (workItemOpensComingSoonFromIndex(item)) {
                  return (
                    <div
                      key={item.slug}
                      role="button"
                      tabIndex={0}
                      aria-haspopup="dialog"
                      onClick={() => setComingSoonModalSlug(item.slug)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setComingSoonModalSlug(item.slug);
                        }
                      }}
                      className="block w-full text-left cursor-pointer"
                    >
                      {card}
                    </div>
                  );
                }

                return (
                  <Link key={item.slug} to={`/work/${item.slug}`} className="block">
                    {card}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Work;

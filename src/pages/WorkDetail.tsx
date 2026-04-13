import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import gsap from "gsap";
import { ChevronLeft, ChevronRight, Maximize2, Minimize2 } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { HoverGlitchText } from "@/components/HoverGlitchText";
import { getWorkItemBySlug, WORK_ITEMS } from "@/data/workItems";
import { WorkComingSoonFullscreenDialog } from "@/components/WorkComingSoonFullscreenDialog";
import { WorkDetailComingSoonMaze } from "@/components/WorkDetailComingSoonMaze";

const FlowChips = () => {
  return (
    <div className="flow-chips-wrapper">
      <span className="flow-chip">Find Nearby</span>
      <div className="flow-link-wrapper" aria-hidden="true">
        <div className="flow-link" />
        <div className="flow-switch" />
      </div>
      <span className="flow-chip">Book Time</span>
      <div className="flow-link-wrapper" aria-hidden="true">
        <div className="flow-link" />
        <div className="flow-switch" />
      </div>
      <span className="flow-chip active">Get It Done</span>
    </div>
  );
};

const WorkDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const contentRef = useRef<HTMLDivElement>(null);
  const fullscreenSectionRef = useRef<HTMLElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fullscreenMaskVisible, setFullscreenMaskVisible] = useState(false);
  const [mazeIntroDismissed, setMazeIntroDismissed] = useState(false);
  const item = slug ? getWorkItemBySlug(slug) : undefined;

  useEffect(() => {
    setMazeIntroDismissed(false);
  }, [slug]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [dropdownOpen]);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const blocks = el.querySelectorAll("[data-story-block]");
    gsap.fromTo(
      blocks,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.12, ease: "power2.out", delay: 0.1 }
    );
  }, [slug]);

  useEffect(() => {
    const animateFullscreenSettle = () => {
      const sectionEl = fullscreenSectionRef.current;
      if (!sectionEl) return;
      gsap.fromTo(
        sectionEl,
        { opacity: 0.88, scale: 0.985 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.42,
          ease: "power2.out",
          clearProps: "transform,opacity",
        }
      );
    };

    const onFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === fullscreenSectionRef.current);
      animateFullscreenSettle();
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  const toggleFullscreen = async () => {
    const sectionEl = fullscreenSectionRef.current;
    if (!sectionEl) return;
    setFullscreenMaskVisible(true);
    await gsap.to(".workdetail-fullscreen-mask", {
      opacity: 1,
      duration: 0.16,
      ease: "power2.out",
    });

    if (document.fullscreenElement === sectionEl) {
      await gsap.to(sectionEl, {
        opacity: 0.92,
        scale: 0.992,
        duration: 0.12,
        ease: "power1.out",
      });
      await document.exitFullscreen();
    } else {
      await gsap.to(sectionEl, {
        opacity: 0.92,
        scale: 1.008,
        duration: 0.12,
        ease: "power1.out",
      });
      await sectionEl.requestFullscreen();
    }
    await gsap.to(".workdetail-fullscreen-mask", {
      opacity: 0,
      duration: 0.24,
      ease: "power2.out",
    });
    setFullscreenMaskVisible(false);
  };

  if (!item) {
    return (
      <div className="min-h-screen bg-background">
        <SiteNav />
        <main className="flex flex-col md:flex-row min-h-[calc(100vh-0px)] pt-[120px] pb-24 md:pt-0 md:pb-0">
          <div className="md:w-[25%] md:max-w-sm md:flex md:flex-col md:shrink-0">
            <div className="px-6 pt-6 md:p-10 md:flex md:flex-col md:min-h-screen">
              <Link to="/work" className="text-primary hover:underline text-sm">
                ← Back to Work
              </Link>
              <p className="text-muted-foreground mt-6">Project not found.</p>
            </div>
          </div>
          <section className="flex-1 px-6 py-10 md:overflow-y-auto md:p-10" />
        </main>
      </div>
    );
  }

  const story = item.story;
  const currentIndex = WORK_ITEMS.findIndex((w) => w.slug === item.slug);
  const prevItem = currentIndex > 0 ? WORK_ITEMS[currentIndex - 1] : null;
  const nextItem = currentIndex >= 0 && currentIndex < WORK_ITEMS.length - 1 ? WORK_ITEMS[currentIndex + 1] : null;

  const showMazeIntro = item.detailEmbed === "maze" && !mazeIntroDismissed;

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />

      <WorkComingSoonFullscreenDialog
        open={showMazeIntro}
        titleId="work-maze-intro-title"
        hasMiniGame
        onClose={() => setMazeIntroDismissed(true)}
        secondary={{
          kind: "button",
          label: "Play Game",
          onClick: () => setMazeIntroDismissed(true),
        }}
      />

      <main
        className="flex flex-col md:flex-row min-h-[calc(100vh-0px)] pt-0 pb-24 md:pt-0 md:pb-0"
        ref={contentRef}
      >
        {/* Mobile fixed top navbar */}
        <div className="sticky top-0 z-40 border-b border-border bg-neutral-900 px-6 py-4 md:hidden">
          <div className="flex items-center justify-between gap-4">
            <Link
              to="/work"
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors shrink-0"
            >
              ← Back
            </Link>
            <div className="flex items-center gap-2 min-w-0">
              {prevItem ? (
                <Link
                  to={`/work/${prevItem.slug}`}
                  className="inline-flex items-center justify-center rounded-[4px] border border-border bg-background/40 p-2 text-foreground hover:bg-muted/40 transition-colors"
                  aria-label="Previous project"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Link>
              ) : (
                <span
                  className="inline-flex items-center justify-center rounded-[4px] border border-border/40 bg-transparent p-2 text-muted-foreground/40"
                  aria-hidden
                >
                  <ChevronLeft className="h-4 w-4" />
                </span>
              )}

              <span className="text-sm text-muted-foreground font-mono truncate">
                {item.title}
              </span>

              {nextItem ? (
                <Link
                  to={`/work/${nextItem.slug}`}
                  className="inline-flex items-center justify-center rounded-[4px] border border-border bg-background/40 p-2 text-foreground hover:bg-muted/40 transition-colors"
                  aria-label="Next project"
                >
                  <ChevronRight className="h-4 w-4" />
                </Link>
              ) : (
                <span
                  className="inline-flex items-center justify-center rounded-[4px] border border-border/40 bg-transparent p-2 text-muted-foreground/40"
                  aria-hidden
                >
                  <ChevronRight className="h-4 w-4" />
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Desktop-only spacer (reserves space for fixed sidebar) */}
        <div className="hidden md:block md:w-[25%] md:max-w-sm md:shrink-0" aria-hidden="true" />
        <div
          className="hidden md:flex flex-col justify-between fixed left-0 top-0 z-20 h-[100dvh] p-[24px] bg-neutral-900 border-r border-border"
          style={{ width: 'min(25%, 24rem)' }}
        >
          <div className="space-y-4">
            <div className="flex w-full flex-wrap items-center gap-2">
              {prevItem ? (
                <Link
                  to={`/work/${prevItem.slug}`}
                  className="inline-flex items-center justify-center rounded-[4px] border border-border bg-background/50 p-2.5 text-foreground hover:bg-muted/50 hover:border-muted-foreground/30 transition-colors"
                  aria-label="Previous project"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Link>
              ) : (
                <span className="inline-flex items-center justify-center rounded-[4px] border border-border/50 bg-transparent p-2.5 text-muted-foreground/50 cursor-not-allowed" aria-hidden>
                  <ChevronLeft className="w-5 h-5" />
                </span>
              )}
              <div ref={dropdownRef} className="dropdown-container relative min-w-0 flex-1">
                <button
                  id="dropdownDefaultButton"
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDropdownOpen((o) => !o);
                  }}
                  className="inline-flex h-[42px] w-full items-center justify-between rounded-[4px] border border-border bg-background/50 px-4 py-2.5 text-sm font-medium leading-5 text-foreground shadow-sm transition-colors hover:bg-muted/50 hover:border-muted-foreground/30 focus:outline-none focus:ring-0"
                  aria-label="Select project"
                  aria-expanded={dropdownOpen}
                  aria-haspopup="listbox"
                >
                  <span className="min-w-0 flex-1 truncate text-left">
                    {item.title}
                  </span>
                  <svg
                    className="h-4 w-4 shrink-0 ms-1.5 -me-0.5 transition-transform duration-200"
                    style={{ transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                    aria-hidden
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m19 9-7 7-7-7" />
                  </svg>
                </button>
                <div
                  id="dropdown"
                  className={`absolute left-0 top-full z-10 mt-1 w-44 rounded-[4px] border border-border bg-muted shadow-lg ${dropdownOpen ? "block" : "hidden"}`}
                >
                  <ul
                    className="p-2 text-sm font-medium text-muted-foreground"
                    role="listbox"
                    aria-labelledby="dropdownDefaultButton"
                  >
                    {WORK_ITEMS.map((w) => (
                      <li key={w.slug}>
                        <button
                          type="button"
                          className="inline-flex w-full items-center rounded-[4px] p-2 text-left transition-colors hover:bg-muted/80 hover:text-foreground"
                          onClick={() => {
                            navigate(`/work/${w.slug}`);
                            setDropdownOpen(false);
                          }}
                        >
                          <span className="truncate">{w.title}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              {nextItem ? (
                <Link
                  to={`/work/${nextItem.slug}`}
                  className="inline-flex items-center justify-center rounded-[4px] border border-border bg-background/50 p-2.5 text-foreground hover:bg-muted/50 hover:border-muted-foreground/30 transition-colors"
                  aria-label="Next project"
                >
                  <ChevronRight className="w-5 h-5" />
                </Link>
              ) : (
                <span className="inline-flex items-center justify-center rounded-[4px] border border-border/50 bg-transparent p-2.5 text-muted-foreground/50 cursor-not-allowed" aria-hidden>
                  <ChevronRight className="w-5 h-5" />
                </span>
              )}
            </div>
            <div className="pt-12">
              <div className="flex flex-nowrap items-center justify-between">
                <p className="text-sm text-muted-foreground font-mono shrink-0">{item.date}</p>
                {item.title.includes(" // ") ? (
                  <span className="shrink-0 rounded-[2px] bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                    {item.title.split(" // ").pop()}
                  </span>
                ) : null}
              </div>
              <h1 className="text-base font-bold text-foreground mt-4 mb-2 font-mono leading-tight">
                {item.title.includes(" // ") ? item.title.split(" // ")[0] : item.title}
              </h1>
              {story?.tagline && (
                <p className="text-sm text-muted-foreground leading-relaxed">{story.tagline}</p>
              )}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Link
              to="/"
              className="border border-border text-foreground text-[14px] h-[40px] px-5 rounded-[4px] hover:bg-secondary transition-colors inline-flex items-center justify-center whitespace-nowrap"
            >
              <HoverGlitchText text="Home" />
            </Link>
            <a
              href="https://cal.com/rifki-firdaus-yxboki"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:flex-1 min-w-0 bg-primary text-[14px] h-[40px] px-5 rounded-[4px] hover:bg-primary/90 transition-colors inline-flex items-center justify-center whitespace-nowrap text-black hover:text-black"
            >
              <HoverGlitchText text="Let's talk!" />
            </a>
          </div>
        </div>

        {/* Mobile bottom navbar */}
        <div className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-between gap-3 border-t border-border bg-neutral-900/95 px-6 py-4 backdrop-blur-sm md:hidden">
          <Link
            to="/"
            className="border border-border text-foreground text-[14px] h-[40px] px-5 rounded-[4px] hover:bg-secondary transition-colors inline-flex items-center justify-center whitespace-nowrap"
          >
            <HoverGlitchText text="Home" />
          </Link>
          <a
            href="https://cal.com/rifki-firdaus-yxboki"
            target="_blank"
            rel="noopener noreferrer"
            className="min-w-0 flex-1 bg-primary text-[14px] h-[40px] px-5 rounded-[4px] hover:bg-primary/90 transition-colors inline-flex items-center justify-center whitespace-nowrap text-black hover:text-black"
          >
            <HoverGlitchText text="Let's talk!" />
          </a>
        </div>

        {/* Right: scrollable project content (story only on desktop; mobile shows header + story) */}
        <section
          ref={fullscreenSectionRef}
          className="flex-1 min-h-0 px-6 pt-[24px] pb-24 md:overflow-y-auto md:overflow-x-hidden md:px-10 md:pb-10 md:w-[75%]"
        >
          {fullscreenMaskVisible && (
            <div className="workdetail-fullscreen-mask fixed inset-0 z-[60] bg-background/95 opacity-0 pointer-events-none" />
          )}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="hidden md:inline-flex fixed top-6 right-6 z-30 items-center rounded-[4px] border border-border bg-background/90 p-2 text-foreground hover:bg-muted transition-colors backdrop-blur-sm"
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
          {story && (
            <div className="w-full mt-0">
              {item.detailEmbed === "maze" ? (
                mazeIntroDismissed ? (
                  <div className="h-[100dvh] min-h-[100dvh] w-full">
                    <WorkDetailComingSoonMaze fillViewport />
                  </div>
                ) : (
                  <div className="min-h-[40vh]" aria-hidden />
                )
              ) : (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-x-3 gap-y-8 [&_section+section]:mt-8 md:[&_section+section]:mt-12">
                {item.gallery?.hero && (
                  <section className="col-span-full h-[48svh] md:h-[62svh] -mx-6 md:-mx-10" data-story-block>
                    <figure className="size-full overflow-hidden bg-muted">
                      <img src={item.gallery.hero} alt="" className="size-full object-cover" />
                    </figure>
                  </section>
                )}

                <header className="col-span-full grid grid-cols-1 md:grid-cols-12 gap-x-3 gap-y-6 mb-12 md:mb-20" data-story-block>
                  <div className="md:col-span-4 flex flex-col gap-2">
                    <span className="text-sm text-muted-foreground font-mono">{item.date}</span>
                    <h1 className="text-xl md:text-2xl font-bold text-foreground font-mono leading-tight">
                      {item.title}
                    </h1>
                  </div>
                  {story?.tagline && (
                    <div className="md:col-span-6 md:col-start-7">
                      <p className="text-[16px] md:text-[20px] text-muted-foreground leading-[1.5]">{story.tagline}</p>
                    </div>
                  )}
                </header>

                {story.sections && story.sections.length > 0
                  ? story.sections.map((section) => (
                      <section key={section.heading} className="col-span-full md:col-start-3 md:col-span-8" data-story-block>
                      <h2 className="text-xl md:text-2xl font-semibold text-foreground leading-snug mb-4 flex flex-col gap-2">
                        <span className="inline-flex w-fit items-center rounded-[4px] border border-border bg-muted px-2.5 py-1 text-xs md:text-sm font-medium text-muted-foreground">
                          {section.heading.split(" — ")[0]}
                        </span>
                        <span>{section.heading.includes(" — ") ? section.heading.split(" — ").slice(1).join(" — ") : ""}</span>
                      </h2>
                        <div className="space-y-4">
                          {section.body.split("\n\n").map((paragraph, idx) => (
                            <div key={`${section.heading}-${idx}`} className="group space-y-4">
                              {section.heading.toLowerCase().includes("expectation") && idx === 0 && (
                                <figure className="w-full aspect-[16/9] overflow-hidden rounded-[4px] bg-muted">
                                  <img
                                    src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=1200&auto=format&fit=crop"
                                    alt=""
                                    className="h-full w-full object-cover"
                                  />
                                </figure>
                              )}
                              {section.heading.toLowerCase().includes("expectation") && idx === 1 && (
                                <figure className="w-full aspect-[16/9] overflow-hidden rounded-[4px] bg-muted">
                                  <img
                                    src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1200&auto=format&fit=crop"
                                    alt=""
                                    className="h-full w-full object-cover"
                                  />
                                </figure>
                              )}
                              {section.heading.toLowerCase().includes("expectation") && idx === 2 && (
                                <figure className="w-full aspect-[16/9] overflow-hidden rounded-[4px] bg-muted">
                                  <img
                                    src="https://images.unsplash.com/photo-1556740749-887f6717d7e4?w=1200&auto=format&fit=crop"
                                    alt=""
                                    className="h-full w-full object-cover"
                                  />
                                </figure>
                              )}
                              {section.heading.toLowerCase().includes("expectation") && idx === 2 ? (
                                <div className="space-y-4">
                                  <p className="text-[14px] text-foreground/70 leading-[1.6]">{paragraph}</p>
                                  <FlowChips />
                                  <p className="text-[20px] md:text-[24px] font-semibold text-foreground leading-none">But.........</p>
                                </div>
                              ) : (
                                <p className="text-[14px] text-foreground/70 leading-[1.6]">{paragraph}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </section>
                    ))
                  : null}
                {!story.sections?.length && story.context && (
                  <section className="col-span-full md:col-start-3 md:col-span-8" data-story-block>
                    <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                      Context
                    </h2>
                    <p className="text-[14px] text-foreground leading-[1.6]">{story.context}</p>
                  </section>
                )}
                {!story.sections?.length && story.challenge && (
                  <section className="col-span-full md:col-start-3 md:col-span-8" data-story-block>
                    <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                      Challenge
                    </h2>
                    <p className="text-[14px] text-foreground leading-[1.6]">{story.challenge}</p>
                  </section>
                )}
                {!story.sections?.length && story.approach && (
                  <section className="col-span-full md:col-start-3 md:col-span-8" data-story-block>
                    <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                      Approach
                    </h2>
                    <p className="text-[14px] text-foreground leading-[1.6]">{story.approach}</p>
                  </section>
                )}
                {!story.sections?.length && story.result && (
                  <section className="col-span-full md:col-start-3 md:col-span-8" data-story-block>
                    <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                      Result
                    </h2>
                    <p className="text-[14px] text-foreground leading-[1.6]">{story.result}</p>
                  </section>
                )}

                {item.gallery?.imageCards && item.gallery.imageCards.length > 0 && (
                  <section className="col-span-full grid grid-cols-1 md:grid-cols-12 gap-3" data-story-block>
                    {item.gallery.imageCards.map((src, i) => (
                      <figure
                        key={`image-${i}-${src}`}
                        className="md:col-span-6 aspect-[4/3] overflow-hidden rounded-[4px] bg-muted"
                      >
                        <img src={src} alt="" className="h-full w-full object-cover" />
                      </figure>
                    ))}
                  </section>
                )}

                {item.gallery?.screens && item.gallery.screens.length > 0 && (
                  <section className="col-span-full grid grid-cols-1 md:grid-cols-12 gap-3" data-story-block>
                    {item.gallery.screens.map((src, i) => (
                      <figure
                        key={`screen-${i}-${src}`}
                        className="md:col-span-6 aspect-[4/3] overflow-hidden rounded-[4px] bg-muted"
                      >
                        <img src={src} alt="" className="h-full w-full object-cover" />
                      </figure>
                    ))}
                  </section>
                )}

                {item.gallery?.wide && (
                  <section className="col-span-full" data-story-block>
                    <figure className="w-full aspect-video overflow-hidden rounded-[4px] bg-muted">
                      <img src={item.gallery.wide} alt="" className="h-full w-full object-cover" />
                    </figure>
                  </section>
                )}

                {item.gallery?.details && item.gallery.details.length > 0 && (
                  <section className="col-span-full grid grid-cols-1 md:grid-cols-12 gap-3" data-story-block>
                    {item.gallery.details.map((src, i) => (
                      <figure
                        key={`detail-${i}-${src}`}
                        className="md:col-span-6 aspect-[4/3] overflow-hidden rounded-[4px] bg-muted"
                      >
                        <img src={src} alt="" className="h-full w-full object-cover" />
                      </figure>
                    ))}
                  </section>
                )}
              </div>
              )}
            </div>
          )}

          {!story && (
            <div className="mt-12 grid grid-cols-1 md:grid-cols-12 gap-3" data-story-block>
              <p className="md:col-start-3 md:col-span-8 text-muted-foreground leading-[1.6]">{item.shortDescription}</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default WorkDetail;

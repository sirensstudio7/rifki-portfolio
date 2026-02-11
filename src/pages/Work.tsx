import { useEffect, useRef } from "react";
import gsap from "gsap";
import { SiteNav } from "@/components/SiteNav";

const Work = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
      }
    );
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />

      <main className="max-w-2xl mx-auto px-6 pt-[120px]">
        <p className="text-[20px] text-[#8F8F8F] mb-8">
          voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis.
        </p>
        <section className="mb-16" ref={sectionRef}>
          <div className="w-screen relative left-1/2 -translate-x-1/2">
            <div className="max-w-3xl mx-auto px-6 space-y-2">
              {[
                { date: "2025 - Present", title: "Tanahub // Web3" },
                { date: "2025 - Present", title: "Core Club Connect // Mobile App" },
                { date: "2025 - Present", title: "Jazztify // Web" },
                { date: "2025 - Present", title: "Offer // Mobile App" },
                { date: "2025 - Present", title: "Islamic Reminder // Mobile App" },
                { date: "2025 - Present", title: "NanoFi // Web3" },
                { date: "2025 - Present", title: "Dundun // Web3" },
              ].map((item) => (
                <article
                  key={item.title}
                  data-work-card
                  className="bg-background p-6 font-mono border border-border hover:bg-card transition-colors"
                >
                  <div className="flex flex-col md:flex-row gap-4 md:gap-8">
                    <span className="text-sm text-muted-foreground whitespace-nowrap">
                      {item.date}
                    </span>
                    <div>
                      <h2 className="text-base font-bold text-foreground mb-3">
                        {item.title}
                      </h2>
                      <p className="text-sm text-muted-foreground leading-[1.4]">
                        Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut
                        odit aut fugit, sed quia consequuntur magni dolores eos qui
                        ratione voluptatem sequi nesciunt.
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Work;

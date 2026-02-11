import { useEffect, useRef } from "react";
import { Instagram, Github } from "lucide-react";
import gsap from "gsap";
import { SiteNav } from "@/components/SiteNav";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const DribbbleIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.245.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z" />
  </svg>
);

const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const Index = () => {
  const aboutTextRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = aboutTextRef.current;
    if (!el) return;
    const paragraphs = el.querySelectorAll("p");
    gsap.fromTo(
      paragraphs,
      { opacity: 0, y: 28 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.15,
        ease: "power2.out",
      }
    );
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-6 pt-[120px]">
        {/* Profile Card */}
        <div className="bg-card rounded-2xl p-6 pb-4 md:pb-6 mb-12">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="group w-[100px] h-[100px] sm:w-16 sm:h-16 shrink-0 overflow-hidden rounded-full">
            <Avatar className="w-[100px] h-[100px] sm:w-16 sm:h-16">
              <AvatarImage
                src="/pp.jpeg"
                alt="Rifk"
                className="transition-transform duration-300 ease-out group-hover:scale-150"
              />
              <AvatarFallback className="bg-secondary text-muted-foreground text-xl">R</AvatarFallback>
            </Avatar>
            </div>
            <div className="min-w-0 flex flex-col gap-0.5 text-center sm:text-left">
              <h1 className="text-[20px] font-semibold text-foreground">Rifk</h1>
              <p className="text-[16px] text-muted-foreground">Design Engineer</p>
            </div>
          </div>

          {/* Social Icons + Buttons side by side (stacked on mobile: icons then buttons) */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mt-5">
            <div className="flex items-center gap-2">
            <a
              href="#"
              className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
            >
              <DribbbleIcon />
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
            >
              <XIcon />
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
            </div>
            <div className="flex items-center gap-3">
              <button className="border border-border text-foreground text-sm px-5 py-2 rounded-full hover:bg-secondary transition-colors">
                Hire Me
              </button>
              <button className="bg-primary text-black text-[16px] h-[40px] px-5 rounded-full hover:bg-primary/90 transition-colors inline-flex items-center justify-center">
                Let's talk!
              </button>
            </div>
          </div>
        </div>

        {/* About Section */}
        <section className="mb-16">
          <div
            ref={aboutTextRef}
            className="space-y-5 text-[24px] md:text-[32px] leading-[1.4] text-muted-foreground"
          >
            <p>
              I'm a <span className="text-foreground font-medium">design engineer</span> who builds{" "}
              <span className="text-foreground font-medium">products</span> and{" "}
              <span className="text-foreground font-medium">brands</span> from the ground up. I focus on{" "}
              <span className="text-foreground font-medium">motion</span>,{" "}
              <span className="text-foreground font-medium">interaction design</span>, and{" "}
              <span className="text-foreground font-medium">visual aesthetics</span> to create engaging
              digital experiences.
            </p>

            <p>
              Currently working on <span className="text-foreground font-medium">freelance projects</span>{" "}
              and building <span className="text-foreground font-medium">tools</span> that merge{" "}
              <span className="text-foreground font-medium">design</span> and{" "}
              <span className="text-foreground font-medium">engineering</span>. I love experimenting with{" "}
              <span className="text-foreground font-medium">new technologies</span> and pushing the
              boundaries of what's possible on the web.
            </p>

            <p>
              When I'm not designing or coding, you can find me{" "}
              <span className="text-foreground font-medium">making music</span>,{" "}
              <span className="text-foreground font-medium">exploring art</span>, or diving into{" "}
              <span className="text-foreground font-medium">creative side projects</span> that keep me
              inspired and learning.
            </p>

            <div className="!mt-[160px] flex justify-center">
            <button
              type="button"
              className="bg-background text-foreground text-sm px-5 py-3 rounded-full border border-border hover:bg-secondary transition-colors"
            >
              Go To The Abyys
            </button>
          </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;

import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Instagram, Github } from "lucide-react";
import gsap from "gsap";
import { SiteNav } from "@/components/SiteNav";
import { HoverGlitchText } from "@/components/HoverGlitchText";
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
  const profileCardRef = useRef<HTMLDivElement>(null);
  const aboutTextRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);

  const handleAbyysClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const page = pageRef.current;
    if (!page) {
      window.location.href = "/abyys.html";
      return;
    }
    gsap.to(page, {
      opacity: 0,
      duration: 0.5,
      ease: "power2.inOut",
      onComplete: () => {
        window.location.href = "/abyys.html";
      },
    });
  };

  useEffect(() => {
    const card = profileCardRef.current;
    if (card) {
      gsap.fromTo(
        card,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
      );
    }
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
        delay: 0.15,
      }
    );
  }, []);

  return (
    <div ref={pageRef} className="min-h-screen bg-background">
      <SiteNav />

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-6 pt-[120px]">
        {/* Profile Card */}
        <div ref={profileCardRef} className="bg-card rounded-[4px] p-6 pb-4 md:pb-6 mb-8">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="group w-[100px] h-[100px] sm:w-16 sm:h-16 shrink-0 overflow-hidden rounded-[100%]">
            <Avatar className="w-[100px] h-[100px] sm:w-16 sm:h-16 rounded-[100%]">
              <AvatarImage
                src="/pp.jpeg"
                alt="Rifk"
                className="rounded-full transition-transform duration-300 ease-out group-hover:scale-150"
              />
              <AvatarFallback className="bg-secondary text-muted-foreground text-xl">R</AvatarFallback>
            </Avatar>
            </div>
            <div className="min-w-0 flex flex-col gap-0.5 text-center sm:text-left">
              <h1 className="text-[20px] font-semibold text-foreground">Rifk</h1>
              <p className="text-[16px] text-muted-foreground">Digital Product Designer</p>
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
              <a
                href="mailto:rifkifir7@gmail.com"
                className="border border-border text-foreground text-[16px] md:text-[14px] h-[40px] px-5 rounded-[4px] hover:bg-secondary transition-colors inline-flex items-center justify-center whitespace-nowrap"
              >
                <HoverGlitchText text="Hire Me" />
              </a>
              <a
                href="https://cal.com/rifki-firdaus-yxboki"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-primary text-black text-[16px] md:text-[14px] h-[40px] px-5 rounded-[4px] hover:bg-primary/90 hover:text-black transition-colors inline-flex items-center justify-center whitespace-nowrap"
              >
                <HoverGlitchText text="Let's talk!" />
              </a>
            </div>
          </div>
        </div>

        {/* About Section */}
        <section className="mb-16">
          <div
            ref={aboutTextRef}
            className="space-y-5 text-[14px] md:text-[17px] leading-[1.55] text-muted-foreground"
          >
            <p>
              I'm a <span className="text-foreground font-medium">Digital Product Designer</span> focused on helping brands and businesses grow in the digital space and achieve their goals through thoughtful design and strong visual direction. I care about <span className="text-foreground font-medium">clarity</span>, <span className="text-foreground font-medium">structure</span>, and the kind of precision where <span className="text-foreground font-medium">every pixel has a reason to exist</span>.
            </p>

            <p>
              For me, <span className="text-foreground font-medium">design is not decoration</span>. It is how a brand speaks, moves, and positions itself. It is how <span className="text-foreground font-medium">ideas turn into trust</span>.
            </p>

            <p>
              I shape interfaces on the frontend through experimentation and intuition, refining layouts and details until everything feels balanced and intentional. <span className="text-foreground font-medium">Clean structure. Strong hierarchy. No noise. Just purpose.</span>
            </p>

            <p>
              I collaborate with founders and teams to turn ideas into <span className="text-foreground font-medium">focused, engaging digital products</span> that not only look sharp, but actually work.
            </p>

            <p>
              Outside of work, I <span className="text-foreground font-medium">make music</span>, <span className="text-foreground font-medium">explore art</span>, and dive into creative projects that keep my perspective fresh. <span className="text-foreground font-medium">Creating, in any form, is what drives me.</span>
            </p>

            <div className="!mt-[80px] flex flex-wrap justify-center gap-3">
              <Link
                to="/work"
                className="bg-primary text-black text-sm px-5 py-3 rounded-[4px] hover:bg-primary/90 transition-colors inline-flex items-center justify-center"
              >
                <HoverGlitchText text="See Work" />
              </Link>
              <a
                href="/abyys.html"
                onClick={handleAbyysClick}
                className="bg-background text-foreground text-sm px-5 py-3 rounded-[4px] border border-border hover:bg-secondary transition-colors inline-block"
              >
                <HoverGlitchText text="Sit & Mourn" />
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;

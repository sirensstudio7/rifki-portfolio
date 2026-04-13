import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { HoverGlitchText } from "@/components/HoverGlitchText";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/work", label: "Work" },
  { to: "/media", label: "Media" },
  { to: "/music", label: "Music" },
  { to: "/code", label: "Code" },
];

const baseClass =
  "text-sm rounded-full px-5 py-2 border transition-all duration-300 ease-in-out";
const activeClass =
  "text-neutral-900 border-border bg-white";
const inactiveClass =
  "text-muted-foreground hover:text-foreground border-transparent";

export const SiteNav = () => {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const isWorkDetailPage = pathname.startsWith("/work/");

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 h-[100px] flex items-center justify-between px-4 md:px-6 bg-background transition-opacity duration-300",
          isWorkDetailPage && "opacity-0 pointer-events-none"
        )}
      >
        <a href="/" className="w-12 h-12 md:w-16 md:h-16 shrink-0 flex items-center justify-center" aria-label="Home">
          <img src="/rifki-logo.svg" alt="Rifki" className="w-10 h-10 md:w-14 md:h-14 object-contain" />
        </a>

        {/* Desktop: centered links */}
        <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-6">
          {navLinks.map(({ to, label }) =>
            to.startsWith("#") ? (
              <a key={label} href={to} className={cn(baseClass, "md:rounded-[4px]", inactiveClass)}>
                {label}
              </a>
            ) : (
              <NavLink
                key={label}
                to={to}
                end={to === "/"}
                className={({ isActive }) => cn(baseClass, "md:rounded-[4px]", isActive ? activeClass : inactiveClass)}
              >
                <HoverGlitchText text={label} />
              </NavLink>
            )
          )}
        </div>

        {/* Desktop: Let's talk */}
        <a
          href="https://cal.com/rifki-firdaus-yxboki"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:inline-flex items-center h-[38px] text-sm rounded-[4px] px-5 py-2 bg-primary text-black hover:bg-primary/90 transition-colors shrink-0"
        >
          <HoverGlitchText text="Let's talk!" />
        </a>

        {/* Mobile: hamburger */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button
              type="button"
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-full text-foreground hover:bg-secondary transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="!w-full max-w-none sm:max-w-none !h-[100dvh] pt-0 flex flex-col gap-0 [&>:first-child]:mt-[116px]">
            <div className="flex flex-col gap-0 flex-1 min-h-0">
              {navLinks.map(({ to, label }) =>
                to.startsWith("#") ? (
                  <a
                    key={label}
                    href={to}
                    className={cn(baseClass, "rounded-[4px] text-[48px] text-center whitespace-normal break-words", inactiveClass)}
                    onClick={() => setOpen(false)}
                  >
                    {label}
                  </a>
                ) : (
                  <NavLink
                    key={label}
                    to={to}
                    end={to === "/"}
                    className={({ isActive }) => cn(baseClass, "rounded-[4px] text-[48px] text-center whitespace-normal break-words", isActive ? activeClass : inactiveClass)}
                    onClick={() => setOpen(false)}
                  >
                    <HoverGlitchText text={label} className="inline-block" />
                  </NavLink>
                )
              )}
            </div>
            <a
              href="https://cal.com/rifki-firdaus-yxboki"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(baseClass, "rounded-[4px] text-[16px] h-[40px] py-0 text-center whitespace-normal break-words bg-primary text-black border-primary hover:bg-primary/90 mt-auto inline-flex items-center justify-center")}
              onClick={() => setOpen(false)}
            >
              <HoverGlitchText text="Let's talk!" />
            </a>
          </SheetContent>
        </Sheet>
      </nav>
    </>
  );
};

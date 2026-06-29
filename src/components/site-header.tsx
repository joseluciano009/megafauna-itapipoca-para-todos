import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Menu, X, Bone, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Início" },
  { to: "/megafauna", label: "Megafauna" },
  { to: "/museu", label: "Museu Virtual" },
  { to: "/pesquisas", label: "Pesquisas" },
  { to: "/pesquisadores", label: "Pesquisadores" },
  { to: "/biblioteca", label: "Biblioteca" },
  { to: "/referencias", label: "Referências" },
  { to: "/mapa", label: "Mapa" },
  { to: "/contato", label: "Contato" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dark, setDark] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const isDark = stored === "dark";
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-background/85 backdrop-blur-md border-b border-border shadow-sm"
          : "bg-transparent",
      )}
    >
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 group" onClick={() => setOpen(false)}>
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-deep text-deep-foreground group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
            <Bone className="h-5 w-5" />
          </span>
          <span className="font-display font-bold text-deep leading-tight text-sm sm:text-base">
            Portal Megafauna
            <span className="block text-[10px] sm:text-xs font-medium text-accent uppercase tracking-widest">
              Democrática
            </span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {NAV.map((item) => {
            const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  active
                    ? "text-primary bg-muted"
                    : "text-foreground/80 hover:text-primary hover:bg-muted",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            aria-label="Alternar tema"
            className="grid h-9 w-9 place-items-center rounded-md hover:bg-muted transition-colors text-foreground"
          >
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button
            className="lg:hidden grid h-9 w-9 place-items-center rounded-md hover:bg-muted transition-colors text-foreground"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border bg-background/95 backdrop-blur-md animate-fade-in">
          <nav className="container-page py-3 flex flex-col">
            {NAV.map((item) => {
              const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "px-3 py-3 text-sm font-medium rounded-md transition-colors",
                    active
                      ? "text-primary bg-muted"
                      : "text-foreground/80 hover:text-primary hover:bg-muted",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
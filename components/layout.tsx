"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  PenLine,
  Book,
  Search,
} from "lucide-react";
import { useState, useEffect } from "react";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/";
  const isCompose = pathname === "/compose";
  const isLibrary = pathname.startsWith("/library");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/library?to=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <header className="w-full bg-surface/85 backdrop-blur-md border-b border-outline-variant/15 sticky top-0 z-40 transition-all duration-700">
      <div className="flex justify-between items-center w-full px-6 py-4 md:py-5 max-w-4xl mx-auto h-16 sm:h-20">
        {isSearchOpen ? (
          /* Mobile Active Search Header */
          <form onSubmit={handleSearch} className="flex items-center gap-3 w-full md:hidden animate-in fade-in slide-in-from-right-3 duration-300">
            <div className="relative flex-grow flex items-center group shadow-[0_2px_8px_rgba(0,0,0,0.002)]">
              <Search className="absolute left-3.5 text-on-surface-variant/40 group-focus-within:text-tertiary transition-colors" size={14} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari pesan, penerima, pengirim..."
                className="w-full bg-surface-container-low/60 border border-outline-variant/25 pl-9 pr-3 py-2 rounded-full text-xs font-sans focus:outline-none focus:border-tertiary focus:ring-4 focus:ring-tertiary/5 text-on-surface placeholder:text-on-surface-variant/35"
                autoFocus
              />
            </div>
            <button
              type="button"
              onClick={() => { setIsSearchOpen(false); setSearchQuery(""); }}
              className="text-xs font-sans font-bold text-on-surface-variant/80 hover:text-on-surface shrink-0 cursor-pointer"
            >
              Batal
            </button>
          </form>
        ) : (
          /* Normal State logo & desktop nav */
          <>
            <Link href="/">
              <h1 className="text-xl md:text-2xl font-cormorant font-light italic tracking-wide text-on-surface cursor-pointer">
                SendHeartHaven
              </h1>
            </Link>
            <div className="flex items-center gap-4">
              <button type="button" onClick={() => setIsSearchOpen(true)} className="md:hidden text-on-surface-variant hover:text-on-surface transition-colors">
                <Search size={18} />
              </button>
              <nav className="hidden md:flex gap-8 items-center">
                <Link href="/">
                  <span
                    className={`font-sans text-xs tracking-widest uppercase transition-colors cursor-pointer ${isHome ? "text-on-surface border-b border-on-surface pb-1" : "text-on-surface-variant hover:text-on-surface"}`}
                  >
                    Browse
                  </span>
                </Link>
                <Link href="/compose">
                  <span
                    className={`font-sans text-xs tracking-widest uppercase transition-colors cursor-pointer ${isCompose ? "text-on-surface border-b border-on-surface pb-1" : "text-on-surface-variant hover:text-on-surface"}`}
                  >
                    Compose
                  </span>
                </Link>
                <Link href="/library">
                  <span
                    className={`font-sans text-xs tracking-widest uppercase transition-colors cursor-pointer ${isLibrary ? "text-on-surface border-b border-on-surface pb-1" : "text-on-surface-variant hover:text-on-surface"}`}
                  >
                    Library
                  </span>
                </Link>
                <form onSubmit={handleSearch} className="relative flex items-center ml-2 group shadow-[0_2px_10px_rgba(0,0,0,0.005)] rounded-full">
                  <Search className="absolute left-3 text-on-surface-variant/40 group-focus-within:text-tertiary transition-colors" size={13} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari penerima pesan..."
                    className="bg-surface-container-low/30 hover:bg-surface-container-low/55 focus:bg-surface border border-outline-variant/20 focus:border-tertiary/60 focus:ring-4 focus:ring-tertiary/5 pl-8 pr-3 py-1.5 text-[11px] font-sans transition-all outline-none rounded-full placeholder:text-on-surface-variant/35 w-36 focus:w-48 text-on-surface"
                  />
                </form>
              </nav>
            </div>
          </>
        )}
      </div>
    </header>
  );
}

function FooterParticles() {
  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 8 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 2 + 1,
      duration: Math.random() * 14 + 10,
      delay: Math.random() * -10,
      xMove: Math.random() * 20 - 10,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute bg-tertiary/10 rounded-full blur-[0.5px] dark:bg-tertiary/20"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
          }}
          animate={{
            y: [0, -60],
            x: [0, p.xMove],
            opacity: [0, 0.4, 0.4, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: p.delay,
          }}
        />
      ))}
    </div>
  );
}

export function Footer() {
  return (
    <footer className="w-full relative py-24 border-t border-outline-variant/10 bg-surface mt-auto overflow-hidden flex flex-col items-center justify-center text-center pb-36 md:pb-28">
      {/* Soft Vignette edges */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-tertiary/[0.015] pointer-events-none" />

      {/* Soft atmospheric background glow behind the logo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-tertiary/5 rounded-full blur-[70px] pointer-events-none -z-10" />

      {/* Floating dust particles */}
      <FooterParticles />

      {/* Editorial scroll reveal container */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] as any }}
        className="flex flex-col items-center max-w-xl gap-8 relative z-10 px-6 w-full"
      >
        {/* Brand logo/title */}
        <Link href="/">
          <h2 className="text-3xl sm:text-4xl text-on-surface font-cormorant font-light tracking-wide italic antialiased hover:opacity-90 transition-opacity cursor-pointer">
            SendHeartHaven
          </h2>
        </Link>

        {/* Minimal Underlined Navigation Links */}
        <nav className="flex gap-10 items-center justify-center font-sans text-[10px] sm:text-xs uppercase tracking-[0.25em] text-on-surface-variant/80">
          <Link href="/library" className="relative group cursor-pointer">
            <span>Archive</span>
            <span className="absolute bottom-[-4px] left-0 w-full h-[1px] bg-outline-variant/40 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
          </Link>
          <Link href="/compose" className="relative group cursor-pointer">
            <span>Write</span>
            <span className="absolute bottom-[-4px] left-0 w-full h-[1px] bg-outline-variant/40 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
          </Link>
          <Link href="/" className="relative group cursor-pointer">
            <span>Explore</span>
            <span className="absolute bottom-[-4px] left-0 w-full h-[1px] bg-outline-variant/40 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
          </Link>
        </nav>

        {/* Poetic Tagline */}
        <p className="font-cormorant italic text-sm sm:text-base text-on-surface-variant/75 max-w-xs sm:max-w-sm leading-relaxed tracking-wide mt-1">
          “A quiet place for words that stay.”
        </p>

        {/* Monochrome Elegant Social Icons */}
        <div className="flex gap-6 items-center justify-center mt-1">
          {/* Instagram */}
          <motion.a
            href="#"
            whileHover={{ scale: 1.1, color: "var(--color-tertiary)" }}
            whileTap={{ scale: 0.95 }}
            className="text-on-surface-variant/60 hover:text-on-surface transition-colors cursor-pointer"
          >
            <svg className="w-[17px] h-[17px] fill-none stroke-current" strokeWidth="1.5" viewBox="0 0 24 24">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
          </motion.a>

          {/* Pinterest */}
          <motion.a
            href="#"
            whileHover={{ scale: 1.1, color: "var(--color-tertiary)" }}
            whileTap={{ scale: 0.95 }}
            className="text-on-surface-variant/60 hover:text-on-surface transition-colors cursor-pointer"
          >
            <svg className="w-[17px] h-[17px] fill-current" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.08 3.16 9.4 7.63 11.16-.1-.95-.2-2.4.04-3.43.22-.93 1.4-5.93 1.4-5.93s-.36-.72-.36-1.77c0-1.66.96-2.9 2.17-2.9 1.02 0 1.51.77 1.51 1.69 0 1.03-.66 2.56-1 3.98-.28 1.19.6 2.16 1.77 2.16 2.12 0 3.76-2.24 3.76-5.48 0-2.86-2.06-4.86-5-4.86-3.4 0-5.4 2.55-5.4 5.2 0 1.03.4 2.14.9 2.74.1.12.11.23.08.35-.1.38-.3.9-.34 1.05-.05.21-.18.25-.4.15-1.48-.69-2.4-2.86-2.4-4.6 0-3.75 2.73-7.2 7.86-7.2 4.13 0 7.34 2.94 7.34 6.88 0 4.1-2.58 7.4-6.17 7.4-1.2 0-2.34-.63-2.73-1.37 0 0-.6 2.27-.74 2.82-.27 1.04-1 2.35-1.5 3.16C9.9 23.84 10.94 24 12 24c6.63 0 12-5.37 12-12S18.63 0 12 0z" />
            </svg>
          </motion.a>
        </div>

        {/* Copyright Text */}
        <p className="font-cormorant text-xs italic text-on-surface-variant/65 tracking-wide mt-4 border-t border-outline-variant/10 pt-6 w-full">
          © 2026 SendHeartHaven. Devoted to the art of the written word.
        </p>
      </motion.div>
    </footer>
  );
}

export function BottomNav() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isCompose = pathname === "/compose";
  const isLibrary = pathname.startsWith("/library");

  const navItems = [
    { href: "/", label: "Home", active: isHome, icon: Home },
    { href: "/compose", label: "Write", active: isCompose, icon: PenLine },
    { href: "/library", label: "Library", active: isLibrary, icon: Book },
  ];

  return (
    <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[88%] max-w-sm z-50">
      <nav className="flex justify-around items-center h-16 px-2 bg-surface/85 backdrop-blur-xl border border-outline-variant/30 rounded-full shadow-[0_12px_36px_rgba(0,0,0,0.06)] relative overflow-hidden transition-colors duration-700">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} className="relative z-10 flex-1 flex flex-col items-center justify-center h-full cursor-pointer group">
              <div className="relative flex flex-col items-center justify-center w-full">
                {/* Active Soft Glow Bubble behind Icon */}
                {item.active && (
                  <motion.div
                    layoutId="activeTabBubble"
                    className="absolute inset-x-3 -inset-y-1 bg-tertiary/10 rounded-full -z-10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon
                  size={18}
                  className={`transition-all duration-300 ${item.active
                      ? "text-tertiary scale-110"
                      : "text-on-surface-variant/70 group-hover:text-on-surface"
                    }`}
                  fill={item.active && item.icon !== PenLine ? "currentColor" : "none"}
                  strokeWidth={item.active ? 2.2 : 1.8}
                />
                <span
                  className={`text-[8px] uppercase tracking-[0.2em] font-sans mt-1 transition-colors duration-300 ${item.active
                      ? "text-tertiary font-bold"
                      : "text-on-surface-variant/60 group-hover:text-on-surface-variant"
                    }`}
                >
                  {item.label}
                </span>
              </div>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export function MessageCard({
  content,
  author,
  date,
  className = "",
}: {
  content: string;
  author: string;
  date: string;
  className?: string;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`bg-surface-container-low p-8 rounded-sm relative overflow-hidden group border border-tertiary/10 ${className}`}
    >
      <div className="flex flex-col gap-4">
        <p className="font-serif text-lg text-on-surface italic leading-relaxed">
          "{content}"
        </p>
        <div className="mt-4 flex justify-between items-center">
          <span className="font-sans text-[11px] uppercase tracking-wider text-on-surface-variant font-medium">
            Dari: {author}
          </span>
          <span className="font-sans text-[11px] uppercase tracking-wider text-tertiary font-medium">
            {date}
          </span>
        </div>
      </div>
    </motion.article>
  );
}

export function SakuraBackground() {
  const [petals, setPetals] = useState<any[]>([]);

  useEffect(() => {
    // Generate petals only on client to prevent hydration mismatch
    const newPetals = Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      scale: Math.random() * 0.6 + 0.4,
      rotation: Math.random() * 360,
      duration: Math.random() * 15 + 15,
      delay: Math.random() * -20, // Negative delay so they start immediately at different points
      xDrift: Math.random() * 30 - 15,
    }));
    setPetals(newPetals);
  }, []);

  if (petals.length === 0) return null;

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-[5]">
      {petals.map((petal) => (
        <motion.div
          key={petal.id}
          className="absolute w-3 h-4 bg-rose-200/60 blur-[3px]"
          style={{
            left: `${petal.left}vw`,
            top: `-5vh`,
            borderTopLeftRadius: "50%",
            borderTopRightRadius: "0%",
            borderBottomRightRadius: "50%",
            borderBottomLeftRadius: "50%",
            transformOrigin: "bottom center",
          }}
          animate={{
            y: ["0vh", "110vh"],
            x: [`0vw`, `${petal.xDrift}vw`],
            rotate: [petal.rotation, petal.rotation + 360],
          }}
          transition={{
            duration: petal.duration,
            repeat: Infinity,
            ease: "linear",
            delay: petal.delay,
          }}
        />
      ))}
    </div>
  );
}

export function FirefliesBackground() {
  const [fireflies, setFireflies] = useState<any[]>([]);

  useEffect(() => {
    const newFireflies = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 3 + 2,
      duration: Math.random() * 5 + 3,
      delay: Math.random() * -10,
      xMove: Math.random() * 20 - 10,
      yMove: Math.random() * 20 - 10,
    }));
    setFireflies(newFireflies);
  }, []);

  if (fireflies.length === 0) return null;

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-[5]">
      {fireflies.map((fly) => (
        <motion.div
          key={fly.id}
          className="absolute bg-yellow-200/80 rounded-full blur-[1px]"
          style={{
            left: `${fly.left}vw`,
            top: `${fly.top}vh`,
            width: `${fly.size}px`,
            height: `${fly.size}px`,
            boxShadow: `0 0 ${fly.size * 2}px ${fly.size / 2}px rgba(253, 224, 71, 0.6)`
          }}
          animate={{
            x: [0, fly.xMove, 0],
            y: [0, fly.yMove, 0],
            opacity: [0.2, 1, 0.2]
          }}
          transition={{
            duration: fly.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: fly.delay,
          }}
        />
      ))}
    </div>
  );
}

export function RainBackground() {
  const [drops, setDrops] = useState<any[]>([]);

  useEffect(() => {
    const newDrops = Array.from({ length: 150 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      height: Math.random() * 30 + 20,
      duration: Math.random() * 0.4 + 0.4,
      delay: Math.random() * -2,
      opacity: Math.random() * 0.5 + 0.4,
    }));
    setDrops(newDrops);
  }, []);

  if (drops.length === 0) return null;

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-[5]">
      {drops.map((drop) => (
        <motion.div
          key={drop.id}
          className="absolute w-[2px] bg-gradient-to-b from-transparent to-white rounded-full"
          style={{
            left: `${drop.left}vw`,
            top: `-5vh`,
            height: `${drop.height}px`,
            opacity: drop.opacity,
          }}
          animate={{
            y: ["0vh", "105vh"],
          }}
          transition={{
            duration: drop.duration,
            repeat: Infinity,
            ease: "linear",
            delay: drop.delay,
          }}
        />
      ))}
    </div>
  );
}

export function DynamicEnvironment() {
  const [theme, setTheme] = useState<'day' | 'night'>('day');
  const [weather, setWeather] = useState<'clear' | 'rain' | 'cloudy'>('clear');

  useEffect(() => {
    // 1. Determine time
    const hour = new Date().getHours();
    //hour >= 18 || hour < 6
    const isNight = hour >= 18 || hour < 6;
    setTheme(isNight ? 'night' : 'day');

    //devtest cuaca
    // setWeather('rain');
    // return;

    // 2. Fetch Weather via Geolocation + Open-Meteo
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            console.log("logo location", latitude, longitude);
            const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
            const data = await res.json();
            if (data.current_weather) {
              const code = data.current_weather.weathercode;
              // Open-Meteo WMO Weather interpretation codes
              const rainCodes = [51, 53, 55, 61, 63, 65, 80, 81, 82, 95, 96, 99];
              const cloudCodes = [2, 3];

              if (rainCodes.includes(code)) {
                setWeather('rain');
              } else if (cloudCodes.includes(code)) {
                setWeather('cloudy');
              } else {
                setWeather('clear');
              }
            }
          } catch (e) {
            console.error("Failed to fetch weather", e);
          }
        },
        (error) => {
          console.log("Geolocation denied or failed, using default clear weather.", error);
        }
      );
    }
  }, []);

  // 3. Apply body classes
  useEffect(() => {
    if (theme === 'night') {
      document.body.classList.add('theme-night');
    } else {
      document.body.classList.remove('theme-night');
    }

    if (weather === 'rain' || weather === 'cloudy') {
      document.body.classList.add('theme-rain');
    } else {
      document.body.classList.remove('theme-rain');
    }

    return () => {
      document.body.classList.remove('theme-night', 'theme-rain');
    };
  }, [theme, weather]);

  return (
    <>
      {weather === 'rain' ? (
        <RainBackground />
      ) : theme === 'night' ? (
        <FirefliesBackground />
      ) : (
        <SakuraBackground />
      )}
    </>
  );
}

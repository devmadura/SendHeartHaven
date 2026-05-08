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
    <header className="w-full bg-surface border-b border-outline-variant sticky top-0 z-40 transition-colors duration-700">
      <div className="flex justify-between items-center w-full px-6 py-8 max-w-4xl mx-auto">
        <Link href="/">
          <h1 className="text-2xl font-serif italic text-on-surface cursor-pointer">
            SendHeartHaven
          </h1>
        </Link>
        <div className="flex items-center gap-4">
          <button type="button" onClick={() => setIsSearchOpen(!isSearchOpen)} className="md:hidden text-on-surface-variant hover:text-on-surface transition-colors">
            <Search size={20} />
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
            <form onSubmit={handleSearch} className="relative flex items-center ml-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari penerima..."
                className={`transition-all duration-300 bg-transparent border-0 border-b border-outline focus:ring-0 focus:border-on-surface outline-none text-sm font-serif italic ${isSearchOpen ? 'w-48 opacity-100 px-2' : 'w-0 opacity-0 px-0'}`}
              />
              <button type="button" onClick={() => { if (isSearchOpen && searchQuery) handleSearch(new Event('submit') as any); else setIsSearchOpen(!isSearchOpen); }} className="text-on-surface-variant hover:text-on-surface transition-colors ml-2">
                <Search size={16} />
              </button>
            </form>
          </nav>
        </div>
      </div>

      {isSearchOpen && (
        <div className="md:hidden absolute top-full left-0 w-full p-4 bg-surface/95 backdrop-blur-md border-b border-outline-variant z-40 shadow-sm animate-in slide-in-from-top-2 fade-in">
          <form onSubmit={handleSearch} className="flex gap-2 w-full max-w-sm mx-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Cari nama penerima..."
              className="flex-grow bg-surface-container border border-outline px-4 py-3 rounded-full text-sm font-serif italic focus:outline-none focus:border-outline-variant shadow-sm"
              autoFocus
            />
            <button type="submit" className="bg-on-surface text-surface px-5 py-2 rounded-full text-xs font-sans tracking-wider uppercase hover:opacity-80 transition-opacity">
              Cari
            </button>
          </form>
        </div>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="w-full py-24 border-t border-outline-variant bg-surface transition-colors duration-700 flex flex-col items-center justify-center space-y-6 text-center mt-auto pb-32 md:pb-24">
      <div className="font-serif text-lg text-on-surface-variant">SendHeartHaven</div>
      <nav className="flex gap-6">
        <a
          className="text-on-surface-variant hover:text-on-surface underline font-serif text-sm italic"
          href="#"
        >
          Archives
        </a>
        <a
          className="text-on-surface-variant hover:text-on-surface underline font-serif text-sm italic"
          href="#"
        >
          Journal
        </a>
        <a
          className="text-on-surface-variant hover:text-on-surface underline font-serif text-sm italic"
          href="#"
        >
          Etiquette
        </a>
      </nav>
      <p className="font-serif text-sm italic text-on-surface-variant">
        © SendHeartHaven. Devoted to the art of the written word.
      </p>
    </footer>
  );
}

export function BottomNav() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isCompose = pathname === "/compose";
  const isLibrary = pathname.startsWith("/library");

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-20 pb-safe px-4 bg-surface/90 backdrop-blur-sm border-t border-outline-variant transition-colors duration-700">
      <Link href="/">
        <div
          className={`flex flex-col items-center justify-center cursor-pointer ${isHome ? "text-on-surface" : "text-on-surface-variant"}`}
        >
          <Home size={24} fill={isHome ? "currentColor" : "none"} />
          <span className="text-[10px] uppercase tracking-widest font-serif mt-1">
            Home
          </span>
        </div>
      </Link>
      <Link href="/compose">
        <div
          className={`flex flex-col items-center justify-center cursor-pointer ${isCompose ? "text-on-surface" : "text-on-surface-variant"}`}
        >
          <PenLine size={24} />
          <span className="text-[10px] uppercase tracking-widest font-serif mt-1">
            Write
          </span>
        </div>
      </Link>
      <Link href="/library">
        <div
          className={`flex flex-col items-center justify-center cursor-pointer ${isLibrary ? "text-on-surface" : "text-on-surface-variant"}`}
        >
          <Book size={24} fill={isLibrary ? "currentColor" : "none"} />
          <span className="text-[10px] uppercase tracking-widest font-serif mt-1">
            Library
          </span>
        </div>
      </Link>
    </nav>
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

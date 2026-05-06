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
    <header className="w-full bg-[#FDFBF7] border-b border-stone-200 sticky top-0 z-40">
      <div className="flex justify-between items-center w-full px-6 py-8 max-w-4xl mx-auto">
        <Link href="/">
          <h1 className="text-2xl font-serif italic text-stone-900 cursor-pointer">
            SendHeartHaven
          </h1>
        </Link>
        <div className="flex items-center gap-4">
          <button type="button" onClick={() => setIsSearchOpen(!isSearchOpen)} className="md:hidden text-stone-400 hover:text-stone-600 transition-colors">
            <Search size={20} />
          </button>
          <nav className="hidden md:flex gap-8 items-center">
          <Link href="/">
            <span
              className={`font-sans text-xs tracking-widest uppercase transition-colors cursor-pointer ${isHome ? "text-stone-900 border-b border-stone-900 pb-1" : "text-stone-400 hover:text-stone-600"}`}
            >
              Browse
            </span>
          </Link>
          <Link href="/compose">
            <span
              className={`font-sans text-xs tracking-widest uppercase transition-colors cursor-pointer ${isCompose ? "text-stone-900 border-b border-stone-900 pb-1" : "text-stone-400 hover:text-stone-600"}`}
            >
              Compose
            </span>
          </Link>
          <Link href="/library">
            <span
              className={`font-sans text-xs tracking-widest uppercase transition-colors cursor-pointer ${isLibrary ? "text-stone-900 border-b border-stone-900 pb-1" : "text-stone-400 hover:text-stone-600"}`}
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
              className={`transition-all duration-300 bg-transparent border-0 border-b border-stone-300 focus:ring-0 focus:border-stone-800 outline-none text-sm font-serif italic ${isSearchOpen ? 'w-48 opacity-100 px-2' : 'w-0 opacity-0 px-0'}`} 
            />
            <button type="button" onClick={() => { if(isSearchOpen && searchQuery) handleSearch(new Event('submit') as any); else setIsSearchOpen(!isSearchOpen); }} className="text-stone-400 hover:text-stone-600 transition-colors ml-2">
              <Search size={16} />
            </button>
          </form>
        </nav>
        </div>
      </div>

      {isSearchOpen && (
        <div className="md:hidden absolute top-full left-0 w-full p-4 bg-[#FDFBF7]/95 backdrop-blur-md border-b border-stone-200 z-40 shadow-sm animate-in slide-in-from-top-2 fade-in">
          <form onSubmit={handleSearch} className="flex gap-2 w-full max-w-sm mx-auto">
            <input 
              type="text" 
              value={searchQuery} 
              onChange={e => setSearchQuery(e.target.value)} 
              placeholder="Cari nama penerima..." 
              className="flex-grow bg-white border border-stone-200 px-4 py-3 rounded-full text-sm font-serif italic focus:outline-none focus:border-stone-400 shadow-sm" 
              autoFocus 
            />
            <button type="submit" className="bg-stone-800 text-white px-5 py-2 rounded-full text-xs font-sans tracking-wider uppercase hover:bg-stone-900 transition-colors">
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
    <footer className="w-full py-24 border-t border-stone-100 bg-[#FDFBF7] flex flex-col items-center justify-center space-y-6 text-center mt-auto pb-32 md:pb-24">
      <div className="font-serif text-lg text-stone-500">SendHeartHaven</div>
      <nav className="flex gap-6">
        <a
          className="text-stone-500 hover:text-stone-900 underline font-serif text-sm italic"
          href="#"
        >
          Archives
        </a>
        <a
          className="text-stone-500 hover:text-stone-900 underline font-serif text-sm italic"
          href="#"
        >
          Journal
        </a>
        <a
          className="text-stone-500 hover:text-stone-900 underline font-serif text-sm italic"
          href="#"
        >
          Etiquette
        </a>
      </nav>
      <p className="font-serif text-sm italic text-stone-500">
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
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-20 pb-safe px-4 bg-[#FDFBF7]/90 backdrop-blur-sm border-t border-stone-200">
      <Link href="/">
        <div
          className={`flex flex-col items-center justify-center cursor-pointer ${isHome ? "text-stone-900" : "text-stone-400"}`}
        >
          <Home size={24} fill={isHome ? "currentColor" : "none"} />
          <span className="text-[10px] uppercase tracking-widest font-serif mt-1">
            Home
          </span>
        </div>
      </Link>
      <Link href="/compose">
        <div
          className={`flex flex-col items-center justify-center cursor-pointer ${isCompose ? "text-stone-900" : "text-stone-400"}`}
        >
          <PenLine size={24} />
          <span className="text-[10px] uppercase tracking-widest font-serif mt-1">
            Write
          </span>
        </div>
      </Link>
      <Link href="/library">
        <div
          className={`flex flex-col items-center justify-center cursor-pointer ${isLibrary ? "text-stone-900" : "text-stone-400"}`}
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

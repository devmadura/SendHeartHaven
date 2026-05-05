"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  PenLine,
  Book,
} from "lucide-react";

export function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isCompose = pathname === "/compose";
  const isLibrary = pathname.startsWith("/library");

  return (
    <header className="w-full bg-[#FDFBF7] border-b border-stone-200 sticky top-0 z-40">
      <div className="flex justify-between items-center w-full px-6 py-8 max-w-4xl mx-auto">
        <Link href="/">
          <h1 className="text-2xl font-serif italic text-stone-900 cursor-pointer">
            SendHeartHaven
          </h1>
        </Link>
        <nav className="hidden md:flex gap-8">
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
        </nav>
      </div>
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

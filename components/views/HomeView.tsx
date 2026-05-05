"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import Link from "next/link";
import { Search } from "lucide-react";
import { MessageCard } from "@/components/layout";
import { MessageData } from "@/lib/data";

export function HomeView({ messages }: { messages: MessageData[] }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/library?to=${encodeURIComponent(searchQuery)}`);
    }
  };
  return (
    <div className="w-full max-w-4xl px-6 pb-32 pt-16 mx-auto flex flex-col gap-32 relative">
      {/* Decorative Rose Background */}
      <div
        className="absolute top-0 right-0 -mr-20 -mt-10 opacity-80 pointer-events-none w-64 h-64 grayscale-[0.2] transition-opacity duration-1000 hidden md:block"
        style={{
          backgroundImage:
            "url('bunga.png')",
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Hero Section */}
      <section className="flex flex-col items-center text-center max-w-2xl mx-auto gap-8 pt-12 relative z-10">
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-5xl md:text-6xl text-on-surface font-normal tracking-tight"
        >
          Where Hearts Find Comfort, One Send at a Time
        </motion.h2>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-lg md:text-xl text-on-surface-variant max-w-lg leading-relaxed italic"
        >
          Sebuah ruang sunyi untuk berbagi pesan-pesan dari hati. Tulis, simpan,
          dan rasakan beratnya setiap makna di balik susunan aksara.
        </motion.p>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="pt-6 w-full max-w-md"
        >
          <form onSubmit={handleSearch} className="relative flex items-center">
            <Search className="absolute left-4 text-stone-400" size={18} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari pesan untuk seseorang..." 
              className="w-full bg-white/50 backdrop-blur-sm border border-tertiary/20 focus:border-tertiary focus:ring-0 pl-12 pr-4 py-4 text-lg italic transition-all outline-none rounded-sm shadow-sm placeholder:text-stone-400"
            />
            <button type="submit" className="absolute right-2 bg-stone-900 text-white font-sans text-xs tracking-widest uppercase px-4 py-2 hover:bg-stone-700 transition-colors rounded-sm">
              Cari
            </button>
          </form>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="pt-4"
        >
          <Link href="/compose">
            <button className="font-sans text-xs font-semibold uppercase tracking-widest text-stone-500 border-b border-stone-300 pb-1 hover:text-stone-900 hover:border-stone-900 transition-all">
              Atau tulis pesan baru
            </button>
          </Link>
        </motion.div>
      </section>

      {/* Messages Section */}
      <section className="flex flex-col gap-12 w-full max-w-3xl mx-auto z-10">
        <div className="border-b border-tertiary/20 pb-4 text-center">
          <h3 className="font-sans text-xs font-medium text-tertiary tracking-[0.2em] uppercase">
            Pesan-Pesan Terbaru
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {messages.slice(0, 3).map((msg, idx) => (
            <Link href={`/library/${msg.id}`} key={msg.id} className={idx === 2 ? "md:col-span-2" : ""}>
              <div className="h-full cursor-pointer hover:shadow-sm transition-shadow">
                <MessageCard
                  content={msg.content}
                  author={msg.author}
                  date={msg.date}
                  className="h-full hover:border-tertiary/30 transition-colors"
                />
              </div>
            </Link>
          ))}
        </div>

        <div className="flex justify-center pt-8">
          <Link href="/library">
            <button className="font-sans text-sm font-semibold text-tertiary border-b border-tertiary pb-1 hover:text-on-surface hover:border-on-surface transition-colors">
              Baca Lebih Banyak
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}

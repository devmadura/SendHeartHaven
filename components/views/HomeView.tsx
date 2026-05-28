"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import Link from "next/link";
import { Search, Heart, Sparkles, Coffee, Moon, Feather } from "lucide-react";
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

  // Define mood card configurations
  const moods = [
    {
      name: "Romantic",
      label: "Kata-Kata Cinta & Kasih Sayang",
      icon: <Heart size={20} className="text-rose-400" />,
      glowColor: "rgba(244, 63, 94, 0.08)",
      hoverGlow: "shadow-[0_15px_40px_rgba(244,63,94,0.12)] border-rose-300/35",
      query: "romantic",
      bgColor: "rgba(251, 113, 133, 0.04)"
    },
    {
      name: "Nostalgic",
      label: "Kenangan & Masa Lalu",
      icon: <Sparkles size={20} className="text-amber-400" />,
      glowColor: "rgba(245, 158, 11, 0.08)",
      hoverGlow: "shadow-[0_15px_40px_rgba(245,158,11,0.12)] border-amber-300/35",
      query: "nostalgic",
      bgColor: "rgba(251, 191, 36, 0.04)"
    },
    {
      name: "Healing",
      label: "Penyejuk & Ketenangan",
      icon: <Coffee size={20} className="text-teal-400" />,
      glowColor: "rgba(20, 184, 166, 0.08)",
      hoverGlow: "shadow-[0_15px_40px_rgba(20,184,166,0.12)] border-teal-300/35",
      query: "healing",
      bgColor: "rgba(45, 212, 191, 0.04)"
    },
    {
      name: "Midnight",
      label: "Refleksi Sunyi Tengah Malam",
      icon: <Moon size={20} className="text-indigo-400" />,
      glowColor: "rgba(99, 102, 241, 0.08)",
      hoverGlow: "shadow-[0_15px_40px_rgba(99,102,241,0.12)] border-indigo-300/35",
      query: "midnight",
      bgColor: "rgba(129, 140, 248, 0.04)"
    },
    {
      name: "Soft",
      label: "Pesan Teduh & Hangat",
      icon: <Feather size={20} className="text-stone-400" />,
      glowColor: "rgba(120, 113, 108, 0.08)",
      hoverGlow: "shadow-[0_15px_40px_rgba(120,113,108,0.12)] border-stone-300/35",
      query: "soft",
      bgColor: "rgba(168, 162, 158, 0.04)"
    }
  ];

  // Motion animation parameters
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] as any }
    }
  };

  return (
    <div className="w-full relative flex flex-col gap-24 overflow-hidden">
      {/* Fullscreen Cinematic Hero */}
      <section className="relative w-full min-h-[92vh] flex flex-col justify-center items-center px-6 text-center select-none">
        
        {/* Soft Radial Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-96 bg-gradient-to-tr from-tertiary/5 via-primary/5 to-secondary/5 rounded-full blur-[140px] pointer-events-none -z-10" />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center max-w-3xl gap-8 relative z-10"
        >
          {/* Poetic flower mark */}
          <motion.img
            variants={itemVariants}
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuA4yoTfA0SrA3aLIOt_jkUdOqiYrhtFo6ma3qiMxqkGrCmRwhw4D7gy47CSS6DTBd585IScC9gjZPw9l1cMv9AYyRkR_7AdkH_-yJgE4uJrsGr6s2Dha0zBeZ1600e0QKnBtLlcumAp4X7vQJAFux2rf8nV3AleHL_LZ_3kgQ3qLv5LV_dnsLPjKpEsfsip60dRB0e8A8PwfOb4zIguNW0YwTGWxdBiNU_4Nu-BTyRcl0WflBzla-ASoe5sfiNSWefXRKaoRfpRNqg"
            className="w-14 h-14 object-cover grayscale opacity-50 botanical-blend"
            alt="Decorative flower"
          />

          {/* Immersive Title */}
          <motion.h2
            variants={itemVariants}
            className="text-[38px] sm:text-[46px] md:text-[56px] text-on-surface font-cormorant font-light tracking-tight leading-tight antialiased"
          >
            A quiet place for words that matter.
          </motion.h2>

          {/* Poetic description */}
          <motion.p
            variants={itemVariants}
            className="text-sm sm:text-base md:text-lg text-on-surface-variant/80 max-w-xl leading-relaxed font-cormorant italic tracking-wide"
          >
            Sebuah ruang sunyi untuk berbagi pesan-pesan dari hati. Tulis, simpan, dan rasakan beratnya setiap makna di balik susunan aksara.
          </motion.p>

          {/* Redesigned Search Input */}
          <motion.div
            variants={itemVariants}
            className="pt-6 w-full max-w-md px-2"
          >
            <form onSubmit={handleSearch} className="relative flex items-center group">
              <Search className="absolute left-4 text-on-surface-variant/60 group-focus-within:text-on-surface transition-colors" size={16} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari penerima pesan..."
                className="w-full bg-surface-container-low/40 backdrop-blur-md border border-outline/25 focus:border-tertiary focus:ring-2 focus:ring-tertiary/10 pl-11 pr-20 py-3.5 text-sm font-sans italic transition-all outline-none rounded-full placeholder:text-on-surface-variant/50"
              />
              <button 
                type="submit" 
                className="absolute right-2 bg-tertiary text-white font-sans text-[10px] tracking-widest uppercase px-4 py-2 hover:bg-on-surface transition-colors rounded-full shadow-sm cursor-pointer"
              >
                Cari
              </button>
            </form>
          </motion.div>

          {/* Minimal Elegant CTA button */}
          <motion.div
            variants={itemVariants}
            className="pt-6"
          >
            <Link href="/compose">
              <button className="font-sans text-[10px] font-semibold uppercase tracking-[0.25em] text-on-surface bg-surface-container-low/60 border border-outline/30 px-8 py-3 rounded-full hover:bg-on-surface hover:text-white hover:border-on-surface transition-all duration-300 shadow-sm cursor-pointer">
                Tulis Pesan Hati
              </button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Mood/Category Exploration Section */}
      <section className="w-full max-w-5xl px-6 py-16 mx-auto flex flex-col gap-12 relative z-10">
        <div className="flex flex-col items-center gap-2 text-center">
          <span className="font-sans text-[9px] uppercase tracking-[0.25em] text-outline-variant/80">
            Jelajahi Rasa
          </span>
          <h3 className="font-cormorant italic text-3xl md:text-4xl text-on-surface font-light">
            Telusuri Suasana Hati
          </h3>
          <div className="w-10 h-[1px] bg-outline-variant/40 mt-1" />
        </div>

        {/* Dynamic Mood Card Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 sm:gap-6">
          {moods.map((mood, idx) => (
            <motion.div
              key={mood.name}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.8 }}
              onClick={() => router.push(`/library?to=${encodeURIComponent(mood.query)}`)}
              style={{ backgroundColor: mood.bgColor }}
              className={`cursor-pointer floating-letter-card rounded-2xl p-5 flex flex-col justify-between items-center text-center gap-6 border border-outline-variant/20 hover:scale-[1.03] transition-all duration-500 min-h-[160px] group`}
            >
              <div className="p-3 rounded-full bg-surface/50 dark:bg-stone-900/50 shadow-sm group-hover:scale-110 transition-transform duration-300">
                {mood.icon}
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-sans font-bold text-xs uppercase tracking-wider text-on-surface">{mood.name}</span>
                <span className="font-serif italic text-[10px] text-on-surface-variant/75 leading-tight">{mood.label}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Recent Messages Section styled with the dreamy card design */}
      <section className="w-full max-w-4xl px-6 py-16 mx-auto flex flex-col gap-16 relative z-10 pb-32">
        <div className="flex flex-col items-center gap-2 text-center">
          <span className="font-sans text-[9px] uppercase tracking-[0.25em] text-outline-variant/80">
            Lembaran Baru
          </span>
          <h3 className="font-cormorant italic text-3xl md:text-4xl text-on-surface font-light">
            Pesan-Pesan Terbaru
          </h3>
          <div className="w-10 h-[1px] bg-outline-variant/40 mt-1" />
        </div>

        {/* Staggered Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {messages.slice(0, 3).map((msg, idx) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15, duration: 1 }}
              className={`${idx === 2 ? "md:col-span-2 md:w-[75%] md:mx-auto" : "col-span-1"}`}
            >
              <Link href={`/library/${msg.id}`} className="block h-full">
                <div className="floating-letter-card rounded-2xl p-6 sm:p-8 flex flex-col justify-between gap-6 hover:-translate-y-1.5 hover:shadow-[0_15px_30px_rgba(0,0,0,0.02)] transition-all duration-500 ease-out border border-outline-variant/20 h-full">
                  <div className="flex justify-between items-start w-full font-sans text-[9px] uppercase tracking-widest text-on-surface-variant/60 border-b border-outline-variant/20 pb-4">
                    <span className="flex items-center gap-2">
                      <span>To: {msg.to || "Seseorang"}</span>
                      {msg.mood && msg.mood !== "soft" && (
                        <span className={`px-2 py-0.5 rounded-full border text-[7px] font-bold tracking-wider ${
                          msg.mood === "romantic" ? "text-rose-400 border-rose-400/20 bg-rose-400/5" :
                          msg.mood === "nostalgic" ? "text-amber-400 border-amber-400/20 bg-amber-400/5" :
                          msg.mood === "midnight" ? "text-indigo-400 border-indigo-400/20 bg-indigo-400/5" :
                          msg.mood === "healing" ? "text-teal-400 border-teal-400/20 bg-teal-400/5" :
                          "text-stone-400 border-stone-400/20 bg-stone-400/5"
                        }`}>
                          {msg.mood}
                        </span>
                      )}
                    </span>
                    <span>{msg.date}</span>
                  </div>

                  <p className="font-cormorant font-light text-lg sm:text-xl text-on-surface leading-relaxed text-justify line-clamp-4 italic antialiased whitespace-pre-wrap">
                    "{msg.content}"
                  </p>

                  <div className="flex justify-between items-center w-full font-sans text-[9px] uppercase tracking-widest text-outline-variant border-t border-outline-variant/20 pt-4 mt-2">
                    <span>From: {msg.author}</span>
                    {msg.music && <span className="flex items-center gap-1 text-tertiary"><Moon size={10} className="animate-pulse" /> Music</span>}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* More messages button */}
        <div className="flex justify-center pt-8">
          <Link href="/library">
            <button className="font-sans text-[10px] font-semibold uppercase tracking-[0.25em] text-on-surface-variant border-b border-outline-variant/50 pb-1.5 hover:text-on-surface hover:border-on-surface transition-all duration-300 cursor-pointer">
              Baca Lebih Banyak
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}

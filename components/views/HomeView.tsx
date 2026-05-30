"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import Link from "next/link";
import { Search, Heart, Sparkles, Coffee, Moon, Feather } from "lucide-react";
import { MessageData } from "@/lib/data";

// Soft floating particles inside the hero background
function FloatingParticles() {
  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 3 + 1.5,
      duration: Math.random() * 15 + 12,
      delay: Math.random() * -10,
      xMove: Math.random() * 30 - 15,
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
            y: [0, -120],
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

export function HomeView({ messages }: { messages: MessageData[] }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/library?to=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Define redesigned mood categories
  const moods = [
    {
      name: "Romantic",
      label: "Surat Cinta & Kasih Sayang",
      icon: <Heart size={18} className="text-rose-400" />,
      query: "romantic",
      cardClass: "mood-card-romantic"
    },
    {
      name: "Nostalgic",
      label: "Lembaran Memori & Kenangan",
      icon: <Sparkles size={18} className="text-amber-400" />,
      query: "nostalgic",
      cardClass: "mood-card-nostalgic"
    },
    {
      name: "Healing",
      label: "Penenang Jiwa & Ketenangan",
      icon: <Coffee size={18} className="text-teal-400" />,
      query: "healing",
      cardClass: "mood-card-healing"
    },
    {
      name: "Midnight Thoughts",
      label: "Refleksi Sunyi Tengah Malam",
      icon: <Moon size={18} className="text-indigo-400" />,
      query: "midnight",
      cardClass: "mood-card-midnight"
    },
    {
      name: "Letters Never Sent",
      label: "Pesan Hati Yang Tak Terucap",
      icon: <Feather size={18} className="text-stone-400" />,
      query: "soft",
      cardClass: "mood-card-letters"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.18 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] as any }
    }
  };

  return (
    <div className="w-full relative flex flex-col gap-12 sm:gap-20 overflow-hidden">
      {/* Cinematic Hero */}
      <section className="relative w-full min-h-[85vh] sm:min-h-[90vh] flex flex-col justify-center items-center px-4 sm:px-6 py-12 text-center select-none overflow-hidden">

        {/* Glowing atmospheric lights */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-80 sm:h-96 bg-gradient-to-tr from-tertiary/5 via-primary/5 to-secondary/5 rounded-full blur-[120px] pointer-events-none -z-20 ambient-glowing-light" />

        {/* Floating background particles */}
        <FloatingParticles />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center max-w-2xl gap-6 sm:gap-8 relative z-10"
        >
          {/* Subtle flower logo */}
          <motion.img
            variants={itemVariants}
            src="/bunga.png"
            className="w-12 h-12 sm:w-14 sm:h-14 object-contain grayscale opacity-45 botanical-blend"
            alt="Decorative flower logo"
            onError={(e) => {
              // fallback if local file not fully matching
              e.currentTarget.src = "https://lh3.googleusercontent.com/aida-public/AB6AXuA4yoTfA0SrA3aLIOt_jkUdOqiYrhtFo6ma3qiMxqkGrCmRwhw4D7gy47CSS6DTBd585IScC9gjZPw9l1cMv9AYyRkR_7AdkH_-yJgE4uJrsGr6s2Dha0zBeZ1600e0QKnBtLlcumAp4X7vQJAFux2rf8nV3AleHL_LZ_3kgQ3qLv5LV_dnsLPjKpEsfsip60dRB0e8A8PwfOb4zIguNW0YwTGWxdBiNU_4Nu-BTyRcl0WflBzla-ASoe5sfiNSWefXRKaoRfpRNqg";
            }}
          />

          {/* Immersive poetic heading */}
          <motion.h2
            variants={itemVariants}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-on-surface font-cormorant font-light tracking-tight leading-[1.15] antialiased"
          >
            A quiet place for<br />
            <span className="italic">words that matter.</span>
          </motion.h2>

          {/* Supporting poetic narrative */}
          <motion.p
            variants={itemVariants}
            className="text-sm sm:text-base text-on-surface-variant/80 max-w-lg leading-relaxed font-cormorant italic tracking-wide px-4"
          >
            Sebuah ruang sunyi untuk berbagi pesan-pesan dari hati. Tulis, simpan, dan rasakan beratnya setiap makna di balik susunan aksara.
          </motion.p>

          {/* Modern search input */}
          <motion.div
            variants={itemVariants}
            className="pt-4 w-full max-w-md px-4 sm:px-0"
          >
            <form onSubmit={handleSearch} className="relative flex items-center group shadow-[0_4px_30px_rgba(0,0,0,0.015)] rounded-full">
              <Search className="absolute left-4 text-on-surface-variant/50 group-focus-within:text-tertiary transition-colors" size={16} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari penerima pesan..."
                className="w-full bg-surface/50 backdrop-blur-md border border-outline-variant/25 focus:border-tertiary focus:ring-4 focus:ring-tertiary/5 pl-11 pr-24 py-3 sm:py-3.5 text-xs sm:text-sm font-sans italic transition-all outline-none rounded-full placeholder:text-on-surface-variant/40 text-on-surface"
              />
              <button
                type="submit"
                className="absolute right-1.5 bg-tertiary hover:bg-tertiary/90 text-white font-sans text-[9px] sm:text-[10px] tracking-widest uppercase px-5 py-2 hover:bg-on-surface transition-all rounded-full shadow-sm cursor-pointer"
              >
                Cari
              </button>
            </form>
          </motion.div>

          {/* Redesigned glowing clay CTA button */}
          <motion.div
            variants={itemVariants}
            className="pt-4"
          >
            <Link href="/compose">
              <motion.button
                whileHover={{ scale: 1.03, boxShadow: "0 8px 24px rgba(113, 90, 72, 0.12)" }}
                whileTap={{ scale: 0.98 }}
                className="font-sans text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.25em] text-white bg-tertiary border border-tertiary/20 px-8 py-3.5 rounded-full hover:bg-tertiary/95 transition-all duration-300 shadow-[0_4px_18px_rgba(113,90,72,0.12)] cursor-pointer"
              >
                Tulis Pesan Hati
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Mood Categories Section */}
      <section className="w-full max-w-5xl px-4 sm:px-6 py-8 mx-auto flex flex-col gap-10 relative z-10">
        <div className="flex flex-col items-center gap-2 text-center">
          <span className="font-sans text-[8px] sm:text-[9px] uppercase tracking-[0.25em] text-outline-variant/80">
            Jelajahi Rasa
          </span>
          <h3 className="font-cormorant italic text-2xl sm:text-3xl md:text-4xl text-on-surface font-light">
            Telusuri Suasana Hati
          </h3>
          <div className="w-8 h-[1px] bg-outline-variant/40 mt-1" />
        </div>

        {/* Elegant Mood Card Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-5 gap-4 sm:gap-6">
          {moods.map((mood, idx) => (
            <motion.div
              key={mood.name}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08, duration: 0.8 }}
              onClick={() => router.push(`/library?to=${encodeURIComponent(mood.query)}`)}
              className={`cursor-pointer mood-card-bg ${mood.cardClass} rounded-[20px] sm:rounded-[24px] p-5 flex flex-col justify-between items-center text-center gap-6 border border-outline-variant/10 shadow-[0_4px_25px_rgba(0,0,0,0.015)] hover:scale-[1.03] hover:shadow-[0_12px_30px_rgba(113,90,72,0.06)] hover:border-tertiary/10 transition-all duration-500 min-h-[170px] sm:min-h-[190px] group`}
            >
              <div className="p-2.5 sm:p-3 rounded-full bg-surface/80 dark:bg-stone-900/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-outline-variant/10 group-hover:scale-110 transition-transform duration-300 flex items-center justify-center">
                {mood.icon}
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="font-sans font-bold text-[10px] sm:text-xs uppercase tracking-widest text-on-surface">{mood.name}</span>
                <span className="font-serif italic text-[9px] sm:text-[10px] text-on-surface-variant/75 leading-normal">{mood.label}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Recent Messages Section */}
      <section className="w-full max-w-4xl px-4 sm:px-6 py-8 mx-auto flex flex-col gap-12 sm:gap-16 relative z-10 pb-28 sm:pb-36">
        <div className="flex flex-col items-center gap-2 text-center">
          <span className="font-sans text-[8px] sm:text-[9px] uppercase tracking-[0.25em] text-outline-variant/80">
            Lembaran Baru
          </span>
          <h3 className="font-cormorant italic text-2xl sm:text-3xl md:text-4xl text-on-surface font-light">
            Pesan-Pesan Terbaru
          </h3>
          <div className="w-8 h-[1px] bg-outline-variant/40 mt-1" />
        </div>

        {/* Dreamy Message Card List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-10">
          {messages.slice(0, 3).map((msg, idx) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.12, duration: 1 }}
              className={`${idx === 2 ? "md:col-span-2 md:w-[75%] md:mx-auto" : "col-span-1"}`}
            >
              <Link href={`/library/${msg.id}`} className="block h-full">
                <div className="floating-letter-card rounded-[22px] sm:rounded-[28px] p-6 sm:p-8 flex flex-col justify-between gap-6 hover:-translate-y-1.5 hover:shadow-[0_12px_28px_rgba(0,0,0,0.02)] transition-all duration-500 ease-out border border-outline-variant/15 h-full">
                  <div className="flex justify-between items-start w-full font-sans text-[8px] sm:text-[9px] uppercase tracking-widest text-on-surface-variant/60 border-b border-outline-variant/15 pb-4">
                    <span className="flex items-center gap-2">
                      <span>To: {msg.to || "Seseorang"}</span>
                      {msg.mood && msg.mood !== "soft" && (
                        <span className={`px-2 py-0.5 rounded-full border text-[7px] font-bold tracking-wider ${msg.mood === "romantic" ? "text-rose-400 border-rose-400/20 bg-rose-400/5" :
                            msg.mood === "nostalgic" ? "text-amber-400 border-amber-400/20 bg-amber-400/5" :
                              msg.mood === "midnight" ? "text-indigo-400 border-indigo-400/20 bg-indigo-400/5" :
                                msg.mood === "healing" ? "text-teal-400 border-teal-400/20 bg-teal-400/5" :
                                  msg.mood === "letters-never-sent" ? "text-stone-500 border-stone-500/20 bg-stone-500/5" :
                                    "text-stone-400 border-stone-400/20 bg-stone-400/5"
                          }`}>
                          {msg.mood === "letters-never-sent" ? "letters" : msg.mood}
                        </span>
                      )}
                    </span>
                    <span>{msg.date}</span>
                  </div>

                  <p className="font-cormorant font-light text-[17px] sm:text-xl text-on-surface leading-relaxed text-justify line-clamp-4 italic antialiased whitespace-pre-wrap">
                    "{msg.content}"
                  </p>

                  <div className="flex justify-between items-center w-full font-sans text-[8px] sm:text-[9px] uppercase tracking-widest text-outline-variant border-t border-outline-variant/15 pt-4 mt-2">
                    <span>From: {msg.author}</span>
                    {msg.music && <span className="flex items-center gap-1.5 text-tertiary"><Moon size={10} className="animate-pulse" /> Music</span>}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Read more triggers */}
        <div className="flex justify-center pt-4">
          <Link href="/library">
            <button className="font-sans text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.25em] text-on-surface-variant border-b border-outline-variant/50 pb-1.5 hover:text-on-surface hover:border-on-surface transition-all duration-300 cursor-pointer">
              Baca Lebih Banyak
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}

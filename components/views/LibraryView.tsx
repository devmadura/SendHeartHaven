"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MessageData } from "@/lib/data";
import { loadMoreMessages } from "@/app/actions";
import { Loader2, SearchX, Music, Heart, Sparkles, Coffee, Moon, Feather, Lock } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Get atmospheric miniature thumbnails for card headers
function MoodThumbnail({ mood }: { mood?: string }) {
  const size = 16;
  const config = {
    romantic: {
      color: "bg-rose-400/10 text-rose-400 border-rose-400/25",
      icon: <Heart size={size} />
    },
    nostalgic: {
      color: "bg-amber-400/10 text-amber-400 border-amber-400/25",
      icon: <Sparkles size={size} />
    },
    healing: {
      color: "bg-teal-400/10 text-teal-400 border-teal-400/25",
      icon: <Coffee size={size} />
    },
    midnight: {
      color: "bg-indigo-400/10 text-indigo-400 border-indigo-400/25",
      icon: <Moon size={size} />
    },
    "letters-never-sent": {
      color: "bg-stone-400/10 text-stone-400 border-stone-400/25",
      icon: <Feather size={size} />
    },
    soft: {
      color: "bg-stone-400/10 text-stone-400 border-stone-400/25",
      icon: <Feather size={size} />
    }
  }[mood || "soft"] || {
    color: "bg-stone-400/10 text-stone-400 border-stone-400/25",
    icon: <Feather size={size} />
  };

  return (
    <div className={`p-2 rounded-full border ${config.color} flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.01)]`}>
      {config.icon}
    </div>
  );
}

// Gorgeous TimeCapsuleCard with live-updating countdown state
function TimeCapsuleCard({ msg, MoodThumbnail }: { msg: MessageData; MoodThumbnail: any }) {
  const [isCurrentlyLocked, setIsCurrentlyLocked] = useState(msg.isLocked);
  const [countdownText, setCountdownText] = useState("");
  const [isWithin24Hours, setIsWithin24Hours] = useState(false);

  useEffect(() => {
    if (!msg.isTimeCapsule || !msg.unlockAt) return;

    const unlockTime = new Date(msg.unlockAt).getTime();

    const updateTimer = () => {
      const now = Date.now();
      const diff = unlockTime - now;

      if (diff <= 0) {
        setIsCurrentlyLocked(false);
        setCountdownText("");
        setIsWithin24Hours(false);
        return;
      }

      setIsCurrentlyLocked(true);

      if (diff <= 24 * 60 * 60 * 1000) {
        setIsWithin24Hours(true);
        const hours = Math.floor(diff / (3600 * 1000)).toString().padStart(2, "0");
        const minutes = Math.floor((diff % (3600 * 1000)) / (60 * 1000)).toString().padStart(2, "0");
        const seconds = Math.floor((diff % (60 * 1000)) / 1000).toString().padStart(2, "0");
        
        if (diff <= 60 * 60 * 1000) {
          setCountdownText(`Almost time • ${hours}:${minutes}:${seconds}`);
        } else {
          setCountdownText(`Opens in ${hours}:${minutes}:${seconds}`);
        }
      } else {
        setIsWithin24Hours(false);
        const days = Math.ceil(diff / (24 * 3600 * 1000));
        if (days === 1) {
          setCountdownText("Opens tomorrow");
        } else {
          setCountdownText(`Will be revealed in ${days} days`);
        }
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [msg.unlockAt, msg.isTimeCapsule]);

  const moodGlows: Record<string, string> = {
    romantic: "shadow-[0_0_30px_rgba(251,113,133,0.06)] border-rose-400/20 bg-rose-50/40 dark:bg-rose-950/5",
    nostalgic: "shadow-[0_0_30px_rgba(245,158,11,0.06)] border-amber-400/20 bg-amber-50/40 dark:bg-amber-950/5",
    healing: "shadow-[0_0_30px_rgba(20,184,166,0.06)] border-teal-400/20 bg-teal-50/40 dark:bg-teal-950/5",
    midnight: "shadow-[0_0_30px_rgba(99,102,241,0.06)] border-indigo-400/20 bg-indigo-50/40 dark:bg-indigo-950/5",
    soft: "shadow-[0_0_30px_rgba(113,90,72,0.06)] border-outline-variant/20 bg-stone-50/40 dark:bg-stone-900/5",
  };

  const currentGlow = moodGlows[msg.mood || "soft"] || moodGlows.soft;

  if (isCurrentlyLocked) {
    return (
      <Link href={`/library/${msg.id}`} className="block group w-full">
        <motion.div
          whileHover={{ y: -6, boxShadow: "0 15px 35px rgba(113, 90, 72, 0.04)" }}
          whileTap={{ scale: 0.99 }}
          className={`floating-letter-card rounded-[22px] p-6 sm:p-7 flex flex-col justify-between gap-5 transition-all duration-500 ease-out border h-full relative overflow-hidden ${currentGlow} ${
            isWithin24Hours ? "animate-pulse [animation-duration:4s]" : ""
          }`}
        >
          {/* Ambient Spotlight / Atmospheric lighting overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-surface-container-low/20 to-transparent pointer-events-none" />

          {/* Card Top: Receiver & Lock Seal */}
          <div className="flex justify-between items-center w-full font-sans text-[8px] sm:text-[9px] uppercase tracking-widest text-on-surface-variant/40 border-b border-outline-variant/15 pb-3 relative z-10">
            <span className="flex items-center gap-2">
              <div className="p-2 rounded-full bg-outline-variant/10 text-outline border border-outline-variant/20">
                <Lock size={12} className={isWithin24Hours ? "animate-bounce" : ""} />
              </div>
              <span className="font-semibold text-on-surface-variant/60">Untuk: {msg.to || "Seseorang"}</span>
            </span>
            <span className="font-medium tracking-wider text-outline-variant">Locked Capsule</span>
          </div>

          {/* Card Body: Atmospheric Locked Blur Preview */}
          <div className="relative py-4 flex flex-col items-center justify-center min-h-[100px] z-10 select-none">
            {/* Blurred background letter content preview */}
            <p className="font-cormorant font-light text-[17px] sm:text-[18px] leading-relaxed text-on-surface/20 text-justify italic antialiased blur-md select-none w-full px-1">
              "Mungkin jarak hanya menguji seberapa kuat ingatan kita bertahan. Pada akhirnya, yang tersisa hanyalah kata-kata yang pernah kita ucapkan di bawah..."
            </p>

            {/* Locked atmospheric overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2.5">
              <motion.div
                animate={isWithin24Hours ? { scale: [1, 1.1, 1] } : {}}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                className="p-3 rounded-full bg-surface/80 dark:bg-stone-900/80 border border-outline-variant/35 shadow-md text-tertiary flex items-center justify-center"
              >
                <Lock size={16} />
              </motion.div>
              <span className="font-cormorant italic text-[14px] sm:text-[15px] text-on-surface-variant tracking-wide font-light">
                {countdownText}
              </span>
            </div>
          </div>

          {/* Card Bottom: Sender details */}
          <div className="flex justify-between items-center w-full font-sans text-[8px] sm:text-[9px] uppercase tracking-widest text-outline-variant/65 border-t border-outline-variant/15 pt-3.5 mt-1 relative z-10">
            <span className="font-sans">Dari: {msg.author}</span>
            <span className="flex items-center gap-1.5 text-amber-500/80 font-bold tracking-widest">
              <Sparkles size={10} className="animate-spin [animation-duration:10s]" />
              Time Capsule
            </span>
          </div>
        </motion.div>
      </Link>
    );
  }

  // Regular/Unlocked card
  const truncatedContent = msg.content.length > 160
    ? msg.content.substring(0, 160) + "..."
    : msg.content;

  return (
    <Link href={`/library/${msg.id}`} className="block group w-full">
      <motion.div
        whileHover={{ y: -6, boxShadow: "0 15px 35px rgba(113, 90, 72, 0.04)" }}
        whileTap={{ scale: 0.99 }}
        className="floating-letter-card rounded-[22px] p-6 sm:p-7 flex flex-col justify-between gap-5 hover:border-tertiary/10 transition-all duration-500 ease-out border border-outline-variant/15 h-full relative"
      >
        {/* Card Top: Receiver & Mood Icon */}
        <div className="flex justify-between items-center w-full font-sans text-[8px] sm:text-[9px] uppercase tracking-widest text-on-surface-variant/60 border-b border-outline-variant/15 pb-3">
          <span className="flex items-center gap-2">
            <MoodThumbnail mood={msg.mood} />
            <span className="font-semibold text-on-surface">Untuk: {msg.to || "Seseorang"}</span>
          </span>
          <span>{msg.date}</span>
        </div>

        {/* Card Body: Letter preview */}
        <p className="font-cormorant font-light text-[17px] sm:text-[18px] leading-relaxed text-on-surface text-justify italic antialiased whitespace-pre-wrap px-1">
          "{truncatedContent}"
        </p>

        {/* Card Bottom: Sender details & Music tags */}
        <div className="flex justify-between items-center w-full font-sans text-[8px] sm:text-[9px] uppercase tracking-widest text-outline-variant border-t border-outline-variant/15 pt-3.5 mt-1">
          <span className="font-sans text-on-surface-variant/75">Dari: {msg.author}</span>
          <div className="flex items-center gap-2">
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
            {msg.music && (
              <span className="flex items-center gap-1 text-tertiary">
                <Music size={10} className="animate-spin [animation-duration:8s] shrink-0" />
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

export function LibraryView({
  initialMessages,
  searchQuery
}: {
  initialMessages: MessageData[],
  searchQuery?: string
}) {
  const [messages, setMessages] = useState<MessageData[]>(initialMessages);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialMessages.length === 10);
  const [isLoading, setIsLoading] = useState(false);

  const handleLoadMore = async () => {
    setIsLoading(true);
    const nextPage = page + 1;
    try {
      const moreMessages = await loadMoreMessages(searchQuery, nextPage);
      setMessages((prev) => [...prev, ...moreMessages]);
      setPage(nextPage);
      if (moreMessages.length < 10) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Failed to load more messages", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Staggered Progressive Reveal Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        ease: [0.16, 1, 0.3, 1] as any
      }
    }
  };

  // Split messages for authentic responsive masonry columns on desktop
  const leftColMessages = messages.filter((_, idx) => idx % 2 === 0);
  const rightColMessages = messages.filter((_, idx) => idx % 2 !== 0);

  // Render a beautiful, single memory card
  const renderCard = (msg: MessageData) => {
    return <TimeCapsuleCard msg={msg} MoodThumbnail={MoodThumbnail} />;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-4xl px-4 sm:px-6 py-12 sm:py-20 mx-auto relative z-10 flex flex-col gap-12 sm:gap-16"
    >
      {/* Dynamic Background Glow Spot */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-96 bg-gradient-to-tr from-tertiary/5 via-primary/5 to-secondary/5 rounded-full blur-[140px] pointer-events-none -z-20 ambient-glowing-light" />

      {/* Page Header */}
      <div className="text-center flex flex-col gap-4 items-center relative">
        <motion.img
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          src="/bunga.png"
          className="w-12 h-12 object-contain grayscale opacity-45 botanical-blend"
          alt="Flower Header Seal"
          onError={(e) => {
            e.currentTarget.src = "https://lh3.googleusercontent.com/aida-public/AB6AXuA4yoTfA0SrA3aLIOt_jkUdOqiYrhtFo6ma3qiMxqkGrCmRwhw4D7gy47CSS6DTBd585IScC9gjZPw9l1cMv9AYyRkR_7AdkH_-yJgE4uJrsGr6s2Dha0zBeZ1600e0QKnBtLlcumAp4X7vQJAFux2rf8nV3AleHL_LZ_3kgQ3qLv5LV_dnsLPjKpEsfsip60dRB0e8A8PwfOb4zIguNW0YwTGWxdBiNU_4Nu-BTyRcl0WflBzla-ASoe5sfiNSWefXRKaoRfpRNqg";
          }}
        />
        <h1 className="text-3xl md:text-4xl text-on-surface font-cormorant font-light tracking-wide antialiased">
          {searchQuery
            ? ["romantic", "nostalgic", "midnight", "healing", "soft", "letters-never-sent"].includes(searchQuery.toLowerCase())
              ? `Library: ${searchQuery.toUpperCase().replace("-", " ")}`
              : `Hasil Pencarian`
            : "Heart Library"
          }
        </h1>
        <p className="font-sans text-[8px] sm:text-[9px] tracking-[0.25em] uppercase text-on-surface-variant/80">
          {searchQuery
            ? ["romantic", "nostalgic", "midnight", "healing", "soft", "letters-never-sent"].includes(searchQuery.toLowerCase())
              ? `Koleksi Surat Bernuansa ${searchQuery.replace("-", " ")}`
              : `Mencari pesan untuk "${searchQuery}"`
            : "Kumpulan Pesan yang Diabadikan"
          }
        </p>
        <div className="w-8 h-[1px] bg-outline-variant/30 mt-1" />
      </div>

      {messages.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-20 text-on-surface-variant/75 gap-5"
        >
          <div className="p-3.5 rounded-full bg-surface-container-low/40 border border-outline-variant/20 shadow-sm">
            <SearchX size={28} strokeWidth={1.5} className="text-outline-variant" />
          </div>
          <p className="font-cormorant italic text-lg sm:text-xl text-center">Belum ada lembaran pesan yang tertulis di sini.</p>
          <Link href="/compose">
            <span className="font-sans text-[9px] font-bold text-on-surface-variant/80 border border-outline-variant/30 px-6 py-2.5 rounded-full hover:bg-on-surface hover:text-white hover:border-on-surface transition-all duration-300 uppercase tracking-widest cursor-pointer shadow-sm">
              Tulis Pesan Pertama
            </span>
          </Link>
        </motion.div>
      ) : (
        <>
          {/* Mobile view: single chronological list */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-6 w-full md:hidden"
          >
            <AnimatePresence>
              {messages.map((msg) => (
                <motion.div key={msg.id} variants={cardVariants} layout>
                  {renderCard(msg)}
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Desktop view: staggered offset masonry columns */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="hidden md:grid grid-cols-2 gap-8 md:gap-10 w-full"
          >
            {/* Left Column */}
            <div className="flex flex-col gap-8 md:gap-10 pt-0">
              <AnimatePresence>
                {leftColMessages.map((msg) => (
                  <motion.div key={msg.id} variants={cardVariants} layout>
                    {renderCard(msg)}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Right Column (offset vertically for masonry) */}
            <div className="flex flex-col gap-8 md:gap-10 pt-0 md:pt-16">
              <AnimatePresence>
                {rightColMessages.map((msg) => (
                  <motion.div key={msg.id} variants={cardVariants} layout>
                    {renderCard(msg)}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}

      {/* Pagination Load More Button */}
      {hasMore && (
        <div className="flex justify-center mt-6 pb-12">
          <button
            onClick={handleLoadMore}
            disabled={isLoading}
            className="font-sans text-[9px] sm:text-[10px] font-bold text-on-surface bg-surface-container/50 backdrop-blur-sm border border-outline/30 px-8 py-3.5 hover:bg-on-surface hover:text-white hover:border-on-surface transition-all duration-300 uppercase tracking-[0.25em] flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed rounded-full shadow-sm hover:shadow-md cursor-pointer"
          >
            {isLoading && <Loader2 size={12} className="animate-spin" />}
            {isLoading ? "Membuka Lembaran..." : "Lihat Pesan Lainnya"}
          </button>
        </div>
      )}
    </motion.div>
  );
}

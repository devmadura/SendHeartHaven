"use client";

import { useState } from "react";
import Link from "next/link";
import { MessageData } from "@/lib/data";
import { loadMoreMessages } from "@/app/actions";
import { Loader2, SearchX, Music, Heart, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

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
        staggerChildren: 0.1,
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        ease: [0.16, 1, 0.3, 1] as any
      }
    }
  };

  // Split messages for authentic responsive masonry columns
  const leftColMessages = messages.filter((_, idx) => idx % 2 === 0);
  const rightColMessages = messages.filter((_, idx) => idx % 2 !== 0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-5xl px-4 sm:px-6 py-24 mx-auto relative z-10 flex flex-col gap-16 md:gap-24"
    >
      {/* Dynamic Background Glow Spot */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-96 bg-gradient-to-tr from-tertiary/5 via-primary/5 to-secondary/5 rounded-full blur-[140px] pointer-events-none -z-20" />

      {/* Page Header */}
      <div className="text-center flex flex-col gap-5 items-center relative">
        <motion.img
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuA4yoTfA0SrA3aLIOt_jkUdOqiYrhtFo6ma3qiMxqkGrCmRwhw4D7gy47CSS6DTBd585IScC9gjZPw9l1cMv9AYyRkR_7AdkH_-yJgE4uJrsGr6s2Dha0zBeZ1600e0QKnBtLlcumAp4X7vQJAFux2rf8nV3AleHL_LZ_3kgQ3qLv5LV_dnsLPjKpEsfsip60dRB0e8A8PwfOb4zIguNW0YwTGWxdBiNU_4Nu-BTyRcl0WflBzla-ASoe5sfiNSWefXRKaoRfpRNqg"
          className="w-16 h-16 object-cover grayscale opacity-50 botanical-blend"
          alt="Decorative flower"
        />
        <h1 className="text-4xl md:text-5xl text-on-surface font-cormorant font-light tracking-wide antialiased">
          {searchQuery 
            ? ["romantic", "nostalgic", "midnight", "healing", "soft"].includes(searchQuery.toLowerCase()) 
              ? `Library: ${searchQuery.toUpperCase()}`
              : `Hasil Pencarian`
            : "Heart Library"
          }
        </h1>
        <p className="font-sans text-[9px] tracking-[0.25em] uppercase text-on-surface-variant/80">
          {searchQuery 
            ? ["romantic", "nostalgic", "midnight", "healing", "soft"].includes(searchQuery.toLowerCase())
              ? `Koleksi Surat Bernuansa ${searchQuery}`
              : `Mencari pesan untuk "${searchQuery}"`
            : "Kumpulan Pesan yang Diabadikan"
          }
        </p>
        <div className="w-10 h-[1px] bg-outline-variant/30 mt-1" />
      </div>

      {messages.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-24 text-on-surface-variant/75 gap-6"
        >
          <div className="p-4 rounded-full bg-surface-container-low/40 border border-outline-variant/20 shadow-sm">
            <SearchX size={32} strokeWidth={1.5} className="text-outline-variant" />
          </div>
          <p className="font-cormorant italic text-xl text-center">Belum ada lembaran pesan yang tertulis di sini.</p>
          <Link href="/compose">
            <span className="font-sans text-[10px] font-bold text-on-surface-variant/80 border border-outline-variant/30 px-6 py-2.5 rounded-full hover:bg-on-surface hover:text-white hover:border-on-surface transition-all duration-300 uppercase tracking-widest cursor-pointer shadow-sm">
              Tulis Pesan Pertama
            </span>
          </Link>
        </motion.div>
      ) : (
        /* Staggered Masonry Layout */
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 w-full"
        >
          {/* Left Column */}
          <div className="flex flex-col gap-8 md:gap-12 pt-0">
            <AnimatePresence>
              {leftColMessages.map((msg) => {
                const truncatedContent = msg.content.length > 180 
                  ? msg.content.substring(0, 180) + "..." 
                  : msg.content;
                
                return (
                  <motion.div key={msg.id} variants={cardVariants} layout>
                    <Link href={`/library/${msg.id}`} className="block group">
                      <div className="floating-letter-card rounded-2xl p-6 sm:p-8 flex flex-col justify-between gap-6 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.02)] transition-all duration-500 ease-out border border-outline-variant/20 h-full relative">
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

                        <p className="font-cormorant font-light text-[17px] sm:text-[19px] leading-relaxed text-on-surface text-justify italic antialiased whitespace-pre-wrap">
                          "{truncatedContent}"
                        </p>

                        <div className="flex justify-between items-center w-full font-sans text-[9px] uppercase tracking-widest text-outline-variant border-t border-outline-variant/20 pt-4 mt-2">
                          <span>From: {msg.author}</span>
                          {msg.music && (
                            <span className="flex items-center gap-1.5 text-tertiary">
                              <Music size={9} className="animate-spin [animation-duration:10s]" />
                              <span>Music</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Right Column (Offset Vertically for Masonry effect) */}
          <div className="flex flex-col gap-8 md:gap-12 pt-0 md:pt-16">
            <AnimatePresence>
              {rightColMessages.map((msg) => {
                const truncatedContent = msg.content.length > 180 
                  ? msg.content.substring(0, 180) + "..." 
                  : msg.content;
                
                return (
                  <motion.div key={msg.id} variants={cardVariants} layout>
                    <Link href={`/library/${msg.id}`} className="block group">
                      <div className="floating-letter-card rounded-2xl p-6 sm:p-8 flex flex-col justify-between gap-6 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.02)] transition-all duration-500 ease-out border border-outline-variant/20 h-full relative">
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

                        <p className="font-cormorant font-light text-[17px] sm:text-[19px] leading-relaxed text-on-surface text-justify italic antialiased whitespace-pre-wrap">
                          "{truncatedContent}"
                        </p>

                        <div className="flex justify-between items-center w-full font-sans text-[9px] uppercase tracking-widest text-outline-variant border-t border-outline-variant/20 pt-4 mt-2">
                          <span>From: {msg.author}</span>
                          {msg.music && (
                            <span className="flex items-center gap-1.5 text-tertiary">
                              <Music size={9} className="animate-spin [animation-duration:10s]" />
                              <span>Music</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </motion.div>
      )}

      {/* Pagination Load More Button */}
      {hasMore && (
        <div className="flex justify-center mt-8 pb-12">
          <button
            onClick={handleLoadMore}
            disabled={isLoading}
            className="font-sans text-[10px] font-semibold text-on-surface bg-surface-container/50 backdrop-blur-sm border border-outline/50 px-10 py-4 hover:bg-on-surface hover:text-white hover:border-on-surface transition-all duration-300 uppercase tracking-[0.25em] flex items-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed rounded-full shadow-sm hover:shadow-md cursor-pointer"
          >
            {isLoading && <Loader2 size={13} className="animate-spin" />}
            {isLoading ? "Membuka Lembaran..." : "Lihat Pesan Lainnya"}
          </button>
        </div>
      )}
    </motion.div>
  );
}

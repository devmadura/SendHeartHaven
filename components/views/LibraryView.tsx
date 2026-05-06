"use client";
import { useState } from "react";
import Link from "next/link";
import { MessageCard, SakuraBackground } from "@/components/layout";
import { MessageData } from "@/lib/data";
import { loadMoreMessages } from "@/app/actions";
import { Loader2, SearchX } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function LibraryView({ initialMessages, searchQuery }: { initialMessages: MessageData[], searchQuery?: string }) {
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-5xl px-6 py-24 mx-auto relative z-10 flex flex-col gap-16 md:gap-24"
    >
      {/* Decorative Blur Backgrounds */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-rose-100/40 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-stone-200/50 rounded-full blur-[120px]" />
      </div>

      <SakuraBackground />

      <div className="text-center flex flex-col gap-6 items-center relative">
        <motion.img
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuA4yoTfA0SrA3aLIOt_jkUdOqiYrhtFo6ma3qiMxqkGrCmRwhw4D7gy47CSS6DTBd585IScC9gjZPw9l1cMv9AYyRkR_7AdkH_-yJgE4uJrsGr6s2Dha0zBeZ1600e0QKnBtLlcumAp4X7vQJAFux2rf8nV3AleHL_LZ_3kgQ3qLv5LV_dnsLPjKpEsfsip60dRB0e8A8PwfOb4zIguNW0YwTGWxdBiNU_4Nu-BTyRcl0WflBzla-ASoe5sfiNSWefXRKaoRfpRNqg"
          className="w-20 h-20 object-cover grayscale opacity-60 botanical-blend"
          alt="Decorative flower"
        />
        <h1 className="text-4xl md:text-6xl text-on-surface font-serif italic tracking-wide text-stone-800">
          Heart Library
        </h1>
        <p className="font-sans text-xs md:text-sm tracking-[0.3em] uppercase text-stone-400">
          Kumpulan Pesan yang Diabadikan
        </p>
        <div className="w-12 h-[1px] bg-stone-300 mt-2" />
      </div>

      {messages.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-20 text-stone-400 gap-4"
        >
          <SearchX size={48} strokeWidth={1} />
          <p className="font-serif italic text-lg text-center">Belum ada pesan yang tertulis di sini.</p>
          <Link href="/compose">
            <span className="font-sans text-xs font-bold text-stone-500 border-b border-stone-300 pb-1 mt-4 hover:text-stone-800 transition-colors uppercase tracking-widest">
              Tulis Pesan Pertama
            </span>
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          <AnimatePresence>
            {messages.map((msg, idx) => (
              <Link
                href={`/library/${msg.id}`}
                key={msg.id}
                className={`block group ${idx % 3 === 0 ? "md:col-span-2 md:w-[80%] md:mx-auto" : "col-span-1"}`}
              >
                <div className="h-full">
                  <MessageCard
                    content={msg.content}
                    author={msg.author}
                    date={msg.date}
                    className="h-full bg-white/40 backdrop-blur-md border-white/60 hover:bg-white/80 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] hover:-translate-y-1 transition-all duration-500 ease-out"
                  />
                </div>
              </Link>
            ))}
          </AnimatePresence>
        </div>
      )}

      {hasMore && (
        <div className="flex justify-center mt-8 pb-12">
          <button
            onClick={handleLoadMore}
            disabled={isLoading}
            className="font-sans text-xs font-medium text-stone-500 bg-white/50 backdrop-blur-sm border border-stone-200/80 px-10 py-4 hover:bg-stone-900 hover:text-white hover:border-stone-900 transition-all duration-300 uppercase tracking-widest flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed rounded-full shadow-sm hover:shadow-md"
          >
            {isLoading && <Loader2 size={14} className="animate-spin" />}
            {isLoading ? "Membuka Lembaran..." : "Lihat Pesan Lainnya"}
          </button>
        </div>
      )}
    </motion.div>
  );
}

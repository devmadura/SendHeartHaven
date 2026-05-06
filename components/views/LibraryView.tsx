"use client";
import { useState } from "react";
import Link from "next/link";
import { MessageCard } from "@/components/layout";
import { MessageData } from "@/lib/data";
import { loadMoreMessages } from "@/app/actions";
import { Loader2 } from "lucide-react";

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
    <div className="w-full max-w-4xl px-6 py-24 mx-auto relative z-10 flex flex-col gap-12">
      <div className="text-center flex flex-col gap-4">
        <h1 className="text-4xl md:text-5xl text-on-surface font-normal tracking-tight">
          Library
        </h1>
        <p className="font-sans text-sm tracking-widest uppercase text-tertiary">
          Arsip Pesan-Pesan yang Tersimpan
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {messages.map((msg, idx) => (
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

      {hasMore && (
        <div className="flex justify-center mt-12">
          <button 
            onClick={handleLoadMore}
            disabled={isLoading}
            className="font-sans text-xs font-bold text-stone-500 border border-stone-300 px-8 py-3 hover:bg-stone-900 hover:text-white hover:border-stone-900 transition-all uppercase tracking-widest flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed rounded-sm"
          >
            {isLoading && <Loader2 size={14} className="animate-spin" />}
            {isLoading ? "Memuat..." : "Tampilkan Lebih Banyak"}
          </button>
        </div>
      )}
    </div>
  );
}

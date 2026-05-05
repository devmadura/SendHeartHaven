"use client";

import { useState, useRef } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { ArrowLeft, Music, Share2 } from "lucide-react";
import { MessageData } from "@/lib/data";

export function MessageDetailView({ message }: { message: MessageData }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const total = audioRef.current.duration;
      setProgress((current / total) * 100);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setProgress(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="w-full max-w-2xl px-6 py-24 mx-auto relative z-10 flex flex-col gap-8"
    >
      <Link href="/library" className="inline-flex items-center gap-2 text-stone-500 hover:text-stone-900 transition-colors w-fit font-sans text-xs uppercase tracking-widest">
        <ArrowLeft size={14} />
        Kembali ke Library
      </Link>

      <div className="bg-[#FCFBF8] border border-[#E6DACD] p-10 md:p-20 relative shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] mt-4 rounded-sm overflow-hidden">
        {/* Decorative background quote */}
        <div className="absolute top-4 left-6 md:top-8 md:left-10 text-[120px] font-serif text-[#F2ECE4] leading-none opacity-70 select-none pointer-events-none">
          "
        </div>

        <div className="flex flex-col gap-12 relative z-10">
          {message.music && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.8 }}
              className="w-full max-w-sm bg-[#18181b] rounded-2xl p-4 flex flex-col gap-4 shadow-xl overflow-hidden relative group border border-white/5 self-center -mt-4 mb-2"
            >
              {/* Decorative glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
              
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-14 h-14 rounded-lg overflow-hidden bg-stone-800 flex-shrink-0 shadow-md relative">
                  {message.music.artworkUrl ? (
                    <img src={message.music.artworkUrl} alt={message.music.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-500">
                      <Music size={20} />
                    </div>
                  )}
                  {isPlaying && (
                     <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[1px]">
                        <div className="w-4 h-4 flex justify-between items-end gap-[2px]">
                           <motion.div animate={{ height: ["4px", "12px", "4px"] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-[3px] bg-white rounded-t-sm" />
                           <motion.div animate={{ height: ["8px", "14px", "8px"] }} transition={{ repeat: Infinity, duration: 1.2 }} className="w-[3px] bg-white rounded-t-sm" />
                           <motion.div animate={{ height: ["6px", "10px", "6px"] }} transition={{ repeat: Infinity, duration: 0.9 }} className="w-[3px] bg-white rounded-t-sm" />
                        </div>
                     </div>
                  )}
                </div>
                
                <div className="flex flex-col flex-grow min-w-0">
                  <span className="font-sans font-semibold text-white text-sm truncate">{message.music.title}</span>
                  <span className="font-sans text-stone-400 text-xs truncate mt-0.5">{message.music.artist}</span>
                </div>

                {message.music.previewUrl && (
                  <button 
                    onClick={togglePlay}
                    className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center flex-shrink-0 hover:scale-105 active:scale-95 transition-all shadow-md"
                  >
                    {isPlaying ? (
                      <div className="w-3 h-3 flex gap-1 justify-center items-center">
                        <div className="w-1 h-3 bg-black rounded-sm" />
                        <div className="w-1 h-3 bg-black rounded-sm" />
                      </div>
                    ) : (
                      <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-black border-b-[6px] border-b-transparent ml-1" />
                    )}
                  </button>
                )}
              </div>

              {message.music.previewUrl && (
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden relative z-10 cursor-default">
                  <div 
                    className="h-full bg-white transition-all duration-100 ease-linear rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}
              
              {message.music.previewUrl && (
                <audio 
                  ref={audioRef} 
                  src={message.music.previewUrl} 
                  onTimeUpdate={handleTimeUpdate}
                  onEnded={handleEnded}
                  className="hidden" 
                />
              )}
            </motion.div>
          )}
          {message.to && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="font-sans text-[10px] uppercase tracking-[0.3em] text-[#8C8276] border-b border-[#E6DACD]/50 pb-6 text-center"
            >
              <span className="text-[#C4B8A9]">UNTUK:</span> {message.to}
            </motion.div>
          )}

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="font-serif text-2xl md:text-3xl leading-relaxed md:leading-[1.8] text-[#4A443E] italic text-center px-4 md:px-12 whitespace-pre-wrap"
          >
            {message.content}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 1 }}
            className="flex flex-col items-center gap-6 pt-12 border-t border-[#E6DACD]/50"
          >
            <div className="flex flex-col items-center gap-2">
              <span className="font-sans text-[9px] uppercase tracking-[0.2em] text-[#C4B8A9]">
                Dari
              </span>
              <span className="font-serif text-xl md:text-2xl text-[#5C544D]">
                {message.author}
              </span>
            </div>

            <div className="font-sans text-[10px] uppercase tracking-widest text-[#B3A89B]">
              {message.date}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="flex justify-center gap-4 mt-8">
        <button 
          onClick={async () => {
            const url = window.location.href;
            if (navigator.share) {
              try {
                await navigator.share({
                  title: `Pesan untuk ${message.to || "Seseorang"}`,
                  text: `Ada pesan rahasia untukmu di SendHeartHaven.`,
                  url: url,
                });
              } catch (err) {
                console.log("Error sharing:", err);
              }
            } else {
              navigator.clipboard.writeText(url);
              alert("Tautan berhasil disalin!");
            }
          }}
          className="flex items-center gap-2 font-sans text-xs font-bold text-stone-500 hover:text-stone-800 transition-colors uppercase tracking-widest"
        >
          <Share2 size={16} />
          Bagikan
        </button>
      </div>
    </motion.div>
  );
}

"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { ArrowLeft, Music, Share2 } from "lucide-react";

import { MessageData } from "@/lib/data";

export function MessageDetailView({ message }: { message: MessageData }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  // Hover & Parallax States (Tilt and Shadow shifts)
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [shadowX, setShadowX] = useState(0);
  const [shadowY, setShadowY] = useState(0);
  const [lightX, setLightX] = useState(0);
  const [lightY, setLightY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Soft rising particles background
  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      bottom: Math.random() * 30,
      size: Math.random() * 3 + 2,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * -12,
      xDrift: Math.random() * 30 - 15,
    }));
    setParticles(newParticles);
  }, []);

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

  // Mouse Move Event Handler for Parallax (Tilt & Spotlight effect)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (window.innerWidth < 768) return;

    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = x - rect.width / 2;
    const centerY = y - rect.height / 2;

    // max 4.5 degrees rotation
    setRotateX(-centerY / (rect.height / 9));
    setRotateY(centerX / (rect.width / 9));
    
    // max 10px shadow displacement
    setShadowX(centerX / (rect.width / 20));
    setShadowY(centerY / (rect.height / 20));

    setLightX(x);
    setLightY(y);
  };

  const handleMouseEnter = () => {
    if (window.innerWidth < 768) return;
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setShadowX(0);
    setShadowY(0);
    setIsHovered(false);
  };

  // Staggered Progressive Entrance Animation Settings
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.2,
      }
    }
  };

  const paragraphVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1.2,
        ease: [0.16, 1, 0.3, 1] as any // Poetic calm ease-out
      }
    }
  };

  // Split content by paragraph/newlines
  const paragraphs = message.content.split(/\n\n+/).filter(p => p.trim());

  return (
    <div className="w-full min-h-[92vh] flex flex-col justify-center items-center py-16 px-4 md:px-8 relative select-none md:select-text overflow-hidden">
      {/* Background Particles behind the card but in front of environment */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-tertiary/15 dark:bg-tertiary/30 pointer-events-none blur-[1px]"
            style={{
              left: `${p.left}%`,
              bottom: `${p.bottom}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
            }}
            animate={{
              y: [0, -450],
              x: [0, p.xDrift],
              opacity: [0, 0.5, 0.5, 0],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              ease: "easeOut",
              delay: p.delay,
            }}
          />
        ))}
      </div>

      {/* Decorative Glow Spot behind the card, responsive to letter mood */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-96 bg-gradient-to-tr ${
        message.mood === "romantic" ? "from-rose-500/10 via-rose-500/5 to-transparent" :
        message.mood === "nostalgic" ? "from-amber-500/10 via-amber-500/5 to-transparent" :
        message.mood === "midnight" ? "from-indigo-500/10 via-indigo-500/5 to-transparent" :
        message.mood === "healing" ? "from-teal-500/10 via-teal-500/5 to-transparent" :
        "from-tertiary/10 via-primary/5 to-transparent"
      } rounded-full blur-[140px] pointer-events-none -z-20`} />

      {/* Top Navigation Back Button */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-3xl mb-8"
      >
        <Link 
          href="/library" 
          className="inline-flex items-center gap-2 text-on-surface-variant/75 hover:text-on-surface transition-colors font-sans text-xs uppercase tracking-widest"
        >
          <ArrowLeft size={13} />
          Kembali ke Library
        </Link>
      </motion.div>

      {/* Floating Idle Wrapper */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="w-full max-w-3xl"
      >
        {/* Interactive Parallax Card */}
        <div
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{
            transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
            boxShadow: isHovered 
              ? `${shadowX}px ${shadowY}px 45px rgba(0, 0, 0, 0.04), ${shadowX * 1.5}px ${shadowY * 1.5}px 80px rgba(0, 0, 0, 0.02)` 
              : undefined,
            transition: isHovered ? "none" : "transform 0.6s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.6s ease"
          }}
          className="floating-letter-card w-full rounded-[24px] p-8 sm:p-12 md:p-16 relative flex flex-col justify-between overflow-hidden group"
        >
          {/* Subtle Mood Tint Overlay */}
          {message.mood === "romantic" && <div className="absolute inset-0 bg-rose-400/[0.015] pointer-events-none -z-10" />}
          {message.mood === "nostalgic" && <div className="absolute inset-0 bg-amber-400/[0.015] pointer-events-none -z-10" />}
          {message.mood === "midnight" && <div className="absolute inset-0 bg-indigo-400/[0.015] pointer-events-none -z-10" />}
          {message.mood === "healing" && <div className="absolute inset-0 bg-teal-400/[0.015] pointer-events-none -z-10" />}
          {/* Subtle Hover Spotlight Glow */}
          {isHovered && (
            <div 
              className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[24px]" 
              style={{ 
                background: `radial-gradient(circle 240px at ${lightX}px ${lightY}px, rgba(255,255,255,0.06) 0%, transparent 80%)` 
              }} 
            />
          )}

          {/* Letter Header & Music Stamp Wrapper */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-start w-full relative z-10">
            {/* "To" Section */}
            {message.to ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="font-sans text-[10px] uppercase tracking-[0.25em] text-on-surface-variant/80 pb-4 md:pb-0 mb-6 md:mb-0 border-b md:border-b-0 border-outline-variant/30"
              >
                <span className="text-outline-variant mr-1">To:</span> {message.to}
              </motion.div>
            ) : (
              <div />
            )}

            {/* Integrated Minimalist Music Postage Stamp */}
            {message.music && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, duration: 0.8 }}
                className="music-postage-stamp rounded-2xl p-3 flex items-center gap-3 shadow-[0_4px_20px_rgba(0,0,0,0.01)] w-full max-w-[280px] self-start md:self-end md:-mt-4 md:mb-6 mb-8 relative group/stamp overflow-hidden"
              >
                <div className="w-10 h-10 rounded-full overflow-hidden bg-stone-200/50 dark:bg-stone-800/50 flex-shrink-0 shadow-sm relative flex items-center justify-center">
                  {message.music.artworkUrl ? (
                    <img 
                      src={message.music.artworkUrl} 
                      alt={message.music.title} 
                      className={`w-full h-full object-cover transition-transform duration-1000 ${isPlaying ? 'animate-spin [animation-duration:12s]' : ''}`} 
                    />
                  ) : (
                    <Music size={16} className="text-tertiary" />
                  )}
                  {isPlaying && (
                     <div className="absolute inset-0 bg-black/35 flex items-center justify-center backdrop-blur-[0.5px]">
                        <div className="w-3.5 h-3.5 flex justify-between items-end gap-[1.5px] px-[1px]">
                           <motion.div animate={{ height: ["2px", "8px", "2px"] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-[2px] bg-white rounded-t-sm" />
                           <motion.div animate={{ height: ["4px", "10px", "4px"] }} transition={{ repeat: Infinity, duration: 1.2 }} className="w-[2px] bg-white rounded-t-sm" />
                           <motion.div animate={{ height: ["3px", "7px", "3px"] }} transition={{ repeat: Infinity, duration: 0.9 }} className="w-[2px] bg-white rounded-t-sm" />
                        </div>
                     </div>
                  )}
                </div>
                
                <div className="flex flex-col flex-grow min-w-0">
                  <span className="font-sans font-semibold text-on-surface text-[11px] truncate leading-tight">{message.music.title}</span>
                  <span className="font-sans text-on-surface-variant/80 text-[9px] truncate leading-tight mt-0.5">{message.music.artist}</span>
                </div>

                {message.music.previewUrl && (
                  <button 
                    onClick={togglePlay}
                    className="w-7 h-7 rounded-full bg-tertiary text-white flex items-center justify-center flex-shrink-0 hover:scale-105 active:scale-95 transition-all shadow-sm cursor-pointer"
                  >
                    {isPlaying ? (
                      <div className="w-2 h-2 flex gap-[1.5px] justify-center items-center">
                        <div className="w-[1.5px] h-[6px] bg-white rounded-sm" />
                        <div className="w-[1.5px] h-[6px] bg-white rounded-sm" />
                      </div>
                    ) : (
                      <div className="w-0 h-0 border-t-[3.5px] border-t-transparent border-l-[6px] border-l-white border-b-[3.5px] border-b-transparent ml-0.5" />
                    )}
                  </button>
                )}

                {/* Elegant bottom edge progress bar */}
                {message.music.previewUrl && (
                  <div className="absolute bottom-0 left-0 w-full h-[1.5px] bg-tertiary/10">
                    <div 
                      className="h-full bg-tertiary transition-all duration-100 ease-linear"
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
          </div>

          {/* Letter Body content wrapper with staggered reveal */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full relative z-10 flex flex-col justify-start"
          >
            {/* Paragraphs rendering progressively */}
            <div className="flex flex-col gap-6 md:gap-8 my-6 md:my-10 text-on-surface text-left">
              {paragraphs.map((para, idx) => (
                <motion.p 
                  key={idx}
                  variants={paragraphVariants}
                  className="font-cormorant font-light text-[21px] sm:text-[23px] md:text-[25px] leading-relaxed md:leading-[1.8] tracking-wide text-justify antialiased whitespace-pre-wrap"
                >
                  {para}
                </motion.p>
              ))}
            </div>

            {/* Soft poetic divider line */}
            <motion.div 
              variants={paragraphVariants}
              className="w-12 h-[1px] bg-outline-variant/35 my-8 mx-auto"
            />

            {/* Author & Signature section */}
            <motion.div 
              variants={paragraphVariants}
              className="flex flex-col items-center gap-6"
            >
              <div className="flex flex-col items-center gap-1.5">
                <span className="font-sans text-[9px] uppercase tracking-[0.25em] text-outline-variant/80">
                  With warmth,
                </span>
                <span className="font-cormorant italic text-[24px] sm:text-[26px] md:text-[28px] text-on-surface font-medium">
                  {message.author}
                </span>
              </div>

              <div className="font-sans text-[9px] uppercase tracking-[0.2em] text-on-surface-variant/60">
                {message.dateDetail || message.date}
              </div>
            </motion.div>

            {/* Cinematic Ending Phrase */}
            <motion.div 
              variants={paragraphVariants}
              className="mt-12 text-center"
            >
              <p className="font-cormorant italic text-xs sm:text-sm tracking-[0.2em] text-on-surface-variant/65 font-light select-none">
                “This message was sent with love.”
              </p>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Share/Actions Capsule floating below the card */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 1 }}
        className="flex justify-center gap-4 mt-10 relative z-10"
      >
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
          className="flex items-center gap-2 font-sans text-[11px] font-bold text-on-surface-variant/80 hover:text-on-surface transition-colors uppercase tracking-widest bg-surface-container/30 backdrop-blur-sm border border-outline/20 px-5 py-2.5 rounded-full shadow-sm hover:shadow transition-all duration-300 cursor-pointer"
        >
          <Share2 size={13} />
          Bagikan
        </button>
      </motion.div>
    </div>
  );
}

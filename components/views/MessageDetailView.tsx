"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { ArrowLeft, Music, Share2, Heart, Sparkles, Coffee, Moon, Feather, Lock } from "lucide-react";
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

  // Time Capsule Countdown States
  const [isCurrentlyLocked, setIsCurrentlyLocked] = useState(message.isLocked);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [countdownStr, setCountdownStr] = useState("");
  const [isFinalHour, setIsFinalHour] = useState(false);
  const [hasUnlockedNow, setHasUnlockedNow] = useState(false);

  useEffect(() => {
    if (!message.isTimeCapsule || !message.unlockAt) return;

    const unlockTime = new Date(message.unlockAt).getTime();

    const updateTimer = () => {
      const now = Date.now();
      const diff = unlockTime - now;

      if (diff <= 0) {
        if (isCurrentlyLocked) {
          setHasUnlockedNow(true);
          setTimeout(() => {
            setHasUnlockedNow(false);
          }, 6000);
        }
        setIsCurrentlyLocked(false);
        setTimeLeft(0);
        setCountdownStr("");
        setIsFinalHour(false);
        return;
      }

      setIsCurrentlyLocked(true);
      setTimeLeft(diff);

      const hours = Math.floor(diff / (3600 * 1000)).toString().padStart(2, "0");
      const minutes = Math.floor((diff % (3600 * 1000)) / (60 * 1000)).toString().padStart(2, "0");
      const seconds = Math.floor((diff % (60 * 1000)) / 1000).toString().padStart(2, "0");

      if (diff <= 60 * 60 * 1000) {
        setIsFinalHour(true);
        setCountdownStr(`${hours}:${minutes}:${seconds}`);
      } else {
        setIsFinalHour(false);
        setCountdownStr(`${hours}:${minutes}:${seconds}`);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [message.unlockAt, message.isTimeCapsule, isCurrentlyLocked]);

  // Soft rising particles background
  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    const count = isCurrentlyLocked ? (isFinalHour ? 30 : 20) : 18;
    const newParticles = Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      bottom: Math.random() * 30,
      size: Math.random() * (isCurrentlyLocked ? 4 : 3) + 1.5,
      duration: Math.random() * (isCurrentlyLocked ? (isFinalHour ? 6 : 9) : 12) + 8,
      delay: Math.random() * -10,
      xDrift: Math.random() * 40 - 20,
    }));
    setParticles(newParticles);
  }, [isCurrentlyLocked, isFinalHour]);

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
        staggerChildren: 0.15,
        delayChildren: 0.1,
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
        ease: [0.16, 1, 0.3, 1] as any
      }
    }
  };

  // Split content by paragraph/newlines
  const paragraphs = message.content.split(/\n\n+/).filter(p => p.trim());

  return (
    <div className="w-full min-h-[85vh] flex flex-col justify-center items-center py-8 sm:py-16 px-4 md:px-8 relative overflow-hidden select-text">
      
      {/* Background Particles behind the card but in front of environment */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-tertiary/15 dark:bg-tertiary/25 pointer-events-none blur-[1px]"
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
      } rounded-full blur-[140px] pointer-events-none -z-20 ambient-glowing-light`} />

      {/* Top Navigation Back Button */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl mb-6 text-left"
      >
        <Link 
          href="/library" 
          className="inline-flex items-center gap-2 text-on-surface-variant/70 hover:text-on-surface transition-colors font-sans text-[10px] uppercase tracking-widest border border-outline-variant/20 px-4 py-2 rounded-full bg-surface/40 backdrop-blur-sm"
        >
          <ArrowLeft size={12} />
          Kembali ke Library
        </Link>
      </motion.div>

      {/* Floating Idle Wrapper */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="w-full max-w-2xl"
      >
        <AnimatePresence mode="wait">
          {isCurrentlyLocked ? (
            <motion.div
              key="locked-envelope"
              initial={{ opacity: 1, scale: 1 }}
              exit={{ 
                opacity: 0, 
                scale: 0.9, 
                filter: "blur(10px)",
                transition: { duration: 1.2, ease: "easeInOut" } 
              }}
              className={`floating-letter-card w-full rounded-[24px] sm:rounded-[32px] p-8 sm:p-12 md:p-16 relative flex flex-col justify-center items-center overflow-hidden min-h-[420px] select-none text-center ${
                isFinalHour 
                  ? "bg-gradient-to-tr from-stone-900/10 via-amber-500/[0.04] to-stone-900/10 border-amber-400/25 shadow-[0_0_50px_rgba(245,158,11,0.06)]"
                  : "bg-gradient-to-tr from-stone-900/10 via-indigo-500/[0.03] to-stone-900/10 border-indigo-400/15"
              }`}
            >
              {/* Spotlight ambient overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-surface-container-low/10 to-transparent pointer-events-none -z-10" />

              {/* Sparkling decorative ambient glows */}
              <div className={`absolute w-48 h-48 rounded-full blur-[80px] pointer-events-none transition-all duration-[2000ms] -z-10 ${
                isFinalHour 
                  ? "bg-amber-500/10 top-12 left-12 animate-pulse" 
                  : "bg-indigo-500/6 top-1/4 left-1/4"
              }`} />

              {/* Card Top: Capsule Label */}
              <div className="absolute top-6 left-8 right-8 flex justify-between items-center w-auto font-sans text-[8px] sm:text-[9px] uppercase tracking-[0.25em] text-on-surface-variant/40 border-b border-outline-variant/15 pb-3">
                <span className="flex items-center gap-1.5">
                  <Lock size={10} className={isFinalHour ? "animate-pulse" : ""} />
                  <span>Time Capsule</span>
                </span>
                <span>Locked</span>
              </div>

              {/* Main Locked Content */}
              <div className="flex flex-col items-center gap-6 mt-6 max-w-sm">
                {/* Breathing Lock Seal */}
                <motion.div
                  animate={isFinalHour ? {
                    scale: [1, 1.08, 1],
                    boxShadow: [
                      "0 0 20px rgba(245, 158, 11, 0.05)",
                      "0 0 35px rgba(245, 158, 11, 0.15)",
                      "0 0 20px rgba(245, 158, 11, 0.05)"
                    ]
                  } : {
                    scale: [1, 1.03, 1],
                    boxShadow: [
                      "0 0 10px rgba(113, 90, 72, 0.03)",
                      "0 0 20px rgba(113, 90, 72, 0.08)",
                      "0 0 10px rgba(113, 90, 72, 0.03)"
                    ]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: isFinalHour ? 1.8 : 3.5,
                    ease: "easeInOut"
                  }}
                  className={`p-5 rounded-full border-2 bg-surface/90 dark:bg-stone-900/90 shadow-md text-tertiary flex items-center justify-center cursor-help transition-colors duration-1000 ${
                    isFinalHour ? "border-amber-400/35 text-amber-500" : "border-outline-variant/30 text-outline"
                  }`}
                >
                  <Lock size={28} />
                </motion.div>

                {/* Poetic Message */}
                <div className="flex flex-col gap-2">
                  <h3 className="font-cormorant italic text-lg sm:text-xl text-on-surface font-light tracking-wide">
                    Some words are meant for later.
                  </h3>
                  <p className="font-sans text-[10px] text-on-surface-variant/75 leading-relaxed tracking-wide">
                    Pesan hati ini sedang tersimpan rapat di dalam kapsul waktu, menanti saat yang paling indah untuk terucap.
                  </p>
                </div>

                {/* Large Spaced Countdown */}
                <div className="flex flex-col gap-1 items-center mt-3">
                  <span className="font-sans text-[7px] text-outline-variant uppercase tracking-[0.25em] font-bold">
                    {isFinalHour ? "Almost time" : "Time remaining"}
                  </span>
                  <div className="font-cormorant italic text-3xl sm:text-4xl tracking-[0.1em] text-on-surface font-light select-none">
                    {countdownStr}
                  </div>
                </div>
              </div>

              {/* Card Bottom: Sender and Seal Decoration */}
              <div className="absolute bottom-6 left-8 right-8 flex justify-between items-center w-auto font-sans text-[8px] sm:text-[9px] uppercase tracking-[0.25em] text-on-surface-variant/40 border-t border-outline-variant/15 pt-3">
                <span>To: {message.to || "Seseorang"}</span>
                <span className="flex items-center gap-1">
                  <Sparkles size={8} className="text-amber-400" />
                  Patiently Waiting
                </span>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="unlocked-letter"
              initial={{ 
                opacity: 0, 
                scale: 0.95, 
                rotateX: 12, 
                y: 10 
              }}
              animate={{ 
                opacity: 1, 
                scale: 1, 
                rotateX: 0, 
                y: 0 
              }}
              transition={{ 
                duration: 1.2, 
                ease: [0.16, 1, 0.3, 1] 
              }}
              onMouseMove={handleMouseMove}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              style={{
                transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
                boxShadow: isHovered 
                  ? `${shadowX}px ${shadowY}px 45px rgba(0, 0, 0, 0.03), ${shadowX * 1.5}px ${shadowY * 1.5}px 80px rgba(0, 0, 0, 0.015)` 
                  : undefined,
                transition: isHovered ? "none" : "transform 0.6s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.6s ease"
              }}
              className="floating-letter-card w-full rounded-[24px] sm:rounded-[32px] p-6 sm:p-10 md:p-14 relative flex flex-col justify-between overflow-hidden group text-left"
            >
              {/* Subtle Mood Tint Overlay */}
              {message.mood === "romantic" && <div className="absolute inset-0 bg-rose-400/[0.012] pointer-events-none -z-10" />}
              {message.mood === "nostalgic" && <div className="absolute inset-0 bg-amber-400/[0.012] pointer-events-none -z-10" />}
              {message.mood === "midnight" && <div className="absolute inset-0 bg-indigo-400/[0.012] pointer-events-none -z-10" />}
              {message.mood === "healing" && <div className="absolute inset-0 bg-teal-400/[0.012] pointer-events-none -z-10" />}
              
              {/* Spotlight glow on hover */}
              {isHovered && (
                <div 
                  className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[32px]" 
                  style={{ 
                    background: `radial-gradient(circle 240px at ${lightX}px ${lightY}px, rgba(255,255,255,0.06) 0%, transparent 80%)` 
                  }} 
                />
              )}

              {/* Card Top Section */}
              <div className="flex flex-col md:flex-row md:justify-between md:items-start w-full relative z-10 gap-4 mb-6">
                {message.to ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="font-sans text-[10px] uppercase tracking-[0.25em] text-on-surface-variant/80 pb-3 md:pb-0 border-b md:border-b-0 border-outline-variant/15 w-full md:w-auto text-left"
                  >
                    <span className="text-outline-variant/80 mr-1">To:</span> {message.to}
                  </motion.div>
                ) : (
                  <div />
                )}

                {message.music && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1, duration: 0.8 }}
                    className="relative rounded-2xl p-3.5 flex items-center gap-3.5 bg-surface/50 border border-outline-variant/20 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.015)] w-full max-w-[280px] self-start md:self-end md:-mt-3 overflow-hidden"
                  >
                    {message.music.artworkUrl && (
                      <div 
                        className="absolute -inset-4 bg-cover bg-center blur-xl opacity-15 pointer-events-none"
                        style={{ backgroundImage: `url(${message.music.artworkUrl})` }}
                      />
                    )}

                    <div className="w-10 h-10 rounded-full overflow-hidden bg-stone-200/50 dark:bg-stone-800/50 flex-shrink-0 shadow-md relative flex items-center justify-center border border-outline-variant/20">
                      {message.music.artworkUrl ? (
                        <img 
                          src={message.music.artworkUrl} 
                          alt={message.music.title} 
                          className={`w-full h-full object-cover transition-transform duration-[12000ms] ease-linear ${isPlaying ? 'rotate-360 [animation-iteration-count:infinite] animate-spin' : ''}`} 
                        />
                      ) : (
                        <Music size={15} className="text-tertiary" />
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
                    
                    <div className="flex-grow min-w-0 z-10 text-left">
                      <h4 className="text-[11px] font-bold text-on-surface truncate leading-snug">
                        {message.music.title}
                      </h4>
                      <p className="font-sans text-[8px] text-on-surface-variant/80 uppercase tracking-widest truncate mt-0.5">
                        {message.music.artist}
                      </p>
                    </div>

                    {message.music.previewUrl && (
                      <button 
                        onClick={togglePlay}
                        className="w-7 h-7 rounded-full bg-tertiary text-white flex items-center justify-center flex-shrink-0 hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer z-10"
                      >
                        {isPlaying ? (
                          <div className="w-2.5 h-2.5 flex gap-[1.5px] justify-center items-center">
                            <div className="w-[1.8px] h-[7px] bg-white rounded-sm" />
                            <div className="w-[1.8px] h-[7px] bg-white rounded-sm" />
                          </div>
                        ) : (
                          <div className="w-0 h-0 border-t-[3px] border-t-transparent border-l-[6.5px] border-l-white border-b-[3px] border-b-transparent ml-0.5" />
                        )}
                      </button>
                    )}

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

              {/* Letter Content ruled sheet */}
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="w-full relative z-10 flex flex-col justify-start"
              >
                <div className="flex flex-col gap-6 my-4 sm:my-8 text-on-surface text-left">
                  {paragraphs.map((para, idx) => (
                    <motion.p 
                      key={idx}
                      variants={paragraphVariants}
                      className="font-cormorant font-light text-[18px] sm:text-[21px] md:text-[23px] leading-[1.8] md:leading-[2] tracking-wide text-justify antialiased whitespace-pre-wrap italic border-b border-dashed border-outline-variant/10 pb-4"
                    >
                      {para}
                    </motion.p>
                  ))}
                </div>

                <motion.div 
                  variants={paragraphVariants}
                  className="w-10 h-[1px] bg-outline-variant/30 my-6 sm:my-8 mx-auto"
                />

                <motion.div 
                  variants={paragraphVariants}
                  className="flex flex-col items-center gap-2"
                >
                  <div className="flex flex-col items-center gap-1">
                    <span className="font-sans text-[8px] sm:text-[9px] uppercase tracking-[0.25em] text-outline-variant/80">
                      With warmth,
                    </span>
                    <span className="font-cormorant italic text-xl sm:text-2xl text-on-surface font-medium">
                      {message.author}
                    </span>
                  </div>
                  <div className="font-sans text-[8px] sm:text-[9px] uppercase tracking-[0.2em] text-on-surface-variant/60">
                    {message.dateDetail || message.date}
                  </div>
                </motion.div>

                <motion.div 
                  variants={paragraphVariants}
                  className="mt-10 sm:mt-12 text-center"
                >
                  <p className="font-cormorant italic text-[11px] sm:text-xs tracking-[0.2em] text-on-surface-variant/65 font-light select-none">
                    “This message was sent with love.”
                  </p>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Floating share capsule */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 1 }}
        className="flex justify-center gap-4 mt-8 relative z-10 pb-16"
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
          className="flex items-center gap-2 font-sans text-[10px] font-bold text-on-surface-variant/85 hover:text-on-surface transition-all uppercase tracking-widest bg-surface/50 backdrop-blur-sm border border-outline-variant/30 px-6 py-3 rounded-full shadow-sm hover:shadow hover:bg-surface transition-all duration-300 cursor-pointer"
        >
          <Share2 size={12} />
          Bagikan Pesan
        </button>
      </motion.div>
      {/* Cinematic Reveal Overlay when countdown hits zero */}
      <AnimatePresence>
        {hasUnlockedNow && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex flex-col justify-center items-center bg-surface/98 backdrop-blur-md px-6 text-center select-none"
          >
            {/* Ambient burst glow */}
            <div className="absolute w-80 h-80 rounded-full bg-amber-500/10 blur-[100px] animate-pulse pointer-events-none" />

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.05, opacity: 0 }}
              transition={{ delay: 0.3, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center gap-6 max-w-md relative z-10"
            >
              <motion.img
                src="/bunga.png"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 object-contain grayscale opacity-60 botanical-blend"
                alt="Flower logo spinning"
                onError={(e) => {
                  e.currentTarget.src = "https://lh3.googleusercontent.com/aida-public/AB6AXuA4yoTfA0SrA3aLIOt_jkUdOqiYrhtFo6ma3qiMxqkGrCmRwhw4D7gy47CSS6DTBd585IScC9gjZPw9l1cMv9AYyRkR_7AdkH_-yJgE4uJrsGr6s2Dha0zBeZ1600e0QKnBtLlcumAp4X7vQJAFux2rf8nV3AleHL_LZ_3kgQ3qLv5LV_dnsLPjKpEsfsip60dRB0e8A8PwfOb4zIguNW0YwTGWxdBiNU_4Nu-BTyRcl0WflBzla-ASoe5sfiNSWefXRKaoRfpRNqg";
                }}
              />
              <div className="flex flex-col gap-2">
                <h2 className="font-cormorant italic text-3xl sm:text-4xl text-on-surface font-light tracking-wide leading-tight">
                  The wait is over.
                </h2>
                <p className="font-sans text-xs uppercase tracking-[0.25em] text-outline mt-2">
                  Your message has arrived.
                </p>
              </div>
              <p className="font-cormorant italic text-sm text-on-surface-variant max-w-xs leading-relaxed mt-1">
                "Some words needed time to arrive. Now, they are ready to be read."
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

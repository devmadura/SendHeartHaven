"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Search, Music, Loader2, AlertCircle, CheckCircle2, Heart, Sparkles, Coffee, Moon, Feather } from "lucide-react";

import { submitMessage } from "@/app/actions";
import { checkBadWords } from "@/lib/badwords";
import Script from "next/script";

interface MusicResult {
  id: string;
  title: string;
  artist: string;
  previewUrl?: string;
  artworkUrl?: string;
}

type MoodType = "romantic" | "nostalgic" | "midnight" | "healing" | "soft";

// Immersive floating particles that change color based on selected mood
function MoodParticles({ mood }: { mood: MoodType }) {
  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 16 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      bottom: Math.random() * 30,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 12 + 10,
      delay: Math.random() * -10,
      xMove: Math.random() * 30 - 15,
    }));
    setParticles(newParticles);
  }, [mood]);

  const colorClass = {
    romantic: "bg-rose-300/30 dark:bg-rose-500/15",
    nostalgic: "bg-amber-300/30 dark:bg-amber-500/15",
    healing: "bg-teal-300/30 dark:bg-teal-500/15",
    midnight: "bg-indigo-300/30 dark:bg-indigo-500/15",
    soft: "bg-stone-300/30 dark:bg-stone-500/15",
  }[mood];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className={`absolute rounded-full blur-[0.5px] ${colorClass}`}
          style={{
            left: `${p.left}%`,
            bottom: `${p.bottom}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
          }}
          animate={{
            y: [0, -320],
            x: [0, p.xMove],
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
  );
}

export function ComposeView() {
  const router = useRouter();
  const [selectedMusic, setSelectedMusic] = useState<MusicResult | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<MusicResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; type: "success" | "error"; message: string } | null>(null);

  const [toText, setToText] = useState("");
  const [contentText, setContentText] = useState("");
  const [authorText, setAuthorText] = useState("");

  // Emotional Mood State
  const [selectedMood, setSelectedMood] = useState<MoodType>("soft");

  // Audio Preview States
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

  // Reset playback if selected music changes or is removed
  useEffect(() => {
    setIsPlaying(false);
    setProgress(0);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [selectedMusic]);

  const showToast = (message: string, type: "success" | "error" = "error") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const to = formData.get("to") as string;
    const content = formData.get("content") as string;
    const author = formData.get("author") as string;

    if (!to || !to.trim()) {
      showToast("Tolong isi untuk siapa pesan ini ditujukan, ya.", "error");
      return;
    }

    if (!content || !content.trim()) {
      showToast("Pesan hatimu masih kosong, ceritakanlah sesuatu.", "error");
      return;
    }

    // Client-side bad words filter
    const toCheck = checkBadWords(to);
    const contentCheck = checkBadWords(content);
    const authorCheck = checkBadWords(author);

    if (toCheck.hasBadWords || contentCheck.hasBadWords || authorCheck.hasBadWords) {
      showToast("Pesan Anda mengandung kata-kata yang tidak diperbolehkan. Mari gunakan tutur kata yang baik.", "error");
      return;
    }

    setIsSubmitting(true);

    if (selectedMusic) {
      formData.append("musicData", JSON.stringify(selectedMusic));
    }

    const result = await submitMessage(formData);

    if (result.success) {
      showToast("Pesanmu berhasil terkirim!", "success");
      setTimeout(() => {
        router.push("/library");
      }, 1500);
    } else {
      console.error(result.error);
      showToast(result.error || "Gagal mengirim pesan. Silakan coba lagi nanti.", "error");
      setIsSubmitting(false);
    }
  };

  // iTunes Music Fetching logic
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(searchQuery)}&entity=song&limit=4`);
        const data = await res.json();
        const results: MusicResult[] = data.results.map((track: any) => ({
          id: track.trackId.toString(),
          title: track.trackName,
          artist: track.artistName,
          previewUrl: track.previewUrl,
          artworkUrl: track.artworkUrl100,
        }));
        setSearchResults(results);
      } catch (error) {
        console.error("Failed to fetch music", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Mood configuration mapping to glow styles
  const moodGlows: Record<MoodType, string> = {
    romantic: "from-rose-500/12 via-rose-500/5 to-transparent",
    nostalgic: "from-amber-500/12 via-amber-500/5 to-transparent",
    healing: "from-teal-500/12 via-teal-500/5 to-transparent",
    midnight: "from-indigo-500/12 via-indigo-500/5 to-transparent",
    soft: "from-tertiary/10 via-primary/5 to-transparent",
  };

  const moodTones = [
    { type: "romantic" as MoodType, icon: <Heart size={12} />, label: "Romantic", color: "text-rose-400 border-rose-400/35 bg-rose-400/5" },
    { type: "nostalgic" as MoodType, icon: <Sparkles size={12} />, label: "Nostalgic", color: "text-amber-400 border-amber-400/35 bg-amber-400/5" },
    { type: "midnight" as MoodType, icon: <Moon size={12} />, label: "Midnight", color: "text-indigo-400 border-indigo-400/35 bg-indigo-400/5" },
    { type: "healing" as MoodType, icon: <Coffee size={12} />, label: "Healing", color: "text-teal-400 border-teal-400/35 bg-teal-400/5" },
    { type: "soft" as MoodType, icon: <Feather size={12} />, label: "Soft", color: "text-stone-400 border-stone-400/35 bg-stone-400/5" }
  ];

  return (
    <>
      {/* Toast Alert */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-8 left-1/2 -translate-x-1/2 z-[100] px-6 py-4 rounded-xl shadow-lg border flex items-center gap-3 backdrop-blur-md font-sans tracking-wide ${toast.type === "error"
              ? "bg-red-50/90 border-red-200 text-red-800 shadow-red-500/10"
              : "bg-stone-50/90 border-tertiary/30 text-on-surface shadow-tertiary/10"
              }`}
          >
            {toast.type === "error" ? (
              <AlertCircle size={18} className="text-red-500 shrink-0" />
            ) : (
              <CheckCircle2 size={18} className="text-tertiary shrink-0" />
            )}
            <span className="font-medium text-xs">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Atmospheric dynamic mood glow behind write card */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 transition-all duration-1000">
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-96 bg-gradient-to-tr ${moodGlows[selectedMood]} rounded-full blur-[140px] pointer-events-none transition-all duration-1000`} />
      </div>

      {/* Floating active mood particles */}
      <MoodParticles mood={selectedMood} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-lg px-4 sm:px-6 py-8 sm:py-16 mx-auto relative z-10"
      >
        {/* Floating Paper Writing Surface */}
        <div className="floating-letter-card w-full rounded-[26px] p-6 sm:p-10 md:p-12 relative z-10 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.02)] flex flex-col justify-start">

          {/* Header */}
          <div className="text-center flex flex-col gap-3 items-center relative mb-8 border-b border-outline-variant/15 pb-6">
            <motion.img
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              src="/bunga.png"
              className="w-10 h-10 object-contain grayscale opacity-45 botanical-blend"
              alt="Flower seal decor"
              onError={(e) => {
                e.currentTarget.src = "https://lh3.googleusercontent.com/aida-public/AB6AXuA4yoTfA0SrA3aLIOt_jkUdOqiYrhtFo6ma3qiMxqkGrCmRwhw4D7gy47CSS6DTBd585IScC9gjZPw9l1cMv9AYyRkR_7AdkH_-yJgE4uJrsGr6s2Dha0zBeZ1600e0QKnBtLlcumAp4X7vQJAFux2rf8nV3AleHL_LZ_3kgQ3qLv5LV_dnsLPjKpEsfsip60dRB0e8A8PwfOb4zIguNW0YwTGWxdBiNU_4Nu-BTyRcl0WflBzla-ASoe5sfiNSWefXRKaoRfpRNqg";
              }}
            />
            <h1 className="text-2xl sm:text-3xl text-on-surface font-cormorant font-light">
              Tuliskan Isi Hatimu
            </h1>
            <p className="font-sans text-[8px] tracking-[0.25em] uppercase text-on-surface-variant/75">
              Sampaikan apa yang tak sempat terucap
            </p>
          </div>

          {/* Interactive Mood Selector */}
          <div className="flex flex-col gap-2.5 mb-6 w-full">
            <label className="font-sans text-[8px] text-outline-variant uppercase tracking-[0.2em] font-medium text-center">
              Pilih Suasana Hati
            </label>
            <div className="flex flex-wrap justify-center gap-1.5">
              {moodTones.map((item) => (
                <button
                  key={item.type}
                  type="button"
                  onClick={() => setSelectedMood(item.type)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-[9px] uppercase tracking-wider font-sans transition-all duration-300 cursor-pointer ${selectedMood === item.type
                      ? `${item.color} border-current font-bold scale-[1.04]`
                      : "border-outline-variant/20 text-on-surface-variant/70 hover:border-outline-variant hover:text-on-surface"
                    }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Main Compose Form */}
          <form className="flex flex-col gap-6" onSubmit={handleSubmit} noValidate>
            <input type="hidden" name="mood" value={selectedMood} />

            {/* Input "Kepada Siapa" */}
            <div className="flex flex-col gap-1.5 text-left">
              <label className="font-sans text-[8px] text-outline-variant uppercase tracking-[0.2em] font-bold">
                Kepada Siapa?
              </label>
              <input
                type="text"
                name="to"
                value={toText}
                onChange={(e) => setToText(e.target.value)}
                placeholder="Siapa penerima pesan ini? (misal: Masa Laluku, Ibuku, Seseorang...)"
                className="bg-transparent border-0 border-b border-outline-variant/30 focus:border-tertiary focus:ring-0 px-0 py-2 text-sm sm:text-base font-cormorant italic transition-colors rounded-none outline-none text-on-surface placeholder:text-on-surface-variant/40"
              />
            </div>

            {/* Input "Pesan Hati" */}
            <div className="flex flex-col gap-1.5 text-left">
              <label className="font-sans text-[8px] text-outline-variant uppercase tracking-[0.2em] font-bold">
                Pesan Hati
              </label>
              <textarea
                name="content"
                rows={9}
                value={contentText}
                onChange={(e) => setContentText(e.target.value)}
                placeholder="Write something you could never say directly…"
                className="letter-textarea w-full px-2 py-4 focus:ring-0 focus:outline-none placeholder:text-on-surface-variant/30 transition-all text-on-surface resize-none"
              />
            </div>

            {/* iTunes Music Postage stamp mini-player */}
            <div className="flex flex-col gap-2.5 text-left">
              <label className="font-sans text-[8px] text-outline-variant uppercase tracking-[0.2em] font-bold">
                Musik Latar (Opsional)
              </label>

              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari lagu dari iTunes..."
                  className="w-full bg-transparent border-0 border-b border-outline-variant/30 focus:border-tertiary focus:ring-0 px-0 py-2 text-xs font-sans transition-colors rounded-none outline-none pr-10 text-on-surface placeholder:text-on-surface-variant/40"
                />
                <Search
                  className="absolute right-0 top-2 text-outline-variant/50"
                  size={14}
                />
              </div>

              {/* Search Results & Integrated Mini Stamp */}
              <div className="flex flex-col gap-2 mt-1">
                {isSearching && (
                  <div className="text-[10px] text-on-surface-variant/70 italic py-1 flex items-center gap-2">
                    <Loader2 size={12} className="animate-spin" /> Mencari musik...
                  </div>
                )}
                {!isSearching && searchResults.length === 0 && searchQuery.trim() !== "" && (
                  <div className="text-[10px] text-on-surface-variant/70 italic py-1">Tidak menemukan lagu.</div>
                )}

                {/* postage-stamp selected player */}
                {selectedMusic && searchResults.length === 0 && searchQuery.trim() === "" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative rounded-2xl p-4 flex items-center gap-4 bg-surface/50 border border-outline-variant/30 shadow-[0_10px_30px_rgba(0,0,0,0.02)] transition-colors duration-700 overflow-hidden group/stamp"
                  >
                    {/* Blurred background glow */}
                    {selectedMusic.artworkUrl && (
                      <div
                        className="absolute -inset-4 bg-cover bg-center blur-2xl opacity-15 pointer-events-none transition-all duration-700"
                        style={{ backgroundImage: `url(${selectedMusic.artworkUrl})` }}
                      />
                    )}

                    <div className="w-11 h-11 rounded-xl overflow-hidden bg-stone-200/50 dark:bg-stone-800/50 flex-shrink-0 shadow-md relative flex items-center justify-center border border-outline-variant/20">
                      {selectedMusic.artworkUrl ? (
                        <img
                          src={selectedMusic.artworkUrl}
                          alt={selectedMusic.title}
                          className={`w-full h-full object-cover transition-transform duration-[12000ms] ease-linear ${isPlaying ? 'rotate-360 [animation-iteration-count:infinite] animate-spin' : ''}`}
                        />
                      ) : (
                        <Music size={16} className="text-tertiary" />
                      )}
                      {isPlaying && (
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center backdrop-blur-[0.5px]">
                          <div className="w-3.5 h-3.5 flex justify-between items-end gap-[1.5px] px-[1px]">
                            <motion.div animate={{ height: ["2px", "10px", "2px"] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-[2.2px] bg-white rounded-t-sm" />
                            <motion.div animate={{ height: ["4px", "12px", "4px"] }} transition={{ repeat: Infinity, duration: 1.2 }} className="w-[2.2px] bg-white rounded-t-sm" />
                            <motion.div animate={{ height: ["3px", "8px", "3px"] }} transition={{ repeat: Infinity, duration: 0.9 }} className="w-[2.2px] bg-white rounded-t-sm" />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex-grow min-w-0 z-10">
                      <h4 className="text-[11px] font-bold text-on-surface truncate leading-snug">
                        {selectedMusic.title}
                      </h4>
                      <p className="font-sans text-[8px] text-on-surface-variant/80 uppercase tracking-widest truncate mt-0.5">
                        {selectedMusic.artist}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 z-10">
                      {selectedMusic.previewUrl && (
                        <button
                          type="button"
                          onClick={togglePlay}
                          className="w-7 h-7 rounded-full bg-tertiary text-white flex items-center justify-center flex-shrink-0 hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer"
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

                      <button
                        type="button"
                        onClick={() => setSelectedMusic(null)}
                        className="text-[8px] uppercase tracking-widest font-sans font-bold text-red-500 hover:text-red-600 transition-colors border border-red-500/10 bg-red-500/5 px-2.5 py-1.5 rounded-full cursor-pointer flex-shrink-0"
                      >
                        Hapus
                      </button>
                    </div>

                    {/* Progress slider */}
                    {selectedMusic.previewUrl && (
                      <div className="absolute bottom-0 left-0 w-full h-[1.5px] bg-tertiary/10">
                        <div
                          className="h-full bg-tertiary transition-all duration-100 ease-linear"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    )}

                    {selectedMusic.previewUrl && (
                      <audio
                        ref={audioRef}
                        src={selectedMusic.previewUrl}
                        onTimeUpdate={handleTimeUpdate}
                        onEnded={handleEnded}
                        className="hidden"
                      />
                    )}
                  </motion.div>
                )}

                {/* iTunes result suggestions as capsules */}
                {searchResults.map((song) => (
                  <button
                    key={song.id}
                    type="button"
                    onClick={() => {
                      setSelectedMusic(song);
                      setSearchQuery("");
                      setSearchResults([]);
                    }}
                    className={`flex items-center gap-3 p-2 rounded-xl transition-all text-left border ${selectedMusic?.id === song.id
                        ? "bg-surface-container border-tertiary/20"
                        : "hover:bg-surface-container/30 border-outline-variant/10 bg-transparent"
                      }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-surface-container-highest flex items-center justify-center text-outline-variant overflow-hidden flex-shrink-0 shadow-sm">
                      {song.artworkUrl ? (
                        <img src={song.artworkUrl} alt={song.title} className="w-full h-full object-cover" />
                      ) : (
                        <Music size={12} />
                      )}
                    </div>
                    <div className="flex-grow min-w-0">
                      <h4 className="text-[10px] font-semibold text-on-surface truncate">
                        {song.title}
                      </h4>
                      <p className="font-sans text-[8px] text-on-surface-variant/80 uppercase tracking-widest truncate mt-0.5">
                        {song.artist}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Input "Dari" */}
            <div className="flex flex-col gap-1.5 text-left">
              <label className="font-sans text-[8px] text-outline-variant uppercase tracking-[0.2em] font-bold">
                Dari (Opsional)
              </label>
              <input
                type="text"
                name="author"
                value={authorText}
                onChange={(e) => setAuthorText(e.target.value)}
                placeholder="Nama Anda atau inisial (misal: Pengagum Rahasia, Anonim...)"
                className="bg-transparent border-0 border-b border-outline-variant/30 focus:border-tertiary focus:ring-0 px-0 py-2 text-sm sm:text-base font-cormorant italic transition-colors rounded-none outline-none text-on-surface placeholder:text-on-surface-variant/40"
              />
            </div>

            {/* Turnstile Security and Submit button */}
            <div className="mt-4 flex flex-col items-center gap-4">
              {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && (
                <div className="mb-1">
                  <div className="cf-turnstile" data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}></div>
                </div>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={!toText.trim() || !contentText.trim() || isSubmitting}
                className="font-sans text-[9px] sm:text-[10px] font-bold text-white bg-tertiary border border-tertiary/20 px-10 py-3.5 hover:bg-tertiary/95 transition-all duration-300 uppercase tracking-[0.25em] flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed rounded-full shadow-[0_4px_18px_rgba(113,90,72,0.12)] cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={12} className="animate-spin" />
                    <span>Menerbangkan...</span>
                  </>
                ) : (
                  <span>Bagikan Pesan</span>
                )}
              </motion.button>
            </div>
          </form>
        </div>

        <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="lazyOnload" />
      </motion.div>
    </>
  );
}

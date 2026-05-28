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
    romantic: "from-rose-500/10 via-rose-500/5 to-transparent",
    nostalgic: "from-amber-500/10 via-amber-500/5 to-transparent",
    midnight: "from-indigo-500/10 via-indigo-500/5 to-transparent",
    healing: "from-teal-500/10 via-teal-500/5 to-transparent",
    soft: "from-tertiary/10 via-primary/5 to-transparent",
  };

  const moodTones = [
    { type: "romantic" as MoodType, icon: <Heart size={13} />, label: "Romantic", color: "text-rose-400 border-rose-400/30 bg-rose-400/5" },
    { type: "nostalgic" as MoodType, icon: <Sparkles size={13} />, label: "Nostalgic", color: "text-amber-400 border-amber-400/30 bg-amber-400/5" },
    { type: "midnight" as MoodType, icon: <Moon size={13} />, label: "Midnight", color: "text-indigo-400 border-indigo-400/30 bg-indigo-400/5" },
    { type: "healing" as MoodType, icon: <Coffee size={13} />, label: "Healing", color: "text-teal-400 border-teal-400/30 bg-teal-400/5" },
    { type: "soft" as MoodType, icon: <Feather size={13} />, label: "Soft", color: "text-stone-400 border-stone-400/30 bg-stone-400/5" }
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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-2xl px-4 sm:px-6 py-16 mx-auto relative z-10"
      >
        {/* Floating Paper Writing Surface */}
        <div className="floating-letter-card w-full rounded-[24px] p-8 sm:p-12 md:p-16 relative z-10 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.03)] flex flex-col justify-start">
          
          {/* Header */}
          <div className="text-center flex flex-col gap-4 items-center relative mb-12 border-b border-outline-variant/20 pb-8">
            <motion.img
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA4yoTfA0SrA3aLIOt_jkUdOqiYrhtFo6ma3qiMxqkGrCmRwhw4D7gy47CSS6DTBd585IScC9gjZPw9l1cMv9AYyRkR_7AdkH_-yJgE4uJrsGr6s2Dha0zBeZ1600e0QKnBtLlcumAp4X7vQJAFux2rf8nV3AleHL_LZ_3kgQ3qLv5LV_dnsLPjKpEsfsip60dRB0e8A8PwfOb4zIguNW0YwTGWxdBiNU_4Nu-BTyRcl0WflBzla-ASoe5sfiNSWefXRKaoRfpRNqg"
              className="w-12 h-12 object-cover grayscale opacity-50 botanical-blend"
              alt="Decorative flower"
            />
            <h1 className="text-3xl md:text-4xl text-on-surface font-cormorant font-light">
              Tuliskan Isi Hatimu
            </h1>
            <p className="font-sans text-[10px] tracking-[0.25em] uppercase text-on-surface-variant/75">
              Sampaikan apa yang tak sempat terucap
            </p>
          </div>

          {/* Interactive Mood Selector */}
          <div className="flex flex-col gap-3 mb-8 w-full">
            <label className="font-sans text-[9px] text-outline-variant uppercase tracking-[0.2em] font-medium text-center">
              Pilih Suasana Hati
            </label>
            <div className="flex flex-wrap justify-center gap-2">
              {moodTones.map((item) => (
                <button
                  key={item.type}
                  type="button"
                  onClick={() => setSelectedMood(item.type)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full border text-[10px] uppercase tracking-wider font-sans transition-all duration-300 cursor-pointer ${
                    selectedMood === item.type 
                      ? `${item.color} border-current font-bold scale-[1.05]` 
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
          <form className="flex flex-col gap-8" onSubmit={handleSubmit} noValidate>
            <input type="hidden" name="mood" value={selectedMood} />
            
            {/* Input "Kepada Siapa" */}
            <div className="flex flex-col gap-2">
              <label className="font-sans text-[9px] text-outline-variant uppercase tracking-[0.2em] font-semibold">
                Kepada Siapa?
              </label>
              <input
                type="text"
                name="to"
                value={toText}
                onChange={(e) => setToText(e.target.value)}
                placeholder="Siapa penerima pesan ini? (misal: Seseorang, Masa Laluku, Ibuku...)"
                className="bg-transparent border-0 border-b border-tertiary/15 focus:border-tertiary focus:ring-0 px-0 py-2 text-base font-cormorant italic transition-colors rounded-none outline-none text-on-surface"
              />
            </div>

            {/* Input "Pesan Hati" */}
            <div className="flex flex-col gap-2">
              <label className="font-sans text-[9px] text-outline-variant uppercase tracking-[0.2em] font-semibold">
                Pesan Hati
              </label>
              <textarea
                name="content"
                rows={8}
                value={contentText}
                onChange={(e) => setContentText(e.target.value)}
                placeholder="Tuliskan sesuatu yang tidak pernah sanggup kamu katakan secara langsung..."
                className="bg-transparent border-0 border-b border-tertiary/15 focus:border-tertiary focus:ring-0 px-0 py-2 text-base font-cormorant italic transition-colors resize-none rounded-none outline-none leading-relaxed text-on-surface"
              />
            </div>

            {/* Redesigned Music Search and postage mini player */}
            <div className="flex flex-col gap-3">
              <label className="font-sans text-[9px] text-outline-variant uppercase tracking-[0.2em] font-semibold">
                Musik Latar (Opsional)
              </label>
              
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari lagu dari iTunes..."
                  className="w-full bg-transparent border-0 border-b border-tertiary/15 focus:border-tertiary focus:ring-0 px-0 py-2 text-sm font-sans transition-colors rounded-none outline-none pr-10 text-on-surface"
                />
                <Search
                  className="absolute right-0 top-2 text-outline-variant/60"
                  size={16}
                />
              </div>

              {/* Music Search Results / Selected stamp player */}
              <div className="flex flex-col gap-2 mt-1">
                {isSearching && (
                  <div className="text-xs text-on-surface-variant/70 italic py-1 flex items-center gap-2">
                    <Loader2 size={12} className="animate-spin" /> Mencari musik...
                  </div>
                )}
                {!isSearching && searchResults.length === 0 && searchQuery.trim() !== "" && (
                  <div className="text-xs text-on-surface-variant/70 italic py-1">Tidak menemukan lagu.</div>
                )}

                {/* Postage Stamp music preview when selected */}
                {selectedMusic && searchResults.length === 0 && searchQuery.trim() === "" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="music-postage-stamp rounded-2xl p-3 flex items-center gap-3 shadow-[0_4px_15px_rgba(0,0,0,0.01)] border border-outline-variant/20 relative group/stamp overflow-hidden"
                  >
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-stone-200/50 dark:bg-stone-800/50 flex-shrink-0 shadow-sm relative flex items-center justify-center">
                      {selectedMusic.artworkUrl ? (
                        <img 
                          src={selectedMusic.artworkUrl} 
                          alt={selectedMusic.title} 
                          className={`w-full h-full object-cover transition-transform duration-1000 ${isPlaying ? 'animate-spin [animation-duration:12s]' : ''}`} 
                        />
                      ) : (
                        <Music size={14} className="text-tertiary" />
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
                    
                    <div className="flex-grow min-w-0">
                      <h4 className="text-[11px] font-semibold text-on-surface truncate">
                        {selectedMusic.title}
                      </h4>
                      <p className="font-sans text-[9px] text-on-surface-variant/80 uppercase tracking-wider truncate mt-0.5">
                        {selectedMusic.artist}
                      </p>
                    </div>

                    {selectedMusic.previewUrl && (
                      <button 
                        type="button"
                        onClick={togglePlay}
                        className="w-7 h-7 rounded-full bg-tertiary text-white flex items-center justify-center flex-shrink-0 hover:scale-105 active:scale-95 transition-all shadow-sm cursor-pointer"
                      >
                        {isPlaying ? (
                          <div className="w-2 h-2 flex gap-[1.5px] justify-center items-center">
                            <div className="w-[1.5px] h-[6.5px] bg-white rounded-sm" />
                            <div className="w-[1.5px] h-[6.5px] bg-white rounded-sm" />
                          </div>
                        ) : (
                          <div className="w-0 h-0 border-t-[3.5px] border-t-transparent border-l-[6.5px] border-l-white border-b-[3.5px] border-b-transparent ml-0.5" />
                        )}
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setSelectedMusic(null)}
                      className="text-[9px] uppercase tracking-widest font-sans font-bold text-on-surface-variant/60 hover:text-red-500 transition-colors border border-outline-variant/30 px-3 py-1.5 rounded-full cursor-pointer flex-shrink-0"
                    >
                      Hapus
                    </button>

                    {/* Elegant bottom edge progress bar */}
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

                {/* Search result items styled as sleek capsules */}
                {searchResults.map((song) => (
                  <button
                    key={song.id}
                    type="button"
                    onClick={() => {
                      setSelectedMusic(song);
                      setSearchQuery("");
                      setSearchResults([]);
                    }}
                    className={`flex items-center gap-3 p-2.5 rounded-xl transition-colors text-left border ${
                      selectedMusic?.id === song.id 
                        ? "bg-surface-container border-tertiary/20" 
                        : "hover:bg-surface-container/40 border-outline-variant/10 bg-transparent"
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-surface-container-highest flex items-center justify-center text-outline-variant rounded overflow-hidden flex-shrink-0 shadow-sm">
                      {song.artworkUrl ? (
                        <img src={song.artworkUrl} alt={song.title} className="w-full h-full object-cover" />
                      ) : (
                        <Music size={12} />
                      )}
                    </div>
                    <div className="flex-grow min-w-0">
                      <h4 className="text-[11px] font-medium text-on-surface truncate">
                        {song.title}
                      </h4>
                      <p className="font-sans text-[9px] text-on-surface-variant/80 uppercase tracking-wider truncate">
                        {song.artist}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Input "Dari" */}
            <div className="flex flex-col gap-2">
              <label className="font-sans text-[9px] text-outline-variant uppercase tracking-[0.2em] font-semibold">
                Dari (Opsional)
              </label>
              <input
                type="text"
                name="author"
                value={authorText}
                onChange={(e) => setAuthorText(e.target.value)}
                placeholder="Nama Anda atau inisial (misal: Pengagum Rahasia, Anonim...)"
                className="bg-transparent border-0 border-b border-tertiary/15 focus:border-tertiary focus:ring-0 px-0 py-2 text-base font-cormorant italic transition-colors rounded-none outline-none text-on-surface"
              />
            </div>

            {/* Turnstile Security and Submit button */}
            <div className="mt-8 flex flex-col items-center gap-4">
              {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && (
                <div className="mb-2">
                  <div className="cf-turnstile" data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}></div>
                </div>
              )}
              
              <button
                type="submit"
                disabled={!toText.trim() || !contentText.trim() || isSubmitting}
                className="font-sans text-[10px] font-semibold text-on-surface bg-surface-container/50 backdrop-blur-sm border border-outline/50 px-12 py-4 hover:bg-on-surface hover:text-white hover:border-on-surface transition-all duration-300 uppercase tracking-[0.25em] flex items-center gap-2.5 disabled:opacity-40 disabled:cursor-not-allowed rounded-full shadow-sm hover:shadow-md cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={13} className="animate-spin" />
                    <span>Menerbangkan...</span>
                  </>
                ) : (
                  <span>Bagikan Pesan</span>
                )}
              </button>
            </div>
          </form>
        </div>

        <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="lazyOnload" />
      </motion.div>
    </>
  );
}

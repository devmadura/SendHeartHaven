"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Search, Music, Send, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { submitMessage } from "@/app/actions";
import Script from "next/script";

interface MusicResult {
  id: string;
  title: string;
  artist: string;
  previewUrl?: string;
  artworkUrl?: string;
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

  const showToast = (message: string, type: "success" | "error" = "error") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const to = formData.get("to") as string;
    const content = formData.get("content") as string;

    if (!to || !to.trim()) {
      showToast("Tolong isi untuk siapa pesan ini ditujukan, ya.", "error");
      return;
    }

    if (!content || !content.trim()) {
      showToast("Pesan hatimu masih kosong, ceritakanlah sesuatu.", "error");
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
      showToast("Gagal mengirim pesan. Silakan coba lagi nanti.", "error");
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(searchQuery)}&entity=song&limit=5`);
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

  return (
    <>
      {/* Toast Alert */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-8 left-1/2 -translate-x-1/2 z-[100] px-6 py-4 rounded-xl shadow-lg border flex items-center gap-3 backdrop-blur-md font-sans tracking-wide ${
              toast.type === "error" 
                ? "bg-red-50/90 border-red-200 text-red-800 shadow-red-500/10" 
                : "bg-stone-50/90 border-tertiary/30 text-on-surface shadow-tertiary/10"
            }`}
          >
            {toast.type === "error" ? (
              <AlertCircle size={20} className="text-red-500 shrink-0" />
            ) : (
              <CheckCircle2 size={20} className="text-tertiary shrink-0" />
            )}
            <span className="font-medium text-sm">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        className="w-full max-w-2xl px-6 py-24 mx-auto relative z-10"
      >
        {/* Decorative Accents */}
      <div className="absolute -top-12 -left-8 md:-left-16 opacity-40 z-0">
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuA4yoTfA0SrA3aLIOt_jkUdOqiYrhtFo6ma3qiMxqkGrCmRwhw4D7gy47CSS6DTBd585IScC9gjZPw9l1cMv9AYyRkR_7AdkH_-yJgE4uJrsGr6s2Dha0zBeZ1600e0QKnBtLlcumAp4X7vQJAFux2rf8nV3AleHL_LZ_3kgQ3qLv5LV_dnsLPjKpEsfsip60dRB0e8A8PwfOb4zIguNW0YwTGWxdBiNU_4Nu-BTyRcl0WflBzla-ASoe5sfiNSWefXRKaoRfpRNqg"
          className="w-24 h-24 object-cover grayscale botanical-blend"
          alt=""
        />
      </div>

      <div className="bg-white border border-tertiary/20 p-8 md:p-16 relative z-10 shadow-sm">
        <h1 className="text-3xl text-on-surface mb-12 text-center font-normal">
          Tuliskan Pesan
        </h1>

        <form className="flex flex-col gap-8" onSubmit={handleSubmit} noValidate>
          <div className="flex flex-col gap-2">
            <label className="font-sans text-[11px] text-on-surface-variant font-semibold uppercase tracking-[0.2em]">
              Kepada Siapa?
            </label>
            <input
              type="text"
              name="to"
              value={toText}
              onChange={(e) => setToText(e.target.value)}
              placeholder="Nama penerima..."
              className="bg-transparent border-0 border-b border-tertiary/30 focus:border-tertiary focus:ring-0 px-0 py-2 text-lg italic transition-colors rounded-none outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-sans text-[11px] text-on-surface-variant font-semibold uppercase tracking-[0.2em]">
              Pesan Hati
            </label>
            <textarea
              name="content"
              rows={8}
              value={contentText}
              onChange={(e) => setContentText(e.target.value)}
              placeholder="Tuliskan apa yang ada di pikiranmu..."
              className="bg-transparent border-0 border-b border-tertiary/30 focus:border-tertiary focus:ring-0 px-0 py-2 text-lg italic transition-colors resize-none rounded-none outline-none leading-relaxed"
            />
          </div>

          <div className="flex flex-col gap-4">
            <label className="font-sans text-[11px] text-on-surface-variant font-semibold uppercase tracking-[0.2em]">
              Musik (Opsional)
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari lagu..."
                className="w-full bg-transparent border-0 border-b border-tertiary/30 focus:border-tertiary focus:ring-0 px-0 py-2 text-lg transition-colors rounded-none outline-none pr-10"
              />
              <Search
                className="absolute right-0 top-2 text-outline-variant"
                size={18}
              />
            </div>

            <div className="flex flex-col gap-2">
              {isSearching && (
                <div className="text-sm text-stone-500 italic py-2">Mencari...</div>
              )}
              {!isSearching && searchResults.length === 0 && searchQuery.trim() !== "" && (
                <div className="text-sm text-stone-500 italic py-2">Tidak ditemukan.</div>
              )}
              
              {/* Show selected music at top if not searching or if it's the only one */}
              {selectedMusic && searchResults.length === 0 && searchQuery.trim() === "" && (
                <button
                  type="button"
                  onClick={() => setSelectedMusic(null)}
                  className="flex items-center gap-4 p-3 rounded transition-colors text-left border bg-surface-container-low border-tertiary/20"
                >
                  <div className="w-10 h-10 bg-surface-container-highest flex items-center justify-center text-outline-variant rounded overflow-hidden">
                    {selectedMusic.artworkUrl ? (
                      <img src={selectedMusic.artworkUrl} alt={selectedMusic.title} className="w-full h-full object-cover" />
                    ) : (
                      <Music size={16} />
                    )}
                  </div>
                  <div className="flex-grow">
                    <h4 className="text-sm font-medium text-on-surface">
                      {selectedMusic.title}
                    </h4>
                    <p className="font-sans text-[10px] text-on-surface-variant uppercase tracking-wider">
                      {selectedMusic.artist}
                    </p>
                  </div>
                  <div className="text-xs text-stone-400 hover:text-stone-600">Hapus</div>
                </button>
              )}

              {searchResults.map((song) => (
                <button
                  key={song.id}
                  type="button"
                  onClick={() => setSelectedMusic(song)}
                  className={`flex items-center gap-4 p-3 rounded transition-colors text-left border ${selectedMusic?.id === song.id ? "bg-surface-container-low border-tertiary/20" : "hover:bg-surface-container-lowest border-transparent"}`}
                >
                  <div className="w-10 h-10 bg-surface-container-highest flex items-center justify-center text-outline-variant rounded overflow-hidden">
                    {song.artworkUrl ? (
                      <img src={song.artworkUrl} alt={song.title} className="w-full h-full object-cover" />
                    ) : (
                      <Music size={16} />
                    )}
                  </div>
                  <div className="flex-grow">
                    <h4 className="text-sm font-medium text-on-surface">
                      {song.title}
                    </h4>
                    <p className="font-sans text-[10px] text-on-surface-variant uppercase tracking-wider">
                      {song.artist}
                    </p>
                  </div>
                  {selectedMusic?.id === song.id && (
                    <div className="w-2 h-2 rounded-full bg-tertiary" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-sans text-[11px] text-on-surface-variant font-semibold uppercase tracking-[0.2em]">
              Dari (Opsional)
            </label>
            <input
              type="text"
              name="author"
              placeholder="Inisial atau nama..."
              className="bg-transparent border-0 border-b border-tertiary/30 focus:border-tertiary focus:ring-0 px-0 py-2 text-lg italic transition-colors rounded-none outline-none"
            />
          </div>

          <div className="mt-8 flex flex-col items-center">
            {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && (
              <div className="mb-4">
                <div className="cf-turnstile" data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}></div>
              </div>
            )}
            <button
              type="submit"
              disabled={!toText.trim() || !contentText.trim() || isSubmitting}
              className="font-sans text-xs font-bold text-secondary border border-secondary px-10 py-4 hover:bg-secondary hover:text-white transition-all uppercase tracking-widest flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
              {isSubmitting ? "Mengirim..." : "Bagikan Pesan"}
            </button>
          </div>
        </form>
      </div>

      <div className="absolute -bottom-8 -right-4 md:-right-12 opacity-30 z-0">
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBt2EROZJN4oUSAdT4WKBT5MObdJq2QQAeReA5TLI9KEzQO1whJRNi0rwZnprBjE5YveREaAiQllTD6SVJEI-O50jW7sNgiPTQaRurT7s17pj5ZLybp9SEXTrb6JsqIUyK0wa4fAxzwXS5_0P8hFJ9rC_of7acqdPgC5m7X7A43Gt9EcrmLMpFBENT-jDkAiKOIWaI_NlLGgZrgpZYLYHEHdn0H3hqtSwp0vzyWMvPM6IieTrqEt0cEVPX5RSIebofC7ZoEHy2VHeM"
          className="w-20 h-20 object-cover grayscale botanical-blend"
          alt=""
        />
      </div>
      
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="lazyOnload" />
      </motion.div>
    </>
  );
}

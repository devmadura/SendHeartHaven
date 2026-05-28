"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { getAllMessages } from "@/lib/data";
import { checkBadWords } from "@/lib/badwords";

export async function loadMoreMessages(searchQuery: string | undefined, page: number) {
  return await getAllMessages(searchQuery, page, 10);
}

export async function submitMessage(formData: FormData) {
  const to = formData.get("to") as string;
  const content = formData.get("content") as string;
  const author = formData.get("author") as string;

  // Bad words validation
  const toCheck = checkBadWords(to);
  const contentCheck = checkBadWords(content);
  const authorCheck = checkBadWords(author);

  if (toCheck.hasBadWords || contentCheck.hasBadWords || authorCheck.hasBadWords) {
    return {
      success: false,
      error: "Pesan Anda mengandung kata-kata yang tidak diperbolehkan. Mari gunakan tutur kata yang baik."
    };
  }
  
  // Music data is passed as a serialized JSON string
  const musicDataStr = formData.get("musicData") as string;
  let musicData = null;
  
  if (musicDataStr) {
    try {
      musicData = JSON.parse(musicDataStr);
    } catch (e) {
      console.error("Failed to parse music data", e);
    }
  }

  // Turnstile Verification
  const turnstileToken = formData.get("cf-turnstile-response") as string;
  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;

  if (turnstileSecret) {
    if (!turnstileToken) {
      return { success: false, error: "Validasi keamanan gagal (Token tidak ditemukan). Silakan centang kotak verifikasi." };
    }

    try {
      const verifyRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `secret=${encodeURIComponent(turnstileSecret)}&response=${encodeURIComponent(turnstileToken)}`,
      });

      const verifyData = await verifyRes.json();
      
      if (!verifyData.success) {
        return { success: false, error: "Verifikasi anti-bot gagal. Silakan coba lagi." };
      }
    } catch (error) {
      console.error("Turnstile verification error:", error);
      return { success: false, error: "Gagal terhubung ke layanan verifikasi keamanan." };
    }
  }

  const { data, error } = await supabase.from("messages").insert([
    {
      to: to || null,
      content,
      author: author || "Anonim",
      musicId: musicData?.id || null,
      musicTitle: musicData?.title || null,
      musicArtist: musicData?.artist || null,
      musicPreviewUrl: musicData?.previewUrl || null,
      musicArtworkUrl: musicData?.artworkUrl || null,
    },
  ]);

  if (error) {
    console.error("Failed to insert message:", error);
    return { success: false, error: error.message };
  }

  // Revalidate paths so the new data appears immediately
  revalidatePath("/");
  revalidatePath("/library");

  return { success: true };
}

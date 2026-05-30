import { supabase } from "./supabase";

export interface MessageData {
  id: string;
  to?: string;
  content: string;
  mood?: string;
  music?: {
    id: string;
    title: string;
    artist: string;
    previewUrl?: string;
    artworkUrl?: string;
  };
  author: string;
  date: string;
  dateDetail: string;
  isTimeCapsule?: boolean;
  unlockAt?: string;
  isLocked?: boolean;
}

function formatLibraryDate(dateString: string): string {
  const date = new Date(dateString);
  const day = date.getDate();
  const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

function formatDetailDate(dateString: string): string {
  const date = new Date(dateString);

  const day = date.getDate();
  const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  const offset = -date.getTimezoneOffset() / 60;
  const offsetStr = offset >= 0 ? `+${offset}` : `${offset}`;

  return `${day} ${month} ${year}, ${hours}:${minutes} UTC${offsetStr}`;
}

function mapToMessageData(dbMessage: any): MessageData {
  let isTimeCapsule = false;
  let unlockAt: string | undefined = undefined;
  let isLocked = false;
  let content = dbMessage.content;

  if (dbMessage.content && dbMessage.content.trim().startsWith('{"version":"v1","type":"time_capsule"')) {
    try {
      const parsed = JSON.parse(dbMessage.content);
      isTimeCapsule = true;
      unlockAt = parsed.unlockAt;
      content = parsed.content;
      isLocked = new Date() < new Date(parsed.unlockAt);
    } catch (e) {
      console.error("Failed to parse time capsule message:", e);
    }
  }

  return {
    id: dbMessage.id,
    to: dbMessage.to || undefined,
    content: content,
    mood: dbMessage.mood || undefined,
    author: dbMessage.author || "Anonim",
    date: formatLibraryDate(dbMessage.createdAt),
    dateDetail: formatDetailDate(dbMessage.createdAt),
    music: dbMessage.musicId ? {
      id: dbMessage.musicId,
      title: dbMessage.musicTitle,
      artist: dbMessage.musicArtist,
      previewUrl: dbMessage.musicPreviewUrl || undefined,
      artworkUrl: dbMessage.musicArtworkUrl || undefined,
    } : undefined,
    isTimeCapsule,
    unlockAt,
    isLocked
  };
}

export async function getRecentMessages(): Promise<MessageData[]> {
  const { data } = await supabase
    .from("messages")
    .select("*")
    .order("createdAt", { ascending: false })
    .limit(3);

  if (!data) return [];
  return data.map(mapToMessageData);
}

export async function getAllMessages(searchTo?: string, page: number = 1, limit: number = 10): Promise<MessageData[]> {
  let query = supabase
    .from("messages")
    .select("*")
    .order("createdAt", { ascending: false });

  if (searchTo) {
    const lowerSearch = searchTo.toLowerCase();
    const isMood = ["romantic", "nostalgic", "midnight", "healing", "soft", "letters-never-sent"].includes(lowerSearch);
    if (isMood) {
      query = query.eq("mood", lowerSearch);
    } else {
      query = query.ilike("to", `%${searchTo}%`);
    }
  }

  const from = (page - 1) * limit;
  const to = from + limit - 1;
  query = query.range(from, to);

  const { data } = await query;

  if (!data) return [];
  return data.map(mapToMessageData);
}

export async function getMessageById(id: string): Promise<MessageData | null> {
  const { data } = await supabase
    .from("messages")
    .select("*")
    .eq("id", id)
    .single();

  if (!data) return null;
  return mapToMessageData(data);
}

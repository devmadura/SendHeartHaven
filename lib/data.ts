import { supabase } from "./supabase";

export interface MessageData {
  id: string;
  to?: string;
  content: string;
  music?: {
    id: string;
    title: string;
    artist: string;
    previewUrl?: string;
    artworkUrl?: string;
  };
  author: string;
  date: string;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return "Hari ini";
  if (diffDays === 1) return "Kemarin";
  return `${diffDays} Hari Lalu`;
}

function mapToMessageData(dbMessage: any): MessageData {
  return {
    id: dbMessage.id,
    to: dbMessage.to || undefined,
    content: dbMessage.content,
    author: dbMessage.author || "Anonim",
    date: formatDate(dbMessage.createdAt),
    music: dbMessage.musicId ? {
      id: dbMessage.musicId,
      title: dbMessage.musicTitle,
      artist: dbMessage.musicArtist,
      previewUrl: dbMessage.musicPreviewUrl || undefined,
      artworkUrl: dbMessage.musicArtworkUrl || undefined,
    } : undefined
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

export async function getAllMessages(searchTo?: string): Promise<MessageData[]> {
  let query = supabase
    .from("messages")
    .select("*")
    .order("createdAt", { ascending: false });
    
  if (searchTo) {
    query = query.ilike("to", `%${searchTo}%`);
  }
    
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

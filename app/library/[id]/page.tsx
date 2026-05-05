import { MessageDetailView } from "@/components/views/MessageDetailView";
import { getMessageById } from "@/lib/data";
import { notFound } from "next/navigation";
import { Metadata, ResolvingMetadata } from "next";

export const revalidate = 0;

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedParams = await params;
  const message = await getMessageById(resolvedParams.id);

  if (!message) {
    return {
      title: "Pesan tidak ditemukan | SendHeartHaven",
    };
  }

  const truncatedContent = message.content.length > 60 
    ? message.content.substring(0, 60) + "..." 
    : message.content;

  return {
    title: `Pesan untuk ${message.to || "Seseorang"} | SendHeartHaven`,
    description: `"${truncatedContent}" — Dari ${message.author}`,
    openGraph: {
      title: `Pesan untuk ${message.to || "Seseorang"}`,
      description: `"${truncatedContent}" — Dari ${message.author}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `Pesan untuk ${message.to || "Seseorang"}`,
      description: `"${truncatedContent}" — Dari ${message.author}`,
    }
  };
}

export default async function MessageDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const message = await getMessageById(resolvedParams.id);
  
  if (!message) {
    notFound();
  }

  return <MessageDetailView message={message} />;
}

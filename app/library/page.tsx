import { LibraryView } from "@/components/views/LibraryView";
import { getAllMessages } from "@/lib/data";

export const revalidate = 0;

export default async function LibraryPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const toQuery = typeof resolvedParams?.to === 'string' ? resolvedParams.to : undefined;
  
  const messages = await getAllMessages(toQuery);
  return <LibraryView messages={messages} />;
}

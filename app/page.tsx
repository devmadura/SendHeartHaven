import { HomeView } from "@/components/views/HomeView";
import { getRecentMessages } from "@/lib/data";

export const revalidate = 0;

export default async function HomePage() {
  const messages = await getRecentMessages();
  return <HomeView messages={messages} />;
}

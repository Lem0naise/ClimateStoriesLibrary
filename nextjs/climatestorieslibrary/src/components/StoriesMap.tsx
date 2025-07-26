import dynamic from "next/dynamic";
import { Story } from "@/utils/useSupabase";

const StoriesMapClient = dynamic(() => import("./StoriesMapClient"), { ssr: false });

interface StoriesMapProps {
  stories: Story[];
}

export default function StoriesMap({ stories }: StoriesMapProps) {
  return <StoriesMapClient stories={stories} />;
}

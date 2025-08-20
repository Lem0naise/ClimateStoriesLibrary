import dynamic from "next/dynamic";
import { Story } from "@/utils/useSupabase";

const StoriesMapClient = dynamic(() => import("./StoriesMapClient"), { ssr: false });

interface StoriesMapProps {
  stories: Story[];
  minHeight: number;
}

export default function StoriesMap({ stories, minHeight }: StoriesMapProps) {
  return <StoriesMapClient stories={stories} minHeight={minHeight} />;
}
import { Tag } from "@/utils/useSupabase";

interface FilterButtonProps {
  name: string;
  isSelected: boolean;
  onClick: (name: string) => void;
  emoji?: string;
  type?: 'tag' | 'continent' | 'country';
}

// Map tag names to emojis
const tagEmojiMap: Record<string, string> = {
  farmer: "🌾",
  drought: "☀️",
  fire: "🔥",
  flood: "🌊",
  community: "🏘️",
  youth: "👥",
};

// Map continent names to emojis
const continentEmojiMap: Record<string, string> = {
  africa: "🌍",
  asia: "🌏",
  europe: "🌍",
  "north america": "🌎",
  "south america": "🌎",
  oceania: "🌏",
  antarctica: "🧊",
};

// Map country names to emojis (common ones)
const countryEmojiMap: Record<string, string> = {
  usa: "🇺🇸",
  canada: "🇨🇦",
  mexico: "🇲🇽",
  brazil: "🇧🇷",
  argentina: "🇦🇷",
  uk: "🇬🇧",
  france: "🇫🇷",
  germany: "🇩🇪",
  italy: "🇮🇹",
  spain: "🇪🇸",
  china: "🇨🇳",
  india: "🇮🇳",
  japan: "🇯🇵",
  australia: "🇦🇺",
  "south africa": "🇿🇦",
  nigeria: "🇳🇬",
  kenya: "🇰🇪",
  egypt: "🇪🇬",
};

export default function FilterButton({ name, isSelected, onClick, type = 'tag' }: FilterButtonProps) {
  const getEmoji = () => {
    const lowerName = name.toLowerCase();
    
    switch (type) {
      case 'continent':
        return continentEmojiMap[lowerName] || "🌍";
      case 'country':
        return countryEmojiMap[lowerName] || "🏳️";
      case 'tag':
      default:
        return tagEmojiMap[lowerName] || "🌍";
    }
  };

  return (
    <button 
      className={`bg-[rgba(255,255,255,0.1)] border border-[rgba(140,198,63,0.3)] rounded-md py-1.5 px-2 cursor-pointer transition-all duration-300 flex items-center gap-1 font-[SUSE] font-medium text-[clamp(11px,0.9vw,13px)] text-[color:var(--lightgreen)] justify-center hover:bg-[rgba(255,255,255,0.2)] hover:border-[rgba(140,198,63,0.5)] ${isSelected ? "!bg-[#304e25] !text-white !border-[#304e25]" : ""}`}
      onClick={() => onClick(name)}
      title={name} // Add tooltip for better UX
    >
      <span className="text-[clamp(12px,1vw,14px)]">{getEmoji()}</span>
      <span className="whitespace-nowrap text-[clamp(9px,0.8vw,11px)] capitalize ">{name}</span>
    </button>
  );
}

import { Tag } from "@/utils/useSupabase";

interface FilterButtonProps {
  name: string;
  isSelected: boolean;
  onClick: (name: string) => void;
  emoji?: string;
  type?: 'tag' | 'continent' | 'country';
}


export default function FilterButton({ name, isSelected, onClick, type = 'tag' }: FilterButtonProps) {
  

  return (
    <button 
      className={`bg-[rgba(255,255,255,0.1)] border border-[rgba(140,198,63,0.3)] rounded-md py-1.5 px-2 cursor-pointer transition-all duration-300 flex items-center gap-1 font-[SUSE] font-medium text-[clamp(11px,0.9vw,13px)] text-[color:var(--lightgreen)] justify-center hover:bg-[rgba(255,255,255,0.2)] hover:border-[rgba(140,198,63,0.5)] ${isSelected ? "!bg-[#304e25] !text-white !border-[#304e25]" : ""}`}
      onClick={() => onClick(name)}
      title={name} // Add tooltip for better UX
    >
      <span className="whitespace-nowrap text-[clamp(9px,0.8vw,11px)] capitalize ">{name}</span>
    </button>
  );
}

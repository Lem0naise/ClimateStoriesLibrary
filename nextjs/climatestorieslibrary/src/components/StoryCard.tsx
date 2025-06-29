interface StoryCardProps {
  title: string;
  description: string;
  tags: string;
  youtubeUrl?: string;
  country?: string;
  continent?: string;
}

export default function StoryCard({ title, description, tags, youtubeUrl, country, continent }: StoryCardProps) {
  return (
    <div className="bg-[rgba(255,255,255,0.08)] rounded-xl border border-[rgba(140,198,63,0.2)] transition-all duration-300 overflow-hidden cursor-pointer hover:bg-[rgba(255,255,255,0.12)] hover:-translate-y-0.5 hover:shadow-[0_5px_20px_rgba(140,198,63,0.15)]">
      <div className="w-full h-[180px] bg-gradient-to-br from-[rgba(140,198,63,0.3)] to-[rgba(140,198,63,0.1)] flex items-center justify-center relative border-b border-[rgba(140,198,63,0.2)] md:h-[150px] max-[580px]:h-[120px]">
        {/* Location Badge */}
        {(country || continent) && (
          <div className="absolute top-3 left-3 bg-[rgba(0,0,0,0.7)] backdrop-blur-sm rounded-lg px-3 py-1.5 text-white">
            <div className="text-[clamp(11px,1vw,13px)] font-semibold">
              {country && <span className="block">{country}</span>}
              {continent && <span className="block text-[clamp(9px,0.8vw,11px)] opacity-80">{continent}</span>}
            </div>
          </div>
        )}
        
        <div className="w-[50px] h-[50px] bg-[rgba(255,255,255,0.9)] rounded-full flex items-center justify-center text-xl text-[color:var(--lightgreen)] transition-all duration-300 shadow-[0_3px_15px_rgba(0,0,0,0.2)] hover:scale-110 hover:bg-white max-[580px]:w-[40px] max-[580px]:h-[40px] max-[580px]:text-base">
          ▶
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <h4 className="text-[color:var(--lightgreen)] text-[clamp(14px,1.2vw,16px)] font-semibold flex-1 pr-2">
            {title}
          </h4>
          {(country || continent) && (
            <div className="text-right text-[clamp(10px,0.9vw,12px)] opacity-70 min-w-fit">
              <div className="font-medium text-[color:var(--lightgreen)]">{country}</div>
              {continent && <div className="text-[clamp(9px,0.8vw,10px)]">{continent}</div>}
            </div>
          )}
        </div>
        <p className="text-[clamp(12px,1vw,14px)] leading-snug opacity-85 mb-3">
          {description}
        </p>
        <span className="inline-block bg-[rgba(140,198,63,0.2)] text-[color:var(--lightgreen)] py-1 px-2 rounded-md text-[clamp(10px,0.9vw,12px)] font-medium">
          {tags}
        </span>
      </div>
    </div>
  );
}

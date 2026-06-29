export default function Loading() {
  return (
    <div className="min-h-fit pb-[10vh] bg-[color:var(--background)] transition-colors duration-300">
      <div className="max-w-full md:max-w-[90vw] mx-auto py-4 md:py-10 px-3 md:px-5 text-green-600">
        <div className="bg-[color:var(--boxcolor)] rounded-[8px] md:rounded-[15px] backdrop-blur-sm border-[3px] md:border-[5px] border-[rgba(140,198,63,0.2)] text-center p-3 md:p-10 pt-2 md:pt-2 pb-4 md:pb-10 mb-4 md:mb-8">
          <div className="h-10 bg-[rgba(140,198,63,0.2)] rounded mb-4 w-64 mx-auto animate-pulse" />
          <div className="h-4 bg-[rgba(140,198,63,0.15)] rounded mb-6 w-96 mx-auto animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className="bg-[rgba(255,255,255,0.08)] rounded-xl border border-[rgba(140,198,63,0.2)] overflow-hidden animate-pulse p-6"
              >
                <div className="h-5 bg-[rgba(140,198,63,0.3)] rounded mb-3 w-3/4" />
                <div className="h-3 bg-[rgba(140,198,63,0.2)] rounded mb-2" />
                <div className="h-3 bg-[rgba(140,198,63,0.2)] rounded mb-4 w-5/6" />
                <div className="h-9 bg-[rgba(140,198,63,0.3)] rounded w-32" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

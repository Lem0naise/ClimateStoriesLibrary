export default function Loading() {
  return (
    <div className="min-h-screen bg-[color:var(--background)] flex items-center justify-center">
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-[color:var(--boxcolor)] rounded-[15px] backdrop-blur-sm border-[5px] border-[rgba(140,198,63,0.2)] p-8 animate-pulse">
          {/* Back button skeleton */}
          <div className="mb-6">
            <div className="h-5 bg-[rgba(140,198,63,0.3)] rounded w-32"></div>
          </div>
          
          {/* Title skeleton */}
          <div className="h-10 bg-[rgba(140,198,63,0.3)] rounded mb-4"></div>
          
          {/* Metadata skeleton */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="h-4 bg-[rgba(140,198,63,0.2)] rounded w-32"></div>
          </div>
          
          {/* Image skeleton */}
          <div className="aspect-video bg-[rgba(140,198,63,0.3)] rounded mb-8"></div>
          
          {/* Content skeleton */}
          <div className="space-y-3">
            <div className="h-4 bg-[rgba(140,198,63,0.2)] rounded"></div>
            <div className="h-4 bg-[rgba(140,198,63,0.2)] rounded w-3/4"></div>
            <div className="h-4 bg-[rgba(140,198,63,0.2)] rounded w-5/6"></div>
            <div className="h-4 bg-[rgba(140,198,63,0.2)] rounded"></div>
            <div className="h-4 bg-[rgba(140,198,63,0.2)] rounded w-4/5"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

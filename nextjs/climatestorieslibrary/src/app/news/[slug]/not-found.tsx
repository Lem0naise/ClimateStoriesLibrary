import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[color:var(--background)] flex items-center justify-center">
      <div className="max-w-4xl mx-auto p-6 text-center">
        <div className="bg-[color:var(--boxcolor)] rounded-[15px] backdrop-blur-sm border-[5px] border-[rgba(140,198,63,0.2)] p-8">
          <div className="mb-8">
            <div className="text-6xl mb-4">📰</div>
            <h1 className="text-[color:var(--lightgreen)] text-4xl font-bold mb-4">
              News Article Not Found
            </h1>
            <p className="text-[color:var(--lightgreen)] mb-6 opacity-75 text-lg">
              The article you're looking for doesn't exist or may have been removed.
            </p>
          </div>
          
          <div className="space-y-4">
            <Link 
              href="/news" 
              className="inline-block bg-[color:var(--lightgreen)] text-[color:var(--darkgreen)] py-4 px-8 rounded-lg font-semibold text-lg hover:bg-[color:var(--darkgreen)] hover:text-[color:var(--lightgreen)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_5px_15px_rgba(140,198,63,0.3)] mr-4"
            >
              Back to News
            </Link>
            
            <Link 
              href="/" 
              className="inline-block bg-transparent text-[color:var(--lightgreen)] py-4 px-8 rounded-lg font-semibold text-lg border-2 border-[color:var(--lightgreen)] hover:bg-[color:var(--lightgreen)] hover:text-[color:var(--darkgreen)] transition-all duration-300 hover:-translate-y-0.5"
            >
              View Stories
            </Link>
            
            <div className="mt-6">
              <p className="text-[color:var(--lightgreen)] text-sm opacity-60">
                Stay updated with news and insights from the Climate Stories Library
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

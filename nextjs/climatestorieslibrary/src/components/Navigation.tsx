import Image from 'next/image';
import Link from 'next/link';

export default function Navigation() {
  return (
    <nav className="w-full bg-white sticky top-0 z-[1000] shadow-[0px_20px_30px_rgba(0,0,0,0.06)] border-b-2 border-[color:var(--lightgreen)]">
      <div className="max-w-[1200px] mx-auto px-4 flex items-center justify-between h-[60px] sm:px-6 sm:h-[65px]">
        <div className="flex items-center gap-3 sm:gap-4 hide-at-tiny">
          <Link href="/" className="flex-shrink-0">
            <Image 
              src="/imgs/logo.webp" 
              alt="Climate Stories Library" 
              width={50} 
              height={37}
              className="rounded-lg transition-transform duration-200 hover:scale-105 sm:w-[60px] sm:h-[45px] md:w-[70px] md:h-[52px]"
            />
          </Link>
          <div>
            <Link 
              href="/" 
              className="text-[color:var(--lightgreen)] text-sm font-bold no-underline transition-colors duration-300 hover:text-black font-[SUSE] sm:text-base md:text-lg lg:text-xl hidden sm:inline"
            >
              <span className="hidden md:inline">Climate Stories Library</span>
              <span className="md:hidden">CSL</span>
            </Link>
          </div>
        </div>
        
        <ul className="flex list-none m-0 p-0 items-center sm:gap-0 lg:gap-6 sm:ml-auto">
          <li className="relative">
            <Link 
              href="/" 
              className="text-[color:var(--lightgreen)] no-underline text-sm font-semibold py-2 px-3 rounded-md transition-all duration-300 relative hover:text-white hover:bg-[rgba(140,198,63,0.1)] after:content-[''] after:absolute after:-bottom-1 after:left-1/2 after:w-0 after:h-0.5 after:bg-[color:var(--lightgreen)] after:transition-all after:duration-300 after:-translate-x-1/2 hover:after:w-4/5 sm:text-base sm:px-4"
            >
              <span className="hidden lg:inline">Browse Stories</span>
              <span className="lg:hidden">Browse</span>
            </Link>
          </li>
          <li className="relative">
            <Link 
              href="/connect" 
              className="text-[color:var(--lightgreen)] no-underline text-sm font-semibold py-2 px-3 rounded-md transition-all duration-300 relative hover:text-white hover:bg-[rgba(140,198,63,0.1)] after:content-[''] after:absolute after:-bottom-1 after:left-1/2 after:w-0 after:h-0.5 after:bg-[color:var(--lightgreen)] after:transition-all after:duration-300 after:-translate-x-1/2 hover:after:w-4/5 sm:text-base sm:px-4"
            >
              <span className="hidden md:inline">Grassroots Groups</span>
              <span className="md:hidden">Groups</span>
            </Link>
          </li>
          <li className="relative">
            <Link 
              href="/aboutus" 
              className="text-[color:var(--lightgreen)] no-underline text-sm font-semibold py-2 px-3 rounded-md transition-all duration-300 relative hover:text-white hover:bg-[rgba(140,198,63,0.1)] after:content-[''] after:absolute after:-bottom-1 after:left-1/2 after:w-0 after:h-0.5 after:bg-[color:var(--lightgreen)] after:transition-all after:duration-300 after:-translate-x-1/2 hover:after:w-4/5 sm:text-base sm:px-4"
            >
              About
            </Link>
          </li>
          <li className="relative">
            <Link 
              href="/share" 
              className="text-[color:var(--lightgreen)] no-underline text-sm font-semibold py-2 px-3 rounded-md transition-all duration-300 relative hover:text-white hover:bg-[rgba(140,198,63,0.1)] after:content-[''] after:absolute after:-bottom-1 after:left-1/2 after:w-0 after:h-0.5 after:bg-[color:var(--lightgreen)] after:transition-all after:duration-300 after:-translate-x-1/2 hover:after:w-4/5 sm:text-base sm:px-4"
            >
              <span className="hidden lg:inline">Add Your Story</span>
              <span className="lg:hidden">Upload</span>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
     
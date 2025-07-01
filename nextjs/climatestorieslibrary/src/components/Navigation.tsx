import Image from 'next/image';
import Link from 'next/link';

export default function Navigation() {
  return (
    <nav className="w-full bg-white sticky top-0 z-[1000] shadow-[0px_20px_30px_rgba(0,0,0,0.06)]">
      <div className="max-w-[1200px] mx-auto px-5 flex items-center justify-between h-[70px] md:px-4 md:h-[60px]">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Image 
              src="/imgs/logo.webp" 
              alt="Climate Stories Library" 
              width={85} 
              height={63}
              className="flex-shrink-0 rounded-lg transition-transform duration-200 scale-90 hover:scale-100 md:w-[60px] md:h-[45px]"
            />
          </Link>
          <div className="flex flex-col max-[580px]:hidden">
            <Link 
              href="/" 
              className="text-[color:var(--lightgreen)] text-xl font-bold no-underline transition-colors duration-300 hover:text-white font-[SUSE] md:text-base"
            >
              Climate Stories Library
            </Link>
          </div>
        </div>
        
        <ul className="flex list-none m-0 p-0 gap-8 items-center md:gap-4 max-[580px]:gap-2">
          <li className="relative">
            <Link 
              href="/" 
              className="text-[color:var(--lightgreen)] no-underline text-base font-semibold py-2 px-4 rounded-md transition-all duration-300 relative hover:text-white hover:bg-[rgba(140,198,63,0.1)] after:content-[''] after:absolute after:-bottom-1 after:left-1/2 after:w-0 after:h-0.5 after:bg-[color:var(--lightgreen)] after:transition-all after:duration-300 after:-translate-x-1/2 hover:after:w-4/5 md:text-sm md:py-1.5 md:px-3 max-[580px]:text-xs max-[580px]:py-1.5 max-[580px]:px-2.5"
            >
              Home
            </Link>
          </li>
          <li className="relative">
            <Link 
              href="/about" 
              className="text-[color:var(--lightgreen)] no-underline text-base font-semibold py-2 px-4 rounded-md transition-all duration-300 relative hover:text-white hover:bg-[rgba(140,198,63,0.1)] after:content-[''] after:absolute after:-bottom-1 after:left-1/2 after:w-0 after:h-0.5 after:bg-[color:var(--lightgreen)] after:transition-all after:duration-300 after:-translate-x-1/2 hover:after:w-4/5 md:text-sm md:py-1.5 md:px-3 max-[580px]:text-xs max-[580px]:py-1.5 max-[580px]:px-2.5"
            >
              About Us
            </Link>
          </li>
          <li className="relative">
            <Link 
              href="/share" 
              className="text-[color:var(--lightgreen)] no-underline text-base font-semibold py-2 px-4 rounded-md transition-all duration-300 relative hover:text-white hover:bg-[rgba(140,198,63,0.1)] after:content-[''] after:absolute after:-bottom-1 after:left-1/2 after:w-0 after:h-0.5 after:bg-[color:var(--lightgreen)] after:transition-all after:duration-300 after:-translate-x-1/2 hover:after:w-4/5 md:text-sm md:py-1.5 md:px-3 max-[580px]:text-xs max-[580px]:py-1.5 max-[580px]:px-2.5"
            >
              Share Your Story
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full bg-[color:var(--darkgreen)] border-t-[3px] border-[rgba(41,111,49,0.5)] mt-auto">
      <div className="max-w-[1200px] mx-auto px-5 flex items-center justify-between h-[60px] md:px-4 md:h-[50px]">
        <div className="hidden sm:flex items-center gap-3">
          <Link href="/">
            <Image 
              src="/imgs/logo.webp" 
              alt="Climate Stories Library" 
              width={50} 
              height={37}
              className="rounded-md transition-transform duration-200 hover:scale-105 sm:w-[40px] sm:h-[30px] md:w-[50px] md:h-[37px]"
            />
          </Link>
          <div className="flex flex-col hidden">
            <Link 
              href="/" 
              className="text-[color:var(--lightgreen)] text-base font-semibold no-underline transition-colors duration-300 hover:text-black font-[SUSE] md:text-sm"
            >
              <span className="hidden md:inline">Climate Stories Library</span>
              <span className="md:hidden">CSL</span>
            </Link>
          </div>
        </div>

        <div  className="text-[color:var(--lightgreen)] text-sm font-medium opacity-90 md:text-xs max-[580px]:text-[11px]">
          <a href="/privacy-policy" target="_blank"
         >Privacy Policy</a>
        </div>
        
        <div className="text-[color:var(--lightgreen)] text-sm font-medium opacity-90 md:text-xs max-[580px]:text-[11px]">
          © 2024 Climate Stories Library
        </div>
      </div>
    </footer>
  );
}

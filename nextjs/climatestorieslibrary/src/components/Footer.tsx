import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full bg-[color:var(--darkgreen)] border-t-[3px] border-[rgba(41,111,49,0.5)] mt-auto">
      <div className="max-w-[1200px] mx-auto px-5 flex items-center justify-between h-[60px] md:px-4 md:h-[50px]">
        <div className="flex items-center gap-3">
          <Link href="/">
            <Image 
              src="/imgs/logo.webp" 
              alt="Climate Stories Library" 
              width={50} 
              height={50}
              className="rounded-md transition-transform duration-200 hover:scale-105 md:w-[40px] md:h-[40px]"
            />
          </Link>
          <div className="flex flex-col max-[580px]:hidden">
            <Link 
              href="/" 
              className="text-[color:var(--lightgreen)] text-base font-semibold no-underline transition-colors duration-300 hover:text-black font-[SUSE] md:text-sm"
            >
              Climate Stories Library
            </Link>
          </div>
        </div>

        <div>
          <a href="/privacy-policy" target="_blank">Privacy Policy</a>
        </div>
        
        <div className="text-[color:var(--lightgreen)] text-sm font-medium opacity-90 md:text-xs max-[580px]:text-[11px]">
          © 2024 Climate Stories Library
        </div>
      </div>
    </footer>
  );
}

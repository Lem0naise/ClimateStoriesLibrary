import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <Link href="/">
            <Image 
              src="/imgs/logo.webp" 
              alt="Climate Stories Library" 
              width={50} 
              height={50}
              className="footer-logo"
            />
          </Link>
          <div className="footer-text">
            <Link href="/" className="footer-title">Climate Stories Library</Link>
          </div>
        </div>
        
        <div className="footer-copyright">
          © 2024 Climate Stories Library
        </div>
      </div>
    </footer>
  );
}

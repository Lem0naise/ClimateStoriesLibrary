import Image from 'next/image';
import Link from 'next/link';

export default function Navigation() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link href="/">
            <Image 
              src="/imgs/logo.webp" 
              alt="Climate Stories Library" 
              width={85} 
              height={63}
              className="navbar-logo"
            />
          </Link>
          <div className="brand-text">
            <Link href="/" className="brand-title">Climate Stories Library</Link>
          </div>
        </div>
        
        <ul className="navbar-menu">
          <li className="navbar-item">
            <Link href="/" className="navbar-link">Home</Link>
          </li>
          <li className="navbar-item">
            <Link href="/about" className="navbar-link">About Us</Link>
          </li>
          <li className="navbar-item">
            <Link href="/share" className="navbar-link">Share Your Story</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

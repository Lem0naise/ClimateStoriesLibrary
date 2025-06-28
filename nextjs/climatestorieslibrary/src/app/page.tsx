import Image from "next/image";
import Link from "next/link";

export default function Home() {

  return (
    <div id="main">
      <div className="home-container">
        <div className="hero-section green-backdrop">
          <div className="hero-content">
            <h1>Climate Stories Library</h1>
            <p className="hero-subtitle">
              The Climate Stories Library provides a platform for individuals and grassroots groups to share their experiences of, and responses to, the climate and nature crisis.
            </p>
            
            <div className="cta-section">
              <div className="cta-text">
                <h2>Every Voice Matters</h2>
                <p>Share your story and connect with a global community working together for climate action.</p>
              </div>
              <Link id="collectButton" href="/share">
                <div id="c1">
                  SHARE
                  <p>YOUR</p>
                  STORY
                </div>   
                <div id="c2">
                  <Image src="imgs/plus.svg" alt="Plus icon" width={60} height={60} />
                </div>
              </Link>
            </div>
          </div>
        </div>

        <div className="stories-preview-section green-backdrop">
          <h2>Explore Stories</h2>
          <p>Discover climate stories from communities around the world. Each story adds to our collective understanding of how climate change affects real people in real places.</p>
          
          <div className="preview-grid">
            <div className="preview-item">
              <h3>🌾 Agricultural Changes</h3>
              <p>Farmers sharing how changing weather patterns affect their crops and livelihoods.</p>
            </div>
            <div className="preview-item">
              <h3>🏘️ Community Resilience</h3>
              <p>Local initiatives and adaptations communities are making to address climate challenges.</p>
            </div>
            <div className="preview-item">
              <h3>🌊 Environmental Observations</h3>
              <p>Personal accounts of environmental changes witnessed over time.</p>
            </div>
          </div>
          
          <div className="stories-cta">
            <a target="_blank" href="https://www.instagram.com/climatestorieslibrary" className="stories-button">
              View All Stories
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

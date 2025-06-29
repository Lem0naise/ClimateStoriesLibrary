"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const handleFilterClick = (category: string) => {
    setSelectedFilters(prev => 
      prev.includes(category) 
        ? prev.filter(filter => filter !== category)
        : [...prev, category]
    );
  };

  // Get theme based on first selected filter
  const getTheme = () => {
    if (selectedFilters.length === 0) return '';
    return `theme-${selectedFilters[0]}`;
  };

  return (
    <div id="main" className={getTheme()}>
      <div className="home-container">
        

        <div className="stories-preview-section green-backdrop">
          <h2>Explore the Climate Stories Library</h2>
          <p>Discover climate stories from communities around the world. Each story adds to our collective understanding of how climate change affects real people in real places.</p>
          
          <div className="stories-grid">
            {/* Filter Card - Top Left */}
            <div className="filter-card-container">
              <div className="filter-section-card">
                <h3>Filter by category:</h3>
                <div className="filter-cards-compact">
                  <button 
                    className={`filter-card-small ${selectedFilters.includes("farmer") ? "active" : ""}`}
                    onClick={() => handleFilterClick("farmer")}
                  >
                    <span className="filter-emoji">🌾</span>
                    <span className="filter-text">Farmer</span>
                  </button>
                  <button 
                    className={`filter-card-small ${selectedFilters.includes("drought") ? "active" : ""}`}
                    onClick={() => handleFilterClick("drought")}
                  >
                    <span className="filter-emoji">☀️</span>
                    <span className="filter-text">Drought</span>
                  </button>
                  <button 
                    className={`filter-card-small ${selectedFilters.includes("fire") ? "active" : ""}`}
                    onClick={() => handleFilterClick("fire")}
                  >
                    <span className="filter-emoji">🔥</span>
                    <span className="filter-text">Fire</span>
                  </button>
                  <button 
                    className={`filter-card-small ${selectedFilters.includes("flood") ? "active" : ""}`}
                    onClick={() => handleFilterClick("flood")}
                  >
                    <span className="filter-emoji">🌊</span>
                    <span className="filter-text">Flood</span>
                  </button>
                  <button 
                    className={`filter-card-small ${selectedFilters.includes("community") ? "active" : ""}`}
                    onClick={() => handleFilterClick("community")}
                  >
                    <span className="filter-emoji">🏘️</span>
                    <span className="filter-text">Community</span>
                  </button>
                  <button 
                    className={`filter-card-small ${selectedFilters.includes("youth") ? "active" : ""}`}
                    onClick={() => handleFilterClick("youth")}
                  >
                    <span className="filter-emoji">👥</span>
                    <span className="filter-text">Youth</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Video Story Cards */}
            <div className="story-video-card">
              <div className="video-placeholder">
                <div className="play-button">▶</div>
              </div>
              <div className="story-card-content">
                <h4>🌾 Farmer's Drought Experience</h4>
                <p>Maria shares how changing rainfall patterns have affected her corn harvest in Guatemala.</p>
                <span className="story-tags">farmer, drought</span>
              </div>
            </div>

            <div className="story-video-card">
              <div className="video-placeholder">
                <div className="play-button">▶</div>
              </div>
              <div className="story-card-content">
                <h4>🔥 Wildfire Survivor Story</h4>
                <p>Community response to unprecedented wildfire seasons in California.</p>
                <span className="story-tags">fire, community</span>
              </div>
            </div>

            <div className="story-video-card">
              <div className="video-placeholder">
                <div className="play-button">▶</div>
              </div>
              <div className="story-card-content">
                <h4>🌊 Rising Sea Levels</h4>
                <p>Coastal communities adapting to increasing flood risks and storm surges.</p>
                <span className="story-tags">flood, community</span>
              </div>
            </div>

            <div className="story-video-card">
              <div className="video-placeholder">
                <div className="play-button">▶</div>
              </div>
              <div className="story-card-content">
                <h4>👥 Youth Climate Action</h4>
                <p>Students organizing climate strikes and environmental initiatives in their schools.</p>
                <span className="story-tags">youth, community</span>
              </div>
            </div>

            <div className="story-video-card">
              <div className="video-placeholder">
                <div className="play-button">▶</div>
              </div>
              <div className="story-card-content">
                <h4>🌾 Sustainable Farming</h4>
                <p>Innovative agricultural practices helping farmers adapt to climate change.</p>
                <span className="story-tags">farmer, community</span>
              </div>
            </div>

            <div className="story-video-card">
              <div className="video-placeholder">
                <div className="play-button">▶</div>
              </div>
              <div className="story-card-content">
                <h4>☀️ Heat Wave Impact</h4>
                <p>Urban communities coping with record-breaking temperatures and heat waves.</p>
                <span className="story-tags">drought, community</span>
              </div>
            </div>

            <div className="story-video-card">
              <div className="video-placeholder">
                <div className="play-button">▶</div>
              </div>
              <div className="story-card-content">
                <h4>🏘️ Community Resilience</h4>
                <p>Neighborhood initiatives building climate resilience and adaptation strategies.</p>
                <span className="story-tags">community, youth</span>
              </div>
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

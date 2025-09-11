"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { fetchStoryBySlug, Story } from '@/utils/useSupabase';
import { getYouTubeVideoId } from '@/utils/getYoutubeVideoId';

export default function StoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStory = async () => {
      if (!slug) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const fetchedStory = await fetchStoryBySlug(slug);
        if (fetchedStory) {
          setStory(fetchedStory);
        } else {
          notFound();
        }
      } catch (err) {
        console.error('Error loading story:', err);
        setError('Failed to load story');
      } finally {
        setLoading(false);
      }
    };

    loadStory();
  }, [slug]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  function linkify(text: string) {
    // Regex for URLs (http(s):// or www.)
    const urlRegex = /(\bhttps?:\/\/[^\s<]+|\bwww\.[^\s<]+)/gi;
    return text.replace(urlRegex, (url) => {
      let href = url;
      if (!href.startsWith('http')) {
        href = 'https://' + href;
      }
      return `<a href="${href}" target="_blank" rel="noopener noreferrer" style="text-decoration:underline; font-weight: bold;)">${url}</a>`;
  });
}

  const getYoutubeEmbedUrl = (url: string) => {
    const videoId = getYouTubeVideoId(url);
    if (!videoId) return null;
    
    const params = new URLSearchParams({
      'rel': '0',                 // Don't show related videos at the end
      'cc_load_policy': '1',      // Force captions on
      'cc_lang_pref': 'en'        // Default captions to English
    });

    return `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`;
};

const getYoutubeLinkUrl = (url : string) => {
   const videoId = getYouTubeVideoId(url);
  if (!videoId) return null;
  const params = new URLSearchParams({
    'v': videoId
  });
  return `https://www.youtube.com/watch?${params.toString()}`;
}

  if (loading) {
    return (
      <div className="min-h-screen bg-[color:var(--background)] flex items-center justify-center py-4 sm:py-10">
        <div className="max-w-5xl mx-auto px-3 sm:px-6 w-full">
          <div className="bg-[color:var(--boxcolor)] rounded-[8px] sm:rounded-[15px] backdrop-blur-sm border-[3px] sm:border-[5px] border-[rgba(140,198,63,0.2)] p-4 sm:p-8 animate-pulse">
            <div className="h-8 bg-[rgba(140,198,63,0.3)] rounded mb-4"></div>
            <div className="h-4 bg-[rgba(140,198,63,0.2)] rounded mb-2"></div>
            <div className="h-4 bg-[rgba(140,198,63,0.2)] rounded mb-6 w-3/4"></div>
            <div className="aspect-video bg-[rgba(140,198,63,0.3)] rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !story) {
    return (
      <div className="min-h-screen bg-[color:var(--background)] flex items-center justify-center py-4 sm:py-10">
        <div className="max-w-5xl mx-auto px-3 sm:px-6 text-center w-full">
          <div className="bg-[color:var(--boxcolor)] rounded-[8px] sm:rounded-[15px] backdrop-blur-sm border-[3px] sm:border-[5px] border-[rgba(140,198,63,0.2)] p-4 sm:p-8">
            <h1 className="text-[color:var(--lightgreen)] text-3xl font-bold mb-4">
              {error || 'Story Not Found'}
            </h1>
            <p className="text-[color:var(--lightgreen)] mb-6 opacity-75">
              The story you're looking for doesn't exist or has been removed.
            </p>
            <Link 
              href="/" 
              className="inline-block bg-[color:var(--lightgreen)] text-[color:var(--darkgreen)] py-3 px-6 rounded-lg font-semibold hover:bg-[color:var(--darkgreen)] hover:text-[color:var(--lightgreen)] transition-all duration-300"
            >
              Back to Stories
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const youtubeEmbedUrl = getYoutubeEmbedUrl(story.youtube_url);
  const youtubeWatchUrl = getYoutubeLinkUrl(story.youtube_url);

  return (
    <div className="min-h-screen bg-[color:var(--background)] py-4 sm:py-10">
      <div className="max-w-5xl mx-auto px-3 sm:px-6">
        {/* Story Content */}
        <div className="bg-[color:var(--boxcolor)] rounded-[8px] sm:rounded-[15px] backdrop-blur-sm border-[3px] sm:border-[5px] border-[rgba(140,198,63,0.2)] p-4 sm:p-8">

          {/* Header */}
          <div className="mb-4 sm:mb-6">
            <h1 className="text-[color:var(--lightgreen)] text-[clamp(24px,6vw,42px)] font-bold mb-3 sm:mb-4 leading-tight">
              {story.title}
            </h1>
            
            {/* Video Section - Moved up for both mobile and desktop */}
            {youtubeEmbedUrl && (
              <div className="mb-4 sm:mb-6">
                <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-lg">
                  <iframe
                    src={youtubeEmbedUrl}
                    title={story.title}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="strict-origin-when-cross-origin"
                    sandbox="allow-scripts allow-same-origin allow-presentation"
                    className="w-full h-full"
                  ></iframe>
                </div>
              </div>
            )}
            
            {/* Metadata */}
            <div className="flex flex-wrap gap-2 sm:gap-4 text-[color:var(--lightgreen)] opacity-75 mb-3 sm:mb-4 text-sm sm:text-base">
              {(story.region || story.country || story.continent) && (
                <div className="flex items-center">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {story.region && story.country && `${story.region}, ${story.country}`}
                  {!story.region && story.country && story.continent && `${story.country}, ${story.continent}`}
                  {!story.region && story.country && !story.continent && story.country}
                  {!story.region && !story.country && story.continent && story.continent}
                  {story.region && !story.country && story.region}
                </div>
              )}
              
              {story.story_date && (
                <div className="flex items-center">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {formatDate(story.story_date)}
                </div>
              )}
            </div>

            {/* Tags */}
            {story.tags && story.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 sm:gap-2 mb-4 sm:mb-6">
                {story.tags.map((tag) => (
                  <span 
                    key={tag.id} 
                    className="bg-[rgba(140,198,63,0.2)] text-[color:var(--lightgreen)] px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm border border-[rgba(140,198,63,0.3)]"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Caption Notice */}
          {youtubeEmbedUrl && youtubeWatchUrl && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-[rgba(140,198,63,0.1)] border border-[rgba(140,198,63,0.3)] rounded-lg">
              <div className="flex items-start gap-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 text-[color:var(--lightgreen)] opacity-75 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-[color:var(--lightgreen)] text-xs sm:text-sm opacity-75">
                  <strong> English captions may be available for this video</strong>. 
                  Click the CC button in the video player and use auto-translate if needed. If you cannot see captions, you can <a className='underline text-black' href={youtubeWatchUrl}>view the video on YouTube here</a>.
                </p>
              </div>
            </div>
          )}

          {/* Story Description */}
          <div className="prose prose-lg max-w-none">
            <div className="text-[color:var(--lightgreen)] leading-relaxed text-[clamp(14px,1.2vw,18px)] opacity-90">
              {story.description && (<p className="mb-3 sm:mb-4" dangerouslySetInnerHTML={{__html: linkify(story.description)}}/>
              )}
            
              
              <p className="text-xs sm:text-sm opacity-75">
                This story is part of the Climate Stories Library, a platform for individuals and 
                grassroots groups to share their experiences of the climate and nature crisis.
              </p>
            </div>
          </div>

          {/* Share Section */}
          <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-[rgba(140,198,63,0.2)]">
            <h3 className="text-[color:var(--lightgreen)] text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
              Share This Story
            </h3>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(story.title)}&url=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[rgba(140,198,63,0.2)] text-[color:var(--lightgreen)] px-3 sm:px-4 py-2 rounded-lg hover:bg-[rgba(140,198,63,0.3)] transition-colors duration-300 text-xs sm:text-sm"
              >
                Share on Twitter
              </a>
              <a
                href={`https://bsky.app/intent/compose?text=${encodeURIComponent(`${story.title} ${window.location.href}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[rgba(140,198,63,0.2)] text-[color:var(--lightgreen)] px-3 sm:px-4 py-2 rounded-lg hover:bg-[rgba(140,198,63,0.3)] transition-colors duration-300 text-xs sm:text-sm"
              >
                Share on Bluesky
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[rgba(140,198,63,0.2)] text-[color:var(--lightgreen)] px-3 sm:px-4 py-2 rounded-lg hover:bg-[rgba(140,198,63,0.3)] transition-colors duration-300 text-xs sm:text-sm"
              >
                Share on Facebook
              </a>
              <button
                onClick={() => navigator.clipboard.writeText(window.location.href)}
                className="cursor-pointer bg-[rgba(140,198,63,0.2)] text-[color:var(--lightgreen)] px-3 sm:px-4 py-2 rounded-lg hover:bg-[rgba(140,198,63,0.3)] transition-colors duration-300 text-xs sm:text-sm"
              >
                Copy Link
              </button>
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-6 sm:mt-8 text-center">
            <Link 
              href="/" 
              className="inline-block bg-[color:var(--lightgreen)] text-[color:var(--darkgreen)] py-3 sm:py-4 px-6 sm:px-8 rounded-lg font-semibold text-base sm:text-lg hover:bg-[color:var(--darkgreen)] hover:text-[color:var(--lightgreen)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_5px_15px_rgba(140,198,63,0.3)]"
            >
              Back To Stories
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

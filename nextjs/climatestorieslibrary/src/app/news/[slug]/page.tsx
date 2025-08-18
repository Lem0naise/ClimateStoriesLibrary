"use client";

import { useState, useEffect } from "react";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import { 
  fetchBlogPostBySlug, 
  fetchBlogImages, 
  BlogPost, 
  BlogImages 
} from "@/utils/useSupabase";

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [blogPost, setBlogPost] = useState<BlogPost | null>(null);
  const [blogImages, setBlogImages] = useState<BlogImages[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBlogPost = async () => {
      if (!slug) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const fetchedPost = await fetchBlogPostBySlug(slug);
        if (fetchedPost) {
          setBlogPost(fetchedPost);
          
          // Fetch images for this blog post
          const images = await fetchBlogImages(fetchedPost.id);
          setBlogImages(images);
        } else {
          notFound();
        }
      } catch (err) {
        console.error('Error loading blog post:', err);
        setError('Failed to load blog post');
      } finally {
        setLoading(false);
      }
    };

    loadBlogPost();
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
      return `<a href="${href}" target="_blank" rel="noopener noreferrer" style="text-decoration:underline; font-weight: bold;">${url}</a>`;
    });
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

  if (error || !blogPost) {
    return (
      <div className="min-h-screen bg-[color:var(--background)] flex items-center justify-center py-4 sm:py-10">
        <div className="max-w-5xl mx-auto px-3 sm:px-6 text-center w-full">
          <div className="bg-[color:var(--boxcolor)] rounded-[8px] sm:rounded-[15px] backdrop-blur-sm border-[3px] sm:border-[5px] border-[rgba(140,198,63,0.2)] p-4 sm:p-8">
            <h1 className="text-[color:var(--lightgreen)] text-3xl font-bold mb-4">
              {error || 'Blog Post Not Found'}
            </h1>
            <p className="text-[color:var(--lightgreen)] mb-6 opacity-75">
              The blog post you're looking for doesn't exist or has been removed.
            </p>
            <Link 
              href="/news" 
              className="inline-block bg-[color:var(--lightgreen)] text-[color:var(--darkgreen)] py-3 px-6 rounded-lg font-semibold hover:bg-[color:var(--darkgreen)] hover:text-[color:var(--lightgreen)] transition-all duration-300"
            >
              Back to News
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[color:var(--background)] py-4 sm:py-10">
      <div className="max-w-5xl mx-auto px-3 sm:px-6">
        {/* Blog Post Content */}
        <div className="bg-[color:var(--boxcolor)] rounded-[8px] sm:rounded-[15px] backdrop-blur-sm border-[3px] sm:border-[5px] border-[rgba(140,198,63,0.2)] p-4 sm:p-8">

          {/* Header */}
          <div className="mb-4 sm:mb-6">
            <h1 className="text-[color:var(--lightgreen)] text-[clamp(24px,6vw,42px)] font-bold mb-3 sm:mb-4 leading-tight">
              {blogPost.title}
            </h1>
            
            {/* Metadata */}
            <div className="flex flex-wrap gap-2 sm:gap-4 text-[color:var(--lightgreen)] opacity-75 mb-3 sm:mb-4 text-sm sm:text-base">
              {blogPost.created_at && (
                <div className="flex items-center">
                  <span>Published {formatDate(blogPost.created_at)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Images */}
          {blogImages.length > 0 && (
            <div className="mb-4 sm:mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {blogImages.map((image) => (
                  <div key={image.id} className="rounded-lg overflow-hidden shadow-lg">
                    <img 
                      src={image.image_url}
                      alt={`${blogPost.title} - Image`}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Blog Post Content */}
          <div className="prose prose-lg max-w-none">
            <div className="text-[color:var(--lightgreen)] leading-relaxed text-[clamp(14px,1.2vw,18px)] opacity-90">
              {blogPost.content && (
                <div 
                  className="mb-4 sm:mb-6" 
                  dangerouslySetInnerHTML={{__html: linkify(blogPost.content)}}
                />
              )}
              
              <p className="text-xs sm:text-sm opacity-75 mt-6 pt-4 border-t border-[rgba(140,198,63,0.2)]">
                This article is part of the Climate Stories Library news section, 
                sharing updates and insights from our platform and community.
              </p>
            </div>
          </div>

          {/* Share Section */}
          <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-[rgba(140,198,63,0.2)]">
            <h3 className="text-[color:var(--lightgreen)] text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
              Share This Article
            </h3>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(blogPost.title || '')}&url=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[rgba(140,198,63,0.2)] text-[color:var(--lightgreen)] px-3 sm:px-4 py-2 rounded-lg hover:bg-[rgba(140,198,63,0.3)] transition-colors duration-300 text-xs sm:text-sm"
              >
                Share on Twitter
              </a>
              <a
                href={`https://bsky.app/intent/compose?text=${encodeURIComponent(`${blogPost.title} ${window.location.href}`)}`}
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
              href="/news" 
              className="inline-block bg-[color:var(--lightgreen)] text-[color:var(--darkgreen)] py-3 sm:py-4 px-6 sm:px-8 rounded-lg font-semibold text-base sm:text-lg hover:bg-[color:var(--darkgreen)] hover:text-[color:var(--lightgreen)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_5px_15px_rgba(140,198,63,0.3)] mr-2 sm:mr-4"
            >
              Back To News
            </Link>
            <Link 
              href="/" 
              className="inline-block bg-transparent text-[color:var(--lightgreen)] py-3 sm:py-4 px-6 sm:px-8 rounded-lg font-semibold text-base sm:text-lg border-2 border-[color:var(--lightgreen)] hover:bg-[color:var(--lightgreen)] hover:text-[color:var(--darkgreen)] transition-all duration-300 hover:-translate-y-0.5"
            >
              View Stories
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

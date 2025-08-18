"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import BlogCard from "@/components/BlogCard";
import { 
  fetchBlogPosts, 
  fetchBlogImages,
  BlogPost, 
  BlogImages,
} from "@/utils/useSupabase";

export default function News() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [blogImages, setBlogImages] = useState<{ [postId: string]: BlogImages[] }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load blog posts and their images on component mount
  useEffect(() => {
    const loadBlogData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch all blog posts
        const posts = await fetchBlogPosts();
        setBlogPosts(posts);

        // Fetch images for each blog post
        const imagesMap: { [postId: string]: BlogImages[] } = {};
        
        await Promise.all(
          posts.map(async (post) => {
            try {
              const images = await fetchBlogImages(post.id);
              imagesMap[post.id] = images;
            } catch (err) {
              console.error(`Error fetching images for post ${post.id}:`, err);
              imagesMap[post.id] = [];
            }
          })
        );
        
        setBlogImages(imagesMap);
      } catch (error) {
        console.error('Error loading blog data:', error);
        setError('Failed to load blog posts');
        setBlogPosts([]);
        setBlogImages({});
      } finally {
        setLoading(false);
      }
    };

    loadBlogData();
  }, []);

  // Get first image for a blog post
  const getFirstImage = (postId: string): BlogImages | null => {
    const images = blogImages[postId];
    return images && images.length > 0 ? images[0] : null;
  };

  return (
    <div className="min-h-fit pb-[10vh] bg-[color:var(--background)] transition-colors duration-300">
      <div className="max-w-full md:max-w-[80vw] mx-auto py-4 md:py-10 px-3 md:px-5 text-green-600">
        <div className="bg-[color:var(--boxcolor)] rounded-[8px] md:rounded-[15px] backdrop-blur-sm border-[3px] md:border-[5px] border-[rgba(140,198,63,0.2)] text-center p-3 md:p-10 pt-2 md:pt-2 pb-4 md:pb-10 mb-4 md:mb-8">
          
          {/* Header */}
          <h2 className="text-[color:var(--lightgreen)] text-[clamp(24px,6vw,50px)] mb-2 md:mb-5 hidden sm:block font-bold">
            Climate Stories Library News
          </h2>
          <h2 className="text-[color:var(--lightgreen)] text-[clamp(24px,6vw,50px)] mb-2 md:mb-5 block sm:hidden font-bold">
            Library News
          </h2>
          <p className="text-[color:var(--lightgreen)] text-[clamp(12px,3vw,18px)] leading-relaxed opacity-90 max-w-[700px] mx-auto mb-4 md:mb-10">
            Stay updated with the latest news, insights, and developments from the Climate Stories Library project.
          </p>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {loading ? (
              // Loading state
              [...Array(6)].map((_, index) => (
                <div key={index} className="bg-[rgba(255,255,255,0.08)] rounded-xl border border-[rgba(140,198,63,0.2)] overflow-hidden animate-pulse">
                  <div className="w-full h-[180px] bg-gradient-to-br from-[rgba(140,198,63,0.3)] to-[rgba(140,198,63,0.1)] md:h-[150px] max-[580px]:h-[120px]" />
                  <div className="p-5">
                    <div className="h-4 bg-[rgba(140,198,63,0.3)] rounded mb-2" />
                    <div className="h-3 bg-[rgba(140,198,63,0.2)] rounded mb-3" />
                    <div className="h-6 w-20 bg-[rgba(140,198,63,0.2)] rounded" />
                  </div>
                </div>
              ))
            ) : error ? (
              // Error state
              <div className="col-span-full text-center py-10">
                <p className="text-red-400 text-lg mb-4">
                  {error}
                </p>
                <button 
                  onClick={() => window.location.reload()}
                  className="bg-[color:var(--lightgreen)] text-[color:var(--darkgreen)] py-2 px-4 rounded-lg font-semibold hover:bg-[color:var(--darkgreen)] hover:text-[color:var(--lightgreen)] transition-all duration-300"
                >
                  Try Again
                </button>
              </div>
            ) : blogPosts.length > 0 ? (
              // Blog posts
              blogPosts.map((post) => (
                <BlogCard
                  key={post.id}
                  post={post}
                  firstImage={getFirstImage(post.id)}
                />
              ))
            ) : (
              // No posts state
              <div className="col-span-full text-center py-10">
                <p className="text-[color:var(--lightgreen)] text-lg mb-4">
                  No news articles found.
                </p>
                <p className="text-[color:var(--lightgreen)] text-sm opacity-70">
                  Check back soon for updates from the Climate Stories Library team.
                </p>
              </div>
            )}
          </div>

          {/* Call to Action */}
          <div className="mt-6 md:mt-9">
            <Link 
              href="/" 
              className="inline-block bg-[color:var(--lightgreen)] text-[color:var(--darkgreen)] py-3 md:py-4 px-6 md:px-9 rounded-lg no-underline font-semibold text-[clamp(12px,3vw,18px)] transition-all duration-300 hover:bg-[color:var(--darkgreen)] hover:text-[color:var(--lightgreen)] hover:-translate-y-0.5 hover:shadow-[0_5px_15px_rgba(140,198,63,0.3)]"
            >
              View Climate Stories
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

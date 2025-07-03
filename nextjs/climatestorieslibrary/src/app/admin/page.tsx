"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser, isUserAdmin, signOut, fetchStories, fetchTags, Story, Tag } from '@/utils/useSupabase';

export default function Admin() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stories, setStories] = useState<Story[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [storiesLoading, setStoriesLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { user: currentUser, session } = await getCurrentUser();
      
      if (!currentUser || !session) {
        router.push('/login');
        return;
      }

      const adminStatus = await isUserAdmin(currentUser);
      if (!adminStatus) {
        router.push('/login');
        return;
      }

      setUser(currentUser);
      setLoading(false);
      
      // Load admin data
      loadAdminData();
    };

    checkAuth();
  }, [router]);

  const loadAdminData = async () => {
    setStoriesLoading(true);
    try {
      const [fetchedStories, fetchedTags] = await Promise.all([
        fetchStories(),
        fetchTags()
      ]);
      
      setStories(fetchedStories);
      setTags(fetchedTags);
    } catch (error) {
      console.error('Error loading admin data:', error);
      setError('Failed to load admin data');
    } finally {
      setStoriesLoading(false);
    }
  };

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      console.error('Error signing out:', error);
    } else {
      router.push('/login');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[color:var(--background)] flex items-center justify-center py-4 md:py-10">
        <div className="max-w-4xl mx-auto px-3 md:px-6 w-full">
          <div className="bg-[color:var(--boxcolor)] rounded-[8px] md:rounded-[15px] backdrop-blur-sm border-[3px] md:border-[5px] border-[rgba(140,198,63,0.2)] p-4 md:p-8 text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-[rgba(140,198,63,0.3)] rounded mb-4"></div>
              <div className="h-4 bg-[rgba(140,198,63,0.2)] rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[color:var(--background)] py-4 md:py-10">
      <div className="max-w-6xl mx-auto px-3 md:px-6">
        {/* Header */}
        <div className="bg-[color:var(--boxcolor)] rounded-[8px] md:rounded-[15px] backdrop-blur-sm border-[3px] md:border-[5px] border-[rgba(140,198,63,0.2)] p-4 md:p-8 mb-4 md:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-[color:var(--lightgreen)] text-[clamp(24px,6vw,36px)] mb-2 font-bold">
                Admin Dashboard
              </h1>
              <p className="text-[color:var(--lightgreen)] text-[clamp(12px,3vw,16px)] opacity-90">
                Welcome back, {user?.email}
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex gap-3">
              <Link
                href="/"
                className="bg-transparent text-[color:var(--lightgreen)] border-2 border-[color:var(--lightgreen)] py-2 md:py-3 px-4 md:px-6 rounded-lg font-semibold text-sm md:text-base transition-all duration-300 hover:bg-[color:var(--lightgreen)] hover:text-[color:var(--darkgreen)]"
              >
                View Site
              </Link>
              <button
                onClick={handleSignOut}
                className="bg-red-500 text-white py-2 md:py-3 px-4 md:px-6 rounded-lg font-semibold text-sm md:text-base transition-all duration-300 hover:bg-red-600"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-4 md:mb-8 p-4 bg-red-100 border border-red-300 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-4 md:mb-8">
          <div className="bg-[color:var(--boxcolor)] rounded-[8px] md:rounded-[15px] backdrop-blur-sm border-[3px] md:border-[5px] border-[rgba(140,198,63,0.2)] p-4 md:p-6">
            <h3 className="text-[color:var(--lightgreen)] text-lg md:text-xl font-semibold mb-2">
              Total Stories
            </h3>
            <p className="text-[color:var(--lightgreen)] text-2xl md:text-3xl font-bold">
              {storiesLoading ? '...' : stories.length}
            </p>
          </div>
          
          <div className="bg-[color:var(--boxcolor)] rounded-[8px] md:rounded-[15px] backdrop-blur-sm border-[3px] md:border-[5px] border-[rgba(140,198,63,0.2)] p-4 md:p-6">
            <h3 className="text-[color:var(--lightgreen)] text-lg md:text-xl font-semibold mb-2">
              Total Tags
            </h3>
            <p className="text-[color:var(--lightgreen)] text-2xl md:text-3xl font-bold">
              {storiesLoading ? '...' : tags.length}
            </p>
          </div>
          
          <div className="bg-[color:var(--boxcolor)] rounded-[8px] md:rounded-[15px] backdrop-blur-sm border-[3px] md:border-[5px] border-[rgba(140,198,63,0.2)] p-4 md:p-6">
            <h3 className="text-[color:var(--lightgreen)] text-lg md:text-xl font-semibold mb-2">
              Countries
            </h3>
            <p className="text-[color:var(--lightgreen)] text-2xl md:text-3xl font-bold">
              {storiesLoading ? '...' : [...new Set(stories.map(s => s.country).filter(Boolean))].length}
            </p>
          </div>
        </div>

        {/* Recent Stories */}
        <div className="bg-[color:var(--boxcolor)] rounded-[8px] md:rounded-[15px] backdrop-blur-sm border-[3px] md:border-[5px] border-[rgba(140,198,63,0.2)] p-4 md:p-8">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h2 className="text-[color:var(--lightgreen)] text-[clamp(18px,4vw,24px)] font-bold">
              Recent Stories
            </h2>
            <button
              onClick={loadAdminData}
              disabled={storiesLoading}
              className="bg-[color:var(--lightgreen)] text-[color:var(--darkgreen)] py-2 px-4 rounded-lg font-semibold text-sm transition-all duration-300 hover:bg-[color:var(--darkgreen)] hover:text-[color:var(--lightgreen)] disabled:opacity-50"
            >
              {storiesLoading ? 'Loading...' : 'Refresh'}
            </button>
          </div>
          
          {storiesLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="h-4 bg-[rgba(140,198,63,0.3)] rounded mb-2"></div>
                  <div className="h-3 bg-[rgba(140,198,63,0.2)] rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {stories.slice(0, 10).map((story) => (
                <div 
                  key={story.id} 
                  className="border border-[rgba(140,198,63,0.2)] rounded-lg p-4 hover:bg-[rgba(255,255,255,0.05)] transition-colors duration-300"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex-1">
                      <h3 className="text-[color:var(--lightgreen)] font-semibold mb-1">
                        {story.title}
                      </h3>
                      <p className="text-[color:var(--lightgreen)] opacity-70 text-sm">
                        {story.country && story.continent ? `${story.country}, ${story.continent}` : story.country || story.continent || 'Location not specified'}
                      </p>
                      <p className="text-[color:var(--lightgreen)] opacity-60 text-xs mt-1">
                        Added: {new Date(story.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="mt-2 sm:mt-0 sm:ml-4">
                      <Link
                        href={`/stories/${story.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`}
                        className="inline-block bg-[color:var(--lightgreen)] text-[color:var(--darkgreen)] py-1 px-3 rounded text-sm font-semibold hover:bg-[color:var(--darkgreen)] hover:text-[color:var(--lightgreen)] transition-colors duration-300"
                        target="_blank"
                      >
                        View Story
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
              
              {stories.length === 0 && (
                <p className="text-[color:var(--lightgreen)] opacity-70 text-center py-8">
                  No stories found.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

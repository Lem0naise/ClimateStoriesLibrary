"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  getCurrentUser, 
  isUserAdmin, 
  signOut, 
  fetchStories, 
  fetchTags, 
  createStory, 
  updateStory, 
  deleteStory, 
  fetchStoryById,
  addTagsToStory,
  removeTagsFromStory,
  createTag,
  updateTag,
  deleteTag,
  Story, 
  Tag 
} from '@/utils/useSupabase';

type StoryFormData = {
  title: string;
  youtube_url: string;
  story_date: string;
  continent: string;
  country: string;
  region: string;
  classification: string;
  description: string;
  selectedTags: string[];
};

export default function Admin() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stories, setStories] = useState<Story[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [storiesLoading, setStoriesLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showStoryForm, setShowStoryForm] = useState(false);
  const [editingStory, setEditingStory] = useState<Story | null>(null);
  const [storyFormData, setStoryFormData] = useState<StoryFormData>({
    title: '',
    youtube_url: '',
    story_date: '',
    continent: '',
    country: '',
    region: '',
    classification: '',
    description: '',
    selectedTags: []
  });
  const [formLoading, setFormLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleteTagConfirm, setDeleteTagConfirm] = useState<string | null>(null);
  const [inlineEditingTag, setInlineEditingTag] = useState<string | null>(null);
  const [inlineTagName, setInlineTagName] = useState('');
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

  const resetForm = () => {
    setStoryFormData({
      title: '',
      youtube_url: '',
      story_date: '',
      continent: '',
      country: '',
      region: '',
      classification: '',
      description: '',
      selectedTags: []
    });
    setEditingStory(null);
    setShowStoryForm(false);
  };

  const handleCreateStory = () => {
    resetForm();
    setShowStoryForm(true);
  };

  const handleEditStory = async (storyId: string) => {
    const story = await fetchStoryById(storyId);
    if (story) {
      setStoryFormData({
        title: story.title,
        youtube_url: story.youtube_url,
        story_date: story.story_date,
        continent: story.continent,
        country: story.country,
        region: story.region,
        classification: story.classification,
        description: story.description || '',
        selectedTags: story.tags?.map(tag => tag.id) || []
      });
      setEditingStory(story);
      setShowStoryForm(true);
    }
  };

  const handleDeleteStory = async (storyId: string) => {
    if (deleteConfirm === storyId) {
      setFormLoading(true);
      const { error } = await deleteStory(storyId);
      if (error) {
        setError(error);
      } else {
        await loadAdminData();
      }
      setDeleteConfirm(null);
      setFormLoading(false);
    } else {
      setDeleteConfirm(storyId);
    }
  };

  const handleSubmitStory = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setError(null);

    try {
      const storyData = {
        title: storyFormData.title,
        youtube_url: storyFormData.youtube_url,
        story_date: storyFormData.story_date,
        continent: storyFormData.continent,
        country: storyFormData.country,
        region: storyFormData.region,
        classification: storyFormData.classification,
        description: storyFormData.description
      };

      let storyResult;
      if (editingStory) {
        storyResult = await updateStory(editingStory.id, storyData);
      } else {
        storyResult = await createStory(storyData);
      }

      if (storyResult.error) {
        setError(storyResult.error);
        setFormLoading(false);
        return;
      }

      const storyId = storyResult.story?.id;
      if (storyId) {
        // Remove existing tags and add new ones
        await removeTagsFromStory(storyId);
        if (storyFormData.selectedTags.length > 0) {
          await addTagsToStory(storyId, storyFormData.selectedTags);
        }
      }

      resetForm();
      await loadAdminData();
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setFormLoading(false);
    }
  };

  const handleTagToggle = (tagId: string) => {
    setStoryFormData(prev => ({
      ...prev,
      selectedTags: prev.selectedTags.includes(tagId)
        ? prev.selectedTags.filter(id => id !== tagId)
        : [...prev.selectedTags, tagId]
    }));
  };

  const handleCreateTag = () => {
    setInlineEditingTag('new');
    setInlineTagName('');
  };

  const handleEditTag = (tag: Tag) => {
    setInlineEditingTag(tag.id);
    setInlineTagName(tag.name);
  };

  const handleCancelInlineEdit = () => {
    setInlineEditingTag(null);
    setInlineTagName('');
  };

  const handleSaveInlineEdit = async (tagId: string) => {
    setFormLoading(true);
    setError(null);

    try {
      let result;
      if (tagId === 'new') {
        result = await createTag(inlineTagName);
      } else {
        result = await updateTag(tagId, inlineTagName);
      }

      if (result.error) {
        setError(result.error);
        setFormLoading(false);
        return;
      }

      setInlineEditingTag(null);
      setInlineTagName('');
      await loadAdminData();
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteTag = async (tagId: string) => {
    if (deleteTagConfirm === tagId) {
      setFormLoading(true);
      const { error } = await deleteTag(tagId);
      if (error) {
        setError(error);
      } else {
        await loadAdminData();
      }
      setDeleteTagConfirm(null);
      setFormLoading(false);
    } else {
      setDeleteTagConfirm(tagId);
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
                className="bg-transparent text-[color:var(--lightgreen)] border-2 border-[color:var(--lightgreen)] py-2 md:py-3 px-4 md:px-6 rounded-lg font-semibold text-sm md:text-base transition-all duration-300 hover:bg-[color:var(--lightgreen)] "
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
          <h3 className="text-[color:var(--lightgreen)] text-xl md:text-3xl font-semibold mt-5">
              {storiesLoading ? '...' : stories.length} Stories, {storiesLoading ? '...' : tags.length} Tags, {storiesLoading ? '...' : [...new Set(stories.map(s => s.country).filter(Boolean))].length} Countries
            </h3>
        </div>

        {error && (
          <div className="mb-4 md:mb-8 p-4 bg-red-100 border border-red-300 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

  {/* Tag Management Section */}
        <div className="bg-[color:var(--boxcolor)] rounded-[8px] md:rounded-[15px] backdrop-blur-sm border-[3px] md:border-[5px] border-[rgba(140,198,63,0.2)] p-4 md:p-8 mb-4 md:mb-8">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h2 className="text-[color:var(--lightgreen)] text-[clamp(18px,4vw,24px)] font-bold">
              Tag Management
            </h2>
            <button
              onClick={handleCreateTag}
              className="bg-green-500 text-white py-2 px-4 rounded-lg font-semibold text-sm transition-all duration-300 hover:bg-green-600"
            >
              Create Tag
            </button>
          </div>

          {/* Tags List */}
          {storiesLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="h-4 bg-[rgba(140,198,63,0.3)] rounded mb-2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* New tag creation row */}
              {inlineEditingTag === 'new' && (
                <div className="border border-[rgba(140,198,63,0.2)] rounded-lg p-4 bg-[rgba(255,255,255,0.05)]">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={inlineTagName}
                        onChange={(e) => setInlineTagName(e.target.value)}
                        className="w-full p-2 bg-[rgba(255,255,255,0.1)] border border-[rgba(140,198,63,0.3)] rounded text-[color:var(--lightgreen)] placeholder-gray-400 focus:border-[color:var(--lightgreen)] focus:outline-none mb-1"
                        placeholder="Enter tag name"
                        autoFocus
                      />
                      <p className="text-[color:var(--lightgreen)] opacity-60 text-xs">
                        New tag
                      </p>
                    </div>
                    <div className="ml-4 flex gap-2">
                      <button
                        onClick={() => handleSaveInlineEdit('new')}
                        disabled={formLoading || !inlineTagName.trim()}
                        className="bg-green-500 text-white py-1 px-3 rounded text-sm font-semibold hover:bg-green-600 transition-colors duration-300 disabled:opacity-50"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelInlineEdit}
                        disabled={formLoading}
                        className="bg-gray-500 text-white py-1 px-3 rounded text-sm font-semibold hover:bg-gray-600 transition-colors duration-300 disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {tags.map((tag) => (
                <div 
                  key={tag.id} 
                  className="border border-[rgba(140,198,63,0.2)] rounded-lg p-4 hover:bg-[rgba(255,255,255,0.05)] transition-colors duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      {inlineEditingTag === tag.id ? (
                        <input
                          type="text"
                          value={inlineTagName}
                          onChange={(e) => setInlineTagName(e.target.value)}
                          className="w-full p-2 bg-[rgba(255,255,255,0.1)] border border-[rgba(140,198,63,0.3)] rounded text-[color:var(--lightgreen)] placeholder-gray-400 focus:border-[color:var(--lightgreen)] focus:outline-none mb-1"
                          autoFocus
                        />
                      ) : (
                        <h3 className="text-[color:var(--lightgreen)] font-semibold mb-1">
                          {tag.name}
                        </h3>
                      )}
                      <p className="text-[color:var(--lightgreen)] opacity-60 text-xs">
                        Created: {new Date(tag.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="ml-4 flex gap-2">
                      {inlineEditingTag === tag.id ? (
                        <>
                          <button
                            onClick={() => handleSaveInlineEdit(tag.id)}
                            disabled={formLoading}
                            className="bg-green-500 text-white py-1 px-3 rounded text-sm font-semibold hover:bg-green-600 transition-colors duration-300 disabled:opacity-50"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancelInlineEdit}
                            disabled={formLoading}
                            className="bg-gray-500 text-white py-1 px-3 rounded text-sm font-semibold hover:bg-gray-600 transition-colors duration-300 disabled:opacity-50"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEditTag(tag)}
                            className="bg-yellow-500 text-white py-1 px-3 rounded text-sm font-semibold hover:bg-yellow-600 transition-colors duration-300"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteTag(tag.id)}
                            disabled={formLoading}
                            className={`py-1 px-3 rounded text-sm font-semibold transition-colors duration-300 ${
                              deleteTagConfirm === tag.id 
                                ? 'bg-red-600 text-white hover:bg-red-700' 
                                : 'bg-red-500 text-white hover:bg-red-600'
                            } disabled:opacity-50`}
                          >
                            {deleteTagConfirm === tag.id ? 'Confirm?' : 'Delete'}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {tags.length === 0 && (
                <div className="col-span-full">
                  <p className="text-[color:var(--lightgreen)] opacity-70 text-center py-8">
                    No tags found.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>


        {/* Story Form Section */}
        {showStoryForm && (
          <div className="bg-[color:var(--boxcolor)] rounded-[8px] md:rounded-[15px] backdrop-blur-sm border-[3px] md:border-[5px] border-[rgba(140,198,63,0.2)] p-4 md:p-8 mb-4 md:mb-8">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h2 className="text-[color:var(--lightgreen)] text-[clamp(18px,4vw,24px)] font-bold">
                {editingStory ? 'Edit Story' : 'Create New Story'}
              </h2>
              <button
                onClick={resetForm}
                className="text-[color:var(--lightgreen)] hover:opacity-70 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitStory} className="space-y-4">
              <div>
                <label className="block text-[color:var(--lightgreen)] text-sm font-semibold mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={storyFormData.title}
                  onChange={(e) => setStoryFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                  className="w-full p-3 bg-[rgba(255,255,255,0.1)] border border-[rgba(140,198,63,0.3)] rounded-lg text-[color:var(--lightgreen)] placeholder-gray-400 focus:border-[color:var(--lightgreen)] focus:outline-none"
                  placeholder="Enter story title"
                />
              </div>

              <div>
                <label className="block text-[color:var(--lightgreen)] text-sm font-semibold mb-2">
                  YouTube URL *
                </label>
                <input
                  type="url"
                  value={storyFormData.youtube_url}
                  onChange={(e) => setStoryFormData(prev => ({ ...prev, youtube_url: e.target.value }))}
                  required
                  className="w-full p-3 bg-[rgba(255,255,255,0.1)] border border-[rgba(140,198,63,0.3)] rounded-lg text-[color:var(--lightgreen)] placeholder-gray-400 focus:border-[color:var(--lightgreen)] focus:outline-none"
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[color:var(--lightgreen)] text-sm font-semibold mb-2">
                    Story Date *
                  </label>
                  <input
                    type="date"
                    value={storyFormData.story_date}
                    onChange={(e) => setStoryFormData(prev => ({ ...prev, story_date: e.target.value }))}
                    required
                    className="w-full p-3 bg-[rgba(255,255,255,0.1)] border border-[rgba(140,198,63,0.3)] rounded-lg text-[color:var(--lightgreen)] focus:border-[color:var(--lightgreen)] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[color:var(--lightgreen)] text-sm font-semibold mb-2">
                    Classification
                  </label>
                  <input
                    type="text"
                    value={storyFormData.classification}
                    onChange={(e) => setStoryFormData(prev => ({ ...prev, classification: e.target.value }))}
                    className="w-full p-3 bg-[rgba(255,255,255,0.1)] border border-[rgba(140,198,63,0.3)] rounded-lg text-[color:var(--lightgreen)] placeholder-gray-400 focus:border-[color:var(--lightgreen)] focus:outline-none"
                    placeholder="Story classification"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[color:var(--lightgreen)] text-sm font-semibold mb-2">
                    Continent
                  </label>
                  <input
                    type="text"
                    value={storyFormData.continent}
                    onChange={(e) => setStoryFormData(prev => ({ ...prev, continent: e.target.value }))}
                    className="w-full p-3 bg-[rgba(255,255,255,0.1)] border border-[rgba(140,198,63,0.3)] rounded-lg text-[color:var(--lightgreen)] placeholder-gray-400 focus:border-[color:var(--lightgreen)] focus:outline-none"
                    placeholder="Continent"
                  />
                </div>

                <div>
                  <label className="block text-[color:var(--lightgreen)] text-sm font-semibold mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    value={storyFormData.country}
                    onChange={(e) => setStoryFormData(prev => ({ ...prev, country: e.target.value }))}
                    className="w-full p-3 bg-[rgba(255,255,255,0.1)] border border-[rgba(140,198,63,0.3)] rounded-lg text-[color:var(--lightgreen)] placeholder-gray-400 focus:border-[color:var(--lightgreen)] focus:outline-none"
                    placeholder="Country"
                  />
                </div>

                <div>
                  <label className="block text-[color:var(--lightgreen)] text-sm font-semibold mb-2">
                    Region
                  </label>
                  <input
                    type="text"
                    value={storyFormData.region}
                    onChange={(e) => setStoryFormData(prev => ({ ...prev, region: e.target.value }))}
                    className="w-full p-3 bg-[rgba(255,255,255,0.1)] border border-[rgba(140,198,63,0.3)] rounded-lg text-[color:var(--lightgreen)] placeholder-gray-400 focus:border-[color:var(--lightgreen)] focus:outline-none"
                    placeholder="Region"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[color:var(--lightgreen)] text-sm font-semibold mb-2">
                  Description
                </label>
                <textarea
                  value={storyFormData.description}
                  onChange={(e) => setStoryFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="w-full p-3 bg-[rgba(255,255,255,0.1)] border border-[rgba(140,198,63,0.3)] rounded-lg text-[color:var(--lightgreen)] placeholder-gray-400 focus:border-[color:var(--lightgreen)] focus:outline-none resize-vertical"
                  placeholder="Story description"
                />
              </div>

              <div>
                <label className="block text-[color:var(--lightgreen)] text-sm font-semibold mb-2">
                  Tags
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-32 overflow-y-auto p-2 border border-[rgba(140,198,63,0.3)] rounded-lg bg-[rgba(255,255,255,0.05)]">
                  {tags.map((tag) => (
                    <label key={tag.id} className="flex items-center space-x-2 text-sm">
                      <input
                        type="checkbox"
                        checked={storyFormData.selectedTags.includes(tag.id)}
                        onChange={() => handleTagToggle(tag.id)}
                        className="rounded"
                      />
                      <span className="text-[color:var(--lightgreen)]">{tag.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 bg-[color:var(--lightgreen)] text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 hover:bg-[color:var(--darkgreen)] hover:text-[color:var(--lightgreen)] disabled:opacity-50"
                >
                  {formLoading ? 'Saving...' : editingStory ? 'Update Story' : 'Create Story'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 border border-[color:var(--lightgreen)] text-[color:var(--lightgreen)] rounded-lg font-semibold hover:bg-[color:var(--lightgreen)] transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

      

        {/* Story Management Section */}
        <div className="bg-[color:var(--boxcolor)] rounded-[8px] md:rounded-[15px] backdrop-blur-sm border-[3px] md:border-[5px] border-[rgba(140,198,63,0.2)] p-4 md:p-8 mb-4 md:mb-8">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h2 className="text-[color:var(--lightgreen)] text-[clamp(18px,4vw,24px)] font-bold">
              Story Management
            </h2>
            <div className="flex gap-2">
              <button
                onClick={handleCreateStory}
                className="bg-green-500 text-white py-2 px-4 rounded-lg font-semibold text-sm transition-all duration-300 hover:bg-green-600"
              >
                Create Story
              </button>
              <button
                onClick={loadAdminData}
                disabled={storiesLoading}
                className="bg-[color:var(--lightgreen)] text-white py-2 px-4 rounded-lg font-semibold text-sm transition-all duration-300 hover:bg-[color:var(--darkgreen)] disabled:opacity-50"
              >
                {storiesLoading ? 'Loading...' : 'Refresh'}
              </button>
            </div>
          </div>

          {/* Stories List */}
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
              {stories.map((story) => (
                <div 
                  key={story.id} 
                  className="border border-[rgba(140,198,63,0.2)] rounded-lg p-4 hover:bg-[rgba(255,255,255,0.05)] transition-colors duration-300"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
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
                      {story.tags && story.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {story.tags.slice(0, 3).map((tag) => (
                            <span key={tag.id} className="text-xs bg-[rgba(140,198,63,0.2)] text-[color:var(--lightgreen)] px-2 py-1 rounded">
                              {tag.name}
                            </span>
                          ))}
                          {story.tags.length > 3 && (
                            <span className="text-xs text-[color:var(--lightgreen)] opacity-70">
                              +{story.tags.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="mt-3 lg:mt-0 lg:ml-4 flex gap-2">
                      <Link
                        href={`/stories/${story.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`}
                        className="bg-blue-500 text-white py-1 px-3 rounded text-sm font-semibold hover:bg-blue-600 transition-colors duration-300"
                        target="_blank"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => handleEditStory(story.id)}
                        className="bg-yellow-500 text-white py-1 px-3 rounded text-sm font-semibold hover:bg-yellow-600 transition-colors duration-300"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteStory(story.id)}
                        disabled={formLoading}
                        className={`py-1 px-3 rounded text-sm font-semibold transition-colors duration-300 ${
                          deleteConfirm === story.id 
                            ? 'bg-red-600 text-white hover:bg-red-700' 
                            : 'bg-red-500 text-white hover:bg-red-600'
                        } disabled:opacity-50`}
                      >
                        {deleteConfirm === story.id ? 'Confirm?' : 'Delete'}
                      </button>
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
                           
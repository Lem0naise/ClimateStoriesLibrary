import { createClient } from '@supabase/supabase-js';

// Types
export interface Story {
  id: string;
  created_at: string;
  title: string;
  youtube_url: string;
  story_date: string;
  continent: string;
  country: string;
  region: string;
  classification: string;
  description: string;
  tags?: Tag[];
  latitude: string;
  longitude: string;
}

export interface Tag {
  id: string;
  name: string;
}

export interface StoryTag {
  story_id: string;
  tag_id: string;
}

export interface Submission {
  id?: string;
  created_at?: string;
  email?: string | null;
  tel?: string | null;
  name?: string | null;
  location: string;
  occupation?: string | null;
  more_about?: string | null;
  agreed_policy_version: string;
  approved: boolean;
}

export interface FilterOptions {
  tags: string[];
  continents: string[];
  countries: string[];
}

export interface Organisation {
  id: string;
  created_at: string;
  name: string | null;
  description: string | null;
  email: string | null;
  tel: string | null;
  url: string | null;
  location: string | null;
  logo_url: string | null;
}

export interface GlobalAdvisor {
  id: string;
  created_at: string;
  name: string | null;
  title: string | null;
  description: string | null;
  logo_url: string | null;
}

export interface BlogPost { 
  id: string;
  created_at: string;
  title: string | null;
  content: string | null;
}

export interface BlogImages {
  id:string;
  created_at: string;
  post_id: string;
  image_url: string;
}

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Fetch all stories with their tags
export async function fetchStories(): Promise<Story[]> {
  try {
    const { data, error } = await supabase
      .from('stories')
      .select(`
        *,
        story_tags(
          tags(*)
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching stories:', error);
      return [];
    }

    // Transform the data to include tags array
    const storiesWithTags = data?.map(story => ({
      ...story,
      tags: story.story_tags?.map((st: any) => st.tags).filter(Boolean) || []
    })) || [];

    return storiesWithTags;
  } catch (error) {
    console.error('Error fetching stories:', error);
    return [];
  }
}

// Generate a URL-friendly slug from a title
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Fetch a story by slug (title-based) and fallback to ID
export async function fetchStoryBySlug(slug: string): Promise<Story | null> {
  try {

    // Try to find by matching the slug generated from title
    const { data, error } = await supabase
      .from('stories')
      .select(`
        *,
        story_tags(
          tags(*)
        )
      `);

    if (error) {
      console.error('Error fetching stories for slug match:', error);
      return null;
    }

    if (!data) {
      return null;
    }

    // Find story with matching slug
    const matchingStory = data.find(story => 
      generateSlug(story.title) === slug
    );

    if (!matchingStory) {
      return null;
    }

    // Transform the data to include tags array
    const storyWithTags = {
      ...matchingStory,
      tags: matchingStory.story_tags?.map((st: any) => st.tags).filter(Boolean) || []
    };

    return storyWithTags;
  } catch (error) {
    console.error('Error fetching story by slug:', error);
    return null;
  }
}

// Fetch stories by tag names
export async function fetchStoriesByTags(tagNames: string[]): Promise<Story[]> {
  if (tagNames.length === 0) {
    return fetchStories();
  }

  try {
    // First get tag IDs from tag names
    const { data: tags, error: tagsError } = await supabase
      .from('tags')
      .select('id, name')
      .in('name', tagNames);

    if (tagsError) {
      console.error('Error fetching tags:', tagsError);
      return [];
    }

    if (!tags || tags.length === 0) {
      return [];
    }

    const tagIds = tags.map(tag => tag.id);

    // Then get stories that have any of these tags
    const { data, error } = await supabase
      .from('stories')
      .select(`
        *,
        story_tags!inner(
          tags(*)
        )
      `)
      .in('story_tags.tag_id', tagIds)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching filtered stories:', error);
      return [];
    }

    // Transform the data to include tags array and remove duplicates
    const uniqueStories = new Map();
    
    data?.forEach(story => {
      if (!uniqueStories.has(story.id)) {
        uniqueStories.set(story.id, {
          ...story,
          tags: story.story_tags?.map((st: any) => st.tags).filter(Boolean) || []
        });
      }
    });

    return Array.from(uniqueStories.values());
  } catch (error) {
    console.error('Error fetching filtered stories:', error);
    return [];
  }
}

// Fetch all available tags
export async function fetchTags(): Promise<Tag[]> {
  try {
    const { data, error } = await supabase
      .from('tags')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching tags:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching tags:', error);
    return [];
  }
}

// Fetch unique continents
export async function fetchContinents(): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('stories')
      .select('continent')
      .not('continent', 'is', null)
      .order('continent', { ascending: true });

    if (error) {
      console.error('Error fetching continents:', error);
      return [];
    }

    // Get unique continents
    const uniqueContinents = [...new Set(data?.map(item => item.continent).filter(Boolean))];
    return uniqueContinents;
  } catch (error) {
    console.error('Error fetching continents:', error);
    return [];
  }
}

// Fetch unique countries
export async function fetchCountries(): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('stories')
      .select('country')
      .not('country', 'is', null)
      .order('country', { ascending: true });

    if (error) {
      console.error('Error fetching countries:', error);
      return [];
    }

    // Get unique countries
    const uniqueCountries = [...new Set(data?.map(item => item.country).filter(Boolean))];
    return uniqueCountries;
  } catch (error) {
    console.error('Error fetching countries:', error);
    return [];
  }
}

// Fetch stories with multiple filter types
export async function fetchStoriesWithFilters(filters: FilterOptions): Promise<Story[]> {
  try {
    let query = supabase
      .from('stories')
      .select(`
        *,
        story_tags!inner(
          tags(*)
        )
      `);

    // Apply continent filter
    if (filters.continents.length > 0) {
      query = query.in('continent', filters.continents);
    }

    // Apply country filter
    if (filters.countries.length > 0) {
      query = query.in('country', filters.countries);
    }

    // Apply tag filter
    if (filters.tags.length > 0) {
      // First get tag IDs from tag names
      const { data: tags, error: tagsError } = await supabase
        .from('tags')
        .select('id, name')
        .in('name', filters.tags);

      if (tagsError) {
        console.error('Error fetching tags:', tagsError);
        return [];
      }

      if (tags && tags.length > 0) {
        const tagIds = tags.map(tag => tag.id);
        query = query.in('story_tags.tag_id', tagIds);
      }
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching filtered stories:', error);
      return [];
    }

    // Transform the data and remove duplicates
    const uniqueStories = new Map();
    
    data?.forEach(story => {
      if (!uniqueStories.has(story.id)) {
        uniqueStories.set(story.id, {
          ...story,
          tags: story.story_tags?.map((st: any) => st.tags).filter(Boolean) || []
        });
      }
    });

    return Array.from(uniqueStories.values());
  } catch (error) {
    console.error('Error fetching filtered stories:', error);
    return [];
  }
}

// Auth functions
export async function signInWithEmail(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Error signing in:', error);
      return { user: null, session: null, error: error.message };
    }

    return { user: data.user, session: data.session, error: null };
  } catch (error) {
    console.error('Error signing in:', error);
    return { user: null, session: null, error: 'An unexpected error occurred' };
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
      return { error: error.message };
    }
    return { error: null };
  } catch (error) {
    console.error('Error signing out:', error);
    return { error: 'An unexpected error occurred' };
  }
}

export async function getCurrentUser() {
  try {
    // First get the session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Error getting session:', sessionError);
      return { user: null, session: null, error: sessionError.message };
    }

    if (!session) {
      return { user: null, session: null, error: null };
    }

    // Then get the user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('Error getting user:', userError);
      return { user: null, session: null, error: userError.message };
    }

    return { user, session, error: null };
  } catch (error) {
    console.error('Error getting current user:', error);
    return { user: null, session: null, error: 'An unexpected error occurred' };
  }
}

// Check if user is admin (checks the admin table in database)
export async function isUserAdmin(user: any) {
  if (!user) return false;
  
  try {
    const { data, error } = await supabase
      .from('admin')
      .select('admin')
      .eq('userid', user.id)
      .single();

    if (error) {
      console.error('Error checking admin status:', error);
      return false;
    }

    return data?.admin === true;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}

export function getAuthStateChangeListener() {
  return supabase.auth.onAuthStateChange;
}

// Story CRUD operations

// Create a new story
export async function createStory(storyData: Omit<Story, 'id' | 'created_at' | 'tags'>) {
  try {
    const { data, error } = await supabase
      .from('stories')
      .insert([storyData])
      .select()
      .single();

    if (error) {
      console.error('Error creating story:', error);
      return { story: null, error: error.message };
    }

    return { story: data, error: null };
  } catch (error) {
    console.error('Error creating story:', error);
    return { story: null, error: 'An unexpected error occurred' };
  }
}

// Update an existing story
export async function updateStory(id: string, storyData: Partial<Omit<Story, 'id' | 'created_at' | 'tags'>>) {
  try {
    const { data, error } = await supabase
      .from('stories')
      .update(storyData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating story:', error);
      return { story: null, error: error.message };
    }

    return { story: data, error: null };
  } catch (error) {
    console.error('Error updating story:', error);
    return { story: null, error: 'An unexpected error occurred' };
  }
}

// Delete a story
export async function deleteStory(id: string) {
  try {
    // First delete associated story_tags
    const { error: tagError } = await supabase
      .from('story_tags')
      .delete()
      .eq('story_id', id);

    if (tagError) {
      console.error('Error deleting story tags:', tagError);
      return { error: tagError.message };
    }

    // Then delete the story
    const { error } = await supabase
      .from('stories')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting story:', error);
      return { error: error.message };
    }

    return { error: null };
  } catch (error) {
    console.error('Error deleting story:', error);
    return { error: 'An unexpected error occurred' };
  }
}

// Get a single story by ID (for editing)
export async function fetchStoryById(id: string): Promise<Story | null> {
  try {
    const { data, error } = await supabase
      .from('stories')
      .select(`
        *,
        story_tags(
          tags(*)
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching story by ID:', error);
      return null;
    }

    // Transform the data to include tags array
    const storyWithTags = {
      ...data,
      tags: data.story_tags?.map((st: any) => st.tags).filter(Boolean) || []
    };

    return storyWithTags;
  } catch (error) {
    console.error('Error fetching story by ID:', error);
    return null;
  }
}

// Add tags to a story
export async function addTagsToStory(storyId: string, tagIds: string[]) {
  try {
    const storyTags = tagIds.map(tagId => ({
      story_id: storyId,
      tag_id: tagId
    }));

    const { error } = await supabase
      .from('story_tags')
      .insert(storyTags);

    if (error) {
      console.error('Error adding tags to story:', error);
      return { error: error.message };
    }

    return { error: null };
  } catch (error) {
    console.error('Error adding tags to story:', error);
    return { error: 'An unexpected error occurred' };
  }
}

// Remove tags from a story
export async function removeTagsFromStory(storyId: string) {
  try {
    const { error } = await supabase
      .from('story_tags')
      .delete()
      .eq('story_id', storyId);

    if (error) {
      console.error('Error removing tags from story:', error);
      return { error: error.message };
    }

    return { error: null };
  } catch (error) {
    console.error('Error removing tags from story:', error);
    return { error: 'An unexpected error occurred' };
  }
}

// Create a new tag
export async function createTag(name: string) {
  try {
    const { data, error } = await supabase
      .from('tags')
      .insert([{ name }])
      .select()
      .single();

    if (error) {
      console.error('Error creating tag:', error);
      return { tag: null, error: error.message };
    }

    return { tag: data, error: null };
  } catch (error) {
    console.error('Error creating tag:', error);
    return { tag: null, error: 'An unexpected error occurred' };
  }
}

// Update an existing tag
export async function updateTag(id: string, name: string) {
  try {
    const { data, error } = await supabase
      .from('tags')
      .update({ name })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating tag:', error);
      return { tag: null, error: error.message };
    }

    return { tag: data, error: null };
  } catch (error) {
    console.error('Error updating tag:', error);
    return { tag: null, error: 'An unexpected error occurred' };
  }
}

// Delete a tag
export async function deleteTag(id: string) {
  try {
    // First delete associated story_tags
    const { error: storyTagError } = await supabase
      .from('story_tags')
      .delete()
      .eq('tag_id', id);

    if (storyTagError) {
      console.error('Error deleting story tags:', storyTagError);
      return { error: storyTagError.message };
    }

    // Then delete the tag
    const { error } = await supabase
      .from('tags')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting tag:', error);
      return { error: error.message };
    }

    return { error: null };
  } catch (error) {
    console.error('Error deleting tag:', error);
    return { error: 'An unexpected error occurred' };
  }
}

// Create a new submission
export async function createSubmission(submissionData: Omit<Submission, 'id' | 'created_at'>) {
  try {
    const { error } = await supabase
      .from('submissions')
      .insert([submissionData])

    if (error) {
      console.error('Error creating submission:', error);
      return { submission: null, error: error.message };
    }

    return { error: null };
  } catch (error) {
    console.error('Error creating submission:', error);
    return { submission: null, error: 'An unexpected error occurred' };
  }
}

// Fetch all submissions
export async function fetchSubmissions(): Promise<Submission[]> {
  try {
    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching submissions:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return [];
  }
}

// Approve a submission
export async function approveSubmission(submissionId: string) {
  try {
    const { error } = await supabase
      .from('submissions')
      .update({ approved: true })
      .eq('id', submissionId);

    if (error) {
      console.error('Error approving submission:', error);
      return { error: error.message };
    }

    return { error: null };
  } catch (error) {
    console.error('Error approving submission:', error);
    return { error: 'An unexpected error occurred' };
  }
}

// Delete a submission
export async function deleteSubmission(submissionId: string) {
  try {
    const { error } = await supabase
      .from('submissions')
      .delete()
      .eq('id', submissionId);

    if (error) {
      console.error('Error deleting submission:', error);
      return { error: error.message };
    }

    return { error: null };
  } catch (error) {
    console.error('Error deleting submission:', error);
    return { error: 'An unexpected error occurred' };
  }
}

// Fetch all organisations
export async function fetchOrganisations(): Promise<Organisation[]> {
  try {
    const { data, error } = await supabase
      .from('organisations')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching organisations:', error);
      return [];
    }
    return data || [];
  } catch (error) {
    console.error('Error fetching organisations:', error);
    return [];
  }
}

// Fetch all blog posts
export async function fetchBlogPosts(): Promise<BlogPost[]> {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching blog posts:', error);
      return [];
    }
    return data || [];
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

// Fetch a single blog post by ID
export async function fetchBlogPostById(id: string): Promise<BlogPost | null> {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching blog post by ID:', error);
      return null;
    }
    return data;
  } catch (error) {
    console.error('Error fetching blog post by ID:', error);
    return null;
  }
}

// Fetch a blog post by slug (title-based)
export async function fetchBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    // Fetch all blog posts and find the one with matching slug
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*');

    if (error) {
      console.error('Error fetching blog posts:', error);
      return null;
    }

    if (!data) {
      return null;
    }

    // Find blog post with matching slug
    const matchingPost = data.find(post => 
      generateSlug(post.title || '') === slug
    );

    return matchingPost || null;
  } catch (error) {
    console.error('Error fetching blog post by slug:', error);
    return null;
  }
}

// Create a new blog post
export async function createBlogPost(blogPostData: Omit<BlogPost, 'id' | 'created_at'>) {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .insert([blogPostData])
      .select()
      .single();

    if (error) {
      console.error('Error creating blog post:', error);
      return { blogPost: null, error: error.message };
    }

    return { blogPost: data, error: null };
  } catch (error) {
    console.error('Error creating blog post:', error);
    return { blogPost: null, error: 'An unexpected error occurred' };
  }
}

// Update an existing blog post
export async function updateBlogPost(id: string, blogPostData: Partial<Omit<BlogPost, 'id' | 'created_at'>>) {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .update(blogPostData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating blog post:', error);
      return { blogPost: null, error: error.message };
    }

    return { blogPost: data, error: null };
  } catch (error) {
    console.error('Error updating blog post:', error);
    return { blogPost: null, error: 'An unexpected error occurred' };
  }
}

// Delete a blog post and its associated images
export async function deleteBlogPost(id: string) {
  try {
    // First delete associated images from storage and database
    const images = await fetchBlogImages(id);
    for (const image of images) {
      await deleteBlogImage(image.id);
    }

    // Then delete the blog post
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting blog post:', error);
      return { error: error.message };
    }

    return { error: null };
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return { error: 'An unexpected error occurred' };
  }
}

// Fetch images for a blog post
export async function fetchBlogImages(postId: string): Promise<BlogImages[]> {
  try {
    const { data, error } = await supabase
      .from('blog_images')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching blog images:', error);
      return [];
    }
    return data || [];
  } catch (error) {
    console.error('Error fetching blog images:', error);
    return [];
  }
}

// Upload an image for a blog post
export async function uploadBlogImage(postId: string, file: File) {
  try {
    // Upload file to storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
    const filePath = `${fileName}`;
    
    const { error: uploadError } = await supabase.storage
      .from('blog_images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      console.error('Error uploading blog image:', uploadError);
      return { error: uploadError.message };
    }

    // Get public URL
    const { data } = supabase.storage.from('blog_images').getPublicUrl(filePath);
    const imageUrl = data.publicUrl;

    // Save image record to database
    const { error: dbError } = await supabase
      .from('blog_images')
      .insert([{
        post_id: postId,
        image_url: imageUrl
      }]);

    if (dbError) {
      console.error('Error saving blog image record:', dbError);
      return { error: dbError.message };
    }

    return { error: null };
  } catch (error) {
    console.error('Error uploading blog image:', error);
    return { error: 'An unexpected error occurred' };
  }
}

// Delete a blog image
export async function deleteBlogImage(imageId: string) {
  try {
    // First get the image record to get the file path
    const { data: image, error: fetchError } = await supabase
      .from('blog_images')
      .select('image_url')
      .eq('id', imageId)
      .single();

    if (fetchError) {
      console.error('Error fetching blog image for deletion:', fetchError);
      return { error: fetchError.message };
    }

    // Extract file path from URL
    if (image?.image_url) {
      const url = new URL(image.image_url);
      const filePath = url.pathname.split('/').pop();
      
      if (filePath) {
        // Delete from storage
        const { error: storageError } = await supabase.storage
          .from('blog_images')
          .remove([filePath]);

        if (storageError) {
          console.error('Error deleting blog image from storage:', storageError);
        }
      }
    }

    // Delete from database
    const { error } = await supabase
      .from('blog_images')
      .delete()
      .eq('id', imageId);

    if (error) {
      console.error('Error deleting blog image record:', error);
      return { error: error.message };
    }

    return { error: null };
  } catch (error) {
    console.error('Error deleting blog image:', error);
    return { error: 'An unexpected error occurred' };
  }
}

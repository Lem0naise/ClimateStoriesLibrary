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
  description?: string;
  tags?: Tag[];
}

export interface Tag {
  id: string;
  created_at: string;
  name: string;
}

export interface StoryTag {
  story_id: string;
  tag_id: string;
}

export interface FilterOptions {
  tags: string[];
  continents: string[];
  countries: string[];
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
        story_tags!inner(
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
        story_tags!inner(
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

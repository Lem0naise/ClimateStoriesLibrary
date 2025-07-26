"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import StoryCard from "@/components/StoryCard";
import FilterButton from "@/components/TagFilterer";
import StoriesMap from "@/components/StoriesMap";
import { 
  fetchStories, 
  fetchTags, 
  fetchContinents, 
  fetchCountries, 
  Story, 
  Tag,
} from "@/utils/useSupabase";

export default function Home() {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedContinents, setSelectedContinents] = useState<string[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [allStories, setAllStories] = useState<Story[]>([]); // Store all stories for client-side filtering
  const [tags, setTags] = useState<Tag[]>([]);
  const [continents, setContinents] = useState<string[]>([]);
  const [countries, setCountries] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtersLoading, setFiltersLoading] = useState(true);
  const [expandedFilter, setExpandedFilter] = useState<string | null>(null);
  const [searchTerms, setSearchTerms] = useState({
    tags: '',
    continents: '',
    countries: ''
  });

  // Helper function to get tags as string for StoryCard
  const getTagsString = (story: Story): string => {
    if (story.tags && story.tags.length > 0) {
      return story.tags.map(tag => tag.name).join(', ');
    }
    return story.classification || '';
  };


  // Load all filter options on component mount
  useEffect(() => {
    const loadFilterOptions = async () => {
      setFiltersLoading(true);
      try {
        const [fetchedTags, fetchedContinents, fetchedCountries] = await Promise.all([
          fetchTags(),
          fetchContinents(),
          fetchCountries()
        ]);
        
        setTags(fetchedTags);
        setContinents(fetchedContinents);
        setCountries(fetchedCountries);
      } catch (error) {
        console.error('Error loading filter options:', error);
      } finally {
        setFiltersLoading(false);
      }
    };

    loadFilterOptions();
  }, []);

  // Load stories on component mount
  useEffect(() => {
    const loadStories = async () => {
      setLoading(true);
      try {
        const fetchedStories = await fetchStories();
        setAllStories(fetchedStories); // Store all stories
        setStories(fetchedStories); // Initialize displayed stories
      } catch (error) {
        console.error('Error loading stories:', error);
        setAllStories([]);
        setStories([]);
      } finally {
        setLoading(false);
      }
    };

    loadStories();
  }, []);

  // Client-side filtering function
  const filterStoriesClientSide = (stories: Story[], tags: string[], continents: string[], countries: string[]) => {
    return stories.filter(story => {
      // Check tags filter
      if (tags.length > 0) {
        const storyTags = story.tags?.map(tag => tag.name) || [];
        const hasMatchingTag = tags.some(tag => storyTags.includes(tag));
        if (!hasMatchingTag) return false;
      }

      // Check continents filter
      if (continents.length > 0) {
        if (!story.continent || !continents.includes(story.continent)) return false;
      }

      // Check countries filter
      if (countries.length > 0) {
        if (!story.country || !countries.includes(story.country)) return false;
      }

      return true;
    });
  };

  // Filter stories client-side when any filter changes
  useEffect(() => {
    const hasFilters = selectedTags.length > 0 || selectedContinents.length > 0 || selectedCountries.length > 0;
    
    if (!hasFilters) {
      setStories(allStories);
    } else {
      const filteredStories = filterStoriesClientSide(allStories, selectedTags, selectedContinents, selectedCountries);
      setStories(filteredStories);
    }
  }, [selectedTags, selectedContinents, selectedCountries, allStories]);

  const handleTagClick = (tagName: string) => {
    setSelectedTags(prev => 
      prev.includes(tagName) 
        ? prev.filter(tag => tag !== tagName)
        : [...prev, tagName]
    );
  };

  const handleContinentClick = (continentName: string) => {
    setSelectedContinents(prev => 
      prev.includes(continentName) 
        ? prev.filter(continent => continent !== continentName)
        : [...prev, continentName]
    );
  };

  const handleCountryClick = (countryName: string) => {
    setSelectedCountries(prev => 
      prev.includes(countryName) 
        ? prev.filter(country => country !== countryName)
        : [...prev, countryName]
    );
  };

  // Get theme based on first selected filter
  const getTheme = () => {
    if (selectedTags.length > 0) return `theme-${selectedTags[0]}`;
    return '';
  };

  // Filter options based on search terms
  const getFilteredOptions = (items: any[], searchTerm: string) => {
    if (!searchTerm) return items;
    return items.filter(item => 
      (typeof item === 'string' ? item : item.name)
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  };

  const toggleFilterExpansion = (filterType: string) => {
    setExpandedFilter(expandedFilter === filterType ? null : filterType);
  };

  const clearAllFilters = () => {
    setSelectedTags([]);
    setSelectedContinents([]);
    setSelectedCountries([]);
    setSearchTerms({ tags: '', continents: '', countries: '' });
  };

  const hasActiveFilters = selectedTags.length > 0 || selectedContinents.length > 0 || selectedCountries.length > 0;

  return (
    <div className={`min-h-fit pb-[10vh] bg-[color:var(--background)] transition-colors duration-300 ${getTheme()}`}>
      <div className="max-w-full md:max-w-[80vw] mx-auto py-4 md:py-10 px-3 md:px-5 text-green-600">
        <div className="bg-[color:var(--boxcolor)] rounded-[8px] md:rounded-[15px] backdrop-blur-sm border-[3px] md:border-[5px] border-[rgba(140,198,63,0.2)] text-center p-3 md:p-10 pt-2 md:pt-2 pb-4 md:pb-10 mb-4 md:mb-8">
          <h2 className="text-[color:var(--lightgreen)] text-[clamp(24px,6vw,50px)] mb-2 md:mb-5 hidden sm:block font-bold">
            Explore the Climate Stories Library
          </h2>
          <h2 className="text-[color:var(--lightgreen)] text-[clamp(24px,6vw,50px)] mb-2 md:mb-5 block sm:hidden font-bold">
            Explore the Library
          </h2>
          <p className="text-[color:var(--lightgreen)] text-[clamp(12px,3vw,18px)] leading-relaxed opacity-90 max-w-[700px] mx-auto mb-4 md:mb-10">
            The Climate Stories Library provides a platform for individuals and grassroots groups to share their experiences of the climate and nature crisis, and other intersecting injustices.
          </p>
          
          {/* Mobile Filter Section - Above content */}
          <div className="md:hidden bg-[rgba(255,255,255,0.15)] p-2 rounded-lg border border-[rgba(140,198,63,0.3)] mb-4">
            {/* Compact Filter Section */}
            <div className="bg-[rgba(255,255,255,0.15)] p-2 rounded-lg border border-[rgba(140,198,63,0.3)] mb-3 max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-[color:var(--lightgreen)] text-sm font-semibold">
                    {hasActiveFilters && (<>{stories.length} Stories with filters</>)}
                </h3>
                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="text-xs text-[color:var(--lightgreen)] opacity-70 hover:opacity-100 underline"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Active Filters Summary */}
              {hasActiveFilters && (
                <div className="mb-2 p-2 bg-[rgba(0,0,0,0.2)] rounded-md">
                  <div className="flex flex-wrap gap-1 text-xs">
                    {selectedTags.map(tag => (
                      <span key={tag} className="bg-[#304e25] text-white px-2 py-1 rounded-md flex items-center gap-1">
                        {tag}
                        <button onClick={() => handleTagClick(tag)} className="ml-1 hover:bg-red-600 rounded">×</button>
                      </span>
                    ))}
                    {selectedContinents.map(continent => (
                      <span key={continent} className="bg-[#304e25] text-white px-2 py-1 rounded-md flex items-center gap-1">
                        {continent}
                        <button onClick={() => handleContinentClick(continent)} className="ml-1 hover:bg-red-600 rounded">×</button>
                      </span>
                    ))}
                    {selectedCountries.map(country => (
                      <span key={country} className="bg-[#304e25] text-white px-2 py-1 rounded-md flex items-center gap-1">
                        {country}
                        <button onClick={() => handleCountryClick(country)} className="ml-1 hover:bg-red-600 rounded">×</button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Filter Categories */}
              <div className="grid grid-cols-3 gap-1">
                {/* Tags Filter */}
                <div className="border border-[rgba(140,198,63,0.3)] rounded">
                  <button
                    onClick={() => toggleFilterExpansion('tags')}
                    className="w-full p-2 text-left flex items-center justify-between hover:bg-[rgba(255,255,255,0.1)]"
                  >
                    <span className="text-xs font-medium text-[color:var(--lightgreen)]">
                      Tags
                    </span>
                    <span className="text-sm">{expandedFilter === 'tags' ? '−' : '+'}</span>
                  </button>
                  {expandedFilter === 'tags' && (
                    <div className="p-2 border-t border-[rgba(140,198,63,0.3)]">
                      <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerms.tags}
                        onChange={(e) => setSearchTerms(prev => ({ ...prev, tags: e.target.value }))}
                        className="w-full p-1 mb-2 bg-[rgba(255,255,255,0.1)] border border-[rgba(140,198,63,0.3)] rounded text-white placeholder-gray-400 text-xs"
                      />
                      <div className="grid grid-cols-1 gap-1 max-h-24 overflow-y-auto">
                        {filtersLoading ? (
                          [...Array(3)].map((_, index) => (
                            <div key={index} className="bg-[rgba(255,255,255,0.1)] rounded py-1 px-1 animate-pulse">
                              <div className="h-2 bg-[rgba(140,198,63,0.3)] rounded" />
                            </div>
                          ))
                        ) : (
                          getFilteredOptions(tags, searchTerms.tags).map((tag) => (
                            <FilterButton
                              key={tag.id}
                              name={tag.name}
                              isSelected={selectedTags.includes(tag.name)}
                              onClick={handleTagClick}
                              type="tag"
                            />
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Continents Filter */}
                <div className="border border-[rgba(140,198,63,0.3)] rounded">
                  <button
                    onClick={() => toggleFilterExpansion('continents')}
                    className="w-full p-2 text-left flex items-center justify-between hover:bg-[rgba(255,255,255,0.1)]"
                  >
                    <span className="text-xs font-medium text-[color:var(--lightgreen)]">
                      Continents
                    </span>
                    <span className="text-sm">{expandedFilter === 'continents' ? '−' : '+'}</span>
                  </button>
                  {expandedFilter === 'continents' && (
                    <div className="p-2 border-t border-[rgba(140,198,63,0.3)]">
                      <div className="grid grid-cols-1 gap-1 max-h-24 overflow-y-auto">
                        {filtersLoading ? (
                          [...Array(2)].map((_, index) => (
                            <div key={index} className="bg-[rgba(255,255,255,0.1)] rounded py-1 px-1 animate-pulse">
                              <div className="h-2 bg-[rgba(140,198,63,0.3)] rounded" />
                            </div>
                          ))
                        ) : (
                          continents.map((continent) => (
                            <FilterButton
                              key={continent}
                              name={continent}
                              isSelected={selectedContinents.includes(continent)}
                              onClick={handleContinentClick}
                              type="continent"
                            />
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Countries Filter */}
                <div className="border border-[rgba(140,198,63,0.3)] rounded">
                  <button
                    onClick={() => toggleFilterExpansion('countries')}
                    className="w-full p-2 text-left flex items-center justify-between hover:bg-[rgba(255,255,255,0.1)]"
                  >
                    <span className="text-xs font-medium text-[color:var(--lightgreen)]">
                      Countries
                    </span>
                    <span className="text-sm">{expandedFilter === 'countries' ? '−' : '+'}</span>
                  </button>
                  {expandedFilter === 'countries' && (
                    <div className="p-2 border-t border-[rgba(140,198,63,0.3)]">
                      <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerms.countries}
                        onChange={(e) => setSearchTerms(prev => ({ ...prev, countries: e.target.value }))}
                        className="w-full p-1 mb-2 bg-[rgba(255,255,255,0.1)] border border-[rgba(140,198,63,0.3)] rounded text-white placeholder-gray-400 text-xs"
                      />
                      <div className="grid grid-cols-1 gap-1 max-h-24 overflow-y-auto">
                        {filtersLoading ? (
                          [...Array(3)].map((_, index) => (
                            <div key={index} className="bg-[rgba(255,255,255,0.1)] rounded py-1 px-1 animate-pulse">
                              <div className="h-2 bg-[rgba(140,198,63,0.3)] rounded" />
                            </div>
                          ))
                        ) : (
                          getFilteredOptions(countries, searchTerms.countries).map((country) => (
                            <FilterButton
                              key={country}
                              name={country}
                              isSelected={selectedCountries.includes(country)}
                              onClick={handleCountryClick}
                              type="country"
                            />
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Layout - Filters on left, stories on right */}
          <div className="hidden md:flex gap-6">
            {/* Desktop Filter Sidebar */}
            <div className="w-50 bg-[rgba(255,255,255,0.15)] p-4 rounded-xl border-2 border-[rgba(140,198,63,0.3)] h-fit sticky top-25">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[color:var(--lightgreen)] text-[clamp(16px,1.4vw,18px)] font-semibold">
                  {hasActiveFilters && (<>{stories.length} Stories with filters</>)}
                </h3>
                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="text-[clamp(12px,1vw,14px)] text-[color:var(--lightgreen)] opacity-70 hover:opacity-100 underline"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {hasActiveFilters && (
                <div className="mb-4 p-3 bg-[rgba(0,0,0,0.2)] rounded-lg">
                  <div className="flex flex-wrap gap-2 text-[clamp(11px,0.9vw,13px)]">
                    {selectedTags.map(tag => (
                      <span key={tag} className="bg-[#304e25] text-white px-2 py-1 rounded-md flex items-center gap-1">
                        {tag}
                        <button onClick={() => handleTagClick(tag)} className="ml-1 hover:bg-red-600 rounded">×</button>
                      </span>
                    ))}
                    {selectedContinents.map(continent => (
                      <span key={continent} className="bg-[#304e25] text-white px-2 py-1 rounded-md flex items-center gap-1">
                        {continent}
                        <button onClick={() => handleContinentClick(continent)} className="ml-1 hover:bg-red-600 rounded">×</button>
                      </span>
                    ))}
                    {selectedCountries.map(country => (
                      <span key={country} className="bg-[#304e25] text-white px-2 py-1 rounded-md flex items-center gap-1">
                        {country}
                        <button onClick={() => handleCountryClick(country)} className="ml-1 hover:bg-red-600 rounded">×</button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {/* Tags Filter */}
                <div className="border border-[rgba(140,198,63,0.3)] rounded-lg">
                  <button
                    onClick={() => toggleFilterExpansion('tags')}
                    className="w-full p-3 text-left flex items-center justify-between hover:bg-[rgba(255,255,255,0.1)]"
                  >
                    <span className="text-[clamp(13px,1.1vw,15px)] font-medium text-[color:var(--lightgreen)]">
                      Categories
                    </span>
                    <span className="text-lg">{expandedFilter === 'tags' ? '−' : '+'}</span>
                  </button>
                  {expandedFilter === 'tags' && (
                    <div className="p-3 border-t border-[rgba(140,198,63,0.3)]">
                      <input
                        type="text"
                        placeholder="Search categories..."
                        value={searchTerms.tags}
                        onChange={(e) => setSearchTerms(prev => ({ ...prev, tags: e.target.value }))}
                        className="w-full p-2 mb-3 bg-[rgba(255,255,255,0.1)] border border-[rgba(140,198,63,0.3)] rounded text-white placeholder-gray-400 text-sm"
                      />
                      <div className="grid grid-cols-1 gap-1 max-h-32 overflow-y-auto">
                        {filtersLoading ? (
                          [...Array(4)].map((_, index) => (
                            <div key={index} className="bg-[rgba(255,255,255,0.1)] rounded py-2 px-2 animate-pulse">
                              <div className="h-3 bg-[rgba(140,198,63,0.3)] rounded" />
                            </div>
                          ))
                        ) : (
                          getFilteredOptions(tags, searchTerms.tags).map((tag) => (
                            <FilterButton
                              key={tag.id}
                              name={tag.name}
                              isSelected={selectedTags.includes(tag.name)}
                              onClick={handleTagClick}
                              type="tag"
                            />
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Continents Filter */}
                <div className="border border-[rgba(140,198,63,0.3)] rounded-lg">
                  <button
                    onClick={() => toggleFilterExpansion('continents')}
                    className="w-full p-3 text-left flex items-center justify-between hover:bg-[rgba(255,255,255,0.1)]"
                  >
                    <span className="text-[clamp(13px,1.1vw,15px)] font-medium text-[color:var(--lightgreen)]">
                      Continents 
                    </span>
                    <span className="text-lg">{expandedFilter === 'continents' ? '−' : '+'}</span>
                  </button>
                  {expandedFilter === 'continents' && (
                    <div className="p-3 border-t border-[rgba(140,198,63,0.3)]">
                      <div className="grid grid-cols-1 gap-1 max-h-32 overflow-y-auto">
                        {filtersLoading ? (
                          [...Array(3)].map((_, index) => (
                            <div key={index} className="bg-[rgba(255,255,255,0.1)] rounded py-2 px-2 animate-pulse">
                              <div className="h-3 bg-[rgba(140,198,63,0.3)] rounded" />
                            </div>
                          ))
                        ) : (
                          continents.map((continent) => (
                            <FilterButton
                              key={continent}
                              name={continent}
                              isSelected={selectedContinents.includes(continent)}
                              onClick={handleContinentClick}
                              type="continent"
                            />
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Countries Filter */}
                <div className="border border-[rgba(140,198,63,0.3)] rounded-lg">
                  <button
                    onClick={() => toggleFilterExpansion('countries')}
                    className="w-full p-3 text-left flex items-center justify-between hover:bg-[rgba(255,255,255,0.1)]"
                  >
                    <span className="text-[clamp(13px,1.1vw,15px)] font-medium text-[color:var(--lightgreen)]">
                      Countries
                    </span>
                    <span className="text-lg">{expandedFilter === 'countries' ? '−' : '+'}</span>
                  </button>
                  {expandedFilter === 'countries' && (
                    <div className="p-3 border-t border-[rgba(140,198,63,0.3)]">
                      <input
                        type="text"
                        placeholder="Search countries..."
                        value={searchTerms.countries}
                        onChange={(e) => setSearchTerms(prev => ({ ...prev, countries: e.target.value }))}
                        className="w-full p-2 mb-3 bg-[rgba(255,255,255,0.1)] border border-[rgba(140,198,63,0.3)] rounded text-white placeholder-gray-400 text-sm"
                      />
                      <div className="grid grid-cols-1 gap-1 max-h-40 overflow-y-auto">
                        {filtersLoading ? (
                          [...Array(4)].map((_, index) => (
                            <div key={index} className="bg-[rgba(255,255,255,0.1)] rounded py-2 px-2 animate-pulse">
                              <div className="h-3 bg-[rgba(140,198,63,0.3)] rounded" />
                            </div>
                          ))
                        ) : (
                          getFilteredOptions(countries, searchTerms.countries).map((country) => (
                            <FilterButton
                              key={country}
                              name={country}
                              isSelected={selectedCountries.includes(country)}
                              onClick={handleCountryClick}
                              type="country"
                            />
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Desktop Story Cards Grid */}
            <div className="flex-1">
              <StoriesMap stories={allStories} />
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {loading ? (
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
                ) : stories.length > 0 ? (
                  stories.map((story) => (
                    <StoryCard
                      key={story.id}
                      id={story.id}
                      title={story.title}
                      description={story.description}
                      tags={getTagsString(story)}
                      country={story.country}
                      region={story.region}
                      continent={story.continent}
                      youtubeUrl={story.youtube_url}
                      storyDate={story.story_date}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-10">
                    <p className="text-[color:var(--lightgreen)] text-lg">
                      No stories found. Please try adjusting your filters.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Story Cards Grid */}
          <div className="md:hidden grid grid-cols-1 gap-3">
            {loading ? (
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
            ) : stories.length > 0 ? (
              stories.map((story) => (
                <StoryCard
                  key={story.id}
                  id={story.id}
                  title={story.title}
                  description={story.description}
                  tags={getTagsString(story)}
                  country={story.country}
                  region={story.region}
                  continent={story.continent}
                  youtubeUrl={story.youtube_url}
                  storyDate={story.story_date}
                />
              ))
            ) : (
              <div className="text-center py-10">
                <p className="text-[color:var(--lightgreen)] text-lg">
                  No stories found. Please try adjusting your filters.
                </p>
              </div>
            )}
          </div>
          
          <div className="mt-4 md:mt-9">
            <a 
              target="_blank" 
              href="https://www.instagram.com/climatestorieslibrary" 
              className="inline-block bg-[color:var(--lightgreen)] text-[color:var(--darkgreen)] py-3 md:py-4 px-6 md:px-9 rounded-lg no-underline font-semibold text-[clamp(12px,3vw,18px)] transition-all duration-300 hover:bg-[color:var(--darkgreen)] hover:text-[color:var(--lightgreen)] hover:-translate-y-0.5 hover:shadow-[0_5px_15px_rgba(140,198,63,0.3)]"
            >
              View Instagram Page
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

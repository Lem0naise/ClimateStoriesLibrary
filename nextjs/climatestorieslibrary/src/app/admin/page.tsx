"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Compressor from 'compressorjs';

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
  fetchSubmissions,
  approveSubmission,
  deleteSubmission,
  Story, 
  Tag,
  Submission,
  fetchOrganisations,
  Organisation,
  supabase,
  BlogPost,
  BlogImages,
  fetchBlogPosts,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  fetchBlogPostById,
  fetchBlogImages,
  uploadBlogImage,
  deleteBlogImage
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
  latitude: string;
  longitude: string;
};

type OrganisationFormData = {
  name: string;
  description: string;
  email: string;
  tel: string;
  url: string;
  location: string;
  logoFile: File | null;
  logoUrl: string;
};

type GlobalAdvisor = {
  id: string;
  created_at: string;
  name: string | null;
  title: string | null;
  description: string | null;
  img_url?: string | null;
  logo_url?: string | null; // for compatibility
};

type GlobalAdvisorFormData = {
  name: string;
  title: string;
  description: string;
  logoFile: File | null;
  logoUrl: string;
};

type BlogPostFormData = {
  title: string;
  content: string;
  imageFiles: File[];
  existingImages: BlogImages[];
};

export default function Admin() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stories, setStories] = useState<Story[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [organisations, setOrganisations] = useState<Organisation[]>([]);
  const [globalAdvisors, setGlobalAdvisors] = useState<GlobalAdvisor[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
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
    selectedTags: [],
    latitude: '',
    longitude: '',
  });
  const [formLoading, setFormLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleteTagConfirm, setDeleteTagConfirm] = useState<string | null>(null);
  const [deleteSubmissionConfirm, setDeleteSubmissionConfirm] = useState<string | null>(null);
  const [deleteSubmissionStep, setDeleteSubmissionStep] = useState<number>(0);
  const [deleteSubmissionText, setDeleteSubmissionText] = useState<string>('');
  const [inlineEditingTag, setInlineEditingTag] = useState<string | null>(null);
  const [inlineTagName, setInlineTagName] = useState('');

  const storyFormRef = useRef<HTMLDivElement>(null);

  /* Organisations */
  const [orgFormData, setOrgFormData] = useState<OrganisationFormData>({
    name: '',
    description: '',
    email: '',
    tel: '',
    url: '',
    location: '',
    logoFile: null,
    logoUrl: '',
  });
  const [orgFormLoading, setOrgFormLoading] = useState(false);
  const [orgFormError, setOrgFormError] = useState<string | null>(null);
  const [orgFormSuccess, setOrgFormSuccess] = useState<string | null>(null);
  const [editingOrgId, setEditingOrgId] = useState<string | null>(null);
  const [deleteOrgConfirm, setDeleteOrgConfirm] = useState<string | null>(null);


  /* Global Advisors */
  const [globAdvFormData, setGlobAdvFormData] = useState<GlobalAdvisorFormData>({
    name: '',
    title: '',
    description: '',
    logoFile: null,
    logoUrl: '',
  });
  const [globAdvFormLoading, setGlobAdvFormLoading] = useState(false);
  const [globAdvFormError, setGlobAdvFormError] = useState<string | null>(null);
  const [globAdvFormSuccess, setGlobAdvFormSuccess] = useState<string | null>(null);
  const [editingGlobAdvId, setEditingGlobAdvId] = useState<string | null>(null);
  const [deleteGlobAdvConfirm, setDeleteGlobAdvConfirm] = useState<string | null>(null);

  /* Blog Posts */
  const [blogPostFormData, setBlogPostFormData] = useState<BlogPostFormData>({
    title: '',
    content: '',
    imageFiles: [],
    existingImages: [],
  });
  const [blogPostFormLoading, setBlogPostFormLoading] = useState(false);
  const [blogPostFormError, setBlogPostFormError] = useState<string | null>(null);
  const [blogPostFormSuccess, setBlogPostFormSuccess] = useState<string | null>(null);
  const [editingBlogPostId, setEditingBlogPostId] = useState<string | null>(null);
  const [deleteBlogPostConfirm, setDeleteBlogPostConfirm] = useState<string | null>(null);
  const [showBlogPostForm, setShowBlogPostForm] = useState(false);

  const [activeTab, setActiveTab] = useState<'story' | 'tag' | 'submission' | 'organisation' | 'global-advisor' | 'blog-post'>('story');
  const router = useRouter();

  const deletingSubmission = submissions.find(s => s.id === deleteSubmissionConfirm);

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
      loadOrganisations();
      loadGlobalAdvisors();
      loadBlogPosts();
    };

    checkAuth();
  }, [router]);

  const geocodeLocation = async (address: string) => {
    const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_GEOCODING_KEY; // Store securely
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();
    return data;
  }

  const loadAdminData = async () => {
    setStoriesLoading(true);
    try {
      const [fetchedStories, fetchedTags, fetchedSubmissions] = await Promise.all([
        fetchStories(),
        fetchTags(),
        fetchSubmissions()
      ]);
      
      setStories(fetchedStories);
      setTags(fetchedTags);
      setSubmissions(fetchedSubmissions);
    } catch (error) {
      console.error('Error loading admin data:', error);
      setError('Failed to load admin data');
    } finally {
      setStoriesLoading(false);
    }
  };

  const loadOrganisations = async () => {
    try {
      const data = await fetchOrganisations();
      setOrganisations(data);
    } catch (e) {
      setOrganisations([]);
    }
  };

  const loadGlobalAdvisors = async () => {
    try {
      const { data, error } = await supabase
        .from('global-advisors')
        .select('*')
        .order('name', { ascending: true });
      if (error) throw error;
      setGlobalAdvisors(data || []);
    } catch (e) {
      setGlobalAdvisors([]);
    }
  };

  const loadBlogPosts = async () => {
    try {
      const data = await fetchBlogPosts();
      setBlogPosts(data);
    } catch (e) {
      setBlogPosts([]);
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
      selectedTags: [],
      latitude: '',
      longitude: ''
    });
    setEditingStory(null);
    setShowStoryForm(false);
  };

  const handleCreateStory = () => {
    resetForm();
    setShowStoryForm(true);
  };

  const handleLocationGeocoding = async () => {
    if (!storyFormData.country && !storyFormData.region && !storyFormData.continent)     return {lat: '', lng:''};
    const address = [storyFormData.region, storyFormData.country, storyFormData.continent];
    const geo = await geocodeLocation(address.filter(Boolean).join(','));
    if (geo.status === 'OK' && geo.results.length > 0){
      const location = geo.results[0].geometry.location;
      return {lat:location.lat.toString(), lng:location.lng.toString()};
    }
    return {lat: '', lng:''}
  };

  const handleEditStory = async (storyId: string) => {
    const story = await fetchStoryById(storyId);
    if (story) {
      setStoryFormData({
        title: story.title,
        youtube_url: story.youtube_url,
        story_date: story.story_date,
        continent: story.continent || '',
        country: story.country || '',
        region: story.region || '',
        classification: story.classification || '',
        description: story.description || '',
        selectedTags: story.tags?.map(tag => tag.id) || [],
        latitude: story.latitude || '',
        longitude: story.longitude || '',
      });
      setEditingStory(story);
      setShowStoryForm(true);

      setTimeout(() => {
        storyFormRef.current?.scrollIntoView({behavior:'smooth', block:'start'});

      }, 50);
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
      // geocode to get latitude and longitude first
      const {lat, lng} = await handleLocationGeocoding();
      const latitude = lat;
      const longitude = lng;
      setStoryFormData(prev => ({
        ...prev,
        latitude: latitude,
        longitude: longitude,
      }));

      const storyData = {
        title: storyFormData.title,
        youtube_url: storyFormData.youtube_url,
        story_date: storyFormData.story_date,
        continent: storyFormData.continent,
        country: storyFormData.country,
        region: storyFormData.region,
        classification: storyFormData.classification,
        description: storyFormData.description,
        latitude: latitude,
        longitude: longitude
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

  const handleApproveSubmission = async (submissionId: string) => {
    setFormLoading(true);
    setError(null);

    try {
      const { error } = await approveSubmission(submissionId);
      if (error) {
        setError(error);
      } else {
        await loadAdminData();
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteSubmission = async (submissionId: string) => {
    // Step 0: Initial click - show first warning
    if (deleteSubmissionConfirm !== submissionId) {
      setDeleteSubmissionConfirm(submissionId);
      setDeleteSubmissionStep(1);
      setDeleteSubmissionText('');
      return;
    }

    // Step 1: First confirmation - show serious warning
    if (deleteSubmissionStep === 1) {
      setDeleteSubmissionStep(2);
      return;
    }

    // Step 2: Second confirmation - require typing confirmation
    if (deleteSubmissionStep === 2) {
      setDeleteSubmissionStep(3);
      return;
    }

    // Step 3: Final confirmation - check typed text and delete
    if (deleteSubmissionStep === 3) {
      if (deleteSubmissionText.toLowerCase().trim() !== 'delete consent records') {
        setError('You must type "DELETE CONSENT RECORDS" exactly to confirm deletion');
        return;
      }

      setFormLoading(true);
      setError(null);

      try {
        const { error } = await deleteSubmission(submissionId);
        if (error) {
          setError(error);
        } else {
          await loadAdminData();
        }
      } catch (err) {
        setError('An unexpected error occurred');
      } finally {
        setDeleteSubmissionConfirm(null);
        setDeleteSubmissionStep(0);
        setDeleteSubmissionText('');
        setFormLoading(false);
      }
    }
  };

  const handleCancelSubmissionDeletion = () => {
    setDeleteSubmissionConfirm(null);
    setDeleteSubmissionStep(0);
    setDeleteSubmissionText('');
  };

  // Organisation form handlers
  const handleOrgInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setOrgFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleOrgLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    
const file = e.target.files?.[0] || null;
  if (!file) return;

  // compress if file size is over 200kb
  if (file.size > 200 * 1024) {
new Compressor(file, {
    quality: 0.7, // Adjust quality as needed (0.6-0.8 is typical)
    maxWidth: 800,
    maxHeight: 800,
    success(result: File) {
      setOrgFormData(prev => ({ ...prev, logoFile: result }));
    },
    error(err: Error) {
      setOrgFormError('Logo compression failed: ' + err.message);
    },
  });
  }
  else {
    setOrgFormData(prev => ({ ...prev, logoFile: file }));
  }
  
  };

  const handleOrgLogoDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0] || null;
    setOrgFormData(prev => ({ ...prev, logoFile: file }));
  };

  const handleOrgLogoDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  // Populate form for editing
  const handleEditOrganisation = (org: Organisation) => {
    setOrgFormData({
      name: org.name || '',
      description: org.description || '',
      email: org.email || '',
      tel: org.tel || '',
      location: org.location || '',
      url: org.url || '',
      logoFile: null,
      logoUrl: org.logo_url || '',
    });
    setEditingOrgId(org.id);
    setOrgFormError(null);
    setOrgFormSuccess(null);
  };

  // Delete organisation
  const handleDeleteOrganisation = async (orgId: string) => {
    if (deleteOrgConfirm === orgId) {
      setOrgFormLoading(true);
      setOrgFormError(null);
      try {
        const { error } = await supabase.from('organisations').delete().eq('id', orgId);
        if (error) {
          setOrgFormError('Failed to delete organisation: ' + error.message);
        } else {
          setOrgFormSuccess('Organisation deleted.');
          await loadOrganisations();
        }
      } catch (err: any) {
        setOrgFormError('Unexpected error: ' + (err?.message || err));
      } finally {
        setOrgFormLoading(false);
        setDeleteOrgConfirm(null);
      }
    } else {
      setDeleteOrgConfirm(orgId);
    }
  };

  // Reset org form
  const resetOrgForm = () => {
    setOrgFormData({
      name: '',
      description: '',
      email: '',
      tel: '',
      url: '',
      location: '',
      logoFile: null,
      logoUrl: '',
    });
    setEditingOrgId(null);
    setOrgFormError(null);
    setOrgFormSuccess(null);
  };

  // Create or update organisation
  const handleCreateOrganisation = async (e: React.FormEvent) => {
    e.preventDefault();
    setOrgFormLoading(true);
    setOrgFormError(null);
    setOrgFormSuccess(null);

    try {
      let logoUrl = orgFormData.logoUrl;
      if (orgFormData.logoFile) {
        // Upload logo to Supabase storage
        const fileExt = orgFormData.logoFile.name.split('.').pop();
        const fileName = `${Date.now()}_${orgFormData.logoFile.name.replace(/\s+/g, '_')}`;
        const filePath = `${fileName}`;
        const { error: uploadError } = await supabase.storage
          .from('logos')
          .upload(filePath, orgFormData.logoFile, {
            cacheControl: '3600',
            upsert: false,
          });
        if (uploadError) {
          setOrgFormError('Failed to upload logo: ' + uploadError.message);
          setOrgFormLoading(false);
          return;
        }
        // Get public URL
        const { data } = supabase.storage.from('logos').getPublicUrl(filePath);
        logoUrl = data.publicUrl;
      }

      if (editingOrgId) {
        // Update
        const { error } = await supabase
          .from('organisations')
          .update({
            name: orgFormData.name,
            description: orgFormData.description,
            email: orgFormData.email,
            url: orgFormData.url,
            tel: orgFormData.tel,
            location: orgFormData.location,
            logo_url: logoUrl || null,
          })
          .eq('id', editingOrgId);
        if (error) {
          setOrgFormError('Failed to update organisation: ' + error.message);
          setOrgFormLoading(false);
          return;
        }
        setOrgFormSuccess('Organisation updated!');
      } else {
        // Insert
        const { error } = await supabase
          .from('organisations')
          .insert([{
            name: orgFormData.name,
            description: orgFormData.description,
            email: orgFormData.email,
            tel: orgFormData.tel,
            location: orgFormData.location,
            logo_url: logoUrl || null,
          }]);
        if (error) {
          setOrgFormError('Failed to create organisation: ' + error.message);
          setOrgFormLoading(false);
          return;
        }
        setOrgFormSuccess('Organisation created!');
      }

      resetOrgForm();
      await loadOrganisations();
    } catch (err: any) {
      setOrgFormError('Unexpected error: ' + (err?.message || err));
    } finally {
      setOrgFormLoading(false);
    }
  };

  const handleGlobAdvInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setGlobAdvFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGlobAdvPictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;

    // compress if file size is over 200kb
    if (file.size > 200 * 1024) {
      new Compressor(file, {
        quality: 0.7, // Adjust quality as needed (0.6-0.8 is typical)
        maxWidth: 800,
        maxHeight: 800,
        success(result: File) {
          setGlobAdvFormData(prev => ({ ...prev, logoFile: result }));
        },
        error(err: Error) {
          setGlobAdvFormError('Image compression failed: ' + err.message);
        },
      });
    } else {
      setGlobAdvFormData(prev => ({ ...prev, logoFile: file }));
    }
  };

  const handleGlobAdvPictureDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0] || null;
    setGlobAdvFormData(prev => ({ ...prev, logoFile: file }));
  };

  const handleGlobAdvPictureDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const resetGlobAdvForm = () => {
    setGlobAdvFormData({
      name: '',
      title: '',
      description: '',
      logoFile: null,
      logoUrl: '',
    });
    setEditingGlobAdvId(null);
    setGlobAdvFormError(null);
    setGlobAdvFormSuccess(null);
  };

  const handleEditGlobalAdvisor = (adv: GlobalAdvisor) => {
    setGlobAdvFormData({
      name: adv.name || '',
      title: adv.title || '',
      description: adv.description || '',
      logoFile: null,
      logoUrl: adv.img_url || adv.logo_url || '',
    });
    setEditingGlobAdvId(adv.id);
    setGlobAdvFormError(null);
    setGlobAdvFormSuccess(null);
  };

  const handleDeleteGlobalAdvisor = async (advId: string) => {
    if (deleteGlobAdvConfirm === advId) {
      setGlobAdvFormLoading(true);
      setGlobAdvFormError(null);
      try {
        const { error } = await supabase.from('global-advisors').delete().eq('id', advId);
        if (error) {
          setGlobAdvFormError('Failed to delete advisor: ' + error.message);
        } else {
          setGlobAdvFormSuccess('Advisor deleted.');
          await loadGlobalAdvisors();
        }
      } catch (err: any) {
        setGlobAdvFormError('Unexpected error: ' + (err?.message || err));
      } finally {
        setGlobAdvFormLoading(false);
        setDeleteGlobAdvConfirm(null);
      }
    } else {
      setDeleteGlobAdvConfirm(advId);
    }
  };

  const handleCreateGlobalAdvisor = async (e: React.FormEvent) => {
    e.preventDefault();
    setGlobAdvFormLoading(true);
    setGlobAdvFormError(null);
    setGlobAdvFormSuccess(null);

    try {
      let imgUrl = globAdvFormData.logoUrl;
      if (globAdvFormData.logoFile) {
        // Upload logo to Supabase storage
        const fileName = `${Date.now()}_${globAdvFormData.logoFile.name.replace(/\s+/g, '_')}`;
        const filePath = `${fileName}`;
        const { error: uploadError } = await supabase.storage
          .from('logos')
          .upload(filePath, globAdvFormData.logoFile, {
            cacheControl: '3600',
            upsert: false,
          });
        if (uploadError) {
          setGlobAdvFormError('Failed to upload image: ' + uploadError.message);
          setGlobAdvFormLoading(false);
          return;
        }
        // Get public URL
        const { data } = supabase.storage.from('logos').getPublicUrl(filePath);
        imgUrl = data.publicUrl;
      }

      if (editingGlobAdvId) {
        // Update
        const { error } = await supabase
          .from('global-advisors')
          .update({
            name: globAdvFormData.name,
            title: globAdvFormData.title,
            description: globAdvFormData.description,
            img_url: imgUrl || null,
          })
          .eq('id', editingGlobAdvId);
        if (error) {
          setGlobAdvFormError('Failed to update advisor: ' + error.message);
          setGlobAdvFormLoading(false);
          return;
        }
        setGlobAdvFormSuccess('Advisor updated!');
      } else {
        // Insert
        const { error } = await supabase
          .from('global-advisors')
          .insert([{
            name: globAdvFormData.name,
            title: globAdvFormData.title,
            description: globAdvFormData.description,
            img_url: imgUrl || null,
          }]);
        if (error) {
          setGlobAdvFormError('Failed to create advisor: ' + error.message);
          setGlobAdvFormLoading(false);
          return;
        }
        setGlobAdvFormSuccess('Advisor created!');
      }

      resetGlobAdvForm();
      await loadGlobalAdvisors();
    } catch (err: any) {
      setGlobAdvFormError('Unexpected error: ' + (err?.message || err));
    } finally {
      setGlobAdvFormLoading(false);
    }
  };

  // Blog Post form handlers
  const handleBlogPostInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBlogPostFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBlogPostImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const compressedFiles: File[] = [];

    for (const file of files) {
      if (file.size > 200 * 1024) {
        try {
          const compressedFile = await new Promise<File>((resolve, reject) => {
            new Compressor(file, {
              quality: 0.7,
              maxWidth: 1200,
              maxHeight: 1200,
              success(result: File) {
                resolve(result)},
              error(err: Error) {
                reject(err);
              },
            });
            });
            compressedFiles.push(compressedFile);
        } catch (err) {
          setBlogPostFormError('Image compression failed: ' + (err as Error).message);
          return;
        }
      } else {
        compressedFiles.push(file);
      }
    }

    setBlogPostFormData(prev => ({ 
      ...prev, 
      imageFiles: [...prev.imageFiles, ...compressedFiles] 
    }));
  };

  const handleBlogPostImageDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files || []);
    setBlogPostFormData(prev => ({ 
      ...prev, 
      imageFiles: [...prev.imageFiles, ...files] 
    }));
  };

  const handleBlogPostImageDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const removeImageFile = (index: number) => {
    setBlogPostFormData(prev => ({
      ...prev,
      imageFiles: prev.imageFiles.filter((_, i) => i !== index)
    }));
  };

  const removeExistingImage = async (imageId: string) => {
    if (editingBlogPostId) {
      setBlogPostFormLoading(true);
      try {
        const { error } = await deleteBlogImage(imageId);
        if (error) {
          setBlogPostFormError('Failed to delete image: ' + error);
        } else {
          setBlogPostFormData(prev => ({
            ...prev,
            existingImages: prev.existingImages.filter(img => img.id !== imageId)
          }));
        }
      } catch (err: any) {
        setBlogPostFormError('Error deleting image: ' + (err?.message || err));
      } finally {
        setBlogPostFormLoading(false);
      }
    }
  };

  const resetBlogPostForm = () => {
    setBlogPostFormData({
      title: '',
      content: '',
      imageFiles: [],
      existingImages: [],
    });
    setEditingBlogPostId(null);
    setBlogPostFormError(null);
    setBlogPostFormSuccess(null);
    setShowBlogPostForm(false);
  };

  const handleEditBlogPost = async (post: BlogPost) => {
    const images = await fetchBlogImages(post.id);
    setBlogPostFormData({
      title: post.title || '',
      content: post.content || '',
      imageFiles: [],
      existingImages: images,
    });
    setEditingBlogPostId(post.id);
    setBlogPostFormError(null);
    setBlogPostFormSuccess(null);
    setShowBlogPostForm(true);
  };

  const handleDeleteBlogPost = async (postId: string) => {
    if (deleteBlogPostConfirm === postId) {
      setBlogPostFormLoading(true);
      setBlogPostFormError(null);
      try {
        const { error } = await deleteBlogPost(postId);
        if (error) {
          setBlogPostFormError('Failed to delete blog post: ' + error);
        } else {
          setBlogPostFormSuccess('Blog post deleted.');
          await loadBlogPosts();
        }
      } catch (err: any) {
        setBlogPostFormError('Unexpected error: ' + (err?.message || err));
      } finally {
        setBlogPostFormLoading(false);
        setDeleteBlogPostConfirm(null);
      }
    } else {
      setDeleteBlogPostConfirm(postId);
    }
  };

  const handleCreateBlogPost = async (e: React.FormEvent) => {
    e.preventDefault();
    setBlogPostFormLoading(true);
    setBlogPostFormError(null);
    setBlogPostFormSuccess(null);

    try {
      let postId = editingBlogPostId;

      if (editingBlogPostId) {
        // Update existing post
        const { error } = await updateBlogPost(editingBlogPostId, {
          title: blogPostFormData.title,
          content: blogPostFormData.content,
        });
        if (error) {
          setBlogPostFormError('Failed to update blog post: ' + error);
          setBlogPostFormLoading(false);
          return;
        }
      } else {
        // Create new post
        const { blogPost, error } = await createBlogPost({
          title: blogPostFormData.title,
          content: blogPostFormData.content,
        });
        if (error || !blogPost) {
          setBlogPostFormError('Failed to create blog post: ' + error);
          setBlogPostFormLoading(false);
          return;
        }
        postId = blogPost.id;
      }

      // Upload new images
      if (blogPostFormData.imageFiles.length > 0 && postId) {
        for (const file of blogPostFormData.imageFiles) {
          const { error: uploadError } = await uploadBlogImage(postId, file);
          if (uploadError) {
            setBlogPostFormError('Failed to upload image: ' + uploadError);
            setBlogPostFormLoading(false);
            return;
          }
        }
      }

      setBlogPostFormSuccess(editingBlogPostId ? 'Blog post updated!' : 'Blog post created!');
      resetBlogPostForm();
      await loadBlogPosts();
    } catch (err: any) {
      setBlogPostFormError('Unexpected error: ' + (err?.message || err));
    } finally {
      setBlogPostFormLoading(false);
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
        {/* --- Sticky Jump Links --- */}
        <div className="sticky top-15 z-30 bg-[color:var(--background)] pt-4 pb-2 mb-4">
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => setActiveTab('story')}
              className={`hover:bg-[color:var(--lightgreen)] hover:text-[color:var(--darkgreen)] py-2 px-4 rounded-lg transition-all duration-300 ${
                activeTab === 'story'
                  ? 'bg-[color:var(--lightgreen)] text-[color:var(--darkgreen)] text-xl font-bold'
                  : 'bg-[color:var(--darkgreen)] text-[color:var(--lightgreen)] text-sm font-semibold'
              } cursor-pointer`}
              id="story-management-tab"
            >
              Stories
            </button>
            <button
              onClick={() => setActiveTab('tag')}
              className={`hover:bg-[color:var(--lightgreen)] hover:text-[color:var(--darkgreen)] py-2 px-4 rounded-lg transition-all duration-300 ${
                activeTab === 'tag'
                  ? 'bg-[color:var(--lightgreen)] text-[color:var(--darkgreen)] text-xl font-bold'
                  : 'bg-[color:var(--darkgreen)] text-[color:var(--lightgreen)] text-sm font-semibold'
              } cursor-pointer`}
              id="tag-management-tab"
            >
              Tags
            </button>
            <button
              onClick={() => setActiveTab('submission')}
              className={`hover:bg-[color:var(--lightgreen)] hover:text-[color:var,--darkgreen)] py-2 px-4 rounded-lg transition-all duration-300 ${
                activeTab === 'submission'
                  ? 'bg-[color:var(--lightgreen)] text-[color:var(--darkgreen)] text-xl font-bold'
                  : 'bg-[color:var(--darkgreen)] text-[color:var(--lightgreen)] text-sm font-semibold'
              } cursor-pointer`}
              id="submissions-tab"
            >
              Submissions
            </button>
            <button
              onClick={() => setActiveTab('organisation')}
              className={`hover:bg-[color:var(--lightgreen)] hover:text-[color:var(--darkgreen)] py-2 px-4 rounded-lg  transition-all duration-300 ${
                activeTab === 'organisation'
                  ? 'bg-[color:var(--lightgreen)] text-[color:var(--darkgreen)] text-xl font-bold'
                  : 'bg-[color:var(--darkgreen)] text-[color:var(--lightgreen)] text-sm font-semibold'
              } cursor-pointer`}
              id="organisation-management-tab"
            >
              Organisations
            </button>
            <button
              onClick={() => setActiveTab('global-advisor')}
              className={`hover:bg-[color:var(--lightgreen)] hover:text-[color:var(--darkgreen)] py-2 px-4 rounded-lg  transition-all duration-300 ${
                activeTab === 'global-advisor'
                  ? 'bg-[color:var(--lightgreen)] text-[color:var(--darkgreen)] text-xl font-bold'
                  : 'bg-[color:var(--darkgreen)] text-[color:var(--lightgreen)] text-sm font-semibold'
              } cursor-pointer`}
              id="global-advisor-tab"
            >
              Global Advisors
            </button>
            <button
              onClick={() => setActiveTab('blog-post')}
              className={`hover:bg-[color:var(--lightgreen)] hover:text-[color:var(--darkgreen)] py-2 px-4 rounded-lg  transition-all duration-300 ${
                activeTab === 'blog-post'
                  ? 'bg-[color:var(--lightgreen)] text-[color:var(--darkgreen)] text-xl font-bold'
                  : 'bg-[color:var(--darkgreen)] text-[color:var(--lightgreen)] text-sm font-semibold'
              } cursor-pointer`}
              id="blog-post-tab"
            >
              Blog Posts
            </button>
          </div>
        </div>
        {/* --- End Sticky Jump Links --- */}

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
              {storiesLoading ? '...' : stories.length} Stories, {storiesLoading ? '...' : tags.length} Tags, {storiesLoading ? '...' : [...new Set(stories.map(s => s.country).filter(Boolean))].length} Countries, {storiesLoading ? '...' : submissions.length} Submissions, {storiesLoading ? '...' : organisations.length} Organisations, {storiesLoading ? '...' : globalAdvisors.length} Global Advisors, {storiesLoading ? '...' : blogPosts.length} Blog Posts
            </h3>
        </div>

        {/* New Submissions Alert */}
        {submissions.filter(s => !s.approved).length > 0 && (
          <div className="mb-4 md:mb-8 p-4 md:p-6 bg-gradient-to-r from-orange-500 to-red-500 border border-orange-300 rounded-lg shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white text-lg md:text-xl font-bold mb-2 flex items-center">
                  🚨 New Submissions Available!
                </h3>
                <p className="text-white text-sm md:text-base opacity-90">
                  {submissions.filter(s => !s.approved).length} submission{submissions.filter(s => !s.approved).length === 1 ? '' : 's'} awaiting approval
                </p>
              </div>
              <button
                onClick={() => setActiveTab('submission')}
                className="bg-white text-orange-600 py-2 px-4 rounded-lg font-semibold text-sm transition-all duration-300 hover:bg-gray-100 flex items-center gap-2"
              >
                Review Now →
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-4 md:mb-8 p-4 bg-red-100 border border-red-300 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Deletion Warning Modal */}
        {deleteSubmissionConfirm && deleteSubmissionStep > 0 && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              {deleteSubmissionStep === 1 && (
                <>
                  <div className="flex items-center mb-4">
                    <span className="text-red-500 text-2xl mr-2">⚠️</span>
                    <h3 className="text-lg font-bold text-red-700">Warning: Data Deletion</h3>
                  </div>
                  <p className="text-gray-700 mb-4">
                    You are about to <strong>permanently delete</strong> a submission record. This action cannot be undone.
                  </p>
                  <p className="text-gray-700 mb-6">
                    Are you sure you want to continue?
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleDeleteSubmission(deleteSubmissionConfirm)}
                      className="bg-red-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-600"
                    >
                      Yes, Continue
                    </button>
                    <button
                      onClick={handleCancelSubmissionDeletion}
                      className="bg-gray-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              )}

              {deleteSubmissionStep === 2 && (
                <>
                  <div className="flex items-center mb-4">
                    <span className="text-red-600 text-3xl mr-2">🚨</span>
                    <h3 className="text-lg font-bold text-red-800">CRITICAL WARNING</h3>
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded p-4 mb-4">
                    <p className="text-red-800 font-semibold mb-2">
                      You are about to DELETE CONSENT RECORDS
                    </p>
                    <p className="text-red-700 text-sm mb-2">
                      This submission contains personal data and consent information that the user provided voluntarily.
                    </p>
                    <p className="text-red-700 text-sm">
                      Deleting this record will permanently remove the consent documentation and personal information for:
                    </p>
                    <p className="text-black text-md font-bold mt-2">
                      {deletingSubmission && (<>
                        {deletingSubmission.email} {`  `}
                        {deletingSubmission.name} {`  `}
                        {deletingSubmission.location} </>)}
                    </p>
                  </div>
                  <p className="text-gray-700 mb-4 font-semibold">
                    Are you absolutely certain you need to delete this consent record?
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleDeleteSubmission(deleteSubmissionConfirm)}
                      className="bg-red-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-700"
                    >
                      Yes, I Understand
                    </button>
                    <button
                      onClick={handleCancelSubmissionDeletion}
                      className="bg-gray-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-gray-600"
                    >
                      Cancel Deletion
                    </button>
                  </div>
                </>
              )}

              {deleteSubmissionStep === 3 && (
                <>
                  <div className="flex items-center mb-4">
                    <h3 className="text-lg font-bold text-red-900">FINAL CONFIRMATION</h3>
                  </div>
                  <div className="bg-red-100 border-2 border-red-300 rounded p-4 mb-4">
                    <p className="text-red-900 font-bold mb-3">
                      PERMANENT DELETION OF CONSENT RECORDS
                    </p>
                    <ul className="text-red-800 text-sm space-y-1 mb-3">
                      <li>• Personal information will be permanently deleted</li>
                      <li>• Consent documentation will be permanently deleted</li>
                      <li>• This action CANNOT be reversed</li>
                      <li>• You may be violating data protection obligations</li>
                    </ul>
                    <p className="text-red-900 font-semibold">
                      Type "DELETE CONSENT RECORDS" to confirm:
                    </p>
                  </div>
                  <input
                    type="text"
                    value={deleteSubmissionText}
                    onChange={(e) => setDeleteSubmissionText(e.target.value)}
                    className="w-full p-3 border-2 border-red-300 rounded-lg mb-4 focus:border-red-500 focus:outline-none"
                    placeholder="Type the confirmation text here..."
                    autoFocus
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleDeleteSubmission(deleteSubmissionConfirm)}
                      disabled={deleteSubmissionText.toLowerCase().trim() !== 'delete consent records' || formLoading}
                      className="bg-red-700 text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-800 disabled:opacity-50"
                    >
                      {formLoading ? 'Deleting...' : 'PERMANENTLY DELETE'}
                    </button>
                    <button
                      onClick={handleCancelSubmissionDeletion}
                      disabled={formLoading}
                      className="bg-gray-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}



        {/* Story Form Section */}
        {showStoryForm && (
          <div ref={storyFormRef} className="bg-[color:var(--boxcolor)] rounded-[8px] md:rounded-[15px] backdrop-blur-sm border-[3px] md:border-[5px] border-[rgba(140,198,63,0.2)] p-4 md:p-8 mb-4 md:mb-8">
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
                    Region Or Address (For Marker Purposes Only - Will Not Display)
                  </label>
                  <input
                    type="text"
                    value={storyFormData.region ?? ''}
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
        {activeTab === 'story' && (
          <div id="story-management-section" className="bg-[color:var(--boxcolor)] rounded-[8px] md:rounded-[15px] backdrop-blur-sm border-[3px] md:border-[5px] border-[rgba(140,198,63,0.2)] p-4 md:p-8 mb-4 md:mb-8">
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

          
        </div>)}

        {/* Tag Management Section */}
        {activeTab === 'tag' && (
          <div id="tag-management-section" className="bg-[color:var(--boxcolor)] rounded-[8px] md:rounded-[15px] backdrop-blur-sm border-[3px] md:border-[5px] border-[rgba(140,198,63,0.2)] p-4 md:p-8 mb-4 md:mb-8">
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
                <div className="border border-[rgba(140,198,63,0.2)] rounded-lg p-3 bg-[rgba(255,255,255,0.05)]">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={inlineTagName}
                      onChange={(e) => setInlineTagName(e.target.value)}
                      className="flex-1 p-2 bg-[rgba(255,255,255,0.1)] border border-[rgba(140,198,63,0.3)] rounded text-[color:var(--lightgreen)] placeholder-gray-400 focus:border-[color:var(--lightgreen)] focus:outline-none text-sm"
                      placeholder="Enter tag name"
                      autoFocus
                    />
                    <button
                      onClick={() => handleSaveInlineEdit('new')}
                      disabled={formLoading || !inlineTagName.trim()}
                      className="bg-green-500 text-white py-1 px-2 rounded text-xs font-semibold hover:bg-green-600 transition-colors duration-300 disabled:opacity-50"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelInlineEdit}
                      disabled={formLoading}
                      className="bg-gray-500 text-white py-1 px-2 rounded text-xs font-semibold hover:bg-gray-600 transition-colors duration-300 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
              
              {tags.map((tag) => (
                <div 
                  key={tag.id} 
                  className="border border-[rgba(140,198,63,0.2)] rounded-lg p-3 hover:bg-[rgba(255,255,255,0.05)] transition-colors duration-300"
                >
                  <div className="flex items-center gap-2">
                    {inlineEditingTag === tag.id ? (
                      <input
                        type="text"
                        value={inlineTagName}
                        onChange={(e) => setInlineTagName(e.target.value)}
                        className="flex-1 p-2 bg-[rgba(255,255,255,0.1)] border border-[rgba(140,198,63,0.3)] rounded text-[color:var(--lightgreen)] placeholder-gray-400 focus:border-[color:var(--lightgreen)] focus:outline-none text-sm"
                        autoFocus
                      />
                    ) : (
                      <h3 className="flex-1 text-[color:var(--lightgreen)] font-semibold text-sm">
                        {tag.name}
                      </h3>
                    )}
                    
                    <div className="flex gap-1">
                      {inlineEditingTag === tag.id ? (
                        <>
                          <button
                            onClick={() => handleSaveInlineEdit(tag.id)}
                            disabled={formLoading}
                            className="bg-green-500 text-white py-1 px-2 rounded text-xs font-semibold hover:bg-green-600 transition-colors duration-300 disabled:opacity-50"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancelInlineEdit}
                            disabled={formLoading}
                            className="bg-gray-500 text-white py-1 px-2 rounded text-xs font-semibold hover:bg-gray-600 transition-colors duration-300 disabled:opacity-50"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEditTag(tag)}
                            className="bg-yellow-500 text-white py-1 px-2 rounded text-xs font-semibold hover:bg-yellow-600 transition-colors duration-300"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteTag(tag.id)}
                            disabled={formLoading}
                            className={`py-1 px-2 rounded text-xs font-semibold transition-colors duration-300 ${
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
        </div>)}

        {/* Submissions Management Section */}
        {activeTab === 'submission' && (
          <div id="submissions-section" className="bg-[color:var(--boxcolor)] rounded-[8px] md:rounded-[15px] backdrop-blur-sm border-[3px] md:border-[5px] border-[rgba(140,198,63,0.2)] p-4 md:p-8 mb-4 md:mb-8">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h2 className="text-[color:var(--lightgreen)] text-[clamp(18px,4vw,24px)] font-bold">
              Submissions Management
            </h2>
            <div className="flex gap-2 text-sm">
              <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full font-semibold">
                {submissions.filter(s => !s.approved).length} Pending
              </span>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-semibold">
                {submissions.filter(s => s.approved).length} Approved
              </span>
            </div>
          </div>

          {/* Pending Submissions */}
          {submissions.filter(s => !s.approved).length > 0 && (
            <div className="mb-6">
              <h3 className="text-[color:var(--lightgreen)] text-lg font-semibold mb-4">
                📋 Pending Approval ({submissions.filter(s => !s.approved).length})
              </h3>
              <div className="space-y-4">
                {submissions.filter(s => !s.approved).map((submission) => (
                  <div 
                    key={submission.id} 
                    className="border border-orange-300 bg-orange-50 rounded-lg p-4 hover:bg-orange-100 transition-colors duration-300"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      <div className="flex-1">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                          <div>
                            <span className="text-sm font-semibold text-gray-700">Name:</span>
                            <p className="text-gray-900">{submission.name || 'Not provided'}</p>
                          </div>
                          <div>
                            <span className="text-sm font-semibold text-gray-700">Email:</span>
                            <p className="text-gray-900">{submission.email || 'Not provided'}</p>
                          </div>
                          <div>
                            <span className="text-sm font-semibold text-gray-700">Location:</span>
                            <p className="text-gray-900">{submission.location}</p>
                          </div>
                          <div>
                            <span className="text-sm font-semibold text-gray-700">Occupation:</span>
                            <p className="text-gray-900">{submission.occupation || 'Not provided'}</p>
                          </div>
                        </div>
                        {submission.tel && (
                          <div className="mb-3">
                            <span className="text-sm font-semibold text-gray-700">Phone:</span>
                            <p className="text-gray-900">{submission.tel}</p>
                          </div>
                        )}
                        {submission.more_about && (
                          <div className="mb-3">
                            <span className="text-sm font-semibold text-gray-700">More About:</span>
                            <p className="text-gray-900 text-sm">{submission.more_about}</p>
                          </div>
                        )}
                        <div className="text-xs text-gray-600">
                          Submitted: {new Date(submission.created_at || '').toLocaleDateString()} | 
                          Policy Version: {submission.agreed_policy_version}
                        </div>
                      </div>
                      <div className="lg:ml-4 flex flex-col sm:flex-row gap-2">
                        <button
                          onClick={() => handleApproveSubmission(submission.id!)}
                          disabled={formLoading}
                          className="bg-green-500 text-white py-3 px-6 rounded-lg font-semibold text-sm transition-all duration-300 hover:bg-green-600 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          ✓ Approve
                        </button>
                        <button
                          onClick={() => handleDeleteSubmission(submission.id!)}
                          disabled={formLoading}
                          className="bg-red-500 text-white py-3 px-6 rounded-lg font-semibold text-sm transition-all duration-300 hover:bg-red-600 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          {deleteSubmissionConfirm === submission.id ? '⚠️ Deleting...' : '🗑️ Delete Submission'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Approved Submissions */}
          {submissions.filter(s => s.approved).length > 0 && (
            <div>
              <h3 className="text-[color:var(--lightgreen)] text-lg font-semibold mb-4">
                ✅ Approved Submissions ({submissions.filter(s => s.approved).length})
              </h3>
              <div className="space-y-3">
                {submissions.filter(s => s.approved).map((submission) => (
                  <div 
                    key={submission.id} 
                    className="border border-[rgba(140,198,63,0.2)] rounded-lg p-3 bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] transition-colors duration-300"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex-1">
                        <div className="flex flex-wrap gap-4 text-sm">
                          <span><strong>Name:</strong> {submission.name || 'N/A'}</span>
                          <span><strong>Location:</strong> {submission.location}</span>
                          <span><strong>Email:</strong> {submission.email || 'N/A'}</span>
                          <span><strong>Tel:</strong> {submission.tel || 'N/A'}</span>
                          <span><strong>Description:</strong> {submission.more_about || 'N/A'}</span>
                          <span><strong>Occupation:</strong> {submission.occupation || 'N/A'}</span>
                        </div>
                        <div className="text-xs text-[color:var(--lightgreen)] opacity-70 mt-1">
                          Approved on: {new Date(submission.created_at || '').toLocaleDateString()}
                        </div>
                      </div>
                      <div className="mt-2 lg:mt-0 flex items-center gap-2">
                        <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">
                          Approved
                        </span>
                        <button
                          onClick={() => handleDeleteSubmission(submission.id!)}
                          disabled={formLoading}
                          className={`bg-red-500 text-white py-1 px-2 rounded text-xs font-semibold transition-colors duration-300 ${
                            deleteSubmissionConfirm === submission.id ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-red-500 text-white hover:bg-red-600'
                          } disabled:opacity-50`}
                        >
                          {deleteSubmissionConfirm === submission.id ? 'Confirm?' : 'Delete'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No Submissions */}
          {submissions.length === 0 && !storiesLoading && (
            <p className="text-[color:var(--lightgreen)] opacity-70 text-center py-8">
              No submissions found.
            </p>
          )}

          {/* Loading State */}
          {storiesLoading && (
            <div className="space-y-3">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="h-20 bg-[rgba(140,198,63,0.3)] rounded mb-2"></div>
                </div>
              ))}
            </div>
          )}
        </div>)}

        {/* Organisation Management Section */}
        {activeTab === 'organisation' && (
          <div id="organisation-management-section" className="bg-[color:var(--boxcolor)] rounded-[8px] md:rounded-[15px] backdrop-blur-sm border-[3px] md:border-[5px] border-[rgba(140,198,63,0.2)] p-4 md:p-8 mb-4 md:mb-8">
          <h2 className="text-[color:var(--lightgreen)] text-[clamp(18px,4vw,24px)] font-bold mb-4">
            Organisation Management
          </h2>
          <form onSubmit={handleCreateOrganisation} className="space-y-4 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[color:var(--lightgreen)] text-sm font-semibold mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={orgFormData.name}
                  onChange={handleOrgInputChange}
                  required
                  className="w-full p-3 bg-[rgba(255,255,255,0.1)] border border-[rgba(140,198,63,0.3)] rounded-lg text-[color:var(--lightgreen)] placeholder-gray-400 focus:border-[color:var(--lightgreen)] focus:outline-none"
                  placeholder="Organisation name"
                />
              </div>
              <div>
                <label className="block text-[color:var(--lightgreen)] text-sm font-semibold mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={orgFormData.email}
                  onChange={handleOrgInputChange}
                  className="w-full p-3 bg-[rgba(255,255,255,0.1)] border border-[rgba(140,198,63,0.3)] rounded-lg text-[color:var(--lightgreen)] placeholder-gray-400 focus:border-[color:var(--lightgreen)] focus:outline-none"
                  placeholder="contact@example.org"
                />
              </div>
              <div>
                <label className="block text-[color:var(--lightgreen)] text-sm font-semibold mb-2">
                  Telephone
                </label>
                <input
                  type="text"
                  name="tel"
                  value={orgFormData.tel}
                  onChange={handleOrgInputChange}
                  className="w-full p-3 bg-[rgba(255,255,255,0.1)] border border-[rgba(140,198,63,0.3)] rounded-lg text-[color:var(--lightgreen)] placeholder-gray-400 focus:border-[color:var(--lightgreen)] focus:outline-none"
                  placeholder="+44 ..."
                />
              </div>
              <div>
                <label className="block text-[color:var(--lightgreen)] text-sm font-semibold mb-2">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={orgFormData.location}
                  onChange={handleOrgInputChange}
                  className="w-full p-3 bg-[rgba(255,255,255,0.1)] border border-[rgba(140,198,63,0.3)] rounded-lg text-[color:var(--lightgreen)] placeholder-gray-400 focus:border-[color:var(--lightgreen)] focus:outline-none"
                  placeholder="City, Country"
                />
              </div>
            </div>
            <div>
              <label className="block text-[color:var(--lightgreen)] text-sm font-semibold mb-2">
                Website
              </label>
              <input
                name="url"
                type='text'
                value={orgFormData.url}
                onChange={handleOrgInputChange}
                className="w-full p-3 bg-[rgba(255,255,255,0.1)] border border-[rgba(140,198,63,0.3)] rounded-lg text-[color:var(--lightgreen)] placeholder-gray-400 focus:border-[color:var(--lightgreen)] focus:outline-none"
                placeholder="https://climatestorieslibrary.com"
              />
            </div>
            <div>
              <label className="block text-[color:var(--lightgreen)] text-sm font-semibold mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={orgFormData.description}
                onChange={handleOrgInputChange}
                rows={3}
                className="w-full p-3 bg-[rgba(255,255,255,0.1)] border border-[rgba(140,198,63,0.3)] rounded-lg text-[color:var(--lightgreen)] placeholder-gray-400 focus:border-[color:var(--lightgreen)] focus:outline-none resize-vertical"
                placeholder="Short description"
              />
            </div>
            <div>
              <label className="block text-[color:var(--lightgreen)] text-sm font-semibold mb-2">
                Logo
              </label>
              <div
                className="w-full flex flex-col items-center justify-center border-2 border-dashed border-[rgba(140,198,63,0.3)] rounded-lg p-6 bg-[rgba(255,255,255,0.05)] cursor-pointer hover:bg-[rgba(255,255,255,0.1)] transition"
                onDrop={handleOrgLogoDrop}
                onDragOver={handleOrgLogoDragOver}
                tabIndex={0}
                role="button"
                aria-label="Drop logo file here"
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleOrgLogoChange}
                  className="hidden"
                  id="org-logo-input"
                />
                <label htmlFor="org-logo-input" className="cursor-pointer flex flex-col items-center">
                  {orgFormData.logoFile ? (
                    <>
                      <span className="text-[color:var(--lightgreen)] mb-2">
                        Selected: {orgFormData.logoFile.name}
                      </span>
                      <img
                        src={URL.createObjectURL(orgFormData.logoFile)}
                        alt="Logo preview"
                        className="w-20 h-20 object-contain rounded-full border border-[rgba(140,198,63,0.3)]"
                      />
                    </>
                  ) : (
                    <>
                      <span className="text-[color:var(--lightgreen)] mb-2">
                        Drag & drop logo here, or click to select
                      </span>
                      <span className="text-3xl">🖼️</span>
                    </>
                  )}
                </label>
              </div>
            </div>
            {orgFormError && (
              <div className="text-red-500 bg-red-100 border border-red-300 rounded p-2">{orgFormError}</div>
            )}
            {orgFormSuccess && (
              <div className="text-green-700 bg-green-100 border border-green-300 rounded p-2">{orgFormSuccess}</div>
            )}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={orgFormLoading}
                className="bg-[color:var(--lightgreen)] text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 hover:bg-[color:var(--darkgreen)] hover:text-[color:var(--lightgreen)] disabled:opacity-50"
              >
                {orgFormLoading
                  ? 'Saving...'
                  : editingOrgId
                    ? 'Update Organisation'
                    : 'Create Organisation'}
              </button>
              {(editingOrgId || orgFormData.name || orgFormData.description || orgFormData.email || orgFormData.tel || orgFormData.location || orgFormData.logoFile) && (
                <button
                  type="button"
                  onClick={resetOrgForm}
                  disabled={orgFormLoading}
                  className="px-6 py-3 border border-[color:var(--lightgreen)] text-[color:var(--lightgreen)] rounded-lg font-semibold hover:bg-[color:var(--lightgreen)] transition-all duration-300"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
          <h3 className="text-[color:var(--lightgreen)] text-lg font-semibold mb-2">Existing Organisations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {organisations.map(org => (
              <div key={org.id} className="border border-[rgba(140,198,63,0.2)] rounded-lg p-4 bg-[rgba(255,255,255,0.05)] flex flex-col items-center">
                {org.logo_url && (
                  <img src={org.logo_url} alt={org.name || 'Logo'} className="w-16 h-16 object-contain rounded-full mb-2" />
                )}
                <h4 className="text-[color:var(--lightgreen)] font-semibold">{org.name}</h4>
                <p className="text-[color:var(--lightgreen)] opacity-80 text-sm mb-1">{org.description}</p>
                {org.url && <div className="text-[color:var(--lightgreen)] text-xs">{org.url}</div>}
                {org.email && <div className="text-[color:var(--lightgreen)] text-xs">{org.email}</div>}
                {org.tel && <div className="text-[color:var(--lightgreen)] text-xs">{org.tel}</div>}
                {org.location && <div className="text-[color:var(--lightgreen)] text-xs">{org.location}</div>}
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleEditOrganisation(org)}
                    className="bg-yellow-500 text-white py-1 px-3 rounded text-xs font-semibold hover:bg-yellow-600 transition-colors duration-300"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteOrganisation(org.id)}
                    disabled={orgFormLoading}
                    className={`py-1 px-3 rounded text-xs font-semibold transition-colors duration-300 ${
                      deleteOrgConfirm === org.id
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : 'bg-red-500 text-white hover:bg-red-600'
                    } disabled:opacity-50`}
                  >
                    {deleteOrgConfirm === org.id ? 'Confirm?' : 'Delete'}
                  </button>
                </div>
              </div>
            ))}
            {organisations.length === 0 && (
              <div className="col-span-full text-[color:var(--lightgreen)] opacity-70 text-center py-8">
                No organisations found.
              </div>
            )}
          </div>
        </div>)}


        {/* Global Advisor Management Section */}
        {activeTab === 'global-advisor' && (
          <div id="global-advisor-management-section" className="bg-[color:var(--boxcolor)] rounded-[8px] md:rounded-[15px] backdrop-blur-sm border-[3px] md:border-[5px] border-[rgba(140,198,63,0.2)] p-4 md:p-8 mb-4 md:mb-8">
            <h2 className="text-[color:var(--lightgreen)] text-[clamp(18px,4vw,24px)] font-bold mb-4">
              Global Advisors Management
            </h2>
            <form onSubmit={handleCreateGlobalAdvisor} className="space-y-4 mb-8">
              <div>
                <label className="block text-[color:var(--lightgreen)] text-sm font-semibold mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={globAdvFormData.name}
                  onChange={handleGlobAdvInputChange}
                  required
                  className="w-full p-3 bg-[rgba(255,255,255,0.1)] border border-[rgba(140,198,63,0.3)] rounded-lg text-[color:var(--lightgreen)] placeholder-gray-400 focus:border-[color:var(--lightgreen)] focus:outline-none"
                  placeholder="Advisor name"
                />
              </div>
              <div>
                <label className="block text-[color:var(--lightgreen)] text-sm font-semibold mb-2">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={globAdvFormData.title}
                  onChange={handleGlobAdvInputChange}
                  className="w-full p-3 bg-[rgba(255,255,255,0.1)] border border-[rgba(140,198,63,0.3)] rounded-lg text-[color:var(--lightgreen)] placeholder-gray-400 focus:border-[color:var(--lightgreen)] focus:outline-none"
                  placeholder="Job title or short description"
                />
              </div>
              <div>
                <label className="block text-[color:var(--lightgreen)] text-sm font-semibold mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={globAdvFormData.description}
                  onChange={handleGlobAdvInputChange}
                  rows={3}
                  className="w-full p-3 bg-[rgba(255,255,255,0.1)] border border-[rgba(140,198,63,0.3)] rounded-lg text-[color:var(--lightgreen)] placeholder-gray-400 focus:border-[color:var(--lightgreen)] focus:outline-none resize-vertical"
                  placeholder="Short description"
                />
              </div>
              <div>
                <label className="block text-[color:var(--lightgreen)] text-sm font-semibold mb-2">
                  Image
                </label>
                <div
                  className="w-full flex flex-col items-center justify-center border-2 border-dashed border-[rgba(140,198,63,0.3)] rounded-lg p-6 bg-[rgba(255,255,255,0.05)] cursor-pointer hover:bg-[rgba(255,255,255,0.1)] transition"
                  onDrop={handleGlobAdvPictureDrop}
                  onDragOver={handleGlobAdvPictureDragOver}
                  tabIndex={0}
                  role="button"
                  aria-label="Drop image file here"
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleGlobAdvPictureChange}
                    className="hidden"
                    id="glob-logo-input"
                  />
                  <label htmlFor="glob-logo-input" className="cursor-pointer flex flex-col items-center">
                    {globAdvFormData.logoFile ? (
                      <>
                        <span className="text-[color:var(--lightgreen)] mb-2">
                          Selected: {globAdvFormData.logoFile.name}
                        </span>
                        <img
                          src={URL.createObjectURL(globAdvFormData.logoFile)}
                          alt="Image preview"
                          className="w-20 h-20 object-contain rounded-full border border-[rgba(140,198,63,0.3)]"
                        />
                      </>
                    ) : globAdvFormData.logoUrl ? (
                      <>
                        <span className="text-[color:var(--lightgreen)] mb-2">
                          Current image
                        </span>
                        <img
                          src={globAdvFormData.logoUrl}
                          alt="Current image"
                          className="w-20 h-20 object-contain rounded-full border border-[rgba(140,198,63,0.3)]"
                        />
                      </>
                    ) : (
                      <>
                        <span className="text-[color:var(--lightgreen)] mb-2">
                          Drag & drop image here, or click to select
                        </span>
                        <span className="text-3xl">🖼️</span>
                      </>
                    )}
                  </label>
                </div>
              </div>
              {globAdvFormError && (
                <div className="text-red-500 bg-red-100 border border-red-300 rounded p-2">{globAdvFormError}</div>
              )}
              {globAdvFormSuccess && (
                <div className="text-green-700 bg-green-100 border border-green-300 rounded p-2">{globAdvFormSuccess}</div>
              )}
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={globAdvFormLoading}
                  className="bg-[color:var(--lightgreen)] text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 hover:bg-[color:var(--darkgreen)] hover:text-[color:var(--lightgreen)] disabled:opacity-50"
                >
                  {globAdvFormLoading
                    ? 'Saving...'
                    : editingGlobAdvId
                      ? 'Update Advisor'
                      : 'Create Advisor'}
                </button>
                {(editingGlobAdvId || globAdvFormData.name || globAdvFormData.title || globAdvFormData.description || globAdvFormData.logoFile) && (
                  <button
                    type="button"
                    onClick={resetGlobAdvForm}
                    disabled={globAdvFormLoading}
                    className="px-6 py-3 border border-[color:var(--lightgreen)] text-[color:var(--lightgreen)] rounded-lg font-semibold hover:bg-[color:var(--lightgreen)] transition-all duration-300"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
            <h3 className="text-[color:var(--lightgreen)] text-lg font-semibold mb-2">Existing Global Advisors</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {globalAdvisors.map(adv => (
                <div key={adv.id} className="border border-[rgba(140,198,63,0.2)] rounded-lg p-4 bg-[rgba(255,255,255,0.05)] flex flex-col items-center">
                  {adv.img_url && (
                    <img src={adv.img_url} alt={adv.name || 'Advisor'} className="w-16 h-16 object-contain rounded-full mb-2" />
                  )}
                  <h4 className="text-[color:var(--lightgreen)] font-semibold">{adv.name}</h4>
                  <div className="text-[color:var(--lightgreen)] opacity-80 text-sm mb-1">{adv.title}</div>
                  <p className="text-[color:var(--lightgreen)] opacity-80 text-sm mb-1">{adv.description}</p>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleEditGlobalAdvisor(adv)}
                      className="bg-yellow-500 text-white py-1 px-3 rounded text-xs font-semibold hover:bg-yellow-600 transition-colors duration-300"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteGlobalAdvisor(adv.id)}
                      disabled={globAdvFormLoading}
                      className={`py-1 px-3 rounded text-xs font-semibold transition-colors duration-300 ${
                        deleteGlobAdvConfirm === adv.id
                          ? 'bg-red-600 text-white hover:bg-red-700'
                          : 'bg-red-500 text-white hover:bg-red-600'
                      } disabled:opacity-50`}
                    >
                      {deleteGlobAdvConfirm === adv.id ? 'Confirm?' : 'Delete'}
                    </button>
                  </div>
                </div>
              ))}
              {globalAdvisors.length === 0 && (
                <div className="col-span-full text-[color:var(--lightgreen)] opacity-70 text-center py-8">
                  No global advisors found.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Blog Post Form Section */}
        {showBlogPostForm && (
          <div className="bg-[color:var(--boxcolor)] rounded-[8px] md:rounded-[15px] backdrop-blur-sm border-[3px] md:border-[5px] border-[rgba(140,198,63,0.2)] p-4 md:p-8 mb-4 md:mb-8">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h2 className="text-[color:var(--lightgreen)] text-[clamp(18px,4vw,24px)] font-bold">
                {editingBlogPostId ? 'Edit Blog Post' : 'Create New Blog Post'}
              </h2>
              <button
                onClick={resetBlogPostForm}
                className="text-[color:var(--lightgreen)] hover:opacity-70 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateBlogPost} className="space-y-4">
              <div>
                <label className="block text-[color:var(--lightgreen)] text-sm font-semibold mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={blogPostFormData.title}
                  onChange={handleBlogPostInputChange}
                  required
                  className="w-full p-3 bg-[rgba(255,255,255,0.1)] border border-[rgba(140,198,63,0.3)] rounded-lg text-[color:var(--lightgreen)] placeholder-gray-400 focus:border-[color:var(--lightgreen)] focus:outline-none"
                  placeholder="Blog post title"
                />
              </div>

              <div>
                <label className="block text-[color:var(--lightgreen)] text-sm font-semibold mb-2">
                  Content *
                </label>
                <textarea
                  name="content"
                  value={blogPostFormData.content}
                  onChange={handleBlogPostInputChange}
                  required
                  rows={10}
                  className="w-full p-3 bg-[rgba(255,255,255,0.1)] border border-[rgba(140,198,63,0.3)] rounded-lg text-[color:var(--lightgreen)] placeholder-gray-400 focus:border-[color:var(--lightgreen)] focus:outline-none resize-vertical"
                  placeholder="Blog post content..."
                />
              </div>

              <div>
                <label className="block text-[color:var(--lightgreen)] text-sm font-semibold mb-2">
                  Images
                </label>
                <div
                  className="w-full flex flex-col items-center justify-center border-2 border-dashed border-[rgba(140,198,63,0.3)] rounded-lg p-6 bg-[rgba(255,255,255,0.05)] cursor-pointer hover:bg-[rgba(255,255,255,0.1)] transition"
                  onDrop={handleBlogPostImageDrop}
                  onDragOver={handleBlogPostImageDragOver}
                  tabIndex={0}
                  role="button"
                  aria-label="Drop image files here"
                >
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleBlogPostImageChange}
                    className="hidden"
                    id="blog-images-input"
                  />
                  <label htmlFor="blog-images-input" className="cursor-pointer flex flex-col items-center">
                    <span className="text-[color:var(--lightgreen)] mb-2">
                      Drag & drop images here, or click to select multiple
                    </span>
                    <span className="text-3xl">🖼️</span>
                  </label>
                </div>

                {/* Existing Images */}
                {blogPostFormData.existingImages.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-[color:var(--lightgreen)] text-sm font-semibold mb-2">Current Images:</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {blogPostFormData.existingImages.map((image) => (
                        <div key={image.id} className="relative">
                          <img
                            src={image.image_url}
                            alt="Blog image"
                            className="w-full h-20 object-cover rounded border border-[rgba(140,198,63,0.3)]"
                          />
                          <button
                            type="button"
                            onClick={() => removeExistingImage(image.id)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* New Images Preview */}
                {blogPostFormData.imageFiles.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-[color:var(--lightgreen)] text-sm font-semibold mb-2">New Images:</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {blogPostFormData.imageFiles.map((file, index) => (
                        <div key={index} className="relative">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-20 object-cover rounded border border-[rgba(140,198,63,0.3)]"
                          />
                          <button
                            type="button"
                            onClick={() => removeImageFile(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {blogPostFormError && (
                <div className="text-red-500 bg-red-100 border border-red-300 rounded p-2">{blogPostFormError}</div>
              )}
              {blogPostFormSuccess && (
                <div className="text-green-700 bg-green-100 border border-green-300 rounded p-2">{blogPostFormSuccess}</div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={blogPostFormLoading}
                  className="flex-1 bg-[color:var(--lightgreen)] text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 hover:bg-[color:var(--darkgreen)] hover:text-[color:var(--lightgreen)] disabled:opacity-50"
                >
                  {blogPostFormLoading ? 'Saving...' : editingBlogPostId ? 'Update Blog Post' : 'Create Blog Post'}
                </button>
                <button
                  type="button"
                  onClick={resetBlogPostForm}
                  className="px-6 py-3 border border-[color:var(--lightgreen)] text-[color:var(--lightgreen)] rounded-lg font-semibold hover:bg-[color:var(--lightgreen)] transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Blog Post Management Section */}
        {activeTab === 'blog-post' && (
          <div id="blog-post-management-section" className="bg-[color:var(--boxcolor)] rounded-[8px] md:rounded-[15px] backdrop-blur-sm border-[3px] md:border-[5px] border-[rgba(140,198,63,0.2)] p-4 md:p-8 mb-4 md:mb-8">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h2 className="text-[color:var(--lightgreen)] text-[clamp(18px,4vw,24px)] font-bold">
                Blog Post Management
              </h2>
              <button
                onClick={() => setShowBlogPostForm(true)}
                className="bg-green-500 text-white py-2 px-4 rounded-lg font-semibold text-sm transition-all duration-300 hover:bg-green-600"
              >
                Create Blog Post
              </button>
            </div>

            <div className="space-y-4">
              {blogPosts.map((post) => (
                <div 
                  key={post.id} 
                  className="border border-[rgba(140,198,63,0.2)] rounded-lg p-4 hover:bg-[rgba(255,255,255,0.05)] transition-colors duration-300"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex-1">
                      <h3 className="text-[color:var(--lightgreen)] font-semibold mb-1">
                        {post.title}
                      </h3>
                      <p className="text-[color:var(--lightgreen)] opacity-70 text-sm mb-2">
                        {post.content ? (post.content.length > 150 ? post.content.substring(0, 150) + '...' : post.content) : 'No content'}
                      </p>
                      <p className="text-[color:var(--lightgreen)] opacity-60 text-xs">
                        Created: {new Date(post.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="mt-3 lg:mt-0 lg:ml-4 flex gap-2">
                      <button
                        onClick={() => handleEditBlogPost(post)}
                        className="bg-yellow-500 text-white py-1 px-3 rounded text-sm font-semibold hover:bg-yellow-600 transition-colors duration-300"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteBlogPost(post.id)}
                        disabled={blogPostFormLoading}
                        className={`py-1 px-3 rounded text-sm font-semibold transition-colors duration-300 ${
                          deleteBlogPostConfirm === post.id 
                            ? 'bg-red-600 text-white hover:bg-red-700' 
                            : 'bg-red-500 text-white hover:bg-red-600'
                        } disabled:opacity-50`}
                      >
                        {deleteBlogPostConfirm === post.id ? 'Confirm?' : 'Delete'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {blogPosts.length === 0 && (
                <p className="text-[color:var(--lightgreen)] opacity-70 text-center py-8">
                  No blog posts found.
                </p>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}


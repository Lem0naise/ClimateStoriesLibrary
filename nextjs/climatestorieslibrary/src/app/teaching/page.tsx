"use client";

import { useState, useEffect } from "react";
import {
  fetchTeachingResources,
  TeachingResource,
} from "@/utils/useSupabase";

export default function TeachingResources() {
  const [resources, setResources] = useState<TeachingResource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadResources = async () => {
      try {
        const data = await fetchTeachingResources();
        setResources(data);
      } catch (error) {
        console.error("Error loading teaching resources:", error);
      } finally {
        setLoading(false);
      }
    };
    loadResources();
  }, []);

  const formatFileSize = (size: string | null) => {
    if (!size) return "";
    return size;
  };

  const getFileTypeLabel = (fileType: string) => {
    switch (fileType) {
      case "pdf":
        return "PDF";
      case "pptx":
        return "PowerPoint";
      default:
        return fileType.toUpperCase();
    }
  };

  return (
    <div className="min-h-fit pb-[10vh] bg-[color:var(--background)] transition-colors duration-300">
      <div className="max-w-full md:max-w-[90vw] mx-auto py-4 md:py-10 px-3 md:px-5 text-green-600">
        <div className="bg-[color:var(--boxcolor)] rounded-[8px] md:rounded-[15px] backdrop-blur-sm border-[3px] md:border-[5px] border-[rgba(140,198,63,0.2)] text-center p-3 md:p-10 pt-2 md:pt-2 pb-4 md:pb-10 mb-4 md:mb-8">
          <h2 className="text-[color:var(--lightgreen)] text-[clamp(24px,6vw,50px)] mb-2 md:mb-5 font-bold">
            Teaching Resources
          </h2>
          <p className="text-[color:var(--lightgreen)] text-[clamp(12px,3vw,18px)] leading-relaxed opacity-90 max-w-[700px] mx-auto mb-6 md:mb-10">
            Free downloadable resources for teachers to use in the classroom.
            Each resource is designed to help students explore climate stories and
            understand the social justice dimensions of the climate and nature
            crisis.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {loading
              ? [...Array(3)].map((_, index) => (
                  <div
                    key={index}
                    className="bg-[rgba(255,255,255,0.08)] rounded-xl border border-[rgba(140,198,63,0.2)] overflow-hidden animate-pulse p-6"
                  >
                    <div className="h-5 bg-[rgba(140,198,63,0.3)] rounded mb-3 w-3/4" />
                    <div className="h-3 bg-[rgba(140,198,63,0.2)] rounded mb-2" />
                    <div className="h-3 bg-[rgba(140,198,63,0.2)] rounded mb-4 w-5/6" />
                    <div className="h-9 bg-[rgba(140,198,63,0.3)] rounded w-32" />
                  </div>
                ))
              : resources.map((resource) => (
                  <div
                    key={resource.id}
                    className="bg-[rgba(255,255,255,0.08)] rounded-xl border border-[rgba(140,198,63,0.2)] p-6 flex flex-col text-left"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-[color:var(--lightgreen)] text-lg font-semibold">
                        {resource.title}
                      </h3>
                      <span className="bg-[color:var(--lightgreen)] text-[color:var(--darkgreen)] text-xs font-bold px-2 py-1 rounded-md flex-shrink-0 ml-2">
                        {getFileTypeLabel(resource.file_type)}
                      </span>
                    </div>

                    {resource.category && (
                      <span className="text-[color:var(--lightgreen)] text-xs font-medium opacity-70 uppercase tracking-wide mb-2">
                        {resource.category}
                      </span>
                    )}

                    {resource.description && (
                      <p className="text-[color:var(--lightgreen)] text-sm leading-relaxed opacity-90 mb-4 flex-1">
                        {resource.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-[rgba(140,198,63,0.15)]">
                      <span className="text-[color:var(--lightgreen)] text-xs opacity-60">
                        {formatFileSize(resource.file_size)}
                        {resource.download_count > 0 && (
                          <> · {resource.download_count} download{resource.download_count !== 1 ? 's' : ''}</>
                        )}
                      </span>
                      <a
                        href={`/api/resources/download/${resource.id}`}
                        className="inline-block bg-[color:var(--lightgreen)] text-[color:var(--darkgreen)] py-2 px-5 rounded-lg no-underline font-semibold text-sm transition-all duration-300 hover:bg-[color:var(--darkgreen)] hover:text-[color:var(--lightgreen)] hover:-translate-y-0.5 hover:shadow-[0_5px_15px_rgba(140,198,63,0.3)]"
                      >
                        Download
                      </a>
                    </div>
                  </div>
                ))}

            {!loading && resources.length === 0 && (
              <div className="col-span-full text-center py-10">
                <p className="text-[color:var(--lightgreen)] text-lg">
                  No teaching resources available yet. Check back soon!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

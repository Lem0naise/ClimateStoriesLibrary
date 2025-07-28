"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { fetchOrganisations, Organisation } from "@/utils/useSupabase";

export default function Connect() {
  const [organisations, setOrganisations] = useState<Organisation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrganisations().then((data) => {
      setOrganisations(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-fit pb-[10vh] bg-[color:var(--background)] transition-colors duration-300">
      <div className="max-w-full md:max-w-[80vw] mx-auto py-4 md:py-10 px-3 md:px-5 text-green-600">
        <div className="bg-[color:var(--boxcolor)] rounded-[8px] md:rounded-[15px] backdrop-blur-sm border-[3px] md:border-[5px] border-[rgba(140,198,63,0.2)] text-center p-3 md:p-10 pt-2 md:pt-2 pb-4 md:pb-10 mb-4 md:mb-8">
          <h1 className="text-[color:var(--lightgreen)] text-[clamp(24px,6vw,50px)] mb-2 md:mb-5 font-bold">
            Connect with Climate Organisations
          </h1>
          <p className="text-[color:var(--lightgreen)] text-[clamp(12px,3vw,18px)] leading-relaxed opacity-90 max-w-[700px] mx-auto mb-4 md:mb-8">
            Find and contact organisations working on climate, nature, and social
            justice.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {loading ? (
              <div className="col-span-full text-center text-[color:var(--lightgreen)] opacity-80">
                Loading organisations...
              </div>
            ) : organisations.length === 0 ? (
              <div className="col-span-full text-center text-[color:var(--lightgreen)] opacity-80">
                No organisations found.
              </div>
            ) : (
              organisations.map((org) => (
                <div
                  key={org.id}
                  className="bg-[rgba(255,255,255,0.08)] rounded-xl border border-[rgba(140,198,63,0.2)] overflow-hidden flex flex-col items-left p-6 text-left"
                >
                  <div className="w-full h-20 mb-8 flex items-center justify-center text-left">
                    {org.logo_url ? (
                      <Image
                        src={org.logo_url}
                        alt={`${org.name ?? "Organisation"} logo`}
                        width={80}
                        height={80}
                        className="object-contain rounded-full bg-white/80 p-2"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-white/30 flex items-center justify-center text-3xl text-[color:var(--lightgreen)]">
                        {org.name?.[0] ?? "?"}
                      </div>
                    )}
                    <h2 className="text-[color:var(--lightgreen)] text-2xl font-semibold">
                    {org.name}
                  </h2>
                  </div>
                  
                  <p className="text-[color:var(--lightgreen)] text-sm opacity-90 mb-3 text-left">
                    {org.description}
                  </p>
                  {org.url && (
                    <a
                      href={
                        org.url.startsWith("http://") || org.url.startsWith("https://")
                            ? org.url
                            : `https://${org.url}`
                        }
                      target='_blank'
                      className="inline-block mb-2 text-[color:var(--lightgreen)] underline hover:opacity-80 transition-opacity text-[clamp(12px,2vw,15px)]"
                    >
                      {org.url}
                    </a>
                  )}
                  {org.email && (
                    <p
                      className="inline-block mb-2 opacity-70 text-[color:var(--lightgreen)] transition-opacity text-[clamp(12px,2vw,15px)]"
                    >
                      {org.email}{org.tel && (<>, {org.tel}</>)}
                    </p>
                  )}
                  {org.location && (
                    <p className="text-[color:var(--lightgreen)] text-left opacity-70 text-[clamp(12px,2vw,15px)] mb-2">
                      {org.location}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
          <div className="mt-10 text-center">
            <p className="text-[color:var(--lightgreen)] text-[clamp(12px,2.5vw,15px)] opacity-80 mb-2">
              Want your organisation listed here?
            </p>
            <a
              href="mailto:juliet@climatestorieslibrary.com"
              className="inline-block bg-[color:var(--lightgreen)] text-[color:var(--darkgreen)] py-3 px-6 rounded-lg no-underline font-semibold text-[clamp(12px,3vw,16px)] transition-all duration-300 hover:bg-[color:var(--darkgreen)] hover:text-[color:var(--lightgreen)] hover:-translate-y-0.5 hover:shadow-[0_5px_15px_rgba(140,198,63,0.3)]"
            >
              📧 Contact Us to Add Your Org
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

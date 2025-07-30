"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/useSupabase";

type GlobalAdvisor = {
  id: string;
  name: string | null;
  title: string | null;
  description: string | null;
  img_url?: string | null;
};

export default function GlobalAdvisors() {
  const [advisors, setAdvisors] = useState<GlobalAdvisor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAdvisors() {
      const { data, error } = await supabase
        .from("global-advisors")
        .select("*")
        .order("name", { ascending: true });
      setAdvisors(data || []);
      setLoading(false);
    }
    fetchAdvisors();
  }, []);

  return (
    <>
      <h3 className="text-[color:var(--lightgreen)] text-[clamp(16px,3.5vw,24px)] mb-4 font-semibold">
        Global Advisors include:
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {loading ? (
          <div className="col-span-full text-center text-[color:var(--lightgreen)] opacity-80">
            Loading advisors...
          </div>
        ) : advisors.length === 0 ? (
          <div className="col-span-full text-center text-[color:var(--lightgreen)] opacity-80">
            No global advisors found.
          </div>
        ) : (
          advisors.map((adv) => (
            <div
              key={adv.id}
              className="bg-[rgba(255,255,255,0.08)] p-4 md:p-6 rounded-lg border border-[rgba(140,198,63,0.2)]"
            >
              <div className="flex flex-col sm:flex-row items-center sm:items-start mb-4">
                {adv.img_url ? (
                  <Image
                    src={adv.img_url}
                    alt={adv.name ?? "Advisor"}
                    width={100}
                    height={100}
                    className="rounded-full mb-3 sm:mb-0 sm:mr-4 flex-shrink-0 object-contain bg-white/80"
                  />
                ) : (
                  <div className="w-[100px] h-[100px] rounded-full bg-white/30 flex items-center justify-center text-3xl text-[color:var(--lightgreen)] mb-3 sm:mb-0 sm:mr-4 flex-shrink-0">
                    {adv.name?.[0] ?? "?"}
                  </div>
                )}
                <div className="text-center sm:text-left">
                  <h3 className="text-[color:var(--lightgreen)] text-[clamp(14px,3vw,20px)] mb-2 font-semibold">
                    {adv.name}
                  </h3>
                  {adv.title && (
                    <h4 className="text-[color:var(--lightgreen)] text-[clamp(12px,2.5vw,16px)] mb-2 opacity-80">
                      {adv.title}
                    </h4>
                  )}
                  {adv.description && (
                    <p className="text-[color:var(--lightgreen)] text-[clamp(11px,2.2vw,14px)] leading-relaxed opacity-90">
                      {adv.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
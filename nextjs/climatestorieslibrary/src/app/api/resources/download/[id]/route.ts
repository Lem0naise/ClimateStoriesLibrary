import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  const { data: resource } = await supabase
    .from("teaching_resources")
    .select("file_url, download_count")
    .eq("id", id)
    .single();

  if (!resource) {
    return NextResponse.json({ error: "Resource not found" }, { status: 404 });
  }

  await supabase
    .from("teaching_resources")
    .update({ download_count: (resource.download_count || 0) + 1 })
    .eq("id", id);

  return NextResponse.redirect(resource.file_url);
}

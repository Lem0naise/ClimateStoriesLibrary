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

  const { data: resource, error: fetchError } = await supabase
    .from("teaching_resources")
    .select("file_url")
    .eq("id", id)
    .single();

  if (fetchError || !resource) {
    return NextResponse.json({ error: "Resource not found" }, { status: 404 });
  }

  const { error: incrementError } = await supabase.rpc(
    "increment_teaching_resource_download",
    { resource_id: id }
  );

  if (incrementError) {
    console.error("Error incrementing download count:", incrementError);
    return NextResponse.json(
      { error: "Failed to update download count" },
      { status: 500 }
    );
  }

  return NextResponse.redirect(resource.file_url);
}

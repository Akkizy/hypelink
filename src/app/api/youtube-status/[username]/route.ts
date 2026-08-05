import { NextResponse } from "next/server";
import { createPublicClient } from "@/lib/supabase/public";
import { getYouTubeStatus } from "@/lib/youtube";

export async function GET(_request: Request, { params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const supabase = createPublicClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan, youtube_channel_id")
    .eq("username", username)
    .maybeSingle();

  if (!profile || profile.plan !== "pro" || !profile.youtube_channel_id) {
    return NextResponse.json({ enabled: false });
  }

  try {
    const status = await getYouTubeStatus(profile.youtube_channel_id);
    return NextResponse.json({ enabled: true, ...status });
  } catch (error) {
    console.error("youtube-status error", error);
    return NextResponse.json({ enabled: false });
  }
}

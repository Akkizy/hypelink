import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

function detectDevice(userAgent: string | null) {
  if (!userAgent) return "unknown";
  if (/mobile/i.test(userAgent)) return "mobile";
  if (/tablet/i.test(userAgent)) return "tablet";
  return "desktop";
}

export async function POST(request: NextRequest) {
  let linkId: string | undefined;
  try {
    const body = await request.json();
    linkId = body.linkId;
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  if (!linkId || typeof linkId !== "string") {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const supabase = createAdminClient();

  const { data: link } = await supabase.from("links").select("id, profile_id, click_count").eq("id", linkId).maybeSingle();
  if (!link) {
    return NextResponse.json({ ok: false }, { status: 404 });
  }

  await Promise.all([
    supabase.from("links").update({ click_count: link.click_count + 1 }).eq("id", link.id),
    supabase.from("link_clicks").insert({
      link_id: link.id,
      profile_id: link.profile_id,
      referrer: request.headers.get("referer"),
      device_type: detectDevice(request.headers.get("user-agent")),
      country: request.headers.get("x-vercel-ip-country"),
    }),
  ]);

  return NextResponse.json({ ok: true });
}

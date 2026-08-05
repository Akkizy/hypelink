const API_BASE = "https://www.googleapis.com/youtube/v3";

// Live status changes fast, but checking it costs 100 quota units per call —
// cache aggressively and share the result across every visitor.
const LIVE_CACHE_SECONDS = 300;
// Cheap call (~1-5 units), safe to refresh more often.
const LATEST_VIDEO_CACHE_SECONDS = 180;
const CHANNEL_LOOKUP_CACHE_SECONDS = 3600;

type ChannelInfo = {
  channelId: string;
  title: string;
  uploadsPlaylistId: string;
};

function apiKey() {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) throw new Error("YOUTUBE_API_KEY não configurada.");
  return key;
}

async function youtubeFetch(path: string, params: Record<string, string>, revalidate: number) {
  const url = new URL(`${API_BASE}/${path}`);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  url.searchParams.set("key", apiKey());

  const res = await fetch(url.toString(), { next: { revalidate } });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`YouTube API ${path} falhou (${res.status}): ${body.slice(0, 200)}`);
  }
  return res.json();
}

function extractHandleOrId(input: string): { forHandle?: string; id?: string } {
  const trimmed = input.trim();

  const urlMatch = trimmed.match(/youtube\.com\/(channel\/|@)([^/?#]+)/i);
  if (urlMatch) {
    return urlMatch[1] === "channel/" ? { id: urlMatch[2] } : { forHandle: urlMatch[2] };
  }
  if (/^UC[\w-]{20,}$/.test(trimmed)) return { id: trimmed };
  return { forHandle: trimmed.replace(/^@/, "") };
}

export async function resolveYouTubeChannel(input: string): Promise<ChannelInfo> {
  const { forHandle, id } = extractHandleOrId(input);

  const data = await youtubeFetch(
    "channels",
    {
      part: "snippet,contentDetails",
      ...(id ? { id } : { forHandle: forHandle! }),
    },
    CHANNEL_LOOKUP_CACHE_SECONDS,
  );

  const channel = data.items?.[0];
  if (!channel) throw new Error("Canal do YouTube não encontrado.");

  return {
    channelId: channel.id,
    title: channel.snippet?.title ?? "",
    uploadsPlaylistId: channel.contentDetails?.relatedPlaylists?.uploads,
  };
}

export type YouTubeStatus = {
  isLive: boolean;
  liveVideoId?: string;
  liveTitle?: string;
  latestVideo?: { id: string; title: string; thumbnail: string; publishedAt: string };
};

export async function getYouTubeStatus(channelId: string): Promise<YouTubeStatus> {
  const [liveData, channelData] = await Promise.all([
    youtubeFetch(
      "search",
      { part: "snippet", channelId, eventType: "live", type: "video", maxResults: "1" },
      LIVE_CACHE_SECONDS,
    ),
    youtubeFetch("channels", { part: "contentDetails", id: channelId }, CHANNEL_LOOKUP_CACHE_SECONDS),
  ]);

  const liveItem = liveData.items?.[0];
  const status: YouTubeStatus = liveItem
    ? { isLive: true, liveVideoId: liveItem.id?.videoId, liveTitle: liveItem.snippet?.title }
    : { isLive: false };

  const uploadsPlaylistId = channelData.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
  if (uploadsPlaylistId) {
    const playlistData = await youtubeFetch(
      "playlistItems",
      { part: "snippet", playlistId: uploadsPlaylistId, maxResults: "1" },
      LATEST_VIDEO_CACHE_SECONDS,
    );
    const video = playlistData.items?.[0];
    if (video) {
      status.latestVideo = {
        id: video.snippet?.resourceId?.videoId,
        title: video.snippet?.title,
        thumbnail: video.snippet?.thumbnails?.medium?.url ?? video.snippet?.thumbnails?.default?.url,
        publishedAt: video.snippet?.publishedAt,
      };
    }
  }

  return status;
}

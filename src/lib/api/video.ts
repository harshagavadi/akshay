export interface VideoFormat {
  quality: string;
  format: string;
  size?: string | null;
  url: string;
  audioUrl?: string | null;
  hasAudio: boolean;
  videoOnly?: boolean;
  itag?: number | null;
  audioItag?: number | null;
  source?: string;
  pageUrl?: string;
}

export interface VideoInfo {
  title: string;
  thumbnail: string;
  duration: string;
  formats: VideoFormat[];
  source?: string;
}

export function parseVideoUrls(input: string) {
  return Array.from(
    new Set(
      input
        .split(/[\n,]+/)
        .map((value) => value.trim())
        .filter(Boolean)
    )
  );
}

export function normalizeVideoUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return trimmed;

  try {
    const url = new URL(trimmed.includes("://") ? trimmed : `https://${trimmed}`);

    if (url.hostname === "youtu.be") {
      const videoId = url.pathname.slice(1);
      if (videoId) {
        return `https://www.youtube.com/watch?v=${videoId}`;
      }
    }

    if (url.hostname.endsWith("youtube.com")) {
      if (url.pathname.startsWith("/shorts/")) {
        const videoId = url.pathname.split("/")[2];
        if (videoId) {
          return `https://www.youtube.com/watch?v=${videoId}`;
        }
      }

      if (url.pathname === "/watch" && url.searchParams.has("v")) {
        return `https://www.youtube.com/watch?v=${url.searchParams.get("v")}`;
      }
    }

    const removeParams = [
      "si",
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_term",
      "utm_content",
      "feature",
      "fbclid",
    ];
    removeParams.forEach((name) => url.searchParams.delete(name));

    return url.toString();
  } catch {
    return trimmed;
  }
}

async function readApiError(response: Response, fallback: string) {
  const text = await response.text();
  if (!text) return fallback;

  try {
    const error = JSON.parse(text);
    return error?.error || error?.message || fallback;
  } catch {
    return text.slice(0, 200) || fallback;
  }
}

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";
const USE_DIRECT_API = import.meta.env.VITE_USE_DIRECT_VIDEO_API === "true";
const DIRECT_VIDEO_API_URL = import.meta.env.VITE_DIRECT_VIDEO_API_URL || "https://All-Video-Downloader.proxy-production.allthingsdev.co/all_media_downloader_v3/download";
const DIRECT_VIDEO_API_KEY = import.meta.env.VITE_DIRECT_VIDEO_API_KEY || "9xkEKzmlRkVKTWQplEB86RfCsfj3ueLCwHoGH-Kpnw2Tm57mJI";
const DIRECT_VIDEO_API_HOST = import.meta.env.VITE_DIRECT_VIDEO_API_HOST || "All-Video-Downloader.allthingsdev.co";
const DIRECT_VIDEO_API_ENDPOINT = import.meta.env.VITE_DIRECT_VIDEO_API_ENDPOINT || "a67c4f7d-d1ec-4d63-a524-7cf81ce32fbe";

async function fetchVideoInfoDirect(normalizedUrl: string): Promise<VideoInfo> {
  const response = await fetch(DIRECT_VIDEO_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "x-apihub-key": DIRECT_VIDEO_API_KEY,
      "x-apihub-host": DIRECT_VIDEO_API_HOST,
      "x-apihub-endpoint": DIRECT_VIDEO_API_ENDPOINT,
    },
    body: new URLSearchParams({ url: normalizedUrl }).toString(),
  });

  if (!response.ok) {
    throw new Error(await readApiError(response, `Request failed (${response.status})`));
  }

  const result = await response.json();
  const apiData = result?.success === true ? result.data : result;

  if (result?.success === false) {
    throw new Error(result?.error || result?.message || "Could not process this URL");
  }

  const formats = mapDownloaderFormats(apiData, normalizedUrl);
  if (formats.length === 0) {
    throw new Error("No downloadable formats were found for this URL.");
  }

  const info: VideoInfo = {
    title: apiData.title || "Video",
    thumbnail: apiData.thumbnail || "",
    duration: apiData.duration || "Unknown",
    formats: formats.map((f) => ({ ...f, source: apiData.source || "all-video-downloader" })),
    source: apiData.source || "all-video-downloader",
  };

  return info;
}

export async function fetchVideoInfo(url: string): Promise<VideoInfo> {
  const normalizedUrl = normalizeVideoUrl(url);
  if (USE_DIRECT_API) {
    return fetchVideoInfoDirect(normalizedUrl);
  }

  const response = await fetch(`${API_BASE}/api/video-info`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url: normalizedUrl }),
  });

  if (!response.ok) {
    throw new Error(await readApiError(response, `Request failed (${response.status})`));
  }

  const data = await response.json();

  if (!data?.success) {
    throw new Error(data?.error || "Could not process this URL");
  }

  const info = data.data as VideoInfo;
  if (info.source) {
    info.formats = info.formats.map((f) => ({ ...f, source: info.source }));
  }
  return info;
}

export function startBrowserDownload(format: VideoFormat, title: string) {
  const frameName = `download-frame-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const iframe = document.createElement("iframe");
  iframe.name = frameName;
  iframe.style.display = "none";
  document.body.appendChild(iframe);

  const form = document.createElement("form");
  form.method = "POST";
  form.action = `${API_BASE}/api/download`;
  form.target = frameName;
  form.style.display = "none";

  const fields: Record<string, string> = {
    url: format.url,
    format: format.format,
    title,
    quality: format.quality,
  };

  if (format.itag !== null && format.itag !== undefined) fields.itag = String(format.itag);
  if (format.audioItag !== null && format.audioItag !== undefined) fields.audioItag = String(format.audioItag);
  if (format.source) fields.source = format.source;
  if (format.pageUrl) fields.pageUrl = format.pageUrl;

  Object.entries(fields).forEach(([name, value]) => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = value;
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
  form.remove();

  window.setTimeout(() => {
    iframe.remove();
  }, 30000);
}

import express from "express";
import cors from "cors";

const app = express();
const PORT = Number(process.env.PORT || 3000);

const FRONTEND_URL = process.env.FRONTEND_URL || "";
app.use(cors({
  origin: FRONTEND_URL
    ? [FRONTEND_URL, /\.vercel\.app$/, /\.replit\.dev$/]
    : true,
  methods: ["GET", "POST"],
  credentials: false,
}));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: false, limit: "32kb" }));

const API_HUB_KEY = process.env.API_HUB_KEY || "9xkEKzmlRkVKTWQplEB86RfCsfj3ueLCwHoGH-Kpnw2Tm57mJI";
const API_HUB_HOST = process.env.API_HUB_HOST || "All-Video-Downloader.allthingsdev.co";
const API_HUB_ENDPOINT = process.env.API_HUB_ENDPOINT || "a67c4f7d-d1ec-4d63-a524-7cf81ce32fbe";
const API_HOSTNAME = process.env.API_HOSTNAME || "All-Video-Downloader.proxy-production.allthingsdev.co";
const API_PATH = process.env.API_PATH || "/all_media_downloader_v3/download";

const VIDEO_DOWNLOADER_KEY = process.env.VIDEO_DOWNLOADER_KEY || API_HUB_KEY;
const VIDEO_DOWNLOADER_HOST = process.env.VIDEO_DOWNLOADER_HOST || "Video-Downloader.allthingsdev.co";
const VIDEO_DOWNLOADER_ENDPOINT = process.env.VIDEO_DOWNLOADER_ENDPOINT || "61cd9229-ed75-4f09-84ed-5da30e4881be";
const VIDEO_DOWNLOADER_HOSTNAME = process.env.VIDEO_DOWNLOADER_HOSTNAME || "Video-Downloader.proxy-production.allthingsdev.co";
const VIDEO_DOWNLOADER_PATH = process.env.VIDEO_DOWNLOADER_PATH || "/youtube-video-downloader";

function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

async function fetchWithAllVideoDownloader(url: string) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(`https://${API_HOSTNAME}${API_PATH}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "x-apihub-key": API_HUB_KEY,
        "x-apihub-host": API_HUB_HOST,
        "x-apihub-endpoint": API_HUB_ENDPOINT,
      },
      body: new URLSearchParams({ url }).toString(),
      signal: controller.signal,
    });

    if (!response.ok) {
      const bodyText = await response.text().catch(() => null);
      let errorMessage = `All-Video-Downloader API error (${response.status})`;

      if (bodyText) {
        try {
          const parsed = JSON.parse(bodyText);
          if (parsed?.message) {
            errorMessage = `${errorMessage}: ${parsed.message}`;
            if (parsed?.data?.code) {
              errorMessage += ` (${parsed.data.code})`;
            }
          } else {
            errorMessage = `${errorMessage}: ${bodyText}`;
          }
        } catch {
          errorMessage = `${errorMessage}: ${bodyText}`;
        }
      }

      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
  } catch (err: any) {
    if (err.name === "AbortError") {
      throw new Error("Request to video API timed out. Please try again.");
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchWithVideoDownloader(url: string) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const encodedUrl = encodeURIComponent(url);
    const response = await fetch(`https://${VIDEO_DOWNLOADER_HOSTNAME}${VIDEO_DOWNLOADER_PATH}?url=${encodedUrl}`, {
      method: "GET",
      headers: {
        "x-apihub-key": VIDEO_DOWNLOADER_KEY,
        "x-apihub-host": VIDEO_DOWNLOADER_HOST,
        "x-apihub-endpoint": VIDEO_DOWNLOADER_ENDPOINT,
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      const bodyText = await response.text().catch(() => null);
      let errorMessage = `Video-Downloader API error (${response.status})`;
      if (bodyText) {
        errorMessage = `${errorMessage}: ${bodyText}`;
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (err: any) {
    if (err.name === "AbortError") {
      throw new Error("Request to video API timed out. Please try again.");
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchVideoInfo(url: string) {
  try {
    return await fetchWithAllVideoDownloader(url);
  } catch (primaryError: any) {
    console.warn("Primary All-Video-Downloader provider failed:", primaryError.message);

    try {
      return await fetchWithVideoDownloader(url);
    } catch (fallbackError: any) {
      throw new Error(`Primary provider failed: ${primaryError.message}; fallback provider failed: ${fallbackError.message}`);
    }
  }
}

function mapDownloaderFormats(data: any, pageUrl: string) {
  const formats: any[] = [];
  
  if (data.downloads && typeof data.downloads === "object") {
    Object.entries(data.downloads).forEach(([quality, url]: [string, any]) => {
      if (typeof url === "string") {
        formats.push({
          quality: quality || "Unknown",
          format: "mp4",
          size: null,
          url: url,
          hasAudio: true,
          videoOnly: false,
          pageUrl,
        });
      }
    });
  }

  if (data.audio && typeof data.audio === "string") {
    formats.push({
      quality: "MP3 Audio",
      format: "mp3",
      size: null,
      url: data.audio,
      hasAudio: true,
      videoOnly: false,
      pageUrl,
    });
  }

  return formats;
}

app.post("/api/video-info", async (req, res) => {
  const { url } = req.body as { url?: string };
  if (!url) {
    return res.status(400).json({ success: false, error: "URL is required" });
  }

  try {
    const apiData = await fetchVideoInfo(url);
    const formats = mapDownloaderFormats(apiData, url);

    if (formats.length === 0) {
      throw new Error("No downloadable formats were found for this URL.");
    }

    const responseData = {
      title: apiData.title || "Video",
      thumbnail: apiData.thumbnail || "",
      duration: apiData.duration || "Unknown",
      formats,
      source: "all-video-downloader",
    };

    res.json({ success: true, data: responseData });
  } catch (err: any) {
    console.error("Error in /api/video-info:", err.message);
    res.status(500).json({ success: false, error: err.message || "Failed to process the video URL." });
  }
});

app.post("/api/download", async (req, res) => {
  const { url, title, format } = req.body as { url: string; title: string; format: string };

  if (!url) {
    return res.status(400).json({ error: "Download URL is required" });
  }

  try {
    const safeTitle = (title || "video").replace(/[^a-zA-Z0-9 _-]/g, "").trim() || "video";
    const extension = format || "mp4";

    const fileRes = await fetch(url, { headers: { "User-Agent": "SnapClipper/1.0" } });
    if (!fileRes.ok || !fileRes.body) {
      throw new Error(`Failed to fetch source file (status: ${fileRes.status})`);
    }

    res.setHeader("Content-Disposition", `attachment; filename="${safeTitle}.${extension}"`);
    if (fileRes.headers.has("Content-Type")) {
      res.setHeader("Content-Type", fileRes.headers.get("Content-Type")!);
    }
    if (fileRes.headers.has("Content-Length")) {
      res.setHeader("Content-Length", fileRes.headers.get("Content-Length")!);
    }

    // @ts-ignore
    fileRes.body.pipe(res);

  } catch (err: any) {
    console.error("Download proxy error:", err.message);
    if (!res.headersSent) {
      res.status(500).json({ error: "Download failed. The link may have expired." });
    }
  }
});

export default app;

if (!process.env.VERCEL) {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

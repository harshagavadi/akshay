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

const VKR_API_KEY = process.env.VKR_API_KEY || "vkrdownloader";
const VKR_API_ENDPOINT = "https://vkrdownloader.org/api/v1/get_video_info";

function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

async function fetchWithVkr(url: string) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(VKR_API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": VKR_API_KEY,
      },
      body: JSON.stringify({ url }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `VKrDownloader API error (${response.status})`);
    }

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message || "Failed to get video info from VKrDownloader");
    }
    return data.data;
  } catch (err: any) {
    if (err.name === "AbortError") {
      throw new Error("Request to video API timed out. Please try again.");
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}

function mapVkrFormats(data: any, pageUrl: string) {
  const formats: any[] = [];
  if (Array.isArray(data.links)) {
    for (const link of data.links) {
      formats.push({
        quality: link.quality || "Unknown",
        format: (link.type || "mp4").toLowerCase(),
        size: link.size ? formatBytes(link.size) : null,
        url: link.url,
        hasAudio: !link.mute,
        videoOnly: !!link.mute,
        pageUrl,
      });
    }
  }

  if (data.audio_links && data.audio_links.mp3) {
    formats.push({
      quality: "MP3 Audio",
      format: "mp3",
      size: null,
      url: data.audio_links.mp3,
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
    const vkrData = await fetchWithVkr(url);
    const formats = mapVkrFormats(vkrData, url);

    if (formats.length === 0) {
      throw new Error("No downloadable formats were found for this URL.");
    }

    const responseData = {
      title: vkrData.title || "Video",
      thumbnail: vkrData.thumbnail || "",
      duration: vkrData.duration || "Unknown",
      formats,
      source: "vkrdownloader",
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

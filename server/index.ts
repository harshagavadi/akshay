import express from "express";
import cors from "cors";
import { PassThrough } from "stream";
import { spawn } from "child_process";
import { createReadStream } from "fs";
import { mkdtemp, readdir, rm, stat } from "fs/promises";
import os from "os";
import path from "path";
import { fileURLToPath } from "url";

let __dirname = process.cwd();
try { __dirname = path.dirname(fileURLToPath(import.meta.url)); } catch {}

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

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || "";
const VIDEO_INFO_CACHE_TTL = 5 * 60 * 1000;
const videoInfoCache = new Map<string, { expiresAt: number; data: any }>();

const isYouTube = (url: string) => /(?:youtube\.com|youtu\.be)/i.test(url);

/** Strip tracking/noise params that can confuse ytdl */
function cleanYouTubeUrl(url: string): string {
  try {
    const u = new URL(url);
    u.searchParams.delete("si");
    u.searchParams.delete("feature");
    u.searchParams.delete("pp");
    return u.toString();
  } catch {
    return url;
  }
}

const qualityOrder: Record<string, number> = {
  "4320p": 0, "2160p": 1, "4k": 1, "1440p": 2,
  "1080p": 3, "720p": 4, "480p": 5, "360p": 6, "240p": 7, "144p": 8,
};
function sortByQuality(a: { quality: string }, b: { quality: string }) {
  const qa = qualityOrder[(a.quality || "").toLowerCase()] ?? 99;
  const qb = qualityOrder[(b.quality || "").toLowerCase()] ?? 99;
  return qa - qb;
}
function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
function formatDuration(secs: number): string {
  if (!secs || isNaN(secs)) return "Unknown";
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  return h > 0
    ? `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
    : `${m}:${String(s).padStart(2, "0")}`;
}

function normalizeDuration(duration: unknown): string {
  if (typeof duration === "number") return formatDuration(Math.floor(duration));
  if (typeof duration === "string") {
    const parsed = Number(duration);
    return Number.isFinite(parsed) ? formatDuration(Math.floor(parsed)) : duration || "Unknown";
  }
  return "Unknown";
}

function getYouTubeUserMessage(error: unknown) {
  const message = error instanceof Error ? error.message : String(error || "");
  const normalized = message.toLowerCase();

  if (normalized.includes("video unavailable") || normalized.includes("private video") || normalized.includes("removed")) {
    return "This YouTube video is unavailable, private, or removed. Please try a different public video link.";
  }

  if (normalized.includes("sign in") || normalized.includes("age-restricted")) {
    return "This YouTube video requires sign-in or age verification, so it cannot be downloaded here.";
  }

  return "Could not process this YouTube URL. Please try a different public video link.";
}

async function sendResponseToClient(res: express.Response, fileRes: Response): Promise<void> {
  if (!fileRes.body) {
    throw new Error("Response has no body");
  }
  
  // For serverless environments, buffer the entire response
  const buffer = await fileRes.arrayBuffer();
  const data = Buffer.from(buffer);
  res.write(data);
  res.end();
}

function isAudioFormat(format?: string, quality?: string) {
  const normalizedFormat = (format || "").toLowerCase();
  const normalizedQuality = (quality || "").toLowerCase();
  return normalizedFormat === "mp3" || normalizedFormat === "m4a" || normalizedQuality.includes("audio");
}

function getRequestedHeight(quality?: string) {
  const match = (quality || "").match(/(\d{3,4})p/i);
  return match ? Number(match[1]) : null;
}

function buildYtDlpSelector(format?: string, quality?: string) {
  const height = getRequestedHeight(quality);
  const ext = (format || "mp4").toLowerCase();
  const heightFilter = height ? `[height<=${height}]` : "";

  if (ext === "webm") {
    return `bestvideo${heightFilter}[ext=webm]+bestaudio[ext=webm]/best${heightFilter}[ext=webm]/bestvideo${heightFilter}+bestaudio/best${heightFilter}/best`;
  }

  return `bestvideo${heightFilter}[ext=mp4]+bestaudio[ext=m4a]/best${heightFilter}[ext=mp4]/bestvideo${heightFilter}+bestaudio/best${heightFilter}/best`;
}

function buildYtDlpFallbackSelector(format?: string) {
  const ext = (format || "mp4").toLowerCase();
  if (ext === "webm") {
    return "bestvideo[ext=webm]+bestaudio[ext=webm]/best[ext=webm]/bestvideo+bestaudio/best";
  }
  return "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/bestvideo+bestaudio/best";
}

async function clearTempDir(tempDir: string) {
  const files = await readdir(tempDir).catch(() => []);
  await Promise.all(files.map((file) => rm(path.join(tempDir, file), { recursive: true, force: true })));
}

async function runYtDlp(args: string[]) {
  return new Promise<void>((resolve, reject) => {
    const child = spawn("yt-dlp", args, { stdio: ["ignore", "ignore", "pipe"] });
    let stderr = "";

    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(stderr.trim().slice(-500) || "Download failed"));
      }
    });
  });
}

async function runYtDlpJson(args: string[]) {
  return new Promise<any>((resolve, reject) => {
    const child = spawn("yt-dlp", args, { stdio: ["ignore", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });

    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    child.on("error", reject);
    child.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(stderr.trim().slice(-500) || "Could not read video details"));
        return;
      }

      try {
        resolve(JSON.parse(stdout));
      } catch {
        reject(new Error("Video details response was invalid"));
      }
    });
  });
}

async function fetchYouTubeViaYtDlp(pageUrl: string) {
  const data = await runYtDlpJson([
    "--dump-single-json",
    "--no-playlist",
    "--no-warnings",
    "--socket-timeout", "30",
    pageUrl,
  ]);

  const formats = Array.isArray(data.formats) ? data.formats : [];
  const videoMap = new Map<string, any>();

  for (const format of formats) {
    const height = Number(format.height || 0);
    const ext = String(format.ext || "").toLowerCase();
    const hasVideo = format.vcodec && format.vcodec !== "none";

    if (!height || !hasVideo || !["mp4", "webm"].includes(ext)) continue;

    const quality = `${height}p`;
    const existing = videoMap.get(quality);
    const bitrate = Number(format.tbr || format.vbr || format.filesize || format.filesize_approx || 0);

    if (!existing || bitrate > existing.bitrate) {
      videoMap.set(quality, {
        quality,
        format: ext,
        size: format.filesize || format.filesize_approx ? formatBytes(Number(format.filesize || format.filesize_approx)) : null,
        url: pageUrl,
        hasAudio: true,
        videoOnly: false,
        itag: null,
        audioItag: null,
        source: "youtube-ytdlp",
        pageUrl,
        bitrate,
      });
    }
  }

  const videoFormats = Array.from(videoMap.values())
    .map(({ bitrate, ...format }) => format)
    .sort(sortByQuality);

  const audioFormats = formats.filter((format: any) => {
    const acodec = String(format.acodec || "");
    const vcodec = String(format.vcodec || "");
    return acodec !== "none" && vcodec === "none";
  });

  if (audioFormats.length > 0 || videoFormats.length > 0) {
    videoFormats.push({
      quality: "MP3 Audio",
      format: "mp3",
      size: null,
      url: pageUrl,
      hasAudio: true,
      videoOnly: false,
      itag: null,
      audioItag: null,
      source: "youtube-ytdlp",
      pageUrl,
    });
  }

  if (videoFormats.length === 0) {
    throw new Error("No downloadable YouTube formats were found");
  }

  return {
    title: data.title || "Video",
    thumbnail: data.thumbnail || data.thumbnails?.slice(-1)[0]?.url || "",
    duration: normalizeDuration(data.duration),
    formats: videoFormats,
    source: "youtube-ytdlp",
  };
}

async function downloadWithYtDlp(options: {
  pageUrl: string;
  format: string;
  quality?: string;
  title: string;
  res: express.Response;
}) {
  const { pageUrl, format, quality, title, res } = options;
  const tempDir = await mkdtemp(path.join(os.tmpdir(), "snapclipper-"));
  const safe = (title || "video").replace(/[^a-zA-Z0-9 _-]/g, "").trim() || "video";
  const audio = isAudioFormat(format, quality);
  const outputTemplate = path.join(tempDir, "download.%(ext)s");
  const targetFormat = audio ? "mp3" : ((format || "mp4").toLowerCase() === "webm" ? "webm" : "mp4");
  const baseArgs = [
    "--no-playlist",
    "--no-warnings",
    "--socket-timeout", "30",
    "-o", outputTemplate,
  ];

  if (audio) {
    await runYtDlp([...baseArgs, "-x", "--audio-format", "mp3", "--audio-quality", "0", pageUrl]);
  } else {
    const selectors = [
      buildYtDlpSelector(format, quality),
      buildYtDlpFallbackSelector(format),
      "bestvideo+bestaudio/best",
    ];
    let lastError: Error | null = null;

    for (const selector of selectors) {
      try {
        await clearTempDir(tempDir);
        await runYtDlp([...baseArgs, "-f", selector, "--merge-output-format", targetFormat, pageUrl]);
        lastError = null;
        break;
      } catch (err) {
        lastError = err;
      }
    }

    if (lastError) throw lastError;
  }

  const files = (await readdir(tempDir)).filter((file) => !file.endsWith(".part") && !file.endsWith(".ytdl"));
  const downloadedFile = files[0];
  if (!downloadedFile) {
    throw new Error("Downloaded file was not created");
  }

  const filePath = path.join(tempDir, downloadedFile);
  const fileStats = await stat(filePath);
  const extension = path.extname(downloadedFile).replace(".", "") || targetFormat;
  const contentType = extension === "mp3"
    ? "audio/mpeg"
    : extension === "webm"
    ? "video/webm"
    : "video/mp4";

  res.setHeader("Content-Type", contentType);
  res.setHeader("Content-Length", String(fileStats.size));
  res.setHeader("Content-Disposition", `attachment; filename="${safe}.${extension}"`);

  await new Promise<void>((resolve, reject) => {
    const stream = createReadStream(filePath);
    stream.on("error", reject);
    res.on("finish", resolve);
    res.on("close", resolve);
    stream.pipe(res);
  });

  await rm(tempDir, { recursive: true, force: true });
}

// ── RapidAPI helper (used for non-YouTube AND as YouTube fallback) ────────────
async function fetchViaRapidAPI(url: string) {
  if (!RAPIDAPI_KEY) throw new Error("Video download API is not configured. Add RAPIDAPI_KEY to enable this platform.");
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch("https://social-download-all-in-one.p.rapidapi.com/v1/social/autolink", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-rapidapi-key": RAPIDAPI_KEY,
        "x-rapidapi-host": "social-download-all-in-one.p.rapidapi.com",
      },
      body: JSON.stringify({ url }),
      signal: controller.signal,
    });
    const data = await res.json() as any;
    if (!res.ok) throw new Error(data?.message || "RapidAPI error");
    return data;
  } catch (err: any) {
    if (err.name === "AbortError") throw new Error("RapidAPI request timed out. Please try again.");
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}

function buildRapidAPIFormats(data: any, pageUrl: string) {
  const medias: any[] = data.medias || [];
  const isAudioOnly = (m: any) => {
    const ext = (m.extension || "").toLowerCase();
    const q = (m.quality || "").toLowerCase();
    return ext === "mp3" || ext === "m4a" || q === "audio" || q === "mp3";
  };
  const audioMedias = medias.filter((m) => m.url && isAudioOnly(m));
  const videoMedias = medias.filter((m) => m.url && !isAudioOnly(m));
  const seen = new Set<string>();
  return [
    ...videoMedias.map((m: any) => ({
      quality: m.quality || "Video",
      format: (m.extension || "mp4").toLowerCase(),
      size: m.formattedSize || null,
      url: m.url,
      hasAudio: m.audioAvailable !== false,
      videoOnly: m.audioAvailable === false,
      itag: null, audioItag: null,
      pageUrl,
    })),
    ...audioMedias.map((m: any) => ({
      quality: "MP3 Audio",
      format: (m.extension || "mp3").toLowerCase(),
      size: m.formattedSize || null,
      url: m.url,
      hasAudio: true,
      videoOnly: false,
      itag: null, audioItag: null,
      pageUrl,
    })),
  ].filter((f) => {
    if (!f.url || seen.has(f.url)) return false;
    seen.add(f.url);
    return true;
  });
}

async function fetchSourceFile(downloadUrl: string) {
  const headerAttempts: HeadersInit[] = [
    {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
      "Accept": "video/webm,video/mp4,video/*,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9",
      "Referer": "https://www.youtube.com/",
      "Range": "bytes=0-",
    },
    {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
      "Accept": "*/*",
      "Accept-Language": "en-US,en;q=0.9",
      "Referer": "https://www.youtube.com/",
    },
    {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
      "Accept": "*/*",
    },
  ];

  let lastStatus = 0;
  for (const headers of headerAttempts) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    try {
      const response = await fetch(downloadUrl, { headers, redirect: "follow", signal: controller.signal });
      lastStatus = response.status;
      if (response.ok) return response;
    } catch (err: any) {
      if (err.name === "AbortError") throw new Error("Download request timed out. Please try again.");
      throw err;
    } finally {
      clearTimeout(timeout);
    }
  }

  throw new Error(`Source responded with ${lastStatus || "an error"}`);
}

async function refreshRapidDownloadUrl(pageUrl: string, quality?: string, format?: string) {
  const data = await fetchViaRapidAPI(pageUrl);
  const formats = buildRapidAPIFormats(data, pageUrl);
  const normalizedQuality = (quality || "").toLowerCase();
  const normalizedFormat = (format || "").toLowerCase();
  return formats.find((item: any) => {
    const itemQuality = (item.quality || "").toLowerCase();
    const itemFormat = (item.format || "").toLowerCase();
    return item.url && itemQuality === normalizedQuality && itemFormat === normalizedFormat;
  })?.url || formats.find((item: any) => item.url)?.url;
}

function sendCachedVideoInfo(res: express.Response, cacheKey: string, data: any) {
  videoInfoCache.set(cacheKey, {
    expiresAt: Date.now() + VIDEO_INFO_CACHE_TTL,
    data,
  });

  return res.json({
    success: true,
    data,
  });
}

// ── POST /api/video-info ─────────────────────────────────────────────────────
app.post("/api/video-info", async (req, res) => {
  const { url } = req.body as { url?: string };
  if (!url) return res.status(400).json({ success: false, error: "URL required" });

  const cacheKey = isYouTube(url) ? cleanYouTubeUrl(url) : url.trim();
  const cached = videoInfoCache.get(cacheKey);

  if (cached && cached.expiresAt > Date.now()) {
    return res.json({
      success: true,
      data: cached.data,
    });
  }

  if (cached) {
    videoInfoCache.delete(cacheKey);
  }

  // ── YouTube: try ytdl-core, fallback to RapidAPI ─────────────────────────
  if (isYouTube(url)) {
    const clean = cacheKey;
    let usedYtdl = false;
    let youtubeErrorMessage = "Could not process this YouTube URL. Please try a different public video link.";
    const isServerless = !!(process.env.NETLIFY || process.env.VERCEL || process.env.RENDER);

    if (!isServerless) try {
      const ytdl = (await import("@distube/ytdl-core")).default;
      const info = await ytdl.getInfo(clean);
      const details = info.videoDetails;

      // Deduplicate video formats by quality label, prefer highest bitrate
      const videoMap = ytdl
        .filterFormats(info.formats, "video")
        .filter((f) => f.qualityLabel && f.container === "mp4")
        .reduce<Map<string, (typeof info.formats)[number]>>((acc, f) => {
          const ex = acc.get(f.qualityLabel);
          if (!ex || (f.bitrate ?? 0) > (ex.bitrate ?? 0)) acc.set(f.qualityLabel, f);
          return acc;
        }, new Map());

      const audioFormats = ytdl.filterFormats(info.formats, "audioonly");
      const bestAudio = [...audioFormats].sort((a, b) => (b.audioBitrate ?? 0) - (a.audioBitrate ?? 0))[0];

      const formats: any[] = Array.from(videoMap.values())
        .map((f) => ({
          quality: f.qualityLabel,
          format: "mp4",
          size: f.contentLength ? formatBytes(Number(f.contentLength)) : null,
          url: clean,           // original video URL (ytdl will re-fetch with itag)
          hasAudio: true,       // we merge → always has audio
          videoOnly: false,
          itag: f.itag,
          audioItag: bestAudio?.itag ?? null,
          source: "youtube-ytdl",
          pageUrl: clean,
        }))
        .sort(sortByQuality);

      if (bestAudio) {
        formats.push({
          quality: "MP3 Audio",
          format: "mp3",
          size: null,
          url: clean,
          hasAudio: true,
          videoOnly: false,
          itag: bestAudio.itag,
          audioItag: null,
          source: "youtube-ytdl",
          pageUrl: clean,
        });
      }

      usedYtdl = true;
      return sendCachedVideoInfo(res, cacheKey, {
        title: details.title,
        thumbnail: details.thumbnails?.slice(-1)[0]?.url ?? "",
        duration: formatDuration(Number(details.lengthSeconds)),
        formats,
        source: "youtube-ytdl",
      });
    } catch (ytdlErr) {
      youtubeErrorMessage = getYouTubeUserMessage(ytdlErr);
      console.warn("ytdl-core failed, falling back to yt-dlp:", ytdlErr.message);
    }

    if (!isServerless) try {
      const data = await fetchYouTubeViaYtDlp(clean);
      return sendCachedVideoInfo(res, cacheKey, data);
    } catch (ytDlpErr) {
      youtubeErrorMessage = getYouTubeUserMessage(ytDlpErr);
      console.warn("yt-dlp metadata fallback failed, falling back to RapidAPI:", ytDlpErr.message);
    }

    // Fallback: RapidAPI for YouTube
    try {
      const data = await fetchViaRapidAPI(url);
      const formats = buildRapidAPIFormats(data, url);
      return sendCachedVideoInfo(res, cacheKey, {
        title: data.title || "Video",
        thumbnail: data.thumbnail || "",
        duration: data.duration || "Unknown",
        formats: formats.map((f) => ({ ...f, source: "youtube-rapid" })),
        source: "youtube-rapid",
      });
    } catch (rapidErr) {
      console.error("RapidAPI YouTube fallback also failed:", rapidErr.message);
      return res.status(500).json({ success: false, error: youtubeErrorMessage });
    }
  }

  // ── Other platforms: RapidAPI ─────────────────────────────────────────────
  try {
    const data = await fetchViaRapidAPI(url);
    const formats = buildRapidAPIFormats(data, url);
    return sendCachedVideoInfo(res, cacheKey, {
      title: data.title || "Video",
      thumbnail: data.thumbnail || "",
      duration: data.duration || "Unknown",
      formats: formats.map((f) => ({ ...f, source: "other" })),
      source: "other",
    });
  } catch (err) {
    console.error("video-info error:", err.message);
    return res.status(500).json({ success: false, error: err.message || "Failed to process URL" });
  }
});

// ── POST /api/download ────────────────────────────────────────────────────────
app.post("/api/download", async (req, res) => {
  const { url, format, title, itag, audioItag, source } = req.body as {
    url: string;
    format: string;
    title: string;
    itag?: number | null;
    audioItag?: number | null;
    source?: string;
    quality?: string;
    pageUrl?: string;
  };
  const { quality, pageUrl } = req.body as { quality?: string; pageUrl?: string };

  if (!url) return res.status(400).json({ error: "URL required" });

  const safe = (title || "video").replace(/[^a-zA-Z0-9 _-]/g, "").trim() || "video";

  const isServerlessDl = !!(process.env.NETLIFY || process.env.VERCEL || process.env.RENDER);
  let ytDlpFailed = false;
  if (!isServerlessDl && pageUrl && isYouTube(pageUrl)) {
    try {
      await downloadWithYtDlp({ pageUrl, format, quality, title, res });
      return;
    } catch (err) {
      console.warn("yt-dlp download failed, trying RapidAPI fallback:", err.message);
      if (res.headersSent) return;
      ytDlpFailed = true;
    }
  }
  if (isServerlessDl && pageUrl && isYouTube(pageUrl)) ytDlpFailed = true;

  // When yt-dlp is unavailable (e.g. Vercel), fall back to RapidAPI for YouTube
  if (ytDlpFailed && pageUrl && isYouTube(pageUrl)) {
    try {
      const rapidUrl = await refreshRapidDownloadUrl(pageUrl, quality, format);
      if (!rapidUrl) throw new Error("No download URL returned from RapidAPI");
      const fileRes = await fetchSourceFile(rapidUrl);
      const ct = fileRes.headers.get("content-type") || "application/octet-stream";
      const cl = fileRes.headers.get("content-length");
      res.setHeader("Content-Type", ct);
      res.setHeader("Content-Disposition", `attachment; filename="${safe}.${format}"`);
      if (cl) res.setHeader("Content-Length", cl);
      
      await sendResponseToClient(res, fileRes);
    } catch (err) {
      console.error("RapidAPI YouTube fallback error:", err.message);
      if (!res.headersSent) res.status(500).json({ error: "Download failed. Please try again or use a different quality." });
    }
    return;
  }

  // ── ytdl-core path: MP3 ──────────────────────────────────────────────────
  if (source === "youtube-ytdl" && format === "mp3" && itag) {
    res.setHeader("Content-Disposition", `attachment; filename="${safe}.mp3"`);
    res.setHeader("Content-Type", "audio/mpeg");
    const ytdl = (await import("@distube/ytdl-core")).default;
    const ffmpeg = (await import("fluent-ffmpeg")).default;
    const audioStream = ytdl(url, { quality: itag });
    const pass = new PassThrough();
    ffmpeg(audioStream)
      .audioBitrate(192)
      .format("mp3")
      .on("error", (err) => {
        console.error("ffmpeg MP3 error:", err.message);
        if (!res.headersSent) res.status(500).end();
      })
      .pipe(pass);
    pass.pipe(res);
    return;
  }

  // ── ytdl-core path: merged MP4 ───────────────────────────────────────────
  if (source === "youtube-ytdl" && itag) {
    res.setHeader("Content-Disposition", `attachment; filename="${safe}.mp4"`);
    res.setHeader("Content-Type", "video/mp4");
    try {
      const ytdl = (await import("@distube/ytdl-core")).default;
      const ffmpeg = (await import("fluent-ffmpeg")).default;
      const videoStream = ytdl(url, { quality: itag });
      const audioStream = ytdl(url, { quality: audioItag ?? "highestaudio" });
      const pass = new PassThrough();
      ffmpeg()
        .input(videoStream)
        .input(audioStream)
        .outputOptions(["-c:v copy", "-c:a aac", "-movflags frag_keyframe+empty_moov"])
        .format("mp4")
        .on("error", (err) => {
          console.error("ffmpeg merge error:", err.message);
          if (!res.headersSent) res.status(500).end();
        })
        .pipe(pass);
      pass.pipe(res);
    } catch (err) {
      console.error("ytdl stream error:", err.message);
      if (!res.headersSent) res.status(500).json({ error: "Stream failed" });
    }
    return;
  }

  // ── Straight proxy (RapidAPI sources / other platforms) ──────────────────
  try {
    let fileRes: Response;
    try {
      fileRes = await fetchSourceFile(url);
    } catch (initialError) {
      if (!pageUrl) throw initialError;
      const refreshedUrl = await refreshRapidDownloadUrl(pageUrl, quality, format);
      if (!refreshedUrl) throw initialError;
      fileRes = await fetchSourceFile(refreshedUrl);
    }

    const ct = fileRes.headers.get("content-type") || "application/octet-stream";
    const cl = fileRes.headers.get("content-length");
    res.setHeader("Content-Type", ct);
    res.setHeader("Content-Disposition", `attachment; filename="${safe}.${format}"`);
    if (cl) res.setHeader("Content-Length", cl);

    await sendResponseToClient(res, fileRes);
  } catch (err) {
    console.error("proxy download error:", err.message);
    if (!res.headersSent) res.status(500).json({ error: "Download failed" });
  }
});

export default app;

if (!process.env.VERCEL) {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

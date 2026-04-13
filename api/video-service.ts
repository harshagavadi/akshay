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

export async function parseRequestBody(req: any) {
  if (req.body) {
    return req.body;
  }

  const chunks: Uint8Array[] = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }

  const rawBody = Buffer.concat(chunks).toString("utf-8");
  const contentType = (req.headers?.["content-type"] as string | undefined)?.split(";")[0] || "";

  if (contentType === "application/json") {
    return rawBody ? JSON.parse(rawBody) : {};
  }

  if (contentType === "application/x-www-form-urlencoded") {
    return Object.fromEntries(new URLSearchParams(rawBody));
  }

  if (rawBody.startsWith("{") || rawBody.startsWith("[")) {
    return JSON.parse(rawBody);
  }

  return {};
}

export async function fetchWithAllVideoDownloader(url: string) {
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

    return await response.json();
  } catch (err: any) {
    if (err?.name === "AbortError") {
      throw new Error("Request to video API timed out. Please try again.");
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}

export async function fetchWithVideoDownloader(url: string) {
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
    if (err?.name === "AbortError") {
      throw new Error("Request to video API timed out. Please try again.");
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}

export async function fetchWithRapidAPI(url: string) {
  // Extract videoId from URL
  const normalizedUrl = url.replace(/https?:\/\//, '').replace('youtu.be/', 'youtube.com/watch?v=');
  const videoIdMatch = normalizedUrl.match(/[?&]v=([^&]+)/);
  if (!videoIdMatch) {
    throw new Error('Invalid YouTube URL');
  }
  const videoId = videoIdMatch[1];

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    // First get details
    const detailsResponse = await fetch(`https://social-media-video-downloader.p.rapidapi.com/youtube/v3/video/details?videoId=${videoId}&urlAccess=normal&renderableFormats=720p%2Chighres&getTranscript=false`, {
      method: "GET",
      headers: {
        "x-rapidapi-key": "7116477c1cmsh7187980119cbe4fp1300d3jsn306d9242c7a8",
        "x-rapidapi-host": "social-media-video-downloader.p.rapidapi.com",
        "Content-Type": "application/json",
      },
      signal: controller.signal,
    });

    if (!detailsResponse.ok) {
      throw new Error(`RapidAPI details error (${detailsResponse.status})`);
    }

    const details = await detailsResponse.json();
    if (!details || !details.title) {
      throw new Error('RapidAPI details error: Invalid response');
    }

    // Then get download URL
    const downloadResponse = await fetch(`https://social-media-video-downloader.p.rapidapi.com/youtube/v3/download?videoId=${videoId}&format=mp4&quality=720p`, {
      method: "GET",
      headers: {
        "x-rapidapi-key": "7116477c1cmsh7187980119cbe4fp1300d3jsn306d9242c7a8",
        "x-rapidapi-host": "social-media-video-downloader.p.rapidapi.com",
        "Content-Type": "application/json",
      },
      signal: controller.signal,
    });

    if (!downloadResponse.ok) {
      throw new Error(`RapidAPI download error (${downloadResponse.status})`);
    }

    const downloadData = await downloadResponse.json();
    if (!downloadData || !downloadData.downloadUrl) {
      throw new Error('RapidAPI download error: No download URL');
    }

    // Transform to expected format
    return {
      title: details.title || "Video",
      thumbnail: details.thumbnail || "",
      duration: details.duration || "Unknown",
      downloads: {
        "720p": downloadData.downloadUrl,
      },
    };
  } catch (err: any) {
    if (err?.name === "AbortError") {
      throw new Error("Request to video API timed out. Please try again.");
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}

export async function fetchVideoInfo(url: string) {
  try {
    return await fetchWithAllVideoDownloader(url);
  } catch (primaryError: any) {
    console.warn("Primary All-Video-Downloader provider failed:", primaryError?.message);

    try {
      return await fetchWithVideoDownloader(url);
    } catch (fallbackError: any) {
      console.warn("Secondary Video-Downloader provider failed:", fallbackError?.message);

      try {
        return await fetchWithRapidAPI(url);
      } catch (tertiaryError: any) {
        throw new Error(`All providers failed: Primary (${primaryError?.message}), Secondary (${fallbackError?.message}), Tertiary (${tertiaryError?.message})`);
      }
    }
  }
}

export function mapDownloaderFormats(data: any, pageUrl: string) {
  const formats: any[] = [];

  // Handle Y2Mate format (formats.mp4 and formats.mp3)
  if (data.formats && typeof data.formats === "object") {
    if (data.formats.mp4 && typeof data.formats.mp4 === "object") {
      Object.entries(data.formats.mp4).forEach(([quality, info]: [string, any]) => {
        if (info && info.url) {
          formats.push({
            quality: quality,
            format: "mp4",
            size: info.size || null,
            url: info.url,
            hasAudio: true,
            videoOnly: false,
            pageUrl,
          });
        }
      });
    }
    if (data.formats.mp3 && typeof data.formats.mp3 === "object") {
      Object.entries(data.formats.mp3).forEach(([quality, info]: [string, any]) => {
        if (info && info.url) {
          formats.push({
            quality: quality,
            format: "mp3",
            size: info.size || null,
            url: info.url,
            hasAudio: true,
            videoOnly: false,
            pageUrl,
          });
        }
      });
    }
  }

  // Handle SaveMP3 format (array of formats)
  if (data.formats && Array.isArray(data.formats)) {
    data.formats.forEach((fmt: any) => {
      if (fmt.url) {
        formats.push({
          quality: fmt.quality || "Unknown",
          format: fmt.format || "mp4",
          size: fmt.size || null,
          url: fmt.url,
          hasAudio: !fmt.videoOnly,
          videoOnly: fmt.videoOnly || false,
          pageUrl,
        });
      }
    });
  }

  // Handle downloads object (existing APIs)
  if (data.downloads && typeof data.downloads === "object") {
    Object.entries(data.downloads).forEach(([quality, url]: [string, any]) => {
      if (typeof url === "string") {
        formats.push({
          quality: quality || "Unknown",
          format: "mp4",
          size: null,
          url,
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

export async function proxyDownload(res: any, url: string, title: string, format: string) {
  const safeTitle = (title || "video").replace(/[^a-zA-Z0-9 _-]/g, "").trim() || "video";
  const extension = format || "mp4";

  const fileRes = await fetch(url, { headers: { "User-Agent": "SnapClipper/1.0" } });
  if (!fileRes.ok) {
    throw new Error(`Failed to fetch source file (status: ${fileRes.status})`);
  }

  res.setHeader("Content-Disposition", `attachment; filename="${safeTitle}.${extension}"`);
  const contentType = fileRes.headers.get("Content-Type");
  if (contentType) {
    res.setHeader("Content-Type", contentType);
  }

  const length = fileRes.headers.get("Content-Length");
  if (length) {
    res.setHeader("Content-Length", length);
  }

  const body = fileRes.body as any;
  if (body && typeof body.pipe === "function") {
    body.pipe(res);
    return;
  }

  const arrayBuffer = await fileRes.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  if (!res.headersSent) {
    res.setHeader("Content-Length", String(buffer.length));
  }
  res.end(buffer);
}

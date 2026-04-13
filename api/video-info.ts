import { fetchVideoInfo, mapDownloaderFormats, parseRequestBody } from "../server/video-service";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  const body = await parseRequestBody(req);
  const url = String(body?.url || "").trim();
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

    res.status(200).json({ success: true, data: responseData });
  } catch (err: any) {
    console.error("Error in /api/video-info:", err?.message);
    res.status(500).json({ success: false, error: err?.message || "Failed to process the video URL." });
  }
}

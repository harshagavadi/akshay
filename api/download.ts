import { parseRequestBody, proxyDownload } from "./video-service";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const body = await parseRequestBody(req);
  const url = String(body?.url || "").trim();
  const title = String(body?.title || "").trim();
  const format = String(body?.format || "").trim();

  if (!url) {
    return res.status(400).json({ error: "Download URL is required" });
  }

  try {
    await proxyDownload(res, url, title, format);
  } catch (err: any) {
    console.error("Download proxy error:", err?.message);
    if (!res.headersSent) {
      res.status(500).json({ error: "Download failed. The link may have expired." });
    }
  }
}

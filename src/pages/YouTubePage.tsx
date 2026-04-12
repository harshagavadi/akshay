import { Helmet } from "react-helmet-async";
import PlatformPage from "@/components/PlatformPage";

const youtubeData = {
  name: "YouTube",
  slug: "youtube",
  icon: "▶",
  color: "hsl(0, 72%, 51%)",
  heroTitle: "Download YouTube Videos",
  heroHighlight: "In HD & 4K Quality",
  description: "Save any YouTube video, short, or playlist in MP4, MP3, or WEBM format. Fast, free, and unlimited.",
  metaDescription: "Free YouTube video downloader. Download YouTube videos in HD, 4K, MP4, MP3. No signup, no limits. Works on desktop and mobile.",
  features: [
    "Download YouTube videos in 4K, 1080p, 720p, 480p, 360p",
    "Extract audio as MP3 at 128kbps, 192kbps, or 320kbps",
    "Download YouTube Shorts in full quality",
    "Save entire playlists and channels",
    "No watermarks on downloaded videos",
    "Works with age-restricted videos",
  ],
  formats: ["MP4", "MP3", "WEBM", "720p", "1080p", "4K"],
  faqs: [
    { question: "Can I download YouTube videos in 4K?", answer: "Yes! SnapClipper supports downloading YouTube videos in up to 4K Ultra HD resolution when available on the original video." },
    { question: "How do I download YouTube Shorts?", answer: "Simply copy the YouTube Shorts URL and paste it into the download box. SnapClipper automatically detects Shorts and provides the best quality options." },
    { question: "Can I convert YouTube videos to MP3?", answer: "Absolutely. SnapClipper lets you extract audio from any YouTube video and download it as an MP3 file in various bitrates." },
    { question: "Is downloading YouTube videos legal?", answer: "Downloading videos for personal offline viewing is generally acceptable. However, re-uploading or distributing copyrighted content without permission is not allowed." },
    { question: "Do I need a YouTube account to download?", answer: "No. You don't need any account. Just paste the video URL and download instantly." },
  ],
  howTo: [
    { step: "1", title: "Copy URL", desc: "Open YouTube and copy the video URL from the address bar or share button" },
    { step: "2", title: "Paste & Select", desc: "Paste the URL above and choose your preferred format and quality" },
    { step: "3", title: "Download", desc: "Click download and the video will be saved to your device instantly" },
  ],
  guide: {
    title: "The Complete Guide to Downloading YouTube Videos",
    sections: [
      {
        heading: "Why Download YouTube Videos?",
        text: "YouTube is the world's largest video platform with over 800 million videos. Whether you're a student saving lectures for offline study, a traveler preparing entertainment for a long flight, or someone who wants to keep a tutorial handy without buffering, downloading YouTube videos gives you freedom from internet connectivity. SnapClipper makes this process simple, fast, and completely free.",
      },
      {
        heading: "Understanding YouTube Video Quality",
        text: "YouTube videos are available in multiple resolutions: 360p (basic), 480p (standard definition), 720p (HD), 1080p (Full HD), 1440p (2K), and 2160p (4K Ultra HD). Higher resolutions mean sharper images but larger file sizes. For mobile viewing, 720p offers a great balance. For laptop or TV viewing, 1080p or 4K delivers the best experience. SnapClipper lets you choose the exact quality you need.",
      },
      {
        heading: "YouTube Shorts Downloads",
        text: "YouTube Shorts are vertical videos under 60 seconds, similar to TikTok and Instagram Reels. SnapClipper fully supports Shorts — just copy the Shorts URL (youtube.com/shorts/...) and paste it in. You'll get the same quality options as regular videos. Shorts are perfect for saving trending content, funny clips, and quick tutorials for offline viewing.",
      },
      {
        heading: "Audio Extraction: YouTube to MP3",
        text: "One of the most popular features is extracting audio from YouTube videos. This is ideal for saving music performances, podcast episodes uploaded to YouTube, motivational speeches, ASMR content, and educational lectures. SnapClipper offers MP3 output at 128kbps, 192kbps, and 320kbps bitrates. Choose 192kbps for a good balance of quality and file size, or 320kbps for audiophile-grade quality.",
      },
      {
        heading: "Supported YouTube Content Types",
        text: "SnapClipper works with virtually all YouTube content: regular videos, Shorts, music videos, live stream replays, playlists, and age-restricted content. Whether it's a 30-second clip or a 4-hour documentary, simply paste the URL and our system handles the rest. We also support regional YouTube content and videos with subtitles.",
      },
      {
        heading: "Legal Considerations",
        text: "Downloading YouTube videos for personal, offline viewing is generally considered acceptable use. However, re-uploading, redistributing, or monetizing downloaded content without the creator's permission is a copyright violation. Always respect content creators by supporting their channels through subscriptions, likes, and shares. If you enjoy a creator's work, consider purchasing their merchandise or joining their membership programs.",
      },
    ],
  },
};

const YouTubePage = () => (
  <>
    <Helmet>
      <title>YouTube Video Downloader — Download HD MP4 MP3 | SnapClipper</title>
      <meta name="description" content={youtubeData.metaDescription} />
      <link rel="canonical" href="https://www.snapclipper.com/youtube" />
      <meta property="og:title" content="YouTube Video Downloader — SnapClipper" />
      <meta property="og:description" content={youtubeData.metaDescription} />
      <script type="application/ld+json">{JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": youtubeData.faqs.map(f => ({
          "@type": "Question", "name": f.question,
          "acceptedAnswer": { "@type": "Answer", "text": f.answer }
        }))
      })}</script>
    </Helmet>
    <PlatformPage platform={youtubeData} />
  </>
);

export default YouTubePage;

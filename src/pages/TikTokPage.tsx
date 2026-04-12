import { Helmet } from "react-helmet-async";
import PlatformPage from "@/components/PlatformPage";

const tiktokData = {
  name: "TikTok",
  slug: "tiktok",
  icon: "♪",
  color: "hsl(300, 60%, 50%)",
  heroTitle: "Download TikTok Videos",
  heroHighlight: "Without Watermark",
  description: "Save TikTok videos, slideshows, and sounds in HD quality — no watermark, no app needed.",
  metaDescription: "Free TikTok video downloader without watermark. Download TikTok videos in HD MP4. No signup required. Works on all devices.",
  features: [
    "Download TikTok videos without watermark",
    "Save TikTok slideshows as video or images",
    "Extract TikTok sounds and music as MP3",
    "Download private TikTok videos (with link)",
    "HD quality up to 1080p resolution",
    "Batch download from TikTok profiles",
  ],
  formats: ["MP4", "MP3", "HD", "No Watermark"],
  faqs: [
    { question: "Can I download TikTok videos without watermark?", answer: "Yes! SnapClipper removes the TikTok watermark automatically so you get a clean video file." },
    { question: "How do I download TikTok sounds?", answer: "Paste the TikTok video URL and select the MP3 format option to extract just the audio/sound." },
    { question: "Can I download TikTok slideshows?", answer: "Yes, SnapClipper supports TikTok slideshows. You can download them as a video or save individual images." },
    { question: "Does it work with private TikTok videos?", answer: "If you have the direct link to a private TikTok video, SnapClipper can process it. You'll need the full URL from the share option." },
    { question: "Is there a limit on TikTok downloads?", answer: "No limits at all. Download as many TikTok videos as you want, completely free." },
  ],
  howTo: [
    { step: "1", title: "Copy Link", desc: "Open TikTok, tap Share on any video, and copy the link" },
    { step: "2", title: "Paste URL", desc: "Paste the TikTok link above and choose format" },
    { step: "3", title: "Save", desc: "Click download to save the video without watermark" },
  ],
  guide: {
    title: "Everything You Need to Know About Downloading TikTok Videos",
    sections: [
      {
        heading: "Why Download TikTok Videos?",
        text: "TikTok has become one of the most influential social media platforms with over a billion active users creating and sharing short-form videos daily. From dance trends and comedy sketches to educational content and cooking tutorials, TikTok is a treasure trove of creative content. Downloading allows you to save favorites for offline viewing, create compilations for personal use, or archive content before it's deleted by creators.",
      },
      {
        heading: "Watermark-Free Downloads Explained",
        text: "When you save a TikTok video using the app's built-in save feature, it comes with a watermark showing the creator's username and TikTok logo. SnapClipper processes the original video source to provide a clean, watermark-free version when available. This is ideal for personal offline viewing, creating presentations, or saving your own content without branding. Always credit original creators if sharing their work.",
      },
      {
        heading: "TikTok Slideshows and Photo Carousels",
        text: "TikTok's slideshow feature lets creators combine photos with music into engaging content. SnapClipper supports downloading these slideshows as video files, preserving the transitions and audio. You can also extract the audio separately as an MP3 if you only want the background music or sound effect used in the slideshow.",
      },
      {
        heading: "TikTok Sound and Music Extraction",
        text: "TikTok is famous for its viral sounds and music. With SnapClipper, you can extract the audio from any TikTok video as an MP3 file. This is perfect for saving trending sounds, music discovery, or keeping audio from educational content. Simply paste the TikTok URL and select the MP3 format option.",
      },
      {
        heading: "Quality and Format Options",
        text: "TikTok videos are typically available in HD quality up to 1080p. SnapClipper preserves the original quality, ensuring you get the best possible video. Downloaded files are in universal MP4 format, compatible with every device and media player. For audio-only downloads, MP3 format is supported at various quality levels.",
      },
    ],
  },
};

const TikTokPage = () => (
  <>
    <Helmet>
      <title>TikTok Video Downloader — No Watermark HD | SnapClipper</title>
      <meta name="description" content={tiktokData.metaDescription} />
      <link rel="canonical" href="https://www.snapclipper.com/tiktok" />
      <meta property="og:title" content="TikTok Downloader Without Watermark — SnapClipper" />
      <meta property="og:description" content={tiktokData.metaDescription} />
      <script type="application/ld+json">{JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": tiktokData.faqs.map(f => ({
          "@type": "Question", "name": f.question,
          "acceptedAnswer": { "@type": "Answer", "text": f.answer }
        }))
      })}</script>
    </Helmet>
    <PlatformPage platform={tiktokData} />
  </>
);

export default TikTokPage;

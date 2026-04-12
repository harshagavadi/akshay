import { Helmet } from "react-helmet-async";
import PlatformPage from "@/components/PlatformPage";

const facebookData = {
  name: "Facebook",
  slug: "facebook",
  icon: "f",
  color: "hsl(220, 46%, 48%)",
  heroTitle: "Download Facebook Videos",
  heroHighlight: "Reels, Stories & Live",
  description: "Save Facebook videos, Reels, Stories, and Live replays in HD MP4 format. Free, fast, no login required.",
  metaDescription: "Free Facebook video downloader. Download Facebook videos, Reels, Stories in HD MP4. No signup, no limits. Works on desktop and mobile.",
  features: [
    "Download public Facebook videos in HD quality",
    "Save Facebook Reels without watermark",
    "Download Facebook Stories before they expire",
    "Save Facebook Live replays in full quality",
    "Extract audio from Facebook videos as MP3",
    "Download videos from Facebook Pages and Groups",
  ],
  formats: ["MP4", "MP3", "HD", "1080p"],
  faqs: [
    { question: "Can I download Facebook videos for free?", answer: "Yes! SnapClipper lets you download Facebook videos completely free with no account required. Just paste the video URL and click download." },
    { question: "How do I download Facebook Reels?", answer: "Open the Facebook Reel, tap the share button, copy the link, and paste it into SnapClipper. You'll get download options in HD MP4 format." },
    { question: "Can I download private Facebook videos?", answer: "SnapClipper can only download publicly accessible Facebook videos. Private videos (Friends Only) cannot be accessed by external tools." },
    { question: "What quality options are available for Facebook videos?", answer: "We offer SD (360p, 480p) and HD (720p, 1080p) options depending on the original video quality uploaded to Facebook." },
    { question: "Can I download Facebook Live videos?", answer: "Yes, once a Facebook Live broadcast has ended and is saved as a replay, you can download it using SnapClipper by copying the video URL." },
  ],
  howTo: [
    { step: "1", title: "Copy Link", desc: "Open Facebook, find the video, and copy its URL from the address bar or share menu" },
    { step: "2", title: "Paste URL", desc: "Paste the Facebook video link above and select your preferred format" },
    { step: "3", title: "Download", desc: "Click download and save the video in HD quality to your device" },
  ],
  guide: {
    title: "The Complete Guide to Downloading Facebook Videos",
    sections: [
      {
        heading: "Why Download Facebook Videos?",
        text: "Facebook is home to billions of video views daily — from family memories and cooking tutorials to news clips and viral entertainment. Unlike some platforms, Facebook doesn't offer a built-in offline download option for most content. SnapClipper bridges this gap by letting you save any public Facebook video to your device for offline viewing anytime, anywhere."
      },
      {
        heading: "Types of Facebook Video Content",
        text: "Facebook supports several video formats: standard feed videos (up to 240 minutes), Facebook Reels (short-form vertical videos), Facebook Stories (24-hour temporary content), Facebook Live replays, and videos shared in Groups and on Pages. Each type can be downloaded using SnapClipper as long as the content is publicly accessible."
      },
      {
        heading: "Getting the Best Quality",
        text: "Facebook compresses all uploaded videos, so download quality depends on what the uploader originally shared. For the best results, always select the highest available quality option. HD (720p or 1080p) provides excellent clarity for watching on phones, tablets, or laptops. If you only need the audio — for example, from a music performance or podcast — choose the MP3 format option for a much smaller file."
      },
      {
        heading: "Tips for Finding Facebook Video URLs",
        text: "On desktop, the easiest way is to right-click the video and select 'Show video URL' or copy it from your browser's address bar while the video is playing. On mobile, tap the three-dot menu on the video post and select 'Copy link.' For Reels, use the Share button and tap 'Copy link.' Make sure the URL starts with facebook.com or fb.watch for best compatibility."
      },
      {
        heading: "Legal and Ethical Considerations",
        text: "Always respect content creators' rights. Downloading public videos for personal offline viewing is generally acceptable, but re-uploading, redistributing, or monetizing downloaded content without permission is a violation of copyright law. If you want to share someone's video, use Facebook's native share feature to give proper credit."
      },
    ],
  },
};

const FacebookPage = () => (
  <>
    <Helmet>
      <title>Facebook Video Downloader — Reels, Stories, HD MP4 | SnapClipper</title>
      <meta name="description" content={facebookData.metaDescription} />
      <link rel="canonical" href="https://www.snapclipper.com/facebook" />
      <meta property="og:title" content="Facebook Video Downloader — SnapClipper" />
      <meta property="og:description" content={facebookData.metaDescription} />
      <script type="application/ld+json">{JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": facebookData.faqs.map(f => ({
          "@type": "Question", "name": f.question,
          "acceptedAnswer": { "@type": "Answer", "text": f.answer }
        }))
      })}</script>
    </Helmet>
    <PlatformPage platform={facebookData} />
  </>
);

export default FacebookPage;

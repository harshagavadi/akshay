import { Helmet } from "react-helmet-async";
import PlatformPage from "@/components/PlatformPage";

const instagramData = {
  name: "Instagram",
  slug: "instagram",
  icon: "◎",
  color: "hsl(330, 70%, 50%)",
  heroTitle: "Download Instagram Videos",
  heroHighlight: "Reels, Stories & IGTV",
  description: "Save Instagram Reels, Stories, IGTV, and posts in high quality. Works with public and private profiles.",
  metaDescription: "Free Instagram video downloader. Download Reels, Stories, IGTV in HD MP4. Save Instagram photos. No login required.",
  features: [
    "Download Instagram Reels in full HD quality",
    "Save Instagram Stories before they expire",
    "Download IGTV videos in original quality",
    "Save photos and carousel posts",
    "Download Instagram profile pictures in full size",
    "Works with public Instagram content",
  ],
  formats: ["MP4", "JPG", "HD", "1080p"],
  faqs: [
    { question: "Can I download Instagram Reels?", answer: "Yes! Simply paste the Reel URL and SnapClipper will provide download options in HD MP4 format." },
    { question: "How do I download Instagram Stories?", answer: "Copy the Story link (use the share option) and paste it into SnapClipper. You can save Stories before they disappear after 24 hours." },
    { question: "Can I download from private Instagram accounts?", answer: "SnapClipper can only download content from public Instagram profiles. For private accounts, you need to be following them and use the direct link." },
    { question: "Does SnapClipper download Instagram photos too?", answer: "Yes, you can download individual photos and entire carousel posts in full resolution." },
    { question: "Can I download Instagram profile pictures?", answer: "Yes! Paste the profile URL and SnapClipper will let you download the profile picture in full HD resolution." },
  ],
  howTo: [
    { step: "1", title: "Get Link", desc: "Open Instagram, tap the three dots on any post and copy the link" },
    { step: "2", title: "Paste URL", desc: "Paste the Instagram link above and select your format" },
    { step: "3", title: "Download", desc: "Click download and save Reels, Stories, or photos instantly" },
  ],
  guide: {
    title: "The Complete Guide to Downloading Instagram Content",
    sections: [
      {
        heading: "Why Download Instagram Content?",
        text: "Instagram is a visual-first platform where millions of photos, Reels, Stories, and IGTV videos are shared every day. Unlike some platforms, Instagram doesn't provide a built-in option to save content to your device for offline access. SnapClipper fills this gap, letting you save public Instagram content in original quality for personal offline viewing.",
      },
      {
        heading: "Downloading Instagram Reels",
        text: "Instagram Reels are short-form vertical videos up to 90 seconds long, similar to TikTok. They're a major part of Instagram's content ecosystem and often feature music, effects, and creative editing. To download a Reel, open it in the Instagram app, tap the three-dot menu or Share button, select 'Copy link,' and paste it into SnapClipper. You'll get HD MP4 download options within seconds.",
      },
      {
        heading: "Saving Instagram Stories Before They Disappear",
        text: "Instagram Stories last only 24 hours before disappearing. If someone shares a recipe, workout tip, or travel recommendation in their Story and you want to save it, SnapClipper can help. Copy the Story link using the Share option and paste it into our tool. Note that this only works with public profiles — Stories from private accounts require you to be following that user.",
      },
      {
        heading: "Photos and Carousel Posts",
        text: "Beyond video content, SnapClipper also supports downloading Instagram photos and carousel posts (multi-image posts) in full resolution. This is great for saving high-quality images from photographers, artists, and travel accounts. Simply paste the post URL and select the image download option.",
      },
      {
        heading: "Privacy and Public vs. Private Content",
        text: "SnapClipper can only access and download content from public Instagram profiles. Content from private accounts is protected and cannot be accessed by external tools. If you want to save content from a private account, you'll need to be an approved follower and use Instagram's native save feature. Always respect creators' privacy settings and content ownership.",
      },
    ],
  },
};

const InstagramPage = () => (
  <>
    <Helmet>
      <title>Instagram Downloader — Reels, Stories, IGTV HD | SnapClipper</title>
      <meta name="description" content={instagramData.metaDescription} />
      <link rel="canonical" href="https://www.snapclipper.com/instagram" />
      <meta property="og:title" content="Instagram Video Downloader — SnapClipper" />
      <meta property="og:description" content={instagramData.metaDescription} />
      <script type="application/ld+json">{JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": instagramData.faqs.map(f => ({
          "@type": "Question", "name": f.question,
          "acceptedAnswer": { "@type": "Answer", "text": f.answer }
        }))
      })}</script>
    </Helmet>
    <PlatformPage platform={instagramData} />
  </>
);

export default InstagramPage;

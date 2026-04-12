import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { CheckCircle, ExternalLink } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import {
  YouTubeIcon, TikTokIcon, InstagramIcon, FacebookIcon,
  TwitterXIcon, VimeoIcon, RedditIcon, PinterestIcon,
  TwitchIcon, SoundCloudIcon, TumblrIcon, DailymotionIcon,
} from "@/components/SocialIcons";
import { ComponentType } from "react";

interface Platform {
  name: string;
  url: string | null;
  description: string;
  formats: string[];
  notes: string;
  color: string;
  icon: ComponentType<{ className?: string; style?: React.CSSProperties }>;
}

const platforms: Platform[] = [
  {
    name: "YouTube", url: "/youtube", color: "hsl(0,72%,51%)", icon: YouTubeIcon,
    description: "The world's largest video platform. Download YouTube videos, Shorts, Music videos, and live stream replays in any quality from 360p up to 4K Ultra HD. Extract audio as MP3 for music, podcasts, and lectures. Supports standard videos, YouTube Shorts, playlists, and age-restricted content.",
    formats: ["MP4", "MP3", "WEBM", "360p–4K"],
    notes: "Supports Shorts, playlists, live replays, and age-restricted content",
  },
  {
    name: "TikTok", url: "/tiktok", color: "hsl(300,60%,50%)", icon: TikTokIcon,
    description: "Download TikTok videos without the watermark overlay in HD quality. Save TikTok slideshows, extract trending sounds as MP3, and preserve content before creators delete it. Works with both short videos and longer TikTok content.",
    formats: ["MP4", "MP3", "HD 1080p", "No watermark"],
    notes: "Supports regular videos, slideshows, and sound extraction",
  },
  {
    name: "Instagram", url: "/instagram", color: "hsl(330,70%,50%)", icon: InstagramIcon,
    description: "Save Instagram Reels, Stories (before they expire after 24 hours), IGTV videos, feed videos, and carousel posts. Works with public Instagram profiles. Download content in the same quality it was originally uploaded.",
    formats: ["MP4", "JPG", "HD", "1080p"],
    notes: "Supports Reels, Stories, IGTV, carousels, and profile photos",
  },
  {
    name: "Facebook", url: "/facebook", color: "hsl(220,46%,48%)", icon: FacebookIcon,
    description: "Download public Facebook videos, Facebook Reels, Stories, and Live replays. Supports videos from personal profiles, Pages, and Groups as long as they are publicly accessible. Extract audio from Facebook videos as MP3.",
    formats: ["MP4", "MP3", "HD", "1080p"],
    notes: "Supports public videos, Reels, Stories, and Live replays",
  },
  {
    name: "Twitter / X", url: "/twitter", color: "hsl(210,10%,15%)", icon: TwitterXIcon,
    description: "Download videos and GIFs from any public tweet on X (formerly Twitter). Twitter GIFs download as seamlessly looping MP4 files. Supports Standard and Premium account content, and Twitter Spaces recordings when available.",
    formats: ["MP4", "MP3", "GIF→MP4", "HD"],
    notes: "Supports native videos, GIFs, and Spaces recordings",
  },
  {
    name: "Vimeo", url: null, color: "hsl(195,80%,44%)", icon: VimeoIcon,
    description: "Vimeo hosts high-quality creative content from filmmakers, artists, and professionals. Download Vimeo videos in their original quality, which often exceeds what other platforms offer. Supports both public Vimeo videos and content from Vimeo Pro accounts when publicly shared.",
    formats: ["MP4", "HD", "1080p", "4K"],
    notes: "High-quality professional content, often in superior quality",
  },
  {
    name: "Dailymotion", url: null, color: "hsl(27,90%,52%)", icon: DailymotionIcon,
    description: "Dailymotion is one of the world's largest video hosting platforms, particularly popular in Europe and for news content. Download Dailymotion videos in available quality levels ranging from SD to HD.",
    formats: ["MP4", "SD", "HD"],
    notes: "News clips, entertainment, and international content",
  },
  {
    name: "Reddit", url: null, color: "hsl(15,90%,52%)", icon: RedditIcon,
    description: "Reddit videos can be surprisingly difficult to download through native means. SnapClipper handles Reddit-hosted video (v.redd.it) with audio properly merged — a common issue with Reddit's video format where audio and video are delivered as separate streams.",
    formats: ["MP4", "HD"],
    notes: "Audio and video properly merged (common Reddit issue)",
  },
  {
    name: "Pinterest", url: null, color: "hsl(350,80%,44%)", icon: PinterestIcon,
    description: "Download videos and animated content from Pinterest. Works with both native Pinterest videos and embedded video content on Pinterest pages. Great for saving recipe videos, DIY tutorials, and creative inspiration.",
    formats: ["MP4", "HD"],
    notes: "Recipe videos, tutorials, and creative content",
  },
  {
    name: "Twitch", url: null, color: "hsl(264,100%,62%)", icon: TwitchIcon,
    description: "Download Twitch clip highlights shared via clip URLs. Twitch clips are short highlight segments (up to 60 seconds) created from streams. Full VOD downloading has platform-specific restrictions, but clips work reliably.",
    formats: ["MP4", "HD"],
    notes: "Supports Twitch clip highlights (clip URLs)",
  },
  {
    name: "SoundCloud", url: null, color: "hsl(25,95%,52%)", icon: SoundCloudIcon,
    description: "Download audio tracks from SoundCloud as MP3 files. Great for saving music discoveries, podcast episodes uploaded to SoundCloud, and artist demos before they become unavailable. Works with publicly accessible tracks.",
    formats: ["MP3", "Audio only"],
    notes: "Public tracks, podcasts, and music downloads",
  },
  {
    name: "Tumblr", url: null, color: "hsl(216,40%,36%)", icon: TumblrIcon,
    description: "Download videos posted on Tumblr blogs. Tumblr hosts a variety of creative content including short films, animations, and video art. Works with publicly accessible Tumblr video posts.",
    formats: ["MP4", "HD"],
    notes: "Creative content, animations, and blog videos",
  },
];

const SupportedPlatformsPage = () => (
  <div className="min-h-screen bg-background">
    <Helmet>
      <title>Supported Platforms — 20+ Sites | SnapClipper Video Downloader</title>
      <meta name="description" content="SnapClipper supports 20+ video platforms including YouTube, TikTok, Instagram, Facebook, Twitter/X, Vimeo, Reddit, and more. Full list of supported sites with format details." />
      <link rel="canonical" href="https://www.snapclipper.com/platforms" />
      <meta property="og:title" content="All Supported Platforms — SnapClipper" />
      <meta property="og:description" content="Download videos from 20+ platforms including YouTube, TikTok, Instagram, Facebook, Twitter, Vimeo, Reddit, and many more." />
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Supported Video Download Platforms",
          description: "Complete list of platforms supported by SnapClipper video downloader",
          url: "https://www.snapclipper.com/platforms",
        })}
      </script>
    </Helmet>

    <Header />

    <main className="container mx-auto max-w-4xl px-4 py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">
          Supported Platforms
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          SnapClipper supports video and audio downloading from over 20 major platforms. Whether you're saving YouTube tutorials for offline study, downloading TikTok videos without watermarks, or archiving Instagram Reels before they disappear — we have you covered. Below is a detailed breakdown of every platform we support, including the formats available and any important notes about each.
        </p>
      </motion.div>

      <section className="mt-12">
        <h2 className="font-display text-2xl font-bold text-foreground">How It Works on Every Platform</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          The process is identical regardless of which platform you're downloading from: copy the video's URL from your browser's address bar or the platform's native share option, paste it into SnapClipper's download field, and click Download. SnapClipper's backend analyzes the URL, identifies the available video and audio streams, and presents you with download options in a few seconds. No account is required on SnapClipper or the source platform.
        </p>
      </section>

      <div className="mt-12 space-y-5">
        {platforms.map((platform, i) => {
          const Icon = platform.icon;
          return (
            <motion.div
              key={platform.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="group rounded-2xl border border-border bg-card p-6 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card-hover"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                {/* Icon */}
                <div
                  className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl shadow-sm transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: `${platform.color}18` }}
                >
                  <Icon className="h-7 w-7" style={{ color: platform.color } as React.CSSProperties} />
                  <div
                    className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{ boxShadow: `0 0 18px ${platform.color}50` }}
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="font-display text-lg font-semibold text-foreground">
                      {platform.name}
                    </h3>
                    {platform.url && (
                      <Link
                        to={platform.url}
                        className="inline-flex items-center gap-1 rounded-full px-3 py-0.5 text-xs font-semibold transition-colors"
                        style={{ backgroundColor: `${platform.color}18`, color: platform.color }}
                      >
                        Dedicated Guide <ExternalLink className="h-3 w-3" />
                      </Link>
                    )}
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {platform.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-4">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1.5">Formats</p>
                      <div className="flex flex-wrap gap-1.5">
                        {platform.formats.map((fmt) => (
                          <span
                            key={fmt}
                            className="rounded-full border px-2.5 py-0.5 text-xs font-semibold"
                            style={{ borderColor: `${platform.color}40`, color: platform.color, backgroundColor: `${platform.color}10` }}
                          >
                            {fmt}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-1.5">Notes</p>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle className="h-3.5 w-3.5 shrink-0" style={{ color: platform.color }} />
                        <span className="text-xs text-muted-foreground">{platform.notes}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <section className="mt-16 rounded-2xl border border-border bg-secondary/30 p-8">
        <h2 className="font-display text-2xl font-bold text-foreground">Additional Supported Sites</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          In addition to the platforms listed above, SnapClipper supports hundreds of additional video hosting sites through our underlying download engine. This includes regional video platforms, news sites with embedded video, sports highlight platforms, and emerging social media sites. If you encounter a video URL that isn't working, try pasting it anyway — the coverage of our engine often exceeds what we can exhaustively document.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {["Bilibili", "Niconico", "Rumble", "Odysee", "Streamable", "Gyfcat", "Imgur", "9GAG", "VK", "Weibo", "Likee"].map((site) => (
            <span key={site} className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground">
              {site}
            </span>
          ))}
          <span className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground">
            + many more
          </span>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl font-bold text-foreground">Platform Compatibility Notes</h2>
        <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p><strong className="text-foreground">Public Content Only:</strong> SnapClipper can only download content that is publicly accessible without logging into the source platform.</p>
          <p><strong className="text-foreground">Quality Limitations:</strong> The download quality is always limited by what was originally uploaded. SnapClipper cannot enhance or upscale beyond the original upload quality.</p>
          <p><strong className="text-foreground">Platform Changes:</strong> Social media platforms regularly update their APIs. While we continuously update SnapClipper to maintain compatibility, temporary disruptions can occur immediately following major platform updates.</p>
          <p><strong className="text-foreground">Regional Restrictions:</strong> Some content is geo-restricted by the platform or by the content uploader. If a video is restricted in your region, SnapClipper may not be able to access it on your behalf.</p>
          <p><strong className="text-foreground">Personal Use Only:</strong> Downloads are intended for personal offline viewing only. Re-uploading or redistributing downloaded content without the copyright holder's permission is a violation of copyright law.</p>
        </div>
      </section>
    </main>

    <Footer />
  </div>
);

export default SupportedPlatformsPage;

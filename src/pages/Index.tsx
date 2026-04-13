import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Search, Download, Zap, Shield, Globe, Play,
  Sparkles, Star, Clock, CheckCircle2, ArrowRight,
  Film, Music2, MonitorPlay, Smartphone, RotateCcw
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PlatformCard from "@/components/PlatformCard";
import FeatureCard from "@/components/FeatureCard";
import FormatBadge from "@/components/FormatBadge";
import FAQSection from "@/components/FAQSection";
import BlogSection from "@/components/BlogSection";
import DownloadResults from "@/components/DownloadResults";
import { fetchVideoInfo, parseVideoUrls, type VideoInfo } from "@/lib/api/video";
import {
  YouTubeIcon, TikTokIcon, InstagramIcon,
  FacebookIcon, TwitterXIcon, VimeoIcon,
} from "@/components/SocialIcons";

const platforms = [
  { name: "YouTube",    description: "HD, Full HD, 4K & MP3 audio extraction",        icon: YouTubeIcon,   color: "hsl(0,72%,51%)" },
  { name: "TikTok",    description: "Download without watermark in original quality",  icon: TikTokIcon,    color: "hsl(300,60%,50%)" },
  { name: "Instagram", description: "Reels, Stories, IGTV & carousel posts",           icon: InstagramIcon, color: "hsl(330,70%,55%)" },
  { name: "Facebook",  description: "Videos, Reels, Live replays in MP4",               icon: FacebookIcon,  color: "hsl(220,80%,55%)" },
  { name: "Twitter/X", description: "Videos, GIFs and short clips",                    icon: TwitterXIcon,  color: "hsl(207,90%,54%)" },
  { name: "Vimeo",     description: "High-quality videos up to 4K",                    icon: VimeoIcon,     color: "hsl(195,80%,48%)" },
];

const features = [
  {
    icon: Zap, title: "Lightning Fast",
    description: "Most videos are ready in under 10 seconds thanks to our optimised processing pipeline.",
    gradient: "gradient-orange", shadow: "shadow-orange", accent: "bg-orange-400",
  },
  {
    icon: Shield, title: "100% Safe & Private",
    description: "No login, no tracking, no data collection. Your activity stays completely private.",
    gradient: "gradient-violet", shadow: "shadow-violet", accent: "bg-violet-400",
  },
  {
    icon: Globe, title: "20+ Platforms",
    description: "One tool for YouTube, TikTok, Instagram, Facebook, Twitter and many more.",
    gradient: "gradient-blue", shadow: "shadow-blue", accent: "bg-blue-400",
  },
  {
    icon: Download, title: "All Formats & Qualities",
    description: "Save as MP4, MP3, WEBM or choose a resolution from 360p up to 4K Ultra HD.",
    gradient: "gradient-rose", shadow: "shadow-rose", accent: "bg-rose-400",
  },
];

const formats = ["MP4", "MP3", "WEBM", "720p", "1080p", "4K"];

const statsData = [
  { value: "10M+",  label: "Videos Downloaded", icon: Download,    gradient: "gradient-violet", shadow: "shadow-violet" },
  { value: "20+",   label: "Platforms",          icon: Globe,       gradient: "gradient-blue",   shadow: "shadow-blue" },
  { value: "99.9%", label: "Uptime",             icon: Clock,       gradient: "gradient-primary",shadow: "shadow-glow-sm" },
  { value: "4K",    label: "Max Quality",        icon: MonitorPlay, gradient: "gradient-orange", shadow: "shadow-orange" },
];

const reviews = [
  { name: "Sarah M.",  avatar: "S", text: "Incredibly fast and easy. Downloaded my entire YouTube playlist in minutes — no watermarks, no fuss.", rating: 5, gradient: "gradient-violet" },
  { name: "James K.",  avatar: "J", text: "Best free downloader I've found. Works flawlessly on TikTok and Instagram Reels.",                   rating: 5, gradient: "gradient-blue" },
  { name: "Priya R.",  avatar: "P", text: "No signup, no spam, just works. I use it every day for content research.",                           rating: 5, gradient: "gradient-rose" },
];

const useCases = [
  { icon: Film,        title: "Content Creators",  desc: "Backup your own uploads and repurpose content across platforms.", gradient: "gradient-violet", shadow: "shadow-violet", ring: "ring-violet-200 dark:ring-violet-900" },
  { icon: Music2,      title: "Music Lovers",       desc: "Extract audio from concerts, interviews and podcasts as MP3.",    gradient: "gradient-rose",   shadow: "shadow-rose",   ring: "ring-rose-200   dark:ring-rose-900" },
  { icon: MonitorPlay, title: "Educators",          desc: "Save lectures, tutorials and educational videos for offline study.", gradient: "gradient-blue", shadow: "shadow-blue",   ring: "ring-blue-200   dark:ring-blue-900" },
  { icon: Smartphone,  title: "Offline Viewers",    desc: "Download before a flight or commute and enjoy anywhere.",          gradient: "gradient-orange", shadow: "shadow-orange", ring: "ring-orange-200 dark:ring-orange-900" },
];

const steps = [
  { step: "01", title: "Paste the URL",  desc: "Copy the video link from any supported platform and paste it in the box above.", icon: Search,   gradient: "gradient-violet", shadow: "shadow-violet", border: "border-violet-200 dark:border-violet-900" },
  { step: "02", title: "Choose Quality", desc: "Select your preferred format and resolution — MP4, MP3, 720p, 1080p or 4K.",     icon: Play,     gradient: "gradient-blue",   shadow: "shadow-blue",   border: "border-blue-200   dark:border-blue-900" },
  { step: "03", title: "Save to Device", desc: "Hit Download and the file saves directly to your phone or computer.",             icon: Download, gradient: "gradient-primary",shadow: "shadow-glow-sm",border: "border-emerald-200 dark:border-emerald-900" },
];

const trustedBadges = ["No Malware", "No Login Required", "No File Size Limit", "No Hidden Fees", "Unlimited Downloads"];
const processingMessages = [
  "Fetching video details...",
  "Preparing available formats...",
  "Almost ready — this can take up to 10 seconds.",
];

type QueueItem = {
  id: string;
  url: string;
  status: "queued" | "processing" | "ready" | "failed";
  video?: VideoInfo;
  error?: string;
};

const Index = () => {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [queueItems, setQueueItems] = useState<QueueItem[]>([]);
  const [processingMessage, setProcessingMessage] = useState(processingMessages[0]);
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading) {
      setProcessingMessage(processingMessages[0]);
      return;
    }

    setProcessingMessage(processingMessages[0]);
    const timers = [
      window.setTimeout(() => setProcessingMessage(processingMessages[1]), 3000),
      window.setTimeout(() => setProcessingMessage(processingMessages[2]), 7000),
    ];

    return () => {
      timers.forEach(window.clearTimeout);
    };
  }, [isLoading]);

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    const urls = parseVideoUrls(url);
    if (urls.length === 0) return;

    const nextQueue = urls.map((queuedUrl, index) => ({
      id: `${Date.now()}-${index}`,
      url: queuedUrl,
      status: "queued" as const,
    }));

    setQueueItems(nextQueue);
    setIsLoading(true);

    for (const item of nextQueue) {
      setQueueItems((current) => current.map((queued) => (
        queued.id === item.id ? { ...queued, status: "processing" } : queued
      )));

      try {
        const info = await fetchVideoInfo(item.url);
        setQueueItems((current) => current.map((queued) => (
          queued.id === item.id ? { ...queued, status: "ready", video: info } : queued
        )));
      } catch (err: any) {
        const errorMessage = err.message?.includes("ECONNRESET") || err.message?.includes("processing the request")
          ? "Video service is temporarily unavailable. Please try again later."
          : err.message || "Failed to process video URL.";
        setQueueItems((current) => current.map((queued) => (
          queued.id === item.id
            ? { ...queued, status: "failed", error: errorMessage }
            : queued
        )));
      }
    }

    setIsLoading(false);
  };

  const retryItem = async (item: QueueItem) => {
    setQueueItems((current) => current.map((queued) => (
      queued.id === item.id ? { ...queued, status: "processing", error: undefined } : queued
    )));

    try {
      const info = await fetchVideoInfo(item.url);
      setQueueItems((current) => current.map((queued) => (
        queued.id === item.id ? { ...queued, status: "ready", video: info } : queued
      )));
    } catch (err: any) {
      const errorMessage = err.message?.includes("ECONNRESET") || err.message?.includes("processing the request")
        ? "Video service is temporarily unavailable. Please try again later."
        : err.message || "Failed to process video URL.";
      setQueueItems((current) => current.map((queued) => (
        queued.id === item.id
          ? { ...queued, status: "failed", error: errorMessage }
          : queued
      )));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>SnapClipper — Free Online Video Downloader | YouTube, TikTok, Instagram HD MP4 MP3</title>
        <meta name="description" content="Download videos from YouTube, TikTok, Instagram, Facebook & 20+ platforms in HD, 4K, MP4, MP3, WEBM. Free, fast, no signup. Works on all devices." />
        <link rel="canonical" href="https://www.snapclipper.com" />
        <meta property="og:title" content="SnapClipper — Free Online Video Downloader" />
        <meta property="og:description" content="Download videos from YouTube, TikTok, Instagram & 20+ platforms in HD quality. Free, fast, no signup." />
        <meta property="og:url" content="https://www.snapclipper.com" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org", "@type": "FAQPage",
          "mainEntity": [
            { "@type": "Question", "name": "Is SnapClipper free?", "acceptedAnswer": { "@type": "Answer", "text": "Yes, completely free. No account, no payment." }},
            { "@type": "Question", "name": "What quality is available?", "acceptedAnswer": { "@type": "Answer", "text": "360p up to 4K and MP3 audio." }},
            { "@type": "Question", "name": "Which platforms are supported?", "acceptedAnswer": { "@type": "Answer", "text": "20+ including YouTube, TikTok, Instagram, Facebook, Twitter/X, Vimeo." }},
          ]
        })}</script>
      </Helmet>

      <Header />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="gradient-hero relative overflow-hidden pb-20 pt-16 md:pb-28 md:pt-32">
        {/* Colorful blobs */}
        <div className="pointer-events-none absolute -left-32 top-0 h-[420px] w-[420px] rounded-full bg-violet-400/10 blur-3xl dark:bg-violet-600/14" />
        <div className="pointer-events-none absolute -right-32 bottom-0 h-[360px] w-[360px] rounded-full bg-blue-400/10 blur-3xl dark:bg-blue-600/14" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400/8 blur-3xl dark:bg-emerald-600/10" />
        {/* dot grid */}
        <div className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, hsl(265 85% 58%) 1px, transparent 0)", backgroundSize: "44px 44px" }} />

        <div className="container relative mx-auto px-4 text-center">
          {/* Rainbow pill */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <div className="mx-auto mb-7 inline-flex items-center gap-2 rounded-full border border-violet-200/60 bg-gradient-to-r from-violet-50 to-blue-50 px-5 py-2 text-xs font-semibold text-violet-700 shadow-violet dark:border-violet-800/40 dark:from-violet-950/40 dark:to-blue-950/40 dark:text-violet-300">
              <Sparkles className="h-3.5 w-3.5" />
              Free • No signup • Unlimited downloads
            </div>
            <h1 className="font-display text-4xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-5xl md:text-[72px]">
              Download Any Video,<br />
              <span className="text-gradient">Instantly & Free.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-base text-muted-foreground md:text-lg">
              Paste a link from YouTube, TikTok, Instagram or 20+ platforms.
              Pick your quality. Save to your device — in seconds.
            </p>
          </motion.div>

          {/* Search bar */}
          <motion.form
            onSubmit={handleDownload}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.15 }}
            className="mx-auto mt-9 flex max-w-2xl flex-col gap-3 sm:flex-row"
          >
            <div className="relative flex-1">
              <Search className="absolute left-4 top-5 h-5 w-5 text-muted-foreground" />
              <textarea
                rows={2}
                placeholder="Paste one or multiple video URLs, one per line..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="min-h-14 w-full resize-none rounded-2xl border-2 border-violet-100 bg-card py-4 pl-12 pr-4 text-base shadow-card outline-none placeholder:text-muted-foreground focus:border-violet-300 focus:ring-0 dark:border-violet-900/40 dark:focus:border-violet-700"
              />
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              size="lg"
              className="h-14 rounded-2xl bg-gradient-to-r from-violet-600 via-blue-600 to-emerald-500 px-9 text-base font-semibold text-white shadow-violet animate-pulse-glow transition-all hover:opacity-90 hover:scale-[1.02] disabled:animate-none sm:mt-0"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Processing…
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Download Free
                </span>
              )}
            </Button>
          </motion.form>

          {isLoading && (
            <p className="mt-3 text-sm font-medium text-muted-foreground">
              {processingMessage}
            </p>
          )}

          {queueItems.length > 0 && (
            <div className="mx-auto mt-8 max-w-2xl space-y-4 text-left">
              <div className="rounded-3xl border border-border bg-card/80 p-4 shadow-card">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-display text-base font-semibold text-foreground">Download Queue</h3>
                    <p className="text-xs text-muted-foreground">Links process one after another. Ready items show download options below.</p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={isLoading}
                    onClick={() => setQueueItems([])}
                    className="text-xs"
                  >
                    Clear
                  </Button>
                </div>
                <div className="space-y-2">
                  {queueItems.map((item, index) => (
                    <div key={item.id} className="rounded-2xl border border-border/70 bg-secondary/30 p-3">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <p className="min-w-0 truncate text-sm font-medium text-foreground">
                          {index + 1}. {item.url}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className={`w-fit rounded-full px-2.5 py-1 text-xs font-semibold ${
                            item.status === "ready"
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                              : item.status === "failed"
                              ? "bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300"
                              : item.status === "processing"
                              ? "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300"
                              : "bg-secondary text-muted-foreground"
                          }`}>
                            {item.status === "processing" ? "Processing" : item.status === "ready" ? "Ready" : item.status === "failed" ? "Failed" : "Queued"}
                          </span>
                          {item.status === "failed" && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => retryItem(item)}
                              className="h-6 w-6 p-0"
                              title="Retry"
                            >
                              <RotateCcw className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                      {item.error && <p className="mt-2 text-sm text-rose-600 dark:text-rose-300">{item.error}</p>}
                    </div>
                  ))}
                </div>
              </div>

              {queueItems.map((item) => item.video ? (
                <DownloadResults
                  key={`${item.id}-results`}
                  video={item.video}
                  onClose={() => setQueueItems((current) => current.filter((queued) => queued.id !== item.id))}
                />
              ) : null)}
            </div>
          )}

          {/* Colorful format badges */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
            className="mx-auto mt-5 flex max-w-lg flex-wrap items-center justify-center gap-2">
            <span className="text-sm text-muted-foreground">Supports:</span>
            {formats.map((f) => <FormatBadge key={f} label={f} />)}
          </motion.div>

          {/* Trust indicators */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            className="mx-auto mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {trustedBadges.map((b, i) => {
              const colors = ["text-violet-500","text-blue-500","text-emerald-500","text-orange-500","text-rose-500"];
              return (
                <span key={b} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <CheckCircle2 className={`h-3.5 w-3.5 ${colors[i % colors.length]}`} />
                  {b}
                </span>
              );
            })}
          </motion.div>

        </div>
      </section>

      {/* ── STATS ──────────────────────────────────────────────────────────── */}
      <section className="border-y border-border/40">
        <div className="container mx-auto grid grid-cols-2 divide-x divide-y divide-border/40 px-0 md:grid-cols-4 md:divide-y-0">
          {statsData.map((stat, i) => (
            <motion.div key={stat.label}
              initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.09 }}
              className="flex flex-col items-center gap-2 py-9 text-center"
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${stat.gradient} ${stat.shadow}`}>
                <stat.icon className="h-5 w-5 text-white" />
              </div>
              <div className="font-display text-3xl font-bold text-gradient">{stat.value}</div>
              <div className="text-xs font-medium text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── PLATFORMS ──────────────────────────────────────────────────────── */}
      <section className="bg-violet-section py-24" id="platforms">
        <div className="container mx-auto px-4">
          <div className="mb-14 text-center">
            <span className="section-label border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-800/50 dark:bg-violet-950/40 dark:text-violet-300">
              <Globe className="h-3.5 w-3.5" /> Supported Platforms
            </span>
            <h2 className="mt-3 font-display text-3xl font-bold text-foreground md:text-4xl">Download from Anywhere</h2>
            <p className="mt-2.5 text-muted-foreground">One tool, 20+ platforms — no extra steps required</p>
          </div>
          <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {platforms.map((p, i) => <PlatformCard key={p.name} platform={p} index={i} />)}
          </div>
          <p className="mt-8 text-center text-sm text-muted-foreground">
            Also: Dailymotion, Reddit, Pinterest, Twitch clips, Snapchat, Rumble and many more.
          </p>
        </div>
      </section>

      {/* ── FEATURES ───────────────────────────────────────────────────────── */}
      <section className="border-t border-border/30 bg-blue-section py-24">
        <div className="container mx-auto px-4">
          <div className="mb-14 text-center">
            <span className="section-label border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800/50 dark:bg-blue-950/40 dark:text-blue-300">
              <Zap className="h-3.5 w-3.5" /> Why SnapClipper
            </span>
            <h2 className="mt-3 font-display text-3xl font-bold text-foreground md:text-4xl">Built for Speed, Privacy & Simplicity</h2>
            <p className="mt-2.5 text-muted-foreground">Everything you need. Nothing you don't.</p>
          </div>
          <div className="mx-auto grid max-w-4xl gap-5 sm:grid-cols-2">
            {features.map((f, i) => <FeatureCard key={f.title} feature={f} index={i} />)}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────────────────────────────── */}
      <section className="border-t border-border/30 bg-orange-section py-24">
        <div className="container mx-auto px-4 text-center">
          <span className="section-label border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-800/50 dark:bg-orange-950/40 dark:text-orange-300">
            <Play className="h-3.5 w-3.5" /> Simple Steps
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold text-foreground md:text-4xl">Download in 3 Simple Steps</h2>
          <p className="mt-2.5 text-muted-foreground">No technical knowledge needed — anyone can do it</p>
          <div className="mx-auto mt-16 grid max-w-3xl gap-4 md:grid-cols-3 md:gap-6">
            {steps.map((s, i) => (
              <motion.div key={s.step}
                initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.13 }}
                className={`relative flex flex-col items-center rounded-2xl border-2 ${s.border} bg-card p-7 shadow-card`}
              >
                {i < 2 && (
                  <ArrowRight className="absolute -right-4 top-1/2 z-10 hidden h-5 w-5 -translate-y-1/2 text-border md:block" />
                )}
                <div className="relative mb-5">
                  <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${s.gradient} ${s.shadow}`}>
                    <s.icon className="h-7 w-7 text-white" />
                  </div>
                  <div className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-background font-display text-[10px] font-bold text-foreground ring-2 ring-border">
                    {s.step}
                  </div>
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── USE CASES ──────────────────────────────────────────────────────── */}
      <section className="border-t border-border/30 bg-rose-section py-24">
        <div className="container mx-auto px-4">
          <div className="mb-14 text-center">
            <span className="section-label border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-800/50 dark:bg-rose-950/40 dark:text-rose-300">
              <Sparkles className="h-3.5 w-3.5" /> Use Cases
            </span>
            <h2 className="mt-3 font-display text-3xl font-bold text-foreground md:text-4xl">Who Uses SnapClipper?</h2>
            <p className="mt-2.5 text-muted-foreground">From casual viewers to professional creators</p>
          </div>
          <div className="mx-auto grid max-w-4xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {useCases.map((u, i) => (
              <motion.div key={u.title}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.09 }}
                className={`group flex flex-col items-center rounded-2xl border bg-card p-6 text-center shadow-card ring-2 ring-transparent card-hover hover:${u.ring}`}
              >
                <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${u.gradient} ${u.shadow} transition-transform duration-300 group-hover:scale-110`}>
                  <u.icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-display text-base font-semibold text-foreground">{u.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{u.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── REVIEWS ────────────────────────────────────────────────────────── */}
      <section className="border-t border-border/30 bg-teal-section py-24">
        <div className="container mx-auto px-4">
          <div className="mb-14 text-center">
            <span className="section-label border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800/50 dark:bg-emerald-950/40 dark:text-emerald-300">
              <Star className="h-3.5 w-3.5" /> Trusted by Millions
            </span>
            <h2 className="mt-3 font-display text-3xl font-bold text-foreground md:text-4xl">What Our Users Say</h2>
            <p className="mt-2.5 text-muted-foreground">Loved by content creators and everyday viewers alike</p>
          </div>
          <div className="mx-auto grid max-w-4xl gap-5 sm:grid-cols-3">
            {reviews.map((r, i) => (
              <motion.div key={r.name}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-card card-hover"
              >
                <div className="mb-3 flex gap-0.5">
                  {Array.from({ length: r.rating }).map((_, idx) => (
                    <Star key={idx} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="flex-1 text-sm leading-relaxed text-muted-foreground">"{r.text}"</p>
                <div className="mt-5 flex items-center gap-3 border-t border-border/50 pt-4">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-full ${r.gradient} font-display text-sm font-bold text-white shadow-sm`}>
                    {r.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">{r.name}</div>
                    <div className="text-xs text-muted-foreground">Verified user</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────────────────────── */}
      <section className="border-t border-border/30 py-24">
        <div className="container mx-auto px-4">
          <FAQSection />
        </div>
      </section>

      <BlogSection />

      {/* ── CTA BANNER ─────────────────────────────────────────────────────── */}
      <section className="border-t border-border/30 py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="relative mx-auto max-w-2xl overflow-hidden rounded-3xl p-10 text-white"
            style={{ background: "linear-gradient(135deg, hsl(265 85% 58%) 0%, hsl(217 91% 60%) 40%, hsl(145 65% 42%) 70%, hsl(172 66% 44%) 100%)" }}
          >
            <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
            <div className="relative">
              <Sparkles className="mx-auto mb-4 h-10 w-10 text-white/90" />
              <h2 className="font-display text-2xl font-bold md:text-3xl">Ready to Download?</h2>
              <p className="mx-auto mt-3 max-w-md text-white/80">
                Paste your video URL and get started — completely free, no account needed.
              </p>
              <Button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                size="lg"
                className="mt-7 h-13 rounded-2xl bg-white px-9 text-base font-bold text-violet-700 shadow-lg transition-all hover:bg-white/90 hover:scale-[1.03]"
              >
                <Download className="mr-2 h-5 w-5" />
                Download Now — It's Free
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;

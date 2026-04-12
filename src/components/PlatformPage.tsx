import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, Download, Sparkles, Play, Music, Film, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DownloadResults from "@/components/DownloadResults";
import FAQSection from "@/components/FAQSection";
import { fetchVideoInfo, parseVideoUrls, type VideoInfo } from "@/lib/api/video";

interface PlatformPageProps {
  platform: {
    name: string;
    slug: string;
    icon: string;
    color: string;
    heroTitle: string;
    heroHighlight: string;
    description: string;
    metaDescription: string;
    features: string[];
    formats: string[];
    faqs: { question: string; answer: string }[];
    howTo: { step: string; title: string; desc: string }[];
    guide?: {
      title: string;
      sections: { heading: string; text: string }[];
    };
  };
}

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

const PlatformPage = ({ platform }: PlatformPageProps) => {
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
        setQueueItems((current) => current.map((queued) => (
          queued.id === item.id
            ? { ...queued, status: "failed", error: err.message || "Failed to process URL" }
            : queued
        )));
      }
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="gradient-hero relative overflow-hidden pb-16 pt-20 md:pb-24 md:pt-32">
        <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full blur-3xl" style={{ backgroundColor: `${platform.color}10` }} />
        <div className="pointer-events-none absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />

        <div className="container relative mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl text-3xl" style={{ backgroundColor: `${platform.color}15`, color: platform.color }}>
              {platform.icon}
            </div>
            <h1 className="font-display text-3xl font-bold leading-tight text-foreground sm:text-5xl md:text-6xl">
              {platform.heroTitle}<br />
              <span className="text-gradient">{platform.heroHighlight}</span>
            </h1>
            <p className="mx-auto mt-4 max-w-lg text-base text-muted-foreground md:text-lg">
              {platform.description}
            </p>
          </motion.div>

          <motion.form
            onSubmit={handleDownload}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mx-auto mt-10 flex max-w-2xl flex-col gap-3 sm:flex-row"
          >
            <div className="relative flex-1">
              <Search className="absolute left-4 top-5 h-5 w-5 text-muted-foreground" />
              <textarea
                rows={2}
                placeholder={`Paste one or multiple ${platform.name} URLs, one per line...`}
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="min-h-14 w-full resize-none rounded-xl border border-border bg-card py-4 pl-12 pr-4 text-base text-foreground outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-primary"
              />
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              size="lg"
              className="h-14 rounded-xl gradient-primary px-8 text-base font-semibold text-primary-foreground shadow-glow transition-all hover:brightness-110"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  Processing...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Download
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
                  <Button type="button" variant="ghost" size="sm" disabled={isLoading} onClick={() => setQueueItems([])} className="text-xs">
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

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} className="mx-auto mt-6 flex flex-wrap items-center justify-center gap-2">
            <span className="text-sm text-muted-foreground">Formats:</span>
            {platform.formats.map((f) => (
              <span key={f} className="rounded-lg border border-border bg-secondary/60 px-3 py-1 text-xs font-medium text-secondary-foreground">{f}</span>
            ))}
          </motion.div>

        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-10 text-center font-display text-3xl font-bold text-foreground md:text-4xl">
            {platform.name} Downloader Features
          </h2>
          <div className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-2">
            {platform.features.map((feat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex items-start gap-3 rounded-xl border border-border bg-card p-5 shadow-card"
              >
                <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <span className="text-sm text-foreground">{feat}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How to */}
      <section className="border-t border-border/30 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
            How to Download {platform.name} Videos
          </h2>
          <div className="mx-auto mt-14 grid max-w-3xl gap-8 md:grid-cols-3">
            {platform.howTo.map((s, i) => (
              <motion.div key={s.step} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }} className="flex flex-col items-center">
                <div className="relative mb-5">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-glow">
                    <span className="font-display text-xl font-bold text-primary-foreground">{s.step}</span>
                  </div>
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground">{s.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* In-depth Guide */}
      {platform.guide && (
        <section className="border-t border-border/30 py-20">
          <div className="container mx-auto max-w-3xl px-4">
            <h2 className="mb-10 text-center font-display text-3xl font-bold text-foreground md:text-4xl">
              {platform.guide.title}
            </h2>
            <div className="space-y-8">
              {platform.guide.sections.map((section, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                >
                  <h3 className="mb-3 font-display text-xl font-semibold text-foreground">{section.heading}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{section.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Platform-specific FAQ */}
      <section className="border-t border-border/30 py-20">
        <div className="container mx-auto px-4">
          <FAQSection customFaqs={platform.faqs} title={`${platform.name} Download FAQ`} />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PlatformPage;

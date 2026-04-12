import { motion, AnimatePresence } from "framer-motion";
import { Download, Play, Music, Film, X, Loader2, CheckCircle2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { startBrowserDownload } from "@/lib/api/video";
import { toast } from "sonner";
import type { VideoInfo, VideoFormat } from "@/lib/api/video";

interface DownloadResultsProps {
  video: VideoInfo | null;
  onClose: () => void;
}

const DownloadResults = ({ video, onClose }: DownloadResultsProps) => {
  const [downloadingIndex, setDownloadingIndex] = useState<number | null>(null);
  const [doneIndex, setDoneIndex] = useState<number | null>(null);
  const [downloadMessage, setDownloadMessage] = useState("Starting download...");

  if (!video) return null;

  const isAudioFormat = (f: VideoFormat) => {
    const fmt = (f.format || "").toLowerCase();
    const q = (f.quality || "").toLowerCase();
    return (
      fmt === "mp3" || fmt === "m4a" ||
      q === "mp3 audio" || q === "audio" || q === "mp3" || q === "sound"
    );
  };

  const validFormats = video.formats.filter((f) => !!f.url);
  const audioFormats = validFormats.filter(isAudioFormat);
  const videoFormats = validFormats.filter((f) => !isAudioFormat(f));
  const orderedFormats = [...videoFormats, ...audioFormats];

  const handleDownload = async (f: VideoFormat, index: number) => {
    setDownloadingIndex(index);
    setDoneIndex(null);
    setDownloadMessage("Starting download...");
    try {
      const timers = [
        window.setTimeout(() => setDownloadMessage("Preparing your file..."), 3000),
        window.setTimeout(() => setDownloadMessage("Your download should start soon — please wait up to 10 seconds."), 7000),
      ];
      startBrowserDownload(f, video.title);
      setDoneIndex(index);
      toast.success("Download is starting...");
      setTimeout(() => setDoneIndex(null), 3000);
      setTimeout(() => timers.forEach(window.clearTimeout), 10000);
    } catch (err: any) {
      console.error("Download error:", err);
      toast.error(err?.message || "Download failed. Please try again.");
    } finally {
      setTimeout(() => setDownloadingIndex(null), 10000);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.97 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="mx-auto mt-10 max-w-2xl overflow-hidden rounded-3xl border border-border bg-card shadow-card-hover"
      >
        {/* Header */}
        <div className="relative flex flex-col gap-4 p-6 sm:flex-row sm:items-start">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-xl p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Thumbnail */}
          <div className="relative h-36 w-full shrink-0 overflow-hidden rounded-2xl bg-secondary sm:h-28 sm:w-48">
            {video.thumbnail ? (
              <img src={video.thumbnail} alt={video.title} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <Film className="h-10 w-10 text-muted-foreground/30" />
              </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                <Play className="h-5 w-5 text-white" />
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="min-w-0 flex-1 pr-6">
            <h3 className="line-clamp-2 font-display text-sm font-semibold leading-snug text-foreground sm:text-base">
              {video.title}
            </h3>
            <p className="mt-1.5 text-xs text-muted-foreground">Duration: {video.duration}</p>
            <div className="mt-2.5 flex flex-wrap gap-2">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                <CheckCircle2 className="h-3 w-3" />
                {videoFormats.length} video format{videoFormats.length !== 1 ? "s" : ""}
              </div>
              {audioFormats.length > 0 && (
                <div className="inline-flex items-center gap-1.5 rounded-full bg-violet-100 px-2.5 py-1 text-xs font-semibold text-violet-700 dark:bg-violet-950/40 dark:text-violet-300">
                  <Music className="h-3 w-3" />
                  {audioFormats.length} audio format{audioFormats.length !== 1 ? "s" : ""}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Format list */}
        <div className="border-t border-border/50 p-5">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Choose Format & Quality
          </p>
          {downloadingIndex !== null && (
            <p className="mb-3 text-sm font-medium text-muted-foreground">
              {downloadMessage}
            </p>
          )}
          <div className="space-y-2">
            {orderedFormats.map((f, i) => {
              const isAudio = isAudioFormat(f);
              const isVideoOnly = !isAudio && f.videoOnly === true && video.source !== "youtube";
              const isDone = doneIndex === i;
              const isLoading = downloadingIndex === i;

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className={`flex items-center justify-between rounded-2xl border px-4 py-3 transition-colors ${
                    isDone
                      ? "border-primary/30 bg-primary/5"
                      : isVideoOnly
                      ? "border-orange-200/60 bg-orange-50/40 dark:bg-orange-950/10"
                      : "border-border bg-secondary/40 hover:border-border/80 hover:bg-secondary/60"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-xl ${
                      isAudio
                        ? "bg-violet-100 dark:bg-violet-950/40"
                        : isVideoOnly
                        ? "bg-orange-100 dark:bg-orange-950/40"
                        : "bg-blue-100 dark:bg-blue-950/40"
                    }`}>
                      {isAudio
                        ? <Music className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                        : isVideoOnly
                        ? <VolumeX className="h-4 w-4 text-orange-500" />
                        : <Film className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      }
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-sm font-semibold text-foreground">
                        {isAudio ? "MP3 Audio" : f.quality}
                      </span>
                      <span className="rounded bg-secondary px-1.5 py-0.5 text-[10px] font-semibold uppercase text-muted-foreground">
                        {f.format}
                      </span>
                      {isAudio && (
                        <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-semibold text-violet-600 dark:bg-violet-950/40 dark:text-violet-400">
                          Audio only
                        </span>
                      )}
                      {isVideoOnly && (
                        <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-semibold text-orange-600 dark:bg-orange-950/40 dark:text-orange-400">
                          Video only · no audio
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {f.size && (
                      <span className="hidden text-xs text-muted-foreground sm:block">{f.size}</span>
                    )}
                    <Button
                      size="sm"
                      disabled={isLoading || downloadingIndex !== null}
                      onClick={() => handleDownload(f, i)}
                      className={`h-8 rounded-xl px-4 text-xs font-semibold transition-all ${
                        isDone
                          ? "bg-primary/20 text-primary hover:bg-primary/25"
                          : isAudio
                          ? "gradient-violet text-white shadow-violet hover:brightness-110"
                          : "gradient-primary text-primary-foreground shadow-glow-sm hover:brightness-110"
                      }`}
                    >
                      {isLoading ? (
                        <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                      ) : isDone ? (
                        <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
                      ) : (
                        <Download className="mr-1.5 h-3.5 w-3.5" />
                      )}
                      {isLoading ? "Processing…" : isDone ? "Saved!" : "Download"}
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DownloadResults;

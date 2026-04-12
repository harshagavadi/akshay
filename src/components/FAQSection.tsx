import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const defaultFaqs = [
  {
    question: "Is SnapClipper free to use?",
    answer: "Yes, SnapClipper is 100% free with no hidden costs, no subscription plans, and no usage limits. You can download as many videos as you want from any supported platform without creating an account or providing any payment information. We keep the service free by displaying non-intrusive advertising.",
  },
  {
    question: "What video quality options are available?",
    answer: "SnapClipper offers the full range of quality options that the source platform makes available, typically including 360p, 480p, 720p (HD), 1080p (Full HD), and 4K Ultra HD when the original video was uploaded at that resolution. You can also extract audio-only content in MP3 format at various bitrates (128kbps, 192kbps, and 320kbps). The quality list is generated dynamically for each video, so you'll always see exactly what's available.",
  },
  {
    question: "Do I need to install any software?",
    answer: "No installation whatsoever is required. SnapClipper runs entirely in your web browser — Chrome, Firefox, Safari, Edge, or any modern browser on any device. There are no browser extensions, plugins, or desktop applications to install. Simply open the website, paste a video URL, and download. This also means SnapClipper is always up to date and carries no risk of bundled software or malware.",
  },
  {
    question: "Which platforms are supported?",
    answer: "SnapClipper supports over 20 major video and social media platforms including YouTube (including Shorts), TikTok, Instagram (Reels, Stories, IGTV, posts), Facebook (videos, Reels, Live replays), Twitter/X (videos and GIFs), Vimeo, Dailymotion, Reddit, Pinterest, Twitch clip highlights, and many more. We continuously monitor platform changes and update our compatibility to ensure reliable downloads across all supported sites.",
  },
  {
    question: "Is it safe to download videos with SnapClipper?",
    answer: "Yes, SnapClipper is completely safe to use. All connections use HTTPS encryption, and we never require personal information, account creation, or payment details of any kind. There are no deceptive download buttons, bundled software, pop-up ads, or browser hijackers. Our service processes video requests through secure backend servers and delivers download links directly — your device is never exposed to third-party scripts from video platforms.",
  },
  {
    question: "Can I download videos on my phone?",
    answer: "Absolutely. SnapClipper is fully responsive and works seamlessly on smartphones and tablets running iOS or Android. Open SnapClipper in your mobile browser (Safari on iPhone, Chrome on Android, or any browser you prefer), paste the video URL, and tap Download. Files are saved to your device's Downloads folder or Photos app. No app installation is required, and the experience is identical to desktop.",
  },
  {
    question: "Is downloading videos legal?",
    answer: "Downloading videos for personal, offline viewing is generally considered acceptable use in most jurisdictions and is commonly practiced by millions of people worldwide. However, re-uploading, distributing, or monetizing downloaded content that belongs to others without their permission constitutes copyright infringement and is not permitted. SnapClipper is intended solely for personal offline viewing. Always respect content creators' intellectual property rights and support them through official channels.",
  },
  {
    question: "How long does processing take?",
    answer: "Most videos are processed and ready for download within 5 to 15 seconds. Processing time depends on the platform, the video's length, and current server load. Longer videos or those from platforms with more complex delivery systems may occasionally take up to 30 seconds. If processing takes longer than a minute, try refreshing and pasting the URL again — rare network timeouts can sometimes interrupt the process.",
  },
];

interface FAQSectionProps {
  customFaqs?: { question: string; answer: string }[];
  title?: string;
  subtitle?: string;
}

const FAQSection = ({ customFaqs, title, subtitle }: FAQSectionProps) => {
  const faqs = customFaqs || defaultFaqs;

  return (
    <div id="faq">
      <div className="mb-12 text-center">
        <span className="mb-3 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">FAQ</span>
        <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
          {title || "Frequently Asked Questions"}
        </h2>
        <p className="mt-2 text-muted-foreground">
          {subtitle || "Everything you need to know about downloading videos"}
        </p>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mx-auto max-w-2xl"
      >
        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className="rounded-xl border border-border bg-card px-5 shadow-card"
            >
              <AccordionTrigger className="text-left font-display text-sm font-semibold text-foreground hover:no-underline md:text-base [&>svg]:text-primary">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.div>
    </div>
  );
};

export default FAQSection;

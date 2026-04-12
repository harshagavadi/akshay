import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Download, Globe, Shield, Zap, Users, Heart, Lightbulb, Scale } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const values = [
  { icon: Zap, title: "Built for Speed", desc: "Our infrastructure is optimized to process and deliver video downloads as fast as your connection allows. No queues, no waiting — results in seconds." },
  { icon: Shield, title: "Privacy First", desc: "We never collect personal data, require account creation, or track download history. Your browsing activity stays private, always." },
  { icon: Globe, title: "20+ Platforms", desc: "From YouTube and TikTok to Instagram, Facebook, Twitter/X, Vimeo, and beyond — we support all major video and social media platforms worldwide." },
  { icon: Users, title: "10M+ Downloads", desc: "Trusted by millions of users around the globe for fast, reliable video downloads. Our community grows every day through word of mouth." },
];

const AboutPage = () => (
  <div className="min-h-screen bg-background">
    <Helmet>
      <title>About SnapClipper — Free Video Downloader for 20+ Platforms</title>
      <meta name="description" content="Learn about SnapClipper, the fastest free online video downloader supporting YouTube, TikTok, Instagram, Facebook & 20+ platforms. Our mission, values, and story." />
      <link rel="canonical" href="https://www.snapclipper.com/about" />
      <meta property="og:title" content="About SnapClipper — Free Video Downloader" />
      <meta property="og:description" content="Learn about SnapClipper, the fastest free online video downloader supporting 20+ platforms." />
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "SnapClipper",
          url: "https://www.snapclipper.com",
          description: "Free online video downloader supporting 20+ platforms including YouTube, TikTok, Instagram, and Facebook.",
          logo: "https://www.snapclipper.com/favicon.png",
          contactPoint: {
            "@type": "ContactPoint",
            email: "support@snapclipper.com",
            contactType: "Customer Support",
          },
        })}
      </script>
    </Helmet>
    <Header />
    <main className="container mx-auto max-w-3xl px-4 py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">About SnapClipper</h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          SnapClipper is a free, fast, and reliable online video downloader that helps millions of users save their favorite videos from over 20 popular platforms including YouTube, TikTok, Instagram, Facebook, Twitter/X, Vimeo, and more. We believe accessing your favorite video content offline should be effortless and free for everyone.
        </p>
      </motion.div>

      <div className="mt-12 space-y-10">
        <section>
          <h2 className="mb-3 font-display text-xl font-semibold text-foreground flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" /> Our Mission
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            We believe everyone should have easy access to save online video content for personal, offline viewing. Whether you're on a long flight, commuting through areas with poor cell service, studying for exams using educational videos, or simply want to enjoy your favorite creators without buffering, SnapClipper ensures your favorite content is always available when you need it. Our goal is to provide the simplest, fastest, and most reliable video downloading experience on the web — completely free and with zero barriers.
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-display text-xl font-semibold text-foreground flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary" /> Our Story
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            SnapClipper was born from a simple frustration: existing video downloaders were either riddled with ads, filled with misleading buttons, required software installation, or simply didn't work reliably. We set out to build something different — a tool that respects users. No pop-ups, no fake download buttons, no mandatory signups, no personal data collection. Just paste a URL, pick your quality, and download. That's it. Since our launch, we've helped millions of users across the globe save over 10 million videos, and we continue to improve our platform daily.
          </p>
        </section>

        <div className="grid gap-5 sm:grid-cols-2">
          {values.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-xl border border-border bg-card p-5 shadow-card"
            >
              <item.icon className="mb-3 h-6 w-6 text-primary" />
              <h3 className="font-display font-semibold text-foreground">{item.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        <section>
          <h2 className="mb-3 font-display text-xl font-semibold text-foreground">How SnapClipper Works</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            SnapClipper works entirely in your browser — there's nothing to install or configure. When you paste a video URL from any supported platform, our secure backend servers analyze the page, identify available video and audio streams, and present you with download options in multiple formats and qualities. We support MP4 (the most universally compatible video format), MP3 (audio extraction), and WEBM (optimized for web), with resolutions ranging from 360p all the way up to 4K Ultra HD when the source video supports it. The entire process typically takes just a few seconds.
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-display text-xl font-semibold text-foreground">Supported Platforms</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            We support over 20 platforms, including YouTube, TikTok, Instagram, Facebook, Twitter/X, Vimeo, Dailymotion, Reddit, Pinterest, Tumblr, SoundCloud, Twitch clips, and many more. Our team continuously monitors these platforms and updates SnapClipper to ensure compatibility whenever platforms change their APIs or video delivery systems. If you find a platform that doesn't work, let us know via our contact page and we'll look into adding support.
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-display text-xl font-semibold text-foreground flex items-center gap-2">
            <Scale className="h-5 w-5 text-primary" /> Legal & Copyright
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            SnapClipper respects the intellectual property rights of content creators. Our service is intended for downloading publicly available content for personal, offline use only. We do not host, store, or distribute any video content — all processing happens in real-time and no copies are retained on our servers. Users are responsible for ensuring their use of downloaded content complies with applicable copyright laws and the terms of service of the respective platforms. We encourage all users to support their favorite content creators through subscriptions, likes, shares, and official purchases.
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-display text-xl font-semibold text-foreground">Accessibility & Device Support</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            SnapClipper is designed to work seamlessly on every device and browser. Whether you're using a desktop computer, laptop, tablet, or smartphone — on Chrome, Safari, Firefox, Edge, or any modern browser — SnapClipper delivers the same fast, reliable experience. Our responsive design adapts to any screen size, making it just as easy to download videos on your phone as on your desktop. No apps to install, no browser extensions needed, no accounts required.
          </p>
        </section>
      </div>
    </main>
    <Footer />
  </div>
);

export default AboutPage;

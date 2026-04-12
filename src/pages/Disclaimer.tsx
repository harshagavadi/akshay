import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Disclaimer = () => (
  <div className="min-h-screen bg-background">
    <Helmet>
      <title>Disclaimer — SnapClipper</title>
      <meta name="description" content="SnapClipper disclaimer. Understand the limitations and responsibilities of using our video download service." />
    </Helmet>
    <Header />
    <main className="container mx-auto max-w-3xl px-4 py-16">
      <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">Disclaimer</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: March 8, 2026</p>

      <div className="mt-10 space-y-8 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="mb-3 font-display text-xl font-semibold text-foreground">General Disclaimer</h2>
          <p>SnapClipper is an online tool that helps users download publicly available videos from various platforms. The information and services provided on this website are for general informational and personal use purposes only.</p>
        </section>

        <section>
          <h2 className="mb-3 font-display text-xl font-semibold text-foreground">Copyright Notice</h2>
          <p>SnapClipper does not host, store, or distribute any video content. All videos are hosted on their respective platforms (YouTube, TikTok, Instagram, Facebook, etc.) and are the intellectual property of their respective owners. Users are solely responsible for ensuring that their use of downloaded content complies with applicable copyright laws and the terms of service of the respective platforms.</p>
        </section>

        <section>
          <h2 className="mb-3 font-display text-xl font-semibold text-foreground">Fair Use</h2>
          <p>Our service is intended to facilitate downloading publicly available content for personal, offline use such as:</p>
          <ul className="mt-2 list-disc space-y-1 pl-6">
            <li>Personal offline viewing during travel or in areas with limited connectivity</li>
            <li>Educational and research purposes</li>
            <li>Archival of your own content</li>
          </ul>
          <p className="mt-2">Commercial use, redistribution, or re-uploading of copyrighted content without authorization is strictly prohibited.</p>
        </section>

        <section>
          <h2 className="mb-3 font-display text-xl font-semibold text-foreground">Advertisements</h2>
          <p>This website displays advertisements served by Google AdSense and other advertising partners. These ads may use cookies and tracking technologies to display relevant content. The presence of advertisements does not constitute an endorsement of the advertised products or services.</p>
        </section>

        <section>
          <h2 className="mb-3 font-display text-xl font-semibold text-foreground">External Links</h2>
          <p>Our website may contain links to third-party websites. We are not responsible for the content, privacy practices, or accuracy of information on external sites.</p>
        </section>

        <section>
          <h2 className="mb-3 font-display text-xl font-semibold text-foreground">Limitation of Liability</h2>
          <p>SnapClipper shall not be held liable for any damages resulting from the use or inability to use this service, including but not limited to direct, indirect, incidental, punitive, and consequential damages.</p>
        </section>
      </div>
    </main>
    <Footer />
  </div>
);

export default Disclaimer;

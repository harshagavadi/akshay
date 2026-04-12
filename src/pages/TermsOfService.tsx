import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const TermsOfService = () => (
  <div className="min-h-screen bg-background">
    <Helmet>
      <title>Terms of Service — SnapClipper</title>
      <meta name="description" content="SnapClipper terms of service. Understand the rules and guidelines for using our video downloader." />
    </Helmet>
    <Header />
    <main className="container mx-auto max-w-3xl px-4 py-16">
      <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">Terms of Service</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: March 8, 2026</p>

      <div className="mt-10 space-y-8 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="mb-3 font-display text-xl font-semibold text-foreground">1. Acceptance of Terms</h2>
          <p>By accessing and using SnapClipper ("the Service"), you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you may not use our Service.</p>
        </section>

        <section>
          <h2 className="mb-3 font-display text-xl font-semibold text-foreground">2. Description of Service</h2>
          <p>SnapClipper provides a free online video downloading tool that allows users to download publicly available videos from various platforms for personal, offline use. The Service acts as a tool and does not host, store, or distribute any video content.</p>
        </section>

        <section>
          <h2 className="mb-3 font-display text-xl font-semibold text-foreground">3. User Responsibilities</h2>
          <p>You agree to:</p>
          <ul className="mt-2 list-disc space-y-1 pl-6">
            <li>Use the Service only for lawful purposes and in compliance with all applicable laws</li>
            <li>Not download copyrighted content without proper authorization from the content owner</li>
            <li>Not redistribute, sell, or commercially exploit downloaded content without permission</li>
            <li>Not attempt to reverse-engineer, disrupt, or overload the Service</li>
            <li>Respect the intellectual property rights of content creators</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 font-display text-xl font-semibold text-foreground">4. Intellectual Property</h2>
          <p>All content downloaded through our Service belongs to its respective owners. SnapClipper does not claim ownership of any third-party content. Our Service's design, code, and branding are the intellectual property of SnapClipper.</p>
        </section>

        <section>
          <h2 className="mb-3 font-display text-xl font-semibold text-foreground">5. Disclaimer of Warranties</h2>
          <p>The Service is provided "as is" without warranties of any kind, either express or implied. We do not guarantee that the Service will be uninterrupted, error-free, or free of harmful components.</p>
        </section>

        <section>
          <h2 className="mb-3 font-display text-xl font-semibold text-foreground">6. Limitation of Liability</h2>
          <p>SnapClipper shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Service. Users are solely responsible for ensuring their use of downloaded content complies with applicable laws.</p>
        </section>

        <section>
          <h2 className="mb-3 font-display text-xl font-semibold text-foreground">7. Modifications</h2>
          <p>We reserve the right to modify these Terms at any time. Continued use of the Service after changes constitutes acceptance of the new Terms.</p>
        </section>

        <section>
          <h2 className="mb-3 font-display text-xl font-semibold text-foreground">8. Contact</h2>
          <p>For questions regarding these Terms, please visit our <a href="/contact" className="text-primary hover:underline">Contact page</a>.</p>
        </section>
      </div>
    </main>
    <Footer />
  </div>
);

export default TermsOfService;

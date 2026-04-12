import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const PrivacyPolicy = () => (
  <div className="min-h-screen bg-background">
    <Helmet>
      <title>Privacy Policy — SnapClipper</title>
      <meta name="description" content="SnapClipper privacy policy. Learn how we handle your data and protect your privacy." />
    </Helmet>
    <Header />
    <main className="container mx-auto max-w-3xl px-4 py-16">
      <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">Privacy Policy</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: March 8, 2026</p>

      <div className="mt-10 space-y-8 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="mb-3 font-display text-xl font-semibold text-foreground">1. Information We Collect</h2>
          <p>SnapClipper does not require user registration or login. We do not collect personal information such as names, email addresses, or phone numbers. When you use our service, we may automatically collect:</p>
          <ul className="mt-2 list-disc space-y-1 pl-6">
            <li>IP address (anonymized for analytics)</li>
            <li>Browser type and version</li>
            <li>Device type (desktop, mobile, tablet)</li>
            <li>Pages visited and time spent</li>
            <li>Referring website URL</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 font-display text-xl font-semibold text-foreground">2. How We Use Information</h2>
          <p>The limited information we collect is used solely to:</p>
          <ul className="mt-2 list-disc space-y-1 pl-6">
            <li>Improve our service performance and reliability</li>
            <li>Analyze usage patterns to enhance user experience</li>
            <li>Detect and prevent abuse or misuse of our service</li>
            <li>Display relevant advertisements through Google AdSense</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 font-display text-xl font-semibold text-foreground">3. Cookies and Tracking</h2>
          <p>We use cookies and similar tracking technologies to enhance your browsing experience. Third-party advertising partners, including Google AdSense, may use cookies to serve ads based on your prior visits to our website or other websites. You can opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Google Ads Settings</a>.</p>
        </section>

        <section>
          <h2 className="mb-3 font-display text-xl font-semibold text-foreground">4. Third-Party Services</h2>
          <p>We use the following third-party services:</p>
          <ul className="mt-2 list-disc space-y-1 pl-6">
            <li><strong>Google AdSense</strong> — for displaying advertisements. Google may use cookies to serve ads based on your browsing history.</li>
            <li><strong>Google Analytics</strong> — for understanding website traffic and usage patterns.</li>
          </ul>
          <p className="mt-2">These services have their own privacy policies governing data usage.</p>
        </section>

        <section>
          <h2 className="mb-3 font-display text-xl font-semibold text-foreground">5. Data Security</h2>
          <p>We implement appropriate security measures to protect any information processed through our service. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.</p>
        </section>

        <section>
          <h2 className="mb-3 font-display text-xl font-semibold text-foreground">6. Children's Privacy</h2>
          <p>Our service is not directed to children under the age of 13. We do not knowingly collect personal information from children.</p>
        </section>

        <section>
          <h2 className="mb-3 font-display text-xl font-semibold text-foreground">7. Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated revision date.</p>
        </section>

        <section>
          <h2 className="mb-3 font-display text-xl font-semibold text-foreground">8. Contact Us</h2>
          <p>If you have questions about this Privacy Policy, please visit our <a href="/contact" className="text-primary hover:underline">Contact page</a>.</p>
        </section>
      </div>
    </main>
    <Footer />
  </div>
);

export default PrivacyPolicy;

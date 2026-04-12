import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import YouTubePage from "./pages/YouTubePage";
import TikTokPage from "./pages/TikTokPage";
import InstagramPage from "./pages/InstagramPage";
import FacebookPage from "./pages/FacebookPage";
import TwitterPage from "./pages/TwitterPage";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import Disclaimer from "./pages/Disclaimer";
import NotFound from "./pages/NotFound";
import BlogPage from "./pages/BlogPage";
import BlogPostPage from "./pages/BlogPostPage";
import SupportedPlatformsPage from "./pages/SupportedPlatformsPage";
import CookieConsent from "./components/CookieConsent";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/youtube" element={<YouTubePage />} />
            <Route path="/tiktok" element={<TikTokPage />} />
            <Route path="/instagram" element={<InstagramPage />} />
            <Route path="/facebook" element={<FacebookPage />} />
            <Route path="/twitter" element={<TwitterPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/disclaimer" element={<Disclaimer />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
            <Route path="/platforms" element={<SupportedPlatformsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <CookieConsent />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;

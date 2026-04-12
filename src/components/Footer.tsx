import { Link } from "react-router-dom";
import favicon from "/favicon.png";
import {
  YouTubeIcon, TikTokIcon, InstagramIcon,
  FacebookIcon, TwitterXIcon, VimeoIcon,
} from "./SocialIcons";

const socialLinks = [
  { href: "https://youtube.com",   Icon: YouTubeIcon,   label: "YouTube",   color: "hover:text-red-500",    hoverBg: "hover:bg-red-500/10" },
  { href: "https://tiktok.com",    Icon: TikTokIcon,    label: "TikTok",    color: "hover:text-pink-500",   hoverBg: "hover:bg-pink-500/10" },
  { href: "https://instagram.com", Icon: InstagramIcon, label: "Instagram", color: "hover:text-orange-500", hoverBg: "hover:bg-orange-500/10" },
  { href: "https://facebook.com",  Icon: FacebookIcon,  label: "Facebook",  color: "hover:text-blue-500",   hoverBg: "hover:bg-blue-500/10" },
  { href: "https://twitter.com",   Icon: TwitterXIcon,  label: "Twitter/X", color: "hover:text-sky-500",    hoverBg: "hover:bg-sky-500/10" },
  { href: "https://vimeo.com",     Icon: VimeoIcon,     label: "Vimeo",     color: "hover:text-cyan-500",   hoverBg: "hover:bg-cyan-500/10" },
];

const Footer = () => {
  return (
    <footer className="border-t border-border/30 py-12">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand + social */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2.5">
              <img src={favicon} alt="SnapClipper icon" className="h-10 w-10 rounded-2xl" />
              <span className="font-display text-lg font-bold text-foreground">
                Snap<span className="text-gradient-green">Clipper</span>
              </span>
            </Link>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              The fastest free video downloader. Save videos from 20+ platforms in HD quality.
            </p>

            {/* Social media icons */}
            <div className="mt-5 flex flex-wrap gap-2">
              {socialLinks.map(({ href, Icon, label, color, hoverBg }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className={`flex h-9 w-9 items-center justify-center rounded-xl border border-border/60 bg-muted/40 text-muted-foreground transition-all duration-200 ${color} ${hoverBg} hover:border-transparent hover:scale-110`}
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Downloaders */}
          <div>
            <h4 className="mb-3 font-display text-sm font-semibold text-foreground">Downloaders</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/youtube"   className="transition-colors hover:text-primary">YouTube Downloader</Link></li>
              <li><Link to="/tiktok"    className="transition-colors hover:text-primary">TikTok Downloader</Link></li>
              <li><Link to="/instagram" className="transition-colors hover:text-primary">Instagram Downloader</Link></li>
              <li><Link to="/facebook"  className="transition-colors hover:text-primary">Facebook Downloader</Link></li>
              <li><Link to="/twitter"   className="transition-colors hover:text-primary">Twitter/X Downloader</Link></li>
              <li><Link to="/platforms" className="transition-colors hover:text-primary">All Supported Platforms</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="mb-3 font-display text-sm font-semibold text-foreground">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/about"   className="transition-colors hover:text-primary">About Us</Link></li>
              <li><Link to="/contact" className="transition-colors hover:text-primary">Contact</Link></li>
              <li><a href="/#faq"     className="transition-colors hover:text-primary">FAQ</a></li>
              <li><Link to="/blog"    className="transition-colors hover:text-primary">Blog</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="mb-3 font-display text-sm font-semibold text-foreground">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/privacy-policy"   className="transition-colors hover:text-primary">Privacy Policy</Link></li>
              <li><Link to="/terms-of-service" className="transition-colors hover:text-primary">Terms of Service</Link></li>
              <li><Link to="/disclaimer"        className="transition-colors hover:text-primary">Disclaimer</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-border/30 pt-6 text-center">
          <p className="text-xs text-muted-foreground/50">
            © 2026 SnapClipper. All rights reserved. SnapClipper does not host any video content. All trademarks belong to their respective owners.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

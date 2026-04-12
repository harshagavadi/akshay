import { useState, useEffect } from "react";
import { X, Cookie } from "lucide-react";
import { Link } from "react-router-dom";

const CONSENT_KEY = "snapclipper_cookie_consent";

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY);
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(CONSENT_KEY, "accepted");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem(CONSENT_KEY, "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 p-4 animate-in slide-in-from-bottom duration-500">
      <div className="mx-auto max-w-4xl rounded-2xl border border-border/60 bg-card/95 p-5 shadow-2xl backdrop-blur-xl sm:flex sm:items-start sm:gap-4">
        <div className="hidden sm:block rounded-xl bg-primary/10 p-2.5 text-primary">
          <Cookie className="h-6 w-6" />
        </div>

        <div className="flex-1 space-y-3">
          <p className="text-sm leading-relaxed text-muted-foreground">
            We use cookies and similar technologies to serve personalized ads via Google AdSense, analyze traffic, and improve your experience. By clicking <strong className="text-foreground">"Accept All"</strong>, you consent to the use of cookies.{" "}
            <Link to="/privacy-policy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
          </p>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={accept}
              className="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Accept All
            </button>
            <button
              onClick={decline}
              className="rounded-lg border border-border bg-background px-5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              Decline
            </button>
          </div>
        </div>

        <button
          onClick={decline}
          className="absolute right-3 top-3 rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground sm:static"
          aria-label="Close cookie banner"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default CookieConsent;

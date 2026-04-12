import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Mail, MessageSquare, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ContactPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;
    setSending(true);
    setTimeout(() => {
      setSending(false);
      toast({ title: "Message Sent!", description: "We'll get back to you within 24-48 hours." });
      setName("");
      setEmail("");
      setMessage("");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Contact Us — SnapClipper</title>
        <meta name="description" content="Get in touch with the SnapClipper team. We're here to help with any questions, feedback, or issues." />
      </Helmet>
      <Header />
      <main className="container mx-auto max-w-2xl px-4 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">Contact Us</h1>
          <p className="mt-3 text-muted-foreground">
            Have a question, suggestion, or issue? We'd love to hear from you. Fill out the form below and we'll respond within 24-48 hours.
          </p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mt-10 space-y-5"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-foreground">Name</label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" required className="bg-card" />
            </div>
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-foreground">Email</label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" required className="bg-card" />
            </div>
          </div>
          <div>
            <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-foreground">Message</label>
            <Textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="How can we help?" rows={6} required className="bg-card" />
          </div>
          <Button type="submit" disabled={sending} className="gradient-primary px-6 text-primary-foreground shadow-glow-sm hover:brightness-110">
            {sending ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                Sending...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Send className="h-4 w-4" />
                Send Message
              </span>
            )}
          </Button>
        </motion.form>

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-5 shadow-card">
            <Mail className="mb-3 h-6 w-6 text-primary" />
            <h3 className="font-display font-semibold text-foreground">Email Support</h3>
            <p className="mt-1 text-sm text-muted-foreground">support@snapclipper.com</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5 shadow-card">
            <MessageSquare className="mb-3 h-6 w-6 text-primary" />
            <h3 className="font-display font-semibold text-foreground">Response Time</h3>
            <p className="mt-1 text-sm text-muted-foreground">We respond within 24-48 hours</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ContactPage;

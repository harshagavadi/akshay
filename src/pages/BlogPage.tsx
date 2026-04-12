import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { ArrowRight, Clock, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { blogPosts } from "@/lib/blogData";

const BlogPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Blog — Video Download Tips, Guides & Tutorials | SnapClipper</title>
        <meta
          name="description"
          content="Read expert guides on downloading videos from YouTube, TikTok, Instagram & more. Tips on formats, quality, offline viewing, and privacy."
        />
        <link rel="canonical" href="https://www.snapclipper.com/blog" />
        <meta property="og:title" content="SnapClipper Blog — Video Download Tips & Guides" />
        <meta property="og:description" content="Expert guides on downloading videos from YouTube, TikTok, Instagram & 20+ platforms." />
        <meta property="og:url" content="https://www.snapclipper.com/blog" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            name: "SnapClipper Blog",
            description: "Expert tips, tutorials, and guides about downloading online videos.",
            url: "https://www.snapclipper.com/blog",
            publisher: {
              "@type": "Organization",
              name: "SnapClipper",
              logo: { "@type": "ImageObject", url: "https://www.snapclipper.com/favicon.png" },
            },
            blogPost: blogPosts.map((post) => ({
              "@type": "BlogPosting",
              headline: post.title,
              description: post.excerpt,
              datePublished: post.date,
              url: `https://www.snapclipper.com/blog/${post.slug}`,
            })),
          })}
        </script>
      </Helmet>
      <Header />

      <main className="container mx-auto px-4 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            <BookOpen className="h-7 w-7 text-primary" />
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">
            Tips, Guides & Tutorials
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
            Learn how to download videos from any platform, choose the right formats, manage your offline library, and stay safe while doing it.
          </p>
        </motion.div>

        <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((article, i) => (
            <Link to={`/blog/${article.slug}`} key={article.slug}>
              <motion.article
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-xl border border-border bg-card shadow-card transition-all hover:border-primary/30 hover:shadow-glow"
              >
                {article.image && (
                  <img
                    src={article.image}
                    alt={article.title}
                    className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                )}
                <div className="flex flex-1 flex-col p-5">
                  <div className="mb-3 flex items-center gap-3">
                    <span className="rounded-md bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                      {article.category}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {article.readTime}
                    </span>
                  </div>
                  <h2 className="font-display text-base font-semibold text-foreground transition-colors group-hover:text-primary">
                    {article.title}
                  </h2>
                  <p className="mt-2 flex-1 text-sm text-muted-foreground">
                    {article.excerpt}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{article.date}</span>
                    <span className="flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                      Read more <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </motion.article>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPage;

import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Clock, Calendar } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getBlogPost } from "@/lib/blogData";
import NotFound from "./NotFound";

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getBlogPost(slug) : undefined;

  if (!post) return <NotFound />;

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{post.title} — SnapClipper Blog</title>
        <meta name="description" content={post.excerpt} />
        <link rel="canonical" href={`https://www.snapclipper.com/blog/${post.slug}`} />
        <meta property="og:title" content={`${post.title} — SnapClipper`} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://www.snapclipper.com/blog/${post.slug}`} />
        {post.image && <meta property="og:image" content={`https://www.snapclipper.com${post.image}`} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.excerpt} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.excerpt,
            datePublished: post.date,
            image: post.image ? `https://www.snapclipper.com${post.image}` : undefined,
            author: { "@type": "Organization", name: "SnapClipper" },
            publisher: { "@type": "Organization", name: "SnapClipper", logo: { "@type": "ImageObject", url: "https://www.snapclipper.com/favicon.png" } },
            mainEntityOfPage: { "@type": "WebPage", "@id": `https://www.snapclipper.com/blog/${post.slug}` },
          })}
        </script>
      </Helmet>
      <Header />
      <main className="container mx-auto max-w-3xl px-4 py-16">
        <Link
          to="/#blog"
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Tips & Guides
        </Link>

        {post.image && (
          <img
            src={post.image}
            alt={post.title}
            className="mt-6 w-full rounded-xl object-cover shadow-lg"
            style={{ maxHeight: "400px" }}
            loading="lazy"
          />
        )}

        <span className="mt-6 inline-block rounded-md bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          {post.category}
        </span>

        <h1 className="mt-4 font-display text-3xl font-bold text-foreground md:text-4xl">
          {post.title}
        </h1>

        <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            {post.date}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            {post.readTime}
          </span>
        </div>

        <article className="mt-10 space-y-5 text-sm leading-relaxed text-muted-foreground">
          {post.content.map((paragraph, i) => {
            if (paragraph.startsWith("## ")) {
              return (
                <h2 key={i} className="!mt-8 font-display text-xl font-semibold text-foreground">
                  {paragraph.replace("## ", "")}
                </h2>
              );
            }
            if (paragraph.startsWith("**") && paragraph.includes(":**")) {
              const [bold, rest] = paragraph.split(":**");
              return (
                <p key={i}>
                  <strong className="text-foreground">{bold.replace(/\*\*/g, "")}:</strong>
                  {rest}
                </p>
              );
            }
            return <p key={i}>{paragraph}</p>;
          })}
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPostPage;

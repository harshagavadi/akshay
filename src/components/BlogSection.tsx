import { motion } from "framer-motion";
import { ArrowRight, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { blogPosts } from "@/lib/blogData";

const BlogSection = () => {
  return (
    <section className="border-t border-border/30 py-20" id="blog">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <span className="mb-3 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">Blog</span>
          <h2 className="font-display text-3xl font-bold text-foreground">
            Tips & Guides
          </h2>
          <p className="mt-2 text-muted-foreground">
            Learn how to get the most out of your video downloads
          </p>
          <Link
            to="/blog"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80"
          >
            View all articles <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="mx-auto grid max-w-5xl gap-5 sm:grid-cols-2">
          {blogPosts.map((article, i) => (
            <Link to={`/blog/${article.slug}`} key={article.slug}>
              <motion.article
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="group h-full cursor-pointer overflow-hidden rounded-xl border border-border bg-card shadow-card transition-all hover:border-primary/30 hover:shadow-glow"
              >
                {article.image && (
                  <img
                    src={article.image}
                    alt={article.title}
                    className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                )}
                <div className="p-6">
                <div className="mb-3 flex items-center gap-3">
                  <span className="rounded-md bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                    {article.category}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {article.readTime}
                  </span>
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground transition-colors group-hover:text-primary">
                  {article.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
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
      </div>
    </section>
  );
};

export default BlogSection;

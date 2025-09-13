import { Link, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import matter from "gray-matter";
import { useEffect, useState } from "react";

// This is a Vite feature to import all markdown files from a directory
const postModules = import.meta.glob('/contents/blog/*.md', { as: 'raw', eager: true });

interface Post {
  slug: string;
  title: string;
  date: Date;
  author: string;
  category: string;
  content: string;
}

export default function BlogPost() {
  const params = useParams();
  const slug = params.slug;
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const path = `/contents/blog/${slug}.md`;
    const rawContent = postModules[path];

    if (rawContent) {
      const { data, content } = matter(rawContent);
      setPost({
        slug: slug!,
        title: data.title || 'Untitled Post',
        date: data.date ? new Date(data.date) : new Date(),
        author: data.author || 'Anonymous',
        category: data.category || 'General',
        content: content,
      });
    }
    setLoading(false);
  }, [slug]);

  if (loading) {
    return (
      <div className="pt-16 min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="space-y-4">
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="pt-16 min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-3xl font-bold mb-4 text-card-foreground">Post Not Found</h1>
          <p className="text-muted-foreground mb-8">The blog post you're looking for doesn't exist.</p>
          <Link href="/blog">
            <Button>Back to Blog</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <Link href="/blog">
          <Button variant="ghost" className="mb-8" data-testid="button-back-to-blog">
            ← Back to Blog
          </Button>
        </Link>

        <article className="bg-card rounded-xl border border-border p-8 pixel-shadow" data-testid={`blog-post-full-${post.slug}`}>
          <header className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Badge className="bg-primary/10 text-primary" data-testid={`blog-post-category-${post.slug}`}>
                {post.category}
              </Badge>
              <span className="text-muted-foreground text-sm" data-testid={`blog-post-date-${post.slug}`}>
                {post.date.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
            <h1 className="text-4xl font-bold text-card-foreground mb-4" data-testid={`blog-post-title-${post.slug}`}>
              {post.title}
            </h1>
          </header>

          <div className="prose prose-lg max-w-none dark:prose-invert">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.content}
            </ReactMarkdown>
          </div>
        </article>
      </div>
    </div>
  );
}

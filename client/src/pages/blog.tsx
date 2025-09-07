import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { type BlogPost } from "@shared/schema";
import { parseMarkdown } from "@/lib/markdown";

export default function Blog() {
  const { data: posts, isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog-posts"],
  });

  if (isLoading) {
    return (
      <div className="pt-16 min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Latest News & Updates
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Stay updated with the latest server news, events, and community highlights.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="bg-card rounded-xl border border-border">
                <div className="w-full h-48 bg-muted animate-pulse"></div>
                <CardContent className="p-6">
                  <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-muted rounded w-1/4"></div>
                    <div className="h-6 bg-muted rounded w-3/4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded"></div>
                      <div className="h-4 bg-muted rounded"></div>
                      <div className="h-4 bg-muted rounded w-1/2"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'event':
        return 'bg-primary/10 text-primary';
      case 'update':
        return 'bg-accent/10 text-accent';
      case 'community':
        return 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getCategoryImage = (category: string) => {
    switch (category.toLowerCase()) {
      case 'event':
        return 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300';
      case 'update':
        return 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300';
      case 'community':
        return 'https://images.unsplash.com/photo-1590736969955-71cc94901144?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300';
      default:
        return 'https://images.unsplash.com/photo-1522383225653-ed111181a951?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300';
    }
  };

  return (
    <div className="pt-16 min-h-screen sakura-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent" data-testid="blog-title">
            Latest News & Updates
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto" data-testid="blog-description">
            Stay updated with the latest server news, events, and community highlights.
          </p>
        </div>

        {posts && posts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article key={post.id} className="bg-card/80 backdrop-blur-sm rounded-xl border border-border hover:shadow-xl transition-all hover:translate-y-[-4px] pixel-shadow group overflow-hidden" data-testid={`blog-post-${post.slug}`}>
                <img 
                  src={getCategoryImage(post.category)} 
                  alt={post.title} 
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform" 
                  data-testid={`blog-image-${post.slug}`}
                />
                <CardContent className="p-6">
                  <div className="flex items-center mb-3">
                    <Badge className={getCategoryColor(post.category)} data-testid={`blog-category-${post.slug}`}>
                      {post.category}
                    </Badge>
                    <span className="text-muted-foreground text-sm ml-auto" data-testid={`blog-date-${post.slug}`}>
                      {new Date(post.createdAt).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors" data-testid={`blog-title-${post.slug}`}>
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground mb-4" data-testid={`blog-excerpt-${post.slug}`}>
                    {post.excerpt}
                  </p>
                  <Link href={`/blog/${post.slug}`}>
                    <Button variant="ghost" className="text-primary hover:text-accent transition-colors p-0 h-auto font-medium" data-testid={`blog-read-more-${post.slug}`}>
                      Read More <ArrowRight className="ml-1 w-4 h-4" />
                    </Button>
                  </Link>
                </CardContent>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-2xl font-semibold mb-2 text-card-foreground">No Posts Yet</h3>
            <p className="text-muted-foreground">Check back soon for the latest news and updates!</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Individual blog post page component
export function BlogPost({ params }: { params: { slug: string } }) {
  const { data: post, isLoading } = useQuery<BlogPost>({
    queryKey: ["/api/blog-posts", params.slug],
  });

  if (isLoading) {
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
                {new Date(post.createdAt).toLocaleDateString('en-US', { 
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
          
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: parseMarkdown(post.content) }}
            data-testid={`blog-post-content-${post.slug}`}
          />
        </article>
      </div>
    </div>
  );
}

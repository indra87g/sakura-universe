import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { Navigation } from "@/components/navigation";
import Home from "@/pages/home";
import Blog, { BlogPost } from "@/pages/blog";
import Rules from "@/pages/rules";
import Guide from "@/pages/guide";
import Contact from "@/pages/contact";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/blog" component={Blog} />
      <Route path="/blog/:slug" component={BlogPost} />
      <Route path="/rules" component={Rules} />
      <Route path="/guide" component={Guide} />
      <Route path="/contact" component={Contact} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <div className="min-h-screen bg-background text-foreground">
            <Navigation />
            <main>
              <Router />
            </main>
            <Footer />
          </div>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

function Footer() {
  return (
    <footer className="bg-card border-t border-border py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center pixel-shadow">
                <span className="text-primary-foreground text-xs">🌸</span>
              </div>
              <span className="font-bold text-lg bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Sakura Universe
              </span>
            </div>
            <p className="text-muted-foreground text-sm mb-4">
              The most beautiful Minecraft server inspired by Japanese cherry blossoms.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="w-8 h-8 bg-muted hover:bg-primary text-muted-foreground hover:text-primary-foreground rounded-lg flex items-center justify-center transition-colors" data-testid="footer-twitter">
                <span className="text-sm">🐦</span>
              </a>
              <a href="#" className="w-8 h-8 bg-muted hover:bg-primary text-muted-foreground hover:text-primary-foreground rounded-lg flex items-center justify-center transition-colors" data-testid="footer-youtube">
                <span className="text-sm">📺</span>
              </a>
              <a href="#" className="w-8 h-8 bg-muted hover:bg-primary text-muted-foreground hover:text-primary-foreground rounded-lg flex items-center justify-center transition-colors" data-testid="footer-twitch">
                <span className="text-sm">🎮</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-card-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="text-muted-foreground hover:text-primary transition-colors" data-testid="footer-home">Home</a></li>
              <li><a href="/#features" className="text-muted-foreground hover:text-primary transition-colors" data-testid="footer-features">Features</a></li>
              <li><a href="/blog" className="text-muted-foreground hover:text-primary transition-colors" data-testid="footer-news">News</a></li>
              <li><a href="/rules" className="text-muted-foreground hover:text-primary transition-colors" data-testid="footer-rules">Rules</a></li>
              <li><a href="/guide" className="text-muted-foreground hover:text-primary transition-colors" data-testid="footer-guide">How to Join</a></li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="font-semibold text-card-foreground mb-4">Community</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors" data-testid="footer-discord">Discord Server</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors" data-testid="footer-forum">Forum</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors" data-testid="footer-gallery">Player Gallery</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors" data-testid="footer-events">Events</a></li>
              <li><a href="/contact" className="text-muted-foreground hover:text-primary transition-colors" data-testid="footer-contact">Contact</a></li>
            </ul>
          </div>

          {/* Server Info */}
          <div>
            <h3 className="font-semibold text-card-foreground mb-4">Server Info</h3>
            <div className="text-sm text-muted-foreground">
              <div className="mt-4">
                <a href="https://minecraftpocket-servers.com/server/130494/" target="_blank" rel="noopener noreferrer">
                  <img 
                    src="https://minecraftpocket-servers.com/server/130494/banners/banner-3.png" 
                    alt="Minecraft Pocket Servers" 
                    className="rounded border-0"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">
            © 2024 Sakura Universe. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0 text-sm">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors" data-testid="footer-privacy">Privacy Policy</a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors" data-testid="footer-terms">Terms of Service</a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors" data-testid="footer-refund">Refund Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default App;

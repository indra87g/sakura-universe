import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ServerStatusCard } from "@/components/server-status";
import { Link } from "wouter";
import { Zap, Users, Shield, Gift, Settings, Clock, ArrowRight } from "lucide-react";

export default function Home() {
  const features = [
    {
      icon: Zap,
      title: "Custom Game Modes",
      description: "Experience unique game modes including Survival+, Creative Building contests, PvP arenas, and exclusive mini-games.",
      gradient: "from-primary to-accent",
    },
    {
      icon: Users,
      title: "Active Community",
      description: "Join a welcoming community of over 10,000 players with dedicated Discord server and regular events.",
      gradient: "from-accent to-purple-600",
    },
    {
      icon: Shield,
      title: "Anti-Grief Protection",
      description: "Advanced protection systems keep your builds safe with claim blocks and rollback capabilities.",
      gradient: "from-purple-600 to-primary",
    },
    {
      icon: Gift,
      title: "Rewards System",
      description: "Earn coins through gameplay, daily rewards, and achievements to unlock cosmetics and perks.",
      gradient: "from-primary to-accent",
    },
    {
      icon: Settings,
      title: "Custom Plugins",
      description: "Exclusive plugins designed specifically for our server enhance gameplay with new mechanics.",
      gradient: "from-accent to-purple-600",
    },
    {
      icon: Clock,
      title: "24/7 Uptime",
      description: "Professional hosting with 99.9% uptime guarantee and lag-free experience for all players.",
      gradient: "from-purple-600 to-primary",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-16 min-h-screen sakura-bg relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-cover bg-center" 
             style={{backgroundImage: "url('https://images.unsplash.com/photo-1522383225653-ed111181a951?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')"}}></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <div className="text-center lg:text-left">
              <h1 className="text-5xl lg:text-7xl font-bold mb-6" data-testid="hero-title">
                <span className="bg-gradient-to-r from-primary via-accent to-purple-600 bg-clip-text text-transparent">
                  Sakura Universe
                </span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl" data-testid="hero-description">
                Experience the most beautiful and feature-rich Minecraft server inspired by Japanese cherry blossoms. 
                Join thousands of players in our magical pixelated world.
              </p>
              
              {/* Server Status */}
              <div className="mb-8">
                <ServerStatusCard />
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg pixel-shadow transition-all hover:translate-y-[-2px] hover:shadow-lg" data-testid="button-join-server">
                  Join Server Now
                </Button>
                <Button variant="outline" className="bg-card hover:bg-accent text-card-foreground hover:text-accent-foreground px-8 py-4 text-lg border border-border pixel-shadow transition-all hover:translate-y-[-2px] hover:shadow-lg" data-testid="button-watch-trailer">
                  Watch Trailer
                </Button>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative">
              <div className="bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl p-8 animate-float">
                <img 
                  src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                  alt="Minecraft cherry blossom landscape" 
                  className="rounded-xl shadow-2xl w-full h-auto pixel-shadow" 
                  data-testid="hero-image"
                />
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-accent rounded-full flex items-center justify-center animate-bounce-slow pixel-shadow">
                <span className="text-2xl">🌸</span>
              </div>
              <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-primary rounded-full flex items-center justify-center animate-float pixel-shadow">
                <span className="text-xl">⚡</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent" data-testid="features-title">
              Amazing Features
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto" data-testid="features-description">
              Discover all the incredible features that make Sakura Universe the perfect Minecraft server for players of all skill levels.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-card rounded-xl border border-border hover:shadow-xl transition-all hover:translate-y-[-4px] pixel-shadow group" data-testid={`feature-card-${index}`}>
                <CardContent className="p-8">
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3" data-testid={`feature-title-${index}`}>
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground" data-testid={`feature-description-${index}`}>
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sakura-bg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent" data-testid="cta-title">
            Ready to Start Your Adventure?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto" data-testid="cta-description">
            Join thousands of players in the most beautiful Minecraft server experience. Your journey in Sakura Universe awaits!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/guide">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg pixel-shadow transition-all hover:translate-y-[-2px] hover:shadow-lg" data-testid="button-join-guide">
                How to Join
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/blog">
              <Button variant="outline" className="bg-card hover:bg-accent text-card-foreground hover:text-accent-foreground px-8 py-4 text-lg border border-border pixel-shadow transition-all hover:translate-y-[-2px] hover:shadow-lg" data-testid="button-view-news">
                View Latest News
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

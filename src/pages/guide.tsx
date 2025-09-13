import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, HelpCircle, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Guide() {
  const { toast } = useToast();

  const copyServerIP = () => {
    navigator.clipboard.writeText("play.sakurauniverse.net");
    toast({
      title: "Copied!",
      description: "Server IP copied to clipboard",
    });
  };

  const steps = [
    {
      number: 1,
      title: "Launch Minecraft",
      description: "Make sure you have Minecraft Java Edition version 1.20.4 or later installed and running.",
      details: "Supported versions: 1.20.4 - 1.21.x",
      gradient: "from-primary to-accent",
    },
    {
      number: 2,
      title: "Add Server",
      description: "In Minecraft, go to \"Multiplayer\" → \"Add Server\" and enter our server details.",
      details: {
        name: "Sakura Universe",
        address: "play.sakurauniverse.net",
      },
      gradient: "from-accent to-purple-600",
    },
    {
      number: 3,
      title: "Join & Explore",
      description: "Connect to the server and follow the welcome tutorial to get started with your adventure!",
      gradient: "from-purple-600 to-primary",
    },
  ];

  return (
    <div className="pt-16 min-h-screen sakura-bg">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent" data-testid="guide-title">
            How to Join
          </h1>
          <p className="text-xl text-muted-foreground" data-testid="guide-description">
            Follow these simple steps to start playing on Sakura Universe.
          </p>
        </div>

        <div className="space-y-8">
          {steps.map((step) => (
            <Card key={step.number} className="bg-card/80 backdrop-blur-sm rounded-xl border border-border pixel-shadow" data-testid={`step-${step.number}`}>
              <CardContent className="p-8">
                <div className="flex items-start space-x-6">
                  <div className={`w-12 h-12 bg-gradient-to-br ${step.gradient} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <span className="text-primary-foreground font-bold text-lg">{step.number}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-3" data-testid={`step-title-${step.number}`}>
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground mb-4" data-testid={`step-description-${step.number}`}>
                      {step.description}
                    </p>
                    
                    {step.number === 1 && (
                      <div className="bg-muted p-3 rounded-lg">
                        <span className="text-sm text-muted-foreground">Supported versions:</span>
                        <Badge variant="secondary" className="ml-2 font-mono">
                          {step.details}
                        </Badge>
                      </div>
                    )}
                    
                    {step.number === 2 && (
                      <div className="bg-muted p-4 rounded-lg space-y-2">
                        <div>
                          <span className="text-sm text-muted-foreground">Server Name:</span>
                          <span className="font-mono text-card-foreground ml-2" data-testid="server-name">
                            {step.details.name}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-sm text-muted-foreground">Server Address:</span>
                            <span className="font-mono text-primary ml-2 font-semibold" data-testid="server-address">
                              {step.details.address}
                            </span>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={copyServerIP}
                            className="ml-2"
                            data-testid="button-copy-ip"
                          >
                            <Copy className="w-4 h-4 mr-1" />
                            Copy
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    {step.number === 3 && (
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground" data-testid="button-copy-server-ip">
                          Copy Server IP
                        </Button>
                        <Button variant="outline" className="border-border hover:bg-accent hover:text-accent-foreground" data-testid="button-join-discord">
                          Join Discord
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-12 bg-card/80 backdrop-blur-sm rounded-xl border border-border pixel-shadow">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-3 text-card-foreground" data-testid="help-title">Need Help?</h3>
            <p className="text-muted-foreground mb-4" data-testid="help-description">
              If you encounter any issues connecting to the server, our community is here to help!
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="outline" className="inline-flex items-center" data-testid="button-discord-support">
                <MessageCircle className="w-4 h-4 mr-2" />
                Discord Support
              </Button>
              <Button variant="outline" className="inline-flex items-center" data-testid="button-faq">
                <HelpCircle className="w-4 h-4 mr-2" />
                FAQ
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

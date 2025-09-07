import { Card, CardContent } from "@/components/ui/card";

export default function Rules() {
  const rules = [
    {
      title: "Respect All Players",
      description: "Be kind and respectful to all players regardless of their skill level, age, or background. No harassment, bullying, or discriminatory language will be tolerated.",
    },
    {
      title: "No Griefing or Stealing",
      description: "Do not destroy, modify, or steal from other players' builds without permission. This includes taking items from chests, farms, or storage areas.",
    },
    {
      title: "No Cheating or Exploits",
      description: "Use of hacks, cheats, exploits, or unfair advantages is strictly prohibited. This includes x-ray, fly hacks, duplication glitches, and similar violations.",
    },
    {
      title: "Build Appropriately",
      description: "Keep your builds family-friendly and appropriate. No offensive symbols, inappropriate structures, or content that violates community standards.",
    },
    {
      title: "Follow Staff Instructions",
      description: "Listen to and respect server staff members. If you have concerns about a staff decision, discuss it privately rather than arguing in public chat.",
    },
  ];

  return (
    <div className="pt-16 min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent" data-testid="rules-title">
            Server Rules
          </h1>
          <p className="text-xl text-muted-foreground" data-testid="rules-description">
            Please read and follow these rules to ensure a positive experience for all players.
          </p>
        </div>

        <Card className="bg-card rounded-2xl border border-border pixel-shadow">
          <CardContent className="p-8">
            <div className="space-y-8">
              {rules.map((rule, index) => (
                <div key={index} className="flex items-start space-x-4" data-testid={`rule-${index + 1}`}>
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-primary-foreground font-bold text-sm">{index + 1}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2" data-testid={`rule-title-${index + 1}`}>
                      {rule.title}
                    </h3>
                    <p className="text-muted-foreground" data-testid={`rule-description-${index + 1}`}>
                      {rule.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 bg-muted rounded-xl border-l-4 border-primary">
              <h4 className="font-semibold text-card-foreground mb-2" data-testid="consequences-title">Consequences</h4>
              <p className="text-muted-foreground text-sm" data-testid="consequences-description">
                Violations may result in warnings, temporary bans, or permanent bans depending on severity. 
                For questions about rules or to report violations, contact staff through Discord or in-game commands.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

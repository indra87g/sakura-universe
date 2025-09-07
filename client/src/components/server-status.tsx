import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { type ServerStatus } from "@shared/schema";

interface MinecraftServer {
  id: string;
  name: string;
  description: string;
  host: string;
  port: number;
  isDefault: boolean;
  features: string[];
  motdFallback: string;
}

interface ExtendedServerStatus extends ServerStatus {
  name?: string;
  description?: string;
  features?: string[];
  port?: number;
  motd?: string;
}

export function ServerStatusCard() {
  const [selectedServerId, setSelectedServerId] = useState<string>("");

  // Get list of servers
  const { data: servers } = useQuery<MinecraftServer[]>({
    queryKey: ["/api/servers"],
  });

  // Get status for selected server (or default)
  const { data: status, isLoading } = useQuery<ExtendedServerStatus>({
    queryKey: ["/api/server-status", selectedServerId],
    queryFn: async () => {
      const url = (selectedServerId && selectedServerId !== "default")
        ? `/api/server-status?id=${selectedServerId}`
        : "/api/server-status";
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch server status");
      return response.json();
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  if (isLoading) {
    return (
      <Card className="bg-card/80 backdrop-blur-sm pixel-shadow">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-1/3"></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-8 bg-muted rounded"></div>
              <div className="h-8 bg-muted rounded"></div>
            </div>
            <div className="h-12 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!status) {
    return (
      <Card className="bg-card/80 backdrop-blur-sm pixel-shadow">
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            Server status unavailable
          </div>
        </CardContent>
      </Card>
    );
  }

  const isOnline = status.status === "ONLINE";

  return (
    <Card className="bg-card/80 backdrop-blur-sm pixel-shadow" data-testid="server-status">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-card-foreground">
            {status.name || "Server Status"}
          </h3>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full animate-pulse-slow ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <Badge variant={isOnline ? "default" : "destructive"} className="font-mono text-sm" data-testid="server-status-badge">
              {status.status}
            </Badge>
          </div>
        </div>

        {/* Server Selection Dropdown */}
        {servers && servers.length > 1 && (
          <div className="mb-4">
            <Select value={selectedServerId} onValueChange={setSelectedServerId}>
              <SelectTrigger className="w-full" data-testid="server-selector">
                <SelectValue placeholder="Select a server" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default Server</SelectItem>
                {servers.map((server) => (
                  <SelectItem key={server.id} value={server.id}>
                    {server.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Server Description */}
        {status.description && (
          <div className="mb-4 text-sm text-muted-foreground">
            {status.description}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary font-mono" data-testid="player-count">
              {status.playerCount}
            </div>
            <div className="text-sm text-muted-foreground">Players Online</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent font-mono" data-testid="server-version">
              {status.version}
            </div>
            <div className="text-sm text-muted-foreground">Server Version</div>
          </div>
        </div>

        {/* Server Features */}
        {status.features && status.features.length > 0 && (
          <div className="mb-4">
            <div className="text-sm text-muted-foreground mb-2">Features:</div>
            <div className="flex flex-wrap gap-1">
              {status.features.map((feature, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {feature}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="p-3 bg-muted rounded-lg space-y-2">
          <div>
            <div className="text-sm text-muted-foreground">Server IP:</div>
            <code className="font-mono text-primary font-semibold" data-testid="server-ip">
              {status.ip}{status.port && status.port !== 25565 ? `:${status.port}` : ''}
            </code>
          </div>
          {status.motd && (
            <div>
              <div className="text-sm text-muted-foreground">MOTD:</div>
              <div className="text-sm text-card-foreground" data-testid="server-motd">
                {status.motd}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

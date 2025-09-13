import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Hardcoded server list from config.json
const servers: MinecraftServer[] = [
    {
      "id": "main",
      "name": "Sakura Universe",
      "description": "Main server with survival and creative modes",
      "host": "veda.hidencloud.com",
      "port": 24689,
      "type": "bedrock",
      "isDefault": true,
      "features": ["Survival", "Creative", "PvP", "Events", "Cross-platform"],
      "motdFallback": "Sakura Universe - Cherry Blossom Minecraft Server"
    },
    {
      "id": "creative",
      "name": "Sakura Creative",
      "description": "Creative building server",
      "host": "creative.sakurauniverse.net",
      "port": 25566,
      "isDefault": false,
      "features": ["Creative", "WorldEdit", "Plots"],
      "motdFallback": "Sakura Creative - Build Your Dreams"
    },
    {
      "id": "pvp",
      "name": "Sakura PvP",
      "description": "Competitive PvP battles",
      "host": "pvp.sakurauniverse.net",
      "port": 25567,
      "isDefault": false,
      "features": ["PvP", "KitPvP", "Tournaments"],
      "motdFallback": "Sakura PvP - Battle Arena"
    }
  ];

// Interfaces previously in @shared/schema
interface MinecraftServer {
  id: string;
  name: string;
  description: string;
  host: string;
  port: number;
  isDefault: boolean;
  features: string[];
  motdFallback: string;
  type?: "java" | "bedrock";
}

interface ExtendedServerStatus {
    id: string;
    name: string;
    description: string;
    status: 'ONLINE' | 'OFFLINE';
    playerCount: string;
    maxPlayers: string;
    version: string;
    ip: string;
    port: number;
    motd: string;
    features: string[];
    isDefault: boolean;
    updatedAt: Date;
}

// Helper to fetch and transform server status from mcstatus.io
async function fetchServerStatus(server: MinecraftServer): Promise<ExtendedServerStatus> {
    try {
        const response = await fetch(`https://api.mcstatus.io/v2/status/bedrock/${server.host}:${server.port}`);

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`API error for ${server.name}: ${response.status} ${errorText}`);
            throw new Error(`API responded with ${response.status}`);
        }

        const data = await response.json();

        if (data.online) {
            return {
                id: server.id,
                name: server.name,
                description: server.description,
                status: "ONLINE",
                playerCount: data.players?.online?.toString() || "0",
                maxPlayers: data.players?.max?.toString() || "Unknown",
                version: data.version?.name || "Bedrock",
                ip: server.host,
                port: server.port,
                updatedAt: new Date(),
                motd: data.motd?.clean || data.motd?.raw || server.motdFallback,
                features: [...(server.features || []), "Bedrock Edition"],
                isDefault: server.isDefault
            };
        } else {
            throw new Error("Server reported as offline");
        }
    } catch (error) {
        console.error(`Failed to fetch status for ${server.name}:`, error);
        return {
            id: server.id,
            name: server.name,
            description: server.description,
            status: "OFFLINE",
            playerCount: "0",
            maxPlayers: "Unknown",
            version: "Unknown",
            ip: server.host,
            port: server.port,
            updatedAt: new Date(),
            motd: server.motdFallback + " (Offline)",
            features: [...(server.features || []), "Bedrock Edition"],
            isDefault: server.isDefault
        };
    }
}

export function ServerStatusCard() {
  const [selectedServerId, setSelectedServerId] = useState<string>("default");

  const { data: status, isLoading } = useQuery<ExtendedServerStatus>({
    queryKey: ["server-status", selectedServerId],
    queryFn: async () => {
      let targetServer: MinecraftServer | undefined;

      if (selectedServerId === "default") {
        targetServer = servers.find(s => s.isDefault) || servers[0];
      } else {
        targetServer = servers.find(s => s.id === selectedServerId);
      }

      if (!targetServer) {
        // This should not happen if servers are configured
        throw new Error("Server not found");
      }

      return fetchServerStatus(targetServer);
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
                <SelectItem value="default">Default Server ({servers.find(s => s.isDefault)?.name || servers[0].name})</SelectItem>
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
              {status.ip}{status.port && status.port !== 19132 ? `:${status.port}` : ''}
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

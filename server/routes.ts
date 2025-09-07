import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactMessageSchema } from "@shared/schema";
import { status } from "minecraft-server-util";
import { readFileSync } from "fs";
import { join } from "path";

// Load server configuration
const configPath = join(process.cwd(), "config.json");
const config = JSON.parse(readFileSync(configPath, "utf-8"));

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

// Helper function to detect server type based on port
function detectServerType(server: MinecraftServer): "java" | "bedrock" {
  if (server.type) return server.type;
  
  // Auto-detect based on common ports
  if (server.port === 19132 || server.port === 19133) return "bedrock";
  if (server.port === 25565 || server.port >= 25566) return "java";
  
  // Fallback: check if port is in Bedrock range (wider range for custom ports)
  return server.port >= 19130 && server.port <= 19140 ? "bedrock" : "java";
}

// Fallback function using mcstatus.io API for Bedrock servers
async function queryBedrockServer(server: MinecraftServer) {
  try {
    // Use mcstatus.io API for reliable Bedrock server detection
    const response = await fetch(
      `https://api.mcstatus.io/v2/status/bedrock/${server.host}:${server.port}`
    );
    
    if (!response.ok) throw new Error(`API responded with ${response.status}`);
    
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
    throw error;
  }
}

// Helper function to query a specific server
async function queryMinecraftServer(server: MinecraftServer) {
  const serverType = detectServerType(server);
  
  try {
    // First, try minecraft-server-util (works well for Java, sometimes for Bedrock)
    const result = await status(server.host, server.port, {
      timeout: config.settings.queryTimeout || 5000
    });
    
    return {
      id: server.id,
      name: server.name,
      description: server.description,
      status: "ONLINE",
      playerCount: result.players.online.toString(),
      maxPlayers: result.players.max.toString(),
      version: result.version.name,
      ip: server.host,
      port: server.port,
      updatedAt: new Date(),
      motd: result.motd.clean || server.motdFallback,
      features: [...(server.features || []), serverType === "bedrock" ? "Bedrock Edition" : "Java Edition"],
      isDefault: server.isDefault
    };
  } catch (error) {
    // If minecraft-server-util fails and this is likely a Bedrock server, try mcstatus.io
    if (serverType === "bedrock") {
      try {
        return await queryBedrockServer(server);
      } catch (bedrockError) {
        console.error(`Bedrock fallback failed for ${server.host}:${server.port}:`, bedrockError instanceof Error ? bedrockError.message : String(bedrockError));
      }
    }
    
    // If all methods fail, return offline status
    console.error(`All query methods failed for ${server.host}:${server.port}:`, error instanceof Error ? error.message : String(error));
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
      features: [...(server.features || []), serverType === "bedrock" ? "Bedrock Edition" : "Java Edition"],
      isDefault: server.isDefault
    };
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all servers list
  app.get("/api/servers", async (_req, res) => {
    try {
      res.json(config.servers);
    } catch (error) {
      console.error("Servers list error:", error);
      res.status(500).json({ message: "Failed to fetch servers list" });
    }
  });

  // Get status of all servers
  app.get("/api/servers/status", async (_req, res) => {
    try {
      const servers = config.servers as MinecraftServer[];
      const statusPromises = servers.map(server => queryMinecraftServer(server));
      const statuses = await Promise.all(statusPromises);
      
      res.json(statuses);
    } catch (error) {
      console.error("Servers status error:", error);
      res.status(500).json({ message: "Failed to fetch servers status" });
    }
  });

  // Get server status (default server or specific server by ID)
  app.get("/api/server-status", async (req, res) => {
    try {
      const serverId = req.query.id as string;
      const servers = config.servers as MinecraftServer[];
      
      let targetServer: MinecraftServer;
      
      if (serverId) {
        // Find specific server by ID
        const foundServer = servers.find(s => s.id === serverId);
        if (!foundServer) {
          return res.status(404).json({ message: "Server not found" });
        }
        targetServer = foundServer;
      } else {
        // Use default server
        const defaultServer = servers.find(s => s.isDefault) || servers[0];
        if (!defaultServer) {
          return res.status(500).json({ message: "No servers configured" });
        }
        targetServer = defaultServer;
      }
      
      const serverStatus = await queryMinecraftServer(targetServer);
      res.json(serverStatus);
    } catch (error) {
      console.error("Server status error:", error);
      res.status(500).json({ message: "Failed to fetch server status" });
    }
  });

  // Get specific server status by ID
  app.get("/api/servers/:id/status", async (req, res) => {
    try {
      const serverId = req.params.id;
      const servers = config.servers as MinecraftServer[];
      const targetServer = servers.find(s => s.id === serverId);
      
      if (!targetServer) {
        return res.status(404).json({ message: "Server not found" });
      }
      
      const serverStatus = await queryMinecraftServer(targetServer);
      res.json(serverStatus);
    } catch (error) {
      console.error("Server status error:", error);
      res.status(500).json({ message: "Failed to fetch server status" });
    }
  });

  // Get blog posts
  app.get("/api/blog-posts", async (_req, res) => {
    try {
      const posts = await storage.getBlogPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  // Get single blog post
  app.get("/api/blog-posts/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const post = await storage.getBlogPost(slug);
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch blog post" });
    }
  });

  // Submit contact message
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactMessageSchema.parse(req.body);
      const message = await storage.createContactMessage(validatedData);
      res.status(201).json({ message: "Message sent successfully", id: message.id });
    } catch (error) {
      res.status(400).json({ message: "Invalid message data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

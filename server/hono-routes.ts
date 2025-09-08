import { Hono } from "hono";
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

const app = new Hono();

// Get all servers list
app.get("/api/servers", async (c) => {
  try {
    return c.json(config.servers);
  } catch (error) {
    console.error("Servers list error:", error);
    return c.json({ message: "Failed to fetch servers list" }, 500);
  }
});

// Get status of all servers
app.get("/api/servers/status", async (c) => {
  try {
    const servers = config.servers as MinecraftServer[];
    const statusPromises = servers.map(server => queryMinecraftServer(server));
    const statuses = await Promise.all(statusPromises);

    return c.json(statuses);
  } catch (error) {
    console.error("Servers status error:", error);
    return c.json({ message: "Failed to fetch servers status" }, 500);
  }
});

// Get server status (default server or specific server by ID)
app.get("/api/server-status", async (c) => {
  try {
    const serverId = c.req.query('id');
    const servers = config.servers as MinecraftServer[];

    let targetServer: MinecraftServer;

    if (serverId) {
      // Find specific server by ID
      const foundServer = servers.find(s => s.id === serverId);
      if (!foundServer) {
        return c.json({ message: "Server not found" }, 404);
      }
      targetServer = foundServer;
    } else {
      // Use default server
      const defaultServer = servers.find(s => s.isDefault) || servers[0];
      if (!defaultServer) {
        return c.json({ message: "No servers configured" }, 500);
      }
      targetServer = defaultServer;
    }

    const serverStatus = await queryMinecraftServer(targetServer);
    return c.json(serverStatus);
  } catch (error) {
    console.error("Server status error:", error);
    return c.json({ message: "Failed to fetch server status" }, 500);
  }
});

// Get specific server status by ID
app.get("/api/servers/:id/status", async (c) => {
  try {
    const serverId = c.req.param('id');
    const servers = config.servers as MinecraftServer[];
    const targetServer = servers.find(s => s.id === serverId);

    if (!targetServer) {
      return c.json({ message: "Server not found" }, 404);
    }

    const serverStatus = await queryMinecraftServer(targetServer);
    return c.json(serverStatus);
  } catch (error) {
    console.error("Server status error:", error);
    return c.json({ message: "Failed to fetch server status" }, 500);
  }
});

// Get blog posts
app.get("/api/blog-posts", async (c) => {
  try {
    const posts = await storage.getBlogPosts();
    return c.json(posts);
  } catch (error) {
    return c.json({ message: "Failed to fetch blog posts" }, 500);
  }
});

// Get single blog post
app.get("/api/blog-posts/:slug", async (c) => {
  try {
    const { slug } = c.req.param();
    const post = await storage.getBlogPost(slug);
    if (!post) {
      return c.json({ message: "Blog post not found" }, 404);
    }
    return c.json(post);
  } catch (error) {
    return c.json({ message: "Failed to fetch blog post" }, 500);
  }
});

// Submit contact message
app.post("/api/contact", async (c) => {
  try {
    const body = await c.req.json();
    const validatedData = insertContactMessageSchema.parse(body);
    const message = await storage.createContactMessage(validatedData);
    return c.json({ message: "Message sent successfully", id: message.id }, 201);
  } catch (error) {
    return c.json({ message: "Invalid message data" }, 400);
  }
});

export default app;

import { type User, type InsertUser, type BlogPost, type InsertBlogPost, type ServerStatus, type InsertServerStatus, type ContactMessage, type InsertContactMessage } from "@shared/schema";
import { randomUUID } from "crypto";
import Database from "better-sqlite3";
import { join } from "path";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getBlogPosts(): Promise<BlogPost[]>;
  getBlogPost(slug: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  
  getServerStatus(): Promise<ServerStatus | undefined>;
  updateServerStatus(status: InsertServerStatus): Promise<ServerStatus>;
  
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private blogPosts: Map<string, BlogPost>;
  private serverStatus: ServerStatus | undefined;
  private contactMessages: Map<string, ContactMessage>;

  constructor() {
    this.users = new Map();
    this.blogPosts = new Map();
    this.contactMessages = new Map();
    
    // Initialize with sample blog posts
    this.initializeBlogPosts();
    this.initializeServerStatus();
  }

  private initializeBlogPosts() {
    const posts: BlogPost[] = [
      {
        id: randomUUID(),
        title: "Cherry Blossom Festival 2024",
        slug: "cherry-blossom-festival-2024",
        content: `# Cherry Blossom Festival 2024

Join us for our annual Cherry Blossom Festival featuring exclusive builds, limited-time rewards, and community events!

## Event Details

- **Duration**: March 15-31, 2024
- **Special Rewards**: Cherry Blossom themed items
- **Building Contest**: Win exclusive prizes
- **Community Events**: Daily activities and challenges

## How to Participate

1. Log into the server during the event period
2. Visit the Festival Hub at spawn
3. Complete daily challenges for rewards
4. Participate in building contests
5. Join community events throughout the festival

Don't miss this magical celebration of spring!`,
        excerpt: "Join us for our annual Cherry Blossom Festival featuring exclusive builds, limited-time rewards, and community events...",
        category: "Event",
        published: true,
        createdAt: new Date("2024-03-15"),
        updatedAt: new Date("2024-03-15"),
      },
      {
        id: randomUUID(),
        title: "Server Update v2.4 Released",
        slug: "server-update-v2-4-released",
        content: `# Server Update v2.4 Released

Major update brings new features including enhanced PvP mechanics, custom enchantments, and performance improvements.

## New Features

### Enhanced PvP System
- New combat mechanics
- Balanced weapon systems
- Tournament modes

### Custom Enchantments
- 15 new enchantments
- Unique effects
- Balanced progression

### Performance Improvements
- Reduced lag
- Faster chunk loading
- Optimized plugins

## Bug Fixes

- Fixed inventory duplication
- Resolved chunk loading issues
- Improved server stability

Update your client and enjoy the new features!`,
        excerpt: "Major update brings new features including enhanced PvP mechanics, custom enchantments, and performance improvements...",
        category: "Update",
        published: true,
        createdAt: new Date("2024-03-10"),
        updatedAt: new Date("2024-03-10"),
      },
      {
        id: randomUUID(),
        title: "Player Spotlight: Amazing Builds",
        slug: "player-spotlight-amazing-builds",
        content: `# Player Spotlight: Amazing Builds

Showcasing incredible player creations from our community including a massive Japanese castle and pixel art.

## Featured Builds

### Japanese Castle by SakuraBuilder
This magnificent castle took over 200 hours to complete and features:
- Authentic Japanese architecture
- Multiple buildings and courtyards
- Beautiful garden areas
- Cherry blossom trees throughout

### Pixel Art Gallery by ArtMaster
An impressive collection of pixel art including:
- Famous anime characters
- Landscapes and scenery
- Original artwork
- Interactive displays

## How to Visit

Use \`/warp builds\` to visit our community showcase area and see these amazing creations in person!

Want your build featured? Submit it through our Discord server.`,
        excerpt: "Showcasing incredible player creations from our community including a massive Japanese castle and pixel art...",
        category: "Community",
        published: true,
        createdAt: new Date("2024-03-05"),
        updatedAt: new Date("2024-03-05"),
      },
    ];

    posts.forEach(post => {
      this.blogPosts.set(post.slug, post);
    });
  }

  private initializeServerStatus() {
    this.serverStatus = {
      id: randomUUID(),
      status: "ONLINE",
      playerCount: "1,247",
      maxPlayers: "2,000",
      version: "1.20.4",
      ip: "play.sakurauniverse.net",
      updatedAt: new Date(),
    };
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values())
      .filter(post => post.published)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getBlogPost(slug: string): Promise<BlogPost | undefined> {
    return this.blogPosts.get(slug);
  }

  async createBlogPost(insertPost: InsertBlogPost): Promise<BlogPost> {
    const id = randomUUID();
    const now = new Date();
    const post: BlogPost = {
      ...insertPost,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.blogPosts.set(post.slug, post);
    return post;
  }

  async getServerStatus(): Promise<ServerStatus | undefined> {
    return this.serverStatus;
  }

  async updateServerStatus(insertStatus: InsertServerStatus): Promise<ServerStatus> {
    const id = this.serverStatus?.id || randomUUID();
    const status: ServerStatus = {
      ...insertStatus,
      id,
      updatedAt: new Date(),
    };
    this.serverStatus = status;
    return status;
  }

  async createContactMessage(insertMessage: InsertContactMessage): Promise<ContactMessage> {
    const id = randomUUID();
    const message: ContactMessage = {
      ...insertMessage,
      id,
      createdAt: new Date(),
    };
    this.contactMessages.set(id, message);
    return message;
  }
}

export class SQLiteStorage implements IStorage {
  private db: Database.Database;

  constructor() {
    this.db = new Database(join(process.cwd(), "database.sqlite"));
    this.initializeTables();
    this.initializeData();
  }

  private initializeTables() {
    // Create tables if they don't exist
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS blog_posts (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        content TEXT NOT NULL,
        excerpt TEXT NOT NULL,
        category TEXT NOT NULL,
        published INTEGER NOT NULL DEFAULT 0,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS server_status (
        id TEXT PRIMARY KEY,
        status TEXT NOT NULL,
        player_count TEXT NOT NULL,
        max_players TEXT NOT NULL,
        version TEXT NOT NULL,
        ip TEXT NOT NULL,
        updated_at INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS contact_messages (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        subject TEXT NOT NULL,
        message TEXT NOT NULL,
        created_at INTEGER NOT NULL
      );
    `);
  }

  private initializeData() {
    // Check if data already exists
    const blogCount = this.db.prepare("SELECT COUNT(*) as count FROM blog_posts").get() as { count: number };
    const statusCount = this.db.prepare("SELECT COUNT(*) as count FROM server_status").get() as { count: number };

    if (blogCount.count === 0) {
      this.initializeBlogPosts();
    }

    if (statusCount.count === 0) {
      this.initializeServerStatus();
    }
  }

  private initializeBlogPosts() {
    const insertPost = this.db.prepare(`
      INSERT INTO blog_posts (id, title, slug, content, excerpt, category, published, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const posts = [
      {
        id: randomUUID(),
        title: "Cherry Blossom Festival 2024",
        slug: "cherry-blossom-festival-2024",
        content: `# Cherry Blossom Festival 2024

Join us for our annual Cherry Blossom Festival featuring exclusive builds, limited-time rewards, and community events!

## Event Details

- **Duration**: March 15-31, 2024
- **Special Rewards**: Cherry Blossom themed items
- **Building Contest**: Win exclusive prizes
- **Community Events**: Daily activities and challenges

## How to Participate

1. Log into the server during the event period
2. Visit the Festival Hub at spawn
3. Complete daily challenges for rewards
4. Participate in building contests
5. Join community events throughout the festival

Don't miss this magical celebration of spring!`,
        excerpt: "Join us for our annual Cherry Blossom Festival featuring exclusive builds, limited-time rewards, and community events...",
        category: "Event",
        published: 1,
        createdAt: new Date("2024-03-15").getTime(),
        updatedAt: new Date("2024-03-15").getTime(),
      },
      {
        id: randomUUID(),
        title: "Server Update v2.4 Released",
        slug: "server-update-v2-4-released",
        content: `# Server Update v2.4 Released

Major update brings new features including enhanced PvP mechanics, custom enchantments, and performance improvements.

## New Features

### Enhanced PvP System
- New combat mechanics
- Balanced weapon systems
- Tournament modes

### Custom Enchantments
- 15 new enchantments
- Unique effects
- Balanced progression

### Performance Improvements
- Reduced lag
- Faster chunk loading
- Optimized plugins

## Bug Fixes

- Fixed inventory duplication
- Resolved chunk loading issues
- Improved server stability

Update your client and enjoy the new features!`,
        excerpt: "Major update brings new features including enhanced PvP mechanics, custom enchantments, and performance improvements...",
        category: "Update",
        published: 1,
        createdAt: new Date("2024-03-10").getTime(),
        updatedAt: new Date("2024-03-10").getTime(),
      },
      {
        id: randomUUID(),
        title: "Player Spotlight: Amazing Builds",
        slug: "player-spotlight-amazing-builds",
        content: `# Player Spotlight: Amazing Builds

Showcasing incredible player creations from our community including a massive Japanese castle and pixel art.

## Featured Builds

### Japanese Castle by SakuraBuilder
This magnificent castle took over 200 hours to complete and features:
- Authentic Japanese architecture
- Multiple buildings and courtyards
- Beautiful garden areas
- Cherry blossom trees throughout

### Pixel Art Gallery by ArtMaster
An impressive collection of pixel art including:
- Famous anime characters
- Landscapes and scenery
- Original artwork
- Interactive displays

## How to Visit

Use \`/warp builds\` to visit our community showcase area and see these amazing creations in person!

Want your build featured? Submit it through our Discord server.`,
        excerpt: "Showcasing incredible player creations from our community including a massive Japanese castle and pixel art...",
        category: "Community",
        published: 1,
        createdAt: new Date("2024-03-05").getTime(),
        updatedAt: new Date("2024-03-05").getTime(),
      },
    ];

    for (const post of posts) {
      insertPost.run(
        post.id,
        post.title,
        post.slug,
        post.content,
        post.excerpt,
        post.category,
        post.published,
        post.createdAt,
        post.updatedAt
      );
    }
  }

  private initializeServerStatus() {
    const insertStatus = this.db.prepare(`
      INSERT INTO server_status (id, status, player_count, max_players, version, ip, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    insertStatus.run(
      randomUUID(),
      "ONLINE",
      "1,247",
      "2,000",
      "1.20.4",
      "play.sakurauniverse.net",
      Date.now()
    );
  }

  async getUser(id: string): Promise<User | undefined> {
    const stmt = this.db.prepare("SELECT * FROM users WHERE id = ?");
    const user = stmt.get(id) as User | undefined;
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const stmt = this.db.prepare("SELECT * FROM users WHERE username = ?");
    const user = stmt.get(username) as User | undefined;
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const stmt = this.db.prepare("INSERT INTO users (id, username, password) VALUES (?, ?, ?)");
    stmt.run(id, insertUser.username, insertUser.password);
    return { id, ...insertUser };
  }

  async getBlogPosts(): Promise<BlogPost[]> {
    const stmt = this.db.prepare(`
      SELECT id, title, slug, content, excerpt, category, published, 
             created_at as createdAt, updated_at as updatedAt 
      FROM blog_posts 
      WHERE published = 1 
      ORDER BY created_at DESC
    `);
    const posts = stmt.all() as any[];
    return posts.map(post => ({
      ...post,
      published: Boolean(post.published),
      createdAt: new Date(post.createdAt),
      updatedAt: new Date(post.updatedAt),
    }));
  }

  async getBlogPost(slug: string): Promise<BlogPost | undefined> {
    const stmt = this.db.prepare(`
      SELECT id, title, slug, content, excerpt, category, published, 
             created_at as createdAt, updated_at as updatedAt 
      FROM blog_posts 
      WHERE slug = ?
    `);
    const post = stmt.get(slug) as any;
    if (!post) return undefined;
    
    return {
      ...post,
      published: Boolean(post.published),
      createdAt: new Date(post.createdAt),
      updatedAt: new Date(post.updatedAt),
    };
  }

  async createBlogPost(insertPost: InsertBlogPost): Promise<BlogPost> {
    const id = randomUUID();
    const now = Date.now();
    const stmt = this.db.prepare(`
      INSERT INTO blog_posts (id, title, slug, content, excerpt, category, published, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      id,
      insertPost.title,
      insertPost.slug,
      insertPost.content,
      insertPost.excerpt,
      insertPost.category,
      insertPost.published ? 1 : 0,
      now,
      now
    );

    return {
      id,
      ...insertPost,
      createdAt: new Date(now),
      updatedAt: new Date(now),
    };
  }

  async getServerStatus(): Promise<ServerStatus | undefined> {
    const stmt = this.db.prepare(`
      SELECT id, status, player_count as playerCount, max_players as maxPlayers, 
             version, ip, updated_at as updatedAt 
      FROM server_status 
      ORDER BY updated_at DESC 
      LIMIT 1
    `);
    const status = stmt.get() as any;
    if (!status) return undefined;
    
    return {
      ...status,
      updatedAt: new Date(status.updatedAt),
    };
  }

  async updateServerStatus(insertStatus: InsertServerStatus): Promise<ServerStatus> {
    // Delete existing status and insert new one
    this.db.prepare("DELETE FROM server_status").run();
    
    const id = randomUUID();
    const now = Date.now();
    const stmt = this.db.prepare(`
      INSERT INTO server_status (id, status, player_count, max_players, version, ip, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      id,
      insertStatus.status,
      insertStatus.playerCount,
      insertStatus.maxPlayers,
      insertStatus.version,
      insertStatus.ip,
      now
    );

    return {
      id,
      ...insertStatus,
      updatedAt: new Date(now),
    };
  }

  async createContactMessage(insertMessage: InsertContactMessage): Promise<ContactMessage> {
    const id = randomUUID();
    const now = Date.now();
    const stmt = this.db.prepare(`
      INSERT INTO contact_messages (id, name, email, subject, message, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      id,
      insertMessage.name,
      insertMessage.email,
      insertMessage.subject,
      insertMessage.message,
      now
    );

    return {
      id,
      ...insertMessage,
      createdAt: new Date(now),
    };
  }
}

// Use SQLite storage instead of memory storage
export const storage = new SQLiteStorage();

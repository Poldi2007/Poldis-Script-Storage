import { users, type User, type InsertUser, scripts, type Script, type InsertScript } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

// modify the interface with any CRUD methods
// you might need
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Script methods
  getScripts(): Promise<Script[]>;
  getScript(id: number): Promise<Script | undefined>;
  createScript(script: InsertScript): Promise<Script>;
  deleteScript(id: number): Promise<boolean>;

  // Session store for auth
  sessionStore: ReturnType<typeof createMemoryStore>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private scripts: Map<number, Script>;
  sessionStore: ReturnType<typeof createMemoryStore>;
  currentUserId: number;
  currentScriptId: number;

  constructor() {
    this.users = new Map();
    this.scripts = new Map();
    this.currentUserId = 1;
    this.currentScriptId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });

    // Initialize with default admin user (admin/Luna2007!)
    this.createUser({
      username: "admin",
      password: "Luna2007!" 
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getScripts(): Promise<Script[]> {
    return Array.from(this.scripts.values());
  }

  async getScript(id: number): Promise<Script | undefined> {
    return this.scripts.get(id);
  }

  async createScript(script: InsertScript): Promise<Script> {
    const id = this.currentScriptId++;
    const newScript: Script = { ...script, id };
    this.scripts.set(id, newScript);
    return newScript;
  }

  async deleteScript(id: number): Promise<boolean> {
    return this.scripts.delete(id);
  }
}

export const storage = new MemStorage();

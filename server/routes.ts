import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { insertScriptSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);

  // Middleware to check if user is authenticated
  const requireAuth = (req: any, res: any, next: any) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    next();
  };

  // Script routes
  app.get("/api/scripts", async (req, res) => {
    try {
      const scripts = await storage.getScripts();
      res.json(scripts);
    } catch (error) {
      res.status(500).json({ message: "Error fetching scripts" });
    }
  });

  app.get("/api/scripts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid script ID" });
      }
      
      const script = await storage.getScript(id);
      if (!script) {
        return res.status(404).json({ message: "Script not found" });
      }
      
      res.json(script);
    } catch (error) {
      res.status(500).json({ message: "Error fetching script" });
    }
  });

  app.post("/api/scripts", requireAuth, async (req, res) => {
    try {
      const scriptData = insertScriptSchema.parse(req.body);
      
      const script = await storage.createScript(scriptData);
      res.status(201).json(script);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Error creating script" });
    }
  });

  app.delete("/api/scripts/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid script ID" });
      }
      
      const success = await storage.deleteScript(id);
      if (!success) {
        return res.status(404).json({ message: "Script not found" });
      }
      
      res.status(200).json({ message: "Script deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting script" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

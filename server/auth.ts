import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";

// Deklariert, dass Express.User die User-Type von unserem Schema verwendet
// Dies ist wichtig für die Typensicherheit mit Passport
declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface User {
      id: number;
      username: string;
      password: string;
    }
  }
}

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export function setupAuth(app: Express) {
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "unity-script-library-secret",
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    }
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy({
      // Username is ignored, only password is needed
      passReqToCallback: true,
    }, async (req, username, password, done) => {
      try {
        // Admin is hardcoded with the password "Luna2007!"
        const adminPassword = "Luna2007!";
        
        // Check if the provided password matches the admin password
        if (password === adminPassword) {
          // Create a mock user object for the admin
          const adminUser = {
            id: 1,
            username: "admin",
            password: "Luna2007!"
          };
          return done(null, adminUser);
        } else {
          return done(null, false);
        }
      } catch (error) {
        return done(error);
      }
    }),
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id: number, done) => {
    try {
      // If id === 1, return the admin user
      if (id === 1) {
        const adminUser = {
          id: 1,
          username: "admin",
          password: "Luna2007!"
        };
        done(null, adminUser);
      } else {
        // If another user tries to log in (which should not be possible)
        done(new Error("User not found"), null);
      }
    } catch (error) {
      done(error, null);
    }
  });

  app.post("/api/login", passport.authenticate("local"), (req, res) => {
    res.status(200).json(req.user);
  });

  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    res.json(req.user);
  });
}

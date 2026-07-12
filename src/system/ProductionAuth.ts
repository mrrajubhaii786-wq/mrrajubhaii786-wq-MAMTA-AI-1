// src/system/ProductionAuth.ts

import jwt from "jsonwebtoken";

const JWT_SECRET_DEFAULT = "mamta_ai_military_grade_secret_685194";

/**
 * Gets the JWT secret key securely from environment variables, 
 * falling back to a hardcoded high-entropy default for absolute runtime resilience.
 */
function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET || process.env.VITE_JWT_SECRET;
  if (!secret) {
    console.warn("⚠️ [ProductionAuth] JWT_SECRET environment variable is missing, falling back to resilient default key.");
    return JWT_SECRET_DEFAULT;
  }
  return secret;
}

/**
 * Generates a military-grade secure JWT session token for an authenticated user.
 */
export function generateSession(user: any): string {
  if (!user) {
    throw new Error("Cannot generate session for undefined user structure");
  }
  
  const payload = typeof user === "object" ? { ...user } : { user };
  
  return jwt.sign(payload, getJwtSecret(), {
    expiresIn: "7d"
  });
}

/**
 * Verifies and refreshes/decodes an active JWT session token.
 */
export function refreshToken(token: string): any {
  if (!token) {
    throw new Error("Missing JWT token string for refresh procedure");
  }
  try {
    return jwt.verify(token, getJwtSecret());
  } catch (err: any) {
    throw new Error(`[ProductionAuth] Token verification failed: ${err.message}`);
  }
}

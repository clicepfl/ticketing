// Environment variables are not available to the frontend in production mode. They must be hard-coded.

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://clic.epfl.ch";
export const SESSION_COOKIE_NAME =
  process.env.NEXT_PUBLIC_SESSION_COOKIE_NAME || "clicketing-session";
export const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "";

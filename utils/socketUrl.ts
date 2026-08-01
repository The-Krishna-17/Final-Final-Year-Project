/**
 * Resolves the Socket.IO server URL.
 *
 * Priority:
 *  1. NEXT_PUBLIC_SOCKET_URL env var  (set in Vercel dashboard for production)
 *  2. http://localhost:5000            (local development fallback)
 *
 * For production, set in Vercel:
 *   NEXT_PUBLIC_SOCKET_URL = https://final-final-year-project-backend.onrender.com
 */
export const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";

import { Request, Response, NextFunction } from "express";

interface Bucket {
  count: number;
  resetAt: number;
}

const httpStore = new Map<string, Bucket>();
const HTTP_WINDOW = 15 * 60 * 1000;
const HTTP_LIMIT = 100;

export function rateLimiter(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const ip = req.ip ?? req.socket.remoteAddress ?? "unknown";
  const now = Date.now();
  const b = httpStore.get(ip);

  if (!b || now > b.resetAt) {
    httpStore.set(ip, { count: 1, resetAt: now + HTTP_WINDOW });
    return next();
  }

  b.count++;
  if (b.count > HTTP_LIMIT) {
    res.status(429).json({
      error: "Too many requests. Please try again later.",
      retryAfter: Math.ceil((b.resetAt - now) / 1000),
    });
    return;
  }
  next();
}

const socketStore = new Map<string, Bucket>();
const SOCK_WINDOW = 1_000;
const SOCK_LIMIT = 20;

export function socketRateLimiter(socketId: string): boolean {
  const now = Date.now();
  const b = socketStore.get(socketId);

  if (!b || now > b.resetAt) {
    socketStore.set(socketId, { count: 1, resetAt: now + SOCK_WINDOW });
    return true;
  }

  b.count++;
  return b.count <= SOCK_LIMIT;
}

setInterval(
  () => {
    const now = Date.now();
    httpStore.forEach((b, k) => {
      if (now > b.resetAt) httpStore.delete(k);
    });
    socketStore.forEach((b, k) => {
      if (now > b.resetAt) socketStore.delete(k);
    });
  },
  5 * 60 * 1000,
);

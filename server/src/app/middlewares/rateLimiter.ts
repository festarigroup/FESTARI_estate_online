import type { Request } from "express";
import rateLimit, { ipKeyGenerator } from "express-rate-limit";

function ipBasedRateLimitKey(req: Request): string {
  const ip = req.ip ?? req.socket.remoteAddress;
  if (!ip) {
    return "unknown";
  }
  return ipKeyGenerator(ip);
}

const ipKeyedDefaults = {
  keyGenerator: (req: Request) => ipBasedRateLimitKey(req),
  legacyHeaders: false,
  standardHeaders: "draft-7" as const,
};

const limiter = rateLimit({
  ...ipKeyedDefaults,
  windowMs: 15 * 60 * 1000,
  limit: 100,
  message:
    "Too many requests from this IP, please try again after 15 minutes",
});

export const otpRateLimiter = rateLimit({
  ...ipKeyedDefaults,
  windowMs: 10 * 60 * 1000,
  limit: 5,
  message:
    "You have reached your max OTP retries, please try again after 10 minutes",
});

export default limiter;

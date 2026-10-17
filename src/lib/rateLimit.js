/**
 * In-memory sliding window rate limiter for Next.js API routes.
 * Protects serverless functions and database pools from traffic spikes and DDoS attacks.
 * Features automated memory cleanup every 5 minutes to prevent memory leaks under high concurrency.
 */

const ipStore = new Map();

// Periodic cleanup of expired rate limit entries every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of ipStore.entries()) {
      if (now > record.resetTime) {
        ipStore.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}

/**
 * Check if a request exceeds the allowed rate limit.
 * @param {Request} request - Next.js Request object
 * @param {Object} options - Configuration options
 * @param {number} options.limit - Max allowed requests within the window (default: 30)
 * @param {number} options.windowMs - Time window in milliseconds (default: 60,000ms / 1 min)
 * @param {string} options.identifier - Optional custom identifier prefix
 * @returns {{ allowed: boolean, remaining: number, resetTime: number }}
 */
export function checkRateLimit(request, options = {}) {
  const limit = options.limit || 30;
  const windowMs = options.windowMs || 60 * 1000;
  const identifier = options.identifier || "api";

  // Extract client IP address from standard headers
  const forwardedFor = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const clientIp = (forwardedFor ? forwardedFor.split(",")[0].trim() : null) || realIp || "127.0.0.1";

  const key = `${identifier}:${clientIp}`;
  const now = Date.now();

  const record = ipStore.get(key);

  if (!record || now > record.resetTime) {
    ipStore.set(key, { count: 1, resetTime: now + windowMs });
    return { allowed: true, remaining: limit - 1, resetTime: now + windowMs };
  }

  record.count += 1;

  if (record.count > limit) {
    return { allowed: false, remaining: 0, resetTime: record.resetTime };
  }

  return { allowed: true, remaining: limit - record.count, resetTime: record.resetTime };
}

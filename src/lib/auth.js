import crypto from "crypto";

const SECRET = process.env.AUTH_SECRET || "cocoon_production_secret_key_8171902255";

/**
 * Creates an HMAC-SHA256 signed session token
 */
export function createSessionToken(payload, maxAgeSeconds = 60 * 60 * 24 * 7) {
  const data = {
    ...payload,
    exp: Math.floor(Date.now() / 1000) + maxAgeSeconds,
  };
  const jsonStr = JSON.stringify(data);
  const base64Data = Buffer.from(jsonStr).toString("base64url");
  const signature = crypto
    .createHmac("sha256", SECRET)
    .update(base64Data)
    .digest("base64url");

  return `${base64Data}.${signature}`;
}

/**
 * Verifies an HMAC-SHA256 signed session token
 * Returns payload if valid, null if invalid or expired.
 */
export function verifySessionToken(token) {
  if (!token || typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [base64Data, signature] = parts;
  const expectedSignature = crypto
    .createHmac("sha256", SECRET)
    .update(base64Data)
    .digest("base64url");

  // Constant-time comparison to prevent timing attacks
  const sigBuf = Buffer.from(signature);
  const expBuf = Buffer.from(expectedSignature);
  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
    return null;
  }

  try {
    const jsonStr = Buffer.from(base64Data, "base64url").toString("utf-8");
    const payload = JSON.parse(jsonStr);

    if (payload.exp && Math.floor(Date.now() / 1000) > payload.exp) {
      return null; // Expired
    }
    return payload;
  } catch (e) {
    return null;
  }
}

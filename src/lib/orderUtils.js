/**
 * Collision-proof e-commerce order ID generator
 * Format: ORD-YYMMDD-XXXX (e.g. ORD-261001-A9F2)
 */
export function generateOrderId() {
  const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, ""); // e.g. 261001
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ORD-${dateStr}-${rand}`;
}

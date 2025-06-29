// Utility functions for generating unique coupon codes

/**
 * Generates a cryptographically secure random string
 */
function generateSecureRandomString(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  
  return Array.from(array, byte => chars[byte % chars.length]).join('');
}

/**
 * Generates a unique coupon code with timestamp and random components
 */
export function generateUniqueCouponCode(type: 'online' | 'offline' = 'online'): string {
  const timestamp = Date.now().toString(36).toUpperCase(); // Base36 timestamp
  const randomPart = generateSecureRandomString(6); // 6 random characters
  const prefix = type === 'online' ? 'ON' : 'OF';
  
  return `${prefix}-${timestamp}-${randomPart}`;
}

/**
 * Generates a batch of unique coupon codes
 */
export function generateBatchCouponCodes(count: number, type: 'online' | 'offline' = 'online'): string[] {
  const codes = new Set<string>();
  
  while (codes.size < count) {
    codes.add(generateUniqueCouponCode(type));
  }
  
  return Array.from(codes);
}

/**
 * Validates coupon code format
 */
export function validateCouponCodeFormat(code: string): boolean {
  // Format: PREFIX-TIMESTAMP-RANDOM (e.g., ON-1A2B3C4D-ABC123)
  const pattern = /^(ON|OF)-[A-Z0-9]{8}-[A-Z0-9]{6}$/;
  return pattern.test(code);
}

/**
 * Extracts information from coupon code
 */
export function parseCouponCode(code: string): {
  type: 'online' | 'offline' | null;
  timestamp: number | null;
  isValid: boolean;
} {
  if (!validateCouponCodeFormat(code)) {
    return { type: null, timestamp: null, isValid: false };
  }
  
  const [prefix, timestampPart] = code.split('-');
  const type = prefix === 'ON' ? 'online' : 'offline';
  
  try {
    const timestamp = parseInt(timestampPart, 36);
    return { type, timestamp, isValid: true };
  } catch {
    return { type, timestamp: null, isValid: false };
  }
}
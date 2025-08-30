// Security Configuration and Utilities
export const SECURITY_CONFIG = {
  // Maximum allowed amount to prevent large fraudulent transactions
  MAX_PAYMENT_AMOUNT: 10000, // $10,000
  MIN_PAYMENT_AMOUNT: 1, // $1
  
  // Rate limiting
  MAX_PAYMENT_ATTEMPTS_PER_HOUR: 5,
  MAX_PAYMENT_ATTEMPTS_PER_DAY: 20,
  
  // Session security
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
  PAYMENT_SESSION_TIMEOUT: 10 * 60 * 1000, // 10 minutes
  
  // Allowed currencies
  ALLOWED_CURRENCIES: ['usd'],
  
  // Allowed origins for CORS
  ALLOWED_ORIGINS: [
    'http://localhost:3000',
    'https://yourdomain.com', // Replace with your production domain
  ],
};

// Security Headers
export const SECURITY_HEADERS = {
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-eval' https://js.stripe.com; style-src 'self' 'unsafe-inline'; connect-src 'self' https://api.stripe.com; frame-src https://js.stripe.com;",
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
};

// Input validation utilities
export const validatePaymentAmount = (amount: number): boolean => {
  return (
    typeof amount === 'number' &&
    !isNaN(amount) &&
    amount >= SECURITY_CONFIG.MIN_PAYMENT_AMOUNT &&
    amount <= SECURITY_CONFIG.MAX_PAYMENT_AMOUNT &&
    Number.isFinite(amount)
  );
};

export const validateCurrency = (currency: string): boolean => {
  return SECURITY_CONFIG.ALLOWED_CURRENCIES.includes(currency.toLowerCase());
};

export const sanitizeMetadata = (metadata: Record<string, unknown>): Record<string, string> => {
  const sanitized: Record<string, string> = {};
  
  for (const [key, value] of Object.entries(metadata)) {
    // Only allow alphanumeric keys and safe values
    if (/^[a-zA-Z0-9_]+$/.test(key) && typeof value === 'string' && value.length < 500) {
      sanitized[key] = value.replace(/[<>\"'&]/g, ''); // Basic XSS prevention
    }
  }
  
  return sanitized;
};

// Rate limiting store (in production, use Redis or database)
const rateLimitStore = new Map<string, { count: number; lastReset: number }>();

export const checkRateLimit = (identifier: string, maxAttempts: number, windowMs: number): boolean => {
  const now = Date.now();
  const key = identifier;
  const entry = rateLimitStore.get(key);
  
  if (!entry || now - entry.lastReset > windowMs) {
    rateLimitStore.set(key, { count: 1, lastReset: now });
    return true;
  }
  
  if (entry.count >= maxAttempts) {
    return false;
  }
  
  entry.count++;
  return true;
};

// Generate secure payment session token
export const generateSecureToken = (): string => {
  return crypto.randomUUID() + '-' + Date.now().toString(36);
};

// Verify payment session token
export const verifyPaymentSession = (token: string, maxAge: number = SECURITY_CONFIG.PAYMENT_SESSION_TIMEOUT): boolean => {
  try {
    const parts = token.split('-');
    if (parts.length !== 2) return false;
    
    const timestamp = parseInt(parts[1], 36);
    const age = Date.now() - timestamp;
    
    return age <= maxAge;
  } catch {
    return false;
  }
};

// IP address utilities
export const getClientIP = (request: Request): string => {
  const xForwardedFor = request.headers.get('x-forwarded-for');
  const xRealIP = request.headers.get('x-real-ip');
  
  if (xForwardedFor) {
    return xForwardedFor.split(',')[0].trim();
  }
  
  if (xRealIP) {
    return xRealIP;
  }
  
  return 'unknown';
};

// Audit logging
export const logSecurityEvent = (event: {
  type: 'payment_attempt' | 'payment_success' | 'payment_failure' | 'suspicious_activity';
  ip: string;
  userAgent?: string;
  amount?: number;
  paymentIntentId?: string;
  error?: string;
  timestamp?: number;
}) => {
  const logEntry = {
    ...event,
    timestamp: event.timestamp || Date.now(),
    userAgent: event.userAgent?.slice(0, 200), // Limit user agent length
  };
  
  // In production, send to your logging service (e.g., CloudWatch, DataDog, etc.)
  console.log('SECURITY_EVENT:', JSON.stringify(logEntry));
  
  // Store in database for audit trail
  // await storeSecurityLog(logEntry);
};

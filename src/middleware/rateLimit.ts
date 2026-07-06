import rateLimit from 'express-rate-limit';

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests', message: 'Please try again later', retryAfter: '15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});

export const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20, // slightly generous for conversational UX
  message: { error: 'Chat rate limit exceeded', message: 'Maximum 20 messages per minute' },
});

export const planLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 15,
  message: { error: 'Plan generation limit exceeded', message: 'Maximum 15 plans per hour' },
});

export const adminLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 100,
  message: { error: 'Admin rate limit exceeded', message: 'Too many admin requests' },
});

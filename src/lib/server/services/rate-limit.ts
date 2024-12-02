export class RateLimitService {
  private requestCounts = new Map<string, { count: number; timestamp: number }>();
  private readonly windowMs: number;
  private readonly maxRequests: number;

  constructor(windowMs: number = 60 * 1000, maxRequests: number = 100) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
  }

  checkRateLimit(ip: string): boolean {
    const now = Date.now();
    const userRequests = this.requestCounts.get(ip);

    if (!userRequests) {
      this.requestCounts.set(ip, { count: 1, timestamp: now });
      return true;
    }

    if (now - userRequests.timestamp > this.windowMs) {
      this.requestCounts.set(ip, { count: 1, timestamp: now });
      return true;
    }

    if (userRequests.count >= this.maxRequests) {
      return false;
    }

    userRequests.count++;
    return true;
  }

  cleanup() {
    const now = Date.now();
    for (const [key, value] of this.requestCounts.entries()) {
      if (now - value.timestamp > this.windowMs) {
        this.requestCounts.delete(key);
      }
    }
  }
}


export const commentRateLimit = new RateLimitService(60 * 1000, 100);
export const authRateLimit = new RateLimitService(15 * 60 * 1000, 50);

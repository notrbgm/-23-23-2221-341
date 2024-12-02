interface RateLimit {
  count: number;
  firstAttempt: number;
}

export class RateLimitService {
  private static readonly COMMENT_LIMIT = 5;
  private static readonly RESET_PASSWORD_LIMIT = 3;
  private static readonly COMMENT_WINDOW = 5 * 60 * 1000;
  private static readonly RESET_PASSWORD_WINDOW = 60 * 60 * 1000;
  private static rateLimits = new Map<string, RateLimit>();

  static checkCommentLimit(userId: number): {
    allowed: boolean;
    timeLeft?: number;
  } {
    return this.checkLimit(
      `comment:${userId}`,
      this.COMMENT_LIMIT,
      this.COMMENT_WINDOW
    );
  }

  static checkPasswordResetLimit(identifier: string): {
    allowed: boolean;
    timeLeft?: number;
  } {
    return this.checkLimit(
      `reset:${identifier}`,
      this.RESET_PASSWORD_LIMIT,
      this.RESET_PASSWORD_WINDOW
    );
  }

  private static checkLimit(
    key: string,
    maxAttempts: number,
    timeWindow: number
  ): {
    allowed: boolean;
    timeLeft?: number;
  } {
    const now = Date.now();
    const limit = this.rateLimits.get(key);

    if (!limit) {
      this.rateLimits.set(key, { count: 1, firstAttempt: now });
      return { allowed: true };
    }

    if (now - limit.firstAttempt >= timeWindow) {
      this.rateLimits.set(key, { count: 1, firstAttempt: now });
      return { allowed: true };
    }

    if (limit.count >= maxAttempts) {
      const timeLeft = Math.ceil(
        (timeWindow - (now - limit.firstAttempt)) / 1000
      );
      return { allowed: false, timeLeft };
    }

    limit.count++;
    this.rateLimits.set(key, limit);
    return { allowed: true };
  }

  static cleanup() {
    const now = Date.now();
    const maxWindow = Math.max(this.COMMENT_WINDOW, this.RESET_PASSWORD_WINDOW);

    for (const [key, limit] of this.rateLimits.entries()) {
      if (now - limit.firstAttempt >= maxWindow) {
        this.rateLimits.delete(key);
      }
    }
  }

  static startCleanup() {
    setInterval(() => this.cleanup(), Math.max(this.COMMENT_WINDOW, this.RESET_PASSWORD_WINDOW));
  }
}

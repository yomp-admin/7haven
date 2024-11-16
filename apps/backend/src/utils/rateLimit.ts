import { rateLimiter } from 'hono-rate-limiter';

export function createRateLimiter(minutes: number, limit: number) {
  return rateLimiter({
    windowMs: minutes * 60 * 1000,
    limit,
    standardHeaders: 'draft-7',
    message: { message: 'Too Many Requests' },
    keyGenerator: (c) => {
      const clientIp =
        c.req.header('CF-Connecting-IP') ||
        c.req.header('True-Client-IP') ||
        c.req.header('X-Real-IP') ||
        c.req.header('X-Forwarded-For')?.split(',')[0] ||
        '';
      return clientIp.trim();
    }
  });
}

export class Throttler<_Key> {
  public timeoutSeconds: number[];

  private storage = new Map<_Key, ThrottlingCounter>();

  constructor(timeoutSeconds: number[]) {
    this.timeoutSeconds = timeoutSeconds;
  }

  public check(key: _Key): boolean {
    let counter = this.storage.get(key) ?? null;
    const now = Date.now();
    if (counter === null) {
      return true;
    }
    return now - counter.updatedAt >= this.timeoutSeconds[counter.timeout] * 1000;
  }

  public increment(key: _Key): void {
    let counter = this.storage.get(key) ?? null;
    const now = Date.now();
    if (counter === null) {
      counter = {
        timeout: 0,
        updatedAt: now
      };
      this.storage.set(key, counter);
      return;
    }
    counter.updatedAt = now;
    counter.timeout = Math.min(counter.timeout + 1, this.timeoutSeconds.length - 1);
    this.storage.set(key, counter);
  }

  public reset(key: _Key): void {
    this.storage.delete(key);
  }
}

export class FixedRefillTokenBucket<_Key> {
  public max: number;
  public refillIntervalSeconds: number;

  private storage = new Map<_Key, Bucket>();

  constructor(max: number, refillIntervalSeconds: number) {
    this.max = max;
    this.refillIntervalSeconds = refillIntervalSeconds;
  }

  public check(key: _Key, cost: number): boolean {
    let bucket = this.storage.get(key) ?? null;
    const now = Date.now();
    if (bucket === null) {
      bucket = {
        count: this.max - cost,
        refilledAt: now
      };
      this.storage.set(key, bucket);
      return true;
    }
    if (now - bucket.refilledAt >= this.refillIntervalSeconds * 1000) {
      bucket.count = this.max;
    }
    if (bucket.count < cost) {
      this.storage.set(key, bucket);
      return false;
    }
    bucket.count -= cost;
    this.storage.set(key, bucket);
    return true;
  }

  public reset(key: _Key): void {
    this.storage.delete(key);
  }
}

interface Bucket {
  count: number;
  refilledAt: number;
}

interface ThrottlingCounter {
  timeout: number;
  updatedAt: number;
}

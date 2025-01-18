class RateLimiter {
  constructor(limit, interval = 60000) {
    this.limit = limit;
    this.interval = interval;
    this.requests = [];
  }

  async waitIfNeeded() {
    const now = Date.now();
    this.requests = this.requests.filter((time) => now - time <= this.interval);

    if (this.requests.length >= this.limit) {
      const oldestRequest = this.requests[0];
      const timeToWait = Math.max(0, this.interval - (now - oldestRequest));

      if (timeToWait > 0) {
        console.log(`Reached rate limit. Waiting ${timeToWait / 1000} seconds...`);
        await new Promise((resolve) => setTimeout(resolve, timeToWait));
      }

      return this.waitIfNeeded();
    }

    this.requests.push(now);
  }
}

module.exports = RateLimiter;

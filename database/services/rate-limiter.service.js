class RateLimiterService {
  constructor(limit = 25, interval = 60000) {
    this.limit = limit;
    this.interval = interval;
    this.requestTimestamps = [];
  }

  async waitIfNeeded() {
    const now = Date.now();

    this.requestTimestamps = this.requestTimestamps.filter((time) => now - time <= this.interval);

    if (this.requestTimestamps.length >= this.limit) {
      const oldestRequest = this.requestTimestamps[0];
      const timeToWait = Math.max(0, this.interval - (now - oldestRequest));

      if (timeToWait > 0) {
        console.log(`Reached rate limit. Waiting ${timeToWait / 1000} seconds...`);
        await new Promise((resolve) => setTimeout(resolve, timeToWait));
      }

      return this.waitIfNeeded();
    }

    this.requestTimestamps.push(now);
  }
}

module.exports = RateLimiterService;

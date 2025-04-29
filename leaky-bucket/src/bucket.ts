export class Bucket {
  protected rate: number;
  protected maxBucketSize: number;
  protected currentBucketSize: number;
  protected lastRefillTime: number;

  public constructor(
    rate: number,
    maxBucketSize: number,
    currentBucketSize?: number,
    lastRefillTime?: number,
  ) {
    this.rate = rate;
    this.maxBucketSize = maxBucketSize;
    this.currentBucketSize = currentBucketSize ?? maxBucketSize;
    this.lastRefillTime = lastRefillTime ?? Date.now();
  }

  public refill() {
    const now: number = Date.now();
    const timeEllapsed: number = now - this.lastRefillTime!;
    const tokensToAdd: number = Math.floor((timeEllapsed / 1000) * this.rate);

    if (tokensToAdd > 0 && this.currentBucketSize < this.maxBucketSize) {
      this.currentBucketSize = Math.min(
        this.currentBucketSize + tokensToAdd,
        this.maxBucketSize,
      );

      this.lastRefillTime = now;
    }
  }

  public consume(tokens: number) {
    if (this.currentBucketSize >= tokens) {
      this.currentBucketSize = this.currentBucketSize - tokens;
    }
  }
}

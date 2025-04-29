export interface Bucket {
  rate: number;
  maxBucketSize: number;
  currentBucketSize: number;
  lastRefillTime: number;
  refill(): Promise<Bucket>;
  async(tokens: number): Promise<Bucket>;
}

import { Bucket } from '../src/bucket'; // Adjust path as needed

describe('Bucket Rate Limiter', () => {
  it('should create a bucket with the specified rate and max size', () => {
    const rate = 10;
    const maxBucketSize = 100;
    const bucket = Bucket(rate, maxBucketSize);

    expect(typeof bucket.consume).toBe('function');
    expect(typeof bucket.refill).toBe('function');
  });

  it('should consume tokens if available', () => {
    const rate = 10;
    const maxBucketSize = 100;
    const bucket = Bucket(rate, maxBucketSize);

    const consumeResult = bucket.consume(10);
    expect(consumeResult).toBe(true);
  });

  it('should not consume tokens if not available', () => {
    const rate = 10;
    const maxBucketSize = 10;
    const bucket = Bucket(rate, maxBucketSize);

    bucket.consume(10); // consume 10 to make bucket empty
    const consumeResult = bucket.consume(1);
    expect(consumeResult).toBe(false);
  });

  it('should refill tokens based on the rate and elapsed time', (done) => {
    const rate = 10;
    const maxBucketSize = 100;
    const bucket = Bucket(rate, maxBucketSize);

    bucket.consume(maxBucketSize); // Empty the bucket

    setTimeout(() => {
      bucket.refill(); // Refill the bucket
      // We need to check that is something is refilled
      const consumeResult: boolean = bucket.consume(1);
      expect(consumeResult).toBe(true); 
      done();
    }, 100); // Wait 100ms. We should get 1 token back at least.
  });

  it('should not exceed the maximum bucket size when refilling', (done) => {
    const rate = 10;
    const maxBucketSize = 100;
    const bucket = Bucket(rate, maxBucketSize);

    setTimeout(() => {
      bucket.refill();
      const consumeResult = bucket.consume(maxBucketSize);
      expect(consumeResult).toBe(true);
      done();
    }, 200 * 10); // wait 20 seconds so tokens can be refilled
  });

  it('should handle fractional refills correctly', (done) => {
    const rate = 0.5; // 0.5 tokens per second
    const maxBucketSize = 1;
    const bucket = Bucket(rate, maxBucketSize);

    bucket.consume(1);

    setTimeout(() => {
      bucket.refill(); // Should add approximately 0.5 tokens after 1 sec
      const consumeResult = bucket.consume(0.5);
      expect(consumeResult).toBe(true);
      done();
    }, 1000); // Wait 1 second
  });
});

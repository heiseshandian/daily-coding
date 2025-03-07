/**
 * Generates an array of prime numbers up to a given maximum value using the Sieve of Eratosthenes algorithm.
 *
 * @param max - The maximum value up to which prime numbers are to be generated.
 * @returns An array of prime numbers less than or equal to the given maximum value.
 */
export function sieveOfEratosthenes(max: number): number[] {
  // Initialize an empty array to store prime numbers
  const primes: number[] = [];
  // Create a boolean array "isPrime[0..max]" and initialize
  // all entries as true. A value in isPrime[i] will
  // finally be false if i is Not a prime, else true.
  const isPrime = new Array(max + 1).fill(true);

  // Iterate from 2 to the square root of max
  for (let p = 2; p * p <= max; p++) {
    // If isPrime[p] is not changed, then it is a prime
    if (isPrime[p]) {
      // Update all multiples of p
      for (let i = p * p; i <= max; i += p) {
        isPrime[i] = false;
      }
    }
  }

  // Collect all prime numbers
  for (let p = 2; p <= max; p++) {
    // If p is prime, add it to the primes array
    if (isPrime[p]) {
      primes.push(p);
    }
  }

  // Return the array of prime numbers
  return primes;
}

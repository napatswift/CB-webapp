/**
 * Merges two arrays of numbers into a single array.
 * @param a - The first array to merge.
 * @param b - The second array to merge.
 * @param isEmpty - A boolean indicating whether the first array is empty.
 * @returns A new array containing the merged values.
 * @throws An error if the input arrays are invalid.
 */
export const merge = <T extends number[] | Float32Array | Uint8Array>(
  a: T,
  b: T,
  isEmpty: boolean
): T => {
  if (a.length % 2 !== 0 || b.length % 2 !== 0 || b.length !== a.length / 2) {
    throw new Error("Invalid input");
  }

  const result: number[] = [];

  if (isEmpty) {
    for (let i = 0; i < b.length; i++) {
      result.push(b[i], b[i]);
    }
  } else {
    for (let i = 0; i < a.length; i++) {
      if (i < a.length / 2) result.push((a[i * 2] + a[i * 2 + 1]) / 2);
      else result.push(b[i - a.length / 2]);
    }
  }

  if (a instanceof Float32Array) return new Float32Array(result) as T;
  if (a instanceof Uint8Array) return new Uint8Array(result) as T;
  return result as T;
};

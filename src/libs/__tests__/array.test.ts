import { describe, it, expect } from "@jest/globals";
import { merge } from "../array";

describe("merge function", () => {
  it("should merge array a into array b in ascending order", () => {
    const targetArray = [-1, -1, -1, -1];
    const sourceArray = [1, 2];
    const expectedArray = [1, 1, 2, 2];

    const result = merge(targetArray, sourceArray, true);

    expect(result).toHaveLength(4);
    expect(result).toEqual(expectedArray);
  });

  it("should merge array b into array a in ascending order and calculate the mean of every two elements in array a", () => {
    const targetArray = [1, 2, 3, 4];
    const sourceArray = [5, 6];
    const expectedArray = [(1 + 2) / 2, (3 + 4) / 2, 5, 6];

    const result = merge(targetArray, sourceArray, false);

    expect(result).toHaveLength(4);
    expect(result).toEqual(expectedArray);
  });

  it("should merge Float32Array a into Float32Array b in ascending order", () => {
    const targetArray = new Float32Array(4);
    const sourceArray = new Float32Array([1, 2]);
    const expectedArray = new Float32Array([1, 1, 2, 2]);

    const result = merge(targetArray, sourceArray, true);

    expect(result).toHaveLength(4);
    expect(result).toEqual(expectedArray);
  });

  it("should merge Float32Array b into Float32Array a in ascending order and calculate the mean of every two elements in array a", () => {
    const targetArray = new Float32Array([1, 2, 3, 4]);
    const sourceArray = new Float32Array([5, 6]);
    const expectedArray = new Float32Array([(1 + 2) / 2, (3 + 4) / 2, 5, 6]);

    const result = merge(targetArray, sourceArray, false);

    expect(result).toHaveLength(4);
    expect(result).toEqual(expectedArray);
  });

  it("should throw an error if the input arrays are invalid", () => {
    const targetArray = [1, 2, 3, 4];
    const sourceArray = [5, 6, 7];

    expect(() => merge(targetArray, sourceArray, false)).toThrowError(
      "Invalid input"
    );
  });

  it("should throw an error if the input arrays are invalid", () => {
    const targetArray = [1, 2, 3, 4];
    const sourceArray = [5, 6, 7];

    expect(() => merge(targetArray, sourceArray, false)).toThrowError(
      "Invalid input"
    );
  });
});

import { describe, expect, test } from "vitest";
import { equals } from "../src/utils";

describe("utils", () => {
  describe("equals", () => {
    test("deep equality of its operands", () => {
      const a: unknown[] = [];
      const b = a;

      expect(equals(100, 100)).toBe(true);
      expect(equals(100, "100")).toBe(false);
      expect(equals([], [])).toBe(true);
      expect(equals(a, b)).toBe(true);
    });

    test("considers equal Boolean primitives equal", () => {
      expect(equals(true, true)).toBe(true);
      expect(equals(false, false)).toBe(true);
      expect(equals(true, false)).toBe(false);
      expect(equals(false, true)).toBe(false);
    });

    test("considers equal number primitives equal", () => {
      expect(equals(0, 0)).toBe(true);
      expect(equals(0, 1)).toBe(false);
      expect(equals(1, 0)).toBe(false);
    });

    test("considers equal string primitives equal", () => {
      expect(equals("", "")).toBe(true);
      expect(equals("", "x")).toBe(false);
      expect(equals("x", "")).toBe(false);
      expect(equals("foo", "foo")).toBe(true);
      expect(equals("foo", "bar")).toBe(false);
      expect(equals("bar", "foo")).toBe(false);
    });

    test("handles objects", () => {
      expect(equals({}, {})).toBe(true);
      expect(equals({ a: 1, b: 2 }, { a: 1, b: 2 })).toBe(true);
      expect(equals({ a: 2, b: 3 }, { a: 2, b: 3 })).toBe(true);
      expect(equals({ a: 2, b: 3 }, { a: 3, b: 3 })).toBe(false);
      expect(equals({ a: 2, b: 3, c: 1 }, { a: 2, b: 3 })).toBe(false);
    });

    test("handles lists", () => {
      const listA = [1, 2, 3];
      const listB = [1, 3, 2];

      expect(equals([], {})).toBe(false);
      expect(equals({}, [])).toBe(false);
      expect(equals(listA, listB)).toBe(false);
      expect(equals([1], { 0: 1, length: 1 })).toBe(false);
    });

    test("handles null and undefined", () => {
      expect(equals(null, null)).toBe(true);
      expect(equals(undefined, undefined)).toBe(true);
      expect(equals(null, undefined)).toBe(false);
      expect(equals(null, {})).toBe(false);
      expect(equals({}, null)).toBe(false);
    });

    test("compares own keys, including undefined values", () => {
      expect(equals({ a: undefined }, { b: undefined })).toBe(false);
      expect(equals({ a: undefined }, { a: undefined })).toBe(true);
      expect(
        equals(
          Object.assign(Object.create(null), { a: 1 }),
          Object.assign(Object.create(null), { a: 1 }),
        ),
      ).toBe(true);
    });

    test("compares ArrayBuffer bytes rather than expando properties", () => {
      const a = Uint8Array.of(1, 2).buffer;
      const b = Uint8Array.of(1, 2).buffer;
      const c = Uint8Array.of(1, 3).buffer;

      expect(equals(a, b)).toBe(true);
      expect(equals(a, c)).toBe(false);
      expect(equals(a, new ArrayBuffer(3))).toBe(false);
      expect(equals(a, new Uint8Array(a))).toBe(false);
    });

    test("compares typed array types, contents, and view ranges", () => {
      expect(equals(Float32Array.of(1, 2), Float32Array.of(1, 2))).toBe(true);
      expect(equals(Float32Array.of(1, 2), Float32Array.of(1, 3))).toBe(false);
      expect(equals(Uint8Array.of(1), Int8Array.of(1))).toBe(false);
      expect(equals(Uint8Array.of(1), { 0: 1 })).toBe(false);
      expect(
        equals(Uint8Array.of(9, 1, 2).subarray(1), Uint8Array.of(1, 2)),
      ).toBe(true);
      expect(
        equals(
          new DataView(Uint8Array.of(9, 1, 2).buffer, 1),
          new DataView(Uint8Array.of(1, 2).buffer),
        ),
      ).toBe(true);
      expect(
        equals(
          new DataView(Uint8Array.of(1).buffer),
          new DataView(Uint8Array.of(2).buffer),
        ),
      ).toBe(false);
    });

    test("compares opaque objects by identity", () => {
      const context = new AudioContext();
      const buffer = context.createBuffer(1, 16, context.sampleRate);
      const otherBuffer = context.createBuffer(1, 16, context.sampleRate);

      expect(equals(buffer, buffer)).toBe(true);
      expect(equals(buffer, otherBuffer)).toBe(false);
      expect(equals(new Date(0), new Date(0))).toBe(false);
      expect(equals(new Map(), new Map())).toBe(false);
    });
  });
});

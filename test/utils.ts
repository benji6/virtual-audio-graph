import { equals } from "../src/utils";

describe("utils", () => {
  describe("equals", () => {
    test("deep equality of its operands", () => {
      const a = [];
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
      expect(equals(listA, listB)).toBe(false);
    });

    test("handles typed arrays", () => {
      const typArr1 = new ArrayBuffer(10);
      typArr1[0] = 1;
      const typArr2 = new ArrayBuffer(10);
      typArr2[0] = 1;
      const typArr3 = new ArrayBuffer(10);
      const intTypArr = new Int8Array(typArr1);
      typArr3[0] = 0;

      expect(equals(typArr1, typArr2)).toBe(true);
      expect(equals(typArr1, typArr3)).toBe(false);
      expect(equals(typArr1, intTypArr)).toBe(false);
    });
  });
});

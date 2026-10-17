export const capitalize = (a: string): string =>
  a.charAt(0).toUpperCase() + a.slice(1);

const equalBytes = (a: Uint8Array, b: Uint8Array): boolean => {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
  return true;
};

export const equals = (a: unknown, b: unknown): boolean => {
  if (a === b) return true;
  if (a == null || b == null || typeof a !== "object" || typeof b !== "object")
    return false;
  const prototype = Object.getPrototypeOf(a);
  if (prototype !== Object.getPrototypeOf(b)) return false;
  if (Array.isArray(a) || Array.isArray(b)) {
    if (!Array.isArray(a) || !Array.isArray(b)) return false;
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) if (!equals(a[i], b[i])) return false;
    return true;
  }
  if (ArrayBuffer.isView(a) || ArrayBuffer.isView(b)) {
    if (!ArrayBuffer.isView(a) || !ArrayBuffer.isView(b)) return false;
    return equalBytes(
      new Uint8Array(a.buffer, a.byteOffset, a.byteLength),
      new Uint8Array(b.buffer, b.byteOffset, b.byteLength),
    );
  }
  if (a instanceof ArrayBuffer && b instanceof ArrayBuffer)
    return equalBytes(new Uint8Array(a), new Uint8Array(b));
  if (prototype !== Object.prototype && prototype !== null) return false;
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  const recordA = a as Record<string, unknown>;
  const recordB = b as Record<string, unknown>;
  for (let i = 0; i < keysA.length; i++) {
    const key = keysA[i];
    if (!Object.hasOwn(b, key) || !equals(recordA[key], recordB[key]))
      return false;
  }
  return true;
};

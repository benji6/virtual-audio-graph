export const capitalize = (a: string): string =>
  a.charAt(0).toUpperCase() + a.slice(1);

export const equals = (a: any, b: any): boolean => {
  if (a === b) return true;
  const typeA = typeof a;
  if (typeA !== typeof b || typeA !== "object") return false;
  if (Array.isArray(a)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) if (!equals(a[i], b[i])) return false;
    return true;
  }
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  for (let i = 0; i < keysA.length; i++) {
    const key = keysA[i];
    if (!equals(a[key], b[key])) return false;
  }
  return true;
};

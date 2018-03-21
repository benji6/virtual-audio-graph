export interface GenericObject<T> {
  [key: string]: T
}

export const capitalize = (a: string): string => a.charAt(0).toUpperCase() + a.substring(1)

export const equals = (a: any, b: any): boolean => {
  if (a === b) return true
  const typeA = typeof a
  if (typeA !== typeof b || typeA !== 'object') return false
  if (Array.isArray(a)) {
    if (a.length !== b.length) return false
    for (let i = 0; i < a.length; i++) if (!equals(a[i], b[i])) return false
    return true
  }
  const keysA = Object.keys(a)
  const keysB = Object.keys(b)
  if (keysA.length !== keysB.length) return false
  for (let i = 0; i < keysA.length; i++) {
    const key = keysA[i]
    if (!equals(a[key], b[key])) return false
  }
  return true
}

export const find = <X>(f: (x: X) => boolean, xs: X[]): X => {
  for (let i = 0; i < xs.length; i++) if (f(xs[i])) return xs[i]
}

export const mapObj = <A, B>(f: (a: A) => B, o: GenericObject<A>): GenericObject<B> => {
  const p = {} as GenericObject<B>
  for (const key in o) if (Object.prototype.hasOwnProperty.call(o, key)) p[key] = f(o[key])
  return p
}

export const values = <A>(obj: GenericObject<A>): A[] => {
  const keys = Object.keys(obj)
  const ret = []
  for (let i = 0; i < keys.length; i++) ret[i] = obj[keys[i]]
  return ret
}

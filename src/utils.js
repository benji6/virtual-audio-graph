export const capitalize = a => a.charAt(0).toUpperCase() + a.substring(1)
export const equals = (a, b) => {
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
export const forEach = (f, xs) => { for (let i = 0; i < xs.length; i++) f(xs[i]) }
export const forEachIndexed = (f, xs) => { for (let i = 0; i < xs.length; i++) f(xs[i], i) }
export const filter = (f, xs) => {
  const ys = []
  for (let i = 0; i < xs.length; i++) f(xs[i]) && ys.push(xs[i])
  return ys
}
export const find = (f, xs) => { for (let i = 0; i < xs.length; i++) if (f(xs[i])) return xs[i] }
export const values = obj => {
  const keys = Object.keys(obj)
  const ret = []
  for (var i = 0; i < keys.length; i++) ret[i] = obj[keys[i]]
  return ret
}

export const asArray = x => Array.isArray(x) ? x : [x]
export const capitalize = a => a.charAt(0).toUpperCase() + a.substring(1)
export const forEach = (f, xs) => { for (let i = 0; i < xs.length; i++) f(xs[i]) }
export const forEachIndexed = (f, xs) => { for (let i = 0; i < xs.length; i++) f(xs[i], i) }
export const filter = (f, xs) => {
  const ys = []
  for (let i = 0; i < xs.length; i++) f(xs[i]) && ys.push(xs[i])
  return ys
}
export const find = (f, xs) => { for (let i = 0; i < xs.length; i++) if (f(xs[i])) return xs[i] }

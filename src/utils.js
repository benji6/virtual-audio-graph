export const asArray = x => Array.isArray(x) ? x : [x]
export const capitalize = a => a.charAt(0).toUpperCase() + a.substring(1)
export const forEach = (xs, f) => { for (let i = 0; i < xs.length; i++) f(xs[i]) }
export const forEachIndexed = (f, xs) => { for (let i = 0; i < xs.length; i++) f(xs[i], i) }

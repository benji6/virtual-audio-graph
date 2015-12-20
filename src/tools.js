export const asArray = x => Array.isArray(x) ? x : [x]
export const mapObj = (fn, obj) => Object.keys(obj)
  .reduce((acc, key) => (acc[key] = fn(obj[key]), acc), {})
export const values = obj => Object.keys(obj).map(key => obj[key])
export const capitalize = a => a.charAt(0).toUpperCase() + a.substring(1)

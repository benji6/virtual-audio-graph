export default (fn, obj) => Object.keys(obj)
  .reduce((acc, key) => (acc[key] = fn(obj[key]), acc), {});

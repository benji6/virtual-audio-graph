module.exports = (fn, obj) => Object.keys(obj)
  .reduce((acc, key) => {
    acc[key] = fn(obj[key]);
    return acc;
  }, {});

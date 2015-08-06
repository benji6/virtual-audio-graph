module.exports = (fn, obj) => {
  return Object.keys(obj).reduce((acc, key) => {
    acc[key] = fn(obj[key]);
    return acc;
  }, {});
};

"use strict";

module.exports = function (fn, obj) {
  return Object.keys(obj).reduce(function (acc, key) {
    acc[key] = fn(obj[key]);
    return acc;
  }, {});
};
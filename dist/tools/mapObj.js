"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = function (fn, obj) {
  return Object.keys(obj).reduce(function (acc, key) {
    return (acc[key] = fn(obj[key]), acc);
  }, {});
};

module.exports = exports["default"];
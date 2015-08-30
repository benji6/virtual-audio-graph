"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = function (fn, obj) {
  return Object.keys(obj).reduce(function (acc, key) {
    acc[key] = fn(obj[key]);
    return acc;
  }, {});
};

module.exports = exports["default"];
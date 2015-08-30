"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = function (x) {
  return Array.isArray(x) ? x : [x];
};

module.exports = exports["default"];
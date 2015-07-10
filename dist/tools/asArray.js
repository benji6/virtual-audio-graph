"use strict";

module.exports = function (x) {
  return Array.isArray(x) ? x : [x];
};
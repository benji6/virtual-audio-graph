(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/define-property"), __esModule: true };
},{"core-js/library/fn/object/define-property":4}],2:[function(require,module,exports){
"use strict";

exports["default"] = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

exports.__esModule = true;
},{}],3:[function(require,module,exports){
"use strict";

var _Object$defineProperty = require("babel-runtime/core-js/object/define-property")["default"];

exports["default"] = (function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;

      _Object$defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
})();

exports.__esModule = true;
},{"babel-runtime/core-js/object/define-property":1}],4:[function(require,module,exports){
var $ = require('../../modules/$');
module.exports = function defineProperty(it, key, desc){
  return $.setDesc(it, key, desc);
};
},{"../../modules/$":6}],5:[function(require,module,exports){
module.exports = function($){
  $.FW   = false;
  $.path = $.core;
  return $;
};
},{}],6:[function(require,module,exports){
'use strict';
var global = typeof self != 'undefined' ? self : Function('return this')()
  , core   = {}
  , defineProperty = Object.defineProperty
  , hasOwnProperty = {}.hasOwnProperty
  , ceil  = Math.ceil
  , floor = Math.floor
  , max   = Math.max
  , min   = Math.min;
// The engine works fine with descriptors? Thank's IE8 for his funny defineProperty.
var DESC = !!function(){
  try {
    return defineProperty({}, 'a', {get: function(){ return 2; }}).a == 2;
  } catch(e){ /* empty */ }
}();
var hide = createDefiner(1);
// 7.1.4 ToInteger
function toInteger(it){
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
}
function desc(bitmap, value){
  return {
    enumerable  : !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable    : !(bitmap & 4),
    value       : value
  };
}
function simpleSet(object, key, value){
  object[key] = value;
  return object;
}
function createDefiner(bitmap){
  return DESC ? function(object, key, value){
    return $.setDesc(object, key, desc(bitmap, value));
  } : simpleSet;
}

function isObject(it){
  return it !== null && (typeof it == 'object' || typeof it == 'function');
}
function isFunction(it){
  return typeof it == 'function';
}
function assertDefined(it){
  if(it == undefined)throw TypeError("Can't call method on  " + it);
  return it;
}

var $ = module.exports = require('./$.fw')({
  g: global,
  core: core,
  html: global.document && document.documentElement,
  // http://jsperf.com/core-js-isobject
  isObject:   isObject,
  isFunction: isFunction,
  that: function(){
    return this;
  },
  // 7.1.4 ToInteger
  toInteger: toInteger,
  // 7.1.15 ToLength
  toLength: function(it){
    return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
  },
  toIndex: function(index, length){
    index = toInteger(index);
    return index < 0 ? max(index + length, 0) : min(index, length);
  },
  has: function(it, key){
    return hasOwnProperty.call(it, key);
  },
  create:     Object.create,
  getProto:   Object.getPrototypeOf,
  DESC:       DESC,
  desc:       desc,
  getDesc:    Object.getOwnPropertyDescriptor,
  setDesc:    defineProperty,
  setDescs:   Object.defineProperties,
  getKeys:    Object.keys,
  getNames:   Object.getOwnPropertyNames,
  getSymbols: Object.getOwnPropertySymbols,
  assertDefined: assertDefined,
  // Dummy, fix for not array-like ES3 string in es5 module
  ES5Object: Object,
  toObject: function(it){
    return $.ES5Object(assertDefined(it));
  },
  hide: hide,
  def: createDefiner(0),
  set: global.Symbol ? simpleSet : hide,
  each: [].forEach
});
/* eslint-disable no-undef */
if(typeof __e != 'undefined')__e = core;
if(typeof __g != 'undefined')__g = global;
},{"./$.fw":5}],7:[function(require,module,exports){
//  Ramda v0.15.0
//  https://github.com/ramda/ramda
//  (c) 2013-2015 Scott Sauyet, Michael Hurley, and David Chambers
//  Ramda may be freely distributed under the MIT license.

;(function() {

  'use strict';

  /**
     * A special placeholder value used to specify "gaps" within curried functions,
     * allowing partial application of any combination of arguments,
     * regardless of their positions.
     *
     * If `g` is a curried ternary function and `_` is `R.__`, the following are equivalent:
     *
     *   - `g(1, 2, 3)`
     *   - `g(_, 2, 3)(1)`
     *   - `g(_, _, 3)(1)(2)`
     *   - `g(_, _, 3)(1, 2)`
     *   - `g(_, 2, _)(1, 3)`
     *   - `g(_, 2)(1)(3)`
     *   - `g(_, 2)(1, 3)`
     *   - `g(_, 2)(_, 3)(1)`
     *
     * @constant
     * @memberOf R
     * @category Function
     * @example
     *
     *      var greet = R.replace('{name}', R.__, 'Hello, {name}!');
     *      greet('Alice'); //=> 'Hello, Alice!'
     */
    var __ = { '@@functional/placeholder': true };

    var _add = function _add(a, b) {
        return a + b;
    };

    var _all = function _all(fn, list) {
        var idx = 0;
        while (idx < list.length) {
            if (!fn(list[idx])) {
                return false;
            }
            idx += 1;
        }
        return true;
    };

    var _any = function _any(fn, list) {
        var idx = 0;
        while (idx < list.length) {
            if (fn(list[idx])) {
                return true;
            }
            idx += 1;
        }
        return false;
    };

    var _assoc = function _assoc(prop, val, obj) {
        var result = {};
        for (var p in obj) {
            result[p] = obj[p];
        }
        result[prop] = val;
        return result;
    };

    var _cloneRegExp = function _cloneRegExp(pattern) {
        return new RegExp(pattern.source, (pattern.global ? 'g' : '') + (pattern.ignoreCase ? 'i' : '') + (pattern.multiline ? 'm' : '') + (pattern.sticky ? 'y' : '') + (pattern.unicode ? 'u' : ''));
    };

    var _complement = function _complement(f) {
        return function () {
            return !f.apply(this, arguments);
        };
    };

    /**
     * Basic, right-associative composition function. Accepts two functions and returns the
     * composite function; this composite function represents the operation `var h = f(g(x))`,
     * where `f` is the first argument, `g` is the second argument, and `x` is whatever
     * argument(s) are passed to `h`.
     *
     * This function's main use is to build the more general `compose` function, which accepts
     * any number of functions.
     *
     * @private
     * @category Function
     * @param {Function} f A function.
     * @param {Function} g A function.
     * @return {Function} A new function that is the equivalent of `f(g(x))`.
     * @example
     *
     *      var double = function(x) { return x * 2; };
     *      var square = function(x) { return x * x; };
     *      var squareThenDouble = _compose(double, square);
     *
     *      squareThenDouble(5); //≅ double(square(5)) => 50
     */
    var _compose = function _compose(f, g) {
        return function () {
            return f.call(this, g.apply(this, arguments));
        };
    };

    /**
     * Private `concat` function to merge two array-like objects.
     *
     * @private
     * @param {Array|Arguments} [set1=[]] An array-like object.
     * @param {Array|Arguments} [set2=[]] An array-like object.
     * @return {Array} A new, merged array.
     * @example
     *
     *      _concat([4, 5, 6], [1, 2, 3]); //=> [4, 5, 6, 1, 2, 3]
     */
    var _concat = function _concat(set1, set2) {
        set1 = set1 || [];
        set2 = set2 || [];
        var idx;
        var result = [];
        idx = 0;
        while (idx < set1.length) {
            result[result.length] = set1[idx];
            idx += 1;
        }
        idx = 0;
        while (idx < set2.length) {
            result[result.length] = set2[idx];
            idx += 1;
        }
        return result;
    };

    var _containsWith = function _containsWith(pred, x, list) {
        var idx = 0;
        while (idx < list.length) {
            if (pred(x, list[idx])) {
                return true;
            }
            idx += 1;
        }
        return false;
    };

    var _createMapEntry = function _createMapEntry(key, val) {
        var obj = {};
        obj[key] = val;
        return obj;
    };

    /**
     * Create a function which takes a comparator function and a list
     * and determines the winning value by a compatator. Used internally
     * by `R.maxBy` and `R.minBy`
     *
     * @private
     * @param {Function} compatator a function to compare two items
     * @category Math
     * @return {Function}
     */
    var _createMaxMinBy = function _createMaxMinBy(comparator) {
        return function (valueComputer, list) {
            if (!(list && list.length > 0)) {
                return;
            }
            var idx = 1;
            var winner = list[idx];
            var computedWinner = valueComputer(winner);
            var computedCurrent;
            while (idx < list.length) {
                computedCurrent = valueComputer(list[idx]);
                if (comparator(computedCurrent, computedWinner)) {
                    computedWinner = computedCurrent;
                    winner = list[idx];
                }
                idx += 1;
            }
            return winner;
        };
    };

    /**
     * Optimized internal two-arity curry function.
     *
     * @private
     * @category Function
     * @param {Function} fn The function to curry.
     * @return {Function} The curried function.
     */
    var _curry1 = function _curry1(fn) {
        return function f1(a) {
            if (arguments.length === 0) {
                return f1;
            } else if (a != null && a['@@functional/placeholder'] === true) {
                return f1;
            } else {
                return fn(a);
            }
        };
    };

    /**
     * Optimized internal two-arity curry function.
     *
     * @private
     * @category Function
     * @param {Function} fn The function to curry.
     * @return {Function} The curried function.
     */
    var _curry2 = function _curry2(fn) {
        return function f2(a, b) {
            var n = arguments.length;
            if (n === 0) {
                return f2;
            } else if (n === 1 && a != null && a['@@functional/placeholder'] === true) {
                return f2;
            } else if (n === 1) {
                return _curry1(function (b) {
                    return fn(a, b);
                });
            } else if (n === 2 && a != null && a['@@functional/placeholder'] === true && b != null && b['@@functional/placeholder'] === true) {
                return f2;
            } else if (n === 2 && a != null && a['@@functional/placeholder'] === true) {
                return _curry1(function (a) {
                    return fn(a, b);
                });
            } else if (n === 2 && b != null && b['@@functional/placeholder'] === true) {
                return _curry1(function (b) {
                    return fn(a, b);
                });
            } else {
                return fn(a, b);
            }
        };
    };

    /**
     * Optimized internal three-arity curry function.
     *
     * @private
     * @category Function
     * @param {Function} fn The function to curry.
     * @return {Function} The curried function.
     */
    var _curry3 = function _curry3(fn) {
        return function f3(a, b, c) {
            var n = arguments.length;
            if (n === 0) {
                return f3;
            } else if (n === 1 && a != null && a['@@functional/placeholder'] === true) {
                return f3;
            } else if (n === 1) {
                return _curry2(function (b, c) {
                    return fn(a, b, c);
                });
            } else if (n === 2 && a != null && a['@@functional/placeholder'] === true && b != null && b['@@functional/placeholder'] === true) {
                return f3;
            } else if (n === 2 && a != null && a['@@functional/placeholder'] === true) {
                return _curry2(function (a, c) {
                    return fn(a, b, c);
                });
            } else if (n === 2 && b != null && b['@@functional/placeholder'] === true) {
                return _curry2(function (b, c) {
                    return fn(a, b, c);
                });
            } else if (n === 2) {
                return _curry1(function (c) {
                    return fn(a, b, c);
                });
            } else if (n === 3 && a != null && a['@@functional/placeholder'] === true && b != null && b['@@functional/placeholder'] === true && c != null && c['@@functional/placeholder'] === true) {
                return f3;
            } else if (n === 3 && a != null && a['@@functional/placeholder'] === true && b != null && b['@@functional/placeholder'] === true) {
                return _curry2(function (a, b) {
                    return fn(a, b, c);
                });
            } else if (n === 3 && a != null && a['@@functional/placeholder'] === true && c != null && c['@@functional/placeholder'] === true) {
                return _curry2(function (a, c) {
                    return fn(a, b, c);
                });
            } else if (n === 3 && b != null && b['@@functional/placeholder'] === true && c != null && c['@@functional/placeholder'] === true) {
                return _curry2(function (b, c) {
                    return fn(a, b, c);
                });
            } else if (n === 3 && a != null && a['@@functional/placeholder'] === true) {
                return _curry1(function (a) {
                    return fn(a, b, c);
                });
            } else if (n === 3 && b != null && b['@@functional/placeholder'] === true) {
                return _curry1(function (b) {
                    return fn(a, b, c);
                });
            } else if (n === 3 && c != null && c['@@functional/placeholder'] === true) {
                return _curry1(function (c) {
                    return fn(a, b, c);
                });
            } else {
                return fn(a, b, c);
            }
        };
    };

    var _dissoc = function _dissoc(prop, obj) {
        var result = {};
        for (var p in obj) {
            if (p !== prop) {
                result[p] = obj[p];
            }
        }
        return result;
    };

    var _filter = function _filter(fn, list) {
        var idx = 0, result = [];
        while (idx < list.length) {
            if (fn(list[idx])) {
                result[result.length] = list[idx];
            }
            idx += 1;
        }
        return result;
    };

    var _filterIndexed = function _filterIndexed(fn, list) {
        var idx = 0, result = [];
        while (idx < list.length) {
            if (fn(list[idx], idx, list)) {
                result[result.length] = list[idx];
            }
            idx += 1;
        }
        return result;
    };

    // i can't bear not to return *something*
    var _forEach = function _forEach(fn, list) {
        var idx = 0;
        while (idx < list.length) {
            fn(list[idx]);
            idx += 1;
        }
        // i can't bear not to return *something*
        return list;
    };

    var _forceReduced = function _forceReduced(x) {
        return {
            '@@transducer/value': x,
            '@@transducer/reduced': true
        };
    };

    /**
     * @private
     * @param {Function} fn The strategy for extracting function names from an object
     * @return {Function} A function that takes an object and returns an array of function names.
     */
    var _functionsWith = function _functionsWith(fn) {
        return function (obj) {
            return _filter(function (key) {
                return typeof obj[key] === 'function';
            }, fn(obj));
        };
    };

    var _gt = function _gt(a, b) {
        return a > b;
    };

    var _has = function _has(prop, obj) {
        return Object.prototype.hasOwnProperty.call(obj, prop);
    };

    var _identity = function _identity(x) {
        return x;
    };

    /**
     * Tests whether or not an object is an array.
     *
     * @private
     * @param {*} val The object to test.
     * @return {Boolean} `true` if `val` is an array, `false` otherwise.
     * @example
     *
     *      _isArray([]); //=> true
     *      _isArray(null); //=> false
     *      _isArray({}); //=> false
     */
    var _isArray = Array.isArray || function _isArray(val) {
        return val != null && val.length >= 0 && Object.prototype.toString.call(val) === '[object Array]';
    };

    /**
     * Determine if the passed argument is an integer.
     *
     * @private
     * @param {*} n
     * @category Type
     * @return {Boolean}
     */
    var _isInteger = Number.isInteger || function _isInteger(n) {
        return n << 0 === n;
    };

    /**
     * Tests if a value is a thenable (promise).
     */
    var _isThenable = function _isThenable(value) {
        return value != null && value === Object(value) && typeof value.then === 'function';
    };

    var _isTransformer = function _isTransformer(obj) {
        return typeof obj['@@transducer/step'] === 'function';
    };

    var _lt = function _lt(a, b) {
        return a < b;
    };

    var _map = function _map(fn, list) {
        var idx = 0, result = [];
        while (idx < list.length) {
            result[idx] = fn(list[idx]);
            idx += 1;
        }
        return result;
    };

    var _multiply = function _multiply(a, b) {
        return a * b;
    };

    var _nth = function _nth(n, list) {
        return n < 0 ? list[list.length + n] : list[n];
    };

    /**
     * internal path function
     * Takes an array, paths, indicating the deep set of keys
     * to find.
     *
     * @private
     * @memberOf R
     * @category Object
     * @param {Array} paths An array of strings to map to object properties
     * @param {Object} obj The object to find the path in
     * @return {Array} The value at the end of the path or `undefined`.
     * @example
     *
     *      _path(['a', 'b'], {a: {b: 2}}); //=> 2
     */
    var _path = function _path(paths, obj) {
        if (obj == null) {
            return;
        } else {
            var val = obj;
            for (var idx = 0; idx < paths.length && val != null; idx += 1) {
                val = val[paths[idx]];
            }
            return val;
        }
    };

    var _prepend = function _prepend(el, list) {
        return _concat([el], list);
    };

    var _quote = function _quote(s) {
        return '"' + s.replace(/"/g, '\\"') + '"';
    };

    var _reduced = function _reduced(x) {
        return x && x['@@transducer/reduced'] ? x : {
            '@@transducer/value': x,
            '@@transducer/reduced': true
        };
    };

    /**
     * An optimized, private array `slice` implementation.
     *
     * @private
     * @param {Arguments|Array} args The array or arguments object to consider.
     * @param {Number} [from=0] The array index to slice from, inclusive.
     * @param {Number} [to=args.length] The array index to slice to, exclusive.
     * @return {Array} A new, sliced array.
     * @example
     *
     *      _slice([1, 2, 3, 4, 5], 1, 3); //=> [2, 3]
     *
     *      var firstThreeArgs = function(a, b, c, d) {
     *        return _slice(arguments, 0, 3);
     *      };
     *      firstThreeArgs(1, 2, 3, 4); //=> [1, 2, 3]
     */
    var _slice = function _slice(args, from, to) {
        switch (arguments.length) {
        case 1:
            return _slice(args, 0, args.length);
        case 2:
            return _slice(args, from, args.length);
        default:
            var list = [];
            var idx = 0;
            var len = Math.max(0, Math.min(args.length, to) - from);
            while (idx < len) {
                list[idx] = args[from + idx];
                idx += 1;
            }
            return list;
        }
    };

    /**
     * Polyfill from <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString>.
     */
    var _toISOString = function () {
        var pad = function pad(n) {
            return (n < 10 ? '0' : '') + n;
        };
        return typeof Date.prototype.toISOString === 'function' ? function _toISOString(d) {
            return d.toISOString();
        } : function _toISOString(d) {
            return d.getUTCFullYear() + '-' + pad(d.getUTCMonth() + 1) + '-' + pad(d.getUTCDate()) + 'T' + pad(d.getUTCHours()) + ':' + pad(d.getUTCMinutes()) + ':' + pad(d.getUTCSeconds()) + '.' + (d.getUTCMilliseconds() / 1000).toFixed(3).slice(2, 5) + 'Z';
        };
    }();

    var _xdropRepeatsWith = function () {
        function XDropRepeatsWith(pred, xf) {
            this.xf = xf;
            this.pred = pred;
            this.lastValue = undefined;
            this.seenFirstValue = false;
        }
        XDropRepeatsWith.prototype['@@transducer/init'] = function () {
            return this.xf['@@transducer/init']();
        };
        XDropRepeatsWith.prototype['@@transducer/result'] = function (result) {
            return this.xf['@@transducer/result'](result);
        };
        XDropRepeatsWith.prototype['@@transducer/step'] = function (result, input) {
            var sameAsLast = false;
            if (!this.seenFirstValue) {
                this.seenFirstValue = true;
            } else if (this.pred(this.lastValue, input)) {
                sameAsLast = true;
            }
            this.lastValue = input;
            return sameAsLast ? result : this.xf['@@transducer/step'](result, input);
        };
        return _curry2(function _xdropRepeatsWith(pred, xf) {
            return new XDropRepeatsWith(pred, xf);
        });
    }();

    var _xfBase = {
        init: function () {
            return this.xf['@@transducer/init']();
        },
        result: function (result) {
            return this.xf['@@transducer/result'](result);
        }
    };

    var _xfilter = function () {
        function XFilter(f, xf) {
            this.xf = xf;
            this.f = f;
        }
        XFilter.prototype['@@transducer/init'] = _xfBase.init;
        XFilter.prototype['@@transducer/result'] = _xfBase.result;
        XFilter.prototype['@@transducer/step'] = function (result, input) {
            return this.f(input) ? this.xf['@@transducer/step'](result, input) : result;
        };
        return _curry2(function _xfilter(f, xf) {
            return new XFilter(f, xf);
        });
    }();

    var _xfind = function () {
        function XFind(f, xf) {
            this.xf = xf;
            this.f = f;
            this.found = false;
        }
        XFind.prototype['@@transducer/init'] = _xfBase.init;
        XFind.prototype['@@transducer/result'] = function (result) {
            if (!this.found) {
                result = this.xf['@@transducer/step'](result, void 0);
            }
            return this.xf['@@transducer/result'](result);
        };
        XFind.prototype['@@transducer/step'] = function (result, input) {
            if (this.f(input)) {
                this.found = true;
                result = _reduced(this.xf['@@transducer/step'](result, input));
            }
            return result;
        };
        return _curry2(function _xfind(f, xf) {
            return new XFind(f, xf);
        });
    }();

    var _xfindIndex = function () {
        function XFindIndex(f, xf) {
            this.xf = xf;
            this.f = f;
            this.idx = -1;
            this.found = false;
        }
        XFindIndex.prototype['@@transducer/init'] = _xfBase.init;
        XFindIndex.prototype['@@transducer/result'] = function (result) {
            if (!this.found) {
                result = this.xf['@@transducer/step'](result, -1);
            }
            return this.xf['@@transducer/result'](result);
        };
        XFindIndex.prototype['@@transducer/step'] = function (result, input) {
            this.idx += 1;
            if (this.f(input)) {
                this.found = true;
                result = _reduced(this.xf['@@transducer/step'](result, this.idx));
            }
            return result;
        };
        return _curry2(function _xfindIndex(f, xf) {
            return new XFindIndex(f, xf);
        });
    }();

    var _xfindLast = function () {
        function XFindLast(f, xf) {
            this.xf = xf;
            this.f = f;
        }
        XFindLast.prototype['@@transducer/init'] = _xfBase.init;
        XFindLast.prototype['@@transducer/result'] = function (result) {
            return this.xf['@@transducer/result'](this.xf['@@transducer/step'](result, this.last));
        };
        XFindLast.prototype['@@transducer/step'] = function (result, input) {
            if (this.f(input)) {
                this.last = input;
            }
            return result;
        };
        return _curry2(function _xfindLast(f, xf) {
            return new XFindLast(f, xf);
        });
    }();

    var _xfindLastIndex = function () {
        function XFindLastIndex(f, xf) {
            this.xf = xf;
            this.f = f;
            this.idx = -1;
            this.lastIdx = -1;
        }
        XFindLastIndex.prototype['@@transducer/init'] = _xfBase.init;
        XFindLastIndex.prototype['@@transducer/result'] = function (result) {
            return this.xf['@@transducer/result'](this.xf['@@transducer/step'](result, this.lastIdx));
        };
        XFindLastIndex.prototype['@@transducer/step'] = function (result, input) {
            this.idx += 1;
            if (this.f(input)) {
                this.lastIdx = this.idx;
            }
            return result;
        };
        return _curry2(function _xfindLastIndex(f, xf) {
            return new XFindLastIndex(f, xf);
        });
    }();

    var _xmap = function () {
        function XMap(f, xf) {
            this.xf = xf;
            this.f = f;
        }
        XMap.prototype['@@transducer/init'] = _xfBase.init;
        XMap.prototype['@@transducer/result'] = _xfBase.result;
        XMap.prototype['@@transducer/step'] = function (result, input) {
            return this.xf['@@transducer/step'](result, this.f(input));
        };
        return _curry2(function _xmap(f, xf) {
            return new XMap(f, xf);
        });
    }();

    var _xtake = function () {
        function XTake(n, xf) {
            this.xf = xf;
            this.n = n;
        }
        XTake.prototype['@@transducer/init'] = _xfBase.init;
        XTake.prototype['@@transducer/result'] = _xfBase.result;
        XTake.prototype['@@transducer/step'] = function (result, input) {
            this.n -= 1;
            return this.n === 0 ? _reduced(this.xf['@@transducer/step'](result, input)) : this.xf['@@transducer/step'](result, input);
        };
        return _curry2(function _xtake(n, xf) {
            return new XTake(n, xf);
        });
    }();

    var _xtakeWhile = function () {
        function XTakeWhile(f, xf) {
            this.xf = xf;
            this.f = f;
        }
        XTakeWhile.prototype['@@transducer/init'] = _xfBase.init;
        XTakeWhile.prototype['@@transducer/result'] = _xfBase.result;
        XTakeWhile.prototype['@@transducer/step'] = function (result, input) {
            return this.f(input) ? this.xf['@@transducer/step'](result, input) : _reduced(result);
        };
        return _curry2(function _xtakeWhile(f, xf) {
            return new XTakeWhile(f, xf);
        });
    }();

    var _xwrap = function () {
        function XWrap(fn) {
            this.f = fn;
        }
        XWrap.prototype['@@transducer/init'] = function () {
            throw new Error('init not implemented on XWrap');
        };
        XWrap.prototype['@@transducer/result'] = function (acc) {
            return acc;
        };
        XWrap.prototype['@@transducer/step'] = function (acc, x) {
            return this.f(acc, x);
        };
        return function _xwrap(fn) {
            return new XWrap(fn);
        };
    }();

    /**
     * Adds two numbers (or strings). Equivalent to `a + b` but curried.
     *
     * @func
     * @memberOf R
     * @category Math
     * @sig Number -> Number -> Number
     * @sig String -> String -> String
     * @param {Number|String} a The first value.
     * @param {Number|String} b The second value.
     * @return {Number|String} The result of `a + b`.
     * @example
     *
     *      R.add(2, 3);       //=>  5
     *      R.add(7)(10);      //=> 17
     */
    var add = _curry2(_add);

    /**
     * Applies a function to the value at the given index of an array,
     * returning a new copy of the array with the element at the given
     * index replaced with the result of the function application.
     * @see R.update
     *
     * @func
     * @memberOf R
     * @category List
     * @sig (a -> a) -> Number -> [a] -> [a]
     * @param {Function} fn The function to apply.
     * @param {Number} idx The index.
     * @param {Array|Arguments} list An array-like object whose value
     *        at the supplied index will be replaced.
     * @return {Array} A copy of the supplied array-like object with
     *         the element at index `idx` replaced with the value
     *         returned by applying `fn` to the existing element.
     * @example
     *
     *      R.adjust(R.add(10), 1, [0, 1, 2]);     //=> [0, 11, 2]
     *      R.adjust(R.add(10))(1)([0, 1, 2]);     //=> [0, 11, 2]
     */
    var adjust = _curry3(function (fn, idx, list) {
        if (idx >= list.length || idx < -list.length) {
            return list;
        }
        var start = idx < 0 ? list.length : 0;
        var _idx = start + idx;
        var _list = _concat(list);
        _list[_idx] = fn(list[_idx]);
        return _list;
    });

    /**
     * Returns a function that always returns the given value. Note that for non-primitives the value
     * returned is a reference to the original value.
     *
     * @func
     * @memberOf R
     * @category Function
     * @sig a -> (* -> a)
     * @param {*} val The value to wrap in a function
     * @return {Function} A Function :: * -> val.
     * @example
     *
     *      var t = R.always('Tee');
     *      t(); //=> 'Tee'
     */
    var always = _curry1(function always(val) {
        return function () {
            return val;
        };
    });

    /**
     * Returns a new list, composed of n-tuples of consecutive elements
     * If `n` is greater than the length of the list, an empty list is returned.
     *
     * @func
     * @memberOf R
     * @category List
     * @sig Number -> [a] -> [[a]]
     * @param {Number} n The size of the tuples to create
     * @param {Array} list The list to split into `n`-tuples
     * @return {Array} The new list.
     * @example
     *
     *      R.aperture(2, [1, 2, 3, 4, 5]); //=> [[1, 2], [2, 3], [3, 4], [4, 5]]
     *      R.aperture(3, [1, 2, 3, 4, 5]); //=> [[1, 2, 3], [2, 3, 4], [3, 4, 5]]
     *      R.aperture(7, [1, 2, 3, 4, 5]); //=> []
     */
    var aperture = _curry2(function aperture(n, list) {
        var idx = 0;
        var limit = list.length - (n - 1);
        var acc = new Array(limit >= 0 ? limit : 0);
        while (idx < limit) {
            acc[idx] = _slice(list, idx, idx + n);
            idx += 1;
        }
        return acc;
    });

    /**
     * Applies function `fn` to the argument list `args`. This is useful for
     * creating a fixed-arity function from a variadic function. `fn` should
     * be a bound function if context is significant.
     *
     * @func
     * @memberOf R
     * @category Function
     * @sig (*... -> a) -> [*] -> a
     * @param {Function} fn
     * @param {Array} args
     * @return {*}
     * @example
     *
     *      var nums = [1, 2, 3, -99, 42, 6, 7];
     *      R.apply(Math.max, nums); //=> 42
     */
    var apply = _curry2(function apply(fn, args) {
        return fn.apply(this, args);
    });

    /**
     * Wraps a function of any arity (including nullary) in a function that accepts exactly `n`
     * parameters. Unlike `nAry`, which passes only `n` arguments to the wrapped function,
     * functions produced by `arity` will pass all provided arguments to the wrapped function.
     *
     * @func
     * @memberOf R
     * @sig (Number, (* -> *)) -> (* -> *)
     * @category Function
     * @param {Number} n The desired arity of the returned function.
     * @param {Function} fn The function to wrap.
     * @return {Function} A new function wrapping `fn`. The new function is
     *         guaranteed to be of arity `n`.
     * @deprecated since v0.15.0
     * @example
     *
     *      var takesTwoArgs = function(a, b) {
     *        return [a, b];
     *      };
     *      takesTwoArgs.length; //=> 2
     *      takesTwoArgs(1, 2); //=> [1, 2]
     *
     *      var takesOneArg = R.arity(1, takesTwoArgs);
     *      takesOneArg.length; //=> 1
     *      // All arguments are passed through to the wrapped function
     *      takesOneArg(1, 2); //=> [1, 2]
     */
    // jshint unused:vars
    var arity = _curry2(function (n, fn) {
        // jshint unused:vars
        switch (n) {
        case 0:
            return function () {
                return fn.apply(this, arguments);
            };
        case 1:
            return function (a0) {
                return fn.apply(this, arguments);
            };
        case 2:
            return function (a0, a1) {
                return fn.apply(this, arguments);
            };
        case 3:
            return function (a0, a1, a2) {
                return fn.apply(this, arguments);
            };
        case 4:
            return function (a0, a1, a2, a3) {
                return fn.apply(this, arguments);
            };
        case 5:
            return function (a0, a1, a2, a3, a4) {
                return fn.apply(this, arguments);
            };
        case 6:
            return function (a0, a1, a2, a3, a4, a5) {
                return fn.apply(this, arguments);
            };
        case 7:
            return function (a0, a1, a2, a3, a4, a5, a6) {
                return fn.apply(this, arguments);
            };
        case 8:
            return function (a0, a1, a2, a3, a4, a5, a6, a7) {
                return fn.apply(this, arguments);
            };
        case 9:
            return function (a0, a1, a2, a3, a4, a5, a6, a7, a8) {
                return fn.apply(this, arguments);
            };
        case 10:
            return function (a0, a1, a2, a3, a4, a5, a6, a7, a8, a9) {
                return fn.apply(this, arguments);
            };
        default:
            throw new Error('First argument to arity must be a non-negative integer no greater than ten');
        }
    });

    /**
     * Makes a shallow clone of an object, setting or overriding the specified
     * property with the given value.  Note that this copies and flattens
     * prototype properties onto the new object as well.  All non-primitive
     * properties are copied by reference.
     *
     * @func
     * @memberOf R
     * @category Object
     * @sig String -> a -> {k: v} -> {k: v}
     * @param {String} prop the property name to set
     * @param {*} val the new value
     * @param {Object} obj the object to clone
     * @return {Object} a new object similar to the original except for the specified property.
     * @example
     *
     *      R.assoc('c', 3, {a: 1, b: 2}); //=> {a: 1, b: 2, c: 3}
     */
    var assoc = _curry3(_assoc);

    /**
     * Creates a function that is bound to a context.
     * Note: `R.bind` does not provide the additional argument-binding capabilities of
     * [Function.prototype.bind](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind).
     *
     * @func
     * @memberOf R
     * @category Function
     * @category Object
     * @see R.partial
     * @sig (* -> *) -> {*} -> (* -> *)
     * @param {Function} fn The function to bind to context
     * @param {Object} thisObj The context to bind `fn` to
     * @return {Function} A function that will execute in the context of `thisObj`.
     */
    var bind = _curry2(function bind(fn, thisObj) {
        return arity(fn.length, function () {
            return fn.apply(thisObj, arguments);
        });
    });

    /**
     * A function wrapping calls to the two functions in an `&&` operation, returning the result of the first
     * function if it is false-y and the result of the second function otherwise.  Note that this is
     * short-circuited, meaning that the second function will not be invoked if the first returns a false-y
     * value.
     *
     * @func
     * @memberOf R
     * @category Logic
     * @sig (*... -> Boolean) -> (*... -> Boolean) -> (*... -> Boolean)
     * @param {Function} f a predicate
     * @param {Function} g another predicate
     * @return {Function} a function that applies its arguments to `f` and `g` and `&&`s their outputs together.
     * @example
     *
     *      var gt10 = function(x) { return x > 10; };
     *      var even = function(x) { return x % 2 === 0 };
     *      var f = R.both(gt10, even);
     *      f(100); //=> true
     *      f(101); //=> false
     */
    var both = _curry2(function both(f, g) {
        return function _both() {
            return f.apply(this, arguments) && g.apply(this, arguments);
        };
    });

    /**
     * Makes a comparator function out of a function that reports whether the first element is less than the second.
     *
     * @func
     * @memberOf R
     * @category Function
     * @sig (a, b -> Boolean) -> (a, b -> Number)
     * @param {Function} pred A predicate function of arity two.
     * @return {Function} A Function :: a -> b -> Int that returns `-1` if a < b, `1` if b < a, otherwise `0`.
     * @example
     *
     *      var cmp = R.comparator(function(a, b) {
     *        return a.age < b.age;
     *      });
     *      var people = [
     *        // ...
     *      ];
     *      R.sort(cmp, people);
     */
    var comparator = _curry1(function comparator(pred) {
        return function (a, b) {
            return pred(a, b) ? -1 : pred(b, a) ? 1 : 0;
        };
    });

    /**
     * Takes a function `f` and returns a function `g` such that:
     *
     *   - applying `g` to zero or more arguments will give __true__ if applying
     *     the same arguments to `f` gives a logical __false__ value; and
     *
     *   - applying `g` to zero or more arguments will give __false__ if applying
     *     the same arguments to `f` gives a logical __true__ value.
     *
     * @func
     * @memberOf R
     * @category Logic
     * @sig (*... -> *) -> (*... -> Boolean)
     * @param {Function} f
     * @return {Function}
     * @example
     *
     *      var isEven = function(n) { return n % 2 === 0; };
     *      var isOdd = R.complement(isEven);
     *      isOdd(21); //=> true
     *      isOdd(42); //=> false
     */
    var complement = _curry1(_complement);

    /**
     * Returns a function, `fn`, which encapsulates if/else-if/else logic.
     * Each argument to `R.cond` is a [predicate, transform] pair. All of
     * the arguments to `fn` are applied to each of the predicates in turn
     * until one returns a "truthy" value, at which point `fn` returns the
     * result of applying its arguments to the corresponding transformer.
     * If none of the predicates matches, `fn` returns undefined.
     *
     * @func
     * @memberOf R
     * @category Logic
     * @sig [(*... -> Boolean),(*... -> *)]... -> (*... -> *)
     * @param {...Function} functions
     * @return {Function}
     * @example
     *
     *      var fn = R.cond(
     *        [R.equals(0),   R.always('water freezes at 0°C')],
     *        [R.equals(100), R.always('water boils at 100°C')],
     *        [R.T,           function(temp) { return 'nothing special happens at ' + temp + '°C'; }]
     *      );
     *      fn(0); //=> 'water freezes at 0°C'
     *      fn(50); //=> 'nothing special happens at 50°C'
     *      fn(100); //=> 'water boils at 100°C'
     */
    var cond = function cond() {
        var pairs = arguments;
        return function () {
            var idx = 0;
            while (idx < pairs.length) {
                if (pairs[idx][0].apply(this, arguments)) {
                    return pairs[idx][1].apply(this, arguments);
                }
                idx += 1;
            }
        };
    };

    /**
     * Returns `true` if the `x` is found in the `list`, using `pred` as an
     * equality predicate for `x`.
     *
     * @func
     * @memberOf R
     * @category List
     * @sig (a, a -> Boolean) -> a -> [a] -> Boolean
     * @param {Function} pred A predicate used to test whether two items are equal.
     * @param {*} x The item to find
     * @param {Array} list The list to iterate over
     * @return {Boolean} `true` if `x` is in `list`, else `false`.
     * @example
     *
     *      var xs = [{x: 12}, {x: 11}, {x: 10}];
     *      R.containsWith(function(a, b) { return a.x === b.x; }, {x: 10}, xs); //=> true
     *      R.containsWith(function(a, b) { return a.x === b.x; }, {x: 1}, xs); //=> false
     */
    var containsWith = _curry3(_containsWith);

    /**
     * Counts the elements of a list according to how many match each value
     * of a key generated by the supplied function. Returns an object
     * mapping the keys produced by `fn` to the number of occurrences in
     * the list. Note that all keys are coerced to strings because of how
     * JavaScript objects work.
     *
     * @func
     * @memberOf R
     * @category Relation
     * @sig (a -> String) -> [a] -> {*}
     * @param {Function} fn The function used to map values to keys.
     * @param {Array} list The list to count elements from.
     * @return {Object} An object mapping keys to number of occurrences in the list.
     * @example
     *
     *      var numbers = [1.0, 1.1, 1.2, 2.0, 3.0, 2.2];
     *      var letters = R.split('', 'abcABCaaaBBc');
     *      R.countBy(Math.floor)(numbers);    //=> {'1': 3, '2': 2, '3': 1}
     *      R.countBy(R.toLower)(letters);   //=> {'a': 5, 'b': 4, 'c': 3}
     */
    var countBy = _curry2(function countBy(fn, list) {
        var counts = {};
        var idx = 0;
        while (idx < list.length) {
            var key = fn(list[idx]);
            counts[key] = (_has(key, counts) ? counts[key] : 0) + 1;
            idx += 1;
        }
        return counts;
    });

    /**
     * Creates an object containing a single key:value pair.
     *
     * @func
     * @memberOf R
     * @category Object
     * @sig String -> a -> {String:a}
     * @param {String} key
     * @param {*} val
     * @return {Object}
     * @example
     *
     *      var matchPhrases = R.compose(
     *        R.createMapEntry('must'),
     *        R.map(R.createMapEntry('match_phrase'))
     *      );
     *      matchPhrases(['foo', 'bar', 'baz']); //=> {must: [{match_phrase: 'foo'}, {match_phrase: 'bar'}, {match_phrase: 'baz'}]}
     */
    var createMapEntry = _curry2(_createMapEntry);

    /**
     * Decrements its argument.
     *
     * @func
     * @memberOf R
     * @category Math
     * @sig Number -> Number
     * @param {Number} n
     * @return {Number}
     * @example
     *
     *      R.dec(42); //=> 41
     */
    var dec = add(-1);

    /**
     * Returns the second argument if it is not null or undefined. If it is null
     * or undefined, the first (default) argument is returned.
     *
     * @func
     * @memberOf R
     * @category Logic
     * @sig a -> b -> a | b
     * @param {a} val The default value.
     * @param {b} val The value to return if it is not null or undefined
     * @return {*} The the second value or the default value
     * @example
     *
     *      var defaultTo42 = defaultTo(42);
     *
     *      defaultTo42(null);  //=> 42
     *      defaultTo42(undefined);  //=> 42
     *      defaultTo42('Ramda');  //=> 'Ramda'
     */
    var defaultTo = _curry2(function defaultTo(d, v) {
        return v == null ? d : v;
    });

    /**
     * Finds the set (i.e. no duplicates) of all elements in the first list not contained in the second list.
     * Duplication is determined according to the value returned by applying the supplied predicate to two list
     * elements.
     *
     * @func
     * @memberOf R
     * @category Relation
     * @sig (a,a -> Boolean) -> [a] -> [a] -> [a]
     * @param {Function} pred A predicate used to test whether two items are equal.
     * @param {Array} list1 The first list.
     * @param {Array} list2 The second list.
     * @see R.difference
     * @return {Array} The elements in `list1` that are not in `list2`.
     * @example
     *
     *      function cmp(x, y) { return x.a === y.a; }
     *      var l1 = [{a: 1}, {a: 2}, {a: 3}];
     *      var l2 = [{a: 3}, {a: 4}];
     *      R.differenceWith(cmp, l1, l2); //=> [{a: 1}, {a: 2}]
     */
    var differenceWith = _curry3(function differenceWith(pred, first, second) {
        var out = [];
        var idx = 0;
        var containsPred = containsWith(pred);
        while (idx < first.length) {
            if (!containsPred(first[idx], second) && !containsPred(first[idx], out)) {
                out[out.length] = first[idx];
            }
            idx += 1;
        }
        return out;
    });

    /**
     * Returns a new object that does not contain a `prop` property.
     *
     * @func
     * @memberOf R
     * @category Object
     * @sig String -> {k: v} -> {k: v}
     * @param {String} prop the name of the property to dissociate
     * @param {Object} obj the object to clone
     * @return {Object} a new object similar to the original but without the specified property
     * @example
     *
     *      R.dissoc('b', {a: 1, b: 2, c: 3}); //=> {a: 1, c: 3}
     */
    var dissoc = _curry2(_dissoc);

    /**
     * Divides two numbers. Equivalent to `a / b`.
     *
     * @func
     * @memberOf R
     * @category Math
     * @sig Number -> Number -> Number
     * @param {Number} a The first value.
     * @param {Number} b The second value.
     * @return {Number} The result of `a / b`.
     * @example
     *
     *      R.divide(71, 100); //=> 0.71
     *
     *      var half = R.divide(R.__, 2);
     *      half(42); //=> 21
     *
     *      var reciprocal = R.divide(1);
     *      reciprocal(4);   //=> 0.25
     */
    var divide = _curry2(function divide(a, b) {
        return a / b;
    });

    /**
     * A function wrapping calls to the two functions in an `||` operation, returning the result of the first
     * function if it is truth-y and the result of the second function otherwise.  Note that this is
     * short-circuited, meaning that the second function will not be invoked if the first returns a truth-y
     * value.
     *
     * @func
     * @memberOf R
     * @category Logic
     * @sig (*... -> Boolean) -> (*... -> Boolean) -> (*... -> Boolean)
     * @param {Function} f a predicate
     * @param {Function} g another predicate
     * @return {Function} a function that applies its arguments to `f` and `g` and `||`s their outputs together.
     * @example
     *
     *      var gt10 = function(x) { return x > 10; };
     *      var even = function(x) { return x % 2 === 0 };
     *      var f = R.either(gt10, even);
     *      f(101); //=> true
     *      f(8); //=> true
     */
    var either = _curry2(function either(f, g) {
        return function _either() {
            return f.apply(this, arguments) || g.apply(this, arguments);
        };
    });

    /**
     * Creates a new object by recursively evolving a shallow copy of `object`, according to the
     * `transformation` functions. All non-primitive properties are copied by reference.
     *
     * A `tranformation` function will not be invoked if its corresponding key does not exist in
     * the evolved object.
     *
     * @func
     * @memberOf R
     * @category Object
     * @sig {k: (v -> v)} -> {k: v} -> {k: v}
     * @param {Object} transformations The object specifying transformation functions to apply
     *        to the object.
     * @param {Object} object The object to be transformed.
     * @return {Object} The transformed object.
     * @example
     *
     *      var tomato  = {firstName: '  Tomato ', elapsed: 100, remaining: 1400};
     *      var transformations = {
     *        firstName: R.trim,
     *        lastName: R.trim, // Will not get invoked.
     *        data: {elapsed: R.add(1), remaining: R.add(-1)}
     *      };
     *      R.evolve(transformations, tomato); //=> {firstName: 'Tomato', data: {elapsed: 101, remaining: 1399}}
     */
    var evolve = _curry2(function evolve(transformations, object) {
        var transformation, key, type, result = {};
        for (key in object) {
            transformation = transformations[key];
            type = typeof transformation;
            result[key] = type === 'function' ? transformation(object[key]) : type === 'object' ? evolve(transformations[key], object[key]) : object[key];
        }
        return result;
    });

    /**
     * Like `filter`, but passes additional parameters to the predicate function. The predicate
     * function is passed three arguments: *(value, index, list)*.
     *
     * @func
     * @memberOf R
     * @category List
     * @sig (a, i, [a] -> Boolean) -> [a] -> [a]
     * @param {Function} fn The function called per iteration.
     * @param {Array} list The collection to iterate over.
     * @return {Array} The new filtered array.
     * @deprecated since v0.15.0
     * @see R.addIndex
     * @example
     *
     *      var lastTwo = function(val, idx, list) {
     *        return list.length - idx <= 2;
     *      };
     *      R.filterIndexed(lastTwo, [8, 6, 7, 5, 3, 0, 9]); //=> [0, 9]
     */
    var filterIndexed = _curry2(_filterIndexed);

    /**
     * Like `forEach`, but but passes additional parameters to the predicate function.
     *
     * `fn` receives three arguments: *(value, index, list)*.
     *
     * Note: `R.forEachIndexed` does not skip deleted or unassigned indices (sparse arrays),
     * unlike the native `Array.prototype.forEach` method. For more details on this behavior,
     * see:
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach#Description
     *
     * Also note that, unlike `Array.prototype.forEach`, Ramda's `forEach` returns the original
     * array. In some libraries this function is named `each`.
     *
     * @func
     * @memberOf R
     * @category List
     * @sig (a, i, [a] -> ) -> [a] -> [a]
     * @param {Function} fn The function to invoke. Receives three arguments:
     *        (`value`, `index`, `list`).
     * @param {Array} list The list to iterate over.
     * @return {Array} The original list.
     * @deprecated since v0.15.0
     * @see R.addIndex
     * @example
     *
     *      // Note that having access to the original `list` allows for
     *      // mutation. While you *can* do this, it's very un-functional behavior:
     *      var plusFive = function(num, idx, list) { list[idx] = num + 5 };
     *      R.forEachIndexed(plusFive, [1, 2, 3]); //=> [6, 7, 8]
     */
    // i can't bear not to return *something*
    var forEachIndexed = _curry2(function forEachIndexed(fn, list) {
        var idx = 0;
        while (idx < list.length) {
            fn(list[idx], idx, list);
            idx += 1;
        }
        // i can't bear not to return *something*
        return list;
    });

    /**
     * Creates a new object out of a list key-value pairs.
     *
     * @func
     * @memberOf R
     * @category List
     * @sig [[k,v]] -> {k: v}
     * @param {Array} pairs An array of two-element arrays that will be the keys and values of the output object.
     * @return {Object} The object made by pairing up `keys` and `values`.
     * @example
     *
     *      R.fromPairs([['a', 1], ['b', 2],  ['c', 3]]); //=> {a: 1, b: 2, c: 3}
     */
    var fromPairs = _curry1(function fromPairs(pairs) {
        var idx = 0, out = {};
        while (idx < pairs.length) {
            if (_isArray(pairs[idx]) && pairs[idx].length) {
                out[pairs[idx][0]] = pairs[idx][1];
            }
            idx += 1;
        }
        return out;
    });

    /**
     * Returns true if the first parameter is greater than the second.
     *
     * @func
     * @memberOf R
     * @category Math
     * @sig Number -> Number -> Boolean
     * @param {Number} a
     * @param {Number} b
     * @return {Boolean} a > b
     * @example
     *
     *      R.gt(2, 6); //=> false
     *      R.gt(2, 0); //=> true
     *      R.gt(2, 2); //=> false
     *      R.gt(R.__, 2)(10); //=> true
     *      R.gt(2)(10); //=> false
     */
    var gt = _curry2(_gt);

    /**
     * Returns true if the first parameter is greater than or equal to the second.
     *
     * @func
     * @memberOf R
     * @category Math
     * @sig Number -> Number -> Boolean
     * @param {Number} a
     * @param {Number} b
     * @return {Boolean} a >= b
     * @example
     *
     *      R.gte(2, 6); //=> false
     *      R.gte(2, 0); //=> true
     *      R.gte(2, 2); //=> true
     *      R.gte(R.__, 6)(2); //=> false
     *      R.gte(2)(0); //=> true
     */
    var gte = _curry2(function gte(a, b) {
        return a >= b;
    });

    /**
     * Returns whether or not an object has an own property with
     * the specified name
     *
     * @func
     * @memberOf R
     * @category Object
     * @sig s -> {s: x} -> Boolean
     * @param {String} prop The name of the property to check for.
     * @param {Object} obj The object to query.
     * @return {Boolean} Whether the property exists.
     * @example
     *
     *      var hasName = R.has('name');
     *      hasName({name: 'alice'});   //=> true
     *      hasName({name: 'bob'});     //=> true
     *      hasName({});                //=> false
     *
     *      var point = {x: 0, y: 0};
     *      var pointHas = R.has(R.__, point);
     *      pointHas('x');  //=> true
     *      pointHas('y');  //=> true
     *      pointHas('z');  //=> false
     */
    var has = _curry2(_has);

    /**
     * Returns whether or not an object or its prototype chain has
     * a property with the specified name
     *
     * @func
     * @memberOf R
     * @category Object
     * @sig s -> {s: x} -> Boolean
     * @param {String} prop The name of the property to check for.
     * @param {Object} obj The object to query.
     * @return {Boolean} Whether the property exists.
     * @example
     *
     *      function Rectangle(width, height) {
     *        this.width = width;
     *        this.height = height;
     *      }
     *      Rectangle.prototype.area = function() {
     *        return this.width * this.height;
     *      };
     *
     *      var square = new Rectangle(2, 2);
     *      R.hasIn('width', square);  //=> true
     *      R.hasIn('area', square);  //=> true
     */
    var hasIn = _curry2(function (prop, obj) {
        return prop in obj;
    });

    /**
     * Returns true if its arguments are identical, false otherwise. Values are
     * identical if they reference the same memory. `NaN` is identical to `NaN`;
     * `0` and `-0` are not identical.
     *
     * @func
     * @memberOf R
     * @category Relation
     * @sig a -> a -> Boolean
     * @param {*} a
     * @param {*} b
     * @return {Boolean}
     * @example
     *
     *      var o = {};
     *      R.identical(o, o); //=> true
     *      R.identical(1, 1); //=> true
     *      R.identical(1, '1'); //=> false
     *      R.identical([], []); //=> false
     *      R.identical(0, -0); //=> false
     *      R.identical(NaN, NaN); //=> true
     */
    // SameValue algorithm
    // Steps 1-5, 7-10
    // Steps 6.b-6.e: +0 != -0
    // Step 6.a: NaN == NaN
    var identical = _curry2(function identical(a, b) {
        // SameValue algorithm
        if (a === b) {
            // Steps 1-5, 7-10
            // Steps 6.b-6.e: +0 != -0
            return a !== 0 || 1 / a === 1 / b;
        } else {
            // Step 6.a: NaN == NaN
            return a !== a && b !== b;
        }
    });

    /**
     * A function that does nothing but return the parameter supplied to it. Good as a default
     * or placeholder function.
     *
     * @func
     * @memberOf R
     * @category Function
     * @sig a -> a
     * @param {*} x The value to return.
     * @return {*} The input value, `x`.
     * @example
     *
     *      R.identity(1); //=> 1
     *
     *      var obj = {};
     *      R.identity(obj) === obj; //=> true
     */
    var identity = _curry1(_identity);

    /**
     * Increments its argument.
     *
     * @func
     * @memberOf R
     * @category Math
     * @sig Number -> Number
     * @param {Number} n
     * @return {Number}
     * @example
     *
     *      R.inc(42); //=> 43
     */
    var inc = add(1);

    /**
     * Inserts the sub-list into the list, at index `index`.  _Note  that this
     * is not destructive_: it returns a copy of the list with the changes.
     * <small>No lists have been harmed in the application of this function.</small>
     *
     * @func
     * @memberOf R
     * @category List
     * @sig Number -> [a] -> [a] -> [a]
     * @param {Number} index The position to insert the sub-list
     * @param {Array} elts The sub-list to insert into the Array
     * @param {Array} list The list to insert the sub-list into
     * @return {Array} A new Array with `elts` inserted starting at `index`.
     * @example
     *
     *      R.insertAll(2, ['x','y','z'], [1,2,3,4]); //=> [1,2,'x','y','z',3,4]
     */
    var insertAll = _curry3(function insertAll(idx, elts, list) {
        idx = idx < list.length && idx >= 0 ? idx : list.length;
        return _concat(_concat(_slice(list, 0, idx), elts), _slice(list, idx));
    });

    /**
     * See if an object (`val`) is an instance of the supplied constructor.
     * This function will check up the inheritance chain, if any.
     *
     * @func
     * @memberOf R
     * @category Type
     * @sig (* -> {*}) -> a -> Boolean
     * @param {Object} ctor A constructor
     * @param {*} val The value to test
     * @return {Boolean}
     * @example
     *
     *      R.is(Object, {}); //=> true
     *      R.is(Number, 1); //=> true
     *      R.is(Object, 1); //=> false
     *      R.is(String, 's'); //=> true
     *      R.is(String, new String('')); //=> true
     *      R.is(Object, new String('')); //=> true
     *      R.is(Object, 's'); //=> false
     *      R.is(Number, {}); //=> false
     */
    var is = _curry2(function is(Ctor, val) {
        return val != null && val.constructor === Ctor || val instanceof Ctor;
    });

    /**
     * Tests whether or not an object is similar to an array.
     *
     * @func
     * @memberOf R
     * @category Type
     * @category List
     * @sig * -> Boolean
     * @param {*} x The object to test.
     * @return {Boolean} `true` if `x` has a numeric length property and extreme indices defined; `false` otherwise.
     * @example
     *
     *      R.isArrayLike([]); //=> true
     *      R.isArrayLike(true); //=> false
     *      R.isArrayLike({}); //=> false
     *      R.isArrayLike({length: 10}); //=> false
     *      R.isArrayLike({0: 'zero', 9: 'nine', length: 10}); //=> true
     */
    var isArrayLike = _curry1(function isArrayLike(x) {
        if (_isArray(x)) {
            return true;
        }
        if (!x) {
            return false;
        }
        if (typeof x !== 'object') {
            return false;
        }
        if (x instanceof String) {
            return false;
        }
        if (x.nodeType === 1) {
            return !!x.length;
        }
        if (x.length === 0) {
            return true;
        }
        if (x.length > 0) {
            return x.hasOwnProperty(0) && x.hasOwnProperty(x.length - 1);
        }
        return false;
    });

    /**
     * Reports whether the list has zero elements.
     *
     * @func
     * @memberOf R
     * @category Logic
     * @sig [a] -> Boolean
     * @param {Array} list
     * @return {Boolean}
     * @example
     *
     *      R.isEmpty([1, 2, 3]); //=> false
     *      R.isEmpty([]); //=> true
     *      R.isEmpty(''); //=> true
     *      R.isEmpty(null); //=> false
     */
    var isEmpty = _curry1(function isEmpty(list) {
        return Object(list).length === 0;
    });

    /**
     * Checks if the input value is `null` or `undefined`.
     *
     * @func
     * @memberOf R
     * @category Type
     * @sig * -> Boolean
     * @param {*} x The value to test.
     * @return {Boolean} `true` if `x` is `undefined` or `null`, otherwise `false`.
     * @example
     *
     *      R.isNil(null); //=> true
     *      R.isNil(undefined); //=> true
     *      R.isNil(0); //=> false
     *      R.isNil([]); //=> false
     */
    var isNil = _curry1(function isNil(x) {
        return x == null;
    });

    /**
     * Returns a list containing the names of all the enumerable own
     * properties of the supplied object.
     * Note that the order of the output array is not guaranteed to be
     * consistent across different JS platforms.
     *
     * @func
     * @memberOf R
     * @category Object
     * @sig {k: v} -> [k]
     * @param {Object} obj The object to extract properties from
     * @return {Array} An array of the object's own properties.
     * @example
     *
     *      R.keys({a: 1, b: 2, c: 3}); //=> ['a', 'b', 'c']
     */
    // cover IE < 9 keys issues
    var keys = function () {
        // cover IE < 9 keys issues
        var hasEnumBug = !{ toString: null }.propertyIsEnumerable('toString');
        var nonEnumerableProps = [
            'constructor',
            'valueOf',
            'isPrototypeOf',
            'toString',
            'propertyIsEnumerable',
            'hasOwnProperty',
            'toLocaleString'
        ];
        var contains = function contains(list, item) {
            var idx = 0;
            while (idx < list.length) {
                if (list[idx] === item) {
                    return true;
                }
                idx += 1;
            }
            return false;
        };
        return typeof Object.keys === 'function' ? _curry1(function keys(obj) {
            return Object(obj) !== obj ? [] : Object.keys(obj);
        }) : _curry1(function keys(obj) {
            if (Object(obj) !== obj) {
                return [];
            }
            var prop, ks = [], nIdx;
            for (prop in obj) {
                if (_has(prop, obj)) {
                    ks[ks.length] = prop;
                }
            }
            if (hasEnumBug) {
                nIdx = nonEnumerableProps.length - 1;
                while (nIdx >= 0) {
                    prop = nonEnumerableProps[nIdx];
                    if (_has(prop, obj) && !contains(ks, prop)) {
                        ks[ks.length] = prop;
                    }
                    nIdx -= 1;
                }
            }
            return ks;
        });
    }();

    /**
     * Returns a list containing the names of all the
     * properties of the supplied object, including prototype properties.
     * Note that the order of the output array is not guaranteed to be
     * consistent across different JS platforms.
     *
     * @func
     * @memberOf R
     * @category Object
     * @sig {k: v} -> [k]
     * @param {Object} obj The object to extract properties from
     * @return {Array} An array of the object's own and prototype properties.
     * @example
     *
     *      var F = function() { this.x = 'X'; };
     *      F.prototype.y = 'Y';
     *      var f = new F();
     *      R.keysIn(f); //=> ['x', 'y']
     */
    var keysIn = _curry1(function keysIn(obj) {
        var prop, ks = [];
        for (prop in obj) {
            ks[ks.length] = prop;
        }
        return ks;
    });

    /**
     * Returns the number of elements in the array by returning `list.length`.
     *
     * @func
     * @memberOf R
     * @category List
     * @sig [a] -> Number
     * @param {Array} list The array to inspect.
     * @return {Number} The length of the array.
     * @example
     *
     *      R.length([]); //=> 0
     *      R.length([1, 2, 3]); //=> 3
     */
    var length = _curry1(function length(list) {
        return list != null && is(Number, list.length) ? list.length : NaN;
    });

    /**
     * Creates a lens. Supply a function to `get` values from inside an object, and a `set`
     * function to change values on an object. (n.b.: This can, and should, be done without
     * mutating the original object!) The lens is a function wrapped around the input `get`
     * function, with the `set` function attached as a property on the wrapper. A `map`
     * function is also attached to the returned function that takes a function to operate
     * on the specified (`get`) property, which is then `set` before returning. The attached
     * `set` and `map` functions are curried.
     *
     * @func
     * @memberOf R
     * @category Object
     * @sig (k -> v) -> (v -> a -> *) -> (a -> b)
     * @param {Function} get A function that gets a value by property name
     * @param {Function} set A function that sets a value by property name
     * @return {Function} the returned function has `set` and `map` properties that are
     *         also curried functions.
     * @example
     *
     *      var headLens = R.lens(
     *        function get(arr) { return arr[0]; },
     *        function set(val, arr) { return [val].concat(arr.slice(1)); }
     *      );
     *      headLens([10, 20, 30, 40]); //=> 10
     *      headLens.set('mu', [10, 20, 30, 40]); //=> ['mu', 20, 30, 40]
     *      headLens.map(function(x) { return x + 1; }, [10, 20, 30, 40]); //=> [11, 20, 30, 40]
     *
     *      var phraseLens = R.lens(
     *        function get(obj) { return obj.phrase; },
     *        function set(val, obj) {
     *          var out = R.clone(obj);
     *          out.phrase = val;
     *          return out;
     *        }
     *      );
     *      var obj1 = { phrase: 'Absolute filth . . . and I LOVED it!'};
     *      var obj2 = { phrase: "What's all this, then?"};
     *      phraseLens(obj1); // => 'Absolute filth . . . and I LOVED it!'
     *      phraseLens(obj2); // => "What's all this, then?"
     *      phraseLens.set('Ooh Betty', obj1); //=> { phrase: 'Ooh Betty'}
     *      phraseLens.map(R.toUpper, obj2); //=> { phrase: "WHAT'S ALL THIS, THEN?"}
     */
    var lens = _curry2(function lens(get, set) {
        var lns = function (a) {
            return get(a);
        };
        lns.set = _curry2(set);
        lns.map = _curry2(function (fn, a) {
            return set(fn(get(a)), a);
        });
        return lns;
    });

    /**
     * Returns a lens associated with the provided object.
     *
     * @func
     * @memberOf R
     * @category Object
     * @sig ({} -> v) -> (v -> a -> *) -> {} -> (a -> b)
     * @see R.lens
     * @param {Function} get A function that gets a value by property name
     * @param {Function} set A function that sets a value by property name
     * @param {Object} the actual object of interest
     * @return {Function} the returned function has `set` and `map` properties that are
     *         also curried functions.
     * @example
     *
     *      var xo = {x: 1};
     *      var xoLens = R.lensOn(function get(o) { return o.x; },
     *                            function set(v) { return {x: v}; },
     *                            xo);
     *      xoLens(); //=> 1
     *      xoLens.set(1000); //=> {x: 1000}
     *      xoLens.map(R.add(1)); //=> {x: 2}
     */
    var lensOn = _curry3(function lensOn(get, set, obj) {
        var lns = function () {
            return get(obj);
        };
        lns.set = set;
        lns.map = function (fn) {
            return set(fn(get(obj)));
        };
        return lns;
    });

    /**
     * Returns true if the first parameter is less than the second.
     *
     * @func
     * @memberOf R
     * @category Math
     * @sig Number -> Number -> Boolean
     * @param {Number} a
     * @param {Number} b
     * @return {Boolean} a < b
     * @example
     *
     *      R.lt(2, 6); //=> true
     *      R.lt(2, 0); //=> false
     *      R.lt(2, 2); //=> false
     *      R.lt(5)(10); //=> true
     *      R.lt(R.__, 5)(10); //=> false // right-sectioned currying
     */
    var lt = _curry2(_lt);

    /**
     * Returns true if the first parameter is less than or equal to the second.
     *
     * @func
     * @memberOf R
     * @category Math
     * @sig Number -> Number -> Boolean
     * @param {Number} a
     * @param {Number} b
     * @return {Boolean} a <= b
     * @example
     *
     *      R.lte(2, 6); //=> true
     *      R.lte(2, 0); //=> false
     *      R.lte(2, 2); //=> true
     *      R.lte(R.__, 2)(1); //=> true
     *      R.lte(2)(10); //=> true
     */
    var lte = _curry2(function lte(a, b) {
        return a <= b;
    });

    /**
     * The mapAccum function behaves like a combination of map and reduce; it applies a
     * function to each element of a list, passing an accumulating parameter from left to
     * right, and returning a final value of this accumulator together with the new list.
     *
     * The iterator function receives two arguments, *acc* and *value*, and should return
     * a tuple *[acc, value]*.
     *
     * @func
     * @memberOf R
     * @category List
     * @sig (acc -> x -> (acc, y)) -> acc -> [x] -> (acc, [y])
     * @param {Function} fn The function to be called on every element of the input `list`.
     * @param {*} acc The accumulator value.
     * @param {Array} list The list to iterate over.
     * @return {*} The final, accumulated value.
     * @example
     *
     *      var digits = ['1', '2', '3', '4'];
     *      var append = function(a, b) {
     *        return [a + b, a + b];
     *      }
     *
     *      R.mapAccum(append, 0, digits); //=> ['01234', ['01', '012', '0123', '01234']]
     */
    var mapAccum = _curry3(function mapAccum(fn, acc, list) {
        var idx = 0, result = [], tuple = [acc];
        while (idx < list.length) {
            tuple = fn(tuple[0], list[idx]);
            result[idx] = tuple[1];
            idx += 1;
        }
        return [
            tuple[0],
            result
        ];
    });

    /**
     * The mapAccumRight function behaves like a combination of map and reduce; it applies a
     * function to each element of a list, passing an accumulating parameter from right
     * to left, and returning a final value of this accumulator together with the new list.
     *
     * Similar to `mapAccum`, except moves through the input list from the right to the
     * left.
     *
     * The iterator function receives two arguments, *acc* and *value*, and should return
     * a tuple *[acc, value]*.
     *
     * @func
     * @memberOf R
     * @category List
     * @sig (acc -> x -> (acc, y)) -> acc -> [x] -> (acc, [y])
     * @param {Function} fn The function to be called on every element of the input `list`.
     * @param {*} acc The accumulator value.
     * @param {Array} list The list to iterate over.
     * @return {*} The final, accumulated value.
     * @example
     *
     *      var digits = ['1', '2', '3', '4'];
     *      var append = function(a, b) {
     *        return [a + b, a + b];
     *      }
     *
     *      R.mapAccumRight(append, 0, digits); //=> ['04321', ['04321', '0432', '043', '04']]
     */
    var mapAccumRight = _curry3(function mapAccumRight(fn, acc, list) {
        var idx = list.length - 1, result = [], tuple = [acc];
        while (idx >= 0) {
            tuple = fn(tuple[0], list[idx]);
            result[idx] = tuple[1];
            idx -= 1;
        }
        return [
            tuple[0],
            result
        ];
    });

    /**
     * Like `map`, but but passes additional parameters to the mapping function.
     * `fn` receives three arguments: *(value, index, list)*.
     *
     * Note: `R.mapIndexed` does not skip deleted or unassigned indices (sparse arrays), unlike
     * the native `Array.prototype.map` method. For more details on this behavior, see:
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map#Description
     *
     * @func
     * @memberOf R
     * @category List
     * @sig (a,i,[b] -> b) -> [a] -> [b]
     * @param {Function} fn The function to be called on every element of the input `list`.
     * @param {Array} list The list to be iterated over.
     * @return {Array} The new list.
     * @deprecated since v0.15.0
     * @see R.addIndex
     * @example
     *
     *      var squareEnds = function(elt, idx, list) {
     *        if (idx === 0 || idx === list.length - 1) {
     *          return elt * elt;
     *        }
     *        return elt;
     *      };
     *
     *      R.mapIndexed(squareEnds, [8, 5, 3, 0, 9]); //=> [64, 5, 3, 0, 81]
     */
    var mapIndexed = _curry2(function mapIndexed(fn, list) {
        var idx = 0, result = [];
        while (idx < list.length) {
            result[idx] = fn(list[idx], idx, list);
            idx += 1;
        }
        return result;
    });

    /**
     * mathMod behaves like the modulo operator should mathematically, unlike the `%`
     * operator (and by extension, R.modulo). So while "-17 % 5" is -2,
     * mathMod(-17, 5) is 3. mathMod requires Integer arguments, and returns NaN
     * when the modulus is zero or negative.
     *
     * @func
     * @memberOf R
     * @category Math
     * @sig Number -> Number -> Number
     * @param {Number} m The dividend.
     * @param {Number} p the modulus.
     * @return {Number} The result of `b mod a`.
     * @see R.moduloBy
     * @example
     *
     *      R.mathMod(-17, 5);  //=> 3
     *      R.mathMod(17, 5);   //=> 2
     *      R.mathMod(17, -5);  //=> NaN
     *      R.mathMod(17, 0);   //=> NaN
     *      R.mathMod(17.2, 5); //=> NaN
     *      R.mathMod(17, 5.3); //=> NaN
     *
     *      var clock = R.mathMod(R.__, 12);
     *      clock(15); //=> 3
     *      clock(24); //=> 0
     *
     *      var seventeenMod = R.mathMod(17);
     *      seventeenMod(3);  //=> 2
     *      seventeenMod(4);  //=> 1
     *      seventeenMod(10); //=> 7
     */
    var mathMod = _curry2(function mathMod(m, p) {
        if (!_isInteger(m)) {
            return NaN;
        }
        if (!_isInteger(p) || p < 1) {
            return NaN;
        }
        return (m % p + p) % p;
    });

    /**
     * Determines the largest of a list of items as determined by pairwise comparisons from the supplied comparator.
     * Note that this will return undefined if supplied an empty list.
     *
     * @func
     * @memberOf R
     * @category Math
     * @sig (a -> Number) -> [a] -> a
     * @param {Function} keyFn A comparator function for elements in the list
     * @param {Array} list A list of comparable elements
     * @return {*} The greatest element in the list. `undefined` if the list is empty.
     * @see R.max
     * @example
     *
     *      function cmp(obj) { return obj.x; }
     *      var a = {x: 1}, b = {x: 2}, c = {x: 3};
     *      R.maxBy(cmp, [a, b, c]); //=> {x: 3}
     */
    var maxBy = _curry2(_createMaxMinBy(_gt));

    /**
     * Determines the smallest of a list of items as determined by pairwise comparisons from the supplied comparator
     * Note that this will return undefined if supplied an empty list.
     *
     * @func
     * @memberOf R
     * @category Math
     * @sig (a -> Number) -> [a] -> a
     * @param {Function} keyFn A comparator function for elements in the list
     * @param {Array} list A list of comparable elements
     * @see R.min
     * @return {*} The greatest element in the list. `undefined` if the list is empty.
     * @example
     *
     *      function cmp(obj) { return obj.x; }
     *      var a = {x: 1}, b = {x: 2}, c = {x: 3};
     *      R.minBy(cmp, [a, b, c]); //=> {x: 1}
     */
    var minBy = _curry2(_createMaxMinBy(_lt));

    /**
     * Divides the second parameter by the first and returns the remainder.
     * Note that this functions preserves the JavaScript-style behavior for
     * modulo. For mathematical modulo see `mathMod`
     *
     * @func
     * @memberOf R
     * @category Math
     * @sig Number -> Number -> Number
     * @param {Number} a The value to the divide.
     * @param {Number} b The pseudo-modulus
     * @return {Number} The result of `b % a`.
     * @see R.mathMod
     * @example
     *
     *      R.modulo(17, 3); //=> 2
     *      // JS behavior:
     *      R.modulo(-17, 3); //=> -2
     *      R.modulo(17, -3); //=> 2
     *
     *      var isOdd = R.modulo(R.__, 2);
     *      isOdd(42); //=> 0
     *      isOdd(21); //=> 1
     */
    var modulo = _curry2(function modulo(a, b) {
        return a % b;
    });

    /**
     * Multiplies two numbers. Equivalent to `a * b` but curried.
     *
     * @func
     * @memberOf R
     * @category Math
     * @sig Number -> Number -> Number
     * @param {Number} a The first value.
     * @param {Number} b The second value.
     * @return {Number} The result of `a * b`.
     * @example
     *
     *      var double = R.multiply(2);
     *      var triple = R.multiply(3);
     *      double(3);       //=>  6
     *      triple(4);       //=> 12
     *      R.multiply(2, 5);  //=> 10
     */
    var multiply = _curry2(_multiply);

    /**
     * Wraps a function of any arity (including nullary) in a function that accepts exactly `n`
     * parameters. Any extraneous parameters will not be passed to the supplied function.
     *
     * @func
     * @memberOf R
     * @category Function
     * @sig Number -> (* -> a) -> (* -> a)
     * @param {Number} n The desired arity of the new function.
     * @param {Function} fn The function to wrap.
     * @return {Function} A new function wrapping `fn`. The new function is guaranteed to be of
     *         arity `n`.
     * @example
     *
     *      var takesTwoArgs = function(a, b) {
     *        return [a, b];
     *      };
     *      takesTwoArgs.length; //=> 2
     *      takesTwoArgs(1, 2); //=> [1, 2]
     *
     *      var takesOneArg = R.nAry(1, takesTwoArgs);
     *      takesOneArg.length; //=> 1
     *      // Only `n` arguments are passed to the wrapped function
     *      takesOneArg(1, 2); //=> [1, undefined]
     */
    var nAry = _curry2(function (n, fn) {
        switch (n) {
        case 0:
            return function () {
                return fn.call(this);
            };
        case 1:
            return function (a0) {
                return fn.call(this, a0);
            };
        case 2:
            return function (a0, a1) {
                return fn.call(this, a0, a1);
            };
        case 3:
            return function (a0, a1, a2) {
                return fn.call(this, a0, a1, a2);
            };
        case 4:
            return function (a0, a1, a2, a3) {
                return fn.call(this, a0, a1, a2, a3);
            };
        case 5:
            return function (a0, a1, a2, a3, a4) {
                return fn.call(this, a0, a1, a2, a3, a4);
            };
        case 6:
            return function (a0, a1, a2, a3, a4, a5) {
                return fn.call(this, a0, a1, a2, a3, a4, a5);
            };
        case 7:
            return function (a0, a1, a2, a3, a4, a5, a6) {
                return fn.call(this, a0, a1, a2, a3, a4, a5, a6);
            };
        case 8:
            return function (a0, a1, a2, a3, a4, a5, a6, a7) {
                return fn.call(this, a0, a1, a2, a3, a4, a5, a6, a7);
            };
        case 9:
            return function (a0, a1, a2, a3, a4, a5, a6, a7, a8) {
                return fn.call(this, a0, a1, a2, a3, a4, a5, a6, a7, a8);
            };
        case 10:
            return function (a0, a1, a2, a3, a4, a5, a6, a7, a8, a9) {
                return fn.call(this, a0, a1, a2, a3, a4, a5, a6, a7, a8, a9);
            };
        default:
            throw new Error('First argument to nAry must be a non-negative integer no greater than ten');
        }
    });

    /**
     * Negates its argument.
     *
     * @func
     * @memberOf R
     * @category Math
     * @sig Number -> Number
     * @param {Number} n
     * @return {Number}
     * @example
     *
     *      R.negate(42); //=> -42
     */
    var negate = _curry1(function negate(n) {
        return -n;
    });

    /**
     * A function that returns the `!` of its argument. It will return `true` when
     * passed false-y value, and `false` when passed a truth-y one.
     *
     * @func
     * @memberOf R
     * @category Logic
     * @sig * -> Boolean
     * @param {*} a any value
     * @return {Boolean} the logical inverse of passed argument.
     * @see R.complement
     * @example
     *
     *      R.not(true); //=> false
     *      R.not(false); //=> true
     *      R.not(0); => true
     *      R.not(1); => false
     */
    var not = _curry1(function not(a) {
        return !a;
    });

    /**
     * Returns the nth element in a list.
     * If n is negative the element at index length + n is returned.
     *
     * @func
     * @memberOf R
     * @category List
     * @sig Number -> [a] -> a
     * @param {Number} idx
     * @param {Array} list
     * @return {*} The nth element of the list.
     * @example
     *
     *      var list = ['foo', 'bar', 'baz', 'quux'];
     *      R.nth(1, list); //=> 'bar'
     *      R.nth(-1, list); //=> 'quux'
     *      R.nth(-99, list); //=> undefined
     */
    var nth = _curry2(_nth);

    /**
     * Returns a function which returns its nth argument.
     *
     * @func
     * @memberOf R
     * @category Function
     * @sig Number -> *... -> *
     * @param {Number} n
     * @return {Function}
     * @example
     *
     *      R.nthArg(1)('a', 'b', 'c'); //=> 'b'
     *      R.nthArg(-1)('a', 'b', 'c'); //=> 'c'
     */
    var nthArg = _curry1(function nthArg(n) {
        return function () {
            return _nth(n, arguments);
        };
    });

    /**
     * Returns the nth character of the given string.
     *
     * @func
     * @memberOf R
     * @category String
     * @sig Number -> String -> String
     * @param {Number} n
     * @param {String} str
     * @return {String}
     * @example
     *
     *      R.nthChar(2, 'Ramda'); //=> 'm'
     *      R.nthChar(-2, 'Ramda'); //=> 'd'
     */
    var nthChar = _curry2(function nthChar(n, str) {
        return str.charAt(n < 0 ? str.length + n : n);
    });

    /**
     * Returns the character code of the nth character of the given string.
     *
     * @func
     * @memberOf R
     * @category String
     * @sig Number -> String -> Number
     * @param {Number} n
     * @param {String} str
     * @return {Number}
     * @example
     *
     *      R.nthCharCode(2, 'Ramda'); //=> 'm'.charCodeAt(0)
     *      R.nthCharCode(-2, 'Ramda'); //=> 'd'.charCodeAt(0)
     */
    var nthCharCode = _curry2(function nthCharCode(n, str) {
        return str.charCodeAt(n < 0 ? str.length + n : n);
    });

    /**
     * Returns a singleton array containing the value provided.
     *
     * Note this `of` is different from the ES6 `of`; See
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/of
     *
     * @func
     * @memberOf R
     * @category Function
     * @sig a -> [a]
     * @param {*} x any value
     * @return {Array} An array wrapping `x`.
     * @example
     *
     *      R.of(null); //=> [null]
     *      R.of([42]); //=> [[42]]
     */
    var of = _curry1(function of(x) {
        return [x];
    });

    /**
     * Accepts a function `fn` and returns a function that guards invocation of `fn` such that
     * `fn` can only ever be called once, no matter how many times the returned function is
     * invoked.
     *
     * @func
     * @memberOf R
     * @category Function
     * @sig (a... -> b) -> (a... -> b)
     * @param {Function} fn The function to wrap in a call-only-once wrapper.
     * @return {Function} The wrapped function.
     * @example
     *
     *      var addOneOnce = R.once(function(x){ return x + 1; });
     *      addOneOnce(10); //=> 11
     *      addOneOnce(addOneOnce(50)); //=> 11
     */
    var once = _curry1(function once(fn) {
        var called = false, result;
        return function () {
            if (called) {
                return result;
            }
            called = true;
            result = fn.apply(this, arguments);
            return result;
        };
    });

    /**
     * Retrieve the value at a given path.
     *
     * @func
     * @memberOf R
     * @category Object
     * @sig [String] -> {*} -> *
     * @param {Array} path The path to use.
     * @return {*} The data at `path`.
     * @example
     *
     *      R.path(['a', 'b'], {a: {b: 2}}); //=> 2
     */
    var path = _curry2(_path);

    /**
     * Returns a partial copy of an object containing only the keys specified.  If the key does not exist, the
     * property is ignored.
     *
     * @func
     * @memberOf R
     * @category Object
     * @sig [k] -> {k: v} -> {k: v}
     * @param {Array} names an array of String property names to copy onto a new object
     * @param {Object} obj The object to copy from
     * @return {Object} A new object with only properties from `names` on it.
     * @example
     *
     *      R.pick(['a', 'd'], {a: 1, b: 2, c: 3, d: 4}); //=> {a: 1, d: 4}
     *      R.pick(['a', 'e', 'f'], {a: 1, b: 2, c: 3, d: 4}); //=> {a: 1}
     */
    var pick = _curry2(function pick(names, obj) {
        var result = {};
        var idx = 0;
        while (idx < names.length) {
            if (names[idx] in obj) {
                result[names[idx]] = obj[names[idx]];
            }
            idx += 1;
        }
        return result;
    });

    /**
     * Similar to `pick` except that this one includes a `key: undefined` pair for properties that don't exist.
     *
     * @func
     * @memberOf R
     * @category Object
     * @sig [k] -> {k: v} -> {k: v}
     * @param {Array} names an array of String property names to copy onto a new object
     * @param {Object} obj The object to copy from
     * @return {Object} A new object with only properties from `names` on it.
     * @see R.pick
     * @example
     *
     *      R.pickAll(['a', 'd'], {a: 1, b: 2, c: 3, d: 4}); //=> {a: 1, d: 4}
     *      R.pickAll(['a', 'e', 'f'], {a: 1, b: 2, c: 3, d: 4}); //=> {a: 1, e: undefined, f: undefined}
     */
    var pickAll = _curry2(function pickAll(names, obj) {
        var result = {};
        var idx = 0;
        while (idx < names.length) {
            var name = names[idx];
            result[name] = obj[name];
            idx += 1;
        }
        return result;
    });

    /**
     * Returns a partial copy of an object containing only the keys that
     * satisfy the supplied predicate.
     *
     * @func
     * @memberOf R
     * @category Object
     * @sig (v, k -> Boolean) -> {k: v} -> {k: v}
     * @param {Function} pred A predicate to determine whether or not a key
     *        should be included on the output object.
     * @param {Object} obj The object to copy from
     * @return {Object} A new object with only properties that satisfy `pred`
     *         on it.
     * @see R.pick
     * @example
     *
     *      var isUpperCase = function(val, key) { return key.toUpperCase() === key; }
     *      R.pickBy(isUpperCase, {a: 1, b: 2, A: 3, B: 4}); //=> {A: 3, B: 4}
     */
    var pickBy = _curry2(function pickBy(test, obj) {
        var result = {};
        for (var prop in obj) {
            if (test(obj[prop], prop, obj)) {
                result[prop] = obj[prop];
            }
        }
        return result;
    });

    /**
     * Returns a new list with the given element at the front, followed by the contents of the
     * list.
     *
     * @func
     * @memberOf R
     * @category List
     * @sig a -> [a] -> [a]
     * @param {*} el The item to add to the head of the output list.
     * @param {Array} list The array to add to the tail of the output list.
     * @return {Array} A new array.
     * @example
     *
     *      R.prepend('fee', ['fi', 'fo', 'fum']); //=> ['fee', 'fi', 'fo', 'fum']
     */
    var prepend = _curry2(_prepend);

    /**
     * Returns a function that when supplied an object returns the indicated property of that object, if it exists.
     *
     * @func
     * @memberOf R
     * @category Object
     * @sig s -> {s: a} -> a
     * @param {String} p The property name
     * @param {Object} obj The object to query
     * @return {*} The value at `obj.p`.
     * @example
     *
     *      R.prop('x', {x: 100}); //=> 100
     *      R.prop('x', {}); //=> undefined
     */
    var prop = _curry2(function prop(p, obj) {
        return obj[p];
    });

    /**
     * If the given, non-null object has an own property with the specified name,
     * returns the value of that property.
     * Otherwise returns the provided default value.
     *
     * @func
     * @memberOf R
     * @category Object
     * @sig a -> String -> Object -> a
     * @param {*} val The default value.
     * @param {String} p The name of the property to return.
     * @param {Object} obj The object to query.
     * @return {*} The value of given property of the supplied object or the default value.
     * @example
     *
     *      var alice = {
     *        name: 'ALICE',
     *        age: 101
     *      };
     *      var favorite = R.prop('favoriteLibrary');
     *      var favoriteWithDefault = R.propOr('Ramda', 'favoriteLibrary');
     *
     *      favorite(alice);  //=> undefined
     *      favoriteWithDefault(alice);  //=> 'Ramda'
     */
    var propOr = _curry3(function propOr(val, p, obj) {
        return obj != null && _has(p, obj) ? obj[p] : val;
    });

    /**
     * Acts as multiple `get`: array of keys in, array of values out. Preserves order.
     *
     * @func
     * @memberOf R
     * @category Object
     * @sig [k] -> {k: v} -> [v]
     * @param {Array} ps The property names to fetch
     * @param {Object} obj The object to query
     * @return {Array} The corresponding values or partially applied function.
     * @example
     *
     *      R.props(['x', 'y'], {x: 1, y: 2}); //=> [1, 2]
     *      R.props(['c', 'a', 'b'], {b: 2, a: 1}); //=> [undefined, 1, 2]
     *
     *      var fullName = R.compose(R.join(' '), R.props(['first', 'last']));
     *      fullName({last: 'Bullet-Tooth', age: 33, first: 'Tony'}); //=> 'Tony Bullet-Tooth'
     */
    var props = _curry2(function props(ps, obj) {
        var out = [];
        var idx = 0;
        while (idx < ps.length) {
            out[idx] = obj[ps[idx]];
            idx += 1;
        }
        return out;
    });

    /**
     * Returns a list of numbers from `from` (inclusive) to `to`
     * (exclusive).
     *
     * @func
     * @memberOf R
     * @category List
     * @sig Number -> Number -> [Number]
     * @param {Number} from The first number in the list.
     * @param {Number} to One more than the last number in the list.
     * @return {Array} The list of numbers in tthe set `[a, b)`.
     * @example
     *
     *      R.range(1, 5);    //=> [1, 2, 3, 4]
     *      R.range(50, 53);  //=> [50, 51, 52]
     */
    var range = _curry2(function range(from, to) {
        var result = [];
        var n = from;
        while (n < to) {
            result[result.length] = n;
            n += 1;
        }
        return result;
    });

    /**
     * Like `reduce`, but passes additional parameters to the predicate function.
     *
     * The iterator function receives four values: *(acc, value, index, list)*
     *
     * Note: `R.reduceIndexed` does not skip deleted or unassigned indices (sparse arrays),
     * unlike the native `Array.prototype.reduce` method. For more details on this behavior,
     * see:
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce#Description
     *
     * @func
     * @memberOf R
     * @category List
     * @sig (a,b,i,[b] -> a) -> a -> [b] -> a
     * @param {Function} fn The iterator function. Receives four values: the accumulator, the
     *        current element from `list`, that element's index, and the entire `list` itself.
     * @param {*} acc The accumulator value.
     * @param {Array} list The list to iterate over.
     * @return {*} The final, accumulated value.
     * @deprecated since v0.15.0
     * @see R.addIndex
     * @example
     *
     *      var letters = ['a', 'b', 'c'];
     *      var objectify = function(accObject, elem, idx, list) {
     *        accObject[elem] = idx;
     *        return accObject;
     *      };
     *
     *      R.reduceIndexed(objectify, {}, letters); //=> { 'a': 0, 'b': 1, 'c': 2 }
     */
    var reduceIndexed = _curry3(function reduceIndexed(fn, acc, list) {
        var idx = 0;
        while (idx < list.length) {
            acc = fn(acc, list[idx], idx, list);
            idx += 1;
        }
        return acc;
    });

    /**
     * Returns a single item by iterating through the list, successively calling the iterator
     * function and passing it an accumulator value and the current value from the array, and
     * then passing the result to the next call.
     *
     * Similar to `reduce`, except moves through the input list from the right to the left.
     *
     * The iterator function receives two values: *(acc, value)*
     *
     * Note: `R.reduceRight` does not skip deleted or unassigned indices (sparse arrays), unlike
     * the native `Array.prototype.reduce` method. For more details on this behavior, see:
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduceRight#Description
     *
     * @func
     * @memberOf R
     * @category List
     * @sig (a,b -> a) -> a -> [b] -> a
     * @param {Function} fn The iterator function. Receives two values, the accumulator and the
     *        current element from the array.
     * @param {*} acc The accumulator value.
     * @param {Array} list The list to iterate over.
     * @return {*} The final, accumulated value.
     * @example
     *
     *      var pairs = [ ['a', 1], ['b', 2], ['c', 3] ];
     *      var flattenPairs = function(acc, pair) {
     *        return acc.concat(pair);
     *      };
     *
     *      R.reduceRight(flattenPairs, [], pairs); //=> [ 'c', 3, 'b', 2, 'a', 1 ]
     */
    var reduceRight = _curry3(function reduceRight(fn, acc, list) {
        var idx = list.length - 1;
        while (idx >= 0) {
            acc = fn(acc, list[idx]);
            idx -= 1;
        }
        return acc;
    });

    /**
     * Like `reduceRight`, but passes additional parameters to the predicate function. Moves through
     * the input list from the right to the left.
     *
     * The iterator function receives four values: *(acc, value, index, list)*.
     *
     * Note: `R.reduceRightIndexed` does not skip deleted or unassigned indices (sparse arrays),
     * unlike the native `Array.prototype.reduce` method. For more details on this behavior,
     * see:
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduceRight#Description
     *
     * @func
     * @memberOf R
     * @category List
     * @sig (a,b,i,[b] -> a -> [b] -> a
     * @param {Function} fn The iterator function. Receives four values: the accumulator, the
     *        current element from `list`, that element's index, and the entire `list` itself.
     * @param {*} acc The accumulator value.
     * @param {Array} list The list to iterate over.
     * @return {*} The final, accumulated value.
     * @deprecated since v0.15.0
     * @see R.addIndex
     * @example
     *
     *      var letters = ['a', 'b', 'c'];
     *      var objectify = function(accObject, elem, idx, list) {
     *        accObject[elem] = idx;
     *        return accObject;
     *      };
     *
     *      R.reduceRightIndexed(objectify, {}, letters); //=> { 'c': 2, 'b': 1, 'a': 0 }
     */
    var reduceRightIndexed = _curry3(function reduceRightIndexed(fn, acc, list) {
        var idx = list.length - 1;
        while (idx >= 0) {
            acc = fn(acc, list[idx], idx, list);
            idx -= 1;
        }
        return acc;
    });

    /**
     * Returns a value wrapped to indicate that it is the final value of the
     * reduce and transduce functions.  The returned value
     * should be considered a black box: the internal structure is not
     * guaranteed to be stable.
     *
     * Note: this optimization is unavailable to functions not explicitly listed
     * above.  For instance, it is not currently supported by reduceIndexed,
     * reduceRight, or reduceRightIndexed.
     * @see R.reduce
     * @see R.transduce
     *
     * @func
     * @memberOf R
     * @category List
     * @sig a -> *
     * @param {*} x The final value of the reduce.
     * @return {*} The wrapped value.
     * @example
     *
     *      R.reduce(
     *        R.pipe(R.add, R.ifElse(R.lte(10), R.reduced, R.identity)),
     *        0,
     *        [1, 2, 3, 4, 5]) // 10
     */
    var reduced = _curry1(_reduced);

    /**
     * Like `reject`, but passes additional parameters to the predicate function. The predicate
     * function is passed three arguments: *(value, index, list)*.
     *
     * @func
     * @memberOf R
     * @category List
     * @sig (a, i, [a] -> Boolean) -> [a] -> [a]
     * @param {Function} fn The function called per iteration.
     * @param {Array} list The collection to iterate over.
     * @return {Array} The new filtered array.
     * @deprecated since v0.15.0
     * @see R.addIndex
     * @example
     *
     *      var lastTwo = function(val, idx, list) {
     *        return list.length - idx <= 2;
     *      };
     *
     *      R.rejectIndexed(lastTwo, [8, 6, 7, 5, 3, 0, 9]); //=> [8, 6, 7, 5, 3]
     */
    var rejectIndexed = _curry2(function rejectIndexed(fn, list) {
        return _filterIndexed(_complement(fn), list);
    });

    /**
     * Removes the sub-list of `list` starting at index `start` and containing
     * `count` elements.  _Note that this is not destructive_: it returns a
     * copy of the list with the changes.
     * <small>No lists have been harmed in the application of this function.</small>
     *
     * @func
     * @memberOf R
     * @category List
     * @sig Number -> Number -> [a] -> [a]
     * @param {Number} start The position to start removing elements
     * @param {Number} count The number of elements to remove
     * @param {Array} list The list to remove from
     * @return {Array} A new Array with `count` elements from `start` removed.
     * @example
     *
     *      R.remove(2, 3, [1,2,3,4,5,6,7,8]); //=> [1,2,6,7,8]
     */
    var remove = _curry3(function remove(start, count, list) {
        return _concat(_slice(list, 0, Math.min(start, list.length)), _slice(list, Math.min(list.length, start + count)));
    });

    /**
     * Replace a substring or regex match in a string with a replacement.
     *
     * @func
     * @memberOf R
     * @category String
     * @sig RegExp|String -> String -> String -> String
     * @param {RegExp|String} pattern A regular expression or a substring to match.
     * @param {String} replacement The string to replace the matches with.
     * @param {String} str The String to do the search and replacement in.
     * @return {String} The result.
     * @example
     *
     *      R.replace('foo', 'bar', 'foo foo foo'); //=> 'bar foo foo'
     *      R.replace(/foo/, 'bar', 'foo foo foo'); //=> 'bar foo foo'
     *
     *      // Use the "g" (global) flag to replace all occurrences:
     *      R.replace(/foo/g, 'bar', 'foo foo foo'); //=> 'bar bar bar'
     */
    var replace = _curry3(function replace(regex, replacement, str) {
        return str.replace(regex, replacement);
    });

    /**
     * Returns a new list with the same elements as the original list, just
     * in the reverse order.
     *
     * @func
     * @memberOf R
     * @category List
     * @sig [a] -> [a]
     * @param {Array} list The list to reverse.
     * @return {Array} A copy of the list in reverse order.
     * @example
     *
     *      R.reverse([1, 2, 3]);  //=> [3, 2, 1]
     *      R.reverse([1, 2]);     //=> [2, 1]
     *      R.reverse([1]);        //=> [1]
     *      R.reverse([]);         //=> []
     */
    var reverse = _curry1(function reverse(list) {
        return _slice(list).reverse();
    });

    /**
     * Scan is similar to reduce, but returns a list of successively reduced values from the left
     *
     * @func
     * @memberOf R
     * @category List
     * @sig (a,b -> a) -> a -> [b] -> [a]
     * @param {Function} fn The iterator function. Receives two values, the accumulator and the
     *        current element from the array
     * @param {*} acc The accumulator value.
     * @param {Array} list The list to iterate over.
     * @return {Array} A list of all intermediately reduced values.
     * @example
     *
     *      var numbers = [1, 2, 3, 4];
     *      var factorials = R.scan(R.multiply, 1, numbers); //=> [1, 1, 2, 6, 24]
     */
    var scan = _curry3(function scan(fn, acc, list) {
        var idx = 0, result = [acc];
        while (idx < list.length) {
            acc = fn(acc, list[idx]);
            result[idx + 1] = acc;
            idx += 1;
        }
        return result;
    });

    /**
     * Returns a copy of the list, sorted according to the comparator function, which should accept two values at a
     * time and return a negative number if the first value is smaller, a positive number if it's larger, and zero
     * if they are equal.  Please note that this is a **copy** of the list.  It does not modify the original.
     *
     * @func
     * @memberOf R
     * @category List
     * @sig (a,a -> Number) -> [a] -> [a]
     * @param {Function} comparator A sorting function :: a -> b -> Int
     * @param {Array} list The list to sort
     * @return {Array} a new array with its elements sorted by the comparator function.
     * @example
     *
     *      var diff = function(a, b) { return a - b; };
     *      R.sort(diff, [4,2,7,5]); //=> [2, 4, 5, 7]
     */
    var sort = _curry2(function sort(comparator, list) {
        return _slice(list).sort(comparator);
    });

    /**
     * Sorts the list according to a key generated by the supplied function.
     *
     * @func
     * @memberOf R
     * @category Relation
     * @sig (a -> String) -> [a] -> [a]
     * @param {Function} fn The function mapping `list` items to keys.
     * @param {Array} list The list to sort.
     * @return {Array} A new list sorted by the keys generated by `fn`.
     * @example
     *
     *      var sortByFirstItem = R.sortBy(prop(0));
     *      var sortByNameCaseInsensitive = R.sortBy(compose(R.toLower, prop('name')));
     *      var pairs = [[-1, 1], [-2, 2], [-3, 3]];
     *      sortByFirstItem(pairs); //=> [[-3, 3], [-2, 2], [-1, 1]]
     *      var alice = {
     *        name: 'ALICE',
     *        age: 101
     *      };
     *      var bob = {
     *        name: 'Bob',
     *        age: -10
     *      };
     *      var clara = {
     *        name: 'clara',
     *        age: 314.159
     *      };
     *      var people = [clara, bob, alice];
     *      sortByNameCaseInsensitive(people); //=> [alice, bob, clara]
     */
    var sortBy = _curry2(function sortBy(fn, list) {
        return _slice(list).sort(function (a, b) {
            var aa = fn(a);
            var bb = fn(b);
            return aa < bb ? -1 : aa > bb ? 1 : 0;
        });
    });

    /**
     * Finds the first index of a substring in a string, returning -1 if it's not present
     *
     * @func
     * @memberOf R
     * @category String
     * @sig String -> String -> Number
     * @param {String} c A string to find.
     * @param {String} str The string to search in
     * @return {Number} The first index of `c` or -1 if not found.
     * @deprecated since v0.15.0
     * @example
     *
     *      R.strIndexOf('c', 'abcdefg'); //=> 2
     */
    var strIndexOf = _curry2(function strIndexOf(c, str) {
        return str.indexOf(c);
    });

    /**
     *
     * Finds the last index of a substring in a string, returning -1 if it's not present
     *
     * @func
     * @memberOf R
     * @category String
     * @sig String -> String -> Number
     * @param {String} c A string to find.
     * @param {String} str The string to search in
     * @return {Number} The last index of `c` or -1 if not found.
     * @deprecated since v0.15.0
     * @example
     *
     *      R.strLastIndexOf('a', 'banana split'); //=> 5
     */
    var strLastIndexOf = _curry2(function (c, str) {
        return str.lastIndexOf(c);
    });

    /**
     * Subtracts two numbers. Equivalent to `a - b` but curried.
     *
     * @func
     * @memberOf R
     * @category Math
     * @sig Number -> Number -> Number
     * @param {Number} a The first value.
     * @param {Number} b The second value.
     * @return {Number} The result of `a - b`.
     * @example
     *
     *      R.subtract(10, 8); //=> 2
     *
     *      var minus5 = R.subtract(R.__, 5);
     *      minus5(17); //=> 12
     *
     *      var complementaryAngle = R.subtract(90);
     *      complementaryAngle(30); //=> 60
     *      complementaryAngle(72); //=> 18
     */
    var subtract = _curry2(function subtract(a, b) {
        return a - b;
    });

    /**
     * Runs the given function with the supplied object, then returns the object.
     *
     * @func
     * @memberOf R
     * @category Function
     * @sig (a -> *) -> a -> a
     * @param {Function} fn The function to call with `x`. The return value of `fn` will be thrown away.
     * @param {*} x
     * @return {*} `x`.
     * @example
     *
     *      var sayX = function(x) { console.log('x is ' + x); };
     *      R.tap(sayX, 100); //=> 100
     *      //-> 'x is 100'
     */
    var tap = _curry2(function tap(fn, x) {
        fn(x);
        return x;
    });

    /**
     * Determines whether a given string matches a given regular expression.
     *
     * @func
     * @memberOf R
     * @category String
     * @sig RegExp -> String -> Boolean
     * @param {RegExp} pattern
     * @param {String} str
     * @return {Boolean}
     * @example
     *
     *      R.test(/^x/, 'xyz'); //=> true
     *      R.test(/^y/, 'xyz'); //=> false
     */
    var test = _curry2(function test(pattern, str) {
        return _cloneRegExp(pattern).test(str);
    });

    /**
     * Calls an input function `n` times, returning an array containing the results of those
     * function calls.
     *
     * `fn` is passed one argument: The current value of `n`, which begins at `0` and is
     * gradually incremented to `n - 1`.
     *
     * @func
     * @memberOf R
     * @category List
     * @sig (i -> a) -> i -> [a]
     * @param {Function} fn The function to invoke. Passed one argument, the current value of `n`.
     * @param {Number} n A value between `0` and `n - 1`. Increments after each function call.
     * @return {Array} An array containing the return values of all calls to `fn`.
     * @example
     *
     *      R.times(R.identity, 5); //=> [0, 1, 2, 3, 4]
     */
    var times = _curry2(function times(fn, n) {
        var len = Number(n);
        var list = new Array(len);
        var idx = 0;
        while (idx < len) {
            list[idx] = fn(idx);
            idx += 1;
        }
        return list;
    });

    /**
     * Converts an object into an array of key, value arrays.
     * Only the object's own properties are used.
     * Note that the order of the output array is not guaranteed to be
     * consistent across different JS platforms.
     *
     * @func
     * @memberOf R
     * @category Object
     * @sig {String: *} -> [[String,*]]
     * @param {Object} obj The object to extract from
     * @return {Array} An array of key, value arrays from the object's own properties.
     * @example
     *
     *      R.toPairs({a: 1, b: 2, c: 3}); //=> [['a', 1], ['b', 2], ['c', 3]]
     */
    var toPairs = _curry1(function toPairs(obj) {
        var pairs = [];
        for (var prop in obj) {
            if (_has(prop, obj)) {
                pairs[pairs.length] = [
                    prop,
                    obj[prop]
                ];
            }
        }
        return pairs;
    });

    /**
     * Converts an object into an array of key, value arrays.
     * The object's own properties and prototype properties are used.
     * Note that the order of the output array is not guaranteed to be
     * consistent across different JS platforms.
     *
     * @func
     * @memberOf R
     * @category Object
     * @sig {String: *} -> [[String,*]]
     * @param {Object} obj The object to extract from
     * @return {Array} An array of key, value arrays from the object's own
     *         and prototype properties.
     * @example
     *
     *      var F = function() { this.x = 'X'; };
     *      F.prototype.y = 'Y';
     *      var f = new F();
     *      R.toPairsIn(f); //=> [['x','X'], ['y','Y']]
     */
    var toPairsIn = _curry1(function toPairsIn(obj) {
        var pairs = [];
        for (var prop in obj) {
            pairs[pairs.length] = [
                prop,
                obj[prop]
            ];
        }
        return pairs;
    });

    /**
     * Removes (strips) whitespace from both ends of the string.
     *
     * @func
     * @memberOf R
     * @category String
     * @sig String -> String
     * @param {String} str The string to trim.
     * @return {String} Trimmed version of `str`.
     * @example
     *
     *      R.trim('   xyz  '); //=> 'xyz'
     *      R.map(R.trim, R.split(',', 'x, y, z')); //=> ['x', 'y', 'z']
     */
    var trim = function () {
        var ws = '\t\n\x0B\f\r \xA0\u1680\u180E\u2000\u2001\u2002\u2003' + '\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028' + '\u2029\uFEFF';
        var zeroWidth = '\u200B';
        var hasProtoTrim = typeof String.prototype.trim === 'function';
        if (!hasProtoTrim || (ws.trim() || !zeroWidth.trim())) {
            return _curry1(function trim(str) {
                var beginRx = new RegExp('^[' + ws + '][' + ws + ']*');
                var endRx = new RegExp('[' + ws + '][' + ws + ']*$');
                return str.replace(beginRx, '').replace(endRx, '');
            });
        } else {
            return _curry1(function trim(str) {
                return str.trim();
            });
        }
    }();

    /**
     * Gives a single-word string description of the (native) type of a value, returning such
     * answers as 'Object', 'Number', 'Array', or 'Null'.  Does not attempt to distinguish user
     * Object types any further, reporting them all as 'Object'.
     *
     * @func
     * @memberOf R
     * @category Type
     * @sig (* -> {*}) -> String
     * @param {*} val The value to test
     * @return {String}
     * @example
     *
     *      R.type({}); //=> "Object"
     *      R.type(1); //=> "Number"
     *      R.type(false); //=> "Boolean"
     *      R.type('s'); //=> "String"
     *      R.type(null); //=> "Null"
     *      R.type([]); //=> "Array"
     *      R.type(/[A-z]/); //=> "RegExp"
     */
    var type = _curry1(function type(val) {
        return val === null ? 'Null' : val === undefined ? 'Undefined' : Object.prototype.toString.call(val).slice(8, -1);
    });

    /**
     * Takes a function `fn`, which takes a single array argument, and returns
     * a function which:
     *
     *   - takes any number of positional arguments;
     *   - passes these arguments to `fn` as an array; and
     *   - returns the result.
     *
     * In other words, R.unapply derives a variadic function from a function
     * which takes an array. R.unapply is the inverse of R.apply.
     *
     * @func
     * @memberOf R
     * @category Function
     * @sig ([*...] -> a) -> (*... -> a)
     * @param {Function} fn
     * @return {Function}
     * @see R.apply
     * @example
     *
     *      R.unapply(JSON.stringify)(1, 2, 3); //=> '[1,2,3]'
     */
    var unapply = _curry1(function unapply(fn) {
        return function () {
            return fn(_slice(arguments));
        };
    });

    /**
     * Wraps a function of any arity (including nullary) in a function that accepts exactly 1
     * parameter. Any extraneous parameters will not be passed to the supplied function.
     *
     * @func
     * @memberOf R
     * @category Function
     * @sig (* -> b) -> (a -> b)
     * @param {Function} fn The function to wrap.
     * @return {Function} A new function wrapping `fn`. The new function is guaranteed to be of
     *         arity 1.
     * @example
     *
     *      var takesTwoArgs = function(a, b) {
     *        return [a, b];
     *      };
     *      takesTwoArgs.length; //=> 2
     *      takesTwoArgs(1, 2); //=> [1, 2]
     *
     *      var takesOneArg = R.unary(takesTwoArgs);
     *      takesOneArg.length; //=> 1
     *      // Only 1 argument is passed to the wrapped function
     *      takesOneArg(1, 2); //=> [1, undefined]
     */
    var unary = _curry1(function unary(fn) {
        return nAry(1, fn);
    });

    /**
     * Builds a list from a seed value. Accepts an iterator function, which returns either false
     * to stop iteration or an array of length 2 containing the value to add to the resulting
     * list and the seed to be used in the next call to the iterator function.
     *
     * The iterator function receives one argument: *(seed)*.
     *
     * @func
     * @memberOf R
     * @category List
     * @sig (a -> [b]) -> * -> [b]
     * @param {Function} fn The iterator function. receives one argument, `seed`, and returns
     *        either false to quit iteration or an array of length two to proceed. The element
     *        at index 0 of this array will be added to the resulting array, and the element
     *        at index 1 will be passed to the next call to `fn`.
     * @param {*} seed The seed value.
     * @return {Array} The final list.
     * @example
     *
     *      var f = function(n) { return n > 50 ? false : [-n, n + 10] };
     *      R.unfold(f, 10); //=> [-10, -20, -30, -40, -50]
     */
    var unfold = _curry2(function unfold(fn, seed) {
        var pair = fn(seed);
        var result = [];
        while (pair && pair.length) {
            result[result.length] = pair[0];
            pair = fn(pair[1]);
        }
        return result;
    });

    /**
     * Returns a new list containing only one copy of each element in the original list, based
     * upon the value returned by applying the supplied predicate to two list elements. Prefers
     * the first item if two items compare equal based on the predicate.
     *
     * @func
     * @memberOf R
     * @category List
     * @sig (a, a -> Boolean) -> [a] -> [a]
     * @param {Function} pred A predicate used to test whether two items are equal.
     * @param {Array} list The array to consider.
     * @return {Array} The list of unique items.
     * @example
     *
     *      var strEq = function(a, b) { return String(a) === String(b); };
     *      R.uniqWith(strEq)([1, '1', 2, 1]); //=> [1, 2]
     *      R.uniqWith(strEq)([{}, {}]);       //=> [{}]
     *      R.uniqWith(strEq)([1, '1', 1]);    //=> [1]
     *      R.uniqWith(strEq)(['1', 1, 1]);    //=> ['1']
     */
    var uniqWith = _curry2(function uniqWith(pred, list) {
        var idx = 0;
        var result = [], item;
        while (idx < list.length) {
            item = list[idx];
            if (!_containsWith(pred, item, result)) {
                result[result.length] = item;
            }
            idx += 1;
        }
        return result;
    });

    /**
     * Returns a new copy of the array with the element at the
     * provided index replaced with the given value.
     * @see R.adjust
     *
     * @func
     * @memberOf R
     * @category List
     * @sig Number -> a -> [a] -> [a]
     * @param {Number} idx The index to update.
     * @param {*} x The value to exist at the given index of the returned array.
     * @param {Array|Arguments} list The source array-like object to be updated.
     * @return {Array} A copy of `list` with the value at index `idx` replaced with `x`.
     * @example
     *
     *      R.update(1, 11, [0, 1, 2]);     //=> [0, 11, 2]
     *      R.update(1)(11)([0, 1, 2]);     //=> [0, 11, 2]
     */
    var update = _curry3(function (idx, x, list) {
        return adjust(always(x), idx, list);
    });

    /**
     * Returns a list of all the enumerable own properties of the supplied object.
     * Note that the order of the output array is not guaranteed across
     * different JS platforms.
     *
     * @func
     * @memberOf R
     * @category Object
     * @sig {k: v} -> [v]
     * @param {Object} obj The object to extract values from
     * @return {Array} An array of the values of the object's own properties.
     * @example
     *
     *      R.values({a: 1, b: 2, c: 3}); //=> [1, 2, 3]
     */
    var values = _curry1(function values(obj) {
        var props = keys(obj);
        var vals = [];
        var idx = 0;
        while (idx < props.length) {
            vals[idx] = obj[props[idx]];
            idx += 1;
        }
        return vals;
    });

    /**
     * Returns a list of all the properties, including prototype properties,
     * of the supplied object.
     * Note that the order of the output array is not guaranteed to be
     * consistent across different JS platforms.
     *
     * @func
     * @memberOf R
     * @category Object
     * @sig {k: v} -> [v]
     * @param {Object} obj The object to extract values from
     * @return {Array} An array of the values of the object's own and prototype properties.
     * @example
     *
     *      var F = function() { this.x = 'X'; };
     *      F.prototype.y = 'Y';
     *      var f = new F();
     *      R.valuesIn(f); //=> ['X', 'Y']
     */
    var valuesIn = _curry1(function valuesIn(obj) {
        var prop, vs = [];
        for (prop in obj) {
            vs[vs.length] = obj[prop];
        }
        return vs;
    });

    /**
     * Takes a spec object and a test object; returns true if the test satisfies
     * the spec. Each of the spec's own properties must be a predicate function.
     * Each predicate is applied to the value of the corresponding property of
     * the test object. `where` returns true if all the predicates return true,
     * false otherwise.
     *
     * `where` is well suited to declaratively expressing constraints for other
     * functions such as `filter` and `find`.
     *
     * @func
     * @memberOf R
     * @category Object
     * @sig {String: (* -> Boolean)} -> {String: *} -> Boolean
     * @param {Object} spec
     * @param {Object} testObj
     * @return {Boolean}
     * @example
     *
     *      // pred :: Object -> Boolean
     *      var pred = R.where({
     *        a: R.equals('foo'),
     *        b: R.complement(R.equals('bar')),
     *        x: R.gt(_, 10),
     *        y: R.lt(_, 20)
     *      });
     *
     *      pred({a: 'foo', b: 'xxx', x: 11, y: 19}); //=> true
     *      pred({a: 'xxx', b: 'xxx', x: 11, y: 19}); //=> false
     *      pred({a: 'foo', b: 'bar', x: 11, y: 19}); //=> false
     *      pred({a: 'foo', b: 'xxx', x: 10, y: 19}); //=> false
     *      pred({a: 'foo', b: 'xxx', x: 11, y: 20}); //=> false
     */
    var where = _curry2(function where(spec, testObj) {
        for (var prop in spec) {
            if (_has(prop, spec) && !spec[prop](testObj[prop])) {
                return false;
            }
        }
        return true;
    });

    /**
     * Creates a new list out of the two supplied by creating each possible
     * pair from the lists.
     *
     * @func
     * @memberOf R
     * @category List
     * @sig [a] -> [b] -> [[a,b]]
     * @param {Array} as The first list.
     * @param {Array} bs The second list.
     * @return {Array} The list made by combining each possible pair from
     *         `as` and `bs` into pairs (`[a, b]`).
     * @example
     *
     *      R.xprod([1, 2], ['a', 'b']); //=> [[1, 'a'], [1, 'b'], [2, 'a'], [2, 'b']]
     */
    // = xprodWith(prepend); (takes about 3 times as long...)
    var xprod = _curry2(function xprod(a, b) {
        // = xprodWith(prepend); (takes about 3 times as long...)
        var idx = 0;
        var j;
        var result = [];
        while (idx < a.length) {
            j = 0;
            while (j < b.length) {
                result[result.length] = [
                    a[idx],
                    b[j]
                ];
                j += 1;
            }
            idx += 1;
        }
        return result;
    });

    /**
     * Creates a new list out of the two supplied by pairing up
     * equally-positioned items from both lists.  The returned list is
     * truncated to the length of the shorter of the two input lists.
     * Note: `zip` is equivalent to `zipWith(function(a, b) { return [a, b] })`.
     *
     * @func
     * @memberOf R
     * @category List
     * @sig [a] -> [b] -> [[a,b]]
     * @param {Array} list1 The first array to consider.
     * @param {Array} list2 The second array to consider.
     * @return {Array} The list made by pairing up same-indexed elements of `list1` and `list2`.
     * @example
     *
     *      R.zip([1, 2, 3], ['a', 'b', 'c']); //=> [[1, 'a'], [2, 'b'], [3, 'c']]
     */
    var zip = _curry2(function zip(a, b) {
        var rv = [];
        var idx = 0;
        var len = Math.min(a.length, b.length);
        while (idx < len) {
            rv[idx] = [
                a[idx],
                b[idx]
            ];
            idx += 1;
        }
        return rv;
    });

    /**
     * Creates a new object out of a list of keys and a list of values.
     *
     * @func
     * @memberOf R
     * @category List
     * @sig [String] -> [*] -> {String: *}
     * @param {Array} keys The array that will be properties on the output object.
     * @param {Array} values The list of values on the output object.
     * @return {Object} The object made by pairing up same-indexed elements of `keys` and `values`.
     * @example
     *
     *      R.zipObj(['a', 'b', 'c'], [1, 2, 3]); //=> {a: 1, b: 2, c: 3}
     */
    var zipObj = _curry2(function zipObj(keys, values) {
        var idx = 0, out = {};
        while (idx < keys.length) {
            out[keys[idx]] = values[idx];
            idx += 1;
        }
        return out;
    });

    /**
     * Creates a new list out of the two supplied by applying the function to
     * each equally-positioned pair in the lists. The returned list is
     * truncated to the length of the shorter of the two input lists.
     *
     * @function
     * @memberOf R
     * @category List
     * @sig (a,b -> c) -> [a] -> [b] -> [c]
     * @param {Function} fn The function used to combine the two elements into one value.
     * @param {Array} list1 The first array to consider.
     * @param {Array} list2 The second array to consider.
     * @return {Array} The list made by combining same-indexed elements of `list1` and `list2`
     *         using `fn`.
     * @example
     *
     *      var f = function(x, y) {
     *        // ...
     *      };
     *      R.zipWith(f, [1, 2, 3], ['a', 'b', 'c']);
     *      //=> [f(1, 'a'), f(2, 'b'), f(3, 'c')]
     */
    var zipWith = _curry3(function zipWith(fn, a, b) {
        var rv = [], idx = 0, len = Math.min(a.length, b.length);
        while (idx < len) {
            rv[idx] = fn(a[idx], b[idx]);
            idx += 1;
        }
        return rv;
    });

    /**
     * A function that always returns `false`. Any passed in parameters are ignored.
     *
     * @func
     * @memberOf R
     * @category Function
     * @sig * -> false
     * @see R.always
     * @return {Boolean} false
     * @example
     *
     *      R.F(); //=> false
     */
    var F = always(false);

    /**
     * A function that always returns `true`. Any passed in parameters are ignored.
     *
     * @func
     * @memberOf R
     * @category Function
     * @sig * -> true
     * @see R.always
     * @return {Boolean} `true`.
     * @example
     *
     *      R.T(); //=> true
     */
    var T = always(true);

    var _append = function _append(el, list) {
        return _concat(list, [el]);
    };

    var _assocPath = function _assocPath(path, val, obj) {
        switch (path.length) {
        case 0:
            return obj;
        case 1:
            return _assoc(path[0], val, obj);
        default:
            return _assoc(path[0], _assocPath(_slice(path, 1), val, Object(obj[path[0]])), obj);
        }
    };

    /**
     * Copies an object.
     *
     * @private
     * @param {*} value The value to be copied
     * @param {Array} refFrom Array containing the source references
     * @param {Array} refTo Array containing the copied source references
     * @return {*} The copied value.
     */
    var _baseCopy = function _baseCopy(value, refFrom, refTo) {
        var copy = function copy(copiedValue) {
            var idx = 0;
            while (idx < refFrom.length) {
                if (value === refFrom[idx]) {
                    return refTo[idx];
                }
                idx += 1;
            }
            refFrom[idx + 1] = value;
            refTo[idx + 1] = copiedValue;
            for (var key in value) {
                copiedValue[key] = _baseCopy(value[key], refFrom, refTo);
            }
            return copiedValue;
        };
        switch (type(value)) {
        case 'Object':
            return copy({});
        case 'Array':
            return copy([]);
        case 'Date':
            return new Date(value);
        case 'RegExp':
            return _cloneRegExp(value);
        default:
            return value;
        }
    };

    /**
     * Similar to hasMethod, this checks whether a function has a [methodname]
     * function. If it isn't an array it will execute that function otherwise it will
     * default to the ramda implementation.
     *
     * @private
     * @param {Function} fn ramda implemtation
     * @param {String} methodname property to check for a custom implementation
     * @return {Object} Whatever the return value of the method is.
     */
    var _checkForMethod = function _checkForMethod(methodname, fn) {
        return function () {
            if (arguments.length === 0) {
                return fn();
            }
            var obj = arguments[arguments.length - 1];
            return _isArray(obj) || typeof obj[methodname] !== 'function' ? fn.apply(this, arguments) : obj[methodname].apply(obj, _slice(arguments, 0, arguments.length - 1));
        };
    };

    var _composeL = function _composeL(innerLens, outerLens) {
        return lens(_compose(innerLens, outerLens), function (x, source) {
            var newInnerValue = innerLens.set(x, outerLens(source));
            return outerLens.set(newInnerValue, source);
        });
    };

    /**
     * A right-associative two-argument composition function like `_compose`
     * but with automatic handling of promises (or, more precisely,
     * "thenables"). This function is used to construct a more general
     * `composeP` function, which accepts any number of arguments.
     *
     * @private
     * @category Function
     * @param {Function} f A function.
     * @param {Function} g A function.
     * @return {Function} A new function that is the equivalent of `f(g(x))`.
     * @example
     *
     *      var Q = require('q');
     *      var double = function(x) { return x * 2; };
     *      var squareAsync = function(x) { return Q.when(x * x); };
     *      var squareAsyncThenDouble = _composeP(double, squareAsync);
     *
     *      squareAsyncThenDouble(5)
     *        .then(function(result) {
     *          // the result is now 50.
     *        });
     */
    var _composeP = function _composeP(f, g) {
        return function () {
            var context = this;
            var value = g.apply(this, arguments);
            if (_isThenable(value)) {
                return value.then(function (result) {
                    return f.call(context, result);
                });
            } else {
                return f.call(this, value);
            }
        };
    };

    /*
     * Returns a function that makes a multi-argument version of compose from
     * either _compose or _composeP.
     */
    var _createComposer = function _createComposer(composeFunction) {
        return function () {
            var fn = arguments[arguments.length - 1];
            var length = fn.length;
            var idx = arguments.length - 2;
            while (idx >= 0) {
                fn = composeFunction(arguments[idx], fn);
                idx -= 1;
            }
            return arity(length, fn);
        };
    };

    /**
     * Create a function which takes a list
     * and determines the winning value by a comparator. Used internally
     * by `R.max` and `R.min`
     *
     * @private
     * @param {Function} compatator a function to compare two items
     * @param {*} intialVal, default value if nothing else wins
     * @category Math
     * @return {Function}
     */
    var _createMaxMin = function _createMaxMin(comparator, initialVal) {
        return _curry1(function (list) {
            var idx = 0, winner = initialVal, computed;
            while (idx < list.length) {
                computed = +list[idx];
                if (comparator(computed, winner)) {
                    winner = computed;
                }
                idx += 1;
            }
            return winner;
        });
    };

    var _createPartialApplicator = function _createPartialApplicator(concat) {
        return function (fn) {
            var args = _slice(arguments, 1);
            return arity(Math.max(0, fn.length - args.length), function () {
                return fn.apply(this, concat(args, arguments));
            });
        };
    };

    /**
     * Internal curryN function.
     *
     * @private
     * @category Function
     * @param {Number} length The arity of the curried function.
     * @return {array} An array of arguments received thus far.
     * @param {Function} fn The function to curry.
     */
    var _curryN = function _curryN(length, received, fn) {
        return function () {
            var combined = [];
            var argsIdx = 0;
            var left = length;
            var combinedIdx = 0;
            while (combinedIdx < received.length || argsIdx < arguments.length) {
                var result;
                if (combinedIdx < received.length && (received[combinedIdx] == null || received[combinedIdx]['@@functional/placeholder'] !== true || argsIdx >= arguments.length)) {
                    result = received[combinedIdx];
                } else {
                    result = arguments[argsIdx];
                    argsIdx += 1;
                }
                combined[combinedIdx] = result;
                if (result == null || result['@@functional/placeholder'] !== true) {
                    left -= 1;
                }
                combinedIdx += 1;
            }
            return left <= 0 ? fn.apply(this, combined) : arity(left, _curryN(length, combined, fn));
        };
    };

    /**
     * Returns a function that dispatches with different strategies based on the
     * object in list position (last argument). If it is an array, executes [fn].
     * Otherwise, if it has a  function with [methodname], it will execute that
     * function (functor case). Otherwise, if it is a transformer, uses transducer
     * [xf] to return a new transformer (transducer case). Otherwise, it will
     * default to executing [fn].
     *
     * @private
     * @param {String} methodname property to check for a custom implementation
     * @param {Function} xf transducer to initialize if object is transformer
     * @param {Function} fn default ramda implementation
     * @return {Function} A function that dispatches on object in list position
     */
    var _dispatchable = function _dispatchable(methodname, xf, fn) {
        return function () {
            if (arguments.length === 0) {
                return fn();
            }
            var obj = arguments[arguments.length - 1];
            if (!_isArray(obj)) {
                var args = _slice(arguments, 0, arguments.length - 1);
                if (typeof obj[methodname] === 'function') {
                    return obj[methodname].apply(obj, args);
                }
                if (_isTransformer(obj)) {
                    var transducer = xf.apply(null, args);
                    return transducer(obj);
                }
            }
            return fn.apply(this, arguments);
        };
    };

    var _dissocPath = function _dissocPath(path, obj) {
        switch (path.length) {
        case 0:
            return obj;
        case 1:
            return _dissoc(path[0], obj);
        default:
            var head = path[0];
            var tail = _slice(path, 1);
            return obj[head] == null ? obj : _assoc(head, _dissocPath(tail, obj[head]), obj);
        }
    };

    // The algorithm used to handle cyclic structures is
    // inspired by underscore's isEqual
    // RegExp equality algorithm: http://stackoverflow.com/a/10776635
    var _equals = function _eqDeep(a, b, stackA, stackB) {
        var typeA = type(a);
        if (typeA !== type(b)) {
            return false;
        }
        if (typeA === 'Boolean' || typeA === 'Number' || typeA === 'String') {
            return typeof a === 'object' ? typeof b === 'object' && identical(a.valueOf(), b.valueOf()) : identical(a, b);
        }
        if (identical(a, b)) {
            return true;
        }
        if (typeA === 'RegExp') {
            // RegExp equality algorithm: http://stackoverflow.com/a/10776635
            return a.source === b.source && a.global === b.global && a.ignoreCase === b.ignoreCase && a.multiline === b.multiline && a.sticky === b.sticky && a.unicode === b.unicode;
        }
        if (Object(a) === a) {
            if (typeA === 'Date' && a.getTime() !== b.getTime()) {
                return false;
            }
            var keysA = keys(a);
            if (keysA.length !== keys(b).length) {
                return false;
            }
            var idx = stackA.length - 1;
            while (idx >= 0) {
                if (stackA[idx] === a) {
                    return stackB[idx] === b;
                }
                idx -= 1;
            }
            stackA[stackA.length] = a;
            stackB[stackB.length] = b;
            idx = keysA.length - 1;
            while (idx >= 0) {
                var key = keysA[idx];
                if (!_has(key, b) || !_eqDeep(b[key], a[key], stackA, stackB)) {
                    return false;
                }
                idx -= 1;
            }
            stackA.pop();
            stackB.pop();
            return true;
        }
        return false;
    };

    /**
     * Assigns own enumerable properties of the other object to the destination
     * object preferring items in other.
     *
     * @private
     * @memberOf R
     * @category Object
     * @param {Object} destination The destination object.
     * @param {Object} other The other object to merge with destination.
     * @return {Object} The destination object.
     * @example
     *
     *      _extend({ 'name': 'fred', 'age': 10 }, { 'age': 40 });
     *      //=> { 'name': 'fred', 'age': 40 }
     */
    var _extend = function _extend(destination, other) {
        var props = keys(other);
        var idx = 0;
        while (idx < props.length) {
            destination[props[idx]] = other[props[idx]];
            idx += 1;
        }
        return destination;
    };

    /**
     * Private function that determines whether or not a provided object has a given method.
     * Does not ignore methods stored on the object's prototype chain. Used for dynamically
     * dispatching Ramda methods to non-Array objects.
     *
     * @private
     * @param {String} methodName The name of the method to check for.
     * @param {Object} obj The object to test.
     * @return {Boolean} `true` has a given method, `false` otherwise.
     * @example
     *
     *      var person = { name: 'John' };
     *      person.shout = function() { alert(this.name); };
     *
     *      _hasMethod('shout', person); //=> true
     *      _hasMethod('foo', person); //=> false
     */
    var _hasMethod = function _hasMethod(methodName, obj) {
        return obj != null && !_isArray(obj) && typeof obj[methodName] === 'function';
    };

    /**
     * `_makeFlat` is a helper function that returns a one-level or fully recursive function
     * based on the flag passed in.
     *
     * @private
     */
    var _makeFlat = function _makeFlat(recursive) {
        return function flatt(list) {
            var value, result = [], idx = 0, j;
            while (idx < list.length) {
                if (isArrayLike(list[idx])) {
                    value = recursive ? flatt(list[idx]) : list[idx];
                    j = 0;
                    while (j < value.length) {
                        result[result.length] = value[j];
                        j += 1;
                    }
                } else {
                    result[result.length] = list[idx];
                }
                idx += 1;
            }
            return result;
        };
    };

    var _reduce = function () {
        function _arrayReduce(xf, acc, list) {
            var idx = 0;
            while (idx < list.length) {
                acc = xf['@@transducer/step'](acc, list[idx]);
                if (acc && acc['@@transducer/reduced']) {
                    acc = acc['@@transducer/value'];
                    break;
                }
                idx += 1;
            }
            return xf['@@transducer/result'](acc);
        }
        function _iterableReduce(xf, acc, iter) {
            var step = iter.next();
            while (!step.done) {
                acc = xf['@@transducer/step'](acc, step.value);
                if (acc && acc['@@transducer/reduced']) {
                    acc = acc['@@transducer/value'];
                    break;
                }
                step = iter.next();
            }
            return xf['@@transducer/result'](acc);
        }
        function _methodReduce(xf, acc, obj) {
            return xf['@@transducer/result'](obj.reduce(bind(xf['@@transducer/step'], xf), acc));
        }
        var symIterator = typeof Symbol !== 'undefined' ? Symbol.iterator : '@@iterator';
        return function _reduce(fn, acc, list) {
            if (typeof fn === 'function') {
                fn = _xwrap(fn);
            }
            if (isArrayLike(list)) {
                return _arrayReduce(fn, acc, list);
            }
            if (typeof list.reduce === 'function') {
                return _methodReduce(fn, acc, list);
            }
            if (list[symIterator] != null) {
                return _iterableReduce(fn, acc, list[symIterator]());
            }
            if (typeof list.next === 'function') {
                return _iterableReduce(fn, acc, list);
            }
            throw new TypeError('reduce: list must be array or iterable');
        };
    }();

    var _xall = function () {
        function XAll(f, xf) {
            this.xf = xf;
            this.f = f;
            this.all = true;
        }
        XAll.prototype['@@transducer/init'] = _xfBase.init;
        XAll.prototype['@@transducer/result'] = function (result) {
            if (this.all) {
                result = this.xf['@@transducer/step'](result, true);
            }
            return this.xf['@@transducer/result'](result);
        };
        XAll.prototype['@@transducer/step'] = function (result, input) {
            if (!this.f(input)) {
                this.all = false;
                result = _reduced(this.xf['@@transducer/step'](result, false));
            }
            return result;
        };
        return _curry2(function _xall(f, xf) {
            return new XAll(f, xf);
        });
    }();

    var _xany = function () {
        function XAny(f, xf) {
            this.xf = xf;
            this.f = f;
            this.any = false;
        }
        XAny.prototype['@@transducer/init'] = _xfBase.init;
        XAny.prototype['@@transducer/result'] = function (result) {
            if (!this.any) {
                result = this.xf['@@transducer/step'](result, false);
            }
            return this.xf['@@transducer/result'](result);
        };
        XAny.prototype['@@transducer/step'] = function (result, input) {
            if (this.f(input)) {
                this.any = true;
                result = _reduced(this.xf['@@transducer/step'](result, true));
            }
            return result;
        };
        return _curry2(function _xany(f, xf) {
            return new XAny(f, xf);
        });
    }();

    var _xdrop = function () {
        function XDrop(n, xf) {
            this.xf = xf;
            this.n = n;
        }
        XDrop.prototype['@@transducer/init'] = _xfBase.init;
        XDrop.prototype['@@transducer/result'] = _xfBase.result;
        XDrop.prototype.step = function (result, input) {
            if (this.n > 0) {
                this.n -= 1;
                return result;
            }
            return this.xf['@@transducer/step'](result, input);
        };
        return _curry2(function _xdrop(n, xf) {
            return new XDrop(n, xf);
        });
    }();

    var _xdropWhile = function () {
        function XDropWhile(f, xf) {
            this.xf = xf;
            this.f = f;
        }
        XDropWhile.prototype['@@transducer/init'] = _xfBase.init;
        XDropWhile.prototype['@@transducer/result'] = _xfBase.result;
        XDropWhile.prototype['@@transducer/step'] = function (result, input) {
            if (this.f) {
                if (this.f(input)) {
                    return result;
                }
                this.f = null;
            }
            return this.xf['@@transducer/step'](result, input);
        };
        return _curry2(function _xdropWhile(f, xf) {
            return new XDropWhile(f, xf);
        });
    }();

    var _xgroupBy = function () {
        function XGroupBy(f, xf) {
            this.xf = xf;
            this.f = f;
            this.inputs = {};
        }
        XGroupBy.prototype['@@transducer/init'] = _xfBase.init;
        XGroupBy.prototype['@@transducer/result'] = function (result) {
            var key;
            for (key in this.inputs) {
                if (_has(key, this.inputs)) {
                    result = this.xf['@@transducer/step'](result, this.inputs[key]);
                    if (result['@@transducer/reduced']) {
                        result = result['@@transducer/value'];
                        break;
                    }
                }
            }
            return this.xf['@@transducer/result'](result);
        };
        XGroupBy.prototype['@@transducer/step'] = function (result, input) {
            var key = this.f(input);
            this.inputs[key] = this.inputs[key] || [
                key,
                []
            ];
            this.inputs[key][1] = _append(input, this.inputs[key][1]);
            return result;
        };
        return _curry2(function _xgroupBy(f, xf) {
            return new XGroupBy(f, xf);
        });
    }();

    /**
     * Returns `true` if all elements of the list match the predicate, `false` if there are any
     * that don't.
     *
     * Acts as a transducer if a transformer is given in list position.
     * @see R.transduce
     *
     * @func
     * @memberOf R
     * @category List
     * @sig (a -> Boolean) -> [a] -> Boolean
     * @param {Function} fn The predicate function.
     * @param {Array} list The array to consider.
     * @return {Boolean} `true` if the predicate is satisfied by every element, `false`
     *         otherwise.
     * @example
     *
     *      var lessThan2 = R.flip(R.lt)(2);
     *      var lessThan3 = R.flip(R.lt)(3);
     *      R.all(lessThan2)([1, 2]); //=> false
     *      R.all(lessThan3)([1, 2]); //=> true
     */
    var all = _curry2(_dispatchable('all', _xall, _all));

    /**
     * A function that returns the first argument if it's falsy otherwise the second
     * argument. Note that this is NOT short-circuited, meaning that if expressions
     * are passed they are both evaluated.
     *
     * Dispatches to the `and` method of the first argument if applicable.
     *
     * @func
     * @memberOf R
     * @category Logic
     * @sig * -> * -> *
     * @param {*} a any value
     * @param {*} b any other value
     * @return {*} the first argument if falsy otherwise the second argument.
     * @example
     *
     *      R.and(false, true); //=> false
     *      R.and(0, []); //=> 0
     *      R.and(null, ''); => null
     */
    var and = _curry2(function and(a, b) {
        return _hasMethod('and', a) ? a.and(b) : a && b;
    });

    /**
     * Returns `true` if at least one of elements of the list match the predicate, `false`
     * otherwise.
     *
     * Acts as a transducer if a transformer is given in list position.
     * @see R.transduce
     *
     * @func
     * @memberOf R
     * @category List
     * @sig (a -> Boolean) -> [a] -> Boolean
     * @param {Function} fn The predicate function.
     * @param {Array} list The array to consider.
     * @return {Boolean} `true` if the predicate is satisfied by at least one element, `false`
     *         otherwise.
     * @example
     *
     *      var lessThan0 = R.flip(R.lt)(0);
     *      var lessThan2 = R.flip(R.lt)(2);
     *      R.any(lessThan0)([1, 2]); //=> false
     *      R.any(lessThan2)([1, 2]); //=> true
     */
    var any = _curry2(_dispatchable('any', _xany, _any));

    /**
     * Returns a new list containing the contents of the given list, followed by the given
     * element.
     *
     * @func
     * @memberOf R
     * @category List
     * @sig a -> [a] -> [a]
     * @param {*} el The element to add to the end of the new list.
     * @param {Array} list The list whose contents will be added to the beginning of the output
     *        list.
     * @return {Array} A new list containing the contents of the old list followed by `el`.
     * @example
     *
     *      R.append('tests', ['write', 'more']); //=> ['write', 'more', 'tests']
     *      R.append('tests', []); //=> ['tests']
     *      R.append(['tests'], ['write', 'more']); //=> ['write', 'more', ['tests']]
     */
    var append = _curry2(_append);

    /**
     * Makes a shallow clone of an object, setting or overriding the nodes
     * required to create the given path, and placing the specific value at the
     * tail end of that path.  Note that this copies and flattens prototype
     * properties onto the new object as well.  All non-primitive properties
     * are copied by reference.
     *
     * @func
     * @memberOf R
     * @category Object
     * @sig [String] -> a -> {k: v} -> {k: v}
     * @param {Array} path the path to set
     * @param {*} val the new value
     * @param {Object} obj the object to clone
     * @return {Object} a new object similar to the original except along the specified path.
     * @example
     *
     *      R.assocPath(['a', 'b', 'c'], 42, {a: {b: {c: 0}}}); //=> {a: {b: {c: 42}}}
     */
    var assocPath = _curry3(_assocPath);

    /**
     * Wraps a function of any arity (including nullary) in a function that accepts exactly 2
     * parameters. Any extraneous parameters will not be passed to the supplied function.
     *
     * @func
     * @memberOf R
     * @category Function
     * @sig (* -> c) -> (a, b -> c)
     * @param {Function} fn The function to wrap.
     * @return {Function} A new function wrapping `fn`. The new function is guaranteed to be of
     *         arity 2.
     * @example
     *
     *      var takesThreeArgs = function(a, b, c) {
     *        return [a, b, c];
     *      };
     *      takesThreeArgs.length; //=> 3
     *      takesThreeArgs(1, 2, 3); //=> [1, 2, 3]
     *
     *      var takesTwoArgs = R.binary(takesThreeArgs);
     *      takesTwoArgs.length; //=> 2
     *      // Only 2 arguments are passed to the wrapped function
     *      takesTwoArgs(1, 2, 3); //=> [1, 2, undefined]
     */
    var binary = _curry1(function binary(fn) {
        return nAry(2, fn);
    });

    /**
     * Creates a deep copy of the value which may contain (nested) `Array`s and
     * `Object`s, `Number`s, `String`s, `Boolean`s and `Date`s. `Function`s are
     * not copied, but assigned by their reference.
     *
     * @func
     * @memberOf R
     * @category Object
     * @sig {*} -> {*}
     * @param {*} value The object or array to clone
     * @return {*} A new object or array.
     * @example
     *
     *      var objects = [{}, {}, {}];
     *      var objectsClone = R.clone(objects);
     *      objects[0] === objectsClone[0]; //=> false
     */
    var clone = _curry1(function clone(value) {
        return _baseCopy(value, [], []);
    });

    /**
     * Creates a new function that runs each of the functions supplied as parameters in turn,
     * passing the return value of each function invocation to the next function invocation,
     * beginning with whatever arguments were passed to the initial invocation.
     *
     * Note that `compose` is a right-associative function, which means the functions provided
     * will be invoked in order from right to left. In the example `var h = compose(f, g)`,
     * the function `h` is equivalent to `f( g(x) )`, where `x` represents the arguments
     * originally passed to `h`.
     *
     * @func
     * @memberOf R
     * @category Function
     * @sig ((y -> z), (x -> y), ..., (b -> c), (a... -> b)) -> (a... -> z)
     * @param {...Function} functions A variable number of functions.
     * @return {Function} A new function which represents the result of calling each of the
     *         input `functions`, passing the result of each function call to the next, from
     *         right to left.
     * @example
     *
     *      var triple = function(x) { return x * 3; };
     *      var double = function(x) { return x * 2; };
     *      var square = function(x) { return x * x; };
     *      var squareThenDoubleThenTriple = R.compose(triple, double, square);
     *
     *      //≅ triple(double(square(5)))
     *      squareThenDoubleThenTriple(5); //=> 150
     */
    var compose = _createComposer(_compose);

    /**
     * Creates a new lens that allows getting and setting values of nested properties, by
     * following each given lens in succession.
     *
     * Note that `composeL` is a right-associative function, which means the lenses provided
     * will be invoked in order from right to left.
     *
     * @func
     * @memberOf R
     * @category Function
     * @see R.lens
     * @sig ((y -> z), (x -> y), ..., (b -> c), (a -> b)) -> (a -> z)
     * @param {...Function} lenses A variable number of lenses.
     * @return {Function} A new lens which represents the result of calling each of the
     *         input `lenses`, passing the result of each getter/setter as the source
     *         to the next, from right to left.
     * @example
     *
     *      var headLens = R.lensIndex(0);
     *      var secondLens = R.lensIndex(1);
     *      var xLens = R.lensProp('x');
     *      var secondOfXOfHeadLens = R.composeL(secondLens, xLens, headLens);
     *
     *      var source = [{x: [0, 1], y: [2, 3]}, {x: [4, 5], y: [6, 7]}];
     *      secondOfXOfHeadLens(source); //=> 1
     *      secondOfXOfHeadLens.set(123, source); //=> [{x: [0, 123], y: [2, 3]}, {x: [4, 5], y: [6, 7]}]
     */
    var composeL = function () {
        var fn = arguments[arguments.length - 1];
        var idx = arguments.length - 2;
        while (idx >= 0) {
            fn = _composeL(arguments[idx], fn);
            idx -= 1;
        }
        return fn;
    };

    /**
     * Similar to `compose` but with automatic handling of promises (or, more
     * precisely, "thenables"). The behavior is identical  to that of
     * compose() if all composed functions return something other than
     * promises (i.e., objects with a .then() method). If one of the function
     * returns a promise, however, then the next function in the composition
     * is called asynchronously, in the success callback of the promise, using
     * the resolved value as an input. Note that `composeP` is a right-
     * associative function, just like `compose`.
     *
     * @func
     * @memberOf R
     * @category Function
     * @sig ((y -> z), (x -> y), ..., (b -> c), (a... -> b)) -> (a... -> z)
     * @param {...Function} functions A variable number of functions.
     * @return {Function} A new function which represents the result of calling each of the
     *         input `functions`, passing either the returned result or the asynchronously
     *         resolved value) of each function call to the next, from right to left.
     * @example
     *
     *      var Q = require('q');
     *      var triple = function(x) { return x * 3; };
     *      var double = function(x) { return x * 2; };
     *      var squareAsync = function(x) { return Q.when(x * x); };
     *      var squareAsyncThenDoubleThenTriple = R.composeP(triple, double, squareAsync);
     *
     *      //≅ squareAsync(5).then(function(x) { return triple(double(x)) };
     *      squareAsyncThenDoubleThenTriple(5)
     *        .then(function(result) {
     *          // result is 150
     *        });
     */
    var composeP = _createComposer(_composeP);

    /**
     * Returns a new list consisting of the elements of the first list followed by the elements
     * of the second.
     *
     * @func
     * @memberOf R
     * @category List
     * @sig [a] -> [a] -> [a]
     * @param {Array} list1 The first list to merge.
     * @param {Array} list2 The second set to merge.
     * @return {Array} A new array consisting of the contents of `list1` followed by the
     *         contents of `list2`. If, instead of an Array for `list1`, you pass an
     *         object with a `concat` method on it, `concat` will call `list1.concat`
     *         and pass it the value of `list2`.
     *
     * @example
     *
     *      R.concat([], []); //=> []
     *      R.concat([4, 5, 6], [1, 2, 3]); //=> [4, 5, 6, 1, 2, 3]
     *      R.concat('ABC', 'DEF'); // 'ABCDEF'
     */
    var concat = _curry2(function (set1, set2) {
        if (_isArray(set2)) {
            return _concat(set1, set2);
        } else if (_hasMethod('concat', set1)) {
            return set1.concat(set2);
        } else {
            throw new TypeError('can\'t concat ' + typeof set1);
        }
    });

    /**
     * Returns a curried equivalent of the provided function, with the
     * specified arity. The curried function has two unusual capabilities.
     * First, its arguments needn't be provided one at a time. If `g` is
     * `R.curryN(3, f)`, the following are equivalent:
     *
     *   - `g(1)(2)(3)`
     *   - `g(1)(2, 3)`
     *   - `g(1, 2)(3)`
     *   - `g(1, 2, 3)`
     *
     * Secondly, the special placeholder value `R.__` may be used to specify
     * "gaps", allowing partial application of any combination of arguments,
     * regardless of their positions. If `g` is as above and `_` is `R.__`,
     * the following are equivalent:
     *
     *   - `g(1, 2, 3)`
     *   - `g(_, 2, 3)(1)`
     *   - `g(_, _, 3)(1)(2)`
     *   - `g(_, _, 3)(1, 2)`
     *   - `g(_, 2)(1)(3)`
     *   - `g(_, 2)(1, 3)`
     *   - `g(_, 2)(_, 3)(1)`
     *
     * @func
     * @memberOf R
     * @category Function
     * @sig Number -> (* -> a) -> (* -> a)
     * @param {Number} length The arity for the returned function.
     * @param {Function} fn The function to curry.
     * @return {Function} A new, curried function.
     * @see R.curry
     * @example
     *
     *      var addFourNumbers = function() {
     *        return R.sum([].slice.call(arguments, 0, 4));
     *      };
     *
     *      var curriedAddFourNumbers = R.curryN(4, addFourNumbers);
     *      var f = curriedAddFourNumbers(1, 2);
     *      var g = f(3);
     *      g(4); //=> 10
     */
    var curryN = _curry2(function curryN(length, fn) {
        return arity(length, _curryN(length, [], fn));
    });

    /**
     * Makes a shallow clone of an object, omitting the property at the
     * given path. Note that this copies and flattens prototype properties
     * onto the new object as well.  All non-primitive properties are copied
     * by reference.
     *
     * @func
     * @memberOf R
     * @category Object
     * @sig [String] -> {k: v} -> {k: v}
     * @param {Array} path the path to set
     * @param {Object} obj the object to clone
     * @return {Object} a new object without the property at path
     * @example
     *
     *      R.dissocPath(['a', 'b', 'c'], {a: {b: {c: 42}}}); //=> {a: {b: {}}}
     */
    var dissocPath = _curry2(_dissocPath);

    /**
     * Returns a new list containing the last `n` elements of a given list, passing each value
     * to the supplied predicate function, skipping elements while the predicate function returns
     * `true`. The predicate function is passed one argument: *(value)*.
     *
     * Acts as a transducer if a transformer is given in list position.
     * @see R.transduce
     *
     * @func
     * @memberOf R
     * @category List
     * @sig (a -> Boolean) -> [a] -> [a]
     * @param {Function} fn The function called per iteration.
     * @param {Array} list The collection to iterate over.
     * @return {Array} A new array.
     * @example
     *
     *      var lteTwo = function(x) {
     *        return x <= 2;
     *      };
     *
     *      R.dropWhile(lteTwo, [1, 2, 3, 4, 3, 2, 1]); //=> [3, 4, 3, 2, 1]
     */
    var dropWhile = _curry2(_dispatchable('dropWhile', _xdropWhile, function dropWhile(pred, list) {
        var idx = 0;
        while (idx < list.length && pred(list[idx])) {
            idx += 1;
        }
        return _slice(list, idx);
    }));

    /**
     * `empty` returns an empty list for any argument, except when the argument satisfies the
     * Fantasy-land Monoid spec. In that case, this function will return the result of invoking
     * `empty` on that Monoid.
     *
     * @func
     * @memberOf R
     * @category Function
     * @sig * -> []
     * @return {Array} An empty array.
     * @example
     *
     *      R.empty([1,2,3,4,5]); //=> []
     */
    var empty = _curry1(function empty(x) {
        return _hasMethod('empty', x) ? x.empty() : [];
    });

    /**
     * Returns `true` if its arguments are equivalent, `false` otherwise.
     * Dispatches to an `equals` method if present. Handles cyclical data
     * structures.
     *
     * @func
     * @memberOf R
     * @category Relation
     * @sig a -> b -> Boolean
     * @param {*} a
     * @param {*} b
     * @return {Boolean}
     * @example
     *
     *      R.equals(1, 1); //=> true
     *      R.equals(1, '1'); //=> false
     *      R.equals([1, 2, 3], [1, 2, 3]); //=> true
     *
     *      var a = {}; a.v = a;
     *      var b = {}; b.v = b;
     *      R.equals(a, b); //=> true
     */
    var equals = _curry2(function equals(a, b) {
        return _hasMethod('equals', a) ? a.equals(b) : _hasMethod('equals', b) ? b.equals(a) : _equals(a, b, [], []);
    });

    /**
     * Returns a new list containing only those items that match a given predicate function.
     * The predicate function is passed one argument: *(value)*.
     *
     * Note that `R.filter` does not skip deleted or unassigned indices, unlike the native
     * `Array.prototype.filter` method. For more details on this behavior, see:
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter#Description
     *
     * Acts as a transducer if a transformer is given in list position.
     * @see R.transduce
     *
     * @func
     * @memberOf R
     * @category List
     * @sig (a -> Boolean) -> [a] -> [a]
     * @param {Function} fn The function called per iteration.
     * @param {Array} list The collection to iterate over.
     * @return {Array} The new filtered array.
     * @example
     *
     *      var isEven = function(n) {
     *        return n % 2 === 0;
     *      };
     *      R.filter(isEven, [1, 2, 3, 4]); //=> [2, 4]
     */
    var filter = _curry2(_dispatchable('filter', _xfilter, _filter));

    /**
     * Returns the first element of the list which matches the predicate, or `undefined` if no
     * element matches.
     *
     * Acts as a transducer if a transformer is given in list position.
     * @see R.transduce
     *
     * @func
     * @memberOf R
     * @category List
     * @sig (a -> Boolean) -> [a] -> a | undefined
     * @param {Function} fn The predicate function used to determine if the element is the
     *        desired one.
     * @param {Array} list The array to consider.
     * @return {Object} The element found, or `undefined`.
     * @example
     *
     *      var xs = [{a: 1}, {a: 2}, {a: 3}];
     *      R.find(R.propEq('a', 2))(xs); //=> {a: 2}
     *      R.find(R.propEq('a', 4))(xs); //=> undefined
     */
    var find = _curry2(_dispatchable('find', _xfind, function find(fn, list) {
        var idx = 0;
        while (idx < list.length) {
            if (fn(list[idx])) {
                return list[idx];
            }
            idx += 1;
        }
    }));

    /**
     * Returns the index of the first element of the list which matches the predicate, or `-1`
     * if no element matches.
     *
     * Acts as a transducer if a transformer is given in list position.
     * @see R.transduce
     *
     * @func
     * @memberOf R
     * @category List
     * @sig (a -> Boolean) -> [a] -> Number
     * @param {Function} fn The predicate function used to determine if the element is the
     * desired one.
     * @param {Array} list The array to consider.
     * @return {Number} The index of the element found, or `-1`.
     * @example
     *
     *      var xs = [{a: 1}, {a: 2}, {a: 3}];
     *      R.findIndex(R.propEq('a', 2))(xs); //=> 1
     *      R.findIndex(R.propEq('a', 4))(xs); //=> -1
     */
    var findIndex = _curry2(_dispatchable('findIndex', _xfindIndex, function findIndex(fn, list) {
        var idx = 0;
        while (idx < list.length) {
            if (fn(list[idx])) {
                return idx;
            }
            idx += 1;
        }
        return -1;
    }));

    /**
     * Returns the last element of the list which matches the predicate, or `undefined` if no
     * element matches.
     *
     * Acts as a transducer if a transformer is given in list position.
     * @see R.transduce
     *
     * @func
     * @memberOf R
     * @category List
     * @sig (a -> Boolean) -> [a] -> a | undefined
     * @param {Function} fn The predicate function used to determine if the element is the
     * desired one.
     * @param {Array} list The array to consider.
     * @return {Object} The element found, or `undefined`.
     * @example
     *
     *      var xs = [{a: 1, b: 0}, {a:1, b: 1}];
     *      R.findLast(R.propEq('a', 1))(xs); //=> {a: 1, b: 1}
     *      R.findLast(R.propEq('a', 4))(xs); //=> undefined
     */
    var findLast = _curry2(_dispatchable('findLast', _xfindLast, function findLast(fn, list) {
        var idx = list.length - 1;
        while (idx >= 0) {
            if (fn(list[idx])) {
                return list[idx];
            }
            idx -= 1;
        }
    }));

    /**
     * Returns the index of the last element of the list which matches the predicate, or
     * `-1` if no element matches.
     *
     * Acts as a transducer if a transformer is given in list position.
     * @see R.transduce
     *
     * @func
     * @memberOf R
     * @category List
     * @sig (a -> Boolean) -> [a] -> Number
     * @param {Function} fn The predicate function used to determine if the element is the
     * desired one.
     * @param {Array} list The array to consider.
     * @return {Number} The index of the element found, or `-1`.
     * @example
     *
     *      var xs = [{a: 1, b: 0}, {a:1, b: 1}];
     *      R.findLastIndex(R.propEq('a', 1))(xs); //=> 1
     *      R.findLastIndex(R.propEq('a', 4))(xs); //=> -1
     */
    var findLastIndex = _curry2(_dispatchable('findLastIndex', _xfindLastIndex, function findLastIndex(fn, list) {
        var idx = list.length - 1;
        while (idx >= 0) {
            if (fn(list[idx])) {
                return idx;
            }
            idx -= 1;
        }
        return -1;
    }));

    /**
     * Returns a new list by pulling every item out of it (and all its sub-arrays) and putting
     * them in a new array, depth-first.
     *
     * @func
     * @memberOf R
     * @category List
     * @sig [a] -> [b]
     * @param {Array} list The array to consider.
     * @return {Array} The flattened list.
     * @example
     *
     *      R.flatten([1, 2, [3, 4], 5, [6, [7, 8, [9, [10, 11], 12]]]]);
     *      //=> [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
     */
    var flatten = _curry1(_makeFlat(true));

    /**
     * Iterate over an input `list`, calling a provided function `fn` for each element in the
     * list.
     *
     * `fn` receives one argument: *(value)*.
     *
     * Note: `R.forEach` does not skip deleted or unassigned indices (sparse arrays), unlike
     * the native `Array.prototype.forEach` method. For more details on this behavior, see:
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach#Description
     *
     * Also note that, unlike `Array.prototype.forEach`, Ramda's `forEach` returns the original
     * array. In some libraries this function is named `each`.
     *
     * @func
     * @memberOf R
     * @category List
     * @sig (a -> *) -> [a] -> [a]
     * @param {Function} fn The function to invoke. Receives one argument, `value`.
     * @param {Array} list The list to iterate over.
     * @return {Array} The original list.
     * @example
     *
     *      var printXPlusFive = function(x) { console.log(x + 5); };
     *      R.forEach(printXPlusFive, [1, 2, 3]); //=> [1, 2, 3]
     *      //-> 6
     *      //-> 7
     *      //-> 8
     */
    var forEach = _curry2(function forEach(fn, list) {
        return _hasMethod('forEach', list) ? list.forEach(fn) : _forEach(fn, list);
    });

    /**
     * Returns a list of function names of object's own functions
     *
     * @func
     * @memberOf R
     * @category Object
     * @sig {*} -> [String]
     * @param {Object} obj The objects with functions in it
     * @return {Array} A list of the object's own properties that map to functions.
     * @example
     *
     *      R.functions(R); // returns list of ramda's own function names
     *
     *      var F = function() { this.x = function(){}; this.y = 1; }
     *      F.prototype.z = function() {};
     *      F.prototype.a = 100;
     *      R.functions(new F()); //=> ["x"]
     */
    var functions = _curry1(_functionsWith(keys));

    /**
     * Returns a list of function names of object's own and prototype functions
     *
     * @func
     * @memberOf R
     * @category Object
     * @sig {*} -> [String]
     * @param {Object} obj The objects with functions in it
     * @return {Array} A list of the object's own properties and prototype
     *         properties that map to functions.
     * @example
     *
     *      R.functionsIn(R); // returns list of ramda's own and prototype function names
     *
     *      var F = function() { this.x = function(){}; this.y = 1; }
     *      F.prototype.z = function() {};
     *      F.prototype.a = 100;
     *      R.functionsIn(new F()); //=> ["x", "z"]
     */
    var functionsIn = _curry1(_functionsWith(keysIn));

    /**
     * Splits a list into sub-lists stored in an object, based on the result of calling a String-returning function
     * on each element, and grouping the results according to values returned.
     *
     * Acts as a transducer if a transformer is given in list position.
     * @see R.transduce
     *
     * @func
     * @memberOf R
     * @category List
     * @sig (a -> String) -> [a] -> {String: [a]}
     * @param {Function} fn Function :: a -> String
     * @param {Array} list The array to group
     * @return {Object} An object with the output of `fn` for keys, mapped to arrays of elements
     *         that produced that key when passed to `fn`.
     * @example
     *
     *      var byGrade = R.groupBy(function(student) {
     *        var score = student.score;
     *        return score < 65 ? 'F' :
     *               score < 70 ? 'D' :
     *               score < 80 ? 'C' :
     *               score < 90 ? 'B' : 'A';
     *      });
     *      var students = [{name: 'Abby', score: 84},
     *                      {name: 'Eddy', score: 58},
     *                      // ...
     *                      {name: 'Jack', score: 69}];
     *      byGrade(students);
     *      // {
     *      //   'A': [{name: 'Dianne', score: 99}],
     *      //   'B': [{name: 'Abby', score: 84}]
     *      //   // ...,
     *      //   'F': [{name: 'Eddy', score: 58}]
     *      // }
     */
    var groupBy = _curry2(_dispatchable('groupBy', _xgroupBy, function groupBy(fn, list) {
        return _reduce(function (acc, elt) {
            var key = fn(elt);
            acc[key] = _append(elt, acc[key] || (acc[key] = []));
            return acc;
        }, {}, list);
    }));

    /**
     * Returns the first element in a list.
     * In some libraries this function is named `first`.
     *
     * @func
     * @memberOf R
     * @category List
     * @sig [a] -> a
     * @param {Array} list The array to consider.
     * @return {*} The first element of the list, or `undefined` if the list is empty.
     * @example
     *
     *      R.head(['fi', 'fo', 'fum']); //=> 'fi'
     */
    var head = nth(0);

    /**
     * Creates a function that will process either the `onTrue` or the `onFalse` function depending
     * upon the result of the `condition` predicate.
     *
     * @func
     * @memberOf R
     * @category Logic
     * @sig (*... -> Boolean) -> (*... -> *) -> (*... -> *) -> (*... -> *)
     * @param {Function} condition A predicate function
     * @param {Function} onTrue A function to invoke when the `condition` evaluates to a truthy value.
     * @param {Function} onFalse A function to invoke when the `condition` evaluates to a falsy value.
     * @return {Function} A new unary function that will process either the `onTrue` or the `onFalse`
     *                    function depending upon the result of the `condition` predicate.
     * @example
     *
     *      // Flatten all arrays in the list but leave other values alone.
     *      var flattenArrays = R.map(R.ifElse(Array.isArray, R.flatten, R.identity));
     *
     *      flattenArrays([[0], [[10], [8]], 1234, {}]); //=> [[0], [10, 8], 1234, {}]
     *      flattenArrays([[[10], 123], [8, [10]], "hello"]); //=> [[10, 123], [8, 10], "hello"]
     */
    var ifElse = _curry3(function ifElse(condition, onTrue, onFalse) {
        return curryN(Math.max(condition.length, onTrue.length, onFalse.length), function _ifElse() {
            return condition.apply(this, arguments) ? onTrue.apply(this, arguments) : onFalse.apply(this, arguments);
        });
    });

    /**
     * Inserts the supplied element into the list, at index `index`.  _Note
     * that this is not destructive_: it returns a copy of the list with the changes.
     * <small>No lists have been harmed in the application of this function.</small>
     *
     * @func
     * @memberOf R
     * @category List
     * @sig Number -> a -> [a] -> [a]
     * @param {Number} index The position to insert the element
     * @param {*} elt The element to insert into the Array
     * @param {Array} list The list to insert into
     * @return {Array} A new Array with `elt` inserted at `index`.
     * @example
     *
     *      R.insert(2, 'x', [1,2,3,4]); //=> [1,2,'x',3,4]
     */
    var insert = _curry3(function insert(idx, elt, list) {
        idx = idx < list.length && idx >= 0 ? idx : list.length;
        return _concat(_append(elt, _slice(list, 0, idx)), _slice(list, idx));
    });

    /**
     * Combines two lists into a set (i.e. no duplicates) composed of those
     * elements common to both lists.  Duplication is determined according
     * to the value returned by applying the supplied predicate to two list
     * elements.
     *
     * @func
     * @memberOf R
     * @category Relation
     * @sig (a,a -> Boolean) -> [a] -> [a] -> [a]
     * @param {Function} pred A predicate function that determines whether
     *        the two supplied elements are equal.
     * @param {Array} list1 One list of items to compare
     * @param {Array} list2 A second list of items to compare
     * @see R.intersection
     * @return {Array} A new list containing those elements common to both lists.
     * @example
     *
     *      var buffaloSpringfield = [
     *        {id: 824, name: 'Richie Furay'},
     *        {id: 956, name: 'Dewey Martin'},
     *        {id: 313, name: 'Bruce Palmer'},
     *        {id: 456, name: 'Stephen Stills'},
     *        {id: 177, name: 'Neil Young'}
     *      ];
     *      var csny = [
     *        {id: 204, name: 'David Crosby'},
     *        {id: 456, name: 'Stephen Stills'},
     *        {id: 539, name: 'Graham Nash'},
     *        {id: 177, name: 'Neil Young'}
     *      ];
     *
     *      var sameId = function(o1, o2) {return o1.id === o2.id;};
     *
     *      R.intersectionWith(sameId, buffaloSpringfield, csny);
     *      //=> [{id: 456, name: 'Stephen Stills'}, {id: 177, name: 'Neil Young'}]
     */
    var intersectionWith = _curry3(function intersectionWith(pred, list1, list2) {
        var results = [], idx = 0;
        while (idx < list1.length) {
            if (_containsWith(pred, list1[idx], list2)) {
                results[results.length] = list1[idx];
            }
            idx += 1;
        }
        return uniqWith(pred, results);
    });

    /**
     * Creates a new list with the separator interposed between elements.
     *
     * @func
     * @memberOf R
     * @category List
     * @sig a -> [a] -> [a]
     * @param {*} separator The element to add to the list.
     * @param {Array} list The list to be interposed.
     * @return {Array} The new list.
     * @example
     *
     *      R.intersperse('n', ['ba', 'a', 'a']); //=> ['ba', 'n', 'a', 'n', 'a']
     */
    var intersperse = _curry2(_checkForMethod('intersperse', function intersperse(separator, list) {
        var out = [];
        var idx = 0;
        while (idx < list.length) {
            if (idx === list.length - 1) {
                out.push(list[idx]);
            } else {
                out.push(list[idx], separator);
            }
            idx += 1;
        }
        return out;
    }));

    /**
     * Same as R.invertObj, however this accounts for objects
     * with duplicate values by putting the values into an
     * array.
     *
     * @func
     * @memberOf R
     * @category Object
     * @sig {s: x} -> {x: [ s, ... ]}
     * @param {Object} obj The object or array to invert
     * @return {Object} out A new object with keys
     * in an array.
     * @example
     *
     *      var raceResultsByFirstName = {
     *        first: 'alice',
     *        second: 'jake',
     *        third: 'alice',
     *      };
     *      R.invert(raceResultsByFirstName);
     *      //=> { 'alice': ['first', 'third'], 'jake':['second'] }
     */
    var invert = _curry1(function invert(obj) {
        var props = keys(obj);
        var idx = 0;
        var out = {};
        while (idx < props.length) {
            var key = props[idx];
            var val = obj[key];
            var list = _has(val, out) ? out[val] : out[val] = [];
            list[list.length] = key;
            idx += 1;
        }
        return out;
    });

    /**
     * Returns a new object with the keys of the given object
     * as values, and the values of the given object as keys.
     *
     * @func
     * @memberOf R
     * @category Object
     * @sig {s: x} -> {x: s}
     * @param {Object} obj The object or array to invert
     * @return {Object} out A new object
     * @example
     *
     *      var raceResults = {
     *        first: 'alice',
     *        second: 'jake'
     *      };
     *      R.invertObj(raceResults);
     *      //=> { 'alice': 'first', 'jake':'second' }
     *
     *      // Alternatively:
     *      var raceResults = ['alice', 'jake'];
     *      R.invertObj(raceResults);
     *      //=> { 'alice': '0', 'jake':'1' }
     */
    var invertObj = _curry1(function invertObj(obj) {
        var props = keys(obj);
        var idx = 0;
        var out = {};
        while (idx < props.length) {
            var key = props[idx];
            out[obj[key]] = key;
            idx += 1;
        }
        return out;
    });

    /**
     * Turns a named method with a specified arity into a function
     * that can be called directly supplied with arguments and a target object.
     *
     * The returned function is curried and accepts `arity + 1` parameters where
     * the final parameter is the target object.
     *
     * @func
     * @memberOf R
     * @category Function
     * @sig Number -> String -> (a -> b -> ... -> n -> Object -> *)
     * @param {Number} arity Number of arguments the returned function should take
     *        before the target object.
     * @param {Function} method Name of the method to call.
     * @return {Function} A new curried function.
     * @example
     *
     *      var sliceFrom = R.invoker(1, 'slice');
     *      sliceFrom(6, 'abcdefghijklm'); //=> 'ghijklm'
     *      var sliceFrom6 = R.invoker(2, 'slice')(6);
     *      sliceFrom6(8, 'abcdefghijklm'); //=> 'gh'
     */
    var invoker = _curry2(function invoker(arity, method) {
        return curryN(arity + 1, function () {
            var target = arguments[arity];
            return target[method].apply(target, _slice(arguments, 0, arity));
        });
    });

    /**
     * Returns a string made by inserting the `separator` between each
     * element and concatenating all the elements into a single string.
     *
     * @func
     * @memberOf R
     * @category List
     * @sig String -> [a] -> String
     * @param {Number|String} separator The string used to separate the elements.
     * @param {Array} xs The elements to join into a string.
     * @return {String} str The string made by concatenating `xs` with `separator`.
     * @example
     *
     *      var spacer = R.join(' ');
     *      spacer(['a', 2, 3.4]);   //=> 'a 2 3.4'
     *      R.join('|', [1, 2, 3]);    //=> '1|2|3'
     */
    var join = invoker(1, 'join');

    /**
     * Returns the last element from a list.
     *
     * @func
     * @memberOf R
     * @category List
     * @sig [a] -> a
     * @param {Array} list The array to consider.
     * @return {*} The last element of the list, or `undefined` if the list is empty.
     * @example
     *
     *      R.last(['fi', 'fo', 'fum']); //=> 'fum'
     */
    var last = nth(-1);

    /**
     * Creates a lens that will focus on index `n` of the source array.
     *
     * @func
     * @memberOf R
     * @category List
     * @see R.lens
     * @sig Number -> (a -> b)
     * @param {Number} n The index of the array that the returned lens will focus on.
     * @return {Function} the returned function has `set` and `map` properties that are
     *         also curried functions.
     * @example
     *
     *     var headLens = R.lensIndex(0);
     *     headLens([10, 20, 30, 40]); //=> 10
     *     headLens.set('mu', [10, 20, 30, 40]); //=> ['mu', 20, 30, 40]
     *     headLens.map(function(x) { return x + 1; }, [10, 20, 30, 40]); //=> [11, 20, 30, 40]
     */
    var lensIndex = function lensIndex(n) {
        return lens(nth(n), function (x, xs) {
            return _slice(xs, 0, n).concat([x], _slice(xs, n + 1));
        });
    };

    /**
     * Creates a lens that will focus on property `k` of the source object.
     *
     * @func
     * @memberOf R
     * @category Object
     * @see R.lens
     * @sig String -> (a -> b)
     * @param {String} k A string that represents a property to focus on.
     * @return {Function} the returned function has `set` and `map` properties that are
     *         also curried functions.
     * @example
     *
     *     var phraseLens = R.lensProp('phrase');
     *     var obj1 = { phrase: 'Absolute filth . . . and I LOVED it!'};
     *     var obj2 = { phrase: "What's all this, then?"};
     *     phraseLens(obj1); // => 'Absolute filth . . . and I LOVED it!'
     *     phraseLens(obj2); // => "What's all this, then?"
     *     phraseLens.set('Ooh Betty', obj1); //=> { phrase: 'Ooh Betty'}
     *     phraseLens.map(R.toUpper, obj2); //=> { phrase: "WHAT'S ALL THIS, THEN?"}
     */
    var lensProp = function (k) {
        return lens(prop(k), assoc(k));
    };

    /**
     * Returns a new list, constructed by applying the supplied function to every element of the
     * supplied list.
     *
     * Note: `R.map` does not skip deleted or unassigned indices (sparse arrays), unlike the
     * native `Array.prototype.map` method. For more details on this behavior, see:
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map#Description
     *
     * Acts as a transducer if a transformer is given in list position.
     * @see R.transduce
     *
     * @func
     * @memberOf R
     * @category List
     * @sig (a -> b) -> [a] -> [b]
     * @param {Function} fn The function to be called on every element of the input `list`.
     * @param {Array} list The list to be iterated over.
     * @return {Array} The new list.
     * @example
     *
     *      var double = function(x) {
     *        return x * 2;
     *      };
     *
     *      R.map(double, [1, 2, 3]); //=> [2, 4, 6]
     */
    var map = _curry2(_dispatchable('map', _xmap, _map));

    /**
     * Map, but for objects. Creates an object with the same keys as `obj` and values
     * generated by running each property of `obj` through `fn`. `fn` is passed one argument:
     * *(value)*.
     *
     * @func
     * @memberOf R
     * @category Object
     * @sig (v -> v) -> {k: v} -> {k: v}
     * @param {Function} fn A function called for each property in `obj`. Its return value will
     * become a new property on the return object.
     * @param {Object} obj The object to iterate over.
     * @return {Object} A new object with the same keys as `obj` and values that are the result
     *         of running each property through `fn`.
     * @example
     *
     *      var values = { x: 1, y: 2, z: 3 };
     *      var double = function(num) {
     *        return num * 2;
     *      };
     *
     *      R.mapObj(double, values); //=> { x: 2, y: 4, z: 6 }
     */
    var mapObj = _curry2(function mapObject(fn, obj) {
        return _reduce(function (acc, key) {
            acc[key] = fn(obj[key]);
            return acc;
        }, {}, keys(obj));
    });

    /**
     * Like `mapObj`, but but passes additional arguments to the predicate function. The
     * predicate function is passed three arguments: *(value, key, obj)*.
     *
     * @func
     * @memberOf R
     * @category Object
     * @sig (v, k, {k: v} -> v) -> {k: v} -> {k: v}
     * @param {Function} fn A function called for each property in `obj`. Its return value will
     *        become a new property on the return object.
     * @param {Object} obj The object to iterate over.
     * @return {Object} A new object with the same keys as `obj` and values that are the result
     *         of running each property through `fn`.
     * @example
     *
     *      var values = { x: 1, y: 2, z: 3 };
     *      var prependKeyAndDouble = function(num, key, obj) {
     *        return key + (num * 2);
     *      };
     *
     *      R.mapObjIndexed(prependKeyAndDouble, values); //=> { x: 'x2', y: 'y4', z: 'z6' }
     */
    var mapObjIndexed = _curry2(function mapObjectIndexed(fn, obj) {
        return _reduce(function (acc, key) {
            acc[key] = fn(obj[key], key, obj);
            return acc;
        }, {}, keys(obj));
    });

    /**
     * Tests a regular expression against a String
     *
     * @func
     * @memberOf R
     * @category String
     * @sig RegExp -> String -> [String] | null
     * @param {RegExp} rx A regular expression.
     * @param {String} str The string to match against
     * @return {Array} The list of matches, or null if no matches found.
     * @see R.invoker
     * @example
     *
     *      R.match(/([a-z]a)/g, 'bananas'); //=> ['ba', 'na', 'na']
     */
    var match = invoker(1, 'match');

    /**
     * Determines the largest of a list of numbers (or elements that can be cast to numbers)
     *
     * @func
     * @memberOf R
     * @category Math
     * @sig [Number] -> Number
     * @see R.maxBy
     * @param {Array} list A list of numbers
     * @return {Number} The greatest number in the list.
     * @example
     *
     *      R.max([7, 3, 9, 2, 4, 9, 3]); //=> 9
     */
    var max = _createMaxMin(_gt, -Infinity);

    /**
     * Create a new object with the own properties of a
     * merged with the own properties of object b.
     * This function will *not* mutate passed-in objects.
     *
     * @func
     * @memberOf R
     * @category Object
     * @sig {k: v} -> {k: v} -> {k: v}
     * @param {Object} a source object
     * @param {Object} b object with higher precedence in output
     * @return {Object} The destination object.
     * @example
     *
     *      R.merge({ 'name': 'fred', 'age': 10 }, { 'age': 40 });
     *      //=> { 'name': 'fred', 'age': 40 }
     *
     *      var resetToDefault = R.merge(R.__, {x: 0});
     *      resetToDefault({x: 5, y: 2}); //=> {x: 0, y: 2}
     */
    var merge = _curry2(function merge(a, b) {
        return _extend(_extend({}, a), b);
    });

    /**
     * Determines the smallest of a list of numbers (or elements that can be cast to numbers)
     *
     * @func
     * @memberOf R
     * @category Math
     * @sig [Number] -> Number
     * @param {Array} list A list of numbers
     * @return {Number} The greatest number in the list.
     * @see R.minBy
     * @example
     *
     *      R.min([7, 3, 9, 2, 4, 9, 3]); //=> 2
     */
    var min = _createMaxMin(_lt, Infinity);

    /**
     * Returns `true` if no elements of the list match the predicate,
     * `false` otherwise.
     *
     * @func
     * @memberOf R
     * @category List
     * @sig (a -> Boolean) -> [a] -> Boolean
     * @param {Function} fn The predicate function.
     * @param {Array} list The array to consider.
     * @return {Boolean} `true` if the predicate is not satisfied by every element, `false` otherwise.
     * @example
     *
     *      R.none(R.isNaN, [1, 2, 3]); //=> true
     *      R.none(R.isNaN, [1, 2, 3, NaN]); //=> false
     */
    var none = _curry2(_complement(_dispatchable('any', _xany, _any)));

    /**
     * A function that returns the first truthy of two arguments otherwise the
     * last argument. Note that this is NOT short-circuited, meaning that if
     * expressions are passed they are both evaluated.
     *
     * Dispatches to the `or` method of the first argument if applicable.
     *
     * @func
     * @memberOf R
     * @category Logic
     * @sig * -> * -> *
     * @param {*} a any value
     * @param {*} b any other value
     * @return {*} the first truthy argument, otherwise the last argument.
     * @example
     *
     *      R.or(false, true); //=> true
     *      R.or(0, []); //=> []
     *      R.or(null, ''); => ''
     */
    var or = _curry2(function or(a, b) {
        return _hasMethod('or', a) ? a.or(b) : a || b;
    });

    /**
     * Takes a predicate and a list and returns the pair of lists of
     * elements which do and do not satisfy the predicate, respectively.
     *
     * @func
     * @memberOf R
     * @category List
     * @sig (a -> Boolean) -> [a] -> [[a],[a]]
     * @param {Function} pred A predicate to determine which array the element belongs to.
     * @param {Array} list The array to partition.
     * @return {Array} A nested array, containing first an array of elements that satisfied the predicate,
     *         and second an array of elements that did not satisfy.
     * @example
     *
     *      R.partition(R.contains('s'), ['sss', 'ttt', 'foo', 'bars']);
     *      //=> [ [ 'sss', 'bars' ],  [ 'ttt', 'foo' ] ]
     */
    var partition = _curry2(function partition(pred, list) {
        return _reduce(function (acc, elt) {
            var xs = acc[pred(elt) ? 0 : 1];
            xs[xs.length] = elt;
            return acc;
        }, [
            [],
            []
        ], list);
    });

    /**
     * Determines whether a nested path on an object has a specific value,
     * in `R.equals` terms. Most likely used to filter a list.
     *
     * @func
     * @memberOf R
     * @category Relation
     * @sig [String] -> * -> {String: *} -> Boolean
     * @param {Array} path The path of the nested property to use
     * @param {*} val The value to compare the nested property with
     * @param {Object} obj The object to check the nested property in
     * @return {Boolean} `true` if the value equals the nested object property,
     *         `false` otherwise.
     * @example
     *
     *      var user1 = { address: { zipCode: 90210 } };
     *      var user2 = { address: { zipCode: 55555 } };
     *      var user3 = { name: 'Bob' };
     *      var users = [ user1, user2, user3 ];
     *      var isFamous = R.pathEq(['address', 'zipCode'], 90210);
     *      R.filter(isFamous, users); //=> [ user1 ]
     */
    var pathEq = _curry3(function pathEq(path, val, obj) {
        return equals(_path(path, obj), val);
    });

    /**
     * Creates a new function that runs each of the functions supplied as parameters in turn,
     * passing the return value of each function invocation to the next function invocation,
     * beginning with whatever arguments were passed to the initial invocation.
     *
     * `pipe` is the mirror version of `compose`. `pipe` is left-associative, which means that
     * each of the functions provided is executed in order from left to right.
     *
     * In some libraries this function is named `sequence`.
     * @func
     * @memberOf R
     * @category Function
     * @sig ((a... -> b), (b -> c), ..., (x -> y), (y -> z)) -> (a... -> z)
     * @param {...Function} functions A variable number of functions.
     * @return {Function} A new function which represents the result of calling each of the
     *         input `functions`, passing the result of each function call to the next, from
     *         left to right.
     * @example
     *
     *      var triple = function(x) { return x * 3; };
     *      var double = function(x) { return x * 2; };
     *      var square = function(x) { return x * x; };
     *      var squareThenDoubleThenTriple = R.pipe(square, double, triple);
     *
     *      //≅ triple(double(square(5)))
     *      squareThenDoubleThenTriple(5); //=> 150
     */
    var pipe = function pipe() {
        return compose.apply(this, reverse(arguments));
    };

    /**
     * Creates a new lens that allows getting and setting values of nested properties, by
     * following each given lens in succession.
     *
     * `pipeL` is the mirror version of `composeL`. `pipeL` is left-associative, which means that
     * each of the functions provided is executed in order from left to right.
     *
     * @func
     * @memberOf R
     * @category Function
     * @see R.lens
     * @sig ((a -> b), (b -> c), ..., (x -> y), (y -> z)) -> (a -> z)
     * @param {...Function} lenses A variable number of lenses.
     * @return {Function} A new lens which represents the result of calling each of the
     *         input `lenses`, passing the result of each getter/setter as the source
     *         to the next, from right to left.
     * @example
     *
     *      var headLens = R.lensIndex(0);
     *      var secondLens = R.lensIndex(1);
     *      var xLens = R.lensProp('x');
     *      var headThenXThenSecondLens = R.pipeL(headLens, xLens, secondLens);
     *
     *      var source = [{x: [0, 1], y: [2, 3]}, {x: [4, 5], y: [6, 7]}];
     *      headThenXThenSecondLens(source); //=> 1
     *      headThenXThenSecondLens.set(123, source); //=> [{x: [0, 123], y: [2, 3]}, {x: [4, 5], y: [6, 7]}]
     */
    var pipeL = compose(apply(composeL), unapply(reverse));

    /**
     * Creates a new function that runs each of the functions supplied as parameters in turn,
     * passing to the next function invocation either the value returned by the previous
     * function or the resolved value if the returned value is a promise. In other words,
     * if some of the functions in the sequence return promises, `pipeP` pipes the values
     * asynchronously. If none of the functions return promises, the behavior is the same as
     * that of `pipe`.
     *
     * `pipeP` is the mirror version of `composeP`. `pipeP` is left-associative, which means that
     * each of the functions provided is executed in order from left to right.
     *
     * @func
     * @memberOf R
     * @category Function
     * @sig ((a... -> b), (b -> c), ..., (x -> y), (y -> z)) -> (a... -> z)
     * @param {...Function} functions A variable number of functions.
     * @return {Function} A new function which represents the result of calling each of the
     *         input `functions`, passing either the returned result or the asynchronously
     *         resolved value) of each function call to the next, from left to right.
     * @example
     *
     *      var Q = require('q');
     *      var triple = function(x) { return x * 3; };
     *      var double = function(x) { return x * 2; };
     *      var squareAsync = function(x) { return Q.when(x * x); };
     *      var squareAsyncThenDoubleThenTriple = R.pipeP(squareAsync, double, triple);
     *
     *      //≅ squareAsync(5).then(function(x) { return triple(double(x)) };
     *      squareAsyncThenDoubleThenTriple(5)
     *        .then(function(result) {
     *          // result is 150
     *        });
     */
    var pipeP = function pipeP() {
        return composeP.apply(this, reverse(arguments));
    };

    /**
     * Determines whether the given property of an object has a specific value,
     * in `R.equals` terms. Most likely used to filter a list.
     *
     * @func
     * @memberOf R
     * @category Relation
     * @sig k -> v -> {k: v} -> Boolean
     * @param {Number|String} name The property name (or index) to use.
     * @param {*} val The value to compare the property with.
     * @return {Boolean} `true` if the properties are equal, `false` otherwise.
     * @example
     *
     *      var abby = {name: 'Abby', age: 7, hair: 'blond'};
     *      var fred = {name: 'Fred', age: 12, hair: 'brown'};
     *      var rusty = {name: 'Rusty', age: 10, hair: 'brown'};
     *      var alois = {name: 'Alois', age: 15, disposition: 'surly'};
     *      var kids = [abby, fred, rusty, alois];
     *      var hasBrownHair = R.propEq('hair', 'brown');
     *      R.filter(hasBrownHair, kids); //=> [fred, rusty]
     */
    var propEq = _curry3(function propEq(name, val, obj) {
        return equals(obj[name], val);
    });

    /**
     * Returns a single item by iterating through the list, successively calling the iterator
     * function and passing it an accumulator value and the current value from the array, and
     * then passing the result to the next call.
     *
     * The iterator function receives two values: *(acc, value)*.  It may use `R.reduced` to
     * shortcut the iteration.
     *
     * Note: `R.reduce` does not skip deleted or unassigned indices (sparse arrays), unlike
     * the native `Array.prototype.reduce` method. For more details on this behavior, see:
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce#Description
     * @see R.reduced
     *
     * @func
     * @memberOf R
     * @category List
     * @sig (a,b -> a) -> a -> [b] -> a
     * @param {Function} fn The iterator function. Receives two values, the accumulator and the
     *        current element from the array.
     * @param {*} acc The accumulator value.
     * @param {Array} list The list to iterate over.
     * @return {*} The final, accumulated value.
     * @example
     *
     *      var numbers = [1, 2, 3];
     *      var add = function(a, b) {
     *        return a + b;
     *      };
     *
     *      R.reduce(add, 10, numbers); //=> 16
     */
    var reduce = _curry3(_reduce);

    /**
     * Similar to `filter`, except that it keeps only values for which the given predicate
     * function returns falsy. The predicate function is passed one argument: *(value)*.
     *
     * Acts as a transducer if a transformer is given in list position.
     * @see R.transduce
     *
     * @func
     * @memberOf R
     * @category List
     * @sig (a -> Boolean) -> [a] -> [a]
     * @param {Function} fn The function called per iteration.
     * @param {Array} list The collection to iterate over.
     * @return {Array} The new filtered array.
     * @example
     *
     *      var isOdd = function(n) {
     *        return n % 2 === 1;
     *      };
     *      R.reject(isOdd, [1, 2, 3, 4]); //=> [2, 4]
     */
    var reject = _curry2(function reject(fn, list) {
        return filter(_complement(fn), list);
    });

    /**
     * Returns a fixed list of size `n` containing a specified identical value.
     *
     * @func
     * @memberOf R
     * @category List
     * @sig a -> n -> [a]
     * @param {*} value The value to repeat.
     * @param {Number} n The desired size of the output list.
     * @return {Array} A new array containing `n` `value`s.
     * @example
     *
     *      R.repeat('hi', 5); //=> ['hi', 'hi', 'hi', 'hi', 'hi']
     *
     *      var obj = {};
     *      var repeatedObjs = R.repeat(obj, 5); //=> [{}, {}, {}, {}, {}]
     *      repeatedObjs[0] === repeatedObjs[1]; //=> true
     */
    var repeat = _curry2(function repeat(value, n) {
        return times(always(value), n);
    });

    /**
     * Returns a list containing the elements of `xs` from `fromIndex` (inclusive)
     * to `toIndex` (exclusive).
     *
     * @func
     * @memberOf R
     * @category List
     * @sig Number -> Number -> [a] -> [a]
     * @param {Number} fromIndex The start index (inclusive).
     * @param {Number} toIndex The end index (exclusive).
     * @param {Array} xs The list to take elements from.
     * @return {Array} The slice of `xs` from `fromIndex` to `toIndex`.
     * @example
     *
     *      var xs = R.range(0, 10);
     *      R.slice(2, 5)(xs); //=> [2, 3, 4]
     */
    var slice = _curry3(_checkForMethod('slice', function slice(fromIndex, toIndex, xs) {
        return Array.prototype.slice.call(xs, fromIndex, toIndex);
    }));

    /**
     * Splits a string into an array of strings based on the given
     * separator.
     *
     * @func
     * @memberOf R
     * @category String
     * @sig String -> String -> [String]
     * @param {String} sep The separator string.
     * @param {String} str The string to separate into an array.
     * @return {Array} The array of strings from `str` separated by `str`.
     * @example
     *
     *      var pathComponents = R.split('/');
     *      R.tail(pathComponents('/usr/local/bin/node')); //=> ['usr', 'local', 'bin', 'node']
     *
     *      R.split('.', 'a.b.c.xyz.d'); //=> ['a', 'b', 'c', 'xyz', 'd']
     */
    var split = invoker(1, 'split');

    /**
     * Returns a string containing the characters of `str` from `fromIndex`
     * (inclusive) to `toIndex` (exclusive).
     *
     * @func
     * @memberOf R
     * @category String
     * @sig Number -> Number -> String -> String
     * @param {Number} fromIndex The start index (inclusive).
     * @param {Number} toIndex The end index (exclusive).
     * @param {String} str The string to slice.
     * @return {String}
     * @see R.slice
     * @deprecated since v0.15.0
     * @example
     *
     *      R.substring(2, 5, 'abcdefghijklm'); //=> 'cde'
     */
    var substring = slice;

    /**
     * Returns a string containing the characters of `str` from `fromIndex`
     * (inclusive) to the end of `str`.
     *
     * @func
     * @memberOf R
     * @category String
     * @sig Number -> String -> String
     * @param {Number} fromIndex
     * @param {String} str
     * @return {String}
     * @deprecated since v0.15.0
     * @example
     *
     *      R.substringFrom(3, 'Ramda'); //=> 'da'
     *      R.substringFrom(-2, 'Ramda'); //=> 'da'
     */
    var substringFrom = substring(__, Infinity);

    /**
     * Returns a string containing the first `toIndex` characters of `str`.
     *
     * @func
     * @memberOf R
     * @category String
     * @sig Number -> String -> String
     * @param {Number} toIndex
     * @param {String} str
     * @return {String}
     * @deprecated since v0.15.0
     * @example
     *
     *      R.substringTo(3, 'Ramda'); //=> 'Ram'
     *      R.substringTo(-2, 'Ramda'); //=> 'Ram'
     */
    var substringTo = substring(0);

    /**
     * Adds together all the elements of a list.
     *
     * @func
     * @memberOf R
     * @category Math
     * @sig [Number] -> Number
     * @param {Array} list An array of numbers
     * @return {Number} The sum of all the numbers in the list.
     * @see R.reduce
     * @example
     *
     *      R.sum([2,4,6,8,100,1]); //=> 121
     */
    var sum = reduce(_add, 0);

    /**
     * Returns all but the first element of a list. If the list provided has the `tail` method,
     * it will instead return `list.tail()`.
     *
     * @func
     * @memberOf R
     * @category List
     * @sig [a] -> [a]
     * @param {Array} list The array to consider.
     * @return {Array} A new array containing all but the first element of the input list, or an
     *         empty list if the input list is empty.
     * @example
     *
     *      R.tail(['fi', 'fo', 'fum']); //=> ['fo', 'fum']
     */
    var tail = _checkForMethod('tail', function (list) {
        return _slice(list, 1);
    });

    /**
     * Returns a new list containing the first `n` elements of the given list.
     * If `n > list.length`, returns a list of `list.length` elements.
     *
     * Acts as a transducer if a transformer is given in list position.
     * @see R.transduce
     *
     * @func
     * @memberOf R
     * @category List
     * @sig Number -> [a] -> [a]
     * @param {Number} n The number of elements to return.
     * @param {Array} xs The collection to consider.
     * @return {Array}
     * @example
     *
     *      R.take(3,[1,2,3,4,5]); //=> [1,2,3]
     *
     *      var members= [ "Paul Desmond","Bob Bates","Joe Dodge","Ron Crotty","Lloyd Davis","Joe Morello","Norman Bates",
     *                     "Eugene Wright","Gerry Mulligan","Jack Six","Alan Dawson","Darius Brubeck","Chris Brubeck",
     *                     "Dan Brubeck","Bobby Militello","Michael Moore","Randy Jones"];
     *      var takeFive = R.take(5);
     *      takeFive(members); //=> ["Paul Desmond","Bob Bates","Joe Dodge","Ron Crotty","Lloyd Davis"]
     */
    var take = _curry2(_dispatchable('take', _xtake, function take(n, xs) {
        return slice(0, n < 0 ? Infinity : n, xs);
    }));

    /**
     * Returns a new list containing the first `n` elements of a given list, passing each value
     * to the supplied predicate function, and terminating when the predicate function returns
     * `false`. Excludes the element that caused the predicate function to fail. The predicate
     * function is passed one argument: *(value)*.
     *
     * Acts as a transducer if a transformer is given in list position.
     * @see R.transduce
     *
     * @func
     * @memberOf R
     * @category List
     * @sig (a -> Boolean) -> [a] -> [a]
     * @param {Function} fn The function called per iteration.
     * @param {Array} list The collection to iterate over.
     * @return {Array} A new array.
     * @example
     *
     *      var isNotFour = function(x) {
     *        return !(x === 4);
     *      };
     *
     *      R.takeWhile(isNotFour, [1, 2, 3, 4]); //=> [1, 2, 3]
     */
    var takeWhile = _curry2(_dispatchable('takeWhile', _xtakeWhile, function takeWhile(fn, list) {
        var idx = 0;
        while (idx < list.length && fn(list[idx])) {
            idx += 1;
        }
        return _slice(list, 0, idx);
    }));

    /**
     * The lower case version of a string.
     *
     * @func
     * @memberOf R
     * @category String
     * @sig String -> String
     * @param {String} str The string to lower case.
     * @return {String} The lower case version of `str`.
     * @example
     *
     *      R.toLower('XYZ'); //=> 'xyz'
     */
    var toLower = invoker(0, 'toLowerCase');

    /**
     * The upper case version of a string.
     *
     * @func
     * @memberOf R
     * @category String
     * @sig String -> String
     * @param {String} str The string to upper case.
     * @return {String} The upper case version of `str`.
     * @example
     *
     *      R.toUpper('abc'); //=> 'ABC'
     */
    var toUpper = invoker(0, 'toUpperCase');

    /**
     * Initializes a transducer using supplied iterator function. Returns a single item by
     * iterating through the list, successively calling the transformed iterator function and
     * passing it an accumulator value and the current value from the array, and then passing
     * the result to the next call.
     *
     * The iterator function receives two values: *(acc, value)*. It will be wrapped as a
     * transformer to initialize the transducer. A transformer can be passed directly in place
     * of an iterator function.  In both cases, iteration may be stopped early with the
     * `R.reduced` function.
     *
     * A transducer is a function that accepts a transformer and returns a transformer and can
     * be composed directly.
     *
     * A transformer is an an object that provides a 2-arity reducing iterator function, step,
     * 0-arity initial value function, init, and 1-arity result extraction function, result.
     * The step function is used as the iterator function in reduce. The result function is used
     * to convert the final accumulator into the return type and in most cases is R.identity.
     * The init function can be used to provide an initial accumulator, but is ignored by transduce.
     *
     * The iteration is performed with R.reduce after initializing the transducer.
     * @see R.reduce
     * @see R.reduced
     *
     * @func
     * @memberOf R
     * @category List
     * @sig (c -> c) -> (a,b -> a) -> a -> [b] -> a
     * @param {Function} xf The transducer function. Receives a transformer and returns a transformer.
     * @param {Function} fn The iterator function. Receives two values, the accumulator and the
     *        current element from the array. Wrapped as transformer, if necessary, and used to
     *        initialize the transducer
     * @param {*} acc The initial accumulator value.
     * @param {Array} list The list to iterate over.
     * @see R.into
     * @return {*} The final, accumulated value.
     * @example
     *
     *      var numbers = [1, 2, 3, 4];
     *      var transducer = R.compose(R.map(R.add(1)), R.take(2));
     *
     *      R.transduce(transducer, R.flip(R.append), [], numbers); //=> [2, 3]
     */
    var transduce = curryN(4, function (xf, fn, acc, list) {
        return _reduce(xf(typeof fn === 'function' ? _xwrap(fn) : fn), acc, list);
    });

    /**
     * Returns a function of arity `n` from a (manually) curried function.
     *
     * @func
     * @memberOf R
     * @category Function
     * @sig Number -> (a -> b) -> (a -> c)
     * @param {Number} length The arity for the returned function.
     * @param {Function} fn The function to uncurry.
     * @return {Function} A new function.
     * @see R.curry
     * @example
     *
     *      var addFour = function(a) {
     *        return function(b) {
     *          return function(c) {
     *            return function(d) {
     *              return a + b + c + d;
     *            };
     *          };
     *        };
     *      };
     *
     *      var uncurriedAddFour = R.uncurryN(4, addFour);
     *      curriedAddFour(1, 2, 3, 4); //=> 10
     */
    var uncurryN = _curry2(function uncurryN(depth, fn) {
        return curryN(depth, function () {
            var currentDepth = 1;
            var value = fn;
            var idx = 0;
            var endIdx;
            while (currentDepth <= depth && typeof value === 'function') {
                endIdx = currentDepth === depth ? arguments.length : idx + value.length;
                value = value.apply(this, _slice(arguments, idx, endIdx));
                currentDepth += 1;
                idx = endIdx;
            }
            return value;
        });
    });

    /**
     * Combines two lists into a set (i.e. no duplicates) composed of the elements of each list.  Duplication is
     * determined according to the value returned by applying the supplied predicate to two list elements.
     *
     * @func
     * @memberOf R
     * @category Relation
     * @sig (a,a -> Boolean) -> [a] -> [a] -> [a]
     * @param {Function} pred A predicate used to test whether two items are equal.
     * @param {Array} list1 The first list.
     * @param {Array} list2 The second list.
     * @return {Array} The first and second lists concatenated, with
     *         duplicates removed.
     * @see R.union
     * @example
     *
     *      function cmp(x, y) { return x.a === y.a; }
     *      var l1 = [{a: 1}, {a: 2}];
     *      var l2 = [{a: 1}, {a: 4}];
     *      R.unionWith(cmp, l1, l2); //=> [{a: 1}, {a: 2}, {a: 4}]
     */
    var unionWith = _curry3(function unionWith(pred, list1, list2) {
        return uniqWith(pred, _concat(list1, list2));
    });

    /**
     * Returns a new list by pulling every item at the first level of nesting out, and putting
     * them in a new array.
     *
     * @func
     * @memberOf R
     * @category List
     * @sig [a] -> [b]
     * @param {Array} list The array to consider.
     * @return {Array} The flattened list.
     * @example
     *
     *      R.unnest([1, [2], [[3]]]); //=> [1, 2, [3]]
     *      R.unnest([[1, 2], [3, 4], [5, 6]]); //=> [1, 2, 3, 4, 5, 6]
     */
    var unnest = _curry1(_makeFlat(false));

    /**
     * Takes a spec object and a test object; returns true if the test satisfies
     * the spec, false otherwise. An object satisfies the spec if, for each of the
     * spec's own properties, accessing that property of the object gives the same
     * value (in `R.equals` terms) as accessing that property of the spec.
     *
     * `whereEq` is a specialization of [`where`](#where).
     *
     * @func
     * @memberOf R
     * @category Object
     * @sig {String: *} -> {String: *} -> Boolean
     * @param {Object} spec
     * @param {Object} testObj
     * @return {Boolean}
     * @see R.where
     * @example
     *
     *      // pred :: Object -> Boolean
     *      var pred = R.whereEq({a: 1, b: 2});
     *
     *      pred({a: 1});              //=> false
     *      pred({a: 1, b: 2});        //=> true
     *      pred({a: 1, b: 2, c: 3});  //=> true
     *      pred({a: 1, b: 1});        //=> false
     */
    var whereEq = _curry2(function whereEq(spec, testObj) {
        return where(mapObj(equals, spec), testObj);
    });

    /**
     * Wrap a function inside another to allow you to make adjustments to the parameters, or do
     * other processing either before the internal function is called or with its results.
     *
     * @func
     * @memberOf R
     * @category Function
     * @sig (a... -> b) -> ((a... -> b) -> a... -> c) -> (a... -> c)
     * @param {Function} fn The function to wrap.
     * @param {Function} wrapper The wrapper function.
     * @return {Function} The wrapped function.
     * @example
     *
     *      var greet = function(name) {return 'Hello ' + name;};
     *
     *      var shoutedGreet = R.wrap(greet, function(gr, name) {
     *        return gr(name).toUpperCase();
     *      });
     *      shoutedGreet("Kathy"); //=> "HELLO KATHY"
     *
     *      var shortenedGreet = R.wrap(greet, function(gr, name) {
     *        return gr(name.substring(0, 3));
     *      });
     *      shortenedGreet("Robert"); //=> "Hello Rob"
     */
    var wrap = _curry2(function wrap(fn, wrapper) {
        return curryN(fn.length, function () {
            return wrapper.apply(this, _concat([fn], arguments));
        });
    });

    var _chain = _curry2(function _chain(f, list) {
        return unnest(map(f, list));
    });

    var _flatCat = function () {
        var preservingReduced = function (xf) {
            return {
                '@@transducer/init': _xfBase.init,
                '@@transducer/result': function (result) {
                    return xf['@@transducer/result'](result);
                },
                '@@transducer/step': function (result, input) {
                    var ret = xf['@@transducer/step'](result, input);
                    return ret['@@transducer/reduced'] ? _forceReduced(ret) : ret;
                }
            };
        };
        return function _xcat(xf) {
            var rxf = preservingReduced(xf);
            return {
                '@@transducer/init': _xfBase.init,
                '@@transducer/result': function (result) {
                    return rxf['@@transducer/result'](result);
                },
                '@@transducer/step': function (result, input) {
                    return !isArrayLike(input) ? _reduce(rxf, result, [input]) : _reduce(rxf, result, input);
                }
            };
        };
    }();

    var _indexOf = function _indexOf(list, item, from) {
        var idx = 0;
        if (typeof from === 'number') {
            idx = from < 0 ? Math.max(0, list.length + from) : from;
        }
        while (idx < list.length) {
            if (equals(list[idx], item)) {
                return idx;
            }
            idx += 1;
        }
        return -1;
    };

    var _lastIndexOf = function _lastIndexOf(list, item, from) {
        var idx;
        if (typeof from === 'number') {
            idx = from < 0 ? list.length + from : Math.min(list.length - 1, from);
        } else {
            idx = list.length - 1;
        }
        while (idx >= 0) {
            if (equals(list[idx], item)) {
                return idx;
            }
            idx -= 1;
        }
        return -1;
    };

    var _pluck = function _pluck(p, list) {
        return map(prop(p), list);
    };

    /**
     * Create a predicate wrapper which will call a pick function (all/any) for each predicate
     *
     * @private
     * @see R.all
     * @see R.any
     */
    // Call function immediately if given arguments
    // Return a function which will call the predicates with the provided arguments
    var _predicateWrap = function _predicateWrap(predPicker) {
        return function (preds) {
            var predIterator = function () {
                var args = arguments;
                return predPicker(function (predicate) {
                    return predicate.apply(null, args);
                }, preds);
            };
            return arguments.length > 1 ? // Call function immediately if given arguments
            predIterator.apply(null, _slice(arguments, 1)) : // Return a function which will call the predicates with the provided arguments
            arity(max(_pluck('length', preds)), predIterator);
        };
    };

    var _stepCat = function () {
        var _stepCatArray = {
            '@@transducer/init': Array,
            '@@transducer/step': function (xs, x) {
                return _concat(xs, [x]);
            },
            '@@transducer/result': _identity
        };
        var _stepCatString = {
            '@@transducer/init': String,
            '@@transducer/step': _add,
            '@@transducer/result': _identity
        };
        var _stepCatObject = {
            '@@transducer/init': Object,
            '@@transducer/step': function (result, input) {
                return merge(result, isArrayLike(input) ? _createMapEntry(input[0], input[1]) : input);
            },
            '@@transducer/result': _identity
        };
        return function _stepCat(obj) {
            if (_isTransformer(obj)) {
                return obj;
            }
            if (isArrayLike(obj)) {
                return _stepCatArray;
            }
            if (typeof obj === 'string') {
                return _stepCatString;
            }
            if (typeof obj === 'object') {
                return _stepCatObject;
            }
            throw new Error('Cannot create transformer for ' + obj);
        };
    }();

    // Function, RegExp, user-defined types
    var _toString = function _toString(x, seen) {
        var recur = function recur(y) {
            var xs = seen.concat([x]);
            return _indexOf(xs, y) >= 0 ? '<Circular>' : _toString(y, xs);
        };
        switch (Object.prototype.toString.call(x)) {
        case '[object Arguments]':
            return '(function() { return arguments; }(' + _map(recur, x).join(', ') + '))';
        case '[object Array]':
            return '[' + _map(recur, x).join(', ') + ']';
        case '[object Boolean]':
            return typeof x === 'object' ? 'new Boolean(' + recur(x.valueOf()) + ')' : x.toString();
        case '[object Date]':
            return 'new Date(' + _quote(_toISOString(x)) + ')';
        case '[object Null]':
            return 'null';
        case '[object Number]':
            return typeof x === 'object' ? 'new Number(' + recur(x.valueOf()) + ')' : 1 / x === -Infinity ? '-0' : x.toString(10);
        case '[object String]':
            return typeof x === 'object' ? 'new String(' + recur(x.valueOf()) + ')' : _quote(x);
        case '[object Undefined]':
            return 'undefined';
        default:
            return typeof x.constructor === 'function' && x.constructor.name !== 'Object' && typeof x.toString === 'function' && x.toString() !== '[object Object]' ? x.toString() : // Function, RegExp, user-defined types
            '{' + _map(function (k) {
                return _quote(k) + ': ' + recur(x[k]);
            }, keys(x).sort()).join(', ') + '}';
        }
    };

    var _xchain = _curry2(function _xchain(f, xf) {
        return map(f, _flatCat(xf));
    });

    /**
     * Creates a new list iteration function from an existing one by adding two new parameters
     * to its callback function: the current index, and the entire list.
     *
     * This would turn, for instance, Ramda's simple `map` function into one that more closely
     * resembles `Array.prototype.map`.  Note that this will only work for functions in which
     * the iteration callback function is the first parameter, and where the list is the last
     * parameter.  (This latter might be unimportant if the list parameter is not used.)
     *
     * @func
     * @memberOf R
     * @category Function
     * @category List
     * @sig ((a ... -> b) ... -> [a] -> *) -> (a ..., Int, [a] -> b) ... -> [a] -> *)
     * @param {Function} fn A list iteration function that does not pass index/list to its callback
     * @return An altered list iteration function thats passes index/list to its callback
     * @example
     *
     *      var mapIndexed = R.addIndex(R.map);
     *      mapIndexed(function(val, idx) {return idx + '-' + val;}, ['f', 'o', 'o', 'b', 'a', 'r']);
     *      //=> ['0-f', '1-o', '2-o', '3-b', '4-a', '5-r']
     */
    var addIndex = _curry1(function (fn) {
        return curryN(fn.length, function () {
            var idx = 0;
            var origFn = arguments[0];
            var list = arguments[arguments.length - 1];
            var indexedFn = function () {
                var result = origFn.apply(this, _concat(arguments, [
                    idx,
                    list
                ]));
                idx += 1;
                return result;
            };
            return fn.apply(this, _prepend(indexedFn, _slice(arguments, 1)));
        });
    });

    /**
     * ap applies a list of functions to a list of values.
     *
     * @func
     * @memberOf R
     * @category Function
     * @sig [f] -> [a] -> [f a]
     * @param {Array} fns An array of functions
     * @param {Array} vs An array of values
     * @return {Array} An array of results of applying each of `fns` to all of `vs` in turn.
     * @example
     *
     *      R.ap([R.multiply(2), R.add(3)], [1,2,3]); //=> [2, 4, 6, 4, 5, 6]
     */
    var ap = _curry2(function ap(fns, vs) {
        return _hasMethod('ap', fns) ? fns.ap(vs) : _reduce(function (acc, fn) {
            return _concat(acc, map(fn, vs));
        }, [], fns);
    });

    /**
     * `chain` maps a function over a list and concatenates the results.
     * This implementation is compatible with the
     * Fantasy-land Chain spec, and will work with types that implement that spec.
     * `chain` is also known as `flatMap` in some libraries
     *
     * @func
     * @memberOf R
     * @category List
     * @sig (a -> [b]) -> [a] -> [b]
     * @param {Function} fn
     * @param {Array} list
     * @return {Array}
     * @example
     *
     *      var duplicate = function(n) {
     *        return [n, n];
     *      };
     *      R.chain(duplicate, [1, 2, 3]); //=> [1, 1, 2, 2, 3, 3]
     */
    var chain = _curry2(_dispatchable('chain', _xchain, _chain));

    /**
     * Turns a list of Functors into a Functor of a list, applying
     * a mapping function to the elements of the list along the way.
     *
     * Note: `commuteMap` may be more useful to convert a list of non-Array Functors (e.g.
     * Maybe, Either, etc.) to Functor of a list.
     *
     * @func
     * @memberOf R
     * @category List
     * @see R.commute
     * @sig (a -> (b -> c)) -> (x -> [x]) -> [[*]...]
     * @param {Function} fn The transformation function
     * @param {Function} of A function that returns the data type to return
     * @param {Array} list An Array (or other Functor) of Arrays (or other Functors)
     * @return {Array}
     * @example
     *
     *      var plus10map = R.map(function(x) { return x + 10; });
     *      var as = [[1], [3, 4]];
     *      R.commuteMap(R.map(function(x) { return x + 10; }), R.of, as); //=> [[11, 13], [11, 14]]
     *
     *      var bs = [[1, 2], [3]];
     *      R.commuteMap(plus10map, R.of, bs); //=> [[11, 13], [12, 13]]
     *
     *      var cs = [[1, 2], [3, 4]];
     *      R.commuteMap(plus10map, R.of, cs); //=> [[11, 13], [12, 13], [11, 14], [12, 14]]
     */
    var commuteMap = _curry3(function commuteMap(fn, of, list) {
        function consF(acc, ftor) {
            return ap(map(append, fn(ftor)), acc);
        }
        return _reduce(consF, of([]), list);
    });

    /**
     * Returns a curried equivalent of the provided function. The curried
     * function has two unusual capabilities. First, its arguments needn't
     * be provided one at a time. If `f` is a ternary function and `g` is
     * `R.curry(f)`, the following are equivalent:
     *
     *   - `g(1)(2)(3)`
     *   - `g(1)(2, 3)`
     *   - `g(1, 2)(3)`
     *   - `g(1, 2, 3)`
     *
     * Secondly, the special placeholder value `R.__` may be used to specify
     * "gaps", allowing partial application of any combination of arguments,
     * regardless of their positions. If `g` is as above and `_` is `R.__`,
     * the following are equivalent:
     *
     *   - `g(1, 2, 3)`
     *   - `g(_, 2, 3)(1)`
     *   - `g(_, _, 3)(1)(2)`
     *   - `g(_, _, 3)(1, 2)`
     *   - `g(_, 2)(1)(3)`
     *   - `g(_, 2)(1, 3)`
     *   - `g(_, 2)(_, 3)(1)`
     *
     * @func
     * @memberOf R
     * @category Function
     * @sig (* -> a) -> (* -> a)
     * @param {Function} fn The function to curry.
     * @return {Function} A new, curried function.
     * @see R.curryN
     * @example
     *
     *      var addFourNumbers = function(a, b, c, d) {
     *        return a + b + c + d;
     *      };
     *
     *      var curriedAddFourNumbers = R.curry(addFourNumbers);
     *      var f = curriedAddFourNumbers(1, 2);
     *      var g = f(3);
     *      g(4); //=> 10
     */
    var curry = _curry1(function curry(fn) {
        return curryN(fn.length, fn);
    });

    /**
     * Returns a list containing all but the first `n` elements of the given `list`.
     *
     * Acts as a transducer if a transformer is given in list position.
     * @see R.transduce
     *
     * @func
     * @memberOf R
     * @category List
     * @sig Number -> [a] -> [a]
     * @param {Number} n The number of elements of `xs` to skip.
     * @param {Array} xs The collection to consider.
     * @return {Array}
     * @example
     *
     *      R.drop(3, [1,2,3,4,5,6,7]); //=> [4,5,6,7]
     */
    var drop = _curry2(_dispatchable('drop', _xdrop, function drop(n, xs) {
        return slice(Math.max(0, n), Infinity, xs);
    }));

    /**
     * Returns a new list without any consecutively repeating elements. Equality is
     * determined by applying the supplied predicate two consecutive elements.
     * The first element in a series of equal element is the one being preserved.
     *
     * Acts as a transducer if a transformer is given in list position.
     * @see R.transduce
     *
     * @func
     * @memberOf R
     * @category List
     * @sig (a, a -> Boolean) -> [a] -> [a]
     * @param {Function} pred A predicate used to test whether two items are equal.
     * @param {Array} list The array to consider.
     * @return {Array} `list` without repeating elements.
     * @example
     *
     *      function lengthEq(x, y) { return Math.abs(x) === Math.abs(y); };
     *      var l = [1, -1, 1, 3, 4, -4, -4, -5, 5, 3, 3];
     *      R.dropRepeatsWith(lengthEq, l); //=> [1, 3, 4, -5, 3]
     */
    var dropRepeatsWith = _curry2(_dispatchable('dropRepeatsWith', _xdropRepeatsWith, function dropRepeatsWith(pred, list) {
        var result = [];
        var idx = 1;
        if (list.length > 0) {
            result[0] = list[0];
            while (idx < list.length) {
                if (!pred(last(result), list[idx])) {
                    result[result.length] = list[idx];
                }
                idx += 1;
            }
        }
        return result;
    }));

    /**
     * Reports whether two objects have the same value, in `R.equals` terms,
     * for the specified property. Useful as a curried predicate.
     *
     * @func
     * @memberOf R
     * @category Object
     * @sig k -> {k: v} -> {k: v} -> Boolean
     * @param {String} prop The name of the property to compare
     * @param {Object} obj1
     * @param {Object} obj2
     * @return {Boolean}
     *
     * @example
     *
     *      var o1 = { a: 1, b: 2, c: 3, d: 4 };
     *      var o2 = { a: 10, b: 20, c: 3, d: 40 };
     *      R.eqProps('a', o1, o2); //=> false
     *      R.eqProps('c', o1, o2); //=> true
     */
    var eqProps = _curry3(function eqProps(prop, obj1, obj2) {
        return equals(obj1[prop], obj2[prop]);
    });

    /**
     * Returns a new function much like the supplied one, except that the first two arguments'
     * order is reversed.
     *
     * @func
     * @memberOf R
     * @category Function
     * @sig (a -> b -> c -> ... -> z) -> (b -> a -> c -> ... -> z)
     * @param {Function} fn The function to invoke with its first two parameters reversed.
     * @return {*} The result of invoking `fn` with its first two parameters' order reversed.
     * @example
     *
     *      var mergeThree = function(a, b, c) {
     *        return ([]).concat(a, b, c);
     *      };
     *
     *      mergeThree(1, 2, 3); //=> [1, 2, 3]
     *
     *      R.flip(mergeThree)(1, 2, 3); //=> [2, 1, 3]
     */
    var flip = _curry1(function flip(fn) {
        return curry(function (a, b) {
            var args = _slice(arguments);
            args[0] = b;
            args[1] = a;
            return fn.apply(this, args);
        });
    });

    /**
     * Returns the position of the first occurrence of an item in an array,
     * or -1 if the item is not included in the array. `R.equals` is used to
     * determine equality.
     *
     * @func
     * @memberOf R
     * @category List
     * @sig a -> [a] -> Number
     * @param {*} target The item to find.
     * @param {Array} xs The array to search in.
     * @return {Number} the index of the target, or -1 if the target is not found.
     *
     * @example
     *
     *      R.indexOf(3, [1,2,3,4]); //=> 2
     *      R.indexOf(10, [1,2,3,4]); //=> -1
     */
    var indexOf = _curry2(function indexOf(target, xs) {
        return _hasMethod('indexOf', xs) ? xs.indexOf(target) : _indexOf(xs, target);
    });

    /**
     * Returns all but the last element of a list.
     *
     * @func
     * @memberOf R
     * @category List
     * @sig [a] -> [a]
     * @param {Array} list The array to consider.
     * @return {Array} A new array containing all but the last element of the input list, or an
     *         empty list if the input list is empty.
     * @example
     *
     *      R.init(['fi', 'fo', 'fum']); //=> ['fi', 'fo']
     */
    var init = slice(0, -1);

    /**
     * Transforms the items of the list with the transducer and appends the transformed items to
     * the accumulator using an appropriate iterator function based on the accumulator type.
     *
     * The accumulator can be an array, string, object or a transformer. Iterated items will
     * be appended to arrays and concatenated to strings. Objects will be merged directly or 2-item
     * arrays will be merged as key, value pairs.
     *
     * The accumulator can also be a transformer object that provides a 2-arity reducing iterator
     * function, step, 0-arity initial value function, init, and 1-arity result extraction function
     * result. The step function is used as the iterator function in reduce. The result function is
     * used to convert the final accumulator into the return type and in most cases is R.identity.
     * The init function is used to provide the initial accumulator.
     *
     * The iteration is performed with R.reduce after initializing the transducer.
     *
     * @func
     * @memberOf R
     * @category List
     * @sig a -> (b -> b) -> [c] -> a
     * @param {*} acc The initial accumulator value.
     * @param {Function} xf The transducer function. Receives a transformer and returns a transformer.
     * @param {Array} list The list to iterate over.
     * @return {*} The final, accumulated value.
     * @example
     *
     *      var numbers = [1, 2, 3, 4];
     *      var transducer = R.compose(R.map(R.add(1)), R.take(2));
     *
     *      R.into([], transducer, numbers); //=> [2, 3]
     *
     *      var intoArray = R.into([]);
     *      intoArray(transducer, numbers); //=> [2, 3]
     */
    var into = _curry3(function into(acc, xf, list) {
        return _isTransformer(acc) ? _reduce(xf(acc), acc['@@transducer/init'](), list) : _reduce(xf(_stepCat(acc)), acc, list);
    });

    /**
     * Returns the result of applying `obj[methodName]` to `args`.
     *
     * @func
     * @memberOf R
     * @category Object
     * @sig String -> [*] -> Object -> *
     * @param {String} methodName
     * @param {Array} args
     * @param {Object} obj
     * @return {*}
     * @deprecated since v0.15.0
     * @example
     *
     *      //  toBinary :: Number -> String
     *      var toBinary = R.invoke('toString', [2])
     *
     *      toBinary(42); //=> '101010'
     *      toBinary(63); //=> '111111'
     */
    var invoke = curry(function invoke(methodName, args, obj) {
        return obj[methodName].apply(obj, args);
    });

    /**
     * Returns `true` if all elements are unique, in `R.equals` terms,
     * otherwise `false`.
     *
     * @func
     * @memberOf R
     * @category List
     * @sig [a] -> Boolean
     * @param {Array} list The array to consider.
     * @return {Boolean} `true` if all elements are unique, else `false`.
     * @example
     *
     *      R.isSet(['1', 1]); //=> true
     *      R.isSet([1, 1]);   //=> false
     *      R.isSet([[42], [42]]); //=> false
     */
    var isSet = _curry1(function isSet(list) {
        var idx = 0;
        while (idx < list.length) {
            if (_indexOf(list, list[idx], idx + 1) >= 0) {
                return false;
            }
            idx += 1;
        }
        return true;
    });

    /**
     * Returns the position of the last occurrence of an item in
     * an array, or -1 if the item is not included in the array.
     * `R.equals` is used to determine equality.
     *
     * @func
     * @memberOf R
     * @category List
     * @sig a -> [a] -> Number
     * @param {*} target The item to find.
     * @param {Array} xs The array to search in.
     * @return {Number} the index of the target, or -1 if the target is not found.
     *
     * @example
     *
     *      R.lastIndexOf(3, [-1,3,3,0,1,2,3,4]); //=> 6
     *      R.lastIndexOf(10, [1,2,3,4]); //=> -1
     */
    var lastIndexOf = _curry2(function lastIndexOf(target, xs) {
        return _hasMethod('lastIndexOf', xs) ? xs.lastIndexOf(target) : _lastIndexOf(xs, target);
    });

    /**
     * "lifts" a function to be the specified arity, so that it may "map over" that many
     * lists (or other Functors).
     *
     * @func
     * @memberOf R
     * @see R.lift
     * @category Function
     * @sig Number -> (*... -> *) -> ([*]... -> [*])
     * @param {Function} fn The function to lift into higher context
     * @return {Function} The function `fn` applicable to mappable objects.
     * @example
     *
     *      var madd3 = R.liftN(3, R.curryN(3, function() {
     *        return R.reduce(R.add, 0, arguments);
     *      }));
     *      madd3([1,2,3], [1,2,3], [1]); //=> [3, 4, 5, 4, 5, 6, 5, 6, 7]
     */
    var liftN = _curry2(function liftN(arity, fn) {
        var lifted = curryN(arity, fn);
        return curryN(arity, function () {
            return _reduce(ap, map(lifted, arguments[0]), _slice(arguments, 1));
        });
    });

    /**
     * Returns the mean of the given list of numbers.
     *
     * @func
     * @memberOf R
     * @category Math
     * @sig [Number] -> Number
     * @param {Array} list
     * @return {Number}
     * @example
     *
     *      R.mean([2, 7, 9]); //=> 6
     *      R.mean([]); //=> NaN
     */
    var mean = _curry1(function mean(list) {
        return sum(list) / list.length;
    });

    /**
     * Returns the median of the given list of numbers.
     *
     * @func
     * @memberOf R
     * @category Math
     * @sig [Number] -> Number
     * @param {Array} list
     * @return {Number}
     * @example
     *
     *      R.median([2, 9, 7]); //=> 7
     *      R.median([7, 2, 10, 9]); //=> 8
     *      R.median([]); //=> NaN
     */
    var median = _curry1(function median(list) {
        if (list.length === 0) {
            return NaN;
        }
        var width = 2 - list.length % 2;
        var idx = (list.length - width) / 2;
        return mean(_slice(list).sort(function (a, b) {
            return a < b ? -1 : a > b ? 1 : 0;
        }).slice(idx, idx + width));
    });

    /**
     * Merges a list of objects together into one object.
     *
     * @func
     * @memberOf R
     * @category List
     * @sig [{k: v}] -> {k: v}
     * @param {Array} list An array of objects
     * @return {Object} A merged object.
     * @see R.reduce
     * @example
     *
     *      R.mergeAll([{foo:1},{bar:2},{baz:3}]); //=> {foo:1,bar:2,baz:3}
     *      R.mergeAll([{foo:1},{foo:2},{bar:2}]); //=> {foo:2,bar:2}
     */
    var mergeAll = _curry1(function mergeAll(list) {
        return reduce(merge, {}, list);
    });

    /**
     * Returns a partial copy of an object omitting the keys specified.
     *
     * @func
     * @memberOf R
     * @category Object
     * @sig [String] -> {String: *} -> {String: *}
     * @param {Array} names an array of String property names to omit from the new object
     * @param {Object} obj The object to copy from
     * @return {Object} A new object with properties from `names` not on it.
     * @example
     *
     *      R.omit(['a', 'd'], {a: 1, b: 2, c: 3, d: 4}); //=> {b: 2, c: 3}
     */
    var omit = _curry2(function omit(names, obj) {
        var result = {};
        for (var prop in obj) {
            if (_indexOf(names, prop) < 0) {
                result[prop] = obj[prop];
            }
        }
        return result;
    });

    /**
     * Accepts as its arguments a function and any number of values and returns a function that,
     * when invoked, calls the original function with all of the values prepended to the
     * original function's arguments list. In some libraries this function is named `applyLeft`.
     *
     * @func
     * @memberOf R
     * @category Function
     * @sig (a -> b -> ... -> i -> j -> ... -> m -> n) -> a -> b-> ... -> i -> (j -> ... -> m -> n)
     * @param {Function} fn The function to invoke.
     * @param {...*} [args] Arguments to prepend to `fn` when the returned function is invoked.
     * @return {Function} A new function wrapping `fn`. When invoked, it will call `fn`
     *         with `args` prepended to `fn`'s arguments list.
     * @example
     *
     *      var multiply = function(a, b) { return a * b; };
     *      var double = R.partial(multiply, 2);
     *      double(2); //=> 4
     *
     *      var greet = function(salutation, title, firstName, lastName) {
     *        return salutation + ', ' + title + ' ' + firstName + ' ' + lastName + '!';
     *      };
     *      var sayHello = R.partial(greet, 'Hello');
     *      var sayHelloToMs = R.partial(sayHello, 'Ms.');
     *      sayHelloToMs('Jane', 'Jones'); //=> 'Hello, Ms. Jane Jones!'
     */
    var partial = curry(_createPartialApplicator(_concat));

    /**
     * Accepts as its arguments a function and any number of values and returns a function that,
     * when invoked, calls the original function with all of the values appended to the original
     * function's arguments list.
     *
     * Note that `partialRight` is the opposite of `partial`: `partialRight` fills `fn`'s arguments
     * from the right to the left.  In some libraries this function is named `applyRight`.
     *
     * @func
     * @memberOf R
     * @category Function
     * @sig (a -> b-> ... -> i -> j -> ... -> m -> n) -> j -> ... -> m -> n -> (a -> b-> ... -> i)
     * @param {Function} fn The function to invoke.
     * @param {...*} [args] Arguments to append to `fn` when the returned function is invoked.
     * @return {Function} A new function wrapping `fn`. When invoked, it will call `fn` with
     *         `args` appended to `fn`'s arguments list.
     * @example
     *
     *      var greet = function(salutation, title, firstName, lastName) {
     *        return salutation + ', ' + title + ' ' + firstName + ' ' + lastName + '!';
     *      };
     *      var greetMsJaneJones = R.partialRight(greet, 'Ms.', 'Jane', 'Jones');
     *
     *      greetMsJaneJones('Hello'); //=> 'Hello, Ms. Jane Jones!'
     */
    var partialRight = curry(_createPartialApplicator(flip(_concat)));

    /**
     * Returns a new list by plucking the same named property off all objects in the list supplied.
     *
     * @func
     * @memberOf R
     * @category List
     * @sig k -> [{k: v}] -> [v]
     * @param {Number|String} key The key name to pluck off of each object.
     * @param {Array} list The array to consider.
     * @return {Array} The list of values for the given key.
     * @example
     *
     *      R.pluck('a')([{a: 1}, {a: 2}]); //=> [1, 2]
     *      R.pluck(0)([[1, 2], [3, 4]]);   //=> [1, 3]
     */
    var pluck = _curry2(_pluck);

    /**
     * Multiplies together all the elements of a list.
     *
     * @func
     * @memberOf R
     * @category Math
     * @sig [Number] -> Number
     * @param {Array} list An array of numbers
     * @return {Number} The product of all the numbers in the list.
     * @see R.reduce
     * @example
     *
     *      R.product([2,4,6,8,100,1]); //=> 38400
     */
    var product = reduce(_multiply, 1);

    /**
     * Returns the string representation of the given value. `eval`'ing the output
     * should result in a value equivalent to the input value. Many of the built-in
     * `toString` methods do not satisfy this requirement.
     *
     * If the given value is an `[object Object]` with a `toString` method other
     * than `Object.prototype.toString`, this method is invoked with no arguments
     * to produce the return value. This means user-defined constructor functions
     * can provide a suitable `toString` method. For example:
     *
     *     function Point(x, y) {
     *       this.x = x;
     *       this.y = y;
     *     }
     *
     *     Point.prototype.toString = function() {
     *       return 'new Point(' + this.x + ', ' + this.y + ')';
     *     };
     *
     *     R.toString(new Point(1, 2)); //=> 'new Point(1, 2)'
     *
     * @func
     * @memberOf R
     * @category String
     * @sig * -> String
     * @param {*} val
     * @return {String}
     * @example
     *
     *      R.toString(42); //=> '42'
     *      R.toString('abc'); //=> '"abc"'
     *      R.toString([1, 2, 3]); //=> '[1, 2, 3]'
     *      R.toString({foo: 1, bar: 2, baz: 3}); //=> '{"bar": 2, "baz": 3, "foo": 1}'
     *      R.toString(new Date('2001-02-03T04:05:06Z')); //=> 'new Date("2001-02-03T04:05:06.000Z")'
     */
    var toString = _curry1(function toString(val) {
        return _toString(val, []);
    });

    /**
     * Accepts a function `fn` and any number of transformer functions and returns a new
     * function. When the new function is invoked, it calls the function `fn` with parameters
     * consisting of the result of calling each supplied handler on successive arguments to the
     * new function.
     *
     * If more arguments are passed to the returned function than transformer functions, those
     * arguments are passed directly to `fn` as additional parameters. If you expect additional
     * arguments that don't need to be transformed, although you can ignore them, it's best to
     * pass an identity function so that the new function reports the correct arity.
     *
     * @func
     * @memberOf R
     * @category Function
     * @sig (x1 -> x2 -> ... -> z) -> ((a -> x1), (b -> x2), ...) -> (a -> b -> ... -> z)
     * @param {Function} fn The function to wrap.
     * @param {...Function} transformers A variable number of transformer functions
     * @return {Function} The wrapped function.
     * @example
     *
     *      // Example 1:
     *
     *      // Number -> [Person] -> [Person]
     *      var byAge = R.useWith(R.filter, R.propEq('age'), R.identity);
     *
     *      var kids = [
     *        {name: 'Abbie', age: 6},
     *        {name: 'Brian', age: 5},
     *        {name: 'Chris', age: 6},
     *        {name: 'David', age: 4},
     *        {name: 'Ellie', age: 5}
     *      ];
     *
     *      byAge(5, kids); //=> [{name: 'Brian', age: 5}, {name: 'Ellie', age: 5}]
     *
     *      // Example 2:
     *
     *      var double = function(y) { return y * 2; };
     *      var square = function(x) { return x * x; };
     *      var add = function(a, b) { return a + b; };
     *      // Adds any number of arguments together
     *      var addAll = function() {
     *        return R.reduce(add, 0, arguments);
     *      };
     *
     *      // Basic example
     *      var addDoubleAndSquare = R.useWith(addAll, double, square);
     *
     *      //≅ addAll(double(10), square(5));
     *      addDoubleAndSquare(10, 5); //=> 45
     *
     *      // Example of passing more arguments than transformers
     *      //≅ addAll(double(10), square(5), 100);
     *      addDoubleAndSquare(10, 5, 100); //=> 145
     *
     *      // If there are extra _expected_ arguments that don't need to be transformed, although
     *      // you can ignore them, it might be best to pass in the identity function so that the new
     *      // function correctly reports arity.
     *      var addDoubleAndSquareWithExtraParams = R.useWith(addAll, double, square, R.identity);
     *      // addDoubleAndSquareWithExtraParams.length //=> 3
     *      //≅ addAll(double(10), square(5), R.identity(100));
     *      addDoubleAndSquare(10, 5, 100); //=> 145
     */
    /*, transformers */
    var useWith = curry(function useWith(fn) {
        var transformers = _slice(arguments, 1);
        return curry(arity(transformers.length, function () {
            var args = [], idx = 0;
            while (idx < transformers.length) {
                args[idx] = transformers[idx](arguments[idx]);
                idx += 1;
            }
            return fn.apply(this, args.concat(_slice(arguments, transformers.length)));
        }));
    });

    var _contains = function _contains(a, list) {
        return _indexOf(list, a) >= 0;
    };

    /**
     * Given a list of predicates, returns a new predicate that will be true exactly when all of them are.
     *
     * @func
     * @memberOf R
     * @category Logic
     * @sig [(*... -> Boolean)] -> (*... -> Boolean)
     * @param {Array} list An array of predicate functions
     * @param {*} optional Any arguments to pass into the predicates
     * @return {Function} a function that applies its arguments to each of
     *         the predicates, returning `true` if all are satisfied.
     * @example
     *
     *      var gt10 = function(x) { return x > 10; };
     *      var even = function(x) { return x % 2 === 0};
     *      var f = R.allPass([gt10, even]);
     *      f(11); //=> false
     *      f(12); //=> true
     */
    var allPass = curry(_predicateWrap(_all));

    /**
     * Given a list of predicates returns a new predicate that will be true exactly when any one of them is.
     *
     * @func
     * @memberOf R
     * @category Logic
     * @sig [(*... -> Boolean)] -> (*... -> Boolean)
     * @param {Array} list An array of predicate functions
     * @param {*} optional Any arguments to pass into the predicates
     * @return {Function} A function that applies its arguments to each of the predicates, returning
     *         `true` if all are satisfied.
     * @example
     *
     *      var gt10 = function(x) { return x > 10; };
     *      var even = function(x) { return x % 2 === 0};
     *      var f = R.anyPass([gt10, even]);
     *      f(11); //=> true
     *      f(8); //=> true
     *      f(9); //=> false
     */
    var anyPass = curry(_predicateWrap(_any));

    /**
     * Returns the result of calling its first argument with the remaining
     * arguments. This is occasionally useful as a converging function for
     * `R.converge`: the left branch can produce a function while the right
     * branch produces a value to be passed to that function as an argument.
     *
     * @func
     * @memberOf R
     * @category Function
     * @sig (*... -> a),*... -> a
     * @param {Function} fn The function to apply to the remaining arguments.
     * @param {...*} args Any number of positional arguments.
     * @return {*}
     * @example
     *
     *      var indentN = R.pipe(R.times(R.always(' ')),
     *                           R.join(''),
     *                           R.replace(/^(?!$)/gm));
     *
     *      var format = R.converge(R.call,
     *                              R.pipe(R.prop('indent'), indentN),
     *                              R.prop('value'));
     *
     *      format({indent: 2, value: 'foo\nbar\nbaz\n'}); //=> '  foo\n  bar\n  baz\n'
     */
    var call = curry(function call(fn) {
        return fn.apply(this, _slice(arguments, 1));
    });

    /**
     * Turns a list of Functors into a Functor of a list.
     *
     * Note: `commute` may be more useful to convert a list of non-Array Functors (e.g.
     * Maybe, Either, etc.) to Functor of a list.
     *
     * @func
     * @memberOf R
     * @category List
     * @see R.commuteMap
     * @sig (x -> [x]) -> [[*]...]
     * @param {Function} of A function that returns the data type to return
     * @param {Array} list An Array (or other Functor) of Arrays (or other Functors)
     * @return {Array}
     * @example
     *
     *      var as = [[1], [3, 4]];
     *      R.commute(R.of, as); //=> [[1, 3], [1, 4]]
     *
     *      var bs = [[1, 2], [3]];
     *      R.commute(R.of, bs); //=> [[1, 3], [2, 3]]
     *
     *      var cs = [[1, 2], [3, 4]];
     *      R.commute(R.of, cs); //=> [[1, 3], [2, 3], [1, 4], [2, 4]]
     */
    var commute = commuteMap(map(identity));

    /**
     * Wraps a constructor function inside a curried function that can be called with the same
     * arguments and returns the same type. The arity of the function returned is specified
     * to allow using variadic constructor functions.
     *
     * @func
     * @memberOf R
     * @category Function
     * @sig Number -> (* -> {*}) -> (* -> {*})
     * @param {Number} n The arity of the constructor function.
     * @param {Function} Fn The constructor function to wrap.
     * @return {Function} A wrapped, curried constructor function.
     * @example
     *
     *      // Variadic constructor function
     *      var Widget = function() {
     *        this.children = Array.prototype.slice.call(arguments);
     *        // ...
     *      };
     *      Widget.prototype = {
     *        // ...
     *      };
     *      var allConfigs = [
     *        // ...
     *      ];
     *      R.map(R.constructN(1, Widget), allConfigs); // a list of Widgets
     */
    var constructN = _curry2(function constructN(n, Fn) {
        if (n > 10) {
            throw new Error('Constructor with greater than ten arguments');
        }
        if (n === 0) {
            return function () {
                return new Fn();
            };
        }
        return curry(nAry(n, function ($0, $1, $2, $3, $4, $5, $6, $7, $8, $9) {
            switch (arguments.length) {
            case 1:
                return new Fn($0);
            case 2:
                return new Fn($0, $1);
            case 3:
                return new Fn($0, $1, $2);
            case 4:
                return new Fn($0, $1, $2, $3);
            case 5:
                return new Fn($0, $1, $2, $3, $4);
            case 6:
                return new Fn($0, $1, $2, $3, $4, $5);
            case 7:
                return new Fn($0, $1, $2, $3, $4, $5, $6);
            case 8:
                return new Fn($0, $1, $2, $3, $4, $5, $6, $7);
            case 9:
                return new Fn($0, $1, $2, $3, $4, $5, $6, $7, $8);
            case 10:
                return new Fn($0, $1, $2, $3, $4, $5, $6, $7, $8, $9);
            }
        }));
    });

    /**
     * Returns `true` if the specified value is equal, in `R.equals` terms,
     * to at least one element of the given list; `false` otherwise.
     *
     * @func
     * @memberOf R
     * @category List
     * @sig a -> [a] -> Boolean
     * @param {Object} a The item to compare against.
     * @param {Array} list The array to consider.
     * @return {Boolean} `true` if the item is in the list, `false` otherwise.
     *
     * @example
     *
     *      R.contains(3, [1, 2, 3]); //=> true
     *      R.contains(4, [1, 2, 3]); //=> false
     *      R.contains([42], [[42]]); //=> true
     */
    var contains = _curry2(_contains);

    /**
     * Accepts at least three functions and returns a new function. When invoked, this new
     * function will invoke the first function, `after`, passing as its arguments the
     * results of invoking the subsequent functions with whatever arguments are passed to
     * the new function.
     *
     * @func
     * @memberOf R
     * @category Function
     * @sig (x1 -> x2 -> ... -> z) -> ((a -> b -> ... -> x1), (a -> b -> ... -> x2), ...) -> (a -> b -> ... -> z)
     * @param {Function} after A function. `after` will be invoked with the return values of
     *        `fn1` and `fn2` as its arguments.
     * @param {...Function} functions A variable number of functions.
     * @return {Function} A new function.
     * @example
     *
     *      var add = function(a, b) { return a + b; };
     *      var multiply = function(a, b) { return a * b; };
     *      var subtract = function(a, b) { return a - b; };
     *
     *      //≅ multiply( add(1, 2), subtract(1, 2) );
     *      R.converge(multiply, add, subtract)(1, 2); //=> -3
     *
     *      var add3 = function(a, b, c) { return a + b + c; };
     *      R.converge(add3, multiply, add, subtract)(1, 2); //=> 4
     */
    var converge = curryN(3, function (after) {
        var fns = _slice(arguments, 1);
        return curryN(max(pluck('length', fns)), function () {
            var args = arguments;
            var context = this;
            return after.apply(context, _map(function (fn) {
                return fn.apply(context, args);
            }, fns));
        });
    });

    /**
     * Finds the set (i.e. no duplicates) of all elements in the first list not contained in the second list.
     *
     * @func
     * @memberOf R
     * @category Relation
     * @sig [a] -> [a] -> [a]
     * @param {Array} list1 The first list.
     * @param {Array} list2 The second list.
     * @return {Array} The elements in `list1` that are not in `list2`.
     * @see R.differenceWith
     * @example
     *
     *      R.difference([1,2,3,4], [7,6,5,4,3]); //=> [1,2]
     *      R.difference([7,6,5,4,3], [1,2,3,4]); //=> [7,6,5]
     */
    var difference = _curry2(function difference(first, second) {
        var out = [];
        var idx = 0;
        while (idx < first.length) {
            if (!_contains(first[idx], second) && !_contains(first[idx], out)) {
                out[out.length] = first[idx];
            }
            idx += 1;
        }
        return out;
    });

    /**
     * Returns a new list without any consecutively repeating elements.
     * `R.equals` is used to determine equality.
     *
     * Acts as a transducer if a transformer is given in list position.
     * @see R.transduce
     *
     * @func
     * @memberOf R
     * @category List
     * @sig [a] -> [a]
     * @param {Array} list The array to consider.
     * @return {Array} `list` without repeating elements.
     * @example
     *
     *     R.dropRepeats([1, 1, 1, 2, 3, 4, 4, 2, 2]); //=> [1, 2, 3, 4, 2]
     */
    var dropRepeats = _curry1(_dispatchable('dropRepeats', _xdropRepeatsWith(equals), dropRepeatsWith(equals)));

    /**
     * "lifts" a function of arity > 1 so that it may "map over" an Array or
     * other Functor.
     *
     * @func
     * @memberOf R
     * @see R.liftN
     * @category Function
     * @sig (*... -> *) -> ([*]... -> [*])
     * @param {Function} fn The function to lift into higher context
     * @return {Function} The function `fn` applicable to mappable objects.
     * @example
     *
     *      var madd3 = R.lift(R.curry(function(a, b, c) {
     *        return a + b + c;
     *      }));
     *      madd3([1,2,3], [1,2,3], [1]); //=> [3, 4, 5, 4, 5, 6, 5, 6, 7]
     *
     *      var madd5 = R.lift(R.curry(function(a, b, c, d, e) {
     *        return a + b + c + d + e;
     *      }));
     *      madd5([1,2], [3], [4, 5], [6], [7, 8]); //=> [21, 22, 22, 23, 22, 23, 23, 24]
     */
    var lift = _curry1(function lift(fn) {
        return liftN(fn.length, fn);
    });

    /**
     * Creates a new function that, when invoked, caches the result of calling `fn` for a given
     * argument set and returns the result. Subsequent calls to the memoized `fn` with the same
     * argument set will not result in an additional call to `fn`; instead, the cached result
     * for that set of arguments will be returned.
     *
     * @func
     * @memberOf R
     * @category Function
     * @sig (*... -> a) -> (*... -> a)
     * @param {Function} fn The function to memoize.
     * @return {Function} Memoized version of `fn`.
     * @example
     *
     *      var count = 0;
     *      var factorial = R.memoize(function(n) {
     *        count += 1;
     *        return R.product(R.range(1, n + 1));
     *      });
     *      factorial(5); //=> 120
     *      factorial(5); //=> 120
     *      factorial(5); //=> 120
     *      count; //=> 1
     */
    var memoize = _curry1(function memoize(fn) {
        var cache = {};
        return function () {
            var key = toString(arguments);
            if (!_has(key, cache)) {
                cache[key] = fn.apply(this, arguments);
            }
            return cache[key];
        };
    });

    /**
     * Reasonable analog to SQL `select` statement.
     *
     * @func
     * @memberOf R
     * @category Object
     * @category Relation
     * @sig [k] -> [{k: v}] -> [{k: v}]
     * @param {Array} props The property names to project
     * @param {Array} objs The objects to query
     * @return {Array} An array of objects with just the `props` properties.
     * @example
     *
     *      var abby = {name: 'Abby', age: 7, hair: 'blond', grade: 2};
     *      var fred = {name: 'Fred', age: 12, hair: 'brown', grade: 7};
     *      var kids = [abby, fred];
     *      R.project(['name', 'grade'], kids); //=> [{name: 'Abby', grade: 2}, {name: 'Fred', grade: 7}]
     */
    // passing `identity` gives correct arity
    var project = useWith(_map, pickAll, identity);

    /**
     * Returns a new list containing only one copy of each element in the original list.
     * `R.equals` is used to determine equality.
     *
     * @func
     * @memberOf R
     * @category List
     * @sig [a] -> [a]
     * @param {Array} list The array to consider.
     * @return {Array} The list of unique items.
     * @example
     *
     *      R.uniq([1, 1, 2, 1]); //=> [1, 2]
     *      R.uniq([1, '1']);     //=> [1, '1']
     *      R.uniq([[42], [42]]); //=> [[42]]
     */
    /**
       * Uses a native `Set` instance where possible for
       * removing duplicate items. Items that implement
       * the fantasy-land Setoid spec fallback to using
       * `_contains` to support custom equality behaviour.
       */
    /* global Set */
    // `_contains` is also used to differentiate between
    // +0 and -0, as the native Set does not.
    var uniq = function () {
        /**
       * Uses a native `Set` instance where possible for
       * removing duplicate items. Items that implement
       * the fantasy-land Setoid spec fallback to using
       * `_contains` to support custom equality behaviour.
       */
        function uniq(list) {
            /* global Set */
            var item, set = new Set(), idx = 0, len = list.length, items = [], uniqs = [];
            while (idx < len) {
                item = list[idx];
                // `_contains` is also used to differentiate between
                // +0 and -0, as the native Set does not.
                if (item === 0 || item != null && typeof item.equals === 'function') {
                    if (!_contains(item, items)) {
                        items.push(item);
                        uniqs.push(item);
                    }
                } else {
                    if (set.size !== set.add(item).size) {
                        uniqs.push(item);
                    }
                }
                idx += 1;
            }
            return uniqs;
        }
        return typeof Set !== 'function' ? uniqWith(equals) : _curry1(uniq);
    }();

    /**
     * Wraps a constructor function inside a curried function that can be called with the same
     * arguments and returns the same type.
     *
     * @func
     * @memberOf R
     * @category Function
     * @sig (* -> {*}) -> (* -> {*})
     * @param {Function} Fn The constructor function to wrap.
     * @return {Function} A wrapped, curried constructor function.
     * @example
     *
     *      // Constructor function
     *      var Widget = function(config) {
     *        // ...
     *      };
     *      Widget.prototype = {
     *        // ...
     *      };
     *      var allConfigs = [
     *        // ...
     *      ];
     *      R.map(R.construct(Widget), allConfigs); // a list of Widgets
     */
    var construct = _curry1(function construct(Fn) {
        return constructN(Fn.length, Fn);
    });

    /**
     * Combines two lists into a set (i.e. no duplicates) composed of those elements common to both lists.
     *
     * @func
     * @memberOf R
     * @category Relation
     * @sig [a] -> [a] -> [a]
     * @param {Array} list1 The first list.
     * @param {Array} list2 The second list.
     * @see R.intersectionWith
     * @return {Array} The list of elements found in both `list1` and `list2`.
     * @example
     *
     *      R.intersection([1,2,3,4], [7,6,5,4,3]); //=> [4, 3]
     */
    var intersection = _curry2(function intersection(list1, list2) {
        return uniq(_filter(flip(_contains)(list1), list2));
    });

    /**
     * Combines two lists into a set (i.e. no duplicates) composed of the
     * elements of each list.
     *
     * @func
     * @memberOf R
     * @category Relation
     * @sig [a] -> [a] -> [a]
     * @param {Array} as The first list.
     * @param {Array} bs The second list.
     * @return {Array} The first and second lists concatenated, with
     *         duplicates removed.
     * @example
     *
     *      R.union([1, 2, 3], [2, 3, 4]); //=> [1, 2, 3, 4]
     */
    var union = _curry2(compose(uniq, _concat));

    var R = {
        F: F,
        T: T,
        __: __,
        add: add,
        addIndex: addIndex,
        adjust: adjust,
        all: all,
        allPass: allPass,
        always: always,
        and: and,
        any: any,
        anyPass: anyPass,
        ap: ap,
        aperture: aperture,
        append: append,
        apply: apply,
        arity: arity,
        assoc: assoc,
        assocPath: assocPath,
        binary: binary,
        bind: bind,
        both: both,
        call: call,
        chain: chain,
        clone: clone,
        commute: commute,
        commuteMap: commuteMap,
        comparator: comparator,
        complement: complement,
        compose: compose,
        composeL: composeL,
        composeP: composeP,
        concat: concat,
        cond: cond,
        construct: construct,
        constructN: constructN,
        contains: contains,
        containsWith: containsWith,
        converge: converge,
        countBy: countBy,
        createMapEntry: createMapEntry,
        curry: curry,
        curryN: curryN,
        dec: dec,
        defaultTo: defaultTo,
        difference: difference,
        differenceWith: differenceWith,
        dissoc: dissoc,
        dissocPath: dissocPath,
        divide: divide,
        drop: drop,
        dropRepeats: dropRepeats,
        dropRepeatsWith: dropRepeatsWith,
        dropWhile: dropWhile,
        either: either,
        empty: empty,
        eqProps: eqProps,
        equals: equals,
        evolve: evolve,
        filter: filter,
        filterIndexed: filterIndexed,
        find: find,
        findIndex: findIndex,
        findLast: findLast,
        findLastIndex: findLastIndex,
        flatten: flatten,
        flip: flip,
        forEach: forEach,
        forEachIndexed: forEachIndexed,
        fromPairs: fromPairs,
        functions: functions,
        functionsIn: functionsIn,
        groupBy: groupBy,
        gt: gt,
        gte: gte,
        has: has,
        hasIn: hasIn,
        head: head,
        identical: identical,
        identity: identity,
        ifElse: ifElse,
        inc: inc,
        indexOf: indexOf,
        init: init,
        insert: insert,
        insertAll: insertAll,
        intersection: intersection,
        intersectionWith: intersectionWith,
        intersperse: intersperse,
        into: into,
        invert: invert,
        invertObj: invertObj,
        invoke: invoke,
        invoker: invoker,
        is: is,
        isArrayLike: isArrayLike,
        isEmpty: isEmpty,
        isNil: isNil,
        isSet: isSet,
        join: join,
        keys: keys,
        keysIn: keysIn,
        last: last,
        lastIndexOf: lastIndexOf,
        length: length,
        lens: lens,
        lensIndex: lensIndex,
        lensOn: lensOn,
        lensProp: lensProp,
        lift: lift,
        liftN: liftN,
        lt: lt,
        lte: lte,
        map: map,
        mapAccum: mapAccum,
        mapAccumRight: mapAccumRight,
        mapIndexed: mapIndexed,
        mapObj: mapObj,
        mapObjIndexed: mapObjIndexed,
        match: match,
        mathMod: mathMod,
        max: max,
        maxBy: maxBy,
        mean: mean,
        median: median,
        memoize: memoize,
        merge: merge,
        mergeAll: mergeAll,
        min: min,
        minBy: minBy,
        modulo: modulo,
        multiply: multiply,
        nAry: nAry,
        negate: negate,
        none: none,
        not: not,
        nth: nth,
        nthArg: nthArg,
        nthChar: nthChar,
        nthCharCode: nthCharCode,
        of: of,
        omit: omit,
        once: once,
        or: or,
        partial: partial,
        partialRight: partialRight,
        partition: partition,
        path: path,
        pathEq: pathEq,
        pick: pick,
        pickAll: pickAll,
        pickBy: pickBy,
        pipe: pipe,
        pipeL: pipeL,
        pipeP: pipeP,
        pluck: pluck,
        prepend: prepend,
        product: product,
        project: project,
        prop: prop,
        propEq: propEq,
        propOr: propOr,
        props: props,
        range: range,
        reduce: reduce,
        reduceIndexed: reduceIndexed,
        reduceRight: reduceRight,
        reduceRightIndexed: reduceRightIndexed,
        reduced: reduced,
        reject: reject,
        rejectIndexed: rejectIndexed,
        remove: remove,
        repeat: repeat,
        replace: replace,
        reverse: reverse,
        scan: scan,
        slice: slice,
        sort: sort,
        sortBy: sortBy,
        split: split,
        strIndexOf: strIndexOf,
        strLastIndexOf: strLastIndexOf,
        substring: substring,
        substringFrom: substringFrom,
        substringTo: substringTo,
        subtract: subtract,
        sum: sum,
        tail: tail,
        take: take,
        takeWhile: takeWhile,
        tap: tap,
        test: test,
        times: times,
        toLower: toLower,
        toPairs: toPairs,
        toPairsIn: toPairsIn,
        toString: toString,
        toUpper: toUpper,
        transduce: transduce,
        trim: trim,
        type: type,
        unapply: unapply,
        unary: unary,
        uncurryN: uncurryN,
        unfold: unfold,
        union: union,
        unionWith: unionWith,
        uniq: uniq,
        uniqWith: uniqWith,
        unnest: unnest,
        update: update,
        useWith: useWith,
        values: values,
        valuesIn: valuesIn,
        where: where,
        whereEq: whereEq,
        wrap: wrap,
        xprod: xprod,
        zip: zip,
        zipObj: zipObj,
        zipWith: zipWith
    };

  /* TEST_ENTRY_POINT */

  if (typeof exports === 'object') {
    module.exports = R;
  } else if (typeof define === 'function' && define.amd) {
    define(function() { return R; });
  } else {
    this.R = R;
  }

}.call(this));

},{}],8:[function(require,module,exports){
'use strict';

var VirtualAudioGraph = require('../src/index.js');
var audioContext = require('./tools/audioContext');

describe('VirtualAudioGraph', function () {
  it('optionally takes audioContext property', function () {
    expect(new VirtualAudioGraph({ audioContext: audioContext }).audioContext).toBe(audioContext);
    expect(new VirtualAudioGraph().audioContext instanceof AudioContext).toBe(true);
  });

  it('optionally takes output parameter', function () {
    expect(new VirtualAudioGraph({
      output: audioContext.destination
    }).output).toBe(audioContext.destination);
    expect(new VirtualAudioGraph({ audioContext: audioContext }).output).toBe(audioContext.destination);
  });
});


},{"../src/index.js":14,"./tools/audioContext":10}],9:[function(require,module,exports){
'use strict';

require('./VirtualAudioGraph');
require('./virtualAudioGraph.defineNode');
require('./virtualAudioGraph.update');


},{"./VirtualAudioGraph":8,"./virtualAudioGraph.defineNode":11,"./virtualAudioGraph.update":12}],10:[function(require,module,exports){
"use strict";

module.exports = new AudioContext();


},{}],11:[function(require,module,exports){
'use strict';

var _require = require('ramda');

var equals = _require.equals;

var VirtualAudioGraph = require('../src/index.js');
var audioContext = require('./tools/audioContext');

var pingPongDelayParams = [{
  id: 0,
  node: 'stereoPanner',
  output: 'output',
  params: {
    pan: -1
  }
}, {
  id: 1,
  node: 'stereoPanner',
  output: 'output',
  params: {
    pan: 1
  }
}, {
  id: 2,
  node: 'delay',
  output: [1, 5],
  params: {
    maxDelayTime: 1 / 3,
    delayTime: 1 / 3
  }
}, {
  id: 3,
  node: 'gain',
  output: 2,
  params: {
    gain: 1 / 3
  }
}, {
  id: 4,
  node: 'delay',
  output: [0, 3],
  params: {
    maxDelayTime: 1 / 3,
    delayTime: 1 / 3
  }
}, {
  id: 5,
  input: 'input',
  node: 'gain',
  output: 4,
  params: {
    gain: 1 / 3
  }
}];

describe('virtualAudioGraph.defineNode', function () {
  var virtualAudioGraph = undefined;

  beforeEach(function () {
    virtualAudioGraph = new VirtualAudioGraph({
      audioContext: audioContext,
      output: audioContext.destination
    });
  });

  it('returns itself', function () {
    expect(virtualAudioGraph.defineNode(pingPongDelayParams, 'pingPongDelay')).toBe(virtualAudioGraph);
  });

  it('throws if name provided is a standard node', function () {
    expect(function () {
      return virtualAudioGraph.defineNode(pingPongDelayParams, 'gain');
    }).toThrow();
  });

  it('creates a custom node internally', function () {
    virtualAudioGraph.defineNode(pingPongDelayParams, 'pingPongDelay');

    expect(typeof virtualAudioGraph.customNodes.pingPongDelay).toBe('function');
  });

  it('creates a custom node which can be reused in virtualAudioGraph.update', function () {
    virtualAudioGraph.defineNode(pingPongDelayParams, 'pingPongDelay');

    var virtualNodeParams = [{
      id: 0,
      node: 'gain',
      output: 'output',
      params: {
        gain: 0.5
      }
    }, {
      id: 1,
      node: 'pingPongDelay',
      output: 0
    }, {
      id: 2,
      node: 'oscillator',
      output: 1
    }];

    var expectedAudioGraph = {
      name: 'AudioDestinationNode',
      inputs: [{
        name: 'GainNode',
        gain: {
          value: 0.5,
          inputs: []
        },
        inputs: [{
          name: 'StereoPannerNode',
          pan: {
            value: -1,
            inputs: []
          },
          inputs: [{
            name: 'DelayNode',
            delayTime: {
              value: 0.3333333333333333,
              inputs: []
            },
            inputs: [{
              name: 'GainNode',
              gain: {
                value: 0.3333333333333333,
                inputs: []
              },
              inputs: [{
                name: 'DelayNode',
                delayTime: {
                  value: 0.3333333333333333,
                  inputs: []
                },
                inputs: [{
                  name: 'GainNode',
                  gain: {
                    value: 0.3333333333333333,
                    inputs: []
                  },
                  inputs: ['<circular:DelayNode>']
                }]
              }, {
                name: 'OscillatorNode',
                type: 'sine',
                frequency: {
                  value: 440,
                  inputs: []
                },
                detune: {
                  value: 0,
                  inputs: []
                },
                inputs: []
              }]
            }]
          }]
        }, {
          name: 'StereoPannerNode',
          pan: {
            value: 1,
            inputs: []
          },
          inputs: [{
            name: 'DelayNode',
            delayTime: {
              value: 0.3333333333333333,
              inputs: []
            },
            inputs: [{
              name: 'GainNode',
              gain: {
                value: 0.3333333333333333,
                inputs: []
              },
              inputs: [{
                name: 'DelayNode',
                delayTime: {
                  value: 0.3333333333333333,
                  inputs: []
                },
                inputs: [{
                  name: 'GainNode',
                  gain: {
                    value: 0.3333333333333333,
                    inputs: []
                  },
                  inputs: ['<circular:DelayNode>', {
                    name: 'OscillatorNode',
                    type: 'sine',
                    frequency: {
                      value: 440,
                      inputs: []
                    },
                    detune: {
                      value: 0,
                      inputs: []
                    },
                    inputs: []
                  }]
                }]
              }]
            }]
          }]
        }]
      }]
    };

    expect(virtualAudioGraph.update(virtualNodeParams)).toBe(virtualAudioGraph);
    expect(equals(audioContext.toJSON(), expectedAudioGraph)).toBe(true);
  });

  it('can define a custom node built of other custom nodes', function () {
    virtualAudioGraph.defineNode(pingPongDelayParams, 'pingPongDelay');

    var quietPingPongDelayParams = [{
      id: 0,
      node: 'gain',
      output: 'output'
    }, {
      id: 1,
      node: 'pingPongDelay',
      output: 0
    }, {
      id: 2,
      node: 'oscillator',
      output: 1
    }];

    virtualAudioGraph.defineNode(quietPingPongDelayParams, 'quietPingPongDelay');

    var virtualNodeParams = [{
      id: 0,
      node: 'gain',
      output: 'output',
      params: {
        gain: 0.5
      }
    }, {
      id: 1,
      node: 'quietPingPongDelay',
      output: 0
    }, {
      id: 2,
      node: 'pingPongDelay',
      output: 1
    }, {
      id: 3,
      node: 'oscillator',
      output: 2
    }];

    expect(virtualAudioGraph.update(virtualNodeParams)).toBe(virtualAudioGraph);
    expect(equals(audioContext.toJSON(), { 'name': 'AudioDestinationNode', 'inputs': [{ 'name': 'GainNode', 'gain': { 'value': 0.5, 'inputs': [] }, 'inputs': [{ 'name': 'StereoPannerNode', 'pan': { 'value': -1, 'inputs': [] }, 'inputs': [{ 'name': 'DelayNode', 'delayTime': { 'value': 0.3333333333333333, 'inputs': [] }, 'inputs': [{ 'name': 'GainNode', 'gain': { 'value': 0.3333333333333333, 'inputs': [] }, 'inputs': [{ 'name': 'DelayNode', 'delayTime': { 'value': 0.3333333333333333, 'inputs': [] }, 'inputs': [{ 'name': 'GainNode', 'gain': { 'value': 0.3333333333333333, 'inputs': [] }, 'inputs': ['<circular:DelayNode>'] }] }, { 'name': 'OscillatorNode', 'type': 'sine', 'frequency': { 'value': 440, 'inputs': [] }, 'detune': { 'value': 0, 'inputs': [] }, 'inputs': [] }] }] }] }, { 'name': 'StereoPannerNode', 'pan': { 'value': 1, 'inputs': [] }, 'inputs': [{ 'name': 'DelayNode', 'delayTime': { 'value': 0.3333333333333333, 'inputs': [] }, 'inputs': [{ 'name': 'GainNode', 'gain': { 'value': 0.3333333333333333, 'inputs': [] }, 'inputs': [{ 'name': 'DelayNode', 'delayTime': { 'value': 0.3333333333333333, 'inputs': [] }, 'inputs': [{ 'name': 'GainNode', 'gain': { 'value': 0.3333333333333333, 'inputs': [] }, 'inputs': ['<circular:DelayNode>', { 'name': 'OscillatorNode', 'type': 'sine', 'frequency': { 'value': 440, 'inputs': [] }, 'detune': { 'value': 0, 'inputs': [] }, 'inputs': [] }] }] }] }] }] }] }, { 'name': 'GainNode', 'gain': { 'value': 0.5, 'inputs': [] }, 'inputs': [{ 'name': 'GainNode', 'gain': { 'value': 1, 'inputs': [] }, 'inputs': [{ 'name': 'StereoPannerNode', 'pan': { 'value': -1, 'inputs': [] }, 'inputs': [{ 'name': 'DelayNode', 'delayTime': { 'value': 0.3333333333333333, 'inputs': [] }, 'inputs': [{ 'name': 'GainNode', 'gain': { 'value': 0.3333333333333333, 'inputs': [] }, 'inputs': [{ 'name': 'DelayNode', 'delayTime': { 'value': 0.3333333333333333, 'inputs': [] }, 'inputs': [{ 'name': 'GainNode', 'gain': { 'value': 0.3333333333333333, 'inputs': [] }, 'inputs': ['<circular:DelayNode>'] }] }, { 'name': 'OscillatorNode', 'type': 'sine', 'frequency': { 'value': 440, 'inputs': [] }, 'detune': { 'value': 0, 'inputs': [] }, 'inputs': [] }] }] }] }, { 'name': 'StereoPannerNode', 'pan': { 'value': 1, 'inputs': [] }, 'inputs': [{ 'name': 'DelayNode', 'delayTime': { 'value': 0.3333333333333333, 'inputs': [] }, 'inputs': [{ 'name': 'GainNode', 'gain': { 'value': 0.3333333333333333, 'inputs': [] }, 'inputs': [{ 'name': 'DelayNode', 'delayTime': { 'value': 0.3333333333333333, 'inputs': [] }, 'inputs': [{ 'name': 'GainNode', 'gain': { 'value': 0.3333333333333333, 'inputs': [] }, 'inputs': ['<circular:DelayNode>', { 'name': 'OscillatorNode', 'type': 'sine', 'frequency': { 'value': 440, 'inputs': [] }, 'detune': { 'value': 0, 'inputs': [] }, 'inputs': [] }] }] }] }] }] }] }] }] })).toBe(true);
  });
});


},{"../src/index.js":14,"./tools/audioContext":10,"ramda":7}],12:[function(require,module,exports){
'use strict';

var VirtualAudioGraph = require('../src/index.js');
var audioContext = require('./tools/audioContext');

describe('virtualAudioGraph.update', function () {
  var virtualAudioGraph = undefined;

  beforeEach(function () {
    virtualAudioGraph = new VirtualAudioGraph({
      audioContext: audioContext,
      output: audioContext.destination
    });
  });

  it('returns itself', function () {
    var virtualNodeParams = [{
      id: 0,
      node: 'oscillator',
      params: {
        type: 'square'
      },
      output: 'output'
    }];
    expect(virtualAudioGraph.update(virtualNodeParams)).toBe(virtualAudioGraph);
  });

  it('throws an error if no id is provided', function () {
    var virtualNodeParams = [{
      node: 'gain',
      output: 'output'
    }];
    expect(function () {
      return virtualAudioGraph.update(virtualNodeParams);
    }).toThrow();
  });

  it('throws an error if no output is provided', function () {
    var virtualNodeParams = [{
      node: 'gain',
      id: 1
    }];
    expect(function () {
      return virtualAudioGraph.update(virtualNodeParams);
    }).toThrow();
  });

  it('throws an error when virtual node name property is not recognised', function () {
    var virtualNodeParams = [{
      id: 0,
      node: 'foobar',
      output: 'output'
    }];
    expect(function () {
      return virtualAudioGraph.update(virtualNodeParams);
    }).toThrow();
  });

  it('creates specified virtual nodes and stores them in virtualAudioGraph property', function () {
    var virtualNodeParams = [{
      id: 1,
      node: 'gain',
      output: 'output'
    }, {
      id: 2,
      node: 'oscillator',
      output: 1
    }];
    virtualAudioGraph.update(virtualNodeParams);
    expect(Array.isArray(virtualAudioGraph.virtualAudioGraph)).toBe(true);
    expect(virtualAudioGraph.virtualAudioGraph.length).toBe(2);
  });

  it('creates OscillatorNode with all valid parameters', function () {
    var params = {
      type: 'square',
      frequency: 440,
      detune: 4
    };

    var type = params.type;
    var frequency = params.frequency;
    var detune = params.detune;

    var virtualNodeParams = [{
      id: 0,
      node: 'oscillator',
      params: params,
      output: 'output'
    }];

    virtualAudioGraph.update(virtualNodeParams);
    var audioNode = virtualAudioGraph.virtualAudioGraph[0].audioNode;
    expect(audioNode.constructor).toBe(OscillatorNode);
    expect(audioNode.type).toBe(type);
    expect(audioNode.frequency.value).toBe(frequency);
    expect(audioNode.detune.value).toBe(detune);
  });

  it('creates GainNode with all valid parameters', function () {
    var gain = 0.5;

    var virtualNodeParams = [{
      id: 0,
      node: 'gain',
      params: {
        gain: gain
      },
      output: 'output'
    }];

    virtualAudioGraph.update(virtualNodeParams);
    var audioNode = virtualAudioGraph.virtualAudioGraph[0].audioNode;
    expect(audioNode.constructor).toBe(GainNode);
    expect(audioNode.gain.value).toBe(gain);
  });

  it('creates BiquadFilterNode with all valid parameters', function () {
    var type = 'peaking';
    var frequency = 500;
    var detune = 6;
    var Q = 0.5;

    var virtualNodeParams = [{
      id: 0,
      node: 'biquadFilter',
      params: {
        type: type,
        frequency: frequency,
        detune: detune,
        Q: Q
      },
      output: 'output'
    }];

    virtualAudioGraph.update(virtualNodeParams);
    var audioNode = virtualAudioGraph.virtualAudioGraph[0].audioNode;
    expect(audioNode.constructor).toBe(BiquadFilterNode);
    expect(audioNode.type).toBe(type);
    expect(audioNode.frequency.value).toBe(frequency);
    expect(audioNode.detune.value).toBe(detune);
    expect(audioNode.Q.value).toBe(Q);
  });

  it('creates DelayNode with all valid parameters', function () {
    var delayTime = 2;
    var maxDelayTime = 5;

    var virtualNodeParams = [{
      id: 0,
      node: 'delay',
      params: {
        delayTime: delayTime,
        maxDelayTime: maxDelayTime
      },
      output: 'output'
    }];

    virtualAudioGraph.update(virtualNodeParams);
    var audioNode = virtualAudioGraph.virtualAudioGraph[0].audioNode;
    expect(audioNode.constructor).toBe(DelayNode);
    expect(audioNode.delayTime.value).toBe(delayTime);
  });

  it('creates StereoPannerNode with all valid parameters', function () {
    var pan = 1;

    var virtualNodeParams = [{
      id: 0,
      node: 'stereoPanner',
      params: {
        pan: pan
      },
      output: 'output'
    }];

    virtualAudioGraph.update(virtualNodeParams);
    var audioNode = virtualAudioGraph.virtualAudioGraph[0].audioNode;
    expect(audioNode.constructor.name).toBe('StereoPannerNode');
    expect(audioNode.pan.value).toBe(pan);
  });
});


},{"../src/index.js":14,"./tools/audioContext":10}],13:[function(require,module,exports){
'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _require = require('ramda');

var any = _require.any;
var assoc = _require.assoc;
var concat = _require.concat;
var compose = _require.compose;
var differenceWith = _require.differenceWith;
var eqProps = _require.eqProps;
var find = _require.find;
var findIndex = _require.findIndex;
var forEach = _require.forEach;
var intersectionWith = _require.intersectionWith;
var isNil = _require.isNil;
var map = _require.map;
var partition = _require.partition;
var propEq = _require.propEq;
var remove = _require.remove;

var capitalizeFirst = require('./tools/capitalizeFirst');
var NativeVirtualAudioNode = require('./virtualNodeConstructors/NativeVirtualAudioNode');
var CustomVirtualAudioNode = require('./virtualNodeConstructors/CustomVirtualAudioNode');
var connectAudioNodes = require('./tools/connectAudioNodes');

var createVirtualAudioNodesAndUpdateVirtualAudioGraph = function createVirtualAudioNodesAndUpdateVirtualAudioGraph(virtualAudioNodeParams) {
  var newVirtualAudioNodeParams = differenceWith(eqProps('id'), virtualAudioNodeParams, this.virtualAudioGraph);

  this.virtualAudioGraph = concat(this.virtualAudioGraph, this.createVirtualAudioNodes(newVirtualAudioNodeParams));

  return virtualAudioNodeParams;
};

var removeAudioNodesAndUpdateVirtualAudioGraph = function removeAudioNodesAndUpdateVirtualAudioGraph(virtualAudioNodeParams) {
  var _this = this;

  var virtualNodesToBeRemoved = differenceWith(eqProps('id'), this.virtualAudioGraph, virtualAudioNodeParams);

  forEach(function (_ref) {
    var audioNode = _ref.audioNode;
    var id = _ref.id;

    audioNode.stop && audioNode.stop();
    audioNode.disconnect();
    _this.virtualAudioGraph = remove(findIndex(propEq('id', id))(_this.virtualAudioGraph), 1, _this.virtualAudioGraph);
  }, virtualNodesToBeRemoved);

  return virtualAudioNodeParams;
};

var updateAudioNodesAndUpdateVirtualAudioGraph = function updateAudioNodesAndUpdateVirtualAudioGraph(virtualAudioNodeParams) {
  var _this2 = this;

  var updateParams = intersectionWith(eqProps('id'), virtualAudioNodeParams, this.virtualAudioGraph);

  forEach(function (virtualAudioNodeParam) {
    var virtualAudioNode = find(propEq('id', virtualAudioNodeParam.id))(_this2.virtualAudioGraph);
    virtualAudioNode.updateAudioNode(virtualAudioNodeParam.params);
  }, updateParams);

  return virtualAudioNodeParams;
};

var VirtualAudioGraph = (function () {
  function VirtualAudioGraph() {
    var params = arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, VirtualAudioGraph);

    this.audioContext = params.audioContext || new AudioContext();
    this.output = params.output || this.audioContext.destination;
    this.virtualAudioGraph = [];
    this.customNodes = {};

    this._removeUpdateAndCreate = compose(createVirtualAudioNodesAndUpdateVirtualAudioGraph.bind(this), updateAudioNodesAndUpdateVirtualAudioGraph.bind(this), removeAudioNodesAndUpdateVirtualAudioGraph.bind(this));
  }

  _createClass(VirtualAudioGraph, [{
    key: 'createVirtualAudioNodes',
    value: function createVirtualAudioNodes(virtualAudioNodesParams) {
      var _this3 = this;

      var partitionedVirtualAudioNodeParams = partition(function (_ref2) {
        var node = _ref2.node;
        return isNil(_this3.customNodes[node]);
      }, virtualAudioNodesParams);

      var nativeVirtualAudioNodeParams = partitionedVirtualAudioNodeParams[0];
      var customVirtualAudioNodeParams = partitionedVirtualAudioNodeParams[1];

      var nativeVirtualAudioNodes = map(function (virtualAudioNodeParams) {
        return new NativeVirtualAudioNode(_this3, virtualAudioNodeParams);
      }, nativeVirtualAudioNodeParams);
      var customVirtualAudioNodes = map(function (virtualAudioNodeParams) {
        return new CustomVirtualAudioNode(_this3, virtualAudioNodeParams);
      }, customVirtualAudioNodeParams);

      return concat(nativeVirtualAudioNodes, customVirtualAudioNodes);
    }
  }, {
    key: 'defineNode',
    value: function defineNode(params, name) {
      if (this.audioContext['create' + capitalizeFirst(name)]) {
        throw new Error('' + name + ' is a standard audio node name and cannot be overwritten');
      }
      this.customNodes[name] = function () {
        return params;
      };
      return this;
    }
  }, {
    key: 'update',
    value: function update(virtualAudioNodeParams) {
      var _this4 = this;

      if (any(propEq('id', undefined), virtualAudioNodeParams)) {
        throw new Error('Every virtualAudioNode needs an id for efficient diffing and determining relationships between nodes');
      }

      this._removeUpdateAndCreate(virtualAudioNodeParams);
      connectAudioNodes(CustomVirtualAudioNode, this.virtualAudioGraph, function (virtualAudioNode) {
        return virtualAudioNode.connect(_this4.output);
      });

      return this;
    }
  }]);

  return VirtualAudioGraph;
})();

module.exports = VirtualAudioGraph;


},{"./tools/capitalizeFirst":15,"./tools/connectAudioNodes":16,"./virtualNodeConstructors/CustomVirtualAudioNode":18,"./virtualNodeConstructors/NativeVirtualAudioNode":19,"babel-runtime/helpers/class-call-check":2,"babel-runtime/helpers/create-class":3,"ramda":7}],14:[function(require,module,exports){
'use strict';

module.exports = require('./VirtualAudioGraph');


},{"./VirtualAudioGraph":13}],15:[function(require,module,exports){
"use strict";

module.exports = function (str) {
  return str[0].toUpperCase() + str.slice(1);
};


},{}],16:[function(require,module,exports){
'use strict';

var _require = require('ramda');

var find = _require.find;
var forEach = _require.forEach;
var propEq = _require.propEq;

module.exports = function (CustomVirtualAudioNode, virtualAudioNodes) {
  var handleConnectionToOutput = arguments[2] === undefined ? function () {} : arguments[2];
  return forEach(function (virtualAudioNode) {
    forEach(function (connection) {
      if (connection === 'output') {
        handleConnectionToOutput(virtualAudioNode);
      } else {
        var destinationVirtualAudioNode = find(propEq('id', connection))(virtualAudioNodes);
        if (destinationVirtualAudioNode instanceof CustomVirtualAudioNode) {
          forEach(virtualAudioNode.connect.bind(virtualAudioNode), destinationVirtualAudioNode.inputs);
        } else {
          virtualAudioNode.connect(destinationVirtualAudioNode.audioNode);
        }
      }
    }, virtualAudioNode.output);
  }, virtualAudioNodes);
};


},{"ramda":7}],17:[function(require,module,exports){
'use strict';

var capitalizeFirst = require('./capitalizeFirst');

var namesToParamsKey = {
  delay: 'maxDelayTime'
};

module.exports = function (audioContext, name, constructorParams) {
  var constructorParamsKey = namesToParamsKey[name];
  var audioNode = constructorParamsKey ? audioContext['create' + capitalizeFirst(name)](constructorParams[constructorParamsKey]) : audioContext['create' + capitalizeFirst(name)]();
  if (name === 'oscillator') {
    audioNode.start();
  }
  return audioNode;
};


},{"./capitalizeFirst":15}],18:[function(require,module,exports){
'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _require = require('ramda');

var contains = _require.contains;
var filter = _require.filter;
var forEach = _require.forEach;
var keys = _require.keys;
var pick = _require.pick;
var pluck = _require.pluck;
var propEq = _require.propEq;
var omit = _require.omit;

var connectAudioNodes = require('../tools/connectAudioNodes');
// if you use the below extract it
// const constructorParamsKeys = [
//   'maxDelayTime',
// ];

module.exports = (function () {
  function CustomVirtualAudioNode(virtualAudioGraph, virtualNodeParams) {
    _classCallCheck(this, CustomVirtualAudioNode);

    var node = virtualNodeParams.node;
    var id = virtualNodeParams.id;
    var output = virtualNodeParams.output;

    // params = params || {};
    // const constructorParams = pick(constructorParamsKeys, params);
    // params = omit(constructorParamsKeys, params);
    // this.updateAudioNode(params);
    this.virtualAudioGraph = virtualAudioGraph.customNodes[node]();
    this.virtualAudioGraph = virtualAudioGraph.createVirtualAudioNodes(this.virtualAudioGraph);
    connectAudioNodes(CustomVirtualAudioNode, this.virtualAudioGraph);
    this.id = id;
    this.output = Array.isArray(output) ? output : [output];
  }

  _createClass(CustomVirtualAudioNode, [{
    key: 'connect',
    value: function connect(destination) {
      var outputVirtualNodes = filter(function (_ref) {
        var output = _ref.output;
        return contains('output', output);
      }, this.virtualAudioGraph);
      forEach(function (audioNode) {
        return audioNode.connect(destination);
      }, pluck('audioNode', outputVirtualNodes));
    }
  }, {
    key: 'updateAudioNode',
    value: function updateAudioNode(params) {}
  }, {
    key: 'inputs',
    get: function () {
      return pluck('audioNode', filter(propEq('input', 'input'), this.virtualAudioGraph));
    }
  }]);

  return CustomVirtualAudioNode;
})();

// need to implement some update logic here


},{"../tools/connectAudioNodes":16,"babel-runtime/helpers/class-call-check":2,"babel-runtime/helpers/create-class":3,"ramda":7}],19:[function(require,module,exports){
'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var createAudioNode = require('../tools/createAudioNode');

var _require = require('ramda');

var forEach = _require.forEach;
var keys = _require.keys;
var pick = _require.pick;
var omit = _require.omit;

var constructorParamsKeys = ['maxDelayTime'];

module.exports = (function () {
  function NativeVirtualAudioNode(virtualAudioGraph, virtualNodeParams) {
    _classCallCheck(this, NativeVirtualAudioNode);

    var node = virtualNodeParams.node;
    var id = virtualNodeParams.id;
    var input = virtualNodeParams.input;
    var output = virtualNodeParams.output;
    var params = virtualNodeParams.params;

    params = params || {};
    var constructorParams = pick(constructorParamsKeys, params);
    params = omit(constructorParamsKeys, params);
    this.audioNode = createAudioNode(virtualAudioGraph.audioContext, node, constructorParams);
    this.updateAudioNode(params);
    this.id = id;
    this.input = input;
    this.output = Array.isArray(output) ? output : [output];
    this.params = params;
  }

  _createClass(NativeVirtualAudioNode, [{
    key: 'connect',
    value: function connect(destination) {
      this.audioNode.connect(destination);
    }
  }, {
    key: 'updateAudioNode',
    value: function updateAudioNode(params) {
      var _this = this;

      params = omit(constructorParamsKeys, params);
      forEach(function (key) {
        switch (key) {
          case 'type':
            _this.audioNode[key] = params[key];
            return;
          default:
            _this.audioNode[key].value = params[key];
            return;
        }
      }, keys(params));
    }
  }]);

  return NativeVirtualAudioNode;
})();


},{"../tools/createAudioNode":17,"babel-runtime/helpers/class-call-check":2,"babel-runtime/helpers/create-class":3,"ramda":7}]},{},[9])


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9jb3JlLWpzL29iamVjdC9kZWZpbmUtcHJvcGVydHkuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9oZWxwZXJzL2NsYXNzLWNhbGwtY2hlY2suanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9oZWxwZXJzL2NyZWF0ZS1jbGFzcy5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvZm4vb2JqZWN0L2RlZmluZS1wcm9wZXJ0eS5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLmZ3LmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuanMiLCJub2RlX21vZHVsZXMvcmFtZGEvZGlzdC9yYW1kYS5qcyIsInNwZWMvVmlydHVhbEF1ZGlvR3JhcGguanMiLCJzcGVjL2luZGV4LmpzIiwic3BlYy90b29scy9hdWRpb0NvbnRleHQuanMiLCJzcGVjL3ZpcnR1YWxBdWRpb0dyYXBoLmRlZmluZU5vZGUuanMiLCJzcGVjL3ZpcnR1YWxBdWRpb0dyYXBoLnVwZGF0ZS5qcyIsInNyYy9WaXJ0dWFsQXVkaW9HcmFwaC5qcyIsInNyYy9pbmRleC5qcyIsInNyYy90b29scy9jYXBpdGFsaXplRmlyc3QuanMiLCJzcmMvdG9vbHMvY29ubmVjdEF1ZGlvTm9kZXMuanMiLCJzcmMvdG9vbHMvY3JlYXRlQXVkaW9Ob2RlLmpzIiwic3JjL3ZpcnR1YWxOb2RlQ29uc3RydWN0b3JzL0N1c3RvbVZpcnR1YWxBdWRpb05vZGUuanMiLCJzcmMvdmlydHVhbE5vZGVDb25zdHJ1Y3RvcnMvTmF0aXZlVmlydHVhbEF1ZGlvTm9kZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9GQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN2hQQSxZQUFZLENBQUM7O0FBRWIsSUFBSSxpQkFBaUIsR0FBRyxPQUFPLENBQUMsaUJBQWlCLENBQUMsQ0FBQztBQUNuRCxJQUFJLFlBQVksR0FBRyxPQUFPLENBQUMsc0JBQXNCLENBQUMsQ0FBQzs7QUFFbkQsUUFBUSxDQUFDLG1CQUFtQixFQUFFLFlBQVk7RUFDeEMsRUFBRSxDQUFDLHdDQUF3QyxFQUFFLFlBQVk7SUFDdkQsTUFBTSxDQUFDLElBQUksaUJBQWlCLENBQUMsRUFBRSxZQUFZLEVBQUUsWUFBWSxFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDOUYsTUFBTSxDQUFDLElBQUksaUJBQWlCLEVBQUUsQ0FBQyxZQUFZLFlBQVksWUFBWSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3BGLEdBQUcsQ0FBQyxDQUFDOztFQUVILEVBQUUsQ0FBQyxtQ0FBbUMsRUFBRSxZQUFZO0lBQ2xELE1BQU0sQ0FBQyxJQUFJLGlCQUFpQixDQUFDO01BQzNCLE1BQU0sRUFBRSxZQUFZLENBQUMsV0FBVztLQUNqQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUMxQyxNQUFNLENBQUMsSUFBSSxpQkFBaUIsQ0FBQyxFQUFFLFlBQVksRUFBRSxZQUFZLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDLENBQUM7R0FDckcsQ0FBQyxDQUFDO0NBQ0osQ0FBQyxDQUFDO0FBQ0g7OztBQ2xCQSxZQUFZLENBQUM7O0FBRWIsT0FBTyxDQUFDLHFCQUFxQixDQUFDLENBQUM7QUFDL0IsT0FBTyxDQUFDLGdDQUFnQyxDQUFDLENBQUM7QUFDMUMsT0FBTyxDQUFDLDRCQUE0QixDQUFDLENBQUM7QUFDdEM7OztBQ0xBLFlBQVksQ0FBQzs7QUFFYixNQUFNLENBQUMsT0FBTyxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7QUFDcEM7OztBQ0hBLFlBQVksQ0FBQzs7QUFFYixJQUFJLFFBQVEsR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7O0FBRWhDLElBQUksTUFBTSxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUM7O0FBRTdCLElBQUksaUJBQWlCLEdBQUcsT0FBTyxDQUFDLGlCQUFpQixDQUFDLENBQUM7QUFDbkQsSUFBSSxZQUFZLEdBQUcsT0FBTyxDQUFDLHNCQUFzQixDQUFDLENBQUM7O0FBRW5ELElBQUksbUJBQW1CLEdBQUcsQ0FBQztFQUN6QixFQUFFLEVBQUUsQ0FBQztFQUNMLElBQUksRUFBRSxjQUFjO0VBQ3BCLE1BQU0sRUFBRSxRQUFRO0VBQ2hCLE1BQU0sRUFBRTtJQUNOLEdBQUcsRUFBRSxDQUFDLENBQUM7R0FDUjtDQUNGLEVBQUU7RUFDRCxFQUFFLEVBQUUsQ0FBQztFQUNMLElBQUksRUFBRSxjQUFjO0VBQ3BCLE1BQU0sRUFBRSxRQUFRO0VBQ2hCLE1BQU0sRUFBRTtJQUNOLEdBQUcsRUFBRSxDQUFDO0dBQ1A7Q0FDRixFQUFFO0VBQ0QsRUFBRSxFQUFFLENBQUM7RUFDTCxJQUFJLEVBQUUsT0FBTztFQUNiLE1BQU0sRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7RUFDZCxNQUFNLEVBQUU7SUFDTixZQUFZLEVBQUUsQ0FBQyxHQUFHLENBQUM7SUFDbkIsU0FBUyxFQUFFLENBQUMsR0FBRyxDQUFDO0dBQ2pCO0NBQ0YsRUFBRTtFQUNELEVBQUUsRUFBRSxDQUFDO0VBQ0wsSUFBSSxFQUFFLE1BQU07RUFDWixNQUFNLEVBQUUsQ0FBQztFQUNULE1BQU0sRUFBRTtJQUNOLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQztHQUNaO0NBQ0YsRUFBRTtFQUNELEVBQUUsRUFBRSxDQUFDO0VBQ0wsSUFBSSxFQUFFLE9BQU87RUFDYixNQUFNLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0VBQ2QsTUFBTSxFQUFFO0lBQ04sWUFBWSxFQUFFLENBQUMsR0FBRyxDQUFDO0lBQ25CLFNBQVMsRUFBRSxDQUFDLEdBQUcsQ0FBQztHQUNqQjtDQUNGLEVBQUU7RUFDRCxFQUFFLEVBQUUsQ0FBQztFQUNMLEtBQUssRUFBRSxPQUFPO0VBQ2QsSUFBSSxFQUFFLE1BQU07RUFDWixNQUFNLEVBQUUsQ0FBQztFQUNULE1BQU0sRUFBRTtJQUNOLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQztHQUNaO0FBQ0gsQ0FBQyxDQUFDLENBQUM7O0FBRUgsUUFBUSxDQUFDLDhCQUE4QixFQUFFLFlBQVk7QUFDckQsRUFBRSxJQUFJLGlCQUFpQixHQUFHLFNBQVMsQ0FBQzs7RUFFbEMsVUFBVSxDQUFDLFlBQVk7SUFDckIsaUJBQWlCLEdBQUcsSUFBSSxpQkFBaUIsQ0FBQztNQUN4QyxZQUFZLEVBQUUsWUFBWTtNQUMxQixNQUFNLEVBQUUsWUFBWSxDQUFDLFdBQVc7S0FDakMsQ0FBQyxDQUFDO0FBQ1AsR0FBRyxDQUFDLENBQUM7O0VBRUgsRUFBRSxDQUFDLGdCQUFnQixFQUFFLFlBQVk7SUFDL0IsTUFBTSxDQUFDLGlCQUFpQixDQUFDLFVBQVUsQ0FBQyxtQkFBbUIsRUFBRSxlQUFlLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0FBQ3ZHLEdBQUcsQ0FBQyxDQUFDOztFQUVILEVBQUUsQ0FBQyw0Q0FBNEMsRUFBRSxZQUFZO0lBQzNELE1BQU0sQ0FBQyxZQUFZO01BQ2pCLE9BQU8saUJBQWlCLENBQUMsVUFBVSxDQUFDLG1CQUFtQixFQUFFLE1BQU0sQ0FBQyxDQUFDO0tBQ2xFLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUNqQixHQUFHLENBQUMsQ0FBQzs7RUFFSCxFQUFFLENBQUMsa0NBQWtDLEVBQUUsWUFBWTtBQUNyRCxJQUFJLGlCQUFpQixDQUFDLFVBQVUsQ0FBQyxtQkFBbUIsRUFBRSxlQUFlLENBQUMsQ0FBQzs7SUFFbkUsTUFBTSxDQUFDLE9BQU8saUJBQWlCLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNoRixHQUFHLENBQUMsQ0FBQzs7RUFFSCxFQUFFLENBQUMsdUVBQXVFLEVBQUUsWUFBWTtBQUMxRixJQUFJLGlCQUFpQixDQUFDLFVBQVUsQ0FBQyxtQkFBbUIsRUFBRSxlQUFlLENBQUMsQ0FBQzs7SUFFbkUsSUFBSSxpQkFBaUIsR0FBRyxDQUFDO01BQ3ZCLEVBQUUsRUFBRSxDQUFDO01BQ0wsSUFBSSxFQUFFLE1BQU07TUFDWixNQUFNLEVBQUUsUUFBUTtNQUNoQixNQUFNLEVBQUU7UUFDTixJQUFJLEVBQUUsR0FBRztPQUNWO0tBQ0YsRUFBRTtNQUNELEVBQUUsRUFBRSxDQUFDO01BQ0wsSUFBSSxFQUFFLGVBQWU7TUFDckIsTUFBTSxFQUFFLENBQUM7S0FDVixFQUFFO01BQ0QsRUFBRSxFQUFFLENBQUM7TUFDTCxJQUFJLEVBQUUsWUFBWTtNQUNsQixNQUFNLEVBQUUsQ0FBQztBQUNmLEtBQUssQ0FBQyxDQUFDOztJQUVILElBQUksa0JBQWtCLEdBQUc7TUFDdkIsSUFBSSxFQUFFLHNCQUFzQjtNQUM1QixNQUFNLEVBQUUsQ0FBQztRQUNQLElBQUksRUFBRSxVQUFVO1FBQ2hCLElBQUksRUFBRTtVQUNKLEtBQUssRUFBRSxHQUFHO1VBQ1YsTUFBTSxFQUFFLEVBQUU7U0FDWDtRQUNELE1BQU0sRUFBRSxDQUFDO1VBQ1AsSUFBSSxFQUFFLGtCQUFrQjtVQUN4QixHQUFHLEVBQUU7WUFDSCxLQUFLLEVBQUUsQ0FBQyxDQUFDO1lBQ1QsTUFBTSxFQUFFLEVBQUU7V0FDWDtVQUNELE1BQU0sRUFBRSxDQUFDO1lBQ1AsSUFBSSxFQUFFLFdBQVc7WUFDakIsU0FBUyxFQUFFO2NBQ1QsS0FBSyxFQUFFLGtCQUFrQjtjQUN6QixNQUFNLEVBQUUsRUFBRTthQUNYO1lBQ0QsTUFBTSxFQUFFLENBQUM7Y0FDUCxJQUFJLEVBQUUsVUFBVTtjQUNoQixJQUFJLEVBQUU7Z0JBQ0osS0FBSyxFQUFFLGtCQUFrQjtnQkFDekIsTUFBTSxFQUFFLEVBQUU7ZUFDWDtjQUNELE1BQU0sRUFBRSxDQUFDO2dCQUNQLElBQUksRUFBRSxXQUFXO2dCQUNqQixTQUFTLEVBQUU7a0JBQ1QsS0FBSyxFQUFFLGtCQUFrQjtrQkFDekIsTUFBTSxFQUFFLEVBQUU7aUJBQ1g7Z0JBQ0QsTUFBTSxFQUFFLENBQUM7a0JBQ1AsSUFBSSxFQUFFLFVBQVU7a0JBQ2hCLElBQUksRUFBRTtvQkFDSixLQUFLLEVBQUUsa0JBQWtCO29CQUN6QixNQUFNLEVBQUUsRUFBRTttQkFDWDtrQkFDRCxNQUFNLEVBQUUsQ0FBQyxzQkFBc0IsQ0FBQztpQkFDakMsQ0FBQztlQUNILEVBQUU7Z0JBQ0QsSUFBSSxFQUFFLGdCQUFnQjtnQkFDdEIsSUFBSSxFQUFFLE1BQU07Z0JBQ1osU0FBUyxFQUFFO2tCQUNULEtBQUssRUFBRSxHQUFHO2tCQUNWLE1BQU0sRUFBRSxFQUFFO2lCQUNYO2dCQUNELE1BQU0sRUFBRTtrQkFDTixLQUFLLEVBQUUsQ0FBQztrQkFDUixNQUFNLEVBQUUsRUFBRTtpQkFDWDtnQkFDRCxNQUFNLEVBQUUsRUFBRTtlQUNYLENBQUM7YUFDSCxDQUFDO1dBQ0gsQ0FBQztTQUNILEVBQUU7VUFDRCxJQUFJLEVBQUUsa0JBQWtCO1VBQ3hCLEdBQUcsRUFBRTtZQUNILEtBQUssRUFBRSxDQUFDO1lBQ1IsTUFBTSxFQUFFLEVBQUU7V0FDWDtVQUNELE1BQU0sRUFBRSxDQUFDO1lBQ1AsSUFBSSxFQUFFLFdBQVc7WUFDakIsU0FBUyxFQUFFO2NBQ1QsS0FBSyxFQUFFLGtCQUFrQjtjQUN6QixNQUFNLEVBQUUsRUFBRTthQUNYO1lBQ0QsTUFBTSxFQUFFLENBQUM7Y0FDUCxJQUFJLEVBQUUsVUFBVTtjQUNoQixJQUFJLEVBQUU7Z0JBQ0osS0FBSyxFQUFFLGtCQUFrQjtnQkFDekIsTUFBTSxFQUFFLEVBQUU7ZUFDWDtjQUNELE1BQU0sRUFBRSxDQUFDO2dCQUNQLElBQUksRUFBRSxXQUFXO2dCQUNqQixTQUFTLEVBQUU7a0JBQ1QsS0FBSyxFQUFFLGtCQUFrQjtrQkFDekIsTUFBTSxFQUFFLEVBQUU7aUJBQ1g7Z0JBQ0QsTUFBTSxFQUFFLENBQUM7a0JBQ1AsSUFBSSxFQUFFLFVBQVU7a0JBQ2hCLElBQUksRUFBRTtvQkFDSixLQUFLLEVBQUUsa0JBQWtCO29CQUN6QixNQUFNLEVBQUUsRUFBRTttQkFDWDtrQkFDRCxNQUFNLEVBQUUsQ0FBQyxzQkFBc0IsRUFBRTtvQkFDL0IsSUFBSSxFQUFFLGdCQUFnQjtvQkFDdEIsSUFBSSxFQUFFLE1BQU07b0JBQ1osU0FBUyxFQUFFO3NCQUNULEtBQUssRUFBRSxHQUFHO3NCQUNWLE1BQU0sRUFBRSxFQUFFO3FCQUNYO29CQUNELE1BQU0sRUFBRTtzQkFDTixLQUFLLEVBQUUsQ0FBQztzQkFDUixNQUFNLEVBQUUsRUFBRTtxQkFDWDtvQkFDRCxNQUFNLEVBQUUsRUFBRTttQkFDWCxDQUFDO2lCQUNILENBQUM7ZUFDSCxDQUFDO2FBQ0gsQ0FBQztXQUNILENBQUM7U0FDSCxDQUFDO09BQ0gsQ0FBQztBQUNSLEtBQUssQ0FBQzs7SUFFRixNQUFNLENBQUMsaUJBQWlCLENBQUMsTUFBTSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQztJQUM1RSxNQUFNLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3pFLEdBQUcsQ0FBQyxDQUFDOztFQUVILEVBQUUsQ0FBQyxzREFBc0QsRUFBRSxZQUFZO0FBQ3pFLElBQUksaUJBQWlCLENBQUMsVUFBVSxDQUFDLG1CQUFtQixFQUFFLGVBQWUsQ0FBQyxDQUFDOztJQUVuRSxJQUFJLHdCQUF3QixHQUFHLENBQUM7TUFDOUIsRUFBRSxFQUFFLENBQUM7TUFDTCxJQUFJLEVBQUUsTUFBTTtNQUNaLE1BQU0sRUFBRSxRQUFRO0tBQ2pCLEVBQUU7TUFDRCxFQUFFLEVBQUUsQ0FBQztNQUNMLElBQUksRUFBRSxlQUFlO01BQ3JCLE1BQU0sRUFBRSxDQUFDO0tBQ1YsRUFBRTtNQUNELEVBQUUsRUFBRSxDQUFDO01BQ0wsSUFBSSxFQUFFLFlBQVk7TUFDbEIsTUFBTSxFQUFFLENBQUM7QUFDZixLQUFLLENBQUMsQ0FBQzs7QUFFUCxJQUFJLGlCQUFpQixDQUFDLFVBQVUsQ0FBQyx3QkFBd0IsRUFBRSxvQkFBb0IsQ0FBQyxDQUFDOztJQUU3RSxJQUFJLGlCQUFpQixHQUFHLENBQUM7TUFDdkIsRUFBRSxFQUFFLENBQUM7TUFDTCxJQUFJLEVBQUUsTUFBTTtNQUNaLE1BQU0sRUFBRSxRQUFRO01BQ2hCLE1BQU0sRUFBRTtRQUNOLElBQUksRUFBRSxHQUFHO09BQ1Y7S0FDRixFQUFFO01BQ0QsRUFBRSxFQUFFLENBQUM7TUFDTCxJQUFJLEVBQUUsb0JBQW9CO01BQzFCLE1BQU0sRUFBRSxDQUFDO0tBQ1YsRUFBRTtNQUNELEVBQUUsRUFBRSxDQUFDO01BQ0wsSUFBSSxFQUFFLGVBQWU7TUFDckIsTUFBTSxFQUFFLENBQUM7S0FDVixFQUFFO01BQ0QsRUFBRSxFQUFFLENBQUM7TUFDTCxJQUFJLEVBQUUsWUFBWTtNQUNsQixNQUFNLEVBQUUsQ0FBQztBQUNmLEtBQUssQ0FBQyxDQUFDOztJQUVILE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0lBQzVFLE1BQU0sQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLHNCQUFzQixFQUFFLFFBQVEsRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxrQkFBa0IsRUFBRSxLQUFLLEVBQUUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBRSxXQUFXLEVBQUUsRUFBRSxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsRUFBRSxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBRSxXQUFXLEVBQUUsRUFBRSxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsRUFBRSxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxDQUFDLHNCQUFzQixDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUUsRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsa0JBQWtCLEVBQUUsS0FBSyxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsV0FBVyxFQUFFLFdBQVcsRUFBRSxFQUFFLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxFQUFFLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsV0FBVyxFQUFFLFdBQVcsRUFBRSxFQUFFLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxFQUFFLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLENBQUMsc0JBQXNCLEVBQUUsRUFBRSxNQUFNLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUUsRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxrQkFBa0IsRUFBRSxLQUFLLEVBQUUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBRSxXQUFXLEVBQUUsRUFBRSxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsRUFBRSxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBRSxXQUFXLEVBQUUsRUFBRSxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsRUFBRSxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxDQUFDLHNCQUFzQixDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUUsRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsa0JBQWtCLEVBQUUsS0FBSyxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsV0FBVyxFQUFFLFdBQVcsRUFBRSxFQUFFLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxFQUFFLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsV0FBVyxFQUFFLFdBQVcsRUFBRSxFQUFFLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxFQUFFLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLENBQUMsc0JBQXNCLEVBQUUsRUFBRSxNQUFNLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUUsRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0dBQzl3RixDQUFDLENBQUM7Q0FDSixDQUFDLENBQUM7QUFDSDs7O0FDaFFBLFlBQVksQ0FBQzs7QUFFYixJQUFJLGlCQUFpQixHQUFHLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0FBQ25ELElBQUksWUFBWSxHQUFHLE9BQU8sQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDOztBQUVuRCxRQUFRLENBQUMsMEJBQTBCLEVBQUUsWUFBWTtBQUNqRCxFQUFFLElBQUksaUJBQWlCLEdBQUcsU0FBUyxDQUFDOztFQUVsQyxVQUFVLENBQUMsWUFBWTtJQUNyQixpQkFBaUIsR0FBRyxJQUFJLGlCQUFpQixDQUFDO01BQ3hDLFlBQVksRUFBRSxZQUFZO01BQzFCLE1BQU0sRUFBRSxZQUFZLENBQUMsV0FBVztLQUNqQyxDQUFDLENBQUM7QUFDUCxHQUFHLENBQUMsQ0FBQzs7RUFFSCxFQUFFLENBQUMsZ0JBQWdCLEVBQUUsWUFBWTtJQUMvQixJQUFJLGlCQUFpQixHQUFHLENBQUM7TUFDdkIsRUFBRSxFQUFFLENBQUM7TUFDTCxJQUFJLEVBQUUsWUFBWTtNQUNsQixNQUFNLEVBQUU7UUFDTixJQUFJLEVBQUUsUUFBUTtPQUNmO01BQ0QsTUFBTSxFQUFFLFFBQVE7S0FDakIsQ0FBQyxDQUFDO0lBQ0gsTUFBTSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUM7QUFDaEYsR0FBRyxDQUFDLENBQUM7O0VBRUgsRUFBRSxDQUFDLHNDQUFzQyxFQUFFLFlBQVk7SUFDckQsSUFBSSxpQkFBaUIsR0FBRyxDQUFDO01BQ3ZCLElBQUksRUFBRSxNQUFNO01BQ1osTUFBTSxFQUFFLFFBQVE7S0FDakIsQ0FBQyxDQUFDO0lBQ0gsTUFBTSxDQUFDLFlBQVk7TUFDakIsT0FBTyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsaUJBQWlCLENBQUMsQ0FBQztLQUNwRCxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDakIsR0FBRyxDQUFDLENBQUM7O0VBRUgsRUFBRSxDQUFDLDBDQUEwQyxFQUFFLFlBQVk7SUFDekQsSUFBSSxpQkFBaUIsR0FBRyxDQUFDO01BQ3ZCLElBQUksRUFBRSxNQUFNO01BQ1osRUFBRSxFQUFFLENBQUM7S0FDTixDQUFDLENBQUM7SUFDSCxNQUFNLENBQUMsWUFBWTtNQUNqQixPQUFPLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0tBQ3BELENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUNqQixHQUFHLENBQUMsQ0FBQzs7RUFFSCxFQUFFLENBQUMsbUVBQW1FLEVBQUUsWUFBWTtJQUNsRixJQUFJLGlCQUFpQixHQUFHLENBQUM7TUFDdkIsRUFBRSxFQUFFLENBQUM7TUFDTCxJQUFJLEVBQUUsUUFBUTtNQUNkLE1BQU0sRUFBRSxRQUFRO0tBQ2pCLENBQUMsQ0FBQztJQUNILE1BQU0sQ0FBQyxZQUFZO01BQ2pCLE9BQU8saUJBQWlCLENBQUMsTUFBTSxDQUFDLGlCQUFpQixDQUFDLENBQUM7S0FDcEQsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQ2pCLEdBQUcsQ0FBQyxDQUFDOztFQUVILEVBQUUsQ0FBQywrRUFBK0UsRUFBRSxZQUFZO0lBQzlGLElBQUksaUJBQWlCLEdBQUcsQ0FBQztNQUN2QixFQUFFLEVBQUUsQ0FBQztNQUNMLElBQUksRUFBRSxNQUFNO01BQ1osTUFBTSxFQUFFLFFBQVE7S0FDakIsRUFBRTtNQUNELEVBQUUsRUFBRSxDQUFDO01BQ0wsSUFBSSxFQUFFLFlBQVk7TUFDbEIsTUFBTSxFQUFFLENBQUM7S0FDVixDQUFDLENBQUM7SUFDSCxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsaUJBQWlCLENBQUMsQ0FBQztJQUM1QyxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3RFLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDL0QsR0FBRyxDQUFDLENBQUM7O0VBRUgsRUFBRSxDQUFDLGtEQUFrRCxFQUFFLFlBQVk7SUFDakUsSUFBSSxNQUFNLEdBQUc7TUFDWCxJQUFJLEVBQUUsUUFBUTtNQUNkLFNBQVMsRUFBRSxHQUFHO01BQ2QsTUFBTSxFQUFFLENBQUM7QUFDZixLQUFLLENBQUM7O0lBRUYsSUFBSSxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQztJQUN2QixJQUFJLFNBQVMsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDO0FBQ3JDLElBQUksSUFBSSxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQzs7SUFFM0IsSUFBSSxpQkFBaUIsR0FBRyxDQUFDO01BQ3ZCLEVBQUUsRUFBRSxDQUFDO01BQ0wsSUFBSSxFQUFFLFlBQVk7TUFDbEIsTUFBTSxFQUFFLE1BQU07TUFDZCxNQUFNLEVBQUUsUUFBUTtBQUN0QixLQUFLLENBQUMsQ0FBQzs7SUFFSCxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsaUJBQWlCLENBQUMsQ0FBQztJQUM1QyxJQUFJLFNBQVMsR0FBRyxpQkFBaUIsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7SUFDakUsTUFBTSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7SUFDbkQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDbEMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ2xELE1BQU0sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNoRCxHQUFHLENBQUMsQ0FBQzs7RUFFSCxFQUFFLENBQUMsNENBQTRDLEVBQUUsWUFBWTtBQUMvRCxJQUFJLElBQUksSUFBSSxHQUFHLEdBQUcsQ0FBQzs7SUFFZixJQUFJLGlCQUFpQixHQUFHLENBQUM7TUFDdkIsRUFBRSxFQUFFLENBQUM7TUFDTCxJQUFJLEVBQUUsTUFBTTtNQUNaLE1BQU0sRUFBRTtRQUNOLElBQUksRUFBRSxJQUFJO09BQ1g7TUFDRCxNQUFNLEVBQUUsUUFBUTtBQUN0QixLQUFLLENBQUMsQ0FBQzs7SUFFSCxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsaUJBQWlCLENBQUMsQ0FBQztJQUM1QyxJQUFJLFNBQVMsR0FBRyxpQkFBaUIsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7SUFDakUsTUFBTSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDN0MsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzVDLEdBQUcsQ0FBQyxDQUFDOztFQUVILEVBQUUsQ0FBQyxvREFBb0QsRUFBRSxZQUFZO0lBQ25FLElBQUksSUFBSSxHQUFHLFNBQVMsQ0FBQztJQUNyQixJQUFJLFNBQVMsR0FBRyxHQUFHLENBQUM7SUFDcEIsSUFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFDO0FBQ25CLElBQUksSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDOztJQUVaLElBQUksaUJBQWlCLEdBQUcsQ0FBQztNQUN2QixFQUFFLEVBQUUsQ0FBQztNQUNMLElBQUksRUFBRSxjQUFjO01BQ3BCLE1BQU0sRUFBRTtRQUNOLElBQUksRUFBRSxJQUFJO1FBQ1YsU0FBUyxFQUFFLFNBQVM7UUFDcEIsTUFBTSxFQUFFLE1BQU07UUFDZCxDQUFDLEVBQUUsQ0FBQztPQUNMO01BQ0QsTUFBTSxFQUFFLFFBQVE7QUFDdEIsS0FBSyxDQUFDLENBQUM7O0lBRUgsaUJBQWlCLENBQUMsTUFBTSxDQUFDLGlCQUFpQixDQUFDLENBQUM7SUFDNUMsSUFBSSxTQUFTLEdBQUcsaUJBQWlCLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO0lBQ2pFLE1BQU0sQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7SUFDckQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDbEMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ2xELE1BQU0sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUM1QyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDdEMsR0FBRyxDQUFDLENBQUM7O0VBRUgsRUFBRSxDQUFDLDZDQUE2QyxFQUFFLFlBQVk7SUFDNUQsSUFBSSxTQUFTLEdBQUcsQ0FBQyxDQUFDO0FBQ3RCLElBQUksSUFBSSxZQUFZLEdBQUcsQ0FBQyxDQUFDOztJQUVyQixJQUFJLGlCQUFpQixHQUFHLENBQUM7TUFDdkIsRUFBRSxFQUFFLENBQUM7TUFDTCxJQUFJLEVBQUUsT0FBTztNQUNiLE1BQU0sRUFBRTtRQUNOLFNBQVMsRUFBRSxTQUFTO1FBQ3BCLFlBQVksRUFBRSxZQUFZO09BQzNCO01BQ0QsTUFBTSxFQUFFLFFBQVE7QUFDdEIsS0FBSyxDQUFDLENBQUM7O0lBRUgsaUJBQWlCLENBQUMsTUFBTSxDQUFDLGlCQUFpQixDQUFDLENBQUM7SUFDNUMsSUFBSSxTQUFTLEdBQUcsaUJBQWlCLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO0lBQ2pFLE1BQU0sQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQzlDLE1BQU0sQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUN0RCxHQUFHLENBQUMsQ0FBQzs7RUFFSCxFQUFFLENBQUMsb0RBQW9ELEVBQUUsWUFBWTtBQUN2RSxJQUFJLElBQUksR0FBRyxHQUFHLENBQUMsQ0FBQzs7SUFFWixJQUFJLGlCQUFpQixHQUFHLENBQUM7TUFDdkIsRUFBRSxFQUFFLENBQUM7TUFDTCxJQUFJLEVBQUUsY0FBYztNQUNwQixNQUFNLEVBQUU7UUFDTixHQUFHLEVBQUUsR0FBRztPQUNUO01BQ0QsTUFBTSxFQUFFLFFBQVE7QUFDdEIsS0FBSyxDQUFDLENBQUM7O0lBRUgsaUJBQWlCLENBQUMsTUFBTSxDQUFDLGlCQUFpQixDQUFDLENBQUM7SUFDNUMsSUFBSSxTQUFTLEdBQUcsaUJBQWlCLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO0lBQ2pFLE1BQU0sQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0lBQzVELE1BQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztHQUN2QyxDQUFDLENBQUM7Q0FDSixDQUFDLENBQUM7QUFDSDs7O0FDdExBLFlBQVksQ0FBQzs7QUFFYixJQUFJLFlBQVksR0FBRyxPQUFPLENBQUMsb0NBQW9DLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQzs7QUFFNUUsSUFBSSxlQUFlLEdBQUcsT0FBTyxDQUFDLHdDQUF3QyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUM7O0FBRW5GLElBQUksUUFBUSxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQzs7QUFFaEMsSUFBSSxHQUFHLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQztBQUN2QixJQUFJLEtBQUssR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDO0FBQzNCLElBQUksTUFBTSxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUM7QUFDN0IsSUFBSSxPQUFPLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQztBQUMvQixJQUFJLGNBQWMsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDO0FBQzdDLElBQUksT0FBTyxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUM7QUFDL0IsSUFBSSxJQUFJLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQztBQUN6QixJQUFJLFNBQVMsR0FBRyxRQUFRLENBQUMsU0FBUyxDQUFDO0FBQ25DLElBQUksT0FBTyxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUM7QUFDL0IsSUFBSSxnQkFBZ0IsR0FBRyxRQUFRLENBQUMsZ0JBQWdCLENBQUM7QUFDakQsSUFBSSxLQUFLLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQztBQUMzQixJQUFJLEdBQUcsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDO0FBQ3ZCLElBQUksU0FBUyxHQUFHLFFBQVEsQ0FBQyxTQUFTLENBQUM7QUFDbkMsSUFBSSxNQUFNLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQztBQUM3QixJQUFJLE1BQU0sR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDOztBQUU3QixJQUFJLGVBQWUsR0FBRyxPQUFPLENBQUMseUJBQXlCLENBQUMsQ0FBQztBQUN6RCxJQUFJLHNCQUFzQixHQUFHLE9BQU8sQ0FBQyxrREFBa0QsQ0FBQyxDQUFDO0FBQ3pGLElBQUksc0JBQXNCLEdBQUcsT0FBTyxDQUFDLGtEQUFrRCxDQUFDLENBQUM7QUFDekYsSUFBSSxpQkFBaUIsR0FBRyxPQUFPLENBQUMsMkJBQTJCLENBQUMsQ0FBQzs7QUFFN0QsSUFBSSxpREFBaUQsR0FBRyxTQUFTLGlEQUFpRCxDQUFDLHNCQUFzQixFQUFFO0FBQzNJLEVBQUUsSUFBSSx5QkFBeUIsR0FBRyxjQUFjLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLHNCQUFzQixFQUFFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDOztBQUVoSCxFQUFFLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDLENBQUM7O0VBRWpILE9BQU8sc0JBQXNCLENBQUM7QUFDaEMsQ0FBQyxDQUFDOztBQUVGLElBQUksMENBQTBDLEdBQUcsU0FBUywwQ0FBMEMsQ0FBQyxzQkFBc0IsRUFBRTtBQUM3SCxFQUFFLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQzs7QUFFbkIsRUFBRSxJQUFJLHVCQUF1QixHQUFHLGNBQWMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixFQUFFLHNCQUFzQixDQUFDLENBQUM7O0VBRTVHLE9BQU8sQ0FBQyxVQUFVLElBQUksRUFBRTtJQUN0QixJQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO0FBQ25DLElBQUksSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQzs7SUFFakIsU0FBUyxDQUFDLElBQUksSUFBSSxTQUFTLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDbkMsU0FBUyxDQUFDLFVBQVUsRUFBRSxDQUFDO0lBQ3ZCLEtBQUssQ0FBQyxpQkFBaUIsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsaUJBQWlCLENBQUMsRUFBRSxDQUFDLEVBQUUsS0FBSyxDQUFDLGlCQUFpQixDQUFDLENBQUM7QUFDdkgsR0FBRyxFQUFFLHVCQUF1QixDQUFDLENBQUM7O0VBRTVCLE9BQU8sc0JBQXNCLENBQUM7QUFDaEMsQ0FBQyxDQUFDOztBQUVGLElBQUksMENBQTBDLEdBQUcsU0FBUywwQ0FBMEMsQ0FBQyxzQkFBc0IsRUFBRTtBQUM3SCxFQUFFLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQzs7QUFFcEIsRUFBRSxJQUFJLFlBQVksR0FBRyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsc0JBQXNCLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUM7O0VBRW5HLE9BQU8sQ0FBQyxVQUFVLHFCQUFxQixFQUFFO0lBQ3ZDLElBQUksZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUscUJBQXFCLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsaUJBQWlCLENBQUMsQ0FBQztJQUM5RixnQkFBZ0IsQ0FBQyxlQUFlLENBQUMscUJBQXFCLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDbkUsR0FBRyxFQUFFLFlBQVksQ0FBQyxDQUFDOztFQUVqQixPQUFPLHNCQUFzQixDQUFDO0FBQ2hDLENBQUMsQ0FBQzs7QUFFRixJQUFJLGlCQUFpQixHQUFHLENBQUMsWUFBWTtFQUNuQyxTQUFTLGlCQUFpQixHQUFHO0FBQy9CLElBQUksSUFBSSxNQUFNLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxLQUFLLFNBQVMsR0FBRyxFQUFFLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDOztBQUVoRSxJQUFJLGVBQWUsQ0FBQyxJQUFJLEVBQUUsaUJBQWlCLENBQUMsQ0FBQzs7SUFFekMsSUFBSSxDQUFDLFlBQVksR0FBRyxNQUFNLENBQUMsWUFBWSxJQUFJLElBQUksWUFBWSxFQUFFLENBQUM7SUFDOUQsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDO0lBQzdELElBQUksQ0FBQyxpQkFBaUIsR0FBRyxFQUFFLENBQUM7QUFDaEMsSUFBSSxJQUFJLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQzs7SUFFdEIsSUFBSSxDQUFDLHNCQUFzQixHQUFHLE9BQU8sQ0FBQyxpREFBaUQsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsMENBQTBDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLDBDQUEwQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQ3ROLEdBQUc7O0VBRUQsWUFBWSxDQUFDLGlCQUFpQixFQUFFLENBQUM7SUFDL0IsR0FBRyxFQUFFLHlCQUF5QjtJQUM5QixLQUFLLEVBQUUsU0FBUyx1QkFBdUIsQ0FBQyx1QkFBdUIsRUFBRTtBQUNyRSxNQUFNLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQzs7TUFFbEIsSUFBSSxpQ0FBaUMsR0FBRyxTQUFTLENBQUMsVUFBVSxLQUFLLEVBQUU7UUFDakUsSUFBSSxJQUFJLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQztRQUN0QixPQUFPLEtBQUssQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDL0MsT0FBTyxFQUFFLHVCQUF1QixDQUFDLENBQUM7O01BRTVCLElBQUksNEJBQTRCLEdBQUcsaUNBQWlDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDOUUsTUFBTSxJQUFJLDRCQUE0QixHQUFHLGlDQUFpQyxDQUFDLENBQUMsQ0FBQyxDQUFDOztNQUV4RSxJQUFJLHVCQUF1QixHQUFHLEdBQUcsQ0FBQyxVQUFVLHNCQUFzQixFQUFFO1FBQ2xFLE9BQU8sSUFBSSxzQkFBc0IsQ0FBQyxNQUFNLEVBQUUsc0JBQXNCLENBQUMsQ0FBQztPQUNuRSxFQUFFLDRCQUE0QixDQUFDLENBQUM7TUFDakMsSUFBSSx1QkFBdUIsR0FBRyxHQUFHLENBQUMsVUFBVSxzQkFBc0IsRUFBRTtRQUNsRSxPQUFPLElBQUksc0JBQXNCLENBQUMsTUFBTSxFQUFFLHNCQUFzQixDQUFDLENBQUM7QUFDMUUsT0FBTyxFQUFFLDRCQUE0QixDQUFDLENBQUM7O01BRWpDLE9BQU8sTUFBTSxDQUFDLHVCQUF1QixFQUFFLHVCQUF1QixDQUFDLENBQUM7S0FDakU7R0FDRixFQUFFO0lBQ0QsR0FBRyxFQUFFLFlBQVk7SUFDakIsS0FBSyxFQUFFLFNBQVMsVUFBVSxDQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUU7TUFDdkMsSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsR0FBRyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRTtRQUN2RCxNQUFNLElBQUksS0FBSyxDQUFDLEVBQUUsR0FBRyxJQUFJLEdBQUcsMERBQTBELENBQUMsQ0FBQztPQUN6RjtNQUNELElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEdBQUcsWUFBWTtRQUNuQyxPQUFPLE1BQU0sQ0FBQztPQUNmLENBQUM7TUFDRixPQUFPLElBQUksQ0FBQztLQUNiO0dBQ0YsRUFBRTtJQUNELEdBQUcsRUFBRSxRQUFRO0lBQ2IsS0FBSyxFQUFFLFNBQVMsTUFBTSxDQUFDLHNCQUFzQixFQUFFO0FBQ25ELE1BQU0sSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDOztNQUVsQixJQUFJLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxFQUFFLHNCQUFzQixDQUFDLEVBQUU7UUFDeEQsTUFBTSxJQUFJLEtBQUssQ0FBQyxzR0FBc0csQ0FBQyxDQUFDO0FBQ2hJLE9BQU87O01BRUQsSUFBSSxDQUFDLHNCQUFzQixDQUFDLHNCQUFzQixDQUFDLENBQUM7TUFDcEQsaUJBQWlCLENBQUMsc0JBQXNCLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixFQUFFLFVBQVUsZ0JBQWdCLEVBQUU7UUFDNUYsT0FBTyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3ZELE9BQU8sQ0FBQyxDQUFDOztNQUVILE9BQU8sSUFBSSxDQUFDO0tBQ2I7QUFDTCxHQUFHLENBQUMsQ0FBQyxDQUFDOztFQUVKLE9BQU8saUJBQWlCLENBQUM7QUFDM0IsQ0FBQyxHQUFHLENBQUM7O0FBRUwsTUFBTSxDQUFDLE9BQU8sR0FBRyxpQkFBaUIsQ0FBQztBQUNuQzs7O0FDeElBLFlBQVksQ0FBQzs7QUFFYixNQUFNLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0FBQ2hEOzs7QUNIQSxZQUFZLENBQUM7O0FBRWIsTUFBTSxDQUFDLE9BQU8sR0FBRyxVQUFVLEdBQUcsRUFBRTtFQUM5QixPQUFPLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0NBQzVDLENBQUM7QUFDRjs7O0FDTEEsWUFBWSxDQUFDOztBQUViLElBQUksUUFBUSxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQzs7QUFFaEMsSUFBSSxJQUFJLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQztBQUN6QixJQUFJLE9BQU8sR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDO0FBQy9CLElBQUksTUFBTSxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUM7O0FBRTdCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsVUFBVSxzQkFBc0IsRUFBRSxpQkFBaUIsRUFBRTtFQUNwRSxJQUFJLHdCQUF3QixHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsS0FBSyxTQUFTLEdBQUcsWUFBWSxFQUFFLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQzFGLE9BQU8sT0FBTyxDQUFDLFVBQVUsZ0JBQWdCLEVBQUU7SUFDekMsT0FBTyxDQUFDLFVBQVUsVUFBVSxFQUFFO01BQzVCLElBQUksVUFBVSxLQUFLLFFBQVEsRUFBRTtRQUMzQix3QkFBd0IsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO09BQzVDLE1BQU07UUFDTCxJQUFJLDJCQUEyQixHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLENBQUMsQ0FBQztRQUNwRixJQUFJLDJCQUEyQixZQUFZLHNCQUFzQixFQUFFO1VBQ2pFLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEVBQUUsMkJBQTJCLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDOUYsTUFBTTtVQUNMLGdCQUFnQixDQUFDLE9BQU8sQ0FBQywyQkFBMkIsQ0FBQyxTQUFTLENBQUMsQ0FBQztTQUNqRTtPQUNGO0tBQ0YsRUFBRSxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztHQUM3QixFQUFFLGlCQUFpQixDQUFDLENBQUM7Q0FDdkIsQ0FBQztBQUNGOzs7QUN6QkEsWUFBWSxDQUFDOztBQUViLElBQUksZUFBZSxHQUFHLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDOztBQUVuRCxJQUFJLGdCQUFnQixHQUFHO0VBQ3JCLEtBQUssRUFBRSxjQUFjO0FBQ3ZCLENBQUMsQ0FBQzs7QUFFRixNQUFNLENBQUMsT0FBTyxHQUFHLFVBQVUsWUFBWSxFQUFFLElBQUksRUFBRSxpQkFBaUIsRUFBRTtFQUNoRSxJQUFJLG9CQUFvQixHQUFHLGdCQUFnQixDQUFDLElBQUksQ0FBQyxDQUFDO0VBQ2xELElBQUksU0FBUyxHQUFHLG9CQUFvQixHQUFHLFlBQVksQ0FBQyxRQUFRLEdBQUcsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsaUJBQWlCLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxHQUFHLFlBQVksQ0FBQyxRQUFRLEdBQUcsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQztFQUNsTCxJQUFJLElBQUksS0FBSyxZQUFZLEVBQUU7SUFDekIsU0FBUyxDQUFDLEtBQUssRUFBRSxDQUFDO0dBQ25CO0VBQ0QsT0FBTyxTQUFTLENBQUM7Q0FDbEIsQ0FBQztBQUNGOzs7QUNoQkEsWUFBWSxDQUFDOztBQUViLElBQUksWUFBWSxHQUFHLE9BQU8sQ0FBQyxvQ0FBb0MsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDOztBQUU1RSxJQUFJLGVBQWUsR0FBRyxPQUFPLENBQUMsd0NBQXdDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQzs7QUFFbkYsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDOztBQUVoQyxJQUFJLFFBQVEsR0FBRyxRQUFRLENBQUMsUUFBUSxDQUFDO0FBQ2pDLElBQUksTUFBTSxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUM7QUFDN0IsSUFBSSxPQUFPLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQztBQUMvQixJQUFJLElBQUksR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDO0FBQ3pCLElBQUksSUFBSSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUM7QUFDekIsSUFBSSxLQUFLLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQztBQUMzQixJQUFJLE1BQU0sR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDO0FBQzdCLElBQUksSUFBSSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUM7O0FBRXpCLElBQUksaUJBQWlCLEdBQUcsT0FBTyxDQUFDLDRCQUE0QixDQUFDLENBQUM7QUFDOUQsa0NBQWtDO0FBQ2xDLGtDQUFrQztBQUNsQyxvQkFBb0I7QUFDcEIsS0FBSzs7QUFFTCxNQUFNLENBQUMsT0FBTyxHQUFHLENBQUMsWUFBWTtFQUM1QixTQUFTLHNCQUFzQixDQUFDLGlCQUFpQixFQUFFLGlCQUFpQixFQUFFO0FBQ3hFLElBQUksZUFBZSxDQUFDLElBQUksRUFBRSxzQkFBc0IsQ0FBQyxDQUFDOztJQUU5QyxJQUFJLElBQUksR0FBRyxpQkFBaUIsQ0FBQyxJQUFJLENBQUM7SUFDbEMsSUFBSSxFQUFFLEdBQUcsaUJBQWlCLENBQUMsRUFBRSxDQUFDO0FBQ2xDLElBQUksSUFBSSxNQUFNLEdBQUcsaUJBQWlCLENBQUMsTUFBTSxDQUFDO0FBQzFDO0FBQ0E7QUFDQTtBQUNBOztJQUVJLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxpQkFBaUIsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQztJQUMvRCxJQUFJLENBQUMsaUJBQWlCLEdBQUcsaUJBQWlCLENBQUMsdUJBQXVCLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUM7SUFDM0YsaUJBQWlCLENBQUMsc0JBQXNCLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUM7SUFDbEUsSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUM7SUFDYixJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEdBQUcsTUFBTSxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDNUQsR0FBRzs7RUFFRCxZQUFZLENBQUMsc0JBQXNCLEVBQUUsQ0FBQztJQUNwQyxHQUFHLEVBQUUsU0FBUztJQUNkLEtBQUssRUFBRSxTQUFTLE9BQU8sQ0FBQyxXQUFXLEVBQUU7TUFDbkMsSUFBSSxrQkFBa0IsR0FBRyxNQUFNLENBQUMsVUFBVSxJQUFJLEVBQUU7UUFDOUMsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUN6QixPQUFPLFFBQVEsQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7T0FDbkMsRUFBRSxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQztNQUMzQixPQUFPLENBQUMsVUFBVSxTQUFTLEVBQUU7UUFDM0IsT0FBTyxTQUFTLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDO09BQ3ZDLEVBQUUsS0FBSyxDQUFDLFdBQVcsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDLENBQUM7S0FDNUM7R0FDRixFQUFFO0lBQ0QsR0FBRyxFQUFFLGlCQUFpQjtJQUN0QixLQUFLLEVBQUUsU0FBUyxlQUFlLENBQUMsTUFBTSxFQUFFLEVBQUU7R0FDM0MsRUFBRTtJQUNELEdBQUcsRUFBRSxRQUFRO0lBQ2IsR0FBRyxFQUFFLFlBQVk7TUFDZixPQUFPLEtBQUssQ0FBQyxXQUFXLEVBQUUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQztLQUNyRjtBQUNMLEdBQUcsQ0FBQyxDQUFDLENBQUM7O0VBRUosT0FBTyxzQkFBc0IsQ0FBQztBQUNoQyxDQUFDLEdBQUcsQ0FBQzs7QUFFTCwyQ0FBMkM7QUFDM0M7OztBQ25FQSxZQUFZLENBQUM7O0FBRWIsSUFBSSxZQUFZLEdBQUcsT0FBTyxDQUFDLG9DQUFvQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUM7O0FBRTVFLElBQUksZUFBZSxHQUFHLE9BQU8sQ0FBQyx3Q0FBd0MsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDOztBQUVuRixJQUFJLGVBQWUsR0FBRyxPQUFPLENBQUMsMEJBQTBCLENBQUMsQ0FBQzs7QUFFMUQsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDOztBQUVoQyxJQUFJLE9BQU8sR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDO0FBQy9CLElBQUksSUFBSSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUM7QUFDekIsSUFBSSxJQUFJLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQztBQUN6QixJQUFJLElBQUksR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDOztBQUV6QixJQUFJLHFCQUFxQixHQUFHLENBQUMsY0FBYyxDQUFDLENBQUM7O0FBRTdDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsQ0FBQyxZQUFZO0VBQzVCLFNBQVMsc0JBQXNCLENBQUMsaUJBQWlCLEVBQUUsaUJBQWlCLEVBQUU7QUFDeEUsSUFBSSxlQUFlLENBQUMsSUFBSSxFQUFFLHNCQUFzQixDQUFDLENBQUM7O0lBRTlDLElBQUksSUFBSSxHQUFHLGlCQUFpQixDQUFDLElBQUksQ0FBQztJQUNsQyxJQUFJLEVBQUUsR0FBRyxpQkFBaUIsQ0FBQyxFQUFFLENBQUM7SUFDOUIsSUFBSSxLQUFLLEdBQUcsaUJBQWlCLENBQUMsS0FBSyxDQUFDO0lBQ3BDLElBQUksTUFBTSxHQUFHLGlCQUFpQixDQUFDLE1BQU0sQ0FBQztBQUMxQyxJQUFJLElBQUksTUFBTSxHQUFHLGlCQUFpQixDQUFDLE1BQU0sQ0FBQzs7SUFFdEMsTUFBTSxHQUFHLE1BQU0sSUFBSSxFQUFFLENBQUM7SUFDdEIsSUFBSSxpQkFBaUIsR0FBRyxJQUFJLENBQUMscUJBQXFCLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDNUQsTUFBTSxHQUFHLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUM3QyxJQUFJLENBQUMsU0FBUyxHQUFHLGVBQWUsQ0FBQyxpQkFBaUIsQ0FBQyxZQUFZLEVBQUUsSUFBSSxFQUFFLGlCQUFpQixDQUFDLENBQUM7SUFDMUYsSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUM3QixJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQztJQUNiLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0lBQ25CLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsR0FBRyxNQUFNLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUN4RCxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztBQUN6QixHQUFHOztFQUVELFlBQVksQ0FBQyxzQkFBc0IsRUFBRSxDQUFDO0lBQ3BDLEdBQUcsRUFBRSxTQUFTO0lBQ2QsS0FBSyxFQUFFLFNBQVMsT0FBTyxDQUFDLFdBQVcsRUFBRTtNQUNuQyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQztLQUNyQztHQUNGLEVBQUU7SUFDRCxHQUFHLEVBQUUsaUJBQWlCO0lBQ3RCLEtBQUssRUFBRSxTQUFTLGVBQWUsQ0FBQyxNQUFNLEVBQUU7QUFDNUMsTUFBTSxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUM7O01BRWpCLE1BQU0sR0FBRyxJQUFJLENBQUMscUJBQXFCLEVBQUUsTUFBTSxDQUFDLENBQUM7TUFDN0MsT0FBTyxDQUFDLFVBQVUsR0FBRyxFQUFFO1FBQ3JCLFFBQVEsR0FBRztVQUNULEtBQUssTUFBTTtZQUNULEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ25DLE9BQU87VUFDVDtZQUNFLEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUN6QyxPQUFPO1NBQ1Y7T0FDRixFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0tBQ2xCO0FBQ0wsR0FBRyxDQUFDLENBQUMsQ0FBQzs7RUFFSixPQUFPLHNCQUFzQixDQUFDO0NBQy9CLEdBQUcsQ0FBQztBQUNMIiwiZmlsZSI6InNwZWMuanMiLCJzb3VyY2VSb290IjoiL3NvdXJjZS8iLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIm1vZHVsZS5leHBvcnRzID0geyBcImRlZmF1bHRcIjogcmVxdWlyZShcImNvcmUtanMvbGlicmFyeS9mbi9vYmplY3QvZGVmaW5lLXByb3BlcnR5XCIpLCBfX2VzTW9kdWxlOiB0cnVlIH07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gZnVuY3Rpb24gKGluc3RhbmNlLCBDb25zdHJ1Y3Rvcikge1xuICBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7XG4gIH1cbn07XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBfT2JqZWN0JGRlZmluZVByb3BlcnR5ID0gcmVxdWlyZShcImJhYmVsLXJ1bnRpbWUvY29yZS1qcy9vYmplY3QvZGVmaW5lLXByb3BlcnR5XCIpW1wiZGVmYXVsdFwiXTtcblxuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSAoZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldO1xuICAgICAgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlO1xuICAgICAgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlO1xuICAgICAgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTtcblxuICAgICAgX09iamVjdCRkZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykge1xuICAgIGlmIChwcm90b1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7XG4gICAgaWYgKHN0YXRpY1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7XG4gICAgcmV0dXJuIENvbnN0cnVjdG9yO1xuICB9O1xufSkoKTtcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTsiLCJ2YXIgJCA9IHJlcXVpcmUoJy4uLy4uL21vZHVsZXMvJCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0eShpdCwga2V5LCBkZXNjKXtcbiAgcmV0dXJuICQuc2V0RGVzYyhpdCwga2V5LCBkZXNjKTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigkKXtcbiAgJC5GVyAgID0gZmFsc2U7XG4gICQucGF0aCA9ICQuY29yZTtcbiAgcmV0dXJuICQ7XG59OyIsIid1c2Ugc3RyaWN0JztcbnZhciBnbG9iYWwgPSB0eXBlb2Ygc2VsZiAhPSAndW5kZWZpbmVkJyA/IHNlbGYgOiBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpXG4gICwgY29yZSAgID0ge31cbiAgLCBkZWZpbmVQcm9wZXJ0eSA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0eVxuICAsIGhhc093blByb3BlcnR5ID0ge30uaGFzT3duUHJvcGVydHlcbiAgLCBjZWlsICA9IE1hdGguY2VpbFxuICAsIGZsb29yID0gTWF0aC5mbG9vclxuICAsIG1heCAgID0gTWF0aC5tYXhcbiAgLCBtaW4gICA9IE1hdGgubWluO1xuLy8gVGhlIGVuZ2luZSB3b3JrcyBmaW5lIHdpdGggZGVzY3JpcHRvcnM/IFRoYW5rJ3MgSUU4IGZvciBoaXMgZnVubnkgZGVmaW5lUHJvcGVydHkuXG52YXIgREVTQyA9ICEhZnVuY3Rpb24oKXtcbiAgdHJ5IHtcbiAgICByZXR1cm4gZGVmaW5lUHJvcGVydHkoe30sICdhJywge2dldDogZnVuY3Rpb24oKXsgcmV0dXJuIDI7IH19KS5hID09IDI7XG4gIH0gY2F0Y2goZSl7IC8qIGVtcHR5ICovIH1cbn0oKTtcbnZhciBoaWRlID0gY3JlYXRlRGVmaW5lcigxKTtcbi8vIDcuMS40IFRvSW50ZWdlclxuZnVuY3Rpb24gdG9JbnRlZ2VyKGl0KXtcbiAgcmV0dXJuIGlzTmFOKGl0ID0gK2l0KSA/IDAgOiAoaXQgPiAwID8gZmxvb3IgOiBjZWlsKShpdCk7XG59XG5mdW5jdGlvbiBkZXNjKGJpdG1hcCwgdmFsdWUpe1xuICByZXR1cm4ge1xuICAgIGVudW1lcmFibGUgIDogIShiaXRtYXAgJiAxKSxcbiAgICBjb25maWd1cmFibGU6ICEoYml0bWFwICYgMiksXG4gICAgd3JpdGFibGUgICAgOiAhKGJpdG1hcCAmIDQpLFxuICAgIHZhbHVlICAgICAgIDogdmFsdWVcbiAgfTtcbn1cbmZ1bmN0aW9uIHNpbXBsZVNldChvYmplY3QsIGtleSwgdmFsdWUpe1xuICBvYmplY3Rba2V5XSA9IHZhbHVlO1xuICByZXR1cm4gb2JqZWN0O1xufVxuZnVuY3Rpb24gY3JlYXRlRGVmaW5lcihiaXRtYXApe1xuICByZXR1cm4gREVTQyA/IGZ1bmN0aW9uKG9iamVjdCwga2V5LCB2YWx1ZSl7XG4gICAgcmV0dXJuICQuc2V0RGVzYyhvYmplY3QsIGtleSwgZGVzYyhiaXRtYXAsIHZhbHVlKSk7XG4gIH0gOiBzaW1wbGVTZXQ7XG59XG5cbmZ1bmN0aW9uIGlzT2JqZWN0KGl0KXtcbiAgcmV0dXJuIGl0ICE9PSBudWxsICYmICh0eXBlb2YgaXQgPT0gJ29iamVjdCcgfHwgdHlwZW9mIGl0ID09ICdmdW5jdGlvbicpO1xufVxuZnVuY3Rpb24gaXNGdW5jdGlvbihpdCl7XG4gIHJldHVybiB0eXBlb2YgaXQgPT0gJ2Z1bmN0aW9uJztcbn1cbmZ1bmN0aW9uIGFzc2VydERlZmluZWQoaXQpe1xuICBpZihpdCA9PSB1bmRlZmluZWQpdGhyb3cgVHlwZUVycm9yKFwiQ2FuJ3QgY2FsbCBtZXRob2Qgb24gIFwiICsgaXQpO1xuICByZXR1cm4gaXQ7XG59XG5cbnZhciAkID0gbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuLyQuZncnKSh7XG4gIGc6IGdsb2JhbCxcbiAgY29yZTogY29yZSxcbiAgaHRtbDogZ2xvYmFsLmRvY3VtZW50ICYmIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCxcbiAgLy8gaHR0cDovL2pzcGVyZi5jb20vY29yZS1qcy1pc29iamVjdFxuICBpc09iamVjdDogICBpc09iamVjdCxcbiAgaXNGdW5jdGlvbjogaXNGdW5jdGlvbixcbiAgdGhhdDogZnVuY3Rpb24oKXtcbiAgICByZXR1cm4gdGhpcztcbiAgfSxcbiAgLy8gNy4xLjQgVG9JbnRlZ2VyXG4gIHRvSW50ZWdlcjogdG9JbnRlZ2VyLFxuICAvLyA3LjEuMTUgVG9MZW5ndGhcbiAgdG9MZW5ndGg6IGZ1bmN0aW9uKGl0KXtcbiAgICByZXR1cm4gaXQgPiAwID8gbWluKHRvSW50ZWdlcihpdCksIDB4MWZmZmZmZmZmZmZmZmYpIDogMDsgLy8gcG93KDIsIDUzKSAtIDEgPT0gOTAwNzE5OTI1NDc0MDk5MVxuICB9LFxuICB0b0luZGV4OiBmdW5jdGlvbihpbmRleCwgbGVuZ3RoKXtcbiAgICBpbmRleCA9IHRvSW50ZWdlcihpbmRleCk7XG4gICAgcmV0dXJuIGluZGV4IDwgMCA/IG1heChpbmRleCArIGxlbmd0aCwgMCkgOiBtaW4oaW5kZXgsIGxlbmd0aCk7XG4gIH0sXG4gIGhhczogZnVuY3Rpb24oaXQsIGtleSl7XG4gICAgcmV0dXJuIGhhc093blByb3BlcnR5LmNhbGwoaXQsIGtleSk7XG4gIH0sXG4gIGNyZWF0ZTogICAgIE9iamVjdC5jcmVhdGUsXG4gIGdldFByb3RvOiAgIE9iamVjdC5nZXRQcm90b3R5cGVPZixcbiAgREVTQzogICAgICAgREVTQyxcbiAgZGVzYzogICAgICAgZGVzYyxcbiAgZ2V0RGVzYzogICAgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcixcbiAgc2V0RGVzYzogICAgZGVmaW5lUHJvcGVydHksXG4gIHNldERlc2NzOiAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzLFxuICBnZXRLZXlzOiAgICBPYmplY3Qua2V5cyxcbiAgZ2V0TmFtZXM6ICAgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMsXG4gIGdldFN5bWJvbHM6IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMsXG4gIGFzc2VydERlZmluZWQ6IGFzc2VydERlZmluZWQsXG4gIC8vIER1bW15LCBmaXggZm9yIG5vdCBhcnJheS1saWtlIEVTMyBzdHJpbmcgaW4gZXM1IG1vZHVsZVxuICBFUzVPYmplY3Q6IE9iamVjdCxcbiAgdG9PYmplY3Q6IGZ1bmN0aW9uKGl0KXtcbiAgICByZXR1cm4gJC5FUzVPYmplY3QoYXNzZXJ0RGVmaW5lZChpdCkpO1xuICB9LFxuICBoaWRlOiBoaWRlLFxuICBkZWY6IGNyZWF0ZURlZmluZXIoMCksXG4gIHNldDogZ2xvYmFsLlN5bWJvbCA/IHNpbXBsZVNldCA6IGhpZGUsXG4gIGVhY2g6IFtdLmZvckVhY2hcbn0pO1xuLyogZXNsaW50LWRpc2FibGUgbm8tdW5kZWYgKi9cbmlmKHR5cGVvZiBfX2UgIT0gJ3VuZGVmaW5lZCcpX19lID0gY29yZTtcbmlmKHR5cGVvZiBfX2cgIT0gJ3VuZGVmaW5lZCcpX19nID0gZ2xvYmFsOyIsIi8vICBSYW1kYSB2MC4xNS4wXG4vLyAgaHR0cHM6Ly9naXRodWIuY29tL3JhbWRhL3JhbWRhXG4vLyAgKGMpIDIwMTMtMjAxNSBTY290dCBTYXV5ZXQsIE1pY2hhZWwgSHVybGV5LCBhbmQgRGF2aWQgQ2hhbWJlcnNcbi8vICBSYW1kYSBtYXkgYmUgZnJlZWx5IGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cblxuOyhmdW5jdGlvbigpIHtcblxuICAndXNlIHN0cmljdCc7XG5cbiAgLyoqXG4gICAgICogQSBzcGVjaWFsIHBsYWNlaG9sZGVyIHZhbHVlIHVzZWQgdG8gc3BlY2lmeSBcImdhcHNcIiB3aXRoaW4gY3VycmllZCBmdW5jdGlvbnMsXG4gICAgICogYWxsb3dpbmcgcGFydGlhbCBhcHBsaWNhdGlvbiBvZiBhbnkgY29tYmluYXRpb24gb2YgYXJndW1lbnRzLFxuICAgICAqIHJlZ2FyZGxlc3Mgb2YgdGhlaXIgcG9zaXRpb25zLlxuICAgICAqXG4gICAgICogSWYgYGdgIGlzIGEgY3VycmllZCB0ZXJuYXJ5IGZ1bmN0aW9uIGFuZCBgX2AgaXMgYFIuX19gLCB0aGUgZm9sbG93aW5nIGFyZSBlcXVpdmFsZW50OlxuICAgICAqXG4gICAgICogICAtIGBnKDEsIDIsIDMpYFxuICAgICAqICAgLSBgZyhfLCAyLCAzKSgxKWBcbiAgICAgKiAgIC0gYGcoXywgXywgMykoMSkoMilgXG4gICAgICogICAtIGBnKF8sIF8sIDMpKDEsIDIpYFxuICAgICAqICAgLSBgZyhfLCAyLCBfKSgxLCAzKWBcbiAgICAgKiAgIC0gYGcoXywgMikoMSkoMylgXG4gICAgICogICAtIGBnKF8sIDIpKDEsIDMpYFxuICAgICAqICAgLSBgZyhfLCAyKShfLCAzKSgxKWBcbiAgICAgKlxuICAgICAqIEBjb25zdGFudFxuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IEZ1bmN0aW9uXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgdmFyIGdyZWV0ID0gUi5yZXBsYWNlKCd7bmFtZX0nLCBSLl9fLCAnSGVsbG8sIHtuYW1lfSEnKTtcbiAgICAgKiAgICAgIGdyZWV0KCdBbGljZScpOyAvLz0+ICdIZWxsbywgQWxpY2UhJ1xuICAgICAqL1xuICAgIHZhciBfXyA9IHsgJ0BAZnVuY3Rpb25hbC9wbGFjZWhvbGRlcic6IHRydWUgfTtcblxuICAgIHZhciBfYWRkID0gZnVuY3Rpb24gX2FkZChhLCBiKSB7XG4gICAgICAgIHJldHVybiBhICsgYjtcbiAgICB9O1xuXG4gICAgdmFyIF9hbGwgPSBmdW5jdGlvbiBfYWxsKGZuLCBsaXN0KSB7XG4gICAgICAgIHZhciBpZHggPSAwO1xuICAgICAgICB3aGlsZSAoaWR4IDwgbGlzdC5sZW5ndGgpIHtcbiAgICAgICAgICAgIGlmICghZm4obGlzdFtpZHhdKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlkeCArPSAxO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH07XG5cbiAgICB2YXIgX2FueSA9IGZ1bmN0aW9uIF9hbnkoZm4sIGxpc3QpIHtcbiAgICAgICAgdmFyIGlkeCA9IDA7XG4gICAgICAgIHdoaWxlIChpZHggPCBsaXN0Lmxlbmd0aCkge1xuICAgICAgICAgICAgaWYgKGZuKGxpc3RbaWR4XSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlkeCArPSAxO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9O1xuXG4gICAgdmFyIF9hc3NvYyA9IGZ1bmN0aW9uIF9hc3NvYyhwcm9wLCB2YWwsIG9iaikge1xuICAgICAgICB2YXIgcmVzdWx0ID0ge307XG4gICAgICAgIGZvciAodmFyIHAgaW4gb2JqKSB7XG4gICAgICAgICAgICByZXN1bHRbcF0gPSBvYmpbcF07XG4gICAgICAgIH1cbiAgICAgICAgcmVzdWx0W3Byb3BdID0gdmFsO1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG5cbiAgICB2YXIgX2Nsb25lUmVnRXhwID0gZnVuY3Rpb24gX2Nsb25lUmVnRXhwKHBhdHRlcm4pIHtcbiAgICAgICAgcmV0dXJuIG5ldyBSZWdFeHAocGF0dGVybi5zb3VyY2UsIChwYXR0ZXJuLmdsb2JhbCA/ICdnJyA6ICcnKSArIChwYXR0ZXJuLmlnbm9yZUNhc2UgPyAnaScgOiAnJykgKyAocGF0dGVybi5tdWx0aWxpbmUgPyAnbScgOiAnJykgKyAocGF0dGVybi5zdGlja3kgPyAneScgOiAnJykgKyAocGF0dGVybi51bmljb2RlID8gJ3UnIDogJycpKTtcbiAgICB9O1xuXG4gICAgdmFyIF9jb21wbGVtZW50ID0gZnVuY3Rpb24gX2NvbXBsZW1lbnQoZikge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuICFmLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgIH07XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEJhc2ljLCByaWdodC1hc3NvY2lhdGl2ZSBjb21wb3NpdGlvbiBmdW5jdGlvbi4gQWNjZXB0cyB0d28gZnVuY3Rpb25zIGFuZCByZXR1cm5zIHRoZVxuICAgICAqIGNvbXBvc2l0ZSBmdW5jdGlvbjsgdGhpcyBjb21wb3NpdGUgZnVuY3Rpb24gcmVwcmVzZW50cyB0aGUgb3BlcmF0aW9uIGB2YXIgaCA9IGYoZyh4KSlgLFxuICAgICAqIHdoZXJlIGBmYCBpcyB0aGUgZmlyc3QgYXJndW1lbnQsIGBnYCBpcyB0aGUgc2Vjb25kIGFyZ3VtZW50LCBhbmQgYHhgIGlzIHdoYXRldmVyXG4gICAgICogYXJndW1lbnQocykgYXJlIHBhc3NlZCB0byBgaGAuXG4gICAgICpcbiAgICAgKiBUaGlzIGZ1bmN0aW9uJ3MgbWFpbiB1c2UgaXMgdG8gYnVpbGQgdGhlIG1vcmUgZ2VuZXJhbCBgY29tcG9zZWAgZnVuY3Rpb24sIHdoaWNoIGFjY2VwdHNcbiAgICAgKiBhbnkgbnVtYmVyIG9mIGZ1bmN0aW9ucy5cbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQGNhdGVnb3J5IEZ1bmN0aW9uXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gZiBBIGZ1bmN0aW9uLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGcgQSBmdW5jdGlvbi5cbiAgICAgKiBAcmV0dXJuIHtGdW5jdGlvbn0gQSBuZXcgZnVuY3Rpb24gdGhhdCBpcyB0aGUgZXF1aXZhbGVudCBvZiBgZihnKHgpKWAuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgdmFyIGRvdWJsZSA9IGZ1bmN0aW9uKHgpIHsgcmV0dXJuIHggKiAyOyB9O1xuICAgICAqICAgICAgdmFyIHNxdWFyZSA9IGZ1bmN0aW9uKHgpIHsgcmV0dXJuIHggKiB4OyB9O1xuICAgICAqICAgICAgdmFyIHNxdWFyZVRoZW5Eb3VibGUgPSBfY29tcG9zZShkb3VibGUsIHNxdWFyZSk7XG4gICAgICpcbiAgICAgKiAgICAgIHNxdWFyZVRoZW5Eb3VibGUoNSk7IC8v4omFIGRvdWJsZShzcXVhcmUoNSkpID0+IDUwXG4gICAgICovXG4gICAgdmFyIF9jb21wb3NlID0gZnVuY3Rpb24gX2NvbXBvc2UoZiwgZykge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIGYuY2FsbCh0aGlzLCBnLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpO1xuICAgICAgICB9O1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBQcml2YXRlIGBjb25jYXRgIGZ1bmN0aW9uIHRvIG1lcmdlIHR3byBhcnJheS1saWtlIG9iamVjdHMuXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEBwYXJhbSB7QXJyYXl8QXJndW1lbnRzfSBbc2V0MT1bXV0gQW4gYXJyYXktbGlrZSBvYmplY3QuXG4gICAgICogQHBhcmFtIHtBcnJheXxBcmd1bWVudHN9IFtzZXQyPVtdXSBBbiBhcnJheS1saWtlIG9iamVjdC5cbiAgICAgKiBAcmV0dXJuIHtBcnJheX0gQSBuZXcsIG1lcmdlZCBhcnJheS5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICBfY29uY2F0KFs0LCA1LCA2XSwgWzEsIDIsIDNdKTsgLy89PiBbNCwgNSwgNiwgMSwgMiwgM11cbiAgICAgKi9cbiAgICB2YXIgX2NvbmNhdCA9IGZ1bmN0aW9uIF9jb25jYXQoc2V0MSwgc2V0Mikge1xuICAgICAgICBzZXQxID0gc2V0MSB8fCBbXTtcbiAgICAgICAgc2V0MiA9IHNldDIgfHwgW107XG4gICAgICAgIHZhciBpZHg7XG4gICAgICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICAgICAgaWR4ID0gMDtcbiAgICAgICAgd2hpbGUgKGlkeCA8IHNldDEubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXN1bHRbcmVzdWx0Lmxlbmd0aF0gPSBzZXQxW2lkeF07XG4gICAgICAgICAgICBpZHggKz0gMTtcbiAgICAgICAgfVxuICAgICAgICBpZHggPSAwO1xuICAgICAgICB3aGlsZSAoaWR4IDwgc2V0Mi5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJlc3VsdFtyZXN1bHQubGVuZ3RoXSA9IHNldDJbaWR4XTtcbiAgICAgICAgICAgIGlkeCArPSAxO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcblxuICAgIHZhciBfY29udGFpbnNXaXRoID0gZnVuY3Rpb24gX2NvbnRhaW5zV2l0aChwcmVkLCB4LCBsaXN0KSB7XG4gICAgICAgIHZhciBpZHggPSAwO1xuICAgICAgICB3aGlsZSAoaWR4IDwgbGlzdC5sZW5ndGgpIHtcbiAgICAgICAgICAgIGlmIChwcmVkKHgsIGxpc3RbaWR4XSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlkeCArPSAxO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9O1xuXG4gICAgdmFyIF9jcmVhdGVNYXBFbnRyeSA9IGZ1bmN0aW9uIF9jcmVhdGVNYXBFbnRyeShrZXksIHZhbCkge1xuICAgICAgICB2YXIgb2JqID0ge307XG4gICAgICAgIG9ialtrZXldID0gdmFsO1xuICAgICAgICByZXR1cm4gb2JqO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGUgYSBmdW5jdGlvbiB3aGljaCB0YWtlcyBhIGNvbXBhcmF0b3IgZnVuY3Rpb24gYW5kIGEgbGlzdFxuICAgICAqIGFuZCBkZXRlcm1pbmVzIHRoZSB3aW5uaW5nIHZhbHVlIGJ5IGEgY29tcGF0YXRvci4gVXNlZCBpbnRlcm5hbGx5XG4gICAgICogYnkgYFIubWF4QnlgIGFuZCBgUi5taW5CeWBcbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gY29tcGF0YXRvciBhIGZ1bmN0aW9uIHRvIGNvbXBhcmUgdHdvIGl0ZW1zXG4gICAgICogQGNhdGVnb3J5IE1hdGhcbiAgICAgKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAgICAgKi9cbiAgICB2YXIgX2NyZWF0ZU1heE1pbkJ5ID0gZnVuY3Rpb24gX2NyZWF0ZU1heE1pbkJ5KGNvbXBhcmF0b3IpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICh2YWx1ZUNvbXB1dGVyLCBsaXN0KSB7XG4gICAgICAgICAgICBpZiAoIShsaXN0ICYmIGxpc3QubGVuZ3RoID4gMCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgaWR4ID0gMTtcbiAgICAgICAgICAgIHZhciB3aW5uZXIgPSBsaXN0W2lkeF07XG4gICAgICAgICAgICB2YXIgY29tcHV0ZWRXaW5uZXIgPSB2YWx1ZUNvbXB1dGVyKHdpbm5lcik7XG4gICAgICAgICAgICB2YXIgY29tcHV0ZWRDdXJyZW50O1xuICAgICAgICAgICAgd2hpbGUgKGlkeCA8IGxpc3QubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgY29tcHV0ZWRDdXJyZW50ID0gdmFsdWVDb21wdXRlcihsaXN0W2lkeF0pO1xuICAgICAgICAgICAgICAgIGlmIChjb21wYXJhdG9yKGNvbXB1dGVkQ3VycmVudCwgY29tcHV0ZWRXaW5uZXIpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbXB1dGVkV2lubmVyID0gY29tcHV0ZWRDdXJyZW50O1xuICAgICAgICAgICAgICAgICAgICB3aW5uZXIgPSBsaXN0W2lkeF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlkeCArPSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHdpbm5lcjtcbiAgICAgICAgfTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogT3B0aW1pemVkIGludGVybmFsIHR3by1hcml0eSBjdXJyeSBmdW5jdGlvbi5cbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQGNhdGVnb3J5IEZ1bmN0aW9uXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGZ1bmN0aW9uIHRvIGN1cnJ5LlxuICAgICAqIEByZXR1cm4ge0Z1bmN0aW9ufSBUaGUgY3VycmllZCBmdW5jdGlvbi5cbiAgICAgKi9cbiAgICB2YXIgX2N1cnJ5MSA9IGZ1bmN0aW9uIF9jdXJyeTEoZm4pIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIGYxKGEpIHtcbiAgICAgICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGYxO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChhICE9IG51bGwgJiYgYVsnQEBmdW5jdGlvbmFsL3BsYWNlaG9sZGVyJ10gPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZjE7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBmbihhKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogT3B0aW1pemVkIGludGVybmFsIHR3by1hcml0eSBjdXJyeSBmdW5jdGlvbi5cbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQGNhdGVnb3J5IEZ1bmN0aW9uXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGZ1bmN0aW9uIHRvIGN1cnJ5LlxuICAgICAqIEByZXR1cm4ge0Z1bmN0aW9ufSBUaGUgY3VycmllZCBmdW5jdGlvbi5cbiAgICAgKi9cbiAgICB2YXIgX2N1cnJ5MiA9IGZ1bmN0aW9uIF9jdXJyeTIoZm4pIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIGYyKGEsIGIpIHtcbiAgICAgICAgICAgIHZhciBuID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICAgICAgICAgIGlmIChuID09PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGYyO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChuID09PSAxICYmIGEgIT0gbnVsbCAmJiBhWydAQGZ1bmN0aW9uYWwvcGxhY2Vob2xkZXInXSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmMjtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobiA9PT0gMSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBfY3VycnkxKGZ1bmN0aW9uIChiKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmbihhLCBiKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobiA9PT0gMiAmJiBhICE9IG51bGwgJiYgYVsnQEBmdW5jdGlvbmFsL3BsYWNlaG9sZGVyJ10gPT09IHRydWUgJiYgYiAhPSBudWxsICYmIGJbJ0BAZnVuY3Rpb25hbC9wbGFjZWhvbGRlciddID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGYyO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChuID09PSAyICYmIGEgIT0gbnVsbCAmJiBhWydAQGZ1bmN0aW9uYWwvcGxhY2Vob2xkZXInXSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBfY3VycnkxKGZ1bmN0aW9uIChhKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmbihhLCBiKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobiA9PT0gMiAmJiBiICE9IG51bGwgJiYgYlsnQEBmdW5jdGlvbmFsL3BsYWNlaG9sZGVyJ10gPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gX2N1cnJ5MShmdW5jdGlvbiAoYikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZm4oYSwgYik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBmbihhLCBiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogT3B0aW1pemVkIGludGVybmFsIHRocmVlLWFyaXR5IGN1cnJ5IGZ1bmN0aW9uLlxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAY2F0ZWdvcnkgRnVuY3Rpb25cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgZnVuY3Rpb24gdG8gY3VycnkuXG4gICAgICogQHJldHVybiB7RnVuY3Rpb259IFRoZSBjdXJyaWVkIGZ1bmN0aW9uLlxuICAgICAqL1xuICAgIHZhciBfY3VycnkzID0gZnVuY3Rpb24gX2N1cnJ5Myhmbikge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gZjMoYSwgYiwgYykge1xuICAgICAgICAgICAgdmFyIG4gPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgICAgICAgICAgaWYgKG4gPT09IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZjM7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG4gPT09IDEgJiYgYSAhPSBudWxsICYmIGFbJ0BAZnVuY3Rpb25hbC9wbGFjZWhvbGRlciddID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGYzO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChuID09PSAxKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIF9jdXJyeTIoZnVuY3Rpb24gKGIsIGMpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZuKGEsIGIsIGMpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChuID09PSAyICYmIGEgIT0gbnVsbCAmJiBhWydAQGZ1bmN0aW9uYWwvcGxhY2Vob2xkZXInXSA9PT0gdHJ1ZSAmJiBiICE9IG51bGwgJiYgYlsnQEBmdW5jdGlvbmFsL3BsYWNlaG9sZGVyJ10gPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZjM7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG4gPT09IDIgJiYgYSAhPSBudWxsICYmIGFbJ0BAZnVuY3Rpb25hbC9wbGFjZWhvbGRlciddID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIF9jdXJyeTIoZnVuY3Rpb24gKGEsIGMpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZuKGEsIGIsIGMpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChuID09PSAyICYmIGIgIT0gbnVsbCAmJiBiWydAQGZ1bmN0aW9uYWwvcGxhY2Vob2xkZXInXSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBfY3VycnkyKGZ1bmN0aW9uIChiLCBjKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmbihhLCBiLCBjKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobiA9PT0gMikge1xuICAgICAgICAgICAgICAgIHJldHVybiBfY3VycnkxKGZ1bmN0aW9uIChjKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmbihhLCBiLCBjKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobiA9PT0gMyAmJiBhICE9IG51bGwgJiYgYVsnQEBmdW5jdGlvbmFsL3BsYWNlaG9sZGVyJ10gPT09IHRydWUgJiYgYiAhPSBudWxsICYmIGJbJ0BAZnVuY3Rpb25hbC9wbGFjZWhvbGRlciddID09PSB0cnVlICYmIGMgIT0gbnVsbCAmJiBjWydAQGZ1bmN0aW9uYWwvcGxhY2Vob2xkZXInXSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmMztcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobiA9PT0gMyAmJiBhICE9IG51bGwgJiYgYVsnQEBmdW5jdGlvbmFsL3BsYWNlaG9sZGVyJ10gPT09IHRydWUgJiYgYiAhPSBudWxsICYmIGJbJ0BAZnVuY3Rpb25hbC9wbGFjZWhvbGRlciddID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIF9jdXJyeTIoZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZuKGEsIGIsIGMpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChuID09PSAzICYmIGEgIT0gbnVsbCAmJiBhWydAQGZ1bmN0aW9uYWwvcGxhY2Vob2xkZXInXSA9PT0gdHJ1ZSAmJiBjICE9IG51bGwgJiYgY1snQEBmdW5jdGlvbmFsL3BsYWNlaG9sZGVyJ10gPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gX2N1cnJ5MihmdW5jdGlvbiAoYSwgYykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZm4oYSwgYiwgYyk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG4gPT09IDMgJiYgYiAhPSBudWxsICYmIGJbJ0BAZnVuY3Rpb25hbC9wbGFjZWhvbGRlciddID09PSB0cnVlICYmIGMgIT0gbnVsbCAmJiBjWydAQGZ1bmN0aW9uYWwvcGxhY2Vob2xkZXInXSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBfY3VycnkyKGZ1bmN0aW9uIChiLCBjKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmbihhLCBiLCBjKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobiA9PT0gMyAmJiBhICE9IG51bGwgJiYgYVsnQEBmdW5jdGlvbmFsL3BsYWNlaG9sZGVyJ10gPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gX2N1cnJ5MShmdW5jdGlvbiAoYSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZm4oYSwgYiwgYyk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG4gPT09IDMgJiYgYiAhPSBudWxsICYmIGJbJ0BAZnVuY3Rpb25hbC9wbGFjZWhvbGRlciddID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIF9jdXJyeTEoZnVuY3Rpb24gKGIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZuKGEsIGIsIGMpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChuID09PSAzICYmIGMgIT0gbnVsbCAmJiBjWydAQGZ1bmN0aW9uYWwvcGxhY2Vob2xkZXInXSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBfY3VycnkxKGZ1bmN0aW9uIChjKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmbihhLCBiLCBjKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZuKGEsIGIsIGMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH07XG5cbiAgICB2YXIgX2Rpc3NvYyA9IGZ1bmN0aW9uIF9kaXNzb2MocHJvcCwgb2JqKSB7XG4gICAgICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICAgICAgZm9yICh2YXIgcCBpbiBvYmopIHtcbiAgICAgICAgICAgIGlmIChwICE9PSBwcm9wKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0W3BdID0gb2JqW3BdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcblxuICAgIHZhciBfZmlsdGVyID0gZnVuY3Rpb24gX2ZpbHRlcihmbiwgbGlzdCkge1xuICAgICAgICB2YXIgaWR4ID0gMCwgcmVzdWx0ID0gW107XG4gICAgICAgIHdoaWxlIChpZHggPCBsaXN0Lmxlbmd0aCkge1xuICAgICAgICAgICAgaWYgKGZuKGxpc3RbaWR4XSkpIHtcbiAgICAgICAgICAgICAgICByZXN1bHRbcmVzdWx0Lmxlbmd0aF0gPSBsaXN0W2lkeF07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZHggKz0gMTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG5cbiAgICB2YXIgX2ZpbHRlckluZGV4ZWQgPSBmdW5jdGlvbiBfZmlsdGVySW5kZXhlZChmbiwgbGlzdCkge1xuICAgICAgICB2YXIgaWR4ID0gMCwgcmVzdWx0ID0gW107XG4gICAgICAgIHdoaWxlIChpZHggPCBsaXN0Lmxlbmd0aCkge1xuICAgICAgICAgICAgaWYgKGZuKGxpc3RbaWR4XSwgaWR4LCBsaXN0KSkge1xuICAgICAgICAgICAgICAgIHJlc3VsdFtyZXN1bHQubGVuZ3RoXSA9IGxpc3RbaWR4XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlkeCArPSAxO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcblxuICAgIC8vIGkgY2FuJ3QgYmVhciBub3QgdG8gcmV0dXJuICpzb21ldGhpbmcqXG4gICAgdmFyIF9mb3JFYWNoID0gZnVuY3Rpb24gX2ZvckVhY2goZm4sIGxpc3QpIHtcbiAgICAgICAgdmFyIGlkeCA9IDA7XG4gICAgICAgIHdoaWxlIChpZHggPCBsaXN0Lmxlbmd0aCkge1xuICAgICAgICAgICAgZm4obGlzdFtpZHhdKTtcbiAgICAgICAgICAgIGlkeCArPSAxO1xuICAgICAgICB9XG4gICAgICAgIC8vIGkgY2FuJ3QgYmVhciBub3QgdG8gcmV0dXJuICpzb21ldGhpbmcqXG4gICAgICAgIHJldHVybiBsaXN0O1xuICAgIH07XG5cbiAgICB2YXIgX2ZvcmNlUmVkdWNlZCA9IGZ1bmN0aW9uIF9mb3JjZVJlZHVjZWQoeCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgJ0BAdHJhbnNkdWNlci92YWx1ZSc6IHgsXG4gICAgICAgICAgICAnQEB0cmFuc2R1Y2VyL3JlZHVjZWQnOiB0cnVlXG4gICAgICAgIH07XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIHN0cmF0ZWd5IGZvciBleHRyYWN0aW5nIGZ1bmN0aW9uIG5hbWVzIGZyb20gYW4gb2JqZWN0XG4gICAgICogQHJldHVybiB7RnVuY3Rpb259IEEgZnVuY3Rpb24gdGhhdCB0YWtlcyBhbiBvYmplY3QgYW5kIHJldHVybnMgYW4gYXJyYXkgb2YgZnVuY3Rpb24gbmFtZXMuXG4gICAgICovXG4gICAgdmFyIF9mdW5jdGlvbnNXaXRoID0gZnVuY3Rpb24gX2Z1bmN0aW9uc1dpdGgoZm4pIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgICAgIHJldHVybiBfZmlsdGVyKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHlwZW9mIG9ialtrZXldID09PSAnZnVuY3Rpb24nO1xuICAgICAgICAgICAgfSwgZm4ob2JqKSk7XG4gICAgICAgIH07XG4gICAgfTtcblxuICAgIHZhciBfZ3QgPSBmdW5jdGlvbiBfZ3QoYSwgYikge1xuICAgICAgICByZXR1cm4gYSA+IGI7XG4gICAgfTtcblxuICAgIHZhciBfaGFzID0gZnVuY3Rpb24gX2hhcyhwcm9wLCBvYmopIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApO1xuICAgIH07XG5cbiAgICB2YXIgX2lkZW50aXR5ID0gZnVuY3Rpb24gX2lkZW50aXR5KHgpIHtcbiAgICAgICAgcmV0dXJuIHg7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFRlc3RzIHdoZXRoZXIgb3Igbm90IGFuIG9iamVjdCBpcyBhbiBhcnJheS5cbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHBhcmFtIHsqfSB2YWwgVGhlIG9iamVjdCB0byB0ZXN0LlxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59IGB0cnVlYCBpZiBgdmFsYCBpcyBhbiBhcnJheSwgYGZhbHNlYCBvdGhlcndpc2UuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgX2lzQXJyYXkoW10pOyAvLz0+IHRydWVcbiAgICAgKiAgICAgIF9pc0FycmF5KG51bGwpOyAvLz0+IGZhbHNlXG4gICAgICogICAgICBfaXNBcnJheSh7fSk7IC8vPT4gZmFsc2VcbiAgICAgKi9cbiAgICB2YXIgX2lzQXJyYXkgPSBBcnJheS5pc0FycmF5IHx8IGZ1bmN0aW9uIF9pc0FycmF5KHZhbCkge1xuICAgICAgICByZXR1cm4gdmFsICE9IG51bGwgJiYgdmFsLmxlbmd0aCA+PSAwICYmIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWwpID09PSAnW29iamVjdCBBcnJheV0nO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBEZXRlcm1pbmUgaWYgdGhlIHBhc3NlZCBhcmd1bWVudCBpcyBhbiBpbnRlZ2VyLlxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAcGFyYW0geyp9IG5cbiAgICAgKiBAY2F0ZWdvcnkgVHlwZVxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAgICovXG4gICAgdmFyIF9pc0ludGVnZXIgPSBOdW1iZXIuaXNJbnRlZ2VyIHx8IGZ1bmN0aW9uIF9pc0ludGVnZXIobikge1xuICAgICAgICByZXR1cm4gbiA8PCAwID09PSBuO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBUZXN0cyBpZiBhIHZhbHVlIGlzIGEgdGhlbmFibGUgKHByb21pc2UpLlxuICAgICAqL1xuICAgIHZhciBfaXNUaGVuYWJsZSA9IGZ1bmN0aW9uIF9pc1RoZW5hYmxlKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZSAhPSBudWxsICYmIHZhbHVlID09PSBPYmplY3QodmFsdWUpICYmIHR5cGVvZiB2YWx1ZS50aGVuID09PSAnZnVuY3Rpb24nO1xuICAgIH07XG5cbiAgICB2YXIgX2lzVHJhbnNmb3JtZXIgPSBmdW5jdGlvbiBfaXNUcmFuc2Zvcm1lcihvYmopIHtcbiAgICAgICAgcmV0dXJuIHR5cGVvZiBvYmpbJ0BAdHJhbnNkdWNlci9zdGVwJ10gPT09ICdmdW5jdGlvbic7XG4gICAgfTtcblxuICAgIHZhciBfbHQgPSBmdW5jdGlvbiBfbHQoYSwgYikge1xuICAgICAgICByZXR1cm4gYSA8IGI7XG4gICAgfTtcblxuICAgIHZhciBfbWFwID0gZnVuY3Rpb24gX21hcChmbiwgbGlzdCkge1xuICAgICAgICB2YXIgaWR4ID0gMCwgcmVzdWx0ID0gW107XG4gICAgICAgIHdoaWxlIChpZHggPCBsaXN0Lmxlbmd0aCkge1xuICAgICAgICAgICAgcmVzdWx0W2lkeF0gPSBmbihsaXN0W2lkeF0pO1xuICAgICAgICAgICAgaWR4ICs9IDE7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xuXG4gICAgdmFyIF9tdWx0aXBseSA9IGZ1bmN0aW9uIF9tdWx0aXBseShhLCBiKSB7XG4gICAgICAgIHJldHVybiBhICogYjtcbiAgICB9O1xuXG4gICAgdmFyIF9udGggPSBmdW5jdGlvbiBfbnRoKG4sIGxpc3QpIHtcbiAgICAgICAgcmV0dXJuIG4gPCAwID8gbGlzdFtsaXN0Lmxlbmd0aCArIG5dIDogbGlzdFtuXTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogaW50ZXJuYWwgcGF0aCBmdW5jdGlvblxuICAgICAqIFRha2VzIGFuIGFycmF5LCBwYXRocywgaW5kaWNhdGluZyB0aGUgZGVlcCBzZXQgb2Yga2V5c1xuICAgICAqIHRvIGZpbmQuXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IE9iamVjdFxuICAgICAqIEBwYXJhbSB7QXJyYXl9IHBhdGhzIEFuIGFycmF5IG9mIHN0cmluZ3MgdG8gbWFwIHRvIG9iamVjdCBwcm9wZXJ0aWVzXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9iaiBUaGUgb2JqZWN0IHRvIGZpbmQgdGhlIHBhdGggaW5cbiAgICAgKiBAcmV0dXJuIHtBcnJheX0gVGhlIHZhbHVlIGF0IHRoZSBlbmQgb2YgdGhlIHBhdGggb3IgYHVuZGVmaW5lZGAuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgX3BhdGgoWydhJywgJ2InXSwge2E6IHtiOiAyfX0pOyAvLz0+IDJcbiAgICAgKi9cbiAgICB2YXIgX3BhdGggPSBmdW5jdGlvbiBfcGF0aChwYXRocywgb2JqKSB7XG4gICAgICAgIGlmIChvYmogPT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIHZhbCA9IG9iajtcbiAgICAgICAgICAgIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHBhdGhzLmxlbmd0aCAmJiB2YWwgIT0gbnVsbDsgaWR4ICs9IDEpIHtcbiAgICAgICAgICAgICAgICB2YWwgPSB2YWxbcGF0aHNbaWR4XV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdmFsO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIHZhciBfcHJlcGVuZCA9IGZ1bmN0aW9uIF9wcmVwZW5kKGVsLCBsaXN0KSB7XG4gICAgICAgIHJldHVybiBfY29uY2F0KFtlbF0sIGxpc3QpO1xuICAgIH07XG5cbiAgICB2YXIgX3F1b3RlID0gZnVuY3Rpb24gX3F1b3RlKHMpIHtcbiAgICAgICAgcmV0dXJuICdcIicgKyBzLnJlcGxhY2UoL1wiL2csICdcXFxcXCInKSArICdcIic7XG4gICAgfTtcblxuICAgIHZhciBfcmVkdWNlZCA9IGZ1bmN0aW9uIF9yZWR1Y2VkKHgpIHtcbiAgICAgICAgcmV0dXJuIHggJiYgeFsnQEB0cmFuc2R1Y2VyL3JlZHVjZWQnXSA/IHggOiB7XG4gICAgICAgICAgICAnQEB0cmFuc2R1Y2VyL3ZhbHVlJzogeCxcbiAgICAgICAgICAgICdAQHRyYW5zZHVjZXIvcmVkdWNlZCc6IHRydWVcbiAgICAgICAgfTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQW4gb3B0aW1pemVkLCBwcml2YXRlIGFycmF5IGBzbGljZWAgaW1wbGVtZW50YXRpb24uXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEBwYXJhbSB7QXJndW1lbnRzfEFycmF5fSBhcmdzIFRoZSBhcnJheSBvciBhcmd1bWVudHMgb2JqZWN0IHRvIGNvbnNpZGVyLlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBbZnJvbT0wXSBUaGUgYXJyYXkgaW5kZXggdG8gc2xpY2UgZnJvbSwgaW5jbHVzaXZlLlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBbdG89YXJncy5sZW5ndGhdIFRoZSBhcnJheSBpbmRleCB0byBzbGljZSB0bywgZXhjbHVzaXZlLlxuICAgICAqIEByZXR1cm4ge0FycmF5fSBBIG5ldywgc2xpY2VkIGFycmF5LlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIF9zbGljZShbMSwgMiwgMywgNCwgNV0sIDEsIDMpOyAvLz0+IFsyLCAzXVxuICAgICAqXG4gICAgICogICAgICB2YXIgZmlyc3RUaHJlZUFyZ3MgPSBmdW5jdGlvbihhLCBiLCBjLCBkKSB7XG4gICAgICogICAgICAgIHJldHVybiBfc2xpY2UoYXJndW1lbnRzLCAwLCAzKTtcbiAgICAgKiAgICAgIH07XG4gICAgICogICAgICBmaXJzdFRocmVlQXJncygxLCAyLCAzLCA0KTsgLy89PiBbMSwgMiwgM11cbiAgICAgKi9cbiAgICB2YXIgX3NsaWNlID0gZnVuY3Rpb24gX3NsaWNlKGFyZ3MsIGZyb20sIHRvKSB7XG4gICAgICAgIHN3aXRjaCAoYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICByZXR1cm4gX3NsaWNlKGFyZ3MsIDAsIGFyZ3MubGVuZ3RoKTtcbiAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgcmV0dXJuIF9zbGljZShhcmdzLCBmcm9tLCBhcmdzLmxlbmd0aCk7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICB2YXIgbGlzdCA9IFtdO1xuICAgICAgICAgICAgdmFyIGlkeCA9IDA7XG4gICAgICAgICAgICB2YXIgbGVuID0gTWF0aC5tYXgoMCwgTWF0aC5taW4oYXJncy5sZW5ndGgsIHRvKSAtIGZyb20pO1xuICAgICAgICAgICAgd2hpbGUgKGlkeCA8IGxlbikge1xuICAgICAgICAgICAgICAgIGxpc3RbaWR4XSA9IGFyZ3NbZnJvbSArIGlkeF07XG4gICAgICAgICAgICAgICAgaWR4ICs9IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbGlzdDtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBQb2x5ZmlsbCBmcm9tIDxodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9EYXRlL3RvSVNPU3RyaW5nPi5cbiAgICAgKi9cbiAgICB2YXIgX3RvSVNPU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgcGFkID0gZnVuY3Rpb24gcGFkKG4pIHtcbiAgICAgICAgICAgIHJldHVybiAobiA8IDEwID8gJzAnIDogJycpICsgbjtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIHR5cGVvZiBEYXRlLnByb3RvdHlwZS50b0lTT1N0cmluZyA9PT0gJ2Z1bmN0aW9uJyA/IGZ1bmN0aW9uIF90b0lTT1N0cmluZyhkKSB7XG4gICAgICAgICAgICByZXR1cm4gZC50b0lTT1N0cmluZygpO1xuICAgICAgICB9IDogZnVuY3Rpb24gX3RvSVNPU3RyaW5nKGQpIHtcbiAgICAgICAgICAgIHJldHVybiBkLmdldFVUQ0Z1bGxZZWFyKCkgKyAnLScgKyBwYWQoZC5nZXRVVENNb250aCgpICsgMSkgKyAnLScgKyBwYWQoZC5nZXRVVENEYXRlKCkpICsgJ1QnICsgcGFkKGQuZ2V0VVRDSG91cnMoKSkgKyAnOicgKyBwYWQoZC5nZXRVVENNaW51dGVzKCkpICsgJzonICsgcGFkKGQuZ2V0VVRDU2Vjb25kcygpKSArICcuJyArIChkLmdldFVUQ01pbGxpc2Vjb25kcygpIC8gMTAwMCkudG9GaXhlZCgzKS5zbGljZSgyLCA1KSArICdaJztcbiAgICAgICAgfTtcbiAgICB9KCk7XG5cbiAgICB2YXIgX3hkcm9wUmVwZWF0c1dpdGggPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGZ1bmN0aW9uIFhEcm9wUmVwZWF0c1dpdGgocHJlZCwgeGYpIHtcbiAgICAgICAgICAgIHRoaXMueGYgPSB4ZjtcbiAgICAgICAgICAgIHRoaXMucHJlZCA9IHByZWQ7XG4gICAgICAgICAgICB0aGlzLmxhc3RWYWx1ZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIHRoaXMuc2VlbkZpcnN0VmFsdWUgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBYRHJvcFJlcGVhdHNXaXRoLnByb3RvdHlwZVsnQEB0cmFuc2R1Y2VyL2luaXQnXSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnhmWydAQHRyYW5zZHVjZXIvaW5pdCddKCk7XG4gICAgICAgIH07XG4gICAgICAgIFhEcm9wUmVwZWF0c1dpdGgucHJvdG90eXBlWydAQHRyYW5zZHVjZXIvcmVzdWx0J10gPSBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy54ZlsnQEB0cmFuc2R1Y2VyL3Jlc3VsdCddKHJlc3VsdCk7XG4gICAgICAgIH07XG4gICAgICAgIFhEcm9wUmVwZWF0c1dpdGgucHJvdG90eXBlWydAQHRyYW5zZHVjZXIvc3RlcCddID0gZnVuY3Rpb24gKHJlc3VsdCwgaW5wdXQpIHtcbiAgICAgICAgICAgIHZhciBzYW1lQXNMYXN0ID0gZmFsc2U7XG4gICAgICAgICAgICBpZiAoIXRoaXMuc2VlbkZpcnN0VmFsdWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNlZW5GaXJzdFZhbHVlID0gdHJ1ZTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5wcmVkKHRoaXMubGFzdFZhbHVlLCBpbnB1dCkpIHtcbiAgICAgICAgICAgICAgICBzYW1lQXNMYXN0ID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMubGFzdFZhbHVlID0gaW5wdXQ7XG4gICAgICAgICAgICByZXR1cm4gc2FtZUFzTGFzdCA/IHJlc3VsdCA6IHRoaXMueGZbJ0BAdHJhbnNkdWNlci9zdGVwJ10ocmVzdWx0LCBpbnB1dCk7XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBfY3VycnkyKGZ1bmN0aW9uIF94ZHJvcFJlcGVhdHNXaXRoKHByZWQsIHhmKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFhEcm9wUmVwZWF0c1dpdGgocHJlZCwgeGYpO1xuICAgICAgICB9KTtcbiAgICB9KCk7XG5cbiAgICB2YXIgX3hmQmFzZSA9IHtcbiAgICAgICAgaW5pdDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMueGZbJ0BAdHJhbnNkdWNlci9pbml0J10oKTtcbiAgICAgICAgfSxcbiAgICAgICAgcmVzdWx0OiBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy54ZlsnQEB0cmFuc2R1Y2VyL3Jlc3VsdCddKHJlc3VsdCk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgdmFyIF94ZmlsdGVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBmdW5jdGlvbiBYRmlsdGVyKGYsIHhmKSB7XG4gICAgICAgICAgICB0aGlzLnhmID0geGY7XG4gICAgICAgICAgICB0aGlzLmYgPSBmO1xuICAgICAgICB9XG4gICAgICAgIFhGaWx0ZXIucHJvdG90eXBlWydAQHRyYW5zZHVjZXIvaW5pdCddID0gX3hmQmFzZS5pbml0O1xuICAgICAgICBYRmlsdGVyLnByb3RvdHlwZVsnQEB0cmFuc2R1Y2VyL3Jlc3VsdCddID0gX3hmQmFzZS5yZXN1bHQ7XG4gICAgICAgIFhGaWx0ZXIucHJvdG90eXBlWydAQHRyYW5zZHVjZXIvc3RlcCddID0gZnVuY3Rpb24gKHJlc3VsdCwgaW5wdXQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmYoaW5wdXQpID8gdGhpcy54ZlsnQEB0cmFuc2R1Y2VyL3N0ZXAnXShyZXN1bHQsIGlucHV0KSA6IHJlc3VsdDtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIF9jdXJyeTIoZnVuY3Rpb24gX3hmaWx0ZXIoZiwgeGYpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgWEZpbHRlcihmLCB4Zik7XG4gICAgICAgIH0pO1xuICAgIH0oKTtcblxuICAgIHZhciBfeGZpbmQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGZ1bmN0aW9uIFhGaW5kKGYsIHhmKSB7XG4gICAgICAgICAgICB0aGlzLnhmID0geGY7XG4gICAgICAgICAgICB0aGlzLmYgPSBmO1xuICAgICAgICAgICAgdGhpcy5mb3VuZCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIFhGaW5kLnByb3RvdHlwZVsnQEB0cmFuc2R1Y2VyL2luaXQnXSA9IF94ZkJhc2UuaW5pdDtcbiAgICAgICAgWEZpbmQucHJvdG90eXBlWydAQHRyYW5zZHVjZXIvcmVzdWx0J10gPSBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuZm91bmQpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQgPSB0aGlzLnhmWydAQHRyYW5zZHVjZXIvc3RlcCddKHJlc3VsdCwgdm9pZCAwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzLnhmWydAQHRyYW5zZHVjZXIvcmVzdWx0J10ocmVzdWx0KTtcbiAgICAgICAgfTtcbiAgICAgICAgWEZpbmQucHJvdG90eXBlWydAQHRyYW5zZHVjZXIvc3RlcCddID0gZnVuY3Rpb24gKHJlc3VsdCwgaW5wdXQpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmYoaW5wdXQpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5mb3VuZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gX3JlZHVjZWQodGhpcy54ZlsnQEB0cmFuc2R1Y2VyL3N0ZXAnXShyZXN1bHQsIGlucHV0KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gX2N1cnJ5MihmdW5jdGlvbiBfeGZpbmQoZiwgeGYpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgWEZpbmQoZiwgeGYpO1xuICAgICAgICB9KTtcbiAgICB9KCk7XG5cbiAgICB2YXIgX3hmaW5kSW5kZXggPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGZ1bmN0aW9uIFhGaW5kSW5kZXgoZiwgeGYpIHtcbiAgICAgICAgICAgIHRoaXMueGYgPSB4ZjtcbiAgICAgICAgICAgIHRoaXMuZiA9IGY7XG4gICAgICAgICAgICB0aGlzLmlkeCA9IC0xO1xuICAgICAgICAgICAgdGhpcy5mb3VuZCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIFhGaW5kSW5kZXgucHJvdG90eXBlWydAQHRyYW5zZHVjZXIvaW5pdCddID0gX3hmQmFzZS5pbml0O1xuICAgICAgICBYRmluZEluZGV4LnByb3RvdHlwZVsnQEB0cmFuc2R1Y2VyL3Jlc3VsdCddID0gZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgICAgaWYgKCF0aGlzLmZvdW5kKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gdGhpcy54ZlsnQEB0cmFuc2R1Y2VyL3N0ZXAnXShyZXN1bHQsIC0xKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzLnhmWydAQHRyYW5zZHVjZXIvcmVzdWx0J10ocmVzdWx0KTtcbiAgICAgICAgfTtcbiAgICAgICAgWEZpbmRJbmRleC5wcm90b3R5cGVbJ0BAdHJhbnNkdWNlci9zdGVwJ10gPSBmdW5jdGlvbiAocmVzdWx0LCBpbnB1dCkge1xuICAgICAgICAgICAgdGhpcy5pZHggKz0gMTtcbiAgICAgICAgICAgIGlmICh0aGlzLmYoaW5wdXQpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5mb3VuZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gX3JlZHVjZWQodGhpcy54ZlsnQEB0cmFuc2R1Y2VyL3N0ZXAnXShyZXN1bHQsIHRoaXMuaWR4KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gX2N1cnJ5MihmdW5jdGlvbiBfeGZpbmRJbmRleChmLCB4Zikge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBYRmluZEluZGV4KGYsIHhmKTtcbiAgICAgICAgfSk7XG4gICAgfSgpO1xuXG4gICAgdmFyIF94ZmluZExhc3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGZ1bmN0aW9uIFhGaW5kTGFzdChmLCB4Zikge1xuICAgICAgICAgICAgdGhpcy54ZiA9IHhmO1xuICAgICAgICAgICAgdGhpcy5mID0gZjtcbiAgICAgICAgfVxuICAgICAgICBYRmluZExhc3QucHJvdG90eXBlWydAQHRyYW5zZHVjZXIvaW5pdCddID0gX3hmQmFzZS5pbml0O1xuICAgICAgICBYRmluZExhc3QucHJvdG90eXBlWydAQHRyYW5zZHVjZXIvcmVzdWx0J10gPSBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy54ZlsnQEB0cmFuc2R1Y2VyL3Jlc3VsdCddKHRoaXMueGZbJ0BAdHJhbnNkdWNlci9zdGVwJ10ocmVzdWx0LCB0aGlzLmxhc3QpKTtcbiAgICAgICAgfTtcbiAgICAgICAgWEZpbmRMYXN0LnByb3RvdHlwZVsnQEB0cmFuc2R1Y2VyL3N0ZXAnXSA9IGZ1bmN0aW9uIChyZXN1bHQsIGlucHV0KSB7XG4gICAgICAgICAgICBpZiAodGhpcy5mKGlucHV0KSkge1xuICAgICAgICAgICAgICAgIHRoaXMubGFzdCA9IGlucHV0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIF9jdXJyeTIoZnVuY3Rpb24gX3hmaW5kTGFzdChmLCB4Zikge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBYRmluZExhc3QoZiwgeGYpO1xuICAgICAgICB9KTtcbiAgICB9KCk7XG5cbiAgICB2YXIgX3hmaW5kTGFzdEluZGV4ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBmdW5jdGlvbiBYRmluZExhc3RJbmRleChmLCB4Zikge1xuICAgICAgICAgICAgdGhpcy54ZiA9IHhmO1xuICAgICAgICAgICAgdGhpcy5mID0gZjtcbiAgICAgICAgICAgIHRoaXMuaWR4ID0gLTE7XG4gICAgICAgICAgICB0aGlzLmxhc3RJZHggPSAtMTtcbiAgICAgICAgfVxuICAgICAgICBYRmluZExhc3RJbmRleC5wcm90b3R5cGVbJ0BAdHJhbnNkdWNlci9pbml0J10gPSBfeGZCYXNlLmluaXQ7XG4gICAgICAgIFhGaW5kTGFzdEluZGV4LnByb3RvdHlwZVsnQEB0cmFuc2R1Y2VyL3Jlc3VsdCddID0gZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMueGZbJ0BAdHJhbnNkdWNlci9yZXN1bHQnXSh0aGlzLnhmWydAQHRyYW5zZHVjZXIvc3RlcCddKHJlc3VsdCwgdGhpcy5sYXN0SWR4KSk7XG4gICAgICAgIH07XG4gICAgICAgIFhGaW5kTGFzdEluZGV4LnByb3RvdHlwZVsnQEB0cmFuc2R1Y2VyL3N0ZXAnXSA9IGZ1bmN0aW9uIChyZXN1bHQsIGlucHV0KSB7XG4gICAgICAgICAgICB0aGlzLmlkeCArPSAxO1xuICAgICAgICAgICAgaWYgKHRoaXMuZihpbnB1dCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxhc3RJZHggPSB0aGlzLmlkeDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBfY3VycnkyKGZ1bmN0aW9uIF94ZmluZExhc3RJbmRleChmLCB4Zikge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBYRmluZExhc3RJbmRleChmLCB4Zik7XG4gICAgICAgIH0pO1xuICAgIH0oKTtcblxuICAgIHZhciBfeG1hcCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZnVuY3Rpb24gWE1hcChmLCB4Zikge1xuICAgICAgICAgICAgdGhpcy54ZiA9IHhmO1xuICAgICAgICAgICAgdGhpcy5mID0gZjtcbiAgICAgICAgfVxuICAgICAgICBYTWFwLnByb3RvdHlwZVsnQEB0cmFuc2R1Y2VyL2luaXQnXSA9IF94ZkJhc2UuaW5pdDtcbiAgICAgICAgWE1hcC5wcm90b3R5cGVbJ0BAdHJhbnNkdWNlci9yZXN1bHQnXSA9IF94ZkJhc2UucmVzdWx0O1xuICAgICAgICBYTWFwLnByb3RvdHlwZVsnQEB0cmFuc2R1Y2VyL3N0ZXAnXSA9IGZ1bmN0aW9uIChyZXN1bHQsIGlucHV0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy54ZlsnQEB0cmFuc2R1Y2VyL3N0ZXAnXShyZXN1bHQsIHRoaXMuZihpbnB1dCkpO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gX2N1cnJ5MihmdW5jdGlvbiBfeG1hcChmLCB4Zikge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBYTWFwKGYsIHhmKTtcbiAgICAgICAgfSk7XG4gICAgfSgpO1xuXG4gICAgdmFyIF94dGFrZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZnVuY3Rpb24gWFRha2UobiwgeGYpIHtcbiAgICAgICAgICAgIHRoaXMueGYgPSB4ZjtcbiAgICAgICAgICAgIHRoaXMubiA9IG47XG4gICAgICAgIH1cbiAgICAgICAgWFRha2UucHJvdG90eXBlWydAQHRyYW5zZHVjZXIvaW5pdCddID0gX3hmQmFzZS5pbml0O1xuICAgICAgICBYVGFrZS5wcm90b3R5cGVbJ0BAdHJhbnNkdWNlci9yZXN1bHQnXSA9IF94ZkJhc2UucmVzdWx0O1xuICAgICAgICBYVGFrZS5wcm90b3R5cGVbJ0BAdHJhbnNkdWNlci9zdGVwJ10gPSBmdW5jdGlvbiAocmVzdWx0LCBpbnB1dCkge1xuICAgICAgICAgICAgdGhpcy5uIC09IDE7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5uID09PSAwID8gX3JlZHVjZWQodGhpcy54ZlsnQEB0cmFuc2R1Y2VyL3N0ZXAnXShyZXN1bHQsIGlucHV0KSkgOiB0aGlzLnhmWydAQHRyYW5zZHVjZXIvc3RlcCddKHJlc3VsdCwgaW5wdXQpO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gX2N1cnJ5MihmdW5jdGlvbiBfeHRha2UobiwgeGYpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgWFRha2UobiwgeGYpO1xuICAgICAgICB9KTtcbiAgICB9KCk7XG5cbiAgICB2YXIgX3h0YWtlV2hpbGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGZ1bmN0aW9uIFhUYWtlV2hpbGUoZiwgeGYpIHtcbiAgICAgICAgICAgIHRoaXMueGYgPSB4ZjtcbiAgICAgICAgICAgIHRoaXMuZiA9IGY7XG4gICAgICAgIH1cbiAgICAgICAgWFRha2VXaGlsZS5wcm90b3R5cGVbJ0BAdHJhbnNkdWNlci9pbml0J10gPSBfeGZCYXNlLmluaXQ7XG4gICAgICAgIFhUYWtlV2hpbGUucHJvdG90eXBlWydAQHRyYW5zZHVjZXIvcmVzdWx0J10gPSBfeGZCYXNlLnJlc3VsdDtcbiAgICAgICAgWFRha2VXaGlsZS5wcm90b3R5cGVbJ0BAdHJhbnNkdWNlci9zdGVwJ10gPSBmdW5jdGlvbiAocmVzdWx0LCBpbnB1dCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZihpbnB1dCkgPyB0aGlzLnhmWydAQHRyYW5zZHVjZXIvc3RlcCddKHJlc3VsdCwgaW5wdXQpIDogX3JlZHVjZWQocmVzdWx0KTtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIF9jdXJyeTIoZnVuY3Rpb24gX3h0YWtlV2hpbGUoZiwgeGYpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgWFRha2VXaGlsZShmLCB4Zik7XG4gICAgICAgIH0pO1xuICAgIH0oKTtcblxuICAgIHZhciBfeHdyYXAgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGZ1bmN0aW9uIFhXcmFwKGZuKSB7XG4gICAgICAgICAgICB0aGlzLmYgPSBmbjtcbiAgICAgICAgfVxuICAgICAgICBYV3JhcC5wcm90b3R5cGVbJ0BAdHJhbnNkdWNlci9pbml0J10gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2luaXQgbm90IGltcGxlbWVudGVkIG9uIFhXcmFwJyk7XG4gICAgICAgIH07XG4gICAgICAgIFhXcmFwLnByb3RvdHlwZVsnQEB0cmFuc2R1Y2VyL3Jlc3VsdCddID0gZnVuY3Rpb24gKGFjYykge1xuICAgICAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgICAgfTtcbiAgICAgICAgWFdyYXAucHJvdG90eXBlWydAQHRyYW5zZHVjZXIvc3RlcCddID0gZnVuY3Rpb24gKGFjYywgeCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZihhY2MsIHgpO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gX3h3cmFwKGZuKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFhXcmFwKGZuKTtcbiAgICAgICAgfTtcbiAgICB9KCk7XG5cbiAgICAvKipcbiAgICAgKiBBZGRzIHR3byBudW1iZXJzIChvciBzdHJpbmdzKS4gRXF1aXZhbGVudCB0byBgYSArIGJgIGJ1dCBjdXJyaWVkLlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBNYXRoXG4gICAgICogQHNpZyBOdW1iZXIgLT4gTnVtYmVyIC0+IE51bWJlclxuICAgICAqIEBzaWcgU3RyaW5nIC0+IFN0cmluZyAtPiBTdHJpbmdcbiAgICAgKiBAcGFyYW0ge051bWJlcnxTdHJpbmd9IGEgVGhlIGZpcnN0IHZhbHVlLlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfFN0cmluZ30gYiBUaGUgc2Vjb25kIHZhbHVlLlxuICAgICAqIEByZXR1cm4ge051bWJlcnxTdHJpbmd9IFRoZSByZXN1bHQgb2YgYGEgKyBiYC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICBSLmFkZCgyLCAzKTsgICAgICAgLy89PiAgNVxuICAgICAqICAgICAgUi5hZGQoNykoMTApOyAgICAgIC8vPT4gMTdcbiAgICAgKi9cbiAgICB2YXIgYWRkID0gX2N1cnJ5MihfYWRkKTtcblxuICAgIC8qKlxuICAgICAqIEFwcGxpZXMgYSBmdW5jdGlvbiB0byB0aGUgdmFsdWUgYXQgdGhlIGdpdmVuIGluZGV4IG9mIGFuIGFycmF5LFxuICAgICAqIHJldHVybmluZyBhIG5ldyBjb3B5IG9mIHRoZSBhcnJheSB3aXRoIHRoZSBlbGVtZW50IGF0IHRoZSBnaXZlblxuICAgICAqIGluZGV4IHJlcGxhY2VkIHdpdGggdGhlIHJlc3VsdCBvZiB0aGUgZnVuY3Rpb24gYXBwbGljYXRpb24uXG4gICAgICogQHNlZSBSLnVwZGF0ZVxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBMaXN0XG4gICAgICogQHNpZyAoYSAtPiBhKSAtPiBOdW1iZXIgLT4gW2FdIC0+IFthXVxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBmdW5jdGlvbiB0byBhcHBseS5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gaWR4IFRoZSBpbmRleC5cbiAgICAgKiBAcGFyYW0ge0FycmF5fEFyZ3VtZW50c30gbGlzdCBBbiBhcnJheS1saWtlIG9iamVjdCB3aG9zZSB2YWx1ZVxuICAgICAqICAgICAgICBhdCB0aGUgc3VwcGxpZWQgaW5kZXggd2lsbCBiZSByZXBsYWNlZC5cbiAgICAgKiBAcmV0dXJuIHtBcnJheX0gQSBjb3B5IG9mIHRoZSBzdXBwbGllZCBhcnJheS1saWtlIG9iamVjdCB3aXRoXG4gICAgICogICAgICAgICB0aGUgZWxlbWVudCBhdCBpbmRleCBgaWR4YCByZXBsYWNlZCB3aXRoIHRoZSB2YWx1ZVxuICAgICAqICAgICAgICAgcmV0dXJuZWQgYnkgYXBwbHlpbmcgYGZuYCB0byB0aGUgZXhpc3RpbmcgZWxlbWVudC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICBSLmFkanVzdChSLmFkZCgxMCksIDEsIFswLCAxLCAyXSk7ICAgICAvLz0+IFswLCAxMSwgMl1cbiAgICAgKiAgICAgIFIuYWRqdXN0KFIuYWRkKDEwKSkoMSkoWzAsIDEsIDJdKTsgICAgIC8vPT4gWzAsIDExLCAyXVxuICAgICAqL1xuICAgIHZhciBhZGp1c3QgPSBfY3VycnkzKGZ1bmN0aW9uIChmbiwgaWR4LCBsaXN0KSB7XG4gICAgICAgIGlmIChpZHggPj0gbGlzdC5sZW5ndGggfHwgaWR4IDwgLWxpc3QubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gbGlzdDtcbiAgICAgICAgfVxuICAgICAgICB2YXIgc3RhcnQgPSBpZHggPCAwID8gbGlzdC5sZW5ndGggOiAwO1xuICAgICAgICB2YXIgX2lkeCA9IHN0YXJ0ICsgaWR4O1xuICAgICAgICB2YXIgX2xpc3QgPSBfY29uY2F0KGxpc3QpO1xuICAgICAgICBfbGlzdFtfaWR4XSA9IGZuKGxpc3RbX2lkeF0pO1xuICAgICAgICByZXR1cm4gX2xpc3Q7XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCBhbHdheXMgcmV0dXJucyB0aGUgZ2l2ZW4gdmFsdWUuIE5vdGUgdGhhdCBmb3Igbm9uLXByaW1pdGl2ZXMgdGhlIHZhbHVlXG4gICAgICogcmV0dXJuZWQgaXMgYSByZWZlcmVuY2UgdG8gdGhlIG9yaWdpbmFsIHZhbHVlLlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBGdW5jdGlvblxuICAgICAqIEBzaWcgYSAtPiAoKiAtPiBhKVxuICAgICAqIEBwYXJhbSB7Kn0gdmFsIFRoZSB2YWx1ZSB0byB3cmFwIGluIGEgZnVuY3Rpb25cbiAgICAgKiBAcmV0dXJuIHtGdW5jdGlvbn0gQSBGdW5jdGlvbiA6OiAqIC0+IHZhbC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICB2YXIgdCA9IFIuYWx3YXlzKCdUZWUnKTtcbiAgICAgKiAgICAgIHQoKTsgLy89PiAnVGVlJ1xuICAgICAqL1xuICAgIHZhciBhbHdheXMgPSBfY3VycnkxKGZ1bmN0aW9uIGFsd2F5cyh2YWwpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB2YWw7XG4gICAgICAgIH07XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGEgbmV3IGxpc3QsIGNvbXBvc2VkIG9mIG4tdHVwbGVzIG9mIGNvbnNlY3V0aXZlIGVsZW1lbnRzXG4gICAgICogSWYgYG5gIGlzIGdyZWF0ZXIgdGhhbiB0aGUgbGVuZ3RoIG9mIHRoZSBsaXN0LCBhbiBlbXB0eSBsaXN0IGlzIHJldHVybmVkLlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBMaXN0XG4gICAgICogQHNpZyBOdW1iZXIgLT4gW2FdIC0+IFtbYV1dXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IG4gVGhlIHNpemUgb2YgdGhlIHR1cGxlcyB0byBjcmVhdGVcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBsaXN0IFRoZSBsaXN0IHRvIHNwbGl0IGludG8gYG5gLXR1cGxlc1xuICAgICAqIEByZXR1cm4ge0FycmF5fSBUaGUgbmV3IGxpc3QuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgUi5hcGVydHVyZSgyLCBbMSwgMiwgMywgNCwgNV0pOyAvLz0+IFtbMSwgMl0sIFsyLCAzXSwgWzMsIDRdLCBbNCwgNV1dXG4gICAgICogICAgICBSLmFwZXJ0dXJlKDMsIFsxLCAyLCAzLCA0LCA1XSk7IC8vPT4gW1sxLCAyLCAzXSwgWzIsIDMsIDRdLCBbMywgNCwgNV1dXG4gICAgICogICAgICBSLmFwZXJ0dXJlKDcsIFsxLCAyLCAzLCA0LCA1XSk7IC8vPT4gW11cbiAgICAgKi9cbiAgICB2YXIgYXBlcnR1cmUgPSBfY3VycnkyKGZ1bmN0aW9uIGFwZXJ0dXJlKG4sIGxpc3QpIHtcbiAgICAgICAgdmFyIGlkeCA9IDA7XG4gICAgICAgIHZhciBsaW1pdCA9IGxpc3QubGVuZ3RoIC0gKG4gLSAxKTtcbiAgICAgICAgdmFyIGFjYyA9IG5ldyBBcnJheShsaW1pdCA+PSAwID8gbGltaXQgOiAwKTtcbiAgICAgICAgd2hpbGUgKGlkeCA8IGxpbWl0KSB7XG4gICAgICAgICAgICBhY2NbaWR4XSA9IF9zbGljZShsaXN0LCBpZHgsIGlkeCArIG4pO1xuICAgICAgICAgICAgaWR4ICs9IDE7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFjYztcbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIEFwcGxpZXMgZnVuY3Rpb24gYGZuYCB0byB0aGUgYXJndW1lbnQgbGlzdCBgYXJnc2AuIFRoaXMgaXMgdXNlZnVsIGZvclxuICAgICAqIGNyZWF0aW5nIGEgZml4ZWQtYXJpdHkgZnVuY3Rpb24gZnJvbSBhIHZhcmlhZGljIGZ1bmN0aW9uLiBgZm5gIHNob3VsZFxuICAgICAqIGJlIGEgYm91bmQgZnVuY3Rpb24gaWYgY29udGV4dCBpcyBzaWduaWZpY2FudC5cbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgRnVuY3Rpb25cbiAgICAgKiBAc2lnICgqLi4uIC0+IGEpIC0+IFsqXSAtPiBhXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAgICAgKiBAcGFyYW0ge0FycmF5fSBhcmdzXG4gICAgICogQHJldHVybiB7Kn1cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICB2YXIgbnVtcyA9IFsxLCAyLCAzLCAtOTksIDQyLCA2LCA3XTtcbiAgICAgKiAgICAgIFIuYXBwbHkoTWF0aC5tYXgsIG51bXMpOyAvLz0+IDQyXG4gICAgICovXG4gICAgdmFyIGFwcGx5ID0gX2N1cnJ5MihmdW5jdGlvbiBhcHBseShmbiwgYXJncykge1xuICAgICAgICByZXR1cm4gZm4uYXBwbHkodGhpcywgYXJncyk7XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBXcmFwcyBhIGZ1bmN0aW9uIG9mIGFueSBhcml0eSAoaW5jbHVkaW5nIG51bGxhcnkpIGluIGEgZnVuY3Rpb24gdGhhdCBhY2NlcHRzIGV4YWN0bHkgYG5gXG4gICAgICogcGFyYW1ldGVycy4gVW5saWtlIGBuQXJ5YCwgd2hpY2ggcGFzc2VzIG9ubHkgYG5gIGFyZ3VtZW50cyB0byB0aGUgd3JhcHBlZCBmdW5jdGlvbixcbiAgICAgKiBmdW5jdGlvbnMgcHJvZHVjZWQgYnkgYGFyaXR5YCB3aWxsIHBhc3MgYWxsIHByb3ZpZGVkIGFyZ3VtZW50cyB0byB0aGUgd3JhcHBlZCBmdW5jdGlvbi5cbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAc2lnIChOdW1iZXIsICgqIC0+ICopKSAtPiAoKiAtPiAqKVxuICAgICAqIEBjYXRlZ29yeSBGdW5jdGlvblxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBuIFRoZSBkZXNpcmVkIGFyaXR5IG9mIHRoZSByZXR1cm5lZCBmdW5jdGlvbi5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgZnVuY3Rpb24gdG8gd3JhcC5cbiAgICAgKiBAcmV0dXJuIHtGdW5jdGlvbn0gQSBuZXcgZnVuY3Rpb24gd3JhcHBpbmcgYGZuYC4gVGhlIG5ldyBmdW5jdGlvbiBpc1xuICAgICAqICAgICAgICAgZ3VhcmFudGVlZCB0byBiZSBvZiBhcml0eSBgbmAuXG4gICAgICogQGRlcHJlY2F0ZWQgc2luY2UgdjAuMTUuMFxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIHZhciB0YWtlc1R3b0FyZ3MgPSBmdW5jdGlvbihhLCBiKSB7XG4gICAgICogICAgICAgIHJldHVybiBbYSwgYl07XG4gICAgICogICAgICB9O1xuICAgICAqICAgICAgdGFrZXNUd29BcmdzLmxlbmd0aDsgLy89PiAyXG4gICAgICogICAgICB0YWtlc1R3b0FyZ3MoMSwgMik7IC8vPT4gWzEsIDJdXG4gICAgICpcbiAgICAgKiAgICAgIHZhciB0YWtlc09uZUFyZyA9IFIuYXJpdHkoMSwgdGFrZXNUd29BcmdzKTtcbiAgICAgKiAgICAgIHRha2VzT25lQXJnLmxlbmd0aDsgLy89PiAxXG4gICAgICogICAgICAvLyBBbGwgYXJndW1lbnRzIGFyZSBwYXNzZWQgdGhyb3VnaCB0byB0aGUgd3JhcHBlZCBmdW5jdGlvblxuICAgICAqICAgICAgdGFrZXNPbmVBcmcoMSwgMik7IC8vPT4gWzEsIDJdXG4gICAgICovXG4gICAgLy8ganNoaW50IHVudXNlZDp2YXJzXG4gICAgdmFyIGFyaXR5ID0gX2N1cnJ5MihmdW5jdGlvbiAobiwgZm4pIHtcbiAgICAgICAgLy8ganNoaW50IHVudXNlZDp2YXJzXG4gICAgICAgIHN3aXRjaCAobikge1xuICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChhMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChhMCwgYTEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoYTAsIGExLCBhMikge1xuICAgICAgICAgICAgICAgIHJldHVybiBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgY2FzZSA0OlxuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChhMCwgYTEsIGEyLCBhMykge1xuICAgICAgICAgICAgICAgIHJldHVybiBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgY2FzZSA1OlxuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChhMCwgYTEsIGEyLCBhMywgYTQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIGNhc2UgNjpcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoYTAsIGExLCBhMiwgYTMsIGE0LCBhNSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgY2FzZSA3OlxuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChhMCwgYTEsIGEyLCBhMywgYTQsIGE1LCBhNikge1xuICAgICAgICAgICAgICAgIHJldHVybiBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgY2FzZSA4OlxuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChhMCwgYTEsIGEyLCBhMywgYTQsIGE1LCBhNiwgYTcpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIGNhc2UgOTpcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoYTAsIGExLCBhMiwgYTMsIGE0LCBhNSwgYTYsIGE3LCBhOCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgY2FzZSAxMDpcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoYTAsIGExLCBhMiwgYTMsIGE0LCBhNSwgYTYsIGE3LCBhOCwgYTkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ZpcnN0IGFyZ3VtZW50IHRvIGFyaXR5IG11c3QgYmUgYSBub24tbmVnYXRpdmUgaW50ZWdlciBubyBncmVhdGVyIHRoYW4gdGVuJyk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIE1ha2VzIGEgc2hhbGxvdyBjbG9uZSBvZiBhbiBvYmplY3QsIHNldHRpbmcgb3Igb3ZlcnJpZGluZyB0aGUgc3BlY2lmaWVkXG4gICAgICogcHJvcGVydHkgd2l0aCB0aGUgZ2l2ZW4gdmFsdWUuICBOb3RlIHRoYXQgdGhpcyBjb3BpZXMgYW5kIGZsYXR0ZW5zXG4gICAgICogcHJvdG90eXBlIHByb3BlcnRpZXMgb250byB0aGUgbmV3IG9iamVjdCBhcyB3ZWxsLiAgQWxsIG5vbi1wcmltaXRpdmVcbiAgICAgKiBwcm9wZXJ0aWVzIGFyZSBjb3BpZWQgYnkgcmVmZXJlbmNlLlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBPYmplY3RcbiAgICAgKiBAc2lnIFN0cmluZyAtPiBhIC0+IHtrOiB2fSAtPiB7azogdn1cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gcHJvcCB0aGUgcHJvcGVydHkgbmFtZSB0byBzZXRcbiAgICAgKiBAcGFyYW0geyp9IHZhbCB0aGUgbmV3IHZhbHVlXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9iaiB0aGUgb2JqZWN0IHRvIGNsb25lXG4gICAgICogQHJldHVybiB7T2JqZWN0fSBhIG5ldyBvYmplY3Qgc2ltaWxhciB0byB0aGUgb3JpZ2luYWwgZXhjZXB0IGZvciB0aGUgc3BlY2lmaWVkIHByb3BlcnR5LlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIFIuYXNzb2MoJ2MnLCAzLCB7YTogMSwgYjogMn0pOyAvLz0+IHthOiAxLCBiOiAyLCBjOiAzfVxuICAgICAqL1xuICAgIHZhciBhc3NvYyA9IF9jdXJyeTMoX2Fzc29jKTtcblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0IGlzIGJvdW5kIHRvIGEgY29udGV4dC5cbiAgICAgKiBOb3RlOiBgUi5iaW5kYCBkb2VzIG5vdCBwcm92aWRlIHRoZSBhZGRpdGlvbmFsIGFyZ3VtZW50LWJpbmRpbmcgY2FwYWJpbGl0aWVzIG9mXG4gICAgICogW0Z1bmN0aW9uLnByb3RvdHlwZS5iaW5kXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9GdW5jdGlvbi9iaW5kKS5cbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgRnVuY3Rpb25cbiAgICAgKiBAY2F0ZWdvcnkgT2JqZWN0XG4gICAgICogQHNlZSBSLnBhcnRpYWxcbiAgICAgKiBAc2lnICgqIC0+ICopIC0+IHsqfSAtPiAoKiAtPiAqKVxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBmdW5jdGlvbiB0byBiaW5kIHRvIGNvbnRleHRcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gdGhpc09iaiBUaGUgY29udGV4dCB0byBiaW5kIGBmbmAgdG9cbiAgICAgKiBAcmV0dXJuIHtGdW5jdGlvbn0gQSBmdW5jdGlvbiB0aGF0IHdpbGwgZXhlY3V0ZSBpbiB0aGUgY29udGV4dCBvZiBgdGhpc09iamAuXG4gICAgICovXG4gICAgdmFyIGJpbmQgPSBfY3VycnkyKGZ1bmN0aW9uIGJpbmQoZm4sIHRoaXNPYmopIHtcbiAgICAgICAgcmV0dXJuIGFyaXR5KGZuLmxlbmd0aCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIGZuLmFwcGx5KHRoaXNPYmosIGFyZ3VtZW50cyk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogQSBmdW5jdGlvbiB3cmFwcGluZyBjYWxscyB0byB0aGUgdHdvIGZ1bmN0aW9ucyBpbiBhbiBgJiZgIG9wZXJhdGlvbiwgcmV0dXJuaW5nIHRoZSByZXN1bHQgb2YgdGhlIGZpcnN0XG4gICAgICogZnVuY3Rpb24gaWYgaXQgaXMgZmFsc2UteSBhbmQgdGhlIHJlc3VsdCBvZiB0aGUgc2Vjb25kIGZ1bmN0aW9uIG90aGVyd2lzZS4gIE5vdGUgdGhhdCB0aGlzIGlzXG4gICAgICogc2hvcnQtY2lyY3VpdGVkLCBtZWFuaW5nIHRoYXQgdGhlIHNlY29uZCBmdW5jdGlvbiB3aWxsIG5vdCBiZSBpbnZva2VkIGlmIHRoZSBmaXJzdCByZXR1cm5zIGEgZmFsc2UteVxuICAgICAqIHZhbHVlLlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBMb2dpY1xuICAgICAqIEBzaWcgKCouLi4gLT4gQm9vbGVhbikgLT4gKCouLi4gLT4gQm9vbGVhbikgLT4gKCouLi4gLT4gQm9vbGVhbilcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmIGEgcHJlZGljYXRlXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gZyBhbm90aGVyIHByZWRpY2F0ZVxuICAgICAqIEByZXR1cm4ge0Z1bmN0aW9ufSBhIGZ1bmN0aW9uIHRoYXQgYXBwbGllcyBpdHMgYXJndW1lbnRzIHRvIGBmYCBhbmQgYGdgIGFuZCBgJiZgcyB0aGVpciBvdXRwdXRzIHRvZ2V0aGVyLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIHZhciBndDEwID0gZnVuY3Rpb24oeCkgeyByZXR1cm4geCA+IDEwOyB9O1xuICAgICAqICAgICAgdmFyIGV2ZW4gPSBmdW5jdGlvbih4KSB7IHJldHVybiB4ICUgMiA9PT0gMCB9O1xuICAgICAqICAgICAgdmFyIGYgPSBSLmJvdGgoZ3QxMCwgZXZlbik7XG4gICAgICogICAgICBmKDEwMCk7IC8vPT4gdHJ1ZVxuICAgICAqICAgICAgZigxMDEpOyAvLz0+IGZhbHNlXG4gICAgICovXG4gICAgdmFyIGJvdGggPSBfY3VycnkyKGZ1bmN0aW9uIGJvdGgoZiwgZykge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gX2JvdGgoKSB7XG4gICAgICAgICAgICByZXR1cm4gZi5hcHBseSh0aGlzLCBhcmd1bWVudHMpICYmIGcuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgfTtcbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIE1ha2VzIGEgY29tcGFyYXRvciBmdW5jdGlvbiBvdXQgb2YgYSBmdW5jdGlvbiB0aGF0IHJlcG9ydHMgd2hldGhlciB0aGUgZmlyc3QgZWxlbWVudCBpcyBsZXNzIHRoYW4gdGhlIHNlY29uZC5cbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgRnVuY3Rpb25cbiAgICAgKiBAc2lnIChhLCBiIC0+IEJvb2xlYW4pIC0+IChhLCBiIC0+IE51bWJlcilcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBwcmVkIEEgcHJlZGljYXRlIGZ1bmN0aW9uIG9mIGFyaXR5IHR3by5cbiAgICAgKiBAcmV0dXJuIHtGdW5jdGlvbn0gQSBGdW5jdGlvbiA6OiBhIC0+IGIgLT4gSW50IHRoYXQgcmV0dXJucyBgLTFgIGlmIGEgPCBiLCBgMWAgaWYgYiA8IGEsIG90aGVyd2lzZSBgMGAuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgdmFyIGNtcCA9IFIuY29tcGFyYXRvcihmdW5jdGlvbihhLCBiKSB7XG4gICAgICogICAgICAgIHJldHVybiBhLmFnZSA8IGIuYWdlO1xuICAgICAqICAgICAgfSk7XG4gICAgICogICAgICB2YXIgcGVvcGxlID0gW1xuICAgICAqICAgICAgICAvLyAuLi5cbiAgICAgKiAgICAgIF07XG4gICAgICogICAgICBSLnNvcnQoY21wLCBwZW9wbGUpO1xuICAgICAqL1xuICAgIHZhciBjb21wYXJhdG9yID0gX2N1cnJ5MShmdW5jdGlvbiBjb21wYXJhdG9yKHByZWQpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgICAgICByZXR1cm4gcHJlZChhLCBiKSA/IC0xIDogcHJlZChiLCBhKSA/IDEgOiAwO1xuICAgICAgICB9O1xuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogVGFrZXMgYSBmdW5jdGlvbiBgZmAgYW5kIHJldHVybnMgYSBmdW5jdGlvbiBgZ2Agc3VjaCB0aGF0OlxuICAgICAqXG4gICAgICogICAtIGFwcGx5aW5nIGBnYCB0byB6ZXJvIG9yIG1vcmUgYXJndW1lbnRzIHdpbGwgZ2l2ZSBfX3RydWVfXyBpZiBhcHBseWluZ1xuICAgICAqICAgICB0aGUgc2FtZSBhcmd1bWVudHMgdG8gYGZgIGdpdmVzIGEgbG9naWNhbCBfX2ZhbHNlX18gdmFsdWU7IGFuZFxuICAgICAqXG4gICAgICogICAtIGFwcGx5aW5nIGBnYCB0byB6ZXJvIG9yIG1vcmUgYXJndW1lbnRzIHdpbGwgZ2l2ZSBfX2ZhbHNlX18gaWYgYXBwbHlpbmdcbiAgICAgKiAgICAgdGhlIHNhbWUgYXJndW1lbnRzIHRvIGBmYCBnaXZlcyBhIGxvZ2ljYWwgX190cnVlX18gdmFsdWUuXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IExvZ2ljXG4gICAgICogQHNpZyAoKi4uLiAtPiAqKSAtPiAoKi4uLiAtPiBCb29sZWFuKVxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGZcbiAgICAgKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICB2YXIgaXNFdmVuID0gZnVuY3Rpb24obikgeyByZXR1cm4gbiAlIDIgPT09IDA7IH07XG4gICAgICogICAgICB2YXIgaXNPZGQgPSBSLmNvbXBsZW1lbnQoaXNFdmVuKTtcbiAgICAgKiAgICAgIGlzT2RkKDIxKTsgLy89PiB0cnVlXG4gICAgICogICAgICBpc09kZCg0Mik7IC8vPT4gZmFsc2VcbiAgICAgKi9cbiAgICB2YXIgY29tcGxlbWVudCA9IF9jdXJyeTEoX2NvbXBsZW1lbnQpO1xuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhIGZ1bmN0aW9uLCBgZm5gLCB3aGljaCBlbmNhcHN1bGF0ZXMgaWYvZWxzZS1pZi9lbHNlIGxvZ2ljLlxuICAgICAqIEVhY2ggYXJndW1lbnQgdG8gYFIuY29uZGAgaXMgYSBbcHJlZGljYXRlLCB0cmFuc2Zvcm1dIHBhaXIuIEFsbCBvZlxuICAgICAqIHRoZSBhcmd1bWVudHMgdG8gYGZuYCBhcmUgYXBwbGllZCB0byBlYWNoIG9mIHRoZSBwcmVkaWNhdGVzIGluIHR1cm5cbiAgICAgKiB1bnRpbCBvbmUgcmV0dXJucyBhIFwidHJ1dGh5XCIgdmFsdWUsIGF0IHdoaWNoIHBvaW50IGBmbmAgcmV0dXJucyB0aGVcbiAgICAgKiByZXN1bHQgb2YgYXBwbHlpbmcgaXRzIGFyZ3VtZW50cyB0byB0aGUgY29ycmVzcG9uZGluZyB0cmFuc2Zvcm1lci5cbiAgICAgKiBJZiBub25lIG9mIHRoZSBwcmVkaWNhdGVzIG1hdGNoZXMsIGBmbmAgcmV0dXJucyB1bmRlZmluZWQuXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IExvZ2ljXG4gICAgICogQHNpZyBbKCouLi4gLT4gQm9vbGVhbiksKCouLi4gLT4gKildLi4uIC0+ICgqLi4uIC0+ICopXG4gICAgICogQHBhcmFtIHsuLi5GdW5jdGlvbn0gZnVuY3Rpb25zXG4gICAgICogQHJldHVybiB7RnVuY3Rpb259XG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgdmFyIGZuID0gUi5jb25kKFxuICAgICAqICAgICAgICBbUi5lcXVhbHMoMCksICAgUi5hbHdheXMoJ3dhdGVyIGZyZWV6ZXMgYXQgMMKwQycpXSxcbiAgICAgKiAgICAgICAgW1IuZXF1YWxzKDEwMCksIFIuYWx3YXlzKCd3YXRlciBib2lscyBhdCAxMDDCsEMnKV0sXG4gICAgICogICAgICAgIFtSLlQsICAgICAgICAgICBmdW5jdGlvbih0ZW1wKSB7IHJldHVybiAnbm90aGluZyBzcGVjaWFsIGhhcHBlbnMgYXQgJyArIHRlbXAgKyAnwrBDJzsgfV1cbiAgICAgKiAgICAgICk7XG4gICAgICogICAgICBmbigwKTsgLy89PiAnd2F0ZXIgZnJlZXplcyBhdCAwwrBDJ1xuICAgICAqICAgICAgZm4oNTApOyAvLz0+ICdub3RoaW5nIHNwZWNpYWwgaGFwcGVucyBhdCA1MMKwQydcbiAgICAgKiAgICAgIGZuKDEwMCk7IC8vPT4gJ3dhdGVyIGJvaWxzIGF0IDEwMMKwQydcbiAgICAgKi9cbiAgICB2YXIgY29uZCA9IGZ1bmN0aW9uIGNvbmQoKSB7XG4gICAgICAgIHZhciBwYWlycyA9IGFyZ3VtZW50cztcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBpZHggPSAwO1xuICAgICAgICAgICAgd2hpbGUgKGlkeCA8IHBhaXJzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGlmIChwYWlyc1tpZHhdWzBdLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBhaXJzW2lkeF1bMV0uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWR4ICs9IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYHRydWVgIGlmIHRoZSBgeGAgaXMgZm91bmQgaW4gdGhlIGBsaXN0YCwgdXNpbmcgYHByZWRgIGFzIGFuXG4gICAgICogZXF1YWxpdHkgcHJlZGljYXRlIGZvciBgeGAuXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IExpc3RcbiAgICAgKiBAc2lnIChhLCBhIC0+IEJvb2xlYW4pIC0+IGEgLT4gW2FdIC0+IEJvb2xlYW5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBwcmVkIEEgcHJlZGljYXRlIHVzZWQgdG8gdGVzdCB3aGV0aGVyIHR3byBpdGVtcyBhcmUgZXF1YWwuXG4gICAgICogQHBhcmFtIHsqfSB4IFRoZSBpdGVtIHRvIGZpbmRcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBsaXN0IFRoZSBsaXN0IHRvIGl0ZXJhdGUgb3ZlclxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59IGB0cnVlYCBpZiBgeGAgaXMgaW4gYGxpc3RgLCBlbHNlIGBmYWxzZWAuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgdmFyIHhzID0gW3t4OiAxMn0sIHt4OiAxMX0sIHt4OiAxMH1dO1xuICAgICAqICAgICAgUi5jb250YWluc1dpdGgoZnVuY3Rpb24oYSwgYikgeyByZXR1cm4gYS54ID09PSBiLng7IH0sIHt4OiAxMH0sIHhzKTsgLy89PiB0cnVlXG4gICAgICogICAgICBSLmNvbnRhaW5zV2l0aChmdW5jdGlvbihhLCBiKSB7IHJldHVybiBhLnggPT09IGIueDsgfSwge3g6IDF9LCB4cyk7IC8vPT4gZmFsc2VcbiAgICAgKi9cbiAgICB2YXIgY29udGFpbnNXaXRoID0gX2N1cnJ5MyhfY29udGFpbnNXaXRoKTtcblxuICAgIC8qKlxuICAgICAqIENvdW50cyB0aGUgZWxlbWVudHMgb2YgYSBsaXN0IGFjY29yZGluZyB0byBob3cgbWFueSBtYXRjaCBlYWNoIHZhbHVlXG4gICAgICogb2YgYSBrZXkgZ2VuZXJhdGVkIGJ5IHRoZSBzdXBwbGllZCBmdW5jdGlvbi4gUmV0dXJucyBhbiBvYmplY3RcbiAgICAgKiBtYXBwaW5nIHRoZSBrZXlzIHByb2R1Y2VkIGJ5IGBmbmAgdG8gdGhlIG51bWJlciBvZiBvY2N1cnJlbmNlcyBpblxuICAgICAqIHRoZSBsaXN0LiBOb3RlIHRoYXQgYWxsIGtleXMgYXJlIGNvZXJjZWQgdG8gc3RyaW5ncyBiZWNhdXNlIG9mIGhvd1xuICAgICAqIEphdmFTY3JpcHQgb2JqZWN0cyB3b3JrLlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBSZWxhdGlvblxuICAgICAqIEBzaWcgKGEgLT4gU3RyaW5nKSAtPiBbYV0gLT4geyp9XG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGZ1bmN0aW9uIHVzZWQgdG8gbWFwIHZhbHVlcyB0byBrZXlzLlxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGxpc3QgVGhlIGxpc3QgdG8gY291bnQgZWxlbWVudHMgZnJvbS5cbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IEFuIG9iamVjdCBtYXBwaW5nIGtleXMgdG8gbnVtYmVyIG9mIG9jY3VycmVuY2VzIGluIHRoZSBsaXN0LlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIHZhciBudW1iZXJzID0gWzEuMCwgMS4xLCAxLjIsIDIuMCwgMy4wLCAyLjJdO1xuICAgICAqICAgICAgdmFyIGxldHRlcnMgPSBSLnNwbGl0KCcnLCAnYWJjQUJDYWFhQkJjJyk7XG4gICAgICogICAgICBSLmNvdW50QnkoTWF0aC5mbG9vcikobnVtYmVycyk7ICAgIC8vPT4geycxJzogMywgJzInOiAyLCAnMyc6IDF9XG4gICAgICogICAgICBSLmNvdW50QnkoUi50b0xvd2VyKShsZXR0ZXJzKTsgICAvLz0+IHsnYSc6IDUsICdiJzogNCwgJ2MnOiAzfVxuICAgICAqL1xuICAgIHZhciBjb3VudEJ5ID0gX2N1cnJ5MihmdW5jdGlvbiBjb3VudEJ5KGZuLCBsaXN0KSB7XG4gICAgICAgIHZhciBjb3VudHMgPSB7fTtcbiAgICAgICAgdmFyIGlkeCA9IDA7XG4gICAgICAgIHdoaWxlIChpZHggPCBsaXN0Lmxlbmd0aCkge1xuICAgICAgICAgICAgdmFyIGtleSA9IGZuKGxpc3RbaWR4XSk7XG4gICAgICAgICAgICBjb3VudHNba2V5XSA9IChfaGFzKGtleSwgY291bnRzKSA/IGNvdW50c1trZXldIDogMCkgKyAxO1xuICAgICAgICAgICAgaWR4ICs9IDE7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNvdW50cztcbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYW4gb2JqZWN0IGNvbnRhaW5pbmcgYSBzaW5nbGUga2V5OnZhbHVlIHBhaXIuXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IE9iamVjdFxuICAgICAqIEBzaWcgU3RyaW5nIC0+IGEgLT4ge1N0cmluZzphfVxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBrZXlcbiAgICAgKiBAcGFyYW0geyp9IHZhbFxuICAgICAqIEByZXR1cm4ge09iamVjdH1cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICB2YXIgbWF0Y2hQaHJhc2VzID0gUi5jb21wb3NlKFxuICAgICAqICAgICAgICBSLmNyZWF0ZU1hcEVudHJ5KCdtdXN0JyksXG4gICAgICogICAgICAgIFIubWFwKFIuY3JlYXRlTWFwRW50cnkoJ21hdGNoX3BocmFzZScpKVxuICAgICAqICAgICAgKTtcbiAgICAgKiAgICAgIG1hdGNoUGhyYXNlcyhbJ2ZvbycsICdiYXInLCAnYmF6J10pOyAvLz0+IHttdXN0OiBbe21hdGNoX3BocmFzZTogJ2Zvbyd9LCB7bWF0Y2hfcGhyYXNlOiAnYmFyJ30sIHttYXRjaF9waHJhc2U6ICdiYXonfV19XG4gICAgICovXG4gICAgdmFyIGNyZWF0ZU1hcEVudHJ5ID0gX2N1cnJ5MihfY3JlYXRlTWFwRW50cnkpO1xuXG4gICAgLyoqXG4gICAgICogRGVjcmVtZW50cyBpdHMgYXJndW1lbnQuXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IE1hdGhcbiAgICAgKiBAc2lnIE51bWJlciAtPiBOdW1iZXJcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gblxuICAgICAqIEByZXR1cm4ge051bWJlcn1cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICBSLmRlYyg0Mik7IC8vPT4gNDFcbiAgICAgKi9cbiAgICB2YXIgZGVjID0gYWRkKC0xKTtcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIHNlY29uZCBhcmd1bWVudCBpZiBpdCBpcyBub3QgbnVsbCBvciB1bmRlZmluZWQuIElmIGl0IGlzIG51bGxcbiAgICAgKiBvciB1bmRlZmluZWQsIHRoZSBmaXJzdCAoZGVmYXVsdCkgYXJndW1lbnQgaXMgcmV0dXJuZWQuXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IExvZ2ljXG4gICAgICogQHNpZyBhIC0+IGIgLT4gYSB8IGJcbiAgICAgKiBAcGFyYW0ge2F9IHZhbCBUaGUgZGVmYXVsdCB2YWx1ZS5cbiAgICAgKiBAcGFyYW0ge2J9IHZhbCBUaGUgdmFsdWUgdG8gcmV0dXJuIGlmIGl0IGlzIG5vdCBudWxsIG9yIHVuZGVmaW5lZFxuICAgICAqIEByZXR1cm4geyp9IFRoZSB0aGUgc2Vjb25kIHZhbHVlIG9yIHRoZSBkZWZhdWx0IHZhbHVlXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgdmFyIGRlZmF1bHRUbzQyID0gZGVmYXVsdFRvKDQyKTtcbiAgICAgKlxuICAgICAqICAgICAgZGVmYXVsdFRvNDIobnVsbCk7ICAvLz0+IDQyXG4gICAgICogICAgICBkZWZhdWx0VG80Mih1bmRlZmluZWQpOyAgLy89PiA0MlxuICAgICAqICAgICAgZGVmYXVsdFRvNDIoJ1JhbWRhJyk7ICAvLz0+ICdSYW1kYSdcbiAgICAgKi9cbiAgICB2YXIgZGVmYXVsdFRvID0gX2N1cnJ5MihmdW5jdGlvbiBkZWZhdWx0VG8oZCwgdikge1xuICAgICAgICByZXR1cm4gdiA9PSBudWxsID8gZCA6IHY7XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBGaW5kcyB0aGUgc2V0IChpLmUuIG5vIGR1cGxpY2F0ZXMpIG9mIGFsbCBlbGVtZW50cyBpbiB0aGUgZmlyc3QgbGlzdCBub3QgY29udGFpbmVkIGluIHRoZSBzZWNvbmQgbGlzdC5cbiAgICAgKiBEdXBsaWNhdGlvbiBpcyBkZXRlcm1pbmVkIGFjY29yZGluZyB0byB0aGUgdmFsdWUgcmV0dXJuZWQgYnkgYXBwbHlpbmcgdGhlIHN1cHBsaWVkIHByZWRpY2F0ZSB0byB0d28gbGlzdFxuICAgICAqIGVsZW1lbnRzLlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBSZWxhdGlvblxuICAgICAqIEBzaWcgKGEsYSAtPiBCb29sZWFuKSAtPiBbYV0gLT4gW2FdIC0+IFthXVxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IHByZWQgQSBwcmVkaWNhdGUgdXNlZCB0byB0ZXN0IHdoZXRoZXIgdHdvIGl0ZW1zIGFyZSBlcXVhbC5cbiAgICAgKiBAcGFyYW0ge0FycmF5fSBsaXN0MSBUaGUgZmlyc3QgbGlzdC5cbiAgICAgKiBAcGFyYW0ge0FycmF5fSBsaXN0MiBUaGUgc2Vjb25kIGxpc3QuXG4gICAgICogQHNlZSBSLmRpZmZlcmVuY2VcbiAgICAgKiBAcmV0dXJuIHtBcnJheX0gVGhlIGVsZW1lbnRzIGluIGBsaXN0MWAgdGhhdCBhcmUgbm90IGluIGBsaXN0MmAuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgZnVuY3Rpb24gY21wKHgsIHkpIHsgcmV0dXJuIHguYSA9PT0geS5hOyB9XG4gICAgICogICAgICB2YXIgbDEgPSBbe2E6IDF9LCB7YTogMn0sIHthOiAzfV07XG4gICAgICogICAgICB2YXIgbDIgPSBbe2E6IDN9LCB7YTogNH1dO1xuICAgICAqICAgICAgUi5kaWZmZXJlbmNlV2l0aChjbXAsIGwxLCBsMik7IC8vPT4gW3thOiAxfSwge2E6IDJ9XVxuICAgICAqL1xuICAgIHZhciBkaWZmZXJlbmNlV2l0aCA9IF9jdXJyeTMoZnVuY3Rpb24gZGlmZmVyZW5jZVdpdGgocHJlZCwgZmlyc3QsIHNlY29uZCkge1xuICAgICAgICB2YXIgb3V0ID0gW107XG4gICAgICAgIHZhciBpZHggPSAwO1xuICAgICAgICB2YXIgY29udGFpbnNQcmVkID0gY29udGFpbnNXaXRoKHByZWQpO1xuICAgICAgICB3aGlsZSAoaWR4IDwgZmlyc3QubGVuZ3RoKSB7XG4gICAgICAgICAgICBpZiAoIWNvbnRhaW5zUHJlZChmaXJzdFtpZHhdLCBzZWNvbmQpICYmICFjb250YWluc1ByZWQoZmlyc3RbaWR4XSwgb3V0KSkge1xuICAgICAgICAgICAgICAgIG91dFtvdXQubGVuZ3RoXSA9IGZpcnN0W2lkeF07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZHggKz0gMTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhIG5ldyBvYmplY3QgdGhhdCBkb2VzIG5vdCBjb250YWluIGEgYHByb3BgIHByb3BlcnR5LlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBPYmplY3RcbiAgICAgKiBAc2lnIFN0cmluZyAtPiB7azogdn0gLT4ge2s6IHZ9XG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHByb3AgdGhlIG5hbWUgb2YgdGhlIHByb3BlcnR5IHRvIGRpc3NvY2lhdGVcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb2JqIHRoZSBvYmplY3QgdG8gY2xvbmVcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IGEgbmV3IG9iamVjdCBzaW1pbGFyIHRvIHRoZSBvcmlnaW5hbCBidXQgd2l0aG91dCB0aGUgc3BlY2lmaWVkIHByb3BlcnR5XG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgUi5kaXNzb2MoJ2InLCB7YTogMSwgYjogMiwgYzogM30pOyAvLz0+IHthOiAxLCBjOiAzfVxuICAgICAqL1xuICAgIHZhciBkaXNzb2MgPSBfY3VycnkyKF9kaXNzb2MpO1xuXG4gICAgLyoqXG4gICAgICogRGl2aWRlcyB0d28gbnVtYmVycy4gRXF1aXZhbGVudCB0byBgYSAvIGJgLlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBNYXRoXG4gICAgICogQHNpZyBOdW1iZXIgLT4gTnVtYmVyIC0+IE51bWJlclxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBhIFRoZSBmaXJzdCB2YWx1ZS5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gYiBUaGUgc2Vjb25kIHZhbHVlLlxuICAgICAqIEByZXR1cm4ge051bWJlcn0gVGhlIHJlc3VsdCBvZiBgYSAvIGJgLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIFIuZGl2aWRlKDcxLCAxMDApOyAvLz0+IDAuNzFcbiAgICAgKlxuICAgICAqICAgICAgdmFyIGhhbGYgPSBSLmRpdmlkZShSLl9fLCAyKTtcbiAgICAgKiAgICAgIGhhbGYoNDIpOyAvLz0+IDIxXG4gICAgICpcbiAgICAgKiAgICAgIHZhciByZWNpcHJvY2FsID0gUi5kaXZpZGUoMSk7XG4gICAgICogICAgICByZWNpcHJvY2FsKDQpOyAgIC8vPT4gMC4yNVxuICAgICAqL1xuICAgIHZhciBkaXZpZGUgPSBfY3VycnkyKGZ1bmN0aW9uIGRpdmlkZShhLCBiKSB7XG4gICAgICAgIHJldHVybiBhIC8gYjtcbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIEEgZnVuY3Rpb24gd3JhcHBpbmcgY2FsbHMgdG8gdGhlIHR3byBmdW5jdGlvbnMgaW4gYW4gYHx8YCBvcGVyYXRpb24sIHJldHVybmluZyB0aGUgcmVzdWx0IG9mIHRoZSBmaXJzdFxuICAgICAqIGZ1bmN0aW9uIGlmIGl0IGlzIHRydXRoLXkgYW5kIHRoZSByZXN1bHQgb2YgdGhlIHNlY29uZCBmdW5jdGlvbiBvdGhlcndpc2UuICBOb3RlIHRoYXQgdGhpcyBpc1xuICAgICAqIHNob3J0LWNpcmN1aXRlZCwgbWVhbmluZyB0aGF0IHRoZSBzZWNvbmQgZnVuY3Rpb24gd2lsbCBub3QgYmUgaW52b2tlZCBpZiB0aGUgZmlyc3QgcmV0dXJucyBhIHRydXRoLXlcbiAgICAgKiB2YWx1ZS5cbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgTG9naWNcbiAgICAgKiBAc2lnICgqLi4uIC0+IEJvb2xlYW4pIC0+ICgqLi4uIC0+IEJvb2xlYW4pIC0+ICgqLi4uIC0+IEJvb2xlYW4pXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gZiBhIHByZWRpY2F0ZVxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGcgYW5vdGhlciBwcmVkaWNhdGVcbiAgICAgKiBAcmV0dXJuIHtGdW5jdGlvbn0gYSBmdW5jdGlvbiB0aGF0IGFwcGxpZXMgaXRzIGFyZ3VtZW50cyB0byBgZmAgYW5kIGBnYCBhbmQgYHx8YHMgdGhlaXIgb3V0cHV0cyB0b2dldGhlci5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICB2YXIgZ3QxMCA9IGZ1bmN0aW9uKHgpIHsgcmV0dXJuIHggPiAxMDsgfTtcbiAgICAgKiAgICAgIHZhciBldmVuID0gZnVuY3Rpb24oeCkgeyByZXR1cm4geCAlIDIgPT09IDAgfTtcbiAgICAgKiAgICAgIHZhciBmID0gUi5laXRoZXIoZ3QxMCwgZXZlbik7XG4gICAgICogICAgICBmKDEwMSk7IC8vPT4gdHJ1ZVxuICAgICAqICAgICAgZig4KTsgLy89PiB0cnVlXG4gICAgICovXG4gICAgdmFyIGVpdGhlciA9IF9jdXJyeTIoZnVuY3Rpb24gZWl0aGVyKGYsIGcpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIF9laXRoZXIoKSB7XG4gICAgICAgICAgICByZXR1cm4gZi5hcHBseSh0aGlzLCBhcmd1bWVudHMpIHx8IGcuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgfTtcbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSBuZXcgb2JqZWN0IGJ5IHJlY3Vyc2l2ZWx5IGV2b2x2aW5nIGEgc2hhbGxvdyBjb3B5IG9mIGBvYmplY3RgLCBhY2NvcmRpbmcgdG8gdGhlXG4gICAgICogYHRyYW5zZm9ybWF0aW9uYCBmdW5jdGlvbnMuIEFsbCBub24tcHJpbWl0aXZlIHByb3BlcnRpZXMgYXJlIGNvcGllZCBieSByZWZlcmVuY2UuXG4gICAgICpcbiAgICAgKiBBIGB0cmFuZm9ybWF0aW9uYCBmdW5jdGlvbiB3aWxsIG5vdCBiZSBpbnZva2VkIGlmIGl0cyBjb3JyZXNwb25kaW5nIGtleSBkb2VzIG5vdCBleGlzdCBpblxuICAgICAqIHRoZSBldm9sdmVkIG9iamVjdC5cbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgT2JqZWN0XG4gICAgICogQHNpZyB7azogKHYgLT4gdil9IC0+IHtrOiB2fSAtPiB7azogdn1cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gdHJhbnNmb3JtYXRpb25zIFRoZSBvYmplY3Qgc3BlY2lmeWluZyB0cmFuc2Zvcm1hdGlvbiBmdW5jdGlvbnMgdG8gYXBwbHlcbiAgICAgKiAgICAgICAgdG8gdGhlIG9iamVjdC5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gYmUgdHJhbnNmb3JtZWQuXG4gICAgICogQHJldHVybiB7T2JqZWN0fSBUaGUgdHJhbnNmb3JtZWQgb2JqZWN0LlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIHZhciB0b21hdG8gID0ge2ZpcnN0TmFtZTogJyAgVG9tYXRvICcsIGVsYXBzZWQ6IDEwMCwgcmVtYWluaW5nOiAxNDAwfTtcbiAgICAgKiAgICAgIHZhciB0cmFuc2Zvcm1hdGlvbnMgPSB7XG4gICAgICogICAgICAgIGZpcnN0TmFtZTogUi50cmltLFxuICAgICAqICAgICAgICBsYXN0TmFtZTogUi50cmltLCAvLyBXaWxsIG5vdCBnZXQgaW52b2tlZC5cbiAgICAgKiAgICAgICAgZGF0YToge2VsYXBzZWQ6IFIuYWRkKDEpLCByZW1haW5pbmc6IFIuYWRkKC0xKX1cbiAgICAgKiAgICAgIH07XG4gICAgICogICAgICBSLmV2b2x2ZSh0cmFuc2Zvcm1hdGlvbnMsIHRvbWF0byk7IC8vPT4ge2ZpcnN0TmFtZTogJ1RvbWF0bycsIGRhdGE6IHtlbGFwc2VkOiAxMDEsIHJlbWFpbmluZzogMTM5OX19XG4gICAgICovXG4gICAgdmFyIGV2b2x2ZSA9IF9jdXJyeTIoZnVuY3Rpb24gZXZvbHZlKHRyYW5zZm9ybWF0aW9ucywgb2JqZWN0KSB7XG4gICAgICAgIHZhciB0cmFuc2Zvcm1hdGlvbiwga2V5LCB0eXBlLCByZXN1bHQgPSB7fTtcbiAgICAgICAgZm9yIChrZXkgaW4gb2JqZWN0KSB7XG4gICAgICAgICAgICB0cmFuc2Zvcm1hdGlvbiA9IHRyYW5zZm9ybWF0aW9uc1trZXldO1xuICAgICAgICAgICAgdHlwZSA9IHR5cGVvZiB0cmFuc2Zvcm1hdGlvbjtcbiAgICAgICAgICAgIHJlc3VsdFtrZXldID0gdHlwZSA9PT0gJ2Z1bmN0aW9uJyA/IHRyYW5zZm9ybWF0aW9uKG9iamVjdFtrZXldKSA6IHR5cGUgPT09ICdvYmplY3QnID8gZXZvbHZlKHRyYW5zZm9ybWF0aW9uc1trZXldLCBvYmplY3Rba2V5XSkgOiBvYmplY3Rba2V5XTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogTGlrZSBgZmlsdGVyYCwgYnV0IHBhc3NlcyBhZGRpdGlvbmFsIHBhcmFtZXRlcnMgdG8gdGhlIHByZWRpY2F0ZSBmdW5jdGlvbi4gVGhlIHByZWRpY2F0ZVxuICAgICAqIGZ1bmN0aW9uIGlzIHBhc3NlZCB0aHJlZSBhcmd1bWVudHM6ICoodmFsdWUsIGluZGV4LCBsaXN0KSouXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IExpc3RcbiAgICAgKiBAc2lnIChhLCBpLCBbYV0gLT4gQm9vbGVhbikgLT4gW2FdIC0+IFthXVxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBmdW5jdGlvbiBjYWxsZWQgcGVyIGl0ZXJhdGlvbi5cbiAgICAgKiBAcGFyYW0ge0FycmF5fSBsaXN0IFRoZSBjb2xsZWN0aW9uIHRvIGl0ZXJhdGUgb3Zlci5cbiAgICAgKiBAcmV0dXJuIHtBcnJheX0gVGhlIG5ldyBmaWx0ZXJlZCBhcnJheS5cbiAgICAgKiBAZGVwcmVjYXRlZCBzaW5jZSB2MC4xNS4wXG4gICAgICogQHNlZSBSLmFkZEluZGV4XG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgdmFyIGxhc3RUd28gPSBmdW5jdGlvbih2YWwsIGlkeCwgbGlzdCkge1xuICAgICAqICAgICAgICByZXR1cm4gbGlzdC5sZW5ndGggLSBpZHggPD0gMjtcbiAgICAgKiAgICAgIH07XG4gICAgICogICAgICBSLmZpbHRlckluZGV4ZWQobGFzdFR3bywgWzgsIDYsIDcsIDUsIDMsIDAsIDldKTsgLy89PiBbMCwgOV1cbiAgICAgKi9cbiAgICB2YXIgZmlsdGVySW5kZXhlZCA9IF9jdXJyeTIoX2ZpbHRlckluZGV4ZWQpO1xuXG4gICAgLyoqXG4gICAgICogTGlrZSBgZm9yRWFjaGAsIGJ1dCBidXQgcGFzc2VzIGFkZGl0aW9uYWwgcGFyYW1ldGVycyB0byB0aGUgcHJlZGljYXRlIGZ1bmN0aW9uLlxuICAgICAqXG4gICAgICogYGZuYCByZWNlaXZlcyB0aHJlZSBhcmd1bWVudHM6ICoodmFsdWUsIGluZGV4LCBsaXN0KSouXG4gICAgICpcbiAgICAgKiBOb3RlOiBgUi5mb3JFYWNoSW5kZXhlZGAgZG9lcyBub3Qgc2tpcCBkZWxldGVkIG9yIHVuYXNzaWduZWQgaW5kaWNlcyAoc3BhcnNlIGFycmF5cyksXG4gICAgICogdW5saWtlIHRoZSBuYXRpdmUgYEFycmF5LnByb3RvdHlwZS5mb3JFYWNoYCBtZXRob2QuIEZvciBtb3JlIGRldGFpbHMgb24gdGhpcyBiZWhhdmlvcixcbiAgICAgKiBzZWU6XG4gICAgICogaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvQXJyYXkvZm9yRWFjaCNEZXNjcmlwdGlvblxuICAgICAqXG4gICAgICogQWxzbyBub3RlIHRoYXQsIHVubGlrZSBgQXJyYXkucHJvdG90eXBlLmZvckVhY2hgLCBSYW1kYSdzIGBmb3JFYWNoYCByZXR1cm5zIHRoZSBvcmlnaW5hbFxuICAgICAqIGFycmF5LiBJbiBzb21lIGxpYnJhcmllcyB0aGlzIGZ1bmN0aW9uIGlzIG5hbWVkIGBlYWNoYC5cbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgTGlzdFxuICAgICAqIEBzaWcgKGEsIGksIFthXSAtPiApIC0+IFthXSAtPiBbYV1cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgZnVuY3Rpb24gdG8gaW52b2tlLiBSZWNlaXZlcyB0aHJlZSBhcmd1bWVudHM6XG4gICAgICogICAgICAgIChgdmFsdWVgLCBgaW5kZXhgLCBgbGlzdGApLlxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGxpc3QgVGhlIGxpc3QgdG8gaXRlcmF0ZSBvdmVyLlxuICAgICAqIEByZXR1cm4ge0FycmF5fSBUaGUgb3JpZ2luYWwgbGlzdC5cbiAgICAgKiBAZGVwcmVjYXRlZCBzaW5jZSB2MC4xNS4wXG4gICAgICogQHNlZSBSLmFkZEluZGV4XG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgLy8gTm90ZSB0aGF0IGhhdmluZyBhY2Nlc3MgdG8gdGhlIG9yaWdpbmFsIGBsaXN0YCBhbGxvd3MgZm9yXG4gICAgICogICAgICAvLyBtdXRhdGlvbi4gV2hpbGUgeW91ICpjYW4qIGRvIHRoaXMsIGl0J3MgdmVyeSB1bi1mdW5jdGlvbmFsIGJlaGF2aW9yOlxuICAgICAqICAgICAgdmFyIHBsdXNGaXZlID0gZnVuY3Rpb24obnVtLCBpZHgsIGxpc3QpIHsgbGlzdFtpZHhdID0gbnVtICsgNSB9O1xuICAgICAqICAgICAgUi5mb3JFYWNoSW5kZXhlZChwbHVzRml2ZSwgWzEsIDIsIDNdKTsgLy89PiBbNiwgNywgOF1cbiAgICAgKi9cbiAgICAvLyBpIGNhbid0IGJlYXIgbm90IHRvIHJldHVybiAqc29tZXRoaW5nKlxuICAgIHZhciBmb3JFYWNoSW5kZXhlZCA9IF9jdXJyeTIoZnVuY3Rpb24gZm9yRWFjaEluZGV4ZWQoZm4sIGxpc3QpIHtcbiAgICAgICAgdmFyIGlkeCA9IDA7XG4gICAgICAgIHdoaWxlIChpZHggPCBsaXN0Lmxlbmd0aCkge1xuICAgICAgICAgICAgZm4obGlzdFtpZHhdLCBpZHgsIGxpc3QpO1xuICAgICAgICAgICAgaWR4ICs9IDE7XG4gICAgICAgIH1cbiAgICAgICAgLy8gaSBjYW4ndCBiZWFyIG5vdCB0byByZXR1cm4gKnNvbWV0aGluZypcbiAgICAgICAgcmV0dXJuIGxpc3Q7XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgbmV3IG9iamVjdCBvdXQgb2YgYSBsaXN0IGtleS12YWx1ZSBwYWlycy5cbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgTGlzdFxuICAgICAqIEBzaWcgW1trLHZdXSAtPiB7azogdn1cbiAgICAgKiBAcGFyYW0ge0FycmF5fSBwYWlycyBBbiBhcnJheSBvZiB0d28tZWxlbWVudCBhcnJheXMgdGhhdCB3aWxsIGJlIHRoZSBrZXlzIGFuZCB2YWx1ZXMgb2YgdGhlIG91dHB1dCBvYmplY3QuXG4gICAgICogQHJldHVybiB7T2JqZWN0fSBUaGUgb2JqZWN0IG1hZGUgYnkgcGFpcmluZyB1cCBga2V5c2AgYW5kIGB2YWx1ZXNgLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIFIuZnJvbVBhaXJzKFtbJ2EnLCAxXSwgWydiJywgMl0sICBbJ2MnLCAzXV0pOyAvLz0+IHthOiAxLCBiOiAyLCBjOiAzfVxuICAgICAqL1xuICAgIHZhciBmcm9tUGFpcnMgPSBfY3VycnkxKGZ1bmN0aW9uIGZyb21QYWlycyhwYWlycykge1xuICAgICAgICB2YXIgaWR4ID0gMCwgb3V0ID0ge307XG4gICAgICAgIHdoaWxlIChpZHggPCBwYWlycy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGlmIChfaXNBcnJheShwYWlyc1tpZHhdKSAmJiBwYWlyc1tpZHhdLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIG91dFtwYWlyc1tpZHhdWzBdXSA9IHBhaXJzW2lkeF1bMV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZHggKz0gMTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0cnVlIGlmIHRoZSBmaXJzdCBwYXJhbWV0ZXIgaXMgZ3JlYXRlciB0aGFuIHRoZSBzZWNvbmQuXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IE1hdGhcbiAgICAgKiBAc2lnIE51bWJlciAtPiBOdW1iZXIgLT4gQm9vbGVhblxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBhXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGJcbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufSBhID4gYlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIFIuZ3QoMiwgNik7IC8vPT4gZmFsc2VcbiAgICAgKiAgICAgIFIuZ3QoMiwgMCk7IC8vPT4gdHJ1ZVxuICAgICAqICAgICAgUi5ndCgyLCAyKTsgLy89PiBmYWxzZVxuICAgICAqICAgICAgUi5ndChSLl9fLCAyKSgxMCk7IC8vPT4gdHJ1ZVxuICAgICAqICAgICAgUi5ndCgyKSgxMCk7IC8vPT4gZmFsc2VcbiAgICAgKi9cbiAgICB2YXIgZ3QgPSBfY3VycnkyKF9ndCk7XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRydWUgaWYgdGhlIGZpcnN0IHBhcmFtZXRlciBpcyBncmVhdGVyIHRoYW4gb3IgZXF1YWwgdG8gdGhlIHNlY29uZC5cbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgTWF0aFxuICAgICAqIEBzaWcgTnVtYmVyIC0+IE51bWJlciAtPiBCb29sZWFuXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGFcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gYlxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59IGEgPj0gYlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIFIuZ3RlKDIsIDYpOyAvLz0+IGZhbHNlXG4gICAgICogICAgICBSLmd0ZSgyLCAwKTsgLy89PiB0cnVlXG4gICAgICogICAgICBSLmd0ZSgyLCAyKTsgLy89PiB0cnVlXG4gICAgICogICAgICBSLmd0ZShSLl9fLCA2KSgyKTsgLy89PiBmYWxzZVxuICAgICAqICAgICAgUi5ndGUoMikoMCk7IC8vPT4gdHJ1ZVxuICAgICAqL1xuICAgIHZhciBndGUgPSBfY3VycnkyKGZ1bmN0aW9uIGd0ZShhLCBiKSB7XG4gICAgICAgIHJldHVybiBhID49IGI7XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHdoZXRoZXIgb3Igbm90IGFuIG9iamVjdCBoYXMgYW4gb3duIHByb3BlcnR5IHdpdGhcbiAgICAgKiB0aGUgc3BlY2lmaWVkIG5hbWVcbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgT2JqZWN0XG4gICAgICogQHNpZyBzIC0+IHtzOiB4fSAtPiBCb29sZWFuXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHByb3AgVGhlIG5hbWUgb2YgdGhlIHByb3BlcnR5IHRvIGNoZWNrIGZvci5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb2JqIFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn0gV2hldGhlciB0aGUgcHJvcGVydHkgZXhpc3RzLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIHZhciBoYXNOYW1lID0gUi5oYXMoJ25hbWUnKTtcbiAgICAgKiAgICAgIGhhc05hbWUoe25hbWU6ICdhbGljZSd9KTsgICAvLz0+IHRydWVcbiAgICAgKiAgICAgIGhhc05hbWUoe25hbWU6ICdib2InfSk7ICAgICAvLz0+IHRydWVcbiAgICAgKiAgICAgIGhhc05hbWUoe30pOyAgICAgICAgICAgICAgICAvLz0+IGZhbHNlXG4gICAgICpcbiAgICAgKiAgICAgIHZhciBwb2ludCA9IHt4OiAwLCB5OiAwfTtcbiAgICAgKiAgICAgIHZhciBwb2ludEhhcyA9IFIuaGFzKFIuX18sIHBvaW50KTtcbiAgICAgKiAgICAgIHBvaW50SGFzKCd4Jyk7ICAvLz0+IHRydWVcbiAgICAgKiAgICAgIHBvaW50SGFzKCd5Jyk7ICAvLz0+IHRydWVcbiAgICAgKiAgICAgIHBvaW50SGFzKCd6Jyk7ICAvLz0+IGZhbHNlXG4gICAgICovXG4gICAgdmFyIGhhcyA9IF9jdXJyeTIoX2hhcyk7XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHdoZXRoZXIgb3Igbm90IGFuIG9iamVjdCBvciBpdHMgcHJvdG90eXBlIGNoYWluIGhhc1xuICAgICAqIGEgcHJvcGVydHkgd2l0aCB0aGUgc3BlY2lmaWVkIG5hbWVcbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgT2JqZWN0XG4gICAgICogQHNpZyBzIC0+IHtzOiB4fSAtPiBCb29sZWFuXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHByb3AgVGhlIG5hbWUgb2YgdGhlIHByb3BlcnR5IHRvIGNoZWNrIGZvci5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb2JqIFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn0gV2hldGhlciB0aGUgcHJvcGVydHkgZXhpc3RzLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIGZ1bmN0aW9uIFJlY3RhbmdsZSh3aWR0aCwgaGVpZ2h0KSB7XG4gICAgICogICAgICAgIHRoaXMud2lkdGggPSB3aWR0aDtcbiAgICAgKiAgICAgICAgdGhpcy5oZWlnaHQgPSBoZWlnaHQ7XG4gICAgICogICAgICB9XG4gICAgICogICAgICBSZWN0YW5nbGUucHJvdG90eXBlLmFyZWEgPSBmdW5jdGlvbigpIHtcbiAgICAgKiAgICAgICAgcmV0dXJuIHRoaXMud2lkdGggKiB0aGlzLmhlaWdodDtcbiAgICAgKiAgICAgIH07XG4gICAgICpcbiAgICAgKiAgICAgIHZhciBzcXVhcmUgPSBuZXcgUmVjdGFuZ2xlKDIsIDIpO1xuICAgICAqICAgICAgUi5oYXNJbignd2lkdGgnLCBzcXVhcmUpOyAgLy89PiB0cnVlXG4gICAgICogICAgICBSLmhhc0luKCdhcmVhJywgc3F1YXJlKTsgIC8vPT4gdHJ1ZVxuICAgICAqL1xuICAgIHZhciBoYXNJbiA9IF9jdXJyeTIoZnVuY3Rpb24gKHByb3AsIG9iaikge1xuICAgICAgICByZXR1cm4gcHJvcCBpbiBvYmo7XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRydWUgaWYgaXRzIGFyZ3VtZW50cyBhcmUgaWRlbnRpY2FsLCBmYWxzZSBvdGhlcndpc2UuIFZhbHVlcyBhcmVcbiAgICAgKiBpZGVudGljYWwgaWYgdGhleSByZWZlcmVuY2UgdGhlIHNhbWUgbWVtb3J5LiBgTmFOYCBpcyBpZGVudGljYWwgdG8gYE5hTmA7XG4gICAgICogYDBgIGFuZCBgLTBgIGFyZSBub3QgaWRlbnRpY2FsLlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBSZWxhdGlvblxuICAgICAqIEBzaWcgYSAtPiBhIC0+IEJvb2xlYW5cbiAgICAgKiBAcGFyYW0geyp9IGFcbiAgICAgKiBAcGFyYW0geyp9IGJcbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIHZhciBvID0ge307XG4gICAgICogICAgICBSLmlkZW50aWNhbChvLCBvKTsgLy89PiB0cnVlXG4gICAgICogICAgICBSLmlkZW50aWNhbCgxLCAxKTsgLy89PiB0cnVlXG4gICAgICogICAgICBSLmlkZW50aWNhbCgxLCAnMScpOyAvLz0+IGZhbHNlXG4gICAgICogICAgICBSLmlkZW50aWNhbChbXSwgW10pOyAvLz0+IGZhbHNlXG4gICAgICogICAgICBSLmlkZW50aWNhbCgwLCAtMCk7IC8vPT4gZmFsc2VcbiAgICAgKiAgICAgIFIuaWRlbnRpY2FsKE5hTiwgTmFOKTsgLy89PiB0cnVlXG4gICAgICovXG4gICAgLy8gU2FtZVZhbHVlIGFsZ29yaXRobVxuICAgIC8vIFN0ZXBzIDEtNSwgNy0xMFxuICAgIC8vIFN0ZXBzIDYuYi02LmU6ICswICE9IC0wXG4gICAgLy8gU3RlcCA2LmE6IE5hTiA9PSBOYU5cbiAgICB2YXIgaWRlbnRpY2FsID0gX2N1cnJ5MihmdW5jdGlvbiBpZGVudGljYWwoYSwgYikge1xuICAgICAgICAvLyBTYW1lVmFsdWUgYWxnb3JpdGhtXG4gICAgICAgIGlmIChhID09PSBiKSB7XG4gICAgICAgICAgICAvLyBTdGVwcyAxLTUsIDctMTBcbiAgICAgICAgICAgIC8vIFN0ZXBzIDYuYi02LmU6ICswICE9IC0wXG4gICAgICAgICAgICByZXR1cm4gYSAhPT0gMCB8fCAxIC8gYSA9PT0gMSAvIGI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBTdGVwIDYuYTogTmFOID09IE5hTlxuICAgICAgICAgICAgcmV0dXJuIGEgIT09IGEgJiYgYiAhPT0gYjtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogQSBmdW5jdGlvbiB0aGF0IGRvZXMgbm90aGluZyBidXQgcmV0dXJuIHRoZSBwYXJhbWV0ZXIgc3VwcGxpZWQgdG8gaXQuIEdvb2QgYXMgYSBkZWZhdWx0XG4gICAgICogb3IgcGxhY2Vob2xkZXIgZnVuY3Rpb24uXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IEZ1bmN0aW9uXG4gICAgICogQHNpZyBhIC0+IGFcbiAgICAgKiBAcGFyYW0geyp9IHggVGhlIHZhbHVlIHRvIHJldHVybi5cbiAgICAgKiBAcmV0dXJuIHsqfSBUaGUgaW5wdXQgdmFsdWUsIGB4YC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICBSLmlkZW50aXR5KDEpOyAvLz0+IDFcbiAgICAgKlxuICAgICAqICAgICAgdmFyIG9iaiA9IHt9O1xuICAgICAqICAgICAgUi5pZGVudGl0eShvYmopID09PSBvYmo7IC8vPT4gdHJ1ZVxuICAgICAqL1xuICAgIHZhciBpZGVudGl0eSA9IF9jdXJyeTEoX2lkZW50aXR5KTtcblxuICAgIC8qKlxuICAgICAqIEluY3JlbWVudHMgaXRzIGFyZ3VtZW50LlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBNYXRoXG4gICAgICogQHNpZyBOdW1iZXIgLT4gTnVtYmVyXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IG5cbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9XG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgUi5pbmMoNDIpOyAvLz0+IDQzXG4gICAgICovXG4gICAgdmFyIGluYyA9IGFkZCgxKTtcblxuICAgIC8qKlxuICAgICAqIEluc2VydHMgdGhlIHN1Yi1saXN0IGludG8gdGhlIGxpc3QsIGF0IGluZGV4IGBpbmRleGAuICBfTm90ZSAgdGhhdCB0aGlzXG4gICAgICogaXMgbm90IGRlc3RydWN0aXZlXzogaXQgcmV0dXJucyBhIGNvcHkgb2YgdGhlIGxpc3Qgd2l0aCB0aGUgY2hhbmdlcy5cbiAgICAgKiA8c21hbGw+Tm8gbGlzdHMgaGF2ZSBiZWVuIGhhcm1lZCBpbiB0aGUgYXBwbGljYXRpb24gb2YgdGhpcyBmdW5jdGlvbi48L3NtYWxsPlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBMaXN0XG4gICAgICogQHNpZyBOdW1iZXIgLT4gW2FdIC0+IFthXSAtPiBbYV1cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gaW5kZXggVGhlIHBvc2l0aW9uIHRvIGluc2VydCB0aGUgc3ViLWxpc3RcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBlbHRzIFRoZSBzdWItbGlzdCB0byBpbnNlcnQgaW50byB0aGUgQXJyYXlcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBsaXN0IFRoZSBsaXN0IHRvIGluc2VydCB0aGUgc3ViLWxpc3QgaW50b1xuICAgICAqIEByZXR1cm4ge0FycmF5fSBBIG5ldyBBcnJheSB3aXRoIGBlbHRzYCBpbnNlcnRlZCBzdGFydGluZyBhdCBgaW5kZXhgLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIFIuaW5zZXJ0QWxsKDIsIFsneCcsJ3knLCd6J10sIFsxLDIsMyw0XSk7IC8vPT4gWzEsMiwneCcsJ3knLCd6JywzLDRdXG4gICAgICovXG4gICAgdmFyIGluc2VydEFsbCA9IF9jdXJyeTMoZnVuY3Rpb24gaW5zZXJ0QWxsKGlkeCwgZWx0cywgbGlzdCkge1xuICAgICAgICBpZHggPSBpZHggPCBsaXN0Lmxlbmd0aCAmJiBpZHggPj0gMCA/IGlkeCA6IGxpc3QubGVuZ3RoO1xuICAgICAgICByZXR1cm4gX2NvbmNhdChfY29uY2F0KF9zbGljZShsaXN0LCAwLCBpZHgpLCBlbHRzKSwgX3NsaWNlKGxpc3QsIGlkeCkpO1xuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogU2VlIGlmIGFuIG9iamVjdCAoYHZhbGApIGlzIGFuIGluc3RhbmNlIG9mIHRoZSBzdXBwbGllZCBjb25zdHJ1Y3Rvci5cbiAgICAgKiBUaGlzIGZ1bmN0aW9uIHdpbGwgY2hlY2sgdXAgdGhlIGluaGVyaXRhbmNlIGNoYWluLCBpZiBhbnkuXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IFR5cGVcbiAgICAgKiBAc2lnICgqIC0+IHsqfSkgLT4gYSAtPiBCb29sZWFuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGN0b3IgQSBjb25zdHJ1Y3RvclxuICAgICAqIEBwYXJhbSB7Kn0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gICAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICBSLmlzKE9iamVjdCwge30pOyAvLz0+IHRydWVcbiAgICAgKiAgICAgIFIuaXMoTnVtYmVyLCAxKTsgLy89PiB0cnVlXG4gICAgICogICAgICBSLmlzKE9iamVjdCwgMSk7IC8vPT4gZmFsc2VcbiAgICAgKiAgICAgIFIuaXMoU3RyaW5nLCAncycpOyAvLz0+IHRydWVcbiAgICAgKiAgICAgIFIuaXMoU3RyaW5nLCBuZXcgU3RyaW5nKCcnKSk7IC8vPT4gdHJ1ZVxuICAgICAqICAgICAgUi5pcyhPYmplY3QsIG5ldyBTdHJpbmcoJycpKTsgLy89PiB0cnVlXG4gICAgICogICAgICBSLmlzKE9iamVjdCwgJ3MnKTsgLy89PiBmYWxzZVxuICAgICAqICAgICAgUi5pcyhOdW1iZXIsIHt9KTsgLy89PiBmYWxzZVxuICAgICAqL1xuICAgIHZhciBpcyA9IF9jdXJyeTIoZnVuY3Rpb24gaXMoQ3RvciwgdmFsKSB7XG4gICAgICAgIHJldHVybiB2YWwgIT0gbnVsbCAmJiB2YWwuY29uc3RydWN0b3IgPT09IEN0b3IgfHwgdmFsIGluc3RhbmNlb2YgQ3RvcjtcbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIFRlc3RzIHdoZXRoZXIgb3Igbm90IGFuIG9iamVjdCBpcyBzaW1pbGFyIHRvIGFuIGFycmF5LlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBUeXBlXG4gICAgICogQGNhdGVnb3J5IExpc3RcbiAgICAgKiBAc2lnICogLT4gQm9vbGVhblxuICAgICAqIEBwYXJhbSB7Kn0geCBUaGUgb2JqZWN0IHRvIHRlc3QuXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn0gYHRydWVgIGlmIGB4YCBoYXMgYSBudW1lcmljIGxlbmd0aCBwcm9wZXJ0eSBhbmQgZXh0cmVtZSBpbmRpY2VzIGRlZmluZWQ7IGBmYWxzZWAgb3RoZXJ3aXNlLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIFIuaXNBcnJheUxpa2UoW10pOyAvLz0+IHRydWVcbiAgICAgKiAgICAgIFIuaXNBcnJheUxpa2UodHJ1ZSk7IC8vPT4gZmFsc2VcbiAgICAgKiAgICAgIFIuaXNBcnJheUxpa2Uoe30pOyAvLz0+IGZhbHNlXG4gICAgICogICAgICBSLmlzQXJyYXlMaWtlKHtsZW5ndGg6IDEwfSk7IC8vPT4gZmFsc2VcbiAgICAgKiAgICAgIFIuaXNBcnJheUxpa2UoezA6ICd6ZXJvJywgOTogJ25pbmUnLCBsZW5ndGg6IDEwfSk7IC8vPT4gdHJ1ZVxuICAgICAqL1xuICAgIHZhciBpc0FycmF5TGlrZSA9IF9jdXJyeTEoZnVuY3Rpb24gaXNBcnJheUxpa2UoeCkge1xuICAgICAgICBpZiAoX2lzQXJyYXkoeCkpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmICgheCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgeCAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoeCBpbnN0YW5jZW9mIFN0cmluZykge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmICh4Lm5vZGVUeXBlID09PSAxKSB7XG4gICAgICAgICAgICByZXR1cm4gISF4Lmxlbmd0aDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoeC5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmICh4Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHJldHVybiB4Lmhhc093blByb3BlcnR5KDApICYmIHguaGFzT3duUHJvcGVydHkoeC5sZW5ndGggLSAxKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBSZXBvcnRzIHdoZXRoZXIgdGhlIGxpc3QgaGFzIHplcm8gZWxlbWVudHMuXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IExvZ2ljXG4gICAgICogQHNpZyBbYV0gLT4gQm9vbGVhblxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGxpc3RcbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIFIuaXNFbXB0eShbMSwgMiwgM10pOyAvLz0+IGZhbHNlXG4gICAgICogICAgICBSLmlzRW1wdHkoW10pOyAvLz0+IHRydWVcbiAgICAgKiAgICAgIFIuaXNFbXB0eSgnJyk7IC8vPT4gdHJ1ZVxuICAgICAqICAgICAgUi5pc0VtcHR5KG51bGwpOyAvLz0+IGZhbHNlXG4gICAgICovXG4gICAgdmFyIGlzRW1wdHkgPSBfY3VycnkxKGZ1bmN0aW9uIGlzRW1wdHkobGlzdCkge1xuICAgICAgICByZXR1cm4gT2JqZWN0KGxpc3QpLmxlbmd0aCA9PT0gMDtcbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIENoZWNrcyBpZiB0aGUgaW5wdXQgdmFsdWUgaXMgYG51bGxgIG9yIGB1bmRlZmluZWRgLlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBUeXBlXG4gICAgICogQHNpZyAqIC0+IEJvb2xlYW5cbiAgICAgKiBAcGFyYW0geyp9IHggVGhlIHZhbHVlIHRvIHRlc3QuXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn0gYHRydWVgIGlmIGB4YCBpcyBgdW5kZWZpbmVkYCBvciBgbnVsbGAsIG90aGVyd2lzZSBgZmFsc2VgLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIFIuaXNOaWwobnVsbCk7IC8vPT4gdHJ1ZVxuICAgICAqICAgICAgUi5pc05pbCh1bmRlZmluZWQpOyAvLz0+IHRydWVcbiAgICAgKiAgICAgIFIuaXNOaWwoMCk7IC8vPT4gZmFsc2VcbiAgICAgKiAgICAgIFIuaXNOaWwoW10pOyAvLz0+IGZhbHNlXG4gICAgICovXG4gICAgdmFyIGlzTmlsID0gX2N1cnJ5MShmdW5jdGlvbiBpc05pbCh4KSB7XG4gICAgICAgIHJldHVybiB4ID09IG51bGw7XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGEgbGlzdCBjb250YWluaW5nIHRoZSBuYW1lcyBvZiBhbGwgdGhlIGVudW1lcmFibGUgb3duXG4gICAgICogcHJvcGVydGllcyBvZiB0aGUgc3VwcGxpZWQgb2JqZWN0LlxuICAgICAqIE5vdGUgdGhhdCB0aGUgb3JkZXIgb2YgdGhlIG91dHB1dCBhcnJheSBpcyBub3QgZ3VhcmFudGVlZCB0byBiZVxuICAgICAqIGNvbnNpc3RlbnQgYWNyb3NzIGRpZmZlcmVudCBKUyBwbGF0Zm9ybXMuXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IE9iamVjdFxuICAgICAqIEBzaWcge2s6IHZ9IC0+IFtrXVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvYmogVGhlIG9iamVjdCB0byBleHRyYWN0IHByb3BlcnRpZXMgZnJvbVxuICAgICAqIEByZXR1cm4ge0FycmF5fSBBbiBhcnJheSBvZiB0aGUgb2JqZWN0J3Mgb3duIHByb3BlcnRpZXMuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgUi5rZXlzKHthOiAxLCBiOiAyLCBjOiAzfSk7IC8vPT4gWydhJywgJ2InLCAnYyddXG4gICAgICovXG4gICAgLy8gY292ZXIgSUUgPCA5IGtleXMgaXNzdWVzXG4gICAgdmFyIGtleXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIGNvdmVyIElFIDwgOSBrZXlzIGlzc3Vlc1xuICAgICAgICB2YXIgaGFzRW51bUJ1ZyA9ICF7IHRvU3RyaW5nOiBudWxsIH0ucHJvcGVydHlJc0VudW1lcmFibGUoJ3RvU3RyaW5nJyk7XG4gICAgICAgIHZhciBub25FbnVtZXJhYmxlUHJvcHMgPSBbXG4gICAgICAgICAgICAnY29uc3RydWN0b3InLFxuICAgICAgICAgICAgJ3ZhbHVlT2YnLFxuICAgICAgICAgICAgJ2lzUHJvdG90eXBlT2YnLFxuICAgICAgICAgICAgJ3RvU3RyaW5nJyxcbiAgICAgICAgICAgICdwcm9wZXJ0eUlzRW51bWVyYWJsZScsXG4gICAgICAgICAgICAnaGFzT3duUHJvcGVydHknLFxuICAgICAgICAgICAgJ3RvTG9jYWxlU3RyaW5nJ1xuICAgICAgICBdO1xuICAgICAgICB2YXIgY29udGFpbnMgPSBmdW5jdGlvbiBjb250YWlucyhsaXN0LCBpdGVtKSB7XG4gICAgICAgICAgICB2YXIgaWR4ID0gMDtcbiAgICAgICAgICAgIHdoaWxlIChpZHggPCBsaXN0Lmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGlmIChsaXN0W2lkeF0gPT09IGl0ZW0pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlkeCArPSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gdHlwZW9mIE9iamVjdC5rZXlzID09PSAnZnVuY3Rpb24nID8gX2N1cnJ5MShmdW5jdGlvbiBrZXlzKG9iaikge1xuICAgICAgICAgICAgcmV0dXJuIE9iamVjdChvYmopICE9PSBvYmogPyBbXSA6IE9iamVjdC5rZXlzKG9iaik7XG4gICAgICAgIH0pIDogX2N1cnJ5MShmdW5jdGlvbiBrZXlzKG9iaikge1xuICAgICAgICAgICAgaWYgKE9iamVjdChvYmopICE9PSBvYmopIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgcHJvcCwga3MgPSBbXSwgbklkeDtcbiAgICAgICAgICAgIGZvciAocHJvcCBpbiBvYmopIHtcbiAgICAgICAgICAgICAgICBpZiAoX2hhcyhwcm9wLCBvYmopKSB7XG4gICAgICAgICAgICAgICAgICAgIGtzW2tzLmxlbmd0aF0gPSBwcm9wO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChoYXNFbnVtQnVnKSB7XG4gICAgICAgICAgICAgICAgbklkeCA9IG5vbkVudW1lcmFibGVQcm9wcy5sZW5ndGggLSAxO1xuICAgICAgICAgICAgICAgIHdoaWxlIChuSWR4ID49IDApIHtcbiAgICAgICAgICAgICAgICAgICAgcHJvcCA9IG5vbkVudW1lcmFibGVQcm9wc1tuSWR4XTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKF9oYXMocHJvcCwgb2JqKSAmJiAhY29udGFpbnMoa3MsIHByb3ApKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBrc1trcy5sZW5ndGhdID0gcHJvcDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBuSWR4IC09IDE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGtzO1xuICAgICAgICB9KTtcbiAgICB9KCk7XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGEgbGlzdCBjb250YWluaW5nIHRoZSBuYW1lcyBvZiBhbGwgdGhlXG4gICAgICogcHJvcGVydGllcyBvZiB0aGUgc3VwcGxpZWQgb2JqZWN0LCBpbmNsdWRpbmcgcHJvdG90eXBlIHByb3BlcnRpZXMuXG4gICAgICogTm90ZSB0aGF0IHRoZSBvcmRlciBvZiB0aGUgb3V0cHV0IGFycmF5IGlzIG5vdCBndWFyYW50ZWVkIHRvIGJlXG4gICAgICogY29uc2lzdGVudCBhY3Jvc3MgZGlmZmVyZW50IEpTIHBsYXRmb3Jtcy5cbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgT2JqZWN0XG4gICAgICogQHNpZyB7azogdn0gLT4gW2tdXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9iaiBUaGUgb2JqZWN0IHRvIGV4dHJhY3QgcHJvcGVydGllcyBmcm9tXG4gICAgICogQHJldHVybiB7QXJyYXl9IEFuIGFycmF5IG9mIHRoZSBvYmplY3QncyBvd24gYW5kIHByb3RvdHlwZSBwcm9wZXJ0aWVzLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIHZhciBGID0gZnVuY3Rpb24oKSB7IHRoaXMueCA9ICdYJzsgfTtcbiAgICAgKiAgICAgIEYucHJvdG90eXBlLnkgPSAnWSc7XG4gICAgICogICAgICB2YXIgZiA9IG5ldyBGKCk7XG4gICAgICogICAgICBSLmtleXNJbihmKTsgLy89PiBbJ3gnLCAneSddXG4gICAgICovXG4gICAgdmFyIGtleXNJbiA9IF9jdXJyeTEoZnVuY3Rpb24ga2V5c0luKG9iaikge1xuICAgICAgICB2YXIgcHJvcCwga3MgPSBbXTtcbiAgICAgICAgZm9yIChwcm9wIGluIG9iaikge1xuICAgICAgICAgICAga3Nba3MubGVuZ3RoXSA9IHByb3A7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGtzO1xuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgbnVtYmVyIG9mIGVsZW1lbnRzIGluIHRoZSBhcnJheSBieSByZXR1cm5pbmcgYGxpc3QubGVuZ3RoYC5cbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgTGlzdFxuICAgICAqIEBzaWcgW2FdIC0+IE51bWJlclxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGxpc3QgVGhlIGFycmF5IHRvIGluc3BlY3QuXG4gICAgICogQHJldHVybiB7TnVtYmVyfSBUaGUgbGVuZ3RoIG9mIHRoZSBhcnJheS5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICBSLmxlbmd0aChbXSk7IC8vPT4gMFxuICAgICAqICAgICAgUi5sZW5ndGgoWzEsIDIsIDNdKTsgLy89PiAzXG4gICAgICovXG4gICAgdmFyIGxlbmd0aCA9IF9jdXJyeTEoZnVuY3Rpb24gbGVuZ3RoKGxpc3QpIHtcbiAgICAgICAgcmV0dXJuIGxpc3QgIT0gbnVsbCAmJiBpcyhOdW1iZXIsIGxpc3QubGVuZ3RoKSA/IGxpc3QubGVuZ3RoIDogTmFOO1xuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIGxlbnMuIFN1cHBseSBhIGZ1bmN0aW9uIHRvIGBnZXRgIHZhbHVlcyBmcm9tIGluc2lkZSBhbiBvYmplY3QsIGFuZCBhIGBzZXRgXG4gICAgICogZnVuY3Rpb24gdG8gY2hhbmdlIHZhbHVlcyBvbiBhbiBvYmplY3QuIChuLmIuOiBUaGlzIGNhbiwgYW5kIHNob3VsZCwgYmUgZG9uZSB3aXRob3V0XG4gICAgICogbXV0YXRpbmcgdGhlIG9yaWdpbmFsIG9iamVjdCEpIFRoZSBsZW5zIGlzIGEgZnVuY3Rpb24gd3JhcHBlZCBhcm91bmQgdGhlIGlucHV0IGBnZXRgXG4gICAgICogZnVuY3Rpb24sIHdpdGggdGhlIGBzZXRgIGZ1bmN0aW9uIGF0dGFjaGVkIGFzIGEgcHJvcGVydHkgb24gdGhlIHdyYXBwZXIuIEEgYG1hcGBcbiAgICAgKiBmdW5jdGlvbiBpcyBhbHNvIGF0dGFjaGVkIHRvIHRoZSByZXR1cm5lZCBmdW5jdGlvbiB0aGF0IHRha2VzIGEgZnVuY3Rpb24gdG8gb3BlcmF0ZVxuICAgICAqIG9uIHRoZSBzcGVjaWZpZWQgKGBnZXRgKSBwcm9wZXJ0eSwgd2hpY2ggaXMgdGhlbiBgc2V0YCBiZWZvcmUgcmV0dXJuaW5nLiBUaGUgYXR0YWNoZWRcbiAgICAgKiBgc2V0YCBhbmQgYG1hcGAgZnVuY3Rpb25zIGFyZSBjdXJyaWVkLlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBPYmplY3RcbiAgICAgKiBAc2lnIChrIC0+IHYpIC0+ICh2IC0+IGEgLT4gKikgLT4gKGEgLT4gYilcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBnZXQgQSBmdW5jdGlvbiB0aGF0IGdldHMgYSB2YWx1ZSBieSBwcm9wZXJ0eSBuYW1lXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gc2V0IEEgZnVuY3Rpb24gdGhhdCBzZXRzIGEgdmFsdWUgYnkgcHJvcGVydHkgbmFtZVxuICAgICAqIEByZXR1cm4ge0Z1bmN0aW9ufSB0aGUgcmV0dXJuZWQgZnVuY3Rpb24gaGFzIGBzZXRgIGFuZCBgbWFwYCBwcm9wZXJ0aWVzIHRoYXQgYXJlXG4gICAgICogICAgICAgICBhbHNvIGN1cnJpZWQgZnVuY3Rpb25zLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIHZhciBoZWFkTGVucyA9IFIubGVucyhcbiAgICAgKiAgICAgICAgZnVuY3Rpb24gZ2V0KGFycikgeyByZXR1cm4gYXJyWzBdOyB9LFxuICAgICAqICAgICAgICBmdW5jdGlvbiBzZXQodmFsLCBhcnIpIHsgcmV0dXJuIFt2YWxdLmNvbmNhdChhcnIuc2xpY2UoMSkpOyB9XG4gICAgICogICAgICApO1xuICAgICAqICAgICAgaGVhZExlbnMoWzEwLCAyMCwgMzAsIDQwXSk7IC8vPT4gMTBcbiAgICAgKiAgICAgIGhlYWRMZW5zLnNldCgnbXUnLCBbMTAsIDIwLCAzMCwgNDBdKTsgLy89PiBbJ211JywgMjAsIDMwLCA0MF1cbiAgICAgKiAgICAgIGhlYWRMZW5zLm1hcChmdW5jdGlvbih4KSB7IHJldHVybiB4ICsgMTsgfSwgWzEwLCAyMCwgMzAsIDQwXSk7IC8vPT4gWzExLCAyMCwgMzAsIDQwXVxuICAgICAqXG4gICAgICogICAgICB2YXIgcGhyYXNlTGVucyA9IFIubGVucyhcbiAgICAgKiAgICAgICAgZnVuY3Rpb24gZ2V0KG9iaikgeyByZXR1cm4gb2JqLnBocmFzZTsgfSxcbiAgICAgKiAgICAgICAgZnVuY3Rpb24gc2V0KHZhbCwgb2JqKSB7XG4gICAgICogICAgICAgICAgdmFyIG91dCA9IFIuY2xvbmUob2JqKTtcbiAgICAgKiAgICAgICAgICBvdXQucGhyYXNlID0gdmFsO1xuICAgICAqICAgICAgICAgIHJldHVybiBvdXQ7XG4gICAgICogICAgICAgIH1cbiAgICAgKiAgICAgICk7XG4gICAgICogICAgICB2YXIgb2JqMSA9IHsgcGhyYXNlOiAnQWJzb2x1dGUgZmlsdGggLiAuIC4gYW5kIEkgTE9WRUQgaXQhJ307XG4gICAgICogICAgICB2YXIgb2JqMiA9IHsgcGhyYXNlOiBcIldoYXQncyBhbGwgdGhpcywgdGhlbj9cIn07XG4gICAgICogICAgICBwaHJhc2VMZW5zKG9iajEpOyAvLyA9PiAnQWJzb2x1dGUgZmlsdGggLiAuIC4gYW5kIEkgTE9WRUQgaXQhJ1xuICAgICAqICAgICAgcGhyYXNlTGVucyhvYmoyKTsgLy8gPT4gXCJXaGF0J3MgYWxsIHRoaXMsIHRoZW4/XCJcbiAgICAgKiAgICAgIHBocmFzZUxlbnMuc2V0KCdPb2ggQmV0dHknLCBvYmoxKTsgLy89PiB7IHBocmFzZTogJ09vaCBCZXR0eSd9XG4gICAgICogICAgICBwaHJhc2VMZW5zLm1hcChSLnRvVXBwZXIsIG9iajIpOyAvLz0+IHsgcGhyYXNlOiBcIldIQVQnUyBBTEwgVEhJUywgVEhFTj9cIn1cbiAgICAgKi9cbiAgICB2YXIgbGVucyA9IF9jdXJyeTIoZnVuY3Rpb24gbGVucyhnZXQsIHNldCkge1xuICAgICAgICB2YXIgbG5zID0gZnVuY3Rpb24gKGEpIHtcbiAgICAgICAgICAgIHJldHVybiBnZXQoYSk7XG4gICAgICAgIH07XG4gICAgICAgIGxucy5zZXQgPSBfY3VycnkyKHNldCk7XG4gICAgICAgIGxucy5tYXAgPSBfY3VycnkyKGZ1bmN0aW9uIChmbiwgYSkge1xuICAgICAgICAgICAgcmV0dXJuIHNldChmbihnZXQoYSkpLCBhKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBsbnM7XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGEgbGVucyBhc3NvY2lhdGVkIHdpdGggdGhlIHByb3ZpZGVkIG9iamVjdC5cbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgT2JqZWN0XG4gICAgICogQHNpZyAoe30gLT4gdikgLT4gKHYgLT4gYSAtPiAqKSAtPiB7fSAtPiAoYSAtPiBiKVxuICAgICAqIEBzZWUgUi5sZW5zXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gZ2V0IEEgZnVuY3Rpb24gdGhhdCBnZXRzIGEgdmFsdWUgYnkgcHJvcGVydHkgbmFtZVxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IHNldCBBIGZ1bmN0aW9uIHRoYXQgc2V0cyBhIHZhbHVlIGJ5IHByb3BlcnR5IG5hbWVcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gdGhlIGFjdHVhbCBvYmplY3Qgb2YgaW50ZXJlc3RcbiAgICAgKiBAcmV0dXJuIHtGdW5jdGlvbn0gdGhlIHJldHVybmVkIGZ1bmN0aW9uIGhhcyBgc2V0YCBhbmQgYG1hcGAgcHJvcGVydGllcyB0aGF0IGFyZVxuICAgICAqICAgICAgICAgYWxzbyBjdXJyaWVkIGZ1bmN0aW9ucy5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICB2YXIgeG8gPSB7eDogMX07XG4gICAgICogICAgICB2YXIgeG9MZW5zID0gUi5sZW5zT24oZnVuY3Rpb24gZ2V0KG8pIHsgcmV0dXJuIG8ueDsgfSxcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiBzZXQodikgeyByZXR1cm4ge3g6IHZ9OyB9LFxuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgIHhvKTtcbiAgICAgKiAgICAgIHhvTGVucygpOyAvLz0+IDFcbiAgICAgKiAgICAgIHhvTGVucy5zZXQoMTAwMCk7IC8vPT4ge3g6IDEwMDB9XG4gICAgICogICAgICB4b0xlbnMubWFwKFIuYWRkKDEpKTsgLy89PiB7eDogMn1cbiAgICAgKi9cbiAgICB2YXIgbGVuc09uID0gX2N1cnJ5MyhmdW5jdGlvbiBsZW5zT24oZ2V0LCBzZXQsIG9iaikge1xuICAgICAgICB2YXIgbG5zID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIGdldChvYmopO1xuICAgICAgICB9O1xuICAgICAgICBsbnMuc2V0ID0gc2V0O1xuICAgICAgICBsbnMubWFwID0gZnVuY3Rpb24gKGZuKSB7XG4gICAgICAgICAgICByZXR1cm4gc2V0KGZuKGdldChvYmopKSk7XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBsbnM7XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRydWUgaWYgdGhlIGZpcnN0IHBhcmFtZXRlciBpcyBsZXNzIHRoYW4gdGhlIHNlY29uZC5cbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgTWF0aFxuICAgICAqIEBzaWcgTnVtYmVyIC0+IE51bWJlciAtPiBCb29sZWFuXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGFcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gYlxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59IGEgPCBiXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgUi5sdCgyLCA2KTsgLy89PiB0cnVlXG4gICAgICogICAgICBSLmx0KDIsIDApOyAvLz0+IGZhbHNlXG4gICAgICogICAgICBSLmx0KDIsIDIpOyAvLz0+IGZhbHNlXG4gICAgICogICAgICBSLmx0KDUpKDEwKTsgLy89PiB0cnVlXG4gICAgICogICAgICBSLmx0KFIuX18sIDUpKDEwKTsgLy89PiBmYWxzZSAvLyByaWdodC1zZWN0aW9uZWQgY3VycnlpbmdcbiAgICAgKi9cbiAgICB2YXIgbHQgPSBfY3VycnkyKF9sdCk7XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRydWUgaWYgdGhlIGZpcnN0IHBhcmFtZXRlciBpcyBsZXNzIHRoYW4gb3IgZXF1YWwgdG8gdGhlIHNlY29uZC5cbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgTWF0aFxuICAgICAqIEBzaWcgTnVtYmVyIC0+IE51bWJlciAtPiBCb29sZWFuXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGFcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gYlxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59IGEgPD0gYlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIFIubHRlKDIsIDYpOyAvLz0+IHRydWVcbiAgICAgKiAgICAgIFIubHRlKDIsIDApOyAvLz0+IGZhbHNlXG4gICAgICogICAgICBSLmx0ZSgyLCAyKTsgLy89PiB0cnVlXG4gICAgICogICAgICBSLmx0ZShSLl9fLCAyKSgxKTsgLy89PiB0cnVlXG4gICAgICogICAgICBSLmx0ZSgyKSgxMCk7IC8vPT4gdHJ1ZVxuICAgICAqL1xuICAgIHZhciBsdGUgPSBfY3VycnkyKGZ1bmN0aW9uIGx0ZShhLCBiKSB7XG4gICAgICAgIHJldHVybiBhIDw9IGI7XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgbWFwQWNjdW0gZnVuY3Rpb24gYmVoYXZlcyBsaWtlIGEgY29tYmluYXRpb24gb2YgbWFwIGFuZCByZWR1Y2U7IGl0IGFwcGxpZXMgYVxuICAgICAqIGZ1bmN0aW9uIHRvIGVhY2ggZWxlbWVudCBvZiBhIGxpc3QsIHBhc3NpbmcgYW4gYWNjdW11bGF0aW5nIHBhcmFtZXRlciBmcm9tIGxlZnQgdG9cbiAgICAgKiByaWdodCwgYW5kIHJldHVybmluZyBhIGZpbmFsIHZhbHVlIG9mIHRoaXMgYWNjdW11bGF0b3IgdG9nZXRoZXIgd2l0aCB0aGUgbmV3IGxpc3QuXG4gICAgICpcbiAgICAgKiBUaGUgaXRlcmF0b3IgZnVuY3Rpb24gcmVjZWl2ZXMgdHdvIGFyZ3VtZW50cywgKmFjYyogYW5kICp2YWx1ZSosIGFuZCBzaG91bGQgcmV0dXJuXG4gICAgICogYSB0dXBsZSAqW2FjYywgdmFsdWVdKi5cbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgTGlzdFxuICAgICAqIEBzaWcgKGFjYyAtPiB4IC0+IChhY2MsIHkpKSAtPiBhY2MgLT4gW3hdIC0+IChhY2MsIFt5XSlcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgZnVuY3Rpb24gdG8gYmUgY2FsbGVkIG9uIGV2ZXJ5IGVsZW1lbnQgb2YgdGhlIGlucHV0IGBsaXN0YC5cbiAgICAgKiBAcGFyYW0geyp9IGFjYyBUaGUgYWNjdW11bGF0b3IgdmFsdWUuXG4gICAgICogQHBhcmFtIHtBcnJheX0gbGlzdCBUaGUgbGlzdCB0byBpdGVyYXRlIG92ZXIuXG4gICAgICogQHJldHVybiB7Kn0gVGhlIGZpbmFsLCBhY2N1bXVsYXRlZCB2YWx1ZS5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICB2YXIgZGlnaXRzID0gWycxJywgJzInLCAnMycsICc0J107XG4gICAgICogICAgICB2YXIgYXBwZW5kID0gZnVuY3Rpb24oYSwgYikge1xuICAgICAqICAgICAgICByZXR1cm4gW2EgKyBiLCBhICsgYl07XG4gICAgICogICAgICB9XG4gICAgICpcbiAgICAgKiAgICAgIFIubWFwQWNjdW0oYXBwZW5kLCAwLCBkaWdpdHMpOyAvLz0+IFsnMDEyMzQnLCBbJzAxJywgJzAxMicsICcwMTIzJywgJzAxMjM0J11dXG4gICAgICovXG4gICAgdmFyIG1hcEFjY3VtID0gX2N1cnJ5MyhmdW5jdGlvbiBtYXBBY2N1bShmbiwgYWNjLCBsaXN0KSB7XG4gICAgICAgIHZhciBpZHggPSAwLCByZXN1bHQgPSBbXSwgdHVwbGUgPSBbYWNjXTtcbiAgICAgICAgd2hpbGUgKGlkeCA8IGxpc3QubGVuZ3RoKSB7XG4gICAgICAgICAgICB0dXBsZSA9IGZuKHR1cGxlWzBdLCBsaXN0W2lkeF0pO1xuICAgICAgICAgICAgcmVzdWx0W2lkeF0gPSB0dXBsZVsxXTtcbiAgICAgICAgICAgIGlkeCArPSAxO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICB0dXBsZVswXSxcbiAgICAgICAgICAgIHJlc3VsdFxuICAgICAgICBdO1xuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogVGhlIG1hcEFjY3VtUmlnaHQgZnVuY3Rpb24gYmVoYXZlcyBsaWtlIGEgY29tYmluYXRpb24gb2YgbWFwIGFuZCByZWR1Y2U7IGl0IGFwcGxpZXMgYVxuICAgICAqIGZ1bmN0aW9uIHRvIGVhY2ggZWxlbWVudCBvZiBhIGxpc3QsIHBhc3NpbmcgYW4gYWNjdW11bGF0aW5nIHBhcmFtZXRlciBmcm9tIHJpZ2h0XG4gICAgICogdG8gbGVmdCwgYW5kIHJldHVybmluZyBhIGZpbmFsIHZhbHVlIG9mIHRoaXMgYWNjdW11bGF0b3IgdG9nZXRoZXIgd2l0aCB0aGUgbmV3IGxpc3QuXG4gICAgICpcbiAgICAgKiBTaW1pbGFyIHRvIGBtYXBBY2N1bWAsIGV4Y2VwdCBtb3ZlcyB0aHJvdWdoIHRoZSBpbnB1dCBsaXN0IGZyb20gdGhlIHJpZ2h0IHRvIHRoZVxuICAgICAqIGxlZnQuXG4gICAgICpcbiAgICAgKiBUaGUgaXRlcmF0b3IgZnVuY3Rpb24gcmVjZWl2ZXMgdHdvIGFyZ3VtZW50cywgKmFjYyogYW5kICp2YWx1ZSosIGFuZCBzaG91bGQgcmV0dXJuXG4gICAgICogYSB0dXBsZSAqW2FjYywgdmFsdWVdKi5cbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgTGlzdFxuICAgICAqIEBzaWcgKGFjYyAtPiB4IC0+IChhY2MsIHkpKSAtPiBhY2MgLT4gW3hdIC0+IChhY2MsIFt5XSlcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgZnVuY3Rpb24gdG8gYmUgY2FsbGVkIG9uIGV2ZXJ5IGVsZW1lbnQgb2YgdGhlIGlucHV0IGBsaXN0YC5cbiAgICAgKiBAcGFyYW0geyp9IGFjYyBUaGUgYWNjdW11bGF0b3IgdmFsdWUuXG4gICAgICogQHBhcmFtIHtBcnJheX0gbGlzdCBUaGUgbGlzdCB0byBpdGVyYXRlIG92ZXIuXG4gICAgICogQHJldHVybiB7Kn0gVGhlIGZpbmFsLCBhY2N1bXVsYXRlZCB2YWx1ZS5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICB2YXIgZGlnaXRzID0gWycxJywgJzInLCAnMycsICc0J107XG4gICAgICogICAgICB2YXIgYXBwZW5kID0gZnVuY3Rpb24oYSwgYikge1xuICAgICAqICAgICAgICByZXR1cm4gW2EgKyBiLCBhICsgYl07XG4gICAgICogICAgICB9XG4gICAgICpcbiAgICAgKiAgICAgIFIubWFwQWNjdW1SaWdodChhcHBlbmQsIDAsIGRpZ2l0cyk7IC8vPT4gWycwNDMyMScsIFsnMDQzMjEnLCAnMDQzMicsICcwNDMnLCAnMDQnXV1cbiAgICAgKi9cbiAgICB2YXIgbWFwQWNjdW1SaWdodCA9IF9jdXJyeTMoZnVuY3Rpb24gbWFwQWNjdW1SaWdodChmbiwgYWNjLCBsaXN0KSB7XG4gICAgICAgIHZhciBpZHggPSBsaXN0Lmxlbmd0aCAtIDEsIHJlc3VsdCA9IFtdLCB0dXBsZSA9IFthY2NdO1xuICAgICAgICB3aGlsZSAoaWR4ID49IDApIHtcbiAgICAgICAgICAgIHR1cGxlID0gZm4odHVwbGVbMF0sIGxpc3RbaWR4XSk7XG4gICAgICAgICAgICByZXN1bHRbaWR4XSA9IHR1cGxlWzFdO1xuICAgICAgICAgICAgaWR4IC09IDE7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgIHR1cGxlWzBdLFxuICAgICAgICAgICAgcmVzdWx0XG4gICAgICAgIF07XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBMaWtlIGBtYXBgLCBidXQgYnV0IHBhc3NlcyBhZGRpdGlvbmFsIHBhcmFtZXRlcnMgdG8gdGhlIG1hcHBpbmcgZnVuY3Rpb24uXG4gICAgICogYGZuYCByZWNlaXZlcyB0aHJlZSBhcmd1bWVudHM6ICoodmFsdWUsIGluZGV4LCBsaXN0KSouXG4gICAgICpcbiAgICAgKiBOb3RlOiBgUi5tYXBJbmRleGVkYCBkb2VzIG5vdCBza2lwIGRlbGV0ZWQgb3IgdW5hc3NpZ25lZCBpbmRpY2VzIChzcGFyc2UgYXJyYXlzKSwgdW5saWtlXG4gICAgICogdGhlIG5hdGl2ZSBgQXJyYXkucHJvdG90eXBlLm1hcGAgbWV0aG9kLiBGb3IgbW9yZSBkZXRhaWxzIG9uIHRoaXMgYmVoYXZpb3IsIHNlZTpcbiAgICAgKiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9BcnJheS9tYXAjRGVzY3JpcHRpb25cbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgTGlzdFxuICAgICAqIEBzaWcgKGEsaSxbYl0gLT4gYikgLT4gW2FdIC0+IFtiXVxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBmdW5jdGlvbiB0byBiZSBjYWxsZWQgb24gZXZlcnkgZWxlbWVudCBvZiB0aGUgaW5wdXQgYGxpc3RgLlxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGxpc3QgVGhlIGxpc3QgdG8gYmUgaXRlcmF0ZWQgb3Zlci5cbiAgICAgKiBAcmV0dXJuIHtBcnJheX0gVGhlIG5ldyBsaXN0LlxuICAgICAqIEBkZXByZWNhdGVkIHNpbmNlIHYwLjE1LjBcbiAgICAgKiBAc2VlIFIuYWRkSW5kZXhcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICB2YXIgc3F1YXJlRW5kcyA9IGZ1bmN0aW9uKGVsdCwgaWR4LCBsaXN0KSB7XG4gICAgICogICAgICAgIGlmIChpZHggPT09IDAgfHwgaWR4ID09PSBsaXN0Lmxlbmd0aCAtIDEpIHtcbiAgICAgKiAgICAgICAgICByZXR1cm4gZWx0ICogZWx0O1xuICAgICAqICAgICAgICB9XG4gICAgICogICAgICAgIHJldHVybiBlbHQ7XG4gICAgICogICAgICB9O1xuICAgICAqXG4gICAgICogICAgICBSLm1hcEluZGV4ZWQoc3F1YXJlRW5kcywgWzgsIDUsIDMsIDAsIDldKTsgLy89PiBbNjQsIDUsIDMsIDAsIDgxXVxuICAgICAqL1xuICAgIHZhciBtYXBJbmRleGVkID0gX2N1cnJ5MihmdW5jdGlvbiBtYXBJbmRleGVkKGZuLCBsaXN0KSB7XG4gICAgICAgIHZhciBpZHggPSAwLCByZXN1bHQgPSBbXTtcbiAgICAgICAgd2hpbGUgKGlkeCA8IGxpc3QubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXN1bHRbaWR4XSA9IGZuKGxpc3RbaWR4XSwgaWR4LCBsaXN0KTtcbiAgICAgICAgICAgIGlkeCArPSAxO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBtYXRoTW9kIGJlaGF2ZXMgbGlrZSB0aGUgbW9kdWxvIG9wZXJhdG9yIHNob3VsZCBtYXRoZW1hdGljYWxseSwgdW5saWtlIHRoZSBgJWBcbiAgICAgKiBvcGVyYXRvciAoYW5kIGJ5IGV4dGVuc2lvbiwgUi5tb2R1bG8pLiBTbyB3aGlsZSBcIi0xNyAlIDVcIiBpcyAtMixcbiAgICAgKiBtYXRoTW9kKC0xNywgNSkgaXMgMy4gbWF0aE1vZCByZXF1aXJlcyBJbnRlZ2VyIGFyZ3VtZW50cywgYW5kIHJldHVybnMgTmFOXG4gICAgICogd2hlbiB0aGUgbW9kdWx1cyBpcyB6ZXJvIG9yIG5lZ2F0aXZlLlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBNYXRoXG4gICAgICogQHNpZyBOdW1iZXIgLT4gTnVtYmVyIC0+IE51bWJlclxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBtIFRoZSBkaXZpZGVuZC5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gcCB0aGUgbW9kdWx1cy5cbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9IFRoZSByZXN1bHQgb2YgYGIgbW9kIGFgLlxuICAgICAqIEBzZWUgUi5tb2R1bG9CeVxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIFIubWF0aE1vZCgtMTcsIDUpOyAgLy89PiAzXG4gICAgICogICAgICBSLm1hdGhNb2QoMTcsIDUpOyAgIC8vPT4gMlxuICAgICAqICAgICAgUi5tYXRoTW9kKDE3LCAtNSk7ICAvLz0+IE5hTlxuICAgICAqICAgICAgUi5tYXRoTW9kKDE3LCAwKTsgICAvLz0+IE5hTlxuICAgICAqICAgICAgUi5tYXRoTW9kKDE3LjIsIDUpOyAvLz0+IE5hTlxuICAgICAqICAgICAgUi5tYXRoTW9kKDE3LCA1LjMpOyAvLz0+IE5hTlxuICAgICAqXG4gICAgICogICAgICB2YXIgY2xvY2sgPSBSLm1hdGhNb2QoUi5fXywgMTIpO1xuICAgICAqICAgICAgY2xvY2soMTUpOyAvLz0+IDNcbiAgICAgKiAgICAgIGNsb2NrKDI0KTsgLy89PiAwXG4gICAgICpcbiAgICAgKiAgICAgIHZhciBzZXZlbnRlZW5Nb2QgPSBSLm1hdGhNb2QoMTcpO1xuICAgICAqICAgICAgc2V2ZW50ZWVuTW9kKDMpOyAgLy89PiAyXG4gICAgICogICAgICBzZXZlbnRlZW5Nb2QoNCk7ICAvLz0+IDFcbiAgICAgKiAgICAgIHNldmVudGVlbk1vZCgxMCk7IC8vPT4gN1xuICAgICAqL1xuICAgIHZhciBtYXRoTW9kID0gX2N1cnJ5MihmdW5jdGlvbiBtYXRoTW9kKG0sIHApIHtcbiAgICAgICAgaWYgKCFfaXNJbnRlZ2VyKG0pKSB7XG4gICAgICAgICAgICByZXR1cm4gTmFOO1xuICAgICAgICB9XG4gICAgICAgIGlmICghX2lzSW50ZWdlcihwKSB8fCBwIDwgMSkge1xuICAgICAgICAgICAgcmV0dXJuIE5hTjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gKG0gJSBwICsgcCkgJSBwO1xuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogRGV0ZXJtaW5lcyB0aGUgbGFyZ2VzdCBvZiBhIGxpc3Qgb2YgaXRlbXMgYXMgZGV0ZXJtaW5lZCBieSBwYWlyd2lzZSBjb21wYXJpc29ucyBmcm9tIHRoZSBzdXBwbGllZCBjb21wYXJhdG9yLlxuICAgICAqIE5vdGUgdGhhdCB0aGlzIHdpbGwgcmV0dXJuIHVuZGVmaW5lZCBpZiBzdXBwbGllZCBhbiBlbXB0eSBsaXN0LlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBNYXRoXG4gICAgICogQHNpZyAoYSAtPiBOdW1iZXIpIC0+IFthXSAtPiBhXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0ga2V5Rm4gQSBjb21wYXJhdG9yIGZ1bmN0aW9uIGZvciBlbGVtZW50cyBpbiB0aGUgbGlzdFxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGxpc3QgQSBsaXN0IG9mIGNvbXBhcmFibGUgZWxlbWVudHNcbiAgICAgKiBAcmV0dXJuIHsqfSBUaGUgZ3JlYXRlc3QgZWxlbWVudCBpbiB0aGUgbGlzdC4gYHVuZGVmaW5lZGAgaWYgdGhlIGxpc3QgaXMgZW1wdHkuXG4gICAgICogQHNlZSBSLm1heFxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIGZ1bmN0aW9uIGNtcChvYmopIHsgcmV0dXJuIG9iai54OyB9XG4gICAgICogICAgICB2YXIgYSA9IHt4OiAxfSwgYiA9IHt4OiAyfSwgYyA9IHt4OiAzfTtcbiAgICAgKiAgICAgIFIubWF4QnkoY21wLCBbYSwgYiwgY10pOyAvLz0+IHt4OiAzfVxuICAgICAqL1xuICAgIHZhciBtYXhCeSA9IF9jdXJyeTIoX2NyZWF0ZU1heE1pbkJ5KF9ndCkpO1xuXG4gICAgLyoqXG4gICAgICogRGV0ZXJtaW5lcyB0aGUgc21hbGxlc3Qgb2YgYSBsaXN0IG9mIGl0ZW1zIGFzIGRldGVybWluZWQgYnkgcGFpcndpc2UgY29tcGFyaXNvbnMgZnJvbSB0aGUgc3VwcGxpZWQgY29tcGFyYXRvclxuICAgICAqIE5vdGUgdGhhdCB0aGlzIHdpbGwgcmV0dXJuIHVuZGVmaW5lZCBpZiBzdXBwbGllZCBhbiBlbXB0eSBsaXN0LlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBNYXRoXG4gICAgICogQHNpZyAoYSAtPiBOdW1iZXIpIC0+IFthXSAtPiBhXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0ga2V5Rm4gQSBjb21wYXJhdG9yIGZ1bmN0aW9uIGZvciBlbGVtZW50cyBpbiB0aGUgbGlzdFxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGxpc3QgQSBsaXN0IG9mIGNvbXBhcmFibGUgZWxlbWVudHNcbiAgICAgKiBAc2VlIFIubWluXG4gICAgICogQHJldHVybiB7Kn0gVGhlIGdyZWF0ZXN0IGVsZW1lbnQgaW4gdGhlIGxpc3QuIGB1bmRlZmluZWRgIGlmIHRoZSBsaXN0IGlzIGVtcHR5LlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIGZ1bmN0aW9uIGNtcChvYmopIHsgcmV0dXJuIG9iai54OyB9XG4gICAgICogICAgICB2YXIgYSA9IHt4OiAxfSwgYiA9IHt4OiAyfSwgYyA9IHt4OiAzfTtcbiAgICAgKiAgICAgIFIubWluQnkoY21wLCBbYSwgYiwgY10pOyAvLz0+IHt4OiAxfVxuICAgICAqL1xuICAgIHZhciBtaW5CeSA9IF9jdXJyeTIoX2NyZWF0ZU1heE1pbkJ5KF9sdCkpO1xuXG4gICAgLyoqXG4gICAgICogRGl2aWRlcyB0aGUgc2Vjb25kIHBhcmFtZXRlciBieSB0aGUgZmlyc3QgYW5kIHJldHVybnMgdGhlIHJlbWFpbmRlci5cbiAgICAgKiBOb3RlIHRoYXQgdGhpcyBmdW5jdGlvbnMgcHJlc2VydmVzIHRoZSBKYXZhU2NyaXB0LXN0eWxlIGJlaGF2aW9yIGZvclxuICAgICAqIG1vZHVsby4gRm9yIG1hdGhlbWF0aWNhbCBtb2R1bG8gc2VlIGBtYXRoTW9kYFxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBNYXRoXG4gICAgICogQHNpZyBOdW1iZXIgLT4gTnVtYmVyIC0+IE51bWJlclxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBhIFRoZSB2YWx1ZSB0byB0aGUgZGl2aWRlLlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBiIFRoZSBwc2V1ZG8tbW9kdWx1c1xuICAgICAqIEByZXR1cm4ge051bWJlcn0gVGhlIHJlc3VsdCBvZiBgYiAlIGFgLlxuICAgICAqIEBzZWUgUi5tYXRoTW9kXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgUi5tb2R1bG8oMTcsIDMpOyAvLz0+IDJcbiAgICAgKiAgICAgIC8vIEpTIGJlaGF2aW9yOlxuICAgICAqICAgICAgUi5tb2R1bG8oLTE3LCAzKTsgLy89PiAtMlxuICAgICAqICAgICAgUi5tb2R1bG8oMTcsIC0zKTsgLy89PiAyXG4gICAgICpcbiAgICAgKiAgICAgIHZhciBpc09kZCA9IFIubW9kdWxvKFIuX18sIDIpO1xuICAgICAqICAgICAgaXNPZGQoNDIpOyAvLz0+IDBcbiAgICAgKiAgICAgIGlzT2RkKDIxKTsgLy89PiAxXG4gICAgICovXG4gICAgdmFyIG1vZHVsbyA9IF9jdXJyeTIoZnVuY3Rpb24gbW9kdWxvKGEsIGIpIHtcbiAgICAgICAgcmV0dXJuIGEgJSBiO1xuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogTXVsdGlwbGllcyB0d28gbnVtYmVycy4gRXF1aXZhbGVudCB0byBgYSAqIGJgIGJ1dCBjdXJyaWVkLlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBNYXRoXG4gICAgICogQHNpZyBOdW1iZXIgLT4gTnVtYmVyIC0+IE51bWJlclxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBhIFRoZSBmaXJzdCB2YWx1ZS5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gYiBUaGUgc2Vjb25kIHZhbHVlLlxuICAgICAqIEByZXR1cm4ge051bWJlcn0gVGhlIHJlc3VsdCBvZiBgYSAqIGJgLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIHZhciBkb3VibGUgPSBSLm11bHRpcGx5KDIpO1xuICAgICAqICAgICAgdmFyIHRyaXBsZSA9IFIubXVsdGlwbHkoMyk7XG4gICAgICogICAgICBkb3VibGUoMyk7ICAgICAgIC8vPT4gIDZcbiAgICAgKiAgICAgIHRyaXBsZSg0KTsgICAgICAgLy89PiAxMlxuICAgICAqICAgICAgUi5tdWx0aXBseSgyLCA1KTsgIC8vPT4gMTBcbiAgICAgKi9cbiAgICB2YXIgbXVsdGlwbHkgPSBfY3VycnkyKF9tdWx0aXBseSk7XG5cbiAgICAvKipcbiAgICAgKiBXcmFwcyBhIGZ1bmN0aW9uIG9mIGFueSBhcml0eSAoaW5jbHVkaW5nIG51bGxhcnkpIGluIGEgZnVuY3Rpb24gdGhhdCBhY2NlcHRzIGV4YWN0bHkgYG5gXG4gICAgICogcGFyYW1ldGVycy4gQW55IGV4dHJhbmVvdXMgcGFyYW1ldGVycyB3aWxsIG5vdCBiZSBwYXNzZWQgdG8gdGhlIHN1cHBsaWVkIGZ1bmN0aW9uLlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBGdW5jdGlvblxuICAgICAqIEBzaWcgTnVtYmVyIC0+ICgqIC0+IGEpIC0+ICgqIC0+IGEpXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IG4gVGhlIGRlc2lyZWQgYXJpdHkgb2YgdGhlIG5ldyBmdW5jdGlvbi5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgZnVuY3Rpb24gdG8gd3JhcC5cbiAgICAgKiBAcmV0dXJuIHtGdW5jdGlvbn0gQSBuZXcgZnVuY3Rpb24gd3JhcHBpbmcgYGZuYC4gVGhlIG5ldyBmdW5jdGlvbiBpcyBndWFyYW50ZWVkIHRvIGJlIG9mXG4gICAgICogICAgICAgICBhcml0eSBgbmAuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgdmFyIHRha2VzVHdvQXJncyA9IGZ1bmN0aW9uKGEsIGIpIHtcbiAgICAgKiAgICAgICAgcmV0dXJuIFthLCBiXTtcbiAgICAgKiAgICAgIH07XG4gICAgICogICAgICB0YWtlc1R3b0FyZ3MubGVuZ3RoOyAvLz0+IDJcbiAgICAgKiAgICAgIHRha2VzVHdvQXJncygxLCAyKTsgLy89PiBbMSwgMl1cbiAgICAgKlxuICAgICAqICAgICAgdmFyIHRha2VzT25lQXJnID0gUi5uQXJ5KDEsIHRha2VzVHdvQXJncyk7XG4gICAgICogICAgICB0YWtlc09uZUFyZy5sZW5ndGg7IC8vPT4gMVxuICAgICAqICAgICAgLy8gT25seSBgbmAgYXJndW1lbnRzIGFyZSBwYXNzZWQgdG8gdGhlIHdyYXBwZWQgZnVuY3Rpb25cbiAgICAgKiAgICAgIHRha2VzT25lQXJnKDEsIDIpOyAvLz0+IFsxLCB1bmRlZmluZWRdXG4gICAgICovXG4gICAgdmFyIG5BcnkgPSBfY3VycnkyKGZ1bmN0aW9uIChuLCBmbikge1xuICAgICAgICBzd2l0Y2ggKG4pIHtcbiAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZm4uY2FsbCh0aGlzKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoYTApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZm4uY2FsbCh0aGlzLCBhMCk7XG4gICAgICAgICAgICB9O1xuICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGEwLCBhMSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmbi5jYWxsKHRoaXMsIGEwLCBhMSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGEwLCBhMSwgYTIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZm4uY2FsbCh0aGlzLCBhMCwgYTEsIGEyKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIGNhc2UgNDpcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoYTAsIGExLCBhMiwgYTMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZm4uY2FsbCh0aGlzLCBhMCwgYTEsIGEyLCBhMyk7XG4gICAgICAgICAgICB9O1xuICAgICAgICBjYXNlIDU6XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGEwLCBhMSwgYTIsIGEzLCBhNCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmbi5jYWxsKHRoaXMsIGEwLCBhMSwgYTIsIGEzLCBhNCk7XG4gICAgICAgICAgICB9O1xuICAgICAgICBjYXNlIDY6XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGEwLCBhMSwgYTIsIGEzLCBhNCwgYTUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZm4uY2FsbCh0aGlzLCBhMCwgYTEsIGEyLCBhMywgYTQsIGE1KTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIGNhc2UgNzpcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoYTAsIGExLCBhMiwgYTMsIGE0LCBhNSwgYTYpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZm4uY2FsbCh0aGlzLCBhMCwgYTEsIGEyLCBhMywgYTQsIGE1LCBhNik7XG4gICAgICAgICAgICB9O1xuICAgICAgICBjYXNlIDg6XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGEwLCBhMSwgYTIsIGEzLCBhNCwgYTUsIGE2LCBhNykge1xuICAgICAgICAgICAgICAgIHJldHVybiBmbi5jYWxsKHRoaXMsIGEwLCBhMSwgYTIsIGEzLCBhNCwgYTUsIGE2LCBhNyk7XG4gICAgICAgICAgICB9O1xuICAgICAgICBjYXNlIDk6XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGEwLCBhMSwgYTIsIGEzLCBhNCwgYTUsIGE2LCBhNywgYTgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZm4uY2FsbCh0aGlzLCBhMCwgYTEsIGEyLCBhMywgYTQsIGE1LCBhNiwgYTcsIGE4KTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIGNhc2UgMTA6XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGEwLCBhMSwgYTIsIGEzLCBhNCwgYTUsIGE2LCBhNywgYTgsIGE5KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZuLmNhbGwodGhpcywgYTAsIGExLCBhMiwgYTMsIGE0LCBhNSwgYTYsIGE3LCBhOCwgYTkpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignRmlyc3QgYXJndW1lbnQgdG8gbkFyeSBtdXN0IGJlIGEgbm9uLW5lZ2F0aXZlIGludGVnZXIgbm8gZ3JlYXRlciB0aGFuIHRlbicpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBOZWdhdGVzIGl0cyBhcmd1bWVudC5cbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgTWF0aFxuICAgICAqIEBzaWcgTnVtYmVyIC0+IE51bWJlclxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBuXG4gICAgICogQHJldHVybiB7TnVtYmVyfVxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIFIubmVnYXRlKDQyKTsgLy89PiAtNDJcbiAgICAgKi9cbiAgICB2YXIgbmVnYXRlID0gX2N1cnJ5MShmdW5jdGlvbiBuZWdhdGUobikge1xuICAgICAgICByZXR1cm4gLW47XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBBIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyB0aGUgYCFgIG9mIGl0cyBhcmd1bWVudC4gSXQgd2lsbCByZXR1cm4gYHRydWVgIHdoZW5cbiAgICAgKiBwYXNzZWQgZmFsc2UteSB2YWx1ZSwgYW5kIGBmYWxzZWAgd2hlbiBwYXNzZWQgYSB0cnV0aC15IG9uZS5cbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgTG9naWNcbiAgICAgKiBAc2lnICogLT4gQm9vbGVhblxuICAgICAqIEBwYXJhbSB7Kn0gYSBhbnkgdmFsdWVcbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufSB0aGUgbG9naWNhbCBpbnZlcnNlIG9mIHBhc3NlZCBhcmd1bWVudC5cbiAgICAgKiBAc2VlIFIuY29tcGxlbWVudFxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIFIubm90KHRydWUpOyAvLz0+IGZhbHNlXG4gICAgICogICAgICBSLm5vdChmYWxzZSk7IC8vPT4gdHJ1ZVxuICAgICAqICAgICAgUi5ub3QoMCk7ID0+IHRydWVcbiAgICAgKiAgICAgIFIubm90KDEpOyA9PiBmYWxzZVxuICAgICAqL1xuICAgIHZhciBub3QgPSBfY3VycnkxKGZ1bmN0aW9uIG5vdChhKSB7XG4gICAgICAgIHJldHVybiAhYTtcbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIG50aCBlbGVtZW50IGluIGEgbGlzdC5cbiAgICAgKiBJZiBuIGlzIG5lZ2F0aXZlIHRoZSBlbGVtZW50IGF0IGluZGV4IGxlbmd0aCArIG4gaXMgcmV0dXJuZWQuXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IExpc3RcbiAgICAgKiBAc2lnIE51bWJlciAtPiBbYV0gLT4gYVxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBpZHhcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBsaXN0XG4gICAgICogQHJldHVybiB7Kn0gVGhlIG50aCBlbGVtZW50IG9mIHRoZSBsaXN0LlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIHZhciBsaXN0ID0gWydmb28nLCAnYmFyJywgJ2JheicsICdxdXV4J107XG4gICAgICogICAgICBSLm50aCgxLCBsaXN0KTsgLy89PiAnYmFyJ1xuICAgICAqICAgICAgUi5udGgoLTEsIGxpc3QpOyAvLz0+ICdxdXV4J1xuICAgICAqICAgICAgUi5udGgoLTk5LCBsaXN0KTsgLy89PiB1bmRlZmluZWRcbiAgICAgKi9cbiAgICB2YXIgbnRoID0gX2N1cnJ5MihfbnRoKTtcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYSBmdW5jdGlvbiB3aGljaCByZXR1cm5zIGl0cyBudGggYXJndW1lbnQuXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IEZ1bmN0aW9uXG4gICAgICogQHNpZyBOdW1iZXIgLT4gKi4uLiAtPiAqXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IG5cbiAgICAgKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICBSLm50aEFyZygxKSgnYScsICdiJywgJ2MnKTsgLy89PiAnYidcbiAgICAgKiAgICAgIFIubnRoQXJnKC0xKSgnYScsICdiJywgJ2MnKTsgLy89PiAnYydcbiAgICAgKi9cbiAgICB2YXIgbnRoQXJnID0gX2N1cnJ5MShmdW5jdGlvbiBudGhBcmcobikge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIF9udGgobiwgYXJndW1lbnRzKTtcbiAgICAgICAgfTtcbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIG50aCBjaGFyYWN0ZXIgb2YgdGhlIGdpdmVuIHN0cmluZy5cbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgU3RyaW5nXG4gICAgICogQHNpZyBOdW1iZXIgLT4gU3RyaW5nIC0+IFN0cmluZ1xuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBuXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICAgICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICBSLm50aENoYXIoMiwgJ1JhbWRhJyk7IC8vPT4gJ20nXG4gICAgICogICAgICBSLm50aENoYXIoLTIsICdSYW1kYScpOyAvLz0+ICdkJ1xuICAgICAqL1xuICAgIHZhciBudGhDaGFyID0gX2N1cnJ5MihmdW5jdGlvbiBudGhDaGFyKG4sIHN0cikge1xuICAgICAgICByZXR1cm4gc3RyLmNoYXJBdChuIDwgMCA/IHN0ci5sZW5ndGggKyBuIDogbik7XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBjaGFyYWN0ZXIgY29kZSBvZiB0aGUgbnRoIGNoYXJhY3RlciBvZiB0aGUgZ2l2ZW4gc3RyaW5nLlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBTdHJpbmdcbiAgICAgKiBAc2lnIE51bWJlciAtPiBTdHJpbmcgLT4gTnVtYmVyXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IG5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gICAgICogQHJldHVybiB7TnVtYmVyfVxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIFIubnRoQ2hhckNvZGUoMiwgJ1JhbWRhJyk7IC8vPT4gJ20nLmNoYXJDb2RlQXQoMClcbiAgICAgKiAgICAgIFIubnRoQ2hhckNvZGUoLTIsICdSYW1kYScpOyAvLz0+ICdkJy5jaGFyQ29kZUF0KDApXG4gICAgICovXG4gICAgdmFyIG50aENoYXJDb2RlID0gX2N1cnJ5MihmdW5jdGlvbiBudGhDaGFyQ29kZShuLCBzdHIpIHtcbiAgICAgICAgcmV0dXJuIHN0ci5jaGFyQ29kZUF0KG4gPCAwID8gc3RyLmxlbmd0aCArIG4gOiBuKTtcbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYSBzaW5nbGV0b24gYXJyYXkgY29udGFpbmluZyB0aGUgdmFsdWUgcHJvdmlkZWQuXG4gICAgICpcbiAgICAgKiBOb3RlIHRoaXMgYG9mYCBpcyBkaWZmZXJlbnQgZnJvbSB0aGUgRVM2IGBvZmA7IFNlZVxuICAgICAqIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL0FycmF5L29mXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IEZ1bmN0aW9uXG4gICAgICogQHNpZyBhIC0+IFthXVxuICAgICAqIEBwYXJhbSB7Kn0geCBhbnkgdmFsdWVcbiAgICAgKiBAcmV0dXJuIHtBcnJheX0gQW4gYXJyYXkgd3JhcHBpbmcgYHhgLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIFIub2YobnVsbCk7IC8vPT4gW251bGxdXG4gICAgICogICAgICBSLm9mKFs0Ml0pOyAvLz0+IFtbNDJdXVxuICAgICAqL1xuICAgIHZhciBvZiA9IF9jdXJyeTEoZnVuY3Rpb24gb2YoeCkge1xuICAgICAgICByZXR1cm4gW3hdO1xuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogQWNjZXB0cyBhIGZ1bmN0aW9uIGBmbmAgYW5kIHJldHVybnMgYSBmdW5jdGlvbiB0aGF0IGd1YXJkcyBpbnZvY2F0aW9uIG9mIGBmbmAgc3VjaCB0aGF0XG4gICAgICogYGZuYCBjYW4gb25seSBldmVyIGJlIGNhbGxlZCBvbmNlLCBubyBtYXR0ZXIgaG93IG1hbnkgdGltZXMgdGhlIHJldHVybmVkIGZ1bmN0aW9uIGlzXG4gICAgICogaW52b2tlZC5cbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgRnVuY3Rpb25cbiAgICAgKiBAc2lnIChhLi4uIC0+IGIpIC0+IChhLi4uIC0+IGIpXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGZ1bmN0aW9uIHRvIHdyYXAgaW4gYSBjYWxsLW9ubHktb25jZSB3cmFwcGVyLlxuICAgICAqIEByZXR1cm4ge0Z1bmN0aW9ufSBUaGUgd3JhcHBlZCBmdW5jdGlvbi5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICB2YXIgYWRkT25lT25jZSA9IFIub25jZShmdW5jdGlvbih4KXsgcmV0dXJuIHggKyAxOyB9KTtcbiAgICAgKiAgICAgIGFkZE9uZU9uY2UoMTApOyAvLz0+IDExXG4gICAgICogICAgICBhZGRPbmVPbmNlKGFkZE9uZU9uY2UoNTApKTsgLy89PiAxMVxuICAgICAqL1xuICAgIHZhciBvbmNlID0gX2N1cnJ5MShmdW5jdGlvbiBvbmNlKGZuKSB7XG4gICAgICAgIHZhciBjYWxsZWQgPSBmYWxzZSwgcmVzdWx0O1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKGNhbGxlZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYWxsZWQgPSB0cnVlO1xuICAgICAgICAgICAgcmVzdWx0ID0gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH07XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBSZXRyaWV2ZSB0aGUgdmFsdWUgYXQgYSBnaXZlbiBwYXRoLlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBPYmplY3RcbiAgICAgKiBAc2lnIFtTdHJpbmddIC0+IHsqfSAtPiAqXG4gICAgICogQHBhcmFtIHtBcnJheX0gcGF0aCBUaGUgcGF0aCB0byB1c2UuXG4gICAgICogQHJldHVybiB7Kn0gVGhlIGRhdGEgYXQgYHBhdGhgLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIFIucGF0aChbJ2EnLCAnYiddLCB7YToge2I6IDJ9fSk7IC8vPT4gMlxuICAgICAqL1xuICAgIHZhciBwYXRoID0gX2N1cnJ5MihfcGF0aCk7XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGEgcGFydGlhbCBjb3B5IG9mIGFuIG9iamVjdCBjb250YWluaW5nIG9ubHkgdGhlIGtleXMgc3BlY2lmaWVkLiAgSWYgdGhlIGtleSBkb2VzIG5vdCBleGlzdCwgdGhlXG4gICAgICogcHJvcGVydHkgaXMgaWdub3JlZC5cbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgT2JqZWN0XG4gICAgICogQHNpZyBba10gLT4ge2s6IHZ9IC0+IHtrOiB2fVxuICAgICAqIEBwYXJhbSB7QXJyYXl9IG5hbWVzIGFuIGFycmF5IG9mIFN0cmluZyBwcm9wZXJ0eSBuYW1lcyB0byBjb3B5IG9udG8gYSBuZXcgb2JqZWN0XG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9iaiBUaGUgb2JqZWN0IHRvIGNvcHkgZnJvbVxuICAgICAqIEByZXR1cm4ge09iamVjdH0gQSBuZXcgb2JqZWN0IHdpdGggb25seSBwcm9wZXJ0aWVzIGZyb20gYG5hbWVzYCBvbiBpdC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICBSLnBpY2soWydhJywgJ2QnXSwge2E6IDEsIGI6IDIsIGM6IDMsIGQ6IDR9KTsgLy89PiB7YTogMSwgZDogNH1cbiAgICAgKiAgICAgIFIucGljayhbJ2EnLCAnZScsICdmJ10sIHthOiAxLCBiOiAyLCBjOiAzLCBkOiA0fSk7IC8vPT4ge2E6IDF9XG4gICAgICovXG4gICAgdmFyIHBpY2sgPSBfY3VycnkyKGZ1bmN0aW9uIHBpY2sobmFtZXMsIG9iaikge1xuICAgICAgICB2YXIgcmVzdWx0ID0ge307XG4gICAgICAgIHZhciBpZHggPSAwO1xuICAgICAgICB3aGlsZSAoaWR4IDwgbmFtZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICBpZiAobmFtZXNbaWR4XSBpbiBvYmopIHtcbiAgICAgICAgICAgICAgICByZXN1bHRbbmFtZXNbaWR4XV0gPSBvYmpbbmFtZXNbaWR4XV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZHggKz0gMTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogU2ltaWxhciB0byBgcGlja2AgZXhjZXB0IHRoYXQgdGhpcyBvbmUgaW5jbHVkZXMgYSBga2V5OiB1bmRlZmluZWRgIHBhaXIgZm9yIHByb3BlcnRpZXMgdGhhdCBkb24ndCBleGlzdC5cbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgT2JqZWN0XG4gICAgICogQHNpZyBba10gLT4ge2s6IHZ9IC0+IHtrOiB2fVxuICAgICAqIEBwYXJhbSB7QXJyYXl9IG5hbWVzIGFuIGFycmF5IG9mIFN0cmluZyBwcm9wZXJ0eSBuYW1lcyB0byBjb3B5IG9udG8gYSBuZXcgb2JqZWN0XG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9iaiBUaGUgb2JqZWN0IHRvIGNvcHkgZnJvbVxuICAgICAqIEByZXR1cm4ge09iamVjdH0gQSBuZXcgb2JqZWN0IHdpdGggb25seSBwcm9wZXJ0aWVzIGZyb20gYG5hbWVzYCBvbiBpdC5cbiAgICAgKiBAc2VlIFIucGlja1xuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIFIucGlja0FsbChbJ2EnLCAnZCddLCB7YTogMSwgYjogMiwgYzogMywgZDogNH0pOyAvLz0+IHthOiAxLCBkOiA0fVxuICAgICAqICAgICAgUi5waWNrQWxsKFsnYScsICdlJywgJ2YnXSwge2E6IDEsIGI6IDIsIGM6IDMsIGQ6IDR9KTsgLy89PiB7YTogMSwgZTogdW5kZWZpbmVkLCBmOiB1bmRlZmluZWR9XG4gICAgICovXG4gICAgdmFyIHBpY2tBbGwgPSBfY3VycnkyKGZ1bmN0aW9uIHBpY2tBbGwobmFtZXMsIG9iaikge1xuICAgICAgICB2YXIgcmVzdWx0ID0ge307XG4gICAgICAgIHZhciBpZHggPSAwO1xuICAgICAgICB3aGlsZSAoaWR4IDwgbmFtZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICB2YXIgbmFtZSA9IG5hbWVzW2lkeF07XG4gICAgICAgICAgICByZXN1bHRbbmFtZV0gPSBvYmpbbmFtZV07XG4gICAgICAgICAgICBpZHggKz0gMTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhIHBhcnRpYWwgY29weSBvZiBhbiBvYmplY3QgY29udGFpbmluZyBvbmx5IHRoZSBrZXlzIHRoYXRcbiAgICAgKiBzYXRpc2Z5IHRoZSBzdXBwbGllZCBwcmVkaWNhdGUuXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IE9iamVjdFxuICAgICAqIEBzaWcgKHYsIGsgLT4gQm9vbGVhbikgLT4ge2s6IHZ9IC0+IHtrOiB2fVxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IHByZWQgQSBwcmVkaWNhdGUgdG8gZGV0ZXJtaW5lIHdoZXRoZXIgb3Igbm90IGEga2V5XG4gICAgICogICAgICAgIHNob3VsZCBiZSBpbmNsdWRlZCBvbiB0aGUgb3V0cHV0IG9iamVjdC5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb2JqIFRoZSBvYmplY3QgdG8gY29weSBmcm9tXG4gICAgICogQHJldHVybiB7T2JqZWN0fSBBIG5ldyBvYmplY3Qgd2l0aCBvbmx5IHByb3BlcnRpZXMgdGhhdCBzYXRpc2Z5IGBwcmVkYFxuICAgICAqICAgICAgICAgb24gaXQuXG4gICAgICogQHNlZSBSLnBpY2tcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICB2YXIgaXNVcHBlckNhc2UgPSBmdW5jdGlvbih2YWwsIGtleSkgeyByZXR1cm4ga2V5LnRvVXBwZXJDYXNlKCkgPT09IGtleTsgfVxuICAgICAqICAgICAgUi5waWNrQnkoaXNVcHBlckNhc2UsIHthOiAxLCBiOiAyLCBBOiAzLCBCOiA0fSk7IC8vPT4ge0E6IDMsIEI6IDR9XG4gICAgICovXG4gICAgdmFyIHBpY2tCeSA9IF9jdXJyeTIoZnVuY3Rpb24gcGlja0J5KHRlc3QsIG9iaikge1xuICAgICAgICB2YXIgcmVzdWx0ID0ge307XG4gICAgICAgIGZvciAodmFyIHByb3AgaW4gb2JqKSB7XG4gICAgICAgICAgICBpZiAodGVzdChvYmpbcHJvcF0sIHByb3AsIG9iaikpIHtcbiAgICAgICAgICAgICAgICByZXN1bHRbcHJvcF0gPSBvYmpbcHJvcF07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYSBuZXcgbGlzdCB3aXRoIHRoZSBnaXZlbiBlbGVtZW50IGF0IHRoZSBmcm9udCwgZm9sbG93ZWQgYnkgdGhlIGNvbnRlbnRzIG9mIHRoZVxuICAgICAqIGxpc3QuXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IExpc3RcbiAgICAgKiBAc2lnIGEgLT4gW2FdIC0+IFthXVxuICAgICAqIEBwYXJhbSB7Kn0gZWwgVGhlIGl0ZW0gdG8gYWRkIHRvIHRoZSBoZWFkIG9mIHRoZSBvdXRwdXQgbGlzdC5cbiAgICAgKiBAcGFyYW0ge0FycmF5fSBsaXN0IFRoZSBhcnJheSB0byBhZGQgdG8gdGhlIHRhaWwgb2YgdGhlIG91dHB1dCBsaXN0LlxuICAgICAqIEByZXR1cm4ge0FycmF5fSBBIG5ldyBhcnJheS5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICBSLnByZXBlbmQoJ2ZlZScsIFsnZmknLCAnZm8nLCAnZnVtJ10pOyAvLz0+IFsnZmVlJywgJ2ZpJywgJ2ZvJywgJ2Z1bSddXG4gICAgICovXG4gICAgdmFyIHByZXBlbmQgPSBfY3VycnkyKF9wcmVwZW5kKTtcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYSBmdW5jdGlvbiB0aGF0IHdoZW4gc3VwcGxpZWQgYW4gb2JqZWN0IHJldHVybnMgdGhlIGluZGljYXRlZCBwcm9wZXJ0eSBvZiB0aGF0IG9iamVjdCwgaWYgaXQgZXhpc3RzLlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBPYmplY3RcbiAgICAgKiBAc2lnIHMgLT4ge3M6IGF9IC0+IGFcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gcCBUaGUgcHJvcGVydHkgbmFtZVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvYmogVGhlIG9iamVjdCB0byBxdWVyeVxuICAgICAqIEByZXR1cm4geyp9IFRoZSB2YWx1ZSBhdCBgb2JqLnBgLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIFIucHJvcCgneCcsIHt4OiAxMDB9KTsgLy89PiAxMDBcbiAgICAgKiAgICAgIFIucHJvcCgneCcsIHt9KTsgLy89PiB1bmRlZmluZWRcbiAgICAgKi9cbiAgICB2YXIgcHJvcCA9IF9jdXJyeTIoZnVuY3Rpb24gcHJvcChwLCBvYmopIHtcbiAgICAgICAgcmV0dXJuIG9ialtwXTtcbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIElmIHRoZSBnaXZlbiwgbm9uLW51bGwgb2JqZWN0IGhhcyBhbiBvd24gcHJvcGVydHkgd2l0aCB0aGUgc3BlY2lmaWVkIG5hbWUsXG4gICAgICogcmV0dXJucyB0aGUgdmFsdWUgb2YgdGhhdCBwcm9wZXJ0eS5cbiAgICAgKiBPdGhlcndpc2UgcmV0dXJucyB0aGUgcHJvdmlkZWQgZGVmYXVsdCB2YWx1ZS5cbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgT2JqZWN0XG4gICAgICogQHNpZyBhIC0+IFN0cmluZyAtPiBPYmplY3QgLT4gYVxuICAgICAqIEBwYXJhbSB7Kn0gdmFsIFRoZSBkZWZhdWx0IHZhbHVlLlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBwIFRoZSBuYW1lIG9mIHRoZSBwcm9wZXJ0eSB0byByZXR1cm4uXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9iaiBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICAgICAqIEByZXR1cm4geyp9IFRoZSB2YWx1ZSBvZiBnaXZlbiBwcm9wZXJ0eSBvZiB0aGUgc3VwcGxpZWQgb2JqZWN0IG9yIHRoZSBkZWZhdWx0IHZhbHVlLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIHZhciBhbGljZSA9IHtcbiAgICAgKiAgICAgICAgbmFtZTogJ0FMSUNFJyxcbiAgICAgKiAgICAgICAgYWdlOiAxMDFcbiAgICAgKiAgICAgIH07XG4gICAgICogICAgICB2YXIgZmF2b3JpdGUgPSBSLnByb3AoJ2Zhdm9yaXRlTGlicmFyeScpO1xuICAgICAqICAgICAgdmFyIGZhdm9yaXRlV2l0aERlZmF1bHQgPSBSLnByb3BPcignUmFtZGEnLCAnZmF2b3JpdGVMaWJyYXJ5Jyk7XG4gICAgICpcbiAgICAgKiAgICAgIGZhdm9yaXRlKGFsaWNlKTsgIC8vPT4gdW5kZWZpbmVkXG4gICAgICogICAgICBmYXZvcml0ZVdpdGhEZWZhdWx0KGFsaWNlKTsgIC8vPT4gJ1JhbWRhJ1xuICAgICAqL1xuICAgIHZhciBwcm9wT3IgPSBfY3VycnkzKGZ1bmN0aW9uIHByb3BPcih2YWwsIHAsIG9iaikge1xuICAgICAgICByZXR1cm4gb2JqICE9IG51bGwgJiYgX2hhcyhwLCBvYmopID8gb2JqW3BdIDogdmFsO1xuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogQWN0cyBhcyBtdWx0aXBsZSBgZ2V0YDogYXJyYXkgb2Yga2V5cyBpbiwgYXJyYXkgb2YgdmFsdWVzIG91dC4gUHJlc2VydmVzIG9yZGVyLlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBPYmplY3RcbiAgICAgKiBAc2lnIFtrXSAtPiB7azogdn0gLT4gW3ZdXG4gICAgICogQHBhcmFtIHtBcnJheX0gcHMgVGhlIHByb3BlcnR5IG5hbWVzIHRvIGZldGNoXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9iaiBUaGUgb2JqZWN0IHRvIHF1ZXJ5XG4gICAgICogQHJldHVybiB7QXJyYXl9IFRoZSBjb3JyZXNwb25kaW5nIHZhbHVlcyBvciBwYXJ0aWFsbHkgYXBwbGllZCBmdW5jdGlvbi5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICBSLnByb3BzKFsneCcsICd5J10sIHt4OiAxLCB5OiAyfSk7IC8vPT4gWzEsIDJdXG4gICAgICogICAgICBSLnByb3BzKFsnYycsICdhJywgJ2InXSwge2I6IDIsIGE6IDF9KTsgLy89PiBbdW5kZWZpbmVkLCAxLCAyXVxuICAgICAqXG4gICAgICogICAgICB2YXIgZnVsbE5hbWUgPSBSLmNvbXBvc2UoUi5qb2luKCcgJyksIFIucHJvcHMoWydmaXJzdCcsICdsYXN0J10pKTtcbiAgICAgKiAgICAgIGZ1bGxOYW1lKHtsYXN0OiAnQnVsbGV0LVRvb3RoJywgYWdlOiAzMywgZmlyc3Q6ICdUb255J30pOyAvLz0+ICdUb255IEJ1bGxldC1Ub290aCdcbiAgICAgKi9cbiAgICB2YXIgcHJvcHMgPSBfY3VycnkyKGZ1bmN0aW9uIHByb3BzKHBzLCBvYmopIHtcbiAgICAgICAgdmFyIG91dCA9IFtdO1xuICAgICAgICB2YXIgaWR4ID0gMDtcbiAgICAgICAgd2hpbGUgKGlkeCA8IHBzLmxlbmd0aCkge1xuICAgICAgICAgICAgb3V0W2lkeF0gPSBvYmpbcHNbaWR4XV07XG4gICAgICAgICAgICBpZHggKz0gMTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhIGxpc3Qgb2YgbnVtYmVycyBmcm9tIGBmcm9tYCAoaW5jbHVzaXZlKSB0byBgdG9gXG4gICAgICogKGV4Y2x1c2l2ZSkuXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IExpc3RcbiAgICAgKiBAc2lnIE51bWJlciAtPiBOdW1iZXIgLT4gW051bWJlcl1cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gZnJvbSBUaGUgZmlyc3QgbnVtYmVyIGluIHRoZSBsaXN0LlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSB0byBPbmUgbW9yZSB0aGFuIHRoZSBsYXN0IG51bWJlciBpbiB0aGUgbGlzdC5cbiAgICAgKiBAcmV0dXJuIHtBcnJheX0gVGhlIGxpc3Qgb2YgbnVtYmVycyBpbiB0dGhlIHNldCBgW2EsIGIpYC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICBSLnJhbmdlKDEsIDUpOyAgICAvLz0+IFsxLCAyLCAzLCA0XVxuICAgICAqICAgICAgUi5yYW5nZSg1MCwgNTMpOyAgLy89PiBbNTAsIDUxLCA1Ml1cbiAgICAgKi9cbiAgICB2YXIgcmFuZ2UgPSBfY3VycnkyKGZ1bmN0aW9uIHJhbmdlKGZyb20sIHRvKSB7XG4gICAgICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICAgICAgdmFyIG4gPSBmcm9tO1xuICAgICAgICB3aGlsZSAobiA8IHRvKSB7XG4gICAgICAgICAgICByZXN1bHRbcmVzdWx0Lmxlbmd0aF0gPSBuO1xuICAgICAgICAgICAgbiArPSAxO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBMaWtlIGByZWR1Y2VgLCBidXQgcGFzc2VzIGFkZGl0aW9uYWwgcGFyYW1ldGVycyB0byB0aGUgcHJlZGljYXRlIGZ1bmN0aW9uLlxuICAgICAqXG4gICAgICogVGhlIGl0ZXJhdG9yIGZ1bmN0aW9uIHJlY2VpdmVzIGZvdXIgdmFsdWVzOiAqKGFjYywgdmFsdWUsIGluZGV4LCBsaXN0KSpcbiAgICAgKlxuICAgICAqIE5vdGU6IGBSLnJlZHVjZUluZGV4ZWRgIGRvZXMgbm90IHNraXAgZGVsZXRlZCBvciB1bmFzc2lnbmVkIGluZGljZXMgKHNwYXJzZSBhcnJheXMpLFxuICAgICAqIHVubGlrZSB0aGUgbmF0aXZlIGBBcnJheS5wcm90b3R5cGUucmVkdWNlYCBtZXRob2QuIEZvciBtb3JlIGRldGFpbHMgb24gdGhpcyBiZWhhdmlvcixcbiAgICAgKiBzZWU6XG4gICAgICogaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvQXJyYXkvcmVkdWNlI0Rlc2NyaXB0aW9uXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IExpc3RcbiAgICAgKiBAc2lnIChhLGIsaSxbYl0gLT4gYSkgLT4gYSAtPiBbYl0gLT4gYVxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBpdGVyYXRvciBmdW5jdGlvbi4gUmVjZWl2ZXMgZm91ciB2YWx1ZXM6IHRoZSBhY2N1bXVsYXRvciwgdGhlXG4gICAgICogICAgICAgIGN1cnJlbnQgZWxlbWVudCBmcm9tIGBsaXN0YCwgdGhhdCBlbGVtZW50J3MgaW5kZXgsIGFuZCB0aGUgZW50aXJlIGBsaXN0YCBpdHNlbGYuXG4gICAgICogQHBhcmFtIHsqfSBhY2MgVGhlIGFjY3VtdWxhdG9yIHZhbHVlLlxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGxpc3QgVGhlIGxpc3QgdG8gaXRlcmF0ZSBvdmVyLlxuICAgICAqIEByZXR1cm4geyp9IFRoZSBmaW5hbCwgYWNjdW11bGF0ZWQgdmFsdWUuXG4gICAgICogQGRlcHJlY2F0ZWQgc2luY2UgdjAuMTUuMFxuICAgICAqIEBzZWUgUi5hZGRJbmRleFxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIHZhciBsZXR0ZXJzID0gWydhJywgJ2InLCAnYyddO1xuICAgICAqICAgICAgdmFyIG9iamVjdGlmeSA9IGZ1bmN0aW9uKGFjY09iamVjdCwgZWxlbSwgaWR4LCBsaXN0KSB7XG4gICAgICogICAgICAgIGFjY09iamVjdFtlbGVtXSA9IGlkeDtcbiAgICAgKiAgICAgICAgcmV0dXJuIGFjY09iamVjdDtcbiAgICAgKiAgICAgIH07XG4gICAgICpcbiAgICAgKiAgICAgIFIucmVkdWNlSW5kZXhlZChvYmplY3RpZnksIHt9LCBsZXR0ZXJzKTsgLy89PiB7ICdhJzogMCwgJ2InOiAxLCAnYyc6IDIgfVxuICAgICAqL1xuICAgIHZhciByZWR1Y2VJbmRleGVkID0gX2N1cnJ5MyhmdW5jdGlvbiByZWR1Y2VJbmRleGVkKGZuLCBhY2MsIGxpc3QpIHtcbiAgICAgICAgdmFyIGlkeCA9IDA7XG4gICAgICAgIHdoaWxlIChpZHggPCBsaXN0Lmxlbmd0aCkge1xuICAgICAgICAgICAgYWNjID0gZm4oYWNjLCBsaXN0W2lkeF0sIGlkeCwgbGlzdCk7XG4gICAgICAgICAgICBpZHggKz0gMTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYWNjO1xuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhIHNpbmdsZSBpdGVtIGJ5IGl0ZXJhdGluZyB0aHJvdWdoIHRoZSBsaXN0LCBzdWNjZXNzaXZlbHkgY2FsbGluZyB0aGUgaXRlcmF0b3JcbiAgICAgKiBmdW5jdGlvbiBhbmQgcGFzc2luZyBpdCBhbiBhY2N1bXVsYXRvciB2YWx1ZSBhbmQgdGhlIGN1cnJlbnQgdmFsdWUgZnJvbSB0aGUgYXJyYXksIGFuZFxuICAgICAqIHRoZW4gcGFzc2luZyB0aGUgcmVzdWx0IHRvIHRoZSBuZXh0IGNhbGwuXG4gICAgICpcbiAgICAgKiBTaW1pbGFyIHRvIGByZWR1Y2VgLCBleGNlcHQgbW92ZXMgdGhyb3VnaCB0aGUgaW5wdXQgbGlzdCBmcm9tIHRoZSByaWdodCB0byB0aGUgbGVmdC5cbiAgICAgKlxuICAgICAqIFRoZSBpdGVyYXRvciBmdW5jdGlvbiByZWNlaXZlcyB0d28gdmFsdWVzOiAqKGFjYywgdmFsdWUpKlxuICAgICAqXG4gICAgICogTm90ZTogYFIucmVkdWNlUmlnaHRgIGRvZXMgbm90IHNraXAgZGVsZXRlZCBvciB1bmFzc2lnbmVkIGluZGljZXMgKHNwYXJzZSBhcnJheXMpLCB1bmxpa2VcbiAgICAgKiB0aGUgbmF0aXZlIGBBcnJheS5wcm90b3R5cGUucmVkdWNlYCBtZXRob2QuIEZvciBtb3JlIGRldGFpbHMgb24gdGhpcyBiZWhhdmlvciwgc2VlOlxuICAgICAqIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL0FycmF5L3JlZHVjZVJpZ2h0I0Rlc2NyaXB0aW9uXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IExpc3RcbiAgICAgKiBAc2lnIChhLGIgLT4gYSkgLT4gYSAtPiBbYl0gLT4gYVxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBpdGVyYXRvciBmdW5jdGlvbi4gUmVjZWl2ZXMgdHdvIHZhbHVlcywgdGhlIGFjY3VtdWxhdG9yIGFuZCB0aGVcbiAgICAgKiAgICAgICAgY3VycmVudCBlbGVtZW50IGZyb20gdGhlIGFycmF5LlxuICAgICAqIEBwYXJhbSB7Kn0gYWNjIFRoZSBhY2N1bXVsYXRvciB2YWx1ZS5cbiAgICAgKiBAcGFyYW0ge0FycmF5fSBsaXN0IFRoZSBsaXN0IHRvIGl0ZXJhdGUgb3Zlci5cbiAgICAgKiBAcmV0dXJuIHsqfSBUaGUgZmluYWwsIGFjY3VtdWxhdGVkIHZhbHVlLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIHZhciBwYWlycyA9IFsgWydhJywgMV0sIFsnYicsIDJdLCBbJ2MnLCAzXSBdO1xuICAgICAqICAgICAgdmFyIGZsYXR0ZW5QYWlycyA9IGZ1bmN0aW9uKGFjYywgcGFpcikge1xuICAgICAqICAgICAgICByZXR1cm4gYWNjLmNvbmNhdChwYWlyKTtcbiAgICAgKiAgICAgIH07XG4gICAgICpcbiAgICAgKiAgICAgIFIucmVkdWNlUmlnaHQoZmxhdHRlblBhaXJzLCBbXSwgcGFpcnMpOyAvLz0+IFsgJ2MnLCAzLCAnYicsIDIsICdhJywgMSBdXG4gICAgICovXG4gICAgdmFyIHJlZHVjZVJpZ2h0ID0gX2N1cnJ5MyhmdW5jdGlvbiByZWR1Y2VSaWdodChmbiwgYWNjLCBsaXN0KSB7XG4gICAgICAgIHZhciBpZHggPSBsaXN0Lmxlbmd0aCAtIDE7XG4gICAgICAgIHdoaWxlIChpZHggPj0gMCkge1xuICAgICAgICAgICAgYWNjID0gZm4oYWNjLCBsaXN0W2lkeF0pO1xuICAgICAgICAgICAgaWR4IC09IDE7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFjYztcbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIExpa2UgYHJlZHVjZVJpZ2h0YCwgYnV0IHBhc3NlcyBhZGRpdGlvbmFsIHBhcmFtZXRlcnMgdG8gdGhlIHByZWRpY2F0ZSBmdW5jdGlvbi4gTW92ZXMgdGhyb3VnaFxuICAgICAqIHRoZSBpbnB1dCBsaXN0IGZyb20gdGhlIHJpZ2h0IHRvIHRoZSBsZWZ0LlxuICAgICAqXG4gICAgICogVGhlIGl0ZXJhdG9yIGZ1bmN0aW9uIHJlY2VpdmVzIGZvdXIgdmFsdWVzOiAqKGFjYywgdmFsdWUsIGluZGV4LCBsaXN0KSouXG4gICAgICpcbiAgICAgKiBOb3RlOiBgUi5yZWR1Y2VSaWdodEluZGV4ZWRgIGRvZXMgbm90IHNraXAgZGVsZXRlZCBvciB1bmFzc2lnbmVkIGluZGljZXMgKHNwYXJzZSBhcnJheXMpLFxuICAgICAqIHVubGlrZSB0aGUgbmF0aXZlIGBBcnJheS5wcm90b3R5cGUucmVkdWNlYCBtZXRob2QuIEZvciBtb3JlIGRldGFpbHMgb24gdGhpcyBiZWhhdmlvcixcbiAgICAgKiBzZWU6XG4gICAgICogaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvQXJyYXkvcmVkdWNlUmlnaHQjRGVzY3JpcHRpb25cbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgTGlzdFxuICAgICAqIEBzaWcgKGEsYixpLFtiXSAtPiBhIC0+IFtiXSAtPiBhXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGl0ZXJhdG9yIGZ1bmN0aW9uLiBSZWNlaXZlcyBmb3VyIHZhbHVlczogdGhlIGFjY3VtdWxhdG9yLCB0aGVcbiAgICAgKiAgICAgICAgY3VycmVudCBlbGVtZW50IGZyb20gYGxpc3RgLCB0aGF0IGVsZW1lbnQncyBpbmRleCwgYW5kIHRoZSBlbnRpcmUgYGxpc3RgIGl0c2VsZi5cbiAgICAgKiBAcGFyYW0geyp9IGFjYyBUaGUgYWNjdW11bGF0b3IgdmFsdWUuXG4gICAgICogQHBhcmFtIHtBcnJheX0gbGlzdCBUaGUgbGlzdCB0byBpdGVyYXRlIG92ZXIuXG4gICAgICogQHJldHVybiB7Kn0gVGhlIGZpbmFsLCBhY2N1bXVsYXRlZCB2YWx1ZS5cbiAgICAgKiBAZGVwcmVjYXRlZCBzaW5jZSB2MC4xNS4wXG4gICAgICogQHNlZSBSLmFkZEluZGV4XG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgdmFyIGxldHRlcnMgPSBbJ2EnLCAnYicsICdjJ107XG4gICAgICogICAgICB2YXIgb2JqZWN0aWZ5ID0gZnVuY3Rpb24oYWNjT2JqZWN0LCBlbGVtLCBpZHgsIGxpc3QpIHtcbiAgICAgKiAgICAgICAgYWNjT2JqZWN0W2VsZW1dID0gaWR4O1xuICAgICAqICAgICAgICByZXR1cm4gYWNjT2JqZWN0O1xuICAgICAqICAgICAgfTtcbiAgICAgKlxuICAgICAqICAgICAgUi5yZWR1Y2VSaWdodEluZGV4ZWQob2JqZWN0aWZ5LCB7fSwgbGV0dGVycyk7IC8vPT4geyAnYyc6IDIsICdiJzogMSwgJ2EnOiAwIH1cbiAgICAgKi9cbiAgICB2YXIgcmVkdWNlUmlnaHRJbmRleGVkID0gX2N1cnJ5MyhmdW5jdGlvbiByZWR1Y2VSaWdodEluZGV4ZWQoZm4sIGFjYywgbGlzdCkge1xuICAgICAgICB2YXIgaWR4ID0gbGlzdC5sZW5ndGggLSAxO1xuICAgICAgICB3aGlsZSAoaWR4ID49IDApIHtcbiAgICAgICAgICAgIGFjYyA9IGZuKGFjYywgbGlzdFtpZHhdLCBpZHgsIGxpc3QpO1xuICAgICAgICAgICAgaWR4IC09IDE7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFjYztcbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYSB2YWx1ZSB3cmFwcGVkIHRvIGluZGljYXRlIHRoYXQgaXQgaXMgdGhlIGZpbmFsIHZhbHVlIG9mIHRoZVxuICAgICAqIHJlZHVjZSBhbmQgdHJhbnNkdWNlIGZ1bmN0aW9ucy4gIFRoZSByZXR1cm5lZCB2YWx1ZVxuICAgICAqIHNob3VsZCBiZSBjb25zaWRlcmVkIGEgYmxhY2sgYm94OiB0aGUgaW50ZXJuYWwgc3RydWN0dXJlIGlzIG5vdFxuICAgICAqIGd1YXJhbnRlZWQgdG8gYmUgc3RhYmxlLlxuICAgICAqXG4gICAgICogTm90ZTogdGhpcyBvcHRpbWl6YXRpb24gaXMgdW5hdmFpbGFibGUgdG8gZnVuY3Rpb25zIG5vdCBleHBsaWNpdGx5IGxpc3RlZFxuICAgICAqIGFib3ZlLiAgRm9yIGluc3RhbmNlLCBpdCBpcyBub3QgY3VycmVudGx5IHN1cHBvcnRlZCBieSByZWR1Y2VJbmRleGVkLFxuICAgICAqIHJlZHVjZVJpZ2h0LCBvciByZWR1Y2VSaWdodEluZGV4ZWQuXG4gICAgICogQHNlZSBSLnJlZHVjZVxuICAgICAqIEBzZWUgUi50cmFuc2R1Y2VcbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgTGlzdFxuICAgICAqIEBzaWcgYSAtPiAqXG4gICAgICogQHBhcmFtIHsqfSB4IFRoZSBmaW5hbCB2YWx1ZSBvZiB0aGUgcmVkdWNlLlxuICAgICAqIEByZXR1cm4geyp9IFRoZSB3cmFwcGVkIHZhbHVlLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIFIucmVkdWNlKFxuICAgICAqICAgICAgICBSLnBpcGUoUi5hZGQsIFIuaWZFbHNlKFIubHRlKDEwKSwgUi5yZWR1Y2VkLCBSLmlkZW50aXR5KSksXG4gICAgICogICAgICAgIDAsXG4gICAgICogICAgICAgIFsxLCAyLCAzLCA0LCA1XSkgLy8gMTBcbiAgICAgKi9cbiAgICB2YXIgcmVkdWNlZCA9IF9jdXJyeTEoX3JlZHVjZWQpO1xuXG4gICAgLyoqXG4gICAgICogTGlrZSBgcmVqZWN0YCwgYnV0IHBhc3NlcyBhZGRpdGlvbmFsIHBhcmFtZXRlcnMgdG8gdGhlIHByZWRpY2F0ZSBmdW5jdGlvbi4gVGhlIHByZWRpY2F0ZVxuICAgICAqIGZ1bmN0aW9uIGlzIHBhc3NlZCB0aHJlZSBhcmd1bWVudHM6ICoodmFsdWUsIGluZGV4LCBsaXN0KSouXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IExpc3RcbiAgICAgKiBAc2lnIChhLCBpLCBbYV0gLT4gQm9vbGVhbikgLT4gW2FdIC0+IFthXVxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBmdW5jdGlvbiBjYWxsZWQgcGVyIGl0ZXJhdGlvbi5cbiAgICAgKiBAcGFyYW0ge0FycmF5fSBsaXN0IFRoZSBjb2xsZWN0aW9uIHRvIGl0ZXJhdGUgb3Zlci5cbiAgICAgKiBAcmV0dXJuIHtBcnJheX0gVGhlIG5ldyBmaWx0ZXJlZCBhcnJheS5cbiAgICAgKiBAZGVwcmVjYXRlZCBzaW5jZSB2MC4xNS4wXG4gICAgICogQHNlZSBSLmFkZEluZGV4XG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgdmFyIGxhc3RUd28gPSBmdW5jdGlvbih2YWwsIGlkeCwgbGlzdCkge1xuICAgICAqICAgICAgICByZXR1cm4gbGlzdC5sZW5ndGggLSBpZHggPD0gMjtcbiAgICAgKiAgICAgIH07XG4gICAgICpcbiAgICAgKiAgICAgIFIucmVqZWN0SW5kZXhlZChsYXN0VHdvLCBbOCwgNiwgNywgNSwgMywgMCwgOV0pOyAvLz0+IFs4LCA2LCA3LCA1LCAzXVxuICAgICAqL1xuICAgIHZhciByZWplY3RJbmRleGVkID0gX2N1cnJ5MihmdW5jdGlvbiByZWplY3RJbmRleGVkKGZuLCBsaXN0KSB7XG4gICAgICAgIHJldHVybiBfZmlsdGVySW5kZXhlZChfY29tcGxlbWVudChmbiksIGxpc3QpO1xuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlcyB0aGUgc3ViLWxpc3Qgb2YgYGxpc3RgIHN0YXJ0aW5nIGF0IGluZGV4IGBzdGFydGAgYW5kIGNvbnRhaW5pbmdcbiAgICAgKiBgY291bnRgIGVsZW1lbnRzLiAgX05vdGUgdGhhdCB0aGlzIGlzIG5vdCBkZXN0cnVjdGl2ZV86IGl0IHJldHVybnMgYVxuICAgICAqIGNvcHkgb2YgdGhlIGxpc3Qgd2l0aCB0aGUgY2hhbmdlcy5cbiAgICAgKiA8c21hbGw+Tm8gbGlzdHMgaGF2ZSBiZWVuIGhhcm1lZCBpbiB0aGUgYXBwbGljYXRpb24gb2YgdGhpcyBmdW5jdGlvbi48L3NtYWxsPlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBMaXN0XG4gICAgICogQHNpZyBOdW1iZXIgLT4gTnVtYmVyIC0+IFthXSAtPiBbYV1cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gc3RhcnQgVGhlIHBvc2l0aW9uIHRvIHN0YXJ0IHJlbW92aW5nIGVsZW1lbnRzXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGNvdW50IFRoZSBudW1iZXIgb2YgZWxlbWVudHMgdG8gcmVtb3ZlXG4gICAgICogQHBhcmFtIHtBcnJheX0gbGlzdCBUaGUgbGlzdCB0byByZW1vdmUgZnJvbVxuICAgICAqIEByZXR1cm4ge0FycmF5fSBBIG5ldyBBcnJheSB3aXRoIGBjb3VudGAgZWxlbWVudHMgZnJvbSBgc3RhcnRgIHJlbW92ZWQuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgUi5yZW1vdmUoMiwgMywgWzEsMiwzLDQsNSw2LDcsOF0pOyAvLz0+IFsxLDIsNiw3LDhdXG4gICAgICovXG4gICAgdmFyIHJlbW92ZSA9IF9jdXJyeTMoZnVuY3Rpb24gcmVtb3ZlKHN0YXJ0LCBjb3VudCwgbGlzdCkge1xuICAgICAgICByZXR1cm4gX2NvbmNhdChfc2xpY2UobGlzdCwgMCwgTWF0aC5taW4oc3RhcnQsIGxpc3QubGVuZ3RoKSksIF9zbGljZShsaXN0LCBNYXRoLm1pbihsaXN0Lmxlbmd0aCwgc3RhcnQgKyBjb3VudCkpKTtcbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIFJlcGxhY2UgYSBzdWJzdHJpbmcgb3IgcmVnZXggbWF0Y2ggaW4gYSBzdHJpbmcgd2l0aCBhIHJlcGxhY2VtZW50LlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBTdHJpbmdcbiAgICAgKiBAc2lnIFJlZ0V4cHxTdHJpbmcgLT4gU3RyaW5nIC0+IFN0cmluZyAtPiBTdHJpbmdcbiAgICAgKiBAcGFyYW0ge1JlZ0V4cHxTdHJpbmd9IHBhdHRlcm4gQSByZWd1bGFyIGV4cHJlc3Npb24gb3IgYSBzdWJzdHJpbmcgdG8gbWF0Y2guXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHJlcGxhY2VtZW50IFRoZSBzdHJpbmcgdG8gcmVwbGFjZSB0aGUgbWF0Y2hlcyB3aXRoLlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBzdHIgVGhlIFN0cmluZyB0byBkbyB0aGUgc2VhcmNoIGFuZCByZXBsYWNlbWVudCBpbi5cbiAgICAgKiBAcmV0dXJuIHtTdHJpbmd9IFRoZSByZXN1bHQuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgUi5yZXBsYWNlKCdmb28nLCAnYmFyJywgJ2ZvbyBmb28gZm9vJyk7IC8vPT4gJ2JhciBmb28gZm9vJ1xuICAgICAqICAgICAgUi5yZXBsYWNlKC9mb28vLCAnYmFyJywgJ2ZvbyBmb28gZm9vJyk7IC8vPT4gJ2JhciBmb28gZm9vJ1xuICAgICAqXG4gICAgICogICAgICAvLyBVc2UgdGhlIFwiZ1wiIChnbG9iYWwpIGZsYWcgdG8gcmVwbGFjZSBhbGwgb2NjdXJyZW5jZXM6XG4gICAgICogICAgICBSLnJlcGxhY2UoL2Zvby9nLCAnYmFyJywgJ2ZvbyBmb28gZm9vJyk7IC8vPT4gJ2JhciBiYXIgYmFyJ1xuICAgICAqL1xuICAgIHZhciByZXBsYWNlID0gX2N1cnJ5MyhmdW5jdGlvbiByZXBsYWNlKHJlZ2V4LCByZXBsYWNlbWVudCwgc3RyKSB7XG4gICAgICAgIHJldHVybiBzdHIucmVwbGFjZShyZWdleCwgcmVwbGFjZW1lbnQpO1xuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhIG5ldyBsaXN0IHdpdGggdGhlIHNhbWUgZWxlbWVudHMgYXMgdGhlIG9yaWdpbmFsIGxpc3QsIGp1c3RcbiAgICAgKiBpbiB0aGUgcmV2ZXJzZSBvcmRlci5cbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgTGlzdFxuICAgICAqIEBzaWcgW2FdIC0+IFthXVxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGxpc3QgVGhlIGxpc3QgdG8gcmV2ZXJzZS5cbiAgICAgKiBAcmV0dXJuIHtBcnJheX0gQSBjb3B5IG9mIHRoZSBsaXN0IGluIHJldmVyc2Ugb3JkZXIuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgUi5yZXZlcnNlKFsxLCAyLCAzXSk7ICAvLz0+IFszLCAyLCAxXVxuICAgICAqICAgICAgUi5yZXZlcnNlKFsxLCAyXSk7ICAgICAvLz0+IFsyLCAxXVxuICAgICAqICAgICAgUi5yZXZlcnNlKFsxXSk7ICAgICAgICAvLz0+IFsxXVxuICAgICAqICAgICAgUi5yZXZlcnNlKFtdKTsgICAgICAgICAvLz0+IFtdXG4gICAgICovXG4gICAgdmFyIHJldmVyc2UgPSBfY3VycnkxKGZ1bmN0aW9uIHJldmVyc2UobGlzdCkge1xuICAgICAgICByZXR1cm4gX3NsaWNlKGxpc3QpLnJldmVyc2UoKTtcbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIFNjYW4gaXMgc2ltaWxhciB0byByZWR1Y2UsIGJ1dCByZXR1cm5zIGEgbGlzdCBvZiBzdWNjZXNzaXZlbHkgcmVkdWNlZCB2YWx1ZXMgZnJvbSB0aGUgbGVmdFxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBMaXN0XG4gICAgICogQHNpZyAoYSxiIC0+IGEpIC0+IGEgLT4gW2JdIC0+IFthXVxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBpdGVyYXRvciBmdW5jdGlvbi4gUmVjZWl2ZXMgdHdvIHZhbHVlcywgdGhlIGFjY3VtdWxhdG9yIGFuZCB0aGVcbiAgICAgKiAgICAgICAgY3VycmVudCBlbGVtZW50IGZyb20gdGhlIGFycmF5XG4gICAgICogQHBhcmFtIHsqfSBhY2MgVGhlIGFjY3VtdWxhdG9yIHZhbHVlLlxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGxpc3QgVGhlIGxpc3QgdG8gaXRlcmF0ZSBvdmVyLlxuICAgICAqIEByZXR1cm4ge0FycmF5fSBBIGxpc3Qgb2YgYWxsIGludGVybWVkaWF0ZWx5IHJlZHVjZWQgdmFsdWVzLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIHZhciBudW1iZXJzID0gWzEsIDIsIDMsIDRdO1xuICAgICAqICAgICAgdmFyIGZhY3RvcmlhbHMgPSBSLnNjYW4oUi5tdWx0aXBseSwgMSwgbnVtYmVycyk7IC8vPT4gWzEsIDEsIDIsIDYsIDI0XVxuICAgICAqL1xuICAgIHZhciBzY2FuID0gX2N1cnJ5MyhmdW5jdGlvbiBzY2FuKGZuLCBhY2MsIGxpc3QpIHtcbiAgICAgICAgdmFyIGlkeCA9IDAsIHJlc3VsdCA9IFthY2NdO1xuICAgICAgICB3aGlsZSAoaWR4IDwgbGlzdC5sZW5ndGgpIHtcbiAgICAgICAgICAgIGFjYyA9IGZuKGFjYywgbGlzdFtpZHhdKTtcbiAgICAgICAgICAgIHJlc3VsdFtpZHggKyAxXSA9IGFjYztcbiAgICAgICAgICAgIGlkeCArPSAxO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGEgY29weSBvZiB0aGUgbGlzdCwgc29ydGVkIGFjY29yZGluZyB0byB0aGUgY29tcGFyYXRvciBmdW5jdGlvbiwgd2hpY2ggc2hvdWxkIGFjY2VwdCB0d28gdmFsdWVzIGF0IGFcbiAgICAgKiB0aW1lIGFuZCByZXR1cm4gYSBuZWdhdGl2ZSBudW1iZXIgaWYgdGhlIGZpcnN0IHZhbHVlIGlzIHNtYWxsZXIsIGEgcG9zaXRpdmUgbnVtYmVyIGlmIGl0J3MgbGFyZ2VyLCBhbmQgemVyb1xuICAgICAqIGlmIHRoZXkgYXJlIGVxdWFsLiAgUGxlYXNlIG5vdGUgdGhhdCB0aGlzIGlzIGEgKipjb3B5Kiogb2YgdGhlIGxpc3QuICBJdCBkb2VzIG5vdCBtb2RpZnkgdGhlIG9yaWdpbmFsLlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBMaXN0XG4gICAgICogQHNpZyAoYSxhIC0+IE51bWJlcikgLT4gW2FdIC0+IFthXVxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGNvbXBhcmF0b3IgQSBzb3J0aW5nIGZ1bmN0aW9uIDo6IGEgLT4gYiAtPiBJbnRcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBsaXN0IFRoZSBsaXN0IHRvIHNvcnRcbiAgICAgKiBAcmV0dXJuIHtBcnJheX0gYSBuZXcgYXJyYXkgd2l0aCBpdHMgZWxlbWVudHMgc29ydGVkIGJ5IHRoZSBjb21wYXJhdG9yIGZ1bmN0aW9uLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIHZhciBkaWZmID0gZnVuY3Rpb24oYSwgYikgeyByZXR1cm4gYSAtIGI7IH07XG4gICAgICogICAgICBSLnNvcnQoZGlmZiwgWzQsMiw3LDVdKTsgLy89PiBbMiwgNCwgNSwgN11cbiAgICAgKi9cbiAgICB2YXIgc29ydCA9IF9jdXJyeTIoZnVuY3Rpb24gc29ydChjb21wYXJhdG9yLCBsaXN0KSB7XG4gICAgICAgIHJldHVybiBfc2xpY2UobGlzdCkuc29ydChjb21wYXJhdG9yKTtcbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIFNvcnRzIHRoZSBsaXN0IGFjY29yZGluZyB0byBhIGtleSBnZW5lcmF0ZWQgYnkgdGhlIHN1cHBsaWVkIGZ1bmN0aW9uLlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBSZWxhdGlvblxuICAgICAqIEBzaWcgKGEgLT4gU3RyaW5nKSAtPiBbYV0gLT4gW2FdXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGZ1bmN0aW9uIG1hcHBpbmcgYGxpc3RgIGl0ZW1zIHRvIGtleXMuXG4gICAgICogQHBhcmFtIHtBcnJheX0gbGlzdCBUaGUgbGlzdCB0byBzb3J0LlxuICAgICAqIEByZXR1cm4ge0FycmF5fSBBIG5ldyBsaXN0IHNvcnRlZCBieSB0aGUga2V5cyBnZW5lcmF0ZWQgYnkgYGZuYC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICB2YXIgc29ydEJ5Rmlyc3RJdGVtID0gUi5zb3J0QnkocHJvcCgwKSk7XG4gICAgICogICAgICB2YXIgc29ydEJ5TmFtZUNhc2VJbnNlbnNpdGl2ZSA9IFIuc29ydEJ5KGNvbXBvc2UoUi50b0xvd2VyLCBwcm9wKCduYW1lJykpKTtcbiAgICAgKiAgICAgIHZhciBwYWlycyA9IFtbLTEsIDFdLCBbLTIsIDJdLCBbLTMsIDNdXTtcbiAgICAgKiAgICAgIHNvcnRCeUZpcnN0SXRlbShwYWlycyk7IC8vPT4gW1stMywgM10sIFstMiwgMl0sIFstMSwgMV1dXG4gICAgICogICAgICB2YXIgYWxpY2UgPSB7XG4gICAgICogICAgICAgIG5hbWU6ICdBTElDRScsXG4gICAgICogICAgICAgIGFnZTogMTAxXG4gICAgICogICAgICB9O1xuICAgICAqICAgICAgdmFyIGJvYiA9IHtcbiAgICAgKiAgICAgICAgbmFtZTogJ0JvYicsXG4gICAgICogICAgICAgIGFnZTogLTEwXG4gICAgICogICAgICB9O1xuICAgICAqICAgICAgdmFyIGNsYXJhID0ge1xuICAgICAqICAgICAgICBuYW1lOiAnY2xhcmEnLFxuICAgICAqICAgICAgICBhZ2U6IDMxNC4xNTlcbiAgICAgKiAgICAgIH07XG4gICAgICogICAgICB2YXIgcGVvcGxlID0gW2NsYXJhLCBib2IsIGFsaWNlXTtcbiAgICAgKiAgICAgIHNvcnRCeU5hbWVDYXNlSW5zZW5zaXRpdmUocGVvcGxlKTsgLy89PiBbYWxpY2UsIGJvYiwgY2xhcmFdXG4gICAgICovXG4gICAgdmFyIHNvcnRCeSA9IF9jdXJyeTIoZnVuY3Rpb24gc29ydEJ5KGZuLCBsaXN0KSB7XG4gICAgICAgIHJldHVybiBfc2xpY2UobGlzdCkuc29ydChmdW5jdGlvbiAoYSwgYikge1xuICAgICAgICAgICAgdmFyIGFhID0gZm4oYSk7XG4gICAgICAgICAgICB2YXIgYmIgPSBmbihiKTtcbiAgICAgICAgICAgIHJldHVybiBhYSA8IGJiID8gLTEgOiBhYSA+IGJiID8gMSA6IDA7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogRmluZHMgdGhlIGZpcnN0IGluZGV4IG9mIGEgc3Vic3RyaW5nIGluIGEgc3RyaW5nLCByZXR1cm5pbmcgLTEgaWYgaXQncyBub3QgcHJlc2VudFxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBTdHJpbmdcbiAgICAgKiBAc2lnIFN0cmluZyAtPiBTdHJpbmcgLT4gTnVtYmVyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGMgQSBzdHJpbmcgdG8gZmluZC5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gc3RyIFRoZSBzdHJpbmcgdG8gc2VhcmNoIGluXG4gICAgICogQHJldHVybiB7TnVtYmVyfSBUaGUgZmlyc3QgaW5kZXggb2YgYGNgIG9yIC0xIGlmIG5vdCBmb3VuZC5cbiAgICAgKiBAZGVwcmVjYXRlZCBzaW5jZSB2MC4xNS4wXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgUi5zdHJJbmRleE9mKCdjJywgJ2FiY2RlZmcnKTsgLy89PiAyXG4gICAgICovXG4gICAgdmFyIHN0ckluZGV4T2YgPSBfY3VycnkyKGZ1bmN0aW9uIHN0ckluZGV4T2YoYywgc3RyKSB7XG4gICAgICAgIHJldHVybiBzdHIuaW5kZXhPZihjKTtcbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqXG4gICAgICogRmluZHMgdGhlIGxhc3QgaW5kZXggb2YgYSBzdWJzdHJpbmcgaW4gYSBzdHJpbmcsIHJldHVybmluZyAtMSBpZiBpdCdzIG5vdCBwcmVzZW50XG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IFN0cmluZ1xuICAgICAqIEBzaWcgU3RyaW5nIC0+IFN0cmluZyAtPiBOdW1iZXJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gYyBBIHN0cmluZyB0byBmaW5kLlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBzdHIgVGhlIHN0cmluZyB0byBzZWFyY2ggaW5cbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9IFRoZSBsYXN0IGluZGV4IG9mIGBjYCBvciAtMSBpZiBub3QgZm91bmQuXG4gICAgICogQGRlcHJlY2F0ZWQgc2luY2UgdjAuMTUuMFxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIFIuc3RyTGFzdEluZGV4T2YoJ2EnLCAnYmFuYW5hIHNwbGl0Jyk7IC8vPT4gNVxuICAgICAqL1xuICAgIHZhciBzdHJMYXN0SW5kZXhPZiA9IF9jdXJyeTIoZnVuY3Rpb24gKGMsIHN0cikge1xuICAgICAgICByZXR1cm4gc3RyLmxhc3RJbmRleE9mKGMpO1xuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogU3VidHJhY3RzIHR3byBudW1iZXJzLiBFcXVpdmFsZW50IHRvIGBhIC0gYmAgYnV0IGN1cnJpZWQuXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IE1hdGhcbiAgICAgKiBAc2lnIE51bWJlciAtPiBOdW1iZXIgLT4gTnVtYmVyXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGEgVGhlIGZpcnN0IHZhbHVlLlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBiIFRoZSBzZWNvbmQgdmFsdWUuXG4gICAgICogQHJldHVybiB7TnVtYmVyfSBUaGUgcmVzdWx0IG9mIGBhIC0gYmAuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgUi5zdWJ0cmFjdCgxMCwgOCk7IC8vPT4gMlxuICAgICAqXG4gICAgICogICAgICB2YXIgbWludXM1ID0gUi5zdWJ0cmFjdChSLl9fLCA1KTtcbiAgICAgKiAgICAgIG1pbnVzNSgxNyk7IC8vPT4gMTJcbiAgICAgKlxuICAgICAqICAgICAgdmFyIGNvbXBsZW1lbnRhcnlBbmdsZSA9IFIuc3VidHJhY3QoOTApO1xuICAgICAqICAgICAgY29tcGxlbWVudGFyeUFuZ2xlKDMwKTsgLy89PiA2MFxuICAgICAqICAgICAgY29tcGxlbWVudGFyeUFuZ2xlKDcyKTsgLy89PiAxOFxuICAgICAqL1xuICAgIHZhciBzdWJ0cmFjdCA9IF9jdXJyeTIoZnVuY3Rpb24gc3VidHJhY3QoYSwgYikge1xuICAgICAgICByZXR1cm4gYSAtIGI7XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBSdW5zIHRoZSBnaXZlbiBmdW5jdGlvbiB3aXRoIHRoZSBzdXBwbGllZCBvYmplY3QsIHRoZW4gcmV0dXJucyB0aGUgb2JqZWN0LlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBGdW5jdGlvblxuICAgICAqIEBzaWcgKGEgLT4gKikgLT4gYSAtPiBhXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGZ1bmN0aW9uIHRvIGNhbGwgd2l0aCBgeGAuIFRoZSByZXR1cm4gdmFsdWUgb2YgYGZuYCB3aWxsIGJlIHRocm93biBhd2F5LlxuICAgICAqIEBwYXJhbSB7Kn0geFxuICAgICAqIEByZXR1cm4geyp9IGB4YC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICB2YXIgc2F5WCA9IGZ1bmN0aW9uKHgpIHsgY29uc29sZS5sb2coJ3ggaXMgJyArIHgpOyB9O1xuICAgICAqICAgICAgUi50YXAoc2F5WCwgMTAwKTsgLy89PiAxMDBcbiAgICAgKiAgICAgIC8vLT4gJ3ggaXMgMTAwJ1xuICAgICAqL1xuICAgIHZhciB0YXAgPSBfY3VycnkyKGZ1bmN0aW9uIHRhcChmbiwgeCkge1xuICAgICAgICBmbih4KTtcbiAgICAgICAgcmV0dXJuIHg7XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBEZXRlcm1pbmVzIHdoZXRoZXIgYSBnaXZlbiBzdHJpbmcgbWF0Y2hlcyBhIGdpdmVuIHJlZ3VsYXIgZXhwcmVzc2lvbi5cbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgU3RyaW5nXG4gICAgICogQHNpZyBSZWdFeHAgLT4gU3RyaW5nIC0+IEJvb2xlYW5cbiAgICAgKiBAcGFyYW0ge1JlZ0V4cH0gcGF0dGVyblxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIFIudGVzdCgvXngvLCAneHl6Jyk7IC8vPT4gdHJ1ZVxuICAgICAqICAgICAgUi50ZXN0KC9eeS8sICd4eXonKTsgLy89PiBmYWxzZVxuICAgICAqL1xuICAgIHZhciB0ZXN0ID0gX2N1cnJ5MihmdW5jdGlvbiB0ZXN0KHBhdHRlcm4sIHN0cikge1xuICAgICAgICByZXR1cm4gX2Nsb25lUmVnRXhwKHBhdHRlcm4pLnRlc3Qoc3RyKTtcbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIENhbGxzIGFuIGlucHV0IGZ1bmN0aW9uIGBuYCB0aW1lcywgcmV0dXJuaW5nIGFuIGFycmF5IGNvbnRhaW5pbmcgdGhlIHJlc3VsdHMgb2YgdGhvc2VcbiAgICAgKiBmdW5jdGlvbiBjYWxscy5cbiAgICAgKlxuICAgICAqIGBmbmAgaXMgcGFzc2VkIG9uZSBhcmd1bWVudDogVGhlIGN1cnJlbnQgdmFsdWUgb2YgYG5gLCB3aGljaCBiZWdpbnMgYXQgYDBgIGFuZCBpc1xuICAgICAqIGdyYWR1YWxseSBpbmNyZW1lbnRlZCB0byBgbiAtIDFgLlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBMaXN0XG4gICAgICogQHNpZyAoaSAtPiBhKSAtPiBpIC0+IFthXVxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBmdW5jdGlvbiB0byBpbnZva2UuIFBhc3NlZCBvbmUgYXJndW1lbnQsIHRoZSBjdXJyZW50IHZhbHVlIG9mIGBuYC5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gbiBBIHZhbHVlIGJldHdlZW4gYDBgIGFuZCBgbiAtIDFgLiBJbmNyZW1lbnRzIGFmdGVyIGVhY2ggZnVuY3Rpb24gY2FsbC5cbiAgICAgKiBAcmV0dXJuIHtBcnJheX0gQW4gYXJyYXkgY29udGFpbmluZyB0aGUgcmV0dXJuIHZhbHVlcyBvZiBhbGwgY2FsbHMgdG8gYGZuYC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICBSLnRpbWVzKFIuaWRlbnRpdHksIDUpOyAvLz0+IFswLCAxLCAyLCAzLCA0XVxuICAgICAqL1xuICAgIHZhciB0aW1lcyA9IF9jdXJyeTIoZnVuY3Rpb24gdGltZXMoZm4sIG4pIHtcbiAgICAgICAgdmFyIGxlbiA9IE51bWJlcihuKTtcbiAgICAgICAgdmFyIGxpc3QgPSBuZXcgQXJyYXkobGVuKTtcbiAgICAgICAgdmFyIGlkeCA9IDA7XG4gICAgICAgIHdoaWxlIChpZHggPCBsZW4pIHtcbiAgICAgICAgICAgIGxpc3RbaWR4XSA9IGZuKGlkeCk7XG4gICAgICAgICAgICBpZHggKz0gMTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbGlzdDtcbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIENvbnZlcnRzIGFuIG9iamVjdCBpbnRvIGFuIGFycmF5IG9mIGtleSwgdmFsdWUgYXJyYXlzLlxuICAgICAqIE9ubHkgdGhlIG9iamVjdCdzIG93biBwcm9wZXJ0aWVzIGFyZSB1c2VkLlxuICAgICAqIE5vdGUgdGhhdCB0aGUgb3JkZXIgb2YgdGhlIG91dHB1dCBhcnJheSBpcyBub3QgZ3VhcmFudGVlZCB0byBiZVxuICAgICAqIGNvbnNpc3RlbnQgYWNyb3NzIGRpZmZlcmVudCBKUyBwbGF0Zm9ybXMuXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IE9iamVjdFxuICAgICAqIEBzaWcge1N0cmluZzogKn0gLT4gW1tTdHJpbmcsKl1dXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9iaiBUaGUgb2JqZWN0IHRvIGV4dHJhY3QgZnJvbVxuICAgICAqIEByZXR1cm4ge0FycmF5fSBBbiBhcnJheSBvZiBrZXksIHZhbHVlIGFycmF5cyBmcm9tIHRoZSBvYmplY3QncyBvd24gcHJvcGVydGllcy5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICBSLnRvUGFpcnMoe2E6IDEsIGI6IDIsIGM6IDN9KTsgLy89PiBbWydhJywgMV0sIFsnYicsIDJdLCBbJ2MnLCAzXV1cbiAgICAgKi9cbiAgICB2YXIgdG9QYWlycyA9IF9jdXJyeTEoZnVuY3Rpb24gdG9QYWlycyhvYmopIHtcbiAgICAgICAgdmFyIHBhaXJzID0gW107XG4gICAgICAgIGZvciAodmFyIHByb3AgaW4gb2JqKSB7XG4gICAgICAgICAgICBpZiAoX2hhcyhwcm9wLCBvYmopKSB7XG4gICAgICAgICAgICAgICAgcGFpcnNbcGFpcnMubGVuZ3RoXSA9IFtcbiAgICAgICAgICAgICAgICAgICAgcHJvcCxcbiAgICAgICAgICAgICAgICAgICAgb2JqW3Byb3BdXG4gICAgICAgICAgICAgICAgXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcGFpcnM7XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBDb252ZXJ0cyBhbiBvYmplY3QgaW50byBhbiBhcnJheSBvZiBrZXksIHZhbHVlIGFycmF5cy5cbiAgICAgKiBUaGUgb2JqZWN0J3Mgb3duIHByb3BlcnRpZXMgYW5kIHByb3RvdHlwZSBwcm9wZXJ0aWVzIGFyZSB1c2VkLlxuICAgICAqIE5vdGUgdGhhdCB0aGUgb3JkZXIgb2YgdGhlIG91dHB1dCBhcnJheSBpcyBub3QgZ3VhcmFudGVlZCB0byBiZVxuICAgICAqIGNvbnNpc3RlbnQgYWNyb3NzIGRpZmZlcmVudCBKUyBwbGF0Zm9ybXMuXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IE9iamVjdFxuICAgICAqIEBzaWcge1N0cmluZzogKn0gLT4gW1tTdHJpbmcsKl1dXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9iaiBUaGUgb2JqZWN0IHRvIGV4dHJhY3QgZnJvbVxuICAgICAqIEByZXR1cm4ge0FycmF5fSBBbiBhcnJheSBvZiBrZXksIHZhbHVlIGFycmF5cyBmcm9tIHRoZSBvYmplY3QncyBvd25cbiAgICAgKiAgICAgICAgIGFuZCBwcm90b3R5cGUgcHJvcGVydGllcy5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICB2YXIgRiA9IGZ1bmN0aW9uKCkgeyB0aGlzLnggPSAnWCc7IH07XG4gICAgICogICAgICBGLnByb3RvdHlwZS55ID0gJ1knO1xuICAgICAqICAgICAgdmFyIGYgPSBuZXcgRigpO1xuICAgICAqICAgICAgUi50b1BhaXJzSW4oZik7IC8vPT4gW1sneCcsJ1gnXSwgWyd5JywnWSddXVxuICAgICAqL1xuICAgIHZhciB0b1BhaXJzSW4gPSBfY3VycnkxKGZ1bmN0aW9uIHRvUGFpcnNJbihvYmopIHtcbiAgICAgICAgdmFyIHBhaXJzID0gW107XG4gICAgICAgIGZvciAodmFyIHByb3AgaW4gb2JqKSB7XG4gICAgICAgICAgICBwYWlyc1twYWlycy5sZW5ndGhdID0gW1xuICAgICAgICAgICAgICAgIHByb3AsXG4gICAgICAgICAgICAgICAgb2JqW3Byb3BdXG4gICAgICAgICAgICBdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwYWlycztcbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIFJlbW92ZXMgKHN0cmlwcykgd2hpdGVzcGFjZSBmcm9tIGJvdGggZW5kcyBvZiB0aGUgc3RyaW5nLlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBTdHJpbmdcbiAgICAgKiBAc2lnIFN0cmluZyAtPiBTdHJpbmdcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gc3RyIFRoZSBzdHJpbmcgdG8gdHJpbS5cbiAgICAgKiBAcmV0dXJuIHtTdHJpbmd9IFRyaW1tZWQgdmVyc2lvbiBvZiBgc3RyYC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICBSLnRyaW0oJyAgIHh5eiAgJyk7IC8vPT4gJ3h5eidcbiAgICAgKiAgICAgIFIubWFwKFIudHJpbSwgUi5zcGxpdCgnLCcsICd4LCB5LCB6JykpOyAvLz0+IFsneCcsICd5JywgJ3onXVxuICAgICAqL1xuICAgIHZhciB0cmltID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgd3MgPSAnXFx0XFxuXFx4MEJcXGZcXHIgXFx4QTBcXHUxNjgwXFx1MTgwRVxcdTIwMDBcXHUyMDAxXFx1MjAwMlxcdTIwMDMnICsgJ1xcdTIwMDRcXHUyMDA1XFx1MjAwNlxcdTIwMDdcXHUyMDA4XFx1MjAwOVxcdTIwMEFcXHUyMDJGXFx1MjA1RlxcdTMwMDBcXHUyMDI4JyArICdcXHUyMDI5XFx1RkVGRic7XG4gICAgICAgIHZhciB6ZXJvV2lkdGggPSAnXFx1MjAwQic7XG4gICAgICAgIHZhciBoYXNQcm90b1RyaW0gPSB0eXBlb2YgU3RyaW5nLnByb3RvdHlwZS50cmltID09PSAnZnVuY3Rpb24nO1xuICAgICAgICBpZiAoIWhhc1Byb3RvVHJpbSB8fCAod3MudHJpbSgpIHx8ICF6ZXJvV2lkdGgudHJpbSgpKSkge1xuICAgICAgICAgICAgcmV0dXJuIF9jdXJyeTEoZnVuY3Rpb24gdHJpbShzdHIpIHtcbiAgICAgICAgICAgICAgICB2YXIgYmVnaW5SeCA9IG5ldyBSZWdFeHAoJ15bJyArIHdzICsgJ11bJyArIHdzICsgJ10qJyk7XG4gICAgICAgICAgICAgICAgdmFyIGVuZFJ4ID0gbmV3IFJlZ0V4cCgnWycgKyB3cyArICddWycgKyB3cyArICddKiQnKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gc3RyLnJlcGxhY2UoYmVnaW5SeCwgJycpLnJlcGxhY2UoZW5kUngsICcnKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIF9jdXJyeTEoZnVuY3Rpb24gdHJpbShzdHIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc3RyLnRyaW0oKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSgpO1xuXG4gICAgLyoqXG4gICAgICogR2l2ZXMgYSBzaW5nbGUtd29yZCBzdHJpbmcgZGVzY3JpcHRpb24gb2YgdGhlIChuYXRpdmUpIHR5cGUgb2YgYSB2YWx1ZSwgcmV0dXJuaW5nIHN1Y2hcbiAgICAgKiBhbnN3ZXJzIGFzICdPYmplY3QnLCAnTnVtYmVyJywgJ0FycmF5Jywgb3IgJ051bGwnLiAgRG9lcyBub3QgYXR0ZW1wdCB0byBkaXN0aW5ndWlzaCB1c2VyXG4gICAgICogT2JqZWN0IHR5cGVzIGFueSBmdXJ0aGVyLCByZXBvcnRpbmcgdGhlbSBhbGwgYXMgJ09iamVjdCcuXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IFR5cGVcbiAgICAgKiBAc2lnICgqIC0+IHsqfSkgLT4gU3RyaW5nXG4gICAgICogQHBhcmFtIHsqfSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAgICAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgUi50eXBlKHt9KTsgLy89PiBcIk9iamVjdFwiXG4gICAgICogICAgICBSLnR5cGUoMSk7IC8vPT4gXCJOdW1iZXJcIlxuICAgICAqICAgICAgUi50eXBlKGZhbHNlKTsgLy89PiBcIkJvb2xlYW5cIlxuICAgICAqICAgICAgUi50eXBlKCdzJyk7IC8vPT4gXCJTdHJpbmdcIlxuICAgICAqICAgICAgUi50eXBlKG51bGwpOyAvLz0+IFwiTnVsbFwiXG4gICAgICogICAgICBSLnR5cGUoW10pOyAvLz0+IFwiQXJyYXlcIlxuICAgICAqICAgICAgUi50eXBlKC9bQS16XS8pOyAvLz0+IFwiUmVnRXhwXCJcbiAgICAgKi9cbiAgICB2YXIgdHlwZSA9IF9jdXJyeTEoZnVuY3Rpb24gdHlwZSh2YWwpIHtcbiAgICAgICAgcmV0dXJuIHZhbCA9PT0gbnVsbCA/ICdOdWxsJyA6IHZhbCA9PT0gdW5kZWZpbmVkID8gJ1VuZGVmaW5lZCcgOiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsKS5zbGljZSg4LCAtMSk7XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBUYWtlcyBhIGZ1bmN0aW9uIGBmbmAsIHdoaWNoIHRha2VzIGEgc2luZ2xlIGFycmF5IGFyZ3VtZW50LCBhbmQgcmV0dXJuc1xuICAgICAqIGEgZnVuY3Rpb24gd2hpY2g6XG4gICAgICpcbiAgICAgKiAgIC0gdGFrZXMgYW55IG51bWJlciBvZiBwb3NpdGlvbmFsIGFyZ3VtZW50cztcbiAgICAgKiAgIC0gcGFzc2VzIHRoZXNlIGFyZ3VtZW50cyB0byBgZm5gIGFzIGFuIGFycmF5OyBhbmRcbiAgICAgKiAgIC0gcmV0dXJucyB0aGUgcmVzdWx0LlxuICAgICAqXG4gICAgICogSW4gb3RoZXIgd29yZHMsIFIudW5hcHBseSBkZXJpdmVzIGEgdmFyaWFkaWMgZnVuY3Rpb24gZnJvbSBhIGZ1bmN0aW9uXG4gICAgICogd2hpY2ggdGFrZXMgYW4gYXJyYXkuIFIudW5hcHBseSBpcyB0aGUgaW52ZXJzZSBvZiBSLmFwcGx5LlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBGdW5jdGlvblxuICAgICAqIEBzaWcgKFsqLi4uXSAtPiBhKSAtPiAoKi4uLiAtPiBhKVxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gICAgICogQHJldHVybiB7RnVuY3Rpb259XG4gICAgICogQHNlZSBSLmFwcGx5XG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgUi51bmFwcGx5KEpTT04uc3RyaW5naWZ5KSgxLCAyLCAzKTsgLy89PiAnWzEsMiwzXSdcbiAgICAgKi9cbiAgICB2YXIgdW5hcHBseSA9IF9jdXJyeTEoZnVuY3Rpb24gdW5hcHBseShmbikge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIGZuKF9zbGljZShhcmd1bWVudHMpKTtcbiAgICAgICAgfTtcbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIFdyYXBzIGEgZnVuY3Rpb24gb2YgYW55IGFyaXR5IChpbmNsdWRpbmcgbnVsbGFyeSkgaW4gYSBmdW5jdGlvbiB0aGF0IGFjY2VwdHMgZXhhY3RseSAxXG4gICAgICogcGFyYW1ldGVyLiBBbnkgZXh0cmFuZW91cyBwYXJhbWV0ZXJzIHdpbGwgbm90IGJlIHBhc3NlZCB0byB0aGUgc3VwcGxpZWQgZnVuY3Rpb24uXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IEZ1bmN0aW9uXG4gICAgICogQHNpZyAoKiAtPiBiKSAtPiAoYSAtPiBiKVxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBmdW5jdGlvbiB0byB3cmFwLlxuICAgICAqIEByZXR1cm4ge0Z1bmN0aW9ufSBBIG5ldyBmdW5jdGlvbiB3cmFwcGluZyBgZm5gLiBUaGUgbmV3IGZ1bmN0aW9uIGlzIGd1YXJhbnRlZWQgdG8gYmUgb2ZcbiAgICAgKiAgICAgICAgIGFyaXR5IDEuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgdmFyIHRha2VzVHdvQXJncyA9IGZ1bmN0aW9uKGEsIGIpIHtcbiAgICAgKiAgICAgICAgcmV0dXJuIFthLCBiXTtcbiAgICAgKiAgICAgIH07XG4gICAgICogICAgICB0YWtlc1R3b0FyZ3MubGVuZ3RoOyAvLz0+IDJcbiAgICAgKiAgICAgIHRha2VzVHdvQXJncygxLCAyKTsgLy89PiBbMSwgMl1cbiAgICAgKlxuICAgICAqICAgICAgdmFyIHRha2VzT25lQXJnID0gUi51bmFyeSh0YWtlc1R3b0FyZ3MpO1xuICAgICAqICAgICAgdGFrZXNPbmVBcmcubGVuZ3RoOyAvLz0+IDFcbiAgICAgKiAgICAgIC8vIE9ubHkgMSBhcmd1bWVudCBpcyBwYXNzZWQgdG8gdGhlIHdyYXBwZWQgZnVuY3Rpb25cbiAgICAgKiAgICAgIHRha2VzT25lQXJnKDEsIDIpOyAvLz0+IFsxLCB1bmRlZmluZWRdXG4gICAgICovXG4gICAgdmFyIHVuYXJ5ID0gX2N1cnJ5MShmdW5jdGlvbiB1bmFyeShmbikge1xuICAgICAgICByZXR1cm4gbkFyeSgxLCBmbik7XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBCdWlsZHMgYSBsaXN0IGZyb20gYSBzZWVkIHZhbHVlLiBBY2NlcHRzIGFuIGl0ZXJhdG9yIGZ1bmN0aW9uLCB3aGljaCByZXR1cm5zIGVpdGhlciBmYWxzZVxuICAgICAqIHRvIHN0b3AgaXRlcmF0aW9uIG9yIGFuIGFycmF5IG9mIGxlbmd0aCAyIGNvbnRhaW5pbmcgdGhlIHZhbHVlIHRvIGFkZCB0byB0aGUgcmVzdWx0aW5nXG4gICAgICogbGlzdCBhbmQgdGhlIHNlZWQgdG8gYmUgdXNlZCBpbiB0aGUgbmV4dCBjYWxsIHRvIHRoZSBpdGVyYXRvciBmdW5jdGlvbi5cbiAgICAgKlxuICAgICAqIFRoZSBpdGVyYXRvciBmdW5jdGlvbiByZWNlaXZlcyBvbmUgYXJndW1lbnQ6ICooc2VlZCkqLlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBMaXN0XG4gICAgICogQHNpZyAoYSAtPiBbYl0pIC0+ICogLT4gW2JdXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGl0ZXJhdG9yIGZ1bmN0aW9uLiByZWNlaXZlcyBvbmUgYXJndW1lbnQsIGBzZWVkYCwgYW5kIHJldHVybnNcbiAgICAgKiAgICAgICAgZWl0aGVyIGZhbHNlIHRvIHF1aXQgaXRlcmF0aW9uIG9yIGFuIGFycmF5IG9mIGxlbmd0aCB0d28gdG8gcHJvY2VlZC4gVGhlIGVsZW1lbnRcbiAgICAgKiAgICAgICAgYXQgaW5kZXggMCBvZiB0aGlzIGFycmF5IHdpbGwgYmUgYWRkZWQgdG8gdGhlIHJlc3VsdGluZyBhcnJheSwgYW5kIHRoZSBlbGVtZW50XG4gICAgICogICAgICAgIGF0IGluZGV4IDEgd2lsbCBiZSBwYXNzZWQgdG8gdGhlIG5leHQgY2FsbCB0byBgZm5gLlxuICAgICAqIEBwYXJhbSB7Kn0gc2VlZCBUaGUgc2VlZCB2YWx1ZS5cbiAgICAgKiBAcmV0dXJuIHtBcnJheX0gVGhlIGZpbmFsIGxpc3QuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgdmFyIGYgPSBmdW5jdGlvbihuKSB7IHJldHVybiBuID4gNTAgPyBmYWxzZSA6IFstbiwgbiArIDEwXSB9O1xuICAgICAqICAgICAgUi51bmZvbGQoZiwgMTApOyAvLz0+IFstMTAsIC0yMCwgLTMwLCAtNDAsIC01MF1cbiAgICAgKi9cbiAgICB2YXIgdW5mb2xkID0gX2N1cnJ5MihmdW5jdGlvbiB1bmZvbGQoZm4sIHNlZWQpIHtcbiAgICAgICAgdmFyIHBhaXIgPSBmbihzZWVkKTtcbiAgICAgICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgICAgICB3aGlsZSAocGFpciAmJiBwYWlyLmxlbmd0aCkge1xuICAgICAgICAgICAgcmVzdWx0W3Jlc3VsdC5sZW5ndGhdID0gcGFpclswXTtcbiAgICAgICAgICAgIHBhaXIgPSBmbihwYWlyWzFdKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhIG5ldyBsaXN0IGNvbnRhaW5pbmcgb25seSBvbmUgY29weSBvZiBlYWNoIGVsZW1lbnQgaW4gdGhlIG9yaWdpbmFsIGxpc3QsIGJhc2VkXG4gICAgICogdXBvbiB0aGUgdmFsdWUgcmV0dXJuZWQgYnkgYXBwbHlpbmcgdGhlIHN1cHBsaWVkIHByZWRpY2F0ZSB0byB0d28gbGlzdCBlbGVtZW50cy4gUHJlZmVyc1xuICAgICAqIHRoZSBmaXJzdCBpdGVtIGlmIHR3byBpdGVtcyBjb21wYXJlIGVxdWFsIGJhc2VkIG9uIHRoZSBwcmVkaWNhdGUuXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IExpc3RcbiAgICAgKiBAc2lnIChhLCBhIC0+IEJvb2xlYW4pIC0+IFthXSAtPiBbYV1cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBwcmVkIEEgcHJlZGljYXRlIHVzZWQgdG8gdGVzdCB3aGV0aGVyIHR3byBpdGVtcyBhcmUgZXF1YWwuXG4gICAgICogQHBhcmFtIHtBcnJheX0gbGlzdCBUaGUgYXJyYXkgdG8gY29uc2lkZXIuXG4gICAgICogQHJldHVybiB7QXJyYXl9IFRoZSBsaXN0IG9mIHVuaXF1ZSBpdGVtcy5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICB2YXIgc3RyRXEgPSBmdW5jdGlvbihhLCBiKSB7IHJldHVybiBTdHJpbmcoYSkgPT09IFN0cmluZyhiKTsgfTtcbiAgICAgKiAgICAgIFIudW5pcVdpdGgoc3RyRXEpKFsxLCAnMScsIDIsIDFdKTsgLy89PiBbMSwgMl1cbiAgICAgKiAgICAgIFIudW5pcVdpdGgoc3RyRXEpKFt7fSwge31dKTsgICAgICAgLy89PiBbe31dXG4gICAgICogICAgICBSLnVuaXFXaXRoKHN0ckVxKShbMSwgJzEnLCAxXSk7ICAgIC8vPT4gWzFdXG4gICAgICogICAgICBSLnVuaXFXaXRoKHN0ckVxKShbJzEnLCAxLCAxXSk7ICAgIC8vPT4gWycxJ11cbiAgICAgKi9cbiAgICB2YXIgdW5pcVdpdGggPSBfY3VycnkyKGZ1bmN0aW9uIHVuaXFXaXRoKHByZWQsIGxpc3QpIHtcbiAgICAgICAgdmFyIGlkeCA9IDA7XG4gICAgICAgIHZhciByZXN1bHQgPSBbXSwgaXRlbTtcbiAgICAgICAgd2hpbGUgKGlkeCA8IGxpc3QubGVuZ3RoKSB7XG4gICAgICAgICAgICBpdGVtID0gbGlzdFtpZHhdO1xuICAgICAgICAgICAgaWYgKCFfY29udGFpbnNXaXRoKHByZWQsIGl0ZW0sIHJlc3VsdCkpIHtcbiAgICAgICAgICAgICAgICByZXN1bHRbcmVzdWx0Lmxlbmd0aF0gPSBpdGVtO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWR4ICs9IDE7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYSBuZXcgY29weSBvZiB0aGUgYXJyYXkgd2l0aCB0aGUgZWxlbWVudCBhdCB0aGVcbiAgICAgKiBwcm92aWRlZCBpbmRleCByZXBsYWNlZCB3aXRoIHRoZSBnaXZlbiB2YWx1ZS5cbiAgICAgKiBAc2VlIFIuYWRqdXN0XG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IExpc3RcbiAgICAgKiBAc2lnIE51bWJlciAtPiBhIC0+IFthXSAtPiBbYV1cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gaWR4IFRoZSBpbmRleCB0byB1cGRhdGUuXG4gICAgICogQHBhcmFtIHsqfSB4IFRoZSB2YWx1ZSB0byBleGlzdCBhdCB0aGUgZ2l2ZW4gaW5kZXggb2YgdGhlIHJldHVybmVkIGFycmF5LlxuICAgICAqIEBwYXJhbSB7QXJyYXl8QXJndW1lbnRzfSBsaXN0IFRoZSBzb3VyY2UgYXJyYXktbGlrZSBvYmplY3QgdG8gYmUgdXBkYXRlZC5cbiAgICAgKiBAcmV0dXJuIHtBcnJheX0gQSBjb3B5IG9mIGBsaXN0YCB3aXRoIHRoZSB2YWx1ZSBhdCBpbmRleCBgaWR4YCByZXBsYWNlZCB3aXRoIGB4YC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICBSLnVwZGF0ZSgxLCAxMSwgWzAsIDEsIDJdKTsgICAgIC8vPT4gWzAsIDExLCAyXVxuICAgICAqICAgICAgUi51cGRhdGUoMSkoMTEpKFswLCAxLCAyXSk7ICAgICAvLz0+IFswLCAxMSwgMl1cbiAgICAgKi9cbiAgICB2YXIgdXBkYXRlID0gX2N1cnJ5MyhmdW5jdGlvbiAoaWR4LCB4LCBsaXN0KSB7XG4gICAgICAgIHJldHVybiBhZGp1c3QoYWx3YXlzKHgpLCBpZHgsIGxpc3QpO1xuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhIGxpc3Qgb2YgYWxsIHRoZSBlbnVtZXJhYmxlIG93biBwcm9wZXJ0aWVzIG9mIHRoZSBzdXBwbGllZCBvYmplY3QuXG4gICAgICogTm90ZSB0aGF0IHRoZSBvcmRlciBvZiB0aGUgb3V0cHV0IGFycmF5IGlzIG5vdCBndWFyYW50ZWVkIGFjcm9zc1xuICAgICAqIGRpZmZlcmVudCBKUyBwbGF0Zm9ybXMuXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IE9iamVjdFxuICAgICAqIEBzaWcge2s6IHZ9IC0+IFt2XVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvYmogVGhlIG9iamVjdCB0byBleHRyYWN0IHZhbHVlcyBmcm9tXG4gICAgICogQHJldHVybiB7QXJyYXl9IEFuIGFycmF5IG9mIHRoZSB2YWx1ZXMgb2YgdGhlIG9iamVjdCdzIG93biBwcm9wZXJ0aWVzLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIFIudmFsdWVzKHthOiAxLCBiOiAyLCBjOiAzfSk7IC8vPT4gWzEsIDIsIDNdXG4gICAgICovXG4gICAgdmFyIHZhbHVlcyA9IF9jdXJyeTEoZnVuY3Rpb24gdmFsdWVzKG9iaikge1xuICAgICAgICB2YXIgcHJvcHMgPSBrZXlzKG9iaik7XG4gICAgICAgIHZhciB2YWxzID0gW107XG4gICAgICAgIHZhciBpZHggPSAwO1xuICAgICAgICB3aGlsZSAoaWR4IDwgcHJvcHMubGVuZ3RoKSB7XG4gICAgICAgICAgICB2YWxzW2lkeF0gPSBvYmpbcHJvcHNbaWR4XV07XG4gICAgICAgICAgICBpZHggKz0gMTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdmFscztcbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYSBsaXN0IG9mIGFsbCB0aGUgcHJvcGVydGllcywgaW5jbHVkaW5nIHByb3RvdHlwZSBwcm9wZXJ0aWVzLFxuICAgICAqIG9mIHRoZSBzdXBwbGllZCBvYmplY3QuXG4gICAgICogTm90ZSB0aGF0IHRoZSBvcmRlciBvZiB0aGUgb3V0cHV0IGFycmF5IGlzIG5vdCBndWFyYW50ZWVkIHRvIGJlXG4gICAgICogY29uc2lzdGVudCBhY3Jvc3MgZGlmZmVyZW50IEpTIHBsYXRmb3Jtcy5cbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgT2JqZWN0XG4gICAgICogQHNpZyB7azogdn0gLT4gW3ZdXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9iaiBUaGUgb2JqZWN0IHRvIGV4dHJhY3QgdmFsdWVzIGZyb21cbiAgICAgKiBAcmV0dXJuIHtBcnJheX0gQW4gYXJyYXkgb2YgdGhlIHZhbHVlcyBvZiB0aGUgb2JqZWN0J3Mgb3duIGFuZCBwcm90b3R5cGUgcHJvcGVydGllcy5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICB2YXIgRiA9IGZ1bmN0aW9uKCkgeyB0aGlzLnggPSAnWCc7IH07XG4gICAgICogICAgICBGLnByb3RvdHlwZS55ID0gJ1knO1xuICAgICAqICAgICAgdmFyIGYgPSBuZXcgRigpO1xuICAgICAqICAgICAgUi52YWx1ZXNJbihmKTsgLy89PiBbJ1gnLCAnWSddXG4gICAgICovXG4gICAgdmFyIHZhbHVlc0luID0gX2N1cnJ5MShmdW5jdGlvbiB2YWx1ZXNJbihvYmopIHtcbiAgICAgICAgdmFyIHByb3AsIHZzID0gW107XG4gICAgICAgIGZvciAocHJvcCBpbiBvYmopIHtcbiAgICAgICAgICAgIHZzW3ZzLmxlbmd0aF0gPSBvYmpbcHJvcF07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHZzO1xuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogVGFrZXMgYSBzcGVjIG9iamVjdCBhbmQgYSB0ZXN0IG9iamVjdDsgcmV0dXJucyB0cnVlIGlmIHRoZSB0ZXN0IHNhdGlzZmllc1xuICAgICAqIHRoZSBzcGVjLiBFYWNoIG9mIHRoZSBzcGVjJ3Mgb3duIHByb3BlcnRpZXMgbXVzdCBiZSBhIHByZWRpY2F0ZSBmdW5jdGlvbi5cbiAgICAgKiBFYWNoIHByZWRpY2F0ZSBpcyBhcHBsaWVkIHRvIHRoZSB2YWx1ZSBvZiB0aGUgY29ycmVzcG9uZGluZyBwcm9wZXJ0eSBvZlxuICAgICAqIHRoZSB0ZXN0IG9iamVjdC4gYHdoZXJlYCByZXR1cm5zIHRydWUgaWYgYWxsIHRoZSBwcmVkaWNhdGVzIHJldHVybiB0cnVlLFxuICAgICAqIGZhbHNlIG90aGVyd2lzZS5cbiAgICAgKlxuICAgICAqIGB3aGVyZWAgaXMgd2VsbCBzdWl0ZWQgdG8gZGVjbGFyYXRpdmVseSBleHByZXNzaW5nIGNvbnN0cmFpbnRzIGZvciBvdGhlclxuICAgICAqIGZ1bmN0aW9ucyBzdWNoIGFzIGBmaWx0ZXJgIGFuZCBgZmluZGAuXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IE9iamVjdFxuICAgICAqIEBzaWcge1N0cmluZzogKCogLT4gQm9vbGVhbil9IC0+IHtTdHJpbmc6ICp9IC0+IEJvb2xlYW5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gc3BlY1xuICAgICAqIEBwYXJhbSB7T2JqZWN0fSB0ZXN0T2JqXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICAvLyBwcmVkIDo6IE9iamVjdCAtPiBCb29sZWFuXG4gICAgICogICAgICB2YXIgcHJlZCA9IFIud2hlcmUoe1xuICAgICAqICAgICAgICBhOiBSLmVxdWFscygnZm9vJyksXG4gICAgICogICAgICAgIGI6IFIuY29tcGxlbWVudChSLmVxdWFscygnYmFyJykpLFxuICAgICAqICAgICAgICB4OiBSLmd0KF8sIDEwKSxcbiAgICAgKiAgICAgICAgeTogUi5sdChfLCAyMClcbiAgICAgKiAgICAgIH0pO1xuICAgICAqXG4gICAgICogICAgICBwcmVkKHthOiAnZm9vJywgYjogJ3h4eCcsIHg6IDExLCB5OiAxOX0pOyAvLz0+IHRydWVcbiAgICAgKiAgICAgIHByZWQoe2E6ICd4eHgnLCBiOiAneHh4JywgeDogMTEsIHk6IDE5fSk7IC8vPT4gZmFsc2VcbiAgICAgKiAgICAgIHByZWQoe2E6ICdmb28nLCBiOiAnYmFyJywgeDogMTEsIHk6IDE5fSk7IC8vPT4gZmFsc2VcbiAgICAgKiAgICAgIHByZWQoe2E6ICdmb28nLCBiOiAneHh4JywgeDogMTAsIHk6IDE5fSk7IC8vPT4gZmFsc2VcbiAgICAgKiAgICAgIHByZWQoe2E6ICdmb28nLCBiOiAneHh4JywgeDogMTEsIHk6IDIwfSk7IC8vPT4gZmFsc2VcbiAgICAgKi9cbiAgICB2YXIgd2hlcmUgPSBfY3VycnkyKGZ1bmN0aW9uIHdoZXJlKHNwZWMsIHRlc3RPYmopIHtcbiAgICAgICAgZm9yICh2YXIgcHJvcCBpbiBzcGVjKSB7XG4gICAgICAgICAgICBpZiAoX2hhcyhwcm9wLCBzcGVjKSAmJiAhc3BlY1twcm9wXSh0ZXN0T2JqW3Byb3BdKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSBuZXcgbGlzdCBvdXQgb2YgdGhlIHR3byBzdXBwbGllZCBieSBjcmVhdGluZyBlYWNoIHBvc3NpYmxlXG4gICAgICogcGFpciBmcm9tIHRoZSBsaXN0cy5cbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgTGlzdFxuICAgICAqIEBzaWcgW2FdIC0+IFtiXSAtPiBbW2EsYl1dXG4gICAgICogQHBhcmFtIHtBcnJheX0gYXMgVGhlIGZpcnN0IGxpc3QuXG4gICAgICogQHBhcmFtIHtBcnJheX0gYnMgVGhlIHNlY29uZCBsaXN0LlxuICAgICAqIEByZXR1cm4ge0FycmF5fSBUaGUgbGlzdCBtYWRlIGJ5IGNvbWJpbmluZyBlYWNoIHBvc3NpYmxlIHBhaXIgZnJvbVxuICAgICAqICAgICAgICAgYGFzYCBhbmQgYGJzYCBpbnRvIHBhaXJzIChgW2EsIGJdYCkuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgUi54cHJvZChbMSwgMl0sIFsnYScsICdiJ10pOyAvLz0+IFtbMSwgJ2EnXSwgWzEsICdiJ10sIFsyLCAnYSddLCBbMiwgJ2InXV1cbiAgICAgKi9cbiAgICAvLyA9IHhwcm9kV2l0aChwcmVwZW5kKTsgKHRha2VzIGFib3V0IDMgdGltZXMgYXMgbG9uZy4uLilcbiAgICB2YXIgeHByb2QgPSBfY3VycnkyKGZ1bmN0aW9uIHhwcm9kKGEsIGIpIHtcbiAgICAgICAgLy8gPSB4cHJvZFdpdGgocHJlcGVuZCk7ICh0YWtlcyBhYm91dCAzIHRpbWVzIGFzIGxvbmcuLi4pXG4gICAgICAgIHZhciBpZHggPSAwO1xuICAgICAgICB2YXIgajtcbiAgICAgICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgICAgICB3aGlsZSAoaWR4IDwgYS5sZW5ndGgpIHtcbiAgICAgICAgICAgIGogPSAwO1xuICAgICAgICAgICAgd2hpbGUgKGogPCBiLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHJlc3VsdFtyZXN1bHQubGVuZ3RoXSA9IFtcbiAgICAgICAgICAgICAgICAgICAgYVtpZHhdLFxuICAgICAgICAgICAgICAgICAgICBiW2pdXG4gICAgICAgICAgICAgICAgXTtcbiAgICAgICAgICAgICAgICBqICs9IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZHggKz0gMTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIG5ldyBsaXN0IG91dCBvZiB0aGUgdHdvIHN1cHBsaWVkIGJ5IHBhaXJpbmcgdXBcbiAgICAgKiBlcXVhbGx5LXBvc2l0aW9uZWQgaXRlbXMgZnJvbSBib3RoIGxpc3RzLiAgVGhlIHJldHVybmVkIGxpc3QgaXNcbiAgICAgKiB0cnVuY2F0ZWQgdG8gdGhlIGxlbmd0aCBvZiB0aGUgc2hvcnRlciBvZiB0aGUgdHdvIGlucHV0IGxpc3RzLlxuICAgICAqIE5vdGU6IGB6aXBgIGlzIGVxdWl2YWxlbnQgdG8gYHppcFdpdGgoZnVuY3Rpb24oYSwgYikgeyByZXR1cm4gW2EsIGJdIH0pYC5cbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgTGlzdFxuICAgICAqIEBzaWcgW2FdIC0+IFtiXSAtPiBbW2EsYl1dXG4gICAgICogQHBhcmFtIHtBcnJheX0gbGlzdDEgVGhlIGZpcnN0IGFycmF5IHRvIGNvbnNpZGVyLlxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGxpc3QyIFRoZSBzZWNvbmQgYXJyYXkgdG8gY29uc2lkZXIuXG4gICAgICogQHJldHVybiB7QXJyYXl9IFRoZSBsaXN0IG1hZGUgYnkgcGFpcmluZyB1cCBzYW1lLWluZGV4ZWQgZWxlbWVudHMgb2YgYGxpc3QxYCBhbmQgYGxpc3QyYC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICBSLnppcChbMSwgMiwgM10sIFsnYScsICdiJywgJ2MnXSk7IC8vPT4gW1sxLCAnYSddLCBbMiwgJ2InXSwgWzMsICdjJ11dXG4gICAgICovXG4gICAgdmFyIHppcCA9IF9jdXJyeTIoZnVuY3Rpb24gemlwKGEsIGIpIHtcbiAgICAgICAgdmFyIHJ2ID0gW107XG4gICAgICAgIHZhciBpZHggPSAwO1xuICAgICAgICB2YXIgbGVuID0gTWF0aC5taW4oYS5sZW5ndGgsIGIubGVuZ3RoKTtcbiAgICAgICAgd2hpbGUgKGlkeCA8IGxlbikge1xuICAgICAgICAgICAgcnZbaWR4XSA9IFtcbiAgICAgICAgICAgICAgICBhW2lkeF0sXG4gICAgICAgICAgICAgICAgYltpZHhdXG4gICAgICAgICAgICBdO1xuICAgICAgICAgICAgaWR4ICs9IDE7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJ2O1xuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIG5ldyBvYmplY3Qgb3V0IG9mIGEgbGlzdCBvZiBrZXlzIGFuZCBhIGxpc3Qgb2YgdmFsdWVzLlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBMaXN0XG4gICAgICogQHNpZyBbU3RyaW5nXSAtPiBbKl0gLT4ge1N0cmluZzogKn1cbiAgICAgKiBAcGFyYW0ge0FycmF5fSBrZXlzIFRoZSBhcnJheSB0aGF0IHdpbGwgYmUgcHJvcGVydGllcyBvbiB0aGUgb3V0cHV0IG9iamVjdC5cbiAgICAgKiBAcGFyYW0ge0FycmF5fSB2YWx1ZXMgVGhlIGxpc3Qgb2YgdmFsdWVzIG9uIHRoZSBvdXRwdXQgb2JqZWN0LlxuICAgICAqIEByZXR1cm4ge09iamVjdH0gVGhlIG9iamVjdCBtYWRlIGJ5IHBhaXJpbmcgdXAgc2FtZS1pbmRleGVkIGVsZW1lbnRzIG9mIGBrZXlzYCBhbmQgYHZhbHVlc2AuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgUi56aXBPYmooWydhJywgJ2InLCAnYyddLCBbMSwgMiwgM10pOyAvLz0+IHthOiAxLCBiOiAyLCBjOiAzfVxuICAgICAqL1xuICAgIHZhciB6aXBPYmogPSBfY3VycnkyKGZ1bmN0aW9uIHppcE9iaihrZXlzLCB2YWx1ZXMpIHtcbiAgICAgICAgdmFyIGlkeCA9IDAsIG91dCA9IHt9O1xuICAgICAgICB3aGlsZSAoaWR4IDwga2V5cy5sZW5ndGgpIHtcbiAgICAgICAgICAgIG91dFtrZXlzW2lkeF1dID0gdmFsdWVzW2lkeF07XG4gICAgICAgICAgICBpZHggKz0gMTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIG5ldyBsaXN0IG91dCBvZiB0aGUgdHdvIHN1cHBsaWVkIGJ5IGFwcGx5aW5nIHRoZSBmdW5jdGlvbiB0b1xuICAgICAqIGVhY2ggZXF1YWxseS1wb3NpdGlvbmVkIHBhaXIgaW4gdGhlIGxpc3RzLiBUaGUgcmV0dXJuZWQgbGlzdCBpc1xuICAgICAqIHRydW5jYXRlZCB0byB0aGUgbGVuZ3RoIG9mIHRoZSBzaG9ydGVyIG9mIHRoZSB0d28gaW5wdXQgbGlzdHMuXG4gICAgICpcbiAgICAgKiBAZnVuY3Rpb25cbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBMaXN0XG4gICAgICogQHNpZyAoYSxiIC0+IGMpIC0+IFthXSAtPiBbYl0gLT4gW2NdXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGZ1bmN0aW9uIHVzZWQgdG8gY29tYmluZSB0aGUgdHdvIGVsZW1lbnRzIGludG8gb25lIHZhbHVlLlxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGxpc3QxIFRoZSBmaXJzdCBhcnJheSB0byBjb25zaWRlci5cbiAgICAgKiBAcGFyYW0ge0FycmF5fSBsaXN0MiBUaGUgc2Vjb25kIGFycmF5IHRvIGNvbnNpZGVyLlxuICAgICAqIEByZXR1cm4ge0FycmF5fSBUaGUgbGlzdCBtYWRlIGJ5IGNvbWJpbmluZyBzYW1lLWluZGV4ZWQgZWxlbWVudHMgb2YgYGxpc3QxYCBhbmQgYGxpc3QyYFxuICAgICAqICAgICAgICAgdXNpbmcgYGZuYC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICB2YXIgZiA9IGZ1bmN0aW9uKHgsIHkpIHtcbiAgICAgKiAgICAgICAgLy8gLi4uXG4gICAgICogICAgICB9O1xuICAgICAqICAgICAgUi56aXBXaXRoKGYsIFsxLCAyLCAzXSwgWydhJywgJ2InLCAnYyddKTtcbiAgICAgKiAgICAgIC8vPT4gW2YoMSwgJ2EnKSwgZigyLCAnYicpLCBmKDMsICdjJyldXG4gICAgICovXG4gICAgdmFyIHppcFdpdGggPSBfY3VycnkzKGZ1bmN0aW9uIHppcFdpdGgoZm4sIGEsIGIpIHtcbiAgICAgICAgdmFyIHJ2ID0gW10sIGlkeCA9IDAsIGxlbiA9IE1hdGgubWluKGEubGVuZ3RoLCBiLmxlbmd0aCk7XG4gICAgICAgIHdoaWxlIChpZHggPCBsZW4pIHtcbiAgICAgICAgICAgIHJ2W2lkeF0gPSBmbihhW2lkeF0sIGJbaWR4XSk7XG4gICAgICAgICAgICBpZHggKz0gMTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcnY7XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBBIGZ1bmN0aW9uIHRoYXQgYWx3YXlzIHJldHVybnMgYGZhbHNlYC4gQW55IHBhc3NlZCBpbiBwYXJhbWV0ZXJzIGFyZSBpZ25vcmVkLlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBGdW5jdGlvblxuICAgICAqIEBzaWcgKiAtPiBmYWxzZVxuICAgICAqIEBzZWUgUi5hbHdheXNcbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufSBmYWxzZVxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIFIuRigpOyAvLz0+IGZhbHNlXG4gICAgICovXG4gICAgdmFyIEYgPSBhbHdheXMoZmFsc2UpO1xuXG4gICAgLyoqXG4gICAgICogQSBmdW5jdGlvbiB0aGF0IGFsd2F5cyByZXR1cm5zIGB0cnVlYC4gQW55IHBhc3NlZCBpbiBwYXJhbWV0ZXJzIGFyZSBpZ25vcmVkLlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBGdW5jdGlvblxuICAgICAqIEBzaWcgKiAtPiB0cnVlXG4gICAgICogQHNlZSBSLmFsd2F5c1xuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59IGB0cnVlYC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICBSLlQoKTsgLy89PiB0cnVlXG4gICAgICovXG4gICAgdmFyIFQgPSBhbHdheXModHJ1ZSk7XG5cbiAgICB2YXIgX2FwcGVuZCA9IGZ1bmN0aW9uIF9hcHBlbmQoZWwsIGxpc3QpIHtcbiAgICAgICAgcmV0dXJuIF9jb25jYXQobGlzdCwgW2VsXSk7XG4gICAgfTtcblxuICAgIHZhciBfYXNzb2NQYXRoID0gZnVuY3Rpb24gX2Fzc29jUGF0aChwYXRoLCB2YWwsIG9iaikge1xuICAgICAgICBzd2l0Y2ggKHBhdGgubGVuZ3RoKSB7XG4gICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgIHJldHVybiBvYmo7XG4gICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgIHJldHVybiBfYXNzb2MocGF0aFswXSwgdmFsLCBvYmopO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgcmV0dXJuIF9hc3NvYyhwYXRoWzBdLCBfYXNzb2NQYXRoKF9zbGljZShwYXRoLCAxKSwgdmFsLCBPYmplY3Qob2JqW3BhdGhbMF1dKSksIG9iaik7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQ29waWVzIGFuIG9iamVjdC5cbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gYmUgY29waWVkXG4gICAgICogQHBhcmFtIHtBcnJheX0gcmVmRnJvbSBBcnJheSBjb250YWluaW5nIHRoZSBzb3VyY2UgcmVmZXJlbmNlc1xuICAgICAqIEBwYXJhbSB7QXJyYXl9IHJlZlRvIEFycmF5IGNvbnRhaW5pbmcgdGhlIGNvcGllZCBzb3VyY2UgcmVmZXJlbmNlc1xuICAgICAqIEByZXR1cm4geyp9IFRoZSBjb3BpZWQgdmFsdWUuXG4gICAgICovXG4gICAgdmFyIF9iYXNlQ29weSA9IGZ1bmN0aW9uIF9iYXNlQ29weSh2YWx1ZSwgcmVmRnJvbSwgcmVmVG8pIHtcbiAgICAgICAgdmFyIGNvcHkgPSBmdW5jdGlvbiBjb3B5KGNvcGllZFZhbHVlKSB7XG4gICAgICAgICAgICB2YXIgaWR4ID0gMDtcbiAgICAgICAgICAgIHdoaWxlIChpZHggPCByZWZGcm9tLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0gcmVmRnJvbVtpZHhdKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZWZUb1tpZHhdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZHggKz0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlZkZyb21baWR4ICsgMV0gPSB2YWx1ZTtcbiAgICAgICAgICAgIHJlZlRvW2lkeCArIDFdID0gY29waWVkVmFsdWU7XG4gICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gdmFsdWUpIHtcbiAgICAgICAgICAgICAgICBjb3BpZWRWYWx1ZVtrZXldID0gX2Jhc2VDb3B5KHZhbHVlW2tleV0sIHJlZkZyb20sIHJlZlRvKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBjb3BpZWRWYWx1ZTtcbiAgICAgICAgfTtcbiAgICAgICAgc3dpdGNoICh0eXBlKHZhbHVlKSkge1xuICAgICAgICBjYXNlICdPYmplY3QnOlxuICAgICAgICAgICAgcmV0dXJuIGNvcHkoe30pO1xuICAgICAgICBjYXNlICdBcnJheSc6XG4gICAgICAgICAgICByZXR1cm4gY29weShbXSk7XG4gICAgICAgIGNhc2UgJ0RhdGUnOlxuICAgICAgICAgICAgcmV0dXJuIG5ldyBEYXRlKHZhbHVlKTtcbiAgICAgICAgY2FzZSAnUmVnRXhwJzpcbiAgICAgICAgICAgIHJldHVybiBfY2xvbmVSZWdFeHAodmFsdWUpO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFNpbWlsYXIgdG8gaGFzTWV0aG9kLCB0aGlzIGNoZWNrcyB3aGV0aGVyIGEgZnVuY3Rpb24gaGFzIGEgW21ldGhvZG5hbWVdXG4gICAgICogZnVuY3Rpb24uIElmIGl0IGlzbid0IGFuIGFycmF5IGl0IHdpbGwgZXhlY3V0ZSB0aGF0IGZ1bmN0aW9uIG90aGVyd2lzZSBpdCB3aWxsXG4gICAgICogZGVmYXVsdCB0byB0aGUgcmFtZGEgaW1wbGVtZW50YXRpb24uXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIHJhbWRhIGltcGxlbXRhdGlvblxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBtZXRob2RuYW1lIHByb3BlcnR5IHRvIGNoZWNrIGZvciBhIGN1c3RvbSBpbXBsZW1lbnRhdGlvblxuICAgICAqIEByZXR1cm4ge09iamVjdH0gV2hhdGV2ZXIgdGhlIHJldHVybiB2YWx1ZSBvZiB0aGUgbWV0aG9kIGlzLlxuICAgICAqL1xuICAgIHZhciBfY2hlY2tGb3JNZXRob2QgPSBmdW5jdGlvbiBfY2hlY2tGb3JNZXRob2QobWV0aG9kbmFtZSwgZm4pIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgb2JqID0gYXJndW1lbnRzW2FyZ3VtZW50cy5sZW5ndGggLSAxXTtcbiAgICAgICAgICAgIHJldHVybiBfaXNBcnJheShvYmopIHx8IHR5cGVvZiBvYmpbbWV0aG9kbmFtZV0gIT09ICdmdW5jdGlvbicgPyBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpIDogb2JqW21ldGhvZG5hbWVdLmFwcGx5KG9iaiwgX3NsaWNlKGFyZ3VtZW50cywgMCwgYXJndW1lbnRzLmxlbmd0aCAtIDEpKTtcbiAgICAgICAgfTtcbiAgICB9O1xuXG4gICAgdmFyIF9jb21wb3NlTCA9IGZ1bmN0aW9uIF9jb21wb3NlTChpbm5lckxlbnMsIG91dGVyTGVucykge1xuICAgICAgICByZXR1cm4gbGVucyhfY29tcG9zZShpbm5lckxlbnMsIG91dGVyTGVucyksIGZ1bmN0aW9uICh4LCBzb3VyY2UpIHtcbiAgICAgICAgICAgIHZhciBuZXdJbm5lclZhbHVlID0gaW5uZXJMZW5zLnNldCh4LCBvdXRlckxlbnMoc291cmNlKSk7XG4gICAgICAgICAgICByZXR1cm4gb3V0ZXJMZW5zLnNldChuZXdJbm5lclZhbHVlLCBzb3VyY2UpO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQSByaWdodC1hc3NvY2lhdGl2ZSB0d28tYXJndW1lbnQgY29tcG9zaXRpb24gZnVuY3Rpb24gbGlrZSBgX2NvbXBvc2VgXG4gICAgICogYnV0IHdpdGggYXV0b21hdGljIGhhbmRsaW5nIG9mIHByb21pc2VzIChvciwgbW9yZSBwcmVjaXNlbHksXG4gICAgICogXCJ0aGVuYWJsZXNcIikuIFRoaXMgZnVuY3Rpb24gaXMgdXNlZCB0byBjb25zdHJ1Y3QgYSBtb3JlIGdlbmVyYWxcbiAgICAgKiBgY29tcG9zZVBgIGZ1bmN0aW9uLCB3aGljaCBhY2NlcHRzIGFueSBudW1iZXIgb2YgYXJndW1lbnRzLlxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAY2F0ZWdvcnkgRnVuY3Rpb25cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmIEEgZnVuY3Rpb24uXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gZyBBIGZ1bmN0aW9uLlxuICAgICAqIEByZXR1cm4ge0Z1bmN0aW9ufSBBIG5ldyBmdW5jdGlvbiB0aGF0IGlzIHRoZSBlcXVpdmFsZW50IG9mIGBmKGcoeCkpYC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICB2YXIgUSA9IHJlcXVpcmUoJ3EnKTtcbiAgICAgKiAgICAgIHZhciBkb3VibGUgPSBmdW5jdGlvbih4KSB7IHJldHVybiB4ICogMjsgfTtcbiAgICAgKiAgICAgIHZhciBzcXVhcmVBc3luYyA9IGZ1bmN0aW9uKHgpIHsgcmV0dXJuIFEud2hlbih4ICogeCk7IH07XG4gICAgICogICAgICB2YXIgc3F1YXJlQXN5bmNUaGVuRG91YmxlID0gX2NvbXBvc2VQKGRvdWJsZSwgc3F1YXJlQXN5bmMpO1xuICAgICAqXG4gICAgICogICAgICBzcXVhcmVBc3luY1RoZW5Eb3VibGUoNSlcbiAgICAgKiAgICAgICAgLnRoZW4oZnVuY3Rpb24ocmVzdWx0KSB7XG4gICAgICogICAgICAgICAgLy8gdGhlIHJlc3VsdCBpcyBub3cgNTAuXG4gICAgICogICAgICAgIH0pO1xuICAgICAqL1xuICAgIHZhciBfY29tcG9zZVAgPSBmdW5jdGlvbiBfY29tcG9zZVAoZiwgZykge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGNvbnRleHQgPSB0aGlzO1xuICAgICAgICAgICAgdmFyIHZhbHVlID0gZy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgaWYgKF9pc1RoZW5hYmxlKHZhbHVlKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZS50aGVuKGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGYuY2FsbChjb250ZXh0LCByZXN1bHQpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZi5jYWxsKHRoaXMsIHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9O1xuXG4gICAgLypcbiAgICAgKiBSZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCBtYWtlcyBhIG11bHRpLWFyZ3VtZW50IHZlcnNpb24gb2YgY29tcG9zZSBmcm9tXG4gICAgICogZWl0aGVyIF9jb21wb3NlIG9yIF9jb21wb3NlUC5cbiAgICAgKi9cbiAgICB2YXIgX2NyZWF0ZUNvbXBvc2VyID0gZnVuY3Rpb24gX2NyZWF0ZUNvbXBvc2VyKGNvbXBvc2VGdW5jdGlvbikge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGZuID0gYXJndW1lbnRzW2FyZ3VtZW50cy5sZW5ndGggLSAxXTtcbiAgICAgICAgICAgIHZhciBsZW5ndGggPSBmbi5sZW5ndGg7XG4gICAgICAgICAgICB2YXIgaWR4ID0gYXJndW1lbnRzLmxlbmd0aCAtIDI7XG4gICAgICAgICAgICB3aGlsZSAoaWR4ID49IDApIHtcbiAgICAgICAgICAgICAgICBmbiA9IGNvbXBvc2VGdW5jdGlvbihhcmd1bWVudHNbaWR4XSwgZm4pO1xuICAgICAgICAgICAgICAgIGlkeCAtPSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGFyaXR5KGxlbmd0aCwgZm4pO1xuICAgICAgICB9O1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGUgYSBmdW5jdGlvbiB3aGljaCB0YWtlcyBhIGxpc3RcbiAgICAgKiBhbmQgZGV0ZXJtaW5lcyB0aGUgd2lubmluZyB2YWx1ZSBieSBhIGNvbXBhcmF0b3IuIFVzZWQgaW50ZXJuYWxseVxuICAgICAqIGJ5IGBSLm1heGAgYW5kIGBSLm1pbmBcbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gY29tcGF0YXRvciBhIGZ1bmN0aW9uIHRvIGNvbXBhcmUgdHdvIGl0ZW1zXG4gICAgICogQHBhcmFtIHsqfSBpbnRpYWxWYWwsIGRlZmF1bHQgdmFsdWUgaWYgbm90aGluZyBlbHNlIHdpbnNcbiAgICAgKiBAY2F0ZWdvcnkgTWF0aFxuICAgICAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICAgICAqL1xuICAgIHZhciBfY3JlYXRlTWF4TWluID0gZnVuY3Rpb24gX2NyZWF0ZU1heE1pbihjb21wYXJhdG9yLCBpbml0aWFsVmFsKSB7XG4gICAgICAgIHJldHVybiBfY3VycnkxKGZ1bmN0aW9uIChsaXN0KSB7XG4gICAgICAgICAgICB2YXIgaWR4ID0gMCwgd2lubmVyID0gaW5pdGlhbFZhbCwgY29tcHV0ZWQ7XG4gICAgICAgICAgICB3aGlsZSAoaWR4IDwgbGlzdC5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBjb21wdXRlZCA9ICtsaXN0W2lkeF07XG4gICAgICAgICAgICAgICAgaWYgKGNvbXBhcmF0b3IoY29tcHV0ZWQsIHdpbm5lcikpIHtcbiAgICAgICAgICAgICAgICAgICAgd2lubmVyID0gY29tcHV0ZWQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlkeCArPSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHdpbm5lcjtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIHZhciBfY3JlYXRlUGFydGlhbEFwcGxpY2F0b3IgPSBmdW5jdGlvbiBfY3JlYXRlUGFydGlhbEFwcGxpY2F0b3IoY29uY2F0KSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoZm4pIHtcbiAgICAgICAgICAgIHZhciBhcmdzID0gX3NsaWNlKGFyZ3VtZW50cywgMSk7XG4gICAgICAgICAgICByZXR1cm4gYXJpdHkoTWF0aC5tYXgoMCwgZm4ubGVuZ3RoIC0gYXJncy5sZW5ndGgpLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZuLmFwcGx5KHRoaXMsIGNvbmNhdChhcmdzLCBhcmd1bWVudHMpKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBJbnRlcm5hbCBjdXJyeU4gZnVuY3Rpb24uXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEBjYXRlZ29yeSBGdW5jdGlvblxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBsZW5ndGggVGhlIGFyaXR5IG9mIHRoZSBjdXJyaWVkIGZ1bmN0aW9uLlxuICAgICAqIEByZXR1cm4ge2FycmF5fSBBbiBhcnJheSBvZiBhcmd1bWVudHMgcmVjZWl2ZWQgdGh1cyBmYXIuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGZ1bmN0aW9uIHRvIGN1cnJ5LlxuICAgICAqL1xuICAgIHZhciBfY3VycnlOID0gZnVuY3Rpb24gX2N1cnJ5TihsZW5ndGgsIHJlY2VpdmVkLCBmbikge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGNvbWJpbmVkID0gW107XG4gICAgICAgICAgICB2YXIgYXJnc0lkeCA9IDA7XG4gICAgICAgICAgICB2YXIgbGVmdCA9IGxlbmd0aDtcbiAgICAgICAgICAgIHZhciBjb21iaW5lZElkeCA9IDA7XG4gICAgICAgICAgICB3aGlsZSAoY29tYmluZWRJZHggPCByZWNlaXZlZC5sZW5ndGggfHwgYXJnc0lkeCA8IGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICB2YXIgcmVzdWx0O1xuICAgICAgICAgICAgICAgIGlmIChjb21iaW5lZElkeCA8IHJlY2VpdmVkLmxlbmd0aCAmJiAocmVjZWl2ZWRbY29tYmluZWRJZHhdID09IG51bGwgfHwgcmVjZWl2ZWRbY29tYmluZWRJZHhdWydAQGZ1bmN0aW9uYWwvcGxhY2Vob2xkZXInXSAhPT0gdHJ1ZSB8fCBhcmdzSWR4ID49IGFyZ3VtZW50cy5sZW5ndGgpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IHJlY2VpdmVkW2NvbWJpbmVkSWR4XTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSBhcmd1bWVudHNbYXJnc0lkeF07XG4gICAgICAgICAgICAgICAgICAgIGFyZ3NJZHggKz0gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29tYmluZWRbY29tYmluZWRJZHhdID0gcmVzdWx0O1xuICAgICAgICAgICAgICAgIGlmIChyZXN1bHQgPT0gbnVsbCB8fCByZXN1bHRbJ0BAZnVuY3Rpb25hbC9wbGFjZWhvbGRlciddICE9PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGxlZnQgLT0gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29tYmluZWRJZHggKz0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBsZWZ0IDw9IDAgPyBmbi5hcHBseSh0aGlzLCBjb21iaW5lZCkgOiBhcml0eShsZWZ0LCBfY3VycnlOKGxlbmd0aCwgY29tYmluZWQsIGZuKSk7XG4gICAgICAgIH07XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYSBmdW5jdGlvbiB0aGF0IGRpc3BhdGNoZXMgd2l0aCBkaWZmZXJlbnQgc3RyYXRlZ2llcyBiYXNlZCBvbiB0aGVcbiAgICAgKiBvYmplY3QgaW4gbGlzdCBwb3NpdGlvbiAobGFzdCBhcmd1bWVudCkuIElmIGl0IGlzIGFuIGFycmF5LCBleGVjdXRlcyBbZm5dLlxuICAgICAqIE90aGVyd2lzZSwgaWYgaXQgaGFzIGEgIGZ1bmN0aW9uIHdpdGggW21ldGhvZG5hbWVdLCBpdCB3aWxsIGV4ZWN1dGUgdGhhdFxuICAgICAqIGZ1bmN0aW9uIChmdW5jdG9yIGNhc2UpLiBPdGhlcndpc2UsIGlmIGl0IGlzIGEgdHJhbnNmb3JtZXIsIHVzZXMgdHJhbnNkdWNlclxuICAgICAqIFt4Zl0gdG8gcmV0dXJuIGEgbmV3IHRyYW5zZm9ybWVyICh0cmFuc2R1Y2VyIGNhc2UpLiBPdGhlcndpc2UsIGl0IHdpbGxcbiAgICAgKiBkZWZhdWx0IHRvIGV4ZWN1dGluZyBbZm5dLlxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gbWV0aG9kbmFtZSBwcm9wZXJ0eSB0byBjaGVjayBmb3IgYSBjdXN0b20gaW1wbGVtZW50YXRpb25cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSB4ZiB0cmFuc2R1Y2VyIHRvIGluaXRpYWxpemUgaWYgb2JqZWN0IGlzIHRyYW5zZm9ybWVyXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gZGVmYXVsdCByYW1kYSBpbXBsZW1lbnRhdGlvblxuICAgICAqIEByZXR1cm4ge0Z1bmN0aW9ufSBBIGZ1bmN0aW9uIHRoYXQgZGlzcGF0Y2hlcyBvbiBvYmplY3QgaW4gbGlzdCBwb3NpdGlvblxuICAgICAqL1xuICAgIHZhciBfZGlzcGF0Y2hhYmxlID0gZnVuY3Rpb24gX2Rpc3BhdGNoYWJsZShtZXRob2RuYW1lLCB4ZiwgZm4pIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgb2JqID0gYXJndW1lbnRzW2FyZ3VtZW50cy5sZW5ndGggLSAxXTtcbiAgICAgICAgICAgIGlmICghX2lzQXJyYXkob2JqKSkge1xuICAgICAgICAgICAgICAgIHZhciBhcmdzID0gX3NsaWNlKGFyZ3VtZW50cywgMCwgYXJndW1lbnRzLmxlbmd0aCAtIDEpO1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2Ygb2JqW21ldGhvZG5hbWVdID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBvYmpbbWV0aG9kbmFtZV0uYXBwbHkob2JqLCBhcmdzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKF9pc1RyYW5zZm9ybWVyKG9iaikpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRyYW5zZHVjZXIgPSB4Zi5hcHBseShudWxsLCBhcmdzKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRyYW5zZHVjZXIob2JqKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgfTtcbiAgICB9O1xuXG4gICAgdmFyIF9kaXNzb2NQYXRoID0gZnVuY3Rpb24gX2Rpc3NvY1BhdGgocGF0aCwgb2JqKSB7XG4gICAgICAgIHN3aXRjaCAocGF0aC5sZW5ndGgpIHtcbiAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgcmV0dXJuIG9iajtcbiAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgcmV0dXJuIF9kaXNzb2MocGF0aFswXSwgb2JqKTtcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHZhciBoZWFkID0gcGF0aFswXTtcbiAgICAgICAgICAgIHZhciB0YWlsID0gX3NsaWNlKHBhdGgsIDEpO1xuICAgICAgICAgICAgcmV0dXJuIG9ialtoZWFkXSA9PSBudWxsID8gb2JqIDogX2Fzc29jKGhlYWQsIF9kaXNzb2NQYXRoKHRhaWwsIG9ialtoZWFkXSksIG9iaik7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gVGhlIGFsZ29yaXRobSB1c2VkIHRvIGhhbmRsZSBjeWNsaWMgc3RydWN0dXJlcyBpc1xuICAgIC8vIGluc3BpcmVkIGJ5IHVuZGVyc2NvcmUncyBpc0VxdWFsXG4gICAgLy8gUmVnRXhwIGVxdWFsaXR5IGFsZ29yaXRobTogaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMTA3NzY2MzVcbiAgICB2YXIgX2VxdWFscyA9IGZ1bmN0aW9uIF9lcURlZXAoYSwgYiwgc3RhY2tBLCBzdGFja0IpIHtcbiAgICAgICAgdmFyIHR5cGVBID0gdHlwZShhKTtcbiAgICAgICAgaWYgKHR5cGVBICE9PSB0eXBlKGIpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVBID09PSAnQm9vbGVhbicgfHwgdHlwZUEgPT09ICdOdW1iZXInIHx8IHR5cGVBID09PSAnU3RyaW5nJykge1xuICAgICAgICAgICAgcmV0dXJuIHR5cGVvZiBhID09PSAnb2JqZWN0JyA/IHR5cGVvZiBiID09PSAnb2JqZWN0JyAmJiBpZGVudGljYWwoYS52YWx1ZU9mKCksIGIudmFsdWVPZigpKSA6IGlkZW50aWNhbChhLCBiKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaWRlbnRpY2FsKGEsIGIpKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZUEgPT09ICdSZWdFeHAnKSB7XG4gICAgICAgICAgICAvLyBSZWdFeHAgZXF1YWxpdHkgYWxnb3JpdGhtOiBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8xMDc3NjYzNVxuICAgICAgICAgICAgcmV0dXJuIGEuc291cmNlID09PSBiLnNvdXJjZSAmJiBhLmdsb2JhbCA9PT0gYi5nbG9iYWwgJiYgYS5pZ25vcmVDYXNlID09PSBiLmlnbm9yZUNhc2UgJiYgYS5tdWx0aWxpbmUgPT09IGIubXVsdGlsaW5lICYmIGEuc3RpY2t5ID09PSBiLnN0aWNreSAmJiBhLnVuaWNvZGUgPT09IGIudW5pY29kZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoT2JqZWN0KGEpID09PSBhKSB7XG4gICAgICAgICAgICBpZiAodHlwZUEgPT09ICdEYXRlJyAmJiBhLmdldFRpbWUoKSAhPT0gYi5nZXRUaW1lKCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIga2V5c0EgPSBrZXlzKGEpO1xuICAgICAgICAgICAgaWYgKGtleXNBLmxlbmd0aCAhPT0ga2V5cyhiKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgaWR4ID0gc3RhY2tBLmxlbmd0aCAtIDE7XG4gICAgICAgICAgICB3aGlsZSAoaWR4ID49IDApIHtcbiAgICAgICAgICAgICAgICBpZiAoc3RhY2tBW2lkeF0gPT09IGEpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHN0YWNrQltpZHhdID09PSBiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZHggLT0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHN0YWNrQVtzdGFja0EubGVuZ3RoXSA9IGE7XG4gICAgICAgICAgICBzdGFja0Jbc3RhY2tCLmxlbmd0aF0gPSBiO1xuICAgICAgICAgICAgaWR4ID0ga2V5c0EubGVuZ3RoIC0gMTtcbiAgICAgICAgICAgIHdoaWxlIChpZHggPj0gMCkge1xuICAgICAgICAgICAgICAgIHZhciBrZXkgPSBrZXlzQVtpZHhdO1xuICAgICAgICAgICAgICAgIGlmICghX2hhcyhrZXksIGIpIHx8ICFfZXFEZWVwKGJba2V5XSwgYVtrZXldLCBzdGFja0EsIHN0YWNrQikpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZHggLT0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHN0YWNrQS5wb3AoKTtcbiAgICAgICAgICAgIHN0YWNrQi5wb3AoKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQXNzaWducyBvd24gZW51bWVyYWJsZSBwcm9wZXJ0aWVzIG9mIHRoZSBvdGhlciBvYmplY3QgdG8gdGhlIGRlc3RpbmF0aW9uXG4gICAgICogb2JqZWN0IHByZWZlcnJpbmcgaXRlbXMgaW4gb3RoZXIuXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IE9iamVjdFxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBkZXN0aW5hdGlvbiBUaGUgZGVzdGluYXRpb24gb2JqZWN0LlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvdGhlciBUaGUgb3RoZXIgb2JqZWN0IHRvIG1lcmdlIHdpdGggZGVzdGluYXRpb24uXG4gICAgICogQHJldHVybiB7T2JqZWN0fSBUaGUgZGVzdGluYXRpb24gb2JqZWN0LlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIF9leHRlbmQoeyAnbmFtZSc6ICdmcmVkJywgJ2FnZSc6IDEwIH0sIHsgJ2FnZSc6IDQwIH0pO1xuICAgICAqICAgICAgLy89PiB7ICduYW1lJzogJ2ZyZWQnLCAnYWdlJzogNDAgfVxuICAgICAqL1xuICAgIHZhciBfZXh0ZW5kID0gZnVuY3Rpb24gX2V4dGVuZChkZXN0aW5hdGlvbiwgb3RoZXIpIHtcbiAgICAgICAgdmFyIHByb3BzID0ga2V5cyhvdGhlcik7XG4gICAgICAgIHZhciBpZHggPSAwO1xuICAgICAgICB3aGlsZSAoaWR4IDwgcHJvcHMubGVuZ3RoKSB7XG4gICAgICAgICAgICBkZXN0aW5hdGlvbltwcm9wc1tpZHhdXSA9IG90aGVyW3Byb3BzW2lkeF1dO1xuICAgICAgICAgICAgaWR4ICs9IDE7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRlc3RpbmF0aW9uO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBQcml2YXRlIGZ1bmN0aW9uIHRoYXQgZGV0ZXJtaW5lcyB3aGV0aGVyIG9yIG5vdCBhIHByb3ZpZGVkIG9iamVjdCBoYXMgYSBnaXZlbiBtZXRob2QuXG4gICAgICogRG9lcyBub3QgaWdub3JlIG1ldGhvZHMgc3RvcmVkIG9uIHRoZSBvYmplY3QncyBwcm90b3R5cGUgY2hhaW4uIFVzZWQgZm9yIGR5bmFtaWNhbGx5XG4gICAgICogZGlzcGF0Y2hpbmcgUmFtZGEgbWV0aG9kcyB0byBub24tQXJyYXkgb2JqZWN0cy5cbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IG1ldGhvZE5hbWUgVGhlIG5hbWUgb2YgdGhlIG1ldGhvZCB0byBjaGVjayBmb3IuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9iaiBUaGUgb2JqZWN0IHRvIHRlc3QuXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn0gYHRydWVgIGhhcyBhIGdpdmVuIG1ldGhvZCwgYGZhbHNlYCBvdGhlcndpc2UuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgdmFyIHBlcnNvbiA9IHsgbmFtZTogJ0pvaG4nIH07XG4gICAgICogICAgICBwZXJzb24uc2hvdXQgPSBmdW5jdGlvbigpIHsgYWxlcnQodGhpcy5uYW1lKTsgfTtcbiAgICAgKlxuICAgICAqICAgICAgX2hhc01ldGhvZCgnc2hvdXQnLCBwZXJzb24pOyAvLz0+IHRydWVcbiAgICAgKiAgICAgIF9oYXNNZXRob2QoJ2ZvbycsIHBlcnNvbik7IC8vPT4gZmFsc2VcbiAgICAgKi9cbiAgICB2YXIgX2hhc01ldGhvZCA9IGZ1bmN0aW9uIF9oYXNNZXRob2QobWV0aG9kTmFtZSwgb2JqKSB7XG4gICAgICAgIHJldHVybiBvYmogIT0gbnVsbCAmJiAhX2lzQXJyYXkob2JqKSAmJiB0eXBlb2Ygb2JqW21ldGhvZE5hbWVdID09PSAnZnVuY3Rpb24nO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBgX21ha2VGbGF0YCBpcyBhIGhlbHBlciBmdW5jdGlvbiB0aGF0IHJldHVybnMgYSBvbmUtbGV2ZWwgb3IgZnVsbHkgcmVjdXJzaXZlIGZ1bmN0aW9uXG4gICAgICogYmFzZWQgb24gdGhlIGZsYWcgcGFzc2VkIGluLlxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICB2YXIgX21ha2VGbGF0ID0gZnVuY3Rpb24gX21ha2VGbGF0KHJlY3Vyc2l2ZSkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gZmxhdHQobGlzdCkge1xuICAgICAgICAgICAgdmFyIHZhbHVlLCByZXN1bHQgPSBbXSwgaWR4ID0gMCwgajtcbiAgICAgICAgICAgIHdoaWxlIChpZHggPCBsaXN0Lmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGlmIChpc0FycmF5TGlrZShsaXN0W2lkeF0pKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gcmVjdXJzaXZlID8gZmxhdHQobGlzdFtpZHhdKSA6IGxpc3RbaWR4XTtcbiAgICAgICAgICAgICAgICAgICAgaiA9IDA7XG4gICAgICAgICAgICAgICAgICAgIHdoaWxlIChqIDwgdmFsdWUubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRbcmVzdWx0Lmxlbmd0aF0gPSB2YWx1ZVtqXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGogKz0gMTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdFtyZXN1bHQubGVuZ3RoXSA9IGxpc3RbaWR4XTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWR4ICs9IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9O1xuICAgIH07XG5cbiAgICB2YXIgX3JlZHVjZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZnVuY3Rpb24gX2FycmF5UmVkdWNlKHhmLCBhY2MsIGxpc3QpIHtcbiAgICAgICAgICAgIHZhciBpZHggPSAwO1xuICAgICAgICAgICAgd2hpbGUgKGlkeCA8IGxpc3QubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgYWNjID0geGZbJ0BAdHJhbnNkdWNlci9zdGVwJ10oYWNjLCBsaXN0W2lkeF0pO1xuICAgICAgICAgICAgICAgIGlmIChhY2MgJiYgYWNjWydAQHRyYW5zZHVjZXIvcmVkdWNlZCddKSB7XG4gICAgICAgICAgICAgICAgICAgIGFjYyA9IGFjY1snQEB0cmFuc2R1Y2VyL3ZhbHVlJ107XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZHggKz0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB4ZlsnQEB0cmFuc2R1Y2VyL3Jlc3VsdCddKGFjYyk7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gX2l0ZXJhYmxlUmVkdWNlKHhmLCBhY2MsIGl0ZXIpIHtcbiAgICAgICAgICAgIHZhciBzdGVwID0gaXRlci5uZXh0KCk7XG4gICAgICAgICAgICB3aGlsZSAoIXN0ZXAuZG9uZSkge1xuICAgICAgICAgICAgICAgIGFjYyA9IHhmWydAQHRyYW5zZHVjZXIvc3RlcCddKGFjYywgc3RlcC52YWx1ZSk7XG4gICAgICAgICAgICAgICAgaWYgKGFjYyAmJiBhY2NbJ0BAdHJhbnNkdWNlci9yZWR1Y2VkJ10pIHtcbiAgICAgICAgICAgICAgICAgICAgYWNjID0gYWNjWydAQHRyYW5zZHVjZXIvdmFsdWUnXTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHN0ZXAgPSBpdGVyLm5leHQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB4ZlsnQEB0cmFuc2R1Y2VyL3Jlc3VsdCddKGFjYyk7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gX21ldGhvZFJlZHVjZSh4ZiwgYWNjLCBvYmopIHtcbiAgICAgICAgICAgIHJldHVybiB4ZlsnQEB0cmFuc2R1Y2VyL3Jlc3VsdCddKG9iai5yZWR1Y2UoYmluZCh4ZlsnQEB0cmFuc2R1Y2VyL3N0ZXAnXSwgeGYpLCBhY2MpKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgc3ltSXRlcmF0b3IgPSB0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyA/IFN5bWJvbC5pdGVyYXRvciA6ICdAQGl0ZXJhdG9yJztcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIF9yZWR1Y2UoZm4sIGFjYywgbGlzdCkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBmbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgIGZuID0gX3h3cmFwKGZuKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpc0FycmF5TGlrZShsaXN0KSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBfYXJyYXlSZWR1Y2UoZm4sIGFjYywgbGlzdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodHlwZW9mIGxpc3QucmVkdWNlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIF9tZXRob2RSZWR1Y2UoZm4sIGFjYywgbGlzdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobGlzdFtzeW1JdGVyYXRvcl0gIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBfaXRlcmFibGVSZWR1Y2UoZm4sIGFjYywgbGlzdFtzeW1JdGVyYXRvcl0oKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodHlwZW9mIGxpc3QubmV4dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgIHJldHVybiBfaXRlcmFibGVSZWR1Y2UoZm4sIGFjYywgbGlzdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdyZWR1Y2U6IGxpc3QgbXVzdCBiZSBhcnJheSBvciBpdGVyYWJsZScpO1xuICAgICAgICB9O1xuICAgIH0oKTtcblxuICAgIHZhciBfeGFsbCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZnVuY3Rpb24gWEFsbChmLCB4Zikge1xuICAgICAgICAgICAgdGhpcy54ZiA9IHhmO1xuICAgICAgICAgICAgdGhpcy5mID0gZjtcbiAgICAgICAgICAgIHRoaXMuYWxsID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBYQWxsLnByb3RvdHlwZVsnQEB0cmFuc2R1Y2VyL2luaXQnXSA9IF94ZkJhc2UuaW5pdDtcbiAgICAgICAgWEFsbC5wcm90b3R5cGVbJ0BAdHJhbnNkdWNlci9yZXN1bHQnXSA9IGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmFsbCkge1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9IHRoaXMueGZbJ0BAdHJhbnNkdWNlci9zdGVwJ10ocmVzdWx0LCB0cnVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzLnhmWydAQHRyYW5zZHVjZXIvcmVzdWx0J10ocmVzdWx0KTtcbiAgICAgICAgfTtcbiAgICAgICAgWEFsbC5wcm90b3R5cGVbJ0BAdHJhbnNkdWNlci9zdGVwJ10gPSBmdW5jdGlvbiAocmVzdWx0LCBpbnB1dCkge1xuICAgICAgICAgICAgaWYgKCF0aGlzLmYoaW5wdXQpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hbGwgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBfcmVkdWNlZCh0aGlzLnhmWydAQHRyYW5zZHVjZXIvc3RlcCddKHJlc3VsdCwgZmFsc2UpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBfY3VycnkyKGZ1bmN0aW9uIF94YWxsKGYsIHhmKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFhBbGwoZiwgeGYpO1xuICAgICAgICB9KTtcbiAgICB9KCk7XG5cbiAgICB2YXIgX3hhbnkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGZ1bmN0aW9uIFhBbnkoZiwgeGYpIHtcbiAgICAgICAgICAgIHRoaXMueGYgPSB4ZjtcbiAgICAgICAgICAgIHRoaXMuZiA9IGY7XG4gICAgICAgICAgICB0aGlzLmFueSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIFhBbnkucHJvdG90eXBlWydAQHRyYW5zZHVjZXIvaW5pdCddID0gX3hmQmFzZS5pbml0O1xuICAgICAgICBYQW55LnByb3RvdHlwZVsnQEB0cmFuc2R1Y2VyL3Jlc3VsdCddID0gZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgICAgaWYgKCF0aGlzLmFueSkge1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9IHRoaXMueGZbJ0BAdHJhbnNkdWNlci9zdGVwJ10ocmVzdWx0LCBmYWxzZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcy54ZlsnQEB0cmFuc2R1Y2VyL3Jlc3VsdCddKHJlc3VsdCk7XG4gICAgICAgIH07XG4gICAgICAgIFhBbnkucHJvdG90eXBlWydAQHRyYW5zZHVjZXIvc3RlcCddID0gZnVuY3Rpb24gKHJlc3VsdCwgaW5wdXQpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmYoaW5wdXQpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hbnkgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9IF9yZWR1Y2VkKHRoaXMueGZbJ0BAdHJhbnNkdWNlci9zdGVwJ10ocmVzdWx0LCB0cnVlKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gX2N1cnJ5MihmdW5jdGlvbiBfeGFueShmLCB4Zikge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBYQW55KGYsIHhmKTtcbiAgICAgICAgfSk7XG4gICAgfSgpO1xuXG4gICAgdmFyIF94ZHJvcCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZnVuY3Rpb24gWERyb3AobiwgeGYpIHtcbiAgICAgICAgICAgIHRoaXMueGYgPSB4ZjtcbiAgICAgICAgICAgIHRoaXMubiA9IG47XG4gICAgICAgIH1cbiAgICAgICAgWERyb3AucHJvdG90eXBlWydAQHRyYW5zZHVjZXIvaW5pdCddID0gX3hmQmFzZS5pbml0O1xuICAgICAgICBYRHJvcC5wcm90b3R5cGVbJ0BAdHJhbnNkdWNlci9yZXN1bHQnXSA9IF94ZkJhc2UucmVzdWx0O1xuICAgICAgICBYRHJvcC5wcm90b3R5cGUuc3RlcCA9IGZ1bmN0aW9uIChyZXN1bHQsIGlucHV0KSB7XG4gICAgICAgICAgICBpZiAodGhpcy5uID4gMCkge1xuICAgICAgICAgICAgICAgIHRoaXMubiAtPSAxO1xuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcy54ZlsnQEB0cmFuc2R1Y2VyL3N0ZXAnXShyZXN1bHQsIGlucHV0KTtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIF9jdXJyeTIoZnVuY3Rpb24gX3hkcm9wKG4sIHhmKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFhEcm9wKG4sIHhmKTtcbiAgICAgICAgfSk7XG4gICAgfSgpO1xuXG4gICAgdmFyIF94ZHJvcFdoaWxlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBmdW5jdGlvbiBYRHJvcFdoaWxlKGYsIHhmKSB7XG4gICAgICAgICAgICB0aGlzLnhmID0geGY7XG4gICAgICAgICAgICB0aGlzLmYgPSBmO1xuICAgICAgICB9XG4gICAgICAgIFhEcm9wV2hpbGUucHJvdG90eXBlWydAQHRyYW5zZHVjZXIvaW5pdCddID0gX3hmQmFzZS5pbml0O1xuICAgICAgICBYRHJvcFdoaWxlLnByb3RvdHlwZVsnQEB0cmFuc2R1Y2VyL3Jlc3VsdCddID0gX3hmQmFzZS5yZXN1bHQ7XG4gICAgICAgIFhEcm9wV2hpbGUucHJvdG90eXBlWydAQHRyYW5zZHVjZXIvc3RlcCddID0gZnVuY3Rpb24gKHJlc3VsdCwgaW5wdXQpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmYpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5mKGlucHV0KSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLmYgPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMueGZbJ0BAdHJhbnNkdWNlci9zdGVwJ10ocmVzdWx0LCBpbnB1dCk7XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBfY3VycnkyKGZ1bmN0aW9uIF94ZHJvcFdoaWxlKGYsIHhmKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFhEcm9wV2hpbGUoZiwgeGYpO1xuICAgICAgICB9KTtcbiAgICB9KCk7XG5cbiAgICB2YXIgX3hncm91cEJ5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBmdW5jdGlvbiBYR3JvdXBCeShmLCB4Zikge1xuICAgICAgICAgICAgdGhpcy54ZiA9IHhmO1xuICAgICAgICAgICAgdGhpcy5mID0gZjtcbiAgICAgICAgICAgIHRoaXMuaW5wdXRzID0ge307XG4gICAgICAgIH1cbiAgICAgICAgWEdyb3VwQnkucHJvdG90eXBlWydAQHRyYW5zZHVjZXIvaW5pdCddID0gX3hmQmFzZS5pbml0O1xuICAgICAgICBYR3JvdXBCeS5wcm90b3R5cGVbJ0BAdHJhbnNkdWNlci9yZXN1bHQnXSA9IGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICAgIHZhciBrZXk7XG4gICAgICAgICAgICBmb3IgKGtleSBpbiB0aGlzLmlucHV0cykge1xuICAgICAgICAgICAgICAgIGlmIChfaGFzKGtleSwgdGhpcy5pbnB1dHMpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IHRoaXMueGZbJ0BAdHJhbnNkdWNlci9zdGVwJ10ocmVzdWx0LCB0aGlzLmlucHV0c1trZXldKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdFsnQEB0cmFuc2R1Y2VyL3JlZHVjZWQnXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gcmVzdWx0WydAQHRyYW5zZHVjZXIvdmFsdWUnXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMueGZbJ0BAdHJhbnNkdWNlci9yZXN1bHQnXShyZXN1bHQpO1xuICAgICAgICB9O1xuICAgICAgICBYR3JvdXBCeS5wcm90b3R5cGVbJ0BAdHJhbnNkdWNlci9zdGVwJ10gPSBmdW5jdGlvbiAocmVzdWx0LCBpbnB1dCkge1xuICAgICAgICAgICAgdmFyIGtleSA9IHRoaXMuZihpbnB1dCk7XG4gICAgICAgICAgICB0aGlzLmlucHV0c1trZXldID0gdGhpcy5pbnB1dHNba2V5XSB8fCBbXG4gICAgICAgICAgICAgICAga2V5LFxuICAgICAgICAgICAgICAgIFtdXG4gICAgICAgICAgICBdO1xuICAgICAgICAgICAgdGhpcy5pbnB1dHNba2V5XVsxXSA9IF9hcHBlbmQoaW5wdXQsIHRoaXMuaW5wdXRzW2tleV1bMV0pO1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIF9jdXJyeTIoZnVuY3Rpb24gX3hncm91cEJ5KGYsIHhmKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFhHcm91cEJ5KGYsIHhmKTtcbiAgICAgICAgfSk7XG4gICAgfSgpO1xuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBgdHJ1ZWAgaWYgYWxsIGVsZW1lbnRzIG9mIHRoZSBsaXN0IG1hdGNoIHRoZSBwcmVkaWNhdGUsIGBmYWxzZWAgaWYgdGhlcmUgYXJlIGFueVxuICAgICAqIHRoYXQgZG9uJ3QuXG4gICAgICpcbiAgICAgKiBBY3RzIGFzIGEgdHJhbnNkdWNlciBpZiBhIHRyYW5zZm9ybWVyIGlzIGdpdmVuIGluIGxpc3QgcG9zaXRpb24uXG4gICAgICogQHNlZSBSLnRyYW5zZHVjZVxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBMaXN0XG4gICAgICogQHNpZyAoYSAtPiBCb29sZWFuKSAtPiBbYV0gLT4gQm9vbGVhblxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBwcmVkaWNhdGUgZnVuY3Rpb24uXG4gICAgICogQHBhcmFtIHtBcnJheX0gbGlzdCBUaGUgYXJyYXkgdG8gY29uc2lkZXIuXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn0gYHRydWVgIGlmIHRoZSBwcmVkaWNhdGUgaXMgc2F0aXNmaWVkIGJ5IGV2ZXJ5IGVsZW1lbnQsIGBmYWxzZWBcbiAgICAgKiAgICAgICAgIG90aGVyd2lzZS5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICB2YXIgbGVzc1RoYW4yID0gUi5mbGlwKFIubHQpKDIpO1xuICAgICAqICAgICAgdmFyIGxlc3NUaGFuMyA9IFIuZmxpcChSLmx0KSgzKTtcbiAgICAgKiAgICAgIFIuYWxsKGxlc3NUaGFuMikoWzEsIDJdKTsgLy89PiBmYWxzZVxuICAgICAqICAgICAgUi5hbGwobGVzc1RoYW4zKShbMSwgMl0pOyAvLz0+IHRydWVcbiAgICAgKi9cbiAgICB2YXIgYWxsID0gX2N1cnJ5MihfZGlzcGF0Y2hhYmxlKCdhbGwnLCBfeGFsbCwgX2FsbCkpO1xuXG4gICAgLyoqXG4gICAgICogQSBmdW5jdGlvbiB0aGF0IHJldHVybnMgdGhlIGZpcnN0IGFyZ3VtZW50IGlmIGl0J3MgZmFsc3kgb3RoZXJ3aXNlIHRoZSBzZWNvbmRcbiAgICAgKiBhcmd1bWVudC4gTm90ZSB0aGF0IHRoaXMgaXMgTk9UIHNob3J0LWNpcmN1aXRlZCwgbWVhbmluZyB0aGF0IGlmIGV4cHJlc3Npb25zXG4gICAgICogYXJlIHBhc3NlZCB0aGV5IGFyZSBib3RoIGV2YWx1YXRlZC5cbiAgICAgKlxuICAgICAqIERpc3BhdGNoZXMgdG8gdGhlIGBhbmRgIG1ldGhvZCBvZiB0aGUgZmlyc3QgYXJndW1lbnQgaWYgYXBwbGljYWJsZS5cbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgTG9naWNcbiAgICAgKiBAc2lnICogLT4gKiAtPiAqXG4gICAgICogQHBhcmFtIHsqfSBhIGFueSB2YWx1ZVxuICAgICAqIEBwYXJhbSB7Kn0gYiBhbnkgb3RoZXIgdmFsdWVcbiAgICAgKiBAcmV0dXJuIHsqfSB0aGUgZmlyc3QgYXJndW1lbnQgaWYgZmFsc3kgb3RoZXJ3aXNlIHRoZSBzZWNvbmQgYXJndW1lbnQuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgUi5hbmQoZmFsc2UsIHRydWUpOyAvLz0+IGZhbHNlXG4gICAgICogICAgICBSLmFuZCgwLCBbXSk7IC8vPT4gMFxuICAgICAqICAgICAgUi5hbmQobnVsbCwgJycpOyA9PiBudWxsXG4gICAgICovXG4gICAgdmFyIGFuZCA9IF9jdXJyeTIoZnVuY3Rpb24gYW5kKGEsIGIpIHtcbiAgICAgICAgcmV0dXJuIF9oYXNNZXRob2QoJ2FuZCcsIGEpID8gYS5hbmQoYikgOiBhICYmIGI7XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGB0cnVlYCBpZiBhdCBsZWFzdCBvbmUgb2YgZWxlbWVudHMgb2YgdGhlIGxpc3QgbWF0Y2ggdGhlIHByZWRpY2F0ZSwgYGZhbHNlYFxuICAgICAqIG90aGVyd2lzZS5cbiAgICAgKlxuICAgICAqIEFjdHMgYXMgYSB0cmFuc2R1Y2VyIGlmIGEgdHJhbnNmb3JtZXIgaXMgZ2l2ZW4gaW4gbGlzdCBwb3NpdGlvbi5cbiAgICAgKiBAc2VlIFIudHJhbnNkdWNlXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IExpc3RcbiAgICAgKiBAc2lnIChhIC0+IEJvb2xlYW4pIC0+IFthXSAtPiBCb29sZWFuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIHByZWRpY2F0ZSBmdW5jdGlvbi5cbiAgICAgKiBAcGFyYW0ge0FycmF5fSBsaXN0IFRoZSBhcnJheSB0byBjb25zaWRlci5cbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufSBgdHJ1ZWAgaWYgdGhlIHByZWRpY2F0ZSBpcyBzYXRpc2ZpZWQgYnkgYXQgbGVhc3Qgb25lIGVsZW1lbnQsIGBmYWxzZWBcbiAgICAgKiAgICAgICAgIG90aGVyd2lzZS5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICB2YXIgbGVzc1RoYW4wID0gUi5mbGlwKFIubHQpKDApO1xuICAgICAqICAgICAgdmFyIGxlc3NUaGFuMiA9IFIuZmxpcChSLmx0KSgyKTtcbiAgICAgKiAgICAgIFIuYW55KGxlc3NUaGFuMCkoWzEsIDJdKTsgLy89PiBmYWxzZVxuICAgICAqICAgICAgUi5hbnkobGVzc1RoYW4yKShbMSwgMl0pOyAvLz0+IHRydWVcbiAgICAgKi9cbiAgICB2YXIgYW55ID0gX2N1cnJ5MihfZGlzcGF0Y2hhYmxlKCdhbnknLCBfeGFueSwgX2FueSkpO1xuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhIG5ldyBsaXN0IGNvbnRhaW5pbmcgdGhlIGNvbnRlbnRzIG9mIHRoZSBnaXZlbiBsaXN0LCBmb2xsb3dlZCBieSB0aGUgZ2l2ZW5cbiAgICAgKiBlbGVtZW50LlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBMaXN0XG4gICAgICogQHNpZyBhIC0+IFthXSAtPiBbYV1cbiAgICAgKiBAcGFyYW0geyp9IGVsIFRoZSBlbGVtZW50IHRvIGFkZCB0byB0aGUgZW5kIG9mIHRoZSBuZXcgbGlzdC5cbiAgICAgKiBAcGFyYW0ge0FycmF5fSBsaXN0IFRoZSBsaXN0IHdob3NlIGNvbnRlbnRzIHdpbGwgYmUgYWRkZWQgdG8gdGhlIGJlZ2lubmluZyBvZiB0aGUgb3V0cHV0XG4gICAgICogICAgICAgIGxpc3QuXG4gICAgICogQHJldHVybiB7QXJyYXl9IEEgbmV3IGxpc3QgY29udGFpbmluZyB0aGUgY29udGVudHMgb2YgdGhlIG9sZCBsaXN0IGZvbGxvd2VkIGJ5IGBlbGAuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgUi5hcHBlbmQoJ3Rlc3RzJywgWyd3cml0ZScsICdtb3JlJ10pOyAvLz0+IFsnd3JpdGUnLCAnbW9yZScsICd0ZXN0cyddXG4gICAgICogICAgICBSLmFwcGVuZCgndGVzdHMnLCBbXSk7IC8vPT4gWyd0ZXN0cyddXG4gICAgICogICAgICBSLmFwcGVuZChbJ3Rlc3RzJ10sIFsnd3JpdGUnLCAnbW9yZSddKTsgLy89PiBbJ3dyaXRlJywgJ21vcmUnLCBbJ3Rlc3RzJ11dXG4gICAgICovXG4gICAgdmFyIGFwcGVuZCA9IF9jdXJyeTIoX2FwcGVuZCk7XG5cbiAgICAvKipcbiAgICAgKiBNYWtlcyBhIHNoYWxsb3cgY2xvbmUgb2YgYW4gb2JqZWN0LCBzZXR0aW5nIG9yIG92ZXJyaWRpbmcgdGhlIG5vZGVzXG4gICAgICogcmVxdWlyZWQgdG8gY3JlYXRlIHRoZSBnaXZlbiBwYXRoLCBhbmQgcGxhY2luZyB0aGUgc3BlY2lmaWMgdmFsdWUgYXQgdGhlXG4gICAgICogdGFpbCBlbmQgb2YgdGhhdCBwYXRoLiAgTm90ZSB0aGF0IHRoaXMgY29waWVzIGFuZCBmbGF0dGVucyBwcm90b3R5cGVcbiAgICAgKiBwcm9wZXJ0aWVzIG9udG8gdGhlIG5ldyBvYmplY3QgYXMgd2VsbC4gIEFsbCBub24tcHJpbWl0aXZlIHByb3BlcnRpZXNcbiAgICAgKiBhcmUgY29waWVkIGJ5IHJlZmVyZW5jZS5cbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgT2JqZWN0XG4gICAgICogQHNpZyBbU3RyaW5nXSAtPiBhIC0+IHtrOiB2fSAtPiB7azogdn1cbiAgICAgKiBAcGFyYW0ge0FycmF5fSBwYXRoIHRoZSBwYXRoIHRvIHNldFxuICAgICAqIEBwYXJhbSB7Kn0gdmFsIHRoZSBuZXcgdmFsdWVcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb2JqIHRoZSBvYmplY3QgdG8gY2xvbmVcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IGEgbmV3IG9iamVjdCBzaW1pbGFyIHRvIHRoZSBvcmlnaW5hbCBleGNlcHQgYWxvbmcgdGhlIHNwZWNpZmllZCBwYXRoLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIFIuYXNzb2NQYXRoKFsnYScsICdiJywgJ2MnXSwgNDIsIHthOiB7Yjoge2M6IDB9fX0pOyAvLz0+IHthOiB7Yjoge2M6IDQyfX19XG4gICAgICovXG4gICAgdmFyIGFzc29jUGF0aCA9IF9jdXJyeTMoX2Fzc29jUGF0aCk7XG5cbiAgICAvKipcbiAgICAgKiBXcmFwcyBhIGZ1bmN0aW9uIG9mIGFueSBhcml0eSAoaW5jbHVkaW5nIG51bGxhcnkpIGluIGEgZnVuY3Rpb24gdGhhdCBhY2NlcHRzIGV4YWN0bHkgMlxuICAgICAqIHBhcmFtZXRlcnMuIEFueSBleHRyYW5lb3VzIHBhcmFtZXRlcnMgd2lsbCBub3QgYmUgcGFzc2VkIHRvIHRoZSBzdXBwbGllZCBmdW5jdGlvbi5cbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgRnVuY3Rpb25cbiAgICAgKiBAc2lnICgqIC0+IGMpIC0+IChhLCBiIC0+IGMpXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGZ1bmN0aW9uIHRvIHdyYXAuXG4gICAgICogQHJldHVybiB7RnVuY3Rpb259IEEgbmV3IGZ1bmN0aW9uIHdyYXBwaW5nIGBmbmAuIFRoZSBuZXcgZnVuY3Rpb24gaXMgZ3VhcmFudGVlZCB0byBiZSBvZlxuICAgICAqICAgICAgICAgYXJpdHkgMi5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICB2YXIgdGFrZXNUaHJlZUFyZ3MgPSBmdW5jdGlvbihhLCBiLCBjKSB7XG4gICAgICogICAgICAgIHJldHVybiBbYSwgYiwgY107XG4gICAgICogICAgICB9O1xuICAgICAqICAgICAgdGFrZXNUaHJlZUFyZ3MubGVuZ3RoOyAvLz0+IDNcbiAgICAgKiAgICAgIHRha2VzVGhyZWVBcmdzKDEsIDIsIDMpOyAvLz0+IFsxLCAyLCAzXVxuICAgICAqXG4gICAgICogICAgICB2YXIgdGFrZXNUd29BcmdzID0gUi5iaW5hcnkodGFrZXNUaHJlZUFyZ3MpO1xuICAgICAqICAgICAgdGFrZXNUd29BcmdzLmxlbmd0aDsgLy89PiAyXG4gICAgICogICAgICAvLyBPbmx5IDIgYXJndW1lbnRzIGFyZSBwYXNzZWQgdG8gdGhlIHdyYXBwZWQgZnVuY3Rpb25cbiAgICAgKiAgICAgIHRha2VzVHdvQXJncygxLCAyLCAzKTsgLy89PiBbMSwgMiwgdW5kZWZpbmVkXVxuICAgICAqL1xuICAgIHZhciBiaW5hcnkgPSBfY3VycnkxKGZ1bmN0aW9uIGJpbmFyeShmbikge1xuICAgICAgICByZXR1cm4gbkFyeSgyLCBmbik7XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgZGVlcCBjb3B5IG9mIHRoZSB2YWx1ZSB3aGljaCBtYXkgY29udGFpbiAobmVzdGVkKSBgQXJyYXlgcyBhbmRcbiAgICAgKiBgT2JqZWN0YHMsIGBOdW1iZXJgcywgYFN0cmluZ2BzLCBgQm9vbGVhbmBzIGFuZCBgRGF0ZWBzLiBgRnVuY3Rpb25gcyBhcmVcbiAgICAgKiBub3QgY29waWVkLCBidXQgYXNzaWduZWQgYnkgdGhlaXIgcmVmZXJlbmNlLlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBPYmplY3RcbiAgICAgKiBAc2lnIHsqfSAtPiB7Kn1cbiAgICAgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSBvYmplY3Qgb3IgYXJyYXkgdG8gY2xvbmVcbiAgICAgKiBAcmV0dXJuIHsqfSBBIG5ldyBvYmplY3Qgb3IgYXJyYXkuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgdmFyIG9iamVjdHMgPSBbe30sIHt9LCB7fV07XG4gICAgICogICAgICB2YXIgb2JqZWN0c0Nsb25lID0gUi5jbG9uZShvYmplY3RzKTtcbiAgICAgKiAgICAgIG9iamVjdHNbMF0gPT09IG9iamVjdHNDbG9uZVswXTsgLy89PiBmYWxzZVxuICAgICAqL1xuICAgIHZhciBjbG9uZSA9IF9jdXJyeTEoZnVuY3Rpb24gY2xvbmUodmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIF9iYXNlQ29weSh2YWx1ZSwgW10sIFtdKTtcbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSBuZXcgZnVuY3Rpb24gdGhhdCBydW5zIGVhY2ggb2YgdGhlIGZ1bmN0aW9ucyBzdXBwbGllZCBhcyBwYXJhbWV0ZXJzIGluIHR1cm4sXG4gICAgICogcGFzc2luZyB0aGUgcmV0dXJuIHZhbHVlIG9mIGVhY2ggZnVuY3Rpb24gaW52b2NhdGlvbiB0byB0aGUgbmV4dCBmdW5jdGlvbiBpbnZvY2F0aW9uLFxuICAgICAqIGJlZ2lubmluZyB3aXRoIHdoYXRldmVyIGFyZ3VtZW50cyB3ZXJlIHBhc3NlZCB0byB0aGUgaW5pdGlhbCBpbnZvY2F0aW9uLlxuICAgICAqXG4gICAgICogTm90ZSB0aGF0IGBjb21wb3NlYCBpcyBhIHJpZ2h0LWFzc29jaWF0aXZlIGZ1bmN0aW9uLCB3aGljaCBtZWFucyB0aGUgZnVuY3Rpb25zIHByb3ZpZGVkXG4gICAgICogd2lsbCBiZSBpbnZva2VkIGluIG9yZGVyIGZyb20gcmlnaHQgdG8gbGVmdC4gSW4gdGhlIGV4YW1wbGUgYHZhciBoID0gY29tcG9zZShmLCBnKWAsXG4gICAgICogdGhlIGZ1bmN0aW9uIGBoYCBpcyBlcXVpdmFsZW50IHRvIGBmKCBnKHgpIClgLCB3aGVyZSBgeGAgcmVwcmVzZW50cyB0aGUgYXJndW1lbnRzXG4gICAgICogb3JpZ2luYWxseSBwYXNzZWQgdG8gYGhgLlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBGdW5jdGlvblxuICAgICAqIEBzaWcgKCh5IC0+IHopLCAoeCAtPiB5KSwgLi4uLCAoYiAtPiBjKSwgKGEuLi4gLT4gYikpIC0+IChhLi4uIC0+IHopXG4gICAgICogQHBhcmFtIHsuLi5GdW5jdGlvbn0gZnVuY3Rpb25zIEEgdmFyaWFibGUgbnVtYmVyIG9mIGZ1bmN0aW9ucy5cbiAgICAgKiBAcmV0dXJuIHtGdW5jdGlvbn0gQSBuZXcgZnVuY3Rpb24gd2hpY2ggcmVwcmVzZW50cyB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgZWFjaCBvZiB0aGVcbiAgICAgKiAgICAgICAgIGlucHV0IGBmdW5jdGlvbnNgLCBwYXNzaW5nIHRoZSByZXN1bHQgb2YgZWFjaCBmdW5jdGlvbiBjYWxsIHRvIHRoZSBuZXh0LCBmcm9tXG4gICAgICogICAgICAgICByaWdodCB0byBsZWZ0LlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIHZhciB0cmlwbGUgPSBmdW5jdGlvbih4KSB7IHJldHVybiB4ICogMzsgfTtcbiAgICAgKiAgICAgIHZhciBkb3VibGUgPSBmdW5jdGlvbih4KSB7IHJldHVybiB4ICogMjsgfTtcbiAgICAgKiAgICAgIHZhciBzcXVhcmUgPSBmdW5jdGlvbih4KSB7IHJldHVybiB4ICogeDsgfTtcbiAgICAgKiAgICAgIHZhciBzcXVhcmVUaGVuRG91YmxlVGhlblRyaXBsZSA9IFIuY29tcG9zZSh0cmlwbGUsIGRvdWJsZSwgc3F1YXJlKTtcbiAgICAgKlxuICAgICAqICAgICAgLy/iiYUgdHJpcGxlKGRvdWJsZShzcXVhcmUoNSkpKVxuICAgICAqICAgICAgc3F1YXJlVGhlbkRvdWJsZVRoZW5UcmlwbGUoNSk7IC8vPT4gMTUwXG4gICAgICovXG4gICAgdmFyIGNvbXBvc2UgPSBfY3JlYXRlQ29tcG9zZXIoX2NvbXBvc2UpO1xuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIG5ldyBsZW5zIHRoYXQgYWxsb3dzIGdldHRpbmcgYW5kIHNldHRpbmcgdmFsdWVzIG9mIG5lc3RlZCBwcm9wZXJ0aWVzLCBieVxuICAgICAqIGZvbGxvd2luZyBlYWNoIGdpdmVuIGxlbnMgaW4gc3VjY2Vzc2lvbi5cbiAgICAgKlxuICAgICAqIE5vdGUgdGhhdCBgY29tcG9zZUxgIGlzIGEgcmlnaHQtYXNzb2NpYXRpdmUgZnVuY3Rpb24sIHdoaWNoIG1lYW5zIHRoZSBsZW5zZXMgcHJvdmlkZWRcbiAgICAgKiB3aWxsIGJlIGludm9rZWQgaW4gb3JkZXIgZnJvbSByaWdodCB0byBsZWZ0LlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBGdW5jdGlvblxuICAgICAqIEBzZWUgUi5sZW5zXG4gICAgICogQHNpZyAoKHkgLT4geiksICh4IC0+IHkpLCAuLi4sIChiIC0+IGMpLCAoYSAtPiBiKSkgLT4gKGEgLT4geilcbiAgICAgKiBAcGFyYW0gey4uLkZ1bmN0aW9ufSBsZW5zZXMgQSB2YXJpYWJsZSBudW1iZXIgb2YgbGVuc2VzLlxuICAgICAqIEByZXR1cm4ge0Z1bmN0aW9ufSBBIG5ldyBsZW5zIHdoaWNoIHJlcHJlc2VudHMgdGhlIHJlc3VsdCBvZiBjYWxsaW5nIGVhY2ggb2YgdGhlXG4gICAgICogICAgICAgICBpbnB1dCBgbGVuc2VzYCwgcGFzc2luZyB0aGUgcmVzdWx0IG9mIGVhY2ggZ2V0dGVyL3NldHRlciBhcyB0aGUgc291cmNlXG4gICAgICogICAgICAgICB0byB0aGUgbmV4dCwgZnJvbSByaWdodCB0byBsZWZ0LlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIHZhciBoZWFkTGVucyA9IFIubGVuc0luZGV4KDApO1xuICAgICAqICAgICAgdmFyIHNlY29uZExlbnMgPSBSLmxlbnNJbmRleCgxKTtcbiAgICAgKiAgICAgIHZhciB4TGVucyA9IFIubGVuc1Byb3AoJ3gnKTtcbiAgICAgKiAgICAgIHZhciBzZWNvbmRPZlhPZkhlYWRMZW5zID0gUi5jb21wb3NlTChzZWNvbmRMZW5zLCB4TGVucywgaGVhZExlbnMpO1xuICAgICAqXG4gICAgICogICAgICB2YXIgc291cmNlID0gW3t4OiBbMCwgMV0sIHk6IFsyLCAzXX0sIHt4OiBbNCwgNV0sIHk6IFs2LCA3XX1dO1xuICAgICAqICAgICAgc2Vjb25kT2ZYT2ZIZWFkTGVucyhzb3VyY2UpOyAvLz0+IDFcbiAgICAgKiAgICAgIHNlY29uZE9mWE9mSGVhZExlbnMuc2V0KDEyMywgc291cmNlKTsgLy89PiBbe3g6IFswLCAxMjNdLCB5OiBbMiwgM119LCB7eDogWzQsIDVdLCB5OiBbNiwgN119XVxuICAgICAqL1xuICAgIHZhciBjb21wb3NlTCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGZuID0gYXJndW1lbnRzW2FyZ3VtZW50cy5sZW5ndGggLSAxXTtcbiAgICAgICAgdmFyIGlkeCA9IGFyZ3VtZW50cy5sZW5ndGggLSAyO1xuICAgICAgICB3aGlsZSAoaWR4ID49IDApIHtcbiAgICAgICAgICAgIGZuID0gX2NvbXBvc2VMKGFyZ3VtZW50c1tpZHhdLCBmbik7XG4gICAgICAgICAgICBpZHggLT0gMTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZm47XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFNpbWlsYXIgdG8gYGNvbXBvc2VgIGJ1dCB3aXRoIGF1dG9tYXRpYyBoYW5kbGluZyBvZiBwcm9taXNlcyAob3IsIG1vcmVcbiAgICAgKiBwcmVjaXNlbHksIFwidGhlbmFibGVzXCIpLiBUaGUgYmVoYXZpb3IgaXMgaWRlbnRpY2FsICB0byB0aGF0IG9mXG4gICAgICogY29tcG9zZSgpIGlmIGFsbCBjb21wb3NlZCBmdW5jdGlvbnMgcmV0dXJuIHNvbWV0aGluZyBvdGhlciB0aGFuXG4gICAgICogcHJvbWlzZXMgKGkuZS4sIG9iamVjdHMgd2l0aCBhIC50aGVuKCkgbWV0aG9kKS4gSWYgb25lIG9mIHRoZSBmdW5jdGlvblxuICAgICAqIHJldHVybnMgYSBwcm9taXNlLCBob3dldmVyLCB0aGVuIHRoZSBuZXh0IGZ1bmN0aW9uIGluIHRoZSBjb21wb3NpdGlvblxuICAgICAqIGlzIGNhbGxlZCBhc3luY2hyb25vdXNseSwgaW4gdGhlIHN1Y2Nlc3MgY2FsbGJhY2sgb2YgdGhlIHByb21pc2UsIHVzaW5nXG4gICAgICogdGhlIHJlc29sdmVkIHZhbHVlIGFzIGFuIGlucHV0LiBOb3RlIHRoYXQgYGNvbXBvc2VQYCBpcyBhIHJpZ2h0LVxuICAgICAqIGFzc29jaWF0aXZlIGZ1bmN0aW9uLCBqdXN0IGxpa2UgYGNvbXBvc2VgLlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBGdW5jdGlvblxuICAgICAqIEBzaWcgKCh5IC0+IHopLCAoeCAtPiB5KSwgLi4uLCAoYiAtPiBjKSwgKGEuLi4gLT4gYikpIC0+IChhLi4uIC0+IHopXG4gICAgICogQHBhcmFtIHsuLi5GdW5jdGlvbn0gZnVuY3Rpb25zIEEgdmFyaWFibGUgbnVtYmVyIG9mIGZ1bmN0aW9ucy5cbiAgICAgKiBAcmV0dXJuIHtGdW5jdGlvbn0gQSBuZXcgZnVuY3Rpb24gd2hpY2ggcmVwcmVzZW50cyB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgZWFjaCBvZiB0aGVcbiAgICAgKiAgICAgICAgIGlucHV0IGBmdW5jdGlvbnNgLCBwYXNzaW5nIGVpdGhlciB0aGUgcmV0dXJuZWQgcmVzdWx0IG9yIHRoZSBhc3luY2hyb25vdXNseVxuICAgICAqICAgICAgICAgcmVzb2x2ZWQgdmFsdWUpIG9mIGVhY2ggZnVuY3Rpb24gY2FsbCB0byB0aGUgbmV4dCwgZnJvbSByaWdodCB0byBsZWZ0LlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIHZhciBRID0gcmVxdWlyZSgncScpO1xuICAgICAqICAgICAgdmFyIHRyaXBsZSA9IGZ1bmN0aW9uKHgpIHsgcmV0dXJuIHggKiAzOyB9O1xuICAgICAqICAgICAgdmFyIGRvdWJsZSA9IGZ1bmN0aW9uKHgpIHsgcmV0dXJuIHggKiAyOyB9O1xuICAgICAqICAgICAgdmFyIHNxdWFyZUFzeW5jID0gZnVuY3Rpb24oeCkgeyByZXR1cm4gUS53aGVuKHggKiB4KTsgfTtcbiAgICAgKiAgICAgIHZhciBzcXVhcmVBc3luY1RoZW5Eb3VibGVUaGVuVHJpcGxlID0gUi5jb21wb3NlUCh0cmlwbGUsIGRvdWJsZSwgc3F1YXJlQXN5bmMpO1xuICAgICAqXG4gICAgICogICAgICAvL+KJhSBzcXVhcmVBc3luYyg1KS50aGVuKGZ1bmN0aW9uKHgpIHsgcmV0dXJuIHRyaXBsZShkb3VibGUoeCkpIH07XG4gICAgICogICAgICBzcXVhcmVBc3luY1RoZW5Eb3VibGVUaGVuVHJpcGxlKDUpXG4gICAgICogICAgICAgIC50aGVuKGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgICAqICAgICAgICAgIC8vIHJlc3VsdCBpcyAxNTBcbiAgICAgKiAgICAgICAgfSk7XG4gICAgICovXG4gICAgdmFyIGNvbXBvc2VQID0gX2NyZWF0ZUNvbXBvc2VyKF9jb21wb3NlUCk7XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGEgbmV3IGxpc3QgY29uc2lzdGluZyBvZiB0aGUgZWxlbWVudHMgb2YgdGhlIGZpcnN0IGxpc3QgZm9sbG93ZWQgYnkgdGhlIGVsZW1lbnRzXG4gICAgICogb2YgdGhlIHNlY29uZC5cbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgTGlzdFxuICAgICAqIEBzaWcgW2FdIC0+IFthXSAtPiBbYV1cbiAgICAgKiBAcGFyYW0ge0FycmF5fSBsaXN0MSBUaGUgZmlyc3QgbGlzdCB0byBtZXJnZS5cbiAgICAgKiBAcGFyYW0ge0FycmF5fSBsaXN0MiBUaGUgc2Vjb25kIHNldCB0byBtZXJnZS5cbiAgICAgKiBAcmV0dXJuIHtBcnJheX0gQSBuZXcgYXJyYXkgY29uc2lzdGluZyBvZiB0aGUgY29udGVudHMgb2YgYGxpc3QxYCBmb2xsb3dlZCBieSB0aGVcbiAgICAgKiAgICAgICAgIGNvbnRlbnRzIG9mIGBsaXN0MmAuIElmLCBpbnN0ZWFkIG9mIGFuIEFycmF5IGZvciBgbGlzdDFgLCB5b3UgcGFzcyBhblxuICAgICAqICAgICAgICAgb2JqZWN0IHdpdGggYSBgY29uY2F0YCBtZXRob2Qgb24gaXQsIGBjb25jYXRgIHdpbGwgY2FsbCBgbGlzdDEuY29uY2F0YFxuICAgICAqICAgICAgICAgYW5kIHBhc3MgaXQgdGhlIHZhbHVlIG9mIGBsaXN0MmAuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICBSLmNvbmNhdChbXSwgW10pOyAvLz0+IFtdXG4gICAgICogICAgICBSLmNvbmNhdChbNCwgNSwgNl0sIFsxLCAyLCAzXSk7IC8vPT4gWzQsIDUsIDYsIDEsIDIsIDNdXG4gICAgICogICAgICBSLmNvbmNhdCgnQUJDJywgJ0RFRicpOyAvLyAnQUJDREVGJ1xuICAgICAqL1xuICAgIHZhciBjb25jYXQgPSBfY3VycnkyKGZ1bmN0aW9uIChzZXQxLCBzZXQyKSB7XG4gICAgICAgIGlmIChfaXNBcnJheShzZXQyKSkge1xuICAgICAgICAgICAgcmV0dXJuIF9jb25jYXQoc2V0MSwgc2V0Mik7XG4gICAgICAgIH0gZWxzZSBpZiAoX2hhc01ldGhvZCgnY29uY2F0Jywgc2V0MSkpIHtcbiAgICAgICAgICAgIHJldHVybiBzZXQxLmNvbmNhdChzZXQyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2NhblxcJ3QgY29uY2F0ICcgKyB0eXBlb2Ygc2V0MSk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYSBjdXJyaWVkIGVxdWl2YWxlbnQgb2YgdGhlIHByb3ZpZGVkIGZ1bmN0aW9uLCB3aXRoIHRoZVxuICAgICAqIHNwZWNpZmllZCBhcml0eS4gVGhlIGN1cnJpZWQgZnVuY3Rpb24gaGFzIHR3byB1bnVzdWFsIGNhcGFiaWxpdGllcy5cbiAgICAgKiBGaXJzdCwgaXRzIGFyZ3VtZW50cyBuZWVkbid0IGJlIHByb3ZpZGVkIG9uZSBhdCBhIHRpbWUuIElmIGBnYCBpc1xuICAgICAqIGBSLmN1cnJ5TigzLCBmKWAsIHRoZSBmb2xsb3dpbmcgYXJlIGVxdWl2YWxlbnQ6XG4gICAgICpcbiAgICAgKiAgIC0gYGcoMSkoMikoMylgXG4gICAgICogICAtIGBnKDEpKDIsIDMpYFxuICAgICAqICAgLSBgZygxLCAyKSgzKWBcbiAgICAgKiAgIC0gYGcoMSwgMiwgMylgXG4gICAgICpcbiAgICAgKiBTZWNvbmRseSwgdGhlIHNwZWNpYWwgcGxhY2Vob2xkZXIgdmFsdWUgYFIuX19gIG1heSBiZSB1c2VkIHRvIHNwZWNpZnlcbiAgICAgKiBcImdhcHNcIiwgYWxsb3dpbmcgcGFydGlhbCBhcHBsaWNhdGlvbiBvZiBhbnkgY29tYmluYXRpb24gb2YgYXJndW1lbnRzLFxuICAgICAqIHJlZ2FyZGxlc3Mgb2YgdGhlaXIgcG9zaXRpb25zLiBJZiBgZ2AgaXMgYXMgYWJvdmUgYW5kIGBfYCBpcyBgUi5fX2AsXG4gICAgICogdGhlIGZvbGxvd2luZyBhcmUgZXF1aXZhbGVudDpcbiAgICAgKlxuICAgICAqICAgLSBgZygxLCAyLCAzKWBcbiAgICAgKiAgIC0gYGcoXywgMiwgMykoMSlgXG4gICAgICogICAtIGBnKF8sIF8sIDMpKDEpKDIpYFxuICAgICAqICAgLSBgZyhfLCBfLCAzKSgxLCAyKWBcbiAgICAgKiAgIC0gYGcoXywgMikoMSkoMylgXG4gICAgICogICAtIGBnKF8sIDIpKDEsIDMpYFxuICAgICAqICAgLSBgZyhfLCAyKShfLCAzKSgxKWBcbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgRnVuY3Rpb25cbiAgICAgKiBAc2lnIE51bWJlciAtPiAoKiAtPiBhKSAtPiAoKiAtPiBhKVxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBsZW5ndGggVGhlIGFyaXR5IGZvciB0aGUgcmV0dXJuZWQgZnVuY3Rpb24uXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGZ1bmN0aW9uIHRvIGN1cnJ5LlxuICAgICAqIEByZXR1cm4ge0Z1bmN0aW9ufSBBIG5ldywgY3VycmllZCBmdW5jdGlvbi5cbiAgICAgKiBAc2VlIFIuY3VycnlcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICB2YXIgYWRkRm91ck51bWJlcnMgPSBmdW5jdGlvbigpIHtcbiAgICAgKiAgICAgICAgcmV0dXJuIFIuc3VtKFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAwLCA0KSk7XG4gICAgICogICAgICB9O1xuICAgICAqXG4gICAgICogICAgICB2YXIgY3VycmllZEFkZEZvdXJOdW1iZXJzID0gUi5jdXJyeU4oNCwgYWRkRm91ck51bWJlcnMpO1xuICAgICAqICAgICAgdmFyIGYgPSBjdXJyaWVkQWRkRm91ck51bWJlcnMoMSwgMik7XG4gICAgICogICAgICB2YXIgZyA9IGYoMyk7XG4gICAgICogICAgICBnKDQpOyAvLz0+IDEwXG4gICAgICovXG4gICAgdmFyIGN1cnJ5TiA9IF9jdXJyeTIoZnVuY3Rpb24gY3VycnlOKGxlbmd0aCwgZm4pIHtcbiAgICAgICAgcmV0dXJuIGFyaXR5KGxlbmd0aCwgX2N1cnJ5TihsZW5ndGgsIFtdLCBmbikpO1xuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogTWFrZXMgYSBzaGFsbG93IGNsb25lIG9mIGFuIG9iamVjdCwgb21pdHRpbmcgdGhlIHByb3BlcnR5IGF0IHRoZVxuICAgICAqIGdpdmVuIHBhdGguIE5vdGUgdGhhdCB0aGlzIGNvcGllcyBhbmQgZmxhdHRlbnMgcHJvdG90eXBlIHByb3BlcnRpZXNcbiAgICAgKiBvbnRvIHRoZSBuZXcgb2JqZWN0IGFzIHdlbGwuICBBbGwgbm9uLXByaW1pdGl2ZSBwcm9wZXJ0aWVzIGFyZSBjb3BpZWRcbiAgICAgKiBieSByZWZlcmVuY2UuXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IE9iamVjdFxuICAgICAqIEBzaWcgW1N0cmluZ10gLT4ge2s6IHZ9IC0+IHtrOiB2fVxuICAgICAqIEBwYXJhbSB7QXJyYXl9IHBhdGggdGhlIHBhdGggdG8gc2V0XG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9iaiB0aGUgb2JqZWN0IHRvIGNsb25lXG4gICAgICogQHJldHVybiB7T2JqZWN0fSBhIG5ldyBvYmplY3Qgd2l0aG91dCB0aGUgcHJvcGVydHkgYXQgcGF0aFxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIFIuZGlzc29jUGF0aChbJ2EnLCAnYicsICdjJ10sIHthOiB7Yjoge2M6IDQyfX19KTsgLy89PiB7YToge2I6IHt9fX1cbiAgICAgKi9cbiAgICB2YXIgZGlzc29jUGF0aCA9IF9jdXJyeTIoX2Rpc3NvY1BhdGgpO1xuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhIG5ldyBsaXN0IGNvbnRhaW5pbmcgdGhlIGxhc3QgYG5gIGVsZW1lbnRzIG9mIGEgZ2l2ZW4gbGlzdCwgcGFzc2luZyBlYWNoIHZhbHVlXG4gICAgICogdG8gdGhlIHN1cHBsaWVkIHByZWRpY2F0ZSBmdW5jdGlvbiwgc2tpcHBpbmcgZWxlbWVudHMgd2hpbGUgdGhlIHByZWRpY2F0ZSBmdW5jdGlvbiByZXR1cm5zXG4gICAgICogYHRydWVgLiBUaGUgcHJlZGljYXRlIGZ1bmN0aW9uIGlzIHBhc3NlZCBvbmUgYXJndW1lbnQ6ICoodmFsdWUpKi5cbiAgICAgKlxuICAgICAqIEFjdHMgYXMgYSB0cmFuc2R1Y2VyIGlmIGEgdHJhbnNmb3JtZXIgaXMgZ2l2ZW4gaW4gbGlzdCBwb3NpdGlvbi5cbiAgICAgKiBAc2VlIFIudHJhbnNkdWNlXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IExpc3RcbiAgICAgKiBAc2lnIChhIC0+IEJvb2xlYW4pIC0+IFthXSAtPiBbYV1cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgZnVuY3Rpb24gY2FsbGVkIHBlciBpdGVyYXRpb24uXG4gICAgICogQHBhcmFtIHtBcnJheX0gbGlzdCBUaGUgY29sbGVjdGlvbiB0byBpdGVyYXRlIG92ZXIuXG4gICAgICogQHJldHVybiB7QXJyYXl9IEEgbmV3IGFycmF5LlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIHZhciBsdGVUd28gPSBmdW5jdGlvbih4KSB7XG4gICAgICogICAgICAgIHJldHVybiB4IDw9IDI7XG4gICAgICogICAgICB9O1xuICAgICAqXG4gICAgICogICAgICBSLmRyb3BXaGlsZShsdGVUd28sIFsxLCAyLCAzLCA0LCAzLCAyLCAxXSk7IC8vPT4gWzMsIDQsIDMsIDIsIDFdXG4gICAgICovXG4gICAgdmFyIGRyb3BXaGlsZSA9IF9jdXJyeTIoX2Rpc3BhdGNoYWJsZSgnZHJvcFdoaWxlJywgX3hkcm9wV2hpbGUsIGZ1bmN0aW9uIGRyb3BXaGlsZShwcmVkLCBsaXN0KSB7XG4gICAgICAgIHZhciBpZHggPSAwO1xuICAgICAgICB3aGlsZSAoaWR4IDwgbGlzdC5sZW5ndGggJiYgcHJlZChsaXN0W2lkeF0pKSB7XG4gICAgICAgICAgICBpZHggKz0gMTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gX3NsaWNlKGxpc3QsIGlkeCk7XG4gICAgfSkpO1xuXG4gICAgLyoqXG4gICAgICogYGVtcHR5YCByZXR1cm5zIGFuIGVtcHR5IGxpc3QgZm9yIGFueSBhcmd1bWVudCwgZXhjZXB0IHdoZW4gdGhlIGFyZ3VtZW50IHNhdGlzZmllcyB0aGVcbiAgICAgKiBGYW50YXN5LWxhbmQgTW9ub2lkIHNwZWMuIEluIHRoYXQgY2FzZSwgdGhpcyBmdW5jdGlvbiB3aWxsIHJldHVybiB0aGUgcmVzdWx0IG9mIGludm9raW5nXG4gICAgICogYGVtcHR5YCBvbiB0aGF0IE1vbm9pZC5cbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgRnVuY3Rpb25cbiAgICAgKiBAc2lnICogLT4gW11cbiAgICAgKiBAcmV0dXJuIHtBcnJheX0gQW4gZW1wdHkgYXJyYXkuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgUi5lbXB0eShbMSwyLDMsNCw1XSk7IC8vPT4gW11cbiAgICAgKi9cbiAgICB2YXIgZW1wdHkgPSBfY3VycnkxKGZ1bmN0aW9uIGVtcHR5KHgpIHtcbiAgICAgICAgcmV0dXJuIF9oYXNNZXRob2QoJ2VtcHR5JywgeCkgPyB4LmVtcHR5KCkgOiBbXTtcbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYHRydWVgIGlmIGl0cyBhcmd1bWVudHMgYXJlIGVxdWl2YWxlbnQsIGBmYWxzZWAgb3RoZXJ3aXNlLlxuICAgICAqIERpc3BhdGNoZXMgdG8gYW4gYGVxdWFsc2AgbWV0aG9kIGlmIHByZXNlbnQuIEhhbmRsZXMgY3ljbGljYWwgZGF0YVxuICAgICAqIHN0cnVjdHVyZXMuXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IFJlbGF0aW9uXG4gICAgICogQHNpZyBhIC0+IGIgLT4gQm9vbGVhblxuICAgICAqIEBwYXJhbSB7Kn0gYVxuICAgICAqIEBwYXJhbSB7Kn0gYlxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgUi5lcXVhbHMoMSwgMSk7IC8vPT4gdHJ1ZVxuICAgICAqICAgICAgUi5lcXVhbHMoMSwgJzEnKTsgLy89PiBmYWxzZVxuICAgICAqICAgICAgUi5lcXVhbHMoWzEsIDIsIDNdLCBbMSwgMiwgM10pOyAvLz0+IHRydWVcbiAgICAgKlxuICAgICAqICAgICAgdmFyIGEgPSB7fTsgYS52ID0gYTtcbiAgICAgKiAgICAgIHZhciBiID0ge307IGIudiA9IGI7XG4gICAgICogICAgICBSLmVxdWFscyhhLCBiKTsgLy89PiB0cnVlXG4gICAgICovXG4gICAgdmFyIGVxdWFscyA9IF9jdXJyeTIoZnVuY3Rpb24gZXF1YWxzKGEsIGIpIHtcbiAgICAgICAgcmV0dXJuIF9oYXNNZXRob2QoJ2VxdWFscycsIGEpID8gYS5lcXVhbHMoYikgOiBfaGFzTWV0aG9kKCdlcXVhbHMnLCBiKSA/IGIuZXF1YWxzKGEpIDogX2VxdWFscyhhLCBiLCBbXSwgW10pO1xuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhIG5ldyBsaXN0IGNvbnRhaW5pbmcgb25seSB0aG9zZSBpdGVtcyB0aGF0IG1hdGNoIGEgZ2l2ZW4gcHJlZGljYXRlIGZ1bmN0aW9uLlxuICAgICAqIFRoZSBwcmVkaWNhdGUgZnVuY3Rpb24gaXMgcGFzc2VkIG9uZSBhcmd1bWVudDogKih2YWx1ZSkqLlxuICAgICAqXG4gICAgICogTm90ZSB0aGF0IGBSLmZpbHRlcmAgZG9lcyBub3Qgc2tpcCBkZWxldGVkIG9yIHVuYXNzaWduZWQgaW5kaWNlcywgdW5saWtlIHRoZSBuYXRpdmVcbiAgICAgKiBgQXJyYXkucHJvdG90eXBlLmZpbHRlcmAgbWV0aG9kLiBGb3IgbW9yZSBkZXRhaWxzIG9uIHRoaXMgYmVoYXZpb3IsIHNlZTpcbiAgICAgKiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9BcnJheS9maWx0ZXIjRGVzY3JpcHRpb25cbiAgICAgKlxuICAgICAqIEFjdHMgYXMgYSB0cmFuc2R1Y2VyIGlmIGEgdHJhbnNmb3JtZXIgaXMgZ2l2ZW4gaW4gbGlzdCBwb3NpdGlvbi5cbiAgICAgKiBAc2VlIFIudHJhbnNkdWNlXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IExpc3RcbiAgICAgKiBAc2lnIChhIC0+IEJvb2xlYW4pIC0+IFthXSAtPiBbYV1cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgZnVuY3Rpb24gY2FsbGVkIHBlciBpdGVyYXRpb24uXG4gICAgICogQHBhcmFtIHtBcnJheX0gbGlzdCBUaGUgY29sbGVjdGlvbiB0byBpdGVyYXRlIG92ZXIuXG4gICAgICogQHJldHVybiB7QXJyYXl9IFRoZSBuZXcgZmlsdGVyZWQgYXJyYXkuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgdmFyIGlzRXZlbiA9IGZ1bmN0aW9uKG4pIHtcbiAgICAgKiAgICAgICAgcmV0dXJuIG4gJSAyID09PSAwO1xuICAgICAqICAgICAgfTtcbiAgICAgKiAgICAgIFIuZmlsdGVyKGlzRXZlbiwgWzEsIDIsIDMsIDRdKTsgLy89PiBbMiwgNF1cbiAgICAgKi9cbiAgICB2YXIgZmlsdGVyID0gX2N1cnJ5MihfZGlzcGF0Y2hhYmxlKCdmaWx0ZXInLCBfeGZpbHRlciwgX2ZpbHRlcikpO1xuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgZmlyc3QgZWxlbWVudCBvZiB0aGUgbGlzdCB3aGljaCBtYXRjaGVzIHRoZSBwcmVkaWNhdGUsIG9yIGB1bmRlZmluZWRgIGlmIG5vXG4gICAgICogZWxlbWVudCBtYXRjaGVzLlxuICAgICAqXG4gICAgICogQWN0cyBhcyBhIHRyYW5zZHVjZXIgaWYgYSB0cmFuc2Zvcm1lciBpcyBnaXZlbiBpbiBsaXN0IHBvc2l0aW9uLlxuICAgICAqIEBzZWUgUi50cmFuc2R1Y2VcbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgTGlzdFxuICAgICAqIEBzaWcgKGEgLT4gQm9vbGVhbikgLT4gW2FdIC0+IGEgfCB1bmRlZmluZWRcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgcHJlZGljYXRlIGZ1bmN0aW9uIHVzZWQgdG8gZGV0ZXJtaW5lIGlmIHRoZSBlbGVtZW50IGlzIHRoZVxuICAgICAqICAgICAgICBkZXNpcmVkIG9uZS5cbiAgICAgKiBAcGFyYW0ge0FycmF5fSBsaXN0IFRoZSBhcnJheSB0byBjb25zaWRlci5cbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IFRoZSBlbGVtZW50IGZvdW5kLCBvciBgdW5kZWZpbmVkYC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICB2YXIgeHMgPSBbe2E6IDF9LCB7YTogMn0sIHthOiAzfV07XG4gICAgICogICAgICBSLmZpbmQoUi5wcm9wRXEoJ2EnLCAyKSkoeHMpOyAvLz0+IHthOiAyfVxuICAgICAqICAgICAgUi5maW5kKFIucHJvcEVxKCdhJywgNCkpKHhzKTsgLy89PiB1bmRlZmluZWRcbiAgICAgKi9cbiAgICB2YXIgZmluZCA9IF9jdXJyeTIoX2Rpc3BhdGNoYWJsZSgnZmluZCcsIF94ZmluZCwgZnVuY3Rpb24gZmluZChmbiwgbGlzdCkge1xuICAgICAgICB2YXIgaWR4ID0gMDtcbiAgICAgICAgd2hpbGUgKGlkeCA8IGxpc3QubGVuZ3RoKSB7XG4gICAgICAgICAgICBpZiAoZm4obGlzdFtpZHhdKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBsaXN0W2lkeF07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZHggKz0gMTtcbiAgICAgICAgfVxuICAgIH0pKTtcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIGluZGV4IG9mIHRoZSBmaXJzdCBlbGVtZW50IG9mIHRoZSBsaXN0IHdoaWNoIG1hdGNoZXMgdGhlIHByZWRpY2F0ZSwgb3IgYC0xYFxuICAgICAqIGlmIG5vIGVsZW1lbnQgbWF0Y2hlcy5cbiAgICAgKlxuICAgICAqIEFjdHMgYXMgYSB0cmFuc2R1Y2VyIGlmIGEgdHJhbnNmb3JtZXIgaXMgZ2l2ZW4gaW4gbGlzdCBwb3NpdGlvbi5cbiAgICAgKiBAc2VlIFIudHJhbnNkdWNlXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IExpc3RcbiAgICAgKiBAc2lnIChhIC0+IEJvb2xlYW4pIC0+IFthXSAtPiBOdW1iZXJcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgcHJlZGljYXRlIGZ1bmN0aW9uIHVzZWQgdG8gZGV0ZXJtaW5lIGlmIHRoZSBlbGVtZW50IGlzIHRoZVxuICAgICAqIGRlc2lyZWQgb25lLlxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGxpc3QgVGhlIGFycmF5IHRvIGNvbnNpZGVyLlxuICAgICAqIEByZXR1cm4ge051bWJlcn0gVGhlIGluZGV4IG9mIHRoZSBlbGVtZW50IGZvdW5kLCBvciBgLTFgLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIHZhciB4cyA9IFt7YTogMX0sIHthOiAyfSwge2E6IDN9XTtcbiAgICAgKiAgICAgIFIuZmluZEluZGV4KFIucHJvcEVxKCdhJywgMikpKHhzKTsgLy89PiAxXG4gICAgICogICAgICBSLmZpbmRJbmRleChSLnByb3BFcSgnYScsIDQpKSh4cyk7IC8vPT4gLTFcbiAgICAgKi9cbiAgICB2YXIgZmluZEluZGV4ID0gX2N1cnJ5MihfZGlzcGF0Y2hhYmxlKCdmaW5kSW5kZXgnLCBfeGZpbmRJbmRleCwgZnVuY3Rpb24gZmluZEluZGV4KGZuLCBsaXN0KSB7XG4gICAgICAgIHZhciBpZHggPSAwO1xuICAgICAgICB3aGlsZSAoaWR4IDwgbGlzdC5sZW5ndGgpIHtcbiAgICAgICAgICAgIGlmIChmbihsaXN0W2lkeF0pKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGlkeDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlkeCArPSAxO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAtMTtcbiAgICB9KSk7XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBsYXN0IGVsZW1lbnQgb2YgdGhlIGxpc3Qgd2hpY2ggbWF0Y2hlcyB0aGUgcHJlZGljYXRlLCBvciBgdW5kZWZpbmVkYCBpZiBub1xuICAgICAqIGVsZW1lbnQgbWF0Y2hlcy5cbiAgICAgKlxuICAgICAqIEFjdHMgYXMgYSB0cmFuc2R1Y2VyIGlmIGEgdHJhbnNmb3JtZXIgaXMgZ2l2ZW4gaW4gbGlzdCBwb3NpdGlvbi5cbiAgICAgKiBAc2VlIFIudHJhbnNkdWNlXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IExpc3RcbiAgICAgKiBAc2lnIChhIC0+IEJvb2xlYW4pIC0+IFthXSAtPiBhIHwgdW5kZWZpbmVkXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIHByZWRpY2F0ZSBmdW5jdGlvbiB1c2VkIHRvIGRldGVybWluZSBpZiB0aGUgZWxlbWVudCBpcyB0aGVcbiAgICAgKiBkZXNpcmVkIG9uZS5cbiAgICAgKiBAcGFyYW0ge0FycmF5fSBsaXN0IFRoZSBhcnJheSB0byBjb25zaWRlci5cbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IFRoZSBlbGVtZW50IGZvdW5kLCBvciBgdW5kZWZpbmVkYC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICB2YXIgeHMgPSBbe2E6IDEsIGI6IDB9LCB7YToxLCBiOiAxfV07XG4gICAgICogICAgICBSLmZpbmRMYXN0KFIucHJvcEVxKCdhJywgMSkpKHhzKTsgLy89PiB7YTogMSwgYjogMX1cbiAgICAgKiAgICAgIFIuZmluZExhc3QoUi5wcm9wRXEoJ2EnLCA0KSkoeHMpOyAvLz0+IHVuZGVmaW5lZFxuICAgICAqL1xuICAgIHZhciBmaW5kTGFzdCA9IF9jdXJyeTIoX2Rpc3BhdGNoYWJsZSgnZmluZExhc3QnLCBfeGZpbmRMYXN0LCBmdW5jdGlvbiBmaW5kTGFzdChmbiwgbGlzdCkge1xuICAgICAgICB2YXIgaWR4ID0gbGlzdC5sZW5ndGggLSAxO1xuICAgICAgICB3aGlsZSAoaWR4ID49IDApIHtcbiAgICAgICAgICAgIGlmIChmbihsaXN0W2lkeF0pKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGxpc3RbaWR4XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlkeCAtPSAxO1xuICAgICAgICB9XG4gICAgfSkpO1xuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgaW5kZXggb2YgdGhlIGxhc3QgZWxlbWVudCBvZiB0aGUgbGlzdCB3aGljaCBtYXRjaGVzIHRoZSBwcmVkaWNhdGUsIG9yXG4gICAgICogYC0xYCBpZiBubyBlbGVtZW50IG1hdGNoZXMuXG4gICAgICpcbiAgICAgKiBBY3RzIGFzIGEgdHJhbnNkdWNlciBpZiBhIHRyYW5zZm9ybWVyIGlzIGdpdmVuIGluIGxpc3QgcG9zaXRpb24uXG4gICAgICogQHNlZSBSLnRyYW5zZHVjZVxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBMaXN0XG4gICAgICogQHNpZyAoYSAtPiBCb29sZWFuKSAtPiBbYV0gLT4gTnVtYmVyXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIHByZWRpY2F0ZSBmdW5jdGlvbiB1c2VkIHRvIGRldGVybWluZSBpZiB0aGUgZWxlbWVudCBpcyB0aGVcbiAgICAgKiBkZXNpcmVkIG9uZS5cbiAgICAgKiBAcGFyYW0ge0FycmF5fSBsaXN0IFRoZSBhcnJheSB0byBjb25zaWRlci5cbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9IFRoZSBpbmRleCBvZiB0aGUgZWxlbWVudCBmb3VuZCwgb3IgYC0xYC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICB2YXIgeHMgPSBbe2E6IDEsIGI6IDB9LCB7YToxLCBiOiAxfV07XG4gICAgICogICAgICBSLmZpbmRMYXN0SW5kZXgoUi5wcm9wRXEoJ2EnLCAxKSkoeHMpOyAvLz0+IDFcbiAgICAgKiAgICAgIFIuZmluZExhc3RJbmRleChSLnByb3BFcSgnYScsIDQpKSh4cyk7IC8vPT4gLTFcbiAgICAgKi9cbiAgICB2YXIgZmluZExhc3RJbmRleCA9IF9jdXJyeTIoX2Rpc3BhdGNoYWJsZSgnZmluZExhc3RJbmRleCcsIF94ZmluZExhc3RJbmRleCwgZnVuY3Rpb24gZmluZExhc3RJbmRleChmbiwgbGlzdCkge1xuICAgICAgICB2YXIgaWR4ID0gbGlzdC5sZW5ndGggLSAxO1xuICAgICAgICB3aGlsZSAoaWR4ID49IDApIHtcbiAgICAgICAgICAgIGlmIChmbihsaXN0W2lkeF0pKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGlkeDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlkeCAtPSAxO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAtMTtcbiAgICB9KSk7XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGEgbmV3IGxpc3QgYnkgcHVsbGluZyBldmVyeSBpdGVtIG91dCBvZiBpdCAoYW5kIGFsbCBpdHMgc3ViLWFycmF5cykgYW5kIHB1dHRpbmdcbiAgICAgKiB0aGVtIGluIGEgbmV3IGFycmF5LCBkZXB0aC1maXJzdC5cbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgTGlzdFxuICAgICAqIEBzaWcgW2FdIC0+IFtiXVxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGxpc3QgVGhlIGFycmF5IHRvIGNvbnNpZGVyLlxuICAgICAqIEByZXR1cm4ge0FycmF5fSBUaGUgZmxhdHRlbmVkIGxpc3QuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgUi5mbGF0dGVuKFsxLCAyLCBbMywgNF0sIDUsIFs2LCBbNywgOCwgWzksIFsxMCwgMTFdLCAxMl1dXV0pO1xuICAgICAqICAgICAgLy89PiBbMSwgMiwgMywgNCwgNSwgNiwgNywgOCwgOSwgMTAsIDExLCAxMl1cbiAgICAgKi9cbiAgICB2YXIgZmxhdHRlbiA9IF9jdXJyeTEoX21ha2VGbGF0KHRydWUpKTtcblxuICAgIC8qKlxuICAgICAqIEl0ZXJhdGUgb3ZlciBhbiBpbnB1dCBgbGlzdGAsIGNhbGxpbmcgYSBwcm92aWRlZCBmdW5jdGlvbiBgZm5gIGZvciBlYWNoIGVsZW1lbnQgaW4gdGhlXG4gICAgICogbGlzdC5cbiAgICAgKlxuICAgICAqIGBmbmAgcmVjZWl2ZXMgb25lIGFyZ3VtZW50OiAqKHZhbHVlKSouXG4gICAgICpcbiAgICAgKiBOb3RlOiBgUi5mb3JFYWNoYCBkb2VzIG5vdCBza2lwIGRlbGV0ZWQgb3IgdW5hc3NpZ25lZCBpbmRpY2VzIChzcGFyc2UgYXJyYXlzKSwgdW5saWtlXG4gICAgICogdGhlIG5hdGl2ZSBgQXJyYXkucHJvdG90eXBlLmZvckVhY2hgIG1ldGhvZC4gRm9yIG1vcmUgZGV0YWlscyBvbiB0aGlzIGJlaGF2aW9yLCBzZWU6XG4gICAgICogaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvQXJyYXkvZm9yRWFjaCNEZXNjcmlwdGlvblxuICAgICAqXG4gICAgICogQWxzbyBub3RlIHRoYXQsIHVubGlrZSBgQXJyYXkucHJvdG90eXBlLmZvckVhY2hgLCBSYW1kYSdzIGBmb3JFYWNoYCByZXR1cm5zIHRoZSBvcmlnaW5hbFxuICAgICAqIGFycmF5LiBJbiBzb21lIGxpYnJhcmllcyB0aGlzIGZ1bmN0aW9uIGlzIG5hbWVkIGBlYWNoYC5cbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgTGlzdFxuICAgICAqIEBzaWcgKGEgLT4gKikgLT4gW2FdIC0+IFthXVxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBmdW5jdGlvbiB0byBpbnZva2UuIFJlY2VpdmVzIG9uZSBhcmd1bWVudCwgYHZhbHVlYC5cbiAgICAgKiBAcGFyYW0ge0FycmF5fSBsaXN0IFRoZSBsaXN0IHRvIGl0ZXJhdGUgb3Zlci5cbiAgICAgKiBAcmV0dXJuIHtBcnJheX0gVGhlIG9yaWdpbmFsIGxpc3QuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgdmFyIHByaW50WFBsdXNGaXZlID0gZnVuY3Rpb24oeCkgeyBjb25zb2xlLmxvZyh4ICsgNSk7IH07XG4gICAgICogICAgICBSLmZvckVhY2gocHJpbnRYUGx1c0ZpdmUsIFsxLCAyLCAzXSk7IC8vPT4gWzEsIDIsIDNdXG4gICAgICogICAgICAvLy0+IDZcbiAgICAgKiAgICAgIC8vLT4gN1xuICAgICAqICAgICAgLy8tPiA4XG4gICAgICovXG4gICAgdmFyIGZvckVhY2ggPSBfY3VycnkyKGZ1bmN0aW9uIGZvckVhY2goZm4sIGxpc3QpIHtcbiAgICAgICAgcmV0dXJuIF9oYXNNZXRob2QoJ2ZvckVhY2gnLCBsaXN0KSA/IGxpc3QuZm9yRWFjaChmbikgOiBfZm9yRWFjaChmbiwgbGlzdCk7XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGEgbGlzdCBvZiBmdW5jdGlvbiBuYW1lcyBvZiBvYmplY3QncyBvd24gZnVuY3Rpb25zXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IE9iamVjdFxuICAgICAqIEBzaWcgeyp9IC0+IFtTdHJpbmddXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9iaiBUaGUgb2JqZWN0cyB3aXRoIGZ1bmN0aW9ucyBpbiBpdFxuICAgICAqIEByZXR1cm4ge0FycmF5fSBBIGxpc3Qgb2YgdGhlIG9iamVjdCdzIG93biBwcm9wZXJ0aWVzIHRoYXQgbWFwIHRvIGZ1bmN0aW9ucy5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICBSLmZ1bmN0aW9ucyhSKTsgLy8gcmV0dXJucyBsaXN0IG9mIHJhbWRhJ3Mgb3duIGZ1bmN0aW9uIG5hbWVzXG4gICAgICpcbiAgICAgKiAgICAgIHZhciBGID0gZnVuY3Rpb24oKSB7IHRoaXMueCA9IGZ1bmN0aW9uKCl7fTsgdGhpcy55ID0gMTsgfVxuICAgICAqICAgICAgRi5wcm90b3R5cGUueiA9IGZ1bmN0aW9uKCkge307XG4gICAgICogICAgICBGLnByb3RvdHlwZS5hID0gMTAwO1xuICAgICAqICAgICAgUi5mdW5jdGlvbnMobmV3IEYoKSk7IC8vPT4gW1wieFwiXVxuICAgICAqL1xuICAgIHZhciBmdW5jdGlvbnMgPSBfY3VycnkxKF9mdW5jdGlvbnNXaXRoKGtleXMpKTtcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYSBsaXN0IG9mIGZ1bmN0aW9uIG5hbWVzIG9mIG9iamVjdCdzIG93biBhbmQgcHJvdG90eXBlIGZ1bmN0aW9uc1xuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBPYmplY3RcbiAgICAgKiBAc2lnIHsqfSAtPiBbU3RyaW5nXVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvYmogVGhlIG9iamVjdHMgd2l0aCBmdW5jdGlvbnMgaW4gaXRcbiAgICAgKiBAcmV0dXJuIHtBcnJheX0gQSBsaXN0IG9mIHRoZSBvYmplY3QncyBvd24gcHJvcGVydGllcyBhbmQgcHJvdG90eXBlXG4gICAgICogICAgICAgICBwcm9wZXJ0aWVzIHRoYXQgbWFwIHRvIGZ1bmN0aW9ucy5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICBSLmZ1bmN0aW9uc0luKFIpOyAvLyByZXR1cm5zIGxpc3Qgb2YgcmFtZGEncyBvd24gYW5kIHByb3RvdHlwZSBmdW5jdGlvbiBuYW1lc1xuICAgICAqXG4gICAgICogICAgICB2YXIgRiA9IGZ1bmN0aW9uKCkgeyB0aGlzLnggPSBmdW5jdGlvbigpe307IHRoaXMueSA9IDE7IH1cbiAgICAgKiAgICAgIEYucHJvdG90eXBlLnogPSBmdW5jdGlvbigpIHt9O1xuICAgICAqICAgICAgRi5wcm90b3R5cGUuYSA9IDEwMDtcbiAgICAgKiAgICAgIFIuZnVuY3Rpb25zSW4obmV3IEYoKSk7IC8vPT4gW1wieFwiLCBcInpcIl1cbiAgICAgKi9cbiAgICB2YXIgZnVuY3Rpb25zSW4gPSBfY3VycnkxKF9mdW5jdGlvbnNXaXRoKGtleXNJbikpO1xuXG4gICAgLyoqXG4gICAgICogU3BsaXRzIGEgbGlzdCBpbnRvIHN1Yi1saXN0cyBzdG9yZWQgaW4gYW4gb2JqZWN0LCBiYXNlZCBvbiB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgYSBTdHJpbmctcmV0dXJuaW5nIGZ1bmN0aW9uXG4gICAgICogb24gZWFjaCBlbGVtZW50LCBhbmQgZ3JvdXBpbmcgdGhlIHJlc3VsdHMgYWNjb3JkaW5nIHRvIHZhbHVlcyByZXR1cm5lZC5cbiAgICAgKlxuICAgICAqIEFjdHMgYXMgYSB0cmFuc2R1Y2VyIGlmIGEgdHJhbnNmb3JtZXIgaXMgZ2l2ZW4gaW4gbGlzdCBwb3NpdGlvbi5cbiAgICAgKiBAc2VlIFIudHJhbnNkdWNlXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IExpc3RcbiAgICAgKiBAc2lnIChhIC0+IFN0cmluZykgLT4gW2FdIC0+IHtTdHJpbmc6IFthXX1cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBGdW5jdGlvbiA6OiBhIC0+IFN0cmluZ1xuICAgICAqIEBwYXJhbSB7QXJyYXl9IGxpc3QgVGhlIGFycmF5IHRvIGdyb3VwXG4gICAgICogQHJldHVybiB7T2JqZWN0fSBBbiBvYmplY3Qgd2l0aCB0aGUgb3V0cHV0IG9mIGBmbmAgZm9yIGtleXMsIG1hcHBlZCB0byBhcnJheXMgb2YgZWxlbWVudHNcbiAgICAgKiAgICAgICAgIHRoYXQgcHJvZHVjZWQgdGhhdCBrZXkgd2hlbiBwYXNzZWQgdG8gYGZuYC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICB2YXIgYnlHcmFkZSA9IFIuZ3JvdXBCeShmdW5jdGlvbihzdHVkZW50KSB7XG4gICAgICogICAgICAgIHZhciBzY29yZSA9IHN0dWRlbnQuc2NvcmU7XG4gICAgICogICAgICAgIHJldHVybiBzY29yZSA8IDY1ID8gJ0YnIDpcbiAgICAgKiAgICAgICAgICAgICAgIHNjb3JlIDwgNzAgPyAnRCcgOlxuICAgICAqICAgICAgICAgICAgICAgc2NvcmUgPCA4MCA/ICdDJyA6XG4gICAgICogICAgICAgICAgICAgICBzY29yZSA8IDkwID8gJ0InIDogJ0EnO1xuICAgICAqICAgICAgfSk7XG4gICAgICogICAgICB2YXIgc3R1ZGVudHMgPSBbe25hbWU6ICdBYmJ5Jywgc2NvcmU6IDg0fSxcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICB7bmFtZTogJ0VkZHknLCBzY29yZTogNTh9LFxuICAgICAqICAgICAgICAgICAgICAgICAgICAgIC8vIC4uLlxuICAgICAqICAgICAgICAgICAgICAgICAgICAgIHtuYW1lOiAnSmFjaycsIHNjb3JlOiA2OX1dO1xuICAgICAqICAgICAgYnlHcmFkZShzdHVkZW50cyk7XG4gICAgICogICAgICAvLyB7XG4gICAgICogICAgICAvLyAgICdBJzogW3tuYW1lOiAnRGlhbm5lJywgc2NvcmU6IDk5fV0sXG4gICAgICogICAgICAvLyAgICdCJzogW3tuYW1lOiAnQWJieScsIHNjb3JlOiA4NH1dXG4gICAgICogICAgICAvLyAgIC8vIC4uLixcbiAgICAgKiAgICAgIC8vICAgJ0YnOiBbe25hbWU6ICdFZGR5Jywgc2NvcmU6IDU4fV1cbiAgICAgKiAgICAgIC8vIH1cbiAgICAgKi9cbiAgICB2YXIgZ3JvdXBCeSA9IF9jdXJyeTIoX2Rpc3BhdGNoYWJsZSgnZ3JvdXBCeScsIF94Z3JvdXBCeSwgZnVuY3Rpb24gZ3JvdXBCeShmbiwgbGlzdCkge1xuICAgICAgICByZXR1cm4gX3JlZHVjZShmdW5jdGlvbiAoYWNjLCBlbHQpIHtcbiAgICAgICAgICAgIHZhciBrZXkgPSBmbihlbHQpO1xuICAgICAgICAgICAgYWNjW2tleV0gPSBfYXBwZW5kKGVsdCwgYWNjW2tleV0gfHwgKGFjY1trZXldID0gW10pKTtcbiAgICAgICAgICAgIHJldHVybiBhY2M7XG4gICAgICAgIH0sIHt9LCBsaXN0KTtcbiAgICB9KSk7XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBmaXJzdCBlbGVtZW50IGluIGEgbGlzdC5cbiAgICAgKiBJbiBzb21lIGxpYnJhcmllcyB0aGlzIGZ1bmN0aW9uIGlzIG5hbWVkIGBmaXJzdGAuXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IExpc3RcbiAgICAgKiBAc2lnIFthXSAtPiBhXG4gICAgICogQHBhcmFtIHtBcnJheX0gbGlzdCBUaGUgYXJyYXkgdG8gY29uc2lkZXIuXG4gICAgICogQHJldHVybiB7Kn0gVGhlIGZpcnN0IGVsZW1lbnQgb2YgdGhlIGxpc3QsIG9yIGB1bmRlZmluZWRgIGlmIHRoZSBsaXN0IGlzIGVtcHR5LlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIFIuaGVhZChbJ2ZpJywgJ2ZvJywgJ2Z1bSddKTsgLy89PiAnZmknXG4gICAgICovXG4gICAgdmFyIGhlYWQgPSBudGgoMCk7XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgZnVuY3Rpb24gdGhhdCB3aWxsIHByb2Nlc3MgZWl0aGVyIHRoZSBgb25UcnVlYCBvciB0aGUgYG9uRmFsc2VgIGZ1bmN0aW9uIGRlcGVuZGluZ1xuICAgICAqIHVwb24gdGhlIHJlc3VsdCBvZiB0aGUgYGNvbmRpdGlvbmAgcHJlZGljYXRlLlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBMb2dpY1xuICAgICAqIEBzaWcgKCouLi4gLT4gQm9vbGVhbikgLT4gKCouLi4gLT4gKikgLT4gKCouLi4gLT4gKikgLT4gKCouLi4gLT4gKilcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjb25kaXRpb24gQSBwcmVkaWNhdGUgZnVuY3Rpb25cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBvblRydWUgQSBmdW5jdGlvbiB0byBpbnZva2Ugd2hlbiB0aGUgYGNvbmRpdGlvbmAgZXZhbHVhdGVzIHRvIGEgdHJ1dGh5IHZhbHVlLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IG9uRmFsc2UgQSBmdW5jdGlvbiB0byBpbnZva2Ugd2hlbiB0aGUgYGNvbmRpdGlvbmAgZXZhbHVhdGVzIHRvIGEgZmFsc3kgdmFsdWUuXG4gICAgICogQHJldHVybiB7RnVuY3Rpb259IEEgbmV3IHVuYXJ5IGZ1bmN0aW9uIHRoYXQgd2lsbCBwcm9jZXNzIGVpdGhlciB0aGUgYG9uVHJ1ZWAgb3IgdGhlIGBvbkZhbHNlYFxuICAgICAqICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiBkZXBlbmRpbmcgdXBvbiB0aGUgcmVzdWx0IG9mIHRoZSBgY29uZGl0aW9uYCBwcmVkaWNhdGUuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgLy8gRmxhdHRlbiBhbGwgYXJyYXlzIGluIHRoZSBsaXN0IGJ1dCBsZWF2ZSBvdGhlciB2YWx1ZXMgYWxvbmUuXG4gICAgICogICAgICB2YXIgZmxhdHRlbkFycmF5cyA9IFIubWFwKFIuaWZFbHNlKEFycmF5LmlzQXJyYXksIFIuZmxhdHRlbiwgUi5pZGVudGl0eSkpO1xuICAgICAqXG4gICAgICogICAgICBmbGF0dGVuQXJyYXlzKFtbMF0sIFtbMTBdLCBbOF1dLCAxMjM0LCB7fV0pOyAvLz0+IFtbMF0sIFsxMCwgOF0sIDEyMzQsIHt9XVxuICAgICAqICAgICAgZmxhdHRlbkFycmF5cyhbW1sxMF0sIDEyM10sIFs4LCBbMTBdXSwgXCJoZWxsb1wiXSk7IC8vPT4gW1sxMCwgMTIzXSwgWzgsIDEwXSwgXCJoZWxsb1wiXVxuICAgICAqL1xuICAgIHZhciBpZkVsc2UgPSBfY3VycnkzKGZ1bmN0aW9uIGlmRWxzZShjb25kaXRpb24sIG9uVHJ1ZSwgb25GYWxzZSkge1xuICAgICAgICByZXR1cm4gY3VycnlOKE1hdGgubWF4KGNvbmRpdGlvbi5sZW5ndGgsIG9uVHJ1ZS5sZW5ndGgsIG9uRmFsc2UubGVuZ3RoKSwgZnVuY3Rpb24gX2lmRWxzZSgpIHtcbiAgICAgICAgICAgIHJldHVybiBjb25kaXRpb24uYXBwbHkodGhpcywgYXJndW1lbnRzKSA/IG9uVHJ1ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpIDogb25GYWxzZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIEluc2VydHMgdGhlIHN1cHBsaWVkIGVsZW1lbnQgaW50byB0aGUgbGlzdCwgYXQgaW5kZXggYGluZGV4YC4gIF9Ob3RlXG4gICAgICogdGhhdCB0aGlzIGlzIG5vdCBkZXN0cnVjdGl2ZV86IGl0IHJldHVybnMgYSBjb3B5IG9mIHRoZSBsaXN0IHdpdGggdGhlIGNoYW5nZXMuXG4gICAgICogPHNtYWxsPk5vIGxpc3RzIGhhdmUgYmVlbiBoYXJtZWQgaW4gdGhlIGFwcGxpY2F0aW9uIG9mIHRoaXMgZnVuY3Rpb24uPC9zbWFsbD5cbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgTGlzdFxuICAgICAqIEBzaWcgTnVtYmVyIC0+IGEgLT4gW2FdIC0+IFthXVxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBpbmRleCBUaGUgcG9zaXRpb24gdG8gaW5zZXJ0IHRoZSBlbGVtZW50XG4gICAgICogQHBhcmFtIHsqfSBlbHQgVGhlIGVsZW1lbnQgdG8gaW5zZXJ0IGludG8gdGhlIEFycmF5XG4gICAgICogQHBhcmFtIHtBcnJheX0gbGlzdCBUaGUgbGlzdCB0byBpbnNlcnQgaW50b1xuICAgICAqIEByZXR1cm4ge0FycmF5fSBBIG5ldyBBcnJheSB3aXRoIGBlbHRgIGluc2VydGVkIGF0IGBpbmRleGAuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgUi5pbnNlcnQoMiwgJ3gnLCBbMSwyLDMsNF0pOyAvLz0+IFsxLDIsJ3gnLDMsNF1cbiAgICAgKi9cbiAgICB2YXIgaW5zZXJ0ID0gX2N1cnJ5MyhmdW5jdGlvbiBpbnNlcnQoaWR4LCBlbHQsIGxpc3QpIHtcbiAgICAgICAgaWR4ID0gaWR4IDwgbGlzdC5sZW5ndGggJiYgaWR4ID49IDAgPyBpZHggOiBsaXN0Lmxlbmd0aDtcbiAgICAgICAgcmV0dXJuIF9jb25jYXQoX2FwcGVuZChlbHQsIF9zbGljZShsaXN0LCAwLCBpZHgpKSwgX3NsaWNlKGxpc3QsIGlkeCkpO1xuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogQ29tYmluZXMgdHdvIGxpc3RzIGludG8gYSBzZXQgKGkuZS4gbm8gZHVwbGljYXRlcykgY29tcG9zZWQgb2YgdGhvc2VcbiAgICAgKiBlbGVtZW50cyBjb21tb24gdG8gYm90aCBsaXN0cy4gIER1cGxpY2F0aW9uIGlzIGRldGVybWluZWQgYWNjb3JkaW5nXG4gICAgICogdG8gdGhlIHZhbHVlIHJldHVybmVkIGJ5IGFwcGx5aW5nIHRoZSBzdXBwbGllZCBwcmVkaWNhdGUgdG8gdHdvIGxpc3RcbiAgICAgKiBlbGVtZW50cy5cbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgUmVsYXRpb25cbiAgICAgKiBAc2lnIChhLGEgLT4gQm9vbGVhbikgLT4gW2FdIC0+IFthXSAtPiBbYV1cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBwcmVkIEEgcHJlZGljYXRlIGZ1bmN0aW9uIHRoYXQgZGV0ZXJtaW5lcyB3aGV0aGVyXG4gICAgICogICAgICAgIHRoZSB0d28gc3VwcGxpZWQgZWxlbWVudHMgYXJlIGVxdWFsLlxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGxpc3QxIE9uZSBsaXN0IG9mIGl0ZW1zIHRvIGNvbXBhcmVcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBsaXN0MiBBIHNlY29uZCBsaXN0IG9mIGl0ZW1zIHRvIGNvbXBhcmVcbiAgICAgKiBAc2VlIFIuaW50ZXJzZWN0aW9uXG4gICAgICogQHJldHVybiB7QXJyYXl9IEEgbmV3IGxpc3QgY29udGFpbmluZyB0aG9zZSBlbGVtZW50cyBjb21tb24gdG8gYm90aCBsaXN0cy5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICB2YXIgYnVmZmFsb1NwcmluZ2ZpZWxkID0gW1xuICAgICAqICAgICAgICB7aWQ6IDgyNCwgbmFtZTogJ1JpY2hpZSBGdXJheSd9LFxuICAgICAqICAgICAgICB7aWQ6IDk1NiwgbmFtZTogJ0Rld2V5IE1hcnRpbid9LFxuICAgICAqICAgICAgICB7aWQ6IDMxMywgbmFtZTogJ0JydWNlIFBhbG1lcid9LFxuICAgICAqICAgICAgICB7aWQ6IDQ1NiwgbmFtZTogJ1N0ZXBoZW4gU3RpbGxzJ30sXG4gICAgICogICAgICAgIHtpZDogMTc3LCBuYW1lOiAnTmVpbCBZb3VuZyd9XG4gICAgICogICAgICBdO1xuICAgICAqICAgICAgdmFyIGNzbnkgPSBbXG4gICAgICogICAgICAgIHtpZDogMjA0LCBuYW1lOiAnRGF2aWQgQ3Jvc2J5J30sXG4gICAgICogICAgICAgIHtpZDogNDU2LCBuYW1lOiAnU3RlcGhlbiBTdGlsbHMnfSxcbiAgICAgKiAgICAgICAge2lkOiA1MzksIG5hbWU6ICdHcmFoYW0gTmFzaCd9LFxuICAgICAqICAgICAgICB7aWQ6IDE3NywgbmFtZTogJ05laWwgWW91bmcnfVxuICAgICAqICAgICAgXTtcbiAgICAgKlxuICAgICAqICAgICAgdmFyIHNhbWVJZCA9IGZ1bmN0aW9uKG8xLCBvMikge3JldHVybiBvMS5pZCA9PT0gbzIuaWQ7fTtcbiAgICAgKlxuICAgICAqICAgICAgUi5pbnRlcnNlY3Rpb25XaXRoKHNhbWVJZCwgYnVmZmFsb1NwcmluZ2ZpZWxkLCBjc255KTtcbiAgICAgKiAgICAgIC8vPT4gW3tpZDogNDU2LCBuYW1lOiAnU3RlcGhlbiBTdGlsbHMnfSwge2lkOiAxNzcsIG5hbWU6ICdOZWlsIFlvdW5nJ31dXG4gICAgICovXG4gICAgdmFyIGludGVyc2VjdGlvbldpdGggPSBfY3VycnkzKGZ1bmN0aW9uIGludGVyc2VjdGlvbldpdGgocHJlZCwgbGlzdDEsIGxpc3QyKSB7XG4gICAgICAgIHZhciByZXN1bHRzID0gW10sIGlkeCA9IDA7XG4gICAgICAgIHdoaWxlIChpZHggPCBsaXN0MS5sZW5ndGgpIHtcbiAgICAgICAgICAgIGlmIChfY29udGFpbnNXaXRoKHByZWQsIGxpc3QxW2lkeF0sIGxpc3QyKSkge1xuICAgICAgICAgICAgICAgIHJlc3VsdHNbcmVzdWx0cy5sZW5ndGhdID0gbGlzdDFbaWR4XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlkeCArPSAxO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB1bmlxV2l0aChwcmVkLCByZXN1bHRzKTtcbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSBuZXcgbGlzdCB3aXRoIHRoZSBzZXBhcmF0b3IgaW50ZXJwb3NlZCBiZXR3ZWVuIGVsZW1lbnRzLlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBMaXN0XG4gICAgICogQHNpZyBhIC0+IFthXSAtPiBbYV1cbiAgICAgKiBAcGFyYW0geyp9IHNlcGFyYXRvciBUaGUgZWxlbWVudCB0byBhZGQgdG8gdGhlIGxpc3QuXG4gICAgICogQHBhcmFtIHtBcnJheX0gbGlzdCBUaGUgbGlzdCB0byBiZSBpbnRlcnBvc2VkLlxuICAgICAqIEByZXR1cm4ge0FycmF5fSBUaGUgbmV3IGxpc3QuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgUi5pbnRlcnNwZXJzZSgnbicsIFsnYmEnLCAnYScsICdhJ10pOyAvLz0+IFsnYmEnLCAnbicsICdhJywgJ24nLCAnYSddXG4gICAgICovXG4gICAgdmFyIGludGVyc3BlcnNlID0gX2N1cnJ5MihfY2hlY2tGb3JNZXRob2QoJ2ludGVyc3BlcnNlJywgZnVuY3Rpb24gaW50ZXJzcGVyc2Uoc2VwYXJhdG9yLCBsaXN0KSB7XG4gICAgICAgIHZhciBvdXQgPSBbXTtcbiAgICAgICAgdmFyIGlkeCA9IDA7XG4gICAgICAgIHdoaWxlIChpZHggPCBsaXN0Lmxlbmd0aCkge1xuICAgICAgICAgICAgaWYgKGlkeCA9PT0gbGlzdC5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICAgICAgb3V0LnB1c2gobGlzdFtpZHhdKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgb3V0LnB1c2gobGlzdFtpZHhdLCBzZXBhcmF0b3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWR4ICs9IDE7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9KSk7XG5cbiAgICAvKipcbiAgICAgKiBTYW1lIGFzIFIuaW52ZXJ0T2JqLCBob3dldmVyIHRoaXMgYWNjb3VudHMgZm9yIG9iamVjdHNcbiAgICAgKiB3aXRoIGR1cGxpY2F0ZSB2YWx1ZXMgYnkgcHV0dGluZyB0aGUgdmFsdWVzIGludG8gYW5cbiAgICAgKiBhcnJheS5cbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgT2JqZWN0XG4gICAgICogQHNpZyB7czogeH0gLT4ge3g6IFsgcywgLi4uIF19XG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9iaiBUaGUgb2JqZWN0IG9yIGFycmF5IHRvIGludmVydFxuICAgICAqIEByZXR1cm4ge09iamVjdH0gb3V0IEEgbmV3IG9iamVjdCB3aXRoIGtleXNcbiAgICAgKiBpbiBhbiBhcnJheS5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICB2YXIgcmFjZVJlc3VsdHNCeUZpcnN0TmFtZSA9IHtcbiAgICAgKiAgICAgICAgZmlyc3Q6ICdhbGljZScsXG4gICAgICogICAgICAgIHNlY29uZDogJ2pha2UnLFxuICAgICAqICAgICAgICB0aGlyZDogJ2FsaWNlJyxcbiAgICAgKiAgICAgIH07XG4gICAgICogICAgICBSLmludmVydChyYWNlUmVzdWx0c0J5Rmlyc3ROYW1lKTtcbiAgICAgKiAgICAgIC8vPT4geyAnYWxpY2UnOiBbJ2ZpcnN0JywgJ3RoaXJkJ10sICdqYWtlJzpbJ3NlY29uZCddIH1cbiAgICAgKi9cbiAgICB2YXIgaW52ZXJ0ID0gX2N1cnJ5MShmdW5jdGlvbiBpbnZlcnQob2JqKSB7XG4gICAgICAgIHZhciBwcm9wcyA9IGtleXMob2JqKTtcbiAgICAgICAgdmFyIGlkeCA9IDA7XG4gICAgICAgIHZhciBvdXQgPSB7fTtcbiAgICAgICAgd2hpbGUgKGlkeCA8IHByb3BzLmxlbmd0aCkge1xuICAgICAgICAgICAgdmFyIGtleSA9IHByb3BzW2lkeF07XG4gICAgICAgICAgICB2YXIgdmFsID0gb2JqW2tleV07XG4gICAgICAgICAgICB2YXIgbGlzdCA9IF9oYXModmFsLCBvdXQpID8gb3V0W3ZhbF0gOiBvdXRbdmFsXSA9IFtdO1xuICAgICAgICAgICAgbGlzdFtsaXN0Lmxlbmd0aF0gPSBrZXk7XG4gICAgICAgICAgICBpZHggKz0gMTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhIG5ldyBvYmplY3Qgd2l0aCB0aGUga2V5cyBvZiB0aGUgZ2l2ZW4gb2JqZWN0XG4gICAgICogYXMgdmFsdWVzLCBhbmQgdGhlIHZhbHVlcyBvZiB0aGUgZ2l2ZW4gb2JqZWN0IGFzIGtleXMuXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IE9iamVjdFxuICAgICAqIEBzaWcge3M6IHh9IC0+IHt4OiBzfVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvYmogVGhlIG9iamVjdCBvciBhcnJheSB0byBpbnZlcnRcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IG91dCBBIG5ldyBvYmplY3RcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICB2YXIgcmFjZVJlc3VsdHMgPSB7XG4gICAgICogICAgICAgIGZpcnN0OiAnYWxpY2UnLFxuICAgICAqICAgICAgICBzZWNvbmQ6ICdqYWtlJ1xuICAgICAqICAgICAgfTtcbiAgICAgKiAgICAgIFIuaW52ZXJ0T2JqKHJhY2VSZXN1bHRzKTtcbiAgICAgKiAgICAgIC8vPT4geyAnYWxpY2UnOiAnZmlyc3QnLCAnamFrZSc6J3NlY29uZCcgfVxuICAgICAqXG4gICAgICogICAgICAvLyBBbHRlcm5hdGl2ZWx5OlxuICAgICAqICAgICAgdmFyIHJhY2VSZXN1bHRzID0gWydhbGljZScsICdqYWtlJ107XG4gICAgICogICAgICBSLmludmVydE9iaihyYWNlUmVzdWx0cyk7XG4gICAgICogICAgICAvLz0+IHsgJ2FsaWNlJzogJzAnLCAnamFrZSc6JzEnIH1cbiAgICAgKi9cbiAgICB2YXIgaW52ZXJ0T2JqID0gX2N1cnJ5MShmdW5jdGlvbiBpbnZlcnRPYmoob2JqKSB7XG4gICAgICAgIHZhciBwcm9wcyA9IGtleXMob2JqKTtcbiAgICAgICAgdmFyIGlkeCA9IDA7XG4gICAgICAgIHZhciBvdXQgPSB7fTtcbiAgICAgICAgd2hpbGUgKGlkeCA8IHByb3BzLmxlbmd0aCkge1xuICAgICAgICAgICAgdmFyIGtleSA9IHByb3BzW2lkeF07XG4gICAgICAgICAgICBvdXRbb2JqW2tleV1dID0ga2V5O1xuICAgICAgICAgICAgaWR4ICs9IDE7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIFR1cm5zIGEgbmFtZWQgbWV0aG9kIHdpdGggYSBzcGVjaWZpZWQgYXJpdHkgaW50byBhIGZ1bmN0aW9uXG4gICAgICogdGhhdCBjYW4gYmUgY2FsbGVkIGRpcmVjdGx5IHN1cHBsaWVkIHdpdGggYXJndW1lbnRzIGFuZCBhIHRhcmdldCBvYmplY3QuXG4gICAgICpcbiAgICAgKiBUaGUgcmV0dXJuZWQgZnVuY3Rpb24gaXMgY3VycmllZCBhbmQgYWNjZXB0cyBgYXJpdHkgKyAxYCBwYXJhbWV0ZXJzIHdoZXJlXG4gICAgICogdGhlIGZpbmFsIHBhcmFtZXRlciBpcyB0aGUgdGFyZ2V0IG9iamVjdC5cbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgRnVuY3Rpb25cbiAgICAgKiBAc2lnIE51bWJlciAtPiBTdHJpbmcgLT4gKGEgLT4gYiAtPiAuLi4gLT4gbiAtPiBPYmplY3QgLT4gKilcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gYXJpdHkgTnVtYmVyIG9mIGFyZ3VtZW50cyB0aGUgcmV0dXJuZWQgZnVuY3Rpb24gc2hvdWxkIHRha2VcbiAgICAgKiAgICAgICAgYmVmb3JlIHRoZSB0YXJnZXQgb2JqZWN0LlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IG1ldGhvZCBOYW1lIG9mIHRoZSBtZXRob2QgdG8gY2FsbC5cbiAgICAgKiBAcmV0dXJuIHtGdW5jdGlvbn0gQSBuZXcgY3VycmllZCBmdW5jdGlvbi5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICB2YXIgc2xpY2VGcm9tID0gUi5pbnZva2VyKDEsICdzbGljZScpO1xuICAgICAqICAgICAgc2xpY2VGcm9tKDYsICdhYmNkZWZnaGlqa2xtJyk7IC8vPT4gJ2doaWprbG0nXG4gICAgICogICAgICB2YXIgc2xpY2VGcm9tNiA9IFIuaW52b2tlcigyLCAnc2xpY2UnKSg2KTtcbiAgICAgKiAgICAgIHNsaWNlRnJvbTYoOCwgJ2FiY2RlZmdoaWprbG0nKTsgLy89PiAnZ2gnXG4gICAgICovXG4gICAgdmFyIGludm9rZXIgPSBfY3VycnkyKGZ1bmN0aW9uIGludm9rZXIoYXJpdHksIG1ldGhvZCkge1xuICAgICAgICByZXR1cm4gY3VycnlOKGFyaXR5ICsgMSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHRhcmdldCA9IGFyZ3VtZW50c1thcml0eV07XG4gICAgICAgICAgICByZXR1cm4gdGFyZ2V0W21ldGhvZF0uYXBwbHkodGFyZ2V0LCBfc2xpY2UoYXJndW1lbnRzLCAwLCBhcml0eSkpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYSBzdHJpbmcgbWFkZSBieSBpbnNlcnRpbmcgdGhlIGBzZXBhcmF0b3JgIGJldHdlZW4gZWFjaFxuICAgICAqIGVsZW1lbnQgYW5kIGNvbmNhdGVuYXRpbmcgYWxsIHRoZSBlbGVtZW50cyBpbnRvIGEgc2luZ2xlIHN0cmluZy5cbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgTGlzdFxuICAgICAqIEBzaWcgU3RyaW5nIC0+IFthXSAtPiBTdHJpbmdcbiAgICAgKiBAcGFyYW0ge051bWJlcnxTdHJpbmd9IHNlcGFyYXRvciBUaGUgc3RyaW5nIHVzZWQgdG8gc2VwYXJhdGUgdGhlIGVsZW1lbnRzLlxuICAgICAqIEBwYXJhbSB7QXJyYXl9IHhzIFRoZSBlbGVtZW50cyB0byBqb2luIGludG8gYSBzdHJpbmcuXG4gICAgICogQHJldHVybiB7U3RyaW5nfSBzdHIgVGhlIHN0cmluZyBtYWRlIGJ5IGNvbmNhdGVuYXRpbmcgYHhzYCB3aXRoIGBzZXBhcmF0b3JgLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIHZhciBzcGFjZXIgPSBSLmpvaW4oJyAnKTtcbiAgICAgKiAgICAgIHNwYWNlcihbJ2EnLCAyLCAzLjRdKTsgICAvLz0+ICdhIDIgMy40J1xuICAgICAqICAgICAgUi5qb2luKCd8JywgWzEsIDIsIDNdKTsgICAgLy89PiAnMXwyfDMnXG4gICAgICovXG4gICAgdmFyIGpvaW4gPSBpbnZva2VyKDEsICdqb2luJyk7XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBsYXN0IGVsZW1lbnQgZnJvbSBhIGxpc3QuXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IExpc3RcbiAgICAgKiBAc2lnIFthXSAtPiBhXG4gICAgICogQHBhcmFtIHtBcnJheX0gbGlzdCBUaGUgYXJyYXkgdG8gY29uc2lkZXIuXG4gICAgICogQHJldHVybiB7Kn0gVGhlIGxhc3QgZWxlbWVudCBvZiB0aGUgbGlzdCwgb3IgYHVuZGVmaW5lZGAgaWYgdGhlIGxpc3QgaXMgZW1wdHkuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgUi5sYXN0KFsnZmknLCAnZm8nLCAnZnVtJ10pOyAvLz0+ICdmdW0nXG4gICAgICovXG4gICAgdmFyIGxhc3QgPSBudGgoLTEpO1xuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIGxlbnMgdGhhdCB3aWxsIGZvY3VzIG9uIGluZGV4IGBuYCBvZiB0aGUgc291cmNlIGFycmF5LlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBMaXN0XG4gICAgICogQHNlZSBSLmxlbnNcbiAgICAgKiBAc2lnIE51bWJlciAtPiAoYSAtPiBiKVxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBuIFRoZSBpbmRleCBvZiB0aGUgYXJyYXkgdGhhdCB0aGUgcmV0dXJuZWQgbGVucyB3aWxsIGZvY3VzIG9uLlxuICAgICAqIEByZXR1cm4ge0Z1bmN0aW9ufSB0aGUgcmV0dXJuZWQgZnVuY3Rpb24gaGFzIGBzZXRgIGFuZCBgbWFwYCBwcm9wZXJ0aWVzIHRoYXQgYXJlXG4gICAgICogICAgICAgICBhbHNvIGN1cnJpZWQgZnVuY3Rpb25zLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgdmFyIGhlYWRMZW5zID0gUi5sZW5zSW5kZXgoMCk7XG4gICAgICogICAgIGhlYWRMZW5zKFsxMCwgMjAsIDMwLCA0MF0pOyAvLz0+IDEwXG4gICAgICogICAgIGhlYWRMZW5zLnNldCgnbXUnLCBbMTAsIDIwLCAzMCwgNDBdKTsgLy89PiBbJ211JywgMjAsIDMwLCA0MF1cbiAgICAgKiAgICAgaGVhZExlbnMubWFwKGZ1bmN0aW9uKHgpIHsgcmV0dXJuIHggKyAxOyB9LCBbMTAsIDIwLCAzMCwgNDBdKTsgLy89PiBbMTEsIDIwLCAzMCwgNDBdXG4gICAgICovXG4gICAgdmFyIGxlbnNJbmRleCA9IGZ1bmN0aW9uIGxlbnNJbmRleChuKSB7XG4gICAgICAgIHJldHVybiBsZW5zKG50aChuKSwgZnVuY3Rpb24gKHgsIHhzKSB7XG4gICAgICAgICAgICByZXR1cm4gX3NsaWNlKHhzLCAwLCBuKS5jb25jYXQoW3hdLCBfc2xpY2UoeHMsIG4gKyAxKSk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgbGVucyB0aGF0IHdpbGwgZm9jdXMgb24gcHJvcGVydHkgYGtgIG9mIHRoZSBzb3VyY2Ugb2JqZWN0LlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBPYmplY3RcbiAgICAgKiBAc2VlIFIubGVuc1xuICAgICAqIEBzaWcgU3RyaW5nIC0+IChhIC0+IGIpXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGsgQSBzdHJpbmcgdGhhdCByZXByZXNlbnRzIGEgcHJvcGVydHkgdG8gZm9jdXMgb24uXG4gICAgICogQHJldHVybiB7RnVuY3Rpb259IHRoZSByZXR1cm5lZCBmdW5jdGlvbiBoYXMgYHNldGAgYW5kIGBtYXBgIHByb3BlcnRpZXMgdGhhdCBhcmVcbiAgICAgKiAgICAgICAgIGFsc28gY3VycmllZCBmdW5jdGlvbnMuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICB2YXIgcGhyYXNlTGVucyA9IFIubGVuc1Byb3AoJ3BocmFzZScpO1xuICAgICAqICAgICB2YXIgb2JqMSA9IHsgcGhyYXNlOiAnQWJzb2x1dGUgZmlsdGggLiAuIC4gYW5kIEkgTE9WRUQgaXQhJ307XG4gICAgICogICAgIHZhciBvYmoyID0geyBwaHJhc2U6IFwiV2hhdCdzIGFsbCB0aGlzLCB0aGVuP1wifTtcbiAgICAgKiAgICAgcGhyYXNlTGVucyhvYmoxKTsgLy8gPT4gJ0Fic29sdXRlIGZpbHRoIC4gLiAuIGFuZCBJIExPVkVEIGl0ISdcbiAgICAgKiAgICAgcGhyYXNlTGVucyhvYmoyKTsgLy8gPT4gXCJXaGF0J3MgYWxsIHRoaXMsIHRoZW4/XCJcbiAgICAgKiAgICAgcGhyYXNlTGVucy5zZXQoJ09vaCBCZXR0eScsIG9iajEpOyAvLz0+IHsgcGhyYXNlOiAnT29oIEJldHR5J31cbiAgICAgKiAgICAgcGhyYXNlTGVucy5tYXAoUi50b1VwcGVyLCBvYmoyKTsgLy89PiB7IHBocmFzZTogXCJXSEFUJ1MgQUxMIFRISVMsIFRIRU4/XCJ9XG4gICAgICovXG4gICAgdmFyIGxlbnNQcm9wID0gZnVuY3Rpb24gKGspIHtcbiAgICAgICAgcmV0dXJuIGxlbnMocHJvcChrKSwgYXNzb2MoaykpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGEgbmV3IGxpc3QsIGNvbnN0cnVjdGVkIGJ5IGFwcGx5aW5nIHRoZSBzdXBwbGllZCBmdW5jdGlvbiB0byBldmVyeSBlbGVtZW50IG9mIHRoZVxuICAgICAqIHN1cHBsaWVkIGxpc3QuXG4gICAgICpcbiAgICAgKiBOb3RlOiBgUi5tYXBgIGRvZXMgbm90IHNraXAgZGVsZXRlZCBvciB1bmFzc2lnbmVkIGluZGljZXMgKHNwYXJzZSBhcnJheXMpLCB1bmxpa2UgdGhlXG4gICAgICogbmF0aXZlIGBBcnJheS5wcm90b3R5cGUubWFwYCBtZXRob2QuIEZvciBtb3JlIGRldGFpbHMgb24gdGhpcyBiZWhhdmlvciwgc2VlOlxuICAgICAqIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL0FycmF5L21hcCNEZXNjcmlwdGlvblxuICAgICAqXG4gICAgICogQWN0cyBhcyBhIHRyYW5zZHVjZXIgaWYgYSB0cmFuc2Zvcm1lciBpcyBnaXZlbiBpbiBsaXN0IHBvc2l0aW9uLlxuICAgICAqIEBzZWUgUi50cmFuc2R1Y2VcbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgTGlzdFxuICAgICAqIEBzaWcgKGEgLT4gYikgLT4gW2FdIC0+IFtiXVxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBmdW5jdGlvbiB0byBiZSBjYWxsZWQgb24gZXZlcnkgZWxlbWVudCBvZiB0aGUgaW5wdXQgYGxpc3RgLlxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGxpc3QgVGhlIGxpc3QgdG8gYmUgaXRlcmF0ZWQgb3Zlci5cbiAgICAgKiBAcmV0dXJuIHtBcnJheX0gVGhlIG5ldyBsaXN0LlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIHZhciBkb3VibGUgPSBmdW5jdGlvbih4KSB7XG4gICAgICogICAgICAgIHJldHVybiB4ICogMjtcbiAgICAgKiAgICAgIH07XG4gICAgICpcbiAgICAgKiAgICAgIFIubWFwKGRvdWJsZSwgWzEsIDIsIDNdKTsgLy89PiBbMiwgNCwgNl1cbiAgICAgKi9cbiAgICB2YXIgbWFwID0gX2N1cnJ5MihfZGlzcGF0Y2hhYmxlKCdtYXAnLCBfeG1hcCwgX21hcCkpO1xuXG4gICAgLyoqXG4gICAgICogTWFwLCBidXQgZm9yIG9iamVjdHMuIENyZWF0ZXMgYW4gb2JqZWN0IHdpdGggdGhlIHNhbWUga2V5cyBhcyBgb2JqYCBhbmQgdmFsdWVzXG4gICAgICogZ2VuZXJhdGVkIGJ5IHJ1bm5pbmcgZWFjaCBwcm9wZXJ0eSBvZiBgb2JqYCB0aHJvdWdoIGBmbmAuIGBmbmAgaXMgcGFzc2VkIG9uZSBhcmd1bWVudDpcbiAgICAgKiAqKHZhbHVlKSouXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IE9iamVjdFxuICAgICAqIEBzaWcgKHYgLT4gdikgLT4ge2s6IHZ9IC0+IHtrOiB2fVxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIEEgZnVuY3Rpb24gY2FsbGVkIGZvciBlYWNoIHByb3BlcnR5IGluIGBvYmpgLiBJdHMgcmV0dXJuIHZhbHVlIHdpbGxcbiAgICAgKiBiZWNvbWUgYSBuZXcgcHJvcGVydHkgb24gdGhlIHJldHVybiBvYmplY3QuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9iaiBUaGUgb2JqZWN0IHRvIGl0ZXJhdGUgb3Zlci5cbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IEEgbmV3IG9iamVjdCB3aXRoIHRoZSBzYW1lIGtleXMgYXMgYG9iamAgYW5kIHZhbHVlcyB0aGF0IGFyZSB0aGUgcmVzdWx0XG4gICAgICogICAgICAgICBvZiBydW5uaW5nIGVhY2ggcHJvcGVydHkgdGhyb3VnaCBgZm5gLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIHZhciB2YWx1ZXMgPSB7IHg6IDEsIHk6IDIsIHo6IDMgfTtcbiAgICAgKiAgICAgIHZhciBkb3VibGUgPSBmdW5jdGlvbihudW0pIHtcbiAgICAgKiAgICAgICAgcmV0dXJuIG51bSAqIDI7XG4gICAgICogICAgICB9O1xuICAgICAqXG4gICAgICogICAgICBSLm1hcE9iaihkb3VibGUsIHZhbHVlcyk7IC8vPT4geyB4OiAyLCB5OiA0LCB6OiA2IH1cbiAgICAgKi9cbiAgICB2YXIgbWFwT2JqID0gX2N1cnJ5MihmdW5jdGlvbiBtYXBPYmplY3QoZm4sIG9iaikge1xuICAgICAgICByZXR1cm4gX3JlZHVjZShmdW5jdGlvbiAoYWNjLCBrZXkpIHtcbiAgICAgICAgICAgIGFjY1trZXldID0gZm4ob2JqW2tleV0pO1xuICAgICAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgICAgfSwge30sIGtleXMob2JqKSk7XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBMaWtlIGBtYXBPYmpgLCBidXQgYnV0IHBhc3NlcyBhZGRpdGlvbmFsIGFyZ3VtZW50cyB0byB0aGUgcHJlZGljYXRlIGZ1bmN0aW9uLiBUaGVcbiAgICAgKiBwcmVkaWNhdGUgZnVuY3Rpb24gaXMgcGFzc2VkIHRocmVlIGFyZ3VtZW50czogKih2YWx1ZSwga2V5LCBvYmopKi5cbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgT2JqZWN0XG4gICAgICogQHNpZyAodiwgaywge2s6IHZ9IC0+IHYpIC0+IHtrOiB2fSAtPiB7azogdn1cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBBIGZ1bmN0aW9uIGNhbGxlZCBmb3IgZWFjaCBwcm9wZXJ0eSBpbiBgb2JqYC4gSXRzIHJldHVybiB2YWx1ZSB3aWxsXG4gICAgICogICAgICAgIGJlY29tZSBhIG5ldyBwcm9wZXJ0eSBvbiB0aGUgcmV0dXJuIG9iamVjdC5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb2JqIFRoZSBvYmplY3QgdG8gaXRlcmF0ZSBvdmVyLlxuICAgICAqIEByZXR1cm4ge09iamVjdH0gQSBuZXcgb2JqZWN0IHdpdGggdGhlIHNhbWUga2V5cyBhcyBgb2JqYCBhbmQgdmFsdWVzIHRoYXQgYXJlIHRoZSByZXN1bHRcbiAgICAgKiAgICAgICAgIG9mIHJ1bm5pbmcgZWFjaCBwcm9wZXJ0eSB0aHJvdWdoIGBmbmAuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgdmFyIHZhbHVlcyA9IHsgeDogMSwgeTogMiwgejogMyB9O1xuICAgICAqICAgICAgdmFyIHByZXBlbmRLZXlBbmREb3VibGUgPSBmdW5jdGlvbihudW0sIGtleSwgb2JqKSB7XG4gICAgICogICAgICAgIHJldHVybiBrZXkgKyAobnVtICogMik7XG4gICAgICogICAgICB9O1xuICAgICAqXG4gICAgICogICAgICBSLm1hcE9iakluZGV4ZWQocHJlcGVuZEtleUFuZERvdWJsZSwgdmFsdWVzKTsgLy89PiB7IHg6ICd4MicsIHk6ICd5NCcsIHo6ICd6NicgfVxuICAgICAqL1xuICAgIHZhciBtYXBPYmpJbmRleGVkID0gX2N1cnJ5MihmdW5jdGlvbiBtYXBPYmplY3RJbmRleGVkKGZuLCBvYmopIHtcbiAgICAgICAgcmV0dXJuIF9yZWR1Y2UoZnVuY3Rpb24gKGFjYywga2V5KSB7XG4gICAgICAgICAgICBhY2Nba2V5XSA9IGZuKG9ialtrZXldLCBrZXksIG9iaik7XG4gICAgICAgICAgICByZXR1cm4gYWNjO1xuICAgICAgICB9LCB7fSwga2V5cyhvYmopKTtcbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIFRlc3RzIGEgcmVndWxhciBleHByZXNzaW9uIGFnYWluc3QgYSBTdHJpbmdcbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgU3RyaW5nXG4gICAgICogQHNpZyBSZWdFeHAgLT4gU3RyaW5nIC0+IFtTdHJpbmddIHwgbnVsbFxuICAgICAqIEBwYXJhbSB7UmVnRXhwfSByeCBBIHJlZ3VsYXIgZXhwcmVzc2lvbi5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gc3RyIFRoZSBzdHJpbmcgdG8gbWF0Y2ggYWdhaW5zdFxuICAgICAqIEByZXR1cm4ge0FycmF5fSBUaGUgbGlzdCBvZiBtYXRjaGVzLCBvciBudWxsIGlmIG5vIG1hdGNoZXMgZm91bmQuXG4gICAgICogQHNlZSBSLmludm9rZXJcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICBSLm1hdGNoKC8oW2Etel1hKS9nLCAnYmFuYW5hcycpOyAvLz0+IFsnYmEnLCAnbmEnLCAnbmEnXVxuICAgICAqL1xuICAgIHZhciBtYXRjaCA9IGludm9rZXIoMSwgJ21hdGNoJyk7XG5cbiAgICAvKipcbiAgICAgKiBEZXRlcm1pbmVzIHRoZSBsYXJnZXN0IG9mIGEgbGlzdCBvZiBudW1iZXJzIChvciBlbGVtZW50cyB0aGF0IGNhbiBiZSBjYXN0IHRvIG51bWJlcnMpXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IE1hdGhcbiAgICAgKiBAc2lnIFtOdW1iZXJdIC0+IE51bWJlclxuICAgICAqIEBzZWUgUi5tYXhCeVxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGxpc3QgQSBsaXN0IG9mIG51bWJlcnNcbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9IFRoZSBncmVhdGVzdCBudW1iZXIgaW4gdGhlIGxpc3QuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgUi5tYXgoWzcsIDMsIDksIDIsIDQsIDksIDNdKTsgLy89PiA5XG4gICAgICovXG4gICAgdmFyIG1heCA9IF9jcmVhdGVNYXhNaW4oX2d0LCAtSW5maW5pdHkpO1xuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlIGEgbmV3IG9iamVjdCB3aXRoIHRoZSBvd24gcHJvcGVydGllcyBvZiBhXG4gICAgICogbWVyZ2VkIHdpdGggdGhlIG93biBwcm9wZXJ0aWVzIG9mIG9iamVjdCBiLlxuICAgICAqIFRoaXMgZnVuY3Rpb24gd2lsbCAqbm90KiBtdXRhdGUgcGFzc2VkLWluIG9iamVjdHMuXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IE9iamVjdFxuICAgICAqIEBzaWcge2s6IHZ9IC0+IHtrOiB2fSAtPiB7azogdn1cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gYSBzb3VyY2Ugb2JqZWN0XG4gICAgICogQHBhcmFtIHtPYmplY3R9IGIgb2JqZWN0IHdpdGggaGlnaGVyIHByZWNlZGVuY2UgaW4gb3V0cHV0XG4gICAgICogQHJldHVybiB7T2JqZWN0fSBUaGUgZGVzdGluYXRpb24gb2JqZWN0LlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIFIubWVyZ2UoeyAnbmFtZSc6ICdmcmVkJywgJ2FnZSc6IDEwIH0sIHsgJ2FnZSc6IDQwIH0pO1xuICAgICAqICAgICAgLy89PiB7ICduYW1lJzogJ2ZyZWQnLCAnYWdlJzogNDAgfVxuICAgICAqXG4gICAgICogICAgICB2YXIgcmVzZXRUb0RlZmF1bHQgPSBSLm1lcmdlKFIuX18sIHt4OiAwfSk7XG4gICAgICogICAgICByZXNldFRvRGVmYXVsdCh7eDogNSwgeTogMn0pOyAvLz0+IHt4OiAwLCB5OiAyfVxuICAgICAqL1xuICAgIHZhciBtZXJnZSA9IF9jdXJyeTIoZnVuY3Rpb24gbWVyZ2UoYSwgYikge1xuICAgICAgICByZXR1cm4gX2V4dGVuZChfZXh0ZW5kKHt9LCBhKSwgYik7XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBEZXRlcm1pbmVzIHRoZSBzbWFsbGVzdCBvZiBhIGxpc3Qgb2YgbnVtYmVycyAob3IgZWxlbWVudHMgdGhhdCBjYW4gYmUgY2FzdCB0byBudW1iZXJzKVxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBNYXRoXG4gICAgICogQHNpZyBbTnVtYmVyXSAtPiBOdW1iZXJcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBsaXN0IEEgbGlzdCBvZiBudW1iZXJzXG4gICAgICogQHJldHVybiB7TnVtYmVyfSBUaGUgZ3JlYXRlc3QgbnVtYmVyIGluIHRoZSBsaXN0LlxuICAgICAqIEBzZWUgUi5taW5CeVxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIFIubWluKFs3LCAzLCA5LCAyLCA0LCA5LCAzXSk7IC8vPT4gMlxuICAgICAqL1xuICAgIHZhciBtaW4gPSBfY3JlYXRlTWF4TWluKF9sdCwgSW5maW5pdHkpO1xuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBgdHJ1ZWAgaWYgbm8gZWxlbWVudHMgb2YgdGhlIGxpc3QgbWF0Y2ggdGhlIHByZWRpY2F0ZSxcbiAgICAgKiBgZmFsc2VgIG90aGVyd2lzZS5cbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgTGlzdFxuICAgICAqIEBzaWcgKGEgLT4gQm9vbGVhbikgLT4gW2FdIC0+IEJvb2xlYW5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgcHJlZGljYXRlIGZ1bmN0aW9uLlxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGxpc3QgVGhlIGFycmF5IHRvIGNvbnNpZGVyLlxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59IGB0cnVlYCBpZiB0aGUgcHJlZGljYXRlIGlzIG5vdCBzYXRpc2ZpZWQgYnkgZXZlcnkgZWxlbWVudCwgYGZhbHNlYCBvdGhlcndpc2UuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgUi5ub25lKFIuaXNOYU4sIFsxLCAyLCAzXSk7IC8vPT4gdHJ1ZVxuICAgICAqICAgICAgUi5ub25lKFIuaXNOYU4sIFsxLCAyLCAzLCBOYU5dKTsgLy89PiBmYWxzZVxuICAgICAqL1xuICAgIHZhciBub25lID0gX2N1cnJ5MihfY29tcGxlbWVudChfZGlzcGF0Y2hhYmxlKCdhbnknLCBfeGFueSwgX2FueSkpKTtcblxuICAgIC8qKlxuICAgICAqIEEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIHRoZSBmaXJzdCB0cnV0aHkgb2YgdHdvIGFyZ3VtZW50cyBvdGhlcndpc2UgdGhlXG4gICAgICogbGFzdCBhcmd1bWVudC4gTm90ZSB0aGF0IHRoaXMgaXMgTk9UIHNob3J0LWNpcmN1aXRlZCwgbWVhbmluZyB0aGF0IGlmXG4gICAgICogZXhwcmVzc2lvbnMgYXJlIHBhc3NlZCB0aGV5IGFyZSBib3RoIGV2YWx1YXRlZC5cbiAgICAgKlxuICAgICAqIERpc3BhdGNoZXMgdG8gdGhlIGBvcmAgbWV0aG9kIG9mIHRoZSBmaXJzdCBhcmd1bWVudCBpZiBhcHBsaWNhYmxlLlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBMb2dpY1xuICAgICAqIEBzaWcgKiAtPiAqIC0+ICpcbiAgICAgKiBAcGFyYW0geyp9IGEgYW55IHZhbHVlXG4gICAgICogQHBhcmFtIHsqfSBiIGFueSBvdGhlciB2YWx1ZVxuICAgICAqIEByZXR1cm4geyp9IHRoZSBmaXJzdCB0cnV0aHkgYXJndW1lbnQsIG90aGVyd2lzZSB0aGUgbGFzdCBhcmd1bWVudC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICBSLm9yKGZhbHNlLCB0cnVlKTsgLy89PiB0cnVlXG4gICAgICogICAgICBSLm9yKDAsIFtdKTsgLy89PiBbXVxuICAgICAqICAgICAgUi5vcihudWxsLCAnJyk7ID0+ICcnXG4gICAgICovXG4gICAgdmFyIG9yID0gX2N1cnJ5MihmdW5jdGlvbiBvcihhLCBiKSB7XG4gICAgICAgIHJldHVybiBfaGFzTWV0aG9kKCdvcicsIGEpID8gYS5vcihiKSA6IGEgfHwgYjtcbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIFRha2VzIGEgcHJlZGljYXRlIGFuZCBhIGxpc3QgYW5kIHJldHVybnMgdGhlIHBhaXIgb2YgbGlzdHMgb2ZcbiAgICAgKiBlbGVtZW50cyB3aGljaCBkbyBhbmQgZG8gbm90IHNhdGlzZnkgdGhlIHByZWRpY2F0ZSwgcmVzcGVjdGl2ZWx5LlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBMaXN0XG4gICAgICogQHNpZyAoYSAtPiBCb29sZWFuKSAtPiBbYV0gLT4gW1thXSxbYV1dXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gcHJlZCBBIHByZWRpY2F0ZSB0byBkZXRlcm1pbmUgd2hpY2ggYXJyYXkgdGhlIGVsZW1lbnQgYmVsb25ncyB0by5cbiAgICAgKiBAcGFyYW0ge0FycmF5fSBsaXN0IFRoZSBhcnJheSB0byBwYXJ0aXRpb24uXG4gICAgICogQHJldHVybiB7QXJyYXl9IEEgbmVzdGVkIGFycmF5LCBjb250YWluaW5nIGZpcnN0IGFuIGFycmF5IG9mIGVsZW1lbnRzIHRoYXQgc2F0aXNmaWVkIHRoZSBwcmVkaWNhdGUsXG4gICAgICogICAgICAgICBhbmQgc2Vjb25kIGFuIGFycmF5IG9mIGVsZW1lbnRzIHRoYXQgZGlkIG5vdCBzYXRpc2Z5LlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIFIucGFydGl0aW9uKFIuY29udGFpbnMoJ3MnKSwgWydzc3MnLCAndHR0JywgJ2ZvbycsICdiYXJzJ10pO1xuICAgICAqICAgICAgLy89PiBbIFsgJ3NzcycsICdiYXJzJyBdLCAgWyAndHR0JywgJ2ZvbycgXSBdXG4gICAgICovXG4gICAgdmFyIHBhcnRpdGlvbiA9IF9jdXJyeTIoZnVuY3Rpb24gcGFydGl0aW9uKHByZWQsIGxpc3QpIHtcbiAgICAgICAgcmV0dXJuIF9yZWR1Y2UoZnVuY3Rpb24gKGFjYywgZWx0KSB7XG4gICAgICAgICAgICB2YXIgeHMgPSBhY2NbcHJlZChlbHQpID8gMCA6IDFdO1xuICAgICAgICAgICAgeHNbeHMubGVuZ3RoXSA9IGVsdDtcbiAgICAgICAgICAgIHJldHVybiBhY2M7XG4gICAgICAgIH0sIFtcbiAgICAgICAgICAgIFtdLFxuICAgICAgICAgICAgW11cbiAgICAgICAgXSwgbGlzdCk7XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBEZXRlcm1pbmVzIHdoZXRoZXIgYSBuZXN0ZWQgcGF0aCBvbiBhbiBvYmplY3QgaGFzIGEgc3BlY2lmaWMgdmFsdWUsXG4gICAgICogaW4gYFIuZXF1YWxzYCB0ZXJtcy4gTW9zdCBsaWtlbHkgdXNlZCB0byBmaWx0ZXIgYSBsaXN0LlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBSZWxhdGlvblxuICAgICAqIEBzaWcgW1N0cmluZ10gLT4gKiAtPiB7U3RyaW5nOiAqfSAtPiBCb29sZWFuXG4gICAgICogQHBhcmFtIHtBcnJheX0gcGF0aCBUaGUgcGF0aCBvZiB0aGUgbmVzdGVkIHByb3BlcnR5IHRvIHVzZVxuICAgICAqIEBwYXJhbSB7Kn0gdmFsIFRoZSB2YWx1ZSB0byBjb21wYXJlIHRoZSBuZXN0ZWQgcHJvcGVydHkgd2l0aFxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvYmogVGhlIG9iamVjdCB0byBjaGVjayB0aGUgbmVzdGVkIHByb3BlcnR5IGluXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn0gYHRydWVgIGlmIHRoZSB2YWx1ZSBlcXVhbHMgdGhlIG5lc3RlZCBvYmplY3QgcHJvcGVydHksXG4gICAgICogICAgICAgICBgZmFsc2VgIG90aGVyd2lzZS5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICB2YXIgdXNlcjEgPSB7IGFkZHJlc3M6IHsgemlwQ29kZTogOTAyMTAgfSB9O1xuICAgICAqICAgICAgdmFyIHVzZXIyID0geyBhZGRyZXNzOiB7IHppcENvZGU6IDU1NTU1IH0gfTtcbiAgICAgKiAgICAgIHZhciB1c2VyMyA9IHsgbmFtZTogJ0JvYicgfTtcbiAgICAgKiAgICAgIHZhciB1c2VycyA9IFsgdXNlcjEsIHVzZXIyLCB1c2VyMyBdO1xuICAgICAqICAgICAgdmFyIGlzRmFtb3VzID0gUi5wYXRoRXEoWydhZGRyZXNzJywgJ3ppcENvZGUnXSwgOTAyMTApO1xuICAgICAqICAgICAgUi5maWx0ZXIoaXNGYW1vdXMsIHVzZXJzKTsgLy89PiBbIHVzZXIxIF1cbiAgICAgKi9cbiAgICB2YXIgcGF0aEVxID0gX2N1cnJ5MyhmdW5jdGlvbiBwYXRoRXEocGF0aCwgdmFsLCBvYmopIHtcbiAgICAgICAgcmV0dXJuIGVxdWFscyhfcGF0aChwYXRoLCBvYmopLCB2YWwpO1xuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIG5ldyBmdW5jdGlvbiB0aGF0IHJ1bnMgZWFjaCBvZiB0aGUgZnVuY3Rpb25zIHN1cHBsaWVkIGFzIHBhcmFtZXRlcnMgaW4gdHVybixcbiAgICAgKiBwYXNzaW5nIHRoZSByZXR1cm4gdmFsdWUgb2YgZWFjaCBmdW5jdGlvbiBpbnZvY2F0aW9uIHRvIHRoZSBuZXh0IGZ1bmN0aW9uIGludm9jYXRpb24sXG4gICAgICogYmVnaW5uaW5nIHdpdGggd2hhdGV2ZXIgYXJndW1lbnRzIHdlcmUgcGFzc2VkIHRvIHRoZSBpbml0aWFsIGludm9jYXRpb24uXG4gICAgICpcbiAgICAgKiBgcGlwZWAgaXMgdGhlIG1pcnJvciB2ZXJzaW9uIG9mIGBjb21wb3NlYC4gYHBpcGVgIGlzIGxlZnQtYXNzb2NpYXRpdmUsIHdoaWNoIG1lYW5zIHRoYXRcbiAgICAgKiBlYWNoIG9mIHRoZSBmdW5jdGlvbnMgcHJvdmlkZWQgaXMgZXhlY3V0ZWQgaW4gb3JkZXIgZnJvbSBsZWZ0IHRvIHJpZ2h0LlxuICAgICAqXG4gICAgICogSW4gc29tZSBsaWJyYXJpZXMgdGhpcyBmdW5jdGlvbiBpcyBuYW1lZCBgc2VxdWVuY2VgLlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgRnVuY3Rpb25cbiAgICAgKiBAc2lnICgoYS4uLiAtPiBiKSwgKGIgLT4gYyksIC4uLiwgKHggLT4geSksICh5IC0+IHopKSAtPiAoYS4uLiAtPiB6KVxuICAgICAqIEBwYXJhbSB7Li4uRnVuY3Rpb259IGZ1bmN0aW9ucyBBIHZhcmlhYmxlIG51bWJlciBvZiBmdW5jdGlvbnMuXG4gICAgICogQHJldHVybiB7RnVuY3Rpb259IEEgbmV3IGZ1bmN0aW9uIHdoaWNoIHJlcHJlc2VudHMgdGhlIHJlc3VsdCBvZiBjYWxsaW5nIGVhY2ggb2YgdGhlXG4gICAgICogICAgICAgICBpbnB1dCBgZnVuY3Rpb25zYCwgcGFzc2luZyB0aGUgcmVzdWx0IG9mIGVhY2ggZnVuY3Rpb24gY2FsbCB0byB0aGUgbmV4dCwgZnJvbVxuICAgICAqICAgICAgICAgbGVmdCB0byByaWdodC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICB2YXIgdHJpcGxlID0gZnVuY3Rpb24oeCkgeyByZXR1cm4geCAqIDM7IH07XG4gICAgICogICAgICB2YXIgZG91YmxlID0gZnVuY3Rpb24oeCkgeyByZXR1cm4geCAqIDI7IH07XG4gICAgICogICAgICB2YXIgc3F1YXJlID0gZnVuY3Rpb24oeCkgeyByZXR1cm4geCAqIHg7IH07XG4gICAgICogICAgICB2YXIgc3F1YXJlVGhlbkRvdWJsZVRoZW5UcmlwbGUgPSBSLnBpcGUoc3F1YXJlLCBkb3VibGUsIHRyaXBsZSk7XG4gICAgICpcbiAgICAgKiAgICAgIC8v4omFIHRyaXBsZShkb3VibGUoc3F1YXJlKDUpKSlcbiAgICAgKiAgICAgIHNxdWFyZVRoZW5Eb3VibGVUaGVuVHJpcGxlKDUpOyAvLz0+IDE1MFxuICAgICAqL1xuICAgIHZhciBwaXBlID0gZnVuY3Rpb24gcGlwZSgpIHtcbiAgICAgICAgcmV0dXJuIGNvbXBvc2UuYXBwbHkodGhpcywgcmV2ZXJzZShhcmd1bWVudHMpKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIG5ldyBsZW5zIHRoYXQgYWxsb3dzIGdldHRpbmcgYW5kIHNldHRpbmcgdmFsdWVzIG9mIG5lc3RlZCBwcm9wZXJ0aWVzLCBieVxuICAgICAqIGZvbGxvd2luZyBlYWNoIGdpdmVuIGxlbnMgaW4gc3VjY2Vzc2lvbi5cbiAgICAgKlxuICAgICAqIGBwaXBlTGAgaXMgdGhlIG1pcnJvciB2ZXJzaW9uIG9mIGBjb21wb3NlTGAuIGBwaXBlTGAgaXMgbGVmdC1hc3NvY2lhdGl2ZSwgd2hpY2ggbWVhbnMgdGhhdFxuICAgICAqIGVhY2ggb2YgdGhlIGZ1bmN0aW9ucyBwcm92aWRlZCBpcyBleGVjdXRlZCBpbiBvcmRlciBmcm9tIGxlZnQgdG8gcmlnaHQuXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IEZ1bmN0aW9uXG4gICAgICogQHNlZSBSLmxlbnNcbiAgICAgKiBAc2lnICgoYSAtPiBiKSwgKGIgLT4gYyksIC4uLiwgKHggLT4geSksICh5IC0+IHopKSAtPiAoYSAtPiB6KVxuICAgICAqIEBwYXJhbSB7Li4uRnVuY3Rpb259IGxlbnNlcyBBIHZhcmlhYmxlIG51bWJlciBvZiBsZW5zZXMuXG4gICAgICogQHJldHVybiB7RnVuY3Rpb259IEEgbmV3IGxlbnMgd2hpY2ggcmVwcmVzZW50cyB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgZWFjaCBvZiB0aGVcbiAgICAgKiAgICAgICAgIGlucHV0IGBsZW5zZXNgLCBwYXNzaW5nIHRoZSByZXN1bHQgb2YgZWFjaCBnZXR0ZXIvc2V0dGVyIGFzIHRoZSBzb3VyY2VcbiAgICAgKiAgICAgICAgIHRvIHRoZSBuZXh0LCBmcm9tIHJpZ2h0IHRvIGxlZnQuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgdmFyIGhlYWRMZW5zID0gUi5sZW5zSW5kZXgoMCk7XG4gICAgICogICAgICB2YXIgc2Vjb25kTGVucyA9IFIubGVuc0luZGV4KDEpO1xuICAgICAqICAgICAgdmFyIHhMZW5zID0gUi5sZW5zUHJvcCgneCcpO1xuICAgICAqICAgICAgdmFyIGhlYWRUaGVuWFRoZW5TZWNvbmRMZW5zID0gUi5waXBlTChoZWFkTGVucywgeExlbnMsIHNlY29uZExlbnMpO1xuICAgICAqXG4gICAgICogICAgICB2YXIgc291cmNlID0gW3t4OiBbMCwgMV0sIHk6IFsyLCAzXX0sIHt4OiBbNCwgNV0sIHk6IFs2LCA3XX1dO1xuICAgICAqICAgICAgaGVhZFRoZW5YVGhlblNlY29uZExlbnMoc291cmNlKTsgLy89PiAxXG4gICAgICogICAgICBoZWFkVGhlblhUaGVuU2Vjb25kTGVucy5zZXQoMTIzLCBzb3VyY2UpOyAvLz0+IFt7eDogWzAsIDEyM10sIHk6IFsyLCAzXX0sIHt4OiBbNCwgNV0sIHk6IFs2LCA3XX1dXG4gICAgICovXG4gICAgdmFyIHBpcGVMID0gY29tcG9zZShhcHBseShjb21wb3NlTCksIHVuYXBwbHkocmV2ZXJzZSkpO1xuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIG5ldyBmdW5jdGlvbiB0aGF0IHJ1bnMgZWFjaCBvZiB0aGUgZnVuY3Rpb25zIHN1cHBsaWVkIGFzIHBhcmFtZXRlcnMgaW4gdHVybixcbiAgICAgKiBwYXNzaW5nIHRvIHRoZSBuZXh0IGZ1bmN0aW9uIGludm9jYXRpb24gZWl0aGVyIHRoZSB2YWx1ZSByZXR1cm5lZCBieSB0aGUgcHJldmlvdXNcbiAgICAgKiBmdW5jdGlvbiBvciB0aGUgcmVzb2x2ZWQgdmFsdWUgaWYgdGhlIHJldHVybmVkIHZhbHVlIGlzIGEgcHJvbWlzZS4gSW4gb3RoZXIgd29yZHMsXG4gICAgICogaWYgc29tZSBvZiB0aGUgZnVuY3Rpb25zIGluIHRoZSBzZXF1ZW5jZSByZXR1cm4gcHJvbWlzZXMsIGBwaXBlUGAgcGlwZXMgdGhlIHZhbHVlc1xuICAgICAqIGFzeW5jaHJvbm91c2x5LiBJZiBub25lIG9mIHRoZSBmdW5jdGlvbnMgcmV0dXJuIHByb21pc2VzLCB0aGUgYmVoYXZpb3IgaXMgdGhlIHNhbWUgYXNcbiAgICAgKiB0aGF0IG9mIGBwaXBlYC5cbiAgICAgKlxuICAgICAqIGBwaXBlUGAgaXMgdGhlIG1pcnJvciB2ZXJzaW9uIG9mIGBjb21wb3NlUGAuIGBwaXBlUGAgaXMgbGVmdC1hc3NvY2lhdGl2ZSwgd2hpY2ggbWVhbnMgdGhhdFxuICAgICAqIGVhY2ggb2YgdGhlIGZ1bmN0aW9ucyBwcm92aWRlZCBpcyBleGVjdXRlZCBpbiBvcmRlciBmcm9tIGxlZnQgdG8gcmlnaHQuXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IEZ1bmN0aW9uXG4gICAgICogQHNpZyAoKGEuLi4gLT4gYiksIChiIC0+IGMpLCAuLi4sICh4IC0+IHkpLCAoeSAtPiB6KSkgLT4gKGEuLi4gLT4geilcbiAgICAgKiBAcGFyYW0gey4uLkZ1bmN0aW9ufSBmdW5jdGlvbnMgQSB2YXJpYWJsZSBudW1iZXIgb2YgZnVuY3Rpb25zLlxuICAgICAqIEByZXR1cm4ge0Z1bmN0aW9ufSBBIG5ldyBmdW5jdGlvbiB3aGljaCByZXByZXNlbnRzIHRoZSByZXN1bHQgb2YgY2FsbGluZyBlYWNoIG9mIHRoZVxuICAgICAqICAgICAgICAgaW5wdXQgYGZ1bmN0aW9uc2AsIHBhc3NpbmcgZWl0aGVyIHRoZSByZXR1cm5lZCByZXN1bHQgb3IgdGhlIGFzeW5jaHJvbm91c2x5XG4gICAgICogICAgICAgICByZXNvbHZlZCB2YWx1ZSkgb2YgZWFjaCBmdW5jdGlvbiBjYWxsIHRvIHRoZSBuZXh0LCBmcm9tIGxlZnQgdG8gcmlnaHQuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgdmFyIFEgPSByZXF1aXJlKCdxJyk7XG4gICAgICogICAgICB2YXIgdHJpcGxlID0gZnVuY3Rpb24oeCkgeyByZXR1cm4geCAqIDM7IH07XG4gICAgICogICAgICB2YXIgZG91YmxlID0gZnVuY3Rpb24oeCkgeyByZXR1cm4geCAqIDI7IH07XG4gICAgICogICAgICB2YXIgc3F1YXJlQXN5bmMgPSBmdW5jdGlvbih4KSB7IHJldHVybiBRLndoZW4oeCAqIHgpOyB9O1xuICAgICAqICAgICAgdmFyIHNxdWFyZUFzeW5jVGhlbkRvdWJsZVRoZW5UcmlwbGUgPSBSLnBpcGVQKHNxdWFyZUFzeW5jLCBkb3VibGUsIHRyaXBsZSk7XG4gICAgICpcbiAgICAgKiAgICAgIC8v4omFIHNxdWFyZUFzeW5jKDUpLnRoZW4oZnVuY3Rpb24oeCkgeyByZXR1cm4gdHJpcGxlKGRvdWJsZSh4KSkgfTtcbiAgICAgKiAgICAgIHNxdWFyZUFzeW5jVGhlbkRvdWJsZVRoZW5UcmlwbGUoNSlcbiAgICAgKiAgICAgICAgLnRoZW4oZnVuY3Rpb24ocmVzdWx0KSB7XG4gICAgICogICAgICAgICAgLy8gcmVzdWx0IGlzIDE1MFxuICAgICAqICAgICAgICB9KTtcbiAgICAgKi9cbiAgICB2YXIgcGlwZVAgPSBmdW5jdGlvbiBwaXBlUCgpIHtcbiAgICAgICAgcmV0dXJuIGNvbXBvc2VQLmFwcGx5KHRoaXMsIHJldmVyc2UoYXJndW1lbnRzKSk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIERldGVybWluZXMgd2hldGhlciB0aGUgZ2l2ZW4gcHJvcGVydHkgb2YgYW4gb2JqZWN0IGhhcyBhIHNwZWNpZmljIHZhbHVlLFxuICAgICAqIGluIGBSLmVxdWFsc2AgdGVybXMuIE1vc3QgbGlrZWx5IHVzZWQgdG8gZmlsdGVyIGEgbGlzdC5cbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgUmVsYXRpb25cbiAgICAgKiBAc2lnIGsgLT4gdiAtPiB7azogdn0gLT4gQm9vbGVhblxuICAgICAqIEBwYXJhbSB7TnVtYmVyfFN0cmluZ30gbmFtZSBUaGUgcHJvcGVydHkgbmFtZSAob3IgaW5kZXgpIHRvIHVzZS5cbiAgICAgKiBAcGFyYW0geyp9IHZhbCBUaGUgdmFsdWUgdG8gY29tcGFyZSB0aGUgcHJvcGVydHkgd2l0aC5cbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufSBgdHJ1ZWAgaWYgdGhlIHByb3BlcnRpZXMgYXJlIGVxdWFsLCBgZmFsc2VgIG90aGVyd2lzZS5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICB2YXIgYWJieSA9IHtuYW1lOiAnQWJieScsIGFnZTogNywgaGFpcjogJ2Jsb25kJ307XG4gICAgICogICAgICB2YXIgZnJlZCA9IHtuYW1lOiAnRnJlZCcsIGFnZTogMTIsIGhhaXI6ICdicm93bid9O1xuICAgICAqICAgICAgdmFyIHJ1c3R5ID0ge25hbWU6ICdSdXN0eScsIGFnZTogMTAsIGhhaXI6ICdicm93bid9O1xuICAgICAqICAgICAgdmFyIGFsb2lzID0ge25hbWU6ICdBbG9pcycsIGFnZTogMTUsIGRpc3Bvc2l0aW9uOiAnc3VybHknfTtcbiAgICAgKiAgICAgIHZhciBraWRzID0gW2FiYnksIGZyZWQsIHJ1c3R5LCBhbG9pc107XG4gICAgICogICAgICB2YXIgaGFzQnJvd25IYWlyID0gUi5wcm9wRXEoJ2hhaXInLCAnYnJvd24nKTtcbiAgICAgKiAgICAgIFIuZmlsdGVyKGhhc0Jyb3duSGFpciwga2lkcyk7IC8vPT4gW2ZyZWQsIHJ1c3R5XVxuICAgICAqL1xuICAgIHZhciBwcm9wRXEgPSBfY3VycnkzKGZ1bmN0aW9uIHByb3BFcShuYW1lLCB2YWwsIG9iaikge1xuICAgICAgICByZXR1cm4gZXF1YWxzKG9ialtuYW1lXSwgdmFsKTtcbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYSBzaW5nbGUgaXRlbSBieSBpdGVyYXRpbmcgdGhyb3VnaCB0aGUgbGlzdCwgc3VjY2Vzc2l2ZWx5IGNhbGxpbmcgdGhlIGl0ZXJhdG9yXG4gICAgICogZnVuY3Rpb24gYW5kIHBhc3NpbmcgaXQgYW4gYWNjdW11bGF0b3IgdmFsdWUgYW5kIHRoZSBjdXJyZW50IHZhbHVlIGZyb20gdGhlIGFycmF5LCBhbmRcbiAgICAgKiB0aGVuIHBhc3NpbmcgdGhlIHJlc3VsdCB0byB0aGUgbmV4dCBjYWxsLlxuICAgICAqXG4gICAgICogVGhlIGl0ZXJhdG9yIGZ1bmN0aW9uIHJlY2VpdmVzIHR3byB2YWx1ZXM6ICooYWNjLCB2YWx1ZSkqLiAgSXQgbWF5IHVzZSBgUi5yZWR1Y2VkYCB0b1xuICAgICAqIHNob3J0Y3V0IHRoZSBpdGVyYXRpb24uXG4gICAgICpcbiAgICAgKiBOb3RlOiBgUi5yZWR1Y2VgIGRvZXMgbm90IHNraXAgZGVsZXRlZCBvciB1bmFzc2lnbmVkIGluZGljZXMgKHNwYXJzZSBhcnJheXMpLCB1bmxpa2VcbiAgICAgKiB0aGUgbmF0aXZlIGBBcnJheS5wcm90b3R5cGUucmVkdWNlYCBtZXRob2QuIEZvciBtb3JlIGRldGFpbHMgb24gdGhpcyBiZWhhdmlvciwgc2VlOlxuICAgICAqIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL0FycmF5L3JlZHVjZSNEZXNjcmlwdGlvblxuICAgICAqIEBzZWUgUi5yZWR1Y2VkXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IExpc3RcbiAgICAgKiBAc2lnIChhLGIgLT4gYSkgLT4gYSAtPiBbYl0gLT4gYVxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBpdGVyYXRvciBmdW5jdGlvbi4gUmVjZWl2ZXMgdHdvIHZhbHVlcywgdGhlIGFjY3VtdWxhdG9yIGFuZCB0aGVcbiAgICAgKiAgICAgICAgY3VycmVudCBlbGVtZW50IGZyb20gdGhlIGFycmF5LlxuICAgICAqIEBwYXJhbSB7Kn0gYWNjIFRoZSBhY2N1bXVsYXRvciB2YWx1ZS5cbiAgICAgKiBAcGFyYW0ge0FycmF5fSBsaXN0IFRoZSBsaXN0IHRvIGl0ZXJhdGUgb3Zlci5cbiAgICAgKiBAcmV0dXJuIHsqfSBUaGUgZmluYWwsIGFjY3VtdWxhdGVkIHZhbHVlLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIHZhciBudW1iZXJzID0gWzEsIDIsIDNdO1xuICAgICAqICAgICAgdmFyIGFkZCA9IGZ1bmN0aW9uKGEsIGIpIHtcbiAgICAgKiAgICAgICAgcmV0dXJuIGEgKyBiO1xuICAgICAqICAgICAgfTtcbiAgICAgKlxuICAgICAqICAgICAgUi5yZWR1Y2UoYWRkLCAxMCwgbnVtYmVycyk7IC8vPT4gMTZcbiAgICAgKi9cbiAgICB2YXIgcmVkdWNlID0gX2N1cnJ5MyhfcmVkdWNlKTtcblxuICAgIC8qKlxuICAgICAqIFNpbWlsYXIgdG8gYGZpbHRlcmAsIGV4Y2VwdCB0aGF0IGl0IGtlZXBzIG9ubHkgdmFsdWVzIGZvciB3aGljaCB0aGUgZ2l2ZW4gcHJlZGljYXRlXG4gICAgICogZnVuY3Rpb24gcmV0dXJucyBmYWxzeS4gVGhlIHByZWRpY2F0ZSBmdW5jdGlvbiBpcyBwYXNzZWQgb25lIGFyZ3VtZW50OiAqKHZhbHVlKSouXG4gICAgICpcbiAgICAgKiBBY3RzIGFzIGEgdHJhbnNkdWNlciBpZiBhIHRyYW5zZm9ybWVyIGlzIGdpdmVuIGluIGxpc3QgcG9zaXRpb24uXG4gICAgICogQHNlZSBSLnRyYW5zZHVjZVxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBMaXN0XG4gICAgICogQHNpZyAoYSAtPiBCb29sZWFuKSAtPiBbYV0gLT4gW2FdXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGZ1bmN0aW9uIGNhbGxlZCBwZXIgaXRlcmF0aW9uLlxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGxpc3QgVGhlIGNvbGxlY3Rpb24gdG8gaXRlcmF0ZSBvdmVyLlxuICAgICAqIEByZXR1cm4ge0FycmF5fSBUaGUgbmV3IGZpbHRlcmVkIGFycmF5LlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIHZhciBpc09kZCA9IGZ1bmN0aW9uKG4pIHtcbiAgICAgKiAgICAgICAgcmV0dXJuIG4gJSAyID09PSAxO1xuICAgICAqICAgICAgfTtcbiAgICAgKiAgICAgIFIucmVqZWN0KGlzT2RkLCBbMSwgMiwgMywgNF0pOyAvLz0+IFsyLCA0XVxuICAgICAqL1xuICAgIHZhciByZWplY3QgPSBfY3VycnkyKGZ1bmN0aW9uIHJlamVjdChmbiwgbGlzdCkge1xuICAgICAgICByZXR1cm4gZmlsdGVyKF9jb21wbGVtZW50KGZuKSwgbGlzdCk7XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGEgZml4ZWQgbGlzdCBvZiBzaXplIGBuYCBjb250YWluaW5nIGEgc3BlY2lmaWVkIGlkZW50aWNhbCB2YWx1ZS5cbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgTGlzdFxuICAgICAqIEBzaWcgYSAtPiBuIC0+IFthXVxuICAgICAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHJlcGVhdC5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gbiBUaGUgZGVzaXJlZCBzaXplIG9mIHRoZSBvdXRwdXQgbGlzdC5cbiAgICAgKiBAcmV0dXJuIHtBcnJheX0gQSBuZXcgYXJyYXkgY29udGFpbmluZyBgbmAgYHZhbHVlYHMuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgUi5yZXBlYXQoJ2hpJywgNSk7IC8vPT4gWydoaScsICdoaScsICdoaScsICdoaScsICdoaSddXG4gICAgICpcbiAgICAgKiAgICAgIHZhciBvYmogPSB7fTtcbiAgICAgKiAgICAgIHZhciByZXBlYXRlZE9ianMgPSBSLnJlcGVhdChvYmosIDUpOyAvLz0+IFt7fSwge30sIHt9LCB7fSwge31dXG4gICAgICogICAgICByZXBlYXRlZE9ianNbMF0gPT09IHJlcGVhdGVkT2Jqc1sxXTsgLy89PiB0cnVlXG4gICAgICovXG4gICAgdmFyIHJlcGVhdCA9IF9jdXJyeTIoZnVuY3Rpb24gcmVwZWF0KHZhbHVlLCBuKSB7XG4gICAgICAgIHJldHVybiB0aW1lcyhhbHdheXModmFsdWUpLCBuKTtcbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYSBsaXN0IGNvbnRhaW5pbmcgdGhlIGVsZW1lbnRzIG9mIGB4c2AgZnJvbSBgZnJvbUluZGV4YCAoaW5jbHVzaXZlKVxuICAgICAqIHRvIGB0b0luZGV4YCAoZXhjbHVzaXZlKS5cbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgTGlzdFxuICAgICAqIEBzaWcgTnVtYmVyIC0+IE51bWJlciAtPiBbYV0gLT4gW2FdXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGZyb21JbmRleCBUaGUgc3RhcnQgaW5kZXggKGluY2x1c2l2ZSkuXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHRvSW5kZXggVGhlIGVuZCBpbmRleCAoZXhjbHVzaXZlKS5cbiAgICAgKiBAcGFyYW0ge0FycmF5fSB4cyBUaGUgbGlzdCB0byB0YWtlIGVsZW1lbnRzIGZyb20uXG4gICAgICogQHJldHVybiB7QXJyYXl9IFRoZSBzbGljZSBvZiBgeHNgIGZyb20gYGZyb21JbmRleGAgdG8gYHRvSW5kZXhgLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIHZhciB4cyA9IFIucmFuZ2UoMCwgMTApO1xuICAgICAqICAgICAgUi5zbGljZSgyLCA1KSh4cyk7IC8vPT4gWzIsIDMsIDRdXG4gICAgICovXG4gICAgdmFyIHNsaWNlID0gX2N1cnJ5MyhfY2hlY2tGb3JNZXRob2QoJ3NsaWNlJywgZnVuY3Rpb24gc2xpY2UoZnJvbUluZGV4LCB0b0luZGV4LCB4cykge1xuICAgICAgICByZXR1cm4gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoeHMsIGZyb21JbmRleCwgdG9JbmRleCk7XG4gICAgfSkpO1xuXG4gICAgLyoqXG4gICAgICogU3BsaXRzIGEgc3RyaW5nIGludG8gYW4gYXJyYXkgb2Ygc3RyaW5ncyBiYXNlZCBvbiB0aGUgZ2l2ZW5cbiAgICAgKiBzZXBhcmF0b3IuXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IFN0cmluZ1xuICAgICAqIEBzaWcgU3RyaW5nIC0+IFN0cmluZyAtPiBbU3RyaW5nXVxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBzZXAgVGhlIHNlcGFyYXRvciBzdHJpbmcuXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHN0ciBUaGUgc3RyaW5nIHRvIHNlcGFyYXRlIGludG8gYW4gYXJyYXkuXG4gICAgICogQHJldHVybiB7QXJyYXl9IFRoZSBhcnJheSBvZiBzdHJpbmdzIGZyb20gYHN0cmAgc2VwYXJhdGVkIGJ5IGBzdHJgLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIHZhciBwYXRoQ29tcG9uZW50cyA9IFIuc3BsaXQoJy8nKTtcbiAgICAgKiAgICAgIFIudGFpbChwYXRoQ29tcG9uZW50cygnL3Vzci9sb2NhbC9iaW4vbm9kZScpKTsgLy89PiBbJ3VzcicsICdsb2NhbCcsICdiaW4nLCAnbm9kZSddXG4gICAgICpcbiAgICAgKiAgICAgIFIuc3BsaXQoJy4nLCAnYS5iLmMueHl6LmQnKTsgLy89PiBbJ2EnLCAnYicsICdjJywgJ3h5eicsICdkJ11cbiAgICAgKi9cbiAgICB2YXIgc3BsaXQgPSBpbnZva2VyKDEsICdzcGxpdCcpO1xuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhIHN0cmluZyBjb250YWluaW5nIHRoZSBjaGFyYWN0ZXJzIG9mIGBzdHJgIGZyb20gYGZyb21JbmRleGBcbiAgICAgKiAoaW5jbHVzaXZlKSB0byBgdG9JbmRleGAgKGV4Y2x1c2l2ZSkuXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IFN0cmluZ1xuICAgICAqIEBzaWcgTnVtYmVyIC0+IE51bWJlciAtPiBTdHJpbmcgLT4gU3RyaW5nXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGZyb21JbmRleCBUaGUgc3RhcnQgaW5kZXggKGluY2x1c2l2ZSkuXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHRvSW5kZXggVGhlIGVuZCBpbmRleCAoZXhjbHVzaXZlKS5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gc3RyIFRoZSBzdHJpbmcgdG8gc2xpY2UuXG4gICAgICogQHJldHVybiB7U3RyaW5nfVxuICAgICAqIEBzZWUgUi5zbGljZVxuICAgICAqIEBkZXByZWNhdGVkIHNpbmNlIHYwLjE1LjBcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICBSLnN1YnN0cmluZygyLCA1LCAnYWJjZGVmZ2hpamtsbScpOyAvLz0+ICdjZGUnXG4gICAgICovXG4gICAgdmFyIHN1YnN0cmluZyA9IHNsaWNlO1xuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhIHN0cmluZyBjb250YWluaW5nIHRoZSBjaGFyYWN0ZXJzIG9mIGBzdHJgIGZyb20gYGZyb21JbmRleGBcbiAgICAgKiAoaW5jbHVzaXZlKSB0byB0aGUgZW5kIG9mIGBzdHJgLlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBTdHJpbmdcbiAgICAgKiBAc2lnIE51bWJlciAtPiBTdHJpbmcgLT4gU3RyaW5nXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGZyb21JbmRleFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAgICAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICAgICogQGRlcHJlY2F0ZWQgc2luY2UgdjAuMTUuMFxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIFIuc3Vic3RyaW5nRnJvbSgzLCAnUmFtZGEnKTsgLy89PiAnZGEnXG4gICAgICogICAgICBSLnN1YnN0cmluZ0Zyb20oLTIsICdSYW1kYScpOyAvLz0+ICdkYSdcbiAgICAgKi9cbiAgICB2YXIgc3Vic3RyaW5nRnJvbSA9IHN1YnN0cmluZyhfXywgSW5maW5pdHkpO1xuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhIHN0cmluZyBjb250YWluaW5nIHRoZSBmaXJzdCBgdG9JbmRleGAgY2hhcmFjdGVycyBvZiBgc3RyYC5cbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgU3RyaW5nXG4gICAgICogQHNpZyBOdW1iZXIgLT4gU3RyaW5nIC0+IFN0cmluZ1xuICAgICAqIEBwYXJhbSB7TnVtYmVyfSB0b0luZGV4XG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICAgICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICAgKiBAZGVwcmVjYXRlZCBzaW5jZSB2MC4xNS4wXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgUi5zdWJzdHJpbmdUbygzLCAnUmFtZGEnKTsgLy89PiAnUmFtJ1xuICAgICAqICAgICAgUi5zdWJzdHJpbmdUbygtMiwgJ1JhbWRhJyk7IC8vPT4gJ1JhbSdcbiAgICAgKi9cbiAgICB2YXIgc3Vic3RyaW5nVG8gPSBzdWJzdHJpbmcoMCk7XG5cbiAgICAvKipcbiAgICAgKiBBZGRzIHRvZ2V0aGVyIGFsbCB0aGUgZWxlbWVudHMgb2YgYSBsaXN0LlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBNYXRoXG4gICAgICogQHNpZyBbTnVtYmVyXSAtPiBOdW1iZXJcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBsaXN0IEFuIGFycmF5IG9mIG51bWJlcnNcbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9IFRoZSBzdW0gb2YgYWxsIHRoZSBudW1iZXJzIGluIHRoZSBsaXN0LlxuICAgICAqIEBzZWUgUi5yZWR1Y2VcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICBSLnN1bShbMiw0LDYsOCwxMDAsMV0pOyAvLz0+IDEyMVxuICAgICAqL1xuICAgIHZhciBzdW0gPSByZWR1Y2UoX2FkZCwgMCk7XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGFsbCBidXQgdGhlIGZpcnN0IGVsZW1lbnQgb2YgYSBsaXN0LiBJZiB0aGUgbGlzdCBwcm92aWRlZCBoYXMgdGhlIGB0YWlsYCBtZXRob2QsXG4gICAgICogaXQgd2lsbCBpbnN0ZWFkIHJldHVybiBgbGlzdC50YWlsKClgLlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBMaXN0XG4gICAgICogQHNpZyBbYV0gLT4gW2FdXG4gICAgICogQHBhcmFtIHtBcnJheX0gbGlzdCBUaGUgYXJyYXkgdG8gY29uc2lkZXIuXG4gICAgICogQHJldHVybiB7QXJyYXl9IEEgbmV3IGFycmF5IGNvbnRhaW5pbmcgYWxsIGJ1dCB0aGUgZmlyc3QgZWxlbWVudCBvZiB0aGUgaW5wdXQgbGlzdCwgb3IgYW5cbiAgICAgKiAgICAgICAgIGVtcHR5IGxpc3QgaWYgdGhlIGlucHV0IGxpc3QgaXMgZW1wdHkuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgUi50YWlsKFsnZmknLCAnZm8nLCAnZnVtJ10pOyAvLz0+IFsnZm8nLCAnZnVtJ11cbiAgICAgKi9cbiAgICB2YXIgdGFpbCA9IF9jaGVja0Zvck1ldGhvZCgndGFpbCcsIGZ1bmN0aW9uIChsaXN0KSB7XG4gICAgICAgIHJldHVybiBfc2xpY2UobGlzdCwgMSk7XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGEgbmV3IGxpc3QgY29udGFpbmluZyB0aGUgZmlyc3QgYG5gIGVsZW1lbnRzIG9mIHRoZSBnaXZlbiBsaXN0LlxuICAgICAqIElmIGBuID4gbGlzdC5sZW5ndGhgLCByZXR1cm5zIGEgbGlzdCBvZiBgbGlzdC5sZW5ndGhgIGVsZW1lbnRzLlxuICAgICAqXG4gICAgICogQWN0cyBhcyBhIHRyYW5zZHVjZXIgaWYgYSB0cmFuc2Zvcm1lciBpcyBnaXZlbiBpbiBsaXN0IHBvc2l0aW9uLlxuICAgICAqIEBzZWUgUi50cmFuc2R1Y2VcbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgTGlzdFxuICAgICAqIEBzaWcgTnVtYmVyIC0+IFthXSAtPiBbYV1cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gbiBUaGUgbnVtYmVyIG9mIGVsZW1lbnRzIHRvIHJldHVybi5cbiAgICAgKiBAcGFyYW0ge0FycmF5fSB4cyBUaGUgY29sbGVjdGlvbiB0byBjb25zaWRlci5cbiAgICAgKiBAcmV0dXJuIHtBcnJheX1cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICBSLnRha2UoMyxbMSwyLDMsNCw1XSk7IC8vPT4gWzEsMiwzXVxuICAgICAqXG4gICAgICogICAgICB2YXIgbWVtYmVycz0gWyBcIlBhdWwgRGVzbW9uZFwiLFwiQm9iIEJhdGVzXCIsXCJKb2UgRG9kZ2VcIixcIlJvbiBDcm90dHlcIixcIkxsb3lkIERhdmlzXCIsXCJKb2UgTW9yZWxsb1wiLFwiTm9ybWFuIEJhdGVzXCIsXG4gICAgICogICAgICAgICAgICAgICAgICAgICBcIkV1Z2VuZSBXcmlnaHRcIixcIkdlcnJ5IE11bGxpZ2FuXCIsXCJKYWNrIFNpeFwiLFwiQWxhbiBEYXdzb25cIixcIkRhcml1cyBCcnViZWNrXCIsXCJDaHJpcyBCcnViZWNrXCIsXG4gICAgICogICAgICAgICAgICAgICAgICAgICBcIkRhbiBCcnViZWNrXCIsXCJCb2JieSBNaWxpdGVsbG9cIixcIk1pY2hhZWwgTW9vcmVcIixcIlJhbmR5IEpvbmVzXCJdO1xuICAgICAqICAgICAgdmFyIHRha2VGaXZlID0gUi50YWtlKDUpO1xuICAgICAqICAgICAgdGFrZUZpdmUobWVtYmVycyk7IC8vPT4gW1wiUGF1bCBEZXNtb25kXCIsXCJCb2IgQmF0ZXNcIixcIkpvZSBEb2RnZVwiLFwiUm9uIENyb3R0eVwiLFwiTGxveWQgRGF2aXNcIl1cbiAgICAgKi9cbiAgICB2YXIgdGFrZSA9IF9jdXJyeTIoX2Rpc3BhdGNoYWJsZSgndGFrZScsIF94dGFrZSwgZnVuY3Rpb24gdGFrZShuLCB4cykge1xuICAgICAgICByZXR1cm4gc2xpY2UoMCwgbiA8IDAgPyBJbmZpbml0eSA6IG4sIHhzKTtcbiAgICB9KSk7XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGEgbmV3IGxpc3QgY29udGFpbmluZyB0aGUgZmlyc3QgYG5gIGVsZW1lbnRzIG9mIGEgZ2l2ZW4gbGlzdCwgcGFzc2luZyBlYWNoIHZhbHVlXG4gICAgICogdG8gdGhlIHN1cHBsaWVkIHByZWRpY2F0ZSBmdW5jdGlvbiwgYW5kIHRlcm1pbmF0aW5nIHdoZW4gdGhlIHByZWRpY2F0ZSBmdW5jdGlvbiByZXR1cm5zXG4gICAgICogYGZhbHNlYC4gRXhjbHVkZXMgdGhlIGVsZW1lbnQgdGhhdCBjYXVzZWQgdGhlIHByZWRpY2F0ZSBmdW5jdGlvbiB0byBmYWlsLiBUaGUgcHJlZGljYXRlXG4gICAgICogZnVuY3Rpb24gaXMgcGFzc2VkIG9uZSBhcmd1bWVudDogKih2YWx1ZSkqLlxuICAgICAqXG4gICAgICogQWN0cyBhcyBhIHRyYW5zZHVjZXIgaWYgYSB0cmFuc2Zvcm1lciBpcyBnaXZlbiBpbiBsaXN0IHBvc2l0aW9uLlxuICAgICAqIEBzZWUgUi50cmFuc2R1Y2VcbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgTGlzdFxuICAgICAqIEBzaWcgKGEgLT4gQm9vbGVhbikgLT4gW2FdIC0+IFthXVxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBmdW5jdGlvbiBjYWxsZWQgcGVyIGl0ZXJhdGlvbi5cbiAgICAgKiBAcGFyYW0ge0FycmF5fSBsaXN0IFRoZSBjb2xsZWN0aW9uIHRvIGl0ZXJhdGUgb3Zlci5cbiAgICAgKiBAcmV0dXJuIHtBcnJheX0gQSBuZXcgYXJyYXkuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgdmFyIGlzTm90Rm91ciA9IGZ1bmN0aW9uKHgpIHtcbiAgICAgKiAgICAgICAgcmV0dXJuICEoeCA9PT0gNCk7XG4gICAgICogICAgICB9O1xuICAgICAqXG4gICAgICogICAgICBSLnRha2VXaGlsZShpc05vdEZvdXIsIFsxLCAyLCAzLCA0XSk7IC8vPT4gWzEsIDIsIDNdXG4gICAgICovXG4gICAgdmFyIHRha2VXaGlsZSA9IF9jdXJyeTIoX2Rpc3BhdGNoYWJsZSgndGFrZVdoaWxlJywgX3h0YWtlV2hpbGUsIGZ1bmN0aW9uIHRha2VXaGlsZShmbiwgbGlzdCkge1xuICAgICAgICB2YXIgaWR4ID0gMDtcbiAgICAgICAgd2hpbGUgKGlkeCA8IGxpc3QubGVuZ3RoICYmIGZuKGxpc3RbaWR4XSkpIHtcbiAgICAgICAgICAgIGlkeCArPSAxO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBfc2xpY2UobGlzdCwgMCwgaWR4KTtcbiAgICB9KSk7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgbG93ZXIgY2FzZSB2ZXJzaW9uIG9mIGEgc3RyaW5nLlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBTdHJpbmdcbiAgICAgKiBAc2lnIFN0cmluZyAtPiBTdHJpbmdcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gc3RyIFRoZSBzdHJpbmcgdG8gbG93ZXIgY2FzZS5cbiAgICAgKiBAcmV0dXJuIHtTdHJpbmd9IFRoZSBsb3dlciBjYXNlIHZlcnNpb24gb2YgYHN0cmAuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgUi50b0xvd2VyKCdYWVonKTsgLy89PiAneHl6J1xuICAgICAqL1xuICAgIHZhciB0b0xvd2VyID0gaW52b2tlcigwLCAndG9Mb3dlckNhc2UnKTtcblxuICAgIC8qKlxuICAgICAqIFRoZSB1cHBlciBjYXNlIHZlcnNpb24gb2YgYSBzdHJpbmcuXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IFN0cmluZ1xuICAgICAqIEBzaWcgU3RyaW5nIC0+IFN0cmluZ1xuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBzdHIgVGhlIHN0cmluZyB0byB1cHBlciBjYXNlLlxuICAgICAqIEByZXR1cm4ge1N0cmluZ30gVGhlIHVwcGVyIGNhc2UgdmVyc2lvbiBvZiBgc3RyYC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICBSLnRvVXBwZXIoJ2FiYycpOyAvLz0+ICdBQkMnXG4gICAgICovXG4gICAgdmFyIHRvVXBwZXIgPSBpbnZva2VyKDAsICd0b1VwcGVyQ2FzZScpO1xuXG4gICAgLyoqXG4gICAgICogSW5pdGlhbGl6ZXMgYSB0cmFuc2R1Y2VyIHVzaW5nIHN1cHBsaWVkIGl0ZXJhdG9yIGZ1bmN0aW9uLiBSZXR1cm5zIGEgc2luZ2xlIGl0ZW0gYnlcbiAgICAgKiBpdGVyYXRpbmcgdGhyb3VnaCB0aGUgbGlzdCwgc3VjY2Vzc2l2ZWx5IGNhbGxpbmcgdGhlIHRyYW5zZm9ybWVkIGl0ZXJhdG9yIGZ1bmN0aW9uIGFuZFxuICAgICAqIHBhc3NpbmcgaXQgYW4gYWNjdW11bGF0b3IgdmFsdWUgYW5kIHRoZSBjdXJyZW50IHZhbHVlIGZyb20gdGhlIGFycmF5LCBhbmQgdGhlbiBwYXNzaW5nXG4gICAgICogdGhlIHJlc3VsdCB0byB0aGUgbmV4dCBjYWxsLlxuICAgICAqXG4gICAgICogVGhlIGl0ZXJhdG9yIGZ1bmN0aW9uIHJlY2VpdmVzIHR3byB2YWx1ZXM6ICooYWNjLCB2YWx1ZSkqLiBJdCB3aWxsIGJlIHdyYXBwZWQgYXMgYVxuICAgICAqIHRyYW5zZm9ybWVyIHRvIGluaXRpYWxpemUgdGhlIHRyYW5zZHVjZXIuIEEgdHJhbnNmb3JtZXIgY2FuIGJlIHBhc3NlZCBkaXJlY3RseSBpbiBwbGFjZVxuICAgICAqIG9mIGFuIGl0ZXJhdG9yIGZ1bmN0aW9uLiAgSW4gYm90aCBjYXNlcywgaXRlcmF0aW9uIG1heSBiZSBzdG9wcGVkIGVhcmx5IHdpdGggdGhlXG4gICAgICogYFIucmVkdWNlZGAgZnVuY3Rpb24uXG4gICAgICpcbiAgICAgKiBBIHRyYW5zZHVjZXIgaXMgYSBmdW5jdGlvbiB0aGF0IGFjY2VwdHMgYSB0cmFuc2Zvcm1lciBhbmQgcmV0dXJucyBhIHRyYW5zZm9ybWVyIGFuZCBjYW5cbiAgICAgKiBiZSBjb21wb3NlZCBkaXJlY3RseS5cbiAgICAgKlxuICAgICAqIEEgdHJhbnNmb3JtZXIgaXMgYW4gYW4gb2JqZWN0IHRoYXQgcHJvdmlkZXMgYSAyLWFyaXR5IHJlZHVjaW5nIGl0ZXJhdG9yIGZ1bmN0aW9uLCBzdGVwLFxuICAgICAqIDAtYXJpdHkgaW5pdGlhbCB2YWx1ZSBmdW5jdGlvbiwgaW5pdCwgYW5kIDEtYXJpdHkgcmVzdWx0IGV4dHJhY3Rpb24gZnVuY3Rpb24sIHJlc3VsdC5cbiAgICAgKiBUaGUgc3RlcCBmdW5jdGlvbiBpcyB1c2VkIGFzIHRoZSBpdGVyYXRvciBmdW5jdGlvbiBpbiByZWR1Y2UuIFRoZSByZXN1bHQgZnVuY3Rpb24gaXMgdXNlZFxuICAgICAqIHRvIGNvbnZlcnQgdGhlIGZpbmFsIGFjY3VtdWxhdG9yIGludG8gdGhlIHJldHVybiB0eXBlIGFuZCBpbiBtb3N0IGNhc2VzIGlzIFIuaWRlbnRpdHkuXG4gICAgICogVGhlIGluaXQgZnVuY3Rpb24gY2FuIGJlIHVzZWQgdG8gcHJvdmlkZSBhbiBpbml0aWFsIGFjY3VtdWxhdG9yLCBidXQgaXMgaWdub3JlZCBieSB0cmFuc2R1Y2UuXG4gICAgICpcbiAgICAgKiBUaGUgaXRlcmF0aW9uIGlzIHBlcmZvcm1lZCB3aXRoIFIucmVkdWNlIGFmdGVyIGluaXRpYWxpemluZyB0aGUgdHJhbnNkdWNlci5cbiAgICAgKiBAc2VlIFIucmVkdWNlXG4gICAgICogQHNlZSBSLnJlZHVjZWRcbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgTGlzdFxuICAgICAqIEBzaWcgKGMgLT4gYykgLT4gKGEsYiAtPiBhKSAtPiBhIC0+IFtiXSAtPiBhXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0geGYgVGhlIHRyYW5zZHVjZXIgZnVuY3Rpb24uIFJlY2VpdmVzIGEgdHJhbnNmb3JtZXIgYW5kIHJldHVybnMgYSB0cmFuc2Zvcm1lci5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgaXRlcmF0b3IgZnVuY3Rpb24uIFJlY2VpdmVzIHR3byB2YWx1ZXMsIHRoZSBhY2N1bXVsYXRvciBhbmQgdGhlXG4gICAgICogICAgICAgIGN1cnJlbnQgZWxlbWVudCBmcm9tIHRoZSBhcnJheS4gV3JhcHBlZCBhcyB0cmFuc2Zvcm1lciwgaWYgbmVjZXNzYXJ5LCBhbmQgdXNlZCB0b1xuICAgICAqICAgICAgICBpbml0aWFsaXplIHRoZSB0cmFuc2R1Y2VyXG4gICAgICogQHBhcmFtIHsqfSBhY2MgVGhlIGluaXRpYWwgYWNjdW11bGF0b3IgdmFsdWUuXG4gICAgICogQHBhcmFtIHtBcnJheX0gbGlzdCBUaGUgbGlzdCB0byBpdGVyYXRlIG92ZXIuXG4gICAgICogQHNlZSBSLmludG9cbiAgICAgKiBAcmV0dXJuIHsqfSBUaGUgZmluYWwsIGFjY3VtdWxhdGVkIHZhbHVlLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIHZhciBudW1iZXJzID0gWzEsIDIsIDMsIDRdO1xuICAgICAqICAgICAgdmFyIHRyYW5zZHVjZXIgPSBSLmNvbXBvc2UoUi5tYXAoUi5hZGQoMSkpLCBSLnRha2UoMikpO1xuICAgICAqXG4gICAgICogICAgICBSLnRyYW5zZHVjZSh0cmFuc2R1Y2VyLCBSLmZsaXAoUi5hcHBlbmQpLCBbXSwgbnVtYmVycyk7IC8vPT4gWzIsIDNdXG4gICAgICovXG4gICAgdmFyIHRyYW5zZHVjZSA9IGN1cnJ5Tig0LCBmdW5jdGlvbiAoeGYsIGZuLCBhY2MsIGxpc3QpIHtcbiAgICAgICAgcmV0dXJuIF9yZWR1Y2UoeGYodHlwZW9mIGZuID09PSAnZnVuY3Rpb24nID8gX3h3cmFwKGZuKSA6IGZuKSwgYWNjLCBsaXN0KTtcbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYSBmdW5jdGlvbiBvZiBhcml0eSBgbmAgZnJvbSBhIChtYW51YWxseSkgY3VycmllZCBmdW5jdGlvbi5cbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgRnVuY3Rpb25cbiAgICAgKiBAc2lnIE51bWJlciAtPiAoYSAtPiBiKSAtPiAoYSAtPiBjKVxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBsZW5ndGggVGhlIGFyaXR5IGZvciB0aGUgcmV0dXJuZWQgZnVuY3Rpb24uXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGZ1bmN0aW9uIHRvIHVuY3VycnkuXG4gICAgICogQHJldHVybiB7RnVuY3Rpb259IEEgbmV3IGZ1bmN0aW9uLlxuICAgICAqIEBzZWUgUi5jdXJyeVxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIHZhciBhZGRGb3VyID0gZnVuY3Rpb24oYSkge1xuICAgICAqICAgICAgICByZXR1cm4gZnVuY3Rpb24oYikge1xuICAgICAqICAgICAgICAgIHJldHVybiBmdW5jdGlvbihjKSB7XG4gICAgICogICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oZCkge1xuICAgICAqICAgICAgICAgICAgICByZXR1cm4gYSArIGIgKyBjICsgZDtcbiAgICAgKiAgICAgICAgICAgIH07XG4gICAgICogICAgICAgICAgfTtcbiAgICAgKiAgICAgICAgfTtcbiAgICAgKiAgICAgIH07XG4gICAgICpcbiAgICAgKiAgICAgIHZhciB1bmN1cnJpZWRBZGRGb3VyID0gUi51bmN1cnJ5Tig0LCBhZGRGb3VyKTtcbiAgICAgKiAgICAgIGN1cnJpZWRBZGRGb3VyKDEsIDIsIDMsIDQpOyAvLz0+IDEwXG4gICAgICovXG4gICAgdmFyIHVuY3VycnlOID0gX2N1cnJ5MihmdW5jdGlvbiB1bmN1cnJ5TihkZXB0aCwgZm4pIHtcbiAgICAgICAgcmV0dXJuIGN1cnJ5TihkZXB0aCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGN1cnJlbnREZXB0aCA9IDE7XG4gICAgICAgICAgICB2YXIgdmFsdWUgPSBmbjtcbiAgICAgICAgICAgIHZhciBpZHggPSAwO1xuICAgICAgICAgICAgdmFyIGVuZElkeDtcbiAgICAgICAgICAgIHdoaWxlIChjdXJyZW50RGVwdGggPD0gZGVwdGggJiYgdHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgZW5kSWR4ID0gY3VycmVudERlcHRoID09PSBkZXB0aCA/IGFyZ3VtZW50cy5sZW5ndGggOiBpZHggKyB2YWx1ZS5sZW5ndGg7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZS5hcHBseSh0aGlzLCBfc2xpY2UoYXJndW1lbnRzLCBpZHgsIGVuZElkeCkpO1xuICAgICAgICAgICAgICAgIGN1cnJlbnREZXB0aCArPSAxO1xuICAgICAgICAgICAgICAgIGlkeCA9IGVuZElkeDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBDb21iaW5lcyB0d28gbGlzdHMgaW50byBhIHNldCAoaS5lLiBubyBkdXBsaWNhdGVzKSBjb21wb3NlZCBvZiB0aGUgZWxlbWVudHMgb2YgZWFjaCBsaXN0LiAgRHVwbGljYXRpb24gaXNcbiAgICAgKiBkZXRlcm1pbmVkIGFjY29yZGluZyB0byB0aGUgdmFsdWUgcmV0dXJuZWQgYnkgYXBwbHlpbmcgdGhlIHN1cHBsaWVkIHByZWRpY2F0ZSB0byB0d28gbGlzdCBlbGVtZW50cy5cbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgUmVsYXRpb25cbiAgICAgKiBAc2lnIChhLGEgLT4gQm9vbGVhbikgLT4gW2FdIC0+IFthXSAtPiBbYV1cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBwcmVkIEEgcHJlZGljYXRlIHVzZWQgdG8gdGVzdCB3aGV0aGVyIHR3byBpdGVtcyBhcmUgZXF1YWwuXG4gICAgICogQHBhcmFtIHtBcnJheX0gbGlzdDEgVGhlIGZpcnN0IGxpc3QuXG4gICAgICogQHBhcmFtIHtBcnJheX0gbGlzdDIgVGhlIHNlY29uZCBsaXN0LlxuICAgICAqIEByZXR1cm4ge0FycmF5fSBUaGUgZmlyc3QgYW5kIHNlY29uZCBsaXN0cyBjb25jYXRlbmF0ZWQsIHdpdGhcbiAgICAgKiAgICAgICAgIGR1cGxpY2F0ZXMgcmVtb3ZlZC5cbiAgICAgKiBAc2VlIFIudW5pb25cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICBmdW5jdGlvbiBjbXAoeCwgeSkgeyByZXR1cm4geC5hID09PSB5LmE7IH1cbiAgICAgKiAgICAgIHZhciBsMSA9IFt7YTogMX0sIHthOiAyfV07XG4gICAgICogICAgICB2YXIgbDIgPSBbe2E6IDF9LCB7YTogNH1dO1xuICAgICAqICAgICAgUi51bmlvbldpdGgoY21wLCBsMSwgbDIpOyAvLz0+IFt7YTogMX0sIHthOiAyfSwge2E6IDR9XVxuICAgICAqL1xuICAgIHZhciB1bmlvbldpdGggPSBfY3VycnkzKGZ1bmN0aW9uIHVuaW9uV2l0aChwcmVkLCBsaXN0MSwgbGlzdDIpIHtcbiAgICAgICAgcmV0dXJuIHVuaXFXaXRoKHByZWQsIF9jb25jYXQobGlzdDEsIGxpc3QyKSk7XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGEgbmV3IGxpc3QgYnkgcHVsbGluZyBldmVyeSBpdGVtIGF0IHRoZSBmaXJzdCBsZXZlbCBvZiBuZXN0aW5nIG91dCwgYW5kIHB1dHRpbmdcbiAgICAgKiB0aGVtIGluIGEgbmV3IGFycmF5LlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBMaXN0XG4gICAgICogQHNpZyBbYV0gLT4gW2JdXG4gICAgICogQHBhcmFtIHtBcnJheX0gbGlzdCBUaGUgYXJyYXkgdG8gY29uc2lkZXIuXG4gICAgICogQHJldHVybiB7QXJyYXl9IFRoZSBmbGF0dGVuZWQgbGlzdC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICBSLnVubmVzdChbMSwgWzJdLCBbWzNdXV0pOyAvLz0+IFsxLCAyLCBbM11dXG4gICAgICogICAgICBSLnVubmVzdChbWzEsIDJdLCBbMywgNF0sIFs1LCA2XV0pOyAvLz0+IFsxLCAyLCAzLCA0LCA1LCA2XVxuICAgICAqL1xuICAgIHZhciB1bm5lc3QgPSBfY3VycnkxKF9tYWtlRmxhdChmYWxzZSkpO1xuXG4gICAgLyoqXG4gICAgICogVGFrZXMgYSBzcGVjIG9iamVjdCBhbmQgYSB0ZXN0IG9iamVjdDsgcmV0dXJucyB0cnVlIGlmIHRoZSB0ZXN0IHNhdGlzZmllc1xuICAgICAqIHRoZSBzcGVjLCBmYWxzZSBvdGhlcndpc2UuIEFuIG9iamVjdCBzYXRpc2ZpZXMgdGhlIHNwZWMgaWYsIGZvciBlYWNoIG9mIHRoZVxuICAgICAqIHNwZWMncyBvd24gcHJvcGVydGllcywgYWNjZXNzaW5nIHRoYXQgcHJvcGVydHkgb2YgdGhlIG9iamVjdCBnaXZlcyB0aGUgc2FtZVxuICAgICAqIHZhbHVlIChpbiBgUi5lcXVhbHNgIHRlcm1zKSBhcyBhY2Nlc3NpbmcgdGhhdCBwcm9wZXJ0eSBvZiB0aGUgc3BlYy5cbiAgICAgKlxuICAgICAqIGB3aGVyZUVxYCBpcyBhIHNwZWNpYWxpemF0aW9uIG9mIFtgd2hlcmVgXSgjd2hlcmUpLlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBPYmplY3RcbiAgICAgKiBAc2lnIHtTdHJpbmc6ICp9IC0+IHtTdHJpbmc6ICp9IC0+IEJvb2xlYW5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gc3BlY1xuICAgICAqIEBwYXJhbSB7T2JqZWN0fSB0ZXN0T2JqXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICAgKiBAc2VlIFIud2hlcmVcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICAvLyBwcmVkIDo6IE9iamVjdCAtPiBCb29sZWFuXG4gICAgICogICAgICB2YXIgcHJlZCA9IFIud2hlcmVFcSh7YTogMSwgYjogMn0pO1xuICAgICAqXG4gICAgICogICAgICBwcmVkKHthOiAxfSk7ICAgICAgICAgICAgICAvLz0+IGZhbHNlXG4gICAgICogICAgICBwcmVkKHthOiAxLCBiOiAyfSk7ICAgICAgICAvLz0+IHRydWVcbiAgICAgKiAgICAgIHByZWQoe2E6IDEsIGI6IDIsIGM6IDN9KTsgIC8vPT4gdHJ1ZVxuICAgICAqICAgICAgcHJlZCh7YTogMSwgYjogMX0pOyAgICAgICAgLy89PiBmYWxzZVxuICAgICAqL1xuICAgIHZhciB3aGVyZUVxID0gX2N1cnJ5MihmdW5jdGlvbiB3aGVyZUVxKHNwZWMsIHRlc3RPYmopIHtcbiAgICAgICAgcmV0dXJuIHdoZXJlKG1hcE9iaihlcXVhbHMsIHNwZWMpLCB0ZXN0T2JqKTtcbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIFdyYXAgYSBmdW5jdGlvbiBpbnNpZGUgYW5vdGhlciB0byBhbGxvdyB5b3UgdG8gbWFrZSBhZGp1c3RtZW50cyB0byB0aGUgcGFyYW1ldGVycywgb3IgZG9cbiAgICAgKiBvdGhlciBwcm9jZXNzaW5nIGVpdGhlciBiZWZvcmUgdGhlIGludGVybmFsIGZ1bmN0aW9uIGlzIGNhbGxlZCBvciB3aXRoIGl0cyByZXN1bHRzLlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBGdW5jdGlvblxuICAgICAqIEBzaWcgKGEuLi4gLT4gYikgLT4gKChhLi4uIC0+IGIpIC0+IGEuLi4gLT4gYykgLT4gKGEuLi4gLT4gYylcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgZnVuY3Rpb24gdG8gd3JhcC5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSB3cmFwcGVyIFRoZSB3cmFwcGVyIGZ1bmN0aW9uLlxuICAgICAqIEByZXR1cm4ge0Z1bmN0aW9ufSBUaGUgd3JhcHBlZCBmdW5jdGlvbi5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICB2YXIgZ3JlZXQgPSBmdW5jdGlvbihuYW1lKSB7cmV0dXJuICdIZWxsbyAnICsgbmFtZTt9O1xuICAgICAqXG4gICAgICogICAgICB2YXIgc2hvdXRlZEdyZWV0ID0gUi53cmFwKGdyZWV0LCBmdW5jdGlvbihnciwgbmFtZSkge1xuICAgICAqICAgICAgICByZXR1cm4gZ3IobmFtZSkudG9VcHBlckNhc2UoKTtcbiAgICAgKiAgICAgIH0pO1xuICAgICAqICAgICAgc2hvdXRlZEdyZWV0KFwiS2F0aHlcIik7IC8vPT4gXCJIRUxMTyBLQVRIWVwiXG4gICAgICpcbiAgICAgKiAgICAgIHZhciBzaG9ydGVuZWRHcmVldCA9IFIud3JhcChncmVldCwgZnVuY3Rpb24oZ3IsIG5hbWUpIHtcbiAgICAgKiAgICAgICAgcmV0dXJuIGdyKG5hbWUuc3Vic3RyaW5nKDAsIDMpKTtcbiAgICAgKiAgICAgIH0pO1xuICAgICAqICAgICAgc2hvcnRlbmVkR3JlZXQoXCJSb2JlcnRcIik7IC8vPT4gXCJIZWxsbyBSb2JcIlxuICAgICAqL1xuICAgIHZhciB3cmFwID0gX2N1cnJ5MihmdW5jdGlvbiB3cmFwKGZuLCB3cmFwcGVyKSB7XG4gICAgICAgIHJldHVybiBjdXJyeU4oZm4ubGVuZ3RoLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gd3JhcHBlci5hcHBseSh0aGlzLCBfY29uY2F0KFtmbl0sIGFyZ3VtZW50cykpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIHZhciBfY2hhaW4gPSBfY3VycnkyKGZ1bmN0aW9uIF9jaGFpbihmLCBsaXN0KSB7XG4gICAgICAgIHJldHVybiB1bm5lc3QobWFwKGYsIGxpc3QpKTtcbiAgICB9KTtcblxuICAgIHZhciBfZmxhdENhdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHByZXNlcnZpbmdSZWR1Y2VkID0gZnVuY3Rpb24gKHhmKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICdAQHRyYW5zZHVjZXIvaW5pdCc6IF94ZkJhc2UuaW5pdCxcbiAgICAgICAgICAgICAgICAnQEB0cmFuc2R1Y2VyL3Jlc3VsdCc6IGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHhmWydAQHRyYW5zZHVjZXIvcmVzdWx0J10ocmVzdWx0KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICdAQHRyYW5zZHVjZXIvc3RlcCc6IGZ1bmN0aW9uIChyZXN1bHQsIGlucHV0KSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciByZXQgPSB4ZlsnQEB0cmFuc2R1Y2VyL3N0ZXAnXShyZXN1bHQsIGlucHV0KTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJldFsnQEB0cmFuc2R1Y2VyL3JlZHVjZWQnXSA/IF9mb3JjZVJlZHVjZWQocmV0KSA6IHJldDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gX3hjYXQoeGYpIHtcbiAgICAgICAgICAgIHZhciByeGYgPSBwcmVzZXJ2aW5nUmVkdWNlZCh4Zik7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICdAQHRyYW5zZHVjZXIvaW5pdCc6IF94ZkJhc2UuaW5pdCxcbiAgICAgICAgICAgICAgICAnQEB0cmFuc2R1Y2VyL3Jlc3VsdCc6IGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJ4ZlsnQEB0cmFuc2R1Y2VyL3Jlc3VsdCddKHJlc3VsdCk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAnQEB0cmFuc2R1Y2VyL3N0ZXAnOiBmdW5jdGlvbiAocmVzdWx0LCBpbnB1dCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gIWlzQXJyYXlMaWtlKGlucHV0KSA/IF9yZWR1Y2UocnhmLCByZXN1bHQsIFtpbnB1dF0pIDogX3JlZHVjZShyeGYsIHJlc3VsdCwgaW5wdXQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH07XG4gICAgfSgpO1xuXG4gICAgdmFyIF9pbmRleE9mID0gZnVuY3Rpb24gX2luZGV4T2YobGlzdCwgaXRlbSwgZnJvbSkge1xuICAgICAgICB2YXIgaWR4ID0gMDtcbiAgICAgICAgaWYgKHR5cGVvZiBmcm9tID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgaWR4ID0gZnJvbSA8IDAgPyBNYXRoLm1heCgwLCBsaXN0Lmxlbmd0aCArIGZyb20pIDogZnJvbTtcbiAgICAgICAgfVxuICAgICAgICB3aGlsZSAoaWR4IDwgbGlzdC5sZW5ndGgpIHtcbiAgICAgICAgICAgIGlmIChlcXVhbHMobGlzdFtpZHhdLCBpdGVtKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpZHg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZHggKz0gMTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gLTE7XG4gICAgfTtcblxuICAgIHZhciBfbGFzdEluZGV4T2YgPSBmdW5jdGlvbiBfbGFzdEluZGV4T2YobGlzdCwgaXRlbSwgZnJvbSkge1xuICAgICAgICB2YXIgaWR4O1xuICAgICAgICBpZiAodHlwZW9mIGZyb20gPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICBpZHggPSBmcm9tIDwgMCA/IGxpc3QubGVuZ3RoICsgZnJvbSA6IE1hdGgubWluKGxpc3QubGVuZ3RoIC0gMSwgZnJvbSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZHggPSBsaXN0Lmxlbmd0aCAtIDE7XG4gICAgICAgIH1cbiAgICAgICAgd2hpbGUgKGlkeCA+PSAwKSB7XG4gICAgICAgICAgICBpZiAoZXF1YWxzKGxpc3RbaWR4XSwgaXRlbSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaWR4O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWR4IC09IDE7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIC0xO1xuICAgIH07XG5cbiAgICB2YXIgX3BsdWNrID0gZnVuY3Rpb24gX3BsdWNrKHAsIGxpc3QpIHtcbiAgICAgICAgcmV0dXJuIG1hcChwcm9wKHApLCBsaXN0KTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlIGEgcHJlZGljYXRlIHdyYXBwZXIgd2hpY2ggd2lsbCBjYWxsIGEgcGljayBmdW5jdGlvbiAoYWxsL2FueSkgZm9yIGVhY2ggcHJlZGljYXRlXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEBzZWUgUi5hbGxcbiAgICAgKiBAc2VlIFIuYW55XG4gICAgICovXG4gICAgLy8gQ2FsbCBmdW5jdGlvbiBpbW1lZGlhdGVseSBpZiBnaXZlbiBhcmd1bWVudHNcbiAgICAvLyBSZXR1cm4gYSBmdW5jdGlvbiB3aGljaCB3aWxsIGNhbGwgdGhlIHByZWRpY2F0ZXMgd2l0aCB0aGUgcHJvdmlkZWQgYXJndW1lbnRzXG4gICAgdmFyIF9wcmVkaWNhdGVXcmFwID0gZnVuY3Rpb24gX3ByZWRpY2F0ZVdyYXAocHJlZFBpY2tlcikge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKHByZWRzKSB7XG4gICAgICAgICAgICB2YXIgcHJlZEl0ZXJhdG9yID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZhciBhcmdzID0gYXJndW1lbnRzO1xuICAgICAgICAgICAgICAgIHJldHVybiBwcmVkUGlja2VyKGZ1bmN0aW9uIChwcmVkaWNhdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByZWRpY2F0ZS5hcHBseShudWxsLCBhcmdzKTtcbiAgICAgICAgICAgICAgICB9LCBwcmVkcyk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPiAxID8gLy8gQ2FsbCBmdW5jdGlvbiBpbW1lZGlhdGVseSBpZiBnaXZlbiBhcmd1bWVudHNcbiAgICAgICAgICAgIHByZWRJdGVyYXRvci5hcHBseShudWxsLCBfc2xpY2UoYXJndW1lbnRzLCAxKSkgOiAvLyBSZXR1cm4gYSBmdW5jdGlvbiB3aGljaCB3aWxsIGNhbGwgdGhlIHByZWRpY2F0ZXMgd2l0aCB0aGUgcHJvdmlkZWQgYXJndW1lbnRzXG4gICAgICAgICAgICBhcml0eShtYXgoX3BsdWNrKCdsZW5ndGgnLCBwcmVkcykpLCBwcmVkSXRlcmF0b3IpO1xuICAgICAgICB9O1xuICAgIH07XG5cbiAgICB2YXIgX3N0ZXBDYXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBfc3RlcENhdEFycmF5ID0ge1xuICAgICAgICAgICAgJ0BAdHJhbnNkdWNlci9pbml0JzogQXJyYXksXG4gICAgICAgICAgICAnQEB0cmFuc2R1Y2VyL3N0ZXAnOiBmdW5jdGlvbiAoeHMsIHgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gX2NvbmNhdCh4cywgW3hdKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnQEB0cmFuc2R1Y2VyL3Jlc3VsdCc6IF9pZGVudGl0eVxuICAgICAgICB9O1xuICAgICAgICB2YXIgX3N0ZXBDYXRTdHJpbmcgPSB7XG4gICAgICAgICAgICAnQEB0cmFuc2R1Y2VyL2luaXQnOiBTdHJpbmcsXG4gICAgICAgICAgICAnQEB0cmFuc2R1Y2VyL3N0ZXAnOiBfYWRkLFxuICAgICAgICAgICAgJ0BAdHJhbnNkdWNlci9yZXN1bHQnOiBfaWRlbnRpdHlcbiAgICAgICAgfTtcbiAgICAgICAgdmFyIF9zdGVwQ2F0T2JqZWN0ID0ge1xuICAgICAgICAgICAgJ0BAdHJhbnNkdWNlci9pbml0JzogT2JqZWN0LFxuICAgICAgICAgICAgJ0BAdHJhbnNkdWNlci9zdGVwJzogZnVuY3Rpb24gKHJlc3VsdCwgaW5wdXQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbWVyZ2UocmVzdWx0LCBpc0FycmF5TGlrZShpbnB1dCkgPyBfY3JlYXRlTWFwRW50cnkoaW5wdXRbMF0sIGlucHV0WzFdKSA6IGlucHV0KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnQEB0cmFuc2R1Y2VyL3Jlc3VsdCc6IF9pZGVudGl0eVxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gX3N0ZXBDYXQob2JqKSB7XG4gICAgICAgICAgICBpZiAoX2lzVHJhbnNmb3JtZXIob2JqKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBvYmo7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaXNBcnJheUxpa2Uob2JqKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBfc3RlcENhdEFycmF5O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHR5cGVvZiBvYmogPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIF9zdGVwQ2F0U3RyaW5nO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHR5cGVvZiBvYmogPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIF9zdGVwQ2F0T2JqZWN0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgY3JlYXRlIHRyYW5zZm9ybWVyIGZvciAnICsgb2JqKTtcbiAgICAgICAgfTtcbiAgICB9KCk7XG5cbiAgICAvLyBGdW5jdGlvbiwgUmVnRXhwLCB1c2VyLWRlZmluZWQgdHlwZXNcbiAgICB2YXIgX3RvU3RyaW5nID0gZnVuY3Rpb24gX3RvU3RyaW5nKHgsIHNlZW4pIHtcbiAgICAgICAgdmFyIHJlY3VyID0gZnVuY3Rpb24gcmVjdXIoeSkge1xuICAgICAgICAgICAgdmFyIHhzID0gc2Vlbi5jb25jYXQoW3hdKTtcbiAgICAgICAgICAgIHJldHVybiBfaW5kZXhPZih4cywgeSkgPj0gMCA/ICc8Q2lyY3VsYXI+JyA6IF90b1N0cmluZyh5LCB4cyk7XG4gICAgICAgIH07XG4gICAgICAgIHN3aXRjaCAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHgpKSB7XG4gICAgICAgIGNhc2UgJ1tvYmplY3QgQXJndW1lbnRzXSc6XG4gICAgICAgICAgICByZXR1cm4gJyhmdW5jdGlvbigpIHsgcmV0dXJuIGFyZ3VtZW50czsgfSgnICsgX21hcChyZWN1ciwgeCkuam9pbignLCAnKSArICcpKSc7XG4gICAgICAgIGNhc2UgJ1tvYmplY3QgQXJyYXldJzpcbiAgICAgICAgICAgIHJldHVybiAnWycgKyBfbWFwKHJlY3VyLCB4KS5qb2luKCcsICcpICsgJ10nO1xuICAgICAgICBjYXNlICdbb2JqZWN0IEJvb2xlYW5dJzpcbiAgICAgICAgICAgIHJldHVybiB0eXBlb2YgeCA9PT0gJ29iamVjdCcgPyAnbmV3IEJvb2xlYW4oJyArIHJlY3VyKHgudmFsdWVPZigpKSArICcpJyA6IHgudG9TdHJpbmcoKTtcbiAgICAgICAgY2FzZSAnW29iamVjdCBEYXRlXSc6XG4gICAgICAgICAgICByZXR1cm4gJ25ldyBEYXRlKCcgKyBfcXVvdGUoX3RvSVNPU3RyaW5nKHgpKSArICcpJztcbiAgICAgICAgY2FzZSAnW29iamVjdCBOdWxsXSc6XG4gICAgICAgICAgICByZXR1cm4gJ251bGwnO1xuICAgICAgICBjYXNlICdbb2JqZWN0IE51bWJlcl0nOlxuICAgICAgICAgICAgcmV0dXJuIHR5cGVvZiB4ID09PSAnb2JqZWN0JyA/ICduZXcgTnVtYmVyKCcgKyByZWN1cih4LnZhbHVlT2YoKSkgKyAnKScgOiAxIC8geCA9PT0gLUluZmluaXR5ID8gJy0wJyA6IHgudG9TdHJpbmcoMTApO1xuICAgICAgICBjYXNlICdbb2JqZWN0IFN0cmluZ10nOlxuICAgICAgICAgICAgcmV0dXJuIHR5cGVvZiB4ID09PSAnb2JqZWN0JyA/ICduZXcgU3RyaW5nKCcgKyByZWN1cih4LnZhbHVlT2YoKSkgKyAnKScgOiBfcXVvdGUoeCk7XG4gICAgICAgIGNhc2UgJ1tvYmplY3QgVW5kZWZpbmVkXSc6XG4gICAgICAgICAgICByZXR1cm4gJ3VuZGVmaW5lZCc7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICByZXR1cm4gdHlwZW9mIHguY29uc3RydWN0b3IgPT09ICdmdW5jdGlvbicgJiYgeC5jb25zdHJ1Y3Rvci5uYW1lICE9PSAnT2JqZWN0JyAmJiB0eXBlb2YgeC50b1N0cmluZyA9PT0gJ2Z1bmN0aW9uJyAmJiB4LnRvU3RyaW5nKCkgIT09ICdbb2JqZWN0IE9iamVjdF0nID8geC50b1N0cmluZygpIDogLy8gRnVuY3Rpb24sIFJlZ0V4cCwgdXNlci1kZWZpbmVkIHR5cGVzXG4gICAgICAgICAgICAneycgKyBfbWFwKGZ1bmN0aW9uIChrKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIF9xdW90ZShrKSArICc6ICcgKyByZWN1cih4W2tdKTtcbiAgICAgICAgICAgIH0sIGtleXMoeCkuc29ydCgpKS5qb2luKCcsICcpICsgJ30nO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIHZhciBfeGNoYWluID0gX2N1cnJ5MihmdW5jdGlvbiBfeGNoYWluKGYsIHhmKSB7XG4gICAgICAgIHJldHVybiBtYXAoZiwgX2ZsYXRDYXQoeGYpKTtcbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSBuZXcgbGlzdCBpdGVyYXRpb24gZnVuY3Rpb24gZnJvbSBhbiBleGlzdGluZyBvbmUgYnkgYWRkaW5nIHR3byBuZXcgcGFyYW1ldGVyc1xuICAgICAqIHRvIGl0cyBjYWxsYmFjayBmdW5jdGlvbjogdGhlIGN1cnJlbnQgaW5kZXgsIGFuZCB0aGUgZW50aXJlIGxpc3QuXG4gICAgICpcbiAgICAgKiBUaGlzIHdvdWxkIHR1cm4sIGZvciBpbnN0YW5jZSwgUmFtZGEncyBzaW1wbGUgYG1hcGAgZnVuY3Rpb24gaW50byBvbmUgdGhhdCBtb3JlIGNsb3NlbHlcbiAgICAgKiByZXNlbWJsZXMgYEFycmF5LnByb3RvdHlwZS5tYXBgLiAgTm90ZSB0aGF0IHRoaXMgd2lsbCBvbmx5IHdvcmsgZm9yIGZ1bmN0aW9ucyBpbiB3aGljaFxuICAgICAqIHRoZSBpdGVyYXRpb24gY2FsbGJhY2sgZnVuY3Rpb24gaXMgdGhlIGZpcnN0IHBhcmFtZXRlciwgYW5kIHdoZXJlIHRoZSBsaXN0IGlzIHRoZSBsYXN0XG4gICAgICogcGFyYW1ldGVyLiAgKFRoaXMgbGF0dGVyIG1pZ2h0IGJlIHVuaW1wb3J0YW50IGlmIHRoZSBsaXN0IHBhcmFtZXRlciBpcyBub3QgdXNlZC4pXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IEZ1bmN0aW9uXG4gICAgICogQGNhdGVnb3J5IExpc3RcbiAgICAgKiBAc2lnICgoYSAuLi4gLT4gYikgLi4uIC0+IFthXSAtPiAqKSAtPiAoYSAuLi4sIEludCwgW2FdIC0+IGIpIC4uLiAtPiBbYV0gLT4gKilcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBBIGxpc3QgaXRlcmF0aW9uIGZ1bmN0aW9uIHRoYXQgZG9lcyBub3QgcGFzcyBpbmRleC9saXN0IHRvIGl0cyBjYWxsYmFja1xuICAgICAqIEByZXR1cm4gQW4gYWx0ZXJlZCBsaXN0IGl0ZXJhdGlvbiBmdW5jdGlvbiB0aGF0cyBwYXNzZXMgaW5kZXgvbGlzdCB0byBpdHMgY2FsbGJhY2tcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICB2YXIgbWFwSW5kZXhlZCA9IFIuYWRkSW5kZXgoUi5tYXApO1xuICAgICAqICAgICAgbWFwSW5kZXhlZChmdW5jdGlvbih2YWwsIGlkeCkge3JldHVybiBpZHggKyAnLScgKyB2YWw7fSwgWydmJywgJ28nLCAnbycsICdiJywgJ2EnLCAnciddKTtcbiAgICAgKiAgICAgIC8vPT4gWycwLWYnLCAnMS1vJywgJzItbycsICczLWInLCAnNC1hJywgJzUtciddXG4gICAgICovXG4gICAgdmFyIGFkZEluZGV4ID0gX2N1cnJ5MShmdW5jdGlvbiAoZm4pIHtcbiAgICAgICAgcmV0dXJuIGN1cnJ5Tihmbi5sZW5ndGgsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBpZHggPSAwO1xuICAgICAgICAgICAgdmFyIG9yaWdGbiA9IGFyZ3VtZW50c1swXTtcbiAgICAgICAgICAgIHZhciBsaXN0ID0gYXJndW1lbnRzW2FyZ3VtZW50cy5sZW5ndGggLSAxXTtcbiAgICAgICAgICAgIHZhciBpbmRleGVkRm4gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IG9yaWdGbi5hcHBseSh0aGlzLCBfY29uY2F0KGFyZ3VtZW50cywgW1xuICAgICAgICAgICAgICAgICAgICBpZHgsXG4gICAgICAgICAgICAgICAgICAgIGxpc3RcbiAgICAgICAgICAgICAgICBdKSk7XG4gICAgICAgICAgICAgICAgaWR4ICs9IDE7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICByZXR1cm4gZm4uYXBwbHkodGhpcywgX3ByZXBlbmQoaW5kZXhlZEZuLCBfc2xpY2UoYXJndW1lbnRzLCAxKSkpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIGFwIGFwcGxpZXMgYSBsaXN0IG9mIGZ1bmN0aW9ucyB0byBhIGxpc3Qgb2YgdmFsdWVzLlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBGdW5jdGlvblxuICAgICAqIEBzaWcgW2ZdIC0+IFthXSAtPiBbZiBhXVxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGZucyBBbiBhcnJheSBvZiBmdW5jdGlvbnNcbiAgICAgKiBAcGFyYW0ge0FycmF5fSB2cyBBbiBhcnJheSBvZiB2YWx1ZXNcbiAgICAgKiBAcmV0dXJuIHtBcnJheX0gQW4gYXJyYXkgb2YgcmVzdWx0cyBvZiBhcHBseWluZyBlYWNoIG9mIGBmbnNgIHRvIGFsbCBvZiBgdnNgIGluIHR1cm4uXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgUi5hcChbUi5tdWx0aXBseSgyKSwgUi5hZGQoMyldLCBbMSwyLDNdKTsgLy89PiBbMiwgNCwgNiwgNCwgNSwgNl1cbiAgICAgKi9cbiAgICB2YXIgYXAgPSBfY3VycnkyKGZ1bmN0aW9uIGFwKGZucywgdnMpIHtcbiAgICAgICAgcmV0dXJuIF9oYXNNZXRob2QoJ2FwJywgZm5zKSA/IGZucy5hcCh2cykgOiBfcmVkdWNlKGZ1bmN0aW9uIChhY2MsIGZuKSB7XG4gICAgICAgICAgICByZXR1cm4gX2NvbmNhdChhY2MsIG1hcChmbiwgdnMpKTtcbiAgICAgICAgfSwgW10sIGZucyk7XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBgY2hhaW5gIG1hcHMgYSBmdW5jdGlvbiBvdmVyIGEgbGlzdCBhbmQgY29uY2F0ZW5hdGVzIHRoZSByZXN1bHRzLlxuICAgICAqIFRoaXMgaW1wbGVtZW50YXRpb24gaXMgY29tcGF0aWJsZSB3aXRoIHRoZVxuICAgICAqIEZhbnRhc3ktbGFuZCBDaGFpbiBzcGVjLCBhbmQgd2lsbCB3b3JrIHdpdGggdHlwZXMgdGhhdCBpbXBsZW1lbnQgdGhhdCBzcGVjLlxuICAgICAqIGBjaGFpbmAgaXMgYWxzbyBrbm93biBhcyBgZmxhdE1hcGAgaW4gc29tZSBsaWJyYXJpZXNcbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgTGlzdFxuICAgICAqIEBzaWcgKGEgLT4gW2JdKSAtPiBbYV0gLT4gW2JdXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAgICAgKiBAcGFyYW0ge0FycmF5fSBsaXN0XG4gICAgICogQHJldHVybiB7QXJyYXl9XG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgdmFyIGR1cGxpY2F0ZSA9IGZ1bmN0aW9uKG4pIHtcbiAgICAgKiAgICAgICAgcmV0dXJuIFtuLCBuXTtcbiAgICAgKiAgICAgIH07XG4gICAgICogICAgICBSLmNoYWluKGR1cGxpY2F0ZSwgWzEsIDIsIDNdKTsgLy89PiBbMSwgMSwgMiwgMiwgMywgM11cbiAgICAgKi9cbiAgICB2YXIgY2hhaW4gPSBfY3VycnkyKF9kaXNwYXRjaGFibGUoJ2NoYWluJywgX3hjaGFpbiwgX2NoYWluKSk7XG5cbiAgICAvKipcbiAgICAgKiBUdXJucyBhIGxpc3Qgb2YgRnVuY3RvcnMgaW50byBhIEZ1bmN0b3Igb2YgYSBsaXN0LCBhcHBseWluZ1xuICAgICAqIGEgbWFwcGluZyBmdW5jdGlvbiB0byB0aGUgZWxlbWVudHMgb2YgdGhlIGxpc3QgYWxvbmcgdGhlIHdheS5cbiAgICAgKlxuICAgICAqIE5vdGU6IGBjb21tdXRlTWFwYCBtYXkgYmUgbW9yZSB1c2VmdWwgdG8gY29udmVydCBhIGxpc3Qgb2Ygbm9uLUFycmF5IEZ1bmN0b3JzIChlLmcuXG4gICAgICogTWF5YmUsIEVpdGhlciwgZXRjLikgdG8gRnVuY3RvciBvZiBhIGxpc3QuXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IExpc3RcbiAgICAgKiBAc2VlIFIuY29tbXV0ZVxuICAgICAqIEBzaWcgKGEgLT4gKGIgLT4gYykpIC0+ICh4IC0+IFt4XSkgLT4gW1sqXS4uLl1cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgdHJhbnNmb3JtYXRpb24gZnVuY3Rpb25cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBvZiBBIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyB0aGUgZGF0YSB0eXBlIHRvIHJldHVyblxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGxpc3QgQW4gQXJyYXkgKG9yIG90aGVyIEZ1bmN0b3IpIG9mIEFycmF5cyAob3Igb3RoZXIgRnVuY3RvcnMpXG4gICAgICogQHJldHVybiB7QXJyYXl9XG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgdmFyIHBsdXMxMG1hcCA9IFIubWFwKGZ1bmN0aW9uKHgpIHsgcmV0dXJuIHggKyAxMDsgfSk7XG4gICAgICogICAgICB2YXIgYXMgPSBbWzFdLCBbMywgNF1dO1xuICAgICAqICAgICAgUi5jb21tdXRlTWFwKFIubWFwKGZ1bmN0aW9uKHgpIHsgcmV0dXJuIHggKyAxMDsgfSksIFIub2YsIGFzKTsgLy89PiBbWzExLCAxM10sIFsxMSwgMTRdXVxuICAgICAqXG4gICAgICogICAgICB2YXIgYnMgPSBbWzEsIDJdLCBbM11dO1xuICAgICAqICAgICAgUi5jb21tdXRlTWFwKHBsdXMxMG1hcCwgUi5vZiwgYnMpOyAvLz0+IFtbMTEsIDEzXSwgWzEyLCAxM11dXG4gICAgICpcbiAgICAgKiAgICAgIHZhciBjcyA9IFtbMSwgMl0sIFszLCA0XV07XG4gICAgICogICAgICBSLmNvbW11dGVNYXAocGx1czEwbWFwLCBSLm9mLCBjcyk7IC8vPT4gW1sxMSwgMTNdLCBbMTIsIDEzXSwgWzExLCAxNF0sIFsxMiwgMTRdXVxuICAgICAqL1xuICAgIHZhciBjb21tdXRlTWFwID0gX2N1cnJ5MyhmdW5jdGlvbiBjb21tdXRlTWFwKGZuLCBvZiwgbGlzdCkge1xuICAgICAgICBmdW5jdGlvbiBjb25zRihhY2MsIGZ0b3IpIHtcbiAgICAgICAgICAgIHJldHVybiBhcChtYXAoYXBwZW5kLCBmbihmdG9yKSksIGFjYyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIF9yZWR1Y2UoY29uc0YsIG9mKFtdKSwgbGlzdCk7XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGEgY3VycmllZCBlcXVpdmFsZW50IG9mIHRoZSBwcm92aWRlZCBmdW5jdGlvbi4gVGhlIGN1cnJpZWRcbiAgICAgKiBmdW5jdGlvbiBoYXMgdHdvIHVudXN1YWwgY2FwYWJpbGl0aWVzLiBGaXJzdCwgaXRzIGFyZ3VtZW50cyBuZWVkbid0XG4gICAgICogYmUgcHJvdmlkZWQgb25lIGF0IGEgdGltZS4gSWYgYGZgIGlzIGEgdGVybmFyeSBmdW5jdGlvbiBhbmQgYGdgIGlzXG4gICAgICogYFIuY3VycnkoZilgLCB0aGUgZm9sbG93aW5nIGFyZSBlcXVpdmFsZW50OlxuICAgICAqXG4gICAgICogICAtIGBnKDEpKDIpKDMpYFxuICAgICAqICAgLSBgZygxKSgyLCAzKWBcbiAgICAgKiAgIC0gYGcoMSwgMikoMylgXG4gICAgICogICAtIGBnKDEsIDIsIDMpYFxuICAgICAqXG4gICAgICogU2Vjb25kbHksIHRoZSBzcGVjaWFsIHBsYWNlaG9sZGVyIHZhbHVlIGBSLl9fYCBtYXkgYmUgdXNlZCB0byBzcGVjaWZ5XG4gICAgICogXCJnYXBzXCIsIGFsbG93aW5nIHBhcnRpYWwgYXBwbGljYXRpb24gb2YgYW55IGNvbWJpbmF0aW9uIG9mIGFyZ3VtZW50cyxcbiAgICAgKiByZWdhcmRsZXNzIG9mIHRoZWlyIHBvc2l0aW9ucy4gSWYgYGdgIGlzIGFzIGFib3ZlIGFuZCBgX2AgaXMgYFIuX19gLFxuICAgICAqIHRoZSBmb2xsb3dpbmcgYXJlIGVxdWl2YWxlbnQ6XG4gICAgICpcbiAgICAgKiAgIC0gYGcoMSwgMiwgMylgXG4gICAgICogICAtIGBnKF8sIDIsIDMpKDEpYFxuICAgICAqICAgLSBgZyhfLCBfLCAzKSgxKSgyKWBcbiAgICAgKiAgIC0gYGcoXywgXywgMykoMSwgMilgXG4gICAgICogICAtIGBnKF8sIDIpKDEpKDMpYFxuICAgICAqICAgLSBgZyhfLCAyKSgxLCAzKWBcbiAgICAgKiAgIC0gYGcoXywgMikoXywgMykoMSlgXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IEZ1bmN0aW9uXG4gICAgICogQHNpZyAoKiAtPiBhKSAtPiAoKiAtPiBhKVxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBmdW5jdGlvbiB0byBjdXJyeS5cbiAgICAgKiBAcmV0dXJuIHtGdW5jdGlvbn0gQSBuZXcsIGN1cnJpZWQgZnVuY3Rpb24uXG4gICAgICogQHNlZSBSLmN1cnJ5TlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIHZhciBhZGRGb3VyTnVtYmVycyA9IGZ1bmN0aW9uKGEsIGIsIGMsIGQpIHtcbiAgICAgKiAgICAgICAgcmV0dXJuIGEgKyBiICsgYyArIGQ7XG4gICAgICogICAgICB9O1xuICAgICAqXG4gICAgICogICAgICB2YXIgY3VycmllZEFkZEZvdXJOdW1iZXJzID0gUi5jdXJyeShhZGRGb3VyTnVtYmVycyk7XG4gICAgICogICAgICB2YXIgZiA9IGN1cnJpZWRBZGRGb3VyTnVtYmVycygxLCAyKTtcbiAgICAgKiAgICAgIHZhciBnID0gZigzKTtcbiAgICAgKiAgICAgIGcoNCk7IC8vPT4gMTBcbiAgICAgKi9cbiAgICB2YXIgY3VycnkgPSBfY3VycnkxKGZ1bmN0aW9uIGN1cnJ5KGZuKSB7XG4gICAgICAgIHJldHVybiBjdXJyeU4oZm4ubGVuZ3RoLCBmbik7XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGEgbGlzdCBjb250YWluaW5nIGFsbCBidXQgdGhlIGZpcnN0IGBuYCBlbGVtZW50cyBvZiB0aGUgZ2l2ZW4gYGxpc3RgLlxuICAgICAqXG4gICAgICogQWN0cyBhcyBhIHRyYW5zZHVjZXIgaWYgYSB0cmFuc2Zvcm1lciBpcyBnaXZlbiBpbiBsaXN0IHBvc2l0aW9uLlxuICAgICAqIEBzZWUgUi50cmFuc2R1Y2VcbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgTGlzdFxuICAgICAqIEBzaWcgTnVtYmVyIC0+IFthXSAtPiBbYV1cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gbiBUaGUgbnVtYmVyIG9mIGVsZW1lbnRzIG9mIGB4c2AgdG8gc2tpcC5cbiAgICAgKiBAcGFyYW0ge0FycmF5fSB4cyBUaGUgY29sbGVjdGlvbiB0byBjb25zaWRlci5cbiAgICAgKiBAcmV0dXJuIHtBcnJheX1cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICBSLmRyb3AoMywgWzEsMiwzLDQsNSw2LDddKTsgLy89PiBbNCw1LDYsN11cbiAgICAgKi9cbiAgICB2YXIgZHJvcCA9IF9jdXJyeTIoX2Rpc3BhdGNoYWJsZSgnZHJvcCcsIF94ZHJvcCwgZnVuY3Rpb24gZHJvcChuLCB4cykge1xuICAgICAgICByZXR1cm4gc2xpY2UoTWF0aC5tYXgoMCwgbiksIEluZmluaXR5LCB4cyk7XG4gICAgfSkpO1xuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhIG5ldyBsaXN0IHdpdGhvdXQgYW55IGNvbnNlY3V0aXZlbHkgcmVwZWF0aW5nIGVsZW1lbnRzLiBFcXVhbGl0eSBpc1xuICAgICAqIGRldGVybWluZWQgYnkgYXBwbHlpbmcgdGhlIHN1cHBsaWVkIHByZWRpY2F0ZSB0d28gY29uc2VjdXRpdmUgZWxlbWVudHMuXG4gICAgICogVGhlIGZpcnN0IGVsZW1lbnQgaW4gYSBzZXJpZXMgb2YgZXF1YWwgZWxlbWVudCBpcyB0aGUgb25lIGJlaW5nIHByZXNlcnZlZC5cbiAgICAgKlxuICAgICAqIEFjdHMgYXMgYSB0cmFuc2R1Y2VyIGlmIGEgdHJhbnNmb3JtZXIgaXMgZ2l2ZW4gaW4gbGlzdCBwb3NpdGlvbi5cbiAgICAgKiBAc2VlIFIudHJhbnNkdWNlXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IExpc3RcbiAgICAgKiBAc2lnIChhLCBhIC0+IEJvb2xlYW4pIC0+IFthXSAtPiBbYV1cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBwcmVkIEEgcHJlZGljYXRlIHVzZWQgdG8gdGVzdCB3aGV0aGVyIHR3byBpdGVtcyBhcmUgZXF1YWwuXG4gICAgICogQHBhcmFtIHtBcnJheX0gbGlzdCBUaGUgYXJyYXkgdG8gY29uc2lkZXIuXG4gICAgICogQHJldHVybiB7QXJyYXl9IGBsaXN0YCB3aXRob3V0IHJlcGVhdGluZyBlbGVtZW50cy5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICBmdW5jdGlvbiBsZW5ndGhFcSh4LCB5KSB7IHJldHVybiBNYXRoLmFicyh4KSA9PT0gTWF0aC5hYnMoeSk7IH07XG4gICAgICogICAgICB2YXIgbCA9IFsxLCAtMSwgMSwgMywgNCwgLTQsIC00LCAtNSwgNSwgMywgM107XG4gICAgICogICAgICBSLmRyb3BSZXBlYXRzV2l0aChsZW5ndGhFcSwgbCk7IC8vPT4gWzEsIDMsIDQsIC01LCAzXVxuICAgICAqL1xuICAgIHZhciBkcm9wUmVwZWF0c1dpdGggPSBfY3VycnkyKF9kaXNwYXRjaGFibGUoJ2Ryb3BSZXBlYXRzV2l0aCcsIF94ZHJvcFJlcGVhdHNXaXRoLCBmdW5jdGlvbiBkcm9wUmVwZWF0c1dpdGgocHJlZCwgbGlzdCkge1xuICAgICAgICB2YXIgcmVzdWx0ID0gW107XG4gICAgICAgIHZhciBpZHggPSAxO1xuICAgICAgICBpZiAobGlzdC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICByZXN1bHRbMF0gPSBsaXN0WzBdO1xuICAgICAgICAgICAgd2hpbGUgKGlkeCA8IGxpc3QubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFwcmVkKGxhc3QocmVzdWx0KSwgbGlzdFtpZHhdKSkge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHRbcmVzdWx0Lmxlbmd0aF0gPSBsaXN0W2lkeF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlkeCArPSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfSkpO1xuXG4gICAgLyoqXG4gICAgICogUmVwb3J0cyB3aGV0aGVyIHR3byBvYmplY3RzIGhhdmUgdGhlIHNhbWUgdmFsdWUsIGluIGBSLmVxdWFsc2AgdGVybXMsXG4gICAgICogZm9yIHRoZSBzcGVjaWZpZWQgcHJvcGVydHkuIFVzZWZ1bCBhcyBhIGN1cnJpZWQgcHJlZGljYXRlLlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBPYmplY3RcbiAgICAgKiBAc2lnIGsgLT4ge2s6IHZ9IC0+IHtrOiB2fSAtPiBCb29sZWFuXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHByb3AgVGhlIG5hbWUgb2YgdGhlIHByb3BlcnR5IHRvIGNvbXBhcmVcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb2JqMVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvYmoyXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIHZhciBvMSA9IHsgYTogMSwgYjogMiwgYzogMywgZDogNCB9O1xuICAgICAqICAgICAgdmFyIG8yID0geyBhOiAxMCwgYjogMjAsIGM6IDMsIGQ6IDQwIH07XG4gICAgICogICAgICBSLmVxUHJvcHMoJ2EnLCBvMSwgbzIpOyAvLz0+IGZhbHNlXG4gICAgICogICAgICBSLmVxUHJvcHMoJ2MnLCBvMSwgbzIpOyAvLz0+IHRydWVcbiAgICAgKi9cbiAgICB2YXIgZXFQcm9wcyA9IF9jdXJyeTMoZnVuY3Rpb24gZXFQcm9wcyhwcm9wLCBvYmoxLCBvYmoyKSB7XG4gICAgICAgIHJldHVybiBlcXVhbHMob2JqMVtwcm9wXSwgb2JqMltwcm9wXSk7XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGEgbmV3IGZ1bmN0aW9uIG11Y2ggbGlrZSB0aGUgc3VwcGxpZWQgb25lLCBleGNlcHQgdGhhdCB0aGUgZmlyc3QgdHdvIGFyZ3VtZW50cydcbiAgICAgKiBvcmRlciBpcyByZXZlcnNlZC5cbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgRnVuY3Rpb25cbiAgICAgKiBAc2lnIChhIC0+IGIgLT4gYyAtPiAuLi4gLT4geikgLT4gKGIgLT4gYSAtPiBjIC0+IC4uLiAtPiB6KVxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBmdW5jdGlvbiB0byBpbnZva2Ugd2l0aCBpdHMgZmlyc3QgdHdvIHBhcmFtZXRlcnMgcmV2ZXJzZWQuXG4gICAgICogQHJldHVybiB7Kn0gVGhlIHJlc3VsdCBvZiBpbnZva2luZyBgZm5gIHdpdGggaXRzIGZpcnN0IHR3byBwYXJhbWV0ZXJzJyBvcmRlciByZXZlcnNlZC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICB2YXIgbWVyZ2VUaHJlZSA9IGZ1bmN0aW9uKGEsIGIsIGMpIHtcbiAgICAgKiAgICAgICAgcmV0dXJuIChbXSkuY29uY2F0KGEsIGIsIGMpO1xuICAgICAqICAgICAgfTtcbiAgICAgKlxuICAgICAqICAgICAgbWVyZ2VUaHJlZSgxLCAyLCAzKTsgLy89PiBbMSwgMiwgM11cbiAgICAgKlxuICAgICAqICAgICAgUi5mbGlwKG1lcmdlVGhyZWUpKDEsIDIsIDMpOyAvLz0+IFsyLCAxLCAzXVxuICAgICAqL1xuICAgIHZhciBmbGlwID0gX2N1cnJ5MShmdW5jdGlvbiBmbGlwKGZuKSB7XG4gICAgICAgIHJldHVybiBjdXJyeShmdW5jdGlvbiAoYSwgYikge1xuICAgICAgICAgICAgdmFyIGFyZ3MgPSBfc2xpY2UoYXJndW1lbnRzKTtcbiAgICAgICAgICAgIGFyZ3NbMF0gPSBiO1xuICAgICAgICAgICAgYXJnc1sxXSA9IGE7XG4gICAgICAgICAgICByZXR1cm4gZm4uYXBwbHkodGhpcywgYXJncyk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgcG9zaXRpb24gb2YgdGhlIGZpcnN0IG9jY3VycmVuY2Ugb2YgYW4gaXRlbSBpbiBhbiBhcnJheSxcbiAgICAgKiBvciAtMSBpZiB0aGUgaXRlbSBpcyBub3QgaW5jbHVkZWQgaW4gdGhlIGFycmF5LiBgUi5lcXVhbHNgIGlzIHVzZWQgdG9cbiAgICAgKiBkZXRlcm1pbmUgZXF1YWxpdHkuXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IExpc3RcbiAgICAgKiBAc2lnIGEgLT4gW2FdIC0+IE51bWJlclxuICAgICAqIEBwYXJhbSB7Kn0gdGFyZ2V0IFRoZSBpdGVtIHRvIGZpbmQuXG4gICAgICogQHBhcmFtIHtBcnJheX0geHMgVGhlIGFycmF5IHRvIHNlYXJjaCBpbi5cbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9IHRoZSBpbmRleCBvZiB0aGUgdGFyZ2V0LCBvciAtMSBpZiB0aGUgdGFyZ2V0IGlzIG5vdCBmb3VuZC5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIFIuaW5kZXhPZigzLCBbMSwyLDMsNF0pOyAvLz0+IDJcbiAgICAgKiAgICAgIFIuaW5kZXhPZigxMCwgWzEsMiwzLDRdKTsgLy89PiAtMVxuICAgICAqL1xuICAgIHZhciBpbmRleE9mID0gX2N1cnJ5MihmdW5jdGlvbiBpbmRleE9mKHRhcmdldCwgeHMpIHtcbiAgICAgICAgcmV0dXJuIF9oYXNNZXRob2QoJ2luZGV4T2YnLCB4cykgPyB4cy5pbmRleE9mKHRhcmdldCkgOiBfaW5kZXhPZih4cywgdGFyZ2V0KTtcbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYWxsIGJ1dCB0aGUgbGFzdCBlbGVtZW50IG9mIGEgbGlzdC5cbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgTGlzdFxuICAgICAqIEBzaWcgW2FdIC0+IFthXVxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGxpc3QgVGhlIGFycmF5IHRvIGNvbnNpZGVyLlxuICAgICAqIEByZXR1cm4ge0FycmF5fSBBIG5ldyBhcnJheSBjb250YWluaW5nIGFsbCBidXQgdGhlIGxhc3QgZWxlbWVudCBvZiB0aGUgaW5wdXQgbGlzdCwgb3IgYW5cbiAgICAgKiAgICAgICAgIGVtcHR5IGxpc3QgaWYgdGhlIGlucHV0IGxpc3QgaXMgZW1wdHkuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgUi5pbml0KFsnZmknLCAnZm8nLCAnZnVtJ10pOyAvLz0+IFsnZmknLCAnZm8nXVxuICAgICAqL1xuICAgIHZhciBpbml0ID0gc2xpY2UoMCwgLTEpO1xuXG4gICAgLyoqXG4gICAgICogVHJhbnNmb3JtcyB0aGUgaXRlbXMgb2YgdGhlIGxpc3Qgd2l0aCB0aGUgdHJhbnNkdWNlciBhbmQgYXBwZW5kcyB0aGUgdHJhbnNmb3JtZWQgaXRlbXMgdG9cbiAgICAgKiB0aGUgYWNjdW11bGF0b3IgdXNpbmcgYW4gYXBwcm9wcmlhdGUgaXRlcmF0b3IgZnVuY3Rpb24gYmFzZWQgb24gdGhlIGFjY3VtdWxhdG9yIHR5cGUuXG4gICAgICpcbiAgICAgKiBUaGUgYWNjdW11bGF0b3IgY2FuIGJlIGFuIGFycmF5LCBzdHJpbmcsIG9iamVjdCBvciBhIHRyYW5zZm9ybWVyLiBJdGVyYXRlZCBpdGVtcyB3aWxsXG4gICAgICogYmUgYXBwZW5kZWQgdG8gYXJyYXlzIGFuZCBjb25jYXRlbmF0ZWQgdG8gc3RyaW5ncy4gT2JqZWN0cyB3aWxsIGJlIG1lcmdlZCBkaXJlY3RseSBvciAyLWl0ZW1cbiAgICAgKiBhcnJheXMgd2lsbCBiZSBtZXJnZWQgYXMga2V5LCB2YWx1ZSBwYWlycy5cbiAgICAgKlxuICAgICAqIFRoZSBhY2N1bXVsYXRvciBjYW4gYWxzbyBiZSBhIHRyYW5zZm9ybWVyIG9iamVjdCB0aGF0IHByb3ZpZGVzIGEgMi1hcml0eSByZWR1Y2luZyBpdGVyYXRvclxuICAgICAqIGZ1bmN0aW9uLCBzdGVwLCAwLWFyaXR5IGluaXRpYWwgdmFsdWUgZnVuY3Rpb24sIGluaXQsIGFuZCAxLWFyaXR5IHJlc3VsdCBleHRyYWN0aW9uIGZ1bmN0aW9uXG4gICAgICogcmVzdWx0LiBUaGUgc3RlcCBmdW5jdGlvbiBpcyB1c2VkIGFzIHRoZSBpdGVyYXRvciBmdW5jdGlvbiBpbiByZWR1Y2UuIFRoZSByZXN1bHQgZnVuY3Rpb24gaXNcbiAgICAgKiB1c2VkIHRvIGNvbnZlcnQgdGhlIGZpbmFsIGFjY3VtdWxhdG9yIGludG8gdGhlIHJldHVybiB0eXBlIGFuZCBpbiBtb3N0IGNhc2VzIGlzIFIuaWRlbnRpdHkuXG4gICAgICogVGhlIGluaXQgZnVuY3Rpb24gaXMgdXNlZCB0byBwcm92aWRlIHRoZSBpbml0aWFsIGFjY3VtdWxhdG9yLlxuICAgICAqXG4gICAgICogVGhlIGl0ZXJhdGlvbiBpcyBwZXJmb3JtZWQgd2l0aCBSLnJlZHVjZSBhZnRlciBpbml0aWFsaXppbmcgdGhlIHRyYW5zZHVjZXIuXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IExpc3RcbiAgICAgKiBAc2lnIGEgLT4gKGIgLT4gYikgLT4gW2NdIC0+IGFcbiAgICAgKiBAcGFyYW0geyp9IGFjYyBUaGUgaW5pdGlhbCBhY2N1bXVsYXRvciB2YWx1ZS5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSB4ZiBUaGUgdHJhbnNkdWNlciBmdW5jdGlvbi4gUmVjZWl2ZXMgYSB0cmFuc2Zvcm1lciBhbmQgcmV0dXJucyBhIHRyYW5zZm9ybWVyLlxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGxpc3QgVGhlIGxpc3QgdG8gaXRlcmF0ZSBvdmVyLlxuICAgICAqIEByZXR1cm4geyp9IFRoZSBmaW5hbCwgYWNjdW11bGF0ZWQgdmFsdWUuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgdmFyIG51bWJlcnMgPSBbMSwgMiwgMywgNF07XG4gICAgICogICAgICB2YXIgdHJhbnNkdWNlciA9IFIuY29tcG9zZShSLm1hcChSLmFkZCgxKSksIFIudGFrZSgyKSk7XG4gICAgICpcbiAgICAgKiAgICAgIFIuaW50byhbXSwgdHJhbnNkdWNlciwgbnVtYmVycyk7IC8vPT4gWzIsIDNdXG4gICAgICpcbiAgICAgKiAgICAgIHZhciBpbnRvQXJyYXkgPSBSLmludG8oW10pO1xuICAgICAqICAgICAgaW50b0FycmF5KHRyYW5zZHVjZXIsIG51bWJlcnMpOyAvLz0+IFsyLCAzXVxuICAgICAqL1xuICAgIHZhciBpbnRvID0gX2N1cnJ5MyhmdW5jdGlvbiBpbnRvKGFjYywgeGYsIGxpc3QpIHtcbiAgICAgICAgcmV0dXJuIF9pc1RyYW5zZm9ybWVyKGFjYykgPyBfcmVkdWNlKHhmKGFjYyksIGFjY1snQEB0cmFuc2R1Y2VyL2luaXQnXSgpLCBsaXN0KSA6IF9yZWR1Y2UoeGYoX3N0ZXBDYXQoYWNjKSksIGFjYywgbGlzdCk7XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSByZXN1bHQgb2YgYXBwbHlpbmcgYG9ialttZXRob2ROYW1lXWAgdG8gYGFyZ3NgLlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBPYmplY3RcbiAgICAgKiBAc2lnIFN0cmluZyAtPiBbKl0gLT4gT2JqZWN0IC0+ICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gbWV0aG9kTmFtZVxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGFyZ3NcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gICAgICogQHJldHVybiB7Kn1cbiAgICAgKiBAZGVwcmVjYXRlZCBzaW5jZSB2MC4xNS4wXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgLy8gIHRvQmluYXJ5IDo6IE51bWJlciAtPiBTdHJpbmdcbiAgICAgKiAgICAgIHZhciB0b0JpbmFyeSA9IFIuaW52b2tlKCd0b1N0cmluZycsIFsyXSlcbiAgICAgKlxuICAgICAqICAgICAgdG9CaW5hcnkoNDIpOyAvLz0+ICcxMDEwMTAnXG4gICAgICogICAgICB0b0JpbmFyeSg2Myk7IC8vPT4gJzExMTExMSdcbiAgICAgKi9cbiAgICB2YXIgaW52b2tlID0gY3VycnkoZnVuY3Rpb24gaW52b2tlKG1ldGhvZE5hbWUsIGFyZ3MsIG9iaikge1xuICAgICAgICByZXR1cm4gb2JqW21ldGhvZE5hbWVdLmFwcGx5KG9iaiwgYXJncyk7XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGB0cnVlYCBpZiBhbGwgZWxlbWVudHMgYXJlIHVuaXF1ZSwgaW4gYFIuZXF1YWxzYCB0ZXJtcyxcbiAgICAgKiBvdGhlcndpc2UgYGZhbHNlYC5cbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgTGlzdFxuICAgICAqIEBzaWcgW2FdIC0+IEJvb2xlYW5cbiAgICAgKiBAcGFyYW0ge0FycmF5fSBsaXN0IFRoZSBhcnJheSB0byBjb25zaWRlci5cbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufSBgdHJ1ZWAgaWYgYWxsIGVsZW1lbnRzIGFyZSB1bmlxdWUsIGVsc2UgYGZhbHNlYC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICBSLmlzU2V0KFsnMScsIDFdKTsgLy89PiB0cnVlXG4gICAgICogICAgICBSLmlzU2V0KFsxLCAxXSk7ICAgLy89PiBmYWxzZVxuICAgICAqICAgICAgUi5pc1NldChbWzQyXSwgWzQyXV0pOyAvLz0+IGZhbHNlXG4gICAgICovXG4gICAgdmFyIGlzU2V0ID0gX2N1cnJ5MShmdW5jdGlvbiBpc1NldChsaXN0KSB7XG4gICAgICAgIHZhciBpZHggPSAwO1xuICAgICAgICB3aGlsZSAoaWR4IDwgbGlzdC5sZW5ndGgpIHtcbiAgICAgICAgICAgIGlmIChfaW5kZXhPZihsaXN0LCBsaXN0W2lkeF0sIGlkeCArIDEpID49IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZHggKz0gMTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIHBvc2l0aW9uIG9mIHRoZSBsYXN0IG9jY3VycmVuY2Ugb2YgYW4gaXRlbSBpblxuICAgICAqIGFuIGFycmF5LCBvciAtMSBpZiB0aGUgaXRlbSBpcyBub3QgaW5jbHVkZWQgaW4gdGhlIGFycmF5LlxuICAgICAqIGBSLmVxdWFsc2AgaXMgdXNlZCB0byBkZXRlcm1pbmUgZXF1YWxpdHkuXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IExpc3RcbiAgICAgKiBAc2lnIGEgLT4gW2FdIC0+IE51bWJlclxuICAgICAqIEBwYXJhbSB7Kn0gdGFyZ2V0IFRoZSBpdGVtIHRvIGZpbmQuXG4gICAgICogQHBhcmFtIHtBcnJheX0geHMgVGhlIGFycmF5IHRvIHNlYXJjaCBpbi5cbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9IHRoZSBpbmRleCBvZiB0aGUgdGFyZ2V0LCBvciAtMSBpZiB0aGUgdGFyZ2V0IGlzIG5vdCBmb3VuZC5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIFIubGFzdEluZGV4T2YoMywgWy0xLDMsMywwLDEsMiwzLDRdKTsgLy89PiA2XG4gICAgICogICAgICBSLmxhc3RJbmRleE9mKDEwLCBbMSwyLDMsNF0pOyAvLz0+IC0xXG4gICAgICovXG4gICAgdmFyIGxhc3RJbmRleE9mID0gX2N1cnJ5MihmdW5jdGlvbiBsYXN0SW5kZXhPZih0YXJnZXQsIHhzKSB7XG4gICAgICAgIHJldHVybiBfaGFzTWV0aG9kKCdsYXN0SW5kZXhPZicsIHhzKSA/IHhzLmxhc3RJbmRleE9mKHRhcmdldCkgOiBfbGFzdEluZGV4T2YoeHMsIHRhcmdldCk7XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBcImxpZnRzXCIgYSBmdW5jdGlvbiB0byBiZSB0aGUgc3BlY2lmaWVkIGFyaXR5LCBzbyB0aGF0IGl0IG1heSBcIm1hcCBvdmVyXCIgdGhhdCBtYW55XG4gICAgICogbGlzdHMgKG9yIG90aGVyIEZ1bmN0b3JzKS5cbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAc2VlIFIubGlmdFxuICAgICAqIEBjYXRlZ29yeSBGdW5jdGlvblxuICAgICAqIEBzaWcgTnVtYmVyIC0+ICgqLi4uIC0+ICopIC0+IChbKl0uLi4gLT4gWypdKVxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBmdW5jdGlvbiB0byBsaWZ0IGludG8gaGlnaGVyIGNvbnRleHRcbiAgICAgKiBAcmV0dXJuIHtGdW5jdGlvbn0gVGhlIGZ1bmN0aW9uIGBmbmAgYXBwbGljYWJsZSB0byBtYXBwYWJsZSBvYmplY3RzLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIHZhciBtYWRkMyA9IFIubGlmdE4oMywgUi5jdXJyeU4oMywgZnVuY3Rpb24oKSB7XG4gICAgICogICAgICAgIHJldHVybiBSLnJlZHVjZShSLmFkZCwgMCwgYXJndW1lbnRzKTtcbiAgICAgKiAgICAgIH0pKTtcbiAgICAgKiAgICAgIG1hZGQzKFsxLDIsM10sIFsxLDIsM10sIFsxXSk7IC8vPT4gWzMsIDQsIDUsIDQsIDUsIDYsIDUsIDYsIDddXG4gICAgICovXG4gICAgdmFyIGxpZnROID0gX2N1cnJ5MihmdW5jdGlvbiBsaWZ0Tihhcml0eSwgZm4pIHtcbiAgICAgICAgdmFyIGxpZnRlZCA9IGN1cnJ5Tihhcml0eSwgZm4pO1xuICAgICAgICByZXR1cm4gY3VycnlOKGFyaXR5LCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gX3JlZHVjZShhcCwgbWFwKGxpZnRlZCwgYXJndW1lbnRzWzBdKSwgX3NsaWNlKGFyZ3VtZW50cywgMSkpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIG1lYW4gb2YgdGhlIGdpdmVuIGxpc3Qgb2YgbnVtYmVycy5cbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgTWF0aFxuICAgICAqIEBzaWcgW051bWJlcl0gLT4gTnVtYmVyXG4gICAgICogQHBhcmFtIHtBcnJheX0gbGlzdFxuICAgICAqIEByZXR1cm4ge051bWJlcn1cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICBSLm1lYW4oWzIsIDcsIDldKTsgLy89PiA2XG4gICAgICogICAgICBSLm1lYW4oW10pOyAvLz0+IE5hTlxuICAgICAqL1xuICAgIHZhciBtZWFuID0gX2N1cnJ5MShmdW5jdGlvbiBtZWFuKGxpc3QpIHtcbiAgICAgICAgcmV0dXJuIHN1bShsaXN0KSAvIGxpc3QubGVuZ3RoO1xuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgbWVkaWFuIG9mIHRoZSBnaXZlbiBsaXN0IG9mIG51bWJlcnMuXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IE1hdGhcbiAgICAgKiBAc2lnIFtOdW1iZXJdIC0+IE51bWJlclxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGxpc3RcbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9XG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgUi5tZWRpYW4oWzIsIDksIDddKTsgLy89PiA3XG4gICAgICogICAgICBSLm1lZGlhbihbNywgMiwgMTAsIDldKTsgLy89PiA4XG4gICAgICogICAgICBSLm1lZGlhbihbXSk7IC8vPT4gTmFOXG4gICAgICovXG4gICAgdmFyIG1lZGlhbiA9IF9jdXJyeTEoZnVuY3Rpb24gbWVkaWFuKGxpc3QpIHtcbiAgICAgICAgaWYgKGxpc3QubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gTmFOO1xuICAgICAgICB9XG4gICAgICAgIHZhciB3aWR0aCA9IDIgLSBsaXN0Lmxlbmd0aCAlIDI7XG4gICAgICAgIHZhciBpZHggPSAobGlzdC5sZW5ndGggLSB3aWR0aCkgLyAyO1xuICAgICAgICByZXR1cm4gbWVhbihfc2xpY2UobGlzdCkuc29ydChmdW5jdGlvbiAoYSwgYikge1xuICAgICAgICAgICAgcmV0dXJuIGEgPCBiID8gLTEgOiBhID4gYiA/IDEgOiAwO1xuICAgICAgICB9KS5zbGljZShpZHgsIGlkeCArIHdpZHRoKSk7XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBNZXJnZXMgYSBsaXN0IG9mIG9iamVjdHMgdG9nZXRoZXIgaW50byBvbmUgb2JqZWN0LlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBMaXN0XG4gICAgICogQHNpZyBbe2s6IHZ9XSAtPiB7azogdn1cbiAgICAgKiBAcGFyYW0ge0FycmF5fSBsaXN0IEFuIGFycmF5IG9mIG9iamVjdHNcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IEEgbWVyZ2VkIG9iamVjdC5cbiAgICAgKiBAc2VlIFIucmVkdWNlXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgUi5tZXJnZUFsbChbe2ZvbzoxfSx7YmFyOjJ9LHtiYXo6M31dKTsgLy89PiB7Zm9vOjEsYmFyOjIsYmF6OjN9XG4gICAgICogICAgICBSLm1lcmdlQWxsKFt7Zm9vOjF9LHtmb286Mn0se2JhcjoyfV0pOyAvLz0+IHtmb286MixiYXI6Mn1cbiAgICAgKi9cbiAgICB2YXIgbWVyZ2VBbGwgPSBfY3VycnkxKGZ1bmN0aW9uIG1lcmdlQWxsKGxpc3QpIHtcbiAgICAgICAgcmV0dXJuIHJlZHVjZShtZXJnZSwge30sIGxpc3QpO1xuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhIHBhcnRpYWwgY29weSBvZiBhbiBvYmplY3Qgb21pdHRpbmcgdGhlIGtleXMgc3BlY2lmaWVkLlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBPYmplY3RcbiAgICAgKiBAc2lnIFtTdHJpbmddIC0+IHtTdHJpbmc6ICp9IC0+IHtTdHJpbmc6ICp9XG4gICAgICogQHBhcmFtIHtBcnJheX0gbmFtZXMgYW4gYXJyYXkgb2YgU3RyaW5nIHByb3BlcnR5IG5hbWVzIHRvIG9taXQgZnJvbSB0aGUgbmV3IG9iamVjdFxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvYmogVGhlIG9iamVjdCB0byBjb3B5IGZyb21cbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IEEgbmV3IG9iamVjdCB3aXRoIHByb3BlcnRpZXMgZnJvbSBgbmFtZXNgIG5vdCBvbiBpdC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICBSLm9taXQoWydhJywgJ2QnXSwge2E6IDEsIGI6IDIsIGM6IDMsIGQ6IDR9KTsgLy89PiB7YjogMiwgYzogM31cbiAgICAgKi9cbiAgICB2YXIgb21pdCA9IF9jdXJyeTIoZnVuY3Rpb24gb21pdChuYW1lcywgb2JqKSB7XG4gICAgICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICAgICAgZm9yICh2YXIgcHJvcCBpbiBvYmopIHtcbiAgICAgICAgICAgIGlmIChfaW5kZXhPZihuYW1lcywgcHJvcCkgPCAwKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0W3Byb3BdID0gb2JqW3Byb3BdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBBY2NlcHRzIGFzIGl0cyBhcmd1bWVudHMgYSBmdW5jdGlvbiBhbmQgYW55IG51bWJlciBvZiB2YWx1ZXMgYW5kIHJldHVybnMgYSBmdW5jdGlvbiB0aGF0LFxuICAgICAqIHdoZW4gaW52b2tlZCwgY2FsbHMgdGhlIG9yaWdpbmFsIGZ1bmN0aW9uIHdpdGggYWxsIG9mIHRoZSB2YWx1ZXMgcHJlcGVuZGVkIHRvIHRoZVxuICAgICAqIG9yaWdpbmFsIGZ1bmN0aW9uJ3MgYXJndW1lbnRzIGxpc3QuIEluIHNvbWUgbGlicmFyaWVzIHRoaXMgZnVuY3Rpb24gaXMgbmFtZWQgYGFwcGx5TGVmdGAuXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IEZ1bmN0aW9uXG4gICAgICogQHNpZyAoYSAtPiBiIC0+IC4uLiAtPiBpIC0+IGogLT4gLi4uIC0+IG0gLT4gbikgLT4gYSAtPiBiLT4gLi4uIC0+IGkgLT4gKGogLT4gLi4uIC0+IG0gLT4gbilcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgZnVuY3Rpb24gdG8gaW52b2tlLlxuICAgICAqIEBwYXJhbSB7Li4uKn0gW2FyZ3NdIEFyZ3VtZW50cyB0byBwcmVwZW5kIHRvIGBmbmAgd2hlbiB0aGUgcmV0dXJuZWQgZnVuY3Rpb24gaXMgaW52b2tlZC5cbiAgICAgKiBAcmV0dXJuIHtGdW5jdGlvbn0gQSBuZXcgZnVuY3Rpb24gd3JhcHBpbmcgYGZuYC4gV2hlbiBpbnZva2VkLCBpdCB3aWxsIGNhbGwgYGZuYFxuICAgICAqICAgICAgICAgd2l0aCBgYXJnc2AgcHJlcGVuZGVkIHRvIGBmbmAncyBhcmd1bWVudHMgbGlzdC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICB2YXIgbXVsdGlwbHkgPSBmdW5jdGlvbihhLCBiKSB7IHJldHVybiBhICogYjsgfTtcbiAgICAgKiAgICAgIHZhciBkb3VibGUgPSBSLnBhcnRpYWwobXVsdGlwbHksIDIpO1xuICAgICAqICAgICAgZG91YmxlKDIpOyAvLz0+IDRcbiAgICAgKlxuICAgICAqICAgICAgdmFyIGdyZWV0ID0gZnVuY3Rpb24oc2FsdXRhdGlvbiwgdGl0bGUsIGZpcnN0TmFtZSwgbGFzdE5hbWUpIHtcbiAgICAgKiAgICAgICAgcmV0dXJuIHNhbHV0YXRpb24gKyAnLCAnICsgdGl0bGUgKyAnICcgKyBmaXJzdE5hbWUgKyAnICcgKyBsYXN0TmFtZSArICchJztcbiAgICAgKiAgICAgIH07XG4gICAgICogICAgICB2YXIgc2F5SGVsbG8gPSBSLnBhcnRpYWwoZ3JlZXQsICdIZWxsbycpO1xuICAgICAqICAgICAgdmFyIHNheUhlbGxvVG9NcyA9IFIucGFydGlhbChzYXlIZWxsbywgJ01zLicpO1xuICAgICAqICAgICAgc2F5SGVsbG9Ub01zKCdKYW5lJywgJ0pvbmVzJyk7IC8vPT4gJ0hlbGxvLCBNcy4gSmFuZSBKb25lcyEnXG4gICAgICovXG4gICAgdmFyIHBhcnRpYWwgPSBjdXJyeShfY3JlYXRlUGFydGlhbEFwcGxpY2F0b3IoX2NvbmNhdCkpO1xuXG4gICAgLyoqXG4gICAgICogQWNjZXB0cyBhcyBpdHMgYXJndW1lbnRzIGEgZnVuY3Rpb24gYW5kIGFueSBudW1iZXIgb2YgdmFsdWVzIGFuZCByZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCxcbiAgICAgKiB3aGVuIGludm9rZWQsIGNhbGxzIHRoZSBvcmlnaW5hbCBmdW5jdGlvbiB3aXRoIGFsbCBvZiB0aGUgdmFsdWVzIGFwcGVuZGVkIHRvIHRoZSBvcmlnaW5hbFxuICAgICAqIGZ1bmN0aW9uJ3MgYXJndW1lbnRzIGxpc3QuXG4gICAgICpcbiAgICAgKiBOb3RlIHRoYXQgYHBhcnRpYWxSaWdodGAgaXMgdGhlIG9wcG9zaXRlIG9mIGBwYXJ0aWFsYDogYHBhcnRpYWxSaWdodGAgZmlsbHMgYGZuYCdzIGFyZ3VtZW50c1xuICAgICAqIGZyb20gdGhlIHJpZ2h0IHRvIHRoZSBsZWZ0LiAgSW4gc29tZSBsaWJyYXJpZXMgdGhpcyBmdW5jdGlvbiBpcyBuYW1lZCBgYXBwbHlSaWdodGAuXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IEZ1bmN0aW9uXG4gICAgICogQHNpZyAoYSAtPiBiLT4gLi4uIC0+IGkgLT4gaiAtPiAuLi4gLT4gbSAtPiBuKSAtPiBqIC0+IC4uLiAtPiBtIC0+IG4gLT4gKGEgLT4gYi0+IC4uLiAtPiBpKVxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBmdW5jdGlvbiB0byBpbnZva2UuXG4gICAgICogQHBhcmFtIHsuLi4qfSBbYXJnc10gQXJndW1lbnRzIHRvIGFwcGVuZCB0byBgZm5gIHdoZW4gdGhlIHJldHVybmVkIGZ1bmN0aW9uIGlzIGludm9rZWQuXG4gICAgICogQHJldHVybiB7RnVuY3Rpb259IEEgbmV3IGZ1bmN0aW9uIHdyYXBwaW5nIGBmbmAuIFdoZW4gaW52b2tlZCwgaXQgd2lsbCBjYWxsIGBmbmAgd2l0aFxuICAgICAqICAgICAgICAgYGFyZ3NgIGFwcGVuZGVkIHRvIGBmbmAncyBhcmd1bWVudHMgbGlzdC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICB2YXIgZ3JlZXQgPSBmdW5jdGlvbihzYWx1dGF0aW9uLCB0aXRsZSwgZmlyc3ROYW1lLCBsYXN0TmFtZSkge1xuICAgICAqICAgICAgICByZXR1cm4gc2FsdXRhdGlvbiArICcsICcgKyB0aXRsZSArICcgJyArIGZpcnN0TmFtZSArICcgJyArIGxhc3ROYW1lICsgJyEnO1xuICAgICAqICAgICAgfTtcbiAgICAgKiAgICAgIHZhciBncmVldE1zSmFuZUpvbmVzID0gUi5wYXJ0aWFsUmlnaHQoZ3JlZXQsICdNcy4nLCAnSmFuZScsICdKb25lcycpO1xuICAgICAqXG4gICAgICogICAgICBncmVldE1zSmFuZUpvbmVzKCdIZWxsbycpOyAvLz0+ICdIZWxsbywgTXMuIEphbmUgSm9uZXMhJ1xuICAgICAqL1xuICAgIHZhciBwYXJ0aWFsUmlnaHQgPSBjdXJyeShfY3JlYXRlUGFydGlhbEFwcGxpY2F0b3IoZmxpcChfY29uY2F0KSkpO1xuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhIG5ldyBsaXN0IGJ5IHBsdWNraW5nIHRoZSBzYW1lIG5hbWVkIHByb3BlcnR5IG9mZiBhbGwgb2JqZWN0cyBpbiB0aGUgbGlzdCBzdXBwbGllZC5cbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgTGlzdFxuICAgICAqIEBzaWcgayAtPiBbe2s6IHZ9XSAtPiBbdl1cbiAgICAgKiBAcGFyYW0ge051bWJlcnxTdHJpbmd9IGtleSBUaGUga2V5IG5hbWUgdG8gcGx1Y2sgb2ZmIG9mIGVhY2ggb2JqZWN0LlxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGxpc3QgVGhlIGFycmF5IHRvIGNvbnNpZGVyLlxuICAgICAqIEByZXR1cm4ge0FycmF5fSBUaGUgbGlzdCBvZiB2YWx1ZXMgZm9yIHRoZSBnaXZlbiBrZXkuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgUi5wbHVjaygnYScpKFt7YTogMX0sIHthOiAyfV0pOyAvLz0+IFsxLCAyXVxuICAgICAqICAgICAgUi5wbHVjaygwKShbWzEsIDJdLCBbMywgNF1dKTsgICAvLz0+IFsxLCAzXVxuICAgICAqL1xuICAgIHZhciBwbHVjayA9IF9jdXJyeTIoX3BsdWNrKTtcblxuICAgIC8qKlxuICAgICAqIE11bHRpcGxpZXMgdG9nZXRoZXIgYWxsIHRoZSBlbGVtZW50cyBvZiBhIGxpc3QuXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IE1hdGhcbiAgICAgKiBAc2lnIFtOdW1iZXJdIC0+IE51bWJlclxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGxpc3QgQW4gYXJyYXkgb2YgbnVtYmVyc1xuICAgICAqIEByZXR1cm4ge051bWJlcn0gVGhlIHByb2R1Y3Qgb2YgYWxsIHRoZSBudW1iZXJzIGluIHRoZSBsaXN0LlxuICAgICAqIEBzZWUgUi5yZWR1Y2VcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICBSLnByb2R1Y3QoWzIsNCw2LDgsMTAwLDFdKTsgLy89PiAzODQwMFxuICAgICAqL1xuICAgIHZhciBwcm9kdWN0ID0gcmVkdWNlKF9tdWx0aXBseSwgMSk7XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhlIGdpdmVuIHZhbHVlLiBgZXZhbGAnaW5nIHRoZSBvdXRwdXRcbiAgICAgKiBzaG91bGQgcmVzdWx0IGluIGEgdmFsdWUgZXF1aXZhbGVudCB0byB0aGUgaW5wdXQgdmFsdWUuIE1hbnkgb2YgdGhlIGJ1aWx0LWluXG4gICAgICogYHRvU3RyaW5nYCBtZXRob2RzIGRvIG5vdCBzYXRpc2Z5IHRoaXMgcmVxdWlyZW1lbnQuXG4gICAgICpcbiAgICAgKiBJZiB0aGUgZ2l2ZW4gdmFsdWUgaXMgYW4gYFtvYmplY3QgT2JqZWN0XWAgd2l0aCBhIGB0b1N0cmluZ2AgbWV0aG9kIG90aGVyXG4gICAgICogdGhhbiBgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZ2AsIHRoaXMgbWV0aG9kIGlzIGludm9rZWQgd2l0aCBubyBhcmd1bWVudHNcbiAgICAgKiB0byBwcm9kdWNlIHRoZSByZXR1cm4gdmFsdWUuIFRoaXMgbWVhbnMgdXNlci1kZWZpbmVkIGNvbnN0cnVjdG9yIGZ1bmN0aW9uc1xuICAgICAqIGNhbiBwcm92aWRlIGEgc3VpdGFibGUgYHRvU3RyaW5nYCBtZXRob2QuIEZvciBleGFtcGxlOlxuICAgICAqXG4gICAgICogICAgIGZ1bmN0aW9uIFBvaW50KHgsIHkpIHtcbiAgICAgKiAgICAgICB0aGlzLnggPSB4O1xuICAgICAqICAgICAgIHRoaXMueSA9IHk7XG4gICAgICogICAgIH1cbiAgICAgKlxuICAgICAqICAgICBQb2ludC5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgICAgKiAgICAgICByZXR1cm4gJ25ldyBQb2ludCgnICsgdGhpcy54ICsgJywgJyArIHRoaXMueSArICcpJztcbiAgICAgKiAgICAgfTtcbiAgICAgKlxuICAgICAqICAgICBSLnRvU3RyaW5nKG5ldyBQb2ludCgxLCAyKSk7IC8vPT4gJ25ldyBQb2ludCgxLCAyKSdcbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgU3RyaW5nXG4gICAgICogQHNpZyAqIC0+IFN0cmluZ1xuICAgICAqIEBwYXJhbSB7Kn0gdmFsXG4gICAgICogQHJldHVybiB7U3RyaW5nfVxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIFIudG9TdHJpbmcoNDIpOyAvLz0+ICc0MidcbiAgICAgKiAgICAgIFIudG9TdHJpbmcoJ2FiYycpOyAvLz0+ICdcImFiY1wiJ1xuICAgICAqICAgICAgUi50b1N0cmluZyhbMSwgMiwgM10pOyAvLz0+ICdbMSwgMiwgM10nXG4gICAgICogICAgICBSLnRvU3RyaW5nKHtmb286IDEsIGJhcjogMiwgYmF6OiAzfSk7IC8vPT4gJ3tcImJhclwiOiAyLCBcImJhelwiOiAzLCBcImZvb1wiOiAxfSdcbiAgICAgKiAgICAgIFIudG9TdHJpbmcobmV3IERhdGUoJzIwMDEtMDItMDNUMDQ6MDU6MDZaJykpOyAvLz0+ICduZXcgRGF0ZShcIjIwMDEtMDItMDNUMDQ6MDU6MDYuMDAwWlwiKSdcbiAgICAgKi9cbiAgICB2YXIgdG9TdHJpbmcgPSBfY3VycnkxKGZ1bmN0aW9uIHRvU3RyaW5nKHZhbCkge1xuICAgICAgICByZXR1cm4gX3RvU3RyaW5nKHZhbCwgW10pO1xuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogQWNjZXB0cyBhIGZ1bmN0aW9uIGBmbmAgYW5kIGFueSBudW1iZXIgb2YgdHJhbnNmb3JtZXIgZnVuY3Rpb25zIGFuZCByZXR1cm5zIGEgbmV3XG4gICAgICogZnVuY3Rpb24uIFdoZW4gdGhlIG5ldyBmdW5jdGlvbiBpcyBpbnZva2VkLCBpdCBjYWxscyB0aGUgZnVuY3Rpb24gYGZuYCB3aXRoIHBhcmFtZXRlcnNcbiAgICAgKiBjb25zaXN0aW5nIG9mIHRoZSByZXN1bHQgb2YgY2FsbGluZyBlYWNoIHN1cHBsaWVkIGhhbmRsZXIgb24gc3VjY2Vzc2l2ZSBhcmd1bWVudHMgdG8gdGhlXG4gICAgICogbmV3IGZ1bmN0aW9uLlxuICAgICAqXG4gICAgICogSWYgbW9yZSBhcmd1bWVudHMgYXJlIHBhc3NlZCB0byB0aGUgcmV0dXJuZWQgZnVuY3Rpb24gdGhhbiB0cmFuc2Zvcm1lciBmdW5jdGlvbnMsIHRob3NlXG4gICAgICogYXJndW1lbnRzIGFyZSBwYXNzZWQgZGlyZWN0bHkgdG8gYGZuYCBhcyBhZGRpdGlvbmFsIHBhcmFtZXRlcnMuIElmIHlvdSBleHBlY3QgYWRkaXRpb25hbFxuICAgICAqIGFyZ3VtZW50cyB0aGF0IGRvbid0IG5lZWQgdG8gYmUgdHJhbnNmb3JtZWQsIGFsdGhvdWdoIHlvdSBjYW4gaWdub3JlIHRoZW0sIGl0J3MgYmVzdCB0b1xuICAgICAqIHBhc3MgYW4gaWRlbnRpdHkgZnVuY3Rpb24gc28gdGhhdCB0aGUgbmV3IGZ1bmN0aW9uIHJlcG9ydHMgdGhlIGNvcnJlY3QgYXJpdHkuXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IEZ1bmN0aW9uXG4gICAgICogQHNpZyAoeDEgLT4geDIgLT4gLi4uIC0+IHopIC0+ICgoYSAtPiB4MSksIChiIC0+IHgyKSwgLi4uKSAtPiAoYSAtPiBiIC0+IC4uLiAtPiB6KVxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBmdW5jdGlvbiB0byB3cmFwLlxuICAgICAqIEBwYXJhbSB7Li4uRnVuY3Rpb259IHRyYW5zZm9ybWVycyBBIHZhcmlhYmxlIG51bWJlciBvZiB0cmFuc2Zvcm1lciBmdW5jdGlvbnNcbiAgICAgKiBAcmV0dXJuIHtGdW5jdGlvbn0gVGhlIHdyYXBwZWQgZnVuY3Rpb24uXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgLy8gRXhhbXBsZSAxOlxuICAgICAqXG4gICAgICogICAgICAvLyBOdW1iZXIgLT4gW1BlcnNvbl0gLT4gW1BlcnNvbl1cbiAgICAgKiAgICAgIHZhciBieUFnZSA9IFIudXNlV2l0aChSLmZpbHRlciwgUi5wcm9wRXEoJ2FnZScpLCBSLmlkZW50aXR5KTtcbiAgICAgKlxuICAgICAqICAgICAgdmFyIGtpZHMgPSBbXG4gICAgICogICAgICAgIHtuYW1lOiAnQWJiaWUnLCBhZ2U6IDZ9LFxuICAgICAqICAgICAgICB7bmFtZTogJ0JyaWFuJywgYWdlOiA1fSxcbiAgICAgKiAgICAgICAge25hbWU6ICdDaHJpcycsIGFnZTogNn0sXG4gICAgICogICAgICAgIHtuYW1lOiAnRGF2aWQnLCBhZ2U6IDR9LFxuICAgICAqICAgICAgICB7bmFtZTogJ0VsbGllJywgYWdlOiA1fVxuICAgICAqICAgICAgXTtcbiAgICAgKlxuICAgICAqICAgICAgYnlBZ2UoNSwga2lkcyk7IC8vPT4gW3tuYW1lOiAnQnJpYW4nLCBhZ2U6IDV9LCB7bmFtZTogJ0VsbGllJywgYWdlOiA1fV1cbiAgICAgKlxuICAgICAqICAgICAgLy8gRXhhbXBsZSAyOlxuICAgICAqXG4gICAgICogICAgICB2YXIgZG91YmxlID0gZnVuY3Rpb24oeSkgeyByZXR1cm4geSAqIDI7IH07XG4gICAgICogICAgICB2YXIgc3F1YXJlID0gZnVuY3Rpb24oeCkgeyByZXR1cm4geCAqIHg7IH07XG4gICAgICogICAgICB2YXIgYWRkID0gZnVuY3Rpb24oYSwgYikgeyByZXR1cm4gYSArIGI7IH07XG4gICAgICogICAgICAvLyBBZGRzIGFueSBudW1iZXIgb2YgYXJndW1lbnRzIHRvZ2V0aGVyXG4gICAgICogICAgICB2YXIgYWRkQWxsID0gZnVuY3Rpb24oKSB7XG4gICAgICogICAgICAgIHJldHVybiBSLnJlZHVjZShhZGQsIDAsIGFyZ3VtZW50cyk7XG4gICAgICogICAgICB9O1xuICAgICAqXG4gICAgICogICAgICAvLyBCYXNpYyBleGFtcGxlXG4gICAgICogICAgICB2YXIgYWRkRG91YmxlQW5kU3F1YXJlID0gUi51c2VXaXRoKGFkZEFsbCwgZG91YmxlLCBzcXVhcmUpO1xuICAgICAqXG4gICAgICogICAgICAvL+KJhSBhZGRBbGwoZG91YmxlKDEwKSwgc3F1YXJlKDUpKTtcbiAgICAgKiAgICAgIGFkZERvdWJsZUFuZFNxdWFyZSgxMCwgNSk7IC8vPT4gNDVcbiAgICAgKlxuICAgICAqICAgICAgLy8gRXhhbXBsZSBvZiBwYXNzaW5nIG1vcmUgYXJndW1lbnRzIHRoYW4gdHJhbnNmb3JtZXJzXG4gICAgICogICAgICAvL+KJhSBhZGRBbGwoZG91YmxlKDEwKSwgc3F1YXJlKDUpLCAxMDApO1xuICAgICAqICAgICAgYWRkRG91YmxlQW5kU3F1YXJlKDEwLCA1LCAxMDApOyAvLz0+IDE0NVxuICAgICAqXG4gICAgICogICAgICAvLyBJZiB0aGVyZSBhcmUgZXh0cmEgX2V4cGVjdGVkXyBhcmd1bWVudHMgdGhhdCBkb24ndCBuZWVkIHRvIGJlIHRyYW5zZm9ybWVkLCBhbHRob3VnaFxuICAgICAqICAgICAgLy8geW91IGNhbiBpZ25vcmUgdGhlbSwgaXQgbWlnaHQgYmUgYmVzdCB0byBwYXNzIGluIHRoZSBpZGVudGl0eSBmdW5jdGlvbiBzbyB0aGF0IHRoZSBuZXdcbiAgICAgKiAgICAgIC8vIGZ1bmN0aW9uIGNvcnJlY3RseSByZXBvcnRzIGFyaXR5LlxuICAgICAqICAgICAgdmFyIGFkZERvdWJsZUFuZFNxdWFyZVdpdGhFeHRyYVBhcmFtcyA9IFIudXNlV2l0aChhZGRBbGwsIGRvdWJsZSwgc3F1YXJlLCBSLmlkZW50aXR5KTtcbiAgICAgKiAgICAgIC8vIGFkZERvdWJsZUFuZFNxdWFyZVdpdGhFeHRyYVBhcmFtcy5sZW5ndGggLy89PiAzXG4gICAgICogICAgICAvL+KJhSBhZGRBbGwoZG91YmxlKDEwKSwgc3F1YXJlKDUpLCBSLmlkZW50aXR5KDEwMCkpO1xuICAgICAqICAgICAgYWRkRG91YmxlQW5kU3F1YXJlKDEwLCA1LCAxMDApOyAvLz0+IDE0NVxuICAgICAqL1xuICAgIC8qLCB0cmFuc2Zvcm1lcnMgKi9cbiAgICB2YXIgdXNlV2l0aCA9IGN1cnJ5KGZ1bmN0aW9uIHVzZVdpdGgoZm4pIHtcbiAgICAgICAgdmFyIHRyYW5zZm9ybWVycyA9IF9zbGljZShhcmd1bWVudHMsIDEpO1xuICAgICAgICByZXR1cm4gY3VycnkoYXJpdHkodHJhbnNmb3JtZXJzLmxlbmd0aCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGFyZ3MgPSBbXSwgaWR4ID0gMDtcbiAgICAgICAgICAgIHdoaWxlIChpZHggPCB0cmFuc2Zvcm1lcnMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgYXJnc1tpZHhdID0gdHJhbnNmb3JtZXJzW2lkeF0oYXJndW1lbnRzW2lkeF0pO1xuICAgICAgICAgICAgICAgIGlkeCArPSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGZuLmFwcGx5KHRoaXMsIGFyZ3MuY29uY2F0KF9zbGljZShhcmd1bWVudHMsIHRyYW5zZm9ybWVycy5sZW5ndGgpKSk7XG4gICAgICAgIH0pKTtcbiAgICB9KTtcblxuICAgIHZhciBfY29udGFpbnMgPSBmdW5jdGlvbiBfY29udGFpbnMoYSwgbGlzdCkge1xuICAgICAgICByZXR1cm4gX2luZGV4T2YobGlzdCwgYSkgPj0gMDtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogR2l2ZW4gYSBsaXN0IG9mIHByZWRpY2F0ZXMsIHJldHVybnMgYSBuZXcgcHJlZGljYXRlIHRoYXQgd2lsbCBiZSB0cnVlIGV4YWN0bHkgd2hlbiBhbGwgb2YgdGhlbSBhcmUuXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IExvZ2ljXG4gICAgICogQHNpZyBbKCouLi4gLT4gQm9vbGVhbildIC0+ICgqLi4uIC0+IEJvb2xlYW4pXG4gICAgICogQHBhcmFtIHtBcnJheX0gbGlzdCBBbiBhcnJheSBvZiBwcmVkaWNhdGUgZnVuY3Rpb25zXG4gICAgICogQHBhcmFtIHsqfSBvcHRpb25hbCBBbnkgYXJndW1lbnRzIHRvIHBhc3MgaW50byB0aGUgcHJlZGljYXRlc1xuICAgICAqIEByZXR1cm4ge0Z1bmN0aW9ufSBhIGZ1bmN0aW9uIHRoYXQgYXBwbGllcyBpdHMgYXJndW1lbnRzIHRvIGVhY2ggb2ZcbiAgICAgKiAgICAgICAgIHRoZSBwcmVkaWNhdGVzLCByZXR1cm5pbmcgYHRydWVgIGlmIGFsbCBhcmUgc2F0aXNmaWVkLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIHZhciBndDEwID0gZnVuY3Rpb24oeCkgeyByZXR1cm4geCA+IDEwOyB9O1xuICAgICAqICAgICAgdmFyIGV2ZW4gPSBmdW5jdGlvbih4KSB7IHJldHVybiB4ICUgMiA9PT0gMH07XG4gICAgICogICAgICB2YXIgZiA9IFIuYWxsUGFzcyhbZ3QxMCwgZXZlbl0pO1xuICAgICAqICAgICAgZigxMSk7IC8vPT4gZmFsc2VcbiAgICAgKiAgICAgIGYoMTIpOyAvLz0+IHRydWVcbiAgICAgKi9cbiAgICB2YXIgYWxsUGFzcyA9IGN1cnJ5KF9wcmVkaWNhdGVXcmFwKF9hbGwpKTtcblxuICAgIC8qKlxuICAgICAqIEdpdmVuIGEgbGlzdCBvZiBwcmVkaWNhdGVzIHJldHVybnMgYSBuZXcgcHJlZGljYXRlIHRoYXQgd2lsbCBiZSB0cnVlIGV4YWN0bHkgd2hlbiBhbnkgb25lIG9mIHRoZW0gaXMuXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IExvZ2ljXG4gICAgICogQHNpZyBbKCouLi4gLT4gQm9vbGVhbildIC0+ICgqLi4uIC0+IEJvb2xlYW4pXG4gICAgICogQHBhcmFtIHtBcnJheX0gbGlzdCBBbiBhcnJheSBvZiBwcmVkaWNhdGUgZnVuY3Rpb25zXG4gICAgICogQHBhcmFtIHsqfSBvcHRpb25hbCBBbnkgYXJndW1lbnRzIHRvIHBhc3MgaW50byB0aGUgcHJlZGljYXRlc1xuICAgICAqIEByZXR1cm4ge0Z1bmN0aW9ufSBBIGZ1bmN0aW9uIHRoYXQgYXBwbGllcyBpdHMgYXJndW1lbnRzIHRvIGVhY2ggb2YgdGhlIHByZWRpY2F0ZXMsIHJldHVybmluZ1xuICAgICAqICAgICAgICAgYHRydWVgIGlmIGFsbCBhcmUgc2F0aXNmaWVkLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIHZhciBndDEwID0gZnVuY3Rpb24oeCkgeyByZXR1cm4geCA+IDEwOyB9O1xuICAgICAqICAgICAgdmFyIGV2ZW4gPSBmdW5jdGlvbih4KSB7IHJldHVybiB4ICUgMiA9PT0gMH07XG4gICAgICogICAgICB2YXIgZiA9IFIuYW55UGFzcyhbZ3QxMCwgZXZlbl0pO1xuICAgICAqICAgICAgZigxMSk7IC8vPT4gdHJ1ZVxuICAgICAqICAgICAgZig4KTsgLy89PiB0cnVlXG4gICAgICogICAgICBmKDkpOyAvLz0+IGZhbHNlXG4gICAgICovXG4gICAgdmFyIGFueVBhc3MgPSBjdXJyeShfcHJlZGljYXRlV3JhcChfYW55KSk7XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSByZXN1bHQgb2YgY2FsbGluZyBpdHMgZmlyc3QgYXJndW1lbnQgd2l0aCB0aGUgcmVtYWluaW5nXG4gICAgICogYXJndW1lbnRzLiBUaGlzIGlzIG9jY2FzaW9uYWxseSB1c2VmdWwgYXMgYSBjb252ZXJnaW5nIGZ1bmN0aW9uIGZvclxuICAgICAqIGBSLmNvbnZlcmdlYDogdGhlIGxlZnQgYnJhbmNoIGNhbiBwcm9kdWNlIGEgZnVuY3Rpb24gd2hpbGUgdGhlIHJpZ2h0XG4gICAgICogYnJhbmNoIHByb2R1Y2VzIGEgdmFsdWUgdG8gYmUgcGFzc2VkIHRvIHRoYXQgZnVuY3Rpb24gYXMgYW4gYXJndW1lbnQuXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IEZ1bmN0aW9uXG4gICAgICogQHNpZyAoKi4uLiAtPiBhKSwqLi4uIC0+IGFcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgZnVuY3Rpb24gdG8gYXBwbHkgdG8gdGhlIHJlbWFpbmluZyBhcmd1bWVudHMuXG4gICAgICogQHBhcmFtIHsuLi4qfSBhcmdzIEFueSBudW1iZXIgb2YgcG9zaXRpb25hbCBhcmd1bWVudHMuXG4gICAgICogQHJldHVybiB7Kn1cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICB2YXIgaW5kZW50TiA9IFIucGlwZShSLnRpbWVzKFIuYWx3YXlzKCcgJykpLFxuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgUi5qb2luKCcnKSxcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgIFIucmVwbGFjZSgvXig/ISQpL2dtKSk7XG4gICAgICpcbiAgICAgKiAgICAgIHZhciBmb3JtYXQgPSBSLmNvbnZlcmdlKFIuY2FsbCxcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFIucGlwZShSLnByb3AoJ2luZGVudCcpLCBpbmRlbnROKSxcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFIucHJvcCgndmFsdWUnKSk7XG4gICAgICpcbiAgICAgKiAgICAgIGZvcm1hdCh7aW5kZW50OiAyLCB2YWx1ZTogJ2Zvb1xcbmJhclxcbmJhelxcbid9KTsgLy89PiAnICBmb29cXG4gIGJhclxcbiAgYmF6XFxuJ1xuICAgICAqL1xuICAgIHZhciBjYWxsID0gY3VycnkoZnVuY3Rpb24gY2FsbChmbikge1xuICAgICAgICByZXR1cm4gZm4uYXBwbHkodGhpcywgX3NsaWNlKGFyZ3VtZW50cywgMSkpO1xuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogVHVybnMgYSBsaXN0IG9mIEZ1bmN0b3JzIGludG8gYSBGdW5jdG9yIG9mIGEgbGlzdC5cbiAgICAgKlxuICAgICAqIE5vdGU6IGBjb21tdXRlYCBtYXkgYmUgbW9yZSB1c2VmdWwgdG8gY29udmVydCBhIGxpc3Qgb2Ygbm9uLUFycmF5IEZ1bmN0b3JzIChlLmcuXG4gICAgICogTWF5YmUsIEVpdGhlciwgZXRjLikgdG8gRnVuY3RvciBvZiBhIGxpc3QuXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IExpc3RcbiAgICAgKiBAc2VlIFIuY29tbXV0ZU1hcFxuICAgICAqIEBzaWcgKHggLT4gW3hdKSAtPiBbWypdLi4uXVxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IG9mIEEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIHRoZSBkYXRhIHR5cGUgdG8gcmV0dXJuXG4gICAgICogQHBhcmFtIHtBcnJheX0gbGlzdCBBbiBBcnJheSAob3Igb3RoZXIgRnVuY3Rvcikgb2YgQXJyYXlzIChvciBvdGhlciBGdW5jdG9ycylcbiAgICAgKiBAcmV0dXJuIHtBcnJheX1cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICB2YXIgYXMgPSBbWzFdLCBbMywgNF1dO1xuICAgICAqICAgICAgUi5jb21tdXRlKFIub2YsIGFzKTsgLy89PiBbWzEsIDNdLCBbMSwgNF1dXG4gICAgICpcbiAgICAgKiAgICAgIHZhciBicyA9IFtbMSwgMl0sIFszXV07XG4gICAgICogICAgICBSLmNvbW11dGUoUi5vZiwgYnMpOyAvLz0+IFtbMSwgM10sIFsyLCAzXV1cbiAgICAgKlxuICAgICAqICAgICAgdmFyIGNzID0gW1sxLCAyXSwgWzMsIDRdXTtcbiAgICAgKiAgICAgIFIuY29tbXV0ZShSLm9mLCBjcyk7IC8vPT4gW1sxLCAzXSwgWzIsIDNdLCBbMSwgNF0sIFsyLCA0XV1cbiAgICAgKi9cbiAgICB2YXIgY29tbXV0ZSA9IGNvbW11dGVNYXAobWFwKGlkZW50aXR5KSk7XG5cbiAgICAvKipcbiAgICAgKiBXcmFwcyBhIGNvbnN0cnVjdG9yIGZ1bmN0aW9uIGluc2lkZSBhIGN1cnJpZWQgZnVuY3Rpb24gdGhhdCBjYW4gYmUgY2FsbGVkIHdpdGggdGhlIHNhbWVcbiAgICAgKiBhcmd1bWVudHMgYW5kIHJldHVybnMgdGhlIHNhbWUgdHlwZS4gVGhlIGFyaXR5IG9mIHRoZSBmdW5jdGlvbiByZXR1cm5lZCBpcyBzcGVjaWZpZWRcbiAgICAgKiB0byBhbGxvdyB1c2luZyB2YXJpYWRpYyBjb25zdHJ1Y3RvciBmdW5jdGlvbnMuXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IEZ1bmN0aW9uXG4gICAgICogQHNpZyBOdW1iZXIgLT4gKCogLT4geyp9KSAtPiAoKiAtPiB7Kn0pXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IG4gVGhlIGFyaXR5IG9mIHRoZSBjb25zdHJ1Y3RvciBmdW5jdGlvbi5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBGbiBUaGUgY29uc3RydWN0b3IgZnVuY3Rpb24gdG8gd3JhcC5cbiAgICAgKiBAcmV0dXJuIHtGdW5jdGlvbn0gQSB3cmFwcGVkLCBjdXJyaWVkIGNvbnN0cnVjdG9yIGZ1bmN0aW9uLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIC8vIFZhcmlhZGljIGNvbnN0cnVjdG9yIGZ1bmN0aW9uXG4gICAgICogICAgICB2YXIgV2lkZ2V0ID0gZnVuY3Rpb24oKSB7XG4gICAgICogICAgICAgIHRoaXMuY2hpbGRyZW4gPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuICAgICAqICAgICAgICAvLyAuLi5cbiAgICAgKiAgICAgIH07XG4gICAgICogICAgICBXaWRnZXQucHJvdG90eXBlID0ge1xuICAgICAqICAgICAgICAvLyAuLi5cbiAgICAgKiAgICAgIH07XG4gICAgICogICAgICB2YXIgYWxsQ29uZmlncyA9IFtcbiAgICAgKiAgICAgICAgLy8gLi4uXG4gICAgICogICAgICBdO1xuICAgICAqICAgICAgUi5tYXAoUi5jb25zdHJ1Y3ROKDEsIFdpZGdldCksIGFsbENvbmZpZ3MpOyAvLyBhIGxpc3Qgb2YgV2lkZ2V0c1xuICAgICAqL1xuICAgIHZhciBjb25zdHJ1Y3ROID0gX2N1cnJ5MihmdW5jdGlvbiBjb25zdHJ1Y3ROKG4sIEZuKSB7XG4gICAgICAgIGlmIChuID4gMTApIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQ29uc3RydWN0b3Igd2l0aCBncmVhdGVyIHRoYW4gdGVuIGFyZ3VtZW50cycpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChuID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgRm4oKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGN1cnJ5KG5BcnkobiwgZnVuY3Rpb24gKCQwLCAkMSwgJDIsICQzLCAkNCwgJDUsICQ2LCAkNywgJDgsICQ5KSB7XG4gICAgICAgICAgICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IEZuKCQwKTtcbiAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IEZuKCQwLCAkMSk7XG4gICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBGbigkMCwgJDEsICQyKTtcbiAgICAgICAgICAgIGNhc2UgNDpcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IEZuKCQwLCAkMSwgJDIsICQzKTtcbiAgICAgICAgICAgIGNhc2UgNTpcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IEZuKCQwLCAkMSwgJDIsICQzLCAkNCk7XG4gICAgICAgICAgICBjYXNlIDY6XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBGbigkMCwgJDEsICQyLCAkMywgJDQsICQ1KTtcbiAgICAgICAgICAgIGNhc2UgNzpcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IEZuKCQwLCAkMSwgJDIsICQzLCAkNCwgJDUsICQ2KTtcbiAgICAgICAgICAgIGNhc2UgODpcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IEZuKCQwLCAkMSwgJDIsICQzLCAkNCwgJDUsICQ2LCAkNyk7XG4gICAgICAgICAgICBjYXNlIDk6XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBGbigkMCwgJDEsICQyLCAkMywgJDQsICQ1LCAkNiwgJDcsICQ4KTtcbiAgICAgICAgICAgIGNhc2UgMTA6XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBGbigkMCwgJDEsICQyLCAkMywgJDQsICQ1LCAkNiwgJDcsICQ4LCAkOSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pKTtcbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYHRydWVgIGlmIHRoZSBzcGVjaWZpZWQgdmFsdWUgaXMgZXF1YWwsIGluIGBSLmVxdWFsc2AgdGVybXMsXG4gICAgICogdG8gYXQgbGVhc3Qgb25lIGVsZW1lbnQgb2YgdGhlIGdpdmVuIGxpc3Q7IGBmYWxzZWAgb3RoZXJ3aXNlLlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBMaXN0XG4gICAgICogQHNpZyBhIC0+IFthXSAtPiBCb29sZWFuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGEgVGhlIGl0ZW0gdG8gY29tcGFyZSBhZ2FpbnN0LlxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGxpc3QgVGhlIGFycmF5IHRvIGNvbnNpZGVyLlxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59IGB0cnVlYCBpZiB0aGUgaXRlbSBpcyBpbiB0aGUgbGlzdCwgYGZhbHNlYCBvdGhlcndpc2UuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICBSLmNvbnRhaW5zKDMsIFsxLCAyLCAzXSk7IC8vPT4gdHJ1ZVxuICAgICAqICAgICAgUi5jb250YWlucyg0LCBbMSwgMiwgM10pOyAvLz0+IGZhbHNlXG4gICAgICogICAgICBSLmNvbnRhaW5zKFs0Ml0sIFtbNDJdXSk7IC8vPT4gdHJ1ZVxuICAgICAqL1xuICAgIHZhciBjb250YWlucyA9IF9jdXJyeTIoX2NvbnRhaW5zKTtcblxuICAgIC8qKlxuICAgICAqIEFjY2VwdHMgYXQgbGVhc3QgdGhyZWUgZnVuY3Rpb25zIGFuZCByZXR1cm5zIGEgbmV3IGZ1bmN0aW9uLiBXaGVuIGludm9rZWQsIHRoaXMgbmV3XG4gICAgICogZnVuY3Rpb24gd2lsbCBpbnZva2UgdGhlIGZpcnN0IGZ1bmN0aW9uLCBgYWZ0ZXJgLCBwYXNzaW5nIGFzIGl0cyBhcmd1bWVudHMgdGhlXG4gICAgICogcmVzdWx0cyBvZiBpbnZva2luZyB0aGUgc3Vic2VxdWVudCBmdW5jdGlvbnMgd2l0aCB3aGF0ZXZlciBhcmd1bWVudHMgYXJlIHBhc3NlZCB0b1xuICAgICAqIHRoZSBuZXcgZnVuY3Rpb24uXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IEZ1bmN0aW9uXG4gICAgICogQHNpZyAoeDEgLT4geDIgLT4gLi4uIC0+IHopIC0+ICgoYSAtPiBiIC0+IC4uLiAtPiB4MSksIChhIC0+IGIgLT4gLi4uIC0+IHgyKSwgLi4uKSAtPiAoYSAtPiBiIC0+IC4uLiAtPiB6KVxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGFmdGVyIEEgZnVuY3Rpb24uIGBhZnRlcmAgd2lsbCBiZSBpbnZva2VkIHdpdGggdGhlIHJldHVybiB2YWx1ZXMgb2ZcbiAgICAgKiAgICAgICAgYGZuMWAgYW5kIGBmbjJgIGFzIGl0cyBhcmd1bWVudHMuXG4gICAgICogQHBhcmFtIHsuLi5GdW5jdGlvbn0gZnVuY3Rpb25zIEEgdmFyaWFibGUgbnVtYmVyIG9mIGZ1bmN0aW9ucy5cbiAgICAgKiBAcmV0dXJuIHtGdW5jdGlvbn0gQSBuZXcgZnVuY3Rpb24uXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgdmFyIGFkZCA9IGZ1bmN0aW9uKGEsIGIpIHsgcmV0dXJuIGEgKyBiOyB9O1xuICAgICAqICAgICAgdmFyIG11bHRpcGx5ID0gZnVuY3Rpb24oYSwgYikgeyByZXR1cm4gYSAqIGI7IH07XG4gICAgICogICAgICB2YXIgc3VidHJhY3QgPSBmdW5jdGlvbihhLCBiKSB7IHJldHVybiBhIC0gYjsgfTtcbiAgICAgKlxuICAgICAqICAgICAgLy/iiYUgbXVsdGlwbHkoIGFkZCgxLCAyKSwgc3VidHJhY3QoMSwgMikgKTtcbiAgICAgKiAgICAgIFIuY29udmVyZ2UobXVsdGlwbHksIGFkZCwgc3VidHJhY3QpKDEsIDIpOyAvLz0+IC0zXG4gICAgICpcbiAgICAgKiAgICAgIHZhciBhZGQzID0gZnVuY3Rpb24oYSwgYiwgYykgeyByZXR1cm4gYSArIGIgKyBjOyB9O1xuICAgICAqICAgICAgUi5jb252ZXJnZShhZGQzLCBtdWx0aXBseSwgYWRkLCBzdWJ0cmFjdCkoMSwgMik7IC8vPT4gNFxuICAgICAqL1xuICAgIHZhciBjb252ZXJnZSA9IGN1cnJ5TigzLCBmdW5jdGlvbiAoYWZ0ZXIpIHtcbiAgICAgICAgdmFyIGZucyA9IF9zbGljZShhcmd1bWVudHMsIDEpO1xuICAgICAgICByZXR1cm4gY3VycnlOKG1heChwbHVjaygnbGVuZ3RoJywgZm5zKSksIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBhcmdzID0gYXJndW1lbnRzO1xuICAgICAgICAgICAgdmFyIGNvbnRleHQgPSB0aGlzO1xuICAgICAgICAgICAgcmV0dXJuIGFmdGVyLmFwcGx5KGNvbnRleHQsIF9tYXAoZnVuY3Rpb24gKGZuKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZuLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICAgICAgICAgICAgfSwgZm5zKSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogRmluZHMgdGhlIHNldCAoaS5lLiBubyBkdXBsaWNhdGVzKSBvZiBhbGwgZWxlbWVudHMgaW4gdGhlIGZpcnN0IGxpc3Qgbm90IGNvbnRhaW5lZCBpbiB0aGUgc2Vjb25kIGxpc3QuXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IFJlbGF0aW9uXG4gICAgICogQHNpZyBbYV0gLT4gW2FdIC0+IFthXVxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGxpc3QxIFRoZSBmaXJzdCBsaXN0LlxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGxpc3QyIFRoZSBzZWNvbmQgbGlzdC5cbiAgICAgKiBAcmV0dXJuIHtBcnJheX0gVGhlIGVsZW1lbnRzIGluIGBsaXN0MWAgdGhhdCBhcmUgbm90IGluIGBsaXN0MmAuXG4gICAgICogQHNlZSBSLmRpZmZlcmVuY2VXaXRoXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgUi5kaWZmZXJlbmNlKFsxLDIsMyw0XSwgWzcsNiw1LDQsM10pOyAvLz0+IFsxLDJdXG4gICAgICogICAgICBSLmRpZmZlcmVuY2UoWzcsNiw1LDQsM10sIFsxLDIsMyw0XSk7IC8vPT4gWzcsNiw1XVxuICAgICAqL1xuICAgIHZhciBkaWZmZXJlbmNlID0gX2N1cnJ5MihmdW5jdGlvbiBkaWZmZXJlbmNlKGZpcnN0LCBzZWNvbmQpIHtcbiAgICAgICAgdmFyIG91dCA9IFtdO1xuICAgICAgICB2YXIgaWR4ID0gMDtcbiAgICAgICAgd2hpbGUgKGlkeCA8IGZpcnN0Lmxlbmd0aCkge1xuICAgICAgICAgICAgaWYgKCFfY29udGFpbnMoZmlyc3RbaWR4XSwgc2Vjb25kKSAmJiAhX2NvbnRhaW5zKGZpcnN0W2lkeF0sIG91dCkpIHtcbiAgICAgICAgICAgICAgICBvdXRbb3V0Lmxlbmd0aF0gPSBmaXJzdFtpZHhdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWR4ICs9IDE7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYSBuZXcgbGlzdCB3aXRob3V0IGFueSBjb25zZWN1dGl2ZWx5IHJlcGVhdGluZyBlbGVtZW50cy5cbiAgICAgKiBgUi5lcXVhbHNgIGlzIHVzZWQgdG8gZGV0ZXJtaW5lIGVxdWFsaXR5LlxuICAgICAqXG4gICAgICogQWN0cyBhcyBhIHRyYW5zZHVjZXIgaWYgYSB0cmFuc2Zvcm1lciBpcyBnaXZlbiBpbiBsaXN0IHBvc2l0aW9uLlxuICAgICAqIEBzZWUgUi50cmFuc2R1Y2VcbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgTGlzdFxuICAgICAqIEBzaWcgW2FdIC0+IFthXVxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGxpc3QgVGhlIGFycmF5IHRvIGNvbnNpZGVyLlxuICAgICAqIEByZXR1cm4ge0FycmF5fSBgbGlzdGAgd2l0aG91dCByZXBlYXRpbmcgZWxlbWVudHMuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICBSLmRyb3BSZXBlYXRzKFsxLCAxLCAxLCAyLCAzLCA0LCA0LCAyLCAyXSk7IC8vPT4gWzEsIDIsIDMsIDQsIDJdXG4gICAgICovXG4gICAgdmFyIGRyb3BSZXBlYXRzID0gX2N1cnJ5MShfZGlzcGF0Y2hhYmxlKCdkcm9wUmVwZWF0cycsIF94ZHJvcFJlcGVhdHNXaXRoKGVxdWFscyksIGRyb3BSZXBlYXRzV2l0aChlcXVhbHMpKSk7XG5cbiAgICAvKipcbiAgICAgKiBcImxpZnRzXCIgYSBmdW5jdGlvbiBvZiBhcml0eSA+IDEgc28gdGhhdCBpdCBtYXkgXCJtYXAgb3ZlclwiIGFuIEFycmF5IG9yXG4gICAgICogb3RoZXIgRnVuY3Rvci5cbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAc2VlIFIubGlmdE5cbiAgICAgKiBAY2F0ZWdvcnkgRnVuY3Rpb25cbiAgICAgKiBAc2lnICgqLi4uIC0+ICopIC0+IChbKl0uLi4gLT4gWypdKVxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBmdW5jdGlvbiB0byBsaWZ0IGludG8gaGlnaGVyIGNvbnRleHRcbiAgICAgKiBAcmV0dXJuIHtGdW5jdGlvbn0gVGhlIGZ1bmN0aW9uIGBmbmAgYXBwbGljYWJsZSB0byBtYXBwYWJsZSBvYmplY3RzLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIHZhciBtYWRkMyA9IFIubGlmdChSLmN1cnJ5KGZ1bmN0aW9uKGEsIGIsIGMpIHtcbiAgICAgKiAgICAgICAgcmV0dXJuIGEgKyBiICsgYztcbiAgICAgKiAgICAgIH0pKTtcbiAgICAgKiAgICAgIG1hZGQzKFsxLDIsM10sIFsxLDIsM10sIFsxXSk7IC8vPT4gWzMsIDQsIDUsIDQsIDUsIDYsIDUsIDYsIDddXG4gICAgICpcbiAgICAgKiAgICAgIHZhciBtYWRkNSA9IFIubGlmdChSLmN1cnJ5KGZ1bmN0aW9uKGEsIGIsIGMsIGQsIGUpIHtcbiAgICAgKiAgICAgICAgcmV0dXJuIGEgKyBiICsgYyArIGQgKyBlO1xuICAgICAqICAgICAgfSkpO1xuICAgICAqICAgICAgbWFkZDUoWzEsMl0sIFszXSwgWzQsIDVdLCBbNl0sIFs3LCA4XSk7IC8vPT4gWzIxLCAyMiwgMjIsIDIzLCAyMiwgMjMsIDIzLCAyNF1cbiAgICAgKi9cbiAgICB2YXIgbGlmdCA9IF9jdXJyeTEoZnVuY3Rpb24gbGlmdChmbikge1xuICAgICAgICByZXR1cm4gbGlmdE4oZm4ubGVuZ3RoLCBmbik7XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgbmV3IGZ1bmN0aW9uIHRoYXQsIHdoZW4gaW52b2tlZCwgY2FjaGVzIHRoZSByZXN1bHQgb2YgY2FsbGluZyBgZm5gIGZvciBhIGdpdmVuXG4gICAgICogYXJndW1lbnQgc2V0IGFuZCByZXR1cm5zIHRoZSByZXN1bHQuIFN1YnNlcXVlbnQgY2FsbHMgdG8gdGhlIG1lbW9pemVkIGBmbmAgd2l0aCB0aGUgc2FtZVxuICAgICAqIGFyZ3VtZW50IHNldCB3aWxsIG5vdCByZXN1bHQgaW4gYW4gYWRkaXRpb25hbCBjYWxsIHRvIGBmbmA7IGluc3RlYWQsIHRoZSBjYWNoZWQgcmVzdWx0XG4gICAgICogZm9yIHRoYXQgc2V0IG9mIGFyZ3VtZW50cyB3aWxsIGJlIHJldHVybmVkLlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBGdW5jdGlvblxuICAgICAqIEBzaWcgKCouLi4gLT4gYSkgLT4gKCouLi4gLT4gYSlcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgZnVuY3Rpb24gdG8gbWVtb2l6ZS5cbiAgICAgKiBAcmV0dXJuIHtGdW5jdGlvbn0gTWVtb2l6ZWQgdmVyc2lvbiBvZiBgZm5gLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIHZhciBjb3VudCA9IDA7XG4gICAgICogICAgICB2YXIgZmFjdG9yaWFsID0gUi5tZW1vaXplKGZ1bmN0aW9uKG4pIHtcbiAgICAgKiAgICAgICAgY291bnQgKz0gMTtcbiAgICAgKiAgICAgICAgcmV0dXJuIFIucHJvZHVjdChSLnJhbmdlKDEsIG4gKyAxKSk7XG4gICAgICogICAgICB9KTtcbiAgICAgKiAgICAgIGZhY3RvcmlhbCg1KTsgLy89PiAxMjBcbiAgICAgKiAgICAgIGZhY3RvcmlhbCg1KTsgLy89PiAxMjBcbiAgICAgKiAgICAgIGZhY3RvcmlhbCg1KTsgLy89PiAxMjBcbiAgICAgKiAgICAgIGNvdW50OyAvLz0+IDFcbiAgICAgKi9cbiAgICB2YXIgbWVtb2l6ZSA9IF9jdXJyeTEoZnVuY3Rpb24gbWVtb2l6ZShmbikge1xuICAgICAgICB2YXIgY2FjaGUgPSB7fTtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBrZXkgPSB0b1N0cmluZyhhcmd1bWVudHMpO1xuICAgICAgICAgICAgaWYgKCFfaGFzKGtleSwgY2FjaGUpKSB7XG4gICAgICAgICAgICAgICAgY2FjaGVba2V5XSA9IGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVba2V5XTtcbiAgICAgICAgfTtcbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIFJlYXNvbmFibGUgYW5hbG9nIHRvIFNRTCBgc2VsZWN0YCBzdGF0ZW1lbnQuXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IE9iamVjdFxuICAgICAqIEBjYXRlZ29yeSBSZWxhdGlvblxuICAgICAqIEBzaWcgW2tdIC0+IFt7azogdn1dIC0+IFt7azogdn1dXG4gICAgICogQHBhcmFtIHtBcnJheX0gcHJvcHMgVGhlIHByb3BlcnR5IG5hbWVzIHRvIHByb2plY3RcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBvYmpzIFRoZSBvYmplY3RzIHRvIHF1ZXJ5XG4gICAgICogQHJldHVybiB7QXJyYXl9IEFuIGFycmF5IG9mIG9iamVjdHMgd2l0aCBqdXN0IHRoZSBgcHJvcHNgIHByb3BlcnRpZXMuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgdmFyIGFiYnkgPSB7bmFtZTogJ0FiYnknLCBhZ2U6IDcsIGhhaXI6ICdibG9uZCcsIGdyYWRlOiAyfTtcbiAgICAgKiAgICAgIHZhciBmcmVkID0ge25hbWU6ICdGcmVkJywgYWdlOiAxMiwgaGFpcjogJ2Jyb3duJywgZ3JhZGU6IDd9O1xuICAgICAqICAgICAgdmFyIGtpZHMgPSBbYWJieSwgZnJlZF07XG4gICAgICogICAgICBSLnByb2plY3QoWyduYW1lJywgJ2dyYWRlJ10sIGtpZHMpOyAvLz0+IFt7bmFtZTogJ0FiYnknLCBncmFkZTogMn0sIHtuYW1lOiAnRnJlZCcsIGdyYWRlOiA3fV1cbiAgICAgKi9cbiAgICAvLyBwYXNzaW5nIGBpZGVudGl0eWAgZ2l2ZXMgY29ycmVjdCBhcml0eVxuICAgIHZhciBwcm9qZWN0ID0gdXNlV2l0aChfbWFwLCBwaWNrQWxsLCBpZGVudGl0eSk7XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGEgbmV3IGxpc3QgY29udGFpbmluZyBvbmx5IG9uZSBjb3B5IG9mIGVhY2ggZWxlbWVudCBpbiB0aGUgb3JpZ2luYWwgbGlzdC5cbiAgICAgKiBgUi5lcXVhbHNgIGlzIHVzZWQgdG8gZGV0ZXJtaW5lIGVxdWFsaXR5LlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBMaXN0XG4gICAgICogQHNpZyBbYV0gLT4gW2FdXG4gICAgICogQHBhcmFtIHtBcnJheX0gbGlzdCBUaGUgYXJyYXkgdG8gY29uc2lkZXIuXG4gICAgICogQHJldHVybiB7QXJyYXl9IFRoZSBsaXN0IG9mIHVuaXF1ZSBpdGVtcy5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICBSLnVuaXEoWzEsIDEsIDIsIDFdKTsgLy89PiBbMSwgMl1cbiAgICAgKiAgICAgIFIudW5pcShbMSwgJzEnXSk7ICAgICAvLz0+IFsxLCAnMSddXG4gICAgICogICAgICBSLnVuaXEoW1s0Ml0sIFs0Ml1dKTsgLy89PiBbWzQyXV1cbiAgICAgKi9cbiAgICAvKipcbiAgICAgICAqIFVzZXMgYSBuYXRpdmUgYFNldGAgaW5zdGFuY2Ugd2hlcmUgcG9zc2libGUgZm9yXG4gICAgICAgKiByZW1vdmluZyBkdXBsaWNhdGUgaXRlbXMuIEl0ZW1zIHRoYXQgaW1wbGVtZW50XG4gICAgICAgKiB0aGUgZmFudGFzeS1sYW5kIFNldG9pZCBzcGVjIGZhbGxiYWNrIHRvIHVzaW5nXG4gICAgICAgKiBgX2NvbnRhaW5zYCB0byBzdXBwb3J0IGN1c3RvbSBlcXVhbGl0eSBiZWhhdmlvdXIuXG4gICAgICAgKi9cbiAgICAvKiBnbG9iYWwgU2V0ICovXG4gICAgLy8gYF9jb250YWluc2AgaXMgYWxzbyB1c2VkIHRvIGRpZmZlcmVudGlhdGUgYmV0d2VlblxuICAgIC8vICswIGFuZCAtMCwgYXMgdGhlIG5hdGl2ZSBTZXQgZG9lcyBub3QuXG4gICAgdmFyIHVuaXEgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8qKlxuICAgICAgICogVXNlcyBhIG5hdGl2ZSBgU2V0YCBpbnN0YW5jZSB3aGVyZSBwb3NzaWJsZSBmb3JcbiAgICAgICAqIHJlbW92aW5nIGR1cGxpY2F0ZSBpdGVtcy4gSXRlbXMgdGhhdCBpbXBsZW1lbnRcbiAgICAgICAqIHRoZSBmYW50YXN5LWxhbmQgU2V0b2lkIHNwZWMgZmFsbGJhY2sgdG8gdXNpbmdcbiAgICAgICAqIGBfY29udGFpbnNgIHRvIHN1cHBvcnQgY3VzdG9tIGVxdWFsaXR5IGJlaGF2aW91ci5cbiAgICAgICAqL1xuICAgICAgICBmdW5jdGlvbiB1bmlxKGxpc3QpIHtcbiAgICAgICAgICAgIC8qIGdsb2JhbCBTZXQgKi9cbiAgICAgICAgICAgIHZhciBpdGVtLCBzZXQgPSBuZXcgU2V0KCksIGlkeCA9IDAsIGxlbiA9IGxpc3QubGVuZ3RoLCBpdGVtcyA9IFtdLCB1bmlxcyA9IFtdO1xuICAgICAgICAgICAgd2hpbGUgKGlkeCA8IGxlbikge1xuICAgICAgICAgICAgICAgIGl0ZW0gPSBsaXN0W2lkeF07XG4gICAgICAgICAgICAgICAgLy8gYF9jb250YWluc2AgaXMgYWxzbyB1c2VkIHRvIGRpZmZlcmVudGlhdGUgYmV0d2VlblxuICAgICAgICAgICAgICAgIC8vICswIGFuZCAtMCwgYXMgdGhlIG5hdGl2ZSBTZXQgZG9lcyBub3QuXG4gICAgICAgICAgICAgICAgaWYgKGl0ZW0gPT09IDAgfHwgaXRlbSAhPSBudWxsICYmIHR5cGVvZiBpdGVtLmVxdWFscyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIV9jb250YWlucyhpdGVtLCBpdGVtcykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1zLnB1c2goaXRlbSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB1bmlxcy5wdXNoKGl0ZW0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNldC5zaXplICE9PSBzZXQuYWRkKGl0ZW0pLnNpemUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVuaXFzLnB1c2goaXRlbSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWR4ICs9IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdW5pcXM7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHR5cGVvZiBTZXQgIT09ICdmdW5jdGlvbicgPyB1bmlxV2l0aChlcXVhbHMpIDogX2N1cnJ5MSh1bmlxKTtcbiAgICB9KCk7XG5cbiAgICAvKipcbiAgICAgKiBXcmFwcyBhIGNvbnN0cnVjdG9yIGZ1bmN0aW9uIGluc2lkZSBhIGN1cnJpZWQgZnVuY3Rpb24gdGhhdCBjYW4gYmUgY2FsbGVkIHdpdGggdGhlIHNhbWVcbiAgICAgKiBhcmd1bWVudHMgYW5kIHJldHVybnMgdGhlIHNhbWUgdHlwZS5cbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgRnVuY3Rpb25cbiAgICAgKiBAc2lnICgqIC0+IHsqfSkgLT4gKCogLT4geyp9KVxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IEZuIFRoZSBjb25zdHJ1Y3RvciBmdW5jdGlvbiB0byB3cmFwLlxuICAgICAqIEByZXR1cm4ge0Z1bmN0aW9ufSBBIHdyYXBwZWQsIGN1cnJpZWQgY29uc3RydWN0b3IgZnVuY3Rpb24uXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgLy8gQ29uc3RydWN0b3IgZnVuY3Rpb25cbiAgICAgKiAgICAgIHZhciBXaWRnZXQgPSBmdW5jdGlvbihjb25maWcpIHtcbiAgICAgKiAgICAgICAgLy8gLi4uXG4gICAgICogICAgICB9O1xuICAgICAqICAgICAgV2lkZ2V0LnByb3RvdHlwZSA9IHtcbiAgICAgKiAgICAgICAgLy8gLi4uXG4gICAgICogICAgICB9O1xuICAgICAqICAgICAgdmFyIGFsbENvbmZpZ3MgPSBbXG4gICAgICogICAgICAgIC8vIC4uLlxuICAgICAqICAgICAgXTtcbiAgICAgKiAgICAgIFIubWFwKFIuY29uc3RydWN0KFdpZGdldCksIGFsbENvbmZpZ3MpOyAvLyBhIGxpc3Qgb2YgV2lkZ2V0c1xuICAgICAqL1xuICAgIHZhciBjb25zdHJ1Y3QgPSBfY3VycnkxKGZ1bmN0aW9uIGNvbnN0cnVjdChGbikge1xuICAgICAgICByZXR1cm4gY29uc3RydWN0TihGbi5sZW5ndGgsIEZuKTtcbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIENvbWJpbmVzIHR3byBsaXN0cyBpbnRvIGEgc2V0IChpLmUuIG5vIGR1cGxpY2F0ZXMpIGNvbXBvc2VkIG9mIHRob3NlIGVsZW1lbnRzIGNvbW1vbiB0byBib3RoIGxpc3RzLlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBSZWxhdGlvblxuICAgICAqIEBzaWcgW2FdIC0+IFthXSAtPiBbYV1cbiAgICAgKiBAcGFyYW0ge0FycmF5fSBsaXN0MSBUaGUgZmlyc3QgbGlzdC5cbiAgICAgKiBAcGFyYW0ge0FycmF5fSBsaXN0MiBUaGUgc2Vjb25kIGxpc3QuXG4gICAgICogQHNlZSBSLmludGVyc2VjdGlvbldpdGhcbiAgICAgKiBAcmV0dXJuIHtBcnJheX0gVGhlIGxpc3Qgb2YgZWxlbWVudHMgZm91bmQgaW4gYm90aCBgbGlzdDFgIGFuZCBgbGlzdDJgLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIFIuaW50ZXJzZWN0aW9uKFsxLDIsMyw0XSwgWzcsNiw1LDQsM10pOyAvLz0+IFs0LCAzXVxuICAgICAqL1xuICAgIHZhciBpbnRlcnNlY3Rpb24gPSBfY3VycnkyKGZ1bmN0aW9uIGludGVyc2VjdGlvbihsaXN0MSwgbGlzdDIpIHtcbiAgICAgICAgcmV0dXJuIHVuaXEoX2ZpbHRlcihmbGlwKF9jb250YWlucykobGlzdDEpLCBsaXN0MikpO1xuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogQ29tYmluZXMgdHdvIGxpc3RzIGludG8gYSBzZXQgKGkuZS4gbm8gZHVwbGljYXRlcykgY29tcG9zZWQgb2YgdGhlXG4gICAgICogZWxlbWVudHMgb2YgZWFjaCBsaXN0LlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBSZWxhdGlvblxuICAgICAqIEBzaWcgW2FdIC0+IFthXSAtPiBbYV1cbiAgICAgKiBAcGFyYW0ge0FycmF5fSBhcyBUaGUgZmlyc3QgbGlzdC5cbiAgICAgKiBAcGFyYW0ge0FycmF5fSBicyBUaGUgc2Vjb25kIGxpc3QuXG4gICAgICogQHJldHVybiB7QXJyYXl9IFRoZSBmaXJzdCBhbmQgc2Vjb25kIGxpc3RzIGNvbmNhdGVuYXRlZCwgd2l0aFxuICAgICAqICAgICAgICAgZHVwbGljYXRlcyByZW1vdmVkLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIFIudW5pb24oWzEsIDIsIDNdLCBbMiwgMywgNF0pOyAvLz0+IFsxLCAyLCAzLCA0XVxuICAgICAqL1xuICAgIHZhciB1bmlvbiA9IF9jdXJyeTIoY29tcG9zZSh1bmlxLCBfY29uY2F0KSk7XG5cbiAgICB2YXIgUiA9IHtcbiAgICAgICAgRjogRixcbiAgICAgICAgVDogVCxcbiAgICAgICAgX186IF9fLFxuICAgICAgICBhZGQ6IGFkZCxcbiAgICAgICAgYWRkSW5kZXg6IGFkZEluZGV4LFxuICAgICAgICBhZGp1c3Q6IGFkanVzdCxcbiAgICAgICAgYWxsOiBhbGwsXG4gICAgICAgIGFsbFBhc3M6IGFsbFBhc3MsXG4gICAgICAgIGFsd2F5czogYWx3YXlzLFxuICAgICAgICBhbmQ6IGFuZCxcbiAgICAgICAgYW55OiBhbnksXG4gICAgICAgIGFueVBhc3M6IGFueVBhc3MsXG4gICAgICAgIGFwOiBhcCxcbiAgICAgICAgYXBlcnR1cmU6IGFwZXJ0dXJlLFxuICAgICAgICBhcHBlbmQ6IGFwcGVuZCxcbiAgICAgICAgYXBwbHk6IGFwcGx5LFxuICAgICAgICBhcml0eTogYXJpdHksXG4gICAgICAgIGFzc29jOiBhc3NvYyxcbiAgICAgICAgYXNzb2NQYXRoOiBhc3NvY1BhdGgsXG4gICAgICAgIGJpbmFyeTogYmluYXJ5LFxuICAgICAgICBiaW5kOiBiaW5kLFxuICAgICAgICBib3RoOiBib3RoLFxuICAgICAgICBjYWxsOiBjYWxsLFxuICAgICAgICBjaGFpbjogY2hhaW4sXG4gICAgICAgIGNsb25lOiBjbG9uZSxcbiAgICAgICAgY29tbXV0ZTogY29tbXV0ZSxcbiAgICAgICAgY29tbXV0ZU1hcDogY29tbXV0ZU1hcCxcbiAgICAgICAgY29tcGFyYXRvcjogY29tcGFyYXRvcixcbiAgICAgICAgY29tcGxlbWVudDogY29tcGxlbWVudCxcbiAgICAgICAgY29tcG9zZTogY29tcG9zZSxcbiAgICAgICAgY29tcG9zZUw6IGNvbXBvc2VMLFxuICAgICAgICBjb21wb3NlUDogY29tcG9zZVAsXG4gICAgICAgIGNvbmNhdDogY29uY2F0LFxuICAgICAgICBjb25kOiBjb25kLFxuICAgICAgICBjb25zdHJ1Y3Q6IGNvbnN0cnVjdCxcbiAgICAgICAgY29uc3RydWN0TjogY29uc3RydWN0TixcbiAgICAgICAgY29udGFpbnM6IGNvbnRhaW5zLFxuICAgICAgICBjb250YWluc1dpdGg6IGNvbnRhaW5zV2l0aCxcbiAgICAgICAgY29udmVyZ2U6IGNvbnZlcmdlLFxuICAgICAgICBjb3VudEJ5OiBjb3VudEJ5LFxuICAgICAgICBjcmVhdGVNYXBFbnRyeTogY3JlYXRlTWFwRW50cnksXG4gICAgICAgIGN1cnJ5OiBjdXJyeSxcbiAgICAgICAgY3VycnlOOiBjdXJyeU4sXG4gICAgICAgIGRlYzogZGVjLFxuICAgICAgICBkZWZhdWx0VG86IGRlZmF1bHRUbyxcbiAgICAgICAgZGlmZmVyZW5jZTogZGlmZmVyZW5jZSxcbiAgICAgICAgZGlmZmVyZW5jZVdpdGg6IGRpZmZlcmVuY2VXaXRoLFxuICAgICAgICBkaXNzb2M6IGRpc3NvYyxcbiAgICAgICAgZGlzc29jUGF0aDogZGlzc29jUGF0aCxcbiAgICAgICAgZGl2aWRlOiBkaXZpZGUsXG4gICAgICAgIGRyb3A6IGRyb3AsXG4gICAgICAgIGRyb3BSZXBlYXRzOiBkcm9wUmVwZWF0cyxcbiAgICAgICAgZHJvcFJlcGVhdHNXaXRoOiBkcm9wUmVwZWF0c1dpdGgsXG4gICAgICAgIGRyb3BXaGlsZTogZHJvcFdoaWxlLFxuICAgICAgICBlaXRoZXI6IGVpdGhlcixcbiAgICAgICAgZW1wdHk6IGVtcHR5LFxuICAgICAgICBlcVByb3BzOiBlcVByb3BzLFxuICAgICAgICBlcXVhbHM6IGVxdWFscyxcbiAgICAgICAgZXZvbHZlOiBldm9sdmUsXG4gICAgICAgIGZpbHRlcjogZmlsdGVyLFxuICAgICAgICBmaWx0ZXJJbmRleGVkOiBmaWx0ZXJJbmRleGVkLFxuICAgICAgICBmaW5kOiBmaW5kLFxuICAgICAgICBmaW5kSW5kZXg6IGZpbmRJbmRleCxcbiAgICAgICAgZmluZExhc3Q6IGZpbmRMYXN0LFxuICAgICAgICBmaW5kTGFzdEluZGV4OiBmaW5kTGFzdEluZGV4LFxuICAgICAgICBmbGF0dGVuOiBmbGF0dGVuLFxuICAgICAgICBmbGlwOiBmbGlwLFxuICAgICAgICBmb3JFYWNoOiBmb3JFYWNoLFxuICAgICAgICBmb3JFYWNoSW5kZXhlZDogZm9yRWFjaEluZGV4ZWQsXG4gICAgICAgIGZyb21QYWlyczogZnJvbVBhaXJzLFxuICAgICAgICBmdW5jdGlvbnM6IGZ1bmN0aW9ucyxcbiAgICAgICAgZnVuY3Rpb25zSW46IGZ1bmN0aW9uc0luLFxuICAgICAgICBncm91cEJ5OiBncm91cEJ5LFxuICAgICAgICBndDogZ3QsXG4gICAgICAgIGd0ZTogZ3RlLFxuICAgICAgICBoYXM6IGhhcyxcbiAgICAgICAgaGFzSW46IGhhc0luLFxuICAgICAgICBoZWFkOiBoZWFkLFxuICAgICAgICBpZGVudGljYWw6IGlkZW50aWNhbCxcbiAgICAgICAgaWRlbnRpdHk6IGlkZW50aXR5LFxuICAgICAgICBpZkVsc2U6IGlmRWxzZSxcbiAgICAgICAgaW5jOiBpbmMsXG4gICAgICAgIGluZGV4T2Y6IGluZGV4T2YsXG4gICAgICAgIGluaXQ6IGluaXQsXG4gICAgICAgIGluc2VydDogaW5zZXJ0LFxuICAgICAgICBpbnNlcnRBbGw6IGluc2VydEFsbCxcbiAgICAgICAgaW50ZXJzZWN0aW9uOiBpbnRlcnNlY3Rpb24sXG4gICAgICAgIGludGVyc2VjdGlvbldpdGg6IGludGVyc2VjdGlvbldpdGgsXG4gICAgICAgIGludGVyc3BlcnNlOiBpbnRlcnNwZXJzZSxcbiAgICAgICAgaW50bzogaW50byxcbiAgICAgICAgaW52ZXJ0OiBpbnZlcnQsXG4gICAgICAgIGludmVydE9iajogaW52ZXJ0T2JqLFxuICAgICAgICBpbnZva2U6IGludm9rZSxcbiAgICAgICAgaW52b2tlcjogaW52b2tlcixcbiAgICAgICAgaXM6IGlzLFxuICAgICAgICBpc0FycmF5TGlrZTogaXNBcnJheUxpa2UsXG4gICAgICAgIGlzRW1wdHk6IGlzRW1wdHksXG4gICAgICAgIGlzTmlsOiBpc05pbCxcbiAgICAgICAgaXNTZXQ6IGlzU2V0LFxuICAgICAgICBqb2luOiBqb2luLFxuICAgICAgICBrZXlzOiBrZXlzLFxuICAgICAgICBrZXlzSW46IGtleXNJbixcbiAgICAgICAgbGFzdDogbGFzdCxcbiAgICAgICAgbGFzdEluZGV4T2Y6IGxhc3RJbmRleE9mLFxuICAgICAgICBsZW5ndGg6IGxlbmd0aCxcbiAgICAgICAgbGVuczogbGVucyxcbiAgICAgICAgbGVuc0luZGV4OiBsZW5zSW5kZXgsXG4gICAgICAgIGxlbnNPbjogbGVuc09uLFxuICAgICAgICBsZW5zUHJvcDogbGVuc1Byb3AsXG4gICAgICAgIGxpZnQ6IGxpZnQsXG4gICAgICAgIGxpZnROOiBsaWZ0TixcbiAgICAgICAgbHQ6IGx0LFxuICAgICAgICBsdGU6IGx0ZSxcbiAgICAgICAgbWFwOiBtYXAsXG4gICAgICAgIG1hcEFjY3VtOiBtYXBBY2N1bSxcbiAgICAgICAgbWFwQWNjdW1SaWdodDogbWFwQWNjdW1SaWdodCxcbiAgICAgICAgbWFwSW5kZXhlZDogbWFwSW5kZXhlZCxcbiAgICAgICAgbWFwT2JqOiBtYXBPYmosXG4gICAgICAgIG1hcE9iakluZGV4ZWQ6IG1hcE9iakluZGV4ZWQsXG4gICAgICAgIG1hdGNoOiBtYXRjaCxcbiAgICAgICAgbWF0aE1vZDogbWF0aE1vZCxcbiAgICAgICAgbWF4OiBtYXgsXG4gICAgICAgIG1heEJ5OiBtYXhCeSxcbiAgICAgICAgbWVhbjogbWVhbixcbiAgICAgICAgbWVkaWFuOiBtZWRpYW4sXG4gICAgICAgIG1lbW9pemU6IG1lbW9pemUsXG4gICAgICAgIG1lcmdlOiBtZXJnZSxcbiAgICAgICAgbWVyZ2VBbGw6IG1lcmdlQWxsLFxuICAgICAgICBtaW46IG1pbixcbiAgICAgICAgbWluQnk6IG1pbkJ5LFxuICAgICAgICBtb2R1bG86IG1vZHVsbyxcbiAgICAgICAgbXVsdGlwbHk6IG11bHRpcGx5LFxuICAgICAgICBuQXJ5OiBuQXJ5LFxuICAgICAgICBuZWdhdGU6IG5lZ2F0ZSxcbiAgICAgICAgbm9uZTogbm9uZSxcbiAgICAgICAgbm90OiBub3QsXG4gICAgICAgIG50aDogbnRoLFxuICAgICAgICBudGhBcmc6IG50aEFyZyxcbiAgICAgICAgbnRoQ2hhcjogbnRoQ2hhcixcbiAgICAgICAgbnRoQ2hhckNvZGU6IG50aENoYXJDb2RlLFxuICAgICAgICBvZjogb2YsXG4gICAgICAgIG9taXQ6IG9taXQsXG4gICAgICAgIG9uY2U6IG9uY2UsXG4gICAgICAgIG9yOiBvcixcbiAgICAgICAgcGFydGlhbDogcGFydGlhbCxcbiAgICAgICAgcGFydGlhbFJpZ2h0OiBwYXJ0aWFsUmlnaHQsXG4gICAgICAgIHBhcnRpdGlvbjogcGFydGl0aW9uLFxuICAgICAgICBwYXRoOiBwYXRoLFxuICAgICAgICBwYXRoRXE6IHBhdGhFcSxcbiAgICAgICAgcGljazogcGljayxcbiAgICAgICAgcGlja0FsbDogcGlja0FsbCxcbiAgICAgICAgcGlja0J5OiBwaWNrQnksXG4gICAgICAgIHBpcGU6IHBpcGUsXG4gICAgICAgIHBpcGVMOiBwaXBlTCxcbiAgICAgICAgcGlwZVA6IHBpcGVQLFxuICAgICAgICBwbHVjazogcGx1Y2ssXG4gICAgICAgIHByZXBlbmQ6IHByZXBlbmQsXG4gICAgICAgIHByb2R1Y3Q6IHByb2R1Y3QsXG4gICAgICAgIHByb2plY3Q6IHByb2plY3QsXG4gICAgICAgIHByb3A6IHByb3AsXG4gICAgICAgIHByb3BFcTogcHJvcEVxLFxuICAgICAgICBwcm9wT3I6IHByb3BPcixcbiAgICAgICAgcHJvcHM6IHByb3BzLFxuICAgICAgICByYW5nZTogcmFuZ2UsXG4gICAgICAgIHJlZHVjZTogcmVkdWNlLFxuICAgICAgICByZWR1Y2VJbmRleGVkOiByZWR1Y2VJbmRleGVkLFxuICAgICAgICByZWR1Y2VSaWdodDogcmVkdWNlUmlnaHQsXG4gICAgICAgIHJlZHVjZVJpZ2h0SW5kZXhlZDogcmVkdWNlUmlnaHRJbmRleGVkLFxuICAgICAgICByZWR1Y2VkOiByZWR1Y2VkLFxuICAgICAgICByZWplY3Q6IHJlamVjdCxcbiAgICAgICAgcmVqZWN0SW5kZXhlZDogcmVqZWN0SW5kZXhlZCxcbiAgICAgICAgcmVtb3ZlOiByZW1vdmUsXG4gICAgICAgIHJlcGVhdDogcmVwZWF0LFxuICAgICAgICByZXBsYWNlOiByZXBsYWNlLFxuICAgICAgICByZXZlcnNlOiByZXZlcnNlLFxuICAgICAgICBzY2FuOiBzY2FuLFxuICAgICAgICBzbGljZTogc2xpY2UsXG4gICAgICAgIHNvcnQ6IHNvcnQsXG4gICAgICAgIHNvcnRCeTogc29ydEJ5LFxuICAgICAgICBzcGxpdDogc3BsaXQsXG4gICAgICAgIHN0ckluZGV4T2Y6IHN0ckluZGV4T2YsXG4gICAgICAgIHN0ckxhc3RJbmRleE9mOiBzdHJMYXN0SW5kZXhPZixcbiAgICAgICAgc3Vic3RyaW5nOiBzdWJzdHJpbmcsXG4gICAgICAgIHN1YnN0cmluZ0Zyb206IHN1YnN0cmluZ0Zyb20sXG4gICAgICAgIHN1YnN0cmluZ1RvOiBzdWJzdHJpbmdUbyxcbiAgICAgICAgc3VidHJhY3Q6IHN1YnRyYWN0LFxuICAgICAgICBzdW06IHN1bSxcbiAgICAgICAgdGFpbDogdGFpbCxcbiAgICAgICAgdGFrZTogdGFrZSxcbiAgICAgICAgdGFrZVdoaWxlOiB0YWtlV2hpbGUsXG4gICAgICAgIHRhcDogdGFwLFxuICAgICAgICB0ZXN0OiB0ZXN0LFxuICAgICAgICB0aW1lczogdGltZXMsXG4gICAgICAgIHRvTG93ZXI6IHRvTG93ZXIsXG4gICAgICAgIHRvUGFpcnM6IHRvUGFpcnMsXG4gICAgICAgIHRvUGFpcnNJbjogdG9QYWlyc0luLFxuICAgICAgICB0b1N0cmluZzogdG9TdHJpbmcsXG4gICAgICAgIHRvVXBwZXI6IHRvVXBwZXIsXG4gICAgICAgIHRyYW5zZHVjZTogdHJhbnNkdWNlLFxuICAgICAgICB0cmltOiB0cmltLFxuICAgICAgICB0eXBlOiB0eXBlLFxuICAgICAgICB1bmFwcGx5OiB1bmFwcGx5LFxuICAgICAgICB1bmFyeTogdW5hcnksXG4gICAgICAgIHVuY3VycnlOOiB1bmN1cnJ5TixcbiAgICAgICAgdW5mb2xkOiB1bmZvbGQsXG4gICAgICAgIHVuaW9uOiB1bmlvbixcbiAgICAgICAgdW5pb25XaXRoOiB1bmlvbldpdGgsXG4gICAgICAgIHVuaXE6IHVuaXEsXG4gICAgICAgIHVuaXFXaXRoOiB1bmlxV2l0aCxcbiAgICAgICAgdW5uZXN0OiB1bm5lc3QsXG4gICAgICAgIHVwZGF0ZTogdXBkYXRlLFxuICAgICAgICB1c2VXaXRoOiB1c2VXaXRoLFxuICAgICAgICB2YWx1ZXM6IHZhbHVlcyxcbiAgICAgICAgdmFsdWVzSW46IHZhbHVlc0luLFxuICAgICAgICB3aGVyZTogd2hlcmUsXG4gICAgICAgIHdoZXJlRXE6IHdoZXJlRXEsXG4gICAgICAgIHdyYXA6IHdyYXAsXG4gICAgICAgIHhwcm9kOiB4cHJvZCxcbiAgICAgICAgemlwOiB6aXAsXG4gICAgICAgIHppcE9iajogemlwT2JqLFxuICAgICAgICB6aXBXaXRoOiB6aXBXaXRoXG4gICAgfTtcblxuICAvKiBURVNUX0VOVFJZX1BPSU5UICovXG5cbiAgaWYgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jykge1xuICAgIG1vZHVsZS5leHBvcnRzID0gUjtcbiAgfSBlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICBkZWZpbmUoZnVuY3Rpb24oKSB7IHJldHVybiBSOyB9KTtcbiAgfSBlbHNlIHtcbiAgICB0aGlzLlIgPSBSO1xuICB9XG5cbn0uY2FsbCh0aGlzKSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBWaXJ0dWFsQXVkaW9HcmFwaCA9IHJlcXVpcmUoJy4uL3NyYy9pbmRleC5qcycpO1xudmFyIGF1ZGlvQ29udGV4dCA9IHJlcXVpcmUoJy4vdG9vbHMvYXVkaW9Db250ZXh0Jyk7XG5cbmRlc2NyaWJlKCdWaXJ0dWFsQXVkaW9HcmFwaCcsIGZ1bmN0aW9uICgpIHtcbiAgaXQoJ29wdGlvbmFsbHkgdGFrZXMgYXVkaW9Db250ZXh0IHByb3BlcnR5JywgZnVuY3Rpb24gKCkge1xuICAgIGV4cGVjdChuZXcgVmlydHVhbEF1ZGlvR3JhcGgoeyBhdWRpb0NvbnRleHQ6IGF1ZGlvQ29udGV4dCB9KS5hdWRpb0NvbnRleHQpLnRvQmUoYXVkaW9Db250ZXh0KTtcbiAgICBleHBlY3QobmV3IFZpcnR1YWxBdWRpb0dyYXBoKCkuYXVkaW9Db250ZXh0IGluc3RhbmNlb2YgQXVkaW9Db250ZXh0KS50b0JlKHRydWUpO1xuICB9KTtcblxuICBpdCgnb3B0aW9uYWxseSB0YWtlcyBvdXRwdXQgcGFyYW1ldGVyJywgZnVuY3Rpb24gKCkge1xuICAgIGV4cGVjdChuZXcgVmlydHVhbEF1ZGlvR3JhcGgoe1xuICAgICAgb3V0cHV0OiBhdWRpb0NvbnRleHQuZGVzdGluYXRpb25cbiAgICB9KS5vdXRwdXQpLnRvQmUoYXVkaW9Db250ZXh0LmRlc3RpbmF0aW9uKTtcbiAgICBleHBlY3QobmV3IFZpcnR1YWxBdWRpb0dyYXBoKHsgYXVkaW9Db250ZXh0OiBhdWRpb0NvbnRleHQgfSkub3V0cHV0KS50b0JlKGF1ZGlvQ29udGV4dC5kZXN0aW5hdGlvbik7XG4gIH0pO1xufSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk5b2IyMWxMMkl2WkdWMkwzWnBjblIxWVd3dFlYVmthVzh0WjNKaGNHZ3ZjM0JsWXk5V2FYSjBkV0ZzUVhWa2FXOUhjbUZ3YUM1cWN5SmRMQ0p1WVcxbGN5STZXMTBzSW0xaGNIQnBibWR6SWpvaU96dEJRVUZCTEVsQlFVMHNhVUpCUVdsQ0xFZEJRVWNzVDBGQlR5eERRVUZETEdsQ1FVRnBRaXhEUVVGRExFTkJRVU03UVVGRGNrUXNTVUZCVFN4WlFVRlpMRWRCUVVjc1QwRkJUeXhEUVVGRExITkNRVUZ6UWl4RFFVRkRMRU5CUVVNN08wRkJSWEpFTEZGQlFWRXNRMEZCUXl4dFFrRkJiVUlzUlVGQlJTeFpRVUZOTzBGQlEyeERMRWxCUVVVc1EwRkJReXgzUTBGQmQwTXNSVUZCUlN4WlFVRk5PMEZCUTJwRUxGVkJRVTBzUTBGQlF5eEpRVUZKTEdsQ1FVRnBRaXhEUVVGRExFVkJRVU1zV1VGQldTeEZRVUZhTEZsQlFWa3NSVUZCUXl4RFFVRkRMRU5CUVVNc1dVRkJXU3hEUVVGRExFTkJRVU1zU1VGQlNTeERRVUZETEZsQlFWa3NRMEZCUXl4RFFVRkRPMEZCUXpsRkxGVkJRVTBzUTBGQlF5eEpRVUZKTEdsQ1FVRnBRaXhGUVVGRkxFTkJRVU1zV1VGQldTeFpRVUZaTEZsQlFWa3NRMEZCUXl4RFFVRkRMRWxCUVVrc1EwRkJReXhKUVVGSkxFTkJRVU1zUTBGQlF6dEhRVU5xUml4RFFVRkRMRU5CUVVNN08wRkJSVWdzU1VGQlJTeERRVUZETEcxRFFVRnRReXhGUVVGRkxGbEJRVTA3UVVGRE5VTXNWVUZCVFN4RFFVRkRMRWxCUVVrc2FVSkJRV2xDTEVOQlFVTTdRVUZETTBJc1dVRkJUU3hGUVVGRkxGbEJRVmtzUTBGQlF5eFhRVUZYTzB0QlEycERMRU5CUVVNc1EwRkJReXhOUVVGTkxFTkJRVU1zUTBGQlF5eEpRVUZKTEVOQlFVTXNXVUZCV1N4RFFVRkRMRmRCUVZjc1EwRkJReXhEUVVGRE8wRkJRekZETEZWQlFVMHNRMEZCUXl4SlFVRkpMR2xDUVVGcFFpeERRVUZETEVWQlFVTXNXVUZCV1N4RlFVRmFMRmxCUVZrc1JVRkJReXhEUVVGRExFTkJRVU1zVFVGQlRTeERRVUZETEVOQlFVTXNTVUZCU1N4RFFVRkRMRmxCUVZrc1EwRkJReXhYUVVGWExFTkJRVU1zUTBGQlF6dEhRVU55Uml4RFFVRkRMRU5CUVVNN1EwRkRTaXhEUVVGRExFTkJRVU1pTENKbWFXeGxJam9pTDJodmJXVXZZaTlrWlhZdmRtbHlkSFZoYkMxaGRXUnBieTFuY21Gd2FDOXpjR1ZqTDFacGNuUjFZV3hCZFdScGIwZHlZWEJvTG1weklpd2ljMjkxY21ObGMwTnZiblJsYm5RaU9sc2lZMjl1YzNRZ1ZtbHlkSFZoYkVGMVpHbHZSM0poY0dnZ1BTQnlaWEYxYVhKbEtDY3VMaTl6Y21NdmFXNWtaWGd1YW5NbktUdGNibU52Ym5OMElHRjFaR2x2UTI5dWRHVjRkQ0E5SUhKbGNYVnBjbVVvSnk0dmRHOXZiSE12WVhWa2FXOURiMjUwWlhoMEp5azdYRzVjYm1SbGMyTnlhV0psS0Z3aVZtbHlkSFZoYkVGMVpHbHZSM0poY0doY0lpd2dLQ2tnUFQ0Z2UxeHVJQ0JwZENoY0ltOXdkR2x2Ym1Gc2JIa2dkR0ZyWlhNZ1lYVmthVzlEYjI1MFpYaDBJSEJ5YjNCbGNuUjVYQ0lzSUNncElEMCtJSHRjYmlBZ0lDQmxlSEJsWTNRb2JtVjNJRlpwY25SMVlXeEJkV1JwYjBkeVlYQm9LSHRoZFdScGIwTnZiblJsZUhSOUtTNWhkV1JwYjBOdmJuUmxlSFFwTG5SdlFtVW9ZWFZrYVc5RGIyNTBaWGgwS1R0Y2JpQWdJQ0JsZUhCbFkzUW9ibVYzSUZacGNuUjFZV3hCZFdScGIwZHlZWEJvS0NrdVlYVmthVzlEYjI1MFpYaDBJR2x1YzNSaGJtTmxiMllnUVhWa2FXOURiMjUwWlhoMEtTNTBiMEpsS0hSeWRXVXBPMXh1SUNCOUtUdGNibHh1SUNCcGRDaGNJbTl3ZEdsdmJtRnNiSGtnZEdGclpYTWdiM1YwY0hWMElIQmhjbUZ0WlhSbGNsd2lMQ0FvS1NBOVBpQjdYRzRnSUNBZ1pYaHdaV04wS0c1bGR5QldhWEowZFdGc1FYVmthVzlIY21Gd2FDaDdYRzRnSUNBZ0lDQnZkWFJ3ZFhRNklHRjFaR2x2UTI5dWRHVjRkQzVrWlhOMGFXNWhkR2x2Yml4Y2JpQWdJQ0I5S1M1dmRYUndkWFFwTG5SdlFtVW9ZWFZrYVc5RGIyNTBaWGgwTG1SbGMzUnBibUYwYVc5dUtUdGNiaUFnSUNCbGVIQmxZM1FvYm1WM0lGWnBjblIxWVd4QmRXUnBiMGR5WVhCb0tIdGhkV1JwYjBOdmJuUmxlSFI5S1M1dmRYUndkWFFwTG5SdlFtVW9ZWFZrYVc5RGIyNTBaWGgwTG1SbGMzUnBibUYwYVc5dUtUdGNiaUFnZlNrN1hHNTlLVHRjYmlKZGZRPT0iLCIndXNlIHN0cmljdCc7XG5cbnJlcXVpcmUoJy4vVmlydHVhbEF1ZGlvR3JhcGgnKTtcbnJlcXVpcmUoJy4vdmlydHVhbEF1ZGlvR3JhcGguZGVmaW5lTm9kZScpO1xucmVxdWlyZSgnLi92aXJ0dWFsQXVkaW9HcmFwaC51cGRhdGUnKTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTlvYjIxbEwySXZaR1YyTDNacGNuUjFZV3d0WVhWa2FXOHRaM0poY0dndmMzQmxZeTlwYm1SbGVDNXFjeUpkTENKdVlXMWxjeUk2VzEwc0ltMWhjSEJwYm1keklqb2lPenRCUVVGQkxFOUJRVThzUTBGQlF5eHhRa0ZCY1VJc1EwRkJReXhEUVVGRE8wRkJReTlDTEU5QlFVOHNRMEZCUXl4blEwRkJaME1zUTBGQlF5eERRVUZETzBGQlF6RkRMRTlCUVU4c1EwRkJReXcwUWtGQk5FSXNRMEZCUXl4RFFVRkRJaXdpWm1sc1pTSTZJaTlvYjIxbEwySXZaR1YyTDNacGNuUjFZV3d0WVhWa2FXOHRaM0poY0dndmMzQmxZeTlwYm1SbGVDNXFjeUlzSW5OdmRYSmpaWE5EYjI1MFpXNTBJanBiSW5KbGNYVnBjbVVvSnk0dlZtbHlkSFZoYkVGMVpHbHZSM0poY0dnbktUdGNibkpsY1hWcGNtVW9KeTR2ZG1seWRIVmhiRUYxWkdsdlIzSmhjR2d1WkdWbWFXNWxUbTlrWlNjcE8xeHVjbVZ4ZFdseVpTZ25MaTkyYVhKMGRXRnNRWFZrYVc5SGNtRndhQzUxY0dSaGRHVW5LVHRjYmlKZGZRPT0iLCJcInVzZSBzdHJpY3RcIjtcblxubW9kdWxlLmV4cG9ydHMgPSBuZXcgQXVkaW9Db250ZXh0KCk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk5b2IyMWxMMkl2WkdWMkwzWnBjblIxWVd3dFlYVmthVzh0WjNKaGNHZ3ZjM0JsWXk5MGIyOXNjeTloZFdScGIwTnZiblJsZUhRdWFuTWlYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklqczdRVUZCUVN4TlFVRk5MRU5CUVVNc1QwRkJUeXhIUVVGSExFbEJRVWtzV1VGQldTeEZRVUZGTEVOQlFVTWlMQ0ptYVd4bElqb2lMMmh2YldVdllpOWtaWFl2ZG1seWRIVmhiQzFoZFdScGJ5MW5jbUZ3YUM5emNHVmpMM1J2YjJ4ekwyRjFaR2x2UTI5dWRHVjRkQzVxY3lJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYkltMXZaSFZzWlM1bGVIQnZjblJ6SUQwZ2JtVjNJRUYxWkdsdlEyOXVkR1Y0ZENncE8xeHVJbDE5IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgX3JlcXVpcmUgPSByZXF1aXJlKCdyYW1kYScpO1xuXG52YXIgZXF1YWxzID0gX3JlcXVpcmUuZXF1YWxzO1xuXG52YXIgVmlydHVhbEF1ZGlvR3JhcGggPSByZXF1aXJlKCcuLi9zcmMvaW5kZXguanMnKTtcbnZhciBhdWRpb0NvbnRleHQgPSByZXF1aXJlKCcuL3Rvb2xzL2F1ZGlvQ29udGV4dCcpO1xuXG52YXIgcGluZ1BvbmdEZWxheVBhcmFtcyA9IFt7XG4gIGlkOiAwLFxuICBub2RlOiAnc3RlcmVvUGFubmVyJyxcbiAgb3V0cHV0OiAnb3V0cHV0JyxcbiAgcGFyYW1zOiB7XG4gICAgcGFuOiAtMVxuICB9XG59LCB7XG4gIGlkOiAxLFxuICBub2RlOiAnc3RlcmVvUGFubmVyJyxcbiAgb3V0cHV0OiAnb3V0cHV0JyxcbiAgcGFyYW1zOiB7XG4gICAgcGFuOiAxXG4gIH1cbn0sIHtcbiAgaWQ6IDIsXG4gIG5vZGU6ICdkZWxheScsXG4gIG91dHB1dDogWzEsIDVdLFxuICBwYXJhbXM6IHtcbiAgICBtYXhEZWxheVRpbWU6IDEgLyAzLFxuICAgIGRlbGF5VGltZTogMSAvIDNcbiAgfVxufSwge1xuICBpZDogMyxcbiAgbm9kZTogJ2dhaW4nLFxuICBvdXRwdXQ6IDIsXG4gIHBhcmFtczoge1xuICAgIGdhaW46IDEgLyAzXG4gIH1cbn0sIHtcbiAgaWQ6IDQsXG4gIG5vZGU6ICdkZWxheScsXG4gIG91dHB1dDogWzAsIDNdLFxuICBwYXJhbXM6IHtcbiAgICBtYXhEZWxheVRpbWU6IDEgLyAzLFxuICAgIGRlbGF5VGltZTogMSAvIDNcbiAgfVxufSwge1xuICBpZDogNSxcbiAgaW5wdXQ6ICdpbnB1dCcsXG4gIG5vZGU6ICdnYWluJyxcbiAgb3V0cHV0OiA0LFxuICBwYXJhbXM6IHtcbiAgICBnYWluOiAxIC8gM1xuICB9XG59XTtcblxuZGVzY3JpYmUoJ3ZpcnR1YWxBdWRpb0dyYXBoLmRlZmluZU5vZGUnLCBmdW5jdGlvbiAoKSB7XG4gIHZhciB2aXJ0dWFsQXVkaW9HcmFwaCA9IHVuZGVmaW5lZDtcblxuICBiZWZvcmVFYWNoKGZ1bmN0aW9uICgpIHtcbiAgICB2aXJ0dWFsQXVkaW9HcmFwaCA9IG5ldyBWaXJ0dWFsQXVkaW9HcmFwaCh7XG4gICAgICBhdWRpb0NvbnRleHQ6IGF1ZGlvQ29udGV4dCxcbiAgICAgIG91dHB1dDogYXVkaW9Db250ZXh0LmRlc3RpbmF0aW9uXG4gICAgfSk7XG4gIH0pO1xuXG4gIGl0KCdyZXR1cm5zIGl0c2VsZicsIGZ1bmN0aW9uICgpIHtcbiAgICBleHBlY3QodmlydHVhbEF1ZGlvR3JhcGguZGVmaW5lTm9kZShwaW5nUG9uZ0RlbGF5UGFyYW1zLCAncGluZ1BvbmdEZWxheScpKS50b0JlKHZpcnR1YWxBdWRpb0dyYXBoKTtcbiAgfSk7XG5cbiAgaXQoJ3Rocm93cyBpZiBuYW1lIHByb3ZpZGVkIGlzIGEgc3RhbmRhcmQgbm9kZScsIGZ1bmN0aW9uICgpIHtcbiAgICBleHBlY3QoZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHZpcnR1YWxBdWRpb0dyYXBoLmRlZmluZU5vZGUocGluZ1BvbmdEZWxheVBhcmFtcywgJ2dhaW4nKTtcbiAgICB9KS50b1Rocm93KCk7XG4gIH0pO1xuXG4gIGl0KCdjcmVhdGVzIGEgY3VzdG9tIG5vZGUgaW50ZXJuYWxseScsIGZ1bmN0aW9uICgpIHtcbiAgICB2aXJ0dWFsQXVkaW9HcmFwaC5kZWZpbmVOb2RlKHBpbmdQb25nRGVsYXlQYXJhbXMsICdwaW5nUG9uZ0RlbGF5Jyk7XG5cbiAgICBleHBlY3QodHlwZW9mIHZpcnR1YWxBdWRpb0dyYXBoLmN1c3RvbU5vZGVzLnBpbmdQb25nRGVsYXkpLnRvQmUoJ2Z1bmN0aW9uJyk7XG4gIH0pO1xuXG4gIGl0KCdjcmVhdGVzIGEgY3VzdG9tIG5vZGUgd2hpY2ggY2FuIGJlIHJldXNlZCBpbiB2aXJ0dWFsQXVkaW9HcmFwaC51cGRhdGUnLCBmdW5jdGlvbiAoKSB7XG4gICAgdmlydHVhbEF1ZGlvR3JhcGguZGVmaW5lTm9kZShwaW5nUG9uZ0RlbGF5UGFyYW1zLCAncGluZ1BvbmdEZWxheScpO1xuXG4gICAgdmFyIHZpcnR1YWxOb2RlUGFyYW1zID0gW3tcbiAgICAgIGlkOiAwLFxuICAgICAgbm9kZTogJ2dhaW4nLFxuICAgICAgb3V0cHV0OiAnb3V0cHV0JyxcbiAgICAgIHBhcmFtczoge1xuICAgICAgICBnYWluOiAwLjVcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBpZDogMSxcbiAgICAgIG5vZGU6ICdwaW5nUG9uZ0RlbGF5JyxcbiAgICAgIG91dHB1dDogMFxuICAgIH0sIHtcbiAgICAgIGlkOiAyLFxuICAgICAgbm9kZTogJ29zY2lsbGF0b3InLFxuICAgICAgb3V0cHV0OiAxXG4gICAgfV07XG5cbiAgICB2YXIgZXhwZWN0ZWRBdWRpb0dyYXBoID0ge1xuICAgICAgbmFtZTogJ0F1ZGlvRGVzdGluYXRpb25Ob2RlJyxcbiAgICAgIGlucHV0czogW3tcbiAgICAgICAgbmFtZTogJ0dhaW5Ob2RlJyxcbiAgICAgICAgZ2Fpbjoge1xuICAgICAgICAgIHZhbHVlOiAwLjUsXG4gICAgICAgICAgaW5wdXRzOiBbXVxuICAgICAgICB9LFxuICAgICAgICBpbnB1dHM6IFt7XG4gICAgICAgICAgbmFtZTogJ1N0ZXJlb1Bhbm5lck5vZGUnLFxuICAgICAgICAgIHBhbjoge1xuICAgICAgICAgICAgdmFsdWU6IC0xLFxuICAgICAgICAgICAgaW5wdXRzOiBbXVxuICAgICAgICAgIH0sXG4gICAgICAgICAgaW5wdXRzOiBbe1xuICAgICAgICAgICAgbmFtZTogJ0RlbGF5Tm9kZScsXG4gICAgICAgICAgICBkZWxheVRpbWU6IHtcbiAgICAgICAgICAgICAgdmFsdWU6IDAuMzMzMzMzMzMzMzMzMzMzMyxcbiAgICAgICAgICAgICAgaW5wdXRzOiBbXVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGlucHV0czogW3tcbiAgICAgICAgICAgICAgbmFtZTogJ0dhaW5Ob2RlJyxcbiAgICAgICAgICAgICAgZ2Fpbjoge1xuICAgICAgICAgICAgICAgIHZhbHVlOiAwLjMzMzMzMzMzMzMzMzMzMzMsXG4gICAgICAgICAgICAgICAgaW5wdXRzOiBbXVxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBpbnB1dHM6IFt7XG4gICAgICAgICAgICAgICAgbmFtZTogJ0RlbGF5Tm9kZScsXG4gICAgICAgICAgICAgICAgZGVsYXlUaW1lOiB7XG4gICAgICAgICAgICAgICAgICB2YWx1ZTogMC4zMzMzMzMzMzMzMzMzMzMzLFxuICAgICAgICAgICAgICAgICAgaW5wdXRzOiBbXVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgaW5wdXRzOiBbe1xuICAgICAgICAgICAgICAgICAgbmFtZTogJ0dhaW5Ob2RlJyxcbiAgICAgICAgICAgICAgICAgIGdhaW46IHtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IDAuMzMzMzMzMzMzMzMzMzMzMyxcbiAgICAgICAgICAgICAgICAgICAgaW5wdXRzOiBbXVxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIGlucHV0czogWyc8Y2lyY3VsYXI6RGVsYXlOb2RlPiddXG4gICAgICAgICAgICAgICAgfV1cbiAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIG5hbWU6ICdPc2NpbGxhdG9yTm9kZScsXG4gICAgICAgICAgICAgICAgdHlwZTogJ3NpbmUnLFxuICAgICAgICAgICAgICAgIGZyZXF1ZW5jeToge1xuICAgICAgICAgICAgICAgICAgdmFsdWU6IDQ0MCxcbiAgICAgICAgICAgICAgICAgIGlucHV0czogW11cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGRldHVuZToge1xuICAgICAgICAgICAgICAgICAgdmFsdWU6IDAsXG4gICAgICAgICAgICAgICAgICBpbnB1dHM6IFtdXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBpbnB1dHM6IFtdXG4gICAgICAgICAgICAgIH1dXG4gICAgICAgICAgICB9XVxuICAgICAgICAgIH1dXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBuYW1lOiAnU3RlcmVvUGFubmVyTm9kZScsXG4gICAgICAgICAgcGFuOiB7XG4gICAgICAgICAgICB2YWx1ZTogMSxcbiAgICAgICAgICAgIGlucHV0czogW11cbiAgICAgICAgICB9LFxuICAgICAgICAgIGlucHV0czogW3tcbiAgICAgICAgICAgIG5hbWU6ICdEZWxheU5vZGUnLFxuICAgICAgICAgICAgZGVsYXlUaW1lOiB7XG4gICAgICAgICAgICAgIHZhbHVlOiAwLjMzMzMzMzMzMzMzMzMzMzMsXG4gICAgICAgICAgICAgIGlucHV0czogW11cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBpbnB1dHM6IFt7XG4gICAgICAgICAgICAgIG5hbWU6ICdHYWluTm9kZScsXG4gICAgICAgICAgICAgIGdhaW46IHtcbiAgICAgICAgICAgICAgICB2YWx1ZTogMC4zMzMzMzMzMzMzMzMzMzMzLFxuICAgICAgICAgICAgICAgIGlucHV0czogW11cbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgaW5wdXRzOiBbe1xuICAgICAgICAgICAgICAgIG5hbWU6ICdEZWxheU5vZGUnLFxuICAgICAgICAgICAgICAgIGRlbGF5VGltZToge1xuICAgICAgICAgICAgICAgICAgdmFsdWU6IDAuMzMzMzMzMzMzMzMzMzMzMyxcbiAgICAgICAgICAgICAgICAgIGlucHV0czogW11cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGlucHV0czogW3tcbiAgICAgICAgICAgICAgICAgIG5hbWU6ICdHYWluTm9kZScsXG4gICAgICAgICAgICAgICAgICBnYWluOiB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiAwLjMzMzMzMzMzMzMzMzMzMzMsXG4gICAgICAgICAgICAgICAgICAgIGlucHV0czogW11cbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICBpbnB1dHM6IFsnPGNpcmN1bGFyOkRlbGF5Tm9kZT4nLCB7XG4gICAgICAgICAgICAgICAgICAgIG5hbWU6ICdPc2NpbGxhdG9yTm9kZScsXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdzaW5lJyxcbiAgICAgICAgICAgICAgICAgICAgZnJlcXVlbmN5OiB7XG4gICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IDQ0MCxcbiAgICAgICAgICAgICAgICAgICAgICBpbnB1dHM6IFtdXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGRldHVuZToge1xuICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiAwLFxuICAgICAgICAgICAgICAgICAgICAgIGlucHV0czogW11cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgaW5wdXRzOiBbXVxuICAgICAgICAgICAgICAgICAgfV1cbiAgICAgICAgICAgICAgICB9XVxuICAgICAgICAgICAgICB9XVxuICAgICAgICAgICAgfV1cbiAgICAgICAgICB9XVxuICAgICAgICB9XVxuICAgICAgfV1cbiAgICB9O1xuXG4gICAgZXhwZWN0KHZpcnR1YWxBdWRpb0dyYXBoLnVwZGF0ZSh2aXJ0dWFsTm9kZVBhcmFtcykpLnRvQmUodmlydHVhbEF1ZGlvR3JhcGgpO1xuICAgIGV4cGVjdChlcXVhbHMoYXVkaW9Db250ZXh0LnRvSlNPTigpLCBleHBlY3RlZEF1ZGlvR3JhcGgpKS50b0JlKHRydWUpO1xuICB9KTtcblxuICBpdCgnY2FuIGRlZmluZSBhIGN1c3RvbSBub2RlIGJ1aWx0IG9mIG90aGVyIGN1c3RvbSBub2RlcycsIGZ1bmN0aW9uICgpIHtcbiAgICB2aXJ0dWFsQXVkaW9HcmFwaC5kZWZpbmVOb2RlKHBpbmdQb25nRGVsYXlQYXJhbXMsICdwaW5nUG9uZ0RlbGF5Jyk7XG5cbiAgICB2YXIgcXVpZXRQaW5nUG9uZ0RlbGF5UGFyYW1zID0gW3tcbiAgICAgIGlkOiAwLFxuICAgICAgbm9kZTogJ2dhaW4nLFxuICAgICAgb3V0cHV0OiAnb3V0cHV0J1xuICAgIH0sIHtcbiAgICAgIGlkOiAxLFxuICAgICAgbm9kZTogJ3BpbmdQb25nRGVsYXknLFxuICAgICAgb3V0cHV0OiAwXG4gICAgfSwge1xuICAgICAgaWQ6IDIsXG4gICAgICBub2RlOiAnb3NjaWxsYXRvcicsXG4gICAgICBvdXRwdXQ6IDFcbiAgICB9XTtcblxuICAgIHZpcnR1YWxBdWRpb0dyYXBoLmRlZmluZU5vZGUocXVpZXRQaW5nUG9uZ0RlbGF5UGFyYW1zLCAncXVpZXRQaW5nUG9uZ0RlbGF5Jyk7XG5cbiAgICB2YXIgdmlydHVhbE5vZGVQYXJhbXMgPSBbe1xuICAgICAgaWQ6IDAsXG4gICAgICBub2RlOiAnZ2FpbicsXG4gICAgICBvdXRwdXQ6ICdvdXRwdXQnLFxuICAgICAgcGFyYW1zOiB7XG4gICAgICAgIGdhaW46IDAuNVxuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIGlkOiAxLFxuICAgICAgbm9kZTogJ3F1aWV0UGluZ1BvbmdEZWxheScsXG4gICAgICBvdXRwdXQ6IDBcbiAgICB9LCB7XG4gICAgICBpZDogMixcbiAgICAgIG5vZGU6ICdwaW5nUG9uZ0RlbGF5JyxcbiAgICAgIG91dHB1dDogMVxuICAgIH0sIHtcbiAgICAgIGlkOiAzLFxuICAgICAgbm9kZTogJ29zY2lsbGF0b3InLFxuICAgICAgb3V0cHV0OiAyXG4gICAgfV07XG5cbiAgICBleHBlY3QodmlydHVhbEF1ZGlvR3JhcGgudXBkYXRlKHZpcnR1YWxOb2RlUGFyYW1zKSkudG9CZSh2aXJ0dWFsQXVkaW9HcmFwaCk7XG4gICAgZXhwZWN0KGVxdWFscyhhdWRpb0NvbnRleHQudG9KU09OKCksIHsgJ25hbWUnOiAnQXVkaW9EZXN0aW5hdGlvbk5vZGUnLCAnaW5wdXRzJzogW3sgJ25hbWUnOiAnR2Fpbk5vZGUnLCAnZ2Fpbic6IHsgJ3ZhbHVlJzogMC41LCAnaW5wdXRzJzogW10gfSwgJ2lucHV0cyc6IFt7ICduYW1lJzogJ1N0ZXJlb1Bhbm5lck5vZGUnLCAncGFuJzogeyAndmFsdWUnOiAtMSwgJ2lucHV0cyc6IFtdIH0sICdpbnB1dHMnOiBbeyAnbmFtZSc6ICdEZWxheU5vZGUnLCAnZGVsYXlUaW1lJzogeyAndmFsdWUnOiAwLjMzMzMzMzMzMzMzMzMzMzMsICdpbnB1dHMnOiBbXSB9LCAnaW5wdXRzJzogW3sgJ25hbWUnOiAnR2Fpbk5vZGUnLCAnZ2Fpbic6IHsgJ3ZhbHVlJzogMC4zMzMzMzMzMzMzMzMzMzMzLCAnaW5wdXRzJzogW10gfSwgJ2lucHV0cyc6IFt7ICduYW1lJzogJ0RlbGF5Tm9kZScsICdkZWxheVRpbWUnOiB7ICd2YWx1ZSc6IDAuMzMzMzMzMzMzMzMzMzMzMywgJ2lucHV0cyc6IFtdIH0sICdpbnB1dHMnOiBbeyAnbmFtZSc6ICdHYWluTm9kZScsICdnYWluJzogeyAndmFsdWUnOiAwLjMzMzMzMzMzMzMzMzMzMzMsICdpbnB1dHMnOiBbXSB9LCAnaW5wdXRzJzogWyc8Y2lyY3VsYXI6RGVsYXlOb2RlPiddIH1dIH0sIHsgJ25hbWUnOiAnT3NjaWxsYXRvck5vZGUnLCAndHlwZSc6ICdzaW5lJywgJ2ZyZXF1ZW5jeSc6IHsgJ3ZhbHVlJzogNDQwLCAnaW5wdXRzJzogW10gfSwgJ2RldHVuZSc6IHsgJ3ZhbHVlJzogMCwgJ2lucHV0cyc6IFtdIH0sICdpbnB1dHMnOiBbXSB9XSB9XSB9XSB9LCB7ICduYW1lJzogJ1N0ZXJlb1Bhbm5lck5vZGUnLCAncGFuJzogeyAndmFsdWUnOiAxLCAnaW5wdXRzJzogW10gfSwgJ2lucHV0cyc6IFt7ICduYW1lJzogJ0RlbGF5Tm9kZScsICdkZWxheVRpbWUnOiB7ICd2YWx1ZSc6IDAuMzMzMzMzMzMzMzMzMzMzMywgJ2lucHV0cyc6IFtdIH0sICdpbnB1dHMnOiBbeyAnbmFtZSc6ICdHYWluTm9kZScsICdnYWluJzogeyAndmFsdWUnOiAwLjMzMzMzMzMzMzMzMzMzMzMsICdpbnB1dHMnOiBbXSB9LCAnaW5wdXRzJzogW3sgJ25hbWUnOiAnRGVsYXlOb2RlJywgJ2RlbGF5VGltZSc6IHsgJ3ZhbHVlJzogMC4zMzMzMzMzMzMzMzMzMzMzLCAnaW5wdXRzJzogW10gfSwgJ2lucHV0cyc6IFt7ICduYW1lJzogJ0dhaW5Ob2RlJywgJ2dhaW4nOiB7ICd2YWx1ZSc6IDAuMzMzMzMzMzMzMzMzMzMzMywgJ2lucHV0cyc6IFtdIH0sICdpbnB1dHMnOiBbJzxjaXJjdWxhcjpEZWxheU5vZGU+JywgeyAnbmFtZSc6ICdPc2NpbGxhdG9yTm9kZScsICd0eXBlJzogJ3NpbmUnLCAnZnJlcXVlbmN5JzogeyAndmFsdWUnOiA0NDAsICdpbnB1dHMnOiBbXSB9LCAnZGV0dW5lJzogeyAndmFsdWUnOiAwLCAnaW5wdXRzJzogW10gfSwgJ2lucHV0cyc6IFtdIH1dIH1dIH1dIH1dIH1dIH1dIH0sIHsgJ25hbWUnOiAnR2Fpbk5vZGUnLCAnZ2Fpbic6IHsgJ3ZhbHVlJzogMC41LCAnaW5wdXRzJzogW10gfSwgJ2lucHV0cyc6IFt7ICduYW1lJzogJ0dhaW5Ob2RlJywgJ2dhaW4nOiB7ICd2YWx1ZSc6IDEsICdpbnB1dHMnOiBbXSB9LCAnaW5wdXRzJzogW3sgJ25hbWUnOiAnU3RlcmVvUGFubmVyTm9kZScsICdwYW4nOiB7ICd2YWx1ZSc6IC0xLCAnaW5wdXRzJzogW10gfSwgJ2lucHV0cyc6IFt7ICduYW1lJzogJ0RlbGF5Tm9kZScsICdkZWxheVRpbWUnOiB7ICd2YWx1ZSc6IDAuMzMzMzMzMzMzMzMzMzMzMywgJ2lucHV0cyc6IFtdIH0sICdpbnB1dHMnOiBbeyAnbmFtZSc6ICdHYWluTm9kZScsICdnYWluJzogeyAndmFsdWUnOiAwLjMzMzMzMzMzMzMzMzMzMzMsICdpbnB1dHMnOiBbXSB9LCAnaW5wdXRzJzogW3sgJ25hbWUnOiAnRGVsYXlOb2RlJywgJ2RlbGF5VGltZSc6IHsgJ3ZhbHVlJzogMC4zMzMzMzMzMzMzMzMzMzMzLCAnaW5wdXRzJzogW10gfSwgJ2lucHV0cyc6IFt7ICduYW1lJzogJ0dhaW5Ob2RlJywgJ2dhaW4nOiB7ICd2YWx1ZSc6IDAuMzMzMzMzMzMzMzMzMzMzMywgJ2lucHV0cyc6IFtdIH0sICdpbnB1dHMnOiBbJzxjaXJjdWxhcjpEZWxheU5vZGU+J10gfV0gfSwgeyAnbmFtZSc6ICdPc2NpbGxhdG9yTm9kZScsICd0eXBlJzogJ3NpbmUnLCAnZnJlcXVlbmN5JzogeyAndmFsdWUnOiA0NDAsICdpbnB1dHMnOiBbXSB9LCAnZGV0dW5lJzogeyAndmFsdWUnOiAwLCAnaW5wdXRzJzogW10gfSwgJ2lucHV0cyc6IFtdIH1dIH1dIH1dIH0sIHsgJ25hbWUnOiAnU3RlcmVvUGFubmVyTm9kZScsICdwYW4nOiB7ICd2YWx1ZSc6IDEsICdpbnB1dHMnOiBbXSB9LCAnaW5wdXRzJzogW3sgJ25hbWUnOiAnRGVsYXlOb2RlJywgJ2RlbGF5VGltZSc6IHsgJ3ZhbHVlJzogMC4zMzMzMzMzMzMzMzMzMzMzLCAnaW5wdXRzJzogW10gfSwgJ2lucHV0cyc6IFt7ICduYW1lJzogJ0dhaW5Ob2RlJywgJ2dhaW4nOiB7ICd2YWx1ZSc6IDAuMzMzMzMzMzMzMzMzMzMzMywgJ2lucHV0cyc6IFtdIH0sICdpbnB1dHMnOiBbeyAnbmFtZSc6ICdEZWxheU5vZGUnLCAnZGVsYXlUaW1lJzogeyAndmFsdWUnOiAwLjMzMzMzMzMzMzMzMzMzMzMsICdpbnB1dHMnOiBbXSB9LCAnaW5wdXRzJzogW3sgJ25hbWUnOiAnR2Fpbk5vZGUnLCAnZ2Fpbic6IHsgJ3ZhbHVlJzogMC4zMzMzMzMzMzMzMzMzMzMzLCAnaW5wdXRzJzogW10gfSwgJ2lucHV0cyc6IFsnPGNpcmN1bGFyOkRlbGF5Tm9kZT4nLCB7ICduYW1lJzogJ09zY2lsbGF0b3JOb2RlJywgJ3R5cGUnOiAnc2luZScsICdmcmVxdWVuY3knOiB7ICd2YWx1ZSc6IDQ0MCwgJ2lucHV0cyc6IFtdIH0sICdkZXR1bmUnOiB7ICd2YWx1ZSc6IDAsICdpbnB1dHMnOiBbXSB9LCAnaW5wdXRzJzogW10gfV0gfV0gfV0gfV0gfV0gfV0gfV0gfV0gfSkpLnRvQmUodHJ1ZSk7XG4gIH0pO1xufSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk5b2IyMWxMMkl2WkdWMkwzWnBjblIxWVd3dFlYVmthVzh0WjNKaGNHZ3ZjM0JsWXk5MmFYSjBkV0ZzUVhWa2FXOUhjbUZ3YUM1a1pXWnBibVZPYjJSbExtcHpJbDBzSW01aGJXVnpJanBiWFN3aWJXRndjR2x1WjNNaU9pSTdPMlZCUVdsQ0xFOUJRVThzUTBGQlF5eFBRVUZQTEVOQlFVTTdPMGxCUVRGQ0xFMUJRVTBzV1VGQlRpeE5RVUZOT3p0QlFVTmlMRWxCUVUwc2FVSkJRV2xDTEVkQlFVY3NUMEZCVHl4RFFVRkRMR2xDUVVGcFFpeERRVUZETEVOQlFVTTdRVUZEY2tRc1NVRkJUU3haUVVGWkxFZEJRVWNzVDBGQlR5eERRVUZETEhOQ1FVRnpRaXhEUVVGRExFTkJRVU03TzBGQlJYSkVMRWxCUVUwc2JVSkJRVzFDTEVkQlFVY3NRMEZETVVJN1FVRkRSU3hKUVVGRkxFVkJRVVVzUTBGQlF6dEJRVU5NTEUxQlFVa3NSVUZCUlN4alFVRmpPMEZCUTNCQ0xGRkJRVTBzUlVGQlJTeFJRVUZSTzBGQlEyaENMRkZCUVUwc1JVRkJSVHRCUVVOT0xFOUJRVWNzUlVGQlJTeERRVUZETEVOQlFVTTdSMEZEVWp0RFFVTkdMRVZCUTBRN1FVRkRSU3hKUVVGRkxFVkJRVVVzUTBGQlF6dEJRVU5NTEUxQlFVa3NSVUZCUlN4alFVRmpPMEZCUTNCQ0xGRkJRVTBzUlVGQlJTeFJRVUZSTzBGQlEyaENMRkZCUVUwc1JVRkJSVHRCUVVOT0xFOUJRVWNzUlVGQlJTeERRVUZETzBkQlExQTdRMEZEUml4RlFVTkVPMEZCUTBVc1NVRkJSU3hGUVVGRkxFTkJRVU03UVVGRFRDeE5RVUZKTEVWQlFVVXNUMEZCVHp0QlFVTmlMRkZCUVUwc1JVRkJSU3hEUVVGRExFTkJRVU1zUlVGQlJTeERRVUZETEVOQlFVTTdRVUZEWkN4UlFVRk5MRVZCUVVVN1FVRkRUaXhuUWtGQldTeEZRVUZGTEVOQlFVTXNSMEZCUnl4RFFVRkRPMEZCUTI1Q0xHRkJRVk1zUlVGQlJTeERRVUZETEVkQlFVY3NRMEZCUXp0SFFVTnFRanREUVVOR0xFVkJRMFE3UVVGRFJTeEpRVUZGTEVWQlFVVXNRMEZCUXp0QlFVTk1MRTFCUVVrc1JVRkJSU3hOUVVGTk8wRkJRMW9zVVVGQlRTeEZRVUZGTEVOQlFVTTdRVUZEVkN4UlFVRk5MRVZCUVVVN1FVRkRUaXhSUVVGSkxFVkJRVVVzUTBGQlF5eEhRVUZITEVOQlFVTTdSMEZEV2p0RFFVTkdMRVZCUTBRN1FVRkRSU3hKUVVGRkxFVkJRVVVzUTBGQlF6dEJRVU5NTEUxQlFVa3NSVUZCUlN4UFFVRlBPMEZCUTJJc1VVRkJUU3hGUVVGRkxFTkJRVU1zUTBGQlF5eEZRVUZGTEVOQlFVTXNRMEZCUXp0QlFVTmtMRkZCUVUwc1JVRkJSVHRCUVVOT0xHZENRVUZaTEVWQlFVVXNRMEZCUXl4SFFVRkhMRU5CUVVNN1FVRkRia0lzWVVGQlV5eEZRVUZGTEVOQlFVTXNSMEZCUnl4RFFVRkRPMGRCUTJwQ08wTkJRMFlzUlVGRFJEdEJRVU5GTEVsQlFVVXNSVUZCUlN4RFFVRkRPMEZCUTB3c1QwRkJTeXhGUVVGRkxFOUJRVTg3UVVGRFpDeE5RVUZKTEVWQlFVVXNUVUZCVFR0QlFVTmFMRkZCUVUwc1JVRkJSU3hEUVVGRE8wRkJRMVFzVVVGQlRTeEZRVUZGTzBGQlEwNHNVVUZCU1N4RlFVRkZMRU5CUVVNc1IwRkJSeXhEUVVGRE8wZEJRMW83UTBGRFJpeERRVU5HTEVOQlFVTTdPMEZCUlVZc1VVRkJVU3hEUVVGRExEaENRVUU0UWl4RlFVRkZMRmxCUVUwN1FVRkROME1zVFVGQlNTeHBRa0ZCYVVJc1dVRkJRU3hEUVVGRE96dEJRVVYwUWl4WlFVRlZMRU5CUVVNc1dVRkJUVHRCUVVObUxIRkNRVUZwUWl4SFFVRkhMRWxCUVVrc2FVSkJRV2xDTEVOQlFVTTdRVUZEZUVNc2EwSkJRVmtzUlVGQldpeFpRVUZaTzBGQlExb3NXVUZCVFN4RlFVRkZMRmxCUVZrc1EwRkJReXhYUVVGWE8wdEJRMnBETEVOQlFVTXNRMEZCUXp0SFFVTktMRU5CUVVNc1EwRkJRenM3UVVGRlNDeEpRVUZGTEVOQlFVTXNaMEpCUVdkQ0xFVkJRVVVzV1VGQlRUdEJRVU42UWl4VlFVRk5MRU5CUVVNc2FVSkJRV2xDTEVOQlFVTXNWVUZCVlN4RFFVRkRMRzFDUVVGdFFpeEZRVUZGTEdWQlFXVXNRMEZCUXl4RFFVRkRMRU5CUVVNc1NVRkJTU3hEUVVGRExHbENRVUZwUWl4RFFVRkRMRU5CUVVNN1IwRkRjRWNzUTBGQlF5eERRVUZET3p0QlFVVklMRWxCUVVVc1EwRkJReXcwUTBGQk5FTXNSVUZCUlN4WlFVRk5PMEZCUTNKRUxGVkJRVTBzUTBGQlF6dGhRVUZOTEdsQ1FVRnBRaXhEUVVGRExGVkJRVlVzUTBGQlF5eHRRa0ZCYlVJc1JVRkJSU3hOUVVGTkxFTkJRVU03UzBGQlFTeERRVUZETEVOQlFVTXNUMEZCVHl4RlFVRkZMRU5CUVVNN1IwRkRia1lzUTBGQlF5eERRVUZET3p0QlFVVklMRWxCUVVVc1EwRkJReXhyUTBGQmEwTXNSVUZCUlN4WlFVRk5PMEZCUXpORExIRkNRVUZwUWl4RFFVRkRMRlZCUVZVc1EwRkJReXh0UWtGQmJVSXNSVUZCUlN4bFFVRmxMRU5CUVVNc1EwRkJRenM3UVVGRmJrVXNWVUZCVFN4RFFVRkRMRTlCUVU4c2FVSkJRV2xDTEVOQlFVTXNWMEZCVnl4RFFVRkRMR0ZCUVdFc1EwRkJReXhEUVVGRExFbEJRVWtzUTBGQlF5eFZRVUZWTEVOQlFVTXNRMEZCUXp0SFFVTTNSU3hEUVVGRExFTkJRVU03TzBGQlJVZ3NTVUZCUlN4RFFVRkRMSFZGUVVGMVJTeEZRVUZGTEZsQlFVMDdRVUZEYUVZc2NVSkJRV2xDTEVOQlFVTXNWVUZCVlN4RFFVRkRMRzFDUVVGdFFpeEZRVUZGTEdWQlFXVXNRMEZCUXl4RFFVRkRPenRCUVVWdVJTeFJRVUZOTEdsQ1FVRnBRaXhIUVVGSExFTkJRM2hDTzBGQlEwVXNVVUZCUlN4RlFVRkZMRU5CUVVNN1FVRkRUQ3hWUVVGSkxFVkJRVVVzVFVGQlRUdEJRVU5hTEZsQlFVMHNSVUZCUlN4UlFVRlJPMEZCUTJoQ0xGbEJRVTBzUlVGQlJUdEJRVU5PTEZsQlFVa3NSVUZCUlN4SFFVRkhPMDlCUTFZN1MwRkRSaXhGUVVORU8wRkJRMFVzVVVGQlJTeEZRVUZGTEVOQlFVTTdRVUZEVEN4VlFVRkpMRVZCUVVVc1pVRkJaVHRCUVVOeVFpeFpRVUZOTEVWQlFVVXNRMEZCUXp0TFFVTldMRVZCUTBRN1FVRkRSU3hSUVVGRkxFVkJRVVVzUTBGQlF6dEJRVU5NTEZWQlFVa3NSVUZCUlN4WlFVRlpPMEZCUTJ4Q0xGbEJRVTBzUlVGQlJTeERRVUZETzB0QlExWXNRMEZEUml4RFFVRkRPenRCUVVWS0xGRkJRVTBzYTBKQlFXdENMRWRCUVVjN1FVRkRla0lzVlVGQlNTeEZRVUZGTEhOQ1FVRnpRanRCUVVNMVFpeFpRVUZOTEVWQlFVTXNRMEZEVER0QlFVTkZMRmxCUVVrc1JVRkJSU3hWUVVGVk8wRkJRMmhDTEZsQlFVa3NSVUZCUlR0QlFVTktMR1ZCUVVzc1JVRkJSU3hIUVVGSE8wRkJRMVlzWjBKQlFVMHNSVUZCUlN4RlFVRkZPMU5CUTFnN1FVRkRSQ3hqUVVGTkxFVkJRVVVzUTBGRFRqdEJRVU5GTEdOQlFVa3NSVUZCUlN4clFrRkJhMEk3UVVGRGVFSXNZVUZCUnl4RlFVRkZPMEZCUTBnc2FVSkJRVXNzUlVGQlJTeERRVUZETEVOQlFVTTdRVUZEVkN4clFrRkJUU3hGUVVGRkxFVkJRVVU3VjBGRFdEdEJRVU5FTEdkQ1FVRk5MRVZCUVVVc1EwRkRUanRCUVVORkxHZENRVUZKTEVWQlFVVXNWMEZCVnp0QlFVTnFRaXh4UWtGQlV5eEZRVUZGTzBGQlExUXNiVUpCUVVzc1JVRkJSU3hyUWtGQmEwSTdRVUZEZWtJc2IwSkJRVTBzUlVGQlJTeEZRVUZGTzJGQlExZzdRVUZEUkN4clFrRkJUU3hGUVVGRkxFTkJRMDQ3UVVGRFJTeHJRa0ZCU1N4RlFVRkZMRlZCUVZVN1FVRkRhRUlzYTBKQlFVa3NSVUZCUlR0QlFVTktMSEZDUVVGTExFVkJRVVVzYTBKQlFXdENPMEZCUTNwQ0xITkNRVUZOTEVWQlFVVXNSVUZCUlR0bFFVTllPMEZCUTBRc2IwSkJRVTBzUlVGQlJTeERRVU5PTzBGQlEwVXNiMEpCUVVrc1JVRkJSU3hYUVVGWE8wRkJRMnBDTEhsQ1FVRlRMRVZCUVVVN1FVRkRWQ3gxUWtGQlN5eEZRVUZGTEd0Q1FVRnJRanRCUVVONlFpeDNRa0ZCVFN4RlFVRkZMRVZCUVVVN2FVSkJRMWc3UVVGRFJDeHpRa0ZCVFN4RlFVRkZMRU5CUTA0N1FVRkRSU3h6UWtGQlNTeEZRVUZGTEZWQlFWVTdRVUZEYUVJc2MwSkJRVWtzUlVGQlJUdEJRVU5LTEhsQ1FVRkxMRVZCUVVVc2EwSkJRV3RDTzBGQlEzcENMREJDUVVGTkxFVkJRVVVzUlVGQlJUdHRRa0ZEV0R0QlFVTkVMSGRDUVVGTkxFVkJRVVVzUTBGQlF5eHpRa0ZCYzBJc1EwRkJRenRwUWtGRGFrTXNRMEZEUmp0bFFVTkdMRVZCUTBRN1FVRkRSU3h2UWtGQlNTeEZRVUZGTEdkQ1FVRm5RanRCUVVOMFFpeHZRa0ZCU1N4RlFVRkZMRTFCUVUwN1FVRkRXaXg1UWtGQlV5eEZRVUZGTzBGQlExUXNkVUpCUVVzc1JVRkJSU3hIUVVGSE8wRkJRMVlzZDBKQlFVMHNSVUZCUlN4RlFVRkZPMmxDUVVOWU8wRkJRMFFzYzBKQlFVMHNSVUZCUlR0QlFVTk9MSFZDUVVGTExFVkJRVVVzUTBGQlF6dEJRVU5TTEhkQ1FVRk5MRVZCUVVVc1JVRkJSVHRwUWtGRFdEdEJRVU5FTEhOQ1FVRk5MRVZCUVVVc1JVRkJSVHRsUVVOWUxFTkJRMFk3WVVGRFJpeERRVU5HTzFkQlEwWXNRMEZEUmp0VFFVTkdMRVZCUTBRN1FVRkRSU3hqUVVGSkxFVkJRVVVzYTBKQlFXdENPMEZCUTNoQ0xHRkJRVWNzUlVGQlJUdEJRVU5JTEdsQ1FVRkxMRVZCUVVVc1EwRkJRenRCUVVOU0xHdENRVUZOTEVWQlFVVXNSVUZCUlR0WFFVTllPMEZCUTBRc1owSkJRVTBzUlVGQlJTeERRVU5PTzBGQlEwVXNaMEpCUVVrc1JVRkJSU3hYUVVGWE8wRkJRMnBDTEhGQ1FVRlRMRVZCUVVVN1FVRkRWQ3h0UWtGQlN5eEZRVUZGTEd0Q1FVRnJRanRCUVVONlFpeHZRa0ZCVFN4RlFVRkZMRVZCUVVVN1lVRkRXRHRCUVVORUxHdENRVUZOTEVWQlFVVXNRMEZEVGp0QlFVTkZMR3RDUVVGSkxFVkJRVVVzVlVGQlZUdEJRVU5vUWl4clFrRkJTU3hGUVVGRk8wRkJRMG9zY1VKQlFVc3NSVUZCUlN4clFrRkJhMEk3UVVGRGVrSXNjMEpCUVUwc1JVRkJSU3hGUVVGRk8yVkJRMWc3UVVGRFJDeHZRa0ZCVFN4RlFVRkZMRU5CUTA0N1FVRkRSU3h2UWtGQlNTeEZRVUZGTEZkQlFWYzdRVUZEYWtJc2VVSkJRVk1zUlVGQlJUdEJRVU5VTEhWQ1FVRkxMRVZCUVVVc2EwSkJRV3RDTzBGQlEzcENMSGRDUVVGTkxFVkJRVVVzUlVGQlJUdHBRa0ZEV0R0QlFVTkVMSE5DUVVGTkxFVkJRVVVzUTBGRFRqdEJRVU5GTEhOQ1FVRkpMRVZCUVVVc1ZVRkJWVHRCUVVOb1FpeHpRa0ZCU1N4RlFVRkZPMEZCUTBvc2VVSkJRVXNzUlVGQlJTeHJRa0ZCYTBJN1FVRkRla0lzTUVKQlFVMHNSVUZCUlN4RlFVRkZPMjFDUVVOWU8wRkJRMFFzZDBKQlFVMHNSVUZCUlN4RFFVTk9MSE5DUVVGelFpeEZRVU4wUWp0QlFVTkZMSGRDUVVGSkxFVkJRVVVzWjBKQlFXZENPMEZCUTNSQ0xIZENRVUZKTEVWQlFVVXNUVUZCVFR0QlFVTmFMRFpDUVVGVExFVkJRVVU3UVVGRFZDd3lRa0ZCU3l4RlFVRkZMRWRCUVVjN1FVRkRWaXcwUWtGQlRTeEZRVUZGTEVWQlFVVTdjVUpCUTFnN1FVRkRSQ3d3UWtGQlRTeEZRVUZGTzBGQlEwNHNNa0pCUVVzc1JVRkJSU3hEUVVGRE8wRkJRMUlzTkVKQlFVMHNSVUZCUlN4RlFVRkZPM0ZDUVVOWU8wRkJRMFFzTUVKQlFVMHNSVUZCUlN4RlFVRkZPMjFDUVVOWUxFTkJRMFk3YVVKQlEwWXNRMEZEUmp0bFFVTkdMRU5CUTBZN1lVRkRSaXhEUVVOR08xZEJRMFlzUTBGRFJqdFRRVU5HTEVOQlEwWTdUMEZEUml4RFFVTkdPMHRCUTBZc1EwRkJRenM3UVVGRlFTeFZRVUZOTEVOQlFVTXNhVUpCUVdsQ0xFTkJRVU1zVFVGQlRTeERRVUZETEdsQ1FVRnBRaXhEUVVGRExFTkJRVU1zUTBGQlF5eEpRVUZKTEVOQlFVTXNhVUpCUVdsQ0xFTkJRVU1zUTBGQlF6dEJRVU0xUlN4VlFVRk5MRU5CUVVNc1RVRkJUU3hEUVVGRExGbEJRVmtzUTBGQlF5eE5RVUZOTEVWQlFVVXNSVUZCUlN4clFrRkJhMElzUTBGQlF5eERRVUZETEVOQlFVTXNTVUZCU1N4RFFVRkRMRWxCUVVrc1EwRkJReXhEUVVGRE8wZEJRM1JGTEVOQlFVTXNRMEZCUXpzN1FVRkZTQ3hKUVVGRkxFTkJRVU1zYzBSQlFYTkVMRVZCUVVVc1dVRkJUVHRCUVVNdlJDeHhRa0ZCYVVJc1EwRkJReXhWUVVGVkxFTkJRVU1zYlVKQlFXMUNMRVZCUVVVc1pVRkJaU3hEUVVGRExFTkJRVU03TzBGQlJXNUZMRkZCUVUwc2QwSkJRWGRDTEVkQlFVY3NRMEZETDBJN1FVRkRSU3hSUVVGRkxFVkJRVVVzUTBGQlF6dEJRVU5NTEZWQlFVa3NSVUZCUlN4TlFVRk5PMEZCUTFvc1dVRkJUU3hGUVVGRkxGRkJRVkU3UzBGRGFrSXNSVUZEUkR0QlFVTkZMRkZCUVVVc1JVRkJSU3hEUVVGRE8wRkJRMHdzVlVGQlNTeEZRVUZGTEdWQlFXVTdRVUZEY2tJc1dVRkJUU3hGUVVGRkxFTkJRVU03UzBGRFZpeEZRVU5FTzBGQlEwVXNVVUZCUlN4RlFVRkZMRU5CUVVNN1FVRkRUQ3hWUVVGSkxFVkJRVVVzV1VGQldUdEJRVU5zUWl4WlFVRk5MRVZCUVVVc1EwRkJRenRMUVVOV0xFTkJRMFlzUTBGQlF6czdRVUZGUml4eFFrRkJhVUlzUTBGQlF5eFZRVUZWTEVOQlFVTXNkMEpCUVhkQ0xFVkJRVVVzYjBKQlFXOUNMRU5CUVVNc1EwRkJRenM3UVVGRk4wVXNVVUZCVFN4cFFrRkJhVUlzUjBGQlJ5eERRVU40UWp0QlFVTkZMRkZCUVVVc1JVRkJSU3hEUVVGRE8wRkJRMHdzVlVGQlNTeEZRVUZGTEUxQlFVMDdRVUZEV2l4WlFVRk5MRVZCUVVVc1VVRkJVVHRCUVVOb1FpeFpRVUZOTEVWQlFVVTdRVUZEVGl4WlFVRkpMRVZCUVVVc1IwRkJSenRQUVVOV08wdEJRMFlzUlVGRFJEdEJRVU5GTEZGQlFVVXNSVUZCUlN4RFFVRkRPMEZCUTB3c1ZVRkJTU3hGUVVGRkxHOUNRVUZ2UWp0QlFVTXhRaXhaUVVGTkxFVkJRVVVzUTBGQlF6dExRVU5XTEVWQlEwUTdRVUZEUlN4UlFVRkZMRVZCUVVVc1EwRkJRenRCUVVOTUxGVkJRVWtzUlVGQlJTeGxRVUZsTzBGQlEzSkNMRmxCUVUwc1JVRkJSU3hEUVVGRE8wdEJRMVlzUlVGRFJEdEJRVU5GTEZGQlFVVXNSVUZCUlN4RFFVRkRPMEZCUTB3c1ZVRkJTU3hGUVVGRkxGbEJRVms3UVVGRGJFSXNXVUZCVFN4RlFVRkZMRU5CUVVNN1MwRkRWaXhEUVVOR0xFTkJRVU03TzBGQlJVWXNWVUZCVFN4RFFVRkRMR2xDUVVGcFFpeERRVUZETEUxQlFVMHNRMEZCUXl4cFFrRkJhVUlzUTBGQlF5eERRVUZETEVOQlFVTXNTVUZCU1N4RFFVRkRMR2xDUVVGcFFpeERRVUZETEVOQlFVTTdRVUZETlVVc1ZVRkJUU3hEUVVGRExFMUJRVTBzUTBGQlF5eFpRVUZaTEVOQlFVTXNUVUZCVFN4RlFVRkZMRVZCUVVVc1JVRkJReXhOUVVGTkxFVkJRVU1zYzBKQlFYTkNMRVZCUVVNc1VVRkJVU3hGUVVGRExFTkJRVU1zUlVGQlF5eE5RVUZOTEVWQlFVTXNWVUZCVlN4RlFVRkRMRTFCUVUwc1JVRkJReXhGUVVGRExFOUJRVThzUlVGQlF5eEhRVUZITEVWQlFVTXNVVUZCVVN4RlFVRkRMRVZCUVVVc1JVRkJReXhGUVVGRExGRkJRVkVzUlVGQlF5eERRVUZETEVWQlFVTXNUVUZCVFN4RlFVRkRMR3RDUVVGclFpeEZRVUZETEV0QlFVc3NSVUZCUXl4RlFVRkRMRTlCUVU4c1JVRkJReXhEUVVGRExFTkJRVU1zUlVGQlF5eFJRVUZSTEVWQlFVTXNSVUZCUlN4RlFVRkRMRVZCUVVNc1VVRkJVU3hGUVVGRExFTkJRVU1zUlVGQlF5eE5RVUZOTEVWQlFVTXNWMEZCVnl4RlFVRkRMRmRCUVZjc1JVRkJReXhGUVVGRExFOUJRVThzUlVGQlF5eHJRa0ZCYTBJc1JVRkJReXhSUVVGUkxFVkJRVU1zUlVGQlJTeEZRVUZETEVWQlFVTXNVVUZCVVN4RlFVRkRMRU5CUVVNc1JVRkJReXhOUVVGTkxFVkJRVU1zVlVGQlZTeEZRVUZETEUxQlFVMHNSVUZCUXl4RlFVRkRMRTlCUVU4c1JVRkJReXhyUWtGQmEwSXNSVUZCUXl4UlFVRlJMRVZCUVVNc1JVRkJSU3hGUVVGRExFVkJRVU1zVVVGQlVTeEZRVUZETEVOQlFVTXNSVUZCUXl4TlFVRk5MRVZCUVVNc1YwRkJWeXhGUVVGRExGZEJRVmNzUlVGQlF5eEZRVUZETEU5QlFVOHNSVUZCUXl4clFrRkJhMElzUlVGQlF5eFJRVUZSTEVWQlFVTXNSVUZCUlN4RlFVRkRMRVZCUVVNc1VVRkJVU3hGUVVGRExFTkJRVU1zUlVGQlF5eE5RVUZOTEVWQlFVTXNWVUZCVlN4RlFVRkRMRTFCUVUwc1JVRkJReXhGUVVGRExFOUJRVThzUlVGQlF5eHJRa0ZCYTBJc1JVRkJReXhSUVVGUkxFVkJRVU1zUlVGQlJTeEZRVUZETEVWQlFVTXNVVUZCVVN4RlFVRkRMRU5CUVVNc2MwSkJRWE5DTEVOQlFVTXNSVUZCUXl4RFFVRkRMRVZCUVVNc1JVRkJReXhGUVVGRExFMUJRVTBzUlVGQlF5eG5Ra0ZCWjBJc1JVRkJReXhOUVVGTkxFVkJRVU1zVFVGQlRTeEZRVUZETEZkQlFWY3NSVUZCUXl4RlFVRkRMRTlCUVU4c1JVRkJReXhIUVVGSExFVkJRVU1zVVVGQlVTeEZRVUZETEVWQlFVVXNSVUZCUXl4RlFVRkRMRkZCUVZFc1JVRkJReXhGUVVGRExFOUJRVThzUlVGQlF5eERRVUZETEVWQlFVTXNVVUZCVVN4RlFVRkRMRVZCUVVVc1JVRkJReXhGUVVGRExGRkJRVkVzUlVGQlF5eEZRVUZGTEVWQlFVTXNRMEZCUXl4RlFVRkRMRU5CUVVNc1JVRkJReXhEUVVGRExFVkJRVU1zUlVGQlF5eEZRVUZETEUxQlFVMHNSVUZCUXl4clFrRkJhMElzUlVGQlF5eExRVUZMTEVWQlFVTXNSVUZCUXl4UFFVRlBMRVZCUVVNc1EwRkJReXhGUVVGRExGRkJRVkVzUlVGQlF5eEZRVUZGTEVWQlFVTXNSVUZCUXl4UlFVRlJMRVZCUVVNc1EwRkJReXhGUVVGRExFMUJRVTBzUlVGQlF5eFhRVUZYTEVWQlFVTXNWMEZCVnl4RlFVRkRMRVZCUVVNc1QwRkJUeXhGUVVGRExHdENRVUZyUWl4RlFVRkRMRkZCUVZFc1JVRkJReXhGUVVGRkxFVkJRVU1zUlVGQlF5eFJRVUZSTEVWQlFVTXNRMEZCUXl4RlFVRkRMRTFCUVUwc1JVRkJReXhWUVVGVkxFVkJRVU1zVFVGQlRTeEZRVUZETEVWQlFVTXNUMEZCVHl4RlFVRkRMR3RDUVVGclFpeEZRVUZETEZGQlFWRXNSVUZCUXl4RlFVRkZMRVZCUVVNc1JVRkJReXhSUVVGUkxFVkJRVU1zUTBGQlF5eEZRVUZETEUxQlFVMHNSVUZCUXl4WFFVRlhMRVZCUVVNc1YwRkJWeXhGUVVGRExFVkJRVU1zVDBGQlR5eEZRVUZETEd0Q1FVRnJRaXhGUVVGRExGRkJRVkVzUlVGQlF5eEZRVUZGTEVWQlFVTXNSVUZCUXl4UlFVRlJMRVZCUVVNc1EwRkJReXhGUVVGRExFMUJRVTBzUlVGQlF5eFZRVUZWTEVWQlFVTXNUVUZCVFN4RlFVRkRMRVZCUVVNc1QwRkJUeXhGUVVGRExHdENRVUZyUWl4RlFVRkRMRkZCUVZFc1JVRkJReXhGUVVGRkxFVkJRVU1zUlVGQlF5eFJRVUZSTEVWQlFVTXNRMEZCUXl4elFrRkJjMElzUlVGQlF5eEZRVUZETEUxQlFVMHNSVUZCUXl4blFrRkJaMElzUlVGQlF5eE5RVUZOTEVWQlFVTXNUVUZCVFN4RlFVRkRMRmRCUVZjc1JVRkJReXhGUVVGRExFOUJRVThzUlVGQlF5eEhRVUZITEVWQlFVTXNVVUZCVVN4RlFVRkRMRVZCUVVVc1JVRkJReXhGUVVGRExGRkJRVkVzUlVGQlF5eEZRVUZETEU5QlFVOHNSVUZCUXl4RFFVRkRMRVZCUVVNc1VVRkJVU3hGUVVGRExFVkJRVVVzUlVGQlF5eEZRVUZETEZGQlFWRXNSVUZCUXl4RlFVRkZMRVZCUVVNc1EwRkJReXhGUVVGRExFTkJRVU1zUlVGQlF5eERRVUZETEVWQlFVTXNRMEZCUXl4RlFVRkRMRU5CUVVNc1JVRkJReXhEUVVGRExFVkJRVU1zUlVGQlF5eEZRVUZETEUxQlFVMHNSVUZCUXl4VlFVRlZMRVZCUVVNc1RVRkJUU3hGUVVGRExFVkJRVU1zVDBGQlR5eEZRVUZETEVkQlFVY3NSVUZCUXl4UlFVRlJMRVZCUVVNc1JVRkJSU3hGUVVGRExFVkJRVU1zVVVGQlVTeEZRVUZETEVOQlFVTXNSVUZCUXl4TlFVRk5MRVZCUVVNc1ZVRkJWU3hGUVVGRExFMUJRVTBzUlVGQlF5eEZRVUZETEU5QlFVOHNSVUZCUXl4RFFVRkRMRVZCUVVNc1VVRkJVU3hGUVVGRExFVkJRVVVzUlVGQlF5eEZRVUZETEZGQlFWRXNSVUZCUXl4RFFVRkRMRVZCUVVNc1RVRkJUU3hGUVVGRExHdENRVUZyUWl4RlFVRkRMRXRCUVVzc1JVRkJReXhGUVVGRExFOUJRVThzUlVGQlF5eERRVUZETEVOQlFVTXNSVUZCUXl4UlFVRlJMRVZCUVVNc1JVRkJSU3hGUVVGRExFVkJRVU1zVVVGQlVTeEZRVUZETEVOQlFVTXNSVUZCUXl4TlFVRk5MRVZCUVVNc1YwRkJWeXhGUVVGRExGZEJRVmNzUlVGQlF5eEZRVUZETEU5QlFVOHNSVUZCUXl4clFrRkJhMElzUlVGQlF5eFJRVUZSTEVWQlFVTXNSVUZCUlN4RlFVRkRMRVZCUVVNc1VVRkJVU3hGUVVGRExFTkJRVU1zUlVGQlF5eE5RVUZOTEVWQlFVTXNWVUZCVlN4RlFVRkRMRTFCUVUwc1JVRkJReXhGUVVGRExFOUJRVThzUlVGQlF5eHJRa0ZCYTBJc1JVRkJReXhSUVVGUkxFVkJRVU1zUlVGQlJTeEZRVUZETEVWQlFVTXNVVUZCVVN4RlFVRkRMRU5CUVVNc1JVRkJReXhOUVVGTkxFVkJRVU1zVjBGQlZ5eEZRVUZETEZkQlFWY3NSVUZCUXl4RlFVRkRMRTlCUVU4c1JVRkJReXhyUWtGQmEwSXNSVUZCUXl4UlFVRlJMRVZCUVVNc1JVRkJSU3hGUVVGRExFVkJRVU1zVVVGQlVTeEZRVUZETEVOQlFVTXNSVUZCUXl4TlFVRk5MRVZCUVVNc1ZVRkJWU3hGUVVGRExFMUJRVTBzUlVGQlF5eEZRVUZETEU5QlFVOHNSVUZCUXl4clFrRkJhMElzUlVGQlF5eFJRVUZSTEVWQlFVTXNSVUZCUlN4RlFVRkRMRVZCUVVNc1VVRkJVU3hGUVVGRExFTkJRVU1zYzBKQlFYTkNMRU5CUVVNc1JVRkJReXhEUVVGRExFVkJRVU1zUlVGQlF5eEZRVUZETEUxQlFVMHNSVUZCUXl4blFrRkJaMElzUlVGQlF5eE5RVUZOTEVWQlFVTXNUVUZCVFN4RlFVRkRMRmRCUVZjc1JVRkJReXhGUVVGRExFOUJRVThzUlVGQlF5eEhRVUZITEVWQlFVTXNVVUZCVVN4RlFVRkRMRVZCUVVVc1JVRkJReXhGUVVGRExGRkJRVkVzUlVGQlF5eEZRVUZETEU5QlFVOHNSVUZCUXl4RFFVRkRMRVZCUVVNc1VVRkJVU3hGUVVGRExFVkJRVVVzUlVGQlF5eEZRVUZETEZGQlFWRXNSVUZCUXl4RlFVRkZMRVZCUVVNc1EwRkJReXhGUVVGRExFTkJRVU1zUlVGQlF5eERRVUZETEVWQlFVTXNSVUZCUXl4RlFVRkRMRTFCUVUwc1JVRkJReXhyUWtGQmEwSXNSVUZCUXl4TFFVRkxMRVZCUVVNc1JVRkJReXhQUVVGUExFVkJRVU1zUTBGQlF5eEZRVUZETEZGQlFWRXNSVUZCUXl4RlFVRkZMRVZCUVVNc1JVRkJReXhSUVVGUkxFVkJRVU1zUTBGQlF5eEZRVUZETEUxQlFVMHNSVUZCUXl4WFFVRlhMRVZCUVVNc1YwRkJWeXhGUVVGRExFVkJRVU1zVDBGQlR5eEZRVUZETEd0Q1FVRnJRaXhGUVVGRExGRkJRVkVzUlVGQlF5eEZRVUZGTEVWQlFVTXNSVUZCUXl4UlFVRlJMRVZCUVVNc1EwRkJReXhGUVVGRExFMUJRVTBzUlVGQlF5eFZRVUZWTEVWQlFVTXNUVUZCVFN4RlFVRkRMRVZCUVVNc1QwRkJUeXhGUVVGRExHdENRVUZyUWl4RlFVRkRMRkZCUVZFc1JVRkJReXhGUVVGRkxFVkJRVU1zUlVGQlF5eFJRVUZSTEVWQlFVTXNRMEZCUXl4RlFVRkRMRTFCUVUwc1JVRkJReXhYUVVGWExFVkJRVU1zVjBGQlZ5eEZRVUZETEVWQlFVTXNUMEZCVHl4RlFVRkRMR3RDUVVGclFpeEZRVUZETEZGQlFWRXNSVUZCUXl4RlFVRkZMRVZCUVVNc1JVRkJReXhSUVVGUkxFVkJRVU1zUTBGQlF5eEZRVUZETEUxQlFVMHNSVUZCUXl4VlFVRlZMRVZCUVVNc1RVRkJUU3hGUVVGRExFVkJRVU1zVDBGQlR5eEZRVUZETEd0Q1FVRnJRaXhGUVVGRExGRkJRVkVzUlVGQlF5eEZRVUZGTEVWQlFVTXNSVUZCUXl4UlFVRlJMRVZCUVVNc1EwRkJReXh6UWtGQmMwSXNSVUZCUXl4RlFVRkRMRTFCUVUwc1JVRkJReXhuUWtGQlowSXNSVUZCUXl4TlFVRk5MRVZCUVVNc1RVRkJUU3hGUVVGRExGZEJRVmNzUlVGQlF5eEZRVUZETEU5QlFVOHNSVUZCUXl4SFFVRkhMRVZCUVVNc1VVRkJVU3hGUVVGRExFVkJRVVVzUlVGQlF5eEZRVUZETEZGQlFWRXNSVUZCUXl4RlFVRkRMRTlCUVU4c1JVRkJReXhEUVVGRExFVkJRVU1zVVVGQlVTeEZRVUZETEVWQlFVVXNSVUZCUXl4RlFVRkRMRkZCUVZFc1JVRkJReXhGUVVGRkxFVkJRVU1zUTBGQlF5eEZRVUZETEVOQlFVTXNSVUZCUXl4RFFVRkRMRVZCUVVNc1EwRkJReXhGUVVGRExFTkJRVU1zUlVGQlF5eERRVUZETEVWQlFVTXNRMEZCUXl4RlFVRkRMRU5CUVVNc1JVRkJReXhEUVVGRExFTkJRVU1zUTBGQlF5eEpRVUZKTEVOQlFVTXNTVUZCU1N4RFFVRkRMRU5CUVVNN1IwRkRNVFZGTEVOQlFVTXNRMEZCUXp0RFFVTktMRU5CUVVNc1EwRkJReUlzSW1acGJHVWlPaUl2YUc5dFpTOWlMMlJsZGk5MmFYSjBkV0ZzTFdGMVpHbHZMV2R5WVhCb0wzTndaV012ZG1seWRIVmhiRUYxWkdsdlIzSmhjR2d1WkdWbWFXNWxUbTlrWlM1cWN5SXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJJbU52Ym5OMElIdGxjWFZoYkhOOUlEMGdjbVZ4ZFdseVpTZ25jbUZ0WkdFbktUdGNibU52Ym5OMElGWnBjblIxWVd4QmRXUnBiMGR5WVhCb0lEMGdjbVZ4ZFdseVpTZ25MaTR2YzNKakwybHVaR1Y0TG1wekp5azdYRzVqYjI1emRDQmhkV1JwYjBOdmJuUmxlSFFnUFNCeVpYRjFhWEpsS0NjdUwzUnZiMnh6TDJGMVpHbHZRMjl1ZEdWNGRDY3BPMXh1WEc1amIyNXpkQ0J3YVc1blVHOXVaMFJsYkdGNVVHRnlZVzF6SUQwZ1cxeHVJQ0I3WEc0Z0lDQWdhV1E2SURBc1hHNGdJQ0FnYm05a1pUb2dKM04wWlhKbGIxQmhibTVsY2ljc1hHNGdJQ0FnYjNWMGNIVjBPaUFuYjNWMGNIVjBKeXhjYmlBZ0lDQndZWEpoYlhNNklIdGNiaUFnSUNBZ0lIQmhiam9nTFRFc1hHNGdJQ0FnZlZ4dUlDQjlMRnh1SUNCN1hHNGdJQ0FnYVdRNklERXNYRzRnSUNBZ2JtOWtaVG9nSjNOMFpYSmxiMUJoYm01bGNpY3NYRzRnSUNBZ2IzVjBjSFYwT2lBbmIzVjBjSFYwSnl4Y2JpQWdJQ0J3WVhKaGJYTTZJSHRjYmlBZ0lDQWdJSEJoYmpvZ01TeGNiaUFnSUNCOVhHNGdJSDBzWEc0Z0lIdGNiaUFnSUNCcFpEb2dNaXhjYmlBZ0lDQnViMlJsT2lBblpHVnNZWGtuTEZ4dUlDQWdJRzkxZEhCMWREb2dXekVzSURWZExGeHVJQ0FnSUhCaGNtRnRjem9nZTF4dUlDQWdJQ0FnYldGNFJHVnNZWGxVYVcxbE9pQXhJQzhnTXl4Y2JpQWdJQ0FnSUdSbGJHRjVWR2x0WlRvZ01TQXZJRE5jYmlBZ0lDQjlMRnh1SUNCOUxGeHVJQ0I3WEc0Z0lDQWdhV1E2SURNc1hHNGdJQ0FnYm05a1pUb2dKMmRoYVc0bkxGeHVJQ0FnSUc5MWRIQjFkRG9nTWl4Y2JpQWdJQ0J3WVhKaGJYTTZJSHRjYmlBZ0lDQWdJR2RoYVc0NklERWdMeUF6TEZ4dUlDQWdJSDFjYmlBZ2ZTeGNiaUFnZTF4dUlDQWdJR2xrT2lBMExGeHVJQ0FnSUc1dlpHVTZJQ2RrWld4aGVTY3NYRzRnSUNBZ2IzVjBjSFYwT2lCYk1Dd2dNMTBzWEc0Z0lDQWdjR0Z5WVcxek9pQjdYRzRnSUNBZ0lDQnRZWGhFWld4aGVWUnBiV1U2SURFZ0x5QXpMRnh1SUNBZ0lDQWdaR1ZzWVhsVWFXMWxPaUF4SUM4Z00xeHVJQ0FnSUgwc1hHNGdJSDBzWEc0Z0lIdGNiaUFnSUNCcFpEb2dOU3hjYmlBZ0lDQnBibkIxZERvZ0oybHVjSFYwSnl4Y2JpQWdJQ0J1YjJSbE9pQW5aMkZwYmljc1hHNGdJQ0FnYjNWMGNIVjBPaUEwTEZ4dUlDQWdJSEJoY21GdGN6b2dlMXh1SUNBZ0lDQWdaMkZwYmpvZ01TQXZJRE1zWEc0Z0lDQWdmVnh1SUNCOUxGeHVYVHRjYmx4dVpHVnpZM0pwWW1Vb0ozWnBjblIxWVd4QmRXUnBiMGR5WVhCb0xtUmxabWx1WlU1dlpHVW5MQ0FvS1NBOVBpQjdYRzRnSUd4bGRDQjJhWEowZFdGc1FYVmthVzlIY21Gd2FEdGNibHh1SUNCaVpXWnZjbVZGWVdOb0tDZ3BJRDArSUh0Y2JpQWdJQ0IyYVhKMGRXRnNRWFZrYVc5SGNtRndhQ0E5SUc1bGR5QldhWEowZFdGc1FYVmthVzlIY21Gd2FDaDdYRzRnSUNBZ0lDQmhkV1JwYjBOdmJuUmxlSFFzWEc0Z0lDQWdJQ0J2ZFhSd2RYUTZJR0YxWkdsdlEyOXVkR1Y0ZEM1a1pYTjBhVzVoZEdsdmJpeGNiaUFnSUNCOUtUdGNiaUFnZlNrN1hHNWNiaUFnYVhRb0ozSmxkSFZ5Ym5NZ2FYUnpaV3htSnl3Z0tDa2dQVDRnZTF4dUlDQWdJR1Y0Y0dWamRDaDJhWEowZFdGc1FYVmthVzlIY21Gd2FDNWtaV1pwYm1WT2IyUmxLSEJwYm1kUWIyNW5SR1ZzWVhsUVlYSmhiWE1zSUNkd2FXNW5VRzl1WjBSbGJHRjVKeWtwTG5SdlFtVW9kbWx5ZEhWaGJFRjFaR2x2UjNKaGNHZ3BPMXh1SUNCOUtUdGNibHh1SUNCcGRDZ25kR2h5YjNkeklHbG1JRzVoYldVZ2NISnZkbWxrWldRZ2FYTWdZU0J6ZEdGdVpHRnlaQ0J1YjJSbEp5d2dLQ2tnUFQ0Z2UxeHVJQ0FnSUdWNGNHVmpkQ2dvS1NBOVBpQjJhWEowZFdGc1FYVmthVzlIY21Gd2FDNWtaV1pwYm1WT2IyUmxLSEJwYm1kUWIyNW5SR1ZzWVhsUVlYSmhiWE1zSUNkbllXbHVKeWtwTG5SdlZHaHliM2NvS1R0Y2JpQWdmU2s3WEc1Y2JpQWdhWFFvSjJOeVpXRjBaWE1nWVNCamRYTjBiMjBnYm05a1pTQnBiblJsY201aGJHeDVKeXdnS0NrZ1BUNGdlMXh1SUNBZ0lIWnBjblIxWVd4QmRXUnBiMGR5WVhCb0xtUmxabWx1WlU1dlpHVW9jR2x1WjFCdmJtZEVaV3hoZVZCaGNtRnRjeXdnSjNCcGJtZFFiMjVuUkdWc1lYa25LVHRjYmx4dUlDQWdJR1Y0Y0dWamRDaDBlWEJsYjJZZ2RtbHlkSFZoYkVGMVpHbHZSM0poY0dndVkzVnpkRzl0VG05a1pYTXVjR2x1WjFCdmJtZEVaV3hoZVNrdWRHOUNaU2duWm5WdVkzUnBiMjRuS1R0Y2JpQWdmU2s3WEc1Y2JpQWdhWFFvSjJOeVpXRjBaWE1nWVNCamRYTjBiMjBnYm05a1pTQjNhR2xqYUNCallXNGdZbVVnY21WMWMyVmtJR2x1SUhacGNuUjFZV3hCZFdScGIwZHlZWEJvTG5Wd1pHRjBaU2NzSUNncElEMCtJSHRjYmlBZ0lDQjJhWEowZFdGc1FYVmthVzlIY21Gd2FDNWtaV1pwYm1WT2IyUmxLSEJwYm1kUWIyNW5SR1ZzWVhsUVlYSmhiWE1zSUNkd2FXNW5VRzl1WjBSbGJHRjVKeWs3WEc1Y2JpQWdJQ0JqYjI1emRDQjJhWEowZFdGc1RtOWtaVkJoY21GdGN5QTlJRnRjYmlBZ0lDQWdJSHRjYmlBZ0lDQWdJQ0FnYVdRNklEQXNYRzRnSUNBZ0lDQWdJRzV2WkdVNklDZG5ZV2x1Snl4Y2JpQWdJQ0FnSUNBZ2IzVjBjSFYwT2lBbmIzVjBjSFYwSnl4Y2JpQWdJQ0FnSUNBZ2NHRnlZVzF6T2lCN1hHNGdJQ0FnSUNBZ0lDQWdaMkZwYmpvZ01DNDFMRnh1SUNBZ0lDQWdJQ0I5WEc0Z0lDQWdJQ0I5TEZ4dUlDQWdJQ0FnZTF4dUlDQWdJQ0FnSUNCcFpEb2dNU3hjYmlBZ0lDQWdJQ0FnYm05a1pUb2dKM0JwYm1kUWIyNW5SR1ZzWVhrbkxGeHVJQ0FnSUNBZ0lDQnZkWFJ3ZFhRNklEQXNYRzRnSUNBZ0lDQjlMRnh1SUNBZ0lDQWdlMXh1SUNBZ0lDQWdJQ0JwWkRvZ01peGNiaUFnSUNBZ0lDQWdibTlrWlRvZ0oyOXpZMmxzYkdGMGIzSW5MRnh1SUNBZ0lDQWdJQ0J2ZFhSd2RYUTZJREVzWEc0Z0lDQWdJQ0I5TEZ4dUlDQWdJRjA3WEc1Y2JpQWdZMjl1YzNRZ1pYaHdaV04wWldSQmRXUnBiMGR5WVhCb0lEMGdlMXh1SUNBZ0lHNWhiV1U2SUZ3aVFYVmthVzlFWlhOMGFXNWhkR2x2Yms1dlpHVmNJaXhjYmlBZ0lDQnBibkIxZEhNNlcxeHVJQ0FnSUNBZ2UxeHVJQ0FnSUNBZ0lDQnVZVzFsT2lCY0lrZGhhVzVPYjJSbFhDSXNYRzRnSUNBZ0lDQWdJR2RoYVc0NklIdGNiaUFnSUNBZ0lDQWdJQ0IyWVd4MVpUb2dNQzQxTEZ4dUlDQWdJQ0FnSUNBZ0lHbHVjSFYwY3pvZ1cxMWNiaUFnSUNBZ0lDQWdmU3hjYmlBZ0lDQWdJQ0FnYVc1d2RYUnpPaUJiWEc0Z0lDQWdJQ0FnSUNBZ2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnYm1GdFpUb2dYQ0pUZEdWeVpXOVFZVzV1WlhKT2IyUmxYQ0lzWEc0Z0lDQWdJQ0FnSUNBZ0lDQndZVzQ2SUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnZG1Gc2RXVTZJQzB4TEZ4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0JwYm5CMWRITTZJRnRkWEc0Z0lDQWdJQ0FnSUNBZ0lDQjlMRnh1SUNBZ0lDQWdJQ0FnSUNBZ2FXNXdkWFJ6T2lCYlhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCdVlXMWxPaUJjSWtSbGJHRjVUbTlrWlZ3aUxGeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lHUmxiR0Y1VkdsdFpUb2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnZG1Gc2RXVTZJREF1TXpNek16TXpNek16TXpNek16TXpNeXhjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUdsdWNIVjBjem9nVzExY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCOUxGeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lHbHVjSFYwY3pvZ1cxeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdlMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCdVlXMWxPaUJjSWtkaGFXNU9iMlJsWENJc1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJR2RoYVc0NklIdGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCMllXeDFaVG9nTUM0ek16TXpNek16TXpNek16TXpNek16TEZ4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJR2x1Y0hWMGN6b2dXMTFjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2ZTeGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnYVc1d2RYUnpPaUJiWEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdlMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdibUZ0WlRvZ1hDSkVaV3hoZVU1dlpHVmNJaXhjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJR1JsYkdGNVZHbHRaVG9nZTF4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCMllXeDFaVG9nTUM0ek16TXpNek16TXpNek16TXpNek16TEZ4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCcGJuQjFkSE02SUZ0ZFhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCOUxGeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2FXNXdkWFJ6T2lCYlhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lIdGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0J1WVcxbE9pQmNJa2RoYVc1T2IyUmxYQ0lzWEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1oyRnBiam9nZTF4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdkbUZzZFdVNklEQXVNek16TXpNek16TXpNek16TXpNek15eGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUdsdWNIVjBjem9nVzExY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQjlMRnh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUdsdWNIVjBjem9nVzF3aVBHTnBjbU4xYkdGeU9rUmxiR0Y1VG05a1pUNWNJbDFjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnZlZ4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnWFZ4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJSDBzWEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdlMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdibUZ0WlRvZ1hDSlBjMk5wYkd4aGRHOXlUbTlrWlZ3aUxGeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2RIbHdaVG9nWENKemFXNWxYQ0lzWEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0JtY21WeGRXVnVZM2s2SUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2RtRnNkV1U2SURRME1DeGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdhVzV3ZFhSek9pQmJYVnh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdmU3hjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJR1JsZEhWdVpUb2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0IyWVd4MVpUb2dNQ3hjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnYVc1d2RYUnpPaUJiWFZ4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnZlN4Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUdsdWNIVjBjem9nVzExY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0I5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lGMWNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJSDFjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0JkWEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJSDFjYmlBZ0lDQWdJQ0FnSUNBZ0lGMWNiaUFnSUNBZ0lDQWdJQ0I5TEZ4dUlDQWdJQ0FnSUNBZ0lIdGNiaUFnSUNBZ0lDQWdJQ0FnSUc1aGJXVTZJRndpVTNSbGNtVnZVR0Z1Ym1WeVRtOWtaVndpTEZ4dUlDQWdJQ0FnSUNBZ0lDQWdjR0Z1T2lCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUhaaGJIVmxPaUF4TEZ4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0JwYm5CMWRITTZJRnRkWEc0Z0lDQWdJQ0FnSUNBZ0lDQjlMRnh1SUNBZ0lDQWdJQ0FnSUNBZ2FXNXdkWFJ6T2lCYlhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCdVlXMWxPaUJjSWtSbGJHRjVUbTlrWlZ3aUxGeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lHUmxiR0Y1VkdsdFpUb2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnZG1Gc2RXVTZJREF1TXpNek16TXpNek16TXpNek16TXpNeXhjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUdsdWNIVjBjem9nVzExY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCOUxGeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lHbHVjSFYwY3pvZ1cxeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdlMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCdVlXMWxPaUJjSWtkaGFXNU9iMlJsWENJc1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJR2RoYVc0NklIdGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCMllXeDFaVG9nTUM0ek16TXpNek16TXpNek16TXpNek16TEZ4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJR2x1Y0hWMGN6b2dXMTFjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2ZTeGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnYVc1d2RYUnpPaUJiWEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdlMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdibUZ0WlRvZ1hDSkVaV3hoZVU1dlpHVmNJaXhjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJR1JsYkdGNVZHbHRaVG9nZTF4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCMllXeDFaVG9nTUM0ek16TXpNek16TXpNek16TXpNek16TEZ4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCcGJuQjFkSE02SUZ0ZFhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCOUxGeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2FXNXdkWFJ6T2lCYlhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lIdGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0J1WVcxbE9pQmNJa2RoYVc1T2IyUmxYQ0lzWEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1oyRnBiam9nZTF4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdkbUZzZFdVNklEQXVNek16TXpNek16TXpNek16TXpNek15eGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUdsdWNIVjBjem9nVzExY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQjlMRnh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUdsdWNIVjBjem9nVzF4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdYQ0k4WTJseVkzVnNZWEk2UkdWc1lYbE9iMlJsUGx3aUxGeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0J1WVcxbE9pQmNJazl6WTJsc2JHRjBiM0pPYjJSbFhDSXNYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lIUjVjR1U2SUZ3aWMybHVaVndpTEZ4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0JtY21WeGRXVnVZM2s2SUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCMllXeDFaVG9nTkRRd0xGeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lHbHVjSFYwY3pvZ1cxMWNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2ZTeGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1pHVjBkVzVsT2lCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2RtRnNkV1U2SURBc1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2FXNXdkWFJ6T2lCYlhWeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCOUxGeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCcGJuQjFkSE02SUZ0ZFhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0I5WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1hWeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQjlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQmRYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2ZWeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0JkWEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCOVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1hWeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNCOVhHNGdJQ0FnSUNBZ0lDQWdJQ0JkWEc0Z0lDQWdJQ0FnSUNBZ2ZWeHVJQ0FnSUNBZ0lDQmRYRzRnSUNBZ0lDQjlYRzRnSUNBZ1hWeHVJQ0I5TzF4dVhHNGdJQ0FnWlhod1pXTjBLSFpwY25SMVlXeEJkV1JwYjBkeVlYQm9MblZ3WkdGMFpTaDJhWEowZFdGc1RtOWtaVkJoY21GdGN5a3BMblJ2UW1Vb2RtbHlkSFZoYkVGMVpHbHZSM0poY0dncE8xeHVJQ0FnSUdWNGNHVmpkQ2hsY1hWaGJITW9ZWFZrYVc5RGIyNTBaWGgwTG5SdlNsTlBUaWdwTENCbGVIQmxZM1JsWkVGMVpHbHZSM0poY0dncEtTNTBiMEpsS0hSeWRXVXBPMXh1SUNCOUtUdGNibHh1SUNCcGRDZ25ZMkZ1SUdSbFptbHVaU0JoSUdOMWMzUnZiU0J1YjJSbElHSjFhV3gwSUc5bUlHOTBhR1Z5SUdOMWMzUnZiU0J1YjJSbGN5Y3NJQ2dwSUQwK0lIdGNiaUFnSUNCMmFYSjBkV0ZzUVhWa2FXOUhjbUZ3YUM1a1pXWnBibVZPYjJSbEtIQnBibWRRYjI1blJHVnNZWGxRWVhKaGJYTXNJQ2R3YVc1blVHOXVaMFJsYkdGNUp5azdYRzVjYmlBZ0lDQmpiMjV6ZENCeGRXbGxkRkJwYm1kUWIyNW5SR1ZzWVhsUVlYSmhiWE1nUFNCYlhHNGdJQ0FnSUNCN1hHNGdJQ0FnSUNBZ0lHbGtPaUF3TEZ4dUlDQWdJQ0FnSUNCdWIyUmxPaUFuWjJGcGJpY3NYRzRnSUNBZ0lDQWdJRzkxZEhCMWREb2dKMjkxZEhCMWRDY3NYRzRnSUNBZ0lDQjlMRnh1SUNBZ0lDQWdlMXh1SUNBZ0lDQWdJQ0JwWkRvZ01TeGNiaUFnSUNBZ0lDQWdibTlrWlRvZ0ozQnBibWRRYjI1blJHVnNZWGtuTEZ4dUlDQWdJQ0FnSUNCdmRYUndkWFE2SURBc1hHNGdJQ0FnSUNCOUxGeHVJQ0FnSUNBZ2UxeHVJQ0FnSUNBZ0lDQnBaRG9nTWl4Y2JpQWdJQ0FnSUNBZ2JtOWtaVG9nSjI5elkybHNiR0YwYjNJbkxGeHVJQ0FnSUNBZ0lDQnZkWFJ3ZFhRNklERXNYRzRnSUNBZ0lDQjlMRnh1SUNBZ0lGMDdYRzVjYmlBZ0lDQjJhWEowZFdGc1FYVmthVzlIY21Gd2FDNWtaV1pwYm1WT2IyUmxLSEYxYVdWMFVHbHVaMUJ2Ym1kRVpXeGhlVkJoY21GdGN5d2dKM0YxYVdWMFVHbHVaMUJ2Ym1kRVpXeGhlU2NwTzF4dVhHNGdJQ0FnWTI5dWMzUWdkbWx5ZEhWaGJFNXZaR1ZRWVhKaGJYTWdQU0JiWEc0Z0lDQWdJQ0I3WEc0Z0lDQWdJQ0FnSUdsa09pQXdMRnh1SUNBZ0lDQWdJQ0J1YjJSbE9pQW5aMkZwYmljc1hHNGdJQ0FnSUNBZ0lHOTFkSEIxZERvZ0oyOTFkSEIxZENjc1hHNGdJQ0FnSUNBZ0lIQmhjbUZ0Y3pvZ2UxeHVJQ0FnSUNBZ0lDQWdJR2RoYVc0NklEQXVOU3hjYmlBZ0lDQWdJQ0FnZlZ4dUlDQWdJQ0FnZlN4Y2JpQWdJQ0FnSUh0Y2JpQWdJQ0FnSUNBZ2FXUTZJREVzWEc0Z0lDQWdJQ0FnSUc1dlpHVTZJQ2R4ZFdsbGRGQnBibWRRYjI1blJHVnNZWGtuTEZ4dUlDQWdJQ0FnSUNCdmRYUndkWFE2SURBc1hHNGdJQ0FnSUNCOUxGeHVJQ0FnSUNBZ2UxeHVJQ0FnSUNBZ0lDQnBaRG9nTWl4Y2JpQWdJQ0FnSUNBZ2JtOWtaVG9nSjNCcGJtZFFiMjVuUkdWc1lYa25MRnh1SUNBZ0lDQWdJQ0J2ZFhSd2RYUTZJREVzWEc0Z0lDQWdJQ0I5TEZ4dUlDQWdJQ0FnZTF4dUlDQWdJQ0FnSUNCcFpEb2dNeXhjYmlBZ0lDQWdJQ0FnYm05a1pUb2dKMjl6WTJsc2JHRjBiM0luTEZ4dUlDQWdJQ0FnSUNCdmRYUndkWFE2SURJc1hHNGdJQ0FnSUNCOUxGeHVJQ0FnSUYwN1hHNWNiaUFnSUNCbGVIQmxZM1FvZG1seWRIVmhiRUYxWkdsdlIzSmhjR2d1ZFhCa1lYUmxLSFpwY25SMVlXeE9iMlJsVUdGeVlXMXpLU2t1ZEc5Q1pTaDJhWEowZFdGc1FYVmthVzlIY21Gd2FDazdYRzRnSUNBZ1pYaHdaV04wS0dWeGRXRnNjeWhoZFdScGIwTnZiblJsZUhRdWRHOUtVMDlPS0Nrc0lIdGNJbTVoYldWY0lqcGNJa0YxWkdsdlJHVnpkR2x1WVhScGIyNU9iMlJsWENJc1hDSnBibkIxZEhOY0lqcGJlMXdpYm1GdFpWd2lPbHdpUjJGcGJrNXZaR1ZjSWl4Y0ltZGhhVzVjSWpwN1hDSjJZV3gxWlZ3aU9qQXVOU3hjSW1sdWNIVjBjMXdpT2x0ZGZTeGNJbWx1Y0hWMGMxd2lPbHQ3WENKdVlXMWxYQ0k2WENKVGRHVnlaVzlRWVc1dVpYSk9iMlJsWENJc1hDSndZVzVjSWpwN1hDSjJZV3gxWlZ3aU9pMHhMRndpYVc1d2RYUnpYQ0k2VzExOUxGd2lhVzV3ZFhSelhDSTZXM3RjSW01aGJXVmNJanBjSWtSbGJHRjVUbTlrWlZ3aUxGd2laR1ZzWVhsVWFXMWxYQ0k2ZTF3aWRtRnNkV1ZjSWpvd0xqTXpNek16TXpNek16TXpNek16TXpNc1hDSnBibkIxZEhOY0lqcGJYWDBzWENKcGJuQjFkSE5jSWpwYmUxd2libUZ0WlZ3aU9sd2lSMkZwYms1dlpHVmNJaXhjSW1kaGFXNWNJanA3WENKMllXeDFaVndpT2pBdU16TXpNek16TXpNek16TXpNek16TXl4Y0ltbHVjSFYwYzF3aU9sdGRmU3hjSW1sdWNIVjBjMXdpT2x0N1hDSnVZVzFsWENJNlhDSkVaV3hoZVU1dlpHVmNJaXhjSW1SbGJHRjVWR2x0WlZ3aU9udGNJblpoYkhWbFhDSTZNQzR6TXpNek16TXpNek16TXpNek16TXpMRndpYVc1d2RYUnpYQ0k2VzExOUxGd2lhVzV3ZFhSelhDSTZXM3RjSW01aGJXVmNJanBjSWtkaGFXNU9iMlJsWENJc1hDSm5ZV2x1WENJNmUxd2lkbUZzZFdWY0lqb3dMak16TXpNek16TXpNek16TXpNek16TXNYQ0pwYm5CMWRITmNJanBiWFgwc1hDSnBibkIxZEhOY0lqcGJYQ0k4WTJseVkzVnNZWEk2UkdWc1lYbE9iMlJsUGx3aVhYMWRmU3g3WENKdVlXMWxYQ0k2WENKUGMyTnBiR3hoZEc5eVRtOWtaVndpTEZ3aWRIbHdaVndpT2x3aWMybHVaVndpTEZ3aVpuSmxjWFZsYm1ONVhDSTZlMXdpZG1Gc2RXVmNJam8wTkRBc1hDSnBibkIxZEhOY0lqcGJYWDBzWENKa1pYUjFibVZjSWpwN1hDSjJZV3gxWlZ3aU9qQXNYQ0pwYm5CMWRITmNJanBiWFgwc1hDSnBibkIxZEhOY0lqcGJYWDFkZlYxOVhYMHNlMXdpYm1GdFpWd2lPbHdpVTNSbGNtVnZVR0Z1Ym1WeVRtOWtaVndpTEZ3aWNHRnVYQ0k2ZTF3aWRtRnNkV1ZjSWpveExGd2lhVzV3ZFhSelhDSTZXMTE5TEZ3aWFXNXdkWFJ6WENJNlczdGNJbTVoYldWY0lqcGNJa1JsYkdGNVRtOWtaVndpTEZ3aVpHVnNZWGxVYVcxbFhDSTZlMXdpZG1Gc2RXVmNJam93TGpNek16TXpNek16TXpNek16TXpNek1zWENKcGJuQjFkSE5jSWpwYlhYMHNYQ0pwYm5CMWRITmNJanBiZTF3aWJtRnRaVndpT2x3aVIyRnBiazV2WkdWY0lpeGNJbWRoYVc1Y0lqcDdYQ0oyWVd4MVpWd2lPakF1TXpNek16TXpNek16TXpNek16TXpNeXhjSW1sdWNIVjBjMXdpT2x0ZGZTeGNJbWx1Y0hWMGMxd2lPbHQ3WENKdVlXMWxYQ0k2WENKRVpXeGhlVTV2WkdWY0lpeGNJbVJsYkdGNVZHbHRaVndpT250Y0luWmhiSFZsWENJNk1DNHpNek16TXpNek16TXpNek16TXpNekxGd2lhVzV3ZFhSelhDSTZXMTE5TEZ3aWFXNXdkWFJ6WENJNlczdGNJbTVoYldWY0lqcGNJa2RoYVc1T2IyUmxYQ0lzWENKbllXbHVYQ0k2ZTF3aWRtRnNkV1ZjSWpvd0xqTXpNek16TXpNek16TXpNek16TXpNc1hDSnBibkIxZEhOY0lqcGJYWDBzWENKcGJuQjFkSE5jSWpwYlhDSThZMmx5WTNWc1lYSTZSR1ZzWVhsT2IyUmxQbHdpTEh0Y0ltNWhiV1ZjSWpwY0lrOXpZMmxzYkdGMGIzSk9iMlJsWENJc1hDSjBlWEJsWENJNlhDSnphVzVsWENJc1hDSm1jbVZ4ZFdWdVkzbGNJanA3WENKMllXeDFaVndpT2pRME1DeGNJbWx1Y0hWMGMxd2lPbHRkZlN4Y0ltUmxkSFZ1WlZ3aU9udGNJblpoYkhWbFhDSTZNQ3hjSW1sdWNIVjBjMXdpT2x0ZGZTeGNJbWx1Y0hWMGMxd2lPbHRkZlYxOVhYMWRmVjE5WFgxZGZTeDdYQ0p1WVcxbFhDSTZYQ0pIWVdsdVRtOWtaVndpTEZ3aVoyRnBibHdpT250Y0luWmhiSFZsWENJNk1DNDFMRndpYVc1d2RYUnpYQ0k2VzExOUxGd2lhVzV3ZFhSelhDSTZXM3RjSW01aGJXVmNJanBjSWtkaGFXNU9iMlJsWENJc1hDSm5ZV2x1WENJNmUxd2lkbUZzZFdWY0lqb3hMRndpYVc1d2RYUnpYQ0k2VzExOUxGd2lhVzV3ZFhSelhDSTZXM3RjSW01aGJXVmNJanBjSWxOMFpYSmxiMUJoYm01bGNrNXZaR1ZjSWl4Y0luQmhibHdpT250Y0luWmhiSFZsWENJNkxURXNYQ0pwYm5CMWRITmNJanBiWFgwc1hDSnBibkIxZEhOY0lqcGJlMXdpYm1GdFpWd2lPbHdpUkdWc1lYbE9iMlJsWENJc1hDSmtaV3hoZVZScGJXVmNJanA3WENKMllXeDFaVndpT2pBdU16TXpNek16TXpNek16TXpNek16TXl4Y0ltbHVjSFYwYzF3aU9sdGRmU3hjSW1sdWNIVjBjMXdpT2x0N1hDSnVZVzFsWENJNlhDSkhZV2x1VG05a1pWd2lMRndpWjJGcGJsd2lPbnRjSW5aaGJIVmxYQ0k2TUM0ek16TXpNek16TXpNek16TXpNek16TEZ3aWFXNXdkWFJ6WENJNlcxMTlMRndpYVc1d2RYUnpYQ0k2VzN0Y0ltNWhiV1ZjSWpwY0lrUmxiR0Y1VG05a1pWd2lMRndpWkdWc1lYbFVhVzFsWENJNmUxd2lkbUZzZFdWY0lqb3dMak16TXpNek16TXpNek16TXpNek16TXNYQ0pwYm5CMWRITmNJanBiWFgwc1hDSnBibkIxZEhOY0lqcGJlMXdpYm1GdFpWd2lPbHdpUjJGcGJrNXZaR1ZjSWl4Y0ltZGhhVzVjSWpwN1hDSjJZV3gxWlZ3aU9qQXVNek16TXpNek16TXpNek16TXpNek15eGNJbWx1Y0hWMGMxd2lPbHRkZlN4Y0ltbHVjSFYwYzF3aU9sdGNJanhqYVhKamRXeGhjanBFWld4aGVVNXZaR1UrWENKZGZWMTlMSHRjSW01aGJXVmNJanBjSWs5elkybHNiR0YwYjNKT2IyUmxYQ0lzWENKMGVYQmxYQ0k2WENKemFXNWxYQ0lzWENKbWNtVnhkV1Z1WTNsY0lqcDdYQ0oyWVd4MVpWd2lPalEwTUN4Y0ltbHVjSFYwYzF3aU9sdGRmU3hjSW1SbGRIVnVaVndpT250Y0luWmhiSFZsWENJNk1DeGNJbWx1Y0hWMGMxd2lPbHRkZlN4Y0ltbHVjSFYwYzF3aU9sdGRmVjE5WFgxZGZTeDdYQ0p1WVcxbFhDSTZYQ0pUZEdWeVpXOVFZVzV1WlhKT2IyUmxYQ0lzWENKd1lXNWNJanA3WENKMllXeDFaVndpT2pFc1hDSnBibkIxZEhOY0lqcGJYWDBzWENKcGJuQjFkSE5jSWpwYmUxd2libUZ0WlZ3aU9sd2lSR1ZzWVhsT2IyUmxYQ0lzWENKa1pXeGhlVlJwYldWY0lqcDdYQ0oyWVd4MVpWd2lPakF1TXpNek16TXpNek16TXpNek16TXpNeXhjSW1sdWNIVjBjMXdpT2x0ZGZTeGNJbWx1Y0hWMGMxd2lPbHQ3WENKdVlXMWxYQ0k2WENKSFlXbHVUbTlrWlZ3aUxGd2laMkZwYmx3aU9udGNJblpoYkhWbFhDSTZNQzR6TXpNek16TXpNek16TXpNek16TXpMRndpYVc1d2RYUnpYQ0k2VzExOUxGd2lhVzV3ZFhSelhDSTZXM3RjSW01aGJXVmNJanBjSWtSbGJHRjVUbTlrWlZ3aUxGd2laR1ZzWVhsVWFXMWxYQ0k2ZTF3aWRtRnNkV1ZjSWpvd0xqTXpNek16TXpNek16TXpNek16TXpNc1hDSnBibkIxZEhOY0lqcGJYWDBzWENKcGJuQjFkSE5jSWpwYmUxd2libUZ0WlZ3aU9sd2lSMkZwYms1dlpHVmNJaXhjSW1kaGFXNWNJanA3WENKMllXeDFaVndpT2pBdU16TXpNek16TXpNek16TXpNek16TXl4Y0ltbHVjSFYwYzF3aU9sdGRmU3hjSW1sdWNIVjBjMXdpT2x0Y0lqeGphWEpqZFd4aGNqcEVaV3hoZVU1dlpHVStYQ0lzZTF3aWJtRnRaVndpT2x3aVQzTmphV3hzWVhSdmNrNXZaR1ZjSWl4Y0luUjVjR1ZjSWpwY0luTnBibVZjSWl4Y0ltWnlaWEYxWlc1amVWd2lPbnRjSW5aaGJIVmxYQ0k2TkRRd0xGd2lhVzV3ZFhSelhDSTZXMTE5TEZ3aVpHVjBkVzVsWENJNmUxd2lkbUZzZFdWY0lqb3dMRndpYVc1d2RYUnpYQ0k2VzExOUxGd2lhVzV3ZFhSelhDSTZXMTE5WFgxZGZWMTlYWDFkZlYxOVhYMWRmU2twTG5SdlFtVW9kSEoxWlNrN1hHNGdJSDBwTzF4dWZTazdYRzRpWFgwPSIsIid1c2Ugc3RyaWN0JztcblxudmFyIFZpcnR1YWxBdWRpb0dyYXBoID0gcmVxdWlyZSgnLi4vc3JjL2luZGV4LmpzJyk7XG52YXIgYXVkaW9Db250ZXh0ID0gcmVxdWlyZSgnLi90b29scy9hdWRpb0NvbnRleHQnKTtcblxuZGVzY3JpYmUoJ3ZpcnR1YWxBdWRpb0dyYXBoLnVwZGF0ZScsIGZ1bmN0aW9uICgpIHtcbiAgdmFyIHZpcnR1YWxBdWRpb0dyYXBoID0gdW5kZWZpbmVkO1xuXG4gIGJlZm9yZUVhY2goZnVuY3Rpb24gKCkge1xuICAgIHZpcnR1YWxBdWRpb0dyYXBoID0gbmV3IFZpcnR1YWxBdWRpb0dyYXBoKHtcbiAgICAgIGF1ZGlvQ29udGV4dDogYXVkaW9Db250ZXh0LFxuICAgICAgb3V0cHV0OiBhdWRpb0NvbnRleHQuZGVzdGluYXRpb25cbiAgICB9KTtcbiAgfSk7XG5cbiAgaXQoJ3JldHVybnMgaXRzZWxmJywgZnVuY3Rpb24gKCkge1xuICAgIHZhciB2aXJ0dWFsTm9kZVBhcmFtcyA9IFt7XG4gICAgICBpZDogMCxcbiAgICAgIG5vZGU6ICdvc2NpbGxhdG9yJyxcbiAgICAgIHBhcmFtczoge1xuICAgICAgICB0eXBlOiAnc3F1YXJlJ1xuICAgICAgfSxcbiAgICAgIG91dHB1dDogJ291dHB1dCdcbiAgICB9XTtcbiAgICBleHBlY3QodmlydHVhbEF1ZGlvR3JhcGgudXBkYXRlKHZpcnR1YWxOb2RlUGFyYW1zKSkudG9CZSh2aXJ0dWFsQXVkaW9HcmFwaCk7XG4gIH0pO1xuXG4gIGl0KCd0aHJvd3MgYW4gZXJyb3IgaWYgbm8gaWQgaXMgcHJvdmlkZWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHZpcnR1YWxOb2RlUGFyYW1zID0gW3tcbiAgICAgIG5vZGU6ICdnYWluJyxcbiAgICAgIG91dHB1dDogJ291dHB1dCdcbiAgICB9XTtcbiAgICBleHBlY3QoZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHZpcnR1YWxBdWRpb0dyYXBoLnVwZGF0ZSh2aXJ0dWFsTm9kZVBhcmFtcyk7XG4gICAgfSkudG9UaHJvdygpO1xuICB9KTtcblxuICBpdCgndGhyb3dzIGFuIGVycm9yIGlmIG5vIG91dHB1dCBpcyBwcm92aWRlZCcsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdmlydHVhbE5vZGVQYXJhbXMgPSBbe1xuICAgICAgbm9kZTogJ2dhaW4nLFxuICAgICAgaWQ6IDFcbiAgICB9XTtcbiAgICBleHBlY3QoZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHZpcnR1YWxBdWRpb0dyYXBoLnVwZGF0ZSh2aXJ0dWFsTm9kZVBhcmFtcyk7XG4gICAgfSkudG9UaHJvdygpO1xuICB9KTtcblxuICBpdCgndGhyb3dzIGFuIGVycm9yIHdoZW4gdmlydHVhbCBub2RlIG5hbWUgcHJvcGVydHkgaXMgbm90IHJlY29nbmlzZWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHZpcnR1YWxOb2RlUGFyYW1zID0gW3tcbiAgICAgIGlkOiAwLFxuICAgICAgbm9kZTogJ2Zvb2JhcicsXG4gICAgICBvdXRwdXQ6ICdvdXRwdXQnXG4gICAgfV07XG4gICAgZXhwZWN0KGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiB2aXJ0dWFsQXVkaW9HcmFwaC51cGRhdGUodmlydHVhbE5vZGVQYXJhbXMpO1xuICAgIH0pLnRvVGhyb3coKTtcbiAgfSk7XG5cbiAgaXQoJ2NyZWF0ZXMgc3BlY2lmaWVkIHZpcnR1YWwgbm9kZXMgYW5kIHN0b3JlcyB0aGVtIGluIHZpcnR1YWxBdWRpb0dyYXBoIHByb3BlcnR5JywgZnVuY3Rpb24gKCkge1xuICAgIHZhciB2aXJ0dWFsTm9kZVBhcmFtcyA9IFt7XG4gICAgICBpZDogMSxcbiAgICAgIG5vZGU6ICdnYWluJyxcbiAgICAgIG91dHB1dDogJ291dHB1dCdcbiAgICB9LCB7XG4gICAgICBpZDogMixcbiAgICAgIG5vZGU6ICdvc2NpbGxhdG9yJyxcbiAgICAgIG91dHB1dDogMVxuICAgIH1dO1xuICAgIHZpcnR1YWxBdWRpb0dyYXBoLnVwZGF0ZSh2aXJ0dWFsTm9kZVBhcmFtcyk7XG4gICAgZXhwZWN0KEFycmF5LmlzQXJyYXkodmlydHVhbEF1ZGlvR3JhcGgudmlydHVhbEF1ZGlvR3JhcGgpKS50b0JlKHRydWUpO1xuICAgIGV4cGVjdCh2aXJ0dWFsQXVkaW9HcmFwaC52aXJ0dWFsQXVkaW9HcmFwaC5sZW5ndGgpLnRvQmUoMik7XG4gIH0pO1xuXG4gIGl0KCdjcmVhdGVzIE9zY2lsbGF0b3JOb2RlIHdpdGggYWxsIHZhbGlkIHBhcmFtZXRlcnMnLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHBhcmFtcyA9IHtcbiAgICAgIHR5cGU6ICdzcXVhcmUnLFxuICAgICAgZnJlcXVlbmN5OiA0NDAsXG4gICAgICBkZXR1bmU6IDRcbiAgICB9O1xuXG4gICAgdmFyIHR5cGUgPSBwYXJhbXMudHlwZTtcbiAgICB2YXIgZnJlcXVlbmN5ID0gcGFyYW1zLmZyZXF1ZW5jeTtcbiAgICB2YXIgZGV0dW5lID0gcGFyYW1zLmRldHVuZTtcblxuICAgIHZhciB2aXJ0dWFsTm9kZVBhcmFtcyA9IFt7XG4gICAgICBpZDogMCxcbiAgICAgIG5vZGU6ICdvc2NpbGxhdG9yJyxcbiAgICAgIHBhcmFtczogcGFyYW1zLFxuICAgICAgb3V0cHV0OiAnb3V0cHV0J1xuICAgIH1dO1xuXG4gICAgdmlydHVhbEF1ZGlvR3JhcGgudXBkYXRlKHZpcnR1YWxOb2RlUGFyYW1zKTtcbiAgICB2YXIgYXVkaW9Ob2RlID0gdmlydHVhbEF1ZGlvR3JhcGgudmlydHVhbEF1ZGlvR3JhcGhbMF0uYXVkaW9Ob2RlO1xuICAgIGV4cGVjdChhdWRpb05vZGUuY29uc3RydWN0b3IpLnRvQmUoT3NjaWxsYXRvck5vZGUpO1xuICAgIGV4cGVjdChhdWRpb05vZGUudHlwZSkudG9CZSh0eXBlKTtcbiAgICBleHBlY3QoYXVkaW9Ob2RlLmZyZXF1ZW5jeS52YWx1ZSkudG9CZShmcmVxdWVuY3kpO1xuICAgIGV4cGVjdChhdWRpb05vZGUuZGV0dW5lLnZhbHVlKS50b0JlKGRldHVuZSk7XG4gIH0pO1xuXG4gIGl0KCdjcmVhdGVzIEdhaW5Ob2RlIHdpdGggYWxsIHZhbGlkIHBhcmFtZXRlcnMnLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGdhaW4gPSAwLjU7XG5cbiAgICB2YXIgdmlydHVhbE5vZGVQYXJhbXMgPSBbe1xuICAgICAgaWQ6IDAsXG4gICAgICBub2RlOiAnZ2FpbicsXG4gICAgICBwYXJhbXM6IHtcbiAgICAgICAgZ2FpbjogZ2FpblxuICAgICAgfSxcbiAgICAgIG91dHB1dDogJ291dHB1dCdcbiAgICB9XTtcblxuICAgIHZpcnR1YWxBdWRpb0dyYXBoLnVwZGF0ZSh2aXJ0dWFsTm9kZVBhcmFtcyk7XG4gICAgdmFyIGF1ZGlvTm9kZSA9IHZpcnR1YWxBdWRpb0dyYXBoLnZpcnR1YWxBdWRpb0dyYXBoWzBdLmF1ZGlvTm9kZTtcbiAgICBleHBlY3QoYXVkaW9Ob2RlLmNvbnN0cnVjdG9yKS50b0JlKEdhaW5Ob2RlKTtcbiAgICBleHBlY3QoYXVkaW9Ob2RlLmdhaW4udmFsdWUpLnRvQmUoZ2Fpbik7XG4gIH0pO1xuXG4gIGl0KCdjcmVhdGVzIEJpcXVhZEZpbHRlck5vZGUgd2l0aCBhbGwgdmFsaWQgcGFyYW1ldGVycycsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdHlwZSA9ICdwZWFraW5nJztcbiAgICB2YXIgZnJlcXVlbmN5ID0gNTAwO1xuICAgIHZhciBkZXR1bmUgPSA2O1xuICAgIHZhciBRID0gMC41O1xuXG4gICAgdmFyIHZpcnR1YWxOb2RlUGFyYW1zID0gW3tcbiAgICAgIGlkOiAwLFxuICAgICAgbm9kZTogJ2JpcXVhZEZpbHRlcicsXG4gICAgICBwYXJhbXM6IHtcbiAgICAgICAgdHlwZTogdHlwZSxcbiAgICAgICAgZnJlcXVlbmN5OiBmcmVxdWVuY3ksXG4gICAgICAgIGRldHVuZTogZGV0dW5lLFxuICAgICAgICBROiBRXG4gICAgICB9LFxuICAgICAgb3V0cHV0OiAnb3V0cHV0J1xuICAgIH1dO1xuXG4gICAgdmlydHVhbEF1ZGlvR3JhcGgudXBkYXRlKHZpcnR1YWxOb2RlUGFyYW1zKTtcbiAgICB2YXIgYXVkaW9Ob2RlID0gdmlydHVhbEF1ZGlvR3JhcGgudmlydHVhbEF1ZGlvR3JhcGhbMF0uYXVkaW9Ob2RlO1xuICAgIGV4cGVjdChhdWRpb05vZGUuY29uc3RydWN0b3IpLnRvQmUoQmlxdWFkRmlsdGVyTm9kZSk7XG4gICAgZXhwZWN0KGF1ZGlvTm9kZS50eXBlKS50b0JlKHR5cGUpO1xuICAgIGV4cGVjdChhdWRpb05vZGUuZnJlcXVlbmN5LnZhbHVlKS50b0JlKGZyZXF1ZW5jeSk7XG4gICAgZXhwZWN0KGF1ZGlvTm9kZS5kZXR1bmUudmFsdWUpLnRvQmUoZGV0dW5lKTtcbiAgICBleHBlY3QoYXVkaW9Ob2RlLlEudmFsdWUpLnRvQmUoUSk7XG4gIH0pO1xuXG4gIGl0KCdjcmVhdGVzIERlbGF5Tm9kZSB3aXRoIGFsbCB2YWxpZCBwYXJhbWV0ZXJzJywgZnVuY3Rpb24gKCkge1xuICAgIHZhciBkZWxheVRpbWUgPSAyO1xuICAgIHZhciBtYXhEZWxheVRpbWUgPSA1O1xuXG4gICAgdmFyIHZpcnR1YWxOb2RlUGFyYW1zID0gW3tcbiAgICAgIGlkOiAwLFxuICAgICAgbm9kZTogJ2RlbGF5JyxcbiAgICAgIHBhcmFtczoge1xuICAgICAgICBkZWxheVRpbWU6IGRlbGF5VGltZSxcbiAgICAgICAgbWF4RGVsYXlUaW1lOiBtYXhEZWxheVRpbWVcbiAgICAgIH0sXG4gICAgICBvdXRwdXQ6ICdvdXRwdXQnXG4gICAgfV07XG5cbiAgICB2aXJ0dWFsQXVkaW9HcmFwaC51cGRhdGUodmlydHVhbE5vZGVQYXJhbXMpO1xuICAgIHZhciBhdWRpb05vZGUgPSB2aXJ0dWFsQXVkaW9HcmFwaC52aXJ0dWFsQXVkaW9HcmFwaFswXS5hdWRpb05vZGU7XG4gICAgZXhwZWN0KGF1ZGlvTm9kZS5jb25zdHJ1Y3RvcikudG9CZShEZWxheU5vZGUpO1xuICAgIGV4cGVjdChhdWRpb05vZGUuZGVsYXlUaW1lLnZhbHVlKS50b0JlKGRlbGF5VGltZSk7XG4gIH0pO1xuXG4gIGl0KCdjcmVhdGVzIFN0ZXJlb1Bhbm5lck5vZGUgd2l0aCBhbGwgdmFsaWQgcGFyYW1ldGVycycsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcGFuID0gMTtcblxuICAgIHZhciB2aXJ0dWFsTm9kZVBhcmFtcyA9IFt7XG4gICAgICBpZDogMCxcbiAgICAgIG5vZGU6ICdzdGVyZW9QYW5uZXInLFxuICAgICAgcGFyYW1zOiB7XG4gICAgICAgIHBhbjogcGFuXG4gICAgICB9LFxuICAgICAgb3V0cHV0OiAnb3V0cHV0J1xuICAgIH1dO1xuXG4gICAgdmlydHVhbEF1ZGlvR3JhcGgudXBkYXRlKHZpcnR1YWxOb2RlUGFyYW1zKTtcbiAgICB2YXIgYXVkaW9Ob2RlID0gdmlydHVhbEF1ZGlvR3JhcGgudmlydHVhbEF1ZGlvR3JhcGhbMF0uYXVkaW9Ob2RlO1xuICAgIGV4cGVjdChhdWRpb05vZGUuY29uc3RydWN0b3IubmFtZSkudG9CZSgnU3RlcmVvUGFubmVyTm9kZScpO1xuICAgIGV4cGVjdChhdWRpb05vZGUucGFuLnZhbHVlKS50b0JlKHBhbik7XG4gIH0pO1xufSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk5b2IyMWxMMkl2WkdWMkwzWnBjblIxWVd3dFlYVmthVzh0WjNKaGNHZ3ZjM0JsWXk5MmFYSjBkV0ZzUVhWa2FXOUhjbUZ3YUM1MWNHUmhkR1V1YW5NaVhTd2libUZ0WlhNaU9sdGRMQ0p0WVhCd2FXNW5jeUk2SWpzN1FVRkJRU3hKUVVGTkxHbENRVUZwUWl4SFFVRkhMRTlCUVU4c1EwRkJReXhwUWtGQmFVSXNRMEZCUXl4RFFVRkRPMEZCUTNKRUxFbEJRVTBzV1VGQldTeEhRVUZITEU5QlFVOHNRMEZCUXl4elFrRkJjMElzUTBGQlF5eERRVUZET3p0QlFVVnlSQ3hSUVVGUkxFTkJRVU1zTUVKQlFUQkNMRVZCUVVVc1dVRkJUVHRCUVVONlF5eE5RVUZKTEdsQ1FVRnBRaXhaUVVGQkxFTkJRVU03TzBGQlJYUkNMRmxCUVZVc1EwRkJReXhaUVVGTk8wRkJRMllzY1VKQlFXbENMRWRCUVVjc1NVRkJTU3hwUWtGQmFVSXNRMEZCUXp0QlFVTjRReXhyUWtGQldTeEZRVUZhTEZsQlFWazdRVUZEV2l4WlFVRk5MRVZCUVVVc1dVRkJXU3hEUVVGRExGZEJRVmM3UzBGRGFrTXNRMEZCUXl4RFFVRkRPMGRCUTBvc1EwRkJReXhEUVVGRE96dEJRVVZJTEVsQlFVVXNRMEZCUXl4blFrRkJaMElzUlVGQlJTeFpRVUZOTzBGQlEzcENMRkZCUVUwc2FVSkJRV2xDTEVkQlFVY3NRMEZCUXp0QlFVTjZRaXhSUVVGRkxFVkJRVVVzUTBGQlF6dEJRVU5NTEZWQlFVa3NSVUZCUlN4WlFVRlpPMEZCUTJ4Q0xGbEJRVTBzUlVGQlJUdEJRVU5PTEZsQlFVa3NSVUZCUlN4UlFVRlJPMDlCUTJZN1FVRkRSQ3haUVVGTkxFVkJRVVVzVVVGQlVUdExRVU5xUWl4RFFVRkRMRU5CUVVNN1FVRkRTQ3hWUVVGTkxFTkJRVU1zYVVKQlFXbENMRU5CUVVNc1RVRkJUU3hEUVVGRExHbENRVUZwUWl4RFFVRkRMRU5CUVVNc1EwRkJReXhKUVVGSkxFTkJRVU1zYVVKQlFXbENMRU5CUVVNc1EwRkJRenRIUVVNM1JTeERRVUZETEVOQlFVTTdPMEZCUlVnc1NVRkJSU3hEUVVGRExITkRRVUZ6UXl4RlFVRkZMRmxCUVUwN1FVRkRMME1zVVVGQlRTeHBRa0ZCYVVJc1IwRkJSeXhEUVVGRE8wRkJRM3BDTEZWQlFVa3NSVUZCUlN4TlFVRk5PMEZCUTFvc1dVRkJUU3hGUVVGRkxGRkJRVkU3UzBGRGFrSXNRMEZCUXl4RFFVRkRPMEZCUTBnc1ZVRkJUU3hEUVVGRE8yRkJRVTBzYVVKQlFXbENMRU5CUVVNc1RVRkJUU3hEUVVGRExHbENRVUZwUWl4RFFVRkRPMHRCUVVFc1EwRkJReXhEUVVGRExFOUJRVThzUlVGQlJTeERRVUZETzBkQlEzSkZMRU5CUVVNc1EwRkJRenM3UVVGRlNDeEpRVUZGTEVOQlFVTXNNRU5CUVRCRExFVkJRVVVzV1VGQlRUdEJRVU51UkN4UlFVRk5MR2xDUVVGcFFpeEhRVUZITEVOQlFVTTdRVUZEZWtJc1ZVRkJTU3hGUVVGRkxFMUJRVTA3UVVGRFdpeFJRVUZGTEVWQlFVVXNRMEZCUXp0TFFVTk9MRU5CUVVNc1EwRkJRenRCUVVOSUxGVkJRVTBzUTBGQlF6dGhRVUZOTEdsQ1FVRnBRaXhEUVVGRExFMUJRVTBzUTBGQlF5eHBRa0ZCYVVJc1EwRkJRenRMUVVGQkxFTkJRVU1zUTBGQlF5eFBRVUZQTEVWQlFVVXNRMEZCUXp0SFFVTnlSU3hEUVVGRExFTkJRVU03TzBGQlJVZ3NTVUZCUlN4RFFVRkRMRzFGUVVGdFJTeEZRVUZGTEZsQlFVMDdRVUZETlVVc1VVRkJUU3hwUWtGQmFVSXNSMEZCUnl4RFFVRkRPMEZCUTNwQ0xGRkJRVVVzUlVGQlJTeERRVUZETzBGQlEwd3NWVUZCU1N4RlFVRkZMRkZCUVZFN1FVRkRaQ3haUVVGTkxFVkJRVVVzVVVGQlVUdExRVU5xUWl4RFFVRkRMRU5CUVVNN1FVRkRTQ3hWUVVGTkxFTkJRVU03WVVGQlRTeHBRa0ZCYVVJc1EwRkJReXhOUVVGTkxFTkJRVU1zYVVKQlFXbENMRU5CUVVNN1MwRkJRU3hEUVVGRExFTkJRVU1zVDBGQlR5eEZRVUZGTEVOQlFVTTdSMEZEY2tVc1EwRkJReXhEUVVGRE96dEJRVVZJTEVsQlFVVXNRMEZCUXl3clJVRkJLMFVzUlVGQlJTeFpRVUZOTzBGQlEzaEdMRkZCUVUwc2FVSkJRV2xDTEVkQlFVY3NRMEZCUXp0QlFVTjZRaXhSUVVGRkxFVkJRVVVzUTBGQlF6dEJRVU5NTEZWQlFVa3NSVUZCUlN4TlFVRk5PMEZCUTFvc1dVRkJUU3hGUVVGRkxGRkJRVkU3UzBGRGFrSXNSVUZEUkR0QlFVTkZMRkZCUVVVc1JVRkJSU3hEUVVGRE8wRkJRMHdzVlVGQlNTeEZRVUZGTEZsQlFWazdRVUZEYkVJc1dVRkJUU3hGUVVGRkxFTkJRVU03UzBGRFZpeERRVUZETEVOQlFVTTdRVUZEU0N4eFFrRkJhVUlzUTBGQlF5eE5RVUZOTEVOQlFVTXNhVUpCUVdsQ0xFTkJRVU1zUTBGQlF6dEJRVU0xUXl4VlFVRk5MRU5CUVVNc1MwRkJTeXhEUVVGRExFOUJRVThzUTBGQlF5eHBRa0ZCYVVJc1EwRkJReXhwUWtGQmFVSXNRMEZCUXl4RFFVRkRMRU5CUVVNc1NVRkJTU3hEUVVGRExFbEJRVWtzUTBGQlF5eERRVUZETzBGQlEzUkZMRlZCUVUwc1EwRkJReXhwUWtGQmFVSXNRMEZCUXl4cFFrRkJhVUlzUTBGQlF5eE5RVUZOTEVOQlFVTXNRMEZCUXl4SlFVRkpMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU03UjBGRE5VUXNRMEZCUXl4RFFVRkRPenRCUVVWSUxFbEJRVVVzUTBGQlF5eHJSRUZCYTBRc1JVRkJSU3haUVVGTk8wRkJRek5FTEZGQlFVMHNUVUZCVFN4SFFVRkhPMEZCUTJJc1ZVRkJTU3hGUVVGRkxGRkJRVkU3UVVGRFpDeGxRVUZUTEVWQlFVVXNSMEZCUnp0QlFVTmtMRmxCUVUwc1JVRkJSU3hEUVVGRE8wdEJRMVlzUTBGQlF6czdVVUZGU3l4SlFVRkpMRWRCUVhWQ0xFMUJRVTBzUTBGQmFrTXNTVUZCU1R0UlFVRkZMRk5CUVZNc1IwRkJXU3hOUVVGTkxFTkJRVE5DTEZOQlFWTTdVVUZCUlN4TlFVRk5MRWRCUVVrc1RVRkJUU3hEUVVGb1FpeE5RVUZOT3p0QlFVVTVRaXhSUVVGTkxHbENRVUZwUWl4SFFVRkhMRU5CUVVNN1FVRkRla0lzVVVGQlJTeEZRVUZGTEVOQlFVTTdRVUZEVEN4VlFVRkpMRVZCUVVVc1dVRkJXVHRCUVVOc1FpeFpRVUZOTEVWQlFVNHNUVUZCVFR0QlFVTk9MRmxCUVUwc1JVRkJSU3hSUVVGUk8wdEJRMnBDTEVOQlFVTXNRMEZCUXpzN1FVRkZTQ3h4UWtGQmFVSXNRMEZCUXl4TlFVRk5MRU5CUVVNc2FVSkJRV2xDTEVOQlFVTXNRMEZCUXp0QlFVTTFReXhSUVVGTkxGTkJRVk1zUjBGQlJ5eHBRa0ZCYVVJc1EwRkJReXhwUWtGQmFVSXNRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJReXhUUVVGVExFTkJRVU03UVVGRGJrVXNWVUZCVFN4RFFVRkRMRk5CUVZNc1EwRkJReXhYUVVGWExFTkJRVU1zUTBGQlF5eEpRVUZKTEVOQlFVTXNZMEZCWXl4RFFVRkRMRU5CUVVNN1FVRkRia1FzVlVGQlRTeERRVUZETEZOQlFWTXNRMEZCUXl4SlFVRkpMRU5CUVVNc1EwRkJReXhKUVVGSkxFTkJRVU1zU1VGQlNTeERRVUZETEVOQlFVTTdRVUZEYkVNc1ZVRkJUU3hEUVVGRExGTkJRVk1zUTBGQlF5eFRRVUZUTEVOQlFVTXNTMEZCU3l4RFFVRkRMRU5CUVVNc1NVRkJTU3hEUVVGRExGTkJRVk1zUTBGQlF5eERRVUZETzBGQlEyeEVMRlZCUVUwc1EwRkJReXhUUVVGVExFTkJRVU1zVFVGQlRTeERRVUZETEV0QlFVc3NRMEZCUXl4RFFVRkRMRWxCUVVrc1EwRkJReXhOUVVGTkxFTkJRVU1zUTBGQlF6dEhRVU0zUXl4RFFVRkRMRU5CUVVNN08wRkJSVWdzU1VGQlJTeERRVUZETERSRFFVRTBReXhGUVVGRkxGbEJRVTA3UVVGRGNrUXNVVUZCVFN4SlFVRkpMRWRCUVVjc1IwRkJSeXhEUVVGRE96dEJRVVZxUWl4UlFVRk5MR2xDUVVGcFFpeEhRVUZITEVOQlFVTTdRVUZEZWtJc1VVRkJSU3hGUVVGRkxFTkJRVU03UVVGRFRDeFZRVUZKTEVWQlFVVXNUVUZCVFR0QlFVTmFMRmxCUVUwc1JVRkJSVHRCUVVOT0xGbEJRVWtzUlVGQlNpeEpRVUZKTzA5QlEwdzdRVUZEUkN4WlFVRk5MRVZCUVVVc1VVRkJVVHRMUVVOcVFpeERRVUZETEVOQlFVTTdPMEZCUlVnc2NVSkJRV2xDTEVOQlFVTXNUVUZCVFN4RFFVRkRMR2xDUVVGcFFpeERRVUZETEVOQlFVTTdRVUZETlVNc1VVRkJUU3hUUVVGVExFZEJRVWNzYVVKQlFXbENMRU5CUVVNc2FVSkJRV2xDTEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNc1UwRkJVeXhEUVVGRE8wRkJRMjVGTEZWQlFVMHNRMEZCUXl4VFFVRlRMRU5CUVVNc1YwRkJWeXhEUVVGRExFTkJRVU1zU1VGQlNTeERRVUZETEZGQlFWRXNRMEZCUXl4RFFVRkRPMEZCUXpkRExGVkJRVTBzUTBGQlF5eFRRVUZUTEVOQlFVTXNTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhEUVVGRExFbEJRVWtzUTBGQlF5eEpRVUZKTEVOQlFVTXNRMEZCUXp0SFFVTjZReXhEUVVGRExFTkJRVU03TzBGQlJVZ3NTVUZCUlN4RFFVRkRMRzlFUVVGdlJDeEZRVUZGTEZsQlFVMDdRVUZETjBRc1VVRkJUU3hKUVVGSkxFZEJRVWNzVTBGQlV5eERRVUZETzBGQlEzWkNMRkZCUVUwc1UwRkJVeXhIUVVGSExFZEJRVWNzUTBGQlF6dEJRVU4wUWl4UlFVRk5MRTFCUVUwc1IwRkJSeXhEUVVGRExFTkJRVU03UVVGRGFrSXNVVUZCVFN4RFFVRkRMRWRCUVVjc1IwRkJSeXhEUVVGRE96dEJRVVZrTEZGQlFVMHNhVUpCUVdsQ0xFZEJRVWNzUTBGQlF6dEJRVU42UWl4UlFVRkZMRVZCUVVVc1EwRkJRenRCUVVOTUxGVkJRVWtzUlVGQlJTeGpRVUZqTzBGQlEzQkNMRmxCUVUwc1JVRkJSVHRCUVVOT0xGbEJRVWtzUlVGQlNpeEpRVUZKTzBGQlEwb3NhVUpCUVZNc1JVRkJWQ3hUUVVGVE8wRkJRMVFzWTBGQlRTeEZRVUZPTEUxQlFVMDdRVUZEVGl4VFFVRkRMRVZCUVVRc1EwRkJRenRQUVVOR08wRkJRMFFzV1VGQlRTeEZRVUZGTEZGQlFWRTdTMEZEYWtJc1EwRkJReXhEUVVGRE96dEJRVVZJTEhGQ1FVRnBRaXhEUVVGRExFMUJRVTBzUTBGQlF5eHBRa0ZCYVVJc1EwRkJReXhEUVVGRE8wRkJRelZETEZGQlFVMHNVMEZCVXl4SFFVRkhMR2xDUVVGcFFpeERRVUZETEdsQ1FVRnBRaXhEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETEZOQlFWTXNRMEZCUXp0QlFVTnVSU3hWUVVGTkxFTkJRVU1zVTBGQlV5eERRVUZETEZkQlFWY3NRMEZCUXl4RFFVRkRMRWxCUVVrc1EwRkJReXhuUWtGQlowSXNRMEZCUXl4RFFVRkRPMEZCUTNKRUxGVkJRVTBzUTBGQlF5eFRRVUZUTEVOQlFVTXNTVUZCU1N4RFFVRkRMRU5CUVVNc1NVRkJTU3hEUVVGRExFbEJRVWtzUTBGQlF5eERRVUZETzBGQlEyeERMRlZCUVUwc1EwRkJReXhUUVVGVExFTkJRVU1zVTBGQlV5eERRVUZETEV0QlFVc3NRMEZCUXl4RFFVRkRMRWxCUVVrc1EwRkJReXhUUVVGVExFTkJRVU1zUTBGQlF6dEJRVU5zUkN4VlFVRk5MRU5CUVVNc1UwRkJVeXhEUVVGRExFMUJRVTBzUTBGQlF5eExRVUZMTEVOQlFVTXNRMEZCUXl4SlFVRkpMRU5CUVVNc1RVRkJUU3hEUVVGRExFTkJRVU03UVVGRE5VTXNWVUZCVFN4RFFVRkRMRk5CUVZNc1EwRkJReXhEUVVGRExFTkJRVU1zUzBGQlN5eERRVUZETEVOQlFVTXNTVUZCU1N4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRE8wZEJRMjVETEVOQlFVTXNRMEZCUXpzN1FVRkZTQ3hKUVVGRkxFTkJRVU1zTmtOQlFUWkRMRVZCUVVVc1dVRkJUVHRCUVVOMFJDeFJRVUZOTEZOQlFWTXNSMEZCUnl4RFFVRkRMRU5CUVVNN1FVRkRjRUlzVVVGQlRTeFpRVUZaTEVkQlFVY3NRMEZCUXl4RFFVRkRPenRCUVVWMlFpeFJRVUZOTEdsQ1FVRnBRaXhIUVVGSExFTkJRVU03UVVGRGVrSXNVVUZCUlN4RlFVRkZMRU5CUVVNN1FVRkRUQ3hWUVVGSkxFVkJRVVVzVDBGQlR6dEJRVU5pTEZsQlFVMHNSVUZCUlR0QlFVTk9MR2xDUVVGVExFVkJRVlFzVTBGQlV6dEJRVU5VTEc5Q1FVRlpMRVZCUVZvc1dVRkJXVHRQUVVOaU8wRkJRMFFzV1VGQlRTeEZRVUZGTEZGQlFWRTdTMEZEYWtJc1EwRkJReXhEUVVGRE96dEJRVVZJTEhGQ1FVRnBRaXhEUVVGRExFMUJRVTBzUTBGQlF5eHBRa0ZCYVVJc1EwRkJReXhEUVVGRE8wRkJRelZETEZGQlFVMHNVMEZCVXl4SFFVRkhMR2xDUVVGcFFpeERRVUZETEdsQ1FVRnBRaXhEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETEZOQlFWTXNRMEZCUXp0QlFVTnVSU3hWUVVGTkxFTkJRVU1zVTBGQlV5eERRVUZETEZkQlFWY3NRMEZCUXl4RFFVRkRMRWxCUVVrc1EwRkJReXhUUVVGVExFTkJRVU1zUTBGQlF6dEJRVU01UXl4VlFVRk5MRU5CUVVNc1UwRkJVeXhEUVVGRExGTkJRVk1zUTBGQlF5eExRVUZMTEVOQlFVTXNRMEZCUXl4SlFVRkpMRU5CUVVNc1UwRkJVeXhEUVVGRExFTkJRVU03UjBGRGJrUXNRMEZCUXl4RFFVRkRPenRCUVVWSUxFbEJRVVVzUTBGQlF5eHZSRUZCYjBRc1JVRkJSU3haUVVGTk8wRkJRemRFTEZGQlFVMHNSMEZCUnl4SFFVRkhMRU5CUVVNc1EwRkJRenM3UVVGRlpDeFJRVUZOTEdsQ1FVRnBRaXhIUVVGSExFTkJRVU03UVVGRGVrSXNVVUZCUlN4RlFVRkZMRU5CUVVNN1FVRkRUQ3hWUVVGSkxFVkJRVVVzWTBGQll6dEJRVU53UWl4WlFVRk5MRVZCUVVVN1FVRkRUaXhYUVVGSExFVkJRVWdzUjBGQlJ6dFBRVU5LTzBGQlEwUXNXVUZCVFN4RlFVRkZMRkZCUVZFN1MwRkRha0lzUTBGQlF5eERRVUZET3p0QlFVVklMSEZDUVVGcFFpeERRVUZETEUxQlFVMHNRMEZCUXl4cFFrRkJhVUlzUTBGQlF5eERRVUZETzBGQlF6VkRMRkZCUVUwc1UwRkJVeXhIUVVGSExHbENRVUZwUWl4RFFVRkRMR2xDUVVGcFFpeERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRMRk5CUVZNc1EwRkJRenRCUVVOdVJTeFZRVUZOTEVOQlFVTXNVMEZCVXl4RFFVRkRMRmRCUVZjc1EwRkJReXhKUVVGSkxFTkJRVU1zUTBGQlF5eEpRVUZKTEVOQlFVTXNhMEpCUVd0Q0xFTkJRVU1zUTBGQlF6dEJRVU0xUkN4VlFVRk5MRU5CUVVNc1UwRkJVeXhEUVVGRExFZEJRVWNzUTBGQlF5eExRVUZMTEVOQlFVTXNRMEZCUXl4SlFVRkpMRU5CUVVNc1IwRkJSeXhEUVVGRExFTkJRVU03UjBGRGRrTXNRMEZCUXl4RFFVRkRPME5CUTBvc1EwRkJReXhEUVVGRElpd2labWxzWlNJNklpOW9iMjFsTDJJdlpHVjJMM1pwY25SMVlXd3RZWFZrYVc4dFozSmhjR2d2YzNCbFl5OTJhWEowZFdGc1FYVmthVzlIY21Gd2FDNTFjR1JoZEdVdWFuTWlMQ0p6YjNWeVkyVnpRMjl1ZEdWdWRDSTZXeUpqYjI1emRDQldhWEowZFdGc1FYVmthVzlIY21Gd2FDQTlJSEpsY1hWcGNtVW9KeTR1TDNOeVl5OXBibVJsZUM1cWN5Y3BPMXh1WTI5dWMzUWdZWFZrYVc5RGIyNTBaWGgwSUQwZ2NtVnhkV2x5WlNnbkxpOTBiMjlzY3k5aGRXUnBiME52Ym5SbGVIUW5LVHRjYmx4dVpHVnpZM0pwWW1Vb1hDSjJhWEowZFdGc1FYVmthVzlIY21Gd2FDNTFjR1JoZEdWY0lpd2dLQ2tnUFQ0Z2UxeHVJQ0JzWlhRZ2RtbHlkSFZoYkVGMVpHbHZSM0poY0dnN1hHNWNiaUFnWW1WbWIzSmxSV0ZqYUNnb0tTQTlQaUI3WEc0Z0lDQWdkbWx5ZEhWaGJFRjFaR2x2UjNKaGNHZ2dQU0J1WlhjZ1ZtbHlkSFZoYkVGMVpHbHZSM0poY0dnb2UxeHVJQ0FnSUNBZ1lYVmthVzlEYjI1MFpYaDBMRnh1SUNBZ0lDQWdiM1YwY0hWME9pQmhkV1JwYjBOdmJuUmxlSFF1WkdWemRHbHVZWFJwYjI0c1hHNGdJQ0FnZlNrN1hHNGdJSDBwTzF4dVhHNGdJR2wwS0NkeVpYUjFjbTV6SUdsMGMyVnNaaWNzSUNncElEMCtJSHRjYmlBZ0lDQmpiMjV6ZENCMmFYSjBkV0ZzVG05a1pWQmhjbUZ0Y3lBOUlGdDdYRzRnSUNBZ0lDQnBaRG9nTUN4Y2JpQWdJQ0FnSUc1dlpHVTZJQ2R2YzJOcGJHeGhkRzl5Snl4Y2JpQWdJQ0FnSUhCaGNtRnRjem9nZTF4dUlDQWdJQ0FnSUNCMGVYQmxPaUFuYzNGMVlYSmxKeXhjYmlBZ0lDQWdJSDBzWEc0Z0lDQWdJQ0J2ZFhSd2RYUTZJQ2R2ZFhSd2RYUW5MRnh1SUNBZ0lIMWRPMXh1SUNBZ0lHVjRjR1ZqZENoMmFYSjBkV0ZzUVhWa2FXOUhjbUZ3YUM1MWNHUmhkR1VvZG1seWRIVmhiRTV2WkdWUVlYSmhiWE1wS1M1MGIwSmxLSFpwY25SMVlXeEJkV1JwYjBkeVlYQm9LVHRjYmlBZ2ZTazdYRzVjYmlBZ2FYUW9KM1JvY205M2N5QmhiaUJsY25KdmNpQnBaaUJ1YnlCcFpDQnBjeUJ3Y205MmFXUmxaQ2NzSUNncElEMCtJSHRjYmlBZ0lDQmpiMjV6ZENCMmFYSjBkV0ZzVG05a1pWQmhjbUZ0Y3lBOUlGdDdYRzRnSUNBZ0lDQnViMlJsT2lBbloyRnBiaWNzWEc0Z0lDQWdJQ0J2ZFhSd2RYUTZJQ2R2ZFhSd2RYUW5MRnh1SUNBZ0lIMWRPMXh1SUNBZ0lHVjRjR1ZqZENnb0tTQTlQaUIyYVhKMGRXRnNRWFZrYVc5SGNtRndhQzUxY0dSaGRHVW9kbWx5ZEhWaGJFNXZaR1ZRWVhKaGJYTXBLUzUwYjFSb2NtOTNLQ2s3WEc0Z0lIMHBPMXh1WEc0Z0lHbDBLQ2QwYUhKdmQzTWdZVzRnWlhKeWIzSWdhV1lnYm04Z2IzVjBjSFYwSUdseklIQnliM1pwWkdWa0p5d2dLQ2tnUFQ0Z2UxeHVJQ0FnSUdOdmJuTjBJSFpwY25SMVlXeE9iMlJsVUdGeVlXMXpJRDBnVzN0Y2JpQWdJQ0FnSUc1dlpHVTZJQ2RuWVdsdUp5eGNiaUFnSUNBZ0lHbGtPaUF4TEZ4dUlDQWdJSDFkTzF4dUlDQWdJR1Y0Y0dWamRDZ29LU0E5UGlCMmFYSjBkV0ZzUVhWa2FXOUhjbUZ3YUM1MWNHUmhkR1VvZG1seWRIVmhiRTV2WkdWUVlYSmhiWE1wS1M1MGIxUm9jbTkzS0NrN1hHNGdJSDBwTzF4dVhHNGdJR2wwS0NkMGFISnZkM01nWVc0Z1pYSnliM0lnZDJobGJpQjJhWEowZFdGc0lHNXZaR1VnYm1GdFpTQndjbTl3WlhKMGVTQnBjeUJ1YjNRZ2NtVmpiMmR1YVhObFpDY3NJQ2dwSUQwK0lIdGNiaUFnSUNCamIyNXpkQ0IyYVhKMGRXRnNUbTlrWlZCaGNtRnRjeUE5SUZ0N1hHNGdJQ0FnSUNCcFpEb2dNQ3hjYmlBZ0lDQWdJRzV2WkdVNklDZG1iMjlpWVhJbkxGeHVJQ0FnSUNBZ2IzVjBjSFYwT2lBbmIzVjBjSFYwSnl4Y2JpQWdJQ0I5WFR0Y2JpQWdJQ0JsZUhCbFkzUW9LQ2tnUFQ0Z2RtbHlkSFZoYkVGMVpHbHZSM0poY0dndWRYQmtZWFJsS0hacGNuUjFZV3hPYjJSbFVHRnlZVzF6S1NrdWRHOVVhSEp2ZHlncE8xeHVJQ0I5S1R0Y2JseHVJQ0JwZENnblkzSmxZWFJsY3lCemNHVmphV1pwWldRZ2RtbHlkSFZoYkNCdWIyUmxjeUJoYm1RZ2MzUnZjbVZ6SUhSb1pXMGdhVzRnZG1seWRIVmhiRUYxWkdsdlIzSmhjR2dnY0hKdmNHVnlkSGtuTENBb0tTQTlQaUI3WEc0Z0lDQWdZMjl1YzNRZ2RtbHlkSFZoYkU1dlpHVlFZWEpoYlhNZ1BTQmJlMXh1SUNBZ0lDQWdhV1E2SURFc1hHNGdJQ0FnSUNCdWIyUmxPaUFuWjJGcGJpY3NYRzRnSUNBZ0lDQnZkWFJ3ZFhRNklDZHZkWFJ3ZFhRbkxGeHVJQ0FnSUgwc1hHNGdJQ0FnZTF4dUlDQWdJQ0FnYVdRNklESXNYRzRnSUNBZ0lDQnViMlJsT2lBbmIzTmphV3hzWVhSdmNpY3NYRzRnSUNBZ0lDQnZkWFJ3ZFhRNklERXNYRzRnSUNBZ2ZWMDdYRzRnSUNBZ2RtbHlkSFZoYkVGMVpHbHZSM0poY0dndWRYQmtZWFJsS0hacGNuUjFZV3hPYjJSbFVHRnlZVzF6S1R0Y2JpQWdJQ0JsZUhCbFkzUW9RWEp5WVhrdWFYTkJjbkpoZVNoMmFYSjBkV0ZzUVhWa2FXOUhjbUZ3YUM1MmFYSjBkV0ZzUVhWa2FXOUhjbUZ3YUNrcExuUnZRbVVvZEhKMVpTazdYRzRnSUNBZ1pYaHdaV04wS0hacGNuUjFZV3hCZFdScGIwZHlZWEJvTG5acGNuUjFZV3hCZFdScGIwZHlZWEJvTG14bGJtZDBhQ2t1ZEc5Q1pTZ3lLVHRjYmlBZ2ZTazdYRzVjYmlBZ2FYUW9KMk55WldGMFpYTWdUM05qYVd4c1lYUnZjazV2WkdVZ2QybDBhQ0JoYkd3Z2RtRnNhV1FnY0dGeVlXMWxkR1Z5Y3ljc0lDZ3BJRDArSUh0Y2JpQWdJQ0JqYjI1emRDQndZWEpoYlhNZ1BTQjdYRzRnSUNBZ0lDQjBlWEJsT2lBbmMzRjFZWEpsSnl4Y2JpQWdJQ0FnSUdaeVpYRjFaVzVqZVRvZ05EUXdMRnh1SUNBZ0lDQWdaR1YwZFc1bE9pQTBMRnh1SUNBZ0lIMDdYRzVjYmlBZ0lDQmpiMjV6ZENCN2RIbHdaU3dnWm5KbGNYVmxibU41TENCa1pYUjFibVY5SUQwZ2NHRnlZVzF6TzF4dVhHNGdJQ0FnWTI5dWMzUWdkbWx5ZEhWaGJFNXZaR1ZRWVhKaGJYTWdQU0JiZTF4dUlDQWdJQ0FnYVdRNklEQXNYRzRnSUNBZ0lDQnViMlJsT2lBbmIzTmphV3hzWVhSdmNpY3NYRzRnSUNBZ0lDQndZWEpoYlhNc1hHNGdJQ0FnSUNCdmRYUndkWFE2SUNkdmRYUndkWFFuTEZ4dUlDQWdJSDFkTzF4dVhHNGdJQ0FnZG1seWRIVmhiRUYxWkdsdlIzSmhjR2d1ZFhCa1lYUmxLSFpwY25SMVlXeE9iMlJsVUdGeVlXMXpLVHRjYmlBZ0lDQmpiMjV6ZENCaGRXUnBiMDV2WkdVZ1BTQjJhWEowZFdGc1FYVmthVzlIY21Gd2FDNTJhWEowZFdGc1FYVmthVzlIY21Gd2FGc3dYUzVoZFdScGIwNXZaR1U3WEc0Z0lDQWdaWGh3WldOMEtHRjFaR2x2VG05a1pTNWpiMjV6ZEhKMVkzUnZjaWt1ZEc5Q1pTaFBjMk5wYkd4aGRHOXlUbTlrWlNrN1hHNGdJQ0FnWlhod1pXTjBLR0YxWkdsdlRtOWtaUzUwZVhCbEtTNTBiMEpsS0hSNWNHVXBPMXh1SUNBZ0lHVjRjR1ZqZENoaGRXUnBiMDV2WkdVdVpuSmxjWFZsYm1ONUxuWmhiSFZsS1M1MGIwSmxLR1p5WlhGMVpXNWplU2s3WEc0Z0lDQWdaWGh3WldOMEtHRjFaR2x2VG05a1pTNWtaWFIxYm1VdWRtRnNkV1VwTG5SdlFtVW9aR1YwZFc1bEtUdGNiaUFnZlNrN1hHNWNiaUFnYVhRb0oyTnlaV0YwWlhNZ1IyRnBiazV2WkdVZ2QybDBhQ0JoYkd3Z2RtRnNhV1FnY0dGeVlXMWxkR1Z5Y3ljc0lDZ3BJRDArSUh0Y2JpQWdJQ0JqYjI1emRDQm5ZV2x1SUQwZ01DNDFPMXh1WEc0Z0lDQWdZMjl1YzNRZ2RtbHlkSFZoYkU1dlpHVlFZWEpoYlhNZ1BTQmJlMXh1SUNBZ0lDQWdhV1E2SURBc1hHNGdJQ0FnSUNCdWIyUmxPaUFuWjJGcGJpY3NYRzRnSUNBZ0lDQndZWEpoYlhNNklIdGNiaUFnSUNBZ0lDQWdaMkZwYml4Y2JpQWdJQ0FnSUgwc1hHNGdJQ0FnSUNCdmRYUndkWFE2SUNkdmRYUndkWFFuTEZ4dUlDQWdJSDFkTzF4dVhHNGdJQ0FnZG1seWRIVmhiRUYxWkdsdlIzSmhjR2d1ZFhCa1lYUmxLSFpwY25SMVlXeE9iMlJsVUdGeVlXMXpLVHRjYmlBZ0lDQmpiMjV6ZENCaGRXUnBiMDV2WkdVZ1BTQjJhWEowZFdGc1FYVmthVzlIY21Gd2FDNTJhWEowZFdGc1FYVmthVzlIY21Gd2FGc3dYUzVoZFdScGIwNXZaR1U3WEc0Z0lDQWdaWGh3WldOMEtHRjFaR2x2VG05a1pTNWpiMjV6ZEhKMVkzUnZjaWt1ZEc5Q1pTaEhZV2x1VG05a1pTazdYRzRnSUNBZ1pYaHdaV04wS0dGMVpHbHZUbTlrWlM1bllXbHVMblpoYkhWbEtTNTBiMEpsS0dkaGFXNHBPMXh1SUNCOUtUdGNibHh1SUNCcGRDZ25ZM0psWVhSbGN5QkNhWEYxWVdSR2FXeDBaWEpPYjJSbElIZHBkR2dnWVd4c0lIWmhiR2xrSUhCaGNtRnRaWFJsY25NbkxDQW9LU0E5UGlCN1hHNGdJQ0FnWTI5dWMzUWdkSGx3WlNBOUlDZHdaV0ZyYVc1bkp6dGNiaUFnSUNCamIyNXpkQ0JtY21WeGRXVnVZM2tnUFNBMU1EQTdYRzRnSUNBZ1kyOXVjM1FnWkdWMGRXNWxJRDBnTmp0Y2JpQWdJQ0JqYjI1emRDQlJJRDBnTUM0MU8xeHVYRzRnSUNBZ1kyOXVjM1FnZG1seWRIVmhiRTV2WkdWUVlYSmhiWE1nUFNCYmUxeHVJQ0FnSUNBZ2FXUTZJREFzWEc0Z0lDQWdJQ0J1YjJSbE9pQW5ZbWx4ZFdGa1JtbHNkR1Z5Snl4Y2JpQWdJQ0FnSUhCaGNtRnRjem9nZTF4dUlDQWdJQ0FnSUNCMGVYQmxMRnh1SUNBZ0lDQWdJQ0JtY21WeGRXVnVZM2tzWEc0Z0lDQWdJQ0FnSUdSbGRIVnVaU3hjYmlBZ0lDQWdJQ0FnVVN4Y2JpQWdJQ0FnSUgwc1hHNGdJQ0FnSUNCdmRYUndkWFE2SUNkdmRYUndkWFFuTEZ4dUlDQWdJSDFkTzF4dVhHNGdJQ0FnZG1seWRIVmhiRUYxWkdsdlIzSmhjR2d1ZFhCa1lYUmxLSFpwY25SMVlXeE9iMlJsVUdGeVlXMXpLVHRjYmlBZ0lDQmpiMjV6ZENCaGRXUnBiMDV2WkdVZ1BTQjJhWEowZFdGc1FYVmthVzlIY21Gd2FDNTJhWEowZFdGc1FYVmthVzlIY21Gd2FGc3dYUzVoZFdScGIwNXZaR1U3WEc0Z0lDQWdaWGh3WldOMEtHRjFaR2x2VG05a1pTNWpiMjV6ZEhKMVkzUnZjaWt1ZEc5Q1pTaENhWEYxWVdSR2FXeDBaWEpPYjJSbEtUdGNiaUFnSUNCbGVIQmxZM1FvWVhWa2FXOU9iMlJsTG5SNWNHVXBMblJ2UW1Vb2RIbHdaU2s3WEc0Z0lDQWdaWGh3WldOMEtHRjFaR2x2VG05a1pTNW1jbVZ4ZFdWdVkza3VkbUZzZFdVcExuUnZRbVVvWm5KbGNYVmxibU41S1R0Y2JpQWdJQ0JsZUhCbFkzUW9ZWFZrYVc5T2IyUmxMbVJsZEhWdVpTNTJZV3gxWlNrdWRHOUNaU2hrWlhSMWJtVXBPMXh1SUNBZ0lHVjRjR1ZqZENoaGRXUnBiMDV2WkdVdVVTNTJZV3gxWlNrdWRHOUNaU2hSS1R0Y2JpQWdmU2s3WEc1Y2JpQWdhWFFvSjJOeVpXRjBaWE1nUkdWc1lYbE9iMlJsSUhkcGRHZ2dZV3hzSUhaaGJHbGtJSEJoY21GdFpYUmxjbk1uTENBb0tTQTlQaUI3WEc0Z0lDQWdZMjl1YzNRZ1pHVnNZWGxVYVcxbElEMGdNanRjYmlBZ0lDQmpiMjV6ZENCdFlYaEVaV3hoZVZScGJXVWdQU0ExTzF4dVhHNGdJQ0FnWTI5dWMzUWdkbWx5ZEhWaGJFNXZaR1ZRWVhKaGJYTWdQU0JiZTF4dUlDQWdJQ0FnYVdRNklEQXNYRzRnSUNBZ0lDQnViMlJsT2lBblpHVnNZWGtuTEZ4dUlDQWdJQ0FnY0dGeVlXMXpPaUI3WEc0Z0lDQWdJQ0FnSUdSbGJHRjVWR2x0WlN4Y2JpQWdJQ0FnSUNBZ2JXRjRSR1ZzWVhsVWFXMWxMRnh1SUNBZ0lDQWdmU3hjYmlBZ0lDQWdJRzkxZEhCMWREb2dKMjkxZEhCMWRDY3NYRzRnSUNBZ2ZWMDdYRzVjYmlBZ0lDQjJhWEowZFdGc1FYVmthVzlIY21Gd2FDNTFjR1JoZEdVb2RtbHlkSFZoYkU1dlpHVlFZWEpoYlhNcE8xeHVJQ0FnSUdOdmJuTjBJR0YxWkdsdlRtOWtaU0E5SUhacGNuUjFZV3hCZFdScGIwZHlZWEJvTG5acGNuUjFZV3hCZFdScGIwZHlZWEJvV3pCZExtRjFaR2x2VG05a1pUdGNiaUFnSUNCbGVIQmxZM1FvWVhWa2FXOU9iMlJsTG1OdmJuTjBjblZqZEc5eUtTNTBiMEpsS0VSbGJHRjVUbTlrWlNrN1hHNGdJQ0FnWlhod1pXTjBLR0YxWkdsdlRtOWtaUzVrWld4aGVWUnBiV1V1ZG1Gc2RXVXBMblJ2UW1Vb1pHVnNZWGxVYVcxbEtUdGNiaUFnZlNrN1hHNWNiaUFnYVhRb0oyTnlaV0YwWlhNZ1UzUmxjbVZ2VUdGdWJtVnlUbTlrWlNCM2FYUm9JR0ZzYkNCMllXeHBaQ0J3WVhKaGJXVjBaWEp6Snl3Z0tDa2dQVDRnZTF4dUlDQWdJR052Ym5OMElIQmhiaUE5SURFN1hHNWNiaUFnSUNCamIyNXpkQ0IyYVhKMGRXRnNUbTlrWlZCaGNtRnRjeUE5SUZ0N1hHNGdJQ0FnSUNCcFpEb2dNQ3hjYmlBZ0lDQWdJRzV2WkdVNklDZHpkR1Z5Wlc5UVlXNXVaWEluTEZ4dUlDQWdJQ0FnY0dGeVlXMXpPaUI3WEc0Z0lDQWdJQ0FnSUhCaGJpeGNiaUFnSUNBZ0lIMHNYRzRnSUNBZ0lDQnZkWFJ3ZFhRNklDZHZkWFJ3ZFhRbkxGeHVJQ0FnSUgxZE8xeHVYRzRnSUNBZ2RtbHlkSFZoYkVGMVpHbHZSM0poY0dndWRYQmtZWFJsS0hacGNuUjFZV3hPYjJSbFVHRnlZVzF6S1R0Y2JpQWdJQ0JqYjI1emRDQmhkV1JwYjA1dlpHVWdQU0IyYVhKMGRXRnNRWFZrYVc5SGNtRndhQzUyYVhKMGRXRnNRWFZrYVc5SGNtRndhRnN3WFM1aGRXUnBiMDV2WkdVN1hHNGdJQ0FnWlhod1pXTjBLR0YxWkdsdlRtOWtaUzVqYjI1emRISjFZM1J2Y2k1dVlXMWxLUzUwYjBKbEtDZFRkR1Z5Wlc5UVlXNXVaWEpPYjJSbEp5azdYRzRnSUNBZ1pYaHdaV04wS0dGMVpHbHZUbTlrWlM1d1lXNHVkbUZzZFdVcExuUnZRbVVvY0dGdUtUdGNiaUFnZlNrN1hHNTlLVHRjYmlKZGZRPT0iLCIndXNlIHN0cmljdCc7XG5cbnZhciBfY3JlYXRlQ2xhc3MgPSByZXF1aXJlKCdiYWJlbC1ydW50aW1lL2hlbHBlcnMvY3JlYXRlLWNsYXNzJylbJ2RlZmF1bHQnXTtcblxudmFyIF9jbGFzc0NhbGxDaGVjayA9IHJlcXVpcmUoJ2JhYmVsLXJ1bnRpbWUvaGVscGVycy9jbGFzcy1jYWxsLWNoZWNrJylbJ2RlZmF1bHQnXTtcblxudmFyIF9yZXF1aXJlID0gcmVxdWlyZSgncmFtZGEnKTtcblxudmFyIGFueSA9IF9yZXF1aXJlLmFueTtcbnZhciBhc3NvYyA9IF9yZXF1aXJlLmFzc29jO1xudmFyIGNvbmNhdCA9IF9yZXF1aXJlLmNvbmNhdDtcbnZhciBjb21wb3NlID0gX3JlcXVpcmUuY29tcG9zZTtcbnZhciBkaWZmZXJlbmNlV2l0aCA9IF9yZXF1aXJlLmRpZmZlcmVuY2VXaXRoO1xudmFyIGVxUHJvcHMgPSBfcmVxdWlyZS5lcVByb3BzO1xudmFyIGZpbmQgPSBfcmVxdWlyZS5maW5kO1xudmFyIGZpbmRJbmRleCA9IF9yZXF1aXJlLmZpbmRJbmRleDtcbnZhciBmb3JFYWNoID0gX3JlcXVpcmUuZm9yRWFjaDtcbnZhciBpbnRlcnNlY3Rpb25XaXRoID0gX3JlcXVpcmUuaW50ZXJzZWN0aW9uV2l0aDtcbnZhciBpc05pbCA9IF9yZXF1aXJlLmlzTmlsO1xudmFyIG1hcCA9IF9yZXF1aXJlLm1hcDtcbnZhciBwYXJ0aXRpb24gPSBfcmVxdWlyZS5wYXJ0aXRpb247XG52YXIgcHJvcEVxID0gX3JlcXVpcmUucHJvcEVxO1xudmFyIHJlbW92ZSA9IF9yZXF1aXJlLnJlbW92ZTtcblxudmFyIGNhcGl0YWxpemVGaXJzdCA9IHJlcXVpcmUoJy4vdG9vbHMvY2FwaXRhbGl6ZUZpcnN0Jyk7XG52YXIgTmF0aXZlVmlydHVhbEF1ZGlvTm9kZSA9IHJlcXVpcmUoJy4vdmlydHVhbE5vZGVDb25zdHJ1Y3RvcnMvTmF0aXZlVmlydHVhbEF1ZGlvTm9kZScpO1xudmFyIEN1c3RvbVZpcnR1YWxBdWRpb05vZGUgPSByZXF1aXJlKCcuL3ZpcnR1YWxOb2RlQ29uc3RydWN0b3JzL0N1c3RvbVZpcnR1YWxBdWRpb05vZGUnKTtcbnZhciBjb25uZWN0QXVkaW9Ob2RlcyA9IHJlcXVpcmUoJy4vdG9vbHMvY29ubmVjdEF1ZGlvTm9kZXMnKTtcblxudmFyIGNyZWF0ZVZpcnR1YWxBdWRpb05vZGVzQW5kVXBkYXRlVmlydHVhbEF1ZGlvR3JhcGggPSBmdW5jdGlvbiBjcmVhdGVWaXJ0dWFsQXVkaW9Ob2Rlc0FuZFVwZGF0ZVZpcnR1YWxBdWRpb0dyYXBoKHZpcnR1YWxBdWRpb05vZGVQYXJhbXMpIHtcbiAgdmFyIG5ld1ZpcnR1YWxBdWRpb05vZGVQYXJhbXMgPSBkaWZmZXJlbmNlV2l0aChlcVByb3BzKCdpZCcpLCB2aXJ0dWFsQXVkaW9Ob2RlUGFyYW1zLCB0aGlzLnZpcnR1YWxBdWRpb0dyYXBoKTtcblxuICB0aGlzLnZpcnR1YWxBdWRpb0dyYXBoID0gY29uY2F0KHRoaXMudmlydHVhbEF1ZGlvR3JhcGgsIHRoaXMuY3JlYXRlVmlydHVhbEF1ZGlvTm9kZXMobmV3VmlydHVhbEF1ZGlvTm9kZVBhcmFtcykpO1xuXG4gIHJldHVybiB2aXJ0dWFsQXVkaW9Ob2RlUGFyYW1zO1xufTtcblxudmFyIHJlbW92ZUF1ZGlvTm9kZXNBbmRVcGRhdGVWaXJ0dWFsQXVkaW9HcmFwaCA9IGZ1bmN0aW9uIHJlbW92ZUF1ZGlvTm9kZXNBbmRVcGRhdGVWaXJ0dWFsQXVkaW9HcmFwaCh2aXJ0dWFsQXVkaW9Ob2RlUGFyYW1zKSB7XG4gIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgdmFyIHZpcnR1YWxOb2Rlc1RvQmVSZW1vdmVkID0gZGlmZmVyZW5jZVdpdGgoZXFQcm9wcygnaWQnKSwgdGhpcy52aXJ0dWFsQXVkaW9HcmFwaCwgdmlydHVhbEF1ZGlvTm9kZVBhcmFtcyk7XG5cbiAgZm9yRWFjaChmdW5jdGlvbiAoX3JlZikge1xuICAgIHZhciBhdWRpb05vZGUgPSBfcmVmLmF1ZGlvTm9kZTtcbiAgICB2YXIgaWQgPSBfcmVmLmlkO1xuXG4gICAgYXVkaW9Ob2RlLnN0b3AgJiYgYXVkaW9Ob2RlLnN0b3AoKTtcbiAgICBhdWRpb05vZGUuZGlzY29ubmVjdCgpO1xuICAgIF90aGlzLnZpcnR1YWxBdWRpb0dyYXBoID0gcmVtb3ZlKGZpbmRJbmRleChwcm9wRXEoJ2lkJywgaWQpKShfdGhpcy52aXJ0dWFsQXVkaW9HcmFwaCksIDEsIF90aGlzLnZpcnR1YWxBdWRpb0dyYXBoKTtcbiAgfSwgdmlydHVhbE5vZGVzVG9CZVJlbW92ZWQpO1xuXG4gIHJldHVybiB2aXJ0dWFsQXVkaW9Ob2RlUGFyYW1zO1xufTtcblxudmFyIHVwZGF0ZUF1ZGlvTm9kZXNBbmRVcGRhdGVWaXJ0dWFsQXVkaW9HcmFwaCA9IGZ1bmN0aW9uIHVwZGF0ZUF1ZGlvTm9kZXNBbmRVcGRhdGVWaXJ0dWFsQXVkaW9HcmFwaCh2aXJ0dWFsQXVkaW9Ob2RlUGFyYW1zKSB7XG4gIHZhciBfdGhpczIgPSB0aGlzO1xuXG4gIHZhciB1cGRhdGVQYXJhbXMgPSBpbnRlcnNlY3Rpb25XaXRoKGVxUHJvcHMoJ2lkJyksIHZpcnR1YWxBdWRpb05vZGVQYXJhbXMsIHRoaXMudmlydHVhbEF1ZGlvR3JhcGgpO1xuXG4gIGZvckVhY2goZnVuY3Rpb24gKHZpcnR1YWxBdWRpb05vZGVQYXJhbSkge1xuICAgIHZhciB2aXJ0dWFsQXVkaW9Ob2RlID0gZmluZChwcm9wRXEoJ2lkJywgdmlydHVhbEF1ZGlvTm9kZVBhcmFtLmlkKSkoX3RoaXMyLnZpcnR1YWxBdWRpb0dyYXBoKTtcbiAgICB2aXJ0dWFsQXVkaW9Ob2RlLnVwZGF0ZUF1ZGlvTm9kZSh2aXJ0dWFsQXVkaW9Ob2RlUGFyYW0ucGFyYW1zKTtcbiAgfSwgdXBkYXRlUGFyYW1zKTtcblxuICByZXR1cm4gdmlydHVhbEF1ZGlvTm9kZVBhcmFtcztcbn07XG5cbnZhciBWaXJ0dWFsQXVkaW9HcmFwaCA9IChmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIFZpcnR1YWxBdWRpb0dyYXBoKCkge1xuICAgIHZhciBwYXJhbXMgPSBhcmd1bWVudHNbMF0gPT09IHVuZGVmaW5lZCA/IHt9IDogYXJndW1lbnRzWzBdO1xuXG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIFZpcnR1YWxBdWRpb0dyYXBoKTtcblxuICAgIHRoaXMuYXVkaW9Db250ZXh0ID0gcGFyYW1zLmF1ZGlvQ29udGV4dCB8fCBuZXcgQXVkaW9Db250ZXh0KCk7XG4gICAgdGhpcy5vdXRwdXQgPSBwYXJhbXMub3V0cHV0IHx8IHRoaXMuYXVkaW9Db250ZXh0LmRlc3RpbmF0aW9uO1xuICAgIHRoaXMudmlydHVhbEF1ZGlvR3JhcGggPSBbXTtcbiAgICB0aGlzLmN1c3RvbU5vZGVzID0ge307XG5cbiAgICB0aGlzLl9yZW1vdmVVcGRhdGVBbmRDcmVhdGUgPSBjb21wb3NlKGNyZWF0ZVZpcnR1YWxBdWRpb05vZGVzQW5kVXBkYXRlVmlydHVhbEF1ZGlvR3JhcGguYmluZCh0aGlzKSwgdXBkYXRlQXVkaW9Ob2Rlc0FuZFVwZGF0ZVZpcnR1YWxBdWRpb0dyYXBoLmJpbmQodGhpcyksIHJlbW92ZUF1ZGlvTm9kZXNBbmRVcGRhdGVWaXJ0dWFsQXVkaW9HcmFwaC5iaW5kKHRoaXMpKTtcbiAgfVxuXG4gIF9jcmVhdGVDbGFzcyhWaXJ0dWFsQXVkaW9HcmFwaCwgW3tcbiAgICBrZXk6ICdjcmVhdGVWaXJ0dWFsQXVkaW9Ob2RlcycsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGNyZWF0ZVZpcnR1YWxBdWRpb05vZGVzKHZpcnR1YWxBdWRpb05vZGVzUGFyYW1zKSB7XG4gICAgICB2YXIgX3RoaXMzID0gdGhpcztcblxuICAgICAgdmFyIHBhcnRpdGlvbmVkVmlydHVhbEF1ZGlvTm9kZVBhcmFtcyA9IHBhcnRpdGlvbihmdW5jdGlvbiAoX3JlZjIpIHtcbiAgICAgICAgdmFyIG5vZGUgPSBfcmVmMi5ub2RlO1xuICAgICAgICByZXR1cm4gaXNOaWwoX3RoaXMzLmN1c3RvbU5vZGVzW25vZGVdKTtcbiAgICAgIH0sIHZpcnR1YWxBdWRpb05vZGVzUGFyYW1zKTtcblxuICAgICAgdmFyIG5hdGl2ZVZpcnR1YWxBdWRpb05vZGVQYXJhbXMgPSBwYXJ0aXRpb25lZFZpcnR1YWxBdWRpb05vZGVQYXJhbXNbMF07XG4gICAgICB2YXIgY3VzdG9tVmlydHVhbEF1ZGlvTm9kZVBhcmFtcyA9IHBhcnRpdGlvbmVkVmlydHVhbEF1ZGlvTm9kZVBhcmFtc1sxXTtcblxuICAgICAgdmFyIG5hdGl2ZVZpcnR1YWxBdWRpb05vZGVzID0gbWFwKGZ1bmN0aW9uICh2aXJ0dWFsQXVkaW9Ob2RlUGFyYW1zKSB7XG4gICAgICAgIHJldHVybiBuZXcgTmF0aXZlVmlydHVhbEF1ZGlvTm9kZShfdGhpczMsIHZpcnR1YWxBdWRpb05vZGVQYXJhbXMpO1xuICAgICAgfSwgbmF0aXZlVmlydHVhbEF1ZGlvTm9kZVBhcmFtcyk7XG4gICAgICB2YXIgY3VzdG9tVmlydHVhbEF1ZGlvTm9kZXMgPSBtYXAoZnVuY3Rpb24gKHZpcnR1YWxBdWRpb05vZGVQYXJhbXMpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBDdXN0b21WaXJ0dWFsQXVkaW9Ob2RlKF90aGlzMywgdmlydHVhbEF1ZGlvTm9kZVBhcmFtcyk7XG4gICAgICB9LCBjdXN0b21WaXJ0dWFsQXVkaW9Ob2RlUGFyYW1zKTtcblxuICAgICAgcmV0dXJuIGNvbmNhdChuYXRpdmVWaXJ0dWFsQXVkaW9Ob2RlcywgY3VzdG9tVmlydHVhbEF1ZGlvTm9kZXMpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ2RlZmluZU5vZGUnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBkZWZpbmVOb2RlKHBhcmFtcywgbmFtZSkge1xuICAgICAgaWYgKHRoaXMuYXVkaW9Db250ZXh0WydjcmVhdGUnICsgY2FwaXRhbGl6ZUZpcnN0KG5hbWUpXSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJycgKyBuYW1lICsgJyBpcyBhIHN0YW5kYXJkIGF1ZGlvIG5vZGUgbmFtZSBhbmQgY2Fubm90IGJlIG92ZXJ3cml0dGVuJyk7XG4gICAgICB9XG4gICAgICB0aGlzLmN1c3RvbU5vZGVzW25hbWVdID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gcGFyYW1zO1xuICAgICAgfTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ3VwZGF0ZScsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHVwZGF0ZSh2aXJ0dWFsQXVkaW9Ob2RlUGFyYW1zKSB7XG4gICAgICB2YXIgX3RoaXM0ID0gdGhpcztcblxuICAgICAgaWYgKGFueShwcm9wRXEoJ2lkJywgdW5kZWZpbmVkKSwgdmlydHVhbEF1ZGlvTm9kZVBhcmFtcykpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdFdmVyeSB2aXJ0dWFsQXVkaW9Ob2RlIG5lZWRzIGFuIGlkIGZvciBlZmZpY2llbnQgZGlmZmluZyBhbmQgZGV0ZXJtaW5pbmcgcmVsYXRpb25zaGlwcyBiZXR3ZWVuIG5vZGVzJyk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX3JlbW92ZVVwZGF0ZUFuZENyZWF0ZSh2aXJ0dWFsQXVkaW9Ob2RlUGFyYW1zKTtcbiAgICAgIGNvbm5lY3RBdWRpb05vZGVzKEN1c3RvbVZpcnR1YWxBdWRpb05vZGUsIHRoaXMudmlydHVhbEF1ZGlvR3JhcGgsIGZ1bmN0aW9uICh2aXJ0dWFsQXVkaW9Ob2RlKSB7XG4gICAgICAgIHJldHVybiB2aXJ0dWFsQXVkaW9Ob2RlLmNvbm5lY3QoX3RoaXM0Lm91dHB1dCk7XG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIFZpcnR1YWxBdWRpb0dyYXBoO1xufSkoKTtcblxubW9kdWxlLmV4cG9ydHMgPSBWaXJ0dWFsQXVkaW9HcmFwaDtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTlvYjIxbEwySXZaR1YyTDNacGNuUjFZV3d0WVhWa2FXOHRaM0poY0dndmMzSmpMMVpwY25SMVlXeEJkV1JwYjBkeVlYQm9MbXB6SWwwc0ltNWhiV1Z6SWpwYlhTd2liV0Z3Y0dsdVozTWlPaUk3T3pzN096dGxRVU0yUkN4UFFVRlBMRU5CUVVNc1QwRkJUeXhEUVVGRE96dEpRVVIwUlN4SFFVRkhMRmxCUVVnc1IwRkJSenRKUVVGRkxFdEJRVXNzV1VGQlRDeExRVUZMTzBsQlFVVXNUVUZCVFN4WlFVRk9MRTFCUVUwN1NVRkJSU3hQUVVGUExGbEJRVkFzVDBGQlR6dEpRVUZGTEdOQlFXTXNXVUZCWkN4alFVRmpPMGxCUVVVc1QwRkJUeXhaUVVGUUxFOUJRVTg3U1VGQlJTeEpRVUZKTEZsQlFVb3NTVUZCU1R0SlFVRkZMRk5CUVZNc1dVRkJWQ3hUUVVGVE8wbEJRVVVzVDBGQlR5eFpRVUZRTEU5QlFVODdTVUZEYmtZc1owSkJRV2RDTEZsQlFXaENMR2RDUVVGblFqdEpRVUZGTEV0QlFVc3NXVUZCVEN4TFFVRkxPMGxCUVVVc1IwRkJSeXhaUVVGSUxFZEJRVWM3U1VGQlJTeFRRVUZUTEZsQlFWUXNVMEZCVXp0SlFVRkZMRTFCUVUwc1dVRkJUaXhOUVVGTk8wbEJRVVVzVFVGQlRTeFpRVUZPTEUxQlFVMDdPMEZCUTNwRUxFbEJRVTBzWlVGQlpTeEhRVUZITEU5QlFVOHNRMEZCUXl4NVFrRkJlVUlzUTBGQlF5eERRVUZETzBGQlF6TkVMRWxCUVUwc2MwSkJRWE5DTEVkQlFVY3NUMEZCVHl4RFFVRkRMR3RFUVVGclJDeERRVUZETEVOQlFVTTdRVUZETTBZc1NVRkJUU3h6UWtGQmMwSXNSMEZCUnl4UFFVRlBMRU5CUVVNc2EwUkJRV3RFTEVOQlFVTXNRMEZCUXp0QlFVTXpSaXhKUVVGTkxHbENRVUZwUWl4SFFVRkhMRTlCUVU4c1EwRkJReXd5UWtGQk1rSXNRMEZCUXl4RFFVRkRPenRCUVVVdlJDeEpRVUZOTEdsRVFVRnBSQ3hIUVVGSExGTkJRWEJFTEdsRVFVRnBSQ3hEUVVGaExITkNRVUZ6UWl4RlFVRkZPMEZCUXpGR0xFMUJRVTBzZVVKQlFYbENMRWRCUVVjc1kwRkJZeXhEUVVGRExFOUJRVThzUTBGQlF5eEpRVUZKTEVOQlFVTXNSVUZCUlN4elFrRkJjMElzUlVGQlJTeEpRVUZKTEVOQlFVTXNhVUpCUVdsQ0xFTkJRVU1zUTBGQlF6czdRVUZGYUVnc1RVRkJTU3hEUVVGRExHbENRVUZwUWl4SFFVRkhMRTFCUVUwc1EwRkJReXhKUVVGSkxFTkJRVU1zYVVKQlFXbENMRVZCUVVVc1NVRkJTU3hEUVVGRExIVkNRVUYxUWl4RFFVRkRMSGxDUVVGNVFpeERRVUZETEVOQlFVTXNRMEZCUXpzN1FVRkZha2dzVTBGQlR5eHpRa0ZCYzBJc1EwRkJRenREUVVNdlFpeERRVUZET3p0QlFVVkdMRWxCUVUwc01FTkJRVEJETEVkQlFVY3NVMEZCTjBNc01FTkJRVEJETEVOQlFXRXNjMEpCUVhOQ0xFVkJRVVU3T3p0QlFVTnVSaXhOUVVGTkxIVkNRVUYxUWl4SFFVRkhMR05CUVdNc1EwRkJReXhQUVVGUExFTkJRVU1zU1VGQlNTeERRVUZETEVWQlFVVXNTVUZCU1N4RFFVRkRMR2xDUVVGcFFpeEZRVUZGTEhOQ1FVRnpRaXhEUVVGRExFTkJRVU03TzBGQlJUbEhMRk5CUVU4c1EwRkJReXhWUVVGRExFbEJRV1VzUlVGQlN6dFJRVUZ1UWl4VFFVRlRMRWRCUVZZc1NVRkJaU3hEUVVGa0xGTkJRVk03VVVGQlJTeEZRVUZGTEVkQlFXUXNTVUZCWlN4RFFVRklMRVZCUVVVN08wRkJRM0pDTEdGQlFWTXNRMEZCUXl4SlFVRkpMRWxCUVVrc1UwRkJVeXhEUVVGRExFbEJRVWtzUlVGQlJTeERRVUZETzBGQlEyNURMR0ZCUVZNc1EwRkJReXhWUVVGVkxFVkJRVVVzUTBGQlF6dEJRVU4yUWl4VlFVRkxMR2xDUVVGcFFpeEhRVUZITEUxQlFVMHNRMEZCUXl4VFFVRlRMRU5CUVVNc1RVRkJUU3hEUVVGRExFbEJRVWtzUlVGQlJTeEZRVUZGTEVOQlFVTXNRMEZCUXl4RFFVRkRMRTFCUVVzc2FVSkJRV2xDTEVOQlFVTXNSVUZCUlN4RFFVRkRMRVZCUVVVc1RVRkJTeXhwUWtGQmFVSXNRMEZCUXl4RFFVRkRPMGRCUTJwSUxFVkJRVVVzZFVKQlFYVkNMRU5CUVVNc1EwRkJRenM3UVVGRk5VSXNVMEZCVHl4elFrRkJjMElzUTBGQlF6dERRVU12UWl4RFFVRkRPenRCUVVWR0xFbEJRVTBzTUVOQlFUQkRMRWRCUVVjc1UwRkJOME1zTUVOQlFUQkRMRU5CUVdFc2MwSkJRWE5DTEVWQlFVVTdPenRCUVVOdVJpeE5RVUZOTEZsQlFWa3NSMEZCUnl4blFrRkJaMElzUTBGQlF5eFBRVUZQTEVOQlFVTXNTVUZCU1N4RFFVRkRMRVZCUVVVc2MwSkJRWE5DTEVWQlFVVXNTVUZCU1N4RFFVRkRMR2xDUVVGcFFpeERRVUZETEVOQlFVTTdPMEZCUlhKSExGTkJRVThzUTBGQlF5eFZRVUZETEhGQ1FVRnhRaXhGUVVGTE8wRkJRMnBETEZGQlFVMHNaMEpCUVdkQ0xFZEJRVWNzU1VGQlNTeERRVUZETEUxQlFVMHNRMEZCUXl4SlFVRkpMRVZCUVVVc2NVSkJRWEZDTEVOQlFVTXNSVUZCUlN4RFFVRkRMRU5CUVVNc1EwRkJReXhQUVVGTExHbENRVUZwUWl4RFFVRkRMRU5CUVVNN1FVRkRPVVlzYjBKQlFXZENMRU5CUVVNc1pVRkJaU3hEUVVGRExIRkNRVUZ4UWl4RFFVRkRMRTFCUVUwc1EwRkJReXhEUVVGRE8wZEJRMmhGTEVWQlFVVXNXVUZCV1N4RFFVRkRMRU5CUVVNN08wRkJSV3BDTEZOQlFVOHNjMEpCUVhOQ0xFTkJRVU03UTBGREwwSXNRMEZCUXpzN1NVRkZTU3hwUWtGQmFVSTdRVUZEVkN4WFFVUlNMR2xDUVVGcFFpeEhRVU5MTzFGQlFXSXNUVUZCVFN4blEwRkJSeXhGUVVGRk96c3dRa0ZFY0VJc2FVSkJRV2xDT3p0QlFVVnVRaXhSUVVGSkxFTkJRVU1zV1VGQldTeEhRVUZITEUxQlFVMHNRMEZCUXl4WlFVRlpMRWxCUVVrc1NVRkJTU3haUVVGWkxFVkJRVVVzUTBGQlF6dEJRVU01UkN4UlFVRkpMRU5CUVVNc1RVRkJUU3hIUVVGSExFMUJRVTBzUTBGQlF5eE5RVUZOTEVsQlFVa3NTVUZCU1N4RFFVRkRMRmxCUVZrc1EwRkJReXhYUVVGWExFTkJRVU03UVVGRE4wUXNVVUZCU1N4RFFVRkRMR2xDUVVGcFFpeEhRVUZITEVWQlFVVXNRMEZCUXp0QlFVTTFRaXhSUVVGSkxFTkJRVU1zVjBGQlZ5eEhRVUZITEVWQlFVVXNRMEZCUXpzN1FVRkZkRUlzVVVGQlNTeERRVUZETEhOQ1FVRnpRaXhIUVVGSExFOUJRVThzUTBGRGJrTXNhVVJCUVdsRUxFTkJRVU1zU1VGQlNTeERRVUZETEVsQlFVa3NRMEZCUXl4RlFVTTFSQ3d3UTBGQk1FTXNRMEZCUXl4SlFVRkpMRU5CUVVNc1NVRkJTU3hEUVVGRExFVkJRM0pFTERCRFFVRXdReXhEUVVGRExFbEJRVWtzUTBGQlF5eEpRVUZKTEVOQlFVTXNRMEZEZEVRc1EwRkJRenRIUVVOSU96dGxRVnBITEdsQ1FVRnBRanM3VjBGalJ5eHBRMEZCUXl4MVFrRkJkVUlzUlVGQlJUczdPMEZCUTJoRUxGVkJRVTBzYVVOQlFXbERMRWRCUVVjc1UwRkJVeXhEUVVGRExGVkJRVU1zUzBGQlRUdFpRVUZNTEVsQlFVa3NSMEZCVEN4TFFVRk5MRU5CUVV3c1NVRkJTVHRsUVVONFJDeExRVUZMTEVOQlFVTXNUMEZCU3l4WFFVRlhMRU5CUVVNc1NVRkJTU3hEUVVGRExFTkJRVU03VDBGQlFTeEZRVUZGTEhWQ1FVRjFRaXhEUVVGRExFTkJRVU03TzBGQlJURkVMRlZCUVUwc05FSkJRVFJDTEVkQlFVY3NhVU5CUVdsRExFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTTdRVUZETVVVc1ZVRkJUU3cwUWtGQk5FSXNSMEZCUnl4cFEwRkJhVU1zUTBGQlF5eERRVUZETEVOQlFVTXNRMEZCUXpzN1FVRkZNVVVzVlVGQlRTeDFRa0ZCZFVJc1IwRkJSeXhIUVVGSExFTkJRVU1zVlVGQlF5eHpRa0ZCYzBJN1pVRkRla1FzU1VGQlNTeHpRa0ZCYzBJc1UwRkJUeXh6UWtGQmMwSXNRMEZCUXp0UFFVRkJMRVZCUVVVc05FSkJRVFJDTEVOQlFVTXNRMEZCUXp0QlFVTXhSaXhWUVVGTkxIVkNRVUYxUWl4SFFVRkhMRWRCUVVjc1EwRkJReXhWUVVGRExITkNRVUZ6UWp0bFFVTjZSQ3hKUVVGSkxITkNRVUZ6UWl4VFFVRlBMSE5DUVVGelFpeERRVUZETzA5QlFVRXNSVUZCUlN3MFFrRkJORUlzUTBGQlF5eERRVUZET3p0QlFVVXhSaXhoUVVGUExFMUJRVTBzUTBGQlF5eDFRa0ZCZFVJc1JVRkJSU3gxUWtGQmRVSXNRMEZCUXl4RFFVRkRPMHRCUTJwRk96czdWMEZGVlN4dlFrRkJReXhOUVVGTkxFVkJRVVVzU1VGQlNTeEZRVUZGTzBGQlEzaENMRlZCUVVrc1NVRkJTU3hEUVVGRExGbEJRVmtzV1VGQlZTeGxRVUZsTEVOQlFVTXNTVUZCU1N4RFFVRkRMRU5CUVVjc1JVRkJSVHRCUVVOMlJDeGpRVUZOTEVsQlFVa3NTMEZCU3l4TlFVRkpMRWxCUVVrc09FUkJRVEpFTEVOQlFVTTdUMEZEY0VZN1FVRkRSQ3hWUVVGSkxFTkJRVU1zVjBGQlZ5eERRVUZETEVsQlFVa3NRMEZCUXl4SFFVRkhPMlZCUVUwc1RVRkJUVHRQUVVGQkxFTkJRVU03UVVGRGRFTXNZVUZCVHl4SlFVRkpMRU5CUVVNN1MwRkRZanM3TzFkQlJVMHNaMEpCUVVNc2MwSkJRWE5DTEVWQlFVVTdPenRCUVVNNVFpeFZRVUZKTEVkQlFVY3NRMEZCUXl4TlFVRk5MRU5CUVVNc1NVRkJTU3hGUVVGRkxGTkJRVk1zUTBGQlF5eEZRVUZGTEhOQ1FVRnpRaXhEUVVGRExFVkJRVVU3UVVGRGVFUXNZMEZCVFN4SlFVRkpMRXRCUVVzc1EwRkJReXh6UjBGQmMwY3NRMEZCUXl4RFFVRkRPMDlCUTNwSU96dEJRVVZFTEZWQlFVa3NRMEZCUXl4elFrRkJjMElzUTBGQlF5eHpRa0ZCYzBJc1EwRkJReXhEUVVGRE8wRkJRM0JFTEhWQ1FVRnBRaXhEUVVGRExITkNRVUZ6UWl4RlFVRkZMRWxCUVVrc1EwRkJReXhwUWtGQmFVSXNSVUZCUlN4VlFVRkRMR2RDUVVGblFqdGxRVU5xUml4blFrRkJaMElzUTBGQlF5eFBRVUZQTEVOQlFVTXNUMEZCU3l4TlFVRk5MRU5CUVVNN1QwRkJRU3hEUVVGRExFTkJRVU03TzBGQlJYcERMR0ZCUVU4c1NVRkJTU3hEUVVGRE8wdEJRMkk3T3p0VFFTOURSeXhwUWtGQmFVSTdPenRCUVd0RWRrSXNUVUZCVFN4RFFVRkRMRTlCUVU4c1IwRkJSeXhwUWtGQmFVSXNRMEZCUXlJc0ltWnBiR1VpT2lJdmFHOXRaUzlpTDJSbGRpOTJhWEowZFdGc0xXRjFaR2x2TFdkeVlYQm9MM055WXk5V2FYSjBkV0ZzUVhWa2FXOUhjbUZ3YUM1cWN5SXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJJbU52Ym5OMElIdGhibmtzSUdGemMyOWpMQ0JqYjI1allYUXNJR052YlhCdmMyVXNJR1JwWm1abGNtVnVZMlZYYVhSb0xDQmxjVkJ5YjNCekxDQm1hVzVrTENCbWFXNWtTVzVrWlhnc0lHWnZja1ZoWTJnc1hHNGdJR2x1ZEdWeWMyVmpkR2x2YmxkcGRHZ3NJR2x6VG1sc0xDQnRZWEFzSUhCaGNuUnBkR2x2Yml3Z2NISnZjRVZ4TENCeVpXMXZkbVY5SUQwZ2NtVnhkV2x5WlNnbmNtRnRaR0VuS1R0Y2JtTnZibk4wSUdOaGNHbDBZV3hwZW1WR2FYSnpkQ0E5SUhKbGNYVnBjbVVvSnk0dmRHOXZiSE12WTJGd2FYUmhiR2w2WlVacGNuTjBKeWs3WEc1amIyNXpkQ0JPWVhScGRtVldhWEowZFdGc1FYVmthVzlPYjJSbElEMGdjbVZ4ZFdseVpTZ25MaTkyYVhKMGRXRnNUbTlrWlVOdmJuTjBjblZqZEc5eWN5OU9ZWFJwZG1WV2FYSjBkV0ZzUVhWa2FXOU9iMlJsSnlrN1hHNWpiMjV6ZENCRGRYTjBiMjFXYVhKMGRXRnNRWFZrYVc5T2IyUmxJRDBnY21WeGRXbHlaU2duTGk5MmFYSjBkV0ZzVG05a1pVTnZibk4wY25WamRHOXljeTlEZFhOMGIyMVdhWEowZFdGc1FYVmthVzlPYjJSbEp5azdYRzVqYjI1emRDQmpiMjV1WldOMFFYVmthVzlPYjJSbGN5QTlJSEpsY1hWcGNtVW9KeTR2ZEc5dmJITXZZMjl1Ym1WamRFRjFaR2x2VG05a1pYTW5LVHRjYmx4dVkyOXVjM1FnWTNKbFlYUmxWbWx5ZEhWaGJFRjFaR2x2VG05a1pYTkJibVJWY0dSaGRHVldhWEowZFdGc1FYVmthVzlIY21Gd2FDQTlJR1oxYm1OMGFXOXVJQ2gyYVhKMGRXRnNRWFZrYVc5T2IyUmxVR0Z5WVcxektTQjdYRzRnSUdOdmJuTjBJRzVsZDFacGNuUjFZV3hCZFdScGIwNXZaR1ZRWVhKaGJYTWdQU0JrYVdabVpYSmxibU5sVjJsMGFDaGxjVkJ5YjNCektDZHBaQ2NwTENCMmFYSjBkV0ZzUVhWa2FXOU9iMlJsVUdGeVlXMXpMQ0IwYUdsekxuWnBjblIxWVd4QmRXUnBiMGR5WVhCb0tUdGNibHh1SUNCMGFHbHpMblpwY25SMVlXeEJkV1JwYjBkeVlYQm9JRDBnWTI5dVkyRjBLSFJvYVhNdWRtbHlkSFZoYkVGMVpHbHZSM0poY0dnc0lIUm9hWE11WTNKbFlYUmxWbWx5ZEhWaGJFRjFaR2x2VG05a1pYTW9ibVYzVm1seWRIVmhiRUYxWkdsdlRtOWtaVkJoY21GdGN5a3BPMXh1WEc0Z0lISmxkSFZ5YmlCMmFYSjBkV0ZzUVhWa2FXOU9iMlJsVUdGeVlXMXpPMXh1ZlR0Y2JseHVZMjl1YzNRZ2NtVnRiM1psUVhWa2FXOU9iMlJsYzBGdVpGVndaR0YwWlZacGNuUjFZV3hCZFdScGIwZHlZWEJvSUQwZ1puVnVZM1JwYjI0Z0tIWnBjblIxWVd4QmRXUnBiMDV2WkdWUVlYSmhiWE1wSUh0Y2JpQWdZMjl1YzNRZ2RtbHlkSFZoYkU1dlpHVnpWRzlDWlZKbGJXOTJaV1FnUFNCa2FXWm1aWEpsYm1ObFYybDBhQ2hsY1ZCeWIzQnpLQ2RwWkNjcExDQjBhR2x6TG5acGNuUjFZV3hCZFdScGIwZHlZWEJvTENCMmFYSjBkV0ZzUVhWa2FXOU9iMlJsVUdGeVlXMXpLVHRjYmx4dUlDQm1iM0pGWVdOb0tDaDdZWFZrYVc5T2IyUmxMQ0JwWkgwcElEMCtJSHRjYmlBZ0lDQmhkV1JwYjA1dlpHVXVjM1J2Y0NBbUppQmhkV1JwYjA1dlpHVXVjM1J2Y0NncE8xeHVJQ0FnSUdGMVpHbHZUbTlrWlM1a2FYTmpiMjV1WldOMEtDazdYRzRnSUNBZ2RHaHBjeTUyYVhKMGRXRnNRWFZrYVc5SGNtRndhQ0E5SUhKbGJXOTJaU2htYVc1a1NXNWtaWGdvY0hKdmNFVnhLRndpYVdSY0lpd2dhV1FwS1NoMGFHbHpMblpwY25SMVlXeEJkV1JwYjBkeVlYQm9LU3dnTVN3Z2RHaHBjeTUyYVhKMGRXRnNRWFZrYVc5SGNtRndhQ2s3WEc0Z0lIMHNJSFpwY25SMVlXeE9iMlJsYzFSdlFtVlNaVzF2ZG1Wa0tUdGNibHh1SUNCeVpYUjFjbTRnZG1seWRIVmhiRUYxWkdsdlRtOWtaVkJoY21GdGN6dGNibjA3WEc1Y2JtTnZibk4wSUhWd1pHRjBaVUYxWkdsdlRtOWtaWE5CYm1SVmNHUmhkR1ZXYVhKMGRXRnNRWFZrYVc5SGNtRndhQ0E5SUdaMWJtTjBhVzl1SUNoMmFYSjBkV0ZzUVhWa2FXOU9iMlJsVUdGeVlXMXpLU0I3WEc0Z0lHTnZibk4wSUhWd1pHRjBaVkJoY21GdGN5QTlJR2x1ZEdWeWMyVmpkR2x2YmxkcGRHZ29aWEZRY205d2N5Z25hV1FuS1N3Z2RtbHlkSFZoYkVGMVpHbHZUbTlrWlZCaGNtRnRjeXdnZEdocGN5NTJhWEowZFdGc1FYVmthVzlIY21Gd2FDazdYRzVjYmlBZ1ptOXlSV0ZqYUNnb2RtbHlkSFZoYkVGMVpHbHZUbTlrWlZCaGNtRnRLU0E5UGlCN1hHNGdJQ0FnWTI5dWMzUWdkbWx5ZEhWaGJFRjFaR2x2VG05a1pTQTlJR1pwYm1Rb2NISnZjRVZ4S0Z3aWFXUmNJaXdnZG1seWRIVmhiRUYxWkdsdlRtOWtaVkJoY21GdExtbGtLU2tvZEdocGN5NTJhWEowZFdGc1FYVmthVzlIY21Gd2FDazdYRzRnSUNBZ2RtbHlkSFZoYkVGMVpHbHZUbTlrWlM1MWNHUmhkR1ZCZFdScGIwNXZaR1VvZG1seWRIVmhiRUYxWkdsdlRtOWtaVkJoY21GdExuQmhjbUZ0Y3lrN1hHNGdJSDBzSUhWd1pHRjBaVkJoY21GdGN5azdYRzVjYmlBZ2NtVjBkWEp1SUhacGNuUjFZV3hCZFdScGIwNXZaR1ZRWVhKaGJYTTdYRzU5TzF4dVhHNWpiR0Z6Y3lCV2FYSjBkV0ZzUVhWa2FXOUhjbUZ3YUNCN1hHNGdJR052Ym5OMGNuVmpkRzl5SUNod1lYSmhiWE1nUFNCN2ZTa2dlMXh1SUNBZ0lIUm9hWE11WVhWa2FXOURiMjUwWlhoMElEMGdjR0Z5WVcxekxtRjFaR2x2UTI5dWRHVjRkQ0I4ZkNCdVpYY2dRWFZrYVc5RGIyNTBaWGgwS0NrN1hHNGdJQ0FnZEdocGN5NXZkWFJ3ZFhRZ1BTQndZWEpoYlhNdWIzVjBjSFYwSUh4OElIUm9hWE11WVhWa2FXOURiMjUwWlhoMExtUmxjM1JwYm1GMGFXOXVPMXh1SUNBZ0lIUm9hWE11ZG1seWRIVmhiRUYxWkdsdlIzSmhjR2dnUFNCYlhUdGNiaUFnSUNCMGFHbHpMbU4xYzNSdmJVNXZaR1Z6SUQwZ2UzMDdYRzVjYmlBZ0lDQjBhR2x6TGw5eVpXMXZkbVZWY0dSaGRHVkJibVJEY21WaGRHVWdQU0JqYjIxd2IzTmxLRnh1SUNBZ0lDQWdZM0psWVhSbFZtbHlkSFZoYkVGMVpHbHZUbTlrWlhOQmJtUlZjR1JoZEdWV2FYSjBkV0ZzUVhWa2FXOUhjbUZ3YUM1aWFXNWtLSFJvYVhNcExGeHVJQ0FnSUNBZ2RYQmtZWFJsUVhWa2FXOU9iMlJsYzBGdVpGVndaR0YwWlZacGNuUjFZV3hCZFdScGIwZHlZWEJvTG1KcGJtUW9kR2hwY3lrc1hHNGdJQ0FnSUNCeVpXMXZkbVZCZFdScGIwNXZaR1Z6UVc1a1ZYQmtZWFJsVm1seWRIVmhiRUYxWkdsdlIzSmhjR2d1WW1sdVpDaDBhR2x6S1Z4dUlDQWdJQ2s3WEc0Z0lIMWNibHh1SUNCamNtVmhkR1ZXYVhKMGRXRnNRWFZrYVc5T2IyUmxjeUFvZG1seWRIVmhiRUYxWkdsdlRtOWtaWE5RWVhKaGJYTXBJSHRjYmlBZ0lDQmpiMjV6ZENCd1lYSjBhWFJwYjI1bFpGWnBjblIxWVd4QmRXUnBiMDV2WkdWUVlYSmhiWE1nUFNCd1lYSjBhWFJwYjI0b0tIdHViMlJsZlNrZ1BUNWNiaUFnSUNBZ0lHbHpUbWxzS0hSb2FYTXVZM1Z6ZEc5dFRtOWtaWE5iYm05a1pWMHBMQ0IyYVhKMGRXRnNRWFZrYVc5T2IyUmxjMUJoY21GdGN5azdYRzVjYmlBZ0lDQmpiMjV6ZENCdVlYUnBkbVZXYVhKMGRXRnNRWFZrYVc5T2IyUmxVR0Z5WVcxeklEMGdjR0Z5ZEdsMGFXOXVaV1JXYVhKMGRXRnNRWFZrYVc5T2IyUmxVR0Z5WVcxeld6QmRPMXh1SUNBZ0lHTnZibk4wSUdOMWMzUnZiVlpwY25SMVlXeEJkV1JwYjA1dlpHVlFZWEpoYlhNZ1BTQndZWEowYVhScGIyNWxaRlpwY25SMVlXeEJkV1JwYjA1dlpHVlFZWEpoYlhOYk1WMDdYRzVjYmlBZ0lDQmpiMjV6ZENCdVlYUnBkbVZXYVhKMGRXRnNRWFZrYVc5T2IyUmxjeUE5SUcxaGNDZ29kbWx5ZEhWaGJFRjFaR2x2VG05a1pWQmhjbUZ0Y3lrZ1BUNWNiaUFnSUNBZ0lHNWxkeUJPWVhScGRtVldhWEowZFdGc1FYVmthVzlPYjJSbEtIUm9hWE1zSUhacGNuUjFZV3hCZFdScGIwNXZaR1ZRWVhKaGJYTXBMQ0J1WVhScGRtVldhWEowZFdGc1FYVmthVzlPYjJSbFVHRnlZVzF6S1R0Y2JpQWdJQ0JqYjI1emRDQmpkWE4wYjIxV2FYSjBkV0ZzUVhWa2FXOU9iMlJsY3lBOUlHMWhjQ2dvZG1seWRIVmhiRUYxWkdsdlRtOWtaVkJoY21GdGN5a2dQVDVjYmlBZ0lDQWdJRzVsZHlCRGRYTjBiMjFXYVhKMGRXRnNRWFZrYVc5T2IyUmxLSFJvYVhNc0lIWnBjblIxWVd4QmRXUnBiMDV2WkdWUVlYSmhiWE1wTENCamRYTjBiMjFXYVhKMGRXRnNRWFZrYVc5T2IyUmxVR0Z5WVcxektUdGNibHh1SUNBZ0lISmxkSFZ5YmlCamIyNWpZWFFvYm1GMGFYWmxWbWx5ZEhWaGJFRjFaR2x2VG05a1pYTXNJR04xYzNSdmJWWnBjblIxWVd4QmRXUnBiMDV2WkdWektUdGNiaUFnZlZ4dVhHNGdJR1JsWm1sdVpVNXZaR1VnS0hCaGNtRnRjeXdnYm1GdFpTa2dlMXh1SUNBZ0lHbG1JQ2gwYUdsekxtRjFaR2x2UTI5dWRHVjRkRnRnWTNKbFlYUmxKSHRqWVhCcGRHRnNhWHBsUm1seWMzUW9ibUZ0WlNsOVlGMHBJSHRjYmlBZ0lDQWdJSFJvY205M0lHNWxkeUJGY25KdmNpaGdKSHR1WVcxbGZTQnBjeUJoSUhOMFlXNWtZWEprSUdGMVpHbHZJRzV2WkdVZ2JtRnRaU0JoYm1RZ1kyRnVibTkwSUdKbElHOTJaWEozY21sMGRHVnVZQ2s3WEc0Z0lDQWdmVnh1SUNBZ0lIUm9hWE11WTNWemRHOXRUbTlrWlhOYmJtRnRaVjBnUFNBb0tTQTlQaUJ3WVhKaGJYTTdYRzRnSUNBZ2NtVjBkWEp1SUhSb2FYTTdYRzRnSUgxY2JseHVJQ0IxY0dSaGRHVWdLSFpwY25SMVlXeEJkV1JwYjA1dlpHVlFZWEpoYlhNcElIdGNiaUFnSUNCcFppQW9ZVzU1S0hCeWIzQkZjU2duYVdRbkxDQjFibVJsWm1sdVpXUXBMQ0IyYVhKMGRXRnNRWFZrYVc5T2IyUmxVR0Z5WVcxektTa2dlMXh1SUNBZ0lDQWdkR2h5YjNjZ2JtVjNJRVZ5Y205eUtDZEZkbVZ5ZVNCMmFYSjBkV0ZzUVhWa2FXOU9iMlJsSUc1bFpXUnpJR0Z1SUdsa0lHWnZjaUJsWm1acFkybGxiblFnWkdsbVptbHVaeUJoYm1RZ1pHVjBaWEp0YVc1cGJtY2djbVZzWVhScGIyNXphR2x3Y3lCaVpYUjNaV1Z1SUc1dlpHVnpKeWs3WEc0Z0lDQWdmVnh1WEc0Z0lDQWdkR2hwY3k1ZmNtVnRiM1psVlhCa1lYUmxRVzVrUTNKbFlYUmxLSFpwY25SMVlXeEJkV1JwYjA1dlpHVlFZWEpoYlhNcE8xeHVJQ0FnSUdOdmJtNWxZM1JCZFdScGIwNXZaR1Z6S0VOMWMzUnZiVlpwY25SMVlXeEJkV1JwYjA1dlpHVXNJSFJvYVhNdWRtbHlkSFZoYkVGMVpHbHZSM0poY0dnc0lDaDJhWEowZFdGc1FYVmthVzlPYjJSbEtTQTlQbHh1SUNBZ0lDQWdkbWx5ZEhWaGJFRjFaR2x2VG05a1pTNWpiMjV1WldOMEtIUm9hWE11YjNWMGNIVjBLU2s3WEc1Y2JpQWdJQ0J5WlhSMWNtNGdkR2hwY3p0Y2JpQWdmVnh1ZlZ4dVhHNXRiMlIxYkdVdVpYaHdiM0owY3lBOUlGWnBjblIxWVd4QmRXUnBiMGR5WVhCb08xeHVJbDE5IiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vVmlydHVhbEF1ZGlvR3JhcGgnKTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTlvYjIxbEwySXZaR1YyTDNacGNuUjFZV3d0WVhWa2FXOHRaM0poY0dndmMzSmpMMmx1WkdWNExtcHpJbDBzSW01aGJXVnpJanBiWFN3aWJXRndjR2x1WjNNaU9pSTdPMEZCUVVFc1RVRkJUU3hEUVVGRExFOUJRVThzUjBGQlJ5eFBRVUZQTEVOQlFVTXNjVUpCUVhGQ0xFTkJRVU1zUTBGQlF5SXNJbVpwYkdVaU9pSXZhRzl0WlM5aUwyUmxkaTkyYVhKMGRXRnNMV0YxWkdsdkxXZHlZWEJvTDNOeVl5OXBibVJsZUM1cWN5SXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJJbTF2WkhWc1pTNWxlSEJ2Y25SeklEMGdjbVZ4ZFdseVpTZ25MaTlXYVhKMGRXRnNRWFZrYVc5SGNtRndhQ2NwT3lKZGZRPT0iLCJcInVzZSBzdHJpY3RcIjtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoc3RyKSB7XG4gIHJldHVybiBzdHJbMF0udG9VcHBlckNhc2UoKSArIHN0ci5zbGljZSgxKTtcbn07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk5b2IyMWxMMkl2WkdWMkwzWnBjblIxWVd3dFlYVmthVzh0WjNKaGNHZ3ZjM0pqTDNSdmIyeHpMMk5oY0dsMFlXeHBlbVZHYVhKemRDNXFjeUpkTENKdVlXMWxjeUk2VzEwc0ltMWhjSEJwYm1keklqb2lPenRCUVVGQkxFMUJRVTBzUTBGQlF5eFBRVUZQTEVkQlFVY3NWVUZCUXl4SFFVRkhPMU5CUVVzc1IwRkJSeXhEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETEZkQlFWY3NSVUZCUlN4SFFVRkhMRWRCUVVjc1EwRkJReXhMUVVGTExFTkJRVU1zUTBGQlF5eERRVUZETzBOQlFVRXNRMEZCUXlJc0ltWnBiR1VpT2lJdmFHOXRaUzlpTDJSbGRpOTJhWEowZFdGc0xXRjFaR2x2TFdkeVlYQm9MM055WXk5MGIyOXNjeTlqWVhCcGRHRnNhWHBsUm1seWMzUXVhbk1pTENKemIzVnlZMlZ6UTI5dWRHVnVkQ0k2V3lKdGIyUjFiR1V1Wlhod2IzSjBjeUE5SUNoemRISXBJRDArSUhOMGNsc3dYUzUwYjFWd2NHVnlRMkZ6WlNncElDc2djM1J5TG5Oc2FXTmxLREVwTzF4dUlsMTkiLCIndXNlIHN0cmljdCc7XG5cbnZhciBfcmVxdWlyZSA9IHJlcXVpcmUoJ3JhbWRhJyk7XG5cbnZhciBmaW5kID0gX3JlcXVpcmUuZmluZDtcbnZhciBmb3JFYWNoID0gX3JlcXVpcmUuZm9yRWFjaDtcbnZhciBwcm9wRXEgPSBfcmVxdWlyZS5wcm9wRXE7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKEN1c3RvbVZpcnR1YWxBdWRpb05vZGUsIHZpcnR1YWxBdWRpb05vZGVzKSB7XG4gIHZhciBoYW5kbGVDb25uZWN0aW9uVG9PdXRwdXQgPSBhcmd1bWVudHNbMl0gPT09IHVuZGVmaW5lZCA/IGZ1bmN0aW9uICgpIHt9IDogYXJndW1lbnRzWzJdO1xuICByZXR1cm4gZm9yRWFjaChmdW5jdGlvbiAodmlydHVhbEF1ZGlvTm9kZSkge1xuICAgIGZvckVhY2goZnVuY3Rpb24gKGNvbm5lY3Rpb24pIHtcbiAgICAgIGlmIChjb25uZWN0aW9uID09PSAnb3V0cHV0Jykge1xuICAgICAgICBoYW5kbGVDb25uZWN0aW9uVG9PdXRwdXQodmlydHVhbEF1ZGlvTm9kZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgZGVzdGluYXRpb25WaXJ0dWFsQXVkaW9Ob2RlID0gZmluZChwcm9wRXEoJ2lkJywgY29ubmVjdGlvbikpKHZpcnR1YWxBdWRpb05vZGVzKTtcbiAgICAgICAgaWYgKGRlc3RpbmF0aW9uVmlydHVhbEF1ZGlvTm9kZSBpbnN0YW5jZW9mIEN1c3RvbVZpcnR1YWxBdWRpb05vZGUpIHtcbiAgICAgICAgICBmb3JFYWNoKHZpcnR1YWxBdWRpb05vZGUuY29ubmVjdC5iaW5kKHZpcnR1YWxBdWRpb05vZGUpLCBkZXN0aW5hdGlvblZpcnR1YWxBdWRpb05vZGUuaW5wdXRzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2aXJ0dWFsQXVkaW9Ob2RlLmNvbm5lY3QoZGVzdGluYXRpb25WaXJ0dWFsQXVkaW9Ob2RlLmF1ZGlvTm9kZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LCB2aXJ0dWFsQXVkaW9Ob2RlLm91dHB1dCk7XG4gIH0sIHZpcnR1YWxBdWRpb05vZGVzKTtcbn07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk5b2IyMWxMMkl2WkdWMkwzWnBjblIxWVd3dFlYVmthVzh0WjNKaGNHZ3ZjM0pqTDNSdmIyeHpMMk52Ym01bFkzUkJkV1JwYjA1dlpHVnpMbXB6SWwwc0ltNWhiV1Z6SWpwYlhTd2liV0Z3Y0dsdVozTWlPaUk3TzJWQlFXZERMRTlCUVU4c1EwRkJReXhQUVVGUExFTkJRVU03TzBsQlFYcERMRWxCUVVrc1dVRkJTaXhKUVVGSk8wbEJRVVVzVDBGQlR5eFpRVUZRTEU5QlFVODdTVUZCUlN4TlFVRk5MRmxCUVU0c1RVRkJUVHM3UVVGRk5VSXNUVUZCVFN4RFFVRkRMRTlCUVU4c1IwRkJSeXhWUVVGRExITkNRVUZ6UWl4RlFVRkZMR2xDUVVGcFFqdE5RVUZGTEhkQ1FVRjNRaXhuUTBGQlJ5eFpRVUZKTEVWQlFVVTdVMEZETlVZc1QwRkJUeXhEUVVGRExGVkJRVU1zWjBKQlFXZENMRVZCUVVzN1FVRkROVUlzVjBGQlR5eERRVUZETEZWQlFVTXNWVUZCVlN4RlFVRkxPMEZCUTNSQ0xGVkJRVWtzVlVGQlZTeExRVUZMTEZGQlFWRXNSVUZCUlR0QlFVTXpRaXhuUTBGQmQwSXNRMEZCUXl4blFrRkJaMElzUTBGQlF5eERRVUZETzA5QlF6VkRMRTFCUVUwN1FVRkRUQ3haUVVGTkxESkNRVUV5UWl4SFFVRkhMRWxCUVVrc1EwRkJReXhOUVVGTkxFTkJRVU1zU1VGQlNTeEZRVUZGTEZWQlFWVXNRMEZCUXl4RFFVRkRMRU5CUVVNc2FVSkJRV2xDTEVOQlFVTXNRMEZCUXp0QlFVTjBSaXhaUVVGSkxESkNRVUV5UWl4WlFVRlpMSE5DUVVGelFpeEZRVUZGTzBGQlEycEZMR2xDUVVGUExFTkJRVU1zWjBKQlFXZENMRU5CUVVNc1QwRkJUeXhEUVVGRExFbEJRVWtzUTBGQlF5eG5Ra0ZCWjBJc1EwRkJReXhGUVVGRkxESkNRVUV5UWl4RFFVRkRMRTFCUVUwc1EwRkJReXhEUVVGRE8xTkJRemxHTEUxQlFVMDdRVUZEVEN3d1FrRkJaMElzUTBGQlF5eFBRVUZQTEVOQlFVTXNNa0pCUVRKQ0xFTkJRVU1zVTBGQlV5eERRVUZETEVOQlFVTTdVMEZEYWtVN1QwRkRSanRMUVVOR0xFVkJRVVVzWjBKQlFXZENMRU5CUVVNc1RVRkJUU3hEUVVGRExFTkJRVU03UjBGRE4wSXNSVUZCUlN4cFFrRkJhVUlzUTBGQlF6dERRVUZCTEVOQlFVTWlMQ0ptYVd4bElqb2lMMmh2YldVdllpOWtaWFl2ZG1seWRIVmhiQzFoZFdScGJ5MW5jbUZ3YUM5emNtTXZkRzl2YkhNdlkyOXVibVZqZEVGMVpHbHZUbTlrWlhNdWFuTWlMQ0p6YjNWeVkyVnpRMjl1ZEdWdWRDSTZXeUpqYjI1emRDQjdabWx1WkN3Z1ptOXlSV0ZqYUN3Z2NISnZjRVZ4ZlNBOUlISmxjWFZwY21Vb0ozSmhiV1JoSnlrN1hHNWNibTF2WkhWc1pTNWxlSEJ2Y25SeklEMGdLRU4xYzNSdmJWWnBjblIxWVd4QmRXUnBiMDV2WkdVc0lIWnBjblIxWVd4QmRXUnBiMDV2WkdWekxDQm9ZVzVrYkdWRGIyNXVaV04wYVc5dVZHOVBkWFJ3ZFhRZ1BTQW9LVDArZTMwcElEMCtYRzRnSUdadmNrVmhZMmdvS0hacGNuUjFZV3hCZFdScGIwNXZaR1VwSUQwK0lIdGNiaUFnSUNCbWIzSkZZV05vS0NoamIyNXVaV04wYVc5dUtTQTlQaUI3WEc0Z0lDQWdJQ0JwWmlBb1kyOXVibVZqZEdsdmJpQTlQVDBnSjI5MWRIQjFkQ2NwSUh0Y2JpQWdJQ0FnSUNBZ2FHRnVaR3hsUTI5dWJtVmpkR2x2YmxSdlQzVjBjSFYwS0hacGNuUjFZV3hCZFdScGIwNXZaR1VwTzF4dUlDQWdJQ0FnZlNCbGJITmxJSHRjYmlBZ0lDQWdJQ0FnWTI5dWMzUWdaR1Z6ZEdsdVlYUnBiMjVXYVhKMGRXRnNRWFZrYVc5T2IyUmxJRDBnWm1sdVpDaHdjbTl3UlhFb1hDSnBaRndpTENCamIyNXVaV04wYVc5dUtTa29kbWx5ZEhWaGJFRjFaR2x2VG05a1pYTXBPMXh1SUNBZ0lDQWdJQ0JwWmlBb1pHVnpkR2x1WVhScGIyNVdhWEowZFdGc1FYVmthVzlPYjJSbElHbHVjM1JoYm1ObGIyWWdRM1Z6ZEc5dFZtbHlkSFZoYkVGMVpHbHZUbTlrWlNrZ2UxeHVJQ0FnSUNBZ0lDQWdJR1p2Y2tWaFkyZ29kbWx5ZEhWaGJFRjFaR2x2VG05a1pTNWpiMjV1WldOMExtSnBibVFvZG1seWRIVmhiRUYxWkdsdlRtOWtaU2tzSUdSbGMzUnBibUYwYVc5dVZtbHlkSFZoYkVGMVpHbHZUbTlrWlM1cGJuQjFkSE1wTzF4dUlDQWdJQ0FnSUNCOUlHVnNjMlVnZTF4dUlDQWdJQ0FnSUNBZ0lIWnBjblIxWVd4QmRXUnBiMDV2WkdVdVkyOXVibVZqZENoa1pYTjBhVzVoZEdsdmJsWnBjblIxWVd4QmRXUnBiMDV2WkdVdVlYVmthVzlPYjJSbEtUdGNiaUFnSUNBZ0lDQWdmVnh1SUNBZ0lDQWdmVnh1SUNBZ0lIMHNJSFpwY25SMVlXeEJkV1JwYjA1dlpHVXViM1YwY0hWMEtUdGNiaUFnZlN3Z2RtbHlkSFZoYkVGMVpHbHZUbTlrWlhNcE8xeHVJbDE5IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgY2FwaXRhbGl6ZUZpcnN0ID0gcmVxdWlyZSgnLi9jYXBpdGFsaXplRmlyc3QnKTtcblxudmFyIG5hbWVzVG9QYXJhbXNLZXkgPSB7XG4gIGRlbGF5OiAnbWF4RGVsYXlUaW1lJ1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoYXVkaW9Db250ZXh0LCBuYW1lLCBjb25zdHJ1Y3RvclBhcmFtcykge1xuICB2YXIgY29uc3RydWN0b3JQYXJhbXNLZXkgPSBuYW1lc1RvUGFyYW1zS2V5W25hbWVdO1xuICB2YXIgYXVkaW9Ob2RlID0gY29uc3RydWN0b3JQYXJhbXNLZXkgPyBhdWRpb0NvbnRleHRbJ2NyZWF0ZScgKyBjYXBpdGFsaXplRmlyc3QobmFtZSldKGNvbnN0cnVjdG9yUGFyYW1zW2NvbnN0cnVjdG9yUGFyYW1zS2V5XSkgOiBhdWRpb0NvbnRleHRbJ2NyZWF0ZScgKyBjYXBpdGFsaXplRmlyc3QobmFtZSldKCk7XG4gIGlmIChuYW1lID09PSAnb3NjaWxsYXRvcicpIHtcbiAgICBhdWRpb05vZGUuc3RhcnQoKTtcbiAgfVxuICByZXR1cm4gYXVkaW9Ob2RlO1xufTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTlvYjIxbEwySXZaR1YyTDNacGNuUjFZV3d0WVhWa2FXOHRaM0poY0dndmMzSmpMM1J2YjJ4ekwyTnlaV0YwWlVGMVpHbHZUbTlrWlM1cWN5SmRMQ0p1WVcxbGN5STZXMTBzSW0xaGNIQnBibWR6SWpvaU96dEJRVUZCTEVsQlFVMHNaVUZCWlN4SFFVRkhMRTlCUVU4c1EwRkJReXh0UWtGQmJVSXNRMEZCUXl4RFFVRkRPenRCUVVWeVJDeEpRVUZOTEdkQ1FVRm5RaXhIUVVGSE8wRkJRM1pDTEU5QlFVc3NSVUZCUlN4alFVRmpPME5CUTNSQ0xFTkJRVU03TzBGQlJVWXNUVUZCVFN4RFFVRkRMRTlCUVU4c1IwRkJSeXhWUVVGRExGbEJRVmtzUlVGQlJTeEpRVUZKTEVWQlFVVXNhVUpCUVdsQ0xFVkJRVXM3UVVGRE1VUXNUVUZCVFN4dlFrRkJiMElzUjBGQlJ5eG5Ra0ZCWjBJc1EwRkJReXhKUVVGSkxFTkJRVU1zUTBGQlF6dEJRVU53UkN4TlFVRk5MRk5CUVZNc1IwRkJSeXh2UWtGQmIwSXNSMEZEY0VNc1dVRkJXU3haUVVGVkxHVkJRV1VzUTBGQlF5eEpRVUZKTEVOQlFVTXNRMEZCUnl4RFFVRkRMR2xDUVVGcFFpeERRVUZETEc5Q1FVRnZRaXhEUVVGRExFTkJRVU1zUjBGRGRrWXNXVUZCV1N4WlFVRlZMR1ZCUVdVc1EwRkJReXhKUVVGSkxFTkJRVU1zUTBGQlJ5eEZRVUZGTEVOQlFVTTdRVUZEYmtRc1RVRkJTU3hKUVVGSkxFdEJRVXNzV1VGQldTeEZRVUZGTzBGQlEzcENMR0ZCUVZNc1EwRkJReXhMUVVGTExFVkJRVVVzUTBGQlF6dEhRVU51UWp0QlFVTkVMRk5CUVU4c1UwRkJVeXhEUVVGRE8wTkJRMnhDTEVOQlFVTWlMQ0ptYVd4bElqb2lMMmh2YldVdllpOWtaWFl2ZG1seWRIVmhiQzFoZFdScGJ5MW5jbUZ3YUM5emNtTXZkRzl2YkhNdlkzSmxZWFJsUVhWa2FXOU9iMlJsTG1weklpd2ljMjkxY21ObGMwTnZiblJsYm5RaU9sc2lZMjl1YzNRZ1kyRndhWFJoYkdsNlpVWnBjbk4wSUQwZ2NtVnhkV2x5WlNnbkxpOWpZWEJwZEdGc2FYcGxSbWx5YzNRbktUdGNibHh1WTI5dWMzUWdibUZ0WlhOVWIxQmhjbUZ0YzB0bGVTQTlJSHRjYmlBZ1pHVnNZWGs2SUNkdFlYaEVaV3hoZVZScGJXVW5MRnh1ZlR0Y2JseHViVzlrZFd4bExtVjRjRzl5ZEhNZ1BTQW9ZWFZrYVc5RGIyNTBaWGgwTENCdVlXMWxMQ0JqYjI1emRISjFZM1J2Y2xCaGNtRnRjeWtnUFQ0Z2UxeHVJQ0JqYjI1emRDQmpiMjV6ZEhKMVkzUnZjbEJoY21GdGMwdGxlU0E5SUc1aGJXVnpWRzlRWVhKaGJYTkxaWGxiYm1GdFpWMDdYRzRnSUdOdmJuTjBJR0YxWkdsdlRtOWtaU0E5SUdOdmJuTjBjblZqZEc5eVVHRnlZVzF6UzJWNUlEOWNiaUFnSUNCaGRXUnBiME52Ym5SbGVIUmJZR055WldGMFpTUjdZMkZ3YVhSaGJHbDZaVVpwY25OMEtHNWhiV1VwZldCZEtHTnZibk4wY25WamRHOXlVR0Z5WVcxelcyTnZibk4wY25WamRHOXlVR0Z5WVcxelMyVjVYU2tnT2x4dUlDQWdJR0YxWkdsdlEyOXVkR1Y0ZEZ0Z1kzSmxZWFJsSkh0allYQnBkR0ZzYVhwbFJtbHljM1FvYm1GdFpTbDlZRjBvS1R0Y2JpQWdhV1lnS0c1aGJXVWdQVDA5SUNkdmMyTnBiR3hoZEc5eUp5a2dlMXh1SUNBZ0lHRjFaR2x2VG05a1pTNXpkR0Z5ZENncE8xeHVJQ0I5WEc0Z0lISmxkSFZ5YmlCaGRXUnBiMDV2WkdVN1hHNTlPMXh1SWwxOSIsIid1c2Ugc3RyaWN0JztcblxudmFyIF9jcmVhdGVDbGFzcyA9IHJlcXVpcmUoJ2JhYmVsLXJ1bnRpbWUvaGVscGVycy9jcmVhdGUtY2xhc3MnKVsnZGVmYXVsdCddO1xuXG52YXIgX2NsYXNzQ2FsbENoZWNrID0gcmVxdWlyZSgnYmFiZWwtcnVudGltZS9oZWxwZXJzL2NsYXNzLWNhbGwtY2hlY2snKVsnZGVmYXVsdCddO1xuXG52YXIgX3JlcXVpcmUgPSByZXF1aXJlKCdyYW1kYScpO1xuXG52YXIgY29udGFpbnMgPSBfcmVxdWlyZS5jb250YWlucztcbnZhciBmaWx0ZXIgPSBfcmVxdWlyZS5maWx0ZXI7XG52YXIgZm9yRWFjaCA9IF9yZXF1aXJlLmZvckVhY2g7XG52YXIga2V5cyA9IF9yZXF1aXJlLmtleXM7XG52YXIgcGljayA9IF9yZXF1aXJlLnBpY2s7XG52YXIgcGx1Y2sgPSBfcmVxdWlyZS5wbHVjaztcbnZhciBwcm9wRXEgPSBfcmVxdWlyZS5wcm9wRXE7XG52YXIgb21pdCA9IF9yZXF1aXJlLm9taXQ7XG5cbnZhciBjb25uZWN0QXVkaW9Ob2RlcyA9IHJlcXVpcmUoJy4uL3Rvb2xzL2Nvbm5lY3RBdWRpb05vZGVzJyk7XG4vLyBpZiB5b3UgdXNlIHRoZSBiZWxvdyBleHRyYWN0IGl0XG4vLyBjb25zdCBjb25zdHJ1Y3RvclBhcmFtc0tleXMgPSBbXG4vLyAgICdtYXhEZWxheVRpbWUnLFxuLy8gXTtcblxubW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBDdXN0b21WaXJ0dWFsQXVkaW9Ob2RlKHZpcnR1YWxBdWRpb0dyYXBoLCB2aXJ0dWFsTm9kZVBhcmFtcykge1xuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBDdXN0b21WaXJ0dWFsQXVkaW9Ob2RlKTtcblxuICAgIHZhciBub2RlID0gdmlydHVhbE5vZGVQYXJhbXMubm9kZTtcbiAgICB2YXIgaWQgPSB2aXJ0dWFsTm9kZVBhcmFtcy5pZDtcbiAgICB2YXIgb3V0cHV0ID0gdmlydHVhbE5vZGVQYXJhbXMub3V0cHV0O1xuXG4gICAgLy8gcGFyYW1zID0gcGFyYW1zIHx8IHt9O1xuICAgIC8vIGNvbnN0IGNvbnN0cnVjdG9yUGFyYW1zID0gcGljayhjb25zdHJ1Y3RvclBhcmFtc0tleXMsIHBhcmFtcyk7XG4gICAgLy8gcGFyYW1zID0gb21pdChjb25zdHJ1Y3RvclBhcmFtc0tleXMsIHBhcmFtcyk7XG4gICAgLy8gdGhpcy51cGRhdGVBdWRpb05vZGUocGFyYW1zKTtcbiAgICB0aGlzLnZpcnR1YWxBdWRpb0dyYXBoID0gdmlydHVhbEF1ZGlvR3JhcGguY3VzdG9tTm9kZXNbbm9kZV0oKTtcbiAgICB0aGlzLnZpcnR1YWxBdWRpb0dyYXBoID0gdmlydHVhbEF1ZGlvR3JhcGguY3JlYXRlVmlydHVhbEF1ZGlvTm9kZXModGhpcy52aXJ0dWFsQXVkaW9HcmFwaCk7XG4gICAgY29ubmVjdEF1ZGlvTm9kZXMoQ3VzdG9tVmlydHVhbEF1ZGlvTm9kZSwgdGhpcy52aXJ0dWFsQXVkaW9HcmFwaCk7XG4gICAgdGhpcy5pZCA9IGlkO1xuICAgIHRoaXMub3V0cHV0ID0gQXJyYXkuaXNBcnJheShvdXRwdXQpID8gb3V0cHV0IDogW291dHB1dF07XG4gIH1cblxuICBfY3JlYXRlQ2xhc3MoQ3VzdG9tVmlydHVhbEF1ZGlvTm9kZSwgW3tcbiAgICBrZXk6ICdjb25uZWN0JyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gY29ubmVjdChkZXN0aW5hdGlvbikge1xuICAgICAgdmFyIG91dHB1dFZpcnR1YWxOb2RlcyA9IGZpbHRlcihmdW5jdGlvbiAoX3JlZikge1xuICAgICAgICB2YXIgb3V0cHV0ID0gX3JlZi5vdXRwdXQ7XG4gICAgICAgIHJldHVybiBjb250YWlucygnb3V0cHV0Jywgb3V0cHV0KTtcbiAgICAgIH0sIHRoaXMudmlydHVhbEF1ZGlvR3JhcGgpO1xuICAgICAgZm9yRWFjaChmdW5jdGlvbiAoYXVkaW9Ob2RlKSB7XG4gICAgICAgIHJldHVybiBhdWRpb05vZGUuY29ubmVjdChkZXN0aW5hdGlvbik7XG4gICAgICB9LCBwbHVjaygnYXVkaW9Ob2RlJywgb3V0cHV0VmlydHVhbE5vZGVzKSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiAndXBkYXRlQXVkaW9Ob2RlJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gdXBkYXRlQXVkaW9Ob2RlKHBhcmFtcykge31cbiAgfSwge1xuICAgIGtleTogJ2lucHV0cycsXG4gICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gcGx1Y2soJ2F1ZGlvTm9kZScsIGZpbHRlcihwcm9wRXEoJ2lucHV0JywgJ2lucHV0JyksIHRoaXMudmlydHVhbEF1ZGlvR3JhcGgpKTtcbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gQ3VzdG9tVmlydHVhbEF1ZGlvTm9kZTtcbn0pKCk7XG5cbi8vIG5lZWQgdG8gaW1wbGVtZW50IHNvbWUgdXBkYXRlIGxvZ2ljIGhlcmVcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTlvYjIxbEwySXZaR1YyTDNacGNuUjFZV3d0WVhWa2FXOHRaM0poY0dndmMzSmpMM1pwY25SMVlXeE9iMlJsUTI5dWMzUnlkV04wYjNKekwwTjFjM1J2YlZacGNuUjFZV3hCZFdScGIwNXZaR1V1YW5NaVhTd2libUZ0WlhNaU9sdGRMQ0p0WVhCd2FXNW5jeUk2SWpzN096czdPMlZCUVhGRkxFOUJRVThzUTBGQlF5eFBRVUZQTEVOQlFVTTdPMGxCUVRsRkxGRkJRVkVzV1VGQlVpeFJRVUZSTzBsQlFVVXNUVUZCVFN4WlFVRk9MRTFCUVUwN1NVRkJSU3hQUVVGUExGbEJRVkFzVDBGQlR6dEpRVUZGTEVsQlFVa3NXVUZCU2l4SlFVRkpPMGxCUVVVc1NVRkJTU3haUVVGS0xFbEJRVWs3U1VGQlJTeExRVUZMTEZsQlFVd3NTMEZCU3p0SlFVRkZMRTFCUVUwc1dVRkJUaXhOUVVGTk8wbEJRVVVzU1VGQlNTeFpRVUZLTEVsQlFVazdPMEZCUTJwRkxFbEJRVTBzYVVKQlFXbENMRWRCUVVjc1QwRkJUeXhEUVVGRExEUkNRVUUwUWl4RFFVRkRMRU5CUVVNN096czdPenRCUVUxb1JTeE5RVUZOTEVOQlFVTXNUMEZCVHp0QlFVTkJMRmRCUkZNc2MwSkJRWE5DTEVOQlF6bENMR2xDUVVGcFFpeEZRVUZGTEdsQ1FVRnBRaXhGUVVGRk96QkNRVVE1UWl4elFrRkJjMEk3TzFGQlJYQkRMRWxCUVVrc1IwRkJaMElzYVVKQlFXbENMRU5CUVhKRExFbEJRVWs3VVVGQlJTeEZRVUZGTEVkQlFWa3NhVUpCUVdsQ0xFTkJRUzlDTEVWQlFVVTdVVUZCUlN4TlFVRk5MRWRCUVVrc2FVSkJRV2xDTEVOQlFUTkNMRTFCUVUwN096czdPenRCUVV0eVFpeFJRVUZKTEVOQlFVTXNhVUpCUVdsQ0xFZEJRVWNzYVVKQlFXbENMRU5CUVVNc1YwRkJWeXhEUVVGRExFbEJRVWtzUTBGQlF5eEZRVUZGTEVOQlFVTTdRVUZETDBRc1VVRkJTU3hEUVVGRExHbENRVUZwUWl4SFFVRkhMR2xDUVVGcFFpeERRVUZETEhWQ1FVRjFRaXhEUVVGRExFbEJRVWtzUTBGQlF5eHBRa0ZCYVVJc1EwRkJReXhEUVVGRE8wRkJRek5HTEhGQ1FVRnBRaXhEUVVGRExITkNRVUZ6UWl4RlFVRkZMRWxCUVVrc1EwRkJReXhwUWtGQmFVSXNRMEZCUXl4RFFVRkRPMEZCUTJ4RkxGRkJRVWtzUTBGQlF5eEZRVUZGTEVkQlFVY3NSVUZCUlN4RFFVRkRPMEZCUTJJc1VVRkJTU3hEUVVGRExFMUJRVTBzUjBGQlJ5eExRVUZMTEVOQlFVTXNUMEZCVHl4RFFVRkRMRTFCUVUwc1EwRkJReXhIUVVGSExFMUJRVTBzUjBGQlJ5eERRVUZETEUxQlFVMHNRMEZCUXl4RFFVRkRPMGRCUTNwRU96dGxRVnB2UWl4elFrRkJjMEk3TzFkQlkyNURMR2xDUVVGRExGZEJRVmNzUlVGQlJUdEJRVU53UWl4VlFVRk5MR3RDUVVGclFpeEhRVUZITEUxQlFVMHNRMEZCUXl4VlFVRkRMRWxCUVZFN1dVRkJVQ3hOUVVGTkxFZEJRVkFzU1VGQlVTeERRVUZRTEUxQlFVMDdaVUZCVFN4UlFVRlJMRU5CUVVNc1VVRkJVU3hGUVVGRkxFMUJRVTBzUTBGQlF6dFBRVUZCTEVWQlFVVXNTVUZCU1N4RFFVRkRMR2xDUVVGcFFpeERRVUZETEVOQlFVTTdRVUZEY0Vjc1lVRkJUeXhEUVVGRExGVkJRVU1zVTBGQlV6dGxRVUZMTEZOQlFWTXNRMEZCUXl4UFFVRlBMRU5CUVVNc1YwRkJWeXhEUVVGRE8wOUJRVUVzUlVGQlJTeExRVUZMTEVOQlFVTXNWMEZCVnl4RlFVRkZMR3RDUVVGclFpeERRVUZETEVOQlFVTXNRMEZCUXp0TFFVTm9SenM3TzFkQlRXVXNlVUpCUVVNc1RVRkJUU3hGUVVGRkxFVkJSWGhDT3pzN1UwRk9WU3haUVVGSE8wRkJRMW9zWVVGQlR5eExRVUZMTEVOQlFVTXNWMEZCVnl4RlFVRkZMRTFCUVUwc1EwRkJReXhOUVVGTkxFTkJRVU1zVDBGQlR5eEZRVUZGTEU5QlFVOHNRMEZCUXl4RlFVRkZMRWxCUVVrc1EwRkJReXhwUWtGQmFVSXNRMEZCUXl4RFFVRkRMRU5CUVVNN1MwRkRja1k3T3p0VFFYSkNiMElzYzBKQlFYTkNPMGxCTUVJMVF5eERRVUZESWl3aVptbHNaU0k2SWk5b2IyMWxMMkl2WkdWMkwzWnBjblIxWVd3dFlYVmthVzh0WjNKaGNHZ3ZjM0pqTDNacGNuUjFZV3hPYjJSbFEyOXVjM1J5ZFdOMGIzSnpMME4xYzNSdmJWWnBjblIxWVd4QmRXUnBiMDV2WkdVdWFuTWlMQ0p6YjNWeVkyVnpRMjl1ZEdWdWRDSTZXeUpqYjI1emRDQjdZMjl1ZEdGcGJuTXNJR1pwYkhSbGNpd2dabTl5UldGamFDd2dhMlY1Y3l3Z2NHbGpheXdnY0d4MVkyc3NJSEJ5YjNCRmNTd2diMjFwZEgwZ1BTQnlaWEYxYVhKbEtDZHlZVzFrWVNjcE8xeHVZMjl1YzNRZ1kyOXVibVZqZEVGMVpHbHZUbTlrWlhNZ1BTQnlaWEYxYVhKbEtDY3VMaTkwYjI5c2N5OWpiMjV1WldOMFFYVmthVzlPYjJSbGN5Y3BPMXh1THk4Z2FXWWdlVzkxSUhWelpTQjBhR1VnWW1Wc2IzY2daWGgwY21GamRDQnBkRnh1THk4Z1kyOXVjM1FnWTI5dWMzUnlkV04wYjNKUVlYSmhiWE5MWlhseklEMGdXMXh1THk4Z0lDQW5iV0Y0UkdWc1lYbFVhVzFsSnl4Y2JpOHZJRjA3WEc1Y2JtMXZaSFZzWlM1bGVIQnZjblJ6SUQwZ1kyeGhjM01nUTNWemRHOXRWbWx5ZEhWaGJFRjFaR2x2VG05a1pTQjdYRzRnSUdOdmJuTjBjblZqZEc5eUlDaDJhWEowZFdGc1FYVmthVzlIY21Gd2FDd2dkbWx5ZEhWaGJFNXZaR1ZRWVhKaGJYTXBJSHRjYmlBZ0lDQnNaWFFnZTI1dlpHVXNJR2xrTENCdmRYUndkWFI5SUQwZ2RtbHlkSFZoYkU1dlpHVlFZWEpoYlhNN1hHNGdJQ0FnTHk4Z2NHRnlZVzF6SUQwZ2NHRnlZVzF6SUh4OElIdDlPMXh1SUNBZ0lDOHZJR052Ym5OMElHTnZibk4wY25WamRHOXlVR0Z5WVcxeklEMGdjR2xqYXloamIyNXpkSEoxWTNSdmNsQmhjbUZ0YzB0bGVYTXNJSEJoY21GdGN5azdYRzRnSUNBZ0x5OGdjR0Z5WVcxeklEMGdiMjFwZENoamIyNXpkSEoxWTNSdmNsQmhjbUZ0YzB0bGVYTXNJSEJoY21GdGN5azdYRzRnSUNBZ0x5OGdkR2hwY3k1MWNHUmhkR1ZCZFdScGIwNXZaR1VvY0dGeVlXMXpLVHRjYmlBZ0lDQjBhR2x6TG5acGNuUjFZV3hCZFdScGIwZHlZWEJvSUQwZ2RtbHlkSFZoYkVGMVpHbHZSM0poY0dndVkzVnpkRzl0VG05a1pYTmJibTlrWlYwb0tUdGNiaUFnSUNCMGFHbHpMblpwY25SMVlXeEJkV1JwYjBkeVlYQm9JRDBnZG1seWRIVmhiRUYxWkdsdlIzSmhjR2d1WTNKbFlYUmxWbWx5ZEhWaGJFRjFaR2x2VG05a1pYTW9kR2hwY3k1MmFYSjBkV0ZzUVhWa2FXOUhjbUZ3YUNrN1hHNGdJQ0FnWTI5dWJtVmpkRUYxWkdsdlRtOWtaWE1vUTNWemRHOXRWbWx5ZEhWaGJFRjFaR2x2VG05a1pTd2dkR2hwY3k1MmFYSjBkV0ZzUVhWa2FXOUhjbUZ3YUNrN1hHNGdJQ0FnZEdocGN5NXBaQ0E5SUdsa08xeHVJQ0FnSUhSb2FYTXViM1YwY0hWMElEMGdRWEp5WVhrdWFYTkJjbkpoZVNodmRYUndkWFFwSUQ4Z2IzVjBjSFYwSURvZ1cyOTFkSEIxZEYwN1hHNGdJSDFjYmx4dUlDQmpiMjV1WldOMElDaGtaWE4wYVc1aGRHbHZiaWtnZTF4dUlDQWdJR052Ym5OMElHOTFkSEIxZEZacGNuUjFZV3hPYjJSbGN5QTlJR1pwYkhSbGNpZ29lMjkxZEhCMWRIMHBJRDArSUdOdmJuUmhhVzV6S0NkdmRYUndkWFFuTENCdmRYUndkWFFwTENCMGFHbHpMblpwY25SMVlXeEJkV1JwYjBkeVlYQm9LVHRjYmlBZ0lDQm1iM0pGWVdOb0tDaGhkV1JwYjA1dlpHVXBJRDArSUdGMVpHbHZUbTlrWlM1amIyNXVaV04wS0dSbGMzUnBibUYwYVc5dUtTd2djR3gxWTJzb0oyRjFaR2x2VG05a1pTY3NJRzkxZEhCMWRGWnBjblIxWVd4T2IyUmxjeWtwTzF4dUlDQjlYRzVjYmlBZ1oyVjBJR2x1Y0hWMGN5QW9LU0I3WEc0Z0lDQWdjbVYwZFhKdUlIQnNkV05yS0NkaGRXUnBiMDV2WkdVbkxDQm1hV3gwWlhJb2NISnZjRVZ4S0NkcGJuQjFkQ2NzSUNkcGJuQjFkQ2NwTENCMGFHbHpMblpwY25SMVlXeEJkV1JwYjBkeVlYQm9LU2s3WEc0Z0lIMWNibHh1SUNCMWNHUmhkR1ZCZFdScGIwNXZaR1VnS0hCaGNtRnRjeWtnZTF4dUlDQWdJQzh2SUc1bFpXUWdkRzhnYVcxd2JHVnRaVzUwSUhOdmJXVWdkWEJrWVhSbElHeHZaMmxqSUdobGNtVmNiaUFnZlZ4dWZUdGNiaUpkZlE9PSIsIid1c2Ugc3RyaWN0JztcblxudmFyIF9jcmVhdGVDbGFzcyA9IHJlcXVpcmUoJ2JhYmVsLXJ1bnRpbWUvaGVscGVycy9jcmVhdGUtY2xhc3MnKVsnZGVmYXVsdCddO1xuXG52YXIgX2NsYXNzQ2FsbENoZWNrID0gcmVxdWlyZSgnYmFiZWwtcnVudGltZS9oZWxwZXJzL2NsYXNzLWNhbGwtY2hlY2snKVsnZGVmYXVsdCddO1xuXG52YXIgY3JlYXRlQXVkaW9Ob2RlID0gcmVxdWlyZSgnLi4vdG9vbHMvY3JlYXRlQXVkaW9Ob2RlJyk7XG5cbnZhciBfcmVxdWlyZSA9IHJlcXVpcmUoJ3JhbWRhJyk7XG5cbnZhciBmb3JFYWNoID0gX3JlcXVpcmUuZm9yRWFjaDtcbnZhciBrZXlzID0gX3JlcXVpcmUua2V5cztcbnZhciBwaWNrID0gX3JlcXVpcmUucGljaztcbnZhciBvbWl0ID0gX3JlcXVpcmUub21pdDtcblxudmFyIGNvbnN0cnVjdG9yUGFyYW1zS2V5cyA9IFsnbWF4RGVsYXlUaW1lJ107XG5cbm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gTmF0aXZlVmlydHVhbEF1ZGlvTm9kZSh2aXJ0dWFsQXVkaW9HcmFwaCwgdmlydHVhbE5vZGVQYXJhbXMpIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgTmF0aXZlVmlydHVhbEF1ZGlvTm9kZSk7XG5cbiAgICB2YXIgbm9kZSA9IHZpcnR1YWxOb2RlUGFyYW1zLm5vZGU7XG4gICAgdmFyIGlkID0gdmlydHVhbE5vZGVQYXJhbXMuaWQ7XG4gICAgdmFyIGlucHV0ID0gdmlydHVhbE5vZGVQYXJhbXMuaW5wdXQ7XG4gICAgdmFyIG91dHB1dCA9IHZpcnR1YWxOb2RlUGFyYW1zLm91dHB1dDtcbiAgICB2YXIgcGFyYW1zID0gdmlydHVhbE5vZGVQYXJhbXMucGFyYW1zO1xuXG4gICAgcGFyYW1zID0gcGFyYW1zIHx8IHt9O1xuICAgIHZhciBjb25zdHJ1Y3RvclBhcmFtcyA9IHBpY2soY29uc3RydWN0b3JQYXJhbXNLZXlzLCBwYXJhbXMpO1xuICAgIHBhcmFtcyA9IG9taXQoY29uc3RydWN0b3JQYXJhbXNLZXlzLCBwYXJhbXMpO1xuICAgIHRoaXMuYXVkaW9Ob2RlID0gY3JlYXRlQXVkaW9Ob2RlKHZpcnR1YWxBdWRpb0dyYXBoLmF1ZGlvQ29udGV4dCwgbm9kZSwgY29uc3RydWN0b3JQYXJhbXMpO1xuICAgIHRoaXMudXBkYXRlQXVkaW9Ob2RlKHBhcmFtcyk7XG4gICAgdGhpcy5pZCA9IGlkO1xuICAgIHRoaXMuaW5wdXQgPSBpbnB1dDtcbiAgICB0aGlzLm91dHB1dCA9IEFycmF5LmlzQXJyYXkob3V0cHV0KSA/IG91dHB1dCA6IFtvdXRwdXRdO1xuICAgIHRoaXMucGFyYW1zID0gcGFyYW1zO1xuICB9XG5cbiAgX2NyZWF0ZUNsYXNzKE5hdGl2ZVZpcnR1YWxBdWRpb05vZGUsIFt7XG4gICAga2V5OiAnY29ubmVjdCcsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGNvbm5lY3QoZGVzdGluYXRpb24pIHtcbiAgICAgIHRoaXMuYXVkaW9Ob2RlLmNvbm5lY3QoZGVzdGluYXRpb24pO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ3VwZGF0ZUF1ZGlvTm9kZScsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHVwZGF0ZUF1ZGlvTm9kZShwYXJhbXMpIHtcbiAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgIHBhcmFtcyA9IG9taXQoY29uc3RydWN0b3JQYXJhbXNLZXlzLCBwYXJhbXMpO1xuICAgICAgZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgIHN3aXRjaCAoa2V5KSB7XG4gICAgICAgICAgY2FzZSAndHlwZSc6XG4gICAgICAgICAgICBfdGhpcy5hdWRpb05vZGVba2V5XSA9IHBhcmFtc1trZXldO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICBfdGhpcy5hdWRpb05vZGVba2V5XS52YWx1ZSA9IHBhcmFtc1trZXldO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9LCBrZXlzKHBhcmFtcykpO1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBOYXRpdmVWaXJ0dWFsQXVkaW9Ob2RlO1xufSkoKTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTlvYjIxbEwySXZaR1YyTDNacGNuUjFZV3d0WVhWa2FXOHRaM0poY0dndmMzSmpMM1pwY25SMVlXeE9iMlJsUTI5dWMzUnlkV04wYjNKekwwNWhkR2wyWlZacGNuUjFZV3hCZFdScGIwNXZaR1V1YW5NaVhTd2libUZ0WlhNaU9sdGRMQ0p0WVhCd2FXNW5jeUk2SWpzN096czdPMEZCUVVFc1NVRkJUU3hsUVVGbExFZEJRVWNzVDBGQlR5eERRVUZETERCQ1FVRXdRaXhEUVVGRExFTkJRVU03TzJWQlEzaENMRTlCUVU4c1EwRkJReXhQUVVGUExFTkJRVU03TzBsQlFUZERMRTlCUVU4c1dVRkJVQ3hQUVVGUE8wbEJRVVVzU1VGQlNTeFpRVUZLTEVsQlFVazdTVUZCUlN4SlFVRkpMRmxCUVVvc1NVRkJTVHRKUVVGRkxFbEJRVWtzV1VGQlNpeEpRVUZKT3p0QlFVVm9ReXhKUVVGTkxIRkNRVUZ4UWl4SFFVRkhMRU5CUXpWQ0xHTkJRV01zUTBGRFppeERRVUZET3p0QlFVVkdMRTFCUVUwc1EwRkJReXhQUVVGUE8wRkJRMEVzVjBGRVV5eHpRa0ZCYzBJc1EwRkRPVUlzYVVKQlFXbENMRVZCUVVVc2FVSkJRV2xDTEVWQlFVVTdNRUpCUkRsQ0xITkNRVUZ6UWpzN1VVRkZjRU1zU1VGQlNTeEhRVUVyUWl4cFFrRkJhVUlzUTBGQmNFUXNTVUZCU1R0UlFVRkZMRVZCUVVVc1IwRkJNa0lzYVVKQlFXbENMRU5CUVRsRExFVkJRVVU3VVVGQlJTeExRVUZMTEVkQlFXOUNMR2xDUVVGcFFpeERRVUV4UXl4TFFVRkxPMUZCUVVVc1RVRkJUU3hIUVVGWkxHbENRVUZwUWl4RFFVRnVReXhOUVVGTk8xRkJRVVVzVFVGQlRTeEhRVUZKTEdsQ1FVRnBRaXhEUVVFelFpeE5RVUZOT3p0QlFVTndReXhWUVVGTkxFZEJRVWNzVFVGQlRTeEpRVUZKTEVWQlFVVXNRMEZCUXp0QlFVTjBRaXhSUVVGTkxHbENRVUZwUWl4SFFVRkhMRWxCUVVrc1EwRkJReXh4UWtGQmNVSXNSVUZCUlN4TlFVRk5MRU5CUVVNc1EwRkJRenRCUVVNNVJDeFZRVUZOTEVkQlFVY3NTVUZCU1N4RFFVRkRMSEZDUVVGeFFpeEZRVUZGTEUxQlFVMHNRMEZCUXl4RFFVRkRPMEZCUXpkRExGRkJRVWtzUTBGQlF5eFRRVUZUTEVkQlFVY3NaVUZCWlN4RFFVRkRMR2xDUVVGcFFpeERRVUZETEZsQlFWa3NSVUZCUlN4SlFVRkpMRVZCUVVVc2FVSkJRV2xDTEVOQlFVTXNRMEZCUXp0QlFVTXhSaXhSUVVGSkxFTkJRVU1zWlVGQlpTeERRVUZETEUxQlFVMHNRMEZCUXl4RFFVRkRPMEZCUXpkQ0xGRkJRVWtzUTBGQlF5eEZRVUZGTEVkQlFVY3NSVUZCUlN4RFFVRkRPMEZCUTJJc1VVRkJTU3hEUVVGRExFdEJRVXNzUjBGQlJ5eExRVUZMTEVOQlFVTTdRVUZEYmtJc1VVRkJTU3hEUVVGRExFMUJRVTBzUjBGQlJ5eExRVUZMTEVOQlFVTXNUMEZCVHl4RFFVRkRMRTFCUVUwc1EwRkJReXhIUVVGSExFMUJRVTBzUjBGQlJ5eERRVUZETEUxQlFVMHNRMEZCUXl4RFFVRkRPMEZCUTNoRUxGRkJRVWtzUTBGQlF5eE5RVUZOTEVkQlFVY3NUVUZCVFN4RFFVRkRPMGRCUTNSQ096dGxRVnB2UWl4elFrRkJjMEk3TzFkQlkyNURMR2xDUVVGRExGZEJRVmNzUlVGQlJUdEJRVU53UWl4VlFVRkpMRU5CUVVNc1UwRkJVeXhEUVVGRExFOUJRVThzUTBGQlF5eFhRVUZYTEVOQlFVTXNRMEZCUXp0TFFVTnlRenM3TzFkQlJXVXNlVUpCUVVNc1RVRkJUU3hGUVVGRk96czdRVUZEZGtJc1dVRkJUU3hIUVVGSExFbEJRVWtzUTBGQlF5eHhRa0ZCY1VJc1JVRkJSU3hOUVVGTkxFTkJRVU1zUTBGQlF6dEJRVU0zUXl4aFFVRlBMRU5CUVVNc1ZVRkJReXhIUVVGSExFVkJRVXM3UVVGRFppeG5Ra0ZCVVN4SFFVRkhPMEZCUTFRc1pVRkJTeXhOUVVGTk8wRkJRMVFzYTBKQlFVc3NVMEZCVXl4RFFVRkRMRWRCUVVjc1EwRkJReXhIUVVGSExFMUJRVTBzUTBGQlF5eEhRVUZITEVOQlFVTXNRMEZCUXp0QlFVTnNReXh0UWtGQlR6dEJRVUZCTEVGQlExUTdRVUZEUlN4clFrRkJTeXhUUVVGVExFTkJRVU1zUjBGQlJ5eERRVUZETEVOQlFVTXNTMEZCU3l4SFFVRkhMRTFCUVUwc1EwRkJReXhIUVVGSExFTkJRVU1zUTBGQlF6dEJRVU40UXl4dFFrRkJUenRCUVVGQkxGTkJRMVk3VDBGRFJpeEZRVUZGTEVsQlFVa3NRMEZCUXl4TlFVRk5MRU5CUVVNc1EwRkJReXhEUVVGRE8wdEJRMnhDT3pzN1UwRTVRbTlDTEhOQ1FVRnpRanRKUVN0Q05VTXNRMEZCUXlJc0ltWnBiR1VpT2lJdmFHOXRaUzlpTDJSbGRpOTJhWEowZFdGc0xXRjFaR2x2TFdkeVlYQm9MM055WXk5MmFYSjBkV0ZzVG05a1pVTnZibk4wY25WamRHOXljeTlPWVhScGRtVldhWEowZFdGc1FYVmthVzlPYjJSbExtcHpJaXdpYzI5MWNtTmxjME52Ym5SbGJuUWlPbHNpWTI5dWMzUWdZM0psWVhSbFFYVmthVzlPYjJSbElEMGdjbVZ4ZFdseVpTZ25MaTR2ZEc5dmJITXZZM0psWVhSbFFYVmthVzlPYjJSbEp5azdYRzVqYjI1emRDQjdabTl5UldGamFDd2dhMlY1Y3l3Z2NHbGpheXdnYjIxcGRIMGdQU0J5WlhGMWFYSmxLQ2R5WVcxa1lTY3BPMXh1WEc1amIyNXpkQ0JqYjI1emRISjFZM1J2Y2xCaGNtRnRjMHRsZVhNZ1BTQmJYRzRnSUNkdFlYaEVaV3hoZVZScGJXVW5MRnh1WFR0Y2JseHViVzlrZFd4bExtVjRjRzl5ZEhNZ1BTQmpiR0Z6Y3lCT1lYUnBkbVZXYVhKMGRXRnNRWFZrYVc5T2IyUmxJSHRjYmlBZ1kyOXVjM1J5ZFdOMGIzSWdLSFpwY25SMVlXeEJkV1JwYjBkeVlYQm9MQ0IyYVhKMGRXRnNUbTlrWlZCaGNtRnRjeWtnZTF4dUlDQWdJR3hsZENCN2JtOWtaU3dnYVdRc0lHbHVjSFYwTENCdmRYUndkWFFzSUhCaGNtRnRjMzBnUFNCMmFYSjBkV0ZzVG05a1pWQmhjbUZ0Y3p0Y2JpQWdJQ0J3WVhKaGJYTWdQU0J3WVhKaGJYTWdmSHdnZTMwN1hHNGdJQ0FnWTI5dWMzUWdZMjl1YzNSeWRXTjBiM0pRWVhKaGJYTWdQU0J3YVdOcktHTnZibk4wY25WamRHOXlVR0Z5WVcxelMyVjVjeXdnY0dGeVlXMXpLVHRjYmlBZ0lDQndZWEpoYlhNZ1BTQnZiV2wwS0dOdmJuTjBjblZqZEc5eVVHRnlZVzF6UzJWNWN5d2djR0Z5WVcxektUdGNiaUFnSUNCMGFHbHpMbUYxWkdsdlRtOWtaU0E5SUdOeVpXRjBaVUYxWkdsdlRtOWtaU2gyYVhKMGRXRnNRWFZrYVc5SGNtRndhQzVoZFdScGIwTnZiblJsZUhRc0lHNXZaR1VzSUdOdmJuTjBjblZqZEc5eVVHRnlZVzF6S1R0Y2JpQWdJQ0IwYUdsekxuVndaR0YwWlVGMVpHbHZUbTlrWlNod1lYSmhiWE1wTzF4dUlDQWdJSFJvYVhNdWFXUWdQU0JwWkR0Y2JpQWdJQ0IwYUdsekxtbHVjSFYwSUQwZ2FXNXdkWFE3WEc0Z0lDQWdkR2hwY3k1dmRYUndkWFFnUFNCQmNuSmhlUzVwYzBGeWNtRjVLRzkxZEhCMWRDa2dQeUJ2ZFhSd2RYUWdPaUJiYjNWMGNIVjBYVHRjYmlBZ0lDQjBhR2x6TG5CaGNtRnRjeUE5SUhCaGNtRnRjenRjYmlBZ2ZWeHVYRzRnSUdOdmJtNWxZM1FnS0dSbGMzUnBibUYwYVc5dUtTQjdYRzRnSUNBZ2RHaHBjeTVoZFdScGIwNXZaR1V1WTI5dWJtVmpkQ2hrWlhOMGFXNWhkR2x2YmlrN1hHNGdJSDFjYmx4dUlDQjFjR1JoZEdWQmRXUnBiMDV2WkdVZ0tIQmhjbUZ0Y3lrZ2UxeHVJQ0FnSUhCaGNtRnRjeUE5SUc5dGFYUW9ZMjl1YzNSeWRXTjBiM0pRWVhKaGJYTkxaWGx6TENCd1lYSmhiWE1wTzF4dUlDQWdJR1p2Y2tWaFkyZ29LR3RsZVNrZ1BUNGdlMXh1SUNBZ0lDQWdjM2RwZEdOb0lDaHJaWGtwSUh0Y2JpQWdJQ0FnSUNBZ1kyRnpaU0FuZEhsd1pTYzZYRzRnSUNBZ0lDQWdJQ0FnZEdocGN5NWhkV1JwYjA1dlpHVmJhMlY1WFNBOUlIQmhjbUZ0YzF0clpYbGRPMXh1SUNBZ0lDQWdJQ0FnSUhKbGRIVnlianRjYmlBZ0lDQWdJQ0FnWkdWbVlYVnNkRHBjYmlBZ0lDQWdJQ0FnSUNCMGFHbHpMbUYxWkdsdlRtOWtaVnRyWlhsZExuWmhiSFZsSUQwZ2NHRnlZVzF6VzJ0bGVWMDdYRzRnSUNBZ0lDQWdJQ0FnY21WMGRYSnVPMXh1SUNBZ0lDQWdmVnh1SUNBZ0lIMHNJR3RsZVhNb2NHRnlZVzF6S1NrN1hHNGdJSDFjYm4wN1hHNGlYWDA9Il19
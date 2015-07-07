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
module.exports = function (string) {
  return string.charAt(0).toUpperCase() + string.substring(1);
}

module.exports.words = function (string) {
  return string.replace(/(^|[^a-zA-Z\u00C0-\u017F'])([a-zA-Z\u00C0-\u017F])/g, function (m) {
    return m.toUpperCase()
  })
}

},{}],8:[function(require,module,exports){
//  Ramda v0.15.1
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
        var len1 = set1.length;
        var len2 = set2.length;
        var result = [];
        idx = 0;
        while (idx < len1) {
            result[result.length] = set1[idx];
            idx += 1;
        }
        idx = 0;
        while (idx < len2) {
            result[result.length] = set2[idx];
            idx += 1;
        }
        return result;
    };

    var _containsWith = function _containsWith(pred, x, list) {
        var idx = 0, len = list.length;
        while (idx < len) {
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

    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is#Polyfill
    // SameValue algorithm
    // Steps 1-5, 7-10
    // Steps 6.b-6.e: +0 != -0
    // Step 6.a: NaN == NaN
    var _eq = function _eq(x, y) {
        // SameValue algorithm
        if (x === y) {
            // Steps 1-5, 7-10
            // Steps 6.b-6.e: +0 != -0
            return x !== 0 || 1 / x === 1 / y;
        } else {
            // Step 6.a: NaN == NaN
            return x !== x && y !== y;
        }
    };

    var _filter = function _filter(fn, list) {
        var idx = 0, len = list.length, result = [];
        while (idx < len) {
            if (fn(list[idx])) {
                result[result.length] = list[idx];
            }
            idx += 1;
        }
        return result;
    };

    var _filterIndexed = function _filterIndexed(fn, list) {
        var idx = 0, len = list.length, result = [];
        while (idx < len) {
            if (fn(list[idx], idx, list)) {
                result[result.length] = list[idx];
            }
            idx += 1;
        }
        return result;
    };

    // i can't bear not to return *something*
    var _forEach = function _forEach(fn, list) {
        var idx = 0, len = list.length;
        while (idx < len) {
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
        var idx = 0, len = list.length, result = [];
        while (idx < len) {
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
            for (var idx = 0, len = paths.length; idx < len && val != null; idx += 1) {
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
        var len = list.length;
        var idx = 0;
        while (idx < len) {
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
        var firstLen = first.length;
        var containsPred = containsWith(pred);
        while (idx < firstLen) {
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
     * Tests if two items are equal.  Equality is strict here, meaning reference equality for objects and
     * non-coercing equality for primitives.
     *
     * Has `Object.is` semantics: `NaN` is considered equal to `NaN`; `0` and `-0`
     * are not considered equal.
     * @see R.identical
     *
     * @func
     * @memberOf R
     * @category Relation
     * @sig a -> a -> Boolean
     * @param {*} a
     * @param {*} b
     * @return {Boolean}
     * @deprecated since v0.15.0
     * @example
     *
     *      var o = {};
     *      R.eq(o, o); //=> true
     *      R.eq(o, {}); //=> false
     *      R.eq(1, 1); //=> true
     *      R.eq(1, '1'); //=> false
     *      R.eq(0, -0); //=> false
     *      R.eq(NaN, NaN); //=> true
     */
    var eq = _curry2(_eq);

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
        var idx = 0, len = list.length;
        while (idx < len) {
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
        var idx = 0, len = pairs.length, out = {};
        while (idx < len) {
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
     *      R.isEmpty([1, 2, 3]);   //=> false
     *      R.isEmpty([]);          //=> true
     *      R.isEmpty('');          //=> true
     *      R.isEmpty(null);        //=> false
     *      R.isEmpty(R.keys({}));  //=> true
     *      R.isEmpty({});          //=> false ({} does not have a length property)
     *      R.isEmpty({length: 0}); //=> true
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
        var idx = 0, len = list.length, result = [], tuple = [acc];
        while (idx < len) {
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
        var idx = 0, len = list.length, result = [];
        while (idx < len) {
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
        var len = names.length;
        while (idx < len) {
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
        var len = ps.length;
        var out = [];
        var idx = 0;
        while (idx < len) {
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
        var idx = 0, len = list.length;
        while (idx < len) {
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
        var idx = 0, len = list.length, result = [acc];
        while (idx < len) {
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
     * Sorts the list according to the supplied function.
     *
     * @func
     * @memberOf R
     * @category Relation
     * @sig Ord b => (a -> b) -> [a] -> [a]
     * @param {Function} fn
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
        var idx = 0, len = list.length;
        var result = [], item;
        while (idx < len) {
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
        var len = props.length;
        var vals = [];
        var idx = 0;
        while (idx < len) {
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
        var ilen = a.length;
        var j;
        var jlen = b.length;
        var result = [];
        while (idx < ilen) {
            j = 0;
            while (j < jlen) {
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
        var idx = 0, len = keys.length, out = {};
        while (idx < len) {
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
            var len = refFrom.length;
            var idx = 0;
            while (idx < len) {
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
            var length = arguments.length;
            if (length === 0) {
                return fn();
            }
            var obj = arguments[length - 1];
            return _isArray(obj) || typeof obj[methodname] !== 'function' ? fn.apply(this, arguments) : obj[methodname].apply(obj, _slice(arguments, 0, length - 1));
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
            var length = arguments.length;
            if (length === 0) {
                return fn();
            }
            var obj = arguments[length - 1];
            if (!_isArray(obj)) {
                var args = _slice(arguments, 0, length - 1);
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
        var idx = 0, length = props.length;
        while (idx < length) {
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
            var value, result = [], idx = 0, j, ilen = list.length, jlen;
            while (idx < ilen) {
                if (isArrayLike(list[idx])) {
                    value = recursive ? flatt(list[idx]) : list[idx];
                    j = 0;
                    jlen = value.length;
                    while (j < jlen) {
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
            var idx = 0, len = list.length;
            while (idx < len) {
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
        var idx = 0, len = list.length;
        while (idx < len && pred(list[idx])) {
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
        var len = list.length;
        while (idx < len) {
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
        var len = list.length;
        while (idx < len) {
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
        var length = list.length;
        while (idx < length) {
            if (idx === length - 1) {
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
        var len = props.length;
        var idx = 0;
        var out = {};
        while (idx < len) {
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
        var len = props.length;
        var idx = 0;
        var out = {};
        while (idx < len) {
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
    var lensIndex = _curry1(function lensIndex(n) {
        return lens(nth(n), update(n));
    });

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
    var lensProp = _curry1(function lensProp(k) {
        return lens(prop(k), assoc(k));
    });

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
     * Create a new object with the own properties of `a`
     * merged with the own properties of object `b`.
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
     * Dispatches to its third argument's `slice` method if present. As a
     * result, one may replace `[a]` with `String` in the type signature.
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
     *      R.slice(1, 3, ['a', 'b', 'c', 'd']);        //=> ['b', 'c']
     *      R.slice(1, Infinity, ['a', 'b', 'c', 'd']); //=> ['b', 'c', 'd']
     *      R.slice(0, -1, ['a', 'b', 'c', 'd']);       //=> ['a', 'b', 'c']
     *      R.slice(-3, -1, ['a', 'b', 'c', 'd']);      //=> ['b', 'c']
     *      R.slice(0, 3, 'ramda');                     //=> 'ram'
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
     * Dispatches to its second argument's `slice` method if present. As a
     * result, one may replace `[a]` with `String` in the type signature.
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
     *      R.take(1, ['foo', 'bar', 'baz']); //=> ['foo']
     *      R.take(2, ['foo', 'bar', 'baz']); //=> ['foo', 'bar']
     *      R.take(3, ['foo', 'bar', 'baz']); //=> ['foo', 'bar', 'baz']
     *      R.take(4, ['foo', 'bar', 'baz']); //=> ['foo', 'bar', 'baz']
     *      R.take(3, 'ramda');               //=> 'ram'
     *
     *      var personnel = [
     *        'Dave Brubeck',
     *        'Paul Desmond',
     *        'Eugene Wright',
     *        'Joe Morello',
     *        'Gerry Mulligan',
     *        'Bob Bates',
     *        'Joe Dodge',
     *        'Ron Crotty'
     *      ];
     *
     *      takeFive(personnel);
     *      //=> ['Dave Brubeck', 'Paul Desmond', 'Eugene Wright', 'Joe Morello', 'Gerry Mulligan']
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
        var idx = 0, len = list.length;
        while (idx < len && fn(list[idx])) {
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
    var uniq = uniqWith(equals);

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
        var idx = 0, len = list.length;
        if (typeof from === 'number') {
            idx = from < 0 ? Math.max(0, len + from) : from;
        }
        while (idx < len) {
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
     * @func
     * @memberOf R
     * @category List
     * @see R.commute
     * @sig Functor f => (f a -> f b) -> (x -> f x) -> [f a] -> f [b]
     * @param {Function} fn The transformation function
     * @param {Function} of A function that returns the data type to return
     * @param {Array} list An array of functors of the same type
     * @return {*}
     * @example
     *
     *      R.commuteMap(R.map(R.add(10)), R.of, [[1], [2, 3]]);   //=> [[11, 12], [11, 13]]
     *      R.commuteMap(R.map(R.add(10)), R.of, [[1, 2], [3]]);   //=> [[11, 13], [12, 13]]
     *      R.commuteMap(R.map(R.add(10)), R.of, [[1], [2], [3]]); //=> [[11, 12, 13]]
     *      R.commuteMap(R.map(R.add(10)), Maybe.of, [Just(1), Just(2), Just(3)]);   //=> Just([11, 12, 13])
     *      R.commuteMap(R.map(R.add(10)), Maybe.of, [Just(1), Just(2), Nothing()]); //=> Nothing()
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
     * Dispatches to its second argument's `slice` method if present. As a
     * result, one may replace `[a]` with `String` in the type signature.
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
     *      R.drop(1, ['foo', 'bar', 'baz']); //=> ['bar', 'baz']
     *      R.drop(2, ['foo', 'bar', 'baz']); //=> ['baz']
     *      R.drop(3, ['foo', 'bar', 'baz']); //=> []
     *      R.drop(4, ['foo', 'bar', 'baz']); //=> []
     *      R.drop(3, 'ramda');               //=> 'da'
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
        var len = list.length;
        if (len !== 0) {
            result[0] = list[0];
            while (idx < len) {
                if (!pred(last(result), list[idx])) {
                    result[result.length] = list[idx];
                }
                idx += 1;
            }
        }
        return result;
    }));

    /**
     * Performs a deep test on whether two items are equal.
     * Equality implies the two items are semmatically equivalent.
     * Cyclic structures are handled as expected
     * @see R.equals
     *
     * @func
     * @memberOf R
     * @category Relation
     * @sig a -> b -> Boolean
     * @param {*} a
     * @param {*} b
     * @return {Boolean}
     * @deprecated since v0.15.0
     * @example
     *
     *      var o = {};
     *      R.eqDeep(o, o); //=> true
     *      R.eqDeep(o, {}); //=> true
     *      R.eqDeep(1, 1); //=> true
     *      R.eqDeep(1, '1'); //=> false
     *
     *      var a = {}; a.v = a;
     *      var b = {}; b.v = b;
     *      R.eqDeep(a, b); //=> true
     */
    var eqDeep = equals;

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
        var len = list.length;
        var idx = 0;
        while (idx < len) {
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
        var len = list.length;
        if (len === 0) {
            return NaN;
        }
        var width = 2 - len % 2;
        var idx = (len - width) / 2;
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
        var tlen = transformers.length;
        return curry(arity(tlen, function () {
            var args = [], idx = 0;
            while (idx < tlen) {
                args[idx] = transformers[idx](arguments[idx]);
                idx += 1;
            }
            return fn.apply(this, args.concat(_slice(arguments, tlen)));
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
     * @func
     * @memberOf R
     * @category List
     * @see R.commuteMap
     * @sig Functor f => (x -> f x) -> [f a] -> f [a]
     * @param {Function} of A function that returns the data type to return
     * @param {Array} list An array of functors of the same type
     * @return {*}
     * @example
     *
     *      R.commute(R.of, [[1], [2, 3]]);   //=> [[1, 2], [1, 3]]
     *      R.commute(R.of, [[1, 2], [3]]);   //=> [[1, 3], [2, 3]]
     *      R.commute(R.of, [[1], [2], [3]]); //=> [[1, 2, 3]]
     *      R.commute(Maybe.of, [Just(1), Just(2), Just(3)]);   //=> Just([1, 2, 3])
     *      R.commute(Maybe.of, [Just(1), Just(2), Nothing()]); //=> Nothing()
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
        var firstLen = first.length;
        while (idx < firstLen) {
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
        eq: eq,
        eqDeep: eqDeep,
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

},{}],9:[function(require,module,exports){
"use strict";

var VirtualAudioGraph = require("../src/index.js");
var audioContext = new AudioContext();

describe("VirtualAudioGraph", function () {
  it("optionally takes audioContext property", function () {
    expect(new VirtualAudioGraph({ audioContext: audioContext }).audioContext).toBe(audioContext);
    expect(new VirtualAudioGraph().audioContext instanceof AudioContext).toBe(true);
  });

  it("optionally takes output parameter", function () {
    expect(new VirtualAudioGraph({
      output: audioContext.destination
    }).output).toBe(audioContext.destination);
    expect(new VirtualAudioGraph({ audioContext: audioContext }).output).toBe(audioContext.destination);
  });
});


},{"../src/index.js":15}],10:[function(require,module,exports){
"use strict";

WebAudioTestAPI.setState("AudioContext#createStereoPanner", "enabled");
require("./VirtualAudioGraph");
require("./virtualAudioGraph.defineNode");
require("./virtualAudioGraph.update");


},{"./VirtualAudioGraph":9,"./virtualAudioGraph.defineNode":12,"./virtualAudioGraph.update":13}],11:[function(require,module,exports){
'use strict';

module.exports = function () {
  var params = arguments[0] === undefined ? {} : arguments[0];
  var decay = params.decay;
  var delayTime = params.delayTime;
  var maxDelayTime = params.maxDelayTime;

  decay = decay !== undefined ? decay : 1 / 3;
  delayTime = delayTime !== undefined ? delayTime : 1 / 3;
  maxDelayTime = maxDelayTime !== undefined ? maxDelayTime : 1 / 3;

  return [{
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
      maxDelayTime: maxDelayTime,
      delayTime: delayTime
    }
  }, {
    id: 3,
    node: 'gain',
    output: 2,
    params: {
      gain: decay
    }
  }, {
    id: 4,
    node: 'delay',
    output: [0, 3],
    params: {
      maxDelayTime: maxDelayTime,
      delayTime: delayTime
    }
  }, {
    id: 5,
    input: 'input',
    node: 'gain',
    output: 4,
    params: {
      gain: decay
    }
  }];
};


},{}],12:[function(require,module,exports){
'use strict';

var _require = require('ramda');

var equals = _require.equals;

var VirtualAudioGraph = require('../src/index.js');
var pingPongDelayParamsFactory = require('./tools/pingPongDelayParamsFactory');

describe('virtualAudioGraph.defineNode', function () {
  var audioContext = undefined;
  var virtualAudioGraph = undefined;

  beforeEach(function () {
    audioContext = new AudioContext();
    virtualAudioGraph = new VirtualAudioGraph({
      audioContext: audioContext,
      output: audioContext.destination
    });
  });

  it('returns itself', function () {
    expect(virtualAudioGraph.defineNode(pingPongDelayParamsFactory, 'pingPongDelay')).toBe(virtualAudioGraph);
  });

  it('throws if name provided is a standard node', function () {
    expect(function () {
      return virtualAudioGraph.defineNode(pingPongDelayParamsFactory, 'gain');
    }).toThrow();
  });

  it('creates a custom node internally', function () {
    virtualAudioGraph.defineNode(pingPongDelayParamsFactory, 'pingPongDelay');

    expect(typeof virtualAudioGraph.customNodes.pingPongDelay).toBe('function');
  });

  it('creates a custom node which can be reused in virtualAudioGraph.update', function () {
    virtualAudioGraph.defineNode(pingPongDelayParamsFactory, 'pingPongDelay');

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
      output: 0,
      params: {
        decay: 0.5,
        delayTime: 0.5,
        maxDelayTime: 0.5
      }
    }, {
      id: 2,
      node: 'oscillator',
      output: 1
    }];

    expect(virtualAudioGraph.update(virtualNodeParams)).toBe(virtualAudioGraph);
    expect(equals(audioContext.toJSON(), { 'name': 'AudioDestinationNode', 'inputs': [{ 'name': 'GainNode', 'gain': { 'value': 0.5, 'inputs': [] }, 'inputs': [{ 'name': 'StereoPannerNode', 'pan': { 'value': -1, 'inputs': [] }, 'inputs': [{ 'name': 'DelayNode', 'delayTime': { 'value': 0.5, 'inputs': [] }, 'inputs': [{ 'name': 'GainNode', 'gain': { 'value': 0.5, 'inputs': [] }, 'inputs': [{ 'name': 'DelayNode', 'delayTime': { 'value': 0.5, 'inputs': [] }, 'inputs': [{ 'name': 'GainNode', 'gain': { 'value': 0.5, 'inputs': [] }, 'inputs': ['<circular:DelayNode>'] }] }, { 'name': 'OscillatorNode', 'type': 'sine', 'frequency': { 'value': 440, 'inputs': [] }, 'detune': { 'value': 0, 'inputs': [] }, 'inputs': [] }] }] }] }, { 'name': 'StereoPannerNode', 'pan': { 'value': 1, 'inputs': [] }, 'inputs': [{ 'name': 'DelayNode', 'delayTime': { 'value': 0.5, 'inputs': [] }, 'inputs': [{ 'name': 'GainNode', 'gain': { 'value': 0.5, 'inputs': [] }, 'inputs': [{ 'name': 'DelayNode', 'delayTime': { 'value': 0.5, 'inputs': [] }, 'inputs': [{ 'name': 'GainNode', 'gain': { 'value': 0.5, 'inputs': [] }, 'inputs': ['<circular:DelayNode>', { 'name': 'OscillatorNode', 'type': 'sine', 'frequency': { 'value': 440, 'inputs': [] }, 'detune': { 'value': 0, 'inputs': [] }, 'inputs': [] }] }] }] }] }] }] }] })).toBe(true);
  });

  it('can define a custom node built of other custom nodes', function () {
    virtualAudioGraph.defineNode(pingPongDelayParamsFactory, 'pingPongDelay');

    var quietpingPongDelayParamsFactory = function quietpingPongDelayParamsFactory() {
      return [{
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
    };

    virtualAudioGraph.defineNode(quietpingPongDelayParamsFactory, 'quietPingPongDelay');

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
    expect(equals(audioContext.toJSON(), { 'name': 'AudioDestinationNode', 'inputs': [{ 'name': 'GainNode', 'gain': { 'value': 0.5, 'inputs': [] }, 'inputs': [{ 'name': 'GainNode', 'gain': { 'value': 1, 'inputs': [] }, 'inputs': [{ 'name': 'StereoPannerNode', 'pan': { 'value': -1, 'inputs': [] }, 'inputs': [{ 'name': 'DelayNode', 'delayTime': { 'value': 0.3333333333333333, 'inputs': [] }, 'inputs': [{ 'name': 'GainNode', 'gain': { 'value': 0.3333333333333333, 'inputs': [] }, 'inputs': [{ 'name': 'DelayNode', 'delayTime': { 'value': 0.3333333333333333, 'inputs': [] }, 'inputs': [{ 'name': 'GainNode', 'gain': { 'value': 0.3333333333333333, 'inputs': [] }, 'inputs': ['<circular:DelayNode>'] }] }, { 'name': 'OscillatorNode', 'type': 'sine', 'frequency': { 'value': 440, 'inputs': [] }, 'detune': { 'value': 0, 'inputs': [] }, 'inputs': [] }] }] }] }, { 'name': 'StereoPannerNode', 'pan': { 'value': 1, 'inputs': [] }, 'inputs': [{ 'name': 'DelayNode', 'delayTime': { 'value': 0.3333333333333333, 'inputs': [] }, 'inputs': [{ 'name': 'GainNode', 'gain': { 'value': 0.3333333333333333, 'inputs': [] }, 'inputs': [{ 'name': 'DelayNode', 'delayTime': { 'value': 0.3333333333333333, 'inputs': [] }, 'inputs': [{ 'name': 'GainNode', 'gain': { 'value': 0.3333333333333333, 'inputs': [] }, 'inputs': ['<circular:DelayNode>', { 'name': 'OscillatorNode', 'type': 'sine', 'frequency': { 'value': 440, 'inputs': [] }, 'detune': { 'value': 0, 'inputs': [] }, 'inputs': [] }] }] }] }] }] }] }] }] })).toBe(true);
  });

  it('can define a custom node which can be updated', function () {
    virtualAudioGraph.defineNode(pingPongDelayParamsFactory, 'pingPongDelay');

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
      output: 0,
      params: {
        decay: 0.5,
        delayTime: 0.5,
        maxDelayTime: 0.5
      }
    }, {
      id: 2,
      node: 'oscillator',
      output: 1
    }];

    virtualAudioGraph.update(virtualNodeParams);

    expect(equals(audioContext.toJSON(), { 'name': 'AudioDestinationNode', 'inputs': [{ 'name': 'GainNode', 'gain': { 'value': 0.5, 'inputs': [] }, 'inputs': [{ 'name': 'StereoPannerNode', 'pan': { 'value': -1, 'inputs': [] }, 'inputs': [{ 'name': 'DelayNode', 'delayTime': { 'value': 0.5, 'inputs': [] }, 'inputs': [{ 'name': 'GainNode', 'gain': { 'value': 0.5, 'inputs': [] }, 'inputs': [{ 'name': 'DelayNode', 'delayTime': { 'value': 0.5, 'inputs': [] }, 'inputs': [{ 'name': 'GainNode', 'gain': { 'value': 0.5, 'inputs': [] }, 'inputs': ['<circular:DelayNode>'] }] }, { 'name': 'OscillatorNode', 'type': 'sine', 'frequency': { 'value': 440, 'inputs': [] }, 'detune': { 'value': 0, 'inputs': [] }, 'inputs': [] }] }] }] }, { 'name': 'StereoPannerNode', 'pan': { 'value': 1, 'inputs': [] }, 'inputs': [{ 'name': 'DelayNode', 'delayTime': { 'value': 0.5, 'inputs': [] }, 'inputs': [{ 'name': 'GainNode', 'gain': { 'value': 0.5, 'inputs': [] }, 'inputs': [{ 'name': 'DelayNode', 'delayTime': { 'value': 0.5, 'inputs': [] }, 'inputs': [{ 'name': 'GainNode', 'gain': { 'value': 0.5, 'inputs': [] }, 'inputs': ['<circular:DelayNode>', { 'name': 'OscillatorNode', 'type': 'sine', 'frequency': { 'value': 440, 'inputs': [] }, 'detune': { 'value': 0, 'inputs': [] }, 'inputs': [] }] }] }] }] }] }] }] })).toBe(true);

    virtualNodeParams[1].params.decay = 0.6;

    virtualAudioGraph.update(virtualNodeParams);

    expect(equals(audioContext.toJSON(), { 'name': 'AudioDestinationNode', 'inputs': [{ 'name': 'GainNode', 'gain': { 'value': 0.5, 'inputs': [] }, 'inputs': [{ 'name': 'StereoPannerNode', 'pan': { 'value': -1, 'inputs': [] }, 'inputs': [{ 'name': 'DelayNode', 'delayTime': { 'value': 0.5, 'inputs': [] }, 'inputs': [{ 'name': 'GainNode', 'gain': { 'value': 0.6, 'inputs': [] }, 'inputs': [{ 'name': 'DelayNode', 'delayTime': { 'value': 0.5, 'inputs': [] }, 'inputs': [{ 'name': 'GainNode', 'gain': { 'value': 0.6, 'inputs': [] }, 'inputs': ['<circular:DelayNode>'] }] }, { 'name': 'OscillatorNode', 'type': 'sine', 'frequency': { 'value': 440, 'inputs': [] }, 'detune': { 'value': 0, 'inputs': [] }, 'inputs': [] }] }] }] }, { 'name': 'StereoPannerNode', 'pan': { 'value': 1, 'inputs': [] }, 'inputs': [{ 'name': 'DelayNode', 'delayTime': { 'value': 0.5, 'inputs': [] }, 'inputs': [{ 'name': 'GainNode', 'gain': { 'value': 0.6, 'inputs': [] }, 'inputs': [{ 'name': 'DelayNode', 'delayTime': { 'value': 0.5, 'inputs': [] }, 'inputs': [{ 'name': 'GainNode', 'gain': { 'value': 0.6, 'inputs': [] }, 'inputs': ['<circular:DelayNode>', { 'name': 'OscillatorNode', 'type': 'sine', 'frequency': { 'value': 440, 'inputs': [] }, 'detune': { 'value': 0, 'inputs': [] }, 'inputs': [] }] }] }] }] }] }] }] })).toBe(true);
  });

  it('can define a custom node which can be removed', function () {
    virtualAudioGraph.defineNode(pingPongDelayParamsFactory, 'pingPongDelay');

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
      output: 0,
      params: {
        decay: 0.5,
        delayTime: 0.5,
        maxDelayTime: 0.5
      }
    }, {
      id: 2,
      node: 'oscillator',
      output: 1
    }];

    virtualAudioGraph.update(virtualNodeParams);

    expect(equals(audioContext.toJSON(), { 'name': 'AudioDestinationNode', 'inputs': [{ 'name': 'GainNode', 'gain': { 'value': 0.5, 'inputs': [] }, 'inputs': [{ 'name': 'StereoPannerNode', 'pan': { 'value': -1, 'inputs': [] }, 'inputs': [{ 'name': 'DelayNode', 'delayTime': { 'value': 0.5, 'inputs': [] }, 'inputs': [{ 'name': 'GainNode', 'gain': { 'value': 0.5, 'inputs': [] }, 'inputs': [{ 'name': 'DelayNode', 'delayTime': { 'value': 0.5, 'inputs': [] }, 'inputs': [{ 'name': 'GainNode', 'gain': { 'value': 0.5, 'inputs': [] }, 'inputs': ['<circular:DelayNode>'] }] }, { 'name': 'OscillatorNode', 'type': 'sine', 'frequency': { 'value': 440, 'inputs': [] }, 'detune': { 'value': 0, 'inputs': [] }, 'inputs': [] }] }] }] }, { 'name': 'StereoPannerNode', 'pan': { 'value': 1, 'inputs': [] }, 'inputs': [{ 'name': 'DelayNode', 'delayTime': { 'value': 0.5, 'inputs': [] }, 'inputs': [{ 'name': 'GainNode', 'gain': { 'value': 0.5, 'inputs': [] }, 'inputs': [{ 'name': 'DelayNode', 'delayTime': { 'value': 0.5, 'inputs': [] }, 'inputs': [{ 'name': 'GainNode', 'gain': { 'value': 0.5, 'inputs': [] }, 'inputs': ['<circular:DelayNode>', { 'name': 'OscillatorNode', 'type': 'sine', 'frequency': { 'value': 440, 'inputs': [] }, 'detune': { 'value': 0, 'inputs': [] }, 'inputs': [] }] }] }] }] }] }] }] })).toBe(true);

    virtualNodeParams[1].params.decay = 0.6;

    virtualAudioGraph.update([{
      id: 0,
      node: 'gain',
      output: 'output',
      params: {
        gain: 0.5
      }
    }]);

    expect(equals(audioContext.toJSON(), { 'name': 'AudioDestinationNode', 'inputs': [{ 'name': 'GainNode', 'gain': { 'value': 0.5, 'inputs': [] }, 'inputs': [] }] })).toBe(true);
  });
});


},{"../src/index.js":15,"./tools/pingPongDelayParamsFactory":11,"ramda":8}],13:[function(require,module,exports){
'use strict';

var VirtualAudioGraph = require('../src/index.js');
var pingPongDelayParamsFactory = require('./tools/pingPongDelayParamsFactory');

describe('virtualAudioGraph.update', function () {
  var audioContext = undefined;
  var virtualAudioGraph = undefined;

  beforeEach(function () {
    audioContext = new AudioContext();
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

  it('changes the node if passed params with same id but different node property', function () {
    virtualAudioGraph.update([{
      id: 0,
      node: 'gain',
      output: 'output'
    }]);

    expect(audioContext.toJSON()).toEqual({
      name: 'AudioDestinationNode',
      inputs: [{
        name: 'GainNode',
        gain: {
          value: 1,
          inputs: []
        },
        inputs: []
      }]
    });

    virtualAudioGraph.update([{
      id: 0,
      node: 'oscillator',
      output: 'output'
    }]);

    expect(audioContext.toJSON()).toEqual({
      'name': 'AudioDestinationNode',
      'inputs': [{
        'name': 'OscillatorNode',
        'type': 'sine',
        'frequency': {
          'value': 440, 'inputs': []
        },
        'detune': {
          'value': 0, 'inputs': []
        },
        'inputs': []
      }]
    });

    virtualAudioGraph.defineNode(pingPongDelayParamsFactory, 'pingPongDelay');

    virtualAudioGraph.update([{
      id: 0,
      node: 'pingPongDelay',
      output: 'output'
    }]);
    expect(audioContext.toJSON()).toEqual({ 'name': 'AudioDestinationNode', 'inputs': [{ 'name': 'StereoPannerNode', 'pan': { 'value': -1, 'inputs': [] }, 'inputs': [{ 'name': 'DelayNode', 'delayTime': { 'value': 0.3333333333333333, 'inputs': [] }, 'inputs': [{ 'name': 'GainNode', 'gain': { 'value': 0.3333333333333333, 'inputs': [] }, 'inputs': [{ 'name': 'DelayNode', 'delayTime': { 'value': 0.3333333333333333, 'inputs': [] }, 'inputs': [{ 'name': 'GainNode', 'gain': { 'value': 0.3333333333333333, 'inputs': [] }, 'inputs': ['<circular:DelayNode>'] }] }] }] }] }, { 'name': 'StereoPannerNode', 'pan': { 'value': 1, 'inputs': [] }, 'inputs': [{ 'name': 'DelayNode', 'delayTime': { 'value': 0.3333333333333333, 'inputs': [] }, 'inputs': [{ 'name': 'GainNode', 'gain': { 'value': 0.3333333333333333, 'inputs': [] }, 'inputs': [{ 'name': 'DelayNode', 'delayTime': { 'value': 0.3333333333333333, 'inputs': [] }, 'inputs': [{ 'name': 'GainNode', 'gain': { 'value': 0.3333333333333333, 'inputs': [] }, 'inputs': ['<circular:DelayNode>'] }] }] }] }] }] });
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
    expect(Array.isArray(virtualAudioGraph.virtualNodes)).toBe(true);
    expect(virtualAudioGraph.virtualNodes.length).toBe(2);
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
    var audioNode = virtualAudioGraph.virtualNodes[0].audioNode;
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
    var audioNode = virtualAudioGraph.virtualNodes[0].audioNode;
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
    var audioNode = virtualAudioGraph.virtualNodes[0].audioNode;
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
    var audioNode = virtualAudioGraph.virtualNodes[0].audioNode;
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
    var audioNode = virtualAudioGraph.virtualNodes[0].audioNode;
    expect(audioNode.constructor.name).toBe('StereoPannerNode');
    expect(audioNode.pan.value).toBe(pan);
  });
});


},{"../src/index.js":15,"./tools/pingPongDelayParamsFactory":11}],14:[function(require,module,exports){
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

var capitalize = require('capitalize');
var NativeVirtualAudioNode = require('./virtualNodeConstructors/NativeVirtualAudioNode');
var CustomVirtualAudioNode = require('./virtualNodeConstructors/CustomVirtualAudioNode');
var connectAudioNodes = require('./tools/connectAudioNodes');

var disconnectAndRemoveVirtualAudioNode = function disconnectAndRemoveVirtualAudioNode(virtualNode) {
  virtualNode.disconnect();
  this.virtualNodes = remove(findIndex(propEq('id', virtualNode.id))(this.virtualNodes), 1, this.virtualNodes);
};

var createVirtualAudioNodesAndUpdateVirtualAudioGraph = function createVirtualAudioNodesAndUpdateVirtualAudioGraph(virtualAudioNodeParams) {
  var newVirtualAudioNodeParams = differenceWith(eqProps('id'), virtualAudioNodeParams, this.virtualNodes);

  this.virtualNodes = concat(this.virtualNodes, this.createVirtualAudioNodes(newVirtualAudioNodeParams));

  return virtualAudioNodeParams;
};

var removeAudioNodesAndUpdateVirtualAudioGraph = function removeAudioNodesAndUpdateVirtualAudioGraph(virtualAudioNodeParams) {
  var virtualNodesToBeRemoved = differenceWith(eqProps('id'), this.virtualNodes, virtualAudioNodeParams);

  forEach(disconnectAndRemoveVirtualAudioNode.bind(this), virtualNodesToBeRemoved);

  return virtualAudioNodeParams;
};

var updateAudioNodesAndUpdateVirtualAudioGraph = function updateAudioNodesAndUpdateVirtualAudioGraph(virtualAudioNodeParams) {
  var _this = this;

  var updateParams = intersectionWith(eqProps('id'), virtualAudioNodeParams, this.virtualNodes);

  forEach(function (virtualAudioNodeParam) {
    var virtualAudioNode = find(propEq('id', virtualAudioNodeParam.id))(_this.virtualNodes);
    if (virtualAudioNodeParam.node !== virtualAudioNode.node) disconnectAndRemoveVirtualAudioNode.call(_this, virtualAudioNode);
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
    this.virtualNodes = [];
    this.customNodes = {};

    this._removeUpdateAndCreate = compose(createVirtualAudioNodesAndUpdateVirtualAudioGraph.bind(this), updateAudioNodesAndUpdateVirtualAudioGraph.bind(this), removeAudioNodesAndUpdateVirtualAudioGraph.bind(this));
  }

  _createClass(VirtualAudioGraph, [{
    key: 'createVirtualAudioNodes',
    value: function createVirtualAudioNodes(virtualAudioNodesParams) {
      var _this2 = this;

      var partitionedVirtualAudioNodeParams = partition(function (_ref) {
        var node = _ref.node;
        return isNil(_this2.customNodes[node]);
      }, virtualAudioNodesParams);

      var nativeVirtualAudioNodeParams = partitionedVirtualAudioNodeParams[0];
      var customVirtualAudioNodeParams = partitionedVirtualAudioNodeParams[1];

      var nativeVirtualAudioNodes = map(function (virtualAudioNodeParams) {
        return new NativeVirtualAudioNode(_this2, virtualAudioNodeParams);
      }, nativeVirtualAudioNodeParams);
      var customVirtualAudioNodes = map(function (virtualAudioNodeParams) {
        return new CustomVirtualAudioNode(_this2, virtualAudioNodeParams);
      }, customVirtualAudioNodeParams);

      return concat(nativeVirtualAudioNodes, customVirtualAudioNodes);
    }
  }, {
    key: 'defineNode',
    value: function defineNode(customNodeParamsFactory, name) {
      if (this.audioContext['create' + capitalize(name)]) throw new Error(name + ' is a standard audio node name and cannot be overwritten');

      this.customNodes[name] = customNodeParamsFactory;
      return this;
    }
  }, {
    key: 'update',
    value: function update(virtualAudioNodeParams) {
      var _this3 = this;

      if (any(propEq('id', undefined), virtualAudioNodeParams)) throw new Error('Every virtualAudioNode needs an id for efficient diffing and determining relationships between nodes');

      this._removeUpdateAndCreate(virtualAudioNodeParams);
      connectAudioNodes(CustomVirtualAudioNode, this.virtualNodes, function (virtualAudioNode) {
        return virtualAudioNode.connect(_this3.output);
      });

      return this;
    }
  }]);

  return VirtualAudioGraph;
})();

module.exports = VirtualAudioGraph;


},{"./tools/connectAudioNodes":16,"./virtualNodeConstructors/CustomVirtualAudioNode":18,"./virtualNodeConstructors/NativeVirtualAudioNode":19,"babel-runtime/helpers/class-call-check":2,"babel-runtime/helpers/create-class":3,"capitalize":7,"ramda":8}],15:[function(require,module,exports){
'use strict';

module.exports = require('./VirtualAudioGraph');


},{"./VirtualAudioGraph":14}],16:[function(require,module,exports){
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


},{"ramda":8}],17:[function(require,module,exports){
'use strict';

var capitalize = require('capitalize');

var namesToParamsKey = {
  delay: 'maxDelayTime'
};

module.exports = function (audioContext, name, constructorParams) {
  var constructorParamsKey = namesToParamsKey[name];
  var audioNode = constructorParamsKey ? audioContext['create' + capitalize(name)](constructorParams[constructorParamsKey]) : audioContext['create' + capitalize(name)]();
  if (name === 'oscillator') {
    audioNode.start();
  }
  return audioNode;
};


},{"capitalize":7}],18:[function(require,module,exports){
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
var zipWith = _require.zipWith;

var connectAudioNodes = require('../tools/connectAudioNodes');

module.exports = (function () {
  function CustomVirtualAudioNode(virtualAudioGraph, _ref) {
    var node = _ref.node;
    var id = _ref.id;
    var output = _ref.output;
    var params = _ref.params;

    _classCallCheck(this, CustomVirtualAudioNode);

    params = params || {};
    this.audioGraphParamsFactory = virtualAudioGraph.customNodes[node];
    this.node = node;
    this.virtualNodes = this.audioGraphParamsFactory(params);
    this.virtualNodes = virtualAudioGraph.createVirtualAudioNodes(this.virtualNodes);
    connectAudioNodes(CustomVirtualAudioNode, this.virtualNodes);
    this.id = id;
    this.output = Array.isArray(output) ? output : [output];
  }

  _createClass(CustomVirtualAudioNode, [{
    key: 'connect',
    value: function connect(destination) {
      var outputVirtualNodes = filter(function (_ref2) {
        var output = _ref2.output;
        return contains('output', output);
      }, this.virtualNodes);
      forEach(function (audioNode) {
        return audioNode.connect(destination);
      }, pluck('audioNode', outputVirtualNodes));
    }
  }, {
    key: 'disconnect',
    value: function disconnect() {
      forEach(function (virtualNode) {
        return virtualNode.disconnect();
      }, this.virtualNodes);
    }
  }, {
    key: 'updateAudioNode',
    value: function updateAudioNode(params) {
      zipWith(function (virtualNode, _ref3) {
        var params = _ref3.params;
        return virtualNode.updateAudioNode(params);
      }, this.virtualNodes, this.audioGraphParamsFactory(params));
    }
  }, {
    key: 'inputs',
    get: function get() {
      return pluck('audioNode', filter(propEq('input', 'input'), this.virtualNodes));
    }
  }]);

  return CustomVirtualAudioNode;
})();


},{"../tools/connectAudioNodes":16,"babel-runtime/helpers/class-call-check":2,"babel-runtime/helpers/create-class":3,"ramda":8}],19:[function(require,module,exports){
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
    this.node = node;
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
    key: 'disconnect',
    value: function disconnect() {
      this.audioNode.stop && this.audioNode.stop();
      this.audioNode.disconnect();
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


},{"../tools/createAudioNode":17,"babel-runtime/helpers/class-call-check":2,"babel-runtime/helpers/create-class":3,"ramda":8}]},{},[10])


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9jb3JlLWpzL29iamVjdC9kZWZpbmUtcHJvcGVydHkuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9oZWxwZXJzL2NsYXNzLWNhbGwtY2hlY2suanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9oZWxwZXJzL2NyZWF0ZS1jbGFzcy5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvZm4vb2JqZWN0L2RlZmluZS1wcm9wZXJ0eS5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLmZ3LmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuanMiLCJub2RlX21vZHVsZXMvY2FwaXRhbGl6ZS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9yYW1kYS9kaXN0L3JhbWRhLmpzIiwic3BlYy9WaXJ0dWFsQXVkaW9HcmFwaC5qcyIsInNwZWMvaW5kZXguanMiLCJzcGVjL3Rvb2xzL3BpbmdQb25nRGVsYXlQYXJhbXNGYWN0b3J5LmpzIiwic3BlYy92aXJ0dWFsQXVkaW9HcmFwaC5kZWZpbmVOb2RlLmpzIiwic3BlYy92aXJ0dWFsQXVkaW9HcmFwaC51cGRhdGUuanMiLCJzcmMvVmlydHVhbEF1ZGlvR3JhcGguanMiLCJzcmMvaW5kZXguanMiLCJzcmMvdG9vbHMvY29ubmVjdEF1ZGlvTm9kZXMuanMiLCJzcmMvdG9vbHMvY3JlYXRlQXVkaW9Ob2RlLmpzIiwic3JjL3ZpcnR1YWxOb2RlQ29uc3RydWN0b3JzL0N1c3RvbVZpcnR1YWxBdWRpb05vZGUuanMiLCJzcmMvdmlydHVhbE5vZGVDb25zdHJ1Y3RvcnMvTmF0aXZlVmlydHVhbEF1ZGlvTm9kZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9GQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6bVBBLFlBQVksQ0FBQzs7QUFFYixJQUFJLGlCQUFpQixHQUFHLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0FBQ25ELElBQUksWUFBWSxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7O0FBRXRDLFFBQVEsQ0FBQyxtQkFBbUIsRUFBRSxZQUFZO0VBQ3hDLEVBQUUsQ0FBQyx3Q0FBd0MsRUFBRSxZQUFZO0lBQ3ZELE1BQU0sQ0FBQyxJQUFJLGlCQUFpQixDQUFDLEVBQUUsWUFBWSxFQUFFLFlBQVksRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQzlGLE1BQU0sQ0FBQyxJQUFJLGlCQUFpQixFQUFFLENBQUMsWUFBWSxZQUFZLFlBQVksQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNwRixHQUFHLENBQUMsQ0FBQzs7RUFFSCxFQUFFLENBQUMsbUNBQW1DLEVBQUUsWUFBWTtJQUNsRCxNQUFNLENBQUMsSUFBSSxpQkFBaUIsQ0FBQztNQUMzQixNQUFNLEVBQUUsWUFBWSxDQUFDLFdBQVc7S0FDakMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDMUMsTUFBTSxDQUFDLElBQUksaUJBQWlCLENBQUMsRUFBRSxZQUFZLEVBQUUsWUFBWSxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0dBQ3JHLENBQUMsQ0FBQztDQUNKLENBQUMsQ0FBQztBQUNIOzs7QUNsQkEsWUFBWSxDQUFDOztBQUViLGVBQWUsQ0FBQyxRQUFRLENBQUMsaUNBQWlDLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFDdkUsT0FBTyxDQUFDLHFCQUFxQixDQUFDLENBQUM7QUFDL0IsT0FBTyxDQUFDLGdDQUFnQyxDQUFDLENBQUM7QUFDMUMsT0FBTyxDQUFDLDRCQUE0QixDQUFDLENBQUM7QUFDdEM7OztBQ05BLFlBQVksQ0FBQzs7QUFFYixNQUFNLENBQUMsT0FBTyxHQUFHLFlBQVk7RUFDM0IsSUFBSSxNQUFNLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxLQUFLLFNBQVMsR0FBRyxFQUFFLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO0VBQzVELElBQUksS0FBSyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUM7RUFDekIsSUFBSSxTQUFTLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQztBQUNuQyxFQUFFLElBQUksWUFBWSxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUM7O0VBRXZDLEtBQUssR0FBRyxLQUFLLEtBQUssU0FBUyxHQUFHLEtBQUssR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0VBQzVDLFNBQVMsR0FBRyxTQUFTLEtBQUssU0FBUyxHQUFHLFNBQVMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQzFELEVBQUUsWUFBWSxHQUFHLFlBQVksS0FBSyxTQUFTLEdBQUcsWUFBWSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7O0VBRWpFLE9BQU8sQ0FBQztJQUNOLEVBQUUsRUFBRSxDQUFDO0lBQ0wsSUFBSSxFQUFFLGNBQWM7SUFDcEIsTUFBTSxFQUFFLFFBQVE7SUFDaEIsTUFBTSxFQUFFO01BQ04sR0FBRyxFQUFFLENBQUMsQ0FBQztLQUNSO0dBQ0YsRUFBRTtJQUNELEVBQUUsRUFBRSxDQUFDO0lBQ0wsSUFBSSxFQUFFLGNBQWM7SUFDcEIsTUFBTSxFQUFFLFFBQVE7SUFDaEIsTUFBTSxFQUFFO01BQ04sR0FBRyxFQUFFLENBQUM7S0FDUDtHQUNGLEVBQUU7SUFDRCxFQUFFLEVBQUUsQ0FBQztJQUNMLElBQUksRUFBRSxPQUFPO0lBQ2IsTUFBTSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNkLE1BQU0sRUFBRTtNQUNOLFlBQVksRUFBRSxZQUFZO01BQzFCLFNBQVMsRUFBRSxTQUFTO0tBQ3JCO0dBQ0YsRUFBRTtJQUNELEVBQUUsRUFBRSxDQUFDO0lBQ0wsSUFBSSxFQUFFLE1BQU07SUFDWixNQUFNLEVBQUUsQ0FBQztJQUNULE1BQU0sRUFBRTtNQUNOLElBQUksRUFBRSxLQUFLO0tBQ1o7R0FDRixFQUFFO0lBQ0QsRUFBRSxFQUFFLENBQUM7SUFDTCxJQUFJLEVBQUUsT0FBTztJQUNiLE1BQU0sRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDZCxNQUFNLEVBQUU7TUFDTixZQUFZLEVBQUUsWUFBWTtNQUMxQixTQUFTLEVBQUUsU0FBUztLQUNyQjtHQUNGLEVBQUU7SUFDRCxFQUFFLEVBQUUsQ0FBQztJQUNMLEtBQUssRUFBRSxPQUFPO0lBQ2QsSUFBSSxFQUFFLE1BQU07SUFDWixNQUFNLEVBQUUsQ0FBQztJQUNULE1BQU0sRUFBRTtNQUNOLElBQUksRUFBRSxLQUFLO0tBQ1o7R0FDRixDQUFDLENBQUM7Q0FDSixDQUFDO0FBQ0Y7OztBQzNEQSxZQUFZLENBQUM7O0FBRWIsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDOztBQUVoQyxJQUFJLE1BQU0sR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDOztBQUU3QixJQUFJLGlCQUFpQixHQUFHLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0FBQ25ELElBQUksMEJBQTBCLEdBQUcsT0FBTyxDQUFDLG9DQUFvQyxDQUFDLENBQUM7O0FBRS9FLFFBQVEsQ0FBQyw4QkFBOEIsRUFBRSxZQUFZO0VBQ25ELElBQUksWUFBWSxHQUFHLFNBQVMsQ0FBQztBQUMvQixFQUFFLElBQUksaUJBQWlCLEdBQUcsU0FBUyxDQUFDOztFQUVsQyxVQUFVLENBQUMsWUFBWTtJQUNyQixZQUFZLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztJQUNsQyxpQkFBaUIsR0FBRyxJQUFJLGlCQUFpQixDQUFDO01BQ3hDLFlBQVksRUFBRSxZQUFZO01BQzFCLE1BQU0sRUFBRSxZQUFZLENBQUMsV0FBVztLQUNqQyxDQUFDLENBQUM7QUFDUCxHQUFHLENBQUMsQ0FBQzs7RUFFSCxFQUFFLENBQUMsZ0JBQWdCLEVBQUUsWUFBWTtJQUMvQixNQUFNLENBQUMsaUJBQWlCLENBQUMsVUFBVSxDQUFDLDBCQUEwQixFQUFFLGVBQWUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUM7QUFDOUcsR0FBRyxDQUFDLENBQUM7O0VBRUgsRUFBRSxDQUFDLDRDQUE0QyxFQUFFLFlBQVk7SUFDM0QsTUFBTSxDQUFDLFlBQVk7TUFDakIsT0FBTyxpQkFBaUIsQ0FBQyxVQUFVLENBQUMsMEJBQTBCLEVBQUUsTUFBTSxDQUFDLENBQUM7S0FDekUsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQ2pCLEdBQUcsQ0FBQyxDQUFDOztFQUVILEVBQUUsQ0FBQyxrQ0FBa0MsRUFBRSxZQUFZO0FBQ3JELElBQUksaUJBQWlCLENBQUMsVUFBVSxDQUFDLDBCQUEwQixFQUFFLGVBQWUsQ0FBQyxDQUFDOztJQUUxRSxNQUFNLENBQUMsT0FBTyxpQkFBaUIsQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ2hGLEdBQUcsQ0FBQyxDQUFDOztFQUVILEVBQUUsQ0FBQyx1RUFBdUUsRUFBRSxZQUFZO0FBQzFGLElBQUksaUJBQWlCLENBQUMsVUFBVSxDQUFDLDBCQUEwQixFQUFFLGVBQWUsQ0FBQyxDQUFDOztJQUUxRSxJQUFJLGlCQUFpQixHQUFHLENBQUM7TUFDdkIsRUFBRSxFQUFFLENBQUM7TUFDTCxJQUFJLEVBQUUsTUFBTTtNQUNaLE1BQU0sRUFBRSxRQUFRO01BQ2hCLE1BQU0sRUFBRTtRQUNOLElBQUksRUFBRSxHQUFHO09BQ1Y7S0FDRixFQUFFO01BQ0QsRUFBRSxFQUFFLENBQUM7TUFDTCxJQUFJLEVBQUUsZUFBZTtNQUNyQixNQUFNLEVBQUUsQ0FBQztNQUNULE1BQU0sRUFBRTtRQUNOLEtBQUssRUFBRSxHQUFHO1FBQ1YsU0FBUyxFQUFFLEdBQUc7UUFDZCxZQUFZLEVBQUUsR0FBRztPQUNsQjtLQUNGLEVBQUU7TUFDRCxFQUFFLEVBQUUsQ0FBQztNQUNMLElBQUksRUFBRSxZQUFZO01BQ2xCLE1BQU0sRUFBRSxDQUFDO0FBQ2YsS0FBSyxDQUFDLENBQUM7O0lBRUgsTUFBTSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUM7SUFDNUUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsc0JBQXNCLEVBQUUsUUFBUSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLGtCQUFrQixFQUFFLEtBQUssRUFBRSxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUMsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsV0FBVyxFQUFFLFdBQVcsRUFBRSxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUUsV0FBVyxFQUFFLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxDQUFDLHNCQUFzQixDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUUsRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsa0JBQWtCLEVBQUUsS0FBSyxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsV0FBVyxFQUFFLFdBQVcsRUFBRSxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUUsV0FBVyxFQUFFLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxDQUFDLHNCQUFzQixFQUFFLEVBQUUsTUFBTSxFQUFFLGdCQUFnQixFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsV0FBVyxFQUFFLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzl4QyxHQUFHLENBQUMsQ0FBQzs7RUFFSCxFQUFFLENBQUMsc0RBQXNELEVBQUUsWUFBWTtBQUN6RSxJQUFJLGlCQUFpQixDQUFDLFVBQVUsQ0FBQywwQkFBMEIsRUFBRSxlQUFlLENBQUMsQ0FBQzs7SUFFMUUsSUFBSSwrQkFBK0IsR0FBRyxTQUFTLCtCQUErQixHQUFHO01BQy9FLE9BQU8sQ0FBQztRQUNOLEVBQUUsRUFBRSxDQUFDO1FBQ0wsSUFBSSxFQUFFLE1BQU07UUFDWixNQUFNLEVBQUUsUUFBUTtPQUNqQixFQUFFO1FBQ0QsRUFBRSxFQUFFLENBQUM7UUFDTCxJQUFJLEVBQUUsZUFBZTtRQUNyQixNQUFNLEVBQUUsQ0FBQztPQUNWLEVBQUU7UUFDRCxFQUFFLEVBQUUsQ0FBQztRQUNMLElBQUksRUFBRSxZQUFZO1FBQ2xCLE1BQU0sRUFBRSxDQUFDO09BQ1YsQ0FBQyxDQUFDO0FBQ1QsS0FBSyxDQUFDOztBQUVOLElBQUksaUJBQWlCLENBQUMsVUFBVSxDQUFDLCtCQUErQixFQUFFLG9CQUFvQixDQUFDLENBQUM7O0lBRXBGLElBQUksaUJBQWlCLEdBQUcsQ0FBQztNQUN2QixFQUFFLEVBQUUsQ0FBQztNQUNMLElBQUksRUFBRSxNQUFNO01BQ1osTUFBTSxFQUFFLFFBQVE7TUFDaEIsTUFBTSxFQUFFO1FBQ04sSUFBSSxFQUFFLEdBQUc7T0FDVjtLQUNGLEVBQUU7TUFDRCxFQUFFLEVBQUUsQ0FBQztNQUNMLElBQUksRUFBRSxvQkFBb0I7TUFDMUIsTUFBTSxFQUFFLENBQUM7S0FDVixFQUFFO01BQ0QsRUFBRSxFQUFFLENBQUM7TUFDTCxJQUFJLEVBQUUsZUFBZTtNQUNyQixNQUFNLEVBQUUsQ0FBQztLQUNWLEVBQUU7TUFDRCxFQUFFLEVBQUUsQ0FBQztNQUNMLElBQUksRUFBRSxZQUFZO01BQ2xCLE1BQU0sRUFBRSxDQUFDO0FBQ2YsS0FBSyxDQUFDLENBQUM7O0lBRUgsTUFBTSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUM7SUFDNUUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsc0JBQXNCLEVBQUUsUUFBUSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxrQkFBa0IsRUFBRSxLQUFLLEVBQUUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBRSxXQUFXLEVBQUUsRUFBRSxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsRUFBRSxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBRSxXQUFXLEVBQUUsRUFBRSxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsRUFBRSxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxDQUFDLHNCQUFzQixDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUUsRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsa0JBQWtCLEVBQUUsS0FBSyxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsV0FBVyxFQUFFLFdBQVcsRUFBRSxFQUFFLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxFQUFFLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsV0FBVyxFQUFFLFdBQVcsRUFBRSxFQUFFLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxFQUFFLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLENBQUMsc0JBQXNCLEVBQUUsRUFBRSxNQUFNLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUUsRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2grQyxHQUFHLENBQUMsQ0FBQzs7RUFFSCxFQUFFLENBQUMsK0NBQStDLEVBQUUsWUFBWTtBQUNsRSxJQUFJLGlCQUFpQixDQUFDLFVBQVUsQ0FBQywwQkFBMEIsRUFBRSxlQUFlLENBQUMsQ0FBQzs7SUFFMUUsSUFBSSxpQkFBaUIsR0FBRyxDQUFDO01BQ3ZCLEVBQUUsRUFBRSxDQUFDO01BQ0wsSUFBSSxFQUFFLE1BQU07TUFDWixNQUFNLEVBQUUsUUFBUTtNQUNoQixNQUFNLEVBQUU7UUFDTixJQUFJLEVBQUUsR0FBRztPQUNWO0tBQ0YsRUFBRTtNQUNELEVBQUUsRUFBRSxDQUFDO01BQ0wsSUFBSSxFQUFFLGVBQWU7TUFDckIsTUFBTSxFQUFFLENBQUM7TUFDVCxNQUFNLEVBQUU7UUFDTixLQUFLLEVBQUUsR0FBRztRQUNWLFNBQVMsRUFBRSxHQUFHO1FBQ2QsWUFBWSxFQUFFLEdBQUc7T0FDbEI7S0FDRixFQUFFO01BQ0QsRUFBRSxFQUFFLENBQUM7TUFDTCxJQUFJLEVBQUUsWUFBWTtNQUNsQixNQUFNLEVBQUUsQ0FBQztBQUNmLEtBQUssQ0FBQyxDQUFDOztBQUVQLElBQUksaUJBQWlCLENBQUMsTUFBTSxDQUFDLGlCQUFpQixDQUFDLENBQUM7O0FBRWhELElBQUksTUFBTSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsc0JBQXNCLEVBQUUsUUFBUSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLGtCQUFrQixFQUFFLEtBQUssRUFBRSxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUMsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsV0FBVyxFQUFFLFdBQVcsRUFBRSxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUUsV0FBVyxFQUFFLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxDQUFDLHNCQUFzQixDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUUsRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsa0JBQWtCLEVBQUUsS0FBSyxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsV0FBVyxFQUFFLFdBQVcsRUFBRSxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUUsV0FBVyxFQUFFLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxDQUFDLHNCQUFzQixFQUFFLEVBQUUsTUFBTSxFQUFFLGdCQUFnQixFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsV0FBVyxFQUFFLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDOztBQUU5eEMsSUFBSSxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQzs7QUFFNUMsSUFBSSxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsaUJBQWlCLENBQUMsQ0FBQzs7SUFFNUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsc0JBQXNCLEVBQUUsUUFBUSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLGtCQUFrQixFQUFFLEtBQUssRUFBRSxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUMsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsV0FBVyxFQUFFLFdBQVcsRUFBRSxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUUsV0FBVyxFQUFFLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxDQUFDLHNCQUFzQixDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUUsRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsa0JBQWtCLEVBQUUsS0FBSyxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsV0FBVyxFQUFFLFdBQVcsRUFBRSxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUUsV0FBVyxFQUFFLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxDQUFDLHNCQUFzQixFQUFFLEVBQUUsTUFBTSxFQUFFLGdCQUFnQixFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsV0FBVyxFQUFFLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzl4QyxHQUFHLENBQUMsQ0FBQzs7RUFFSCxFQUFFLENBQUMsK0NBQStDLEVBQUUsWUFBWTtBQUNsRSxJQUFJLGlCQUFpQixDQUFDLFVBQVUsQ0FBQywwQkFBMEIsRUFBRSxlQUFlLENBQUMsQ0FBQzs7SUFFMUUsSUFBSSxpQkFBaUIsR0FBRyxDQUFDO01BQ3ZCLEVBQUUsRUFBRSxDQUFDO01BQ0wsSUFBSSxFQUFFLE1BQU07TUFDWixNQUFNLEVBQUUsUUFBUTtNQUNoQixNQUFNLEVBQUU7UUFDTixJQUFJLEVBQUUsR0FBRztPQUNWO0tBQ0YsRUFBRTtNQUNELEVBQUUsRUFBRSxDQUFDO01BQ0wsSUFBSSxFQUFFLGVBQWU7TUFDckIsTUFBTSxFQUFFLENBQUM7TUFDVCxNQUFNLEVBQUU7UUFDTixLQUFLLEVBQUUsR0FBRztRQUNWLFNBQVMsRUFBRSxHQUFHO1FBQ2QsWUFBWSxFQUFFLEdBQUc7T0FDbEI7S0FDRixFQUFFO01BQ0QsRUFBRSxFQUFFLENBQUM7TUFDTCxJQUFJLEVBQUUsWUFBWTtNQUNsQixNQUFNLEVBQUUsQ0FBQztBQUNmLEtBQUssQ0FBQyxDQUFDOztBQUVQLElBQUksaUJBQWlCLENBQUMsTUFBTSxDQUFDLGlCQUFpQixDQUFDLENBQUM7O0FBRWhELElBQUksTUFBTSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsc0JBQXNCLEVBQUUsUUFBUSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLGtCQUFrQixFQUFFLEtBQUssRUFBRSxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUMsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsV0FBVyxFQUFFLFdBQVcsRUFBRSxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUUsV0FBVyxFQUFFLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxDQUFDLHNCQUFzQixDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUUsRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsa0JBQWtCLEVBQUUsS0FBSyxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsV0FBVyxFQUFFLFdBQVcsRUFBRSxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUUsV0FBVyxFQUFFLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxDQUFDLHNCQUFzQixFQUFFLEVBQUUsTUFBTSxFQUFFLGdCQUFnQixFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsV0FBVyxFQUFFLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDOztBQUU5eEMsSUFBSSxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQzs7SUFFeEMsaUJBQWlCLENBQUMsTUFBTSxDQUFDLENBQUM7TUFDeEIsRUFBRSxFQUFFLENBQUM7TUFDTCxJQUFJLEVBQUUsTUFBTTtNQUNaLE1BQU0sRUFBRSxRQUFRO01BQ2hCLE1BQU0sRUFBRTtRQUNOLElBQUksRUFBRSxHQUFHO09BQ1Y7QUFDUCxLQUFLLENBQUMsQ0FBQyxDQUFDOztJQUVKLE1BQU0sQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLHNCQUFzQixFQUFFLFFBQVEsRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7R0FDaEwsQ0FBQyxDQUFDO0NBQ0osQ0FBQyxDQUFDO0FBQ0g7OztBQy9MQSxZQUFZLENBQUM7O0FBRWIsSUFBSSxpQkFBaUIsR0FBRyxPQUFPLENBQUMsaUJBQWlCLENBQUMsQ0FBQztBQUNuRCxJQUFJLDBCQUEwQixHQUFHLE9BQU8sQ0FBQyxvQ0FBb0MsQ0FBQyxDQUFDOztBQUUvRSxRQUFRLENBQUMsMEJBQTBCLEVBQUUsWUFBWTtFQUMvQyxJQUFJLFlBQVksR0FBRyxTQUFTLENBQUM7QUFDL0IsRUFBRSxJQUFJLGlCQUFpQixHQUFHLFNBQVMsQ0FBQzs7RUFFbEMsVUFBVSxDQUFDLFlBQVk7SUFDckIsWUFBWSxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7SUFDbEMsaUJBQWlCLEdBQUcsSUFBSSxpQkFBaUIsQ0FBQztNQUN4QyxZQUFZLEVBQUUsWUFBWTtNQUMxQixNQUFNLEVBQUUsWUFBWSxDQUFDLFdBQVc7S0FDakMsQ0FBQyxDQUFDO0FBQ1AsR0FBRyxDQUFDLENBQUM7O0VBRUgsRUFBRSxDQUFDLGdCQUFnQixFQUFFLFlBQVk7SUFDL0IsSUFBSSxpQkFBaUIsR0FBRyxDQUFDO01BQ3ZCLEVBQUUsRUFBRSxDQUFDO01BQ0wsSUFBSSxFQUFFLFlBQVk7TUFDbEIsTUFBTSxFQUFFO1FBQ04sSUFBSSxFQUFFLFFBQVE7T0FDZjtNQUNELE1BQU0sRUFBRSxRQUFRO0tBQ2pCLENBQUMsQ0FBQztJQUNILE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0FBQ2hGLEdBQUcsQ0FBQyxDQUFDOztFQUVILEVBQUUsQ0FBQyxzQ0FBc0MsRUFBRSxZQUFZO0lBQ3JELElBQUksaUJBQWlCLEdBQUcsQ0FBQztNQUN2QixJQUFJLEVBQUUsTUFBTTtNQUNaLE1BQU0sRUFBRSxRQUFRO0tBQ2pCLENBQUMsQ0FBQztJQUNILE1BQU0sQ0FBQyxZQUFZO01BQ2pCLE9BQU8saUJBQWlCLENBQUMsTUFBTSxDQUFDLGlCQUFpQixDQUFDLENBQUM7S0FDcEQsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQ2pCLEdBQUcsQ0FBQyxDQUFDOztFQUVILEVBQUUsQ0FBQywwQ0FBMEMsRUFBRSxZQUFZO0lBQ3pELElBQUksaUJBQWlCLEdBQUcsQ0FBQztNQUN2QixJQUFJLEVBQUUsTUFBTTtNQUNaLEVBQUUsRUFBRSxDQUFDO0tBQ04sQ0FBQyxDQUFDO0lBQ0gsTUFBTSxDQUFDLFlBQVk7TUFDakIsT0FBTyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsaUJBQWlCLENBQUMsQ0FBQztLQUNwRCxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDakIsR0FBRyxDQUFDLENBQUM7O0VBRUgsRUFBRSxDQUFDLG1FQUFtRSxFQUFFLFlBQVk7SUFDbEYsSUFBSSxpQkFBaUIsR0FBRyxDQUFDO01BQ3ZCLEVBQUUsRUFBRSxDQUFDO01BQ0wsSUFBSSxFQUFFLFFBQVE7TUFDZCxNQUFNLEVBQUUsUUFBUTtLQUNqQixDQUFDLENBQUM7SUFDSCxNQUFNLENBQUMsWUFBWTtNQUNqQixPQUFPLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0tBQ3BELENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUNqQixHQUFHLENBQUMsQ0FBQzs7RUFFSCxFQUFFLENBQUMsNEVBQTRFLEVBQUUsWUFBWTtJQUMzRixpQkFBaUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztNQUN4QixFQUFFLEVBQUUsQ0FBQztNQUNMLElBQUksRUFBRSxNQUFNO01BQ1osTUFBTSxFQUFFLFFBQVE7QUFDdEIsS0FBSyxDQUFDLENBQUMsQ0FBQzs7SUFFSixNQUFNLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDO01BQ3BDLElBQUksRUFBRSxzQkFBc0I7TUFDNUIsTUFBTSxFQUFFLENBQUM7UUFDUCxJQUFJLEVBQUUsVUFBVTtRQUNoQixJQUFJLEVBQUU7VUFDSixLQUFLLEVBQUUsQ0FBQztVQUNSLE1BQU0sRUFBRSxFQUFFO1NBQ1g7UUFDRCxNQUFNLEVBQUUsRUFBRTtPQUNYLENBQUM7QUFDUixLQUFLLENBQUMsQ0FBQzs7SUFFSCxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztNQUN4QixFQUFFLEVBQUUsQ0FBQztNQUNMLElBQUksRUFBRSxZQUFZO01BQ2xCLE1BQU0sRUFBRSxRQUFRO0FBQ3RCLEtBQUssQ0FBQyxDQUFDLENBQUM7O0lBRUosTUFBTSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQztNQUNwQyxNQUFNLEVBQUUsc0JBQXNCO01BQzlCLFFBQVEsRUFBRSxDQUFDO1FBQ1QsTUFBTSxFQUFFLGdCQUFnQjtRQUN4QixNQUFNLEVBQUUsTUFBTTtRQUNkLFdBQVcsRUFBRTtVQUNYLE9BQU8sRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLEVBQUU7U0FDM0I7UUFDRCxRQUFRLEVBQUU7VUFDUixPQUFPLEVBQUUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxFQUFFO1NBQ3pCO1FBQ0QsUUFBUSxFQUFFLEVBQUU7T0FDYixDQUFDO0FBQ1IsS0FBSyxDQUFDLENBQUM7O0FBRVAsSUFBSSxpQkFBaUIsQ0FBQyxVQUFVLENBQUMsMEJBQTBCLEVBQUUsZUFBZSxDQUFDLENBQUM7O0lBRTFFLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxDQUFDO01BQ3hCLEVBQUUsRUFBRSxDQUFDO01BQ0wsSUFBSSxFQUFFLGVBQWU7TUFDckIsTUFBTSxFQUFFLFFBQVE7S0FDakIsQ0FBQyxDQUFDLENBQUM7SUFDSixNQUFNLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsTUFBTSxFQUFFLHNCQUFzQixFQUFFLFFBQVEsRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLGtCQUFrQixFQUFFLEtBQUssRUFBRSxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUMsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsV0FBVyxFQUFFLFdBQVcsRUFBRSxFQUFFLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxFQUFFLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsV0FBVyxFQUFFLFdBQVcsRUFBRSxFQUFFLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxFQUFFLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLENBQUMsc0JBQXNCLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxrQkFBa0IsRUFBRSxLQUFLLEVBQUUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUUsV0FBVyxFQUFFLEVBQUUsT0FBTyxFQUFFLGtCQUFrQixFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLEVBQUUsT0FBTyxFQUFFLGtCQUFrQixFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUUsV0FBVyxFQUFFLEVBQUUsT0FBTyxFQUFFLGtCQUFrQixFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLEVBQUUsT0FBTyxFQUFFLGtCQUFrQixFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsQ0FBQyxzQkFBc0IsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQzdoQyxHQUFHLENBQUMsQ0FBQzs7RUFFSCxFQUFFLENBQUMsK0VBQStFLEVBQUUsWUFBWTtJQUM5RixJQUFJLGlCQUFpQixHQUFHLENBQUM7TUFDdkIsRUFBRSxFQUFFLENBQUM7TUFDTCxJQUFJLEVBQUUsTUFBTTtNQUNaLE1BQU0sRUFBRSxRQUFRO0tBQ2pCLEVBQUU7TUFDRCxFQUFFLEVBQUUsQ0FBQztNQUNMLElBQUksRUFBRSxZQUFZO01BQ2xCLE1BQU0sRUFBRSxDQUFDO0tBQ1YsQ0FBQyxDQUFDO0lBQ0gsaUJBQWlCLENBQUMsTUFBTSxDQUFDLGlCQUFpQixDQUFDLENBQUM7SUFDNUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsaUJBQWlCLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDakUsTUFBTSxDQUFDLGlCQUFpQixDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDMUQsR0FBRyxDQUFDLENBQUM7O0VBRUgsRUFBRSxDQUFDLGtEQUFrRCxFQUFFLFlBQVk7SUFDakUsSUFBSSxNQUFNLEdBQUc7TUFDWCxJQUFJLEVBQUUsUUFBUTtNQUNkLFNBQVMsRUFBRSxHQUFHO01BQ2QsTUFBTSxFQUFFLENBQUM7QUFDZixLQUFLLENBQUM7O0lBRUYsSUFBSSxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQztJQUN2QixJQUFJLFNBQVMsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDO0FBQ3JDLElBQUksSUFBSSxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQzs7SUFFM0IsSUFBSSxpQkFBaUIsR0FBRyxDQUFDO01BQ3ZCLEVBQUUsRUFBRSxDQUFDO01BQ0wsSUFBSSxFQUFFLFlBQVk7TUFDbEIsTUFBTSxFQUFFLE1BQU07TUFDZCxNQUFNLEVBQUUsUUFBUTtBQUN0QixLQUFLLENBQUMsQ0FBQzs7SUFFSCxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsaUJBQWlCLENBQUMsQ0FBQztJQUM1QyxJQUFJLFNBQVMsR0FBRyxpQkFBaUIsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO0lBQzVELE1BQU0sQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0lBQ25ELE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2xDLE1BQU0sQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUNsRCxNQUFNLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDaEQsR0FBRyxDQUFDLENBQUM7O0VBRUgsRUFBRSxDQUFDLDRDQUE0QyxFQUFFLFlBQVk7QUFDL0QsSUFBSSxJQUFJLElBQUksR0FBRyxHQUFHLENBQUM7O0lBRWYsSUFBSSxpQkFBaUIsR0FBRyxDQUFDO01BQ3ZCLEVBQUUsRUFBRSxDQUFDO01BQ0wsSUFBSSxFQUFFLE1BQU07TUFDWixNQUFNLEVBQUU7UUFDTixJQUFJLEVBQUUsSUFBSTtPQUNYO01BQ0QsTUFBTSxFQUFFLFFBQVE7QUFDdEIsS0FBSyxDQUFDLENBQUM7O0lBRUgsaUJBQWlCLENBQUMsTUFBTSxDQUFDLGlCQUFpQixDQUFDLENBQUM7SUFDNUMsSUFBSSxTQUFTLEdBQUcsaUJBQWlCLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztJQUM1RCxNQUFNLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUM3QyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDNUMsR0FBRyxDQUFDLENBQUM7O0VBRUgsRUFBRSxDQUFDLG9EQUFvRCxFQUFFLFlBQVk7SUFDbkUsSUFBSSxJQUFJLEdBQUcsU0FBUyxDQUFDO0lBQ3JCLElBQUksU0FBUyxHQUFHLEdBQUcsQ0FBQztJQUNwQixJQUFJLE1BQU0sR0FBRyxDQUFDLENBQUM7QUFDbkIsSUFBSSxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUM7O0lBRVosSUFBSSxpQkFBaUIsR0FBRyxDQUFDO01BQ3ZCLEVBQUUsRUFBRSxDQUFDO01BQ0wsSUFBSSxFQUFFLGNBQWM7TUFDcEIsTUFBTSxFQUFFO1FBQ04sSUFBSSxFQUFFLElBQUk7UUFDVixTQUFTLEVBQUUsU0FBUztRQUNwQixNQUFNLEVBQUUsTUFBTTtRQUNkLENBQUMsRUFBRSxDQUFDO09BQ0w7TUFDRCxNQUFNLEVBQUUsUUFBUTtBQUN0QixLQUFLLENBQUMsQ0FBQzs7SUFFSCxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsaUJBQWlCLENBQUMsQ0FBQztJQUM1QyxJQUFJLFNBQVMsR0FBRyxpQkFBaUIsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO0lBQzVELE1BQU0sQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7SUFDckQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDbEMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ2xELE1BQU0sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUM1QyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDdEMsR0FBRyxDQUFDLENBQUM7O0VBRUgsRUFBRSxDQUFDLDZDQUE2QyxFQUFFLFlBQVk7SUFDNUQsSUFBSSxTQUFTLEdBQUcsQ0FBQyxDQUFDO0FBQ3RCLElBQUksSUFBSSxZQUFZLEdBQUcsQ0FBQyxDQUFDOztJQUVyQixJQUFJLGlCQUFpQixHQUFHLENBQUM7TUFDdkIsRUFBRSxFQUFFLENBQUM7TUFDTCxJQUFJLEVBQUUsT0FBTztNQUNiLE1BQU0sRUFBRTtRQUNOLFNBQVMsRUFBRSxTQUFTO1FBQ3BCLFlBQVksRUFBRSxZQUFZO09BQzNCO01BQ0QsTUFBTSxFQUFFLFFBQVE7QUFDdEIsS0FBSyxDQUFDLENBQUM7O0lBRUgsaUJBQWlCLENBQUMsTUFBTSxDQUFDLGlCQUFpQixDQUFDLENBQUM7SUFDNUMsSUFBSSxTQUFTLEdBQUcsaUJBQWlCLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztJQUM1RCxNQUFNLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUM5QyxNQUFNLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDdEQsR0FBRyxDQUFDLENBQUM7O0VBRUgsRUFBRSxDQUFDLG9EQUFvRCxFQUFFLFlBQVk7QUFDdkUsSUFBSSxJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUM7O0lBRVosSUFBSSxpQkFBaUIsR0FBRyxDQUFDO01BQ3ZCLEVBQUUsRUFBRSxDQUFDO01BQ0wsSUFBSSxFQUFFLGNBQWM7TUFDcEIsTUFBTSxFQUFFO1FBQ04sR0FBRyxFQUFFLEdBQUc7T0FDVDtNQUNELE1BQU0sRUFBRSxRQUFRO0FBQ3RCLEtBQUssQ0FBQyxDQUFDOztJQUVILGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0lBQzVDLElBQUksU0FBUyxHQUFHLGlCQUFpQixDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7SUFDNUQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUM7SUFDNUQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0dBQ3ZDLENBQUMsQ0FBQztDQUNKLENBQUMsQ0FBQztBQUNIOzs7QUMxT0EsWUFBWSxDQUFDOztBQUViLElBQUksWUFBWSxHQUFHLE9BQU8sQ0FBQyxvQ0FBb0MsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDOztBQUU1RSxJQUFJLGVBQWUsR0FBRyxPQUFPLENBQUMsd0NBQXdDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQzs7QUFFbkYsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDOztBQUVoQyxJQUFJLEdBQUcsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDO0FBQ3ZCLElBQUksS0FBSyxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUM7QUFDM0IsSUFBSSxNQUFNLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQztBQUM3QixJQUFJLE9BQU8sR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDO0FBQy9CLElBQUksY0FBYyxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUM7QUFDN0MsSUFBSSxPQUFPLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQztBQUMvQixJQUFJLElBQUksR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDO0FBQ3pCLElBQUksU0FBUyxHQUFHLFFBQVEsQ0FBQyxTQUFTLENBQUM7QUFDbkMsSUFBSSxPQUFPLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQztBQUMvQixJQUFJLGdCQUFnQixHQUFHLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQztBQUNqRCxJQUFJLEtBQUssR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDO0FBQzNCLElBQUksR0FBRyxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUM7QUFDdkIsSUFBSSxTQUFTLEdBQUcsUUFBUSxDQUFDLFNBQVMsQ0FBQztBQUNuQyxJQUFJLE1BQU0sR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDO0FBQzdCLElBQUksTUFBTSxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUM7O0FBRTdCLElBQUksVUFBVSxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUN2QyxJQUFJLHNCQUFzQixHQUFHLE9BQU8sQ0FBQyxrREFBa0QsQ0FBQyxDQUFDO0FBQ3pGLElBQUksc0JBQXNCLEdBQUcsT0FBTyxDQUFDLGtEQUFrRCxDQUFDLENBQUM7QUFDekYsSUFBSSxpQkFBaUIsR0FBRyxPQUFPLENBQUMsMkJBQTJCLENBQUMsQ0FBQzs7QUFFN0QsSUFBSSxtQ0FBbUMsR0FBRyxTQUFTLG1DQUFtQyxDQUFDLFdBQVcsRUFBRTtFQUNsRyxXQUFXLENBQUMsVUFBVSxFQUFFLENBQUM7RUFDekIsSUFBSSxDQUFDLFlBQVksR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDL0csQ0FBQyxDQUFDOztBQUVGLElBQUksaURBQWlELEdBQUcsU0FBUyxpREFBaUQsQ0FBQyxzQkFBc0IsRUFBRTtBQUMzSSxFQUFFLElBQUkseUJBQXlCLEdBQUcsY0FBYyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxzQkFBc0IsRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7O0FBRTNHLEVBQUUsSUFBSSxDQUFDLFlBQVksR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsdUJBQXVCLENBQUMseUJBQXlCLENBQUMsQ0FBQyxDQUFDOztFQUV2RyxPQUFPLHNCQUFzQixDQUFDO0FBQ2hDLENBQUMsQ0FBQzs7QUFFRixJQUFJLDBDQUEwQyxHQUFHLFNBQVMsMENBQTBDLENBQUMsc0JBQXNCLEVBQUU7QUFDN0gsRUFBRSxJQUFJLHVCQUF1QixHQUFHLGNBQWMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxDQUFDLFlBQVksRUFBRSxzQkFBc0IsQ0FBQyxDQUFDOztBQUV6RyxFQUFFLE9BQU8sQ0FBQyxtQ0FBbUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsdUJBQXVCLENBQUMsQ0FBQzs7RUFFakYsT0FBTyxzQkFBc0IsQ0FBQztBQUNoQyxDQUFDLENBQUM7O0FBRUYsSUFBSSwwQ0FBMEMsR0FBRyxTQUFTLDBDQUEwQyxDQUFDLHNCQUFzQixFQUFFO0FBQzdILEVBQUUsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDOztBQUVuQixFQUFFLElBQUksWUFBWSxHQUFHLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxzQkFBc0IsRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7O0VBRTlGLE9BQU8sQ0FBQyxVQUFVLHFCQUFxQixFQUFFO0lBQ3ZDLElBQUksZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUscUJBQXFCLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDeEYsSUFBSSxxQkFBcUIsQ0FBQyxJQUFJLEtBQUssZ0JBQWdCLENBQUMsSUFBSSxFQUFFLG1DQUFtQyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztJQUM1SCxnQkFBZ0IsQ0FBQyxlQUFlLENBQUMscUJBQXFCLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDbkUsR0FBRyxFQUFFLFlBQVksQ0FBQyxDQUFDOztFQUVqQixPQUFPLHNCQUFzQixDQUFDO0FBQ2hDLENBQUMsQ0FBQzs7QUFFRixJQUFJLGlCQUFpQixHQUFHLENBQUMsWUFBWTtFQUNuQyxTQUFTLGlCQUFpQixHQUFHO0FBQy9CLElBQUksSUFBSSxNQUFNLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxLQUFLLFNBQVMsR0FBRyxFQUFFLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDOztBQUVoRSxJQUFJLGVBQWUsQ0FBQyxJQUFJLEVBQUUsaUJBQWlCLENBQUMsQ0FBQzs7SUFFekMsSUFBSSxDQUFDLFlBQVksR0FBRyxNQUFNLENBQUMsWUFBWSxJQUFJLElBQUksWUFBWSxFQUFFLENBQUM7SUFDOUQsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDO0lBQzdELElBQUksQ0FBQyxZQUFZLEdBQUcsRUFBRSxDQUFDO0FBQzNCLElBQUksSUFBSSxDQUFDLFdBQVcsR0FBRyxFQUFFLENBQUM7O0lBRXRCLElBQUksQ0FBQyxzQkFBc0IsR0FBRyxPQUFPLENBQUMsaURBQWlELENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLDBDQUEwQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSwwQ0FBMEMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUN0TixHQUFHOztFQUVELFlBQVksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO0lBQy9CLEdBQUcsRUFBRSx5QkFBeUI7SUFDOUIsS0FBSyxFQUFFLFNBQVMsdUJBQXVCLENBQUMsdUJBQXVCLEVBQUU7QUFDckUsTUFBTSxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUM7O01BRWxCLElBQUksaUNBQWlDLEdBQUcsU0FBUyxDQUFDLFVBQVUsSUFBSSxFQUFFO1FBQ2hFLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDckIsT0FBTyxLQUFLLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQy9DLE9BQU8sRUFBRSx1QkFBdUIsQ0FBQyxDQUFDOztNQUU1QixJQUFJLDRCQUE0QixHQUFHLGlDQUFpQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzlFLE1BQU0sSUFBSSw0QkFBNEIsR0FBRyxpQ0FBaUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7TUFFeEUsSUFBSSx1QkFBdUIsR0FBRyxHQUFHLENBQUMsVUFBVSxzQkFBc0IsRUFBRTtRQUNsRSxPQUFPLElBQUksc0JBQXNCLENBQUMsTUFBTSxFQUFFLHNCQUFzQixDQUFDLENBQUM7T0FDbkUsRUFBRSw0QkFBNEIsQ0FBQyxDQUFDO01BQ2pDLElBQUksdUJBQXVCLEdBQUcsR0FBRyxDQUFDLFVBQVUsc0JBQXNCLEVBQUU7UUFDbEUsT0FBTyxJQUFJLHNCQUFzQixDQUFDLE1BQU0sRUFBRSxzQkFBc0IsQ0FBQyxDQUFDO0FBQzFFLE9BQU8sRUFBRSw0QkFBNEIsQ0FBQyxDQUFDOztNQUVqQyxPQUFPLE1BQU0sQ0FBQyx1QkFBdUIsRUFBRSx1QkFBdUIsQ0FBQyxDQUFDO0tBQ2pFO0dBQ0YsRUFBRTtJQUNELEdBQUcsRUFBRSxZQUFZO0lBQ2pCLEtBQUssRUFBRSxTQUFTLFVBQVUsQ0FBQyx1QkFBdUIsRUFBRSxJQUFJLEVBQUU7QUFDOUQsTUFBTSxJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsSUFBSSxHQUFHLDBEQUEwRCxDQUFDLENBQUM7O01BRXZJLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEdBQUcsdUJBQXVCLENBQUM7TUFDakQsT0FBTyxJQUFJLENBQUM7S0FDYjtHQUNGLEVBQUU7SUFDRCxHQUFHLEVBQUUsUUFBUTtJQUNiLEtBQUssRUFBRSxTQUFTLE1BQU0sQ0FBQyxzQkFBc0IsRUFBRTtBQUNuRCxNQUFNLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQzs7QUFFeEIsTUFBTSxJQUFJLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxFQUFFLHNCQUFzQixDQUFDLEVBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQyxzR0FBc0csQ0FBQyxDQUFDOztNQUVsTCxJQUFJLENBQUMsc0JBQXNCLENBQUMsc0JBQXNCLENBQUMsQ0FBQztNQUNwRCxpQkFBaUIsQ0FBQyxzQkFBc0IsRUFBRSxJQUFJLENBQUMsWUFBWSxFQUFFLFVBQVUsZ0JBQWdCLEVBQUU7UUFDdkYsT0FBTyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3ZELE9BQU8sQ0FBQyxDQUFDOztNQUVILE9BQU8sSUFBSSxDQUFDO0tBQ2I7QUFDTCxHQUFHLENBQUMsQ0FBQyxDQUFDOztFQUVKLE9BQU8saUJBQWlCLENBQUM7QUFDM0IsQ0FBQyxHQUFHLENBQUM7O0FBRUwsTUFBTSxDQUFDLE9BQU8sR0FBRyxpQkFBaUIsQ0FBQztBQUNuQzs7O0FDaElBLFlBQVksQ0FBQzs7QUFFYixNQUFNLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0FBQ2hEOzs7QUNIQSxZQUFZLENBQUM7O0FBRWIsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDOztBQUVoQyxJQUFJLElBQUksR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDO0FBQ3pCLElBQUksT0FBTyxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUM7QUFDL0IsSUFBSSxNQUFNLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQzs7QUFFN0IsTUFBTSxDQUFDLE9BQU8sR0FBRyxVQUFVLHNCQUFzQixFQUFFLGlCQUFpQixFQUFFO0VBQ3BFLElBQUksd0JBQXdCLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxLQUFLLFNBQVMsR0FBRyxZQUFZLEVBQUUsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFDMUYsT0FBTyxPQUFPLENBQUMsVUFBVSxnQkFBZ0IsRUFBRTtJQUN6QyxPQUFPLENBQUMsVUFBVSxVQUFVLEVBQUU7TUFDNUIsSUFBSSxVQUFVLEtBQUssUUFBUSxFQUFFO1FBQzNCLHdCQUF3QixDQUFDLGdCQUFnQixDQUFDLENBQUM7T0FDNUMsTUFBTTtRQUNMLElBQUksMkJBQTJCLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1FBQ3BGLElBQUksMkJBQTJCLFlBQVksc0JBQXNCLEVBQUU7VUFDakUsT0FBTyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsRUFBRSwyQkFBMkIsQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUM5RixNQUFNO1VBQ0wsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLDJCQUEyQixDQUFDLFNBQVMsQ0FBQyxDQUFDO1NBQ2pFO09BQ0Y7S0FDRixFQUFFLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDO0dBQzdCLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztDQUN2QixDQUFDO0FBQ0Y7OztBQ3pCQSxZQUFZLENBQUM7O0FBRWIsSUFBSSxVQUFVLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDOztBQUV2QyxJQUFJLGdCQUFnQixHQUFHO0VBQ3JCLEtBQUssRUFBRSxjQUFjO0FBQ3ZCLENBQUMsQ0FBQzs7QUFFRixNQUFNLENBQUMsT0FBTyxHQUFHLFVBQVUsWUFBWSxFQUFFLElBQUksRUFBRSxpQkFBaUIsRUFBRTtFQUNoRSxJQUFJLG9CQUFvQixHQUFHLGdCQUFnQixDQUFDLElBQUksQ0FBQyxDQUFDO0VBQ2xELElBQUksU0FBUyxHQUFHLG9CQUFvQixHQUFHLFlBQVksQ0FBQyxRQUFRLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsaUJBQWlCLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxHQUFHLFlBQVksQ0FBQyxRQUFRLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQztFQUN4SyxJQUFJLElBQUksS0FBSyxZQUFZLEVBQUU7SUFDekIsU0FBUyxDQUFDLEtBQUssRUFBRSxDQUFDO0dBQ25CO0VBQ0QsT0FBTyxTQUFTLENBQUM7Q0FDbEIsQ0FBQztBQUNGOzs7QUNoQkEsWUFBWSxDQUFDOztBQUViLElBQUksWUFBWSxHQUFHLE9BQU8sQ0FBQyxvQ0FBb0MsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDOztBQUU1RSxJQUFJLGVBQWUsR0FBRyxPQUFPLENBQUMsd0NBQXdDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQzs7QUFFbkYsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDOztBQUVoQyxJQUFJLFFBQVEsR0FBRyxRQUFRLENBQUMsUUFBUSxDQUFDO0FBQ2pDLElBQUksTUFBTSxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUM7QUFDN0IsSUFBSSxPQUFPLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQztBQUMvQixJQUFJLElBQUksR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDO0FBQ3pCLElBQUksSUFBSSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUM7QUFDekIsSUFBSSxLQUFLLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQztBQUMzQixJQUFJLE1BQU0sR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDO0FBQzdCLElBQUksSUFBSSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUM7QUFDekIsSUFBSSxPQUFPLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQzs7QUFFL0IsSUFBSSxpQkFBaUIsR0FBRyxPQUFPLENBQUMsNEJBQTRCLENBQUMsQ0FBQzs7QUFFOUQsTUFBTSxDQUFDLE9BQU8sR0FBRyxDQUFDLFlBQVk7RUFDNUIsU0FBUyxzQkFBc0IsQ0FBQyxpQkFBaUIsRUFBRSxJQUFJLEVBQUU7SUFDdkQsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztJQUNyQixJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDO0lBQ2pCLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7QUFDN0IsSUFBSSxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDOztBQUU3QixJQUFJLGVBQWUsQ0FBQyxJQUFJLEVBQUUsc0JBQXNCLENBQUMsQ0FBQzs7SUFFOUMsTUFBTSxHQUFHLE1BQU0sSUFBSSxFQUFFLENBQUM7SUFDdEIsSUFBSSxDQUFDLHVCQUF1QixHQUFHLGlCQUFpQixDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNuRSxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztJQUNqQixJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUN6RCxJQUFJLENBQUMsWUFBWSxHQUFHLGlCQUFpQixDQUFDLHVCQUF1QixDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUNqRixpQkFBaUIsQ0FBQyxzQkFBc0IsRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDN0QsSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUM7SUFDYixJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEdBQUcsTUFBTSxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDNUQsR0FBRzs7RUFFRCxZQUFZLENBQUMsc0JBQXNCLEVBQUUsQ0FBQztJQUNwQyxHQUFHLEVBQUUsU0FBUztJQUNkLEtBQUssRUFBRSxTQUFTLE9BQU8sQ0FBQyxXQUFXLEVBQUU7TUFDbkMsSUFBSSxrQkFBa0IsR0FBRyxNQUFNLENBQUMsVUFBVSxLQUFLLEVBQUU7UUFDL0MsSUFBSSxNQUFNLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQztRQUMxQixPQUFPLFFBQVEsQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7T0FDbkMsRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7TUFDdEIsT0FBTyxDQUFDLFVBQVUsU0FBUyxFQUFFO1FBQzNCLE9BQU8sU0FBUyxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQztPQUN2QyxFQUFFLEtBQUssQ0FBQyxXQUFXLEVBQUUsa0JBQWtCLENBQUMsQ0FBQyxDQUFDO0tBQzVDO0dBQ0YsRUFBRTtJQUNELEdBQUcsRUFBRSxZQUFZO0lBQ2pCLEtBQUssRUFBRSxTQUFTLFVBQVUsR0FBRztNQUMzQixPQUFPLENBQUMsVUFBVSxXQUFXLEVBQUU7UUFDN0IsT0FBTyxXQUFXLENBQUMsVUFBVSxFQUFFLENBQUM7T0FDakMsRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7S0FDdkI7R0FDRixFQUFFO0lBQ0QsR0FBRyxFQUFFLGlCQUFpQjtJQUN0QixLQUFLLEVBQUUsU0FBUyxlQUFlLENBQUMsTUFBTSxFQUFFO01BQ3RDLE9BQU8sQ0FBQyxVQUFVLFdBQVcsRUFBRSxLQUFLLEVBQUU7UUFDcEMsSUFBSSxNQUFNLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQztRQUMxQixPQUFPLFdBQVcsQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLENBQUM7T0FDNUMsRUFBRSxJQUFJLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0tBQzdEO0dBQ0YsRUFBRTtJQUNELEdBQUcsRUFBRSxRQUFRO0lBQ2IsR0FBRyxFQUFFLFNBQVMsR0FBRyxHQUFHO01BQ2xCLE9BQU8sS0FBSyxDQUFDLFdBQVcsRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztLQUNoRjtBQUNMLEdBQUcsQ0FBQyxDQUFDLENBQUM7O0VBRUosT0FBTyxzQkFBc0IsQ0FBQztDQUMvQixHQUFHLENBQUM7QUFDTDs7O0FDMUVBLFlBQVksQ0FBQzs7QUFFYixJQUFJLFlBQVksR0FBRyxPQUFPLENBQUMsb0NBQW9DLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQzs7QUFFNUUsSUFBSSxlQUFlLEdBQUcsT0FBTyxDQUFDLHdDQUF3QyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUM7O0FBRW5GLElBQUksZUFBZSxHQUFHLE9BQU8sQ0FBQywwQkFBMEIsQ0FBQyxDQUFDOztBQUUxRCxJQUFJLFFBQVEsR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7O0FBRWhDLElBQUksT0FBTyxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUM7QUFDL0IsSUFBSSxJQUFJLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQztBQUN6QixJQUFJLElBQUksR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDO0FBQ3pCLElBQUksSUFBSSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUM7O0FBRXpCLElBQUkscUJBQXFCLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQzs7QUFFN0MsTUFBTSxDQUFDLE9BQU8sR0FBRyxDQUFDLFlBQVk7RUFDNUIsU0FBUyxzQkFBc0IsQ0FBQyxpQkFBaUIsRUFBRSxpQkFBaUIsRUFBRTtBQUN4RSxJQUFJLGVBQWUsQ0FBQyxJQUFJLEVBQUUsc0JBQXNCLENBQUMsQ0FBQzs7SUFFOUMsSUFBSSxJQUFJLEdBQUcsaUJBQWlCLENBQUMsSUFBSSxDQUFDO0lBQ2xDLElBQUksRUFBRSxHQUFHLGlCQUFpQixDQUFDLEVBQUUsQ0FBQztJQUM5QixJQUFJLEtBQUssR0FBRyxpQkFBaUIsQ0FBQyxLQUFLLENBQUM7SUFDcEMsSUFBSSxNQUFNLEdBQUcsaUJBQWlCLENBQUMsTUFBTSxDQUFDO0FBQzFDLElBQUksSUFBSSxNQUFNLEdBQUcsaUJBQWlCLENBQUMsTUFBTSxDQUFDOztJQUV0QyxNQUFNLEdBQUcsTUFBTSxJQUFJLEVBQUUsQ0FBQztJQUN0QixJQUFJLGlCQUFpQixHQUFHLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUM1RCxNQUFNLEdBQUcsSUFBSSxDQUFDLHFCQUFxQixFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQzdDLElBQUksQ0FBQyxTQUFTLEdBQUcsZUFBZSxDQUFDLGlCQUFpQixDQUFDLFlBQVksRUFBRSxJQUFJLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztJQUMxRixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztJQUNqQixJQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzdCLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDO0lBQ2IsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7SUFDbkIsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxHQUFHLE1BQU0sR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3hELElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0FBQ3pCLEdBQUc7O0VBRUQsWUFBWSxDQUFDLHNCQUFzQixFQUFFLENBQUM7SUFDcEMsR0FBRyxFQUFFLFNBQVM7SUFDZCxLQUFLLEVBQUUsU0FBUyxPQUFPLENBQUMsV0FBVyxFQUFFO01BQ25DLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0tBQ3JDO0dBQ0YsRUFBRTtJQUNELEdBQUcsRUFBRSxZQUFZO0lBQ2pCLEtBQUssRUFBRSxTQUFTLFVBQVUsR0FBRztNQUMzQixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxDQUFDO01BQzdDLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxFQUFFLENBQUM7S0FDN0I7R0FDRixFQUFFO0lBQ0QsR0FBRyxFQUFFLGlCQUFpQjtJQUN0QixLQUFLLEVBQUUsU0FBUyxlQUFlLENBQUMsTUFBTSxFQUFFO0FBQzVDLE1BQU0sSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDOztNQUVqQixNQUFNLEdBQUcsSUFBSSxDQUFDLHFCQUFxQixFQUFFLE1BQU0sQ0FBQyxDQUFDO01BQzdDLE9BQU8sQ0FBQyxVQUFVLEdBQUcsRUFBRTtRQUNyQixRQUFRLEdBQUc7VUFDVCxLQUFLLE1BQU07WUFDVCxLQUFLLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNuQyxPQUFPO1VBQ1Q7WUFDRSxLQUFLLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDekMsT0FBTztTQUNWO09BQ0YsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztLQUNsQjtBQUNMLEdBQUcsQ0FBQyxDQUFDLENBQUM7O0VBRUosT0FBTyxzQkFBc0IsQ0FBQztDQUMvQixHQUFHLENBQUM7QUFDTCIsImZpbGUiOiJzcGVjLmpzIiwic291cmNlUm9vdCI6Ii9zb3VyY2UvIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJtb2R1bGUuZXhwb3J0cyA9IHsgXCJkZWZhdWx0XCI6IHJlcXVpcmUoXCJjb3JlLWpzL2xpYnJhcnkvZm4vb2JqZWN0L2RlZmluZS1wcm9wZXJ0eVwiKSwgX19lc01vZHVsZTogdHJ1ZSB9OyIsIlwidXNlIHN0cmljdFwiO1xuXG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IGZ1bmN0aW9uIChpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHtcbiAgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpO1xuICB9XG59O1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlOyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgX09iamVjdCRkZWZpbmVQcm9wZXJ0eSA9IHJlcXVpcmUoXCJiYWJlbC1ydW50aW1lL2NvcmUtanMvb2JqZWN0L2RlZmluZS1wcm9wZXJ0eVwiKVtcImRlZmF1bHRcIl07XG5cbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gKGZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTtcbiAgICAgIGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTtcbiAgICAgIGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTtcbiAgICAgIGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7XG5cbiAgICAgIF9PYmplY3QkZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHtcbiAgICBpZiAocHJvdG9Qcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpO1xuICAgIGlmIChzdGF0aWNQcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpO1xuICAgIHJldHVybiBDb25zdHJ1Y3RvcjtcbiAgfTtcbn0pKCk7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7IiwidmFyICQgPSByZXF1aXJlKCcuLi8uLi9tb2R1bGVzLyQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZGVmaW5lUHJvcGVydHkoaXQsIGtleSwgZGVzYyl7XG4gIHJldHVybiAkLnNldERlc2MoaXQsIGtleSwgZGVzYyk7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oJCl7XG4gICQuRlcgICA9IGZhbHNlO1xuICAkLnBhdGggPSAkLmNvcmU7XG4gIHJldHVybiAkO1xufTsiLCIndXNlIHN0cmljdCc7XG52YXIgZ2xvYmFsID0gdHlwZW9mIHNlbGYgIT0gJ3VuZGVmaW5lZCcgPyBzZWxmIDogRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKVxuICAsIGNvcmUgICA9IHt9XG4gICwgZGVmaW5lUHJvcGVydHkgPSBPYmplY3QuZGVmaW5lUHJvcGVydHlcbiAgLCBoYXNPd25Qcm9wZXJ0eSA9IHt9Lmhhc093blByb3BlcnR5XG4gICwgY2VpbCAgPSBNYXRoLmNlaWxcbiAgLCBmbG9vciA9IE1hdGguZmxvb3JcbiAgLCBtYXggICA9IE1hdGgubWF4XG4gICwgbWluICAgPSBNYXRoLm1pbjtcbi8vIFRoZSBlbmdpbmUgd29ya3MgZmluZSB3aXRoIGRlc2NyaXB0b3JzPyBUaGFuaydzIElFOCBmb3IgaGlzIGZ1bm55IGRlZmluZVByb3BlcnR5LlxudmFyIERFU0MgPSAhIWZ1bmN0aW9uKCl7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGRlZmluZVByb3BlcnR5KHt9LCAnYScsIHtnZXQ6IGZ1bmN0aW9uKCl7IHJldHVybiAyOyB9fSkuYSA9PSAyO1xuICB9IGNhdGNoKGUpeyAvKiBlbXB0eSAqLyB9XG59KCk7XG52YXIgaGlkZSA9IGNyZWF0ZURlZmluZXIoMSk7XG4vLyA3LjEuNCBUb0ludGVnZXJcbmZ1bmN0aW9uIHRvSW50ZWdlcihpdCl7XG4gIHJldHVybiBpc05hTihpdCA9ICtpdCkgPyAwIDogKGl0ID4gMCA/IGZsb29yIDogY2VpbCkoaXQpO1xufVxuZnVuY3Rpb24gZGVzYyhiaXRtYXAsIHZhbHVlKXtcbiAgcmV0dXJuIHtcbiAgICBlbnVtZXJhYmxlICA6ICEoYml0bWFwICYgMSksXG4gICAgY29uZmlndXJhYmxlOiAhKGJpdG1hcCAmIDIpLFxuICAgIHdyaXRhYmxlICAgIDogIShiaXRtYXAgJiA0KSxcbiAgICB2YWx1ZSAgICAgICA6IHZhbHVlXG4gIH07XG59XG5mdW5jdGlvbiBzaW1wbGVTZXQob2JqZWN0LCBrZXksIHZhbHVlKXtcbiAgb2JqZWN0W2tleV0gPSB2YWx1ZTtcbiAgcmV0dXJuIG9iamVjdDtcbn1cbmZ1bmN0aW9uIGNyZWF0ZURlZmluZXIoYml0bWFwKXtcbiAgcmV0dXJuIERFU0MgPyBmdW5jdGlvbihvYmplY3QsIGtleSwgdmFsdWUpe1xuICAgIHJldHVybiAkLnNldERlc2Mob2JqZWN0LCBrZXksIGRlc2MoYml0bWFwLCB2YWx1ZSkpO1xuICB9IDogc2ltcGxlU2V0O1xufVxuXG5mdW5jdGlvbiBpc09iamVjdChpdCl7XG4gIHJldHVybiBpdCAhPT0gbnVsbCAmJiAodHlwZW9mIGl0ID09ICdvYmplY3QnIHx8IHR5cGVvZiBpdCA9PSAnZnVuY3Rpb24nKTtcbn1cbmZ1bmN0aW9uIGlzRnVuY3Rpb24oaXQpe1xuICByZXR1cm4gdHlwZW9mIGl0ID09ICdmdW5jdGlvbic7XG59XG5mdW5jdGlvbiBhc3NlcnREZWZpbmVkKGl0KXtcbiAgaWYoaXQgPT0gdW5kZWZpbmVkKXRocm93IFR5cGVFcnJvcihcIkNhbid0IGNhbGwgbWV0aG9kIG9uICBcIiArIGl0KTtcbiAgcmV0dXJuIGl0O1xufVxuXG52YXIgJCA9IG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi8kLmZ3Jykoe1xuICBnOiBnbG9iYWwsXG4gIGNvcmU6IGNvcmUsXG4gIGh0bWw6IGdsb2JhbC5kb2N1bWVudCAmJiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQsXG4gIC8vIGh0dHA6Ly9qc3BlcmYuY29tL2NvcmUtanMtaXNvYmplY3RcbiAgaXNPYmplY3Q6ICAgaXNPYmplY3QsXG4gIGlzRnVuY3Rpb246IGlzRnVuY3Rpb24sXG4gIHRoYXQ6IGZ1bmN0aW9uKCl7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG4gIC8vIDcuMS40IFRvSW50ZWdlclxuICB0b0ludGVnZXI6IHRvSW50ZWdlcixcbiAgLy8gNy4xLjE1IFRvTGVuZ3RoXG4gIHRvTGVuZ3RoOiBmdW5jdGlvbihpdCl7XG4gICAgcmV0dXJuIGl0ID4gMCA/IG1pbih0b0ludGVnZXIoaXQpLCAweDFmZmZmZmZmZmZmZmZmKSA6IDA7IC8vIHBvdygyLCA1MykgLSAxID09IDkwMDcxOTkyNTQ3NDA5OTFcbiAgfSxcbiAgdG9JbmRleDogZnVuY3Rpb24oaW5kZXgsIGxlbmd0aCl7XG4gICAgaW5kZXggPSB0b0ludGVnZXIoaW5kZXgpO1xuICAgIHJldHVybiBpbmRleCA8IDAgPyBtYXgoaW5kZXggKyBsZW5ndGgsIDApIDogbWluKGluZGV4LCBsZW5ndGgpO1xuICB9LFxuICBoYXM6IGZ1bmN0aW9uKGl0LCBrZXkpe1xuICAgIHJldHVybiBoYXNPd25Qcm9wZXJ0eS5jYWxsKGl0LCBrZXkpO1xuICB9LFxuICBjcmVhdGU6ICAgICBPYmplY3QuY3JlYXRlLFxuICBnZXRQcm90bzogICBPYmplY3QuZ2V0UHJvdG90eXBlT2YsXG4gIERFU0M6ICAgICAgIERFU0MsXG4gIGRlc2M6ICAgICAgIGRlc2MsXG4gIGdldERlc2M6ICAgIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IsXG4gIHNldERlc2M6ICAgIGRlZmluZVByb3BlcnR5LFxuICBzZXREZXNjczogICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyxcbiAgZ2V0S2V5czogICAgT2JqZWN0LmtleXMsXG4gIGdldE5hbWVzOiAgIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzLFxuICBnZXRTeW1ib2xzOiBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzLFxuICBhc3NlcnREZWZpbmVkOiBhc3NlcnREZWZpbmVkLFxuICAvLyBEdW1teSwgZml4IGZvciBub3QgYXJyYXktbGlrZSBFUzMgc3RyaW5nIGluIGVzNSBtb2R1bGVcbiAgRVM1T2JqZWN0OiBPYmplY3QsXG4gIHRvT2JqZWN0OiBmdW5jdGlvbihpdCl7XG4gICAgcmV0dXJuICQuRVM1T2JqZWN0KGFzc2VydERlZmluZWQoaXQpKTtcbiAgfSxcbiAgaGlkZTogaGlkZSxcbiAgZGVmOiBjcmVhdGVEZWZpbmVyKDApLFxuICBzZXQ6IGdsb2JhbC5TeW1ib2wgPyBzaW1wbGVTZXQgOiBoaWRlLFxuICBlYWNoOiBbXS5mb3JFYWNoXG59KTtcbi8qIGVzbGludC1kaXNhYmxlIG5vLXVuZGVmICovXG5pZih0eXBlb2YgX19lICE9ICd1bmRlZmluZWQnKV9fZSA9IGNvcmU7XG5pZih0eXBlb2YgX19nICE9ICd1bmRlZmluZWQnKV9fZyA9IGdsb2JhbDsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChzdHJpbmcpIHtcbiAgcmV0dXJuIHN0cmluZy5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHN0cmluZy5zdWJzdHJpbmcoMSk7XG59XG5cbm1vZHVsZS5leHBvcnRzLndvcmRzID0gZnVuY3Rpb24gKHN0cmluZykge1xuICByZXR1cm4gc3RyaW5nLnJlcGxhY2UoLyhefFteYS16QS1aXFx1MDBDMC1cXHUwMTdGJ10pKFthLXpBLVpcXHUwMEMwLVxcdTAxN0ZdKS9nLCBmdW5jdGlvbiAobSkge1xuICAgIHJldHVybiBtLnRvVXBwZXJDYXNlKClcbiAgfSlcbn1cbiIsIi8vICBSYW1kYSB2MC4xNS4xXG4vLyAgaHR0cHM6Ly9naXRodWIuY29tL3JhbWRhL3JhbWRhXG4vLyAgKGMpIDIwMTMtMjAxNSBTY290dCBTYXV5ZXQsIE1pY2hhZWwgSHVybGV5LCBhbmQgRGF2aWQgQ2hhbWJlcnNcbi8vICBSYW1kYSBtYXkgYmUgZnJlZWx5IGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cblxuOyhmdW5jdGlvbigpIHtcblxuICAndXNlIHN0cmljdCc7XG5cbiAgLyoqXG4gICAgICogQSBzcGVjaWFsIHBsYWNlaG9sZGVyIHZhbHVlIHVzZWQgdG8gc3BlY2lmeSBcImdhcHNcIiB3aXRoaW4gY3VycmllZCBmdW5jdGlvbnMsXG4gICAgICogYWxsb3dpbmcgcGFydGlhbCBhcHBsaWNhdGlvbiBvZiBhbnkgY29tYmluYXRpb24gb2YgYXJndW1lbnRzLFxuICAgICAqIHJlZ2FyZGxlc3Mgb2YgdGhlaXIgcG9zaXRpb25zLlxuICAgICAqXG4gICAgICogSWYgYGdgIGlzIGEgY3VycmllZCB0ZXJuYXJ5IGZ1bmN0aW9uIGFuZCBgX2AgaXMgYFIuX19gLCB0aGUgZm9sbG93aW5nIGFyZSBlcXVpdmFsZW50OlxuICAgICAqXG4gICAgICogICAtIGBnKDEsIDIsIDMpYFxuICAgICAqICAgLSBgZyhfLCAyLCAzKSgxKWBcbiAgICAgKiAgIC0gYGcoXywgXywgMykoMSkoMilgXG4gICAgICogICAtIGBnKF8sIF8sIDMpKDEsIDIpYFxuICAgICAqICAgLSBgZyhfLCAyLCBfKSgxLCAzKWBcbiAgICAgKiAgIC0gYGcoXywgMikoMSkoMylgXG4gICAgICogICAtIGBnKF8sIDIpKDEsIDMpYFxuICAgICAqICAgLSBgZyhfLCAyKShfLCAzKSgxKWBcbiAgICAgKlxuICAgICAqIEBjb25zdGFudFxuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IEZ1bmN0aW9uXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgdmFyIGdyZWV0ID0gUi5yZXBsYWNlKCd7bmFtZX0nLCBSLl9fLCAnSGVsbG8sIHtuYW1lfSEnKTtcbiAgICAgKiAgICAgIGdyZWV0KCdBbGljZScpOyAvLz0+ICdIZWxsbywgQWxpY2UhJ1xuICAgICAqL1xuICAgIHZhciBfXyA9IHsgJ0BAZnVuY3Rpb25hbC9wbGFjZWhvbGRlcic6IHRydWUgfTtcblxuICAgIHZhciBfYWRkID0gZnVuY3Rpb24gX2FkZChhLCBiKSB7XG4gICAgICAgIHJldHVybiBhICsgYjtcbiAgICB9O1xuXG4gICAgdmFyIF9hbGwgPSBmdW5jdGlvbiBfYWxsKGZuLCBsaXN0KSB7XG4gICAgICAgIHZhciBpZHggPSAwO1xuICAgICAgICB3aGlsZSAoaWR4IDwgbGlzdC5sZW5ndGgpIHtcbiAgICAgICAgICAgIGlmICghZm4obGlzdFtpZHhdKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlkeCArPSAxO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH07XG5cbiAgICB2YXIgX2FueSA9IGZ1bmN0aW9uIF9hbnkoZm4sIGxpc3QpIHtcbiAgICAgICAgdmFyIGlkeCA9IDA7XG4gICAgICAgIHdoaWxlIChpZHggPCBsaXN0Lmxlbmd0aCkge1xuICAgICAgICAgICAgaWYgKGZuKGxpc3RbaWR4XSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlkeCArPSAxO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9O1xuXG4gICAgdmFyIF9hc3NvYyA9IGZ1bmN0aW9uIF9hc3NvYyhwcm9wLCB2YWwsIG9iaikge1xuICAgICAgICB2YXIgcmVzdWx0ID0ge307XG4gICAgICAgIGZvciAodmFyIHAgaW4gb2JqKSB7XG4gICAgICAgICAgICByZXN1bHRbcF0gPSBvYmpbcF07XG4gICAgICAgIH1cbiAgICAgICAgcmVzdWx0W3Byb3BdID0gdmFsO1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG5cbiAgICB2YXIgX2Nsb25lUmVnRXhwID0gZnVuY3Rpb24gX2Nsb25lUmVnRXhwKHBhdHRlcm4pIHtcbiAgICAgICAgcmV0dXJuIG5ldyBSZWdFeHAocGF0dGVybi5zb3VyY2UsIChwYXR0ZXJuLmdsb2JhbCA/ICdnJyA6ICcnKSArIChwYXR0ZXJuLmlnbm9yZUNhc2UgPyAnaScgOiAnJykgKyAocGF0dGVybi5tdWx0aWxpbmUgPyAnbScgOiAnJykgKyAocGF0dGVybi5zdGlja3kgPyAneScgOiAnJykgKyAocGF0dGVybi51bmljb2RlID8gJ3UnIDogJycpKTtcbiAgICB9O1xuXG4gICAgdmFyIF9jb21wbGVtZW50ID0gZnVuY3Rpb24gX2NvbXBsZW1lbnQoZikge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuICFmLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgIH07XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEJhc2ljLCByaWdodC1hc3NvY2lhdGl2ZSBjb21wb3NpdGlvbiBmdW5jdGlvbi4gQWNjZXB0cyB0d28gZnVuY3Rpb25zIGFuZCByZXR1cm5zIHRoZVxuICAgICAqIGNvbXBvc2l0ZSBmdW5jdGlvbjsgdGhpcyBjb21wb3NpdGUgZnVuY3Rpb24gcmVwcmVzZW50cyB0aGUgb3BlcmF0aW9uIGB2YXIgaCA9IGYoZyh4KSlgLFxuICAgICAqIHdoZXJlIGBmYCBpcyB0aGUgZmlyc3QgYXJndW1lbnQsIGBnYCBpcyB0aGUgc2Vjb25kIGFyZ3VtZW50LCBhbmQgYHhgIGlzIHdoYXRldmVyXG4gICAgICogYXJndW1lbnQocykgYXJlIHBhc3NlZCB0byBgaGAuXG4gICAgICpcbiAgICAgKiBUaGlzIGZ1bmN0aW9uJ3MgbWFpbiB1c2UgaXMgdG8gYnVpbGQgdGhlIG1vcmUgZ2VuZXJhbCBgY29tcG9zZWAgZnVuY3Rpb24sIHdoaWNoIGFjY2VwdHNcbiAgICAgKiBhbnkgbnVtYmVyIG9mIGZ1bmN0aW9ucy5cbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQGNhdGVnb3J5IEZ1bmN0aW9uXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gZiBBIGZ1bmN0aW9uLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGcgQSBmdW5jdGlvbi5cbiAgICAgKiBAcmV0dXJuIHtGdW5jdGlvbn0gQSBuZXcgZnVuY3Rpb24gdGhhdCBpcyB0aGUgZXF1aXZhbGVudCBvZiBgZihnKHgpKWAuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgdmFyIGRvdWJsZSA9IGZ1bmN0aW9uKHgpIHsgcmV0dXJuIHggKiAyOyB9O1xuICAgICAqICAgICAgdmFyIHNxdWFyZSA9IGZ1bmN0aW9uKHgpIHsgcmV0dXJuIHggKiB4OyB9O1xuICAgICAqICAgICAgdmFyIHNxdWFyZVRoZW5Eb3VibGUgPSBfY29tcG9zZShkb3VibGUsIHNxdWFyZSk7XG4gICAgICpcbiAgICAgKiAgICAgIHNxdWFyZVRoZW5Eb3VibGUoNSk7IC8v4omFIGRvdWJsZShzcXVhcmUoNSkpID0+IDUwXG4gICAgICovXG4gICAgdmFyIF9jb21wb3NlID0gZnVuY3Rpb24gX2NvbXBvc2UoZiwgZykge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIGYuY2FsbCh0aGlzLCBnLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpO1xuICAgICAgICB9O1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBQcml2YXRlIGBjb25jYXRgIGZ1bmN0aW9uIHRvIG1lcmdlIHR3byBhcnJheS1saWtlIG9iamVjdHMuXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEBwYXJhbSB7QXJyYXl8QXJndW1lbnRzfSBbc2V0MT1bXV0gQW4gYXJyYXktbGlrZSBvYmplY3QuXG4gICAgICogQHBhcmFtIHtBcnJheXxBcmd1bWVudHN9IFtzZXQyPVtdXSBBbiBhcnJheS1saWtlIG9iamVjdC5cbiAgICAgKiBAcmV0dXJuIHtBcnJheX0gQSBuZXcsIG1lcmdlZCBhcnJheS5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICBfY29uY2F0KFs0LCA1LCA2XSwgWzEsIDIsIDNdKTsgLy89PiBbNCwgNSwgNiwgMSwgMiwgM11cbiAgICAgKi9cbiAgICB2YXIgX2NvbmNhdCA9IGZ1bmN0aW9uIF9jb25jYXQoc2V0MSwgc2V0Mikge1xuICAgICAgICBzZXQxID0gc2V0MSB8fCBbXTtcbiAgICAgICAgc2V0MiA9IHNldDIgfHwgW107XG4gICAgICAgIHZhciBpZHg7XG4gICAgICAgIHZhciBsZW4xID0gc2V0MS5sZW5ndGg7XG4gICAgICAgIHZhciBsZW4yID0gc2V0Mi5sZW5ndGg7XG4gICAgICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICAgICAgaWR4ID0gMDtcbiAgICAgICAgd2hpbGUgKGlkeCA8IGxlbjEpIHtcbiAgICAgICAgICAgIHJlc3VsdFtyZXN1bHQubGVuZ3RoXSA9IHNldDFbaWR4XTtcbiAgICAgICAgICAgIGlkeCArPSAxO1xuICAgICAgICB9XG4gICAgICAgIGlkeCA9IDA7XG4gICAgICAgIHdoaWxlIChpZHggPCBsZW4yKSB7XG4gICAgICAgICAgICByZXN1bHRbcmVzdWx0Lmxlbmd0aF0gPSBzZXQyW2lkeF07XG4gICAgICAgICAgICBpZHggKz0gMTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG5cbiAgICB2YXIgX2NvbnRhaW5zV2l0aCA9IGZ1bmN0aW9uIF9jb250YWluc1dpdGgocHJlZCwgeCwgbGlzdCkge1xuICAgICAgICB2YXIgaWR4ID0gMCwgbGVuID0gbGlzdC5sZW5ndGg7XG4gICAgICAgIHdoaWxlIChpZHggPCBsZW4pIHtcbiAgICAgICAgICAgIGlmIChwcmVkKHgsIGxpc3RbaWR4XSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlkeCArPSAxO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9O1xuXG4gICAgdmFyIF9jcmVhdGVNYXBFbnRyeSA9IGZ1bmN0aW9uIF9jcmVhdGVNYXBFbnRyeShrZXksIHZhbCkge1xuICAgICAgICB2YXIgb2JqID0ge307XG4gICAgICAgIG9ialtrZXldID0gdmFsO1xuICAgICAgICByZXR1cm4gb2JqO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGUgYSBmdW5jdGlvbiB3aGljaCB0YWtlcyBhIGNvbXBhcmF0b3IgZnVuY3Rpb24gYW5kIGEgbGlzdFxuICAgICAqIGFuZCBkZXRlcm1pbmVzIHRoZSB3aW5uaW5nIHZhbHVlIGJ5IGEgY29tcGF0YXRvci4gVXNlZCBpbnRlcm5hbGx5XG4gICAgICogYnkgYFIubWF4QnlgIGFuZCBgUi5taW5CeWBcbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gY29tcGF0YXRvciBhIGZ1bmN0aW9uIHRvIGNvbXBhcmUgdHdvIGl0ZW1zXG4gICAgICogQGNhdGVnb3J5IE1hdGhcbiAgICAgKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAgICAgKi9cbiAgICB2YXIgX2NyZWF0ZU1heE1pbkJ5ID0gZnVuY3Rpb24gX2NyZWF0ZU1heE1pbkJ5KGNvbXBhcmF0b3IpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICh2YWx1ZUNvbXB1dGVyLCBsaXN0KSB7XG4gICAgICAgICAgICBpZiAoIShsaXN0ICYmIGxpc3QubGVuZ3RoID4gMCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgaWR4ID0gMTtcbiAgICAgICAgICAgIHZhciB3aW5uZXIgPSBsaXN0W2lkeF07XG4gICAgICAgICAgICB2YXIgY29tcHV0ZWRXaW5uZXIgPSB2YWx1ZUNvbXB1dGVyKHdpbm5lcik7XG4gICAgICAgICAgICB2YXIgY29tcHV0ZWRDdXJyZW50O1xuICAgICAgICAgICAgd2hpbGUgKGlkeCA8IGxpc3QubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgY29tcHV0ZWRDdXJyZW50ID0gdmFsdWVDb21wdXRlcihsaXN0W2lkeF0pO1xuICAgICAgICAgICAgICAgIGlmIChjb21wYXJhdG9yKGNvbXB1dGVkQ3VycmVudCwgY29tcHV0ZWRXaW5uZXIpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbXB1dGVkV2lubmVyID0gY29tcHV0ZWRDdXJyZW50O1xuICAgICAgICAgICAgICAgICAgICB3aW5uZXIgPSBsaXN0W2lkeF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlkeCArPSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHdpbm5lcjtcbiAgICAgICAgfTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogT3B0aW1pemVkIGludGVybmFsIHR3by1hcml0eSBjdXJyeSBmdW5jdGlvbi5cbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQGNhdGVnb3J5IEZ1bmN0aW9uXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGZ1bmN0aW9uIHRvIGN1cnJ5LlxuICAgICAqIEByZXR1cm4ge0Z1bmN0aW9ufSBUaGUgY3VycmllZCBmdW5jdGlvbi5cbiAgICAgKi9cbiAgICB2YXIgX2N1cnJ5MSA9IGZ1bmN0aW9uIF9jdXJyeTEoZm4pIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIGYxKGEpIHtcbiAgICAgICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGYxO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChhICE9IG51bGwgJiYgYVsnQEBmdW5jdGlvbmFsL3BsYWNlaG9sZGVyJ10gPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZjE7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBmbihhKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogT3B0aW1pemVkIGludGVybmFsIHR3by1hcml0eSBjdXJyeSBmdW5jdGlvbi5cbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQGNhdGVnb3J5IEZ1bmN0aW9uXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGZ1bmN0aW9uIHRvIGN1cnJ5LlxuICAgICAqIEByZXR1cm4ge0Z1bmN0aW9ufSBUaGUgY3VycmllZCBmdW5jdGlvbi5cbiAgICAgKi9cbiAgICB2YXIgX2N1cnJ5MiA9IGZ1bmN0aW9uIF9jdXJyeTIoZm4pIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIGYyKGEsIGIpIHtcbiAgICAgICAgICAgIHZhciBuID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICAgICAgICAgIGlmIChuID09PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGYyO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChuID09PSAxICYmIGEgIT0gbnVsbCAmJiBhWydAQGZ1bmN0aW9uYWwvcGxhY2Vob2xkZXInXSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmMjtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobiA9PT0gMSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBfY3VycnkxKGZ1bmN0aW9uIChiKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmbihhLCBiKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobiA9PT0gMiAmJiBhICE9IG51bGwgJiYgYVsnQEBmdW5jdGlvbmFsL3BsYWNlaG9sZGVyJ10gPT09IHRydWUgJiYgYiAhPSBudWxsICYmIGJbJ0BAZnVuY3Rpb25hbC9wbGFjZWhvbGRlciddID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGYyO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChuID09PSAyICYmIGEgIT0gbnVsbCAmJiBhWydAQGZ1bmN0aW9uYWwvcGxhY2Vob2xkZXInXSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBfY3VycnkxKGZ1bmN0aW9uIChhKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmbihhLCBiKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobiA9PT0gMiAmJiBiICE9IG51bGwgJiYgYlsnQEBmdW5jdGlvbmFsL3BsYWNlaG9sZGVyJ10gPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gX2N1cnJ5MShmdW5jdGlvbiAoYikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZm4oYSwgYik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBmbihhLCBiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogT3B0aW1pemVkIGludGVybmFsIHRocmVlLWFyaXR5IGN1cnJ5IGZ1bmN0aW9uLlxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAY2F0ZWdvcnkgRnVuY3Rpb25cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgZnVuY3Rpb24gdG8gY3VycnkuXG4gICAgICogQHJldHVybiB7RnVuY3Rpb259IFRoZSBjdXJyaWVkIGZ1bmN0aW9uLlxuICAgICAqL1xuICAgIHZhciBfY3VycnkzID0gZnVuY3Rpb24gX2N1cnJ5Myhmbikge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gZjMoYSwgYiwgYykge1xuICAgICAgICAgICAgdmFyIG4gPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgICAgICAgICAgaWYgKG4gPT09IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZjM7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG4gPT09IDEgJiYgYSAhPSBudWxsICYmIGFbJ0BAZnVuY3Rpb25hbC9wbGFjZWhvbGRlciddID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGYzO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChuID09PSAxKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIF9jdXJyeTIoZnVuY3Rpb24gKGIsIGMpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZuKGEsIGIsIGMpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChuID09PSAyICYmIGEgIT0gbnVsbCAmJiBhWydAQGZ1bmN0aW9uYWwvcGxhY2Vob2xkZXInXSA9PT0gdHJ1ZSAmJiBiICE9IG51bGwgJiYgYlsnQEBmdW5jdGlvbmFsL3BsYWNlaG9sZGVyJ10gPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZjM7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG4gPT09IDIgJiYgYSAhPSBudWxsICYmIGFbJ0BAZnVuY3Rpb25hbC9wbGFjZWhvbGRlciddID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIF9jdXJyeTIoZnVuY3Rpb24gKGEsIGMpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZuKGEsIGIsIGMpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChuID09PSAyICYmIGIgIT0gbnVsbCAmJiBiWydAQGZ1bmN0aW9uYWwvcGxhY2Vob2xkZXInXSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBfY3VycnkyKGZ1bmN0aW9uIChiLCBjKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmbihhLCBiLCBjKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobiA9PT0gMikge1xuICAgICAgICAgICAgICAgIHJldHVybiBfY3VycnkxKGZ1bmN0aW9uIChjKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmbihhLCBiLCBjKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobiA9PT0gMyAmJiBhICE9IG51bGwgJiYgYVsnQEBmdW5jdGlvbmFsL3BsYWNlaG9sZGVyJ10gPT09IHRydWUgJiYgYiAhPSBudWxsICYmIGJbJ0BAZnVuY3Rpb25hbC9wbGFjZWhvbGRlciddID09PSB0cnVlICYmIGMgIT0gbnVsbCAmJiBjWydAQGZ1bmN0aW9uYWwvcGxhY2Vob2xkZXInXSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmMztcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobiA9PT0gMyAmJiBhICE9IG51bGwgJiYgYVsnQEBmdW5jdGlvbmFsL3BsYWNlaG9sZGVyJ10gPT09IHRydWUgJiYgYiAhPSBudWxsICYmIGJbJ0BAZnVuY3Rpb25hbC9wbGFjZWhvbGRlciddID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIF9jdXJyeTIoZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZuKGEsIGIsIGMpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChuID09PSAzICYmIGEgIT0gbnVsbCAmJiBhWydAQGZ1bmN0aW9uYWwvcGxhY2Vob2xkZXInXSA9PT0gdHJ1ZSAmJiBjICE9IG51bGwgJiYgY1snQEBmdW5jdGlvbmFsL3BsYWNlaG9sZGVyJ10gPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gX2N1cnJ5MihmdW5jdGlvbiAoYSwgYykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZm4oYSwgYiwgYyk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG4gPT09IDMgJiYgYiAhPSBudWxsICYmIGJbJ0BAZnVuY3Rpb25hbC9wbGFjZWhvbGRlciddID09PSB0cnVlICYmIGMgIT0gbnVsbCAmJiBjWydAQGZ1bmN0aW9uYWwvcGxhY2Vob2xkZXInXSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBfY3VycnkyKGZ1bmN0aW9uIChiLCBjKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmbihhLCBiLCBjKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobiA9PT0gMyAmJiBhICE9IG51bGwgJiYgYVsnQEBmdW5jdGlvbmFsL3BsYWNlaG9sZGVyJ10gPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gX2N1cnJ5MShmdW5jdGlvbiAoYSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZm4oYSwgYiwgYyk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG4gPT09IDMgJiYgYiAhPSBudWxsICYmIGJbJ0BAZnVuY3Rpb25hbC9wbGFjZWhvbGRlciddID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIF9jdXJyeTEoZnVuY3Rpb24gKGIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZuKGEsIGIsIGMpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChuID09PSAzICYmIGMgIT0gbnVsbCAmJiBjWydAQGZ1bmN0aW9uYWwvcGxhY2Vob2xkZXInXSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBfY3VycnkxKGZ1bmN0aW9uIChjKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmbihhLCBiLCBjKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZuKGEsIGIsIGMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH07XG5cbiAgICB2YXIgX2Rpc3NvYyA9IGZ1bmN0aW9uIF9kaXNzb2MocHJvcCwgb2JqKSB7XG4gICAgICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICAgICAgZm9yICh2YXIgcCBpbiBvYmopIHtcbiAgICAgICAgICAgIGlmIChwICE9PSBwcm9wKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0W3BdID0gb2JqW3BdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcblxuICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL09iamVjdC9pcyNQb2x5ZmlsbFxuICAgIC8vIFNhbWVWYWx1ZSBhbGdvcml0aG1cbiAgICAvLyBTdGVwcyAxLTUsIDctMTBcbiAgICAvLyBTdGVwcyA2LmItNi5lOiArMCAhPSAtMFxuICAgIC8vIFN0ZXAgNi5hOiBOYU4gPT0gTmFOXG4gICAgdmFyIF9lcSA9IGZ1bmN0aW9uIF9lcSh4LCB5KSB7XG4gICAgICAgIC8vIFNhbWVWYWx1ZSBhbGdvcml0aG1cbiAgICAgICAgaWYgKHggPT09IHkpIHtcbiAgICAgICAgICAgIC8vIFN0ZXBzIDEtNSwgNy0xMFxuICAgICAgICAgICAgLy8gU3RlcHMgNi5iLTYuZTogKzAgIT0gLTBcbiAgICAgICAgICAgIHJldHVybiB4ICE9PSAwIHx8IDEgLyB4ID09PSAxIC8geTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIFN0ZXAgNi5hOiBOYU4gPT0gTmFOXG4gICAgICAgICAgICByZXR1cm4geCAhPT0geCAmJiB5ICE9PSB5O1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIHZhciBfZmlsdGVyID0gZnVuY3Rpb24gX2ZpbHRlcihmbiwgbGlzdCkge1xuICAgICAgICB2YXIgaWR4ID0gMCwgbGVuID0gbGlzdC5sZW5ndGgsIHJlc3VsdCA9IFtdO1xuICAgICAgICB3aGlsZSAoaWR4IDwgbGVuKSB7XG4gICAgICAgICAgICBpZiAoZm4obGlzdFtpZHhdKSkge1xuICAgICAgICAgICAgICAgIHJlc3VsdFtyZXN1bHQubGVuZ3RoXSA9IGxpc3RbaWR4XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlkeCArPSAxO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcblxuICAgIHZhciBfZmlsdGVySW5kZXhlZCA9IGZ1bmN0aW9uIF9maWx0ZXJJbmRleGVkKGZuLCBsaXN0KSB7XG4gICAgICAgIHZhciBpZHggPSAwLCBsZW4gPSBsaXN0Lmxlbmd0aCwgcmVzdWx0ID0gW107XG4gICAgICAgIHdoaWxlIChpZHggPCBsZW4pIHtcbiAgICAgICAgICAgIGlmIChmbihsaXN0W2lkeF0sIGlkeCwgbGlzdCkpIHtcbiAgICAgICAgICAgICAgICByZXN1bHRbcmVzdWx0Lmxlbmd0aF0gPSBsaXN0W2lkeF07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZHggKz0gMTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG5cbiAgICAvLyBpIGNhbid0IGJlYXIgbm90IHRvIHJldHVybiAqc29tZXRoaW5nKlxuICAgIHZhciBfZm9yRWFjaCA9IGZ1bmN0aW9uIF9mb3JFYWNoKGZuLCBsaXN0KSB7XG4gICAgICAgIHZhciBpZHggPSAwLCBsZW4gPSBsaXN0Lmxlbmd0aDtcbiAgICAgICAgd2hpbGUgKGlkeCA8IGxlbikge1xuICAgICAgICAgICAgZm4obGlzdFtpZHhdKTtcbiAgICAgICAgICAgIGlkeCArPSAxO1xuICAgICAgICB9XG4gICAgICAgIC8vIGkgY2FuJ3QgYmVhciBub3QgdG8gcmV0dXJuICpzb21ldGhpbmcqXG4gICAgICAgIHJldHVybiBsaXN0O1xuICAgIH07XG5cbiAgICB2YXIgX2ZvcmNlUmVkdWNlZCA9IGZ1bmN0aW9uIF9mb3JjZVJlZHVjZWQoeCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgJ0BAdHJhbnNkdWNlci92YWx1ZSc6IHgsXG4gICAgICAgICAgICAnQEB0cmFuc2R1Y2VyL3JlZHVjZWQnOiB0cnVlXG4gICAgICAgIH07XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIHN0cmF0ZWd5IGZvciBleHRyYWN0aW5nIGZ1bmN0aW9uIG5hbWVzIGZyb20gYW4gb2JqZWN0XG4gICAgICogQHJldHVybiB7RnVuY3Rpb259IEEgZnVuY3Rpb24gdGhhdCB0YWtlcyBhbiBvYmplY3QgYW5kIHJldHVybnMgYW4gYXJyYXkgb2YgZnVuY3Rpb24gbmFtZXMuXG4gICAgICovXG4gICAgdmFyIF9mdW5jdGlvbnNXaXRoID0gZnVuY3Rpb24gX2Z1bmN0aW9uc1dpdGgoZm4pIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgICAgIHJldHVybiBfZmlsdGVyKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHlwZW9mIG9ialtrZXldID09PSAnZnVuY3Rpb24nO1xuICAgICAgICAgICAgfSwgZm4ob2JqKSk7XG4gICAgICAgIH07XG4gICAgfTtcblxuICAgIHZhciBfZ3QgPSBmdW5jdGlvbiBfZ3QoYSwgYikge1xuICAgICAgICByZXR1cm4gYSA+IGI7XG4gICAgfTtcblxuICAgIHZhciBfaGFzID0gZnVuY3Rpb24gX2hhcyhwcm9wLCBvYmopIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApO1xuICAgIH07XG5cbiAgICB2YXIgX2lkZW50aXR5ID0gZnVuY3Rpb24gX2lkZW50aXR5KHgpIHtcbiAgICAgICAgcmV0dXJuIHg7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFRlc3RzIHdoZXRoZXIgb3Igbm90IGFuIG9iamVjdCBpcyBhbiBhcnJheS5cbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHBhcmFtIHsqfSB2YWwgVGhlIG9iamVjdCB0byB0ZXN0LlxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59IGB0cnVlYCBpZiBgdmFsYCBpcyBhbiBhcnJheSwgYGZhbHNlYCBvdGhlcndpc2UuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgX2lzQXJyYXkoW10pOyAvLz0+IHRydWVcbiAgICAgKiAgICAgIF9pc0FycmF5KG51bGwpOyAvLz0+IGZhbHNlXG4gICAgICogICAgICBfaXNBcnJheSh7fSk7IC8vPT4gZmFsc2VcbiAgICAgKi9cbiAgICB2YXIgX2lzQXJyYXkgPSBBcnJheS5pc0FycmF5IHx8IGZ1bmN0aW9uIF9pc0FycmF5KHZhbCkge1xuICAgICAgICByZXR1cm4gdmFsICE9IG51bGwgJiYgdmFsLmxlbmd0aCA+PSAwICYmIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWwpID09PSAnW29iamVjdCBBcnJheV0nO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBEZXRlcm1pbmUgaWYgdGhlIHBhc3NlZCBhcmd1bWVudCBpcyBhbiBpbnRlZ2VyLlxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAcGFyYW0geyp9IG5cbiAgICAgKiBAY2F0ZWdvcnkgVHlwZVxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAgICovXG4gICAgdmFyIF9pc0ludGVnZXIgPSBOdW1iZXIuaXNJbnRlZ2VyIHx8IGZ1bmN0aW9uIF9pc0ludGVnZXIobikge1xuICAgICAgICByZXR1cm4gbiA8PCAwID09PSBuO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBUZXN0cyBpZiBhIHZhbHVlIGlzIGEgdGhlbmFibGUgKHByb21pc2UpLlxuICAgICAqL1xuICAgIHZhciBfaXNUaGVuYWJsZSA9IGZ1bmN0aW9uIF9pc1RoZW5hYmxlKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZSAhPSBudWxsICYmIHZhbHVlID09PSBPYmplY3QodmFsdWUpICYmIHR5cGVvZiB2YWx1ZS50aGVuID09PSAnZnVuY3Rpb24nO1xuICAgIH07XG5cbiAgICB2YXIgX2lzVHJhbnNmb3JtZXIgPSBmdW5jdGlvbiBfaXNUcmFuc2Zvcm1lcihvYmopIHtcbiAgICAgICAgcmV0dXJuIHR5cGVvZiBvYmpbJ0BAdHJhbnNkdWNlci9zdGVwJ10gPT09ICdmdW5jdGlvbic7XG4gICAgfTtcblxuICAgIHZhciBfbHQgPSBmdW5jdGlvbiBfbHQoYSwgYikge1xuICAgICAgICByZXR1cm4gYSA8IGI7XG4gICAgfTtcblxuICAgIHZhciBfbWFwID0gZnVuY3Rpb24gX21hcChmbiwgbGlzdCkge1xuICAgICAgICB2YXIgaWR4ID0gMCwgbGVuID0gbGlzdC5sZW5ndGgsIHJlc3VsdCA9IFtdO1xuICAgICAgICB3aGlsZSAoaWR4IDwgbGVuKSB7XG4gICAgICAgICAgICByZXN1bHRbaWR4XSA9IGZuKGxpc3RbaWR4XSk7XG4gICAgICAgICAgICBpZHggKz0gMTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG5cbiAgICB2YXIgX211bHRpcGx5ID0gZnVuY3Rpb24gX211bHRpcGx5KGEsIGIpIHtcbiAgICAgICAgcmV0dXJuIGEgKiBiO1xuICAgIH07XG5cbiAgICB2YXIgX250aCA9IGZ1bmN0aW9uIF9udGgobiwgbGlzdCkge1xuICAgICAgICByZXR1cm4gbiA8IDAgPyBsaXN0W2xpc3QubGVuZ3RoICsgbl0gOiBsaXN0W25dO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBpbnRlcm5hbCBwYXRoIGZ1bmN0aW9uXG4gICAgICogVGFrZXMgYW4gYXJyYXksIHBhdGhzLCBpbmRpY2F0aW5nIHRoZSBkZWVwIHNldCBvZiBrZXlzXG4gICAgICogdG8gZmluZC5cbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgT2JqZWN0XG4gICAgICogQHBhcmFtIHtBcnJheX0gcGF0aHMgQW4gYXJyYXkgb2Ygc3RyaW5ncyB0byBtYXAgdG8gb2JqZWN0IHByb3BlcnRpZXNcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb2JqIFRoZSBvYmplY3QgdG8gZmluZCB0aGUgcGF0aCBpblxuICAgICAqIEByZXR1cm4ge0FycmF5fSBUaGUgdmFsdWUgYXQgdGhlIGVuZCBvZiB0aGUgcGF0aCBvciBgdW5kZWZpbmVkYC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICBfcGF0aChbJ2EnLCAnYiddLCB7YToge2I6IDJ9fSk7IC8vPT4gMlxuICAgICAqL1xuICAgIHZhciBfcGF0aCA9IGZ1bmN0aW9uIF9wYXRoKHBhdGhzLCBvYmopIHtcbiAgICAgICAgaWYgKG9iaiA9PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgdmFsID0gb2JqO1xuICAgICAgICAgICAgZm9yICh2YXIgaWR4ID0gMCwgbGVuID0gcGF0aHMubGVuZ3RoOyBpZHggPCBsZW4gJiYgdmFsICE9IG51bGw7IGlkeCArPSAxKSB7XG4gICAgICAgICAgICAgICAgdmFsID0gdmFsW3BhdGhzW2lkeF1dO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHZhbDtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICB2YXIgX3ByZXBlbmQgPSBmdW5jdGlvbiBfcHJlcGVuZChlbCwgbGlzdCkge1xuICAgICAgICByZXR1cm4gX2NvbmNhdChbZWxdLCBsaXN0KTtcbiAgICB9O1xuXG4gICAgdmFyIF9xdW90ZSA9IGZ1bmN0aW9uIF9xdW90ZShzKSB7XG4gICAgICAgIHJldHVybiAnXCInICsgcy5yZXBsYWNlKC9cIi9nLCAnXFxcXFwiJykgKyAnXCInO1xuICAgIH07XG5cbiAgICB2YXIgX3JlZHVjZWQgPSBmdW5jdGlvbiBfcmVkdWNlZCh4KSB7XG4gICAgICAgIHJldHVybiB4ICYmIHhbJ0BAdHJhbnNkdWNlci9yZWR1Y2VkJ10gPyB4IDoge1xuICAgICAgICAgICAgJ0BAdHJhbnNkdWNlci92YWx1ZSc6IHgsXG4gICAgICAgICAgICAnQEB0cmFuc2R1Y2VyL3JlZHVjZWQnOiB0cnVlXG4gICAgICAgIH07XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEFuIG9wdGltaXplZCwgcHJpdmF0ZSBhcnJheSBgc2xpY2VgIGltcGxlbWVudGF0aW9uLlxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAcGFyYW0ge0FyZ3VtZW50c3xBcnJheX0gYXJncyBUaGUgYXJyYXkgb3IgYXJndW1lbnRzIG9iamVjdCB0byBjb25zaWRlci5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gW2Zyb209MF0gVGhlIGFycmF5IGluZGV4IHRvIHNsaWNlIGZyb20sIGluY2x1c2l2ZS5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gW3RvPWFyZ3MubGVuZ3RoXSBUaGUgYXJyYXkgaW5kZXggdG8gc2xpY2UgdG8sIGV4Y2x1c2l2ZS5cbiAgICAgKiBAcmV0dXJuIHtBcnJheX0gQSBuZXcsIHNsaWNlZCBhcnJheS5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICBfc2xpY2UoWzEsIDIsIDMsIDQsIDVdLCAxLCAzKTsgLy89PiBbMiwgM11cbiAgICAgKlxuICAgICAqICAgICAgdmFyIGZpcnN0VGhyZWVBcmdzID0gZnVuY3Rpb24oYSwgYiwgYywgZCkge1xuICAgICAqICAgICAgICByZXR1cm4gX3NsaWNlKGFyZ3VtZW50cywgMCwgMyk7XG4gICAgICogICAgICB9O1xuICAgICAqICAgICAgZmlyc3RUaHJlZUFyZ3MoMSwgMiwgMywgNCk7IC8vPT4gWzEsIDIsIDNdXG4gICAgICovXG4gICAgdmFyIF9zbGljZSA9IGZ1bmN0aW9uIF9zbGljZShhcmdzLCBmcm9tLCB0bykge1xuICAgICAgICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgcmV0dXJuIF9zbGljZShhcmdzLCAwLCBhcmdzLmxlbmd0aCk7XG4gICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgIHJldHVybiBfc2xpY2UoYXJncywgZnJvbSwgYXJncy5sZW5ndGgpO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgdmFyIGxpc3QgPSBbXTtcbiAgICAgICAgICAgIHZhciBpZHggPSAwO1xuICAgICAgICAgICAgdmFyIGxlbiA9IE1hdGgubWF4KDAsIE1hdGgubWluKGFyZ3MubGVuZ3RoLCB0bykgLSBmcm9tKTtcbiAgICAgICAgICAgIHdoaWxlIChpZHggPCBsZW4pIHtcbiAgICAgICAgICAgICAgICBsaXN0W2lkeF0gPSBhcmdzW2Zyb20gKyBpZHhdO1xuICAgICAgICAgICAgICAgIGlkeCArPSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGxpc3Q7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogUG9seWZpbGwgZnJvbSA8aHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvRGF0ZS90b0lTT1N0cmluZz4uXG4gICAgICovXG4gICAgdmFyIF90b0lTT1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHBhZCA9IGZ1bmN0aW9uIHBhZChuKSB7XG4gICAgICAgICAgICByZXR1cm4gKG4gPCAxMCA/ICcwJyA6ICcnKSArIG47XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiB0eXBlb2YgRGF0ZS5wcm90b3R5cGUudG9JU09TdHJpbmcgPT09ICdmdW5jdGlvbicgPyBmdW5jdGlvbiBfdG9JU09TdHJpbmcoZCkge1xuICAgICAgICAgICAgcmV0dXJuIGQudG9JU09TdHJpbmcoKTtcbiAgICAgICAgfSA6IGZ1bmN0aW9uIF90b0lTT1N0cmluZyhkKSB7XG4gICAgICAgICAgICByZXR1cm4gZC5nZXRVVENGdWxsWWVhcigpICsgJy0nICsgcGFkKGQuZ2V0VVRDTW9udGgoKSArIDEpICsgJy0nICsgcGFkKGQuZ2V0VVRDRGF0ZSgpKSArICdUJyArIHBhZChkLmdldFVUQ0hvdXJzKCkpICsgJzonICsgcGFkKGQuZ2V0VVRDTWludXRlcygpKSArICc6JyArIHBhZChkLmdldFVUQ1NlY29uZHMoKSkgKyAnLicgKyAoZC5nZXRVVENNaWxsaXNlY29uZHMoKSAvIDEwMDApLnRvRml4ZWQoMykuc2xpY2UoMiwgNSkgKyAnWic7XG4gICAgICAgIH07XG4gICAgfSgpO1xuXG4gICAgdmFyIF94ZHJvcFJlcGVhdHNXaXRoID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBmdW5jdGlvbiBYRHJvcFJlcGVhdHNXaXRoKHByZWQsIHhmKSB7XG4gICAgICAgICAgICB0aGlzLnhmID0geGY7XG4gICAgICAgICAgICB0aGlzLnByZWQgPSBwcmVkO1xuICAgICAgICAgICAgdGhpcy5sYXN0VmFsdWUgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICB0aGlzLnNlZW5GaXJzdFZhbHVlID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgWERyb3BSZXBlYXRzV2l0aC5wcm90b3R5cGVbJ0BAdHJhbnNkdWNlci9pbml0J10gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy54ZlsnQEB0cmFuc2R1Y2VyL2luaXQnXSgpO1xuICAgICAgICB9O1xuICAgICAgICBYRHJvcFJlcGVhdHNXaXRoLnByb3RvdHlwZVsnQEB0cmFuc2R1Y2VyL3Jlc3VsdCddID0gZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMueGZbJ0BAdHJhbnNkdWNlci9yZXN1bHQnXShyZXN1bHQpO1xuICAgICAgICB9O1xuICAgICAgICBYRHJvcFJlcGVhdHNXaXRoLnByb3RvdHlwZVsnQEB0cmFuc2R1Y2VyL3N0ZXAnXSA9IGZ1bmN0aW9uIChyZXN1bHQsIGlucHV0KSB7XG4gICAgICAgICAgICB2YXIgc2FtZUFzTGFzdCA9IGZhbHNlO1xuICAgICAgICAgICAgaWYgKCF0aGlzLnNlZW5GaXJzdFZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZWVuRmlyc3RWYWx1ZSA9IHRydWU7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMucHJlZCh0aGlzLmxhc3RWYWx1ZSwgaW5wdXQpKSB7XG4gICAgICAgICAgICAgICAgc2FtZUFzTGFzdCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmxhc3RWYWx1ZSA9IGlucHV0O1xuICAgICAgICAgICAgcmV0dXJuIHNhbWVBc0xhc3QgPyByZXN1bHQgOiB0aGlzLnhmWydAQHRyYW5zZHVjZXIvc3RlcCddKHJlc3VsdCwgaW5wdXQpO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gX2N1cnJ5MihmdW5jdGlvbiBfeGRyb3BSZXBlYXRzV2l0aChwcmVkLCB4Zikge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBYRHJvcFJlcGVhdHNXaXRoKHByZWQsIHhmKTtcbiAgICAgICAgfSk7XG4gICAgfSgpO1xuXG4gICAgdmFyIF94ZkJhc2UgPSB7XG4gICAgICAgIGluaXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnhmWydAQHRyYW5zZHVjZXIvaW5pdCddKCk7XG4gICAgICAgIH0sXG4gICAgICAgIHJlc3VsdDogZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMueGZbJ0BAdHJhbnNkdWNlci9yZXN1bHQnXShyZXN1bHQpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIHZhciBfeGZpbHRlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZnVuY3Rpb24gWEZpbHRlcihmLCB4Zikge1xuICAgICAgICAgICAgdGhpcy54ZiA9IHhmO1xuICAgICAgICAgICAgdGhpcy5mID0gZjtcbiAgICAgICAgfVxuICAgICAgICBYRmlsdGVyLnByb3RvdHlwZVsnQEB0cmFuc2R1Y2VyL2luaXQnXSA9IF94ZkJhc2UuaW5pdDtcbiAgICAgICAgWEZpbHRlci5wcm90b3R5cGVbJ0BAdHJhbnNkdWNlci9yZXN1bHQnXSA9IF94ZkJhc2UucmVzdWx0O1xuICAgICAgICBYRmlsdGVyLnByb3RvdHlwZVsnQEB0cmFuc2R1Y2VyL3N0ZXAnXSA9IGZ1bmN0aW9uIChyZXN1bHQsIGlucHV0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5mKGlucHV0KSA/IHRoaXMueGZbJ0BAdHJhbnNkdWNlci9zdGVwJ10ocmVzdWx0LCBpbnB1dCkgOiByZXN1bHQ7XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBfY3VycnkyKGZ1bmN0aW9uIF94ZmlsdGVyKGYsIHhmKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFhGaWx0ZXIoZiwgeGYpO1xuICAgICAgICB9KTtcbiAgICB9KCk7XG5cbiAgICB2YXIgX3hmaW5kID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBmdW5jdGlvbiBYRmluZChmLCB4Zikge1xuICAgICAgICAgICAgdGhpcy54ZiA9IHhmO1xuICAgICAgICAgICAgdGhpcy5mID0gZjtcbiAgICAgICAgICAgIHRoaXMuZm91bmQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBYRmluZC5wcm90b3R5cGVbJ0BAdHJhbnNkdWNlci9pbml0J10gPSBfeGZCYXNlLmluaXQ7XG4gICAgICAgIFhGaW5kLnByb3RvdHlwZVsnQEB0cmFuc2R1Y2VyL3Jlc3VsdCddID0gZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgICAgaWYgKCF0aGlzLmZvdW5kKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gdGhpcy54ZlsnQEB0cmFuc2R1Y2VyL3N0ZXAnXShyZXN1bHQsIHZvaWQgMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcy54ZlsnQEB0cmFuc2R1Y2VyL3Jlc3VsdCddKHJlc3VsdCk7XG4gICAgICAgIH07XG4gICAgICAgIFhGaW5kLnByb3RvdHlwZVsnQEB0cmFuc2R1Y2VyL3N0ZXAnXSA9IGZ1bmN0aW9uIChyZXN1bHQsIGlucHV0KSB7XG4gICAgICAgICAgICBpZiAodGhpcy5mKGlucHV0KSkge1xuICAgICAgICAgICAgICAgIHRoaXMuZm91bmQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9IF9yZWR1Y2VkKHRoaXMueGZbJ0BAdHJhbnNkdWNlci9zdGVwJ10ocmVzdWx0LCBpbnB1dCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIF9jdXJyeTIoZnVuY3Rpb24gX3hmaW5kKGYsIHhmKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFhGaW5kKGYsIHhmKTtcbiAgICAgICAgfSk7XG4gICAgfSgpO1xuXG4gICAgdmFyIF94ZmluZEluZGV4ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBmdW5jdGlvbiBYRmluZEluZGV4KGYsIHhmKSB7XG4gICAgICAgICAgICB0aGlzLnhmID0geGY7XG4gICAgICAgICAgICB0aGlzLmYgPSBmO1xuICAgICAgICAgICAgdGhpcy5pZHggPSAtMTtcbiAgICAgICAgICAgIHRoaXMuZm91bmQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBYRmluZEluZGV4LnByb3RvdHlwZVsnQEB0cmFuc2R1Y2VyL2luaXQnXSA9IF94ZkJhc2UuaW5pdDtcbiAgICAgICAgWEZpbmRJbmRleC5wcm90b3R5cGVbJ0BAdHJhbnNkdWNlci9yZXN1bHQnXSA9IGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5mb3VuZCkge1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9IHRoaXMueGZbJ0BAdHJhbnNkdWNlci9zdGVwJ10ocmVzdWx0LCAtMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcy54ZlsnQEB0cmFuc2R1Y2VyL3Jlc3VsdCddKHJlc3VsdCk7XG4gICAgICAgIH07XG4gICAgICAgIFhGaW5kSW5kZXgucHJvdG90eXBlWydAQHRyYW5zZHVjZXIvc3RlcCddID0gZnVuY3Rpb24gKHJlc3VsdCwgaW5wdXQpIHtcbiAgICAgICAgICAgIHRoaXMuaWR4ICs9IDE7XG4gICAgICAgICAgICBpZiAodGhpcy5mKGlucHV0KSkge1xuICAgICAgICAgICAgICAgIHRoaXMuZm91bmQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9IF9yZWR1Y2VkKHRoaXMueGZbJ0BAdHJhbnNkdWNlci9zdGVwJ10ocmVzdWx0LCB0aGlzLmlkeCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIF9jdXJyeTIoZnVuY3Rpb24gX3hmaW5kSW5kZXgoZiwgeGYpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgWEZpbmRJbmRleChmLCB4Zik7XG4gICAgICAgIH0pO1xuICAgIH0oKTtcblxuICAgIHZhciBfeGZpbmRMYXN0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBmdW5jdGlvbiBYRmluZExhc3QoZiwgeGYpIHtcbiAgICAgICAgICAgIHRoaXMueGYgPSB4ZjtcbiAgICAgICAgICAgIHRoaXMuZiA9IGY7XG4gICAgICAgIH1cbiAgICAgICAgWEZpbmRMYXN0LnByb3RvdHlwZVsnQEB0cmFuc2R1Y2VyL2luaXQnXSA9IF94ZkJhc2UuaW5pdDtcbiAgICAgICAgWEZpbmRMYXN0LnByb3RvdHlwZVsnQEB0cmFuc2R1Y2VyL3Jlc3VsdCddID0gZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMueGZbJ0BAdHJhbnNkdWNlci9yZXN1bHQnXSh0aGlzLnhmWydAQHRyYW5zZHVjZXIvc3RlcCddKHJlc3VsdCwgdGhpcy5sYXN0KSk7XG4gICAgICAgIH07XG4gICAgICAgIFhGaW5kTGFzdC5wcm90b3R5cGVbJ0BAdHJhbnNkdWNlci9zdGVwJ10gPSBmdW5jdGlvbiAocmVzdWx0LCBpbnB1dCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuZihpbnB1dCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxhc3QgPSBpbnB1dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBfY3VycnkyKGZ1bmN0aW9uIF94ZmluZExhc3QoZiwgeGYpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgWEZpbmRMYXN0KGYsIHhmKTtcbiAgICAgICAgfSk7XG4gICAgfSgpO1xuXG4gICAgdmFyIF94ZmluZExhc3RJbmRleCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZnVuY3Rpb24gWEZpbmRMYXN0SW5kZXgoZiwgeGYpIHtcbiAgICAgICAgICAgIHRoaXMueGYgPSB4ZjtcbiAgICAgICAgICAgIHRoaXMuZiA9IGY7XG4gICAgICAgICAgICB0aGlzLmlkeCA9IC0xO1xuICAgICAgICAgICAgdGhpcy5sYXN0SWR4ID0gLTE7XG4gICAgICAgIH1cbiAgICAgICAgWEZpbmRMYXN0SW5kZXgucHJvdG90eXBlWydAQHRyYW5zZHVjZXIvaW5pdCddID0gX3hmQmFzZS5pbml0O1xuICAgICAgICBYRmluZExhc3RJbmRleC5wcm90b3R5cGVbJ0BAdHJhbnNkdWNlci9yZXN1bHQnXSA9IGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnhmWydAQHRyYW5zZHVjZXIvcmVzdWx0J10odGhpcy54ZlsnQEB0cmFuc2R1Y2VyL3N0ZXAnXShyZXN1bHQsIHRoaXMubGFzdElkeCkpO1xuICAgICAgICB9O1xuICAgICAgICBYRmluZExhc3RJbmRleC5wcm90b3R5cGVbJ0BAdHJhbnNkdWNlci9zdGVwJ10gPSBmdW5jdGlvbiAocmVzdWx0LCBpbnB1dCkge1xuICAgICAgICAgICAgdGhpcy5pZHggKz0gMTtcbiAgICAgICAgICAgIGlmICh0aGlzLmYoaW5wdXQpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5sYXN0SWR4ID0gdGhpcy5pZHg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gX2N1cnJ5MihmdW5jdGlvbiBfeGZpbmRMYXN0SW5kZXgoZiwgeGYpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgWEZpbmRMYXN0SW5kZXgoZiwgeGYpO1xuICAgICAgICB9KTtcbiAgICB9KCk7XG5cbiAgICB2YXIgX3htYXAgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGZ1bmN0aW9uIFhNYXAoZiwgeGYpIHtcbiAgICAgICAgICAgIHRoaXMueGYgPSB4ZjtcbiAgICAgICAgICAgIHRoaXMuZiA9IGY7XG4gICAgICAgIH1cbiAgICAgICAgWE1hcC5wcm90b3R5cGVbJ0BAdHJhbnNkdWNlci9pbml0J10gPSBfeGZCYXNlLmluaXQ7XG4gICAgICAgIFhNYXAucHJvdG90eXBlWydAQHRyYW5zZHVjZXIvcmVzdWx0J10gPSBfeGZCYXNlLnJlc3VsdDtcbiAgICAgICAgWE1hcC5wcm90b3R5cGVbJ0BAdHJhbnNkdWNlci9zdGVwJ10gPSBmdW5jdGlvbiAocmVzdWx0LCBpbnB1dCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMueGZbJ0BAdHJhbnNkdWNlci9zdGVwJ10ocmVzdWx0LCB0aGlzLmYoaW5wdXQpKTtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIF9jdXJyeTIoZnVuY3Rpb24gX3htYXAoZiwgeGYpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgWE1hcChmLCB4Zik7XG4gICAgICAgIH0pO1xuICAgIH0oKTtcblxuICAgIHZhciBfeHRha2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGZ1bmN0aW9uIFhUYWtlKG4sIHhmKSB7XG4gICAgICAgICAgICB0aGlzLnhmID0geGY7XG4gICAgICAgICAgICB0aGlzLm4gPSBuO1xuICAgICAgICB9XG4gICAgICAgIFhUYWtlLnByb3RvdHlwZVsnQEB0cmFuc2R1Y2VyL2luaXQnXSA9IF94ZkJhc2UuaW5pdDtcbiAgICAgICAgWFRha2UucHJvdG90eXBlWydAQHRyYW5zZHVjZXIvcmVzdWx0J10gPSBfeGZCYXNlLnJlc3VsdDtcbiAgICAgICAgWFRha2UucHJvdG90eXBlWydAQHRyYW5zZHVjZXIvc3RlcCddID0gZnVuY3Rpb24gKHJlc3VsdCwgaW5wdXQpIHtcbiAgICAgICAgICAgIHRoaXMubiAtPSAxO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubiA9PT0gMCA/IF9yZWR1Y2VkKHRoaXMueGZbJ0BAdHJhbnNkdWNlci9zdGVwJ10ocmVzdWx0LCBpbnB1dCkpIDogdGhpcy54ZlsnQEB0cmFuc2R1Y2VyL3N0ZXAnXShyZXN1bHQsIGlucHV0KTtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIF9jdXJyeTIoZnVuY3Rpb24gX3h0YWtlKG4sIHhmKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFhUYWtlKG4sIHhmKTtcbiAgICAgICAgfSk7XG4gICAgfSgpO1xuXG4gICAgdmFyIF94dGFrZVdoaWxlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBmdW5jdGlvbiBYVGFrZVdoaWxlKGYsIHhmKSB7XG4gICAgICAgICAgICB0aGlzLnhmID0geGY7XG4gICAgICAgICAgICB0aGlzLmYgPSBmO1xuICAgICAgICB9XG4gICAgICAgIFhUYWtlV2hpbGUucHJvdG90eXBlWydAQHRyYW5zZHVjZXIvaW5pdCddID0gX3hmQmFzZS5pbml0O1xuICAgICAgICBYVGFrZVdoaWxlLnByb3RvdHlwZVsnQEB0cmFuc2R1Y2VyL3Jlc3VsdCddID0gX3hmQmFzZS5yZXN1bHQ7XG4gICAgICAgIFhUYWtlV2hpbGUucHJvdG90eXBlWydAQHRyYW5zZHVjZXIvc3RlcCddID0gZnVuY3Rpb24gKHJlc3VsdCwgaW5wdXQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmYoaW5wdXQpID8gdGhpcy54ZlsnQEB0cmFuc2R1Y2VyL3N0ZXAnXShyZXN1bHQsIGlucHV0KSA6IF9yZWR1Y2VkKHJlc3VsdCk7XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBfY3VycnkyKGZ1bmN0aW9uIF94dGFrZVdoaWxlKGYsIHhmKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFhUYWtlV2hpbGUoZiwgeGYpO1xuICAgICAgICB9KTtcbiAgICB9KCk7XG5cbiAgICB2YXIgX3h3cmFwID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBmdW5jdGlvbiBYV3JhcChmbikge1xuICAgICAgICAgICAgdGhpcy5mID0gZm47XG4gICAgICAgIH1cbiAgICAgICAgWFdyYXAucHJvdG90eXBlWydAQHRyYW5zZHVjZXIvaW5pdCddID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdpbml0IG5vdCBpbXBsZW1lbnRlZCBvbiBYV3JhcCcpO1xuICAgICAgICB9O1xuICAgICAgICBYV3JhcC5wcm90b3R5cGVbJ0BAdHJhbnNkdWNlci9yZXN1bHQnXSA9IGZ1bmN0aW9uIChhY2MpIHtcbiAgICAgICAgICAgIHJldHVybiBhY2M7XG4gICAgICAgIH07XG4gICAgICAgIFhXcmFwLnByb3RvdHlwZVsnQEB0cmFuc2R1Y2VyL3N0ZXAnXSA9IGZ1bmN0aW9uIChhY2MsIHgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmYoYWNjLCB4KTtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIF94d3JhcChmbikge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBYV3JhcChmbik7XG4gICAgICAgIH07XG4gICAgfSgpO1xuXG4gICAgLyoqXG4gICAgICogQWRkcyB0d28gbnVtYmVycyAob3Igc3RyaW5ncykuIEVxdWl2YWxlbnQgdG8gYGEgKyBiYCBidXQgY3VycmllZC5cbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgTWF0aFxuICAgICAqIEBzaWcgTnVtYmVyIC0+IE51bWJlciAtPiBOdW1iZXJcbiAgICAgKiBAc2lnIFN0cmluZyAtPiBTdHJpbmcgLT4gU3RyaW5nXG4gICAgICogQHBhcmFtIHtOdW1iZXJ8U3RyaW5nfSBhIFRoZSBmaXJzdCB2YWx1ZS5cbiAgICAgKiBAcGFyYW0ge051bWJlcnxTdHJpbmd9IGIgVGhlIHNlY29uZCB2YWx1ZS5cbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ8U3RyaW5nfSBUaGUgcmVzdWx0IG9mIGBhICsgYmAuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgUi5hZGQoMiwgMyk7ICAgICAgIC8vPT4gIDVcbiAgICAgKiAgICAgIFIuYWRkKDcpKDEwKTsgICAgICAvLz0+IDE3XG4gICAgICovXG4gICAgdmFyIGFkZCA9IF9jdXJyeTIoX2FkZCk7XG5cbiAgICAvKipcbiAgICAgKiBBcHBsaWVzIGEgZnVuY3Rpb24gdG8gdGhlIHZhbHVlIGF0IHRoZSBnaXZlbiBpbmRleCBvZiBhbiBhcnJheSxcbiAgICAgKiByZXR1cm5pbmcgYSBuZXcgY29weSBvZiB0aGUgYXJyYXkgd2l0aCB0aGUgZWxlbWVudCBhdCB0aGUgZ2l2ZW5cbiAgICAgKiBpbmRleCByZXBsYWNlZCB3aXRoIHRoZSByZXN1bHQgb2YgdGhlIGZ1bmN0aW9uIGFwcGxpY2F0aW9uLlxuICAgICAqIEBzZWUgUi51cGRhdGVcbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgTGlzdFxuICAgICAqIEBzaWcgKGEgLT4gYSkgLT4gTnVtYmVyIC0+IFthXSAtPiBbYV1cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgZnVuY3Rpb24gdG8gYXBwbHkuXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGlkeCBUaGUgaW5kZXguXG4gICAgICogQHBhcmFtIHtBcnJheXxBcmd1bWVudHN9IGxpc3QgQW4gYXJyYXktbGlrZSBvYmplY3Qgd2hvc2UgdmFsdWVcbiAgICAgKiAgICAgICAgYXQgdGhlIHN1cHBsaWVkIGluZGV4IHdpbGwgYmUgcmVwbGFjZWQuXG4gICAgICogQHJldHVybiB7QXJyYXl9IEEgY29weSBvZiB0aGUgc3VwcGxpZWQgYXJyYXktbGlrZSBvYmplY3Qgd2l0aFxuICAgICAqICAgICAgICAgdGhlIGVsZW1lbnQgYXQgaW5kZXggYGlkeGAgcmVwbGFjZWQgd2l0aCB0aGUgdmFsdWVcbiAgICAgKiAgICAgICAgIHJldHVybmVkIGJ5IGFwcGx5aW5nIGBmbmAgdG8gdGhlIGV4aXN0aW5nIGVsZW1lbnQuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgUi5hZGp1c3QoUi5hZGQoMTApLCAxLCBbMCwgMSwgMl0pOyAgICAgLy89PiBbMCwgMTEsIDJdXG4gICAgICogICAgICBSLmFkanVzdChSLmFkZCgxMCkpKDEpKFswLCAxLCAyXSk7ICAgICAvLz0+IFswLCAxMSwgMl1cbiAgICAgKi9cbiAgICB2YXIgYWRqdXN0ID0gX2N1cnJ5MyhmdW5jdGlvbiAoZm4sIGlkeCwgbGlzdCkge1xuICAgICAgICBpZiAoaWR4ID49IGxpc3QubGVuZ3RoIHx8IGlkeCA8IC1saXN0Lmxlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuIGxpc3Q7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHN0YXJ0ID0gaWR4IDwgMCA/IGxpc3QubGVuZ3RoIDogMDtcbiAgICAgICAgdmFyIF9pZHggPSBzdGFydCArIGlkeDtcbiAgICAgICAgdmFyIF9saXN0ID0gX2NvbmNhdChsaXN0KTtcbiAgICAgICAgX2xpc3RbX2lkeF0gPSBmbihsaXN0W19pZHhdKTtcbiAgICAgICAgcmV0dXJuIF9saXN0O1xuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgYWx3YXlzIHJldHVybnMgdGhlIGdpdmVuIHZhbHVlLiBOb3RlIHRoYXQgZm9yIG5vbi1wcmltaXRpdmVzIHRoZSB2YWx1ZVxuICAgICAqIHJldHVybmVkIGlzIGEgcmVmZXJlbmNlIHRvIHRoZSBvcmlnaW5hbCB2YWx1ZS5cbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgRnVuY3Rpb25cbiAgICAgKiBAc2lnIGEgLT4gKCogLT4gYSlcbiAgICAgKiBAcGFyYW0geyp9IHZhbCBUaGUgdmFsdWUgdG8gd3JhcCBpbiBhIGZ1bmN0aW9uXG4gICAgICogQHJldHVybiB7RnVuY3Rpb259IEEgRnVuY3Rpb24gOjogKiAtPiB2YWwuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgdmFyIHQgPSBSLmFsd2F5cygnVGVlJyk7XG4gICAgICogICAgICB0KCk7IC8vPT4gJ1RlZSdcbiAgICAgKi9cbiAgICB2YXIgYWx3YXlzID0gX2N1cnJ5MShmdW5jdGlvbiBhbHdheXModmFsKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdmFsO1xuICAgICAgICB9O1xuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhIG5ldyBsaXN0LCBjb21wb3NlZCBvZiBuLXR1cGxlcyBvZiBjb25zZWN1dGl2ZSBlbGVtZW50c1xuICAgICAqIElmIGBuYCBpcyBncmVhdGVyIHRoYW4gdGhlIGxlbmd0aCBvZiB0aGUgbGlzdCwgYW4gZW1wdHkgbGlzdCBpcyByZXR1cm5lZC5cbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgTGlzdFxuICAgICAqIEBzaWcgTnVtYmVyIC0+IFthXSAtPiBbW2FdXVxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBuIFRoZSBzaXplIG9mIHRoZSB0dXBsZXMgdG8gY3JlYXRlXG4gICAgICogQHBhcmFtIHtBcnJheX0gbGlzdCBUaGUgbGlzdCB0byBzcGxpdCBpbnRvIGBuYC10dXBsZXNcbiAgICAgKiBAcmV0dXJuIHtBcnJheX0gVGhlIG5ldyBsaXN0LlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIFIuYXBlcnR1cmUoMiwgWzEsIDIsIDMsIDQsIDVdKTsgLy89PiBbWzEsIDJdLCBbMiwgM10sIFszLCA0XSwgWzQsIDVdXVxuICAgICAqICAgICAgUi5hcGVydHVyZSgzLCBbMSwgMiwgMywgNCwgNV0pOyAvLz0+IFtbMSwgMiwgM10sIFsyLCAzLCA0XSwgWzMsIDQsIDVdXVxuICAgICAqICAgICAgUi5hcGVydHVyZSg3LCBbMSwgMiwgMywgNCwgNV0pOyAvLz0+IFtdXG4gICAgICovXG4gICAgdmFyIGFwZXJ0dXJlID0gX2N1cnJ5MihmdW5jdGlvbiBhcGVydHVyZShuLCBsaXN0KSB7XG4gICAgICAgIHZhciBpZHggPSAwO1xuICAgICAgICB2YXIgbGltaXQgPSBsaXN0Lmxlbmd0aCAtIChuIC0gMSk7XG4gICAgICAgIHZhciBhY2MgPSBuZXcgQXJyYXkobGltaXQgPj0gMCA/IGxpbWl0IDogMCk7XG4gICAgICAgIHdoaWxlIChpZHggPCBsaW1pdCkge1xuICAgICAgICAgICAgYWNjW2lkeF0gPSBfc2xpY2UobGlzdCwgaWR4LCBpZHggKyBuKTtcbiAgICAgICAgICAgIGlkeCArPSAxO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhY2M7XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBBcHBsaWVzIGZ1bmN0aW9uIGBmbmAgdG8gdGhlIGFyZ3VtZW50IGxpc3QgYGFyZ3NgLiBUaGlzIGlzIHVzZWZ1bCBmb3JcbiAgICAgKiBjcmVhdGluZyBhIGZpeGVkLWFyaXR5IGZ1bmN0aW9uIGZyb20gYSB2YXJpYWRpYyBmdW5jdGlvbi4gYGZuYCBzaG91bGRcbiAgICAgKiBiZSBhIGJvdW5kIGZ1bmN0aW9uIGlmIGNvbnRleHQgaXMgc2lnbmlmaWNhbnQuXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IEZ1bmN0aW9uXG4gICAgICogQHNpZyAoKi4uLiAtPiBhKSAtPiBbKl0gLT4gYVxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gICAgICogQHBhcmFtIHtBcnJheX0gYXJnc1xuICAgICAqIEByZXR1cm4geyp9XG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgdmFyIG51bXMgPSBbMSwgMiwgMywgLTk5LCA0MiwgNiwgN107XG4gICAgICogICAgICBSLmFwcGx5KE1hdGgubWF4LCBudW1zKTsgLy89PiA0MlxuICAgICAqL1xuICAgIHZhciBhcHBseSA9IF9jdXJyeTIoZnVuY3Rpb24gYXBwbHkoZm4sIGFyZ3MpIHtcbiAgICAgICAgcmV0dXJuIGZuLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogV3JhcHMgYSBmdW5jdGlvbiBvZiBhbnkgYXJpdHkgKGluY2x1ZGluZyBudWxsYXJ5KSBpbiBhIGZ1bmN0aW9uIHRoYXQgYWNjZXB0cyBleGFjdGx5IGBuYFxuICAgICAqIHBhcmFtZXRlcnMuIFVubGlrZSBgbkFyeWAsIHdoaWNoIHBhc3NlcyBvbmx5IGBuYCBhcmd1bWVudHMgdG8gdGhlIHdyYXBwZWQgZnVuY3Rpb24sXG4gICAgICogZnVuY3Rpb25zIHByb2R1Y2VkIGJ5IGBhcml0eWAgd2lsbCBwYXNzIGFsbCBwcm92aWRlZCBhcmd1bWVudHMgdG8gdGhlIHdyYXBwZWQgZnVuY3Rpb24uXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQHNpZyAoTnVtYmVyLCAoKiAtPiAqKSkgLT4gKCogLT4gKilcbiAgICAgKiBAY2F0ZWdvcnkgRnVuY3Rpb25cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gbiBUaGUgZGVzaXJlZCBhcml0eSBvZiB0aGUgcmV0dXJuZWQgZnVuY3Rpb24uXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGZ1bmN0aW9uIHRvIHdyYXAuXG4gICAgICogQHJldHVybiB7RnVuY3Rpb259IEEgbmV3IGZ1bmN0aW9uIHdyYXBwaW5nIGBmbmAuIFRoZSBuZXcgZnVuY3Rpb24gaXNcbiAgICAgKiAgICAgICAgIGd1YXJhbnRlZWQgdG8gYmUgb2YgYXJpdHkgYG5gLlxuICAgICAqIEBkZXByZWNhdGVkIHNpbmNlIHYwLjE1LjBcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICB2YXIgdGFrZXNUd29BcmdzID0gZnVuY3Rpb24oYSwgYikge1xuICAgICAqICAgICAgICByZXR1cm4gW2EsIGJdO1xuICAgICAqICAgICAgfTtcbiAgICAgKiAgICAgIHRha2VzVHdvQXJncy5sZW5ndGg7IC8vPT4gMlxuICAgICAqICAgICAgdGFrZXNUd29BcmdzKDEsIDIpOyAvLz0+IFsxLCAyXVxuICAgICAqXG4gICAgICogICAgICB2YXIgdGFrZXNPbmVBcmcgPSBSLmFyaXR5KDEsIHRha2VzVHdvQXJncyk7XG4gICAgICogICAgICB0YWtlc09uZUFyZy5sZW5ndGg7IC8vPT4gMVxuICAgICAqICAgICAgLy8gQWxsIGFyZ3VtZW50cyBhcmUgcGFzc2VkIHRocm91Z2ggdG8gdGhlIHdyYXBwZWQgZnVuY3Rpb25cbiAgICAgKiAgICAgIHRha2VzT25lQXJnKDEsIDIpOyAvLz0+IFsxLCAyXVxuICAgICAqL1xuICAgIC8vIGpzaGludCB1bnVzZWQ6dmFyc1xuICAgIHZhciBhcml0eSA9IF9jdXJyeTIoZnVuY3Rpb24gKG4sIGZuKSB7XG4gICAgICAgIC8vIGpzaGludCB1bnVzZWQ6dmFyc1xuICAgICAgICBzd2l0Y2ggKG4pIHtcbiAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoYTApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoYTAsIGExKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICB9O1xuICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGEwLCBhMSwgYTIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIGNhc2UgNDpcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoYTAsIGExLCBhMiwgYTMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIGNhc2UgNTpcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoYTAsIGExLCBhMiwgYTMsIGE0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICB9O1xuICAgICAgICBjYXNlIDY6XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGEwLCBhMSwgYTIsIGEzLCBhNCwgYTUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIGNhc2UgNzpcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoYTAsIGExLCBhMiwgYTMsIGE0LCBhNSwgYTYpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIGNhc2UgODpcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoYTAsIGExLCBhMiwgYTMsIGE0LCBhNSwgYTYsIGE3KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICB9O1xuICAgICAgICBjYXNlIDk6XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGEwLCBhMSwgYTIsIGEzLCBhNCwgYTUsIGE2LCBhNywgYTgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIGNhc2UgMTA6XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGEwLCBhMSwgYTIsIGEzLCBhNCwgYTUsIGE2LCBhNywgYTgsIGE5KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICB9O1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdGaXJzdCBhcmd1bWVudCB0byBhcml0eSBtdXN0IGJlIGEgbm9uLW5lZ2F0aXZlIGludGVnZXIgbm8gZ3JlYXRlciB0aGFuIHRlbicpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBNYWtlcyBhIHNoYWxsb3cgY2xvbmUgb2YgYW4gb2JqZWN0LCBzZXR0aW5nIG9yIG92ZXJyaWRpbmcgdGhlIHNwZWNpZmllZFxuICAgICAqIHByb3BlcnR5IHdpdGggdGhlIGdpdmVuIHZhbHVlLiAgTm90ZSB0aGF0IHRoaXMgY29waWVzIGFuZCBmbGF0dGVuc1xuICAgICAqIHByb3RvdHlwZSBwcm9wZXJ0aWVzIG9udG8gdGhlIG5ldyBvYmplY3QgYXMgd2VsbC4gIEFsbCBub24tcHJpbWl0aXZlXG4gICAgICogcHJvcGVydGllcyBhcmUgY29waWVkIGJ5IHJlZmVyZW5jZS5cbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgT2JqZWN0XG4gICAgICogQHNpZyBTdHJpbmcgLT4gYSAtPiB7azogdn0gLT4ge2s6IHZ9XG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHByb3AgdGhlIHByb3BlcnR5IG5hbWUgdG8gc2V0XG4gICAgICogQHBhcmFtIHsqfSB2YWwgdGhlIG5ldyB2YWx1ZVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvYmogdGhlIG9iamVjdCB0byBjbG9uZVxuICAgICAqIEByZXR1cm4ge09iamVjdH0gYSBuZXcgb2JqZWN0IHNpbWlsYXIgdG8gdGhlIG9yaWdpbmFsIGV4Y2VwdCBmb3IgdGhlIHNwZWNpZmllZCBwcm9wZXJ0eS5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICBSLmFzc29jKCdjJywgMywge2E6IDEsIGI6IDJ9KTsgLy89PiB7YTogMSwgYjogMiwgYzogM31cbiAgICAgKi9cbiAgICB2YXIgYXNzb2MgPSBfY3VycnkzKF9hc3NvYyk7XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgZnVuY3Rpb24gdGhhdCBpcyBib3VuZCB0byBhIGNvbnRleHQuXG4gICAgICogTm90ZTogYFIuYmluZGAgZG9lcyBub3QgcHJvdmlkZSB0aGUgYWRkaXRpb25hbCBhcmd1bWVudC1iaW5kaW5nIGNhcGFiaWxpdGllcyBvZlxuICAgICAqIFtGdW5jdGlvbi5wcm90b3R5cGUuYmluZF0oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvRnVuY3Rpb24vYmluZCkuXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IEZ1bmN0aW9uXG4gICAgICogQGNhdGVnb3J5IE9iamVjdFxuICAgICAqIEBzZWUgUi5wYXJ0aWFsXG4gICAgICogQHNpZyAoKiAtPiAqKSAtPiB7Kn0gLT4gKCogLT4gKilcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgZnVuY3Rpb24gdG8gYmluZCB0byBjb250ZXh0XG4gICAgICogQHBhcmFtIHtPYmplY3R9IHRoaXNPYmogVGhlIGNvbnRleHQgdG8gYmluZCBgZm5gIHRvXG4gICAgICogQHJldHVybiB7RnVuY3Rpb259IEEgZnVuY3Rpb24gdGhhdCB3aWxsIGV4ZWN1dGUgaW4gdGhlIGNvbnRleHQgb2YgYHRoaXNPYmpgLlxuICAgICAqL1xuICAgIHZhciBiaW5kID0gX2N1cnJ5MihmdW5jdGlvbiBiaW5kKGZuLCB0aGlzT2JqKSB7XG4gICAgICAgIHJldHVybiBhcml0eShmbi5sZW5ndGgsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBmbi5hcHBseSh0aGlzT2JqLCBhcmd1bWVudHMpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIEEgZnVuY3Rpb24gd3JhcHBpbmcgY2FsbHMgdG8gdGhlIHR3byBmdW5jdGlvbnMgaW4gYW4gYCYmYCBvcGVyYXRpb24sIHJldHVybmluZyB0aGUgcmVzdWx0IG9mIHRoZSBmaXJzdFxuICAgICAqIGZ1bmN0aW9uIGlmIGl0IGlzIGZhbHNlLXkgYW5kIHRoZSByZXN1bHQgb2YgdGhlIHNlY29uZCBmdW5jdGlvbiBvdGhlcndpc2UuICBOb3RlIHRoYXQgdGhpcyBpc1xuICAgICAqIHNob3J0LWNpcmN1aXRlZCwgbWVhbmluZyB0aGF0IHRoZSBzZWNvbmQgZnVuY3Rpb24gd2lsbCBub3QgYmUgaW52b2tlZCBpZiB0aGUgZmlyc3QgcmV0dXJucyBhIGZhbHNlLXlcbiAgICAgKiB2YWx1ZS5cbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgTG9naWNcbiAgICAgKiBAc2lnICgqLi4uIC0+IEJvb2xlYW4pIC0+ICgqLi4uIC0+IEJvb2xlYW4pIC0+ICgqLi4uIC0+IEJvb2xlYW4pXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gZiBhIHByZWRpY2F0ZVxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGcgYW5vdGhlciBwcmVkaWNhdGVcbiAgICAgKiBAcmV0dXJuIHtGdW5jdGlvbn0gYSBmdW5jdGlvbiB0aGF0IGFwcGxpZXMgaXRzIGFyZ3VtZW50cyB0byBgZmAgYW5kIGBnYCBhbmQgYCYmYHMgdGhlaXIgb3V0cHV0cyB0b2dldGhlci5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICB2YXIgZ3QxMCA9IGZ1bmN0aW9uKHgpIHsgcmV0dXJuIHggPiAxMDsgfTtcbiAgICAgKiAgICAgIHZhciBldmVuID0gZnVuY3Rpb24oeCkgeyByZXR1cm4geCAlIDIgPT09IDAgfTtcbiAgICAgKiAgICAgIHZhciBmID0gUi5ib3RoKGd0MTAsIGV2ZW4pO1xuICAgICAqICAgICAgZigxMDApOyAvLz0+IHRydWVcbiAgICAgKiAgICAgIGYoMTAxKTsgLy89PiBmYWxzZVxuICAgICAqL1xuICAgIHZhciBib3RoID0gX2N1cnJ5MihmdW5jdGlvbiBib3RoKGYsIGcpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIF9ib3RoKCkge1xuICAgICAgICAgICAgcmV0dXJuIGYuYXBwbHkodGhpcywgYXJndW1lbnRzKSAmJiBnLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgIH07XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBNYWtlcyBhIGNvbXBhcmF0b3IgZnVuY3Rpb24gb3V0IG9mIGEgZnVuY3Rpb24gdGhhdCByZXBvcnRzIHdoZXRoZXIgdGhlIGZpcnN0IGVsZW1lbnQgaXMgbGVzcyB0aGFuIHRoZSBzZWNvbmQuXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IEZ1bmN0aW9uXG4gICAgICogQHNpZyAoYSwgYiAtPiBCb29sZWFuKSAtPiAoYSwgYiAtPiBOdW1iZXIpXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gcHJlZCBBIHByZWRpY2F0ZSBmdW5jdGlvbiBvZiBhcml0eSB0d28uXG4gICAgICogQHJldHVybiB7RnVuY3Rpb259IEEgRnVuY3Rpb24gOjogYSAtPiBiIC0+IEludCB0aGF0IHJldHVybnMgYC0xYCBpZiBhIDwgYiwgYDFgIGlmIGIgPCBhLCBvdGhlcndpc2UgYDBgLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIHZhciBjbXAgPSBSLmNvbXBhcmF0b3IoZnVuY3Rpb24oYSwgYikge1xuICAgICAqICAgICAgICByZXR1cm4gYS5hZ2UgPCBiLmFnZTtcbiAgICAgKiAgICAgIH0pO1xuICAgICAqICAgICAgdmFyIHBlb3BsZSA9IFtcbiAgICAgKiAgICAgICAgLy8gLi4uXG4gICAgICogICAgICBdO1xuICAgICAqICAgICAgUi5zb3J0KGNtcCwgcGVvcGxlKTtcbiAgICAgKi9cbiAgICB2YXIgY29tcGFyYXRvciA9IF9jdXJyeTEoZnVuY3Rpb24gY29tcGFyYXRvcihwcmVkKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoYSwgYikge1xuICAgICAgICAgICAgcmV0dXJuIHByZWQoYSwgYikgPyAtMSA6IHByZWQoYiwgYSkgPyAxIDogMDtcbiAgICAgICAgfTtcbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIFRha2VzIGEgZnVuY3Rpb24gYGZgIGFuZCByZXR1cm5zIGEgZnVuY3Rpb24gYGdgIHN1Y2ggdGhhdDpcbiAgICAgKlxuICAgICAqICAgLSBhcHBseWluZyBgZ2AgdG8gemVybyBvciBtb3JlIGFyZ3VtZW50cyB3aWxsIGdpdmUgX190cnVlX18gaWYgYXBwbHlpbmdcbiAgICAgKiAgICAgdGhlIHNhbWUgYXJndW1lbnRzIHRvIGBmYCBnaXZlcyBhIGxvZ2ljYWwgX19mYWxzZV9fIHZhbHVlOyBhbmRcbiAgICAgKlxuICAgICAqICAgLSBhcHBseWluZyBgZ2AgdG8gemVybyBvciBtb3JlIGFyZ3VtZW50cyB3aWxsIGdpdmUgX19mYWxzZV9fIGlmIGFwcGx5aW5nXG4gICAgICogICAgIHRoZSBzYW1lIGFyZ3VtZW50cyB0byBgZmAgZ2l2ZXMgYSBsb2dpY2FsIF9fdHJ1ZV9fIHZhbHVlLlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBMb2dpY1xuICAgICAqIEBzaWcgKCouLi4gLT4gKikgLT4gKCouLi4gLT4gQm9vbGVhbilcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmXG4gICAgICogQHJldHVybiB7RnVuY3Rpb259XG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgdmFyIGlzRXZlbiA9IGZ1bmN0aW9uKG4pIHsgcmV0dXJuIG4gJSAyID09PSAwOyB9O1xuICAgICAqICAgICAgdmFyIGlzT2RkID0gUi5jb21wbGVtZW50KGlzRXZlbik7XG4gICAgICogICAgICBpc09kZCgyMSk7IC8vPT4gdHJ1ZVxuICAgICAqICAgICAgaXNPZGQoNDIpOyAvLz0+IGZhbHNlXG4gICAgICovXG4gICAgdmFyIGNvbXBsZW1lbnQgPSBfY3VycnkxKF9jb21wbGVtZW50KTtcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYSBmdW5jdGlvbiwgYGZuYCwgd2hpY2ggZW5jYXBzdWxhdGVzIGlmL2Vsc2UtaWYvZWxzZSBsb2dpYy5cbiAgICAgKiBFYWNoIGFyZ3VtZW50IHRvIGBSLmNvbmRgIGlzIGEgW3ByZWRpY2F0ZSwgdHJhbnNmb3JtXSBwYWlyLiBBbGwgb2ZcbiAgICAgKiB0aGUgYXJndW1lbnRzIHRvIGBmbmAgYXJlIGFwcGxpZWQgdG8gZWFjaCBvZiB0aGUgcHJlZGljYXRlcyBpbiB0dXJuXG4gICAgICogdW50aWwgb25lIHJldHVybnMgYSBcInRydXRoeVwiIHZhbHVlLCBhdCB3aGljaCBwb2ludCBgZm5gIHJldHVybnMgdGhlXG4gICAgICogcmVzdWx0IG9mIGFwcGx5aW5nIGl0cyBhcmd1bWVudHMgdG8gdGhlIGNvcnJlc3BvbmRpbmcgdHJhbnNmb3JtZXIuXG4gICAgICogSWYgbm9uZSBvZiB0aGUgcHJlZGljYXRlcyBtYXRjaGVzLCBgZm5gIHJldHVybnMgdW5kZWZpbmVkLlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBMb2dpY1xuICAgICAqIEBzaWcgWygqLi4uIC0+IEJvb2xlYW4pLCgqLi4uIC0+ICopXS4uLiAtPiAoKi4uLiAtPiAqKVxuICAgICAqIEBwYXJhbSB7Li4uRnVuY3Rpb259IGZ1bmN0aW9uc1xuICAgICAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIHZhciBmbiA9IFIuY29uZChcbiAgICAgKiAgICAgICAgW1IuZXF1YWxzKDApLCAgIFIuYWx3YXlzKCd3YXRlciBmcmVlemVzIGF0IDDCsEMnKV0sXG4gICAgICogICAgICAgIFtSLmVxdWFscygxMDApLCBSLmFsd2F5cygnd2F0ZXIgYm9pbHMgYXQgMTAwwrBDJyldLFxuICAgICAqICAgICAgICBbUi5ULCAgICAgICAgICAgZnVuY3Rpb24odGVtcCkgeyByZXR1cm4gJ25vdGhpbmcgc3BlY2lhbCBoYXBwZW5zIGF0ICcgKyB0ZW1wICsgJ8KwQyc7IH1dXG4gICAgICogICAgICApO1xuICAgICAqICAgICAgZm4oMCk7IC8vPT4gJ3dhdGVyIGZyZWV6ZXMgYXQgMMKwQydcbiAgICAgKiAgICAgIGZuKDUwKTsgLy89PiAnbm90aGluZyBzcGVjaWFsIGhhcHBlbnMgYXQgNTDCsEMnXG4gICAgICogICAgICBmbigxMDApOyAvLz0+ICd3YXRlciBib2lscyBhdCAxMDDCsEMnXG4gICAgICovXG4gICAgdmFyIGNvbmQgPSBmdW5jdGlvbiBjb25kKCkge1xuICAgICAgICB2YXIgcGFpcnMgPSBhcmd1bWVudHM7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgaWR4ID0gMDtcbiAgICAgICAgICAgIHdoaWxlIChpZHggPCBwYWlycy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBpZiAocGFpcnNbaWR4XVswXS5hcHBseSh0aGlzLCBhcmd1bWVudHMpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwYWlyc1tpZHhdWzFdLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlkeCArPSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgYHhgIGlzIGZvdW5kIGluIHRoZSBgbGlzdGAsIHVzaW5nIGBwcmVkYCBhcyBhblxuICAgICAqIGVxdWFsaXR5IHByZWRpY2F0ZSBmb3IgYHhgLlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBMaXN0XG4gICAgICogQHNpZyAoYSwgYSAtPiBCb29sZWFuKSAtPiBhIC0+IFthXSAtPiBCb29sZWFuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gcHJlZCBBIHByZWRpY2F0ZSB1c2VkIHRvIHRlc3Qgd2hldGhlciB0d28gaXRlbXMgYXJlIGVxdWFsLlxuICAgICAqIEBwYXJhbSB7Kn0geCBUaGUgaXRlbSB0byBmaW5kXG4gICAgICogQHBhcmFtIHtBcnJheX0gbGlzdCBUaGUgbGlzdCB0byBpdGVyYXRlIG92ZXJcbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufSBgdHJ1ZWAgaWYgYHhgIGlzIGluIGBsaXN0YCwgZWxzZSBgZmFsc2VgLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIHZhciB4cyA9IFt7eDogMTJ9LCB7eDogMTF9LCB7eDogMTB9XTtcbiAgICAgKiAgICAgIFIuY29udGFpbnNXaXRoKGZ1bmN0aW9uKGEsIGIpIHsgcmV0dXJuIGEueCA9PT0gYi54OyB9LCB7eDogMTB9LCB4cyk7IC8vPT4gdHJ1ZVxuICAgICAqICAgICAgUi5jb250YWluc1dpdGgoZnVuY3Rpb24oYSwgYikgeyByZXR1cm4gYS54ID09PSBiLng7IH0sIHt4OiAxfSwgeHMpOyAvLz0+IGZhbHNlXG4gICAgICovXG4gICAgdmFyIGNvbnRhaW5zV2l0aCA9IF9jdXJyeTMoX2NvbnRhaW5zV2l0aCk7XG5cbiAgICAvKipcbiAgICAgKiBDb3VudHMgdGhlIGVsZW1lbnRzIG9mIGEgbGlzdCBhY2NvcmRpbmcgdG8gaG93IG1hbnkgbWF0Y2ggZWFjaCB2YWx1ZVxuICAgICAqIG9mIGEga2V5IGdlbmVyYXRlZCBieSB0aGUgc3VwcGxpZWQgZnVuY3Rpb24uIFJldHVybnMgYW4gb2JqZWN0XG4gICAgICogbWFwcGluZyB0aGUga2V5cyBwcm9kdWNlZCBieSBgZm5gIHRvIHRoZSBudW1iZXIgb2Ygb2NjdXJyZW5jZXMgaW5cbiAgICAgKiB0aGUgbGlzdC4gTm90ZSB0aGF0IGFsbCBrZXlzIGFyZSBjb2VyY2VkIHRvIHN0cmluZ3MgYmVjYXVzZSBvZiBob3dcbiAgICAgKiBKYXZhU2NyaXB0IG9iamVjdHMgd29yay5cbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgUmVsYXRpb25cbiAgICAgKiBAc2lnIChhIC0+IFN0cmluZykgLT4gW2FdIC0+IHsqfVxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBmdW5jdGlvbiB1c2VkIHRvIG1hcCB2YWx1ZXMgdG8ga2V5cy5cbiAgICAgKiBAcGFyYW0ge0FycmF5fSBsaXN0IFRoZSBsaXN0IHRvIGNvdW50IGVsZW1lbnRzIGZyb20uXG4gICAgICogQHJldHVybiB7T2JqZWN0fSBBbiBvYmplY3QgbWFwcGluZyBrZXlzIHRvIG51bWJlciBvZiBvY2N1cnJlbmNlcyBpbiB0aGUgbGlzdC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICB2YXIgbnVtYmVycyA9IFsxLjAsIDEuMSwgMS4yLCAyLjAsIDMuMCwgMi4yXTtcbiAgICAgKiAgICAgIHZhciBsZXR0ZXJzID0gUi5zcGxpdCgnJywgJ2FiY0FCQ2FhYUJCYycpO1xuICAgICAqICAgICAgUi5jb3VudEJ5KE1hdGguZmxvb3IpKG51bWJlcnMpOyAgICAvLz0+IHsnMSc6IDMsICcyJzogMiwgJzMnOiAxfVxuICAgICAqICAgICAgUi5jb3VudEJ5KFIudG9Mb3dlcikobGV0dGVycyk7ICAgLy89PiB7J2EnOiA1LCAnYic6IDQsICdjJzogM31cbiAgICAgKi9cbiAgICB2YXIgY291bnRCeSA9IF9jdXJyeTIoZnVuY3Rpb24gY291bnRCeShmbiwgbGlzdCkge1xuICAgICAgICB2YXIgY291bnRzID0ge307XG4gICAgICAgIHZhciBsZW4gPSBsaXN0Lmxlbmd0aDtcbiAgICAgICAgdmFyIGlkeCA9IDA7XG4gICAgICAgIHdoaWxlIChpZHggPCBsZW4pIHtcbiAgICAgICAgICAgIHZhciBrZXkgPSBmbihsaXN0W2lkeF0pO1xuICAgICAgICAgICAgY291bnRzW2tleV0gPSAoX2hhcyhrZXksIGNvdW50cykgPyBjb3VudHNba2V5XSA6IDApICsgMTtcbiAgICAgICAgICAgIGlkeCArPSAxO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb3VudHM7XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGFuIG9iamVjdCBjb250YWluaW5nIGEgc2luZ2xlIGtleTp2YWx1ZSBwYWlyLlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBPYmplY3RcbiAgICAgKiBAc2lnIFN0cmluZyAtPiBhIC0+IHtTdHJpbmc6YX1cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30ga2V5XG4gICAgICogQHBhcmFtIHsqfSB2YWxcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9XG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgdmFyIG1hdGNoUGhyYXNlcyA9IFIuY29tcG9zZShcbiAgICAgKiAgICAgICAgUi5jcmVhdGVNYXBFbnRyeSgnbXVzdCcpLFxuICAgICAqICAgICAgICBSLm1hcChSLmNyZWF0ZU1hcEVudHJ5KCdtYXRjaF9waHJhc2UnKSlcbiAgICAgKiAgICAgICk7XG4gICAgICogICAgICBtYXRjaFBocmFzZXMoWydmb28nLCAnYmFyJywgJ2JheiddKTsgLy89PiB7bXVzdDogW3ttYXRjaF9waHJhc2U6ICdmb28nfSwge21hdGNoX3BocmFzZTogJ2Jhcid9LCB7bWF0Y2hfcGhyYXNlOiAnYmF6J31dfVxuICAgICAqL1xuICAgIHZhciBjcmVhdGVNYXBFbnRyeSA9IF9jdXJyeTIoX2NyZWF0ZU1hcEVudHJ5KTtcblxuICAgIC8qKlxuICAgICAqIERlY3JlbWVudHMgaXRzIGFyZ3VtZW50LlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBNYXRoXG4gICAgICogQHNpZyBOdW1iZXIgLT4gTnVtYmVyXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IG5cbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9XG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgUi5kZWMoNDIpOyAvLz0+IDQxXG4gICAgICovXG4gICAgdmFyIGRlYyA9IGFkZCgtMSk7XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBzZWNvbmQgYXJndW1lbnQgaWYgaXQgaXMgbm90IG51bGwgb3IgdW5kZWZpbmVkLiBJZiBpdCBpcyBudWxsXG4gICAgICogb3IgdW5kZWZpbmVkLCB0aGUgZmlyc3QgKGRlZmF1bHQpIGFyZ3VtZW50IGlzIHJldHVybmVkLlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBMb2dpY1xuICAgICAqIEBzaWcgYSAtPiBiIC0+IGEgfCBiXG4gICAgICogQHBhcmFtIHthfSB2YWwgVGhlIGRlZmF1bHQgdmFsdWUuXG4gICAgICogQHBhcmFtIHtifSB2YWwgVGhlIHZhbHVlIHRvIHJldHVybiBpZiBpdCBpcyBub3QgbnVsbCBvciB1bmRlZmluZWRcbiAgICAgKiBAcmV0dXJuIHsqfSBUaGUgdGhlIHNlY29uZCB2YWx1ZSBvciB0aGUgZGVmYXVsdCB2YWx1ZVxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIHZhciBkZWZhdWx0VG80MiA9IGRlZmF1bHRUbyg0Mik7XG4gICAgICpcbiAgICAgKiAgICAgIGRlZmF1bHRUbzQyKG51bGwpOyAgLy89PiA0MlxuICAgICAqICAgICAgZGVmYXVsdFRvNDIodW5kZWZpbmVkKTsgIC8vPT4gNDJcbiAgICAgKiAgICAgIGRlZmF1bHRUbzQyKCdSYW1kYScpOyAgLy89PiAnUmFtZGEnXG4gICAgICovXG4gICAgdmFyIGRlZmF1bHRUbyA9IF9jdXJyeTIoZnVuY3Rpb24gZGVmYXVsdFRvKGQsIHYpIHtcbiAgICAgICAgcmV0dXJuIHYgPT0gbnVsbCA/IGQgOiB2O1xuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogRmluZHMgdGhlIHNldCAoaS5lLiBubyBkdXBsaWNhdGVzKSBvZiBhbGwgZWxlbWVudHMgaW4gdGhlIGZpcnN0IGxpc3Qgbm90IGNvbnRhaW5lZCBpbiB0aGUgc2Vjb25kIGxpc3QuXG4gICAgICogRHVwbGljYXRpb24gaXMgZGV0ZXJtaW5lZCBhY2NvcmRpbmcgdG8gdGhlIHZhbHVlIHJldHVybmVkIGJ5IGFwcGx5aW5nIHRoZSBzdXBwbGllZCBwcmVkaWNhdGUgdG8gdHdvIGxpc3RcbiAgICAgKiBlbGVtZW50cy5cbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgUmVsYXRpb25cbiAgICAgKiBAc2lnIChhLGEgLT4gQm9vbGVhbikgLT4gW2FdIC0+IFthXSAtPiBbYV1cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBwcmVkIEEgcHJlZGljYXRlIHVzZWQgdG8gdGVzdCB3aGV0aGVyIHR3byBpdGVtcyBhcmUgZXF1YWwuXG4gICAgICogQHBhcmFtIHtBcnJheX0gbGlzdDEgVGhlIGZpcnN0IGxpc3QuXG4gICAgICogQHBhcmFtIHtBcnJheX0gbGlzdDIgVGhlIHNlY29uZCBsaXN0LlxuICAgICAqIEBzZWUgUi5kaWZmZXJlbmNlXG4gICAgICogQHJldHVybiB7QXJyYXl9IFRoZSBlbGVtZW50cyBpbiBgbGlzdDFgIHRoYXQgYXJlIG5vdCBpbiBgbGlzdDJgLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIGZ1bmN0aW9uIGNtcCh4LCB5KSB7IHJldHVybiB4LmEgPT09IHkuYTsgfVxuICAgICAqICAgICAgdmFyIGwxID0gW3thOiAxfSwge2E6IDJ9LCB7YTogM31dO1xuICAgICAqICAgICAgdmFyIGwyID0gW3thOiAzfSwge2E6IDR9XTtcbiAgICAgKiAgICAgIFIuZGlmZmVyZW5jZVdpdGgoY21wLCBsMSwgbDIpOyAvLz0+IFt7YTogMX0sIHthOiAyfV1cbiAgICAgKi9cbiAgICB2YXIgZGlmZmVyZW5jZVdpdGggPSBfY3VycnkzKGZ1bmN0aW9uIGRpZmZlcmVuY2VXaXRoKHByZWQsIGZpcnN0LCBzZWNvbmQpIHtcbiAgICAgICAgdmFyIG91dCA9IFtdO1xuICAgICAgICB2YXIgaWR4ID0gMDtcbiAgICAgICAgdmFyIGZpcnN0TGVuID0gZmlyc3QubGVuZ3RoO1xuICAgICAgICB2YXIgY29udGFpbnNQcmVkID0gY29udGFpbnNXaXRoKHByZWQpO1xuICAgICAgICB3aGlsZSAoaWR4IDwgZmlyc3RMZW4pIHtcbiAgICAgICAgICAgIGlmICghY29udGFpbnNQcmVkKGZpcnN0W2lkeF0sIHNlY29uZCkgJiYgIWNvbnRhaW5zUHJlZChmaXJzdFtpZHhdLCBvdXQpKSB7XG4gICAgICAgICAgICAgICAgb3V0W291dC5sZW5ndGhdID0gZmlyc3RbaWR4XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlkeCArPSAxO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGEgbmV3IG9iamVjdCB0aGF0IGRvZXMgbm90IGNvbnRhaW4gYSBgcHJvcGAgcHJvcGVydHkuXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IE9iamVjdFxuICAgICAqIEBzaWcgU3RyaW5nIC0+IHtrOiB2fSAtPiB7azogdn1cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gcHJvcCB0aGUgbmFtZSBvZiB0aGUgcHJvcGVydHkgdG8gZGlzc29jaWF0ZVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvYmogdGhlIG9iamVjdCB0byBjbG9uZVxuICAgICAqIEByZXR1cm4ge09iamVjdH0gYSBuZXcgb2JqZWN0IHNpbWlsYXIgdG8gdGhlIG9yaWdpbmFsIGJ1dCB3aXRob3V0IHRoZSBzcGVjaWZpZWQgcHJvcGVydHlcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICBSLmRpc3NvYygnYicsIHthOiAxLCBiOiAyLCBjOiAzfSk7IC8vPT4ge2E6IDEsIGM6IDN9XG4gICAgICovXG4gICAgdmFyIGRpc3NvYyA9IF9jdXJyeTIoX2Rpc3NvYyk7XG5cbiAgICAvKipcbiAgICAgKiBEaXZpZGVzIHR3byBudW1iZXJzLiBFcXVpdmFsZW50IHRvIGBhIC8gYmAuXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IE1hdGhcbiAgICAgKiBAc2lnIE51bWJlciAtPiBOdW1iZXIgLT4gTnVtYmVyXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGEgVGhlIGZpcnN0IHZhbHVlLlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBiIFRoZSBzZWNvbmQgdmFsdWUuXG4gICAgICogQHJldHVybiB7TnVtYmVyfSBUaGUgcmVzdWx0IG9mIGBhIC8gYmAuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgUi5kaXZpZGUoNzEsIDEwMCk7IC8vPT4gMC43MVxuICAgICAqXG4gICAgICogICAgICB2YXIgaGFsZiA9IFIuZGl2aWRlKFIuX18sIDIpO1xuICAgICAqICAgICAgaGFsZig0Mik7IC8vPT4gMjFcbiAgICAgKlxuICAgICAqICAgICAgdmFyIHJlY2lwcm9jYWwgPSBSLmRpdmlkZSgxKTtcbiAgICAgKiAgICAgIHJlY2lwcm9jYWwoNCk7ICAgLy89PiAwLjI1XG4gICAgICovXG4gICAgdmFyIGRpdmlkZSA9IF9jdXJyeTIoZnVuY3Rpb24gZGl2aWRlKGEsIGIpIHtcbiAgICAgICAgcmV0dXJuIGEgLyBiO1xuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogQSBmdW5jdGlvbiB3cmFwcGluZyBjYWxscyB0byB0aGUgdHdvIGZ1bmN0aW9ucyBpbiBhbiBgfHxgIG9wZXJhdGlvbiwgcmV0dXJuaW5nIHRoZSByZXN1bHQgb2YgdGhlIGZpcnN0XG4gICAgICogZnVuY3Rpb24gaWYgaXQgaXMgdHJ1dGgteSBhbmQgdGhlIHJlc3VsdCBvZiB0aGUgc2Vjb25kIGZ1bmN0aW9uIG90aGVyd2lzZS4gIE5vdGUgdGhhdCB0aGlzIGlzXG4gICAgICogc2hvcnQtY2lyY3VpdGVkLCBtZWFuaW5nIHRoYXQgdGhlIHNlY29uZCBmdW5jdGlvbiB3aWxsIG5vdCBiZSBpbnZva2VkIGlmIHRoZSBmaXJzdCByZXR1cm5zIGEgdHJ1dGgteVxuICAgICAqIHZhbHVlLlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBMb2dpY1xuICAgICAqIEBzaWcgKCouLi4gLT4gQm9vbGVhbikgLT4gKCouLi4gLT4gQm9vbGVhbikgLT4gKCouLi4gLT4gQm9vbGVhbilcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmIGEgcHJlZGljYXRlXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gZyBhbm90aGVyIHByZWRpY2F0ZVxuICAgICAqIEByZXR1cm4ge0Z1bmN0aW9ufSBhIGZ1bmN0aW9uIHRoYXQgYXBwbGllcyBpdHMgYXJndW1lbnRzIHRvIGBmYCBhbmQgYGdgIGFuZCBgfHxgcyB0aGVpciBvdXRwdXRzIHRvZ2V0aGVyLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIHZhciBndDEwID0gZnVuY3Rpb24oeCkgeyByZXR1cm4geCA+IDEwOyB9O1xuICAgICAqICAgICAgdmFyIGV2ZW4gPSBmdW5jdGlvbih4KSB7IHJldHVybiB4ICUgMiA9PT0gMCB9O1xuICAgICAqICAgICAgdmFyIGYgPSBSLmVpdGhlcihndDEwLCBldmVuKTtcbiAgICAgKiAgICAgIGYoMTAxKTsgLy89PiB0cnVlXG4gICAgICogICAgICBmKDgpOyAvLz0+IHRydWVcbiAgICAgKi9cbiAgICB2YXIgZWl0aGVyID0gX2N1cnJ5MihmdW5jdGlvbiBlaXRoZXIoZiwgZykge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gX2VpdGhlcigpIHtcbiAgICAgICAgICAgIHJldHVybiBmLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgfHwgZy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICB9O1xuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogVGVzdHMgaWYgdHdvIGl0ZW1zIGFyZSBlcXVhbC4gIEVxdWFsaXR5IGlzIHN0cmljdCBoZXJlLCBtZWFuaW5nIHJlZmVyZW5jZSBlcXVhbGl0eSBmb3Igb2JqZWN0cyBhbmRcbiAgICAgKiBub24tY29lcmNpbmcgZXF1YWxpdHkgZm9yIHByaW1pdGl2ZXMuXG4gICAgICpcbiAgICAgKiBIYXMgYE9iamVjdC5pc2Agc2VtYW50aWNzOiBgTmFOYCBpcyBjb25zaWRlcmVkIGVxdWFsIHRvIGBOYU5gOyBgMGAgYW5kIGAtMGBcbiAgICAgKiBhcmUgbm90IGNvbnNpZGVyZWQgZXF1YWwuXG4gICAgICogQHNlZSBSLmlkZW50aWNhbFxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBSZWxhdGlvblxuICAgICAqIEBzaWcgYSAtPiBhIC0+IEJvb2xlYW5cbiAgICAgKiBAcGFyYW0geyp9IGFcbiAgICAgKiBAcGFyYW0geyp9IGJcbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgICAqIEBkZXByZWNhdGVkIHNpbmNlIHYwLjE1LjBcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICB2YXIgbyA9IHt9O1xuICAgICAqICAgICAgUi5lcShvLCBvKTsgLy89PiB0cnVlXG4gICAgICogICAgICBSLmVxKG8sIHt9KTsgLy89PiBmYWxzZVxuICAgICAqICAgICAgUi5lcSgxLCAxKTsgLy89PiB0cnVlXG4gICAgICogICAgICBSLmVxKDEsICcxJyk7IC8vPT4gZmFsc2VcbiAgICAgKiAgICAgIFIuZXEoMCwgLTApOyAvLz0+IGZhbHNlXG4gICAgICogICAgICBSLmVxKE5hTiwgTmFOKTsgLy89PiB0cnVlXG4gICAgICovXG4gICAgdmFyIGVxID0gX2N1cnJ5MihfZXEpO1xuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIG5ldyBvYmplY3QgYnkgcmVjdXJzaXZlbHkgZXZvbHZpbmcgYSBzaGFsbG93IGNvcHkgb2YgYG9iamVjdGAsIGFjY29yZGluZyB0byB0aGVcbiAgICAgKiBgdHJhbnNmb3JtYXRpb25gIGZ1bmN0aW9ucy4gQWxsIG5vbi1wcmltaXRpdmUgcHJvcGVydGllcyBhcmUgY29waWVkIGJ5IHJlZmVyZW5jZS5cbiAgICAgKlxuICAgICAqIEEgYHRyYW5mb3JtYXRpb25gIGZ1bmN0aW9uIHdpbGwgbm90IGJlIGludm9rZWQgaWYgaXRzIGNvcnJlc3BvbmRpbmcga2V5IGRvZXMgbm90IGV4aXN0IGluXG4gICAgICogdGhlIGV2b2x2ZWQgb2JqZWN0LlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBPYmplY3RcbiAgICAgKiBAc2lnIHtrOiAodiAtPiB2KX0gLT4ge2s6IHZ9IC0+IHtrOiB2fVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSB0cmFuc2Zvcm1hdGlvbnMgVGhlIG9iamVjdCBzcGVjaWZ5aW5nIHRyYW5zZm9ybWF0aW9uIGZ1bmN0aW9ucyB0byBhcHBseVxuICAgICAqICAgICAgICB0byB0aGUgb2JqZWN0LlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBiZSB0cmFuc2Zvcm1lZC5cbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IFRoZSB0cmFuc2Zvcm1lZCBvYmplY3QuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgdmFyIHRvbWF0byAgPSB7Zmlyc3ROYW1lOiAnICBUb21hdG8gJywgZWxhcHNlZDogMTAwLCByZW1haW5pbmc6IDE0MDB9O1xuICAgICAqICAgICAgdmFyIHRyYW5zZm9ybWF0aW9ucyA9IHtcbiAgICAgKiAgICAgICAgZmlyc3ROYW1lOiBSLnRyaW0sXG4gICAgICogICAgICAgIGxhc3ROYW1lOiBSLnRyaW0sIC8vIFdpbGwgbm90IGdldCBpbnZva2VkLlxuICAgICAqICAgICAgICBkYXRhOiB7ZWxhcHNlZDogUi5hZGQoMSksIHJlbWFpbmluZzogUi5hZGQoLTEpfVxuICAgICAqICAgICAgfTtcbiAgICAgKiAgICAgIFIuZXZvbHZlKHRyYW5zZm9ybWF0aW9ucywgdG9tYXRvKTsgLy89PiB7Zmlyc3ROYW1lOiAnVG9tYXRvJywgZGF0YToge2VsYXBzZWQ6IDEwMSwgcmVtYWluaW5nOiAxMzk5fX1cbiAgICAgKi9cbiAgICB2YXIgZXZvbHZlID0gX2N1cnJ5MihmdW5jdGlvbiBldm9sdmUodHJhbnNmb3JtYXRpb25zLCBvYmplY3QpIHtcbiAgICAgICAgdmFyIHRyYW5zZm9ybWF0aW9uLCBrZXksIHR5cGUsIHJlc3VsdCA9IHt9O1xuICAgICAgICBmb3IgKGtleSBpbiBvYmplY3QpIHtcbiAgICAgICAgICAgIHRyYW5zZm9ybWF0aW9uID0gdHJhbnNmb3JtYXRpb25zW2tleV07XG4gICAgICAgICAgICB0eXBlID0gdHlwZW9mIHRyYW5zZm9ybWF0aW9uO1xuICAgICAgICAgICAgcmVzdWx0W2tleV0gPSB0eXBlID09PSAnZnVuY3Rpb24nID8gdHJhbnNmb3JtYXRpb24ob2JqZWN0W2tleV0pIDogdHlwZSA9PT0gJ29iamVjdCcgPyBldm9sdmUodHJhbnNmb3JtYXRpb25zW2tleV0sIG9iamVjdFtrZXldKSA6IG9iamVjdFtrZXldO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBMaWtlIGBmaWx0ZXJgLCBidXQgcGFzc2VzIGFkZGl0aW9uYWwgcGFyYW1ldGVycyB0byB0aGUgcHJlZGljYXRlIGZ1bmN0aW9uLiBUaGUgcHJlZGljYXRlXG4gICAgICogZnVuY3Rpb24gaXMgcGFzc2VkIHRocmVlIGFyZ3VtZW50czogKih2YWx1ZSwgaW5kZXgsIGxpc3QpKi5cbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgTGlzdFxuICAgICAqIEBzaWcgKGEsIGksIFthXSAtPiBCb29sZWFuKSAtPiBbYV0gLT4gW2FdXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGZ1bmN0aW9uIGNhbGxlZCBwZXIgaXRlcmF0aW9uLlxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGxpc3QgVGhlIGNvbGxlY3Rpb24gdG8gaXRlcmF0ZSBvdmVyLlxuICAgICAqIEByZXR1cm4ge0FycmF5fSBUaGUgbmV3IGZpbHRlcmVkIGFycmF5LlxuICAgICAqIEBkZXByZWNhdGVkIHNpbmNlIHYwLjE1LjBcbiAgICAgKiBAc2VlIFIuYWRkSW5kZXhcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICB2YXIgbGFzdFR3byA9IGZ1bmN0aW9uKHZhbCwgaWR4LCBsaXN0KSB7XG4gICAgICogICAgICAgIHJldHVybiBsaXN0Lmxlbmd0aCAtIGlkeCA8PSAyO1xuICAgICAqICAgICAgfTtcbiAgICAgKiAgICAgIFIuZmlsdGVySW5kZXhlZChsYXN0VHdvLCBbOCwgNiwgNywgNSwgMywgMCwgOV0pOyAvLz0+IFswLCA5XVxuICAgICAqL1xuICAgIHZhciBmaWx0ZXJJbmRleGVkID0gX2N1cnJ5MihfZmlsdGVySW5kZXhlZCk7XG5cbiAgICAvKipcbiAgICAgKiBMaWtlIGBmb3JFYWNoYCwgYnV0IGJ1dCBwYXNzZXMgYWRkaXRpb25hbCBwYXJhbWV0ZXJzIHRvIHRoZSBwcmVkaWNhdGUgZnVuY3Rpb24uXG4gICAgICpcbiAgICAgKiBgZm5gIHJlY2VpdmVzIHRocmVlIGFyZ3VtZW50czogKih2YWx1ZSwgaW5kZXgsIGxpc3QpKi5cbiAgICAgKlxuICAgICAqIE5vdGU6IGBSLmZvckVhY2hJbmRleGVkYCBkb2VzIG5vdCBza2lwIGRlbGV0ZWQgb3IgdW5hc3NpZ25lZCBpbmRpY2VzIChzcGFyc2UgYXJyYXlzKSxcbiAgICAgKiB1bmxpa2UgdGhlIG5hdGl2ZSBgQXJyYXkucHJvdG90eXBlLmZvckVhY2hgIG1ldGhvZC4gRm9yIG1vcmUgZGV0YWlscyBvbiB0aGlzIGJlaGF2aW9yLFxuICAgICAqIHNlZTpcbiAgICAgKiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9BcnJheS9mb3JFYWNoI0Rlc2NyaXB0aW9uXG4gICAgICpcbiAgICAgKiBBbHNvIG5vdGUgdGhhdCwgdW5saWtlIGBBcnJheS5wcm90b3R5cGUuZm9yRWFjaGAsIFJhbWRhJ3MgYGZvckVhY2hgIHJldHVybnMgdGhlIG9yaWdpbmFsXG4gICAgICogYXJyYXkuIEluIHNvbWUgbGlicmFyaWVzIHRoaXMgZnVuY3Rpb24gaXMgbmFtZWQgYGVhY2hgLlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBMaXN0XG4gICAgICogQHNpZyAoYSwgaSwgW2FdIC0+ICkgLT4gW2FdIC0+IFthXVxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBmdW5jdGlvbiB0byBpbnZva2UuIFJlY2VpdmVzIHRocmVlIGFyZ3VtZW50czpcbiAgICAgKiAgICAgICAgKGB2YWx1ZWAsIGBpbmRleGAsIGBsaXN0YCkuXG4gICAgICogQHBhcmFtIHtBcnJheX0gbGlzdCBUaGUgbGlzdCB0byBpdGVyYXRlIG92ZXIuXG4gICAgICogQHJldHVybiB7QXJyYXl9IFRoZSBvcmlnaW5hbCBsaXN0LlxuICAgICAqIEBkZXByZWNhdGVkIHNpbmNlIHYwLjE1LjBcbiAgICAgKiBAc2VlIFIuYWRkSW5kZXhcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICAvLyBOb3RlIHRoYXQgaGF2aW5nIGFjY2VzcyB0byB0aGUgb3JpZ2luYWwgYGxpc3RgIGFsbG93cyBmb3JcbiAgICAgKiAgICAgIC8vIG11dGF0aW9uLiBXaGlsZSB5b3UgKmNhbiogZG8gdGhpcywgaXQncyB2ZXJ5IHVuLWZ1bmN0aW9uYWwgYmVoYXZpb3I6XG4gICAgICogICAgICB2YXIgcGx1c0ZpdmUgPSBmdW5jdGlvbihudW0sIGlkeCwgbGlzdCkgeyBsaXN0W2lkeF0gPSBudW0gKyA1IH07XG4gICAgICogICAgICBSLmZvckVhY2hJbmRleGVkKHBsdXNGaXZlLCBbMSwgMiwgM10pOyAvLz0+IFs2LCA3LCA4XVxuICAgICAqL1xuICAgIC8vIGkgY2FuJ3QgYmVhciBub3QgdG8gcmV0dXJuICpzb21ldGhpbmcqXG4gICAgdmFyIGZvckVhY2hJbmRleGVkID0gX2N1cnJ5MihmdW5jdGlvbiBmb3JFYWNoSW5kZXhlZChmbiwgbGlzdCkge1xuICAgICAgICB2YXIgaWR4ID0gMCwgbGVuID0gbGlzdC5sZW5ndGg7XG4gICAgICAgIHdoaWxlIChpZHggPCBsZW4pIHtcbiAgICAgICAgICAgIGZuKGxpc3RbaWR4XSwgaWR4LCBsaXN0KTtcbiAgICAgICAgICAgIGlkeCArPSAxO1xuICAgICAgICB9XG4gICAgICAgIC8vIGkgY2FuJ3QgYmVhciBub3QgdG8gcmV0dXJuICpzb21ldGhpbmcqXG4gICAgICAgIHJldHVybiBsaXN0O1xuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIG5ldyBvYmplY3Qgb3V0IG9mIGEgbGlzdCBrZXktdmFsdWUgcGFpcnMuXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IExpc3RcbiAgICAgKiBAc2lnIFtbayx2XV0gLT4ge2s6IHZ9XG4gICAgICogQHBhcmFtIHtBcnJheX0gcGFpcnMgQW4gYXJyYXkgb2YgdHdvLWVsZW1lbnQgYXJyYXlzIHRoYXQgd2lsbCBiZSB0aGUga2V5cyBhbmQgdmFsdWVzIG9mIHRoZSBvdXRwdXQgb2JqZWN0LlxuICAgICAqIEByZXR1cm4ge09iamVjdH0gVGhlIG9iamVjdCBtYWRlIGJ5IHBhaXJpbmcgdXAgYGtleXNgIGFuZCBgdmFsdWVzYC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICBSLmZyb21QYWlycyhbWydhJywgMV0sIFsnYicsIDJdLCAgWydjJywgM11dKTsgLy89PiB7YTogMSwgYjogMiwgYzogM31cbiAgICAgKi9cbiAgICB2YXIgZnJvbVBhaXJzID0gX2N1cnJ5MShmdW5jdGlvbiBmcm9tUGFpcnMocGFpcnMpIHtcbiAgICAgICAgdmFyIGlkeCA9IDAsIGxlbiA9IHBhaXJzLmxlbmd0aCwgb3V0ID0ge307XG4gICAgICAgIHdoaWxlIChpZHggPCBsZW4pIHtcbiAgICAgICAgICAgIGlmIChfaXNBcnJheShwYWlyc1tpZHhdKSAmJiBwYWlyc1tpZHhdLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIG91dFtwYWlyc1tpZHhdWzBdXSA9IHBhaXJzW2lkeF1bMV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZHggKz0gMTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0cnVlIGlmIHRoZSBmaXJzdCBwYXJhbWV0ZXIgaXMgZ3JlYXRlciB0aGFuIHRoZSBzZWNvbmQuXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IE1hdGhcbiAgICAgKiBAc2lnIE51bWJlciAtPiBOdW1iZXIgLT4gQm9vbGVhblxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBhXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGJcbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufSBhID4gYlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIFIuZ3QoMiwgNik7IC8vPT4gZmFsc2VcbiAgICAgKiAgICAgIFIuZ3QoMiwgMCk7IC8vPT4gdHJ1ZVxuICAgICAqICAgICAgUi5ndCgyLCAyKTsgLy89PiBmYWxzZVxuICAgICAqICAgICAgUi5ndChSLl9fLCAyKSgxMCk7IC8vPT4gdHJ1ZVxuICAgICAqICAgICAgUi5ndCgyKSgxMCk7IC8vPT4gZmFsc2VcbiAgICAgKi9cbiAgICB2YXIgZ3QgPSBfY3VycnkyKF9ndCk7XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRydWUgaWYgdGhlIGZpcnN0IHBhcmFtZXRlciBpcyBncmVhdGVyIHRoYW4gb3IgZXF1YWwgdG8gdGhlIHNlY29uZC5cbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgTWF0aFxuICAgICAqIEBzaWcgTnVtYmVyIC0+IE51bWJlciAtPiBCb29sZWFuXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGFcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gYlxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59IGEgPj0gYlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIFIuZ3RlKDIsIDYpOyAvLz0+IGZhbHNlXG4gICAgICogICAgICBSLmd0ZSgyLCAwKTsgLy89PiB0cnVlXG4gICAgICogICAgICBSLmd0ZSgyLCAyKTsgLy89PiB0cnVlXG4gICAgICogICAgICBSLmd0ZShSLl9fLCA2KSgyKTsgLy89PiBmYWxzZVxuICAgICAqICAgICAgUi5ndGUoMikoMCk7IC8vPT4gdHJ1ZVxuICAgICAqL1xuICAgIHZhciBndGUgPSBfY3VycnkyKGZ1bmN0aW9uIGd0ZShhLCBiKSB7XG4gICAgICAgIHJldHVybiBhID49IGI7XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHdoZXRoZXIgb3Igbm90IGFuIG9iamVjdCBoYXMgYW4gb3duIHByb3BlcnR5IHdpdGhcbiAgICAgKiB0aGUgc3BlY2lmaWVkIG5hbWVcbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgT2JqZWN0XG4gICAgICogQHNpZyBzIC0+IHtzOiB4fSAtPiBCb29sZWFuXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHByb3AgVGhlIG5hbWUgb2YgdGhlIHByb3BlcnR5IHRvIGNoZWNrIGZvci5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb2JqIFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn0gV2hldGhlciB0aGUgcHJvcGVydHkgZXhpc3RzLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIHZhciBoYXNOYW1lID0gUi5oYXMoJ25hbWUnKTtcbiAgICAgKiAgICAgIGhhc05hbWUoe25hbWU6ICdhbGljZSd9KTsgICAvLz0+IHRydWVcbiAgICAgKiAgICAgIGhhc05hbWUoe25hbWU6ICdib2InfSk7ICAgICAvLz0+IHRydWVcbiAgICAgKiAgICAgIGhhc05hbWUoe30pOyAgICAgICAgICAgICAgICAvLz0+IGZhbHNlXG4gICAgICpcbiAgICAgKiAgICAgIHZhciBwb2ludCA9IHt4OiAwLCB5OiAwfTtcbiAgICAgKiAgICAgIHZhciBwb2ludEhhcyA9IFIuaGFzKFIuX18sIHBvaW50KTtcbiAgICAgKiAgICAgIHBvaW50SGFzKCd4Jyk7ICAvLz0+IHRydWVcbiAgICAgKiAgICAgIHBvaW50SGFzKCd5Jyk7ICAvLz0+IHRydWVcbiAgICAgKiAgICAgIHBvaW50SGFzKCd6Jyk7ICAvLz0+IGZhbHNlXG4gICAgICovXG4gICAgdmFyIGhhcyA9IF9jdXJyeTIoX2hhcyk7XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHdoZXRoZXIgb3Igbm90IGFuIG9iamVjdCBvciBpdHMgcHJvdG90eXBlIGNoYWluIGhhc1xuICAgICAqIGEgcHJvcGVydHkgd2l0aCB0aGUgc3BlY2lmaWVkIG5hbWVcbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgT2JqZWN0XG4gICAgICogQHNpZyBzIC0+IHtzOiB4fSAtPiBCb29sZWFuXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHByb3AgVGhlIG5hbWUgb2YgdGhlIHByb3BlcnR5IHRvIGNoZWNrIGZvci5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb2JqIFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn0gV2hldGhlciB0aGUgcHJvcGVydHkgZXhpc3RzLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIGZ1bmN0aW9uIFJlY3RhbmdsZSh3aWR0aCwgaGVpZ2h0KSB7XG4gICAgICogICAgICAgIHRoaXMud2lkdGggPSB3aWR0aDtcbiAgICAgKiAgICAgICAgdGhpcy5oZWlnaHQgPSBoZWlnaHQ7XG4gICAgICogICAgICB9XG4gICAgICogICAgICBSZWN0YW5nbGUucHJvdG90eXBlLmFyZWEgPSBmdW5jdGlvbigpIHtcbiAgICAgKiAgICAgICAgcmV0dXJuIHRoaXMud2lkdGggKiB0aGlzLmhlaWdodDtcbiAgICAgKiAgICAgIH07XG4gICAgICpcbiAgICAgKiAgICAgIHZhciBzcXVhcmUgPSBuZXcgUmVjdGFuZ2xlKDIsIDIpO1xuICAgICAqICAgICAgUi5oYXNJbignd2lkdGgnLCBzcXVhcmUpOyAgLy89PiB0cnVlXG4gICAgICogICAgICBSLmhhc0luKCdhcmVhJywgc3F1YXJlKTsgIC8vPT4gdHJ1ZVxuICAgICAqL1xuICAgIHZhciBoYXNJbiA9IF9jdXJyeTIoZnVuY3Rpb24gKHByb3AsIG9iaikge1xuICAgICAgICByZXR1cm4gcHJvcCBpbiBvYmo7XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRydWUgaWYgaXRzIGFyZ3VtZW50cyBhcmUgaWRlbnRpY2FsLCBmYWxzZSBvdGhlcndpc2UuIFZhbHVlcyBhcmVcbiAgICAgKiBpZGVudGljYWwgaWYgdGhleSByZWZlcmVuY2UgdGhlIHNhbWUgbWVtb3J5LiBgTmFOYCBpcyBpZGVudGljYWwgdG8gYE5hTmA7XG4gICAgICogYDBgIGFuZCBgLTBgIGFyZSBub3QgaWRlbnRpY2FsLlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBSZWxhdGlvblxuICAgICAqIEBzaWcgYSAtPiBhIC0+IEJvb2xlYW5cbiAgICAgKiBAcGFyYW0geyp9IGFcbiAgICAgKiBAcGFyYW0geyp9IGJcbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIHZhciBvID0ge307XG4gICAgICogICAgICBSLmlkZW50aWNhbChvLCBvKTsgLy89PiB0cnVlXG4gICAgICogICAgICBSLmlkZW50aWNhbCgxLCAxKTsgLy89PiB0cnVlXG4gICAgICogICAgICBSLmlkZW50aWNhbCgxLCAnMScpOyAvLz0+IGZhbHNlXG4gICAgICogICAgICBSLmlkZW50aWNhbChbXSwgW10pOyAvLz0+IGZhbHNlXG4gICAgICogICAgICBSLmlkZW50aWNhbCgwLCAtMCk7IC8vPT4gZmFsc2VcbiAgICAgKiAgICAgIFIuaWRlbnRpY2FsKE5hTiwgTmFOKTsgLy89PiB0cnVlXG4gICAgICovXG4gICAgLy8gU2FtZVZhbHVlIGFsZ29yaXRobVxuICAgIC8vIFN0ZXBzIDEtNSwgNy0xMFxuICAgIC8vIFN0ZXBzIDYuYi02LmU6ICswICE9IC0wXG4gICAgLy8gU3RlcCA2LmE6IE5hTiA9PSBOYU5cbiAgICB2YXIgaWRlbnRpY2FsID0gX2N1cnJ5MihmdW5jdGlvbiBpZGVudGljYWwoYSwgYikge1xuICAgICAgICAvLyBTYW1lVmFsdWUgYWxnb3JpdGhtXG4gICAgICAgIGlmIChhID09PSBiKSB7XG4gICAgICAgICAgICAvLyBTdGVwcyAxLTUsIDctMTBcbiAgICAgICAgICAgIC8vIFN0ZXBzIDYuYi02LmU6ICswICE9IC0wXG4gICAgICAgICAgICByZXR1cm4gYSAhPT0gMCB8fCAxIC8gYSA9PT0gMSAvIGI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBTdGVwIDYuYTogTmFOID09IE5hTlxuICAgICAgICAgICAgcmV0dXJuIGEgIT09IGEgJiYgYiAhPT0gYjtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogQSBmdW5jdGlvbiB0aGF0IGRvZXMgbm90aGluZyBidXQgcmV0dXJuIHRoZSBwYXJhbWV0ZXIgc3VwcGxpZWQgdG8gaXQuIEdvb2QgYXMgYSBkZWZhdWx0XG4gICAgICogb3IgcGxhY2Vob2xkZXIgZnVuY3Rpb24uXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IEZ1bmN0aW9uXG4gICAgICogQHNpZyBhIC0+IGFcbiAgICAgKiBAcGFyYW0geyp9IHggVGhlIHZhbHVlIHRvIHJldHVybi5cbiAgICAgKiBAcmV0dXJuIHsqfSBUaGUgaW5wdXQgdmFsdWUsIGB4YC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICBSLmlkZW50aXR5KDEpOyAvLz0+IDFcbiAgICAgKlxuICAgICAqICAgICAgdmFyIG9iaiA9IHt9O1xuICAgICAqICAgICAgUi5pZGVudGl0eShvYmopID09PSBvYmo7IC8vPT4gdHJ1ZVxuICAgICAqL1xuICAgIHZhciBpZGVudGl0eSA9IF9jdXJyeTEoX2lkZW50aXR5KTtcblxuICAgIC8qKlxuICAgICAqIEluY3JlbWVudHMgaXRzIGFyZ3VtZW50LlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBNYXRoXG4gICAgICogQHNpZyBOdW1iZXIgLT4gTnVtYmVyXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IG5cbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9XG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgUi5pbmMoNDIpOyAvLz0+IDQzXG4gICAgICovXG4gICAgdmFyIGluYyA9IGFkZCgxKTtcblxuICAgIC8qKlxuICAgICAqIEluc2VydHMgdGhlIHN1Yi1saXN0IGludG8gdGhlIGxpc3QsIGF0IGluZGV4IGBpbmRleGAuICBfTm90ZSAgdGhhdCB0aGlzXG4gICAgICogaXMgbm90IGRlc3RydWN0aXZlXzogaXQgcmV0dXJucyBhIGNvcHkgb2YgdGhlIGxpc3Qgd2l0aCB0aGUgY2hhbmdlcy5cbiAgICAgKiA8c21hbGw+Tm8gbGlzdHMgaGF2ZSBiZWVuIGhhcm1lZCBpbiB0aGUgYXBwbGljYXRpb24gb2YgdGhpcyBmdW5jdGlvbi48L3NtYWxsPlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBMaXN0XG4gICAgICogQHNpZyBOdW1iZXIgLT4gW2FdIC0+IFthXSAtPiBbYV1cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gaW5kZXggVGhlIHBvc2l0aW9uIHRvIGluc2VydCB0aGUgc3ViLWxpc3RcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBlbHRzIFRoZSBzdWItbGlzdCB0byBpbnNlcnQgaW50byB0aGUgQXJyYXlcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBsaXN0IFRoZSBsaXN0IHRvIGluc2VydCB0aGUgc3ViLWxpc3QgaW50b1xuICAgICAqIEByZXR1cm4ge0FycmF5fSBBIG5ldyBBcnJheSB3aXRoIGBlbHRzYCBpbnNlcnRlZCBzdGFydGluZyBhdCBgaW5kZXhgLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIFIuaW5zZXJ0QWxsKDIsIFsneCcsJ3knLCd6J10sIFsxLDIsMyw0XSk7IC8vPT4gWzEsMiwneCcsJ3knLCd6JywzLDRdXG4gICAgICovXG4gICAgdmFyIGluc2VydEFsbCA9IF9jdXJyeTMoZnVuY3Rpb24gaW5zZXJ0QWxsKGlkeCwgZWx0cywgbGlzdCkge1xuICAgICAgICBpZHggPSBpZHggPCBsaXN0Lmxlbmd0aCAmJiBpZHggPj0gMCA/IGlkeCA6IGxpc3QubGVuZ3RoO1xuICAgICAgICByZXR1cm4gX2NvbmNhdChfY29uY2F0KF9zbGljZShsaXN0LCAwLCBpZHgpLCBlbHRzKSwgX3NsaWNlKGxpc3QsIGlkeCkpO1xuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogU2VlIGlmIGFuIG9iamVjdCAoYHZhbGApIGlzIGFuIGluc3RhbmNlIG9mIHRoZSBzdXBwbGllZCBjb25zdHJ1Y3Rvci5cbiAgICAgKiBUaGlzIGZ1bmN0aW9uIHdpbGwgY2hlY2sgdXAgdGhlIGluaGVyaXRhbmNlIGNoYWluLCBpZiBhbnkuXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IFR5cGVcbiAgICAgKiBAc2lnICgqIC0+IHsqfSkgLT4gYSAtPiBCb29sZWFuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGN0b3IgQSBjb25zdHJ1Y3RvclxuICAgICAqIEBwYXJhbSB7Kn0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gICAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICBSLmlzKE9iamVjdCwge30pOyAvLz0+IHRydWVcbiAgICAgKiAgICAgIFIuaXMoTnVtYmVyLCAxKTsgLy89PiB0cnVlXG4gICAgICogICAgICBSLmlzKE9iamVjdCwgMSk7IC8vPT4gZmFsc2VcbiAgICAgKiAgICAgIFIuaXMoU3RyaW5nLCAncycpOyAvLz0+IHRydWVcbiAgICAgKiAgICAgIFIuaXMoU3RyaW5nLCBuZXcgU3RyaW5nKCcnKSk7IC8vPT4gdHJ1ZVxuICAgICAqICAgICAgUi5pcyhPYmplY3QsIG5ldyBTdHJpbmcoJycpKTsgLy89PiB0cnVlXG4gICAgICogICAgICBSLmlzKE9iamVjdCwgJ3MnKTsgLy89PiBmYWxzZVxuICAgICAqICAgICAgUi5pcyhOdW1iZXIsIHt9KTsgLy89PiBmYWxzZVxuICAgICAqL1xuICAgIHZhciBpcyA9IF9jdXJyeTIoZnVuY3Rpb24gaXMoQ3RvciwgdmFsKSB7XG4gICAgICAgIHJldHVybiB2YWwgIT0gbnVsbCAmJiB2YWwuY29uc3RydWN0b3IgPT09IEN0b3IgfHwgdmFsIGluc3RhbmNlb2YgQ3RvcjtcbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIFRlc3RzIHdoZXRoZXIgb3Igbm90IGFuIG9iamVjdCBpcyBzaW1pbGFyIHRvIGFuIGFycmF5LlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBUeXBlXG4gICAgICogQGNhdGVnb3J5IExpc3RcbiAgICAgKiBAc2lnICogLT4gQm9vbGVhblxuICAgICAqIEBwYXJhbSB7Kn0geCBUaGUgb2JqZWN0IHRvIHRlc3QuXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn0gYHRydWVgIGlmIGB4YCBoYXMgYSBudW1lcmljIGxlbmd0aCBwcm9wZXJ0eSBhbmQgZXh0cmVtZSBpbmRpY2VzIGRlZmluZWQ7IGBmYWxzZWAgb3RoZXJ3aXNlLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIFIuaXNBcnJheUxpa2UoW10pOyAvLz0+IHRydWVcbiAgICAgKiAgICAgIFIuaXNBcnJheUxpa2UodHJ1ZSk7IC8vPT4gZmFsc2VcbiAgICAgKiAgICAgIFIuaXNBcnJheUxpa2Uoe30pOyAvLz0+IGZhbHNlXG4gICAgICogICAgICBSLmlzQXJyYXlMaWtlKHtsZW5ndGg6IDEwfSk7IC8vPT4gZmFsc2VcbiAgICAgKiAgICAgIFIuaXNBcnJheUxpa2UoezA6ICd6ZXJvJywgOTogJ25pbmUnLCBsZW5ndGg6IDEwfSk7IC8vPT4gdHJ1ZVxuICAgICAqL1xuICAgIHZhciBpc0FycmF5TGlrZSA9IF9jdXJyeTEoZnVuY3Rpb24gaXNBcnJheUxpa2UoeCkge1xuICAgICAgICBpZiAoX2lzQXJyYXkoeCkpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmICgheCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgeCAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoeCBpbnN0YW5jZW9mIFN0cmluZykge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmICh4Lm5vZGVUeXBlID09PSAxKSB7XG4gICAgICAgICAgICByZXR1cm4gISF4Lmxlbmd0aDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoeC5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmICh4Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHJldHVybiB4Lmhhc093blByb3BlcnR5KDApICYmIHguaGFzT3duUHJvcGVydHkoeC5sZW5ndGggLSAxKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBSZXBvcnRzIHdoZXRoZXIgdGhlIGxpc3QgaGFzIHplcm8gZWxlbWVudHMuXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IExvZ2ljXG4gICAgICogQHNpZyBbYV0gLT4gQm9vbGVhblxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGxpc3RcbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIFIuaXNFbXB0eShbMSwgMiwgM10pOyAgIC8vPT4gZmFsc2VcbiAgICAgKiAgICAgIFIuaXNFbXB0eShbXSk7ICAgICAgICAgIC8vPT4gdHJ1ZVxuICAgICAqICAgICAgUi5pc0VtcHR5KCcnKTsgICAgICAgICAgLy89PiB0cnVlXG4gICAgICogICAgICBSLmlzRW1wdHkobnVsbCk7ICAgICAgICAvLz0+IGZhbHNlXG4gICAgICogICAgICBSLmlzRW1wdHkoUi5rZXlzKHt9KSk7ICAvLz0+IHRydWVcbiAgICAgKiAgICAgIFIuaXNFbXB0eSh7fSk7ICAgICAgICAgIC8vPT4gZmFsc2UgKHt9IGRvZXMgbm90IGhhdmUgYSBsZW5ndGggcHJvcGVydHkpXG4gICAgICogICAgICBSLmlzRW1wdHkoe2xlbmd0aDogMH0pOyAvLz0+IHRydWVcbiAgICAgKi9cbiAgICB2YXIgaXNFbXB0eSA9IF9jdXJyeTEoZnVuY3Rpb24gaXNFbXB0eShsaXN0KSB7XG4gICAgICAgIHJldHVybiBPYmplY3QobGlzdCkubGVuZ3RoID09PSAwO1xuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogQ2hlY2tzIGlmIHRoZSBpbnB1dCB2YWx1ZSBpcyBgbnVsbGAgb3IgYHVuZGVmaW5lZGAuXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IFR5cGVcbiAgICAgKiBAc2lnICogLT4gQm9vbGVhblxuICAgICAqIEBwYXJhbSB7Kn0geCBUaGUgdmFsdWUgdG8gdGVzdC5cbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufSBgdHJ1ZWAgaWYgYHhgIGlzIGB1bmRlZmluZWRgIG9yIGBudWxsYCwgb3RoZXJ3aXNlIGBmYWxzZWAuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgUi5pc05pbChudWxsKTsgLy89PiB0cnVlXG4gICAgICogICAgICBSLmlzTmlsKHVuZGVmaW5lZCk7IC8vPT4gdHJ1ZVxuICAgICAqICAgICAgUi5pc05pbCgwKTsgLy89PiBmYWxzZVxuICAgICAqICAgICAgUi5pc05pbChbXSk7IC8vPT4gZmFsc2VcbiAgICAgKi9cbiAgICB2YXIgaXNOaWwgPSBfY3VycnkxKGZ1bmN0aW9uIGlzTmlsKHgpIHtcbiAgICAgICAgcmV0dXJuIHggPT0gbnVsbDtcbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYSBsaXN0IGNvbnRhaW5pbmcgdGhlIG5hbWVzIG9mIGFsbCB0aGUgZW51bWVyYWJsZSBvd25cbiAgICAgKiBwcm9wZXJ0aWVzIG9mIHRoZSBzdXBwbGllZCBvYmplY3QuXG4gICAgICogTm90ZSB0aGF0IHRoZSBvcmRlciBvZiB0aGUgb3V0cHV0IGFycmF5IGlzIG5vdCBndWFyYW50ZWVkIHRvIGJlXG4gICAgICogY29uc2lzdGVudCBhY3Jvc3MgZGlmZmVyZW50IEpTIHBsYXRmb3Jtcy5cbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgT2JqZWN0XG4gICAgICogQHNpZyB7azogdn0gLT4gW2tdXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9iaiBUaGUgb2JqZWN0IHRvIGV4dHJhY3QgcHJvcGVydGllcyBmcm9tXG4gICAgICogQHJldHVybiB7QXJyYXl9IEFuIGFycmF5IG9mIHRoZSBvYmplY3QncyBvd24gcHJvcGVydGllcy5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICBSLmtleXMoe2E6IDEsIGI6IDIsIGM6IDN9KTsgLy89PiBbJ2EnLCAnYicsICdjJ11cbiAgICAgKi9cbiAgICAvLyBjb3ZlciBJRSA8IDkga2V5cyBpc3N1ZXNcbiAgICB2YXIga2V5cyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gY292ZXIgSUUgPCA5IGtleXMgaXNzdWVzXG4gICAgICAgIHZhciBoYXNFbnVtQnVnID0gIXsgdG9TdHJpbmc6IG51bGwgfS5wcm9wZXJ0eUlzRW51bWVyYWJsZSgndG9TdHJpbmcnKTtcbiAgICAgICAgdmFyIG5vbkVudW1lcmFibGVQcm9wcyA9IFtcbiAgICAgICAgICAgICdjb25zdHJ1Y3RvcicsXG4gICAgICAgICAgICAndmFsdWVPZicsXG4gICAgICAgICAgICAnaXNQcm90b3R5cGVPZicsXG4gICAgICAgICAgICAndG9TdHJpbmcnLFxuICAgICAgICAgICAgJ3Byb3BlcnR5SXNFbnVtZXJhYmxlJyxcbiAgICAgICAgICAgICdoYXNPd25Qcm9wZXJ0eScsXG4gICAgICAgICAgICAndG9Mb2NhbGVTdHJpbmcnXG4gICAgICAgIF07XG4gICAgICAgIHZhciBjb250YWlucyA9IGZ1bmN0aW9uIGNvbnRhaW5zKGxpc3QsIGl0ZW0pIHtcbiAgICAgICAgICAgIHZhciBpZHggPSAwO1xuICAgICAgICAgICAgd2hpbGUgKGlkeCA8IGxpc3QubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgaWYgKGxpc3RbaWR4XSA9PT0gaXRlbSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWR4ICs9IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiB0eXBlb2YgT2JqZWN0LmtleXMgPT09ICdmdW5jdGlvbicgPyBfY3VycnkxKGZ1bmN0aW9uIGtleXMob2JqKSB7XG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0KG9iaikgIT09IG9iaiA/IFtdIDogT2JqZWN0LmtleXMob2JqKTtcbiAgICAgICAgfSkgOiBfY3VycnkxKGZ1bmN0aW9uIGtleXMob2JqKSB7XG4gICAgICAgICAgICBpZiAoT2JqZWN0KG9iaikgIT09IG9iaikge1xuICAgICAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBwcm9wLCBrcyA9IFtdLCBuSWR4O1xuICAgICAgICAgICAgZm9yIChwcm9wIGluIG9iaikge1xuICAgICAgICAgICAgICAgIGlmIChfaGFzKHByb3AsIG9iaikpIHtcbiAgICAgICAgICAgICAgICAgICAga3Nba3MubGVuZ3RoXSA9IHByb3A7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGhhc0VudW1CdWcpIHtcbiAgICAgICAgICAgICAgICBuSWR4ID0gbm9uRW51bWVyYWJsZVByb3BzLmxlbmd0aCAtIDE7XG4gICAgICAgICAgICAgICAgd2hpbGUgKG5JZHggPj0gMCkge1xuICAgICAgICAgICAgICAgICAgICBwcm9wID0gbm9uRW51bWVyYWJsZVByb3BzW25JZHhdO1xuICAgICAgICAgICAgICAgICAgICBpZiAoX2hhcyhwcm9wLCBvYmopICYmICFjb250YWlucyhrcywgcHJvcCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGtzW2tzLmxlbmd0aF0gPSBwcm9wO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIG5JZHggLT0gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4ga3M7XG4gICAgICAgIH0pO1xuICAgIH0oKTtcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYSBsaXN0IGNvbnRhaW5pbmcgdGhlIG5hbWVzIG9mIGFsbCB0aGVcbiAgICAgKiBwcm9wZXJ0aWVzIG9mIHRoZSBzdXBwbGllZCBvYmplY3QsIGluY2x1ZGluZyBwcm90b3R5cGUgcHJvcGVydGllcy5cbiAgICAgKiBOb3RlIHRoYXQgdGhlIG9yZGVyIG9mIHRoZSBvdXRwdXQgYXJyYXkgaXMgbm90IGd1YXJhbnRlZWQgdG8gYmVcbiAgICAgKiBjb25zaXN0ZW50IGFjcm9zcyBkaWZmZXJlbnQgSlMgcGxhdGZvcm1zLlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBPYmplY3RcbiAgICAgKiBAc2lnIHtrOiB2fSAtPiBba11cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb2JqIFRoZSBvYmplY3QgdG8gZXh0cmFjdCBwcm9wZXJ0aWVzIGZyb21cbiAgICAgKiBAcmV0dXJuIHtBcnJheX0gQW4gYXJyYXkgb2YgdGhlIG9iamVjdCdzIG93biBhbmQgcHJvdG90eXBlIHByb3BlcnRpZXMuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgdmFyIEYgPSBmdW5jdGlvbigpIHsgdGhpcy54ID0gJ1gnOyB9O1xuICAgICAqICAgICAgRi5wcm90b3R5cGUueSA9ICdZJztcbiAgICAgKiAgICAgIHZhciBmID0gbmV3IEYoKTtcbiAgICAgKiAgICAgIFIua2V5c0luKGYpOyAvLz0+IFsneCcsICd5J11cbiAgICAgKi9cbiAgICB2YXIga2V5c0luID0gX2N1cnJ5MShmdW5jdGlvbiBrZXlzSW4ob2JqKSB7XG4gICAgICAgIHZhciBwcm9wLCBrcyA9IFtdO1xuICAgICAgICBmb3IgKHByb3AgaW4gb2JqKSB7XG4gICAgICAgICAgICBrc1trcy5sZW5ndGhdID0gcHJvcDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ga3M7XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBudW1iZXIgb2YgZWxlbWVudHMgaW4gdGhlIGFycmF5IGJ5IHJldHVybmluZyBgbGlzdC5sZW5ndGhgLlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBMaXN0XG4gICAgICogQHNpZyBbYV0gLT4gTnVtYmVyXG4gICAgICogQHBhcmFtIHtBcnJheX0gbGlzdCBUaGUgYXJyYXkgdG8gaW5zcGVjdC5cbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9IFRoZSBsZW5ndGggb2YgdGhlIGFycmF5LlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIFIubGVuZ3RoKFtdKTsgLy89PiAwXG4gICAgICogICAgICBSLmxlbmd0aChbMSwgMiwgM10pOyAvLz0+IDNcbiAgICAgKi9cbiAgICB2YXIgbGVuZ3RoID0gX2N1cnJ5MShmdW5jdGlvbiBsZW5ndGgobGlzdCkge1xuICAgICAgICByZXR1cm4gbGlzdCAhPSBudWxsICYmIGlzKE51bWJlciwgbGlzdC5sZW5ndGgpID8gbGlzdC5sZW5ndGggOiBOYU47XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgbGVucy4gU3VwcGx5IGEgZnVuY3Rpb24gdG8gYGdldGAgdmFsdWVzIGZyb20gaW5zaWRlIGFuIG9iamVjdCwgYW5kIGEgYHNldGBcbiAgICAgKiBmdW5jdGlvbiB0byBjaGFuZ2UgdmFsdWVzIG9uIGFuIG9iamVjdC4gKG4uYi46IFRoaXMgY2FuLCBhbmQgc2hvdWxkLCBiZSBkb25lIHdpdGhvdXRcbiAgICAgKiBtdXRhdGluZyB0aGUgb3JpZ2luYWwgb2JqZWN0ISkgVGhlIGxlbnMgaXMgYSBmdW5jdGlvbiB3cmFwcGVkIGFyb3VuZCB0aGUgaW5wdXQgYGdldGBcbiAgICAgKiBmdW5jdGlvbiwgd2l0aCB0aGUgYHNldGAgZnVuY3Rpb24gYXR0YWNoZWQgYXMgYSBwcm9wZXJ0eSBvbiB0aGUgd3JhcHBlci4gQSBgbWFwYFxuICAgICAqIGZ1bmN0aW9uIGlzIGFsc28gYXR0YWNoZWQgdG8gdGhlIHJldHVybmVkIGZ1bmN0aW9uIHRoYXQgdGFrZXMgYSBmdW5jdGlvbiB0byBvcGVyYXRlXG4gICAgICogb24gdGhlIHNwZWNpZmllZCAoYGdldGApIHByb3BlcnR5LCB3aGljaCBpcyB0aGVuIGBzZXRgIGJlZm9yZSByZXR1cm5pbmcuIFRoZSBhdHRhY2hlZFxuICAgICAqIGBzZXRgIGFuZCBgbWFwYCBmdW5jdGlvbnMgYXJlIGN1cnJpZWQuXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IE9iamVjdFxuICAgICAqIEBzaWcgKGsgLT4gdikgLT4gKHYgLT4gYSAtPiAqKSAtPiAoYSAtPiBiKVxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGdldCBBIGZ1bmN0aW9uIHRoYXQgZ2V0cyBhIHZhbHVlIGJ5IHByb3BlcnR5IG5hbWVcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBzZXQgQSBmdW5jdGlvbiB0aGF0IHNldHMgYSB2YWx1ZSBieSBwcm9wZXJ0eSBuYW1lXG4gICAgICogQHJldHVybiB7RnVuY3Rpb259IHRoZSByZXR1cm5lZCBmdW5jdGlvbiBoYXMgYHNldGAgYW5kIGBtYXBgIHByb3BlcnRpZXMgdGhhdCBhcmVcbiAgICAgKiAgICAgICAgIGFsc28gY3VycmllZCBmdW5jdGlvbnMuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgdmFyIGhlYWRMZW5zID0gUi5sZW5zKFxuICAgICAqICAgICAgICBmdW5jdGlvbiBnZXQoYXJyKSB7IHJldHVybiBhcnJbMF07IH0sXG4gICAgICogICAgICAgIGZ1bmN0aW9uIHNldCh2YWwsIGFycikgeyByZXR1cm4gW3ZhbF0uY29uY2F0KGFyci5zbGljZSgxKSk7IH1cbiAgICAgKiAgICAgICk7XG4gICAgICogICAgICBoZWFkTGVucyhbMTAsIDIwLCAzMCwgNDBdKTsgLy89PiAxMFxuICAgICAqICAgICAgaGVhZExlbnMuc2V0KCdtdScsIFsxMCwgMjAsIDMwLCA0MF0pOyAvLz0+IFsnbXUnLCAyMCwgMzAsIDQwXVxuICAgICAqICAgICAgaGVhZExlbnMubWFwKGZ1bmN0aW9uKHgpIHsgcmV0dXJuIHggKyAxOyB9LCBbMTAsIDIwLCAzMCwgNDBdKTsgLy89PiBbMTEsIDIwLCAzMCwgNDBdXG4gICAgICpcbiAgICAgKiAgICAgIHZhciBwaHJhc2VMZW5zID0gUi5sZW5zKFxuICAgICAqICAgICAgICBmdW5jdGlvbiBnZXQob2JqKSB7IHJldHVybiBvYmoucGhyYXNlOyB9LFxuICAgICAqICAgICAgICBmdW5jdGlvbiBzZXQodmFsLCBvYmopIHtcbiAgICAgKiAgICAgICAgICB2YXIgb3V0ID0gUi5jbG9uZShvYmopO1xuICAgICAqICAgICAgICAgIG91dC5waHJhc2UgPSB2YWw7XG4gICAgICogICAgICAgICAgcmV0dXJuIG91dDtcbiAgICAgKiAgICAgICAgfVxuICAgICAqICAgICAgKTtcbiAgICAgKiAgICAgIHZhciBvYmoxID0geyBwaHJhc2U6ICdBYnNvbHV0ZSBmaWx0aCAuIC4gLiBhbmQgSSBMT1ZFRCBpdCEnfTtcbiAgICAgKiAgICAgIHZhciBvYmoyID0geyBwaHJhc2U6IFwiV2hhdCdzIGFsbCB0aGlzLCB0aGVuP1wifTtcbiAgICAgKiAgICAgIHBocmFzZUxlbnMob2JqMSk7IC8vID0+ICdBYnNvbHV0ZSBmaWx0aCAuIC4gLiBhbmQgSSBMT1ZFRCBpdCEnXG4gICAgICogICAgICBwaHJhc2VMZW5zKG9iajIpOyAvLyA9PiBcIldoYXQncyBhbGwgdGhpcywgdGhlbj9cIlxuICAgICAqICAgICAgcGhyYXNlTGVucy5zZXQoJ09vaCBCZXR0eScsIG9iajEpOyAvLz0+IHsgcGhyYXNlOiAnT29oIEJldHR5J31cbiAgICAgKiAgICAgIHBocmFzZUxlbnMubWFwKFIudG9VcHBlciwgb2JqMik7IC8vPT4geyBwaHJhc2U6IFwiV0hBVCdTIEFMTCBUSElTLCBUSEVOP1wifVxuICAgICAqL1xuICAgIHZhciBsZW5zID0gX2N1cnJ5MihmdW5jdGlvbiBsZW5zKGdldCwgc2V0KSB7XG4gICAgICAgIHZhciBsbnMgPSBmdW5jdGlvbiAoYSkge1xuICAgICAgICAgICAgcmV0dXJuIGdldChhKTtcbiAgICAgICAgfTtcbiAgICAgICAgbG5zLnNldCA9IF9jdXJyeTIoc2V0KTtcbiAgICAgICAgbG5zLm1hcCA9IF9jdXJyeTIoZnVuY3Rpb24gKGZuLCBhKSB7XG4gICAgICAgICAgICByZXR1cm4gc2V0KGZuKGdldChhKSksIGEpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGxucztcbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYSBsZW5zIGFzc29jaWF0ZWQgd2l0aCB0aGUgcHJvdmlkZWQgb2JqZWN0LlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBPYmplY3RcbiAgICAgKiBAc2lnICh7fSAtPiB2KSAtPiAodiAtPiBhIC0+ICopIC0+IHt9IC0+IChhIC0+IGIpXG4gICAgICogQHNlZSBSLmxlbnNcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBnZXQgQSBmdW5jdGlvbiB0aGF0IGdldHMgYSB2YWx1ZSBieSBwcm9wZXJ0eSBuYW1lXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gc2V0IEEgZnVuY3Rpb24gdGhhdCBzZXRzIGEgdmFsdWUgYnkgcHJvcGVydHkgbmFtZVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSB0aGUgYWN0dWFsIG9iamVjdCBvZiBpbnRlcmVzdFxuICAgICAqIEByZXR1cm4ge0Z1bmN0aW9ufSB0aGUgcmV0dXJuZWQgZnVuY3Rpb24gaGFzIGBzZXRgIGFuZCBgbWFwYCBwcm9wZXJ0aWVzIHRoYXQgYXJlXG4gICAgICogICAgICAgICBhbHNvIGN1cnJpZWQgZnVuY3Rpb25zLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIHZhciB4byA9IHt4OiAxfTtcbiAgICAgKiAgICAgIHZhciB4b0xlbnMgPSBSLmxlbnNPbihmdW5jdGlvbiBnZXQobykgeyByZXR1cm4gby54OyB9LFxuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIHNldCh2KSB7IHJldHVybiB7eDogdn07IH0sXG4gICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgeG8pO1xuICAgICAqICAgICAgeG9MZW5zKCk7IC8vPT4gMVxuICAgICAqICAgICAgeG9MZW5zLnNldCgxMDAwKTsgLy89PiB7eDogMTAwMH1cbiAgICAgKiAgICAgIHhvTGVucy5tYXAoUi5hZGQoMSkpOyAvLz0+IHt4OiAyfVxuICAgICAqL1xuICAgIHZhciBsZW5zT24gPSBfY3VycnkzKGZ1bmN0aW9uIGxlbnNPbihnZXQsIHNldCwgb2JqKSB7XG4gICAgICAgIHZhciBsbnMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gZ2V0KG9iaik7XG4gICAgICAgIH07XG4gICAgICAgIGxucy5zZXQgPSBzZXQ7XG4gICAgICAgIGxucy5tYXAgPSBmdW5jdGlvbiAoZm4pIHtcbiAgICAgICAgICAgIHJldHVybiBzZXQoZm4oZ2V0KG9iaikpKTtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIGxucztcbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgZmlyc3QgcGFyYW1ldGVyIGlzIGxlc3MgdGhhbiB0aGUgc2Vjb25kLlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBNYXRoXG4gICAgICogQHNpZyBOdW1iZXIgLT4gTnVtYmVyIC0+IEJvb2xlYW5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gYVxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBiXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn0gYSA8IGJcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICBSLmx0KDIsIDYpOyAvLz0+IHRydWVcbiAgICAgKiAgICAgIFIubHQoMiwgMCk7IC8vPT4gZmFsc2VcbiAgICAgKiAgICAgIFIubHQoMiwgMik7IC8vPT4gZmFsc2VcbiAgICAgKiAgICAgIFIubHQoNSkoMTApOyAvLz0+IHRydWVcbiAgICAgKiAgICAgIFIubHQoUi5fXywgNSkoMTApOyAvLz0+IGZhbHNlIC8vIHJpZ2h0LXNlY3Rpb25lZCBjdXJyeWluZ1xuICAgICAqL1xuICAgIHZhciBsdCA9IF9jdXJyeTIoX2x0KTtcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgZmlyc3QgcGFyYW1ldGVyIGlzIGxlc3MgdGhhbiBvciBlcXVhbCB0byB0aGUgc2Vjb25kLlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBNYXRoXG4gICAgICogQHNpZyBOdW1iZXIgLT4gTnVtYmVyIC0+IEJvb2xlYW5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gYVxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBiXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn0gYSA8PSBiXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgUi5sdGUoMiwgNik7IC8vPT4gdHJ1ZVxuICAgICAqICAgICAgUi5sdGUoMiwgMCk7IC8vPT4gZmFsc2VcbiAgICAgKiAgICAgIFIubHRlKDIsIDIpOyAvLz0+IHRydWVcbiAgICAgKiAgICAgIFIubHRlKFIuX18sIDIpKDEpOyAvLz0+IHRydWVcbiAgICAgKiAgICAgIFIubHRlKDIpKDEwKTsgLy89PiB0cnVlXG4gICAgICovXG4gICAgdmFyIGx0ZSA9IF9jdXJyeTIoZnVuY3Rpb24gbHRlKGEsIGIpIHtcbiAgICAgICAgcmV0dXJuIGEgPD0gYjtcbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBtYXBBY2N1bSBmdW5jdGlvbiBiZWhhdmVzIGxpa2UgYSBjb21iaW5hdGlvbiBvZiBtYXAgYW5kIHJlZHVjZTsgaXQgYXBwbGllcyBhXG4gICAgICogZnVuY3Rpb24gdG8gZWFjaCBlbGVtZW50IG9mIGEgbGlzdCwgcGFzc2luZyBhbiBhY2N1bXVsYXRpbmcgcGFyYW1ldGVyIGZyb20gbGVmdCB0b1xuICAgICAqIHJpZ2h0LCBhbmQgcmV0dXJuaW5nIGEgZmluYWwgdmFsdWUgb2YgdGhpcyBhY2N1bXVsYXRvciB0b2dldGhlciB3aXRoIHRoZSBuZXcgbGlzdC5cbiAgICAgKlxuICAgICAqIFRoZSBpdGVyYXRvciBmdW5jdGlvbiByZWNlaXZlcyB0d28gYXJndW1lbnRzLCAqYWNjKiBhbmQgKnZhbHVlKiwgYW5kIHNob3VsZCByZXR1cm5cbiAgICAgKiBhIHR1cGxlICpbYWNjLCB2YWx1ZV0qLlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBMaXN0XG4gICAgICogQHNpZyAoYWNjIC0+IHggLT4gKGFjYywgeSkpIC0+IGFjYyAtPiBbeF0gLT4gKGFjYywgW3ldKVxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBmdW5jdGlvbiB0byBiZSBjYWxsZWQgb24gZXZlcnkgZWxlbWVudCBvZiB0aGUgaW5wdXQgYGxpc3RgLlxuICAgICAqIEBwYXJhbSB7Kn0gYWNjIFRoZSBhY2N1bXVsYXRvciB2YWx1ZS5cbiAgICAgKiBAcGFyYW0ge0FycmF5fSBsaXN0IFRoZSBsaXN0IHRvIGl0ZXJhdGUgb3Zlci5cbiAgICAgKiBAcmV0dXJuIHsqfSBUaGUgZmluYWwsIGFjY3VtdWxhdGVkIHZhbHVlLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIHZhciBkaWdpdHMgPSBbJzEnLCAnMicsICczJywgJzQnXTtcbiAgICAgKiAgICAgIHZhciBhcHBlbmQgPSBmdW5jdGlvbihhLCBiKSB7XG4gICAgICogICAgICAgIHJldHVybiBbYSArIGIsIGEgKyBiXTtcbiAgICAgKiAgICAgIH1cbiAgICAgKlxuICAgICAqICAgICAgUi5tYXBBY2N1bShhcHBlbmQsIDAsIGRpZ2l0cyk7IC8vPT4gWycwMTIzNCcsIFsnMDEnLCAnMDEyJywgJzAxMjMnLCAnMDEyMzQnXV1cbiAgICAgKi9cbiAgICB2YXIgbWFwQWNjdW0gPSBfY3VycnkzKGZ1bmN0aW9uIG1hcEFjY3VtKGZuLCBhY2MsIGxpc3QpIHtcbiAgICAgICAgdmFyIGlkeCA9IDAsIGxlbiA9IGxpc3QubGVuZ3RoLCByZXN1bHQgPSBbXSwgdHVwbGUgPSBbYWNjXTtcbiAgICAgICAgd2hpbGUgKGlkeCA8IGxlbikge1xuICAgICAgICAgICAgdHVwbGUgPSBmbih0dXBsZVswXSwgbGlzdFtpZHhdKTtcbiAgICAgICAgICAgIHJlc3VsdFtpZHhdID0gdHVwbGVbMV07XG4gICAgICAgICAgICBpZHggKz0gMTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgdHVwbGVbMF0sXG4gICAgICAgICAgICByZXN1bHRcbiAgICAgICAgXTtcbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBtYXBBY2N1bVJpZ2h0IGZ1bmN0aW9uIGJlaGF2ZXMgbGlrZSBhIGNvbWJpbmF0aW9uIG9mIG1hcCBhbmQgcmVkdWNlOyBpdCBhcHBsaWVzIGFcbiAgICAgKiBmdW5jdGlvbiB0byBlYWNoIGVsZW1lbnQgb2YgYSBsaXN0LCBwYXNzaW5nIGFuIGFjY3VtdWxhdGluZyBwYXJhbWV0ZXIgZnJvbSByaWdodFxuICAgICAqIHRvIGxlZnQsIGFuZCByZXR1cm5pbmcgYSBmaW5hbCB2YWx1ZSBvZiB0aGlzIGFjY3VtdWxhdG9yIHRvZ2V0aGVyIHdpdGggdGhlIG5ldyBsaXN0LlxuICAgICAqXG4gICAgICogU2ltaWxhciB0byBgbWFwQWNjdW1gLCBleGNlcHQgbW92ZXMgdGhyb3VnaCB0aGUgaW5wdXQgbGlzdCBmcm9tIHRoZSByaWdodCB0byB0aGVcbiAgICAgKiBsZWZ0LlxuICAgICAqXG4gICAgICogVGhlIGl0ZXJhdG9yIGZ1bmN0aW9uIHJlY2VpdmVzIHR3byBhcmd1bWVudHMsICphY2MqIGFuZCAqdmFsdWUqLCBhbmQgc2hvdWxkIHJldHVyblxuICAgICAqIGEgdHVwbGUgKlthY2MsIHZhbHVlXSouXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IExpc3RcbiAgICAgKiBAc2lnIChhY2MgLT4geCAtPiAoYWNjLCB5KSkgLT4gYWNjIC0+IFt4XSAtPiAoYWNjLCBbeV0pXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGZ1bmN0aW9uIHRvIGJlIGNhbGxlZCBvbiBldmVyeSBlbGVtZW50IG9mIHRoZSBpbnB1dCBgbGlzdGAuXG4gICAgICogQHBhcmFtIHsqfSBhY2MgVGhlIGFjY3VtdWxhdG9yIHZhbHVlLlxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGxpc3QgVGhlIGxpc3QgdG8gaXRlcmF0ZSBvdmVyLlxuICAgICAqIEByZXR1cm4geyp9IFRoZSBmaW5hbCwgYWNjdW11bGF0ZWQgdmFsdWUuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgdmFyIGRpZ2l0cyA9IFsnMScsICcyJywgJzMnLCAnNCddO1xuICAgICAqICAgICAgdmFyIGFwcGVuZCA9IGZ1bmN0aW9uKGEsIGIpIHtcbiAgICAgKiAgICAgICAgcmV0dXJuIFthICsgYiwgYSArIGJdO1xuICAgICAqICAgICAgfVxuICAgICAqXG4gICAgICogICAgICBSLm1hcEFjY3VtUmlnaHQoYXBwZW5kLCAwLCBkaWdpdHMpOyAvLz0+IFsnMDQzMjEnLCBbJzA0MzIxJywgJzA0MzInLCAnMDQzJywgJzA0J11dXG4gICAgICovXG4gICAgdmFyIG1hcEFjY3VtUmlnaHQgPSBfY3VycnkzKGZ1bmN0aW9uIG1hcEFjY3VtUmlnaHQoZm4sIGFjYywgbGlzdCkge1xuICAgICAgICB2YXIgaWR4ID0gbGlzdC5sZW5ndGggLSAxLCByZXN1bHQgPSBbXSwgdHVwbGUgPSBbYWNjXTtcbiAgICAgICAgd2hpbGUgKGlkeCA+PSAwKSB7XG4gICAgICAgICAgICB0dXBsZSA9IGZuKHR1cGxlWzBdLCBsaXN0W2lkeF0pO1xuICAgICAgICAgICAgcmVzdWx0W2lkeF0gPSB0dXBsZVsxXTtcbiAgICAgICAgICAgIGlkeCAtPSAxO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICB0dXBsZVswXSxcbiAgICAgICAgICAgIHJlc3VsdFxuICAgICAgICBdO1xuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogTGlrZSBgbWFwYCwgYnV0IGJ1dCBwYXNzZXMgYWRkaXRpb25hbCBwYXJhbWV0ZXJzIHRvIHRoZSBtYXBwaW5nIGZ1bmN0aW9uLlxuICAgICAqIGBmbmAgcmVjZWl2ZXMgdGhyZWUgYXJndW1lbnRzOiAqKHZhbHVlLCBpbmRleCwgbGlzdCkqLlxuICAgICAqXG4gICAgICogTm90ZTogYFIubWFwSW5kZXhlZGAgZG9lcyBub3Qgc2tpcCBkZWxldGVkIG9yIHVuYXNzaWduZWQgaW5kaWNlcyAoc3BhcnNlIGFycmF5cyksIHVubGlrZVxuICAgICAqIHRoZSBuYXRpdmUgYEFycmF5LnByb3RvdHlwZS5tYXBgIG1ldGhvZC4gRm9yIG1vcmUgZGV0YWlscyBvbiB0aGlzIGJlaGF2aW9yLCBzZWU6XG4gICAgICogaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvQXJyYXkvbWFwI0Rlc2NyaXB0aW9uXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IExpc3RcbiAgICAgKiBAc2lnIChhLGksW2JdIC0+IGIpIC0+IFthXSAtPiBbYl1cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgZnVuY3Rpb24gdG8gYmUgY2FsbGVkIG9uIGV2ZXJ5IGVsZW1lbnQgb2YgdGhlIGlucHV0IGBsaXN0YC5cbiAgICAgKiBAcGFyYW0ge0FycmF5fSBsaXN0IFRoZSBsaXN0IHRvIGJlIGl0ZXJhdGVkIG92ZXIuXG4gICAgICogQHJldHVybiB7QXJyYXl9IFRoZSBuZXcgbGlzdC5cbiAgICAgKiBAZGVwcmVjYXRlZCBzaW5jZSB2MC4xNS4wXG4gICAgICogQHNlZSBSLmFkZEluZGV4XG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgdmFyIHNxdWFyZUVuZHMgPSBmdW5jdGlvbihlbHQsIGlkeCwgbGlzdCkge1xuICAgICAqICAgICAgICBpZiAoaWR4ID09PSAwIHx8IGlkeCA9PT0gbGlzdC5sZW5ndGggLSAxKSB7XG4gICAgICogICAgICAgICAgcmV0dXJuIGVsdCAqIGVsdDtcbiAgICAgKiAgICAgICAgfVxuICAgICAqICAgICAgICByZXR1cm4gZWx0O1xuICAgICAqICAgICAgfTtcbiAgICAgKlxuICAgICAqICAgICAgUi5tYXBJbmRleGVkKHNxdWFyZUVuZHMsIFs4LCA1LCAzLCAwLCA5XSk7IC8vPT4gWzY0LCA1LCAzLCAwLCA4MV1cbiAgICAgKi9cbiAgICB2YXIgbWFwSW5kZXhlZCA9IF9jdXJyeTIoZnVuY3Rpb24gbWFwSW5kZXhlZChmbiwgbGlzdCkge1xuICAgICAgICB2YXIgaWR4ID0gMCwgbGVuID0gbGlzdC5sZW5ndGgsIHJlc3VsdCA9IFtdO1xuICAgICAgICB3aGlsZSAoaWR4IDwgbGVuKSB7XG4gICAgICAgICAgICByZXN1bHRbaWR4XSA9IGZuKGxpc3RbaWR4XSwgaWR4LCBsaXN0KTtcbiAgICAgICAgICAgIGlkeCArPSAxO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBtYXRoTW9kIGJlaGF2ZXMgbGlrZSB0aGUgbW9kdWxvIG9wZXJhdG9yIHNob3VsZCBtYXRoZW1hdGljYWxseSwgdW5saWtlIHRoZSBgJWBcbiAgICAgKiBvcGVyYXRvciAoYW5kIGJ5IGV4dGVuc2lvbiwgUi5tb2R1bG8pLiBTbyB3aGlsZSBcIi0xNyAlIDVcIiBpcyAtMixcbiAgICAgKiBtYXRoTW9kKC0xNywgNSkgaXMgMy4gbWF0aE1vZCByZXF1aXJlcyBJbnRlZ2VyIGFyZ3VtZW50cywgYW5kIHJldHVybnMgTmFOXG4gICAgICogd2hlbiB0aGUgbW9kdWx1cyBpcyB6ZXJvIG9yIG5lZ2F0aXZlLlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBNYXRoXG4gICAgICogQHNpZyBOdW1iZXIgLT4gTnVtYmVyIC0+IE51bWJlclxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBtIFRoZSBkaXZpZGVuZC5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gcCB0aGUgbW9kdWx1cy5cbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9IFRoZSByZXN1bHQgb2YgYGIgbW9kIGFgLlxuICAgICAqIEBzZWUgUi5tb2R1bG9CeVxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIFIubWF0aE1vZCgtMTcsIDUpOyAgLy89PiAzXG4gICAgICogICAgICBSLm1hdGhNb2QoMTcsIDUpOyAgIC8vPT4gMlxuICAgICAqICAgICAgUi5tYXRoTW9kKDE3LCAtNSk7ICAvLz0+IE5hTlxuICAgICAqICAgICAgUi5tYXRoTW9kKDE3LCAwKTsgICAvLz0+IE5hTlxuICAgICAqICAgICAgUi5tYXRoTW9kKDE3LjIsIDUpOyAvLz0+IE5hTlxuICAgICAqICAgICAgUi5tYXRoTW9kKDE3LCA1LjMpOyAvLz0+IE5hTlxuICAgICAqXG4gICAgICogICAgICB2YXIgY2xvY2sgPSBSLm1hdGhNb2QoUi5fXywgMTIpO1xuICAgICAqICAgICAgY2xvY2soMTUpOyAvLz0+IDNcbiAgICAgKiAgICAgIGNsb2NrKDI0KTsgLy89PiAwXG4gICAgICpcbiAgICAgKiAgICAgIHZhciBzZXZlbnRlZW5Nb2QgPSBSLm1hdGhNb2QoMTcpO1xuICAgICAqICAgICAgc2V2ZW50ZWVuTW9kKDMpOyAgLy89PiAyXG4gICAgICogICAgICBzZXZlbnRlZW5Nb2QoNCk7ICAvLz0+IDFcbiAgICAgKiAgICAgIHNldmVudGVlbk1vZCgxMCk7IC8vPT4gN1xuICAgICAqL1xuICAgIHZhciBtYXRoTW9kID0gX2N1cnJ5MihmdW5jdGlvbiBtYXRoTW9kKG0sIHApIHtcbiAgICAgICAgaWYgKCFfaXNJbnRlZ2VyKG0pKSB7XG4gICAgICAgICAgICByZXR1cm4gTmFOO1xuICAgICAgICB9XG4gICAgICAgIGlmICghX2lzSW50ZWdlcihwKSB8fCBwIDwgMSkge1xuICAgICAgICAgICAgcmV0dXJuIE5hTjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gKG0gJSBwICsgcCkgJSBwO1xuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogRGV0ZXJtaW5lcyB0aGUgbGFyZ2VzdCBvZiBhIGxpc3Qgb2YgaXRlbXMgYXMgZGV0ZXJtaW5lZCBieSBwYWlyd2lzZSBjb21wYXJpc29ucyBmcm9tIHRoZSBzdXBwbGllZCBjb21wYXJhdG9yLlxuICAgICAqIE5vdGUgdGhhdCB0aGlzIHdpbGwgcmV0dXJuIHVuZGVmaW5lZCBpZiBzdXBwbGllZCBhbiBlbXB0eSBsaXN0LlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBNYXRoXG4gICAgICogQHNpZyAoYSAtPiBOdW1iZXIpIC0+IFthXSAtPiBhXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0ga2V5Rm4gQSBjb21wYXJhdG9yIGZ1bmN0aW9uIGZvciBlbGVtZW50cyBpbiB0aGUgbGlzdFxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGxpc3QgQSBsaXN0IG9mIGNvbXBhcmFibGUgZWxlbWVudHNcbiAgICAgKiBAcmV0dXJuIHsqfSBUaGUgZ3JlYXRlc3QgZWxlbWVudCBpbiB0aGUgbGlzdC4gYHVuZGVmaW5lZGAgaWYgdGhlIGxpc3QgaXMgZW1wdHkuXG4gICAgICogQHNlZSBSLm1heFxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIGZ1bmN0aW9uIGNtcChvYmopIHsgcmV0dXJuIG9iai54OyB9XG4gICAgICogICAgICB2YXIgYSA9IHt4OiAxfSwgYiA9IHt4OiAyfSwgYyA9IHt4OiAzfTtcbiAgICAgKiAgICAgIFIubWF4QnkoY21wLCBbYSwgYiwgY10pOyAvLz0+IHt4OiAzfVxuICAgICAqL1xuICAgIHZhciBtYXhCeSA9IF9jdXJyeTIoX2NyZWF0ZU1heE1pbkJ5KF9ndCkpO1xuXG4gICAgLyoqXG4gICAgICogRGV0ZXJtaW5lcyB0aGUgc21hbGxlc3Qgb2YgYSBsaXN0IG9mIGl0ZW1zIGFzIGRldGVybWluZWQgYnkgcGFpcndpc2UgY29tcGFyaXNvbnMgZnJvbSB0aGUgc3VwcGxpZWQgY29tcGFyYXRvclxuICAgICAqIE5vdGUgdGhhdCB0aGlzIHdpbGwgcmV0dXJuIHVuZGVmaW5lZCBpZiBzdXBwbGllZCBhbiBlbXB0eSBsaXN0LlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBNYXRoXG4gICAgICogQHNpZyAoYSAtPiBOdW1iZXIpIC0+IFthXSAtPiBhXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0ga2V5Rm4gQSBjb21wYXJhdG9yIGZ1bmN0aW9uIGZvciBlbGVtZW50cyBpbiB0aGUgbGlzdFxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGxpc3QgQSBsaXN0IG9mIGNvbXBhcmFibGUgZWxlbWVudHNcbiAgICAgKiBAc2VlIFIubWluXG4gICAgICogQHJldHVybiB7Kn0gVGhlIGdyZWF0ZXN0IGVsZW1lbnQgaW4gdGhlIGxpc3QuIGB1bmRlZmluZWRgIGlmIHRoZSBsaXN0IGlzIGVtcHR5LlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIGZ1bmN0aW9uIGNtcChvYmopIHsgcmV0dXJuIG9iai54OyB9XG4gICAgICogICAgICB2YXIgYSA9IHt4OiAxfSwgYiA9IHt4OiAyfSwgYyA9IHt4OiAzfTtcbiAgICAgKiAgICAgIFIubWluQnkoY21wLCBbYSwgYiwgY10pOyAvLz0+IHt4OiAxfVxuICAgICAqL1xuICAgIHZhciBtaW5CeSA9IF9jdXJyeTIoX2NyZWF0ZU1heE1pbkJ5KF9sdCkpO1xuXG4gICAgLyoqXG4gICAgICogRGl2aWRlcyB0aGUgc2Vjb25kIHBhcmFtZXRlciBieSB0aGUgZmlyc3QgYW5kIHJldHVybnMgdGhlIHJlbWFpbmRlci5cbiAgICAgKiBOb3RlIHRoYXQgdGhpcyBmdW5jdGlvbnMgcHJlc2VydmVzIHRoZSBKYXZhU2NyaXB0LXN0eWxlIGJlaGF2aW9yIGZvclxuICAgICAqIG1vZHVsby4gRm9yIG1hdGhlbWF0aWNhbCBtb2R1bG8gc2VlIGBtYXRoTW9kYFxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBNYXRoXG4gICAgICogQHNpZyBOdW1iZXIgLT4gTnVtYmVyIC0+IE51bWJlclxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBhIFRoZSB2YWx1ZSB0byB0aGUgZGl2aWRlLlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBiIFRoZSBwc2V1ZG8tbW9kdWx1c1xuICAgICAqIEByZXR1cm4ge051bWJlcn0gVGhlIHJlc3VsdCBvZiBgYiAlIGFgLlxuICAgICAqIEBzZWUgUi5tYXRoTW9kXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgUi5tb2R1bG8oMTcsIDMpOyAvLz0+IDJcbiAgICAgKiAgICAgIC8vIEpTIGJlaGF2aW9yOlxuICAgICAqICAgICAgUi5tb2R1bG8oLTE3LCAzKTsgLy89PiAtMlxuICAgICAqICAgICAgUi5tb2R1bG8oMTcsIC0zKTsgLy89PiAyXG4gICAgICpcbiAgICAgKiAgICAgIHZhciBpc09kZCA9IFIubW9kdWxvKFIuX18sIDIpO1xuICAgICAqICAgICAgaXNPZGQoNDIpOyAvLz0+IDBcbiAgICAgKiAgICAgIGlzT2RkKDIxKTsgLy89PiAxXG4gICAgICovXG4gICAgdmFyIG1vZHVsbyA9IF9jdXJyeTIoZnVuY3Rpb24gbW9kdWxvKGEsIGIpIHtcbiAgICAgICAgcmV0dXJuIGEgJSBiO1xuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogTXVsdGlwbGllcyB0d28gbnVtYmVycy4gRXF1aXZhbGVudCB0byBgYSAqIGJgIGJ1dCBjdXJyaWVkLlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBNYXRoXG4gICAgICogQHNpZyBOdW1iZXIgLT4gTnVtYmVyIC0+IE51bWJlclxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBhIFRoZSBmaXJzdCB2YWx1ZS5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gYiBUaGUgc2Vjb25kIHZhbHVlLlxuICAgICAqIEByZXR1cm4ge051bWJlcn0gVGhlIHJlc3VsdCBvZiBgYSAqIGJgLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIHZhciBkb3VibGUgPSBSLm11bHRpcGx5KDIpO1xuICAgICAqICAgICAgdmFyIHRyaXBsZSA9IFIubXVsdGlwbHkoMyk7XG4gICAgICogICAgICBkb3VibGUoMyk7ICAgICAgIC8vPT4gIDZcbiAgICAgKiAgICAgIHRyaXBsZSg0KTsgICAgICAgLy89PiAxMlxuICAgICAqICAgICAgUi5tdWx0aXBseSgyLCA1KTsgIC8vPT4gMTBcbiAgICAgKi9cbiAgICB2YXIgbXVsdGlwbHkgPSBfY3VycnkyKF9tdWx0aXBseSk7XG5cbiAgICAvKipcbiAgICAgKiBXcmFwcyBhIGZ1bmN0aW9uIG9mIGFueSBhcml0eSAoaW5jbHVkaW5nIG51bGxhcnkpIGluIGEgZnVuY3Rpb24gdGhhdCBhY2NlcHRzIGV4YWN0bHkgYG5gXG4gICAgICogcGFyYW1ldGVycy4gQW55IGV4dHJhbmVvdXMgcGFyYW1ldGVycyB3aWxsIG5vdCBiZSBwYXNzZWQgdG8gdGhlIHN1cHBsaWVkIGZ1bmN0aW9uLlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBGdW5jdGlvblxuICAgICAqIEBzaWcgTnVtYmVyIC0+ICgqIC0+IGEpIC0+ICgqIC0+IGEpXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IG4gVGhlIGRlc2lyZWQgYXJpdHkgb2YgdGhlIG5ldyBmdW5jdGlvbi5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgZnVuY3Rpb24gdG8gd3JhcC5cbiAgICAgKiBAcmV0dXJuIHtGdW5jdGlvbn0gQSBuZXcgZnVuY3Rpb24gd3JhcHBpbmcgYGZuYC4gVGhlIG5ldyBmdW5jdGlvbiBpcyBndWFyYW50ZWVkIHRvIGJlIG9mXG4gICAgICogICAgICAgICBhcml0eSBgbmAuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgdmFyIHRha2VzVHdvQXJncyA9IGZ1bmN0aW9uKGEsIGIpIHtcbiAgICAgKiAgICAgICAgcmV0dXJuIFthLCBiXTtcbiAgICAgKiAgICAgIH07XG4gICAgICogICAgICB0YWtlc1R3b0FyZ3MubGVuZ3RoOyAvLz0+IDJcbiAgICAgKiAgICAgIHRha2VzVHdvQXJncygxLCAyKTsgLy89PiBbMSwgMl1cbiAgICAgKlxuICAgICAqICAgICAgdmFyIHRha2VzT25lQXJnID0gUi5uQXJ5KDEsIHRha2VzVHdvQXJncyk7XG4gICAgICogICAgICB0YWtlc09uZUFyZy5sZW5ndGg7IC8vPT4gMVxuICAgICAqICAgICAgLy8gT25seSBgbmAgYXJndW1lbnRzIGFyZSBwYXNzZWQgdG8gdGhlIHdyYXBwZWQgZnVuY3Rpb25cbiAgICAgKiAgICAgIHRha2VzT25lQXJnKDEsIDIpOyAvLz0+IFsxLCB1bmRlZmluZWRdXG4gICAgICovXG4gICAgdmFyIG5BcnkgPSBfY3VycnkyKGZ1bmN0aW9uIChuLCBmbikge1xuICAgICAgICBzd2l0Y2ggKG4pIHtcbiAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZm4uY2FsbCh0aGlzKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoYTApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZm4uY2FsbCh0aGlzLCBhMCk7XG4gICAgICAgICAgICB9O1xuICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGEwLCBhMSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmbi5jYWxsKHRoaXMsIGEwLCBhMSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGEwLCBhMSwgYTIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZm4uY2FsbCh0aGlzLCBhMCwgYTEsIGEyKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIGNhc2UgNDpcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoYTAsIGExLCBhMiwgYTMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZm4uY2FsbCh0aGlzLCBhMCwgYTEsIGEyLCBhMyk7XG4gICAgICAgICAgICB9O1xuICAgICAgICBjYXNlIDU6XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGEwLCBhMSwgYTIsIGEzLCBhNCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmbi5jYWxsKHRoaXMsIGEwLCBhMSwgYTIsIGEzLCBhNCk7XG4gICAgICAgICAgICB9O1xuICAgICAgICBjYXNlIDY6XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGEwLCBhMSwgYTIsIGEzLCBhNCwgYTUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZm4uY2FsbCh0aGlzLCBhMCwgYTEsIGEyLCBhMywgYTQsIGE1KTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIGNhc2UgNzpcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoYTAsIGExLCBhMiwgYTMsIGE0LCBhNSwgYTYpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZm4uY2FsbCh0aGlzLCBhMCwgYTEsIGEyLCBhMywgYTQsIGE1LCBhNik7XG4gICAgICAgICAgICB9O1xuICAgICAgICBjYXNlIDg6XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGEwLCBhMSwgYTIsIGEzLCBhNCwgYTUsIGE2LCBhNykge1xuICAgICAgICAgICAgICAgIHJldHVybiBmbi5jYWxsKHRoaXMsIGEwLCBhMSwgYTIsIGEzLCBhNCwgYTUsIGE2LCBhNyk7XG4gICAgICAgICAgICB9O1xuICAgICAgICBjYXNlIDk6XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGEwLCBhMSwgYTIsIGEzLCBhNCwgYTUsIGE2LCBhNywgYTgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZm4uY2FsbCh0aGlzLCBhMCwgYTEsIGEyLCBhMywgYTQsIGE1LCBhNiwgYTcsIGE4KTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIGNhc2UgMTA6XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGEwLCBhMSwgYTIsIGEzLCBhNCwgYTUsIGE2LCBhNywgYTgsIGE5KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZuLmNhbGwodGhpcywgYTAsIGExLCBhMiwgYTMsIGE0LCBhNSwgYTYsIGE3LCBhOCwgYTkpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignRmlyc3QgYXJndW1lbnQgdG8gbkFyeSBtdXN0IGJlIGEgbm9uLW5lZ2F0aXZlIGludGVnZXIgbm8gZ3JlYXRlciB0aGFuIHRlbicpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBOZWdhdGVzIGl0cyBhcmd1bWVudC5cbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgTWF0aFxuICAgICAqIEBzaWcgTnVtYmVyIC0+IE51bWJlclxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBuXG4gICAgICogQHJldHVybiB7TnVtYmVyfVxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIFIubmVnYXRlKDQyKTsgLy89PiAtNDJcbiAgICAgKi9cbiAgICB2YXIgbmVnYXRlID0gX2N1cnJ5MShmdW5jdGlvbiBuZWdhdGUobikge1xuICAgICAgICByZXR1cm4gLW47XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBBIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyB0aGUgYCFgIG9mIGl0cyBhcmd1bWVudC4gSXQgd2lsbCByZXR1cm4gYHRydWVgIHdoZW5cbiAgICAgKiBwYXNzZWQgZmFsc2UteSB2YWx1ZSwgYW5kIGBmYWxzZWAgd2hlbiBwYXNzZWQgYSB0cnV0aC15IG9uZS5cbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgTG9naWNcbiAgICAgKiBAc2lnICogLT4gQm9vbGVhblxuICAgICAqIEBwYXJhbSB7Kn0gYSBhbnkgdmFsdWVcbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufSB0aGUgbG9naWNhbCBpbnZlcnNlIG9mIHBhc3NlZCBhcmd1bWVudC5cbiAgICAgKiBAc2VlIFIuY29tcGxlbWVudFxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIFIubm90KHRydWUpOyAvLz0+IGZhbHNlXG4gICAgICogICAgICBSLm5vdChmYWxzZSk7IC8vPT4gdHJ1ZVxuICAgICAqICAgICAgUi5ub3QoMCk7ID0+IHRydWVcbiAgICAgKiAgICAgIFIubm90KDEpOyA9PiBmYWxzZVxuICAgICAqL1xuICAgIHZhciBub3QgPSBfY3VycnkxKGZ1bmN0aW9uIG5vdChhKSB7XG4gICAgICAgIHJldHVybiAhYTtcbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIG50aCBlbGVtZW50IGluIGEgbGlzdC5cbiAgICAgKiBJZiBuIGlzIG5lZ2F0aXZlIHRoZSBlbGVtZW50IGF0IGluZGV4IGxlbmd0aCArIG4gaXMgcmV0dXJuZWQuXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IExpc3RcbiAgICAgKiBAc2lnIE51bWJlciAtPiBbYV0gLT4gYVxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBpZHhcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBsaXN0XG4gICAgICogQHJldHVybiB7Kn0gVGhlIG50aCBlbGVtZW50IG9mIHRoZSBsaXN0LlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIHZhciBsaXN0ID0gWydmb28nLCAnYmFyJywgJ2JheicsICdxdXV4J107XG4gICAgICogICAgICBSLm50aCgxLCBsaXN0KTsgLy89PiAnYmFyJ1xuICAgICAqICAgICAgUi5udGgoLTEsIGxpc3QpOyAvLz0+ICdxdXV4J1xuICAgICAqICAgICAgUi5udGgoLTk5LCBsaXN0KTsgLy89PiB1bmRlZmluZWRcbiAgICAgKi9cbiAgICB2YXIgbnRoID0gX2N1cnJ5MihfbnRoKTtcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYSBmdW5jdGlvbiB3aGljaCByZXR1cm5zIGl0cyBudGggYXJndW1lbnQuXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IEZ1bmN0aW9uXG4gICAgICogQHNpZyBOdW1iZXIgLT4gKi4uLiAtPiAqXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IG5cbiAgICAgKiBAcmV0dXJuIHtGdW5jdGlvbn1cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICBSLm50aEFyZygxKSgnYScsICdiJywgJ2MnKTsgLy89PiAnYidcbiAgICAgKiAgICAgIFIubnRoQXJnKC0xKSgnYScsICdiJywgJ2MnKTsgLy89PiAnYydcbiAgICAgKi9cbiAgICB2YXIgbnRoQXJnID0gX2N1cnJ5MShmdW5jdGlvbiBudGhBcmcobikge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIF9udGgobiwgYXJndW1lbnRzKTtcbiAgICAgICAgfTtcbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIG50aCBjaGFyYWN0ZXIgb2YgdGhlIGdpdmVuIHN0cmluZy5cbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgU3RyaW5nXG4gICAgICogQHNpZyBOdW1iZXIgLT4gU3RyaW5nIC0+IFN0cmluZ1xuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBuXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICAgICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICBSLm50aENoYXIoMiwgJ1JhbWRhJyk7IC8vPT4gJ20nXG4gICAgICogICAgICBSLm50aENoYXIoLTIsICdSYW1kYScpOyAvLz0+ICdkJ1xuICAgICAqL1xuICAgIHZhciBudGhDaGFyID0gX2N1cnJ5MihmdW5jdGlvbiBudGhDaGFyKG4sIHN0cikge1xuICAgICAgICByZXR1cm4gc3RyLmNoYXJBdChuIDwgMCA/IHN0ci5sZW5ndGggKyBuIDogbik7XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBjaGFyYWN0ZXIgY29kZSBvZiB0aGUgbnRoIGNoYXJhY3RlciBvZiB0aGUgZ2l2ZW4gc3RyaW5nLlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBTdHJpbmdcbiAgICAgKiBAc2lnIE51bWJlciAtPiBTdHJpbmcgLT4gTnVtYmVyXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IG5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gICAgICogQHJldHVybiB7TnVtYmVyfVxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIFIubnRoQ2hhckNvZGUoMiwgJ1JhbWRhJyk7IC8vPT4gJ20nLmNoYXJDb2RlQXQoMClcbiAgICAgKiAgICAgIFIubnRoQ2hhckNvZGUoLTIsICdSYW1kYScpOyAvLz0+ICdkJy5jaGFyQ29kZUF0KDApXG4gICAgICovXG4gICAgdmFyIG50aENoYXJDb2RlID0gX2N1cnJ5MihmdW5jdGlvbiBudGhDaGFyQ29kZShuLCBzdHIpIHtcbiAgICAgICAgcmV0dXJuIHN0ci5jaGFyQ29kZUF0KG4gPCAwID8gc3RyLmxlbmd0aCArIG4gOiBuKTtcbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYSBzaW5nbGV0b24gYXJyYXkgY29udGFpbmluZyB0aGUgdmFsdWUgcHJvdmlkZWQuXG4gICAgICpcbiAgICAgKiBOb3RlIHRoaXMgYG9mYCBpcyBkaWZmZXJlbnQgZnJvbSB0aGUgRVM2IGBvZmA7IFNlZVxuICAgICAqIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL0FycmF5L29mXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IEZ1bmN0aW9uXG4gICAgICogQHNpZyBhIC0+IFthXVxuICAgICAqIEBwYXJhbSB7Kn0geCBhbnkgdmFsdWVcbiAgICAgKiBAcmV0dXJuIHtBcnJheX0gQW4gYXJyYXkgd3JhcHBpbmcgYHhgLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIFIub2YobnVsbCk7IC8vPT4gW251bGxdXG4gICAgICogICAgICBSLm9mKFs0Ml0pOyAvLz0+IFtbNDJdXVxuICAgICAqL1xuICAgIHZhciBvZiA9IF9jdXJyeTEoZnVuY3Rpb24gb2YoeCkge1xuICAgICAgICByZXR1cm4gW3hdO1xuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogQWNjZXB0cyBhIGZ1bmN0aW9uIGBmbmAgYW5kIHJldHVybnMgYSBmdW5jdGlvbiB0aGF0IGd1YXJkcyBpbnZvY2F0aW9uIG9mIGBmbmAgc3VjaCB0aGF0XG4gICAgICogYGZuYCBjYW4gb25seSBldmVyIGJlIGNhbGxlZCBvbmNlLCBubyBtYXR0ZXIgaG93IG1hbnkgdGltZXMgdGhlIHJldHVybmVkIGZ1bmN0aW9uIGlzXG4gICAgICogaW52b2tlZC5cbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgRnVuY3Rpb25cbiAgICAgKiBAc2lnIChhLi4uIC0+IGIpIC0+IChhLi4uIC0+IGIpXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGZ1bmN0aW9uIHRvIHdyYXAgaW4gYSBjYWxsLW9ubHktb25jZSB3cmFwcGVyLlxuICAgICAqIEByZXR1cm4ge0Z1bmN0aW9ufSBUaGUgd3JhcHBlZCBmdW5jdGlvbi5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICB2YXIgYWRkT25lT25jZSA9IFIub25jZShmdW5jdGlvbih4KXsgcmV0dXJuIHggKyAxOyB9KTtcbiAgICAgKiAgICAgIGFkZE9uZU9uY2UoMTApOyAvLz0+IDExXG4gICAgICogICAgICBhZGRPbmVPbmNlKGFkZE9uZU9uY2UoNTApKTsgLy89PiAxMVxuICAgICAqL1xuICAgIHZhciBvbmNlID0gX2N1cnJ5MShmdW5jdGlvbiBvbmNlKGZuKSB7XG4gICAgICAgIHZhciBjYWxsZWQgPSBmYWxzZSwgcmVzdWx0O1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKGNhbGxlZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYWxsZWQgPSB0cnVlO1xuICAgICAgICAgICAgcmVzdWx0ID0gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH07XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBSZXRyaWV2ZSB0aGUgdmFsdWUgYXQgYSBnaXZlbiBwYXRoLlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBPYmplY3RcbiAgICAgKiBAc2lnIFtTdHJpbmddIC0+IHsqfSAtPiAqXG4gICAgICogQHBhcmFtIHtBcnJheX0gcGF0aCBUaGUgcGF0aCB0byB1c2UuXG4gICAgICogQHJldHVybiB7Kn0gVGhlIGRhdGEgYXQgYHBhdGhgLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIFIucGF0aChbJ2EnLCAnYiddLCB7YToge2I6IDJ9fSk7IC8vPT4gMlxuICAgICAqL1xuICAgIHZhciBwYXRoID0gX2N1cnJ5MihfcGF0aCk7XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGEgcGFydGlhbCBjb3B5IG9mIGFuIG9iamVjdCBjb250YWluaW5nIG9ubHkgdGhlIGtleXMgc3BlY2lmaWVkLiAgSWYgdGhlIGtleSBkb2VzIG5vdCBleGlzdCwgdGhlXG4gICAgICogcHJvcGVydHkgaXMgaWdub3JlZC5cbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgT2JqZWN0XG4gICAgICogQHNpZyBba10gLT4ge2s6IHZ9IC0+IHtrOiB2fVxuICAgICAqIEBwYXJhbSB7QXJyYXl9IG5hbWVzIGFuIGFycmF5IG9mIFN0cmluZyBwcm9wZXJ0eSBuYW1lcyB0byBjb3B5IG9udG8gYSBuZXcgb2JqZWN0XG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9iaiBUaGUgb2JqZWN0IHRvIGNvcHkgZnJvbVxuICAgICAqIEByZXR1cm4ge09iamVjdH0gQSBuZXcgb2JqZWN0IHdpdGggb25seSBwcm9wZXJ0aWVzIGZyb20gYG5hbWVzYCBvbiBpdC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICBSLnBpY2soWydhJywgJ2QnXSwge2E6IDEsIGI6IDIsIGM6IDMsIGQ6IDR9KTsgLy89PiB7YTogMSwgZDogNH1cbiAgICAgKiAgICAgIFIucGljayhbJ2EnLCAnZScsICdmJ10sIHthOiAxLCBiOiAyLCBjOiAzLCBkOiA0fSk7IC8vPT4ge2E6IDF9XG4gICAgICovXG4gICAgdmFyIHBpY2sgPSBfY3VycnkyKGZ1bmN0aW9uIHBpY2sobmFtZXMsIG9iaikge1xuICAgICAgICB2YXIgcmVzdWx0ID0ge307XG4gICAgICAgIHZhciBpZHggPSAwO1xuICAgICAgICB3aGlsZSAoaWR4IDwgbmFtZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICBpZiAobmFtZXNbaWR4XSBpbiBvYmopIHtcbiAgICAgICAgICAgICAgICByZXN1bHRbbmFtZXNbaWR4XV0gPSBvYmpbbmFtZXNbaWR4XV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZHggKz0gMTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogU2ltaWxhciB0byBgcGlja2AgZXhjZXB0IHRoYXQgdGhpcyBvbmUgaW5jbHVkZXMgYSBga2V5OiB1bmRlZmluZWRgIHBhaXIgZm9yIHByb3BlcnRpZXMgdGhhdCBkb24ndCBleGlzdC5cbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgT2JqZWN0XG4gICAgICogQHNpZyBba10gLT4ge2s6IHZ9IC0+IHtrOiB2fVxuICAgICAqIEBwYXJhbSB7QXJyYXl9IG5hbWVzIGFuIGFycmF5IG9mIFN0cmluZyBwcm9wZXJ0eSBuYW1lcyB0byBjb3B5IG9udG8gYSBuZXcgb2JqZWN0XG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9iaiBUaGUgb2JqZWN0IHRvIGNvcHkgZnJvbVxuICAgICAqIEByZXR1cm4ge09iamVjdH0gQSBuZXcgb2JqZWN0IHdpdGggb25seSBwcm9wZXJ0aWVzIGZyb20gYG5hbWVzYCBvbiBpdC5cbiAgICAgKiBAc2VlIFIucGlja1xuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIFIucGlja0FsbChbJ2EnLCAnZCddLCB7YTogMSwgYjogMiwgYzogMywgZDogNH0pOyAvLz0+IHthOiAxLCBkOiA0fVxuICAgICAqICAgICAgUi5waWNrQWxsKFsnYScsICdlJywgJ2YnXSwge2E6IDEsIGI6IDIsIGM6IDMsIGQ6IDR9KTsgLy89PiB7YTogMSwgZTogdW5kZWZpbmVkLCBmOiB1bmRlZmluZWR9XG4gICAgICovXG4gICAgdmFyIHBpY2tBbGwgPSBfY3VycnkyKGZ1bmN0aW9uIHBpY2tBbGwobmFtZXMsIG9iaikge1xuICAgICAgICB2YXIgcmVzdWx0ID0ge307XG4gICAgICAgIHZhciBpZHggPSAwO1xuICAgICAgICB2YXIgbGVuID0gbmFtZXMubGVuZ3RoO1xuICAgICAgICB3aGlsZSAoaWR4IDwgbGVuKSB7XG4gICAgICAgICAgICB2YXIgbmFtZSA9IG5hbWVzW2lkeF07XG4gICAgICAgICAgICByZXN1bHRbbmFtZV0gPSBvYmpbbmFtZV07XG4gICAgICAgICAgICBpZHggKz0gMTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhIHBhcnRpYWwgY29weSBvZiBhbiBvYmplY3QgY29udGFpbmluZyBvbmx5IHRoZSBrZXlzIHRoYXRcbiAgICAgKiBzYXRpc2Z5IHRoZSBzdXBwbGllZCBwcmVkaWNhdGUuXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IE9iamVjdFxuICAgICAqIEBzaWcgKHYsIGsgLT4gQm9vbGVhbikgLT4ge2s6IHZ9IC0+IHtrOiB2fVxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IHByZWQgQSBwcmVkaWNhdGUgdG8gZGV0ZXJtaW5lIHdoZXRoZXIgb3Igbm90IGEga2V5XG4gICAgICogICAgICAgIHNob3VsZCBiZSBpbmNsdWRlZCBvbiB0aGUgb3V0cHV0IG9iamVjdC5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb2JqIFRoZSBvYmplY3QgdG8gY29weSBmcm9tXG4gICAgICogQHJldHVybiB7T2JqZWN0fSBBIG5ldyBvYmplY3Qgd2l0aCBvbmx5IHByb3BlcnRpZXMgdGhhdCBzYXRpc2Z5IGBwcmVkYFxuICAgICAqICAgICAgICAgb24gaXQuXG4gICAgICogQHNlZSBSLnBpY2tcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICB2YXIgaXNVcHBlckNhc2UgPSBmdW5jdGlvbih2YWwsIGtleSkgeyByZXR1cm4ga2V5LnRvVXBwZXJDYXNlKCkgPT09IGtleTsgfVxuICAgICAqICAgICAgUi5waWNrQnkoaXNVcHBlckNhc2UsIHthOiAxLCBiOiAyLCBBOiAzLCBCOiA0fSk7IC8vPT4ge0E6IDMsIEI6IDR9XG4gICAgICovXG4gICAgdmFyIHBpY2tCeSA9IF9jdXJyeTIoZnVuY3Rpb24gcGlja0J5KHRlc3QsIG9iaikge1xuICAgICAgICB2YXIgcmVzdWx0ID0ge307XG4gICAgICAgIGZvciAodmFyIHByb3AgaW4gb2JqKSB7XG4gICAgICAgICAgICBpZiAodGVzdChvYmpbcHJvcF0sIHByb3AsIG9iaikpIHtcbiAgICAgICAgICAgICAgICByZXN1bHRbcHJvcF0gPSBvYmpbcHJvcF07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYSBuZXcgbGlzdCB3aXRoIHRoZSBnaXZlbiBlbGVtZW50IGF0IHRoZSBmcm9udCwgZm9sbG93ZWQgYnkgdGhlIGNvbnRlbnRzIG9mIHRoZVxuICAgICAqIGxpc3QuXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IExpc3RcbiAgICAgKiBAc2lnIGEgLT4gW2FdIC0+IFthXVxuICAgICAqIEBwYXJhbSB7Kn0gZWwgVGhlIGl0ZW0gdG8gYWRkIHRvIHRoZSBoZWFkIG9mIHRoZSBvdXRwdXQgbGlzdC5cbiAgICAgKiBAcGFyYW0ge0FycmF5fSBsaXN0IFRoZSBhcnJheSB0byBhZGQgdG8gdGhlIHRhaWwgb2YgdGhlIG91dHB1dCBsaXN0LlxuICAgICAqIEByZXR1cm4ge0FycmF5fSBBIG5ldyBhcnJheS5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICBSLnByZXBlbmQoJ2ZlZScsIFsnZmknLCAnZm8nLCAnZnVtJ10pOyAvLz0+IFsnZmVlJywgJ2ZpJywgJ2ZvJywgJ2Z1bSddXG4gICAgICovXG4gICAgdmFyIHByZXBlbmQgPSBfY3VycnkyKF9wcmVwZW5kKTtcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYSBmdW5jdGlvbiB0aGF0IHdoZW4gc3VwcGxpZWQgYW4gb2JqZWN0IHJldHVybnMgdGhlIGluZGljYXRlZCBwcm9wZXJ0eSBvZiB0aGF0IG9iamVjdCwgaWYgaXQgZXhpc3RzLlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBPYmplY3RcbiAgICAgKiBAc2lnIHMgLT4ge3M6IGF9IC0+IGFcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gcCBUaGUgcHJvcGVydHkgbmFtZVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvYmogVGhlIG9iamVjdCB0byBxdWVyeVxuICAgICAqIEByZXR1cm4geyp9IFRoZSB2YWx1ZSBhdCBgb2JqLnBgLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIFIucHJvcCgneCcsIHt4OiAxMDB9KTsgLy89PiAxMDBcbiAgICAgKiAgICAgIFIucHJvcCgneCcsIHt9KTsgLy89PiB1bmRlZmluZWRcbiAgICAgKi9cbiAgICB2YXIgcHJvcCA9IF9jdXJyeTIoZnVuY3Rpb24gcHJvcChwLCBvYmopIHtcbiAgICAgICAgcmV0dXJuIG9ialtwXTtcbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIElmIHRoZSBnaXZlbiwgbm9uLW51bGwgb2JqZWN0IGhhcyBhbiBvd24gcHJvcGVydHkgd2l0aCB0aGUgc3BlY2lmaWVkIG5hbWUsXG4gICAgICogcmV0dXJucyB0aGUgdmFsdWUgb2YgdGhhdCBwcm9wZXJ0eS5cbiAgICAgKiBPdGhlcndpc2UgcmV0dXJucyB0aGUgcHJvdmlkZWQgZGVmYXVsdCB2YWx1ZS5cbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgT2JqZWN0XG4gICAgICogQHNpZyBhIC0+IFN0cmluZyAtPiBPYmplY3QgLT4gYVxuICAgICAqIEBwYXJhbSB7Kn0gdmFsIFRoZSBkZWZhdWx0IHZhbHVlLlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBwIFRoZSBuYW1lIG9mIHRoZSBwcm9wZXJ0eSB0byByZXR1cm4uXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9iaiBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICAgICAqIEByZXR1cm4geyp9IFRoZSB2YWx1ZSBvZiBnaXZlbiBwcm9wZXJ0eSBvZiB0aGUgc3VwcGxpZWQgb2JqZWN0IG9yIHRoZSBkZWZhdWx0IHZhbHVlLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIHZhciBhbGljZSA9IHtcbiAgICAgKiAgICAgICAgbmFtZTogJ0FMSUNFJyxcbiAgICAgKiAgICAgICAgYWdlOiAxMDFcbiAgICAgKiAgICAgIH07XG4gICAgICogICAgICB2YXIgZmF2b3JpdGUgPSBSLnByb3AoJ2Zhdm9yaXRlTGlicmFyeScpO1xuICAgICAqICAgICAgdmFyIGZhdm9yaXRlV2l0aERlZmF1bHQgPSBSLnByb3BPcignUmFtZGEnLCAnZmF2b3JpdGVMaWJyYXJ5Jyk7XG4gICAgICpcbiAgICAgKiAgICAgIGZhdm9yaXRlKGFsaWNlKTsgIC8vPT4gdW5kZWZpbmVkXG4gICAgICogICAgICBmYXZvcml0ZVdpdGhEZWZhdWx0KGFsaWNlKTsgIC8vPT4gJ1JhbWRhJ1xuICAgICAqL1xuICAgIHZhciBwcm9wT3IgPSBfY3VycnkzKGZ1bmN0aW9uIHByb3BPcih2YWwsIHAsIG9iaikge1xuICAgICAgICByZXR1cm4gb2JqICE9IG51bGwgJiYgX2hhcyhwLCBvYmopID8gb2JqW3BdIDogdmFsO1xuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogQWN0cyBhcyBtdWx0aXBsZSBgZ2V0YDogYXJyYXkgb2Yga2V5cyBpbiwgYXJyYXkgb2YgdmFsdWVzIG91dC4gUHJlc2VydmVzIG9yZGVyLlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBPYmplY3RcbiAgICAgKiBAc2lnIFtrXSAtPiB7azogdn0gLT4gW3ZdXG4gICAgICogQHBhcmFtIHtBcnJheX0gcHMgVGhlIHByb3BlcnR5IG5hbWVzIHRvIGZldGNoXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9iaiBUaGUgb2JqZWN0IHRvIHF1ZXJ5XG4gICAgICogQHJldHVybiB7QXJyYXl9IFRoZSBjb3JyZXNwb25kaW5nIHZhbHVlcyBvciBwYXJ0aWFsbHkgYXBwbGllZCBmdW5jdGlvbi5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICBSLnByb3BzKFsneCcsICd5J10sIHt4OiAxLCB5OiAyfSk7IC8vPT4gWzEsIDJdXG4gICAgICogICAgICBSLnByb3BzKFsnYycsICdhJywgJ2InXSwge2I6IDIsIGE6IDF9KTsgLy89PiBbdW5kZWZpbmVkLCAxLCAyXVxuICAgICAqXG4gICAgICogICAgICB2YXIgZnVsbE5hbWUgPSBSLmNvbXBvc2UoUi5qb2luKCcgJyksIFIucHJvcHMoWydmaXJzdCcsICdsYXN0J10pKTtcbiAgICAgKiAgICAgIGZ1bGxOYW1lKHtsYXN0OiAnQnVsbGV0LVRvb3RoJywgYWdlOiAzMywgZmlyc3Q6ICdUb255J30pOyAvLz0+ICdUb255IEJ1bGxldC1Ub290aCdcbiAgICAgKi9cbiAgICB2YXIgcHJvcHMgPSBfY3VycnkyKGZ1bmN0aW9uIHByb3BzKHBzLCBvYmopIHtcbiAgICAgICAgdmFyIGxlbiA9IHBzLmxlbmd0aDtcbiAgICAgICAgdmFyIG91dCA9IFtdO1xuICAgICAgICB2YXIgaWR4ID0gMDtcbiAgICAgICAgd2hpbGUgKGlkeCA8IGxlbikge1xuICAgICAgICAgICAgb3V0W2lkeF0gPSBvYmpbcHNbaWR4XV07XG4gICAgICAgICAgICBpZHggKz0gMTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhIGxpc3Qgb2YgbnVtYmVycyBmcm9tIGBmcm9tYCAoaW5jbHVzaXZlKSB0byBgdG9gXG4gICAgICogKGV4Y2x1c2l2ZSkuXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IExpc3RcbiAgICAgKiBAc2lnIE51bWJlciAtPiBOdW1iZXIgLT4gW051bWJlcl1cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gZnJvbSBUaGUgZmlyc3QgbnVtYmVyIGluIHRoZSBsaXN0LlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSB0byBPbmUgbW9yZSB0aGFuIHRoZSBsYXN0IG51bWJlciBpbiB0aGUgbGlzdC5cbiAgICAgKiBAcmV0dXJuIHtBcnJheX0gVGhlIGxpc3Qgb2YgbnVtYmVycyBpbiB0dGhlIHNldCBgW2EsIGIpYC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICBSLnJhbmdlKDEsIDUpOyAgICAvLz0+IFsxLCAyLCAzLCA0XVxuICAgICAqICAgICAgUi5yYW5nZSg1MCwgNTMpOyAgLy89PiBbNTAsIDUxLCA1Ml1cbiAgICAgKi9cbiAgICB2YXIgcmFuZ2UgPSBfY3VycnkyKGZ1bmN0aW9uIHJhbmdlKGZyb20sIHRvKSB7XG4gICAgICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICAgICAgdmFyIG4gPSBmcm9tO1xuICAgICAgICB3aGlsZSAobiA8IHRvKSB7XG4gICAgICAgICAgICByZXN1bHRbcmVzdWx0Lmxlbmd0aF0gPSBuO1xuICAgICAgICAgICAgbiArPSAxO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBMaWtlIGByZWR1Y2VgLCBidXQgcGFzc2VzIGFkZGl0aW9uYWwgcGFyYW1ldGVycyB0byB0aGUgcHJlZGljYXRlIGZ1bmN0aW9uLlxuICAgICAqXG4gICAgICogVGhlIGl0ZXJhdG9yIGZ1bmN0aW9uIHJlY2VpdmVzIGZvdXIgdmFsdWVzOiAqKGFjYywgdmFsdWUsIGluZGV4LCBsaXN0KSpcbiAgICAgKlxuICAgICAqIE5vdGU6IGBSLnJlZHVjZUluZGV4ZWRgIGRvZXMgbm90IHNraXAgZGVsZXRlZCBvciB1bmFzc2lnbmVkIGluZGljZXMgKHNwYXJzZSBhcnJheXMpLFxuICAgICAqIHVubGlrZSB0aGUgbmF0aXZlIGBBcnJheS5wcm90b3R5cGUucmVkdWNlYCBtZXRob2QuIEZvciBtb3JlIGRldGFpbHMgb24gdGhpcyBiZWhhdmlvcixcbiAgICAgKiBzZWU6XG4gICAgICogaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvQXJyYXkvcmVkdWNlI0Rlc2NyaXB0aW9uXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IExpc3RcbiAgICAgKiBAc2lnIChhLGIsaSxbYl0gLT4gYSkgLT4gYSAtPiBbYl0gLT4gYVxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBpdGVyYXRvciBmdW5jdGlvbi4gUmVjZWl2ZXMgZm91ciB2YWx1ZXM6IHRoZSBhY2N1bXVsYXRvciwgdGhlXG4gICAgICogICAgICAgIGN1cnJlbnQgZWxlbWVudCBmcm9tIGBsaXN0YCwgdGhhdCBlbGVtZW50J3MgaW5kZXgsIGFuZCB0aGUgZW50aXJlIGBsaXN0YCBpdHNlbGYuXG4gICAgICogQHBhcmFtIHsqfSBhY2MgVGhlIGFjY3VtdWxhdG9yIHZhbHVlLlxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGxpc3QgVGhlIGxpc3QgdG8gaXRlcmF0ZSBvdmVyLlxuICAgICAqIEByZXR1cm4geyp9IFRoZSBmaW5hbCwgYWNjdW11bGF0ZWQgdmFsdWUuXG4gICAgICogQGRlcHJlY2F0ZWQgc2luY2UgdjAuMTUuMFxuICAgICAqIEBzZWUgUi5hZGRJbmRleFxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIHZhciBsZXR0ZXJzID0gWydhJywgJ2InLCAnYyddO1xuICAgICAqICAgICAgdmFyIG9iamVjdGlmeSA9IGZ1bmN0aW9uKGFjY09iamVjdCwgZWxlbSwgaWR4LCBsaXN0KSB7XG4gICAgICogICAgICAgIGFjY09iamVjdFtlbGVtXSA9IGlkeDtcbiAgICAgKiAgICAgICAgcmV0dXJuIGFjY09iamVjdDtcbiAgICAgKiAgICAgIH07XG4gICAgICpcbiAgICAgKiAgICAgIFIucmVkdWNlSW5kZXhlZChvYmplY3RpZnksIHt9LCBsZXR0ZXJzKTsgLy89PiB7ICdhJzogMCwgJ2InOiAxLCAnYyc6IDIgfVxuICAgICAqL1xuICAgIHZhciByZWR1Y2VJbmRleGVkID0gX2N1cnJ5MyhmdW5jdGlvbiByZWR1Y2VJbmRleGVkKGZuLCBhY2MsIGxpc3QpIHtcbiAgICAgICAgdmFyIGlkeCA9IDAsIGxlbiA9IGxpc3QubGVuZ3RoO1xuICAgICAgICB3aGlsZSAoaWR4IDwgbGVuKSB7XG4gICAgICAgICAgICBhY2MgPSBmbihhY2MsIGxpc3RbaWR4XSwgaWR4LCBsaXN0KTtcbiAgICAgICAgICAgIGlkeCArPSAxO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhY2M7XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGEgc2luZ2xlIGl0ZW0gYnkgaXRlcmF0aW5nIHRocm91Z2ggdGhlIGxpc3QsIHN1Y2Nlc3NpdmVseSBjYWxsaW5nIHRoZSBpdGVyYXRvclxuICAgICAqIGZ1bmN0aW9uIGFuZCBwYXNzaW5nIGl0IGFuIGFjY3VtdWxhdG9yIHZhbHVlIGFuZCB0aGUgY3VycmVudCB2YWx1ZSBmcm9tIHRoZSBhcnJheSwgYW5kXG4gICAgICogdGhlbiBwYXNzaW5nIHRoZSByZXN1bHQgdG8gdGhlIG5leHQgY2FsbC5cbiAgICAgKlxuICAgICAqIFNpbWlsYXIgdG8gYHJlZHVjZWAsIGV4Y2VwdCBtb3ZlcyB0aHJvdWdoIHRoZSBpbnB1dCBsaXN0IGZyb20gdGhlIHJpZ2h0IHRvIHRoZSBsZWZ0LlxuICAgICAqXG4gICAgICogVGhlIGl0ZXJhdG9yIGZ1bmN0aW9uIHJlY2VpdmVzIHR3byB2YWx1ZXM6ICooYWNjLCB2YWx1ZSkqXG4gICAgICpcbiAgICAgKiBOb3RlOiBgUi5yZWR1Y2VSaWdodGAgZG9lcyBub3Qgc2tpcCBkZWxldGVkIG9yIHVuYXNzaWduZWQgaW5kaWNlcyAoc3BhcnNlIGFycmF5cyksIHVubGlrZVxuICAgICAqIHRoZSBuYXRpdmUgYEFycmF5LnByb3RvdHlwZS5yZWR1Y2VgIG1ldGhvZC4gRm9yIG1vcmUgZGV0YWlscyBvbiB0aGlzIGJlaGF2aW9yLCBzZWU6XG4gICAgICogaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvQXJyYXkvcmVkdWNlUmlnaHQjRGVzY3JpcHRpb25cbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgTGlzdFxuICAgICAqIEBzaWcgKGEsYiAtPiBhKSAtPiBhIC0+IFtiXSAtPiBhXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGl0ZXJhdG9yIGZ1bmN0aW9uLiBSZWNlaXZlcyB0d28gdmFsdWVzLCB0aGUgYWNjdW11bGF0b3IgYW5kIHRoZVxuICAgICAqICAgICAgICBjdXJyZW50IGVsZW1lbnQgZnJvbSB0aGUgYXJyYXkuXG4gICAgICogQHBhcmFtIHsqfSBhY2MgVGhlIGFjY3VtdWxhdG9yIHZhbHVlLlxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGxpc3QgVGhlIGxpc3QgdG8gaXRlcmF0ZSBvdmVyLlxuICAgICAqIEByZXR1cm4geyp9IFRoZSBmaW5hbCwgYWNjdW11bGF0ZWQgdmFsdWUuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgdmFyIHBhaXJzID0gWyBbJ2EnLCAxXSwgWydiJywgMl0sIFsnYycsIDNdIF07XG4gICAgICogICAgICB2YXIgZmxhdHRlblBhaXJzID0gZnVuY3Rpb24oYWNjLCBwYWlyKSB7XG4gICAgICogICAgICAgIHJldHVybiBhY2MuY29uY2F0KHBhaXIpO1xuICAgICAqICAgICAgfTtcbiAgICAgKlxuICAgICAqICAgICAgUi5yZWR1Y2VSaWdodChmbGF0dGVuUGFpcnMsIFtdLCBwYWlycyk7IC8vPT4gWyAnYycsIDMsICdiJywgMiwgJ2EnLCAxIF1cbiAgICAgKi9cbiAgICB2YXIgcmVkdWNlUmlnaHQgPSBfY3VycnkzKGZ1bmN0aW9uIHJlZHVjZVJpZ2h0KGZuLCBhY2MsIGxpc3QpIHtcbiAgICAgICAgdmFyIGlkeCA9IGxpc3QubGVuZ3RoIC0gMTtcbiAgICAgICAgd2hpbGUgKGlkeCA+PSAwKSB7XG4gICAgICAgICAgICBhY2MgPSBmbihhY2MsIGxpc3RbaWR4XSk7XG4gICAgICAgICAgICBpZHggLT0gMTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYWNjO1xuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogTGlrZSBgcmVkdWNlUmlnaHRgLCBidXQgcGFzc2VzIGFkZGl0aW9uYWwgcGFyYW1ldGVycyB0byB0aGUgcHJlZGljYXRlIGZ1bmN0aW9uLiBNb3ZlcyB0aHJvdWdoXG4gICAgICogdGhlIGlucHV0IGxpc3QgZnJvbSB0aGUgcmlnaHQgdG8gdGhlIGxlZnQuXG4gICAgICpcbiAgICAgKiBUaGUgaXRlcmF0b3IgZnVuY3Rpb24gcmVjZWl2ZXMgZm91ciB2YWx1ZXM6ICooYWNjLCB2YWx1ZSwgaW5kZXgsIGxpc3QpKi5cbiAgICAgKlxuICAgICAqIE5vdGU6IGBSLnJlZHVjZVJpZ2h0SW5kZXhlZGAgZG9lcyBub3Qgc2tpcCBkZWxldGVkIG9yIHVuYXNzaWduZWQgaW5kaWNlcyAoc3BhcnNlIGFycmF5cyksXG4gICAgICogdW5saWtlIHRoZSBuYXRpdmUgYEFycmF5LnByb3RvdHlwZS5yZWR1Y2VgIG1ldGhvZC4gRm9yIG1vcmUgZGV0YWlscyBvbiB0aGlzIGJlaGF2aW9yLFxuICAgICAqIHNlZTpcbiAgICAgKiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9BcnJheS9yZWR1Y2VSaWdodCNEZXNjcmlwdGlvblxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBMaXN0XG4gICAgICogQHNpZyAoYSxiLGksW2JdIC0+IGEgLT4gW2JdIC0+IGFcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgaXRlcmF0b3IgZnVuY3Rpb24uIFJlY2VpdmVzIGZvdXIgdmFsdWVzOiB0aGUgYWNjdW11bGF0b3IsIHRoZVxuICAgICAqICAgICAgICBjdXJyZW50IGVsZW1lbnQgZnJvbSBgbGlzdGAsIHRoYXQgZWxlbWVudCdzIGluZGV4LCBhbmQgdGhlIGVudGlyZSBgbGlzdGAgaXRzZWxmLlxuICAgICAqIEBwYXJhbSB7Kn0gYWNjIFRoZSBhY2N1bXVsYXRvciB2YWx1ZS5cbiAgICAgKiBAcGFyYW0ge0FycmF5fSBsaXN0IFRoZSBsaXN0IHRvIGl0ZXJhdGUgb3Zlci5cbiAgICAgKiBAcmV0dXJuIHsqfSBUaGUgZmluYWwsIGFjY3VtdWxhdGVkIHZhbHVlLlxuICAgICAqIEBkZXByZWNhdGVkIHNpbmNlIHYwLjE1LjBcbiAgICAgKiBAc2VlIFIuYWRkSW5kZXhcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICB2YXIgbGV0dGVycyA9IFsnYScsICdiJywgJ2MnXTtcbiAgICAgKiAgICAgIHZhciBvYmplY3RpZnkgPSBmdW5jdGlvbihhY2NPYmplY3QsIGVsZW0sIGlkeCwgbGlzdCkge1xuICAgICAqICAgICAgICBhY2NPYmplY3RbZWxlbV0gPSBpZHg7XG4gICAgICogICAgICAgIHJldHVybiBhY2NPYmplY3Q7XG4gICAgICogICAgICB9O1xuICAgICAqXG4gICAgICogICAgICBSLnJlZHVjZVJpZ2h0SW5kZXhlZChvYmplY3RpZnksIHt9LCBsZXR0ZXJzKTsgLy89PiB7ICdjJzogMiwgJ2InOiAxLCAnYSc6IDAgfVxuICAgICAqL1xuICAgIHZhciByZWR1Y2VSaWdodEluZGV4ZWQgPSBfY3VycnkzKGZ1bmN0aW9uIHJlZHVjZVJpZ2h0SW5kZXhlZChmbiwgYWNjLCBsaXN0KSB7XG4gICAgICAgIHZhciBpZHggPSBsaXN0Lmxlbmd0aCAtIDE7XG4gICAgICAgIHdoaWxlIChpZHggPj0gMCkge1xuICAgICAgICAgICAgYWNjID0gZm4oYWNjLCBsaXN0W2lkeF0sIGlkeCwgbGlzdCk7XG4gICAgICAgICAgICBpZHggLT0gMTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYWNjO1xuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhIHZhbHVlIHdyYXBwZWQgdG8gaW5kaWNhdGUgdGhhdCBpdCBpcyB0aGUgZmluYWwgdmFsdWUgb2YgdGhlXG4gICAgICogcmVkdWNlIGFuZCB0cmFuc2R1Y2UgZnVuY3Rpb25zLiAgVGhlIHJldHVybmVkIHZhbHVlXG4gICAgICogc2hvdWxkIGJlIGNvbnNpZGVyZWQgYSBibGFjayBib3g6IHRoZSBpbnRlcm5hbCBzdHJ1Y3R1cmUgaXMgbm90XG4gICAgICogZ3VhcmFudGVlZCB0byBiZSBzdGFibGUuXG4gICAgICpcbiAgICAgKiBOb3RlOiB0aGlzIG9wdGltaXphdGlvbiBpcyB1bmF2YWlsYWJsZSB0byBmdW5jdGlvbnMgbm90IGV4cGxpY2l0bHkgbGlzdGVkXG4gICAgICogYWJvdmUuICBGb3IgaW5zdGFuY2UsIGl0IGlzIG5vdCBjdXJyZW50bHkgc3VwcG9ydGVkIGJ5IHJlZHVjZUluZGV4ZWQsXG4gICAgICogcmVkdWNlUmlnaHQsIG9yIHJlZHVjZVJpZ2h0SW5kZXhlZC5cbiAgICAgKiBAc2VlIFIucmVkdWNlXG4gICAgICogQHNlZSBSLnRyYW5zZHVjZVxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBMaXN0XG4gICAgICogQHNpZyBhIC0+ICpcbiAgICAgKiBAcGFyYW0geyp9IHggVGhlIGZpbmFsIHZhbHVlIG9mIHRoZSByZWR1Y2UuXG4gICAgICogQHJldHVybiB7Kn0gVGhlIHdyYXBwZWQgdmFsdWUuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgUi5yZWR1Y2UoXG4gICAgICogICAgICAgIFIucGlwZShSLmFkZCwgUi5pZkVsc2UoUi5sdGUoMTApLCBSLnJlZHVjZWQsIFIuaWRlbnRpdHkpKSxcbiAgICAgKiAgICAgICAgMCxcbiAgICAgKiAgICAgICAgWzEsIDIsIDMsIDQsIDVdKSAvLyAxMFxuICAgICAqL1xuICAgIHZhciByZWR1Y2VkID0gX2N1cnJ5MShfcmVkdWNlZCk7XG5cbiAgICAvKipcbiAgICAgKiBMaWtlIGByZWplY3RgLCBidXQgcGFzc2VzIGFkZGl0aW9uYWwgcGFyYW1ldGVycyB0byB0aGUgcHJlZGljYXRlIGZ1bmN0aW9uLiBUaGUgcHJlZGljYXRlXG4gICAgICogZnVuY3Rpb24gaXMgcGFzc2VkIHRocmVlIGFyZ3VtZW50czogKih2YWx1ZSwgaW5kZXgsIGxpc3QpKi5cbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgTGlzdFxuICAgICAqIEBzaWcgKGEsIGksIFthXSAtPiBCb29sZWFuKSAtPiBbYV0gLT4gW2FdXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGZ1bmN0aW9uIGNhbGxlZCBwZXIgaXRlcmF0aW9uLlxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGxpc3QgVGhlIGNvbGxlY3Rpb24gdG8gaXRlcmF0ZSBvdmVyLlxuICAgICAqIEByZXR1cm4ge0FycmF5fSBUaGUgbmV3IGZpbHRlcmVkIGFycmF5LlxuICAgICAqIEBkZXByZWNhdGVkIHNpbmNlIHYwLjE1LjBcbiAgICAgKiBAc2VlIFIuYWRkSW5kZXhcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICB2YXIgbGFzdFR3byA9IGZ1bmN0aW9uKHZhbCwgaWR4LCBsaXN0KSB7XG4gICAgICogICAgICAgIHJldHVybiBsaXN0Lmxlbmd0aCAtIGlkeCA8PSAyO1xuICAgICAqICAgICAgfTtcbiAgICAgKlxuICAgICAqICAgICAgUi5yZWplY3RJbmRleGVkKGxhc3RUd28sIFs4LCA2LCA3LCA1LCAzLCAwLCA5XSk7IC8vPT4gWzgsIDYsIDcsIDUsIDNdXG4gICAgICovXG4gICAgdmFyIHJlamVjdEluZGV4ZWQgPSBfY3VycnkyKGZ1bmN0aW9uIHJlamVjdEluZGV4ZWQoZm4sIGxpc3QpIHtcbiAgICAgICAgcmV0dXJuIF9maWx0ZXJJbmRleGVkKF9jb21wbGVtZW50KGZuKSwgbGlzdCk7XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBSZW1vdmVzIHRoZSBzdWItbGlzdCBvZiBgbGlzdGAgc3RhcnRpbmcgYXQgaW5kZXggYHN0YXJ0YCBhbmQgY29udGFpbmluZ1xuICAgICAqIGBjb3VudGAgZWxlbWVudHMuICBfTm90ZSB0aGF0IHRoaXMgaXMgbm90IGRlc3RydWN0aXZlXzogaXQgcmV0dXJucyBhXG4gICAgICogY29weSBvZiB0aGUgbGlzdCB3aXRoIHRoZSBjaGFuZ2VzLlxuICAgICAqIDxzbWFsbD5ObyBsaXN0cyBoYXZlIGJlZW4gaGFybWVkIGluIHRoZSBhcHBsaWNhdGlvbiBvZiB0aGlzIGZ1bmN0aW9uLjwvc21hbGw+XG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IExpc3RcbiAgICAgKiBAc2lnIE51bWJlciAtPiBOdW1iZXIgLT4gW2FdIC0+IFthXVxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBzdGFydCBUaGUgcG9zaXRpb24gdG8gc3RhcnQgcmVtb3ZpbmcgZWxlbWVudHNcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gY291bnQgVGhlIG51bWJlciBvZiBlbGVtZW50cyB0byByZW1vdmVcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBsaXN0IFRoZSBsaXN0IHRvIHJlbW92ZSBmcm9tXG4gICAgICogQHJldHVybiB7QXJyYXl9IEEgbmV3IEFycmF5IHdpdGggYGNvdW50YCBlbGVtZW50cyBmcm9tIGBzdGFydGAgcmVtb3ZlZC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICBSLnJlbW92ZSgyLCAzLCBbMSwyLDMsNCw1LDYsNyw4XSk7IC8vPT4gWzEsMiw2LDcsOF1cbiAgICAgKi9cbiAgICB2YXIgcmVtb3ZlID0gX2N1cnJ5MyhmdW5jdGlvbiByZW1vdmUoc3RhcnQsIGNvdW50LCBsaXN0KSB7XG4gICAgICAgIHJldHVybiBfY29uY2F0KF9zbGljZShsaXN0LCAwLCBNYXRoLm1pbihzdGFydCwgbGlzdC5sZW5ndGgpKSwgX3NsaWNlKGxpc3QsIE1hdGgubWluKGxpc3QubGVuZ3RoLCBzdGFydCArIGNvdW50KSkpO1xuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogUmVwbGFjZSBhIHN1YnN0cmluZyBvciByZWdleCBtYXRjaCBpbiBhIHN0cmluZyB3aXRoIGEgcmVwbGFjZW1lbnQuXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IFN0cmluZ1xuICAgICAqIEBzaWcgUmVnRXhwfFN0cmluZyAtPiBTdHJpbmcgLT4gU3RyaW5nIC0+IFN0cmluZ1xuICAgICAqIEBwYXJhbSB7UmVnRXhwfFN0cmluZ30gcGF0dGVybiBBIHJlZ3VsYXIgZXhwcmVzc2lvbiBvciBhIHN1YnN0cmluZyB0byBtYXRjaC5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gcmVwbGFjZW1lbnQgVGhlIHN0cmluZyB0byByZXBsYWNlIHRoZSBtYXRjaGVzIHdpdGguXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHN0ciBUaGUgU3RyaW5nIHRvIGRvIHRoZSBzZWFyY2ggYW5kIHJlcGxhY2VtZW50IGluLlxuICAgICAqIEByZXR1cm4ge1N0cmluZ30gVGhlIHJlc3VsdC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICBSLnJlcGxhY2UoJ2ZvbycsICdiYXInLCAnZm9vIGZvbyBmb28nKTsgLy89PiAnYmFyIGZvbyBmb28nXG4gICAgICogICAgICBSLnJlcGxhY2UoL2Zvby8sICdiYXInLCAnZm9vIGZvbyBmb28nKTsgLy89PiAnYmFyIGZvbyBmb28nXG4gICAgICpcbiAgICAgKiAgICAgIC8vIFVzZSB0aGUgXCJnXCIgKGdsb2JhbCkgZmxhZyB0byByZXBsYWNlIGFsbCBvY2N1cnJlbmNlczpcbiAgICAgKiAgICAgIFIucmVwbGFjZSgvZm9vL2csICdiYXInLCAnZm9vIGZvbyBmb28nKTsgLy89PiAnYmFyIGJhciBiYXInXG4gICAgICovXG4gICAgdmFyIHJlcGxhY2UgPSBfY3VycnkzKGZ1bmN0aW9uIHJlcGxhY2UocmVnZXgsIHJlcGxhY2VtZW50LCBzdHIpIHtcbiAgICAgICAgcmV0dXJuIHN0ci5yZXBsYWNlKHJlZ2V4LCByZXBsYWNlbWVudCk7XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGEgbmV3IGxpc3Qgd2l0aCB0aGUgc2FtZSBlbGVtZW50cyBhcyB0aGUgb3JpZ2luYWwgbGlzdCwganVzdFxuICAgICAqIGluIHRoZSByZXZlcnNlIG9yZGVyLlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBMaXN0XG4gICAgICogQHNpZyBbYV0gLT4gW2FdXG4gICAgICogQHBhcmFtIHtBcnJheX0gbGlzdCBUaGUgbGlzdCB0byByZXZlcnNlLlxuICAgICAqIEByZXR1cm4ge0FycmF5fSBBIGNvcHkgb2YgdGhlIGxpc3QgaW4gcmV2ZXJzZSBvcmRlci5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICBSLnJldmVyc2UoWzEsIDIsIDNdKTsgIC8vPT4gWzMsIDIsIDFdXG4gICAgICogICAgICBSLnJldmVyc2UoWzEsIDJdKTsgICAgIC8vPT4gWzIsIDFdXG4gICAgICogICAgICBSLnJldmVyc2UoWzFdKTsgICAgICAgIC8vPT4gWzFdXG4gICAgICogICAgICBSLnJldmVyc2UoW10pOyAgICAgICAgIC8vPT4gW11cbiAgICAgKi9cbiAgICB2YXIgcmV2ZXJzZSA9IF9jdXJyeTEoZnVuY3Rpb24gcmV2ZXJzZShsaXN0KSB7XG4gICAgICAgIHJldHVybiBfc2xpY2UobGlzdCkucmV2ZXJzZSgpO1xuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogU2NhbiBpcyBzaW1pbGFyIHRvIHJlZHVjZSwgYnV0IHJldHVybnMgYSBsaXN0IG9mIHN1Y2Nlc3NpdmVseSByZWR1Y2VkIHZhbHVlcyBmcm9tIHRoZSBsZWZ0XG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IExpc3RcbiAgICAgKiBAc2lnIChhLGIgLT4gYSkgLT4gYSAtPiBbYl0gLT4gW2FdXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGl0ZXJhdG9yIGZ1bmN0aW9uLiBSZWNlaXZlcyB0d28gdmFsdWVzLCB0aGUgYWNjdW11bGF0b3IgYW5kIHRoZVxuICAgICAqICAgICAgICBjdXJyZW50IGVsZW1lbnQgZnJvbSB0aGUgYXJyYXlcbiAgICAgKiBAcGFyYW0geyp9IGFjYyBUaGUgYWNjdW11bGF0b3IgdmFsdWUuXG4gICAgICogQHBhcmFtIHtBcnJheX0gbGlzdCBUaGUgbGlzdCB0byBpdGVyYXRlIG92ZXIuXG4gICAgICogQHJldHVybiB7QXJyYXl9IEEgbGlzdCBvZiBhbGwgaW50ZXJtZWRpYXRlbHkgcmVkdWNlZCB2YWx1ZXMuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgdmFyIG51bWJlcnMgPSBbMSwgMiwgMywgNF07XG4gICAgICogICAgICB2YXIgZmFjdG9yaWFscyA9IFIuc2NhbihSLm11bHRpcGx5LCAxLCBudW1iZXJzKTsgLy89PiBbMSwgMSwgMiwgNiwgMjRdXG4gICAgICovXG4gICAgdmFyIHNjYW4gPSBfY3VycnkzKGZ1bmN0aW9uIHNjYW4oZm4sIGFjYywgbGlzdCkge1xuICAgICAgICB2YXIgaWR4ID0gMCwgbGVuID0gbGlzdC5sZW5ndGgsIHJlc3VsdCA9IFthY2NdO1xuICAgICAgICB3aGlsZSAoaWR4IDwgbGVuKSB7XG4gICAgICAgICAgICBhY2MgPSBmbihhY2MsIGxpc3RbaWR4XSk7XG4gICAgICAgICAgICByZXN1bHRbaWR4ICsgMV0gPSBhY2M7XG4gICAgICAgICAgICBpZHggKz0gMTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhIGNvcHkgb2YgdGhlIGxpc3QsIHNvcnRlZCBhY2NvcmRpbmcgdG8gdGhlIGNvbXBhcmF0b3IgZnVuY3Rpb24sIHdoaWNoIHNob3VsZCBhY2NlcHQgdHdvIHZhbHVlcyBhdCBhXG4gICAgICogdGltZSBhbmQgcmV0dXJuIGEgbmVnYXRpdmUgbnVtYmVyIGlmIHRoZSBmaXJzdCB2YWx1ZSBpcyBzbWFsbGVyLCBhIHBvc2l0aXZlIG51bWJlciBpZiBpdCdzIGxhcmdlciwgYW5kIHplcm9cbiAgICAgKiBpZiB0aGV5IGFyZSBlcXVhbC4gIFBsZWFzZSBub3RlIHRoYXQgdGhpcyBpcyBhICoqY29weSoqIG9mIHRoZSBsaXN0LiAgSXQgZG9lcyBub3QgbW9kaWZ5IHRoZSBvcmlnaW5hbC5cbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgTGlzdFxuICAgICAqIEBzaWcgKGEsYSAtPiBOdW1iZXIpIC0+IFthXSAtPiBbYV1cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjb21wYXJhdG9yIEEgc29ydGluZyBmdW5jdGlvbiA6OiBhIC0+IGIgLT4gSW50XG4gICAgICogQHBhcmFtIHtBcnJheX0gbGlzdCBUaGUgbGlzdCB0byBzb3J0XG4gICAgICogQHJldHVybiB7QXJyYXl9IGEgbmV3IGFycmF5IHdpdGggaXRzIGVsZW1lbnRzIHNvcnRlZCBieSB0aGUgY29tcGFyYXRvciBmdW5jdGlvbi5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICB2YXIgZGlmZiA9IGZ1bmN0aW9uKGEsIGIpIHsgcmV0dXJuIGEgLSBiOyB9O1xuICAgICAqICAgICAgUi5zb3J0KGRpZmYsIFs0LDIsNyw1XSk7IC8vPT4gWzIsIDQsIDUsIDddXG4gICAgICovXG4gICAgdmFyIHNvcnQgPSBfY3VycnkyKGZ1bmN0aW9uIHNvcnQoY29tcGFyYXRvciwgbGlzdCkge1xuICAgICAgICByZXR1cm4gX3NsaWNlKGxpc3QpLnNvcnQoY29tcGFyYXRvcik7XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBTb3J0cyB0aGUgbGlzdCBhY2NvcmRpbmcgdG8gdGhlIHN1cHBsaWVkIGZ1bmN0aW9uLlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBSZWxhdGlvblxuICAgICAqIEBzaWcgT3JkIGIgPT4gKGEgLT4gYikgLT4gW2FdIC0+IFthXVxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gICAgICogQHBhcmFtIHtBcnJheX0gbGlzdCBUaGUgbGlzdCB0byBzb3J0LlxuICAgICAqIEByZXR1cm4ge0FycmF5fSBBIG5ldyBsaXN0IHNvcnRlZCBieSB0aGUga2V5cyBnZW5lcmF0ZWQgYnkgYGZuYC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICB2YXIgc29ydEJ5Rmlyc3RJdGVtID0gUi5zb3J0QnkocHJvcCgwKSk7XG4gICAgICogICAgICB2YXIgc29ydEJ5TmFtZUNhc2VJbnNlbnNpdGl2ZSA9IFIuc29ydEJ5KGNvbXBvc2UoUi50b0xvd2VyLCBwcm9wKCduYW1lJykpKTtcbiAgICAgKiAgICAgIHZhciBwYWlycyA9IFtbLTEsIDFdLCBbLTIsIDJdLCBbLTMsIDNdXTtcbiAgICAgKiAgICAgIHNvcnRCeUZpcnN0SXRlbShwYWlycyk7IC8vPT4gW1stMywgM10sIFstMiwgMl0sIFstMSwgMV1dXG4gICAgICogICAgICB2YXIgYWxpY2UgPSB7XG4gICAgICogICAgICAgIG5hbWU6ICdBTElDRScsXG4gICAgICogICAgICAgIGFnZTogMTAxXG4gICAgICogICAgICB9O1xuICAgICAqICAgICAgdmFyIGJvYiA9IHtcbiAgICAgKiAgICAgICAgbmFtZTogJ0JvYicsXG4gICAgICogICAgICAgIGFnZTogLTEwXG4gICAgICogICAgICB9O1xuICAgICAqICAgICAgdmFyIGNsYXJhID0ge1xuICAgICAqICAgICAgICBuYW1lOiAnY2xhcmEnLFxuICAgICAqICAgICAgICBhZ2U6IDMxNC4xNTlcbiAgICAgKiAgICAgIH07XG4gICAgICogICAgICB2YXIgcGVvcGxlID0gW2NsYXJhLCBib2IsIGFsaWNlXTtcbiAgICAgKiAgICAgIHNvcnRCeU5hbWVDYXNlSW5zZW5zaXRpdmUocGVvcGxlKTsgLy89PiBbYWxpY2UsIGJvYiwgY2xhcmFdXG4gICAgICovXG4gICAgdmFyIHNvcnRCeSA9IF9jdXJyeTIoZnVuY3Rpb24gc29ydEJ5KGZuLCBsaXN0KSB7XG4gICAgICAgIHJldHVybiBfc2xpY2UobGlzdCkuc29ydChmdW5jdGlvbiAoYSwgYikge1xuICAgICAgICAgICAgdmFyIGFhID0gZm4oYSk7XG4gICAgICAgICAgICB2YXIgYmIgPSBmbihiKTtcbiAgICAgICAgICAgIHJldHVybiBhYSA8IGJiID8gLTEgOiBhYSA+IGJiID8gMSA6IDA7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogRmluZHMgdGhlIGZpcnN0IGluZGV4IG9mIGEgc3Vic3RyaW5nIGluIGEgc3RyaW5nLCByZXR1cm5pbmcgLTEgaWYgaXQncyBub3QgcHJlc2VudFxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBTdHJpbmdcbiAgICAgKiBAc2lnIFN0cmluZyAtPiBTdHJpbmcgLT4gTnVtYmVyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGMgQSBzdHJpbmcgdG8gZmluZC5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gc3RyIFRoZSBzdHJpbmcgdG8gc2VhcmNoIGluXG4gICAgICogQHJldHVybiB7TnVtYmVyfSBUaGUgZmlyc3QgaW5kZXggb2YgYGNgIG9yIC0xIGlmIG5vdCBmb3VuZC5cbiAgICAgKiBAZGVwcmVjYXRlZCBzaW5jZSB2MC4xNS4wXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgUi5zdHJJbmRleE9mKCdjJywgJ2FiY2RlZmcnKTsgLy89PiAyXG4gICAgICovXG4gICAgdmFyIHN0ckluZGV4T2YgPSBfY3VycnkyKGZ1bmN0aW9uIHN0ckluZGV4T2YoYywgc3RyKSB7XG4gICAgICAgIHJldHVybiBzdHIuaW5kZXhPZihjKTtcbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqXG4gICAgICogRmluZHMgdGhlIGxhc3QgaW5kZXggb2YgYSBzdWJzdHJpbmcgaW4gYSBzdHJpbmcsIHJldHVybmluZyAtMSBpZiBpdCdzIG5vdCBwcmVzZW50XG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IFN0cmluZ1xuICAgICAqIEBzaWcgU3RyaW5nIC0+IFN0cmluZyAtPiBOdW1iZXJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gYyBBIHN0cmluZyB0byBmaW5kLlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBzdHIgVGhlIHN0cmluZyB0byBzZWFyY2ggaW5cbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9IFRoZSBsYXN0IGluZGV4IG9mIGBjYCBvciAtMSBpZiBub3QgZm91bmQuXG4gICAgICogQGRlcHJlY2F0ZWQgc2luY2UgdjAuMTUuMFxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIFIuc3RyTGFzdEluZGV4T2YoJ2EnLCAnYmFuYW5hIHNwbGl0Jyk7IC8vPT4gNVxuICAgICAqL1xuICAgIHZhciBzdHJMYXN0SW5kZXhPZiA9IF9jdXJyeTIoZnVuY3Rpb24gKGMsIHN0cikge1xuICAgICAgICByZXR1cm4gc3RyLmxhc3RJbmRleE9mKGMpO1xuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogU3VidHJhY3RzIHR3byBudW1iZXJzLiBFcXVpdmFsZW50IHRvIGBhIC0gYmAgYnV0IGN1cnJpZWQuXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IE1hdGhcbiAgICAgKiBAc2lnIE51bWJlciAtPiBOdW1iZXIgLT4gTnVtYmVyXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGEgVGhlIGZpcnN0IHZhbHVlLlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBiIFRoZSBzZWNvbmQgdmFsdWUuXG4gICAgICogQHJldHVybiB7TnVtYmVyfSBUaGUgcmVzdWx0IG9mIGBhIC0gYmAuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgUi5zdWJ0cmFjdCgxMCwgOCk7IC8vPT4gMlxuICAgICAqXG4gICAgICogICAgICB2YXIgbWludXM1ID0gUi5zdWJ0cmFjdChSLl9fLCA1KTtcbiAgICAgKiAgICAgIG1pbnVzNSgxNyk7IC8vPT4gMTJcbiAgICAgKlxuICAgICAqICAgICAgdmFyIGNvbXBsZW1lbnRhcnlBbmdsZSA9IFIuc3VidHJhY3QoOTApO1xuICAgICAqICAgICAgY29tcGxlbWVudGFyeUFuZ2xlKDMwKTsgLy89PiA2MFxuICAgICAqICAgICAgY29tcGxlbWVudGFyeUFuZ2xlKDcyKTsgLy89PiAxOFxuICAgICAqL1xuICAgIHZhciBzdWJ0cmFjdCA9IF9jdXJyeTIoZnVuY3Rpb24gc3VidHJhY3QoYSwgYikge1xuICAgICAgICByZXR1cm4gYSAtIGI7XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBSdW5zIHRoZSBnaXZlbiBmdW5jdGlvbiB3aXRoIHRoZSBzdXBwbGllZCBvYmplY3QsIHRoZW4gcmV0dXJucyB0aGUgb2JqZWN0LlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBGdW5jdGlvblxuICAgICAqIEBzaWcgKGEgLT4gKikgLT4gYSAtPiBhXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGZ1bmN0aW9uIHRvIGNhbGwgd2l0aCBgeGAuIFRoZSByZXR1cm4gdmFsdWUgb2YgYGZuYCB3aWxsIGJlIHRocm93biBhd2F5LlxuICAgICAqIEBwYXJhbSB7Kn0geFxuICAgICAqIEByZXR1cm4geyp9IGB4YC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICB2YXIgc2F5WCA9IGZ1bmN0aW9uKHgpIHsgY29uc29sZS5sb2coJ3ggaXMgJyArIHgpOyB9O1xuICAgICAqICAgICAgUi50YXAoc2F5WCwgMTAwKTsgLy89PiAxMDBcbiAgICAgKiAgICAgIC8vLT4gJ3ggaXMgMTAwJ1xuICAgICAqL1xuICAgIHZhciB0YXAgPSBfY3VycnkyKGZ1bmN0aW9uIHRhcChmbiwgeCkge1xuICAgICAgICBmbih4KTtcbiAgICAgICAgcmV0dXJuIHg7XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBEZXRlcm1pbmVzIHdoZXRoZXIgYSBnaXZlbiBzdHJpbmcgbWF0Y2hlcyBhIGdpdmVuIHJlZ3VsYXIgZXhwcmVzc2lvbi5cbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgU3RyaW5nXG4gICAgICogQHNpZyBSZWdFeHAgLT4gU3RyaW5nIC0+IEJvb2xlYW5cbiAgICAgKiBAcGFyYW0ge1JlZ0V4cH0gcGF0dGVyblxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIFIudGVzdCgvXngvLCAneHl6Jyk7IC8vPT4gdHJ1ZVxuICAgICAqICAgICAgUi50ZXN0KC9eeS8sICd4eXonKTsgLy89PiBmYWxzZVxuICAgICAqL1xuICAgIHZhciB0ZXN0ID0gX2N1cnJ5MihmdW5jdGlvbiB0ZXN0KHBhdHRlcm4sIHN0cikge1xuICAgICAgICByZXR1cm4gX2Nsb25lUmVnRXhwKHBhdHRlcm4pLnRlc3Qoc3RyKTtcbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIENhbGxzIGFuIGlucHV0IGZ1bmN0aW9uIGBuYCB0aW1lcywgcmV0dXJuaW5nIGFuIGFycmF5IGNvbnRhaW5pbmcgdGhlIHJlc3VsdHMgb2YgdGhvc2VcbiAgICAgKiBmdW5jdGlvbiBjYWxscy5cbiAgICAgKlxuICAgICAqIGBmbmAgaXMgcGFzc2VkIG9uZSBhcmd1bWVudDogVGhlIGN1cnJlbnQgdmFsdWUgb2YgYG5gLCB3aGljaCBiZWdpbnMgYXQgYDBgIGFuZCBpc1xuICAgICAqIGdyYWR1YWxseSBpbmNyZW1lbnRlZCB0byBgbiAtIDFgLlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBMaXN0XG4gICAgICogQHNpZyAoaSAtPiBhKSAtPiBpIC0+IFthXVxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBmdW5jdGlvbiB0byBpbnZva2UuIFBhc3NlZCBvbmUgYXJndW1lbnQsIHRoZSBjdXJyZW50IHZhbHVlIG9mIGBuYC5cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gbiBBIHZhbHVlIGJldHdlZW4gYDBgIGFuZCBgbiAtIDFgLiBJbmNyZW1lbnRzIGFmdGVyIGVhY2ggZnVuY3Rpb24gY2FsbC5cbiAgICAgKiBAcmV0dXJuIHtBcnJheX0gQW4gYXJyYXkgY29udGFpbmluZyB0aGUgcmV0dXJuIHZhbHVlcyBvZiBhbGwgY2FsbHMgdG8gYGZuYC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICBSLnRpbWVzKFIuaWRlbnRpdHksIDUpOyAvLz0+IFswLCAxLCAyLCAzLCA0XVxuICAgICAqL1xuICAgIHZhciB0aW1lcyA9IF9jdXJyeTIoZnVuY3Rpb24gdGltZXMoZm4sIG4pIHtcbiAgICAgICAgdmFyIGxlbiA9IE51bWJlcihuKTtcbiAgICAgICAgdmFyIGxpc3QgPSBuZXcgQXJyYXkobGVuKTtcbiAgICAgICAgdmFyIGlkeCA9IDA7XG4gICAgICAgIHdoaWxlIChpZHggPCBsZW4pIHtcbiAgICAgICAgICAgIGxpc3RbaWR4XSA9IGZuKGlkeCk7XG4gICAgICAgICAgICBpZHggKz0gMTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbGlzdDtcbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIENvbnZlcnRzIGFuIG9iamVjdCBpbnRvIGFuIGFycmF5IG9mIGtleSwgdmFsdWUgYXJyYXlzLlxuICAgICAqIE9ubHkgdGhlIG9iamVjdCdzIG93biBwcm9wZXJ0aWVzIGFyZSB1c2VkLlxuICAgICAqIE5vdGUgdGhhdCB0aGUgb3JkZXIgb2YgdGhlIG91dHB1dCBhcnJheSBpcyBub3QgZ3VhcmFudGVlZCB0byBiZVxuICAgICAqIGNvbnNpc3RlbnQgYWNyb3NzIGRpZmZlcmVudCBKUyBwbGF0Zm9ybXMuXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IE9iamVjdFxuICAgICAqIEBzaWcge1N0cmluZzogKn0gLT4gW1tTdHJpbmcsKl1dXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9iaiBUaGUgb2JqZWN0IHRvIGV4dHJhY3QgZnJvbVxuICAgICAqIEByZXR1cm4ge0FycmF5fSBBbiBhcnJheSBvZiBrZXksIHZhbHVlIGFycmF5cyBmcm9tIHRoZSBvYmplY3QncyBvd24gcHJvcGVydGllcy5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICBSLnRvUGFpcnMoe2E6IDEsIGI6IDIsIGM6IDN9KTsgLy89PiBbWydhJywgMV0sIFsnYicsIDJdLCBbJ2MnLCAzXV1cbiAgICAgKi9cbiAgICB2YXIgdG9QYWlycyA9IF9jdXJyeTEoZnVuY3Rpb24gdG9QYWlycyhvYmopIHtcbiAgICAgICAgdmFyIHBhaXJzID0gW107XG4gICAgICAgIGZvciAodmFyIHByb3AgaW4gb2JqKSB7XG4gICAgICAgICAgICBpZiAoX2hhcyhwcm9wLCBvYmopKSB7XG4gICAgICAgICAgICAgICAgcGFpcnNbcGFpcnMubGVuZ3RoXSA9IFtcbiAgICAgICAgICAgICAgICAgICAgcHJvcCxcbiAgICAgICAgICAgICAgICAgICAgb2JqW3Byb3BdXG4gICAgICAgICAgICAgICAgXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcGFpcnM7XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBDb252ZXJ0cyBhbiBvYmplY3QgaW50byBhbiBhcnJheSBvZiBrZXksIHZhbHVlIGFycmF5cy5cbiAgICAgKiBUaGUgb2JqZWN0J3Mgb3duIHByb3BlcnRpZXMgYW5kIHByb3RvdHlwZSBwcm9wZXJ0aWVzIGFyZSB1c2VkLlxuICAgICAqIE5vdGUgdGhhdCB0aGUgb3JkZXIgb2YgdGhlIG91dHB1dCBhcnJheSBpcyBub3QgZ3VhcmFudGVlZCB0byBiZVxuICAgICAqIGNvbnNpc3RlbnQgYWNyb3NzIGRpZmZlcmVudCBKUyBwbGF0Zm9ybXMuXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IE9iamVjdFxuICAgICAqIEBzaWcge1N0cmluZzogKn0gLT4gW1tTdHJpbmcsKl1dXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9iaiBUaGUgb2JqZWN0IHRvIGV4dHJhY3QgZnJvbVxuICAgICAqIEByZXR1cm4ge0FycmF5fSBBbiBhcnJheSBvZiBrZXksIHZhbHVlIGFycmF5cyBmcm9tIHRoZSBvYmplY3QncyBvd25cbiAgICAgKiAgICAgICAgIGFuZCBwcm90b3R5cGUgcHJvcGVydGllcy5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICB2YXIgRiA9IGZ1bmN0aW9uKCkgeyB0aGlzLnggPSAnWCc7IH07XG4gICAgICogICAgICBGLnByb3RvdHlwZS55ID0gJ1knO1xuICAgICAqICAgICAgdmFyIGYgPSBuZXcgRigpO1xuICAgICAqICAgICAgUi50b1BhaXJzSW4oZik7IC8vPT4gW1sneCcsJ1gnXSwgWyd5JywnWSddXVxuICAgICAqL1xuICAgIHZhciB0b1BhaXJzSW4gPSBfY3VycnkxKGZ1bmN0aW9uIHRvUGFpcnNJbihvYmopIHtcbiAgICAgICAgdmFyIHBhaXJzID0gW107XG4gICAgICAgIGZvciAodmFyIHByb3AgaW4gb2JqKSB7XG4gICAgICAgICAgICBwYWlyc1twYWlycy5sZW5ndGhdID0gW1xuICAgICAgICAgICAgICAgIHByb3AsXG4gICAgICAgICAgICAgICAgb2JqW3Byb3BdXG4gICAgICAgICAgICBdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwYWlycztcbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIFJlbW92ZXMgKHN0cmlwcykgd2hpdGVzcGFjZSBmcm9tIGJvdGggZW5kcyBvZiB0aGUgc3RyaW5nLlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBTdHJpbmdcbiAgICAgKiBAc2lnIFN0cmluZyAtPiBTdHJpbmdcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gc3RyIFRoZSBzdHJpbmcgdG8gdHJpbS5cbiAgICAgKiBAcmV0dXJuIHtTdHJpbmd9IFRyaW1tZWQgdmVyc2lvbiBvZiBgc3RyYC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICBSLnRyaW0oJyAgIHh5eiAgJyk7IC8vPT4gJ3h5eidcbiAgICAgKiAgICAgIFIubWFwKFIudHJpbSwgUi5zcGxpdCgnLCcsICd4LCB5LCB6JykpOyAvLz0+IFsneCcsICd5JywgJ3onXVxuICAgICAqL1xuICAgIHZhciB0cmltID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgd3MgPSAnXFx0XFxuXFx4MEJcXGZcXHIgXFx4QTBcXHUxNjgwXFx1MTgwRVxcdTIwMDBcXHUyMDAxXFx1MjAwMlxcdTIwMDMnICsgJ1xcdTIwMDRcXHUyMDA1XFx1MjAwNlxcdTIwMDdcXHUyMDA4XFx1MjAwOVxcdTIwMEFcXHUyMDJGXFx1MjA1RlxcdTMwMDBcXHUyMDI4JyArICdcXHUyMDI5XFx1RkVGRic7XG4gICAgICAgIHZhciB6ZXJvV2lkdGggPSAnXFx1MjAwQic7XG4gICAgICAgIHZhciBoYXNQcm90b1RyaW0gPSB0eXBlb2YgU3RyaW5nLnByb3RvdHlwZS50cmltID09PSAnZnVuY3Rpb24nO1xuICAgICAgICBpZiAoIWhhc1Byb3RvVHJpbSB8fCAod3MudHJpbSgpIHx8ICF6ZXJvV2lkdGgudHJpbSgpKSkge1xuICAgICAgICAgICAgcmV0dXJuIF9jdXJyeTEoZnVuY3Rpb24gdHJpbShzdHIpIHtcbiAgICAgICAgICAgICAgICB2YXIgYmVnaW5SeCA9IG5ldyBSZWdFeHAoJ15bJyArIHdzICsgJ11bJyArIHdzICsgJ10qJyk7XG4gICAgICAgICAgICAgICAgdmFyIGVuZFJ4ID0gbmV3IFJlZ0V4cCgnWycgKyB3cyArICddWycgKyB3cyArICddKiQnKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gc3RyLnJlcGxhY2UoYmVnaW5SeCwgJycpLnJlcGxhY2UoZW5kUngsICcnKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIF9jdXJyeTEoZnVuY3Rpb24gdHJpbShzdHIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc3RyLnRyaW0oKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSgpO1xuXG4gICAgLyoqXG4gICAgICogR2l2ZXMgYSBzaW5nbGUtd29yZCBzdHJpbmcgZGVzY3JpcHRpb24gb2YgdGhlIChuYXRpdmUpIHR5cGUgb2YgYSB2YWx1ZSwgcmV0dXJuaW5nIHN1Y2hcbiAgICAgKiBhbnN3ZXJzIGFzICdPYmplY3QnLCAnTnVtYmVyJywgJ0FycmF5Jywgb3IgJ051bGwnLiAgRG9lcyBub3QgYXR0ZW1wdCB0byBkaXN0aW5ndWlzaCB1c2VyXG4gICAgICogT2JqZWN0IHR5cGVzIGFueSBmdXJ0aGVyLCByZXBvcnRpbmcgdGhlbSBhbGwgYXMgJ09iamVjdCcuXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IFR5cGVcbiAgICAgKiBAc2lnICgqIC0+IHsqfSkgLT4gU3RyaW5nXG4gICAgICogQHBhcmFtIHsqfSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAgICAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgUi50eXBlKHt9KTsgLy89PiBcIk9iamVjdFwiXG4gICAgICogICAgICBSLnR5cGUoMSk7IC8vPT4gXCJOdW1iZXJcIlxuICAgICAqICAgICAgUi50eXBlKGZhbHNlKTsgLy89PiBcIkJvb2xlYW5cIlxuICAgICAqICAgICAgUi50eXBlKCdzJyk7IC8vPT4gXCJTdHJpbmdcIlxuICAgICAqICAgICAgUi50eXBlKG51bGwpOyAvLz0+IFwiTnVsbFwiXG4gICAgICogICAgICBSLnR5cGUoW10pOyAvLz0+IFwiQXJyYXlcIlxuICAgICAqICAgICAgUi50eXBlKC9bQS16XS8pOyAvLz0+IFwiUmVnRXhwXCJcbiAgICAgKi9cbiAgICB2YXIgdHlwZSA9IF9jdXJyeTEoZnVuY3Rpb24gdHlwZSh2YWwpIHtcbiAgICAgICAgcmV0dXJuIHZhbCA9PT0gbnVsbCA/ICdOdWxsJyA6IHZhbCA9PT0gdW5kZWZpbmVkID8gJ1VuZGVmaW5lZCcgOiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsKS5zbGljZSg4LCAtMSk7XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBUYWtlcyBhIGZ1bmN0aW9uIGBmbmAsIHdoaWNoIHRha2VzIGEgc2luZ2xlIGFycmF5IGFyZ3VtZW50LCBhbmQgcmV0dXJuc1xuICAgICAqIGEgZnVuY3Rpb24gd2hpY2g6XG4gICAgICpcbiAgICAgKiAgIC0gdGFrZXMgYW55IG51bWJlciBvZiBwb3NpdGlvbmFsIGFyZ3VtZW50cztcbiAgICAgKiAgIC0gcGFzc2VzIHRoZXNlIGFyZ3VtZW50cyB0byBgZm5gIGFzIGFuIGFycmF5OyBhbmRcbiAgICAgKiAgIC0gcmV0dXJucyB0aGUgcmVzdWx0LlxuICAgICAqXG4gICAgICogSW4gb3RoZXIgd29yZHMsIFIudW5hcHBseSBkZXJpdmVzIGEgdmFyaWFkaWMgZnVuY3Rpb24gZnJvbSBhIGZ1bmN0aW9uXG4gICAgICogd2hpY2ggdGFrZXMgYW4gYXJyYXkuIFIudW5hcHBseSBpcyB0aGUgaW52ZXJzZSBvZiBSLmFwcGx5LlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBGdW5jdGlvblxuICAgICAqIEBzaWcgKFsqLi4uXSAtPiBhKSAtPiAoKi4uLiAtPiBhKVxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gICAgICogQHJldHVybiB7RnVuY3Rpb259XG4gICAgICogQHNlZSBSLmFwcGx5XG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgUi51bmFwcGx5KEpTT04uc3RyaW5naWZ5KSgxLCAyLCAzKTsgLy89PiAnWzEsMiwzXSdcbiAgICAgKi9cbiAgICB2YXIgdW5hcHBseSA9IF9jdXJyeTEoZnVuY3Rpb24gdW5hcHBseShmbikge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIGZuKF9zbGljZShhcmd1bWVudHMpKTtcbiAgICAgICAgfTtcbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIFdyYXBzIGEgZnVuY3Rpb24gb2YgYW55IGFyaXR5IChpbmNsdWRpbmcgbnVsbGFyeSkgaW4gYSBmdW5jdGlvbiB0aGF0IGFjY2VwdHMgZXhhY3RseSAxXG4gICAgICogcGFyYW1ldGVyLiBBbnkgZXh0cmFuZW91cyBwYXJhbWV0ZXJzIHdpbGwgbm90IGJlIHBhc3NlZCB0byB0aGUgc3VwcGxpZWQgZnVuY3Rpb24uXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IEZ1bmN0aW9uXG4gICAgICogQHNpZyAoKiAtPiBiKSAtPiAoYSAtPiBiKVxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBmdW5jdGlvbiB0byB3cmFwLlxuICAgICAqIEByZXR1cm4ge0Z1bmN0aW9ufSBBIG5ldyBmdW5jdGlvbiB3cmFwcGluZyBgZm5gLiBUaGUgbmV3IGZ1bmN0aW9uIGlzIGd1YXJhbnRlZWQgdG8gYmUgb2ZcbiAgICAgKiAgICAgICAgIGFyaXR5IDEuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgdmFyIHRha2VzVHdvQXJncyA9IGZ1bmN0aW9uKGEsIGIpIHtcbiAgICAgKiAgICAgICAgcmV0dXJuIFthLCBiXTtcbiAgICAgKiAgICAgIH07XG4gICAgICogICAgICB0YWtlc1R3b0FyZ3MubGVuZ3RoOyAvLz0+IDJcbiAgICAgKiAgICAgIHRha2VzVHdvQXJncygxLCAyKTsgLy89PiBbMSwgMl1cbiAgICAgKlxuICAgICAqICAgICAgdmFyIHRha2VzT25lQXJnID0gUi51bmFyeSh0YWtlc1R3b0FyZ3MpO1xuICAgICAqICAgICAgdGFrZXNPbmVBcmcubGVuZ3RoOyAvLz0+IDFcbiAgICAgKiAgICAgIC8vIE9ubHkgMSBhcmd1bWVudCBpcyBwYXNzZWQgdG8gdGhlIHdyYXBwZWQgZnVuY3Rpb25cbiAgICAgKiAgICAgIHRha2VzT25lQXJnKDEsIDIpOyAvLz0+IFsxLCB1bmRlZmluZWRdXG4gICAgICovXG4gICAgdmFyIHVuYXJ5ID0gX2N1cnJ5MShmdW5jdGlvbiB1bmFyeShmbikge1xuICAgICAgICByZXR1cm4gbkFyeSgxLCBmbik7XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBCdWlsZHMgYSBsaXN0IGZyb20gYSBzZWVkIHZhbHVlLiBBY2NlcHRzIGFuIGl0ZXJhdG9yIGZ1bmN0aW9uLCB3aGljaCByZXR1cm5zIGVpdGhlciBmYWxzZVxuICAgICAqIHRvIHN0b3AgaXRlcmF0aW9uIG9yIGFuIGFycmF5IG9mIGxlbmd0aCAyIGNvbnRhaW5pbmcgdGhlIHZhbHVlIHRvIGFkZCB0byB0aGUgcmVzdWx0aW5nXG4gICAgICogbGlzdCBhbmQgdGhlIHNlZWQgdG8gYmUgdXNlZCBpbiB0aGUgbmV4dCBjYWxsIHRvIHRoZSBpdGVyYXRvciBmdW5jdGlvbi5cbiAgICAgKlxuICAgICAqIFRoZSBpdGVyYXRvciBmdW5jdGlvbiByZWNlaXZlcyBvbmUgYXJndW1lbnQ6ICooc2VlZCkqLlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBMaXN0XG4gICAgICogQHNpZyAoYSAtPiBbYl0pIC0+ICogLT4gW2JdXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGl0ZXJhdG9yIGZ1bmN0aW9uLiByZWNlaXZlcyBvbmUgYXJndW1lbnQsIGBzZWVkYCwgYW5kIHJldHVybnNcbiAgICAgKiAgICAgICAgZWl0aGVyIGZhbHNlIHRvIHF1aXQgaXRlcmF0aW9uIG9yIGFuIGFycmF5IG9mIGxlbmd0aCB0d28gdG8gcHJvY2VlZC4gVGhlIGVsZW1lbnRcbiAgICAgKiAgICAgICAgYXQgaW5kZXggMCBvZiB0aGlzIGFycmF5IHdpbGwgYmUgYWRkZWQgdG8gdGhlIHJlc3VsdGluZyBhcnJheSwgYW5kIHRoZSBlbGVtZW50XG4gICAgICogICAgICAgIGF0IGluZGV4IDEgd2lsbCBiZSBwYXNzZWQgdG8gdGhlIG5leHQgY2FsbCB0byBgZm5gLlxuICAgICAqIEBwYXJhbSB7Kn0gc2VlZCBUaGUgc2VlZCB2YWx1ZS5cbiAgICAgKiBAcmV0dXJuIHtBcnJheX0gVGhlIGZpbmFsIGxpc3QuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgdmFyIGYgPSBmdW5jdGlvbihuKSB7IHJldHVybiBuID4gNTAgPyBmYWxzZSA6IFstbiwgbiArIDEwXSB9O1xuICAgICAqICAgICAgUi51bmZvbGQoZiwgMTApOyAvLz0+IFstMTAsIC0yMCwgLTMwLCAtNDAsIC01MF1cbiAgICAgKi9cbiAgICB2YXIgdW5mb2xkID0gX2N1cnJ5MihmdW5jdGlvbiB1bmZvbGQoZm4sIHNlZWQpIHtcbiAgICAgICAgdmFyIHBhaXIgPSBmbihzZWVkKTtcbiAgICAgICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgICAgICB3aGlsZSAocGFpciAmJiBwYWlyLmxlbmd0aCkge1xuICAgICAgICAgICAgcmVzdWx0W3Jlc3VsdC5sZW5ndGhdID0gcGFpclswXTtcbiAgICAgICAgICAgIHBhaXIgPSBmbihwYWlyWzFdKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhIG5ldyBsaXN0IGNvbnRhaW5pbmcgb25seSBvbmUgY29weSBvZiBlYWNoIGVsZW1lbnQgaW4gdGhlIG9yaWdpbmFsIGxpc3QsIGJhc2VkXG4gICAgICogdXBvbiB0aGUgdmFsdWUgcmV0dXJuZWQgYnkgYXBwbHlpbmcgdGhlIHN1cHBsaWVkIHByZWRpY2F0ZSB0byB0d28gbGlzdCBlbGVtZW50cy4gUHJlZmVyc1xuICAgICAqIHRoZSBmaXJzdCBpdGVtIGlmIHR3byBpdGVtcyBjb21wYXJlIGVxdWFsIGJhc2VkIG9uIHRoZSBwcmVkaWNhdGUuXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IExpc3RcbiAgICAgKiBAc2lnIChhLCBhIC0+IEJvb2xlYW4pIC0+IFthXSAtPiBbYV1cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBwcmVkIEEgcHJlZGljYXRlIHVzZWQgdG8gdGVzdCB3aGV0aGVyIHR3byBpdGVtcyBhcmUgZXF1YWwuXG4gICAgICogQHBhcmFtIHtBcnJheX0gbGlzdCBUaGUgYXJyYXkgdG8gY29uc2lkZXIuXG4gICAgICogQHJldHVybiB7QXJyYXl9IFRoZSBsaXN0IG9mIHVuaXF1ZSBpdGVtcy5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICB2YXIgc3RyRXEgPSBmdW5jdGlvbihhLCBiKSB7IHJldHVybiBTdHJpbmcoYSkgPT09IFN0cmluZyhiKTsgfTtcbiAgICAgKiAgICAgIFIudW5pcVdpdGgoc3RyRXEpKFsxLCAnMScsIDIsIDFdKTsgLy89PiBbMSwgMl1cbiAgICAgKiAgICAgIFIudW5pcVdpdGgoc3RyRXEpKFt7fSwge31dKTsgICAgICAgLy89PiBbe31dXG4gICAgICogICAgICBSLnVuaXFXaXRoKHN0ckVxKShbMSwgJzEnLCAxXSk7ICAgIC8vPT4gWzFdXG4gICAgICogICAgICBSLnVuaXFXaXRoKHN0ckVxKShbJzEnLCAxLCAxXSk7ICAgIC8vPT4gWycxJ11cbiAgICAgKi9cbiAgICB2YXIgdW5pcVdpdGggPSBfY3VycnkyKGZ1bmN0aW9uIHVuaXFXaXRoKHByZWQsIGxpc3QpIHtcbiAgICAgICAgdmFyIGlkeCA9IDAsIGxlbiA9IGxpc3QubGVuZ3RoO1xuICAgICAgICB2YXIgcmVzdWx0ID0gW10sIGl0ZW07XG4gICAgICAgIHdoaWxlIChpZHggPCBsZW4pIHtcbiAgICAgICAgICAgIGl0ZW0gPSBsaXN0W2lkeF07XG4gICAgICAgICAgICBpZiAoIV9jb250YWluc1dpdGgocHJlZCwgaXRlbSwgcmVzdWx0KSkge1xuICAgICAgICAgICAgICAgIHJlc3VsdFtyZXN1bHQubGVuZ3RoXSA9IGl0ZW07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZHggKz0gMTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhIG5ldyBjb3B5IG9mIHRoZSBhcnJheSB3aXRoIHRoZSBlbGVtZW50IGF0IHRoZVxuICAgICAqIHByb3ZpZGVkIGluZGV4IHJlcGxhY2VkIHdpdGggdGhlIGdpdmVuIHZhbHVlLlxuICAgICAqIEBzZWUgUi5hZGp1c3RcbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgTGlzdFxuICAgICAqIEBzaWcgTnVtYmVyIC0+IGEgLT4gW2FdIC0+IFthXVxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBpZHggVGhlIGluZGV4IHRvIHVwZGF0ZS5cbiAgICAgKiBAcGFyYW0geyp9IHggVGhlIHZhbHVlIHRvIGV4aXN0IGF0IHRoZSBnaXZlbiBpbmRleCBvZiB0aGUgcmV0dXJuZWQgYXJyYXkuXG4gICAgICogQHBhcmFtIHtBcnJheXxBcmd1bWVudHN9IGxpc3QgVGhlIHNvdXJjZSBhcnJheS1saWtlIG9iamVjdCB0byBiZSB1cGRhdGVkLlxuICAgICAqIEByZXR1cm4ge0FycmF5fSBBIGNvcHkgb2YgYGxpc3RgIHdpdGggdGhlIHZhbHVlIGF0IGluZGV4IGBpZHhgIHJlcGxhY2VkIHdpdGggYHhgLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIFIudXBkYXRlKDEsIDExLCBbMCwgMSwgMl0pOyAgICAgLy89PiBbMCwgMTEsIDJdXG4gICAgICogICAgICBSLnVwZGF0ZSgxKSgxMSkoWzAsIDEsIDJdKTsgICAgIC8vPT4gWzAsIDExLCAyXVxuICAgICAqL1xuICAgIHZhciB1cGRhdGUgPSBfY3VycnkzKGZ1bmN0aW9uIChpZHgsIHgsIGxpc3QpIHtcbiAgICAgICAgcmV0dXJuIGFkanVzdChhbHdheXMoeCksIGlkeCwgbGlzdCk7XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGEgbGlzdCBvZiBhbGwgdGhlIGVudW1lcmFibGUgb3duIHByb3BlcnRpZXMgb2YgdGhlIHN1cHBsaWVkIG9iamVjdC5cbiAgICAgKiBOb3RlIHRoYXQgdGhlIG9yZGVyIG9mIHRoZSBvdXRwdXQgYXJyYXkgaXMgbm90IGd1YXJhbnRlZWQgYWNyb3NzXG4gICAgICogZGlmZmVyZW50IEpTIHBsYXRmb3Jtcy5cbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgT2JqZWN0XG4gICAgICogQHNpZyB7azogdn0gLT4gW3ZdXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9iaiBUaGUgb2JqZWN0IHRvIGV4dHJhY3QgdmFsdWVzIGZyb21cbiAgICAgKiBAcmV0dXJuIHtBcnJheX0gQW4gYXJyYXkgb2YgdGhlIHZhbHVlcyBvZiB0aGUgb2JqZWN0J3Mgb3duIHByb3BlcnRpZXMuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgUi52YWx1ZXMoe2E6IDEsIGI6IDIsIGM6IDN9KTsgLy89PiBbMSwgMiwgM11cbiAgICAgKi9cbiAgICB2YXIgdmFsdWVzID0gX2N1cnJ5MShmdW5jdGlvbiB2YWx1ZXMob2JqKSB7XG4gICAgICAgIHZhciBwcm9wcyA9IGtleXMob2JqKTtcbiAgICAgICAgdmFyIGxlbiA9IHByb3BzLmxlbmd0aDtcbiAgICAgICAgdmFyIHZhbHMgPSBbXTtcbiAgICAgICAgdmFyIGlkeCA9IDA7XG4gICAgICAgIHdoaWxlIChpZHggPCBsZW4pIHtcbiAgICAgICAgICAgIHZhbHNbaWR4XSA9IG9ialtwcm9wc1tpZHhdXTtcbiAgICAgICAgICAgIGlkeCArPSAxO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB2YWxzO1xuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhIGxpc3Qgb2YgYWxsIHRoZSBwcm9wZXJ0aWVzLCBpbmNsdWRpbmcgcHJvdG90eXBlIHByb3BlcnRpZXMsXG4gICAgICogb2YgdGhlIHN1cHBsaWVkIG9iamVjdC5cbiAgICAgKiBOb3RlIHRoYXQgdGhlIG9yZGVyIG9mIHRoZSBvdXRwdXQgYXJyYXkgaXMgbm90IGd1YXJhbnRlZWQgdG8gYmVcbiAgICAgKiBjb25zaXN0ZW50IGFjcm9zcyBkaWZmZXJlbnQgSlMgcGxhdGZvcm1zLlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBPYmplY3RcbiAgICAgKiBAc2lnIHtrOiB2fSAtPiBbdl1cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb2JqIFRoZSBvYmplY3QgdG8gZXh0cmFjdCB2YWx1ZXMgZnJvbVxuICAgICAqIEByZXR1cm4ge0FycmF5fSBBbiBhcnJheSBvZiB0aGUgdmFsdWVzIG9mIHRoZSBvYmplY3QncyBvd24gYW5kIHByb3RvdHlwZSBwcm9wZXJ0aWVzLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIHZhciBGID0gZnVuY3Rpb24oKSB7IHRoaXMueCA9ICdYJzsgfTtcbiAgICAgKiAgICAgIEYucHJvdG90eXBlLnkgPSAnWSc7XG4gICAgICogICAgICB2YXIgZiA9IG5ldyBGKCk7XG4gICAgICogICAgICBSLnZhbHVlc0luKGYpOyAvLz0+IFsnWCcsICdZJ11cbiAgICAgKi9cbiAgICB2YXIgdmFsdWVzSW4gPSBfY3VycnkxKGZ1bmN0aW9uIHZhbHVlc0luKG9iaikge1xuICAgICAgICB2YXIgcHJvcCwgdnMgPSBbXTtcbiAgICAgICAgZm9yIChwcm9wIGluIG9iaikge1xuICAgICAgICAgICAgdnNbdnMubGVuZ3RoXSA9IG9ialtwcm9wXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdnM7XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBUYWtlcyBhIHNwZWMgb2JqZWN0IGFuZCBhIHRlc3Qgb2JqZWN0OyByZXR1cm5zIHRydWUgaWYgdGhlIHRlc3Qgc2F0aXNmaWVzXG4gICAgICogdGhlIHNwZWMuIEVhY2ggb2YgdGhlIHNwZWMncyBvd24gcHJvcGVydGllcyBtdXN0IGJlIGEgcHJlZGljYXRlIGZ1bmN0aW9uLlxuICAgICAqIEVhY2ggcHJlZGljYXRlIGlzIGFwcGxpZWQgdG8gdGhlIHZhbHVlIG9mIHRoZSBjb3JyZXNwb25kaW5nIHByb3BlcnR5IG9mXG4gICAgICogdGhlIHRlc3Qgb2JqZWN0LiBgd2hlcmVgIHJldHVybnMgdHJ1ZSBpZiBhbGwgdGhlIHByZWRpY2F0ZXMgcmV0dXJuIHRydWUsXG4gICAgICogZmFsc2Ugb3RoZXJ3aXNlLlxuICAgICAqXG4gICAgICogYHdoZXJlYCBpcyB3ZWxsIHN1aXRlZCB0byBkZWNsYXJhdGl2ZWx5IGV4cHJlc3NpbmcgY29uc3RyYWludHMgZm9yIG90aGVyXG4gICAgICogZnVuY3Rpb25zIHN1Y2ggYXMgYGZpbHRlcmAgYW5kIGBmaW5kYC5cbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgT2JqZWN0XG4gICAgICogQHNpZyB7U3RyaW5nOiAoKiAtPiBCb29sZWFuKX0gLT4ge1N0cmluZzogKn0gLT4gQm9vbGVhblxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBzcGVjXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHRlc3RPYmpcbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIC8vIHByZWQgOjogT2JqZWN0IC0+IEJvb2xlYW5cbiAgICAgKiAgICAgIHZhciBwcmVkID0gUi53aGVyZSh7XG4gICAgICogICAgICAgIGE6IFIuZXF1YWxzKCdmb28nKSxcbiAgICAgKiAgICAgICAgYjogUi5jb21wbGVtZW50KFIuZXF1YWxzKCdiYXInKSksXG4gICAgICogICAgICAgIHg6IFIuZ3QoXywgMTApLFxuICAgICAqICAgICAgICB5OiBSLmx0KF8sIDIwKVxuICAgICAqICAgICAgfSk7XG4gICAgICpcbiAgICAgKiAgICAgIHByZWQoe2E6ICdmb28nLCBiOiAneHh4JywgeDogMTEsIHk6IDE5fSk7IC8vPT4gdHJ1ZVxuICAgICAqICAgICAgcHJlZCh7YTogJ3h4eCcsIGI6ICd4eHgnLCB4OiAxMSwgeTogMTl9KTsgLy89PiBmYWxzZVxuICAgICAqICAgICAgcHJlZCh7YTogJ2ZvbycsIGI6ICdiYXInLCB4OiAxMSwgeTogMTl9KTsgLy89PiBmYWxzZVxuICAgICAqICAgICAgcHJlZCh7YTogJ2ZvbycsIGI6ICd4eHgnLCB4OiAxMCwgeTogMTl9KTsgLy89PiBmYWxzZVxuICAgICAqICAgICAgcHJlZCh7YTogJ2ZvbycsIGI6ICd4eHgnLCB4OiAxMSwgeTogMjB9KTsgLy89PiBmYWxzZVxuICAgICAqL1xuICAgIHZhciB3aGVyZSA9IF9jdXJyeTIoZnVuY3Rpb24gd2hlcmUoc3BlYywgdGVzdE9iaikge1xuICAgICAgICBmb3IgKHZhciBwcm9wIGluIHNwZWMpIHtcbiAgICAgICAgICAgIGlmIChfaGFzKHByb3AsIHNwZWMpICYmICFzcGVjW3Byb3BdKHRlc3RPYmpbcHJvcF0pKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIG5ldyBsaXN0IG91dCBvZiB0aGUgdHdvIHN1cHBsaWVkIGJ5IGNyZWF0aW5nIGVhY2ggcG9zc2libGVcbiAgICAgKiBwYWlyIGZyb20gdGhlIGxpc3RzLlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBMaXN0XG4gICAgICogQHNpZyBbYV0gLT4gW2JdIC0+IFtbYSxiXV1cbiAgICAgKiBAcGFyYW0ge0FycmF5fSBhcyBUaGUgZmlyc3QgbGlzdC5cbiAgICAgKiBAcGFyYW0ge0FycmF5fSBicyBUaGUgc2Vjb25kIGxpc3QuXG4gICAgICogQHJldHVybiB7QXJyYXl9IFRoZSBsaXN0IG1hZGUgYnkgY29tYmluaW5nIGVhY2ggcG9zc2libGUgcGFpciBmcm9tXG4gICAgICogICAgICAgICBgYXNgIGFuZCBgYnNgIGludG8gcGFpcnMgKGBbYSwgYl1gKS5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICBSLnhwcm9kKFsxLCAyXSwgWydhJywgJ2InXSk7IC8vPT4gW1sxLCAnYSddLCBbMSwgJ2InXSwgWzIsICdhJ10sIFsyLCAnYiddXVxuICAgICAqL1xuICAgIC8vID0geHByb2RXaXRoKHByZXBlbmQpOyAodGFrZXMgYWJvdXQgMyB0aW1lcyBhcyBsb25nLi4uKVxuICAgIHZhciB4cHJvZCA9IF9jdXJyeTIoZnVuY3Rpb24geHByb2QoYSwgYikge1xuICAgICAgICAvLyA9IHhwcm9kV2l0aChwcmVwZW5kKTsgKHRha2VzIGFib3V0IDMgdGltZXMgYXMgbG9uZy4uLilcbiAgICAgICAgdmFyIGlkeCA9IDA7XG4gICAgICAgIHZhciBpbGVuID0gYS5sZW5ndGg7XG4gICAgICAgIHZhciBqO1xuICAgICAgICB2YXIgamxlbiA9IGIubGVuZ3RoO1xuICAgICAgICB2YXIgcmVzdWx0ID0gW107XG4gICAgICAgIHdoaWxlIChpZHggPCBpbGVuKSB7XG4gICAgICAgICAgICBqID0gMDtcbiAgICAgICAgICAgIHdoaWxlIChqIDwgamxlbikge1xuICAgICAgICAgICAgICAgIHJlc3VsdFtyZXN1bHQubGVuZ3RoXSA9IFtcbiAgICAgICAgICAgICAgICAgICAgYVtpZHhdLFxuICAgICAgICAgICAgICAgICAgICBiW2pdXG4gICAgICAgICAgICAgICAgXTtcbiAgICAgICAgICAgICAgICBqICs9IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZHggKz0gMTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIG5ldyBsaXN0IG91dCBvZiB0aGUgdHdvIHN1cHBsaWVkIGJ5IHBhaXJpbmcgdXBcbiAgICAgKiBlcXVhbGx5LXBvc2l0aW9uZWQgaXRlbXMgZnJvbSBib3RoIGxpc3RzLiAgVGhlIHJldHVybmVkIGxpc3QgaXNcbiAgICAgKiB0cnVuY2F0ZWQgdG8gdGhlIGxlbmd0aCBvZiB0aGUgc2hvcnRlciBvZiB0aGUgdHdvIGlucHV0IGxpc3RzLlxuICAgICAqIE5vdGU6IGB6aXBgIGlzIGVxdWl2YWxlbnQgdG8gYHppcFdpdGgoZnVuY3Rpb24oYSwgYikgeyByZXR1cm4gW2EsIGJdIH0pYC5cbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgTGlzdFxuICAgICAqIEBzaWcgW2FdIC0+IFtiXSAtPiBbW2EsYl1dXG4gICAgICogQHBhcmFtIHtBcnJheX0gbGlzdDEgVGhlIGZpcnN0IGFycmF5IHRvIGNvbnNpZGVyLlxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGxpc3QyIFRoZSBzZWNvbmQgYXJyYXkgdG8gY29uc2lkZXIuXG4gICAgICogQHJldHVybiB7QXJyYXl9IFRoZSBsaXN0IG1hZGUgYnkgcGFpcmluZyB1cCBzYW1lLWluZGV4ZWQgZWxlbWVudHMgb2YgYGxpc3QxYCBhbmQgYGxpc3QyYC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICBSLnppcChbMSwgMiwgM10sIFsnYScsICdiJywgJ2MnXSk7IC8vPT4gW1sxLCAnYSddLCBbMiwgJ2InXSwgWzMsICdjJ11dXG4gICAgICovXG4gICAgdmFyIHppcCA9IF9jdXJyeTIoZnVuY3Rpb24gemlwKGEsIGIpIHtcbiAgICAgICAgdmFyIHJ2ID0gW107XG4gICAgICAgIHZhciBpZHggPSAwO1xuICAgICAgICB2YXIgbGVuID0gTWF0aC5taW4oYS5sZW5ndGgsIGIubGVuZ3RoKTtcbiAgICAgICAgd2hpbGUgKGlkeCA8IGxlbikge1xuICAgICAgICAgICAgcnZbaWR4XSA9IFtcbiAgICAgICAgICAgICAgICBhW2lkeF0sXG4gICAgICAgICAgICAgICAgYltpZHhdXG4gICAgICAgICAgICBdO1xuICAgICAgICAgICAgaWR4ICs9IDE7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJ2O1xuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIG5ldyBvYmplY3Qgb3V0IG9mIGEgbGlzdCBvZiBrZXlzIGFuZCBhIGxpc3Qgb2YgdmFsdWVzLlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBMaXN0XG4gICAgICogQHNpZyBbU3RyaW5nXSAtPiBbKl0gLT4ge1N0cmluZzogKn1cbiAgICAgKiBAcGFyYW0ge0FycmF5fSBrZXlzIFRoZSBhcnJheSB0aGF0IHdpbGwgYmUgcHJvcGVydGllcyBvbiB0aGUgb3V0cHV0IG9iamVjdC5cbiAgICAgKiBAcGFyYW0ge0FycmF5fSB2YWx1ZXMgVGhlIGxpc3Qgb2YgdmFsdWVzIG9uIHRoZSBvdXRwdXQgb2JqZWN0LlxuICAgICAqIEByZXR1cm4ge09iamVjdH0gVGhlIG9iamVjdCBtYWRlIGJ5IHBhaXJpbmcgdXAgc2FtZS1pbmRleGVkIGVsZW1lbnRzIG9mIGBrZXlzYCBhbmQgYHZhbHVlc2AuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgUi56aXBPYmooWydhJywgJ2InLCAnYyddLCBbMSwgMiwgM10pOyAvLz0+IHthOiAxLCBiOiAyLCBjOiAzfVxuICAgICAqL1xuICAgIHZhciB6aXBPYmogPSBfY3VycnkyKGZ1bmN0aW9uIHppcE9iaihrZXlzLCB2YWx1ZXMpIHtcbiAgICAgICAgdmFyIGlkeCA9IDAsIGxlbiA9IGtleXMubGVuZ3RoLCBvdXQgPSB7fTtcbiAgICAgICAgd2hpbGUgKGlkeCA8IGxlbikge1xuICAgICAgICAgICAgb3V0W2tleXNbaWR4XV0gPSB2YWx1ZXNbaWR4XTtcbiAgICAgICAgICAgIGlkeCArPSAxO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgbmV3IGxpc3Qgb3V0IG9mIHRoZSB0d28gc3VwcGxpZWQgYnkgYXBwbHlpbmcgdGhlIGZ1bmN0aW9uIHRvXG4gICAgICogZWFjaCBlcXVhbGx5LXBvc2l0aW9uZWQgcGFpciBpbiB0aGUgbGlzdHMuIFRoZSByZXR1cm5lZCBsaXN0IGlzXG4gICAgICogdHJ1bmNhdGVkIHRvIHRoZSBsZW5ndGggb2YgdGhlIHNob3J0ZXIgb2YgdGhlIHR3byBpbnB1dCBsaXN0cy5cbiAgICAgKlxuICAgICAqIEBmdW5jdGlvblxuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IExpc3RcbiAgICAgKiBAc2lnIChhLGIgLT4gYykgLT4gW2FdIC0+IFtiXSAtPiBbY11cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgZnVuY3Rpb24gdXNlZCB0byBjb21iaW5lIHRoZSB0d28gZWxlbWVudHMgaW50byBvbmUgdmFsdWUuXG4gICAgICogQHBhcmFtIHtBcnJheX0gbGlzdDEgVGhlIGZpcnN0IGFycmF5IHRvIGNvbnNpZGVyLlxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGxpc3QyIFRoZSBzZWNvbmQgYXJyYXkgdG8gY29uc2lkZXIuXG4gICAgICogQHJldHVybiB7QXJyYXl9IFRoZSBsaXN0IG1hZGUgYnkgY29tYmluaW5nIHNhbWUtaW5kZXhlZCBlbGVtZW50cyBvZiBgbGlzdDFgIGFuZCBgbGlzdDJgXG4gICAgICogICAgICAgICB1c2luZyBgZm5gLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIHZhciBmID0gZnVuY3Rpb24oeCwgeSkge1xuICAgICAqICAgICAgICAvLyAuLi5cbiAgICAgKiAgICAgIH07XG4gICAgICogICAgICBSLnppcFdpdGgoZiwgWzEsIDIsIDNdLCBbJ2EnLCAnYicsICdjJ10pO1xuICAgICAqICAgICAgLy89PiBbZigxLCAnYScpLCBmKDIsICdiJyksIGYoMywgJ2MnKV1cbiAgICAgKi9cbiAgICB2YXIgemlwV2l0aCA9IF9jdXJyeTMoZnVuY3Rpb24gemlwV2l0aChmbiwgYSwgYikge1xuICAgICAgICB2YXIgcnYgPSBbXSwgaWR4ID0gMCwgbGVuID0gTWF0aC5taW4oYS5sZW5ndGgsIGIubGVuZ3RoKTtcbiAgICAgICAgd2hpbGUgKGlkeCA8IGxlbikge1xuICAgICAgICAgICAgcnZbaWR4XSA9IGZuKGFbaWR4XSwgYltpZHhdKTtcbiAgICAgICAgICAgIGlkeCArPSAxO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBydjtcbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIEEgZnVuY3Rpb24gdGhhdCBhbHdheXMgcmV0dXJucyBgZmFsc2VgLiBBbnkgcGFzc2VkIGluIHBhcmFtZXRlcnMgYXJlIGlnbm9yZWQuXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IEZ1bmN0aW9uXG4gICAgICogQHNpZyAqIC0+IGZhbHNlXG4gICAgICogQHNlZSBSLmFsd2F5c1xuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59IGZhbHNlXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgUi5GKCk7IC8vPT4gZmFsc2VcbiAgICAgKi9cbiAgICB2YXIgRiA9IGFsd2F5cyhmYWxzZSk7XG5cbiAgICAvKipcbiAgICAgKiBBIGZ1bmN0aW9uIHRoYXQgYWx3YXlzIHJldHVybnMgYHRydWVgLiBBbnkgcGFzc2VkIGluIHBhcmFtZXRlcnMgYXJlIGlnbm9yZWQuXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IEZ1bmN0aW9uXG4gICAgICogQHNpZyAqIC0+IHRydWVcbiAgICAgKiBAc2VlIFIuYWx3YXlzXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn0gYHRydWVgLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIFIuVCgpOyAvLz0+IHRydWVcbiAgICAgKi9cbiAgICB2YXIgVCA9IGFsd2F5cyh0cnVlKTtcblxuICAgIHZhciBfYXBwZW5kID0gZnVuY3Rpb24gX2FwcGVuZChlbCwgbGlzdCkge1xuICAgICAgICByZXR1cm4gX2NvbmNhdChsaXN0LCBbZWxdKTtcbiAgICB9O1xuXG4gICAgdmFyIF9hc3NvY1BhdGggPSBmdW5jdGlvbiBfYXNzb2NQYXRoKHBhdGgsIHZhbCwgb2JqKSB7XG4gICAgICAgIHN3aXRjaCAocGF0aC5sZW5ndGgpIHtcbiAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgcmV0dXJuIG9iajtcbiAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgcmV0dXJuIF9hc3NvYyhwYXRoWzBdLCB2YWwsIG9iaik7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICByZXR1cm4gX2Fzc29jKHBhdGhbMF0sIF9hc3NvY1BhdGgoX3NsaWNlKHBhdGgsIDEpLCB2YWwsIE9iamVjdChvYmpbcGF0aFswXV0pKSwgb2JqKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBDb3BpZXMgYW4gb2JqZWN0LlxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBiZSBjb3BpZWRcbiAgICAgKiBAcGFyYW0ge0FycmF5fSByZWZGcm9tIEFycmF5IGNvbnRhaW5pbmcgdGhlIHNvdXJjZSByZWZlcmVuY2VzXG4gICAgICogQHBhcmFtIHtBcnJheX0gcmVmVG8gQXJyYXkgY29udGFpbmluZyB0aGUgY29waWVkIHNvdXJjZSByZWZlcmVuY2VzXG4gICAgICogQHJldHVybiB7Kn0gVGhlIGNvcGllZCB2YWx1ZS5cbiAgICAgKi9cbiAgICB2YXIgX2Jhc2VDb3B5ID0gZnVuY3Rpb24gX2Jhc2VDb3B5KHZhbHVlLCByZWZGcm9tLCByZWZUbykge1xuICAgICAgICB2YXIgY29weSA9IGZ1bmN0aW9uIGNvcHkoY29waWVkVmFsdWUpIHtcbiAgICAgICAgICAgIHZhciBsZW4gPSByZWZGcm9tLmxlbmd0aDtcbiAgICAgICAgICAgIHZhciBpZHggPSAwO1xuICAgICAgICAgICAgd2hpbGUgKGlkeCA8IGxlbikge1xuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0gcmVmRnJvbVtpZHhdKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZWZUb1tpZHhdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZHggKz0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlZkZyb21baWR4ICsgMV0gPSB2YWx1ZTtcbiAgICAgICAgICAgIHJlZlRvW2lkeCArIDFdID0gY29waWVkVmFsdWU7XG4gICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gdmFsdWUpIHtcbiAgICAgICAgICAgICAgICBjb3BpZWRWYWx1ZVtrZXldID0gX2Jhc2VDb3B5KHZhbHVlW2tleV0sIHJlZkZyb20sIHJlZlRvKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBjb3BpZWRWYWx1ZTtcbiAgICAgICAgfTtcbiAgICAgICAgc3dpdGNoICh0eXBlKHZhbHVlKSkge1xuICAgICAgICBjYXNlICdPYmplY3QnOlxuICAgICAgICAgICAgcmV0dXJuIGNvcHkoe30pO1xuICAgICAgICBjYXNlICdBcnJheSc6XG4gICAgICAgICAgICByZXR1cm4gY29weShbXSk7XG4gICAgICAgIGNhc2UgJ0RhdGUnOlxuICAgICAgICAgICAgcmV0dXJuIG5ldyBEYXRlKHZhbHVlKTtcbiAgICAgICAgY2FzZSAnUmVnRXhwJzpcbiAgICAgICAgICAgIHJldHVybiBfY2xvbmVSZWdFeHAodmFsdWUpO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFNpbWlsYXIgdG8gaGFzTWV0aG9kLCB0aGlzIGNoZWNrcyB3aGV0aGVyIGEgZnVuY3Rpb24gaGFzIGEgW21ldGhvZG5hbWVdXG4gICAgICogZnVuY3Rpb24uIElmIGl0IGlzbid0IGFuIGFycmF5IGl0IHdpbGwgZXhlY3V0ZSB0aGF0IGZ1bmN0aW9uIG90aGVyd2lzZSBpdCB3aWxsXG4gICAgICogZGVmYXVsdCB0byB0aGUgcmFtZGEgaW1wbGVtZW50YXRpb24uXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIHJhbWRhIGltcGxlbXRhdGlvblxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBtZXRob2RuYW1lIHByb3BlcnR5IHRvIGNoZWNrIGZvciBhIGN1c3RvbSBpbXBsZW1lbnRhdGlvblxuICAgICAqIEByZXR1cm4ge09iamVjdH0gV2hhdGV2ZXIgdGhlIHJldHVybiB2YWx1ZSBvZiB0aGUgbWV0aG9kIGlzLlxuICAgICAqL1xuICAgIHZhciBfY2hlY2tGb3JNZXRob2QgPSBmdW5jdGlvbiBfY2hlY2tGb3JNZXRob2QobWV0aG9kbmFtZSwgZm4pIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBsZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgICAgICAgICAgaWYgKGxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmbigpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIG9iaiA9IGFyZ3VtZW50c1tsZW5ndGggLSAxXTtcbiAgICAgICAgICAgIHJldHVybiBfaXNBcnJheShvYmopIHx8IHR5cGVvZiBvYmpbbWV0aG9kbmFtZV0gIT09ICdmdW5jdGlvbicgPyBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpIDogb2JqW21ldGhvZG5hbWVdLmFwcGx5KG9iaiwgX3NsaWNlKGFyZ3VtZW50cywgMCwgbGVuZ3RoIC0gMSkpO1xuICAgICAgICB9O1xuICAgIH07XG5cbiAgICB2YXIgX2NvbXBvc2VMID0gZnVuY3Rpb24gX2NvbXBvc2VMKGlubmVyTGVucywgb3V0ZXJMZW5zKSB7XG4gICAgICAgIHJldHVybiBsZW5zKF9jb21wb3NlKGlubmVyTGVucywgb3V0ZXJMZW5zKSwgZnVuY3Rpb24gKHgsIHNvdXJjZSkge1xuICAgICAgICAgICAgdmFyIG5ld0lubmVyVmFsdWUgPSBpbm5lckxlbnMuc2V0KHgsIG91dGVyTGVucyhzb3VyY2UpKTtcbiAgICAgICAgICAgIHJldHVybiBvdXRlckxlbnMuc2V0KG5ld0lubmVyVmFsdWUsIHNvdXJjZSk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBBIHJpZ2h0LWFzc29jaWF0aXZlIHR3by1hcmd1bWVudCBjb21wb3NpdGlvbiBmdW5jdGlvbiBsaWtlIGBfY29tcG9zZWBcbiAgICAgKiBidXQgd2l0aCBhdXRvbWF0aWMgaGFuZGxpbmcgb2YgcHJvbWlzZXMgKG9yLCBtb3JlIHByZWNpc2VseSxcbiAgICAgKiBcInRoZW5hYmxlc1wiKS4gVGhpcyBmdW5jdGlvbiBpcyB1c2VkIHRvIGNvbnN0cnVjdCBhIG1vcmUgZ2VuZXJhbFxuICAgICAqIGBjb21wb3NlUGAgZnVuY3Rpb24sIHdoaWNoIGFjY2VwdHMgYW55IG51bWJlciBvZiBhcmd1bWVudHMuXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEBjYXRlZ29yeSBGdW5jdGlvblxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGYgQSBmdW5jdGlvbi5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBnIEEgZnVuY3Rpb24uXG4gICAgICogQHJldHVybiB7RnVuY3Rpb259IEEgbmV3IGZ1bmN0aW9uIHRoYXQgaXMgdGhlIGVxdWl2YWxlbnQgb2YgYGYoZyh4KSlgLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIHZhciBRID0gcmVxdWlyZSgncScpO1xuICAgICAqICAgICAgdmFyIGRvdWJsZSA9IGZ1bmN0aW9uKHgpIHsgcmV0dXJuIHggKiAyOyB9O1xuICAgICAqICAgICAgdmFyIHNxdWFyZUFzeW5jID0gZnVuY3Rpb24oeCkgeyByZXR1cm4gUS53aGVuKHggKiB4KTsgfTtcbiAgICAgKiAgICAgIHZhciBzcXVhcmVBc3luY1RoZW5Eb3VibGUgPSBfY29tcG9zZVAoZG91YmxlLCBzcXVhcmVBc3luYyk7XG4gICAgICpcbiAgICAgKiAgICAgIHNxdWFyZUFzeW5jVGhlbkRvdWJsZSg1KVxuICAgICAqICAgICAgICAudGhlbihmdW5jdGlvbihyZXN1bHQpIHtcbiAgICAgKiAgICAgICAgICAvLyB0aGUgcmVzdWx0IGlzIG5vdyA1MC5cbiAgICAgKiAgICAgICAgfSk7XG4gICAgICovXG4gICAgdmFyIF9jb21wb3NlUCA9IGZ1bmN0aW9uIF9jb21wb3NlUChmLCBnKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgY29udGV4dCA9IHRoaXM7XG4gICAgICAgICAgICB2YXIgdmFsdWUgPSBnLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICBpZiAoX2lzVGhlbmFibGUodmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlLnRoZW4oZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZi5jYWxsKGNvbnRleHQsIHJlc3VsdCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBmLmNhbGwodGhpcywgdmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH07XG5cbiAgICAvKlxuICAgICAqIFJldHVybnMgYSBmdW5jdGlvbiB0aGF0IG1ha2VzIGEgbXVsdGktYXJndW1lbnQgdmVyc2lvbiBvZiBjb21wb3NlIGZyb21cbiAgICAgKiBlaXRoZXIgX2NvbXBvc2Ugb3IgX2NvbXBvc2VQLlxuICAgICAqL1xuICAgIHZhciBfY3JlYXRlQ29tcG9zZXIgPSBmdW5jdGlvbiBfY3JlYXRlQ29tcG9zZXIoY29tcG9zZUZ1bmN0aW9uKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgZm4gPSBhcmd1bWVudHNbYXJndW1lbnRzLmxlbmd0aCAtIDFdO1xuICAgICAgICAgICAgdmFyIGxlbmd0aCA9IGZuLmxlbmd0aDtcbiAgICAgICAgICAgIHZhciBpZHggPSBhcmd1bWVudHMubGVuZ3RoIC0gMjtcbiAgICAgICAgICAgIHdoaWxlIChpZHggPj0gMCkge1xuICAgICAgICAgICAgICAgIGZuID0gY29tcG9zZUZ1bmN0aW9uKGFyZ3VtZW50c1tpZHhdLCBmbik7XG4gICAgICAgICAgICAgICAgaWR4IC09IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gYXJpdHkobGVuZ3RoLCBmbik7XG4gICAgICAgIH07XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIENyZWF0ZSBhIGZ1bmN0aW9uIHdoaWNoIHRha2VzIGEgbGlzdFxuICAgICAqIGFuZCBkZXRlcm1pbmVzIHRoZSB3aW5uaW5nIHZhbHVlIGJ5IGEgY29tcGFyYXRvci4gVXNlZCBpbnRlcm5hbGx5XG4gICAgICogYnkgYFIubWF4YCBhbmQgYFIubWluYFxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjb21wYXRhdG9yIGEgZnVuY3Rpb24gdG8gY29tcGFyZSB0d28gaXRlbXNcbiAgICAgKiBAcGFyYW0geyp9IGludGlhbFZhbCwgZGVmYXVsdCB2YWx1ZSBpZiBub3RoaW5nIGVsc2Ugd2luc1xuICAgICAqIEBjYXRlZ29yeSBNYXRoXG4gICAgICogQHJldHVybiB7RnVuY3Rpb259XG4gICAgICovXG4gICAgdmFyIF9jcmVhdGVNYXhNaW4gPSBmdW5jdGlvbiBfY3JlYXRlTWF4TWluKGNvbXBhcmF0b3IsIGluaXRpYWxWYWwpIHtcbiAgICAgICAgcmV0dXJuIF9jdXJyeTEoZnVuY3Rpb24gKGxpc3QpIHtcbiAgICAgICAgICAgIHZhciBpZHggPSAwLCB3aW5uZXIgPSBpbml0aWFsVmFsLCBjb21wdXRlZDtcbiAgICAgICAgICAgIHdoaWxlIChpZHggPCBsaXN0Lmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGNvbXB1dGVkID0gK2xpc3RbaWR4XTtcbiAgICAgICAgICAgICAgICBpZiAoY29tcGFyYXRvcihjb21wdXRlZCwgd2lubmVyKSkge1xuICAgICAgICAgICAgICAgICAgICB3aW5uZXIgPSBjb21wdXRlZDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWR4ICs9IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gd2lubmVyO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgdmFyIF9jcmVhdGVQYXJ0aWFsQXBwbGljYXRvciA9IGZ1bmN0aW9uIF9jcmVhdGVQYXJ0aWFsQXBwbGljYXRvcihjb25jYXQpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChmbikge1xuICAgICAgICAgICAgdmFyIGFyZ3MgPSBfc2xpY2UoYXJndW1lbnRzLCAxKTtcbiAgICAgICAgICAgIHJldHVybiBhcml0eShNYXRoLm1heCgwLCBmbi5sZW5ndGggLSBhcmdzLmxlbmd0aCksIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZm4uYXBwbHkodGhpcywgY29uY2F0KGFyZ3MsIGFyZ3VtZW50cykpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEludGVybmFsIGN1cnJ5TiBmdW5jdGlvbi5cbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQGNhdGVnb3J5IEZ1bmN0aW9uXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGxlbmd0aCBUaGUgYXJpdHkgb2YgdGhlIGN1cnJpZWQgZnVuY3Rpb24uXG4gICAgICogQHJldHVybiB7YXJyYXl9IEFuIGFycmF5IG9mIGFyZ3VtZW50cyByZWNlaXZlZCB0aHVzIGZhci5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgZnVuY3Rpb24gdG8gY3VycnkuXG4gICAgICovXG4gICAgdmFyIF9jdXJyeU4gPSBmdW5jdGlvbiBfY3VycnlOKGxlbmd0aCwgcmVjZWl2ZWQsIGZuKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgY29tYmluZWQgPSBbXTtcbiAgICAgICAgICAgIHZhciBhcmdzSWR4ID0gMDtcbiAgICAgICAgICAgIHZhciBsZWZ0ID0gbGVuZ3RoO1xuICAgICAgICAgICAgdmFyIGNvbWJpbmVkSWR4ID0gMDtcbiAgICAgICAgICAgIHdoaWxlIChjb21iaW5lZElkeCA8IHJlY2VpdmVkLmxlbmd0aCB8fCBhcmdzSWR4IDwgYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHZhciByZXN1bHQ7XG4gICAgICAgICAgICAgICAgaWYgKGNvbWJpbmVkSWR4IDwgcmVjZWl2ZWQubGVuZ3RoICYmIChyZWNlaXZlZFtjb21iaW5lZElkeF0gPT0gbnVsbCB8fCByZWNlaXZlZFtjb21iaW5lZElkeF1bJ0BAZnVuY3Rpb25hbC9wbGFjZWhvbGRlciddICE9PSB0cnVlIHx8IGFyZ3NJZHggPj0gYXJndW1lbnRzLmxlbmd0aCkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gcmVjZWl2ZWRbY29tYmluZWRJZHhdO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IGFyZ3VtZW50c1thcmdzSWR4XTtcbiAgICAgICAgICAgICAgICAgICAgYXJnc0lkeCArPSAxO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb21iaW5lZFtjb21iaW5lZElkeF0gPSByZXN1bHQ7XG4gICAgICAgICAgICAgICAgaWYgKHJlc3VsdCA9PSBudWxsIHx8IHJlc3VsdFsnQEBmdW5jdGlvbmFsL3BsYWNlaG9sZGVyJ10gIT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgbGVmdCAtPSAxO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb21iaW5lZElkeCArPSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGxlZnQgPD0gMCA/IGZuLmFwcGx5KHRoaXMsIGNvbWJpbmVkKSA6IGFyaXR5KGxlZnQsIF9jdXJyeU4obGVuZ3RoLCBjb21iaW5lZCwgZm4pKTtcbiAgICAgICAgfTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgZGlzcGF0Y2hlcyB3aXRoIGRpZmZlcmVudCBzdHJhdGVnaWVzIGJhc2VkIG9uIHRoZVxuICAgICAqIG9iamVjdCBpbiBsaXN0IHBvc2l0aW9uIChsYXN0IGFyZ3VtZW50KS4gSWYgaXQgaXMgYW4gYXJyYXksIGV4ZWN1dGVzIFtmbl0uXG4gICAgICogT3RoZXJ3aXNlLCBpZiBpdCBoYXMgYSAgZnVuY3Rpb24gd2l0aCBbbWV0aG9kbmFtZV0sIGl0IHdpbGwgZXhlY3V0ZSB0aGF0XG4gICAgICogZnVuY3Rpb24gKGZ1bmN0b3IgY2FzZSkuIE90aGVyd2lzZSwgaWYgaXQgaXMgYSB0cmFuc2Zvcm1lciwgdXNlcyB0cmFuc2R1Y2VyXG4gICAgICogW3hmXSB0byByZXR1cm4gYSBuZXcgdHJhbnNmb3JtZXIgKHRyYW5zZHVjZXIgY2FzZSkuIE90aGVyd2lzZSwgaXQgd2lsbFxuICAgICAqIGRlZmF1bHQgdG8gZXhlY3V0aW5nIFtmbl0uXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBtZXRob2RuYW1lIHByb3BlcnR5IHRvIGNoZWNrIGZvciBhIGN1c3RvbSBpbXBsZW1lbnRhdGlvblxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IHhmIHRyYW5zZHVjZXIgdG8gaW5pdGlhbGl6ZSBpZiBvYmplY3QgaXMgdHJhbnNmb3JtZXJcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBkZWZhdWx0IHJhbWRhIGltcGxlbWVudGF0aW9uXG4gICAgICogQHJldHVybiB7RnVuY3Rpb259IEEgZnVuY3Rpb24gdGhhdCBkaXNwYXRjaGVzIG9uIG9iamVjdCBpbiBsaXN0IHBvc2l0aW9uXG4gICAgICovXG4gICAgdmFyIF9kaXNwYXRjaGFibGUgPSBmdW5jdGlvbiBfZGlzcGF0Y2hhYmxlKG1ldGhvZG5hbWUsIHhmLCBmbikge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGxlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgICAgICAgICBpZiAobGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgb2JqID0gYXJndW1lbnRzW2xlbmd0aCAtIDFdO1xuICAgICAgICAgICAgaWYgKCFfaXNBcnJheShvYmopKSB7XG4gICAgICAgICAgICAgICAgdmFyIGFyZ3MgPSBfc2xpY2UoYXJndW1lbnRzLCAwLCBsZW5ndGggLSAxKTtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIG9ialttZXRob2RuYW1lXSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gb2JqW21ldGhvZG5hbWVdLmFwcGx5KG9iaiwgYXJncyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChfaXNUcmFuc2Zvcm1lcihvYmopKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciB0cmFuc2R1Y2VyID0geGYuYXBwbHkobnVsbCwgYXJncyk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cmFuc2R1Y2VyKG9iaik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgIH07XG4gICAgfTtcblxuICAgIHZhciBfZGlzc29jUGF0aCA9IGZ1bmN0aW9uIF9kaXNzb2NQYXRoKHBhdGgsIG9iaikge1xuICAgICAgICBzd2l0Y2ggKHBhdGgubGVuZ3RoKSB7XG4gICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgIHJldHVybiBvYmo7XG4gICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgIHJldHVybiBfZGlzc29jKHBhdGhbMF0sIG9iaik7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICB2YXIgaGVhZCA9IHBhdGhbMF07XG4gICAgICAgICAgICB2YXIgdGFpbCA9IF9zbGljZShwYXRoLCAxKTtcbiAgICAgICAgICAgIHJldHVybiBvYmpbaGVhZF0gPT0gbnVsbCA/IG9iaiA6IF9hc3NvYyhoZWFkLCBfZGlzc29jUGF0aCh0YWlsLCBvYmpbaGVhZF0pLCBvYmopO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8vIFRoZSBhbGdvcml0aG0gdXNlZCB0byBoYW5kbGUgY3ljbGljIHN0cnVjdHVyZXMgaXNcbiAgICAvLyBpbnNwaXJlZCBieSB1bmRlcnNjb3JlJ3MgaXNFcXVhbFxuICAgIC8vIFJlZ0V4cCBlcXVhbGl0eSBhbGdvcml0aG06IGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzEwNzc2NjM1XG4gICAgdmFyIF9lcXVhbHMgPSBmdW5jdGlvbiBfZXFEZWVwKGEsIGIsIHN0YWNrQSwgc3RhY2tCKSB7XG4gICAgICAgIHZhciB0eXBlQSA9IHR5cGUoYSk7XG4gICAgICAgIGlmICh0eXBlQSAhPT0gdHlwZShiKSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlQSA9PT0gJ0Jvb2xlYW4nIHx8IHR5cGVBID09PSAnTnVtYmVyJyB8fCB0eXBlQSA9PT0gJ1N0cmluZycpIHtcbiAgICAgICAgICAgIHJldHVybiB0eXBlb2YgYSA9PT0gJ29iamVjdCcgPyB0eXBlb2YgYiA9PT0gJ29iamVjdCcgJiYgaWRlbnRpY2FsKGEudmFsdWVPZigpLCBiLnZhbHVlT2YoKSkgOiBpZGVudGljYWwoYSwgYik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlkZW50aWNhbChhLCBiKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVBID09PSAnUmVnRXhwJykge1xuICAgICAgICAgICAgLy8gUmVnRXhwIGVxdWFsaXR5IGFsZ29yaXRobTogaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMTA3NzY2MzVcbiAgICAgICAgICAgIHJldHVybiBhLnNvdXJjZSA9PT0gYi5zb3VyY2UgJiYgYS5nbG9iYWwgPT09IGIuZ2xvYmFsICYmIGEuaWdub3JlQ2FzZSA9PT0gYi5pZ25vcmVDYXNlICYmIGEubXVsdGlsaW5lID09PSBiLm11bHRpbGluZSAmJiBhLnN0aWNreSA9PT0gYi5zdGlja3kgJiYgYS51bmljb2RlID09PSBiLnVuaWNvZGU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKE9iamVjdChhKSA9PT0gYSkge1xuICAgICAgICAgICAgaWYgKHR5cGVBID09PSAnRGF0ZScgJiYgYS5nZXRUaW1lKCkgIT09IGIuZ2V0VGltZSgpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGtleXNBID0ga2V5cyhhKTtcbiAgICAgICAgICAgIGlmIChrZXlzQS5sZW5ndGggIT09IGtleXMoYikubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGlkeCA9IHN0YWNrQS5sZW5ndGggLSAxO1xuICAgICAgICAgICAgd2hpbGUgKGlkeCA+PSAwKSB7XG4gICAgICAgICAgICAgICAgaWYgKHN0YWNrQVtpZHhdID09PSBhKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzdGFja0JbaWR4XSA9PT0gYjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWR4IC09IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzdGFja0Fbc3RhY2tBLmxlbmd0aF0gPSBhO1xuICAgICAgICAgICAgc3RhY2tCW3N0YWNrQi5sZW5ndGhdID0gYjtcbiAgICAgICAgICAgIGlkeCA9IGtleXNBLmxlbmd0aCAtIDE7XG4gICAgICAgICAgICB3aGlsZSAoaWR4ID49IDApIHtcbiAgICAgICAgICAgICAgICB2YXIga2V5ID0ga2V5c0FbaWR4XTtcbiAgICAgICAgICAgICAgICBpZiAoIV9oYXMoa2V5LCBiKSB8fCAhX2VxRGVlcChiW2tleV0sIGFba2V5XSwgc3RhY2tBLCBzdGFja0IpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWR4IC09IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzdGFja0EucG9wKCk7XG4gICAgICAgICAgICBzdGFja0IucG9wKCk7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEFzc2lnbnMgb3duIGVudW1lcmFibGUgcHJvcGVydGllcyBvZiB0aGUgb3RoZXIgb2JqZWN0IHRvIHRoZSBkZXN0aW5hdGlvblxuICAgICAqIG9iamVjdCBwcmVmZXJyaW5nIGl0ZW1zIGluIG90aGVyLlxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBPYmplY3RcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZGVzdGluYXRpb24gVGhlIGRlc3RpbmF0aW9uIG9iamVjdC5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb3RoZXIgVGhlIG90aGVyIG9iamVjdCB0byBtZXJnZSB3aXRoIGRlc3RpbmF0aW9uLlxuICAgICAqIEByZXR1cm4ge09iamVjdH0gVGhlIGRlc3RpbmF0aW9uIG9iamVjdC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICBfZXh0ZW5kKHsgJ25hbWUnOiAnZnJlZCcsICdhZ2UnOiAxMCB9LCB7ICdhZ2UnOiA0MCB9KTtcbiAgICAgKiAgICAgIC8vPT4geyAnbmFtZSc6ICdmcmVkJywgJ2FnZSc6IDQwIH1cbiAgICAgKi9cbiAgICB2YXIgX2V4dGVuZCA9IGZ1bmN0aW9uIF9leHRlbmQoZGVzdGluYXRpb24sIG90aGVyKSB7XG4gICAgICAgIHZhciBwcm9wcyA9IGtleXMob3RoZXIpO1xuICAgICAgICB2YXIgaWR4ID0gMCwgbGVuZ3RoID0gcHJvcHMubGVuZ3RoO1xuICAgICAgICB3aGlsZSAoaWR4IDwgbGVuZ3RoKSB7XG4gICAgICAgICAgICBkZXN0aW5hdGlvbltwcm9wc1tpZHhdXSA9IG90aGVyW3Byb3BzW2lkeF1dO1xuICAgICAgICAgICAgaWR4ICs9IDE7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRlc3RpbmF0aW9uO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBQcml2YXRlIGZ1bmN0aW9uIHRoYXQgZGV0ZXJtaW5lcyB3aGV0aGVyIG9yIG5vdCBhIHByb3ZpZGVkIG9iamVjdCBoYXMgYSBnaXZlbiBtZXRob2QuXG4gICAgICogRG9lcyBub3QgaWdub3JlIG1ldGhvZHMgc3RvcmVkIG9uIHRoZSBvYmplY3QncyBwcm90b3R5cGUgY2hhaW4uIFVzZWQgZm9yIGR5bmFtaWNhbGx5XG4gICAgICogZGlzcGF0Y2hpbmcgUmFtZGEgbWV0aG9kcyB0byBub24tQXJyYXkgb2JqZWN0cy5cbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IG1ldGhvZE5hbWUgVGhlIG5hbWUgb2YgdGhlIG1ldGhvZCB0byBjaGVjayBmb3IuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9iaiBUaGUgb2JqZWN0IHRvIHRlc3QuXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn0gYHRydWVgIGhhcyBhIGdpdmVuIG1ldGhvZCwgYGZhbHNlYCBvdGhlcndpc2UuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgdmFyIHBlcnNvbiA9IHsgbmFtZTogJ0pvaG4nIH07XG4gICAgICogICAgICBwZXJzb24uc2hvdXQgPSBmdW5jdGlvbigpIHsgYWxlcnQodGhpcy5uYW1lKTsgfTtcbiAgICAgKlxuICAgICAqICAgICAgX2hhc01ldGhvZCgnc2hvdXQnLCBwZXJzb24pOyAvLz0+IHRydWVcbiAgICAgKiAgICAgIF9oYXNNZXRob2QoJ2ZvbycsIHBlcnNvbik7IC8vPT4gZmFsc2VcbiAgICAgKi9cbiAgICB2YXIgX2hhc01ldGhvZCA9IGZ1bmN0aW9uIF9oYXNNZXRob2QobWV0aG9kTmFtZSwgb2JqKSB7XG4gICAgICAgIHJldHVybiBvYmogIT0gbnVsbCAmJiAhX2lzQXJyYXkob2JqKSAmJiB0eXBlb2Ygb2JqW21ldGhvZE5hbWVdID09PSAnZnVuY3Rpb24nO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBgX21ha2VGbGF0YCBpcyBhIGhlbHBlciBmdW5jdGlvbiB0aGF0IHJldHVybnMgYSBvbmUtbGV2ZWwgb3IgZnVsbHkgcmVjdXJzaXZlIGZ1bmN0aW9uXG4gICAgICogYmFzZWQgb24gdGhlIGZsYWcgcGFzc2VkIGluLlxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICB2YXIgX21ha2VGbGF0ID0gZnVuY3Rpb24gX21ha2VGbGF0KHJlY3Vyc2l2ZSkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gZmxhdHQobGlzdCkge1xuICAgICAgICAgICAgdmFyIHZhbHVlLCByZXN1bHQgPSBbXSwgaWR4ID0gMCwgaiwgaWxlbiA9IGxpc3QubGVuZ3RoLCBqbGVuO1xuICAgICAgICAgICAgd2hpbGUgKGlkeCA8IGlsZW4pIHtcbiAgICAgICAgICAgICAgICBpZiAoaXNBcnJheUxpa2UobGlzdFtpZHhdKSkge1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHJlY3Vyc2l2ZSA/IGZsYXR0KGxpc3RbaWR4XSkgOiBsaXN0W2lkeF07XG4gICAgICAgICAgICAgICAgICAgIGogPSAwO1xuICAgICAgICAgICAgICAgICAgICBqbGVuID0gdmFsdWUubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICB3aGlsZSAoaiA8IGpsZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdFtyZXN1bHQubGVuZ3RoXSA9IHZhbHVlW2pdO1xuICAgICAgICAgICAgICAgICAgICAgICAgaiArPSAxO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0W3Jlc3VsdC5sZW5ndGhdID0gbGlzdFtpZHhdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZHggKz0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH07XG4gICAgfTtcblxuICAgIHZhciBfcmVkdWNlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBmdW5jdGlvbiBfYXJyYXlSZWR1Y2UoeGYsIGFjYywgbGlzdCkge1xuICAgICAgICAgICAgdmFyIGlkeCA9IDAsIGxlbiA9IGxpc3QubGVuZ3RoO1xuICAgICAgICAgICAgd2hpbGUgKGlkeCA8IGxlbikge1xuICAgICAgICAgICAgICAgIGFjYyA9IHhmWydAQHRyYW5zZHVjZXIvc3RlcCddKGFjYywgbGlzdFtpZHhdKTtcbiAgICAgICAgICAgICAgICBpZiAoYWNjICYmIGFjY1snQEB0cmFuc2R1Y2VyL3JlZHVjZWQnXSkge1xuICAgICAgICAgICAgICAgICAgICBhY2MgPSBhY2NbJ0BAdHJhbnNkdWNlci92YWx1ZSddO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWR4ICs9IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4geGZbJ0BAdHJhbnNkdWNlci9yZXN1bHQnXShhY2MpO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIF9pdGVyYWJsZVJlZHVjZSh4ZiwgYWNjLCBpdGVyKSB7XG4gICAgICAgICAgICB2YXIgc3RlcCA9IGl0ZXIubmV4dCgpO1xuICAgICAgICAgICAgd2hpbGUgKCFzdGVwLmRvbmUpIHtcbiAgICAgICAgICAgICAgICBhY2MgPSB4ZlsnQEB0cmFuc2R1Y2VyL3N0ZXAnXShhY2MsIHN0ZXAudmFsdWUpO1xuICAgICAgICAgICAgICAgIGlmIChhY2MgJiYgYWNjWydAQHRyYW5zZHVjZXIvcmVkdWNlZCddKSB7XG4gICAgICAgICAgICAgICAgICAgIGFjYyA9IGFjY1snQEB0cmFuc2R1Y2VyL3ZhbHVlJ107XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzdGVwID0gaXRlci5uZXh0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4geGZbJ0BAdHJhbnNkdWNlci9yZXN1bHQnXShhY2MpO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIF9tZXRob2RSZWR1Y2UoeGYsIGFjYywgb2JqKSB7XG4gICAgICAgICAgICByZXR1cm4geGZbJ0BAdHJhbnNkdWNlci9yZXN1bHQnXShvYmoucmVkdWNlKGJpbmQoeGZbJ0BAdHJhbnNkdWNlci9zdGVwJ10sIHhmKSwgYWNjKSk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHN5bUl0ZXJhdG9yID0gdHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgPyBTeW1ib2wuaXRlcmF0b3IgOiAnQEBpdGVyYXRvcic7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiBfcmVkdWNlKGZuLCBhY2MsIGxpc3QpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZm4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICBmbiA9IF94d3JhcChmbik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaXNBcnJheUxpa2UobGlzdCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gX2FycmF5UmVkdWNlKGZuLCBhY2MsIGxpc3QpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHR5cGVvZiBsaXN0LnJlZHVjZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgIHJldHVybiBfbWV0aG9kUmVkdWNlKGZuLCBhY2MsIGxpc3QpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGxpc3Rbc3ltSXRlcmF0b3JdICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gX2l0ZXJhYmxlUmVkdWNlKGZuLCBhY2MsIGxpc3Rbc3ltSXRlcmF0b3JdKCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHR5cGVvZiBsaXN0Lm5leHQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gX2l0ZXJhYmxlUmVkdWNlKGZuLCBhY2MsIGxpc3QpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcigncmVkdWNlOiBsaXN0IG11c3QgYmUgYXJyYXkgb3IgaXRlcmFibGUnKTtcbiAgICAgICAgfTtcbiAgICB9KCk7XG5cbiAgICB2YXIgX3hhbGwgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGZ1bmN0aW9uIFhBbGwoZiwgeGYpIHtcbiAgICAgICAgICAgIHRoaXMueGYgPSB4ZjtcbiAgICAgICAgICAgIHRoaXMuZiA9IGY7XG4gICAgICAgICAgICB0aGlzLmFsbCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgWEFsbC5wcm90b3R5cGVbJ0BAdHJhbnNkdWNlci9pbml0J10gPSBfeGZCYXNlLmluaXQ7XG4gICAgICAgIFhBbGwucHJvdG90eXBlWydAQHRyYW5zZHVjZXIvcmVzdWx0J10gPSBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgICBpZiAodGhpcy5hbGwpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQgPSB0aGlzLnhmWydAQHRyYW5zZHVjZXIvc3RlcCddKHJlc3VsdCwgdHJ1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcy54ZlsnQEB0cmFuc2R1Y2VyL3Jlc3VsdCddKHJlc3VsdCk7XG4gICAgICAgIH07XG4gICAgICAgIFhBbGwucHJvdG90eXBlWydAQHRyYW5zZHVjZXIvc3RlcCddID0gZnVuY3Rpb24gKHJlc3VsdCwgaW5wdXQpIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5mKGlucHV0KSkge1xuICAgICAgICAgICAgICAgIHRoaXMuYWxsID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gX3JlZHVjZWQodGhpcy54ZlsnQEB0cmFuc2R1Y2VyL3N0ZXAnXShyZXN1bHQsIGZhbHNlKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gX2N1cnJ5MihmdW5jdGlvbiBfeGFsbChmLCB4Zikge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBYQWxsKGYsIHhmKTtcbiAgICAgICAgfSk7XG4gICAgfSgpO1xuXG4gICAgdmFyIF94YW55ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBmdW5jdGlvbiBYQW55KGYsIHhmKSB7XG4gICAgICAgICAgICB0aGlzLnhmID0geGY7XG4gICAgICAgICAgICB0aGlzLmYgPSBmO1xuICAgICAgICAgICAgdGhpcy5hbnkgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBYQW55LnByb3RvdHlwZVsnQEB0cmFuc2R1Y2VyL2luaXQnXSA9IF94ZkJhc2UuaW5pdDtcbiAgICAgICAgWEFueS5wcm90b3R5cGVbJ0BAdHJhbnNkdWNlci9yZXN1bHQnXSA9IGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5hbnkpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQgPSB0aGlzLnhmWydAQHRyYW5zZHVjZXIvc3RlcCddKHJlc3VsdCwgZmFsc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMueGZbJ0BAdHJhbnNkdWNlci9yZXN1bHQnXShyZXN1bHQpO1xuICAgICAgICB9O1xuICAgICAgICBYQW55LnByb3RvdHlwZVsnQEB0cmFuc2R1Y2VyL3N0ZXAnXSA9IGZ1bmN0aW9uIChyZXN1bHQsIGlucHV0KSB7XG4gICAgICAgICAgICBpZiAodGhpcy5mKGlucHV0KSkge1xuICAgICAgICAgICAgICAgIHRoaXMuYW55ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBfcmVkdWNlZCh0aGlzLnhmWydAQHRyYW5zZHVjZXIvc3RlcCddKHJlc3VsdCwgdHJ1ZSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIF9jdXJyeTIoZnVuY3Rpb24gX3hhbnkoZiwgeGYpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgWEFueShmLCB4Zik7XG4gICAgICAgIH0pO1xuICAgIH0oKTtcblxuICAgIHZhciBfeGRyb3AgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGZ1bmN0aW9uIFhEcm9wKG4sIHhmKSB7XG4gICAgICAgICAgICB0aGlzLnhmID0geGY7XG4gICAgICAgICAgICB0aGlzLm4gPSBuO1xuICAgICAgICB9XG4gICAgICAgIFhEcm9wLnByb3RvdHlwZVsnQEB0cmFuc2R1Y2VyL2luaXQnXSA9IF94ZkJhc2UuaW5pdDtcbiAgICAgICAgWERyb3AucHJvdG90eXBlWydAQHRyYW5zZHVjZXIvcmVzdWx0J10gPSBfeGZCYXNlLnJlc3VsdDtcbiAgICAgICAgWERyb3AucHJvdG90eXBlLnN0ZXAgPSBmdW5jdGlvbiAocmVzdWx0LCBpbnB1dCkge1xuICAgICAgICAgICAgaWYgKHRoaXMubiA+IDApIHtcbiAgICAgICAgICAgICAgICB0aGlzLm4gLT0gMTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMueGZbJ0BAdHJhbnNkdWNlci9zdGVwJ10ocmVzdWx0LCBpbnB1dCk7XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBfY3VycnkyKGZ1bmN0aW9uIF94ZHJvcChuLCB4Zikge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBYRHJvcChuLCB4Zik7XG4gICAgICAgIH0pO1xuICAgIH0oKTtcblxuICAgIHZhciBfeGRyb3BXaGlsZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZnVuY3Rpb24gWERyb3BXaGlsZShmLCB4Zikge1xuICAgICAgICAgICAgdGhpcy54ZiA9IHhmO1xuICAgICAgICAgICAgdGhpcy5mID0gZjtcbiAgICAgICAgfVxuICAgICAgICBYRHJvcFdoaWxlLnByb3RvdHlwZVsnQEB0cmFuc2R1Y2VyL2luaXQnXSA9IF94ZkJhc2UuaW5pdDtcbiAgICAgICAgWERyb3BXaGlsZS5wcm90b3R5cGVbJ0BAdHJhbnNkdWNlci9yZXN1bHQnXSA9IF94ZkJhc2UucmVzdWx0O1xuICAgICAgICBYRHJvcFdoaWxlLnByb3RvdHlwZVsnQEB0cmFuc2R1Y2VyL3N0ZXAnXSA9IGZ1bmN0aW9uIChyZXN1bHQsIGlucHV0KSB7XG4gICAgICAgICAgICBpZiAodGhpcy5mKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZihpbnB1dCkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5mID0gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzLnhmWydAQHRyYW5zZHVjZXIvc3RlcCddKHJlc3VsdCwgaW5wdXQpO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gX2N1cnJ5MihmdW5jdGlvbiBfeGRyb3BXaGlsZShmLCB4Zikge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBYRHJvcFdoaWxlKGYsIHhmKTtcbiAgICAgICAgfSk7XG4gICAgfSgpO1xuXG4gICAgdmFyIF94Z3JvdXBCeSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZnVuY3Rpb24gWEdyb3VwQnkoZiwgeGYpIHtcbiAgICAgICAgICAgIHRoaXMueGYgPSB4ZjtcbiAgICAgICAgICAgIHRoaXMuZiA9IGY7XG4gICAgICAgICAgICB0aGlzLmlucHV0cyA9IHt9O1xuICAgICAgICB9XG4gICAgICAgIFhHcm91cEJ5LnByb3RvdHlwZVsnQEB0cmFuc2R1Y2VyL2luaXQnXSA9IF94ZkJhc2UuaW5pdDtcbiAgICAgICAgWEdyb3VwQnkucHJvdG90eXBlWydAQHRyYW5zZHVjZXIvcmVzdWx0J10gPSBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgICB2YXIga2V5O1xuICAgICAgICAgICAgZm9yIChrZXkgaW4gdGhpcy5pbnB1dHMpIHtcbiAgICAgICAgICAgICAgICBpZiAoX2hhcyhrZXksIHRoaXMuaW5wdXRzKSkge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSB0aGlzLnhmWydAQHRyYW5zZHVjZXIvc3RlcCddKHJlc3VsdCwgdGhpcy5pbnB1dHNba2V5XSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHRbJ0BAdHJhbnNkdWNlci9yZWR1Y2VkJ10pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IHJlc3VsdFsnQEB0cmFuc2R1Y2VyL3ZhbHVlJ107XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzLnhmWydAQHRyYW5zZHVjZXIvcmVzdWx0J10ocmVzdWx0KTtcbiAgICAgICAgfTtcbiAgICAgICAgWEdyb3VwQnkucHJvdG90eXBlWydAQHRyYW5zZHVjZXIvc3RlcCddID0gZnVuY3Rpb24gKHJlc3VsdCwgaW5wdXQpIHtcbiAgICAgICAgICAgIHZhciBrZXkgPSB0aGlzLmYoaW5wdXQpO1xuICAgICAgICAgICAgdGhpcy5pbnB1dHNba2V5XSA9IHRoaXMuaW5wdXRzW2tleV0gfHwgW1xuICAgICAgICAgICAgICAgIGtleSxcbiAgICAgICAgICAgICAgICBbXVxuICAgICAgICAgICAgXTtcbiAgICAgICAgICAgIHRoaXMuaW5wdXRzW2tleV1bMV0gPSBfYXBwZW5kKGlucHV0LCB0aGlzLmlucHV0c1trZXldWzFdKTtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBfY3VycnkyKGZ1bmN0aW9uIF94Z3JvdXBCeShmLCB4Zikge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBYR3JvdXBCeShmLCB4Zik7XG4gICAgICAgIH0pO1xuICAgIH0oKTtcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYHRydWVgIGlmIGFsbCBlbGVtZW50cyBvZiB0aGUgbGlzdCBtYXRjaCB0aGUgcHJlZGljYXRlLCBgZmFsc2VgIGlmIHRoZXJlIGFyZSBhbnlcbiAgICAgKiB0aGF0IGRvbid0LlxuICAgICAqXG4gICAgICogQWN0cyBhcyBhIHRyYW5zZHVjZXIgaWYgYSB0cmFuc2Zvcm1lciBpcyBnaXZlbiBpbiBsaXN0IHBvc2l0aW9uLlxuICAgICAqIEBzZWUgUi50cmFuc2R1Y2VcbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgTGlzdFxuICAgICAqIEBzaWcgKGEgLT4gQm9vbGVhbikgLT4gW2FdIC0+IEJvb2xlYW5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgcHJlZGljYXRlIGZ1bmN0aW9uLlxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGxpc3QgVGhlIGFycmF5IHRvIGNvbnNpZGVyLlxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59IGB0cnVlYCBpZiB0aGUgcHJlZGljYXRlIGlzIHNhdGlzZmllZCBieSBldmVyeSBlbGVtZW50LCBgZmFsc2VgXG4gICAgICogICAgICAgICBvdGhlcndpc2UuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgdmFyIGxlc3NUaGFuMiA9IFIuZmxpcChSLmx0KSgyKTtcbiAgICAgKiAgICAgIHZhciBsZXNzVGhhbjMgPSBSLmZsaXAoUi5sdCkoMyk7XG4gICAgICogICAgICBSLmFsbChsZXNzVGhhbjIpKFsxLCAyXSk7IC8vPT4gZmFsc2VcbiAgICAgKiAgICAgIFIuYWxsKGxlc3NUaGFuMykoWzEsIDJdKTsgLy89PiB0cnVlXG4gICAgICovXG4gICAgdmFyIGFsbCA9IF9jdXJyeTIoX2Rpc3BhdGNoYWJsZSgnYWxsJywgX3hhbGwsIF9hbGwpKTtcblxuICAgIC8qKlxuICAgICAqIEEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIHRoZSBmaXJzdCBhcmd1bWVudCBpZiBpdCdzIGZhbHN5IG90aGVyd2lzZSB0aGUgc2Vjb25kXG4gICAgICogYXJndW1lbnQuIE5vdGUgdGhhdCB0aGlzIGlzIE5PVCBzaG9ydC1jaXJjdWl0ZWQsIG1lYW5pbmcgdGhhdCBpZiBleHByZXNzaW9uc1xuICAgICAqIGFyZSBwYXNzZWQgdGhleSBhcmUgYm90aCBldmFsdWF0ZWQuXG4gICAgICpcbiAgICAgKiBEaXNwYXRjaGVzIHRvIHRoZSBgYW5kYCBtZXRob2Qgb2YgdGhlIGZpcnN0IGFyZ3VtZW50IGlmIGFwcGxpY2FibGUuXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IExvZ2ljXG4gICAgICogQHNpZyAqIC0+ICogLT4gKlxuICAgICAqIEBwYXJhbSB7Kn0gYSBhbnkgdmFsdWVcbiAgICAgKiBAcGFyYW0geyp9IGIgYW55IG90aGVyIHZhbHVlXG4gICAgICogQHJldHVybiB7Kn0gdGhlIGZpcnN0IGFyZ3VtZW50IGlmIGZhbHN5IG90aGVyd2lzZSB0aGUgc2Vjb25kIGFyZ3VtZW50LlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIFIuYW5kKGZhbHNlLCB0cnVlKTsgLy89PiBmYWxzZVxuICAgICAqICAgICAgUi5hbmQoMCwgW10pOyAvLz0+IDBcbiAgICAgKiAgICAgIFIuYW5kKG51bGwsICcnKTsgPT4gbnVsbFxuICAgICAqL1xuICAgIHZhciBhbmQgPSBfY3VycnkyKGZ1bmN0aW9uIGFuZChhLCBiKSB7XG4gICAgICAgIHJldHVybiBfaGFzTWV0aG9kKCdhbmQnLCBhKSA/IGEuYW5kKGIpIDogYSAmJiBiO1xuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBgdHJ1ZWAgaWYgYXQgbGVhc3Qgb25lIG9mIGVsZW1lbnRzIG9mIHRoZSBsaXN0IG1hdGNoIHRoZSBwcmVkaWNhdGUsIGBmYWxzZWBcbiAgICAgKiBvdGhlcndpc2UuXG4gICAgICpcbiAgICAgKiBBY3RzIGFzIGEgdHJhbnNkdWNlciBpZiBhIHRyYW5zZm9ybWVyIGlzIGdpdmVuIGluIGxpc3QgcG9zaXRpb24uXG4gICAgICogQHNlZSBSLnRyYW5zZHVjZVxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBMaXN0XG4gICAgICogQHNpZyAoYSAtPiBCb29sZWFuKSAtPiBbYV0gLT4gQm9vbGVhblxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBwcmVkaWNhdGUgZnVuY3Rpb24uXG4gICAgICogQHBhcmFtIHtBcnJheX0gbGlzdCBUaGUgYXJyYXkgdG8gY29uc2lkZXIuXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn0gYHRydWVgIGlmIHRoZSBwcmVkaWNhdGUgaXMgc2F0aXNmaWVkIGJ5IGF0IGxlYXN0IG9uZSBlbGVtZW50LCBgZmFsc2VgXG4gICAgICogICAgICAgICBvdGhlcndpc2UuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgdmFyIGxlc3NUaGFuMCA9IFIuZmxpcChSLmx0KSgwKTtcbiAgICAgKiAgICAgIHZhciBsZXNzVGhhbjIgPSBSLmZsaXAoUi5sdCkoMik7XG4gICAgICogICAgICBSLmFueShsZXNzVGhhbjApKFsxLCAyXSk7IC8vPT4gZmFsc2VcbiAgICAgKiAgICAgIFIuYW55KGxlc3NUaGFuMikoWzEsIDJdKTsgLy89PiB0cnVlXG4gICAgICovXG4gICAgdmFyIGFueSA9IF9jdXJyeTIoX2Rpc3BhdGNoYWJsZSgnYW55JywgX3hhbnksIF9hbnkpKTtcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYSBuZXcgbGlzdCBjb250YWluaW5nIHRoZSBjb250ZW50cyBvZiB0aGUgZ2l2ZW4gbGlzdCwgZm9sbG93ZWQgYnkgdGhlIGdpdmVuXG4gICAgICogZWxlbWVudC5cbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgTGlzdFxuICAgICAqIEBzaWcgYSAtPiBbYV0gLT4gW2FdXG4gICAgICogQHBhcmFtIHsqfSBlbCBUaGUgZWxlbWVudCB0byBhZGQgdG8gdGhlIGVuZCBvZiB0aGUgbmV3IGxpc3QuXG4gICAgICogQHBhcmFtIHtBcnJheX0gbGlzdCBUaGUgbGlzdCB3aG9zZSBjb250ZW50cyB3aWxsIGJlIGFkZGVkIHRvIHRoZSBiZWdpbm5pbmcgb2YgdGhlIG91dHB1dFxuICAgICAqICAgICAgICBsaXN0LlxuICAgICAqIEByZXR1cm4ge0FycmF5fSBBIG5ldyBsaXN0IGNvbnRhaW5pbmcgdGhlIGNvbnRlbnRzIG9mIHRoZSBvbGQgbGlzdCBmb2xsb3dlZCBieSBgZWxgLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIFIuYXBwZW5kKCd0ZXN0cycsIFsnd3JpdGUnLCAnbW9yZSddKTsgLy89PiBbJ3dyaXRlJywgJ21vcmUnLCAndGVzdHMnXVxuICAgICAqICAgICAgUi5hcHBlbmQoJ3Rlc3RzJywgW10pOyAvLz0+IFsndGVzdHMnXVxuICAgICAqICAgICAgUi5hcHBlbmQoWyd0ZXN0cyddLCBbJ3dyaXRlJywgJ21vcmUnXSk7IC8vPT4gWyd3cml0ZScsICdtb3JlJywgWyd0ZXN0cyddXVxuICAgICAqL1xuICAgIHZhciBhcHBlbmQgPSBfY3VycnkyKF9hcHBlbmQpO1xuXG4gICAgLyoqXG4gICAgICogTWFrZXMgYSBzaGFsbG93IGNsb25lIG9mIGFuIG9iamVjdCwgc2V0dGluZyBvciBvdmVycmlkaW5nIHRoZSBub2Rlc1xuICAgICAqIHJlcXVpcmVkIHRvIGNyZWF0ZSB0aGUgZ2l2ZW4gcGF0aCwgYW5kIHBsYWNpbmcgdGhlIHNwZWNpZmljIHZhbHVlIGF0IHRoZVxuICAgICAqIHRhaWwgZW5kIG9mIHRoYXQgcGF0aC4gIE5vdGUgdGhhdCB0aGlzIGNvcGllcyBhbmQgZmxhdHRlbnMgcHJvdG90eXBlXG4gICAgICogcHJvcGVydGllcyBvbnRvIHRoZSBuZXcgb2JqZWN0IGFzIHdlbGwuICBBbGwgbm9uLXByaW1pdGl2ZSBwcm9wZXJ0aWVzXG4gICAgICogYXJlIGNvcGllZCBieSByZWZlcmVuY2UuXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IE9iamVjdFxuICAgICAqIEBzaWcgW1N0cmluZ10gLT4gYSAtPiB7azogdn0gLT4ge2s6IHZ9XG4gICAgICogQHBhcmFtIHtBcnJheX0gcGF0aCB0aGUgcGF0aCB0byBzZXRcbiAgICAgKiBAcGFyYW0geyp9IHZhbCB0aGUgbmV3IHZhbHVlXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9iaiB0aGUgb2JqZWN0IHRvIGNsb25lXG4gICAgICogQHJldHVybiB7T2JqZWN0fSBhIG5ldyBvYmplY3Qgc2ltaWxhciB0byB0aGUgb3JpZ2luYWwgZXhjZXB0IGFsb25nIHRoZSBzcGVjaWZpZWQgcGF0aC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICBSLmFzc29jUGF0aChbJ2EnLCAnYicsICdjJ10sIDQyLCB7YToge2I6IHtjOiAwfX19KTsgLy89PiB7YToge2I6IHtjOiA0Mn19fVxuICAgICAqL1xuICAgIHZhciBhc3NvY1BhdGggPSBfY3VycnkzKF9hc3NvY1BhdGgpO1xuXG4gICAgLyoqXG4gICAgICogV3JhcHMgYSBmdW5jdGlvbiBvZiBhbnkgYXJpdHkgKGluY2x1ZGluZyBudWxsYXJ5KSBpbiBhIGZ1bmN0aW9uIHRoYXQgYWNjZXB0cyBleGFjdGx5IDJcbiAgICAgKiBwYXJhbWV0ZXJzLiBBbnkgZXh0cmFuZW91cyBwYXJhbWV0ZXJzIHdpbGwgbm90IGJlIHBhc3NlZCB0byB0aGUgc3VwcGxpZWQgZnVuY3Rpb24uXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IEZ1bmN0aW9uXG4gICAgICogQHNpZyAoKiAtPiBjKSAtPiAoYSwgYiAtPiBjKVxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBmdW5jdGlvbiB0byB3cmFwLlxuICAgICAqIEByZXR1cm4ge0Z1bmN0aW9ufSBBIG5ldyBmdW5jdGlvbiB3cmFwcGluZyBgZm5gLiBUaGUgbmV3IGZ1bmN0aW9uIGlzIGd1YXJhbnRlZWQgdG8gYmUgb2ZcbiAgICAgKiAgICAgICAgIGFyaXR5IDIuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgdmFyIHRha2VzVGhyZWVBcmdzID0gZnVuY3Rpb24oYSwgYiwgYykge1xuICAgICAqICAgICAgICByZXR1cm4gW2EsIGIsIGNdO1xuICAgICAqICAgICAgfTtcbiAgICAgKiAgICAgIHRha2VzVGhyZWVBcmdzLmxlbmd0aDsgLy89PiAzXG4gICAgICogICAgICB0YWtlc1RocmVlQXJncygxLCAyLCAzKTsgLy89PiBbMSwgMiwgM11cbiAgICAgKlxuICAgICAqICAgICAgdmFyIHRha2VzVHdvQXJncyA9IFIuYmluYXJ5KHRha2VzVGhyZWVBcmdzKTtcbiAgICAgKiAgICAgIHRha2VzVHdvQXJncy5sZW5ndGg7IC8vPT4gMlxuICAgICAqICAgICAgLy8gT25seSAyIGFyZ3VtZW50cyBhcmUgcGFzc2VkIHRvIHRoZSB3cmFwcGVkIGZ1bmN0aW9uXG4gICAgICogICAgICB0YWtlc1R3b0FyZ3MoMSwgMiwgMyk7IC8vPT4gWzEsIDIsIHVuZGVmaW5lZF1cbiAgICAgKi9cbiAgICB2YXIgYmluYXJ5ID0gX2N1cnJ5MShmdW5jdGlvbiBiaW5hcnkoZm4pIHtcbiAgICAgICAgcmV0dXJuIG5BcnkoMiwgZm4pO1xuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIGRlZXAgY29weSBvZiB0aGUgdmFsdWUgd2hpY2ggbWF5IGNvbnRhaW4gKG5lc3RlZCkgYEFycmF5YHMgYW5kXG4gICAgICogYE9iamVjdGBzLCBgTnVtYmVyYHMsIGBTdHJpbmdgcywgYEJvb2xlYW5gcyBhbmQgYERhdGVgcy4gYEZ1bmN0aW9uYHMgYXJlXG4gICAgICogbm90IGNvcGllZCwgYnV0IGFzc2lnbmVkIGJ5IHRoZWlyIHJlZmVyZW5jZS5cbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgT2JqZWN0XG4gICAgICogQHNpZyB7Kn0gLT4geyp9XG4gICAgICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgb2JqZWN0IG9yIGFycmF5IHRvIGNsb25lXG4gICAgICogQHJldHVybiB7Kn0gQSBuZXcgb2JqZWN0IG9yIGFycmF5LlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIHZhciBvYmplY3RzID0gW3t9LCB7fSwge31dO1xuICAgICAqICAgICAgdmFyIG9iamVjdHNDbG9uZSA9IFIuY2xvbmUob2JqZWN0cyk7XG4gICAgICogICAgICBvYmplY3RzWzBdID09PSBvYmplY3RzQ2xvbmVbMF07IC8vPT4gZmFsc2VcbiAgICAgKi9cbiAgICB2YXIgY2xvbmUgPSBfY3VycnkxKGZ1bmN0aW9uIGNsb25lKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiBfYmFzZUNvcHkodmFsdWUsIFtdLCBbXSk7XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgbmV3IGZ1bmN0aW9uIHRoYXQgcnVucyBlYWNoIG9mIHRoZSBmdW5jdGlvbnMgc3VwcGxpZWQgYXMgcGFyYW1ldGVycyBpbiB0dXJuLFxuICAgICAqIHBhc3NpbmcgdGhlIHJldHVybiB2YWx1ZSBvZiBlYWNoIGZ1bmN0aW9uIGludm9jYXRpb24gdG8gdGhlIG5leHQgZnVuY3Rpb24gaW52b2NhdGlvbixcbiAgICAgKiBiZWdpbm5pbmcgd2l0aCB3aGF0ZXZlciBhcmd1bWVudHMgd2VyZSBwYXNzZWQgdG8gdGhlIGluaXRpYWwgaW52b2NhdGlvbi5cbiAgICAgKlxuICAgICAqIE5vdGUgdGhhdCBgY29tcG9zZWAgaXMgYSByaWdodC1hc3NvY2lhdGl2ZSBmdW5jdGlvbiwgd2hpY2ggbWVhbnMgdGhlIGZ1bmN0aW9ucyBwcm92aWRlZFxuICAgICAqIHdpbGwgYmUgaW52b2tlZCBpbiBvcmRlciBmcm9tIHJpZ2h0IHRvIGxlZnQuIEluIHRoZSBleGFtcGxlIGB2YXIgaCA9IGNvbXBvc2UoZiwgZylgLFxuICAgICAqIHRoZSBmdW5jdGlvbiBgaGAgaXMgZXF1aXZhbGVudCB0byBgZiggZyh4KSApYCwgd2hlcmUgYHhgIHJlcHJlc2VudHMgdGhlIGFyZ3VtZW50c1xuICAgICAqIG9yaWdpbmFsbHkgcGFzc2VkIHRvIGBoYC5cbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgRnVuY3Rpb25cbiAgICAgKiBAc2lnICgoeSAtPiB6KSwgKHggLT4geSksIC4uLiwgKGIgLT4gYyksIChhLi4uIC0+IGIpKSAtPiAoYS4uLiAtPiB6KVxuICAgICAqIEBwYXJhbSB7Li4uRnVuY3Rpb259IGZ1bmN0aW9ucyBBIHZhcmlhYmxlIG51bWJlciBvZiBmdW5jdGlvbnMuXG4gICAgICogQHJldHVybiB7RnVuY3Rpb259IEEgbmV3IGZ1bmN0aW9uIHdoaWNoIHJlcHJlc2VudHMgdGhlIHJlc3VsdCBvZiBjYWxsaW5nIGVhY2ggb2YgdGhlXG4gICAgICogICAgICAgICBpbnB1dCBgZnVuY3Rpb25zYCwgcGFzc2luZyB0aGUgcmVzdWx0IG9mIGVhY2ggZnVuY3Rpb24gY2FsbCB0byB0aGUgbmV4dCwgZnJvbVxuICAgICAqICAgICAgICAgcmlnaHQgdG8gbGVmdC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICB2YXIgdHJpcGxlID0gZnVuY3Rpb24oeCkgeyByZXR1cm4geCAqIDM7IH07XG4gICAgICogICAgICB2YXIgZG91YmxlID0gZnVuY3Rpb24oeCkgeyByZXR1cm4geCAqIDI7IH07XG4gICAgICogICAgICB2YXIgc3F1YXJlID0gZnVuY3Rpb24oeCkgeyByZXR1cm4geCAqIHg7IH07XG4gICAgICogICAgICB2YXIgc3F1YXJlVGhlbkRvdWJsZVRoZW5UcmlwbGUgPSBSLmNvbXBvc2UodHJpcGxlLCBkb3VibGUsIHNxdWFyZSk7XG4gICAgICpcbiAgICAgKiAgICAgIC8v4omFIHRyaXBsZShkb3VibGUoc3F1YXJlKDUpKSlcbiAgICAgKiAgICAgIHNxdWFyZVRoZW5Eb3VibGVUaGVuVHJpcGxlKDUpOyAvLz0+IDE1MFxuICAgICAqL1xuICAgIHZhciBjb21wb3NlID0gX2NyZWF0ZUNvbXBvc2VyKF9jb21wb3NlKTtcblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSBuZXcgbGVucyB0aGF0IGFsbG93cyBnZXR0aW5nIGFuZCBzZXR0aW5nIHZhbHVlcyBvZiBuZXN0ZWQgcHJvcGVydGllcywgYnlcbiAgICAgKiBmb2xsb3dpbmcgZWFjaCBnaXZlbiBsZW5zIGluIHN1Y2Nlc3Npb24uXG4gICAgICpcbiAgICAgKiBOb3RlIHRoYXQgYGNvbXBvc2VMYCBpcyBhIHJpZ2h0LWFzc29jaWF0aXZlIGZ1bmN0aW9uLCB3aGljaCBtZWFucyB0aGUgbGVuc2VzIHByb3ZpZGVkXG4gICAgICogd2lsbCBiZSBpbnZva2VkIGluIG9yZGVyIGZyb20gcmlnaHQgdG8gbGVmdC5cbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgRnVuY3Rpb25cbiAgICAgKiBAc2VlIFIubGVuc1xuICAgICAqIEBzaWcgKCh5IC0+IHopLCAoeCAtPiB5KSwgLi4uLCAoYiAtPiBjKSwgKGEgLT4gYikpIC0+IChhIC0+IHopXG4gICAgICogQHBhcmFtIHsuLi5GdW5jdGlvbn0gbGVuc2VzIEEgdmFyaWFibGUgbnVtYmVyIG9mIGxlbnNlcy5cbiAgICAgKiBAcmV0dXJuIHtGdW5jdGlvbn0gQSBuZXcgbGVucyB3aGljaCByZXByZXNlbnRzIHRoZSByZXN1bHQgb2YgY2FsbGluZyBlYWNoIG9mIHRoZVxuICAgICAqICAgICAgICAgaW5wdXQgYGxlbnNlc2AsIHBhc3NpbmcgdGhlIHJlc3VsdCBvZiBlYWNoIGdldHRlci9zZXR0ZXIgYXMgdGhlIHNvdXJjZVxuICAgICAqICAgICAgICAgdG8gdGhlIG5leHQsIGZyb20gcmlnaHQgdG8gbGVmdC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICB2YXIgaGVhZExlbnMgPSBSLmxlbnNJbmRleCgwKTtcbiAgICAgKiAgICAgIHZhciBzZWNvbmRMZW5zID0gUi5sZW5zSW5kZXgoMSk7XG4gICAgICogICAgICB2YXIgeExlbnMgPSBSLmxlbnNQcm9wKCd4Jyk7XG4gICAgICogICAgICB2YXIgc2Vjb25kT2ZYT2ZIZWFkTGVucyA9IFIuY29tcG9zZUwoc2Vjb25kTGVucywgeExlbnMsIGhlYWRMZW5zKTtcbiAgICAgKlxuICAgICAqICAgICAgdmFyIHNvdXJjZSA9IFt7eDogWzAsIDFdLCB5OiBbMiwgM119LCB7eDogWzQsIDVdLCB5OiBbNiwgN119XTtcbiAgICAgKiAgICAgIHNlY29uZE9mWE9mSGVhZExlbnMoc291cmNlKTsgLy89PiAxXG4gICAgICogICAgICBzZWNvbmRPZlhPZkhlYWRMZW5zLnNldCgxMjMsIHNvdXJjZSk7IC8vPT4gW3t4OiBbMCwgMTIzXSwgeTogWzIsIDNdfSwge3g6IFs0LCA1XSwgeTogWzYsIDddfV1cbiAgICAgKi9cbiAgICB2YXIgY29tcG9zZUwgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBmbiA9IGFyZ3VtZW50c1thcmd1bWVudHMubGVuZ3RoIC0gMV07XG4gICAgICAgIHZhciBpZHggPSBhcmd1bWVudHMubGVuZ3RoIC0gMjtcbiAgICAgICAgd2hpbGUgKGlkeCA+PSAwKSB7XG4gICAgICAgICAgICBmbiA9IF9jb21wb3NlTChhcmd1bWVudHNbaWR4XSwgZm4pO1xuICAgICAgICAgICAgaWR4IC09IDE7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZuO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBTaW1pbGFyIHRvIGBjb21wb3NlYCBidXQgd2l0aCBhdXRvbWF0aWMgaGFuZGxpbmcgb2YgcHJvbWlzZXMgKG9yLCBtb3JlXG4gICAgICogcHJlY2lzZWx5LCBcInRoZW5hYmxlc1wiKS4gVGhlIGJlaGF2aW9yIGlzIGlkZW50aWNhbCAgdG8gdGhhdCBvZlxuICAgICAqIGNvbXBvc2UoKSBpZiBhbGwgY29tcG9zZWQgZnVuY3Rpb25zIHJldHVybiBzb21ldGhpbmcgb3RoZXIgdGhhblxuICAgICAqIHByb21pc2VzIChpLmUuLCBvYmplY3RzIHdpdGggYSAudGhlbigpIG1ldGhvZCkuIElmIG9uZSBvZiB0aGUgZnVuY3Rpb25cbiAgICAgKiByZXR1cm5zIGEgcHJvbWlzZSwgaG93ZXZlciwgdGhlbiB0aGUgbmV4dCBmdW5jdGlvbiBpbiB0aGUgY29tcG9zaXRpb25cbiAgICAgKiBpcyBjYWxsZWQgYXN5bmNocm9ub3VzbHksIGluIHRoZSBzdWNjZXNzIGNhbGxiYWNrIG9mIHRoZSBwcm9taXNlLCB1c2luZ1xuICAgICAqIHRoZSByZXNvbHZlZCB2YWx1ZSBhcyBhbiBpbnB1dC4gTm90ZSB0aGF0IGBjb21wb3NlUGAgaXMgYSByaWdodC1cbiAgICAgKiBhc3NvY2lhdGl2ZSBmdW5jdGlvbiwganVzdCBsaWtlIGBjb21wb3NlYC5cbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgRnVuY3Rpb25cbiAgICAgKiBAc2lnICgoeSAtPiB6KSwgKHggLT4geSksIC4uLiwgKGIgLT4gYyksIChhLi4uIC0+IGIpKSAtPiAoYS4uLiAtPiB6KVxuICAgICAqIEBwYXJhbSB7Li4uRnVuY3Rpb259IGZ1bmN0aW9ucyBBIHZhcmlhYmxlIG51bWJlciBvZiBmdW5jdGlvbnMuXG4gICAgICogQHJldHVybiB7RnVuY3Rpb259IEEgbmV3IGZ1bmN0aW9uIHdoaWNoIHJlcHJlc2VudHMgdGhlIHJlc3VsdCBvZiBjYWxsaW5nIGVhY2ggb2YgdGhlXG4gICAgICogICAgICAgICBpbnB1dCBgZnVuY3Rpb25zYCwgcGFzc2luZyBlaXRoZXIgdGhlIHJldHVybmVkIHJlc3VsdCBvciB0aGUgYXN5bmNocm9ub3VzbHlcbiAgICAgKiAgICAgICAgIHJlc29sdmVkIHZhbHVlKSBvZiBlYWNoIGZ1bmN0aW9uIGNhbGwgdG8gdGhlIG5leHQsIGZyb20gcmlnaHQgdG8gbGVmdC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICB2YXIgUSA9IHJlcXVpcmUoJ3EnKTtcbiAgICAgKiAgICAgIHZhciB0cmlwbGUgPSBmdW5jdGlvbih4KSB7IHJldHVybiB4ICogMzsgfTtcbiAgICAgKiAgICAgIHZhciBkb3VibGUgPSBmdW5jdGlvbih4KSB7IHJldHVybiB4ICogMjsgfTtcbiAgICAgKiAgICAgIHZhciBzcXVhcmVBc3luYyA9IGZ1bmN0aW9uKHgpIHsgcmV0dXJuIFEud2hlbih4ICogeCk7IH07XG4gICAgICogICAgICB2YXIgc3F1YXJlQXN5bmNUaGVuRG91YmxlVGhlblRyaXBsZSA9IFIuY29tcG9zZVAodHJpcGxlLCBkb3VibGUsIHNxdWFyZUFzeW5jKTtcbiAgICAgKlxuICAgICAqICAgICAgLy/iiYUgc3F1YXJlQXN5bmMoNSkudGhlbihmdW5jdGlvbih4KSB7IHJldHVybiB0cmlwbGUoZG91YmxlKHgpKSB9O1xuICAgICAqICAgICAgc3F1YXJlQXN5bmNUaGVuRG91YmxlVGhlblRyaXBsZSg1KVxuICAgICAqICAgICAgICAudGhlbihmdW5jdGlvbihyZXN1bHQpIHtcbiAgICAgKiAgICAgICAgICAvLyByZXN1bHQgaXMgMTUwXG4gICAgICogICAgICAgIH0pO1xuICAgICAqL1xuICAgIHZhciBjb21wb3NlUCA9IF9jcmVhdGVDb21wb3NlcihfY29tcG9zZVApO1xuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhIG5ldyBsaXN0IGNvbnNpc3Rpbmcgb2YgdGhlIGVsZW1lbnRzIG9mIHRoZSBmaXJzdCBsaXN0IGZvbGxvd2VkIGJ5IHRoZSBlbGVtZW50c1xuICAgICAqIG9mIHRoZSBzZWNvbmQuXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IExpc3RcbiAgICAgKiBAc2lnIFthXSAtPiBbYV0gLT4gW2FdXG4gICAgICogQHBhcmFtIHtBcnJheX0gbGlzdDEgVGhlIGZpcnN0IGxpc3QgdG8gbWVyZ2UuXG4gICAgICogQHBhcmFtIHtBcnJheX0gbGlzdDIgVGhlIHNlY29uZCBzZXQgdG8gbWVyZ2UuXG4gICAgICogQHJldHVybiB7QXJyYXl9IEEgbmV3IGFycmF5IGNvbnNpc3Rpbmcgb2YgdGhlIGNvbnRlbnRzIG9mIGBsaXN0MWAgZm9sbG93ZWQgYnkgdGhlXG4gICAgICogICAgICAgICBjb250ZW50cyBvZiBgbGlzdDJgLiBJZiwgaW5zdGVhZCBvZiBhbiBBcnJheSBmb3IgYGxpc3QxYCwgeW91IHBhc3MgYW5cbiAgICAgKiAgICAgICAgIG9iamVjdCB3aXRoIGEgYGNvbmNhdGAgbWV0aG9kIG9uIGl0LCBgY29uY2F0YCB3aWxsIGNhbGwgYGxpc3QxLmNvbmNhdGBcbiAgICAgKiAgICAgICAgIGFuZCBwYXNzIGl0IHRoZSB2YWx1ZSBvZiBgbGlzdDJgLlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgUi5jb25jYXQoW10sIFtdKTsgLy89PiBbXVxuICAgICAqICAgICAgUi5jb25jYXQoWzQsIDUsIDZdLCBbMSwgMiwgM10pOyAvLz0+IFs0LCA1LCA2LCAxLCAyLCAzXVxuICAgICAqICAgICAgUi5jb25jYXQoJ0FCQycsICdERUYnKTsgLy8gJ0FCQ0RFRidcbiAgICAgKi9cbiAgICB2YXIgY29uY2F0ID0gX2N1cnJ5MihmdW5jdGlvbiAoc2V0MSwgc2V0Mikge1xuICAgICAgICBpZiAoX2lzQXJyYXkoc2V0MikpIHtcbiAgICAgICAgICAgIHJldHVybiBfY29uY2F0KHNldDEsIHNldDIpO1xuICAgICAgICB9IGVsc2UgaWYgKF9oYXNNZXRob2QoJ2NvbmNhdCcsIHNldDEpKSB7XG4gICAgICAgICAgICByZXR1cm4gc2V0MS5jb25jYXQoc2V0Mik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdjYW5cXCd0IGNvbmNhdCAnICsgdHlwZW9mIHNldDEpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGEgY3VycmllZCBlcXVpdmFsZW50IG9mIHRoZSBwcm92aWRlZCBmdW5jdGlvbiwgd2l0aCB0aGVcbiAgICAgKiBzcGVjaWZpZWQgYXJpdHkuIFRoZSBjdXJyaWVkIGZ1bmN0aW9uIGhhcyB0d28gdW51c3VhbCBjYXBhYmlsaXRpZXMuXG4gICAgICogRmlyc3QsIGl0cyBhcmd1bWVudHMgbmVlZG4ndCBiZSBwcm92aWRlZCBvbmUgYXQgYSB0aW1lLiBJZiBgZ2AgaXNcbiAgICAgKiBgUi5jdXJyeU4oMywgZilgLCB0aGUgZm9sbG93aW5nIGFyZSBlcXVpdmFsZW50OlxuICAgICAqXG4gICAgICogICAtIGBnKDEpKDIpKDMpYFxuICAgICAqICAgLSBgZygxKSgyLCAzKWBcbiAgICAgKiAgIC0gYGcoMSwgMikoMylgXG4gICAgICogICAtIGBnKDEsIDIsIDMpYFxuICAgICAqXG4gICAgICogU2Vjb25kbHksIHRoZSBzcGVjaWFsIHBsYWNlaG9sZGVyIHZhbHVlIGBSLl9fYCBtYXkgYmUgdXNlZCB0byBzcGVjaWZ5XG4gICAgICogXCJnYXBzXCIsIGFsbG93aW5nIHBhcnRpYWwgYXBwbGljYXRpb24gb2YgYW55IGNvbWJpbmF0aW9uIG9mIGFyZ3VtZW50cyxcbiAgICAgKiByZWdhcmRsZXNzIG9mIHRoZWlyIHBvc2l0aW9ucy4gSWYgYGdgIGlzIGFzIGFib3ZlIGFuZCBgX2AgaXMgYFIuX19gLFxuICAgICAqIHRoZSBmb2xsb3dpbmcgYXJlIGVxdWl2YWxlbnQ6XG4gICAgICpcbiAgICAgKiAgIC0gYGcoMSwgMiwgMylgXG4gICAgICogICAtIGBnKF8sIDIsIDMpKDEpYFxuICAgICAqICAgLSBgZyhfLCBfLCAzKSgxKSgyKWBcbiAgICAgKiAgIC0gYGcoXywgXywgMykoMSwgMilgXG4gICAgICogICAtIGBnKF8sIDIpKDEpKDMpYFxuICAgICAqICAgLSBgZyhfLCAyKSgxLCAzKWBcbiAgICAgKiAgIC0gYGcoXywgMikoXywgMykoMSlgXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IEZ1bmN0aW9uXG4gICAgICogQHNpZyBOdW1iZXIgLT4gKCogLT4gYSkgLT4gKCogLT4gYSlcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gbGVuZ3RoIFRoZSBhcml0eSBmb3IgdGhlIHJldHVybmVkIGZ1bmN0aW9uLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBmdW5jdGlvbiB0byBjdXJyeS5cbiAgICAgKiBAcmV0dXJuIHtGdW5jdGlvbn0gQSBuZXcsIGN1cnJpZWQgZnVuY3Rpb24uXG4gICAgICogQHNlZSBSLmN1cnJ5XG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgdmFyIGFkZEZvdXJOdW1iZXJzID0gZnVuY3Rpb24oKSB7XG4gICAgICogICAgICAgIHJldHVybiBSLnN1bShbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMCwgNCkpO1xuICAgICAqICAgICAgfTtcbiAgICAgKlxuICAgICAqICAgICAgdmFyIGN1cnJpZWRBZGRGb3VyTnVtYmVycyA9IFIuY3VycnlOKDQsIGFkZEZvdXJOdW1iZXJzKTtcbiAgICAgKiAgICAgIHZhciBmID0gY3VycmllZEFkZEZvdXJOdW1iZXJzKDEsIDIpO1xuICAgICAqICAgICAgdmFyIGcgPSBmKDMpO1xuICAgICAqICAgICAgZyg0KTsgLy89PiAxMFxuICAgICAqL1xuICAgIHZhciBjdXJyeU4gPSBfY3VycnkyKGZ1bmN0aW9uIGN1cnJ5TihsZW5ndGgsIGZuKSB7XG4gICAgICAgIHJldHVybiBhcml0eShsZW5ndGgsIF9jdXJyeU4obGVuZ3RoLCBbXSwgZm4pKTtcbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIE1ha2VzIGEgc2hhbGxvdyBjbG9uZSBvZiBhbiBvYmplY3QsIG9taXR0aW5nIHRoZSBwcm9wZXJ0eSBhdCB0aGVcbiAgICAgKiBnaXZlbiBwYXRoLiBOb3RlIHRoYXQgdGhpcyBjb3BpZXMgYW5kIGZsYXR0ZW5zIHByb3RvdHlwZSBwcm9wZXJ0aWVzXG4gICAgICogb250byB0aGUgbmV3IG9iamVjdCBhcyB3ZWxsLiAgQWxsIG5vbi1wcmltaXRpdmUgcHJvcGVydGllcyBhcmUgY29waWVkXG4gICAgICogYnkgcmVmZXJlbmNlLlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBPYmplY3RcbiAgICAgKiBAc2lnIFtTdHJpbmddIC0+IHtrOiB2fSAtPiB7azogdn1cbiAgICAgKiBAcGFyYW0ge0FycmF5fSBwYXRoIHRoZSBwYXRoIHRvIHNldFxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvYmogdGhlIG9iamVjdCB0byBjbG9uZVxuICAgICAqIEByZXR1cm4ge09iamVjdH0gYSBuZXcgb2JqZWN0IHdpdGhvdXQgdGhlIHByb3BlcnR5IGF0IHBhdGhcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICBSLmRpc3NvY1BhdGgoWydhJywgJ2InLCAnYyddLCB7YToge2I6IHtjOiA0Mn19fSk7IC8vPT4ge2E6IHtiOiB7fX19XG4gICAgICovXG4gICAgdmFyIGRpc3NvY1BhdGggPSBfY3VycnkyKF9kaXNzb2NQYXRoKTtcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYSBuZXcgbGlzdCBjb250YWluaW5nIHRoZSBsYXN0IGBuYCBlbGVtZW50cyBvZiBhIGdpdmVuIGxpc3QsIHBhc3NpbmcgZWFjaCB2YWx1ZVxuICAgICAqIHRvIHRoZSBzdXBwbGllZCBwcmVkaWNhdGUgZnVuY3Rpb24sIHNraXBwaW5nIGVsZW1lbnRzIHdoaWxlIHRoZSBwcmVkaWNhdGUgZnVuY3Rpb24gcmV0dXJuc1xuICAgICAqIGB0cnVlYC4gVGhlIHByZWRpY2F0ZSBmdW5jdGlvbiBpcyBwYXNzZWQgb25lIGFyZ3VtZW50OiAqKHZhbHVlKSouXG4gICAgICpcbiAgICAgKiBBY3RzIGFzIGEgdHJhbnNkdWNlciBpZiBhIHRyYW5zZm9ybWVyIGlzIGdpdmVuIGluIGxpc3QgcG9zaXRpb24uXG4gICAgICogQHNlZSBSLnRyYW5zZHVjZVxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBMaXN0XG4gICAgICogQHNpZyAoYSAtPiBCb29sZWFuKSAtPiBbYV0gLT4gW2FdXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGZ1bmN0aW9uIGNhbGxlZCBwZXIgaXRlcmF0aW9uLlxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGxpc3QgVGhlIGNvbGxlY3Rpb24gdG8gaXRlcmF0ZSBvdmVyLlxuICAgICAqIEByZXR1cm4ge0FycmF5fSBBIG5ldyBhcnJheS5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICB2YXIgbHRlVHdvID0gZnVuY3Rpb24oeCkge1xuICAgICAqICAgICAgICByZXR1cm4geCA8PSAyO1xuICAgICAqICAgICAgfTtcbiAgICAgKlxuICAgICAqICAgICAgUi5kcm9wV2hpbGUobHRlVHdvLCBbMSwgMiwgMywgNCwgMywgMiwgMV0pOyAvLz0+IFszLCA0LCAzLCAyLCAxXVxuICAgICAqL1xuICAgIHZhciBkcm9wV2hpbGUgPSBfY3VycnkyKF9kaXNwYXRjaGFibGUoJ2Ryb3BXaGlsZScsIF94ZHJvcFdoaWxlLCBmdW5jdGlvbiBkcm9wV2hpbGUocHJlZCwgbGlzdCkge1xuICAgICAgICB2YXIgaWR4ID0gMCwgbGVuID0gbGlzdC5sZW5ndGg7XG4gICAgICAgIHdoaWxlIChpZHggPCBsZW4gJiYgcHJlZChsaXN0W2lkeF0pKSB7XG4gICAgICAgICAgICBpZHggKz0gMTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gX3NsaWNlKGxpc3QsIGlkeCk7XG4gICAgfSkpO1xuXG4gICAgLyoqXG4gICAgICogYGVtcHR5YCByZXR1cm5zIGFuIGVtcHR5IGxpc3QgZm9yIGFueSBhcmd1bWVudCwgZXhjZXB0IHdoZW4gdGhlIGFyZ3VtZW50IHNhdGlzZmllcyB0aGVcbiAgICAgKiBGYW50YXN5LWxhbmQgTW9ub2lkIHNwZWMuIEluIHRoYXQgY2FzZSwgdGhpcyBmdW5jdGlvbiB3aWxsIHJldHVybiB0aGUgcmVzdWx0IG9mIGludm9raW5nXG4gICAgICogYGVtcHR5YCBvbiB0aGF0IE1vbm9pZC5cbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgRnVuY3Rpb25cbiAgICAgKiBAc2lnICogLT4gW11cbiAgICAgKiBAcmV0dXJuIHtBcnJheX0gQW4gZW1wdHkgYXJyYXkuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgUi5lbXB0eShbMSwyLDMsNCw1XSk7IC8vPT4gW11cbiAgICAgKi9cbiAgICB2YXIgZW1wdHkgPSBfY3VycnkxKGZ1bmN0aW9uIGVtcHR5KHgpIHtcbiAgICAgICAgcmV0dXJuIF9oYXNNZXRob2QoJ2VtcHR5JywgeCkgPyB4LmVtcHR5KCkgOiBbXTtcbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYHRydWVgIGlmIGl0cyBhcmd1bWVudHMgYXJlIGVxdWl2YWxlbnQsIGBmYWxzZWAgb3RoZXJ3aXNlLlxuICAgICAqIERpc3BhdGNoZXMgdG8gYW4gYGVxdWFsc2AgbWV0aG9kIGlmIHByZXNlbnQuIEhhbmRsZXMgY3ljbGljYWwgZGF0YVxuICAgICAqIHN0cnVjdHVyZXMuXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IFJlbGF0aW9uXG4gICAgICogQHNpZyBhIC0+IGIgLT4gQm9vbGVhblxuICAgICAqIEBwYXJhbSB7Kn0gYVxuICAgICAqIEBwYXJhbSB7Kn0gYlxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgUi5lcXVhbHMoMSwgMSk7IC8vPT4gdHJ1ZVxuICAgICAqICAgICAgUi5lcXVhbHMoMSwgJzEnKTsgLy89PiBmYWxzZVxuICAgICAqICAgICAgUi5lcXVhbHMoWzEsIDIsIDNdLCBbMSwgMiwgM10pOyAvLz0+IHRydWVcbiAgICAgKlxuICAgICAqICAgICAgdmFyIGEgPSB7fTsgYS52ID0gYTtcbiAgICAgKiAgICAgIHZhciBiID0ge307IGIudiA9IGI7XG4gICAgICogICAgICBSLmVxdWFscyhhLCBiKTsgLy89PiB0cnVlXG4gICAgICovXG4gICAgdmFyIGVxdWFscyA9IF9jdXJyeTIoZnVuY3Rpb24gZXF1YWxzKGEsIGIpIHtcbiAgICAgICAgcmV0dXJuIF9oYXNNZXRob2QoJ2VxdWFscycsIGEpID8gYS5lcXVhbHMoYikgOiBfaGFzTWV0aG9kKCdlcXVhbHMnLCBiKSA/IGIuZXF1YWxzKGEpIDogX2VxdWFscyhhLCBiLCBbXSwgW10pO1xuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhIG5ldyBsaXN0IGNvbnRhaW5pbmcgb25seSB0aG9zZSBpdGVtcyB0aGF0IG1hdGNoIGEgZ2l2ZW4gcHJlZGljYXRlIGZ1bmN0aW9uLlxuICAgICAqIFRoZSBwcmVkaWNhdGUgZnVuY3Rpb24gaXMgcGFzc2VkIG9uZSBhcmd1bWVudDogKih2YWx1ZSkqLlxuICAgICAqXG4gICAgICogTm90ZSB0aGF0IGBSLmZpbHRlcmAgZG9lcyBub3Qgc2tpcCBkZWxldGVkIG9yIHVuYXNzaWduZWQgaW5kaWNlcywgdW5saWtlIHRoZSBuYXRpdmVcbiAgICAgKiBgQXJyYXkucHJvdG90eXBlLmZpbHRlcmAgbWV0aG9kLiBGb3IgbW9yZSBkZXRhaWxzIG9uIHRoaXMgYmVoYXZpb3IsIHNlZTpcbiAgICAgKiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9BcnJheS9maWx0ZXIjRGVzY3JpcHRpb25cbiAgICAgKlxuICAgICAqIEFjdHMgYXMgYSB0cmFuc2R1Y2VyIGlmIGEgdHJhbnNmb3JtZXIgaXMgZ2l2ZW4gaW4gbGlzdCBwb3NpdGlvbi5cbiAgICAgKiBAc2VlIFIudHJhbnNkdWNlXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IExpc3RcbiAgICAgKiBAc2lnIChhIC0+IEJvb2xlYW4pIC0+IFthXSAtPiBbYV1cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgZnVuY3Rpb24gY2FsbGVkIHBlciBpdGVyYXRpb24uXG4gICAgICogQHBhcmFtIHtBcnJheX0gbGlzdCBUaGUgY29sbGVjdGlvbiB0byBpdGVyYXRlIG92ZXIuXG4gICAgICogQHJldHVybiB7QXJyYXl9IFRoZSBuZXcgZmlsdGVyZWQgYXJyYXkuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgdmFyIGlzRXZlbiA9IGZ1bmN0aW9uKG4pIHtcbiAgICAgKiAgICAgICAgcmV0dXJuIG4gJSAyID09PSAwO1xuICAgICAqICAgICAgfTtcbiAgICAgKiAgICAgIFIuZmlsdGVyKGlzRXZlbiwgWzEsIDIsIDMsIDRdKTsgLy89PiBbMiwgNF1cbiAgICAgKi9cbiAgICB2YXIgZmlsdGVyID0gX2N1cnJ5MihfZGlzcGF0Y2hhYmxlKCdmaWx0ZXInLCBfeGZpbHRlciwgX2ZpbHRlcikpO1xuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgZmlyc3QgZWxlbWVudCBvZiB0aGUgbGlzdCB3aGljaCBtYXRjaGVzIHRoZSBwcmVkaWNhdGUsIG9yIGB1bmRlZmluZWRgIGlmIG5vXG4gICAgICogZWxlbWVudCBtYXRjaGVzLlxuICAgICAqXG4gICAgICogQWN0cyBhcyBhIHRyYW5zZHVjZXIgaWYgYSB0cmFuc2Zvcm1lciBpcyBnaXZlbiBpbiBsaXN0IHBvc2l0aW9uLlxuICAgICAqIEBzZWUgUi50cmFuc2R1Y2VcbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgTGlzdFxuICAgICAqIEBzaWcgKGEgLT4gQm9vbGVhbikgLT4gW2FdIC0+IGEgfCB1bmRlZmluZWRcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgcHJlZGljYXRlIGZ1bmN0aW9uIHVzZWQgdG8gZGV0ZXJtaW5lIGlmIHRoZSBlbGVtZW50IGlzIHRoZVxuICAgICAqICAgICAgICBkZXNpcmVkIG9uZS5cbiAgICAgKiBAcGFyYW0ge0FycmF5fSBsaXN0IFRoZSBhcnJheSB0byBjb25zaWRlci5cbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IFRoZSBlbGVtZW50IGZvdW5kLCBvciBgdW5kZWZpbmVkYC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICB2YXIgeHMgPSBbe2E6IDF9LCB7YTogMn0sIHthOiAzfV07XG4gICAgICogICAgICBSLmZpbmQoUi5wcm9wRXEoJ2EnLCAyKSkoeHMpOyAvLz0+IHthOiAyfVxuICAgICAqICAgICAgUi5maW5kKFIucHJvcEVxKCdhJywgNCkpKHhzKTsgLy89PiB1bmRlZmluZWRcbiAgICAgKi9cbiAgICB2YXIgZmluZCA9IF9jdXJyeTIoX2Rpc3BhdGNoYWJsZSgnZmluZCcsIF94ZmluZCwgZnVuY3Rpb24gZmluZChmbiwgbGlzdCkge1xuICAgICAgICB2YXIgaWR4ID0gMDtcbiAgICAgICAgdmFyIGxlbiA9IGxpc3QubGVuZ3RoO1xuICAgICAgICB3aGlsZSAoaWR4IDwgbGVuKSB7XG4gICAgICAgICAgICBpZiAoZm4obGlzdFtpZHhdKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBsaXN0W2lkeF07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZHggKz0gMTtcbiAgICAgICAgfVxuICAgIH0pKTtcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIGluZGV4IG9mIHRoZSBmaXJzdCBlbGVtZW50IG9mIHRoZSBsaXN0IHdoaWNoIG1hdGNoZXMgdGhlIHByZWRpY2F0ZSwgb3IgYC0xYFxuICAgICAqIGlmIG5vIGVsZW1lbnQgbWF0Y2hlcy5cbiAgICAgKlxuICAgICAqIEFjdHMgYXMgYSB0cmFuc2R1Y2VyIGlmIGEgdHJhbnNmb3JtZXIgaXMgZ2l2ZW4gaW4gbGlzdCBwb3NpdGlvbi5cbiAgICAgKiBAc2VlIFIudHJhbnNkdWNlXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IExpc3RcbiAgICAgKiBAc2lnIChhIC0+IEJvb2xlYW4pIC0+IFthXSAtPiBOdW1iZXJcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgcHJlZGljYXRlIGZ1bmN0aW9uIHVzZWQgdG8gZGV0ZXJtaW5lIGlmIHRoZSBlbGVtZW50IGlzIHRoZVxuICAgICAqIGRlc2lyZWQgb25lLlxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGxpc3QgVGhlIGFycmF5IHRvIGNvbnNpZGVyLlxuICAgICAqIEByZXR1cm4ge051bWJlcn0gVGhlIGluZGV4IG9mIHRoZSBlbGVtZW50IGZvdW5kLCBvciBgLTFgLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIHZhciB4cyA9IFt7YTogMX0sIHthOiAyfSwge2E6IDN9XTtcbiAgICAgKiAgICAgIFIuZmluZEluZGV4KFIucHJvcEVxKCdhJywgMikpKHhzKTsgLy89PiAxXG4gICAgICogICAgICBSLmZpbmRJbmRleChSLnByb3BFcSgnYScsIDQpKSh4cyk7IC8vPT4gLTFcbiAgICAgKi9cbiAgICB2YXIgZmluZEluZGV4ID0gX2N1cnJ5MihfZGlzcGF0Y2hhYmxlKCdmaW5kSW5kZXgnLCBfeGZpbmRJbmRleCwgZnVuY3Rpb24gZmluZEluZGV4KGZuLCBsaXN0KSB7XG4gICAgICAgIHZhciBpZHggPSAwO1xuICAgICAgICB2YXIgbGVuID0gbGlzdC5sZW5ndGg7XG4gICAgICAgIHdoaWxlIChpZHggPCBsZW4pIHtcbiAgICAgICAgICAgIGlmIChmbihsaXN0W2lkeF0pKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGlkeDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlkeCArPSAxO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAtMTtcbiAgICB9KSk7XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBsYXN0IGVsZW1lbnQgb2YgdGhlIGxpc3Qgd2hpY2ggbWF0Y2hlcyB0aGUgcHJlZGljYXRlLCBvciBgdW5kZWZpbmVkYCBpZiBub1xuICAgICAqIGVsZW1lbnQgbWF0Y2hlcy5cbiAgICAgKlxuICAgICAqIEFjdHMgYXMgYSB0cmFuc2R1Y2VyIGlmIGEgdHJhbnNmb3JtZXIgaXMgZ2l2ZW4gaW4gbGlzdCBwb3NpdGlvbi5cbiAgICAgKiBAc2VlIFIudHJhbnNkdWNlXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IExpc3RcbiAgICAgKiBAc2lnIChhIC0+IEJvb2xlYW4pIC0+IFthXSAtPiBhIHwgdW5kZWZpbmVkXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIHByZWRpY2F0ZSBmdW5jdGlvbiB1c2VkIHRvIGRldGVybWluZSBpZiB0aGUgZWxlbWVudCBpcyB0aGVcbiAgICAgKiBkZXNpcmVkIG9uZS5cbiAgICAgKiBAcGFyYW0ge0FycmF5fSBsaXN0IFRoZSBhcnJheSB0byBjb25zaWRlci5cbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IFRoZSBlbGVtZW50IGZvdW5kLCBvciBgdW5kZWZpbmVkYC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICB2YXIgeHMgPSBbe2E6IDEsIGI6IDB9LCB7YToxLCBiOiAxfV07XG4gICAgICogICAgICBSLmZpbmRMYXN0KFIucHJvcEVxKCdhJywgMSkpKHhzKTsgLy89PiB7YTogMSwgYjogMX1cbiAgICAgKiAgICAgIFIuZmluZExhc3QoUi5wcm9wRXEoJ2EnLCA0KSkoeHMpOyAvLz0+IHVuZGVmaW5lZFxuICAgICAqL1xuICAgIHZhciBmaW5kTGFzdCA9IF9jdXJyeTIoX2Rpc3BhdGNoYWJsZSgnZmluZExhc3QnLCBfeGZpbmRMYXN0LCBmdW5jdGlvbiBmaW5kTGFzdChmbiwgbGlzdCkge1xuICAgICAgICB2YXIgaWR4ID0gbGlzdC5sZW5ndGggLSAxO1xuICAgICAgICB3aGlsZSAoaWR4ID49IDApIHtcbiAgICAgICAgICAgIGlmIChmbihsaXN0W2lkeF0pKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGxpc3RbaWR4XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlkeCAtPSAxO1xuICAgICAgICB9XG4gICAgfSkpO1xuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgaW5kZXggb2YgdGhlIGxhc3QgZWxlbWVudCBvZiB0aGUgbGlzdCB3aGljaCBtYXRjaGVzIHRoZSBwcmVkaWNhdGUsIG9yXG4gICAgICogYC0xYCBpZiBubyBlbGVtZW50IG1hdGNoZXMuXG4gICAgICpcbiAgICAgKiBBY3RzIGFzIGEgdHJhbnNkdWNlciBpZiBhIHRyYW5zZm9ybWVyIGlzIGdpdmVuIGluIGxpc3QgcG9zaXRpb24uXG4gICAgICogQHNlZSBSLnRyYW5zZHVjZVxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBMaXN0XG4gICAgICogQHNpZyAoYSAtPiBCb29sZWFuKSAtPiBbYV0gLT4gTnVtYmVyXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIHByZWRpY2F0ZSBmdW5jdGlvbiB1c2VkIHRvIGRldGVybWluZSBpZiB0aGUgZWxlbWVudCBpcyB0aGVcbiAgICAgKiBkZXNpcmVkIG9uZS5cbiAgICAgKiBAcGFyYW0ge0FycmF5fSBsaXN0IFRoZSBhcnJheSB0byBjb25zaWRlci5cbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9IFRoZSBpbmRleCBvZiB0aGUgZWxlbWVudCBmb3VuZCwgb3IgYC0xYC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICB2YXIgeHMgPSBbe2E6IDEsIGI6IDB9LCB7YToxLCBiOiAxfV07XG4gICAgICogICAgICBSLmZpbmRMYXN0SW5kZXgoUi5wcm9wRXEoJ2EnLCAxKSkoeHMpOyAvLz0+IDFcbiAgICAgKiAgICAgIFIuZmluZExhc3RJbmRleChSLnByb3BFcSgnYScsIDQpKSh4cyk7IC8vPT4gLTFcbiAgICAgKi9cbiAgICB2YXIgZmluZExhc3RJbmRleCA9IF9jdXJyeTIoX2Rpc3BhdGNoYWJsZSgnZmluZExhc3RJbmRleCcsIF94ZmluZExhc3RJbmRleCwgZnVuY3Rpb24gZmluZExhc3RJbmRleChmbiwgbGlzdCkge1xuICAgICAgICB2YXIgaWR4ID0gbGlzdC5sZW5ndGggLSAxO1xuICAgICAgICB3aGlsZSAoaWR4ID49IDApIHtcbiAgICAgICAgICAgIGlmIChmbihsaXN0W2lkeF0pKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGlkeDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlkeCAtPSAxO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAtMTtcbiAgICB9KSk7XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGEgbmV3IGxpc3QgYnkgcHVsbGluZyBldmVyeSBpdGVtIG91dCBvZiBpdCAoYW5kIGFsbCBpdHMgc3ViLWFycmF5cykgYW5kIHB1dHRpbmdcbiAgICAgKiB0aGVtIGluIGEgbmV3IGFycmF5LCBkZXB0aC1maXJzdC5cbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgTGlzdFxuICAgICAqIEBzaWcgW2FdIC0+IFtiXVxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGxpc3QgVGhlIGFycmF5IHRvIGNvbnNpZGVyLlxuICAgICAqIEByZXR1cm4ge0FycmF5fSBUaGUgZmxhdHRlbmVkIGxpc3QuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgUi5mbGF0dGVuKFsxLCAyLCBbMywgNF0sIDUsIFs2LCBbNywgOCwgWzksIFsxMCwgMTFdLCAxMl1dXV0pO1xuICAgICAqICAgICAgLy89PiBbMSwgMiwgMywgNCwgNSwgNiwgNywgOCwgOSwgMTAsIDExLCAxMl1cbiAgICAgKi9cbiAgICB2YXIgZmxhdHRlbiA9IF9jdXJyeTEoX21ha2VGbGF0KHRydWUpKTtcblxuICAgIC8qKlxuICAgICAqIEl0ZXJhdGUgb3ZlciBhbiBpbnB1dCBgbGlzdGAsIGNhbGxpbmcgYSBwcm92aWRlZCBmdW5jdGlvbiBgZm5gIGZvciBlYWNoIGVsZW1lbnQgaW4gdGhlXG4gICAgICogbGlzdC5cbiAgICAgKlxuICAgICAqIGBmbmAgcmVjZWl2ZXMgb25lIGFyZ3VtZW50OiAqKHZhbHVlKSouXG4gICAgICpcbiAgICAgKiBOb3RlOiBgUi5mb3JFYWNoYCBkb2VzIG5vdCBza2lwIGRlbGV0ZWQgb3IgdW5hc3NpZ25lZCBpbmRpY2VzIChzcGFyc2UgYXJyYXlzKSwgdW5saWtlXG4gICAgICogdGhlIG5hdGl2ZSBgQXJyYXkucHJvdG90eXBlLmZvckVhY2hgIG1ldGhvZC4gRm9yIG1vcmUgZGV0YWlscyBvbiB0aGlzIGJlaGF2aW9yLCBzZWU6XG4gICAgICogaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvQXJyYXkvZm9yRWFjaCNEZXNjcmlwdGlvblxuICAgICAqXG4gICAgICogQWxzbyBub3RlIHRoYXQsIHVubGlrZSBgQXJyYXkucHJvdG90eXBlLmZvckVhY2hgLCBSYW1kYSdzIGBmb3JFYWNoYCByZXR1cm5zIHRoZSBvcmlnaW5hbFxuICAgICAqIGFycmF5LiBJbiBzb21lIGxpYnJhcmllcyB0aGlzIGZ1bmN0aW9uIGlzIG5hbWVkIGBlYWNoYC5cbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgTGlzdFxuICAgICAqIEBzaWcgKGEgLT4gKikgLT4gW2FdIC0+IFthXVxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBmdW5jdGlvbiB0byBpbnZva2UuIFJlY2VpdmVzIG9uZSBhcmd1bWVudCwgYHZhbHVlYC5cbiAgICAgKiBAcGFyYW0ge0FycmF5fSBsaXN0IFRoZSBsaXN0IHRvIGl0ZXJhdGUgb3Zlci5cbiAgICAgKiBAcmV0dXJuIHtBcnJheX0gVGhlIG9yaWdpbmFsIGxpc3QuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgdmFyIHByaW50WFBsdXNGaXZlID0gZnVuY3Rpb24oeCkgeyBjb25zb2xlLmxvZyh4ICsgNSk7IH07XG4gICAgICogICAgICBSLmZvckVhY2gocHJpbnRYUGx1c0ZpdmUsIFsxLCAyLCAzXSk7IC8vPT4gWzEsIDIsIDNdXG4gICAgICogICAgICAvLy0+IDZcbiAgICAgKiAgICAgIC8vLT4gN1xuICAgICAqICAgICAgLy8tPiA4XG4gICAgICovXG4gICAgdmFyIGZvckVhY2ggPSBfY3VycnkyKGZ1bmN0aW9uIGZvckVhY2goZm4sIGxpc3QpIHtcbiAgICAgICAgcmV0dXJuIF9oYXNNZXRob2QoJ2ZvckVhY2gnLCBsaXN0KSA/IGxpc3QuZm9yRWFjaChmbikgOiBfZm9yRWFjaChmbiwgbGlzdCk7XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGEgbGlzdCBvZiBmdW5jdGlvbiBuYW1lcyBvZiBvYmplY3QncyBvd24gZnVuY3Rpb25zXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IE9iamVjdFxuICAgICAqIEBzaWcgeyp9IC0+IFtTdHJpbmddXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9iaiBUaGUgb2JqZWN0cyB3aXRoIGZ1bmN0aW9ucyBpbiBpdFxuICAgICAqIEByZXR1cm4ge0FycmF5fSBBIGxpc3Qgb2YgdGhlIG9iamVjdCdzIG93biBwcm9wZXJ0aWVzIHRoYXQgbWFwIHRvIGZ1bmN0aW9ucy5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICBSLmZ1bmN0aW9ucyhSKTsgLy8gcmV0dXJucyBsaXN0IG9mIHJhbWRhJ3Mgb3duIGZ1bmN0aW9uIG5hbWVzXG4gICAgICpcbiAgICAgKiAgICAgIHZhciBGID0gZnVuY3Rpb24oKSB7IHRoaXMueCA9IGZ1bmN0aW9uKCl7fTsgdGhpcy55ID0gMTsgfVxuICAgICAqICAgICAgRi5wcm90b3R5cGUueiA9IGZ1bmN0aW9uKCkge307XG4gICAgICogICAgICBGLnByb3RvdHlwZS5hID0gMTAwO1xuICAgICAqICAgICAgUi5mdW5jdGlvbnMobmV3IEYoKSk7IC8vPT4gW1wieFwiXVxuICAgICAqL1xuICAgIHZhciBmdW5jdGlvbnMgPSBfY3VycnkxKF9mdW5jdGlvbnNXaXRoKGtleXMpKTtcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYSBsaXN0IG9mIGZ1bmN0aW9uIG5hbWVzIG9mIG9iamVjdCdzIG93biBhbmQgcHJvdG90eXBlIGZ1bmN0aW9uc1xuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBPYmplY3RcbiAgICAgKiBAc2lnIHsqfSAtPiBbU3RyaW5nXVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvYmogVGhlIG9iamVjdHMgd2l0aCBmdW5jdGlvbnMgaW4gaXRcbiAgICAgKiBAcmV0dXJuIHtBcnJheX0gQSBsaXN0IG9mIHRoZSBvYmplY3QncyBvd24gcHJvcGVydGllcyBhbmQgcHJvdG90eXBlXG4gICAgICogICAgICAgICBwcm9wZXJ0aWVzIHRoYXQgbWFwIHRvIGZ1bmN0aW9ucy5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICBSLmZ1bmN0aW9uc0luKFIpOyAvLyByZXR1cm5zIGxpc3Qgb2YgcmFtZGEncyBvd24gYW5kIHByb3RvdHlwZSBmdW5jdGlvbiBuYW1lc1xuICAgICAqXG4gICAgICogICAgICB2YXIgRiA9IGZ1bmN0aW9uKCkgeyB0aGlzLnggPSBmdW5jdGlvbigpe307IHRoaXMueSA9IDE7IH1cbiAgICAgKiAgICAgIEYucHJvdG90eXBlLnogPSBmdW5jdGlvbigpIHt9O1xuICAgICAqICAgICAgRi5wcm90b3R5cGUuYSA9IDEwMDtcbiAgICAgKiAgICAgIFIuZnVuY3Rpb25zSW4obmV3IEYoKSk7IC8vPT4gW1wieFwiLCBcInpcIl1cbiAgICAgKi9cbiAgICB2YXIgZnVuY3Rpb25zSW4gPSBfY3VycnkxKF9mdW5jdGlvbnNXaXRoKGtleXNJbikpO1xuXG4gICAgLyoqXG4gICAgICogU3BsaXRzIGEgbGlzdCBpbnRvIHN1Yi1saXN0cyBzdG9yZWQgaW4gYW4gb2JqZWN0LCBiYXNlZCBvbiB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgYSBTdHJpbmctcmV0dXJuaW5nIGZ1bmN0aW9uXG4gICAgICogb24gZWFjaCBlbGVtZW50LCBhbmQgZ3JvdXBpbmcgdGhlIHJlc3VsdHMgYWNjb3JkaW5nIHRvIHZhbHVlcyByZXR1cm5lZC5cbiAgICAgKlxuICAgICAqIEFjdHMgYXMgYSB0cmFuc2R1Y2VyIGlmIGEgdHJhbnNmb3JtZXIgaXMgZ2l2ZW4gaW4gbGlzdCBwb3NpdGlvbi5cbiAgICAgKiBAc2VlIFIudHJhbnNkdWNlXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IExpc3RcbiAgICAgKiBAc2lnIChhIC0+IFN0cmluZykgLT4gW2FdIC0+IHtTdHJpbmc6IFthXX1cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBGdW5jdGlvbiA6OiBhIC0+IFN0cmluZ1xuICAgICAqIEBwYXJhbSB7QXJyYXl9IGxpc3QgVGhlIGFycmF5IHRvIGdyb3VwXG4gICAgICogQHJldHVybiB7T2JqZWN0fSBBbiBvYmplY3Qgd2l0aCB0aGUgb3V0cHV0IG9mIGBmbmAgZm9yIGtleXMsIG1hcHBlZCB0byBhcnJheXMgb2YgZWxlbWVudHNcbiAgICAgKiAgICAgICAgIHRoYXQgcHJvZHVjZWQgdGhhdCBrZXkgd2hlbiBwYXNzZWQgdG8gYGZuYC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICB2YXIgYnlHcmFkZSA9IFIuZ3JvdXBCeShmdW5jdGlvbihzdHVkZW50KSB7XG4gICAgICogICAgICAgIHZhciBzY29yZSA9IHN0dWRlbnQuc2NvcmU7XG4gICAgICogICAgICAgIHJldHVybiBzY29yZSA8IDY1ID8gJ0YnIDpcbiAgICAgKiAgICAgICAgICAgICAgIHNjb3JlIDwgNzAgPyAnRCcgOlxuICAgICAqICAgICAgICAgICAgICAgc2NvcmUgPCA4MCA/ICdDJyA6XG4gICAgICogICAgICAgICAgICAgICBzY29yZSA8IDkwID8gJ0InIDogJ0EnO1xuICAgICAqICAgICAgfSk7XG4gICAgICogICAgICB2YXIgc3R1ZGVudHMgPSBbe25hbWU6ICdBYmJ5Jywgc2NvcmU6IDg0fSxcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICB7bmFtZTogJ0VkZHknLCBzY29yZTogNTh9LFxuICAgICAqICAgICAgICAgICAgICAgICAgICAgIC8vIC4uLlxuICAgICAqICAgICAgICAgICAgICAgICAgICAgIHtuYW1lOiAnSmFjaycsIHNjb3JlOiA2OX1dO1xuICAgICAqICAgICAgYnlHcmFkZShzdHVkZW50cyk7XG4gICAgICogICAgICAvLyB7XG4gICAgICogICAgICAvLyAgICdBJzogW3tuYW1lOiAnRGlhbm5lJywgc2NvcmU6IDk5fV0sXG4gICAgICogICAgICAvLyAgICdCJzogW3tuYW1lOiAnQWJieScsIHNjb3JlOiA4NH1dXG4gICAgICogICAgICAvLyAgIC8vIC4uLixcbiAgICAgKiAgICAgIC8vICAgJ0YnOiBbe25hbWU6ICdFZGR5Jywgc2NvcmU6IDU4fV1cbiAgICAgKiAgICAgIC8vIH1cbiAgICAgKi9cbiAgICB2YXIgZ3JvdXBCeSA9IF9jdXJyeTIoX2Rpc3BhdGNoYWJsZSgnZ3JvdXBCeScsIF94Z3JvdXBCeSwgZnVuY3Rpb24gZ3JvdXBCeShmbiwgbGlzdCkge1xuICAgICAgICByZXR1cm4gX3JlZHVjZShmdW5jdGlvbiAoYWNjLCBlbHQpIHtcbiAgICAgICAgICAgIHZhciBrZXkgPSBmbihlbHQpO1xuICAgICAgICAgICAgYWNjW2tleV0gPSBfYXBwZW5kKGVsdCwgYWNjW2tleV0gfHwgKGFjY1trZXldID0gW10pKTtcbiAgICAgICAgICAgIHJldHVybiBhY2M7XG4gICAgICAgIH0sIHt9LCBsaXN0KTtcbiAgICB9KSk7XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBmaXJzdCBlbGVtZW50IGluIGEgbGlzdC5cbiAgICAgKiBJbiBzb21lIGxpYnJhcmllcyB0aGlzIGZ1bmN0aW9uIGlzIG5hbWVkIGBmaXJzdGAuXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IExpc3RcbiAgICAgKiBAc2lnIFthXSAtPiBhXG4gICAgICogQHBhcmFtIHtBcnJheX0gbGlzdCBUaGUgYXJyYXkgdG8gY29uc2lkZXIuXG4gICAgICogQHJldHVybiB7Kn0gVGhlIGZpcnN0IGVsZW1lbnQgb2YgdGhlIGxpc3QsIG9yIGB1bmRlZmluZWRgIGlmIHRoZSBsaXN0IGlzIGVtcHR5LlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIFIuaGVhZChbJ2ZpJywgJ2ZvJywgJ2Z1bSddKTsgLy89PiAnZmknXG4gICAgICovXG4gICAgdmFyIGhlYWQgPSBudGgoMCk7XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgZnVuY3Rpb24gdGhhdCB3aWxsIHByb2Nlc3MgZWl0aGVyIHRoZSBgb25UcnVlYCBvciB0aGUgYG9uRmFsc2VgIGZ1bmN0aW9uIGRlcGVuZGluZ1xuICAgICAqIHVwb24gdGhlIHJlc3VsdCBvZiB0aGUgYGNvbmRpdGlvbmAgcHJlZGljYXRlLlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBMb2dpY1xuICAgICAqIEBzaWcgKCouLi4gLT4gQm9vbGVhbikgLT4gKCouLi4gLT4gKikgLT4gKCouLi4gLT4gKikgLT4gKCouLi4gLT4gKilcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjb25kaXRpb24gQSBwcmVkaWNhdGUgZnVuY3Rpb25cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBvblRydWUgQSBmdW5jdGlvbiB0byBpbnZva2Ugd2hlbiB0aGUgYGNvbmRpdGlvbmAgZXZhbHVhdGVzIHRvIGEgdHJ1dGh5IHZhbHVlLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IG9uRmFsc2UgQSBmdW5jdGlvbiB0byBpbnZva2Ugd2hlbiB0aGUgYGNvbmRpdGlvbmAgZXZhbHVhdGVzIHRvIGEgZmFsc3kgdmFsdWUuXG4gICAgICogQHJldHVybiB7RnVuY3Rpb259IEEgbmV3IHVuYXJ5IGZ1bmN0aW9uIHRoYXQgd2lsbCBwcm9jZXNzIGVpdGhlciB0aGUgYG9uVHJ1ZWAgb3IgdGhlIGBvbkZhbHNlYFxuICAgICAqICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiBkZXBlbmRpbmcgdXBvbiB0aGUgcmVzdWx0IG9mIHRoZSBgY29uZGl0aW9uYCBwcmVkaWNhdGUuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgLy8gRmxhdHRlbiBhbGwgYXJyYXlzIGluIHRoZSBsaXN0IGJ1dCBsZWF2ZSBvdGhlciB2YWx1ZXMgYWxvbmUuXG4gICAgICogICAgICB2YXIgZmxhdHRlbkFycmF5cyA9IFIubWFwKFIuaWZFbHNlKEFycmF5LmlzQXJyYXksIFIuZmxhdHRlbiwgUi5pZGVudGl0eSkpO1xuICAgICAqXG4gICAgICogICAgICBmbGF0dGVuQXJyYXlzKFtbMF0sIFtbMTBdLCBbOF1dLCAxMjM0LCB7fV0pOyAvLz0+IFtbMF0sIFsxMCwgOF0sIDEyMzQsIHt9XVxuICAgICAqICAgICAgZmxhdHRlbkFycmF5cyhbW1sxMF0sIDEyM10sIFs4LCBbMTBdXSwgXCJoZWxsb1wiXSk7IC8vPT4gW1sxMCwgMTIzXSwgWzgsIDEwXSwgXCJoZWxsb1wiXVxuICAgICAqL1xuICAgIHZhciBpZkVsc2UgPSBfY3VycnkzKGZ1bmN0aW9uIGlmRWxzZShjb25kaXRpb24sIG9uVHJ1ZSwgb25GYWxzZSkge1xuICAgICAgICByZXR1cm4gY3VycnlOKE1hdGgubWF4KGNvbmRpdGlvbi5sZW5ndGgsIG9uVHJ1ZS5sZW5ndGgsIG9uRmFsc2UubGVuZ3RoKSwgZnVuY3Rpb24gX2lmRWxzZSgpIHtcbiAgICAgICAgICAgIHJldHVybiBjb25kaXRpb24uYXBwbHkodGhpcywgYXJndW1lbnRzKSA/IG9uVHJ1ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpIDogb25GYWxzZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIEluc2VydHMgdGhlIHN1cHBsaWVkIGVsZW1lbnQgaW50byB0aGUgbGlzdCwgYXQgaW5kZXggYGluZGV4YC4gIF9Ob3RlXG4gICAgICogdGhhdCB0aGlzIGlzIG5vdCBkZXN0cnVjdGl2ZV86IGl0IHJldHVybnMgYSBjb3B5IG9mIHRoZSBsaXN0IHdpdGggdGhlIGNoYW5nZXMuXG4gICAgICogPHNtYWxsPk5vIGxpc3RzIGhhdmUgYmVlbiBoYXJtZWQgaW4gdGhlIGFwcGxpY2F0aW9uIG9mIHRoaXMgZnVuY3Rpb24uPC9zbWFsbD5cbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgTGlzdFxuICAgICAqIEBzaWcgTnVtYmVyIC0+IGEgLT4gW2FdIC0+IFthXVxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBpbmRleCBUaGUgcG9zaXRpb24gdG8gaW5zZXJ0IHRoZSBlbGVtZW50XG4gICAgICogQHBhcmFtIHsqfSBlbHQgVGhlIGVsZW1lbnQgdG8gaW5zZXJ0IGludG8gdGhlIEFycmF5XG4gICAgICogQHBhcmFtIHtBcnJheX0gbGlzdCBUaGUgbGlzdCB0byBpbnNlcnQgaW50b1xuICAgICAqIEByZXR1cm4ge0FycmF5fSBBIG5ldyBBcnJheSB3aXRoIGBlbHRgIGluc2VydGVkIGF0IGBpbmRleGAuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgUi5pbnNlcnQoMiwgJ3gnLCBbMSwyLDMsNF0pOyAvLz0+IFsxLDIsJ3gnLDMsNF1cbiAgICAgKi9cbiAgICB2YXIgaW5zZXJ0ID0gX2N1cnJ5MyhmdW5jdGlvbiBpbnNlcnQoaWR4LCBlbHQsIGxpc3QpIHtcbiAgICAgICAgaWR4ID0gaWR4IDwgbGlzdC5sZW5ndGggJiYgaWR4ID49IDAgPyBpZHggOiBsaXN0Lmxlbmd0aDtcbiAgICAgICAgcmV0dXJuIF9jb25jYXQoX2FwcGVuZChlbHQsIF9zbGljZShsaXN0LCAwLCBpZHgpKSwgX3NsaWNlKGxpc3QsIGlkeCkpO1xuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogQ29tYmluZXMgdHdvIGxpc3RzIGludG8gYSBzZXQgKGkuZS4gbm8gZHVwbGljYXRlcykgY29tcG9zZWQgb2YgdGhvc2VcbiAgICAgKiBlbGVtZW50cyBjb21tb24gdG8gYm90aCBsaXN0cy4gIER1cGxpY2F0aW9uIGlzIGRldGVybWluZWQgYWNjb3JkaW5nXG4gICAgICogdG8gdGhlIHZhbHVlIHJldHVybmVkIGJ5IGFwcGx5aW5nIHRoZSBzdXBwbGllZCBwcmVkaWNhdGUgdG8gdHdvIGxpc3RcbiAgICAgKiBlbGVtZW50cy5cbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgUmVsYXRpb25cbiAgICAgKiBAc2lnIChhLGEgLT4gQm9vbGVhbikgLT4gW2FdIC0+IFthXSAtPiBbYV1cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBwcmVkIEEgcHJlZGljYXRlIGZ1bmN0aW9uIHRoYXQgZGV0ZXJtaW5lcyB3aGV0aGVyXG4gICAgICogICAgICAgIHRoZSB0d28gc3VwcGxpZWQgZWxlbWVudHMgYXJlIGVxdWFsLlxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGxpc3QxIE9uZSBsaXN0IG9mIGl0ZW1zIHRvIGNvbXBhcmVcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBsaXN0MiBBIHNlY29uZCBsaXN0IG9mIGl0ZW1zIHRvIGNvbXBhcmVcbiAgICAgKiBAc2VlIFIuaW50ZXJzZWN0aW9uXG4gICAgICogQHJldHVybiB7QXJyYXl9IEEgbmV3IGxpc3QgY29udGFpbmluZyB0aG9zZSBlbGVtZW50cyBjb21tb24gdG8gYm90aCBsaXN0cy5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICB2YXIgYnVmZmFsb1NwcmluZ2ZpZWxkID0gW1xuICAgICAqICAgICAgICB7aWQ6IDgyNCwgbmFtZTogJ1JpY2hpZSBGdXJheSd9LFxuICAgICAqICAgICAgICB7aWQ6IDk1NiwgbmFtZTogJ0Rld2V5IE1hcnRpbid9LFxuICAgICAqICAgICAgICB7aWQ6IDMxMywgbmFtZTogJ0JydWNlIFBhbG1lcid9LFxuICAgICAqICAgICAgICB7aWQ6IDQ1NiwgbmFtZTogJ1N0ZXBoZW4gU3RpbGxzJ30sXG4gICAgICogICAgICAgIHtpZDogMTc3LCBuYW1lOiAnTmVpbCBZb3VuZyd9XG4gICAgICogICAgICBdO1xuICAgICAqICAgICAgdmFyIGNzbnkgPSBbXG4gICAgICogICAgICAgIHtpZDogMjA0LCBuYW1lOiAnRGF2aWQgQ3Jvc2J5J30sXG4gICAgICogICAgICAgIHtpZDogNDU2LCBuYW1lOiAnU3RlcGhlbiBTdGlsbHMnfSxcbiAgICAgKiAgICAgICAge2lkOiA1MzksIG5hbWU6ICdHcmFoYW0gTmFzaCd9LFxuICAgICAqICAgICAgICB7aWQ6IDE3NywgbmFtZTogJ05laWwgWW91bmcnfVxuICAgICAqICAgICAgXTtcbiAgICAgKlxuICAgICAqICAgICAgdmFyIHNhbWVJZCA9IGZ1bmN0aW9uKG8xLCBvMikge3JldHVybiBvMS5pZCA9PT0gbzIuaWQ7fTtcbiAgICAgKlxuICAgICAqICAgICAgUi5pbnRlcnNlY3Rpb25XaXRoKHNhbWVJZCwgYnVmZmFsb1NwcmluZ2ZpZWxkLCBjc255KTtcbiAgICAgKiAgICAgIC8vPT4gW3tpZDogNDU2LCBuYW1lOiAnU3RlcGhlbiBTdGlsbHMnfSwge2lkOiAxNzcsIG5hbWU6ICdOZWlsIFlvdW5nJ31dXG4gICAgICovXG4gICAgdmFyIGludGVyc2VjdGlvbldpdGggPSBfY3VycnkzKGZ1bmN0aW9uIGludGVyc2VjdGlvbldpdGgocHJlZCwgbGlzdDEsIGxpc3QyKSB7XG4gICAgICAgIHZhciByZXN1bHRzID0gW10sIGlkeCA9IDA7XG4gICAgICAgIHdoaWxlIChpZHggPCBsaXN0MS5sZW5ndGgpIHtcbiAgICAgICAgICAgIGlmIChfY29udGFpbnNXaXRoKHByZWQsIGxpc3QxW2lkeF0sIGxpc3QyKSkge1xuICAgICAgICAgICAgICAgIHJlc3VsdHNbcmVzdWx0cy5sZW5ndGhdID0gbGlzdDFbaWR4XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlkeCArPSAxO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB1bmlxV2l0aChwcmVkLCByZXN1bHRzKTtcbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSBuZXcgbGlzdCB3aXRoIHRoZSBzZXBhcmF0b3IgaW50ZXJwb3NlZCBiZXR3ZWVuIGVsZW1lbnRzLlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBMaXN0XG4gICAgICogQHNpZyBhIC0+IFthXSAtPiBbYV1cbiAgICAgKiBAcGFyYW0geyp9IHNlcGFyYXRvciBUaGUgZWxlbWVudCB0byBhZGQgdG8gdGhlIGxpc3QuXG4gICAgICogQHBhcmFtIHtBcnJheX0gbGlzdCBUaGUgbGlzdCB0byBiZSBpbnRlcnBvc2VkLlxuICAgICAqIEByZXR1cm4ge0FycmF5fSBUaGUgbmV3IGxpc3QuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgUi5pbnRlcnNwZXJzZSgnbicsIFsnYmEnLCAnYScsICdhJ10pOyAvLz0+IFsnYmEnLCAnbicsICdhJywgJ24nLCAnYSddXG4gICAgICovXG4gICAgdmFyIGludGVyc3BlcnNlID0gX2N1cnJ5MihfY2hlY2tGb3JNZXRob2QoJ2ludGVyc3BlcnNlJywgZnVuY3Rpb24gaW50ZXJzcGVyc2Uoc2VwYXJhdG9yLCBsaXN0KSB7XG4gICAgICAgIHZhciBvdXQgPSBbXTtcbiAgICAgICAgdmFyIGlkeCA9IDA7XG4gICAgICAgIHZhciBsZW5ndGggPSBsaXN0Lmxlbmd0aDtcbiAgICAgICAgd2hpbGUgKGlkeCA8IGxlbmd0aCkge1xuICAgICAgICAgICAgaWYgKGlkeCA9PT0gbGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgICAgIG91dC5wdXNoKGxpc3RbaWR4XSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG91dC5wdXNoKGxpc3RbaWR4XSwgc2VwYXJhdG9yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlkeCArPSAxO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfSkpO1xuXG4gICAgLyoqXG4gICAgICogU2FtZSBhcyBSLmludmVydE9iaiwgaG93ZXZlciB0aGlzIGFjY291bnRzIGZvciBvYmplY3RzXG4gICAgICogd2l0aCBkdXBsaWNhdGUgdmFsdWVzIGJ5IHB1dHRpbmcgdGhlIHZhbHVlcyBpbnRvIGFuXG4gICAgICogYXJyYXkuXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IE9iamVjdFxuICAgICAqIEBzaWcge3M6IHh9IC0+IHt4OiBbIHMsIC4uLiBdfVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvYmogVGhlIG9iamVjdCBvciBhcnJheSB0byBpbnZlcnRcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IG91dCBBIG5ldyBvYmplY3Qgd2l0aCBrZXlzXG4gICAgICogaW4gYW4gYXJyYXkuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgdmFyIHJhY2VSZXN1bHRzQnlGaXJzdE5hbWUgPSB7XG4gICAgICogICAgICAgIGZpcnN0OiAnYWxpY2UnLFxuICAgICAqICAgICAgICBzZWNvbmQ6ICdqYWtlJyxcbiAgICAgKiAgICAgICAgdGhpcmQ6ICdhbGljZScsXG4gICAgICogICAgICB9O1xuICAgICAqICAgICAgUi5pbnZlcnQocmFjZVJlc3VsdHNCeUZpcnN0TmFtZSk7XG4gICAgICogICAgICAvLz0+IHsgJ2FsaWNlJzogWydmaXJzdCcsICd0aGlyZCddLCAnamFrZSc6WydzZWNvbmQnXSB9XG4gICAgICovXG4gICAgdmFyIGludmVydCA9IF9jdXJyeTEoZnVuY3Rpb24gaW52ZXJ0KG9iaikge1xuICAgICAgICB2YXIgcHJvcHMgPSBrZXlzKG9iaik7XG4gICAgICAgIHZhciBsZW4gPSBwcm9wcy5sZW5ndGg7XG4gICAgICAgIHZhciBpZHggPSAwO1xuICAgICAgICB2YXIgb3V0ID0ge307XG4gICAgICAgIHdoaWxlIChpZHggPCBsZW4pIHtcbiAgICAgICAgICAgIHZhciBrZXkgPSBwcm9wc1tpZHhdO1xuICAgICAgICAgICAgdmFyIHZhbCA9IG9ialtrZXldO1xuICAgICAgICAgICAgdmFyIGxpc3QgPSBfaGFzKHZhbCwgb3V0KSA/IG91dFt2YWxdIDogb3V0W3ZhbF0gPSBbXTtcbiAgICAgICAgICAgIGxpc3RbbGlzdC5sZW5ndGhdID0ga2V5O1xuICAgICAgICAgICAgaWR4ICs9IDE7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYSBuZXcgb2JqZWN0IHdpdGggdGhlIGtleXMgb2YgdGhlIGdpdmVuIG9iamVjdFxuICAgICAqIGFzIHZhbHVlcywgYW5kIHRoZSB2YWx1ZXMgb2YgdGhlIGdpdmVuIG9iamVjdCBhcyBrZXlzLlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBPYmplY3RcbiAgICAgKiBAc2lnIHtzOiB4fSAtPiB7eDogc31cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb2JqIFRoZSBvYmplY3Qgb3IgYXJyYXkgdG8gaW52ZXJ0XG4gICAgICogQHJldHVybiB7T2JqZWN0fSBvdXQgQSBuZXcgb2JqZWN0XG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgdmFyIHJhY2VSZXN1bHRzID0ge1xuICAgICAqICAgICAgICBmaXJzdDogJ2FsaWNlJyxcbiAgICAgKiAgICAgICAgc2Vjb25kOiAnamFrZSdcbiAgICAgKiAgICAgIH07XG4gICAgICogICAgICBSLmludmVydE9iaihyYWNlUmVzdWx0cyk7XG4gICAgICogICAgICAvLz0+IHsgJ2FsaWNlJzogJ2ZpcnN0JywgJ2pha2UnOidzZWNvbmQnIH1cbiAgICAgKlxuICAgICAqICAgICAgLy8gQWx0ZXJuYXRpdmVseTpcbiAgICAgKiAgICAgIHZhciByYWNlUmVzdWx0cyA9IFsnYWxpY2UnLCAnamFrZSddO1xuICAgICAqICAgICAgUi5pbnZlcnRPYmoocmFjZVJlc3VsdHMpO1xuICAgICAqICAgICAgLy89PiB7ICdhbGljZSc6ICcwJywgJ2pha2UnOicxJyB9XG4gICAgICovXG4gICAgdmFyIGludmVydE9iaiA9IF9jdXJyeTEoZnVuY3Rpb24gaW52ZXJ0T2JqKG9iaikge1xuICAgICAgICB2YXIgcHJvcHMgPSBrZXlzKG9iaik7XG4gICAgICAgIHZhciBsZW4gPSBwcm9wcy5sZW5ndGg7XG4gICAgICAgIHZhciBpZHggPSAwO1xuICAgICAgICB2YXIgb3V0ID0ge307XG4gICAgICAgIHdoaWxlIChpZHggPCBsZW4pIHtcbiAgICAgICAgICAgIHZhciBrZXkgPSBwcm9wc1tpZHhdO1xuICAgICAgICAgICAgb3V0W29ialtrZXldXSA9IGtleTtcbiAgICAgICAgICAgIGlkeCArPSAxO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBUdXJucyBhIG5hbWVkIG1ldGhvZCB3aXRoIGEgc3BlY2lmaWVkIGFyaXR5IGludG8gYSBmdW5jdGlvblxuICAgICAqIHRoYXQgY2FuIGJlIGNhbGxlZCBkaXJlY3RseSBzdXBwbGllZCB3aXRoIGFyZ3VtZW50cyBhbmQgYSB0YXJnZXQgb2JqZWN0LlxuICAgICAqXG4gICAgICogVGhlIHJldHVybmVkIGZ1bmN0aW9uIGlzIGN1cnJpZWQgYW5kIGFjY2VwdHMgYGFyaXR5ICsgMWAgcGFyYW1ldGVycyB3aGVyZVxuICAgICAqIHRoZSBmaW5hbCBwYXJhbWV0ZXIgaXMgdGhlIHRhcmdldCBvYmplY3QuXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IEZ1bmN0aW9uXG4gICAgICogQHNpZyBOdW1iZXIgLT4gU3RyaW5nIC0+IChhIC0+IGIgLT4gLi4uIC0+IG4gLT4gT2JqZWN0IC0+ICopXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGFyaXR5IE51bWJlciBvZiBhcmd1bWVudHMgdGhlIHJldHVybmVkIGZ1bmN0aW9uIHNob3VsZCB0YWtlXG4gICAgICogICAgICAgIGJlZm9yZSB0aGUgdGFyZ2V0IG9iamVjdC5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBtZXRob2QgTmFtZSBvZiB0aGUgbWV0aG9kIHRvIGNhbGwuXG4gICAgICogQHJldHVybiB7RnVuY3Rpb259IEEgbmV3IGN1cnJpZWQgZnVuY3Rpb24uXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgdmFyIHNsaWNlRnJvbSA9IFIuaW52b2tlcigxLCAnc2xpY2UnKTtcbiAgICAgKiAgICAgIHNsaWNlRnJvbSg2LCAnYWJjZGVmZ2hpamtsbScpOyAvLz0+ICdnaGlqa2xtJ1xuICAgICAqICAgICAgdmFyIHNsaWNlRnJvbTYgPSBSLmludm9rZXIoMiwgJ3NsaWNlJykoNik7XG4gICAgICogICAgICBzbGljZUZyb202KDgsICdhYmNkZWZnaGlqa2xtJyk7IC8vPT4gJ2doJ1xuICAgICAqL1xuICAgIHZhciBpbnZva2VyID0gX2N1cnJ5MihmdW5jdGlvbiBpbnZva2VyKGFyaXR5LCBtZXRob2QpIHtcbiAgICAgICAgcmV0dXJuIGN1cnJ5Tihhcml0eSArIDEsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciB0YXJnZXQgPSBhcmd1bWVudHNbYXJpdHldO1xuICAgICAgICAgICAgcmV0dXJuIHRhcmdldFttZXRob2RdLmFwcGx5KHRhcmdldCwgX3NsaWNlKGFyZ3VtZW50cywgMCwgYXJpdHkpKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGEgc3RyaW5nIG1hZGUgYnkgaW5zZXJ0aW5nIHRoZSBgc2VwYXJhdG9yYCBiZXR3ZWVuIGVhY2hcbiAgICAgKiBlbGVtZW50IGFuZCBjb25jYXRlbmF0aW5nIGFsbCB0aGUgZWxlbWVudHMgaW50byBhIHNpbmdsZSBzdHJpbmcuXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IExpc3RcbiAgICAgKiBAc2lnIFN0cmluZyAtPiBbYV0gLT4gU3RyaW5nXG4gICAgICogQHBhcmFtIHtOdW1iZXJ8U3RyaW5nfSBzZXBhcmF0b3IgVGhlIHN0cmluZyB1c2VkIHRvIHNlcGFyYXRlIHRoZSBlbGVtZW50cy5cbiAgICAgKiBAcGFyYW0ge0FycmF5fSB4cyBUaGUgZWxlbWVudHMgdG8gam9pbiBpbnRvIGEgc3RyaW5nLlxuICAgICAqIEByZXR1cm4ge1N0cmluZ30gc3RyIFRoZSBzdHJpbmcgbWFkZSBieSBjb25jYXRlbmF0aW5nIGB4c2Agd2l0aCBgc2VwYXJhdG9yYC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICB2YXIgc3BhY2VyID0gUi5qb2luKCcgJyk7XG4gICAgICogICAgICBzcGFjZXIoWydhJywgMiwgMy40XSk7ICAgLy89PiAnYSAyIDMuNCdcbiAgICAgKiAgICAgIFIuam9pbignfCcsIFsxLCAyLCAzXSk7ICAgIC8vPT4gJzF8MnwzJ1xuICAgICAqL1xuICAgIHZhciBqb2luID0gaW52b2tlcigxLCAnam9pbicpO1xuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgbGFzdCBlbGVtZW50IGZyb20gYSBsaXN0LlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBMaXN0XG4gICAgICogQHNpZyBbYV0gLT4gYVxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGxpc3QgVGhlIGFycmF5IHRvIGNvbnNpZGVyLlxuICAgICAqIEByZXR1cm4geyp9IFRoZSBsYXN0IGVsZW1lbnQgb2YgdGhlIGxpc3QsIG9yIGB1bmRlZmluZWRgIGlmIHRoZSBsaXN0IGlzIGVtcHR5LlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIFIubGFzdChbJ2ZpJywgJ2ZvJywgJ2Z1bSddKTsgLy89PiAnZnVtJ1xuICAgICAqL1xuICAgIHZhciBsYXN0ID0gbnRoKC0xKTtcblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSBsZW5zIHRoYXQgd2lsbCBmb2N1cyBvbiBpbmRleCBgbmAgb2YgdGhlIHNvdXJjZSBhcnJheS5cbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgTGlzdFxuICAgICAqIEBzZWUgUi5sZW5zXG4gICAgICogQHNpZyBOdW1iZXIgLT4gKGEgLT4gYilcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gbiBUaGUgaW5kZXggb2YgdGhlIGFycmF5IHRoYXQgdGhlIHJldHVybmVkIGxlbnMgd2lsbCBmb2N1cyBvbi5cbiAgICAgKiBAcmV0dXJuIHtGdW5jdGlvbn0gdGhlIHJldHVybmVkIGZ1bmN0aW9uIGhhcyBgc2V0YCBhbmQgYG1hcGAgcHJvcGVydGllcyB0aGF0IGFyZVxuICAgICAqICAgICAgICAgYWxzbyBjdXJyaWVkIGZ1bmN0aW9ucy5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgIHZhciBoZWFkTGVucyA9IFIubGVuc0luZGV4KDApO1xuICAgICAqICAgICBoZWFkTGVucyhbMTAsIDIwLCAzMCwgNDBdKTsgLy89PiAxMFxuICAgICAqICAgICBoZWFkTGVucy5zZXQoJ211JywgWzEwLCAyMCwgMzAsIDQwXSk7IC8vPT4gWydtdScsIDIwLCAzMCwgNDBdXG4gICAgICogICAgIGhlYWRMZW5zLm1hcChmdW5jdGlvbih4KSB7IHJldHVybiB4ICsgMTsgfSwgWzEwLCAyMCwgMzAsIDQwXSk7IC8vPT4gWzExLCAyMCwgMzAsIDQwXVxuICAgICAqL1xuICAgIHZhciBsZW5zSW5kZXggPSBfY3VycnkxKGZ1bmN0aW9uIGxlbnNJbmRleChuKSB7XG4gICAgICAgIHJldHVybiBsZW5zKG50aChuKSwgdXBkYXRlKG4pKTtcbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSBsZW5zIHRoYXQgd2lsbCBmb2N1cyBvbiBwcm9wZXJ0eSBga2Agb2YgdGhlIHNvdXJjZSBvYmplY3QuXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IE9iamVjdFxuICAgICAqIEBzZWUgUi5sZW5zXG4gICAgICogQHNpZyBTdHJpbmcgLT4gKGEgLT4gYilcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gayBBIHN0cmluZyB0aGF0IHJlcHJlc2VudHMgYSBwcm9wZXJ0eSB0byBmb2N1cyBvbi5cbiAgICAgKiBAcmV0dXJuIHtGdW5jdGlvbn0gdGhlIHJldHVybmVkIGZ1bmN0aW9uIGhhcyBgc2V0YCBhbmQgYG1hcGAgcHJvcGVydGllcyB0aGF0IGFyZVxuICAgICAqICAgICAgICAgYWxzbyBjdXJyaWVkIGZ1bmN0aW9ucy5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgIHZhciBwaHJhc2VMZW5zID0gUi5sZW5zUHJvcCgncGhyYXNlJyk7XG4gICAgICogICAgIHZhciBvYmoxID0geyBwaHJhc2U6ICdBYnNvbHV0ZSBmaWx0aCAuIC4gLiBhbmQgSSBMT1ZFRCBpdCEnfTtcbiAgICAgKiAgICAgdmFyIG9iajIgPSB7IHBocmFzZTogXCJXaGF0J3MgYWxsIHRoaXMsIHRoZW4/XCJ9O1xuICAgICAqICAgICBwaHJhc2VMZW5zKG9iajEpOyAvLyA9PiAnQWJzb2x1dGUgZmlsdGggLiAuIC4gYW5kIEkgTE9WRUQgaXQhJ1xuICAgICAqICAgICBwaHJhc2VMZW5zKG9iajIpOyAvLyA9PiBcIldoYXQncyBhbGwgdGhpcywgdGhlbj9cIlxuICAgICAqICAgICBwaHJhc2VMZW5zLnNldCgnT29oIEJldHR5Jywgb2JqMSk7IC8vPT4geyBwaHJhc2U6ICdPb2ggQmV0dHknfVxuICAgICAqICAgICBwaHJhc2VMZW5zLm1hcChSLnRvVXBwZXIsIG9iajIpOyAvLz0+IHsgcGhyYXNlOiBcIldIQVQnUyBBTEwgVEhJUywgVEhFTj9cIn1cbiAgICAgKi9cbiAgICB2YXIgbGVuc1Byb3AgPSBfY3VycnkxKGZ1bmN0aW9uIGxlbnNQcm9wKGspIHtcbiAgICAgICAgcmV0dXJuIGxlbnMocHJvcChrKSwgYXNzb2MoaykpO1xuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhIG5ldyBsaXN0LCBjb25zdHJ1Y3RlZCBieSBhcHBseWluZyB0aGUgc3VwcGxpZWQgZnVuY3Rpb24gdG8gZXZlcnkgZWxlbWVudCBvZiB0aGVcbiAgICAgKiBzdXBwbGllZCBsaXN0LlxuICAgICAqXG4gICAgICogTm90ZTogYFIubWFwYCBkb2VzIG5vdCBza2lwIGRlbGV0ZWQgb3IgdW5hc3NpZ25lZCBpbmRpY2VzIChzcGFyc2UgYXJyYXlzKSwgdW5saWtlIHRoZVxuICAgICAqIG5hdGl2ZSBgQXJyYXkucHJvdG90eXBlLm1hcGAgbWV0aG9kLiBGb3IgbW9yZSBkZXRhaWxzIG9uIHRoaXMgYmVoYXZpb3IsIHNlZTpcbiAgICAgKiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9BcnJheS9tYXAjRGVzY3JpcHRpb25cbiAgICAgKlxuICAgICAqIEFjdHMgYXMgYSB0cmFuc2R1Y2VyIGlmIGEgdHJhbnNmb3JtZXIgaXMgZ2l2ZW4gaW4gbGlzdCBwb3NpdGlvbi5cbiAgICAgKiBAc2VlIFIudHJhbnNkdWNlXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IExpc3RcbiAgICAgKiBAc2lnIChhIC0+IGIpIC0+IFthXSAtPiBbYl1cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgZnVuY3Rpb24gdG8gYmUgY2FsbGVkIG9uIGV2ZXJ5IGVsZW1lbnQgb2YgdGhlIGlucHV0IGBsaXN0YC5cbiAgICAgKiBAcGFyYW0ge0FycmF5fSBsaXN0IFRoZSBsaXN0IHRvIGJlIGl0ZXJhdGVkIG92ZXIuXG4gICAgICogQHJldHVybiB7QXJyYXl9IFRoZSBuZXcgbGlzdC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICB2YXIgZG91YmxlID0gZnVuY3Rpb24oeCkge1xuICAgICAqICAgICAgICByZXR1cm4geCAqIDI7XG4gICAgICogICAgICB9O1xuICAgICAqXG4gICAgICogICAgICBSLm1hcChkb3VibGUsIFsxLCAyLCAzXSk7IC8vPT4gWzIsIDQsIDZdXG4gICAgICovXG4gICAgdmFyIG1hcCA9IF9jdXJyeTIoX2Rpc3BhdGNoYWJsZSgnbWFwJywgX3htYXAsIF9tYXApKTtcblxuICAgIC8qKlxuICAgICAqIE1hcCwgYnV0IGZvciBvYmplY3RzLiBDcmVhdGVzIGFuIG9iamVjdCB3aXRoIHRoZSBzYW1lIGtleXMgYXMgYG9iamAgYW5kIHZhbHVlc1xuICAgICAqIGdlbmVyYXRlZCBieSBydW5uaW5nIGVhY2ggcHJvcGVydHkgb2YgYG9iamAgdGhyb3VnaCBgZm5gLiBgZm5gIGlzIHBhc3NlZCBvbmUgYXJndW1lbnQ6XG4gICAgICogKih2YWx1ZSkqLlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBPYmplY3RcbiAgICAgKiBAc2lnICh2IC0+IHYpIC0+IHtrOiB2fSAtPiB7azogdn1cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBBIGZ1bmN0aW9uIGNhbGxlZCBmb3IgZWFjaCBwcm9wZXJ0eSBpbiBgb2JqYC4gSXRzIHJldHVybiB2YWx1ZSB3aWxsXG4gICAgICogYmVjb21lIGEgbmV3IHByb3BlcnR5IG9uIHRoZSByZXR1cm4gb2JqZWN0LlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvYmogVGhlIG9iamVjdCB0byBpdGVyYXRlIG92ZXIuXG4gICAgICogQHJldHVybiB7T2JqZWN0fSBBIG5ldyBvYmplY3Qgd2l0aCB0aGUgc2FtZSBrZXlzIGFzIGBvYmpgIGFuZCB2YWx1ZXMgdGhhdCBhcmUgdGhlIHJlc3VsdFxuICAgICAqICAgICAgICAgb2YgcnVubmluZyBlYWNoIHByb3BlcnR5IHRocm91Z2ggYGZuYC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICB2YXIgdmFsdWVzID0geyB4OiAxLCB5OiAyLCB6OiAzIH07XG4gICAgICogICAgICB2YXIgZG91YmxlID0gZnVuY3Rpb24obnVtKSB7XG4gICAgICogICAgICAgIHJldHVybiBudW0gKiAyO1xuICAgICAqICAgICAgfTtcbiAgICAgKlxuICAgICAqICAgICAgUi5tYXBPYmooZG91YmxlLCB2YWx1ZXMpOyAvLz0+IHsgeDogMiwgeTogNCwgejogNiB9XG4gICAgICovXG4gICAgdmFyIG1hcE9iaiA9IF9jdXJyeTIoZnVuY3Rpb24gbWFwT2JqZWN0KGZuLCBvYmopIHtcbiAgICAgICAgcmV0dXJuIF9yZWR1Y2UoZnVuY3Rpb24gKGFjYywga2V5KSB7XG4gICAgICAgICAgICBhY2Nba2V5XSA9IGZuKG9ialtrZXldKTtcbiAgICAgICAgICAgIHJldHVybiBhY2M7XG4gICAgICAgIH0sIHt9LCBrZXlzKG9iaikpO1xuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogTGlrZSBgbWFwT2JqYCwgYnV0IGJ1dCBwYXNzZXMgYWRkaXRpb25hbCBhcmd1bWVudHMgdG8gdGhlIHByZWRpY2F0ZSBmdW5jdGlvbi4gVGhlXG4gICAgICogcHJlZGljYXRlIGZ1bmN0aW9uIGlzIHBhc3NlZCB0aHJlZSBhcmd1bWVudHM6ICoodmFsdWUsIGtleSwgb2JqKSouXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IE9iamVjdFxuICAgICAqIEBzaWcgKHYsIGssIHtrOiB2fSAtPiB2KSAtPiB7azogdn0gLT4ge2s6IHZ9XG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gQSBmdW5jdGlvbiBjYWxsZWQgZm9yIGVhY2ggcHJvcGVydHkgaW4gYG9iamAuIEl0cyByZXR1cm4gdmFsdWUgd2lsbFxuICAgICAqICAgICAgICBiZWNvbWUgYSBuZXcgcHJvcGVydHkgb24gdGhlIHJldHVybiBvYmplY3QuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9iaiBUaGUgb2JqZWN0IHRvIGl0ZXJhdGUgb3Zlci5cbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IEEgbmV3IG9iamVjdCB3aXRoIHRoZSBzYW1lIGtleXMgYXMgYG9iamAgYW5kIHZhbHVlcyB0aGF0IGFyZSB0aGUgcmVzdWx0XG4gICAgICogICAgICAgICBvZiBydW5uaW5nIGVhY2ggcHJvcGVydHkgdGhyb3VnaCBgZm5gLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIHZhciB2YWx1ZXMgPSB7IHg6IDEsIHk6IDIsIHo6IDMgfTtcbiAgICAgKiAgICAgIHZhciBwcmVwZW5kS2V5QW5kRG91YmxlID0gZnVuY3Rpb24obnVtLCBrZXksIG9iaikge1xuICAgICAqICAgICAgICByZXR1cm4ga2V5ICsgKG51bSAqIDIpO1xuICAgICAqICAgICAgfTtcbiAgICAgKlxuICAgICAqICAgICAgUi5tYXBPYmpJbmRleGVkKHByZXBlbmRLZXlBbmREb3VibGUsIHZhbHVlcyk7IC8vPT4geyB4OiAneDInLCB5OiAneTQnLCB6OiAnejYnIH1cbiAgICAgKi9cbiAgICB2YXIgbWFwT2JqSW5kZXhlZCA9IF9jdXJyeTIoZnVuY3Rpb24gbWFwT2JqZWN0SW5kZXhlZChmbiwgb2JqKSB7XG4gICAgICAgIHJldHVybiBfcmVkdWNlKGZ1bmN0aW9uIChhY2MsIGtleSkge1xuICAgICAgICAgICAgYWNjW2tleV0gPSBmbihvYmpba2V5XSwga2V5LCBvYmopO1xuICAgICAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgICAgfSwge30sIGtleXMob2JqKSk7XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBUZXN0cyBhIHJlZ3VsYXIgZXhwcmVzc2lvbiBhZ2FpbnN0IGEgU3RyaW5nXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IFN0cmluZ1xuICAgICAqIEBzaWcgUmVnRXhwIC0+IFN0cmluZyAtPiBbU3RyaW5nXSB8IG51bGxcbiAgICAgKiBAcGFyYW0ge1JlZ0V4cH0gcnggQSByZWd1bGFyIGV4cHJlc3Npb24uXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHN0ciBUaGUgc3RyaW5nIHRvIG1hdGNoIGFnYWluc3RcbiAgICAgKiBAcmV0dXJuIHtBcnJheX0gVGhlIGxpc3Qgb2YgbWF0Y2hlcywgb3IgbnVsbCBpZiBubyBtYXRjaGVzIGZvdW5kLlxuICAgICAqIEBzZWUgUi5pbnZva2VyXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgUi5tYXRjaCgvKFthLXpdYSkvZywgJ2JhbmFuYXMnKTsgLy89PiBbJ2JhJywgJ25hJywgJ25hJ11cbiAgICAgKi9cbiAgICB2YXIgbWF0Y2ggPSBpbnZva2VyKDEsICdtYXRjaCcpO1xuXG4gICAgLyoqXG4gICAgICogRGV0ZXJtaW5lcyB0aGUgbGFyZ2VzdCBvZiBhIGxpc3Qgb2YgbnVtYmVycyAob3IgZWxlbWVudHMgdGhhdCBjYW4gYmUgY2FzdCB0byBudW1iZXJzKVxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBNYXRoXG4gICAgICogQHNpZyBbTnVtYmVyXSAtPiBOdW1iZXJcbiAgICAgKiBAc2VlIFIubWF4QnlcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBsaXN0IEEgbGlzdCBvZiBudW1iZXJzXG4gICAgICogQHJldHVybiB7TnVtYmVyfSBUaGUgZ3JlYXRlc3QgbnVtYmVyIGluIHRoZSBsaXN0LlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIFIubWF4KFs3LCAzLCA5LCAyLCA0LCA5LCAzXSk7IC8vPT4gOVxuICAgICAqL1xuICAgIHZhciBtYXggPSBfY3JlYXRlTWF4TWluKF9ndCwgLUluZmluaXR5KTtcblxuICAgIC8qKlxuICAgICAqIENyZWF0ZSBhIG5ldyBvYmplY3Qgd2l0aCB0aGUgb3duIHByb3BlcnRpZXMgb2YgYGFgXG4gICAgICogbWVyZ2VkIHdpdGggdGhlIG93biBwcm9wZXJ0aWVzIG9mIG9iamVjdCBgYmAuXG4gICAgICogVGhpcyBmdW5jdGlvbiB3aWxsICpub3QqIG11dGF0ZSBwYXNzZWQtaW4gb2JqZWN0cy5cbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgT2JqZWN0XG4gICAgICogQHNpZyB7azogdn0gLT4ge2s6IHZ9IC0+IHtrOiB2fVxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBhIHNvdXJjZSBvYmplY3RcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gYiBvYmplY3Qgd2l0aCBoaWdoZXIgcHJlY2VkZW5jZSBpbiBvdXRwdXRcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IFRoZSBkZXN0aW5hdGlvbiBvYmplY3QuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgUi5tZXJnZSh7ICduYW1lJzogJ2ZyZWQnLCAnYWdlJzogMTAgfSwgeyAnYWdlJzogNDAgfSk7XG4gICAgICogICAgICAvLz0+IHsgJ25hbWUnOiAnZnJlZCcsICdhZ2UnOiA0MCB9XG4gICAgICpcbiAgICAgKiAgICAgIHZhciByZXNldFRvRGVmYXVsdCA9IFIubWVyZ2UoUi5fXywge3g6IDB9KTtcbiAgICAgKiAgICAgIHJlc2V0VG9EZWZhdWx0KHt4OiA1LCB5OiAyfSk7IC8vPT4ge3g6IDAsIHk6IDJ9XG4gICAgICovXG4gICAgdmFyIG1lcmdlID0gX2N1cnJ5MihmdW5jdGlvbiBtZXJnZShhLCBiKSB7XG4gICAgICAgIHJldHVybiBfZXh0ZW5kKF9leHRlbmQoe30sIGEpLCBiKTtcbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIERldGVybWluZXMgdGhlIHNtYWxsZXN0IG9mIGEgbGlzdCBvZiBudW1iZXJzIChvciBlbGVtZW50cyB0aGF0IGNhbiBiZSBjYXN0IHRvIG51bWJlcnMpXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IE1hdGhcbiAgICAgKiBAc2lnIFtOdW1iZXJdIC0+IE51bWJlclxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGxpc3QgQSBsaXN0IG9mIG51bWJlcnNcbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9IFRoZSBncmVhdGVzdCBudW1iZXIgaW4gdGhlIGxpc3QuXG4gICAgICogQHNlZSBSLm1pbkJ5XG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgUi5taW4oWzcsIDMsIDksIDIsIDQsIDksIDNdKTsgLy89PiAyXG4gICAgICovXG4gICAgdmFyIG1pbiA9IF9jcmVhdGVNYXhNaW4oX2x0LCBJbmZpbml0eSk7XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGB0cnVlYCBpZiBubyBlbGVtZW50cyBvZiB0aGUgbGlzdCBtYXRjaCB0aGUgcHJlZGljYXRlLFxuICAgICAqIGBmYWxzZWAgb3RoZXJ3aXNlLlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBMaXN0XG4gICAgICogQHNpZyAoYSAtPiBCb29sZWFuKSAtPiBbYV0gLT4gQm9vbGVhblxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBwcmVkaWNhdGUgZnVuY3Rpb24uXG4gICAgICogQHBhcmFtIHtBcnJheX0gbGlzdCBUaGUgYXJyYXkgdG8gY29uc2lkZXIuXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn0gYHRydWVgIGlmIHRoZSBwcmVkaWNhdGUgaXMgbm90IHNhdGlzZmllZCBieSBldmVyeSBlbGVtZW50LCBgZmFsc2VgIG90aGVyd2lzZS5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICBSLm5vbmUoUi5pc05hTiwgWzEsIDIsIDNdKTsgLy89PiB0cnVlXG4gICAgICogICAgICBSLm5vbmUoUi5pc05hTiwgWzEsIDIsIDMsIE5hTl0pOyAvLz0+IGZhbHNlXG4gICAgICovXG4gICAgdmFyIG5vbmUgPSBfY3VycnkyKF9jb21wbGVtZW50KF9kaXNwYXRjaGFibGUoJ2FueScsIF94YW55LCBfYW55KSkpO1xuXG4gICAgLyoqXG4gICAgICogQSBmdW5jdGlvbiB0aGF0IHJldHVybnMgdGhlIGZpcnN0IHRydXRoeSBvZiB0d28gYXJndW1lbnRzIG90aGVyd2lzZSB0aGVcbiAgICAgKiBsYXN0IGFyZ3VtZW50LiBOb3RlIHRoYXQgdGhpcyBpcyBOT1Qgc2hvcnQtY2lyY3VpdGVkLCBtZWFuaW5nIHRoYXQgaWZcbiAgICAgKiBleHByZXNzaW9ucyBhcmUgcGFzc2VkIHRoZXkgYXJlIGJvdGggZXZhbHVhdGVkLlxuICAgICAqXG4gICAgICogRGlzcGF0Y2hlcyB0byB0aGUgYG9yYCBtZXRob2Qgb2YgdGhlIGZpcnN0IGFyZ3VtZW50IGlmIGFwcGxpY2FibGUuXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IExvZ2ljXG4gICAgICogQHNpZyAqIC0+ICogLT4gKlxuICAgICAqIEBwYXJhbSB7Kn0gYSBhbnkgdmFsdWVcbiAgICAgKiBAcGFyYW0geyp9IGIgYW55IG90aGVyIHZhbHVlXG4gICAgICogQHJldHVybiB7Kn0gdGhlIGZpcnN0IHRydXRoeSBhcmd1bWVudCwgb3RoZXJ3aXNlIHRoZSBsYXN0IGFyZ3VtZW50LlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIFIub3IoZmFsc2UsIHRydWUpOyAvLz0+IHRydWVcbiAgICAgKiAgICAgIFIub3IoMCwgW10pOyAvLz0+IFtdXG4gICAgICogICAgICBSLm9yKG51bGwsICcnKTsgPT4gJydcbiAgICAgKi9cbiAgICB2YXIgb3IgPSBfY3VycnkyKGZ1bmN0aW9uIG9yKGEsIGIpIHtcbiAgICAgICAgcmV0dXJuIF9oYXNNZXRob2QoJ29yJywgYSkgPyBhLm9yKGIpIDogYSB8fCBiO1xuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogVGFrZXMgYSBwcmVkaWNhdGUgYW5kIGEgbGlzdCBhbmQgcmV0dXJucyB0aGUgcGFpciBvZiBsaXN0cyBvZlxuICAgICAqIGVsZW1lbnRzIHdoaWNoIGRvIGFuZCBkbyBub3Qgc2F0aXNmeSB0aGUgcHJlZGljYXRlLCByZXNwZWN0aXZlbHkuXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IExpc3RcbiAgICAgKiBAc2lnIChhIC0+IEJvb2xlYW4pIC0+IFthXSAtPiBbW2FdLFthXV1cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBwcmVkIEEgcHJlZGljYXRlIHRvIGRldGVybWluZSB3aGljaCBhcnJheSB0aGUgZWxlbWVudCBiZWxvbmdzIHRvLlxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGxpc3QgVGhlIGFycmF5IHRvIHBhcnRpdGlvbi5cbiAgICAgKiBAcmV0dXJuIHtBcnJheX0gQSBuZXN0ZWQgYXJyYXksIGNvbnRhaW5pbmcgZmlyc3QgYW4gYXJyYXkgb2YgZWxlbWVudHMgdGhhdCBzYXRpc2ZpZWQgdGhlIHByZWRpY2F0ZSxcbiAgICAgKiAgICAgICAgIGFuZCBzZWNvbmQgYW4gYXJyYXkgb2YgZWxlbWVudHMgdGhhdCBkaWQgbm90IHNhdGlzZnkuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgUi5wYXJ0aXRpb24oUi5jb250YWlucygncycpLCBbJ3NzcycsICd0dHQnLCAnZm9vJywgJ2JhcnMnXSk7XG4gICAgICogICAgICAvLz0+IFsgWyAnc3NzJywgJ2JhcnMnIF0sICBbICd0dHQnLCAnZm9vJyBdIF1cbiAgICAgKi9cbiAgICB2YXIgcGFydGl0aW9uID0gX2N1cnJ5MihmdW5jdGlvbiBwYXJ0aXRpb24ocHJlZCwgbGlzdCkge1xuICAgICAgICByZXR1cm4gX3JlZHVjZShmdW5jdGlvbiAoYWNjLCBlbHQpIHtcbiAgICAgICAgICAgIHZhciB4cyA9IGFjY1twcmVkKGVsdCkgPyAwIDogMV07XG4gICAgICAgICAgICB4c1t4cy5sZW5ndGhdID0gZWx0O1xuICAgICAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgICAgfSwgW1xuICAgICAgICAgICAgW10sXG4gICAgICAgICAgICBbXVxuICAgICAgICBdLCBsaXN0KTtcbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIERldGVybWluZXMgd2hldGhlciBhIG5lc3RlZCBwYXRoIG9uIGFuIG9iamVjdCBoYXMgYSBzcGVjaWZpYyB2YWx1ZSxcbiAgICAgKiBpbiBgUi5lcXVhbHNgIHRlcm1zLiBNb3N0IGxpa2VseSB1c2VkIHRvIGZpbHRlciBhIGxpc3QuXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IFJlbGF0aW9uXG4gICAgICogQHNpZyBbU3RyaW5nXSAtPiAqIC0+IHtTdHJpbmc6ICp9IC0+IEJvb2xlYW5cbiAgICAgKiBAcGFyYW0ge0FycmF5fSBwYXRoIFRoZSBwYXRoIG9mIHRoZSBuZXN0ZWQgcHJvcGVydHkgdG8gdXNlXG4gICAgICogQHBhcmFtIHsqfSB2YWwgVGhlIHZhbHVlIHRvIGNvbXBhcmUgdGhlIG5lc3RlZCBwcm9wZXJ0eSB3aXRoXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9iaiBUaGUgb2JqZWN0IHRvIGNoZWNrIHRoZSBuZXN0ZWQgcHJvcGVydHkgaW5cbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufSBgdHJ1ZWAgaWYgdGhlIHZhbHVlIGVxdWFscyB0aGUgbmVzdGVkIG9iamVjdCBwcm9wZXJ0eSxcbiAgICAgKiAgICAgICAgIGBmYWxzZWAgb3RoZXJ3aXNlLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIHZhciB1c2VyMSA9IHsgYWRkcmVzczogeyB6aXBDb2RlOiA5MDIxMCB9IH07XG4gICAgICogICAgICB2YXIgdXNlcjIgPSB7IGFkZHJlc3M6IHsgemlwQ29kZTogNTU1NTUgfSB9O1xuICAgICAqICAgICAgdmFyIHVzZXIzID0geyBuYW1lOiAnQm9iJyB9O1xuICAgICAqICAgICAgdmFyIHVzZXJzID0gWyB1c2VyMSwgdXNlcjIsIHVzZXIzIF07XG4gICAgICogICAgICB2YXIgaXNGYW1vdXMgPSBSLnBhdGhFcShbJ2FkZHJlc3MnLCAnemlwQ29kZSddLCA5MDIxMCk7XG4gICAgICogICAgICBSLmZpbHRlcihpc0ZhbW91cywgdXNlcnMpOyAvLz0+IFsgdXNlcjEgXVxuICAgICAqL1xuICAgIHZhciBwYXRoRXEgPSBfY3VycnkzKGZ1bmN0aW9uIHBhdGhFcShwYXRoLCB2YWwsIG9iaikge1xuICAgICAgICByZXR1cm4gZXF1YWxzKF9wYXRoKHBhdGgsIG9iaiksIHZhbCk7XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgbmV3IGZ1bmN0aW9uIHRoYXQgcnVucyBlYWNoIG9mIHRoZSBmdW5jdGlvbnMgc3VwcGxpZWQgYXMgcGFyYW1ldGVycyBpbiB0dXJuLFxuICAgICAqIHBhc3NpbmcgdGhlIHJldHVybiB2YWx1ZSBvZiBlYWNoIGZ1bmN0aW9uIGludm9jYXRpb24gdG8gdGhlIG5leHQgZnVuY3Rpb24gaW52b2NhdGlvbixcbiAgICAgKiBiZWdpbm5pbmcgd2l0aCB3aGF0ZXZlciBhcmd1bWVudHMgd2VyZSBwYXNzZWQgdG8gdGhlIGluaXRpYWwgaW52b2NhdGlvbi5cbiAgICAgKlxuICAgICAqIGBwaXBlYCBpcyB0aGUgbWlycm9yIHZlcnNpb24gb2YgYGNvbXBvc2VgLiBgcGlwZWAgaXMgbGVmdC1hc3NvY2lhdGl2ZSwgd2hpY2ggbWVhbnMgdGhhdFxuICAgICAqIGVhY2ggb2YgdGhlIGZ1bmN0aW9ucyBwcm92aWRlZCBpcyBleGVjdXRlZCBpbiBvcmRlciBmcm9tIGxlZnQgdG8gcmlnaHQuXG4gICAgICpcbiAgICAgKiBJbiBzb21lIGxpYnJhcmllcyB0aGlzIGZ1bmN0aW9uIGlzIG5hbWVkIGBzZXF1ZW5jZWAuXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBGdW5jdGlvblxuICAgICAqIEBzaWcgKChhLi4uIC0+IGIpLCAoYiAtPiBjKSwgLi4uLCAoeCAtPiB5KSwgKHkgLT4geikpIC0+IChhLi4uIC0+IHopXG4gICAgICogQHBhcmFtIHsuLi5GdW5jdGlvbn0gZnVuY3Rpb25zIEEgdmFyaWFibGUgbnVtYmVyIG9mIGZ1bmN0aW9ucy5cbiAgICAgKiBAcmV0dXJuIHtGdW5jdGlvbn0gQSBuZXcgZnVuY3Rpb24gd2hpY2ggcmVwcmVzZW50cyB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgZWFjaCBvZiB0aGVcbiAgICAgKiAgICAgICAgIGlucHV0IGBmdW5jdGlvbnNgLCBwYXNzaW5nIHRoZSByZXN1bHQgb2YgZWFjaCBmdW5jdGlvbiBjYWxsIHRvIHRoZSBuZXh0LCBmcm9tXG4gICAgICogICAgICAgICBsZWZ0IHRvIHJpZ2h0LlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIHZhciB0cmlwbGUgPSBmdW5jdGlvbih4KSB7IHJldHVybiB4ICogMzsgfTtcbiAgICAgKiAgICAgIHZhciBkb3VibGUgPSBmdW5jdGlvbih4KSB7IHJldHVybiB4ICogMjsgfTtcbiAgICAgKiAgICAgIHZhciBzcXVhcmUgPSBmdW5jdGlvbih4KSB7IHJldHVybiB4ICogeDsgfTtcbiAgICAgKiAgICAgIHZhciBzcXVhcmVUaGVuRG91YmxlVGhlblRyaXBsZSA9IFIucGlwZShzcXVhcmUsIGRvdWJsZSwgdHJpcGxlKTtcbiAgICAgKlxuICAgICAqICAgICAgLy/iiYUgdHJpcGxlKGRvdWJsZShzcXVhcmUoNSkpKVxuICAgICAqICAgICAgc3F1YXJlVGhlbkRvdWJsZVRoZW5UcmlwbGUoNSk7IC8vPT4gMTUwXG4gICAgICovXG4gICAgdmFyIHBpcGUgPSBmdW5jdGlvbiBwaXBlKCkge1xuICAgICAgICByZXR1cm4gY29tcG9zZS5hcHBseSh0aGlzLCByZXZlcnNlKGFyZ3VtZW50cykpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgbmV3IGxlbnMgdGhhdCBhbGxvd3MgZ2V0dGluZyBhbmQgc2V0dGluZyB2YWx1ZXMgb2YgbmVzdGVkIHByb3BlcnRpZXMsIGJ5XG4gICAgICogZm9sbG93aW5nIGVhY2ggZ2l2ZW4gbGVucyBpbiBzdWNjZXNzaW9uLlxuICAgICAqXG4gICAgICogYHBpcGVMYCBpcyB0aGUgbWlycm9yIHZlcnNpb24gb2YgYGNvbXBvc2VMYC4gYHBpcGVMYCBpcyBsZWZ0LWFzc29jaWF0aXZlLCB3aGljaCBtZWFucyB0aGF0XG4gICAgICogZWFjaCBvZiB0aGUgZnVuY3Rpb25zIHByb3ZpZGVkIGlzIGV4ZWN1dGVkIGluIG9yZGVyIGZyb20gbGVmdCB0byByaWdodC5cbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgRnVuY3Rpb25cbiAgICAgKiBAc2VlIFIubGVuc1xuICAgICAqIEBzaWcgKChhIC0+IGIpLCAoYiAtPiBjKSwgLi4uLCAoeCAtPiB5KSwgKHkgLT4geikpIC0+IChhIC0+IHopXG4gICAgICogQHBhcmFtIHsuLi5GdW5jdGlvbn0gbGVuc2VzIEEgdmFyaWFibGUgbnVtYmVyIG9mIGxlbnNlcy5cbiAgICAgKiBAcmV0dXJuIHtGdW5jdGlvbn0gQSBuZXcgbGVucyB3aGljaCByZXByZXNlbnRzIHRoZSByZXN1bHQgb2YgY2FsbGluZyBlYWNoIG9mIHRoZVxuICAgICAqICAgICAgICAgaW5wdXQgYGxlbnNlc2AsIHBhc3NpbmcgdGhlIHJlc3VsdCBvZiBlYWNoIGdldHRlci9zZXR0ZXIgYXMgdGhlIHNvdXJjZVxuICAgICAqICAgICAgICAgdG8gdGhlIG5leHQsIGZyb20gcmlnaHQgdG8gbGVmdC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICB2YXIgaGVhZExlbnMgPSBSLmxlbnNJbmRleCgwKTtcbiAgICAgKiAgICAgIHZhciBzZWNvbmRMZW5zID0gUi5sZW5zSW5kZXgoMSk7XG4gICAgICogICAgICB2YXIgeExlbnMgPSBSLmxlbnNQcm9wKCd4Jyk7XG4gICAgICogICAgICB2YXIgaGVhZFRoZW5YVGhlblNlY29uZExlbnMgPSBSLnBpcGVMKGhlYWRMZW5zLCB4TGVucywgc2Vjb25kTGVucyk7XG4gICAgICpcbiAgICAgKiAgICAgIHZhciBzb3VyY2UgPSBbe3g6IFswLCAxXSwgeTogWzIsIDNdfSwge3g6IFs0LCA1XSwgeTogWzYsIDddfV07XG4gICAgICogICAgICBoZWFkVGhlblhUaGVuU2Vjb25kTGVucyhzb3VyY2UpOyAvLz0+IDFcbiAgICAgKiAgICAgIGhlYWRUaGVuWFRoZW5TZWNvbmRMZW5zLnNldCgxMjMsIHNvdXJjZSk7IC8vPT4gW3t4OiBbMCwgMTIzXSwgeTogWzIsIDNdfSwge3g6IFs0LCA1XSwgeTogWzYsIDddfV1cbiAgICAgKi9cbiAgICB2YXIgcGlwZUwgPSBjb21wb3NlKGFwcGx5KGNvbXBvc2VMKSwgdW5hcHBseShyZXZlcnNlKSk7XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgbmV3IGZ1bmN0aW9uIHRoYXQgcnVucyBlYWNoIG9mIHRoZSBmdW5jdGlvbnMgc3VwcGxpZWQgYXMgcGFyYW1ldGVycyBpbiB0dXJuLFxuICAgICAqIHBhc3NpbmcgdG8gdGhlIG5leHQgZnVuY3Rpb24gaW52b2NhdGlvbiBlaXRoZXIgdGhlIHZhbHVlIHJldHVybmVkIGJ5IHRoZSBwcmV2aW91c1xuICAgICAqIGZ1bmN0aW9uIG9yIHRoZSByZXNvbHZlZCB2YWx1ZSBpZiB0aGUgcmV0dXJuZWQgdmFsdWUgaXMgYSBwcm9taXNlLiBJbiBvdGhlciB3b3JkcyxcbiAgICAgKiBpZiBzb21lIG9mIHRoZSBmdW5jdGlvbnMgaW4gdGhlIHNlcXVlbmNlIHJldHVybiBwcm9taXNlcywgYHBpcGVQYCBwaXBlcyB0aGUgdmFsdWVzXG4gICAgICogYXN5bmNocm9ub3VzbHkuIElmIG5vbmUgb2YgdGhlIGZ1bmN0aW9ucyByZXR1cm4gcHJvbWlzZXMsIHRoZSBiZWhhdmlvciBpcyB0aGUgc2FtZSBhc1xuICAgICAqIHRoYXQgb2YgYHBpcGVgLlxuICAgICAqXG4gICAgICogYHBpcGVQYCBpcyB0aGUgbWlycm9yIHZlcnNpb24gb2YgYGNvbXBvc2VQYC4gYHBpcGVQYCBpcyBsZWZ0LWFzc29jaWF0aXZlLCB3aGljaCBtZWFucyB0aGF0XG4gICAgICogZWFjaCBvZiB0aGUgZnVuY3Rpb25zIHByb3ZpZGVkIGlzIGV4ZWN1dGVkIGluIG9yZGVyIGZyb20gbGVmdCB0byByaWdodC5cbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgRnVuY3Rpb25cbiAgICAgKiBAc2lnICgoYS4uLiAtPiBiKSwgKGIgLT4gYyksIC4uLiwgKHggLT4geSksICh5IC0+IHopKSAtPiAoYS4uLiAtPiB6KVxuICAgICAqIEBwYXJhbSB7Li4uRnVuY3Rpb259IGZ1bmN0aW9ucyBBIHZhcmlhYmxlIG51bWJlciBvZiBmdW5jdGlvbnMuXG4gICAgICogQHJldHVybiB7RnVuY3Rpb259IEEgbmV3IGZ1bmN0aW9uIHdoaWNoIHJlcHJlc2VudHMgdGhlIHJlc3VsdCBvZiBjYWxsaW5nIGVhY2ggb2YgdGhlXG4gICAgICogICAgICAgICBpbnB1dCBgZnVuY3Rpb25zYCwgcGFzc2luZyBlaXRoZXIgdGhlIHJldHVybmVkIHJlc3VsdCBvciB0aGUgYXN5bmNocm9ub3VzbHlcbiAgICAgKiAgICAgICAgIHJlc29sdmVkIHZhbHVlKSBvZiBlYWNoIGZ1bmN0aW9uIGNhbGwgdG8gdGhlIG5leHQsIGZyb20gbGVmdCB0byByaWdodC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICB2YXIgUSA9IHJlcXVpcmUoJ3EnKTtcbiAgICAgKiAgICAgIHZhciB0cmlwbGUgPSBmdW5jdGlvbih4KSB7IHJldHVybiB4ICogMzsgfTtcbiAgICAgKiAgICAgIHZhciBkb3VibGUgPSBmdW5jdGlvbih4KSB7IHJldHVybiB4ICogMjsgfTtcbiAgICAgKiAgICAgIHZhciBzcXVhcmVBc3luYyA9IGZ1bmN0aW9uKHgpIHsgcmV0dXJuIFEud2hlbih4ICogeCk7IH07XG4gICAgICogICAgICB2YXIgc3F1YXJlQXN5bmNUaGVuRG91YmxlVGhlblRyaXBsZSA9IFIucGlwZVAoc3F1YXJlQXN5bmMsIGRvdWJsZSwgdHJpcGxlKTtcbiAgICAgKlxuICAgICAqICAgICAgLy/iiYUgc3F1YXJlQXN5bmMoNSkudGhlbihmdW5jdGlvbih4KSB7IHJldHVybiB0cmlwbGUoZG91YmxlKHgpKSB9O1xuICAgICAqICAgICAgc3F1YXJlQXN5bmNUaGVuRG91YmxlVGhlblRyaXBsZSg1KVxuICAgICAqICAgICAgICAudGhlbihmdW5jdGlvbihyZXN1bHQpIHtcbiAgICAgKiAgICAgICAgICAvLyByZXN1bHQgaXMgMTUwXG4gICAgICogICAgICAgIH0pO1xuICAgICAqL1xuICAgIHZhciBwaXBlUCA9IGZ1bmN0aW9uIHBpcGVQKCkge1xuICAgICAgICByZXR1cm4gY29tcG9zZVAuYXBwbHkodGhpcywgcmV2ZXJzZShhcmd1bWVudHMpKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogRGV0ZXJtaW5lcyB3aGV0aGVyIHRoZSBnaXZlbiBwcm9wZXJ0eSBvZiBhbiBvYmplY3QgaGFzIGEgc3BlY2lmaWMgdmFsdWUsXG4gICAgICogaW4gYFIuZXF1YWxzYCB0ZXJtcy4gTW9zdCBsaWtlbHkgdXNlZCB0byBmaWx0ZXIgYSBsaXN0LlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBSZWxhdGlvblxuICAgICAqIEBzaWcgayAtPiB2IC0+IHtrOiB2fSAtPiBCb29sZWFuXG4gICAgICogQHBhcmFtIHtOdW1iZXJ8U3RyaW5nfSBuYW1lIFRoZSBwcm9wZXJ0eSBuYW1lIChvciBpbmRleCkgdG8gdXNlLlxuICAgICAqIEBwYXJhbSB7Kn0gdmFsIFRoZSB2YWx1ZSB0byBjb21wYXJlIHRoZSBwcm9wZXJ0eSB3aXRoLlxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59IGB0cnVlYCBpZiB0aGUgcHJvcGVydGllcyBhcmUgZXF1YWwsIGBmYWxzZWAgb3RoZXJ3aXNlLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIHZhciBhYmJ5ID0ge25hbWU6ICdBYmJ5JywgYWdlOiA3LCBoYWlyOiAnYmxvbmQnfTtcbiAgICAgKiAgICAgIHZhciBmcmVkID0ge25hbWU6ICdGcmVkJywgYWdlOiAxMiwgaGFpcjogJ2Jyb3duJ307XG4gICAgICogICAgICB2YXIgcnVzdHkgPSB7bmFtZTogJ1J1c3R5JywgYWdlOiAxMCwgaGFpcjogJ2Jyb3duJ307XG4gICAgICogICAgICB2YXIgYWxvaXMgPSB7bmFtZTogJ0Fsb2lzJywgYWdlOiAxNSwgZGlzcG9zaXRpb246ICdzdXJseSd9O1xuICAgICAqICAgICAgdmFyIGtpZHMgPSBbYWJieSwgZnJlZCwgcnVzdHksIGFsb2lzXTtcbiAgICAgKiAgICAgIHZhciBoYXNCcm93bkhhaXIgPSBSLnByb3BFcSgnaGFpcicsICdicm93bicpO1xuICAgICAqICAgICAgUi5maWx0ZXIoaGFzQnJvd25IYWlyLCBraWRzKTsgLy89PiBbZnJlZCwgcnVzdHldXG4gICAgICovXG4gICAgdmFyIHByb3BFcSA9IF9jdXJyeTMoZnVuY3Rpb24gcHJvcEVxKG5hbWUsIHZhbCwgb2JqKSB7XG4gICAgICAgIHJldHVybiBlcXVhbHMob2JqW25hbWVdLCB2YWwpO1xuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhIHNpbmdsZSBpdGVtIGJ5IGl0ZXJhdGluZyB0aHJvdWdoIHRoZSBsaXN0LCBzdWNjZXNzaXZlbHkgY2FsbGluZyB0aGUgaXRlcmF0b3JcbiAgICAgKiBmdW5jdGlvbiBhbmQgcGFzc2luZyBpdCBhbiBhY2N1bXVsYXRvciB2YWx1ZSBhbmQgdGhlIGN1cnJlbnQgdmFsdWUgZnJvbSB0aGUgYXJyYXksIGFuZFxuICAgICAqIHRoZW4gcGFzc2luZyB0aGUgcmVzdWx0IHRvIHRoZSBuZXh0IGNhbGwuXG4gICAgICpcbiAgICAgKiBUaGUgaXRlcmF0b3IgZnVuY3Rpb24gcmVjZWl2ZXMgdHdvIHZhbHVlczogKihhY2MsIHZhbHVlKSouICBJdCBtYXkgdXNlIGBSLnJlZHVjZWRgIHRvXG4gICAgICogc2hvcnRjdXQgdGhlIGl0ZXJhdGlvbi5cbiAgICAgKlxuICAgICAqIE5vdGU6IGBSLnJlZHVjZWAgZG9lcyBub3Qgc2tpcCBkZWxldGVkIG9yIHVuYXNzaWduZWQgaW5kaWNlcyAoc3BhcnNlIGFycmF5cyksIHVubGlrZVxuICAgICAqIHRoZSBuYXRpdmUgYEFycmF5LnByb3RvdHlwZS5yZWR1Y2VgIG1ldGhvZC4gRm9yIG1vcmUgZGV0YWlscyBvbiB0aGlzIGJlaGF2aW9yLCBzZWU6XG4gICAgICogaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvQXJyYXkvcmVkdWNlI0Rlc2NyaXB0aW9uXG4gICAgICogQHNlZSBSLnJlZHVjZWRcbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgTGlzdFxuICAgICAqIEBzaWcgKGEsYiAtPiBhKSAtPiBhIC0+IFtiXSAtPiBhXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGl0ZXJhdG9yIGZ1bmN0aW9uLiBSZWNlaXZlcyB0d28gdmFsdWVzLCB0aGUgYWNjdW11bGF0b3IgYW5kIHRoZVxuICAgICAqICAgICAgICBjdXJyZW50IGVsZW1lbnQgZnJvbSB0aGUgYXJyYXkuXG4gICAgICogQHBhcmFtIHsqfSBhY2MgVGhlIGFjY3VtdWxhdG9yIHZhbHVlLlxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGxpc3QgVGhlIGxpc3QgdG8gaXRlcmF0ZSBvdmVyLlxuICAgICAqIEByZXR1cm4geyp9IFRoZSBmaW5hbCwgYWNjdW11bGF0ZWQgdmFsdWUuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgdmFyIG51bWJlcnMgPSBbMSwgMiwgM107XG4gICAgICogICAgICB2YXIgYWRkID0gZnVuY3Rpb24oYSwgYikge1xuICAgICAqICAgICAgICByZXR1cm4gYSArIGI7XG4gICAgICogICAgICB9O1xuICAgICAqXG4gICAgICogICAgICBSLnJlZHVjZShhZGQsIDEwLCBudW1iZXJzKTsgLy89PiAxNlxuICAgICAqL1xuICAgIHZhciByZWR1Y2UgPSBfY3VycnkzKF9yZWR1Y2UpO1xuXG4gICAgLyoqXG4gICAgICogU2ltaWxhciB0byBgZmlsdGVyYCwgZXhjZXB0IHRoYXQgaXQga2VlcHMgb25seSB2YWx1ZXMgZm9yIHdoaWNoIHRoZSBnaXZlbiBwcmVkaWNhdGVcbiAgICAgKiBmdW5jdGlvbiByZXR1cm5zIGZhbHN5LiBUaGUgcHJlZGljYXRlIGZ1bmN0aW9uIGlzIHBhc3NlZCBvbmUgYXJndW1lbnQ6ICoodmFsdWUpKi5cbiAgICAgKlxuICAgICAqIEFjdHMgYXMgYSB0cmFuc2R1Y2VyIGlmIGEgdHJhbnNmb3JtZXIgaXMgZ2l2ZW4gaW4gbGlzdCBwb3NpdGlvbi5cbiAgICAgKiBAc2VlIFIudHJhbnNkdWNlXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IExpc3RcbiAgICAgKiBAc2lnIChhIC0+IEJvb2xlYW4pIC0+IFthXSAtPiBbYV1cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgZnVuY3Rpb24gY2FsbGVkIHBlciBpdGVyYXRpb24uXG4gICAgICogQHBhcmFtIHtBcnJheX0gbGlzdCBUaGUgY29sbGVjdGlvbiB0byBpdGVyYXRlIG92ZXIuXG4gICAgICogQHJldHVybiB7QXJyYXl9IFRoZSBuZXcgZmlsdGVyZWQgYXJyYXkuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgdmFyIGlzT2RkID0gZnVuY3Rpb24obikge1xuICAgICAqICAgICAgICByZXR1cm4gbiAlIDIgPT09IDE7XG4gICAgICogICAgICB9O1xuICAgICAqICAgICAgUi5yZWplY3QoaXNPZGQsIFsxLCAyLCAzLCA0XSk7IC8vPT4gWzIsIDRdXG4gICAgICovXG4gICAgdmFyIHJlamVjdCA9IF9jdXJyeTIoZnVuY3Rpb24gcmVqZWN0KGZuLCBsaXN0KSB7XG4gICAgICAgIHJldHVybiBmaWx0ZXIoX2NvbXBsZW1lbnQoZm4pLCBsaXN0KTtcbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYSBmaXhlZCBsaXN0IG9mIHNpemUgYG5gIGNvbnRhaW5pbmcgYSBzcGVjaWZpZWQgaWRlbnRpY2FsIHZhbHVlLlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBMaXN0XG4gICAgICogQHNpZyBhIC0+IG4gLT4gW2FdXG4gICAgICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcmVwZWF0LlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBuIFRoZSBkZXNpcmVkIHNpemUgb2YgdGhlIG91dHB1dCBsaXN0LlxuICAgICAqIEByZXR1cm4ge0FycmF5fSBBIG5ldyBhcnJheSBjb250YWluaW5nIGBuYCBgdmFsdWVgcy5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICBSLnJlcGVhdCgnaGknLCA1KTsgLy89PiBbJ2hpJywgJ2hpJywgJ2hpJywgJ2hpJywgJ2hpJ11cbiAgICAgKlxuICAgICAqICAgICAgdmFyIG9iaiA9IHt9O1xuICAgICAqICAgICAgdmFyIHJlcGVhdGVkT2JqcyA9IFIucmVwZWF0KG9iaiwgNSk7IC8vPT4gW3t9LCB7fSwge30sIHt9LCB7fV1cbiAgICAgKiAgICAgIHJlcGVhdGVkT2Jqc1swXSA9PT0gcmVwZWF0ZWRPYmpzWzFdOyAvLz0+IHRydWVcbiAgICAgKi9cbiAgICB2YXIgcmVwZWF0ID0gX2N1cnJ5MihmdW5jdGlvbiByZXBlYXQodmFsdWUsIG4pIHtcbiAgICAgICAgcmV0dXJuIHRpbWVzKGFsd2F5cyh2YWx1ZSksIG4pO1xuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhIGxpc3QgY29udGFpbmluZyB0aGUgZWxlbWVudHMgb2YgYHhzYCBmcm9tIGBmcm9tSW5kZXhgIChpbmNsdXNpdmUpXG4gICAgICogdG8gYHRvSW5kZXhgIChleGNsdXNpdmUpLlxuICAgICAqXG4gICAgICogRGlzcGF0Y2hlcyB0byBpdHMgdGhpcmQgYXJndW1lbnQncyBgc2xpY2VgIG1ldGhvZCBpZiBwcmVzZW50LiBBcyBhXG4gICAgICogcmVzdWx0LCBvbmUgbWF5IHJlcGxhY2UgYFthXWAgd2l0aCBgU3RyaW5nYCBpbiB0aGUgdHlwZSBzaWduYXR1cmUuXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IExpc3RcbiAgICAgKiBAc2lnIE51bWJlciAtPiBOdW1iZXIgLT4gW2FdIC0+IFthXVxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBmcm9tSW5kZXggVGhlIHN0YXJ0IGluZGV4IChpbmNsdXNpdmUpLlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSB0b0luZGV4IFRoZSBlbmQgaW5kZXggKGV4Y2x1c2l2ZSkuXG4gICAgICogQHBhcmFtIHtBcnJheX0geHMgVGhlIGxpc3QgdG8gdGFrZSBlbGVtZW50cyBmcm9tLlxuICAgICAqIEByZXR1cm4ge0FycmF5fSBUaGUgc2xpY2Ugb2YgYHhzYCBmcm9tIGBmcm9tSW5kZXhgIHRvIGB0b0luZGV4YC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICBSLnNsaWNlKDEsIDMsIFsnYScsICdiJywgJ2MnLCAnZCddKTsgICAgICAgIC8vPT4gWydiJywgJ2MnXVxuICAgICAqICAgICAgUi5zbGljZSgxLCBJbmZpbml0eSwgWydhJywgJ2InLCAnYycsICdkJ10pOyAvLz0+IFsnYicsICdjJywgJ2QnXVxuICAgICAqICAgICAgUi5zbGljZSgwLCAtMSwgWydhJywgJ2InLCAnYycsICdkJ10pOyAgICAgICAvLz0+IFsnYScsICdiJywgJ2MnXVxuICAgICAqICAgICAgUi5zbGljZSgtMywgLTEsIFsnYScsICdiJywgJ2MnLCAnZCddKTsgICAgICAvLz0+IFsnYicsICdjJ11cbiAgICAgKiAgICAgIFIuc2xpY2UoMCwgMywgJ3JhbWRhJyk7ICAgICAgICAgICAgICAgICAgICAgLy89PiAncmFtJ1xuICAgICAqL1xuICAgIHZhciBzbGljZSA9IF9jdXJyeTMoX2NoZWNrRm9yTWV0aG9kKCdzbGljZScsIGZ1bmN0aW9uIHNsaWNlKGZyb21JbmRleCwgdG9JbmRleCwgeHMpIHtcbiAgICAgICAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKHhzLCBmcm9tSW5kZXgsIHRvSW5kZXgpO1xuICAgIH0pKTtcblxuICAgIC8qKlxuICAgICAqIFNwbGl0cyBhIHN0cmluZyBpbnRvIGFuIGFycmF5IG9mIHN0cmluZ3MgYmFzZWQgb24gdGhlIGdpdmVuXG4gICAgICogc2VwYXJhdG9yLlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBTdHJpbmdcbiAgICAgKiBAc2lnIFN0cmluZyAtPiBTdHJpbmcgLT4gW1N0cmluZ11cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gc2VwIFRoZSBzZXBhcmF0b3Igc3RyaW5nLlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBzdHIgVGhlIHN0cmluZyB0byBzZXBhcmF0ZSBpbnRvIGFuIGFycmF5LlxuICAgICAqIEByZXR1cm4ge0FycmF5fSBUaGUgYXJyYXkgb2Ygc3RyaW5ncyBmcm9tIGBzdHJgIHNlcGFyYXRlZCBieSBgc3RyYC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICB2YXIgcGF0aENvbXBvbmVudHMgPSBSLnNwbGl0KCcvJyk7XG4gICAgICogICAgICBSLnRhaWwocGF0aENvbXBvbmVudHMoJy91c3IvbG9jYWwvYmluL25vZGUnKSk7IC8vPT4gWyd1c3InLCAnbG9jYWwnLCAnYmluJywgJ25vZGUnXVxuICAgICAqXG4gICAgICogICAgICBSLnNwbGl0KCcuJywgJ2EuYi5jLnh5ei5kJyk7IC8vPT4gWydhJywgJ2InLCAnYycsICd4eXonLCAnZCddXG4gICAgICovXG4gICAgdmFyIHNwbGl0ID0gaW52b2tlcigxLCAnc3BsaXQnKTtcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYSBzdHJpbmcgY29udGFpbmluZyB0aGUgY2hhcmFjdGVycyBvZiBgc3RyYCBmcm9tIGBmcm9tSW5kZXhgXG4gICAgICogKGluY2x1c2l2ZSkgdG8gYHRvSW5kZXhgIChleGNsdXNpdmUpLlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBTdHJpbmdcbiAgICAgKiBAc2lnIE51bWJlciAtPiBOdW1iZXIgLT4gU3RyaW5nIC0+IFN0cmluZ1xuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBmcm9tSW5kZXggVGhlIHN0YXJ0IGluZGV4IChpbmNsdXNpdmUpLlxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSB0b0luZGV4IFRoZSBlbmQgaW5kZXggKGV4Y2x1c2l2ZSkuXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHN0ciBUaGUgc3RyaW5nIHRvIHNsaWNlLlxuICAgICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICAgKiBAc2VlIFIuc2xpY2VcbiAgICAgKiBAZGVwcmVjYXRlZCBzaW5jZSB2MC4xNS4wXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgUi5zdWJzdHJpbmcoMiwgNSwgJ2FiY2RlZmdoaWprbG0nKTsgLy89PiAnY2RlJ1xuICAgICAqL1xuICAgIHZhciBzdWJzdHJpbmcgPSBzbGljZTtcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYSBzdHJpbmcgY29udGFpbmluZyB0aGUgY2hhcmFjdGVycyBvZiBgc3RyYCBmcm9tIGBmcm9tSW5kZXhgXG4gICAgICogKGluY2x1c2l2ZSkgdG8gdGhlIGVuZCBvZiBgc3RyYC5cbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgU3RyaW5nXG4gICAgICogQHNpZyBOdW1iZXIgLT4gU3RyaW5nIC0+IFN0cmluZ1xuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBmcm9tSW5kZXhcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gICAgICogQHJldHVybiB7U3RyaW5nfVxuICAgICAqIEBkZXByZWNhdGVkIHNpbmNlIHYwLjE1LjBcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICBSLnN1YnN0cmluZ0Zyb20oMywgJ1JhbWRhJyk7IC8vPT4gJ2RhJ1xuICAgICAqICAgICAgUi5zdWJzdHJpbmdGcm9tKC0yLCAnUmFtZGEnKTsgLy89PiAnZGEnXG4gICAgICovXG4gICAgdmFyIHN1YnN0cmluZ0Zyb20gPSBzdWJzdHJpbmcoX18sIEluZmluaXR5KTtcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYSBzdHJpbmcgY29udGFpbmluZyB0aGUgZmlyc3QgYHRvSW5kZXhgIGNoYXJhY3RlcnMgb2YgYHN0cmAuXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IFN0cmluZ1xuICAgICAqIEBzaWcgTnVtYmVyIC0+IFN0cmluZyAtPiBTdHJpbmdcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gdG9JbmRleFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAgICAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICAgICogQGRlcHJlY2F0ZWQgc2luY2UgdjAuMTUuMFxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIFIuc3Vic3RyaW5nVG8oMywgJ1JhbWRhJyk7IC8vPT4gJ1JhbSdcbiAgICAgKiAgICAgIFIuc3Vic3RyaW5nVG8oLTIsICdSYW1kYScpOyAvLz0+ICdSYW0nXG4gICAgICovXG4gICAgdmFyIHN1YnN0cmluZ1RvID0gc3Vic3RyaW5nKDApO1xuXG4gICAgLyoqXG4gICAgICogQWRkcyB0b2dldGhlciBhbGwgdGhlIGVsZW1lbnRzIG9mIGEgbGlzdC5cbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgTWF0aFxuICAgICAqIEBzaWcgW051bWJlcl0gLT4gTnVtYmVyXG4gICAgICogQHBhcmFtIHtBcnJheX0gbGlzdCBBbiBhcnJheSBvZiBudW1iZXJzXG4gICAgICogQHJldHVybiB7TnVtYmVyfSBUaGUgc3VtIG9mIGFsbCB0aGUgbnVtYmVycyBpbiB0aGUgbGlzdC5cbiAgICAgKiBAc2VlIFIucmVkdWNlXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgUi5zdW0oWzIsNCw2LDgsMTAwLDFdKTsgLy89PiAxMjFcbiAgICAgKi9cbiAgICB2YXIgc3VtID0gcmVkdWNlKF9hZGQsIDApO1xuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhbGwgYnV0IHRoZSBmaXJzdCBlbGVtZW50IG9mIGEgbGlzdC4gSWYgdGhlIGxpc3QgcHJvdmlkZWQgaGFzIHRoZSBgdGFpbGAgbWV0aG9kLFxuICAgICAqIGl0IHdpbGwgaW5zdGVhZCByZXR1cm4gYGxpc3QudGFpbCgpYC5cbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgTGlzdFxuICAgICAqIEBzaWcgW2FdIC0+IFthXVxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGxpc3QgVGhlIGFycmF5IHRvIGNvbnNpZGVyLlxuICAgICAqIEByZXR1cm4ge0FycmF5fSBBIG5ldyBhcnJheSBjb250YWluaW5nIGFsbCBidXQgdGhlIGZpcnN0IGVsZW1lbnQgb2YgdGhlIGlucHV0IGxpc3QsIG9yIGFuXG4gICAgICogICAgICAgICBlbXB0eSBsaXN0IGlmIHRoZSBpbnB1dCBsaXN0IGlzIGVtcHR5LlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIFIudGFpbChbJ2ZpJywgJ2ZvJywgJ2Z1bSddKTsgLy89PiBbJ2ZvJywgJ2Z1bSddXG4gICAgICovXG4gICAgdmFyIHRhaWwgPSBfY2hlY2tGb3JNZXRob2QoJ3RhaWwnLCBmdW5jdGlvbiAobGlzdCkge1xuICAgICAgICByZXR1cm4gX3NsaWNlKGxpc3QsIDEpO1xuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhIG5ldyBsaXN0IGNvbnRhaW5pbmcgdGhlIGZpcnN0IGBuYCBlbGVtZW50cyBvZiB0aGUgZ2l2ZW4gbGlzdC5cbiAgICAgKiBJZiBgbiA+IGxpc3QubGVuZ3RoYCwgcmV0dXJucyBhIGxpc3Qgb2YgYGxpc3QubGVuZ3RoYCBlbGVtZW50cy5cbiAgICAgKlxuICAgICAqIEFjdHMgYXMgYSB0cmFuc2R1Y2VyIGlmIGEgdHJhbnNmb3JtZXIgaXMgZ2l2ZW4gaW4gbGlzdCBwb3NpdGlvbi5cbiAgICAgKiBAc2VlIFIudHJhbnNkdWNlXG4gICAgICpcbiAgICAgKiBEaXNwYXRjaGVzIHRvIGl0cyBzZWNvbmQgYXJndW1lbnQncyBgc2xpY2VgIG1ldGhvZCBpZiBwcmVzZW50LiBBcyBhXG4gICAgICogcmVzdWx0LCBvbmUgbWF5IHJlcGxhY2UgYFthXWAgd2l0aCBgU3RyaW5nYCBpbiB0aGUgdHlwZSBzaWduYXR1cmUuXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IExpc3RcbiAgICAgKiBAc2lnIE51bWJlciAtPiBbYV0gLT4gW2FdXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IG4gVGhlIG51bWJlciBvZiBlbGVtZW50cyB0byByZXR1cm4uXG4gICAgICogQHBhcmFtIHtBcnJheX0geHMgVGhlIGNvbGxlY3Rpb24gdG8gY29uc2lkZXIuXG4gICAgICogQHJldHVybiB7QXJyYXl9XG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgUi50YWtlKDEsIFsnZm9vJywgJ2JhcicsICdiYXonXSk7IC8vPT4gWydmb28nXVxuICAgICAqICAgICAgUi50YWtlKDIsIFsnZm9vJywgJ2JhcicsICdiYXonXSk7IC8vPT4gWydmb28nLCAnYmFyJ11cbiAgICAgKiAgICAgIFIudGFrZSgzLCBbJ2ZvbycsICdiYXInLCAnYmF6J10pOyAvLz0+IFsnZm9vJywgJ2JhcicsICdiYXonXVxuICAgICAqICAgICAgUi50YWtlKDQsIFsnZm9vJywgJ2JhcicsICdiYXonXSk7IC8vPT4gWydmb28nLCAnYmFyJywgJ2JheiddXG4gICAgICogICAgICBSLnRha2UoMywgJ3JhbWRhJyk7ICAgICAgICAgICAgICAgLy89PiAncmFtJ1xuICAgICAqXG4gICAgICogICAgICB2YXIgcGVyc29ubmVsID0gW1xuICAgICAqICAgICAgICAnRGF2ZSBCcnViZWNrJyxcbiAgICAgKiAgICAgICAgJ1BhdWwgRGVzbW9uZCcsXG4gICAgICogICAgICAgICdFdWdlbmUgV3JpZ2h0JyxcbiAgICAgKiAgICAgICAgJ0pvZSBNb3JlbGxvJyxcbiAgICAgKiAgICAgICAgJ0dlcnJ5IE11bGxpZ2FuJyxcbiAgICAgKiAgICAgICAgJ0JvYiBCYXRlcycsXG4gICAgICogICAgICAgICdKb2UgRG9kZ2UnLFxuICAgICAqICAgICAgICAnUm9uIENyb3R0eSdcbiAgICAgKiAgICAgIF07XG4gICAgICpcbiAgICAgKiAgICAgIHRha2VGaXZlKHBlcnNvbm5lbCk7XG4gICAgICogICAgICAvLz0+IFsnRGF2ZSBCcnViZWNrJywgJ1BhdWwgRGVzbW9uZCcsICdFdWdlbmUgV3JpZ2h0JywgJ0pvZSBNb3JlbGxvJywgJ0dlcnJ5IE11bGxpZ2FuJ11cbiAgICAgKi9cbiAgICB2YXIgdGFrZSA9IF9jdXJyeTIoX2Rpc3BhdGNoYWJsZSgndGFrZScsIF94dGFrZSwgZnVuY3Rpb24gdGFrZShuLCB4cykge1xuICAgICAgICByZXR1cm4gc2xpY2UoMCwgbiA8IDAgPyBJbmZpbml0eSA6IG4sIHhzKTtcbiAgICB9KSk7XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGEgbmV3IGxpc3QgY29udGFpbmluZyB0aGUgZmlyc3QgYG5gIGVsZW1lbnRzIG9mIGEgZ2l2ZW4gbGlzdCwgcGFzc2luZyBlYWNoIHZhbHVlXG4gICAgICogdG8gdGhlIHN1cHBsaWVkIHByZWRpY2F0ZSBmdW5jdGlvbiwgYW5kIHRlcm1pbmF0aW5nIHdoZW4gdGhlIHByZWRpY2F0ZSBmdW5jdGlvbiByZXR1cm5zXG4gICAgICogYGZhbHNlYC4gRXhjbHVkZXMgdGhlIGVsZW1lbnQgdGhhdCBjYXVzZWQgdGhlIHByZWRpY2F0ZSBmdW5jdGlvbiB0byBmYWlsLiBUaGUgcHJlZGljYXRlXG4gICAgICogZnVuY3Rpb24gaXMgcGFzc2VkIG9uZSBhcmd1bWVudDogKih2YWx1ZSkqLlxuICAgICAqXG4gICAgICogQWN0cyBhcyBhIHRyYW5zZHVjZXIgaWYgYSB0cmFuc2Zvcm1lciBpcyBnaXZlbiBpbiBsaXN0IHBvc2l0aW9uLlxuICAgICAqIEBzZWUgUi50cmFuc2R1Y2VcbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgTGlzdFxuICAgICAqIEBzaWcgKGEgLT4gQm9vbGVhbikgLT4gW2FdIC0+IFthXVxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBmdW5jdGlvbiBjYWxsZWQgcGVyIGl0ZXJhdGlvbi5cbiAgICAgKiBAcGFyYW0ge0FycmF5fSBsaXN0IFRoZSBjb2xsZWN0aW9uIHRvIGl0ZXJhdGUgb3Zlci5cbiAgICAgKiBAcmV0dXJuIHtBcnJheX0gQSBuZXcgYXJyYXkuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgdmFyIGlzTm90Rm91ciA9IGZ1bmN0aW9uKHgpIHtcbiAgICAgKiAgICAgICAgcmV0dXJuICEoeCA9PT0gNCk7XG4gICAgICogICAgICB9O1xuICAgICAqXG4gICAgICogICAgICBSLnRha2VXaGlsZShpc05vdEZvdXIsIFsxLCAyLCAzLCA0XSk7IC8vPT4gWzEsIDIsIDNdXG4gICAgICovXG4gICAgdmFyIHRha2VXaGlsZSA9IF9jdXJyeTIoX2Rpc3BhdGNoYWJsZSgndGFrZVdoaWxlJywgX3h0YWtlV2hpbGUsIGZ1bmN0aW9uIHRha2VXaGlsZShmbiwgbGlzdCkge1xuICAgICAgICB2YXIgaWR4ID0gMCwgbGVuID0gbGlzdC5sZW5ndGg7XG4gICAgICAgIHdoaWxlIChpZHggPCBsZW4gJiYgZm4obGlzdFtpZHhdKSkge1xuICAgICAgICAgICAgaWR4ICs9IDE7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIF9zbGljZShsaXN0LCAwLCBpZHgpO1xuICAgIH0pKTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBsb3dlciBjYXNlIHZlcnNpb24gb2YgYSBzdHJpbmcuXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IFN0cmluZ1xuICAgICAqIEBzaWcgU3RyaW5nIC0+IFN0cmluZ1xuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBzdHIgVGhlIHN0cmluZyB0byBsb3dlciBjYXNlLlxuICAgICAqIEByZXR1cm4ge1N0cmluZ30gVGhlIGxvd2VyIGNhc2UgdmVyc2lvbiBvZiBgc3RyYC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICBSLnRvTG93ZXIoJ1hZWicpOyAvLz0+ICd4eXonXG4gICAgICovXG4gICAgdmFyIHRvTG93ZXIgPSBpbnZva2VyKDAsICd0b0xvd2VyQ2FzZScpO1xuXG4gICAgLyoqXG4gICAgICogVGhlIHVwcGVyIGNhc2UgdmVyc2lvbiBvZiBhIHN0cmluZy5cbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgU3RyaW5nXG4gICAgICogQHNpZyBTdHJpbmcgLT4gU3RyaW5nXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHN0ciBUaGUgc3RyaW5nIHRvIHVwcGVyIGNhc2UuXG4gICAgICogQHJldHVybiB7U3RyaW5nfSBUaGUgdXBwZXIgY2FzZSB2ZXJzaW9uIG9mIGBzdHJgLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIFIudG9VcHBlcignYWJjJyk7IC8vPT4gJ0FCQydcbiAgICAgKi9cbiAgICB2YXIgdG9VcHBlciA9IGludm9rZXIoMCwgJ3RvVXBwZXJDYXNlJyk7XG5cbiAgICAvKipcbiAgICAgKiBJbml0aWFsaXplcyBhIHRyYW5zZHVjZXIgdXNpbmcgc3VwcGxpZWQgaXRlcmF0b3IgZnVuY3Rpb24uIFJldHVybnMgYSBzaW5nbGUgaXRlbSBieVxuICAgICAqIGl0ZXJhdGluZyB0aHJvdWdoIHRoZSBsaXN0LCBzdWNjZXNzaXZlbHkgY2FsbGluZyB0aGUgdHJhbnNmb3JtZWQgaXRlcmF0b3IgZnVuY3Rpb24gYW5kXG4gICAgICogcGFzc2luZyBpdCBhbiBhY2N1bXVsYXRvciB2YWx1ZSBhbmQgdGhlIGN1cnJlbnQgdmFsdWUgZnJvbSB0aGUgYXJyYXksIGFuZCB0aGVuIHBhc3NpbmdcbiAgICAgKiB0aGUgcmVzdWx0IHRvIHRoZSBuZXh0IGNhbGwuXG4gICAgICpcbiAgICAgKiBUaGUgaXRlcmF0b3IgZnVuY3Rpb24gcmVjZWl2ZXMgdHdvIHZhbHVlczogKihhY2MsIHZhbHVlKSouIEl0IHdpbGwgYmUgd3JhcHBlZCBhcyBhXG4gICAgICogdHJhbnNmb3JtZXIgdG8gaW5pdGlhbGl6ZSB0aGUgdHJhbnNkdWNlci4gQSB0cmFuc2Zvcm1lciBjYW4gYmUgcGFzc2VkIGRpcmVjdGx5IGluIHBsYWNlXG4gICAgICogb2YgYW4gaXRlcmF0b3IgZnVuY3Rpb24uICBJbiBib3RoIGNhc2VzLCBpdGVyYXRpb24gbWF5IGJlIHN0b3BwZWQgZWFybHkgd2l0aCB0aGVcbiAgICAgKiBgUi5yZWR1Y2VkYCBmdW5jdGlvbi5cbiAgICAgKlxuICAgICAqIEEgdHJhbnNkdWNlciBpcyBhIGZ1bmN0aW9uIHRoYXQgYWNjZXB0cyBhIHRyYW5zZm9ybWVyIGFuZCByZXR1cm5zIGEgdHJhbnNmb3JtZXIgYW5kIGNhblxuICAgICAqIGJlIGNvbXBvc2VkIGRpcmVjdGx5LlxuICAgICAqXG4gICAgICogQSB0cmFuc2Zvcm1lciBpcyBhbiBhbiBvYmplY3QgdGhhdCBwcm92aWRlcyBhIDItYXJpdHkgcmVkdWNpbmcgaXRlcmF0b3IgZnVuY3Rpb24sIHN0ZXAsXG4gICAgICogMC1hcml0eSBpbml0aWFsIHZhbHVlIGZ1bmN0aW9uLCBpbml0LCBhbmQgMS1hcml0eSByZXN1bHQgZXh0cmFjdGlvbiBmdW5jdGlvbiwgcmVzdWx0LlxuICAgICAqIFRoZSBzdGVwIGZ1bmN0aW9uIGlzIHVzZWQgYXMgdGhlIGl0ZXJhdG9yIGZ1bmN0aW9uIGluIHJlZHVjZS4gVGhlIHJlc3VsdCBmdW5jdGlvbiBpcyB1c2VkXG4gICAgICogdG8gY29udmVydCB0aGUgZmluYWwgYWNjdW11bGF0b3IgaW50byB0aGUgcmV0dXJuIHR5cGUgYW5kIGluIG1vc3QgY2FzZXMgaXMgUi5pZGVudGl0eS5cbiAgICAgKiBUaGUgaW5pdCBmdW5jdGlvbiBjYW4gYmUgdXNlZCB0byBwcm92aWRlIGFuIGluaXRpYWwgYWNjdW11bGF0b3IsIGJ1dCBpcyBpZ25vcmVkIGJ5IHRyYW5zZHVjZS5cbiAgICAgKlxuICAgICAqIFRoZSBpdGVyYXRpb24gaXMgcGVyZm9ybWVkIHdpdGggUi5yZWR1Y2UgYWZ0ZXIgaW5pdGlhbGl6aW5nIHRoZSB0cmFuc2R1Y2VyLlxuICAgICAqIEBzZWUgUi5yZWR1Y2VcbiAgICAgKiBAc2VlIFIucmVkdWNlZFxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBMaXN0XG4gICAgICogQHNpZyAoYyAtPiBjKSAtPiAoYSxiIC0+IGEpIC0+IGEgLT4gW2JdIC0+IGFcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSB4ZiBUaGUgdHJhbnNkdWNlciBmdW5jdGlvbi4gUmVjZWl2ZXMgYSB0cmFuc2Zvcm1lciBhbmQgcmV0dXJucyBhIHRyYW5zZm9ybWVyLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBpdGVyYXRvciBmdW5jdGlvbi4gUmVjZWl2ZXMgdHdvIHZhbHVlcywgdGhlIGFjY3VtdWxhdG9yIGFuZCB0aGVcbiAgICAgKiAgICAgICAgY3VycmVudCBlbGVtZW50IGZyb20gdGhlIGFycmF5LiBXcmFwcGVkIGFzIHRyYW5zZm9ybWVyLCBpZiBuZWNlc3NhcnksIGFuZCB1c2VkIHRvXG4gICAgICogICAgICAgIGluaXRpYWxpemUgdGhlIHRyYW5zZHVjZXJcbiAgICAgKiBAcGFyYW0geyp9IGFjYyBUaGUgaW5pdGlhbCBhY2N1bXVsYXRvciB2YWx1ZS5cbiAgICAgKiBAcGFyYW0ge0FycmF5fSBsaXN0IFRoZSBsaXN0IHRvIGl0ZXJhdGUgb3Zlci5cbiAgICAgKiBAc2VlIFIuaW50b1xuICAgICAqIEByZXR1cm4geyp9IFRoZSBmaW5hbCwgYWNjdW11bGF0ZWQgdmFsdWUuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgdmFyIG51bWJlcnMgPSBbMSwgMiwgMywgNF07XG4gICAgICogICAgICB2YXIgdHJhbnNkdWNlciA9IFIuY29tcG9zZShSLm1hcChSLmFkZCgxKSksIFIudGFrZSgyKSk7XG4gICAgICpcbiAgICAgKiAgICAgIFIudHJhbnNkdWNlKHRyYW5zZHVjZXIsIFIuZmxpcChSLmFwcGVuZCksIFtdLCBudW1iZXJzKTsgLy89PiBbMiwgM11cbiAgICAgKi9cbiAgICB2YXIgdHJhbnNkdWNlID0gY3VycnlOKDQsIGZ1bmN0aW9uICh4ZiwgZm4sIGFjYywgbGlzdCkge1xuICAgICAgICByZXR1cm4gX3JlZHVjZSh4Zih0eXBlb2YgZm4gPT09ICdmdW5jdGlvbicgPyBfeHdyYXAoZm4pIDogZm4pLCBhY2MsIGxpc3QpO1xuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhIGZ1bmN0aW9uIG9mIGFyaXR5IGBuYCBmcm9tIGEgKG1hbnVhbGx5KSBjdXJyaWVkIGZ1bmN0aW9uLlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBGdW5jdGlvblxuICAgICAqIEBzaWcgTnVtYmVyIC0+IChhIC0+IGIpIC0+IChhIC0+IGMpXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGxlbmd0aCBUaGUgYXJpdHkgZm9yIHRoZSByZXR1cm5lZCBmdW5jdGlvbi5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgZnVuY3Rpb24gdG8gdW5jdXJyeS5cbiAgICAgKiBAcmV0dXJuIHtGdW5jdGlvbn0gQSBuZXcgZnVuY3Rpb24uXG4gICAgICogQHNlZSBSLmN1cnJ5XG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgdmFyIGFkZEZvdXIgPSBmdW5jdGlvbihhKSB7XG4gICAgICogICAgICAgIHJldHVybiBmdW5jdGlvbihiKSB7XG4gICAgICogICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGMpIHtcbiAgICAgKiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbihkKSB7XG4gICAgICogICAgICAgICAgICAgIHJldHVybiBhICsgYiArIGMgKyBkO1xuICAgICAqICAgICAgICAgICAgfTtcbiAgICAgKiAgICAgICAgICB9O1xuICAgICAqICAgICAgICB9O1xuICAgICAqICAgICAgfTtcbiAgICAgKlxuICAgICAqICAgICAgdmFyIHVuY3VycmllZEFkZEZvdXIgPSBSLnVuY3VycnlOKDQsIGFkZEZvdXIpO1xuICAgICAqICAgICAgY3VycmllZEFkZEZvdXIoMSwgMiwgMywgNCk7IC8vPT4gMTBcbiAgICAgKi9cbiAgICB2YXIgdW5jdXJyeU4gPSBfY3VycnkyKGZ1bmN0aW9uIHVuY3VycnlOKGRlcHRoLCBmbikge1xuICAgICAgICByZXR1cm4gY3VycnlOKGRlcHRoLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgY3VycmVudERlcHRoID0gMTtcbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IGZuO1xuICAgICAgICAgICAgdmFyIGlkeCA9IDA7XG4gICAgICAgICAgICB2YXIgZW5kSWR4O1xuICAgICAgICAgICAgd2hpbGUgKGN1cnJlbnREZXB0aCA8PSBkZXB0aCAmJiB0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICBlbmRJZHggPSBjdXJyZW50RGVwdGggPT09IGRlcHRoID8gYXJndW1lbnRzLmxlbmd0aCA6IGlkeCArIHZhbHVlLmxlbmd0aDtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHZhbHVlLmFwcGx5KHRoaXMsIF9zbGljZShhcmd1bWVudHMsIGlkeCwgZW5kSWR4KSk7XG4gICAgICAgICAgICAgICAgY3VycmVudERlcHRoICs9IDE7XG4gICAgICAgICAgICAgICAgaWR4ID0gZW5kSWR4O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIENvbWJpbmVzIHR3byBsaXN0cyBpbnRvIGEgc2V0IChpLmUuIG5vIGR1cGxpY2F0ZXMpIGNvbXBvc2VkIG9mIHRoZSBlbGVtZW50cyBvZiBlYWNoIGxpc3QuICBEdXBsaWNhdGlvbiBpc1xuICAgICAqIGRldGVybWluZWQgYWNjb3JkaW5nIHRvIHRoZSB2YWx1ZSByZXR1cm5lZCBieSBhcHBseWluZyB0aGUgc3VwcGxpZWQgcHJlZGljYXRlIHRvIHR3byBsaXN0IGVsZW1lbnRzLlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBSZWxhdGlvblxuICAgICAqIEBzaWcgKGEsYSAtPiBCb29sZWFuKSAtPiBbYV0gLT4gW2FdIC0+IFthXVxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IHByZWQgQSBwcmVkaWNhdGUgdXNlZCB0byB0ZXN0IHdoZXRoZXIgdHdvIGl0ZW1zIGFyZSBlcXVhbC5cbiAgICAgKiBAcGFyYW0ge0FycmF5fSBsaXN0MSBUaGUgZmlyc3QgbGlzdC5cbiAgICAgKiBAcGFyYW0ge0FycmF5fSBsaXN0MiBUaGUgc2Vjb25kIGxpc3QuXG4gICAgICogQHJldHVybiB7QXJyYXl9IFRoZSBmaXJzdCBhbmQgc2Vjb25kIGxpc3RzIGNvbmNhdGVuYXRlZCwgd2l0aFxuICAgICAqICAgICAgICAgZHVwbGljYXRlcyByZW1vdmVkLlxuICAgICAqIEBzZWUgUi51bmlvblxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIGZ1bmN0aW9uIGNtcCh4LCB5KSB7IHJldHVybiB4LmEgPT09IHkuYTsgfVxuICAgICAqICAgICAgdmFyIGwxID0gW3thOiAxfSwge2E6IDJ9XTtcbiAgICAgKiAgICAgIHZhciBsMiA9IFt7YTogMX0sIHthOiA0fV07XG4gICAgICogICAgICBSLnVuaW9uV2l0aChjbXAsIGwxLCBsMik7IC8vPT4gW3thOiAxfSwge2E6IDJ9LCB7YTogNH1dXG4gICAgICovXG4gICAgdmFyIHVuaW9uV2l0aCA9IF9jdXJyeTMoZnVuY3Rpb24gdW5pb25XaXRoKHByZWQsIGxpc3QxLCBsaXN0Mikge1xuICAgICAgICByZXR1cm4gdW5pcVdpdGgocHJlZCwgX2NvbmNhdChsaXN0MSwgbGlzdDIpKTtcbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYSBuZXcgbGlzdCBjb250YWluaW5nIG9ubHkgb25lIGNvcHkgb2YgZWFjaCBlbGVtZW50IGluIHRoZSBvcmlnaW5hbCBsaXN0LlxuICAgICAqIGBSLmVxdWFsc2AgaXMgdXNlZCB0byBkZXRlcm1pbmUgZXF1YWxpdHkuXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IExpc3RcbiAgICAgKiBAc2lnIFthXSAtPiBbYV1cbiAgICAgKiBAcGFyYW0ge0FycmF5fSBsaXN0IFRoZSBhcnJheSB0byBjb25zaWRlci5cbiAgICAgKiBAcmV0dXJuIHtBcnJheX0gVGhlIGxpc3Qgb2YgdW5pcXVlIGl0ZW1zLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIFIudW5pcShbMSwgMSwgMiwgMV0pOyAvLz0+IFsxLCAyXVxuICAgICAqICAgICAgUi51bmlxKFsxLCAnMSddKTsgICAgIC8vPT4gWzEsICcxJ11cbiAgICAgKiAgICAgIFIudW5pcShbWzQyXSwgWzQyXV0pOyAvLz0+IFtbNDJdXVxuICAgICAqL1xuICAgIHZhciB1bmlxID0gdW5pcVdpdGgoZXF1YWxzKTtcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYSBuZXcgbGlzdCBieSBwdWxsaW5nIGV2ZXJ5IGl0ZW0gYXQgdGhlIGZpcnN0IGxldmVsIG9mIG5lc3Rpbmcgb3V0LCBhbmQgcHV0dGluZ1xuICAgICAqIHRoZW0gaW4gYSBuZXcgYXJyYXkuXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IExpc3RcbiAgICAgKiBAc2lnIFthXSAtPiBbYl1cbiAgICAgKiBAcGFyYW0ge0FycmF5fSBsaXN0IFRoZSBhcnJheSB0byBjb25zaWRlci5cbiAgICAgKiBAcmV0dXJuIHtBcnJheX0gVGhlIGZsYXR0ZW5lZCBsaXN0LlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIFIudW5uZXN0KFsxLCBbMl0sIFtbM11dXSk7IC8vPT4gWzEsIDIsIFszXV1cbiAgICAgKiAgICAgIFIudW5uZXN0KFtbMSwgMl0sIFszLCA0XSwgWzUsIDZdXSk7IC8vPT4gWzEsIDIsIDMsIDQsIDUsIDZdXG4gICAgICovXG4gICAgdmFyIHVubmVzdCA9IF9jdXJyeTEoX21ha2VGbGF0KGZhbHNlKSk7XG5cbiAgICAvKipcbiAgICAgKiBUYWtlcyBhIHNwZWMgb2JqZWN0IGFuZCBhIHRlc3Qgb2JqZWN0OyByZXR1cm5zIHRydWUgaWYgdGhlIHRlc3Qgc2F0aXNmaWVzXG4gICAgICogdGhlIHNwZWMsIGZhbHNlIG90aGVyd2lzZS4gQW4gb2JqZWN0IHNhdGlzZmllcyB0aGUgc3BlYyBpZiwgZm9yIGVhY2ggb2YgdGhlXG4gICAgICogc3BlYydzIG93biBwcm9wZXJ0aWVzLCBhY2Nlc3NpbmcgdGhhdCBwcm9wZXJ0eSBvZiB0aGUgb2JqZWN0IGdpdmVzIHRoZSBzYW1lXG4gICAgICogdmFsdWUgKGluIGBSLmVxdWFsc2AgdGVybXMpIGFzIGFjY2Vzc2luZyB0aGF0IHByb3BlcnR5IG9mIHRoZSBzcGVjLlxuICAgICAqXG4gICAgICogYHdoZXJlRXFgIGlzIGEgc3BlY2lhbGl6YXRpb24gb2YgW2B3aGVyZWBdKCN3aGVyZSkuXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IE9iamVjdFxuICAgICAqIEBzaWcge1N0cmluZzogKn0gLT4ge1N0cmluZzogKn0gLT4gQm9vbGVhblxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBzcGVjXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHRlc3RPYmpcbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgICAqIEBzZWUgUi53aGVyZVxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIC8vIHByZWQgOjogT2JqZWN0IC0+IEJvb2xlYW5cbiAgICAgKiAgICAgIHZhciBwcmVkID0gUi53aGVyZUVxKHthOiAxLCBiOiAyfSk7XG4gICAgICpcbiAgICAgKiAgICAgIHByZWQoe2E6IDF9KTsgICAgICAgICAgICAgIC8vPT4gZmFsc2VcbiAgICAgKiAgICAgIHByZWQoe2E6IDEsIGI6IDJ9KTsgICAgICAgIC8vPT4gdHJ1ZVxuICAgICAqICAgICAgcHJlZCh7YTogMSwgYjogMiwgYzogM30pOyAgLy89PiB0cnVlXG4gICAgICogICAgICBwcmVkKHthOiAxLCBiOiAxfSk7ICAgICAgICAvLz0+IGZhbHNlXG4gICAgICovXG4gICAgdmFyIHdoZXJlRXEgPSBfY3VycnkyKGZ1bmN0aW9uIHdoZXJlRXEoc3BlYywgdGVzdE9iaikge1xuICAgICAgICByZXR1cm4gd2hlcmUobWFwT2JqKGVxdWFscywgc3BlYyksIHRlc3RPYmopO1xuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogV3JhcCBhIGZ1bmN0aW9uIGluc2lkZSBhbm90aGVyIHRvIGFsbG93IHlvdSB0byBtYWtlIGFkanVzdG1lbnRzIHRvIHRoZSBwYXJhbWV0ZXJzLCBvciBkb1xuICAgICAqIG90aGVyIHByb2Nlc3NpbmcgZWl0aGVyIGJlZm9yZSB0aGUgaW50ZXJuYWwgZnVuY3Rpb24gaXMgY2FsbGVkIG9yIHdpdGggaXRzIHJlc3VsdHMuXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IEZ1bmN0aW9uXG4gICAgICogQHNpZyAoYS4uLiAtPiBiKSAtPiAoKGEuLi4gLT4gYikgLT4gYS4uLiAtPiBjKSAtPiAoYS4uLiAtPiBjKVxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBmdW5jdGlvbiB0byB3cmFwLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IHdyYXBwZXIgVGhlIHdyYXBwZXIgZnVuY3Rpb24uXG4gICAgICogQHJldHVybiB7RnVuY3Rpb259IFRoZSB3cmFwcGVkIGZ1bmN0aW9uLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIHZhciBncmVldCA9IGZ1bmN0aW9uKG5hbWUpIHtyZXR1cm4gJ0hlbGxvICcgKyBuYW1lO307XG4gICAgICpcbiAgICAgKiAgICAgIHZhciBzaG91dGVkR3JlZXQgPSBSLndyYXAoZ3JlZXQsIGZ1bmN0aW9uKGdyLCBuYW1lKSB7XG4gICAgICogICAgICAgIHJldHVybiBncihuYW1lKS50b1VwcGVyQ2FzZSgpO1xuICAgICAqICAgICAgfSk7XG4gICAgICogICAgICBzaG91dGVkR3JlZXQoXCJLYXRoeVwiKTsgLy89PiBcIkhFTExPIEtBVEhZXCJcbiAgICAgKlxuICAgICAqICAgICAgdmFyIHNob3J0ZW5lZEdyZWV0ID0gUi53cmFwKGdyZWV0LCBmdW5jdGlvbihnciwgbmFtZSkge1xuICAgICAqICAgICAgICByZXR1cm4gZ3IobmFtZS5zdWJzdHJpbmcoMCwgMykpO1xuICAgICAqICAgICAgfSk7XG4gICAgICogICAgICBzaG9ydGVuZWRHcmVldChcIlJvYmVydFwiKTsgLy89PiBcIkhlbGxvIFJvYlwiXG4gICAgICovXG4gICAgdmFyIHdyYXAgPSBfY3VycnkyKGZ1bmN0aW9uIHdyYXAoZm4sIHdyYXBwZXIpIHtcbiAgICAgICAgcmV0dXJuIGN1cnJ5Tihmbi5sZW5ndGgsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB3cmFwcGVyLmFwcGx5KHRoaXMsIF9jb25jYXQoW2ZuXSwgYXJndW1lbnRzKSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdmFyIF9jaGFpbiA9IF9jdXJyeTIoZnVuY3Rpb24gX2NoYWluKGYsIGxpc3QpIHtcbiAgICAgICAgcmV0dXJuIHVubmVzdChtYXAoZiwgbGlzdCkpO1xuICAgIH0pO1xuXG4gICAgdmFyIF9mbGF0Q2F0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgcHJlc2VydmluZ1JlZHVjZWQgPSBmdW5jdGlvbiAoeGYpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgJ0BAdHJhbnNkdWNlci9pbml0JzogX3hmQmFzZS5pbml0LFxuICAgICAgICAgICAgICAgICdAQHRyYW5zZHVjZXIvcmVzdWx0JzogZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4geGZbJ0BAdHJhbnNkdWNlci9yZXN1bHQnXShyZXN1bHQpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgJ0BAdHJhbnNkdWNlci9zdGVwJzogZnVuY3Rpb24gKHJlc3VsdCwgaW5wdXQpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJldCA9IHhmWydAQHRyYW5zZHVjZXIvc3RlcCddKHJlc3VsdCwgaW5wdXQpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmV0WydAQHRyYW5zZHVjZXIvcmVkdWNlZCddID8gX2ZvcmNlUmVkdWNlZChyZXQpIDogcmV0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiBfeGNhdCh4Zikge1xuICAgICAgICAgICAgdmFyIHJ4ZiA9IHByZXNlcnZpbmdSZWR1Y2VkKHhmKTtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgJ0BAdHJhbnNkdWNlci9pbml0JzogX3hmQmFzZS5pbml0LFxuICAgICAgICAgICAgICAgICdAQHRyYW5zZHVjZXIvcmVzdWx0JzogZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcnhmWydAQHRyYW5zZHVjZXIvcmVzdWx0J10ocmVzdWx0KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICdAQHRyYW5zZHVjZXIvc3RlcCc6IGZ1bmN0aW9uIChyZXN1bHQsIGlucHV0KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAhaXNBcnJheUxpa2UoaW5wdXQpID8gX3JlZHVjZShyeGYsIHJlc3VsdCwgW2lucHV0XSkgOiBfcmVkdWNlKHJ4ZiwgcmVzdWx0LCBpbnB1dCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfTtcbiAgICB9KCk7XG5cbiAgICB2YXIgX2luZGV4T2YgPSBmdW5jdGlvbiBfaW5kZXhPZihsaXN0LCBpdGVtLCBmcm9tKSB7XG4gICAgICAgIHZhciBpZHggPSAwLCBsZW4gPSBsaXN0Lmxlbmd0aDtcbiAgICAgICAgaWYgKHR5cGVvZiBmcm9tID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgaWR4ID0gZnJvbSA8IDAgPyBNYXRoLm1heCgwLCBsZW4gKyBmcm9tKSA6IGZyb207XG4gICAgICAgIH1cbiAgICAgICAgd2hpbGUgKGlkeCA8IGxlbikge1xuICAgICAgICAgICAgaWYgKGVxdWFscyhsaXN0W2lkeF0sIGl0ZW0pKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGlkeDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlkeCArPSAxO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAtMTtcbiAgICB9O1xuXG4gICAgdmFyIF9sYXN0SW5kZXhPZiA9IGZ1bmN0aW9uIF9sYXN0SW5kZXhPZihsaXN0LCBpdGVtLCBmcm9tKSB7XG4gICAgICAgIHZhciBpZHg7XG4gICAgICAgIGlmICh0eXBlb2YgZnJvbSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIGlkeCA9IGZyb20gPCAwID8gbGlzdC5sZW5ndGggKyBmcm9tIDogTWF0aC5taW4obGlzdC5sZW5ndGggLSAxLCBmcm9tKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlkeCA9IGxpc3QubGVuZ3RoIC0gMTtcbiAgICAgICAgfVxuICAgICAgICB3aGlsZSAoaWR4ID49IDApIHtcbiAgICAgICAgICAgIGlmIChlcXVhbHMobGlzdFtpZHhdLCBpdGVtKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpZHg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZHggLT0gMTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gLTE7XG4gICAgfTtcblxuICAgIHZhciBfcGx1Y2sgPSBmdW5jdGlvbiBfcGx1Y2socCwgbGlzdCkge1xuICAgICAgICByZXR1cm4gbWFwKHByb3AocCksIGxpc3QpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGUgYSBwcmVkaWNhdGUgd3JhcHBlciB3aGljaCB3aWxsIGNhbGwgYSBwaWNrIGZ1bmN0aW9uIChhbGwvYW55KSBmb3IgZWFjaCBwcmVkaWNhdGVcbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHNlZSBSLmFsbFxuICAgICAqIEBzZWUgUi5hbnlcbiAgICAgKi9cbiAgICAvLyBDYWxsIGZ1bmN0aW9uIGltbWVkaWF0ZWx5IGlmIGdpdmVuIGFyZ3VtZW50c1xuICAgIC8vIFJldHVybiBhIGZ1bmN0aW9uIHdoaWNoIHdpbGwgY2FsbCB0aGUgcHJlZGljYXRlcyB3aXRoIHRoZSBwcm92aWRlZCBhcmd1bWVudHNcbiAgICB2YXIgX3ByZWRpY2F0ZVdyYXAgPSBmdW5jdGlvbiBfcHJlZGljYXRlV3JhcChwcmVkUGlja2VyKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAocHJlZHMpIHtcbiAgICAgICAgICAgIHZhciBwcmVkSXRlcmF0b3IgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHByZWRQaWNrZXIoZnVuY3Rpb24gKHByZWRpY2F0ZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcHJlZGljYXRlLmFwcGx5KG51bGwsIGFyZ3MpO1xuICAgICAgICAgICAgICAgIH0sIHByZWRzKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA+IDEgPyAvLyBDYWxsIGZ1bmN0aW9uIGltbWVkaWF0ZWx5IGlmIGdpdmVuIGFyZ3VtZW50c1xuICAgICAgICAgICAgcHJlZEl0ZXJhdG9yLmFwcGx5KG51bGwsIF9zbGljZShhcmd1bWVudHMsIDEpKSA6IC8vIFJldHVybiBhIGZ1bmN0aW9uIHdoaWNoIHdpbGwgY2FsbCB0aGUgcHJlZGljYXRlcyB3aXRoIHRoZSBwcm92aWRlZCBhcmd1bWVudHNcbiAgICAgICAgICAgIGFyaXR5KG1heChfcGx1Y2soJ2xlbmd0aCcsIHByZWRzKSksIHByZWRJdGVyYXRvcik7XG4gICAgICAgIH07XG4gICAgfTtcblxuICAgIHZhciBfc3RlcENhdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIF9zdGVwQ2F0QXJyYXkgPSB7XG4gICAgICAgICAgICAnQEB0cmFuc2R1Y2VyL2luaXQnOiBBcnJheSxcbiAgICAgICAgICAgICdAQHRyYW5zZHVjZXIvc3RlcCc6IGZ1bmN0aW9uICh4cywgeCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBfY29uY2F0KHhzLCBbeF0pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICdAQHRyYW5zZHVjZXIvcmVzdWx0JzogX2lkZW50aXR5XG4gICAgICAgIH07XG4gICAgICAgIHZhciBfc3RlcENhdFN0cmluZyA9IHtcbiAgICAgICAgICAgICdAQHRyYW5zZHVjZXIvaW5pdCc6IFN0cmluZyxcbiAgICAgICAgICAgICdAQHRyYW5zZHVjZXIvc3RlcCc6IF9hZGQsXG4gICAgICAgICAgICAnQEB0cmFuc2R1Y2VyL3Jlc3VsdCc6IF9pZGVudGl0eVxuICAgICAgICB9O1xuICAgICAgICB2YXIgX3N0ZXBDYXRPYmplY3QgPSB7XG4gICAgICAgICAgICAnQEB0cmFuc2R1Y2VyL2luaXQnOiBPYmplY3QsXG4gICAgICAgICAgICAnQEB0cmFuc2R1Y2VyL3N0ZXAnOiBmdW5jdGlvbiAocmVzdWx0LCBpbnB1dCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBtZXJnZShyZXN1bHQsIGlzQXJyYXlMaWtlKGlucHV0KSA/IF9jcmVhdGVNYXBFbnRyeShpbnB1dFswXSwgaW5wdXRbMV0pIDogaW5wdXQpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICdAQHRyYW5zZHVjZXIvcmVzdWx0JzogX2lkZW50aXR5XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiBfc3RlcENhdChvYmopIHtcbiAgICAgICAgICAgIGlmIChfaXNUcmFuc2Zvcm1lcihvYmopKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG9iajtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpc0FycmF5TGlrZShvYmopKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIF9zdGVwQ2F0QXJyYXk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodHlwZW9mIG9iaiA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gX3N0ZXBDYXRTdHJpbmc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodHlwZW9mIG9iaiA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gX3N0ZXBDYXRPYmplY3Q7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBjcmVhdGUgdHJhbnNmb3JtZXIgZm9yICcgKyBvYmopO1xuICAgICAgICB9O1xuICAgIH0oKTtcblxuICAgIC8vIEZ1bmN0aW9uLCBSZWdFeHAsIHVzZXItZGVmaW5lZCB0eXBlc1xuICAgIHZhciBfdG9TdHJpbmcgPSBmdW5jdGlvbiBfdG9TdHJpbmcoeCwgc2Vlbikge1xuICAgICAgICB2YXIgcmVjdXIgPSBmdW5jdGlvbiByZWN1cih5KSB7XG4gICAgICAgICAgICB2YXIgeHMgPSBzZWVuLmNvbmNhdChbeF0pO1xuICAgICAgICAgICAgcmV0dXJuIF9pbmRleE9mKHhzLCB5KSA+PSAwID8gJzxDaXJjdWxhcj4nIDogX3RvU3RyaW5nKHksIHhzKTtcbiAgICAgICAgfTtcbiAgICAgICAgc3dpdGNoIChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoeCkpIHtcbiAgICAgICAgY2FzZSAnW29iamVjdCBBcmd1bWVudHNdJzpcbiAgICAgICAgICAgIHJldHVybiAnKGZ1bmN0aW9uKCkgeyByZXR1cm4gYXJndW1lbnRzOyB9KCcgKyBfbWFwKHJlY3VyLCB4KS5qb2luKCcsICcpICsgJykpJztcbiAgICAgICAgY2FzZSAnW29iamVjdCBBcnJheV0nOlxuICAgICAgICAgICAgcmV0dXJuICdbJyArIF9tYXAocmVjdXIsIHgpLmpvaW4oJywgJykgKyAnXSc7XG4gICAgICAgIGNhc2UgJ1tvYmplY3QgQm9vbGVhbl0nOlxuICAgICAgICAgICAgcmV0dXJuIHR5cGVvZiB4ID09PSAnb2JqZWN0JyA/ICduZXcgQm9vbGVhbignICsgcmVjdXIoeC52YWx1ZU9mKCkpICsgJyknIDogeC50b1N0cmluZygpO1xuICAgICAgICBjYXNlICdbb2JqZWN0IERhdGVdJzpcbiAgICAgICAgICAgIHJldHVybiAnbmV3IERhdGUoJyArIF9xdW90ZShfdG9JU09TdHJpbmcoeCkpICsgJyknO1xuICAgICAgICBjYXNlICdbb2JqZWN0IE51bGxdJzpcbiAgICAgICAgICAgIHJldHVybiAnbnVsbCc7XG4gICAgICAgIGNhc2UgJ1tvYmplY3QgTnVtYmVyXSc6XG4gICAgICAgICAgICByZXR1cm4gdHlwZW9mIHggPT09ICdvYmplY3QnID8gJ25ldyBOdW1iZXIoJyArIHJlY3VyKHgudmFsdWVPZigpKSArICcpJyA6IDEgLyB4ID09PSAtSW5maW5pdHkgPyAnLTAnIDogeC50b1N0cmluZygxMCk7XG4gICAgICAgIGNhc2UgJ1tvYmplY3QgU3RyaW5nXSc6XG4gICAgICAgICAgICByZXR1cm4gdHlwZW9mIHggPT09ICdvYmplY3QnID8gJ25ldyBTdHJpbmcoJyArIHJlY3VyKHgudmFsdWVPZigpKSArICcpJyA6IF9xdW90ZSh4KTtcbiAgICAgICAgY2FzZSAnW29iamVjdCBVbmRlZmluZWRdJzpcbiAgICAgICAgICAgIHJldHVybiAndW5kZWZpbmVkJztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHJldHVybiB0eXBlb2YgeC5jb25zdHJ1Y3RvciA9PT0gJ2Z1bmN0aW9uJyAmJiB4LmNvbnN0cnVjdG9yLm5hbWUgIT09ICdPYmplY3QnICYmIHR5cGVvZiB4LnRvU3RyaW5nID09PSAnZnVuY3Rpb24nICYmIHgudG9TdHJpbmcoKSAhPT0gJ1tvYmplY3QgT2JqZWN0XScgPyB4LnRvU3RyaW5nKCkgOiAvLyBGdW5jdGlvbiwgUmVnRXhwLCB1c2VyLWRlZmluZWQgdHlwZXNcbiAgICAgICAgICAgICd7JyArIF9tYXAoZnVuY3Rpb24gKGspIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gX3F1b3RlKGspICsgJzogJyArIHJlY3VyKHhba10pO1xuICAgICAgICAgICAgfSwga2V5cyh4KS5zb3J0KCkpLmpvaW4oJywgJykgKyAnfSc7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgdmFyIF94Y2hhaW4gPSBfY3VycnkyKGZ1bmN0aW9uIF94Y2hhaW4oZiwgeGYpIHtcbiAgICAgICAgcmV0dXJuIG1hcChmLCBfZmxhdENhdCh4ZikpO1xuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIG5ldyBsaXN0IGl0ZXJhdGlvbiBmdW5jdGlvbiBmcm9tIGFuIGV4aXN0aW5nIG9uZSBieSBhZGRpbmcgdHdvIG5ldyBwYXJhbWV0ZXJzXG4gICAgICogdG8gaXRzIGNhbGxiYWNrIGZ1bmN0aW9uOiB0aGUgY3VycmVudCBpbmRleCwgYW5kIHRoZSBlbnRpcmUgbGlzdC5cbiAgICAgKlxuICAgICAqIFRoaXMgd291bGQgdHVybiwgZm9yIGluc3RhbmNlLCBSYW1kYSdzIHNpbXBsZSBgbWFwYCBmdW5jdGlvbiBpbnRvIG9uZSB0aGF0IG1vcmUgY2xvc2VseVxuICAgICAqIHJlc2VtYmxlcyBgQXJyYXkucHJvdG90eXBlLm1hcGAuICBOb3RlIHRoYXQgdGhpcyB3aWxsIG9ubHkgd29yayBmb3IgZnVuY3Rpb25zIGluIHdoaWNoXG4gICAgICogdGhlIGl0ZXJhdGlvbiBjYWxsYmFjayBmdW5jdGlvbiBpcyB0aGUgZmlyc3QgcGFyYW1ldGVyLCBhbmQgd2hlcmUgdGhlIGxpc3QgaXMgdGhlIGxhc3RcbiAgICAgKiBwYXJhbWV0ZXIuICAoVGhpcyBsYXR0ZXIgbWlnaHQgYmUgdW5pbXBvcnRhbnQgaWYgdGhlIGxpc3QgcGFyYW1ldGVyIGlzIG5vdCB1c2VkLilcbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgRnVuY3Rpb25cbiAgICAgKiBAY2F0ZWdvcnkgTGlzdFxuICAgICAqIEBzaWcgKChhIC4uLiAtPiBiKSAuLi4gLT4gW2FdIC0+ICopIC0+IChhIC4uLiwgSW50LCBbYV0gLT4gYikgLi4uIC0+IFthXSAtPiAqKVxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIEEgbGlzdCBpdGVyYXRpb24gZnVuY3Rpb24gdGhhdCBkb2VzIG5vdCBwYXNzIGluZGV4L2xpc3QgdG8gaXRzIGNhbGxiYWNrXG4gICAgICogQHJldHVybiBBbiBhbHRlcmVkIGxpc3QgaXRlcmF0aW9uIGZ1bmN0aW9uIHRoYXRzIHBhc3NlcyBpbmRleC9saXN0IHRvIGl0cyBjYWxsYmFja1xuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIHZhciBtYXBJbmRleGVkID0gUi5hZGRJbmRleChSLm1hcCk7XG4gICAgICogICAgICBtYXBJbmRleGVkKGZ1bmN0aW9uKHZhbCwgaWR4KSB7cmV0dXJuIGlkeCArICctJyArIHZhbDt9LCBbJ2YnLCAnbycsICdvJywgJ2InLCAnYScsICdyJ10pO1xuICAgICAqICAgICAgLy89PiBbJzAtZicsICcxLW8nLCAnMi1vJywgJzMtYicsICc0LWEnLCAnNS1yJ11cbiAgICAgKi9cbiAgICB2YXIgYWRkSW5kZXggPSBfY3VycnkxKGZ1bmN0aW9uIChmbikge1xuICAgICAgICByZXR1cm4gY3VycnlOKGZuLmxlbmd0aCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGlkeCA9IDA7XG4gICAgICAgICAgICB2YXIgb3JpZ0ZuID0gYXJndW1lbnRzWzBdO1xuICAgICAgICAgICAgdmFyIGxpc3QgPSBhcmd1bWVudHNbYXJndW1lbnRzLmxlbmd0aCAtIDFdO1xuICAgICAgICAgICAgdmFyIGluZGV4ZWRGbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gb3JpZ0ZuLmFwcGx5KHRoaXMsIF9jb25jYXQoYXJndW1lbnRzLCBbXG4gICAgICAgICAgICAgICAgICAgIGlkeCxcbiAgICAgICAgICAgICAgICAgICAgbGlzdFxuICAgICAgICAgICAgICAgIF0pKTtcbiAgICAgICAgICAgICAgICBpZHggKz0gMTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHJldHVybiBmbi5hcHBseSh0aGlzLCBfcHJlcGVuZChpbmRleGVkRm4sIF9zbGljZShhcmd1bWVudHMsIDEpKSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogYXAgYXBwbGllcyBhIGxpc3Qgb2YgZnVuY3Rpb25zIHRvIGEgbGlzdCBvZiB2YWx1ZXMuXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IEZ1bmN0aW9uXG4gICAgICogQHNpZyBbZl0gLT4gW2FdIC0+IFtmIGFdXG4gICAgICogQHBhcmFtIHtBcnJheX0gZm5zIEFuIGFycmF5IG9mIGZ1bmN0aW9uc1xuICAgICAqIEBwYXJhbSB7QXJyYXl9IHZzIEFuIGFycmF5IG9mIHZhbHVlc1xuICAgICAqIEByZXR1cm4ge0FycmF5fSBBbiBhcnJheSBvZiByZXN1bHRzIG9mIGFwcGx5aW5nIGVhY2ggb2YgYGZuc2AgdG8gYWxsIG9mIGB2c2AgaW4gdHVybi5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICBSLmFwKFtSLm11bHRpcGx5KDIpLCBSLmFkZCgzKV0sIFsxLDIsM10pOyAvLz0+IFsyLCA0LCA2LCA0LCA1LCA2XVxuICAgICAqL1xuICAgIHZhciBhcCA9IF9jdXJyeTIoZnVuY3Rpb24gYXAoZm5zLCB2cykge1xuICAgICAgICByZXR1cm4gX2hhc01ldGhvZCgnYXAnLCBmbnMpID8gZm5zLmFwKHZzKSA6IF9yZWR1Y2UoZnVuY3Rpb24gKGFjYywgZm4pIHtcbiAgICAgICAgICAgIHJldHVybiBfY29uY2F0KGFjYywgbWFwKGZuLCB2cykpO1xuICAgICAgICB9LCBbXSwgZm5zKTtcbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIGBjaGFpbmAgbWFwcyBhIGZ1bmN0aW9uIG92ZXIgYSBsaXN0IGFuZCBjb25jYXRlbmF0ZXMgdGhlIHJlc3VsdHMuXG4gICAgICogVGhpcyBpbXBsZW1lbnRhdGlvbiBpcyBjb21wYXRpYmxlIHdpdGggdGhlXG4gICAgICogRmFudGFzeS1sYW5kIENoYWluIHNwZWMsIGFuZCB3aWxsIHdvcmsgd2l0aCB0eXBlcyB0aGF0IGltcGxlbWVudCB0aGF0IHNwZWMuXG4gICAgICogYGNoYWluYCBpcyBhbHNvIGtub3duIGFzIGBmbGF0TWFwYCBpbiBzb21lIGxpYnJhcmllc1xuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBMaXN0XG4gICAgICogQHNpZyAoYSAtPiBbYl0pIC0+IFthXSAtPiBbYl1cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGxpc3RcbiAgICAgKiBAcmV0dXJuIHtBcnJheX1cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICB2YXIgZHVwbGljYXRlID0gZnVuY3Rpb24obikge1xuICAgICAqICAgICAgICByZXR1cm4gW24sIG5dO1xuICAgICAqICAgICAgfTtcbiAgICAgKiAgICAgIFIuY2hhaW4oZHVwbGljYXRlLCBbMSwgMiwgM10pOyAvLz0+IFsxLCAxLCAyLCAyLCAzLCAzXVxuICAgICAqL1xuICAgIHZhciBjaGFpbiA9IF9jdXJyeTIoX2Rpc3BhdGNoYWJsZSgnY2hhaW4nLCBfeGNoYWluLCBfY2hhaW4pKTtcblxuICAgIC8qKlxuICAgICAqIFR1cm5zIGEgbGlzdCBvZiBGdW5jdG9ycyBpbnRvIGEgRnVuY3RvciBvZiBhIGxpc3QsIGFwcGx5aW5nXG4gICAgICogYSBtYXBwaW5nIGZ1bmN0aW9uIHRvIHRoZSBlbGVtZW50cyBvZiB0aGUgbGlzdCBhbG9uZyB0aGUgd2F5LlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBMaXN0XG4gICAgICogQHNlZSBSLmNvbW11dGVcbiAgICAgKiBAc2lnIEZ1bmN0b3IgZiA9PiAoZiBhIC0+IGYgYikgLT4gKHggLT4gZiB4KSAtPiBbZiBhXSAtPiBmIFtiXVxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSB0cmFuc2Zvcm1hdGlvbiBmdW5jdGlvblxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IG9mIEEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIHRoZSBkYXRhIHR5cGUgdG8gcmV0dXJuXG4gICAgICogQHBhcmFtIHtBcnJheX0gbGlzdCBBbiBhcnJheSBvZiBmdW5jdG9ycyBvZiB0aGUgc2FtZSB0eXBlXG4gICAgICogQHJldHVybiB7Kn1cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICBSLmNvbW11dGVNYXAoUi5tYXAoUi5hZGQoMTApKSwgUi5vZiwgW1sxXSwgWzIsIDNdXSk7ICAgLy89PiBbWzExLCAxMl0sIFsxMSwgMTNdXVxuICAgICAqICAgICAgUi5jb21tdXRlTWFwKFIubWFwKFIuYWRkKDEwKSksIFIub2YsIFtbMSwgMl0sIFszXV0pOyAgIC8vPT4gW1sxMSwgMTNdLCBbMTIsIDEzXV1cbiAgICAgKiAgICAgIFIuY29tbXV0ZU1hcChSLm1hcChSLmFkZCgxMCkpLCBSLm9mLCBbWzFdLCBbMl0sIFszXV0pOyAvLz0+IFtbMTEsIDEyLCAxM11dXG4gICAgICogICAgICBSLmNvbW11dGVNYXAoUi5tYXAoUi5hZGQoMTApKSwgTWF5YmUub2YsIFtKdXN0KDEpLCBKdXN0KDIpLCBKdXN0KDMpXSk7ICAgLy89PiBKdXN0KFsxMSwgMTIsIDEzXSlcbiAgICAgKiAgICAgIFIuY29tbXV0ZU1hcChSLm1hcChSLmFkZCgxMCkpLCBNYXliZS5vZiwgW0p1c3QoMSksIEp1c3QoMiksIE5vdGhpbmcoKV0pOyAvLz0+IE5vdGhpbmcoKVxuICAgICAqL1xuICAgIHZhciBjb21tdXRlTWFwID0gX2N1cnJ5MyhmdW5jdGlvbiBjb21tdXRlTWFwKGZuLCBvZiwgbGlzdCkge1xuICAgICAgICBmdW5jdGlvbiBjb25zRihhY2MsIGZ0b3IpIHtcbiAgICAgICAgICAgIHJldHVybiBhcChtYXAoYXBwZW5kLCBmbihmdG9yKSksIGFjYyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIF9yZWR1Y2UoY29uc0YsIG9mKFtdKSwgbGlzdCk7XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGEgY3VycmllZCBlcXVpdmFsZW50IG9mIHRoZSBwcm92aWRlZCBmdW5jdGlvbi4gVGhlIGN1cnJpZWRcbiAgICAgKiBmdW5jdGlvbiBoYXMgdHdvIHVudXN1YWwgY2FwYWJpbGl0aWVzLiBGaXJzdCwgaXRzIGFyZ3VtZW50cyBuZWVkbid0XG4gICAgICogYmUgcHJvdmlkZWQgb25lIGF0IGEgdGltZS4gSWYgYGZgIGlzIGEgdGVybmFyeSBmdW5jdGlvbiBhbmQgYGdgIGlzXG4gICAgICogYFIuY3VycnkoZilgLCB0aGUgZm9sbG93aW5nIGFyZSBlcXVpdmFsZW50OlxuICAgICAqXG4gICAgICogICAtIGBnKDEpKDIpKDMpYFxuICAgICAqICAgLSBgZygxKSgyLCAzKWBcbiAgICAgKiAgIC0gYGcoMSwgMikoMylgXG4gICAgICogICAtIGBnKDEsIDIsIDMpYFxuICAgICAqXG4gICAgICogU2Vjb25kbHksIHRoZSBzcGVjaWFsIHBsYWNlaG9sZGVyIHZhbHVlIGBSLl9fYCBtYXkgYmUgdXNlZCB0byBzcGVjaWZ5XG4gICAgICogXCJnYXBzXCIsIGFsbG93aW5nIHBhcnRpYWwgYXBwbGljYXRpb24gb2YgYW55IGNvbWJpbmF0aW9uIG9mIGFyZ3VtZW50cyxcbiAgICAgKiByZWdhcmRsZXNzIG9mIHRoZWlyIHBvc2l0aW9ucy4gSWYgYGdgIGlzIGFzIGFib3ZlIGFuZCBgX2AgaXMgYFIuX19gLFxuICAgICAqIHRoZSBmb2xsb3dpbmcgYXJlIGVxdWl2YWxlbnQ6XG4gICAgICpcbiAgICAgKiAgIC0gYGcoMSwgMiwgMylgXG4gICAgICogICAtIGBnKF8sIDIsIDMpKDEpYFxuICAgICAqICAgLSBgZyhfLCBfLCAzKSgxKSgyKWBcbiAgICAgKiAgIC0gYGcoXywgXywgMykoMSwgMilgXG4gICAgICogICAtIGBnKF8sIDIpKDEpKDMpYFxuICAgICAqICAgLSBgZyhfLCAyKSgxLCAzKWBcbiAgICAgKiAgIC0gYGcoXywgMikoXywgMykoMSlgXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IEZ1bmN0aW9uXG4gICAgICogQHNpZyAoKiAtPiBhKSAtPiAoKiAtPiBhKVxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBmdW5jdGlvbiB0byBjdXJyeS5cbiAgICAgKiBAcmV0dXJuIHtGdW5jdGlvbn0gQSBuZXcsIGN1cnJpZWQgZnVuY3Rpb24uXG4gICAgICogQHNlZSBSLmN1cnJ5TlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIHZhciBhZGRGb3VyTnVtYmVycyA9IGZ1bmN0aW9uKGEsIGIsIGMsIGQpIHtcbiAgICAgKiAgICAgICAgcmV0dXJuIGEgKyBiICsgYyArIGQ7XG4gICAgICogICAgICB9O1xuICAgICAqXG4gICAgICogICAgICB2YXIgY3VycmllZEFkZEZvdXJOdW1iZXJzID0gUi5jdXJyeShhZGRGb3VyTnVtYmVycyk7XG4gICAgICogICAgICB2YXIgZiA9IGN1cnJpZWRBZGRGb3VyTnVtYmVycygxLCAyKTtcbiAgICAgKiAgICAgIHZhciBnID0gZigzKTtcbiAgICAgKiAgICAgIGcoNCk7IC8vPT4gMTBcbiAgICAgKi9cbiAgICB2YXIgY3VycnkgPSBfY3VycnkxKGZ1bmN0aW9uIGN1cnJ5KGZuKSB7XG4gICAgICAgIHJldHVybiBjdXJyeU4oZm4ubGVuZ3RoLCBmbik7XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGEgbGlzdCBjb250YWluaW5nIGFsbCBidXQgdGhlIGZpcnN0IGBuYCBlbGVtZW50cyBvZiB0aGUgZ2l2ZW4gYGxpc3RgLlxuICAgICAqXG4gICAgICogQWN0cyBhcyBhIHRyYW5zZHVjZXIgaWYgYSB0cmFuc2Zvcm1lciBpcyBnaXZlbiBpbiBsaXN0IHBvc2l0aW9uLlxuICAgICAqIEBzZWUgUi50cmFuc2R1Y2VcbiAgICAgKlxuICAgICAqIERpc3BhdGNoZXMgdG8gaXRzIHNlY29uZCBhcmd1bWVudCdzIGBzbGljZWAgbWV0aG9kIGlmIHByZXNlbnQuIEFzIGFcbiAgICAgKiByZXN1bHQsIG9uZSBtYXkgcmVwbGFjZSBgW2FdYCB3aXRoIGBTdHJpbmdgIGluIHRoZSB0eXBlIHNpZ25hdHVyZS5cbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgTGlzdFxuICAgICAqIEBzaWcgTnVtYmVyIC0+IFthXSAtPiBbYV1cbiAgICAgKiBAcGFyYW0ge051bWJlcn0gbiBUaGUgbnVtYmVyIG9mIGVsZW1lbnRzIG9mIGB4c2AgdG8gc2tpcC5cbiAgICAgKiBAcGFyYW0ge0FycmF5fSB4cyBUaGUgY29sbGVjdGlvbiB0byBjb25zaWRlci5cbiAgICAgKiBAcmV0dXJuIHtBcnJheX1cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICBSLmRyb3AoMSwgWydmb28nLCAnYmFyJywgJ2JheiddKTsgLy89PiBbJ2JhcicsICdiYXonXVxuICAgICAqICAgICAgUi5kcm9wKDIsIFsnZm9vJywgJ2JhcicsICdiYXonXSk7IC8vPT4gWydiYXonXVxuICAgICAqICAgICAgUi5kcm9wKDMsIFsnZm9vJywgJ2JhcicsICdiYXonXSk7IC8vPT4gW11cbiAgICAgKiAgICAgIFIuZHJvcCg0LCBbJ2ZvbycsICdiYXInLCAnYmF6J10pOyAvLz0+IFtdXG4gICAgICogICAgICBSLmRyb3AoMywgJ3JhbWRhJyk7ICAgICAgICAgICAgICAgLy89PiAnZGEnXG4gICAgICovXG4gICAgdmFyIGRyb3AgPSBfY3VycnkyKF9kaXNwYXRjaGFibGUoJ2Ryb3AnLCBfeGRyb3AsIGZ1bmN0aW9uIGRyb3AobiwgeHMpIHtcbiAgICAgICAgcmV0dXJuIHNsaWNlKE1hdGgubWF4KDAsIG4pLCBJbmZpbml0eSwgeHMpO1xuICAgIH0pKTtcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYSBuZXcgbGlzdCB3aXRob3V0IGFueSBjb25zZWN1dGl2ZWx5IHJlcGVhdGluZyBlbGVtZW50cy4gRXF1YWxpdHkgaXNcbiAgICAgKiBkZXRlcm1pbmVkIGJ5IGFwcGx5aW5nIHRoZSBzdXBwbGllZCBwcmVkaWNhdGUgdHdvIGNvbnNlY3V0aXZlIGVsZW1lbnRzLlxuICAgICAqIFRoZSBmaXJzdCBlbGVtZW50IGluIGEgc2VyaWVzIG9mIGVxdWFsIGVsZW1lbnQgaXMgdGhlIG9uZSBiZWluZyBwcmVzZXJ2ZWQuXG4gICAgICpcbiAgICAgKiBBY3RzIGFzIGEgdHJhbnNkdWNlciBpZiBhIHRyYW5zZm9ybWVyIGlzIGdpdmVuIGluIGxpc3QgcG9zaXRpb24uXG4gICAgICogQHNlZSBSLnRyYW5zZHVjZVxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBMaXN0XG4gICAgICogQHNpZyAoYSwgYSAtPiBCb29sZWFuKSAtPiBbYV0gLT4gW2FdXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gcHJlZCBBIHByZWRpY2F0ZSB1c2VkIHRvIHRlc3Qgd2hldGhlciB0d28gaXRlbXMgYXJlIGVxdWFsLlxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGxpc3QgVGhlIGFycmF5IHRvIGNvbnNpZGVyLlxuICAgICAqIEByZXR1cm4ge0FycmF5fSBgbGlzdGAgd2l0aG91dCByZXBlYXRpbmcgZWxlbWVudHMuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgZnVuY3Rpb24gbGVuZ3RoRXEoeCwgeSkgeyByZXR1cm4gTWF0aC5hYnMoeCkgPT09IE1hdGguYWJzKHkpOyB9O1xuICAgICAqICAgICAgdmFyIGwgPSBbMSwgLTEsIDEsIDMsIDQsIC00LCAtNCwgLTUsIDUsIDMsIDNdO1xuICAgICAqICAgICAgUi5kcm9wUmVwZWF0c1dpdGgobGVuZ3RoRXEsIGwpOyAvLz0+IFsxLCAzLCA0LCAtNSwgM11cbiAgICAgKi9cbiAgICB2YXIgZHJvcFJlcGVhdHNXaXRoID0gX2N1cnJ5MihfZGlzcGF0Y2hhYmxlKCdkcm9wUmVwZWF0c1dpdGgnLCBfeGRyb3BSZXBlYXRzV2l0aCwgZnVuY3Rpb24gZHJvcFJlcGVhdHNXaXRoKHByZWQsIGxpc3QpIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgICAgICB2YXIgaWR4ID0gMTtcbiAgICAgICAgdmFyIGxlbiA9IGxpc3QubGVuZ3RoO1xuICAgICAgICBpZiAobGVuICE9PSAwKSB7XG4gICAgICAgICAgICByZXN1bHRbMF0gPSBsaXN0WzBdO1xuICAgICAgICAgICAgd2hpbGUgKGlkeCA8IGxlbikge1xuICAgICAgICAgICAgICAgIGlmICghcHJlZChsYXN0KHJlc3VsdCksIGxpc3RbaWR4XSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0W3Jlc3VsdC5sZW5ndGhdID0gbGlzdFtpZHhdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZHggKz0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0pKTtcblxuICAgIC8qKlxuICAgICAqIFBlcmZvcm1zIGEgZGVlcCB0ZXN0IG9uIHdoZXRoZXIgdHdvIGl0ZW1zIGFyZSBlcXVhbC5cbiAgICAgKiBFcXVhbGl0eSBpbXBsaWVzIHRoZSB0d28gaXRlbXMgYXJlIHNlbW1hdGljYWxseSBlcXVpdmFsZW50LlxuICAgICAqIEN5Y2xpYyBzdHJ1Y3R1cmVzIGFyZSBoYW5kbGVkIGFzIGV4cGVjdGVkXG4gICAgICogQHNlZSBSLmVxdWFsc1xuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBSZWxhdGlvblxuICAgICAqIEBzaWcgYSAtPiBiIC0+IEJvb2xlYW5cbiAgICAgKiBAcGFyYW0geyp9IGFcbiAgICAgKiBAcGFyYW0geyp9IGJcbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgICAqIEBkZXByZWNhdGVkIHNpbmNlIHYwLjE1LjBcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICB2YXIgbyA9IHt9O1xuICAgICAqICAgICAgUi5lcURlZXAobywgbyk7IC8vPT4gdHJ1ZVxuICAgICAqICAgICAgUi5lcURlZXAobywge30pOyAvLz0+IHRydWVcbiAgICAgKiAgICAgIFIuZXFEZWVwKDEsIDEpOyAvLz0+IHRydWVcbiAgICAgKiAgICAgIFIuZXFEZWVwKDEsICcxJyk7IC8vPT4gZmFsc2VcbiAgICAgKlxuICAgICAqICAgICAgdmFyIGEgPSB7fTsgYS52ID0gYTtcbiAgICAgKiAgICAgIHZhciBiID0ge307IGIudiA9IGI7XG4gICAgICogICAgICBSLmVxRGVlcChhLCBiKTsgLy89PiB0cnVlXG4gICAgICovXG4gICAgdmFyIGVxRGVlcCA9IGVxdWFscztcblxuICAgIC8qKlxuICAgICAqIFJlcG9ydHMgd2hldGhlciB0d28gb2JqZWN0cyBoYXZlIHRoZSBzYW1lIHZhbHVlLCBpbiBgUi5lcXVhbHNgIHRlcm1zLFxuICAgICAqIGZvciB0aGUgc3BlY2lmaWVkIHByb3BlcnR5LiBVc2VmdWwgYXMgYSBjdXJyaWVkIHByZWRpY2F0ZS5cbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgT2JqZWN0XG4gICAgICogQHNpZyBrIC0+IHtrOiB2fSAtPiB7azogdn0gLT4gQm9vbGVhblxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBwcm9wIFRoZSBuYW1lIG9mIHRoZSBwcm9wZXJ0eSB0byBjb21wYXJlXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9iajFcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb2JqMlxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICB2YXIgbzEgPSB7IGE6IDEsIGI6IDIsIGM6IDMsIGQ6IDQgfTtcbiAgICAgKiAgICAgIHZhciBvMiA9IHsgYTogMTAsIGI6IDIwLCBjOiAzLCBkOiA0MCB9O1xuICAgICAqICAgICAgUi5lcVByb3BzKCdhJywgbzEsIG8yKTsgLy89PiBmYWxzZVxuICAgICAqICAgICAgUi5lcVByb3BzKCdjJywgbzEsIG8yKTsgLy89PiB0cnVlXG4gICAgICovXG4gICAgdmFyIGVxUHJvcHMgPSBfY3VycnkzKGZ1bmN0aW9uIGVxUHJvcHMocHJvcCwgb2JqMSwgb2JqMikge1xuICAgICAgICByZXR1cm4gZXF1YWxzKG9iajFbcHJvcF0sIG9iajJbcHJvcF0pO1xuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhIG5ldyBmdW5jdGlvbiBtdWNoIGxpa2UgdGhlIHN1cHBsaWVkIG9uZSwgZXhjZXB0IHRoYXQgdGhlIGZpcnN0IHR3byBhcmd1bWVudHMnXG4gICAgICogb3JkZXIgaXMgcmV2ZXJzZWQuXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IEZ1bmN0aW9uXG4gICAgICogQHNpZyAoYSAtPiBiIC0+IGMgLT4gLi4uIC0+IHopIC0+IChiIC0+IGEgLT4gYyAtPiAuLi4gLT4geilcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgZnVuY3Rpb24gdG8gaW52b2tlIHdpdGggaXRzIGZpcnN0IHR3byBwYXJhbWV0ZXJzIHJldmVyc2VkLlxuICAgICAqIEByZXR1cm4geyp9IFRoZSByZXN1bHQgb2YgaW52b2tpbmcgYGZuYCB3aXRoIGl0cyBmaXJzdCB0d28gcGFyYW1ldGVycycgb3JkZXIgcmV2ZXJzZWQuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgdmFyIG1lcmdlVGhyZWUgPSBmdW5jdGlvbihhLCBiLCBjKSB7XG4gICAgICogICAgICAgIHJldHVybiAoW10pLmNvbmNhdChhLCBiLCBjKTtcbiAgICAgKiAgICAgIH07XG4gICAgICpcbiAgICAgKiAgICAgIG1lcmdlVGhyZWUoMSwgMiwgMyk7IC8vPT4gWzEsIDIsIDNdXG4gICAgICpcbiAgICAgKiAgICAgIFIuZmxpcChtZXJnZVRocmVlKSgxLCAyLCAzKTsgLy89PiBbMiwgMSwgM11cbiAgICAgKi9cbiAgICB2YXIgZmxpcCA9IF9jdXJyeTEoZnVuY3Rpb24gZmxpcChmbikge1xuICAgICAgICByZXR1cm4gY3VycnkoZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgICAgIHZhciBhcmdzID0gX3NsaWNlKGFyZ3VtZW50cyk7XG4gICAgICAgICAgICBhcmdzWzBdID0gYjtcbiAgICAgICAgICAgIGFyZ3NbMV0gPSBhO1xuICAgICAgICAgICAgcmV0dXJuIGZuLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIHBvc2l0aW9uIG9mIHRoZSBmaXJzdCBvY2N1cnJlbmNlIG9mIGFuIGl0ZW0gaW4gYW4gYXJyYXksXG4gICAgICogb3IgLTEgaWYgdGhlIGl0ZW0gaXMgbm90IGluY2x1ZGVkIGluIHRoZSBhcnJheS4gYFIuZXF1YWxzYCBpcyB1c2VkIHRvXG4gICAgICogZGV0ZXJtaW5lIGVxdWFsaXR5LlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBMaXN0XG4gICAgICogQHNpZyBhIC0+IFthXSAtPiBOdW1iZXJcbiAgICAgKiBAcGFyYW0geyp9IHRhcmdldCBUaGUgaXRlbSB0byBmaW5kLlxuICAgICAqIEBwYXJhbSB7QXJyYXl9IHhzIFRoZSBhcnJheSB0byBzZWFyY2ggaW4uXG4gICAgICogQHJldHVybiB7TnVtYmVyfSB0aGUgaW5kZXggb2YgdGhlIHRhcmdldCwgb3IgLTEgaWYgdGhlIHRhcmdldCBpcyBub3QgZm91bmQuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICBSLmluZGV4T2YoMywgWzEsMiwzLDRdKTsgLy89PiAyXG4gICAgICogICAgICBSLmluZGV4T2YoMTAsIFsxLDIsMyw0XSk7IC8vPT4gLTFcbiAgICAgKi9cbiAgICB2YXIgaW5kZXhPZiA9IF9jdXJyeTIoZnVuY3Rpb24gaW5kZXhPZih0YXJnZXQsIHhzKSB7XG4gICAgICAgIHJldHVybiBfaGFzTWV0aG9kKCdpbmRleE9mJywgeHMpID8geHMuaW5kZXhPZih0YXJnZXQpIDogX2luZGV4T2YoeHMsIHRhcmdldCk7XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGFsbCBidXQgdGhlIGxhc3QgZWxlbWVudCBvZiBhIGxpc3QuXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IExpc3RcbiAgICAgKiBAc2lnIFthXSAtPiBbYV1cbiAgICAgKiBAcGFyYW0ge0FycmF5fSBsaXN0IFRoZSBhcnJheSB0byBjb25zaWRlci5cbiAgICAgKiBAcmV0dXJuIHtBcnJheX0gQSBuZXcgYXJyYXkgY29udGFpbmluZyBhbGwgYnV0IHRoZSBsYXN0IGVsZW1lbnQgb2YgdGhlIGlucHV0IGxpc3QsIG9yIGFuXG4gICAgICogICAgICAgICBlbXB0eSBsaXN0IGlmIHRoZSBpbnB1dCBsaXN0IGlzIGVtcHR5LlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIFIuaW5pdChbJ2ZpJywgJ2ZvJywgJ2Z1bSddKTsgLy89PiBbJ2ZpJywgJ2ZvJ11cbiAgICAgKi9cbiAgICB2YXIgaW5pdCA9IHNsaWNlKDAsIC0xKTtcblxuICAgIC8qKlxuICAgICAqIFRyYW5zZm9ybXMgdGhlIGl0ZW1zIG9mIHRoZSBsaXN0IHdpdGggdGhlIHRyYW5zZHVjZXIgYW5kIGFwcGVuZHMgdGhlIHRyYW5zZm9ybWVkIGl0ZW1zIHRvXG4gICAgICogdGhlIGFjY3VtdWxhdG9yIHVzaW5nIGFuIGFwcHJvcHJpYXRlIGl0ZXJhdG9yIGZ1bmN0aW9uIGJhc2VkIG9uIHRoZSBhY2N1bXVsYXRvciB0eXBlLlxuICAgICAqXG4gICAgICogVGhlIGFjY3VtdWxhdG9yIGNhbiBiZSBhbiBhcnJheSwgc3RyaW5nLCBvYmplY3Qgb3IgYSB0cmFuc2Zvcm1lci4gSXRlcmF0ZWQgaXRlbXMgd2lsbFxuICAgICAqIGJlIGFwcGVuZGVkIHRvIGFycmF5cyBhbmQgY29uY2F0ZW5hdGVkIHRvIHN0cmluZ3MuIE9iamVjdHMgd2lsbCBiZSBtZXJnZWQgZGlyZWN0bHkgb3IgMi1pdGVtXG4gICAgICogYXJyYXlzIHdpbGwgYmUgbWVyZ2VkIGFzIGtleSwgdmFsdWUgcGFpcnMuXG4gICAgICpcbiAgICAgKiBUaGUgYWNjdW11bGF0b3IgY2FuIGFsc28gYmUgYSB0cmFuc2Zvcm1lciBvYmplY3QgdGhhdCBwcm92aWRlcyBhIDItYXJpdHkgcmVkdWNpbmcgaXRlcmF0b3JcbiAgICAgKiBmdW5jdGlvbiwgc3RlcCwgMC1hcml0eSBpbml0aWFsIHZhbHVlIGZ1bmN0aW9uLCBpbml0LCBhbmQgMS1hcml0eSByZXN1bHQgZXh0cmFjdGlvbiBmdW5jdGlvblxuICAgICAqIHJlc3VsdC4gVGhlIHN0ZXAgZnVuY3Rpb24gaXMgdXNlZCBhcyB0aGUgaXRlcmF0b3IgZnVuY3Rpb24gaW4gcmVkdWNlLiBUaGUgcmVzdWx0IGZ1bmN0aW9uIGlzXG4gICAgICogdXNlZCB0byBjb252ZXJ0IHRoZSBmaW5hbCBhY2N1bXVsYXRvciBpbnRvIHRoZSByZXR1cm4gdHlwZSBhbmQgaW4gbW9zdCBjYXNlcyBpcyBSLmlkZW50aXR5LlxuICAgICAqIFRoZSBpbml0IGZ1bmN0aW9uIGlzIHVzZWQgdG8gcHJvdmlkZSB0aGUgaW5pdGlhbCBhY2N1bXVsYXRvci5cbiAgICAgKlxuICAgICAqIFRoZSBpdGVyYXRpb24gaXMgcGVyZm9ybWVkIHdpdGggUi5yZWR1Y2UgYWZ0ZXIgaW5pdGlhbGl6aW5nIHRoZSB0cmFuc2R1Y2VyLlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBMaXN0XG4gICAgICogQHNpZyBhIC0+IChiIC0+IGIpIC0+IFtjXSAtPiBhXG4gICAgICogQHBhcmFtIHsqfSBhY2MgVGhlIGluaXRpYWwgYWNjdW11bGF0b3IgdmFsdWUuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0geGYgVGhlIHRyYW5zZHVjZXIgZnVuY3Rpb24uIFJlY2VpdmVzIGEgdHJhbnNmb3JtZXIgYW5kIHJldHVybnMgYSB0cmFuc2Zvcm1lci5cbiAgICAgKiBAcGFyYW0ge0FycmF5fSBsaXN0IFRoZSBsaXN0IHRvIGl0ZXJhdGUgb3Zlci5cbiAgICAgKiBAcmV0dXJuIHsqfSBUaGUgZmluYWwsIGFjY3VtdWxhdGVkIHZhbHVlLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIHZhciBudW1iZXJzID0gWzEsIDIsIDMsIDRdO1xuICAgICAqICAgICAgdmFyIHRyYW5zZHVjZXIgPSBSLmNvbXBvc2UoUi5tYXAoUi5hZGQoMSkpLCBSLnRha2UoMikpO1xuICAgICAqXG4gICAgICogICAgICBSLmludG8oW10sIHRyYW5zZHVjZXIsIG51bWJlcnMpOyAvLz0+IFsyLCAzXVxuICAgICAqXG4gICAgICogICAgICB2YXIgaW50b0FycmF5ID0gUi5pbnRvKFtdKTtcbiAgICAgKiAgICAgIGludG9BcnJheSh0cmFuc2R1Y2VyLCBudW1iZXJzKTsgLy89PiBbMiwgM11cbiAgICAgKi9cbiAgICB2YXIgaW50byA9IF9jdXJyeTMoZnVuY3Rpb24gaW50byhhY2MsIHhmLCBsaXN0KSB7XG4gICAgICAgIHJldHVybiBfaXNUcmFuc2Zvcm1lcihhY2MpID8gX3JlZHVjZSh4ZihhY2MpLCBhY2NbJ0BAdHJhbnNkdWNlci9pbml0J10oKSwgbGlzdCkgOiBfcmVkdWNlKHhmKF9zdGVwQ2F0KGFjYykpLCBhY2MsIGxpc3QpO1xuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgcmVzdWx0IG9mIGFwcGx5aW5nIGBvYmpbbWV0aG9kTmFtZV1gIHRvIGBhcmdzYC5cbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgT2JqZWN0XG4gICAgICogQHNpZyBTdHJpbmcgLT4gWypdIC0+IE9iamVjdCAtPiAqXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IG1ldGhvZE5hbWVcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBhcmdzXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9ialxuICAgICAqIEByZXR1cm4geyp9XG4gICAgICogQGRlcHJlY2F0ZWQgc2luY2UgdjAuMTUuMFxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIC8vICB0b0JpbmFyeSA6OiBOdW1iZXIgLT4gU3RyaW5nXG4gICAgICogICAgICB2YXIgdG9CaW5hcnkgPSBSLmludm9rZSgndG9TdHJpbmcnLCBbMl0pXG4gICAgICpcbiAgICAgKiAgICAgIHRvQmluYXJ5KDQyKTsgLy89PiAnMTAxMDEwJ1xuICAgICAqICAgICAgdG9CaW5hcnkoNjMpOyAvLz0+ICcxMTExMTEnXG4gICAgICovXG4gICAgdmFyIGludm9rZSA9IGN1cnJ5KGZ1bmN0aW9uIGludm9rZShtZXRob2ROYW1lLCBhcmdzLCBvYmopIHtcbiAgICAgICAgcmV0dXJuIG9ialttZXRob2ROYW1lXS5hcHBseShvYmosIGFyZ3MpO1xuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBgdHJ1ZWAgaWYgYWxsIGVsZW1lbnRzIGFyZSB1bmlxdWUsIGluIGBSLmVxdWFsc2AgdGVybXMsXG4gICAgICogb3RoZXJ3aXNlIGBmYWxzZWAuXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IExpc3RcbiAgICAgKiBAc2lnIFthXSAtPiBCb29sZWFuXG4gICAgICogQHBhcmFtIHtBcnJheX0gbGlzdCBUaGUgYXJyYXkgdG8gY29uc2lkZXIuXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn0gYHRydWVgIGlmIGFsbCBlbGVtZW50cyBhcmUgdW5pcXVlLCBlbHNlIGBmYWxzZWAuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgUi5pc1NldChbJzEnLCAxXSk7IC8vPT4gdHJ1ZVxuICAgICAqICAgICAgUi5pc1NldChbMSwgMV0pOyAgIC8vPT4gZmFsc2VcbiAgICAgKiAgICAgIFIuaXNTZXQoW1s0Ml0sIFs0Ml1dKTsgLy89PiBmYWxzZVxuICAgICAqL1xuICAgIHZhciBpc1NldCA9IF9jdXJyeTEoZnVuY3Rpb24gaXNTZXQobGlzdCkge1xuICAgICAgICB2YXIgbGVuID0gbGlzdC5sZW5ndGg7XG4gICAgICAgIHZhciBpZHggPSAwO1xuICAgICAgICB3aGlsZSAoaWR4IDwgbGVuKSB7XG4gICAgICAgICAgICBpZiAoX2luZGV4T2YobGlzdCwgbGlzdFtpZHhdLCBpZHggKyAxKSA+PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWR4ICs9IDE7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBwb3NpdGlvbiBvZiB0aGUgbGFzdCBvY2N1cnJlbmNlIG9mIGFuIGl0ZW0gaW5cbiAgICAgKiBhbiBhcnJheSwgb3IgLTEgaWYgdGhlIGl0ZW0gaXMgbm90IGluY2x1ZGVkIGluIHRoZSBhcnJheS5cbiAgICAgKiBgUi5lcXVhbHNgIGlzIHVzZWQgdG8gZGV0ZXJtaW5lIGVxdWFsaXR5LlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBMaXN0XG4gICAgICogQHNpZyBhIC0+IFthXSAtPiBOdW1iZXJcbiAgICAgKiBAcGFyYW0geyp9IHRhcmdldCBUaGUgaXRlbSB0byBmaW5kLlxuICAgICAqIEBwYXJhbSB7QXJyYXl9IHhzIFRoZSBhcnJheSB0byBzZWFyY2ggaW4uXG4gICAgICogQHJldHVybiB7TnVtYmVyfSB0aGUgaW5kZXggb2YgdGhlIHRhcmdldCwgb3IgLTEgaWYgdGhlIHRhcmdldCBpcyBub3QgZm91bmQuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICBSLmxhc3RJbmRleE9mKDMsIFstMSwzLDMsMCwxLDIsMyw0XSk7IC8vPT4gNlxuICAgICAqICAgICAgUi5sYXN0SW5kZXhPZigxMCwgWzEsMiwzLDRdKTsgLy89PiAtMVxuICAgICAqL1xuICAgIHZhciBsYXN0SW5kZXhPZiA9IF9jdXJyeTIoZnVuY3Rpb24gbGFzdEluZGV4T2YodGFyZ2V0LCB4cykge1xuICAgICAgICByZXR1cm4gX2hhc01ldGhvZCgnbGFzdEluZGV4T2YnLCB4cykgPyB4cy5sYXN0SW5kZXhPZih0YXJnZXQpIDogX2xhc3RJbmRleE9mKHhzLCB0YXJnZXQpO1xuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogXCJsaWZ0c1wiIGEgZnVuY3Rpb24gdG8gYmUgdGhlIHNwZWNpZmllZCBhcml0eSwgc28gdGhhdCBpdCBtYXkgXCJtYXAgb3ZlclwiIHRoYXQgbWFueVxuICAgICAqIGxpc3RzIChvciBvdGhlciBGdW5jdG9ycykuXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQHNlZSBSLmxpZnRcbiAgICAgKiBAY2F0ZWdvcnkgRnVuY3Rpb25cbiAgICAgKiBAc2lnIE51bWJlciAtPiAoKi4uLiAtPiAqKSAtPiAoWypdLi4uIC0+IFsqXSlcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgZnVuY3Rpb24gdG8gbGlmdCBpbnRvIGhpZ2hlciBjb250ZXh0XG4gICAgICogQHJldHVybiB7RnVuY3Rpb259IFRoZSBmdW5jdGlvbiBgZm5gIGFwcGxpY2FibGUgdG8gbWFwcGFibGUgb2JqZWN0cy5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICB2YXIgbWFkZDMgPSBSLmxpZnROKDMsIFIuY3VycnlOKDMsIGZ1bmN0aW9uKCkge1xuICAgICAqICAgICAgICByZXR1cm4gUi5yZWR1Y2UoUi5hZGQsIDAsIGFyZ3VtZW50cyk7XG4gICAgICogICAgICB9KSk7XG4gICAgICogICAgICBtYWRkMyhbMSwyLDNdLCBbMSwyLDNdLCBbMV0pOyAvLz0+IFszLCA0LCA1LCA0LCA1LCA2LCA1LCA2LCA3XVxuICAgICAqL1xuICAgIHZhciBsaWZ0TiA9IF9jdXJyeTIoZnVuY3Rpb24gbGlmdE4oYXJpdHksIGZuKSB7XG4gICAgICAgIHZhciBsaWZ0ZWQgPSBjdXJyeU4oYXJpdHksIGZuKTtcbiAgICAgICAgcmV0dXJuIGN1cnJ5Tihhcml0eSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIF9yZWR1Y2UoYXAsIG1hcChsaWZ0ZWQsIGFyZ3VtZW50c1swXSksIF9zbGljZShhcmd1bWVudHMsIDEpKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBtZWFuIG9mIHRoZSBnaXZlbiBsaXN0IG9mIG51bWJlcnMuXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IE1hdGhcbiAgICAgKiBAc2lnIFtOdW1iZXJdIC0+IE51bWJlclxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGxpc3RcbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9XG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgUi5tZWFuKFsyLCA3LCA5XSk7IC8vPT4gNlxuICAgICAqICAgICAgUi5tZWFuKFtdKTsgLy89PiBOYU5cbiAgICAgKi9cbiAgICB2YXIgbWVhbiA9IF9jdXJyeTEoZnVuY3Rpb24gbWVhbihsaXN0KSB7XG4gICAgICAgIHJldHVybiBzdW0obGlzdCkgLyBsaXN0Lmxlbmd0aDtcbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIG1lZGlhbiBvZiB0aGUgZ2l2ZW4gbGlzdCBvZiBudW1iZXJzLlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBNYXRoXG4gICAgICogQHNpZyBbTnVtYmVyXSAtPiBOdW1iZXJcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBsaXN0XG4gICAgICogQHJldHVybiB7TnVtYmVyfVxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIFIubWVkaWFuKFsyLCA5LCA3XSk7IC8vPT4gN1xuICAgICAqICAgICAgUi5tZWRpYW4oWzcsIDIsIDEwLCA5XSk7IC8vPT4gOFxuICAgICAqICAgICAgUi5tZWRpYW4oW10pOyAvLz0+IE5hTlxuICAgICAqL1xuICAgIHZhciBtZWRpYW4gPSBfY3VycnkxKGZ1bmN0aW9uIG1lZGlhbihsaXN0KSB7XG4gICAgICAgIHZhciBsZW4gPSBsaXN0Lmxlbmd0aDtcbiAgICAgICAgaWYgKGxlbiA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIE5hTjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgd2lkdGggPSAyIC0gbGVuICUgMjtcbiAgICAgICAgdmFyIGlkeCA9IChsZW4gLSB3aWR0aCkgLyAyO1xuICAgICAgICByZXR1cm4gbWVhbihfc2xpY2UobGlzdCkuc29ydChmdW5jdGlvbiAoYSwgYikge1xuICAgICAgICAgICAgcmV0dXJuIGEgPCBiID8gLTEgOiBhID4gYiA/IDEgOiAwO1xuICAgICAgICB9KS5zbGljZShpZHgsIGlkeCArIHdpZHRoKSk7XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBNZXJnZXMgYSBsaXN0IG9mIG9iamVjdHMgdG9nZXRoZXIgaW50byBvbmUgb2JqZWN0LlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBMaXN0XG4gICAgICogQHNpZyBbe2s6IHZ9XSAtPiB7azogdn1cbiAgICAgKiBAcGFyYW0ge0FycmF5fSBsaXN0IEFuIGFycmF5IG9mIG9iamVjdHNcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IEEgbWVyZ2VkIG9iamVjdC5cbiAgICAgKiBAc2VlIFIucmVkdWNlXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgUi5tZXJnZUFsbChbe2ZvbzoxfSx7YmFyOjJ9LHtiYXo6M31dKTsgLy89PiB7Zm9vOjEsYmFyOjIsYmF6OjN9XG4gICAgICogICAgICBSLm1lcmdlQWxsKFt7Zm9vOjF9LHtmb286Mn0se2JhcjoyfV0pOyAvLz0+IHtmb286MixiYXI6Mn1cbiAgICAgKi9cbiAgICB2YXIgbWVyZ2VBbGwgPSBfY3VycnkxKGZ1bmN0aW9uIG1lcmdlQWxsKGxpc3QpIHtcbiAgICAgICAgcmV0dXJuIHJlZHVjZShtZXJnZSwge30sIGxpc3QpO1xuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhIHBhcnRpYWwgY29weSBvZiBhbiBvYmplY3Qgb21pdHRpbmcgdGhlIGtleXMgc3BlY2lmaWVkLlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBPYmplY3RcbiAgICAgKiBAc2lnIFtTdHJpbmddIC0+IHtTdHJpbmc6ICp9IC0+IHtTdHJpbmc6ICp9XG4gICAgICogQHBhcmFtIHtBcnJheX0gbmFtZXMgYW4gYXJyYXkgb2YgU3RyaW5nIHByb3BlcnR5IG5hbWVzIHRvIG9taXQgZnJvbSB0aGUgbmV3IG9iamVjdFxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvYmogVGhlIG9iamVjdCB0byBjb3B5IGZyb21cbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IEEgbmV3IG9iamVjdCB3aXRoIHByb3BlcnRpZXMgZnJvbSBgbmFtZXNgIG5vdCBvbiBpdC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICBSLm9taXQoWydhJywgJ2QnXSwge2E6IDEsIGI6IDIsIGM6IDMsIGQ6IDR9KTsgLy89PiB7YjogMiwgYzogM31cbiAgICAgKi9cbiAgICB2YXIgb21pdCA9IF9jdXJyeTIoZnVuY3Rpb24gb21pdChuYW1lcywgb2JqKSB7XG4gICAgICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICAgICAgZm9yICh2YXIgcHJvcCBpbiBvYmopIHtcbiAgICAgICAgICAgIGlmIChfaW5kZXhPZihuYW1lcywgcHJvcCkgPCAwKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0W3Byb3BdID0gb2JqW3Byb3BdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBBY2NlcHRzIGFzIGl0cyBhcmd1bWVudHMgYSBmdW5jdGlvbiBhbmQgYW55IG51bWJlciBvZiB2YWx1ZXMgYW5kIHJldHVybnMgYSBmdW5jdGlvbiB0aGF0LFxuICAgICAqIHdoZW4gaW52b2tlZCwgY2FsbHMgdGhlIG9yaWdpbmFsIGZ1bmN0aW9uIHdpdGggYWxsIG9mIHRoZSB2YWx1ZXMgcHJlcGVuZGVkIHRvIHRoZVxuICAgICAqIG9yaWdpbmFsIGZ1bmN0aW9uJ3MgYXJndW1lbnRzIGxpc3QuIEluIHNvbWUgbGlicmFyaWVzIHRoaXMgZnVuY3Rpb24gaXMgbmFtZWQgYGFwcGx5TGVmdGAuXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IEZ1bmN0aW9uXG4gICAgICogQHNpZyAoYSAtPiBiIC0+IC4uLiAtPiBpIC0+IGogLT4gLi4uIC0+IG0gLT4gbikgLT4gYSAtPiBiLT4gLi4uIC0+IGkgLT4gKGogLT4gLi4uIC0+IG0gLT4gbilcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgZnVuY3Rpb24gdG8gaW52b2tlLlxuICAgICAqIEBwYXJhbSB7Li4uKn0gW2FyZ3NdIEFyZ3VtZW50cyB0byBwcmVwZW5kIHRvIGBmbmAgd2hlbiB0aGUgcmV0dXJuZWQgZnVuY3Rpb24gaXMgaW52b2tlZC5cbiAgICAgKiBAcmV0dXJuIHtGdW5jdGlvbn0gQSBuZXcgZnVuY3Rpb24gd3JhcHBpbmcgYGZuYC4gV2hlbiBpbnZva2VkLCBpdCB3aWxsIGNhbGwgYGZuYFxuICAgICAqICAgICAgICAgd2l0aCBgYXJnc2AgcHJlcGVuZGVkIHRvIGBmbmAncyBhcmd1bWVudHMgbGlzdC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICB2YXIgbXVsdGlwbHkgPSBmdW5jdGlvbihhLCBiKSB7IHJldHVybiBhICogYjsgfTtcbiAgICAgKiAgICAgIHZhciBkb3VibGUgPSBSLnBhcnRpYWwobXVsdGlwbHksIDIpO1xuICAgICAqICAgICAgZG91YmxlKDIpOyAvLz0+IDRcbiAgICAgKlxuICAgICAqICAgICAgdmFyIGdyZWV0ID0gZnVuY3Rpb24oc2FsdXRhdGlvbiwgdGl0bGUsIGZpcnN0TmFtZSwgbGFzdE5hbWUpIHtcbiAgICAgKiAgICAgICAgcmV0dXJuIHNhbHV0YXRpb24gKyAnLCAnICsgdGl0bGUgKyAnICcgKyBmaXJzdE5hbWUgKyAnICcgKyBsYXN0TmFtZSArICchJztcbiAgICAgKiAgICAgIH07XG4gICAgICogICAgICB2YXIgc2F5SGVsbG8gPSBSLnBhcnRpYWwoZ3JlZXQsICdIZWxsbycpO1xuICAgICAqICAgICAgdmFyIHNheUhlbGxvVG9NcyA9IFIucGFydGlhbChzYXlIZWxsbywgJ01zLicpO1xuICAgICAqICAgICAgc2F5SGVsbG9Ub01zKCdKYW5lJywgJ0pvbmVzJyk7IC8vPT4gJ0hlbGxvLCBNcy4gSmFuZSBKb25lcyEnXG4gICAgICovXG4gICAgdmFyIHBhcnRpYWwgPSBjdXJyeShfY3JlYXRlUGFydGlhbEFwcGxpY2F0b3IoX2NvbmNhdCkpO1xuXG4gICAgLyoqXG4gICAgICogQWNjZXB0cyBhcyBpdHMgYXJndW1lbnRzIGEgZnVuY3Rpb24gYW5kIGFueSBudW1iZXIgb2YgdmFsdWVzIGFuZCByZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCxcbiAgICAgKiB3aGVuIGludm9rZWQsIGNhbGxzIHRoZSBvcmlnaW5hbCBmdW5jdGlvbiB3aXRoIGFsbCBvZiB0aGUgdmFsdWVzIGFwcGVuZGVkIHRvIHRoZSBvcmlnaW5hbFxuICAgICAqIGZ1bmN0aW9uJ3MgYXJndW1lbnRzIGxpc3QuXG4gICAgICpcbiAgICAgKiBOb3RlIHRoYXQgYHBhcnRpYWxSaWdodGAgaXMgdGhlIG9wcG9zaXRlIG9mIGBwYXJ0aWFsYDogYHBhcnRpYWxSaWdodGAgZmlsbHMgYGZuYCdzIGFyZ3VtZW50c1xuICAgICAqIGZyb20gdGhlIHJpZ2h0IHRvIHRoZSBsZWZ0LiAgSW4gc29tZSBsaWJyYXJpZXMgdGhpcyBmdW5jdGlvbiBpcyBuYW1lZCBgYXBwbHlSaWdodGAuXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IEZ1bmN0aW9uXG4gICAgICogQHNpZyAoYSAtPiBiLT4gLi4uIC0+IGkgLT4gaiAtPiAuLi4gLT4gbSAtPiBuKSAtPiBqIC0+IC4uLiAtPiBtIC0+IG4gLT4gKGEgLT4gYi0+IC4uLiAtPiBpKVxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBmdW5jdGlvbiB0byBpbnZva2UuXG4gICAgICogQHBhcmFtIHsuLi4qfSBbYXJnc10gQXJndW1lbnRzIHRvIGFwcGVuZCB0byBgZm5gIHdoZW4gdGhlIHJldHVybmVkIGZ1bmN0aW9uIGlzIGludm9rZWQuXG4gICAgICogQHJldHVybiB7RnVuY3Rpb259IEEgbmV3IGZ1bmN0aW9uIHdyYXBwaW5nIGBmbmAuIFdoZW4gaW52b2tlZCwgaXQgd2lsbCBjYWxsIGBmbmAgd2l0aFxuICAgICAqICAgICAgICAgYGFyZ3NgIGFwcGVuZGVkIHRvIGBmbmAncyBhcmd1bWVudHMgbGlzdC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICB2YXIgZ3JlZXQgPSBmdW5jdGlvbihzYWx1dGF0aW9uLCB0aXRsZSwgZmlyc3ROYW1lLCBsYXN0TmFtZSkge1xuICAgICAqICAgICAgICByZXR1cm4gc2FsdXRhdGlvbiArICcsICcgKyB0aXRsZSArICcgJyArIGZpcnN0TmFtZSArICcgJyArIGxhc3ROYW1lICsgJyEnO1xuICAgICAqICAgICAgfTtcbiAgICAgKiAgICAgIHZhciBncmVldE1zSmFuZUpvbmVzID0gUi5wYXJ0aWFsUmlnaHQoZ3JlZXQsICdNcy4nLCAnSmFuZScsICdKb25lcycpO1xuICAgICAqXG4gICAgICogICAgICBncmVldE1zSmFuZUpvbmVzKCdIZWxsbycpOyAvLz0+ICdIZWxsbywgTXMuIEphbmUgSm9uZXMhJ1xuICAgICAqL1xuICAgIHZhciBwYXJ0aWFsUmlnaHQgPSBjdXJyeShfY3JlYXRlUGFydGlhbEFwcGxpY2F0b3IoZmxpcChfY29uY2F0KSkpO1xuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhIG5ldyBsaXN0IGJ5IHBsdWNraW5nIHRoZSBzYW1lIG5hbWVkIHByb3BlcnR5IG9mZiBhbGwgb2JqZWN0cyBpbiB0aGUgbGlzdCBzdXBwbGllZC5cbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgTGlzdFxuICAgICAqIEBzaWcgayAtPiBbe2s6IHZ9XSAtPiBbdl1cbiAgICAgKiBAcGFyYW0ge051bWJlcnxTdHJpbmd9IGtleSBUaGUga2V5IG5hbWUgdG8gcGx1Y2sgb2ZmIG9mIGVhY2ggb2JqZWN0LlxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGxpc3QgVGhlIGFycmF5IHRvIGNvbnNpZGVyLlxuICAgICAqIEByZXR1cm4ge0FycmF5fSBUaGUgbGlzdCBvZiB2YWx1ZXMgZm9yIHRoZSBnaXZlbiBrZXkuXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgUi5wbHVjaygnYScpKFt7YTogMX0sIHthOiAyfV0pOyAvLz0+IFsxLCAyXVxuICAgICAqICAgICAgUi5wbHVjaygwKShbWzEsIDJdLCBbMywgNF1dKTsgICAvLz0+IFsxLCAzXVxuICAgICAqL1xuICAgIHZhciBwbHVjayA9IF9jdXJyeTIoX3BsdWNrKTtcblxuICAgIC8qKlxuICAgICAqIE11bHRpcGxpZXMgdG9nZXRoZXIgYWxsIHRoZSBlbGVtZW50cyBvZiBhIGxpc3QuXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IE1hdGhcbiAgICAgKiBAc2lnIFtOdW1iZXJdIC0+IE51bWJlclxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGxpc3QgQW4gYXJyYXkgb2YgbnVtYmVyc1xuICAgICAqIEByZXR1cm4ge051bWJlcn0gVGhlIHByb2R1Y3Qgb2YgYWxsIHRoZSBudW1iZXJzIGluIHRoZSBsaXN0LlxuICAgICAqIEBzZWUgUi5yZWR1Y2VcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICBSLnByb2R1Y3QoWzIsNCw2LDgsMTAwLDFdKTsgLy89PiAzODQwMFxuICAgICAqL1xuICAgIHZhciBwcm9kdWN0ID0gcmVkdWNlKF9tdWx0aXBseSwgMSk7XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhlIGdpdmVuIHZhbHVlLiBgZXZhbGAnaW5nIHRoZSBvdXRwdXRcbiAgICAgKiBzaG91bGQgcmVzdWx0IGluIGEgdmFsdWUgZXF1aXZhbGVudCB0byB0aGUgaW5wdXQgdmFsdWUuIE1hbnkgb2YgdGhlIGJ1aWx0LWluXG4gICAgICogYHRvU3RyaW5nYCBtZXRob2RzIGRvIG5vdCBzYXRpc2Z5IHRoaXMgcmVxdWlyZW1lbnQuXG4gICAgICpcbiAgICAgKiBJZiB0aGUgZ2l2ZW4gdmFsdWUgaXMgYW4gYFtvYmplY3QgT2JqZWN0XWAgd2l0aCBhIGB0b1N0cmluZ2AgbWV0aG9kIG90aGVyXG4gICAgICogdGhhbiBgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZ2AsIHRoaXMgbWV0aG9kIGlzIGludm9rZWQgd2l0aCBubyBhcmd1bWVudHNcbiAgICAgKiB0byBwcm9kdWNlIHRoZSByZXR1cm4gdmFsdWUuIFRoaXMgbWVhbnMgdXNlci1kZWZpbmVkIGNvbnN0cnVjdG9yIGZ1bmN0aW9uc1xuICAgICAqIGNhbiBwcm92aWRlIGEgc3VpdGFibGUgYHRvU3RyaW5nYCBtZXRob2QuIEZvciBleGFtcGxlOlxuICAgICAqXG4gICAgICogICAgIGZ1bmN0aW9uIFBvaW50KHgsIHkpIHtcbiAgICAgKiAgICAgICB0aGlzLnggPSB4O1xuICAgICAqICAgICAgIHRoaXMueSA9IHk7XG4gICAgICogICAgIH1cbiAgICAgKlxuICAgICAqICAgICBQb2ludC5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgICAgKiAgICAgICByZXR1cm4gJ25ldyBQb2ludCgnICsgdGhpcy54ICsgJywgJyArIHRoaXMueSArICcpJztcbiAgICAgKiAgICAgfTtcbiAgICAgKlxuICAgICAqICAgICBSLnRvU3RyaW5nKG5ldyBQb2ludCgxLCAyKSk7IC8vPT4gJ25ldyBQb2ludCgxLCAyKSdcbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgU3RyaW5nXG4gICAgICogQHNpZyAqIC0+IFN0cmluZ1xuICAgICAqIEBwYXJhbSB7Kn0gdmFsXG4gICAgICogQHJldHVybiB7U3RyaW5nfVxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIFIudG9TdHJpbmcoNDIpOyAvLz0+ICc0MidcbiAgICAgKiAgICAgIFIudG9TdHJpbmcoJ2FiYycpOyAvLz0+ICdcImFiY1wiJ1xuICAgICAqICAgICAgUi50b1N0cmluZyhbMSwgMiwgM10pOyAvLz0+ICdbMSwgMiwgM10nXG4gICAgICogICAgICBSLnRvU3RyaW5nKHtmb286IDEsIGJhcjogMiwgYmF6OiAzfSk7IC8vPT4gJ3tcImJhclwiOiAyLCBcImJhelwiOiAzLCBcImZvb1wiOiAxfSdcbiAgICAgKiAgICAgIFIudG9TdHJpbmcobmV3IERhdGUoJzIwMDEtMDItMDNUMDQ6MDU6MDZaJykpOyAvLz0+ICduZXcgRGF0ZShcIjIwMDEtMDItMDNUMDQ6MDU6MDYuMDAwWlwiKSdcbiAgICAgKi9cbiAgICB2YXIgdG9TdHJpbmcgPSBfY3VycnkxKGZ1bmN0aW9uIHRvU3RyaW5nKHZhbCkge1xuICAgICAgICByZXR1cm4gX3RvU3RyaW5nKHZhbCwgW10pO1xuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogQ29tYmluZXMgdHdvIGxpc3RzIGludG8gYSBzZXQgKGkuZS4gbm8gZHVwbGljYXRlcykgY29tcG9zZWQgb2YgdGhlXG4gICAgICogZWxlbWVudHMgb2YgZWFjaCBsaXN0LlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBSZWxhdGlvblxuICAgICAqIEBzaWcgW2FdIC0+IFthXSAtPiBbYV1cbiAgICAgKiBAcGFyYW0ge0FycmF5fSBhcyBUaGUgZmlyc3QgbGlzdC5cbiAgICAgKiBAcGFyYW0ge0FycmF5fSBicyBUaGUgc2Vjb25kIGxpc3QuXG4gICAgICogQHJldHVybiB7QXJyYXl9IFRoZSBmaXJzdCBhbmQgc2Vjb25kIGxpc3RzIGNvbmNhdGVuYXRlZCwgd2l0aFxuICAgICAqICAgICAgICAgZHVwbGljYXRlcyByZW1vdmVkLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIFIudW5pb24oWzEsIDIsIDNdLCBbMiwgMywgNF0pOyAvLz0+IFsxLCAyLCAzLCA0XVxuICAgICAqL1xuICAgIHZhciB1bmlvbiA9IF9jdXJyeTIoY29tcG9zZSh1bmlxLCBfY29uY2F0KSk7XG5cbiAgICAvKipcbiAgICAgKiBBY2NlcHRzIGEgZnVuY3Rpb24gYGZuYCBhbmQgYW55IG51bWJlciBvZiB0cmFuc2Zvcm1lciBmdW5jdGlvbnMgYW5kIHJldHVybnMgYSBuZXdcbiAgICAgKiBmdW5jdGlvbi4gV2hlbiB0aGUgbmV3IGZ1bmN0aW9uIGlzIGludm9rZWQsIGl0IGNhbGxzIHRoZSBmdW5jdGlvbiBgZm5gIHdpdGggcGFyYW1ldGVyc1xuICAgICAqIGNvbnNpc3Rpbmcgb2YgdGhlIHJlc3VsdCBvZiBjYWxsaW5nIGVhY2ggc3VwcGxpZWQgaGFuZGxlciBvbiBzdWNjZXNzaXZlIGFyZ3VtZW50cyB0byB0aGVcbiAgICAgKiBuZXcgZnVuY3Rpb24uXG4gICAgICpcbiAgICAgKiBJZiBtb3JlIGFyZ3VtZW50cyBhcmUgcGFzc2VkIHRvIHRoZSByZXR1cm5lZCBmdW5jdGlvbiB0aGFuIHRyYW5zZm9ybWVyIGZ1bmN0aW9ucywgdGhvc2VcbiAgICAgKiBhcmd1bWVudHMgYXJlIHBhc3NlZCBkaXJlY3RseSB0byBgZm5gIGFzIGFkZGl0aW9uYWwgcGFyYW1ldGVycy4gSWYgeW91IGV4cGVjdCBhZGRpdGlvbmFsXG4gICAgICogYXJndW1lbnRzIHRoYXQgZG9uJ3QgbmVlZCB0byBiZSB0cmFuc2Zvcm1lZCwgYWx0aG91Z2ggeW91IGNhbiBpZ25vcmUgdGhlbSwgaXQncyBiZXN0IHRvXG4gICAgICogcGFzcyBhbiBpZGVudGl0eSBmdW5jdGlvbiBzbyB0aGF0IHRoZSBuZXcgZnVuY3Rpb24gcmVwb3J0cyB0aGUgY29ycmVjdCBhcml0eS5cbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgRnVuY3Rpb25cbiAgICAgKiBAc2lnICh4MSAtPiB4MiAtPiAuLi4gLT4geikgLT4gKChhIC0+IHgxKSwgKGIgLT4geDIpLCAuLi4pIC0+IChhIC0+IGIgLT4gLi4uIC0+IHopXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGZ1bmN0aW9uIHRvIHdyYXAuXG4gICAgICogQHBhcmFtIHsuLi5GdW5jdGlvbn0gdHJhbnNmb3JtZXJzIEEgdmFyaWFibGUgbnVtYmVyIG9mIHRyYW5zZm9ybWVyIGZ1bmN0aW9uc1xuICAgICAqIEByZXR1cm4ge0Z1bmN0aW9ufSBUaGUgd3JhcHBlZCBmdW5jdGlvbi5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICAvLyBFeGFtcGxlIDE6XG4gICAgICpcbiAgICAgKiAgICAgIC8vIE51bWJlciAtPiBbUGVyc29uXSAtPiBbUGVyc29uXVxuICAgICAqICAgICAgdmFyIGJ5QWdlID0gUi51c2VXaXRoKFIuZmlsdGVyLCBSLnByb3BFcSgnYWdlJyksIFIuaWRlbnRpdHkpO1xuICAgICAqXG4gICAgICogICAgICB2YXIga2lkcyA9IFtcbiAgICAgKiAgICAgICAge25hbWU6ICdBYmJpZScsIGFnZTogNn0sXG4gICAgICogICAgICAgIHtuYW1lOiAnQnJpYW4nLCBhZ2U6IDV9LFxuICAgICAqICAgICAgICB7bmFtZTogJ0NocmlzJywgYWdlOiA2fSxcbiAgICAgKiAgICAgICAge25hbWU6ICdEYXZpZCcsIGFnZTogNH0sXG4gICAgICogICAgICAgIHtuYW1lOiAnRWxsaWUnLCBhZ2U6IDV9XG4gICAgICogICAgICBdO1xuICAgICAqXG4gICAgICogICAgICBieUFnZSg1LCBraWRzKTsgLy89PiBbe25hbWU6ICdCcmlhbicsIGFnZTogNX0sIHtuYW1lOiAnRWxsaWUnLCBhZ2U6IDV9XVxuICAgICAqXG4gICAgICogICAgICAvLyBFeGFtcGxlIDI6XG4gICAgICpcbiAgICAgKiAgICAgIHZhciBkb3VibGUgPSBmdW5jdGlvbih5KSB7IHJldHVybiB5ICogMjsgfTtcbiAgICAgKiAgICAgIHZhciBzcXVhcmUgPSBmdW5jdGlvbih4KSB7IHJldHVybiB4ICogeDsgfTtcbiAgICAgKiAgICAgIHZhciBhZGQgPSBmdW5jdGlvbihhLCBiKSB7IHJldHVybiBhICsgYjsgfTtcbiAgICAgKiAgICAgIC8vIEFkZHMgYW55IG51bWJlciBvZiBhcmd1bWVudHMgdG9nZXRoZXJcbiAgICAgKiAgICAgIHZhciBhZGRBbGwgPSBmdW5jdGlvbigpIHtcbiAgICAgKiAgICAgICAgcmV0dXJuIFIucmVkdWNlKGFkZCwgMCwgYXJndW1lbnRzKTtcbiAgICAgKiAgICAgIH07XG4gICAgICpcbiAgICAgKiAgICAgIC8vIEJhc2ljIGV4YW1wbGVcbiAgICAgKiAgICAgIHZhciBhZGREb3VibGVBbmRTcXVhcmUgPSBSLnVzZVdpdGgoYWRkQWxsLCBkb3VibGUsIHNxdWFyZSk7XG4gICAgICpcbiAgICAgKiAgICAgIC8v4omFIGFkZEFsbChkb3VibGUoMTApLCBzcXVhcmUoNSkpO1xuICAgICAqICAgICAgYWRkRG91YmxlQW5kU3F1YXJlKDEwLCA1KTsgLy89PiA0NVxuICAgICAqXG4gICAgICogICAgICAvLyBFeGFtcGxlIG9mIHBhc3NpbmcgbW9yZSBhcmd1bWVudHMgdGhhbiB0cmFuc2Zvcm1lcnNcbiAgICAgKiAgICAgIC8v4omFIGFkZEFsbChkb3VibGUoMTApLCBzcXVhcmUoNSksIDEwMCk7XG4gICAgICogICAgICBhZGREb3VibGVBbmRTcXVhcmUoMTAsIDUsIDEwMCk7IC8vPT4gMTQ1XG4gICAgICpcbiAgICAgKiAgICAgIC8vIElmIHRoZXJlIGFyZSBleHRyYSBfZXhwZWN0ZWRfIGFyZ3VtZW50cyB0aGF0IGRvbid0IG5lZWQgdG8gYmUgdHJhbnNmb3JtZWQsIGFsdGhvdWdoXG4gICAgICogICAgICAvLyB5b3UgY2FuIGlnbm9yZSB0aGVtLCBpdCBtaWdodCBiZSBiZXN0IHRvIHBhc3MgaW4gdGhlIGlkZW50aXR5IGZ1bmN0aW9uIHNvIHRoYXQgdGhlIG5ld1xuICAgICAqICAgICAgLy8gZnVuY3Rpb24gY29ycmVjdGx5IHJlcG9ydHMgYXJpdHkuXG4gICAgICogICAgICB2YXIgYWRkRG91YmxlQW5kU3F1YXJlV2l0aEV4dHJhUGFyYW1zID0gUi51c2VXaXRoKGFkZEFsbCwgZG91YmxlLCBzcXVhcmUsIFIuaWRlbnRpdHkpO1xuICAgICAqICAgICAgLy8gYWRkRG91YmxlQW5kU3F1YXJlV2l0aEV4dHJhUGFyYW1zLmxlbmd0aCAvLz0+IDNcbiAgICAgKiAgICAgIC8v4omFIGFkZEFsbChkb3VibGUoMTApLCBzcXVhcmUoNSksIFIuaWRlbnRpdHkoMTAwKSk7XG4gICAgICogICAgICBhZGREb3VibGVBbmRTcXVhcmUoMTAsIDUsIDEwMCk7IC8vPT4gMTQ1XG4gICAgICovXG4gICAgLyosIHRyYW5zZm9ybWVycyAqL1xuICAgIHZhciB1c2VXaXRoID0gY3VycnkoZnVuY3Rpb24gdXNlV2l0aChmbikge1xuICAgICAgICB2YXIgdHJhbnNmb3JtZXJzID0gX3NsaWNlKGFyZ3VtZW50cywgMSk7XG4gICAgICAgIHZhciB0bGVuID0gdHJhbnNmb3JtZXJzLmxlbmd0aDtcbiAgICAgICAgcmV0dXJuIGN1cnJ5KGFyaXR5KHRsZW4sIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBhcmdzID0gW10sIGlkeCA9IDA7XG4gICAgICAgICAgICB3aGlsZSAoaWR4IDwgdGxlbikge1xuICAgICAgICAgICAgICAgIGFyZ3NbaWR4XSA9IHRyYW5zZm9ybWVyc1tpZHhdKGFyZ3VtZW50c1tpZHhdKTtcbiAgICAgICAgICAgICAgICBpZHggKz0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBmbi5hcHBseSh0aGlzLCBhcmdzLmNvbmNhdChfc2xpY2UoYXJndW1lbnRzLCB0bGVuKSkpO1xuICAgICAgICB9KSk7XG4gICAgfSk7XG5cbiAgICB2YXIgX2NvbnRhaW5zID0gZnVuY3Rpb24gX2NvbnRhaW5zKGEsIGxpc3QpIHtcbiAgICAgICAgcmV0dXJuIF9pbmRleE9mKGxpc3QsIGEpID49IDA7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEdpdmVuIGEgbGlzdCBvZiBwcmVkaWNhdGVzLCByZXR1cm5zIGEgbmV3IHByZWRpY2F0ZSB0aGF0IHdpbGwgYmUgdHJ1ZSBleGFjdGx5IHdoZW4gYWxsIG9mIHRoZW0gYXJlLlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBMb2dpY1xuICAgICAqIEBzaWcgWygqLi4uIC0+IEJvb2xlYW4pXSAtPiAoKi4uLiAtPiBCb29sZWFuKVxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGxpc3QgQW4gYXJyYXkgb2YgcHJlZGljYXRlIGZ1bmN0aW9uc1xuICAgICAqIEBwYXJhbSB7Kn0gb3B0aW9uYWwgQW55IGFyZ3VtZW50cyB0byBwYXNzIGludG8gdGhlIHByZWRpY2F0ZXNcbiAgICAgKiBAcmV0dXJuIHtGdW5jdGlvbn0gYSBmdW5jdGlvbiB0aGF0IGFwcGxpZXMgaXRzIGFyZ3VtZW50cyB0byBlYWNoIG9mXG4gICAgICogICAgICAgICB0aGUgcHJlZGljYXRlcywgcmV0dXJuaW5nIGB0cnVlYCBpZiBhbGwgYXJlIHNhdGlzZmllZC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICB2YXIgZ3QxMCA9IGZ1bmN0aW9uKHgpIHsgcmV0dXJuIHggPiAxMDsgfTtcbiAgICAgKiAgICAgIHZhciBldmVuID0gZnVuY3Rpb24oeCkgeyByZXR1cm4geCAlIDIgPT09IDB9O1xuICAgICAqICAgICAgdmFyIGYgPSBSLmFsbFBhc3MoW2d0MTAsIGV2ZW5dKTtcbiAgICAgKiAgICAgIGYoMTEpOyAvLz0+IGZhbHNlXG4gICAgICogICAgICBmKDEyKTsgLy89PiB0cnVlXG4gICAgICovXG4gICAgdmFyIGFsbFBhc3MgPSBjdXJyeShfcHJlZGljYXRlV3JhcChfYWxsKSk7XG5cbiAgICAvKipcbiAgICAgKiBHaXZlbiBhIGxpc3Qgb2YgcHJlZGljYXRlcyByZXR1cm5zIGEgbmV3IHByZWRpY2F0ZSB0aGF0IHdpbGwgYmUgdHJ1ZSBleGFjdGx5IHdoZW4gYW55IG9uZSBvZiB0aGVtIGlzLlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBMb2dpY1xuICAgICAqIEBzaWcgWygqLi4uIC0+IEJvb2xlYW4pXSAtPiAoKi4uLiAtPiBCb29sZWFuKVxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGxpc3QgQW4gYXJyYXkgb2YgcHJlZGljYXRlIGZ1bmN0aW9uc1xuICAgICAqIEBwYXJhbSB7Kn0gb3B0aW9uYWwgQW55IGFyZ3VtZW50cyB0byBwYXNzIGludG8gdGhlIHByZWRpY2F0ZXNcbiAgICAgKiBAcmV0dXJuIHtGdW5jdGlvbn0gQSBmdW5jdGlvbiB0aGF0IGFwcGxpZXMgaXRzIGFyZ3VtZW50cyB0byBlYWNoIG9mIHRoZSBwcmVkaWNhdGVzLCByZXR1cm5pbmdcbiAgICAgKiAgICAgICAgIGB0cnVlYCBpZiBhbGwgYXJlIHNhdGlzZmllZC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICB2YXIgZ3QxMCA9IGZ1bmN0aW9uKHgpIHsgcmV0dXJuIHggPiAxMDsgfTtcbiAgICAgKiAgICAgIHZhciBldmVuID0gZnVuY3Rpb24oeCkgeyByZXR1cm4geCAlIDIgPT09IDB9O1xuICAgICAqICAgICAgdmFyIGYgPSBSLmFueVBhc3MoW2d0MTAsIGV2ZW5dKTtcbiAgICAgKiAgICAgIGYoMTEpOyAvLz0+IHRydWVcbiAgICAgKiAgICAgIGYoOCk7IC8vPT4gdHJ1ZVxuICAgICAqICAgICAgZig5KTsgLy89PiBmYWxzZVxuICAgICAqL1xuICAgIHZhciBhbnlQYXNzID0gY3VycnkoX3ByZWRpY2F0ZVdyYXAoX2FueSkpO1xuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgaXRzIGZpcnN0IGFyZ3VtZW50IHdpdGggdGhlIHJlbWFpbmluZ1xuICAgICAqIGFyZ3VtZW50cy4gVGhpcyBpcyBvY2Nhc2lvbmFsbHkgdXNlZnVsIGFzIGEgY29udmVyZ2luZyBmdW5jdGlvbiBmb3JcbiAgICAgKiBgUi5jb252ZXJnZWA6IHRoZSBsZWZ0IGJyYW5jaCBjYW4gcHJvZHVjZSBhIGZ1bmN0aW9uIHdoaWxlIHRoZSByaWdodFxuICAgICAqIGJyYW5jaCBwcm9kdWNlcyBhIHZhbHVlIHRvIGJlIHBhc3NlZCB0byB0aGF0IGZ1bmN0aW9uIGFzIGFuIGFyZ3VtZW50LlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBGdW5jdGlvblxuICAgICAqIEBzaWcgKCouLi4gLT4gYSksKi4uLiAtPiBhXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGZ1bmN0aW9uIHRvIGFwcGx5IHRvIHRoZSByZW1haW5pbmcgYXJndW1lbnRzLlxuICAgICAqIEBwYXJhbSB7Li4uKn0gYXJncyBBbnkgbnVtYmVyIG9mIHBvc2l0aW9uYWwgYXJndW1lbnRzLlxuICAgICAqIEByZXR1cm4geyp9XG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgdmFyIGluZGVudE4gPSBSLnBpcGUoUi50aW1lcyhSLmFsd2F5cygnICcpKSxcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgIFIuam9pbignJyksXG4gICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICBSLnJlcGxhY2UoL14oPyEkKS9nbSkpO1xuICAgICAqXG4gICAgICogICAgICB2YXIgZm9ybWF0ID0gUi5jb252ZXJnZShSLmNhbGwsXG4gICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICBSLnBpcGUoUi5wcm9wKCdpbmRlbnQnKSwgaW5kZW50TiksXG4gICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICBSLnByb3AoJ3ZhbHVlJykpO1xuICAgICAqXG4gICAgICogICAgICBmb3JtYXQoe2luZGVudDogMiwgdmFsdWU6ICdmb29cXG5iYXJcXG5iYXpcXG4nfSk7IC8vPT4gJyAgZm9vXFxuICBiYXJcXG4gIGJhelxcbidcbiAgICAgKi9cbiAgICB2YXIgY2FsbCA9IGN1cnJ5KGZ1bmN0aW9uIGNhbGwoZm4pIHtcbiAgICAgICAgcmV0dXJuIGZuLmFwcGx5KHRoaXMsIF9zbGljZShhcmd1bWVudHMsIDEpKTtcbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIFR1cm5zIGEgbGlzdCBvZiBGdW5jdG9ycyBpbnRvIGEgRnVuY3RvciBvZiBhIGxpc3QuXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IExpc3RcbiAgICAgKiBAc2VlIFIuY29tbXV0ZU1hcFxuICAgICAqIEBzaWcgRnVuY3RvciBmID0+ICh4IC0+IGYgeCkgLT4gW2YgYV0gLT4gZiBbYV1cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBvZiBBIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyB0aGUgZGF0YSB0eXBlIHRvIHJldHVyblxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGxpc3QgQW4gYXJyYXkgb2YgZnVuY3RvcnMgb2YgdGhlIHNhbWUgdHlwZVxuICAgICAqIEByZXR1cm4geyp9XG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgUi5jb21tdXRlKFIub2YsIFtbMV0sIFsyLCAzXV0pOyAgIC8vPT4gW1sxLCAyXSwgWzEsIDNdXVxuICAgICAqICAgICAgUi5jb21tdXRlKFIub2YsIFtbMSwgMl0sIFszXV0pOyAgIC8vPT4gW1sxLCAzXSwgWzIsIDNdXVxuICAgICAqICAgICAgUi5jb21tdXRlKFIub2YsIFtbMV0sIFsyXSwgWzNdXSk7IC8vPT4gW1sxLCAyLCAzXV1cbiAgICAgKiAgICAgIFIuY29tbXV0ZShNYXliZS5vZiwgW0p1c3QoMSksIEp1c3QoMiksIEp1c3QoMyldKTsgICAvLz0+IEp1c3QoWzEsIDIsIDNdKVxuICAgICAqICAgICAgUi5jb21tdXRlKE1heWJlLm9mLCBbSnVzdCgxKSwgSnVzdCgyKSwgTm90aGluZygpXSk7IC8vPT4gTm90aGluZygpXG4gICAgICovXG4gICAgdmFyIGNvbW11dGUgPSBjb21tdXRlTWFwKG1hcChpZGVudGl0eSkpO1xuXG4gICAgLyoqXG4gICAgICogV3JhcHMgYSBjb25zdHJ1Y3RvciBmdW5jdGlvbiBpbnNpZGUgYSBjdXJyaWVkIGZ1bmN0aW9uIHRoYXQgY2FuIGJlIGNhbGxlZCB3aXRoIHRoZSBzYW1lXG4gICAgICogYXJndW1lbnRzIGFuZCByZXR1cm5zIHRoZSBzYW1lIHR5cGUuIFRoZSBhcml0eSBvZiB0aGUgZnVuY3Rpb24gcmV0dXJuZWQgaXMgc3BlY2lmaWVkXG4gICAgICogdG8gYWxsb3cgdXNpbmcgdmFyaWFkaWMgY29uc3RydWN0b3IgZnVuY3Rpb25zLlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBGdW5jdGlvblxuICAgICAqIEBzaWcgTnVtYmVyIC0+ICgqIC0+IHsqfSkgLT4gKCogLT4geyp9KVxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBuIFRoZSBhcml0eSBvZiB0aGUgY29uc3RydWN0b3IgZnVuY3Rpb24uXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gRm4gVGhlIGNvbnN0cnVjdG9yIGZ1bmN0aW9uIHRvIHdyYXAuXG4gICAgICogQHJldHVybiB7RnVuY3Rpb259IEEgd3JhcHBlZCwgY3VycmllZCBjb25zdHJ1Y3RvciBmdW5jdGlvbi5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICAvLyBWYXJpYWRpYyBjb25zdHJ1Y3RvciBmdW5jdGlvblxuICAgICAqICAgICAgdmFyIFdpZGdldCA9IGZ1bmN0aW9uKCkge1xuICAgICAqICAgICAgICB0aGlzLmNoaWxkcmVuID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgICAgKiAgICAgICAgLy8gLi4uXG4gICAgICogICAgICB9O1xuICAgICAqICAgICAgV2lkZ2V0LnByb3RvdHlwZSA9IHtcbiAgICAgKiAgICAgICAgLy8gLi4uXG4gICAgICogICAgICB9O1xuICAgICAqICAgICAgdmFyIGFsbENvbmZpZ3MgPSBbXG4gICAgICogICAgICAgIC8vIC4uLlxuICAgICAqICAgICAgXTtcbiAgICAgKiAgICAgIFIubWFwKFIuY29uc3RydWN0TigxLCBXaWRnZXQpLCBhbGxDb25maWdzKTsgLy8gYSBsaXN0IG9mIFdpZGdldHNcbiAgICAgKi9cbiAgICB2YXIgY29uc3RydWN0TiA9IF9jdXJyeTIoZnVuY3Rpb24gY29uc3RydWN0TihuLCBGbikge1xuICAgICAgICBpZiAobiA+IDEwKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NvbnN0cnVjdG9yIHdpdGggZ3JlYXRlciB0aGFuIHRlbiBhcmd1bWVudHMnKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobiA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IEZuKCk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjdXJyeShuQXJ5KG4sIGZ1bmN0aW9uICgkMCwgJDEsICQyLCAkMywgJDQsICQ1LCAkNiwgJDcsICQ4LCAkOSkge1xuICAgICAgICAgICAgc3dpdGNoIChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBGbigkMCk7XG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBGbigkMCwgJDEpO1xuICAgICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgRm4oJDAsICQxLCAkMik7XG4gICAgICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBGbigkMCwgJDEsICQyLCAkMyk7XG4gICAgICAgICAgICBjYXNlIDU6XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBGbigkMCwgJDEsICQyLCAkMywgJDQpO1xuICAgICAgICAgICAgY2FzZSA2OlxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgRm4oJDAsICQxLCAkMiwgJDMsICQ0LCAkNSk7XG4gICAgICAgICAgICBjYXNlIDc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBGbigkMCwgJDEsICQyLCAkMywgJDQsICQ1LCAkNik7XG4gICAgICAgICAgICBjYXNlIDg6XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBGbigkMCwgJDEsICQyLCAkMywgJDQsICQ1LCAkNiwgJDcpO1xuICAgICAgICAgICAgY2FzZSA5OlxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgRm4oJDAsICQxLCAkMiwgJDMsICQ0LCAkNSwgJDYsICQ3LCAkOCk7XG4gICAgICAgICAgICBjYXNlIDEwOlxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgRm4oJDAsICQxLCAkMiwgJDMsICQ0LCAkNSwgJDYsICQ3LCAkOCwgJDkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KSk7XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgc3BlY2lmaWVkIHZhbHVlIGlzIGVxdWFsLCBpbiBgUi5lcXVhbHNgIHRlcm1zLFxuICAgICAqIHRvIGF0IGxlYXN0IG9uZSBlbGVtZW50IG9mIHRoZSBnaXZlbiBsaXN0OyBgZmFsc2VgIG90aGVyd2lzZS5cbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgTGlzdFxuICAgICAqIEBzaWcgYSAtPiBbYV0gLT4gQm9vbGVhblxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBhIFRoZSBpdGVtIHRvIGNvbXBhcmUgYWdhaW5zdC5cbiAgICAgKiBAcGFyYW0ge0FycmF5fSBsaXN0IFRoZSBhcnJheSB0byBjb25zaWRlci5cbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufSBgdHJ1ZWAgaWYgdGhlIGl0ZW0gaXMgaW4gdGhlIGxpc3QsIGBmYWxzZWAgb3RoZXJ3aXNlLlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKlxuICAgICAqICAgICAgUi5jb250YWlucygzLCBbMSwgMiwgM10pOyAvLz0+IHRydWVcbiAgICAgKiAgICAgIFIuY29udGFpbnMoNCwgWzEsIDIsIDNdKTsgLy89PiBmYWxzZVxuICAgICAqICAgICAgUi5jb250YWlucyhbNDJdLCBbWzQyXV0pOyAvLz0+IHRydWVcbiAgICAgKi9cbiAgICB2YXIgY29udGFpbnMgPSBfY3VycnkyKF9jb250YWlucyk7XG5cbiAgICAvKipcbiAgICAgKiBBY2NlcHRzIGF0IGxlYXN0IHRocmVlIGZ1bmN0aW9ucyBhbmQgcmV0dXJucyBhIG5ldyBmdW5jdGlvbi4gV2hlbiBpbnZva2VkLCB0aGlzIG5ld1xuICAgICAqIGZ1bmN0aW9uIHdpbGwgaW52b2tlIHRoZSBmaXJzdCBmdW5jdGlvbiwgYGFmdGVyYCwgcGFzc2luZyBhcyBpdHMgYXJndW1lbnRzIHRoZVxuICAgICAqIHJlc3VsdHMgb2YgaW52b2tpbmcgdGhlIHN1YnNlcXVlbnQgZnVuY3Rpb25zIHdpdGggd2hhdGV2ZXIgYXJndW1lbnRzIGFyZSBwYXNzZWQgdG9cbiAgICAgKiB0aGUgbmV3IGZ1bmN0aW9uLlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBGdW5jdGlvblxuICAgICAqIEBzaWcgKHgxIC0+IHgyIC0+IC4uLiAtPiB6KSAtPiAoKGEgLT4gYiAtPiAuLi4gLT4geDEpLCAoYSAtPiBiIC0+IC4uLiAtPiB4MiksIC4uLikgLT4gKGEgLT4gYiAtPiAuLi4gLT4geilcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBhZnRlciBBIGZ1bmN0aW9uLiBgYWZ0ZXJgIHdpbGwgYmUgaW52b2tlZCB3aXRoIHRoZSByZXR1cm4gdmFsdWVzIG9mXG4gICAgICogICAgICAgIGBmbjFgIGFuZCBgZm4yYCBhcyBpdHMgYXJndW1lbnRzLlxuICAgICAqIEBwYXJhbSB7Li4uRnVuY3Rpb259IGZ1bmN0aW9ucyBBIHZhcmlhYmxlIG51bWJlciBvZiBmdW5jdGlvbnMuXG4gICAgICogQHJldHVybiB7RnVuY3Rpb259IEEgbmV3IGZ1bmN0aW9uLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIHZhciBhZGQgPSBmdW5jdGlvbihhLCBiKSB7IHJldHVybiBhICsgYjsgfTtcbiAgICAgKiAgICAgIHZhciBtdWx0aXBseSA9IGZ1bmN0aW9uKGEsIGIpIHsgcmV0dXJuIGEgKiBiOyB9O1xuICAgICAqICAgICAgdmFyIHN1YnRyYWN0ID0gZnVuY3Rpb24oYSwgYikgeyByZXR1cm4gYSAtIGI7IH07XG4gICAgICpcbiAgICAgKiAgICAgIC8v4omFIG11bHRpcGx5KCBhZGQoMSwgMiksIHN1YnRyYWN0KDEsIDIpICk7XG4gICAgICogICAgICBSLmNvbnZlcmdlKG11bHRpcGx5LCBhZGQsIHN1YnRyYWN0KSgxLCAyKTsgLy89PiAtM1xuICAgICAqXG4gICAgICogICAgICB2YXIgYWRkMyA9IGZ1bmN0aW9uKGEsIGIsIGMpIHsgcmV0dXJuIGEgKyBiICsgYzsgfTtcbiAgICAgKiAgICAgIFIuY29udmVyZ2UoYWRkMywgbXVsdGlwbHksIGFkZCwgc3VidHJhY3QpKDEsIDIpOyAvLz0+IDRcbiAgICAgKi9cbiAgICB2YXIgY29udmVyZ2UgPSBjdXJyeU4oMywgZnVuY3Rpb24gKGFmdGVyKSB7XG4gICAgICAgIHZhciBmbnMgPSBfc2xpY2UoYXJndW1lbnRzLCAxKTtcbiAgICAgICAgcmV0dXJuIGN1cnJ5TihtYXgocGx1Y2soJ2xlbmd0aCcsIGZucykpLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgYXJncyA9IGFyZ3VtZW50cztcbiAgICAgICAgICAgIHZhciBjb250ZXh0ID0gdGhpcztcbiAgICAgICAgICAgIHJldHVybiBhZnRlci5hcHBseShjb250ZXh0LCBfbWFwKGZ1bmN0aW9uIChmbikge1xuICAgICAgICAgICAgICAgIHJldHVybiBmbi5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICAgICAgICAgIH0sIGZucykpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIEZpbmRzIHRoZSBzZXQgKGkuZS4gbm8gZHVwbGljYXRlcykgb2YgYWxsIGVsZW1lbnRzIGluIHRoZSBmaXJzdCBsaXN0IG5vdCBjb250YWluZWQgaW4gdGhlIHNlY29uZCBsaXN0LlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBSZWxhdGlvblxuICAgICAqIEBzaWcgW2FdIC0+IFthXSAtPiBbYV1cbiAgICAgKiBAcGFyYW0ge0FycmF5fSBsaXN0MSBUaGUgZmlyc3QgbGlzdC5cbiAgICAgKiBAcGFyYW0ge0FycmF5fSBsaXN0MiBUaGUgc2Vjb25kIGxpc3QuXG4gICAgICogQHJldHVybiB7QXJyYXl9IFRoZSBlbGVtZW50cyBpbiBgbGlzdDFgIHRoYXQgYXJlIG5vdCBpbiBgbGlzdDJgLlxuICAgICAqIEBzZWUgUi5kaWZmZXJlbmNlV2l0aFxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIFIuZGlmZmVyZW5jZShbMSwyLDMsNF0sIFs3LDYsNSw0LDNdKTsgLy89PiBbMSwyXVxuICAgICAqICAgICAgUi5kaWZmZXJlbmNlKFs3LDYsNSw0LDNdLCBbMSwyLDMsNF0pOyAvLz0+IFs3LDYsNV1cbiAgICAgKi9cbiAgICB2YXIgZGlmZmVyZW5jZSA9IF9jdXJyeTIoZnVuY3Rpb24gZGlmZmVyZW5jZShmaXJzdCwgc2Vjb25kKSB7XG4gICAgICAgIHZhciBvdXQgPSBbXTtcbiAgICAgICAgdmFyIGlkeCA9IDA7XG4gICAgICAgIHZhciBmaXJzdExlbiA9IGZpcnN0Lmxlbmd0aDtcbiAgICAgICAgd2hpbGUgKGlkeCA8IGZpcnN0TGVuKSB7XG4gICAgICAgICAgICBpZiAoIV9jb250YWlucyhmaXJzdFtpZHhdLCBzZWNvbmQpICYmICFfY29udGFpbnMoZmlyc3RbaWR4XSwgb3V0KSkge1xuICAgICAgICAgICAgICAgIG91dFtvdXQubGVuZ3RoXSA9IGZpcnN0W2lkeF07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZHggKz0gMTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhIG5ldyBsaXN0IHdpdGhvdXQgYW55IGNvbnNlY3V0aXZlbHkgcmVwZWF0aW5nIGVsZW1lbnRzLlxuICAgICAqIGBSLmVxdWFsc2AgaXMgdXNlZCB0byBkZXRlcm1pbmUgZXF1YWxpdHkuXG4gICAgICpcbiAgICAgKiBBY3RzIGFzIGEgdHJhbnNkdWNlciBpZiBhIHRyYW5zZm9ybWVyIGlzIGdpdmVuIGluIGxpc3QgcG9zaXRpb24uXG4gICAgICogQHNlZSBSLnRyYW5zZHVjZVxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBMaXN0XG4gICAgICogQHNpZyBbYV0gLT4gW2FdXG4gICAgICogQHBhcmFtIHtBcnJheX0gbGlzdCBUaGUgYXJyYXkgdG8gY29uc2lkZXIuXG4gICAgICogQHJldHVybiB7QXJyYXl9IGBsaXN0YCB3aXRob3V0IHJlcGVhdGluZyBlbGVtZW50cy5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgIFIuZHJvcFJlcGVhdHMoWzEsIDEsIDEsIDIsIDMsIDQsIDQsIDIsIDJdKTsgLy89PiBbMSwgMiwgMywgNCwgMl1cbiAgICAgKi9cbiAgICB2YXIgZHJvcFJlcGVhdHMgPSBfY3VycnkxKF9kaXNwYXRjaGFibGUoJ2Ryb3BSZXBlYXRzJywgX3hkcm9wUmVwZWF0c1dpdGgoZXF1YWxzKSwgZHJvcFJlcGVhdHNXaXRoKGVxdWFscykpKTtcblxuICAgIC8qKlxuICAgICAqIENvbWJpbmVzIHR3byBsaXN0cyBpbnRvIGEgc2V0IChpLmUuIG5vIGR1cGxpY2F0ZXMpIGNvbXBvc2VkIG9mIHRob3NlIGVsZW1lbnRzIGNvbW1vbiB0byBib3RoIGxpc3RzLlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBSZWxhdGlvblxuICAgICAqIEBzaWcgW2FdIC0+IFthXSAtPiBbYV1cbiAgICAgKiBAcGFyYW0ge0FycmF5fSBsaXN0MSBUaGUgZmlyc3QgbGlzdC5cbiAgICAgKiBAcGFyYW0ge0FycmF5fSBsaXN0MiBUaGUgc2Vjb25kIGxpc3QuXG4gICAgICogQHNlZSBSLmludGVyc2VjdGlvbldpdGhcbiAgICAgKiBAcmV0dXJuIHtBcnJheX0gVGhlIGxpc3Qgb2YgZWxlbWVudHMgZm91bmQgaW4gYm90aCBgbGlzdDFgIGFuZCBgbGlzdDJgLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIFIuaW50ZXJzZWN0aW9uKFsxLDIsMyw0XSwgWzcsNiw1LDQsM10pOyAvLz0+IFs0LCAzXVxuICAgICAqL1xuICAgIHZhciBpbnRlcnNlY3Rpb24gPSBfY3VycnkyKGZ1bmN0aW9uIGludGVyc2VjdGlvbihsaXN0MSwgbGlzdDIpIHtcbiAgICAgICAgcmV0dXJuIHVuaXEoX2ZpbHRlcihmbGlwKF9jb250YWlucykobGlzdDEpLCBsaXN0MikpO1xuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogXCJsaWZ0c1wiIGEgZnVuY3Rpb24gb2YgYXJpdHkgPiAxIHNvIHRoYXQgaXQgbWF5IFwibWFwIG92ZXJcIiBhbiBBcnJheSBvclxuICAgICAqIG90aGVyIEZ1bmN0b3IuXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQHNlZSBSLmxpZnROXG4gICAgICogQGNhdGVnb3J5IEZ1bmN0aW9uXG4gICAgICogQHNpZyAoKi4uLiAtPiAqKSAtPiAoWypdLi4uIC0+IFsqXSlcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgZnVuY3Rpb24gdG8gbGlmdCBpbnRvIGhpZ2hlciBjb250ZXh0XG4gICAgICogQHJldHVybiB7RnVuY3Rpb259IFRoZSBmdW5jdGlvbiBgZm5gIGFwcGxpY2FibGUgdG8gbWFwcGFibGUgb2JqZWN0cy5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICB2YXIgbWFkZDMgPSBSLmxpZnQoUi5jdXJyeShmdW5jdGlvbihhLCBiLCBjKSB7XG4gICAgICogICAgICAgIHJldHVybiBhICsgYiArIGM7XG4gICAgICogICAgICB9KSk7XG4gICAgICogICAgICBtYWRkMyhbMSwyLDNdLCBbMSwyLDNdLCBbMV0pOyAvLz0+IFszLCA0LCA1LCA0LCA1LCA2LCA1LCA2LCA3XVxuICAgICAqXG4gICAgICogICAgICB2YXIgbWFkZDUgPSBSLmxpZnQoUi5jdXJyeShmdW5jdGlvbihhLCBiLCBjLCBkLCBlKSB7XG4gICAgICogICAgICAgIHJldHVybiBhICsgYiArIGMgKyBkICsgZTtcbiAgICAgKiAgICAgIH0pKTtcbiAgICAgKiAgICAgIG1hZGQ1KFsxLDJdLCBbM10sIFs0LCA1XSwgWzZdLCBbNywgOF0pOyAvLz0+IFsyMSwgMjIsIDIyLCAyMywgMjIsIDIzLCAyMywgMjRdXG4gICAgICovXG4gICAgdmFyIGxpZnQgPSBfY3VycnkxKGZ1bmN0aW9uIGxpZnQoZm4pIHtcbiAgICAgICAgcmV0dXJuIGxpZnROKGZuLmxlbmd0aCwgZm4pO1xuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIG5ldyBmdW5jdGlvbiB0aGF0LCB3aGVuIGludm9rZWQsIGNhY2hlcyB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgYGZuYCBmb3IgYSBnaXZlblxuICAgICAqIGFyZ3VtZW50IHNldCBhbmQgcmV0dXJucyB0aGUgcmVzdWx0LiBTdWJzZXF1ZW50IGNhbGxzIHRvIHRoZSBtZW1vaXplZCBgZm5gIHdpdGggdGhlIHNhbWVcbiAgICAgKiBhcmd1bWVudCBzZXQgd2lsbCBub3QgcmVzdWx0IGluIGFuIGFkZGl0aW9uYWwgY2FsbCB0byBgZm5gOyBpbnN0ZWFkLCB0aGUgY2FjaGVkIHJlc3VsdFxuICAgICAqIGZvciB0aGF0IHNldCBvZiBhcmd1bWVudHMgd2lsbCBiZSByZXR1cm5lZC5cbiAgICAgKlxuICAgICAqIEBmdW5jXG4gICAgICogQG1lbWJlck9mIFJcbiAgICAgKiBAY2F0ZWdvcnkgRnVuY3Rpb25cbiAgICAgKiBAc2lnICgqLi4uIC0+IGEpIC0+ICgqLi4uIC0+IGEpXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGZ1bmN0aW9uIHRvIG1lbW9pemUuXG4gICAgICogQHJldHVybiB7RnVuY3Rpb259IE1lbW9pemVkIHZlcnNpb24gb2YgYGZuYC5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqXG4gICAgICogICAgICB2YXIgY291bnQgPSAwO1xuICAgICAqICAgICAgdmFyIGZhY3RvcmlhbCA9IFIubWVtb2l6ZShmdW5jdGlvbihuKSB7XG4gICAgICogICAgICAgIGNvdW50ICs9IDE7XG4gICAgICogICAgICAgIHJldHVybiBSLnByb2R1Y3QoUi5yYW5nZSgxLCBuICsgMSkpO1xuICAgICAqICAgICAgfSk7XG4gICAgICogICAgICBmYWN0b3JpYWwoNSk7IC8vPT4gMTIwXG4gICAgICogICAgICBmYWN0b3JpYWwoNSk7IC8vPT4gMTIwXG4gICAgICogICAgICBmYWN0b3JpYWwoNSk7IC8vPT4gMTIwXG4gICAgICogICAgICBjb3VudDsgLy89PiAxXG4gICAgICovXG4gICAgdmFyIG1lbW9pemUgPSBfY3VycnkxKGZ1bmN0aW9uIG1lbW9pemUoZm4pIHtcbiAgICAgICAgdmFyIGNhY2hlID0ge307XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIga2V5ID0gdG9TdHJpbmcoYXJndW1lbnRzKTtcbiAgICAgICAgICAgIGlmICghX2hhcyhrZXksIGNhY2hlKSkge1xuICAgICAgICAgICAgICAgIGNhY2hlW2tleV0gPSBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlW2tleV07XG4gICAgICAgIH07XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBSZWFzb25hYmxlIGFuYWxvZyB0byBTUUwgYHNlbGVjdGAgc3RhdGVtZW50LlxuICAgICAqXG4gICAgICogQGZ1bmNcbiAgICAgKiBAbWVtYmVyT2YgUlxuICAgICAqIEBjYXRlZ29yeSBPYmplY3RcbiAgICAgKiBAY2F0ZWdvcnkgUmVsYXRpb25cbiAgICAgKiBAc2lnIFtrXSAtPiBbe2s6IHZ9XSAtPiBbe2s6IHZ9XVxuICAgICAqIEBwYXJhbSB7QXJyYXl9IHByb3BzIFRoZSBwcm9wZXJ0eSBuYW1lcyB0byBwcm9qZWN0XG4gICAgICogQHBhcmFtIHtBcnJheX0gb2JqcyBUaGUgb2JqZWN0cyB0byBxdWVyeVxuICAgICAqIEByZXR1cm4ge0FycmF5fSBBbiBhcnJheSBvZiBvYmplY3RzIHdpdGgganVzdCB0aGUgYHByb3BzYCBwcm9wZXJ0aWVzLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIHZhciBhYmJ5ID0ge25hbWU6ICdBYmJ5JywgYWdlOiA3LCBoYWlyOiAnYmxvbmQnLCBncmFkZTogMn07XG4gICAgICogICAgICB2YXIgZnJlZCA9IHtuYW1lOiAnRnJlZCcsIGFnZTogMTIsIGhhaXI6ICdicm93bicsIGdyYWRlOiA3fTtcbiAgICAgKiAgICAgIHZhciBraWRzID0gW2FiYnksIGZyZWRdO1xuICAgICAqICAgICAgUi5wcm9qZWN0KFsnbmFtZScsICdncmFkZSddLCBraWRzKTsgLy89PiBbe25hbWU6ICdBYmJ5JywgZ3JhZGU6IDJ9LCB7bmFtZTogJ0ZyZWQnLCBncmFkZTogN31dXG4gICAgICovXG4gICAgLy8gcGFzc2luZyBgaWRlbnRpdHlgIGdpdmVzIGNvcnJlY3QgYXJpdHlcbiAgICB2YXIgcHJvamVjdCA9IHVzZVdpdGgoX21hcCwgcGlja0FsbCwgaWRlbnRpdHkpO1xuXG4gICAgLyoqXG4gICAgICogV3JhcHMgYSBjb25zdHJ1Y3RvciBmdW5jdGlvbiBpbnNpZGUgYSBjdXJyaWVkIGZ1bmN0aW9uIHRoYXQgY2FuIGJlIGNhbGxlZCB3aXRoIHRoZSBzYW1lXG4gICAgICogYXJndW1lbnRzIGFuZCByZXR1cm5zIHRoZSBzYW1lIHR5cGUuXG4gICAgICpcbiAgICAgKiBAZnVuY1xuICAgICAqIEBtZW1iZXJPZiBSXG4gICAgICogQGNhdGVnb3J5IEZ1bmN0aW9uXG4gICAgICogQHNpZyAoKiAtPiB7Kn0pIC0+ICgqIC0+IHsqfSlcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBGbiBUaGUgY29uc3RydWN0b3IgZnVuY3Rpb24gdG8gd3JhcC5cbiAgICAgKiBAcmV0dXJuIHtGdW5jdGlvbn0gQSB3cmFwcGVkLCBjdXJyaWVkIGNvbnN0cnVjdG9yIGZ1bmN0aW9uLlxuICAgICAqIEBleGFtcGxlXG4gICAgICpcbiAgICAgKiAgICAgIC8vIENvbnN0cnVjdG9yIGZ1bmN0aW9uXG4gICAgICogICAgICB2YXIgV2lkZ2V0ID0gZnVuY3Rpb24oY29uZmlnKSB7XG4gICAgICogICAgICAgIC8vIC4uLlxuICAgICAqICAgICAgfTtcbiAgICAgKiAgICAgIFdpZGdldC5wcm90b3R5cGUgPSB7XG4gICAgICogICAgICAgIC8vIC4uLlxuICAgICAqICAgICAgfTtcbiAgICAgKiAgICAgIHZhciBhbGxDb25maWdzID0gW1xuICAgICAqICAgICAgICAvLyAuLi5cbiAgICAgKiAgICAgIF07XG4gICAgICogICAgICBSLm1hcChSLmNvbnN0cnVjdChXaWRnZXQpLCBhbGxDb25maWdzKTsgLy8gYSBsaXN0IG9mIFdpZGdldHNcbiAgICAgKi9cbiAgICB2YXIgY29uc3RydWN0ID0gX2N1cnJ5MShmdW5jdGlvbiBjb25zdHJ1Y3QoRm4pIHtcbiAgICAgICAgcmV0dXJuIGNvbnN0cnVjdE4oRm4ubGVuZ3RoLCBGbik7XG4gICAgfSk7XG5cbiAgICB2YXIgUiA9IHtcbiAgICAgICAgRjogRixcbiAgICAgICAgVDogVCxcbiAgICAgICAgX186IF9fLFxuICAgICAgICBhZGQ6IGFkZCxcbiAgICAgICAgYWRkSW5kZXg6IGFkZEluZGV4LFxuICAgICAgICBhZGp1c3Q6IGFkanVzdCxcbiAgICAgICAgYWxsOiBhbGwsXG4gICAgICAgIGFsbFBhc3M6IGFsbFBhc3MsXG4gICAgICAgIGFsd2F5czogYWx3YXlzLFxuICAgICAgICBhbmQ6IGFuZCxcbiAgICAgICAgYW55OiBhbnksXG4gICAgICAgIGFueVBhc3M6IGFueVBhc3MsXG4gICAgICAgIGFwOiBhcCxcbiAgICAgICAgYXBlcnR1cmU6IGFwZXJ0dXJlLFxuICAgICAgICBhcHBlbmQ6IGFwcGVuZCxcbiAgICAgICAgYXBwbHk6IGFwcGx5LFxuICAgICAgICBhcml0eTogYXJpdHksXG4gICAgICAgIGFzc29jOiBhc3NvYyxcbiAgICAgICAgYXNzb2NQYXRoOiBhc3NvY1BhdGgsXG4gICAgICAgIGJpbmFyeTogYmluYXJ5LFxuICAgICAgICBiaW5kOiBiaW5kLFxuICAgICAgICBib3RoOiBib3RoLFxuICAgICAgICBjYWxsOiBjYWxsLFxuICAgICAgICBjaGFpbjogY2hhaW4sXG4gICAgICAgIGNsb25lOiBjbG9uZSxcbiAgICAgICAgY29tbXV0ZTogY29tbXV0ZSxcbiAgICAgICAgY29tbXV0ZU1hcDogY29tbXV0ZU1hcCxcbiAgICAgICAgY29tcGFyYXRvcjogY29tcGFyYXRvcixcbiAgICAgICAgY29tcGxlbWVudDogY29tcGxlbWVudCxcbiAgICAgICAgY29tcG9zZTogY29tcG9zZSxcbiAgICAgICAgY29tcG9zZUw6IGNvbXBvc2VMLFxuICAgICAgICBjb21wb3NlUDogY29tcG9zZVAsXG4gICAgICAgIGNvbmNhdDogY29uY2F0LFxuICAgICAgICBjb25kOiBjb25kLFxuICAgICAgICBjb25zdHJ1Y3Q6IGNvbnN0cnVjdCxcbiAgICAgICAgY29uc3RydWN0TjogY29uc3RydWN0TixcbiAgICAgICAgY29udGFpbnM6IGNvbnRhaW5zLFxuICAgICAgICBjb250YWluc1dpdGg6IGNvbnRhaW5zV2l0aCxcbiAgICAgICAgY29udmVyZ2U6IGNvbnZlcmdlLFxuICAgICAgICBjb3VudEJ5OiBjb3VudEJ5LFxuICAgICAgICBjcmVhdGVNYXBFbnRyeTogY3JlYXRlTWFwRW50cnksXG4gICAgICAgIGN1cnJ5OiBjdXJyeSxcbiAgICAgICAgY3VycnlOOiBjdXJyeU4sXG4gICAgICAgIGRlYzogZGVjLFxuICAgICAgICBkZWZhdWx0VG86IGRlZmF1bHRUbyxcbiAgICAgICAgZGlmZmVyZW5jZTogZGlmZmVyZW5jZSxcbiAgICAgICAgZGlmZmVyZW5jZVdpdGg6IGRpZmZlcmVuY2VXaXRoLFxuICAgICAgICBkaXNzb2M6IGRpc3NvYyxcbiAgICAgICAgZGlzc29jUGF0aDogZGlzc29jUGF0aCxcbiAgICAgICAgZGl2aWRlOiBkaXZpZGUsXG4gICAgICAgIGRyb3A6IGRyb3AsXG4gICAgICAgIGRyb3BSZXBlYXRzOiBkcm9wUmVwZWF0cyxcbiAgICAgICAgZHJvcFJlcGVhdHNXaXRoOiBkcm9wUmVwZWF0c1dpdGgsXG4gICAgICAgIGRyb3BXaGlsZTogZHJvcFdoaWxlLFxuICAgICAgICBlaXRoZXI6IGVpdGhlcixcbiAgICAgICAgZW1wdHk6IGVtcHR5LFxuICAgICAgICBlcTogZXEsXG4gICAgICAgIGVxRGVlcDogZXFEZWVwLFxuICAgICAgICBlcVByb3BzOiBlcVByb3BzLFxuICAgICAgICBlcXVhbHM6IGVxdWFscyxcbiAgICAgICAgZXZvbHZlOiBldm9sdmUsXG4gICAgICAgIGZpbHRlcjogZmlsdGVyLFxuICAgICAgICBmaWx0ZXJJbmRleGVkOiBmaWx0ZXJJbmRleGVkLFxuICAgICAgICBmaW5kOiBmaW5kLFxuICAgICAgICBmaW5kSW5kZXg6IGZpbmRJbmRleCxcbiAgICAgICAgZmluZExhc3Q6IGZpbmRMYXN0LFxuICAgICAgICBmaW5kTGFzdEluZGV4OiBmaW5kTGFzdEluZGV4LFxuICAgICAgICBmbGF0dGVuOiBmbGF0dGVuLFxuICAgICAgICBmbGlwOiBmbGlwLFxuICAgICAgICBmb3JFYWNoOiBmb3JFYWNoLFxuICAgICAgICBmb3JFYWNoSW5kZXhlZDogZm9yRWFjaEluZGV4ZWQsXG4gICAgICAgIGZyb21QYWlyczogZnJvbVBhaXJzLFxuICAgICAgICBmdW5jdGlvbnM6IGZ1bmN0aW9ucyxcbiAgICAgICAgZnVuY3Rpb25zSW46IGZ1bmN0aW9uc0luLFxuICAgICAgICBncm91cEJ5OiBncm91cEJ5LFxuICAgICAgICBndDogZ3QsXG4gICAgICAgIGd0ZTogZ3RlLFxuICAgICAgICBoYXM6IGhhcyxcbiAgICAgICAgaGFzSW46IGhhc0luLFxuICAgICAgICBoZWFkOiBoZWFkLFxuICAgICAgICBpZGVudGljYWw6IGlkZW50aWNhbCxcbiAgICAgICAgaWRlbnRpdHk6IGlkZW50aXR5LFxuICAgICAgICBpZkVsc2U6IGlmRWxzZSxcbiAgICAgICAgaW5jOiBpbmMsXG4gICAgICAgIGluZGV4T2Y6IGluZGV4T2YsXG4gICAgICAgIGluaXQ6IGluaXQsXG4gICAgICAgIGluc2VydDogaW5zZXJ0LFxuICAgICAgICBpbnNlcnRBbGw6IGluc2VydEFsbCxcbiAgICAgICAgaW50ZXJzZWN0aW9uOiBpbnRlcnNlY3Rpb24sXG4gICAgICAgIGludGVyc2VjdGlvbldpdGg6IGludGVyc2VjdGlvbldpdGgsXG4gICAgICAgIGludGVyc3BlcnNlOiBpbnRlcnNwZXJzZSxcbiAgICAgICAgaW50bzogaW50byxcbiAgICAgICAgaW52ZXJ0OiBpbnZlcnQsXG4gICAgICAgIGludmVydE9iajogaW52ZXJ0T2JqLFxuICAgICAgICBpbnZva2U6IGludm9rZSxcbiAgICAgICAgaW52b2tlcjogaW52b2tlcixcbiAgICAgICAgaXM6IGlzLFxuICAgICAgICBpc0FycmF5TGlrZTogaXNBcnJheUxpa2UsXG4gICAgICAgIGlzRW1wdHk6IGlzRW1wdHksXG4gICAgICAgIGlzTmlsOiBpc05pbCxcbiAgICAgICAgaXNTZXQ6IGlzU2V0LFxuICAgICAgICBqb2luOiBqb2luLFxuICAgICAgICBrZXlzOiBrZXlzLFxuICAgICAgICBrZXlzSW46IGtleXNJbixcbiAgICAgICAgbGFzdDogbGFzdCxcbiAgICAgICAgbGFzdEluZGV4T2Y6IGxhc3RJbmRleE9mLFxuICAgICAgICBsZW5ndGg6IGxlbmd0aCxcbiAgICAgICAgbGVuczogbGVucyxcbiAgICAgICAgbGVuc0luZGV4OiBsZW5zSW5kZXgsXG4gICAgICAgIGxlbnNPbjogbGVuc09uLFxuICAgICAgICBsZW5zUHJvcDogbGVuc1Byb3AsXG4gICAgICAgIGxpZnQ6IGxpZnQsXG4gICAgICAgIGxpZnROOiBsaWZ0TixcbiAgICAgICAgbHQ6IGx0LFxuICAgICAgICBsdGU6IGx0ZSxcbiAgICAgICAgbWFwOiBtYXAsXG4gICAgICAgIG1hcEFjY3VtOiBtYXBBY2N1bSxcbiAgICAgICAgbWFwQWNjdW1SaWdodDogbWFwQWNjdW1SaWdodCxcbiAgICAgICAgbWFwSW5kZXhlZDogbWFwSW5kZXhlZCxcbiAgICAgICAgbWFwT2JqOiBtYXBPYmosXG4gICAgICAgIG1hcE9iakluZGV4ZWQ6IG1hcE9iakluZGV4ZWQsXG4gICAgICAgIG1hdGNoOiBtYXRjaCxcbiAgICAgICAgbWF0aE1vZDogbWF0aE1vZCxcbiAgICAgICAgbWF4OiBtYXgsXG4gICAgICAgIG1heEJ5OiBtYXhCeSxcbiAgICAgICAgbWVhbjogbWVhbixcbiAgICAgICAgbWVkaWFuOiBtZWRpYW4sXG4gICAgICAgIG1lbW9pemU6IG1lbW9pemUsXG4gICAgICAgIG1lcmdlOiBtZXJnZSxcbiAgICAgICAgbWVyZ2VBbGw6IG1lcmdlQWxsLFxuICAgICAgICBtaW46IG1pbixcbiAgICAgICAgbWluQnk6IG1pbkJ5LFxuICAgICAgICBtb2R1bG86IG1vZHVsbyxcbiAgICAgICAgbXVsdGlwbHk6IG11bHRpcGx5LFxuICAgICAgICBuQXJ5OiBuQXJ5LFxuICAgICAgICBuZWdhdGU6IG5lZ2F0ZSxcbiAgICAgICAgbm9uZTogbm9uZSxcbiAgICAgICAgbm90OiBub3QsXG4gICAgICAgIG50aDogbnRoLFxuICAgICAgICBudGhBcmc6IG50aEFyZyxcbiAgICAgICAgbnRoQ2hhcjogbnRoQ2hhcixcbiAgICAgICAgbnRoQ2hhckNvZGU6IG50aENoYXJDb2RlLFxuICAgICAgICBvZjogb2YsXG4gICAgICAgIG9taXQ6IG9taXQsXG4gICAgICAgIG9uY2U6IG9uY2UsXG4gICAgICAgIG9yOiBvcixcbiAgICAgICAgcGFydGlhbDogcGFydGlhbCxcbiAgICAgICAgcGFydGlhbFJpZ2h0OiBwYXJ0aWFsUmlnaHQsXG4gICAgICAgIHBhcnRpdGlvbjogcGFydGl0aW9uLFxuICAgICAgICBwYXRoOiBwYXRoLFxuICAgICAgICBwYXRoRXE6IHBhdGhFcSxcbiAgICAgICAgcGljazogcGljayxcbiAgICAgICAgcGlja0FsbDogcGlja0FsbCxcbiAgICAgICAgcGlja0J5OiBwaWNrQnksXG4gICAgICAgIHBpcGU6IHBpcGUsXG4gICAgICAgIHBpcGVMOiBwaXBlTCxcbiAgICAgICAgcGlwZVA6IHBpcGVQLFxuICAgICAgICBwbHVjazogcGx1Y2ssXG4gICAgICAgIHByZXBlbmQ6IHByZXBlbmQsXG4gICAgICAgIHByb2R1Y3Q6IHByb2R1Y3QsXG4gICAgICAgIHByb2plY3Q6IHByb2plY3QsXG4gICAgICAgIHByb3A6IHByb3AsXG4gICAgICAgIHByb3BFcTogcHJvcEVxLFxuICAgICAgICBwcm9wT3I6IHByb3BPcixcbiAgICAgICAgcHJvcHM6IHByb3BzLFxuICAgICAgICByYW5nZTogcmFuZ2UsXG4gICAgICAgIHJlZHVjZTogcmVkdWNlLFxuICAgICAgICByZWR1Y2VJbmRleGVkOiByZWR1Y2VJbmRleGVkLFxuICAgICAgICByZWR1Y2VSaWdodDogcmVkdWNlUmlnaHQsXG4gICAgICAgIHJlZHVjZVJpZ2h0SW5kZXhlZDogcmVkdWNlUmlnaHRJbmRleGVkLFxuICAgICAgICByZWR1Y2VkOiByZWR1Y2VkLFxuICAgICAgICByZWplY3Q6IHJlamVjdCxcbiAgICAgICAgcmVqZWN0SW5kZXhlZDogcmVqZWN0SW5kZXhlZCxcbiAgICAgICAgcmVtb3ZlOiByZW1vdmUsXG4gICAgICAgIHJlcGVhdDogcmVwZWF0LFxuICAgICAgICByZXBsYWNlOiByZXBsYWNlLFxuICAgICAgICByZXZlcnNlOiByZXZlcnNlLFxuICAgICAgICBzY2FuOiBzY2FuLFxuICAgICAgICBzbGljZTogc2xpY2UsXG4gICAgICAgIHNvcnQ6IHNvcnQsXG4gICAgICAgIHNvcnRCeTogc29ydEJ5LFxuICAgICAgICBzcGxpdDogc3BsaXQsXG4gICAgICAgIHN0ckluZGV4T2Y6IHN0ckluZGV4T2YsXG4gICAgICAgIHN0ckxhc3RJbmRleE9mOiBzdHJMYXN0SW5kZXhPZixcbiAgICAgICAgc3Vic3RyaW5nOiBzdWJzdHJpbmcsXG4gICAgICAgIHN1YnN0cmluZ0Zyb206IHN1YnN0cmluZ0Zyb20sXG4gICAgICAgIHN1YnN0cmluZ1RvOiBzdWJzdHJpbmdUbyxcbiAgICAgICAgc3VidHJhY3Q6IHN1YnRyYWN0LFxuICAgICAgICBzdW06IHN1bSxcbiAgICAgICAgdGFpbDogdGFpbCxcbiAgICAgICAgdGFrZTogdGFrZSxcbiAgICAgICAgdGFrZVdoaWxlOiB0YWtlV2hpbGUsXG4gICAgICAgIHRhcDogdGFwLFxuICAgICAgICB0ZXN0OiB0ZXN0LFxuICAgICAgICB0aW1lczogdGltZXMsXG4gICAgICAgIHRvTG93ZXI6IHRvTG93ZXIsXG4gICAgICAgIHRvUGFpcnM6IHRvUGFpcnMsXG4gICAgICAgIHRvUGFpcnNJbjogdG9QYWlyc0luLFxuICAgICAgICB0b1N0cmluZzogdG9TdHJpbmcsXG4gICAgICAgIHRvVXBwZXI6IHRvVXBwZXIsXG4gICAgICAgIHRyYW5zZHVjZTogdHJhbnNkdWNlLFxuICAgICAgICB0cmltOiB0cmltLFxuICAgICAgICB0eXBlOiB0eXBlLFxuICAgICAgICB1bmFwcGx5OiB1bmFwcGx5LFxuICAgICAgICB1bmFyeTogdW5hcnksXG4gICAgICAgIHVuY3VycnlOOiB1bmN1cnJ5TixcbiAgICAgICAgdW5mb2xkOiB1bmZvbGQsXG4gICAgICAgIHVuaW9uOiB1bmlvbixcbiAgICAgICAgdW5pb25XaXRoOiB1bmlvbldpdGgsXG4gICAgICAgIHVuaXE6IHVuaXEsXG4gICAgICAgIHVuaXFXaXRoOiB1bmlxV2l0aCxcbiAgICAgICAgdW5uZXN0OiB1bm5lc3QsXG4gICAgICAgIHVwZGF0ZTogdXBkYXRlLFxuICAgICAgICB1c2VXaXRoOiB1c2VXaXRoLFxuICAgICAgICB2YWx1ZXM6IHZhbHVlcyxcbiAgICAgICAgdmFsdWVzSW46IHZhbHVlc0luLFxuICAgICAgICB3aGVyZTogd2hlcmUsXG4gICAgICAgIHdoZXJlRXE6IHdoZXJlRXEsXG4gICAgICAgIHdyYXA6IHdyYXAsXG4gICAgICAgIHhwcm9kOiB4cHJvZCxcbiAgICAgICAgemlwOiB6aXAsXG4gICAgICAgIHppcE9iajogemlwT2JqLFxuICAgICAgICB6aXBXaXRoOiB6aXBXaXRoXG4gICAgfTtcblxuICAvKiBURVNUX0VOVFJZX1BPSU5UICovXG5cbiAgaWYgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jykge1xuICAgIG1vZHVsZS5leHBvcnRzID0gUjtcbiAgfSBlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICBkZWZpbmUoZnVuY3Rpb24oKSB7IHJldHVybiBSOyB9KTtcbiAgfSBlbHNlIHtcbiAgICB0aGlzLlIgPSBSO1xuICB9XG5cbn0uY2FsbCh0aGlzKSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIFZpcnR1YWxBdWRpb0dyYXBoID0gcmVxdWlyZShcIi4uL3NyYy9pbmRleC5qc1wiKTtcbnZhciBhdWRpb0NvbnRleHQgPSBuZXcgQXVkaW9Db250ZXh0KCk7XG5cbmRlc2NyaWJlKFwiVmlydHVhbEF1ZGlvR3JhcGhcIiwgZnVuY3Rpb24gKCkge1xuICBpdChcIm9wdGlvbmFsbHkgdGFrZXMgYXVkaW9Db250ZXh0IHByb3BlcnR5XCIsIGZ1bmN0aW9uICgpIHtcbiAgICBleHBlY3QobmV3IFZpcnR1YWxBdWRpb0dyYXBoKHsgYXVkaW9Db250ZXh0OiBhdWRpb0NvbnRleHQgfSkuYXVkaW9Db250ZXh0KS50b0JlKGF1ZGlvQ29udGV4dCk7XG4gICAgZXhwZWN0KG5ldyBWaXJ0dWFsQXVkaW9HcmFwaCgpLmF1ZGlvQ29udGV4dCBpbnN0YW5jZW9mIEF1ZGlvQ29udGV4dCkudG9CZSh0cnVlKTtcbiAgfSk7XG5cbiAgaXQoXCJvcHRpb25hbGx5IHRha2VzIG91dHB1dCBwYXJhbWV0ZXJcIiwgZnVuY3Rpb24gKCkge1xuICAgIGV4cGVjdChuZXcgVmlydHVhbEF1ZGlvR3JhcGgoe1xuICAgICAgb3V0cHV0OiBhdWRpb0NvbnRleHQuZGVzdGluYXRpb25cbiAgICB9KS5vdXRwdXQpLnRvQmUoYXVkaW9Db250ZXh0LmRlc3RpbmF0aW9uKTtcbiAgICBleHBlY3QobmV3IFZpcnR1YWxBdWRpb0dyYXBoKHsgYXVkaW9Db250ZXh0OiBhdWRpb0NvbnRleHQgfSkub3V0cHV0KS50b0JlKGF1ZGlvQ29udGV4dC5kZXN0aW5hdGlvbik7XG4gIH0pO1xufSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk5b2IyMWxMMkl2WkdWMkwzWnBjblIxWVd3dFlYVmthVzh0WjNKaGNHZ3ZjM0JsWXk5V2FYSjBkV0ZzUVhWa2FXOUhjbUZ3YUM1cWN5SmRMQ0p1WVcxbGN5STZXMTBzSW0xaGNIQnBibWR6SWpvaU96dEJRVUZCTEVsQlFVMHNhVUpCUVdsQ0xFZEJRVWNzVDBGQlR5eERRVUZETEdsQ1FVRnBRaXhEUVVGRExFTkJRVU03UVVGRGNrUXNTVUZCVFN4WlFVRlpMRWRCUVVjc1NVRkJTU3haUVVGWkxFVkJRVVVzUTBGQlF6czdRVUZGZUVNc1VVRkJVU3hEUVVGRExHMUNRVUZ0UWl4RlFVRkZMRmxCUVUwN1FVRkRiRU1zU1VGQlJTeERRVUZETEhkRFFVRjNReXhGUVVGRkxGbEJRVTA3UVVGRGFrUXNWVUZCVFN4RFFVRkRMRWxCUVVrc2FVSkJRV2xDTEVOQlFVTXNSVUZCUXl4WlFVRlpMRVZCUVZvc1dVRkJXU3hGUVVGRExFTkJRVU1zUTBGQlF5eFpRVUZaTEVOQlFVTXNRMEZCUXl4SlFVRkpMRU5CUVVNc1dVRkJXU3hEUVVGRExFTkJRVU03UVVGRE9VVXNWVUZCVFN4RFFVRkRMRWxCUVVrc2FVSkJRV2xDTEVWQlFVVXNRMEZCUXl4WlFVRlpMRmxCUVZrc1dVRkJXU3hEUVVGRExFTkJRVU1zU1VGQlNTeERRVUZETEVsQlFVa3NRMEZCUXl4RFFVRkRPMGRCUTJwR0xFTkJRVU1zUTBGQlF6czdRVUZGU0N4SlFVRkZMRU5CUVVNc2JVTkJRVzFETEVWQlFVVXNXVUZCVFR0QlFVTTFReXhWUVVGTkxFTkJRVU1zU1VGQlNTeHBRa0ZCYVVJc1EwRkJRenRCUVVNelFpeFpRVUZOTEVWQlFVVXNXVUZCV1N4RFFVRkRMRmRCUVZjN1MwRkRha01zUTBGQlF5eERRVUZETEUxQlFVMHNRMEZCUXl4RFFVRkRMRWxCUVVrc1EwRkJReXhaUVVGWkxFTkJRVU1zVjBGQlZ5eERRVUZETEVOQlFVTTdRVUZETVVNc1ZVRkJUU3hEUVVGRExFbEJRVWtzYVVKQlFXbENMRU5CUVVNc1JVRkJReXhaUVVGWkxFVkJRVm9zV1VGQldTeEZRVUZETEVOQlFVTXNRMEZCUXl4TlFVRk5MRU5CUVVNc1EwRkJReXhKUVVGSkxFTkJRVU1zV1VGQldTeERRVUZETEZkQlFWY3NRMEZCUXl4RFFVRkRPMGRCUTNKR0xFTkJRVU1zUTBGQlF6dERRVU5LTEVOQlFVTXNRMEZCUXlJc0ltWnBiR1VpT2lJdmFHOXRaUzlpTDJSbGRpOTJhWEowZFdGc0xXRjFaR2x2TFdkeVlYQm9MM053WldNdlZtbHlkSFZoYkVGMVpHbHZSM0poY0dndWFuTWlMQ0p6YjNWeVkyVnpRMjl1ZEdWdWRDSTZXeUpqYjI1emRDQldhWEowZFdGc1FYVmthVzlIY21Gd2FDQTlJSEpsY1hWcGNtVW9KeTR1TDNOeVl5OXBibVJsZUM1cWN5Y3BPMXh1WTI5dWMzUWdZWFZrYVc5RGIyNTBaWGgwSUQwZ2JtVjNJRUYxWkdsdlEyOXVkR1Y0ZENncE8xeHVYRzVrWlhOamNtbGlaU2hjSWxacGNuUjFZV3hCZFdScGIwZHlZWEJvWENJc0lDZ3BJRDArSUh0Y2JpQWdhWFFvWENKdmNIUnBiMjVoYkd4NUlIUmhhMlZ6SUdGMVpHbHZRMjl1ZEdWNGRDQndjbTl3WlhKMGVWd2lMQ0FvS1NBOVBpQjdYRzRnSUNBZ1pYaHdaV04wS0c1bGR5QldhWEowZFdGc1FYVmthVzlIY21Gd2FDaDdZWFZrYVc5RGIyNTBaWGgwZlNrdVlYVmthVzlEYjI1MFpYaDBLUzUwYjBKbEtHRjFaR2x2UTI5dWRHVjRkQ2s3WEc0Z0lDQWdaWGh3WldOMEtHNWxkeUJXYVhKMGRXRnNRWFZrYVc5SGNtRndhQ2dwTG1GMVpHbHZRMjl1ZEdWNGRDQnBibk4wWVc1alpXOW1JRUYxWkdsdlEyOXVkR1Y0ZENrdWRHOUNaU2gwY25WbEtUdGNiaUFnZlNrN1hHNWNiaUFnYVhRb1hDSnZjSFJwYjI1aGJHeDVJSFJoYTJWeklHOTFkSEIxZENCd1lYSmhiV1YwWlhKY0lpd2dLQ2tnUFQ0Z2UxeHVJQ0FnSUdWNGNHVmpkQ2h1WlhjZ1ZtbHlkSFZoYkVGMVpHbHZSM0poY0dnb2UxeHVJQ0FnSUNBZ2IzVjBjSFYwT2lCaGRXUnBiME52Ym5SbGVIUXVaR1Z6ZEdsdVlYUnBiMjRzWEc0Z0lDQWdmU2t1YjNWMGNIVjBLUzUwYjBKbEtHRjFaR2x2UTI5dWRHVjRkQzVrWlhOMGFXNWhkR2x2YmlrN1hHNGdJQ0FnWlhod1pXTjBLRzVsZHlCV2FYSjBkV0ZzUVhWa2FXOUhjbUZ3YUNoN1lYVmthVzlEYjI1MFpYaDBmU2t1YjNWMGNIVjBLUzUwYjBKbEtHRjFaR2x2UTI5dWRHVjRkQzVrWlhOMGFXNWhkR2x2YmlrN1hHNGdJSDBwTzF4dWZTazdYRzRpWFgwPSIsIlwidXNlIHN0cmljdFwiO1xuXG5XZWJBdWRpb1Rlc3RBUEkuc2V0U3RhdGUoXCJBdWRpb0NvbnRleHQjY3JlYXRlU3RlcmVvUGFubmVyXCIsIFwiZW5hYmxlZFwiKTtcbnJlcXVpcmUoXCIuL1ZpcnR1YWxBdWRpb0dyYXBoXCIpO1xucmVxdWlyZShcIi4vdmlydHVhbEF1ZGlvR3JhcGguZGVmaW5lTm9kZVwiKTtcbnJlcXVpcmUoXCIuL3ZpcnR1YWxBdWRpb0dyYXBoLnVwZGF0ZVwiKTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTlvYjIxbEwySXZaR1YyTDNacGNuUjFZV3d0WVhWa2FXOHRaM0poY0dndmMzQmxZeTlwYm1SbGVDNXFjeUpkTENKdVlXMWxjeUk2VzEwc0ltMWhjSEJwYm1keklqb2lPenRCUVVGQkxHVkJRV1VzUTBGQlF5eFJRVUZSTEVOQlFVTXNhVU5CUVdsRExFVkJRVVVzVTBGQlV5eERRVUZETEVOQlFVTTdRVUZEZGtVc1QwRkJUeXhEUVVGRExIRkNRVUZ4UWl4RFFVRkRMRU5CUVVNN1FVRkRMMElzVDBGQlR5eERRVUZETEdkRFFVRm5ReXhEUVVGRExFTkJRVU03UVVGRE1VTXNUMEZCVHl4RFFVRkRMRFJDUVVFMFFpeERRVUZETEVOQlFVTWlMQ0ptYVd4bElqb2lMMmh2YldVdllpOWtaWFl2ZG1seWRIVmhiQzFoZFdScGJ5MW5jbUZ3YUM5emNHVmpMMmx1WkdWNExtcHpJaXdpYzI5MWNtTmxjME52Ym5SbGJuUWlPbHNpVjJWaVFYVmthVzlVWlhOMFFWQkpMbk5sZEZOMFlYUmxLRndpUVhWa2FXOURiMjUwWlhoMEkyTnlaV0YwWlZOMFpYSmxiMUJoYm01bGNsd2lMQ0JjSW1WdVlXSnNaV1JjSWlrN1hHNXlaWEYxYVhKbEtDY3VMMVpwY25SMVlXeEJkV1JwYjBkeVlYQm9KeWs3WEc1eVpYRjFhWEpsS0NjdUwzWnBjblIxWVd4QmRXUnBiMGR5WVhCb0xtUmxabWx1WlU1dlpHVW5LVHRjYm5KbGNYVnBjbVVvSnk0dmRtbHlkSFZoYkVGMVpHbHZSM0poY0dndWRYQmtZWFJsSnlrN1hHNGlYWDA9IiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIHBhcmFtcyA9IGFyZ3VtZW50c1swXSA9PT0gdW5kZWZpbmVkID8ge30gOiBhcmd1bWVudHNbMF07XG4gIHZhciBkZWNheSA9IHBhcmFtcy5kZWNheTtcbiAgdmFyIGRlbGF5VGltZSA9IHBhcmFtcy5kZWxheVRpbWU7XG4gIHZhciBtYXhEZWxheVRpbWUgPSBwYXJhbXMubWF4RGVsYXlUaW1lO1xuXG4gIGRlY2F5ID0gZGVjYXkgIT09IHVuZGVmaW5lZCA/IGRlY2F5IDogMSAvIDM7XG4gIGRlbGF5VGltZSA9IGRlbGF5VGltZSAhPT0gdW5kZWZpbmVkID8gZGVsYXlUaW1lIDogMSAvIDM7XG4gIG1heERlbGF5VGltZSA9IG1heERlbGF5VGltZSAhPT0gdW5kZWZpbmVkID8gbWF4RGVsYXlUaW1lIDogMSAvIDM7XG5cbiAgcmV0dXJuIFt7XG4gICAgaWQ6IDAsXG4gICAgbm9kZTogJ3N0ZXJlb1Bhbm5lcicsXG4gICAgb3V0cHV0OiAnb3V0cHV0JyxcbiAgICBwYXJhbXM6IHtcbiAgICAgIHBhbjogLTFcbiAgICB9XG4gIH0sIHtcbiAgICBpZDogMSxcbiAgICBub2RlOiAnc3RlcmVvUGFubmVyJyxcbiAgICBvdXRwdXQ6ICdvdXRwdXQnLFxuICAgIHBhcmFtczoge1xuICAgICAgcGFuOiAxXG4gICAgfVxuICB9LCB7XG4gICAgaWQ6IDIsXG4gICAgbm9kZTogJ2RlbGF5JyxcbiAgICBvdXRwdXQ6IFsxLCA1XSxcbiAgICBwYXJhbXM6IHtcbiAgICAgIG1heERlbGF5VGltZTogbWF4RGVsYXlUaW1lLFxuICAgICAgZGVsYXlUaW1lOiBkZWxheVRpbWVcbiAgICB9XG4gIH0sIHtcbiAgICBpZDogMyxcbiAgICBub2RlOiAnZ2FpbicsXG4gICAgb3V0cHV0OiAyLFxuICAgIHBhcmFtczoge1xuICAgICAgZ2FpbjogZGVjYXlcbiAgICB9XG4gIH0sIHtcbiAgICBpZDogNCxcbiAgICBub2RlOiAnZGVsYXknLFxuICAgIG91dHB1dDogWzAsIDNdLFxuICAgIHBhcmFtczoge1xuICAgICAgbWF4RGVsYXlUaW1lOiBtYXhEZWxheVRpbWUsXG4gICAgICBkZWxheVRpbWU6IGRlbGF5VGltZVxuICAgIH1cbiAgfSwge1xuICAgIGlkOiA1LFxuICAgIGlucHV0OiAnaW5wdXQnLFxuICAgIG5vZGU6ICdnYWluJyxcbiAgICBvdXRwdXQ6IDQsXG4gICAgcGFyYW1zOiB7XG4gICAgICBnYWluOiBkZWNheVxuICAgIH1cbiAgfV07XG59O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklpOW9iMjFsTDJJdlpHVjJMM1pwY25SMVlXd3RZWFZrYVc4dFozSmhjR2d2YzNCbFl5OTBiMjlzY3k5d2FXNW5VRzl1WjBSbGJHRjVVR0Z5WVcxelJtRmpkRzl5ZVM1cWN5SmRMQ0p1WVcxbGN5STZXMTBzSW0xaGNIQnBibWR6SWpvaU96dEJRVUZCTEUxQlFVMHNRMEZCUXl4UFFVRlBMRWRCUVVjc1dVRkJhVUk3VFVGQmFFSXNUVUZCVFN4blEwRkJSeXhGUVVGRk8wMUJRM1JDTEV0QlFVc3NSMEZCTmtJc1RVRkJUU3hEUVVGNFF5eExRVUZMTzAxQlFVVXNVMEZCVXl4SFFVRnJRaXhOUVVGTkxFTkJRV3BETEZOQlFWTTdUVUZCUlN4WlFVRlpMRWRCUVVrc1RVRkJUU3hEUVVGMFFpeFpRVUZaT3p0QlFVTnVReXhQUVVGTExFZEJRVWNzUzBGQlN5eExRVUZMTEZOQlFWTXNSMEZCUnl4TFFVRkxMRWRCUVVjc1EwRkJReXhIUVVGSExFTkJRVU1zUTBGQlF6dEJRVU0xUXl4WFFVRlRMRWRCUVVjc1UwRkJVeXhMUVVGTExGTkJRVk1zUjBGQlJ5eFRRVUZUTEVkQlFVY3NRMEZCUXl4SFFVRkhMRU5CUVVNc1EwRkJRenRCUVVONFJDeGpRVUZaTEVkQlFVY3NXVUZCV1N4TFFVRkxMRk5CUVZNc1IwRkJSeXhaUVVGWkxFZEJRVWNzUTBGQlF5eEhRVUZITEVOQlFVTXNRMEZCUXpzN1FVRkZha1VzVTBGQlR5eERRVU5NTzBGQlEwVXNUVUZCUlN4RlFVRkZMRU5CUVVNN1FVRkRUQ3hSUVVGSkxFVkJRVVVzWTBGQll6dEJRVU53UWl4VlFVRk5MRVZCUVVVc1VVRkJVVHRCUVVOb1FpeFZRVUZOTEVWQlFVVTdRVUZEVGl4VFFVRkhMRVZCUVVVc1EwRkJReXhEUVVGRE8wdEJRMUk3UjBGRFJpeEZRVU5FTzBGQlEwVXNUVUZCUlN4RlFVRkZMRU5CUVVNN1FVRkRUQ3hSUVVGSkxFVkJRVVVzWTBGQll6dEJRVU53UWl4VlFVRk5MRVZCUVVVc1VVRkJVVHRCUVVOb1FpeFZRVUZOTEVWQlFVVTdRVUZEVGl4VFFVRkhMRVZCUVVVc1EwRkJRenRMUVVOUU8wZEJRMFlzUlVGRFJEdEJRVU5GTEUxQlFVVXNSVUZCUlN4RFFVRkRPMEZCUTB3c1VVRkJTU3hGUVVGRkxFOUJRVTg3UVVGRFlpeFZRVUZOTEVWQlFVVXNRMEZCUXl4RFFVRkRMRVZCUVVVc1EwRkJReXhEUVVGRE8wRkJRMlFzVlVGQlRTeEZRVUZGTzBGQlEwNHNhMEpCUVZrc1JVRkJXaXhaUVVGWk8wRkJRMW9zWlVGQlV5eEZRVUZVTEZOQlFWTTdTMEZEVmp0SFFVTkdMRVZCUTBRN1FVRkRSU3hOUVVGRkxFVkJRVVVzUTBGQlF6dEJRVU5NTEZGQlFVa3NSVUZCUlN4TlFVRk5PMEZCUTFvc1ZVRkJUU3hGUVVGRkxFTkJRVU03UVVGRFZDeFZRVUZOTEVWQlFVVTdRVUZEVGl4VlFVRkpMRVZCUVVVc1MwRkJTenRMUVVOYU8wZEJRMFlzUlVGRFJEdEJRVU5GTEUxQlFVVXNSVUZCUlN4RFFVRkRPMEZCUTB3c1VVRkJTU3hGUVVGRkxFOUJRVTg3UVVGRFlpeFZRVUZOTEVWQlFVVXNRMEZCUXl4RFFVRkRMRVZCUVVVc1EwRkJReXhEUVVGRE8wRkJRMlFzVlVGQlRTeEZRVUZGTzBGQlEwNHNhMEpCUVZrc1JVRkJXaXhaUVVGWk8wRkJRMW9zWlVGQlV5eEZRVUZVTEZOQlFWTTdTMEZEVmp0SFFVTkdMRVZCUTBRN1FVRkRSU3hOUVVGRkxFVkJRVVVzUTBGQlF6dEJRVU5NTEZOQlFVc3NSVUZCUlN4UFFVRlBPMEZCUTJRc1VVRkJTU3hGUVVGRkxFMUJRVTA3UVVGRFdpeFZRVUZOTEVWQlFVVXNRMEZCUXp0QlFVTlVMRlZCUVUwc1JVRkJSVHRCUVVOT0xGVkJRVWtzUlVGQlJTeExRVUZMTzB0QlExbzdSMEZEUml4RFFVTkdMRU5CUVVNN1EwRkRTQ3hEUVVGRElpd2labWxzWlNJNklpOW9iMjFsTDJJdlpHVjJMM1pwY25SMVlXd3RZWFZrYVc4dFozSmhjR2d2YzNCbFl5OTBiMjlzY3k5d2FXNW5VRzl1WjBSbGJHRjVVR0Z5WVcxelJtRmpkRzl5ZVM1cWN5SXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJJbTF2WkhWc1pTNWxlSEJ2Y25SeklEMGdLSEJoY21GdGN5QTlJSHQ5S1NBOVBpQjdYRzRnSUd4bGRDQjdaR1ZqWVhrc0lHUmxiR0Y1VkdsdFpTd2diV0Y0UkdWc1lYbFVhVzFsZlNBOUlIQmhjbUZ0Y3p0Y2JpQWdaR1ZqWVhrZ1BTQmtaV05oZVNBaFBUMGdkVzVrWldacGJtVmtJRDhnWkdWallYa2dPaUF4SUM4Z016dGNiaUFnWkdWc1lYbFVhVzFsSUQwZ1pHVnNZWGxVYVcxbElDRTlQU0IxYm1SbFptbHVaV1FnUHlCa1pXeGhlVlJwYldVZ09pQXhJQzhnTXp0Y2JpQWdiV0Y0UkdWc1lYbFVhVzFsSUQwZ2JXRjRSR1ZzWVhsVWFXMWxJQ0U5UFNCMWJtUmxabWx1WldRZ1B5QnRZWGhFWld4aGVWUnBiV1VnT2lBeElDOGdNenRjYmx4dUlDQnlaWFIxY200Z1cxeHVJQ0FnSUh0Y2JpQWdJQ0FnSUdsa09pQXdMRnh1SUNBZ0lDQWdibTlrWlRvZ0ozTjBaWEpsYjFCaGJtNWxjaWNzWEc0Z0lDQWdJQ0J2ZFhSd2RYUTZJQ2R2ZFhSd2RYUW5MRnh1SUNBZ0lDQWdjR0Z5WVcxek9pQjdYRzRnSUNBZ0lDQWdJSEJoYmpvZ0xURXNYRzRnSUNBZ0lDQjlYRzRnSUNBZ2ZTeGNiaUFnSUNCN1hHNGdJQ0FnSUNCcFpEb2dNU3hjYmlBZ0lDQWdJRzV2WkdVNklDZHpkR1Z5Wlc5UVlXNXVaWEluTEZ4dUlDQWdJQ0FnYjNWMGNIVjBPaUFuYjNWMGNIVjBKeXhjYmlBZ0lDQWdJSEJoY21GdGN6b2dlMXh1SUNBZ0lDQWdJQ0J3WVc0NklERXNYRzRnSUNBZ0lDQjlYRzRnSUNBZ2ZTeGNiaUFnSUNCN1hHNGdJQ0FnSUNCcFpEb2dNaXhjYmlBZ0lDQWdJRzV2WkdVNklDZGtaV3hoZVNjc1hHNGdJQ0FnSUNCdmRYUndkWFE2SUZzeExDQTFYU3hjYmlBZ0lDQWdJSEJoY21GdGN6b2dlMXh1SUNBZ0lDQWdJQ0J0WVhoRVpXeGhlVlJwYldVc1hHNGdJQ0FnSUNBZ0lHUmxiR0Y1VkdsdFpTeGNiaUFnSUNBZ0lIMHNYRzRnSUNBZ2ZTeGNiaUFnSUNCN1hHNGdJQ0FnSUNCcFpEb2dNeXhjYmlBZ0lDQWdJRzV2WkdVNklDZG5ZV2x1Snl4Y2JpQWdJQ0FnSUc5MWRIQjFkRG9nTWl4Y2JpQWdJQ0FnSUhCaGNtRnRjem9nZTF4dUlDQWdJQ0FnSUNCbllXbHVPaUJrWldOaGVTeGNiaUFnSUNBZ0lIMWNiaUFnSUNCOUxGeHVJQ0FnSUh0Y2JpQWdJQ0FnSUdsa09pQTBMRnh1SUNBZ0lDQWdibTlrWlRvZ0oyUmxiR0Y1Snl4Y2JpQWdJQ0FnSUc5MWRIQjFkRG9nV3pBc0lETmRMRnh1SUNBZ0lDQWdjR0Z5WVcxek9pQjdYRzRnSUNBZ0lDQWdJRzFoZUVSbGJHRjVWR2x0WlN4Y2JpQWdJQ0FnSUNBZ1pHVnNZWGxVYVcxbExGeHVJQ0FnSUNBZ2ZTeGNiaUFnSUNCOUxGeHVJQ0FnSUh0Y2JpQWdJQ0FnSUdsa09pQTFMRnh1SUNBZ0lDQWdhVzV3ZFhRNklDZHBibkIxZENjc1hHNGdJQ0FnSUNCdWIyUmxPaUFuWjJGcGJpY3NYRzRnSUNBZ0lDQnZkWFJ3ZFhRNklEUXNYRzRnSUNBZ0lDQndZWEpoYlhNNklIdGNiaUFnSUNBZ0lDQWdaMkZwYmpvZ1pHVmpZWGtzWEc0Z0lDQWdJQ0I5WEc0Z0lDQWdmU3hjYmlBZ1hUdGNibjA3WEc0aVhYMD0iLCIndXNlIHN0cmljdCc7XG5cbnZhciBfcmVxdWlyZSA9IHJlcXVpcmUoJ3JhbWRhJyk7XG5cbnZhciBlcXVhbHMgPSBfcmVxdWlyZS5lcXVhbHM7XG5cbnZhciBWaXJ0dWFsQXVkaW9HcmFwaCA9IHJlcXVpcmUoJy4uL3NyYy9pbmRleC5qcycpO1xudmFyIHBpbmdQb25nRGVsYXlQYXJhbXNGYWN0b3J5ID0gcmVxdWlyZSgnLi90b29scy9waW5nUG9uZ0RlbGF5UGFyYW1zRmFjdG9yeScpO1xuXG5kZXNjcmliZSgndmlydHVhbEF1ZGlvR3JhcGguZGVmaW5lTm9kZScsIGZ1bmN0aW9uICgpIHtcbiAgdmFyIGF1ZGlvQ29udGV4dCA9IHVuZGVmaW5lZDtcbiAgdmFyIHZpcnR1YWxBdWRpb0dyYXBoID0gdW5kZWZpbmVkO1xuXG4gIGJlZm9yZUVhY2goZnVuY3Rpb24gKCkge1xuICAgIGF1ZGlvQ29udGV4dCA9IG5ldyBBdWRpb0NvbnRleHQoKTtcbiAgICB2aXJ0dWFsQXVkaW9HcmFwaCA9IG5ldyBWaXJ0dWFsQXVkaW9HcmFwaCh7XG4gICAgICBhdWRpb0NvbnRleHQ6IGF1ZGlvQ29udGV4dCxcbiAgICAgIG91dHB1dDogYXVkaW9Db250ZXh0LmRlc3RpbmF0aW9uXG4gICAgfSk7XG4gIH0pO1xuXG4gIGl0KCdyZXR1cm5zIGl0c2VsZicsIGZ1bmN0aW9uICgpIHtcbiAgICBleHBlY3QodmlydHVhbEF1ZGlvR3JhcGguZGVmaW5lTm9kZShwaW5nUG9uZ0RlbGF5UGFyYW1zRmFjdG9yeSwgJ3BpbmdQb25nRGVsYXknKSkudG9CZSh2aXJ0dWFsQXVkaW9HcmFwaCk7XG4gIH0pO1xuXG4gIGl0KCd0aHJvd3MgaWYgbmFtZSBwcm92aWRlZCBpcyBhIHN0YW5kYXJkIG5vZGUnLCBmdW5jdGlvbiAoKSB7XG4gICAgZXhwZWN0KGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiB2aXJ0dWFsQXVkaW9HcmFwaC5kZWZpbmVOb2RlKHBpbmdQb25nRGVsYXlQYXJhbXNGYWN0b3J5LCAnZ2FpbicpO1xuICAgIH0pLnRvVGhyb3coKTtcbiAgfSk7XG5cbiAgaXQoJ2NyZWF0ZXMgYSBjdXN0b20gbm9kZSBpbnRlcm5hbGx5JywgZnVuY3Rpb24gKCkge1xuICAgIHZpcnR1YWxBdWRpb0dyYXBoLmRlZmluZU5vZGUocGluZ1BvbmdEZWxheVBhcmFtc0ZhY3RvcnksICdwaW5nUG9uZ0RlbGF5Jyk7XG5cbiAgICBleHBlY3QodHlwZW9mIHZpcnR1YWxBdWRpb0dyYXBoLmN1c3RvbU5vZGVzLnBpbmdQb25nRGVsYXkpLnRvQmUoJ2Z1bmN0aW9uJyk7XG4gIH0pO1xuXG4gIGl0KCdjcmVhdGVzIGEgY3VzdG9tIG5vZGUgd2hpY2ggY2FuIGJlIHJldXNlZCBpbiB2aXJ0dWFsQXVkaW9HcmFwaC51cGRhdGUnLCBmdW5jdGlvbiAoKSB7XG4gICAgdmlydHVhbEF1ZGlvR3JhcGguZGVmaW5lTm9kZShwaW5nUG9uZ0RlbGF5UGFyYW1zRmFjdG9yeSwgJ3BpbmdQb25nRGVsYXknKTtcblxuICAgIHZhciB2aXJ0dWFsTm9kZVBhcmFtcyA9IFt7XG4gICAgICBpZDogMCxcbiAgICAgIG5vZGU6ICdnYWluJyxcbiAgICAgIG91dHB1dDogJ291dHB1dCcsXG4gICAgICBwYXJhbXM6IHtcbiAgICAgICAgZ2FpbjogMC41XG4gICAgICB9XG4gICAgfSwge1xuICAgICAgaWQ6IDEsXG4gICAgICBub2RlOiAncGluZ1BvbmdEZWxheScsXG4gICAgICBvdXRwdXQ6IDAsXG4gICAgICBwYXJhbXM6IHtcbiAgICAgICAgZGVjYXk6IDAuNSxcbiAgICAgICAgZGVsYXlUaW1lOiAwLjUsXG4gICAgICAgIG1heERlbGF5VGltZTogMC41XG4gICAgICB9XG4gICAgfSwge1xuICAgICAgaWQ6IDIsXG4gICAgICBub2RlOiAnb3NjaWxsYXRvcicsXG4gICAgICBvdXRwdXQ6IDFcbiAgICB9XTtcblxuICAgIGV4cGVjdCh2aXJ0dWFsQXVkaW9HcmFwaC51cGRhdGUodmlydHVhbE5vZGVQYXJhbXMpKS50b0JlKHZpcnR1YWxBdWRpb0dyYXBoKTtcbiAgICBleHBlY3QoZXF1YWxzKGF1ZGlvQ29udGV4dC50b0pTT04oKSwgeyAnbmFtZSc6ICdBdWRpb0Rlc3RpbmF0aW9uTm9kZScsICdpbnB1dHMnOiBbeyAnbmFtZSc6ICdHYWluTm9kZScsICdnYWluJzogeyAndmFsdWUnOiAwLjUsICdpbnB1dHMnOiBbXSB9LCAnaW5wdXRzJzogW3sgJ25hbWUnOiAnU3RlcmVvUGFubmVyTm9kZScsICdwYW4nOiB7ICd2YWx1ZSc6IC0xLCAnaW5wdXRzJzogW10gfSwgJ2lucHV0cyc6IFt7ICduYW1lJzogJ0RlbGF5Tm9kZScsICdkZWxheVRpbWUnOiB7ICd2YWx1ZSc6IDAuNSwgJ2lucHV0cyc6IFtdIH0sICdpbnB1dHMnOiBbeyAnbmFtZSc6ICdHYWluTm9kZScsICdnYWluJzogeyAndmFsdWUnOiAwLjUsICdpbnB1dHMnOiBbXSB9LCAnaW5wdXRzJzogW3sgJ25hbWUnOiAnRGVsYXlOb2RlJywgJ2RlbGF5VGltZSc6IHsgJ3ZhbHVlJzogMC41LCAnaW5wdXRzJzogW10gfSwgJ2lucHV0cyc6IFt7ICduYW1lJzogJ0dhaW5Ob2RlJywgJ2dhaW4nOiB7ICd2YWx1ZSc6IDAuNSwgJ2lucHV0cyc6IFtdIH0sICdpbnB1dHMnOiBbJzxjaXJjdWxhcjpEZWxheU5vZGU+J10gfV0gfSwgeyAnbmFtZSc6ICdPc2NpbGxhdG9yTm9kZScsICd0eXBlJzogJ3NpbmUnLCAnZnJlcXVlbmN5JzogeyAndmFsdWUnOiA0NDAsICdpbnB1dHMnOiBbXSB9LCAnZGV0dW5lJzogeyAndmFsdWUnOiAwLCAnaW5wdXRzJzogW10gfSwgJ2lucHV0cyc6IFtdIH1dIH1dIH1dIH0sIHsgJ25hbWUnOiAnU3RlcmVvUGFubmVyTm9kZScsICdwYW4nOiB7ICd2YWx1ZSc6IDEsICdpbnB1dHMnOiBbXSB9LCAnaW5wdXRzJzogW3sgJ25hbWUnOiAnRGVsYXlOb2RlJywgJ2RlbGF5VGltZSc6IHsgJ3ZhbHVlJzogMC41LCAnaW5wdXRzJzogW10gfSwgJ2lucHV0cyc6IFt7ICduYW1lJzogJ0dhaW5Ob2RlJywgJ2dhaW4nOiB7ICd2YWx1ZSc6IDAuNSwgJ2lucHV0cyc6IFtdIH0sICdpbnB1dHMnOiBbeyAnbmFtZSc6ICdEZWxheU5vZGUnLCAnZGVsYXlUaW1lJzogeyAndmFsdWUnOiAwLjUsICdpbnB1dHMnOiBbXSB9LCAnaW5wdXRzJzogW3sgJ25hbWUnOiAnR2Fpbk5vZGUnLCAnZ2Fpbic6IHsgJ3ZhbHVlJzogMC41LCAnaW5wdXRzJzogW10gfSwgJ2lucHV0cyc6IFsnPGNpcmN1bGFyOkRlbGF5Tm9kZT4nLCB7ICduYW1lJzogJ09zY2lsbGF0b3JOb2RlJywgJ3R5cGUnOiAnc2luZScsICdmcmVxdWVuY3knOiB7ICd2YWx1ZSc6IDQ0MCwgJ2lucHV0cyc6IFtdIH0sICdkZXR1bmUnOiB7ICd2YWx1ZSc6IDAsICdpbnB1dHMnOiBbXSB9LCAnaW5wdXRzJzogW10gfV0gfV0gfV0gfV0gfV0gfV0gfV0gfSkpLnRvQmUodHJ1ZSk7XG4gIH0pO1xuXG4gIGl0KCdjYW4gZGVmaW5lIGEgY3VzdG9tIG5vZGUgYnVpbHQgb2Ygb3RoZXIgY3VzdG9tIG5vZGVzJywgZnVuY3Rpb24gKCkge1xuICAgIHZpcnR1YWxBdWRpb0dyYXBoLmRlZmluZU5vZGUocGluZ1BvbmdEZWxheVBhcmFtc0ZhY3RvcnksICdwaW5nUG9uZ0RlbGF5Jyk7XG5cbiAgICB2YXIgcXVpZXRwaW5nUG9uZ0RlbGF5UGFyYW1zRmFjdG9yeSA9IGZ1bmN0aW9uIHF1aWV0cGluZ1BvbmdEZWxheVBhcmFtc0ZhY3RvcnkoKSB7XG4gICAgICByZXR1cm4gW3tcbiAgICAgICAgaWQ6IDAsXG4gICAgICAgIG5vZGU6ICdnYWluJyxcbiAgICAgICAgb3V0cHV0OiAnb3V0cHV0J1xuICAgICAgfSwge1xuICAgICAgICBpZDogMSxcbiAgICAgICAgbm9kZTogJ3BpbmdQb25nRGVsYXknLFxuICAgICAgICBvdXRwdXQ6IDBcbiAgICAgIH0sIHtcbiAgICAgICAgaWQ6IDIsXG4gICAgICAgIG5vZGU6ICdvc2NpbGxhdG9yJyxcbiAgICAgICAgb3V0cHV0OiAxXG4gICAgICB9XTtcbiAgICB9O1xuXG4gICAgdmlydHVhbEF1ZGlvR3JhcGguZGVmaW5lTm9kZShxdWlldHBpbmdQb25nRGVsYXlQYXJhbXNGYWN0b3J5LCAncXVpZXRQaW5nUG9uZ0RlbGF5Jyk7XG5cbiAgICB2YXIgdmlydHVhbE5vZGVQYXJhbXMgPSBbe1xuICAgICAgaWQ6IDAsXG4gICAgICBub2RlOiAnZ2FpbicsXG4gICAgICBvdXRwdXQ6ICdvdXRwdXQnLFxuICAgICAgcGFyYW1zOiB7XG4gICAgICAgIGdhaW46IDAuNVxuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIGlkOiAxLFxuICAgICAgbm9kZTogJ3F1aWV0UGluZ1BvbmdEZWxheScsXG4gICAgICBvdXRwdXQ6IDBcbiAgICB9LCB7XG4gICAgICBpZDogMixcbiAgICAgIG5vZGU6ICdwaW5nUG9uZ0RlbGF5JyxcbiAgICAgIG91dHB1dDogMVxuICAgIH0sIHtcbiAgICAgIGlkOiAzLFxuICAgICAgbm9kZTogJ29zY2lsbGF0b3InLFxuICAgICAgb3V0cHV0OiAyXG4gICAgfV07XG5cbiAgICBleHBlY3QodmlydHVhbEF1ZGlvR3JhcGgudXBkYXRlKHZpcnR1YWxOb2RlUGFyYW1zKSkudG9CZSh2aXJ0dWFsQXVkaW9HcmFwaCk7XG4gICAgZXhwZWN0KGVxdWFscyhhdWRpb0NvbnRleHQudG9KU09OKCksIHsgJ25hbWUnOiAnQXVkaW9EZXN0aW5hdGlvbk5vZGUnLCAnaW5wdXRzJzogW3sgJ25hbWUnOiAnR2Fpbk5vZGUnLCAnZ2Fpbic6IHsgJ3ZhbHVlJzogMC41LCAnaW5wdXRzJzogW10gfSwgJ2lucHV0cyc6IFt7ICduYW1lJzogJ0dhaW5Ob2RlJywgJ2dhaW4nOiB7ICd2YWx1ZSc6IDEsICdpbnB1dHMnOiBbXSB9LCAnaW5wdXRzJzogW3sgJ25hbWUnOiAnU3RlcmVvUGFubmVyTm9kZScsICdwYW4nOiB7ICd2YWx1ZSc6IC0xLCAnaW5wdXRzJzogW10gfSwgJ2lucHV0cyc6IFt7ICduYW1lJzogJ0RlbGF5Tm9kZScsICdkZWxheVRpbWUnOiB7ICd2YWx1ZSc6IDAuMzMzMzMzMzMzMzMzMzMzMywgJ2lucHV0cyc6IFtdIH0sICdpbnB1dHMnOiBbeyAnbmFtZSc6ICdHYWluTm9kZScsICdnYWluJzogeyAndmFsdWUnOiAwLjMzMzMzMzMzMzMzMzMzMzMsICdpbnB1dHMnOiBbXSB9LCAnaW5wdXRzJzogW3sgJ25hbWUnOiAnRGVsYXlOb2RlJywgJ2RlbGF5VGltZSc6IHsgJ3ZhbHVlJzogMC4zMzMzMzMzMzMzMzMzMzMzLCAnaW5wdXRzJzogW10gfSwgJ2lucHV0cyc6IFt7ICduYW1lJzogJ0dhaW5Ob2RlJywgJ2dhaW4nOiB7ICd2YWx1ZSc6IDAuMzMzMzMzMzMzMzMzMzMzMywgJ2lucHV0cyc6IFtdIH0sICdpbnB1dHMnOiBbJzxjaXJjdWxhcjpEZWxheU5vZGU+J10gfV0gfSwgeyAnbmFtZSc6ICdPc2NpbGxhdG9yTm9kZScsICd0eXBlJzogJ3NpbmUnLCAnZnJlcXVlbmN5JzogeyAndmFsdWUnOiA0NDAsICdpbnB1dHMnOiBbXSB9LCAnZGV0dW5lJzogeyAndmFsdWUnOiAwLCAnaW5wdXRzJzogW10gfSwgJ2lucHV0cyc6IFtdIH1dIH1dIH1dIH0sIHsgJ25hbWUnOiAnU3RlcmVvUGFubmVyTm9kZScsICdwYW4nOiB7ICd2YWx1ZSc6IDEsICdpbnB1dHMnOiBbXSB9LCAnaW5wdXRzJzogW3sgJ25hbWUnOiAnRGVsYXlOb2RlJywgJ2RlbGF5VGltZSc6IHsgJ3ZhbHVlJzogMC4zMzMzMzMzMzMzMzMzMzMzLCAnaW5wdXRzJzogW10gfSwgJ2lucHV0cyc6IFt7ICduYW1lJzogJ0dhaW5Ob2RlJywgJ2dhaW4nOiB7ICd2YWx1ZSc6IDAuMzMzMzMzMzMzMzMzMzMzMywgJ2lucHV0cyc6IFtdIH0sICdpbnB1dHMnOiBbeyAnbmFtZSc6ICdEZWxheU5vZGUnLCAnZGVsYXlUaW1lJzogeyAndmFsdWUnOiAwLjMzMzMzMzMzMzMzMzMzMzMsICdpbnB1dHMnOiBbXSB9LCAnaW5wdXRzJzogW3sgJ25hbWUnOiAnR2Fpbk5vZGUnLCAnZ2Fpbic6IHsgJ3ZhbHVlJzogMC4zMzMzMzMzMzMzMzMzMzMzLCAnaW5wdXRzJzogW10gfSwgJ2lucHV0cyc6IFsnPGNpcmN1bGFyOkRlbGF5Tm9kZT4nLCB7ICduYW1lJzogJ09zY2lsbGF0b3JOb2RlJywgJ3R5cGUnOiAnc2luZScsICdmcmVxdWVuY3knOiB7ICd2YWx1ZSc6IDQ0MCwgJ2lucHV0cyc6IFtdIH0sICdkZXR1bmUnOiB7ICd2YWx1ZSc6IDAsICdpbnB1dHMnOiBbXSB9LCAnaW5wdXRzJzogW10gfV0gfV0gfV0gfV0gfV0gfV0gfV0gfV0gfSkpLnRvQmUodHJ1ZSk7XG4gIH0pO1xuXG4gIGl0KCdjYW4gZGVmaW5lIGEgY3VzdG9tIG5vZGUgd2hpY2ggY2FuIGJlIHVwZGF0ZWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgdmlydHVhbEF1ZGlvR3JhcGguZGVmaW5lTm9kZShwaW5nUG9uZ0RlbGF5UGFyYW1zRmFjdG9yeSwgJ3BpbmdQb25nRGVsYXknKTtcblxuICAgIHZhciB2aXJ0dWFsTm9kZVBhcmFtcyA9IFt7XG4gICAgICBpZDogMCxcbiAgICAgIG5vZGU6ICdnYWluJyxcbiAgICAgIG91dHB1dDogJ291dHB1dCcsXG4gICAgICBwYXJhbXM6IHtcbiAgICAgICAgZ2FpbjogMC41XG4gICAgICB9XG4gICAgfSwge1xuICAgICAgaWQ6IDEsXG4gICAgICBub2RlOiAncGluZ1BvbmdEZWxheScsXG4gICAgICBvdXRwdXQ6IDAsXG4gICAgICBwYXJhbXM6IHtcbiAgICAgICAgZGVjYXk6IDAuNSxcbiAgICAgICAgZGVsYXlUaW1lOiAwLjUsXG4gICAgICAgIG1heERlbGF5VGltZTogMC41XG4gICAgICB9XG4gICAgfSwge1xuICAgICAgaWQ6IDIsXG4gICAgICBub2RlOiAnb3NjaWxsYXRvcicsXG4gICAgICBvdXRwdXQ6IDFcbiAgICB9XTtcblxuICAgIHZpcnR1YWxBdWRpb0dyYXBoLnVwZGF0ZSh2aXJ0dWFsTm9kZVBhcmFtcyk7XG5cbiAgICBleHBlY3QoZXF1YWxzKGF1ZGlvQ29udGV4dC50b0pTT04oKSwgeyAnbmFtZSc6ICdBdWRpb0Rlc3RpbmF0aW9uTm9kZScsICdpbnB1dHMnOiBbeyAnbmFtZSc6ICdHYWluTm9kZScsICdnYWluJzogeyAndmFsdWUnOiAwLjUsICdpbnB1dHMnOiBbXSB9LCAnaW5wdXRzJzogW3sgJ25hbWUnOiAnU3RlcmVvUGFubmVyTm9kZScsICdwYW4nOiB7ICd2YWx1ZSc6IC0xLCAnaW5wdXRzJzogW10gfSwgJ2lucHV0cyc6IFt7ICduYW1lJzogJ0RlbGF5Tm9kZScsICdkZWxheVRpbWUnOiB7ICd2YWx1ZSc6IDAuNSwgJ2lucHV0cyc6IFtdIH0sICdpbnB1dHMnOiBbeyAnbmFtZSc6ICdHYWluTm9kZScsICdnYWluJzogeyAndmFsdWUnOiAwLjUsICdpbnB1dHMnOiBbXSB9LCAnaW5wdXRzJzogW3sgJ25hbWUnOiAnRGVsYXlOb2RlJywgJ2RlbGF5VGltZSc6IHsgJ3ZhbHVlJzogMC41LCAnaW5wdXRzJzogW10gfSwgJ2lucHV0cyc6IFt7ICduYW1lJzogJ0dhaW5Ob2RlJywgJ2dhaW4nOiB7ICd2YWx1ZSc6IDAuNSwgJ2lucHV0cyc6IFtdIH0sICdpbnB1dHMnOiBbJzxjaXJjdWxhcjpEZWxheU5vZGU+J10gfV0gfSwgeyAnbmFtZSc6ICdPc2NpbGxhdG9yTm9kZScsICd0eXBlJzogJ3NpbmUnLCAnZnJlcXVlbmN5JzogeyAndmFsdWUnOiA0NDAsICdpbnB1dHMnOiBbXSB9LCAnZGV0dW5lJzogeyAndmFsdWUnOiAwLCAnaW5wdXRzJzogW10gfSwgJ2lucHV0cyc6IFtdIH1dIH1dIH1dIH0sIHsgJ25hbWUnOiAnU3RlcmVvUGFubmVyTm9kZScsICdwYW4nOiB7ICd2YWx1ZSc6IDEsICdpbnB1dHMnOiBbXSB9LCAnaW5wdXRzJzogW3sgJ25hbWUnOiAnRGVsYXlOb2RlJywgJ2RlbGF5VGltZSc6IHsgJ3ZhbHVlJzogMC41LCAnaW5wdXRzJzogW10gfSwgJ2lucHV0cyc6IFt7ICduYW1lJzogJ0dhaW5Ob2RlJywgJ2dhaW4nOiB7ICd2YWx1ZSc6IDAuNSwgJ2lucHV0cyc6IFtdIH0sICdpbnB1dHMnOiBbeyAnbmFtZSc6ICdEZWxheU5vZGUnLCAnZGVsYXlUaW1lJzogeyAndmFsdWUnOiAwLjUsICdpbnB1dHMnOiBbXSB9LCAnaW5wdXRzJzogW3sgJ25hbWUnOiAnR2Fpbk5vZGUnLCAnZ2Fpbic6IHsgJ3ZhbHVlJzogMC41LCAnaW5wdXRzJzogW10gfSwgJ2lucHV0cyc6IFsnPGNpcmN1bGFyOkRlbGF5Tm9kZT4nLCB7ICduYW1lJzogJ09zY2lsbGF0b3JOb2RlJywgJ3R5cGUnOiAnc2luZScsICdmcmVxdWVuY3knOiB7ICd2YWx1ZSc6IDQ0MCwgJ2lucHV0cyc6IFtdIH0sICdkZXR1bmUnOiB7ICd2YWx1ZSc6IDAsICdpbnB1dHMnOiBbXSB9LCAnaW5wdXRzJzogW10gfV0gfV0gfV0gfV0gfV0gfV0gfV0gfSkpLnRvQmUodHJ1ZSk7XG5cbiAgICB2aXJ0dWFsTm9kZVBhcmFtc1sxXS5wYXJhbXMuZGVjYXkgPSAwLjY7XG5cbiAgICB2aXJ0dWFsQXVkaW9HcmFwaC51cGRhdGUodmlydHVhbE5vZGVQYXJhbXMpO1xuXG4gICAgZXhwZWN0KGVxdWFscyhhdWRpb0NvbnRleHQudG9KU09OKCksIHsgJ25hbWUnOiAnQXVkaW9EZXN0aW5hdGlvbk5vZGUnLCAnaW5wdXRzJzogW3sgJ25hbWUnOiAnR2Fpbk5vZGUnLCAnZ2Fpbic6IHsgJ3ZhbHVlJzogMC41LCAnaW5wdXRzJzogW10gfSwgJ2lucHV0cyc6IFt7ICduYW1lJzogJ1N0ZXJlb1Bhbm5lck5vZGUnLCAncGFuJzogeyAndmFsdWUnOiAtMSwgJ2lucHV0cyc6IFtdIH0sICdpbnB1dHMnOiBbeyAnbmFtZSc6ICdEZWxheU5vZGUnLCAnZGVsYXlUaW1lJzogeyAndmFsdWUnOiAwLjUsICdpbnB1dHMnOiBbXSB9LCAnaW5wdXRzJzogW3sgJ25hbWUnOiAnR2Fpbk5vZGUnLCAnZ2Fpbic6IHsgJ3ZhbHVlJzogMC42LCAnaW5wdXRzJzogW10gfSwgJ2lucHV0cyc6IFt7ICduYW1lJzogJ0RlbGF5Tm9kZScsICdkZWxheVRpbWUnOiB7ICd2YWx1ZSc6IDAuNSwgJ2lucHV0cyc6IFtdIH0sICdpbnB1dHMnOiBbeyAnbmFtZSc6ICdHYWluTm9kZScsICdnYWluJzogeyAndmFsdWUnOiAwLjYsICdpbnB1dHMnOiBbXSB9LCAnaW5wdXRzJzogWyc8Y2lyY3VsYXI6RGVsYXlOb2RlPiddIH1dIH0sIHsgJ25hbWUnOiAnT3NjaWxsYXRvck5vZGUnLCAndHlwZSc6ICdzaW5lJywgJ2ZyZXF1ZW5jeSc6IHsgJ3ZhbHVlJzogNDQwLCAnaW5wdXRzJzogW10gfSwgJ2RldHVuZSc6IHsgJ3ZhbHVlJzogMCwgJ2lucHV0cyc6IFtdIH0sICdpbnB1dHMnOiBbXSB9XSB9XSB9XSB9LCB7ICduYW1lJzogJ1N0ZXJlb1Bhbm5lck5vZGUnLCAncGFuJzogeyAndmFsdWUnOiAxLCAnaW5wdXRzJzogW10gfSwgJ2lucHV0cyc6IFt7ICduYW1lJzogJ0RlbGF5Tm9kZScsICdkZWxheVRpbWUnOiB7ICd2YWx1ZSc6IDAuNSwgJ2lucHV0cyc6IFtdIH0sICdpbnB1dHMnOiBbeyAnbmFtZSc6ICdHYWluTm9kZScsICdnYWluJzogeyAndmFsdWUnOiAwLjYsICdpbnB1dHMnOiBbXSB9LCAnaW5wdXRzJzogW3sgJ25hbWUnOiAnRGVsYXlOb2RlJywgJ2RlbGF5VGltZSc6IHsgJ3ZhbHVlJzogMC41LCAnaW5wdXRzJzogW10gfSwgJ2lucHV0cyc6IFt7ICduYW1lJzogJ0dhaW5Ob2RlJywgJ2dhaW4nOiB7ICd2YWx1ZSc6IDAuNiwgJ2lucHV0cyc6IFtdIH0sICdpbnB1dHMnOiBbJzxjaXJjdWxhcjpEZWxheU5vZGU+JywgeyAnbmFtZSc6ICdPc2NpbGxhdG9yTm9kZScsICd0eXBlJzogJ3NpbmUnLCAnZnJlcXVlbmN5JzogeyAndmFsdWUnOiA0NDAsICdpbnB1dHMnOiBbXSB9LCAnZGV0dW5lJzogeyAndmFsdWUnOiAwLCAnaW5wdXRzJzogW10gfSwgJ2lucHV0cyc6IFtdIH1dIH1dIH1dIH1dIH1dIH1dIH1dIH0pKS50b0JlKHRydWUpO1xuICB9KTtcblxuICBpdCgnY2FuIGRlZmluZSBhIGN1c3RvbSBub2RlIHdoaWNoIGNhbiBiZSByZW1vdmVkJywgZnVuY3Rpb24gKCkge1xuICAgIHZpcnR1YWxBdWRpb0dyYXBoLmRlZmluZU5vZGUocGluZ1BvbmdEZWxheVBhcmFtc0ZhY3RvcnksICdwaW5nUG9uZ0RlbGF5Jyk7XG5cbiAgICB2YXIgdmlydHVhbE5vZGVQYXJhbXMgPSBbe1xuICAgICAgaWQ6IDAsXG4gICAgICBub2RlOiAnZ2FpbicsXG4gICAgICBvdXRwdXQ6ICdvdXRwdXQnLFxuICAgICAgcGFyYW1zOiB7XG4gICAgICAgIGdhaW46IDAuNVxuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIGlkOiAxLFxuICAgICAgbm9kZTogJ3BpbmdQb25nRGVsYXknLFxuICAgICAgb3V0cHV0OiAwLFxuICAgICAgcGFyYW1zOiB7XG4gICAgICAgIGRlY2F5OiAwLjUsXG4gICAgICAgIGRlbGF5VGltZTogMC41LFxuICAgICAgICBtYXhEZWxheVRpbWU6IDAuNVxuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIGlkOiAyLFxuICAgICAgbm9kZTogJ29zY2lsbGF0b3InLFxuICAgICAgb3V0cHV0OiAxXG4gICAgfV07XG5cbiAgICB2aXJ0dWFsQXVkaW9HcmFwaC51cGRhdGUodmlydHVhbE5vZGVQYXJhbXMpO1xuXG4gICAgZXhwZWN0KGVxdWFscyhhdWRpb0NvbnRleHQudG9KU09OKCksIHsgJ25hbWUnOiAnQXVkaW9EZXN0aW5hdGlvbk5vZGUnLCAnaW5wdXRzJzogW3sgJ25hbWUnOiAnR2Fpbk5vZGUnLCAnZ2Fpbic6IHsgJ3ZhbHVlJzogMC41LCAnaW5wdXRzJzogW10gfSwgJ2lucHV0cyc6IFt7ICduYW1lJzogJ1N0ZXJlb1Bhbm5lck5vZGUnLCAncGFuJzogeyAndmFsdWUnOiAtMSwgJ2lucHV0cyc6IFtdIH0sICdpbnB1dHMnOiBbeyAnbmFtZSc6ICdEZWxheU5vZGUnLCAnZGVsYXlUaW1lJzogeyAndmFsdWUnOiAwLjUsICdpbnB1dHMnOiBbXSB9LCAnaW5wdXRzJzogW3sgJ25hbWUnOiAnR2Fpbk5vZGUnLCAnZ2Fpbic6IHsgJ3ZhbHVlJzogMC41LCAnaW5wdXRzJzogW10gfSwgJ2lucHV0cyc6IFt7ICduYW1lJzogJ0RlbGF5Tm9kZScsICdkZWxheVRpbWUnOiB7ICd2YWx1ZSc6IDAuNSwgJ2lucHV0cyc6IFtdIH0sICdpbnB1dHMnOiBbeyAnbmFtZSc6ICdHYWluTm9kZScsICdnYWluJzogeyAndmFsdWUnOiAwLjUsICdpbnB1dHMnOiBbXSB9LCAnaW5wdXRzJzogWyc8Y2lyY3VsYXI6RGVsYXlOb2RlPiddIH1dIH0sIHsgJ25hbWUnOiAnT3NjaWxsYXRvck5vZGUnLCAndHlwZSc6ICdzaW5lJywgJ2ZyZXF1ZW5jeSc6IHsgJ3ZhbHVlJzogNDQwLCAnaW5wdXRzJzogW10gfSwgJ2RldHVuZSc6IHsgJ3ZhbHVlJzogMCwgJ2lucHV0cyc6IFtdIH0sICdpbnB1dHMnOiBbXSB9XSB9XSB9XSB9LCB7ICduYW1lJzogJ1N0ZXJlb1Bhbm5lck5vZGUnLCAncGFuJzogeyAndmFsdWUnOiAxLCAnaW5wdXRzJzogW10gfSwgJ2lucHV0cyc6IFt7ICduYW1lJzogJ0RlbGF5Tm9kZScsICdkZWxheVRpbWUnOiB7ICd2YWx1ZSc6IDAuNSwgJ2lucHV0cyc6IFtdIH0sICdpbnB1dHMnOiBbeyAnbmFtZSc6ICdHYWluTm9kZScsICdnYWluJzogeyAndmFsdWUnOiAwLjUsICdpbnB1dHMnOiBbXSB9LCAnaW5wdXRzJzogW3sgJ25hbWUnOiAnRGVsYXlOb2RlJywgJ2RlbGF5VGltZSc6IHsgJ3ZhbHVlJzogMC41LCAnaW5wdXRzJzogW10gfSwgJ2lucHV0cyc6IFt7ICduYW1lJzogJ0dhaW5Ob2RlJywgJ2dhaW4nOiB7ICd2YWx1ZSc6IDAuNSwgJ2lucHV0cyc6IFtdIH0sICdpbnB1dHMnOiBbJzxjaXJjdWxhcjpEZWxheU5vZGU+JywgeyAnbmFtZSc6ICdPc2NpbGxhdG9yTm9kZScsICd0eXBlJzogJ3NpbmUnLCAnZnJlcXVlbmN5JzogeyAndmFsdWUnOiA0NDAsICdpbnB1dHMnOiBbXSB9LCAnZGV0dW5lJzogeyAndmFsdWUnOiAwLCAnaW5wdXRzJzogW10gfSwgJ2lucHV0cyc6IFtdIH1dIH1dIH1dIH1dIH1dIH1dIH1dIH0pKS50b0JlKHRydWUpO1xuXG4gICAgdmlydHVhbE5vZGVQYXJhbXNbMV0ucGFyYW1zLmRlY2F5ID0gMC42O1xuXG4gICAgdmlydHVhbEF1ZGlvR3JhcGgudXBkYXRlKFt7XG4gICAgICBpZDogMCxcbiAgICAgIG5vZGU6ICdnYWluJyxcbiAgICAgIG91dHB1dDogJ291dHB1dCcsXG4gICAgICBwYXJhbXM6IHtcbiAgICAgICAgZ2FpbjogMC41XG4gICAgICB9XG4gICAgfV0pO1xuXG4gICAgZXhwZWN0KGVxdWFscyhhdWRpb0NvbnRleHQudG9KU09OKCksIHsgJ25hbWUnOiAnQXVkaW9EZXN0aW5hdGlvbk5vZGUnLCAnaW5wdXRzJzogW3sgJ25hbWUnOiAnR2Fpbk5vZGUnLCAnZ2Fpbic6IHsgJ3ZhbHVlJzogMC41LCAnaW5wdXRzJzogW10gfSwgJ2lucHV0cyc6IFtdIH1dIH0pKS50b0JlKHRydWUpO1xuICB9KTtcbn0pO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklpOW9iMjFsTDJJdlpHVjJMM1pwY25SMVlXd3RZWFZrYVc4dFozSmhjR2d2YzNCbFl5OTJhWEowZFdGc1FYVmthVzlIY21Gd2FDNWtaV1pwYm1WT2IyUmxMbXB6SWwwc0ltNWhiV1Z6SWpwYlhTd2liV0Z3Y0dsdVozTWlPaUk3TzJWQlFXbENMRTlCUVU4c1EwRkJReXhQUVVGUExFTkJRVU03TzBsQlFURkNMRTFCUVUwc1dVRkJUaXhOUVVGTk96dEJRVU5pTEVsQlFVMHNhVUpCUVdsQ0xFZEJRVWNzVDBGQlR5eERRVUZETEdsQ1FVRnBRaXhEUVVGRExFTkJRVU03UVVGRGNrUXNTVUZCVFN3d1FrRkJNRUlzUjBGQlJ5eFBRVUZQTEVOQlFVTXNiME5CUVc5RExFTkJRVU1zUTBGQlF6czdRVUZGYWtZc1VVRkJVU3hEUVVGRExEaENRVUU0UWl4RlFVRkZMRmxCUVUwN1FVRkROME1zVFVGQlNTeFpRVUZaTEZsQlFVRXNRMEZCUXp0QlFVTnFRaXhOUVVGSkxHbENRVUZwUWl4WlFVRkJMRU5CUVVNN08wRkJSWFJDTEZsQlFWVXNRMEZCUXl4WlFVRk5PMEZCUTJZc1owSkJRVmtzUjBGQlJ5eEpRVUZKTEZsQlFWa3NSVUZCUlN4RFFVRkRPMEZCUTJ4RExIRkNRVUZwUWl4SFFVRkhMRWxCUVVrc2FVSkJRV2xDTEVOQlFVTTdRVUZEZUVNc2EwSkJRVmtzUlVGQldpeFpRVUZaTzBGQlExb3NXVUZCVFN4RlFVRkZMRmxCUVZrc1EwRkJReXhYUVVGWE8wdEJRMnBETEVOQlFVTXNRMEZCUXp0SFFVTktMRU5CUVVNc1EwRkJRenM3UVVGRlNDeEpRVUZGTEVOQlFVTXNaMEpCUVdkQ0xFVkJRVVVzV1VGQlRUdEJRVU42UWl4VlFVRk5MRU5CUVVNc2FVSkJRV2xDTEVOQlFVTXNWVUZCVlN4RFFVRkRMREJDUVVFd1FpeEZRVUZGTEdWQlFXVXNRMEZCUXl4RFFVRkRMRU5CUVVNc1NVRkJTU3hEUVVGRExHbENRVUZwUWl4RFFVRkRMRU5CUVVNN1IwRkRNMGNzUTBGQlF5eERRVUZET3p0QlFVVklMRWxCUVVVc1EwRkJReXcwUTBGQk5FTXNSVUZCUlN4WlFVRk5PMEZCUTNKRUxGVkJRVTBzUTBGQlF6dGhRVUZOTEdsQ1FVRnBRaXhEUVVGRExGVkJRVlVzUTBGQlF5d3dRa0ZCTUVJc1JVRkJSU3hOUVVGTkxFTkJRVU03UzBGQlFTeERRVUZETEVOQlFVTXNUMEZCVHl4RlFVRkZMRU5CUVVNN1IwRkRNVVlzUTBGQlF5eERRVUZET3p0QlFVVklMRWxCUVVVc1EwRkJReXhyUTBGQmEwTXNSVUZCUlN4WlFVRk5PMEZCUXpORExIRkNRVUZwUWl4RFFVRkRMRlZCUVZVc1EwRkJReXd3UWtGQk1FSXNSVUZCUlN4bFFVRmxMRU5CUVVNc1EwRkJRenM3UVVGRk1VVXNWVUZCVFN4RFFVRkRMRTlCUVU4c2FVSkJRV2xDTEVOQlFVTXNWMEZCVnl4RFFVRkRMR0ZCUVdFc1EwRkJReXhEUVVGRExFbEJRVWtzUTBGQlF5eFZRVUZWTEVOQlFVTXNRMEZCUXp0SFFVTTNSU3hEUVVGRExFTkJRVU03TzBGQlJVZ3NTVUZCUlN4RFFVRkRMSFZGUVVGMVJTeEZRVUZGTEZsQlFVMDdRVUZEYUVZc2NVSkJRV2xDTEVOQlFVTXNWVUZCVlN4RFFVRkRMREJDUVVFd1FpeEZRVUZGTEdWQlFXVXNRMEZCUXl4RFFVRkRPenRCUVVVeFJTeFJRVUZOTEdsQ1FVRnBRaXhIUVVGSExFTkJRM2hDTzBGQlEwVXNVVUZCUlN4RlFVRkZMRU5CUVVNN1FVRkRUQ3hWUVVGSkxFVkJRVVVzVFVGQlRUdEJRVU5hTEZsQlFVMHNSVUZCUlN4UlFVRlJPMEZCUTJoQ0xGbEJRVTBzUlVGQlJUdEJRVU5PTEZsQlFVa3NSVUZCUlN4SFFVRkhPMDlCUTFZN1MwRkRSaXhGUVVORU8wRkJRMFVzVVVGQlJTeEZRVUZGTEVOQlFVTTdRVUZEVEN4VlFVRkpMRVZCUVVVc1pVRkJaVHRCUVVOeVFpeFpRVUZOTEVWQlFVVXNRMEZCUXp0QlFVTlVMRmxCUVUwc1JVRkJSVHRCUVVOT0xHRkJRVXNzUlVGQlJTeEhRVUZITzBGQlExWXNhVUpCUVZNc1JVRkJSU3hIUVVGSE8wRkJRMlFzYjBKQlFWa3NSVUZCUlN4SFFVRkhPMDlCUTJ4Q08wdEJRMFlzUlVGRFJEdEJRVU5GTEZGQlFVVXNSVUZCUlN4RFFVRkRPMEZCUTB3c1ZVRkJTU3hGUVVGRkxGbEJRVms3UVVGRGJFSXNXVUZCVFN4RlFVRkZMRU5CUVVNN1MwRkRWaXhEUVVOR0xFTkJRVU03TzBGQlJVWXNWVUZCVFN4RFFVRkRMR2xDUVVGcFFpeERRVUZETEUxQlFVMHNRMEZCUXl4cFFrRkJhVUlzUTBGQlF5eERRVUZETEVOQlFVTXNTVUZCU1N4RFFVRkRMR2xDUVVGcFFpeERRVUZETEVOQlFVTTdRVUZETlVVc1ZVRkJUU3hEUVVGRExFMUJRVTBzUTBGQlF5eFpRVUZaTEVOQlFVTXNUVUZCVFN4RlFVRkZMRVZCUVVVc1JVRkJReXhOUVVGTkxFVkJRVU1zYzBKQlFYTkNMRVZCUVVNc1VVRkJVU3hGUVVGRExFTkJRVU1zUlVGQlF5eE5RVUZOTEVWQlFVTXNWVUZCVlN4RlFVRkRMRTFCUVUwc1JVRkJReXhGUVVGRExFOUJRVThzUlVGQlF5eEhRVUZITEVWQlFVTXNVVUZCVVN4RlFVRkRMRVZCUVVVc1JVRkJReXhGUVVGRExGRkJRVkVzUlVGQlF5eERRVUZETEVWQlFVTXNUVUZCVFN4RlFVRkRMR3RDUVVGclFpeEZRVUZETEV0QlFVc3NSVUZCUXl4RlFVRkRMRTlCUVU4c1JVRkJReXhEUVVGRExFTkJRVU1zUlVGQlF5eFJRVUZSTEVWQlFVTXNSVUZCUlN4RlFVRkRMRVZCUVVNc1VVRkJVU3hGUVVGRExFTkJRVU1zUlVGQlF5eE5RVUZOTEVWQlFVTXNWMEZCVnl4RlFVRkRMRmRCUVZjc1JVRkJReXhGUVVGRExFOUJRVThzUlVGQlF5eEhRVUZITEVWQlFVTXNVVUZCVVN4RlFVRkRMRVZCUVVVc1JVRkJReXhGUVVGRExGRkJRVkVzUlVGQlF5eERRVUZETEVWQlFVTXNUVUZCVFN4RlFVRkRMRlZCUVZVc1JVRkJReXhOUVVGTkxFVkJRVU1zUlVGQlF5eFBRVUZQTEVWQlFVTXNSMEZCUnl4RlFVRkRMRkZCUVZFc1JVRkJReXhGUVVGRkxFVkJRVU1zUlVGQlF5eFJRVUZSTEVWQlFVTXNRMEZCUXl4RlFVRkRMRTFCUVUwc1JVRkJReXhYUVVGWExFVkJRVU1zVjBGQlZ5eEZRVUZETEVWQlFVTXNUMEZCVHl4RlFVRkRMRWRCUVVjc1JVRkJReXhSUVVGUkxFVkJRVU1zUlVGQlJTeEZRVUZETEVWQlFVTXNVVUZCVVN4RlFVRkRMRU5CUVVNc1JVRkJReXhOUVVGTkxFVkJRVU1zVlVGQlZTeEZRVUZETEUxQlFVMHNSVUZCUXl4RlFVRkRMRTlCUVU4c1JVRkJReXhIUVVGSExFVkJRVU1zVVVGQlVTeEZRVUZETEVWQlFVVXNSVUZCUXl4RlFVRkRMRkZCUVZFc1JVRkJReXhEUVVGRExITkNRVUZ6UWl4RFFVRkRMRVZCUVVNc1EwRkJReXhGUVVGRExFVkJRVU1zUlVGQlF5eE5RVUZOTEVWQlFVTXNaMEpCUVdkQ0xFVkJRVU1zVFVGQlRTeEZRVUZETEUxQlFVMHNSVUZCUXl4WFFVRlhMRVZCUVVNc1JVRkJReXhQUVVGUExFVkJRVU1zUjBGQlJ5eEZRVUZETEZGQlFWRXNSVUZCUXl4RlFVRkZMRVZCUVVNc1JVRkJReXhSUVVGUkxFVkJRVU1zUlVGQlF5eFBRVUZQTEVWQlFVTXNRMEZCUXl4RlFVRkRMRkZCUVZFc1JVRkJReXhGUVVGRkxFVkJRVU1zUlVGQlF5eFJRVUZSTEVWQlFVTXNSVUZCUlN4RlFVRkRMRU5CUVVNc1JVRkJReXhEUVVGRExFVkJRVU1zUTBGQlF5eEZRVUZETEVWQlFVTXNSVUZCUXl4TlFVRk5MRVZCUVVNc2EwSkJRV3RDTEVWQlFVTXNTMEZCU3l4RlFVRkRMRVZCUVVNc1QwRkJUeXhGUVVGRExFTkJRVU1zUlVGQlF5eFJRVUZSTEVWQlFVTXNSVUZCUlN4RlFVRkRMRVZCUVVNc1VVRkJVU3hGUVVGRExFTkJRVU1zUlVGQlF5eE5RVUZOTEVWQlFVTXNWMEZCVnl4RlFVRkRMRmRCUVZjc1JVRkJReXhGUVVGRExFOUJRVThzUlVGQlF5eEhRVUZITEVWQlFVTXNVVUZCVVN4RlFVRkRMRVZCUVVVc1JVRkJReXhGUVVGRExGRkJRVkVzUlVGQlF5eERRVUZETEVWQlFVTXNUVUZCVFN4RlFVRkRMRlZCUVZVc1JVRkJReXhOUVVGTkxFVkJRVU1zUlVGQlF5eFBRVUZQTEVWQlFVTXNSMEZCUnl4RlFVRkRMRkZCUVZFc1JVRkJReXhGUVVGRkxFVkJRVU1zUlVGQlF5eFJRVUZSTEVWQlFVTXNRMEZCUXl4RlFVRkRMRTFCUVUwc1JVRkJReXhYUVVGWExFVkJRVU1zVjBGQlZ5eEZRVUZETEVWQlFVTXNUMEZCVHl4RlFVRkRMRWRCUVVjc1JVRkJReXhSUVVGUkxFVkJRVU1zUlVGQlJTeEZRVUZETEVWQlFVTXNVVUZCVVN4RlFVRkRMRU5CUVVNc1JVRkJReXhOUVVGTkxFVkJRVU1zVlVGQlZTeEZRVUZETEUxQlFVMHNSVUZCUXl4RlFVRkRMRTlCUVU4c1JVRkJReXhIUVVGSExFVkJRVU1zVVVGQlVTeEZRVUZETEVWQlFVVXNSVUZCUXl4RlFVRkRMRkZCUVZFc1JVRkJReXhEUVVGRExITkNRVUZ6UWl4RlFVRkRMRVZCUVVNc1RVRkJUU3hGUVVGRExHZENRVUZuUWl4RlFVRkRMRTFCUVUwc1JVRkJReXhOUVVGTkxFVkJRVU1zVjBGQlZ5eEZRVUZETEVWQlFVTXNUMEZCVHl4RlFVRkRMRWRCUVVjc1JVRkJReXhSUVVGUkxFVkJRVU1zUlVGQlJTeEZRVUZETEVWQlFVTXNVVUZCVVN4RlFVRkRMRVZCUVVNc1QwRkJUeXhGUVVGRExFTkJRVU1zUlVGQlF5eFJRVUZSTEVWQlFVTXNSVUZCUlN4RlFVRkRMRVZCUVVNc1VVRkJVU3hGUVVGRExFVkJRVVVzUlVGQlF5eERRVUZETEVWQlFVTXNRMEZCUXl4RlFVRkRMRU5CUVVNc1JVRkJReXhEUVVGRExFVkJRVU1zUTBGQlF5eEZRVUZETEVOQlFVTXNSVUZCUXl4RFFVRkRMRVZCUVVNc1EwRkJReXhEUVVGRExFTkJRVU1zU1VGQlNTeERRVUZETEVsQlFVa3NRMEZCUXl4RFFVRkRPMGRCUTNKdFF5eERRVUZETEVOQlFVTTdPMEZCUlVnc1NVRkJSU3hEUVVGRExITkVRVUZ6UkN4RlFVRkZMRmxCUVUwN1FVRkRMMFFzY1VKQlFXbENMRU5CUVVNc1ZVRkJWU3hEUVVGRExEQkNRVUV3UWl4RlFVRkZMR1ZCUVdVc1EwRkJReXhEUVVGRE96dEJRVVV4UlN4UlFVRk5MQ3RDUVVFclFpeEhRVUZITEZOQlFXeERMQ3RDUVVFclFqdGhRVUZUTEVOQlF6VkRPMEZCUTBVc1ZVRkJSU3hGUVVGRkxFTkJRVU03UVVGRFRDeFpRVUZKTEVWQlFVVXNUVUZCVFR0QlFVTmFMR05CUVUwc1JVRkJSU3hSUVVGUk8wOUJRMnBDTEVWQlEwUTdRVUZEUlN4VlFVRkZMRVZCUVVVc1EwRkJRenRCUVVOTUxGbEJRVWtzUlVGQlJTeGxRVUZsTzBGQlEzSkNMR05CUVUwc1JVRkJSU3hEUVVGRE8wOUJRMVlzUlVGRFJEdEJRVU5GTEZWQlFVVXNSVUZCUlN4RFFVRkRPMEZCUTB3c1dVRkJTU3hGUVVGRkxGbEJRVms3UVVGRGJFSXNZMEZCVFN4RlFVRkZMRU5CUVVNN1QwRkRWaXhEUVVOR08wdEJRVUVzUTBGQlF6czdRVUZGUml4eFFrRkJhVUlzUTBGQlF5eFZRVUZWTEVOQlFVTXNLMEpCUVN0Q0xFVkJRVVVzYjBKQlFXOUNMRU5CUVVNc1EwRkJRenM3UVVGRmNFWXNVVUZCVFN4cFFrRkJhVUlzUjBGQlJ5eERRVU40UWp0QlFVTkZMRkZCUVVVc1JVRkJSU3hEUVVGRE8wRkJRMHdzVlVGQlNTeEZRVUZGTEUxQlFVMDdRVUZEV2l4WlFVRk5MRVZCUVVVc1VVRkJVVHRCUVVOb1FpeFpRVUZOTEVWQlFVVTdRVUZEVGl4WlFVRkpMRVZCUVVVc1IwRkJSenRQUVVOV08wdEJRMFlzUlVGRFJEdEJRVU5GTEZGQlFVVXNSVUZCUlN4RFFVRkRPMEZCUTB3c1ZVRkJTU3hGUVVGRkxHOUNRVUZ2UWp0QlFVTXhRaXhaUVVGTkxFVkJRVVVzUTBGQlF6dExRVU5XTEVWQlEwUTdRVUZEUlN4UlFVRkZMRVZCUVVVc1EwRkJRenRCUVVOTUxGVkJRVWtzUlVGQlJTeGxRVUZsTzBGQlEzSkNMRmxCUVUwc1JVRkJSU3hEUVVGRE8wdEJRMVlzUlVGRFJEdEJRVU5GTEZGQlFVVXNSVUZCUlN4RFFVRkRPMEZCUTB3c1ZVRkJTU3hGUVVGRkxGbEJRVms3UVVGRGJFSXNXVUZCVFN4RlFVRkZMRU5CUVVNN1MwRkRWaXhEUVVOR0xFTkJRVU03TzBGQlJVWXNWVUZCVFN4RFFVRkRMR2xDUVVGcFFpeERRVUZETEUxQlFVMHNRMEZCUXl4cFFrRkJhVUlzUTBGQlF5eERRVUZETEVOQlFVTXNTVUZCU1N4RFFVRkRMR2xDUVVGcFFpeERRVUZETEVOQlFVTTdRVUZETlVVc1ZVRkJUU3hEUVVGRExFMUJRVTBzUTBGQlF5eFpRVUZaTEVOQlFVTXNUVUZCVFN4RlFVRkZMRVZCUVVVc1JVRkJReXhOUVVGTkxFVkJRVU1zYzBKQlFYTkNMRVZCUVVNc1VVRkJVU3hGUVVGRExFTkJRVU1zUlVGQlF5eE5RVUZOTEVWQlFVTXNWVUZCVlN4RlFVRkRMRTFCUVUwc1JVRkJReXhGUVVGRExFOUJRVThzUlVGQlF5eEhRVUZITEVWQlFVTXNVVUZCVVN4RlFVRkRMRVZCUVVVc1JVRkJReXhGUVVGRExGRkJRVkVzUlVGQlF5eERRVUZETEVWQlFVTXNUVUZCVFN4RlFVRkRMRlZCUVZVc1JVRkJReXhOUVVGTkxFVkJRVU1zUlVGQlF5eFBRVUZQTEVWQlFVTXNRMEZCUXl4RlFVRkRMRkZCUVZFc1JVRkJReXhGUVVGRkxFVkJRVU1zUlVGQlF5eFJRVUZSTEVWQlFVTXNRMEZCUXl4RlFVRkRMRTFCUVUwc1JVRkJReXhyUWtGQmEwSXNSVUZCUXl4TFFVRkxMRVZCUVVNc1JVRkJReXhQUVVGUExFVkJRVU1zUTBGQlF5eERRVUZETEVWQlFVTXNVVUZCVVN4RlFVRkRMRVZCUVVVc1JVRkJReXhGUVVGRExGRkJRVkVzUlVGQlF5eERRVUZETEVWQlFVTXNUVUZCVFN4RlFVRkRMRmRCUVZjc1JVRkJReXhYUVVGWExFVkJRVU1zUlVGQlF5eFBRVUZQTEVWQlFVTXNhMEpCUVd0Q0xFVkJRVU1zVVVGQlVTeEZRVUZETEVWQlFVVXNSVUZCUXl4RlFVRkRMRkZCUVZFc1JVRkJReXhEUVVGRExFVkJRVU1zVFVGQlRTeEZRVUZETEZWQlFWVXNSVUZCUXl4TlFVRk5MRVZCUVVNc1JVRkJReXhQUVVGUExFVkJRVU1zYTBKQlFXdENMRVZCUVVNc1VVRkJVU3hGUVVGRExFVkJRVVVzUlVGQlF5eEZRVUZETEZGQlFWRXNSVUZCUXl4RFFVRkRMRVZCUVVNc1RVRkJUU3hGUVVGRExGZEJRVmNzUlVGQlF5eFhRVUZYTEVWQlFVTXNSVUZCUXl4UFFVRlBMRVZCUVVNc2EwSkJRV3RDTEVWQlFVTXNVVUZCVVN4RlFVRkRMRVZCUVVVc1JVRkJReXhGUVVGRExGRkJRVkVzUlVGQlF5eERRVUZETEVWQlFVTXNUVUZCVFN4RlFVRkRMRlZCUVZVc1JVRkJReXhOUVVGTkxFVkJRVU1zUlVGQlF5eFBRVUZQTEVWQlFVTXNhMEpCUVd0Q0xFVkJRVU1zVVVGQlVTeEZRVUZETEVWQlFVVXNSVUZCUXl4RlFVRkRMRkZCUVZFc1JVRkJReXhEUVVGRExITkNRVUZ6UWl4RFFVRkRMRVZCUVVNc1EwRkJReXhGUVVGRExFVkJRVU1zUlVGQlF5eE5RVUZOTEVWQlFVTXNaMEpCUVdkQ0xFVkJRVU1zVFVGQlRTeEZRVUZETEUxQlFVMHNSVUZCUXl4WFFVRlhMRVZCUVVNc1JVRkJReXhQUVVGUExFVkJRVU1zUjBGQlJ5eEZRVUZETEZGQlFWRXNSVUZCUXl4RlFVRkZMRVZCUVVNc1JVRkJReXhSUVVGUkxFVkJRVU1zUlVGQlF5eFBRVUZQTEVWQlFVTXNRMEZCUXl4RlFVRkRMRkZCUVZFc1JVRkJReXhGUVVGRkxFVkJRVU1zUlVGQlF5eFJRVUZSTEVWQlFVTXNSVUZCUlN4RlFVRkRMRU5CUVVNc1JVRkJReXhEUVVGRExFVkJRVU1zUTBGQlF5eEZRVUZETEVWQlFVTXNSVUZCUXl4TlFVRk5MRVZCUVVNc2EwSkJRV3RDTEVWQlFVTXNTMEZCU3l4RlFVRkRMRVZCUVVNc1QwRkJUeXhGUVVGRExFTkJRVU1zUlVGQlF5eFJRVUZSTEVWQlFVTXNSVUZCUlN4RlFVRkRMRVZCUVVNc1VVRkJVU3hGUVVGRExFTkJRVU1zUlVGQlF5eE5RVUZOTEVWQlFVTXNWMEZCVnl4RlFVRkRMRmRCUVZjc1JVRkJReXhGUVVGRExFOUJRVThzUlVGQlF5eHJRa0ZCYTBJc1JVRkJReXhSUVVGUkxFVkJRVU1zUlVGQlJTeEZRVUZETEVWQlFVTXNVVUZCVVN4RlFVRkRMRU5CUVVNc1JVRkJReXhOUVVGTkxFVkJRVU1zVlVGQlZTeEZRVUZETEUxQlFVMHNSVUZCUXl4RlFVRkRMRTlCUVU4c1JVRkJReXhyUWtGQmEwSXNSVUZCUXl4UlFVRlJMRVZCUVVNc1JVRkJSU3hGUVVGRExFVkJRVU1zVVVGQlVTeEZRVUZETEVOQlFVTXNSVUZCUXl4TlFVRk5MRVZCUVVNc1YwRkJWeXhGUVVGRExGZEJRVmNzUlVGQlF5eEZRVUZETEU5QlFVOHNSVUZCUXl4clFrRkJhMElzUlVGQlF5eFJRVUZSTEVWQlFVTXNSVUZCUlN4RlFVRkRMRVZCUVVNc1VVRkJVU3hGUVVGRExFTkJRVU1zUlVGQlF5eE5RVUZOTEVWQlFVTXNWVUZCVlN4RlFVRkRMRTFCUVUwc1JVRkJReXhGUVVGRExFOUJRVThzUlVGQlF5eHJRa0ZCYTBJc1JVRkJReXhSUVVGUkxFVkJRVU1zUlVGQlJTeEZRVUZETEVWQlFVTXNVVUZCVVN4RlFVRkRMRU5CUVVNc2MwSkJRWE5DTEVWQlFVTXNSVUZCUXl4TlFVRk5MRVZCUVVNc1owSkJRV2RDTEVWQlFVTXNUVUZCVFN4RlFVRkRMRTFCUVUwc1JVRkJReXhYUVVGWExFVkJRVU1zUlVGQlF5eFBRVUZQTEVWQlFVTXNSMEZCUnl4RlFVRkRMRkZCUVZFc1JVRkJReXhGUVVGRkxFVkJRVU1zUlVGQlF5eFJRVUZSTEVWQlFVTXNSVUZCUXl4UFFVRlBMRVZCUVVNc1EwRkJReXhGUVVGRExGRkJRVkVzUlVGQlF5eEZRVUZGTEVWQlFVTXNSVUZCUXl4UlFVRlJMRVZCUVVNc1JVRkJSU3hGUVVGRExFTkJRVU1zUlVGQlF5eERRVUZETEVWQlFVTXNRMEZCUXl4RlFVRkRMRU5CUVVNc1JVRkJReXhEUVVGRExFVkJRVU1zUTBGQlF5eEZRVUZETEVOQlFVTXNSVUZCUXl4RFFVRkRMRVZCUVVNc1EwRkJReXhEUVVGRExFTkJRVU1zU1VGQlNTeERRVUZETEVsQlFVa3NRMEZCUXl4RFFVRkRPMGRCUXpONFF5eERRVUZETEVOQlFVTTdPMEZCUlVnc1NVRkJSU3hEUVVGRExDdERRVUVyUXl4RlFVRkZMRmxCUVUwN1FVRkRlRVFzY1VKQlFXbENMRU5CUVVNc1ZVRkJWU3hEUVVGRExEQkNRVUV3UWl4RlFVRkZMR1ZCUVdVc1EwRkJReXhEUVVGRE96dEJRVVV4UlN4UlFVRk5MR2xDUVVGcFFpeEhRVUZITEVOQlEzaENPMEZCUTBVc1VVRkJSU3hGUVVGRkxFTkJRVU03UVVGRFRDeFZRVUZKTEVWQlFVVXNUVUZCVFR0QlFVTmFMRmxCUVUwc1JVRkJSU3hSUVVGUk8wRkJRMmhDTEZsQlFVMHNSVUZCUlR0QlFVTk9MRmxCUVVrc1JVRkJSU3hIUVVGSE8wOUJRMVk3UzBGRFJpeEZRVU5FTzBGQlEwVXNVVUZCUlN4RlFVRkZMRU5CUVVNN1FVRkRUQ3hWUVVGSkxFVkJRVVVzWlVGQlpUdEJRVU55UWl4WlFVRk5MRVZCUVVVc1EwRkJRenRCUVVOVUxGbEJRVTBzUlVGQlJUdEJRVU5PTEdGQlFVc3NSVUZCUlN4SFFVRkhPMEZCUTFZc2FVSkJRVk1zUlVGQlJTeEhRVUZITzBGQlEyUXNiMEpCUVZrc1JVRkJSU3hIUVVGSE8wOUJRMnhDTzB0QlEwWXNSVUZEUkR0QlFVTkZMRkZCUVVVc1JVRkJSU3hEUVVGRE8wRkJRMHdzVlVGQlNTeEZRVUZGTEZsQlFWazdRVUZEYkVJc1dVRkJUU3hGUVVGRkxFTkJRVU03UzBGRFZpeERRVU5HTEVOQlFVTTdPMEZCUlVZc2NVSkJRV2xDTEVOQlFVTXNUVUZCVFN4RFFVRkRMR2xDUVVGcFFpeERRVUZETEVOQlFVTTdPMEZCUlRWRExGVkJRVTBzUTBGQlF5eE5RVUZOTEVOQlFVTXNXVUZCV1N4RFFVRkRMRTFCUVUwc1JVRkJSU3hGUVVGRkxFVkJRVU1zVFVGQlRTeEZRVUZETEhOQ1FVRnpRaXhGUVVGRExGRkJRVkVzUlVGQlF5eERRVUZETEVWQlFVTXNUVUZCVFN4RlFVRkRMRlZCUVZVc1JVRkJReXhOUVVGTkxFVkJRVU1zUlVGQlF5eFBRVUZQTEVWQlFVTXNSMEZCUnl4RlFVRkRMRkZCUVZFc1JVRkJReXhGUVVGRkxFVkJRVU1zUlVGQlF5eFJRVUZSTEVWQlFVTXNRMEZCUXl4RlFVRkRMRTFCUVUwc1JVRkJReXhyUWtGQmEwSXNSVUZCUXl4TFFVRkxMRVZCUVVNc1JVRkJReXhQUVVGUExFVkJRVU1zUTBGQlF5eERRVUZETEVWQlFVTXNVVUZCVVN4RlFVRkRMRVZCUVVVc1JVRkJReXhGUVVGRExGRkJRVkVzUlVGQlF5eERRVUZETEVWQlFVTXNUVUZCVFN4RlFVRkRMRmRCUVZjc1JVRkJReXhYUVVGWExFVkJRVU1zUlVGQlF5eFBRVUZQTEVWQlFVTXNSMEZCUnl4RlFVRkRMRkZCUVZFc1JVRkJReXhGUVVGRkxFVkJRVU1zUlVGQlF5eFJRVUZSTEVWQlFVTXNRMEZCUXl4RlFVRkRMRTFCUVUwc1JVRkJReXhWUVVGVkxFVkJRVU1zVFVGQlRTeEZRVUZETEVWQlFVTXNUMEZCVHl4RlFVRkRMRWRCUVVjc1JVRkJReXhSUVVGUkxFVkJRVU1zUlVGQlJTeEZRVUZETEVWQlFVTXNVVUZCVVN4RlFVRkRMRU5CUVVNc1JVRkJReXhOUVVGTkxFVkJRVU1zVjBGQlZ5eEZRVUZETEZkQlFWY3NSVUZCUXl4RlFVRkRMRTlCUVU4c1JVRkJReXhIUVVGSExFVkJRVU1zVVVGQlVTeEZRVUZETEVWQlFVVXNSVUZCUXl4RlFVRkRMRkZCUVZFc1JVRkJReXhEUVVGRExFVkJRVU1zVFVGQlRTeEZRVUZETEZWQlFWVXNSVUZCUXl4TlFVRk5MRVZCUVVNc1JVRkJReXhQUVVGUExFVkJRVU1zUjBGQlJ5eEZRVUZETEZGQlFWRXNSVUZCUXl4RlFVRkZMRVZCUVVNc1JVRkJReXhSUVVGUkxFVkJRVU1zUTBGQlF5eHpRa0ZCYzBJc1EwRkJReXhGUVVGRExFTkJRVU1zUlVGQlF5eEZRVUZETEVWQlFVTXNUVUZCVFN4RlFVRkRMR2RDUVVGblFpeEZRVUZETEUxQlFVMHNSVUZCUXl4TlFVRk5MRVZCUVVNc1YwRkJWeXhGUVVGRExFVkJRVU1zVDBGQlR5eEZRVUZETEVkQlFVY3NSVUZCUXl4UlFVRlJMRVZCUVVNc1JVRkJSU3hGUVVGRExFVkJRVU1zVVVGQlVTeEZRVUZETEVWQlFVTXNUMEZCVHl4RlFVRkRMRU5CUVVNc1JVRkJReXhSUVVGUkxFVkJRVU1zUlVGQlJTeEZRVUZETEVWQlFVTXNVVUZCVVN4RlFVRkRMRVZCUVVVc1JVRkJReXhEUVVGRExFVkJRVU1zUTBGQlF5eEZRVUZETEVOQlFVTXNSVUZCUXl4RlFVRkRMRVZCUVVNc1RVRkJUU3hGUVVGRExHdENRVUZyUWl4RlFVRkRMRXRCUVVzc1JVRkJReXhGUVVGRExFOUJRVThzUlVGQlF5eERRVUZETEVWQlFVTXNVVUZCVVN4RlFVRkRMRVZCUVVVc1JVRkJReXhGUVVGRExGRkJRVkVzUlVGQlF5eERRVUZETEVWQlFVTXNUVUZCVFN4RlFVRkRMRmRCUVZjc1JVRkJReXhYUVVGWExFVkJRVU1zUlVGQlF5eFBRVUZQTEVWQlFVTXNSMEZCUnl4RlFVRkRMRkZCUVZFc1JVRkJReXhGUVVGRkxFVkJRVU1zUlVGQlF5eFJRVUZSTEVWQlFVTXNRMEZCUXl4RlFVRkRMRTFCUVUwc1JVRkJReXhWUVVGVkxFVkJRVU1zVFVGQlRTeEZRVUZETEVWQlFVTXNUMEZCVHl4RlFVRkRMRWRCUVVjc1JVRkJReXhSUVVGUkxFVkJRVU1zUlVGQlJTeEZRVUZETEVWQlFVTXNVVUZCVVN4RlFVRkRMRU5CUVVNc1JVRkJReXhOUVVGTkxFVkJRVU1zVjBGQlZ5eEZRVUZETEZkQlFWY3NSVUZCUXl4RlFVRkRMRTlCUVU4c1JVRkJReXhIUVVGSExFVkJRVU1zVVVGQlVTeEZRVUZETEVWQlFVVXNSVUZCUXl4RlFVRkRMRkZCUVZFc1JVRkJReXhEUVVGRExFVkJRVU1zVFVGQlRTeEZRVUZETEZWQlFWVXNSVUZCUXl4TlFVRk5MRVZCUVVNc1JVRkJReXhQUVVGUExFVkJRVU1zUjBGQlJ5eEZRVUZETEZGQlFWRXNSVUZCUXl4RlFVRkZMRVZCUVVNc1JVRkJReXhSUVVGUkxFVkJRVU1zUTBGQlF5eHpRa0ZCYzBJc1JVRkJReXhGUVVGRExFMUJRVTBzUlVGQlF5eG5Ra0ZCWjBJc1JVRkJReXhOUVVGTkxFVkJRVU1zVFVGQlRTeEZRVUZETEZkQlFWY3NSVUZCUXl4RlFVRkRMRTlCUVU4c1JVRkJReXhIUVVGSExFVkJRVU1zVVVGQlVTeEZRVUZETEVWQlFVVXNSVUZCUXl4RlFVRkRMRkZCUVZFc1JVRkJReXhGUVVGRExFOUJRVThzUlVGQlF5eERRVUZETEVWQlFVTXNVVUZCVVN4RlFVRkRMRVZCUVVVc1JVRkJReXhGUVVGRExGRkJRVkVzUlVGQlF5eEZRVUZGTEVWQlFVTXNRMEZCUXl4RlFVRkRMRU5CUVVNc1JVRkJReXhEUVVGRExFVkJRVU1zUTBGQlF5eEZRVUZETEVOQlFVTXNSVUZCUXl4RFFVRkRMRVZCUVVNc1EwRkJReXhGUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETEVsQlFVa3NRMEZCUXl4SlFVRkpMRU5CUVVNc1EwRkJRenM3UVVGRmNHMURMSEZDUVVGcFFpeERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRMRTFCUVUwc1EwRkJReXhMUVVGTExFZEJRVWNzUjBGQlJ5eERRVUZET3p0QlFVVjRReXh4UWtGQmFVSXNRMEZCUXl4TlFVRk5MRU5CUVVNc2FVSkJRV2xDTEVOQlFVTXNRMEZCUXpzN1FVRkZOVU1zVlVGQlRTeERRVUZETEUxQlFVMHNRMEZCUXl4WlFVRlpMRU5CUVVNc1RVRkJUU3hGUVVGRkxFVkJRVVVzUlVGQlF5eE5RVUZOTEVWQlFVTXNjMEpCUVhOQ0xFVkJRVU1zVVVGQlVTeEZRVUZETEVOQlFVTXNSVUZCUXl4TlFVRk5MRVZCUVVNc1ZVRkJWU3hGUVVGRExFMUJRVTBzUlVGQlF5eEZRVUZETEU5QlFVOHNSVUZCUXl4SFFVRkhMRVZCUVVNc1VVRkJVU3hGUVVGRExFVkJRVVVzUlVGQlF5eEZRVUZETEZGQlFWRXNSVUZCUXl4RFFVRkRMRVZCUVVNc1RVRkJUU3hGUVVGRExHdENRVUZyUWl4RlFVRkRMRXRCUVVzc1JVRkJReXhGUVVGRExFOUJRVThzUlVGQlF5eERRVUZETEVOQlFVTXNSVUZCUXl4UlFVRlJMRVZCUVVNc1JVRkJSU3hGUVVGRExFVkJRVU1zVVVGQlVTeEZRVUZETEVOQlFVTXNSVUZCUXl4TlFVRk5MRVZCUVVNc1YwRkJWeXhGUVVGRExGZEJRVmNzUlVGQlF5eEZRVUZETEU5QlFVOHNSVUZCUXl4SFFVRkhMRVZCUVVNc1VVRkJVU3hGUVVGRExFVkJRVVVzUlVGQlF5eEZRVUZETEZGQlFWRXNSVUZCUXl4RFFVRkRMRVZCUVVNc1RVRkJUU3hGUVVGRExGVkJRVlVzUlVGQlF5eE5RVUZOTEVWQlFVTXNSVUZCUXl4UFFVRlBMRVZCUVVNc1IwRkJSeXhGUVVGRExGRkJRVkVzUlVGQlF5eEZRVUZGTEVWQlFVTXNSVUZCUXl4UlFVRlJMRVZCUVVNc1EwRkJReXhGUVVGRExFMUJRVTBzUlVGQlF5eFhRVUZYTEVWQlFVTXNWMEZCVnl4RlFVRkRMRVZCUVVNc1QwRkJUeXhGUVVGRExFZEJRVWNzUlVGQlF5eFJRVUZSTEVWQlFVTXNSVUZCUlN4RlFVRkRMRVZCUVVNc1VVRkJVU3hGUVVGRExFTkJRVU1zUlVGQlF5eE5RVUZOTEVWQlFVTXNWVUZCVlN4RlFVRkRMRTFCUVUwc1JVRkJReXhGUVVGRExFOUJRVThzUlVGQlF5eEhRVUZITEVWQlFVTXNVVUZCVVN4RlFVRkRMRVZCUVVVc1JVRkJReXhGUVVGRExGRkJRVkVzUlVGQlF5eERRVUZETEhOQ1FVRnpRaXhEUVVGRExFVkJRVU1zUTBGQlF5eEZRVUZETEVWQlFVTXNSVUZCUXl4TlFVRk5MRVZCUVVNc1owSkJRV2RDTEVWQlFVTXNUVUZCVFN4RlFVRkRMRTFCUVUwc1JVRkJReXhYUVVGWExFVkJRVU1zUlVGQlF5eFBRVUZQTEVWQlFVTXNSMEZCUnl4RlFVRkRMRkZCUVZFc1JVRkJReXhGUVVGRkxFVkJRVU1zUlVGQlF5eFJRVUZSTEVWQlFVTXNSVUZCUXl4UFFVRlBMRVZCUVVNc1EwRkJReXhGUVVGRExGRkJRVkVzUlVGQlF5eEZRVUZGTEVWQlFVTXNSVUZCUXl4UlFVRlJMRVZCUVVNc1JVRkJSU3hGUVVGRExFTkJRVU1zUlVGQlF5eERRVUZETEVWQlFVTXNRMEZCUXl4RlFVRkRMRVZCUVVNc1JVRkJReXhOUVVGTkxFVkJRVU1zYTBKQlFXdENMRVZCUVVNc1MwRkJTeXhGUVVGRExFVkJRVU1zVDBGQlR5eEZRVUZETEVOQlFVTXNSVUZCUXl4UlFVRlJMRVZCUVVNc1JVRkJSU3hGUVVGRExFVkJRVU1zVVVGQlVTeEZRVUZETEVOQlFVTXNSVUZCUXl4TlFVRk5MRVZCUVVNc1YwRkJWeXhGUVVGRExGZEJRVmNzUlVGQlF5eEZRVUZETEU5QlFVOHNSVUZCUXl4SFFVRkhMRVZCUVVNc1VVRkJVU3hGUVVGRExFVkJRVVVzUlVGQlF5eEZRVUZETEZGQlFWRXNSVUZCUXl4RFFVRkRMRVZCUVVNc1RVRkJUU3hGUVVGRExGVkJRVlVzUlVGQlF5eE5RVUZOTEVWQlFVTXNSVUZCUXl4UFFVRlBMRVZCUVVNc1IwRkJSeXhGUVVGRExGRkJRVkVzUlVGQlF5eEZRVUZGTEVWQlFVTXNSVUZCUXl4UlFVRlJMRVZCUVVNc1EwRkJReXhGUVVGRExFMUJRVTBzUlVGQlF5eFhRVUZYTEVWQlFVTXNWMEZCVnl4RlFVRkRMRVZCUVVNc1QwRkJUeXhGUVVGRExFZEJRVWNzUlVGQlF5eFJRVUZSTEVWQlFVTXNSVUZCUlN4RlFVRkRMRVZCUVVNc1VVRkJVU3hGUVVGRExFTkJRVU1zUlVGQlF5eE5RVUZOTEVWQlFVTXNWVUZCVlN4RlFVRkRMRTFCUVUwc1JVRkJReXhGUVVGRExFOUJRVThzUlVGQlF5eEhRVUZITEVWQlFVTXNVVUZCVVN4RlFVRkRMRVZCUVVVc1JVRkJReXhGUVVGRExGRkJRVkVzUlVGQlF5eERRVUZETEhOQ1FVRnpRaXhGUVVGRExFVkJRVU1zVFVGQlRTeEZRVUZETEdkQ1FVRm5RaXhGUVVGRExFMUJRVTBzUlVGQlF5eE5RVUZOTEVWQlFVTXNWMEZCVnl4RlFVRkRMRVZCUVVNc1QwRkJUeXhGUVVGRExFZEJRVWNzUlVGQlF5eFJRVUZSTEVWQlFVTXNSVUZCUlN4RlFVRkRMRVZCUVVNc1VVRkJVU3hGUVVGRExFVkJRVU1zVDBGQlR5eEZRVUZETEVOQlFVTXNSVUZCUXl4UlFVRlJMRVZCUVVNc1JVRkJSU3hGUVVGRExFVkJRVU1zVVVGQlVTeEZRVUZETEVWQlFVVXNSVUZCUXl4RFFVRkRMRVZCUVVNc1EwRkJReXhGUVVGRExFTkJRVU1zUlVGQlF5eERRVUZETEVWQlFVTXNRMEZCUXl4RlFVRkRMRU5CUVVNc1JVRkJReXhEUVVGRExFVkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTXNTVUZCU1N4RFFVRkRMRWxCUVVrc1EwRkJReXhEUVVGRE8wZEJRM0p0UXl4RFFVRkRMRU5CUVVNN08wRkJSVWdzU1VGQlJTeERRVUZETEN0RFFVRXJReXhGUVVGRkxGbEJRVTA3UVVGRGVFUXNjVUpCUVdsQ0xFTkJRVU1zVlVGQlZTeERRVUZETERCQ1FVRXdRaXhGUVVGRkxHVkJRV1VzUTBGQlF5eERRVUZET3p0QlFVVXhSU3hSUVVGTkxHbENRVUZwUWl4SFFVRkhMRU5CUTNoQ08wRkJRMFVzVVVGQlJTeEZRVUZGTEVOQlFVTTdRVUZEVEN4VlFVRkpMRVZCUVVVc1RVRkJUVHRCUVVOYUxGbEJRVTBzUlVGQlJTeFJRVUZSTzBGQlEyaENMRmxCUVUwc1JVRkJSVHRCUVVOT0xGbEJRVWtzUlVGQlJTeEhRVUZITzA5QlExWTdTMEZEUml4RlFVTkVPMEZCUTBVc1VVRkJSU3hGUVVGRkxFTkJRVU03UVVGRFRDeFZRVUZKTEVWQlFVVXNaVUZCWlR0QlFVTnlRaXhaUVVGTkxFVkJRVVVzUTBGQlF6dEJRVU5VTEZsQlFVMHNSVUZCUlR0QlFVTk9MR0ZCUVVzc1JVRkJSU3hIUVVGSE8wRkJRMVlzYVVKQlFWTXNSVUZCUlN4SFFVRkhPMEZCUTJRc2IwSkJRVmtzUlVGQlJTeEhRVUZITzA5QlEyeENPMHRCUTBZc1JVRkRSRHRCUVVORkxGRkJRVVVzUlVGQlJTeERRVUZETzBGQlEwd3NWVUZCU1N4RlFVRkZMRmxCUVZrN1FVRkRiRUlzV1VGQlRTeEZRVUZGTEVOQlFVTTdTMEZEVml4RFFVTkdMRU5CUVVNN08wRkJSVVlzY1VKQlFXbENMRU5CUVVNc1RVRkJUU3hEUVVGRExHbENRVUZwUWl4RFFVRkRMRU5CUVVNN08wRkJSVFZETEZWQlFVMHNRMEZCUXl4TlFVRk5MRU5CUVVNc1dVRkJXU3hEUVVGRExFMUJRVTBzUlVGQlJTeEZRVUZGTEVWQlFVTXNUVUZCVFN4RlFVRkRMSE5DUVVGelFpeEZRVUZETEZGQlFWRXNSVUZCUXl4RFFVRkRMRVZCUVVNc1RVRkJUU3hGUVVGRExGVkJRVlVzUlVGQlF5eE5RVUZOTEVWQlFVTXNSVUZCUXl4UFFVRlBMRVZCUVVNc1IwRkJSeXhGUVVGRExGRkJRVkVzUlVGQlF5eEZRVUZGTEVWQlFVTXNSVUZCUXl4UlFVRlJMRVZCUVVNc1EwRkJReXhGUVVGRExFMUJRVTBzUlVGQlF5eHJRa0ZCYTBJc1JVRkJReXhMUVVGTExFVkJRVU1zUlVGQlF5eFBRVUZQTEVWQlFVTXNRMEZCUXl4RFFVRkRMRVZCUVVNc1VVRkJVU3hGUVVGRExFVkJRVVVzUlVGQlF5eEZRVUZETEZGQlFWRXNSVUZCUXl4RFFVRkRMRVZCUVVNc1RVRkJUU3hGUVVGRExGZEJRVmNzUlVGQlF5eFhRVUZYTEVWQlFVTXNSVUZCUXl4UFFVRlBMRVZCUVVNc1IwRkJSeXhGUVVGRExGRkJRVkVzUlVGQlF5eEZRVUZGTEVWQlFVTXNSVUZCUXl4UlFVRlJMRVZCUVVNc1EwRkJReXhGUVVGRExFMUJRVTBzUlVGQlF5eFZRVUZWTEVWQlFVTXNUVUZCVFN4RlFVRkRMRVZCUVVNc1QwRkJUeXhGUVVGRExFZEJRVWNzUlVGQlF5eFJRVUZSTEVWQlFVTXNSVUZCUlN4RlFVRkRMRVZCUVVNc1VVRkJVU3hGUVVGRExFTkJRVU1zUlVGQlF5eE5RVUZOTEVWQlFVTXNWMEZCVnl4RlFVRkRMRmRCUVZjc1JVRkJReXhGUVVGRExFOUJRVThzUlVGQlF5eEhRVUZITEVWQlFVTXNVVUZCVVN4RlFVRkRMRVZCUVVVc1JVRkJReXhGUVVGRExGRkJRVkVzUlVGQlF5eERRVUZETEVWQlFVTXNUVUZCVFN4RlFVRkRMRlZCUVZVc1JVRkJReXhOUVVGTkxFVkJRVU1zUlVGQlF5eFBRVUZQTEVWQlFVTXNSMEZCUnl4RlFVRkRMRkZCUVZFc1JVRkJReXhGUVVGRkxFVkJRVU1zUlVGQlF5eFJRVUZSTEVWQlFVTXNRMEZCUXl4elFrRkJjMElzUTBGQlF5eEZRVUZETEVOQlFVTXNSVUZCUXl4RlFVRkRMRVZCUVVNc1RVRkJUU3hGUVVGRExHZENRVUZuUWl4RlFVRkRMRTFCUVUwc1JVRkJReXhOUVVGTkxFVkJRVU1zVjBGQlZ5eEZRVUZETEVWQlFVTXNUMEZCVHl4RlFVRkRMRWRCUVVjc1JVRkJReXhSUVVGUkxFVkJRVU1zUlVGQlJTeEZRVUZETEVWQlFVTXNVVUZCVVN4RlFVRkRMRVZCUVVNc1QwRkJUeXhGUVVGRExFTkJRVU1zUlVGQlF5eFJRVUZSTEVWQlFVTXNSVUZCUlN4RlFVRkRMRVZCUVVNc1VVRkJVU3hGUVVGRExFVkJRVVVzUlVGQlF5eERRVUZETEVWQlFVTXNRMEZCUXl4RlFVRkRMRU5CUVVNc1JVRkJReXhGUVVGRExFVkJRVU1zVFVGQlRTeEZRVUZETEd0Q1FVRnJRaXhGUVVGRExFdEJRVXNzUlVGQlF5eEZRVUZETEU5QlFVOHNSVUZCUXl4RFFVRkRMRVZCUVVNc1VVRkJVU3hGUVVGRExFVkJRVVVzUlVGQlF5eEZRVUZETEZGQlFWRXNSVUZCUXl4RFFVRkRMRVZCUVVNc1RVRkJUU3hGUVVGRExGZEJRVmNzUlVGQlF5eFhRVUZYTEVWQlFVTXNSVUZCUXl4UFFVRlBMRVZCUVVNc1IwRkJSeXhGUVVGRExGRkJRVkVzUlVGQlF5eEZRVUZGTEVWQlFVTXNSVUZCUXl4UlFVRlJMRVZCUVVNc1EwRkJReXhGUVVGRExFMUJRVTBzUlVGQlF5eFZRVUZWTEVWQlFVTXNUVUZCVFN4RlFVRkRMRVZCUVVNc1QwRkJUeXhGUVVGRExFZEJRVWNzUlVGQlF5eFJRVUZSTEVWQlFVTXNSVUZCUlN4RlFVRkRMRVZCUVVNc1VVRkJVU3hGUVVGRExFTkJRVU1zUlVGQlF5eE5RVUZOTEVWQlFVTXNWMEZCVnl4RlFVRkRMRmRCUVZjc1JVRkJReXhGUVVGRExFOUJRVThzUlVGQlF5eEhRVUZITEVWQlFVTXNVVUZCVVN4RlFVRkRMRVZCUVVVc1JVRkJReXhGUVVGRExGRkJRVkVzUlVGQlF5eERRVUZETEVWQlFVTXNUVUZCVFN4RlFVRkRMRlZCUVZVc1JVRkJReXhOUVVGTkxFVkJRVU1zUlVGQlF5eFBRVUZQTEVWQlFVTXNSMEZCUnl4RlFVRkRMRkZCUVZFc1JVRkJReXhGUVVGRkxFVkJRVU1zUlVGQlF5eFJRVUZSTEVWQlFVTXNRMEZCUXl4elFrRkJjMElzUlVGQlF5eEZRVUZETEUxQlFVMHNSVUZCUXl4blFrRkJaMElzUlVGQlF5eE5RVUZOTEVWQlFVTXNUVUZCVFN4RlFVRkRMRmRCUVZjc1JVRkJReXhGUVVGRExFOUJRVThzUlVGQlF5eEhRVUZITEVWQlFVTXNVVUZCVVN4RlFVRkRMRVZCUVVVc1JVRkJReXhGUVVGRExGRkJRVkVzUlVGQlF5eEZRVUZETEU5QlFVOHNSVUZCUXl4RFFVRkRMRVZCUVVNc1VVRkJVU3hGUVVGRExFVkJRVVVzUlVGQlF5eEZRVUZETEZGQlFWRXNSVUZCUXl4RlFVRkZMRVZCUVVNc1EwRkJReXhGUVVGRExFTkJRVU1zUlVGQlF5eERRVUZETEVWQlFVTXNRMEZCUXl4RlFVRkRMRU5CUVVNc1JVRkJReXhEUVVGRExFVkJRVU1zUTBGQlF5eEZRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRMRWxCUVVrc1EwRkJReXhKUVVGSkxFTkJRVU1zUTBGQlF6czdRVUZGY0cxRExIRkNRVUZwUWl4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRExFMUJRVTBzUTBGQlF5eExRVUZMTEVkQlFVY3NSMEZCUnl4RFFVRkRPenRCUVVWNFF5eHhRa0ZCYVVJc1EwRkJReXhOUVVGTkxFTkJRVU1zUTBGRGRrSTdRVUZEUlN4UlFVRkZMRVZCUVVVc1EwRkJRenRCUVVOTUxGVkJRVWtzUlVGQlJTeE5RVUZOTzBGQlExb3NXVUZCVFN4RlFVRkZMRkZCUVZFN1FVRkRhRUlzV1VGQlRTeEZRVUZGTzBGQlEwNHNXVUZCU1N4RlFVRkZMRWRCUVVjN1QwRkRWanRMUVVOR0xFTkJRMFlzUTBGQlF5eERRVUZET3p0QlFVVklMRlZCUVUwc1EwRkJReXhOUVVGTkxFTkJRVU1zV1VGQldTeERRVUZETEUxQlFVMHNSVUZCUlN4RlFVRkZMRVZCUVVNc1RVRkJUU3hGUVVGRExITkNRVUZ6UWl4RlFVRkRMRkZCUVZFc1JVRkJReXhEUVVGRExFVkJRVU1zVFVGQlRTeEZRVUZETEZWQlFWVXNSVUZCUXl4TlFVRk5MRVZCUVVNc1JVRkJReXhQUVVGUExFVkJRVU1zUjBGQlJ5eEZRVUZETEZGQlFWRXNSVUZCUXl4RlFVRkZMRVZCUVVNc1JVRkJReXhSUVVGUkxFVkJRVU1zUlVGQlJTeEZRVUZETEVOQlFVTXNSVUZCUXl4RFFVRkRMRU5CUVVNc1EwRkJReXhKUVVGSkxFTkJRVU1zU1VGQlNTeERRVUZETEVOQlFVTTdSMEZETDBvc1EwRkJReXhEUVVGRE8wTkJRMG9zUTBGQlF5eERRVUZESWl3aVptbHNaU0k2SWk5b2IyMWxMMkl2WkdWMkwzWnBjblIxWVd3dFlYVmthVzh0WjNKaGNHZ3ZjM0JsWXk5MmFYSjBkV0ZzUVhWa2FXOUhjbUZ3YUM1a1pXWnBibVZPYjJSbExtcHpJaXdpYzI5MWNtTmxjME52Ym5SbGJuUWlPbHNpWTI5dWMzUWdlMlZ4ZFdGc2MzMGdQU0J5WlhGMWFYSmxLQ2R5WVcxa1lTY3BPMXh1WTI5dWMzUWdWbWx5ZEhWaGJFRjFaR2x2UjNKaGNHZ2dQU0J5WlhGMWFYSmxLQ2N1TGk5emNtTXZhVzVrWlhndWFuTW5LVHRjYm1OdmJuTjBJSEJwYm1kUWIyNW5SR1ZzWVhsUVlYSmhiWE5HWVdOMGIzSjVJRDBnY21WeGRXbHlaU2duTGk5MGIyOXNjeTl3YVc1blVHOXVaMFJsYkdGNVVHRnlZVzF6Um1GamRHOXllU2NwTzF4dVhHNWtaWE5qY21saVpTZ25kbWx5ZEhWaGJFRjFaR2x2UjNKaGNHZ3VaR1ZtYVc1bFRtOWtaU2NzSUNncElEMCtJSHRjYmlBZ2JHVjBJR0YxWkdsdlEyOXVkR1Y0ZER0Y2JpQWdiR1YwSUhacGNuUjFZV3hCZFdScGIwZHlZWEJvTzF4dVhHNGdJR0psWm05eVpVVmhZMmdvS0NrZ1BUNGdlMXh1SUNBZ0lHRjFaR2x2UTI5dWRHVjRkQ0E5SUc1bGR5QkJkV1JwYjBOdmJuUmxlSFFvS1R0Y2JpQWdJQ0IyYVhKMGRXRnNRWFZrYVc5SGNtRndhQ0E5SUc1bGR5QldhWEowZFdGc1FYVmthVzlIY21Gd2FDaDdYRzRnSUNBZ0lDQmhkV1JwYjBOdmJuUmxlSFFzWEc0Z0lDQWdJQ0J2ZFhSd2RYUTZJR0YxWkdsdlEyOXVkR1Y0ZEM1a1pYTjBhVzVoZEdsdmJpeGNiaUFnSUNCOUtUdGNiaUFnZlNrN1hHNWNiaUFnYVhRb0ozSmxkSFZ5Ym5NZ2FYUnpaV3htSnl3Z0tDa2dQVDRnZTF4dUlDQWdJR1Y0Y0dWamRDaDJhWEowZFdGc1FYVmthVzlIY21Gd2FDNWtaV1pwYm1WT2IyUmxLSEJwYm1kUWIyNW5SR1ZzWVhsUVlYSmhiWE5HWVdOMGIzSjVMQ0FuY0dsdVoxQnZibWRFWld4aGVTY3BLUzUwYjBKbEtIWnBjblIxWVd4QmRXUnBiMGR5WVhCb0tUdGNiaUFnZlNrN1hHNWNiaUFnYVhRb0ozUm9jbTkzY3lCcFppQnVZVzFsSUhCeWIzWnBaR1ZrSUdseklHRWdjM1JoYm1SaGNtUWdibTlrWlNjc0lDZ3BJRDArSUh0Y2JpQWdJQ0JsZUhCbFkzUW9LQ2tnUFQ0Z2RtbHlkSFZoYkVGMVpHbHZSM0poY0dndVpHVm1hVzVsVG05a1pTaHdhVzVuVUc5dVowUmxiR0Y1VUdGeVlXMXpSbUZqZEc5eWVTd2dKMmRoYVc0bktTa3VkRzlVYUhKdmR5Z3BPMXh1SUNCOUtUdGNibHh1SUNCcGRDZ25ZM0psWVhSbGN5QmhJR04xYzNSdmJTQnViMlJsSUdsdWRHVnlibUZzYkhrbkxDQW9LU0E5UGlCN1hHNGdJQ0FnZG1seWRIVmhiRUYxWkdsdlIzSmhjR2d1WkdWbWFXNWxUbTlrWlNod2FXNW5VRzl1WjBSbGJHRjVVR0Z5WVcxelJtRmpkRzl5ZVN3Z0ozQnBibWRRYjI1blJHVnNZWGtuS1R0Y2JseHVJQ0FnSUdWNGNHVmpkQ2gwZVhCbGIyWWdkbWx5ZEhWaGJFRjFaR2x2UjNKaGNHZ3VZM1Z6ZEc5dFRtOWtaWE11Y0dsdVoxQnZibWRFWld4aGVTa3VkRzlDWlNnblpuVnVZM1JwYjI0bktUdGNiaUFnZlNrN1hHNWNiaUFnYVhRb0oyTnlaV0YwWlhNZ1lTQmpkWE4wYjIwZ2JtOWtaU0IzYUdsamFDQmpZVzRnWW1VZ2NtVjFjMlZrSUdsdUlIWnBjblIxWVd4QmRXUnBiMGR5WVhCb0xuVndaR0YwWlNjc0lDZ3BJRDArSUh0Y2JpQWdJQ0IyYVhKMGRXRnNRWFZrYVc5SGNtRndhQzVrWldacGJtVk9iMlJsS0hCcGJtZFFiMjVuUkdWc1lYbFFZWEpoYlhOR1lXTjBiM0o1TENBbmNHbHVaMUJ2Ym1kRVpXeGhlU2NwTzF4dVhHNGdJQ0FnWTI5dWMzUWdkbWx5ZEhWaGJFNXZaR1ZRWVhKaGJYTWdQU0JiWEc0Z0lDQWdJQ0I3WEc0Z0lDQWdJQ0FnSUdsa09pQXdMRnh1SUNBZ0lDQWdJQ0J1YjJSbE9pQW5aMkZwYmljc1hHNGdJQ0FnSUNBZ0lHOTFkSEIxZERvZ0oyOTFkSEIxZENjc1hHNGdJQ0FnSUNBZ0lIQmhjbUZ0Y3pvZ2UxeHVJQ0FnSUNBZ0lDQWdJR2RoYVc0NklEQXVOU3hjYmlBZ0lDQWdJQ0FnZlZ4dUlDQWdJQ0FnZlN4Y2JpQWdJQ0FnSUh0Y2JpQWdJQ0FnSUNBZ2FXUTZJREVzWEc0Z0lDQWdJQ0FnSUc1dlpHVTZJQ2R3YVc1blVHOXVaMFJsYkdGNUp5eGNiaUFnSUNBZ0lDQWdiM1YwY0hWME9pQXdMRnh1SUNBZ0lDQWdJQ0J3WVhKaGJYTTZJSHRjYmlBZ0lDQWdJQ0FnSUNCa1pXTmhlVG9nTUM0MUxGeHVJQ0FnSUNBZ0lDQWdJR1JsYkdGNVZHbHRaVG9nTUM0MUxGeHVJQ0FnSUNBZ0lDQWdJRzFoZUVSbGJHRjVWR2x0WlRvZ01DNDFMRnh1SUNBZ0lDQWdJQ0I5WEc0Z0lDQWdJQ0I5TEZ4dUlDQWdJQ0FnZTF4dUlDQWdJQ0FnSUNCcFpEb2dNaXhjYmlBZ0lDQWdJQ0FnYm05a1pUb2dKMjl6WTJsc2JHRjBiM0luTEZ4dUlDQWdJQ0FnSUNCdmRYUndkWFE2SURFc1hHNGdJQ0FnSUNCOUxGeHVJQ0FnSUYwN1hHNWNiaUFnSUNCbGVIQmxZM1FvZG1seWRIVmhiRUYxWkdsdlIzSmhjR2d1ZFhCa1lYUmxLSFpwY25SMVlXeE9iMlJsVUdGeVlXMXpLU2t1ZEc5Q1pTaDJhWEowZFdGc1FYVmthVzlIY21Gd2FDazdYRzRnSUNBZ1pYaHdaV04wS0dWeGRXRnNjeWhoZFdScGIwTnZiblJsZUhRdWRHOUtVMDlPS0Nrc0lIdGNJbTVoYldWY0lqcGNJa0YxWkdsdlJHVnpkR2x1WVhScGIyNU9iMlJsWENJc1hDSnBibkIxZEhOY0lqcGJlMXdpYm1GdFpWd2lPbHdpUjJGcGJrNXZaR1ZjSWl4Y0ltZGhhVzVjSWpwN1hDSjJZV3gxWlZ3aU9qQXVOU3hjSW1sdWNIVjBjMXdpT2x0ZGZTeGNJbWx1Y0hWMGMxd2lPbHQ3WENKdVlXMWxYQ0k2WENKVGRHVnlaVzlRWVc1dVpYSk9iMlJsWENJc1hDSndZVzVjSWpwN1hDSjJZV3gxWlZ3aU9pMHhMRndpYVc1d2RYUnpYQ0k2VzExOUxGd2lhVzV3ZFhSelhDSTZXM3RjSW01aGJXVmNJanBjSWtSbGJHRjVUbTlrWlZ3aUxGd2laR1ZzWVhsVWFXMWxYQ0k2ZTF3aWRtRnNkV1ZjSWpvd0xqVXNYQ0pwYm5CMWRITmNJanBiWFgwc1hDSnBibkIxZEhOY0lqcGJlMXdpYm1GdFpWd2lPbHdpUjJGcGJrNXZaR1ZjSWl4Y0ltZGhhVzVjSWpwN1hDSjJZV3gxWlZ3aU9qQXVOU3hjSW1sdWNIVjBjMXdpT2x0ZGZTeGNJbWx1Y0hWMGMxd2lPbHQ3WENKdVlXMWxYQ0k2WENKRVpXeGhlVTV2WkdWY0lpeGNJbVJsYkdGNVZHbHRaVndpT250Y0luWmhiSFZsWENJNk1DNDFMRndpYVc1d2RYUnpYQ0k2VzExOUxGd2lhVzV3ZFhSelhDSTZXM3RjSW01aGJXVmNJanBjSWtkaGFXNU9iMlJsWENJc1hDSm5ZV2x1WENJNmUxd2lkbUZzZFdWY0lqb3dMalVzWENKcGJuQjFkSE5jSWpwYlhYMHNYQ0pwYm5CMWRITmNJanBiWENJOFkybHlZM1ZzWVhJNlJHVnNZWGxPYjJSbFBsd2lYWDFkZlN4N1hDSnVZVzFsWENJNlhDSlBjMk5wYkd4aGRHOXlUbTlrWlZ3aUxGd2lkSGx3WlZ3aU9sd2ljMmx1WlZ3aUxGd2labkpsY1hWbGJtTjVYQ0k2ZTF3aWRtRnNkV1ZjSWpvME5EQXNYQ0pwYm5CMWRITmNJanBiWFgwc1hDSmtaWFIxYm1WY0lqcDdYQ0oyWVd4MVpWd2lPakFzWENKcGJuQjFkSE5jSWpwYlhYMHNYQ0pwYm5CMWRITmNJanBiWFgxZGZWMTlYWDBzZTF3aWJtRnRaVndpT2x3aVUzUmxjbVZ2VUdGdWJtVnlUbTlrWlZ3aUxGd2ljR0Z1WENJNmUxd2lkbUZzZFdWY0lqb3hMRndpYVc1d2RYUnpYQ0k2VzExOUxGd2lhVzV3ZFhSelhDSTZXM3RjSW01aGJXVmNJanBjSWtSbGJHRjVUbTlrWlZ3aUxGd2laR1ZzWVhsVWFXMWxYQ0k2ZTF3aWRtRnNkV1ZjSWpvd0xqVXNYQ0pwYm5CMWRITmNJanBiWFgwc1hDSnBibkIxZEhOY0lqcGJlMXdpYm1GdFpWd2lPbHdpUjJGcGJrNXZaR1ZjSWl4Y0ltZGhhVzVjSWpwN1hDSjJZV3gxWlZ3aU9qQXVOU3hjSW1sdWNIVjBjMXdpT2x0ZGZTeGNJbWx1Y0hWMGMxd2lPbHQ3WENKdVlXMWxYQ0k2WENKRVpXeGhlVTV2WkdWY0lpeGNJbVJsYkdGNVZHbHRaVndpT250Y0luWmhiSFZsWENJNk1DNDFMRndpYVc1d2RYUnpYQ0k2VzExOUxGd2lhVzV3ZFhSelhDSTZXM3RjSW01aGJXVmNJanBjSWtkaGFXNU9iMlJsWENJc1hDSm5ZV2x1WENJNmUxd2lkbUZzZFdWY0lqb3dMalVzWENKcGJuQjFkSE5jSWpwYlhYMHNYQ0pwYm5CMWRITmNJanBiWENJOFkybHlZM1ZzWVhJNlJHVnNZWGxPYjJSbFBsd2lMSHRjSW01aGJXVmNJanBjSWs5elkybHNiR0YwYjNKT2IyUmxYQ0lzWENKMGVYQmxYQ0k2WENKemFXNWxYQ0lzWENKbWNtVnhkV1Z1WTNsY0lqcDdYQ0oyWVd4MVpWd2lPalEwTUN4Y0ltbHVjSFYwYzF3aU9sdGRmU3hjSW1SbGRIVnVaVndpT250Y0luWmhiSFZsWENJNk1DeGNJbWx1Y0hWMGMxd2lPbHRkZlN4Y0ltbHVjSFYwYzF3aU9sdGRmVjE5WFgxZGZWMTlYWDFkZlYxOUtTa3VkRzlDWlNoMGNuVmxLVHRjYmlBZ2ZTazdYRzVjYmlBZ2FYUW9KMk5oYmlCa1pXWnBibVVnWVNCamRYTjBiMjBnYm05a1pTQmlkV2xzZENCdlppQnZkR2hsY2lCamRYTjBiMjBnYm05a1pYTW5MQ0FvS1NBOVBpQjdYRzRnSUNBZ2RtbHlkSFZoYkVGMVpHbHZSM0poY0dndVpHVm1hVzVsVG05a1pTaHdhVzVuVUc5dVowUmxiR0Y1VUdGeVlXMXpSbUZqZEc5eWVTd2dKM0JwYm1kUWIyNW5SR1ZzWVhrbktUdGNibHh1SUNBZ0lHTnZibk4wSUhGMWFXVjBjR2x1WjFCdmJtZEVaV3hoZVZCaGNtRnRjMFpoWTNSdmNua2dQU0FvS1NBOVBpQmJYRzRnSUNBZ0lDQjdYRzRnSUNBZ0lDQWdJR2xrT2lBd0xGeHVJQ0FnSUNBZ0lDQnViMlJsT2lBbloyRnBiaWNzWEc0Z0lDQWdJQ0FnSUc5MWRIQjFkRG9nSjI5MWRIQjFkQ2NzWEc0Z0lDQWdJQ0I5TEZ4dUlDQWdJQ0FnZTF4dUlDQWdJQ0FnSUNCcFpEb2dNU3hjYmlBZ0lDQWdJQ0FnYm05a1pUb2dKM0JwYm1kUWIyNW5SR1ZzWVhrbkxGeHVJQ0FnSUNBZ0lDQnZkWFJ3ZFhRNklEQXNYRzRnSUNBZ0lDQjlMRnh1SUNBZ0lDQWdlMXh1SUNBZ0lDQWdJQ0JwWkRvZ01peGNiaUFnSUNBZ0lDQWdibTlrWlRvZ0oyOXpZMmxzYkdGMGIzSW5MRnh1SUNBZ0lDQWdJQ0J2ZFhSd2RYUTZJREVzWEc0Z0lDQWdJQ0I5TEZ4dUlDQWdJRjA3WEc1Y2JpQWdJQ0IyYVhKMGRXRnNRWFZrYVc5SGNtRndhQzVrWldacGJtVk9iMlJsS0hGMWFXVjBjR2x1WjFCdmJtZEVaV3hoZVZCaGNtRnRjMFpoWTNSdmNua3NJQ2R4ZFdsbGRGQnBibWRRYjI1blJHVnNZWGtuS1R0Y2JseHVJQ0FnSUdOdmJuTjBJSFpwY25SMVlXeE9iMlJsVUdGeVlXMXpJRDBnVzF4dUlDQWdJQ0FnZTF4dUlDQWdJQ0FnSUNCcFpEb2dNQ3hjYmlBZ0lDQWdJQ0FnYm05a1pUb2dKMmRoYVc0bkxGeHVJQ0FnSUNBZ0lDQnZkWFJ3ZFhRNklDZHZkWFJ3ZFhRbkxGeHVJQ0FnSUNBZ0lDQndZWEpoYlhNNklIdGNiaUFnSUNBZ0lDQWdJQ0JuWVdsdU9pQXdMalVzWEc0Z0lDQWdJQ0FnSUgxY2JpQWdJQ0FnSUgwc1hHNGdJQ0FnSUNCN1hHNGdJQ0FnSUNBZ0lHbGtPaUF4TEZ4dUlDQWdJQ0FnSUNCdWIyUmxPaUFuY1hWcFpYUlFhVzVuVUc5dVowUmxiR0Y1Snl4Y2JpQWdJQ0FnSUNBZ2IzVjBjSFYwT2lBd0xGeHVJQ0FnSUNBZ2ZTeGNiaUFnSUNBZ0lIdGNiaUFnSUNBZ0lDQWdhV1E2SURJc1hHNGdJQ0FnSUNBZ0lHNXZaR1U2SUNkd2FXNW5VRzl1WjBSbGJHRjVKeXhjYmlBZ0lDQWdJQ0FnYjNWMGNIVjBPaUF4TEZ4dUlDQWdJQ0FnZlN4Y2JpQWdJQ0FnSUh0Y2JpQWdJQ0FnSUNBZ2FXUTZJRE1zWEc0Z0lDQWdJQ0FnSUc1dlpHVTZJQ2R2YzJOcGJHeGhkRzl5Snl4Y2JpQWdJQ0FnSUNBZ2IzVjBjSFYwT2lBeUxGeHVJQ0FnSUNBZ2ZTeGNiaUFnSUNCZE8xeHVYRzRnSUNBZ1pYaHdaV04wS0hacGNuUjFZV3hCZFdScGIwZHlZWEJvTG5Wd1pHRjBaU2gyYVhKMGRXRnNUbTlrWlZCaGNtRnRjeWtwTG5SdlFtVW9kbWx5ZEhWaGJFRjFaR2x2UjNKaGNHZ3BPMXh1SUNBZ0lHVjRjR1ZqZENobGNYVmhiSE1vWVhWa2FXOURiMjUwWlhoMExuUnZTbE5QVGlncExDQjdYQ0p1WVcxbFhDSTZYQ0pCZFdScGIwUmxjM1JwYm1GMGFXOXVUbTlrWlZ3aUxGd2lhVzV3ZFhSelhDSTZXM3RjSW01aGJXVmNJanBjSWtkaGFXNU9iMlJsWENJc1hDSm5ZV2x1WENJNmUxd2lkbUZzZFdWY0lqb3dMalVzWENKcGJuQjFkSE5jSWpwYlhYMHNYQ0pwYm5CMWRITmNJanBiZTF3aWJtRnRaVndpT2x3aVIyRnBiazV2WkdWY0lpeGNJbWRoYVc1Y0lqcDdYQ0oyWVd4MVpWd2lPakVzWENKcGJuQjFkSE5jSWpwYlhYMHNYQ0pwYm5CMWRITmNJanBiZTF3aWJtRnRaVndpT2x3aVUzUmxjbVZ2VUdGdWJtVnlUbTlrWlZ3aUxGd2ljR0Z1WENJNmUxd2lkbUZzZFdWY0lqb3RNU3hjSW1sdWNIVjBjMXdpT2x0ZGZTeGNJbWx1Y0hWMGMxd2lPbHQ3WENKdVlXMWxYQ0k2WENKRVpXeGhlVTV2WkdWY0lpeGNJbVJsYkdGNVZHbHRaVndpT250Y0luWmhiSFZsWENJNk1DNHpNek16TXpNek16TXpNek16TXpNekxGd2lhVzV3ZFhSelhDSTZXMTE5TEZ3aWFXNXdkWFJ6WENJNlczdGNJbTVoYldWY0lqcGNJa2RoYVc1T2IyUmxYQ0lzWENKbllXbHVYQ0k2ZTF3aWRtRnNkV1ZjSWpvd0xqTXpNek16TXpNek16TXpNek16TXpNc1hDSnBibkIxZEhOY0lqcGJYWDBzWENKcGJuQjFkSE5jSWpwYmUxd2libUZ0WlZ3aU9sd2lSR1ZzWVhsT2IyUmxYQ0lzWENKa1pXeGhlVlJwYldWY0lqcDdYQ0oyWVd4MVpWd2lPakF1TXpNek16TXpNek16TXpNek16TXpNeXhjSW1sdWNIVjBjMXdpT2x0ZGZTeGNJbWx1Y0hWMGMxd2lPbHQ3WENKdVlXMWxYQ0k2WENKSFlXbHVUbTlrWlZ3aUxGd2laMkZwYmx3aU9udGNJblpoYkhWbFhDSTZNQzR6TXpNek16TXpNek16TXpNek16TXpMRndpYVc1d2RYUnpYQ0k2VzExOUxGd2lhVzV3ZFhSelhDSTZXMXdpUEdOcGNtTjFiR0Z5T2tSbGJHRjVUbTlrWlQ1Y0lsMTlYWDBzZTF3aWJtRnRaVndpT2x3aVQzTmphV3hzWVhSdmNrNXZaR1ZjSWl4Y0luUjVjR1ZjSWpwY0luTnBibVZjSWl4Y0ltWnlaWEYxWlc1amVWd2lPbnRjSW5aaGJIVmxYQ0k2TkRRd0xGd2lhVzV3ZFhSelhDSTZXMTE5TEZ3aVpHVjBkVzVsWENJNmUxd2lkbUZzZFdWY0lqb3dMRndpYVc1d2RYUnpYQ0k2VzExOUxGd2lhVzV3ZFhSelhDSTZXMTE5WFgxZGZWMTlMSHRjSW01aGJXVmNJanBjSWxOMFpYSmxiMUJoYm01bGNrNXZaR1ZjSWl4Y0luQmhibHdpT250Y0luWmhiSFZsWENJNk1TeGNJbWx1Y0hWMGMxd2lPbHRkZlN4Y0ltbHVjSFYwYzF3aU9sdDdYQ0p1WVcxbFhDSTZYQ0pFWld4aGVVNXZaR1ZjSWl4Y0ltUmxiR0Y1VkdsdFpWd2lPbnRjSW5aaGJIVmxYQ0k2TUM0ek16TXpNek16TXpNek16TXpNek16TEZ3aWFXNXdkWFJ6WENJNlcxMTlMRndpYVc1d2RYUnpYQ0k2VzN0Y0ltNWhiV1ZjSWpwY0lrZGhhVzVPYjJSbFhDSXNYQ0puWVdsdVhDSTZlMXdpZG1Gc2RXVmNJam93TGpNek16TXpNek16TXpNek16TXpNek1zWENKcGJuQjFkSE5jSWpwYlhYMHNYQ0pwYm5CMWRITmNJanBiZTF3aWJtRnRaVndpT2x3aVJHVnNZWGxPYjJSbFhDSXNYQ0prWld4aGVWUnBiV1ZjSWpwN1hDSjJZV3gxWlZ3aU9qQXVNek16TXpNek16TXpNek16TXpNek15eGNJbWx1Y0hWMGMxd2lPbHRkZlN4Y0ltbHVjSFYwYzF3aU9sdDdYQ0p1WVcxbFhDSTZYQ0pIWVdsdVRtOWtaVndpTEZ3aVoyRnBibHdpT250Y0luWmhiSFZsWENJNk1DNHpNek16TXpNek16TXpNek16TXpNekxGd2lhVzV3ZFhSelhDSTZXMTE5TEZ3aWFXNXdkWFJ6WENJNlcxd2lQR05wY21OMWJHRnlPa1JsYkdGNVRtOWtaVDVjSWl4N1hDSnVZVzFsWENJNlhDSlBjMk5wYkd4aGRHOXlUbTlrWlZ3aUxGd2lkSGx3WlZ3aU9sd2ljMmx1WlZ3aUxGd2labkpsY1hWbGJtTjVYQ0k2ZTF3aWRtRnNkV1ZjSWpvME5EQXNYQ0pwYm5CMWRITmNJanBiWFgwc1hDSmtaWFIxYm1WY0lqcDdYQ0oyWVd4MVpWd2lPakFzWENKcGJuQjFkSE5jSWpwYlhYMHNYQ0pwYm5CMWRITmNJanBiWFgxZGZWMTlYWDFkZlYxOVhYMWRmVjE5S1NrdWRHOUNaU2gwY25WbEtUdGNiaUFnZlNrN1hHNWNiaUFnYVhRb0oyTmhiaUJrWldacGJtVWdZU0JqZFhOMGIyMGdibTlrWlNCM2FHbGphQ0JqWVc0Z1ltVWdkWEJrWVhSbFpDY3NJQ2dwSUQwK0lIdGNiaUFnSUNCMmFYSjBkV0ZzUVhWa2FXOUhjbUZ3YUM1a1pXWnBibVZPYjJSbEtIQnBibWRRYjI1blJHVnNZWGxRWVhKaGJYTkdZV04wYjNKNUxDQW5jR2x1WjFCdmJtZEVaV3hoZVNjcE8xeHVYRzRnSUNBZ1kyOXVjM1FnZG1seWRIVmhiRTV2WkdWUVlYSmhiWE1nUFNCYlhHNGdJQ0FnSUNCN1hHNGdJQ0FnSUNBZ0lHbGtPaUF3TEZ4dUlDQWdJQ0FnSUNCdWIyUmxPaUFuWjJGcGJpY3NYRzRnSUNBZ0lDQWdJRzkxZEhCMWREb2dKMjkxZEhCMWRDY3NYRzRnSUNBZ0lDQWdJSEJoY21GdGN6b2dlMXh1SUNBZ0lDQWdJQ0FnSUdkaGFXNDZJREF1TlN4Y2JpQWdJQ0FnSUNBZ2ZWeHVJQ0FnSUNBZ2ZTeGNiaUFnSUNBZ0lIdGNiaUFnSUNBZ0lDQWdhV1E2SURFc1hHNGdJQ0FnSUNBZ0lHNXZaR1U2SUNkd2FXNW5VRzl1WjBSbGJHRjVKeXhjYmlBZ0lDQWdJQ0FnYjNWMGNIVjBPaUF3TEZ4dUlDQWdJQ0FnSUNCd1lYSmhiWE02SUh0Y2JpQWdJQ0FnSUNBZ0lDQmtaV05oZVRvZ01DNDFMRnh1SUNBZ0lDQWdJQ0FnSUdSbGJHRjVWR2x0WlRvZ01DNDFMRnh1SUNBZ0lDQWdJQ0FnSUcxaGVFUmxiR0Y1VkdsdFpUb2dNQzQxTEZ4dUlDQWdJQ0FnSUNCOVhHNGdJQ0FnSUNCOUxGeHVJQ0FnSUNBZ2UxeHVJQ0FnSUNBZ0lDQnBaRG9nTWl4Y2JpQWdJQ0FnSUNBZ2JtOWtaVG9nSjI5elkybHNiR0YwYjNJbkxGeHVJQ0FnSUNBZ0lDQnZkWFJ3ZFhRNklERXNYRzRnSUNBZ0lDQjlMRnh1SUNBZ0lGMDdYRzVjYmlBZ0lDQjJhWEowZFdGc1FYVmthVzlIY21Gd2FDNTFjR1JoZEdVb2RtbHlkSFZoYkU1dlpHVlFZWEpoYlhNcE8xeHVYRzRnSUNBZ1pYaHdaV04wS0dWeGRXRnNjeWhoZFdScGIwTnZiblJsZUhRdWRHOUtVMDlPS0Nrc0lIdGNJbTVoYldWY0lqcGNJa0YxWkdsdlJHVnpkR2x1WVhScGIyNU9iMlJsWENJc1hDSnBibkIxZEhOY0lqcGJlMXdpYm1GdFpWd2lPbHdpUjJGcGJrNXZaR1ZjSWl4Y0ltZGhhVzVjSWpwN1hDSjJZV3gxWlZ3aU9qQXVOU3hjSW1sdWNIVjBjMXdpT2x0ZGZTeGNJbWx1Y0hWMGMxd2lPbHQ3WENKdVlXMWxYQ0k2WENKVGRHVnlaVzlRWVc1dVpYSk9iMlJsWENJc1hDSndZVzVjSWpwN1hDSjJZV3gxWlZ3aU9pMHhMRndpYVc1d2RYUnpYQ0k2VzExOUxGd2lhVzV3ZFhSelhDSTZXM3RjSW01aGJXVmNJanBjSWtSbGJHRjVUbTlrWlZ3aUxGd2laR1ZzWVhsVWFXMWxYQ0k2ZTF3aWRtRnNkV1ZjSWpvd0xqVXNYQ0pwYm5CMWRITmNJanBiWFgwc1hDSnBibkIxZEhOY0lqcGJlMXdpYm1GdFpWd2lPbHdpUjJGcGJrNXZaR1ZjSWl4Y0ltZGhhVzVjSWpwN1hDSjJZV3gxWlZ3aU9qQXVOU3hjSW1sdWNIVjBjMXdpT2x0ZGZTeGNJbWx1Y0hWMGMxd2lPbHQ3WENKdVlXMWxYQ0k2WENKRVpXeGhlVTV2WkdWY0lpeGNJbVJsYkdGNVZHbHRaVndpT250Y0luWmhiSFZsWENJNk1DNDFMRndpYVc1d2RYUnpYQ0k2VzExOUxGd2lhVzV3ZFhSelhDSTZXM3RjSW01aGJXVmNJanBjSWtkaGFXNU9iMlJsWENJc1hDSm5ZV2x1WENJNmUxd2lkbUZzZFdWY0lqb3dMalVzWENKcGJuQjFkSE5jSWpwYlhYMHNYQ0pwYm5CMWRITmNJanBiWENJOFkybHlZM1ZzWVhJNlJHVnNZWGxPYjJSbFBsd2lYWDFkZlN4N1hDSnVZVzFsWENJNlhDSlBjMk5wYkd4aGRHOXlUbTlrWlZ3aUxGd2lkSGx3WlZ3aU9sd2ljMmx1WlZ3aUxGd2labkpsY1hWbGJtTjVYQ0k2ZTF3aWRtRnNkV1ZjSWpvME5EQXNYQ0pwYm5CMWRITmNJanBiWFgwc1hDSmtaWFIxYm1WY0lqcDdYQ0oyWVd4MVpWd2lPakFzWENKcGJuQjFkSE5jSWpwYlhYMHNYQ0pwYm5CMWRITmNJanBiWFgxZGZWMTlYWDBzZTF3aWJtRnRaVndpT2x3aVUzUmxjbVZ2VUdGdWJtVnlUbTlrWlZ3aUxGd2ljR0Z1WENJNmUxd2lkbUZzZFdWY0lqb3hMRndpYVc1d2RYUnpYQ0k2VzExOUxGd2lhVzV3ZFhSelhDSTZXM3RjSW01aGJXVmNJanBjSWtSbGJHRjVUbTlrWlZ3aUxGd2laR1ZzWVhsVWFXMWxYQ0k2ZTF3aWRtRnNkV1ZjSWpvd0xqVXNYQ0pwYm5CMWRITmNJanBiWFgwc1hDSnBibkIxZEhOY0lqcGJlMXdpYm1GdFpWd2lPbHdpUjJGcGJrNXZaR1ZjSWl4Y0ltZGhhVzVjSWpwN1hDSjJZV3gxWlZ3aU9qQXVOU3hjSW1sdWNIVjBjMXdpT2x0ZGZTeGNJbWx1Y0hWMGMxd2lPbHQ3WENKdVlXMWxYQ0k2WENKRVpXeGhlVTV2WkdWY0lpeGNJbVJsYkdGNVZHbHRaVndpT250Y0luWmhiSFZsWENJNk1DNDFMRndpYVc1d2RYUnpYQ0k2VzExOUxGd2lhVzV3ZFhSelhDSTZXM3RjSW01aGJXVmNJanBjSWtkaGFXNU9iMlJsWENJc1hDSm5ZV2x1WENJNmUxd2lkbUZzZFdWY0lqb3dMalVzWENKcGJuQjFkSE5jSWpwYlhYMHNYQ0pwYm5CMWRITmNJanBiWENJOFkybHlZM1ZzWVhJNlJHVnNZWGxPYjJSbFBsd2lMSHRjSW01aGJXVmNJanBjSWs5elkybHNiR0YwYjNKT2IyUmxYQ0lzWENKMGVYQmxYQ0k2WENKemFXNWxYQ0lzWENKbWNtVnhkV1Z1WTNsY0lqcDdYQ0oyWVd4MVpWd2lPalEwTUN4Y0ltbHVjSFYwYzF3aU9sdGRmU3hjSW1SbGRIVnVaVndpT250Y0luWmhiSFZsWENJNk1DeGNJbWx1Y0hWMGMxd2lPbHRkZlN4Y0ltbHVjSFYwYzF3aU9sdGRmVjE5WFgxZGZWMTlYWDFkZlYxOUtTa3VkRzlDWlNoMGNuVmxLVHRjYmx4dUlDQWdJSFpwY25SMVlXeE9iMlJsVUdGeVlXMXpXekZkTG5CaGNtRnRjeTVrWldOaGVTQTlJREF1Tmp0Y2JseHVJQ0FnSUhacGNuUjFZV3hCZFdScGIwZHlZWEJvTG5Wd1pHRjBaU2gyYVhKMGRXRnNUbTlrWlZCaGNtRnRjeWs3WEc1Y2JpQWdJQ0JsZUhCbFkzUW9aWEYxWVd4ektHRjFaR2x2UTI5dWRHVjRkQzUwYjBwVFQwNG9LU3dnZTF3aWJtRnRaVndpT2x3aVFYVmthVzlFWlhOMGFXNWhkR2x2Yms1dlpHVmNJaXhjSW1sdWNIVjBjMXdpT2x0N1hDSnVZVzFsWENJNlhDSkhZV2x1VG05a1pWd2lMRndpWjJGcGJsd2lPbnRjSW5aaGJIVmxYQ0k2TUM0MUxGd2lhVzV3ZFhSelhDSTZXMTE5TEZ3aWFXNXdkWFJ6WENJNlczdGNJbTVoYldWY0lqcGNJbE4wWlhKbGIxQmhibTVsY2s1dlpHVmNJaXhjSW5CaGJsd2lPbnRjSW5aaGJIVmxYQ0k2TFRFc1hDSnBibkIxZEhOY0lqcGJYWDBzWENKcGJuQjFkSE5jSWpwYmUxd2libUZ0WlZ3aU9sd2lSR1ZzWVhsT2IyUmxYQ0lzWENKa1pXeGhlVlJwYldWY0lqcDdYQ0oyWVd4MVpWd2lPakF1TlN4Y0ltbHVjSFYwYzF3aU9sdGRmU3hjSW1sdWNIVjBjMXdpT2x0N1hDSnVZVzFsWENJNlhDSkhZV2x1VG05a1pWd2lMRndpWjJGcGJsd2lPbnRjSW5aaGJIVmxYQ0k2TUM0MkxGd2lhVzV3ZFhSelhDSTZXMTE5TEZ3aWFXNXdkWFJ6WENJNlczdGNJbTVoYldWY0lqcGNJa1JsYkdGNVRtOWtaVndpTEZ3aVpHVnNZWGxVYVcxbFhDSTZlMXdpZG1Gc2RXVmNJam93TGpVc1hDSnBibkIxZEhOY0lqcGJYWDBzWENKcGJuQjFkSE5jSWpwYmUxd2libUZ0WlZ3aU9sd2lSMkZwYms1dlpHVmNJaXhjSW1kaGFXNWNJanA3WENKMllXeDFaVndpT2pBdU5peGNJbWx1Y0hWMGMxd2lPbHRkZlN4Y0ltbHVjSFYwYzF3aU9sdGNJanhqYVhKamRXeGhjanBFWld4aGVVNXZaR1UrWENKZGZWMTlMSHRjSW01aGJXVmNJanBjSWs5elkybHNiR0YwYjNKT2IyUmxYQ0lzWENKMGVYQmxYQ0k2WENKemFXNWxYQ0lzWENKbWNtVnhkV1Z1WTNsY0lqcDdYQ0oyWVd4MVpWd2lPalEwTUN4Y0ltbHVjSFYwYzF3aU9sdGRmU3hjSW1SbGRIVnVaVndpT250Y0luWmhiSFZsWENJNk1DeGNJbWx1Y0hWMGMxd2lPbHRkZlN4Y0ltbHVjSFYwYzF3aU9sdGRmVjE5WFgxZGZTeDdYQ0p1WVcxbFhDSTZYQ0pUZEdWeVpXOVFZVzV1WlhKT2IyUmxYQ0lzWENKd1lXNWNJanA3WENKMllXeDFaVndpT2pFc1hDSnBibkIxZEhOY0lqcGJYWDBzWENKcGJuQjFkSE5jSWpwYmUxd2libUZ0WlZ3aU9sd2lSR1ZzWVhsT2IyUmxYQ0lzWENKa1pXeGhlVlJwYldWY0lqcDdYQ0oyWVd4MVpWd2lPakF1TlN4Y0ltbHVjSFYwYzF3aU9sdGRmU3hjSW1sdWNIVjBjMXdpT2x0N1hDSnVZVzFsWENJNlhDSkhZV2x1VG05a1pWd2lMRndpWjJGcGJsd2lPbnRjSW5aaGJIVmxYQ0k2TUM0MkxGd2lhVzV3ZFhSelhDSTZXMTE5TEZ3aWFXNXdkWFJ6WENJNlczdGNJbTVoYldWY0lqcGNJa1JsYkdGNVRtOWtaVndpTEZ3aVpHVnNZWGxVYVcxbFhDSTZlMXdpZG1Gc2RXVmNJam93TGpVc1hDSnBibkIxZEhOY0lqcGJYWDBzWENKcGJuQjFkSE5jSWpwYmUxd2libUZ0WlZ3aU9sd2lSMkZwYms1dlpHVmNJaXhjSW1kaGFXNWNJanA3WENKMllXeDFaVndpT2pBdU5peGNJbWx1Y0hWMGMxd2lPbHRkZlN4Y0ltbHVjSFYwYzF3aU9sdGNJanhqYVhKamRXeGhjanBFWld4aGVVNXZaR1UrWENJc2Uxd2libUZ0WlZ3aU9sd2lUM05qYVd4c1lYUnZjazV2WkdWY0lpeGNJblI1Y0dWY0lqcGNJbk5wYm1WY0lpeGNJbVp5WlhGMVpXNWplVndpT250Y0luWmhiSFZsWENJNk5EUXdMRndpYVc1d2RYUnpYQ0k2VzExOUxGd2laR1YwZFc1bFhDSTZlMXdpZG1Gc2RXVmNJam93TEZ3aWFXNXdkWFJ6WENJNlcxMTlMRndpYVc1d2RYUnpYQ0k2VzExOVhYMWRmVjE5WFgxZGZWMTlYWDBwS1M1MGIwSmxLSFJ5ZFdVcE8xeHVJQ0I5S1R0Y2JseHVJQ0JwZENnblkyRnVJR1JsWm1sdVpTQmhJR04xYzNSdmJTQnViMlJsSUhkb2FXTm9JR05oYmlCaVpTQnlaVzF2ZG1Wa0p5d2dLQ2tnUFQ0Z2UxeHVJQ0FnSUhacGNuUjFZV3hCZFdScGIwZHlZWEJvTG1SbFptbHVaVTV2WkdVb2NHbHVaMUJ2Ym1kRVpXeGhlVkJoY21GdGMwWmhZM1J2Y25rc0lDZHdhVzVuVUc5dVowUmxiR0Y1SnlrN1hHNWNiaUFnSUNCamIyNXpkQ0IyYVhKMGRXRnNUbTlrWlZCaGNtRnRjeUE5SUZ0Y2JpQWdJQ0FnSUh0Y2JpQWdJQ0FnSUNBZ2FXUTZJREFzWEc0Z0lDQWdJQ0FnSUc1dlpHVTZJQ2RuWVdsdUp5eGNiaUFnSUNBZ0lDQWdiM1YwY0hWME9pQW5iM1YwY0hWMEp5eGNiaUFnSUNBZ0lDQWdjR0Z5WVcxek9pQjdYRzRnSUNBZ0lDQWdJQ0FnWjJGcGJqb2dNQzQxTEZ4dUlDQWdJQ0FnSUNCOVhHNGdJQ0FnSUNCOUxGeHVJQ0FnSUNBZ2UxeHVJQ0FnSUNBZ0lDQnBaRG9nTVN4Y2JpQWdJQ0FnSUNBZ2JtOWtaVG9nSjNCcGJtZFFiMjVuUkdWc1lYa25MRnh1SUNBZ0lDQWdJQ0J2ZFhSd2RYUTZJREFzWEc0Z0lDQWdJQ0FnSUhCaGNtRnRjem9nZTF4dUlDQWdJQ0FnSUNBZ0lHUmxZMkY1T2lBd0xqVXNYRzRnSUNBZ0lDQWdJQ0FnWkdWc1lYbFVhVzFsT2lBd0xqVXNYRzRnSUNBZ0lDQWdJQ0FnYldGNFJHVnNZWGxVYVcxbE9pQXdMalVzWEc0Z0lDQWdJQ0FnSUgxY2JpQWdJQ0FnSUgwc1hHNGdJQ0FnSUNCN1hHNGdJQ0FnSUNBZ0lHbGtPaUF5TEZ4dUlDQWdJQ0FnSUNCdWIyUmxPaUFuYjNOamFXeHNZWFJ2Y2ljc1hHNGdJQ0FnSUNBZ0lHOTFkSEIxZERvZ01TeGNiaUFnSUNBZ0lIMHNYRzRnSUNBZ1hUdGNibHh1SUNBZ0lIWnBjblIxWVd4QmRXUnBiMGR5WVhCb0xuVndaR0YwWlNoMmFYSjBkV0ZzVG05a1pWQmhjbUZ0Y3lrN1hHNWNiaUFnSUNCbGVIQmxZM1FvWlhGMVlXeHpLR0YxWkdsdlEyOXVkR1Y0ZEM1MGIwcFRUMDRvS1N3Z2Uxd2libUZ0WlZ3aU9sd2lRWFZrYVc5RVpYTjBhVzVoZEdsdmJrNXZaR1ZjSWl4Y0ltbHVjSFYwYzF3aU9sdDdYQ0p1WVcxbFhDSTZYQ0pIWVdsdVRtOWtaVndpTEZ3aVoyRnBibHdpT250Y0luWmhiSFZsWENJNk1DNDFMRndpYVc1d2RYUnpYQ0k2VzExOUxGd2lhVzV3ZFhSelhDSTZXM3RjSW01aGJXVmNJanBjSWxOMFpYSmxiMUJoYm01bGNrNXZaR1ZjSWl4Y0luQmhibHdpT250Y0luWmhiSFZsWENJNkxURXNYQ0pwYm5CMWRITmNJanBiWFgwc1hDSnBibkIxZEhOY0lqcGJlMXdpYm1GdFpWd2lPbHdpUkdWc1lYbE9iMlJsWENJc1hDSmtaV3hoZVZScGJXVmNJanA3WENKMllXeDFaVndpT2pBdU5TeGNJbWx1Y0hWMGMxd2lPbHRkZlN4Y0ltbHVjSFYwYzF3aU9sdDdYQ0p1WVcxbFhDSTZYQ0pIWVdsdVRtOWtaVndpTEZ3aVoyRnBibHdpT250Y0luWmhiSFZsWENJNk1DNDFMRndpYVc1d2RYUnpYQ0k2VzExOUxGd2lhVzV3ZFhSelhDSTZXM3RjSW01aGJXVmNJanBjSWtSbGJHRjVUbTlrWlZ3aUxGd2laR1ZzWVhsVWFXMWxYQ0k2ZTF3aWRtRnNkV1ZjSWpvd0xqVXNYQ0pwYm5CMWRITmNJanBiWFgwc1hDSnBibkIxZEhOY0lqcGJlMXdpYm1GdFpWd2lPbHdpUjJGcGJrNXZaR1ZjSWl4Y0ltZGhhVzVjSWpwN1hDSjJZV3gxWlZ3aU9qQXVOU3hjSW1sdWNIVjBjMXdpT2x0ZGZTeGNJbWx1Y0hWMGMxd2lPbHRjSWp4amFYSmpkV3hoY2pwRVpXeGhlVTV2WkdVK1hDSmRmVjE5TEh0Y0ltNWhiV1ZjSWpwY0lrOXpZMmxzYkdGMGIzSk9iMlJsWENJc1hDSjBlWEJsWENJNlhDSnphVzVsWENJc1hDSm1jbVZ4ZFdWdVkzbGNJanA3WENKMllXeDFaVndpT2pRME1DeGNJbWx1Y0hWMGMxd2lPbHRkZlN4Y0ltUmxkSFZ1WlZ3aU9udGNJblpoYkhWbFhDSTZNQ3hjSW1sdWNIVjBjMXdpT2x0ZGZTeGNJbWx1Y0hWMGMxd2lPbHRkZlYxOVhYMWRmU3g3WENKdVlXMWxYQ0k2WENKVGRHVnlaVzlRWVc1dVpYSk9iMlJsWENJc1hDSndZVzVjSWpwN1hDSjJZV3gxWlZ3aU9qRXNYQ0pwYm5CMWRITmNJanBiWFgwc1hDSnBibkIxZEhOY0lqcGJlMXdpYm1GdFpWd2lPbHdpUkdWc1lYbE9iMlJsWENJc1hDSmtaV3hoZVZScGJXVmNJanA3WENKMllXeDFaVndpT2pBdU5TeGNJbWx1Y0hWMGMxd2lPbHRkZlN4Y0ltbHVjSFYwYzF3aU9sdDdYQ0p1WVcxbFhDSTZYQ0pIWVdsdVRtOWtaVndpTEZ3aVoyRnBibHdpT250Y0luWmhiSFZsWENJNk1DNDFMRndpYVc1d2RYUnpYQ0k2VzExOUxGd2lhVzV3ZFhSelhDSTZXM3RjSW01aGJXVmNJanBjSWtSbGJHRjVUbTlrWlZ3aUxGd2laR1ZzWVhsVWFXMWxYQ0k2ZTF3aWRtRnNkV1ZjSWpvd0xqVXNYQ0pwYm5CMWRITmNJanBiWFgwc1hDSnBibkIxZEhOY0lqcGJlMXdpYm1GdFpWd2lPbHdpUjJGcGJrNXZaR1ZjSWl4Y0ltZGhhVzVjSWpwN1hDSjJZV3gxWlZ3aU9qQXVOU3hjSW1sdWNIVjBjMXdpT2x0ZGZTeGNJbWx1Y0hWMGMxd2lPbHRjSWp4amFYSmpkV3hoY2pwRVpXeGhlVTV2WkdVK1hDSXNlMXdpYm1GdFpWd2lPbHdpVDNOamFXeHNZWFJ2Y2s1dlpHVmNJaXhjSW5SNWNHVmNJanBjSW5OcGJtVmNJaXhjSW1aeVpYRjFaVzVqZVZ3aU9udGNJblpoYkhWbFhDSTZORFF3TEZ3aWFXNXdkWFJ6WENJNlcxMTlMRndpWkdWMGRXNWxYQ0k2ZTF3aWRtRnNkV1ZjSWpvd0xGd2lhVzV3ZFhSelhDSTZXMTE5TEZ3aWFXNXdkWFJ6WENJNlcxMTlYWDFkZlYxOVhYMWRmVjE5WFgwcEtTNTBiMEpsS0hSeWRXVXBPMXh1WEc0Z0lDQWdkbWx5ZEhWaGJFNXZaR1ZRWVhKaGJYTmJNVjB1Y0dGeVlXMXpMbVJsWTJGNUlEMGdNQzQyTzF4dVhHNGdJQ0FnZG1seWRIVmhiRUYxWkdsdlIzSmhjR2d1ZFhCa1lYUmxLRnRjYmlBZ0lDQWdJSHRjYmlBZ0lDQWdJQ0FnYVdRNklEQXNYRzRnSUNBZ0lDQWdJRzV2WkdVNklDZG5ZV2x1Snl4Y2JpQWdJQ0FnSUNBZ2IzVjBjSFYwT2lBbmIzVjBjSFYwSnl4Y2JpQWdJQ0FnSUNBZ2NHRnlZVzF6T2lCN1hHNGdJQ0FnSUNBZ0lDQWdaMkZwYmpvZ01DNDFMRnh1SUNBZ0lDQWdJQ0I5WEc0Z0lDQWdJQ0I5WEc0Z0lDQWdYU2s3WEc1Y2JpQWdJQ0JsZUhCbFkzUW9aWEYxWVd4ektHRjFaR2x2UTI5dWRHVjRkQzUwYjBwVFQwNG9LU3dnZTF3aWJtRnRaVndpT2x3aVFYVmthVzlFWlhOMGFXNWhkR2x2Yms1dlpHVmNJaXhjSW1sdWNIVjBjMXdpT2x0N1hDSnVZVzFsWENJNlhDSkhZV2x1VG05a1pWd2lMRndpWjJGcGJsd2lPbnRjSW5aaGJIVmxYQ0k2TUM0MUxGd2lhVzV3ZFhSelhDSTZXMTE5TEZ3aWFXNXdkWFJ6WENJNlcxMTlYWDBwS1M1MGIwSmxLSFJ5ZFdVcE8xeHVJQ0I5S1R0Y2JuMHBPMXh1SWwxOSIsIid1c2Ugc3RyaWN0JztcblxudmFyIFZpcnR1YWxBdWRpb0dyYXBoID0gcmVxdWlyZSgnLi4vc3JjL2luZGV4LmpzJyk7XG52YXIgcGluZ1BvbmdEZWxheVBhcmFtc0ZhY3RvcnkgPSByZXF1aXJlKCcuL3Rvb2xzL3BpbmdQb25nRGVsYXlQYXJhbXNGYWN0b3J5Jyk7XG5cbmRlc2NyaWJlKCd2aXJ0dWFsQXVkaW9HcmFwaC51cGRhdGUnLCBmdW5jdGlvbiAoKSB7XG4gIHZhciBhdWRpb0NvbnRleHQgPSB1bmRlZmluZWQ7XG4gIHZhciB2aXJ0dWFsQXVkaW9HcmFwaCA9IHVuZGVmaW5lZDtcblxuICBiZWZvcmVFYWNoKGZ1bmN0aW9uICgpIHtcbiAgICBhdWRpb0NvbnRleHQgPSBuZXcgQXVkaW9Db250ZXh0KCk7XG4gICAgdmlydHVhbEF1ZGlvR3JhcGggPSBuZXcgVmlydHVhbEF1ZGlvR3JhcGgoe1xuICAgICAgYXVkaW9Db250ZXh0OiBhdWRpb0NvbnRleHQsXG4gICAgICBvdXRwdXQ6IGF1ZGlvQ29udGV4dC5kZXN0aW5hdGlvblxuICAgIH0pO1xuICB9KTtcblxuICBpdCgncmV0dXJucyBpdHNlbGYnLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHZpcnR1YWxOb2RlUGFyYW1zID0gW3tcbiAgICAgIGlkOiAwLFxuICAgICAgbm9kZTogJ29zY2lsbGF0b3InLFxuICAgICAgcGFyYW1zOiB7XG4gICAgICAgIHR5cGU6ICdzcXVhcmUnXG4gICAgICB9LFxuICAgICAgb3V0cHV0OiAnb3V0cHV0J1xuICAgIH1dO1xuICAgIGV4cGVjdCh2aXJ0dWFsQXVkaW9HcmFwaC51cGRhdGUodmlydHVhbE5vZGVQYXJhbXMpKS50b0JlKHZpcnR1YWxBdWRpb0dyYXBoKTtcbiAgfSk7XG5cbiAgaXQoJ3Rocm93cyBhbiBlcnJvciBpZiBubyBpZCBpcyBwcm92aWRlZCcsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdmlydHVhbE5vZGVQYXJhbXMgPSBbe1xuICAgICAgbm9kZTogJ2dhaW4nLFxuICAgICAgb3V0cHV0OiAnb3V0cHV0J1xuICAgIH1dO1xuICAgIGV4cGVjdChmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gdmlydHVhbEF1ZGlvR3JhcGgudXBkYXRlKHZpcnR1YWxOb2RlUGFyYW1zKTtcbiAgICB9KS50b1Rocm93KCk7XG4gIH0pO1xuXG4gIGl0KCd0aHJvd3MgYW4gZXJyb3IgaWYgbm8gb3V0cHV0IGlzIHByb3ZpZGVkJywgZnVuY3Rpb24gKCkge1xuICAgIHZhciB2aXJ0dWFsTm9kZVBhcmFtcyA9IFt7XG4gICAgICBub2RlOiAnZ2FpbicsXG4gICAgICBpZDogMVxuICAgIH1dO1xuICAgIGV4cGVjdChmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gdmlydHVhbEF1ZGlvR3JhcGgudXBkYXRlKHZpcnR1YWxOb2RlUGFyYW1zKTtcbiAgICB9KS50b1Rocm93KCk7XG4gIH0pO1xuXG4gIGl0KCd0aHJvd3MgYW4gZXJyb3Igd2hlbiB2aXJ0dWFsIG5vZGUgbmFtZSBwcm9wZXJ0eSBpcyBub3QgcmVjb2duaXNlZCcsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdmlydHVhbE5vZGVQYXJhbXMgPSBbe1xuICAgICAgaWQ6IDAsXG4gICAgICBub2RlOiAnZm9vYmFyJyxcbiAgICAgIG91dHB1dDogJ291dHB1dCdcbiAgICB9XTtcbiAgICBleHBlY3QoZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHZpcnR1YWxBdWRpb0dyYXBoLnVwZGF0ZSh2aXJ0dWFsTm9kZVBhcmFtcyk7XG4gICAgfSkudG9UaHJvdygpO1xuICB9KTtcblxuICBpdCgnY2hhbmdlcyB0aGUgbm9kZSBpZiBwYXNzZWQgcGFyYW1zIHdpdGggc2FtZSBpZCBidXQgZGlmZmVyZW50IG5vZGUgcHJvcGVydHknLCBmdW5jdGlvbiAoKSB7XG4gICAgdmlydHVhbEF1ZGlvR3JhcGgudXBkYXRlKFt7XG4gICAgICBpZDogMCxcbiAgICAgIG5vZGU6ICdnYWluJyxcbiAgICAgIG91dHB1dDogJ291dHB1dCdcbiAgICB9XSk7XG5cbiAgICBleHBlY3QoYXVkaW9Db250ZXh0LnRvSlNPTigpKS50b0VxdWFsKHtcbiAgICAgIG5hbWU6ICdBdWRpb0Rlc3RpbmF0aW9uTm9kZScsXG4gICAgICBpbnB1dHM6IFt7XG4gICAgICAgIG5hbWU6ICdHYWluTm9kZScsXG4gICAgICAgIGdhaW46IHtcbiAgICAgICAgICB2YWx1ZTogMSxcbiAgICAgICAgICBpbnB1dHM6IFtdXG4gICAgICAgIH0sXG4gICAgICAgIGlucHV0czogW11cbiAgICAgIH1dXG4gICAgfSk7XG5cbiAgICB2aXJ0dWFsQXVkaW9HcmFwaC51cGRhdGUoW3tcbiAgICAgIGlkOiAwLFxuICAgICAgbm9kZTogJ29zY2lsbGF0b3InLFxuICAgICAgb3V0cHV0OiAnb3V0cHV0J1xuICAgIH1dKTtcblxuICAgIGV4cGVjdChhdWRpb0NvbnRleHQudG9KU09OKCkpLnRvRXF1YWwoe1xuICAgICAgJ25hbWUnOiAnQXVkaW9EZXN0aW5hdGlvbk5vZGUnLFxuICAgICAgJ2lucHV0cyc6IFt7XG4gICAgICAgICduYW1lJzogJ09zY2lsbGF0b3JOb2RlJyxcbiAgICAgICAgJ3R5cGUnOiAnc2luZScsXG4gICAgICAgICdmcmVxdWVuY3knOiB7XG4gICAgICAgICAgJ3ZhbHVlJzogNDQwLCAnaW5wdXRzJzogW11cbiAgICAgICAgfSxcbiAgICAgICAgJ2RldHVuZSc6IHtcbiAgICAgICAgICAndmFsdWUnOiAwLCAnaW5wdXRzJzogW11cbiAgICAgICAgfSxcbiAgICAgICAgJ2lucHV0cyc6IFtdXG4gICAgICB9XVxuICAgIH0pO1xuXG4gICAgdmlydHVhbEF1ZGlvR3JhcGguZGVmaW5lTm9kZShwaW5nUG9uZ0RlbGF5UGFyYW1zRmFjdG9yeSwgJ3BpbmdQb25nRGVsYXknKTtcblxuICAgIHZpcnR1YWxBdWRpb0dyYXBoLnVwZGF0ZShbe1xuICAgICAgaWQ6IDAsXG4gICAgICBub2RlOiAncGluZ1BvbmdEZWxheScsXG4gICAgICBvdXRwdXQ6ICdvdXRwdXQnXG4gICAgfV0pO1xuICAgIGV4cGVjdChhdWRpb0NvbnRleHQudG9KU09OKCkpLnRvRXF1YWwoeyAnbmFtZSc6ICdBdWRpb0Rlc3RpbmF0aW9uTm9kZScsICdpbnB1dHMnOiBbeyAnbmFtZSc6ICdTdGVyZW9QYW5uZXJOb2RlJywgJ3Bhbic6IHsgJ3ZhbHVlJzogLTEsICdpbnB1dHMnOiBbXSB9LCAnaW5wdXRzJzogW3sgJ25hbWUnOiAnRGVsYXlOb2RlJywgJ2RlbGF5VGltZSc6IHsgJ3ZhbHVlJzogMC4zMzMzMzMzMzMzMzMzMzMzLCAnaW5wdXRzJzogW10gfSwgJ2lucHV0cyc6IFt7ICduYW1lJzogJ0dhaW5Ob2RlJywgJ2dhaW4nOiB7ICd2YWx1ZSc6IDAuMzMzMzMzMzMzMzMzMzMzMywgJ2lucHV0cyc6IFtdIH0sICdpbnB1dHMnOiBbeyAnbmFtZSc6ICdEZWxheU5vZGUnLCAnZGVsYXlUaW1lJzogeyAndmFsdWUnOiAwLjMzMzMzMzMzMzMzMzMzMzMsICdpbnB1dHMnOiBbXSB9LCAnaW5wdXRzJzogW3sgJ25hbWUnOiAnR2Fpbk5vZGUnLCAnZ2Fpbic6IHsgJ3ZhbHVlJzogMC4zMzMzMzMzMzMzMzMzMzMzLCAnaW5wdXRzJzogW10gfSwgJ2lucHV0cyc6IFsnPGNpcmN1bGFyOkRlbGF5Tm9kZT4nXSB9XSB9XSB9XSB9XSB9LCB7ICduYW1lJzogJ1N0ZXJlb1Bhbm5lck5vZGUnLCAncGFuJzogeyAndmFsdWUnOiAxLCAnaW5wdXRzJzogW10gfSwgJ2lucHV0cyc6IFt7ICduYW1lJzogJ0RlbGF5Tm9kZScsICdkZWxheVRpbWUnOiB7ICd2YWx1ZSc6IDAuMzMzMzMzMzMzMzMzMzMzMywgJ2lucHV0cyc6IFtdIH0sICdpbnB1dHMnOiBbeyAnbmFtZSc6ICdHYWluTm9kZScsICdnYWluJzogeyAndmFsdWUnOiAwLjMzMzMzMzMzMzMzMzMzMzMsICdpbnB1dHMnOiBbXSB9LCAnaW5wdXRzJzogW3sgJ25hbWUnOiAnRGVsYXlOb2RlJywgJ2RlbGF5VGltZSc6IHsgJ3ZhbHVlJzogMC4zMzMzMzMzMzMzMzMzMzMzLCAnaW5wdXRzJzogW10gfSwgJ2lucHV0cyc6IFt7ICduYW1lJzogJ0dhaW5Ob2RlJywgJ2dhaW4nOiB7ICd2YWx1ZSc6IDAuMzMzMzMzMzMzMzMzMzMzMywgJ2lucHV0cyc6IFtdIH0sICdpbnB1dHMnOiBbJzxjaXJjdWxhcjpEZWxheU5vZGU+J10gfV0gfV0gfV0gfV0gfV0gfSk7XG4gIH0pO1xuXG4gIGl0KCdjcmVhdGVzIHNwZWNpZmllZCB2aXJ0dWFsIG5vZGVzIGFuZCBzdG9yZXMgdGhlbSBpbiB2aXJ0dWFsQXVkaW9HcmFwaCBwcm9wZXJ0eScsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdmlydHVhbE5vZGVQYXJhbXMgPSBbe1xuICAgICAgaWQ6IDEsXG4gICAgICBub2RlOiAnZ2FpbicsXG4gICAgICBvdXRwdXQ6ICdvdXRwdXQnXG4gICAgfSwge1xuICAgICAgaWQ6IDIsXG4gICAgICBub2RlOiAnb3NjaWxsYXRvcicsXG4gICAgICBvdXRwdXQ6IDFcbiAgICB9XTtcbiAgICB2aXJ0dWFsQXVkaW9HcmFwaC51cGRhdGUodmlydHVhbE5vZGVQYXJhbXMpO1xuICAgIGV4cGVjdChBcnJheS5pc0FycmF5KHZpcnR1YWxBdWRpb0dyYXBoLnZpcnR1YWxOb2RlcykpLnRvQmUodHJ1ZSk7XG4gICAgZXhwZWN0KHZpcnR1YWxBdWRpb0dyYXBoLnZpcnR1YWxOb2Rlcy5sZW5ndGgpLnRvQmUoMik7XG4gIH0pO1xuXG4gIGl0KCdjcmVhdGVzIE9zY2lsbGF0b3JOb2RlIHdpdGggYWxsIHZhbGlkIHBhcmFtZXRlcnMnLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHBhcmFtcyA9IHtcbiAgICAgIHR5cGU6ICdzcXVhcmUnLFxuICAgICAgZnJlcXVlbmN5OiA0NDAsXG4gICAgICBkZXR1bmU6IDRcbiAgICB9O1xuXG4gICAgdmFyIHR5cGUgPSBwYXJhbXMudHlwZTtcbiAgICB2YXIgZnJlcXVlbmN5ID0gcGFyYW1zLmZyZXF1ZW5jeTtcbiAgICB2YXIgZGV0dW5lID0gcGFyYW1zLmRldHVuZTtcblxuICAgIHZhciB2aXJ0dWFsTm9kZVBhcmFtcyA9IFt7XG4gICAgICBpZDogMCxcbiAgICAgIG5vZGU6ICdvc2NpbGxhdG9yJyxcbiAgICAgIHBhcmFtczogcGFyYW1zLFxuICAgICAgb3V0cHV0OiAnb3V0cHV0J1xuICAgIH1dO1xuXG4gICAgdmlydHVhbEF1ZGlvR3JhcGgudXBkYXRlKHZpcnR1YWxOb2RlUGFyYW1zKTtcbiAgICB2YXIgYXVkaW9Ob2RlID0gdmlydHVhbEF1ZGlvR3JhcGgudmlydHVhbE5vZGVzWzBdLmF1ZGlvTm9kZTtcbiAgICBleHBlY3QoYXVkaW9Ob2RlLmNvbnN0cnVjdG9yKS50b0JlKE9zY2lsbGF0b3JOb2RlKTtcbiAgICBleHBlY3QoYXVkaW9Ob2RlLnR5cGUpLnRvQmUodHlwZSk7XG4gICAgZXhwZWN0KGF1ZGlvTm9kZS5mcmVxdWVuY3kudmFsdWUpLnRvQmUoZnJlcXVlbmN5KTtcbiAgICBleHBlY3QoYXVkaW9Ob2RlLmRldHVuZS52YWx1ZSkudG9CZShkZXR1bmUpO1xuICB9KTtcblxuICBpdCgnY3JlYXRlcyBHYWluTm9kZSB3aXRoIGFsbCB2YWxpZCBwYXJhbWV0ZXJzJywgZnVuY3Rpb24gKCkge1xuICAgIHZhciBnYWluID0gMC41O1xuXG4gICAgdmFyIHZpcnR1YWxOb2RlUGFyYW1zID0gW3tcbiAgICAgIGlkOiAwLFxuICAgICAgbm9kZTogJ2dhaW4nLFxuICAgICAgcGFyYW1zOiB7XG4gICAgICAgIGdhaW46IGdhaW5cbiAgICAgIH0sXG4gICAgICBvdXRwdXQ6ICdvdXRwdXQnXG4gICAgfV07XG5cbiAgICB2aXJ0dWFsQXVkaW9HcmFwaC51cGRhdGUodmlydHVhbE5vZGVQYXJhbXMpO1xuICAgIHZhciBhdWRpb05vZGUgPSB2aXJ0dWFsQXVkaW9HcmFwaC52aXJ0dWFsTm9kZXNbMF0uYXVkaW9Ob2RlO1xuICAgIGV4cGVjdChhdWRpb05vZGUuY29uc3RydWN0b3IpLnRvQmUoR2Fpbk5vZGUpO1xuICAgIGV4cGVjdChhdWRpb05vZGUuZ2Fpbi52YWx1ZSkudG9CZShnYWluKTtcbiAgfSk7XG5cbiAgaXQoJ2NyZWF0ZXMgQmlxdWFkRmlsdGVyTm9kZSB3aXRoIGFsbCB2YWxpZCBwYXJhbWV0ZXJzJywgZnVuY3Rpb24gKCkge1xuICAgIHZhciB0eXBlID0gJ3BlYWtpbmcnO1xuICAgIHZhciBmcmVxdWVuY3kgPSA1MDA7XG4gICAgdmFyIGRldHVuZSA9IDY7XG4gICAgdmFyIFEgPSAwLjU7XG5cbiAgICB2YXIgdmlydHVhbE5vZGVQYXJhbXMgPSBbe1xuICAgICAgaWQ6IDAsXG4gICAgICBub2RlOiAnYmlxdWFkRmlsdGVyJyxcbiAgICAgIHBhcmFtczoge1xuICAgICAgICB0eXBlOiB0eXBlLFxuICAgICAgICBmcmVxdWVuY3k6IGZyZXF1ZW5jeSxcbiAgICAgICAgZGV0dW5lOiBkZXR1bmUsXG4gICAgICAgIFE6IFFcbiAgICAgIH0sXG4gICAgICBvdXRwdXQ6ICdvdXRwdXQnXG4gICAgfV07XG5cbiAgICB2aXJ0dWFsQXVkaW9HcmFwaC51cGRhdGUodmlydHVhbE5vZGVQYXJhbXMpO1xuICAgIHZhciBhdWRpb05vZGUgPSB2aXJ0dWFsQXVkaW9HcmFwaC52aXJ0dWFsTm9kZXNbMF0uYXVkaW9Ob2RlO1xuICAgIGV4cGVjdChhdWRpb05vZGUuY29uc3RydWN0b3IpLnRvQmUoQmlxdWFkRmlsdGVyTm9kZSk7XG4gICAgZXhwZWN0KGF1ZGlvTm9kZS50eXBlKS50b0JlKHR5cGUpO1xuICAgIGV4cGVjdChhdWRpb05vZGUuZnJlcXVlbmN5LnZhbHVlKS50b0JlKGZyZXF1ZW5jeSk7XG4gICAgZXhwZWN0KGF1ZGlvTm9kZS5kZXR1bmUudmFsdWUpLnRvQmUoZGV0dW5lKTtcbiAgICBleHBlY3QoYXVkaW9Ob2RlLlEudmFsdWUpLnRvQmUoUSk7XG4gIH0pO1xuXG4gIGl0KCdjcmVhdGVzIERlbGF5Tm9kZSB3aXRoIGFsbCB2YWxpZCBwYXJhbWV0ZXJzJywgZnVuY3Rpb24gKCkge1xuICAgIHZhciBkZWxheVRpbWUgPSAyO1xuICAgIHZhciBtYXhEZWxheVRpbWUgPSA1O1xuXG4gICAgdmFyIHZpcnR1YWxOb2RlUGFyYW1zID0gW3tcbiAgICAgIGlkOiAwLFxuICAgICAgbm9kZTogJ2RlbGF5JyxcbiAgICAgIHBhcmFtczoge1xuICAgICAgICBkZWxheVRpbWU6IGRlbGF5VGltZSxcbiAgICAgICAgbWF4RGVsYXlUaW1lOiBtYXhEZWxheVRpbWVcbiAgICAgIH0sXG4gICAgICBvdXRwdXQ6ICdvdXRwdXQnXG4gICAgfV07XG5cbiAgICB2aXJ0dWFsQXVkaW9HcmFwaC51cGRhdGUodmlydHVhbE5vZGVQYXJhbXMpO1xuICAgIHZhciBhdWRpb05vZGUgPSB2aXJ0dWFsQXVkaW9HcmFwaC52aXJ0dWFsTm9kZXNbMF0uYXVkaW9Ob2RlO1xuICAgIGV4cGVjdChhdWRpb05vZGUuY29uc3RydWN0b3IpLnRvQmUoRGVsYXlOb2RlKTtcbiAgICBleHBlY3QoYXVkaW9Ob2RlLmRlbGF5VGltZS52YWx1ZSkudG9CZShkZWxheVRpbWUpO1xuICB9KTtcblxuICBpdCgnY3JlYXRlcyBTdGVyZW9QYW5uZXJOb2RlIHdpdGggYWxsIHZhbGlkIHBhcmFtZXRlcnMnLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHBhbiA9IDE7XG5cbiAgICB2YXIgdmlydHVhbE5vZGVQYXJhbXMgPSBbe1xuICAgICAgaWQ6IDAsXG4gICAgICBub2RlOiAnc3RlcmVvUGFubmVyJyxcbiAgICAgIHBhcmFtczoge1xuICAgICAgICBwYW46IHBhblxuICAgICAgfSxcbiAgICAgIG91dHB1dDogJ291dHB1dCdcbiAgICB9XTtcblxuICAgIHZpcnR1YWxBdWRpb0dyYXBoLnVwZGF0ZSh2aXJ0dWFsTm9kZVBhcmFtcyk7XG4gICAgdmFyIGF1ZGlvTm9kZSA9IHZpcnR1YWxBdWRpb0dyYXBoLnZpcnR1YWxOb2Rlc1swXS5hdWRpb05vZGU7XG4gICAgZXhwZWN0KGF1ZGlvTm9kZS5jb25zdHJ1Y3Rvci5uYW1lKS50b0JlKCdTdGVyZW9QYW5uZXJOb2RlJyk7XG4gICAgZXhwZWN0KGF1ZGlvTm9kZS5wYW4udmFsdWUpLnRvQmUocGFuKTtcbiAgfSk7XG59KTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTlvYjIxbEwySXZaR1YyTDNacGNuUjFZV3d0WVhWa2FXOHRaM0poY0dndmMzQmxZeTkyYVhKMGRXRnNRWFZrYVc5SGNtRndhQzUxY0dSaGRHVXVhbk1pWFN3aWJtRnRaWE1pT2x0ZExDSnRZWEJ3YVc1bmN5STZJanM3UVVGQlFTeEpRVUZOTEdsQ1FVRnBRaXhIUVVGSExFOUJRVThzUTBGQlF5eHBRa0ZCYVVJc1EwRkJReXhEUVVGRE8wRkJRM0pFTEVsQlFVMHNNRUpCUVRCQ0xFZEJRVWNzVDBGQlR5eERRVUZETEc5RFFVRnZReXhEUVVGRExFTkJRVU03TzBGQlJXcEdMRkZCUVZFc1EwRkJReXd3UWtGQk1FSXNSVUZCUlN4WlFVRk5PMEZCUTNwRExFMUJRVWtzV1VGQldTeFpRVUZCTEVOQlFVTTdRVUZEYWtJc1RVRkJTU3hwUWtGQmFVSXNXVUZCUVN4RFFVRkRPenRCUVVWMFFpeFpRVUZWTEVOQlFVTXNXVUZCVFR0QlFVTm1MR2RDUVVGWkxFZEJRVWNzU1VGQlNTeFpRVUZaTEVWQlFVVXNRMEZCUXp0QlFVTnNReXh4UWtGQmFVSXNSMEZCUnl4SlFVRkpMR2xDUVVGcFFpeERRVUZETzBGQlEzaERMR3RDUVVGWkxFVkJRVm9zV1VGQldUdEJRVU5hTEZsQlFVMHNSVUZCUlN4WlFVRlpMRU5CUVVNc1YwRkJWenRMUVVOcVF5eERRVUZETEVOQlFVTTdSMEZEU2l4RFFVRkRMRU5CUVVNN08wRkJSVWdzU1VGQlJTeERRVUZETEdkQ1FVRm5RaXhGUVVGRkxGbEJRVTA3UVVGRGVrSXNVVUZCVFN4cFFrRkJhVUlzUjBGQlJ5eERRVUZETzBGQlEzcENMRkZCUVVVc1JVRkJSU3hEUVVGRE8wRkJRMHdzVlVGQlNTeEZRVUZGTEZsQlFWazdRVUZEYkVJc1dVRkJUU3hGUVVGRk8wRkJRMDRzV1VGQlNTeEZRVUZGTEZGQlFWRTdUMEZEWmp0QlFVTkVMRmxCUVUwc1JVRkJSU3hSUVVGUk8wdEJRMnBDTEVOQlFVTXNRMEZCUXp0QlFVTklMRlZCUVUwc1EwRkJReXhwUWtGQmFVSXNRMEZCUXl4TlFVRk5MRU5CUVVNc2FVSkJRV2xDTEVOQlFVTXNRMEZCUXl4RFFVRkRMRWxCUVVrc1EwRkJReXhwUWtGQmFVSXNRMEZCUXl4RFFVRkRPMGRCUXpkRkxFTkJRVU1zUTBGQlF6czdRVUZGU0N4SlFVRkZMRU5CUVVNc2MwTkJRWE5ETEVWQlFVVXNXVUZCVFR0QlFVTXZReXhSUVVGTkxHbENRVUZwUWl4SFFVRkhMRU5CUVVNN1FVRkRla0lzVlVGQlNTeEZRVUZGTEUxQlFVMDdRVUZEV2l4WlFVRk5MRVZCUVVVc1VVRkJVVHRMUVVOcVFpeERRVUZETEVOQlFVTTdRVUZEU0N4VlFVRk5MRU5CUVVNN1lVRkJUU3hwUWtGQmFVSXNRMEZCUXl4TlFVRk5MRU5CUVVNc2FVSkJRV2xDTEVOQlFVTTdTMEZCUVN4RFFVRkRMRU5CUVVNc1QwRkJUeXhGUVVGRkxFTkJRVU03UjBGRGNrVXNRMEZCUXl4RFFVRkRPenRCUVVWSUxFbEJRVVVzUTBGQlF5d3dRMEZCTUVNc1JVRkJSU3haUVVGTk8wRkJRMjVFTEZGQlFVMHNhVUpCUVdsQ0xFZEJRVWNzUTBGQlF6dEJRVU42UWl4VlFVRkpMRVZCUVVVc1RVRkJUVHRCUVVOYUxGRkJRVVVzUlVGQlJTeERRVUZETzB0QlEwNHNRMEZCUXl4RFFVRkRPMEZCUTBnc1ZVRkJUU3hEUVVGRE8yRkJRVTBzYVVKQlFXbENMRU5CUVVNc1RVRkJUU3hEUVVGRExHbENRVUZwUWl4RFFVRkRPMHRCUVVFc1EwRkJReXhEUVVGRExFOUJRVThzUlVGQlJTeERRVUZETzBkQlEzSkZMRU5CUVVNc1EwRkJRenM3UVVGRlNDeEpRVUZGTEVOQlFVTXNiVVZCUVcxRkxFVkJRVVVzV1VGQlRUdEJRVU0xUlN4UlFVRk5MR2xDUVVGcFFpeEhRVUZITEVOQlFVTTdRVUZEZWtJc1VVRkJSU3hGUVVGRkxFTkJRVU03UVVGRFRDeFZRVUZKTEVWQlFVVXNVVUZCVVR0QlFVTmtMRmxCUVUwc1JVRkJSU3hSUVVGUk8wdEJRMnBDTEVOQlFVTXNRMEZCUXp0QlFVTklMRlZCUVUwc1EwRkJRenRoUVVGTkxHbENRVUZwUWl4RFFVRkRMRTFCUVUwc1EwRkJReXhwUWtGQmFVSXNRMEZCUXp0TFFVRkJMRU5CUVVNc1EwRkJReXhQUVVGUExFVkJRVVVzUTBGQlF6dEhRVU55UlN4RFFVRkRMRU5CUVVNN08wRkJSVWdzU1VGQlJTeERRVUZETERSRlFVRTBSU3hGUVVGRkxGbEJRVTA3UVVGRGNrWXNjVUpCUVdsQ0xFTkJRVU1zVFVGQlRTeERRVUZETEVOQlFVTTdRVUZEZUVJc1VVRkJSU3hGUVVGRkxFTkJRVU03UVVGRFRDeFZRVUZKTEVWQlFVVXNUVUZCVFR0QlFVTmFMRmxCUVUwc1JVRkJSU3hSUVVGUk8wdEJRMnBDTEVOQlFVTXNRMEZCUXl4RFFVRkRPenRCUVVWS0xGVkJRVTBzUTBGQlF5eFpRVUZaTEVOQlFVTXNUVUZCVFN4RlFVRkZMRU5CUVVNc1EwRkJReXhQUVVGUExFTkJRVU03UVVGRGNFTXNWVUZCU1N4RlFVRkZMSE5DUVVGelFqdEJRVU0xUWl4WlFVRk5MRVZCUVVVc1EwRkRUanRCUVVORkxGbEJRVWtzUlVGQlJTeFZRVUZWTzBGQlEyaENMRmxCUVVrc1JVRkJSVHRCUVVOS0xHVkJRVXNzUlVGQlJTeERRVUZETzBGQlExSXNaMEpCUVUwc1JVRkJSU3hGUVVGRk8xTkJRMWc3UVVGRFJDeGpRVUZOTEVWQlFVVXNSVUZCUlR0UFFVTllMRU5CUTBZN1MwRkRSaXhEUVVGRExFTkJRVU03TzBGQlJVZ3NjVUpCUVdsQ0xFTkJRVU1zVFVGQlRTeERRVUZETEVOQlFVTTdRVUZEZUVJc1VVRkJSU3hGUVVGRkxFTkJRVU03UVVGRFRDeFZRVUZKTEVWQlFVVXNXVUZCV1R0QlFVTnNRaXhaUVVGTkxFVkJRVVVzVVVGQlVUdExRVU5xUWl4RFFVRkRMRU5CUVVNc1EwRkJRenM3UVVGRlNpeFZRVUZOTEVOQlFVTXNXVUZCV1N4RFFVRkRMRTFCUVUwc1JVRkJSU3hEUVVGRExFTkJRVU1zVDBGQlR5eERRVUZETzBGQlEzQkRMRmxCUVUwc1JVRkJReXh6UWtGQmMwSTdRVUZETjBJc1kwRkJVU3hGUVVGRExFTkJRMUE3UVVGRFJTeGpRVUZOTEVWQlFVTXNaMEpCUVdkQ08wRkJRM1pDTEdOQlFVMHNSVUZCUXl4TlFVRk5PMEZCUTJJc2JVSkJRVmNzUlVGQlF6dEJRVU5XTEdsQ1FVRlBMRVZCUVVNc1IwRkJSeXhGUVVGRExGRkJRVkVzUlVGQlF5eEZRVUZGTzFOQlEzaENPMEZCUTBRc1owSkJRVkVzUlVGQlF6dEJRVU5RTEdsQ1FVRlBMRVZCUVVNc1EwRkJReXhGUVVGRExGRkJRVkVzUlVGQlF5eEZRVUZGTzFOQlEzUkNPMEZCUTBRc1owSkJRVkVzUlVGQlF5eEZRVUZGTzA5QlExb3NRMEZEUmp0TFFVTkdMRU5CUVVNc1EwRkJRenM3UVVGRlNDeHhRa0ZCYVVJc1EwRkJReXhWUVVGVkxFTkJRVU1zTUVKQlFUQkNMRVZCUVVVc1pVRkJaU3hEUVVGRExFTkJRVU03TzBGQlJURkZMSEZDUVVGcFFpeERRVUZETEUxQlFVMHNRMEZCUXl4RFFVRkRPMEZCUTNoQ0xGRkJRVVVzUlVGQlJTeERRVUZETzBGQlEwd3NWVUZCU1N4RlFVRkZMR1ZCUVdVN1FVRkRja0lzV1VGQlRTeEZRVUZGTEZGQlFWRTdTMEZEYWtJc1EwRkJReXhEUVVGRExFTkJRVU03UVVGRFNpeFZRVUZOTEVOQlFVTXNXVUZCV1N4RFFVRkRMRTFCUVUwc1JVRkJSU3hEUVVGRExFTkJRVU1zVDBGQlR5eERRVUZETEVWQlFVTXNUVUZCVFN4RlFVRkRMSE5DUVVGelFpeEZRVUZETEZGQlFWRXNSVUZCUXl4RFFVRkRMRVZCUVVNc1RVRkJUU3hGUVVGRExHdENRVUZyUWl4RlFVRkRMRXRCUVVzc1JVRkJReXhGUVVGRExFOUJRVThzUlVGQlF5eERRVUZETEVOQlFVTXNSVUZCUXl4UlFVRlJMRVZCUVVNc1JVRkJSU3hGUVVGRExFVkJRVU1zVVVGQlVTeEZRVUZETEVOQlFVTXNSVUZCUXl4TlFVRk5MRVZCUVVNc1YwRkJWeXhGUVVGRExGZEJRVmNzUlVGQlF5eEZRVUZETEU5QlFVOHNSVUZCUXl4clFrRkJhMElzUlVGQlF5eFJRVUZSTEVWQlFVTXNSVUZCUlN4RlFVRkRMRVZCUVVNc1VVRkJVU3hGUVVGRExFTkJRVU1zUlVGQlF5eE5RVUZOTEVWQlFVTXNWVUZCVlN4RlFVRkRMRTFCUVUwc1JVRkJReXhGUVVGRExFOUJRVThzUlVGQlF5eHJRa0ZCYTBJc1JVRkJReXhSUVVGUkxFVkJRVU1zUlVGQlJTeEZRVUZETEVWQlFVTXNVVUZCVVN4RlFVRkRMRU5CUVVNc1JVRkJReXhOUVVGTkxFVkJRVU1zVjBGQlZ5eEZRVUZETEZkQlFWY3NSVUZCUXl4RlFVRkRMRTlCUVU4c1JVRkJReXhyUWtGQmEwSXNSVUZCUXl4UlFVRlJMRVZCUVVNc1JVRkJSU3hGUVVGRExFVkJRVU1zVVVGQlVTeEZRVUZETEVOQlFVTXNSVUZCUXl4TlFVRk5MRVZCUVVNc1ZVRkJWU3hGUVVGRExFMUJRVTBzUlVGQlF5eEZRVUZETEU5QlFVOHNSVUZCUXl4clFrRkJhMElzUlVGQlF5eFJRVUZSTEVWQlFVTXNSVUZCUlN4RlFVRkRMRVZCUVVNc1VVRkJVU3hGUVVGRExFTkJRVU1zYzBKQlFYTkNMRU5CUVVNc1JVRkJReXhEUVVGRExFVkJRVU1zUTBGQlF5eEZRVUZETEVOQlFVTXNSVUZCUXl4RFFVRkRMRVZCUVVNc1JVRkJReXhGUVVGRExFMUJRVTBzUlVGQlF5eHJRa0ZCYTBJc1JVRkJReXhMUVVGTExFVkJRVU1zUlVGQlF5eFBRVUZQTEVWQlFVTXNRMEZCUXl4RlFVRkRMRkZCUVZFc1JVRkJReXhGUVVGRkxFVkJRVU1zUlVGQlF5eFJRVUZSTEVWQlFVTXNRMEZCUXl4RlFVRkRMRTFCUVUwc1JVRkJReXhYUVVGWExFVkJRVU1zVjBGQlZ5eEZRVUZETEVWQlFVTXNUMEZCVHl4RlFVRkRMR3RDUVVGclFpeEZRVUZETEZGQlFWRXNSVUZCUXl4RlFVRkZMRVZCUVVNc1JVRkJReXhSUVVGUkxFVkJRVU1zUTBGQlF5eEZRVUZETEUxQlFVMHNSVUZCUXl4VlFVRlZMRVZCUVVNc1RVRkJUU3hGUVVGRExFVkJRVU1zVDBGQlR5eEZRVUZETEd0Q1FVRnJRaXhGUVVGRExGRkJRVkVzUlVGQlF5eEZRVUZGTEVWQlFVTXNSVUZCUXl4UlFVRlJMRVZCUVVNc1EwRkJReXhGUVVGRExFMUJRVTBzUlVGQlF5eFhRVUZYTEVWQlFVTXNWMEZCVnl4RlFVRkRMRVZCUVVNc1QwRkJUeXhGUVVGRExHdENRVUZyUWl4RlFVRkRMRkZCUVZFc1JVRkJReXhGUVVGRkxFVkJRVU1zUlVGQlF5eFJRVUZSTEVWQlFVTXNRMEZCUXl4RlFVRkRMRTFCUVUwc1JVRkJReXhWUVVGVkxFVkJRVU1zVFVGQlRTeEZRVUZETEVWQlFVTXNUMEZCVHl4RlFVRkRMR3RDUVVGclFpeEZRVUZETEZGQlFWRXNSVUZCUXl4RlFVRkZMRVZCUVVNc1JVRkJReXhSUVVGUkxFVkJRVU1zUTBGQlF5eHpRa0ZCYzBJc1EwRkJReXhGUVVGRExFTkJRVU1zUlVGQlF5eERRVUZETEVWQlFVTXNRMEZCUXl4RlFVRkRMRU5CUVVNc1JVRkJReXhEUVVGRExFVkJRVU1zUTBGQlF5eERRVUZETzBkQlF6VTFRaXhEUVVGRExFTkJRVU03TzBGQlJVZ3NTVUZCUlN4RFFVRkRMQ3RGUVVFclJTeEZRVUZGTEZsQlFVMDdRVUZEZUVZc1VVRkJUU3hwUWtGQmFVSXNSMEZCUnl4RFFVRkRPMEZCUTNwQ0xGRkJRVVVzUlVGQlJTeERRVUZETzBGQlEwd3NWVUZCU1N4RlFVRkZMRTFCUVUwN1FVRkRXaXhaUVVGTkxFVkJRVVVzVVVGQlVUdExRVU5xUWl4RlFVTkVPMEZCUTBVc1VVRkJSU3hGUVVGRkxFTkJRVU03UVVGRFRDeFZRVUZKTEVWQlFVVXNXVUZCV1R0QlFVTnNRaXhaUVVGTkxFVkJRVVVzUTBGQlF6dExRVU5XTEVOQlFVTXNRMEZCUXp0QlFVTklMSEZDUVVGcFFpeERRVUZETEUxQlFVMHNRMEZCUXl4cFFrRkJhVUlzUTBGQlF5eERRVUZETzBGQlF6VkRMRlZCUVUwc1EwRkJReXhMUVVGTExFTkJRVU1zVDBGQlR5eERRVUZETEdsQ1FVRnBRaXhEUVVGRExGbEJRVmtzUTBGQlF5eERRVUZETEVOQlFVTXNTVUZCU1N4RFFVRkRMRWxCUVVrc1EwRkJReXhEUVVGRE8wRkJRMnBGTEZWQlFVMHNRMEZCUXl4cFFrRkJhVUlzUTBGQlF5eFpRVUZaTEVOQlFVTXNUVUZCVFN4RFFVRkRMRU5CUVVNc1NVRkJTU3hEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETzBkQlEzWkVMRU5CUVVNc1EwRkJRenM3UVVGRlNDeEpRVUZGTEVOQlFVTXNhMFJCUVd0RUxFVkJRVVVzV1VGQlRUdEJRVU16UkN4UlFVRk5MRTFCUVUwc1IwRkJSenRCUVVOaUxGVkJRVWtzUlVGQlJTeFJRVUZSTzBGQlEyUXNaVUZCVXl4RlFVRkZMRWRCUVVjN1FVRkRaQ3haUVVGTkxFVkJRVVVzUTBGQlF6dExRVU5XTEVOQlFVTTdPMUZCUlVzc1NVRkJTU3hIUVVGMVFpeE5RVUZOTEVOQlFXcERMRWxCUVVrN1VVRkJSU3hUUVVGVExFZEJRVmtzVFVGQlRTeERRVUV6UWl4VFFVRlRPMUZCUVVVc1RVRkJUU3hIUVVGSkxFMUJRVTBzUTBGQmFFSXNUVUZCVFRzN1FVRkZPVUlzVVVGQlRTeHBRa0ZCYVVJc1IwRkJSeXhEUVVGRE8wRkJRM3BDTEZGQlFVVXNSVUZCUlN4RFFVRkRPMEZCUTB3c1ZVRkJTU3hGUVVGRkxGbEJRVms3UVVGRGJFSXNXVUZCVFN4RlFVRk9MRTFCUVUwN1FVRkRUaXhaUVVGTkxFVkJRVVVzVVVGQlVUdExRVU5xUWl4RFFVRkRMRU5CUVVNN08wRkJSVWdzY1VKQlFXbENMRU5CUVVNc1RVRkJUU3hEUVVGRExHbENRVUZwUWl4RFFVRkRMRU5CUVVNN1FVRkROVU1zVVVGQlRTeFRRVUZUTEVkQlFVY3NhVUpCUVdsQ0xFTkJRVU1zV1VGQldTeERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRMRk5CUVZNc1EwRkJRenRCUVVNNVJDeFZRVUZOTEVOQlFVTXNVMEZCVXl4RFFVRkRMRmRCUVZjc1EwRkJReXhEUVVGRExFbEJRVWtzUTBGQlF5eGpRVUZqTEVOQlFVTXNRMEZCUXp0QlFVTnVSQ3hWUVVGTkxFTkJRVU1zVTBGQlV5eERRVUZETEVsQlFVa3NRMEZCUXl4RFFVRkRMRWxCUVVrc1EwRkJReXhKUVVGSkxFTkJRVU1zUTBGQlF6dEJRVU5zUXl4VlFVRk5MRU5CUVVNc1UwRkJVeXhEUVVGRExGTkJRVk1zUTBGQlF5eExRVUZMTEVOQlFVTXNRMEZCUXl4SlFVRkpMRU5CUVVNc1UwRkJVeXhEUVVGRExFTkJRVU03UVVGRGJFUXNWVUZCVFN4RFFVRkRMRk5CUVZNc1EwRkJReXhOUVVGTkxFTkJRVU1zUzBGQlN5eERRVUZETEVOQlFVTXNTVUZCU1N4RFFVRkRMRTFCUVUwc1EwRkJReXhEUVVGRE8wZEJRemRETEVOQlFVTXNRMEZCUXpzN1FVRkZTQ3hKUVVGRkxFTkJRVU1zTkVOQlFUUkRMRVZCUVVVc1dVRkJUVHRCUVVOeVJDeFJRVUZOTEVsQlFVa3NSMEZCUnl4SFFVRkhMRU5CUVVNN08wRkJSV3BDTEZGQlFVMHNhVUpCUVdsQ0xFZEJRVWNzUTBGQlF6dEJRVU42UWl4UlFVRkZMRVZCUVVVc1EwRkJRenRCUVVOTUxGVkJRVWtzUlVGQlJTeE5RVUZOTzBGQlExb3NXVUZCVFN4RlFVRkZPMEZCUTA0c1dVRkJTU3hGUVVGS0xFbEJRVWs3VDBGRFREdEJRVU5FTEZsQlFVMHNSVUZCUlN4UlFVRlJPMHRCUTJwQ0xFTkJRVU1zUTBGQlF6czdRVUZGU0N4eFFrRkJhVUlzUTBGQlF5eE5RVUZOTEVOQlFVTXNhVUpCUVdsQ0xFTkJRVU1zUTBGQlF6dEJRVU0xUXl4UlFVRk5MRk5CUVZNc1IwRkJSeXhwUWtGQmFVSXNRMEZCUXl4WlFVRlpMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU1zVTBGQlV5eERRVUZETzBGQlF6bEVMRlZCUVUwc1EwRkJReXhUUVVGVExFTkJRVU1zVjBGQlZ5eERRVUZETEVOQlFVTXNTVUZCU1N4RFFVRkRMRkZCUVZFc1EwRkJReXhEUVVGRE8wRkJRemRETEZWQlFVMHNRMEZCUXl4VFFVRlRMRU5CUVVNc1NVRkJTU3hEUVVGRExFdEJRVXNzUTBGQlF5eERRVUZETEVsQlFVa3NRMEZCUXl4SlFVRkpMRU5CUVVNc1EwRkJRenRIUVVONlF5eERRVUZETEVOQlFVTTdPMEZCUlVnc1NVRkJSU3hEUVVGRExHOUVRVUZ2UkN4RlFVRkZMRmxCUVUwN1FVRkROMFFzVVVGQlRTeEpRVUZKTEVkQlFVY3NVMEZCVXl4RFFVRkRPMEZCUTNaQ0xGRkJRVTBzVTBGQlV5eEhRVUZITEVkQlFVY3NRMEZCUXp0QlFVTjBRaXhSUVVGTkxFMUJRVTBzUjBGQlJ5eERRVUZETEVOQlFVTTdRVUZEYWtJc1VVRkJUU3hEUVVGRExFZEJRVWNzUjBGQlJ5eERRVUZET3p0QlFVVmtMRkZCUVUwc2FVSkJRV2xDTEVkQlFVY3NRMEZCUXp0QlFVTjZRaXhSUVVGRkxFVkJRVVVzUTBGQlF6dEJRVU5NTEZWQlFVa3NSVUZCUlN4alFVRmpPMEZCUTNCQ0xGbEJRVTBzUlVGQlJUdEJRVU5PTEZsQlFVa3NSVUZCU2l4SlFVRkpPMEZCUTBvc2FVSkJRVk1zUlVGQlZDeFRRVUZUTzBGQlExUXNZMEZCVFN4RlFVRk9MRTFCUVUwN1FVRkRUaXhUUVVGRExFVkJRVVFzUTBGQlF6dFBRVU5HTzBGQlEwUXNXVUZCVFN4RlFVRkZMRkZCUVZFN1MwRkRha0lzUTBGQlF5eERRVUZET3p0QlFVVklMSEZDUVVGcFFpeERRVUZETEUxQlFVMHNRMEZCUXl4cFFrRkJhVUlzUTBGQlF5eERRVUZETzBGQlF6VkRMRkZCUVUwc1UwRkJVeXhIUVVGSExHbENRVUZwUWl4RFFVRkRMRmxCUVZrc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF5eFRRVUZUTEVOQlFVTTdRVUZET1VRc1ZVRkJUU3hEUVVGRExGTkJRVk1zUTBGQlF5eFhRVUZYTEVOQlFVTXNRMEZCUXl4SlFVRkpMRU5CUVVNc1owSkJRV2RDTEVOQlFVTXNRMEZCUXp0QlFVTnlSQ3hWUVVGTkxFTkJRVU1zVTBGQlV5eERRVUZETEVsQlFVa3NRMEZCUXl4RFFVRkRMRWxCUVVrc1EwRkJReXhKUVVGSkxFTkJRVU1zUTBGQlF6dEJRVU5zUXl4VlFVRk5MRU5CUVVNc1UwRkJVeXhEUVVGRExGTkJRVk1zUTBGQlF5eExRVUZMTEVOQlFVTXNRMEZCUXl4SlFVRkpMRU5CUVVNc1UwRkJVeXhEUVVGRExFTkJRVU03UVVGRGJFUXNWVUZCVFN4RFFVRkRMRk5CUVZNc1EwRkJReXhOUVVGTkxFTkJRVU1zUzBGQlN5eERRVUZETEVOQlFVTXNTVUZCU1N4RFFVRkRMRTFCUVUwc1EwRkJReXhEUVVGRE8wRkJRelZETEZWQlFVMHNRMEZCUXl4VFFVRlRMRU5CUVVNc1EwRkJReXhEUVVGRExFdEJRVXNzUTBGQlF5eERRVUZETEVsQlFVa3NRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJRenRIUVVOdVF5eERRVUZETEVOQlFVTTdPMEZCUlVnc1NVRkJSU3hEUVVGRExEWkRRVUUyUXl4RlFVRkZMRmxCUVUwN1FVRkRkRVFzVVVGQlRTeFRRVUZUTEVkQlFVY3NRMEZCUXl4RFFVRkRPMEZCUTNCQ0xGRkJRVTBzV1VGQldTeEhRVUZITEVOQlFVTXNRMEZCUXpzN1FVRkZka0lzVVVGQlRTeHBRa0ZCYVVJc1IwRkJSeXhEUVVGRE8wRkJRM3BDTEZGQlFVVXNSVUZCUlN4RFFVRkRPMEZCUTB3c1ZVRkJTU3hGUVVGRkxFOUJRVTg3UVVGRFlpeFpRVUZOTEVWQlFVVTdRVUZEVGl4cFFrRkJVeXhGUVVGVUxGTkJRVk03UVVGRFZDeHZRa0ZCV1N4RlFVRmFMRmxCUVZrN1QwRkRZanRCUVVORUxGbEJRVTBzUlVGQlJTeFJRVUZSTzB0QlEycENMRU5CUVVNc1EwRkJRenM3UVVGRlNDeHhRa0ZCYVVJc1EwRkJReXhOUVVGTkxFTkJRVU1zYVVKQlFXbENMRU5CUVVNc1EwRkJRenRCUVVNMVF5eFJRVUZOTEZOQlFWTXNSMEZCUnl4cFFrRkJhVUlzUTBGQlF5eFpRVUZaTEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNc1UwRkJVeXhEUVVGRE8wRkJRemxFTEZWQlFVMHNRMEZCUXl4VFFVRlRMRU5CUVVNc1YwRkJWeXhEUVVGRExFTkJRVU1zU1VGQlNTeERRVUZETEZOQlFWTXNRMEZCUXl4RFFVRkRPMEZCUXpsRExGVkJRVTBzUTBGQlF5eFRRVUZUTEVOQlFVTXNVMEZCVXl4RFFVRkRMRXRCUVVzc1EwRkJReXhEUVVGRExFbEJRVWtzUTBGQlF5eFRRVUZUTEVOQlFVTXNRMEZCUXp0SFFVTnVSQ3hEUVVGRExFTkJRVU03TzBGQlJVZ3NTVUZCUlN4RFFVRkRMRzlFUVVGdlJDeEZRVUZGTEZsQlFVMDdRVUZETjBRc1VVRkJUU3hIUVVGSExFZEJRVWNzUTBGQlF5eERRVUZET3p0QlFVVmtMRkZCUVUwc2FVSkJRV2xDTEVkQlFVY3NRMEZCUXp0QlFVTjZRaXhSUVVGRkxFVkJRVVVzUTBGQlF6dEJRVU5NTEZWQlFVa3NSVUZCUlN4alFVRmpPMEZCUTNCQ0xGbEJRVTBzUlVGQlJUdEJRVU5PTEZkQlFVY3NSVUZCU0N4SFFVRkhPMDlCUTBvN1FVRkRSQ3haUVVGTkxFVkJRVVVzVVVGQlVUdExRVU5xUWl4RFFVRkRMRU5CUVVNN08wRkJSVWdzY1VKQlFXbENMRU5CUVVNc1RVRkJUU3hEUVVGRExHbENRVUZwUWl4RFFVRkRMRU5CUVVNN1FVRkROVU1zVVVGQlRTeFRRVUZUTEVkQlFVY3NhVUpCUVdsQ0xFTkJRVU1zV1VGQldTeERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRMRk5CUVZNc1EwRkJRenRCUVVNNVJDeFZRVUZOTEVOQlFVTXNVMEZCVXl4RFFVRkRMRmRCUVZjc1EwRkJReXhKUVVGSkxFTkJRVU1zUTBGQlF5eEpRVUZKTEVOQlFVTXNhMEpCUVd0Q0xFTkJRVU1zUTBGQlF6dEJRVU0xUkN4VlFVRk5MRU5CUVVNc1UwRkJVeXhEUVVGRExFZEJRVWNzUTBGQlF5eExRVUZMTEVOQlFVTXNRMEZCUXl4SlFVRkpMRU5CUVVNc1IwRkJSeXhEUVVGRExFTkJRVU03UjBGRGRrTXNRMEZCUXl4RFFVRkRPME5CUTBvc1EwRkJReXhEUVVGRElpd2labWxzWlNJNklpOW9iMjFsTDJJdlpHVjJMM1pwY25SMVlXd3RZWFZrYVc4dFozSmhjR2d2YzNCbFl5OTJhWEowZFdGc1FYVmthVzlIY21Gd2FDNTFjR1JoZEdVdWFuTWlMQ0p6YjNWeVkyVnpRMjl1ZEdWdWRDSTZXeUpqYjI1emRDQldhWEowZFdGc1FYVmthVzlIY21Gd2FDQTlJSEpsY1hWcGNtVW9KeTR1TDNOeVl5OXBibVJsZUM1cWN5Y3BPMXh1WTI5dWMzUWdjR2x1WjFCdmJtZEVaV3hoZVZCaGNtRnRjMFpoWTNSdmNua2dQU0J5WlhGMWFYSmxLQ2N1TDNSdmIyeHpMM0JwYm1kUWIyNW5SR1ZzWVhsUVlYSmhiWE5HWVdOMGIzSjVKeWs3WEc1Y2JtUmxjMk55YVdKbEtGd2lkbWx5ZEhWaGJFRjFaR2x2UjNKaGNHZ3VkWEJrWVhSbFhDSXNJQ2dwSUQwK0lIdGNiaUFnYkdWMElHRjFaR2x2UTI5dWRHVjRkRHRjYmlBZ2JHVjBJSFpwY25SMVlXeEJkV1JwYjBkeVlYQm9PMXh1WEc0Z0lHSmxabTl5WlVWaFkyZ29LQ2tnUFQ0Z2UxeHVJQ0FnSUdGMVpHbHZRMjl1ZEdWNGRDQTlJRzVsZHlCQmRXUnBiME52Ym5SbGVIUW9LVHRjYmlBZ0lDQjJhWEowZFdGc1FYVmthVzlIY21Gd2FDQTlJRzVsZHlCV2FYSjBkV0ZzUVhWa2FXOUhjbUZ3YUNoN1hHNGdJQ0FnSUNCaGRXUnBiME52Ym5SbGVIUXNYRzRnSUNBZ0lDQnZkWFJ3ZFhRNklHRjFaR2x2UTI5dWRHVjRkQzVrWlhOMGFXNWhkR2x2Yml4Y2JpQWdJQ0I5S1R0Y2JpQWdmU2s3WEc1Y2JpQWdhWFFvSjNKbGRIVnlibk1nYVhSelpXeG1KeXdnS0NrZ1BUNGdlMXh1SUNBZ0lHTnZibk4wSUhacGNuUjFZV3hPYjJSbFVHRnlZVzF6SUQwZ1czdGNiaUFnSUNBZ0lHbGtPaUF3TEZ4dUlDQWdJQ0FnYm05a1pUb2dKMjl6WTJsc2JHRjBiM0luTEZ4dUlDQWdJQ0FnY0dGeVlXMXpPaUI3WEc0Z0lDQWdJQ0FnSUhSNWNHVTZJQ2R6Y1hWaGNtVW5MRnh1SUNBZ0lDQWdmU3hjYmlBZ0lDQWdJRzkxZEhCMWREb2dKMjkxZEhCMWRDY3NYRzRnSUNBZ2ZWMDdYRzRnSUNBZ1pYaHdaV04wS0hacGNuUjFZV3hCZFdScGIwZHlZWEJvTG5Wd1pHRjBaU2gyYVhKMGRXRnNUbTlrWlZCaGNtRnRjeWtwTG5SdlFtVW9kbWx5ZEhWaGJFRjFaR2x2UjNKaGNHZ3BPMXh1SUNCOUtUdGNibHh1SUNCcGRDZ25kR2h5YjNkeklHRnVJR1Z5Y205eUlHbG1JRzV2SUdsa0lHbHpJSEJ5YjNacFpHVmtKeXdnS0NrZ1BUNGdlMXh1SUNBZ0lHTnZibk4wSUhacGNuUjFZV3hPYjJSbFVHRnlZVzF6SUQwZ1czdGNiaUFnSUNBZ0lHNXZaR1U2SUNkbllXbHVKeXhjYmlBZ0lDQWdJRzkxZEhCMWREb2dKMjkxZEhCMWRDY3NYRzRnSUNBZ2ZWMDdYRzRnSUNBZ1pYaHdaV04wS0NncElEMCtJSFpwY25SMVlXeEJkV1JwYjBkeVlYQm9MblZ3WkdGMFpTaDJhWEowZFdGc1RtOWtaVkJoY21GdGN5a3BMblJ2VkdoeWIzY29LVHRjYmlBZ2ZTazdYRzVjYmlBZ2FYUW9KM1JvY205M2N5QmhiaUJsY25KdmNpQnBaaUJ1YnlCdmRYUndkWFFnYVhNZ2NISnZkbWxrWldRbkxDQW9LU0E5UGlCN1hHNGdJQ0FnWTI5dWMzUWdkbWx5ZEhWaGJFNXZaR1ZRWVhKaGJYTWdQU0JiZTF4dUlDQWdJQ0FnYm05a1pUb2dKMmRoYVc0bkxGeHVJQ0FnSUNBZ2FXUTZJREVzWEc0Z0lDQWdmVjA3WEc0Z0lDQWdaWGh3WldOMEtDZ3BJRDArSUhacGNuUjFZV3hCZFdScGIwZHlZWEJvTG5Wd1pHRjBaU2gyYVhKMGRXRnNUbTlrWlZCaGNtRnRjeWtwTG5SdlZHaHliM2NvS1R0Y2JpQWdmU2s3WEc1Y2JpQWdhWFFvSjNSb2NtOTNjeUJoYmlCbGNuSnZjaUIzYUdWdUlIWnBjblIxWVd3Z2JtOWtaU0J1WVcxbElIQnliM0JsY25SNUlHbHpJRzV2ZENCeVpXTnZaMjVwYzJWa0p5d2dLQ2tnUFQ0Z2UxeHVJQ0FnSUdOdmJuTjBJSFpwY25SMVlXeE9iMlJsVUdGeVlXMXpJRDBnVzN0Y2JpQWdJQ0FnSUdsa09pQXdMRnh1SUNBZ0lDQWdibTlrWlRvZ0oyWnZiMkpoY2ljc1hHNGdJQ0FnSUNCdmRYUndkWFE2SUNkdmRYUndkWFFuTEZ4dUlDQWdJSDFkTzF4dUlDQWdJR1Y0Y0dWamRDZ29LU0E5UGlCMmFYSjBkV0ZzUVhWa2FXOUhjbUZ3YUM1MWNHUmhkR1VvZG1seWRIVmhiRTV2WkdWUVlYSmhiWE1wS1M1MGIxUm9jbTkzS0NrN1hHNGdJSDBwTzF4dVhHNGdJR2wwS0NkamFHRnVaMlZ6SUhSb1pTQnViMlJsSUdsbUlIQmhjM05sWkNCd1lYSmhiWE1nZDJsMGFDQnpZVzFsSUdsa0lHSjFkQ0JrYVdabVpYSmxiblFnYm05a1pTQndjbTl3WlhKMGVTY3NJQ2dwSUQwK0lIdGNiaUFnSUNCMmFYSjBkV0ZzUVhWa2FXOUhjbUZ3YUM1MWNHUmhkR1VvVzN0Y2JpQWdJQ0FnSUdsa09pQXdMRnh1SUNBZ0lDQWdibTlrWlRvZ0oyZGhhVzRuTEZ4dUlDQWdJQ0FnYjNWMGNIVjBPaUFuYjNWMGNIVjBKeXhjYmlBZ0lDQjlYU2s3WEc1Y2JpQWdJQ0JsZUhCbFkzUW9ZWFZrYVc5RGIyNTBaWGgwTG5SdlNsTlBUaWdwS1M1MGIwVnhkV0ZzS0h0Y2JpQWdJQ0FnSUc1aGJXVTZJRndpUVhWa2FXOUVaWE4wYVc1aGRHbHZiazV2WkdWY0lpeGNiaUFnSUNBZ0lHbHVjSFYwY3pvZ1cxeHVJQ0FnSUNBZ0lDQjdYRzRnSUNBZ0lDQWdJQ0FnYm1GdFpUb2dYQ0pIWVdsdVRtOWtaVndpTEZ4dUlDQWdJQ0FnSUNBZ0lHZGhhVzQ2SUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJSFpoYkhWbE9pQXhMRnh1SUNBZ0lDQWdJQ0FnSUNBZ2FXNXdkWFJ6T2lCYlhWeHVJQ0FnSUNBZ0lDQWdJSDBzWEc0Z0lDQWdJQ0FnSUNBZ2FXNXdkWFJ6T2lCYlhWeHVJQ0FnSUNBZ0lDQjlYRzRnSUNBZ0lDQmRYRzRnSUNBZ2ZTazdYRzVjYmlBZ0lDQjJhWEowZFdGc1FYVmthVzlIY21Gd2FDNTFjR1JoZEdVb1czdGNiaUFnSUNBZ0lHbGtPaUF3TEZ4dUlDQWdJQ0FnYm05a1pUb2dKMjl6WTJsc2JHRjBiM0luTEZ4dUlDQWdJQ0FnYjNWMGNIVjBPaUFuYjNWMGNIVjBKeXhjYmlBZ0lDQjlYU2s3WEc1Y2JpQWdJQ0JsZUhCbFkzUW9ZWFZrYVc5RGIyNTBaWGgwTG5SdlNsTlBUaWdwS1M1MGIwVnhkV0ZzS0h0Y2JpQWdJQ0FnSUZ3aWJtRnRaVndpT2x3aVFYVmthVzlFWlhOMGFXNWhkR2x2Yms1dlpHVmNJaXhjYmlBZ0lDQWdJRndpYVc1d2RYUnpYQ0k2VzF4dUlDQWdJQ0FnSUNCN1hHNGdJQ0FnSUNBZ0lDQWdYQ0p1WVcxbFhDSTZYQ0pQYzJOcGJHeGhkRzl5VG05a1pWd2lMRnh1SUNBZ0lDQWdJQ0FnSUZ3aWRIbHdaVndpT2x3aWMybHVaVndpTEZ4dUlDQWdJQ0FnSUNBZ0lGd2labkpsY1hWbGJtTjVYQ0k2ZTF4dUlDQWdJQ0FnSUNBZ0lDQWdYQ0oyWVd4MVpWd2lPalEwTUN4Y0ltbHVjSFYwYzF3aU9sdGRYRzRnSUNBZ0lDQWdJQ0FnZlN4Y2JpQWdJQ0FnSUNBZ0lDQmNJbVJsZEhWdVpWd2lPbnRjYmlBZ0lDQWdJQ0FnSUNBZ0lGd2lkbUZzZFdWY0lqb3dMRndpYVc1d2RYUnpYQ0k2VzExY2JpQWdJQ0FnSUNBZ0lDQjlMRnh1SUNBZ0lDQWdJQ0FnSUZ3aWFXNXdkWFJ6WENJNlcxMWNiaUFnSUNBZ0lDQWdmVnh1SUNBZ0lDQWdYVnh1SUNBZ0lIMHBPMXh1WEc0Z0lDQWdkbWx5ZEhWaGJFRjFaR2x2UjNKaGNHZ3VaR1ZtYVc1bFRtOWtaU2h3YVc1blVHOXVaMFJsYkdGNVVHRnlZVzF6Um1GamRHOXllU3dnSjNCcGJtZFFiMjVuUkdWc1lYa25LVHRjYmx4dUlDQWdJSFpwY25SMVlXeEJkV1JwYjBkeVlYQm9MblZ3WkdGMFpTaGJlMXh1SUNBZ0lDQWdhV1E2SURBc1hHNGdJQ0FnSUNCdWIyUmxPaUFuY0dsdVoxQnZibWRFWld4aGVTY3NYRzRnSUNBZ0lDQnZkWFJ3ZFhRNklDZHZkWFJ3ZFhRbkxGeHVJQ0FnSUgxZEtUdGNiaUFnSUNCbGVIQmxZM1FvWVhWa2FXOURiMjUwWlhoMExuUnZTbE5QVGlncEtTNTBiMFZ4ZFdGc0tIdGNJbTVoYldWY0lqcGNJa0YxWkdsdlJHVnpkR2x1WVhScGIyNU9iMlJsWENJc1hDSnBibkIxZEhOY0lqcGJlMXdpYm1GdFpWd2lPbHdpVTNSbGNtVnZVR0Z1Ym1WeVRtOWtaVndpTEZ3aWNHRnVYQ0k2ZTF3aWRtRnNkV1ZjSWpvdE1TeGNJbWx1Y0hWMGMxd2lPbHRkZlN4Y0ltbHVjSFYwYzF3aU9sdDdYQ0p1WVcxbFhDSTZYQ0pFWld4aGVVNXZaR1ZjSWl4Y0ltUmxiR0Y1VkdsdFpWd2lPbnRjSW5aaGJIVmxYQ0k2TUM0ek16TXpNek16TXpNek16TXpNek16TEZ3aWFXNXdkWFJ6WENJNlcxMTlMRndpYVc1d2RYUnpYQ0k2VzN0Y0ltNWhiV1ZjSWpwY0lrZGhhVzVPYjJSbFhDSXNYQ0puWVdsdVhDSTZlMXdpZG1Gc2RXVmNJam93TGpNek16TXpNek16TXpNek16TXpNek1zWENKcGJuQjFkSE5jSWpwYlhYMHNYQ0pwYm5CMWRITmNJanBiZTF3aWJtRnRaVndpT2x3aVJHVnNZWGxPYjJSbFhDSXNYQ0prWld4aGVWUnBiV1ZjSWpwN1hDSjJZV3gxWlZ3aU9qQXVNek16TXpNek16TXpNek16TXpNek15eGNJbWx1Y0hWMGMxd2lPbHRkZlN4Y0ltbHVjSFYwYzF3aU9sdDdYQ0p1WVcxbFhDSTZYQ0pIWVdsdVRtOWtaVndpTEZ3aVoyRnBibHdpT250Y0luWmhiSFZsWENJNk1DNHpNek16TXpNek16TXpNek16TXpNekxGd2lhVzV3ZFhSelhDSTZXMTE5TEZ3aWFXNXdkWFJ6WENJNlcxd2lQR05wY21OMWJHRnlPa1JsYkdGNVRtOWtaVDVjSWwxOVhYMWRmVjE5WFgwc2Uxd2libUZ0WlZ3aU9sd2lVM1JsY21WdlVHRnVibVZ5VG05a1pWd2lMRndpY0dGdVhDSTZlMXdpZG1Gc2RXVmNJam94TEZ3aWFXNXdkWFJ6WENJNlcxMTlMRndpYVc1d2RYUnpYQ0k2VzN0Y0ltNWhiV1ZjSWpwY0lrUmxiR0Y1VG05a1pWd2lMRndpWkdWc1lYbFVhVzFsWENJNmUxd2lkbUZzZFdWY0lqb3dMak16TXpNek16TXpNek16TXpNek16TXNYQ0pwYm5CMWRITmNJanBiWFgwc1hDSnBibkIxZEhOY0lqcGJlMXdpYm1GdFpWd2lPbHdpUjJGcGJrNXZaR1ZjSWl4Y0ltZGhhVzVjSWpwN1hDSjJZV3gxWlZ3aU9qQXVNek16TXpNek16TXpNek16TXpNek15eGNJbWx1Y0hWMGMxd2lPbHRkZlN4Y0ltbHVjSFYwYzF3aU9sdDdYQ0p1WVcxbFhDSTZYQ0pFWld4aGVVNXZaR1ZjSWl4Y0ltUmxiR0Y1VkdsdFpWd2lPbnRjSW5aaGJIVmxYQ0k2TUM0ek16TXpNek16TXpNek16TXpNek16TEZ3aWFXNXdkWFJ6WENJNlcxMTlMRndpYVc1d2RYUnpYQ0k2VzN0Y0ltNWhiV1ZjSWpwY0lrZGhhVzVPYjJSbFhDSXNYQ0puWVdsdVhDSTZlMXdpZG1Gc2RXVmNJam93TGpNek16TXpNek16TXpNek16TXpNek1zWENKcGJuQjFkSE5jSWpwYlhYMHNYQ0pwYm5CMWRITmNJanBiWENJOFkybHlZM1ZzWVhJNlJHVnNZWGxPYjJSbFBsd2lYWDFkZlYxOVhYMWRmVjE5S1R0Y2JpQWdmU2s3WEc1Y2JpQWdhWFFvSjJOeVpXRjBaWE1nYzNCbFkybG1hV1ZrSUhacGNuUjFZV3dnYm05a1pYTWdZVzVrSUhOMGIzSmxjeUIwYUdWdElHbHVJSFpwY25SMVlXeEJkV1JwYjBkeVlYQm9JSEJ5YjNCbGNuUjVKeXdnS0NrZ1BUNGdlMXh1SUNBZ0lHTnZibk4wSUhacGNuUjFZV3hPYjJSbFVHRnlZVzF6SUQwZ1czdGNiaUFnSUNBZ0lHbGtPaUF4TEZ4dUlDQWdJQ0FnYm05a1pUb2dKMmRoYVc0bkxGeHVJQ0FnSUNBZ2IzVjBjSFYwT2lBbmIzVjBjSFYwSnl4Y2JpQWdJQ0I5TEZ4dUlDQWdJSHRjYmlBZ0lDQWdJR2xrT2lBeUxGeHVJQ0FnSUNBZ2JtOWtaVG9nSjI5elkybHNiR0YwYjNJbkxGeHVJQ0FnSUNBZ2IzVjBjSFYwT2lBeExGeHVJQ0FnSUgxZE8xeHVJQ0FnSUhacGNuUjFZV3hCZFdScGIwZHlZWEJvTG5Wd1pHRjBaU2gyYVhKMGRXRnNUbTlrWlZCaGNtRnRjeWs3WEc0Z0lDQWdaWGh3WldOMEtFRnljbUY1TG1selFYSnlZWGtvZG1seWRIVmhiRUYxWkdsdlIzSmhjR2d1ZG1seWRIVmhiRTV2WkdWektTa3VkRzlDWlNoMGNuVmxLVHRjYmlBZ0lDQmxlSEJsWTNRb2RtbHlkSFZoYkVGMVpHbHZSM0poY0dndWRtbHlkSFZoYkU1dlpHVnpMbXhsYm1kMGFDa3VkRzlDWlNneUtUdGNiaUFnZlNrN1hHNWNiaUFnYVhRb0oyTnlaV0YwWlhNZ1QzTmphV3hzWVhSdmNrNXZaR1VnZDJsMGFDQmhiR3dnZG1Gc2FXUWdjR0Z5WVcxbGRHVnljeWNzSUNncElEMCtJSHRjYmlBZ0lDQmpiMjV6ZENCd1lYSmhiWE1nUFNCN1hHNGdJQ0FnSUNCMGVYQmxPaUFuYzNGMVlYSmxKeXhjYmlBZ0lDQWdJR1p5WlhGMVpXNWplVG9nTkRRd0xGeHVJQ0FnSUNBZ1pHVjBkVzVsT2lBMExGeHVJQ0FnSUgwN1hHNWNiaUFnSUNCamIyNXpkQ0I3ZEhsd1pTd2dabkpsY1hWbGJtTjVMQ0JrWlhSMWJtVjlJRDBnY0dGeVlXMXpPMXh1WEc0Z0lDQWdZMjl1YzNRZ2RtbHlkSFZoYkU1dlpHVlFZWEpoYlhNZ1BTQmJlMXh1SUNBZ0lDQWdhV1E2SURBc1hHNGdJQ0FnSUNCdWIyUmxPaUFuYjNOamFXeHNZWFJ2Y2ljc1hHNGdJQ0FnSUNCd1lYSmhiWE1zWEc0Z0lDQWdJQ0J2ZFhSd2RYUTZJQ2R2ZFhSd2RYUW5MRnh1SUNBZ0lIMWRPMXh1WEc0Z0lDQWdkbWx5ZEhWaGJFRjFaR2x2UjNKaGNHZ3VkWEJrWVhSbEtIWnBjblIxWVd4T2IyUmxVR0Z5WVcxektUdGNiaUFnSUNCamIyNXpkQ0JoZFdScGIwNXZaR1VnUFNCMmFYSjBkV0ZzUVhWa2FXOUhjbUZ3YUM1MmFYSjBkV0ZzVG05a1pYTmJNRjB1WVhWa2FXOU9iMlJsTzF4dUlDQWdJR1Y0Y0dWamRDaGhkV1JwYjA1dlpHVXVZMjl1YzNSeWRXTjBiM0lwTG5SdlFtVW9UM05qYVd4c1lYUnZjazV2WkdVcE8xeHVJQ0FnSUdWNGNHVmpkQ2hoZFdScGIwNXZaR1V1ZEhsd1pTa3VkRzlDWlNoMGVYQmxLVHRjYmlBZ0lDQmxlSEJsWTNRb1lYVmthVzlPYjJSbExtWnlaWEYxWlc1amVTNTJZV3gxWlNrdWRHOUNaU2htY21WeGRXVnVZM2twTzF4dUlDQWdJR1Y0Y0dWamRDaGhkV1JwYjA1dlpHVXVaR1YwZFc1bExuWmhiSFZsS1M1MGIwSmxLR1JsZEhWdVpTazdYRzRnSUgwcE8xeHVYRzRnSUdsMEtDZGpjbVZoZEdWeklFZGhhVzVPYjJSbElIZHBkR2dnWVd4c0lIWmhiR2xrSUhCaGNtRnRaWFJsY25NbkxDQW9LU0E5UGlCN1hHNGdJQ0FnWTI5dWMzUWdaMkZwYmlBOUlEQXVOVHRjYmx4dUlDQWdJR052Ym5OMElIWnBjblIxWVd4T2IyUmxVR0Z5WVcxeklEMGdXM3RjYmlBZ0lDQWdJR2xrT2lBd0xGeHVJQ0FnSUNBZ2JtOWtaVG9nSjJkaGFXNG5MRnh1SUNBZ0lDQWdjR0Z5WVcxek9pQjdYRzRnSUNBZ0lDQWdJR2RoYVc0c1hHNGdJQ0FnSUNCOUxGeHVJQ0FnSUNBZ2IzVjBjSFYwT2lBbmIzVjBjSFYwSnl4Y2JpQWdJQ0I5WFR0Y2JseHVJQ0FnSUhacGNuUjFZV3hCZFdScGIwZHlZWEJvTG5Wd1pHRjBaU2gyYVhKMGRXRnNUbTlrWlZCaGNtRnRjeWs3WEc0Z0lDQWdZMjl1YzNRZ1lYVmthVzlPYjJSbElEMGdkbWx5ZEhWaGJFRjFaR2x2UjNKaGNHZ3VkbWx5ZEhWaGJFNXZaR1Z6V3pCZExtRjFaR2x2VG05a1pUdGNiaUFnSUNCbGVIQmxZM1FvWVhWa2FXOU9iMlJsTG1OdmJuTjBjblZqZEc5eUtTNTBiMEpsS0VkaGFXNU9iMlJsS1R0Y2JpQWdJQ0JsZUhCbFkzUW9ZWFZrYVc5T2IyUmxMbWRoYVc0dWRtRnNkV1VwTG5SdlFtVW9aMkZwYmlrN1hHNGdJSDBwTzF4dVhHNGdJR2wwS0NkamNtVmhkR1Z6SUVKcGNYVmhaRVpwYkhSbGNrNXZaR1VnZDJsMGFDQmhiR3dnZG1Gc2FXUWdjR0Z5WVcxbGRHVnljeWNzSUNncElEMCtJSHRjYmlBZ0lDQmpiMjV6ZENCMGVYQmxJRDBnSjNCbFlXdHBibWNuTzF4dUlDQWdJR052Ym5OMElHWnlaWEYxWlc1amVTQTlJRFV3TUR0Y2JpQWdJQ0JqYjI1emRDQmtaWFIxYm1VZ1BTQTJPMXh1SUNBZ0lHTnZibk4wSUZFZ1BTQXdMalU3WEc1Y2JpQWdJQ0JqYjI1emRDQjJhWEowZFdGc1RtOWtaVkJoY21GdGN5QTlJRnQ3WEc0Z0lDQWdJQ0JwWkRvZ01DeGNiaUFnSUNBZ0lHNXZaR1U2SUNkaWFYRjFZV1JHYVd4MFpYSW5MRnh1SUNBZ0lDQWdjR0Z5WVcxek9pQjdYRzRnSUNBZ0lDQWdJSFI1Y0dVc1hHNGdJQ0FnSUNBZ0lHWnlaWEYxWlc1amVTeGNiaUFnSUNBZ0lDQWdaR1YwZFc1bExGeHVJQ0FnSUNBZ0lDQlJMRnh1SUNBZ0lDQWdmU3hjYmlBZ0lDQWdJRzkxZEhCMWREb2dKMjkxZEhCMWRDY3NYRzRnSUNBZ2ZWMDdYRzVjYmlBZ0lDQjJhWEowZFdGc1FYVmthVzlIY21Gd2FDNTFjR1JoZEdVb2RtbHlkSFZoYkU1dlpHVlFZWEpoYlhNcE8xeHVJQ0FnSUdOdmJuTjBJR0YxWkdsdlRtOWtaU0E5SUhacGNuUjFZV3hCZFdScGIwZHlZWEJvTG5acGNuUjFZV3hPYjJSbGMxc3dYUzVoZFdScGIwNXZaR1U3WEc0Z0lDQWdaWGh3WldOMEtHRjFaR2x2VG05a1pTNWpiMjV6ZEhKMVkzUnZjaWt1ZEc5Q1pTaENhWEYxWVdSR2FXeDBaWEpPYjJSbEtUdGNiaUFnSUNCbGVIQmxZM1FvWVhWa2FXOU9iMlJsTG5SNWNHVXBMblJ2UW1Vb2RIbHdaU2s3WEc0Z0lDQWdaWGh3WldOMEtHRjFaR2x2VG05a1pTNW1jbVZ4ZFdWdVkza3VkbUZzZFdVcExuUnZRbVVvWm5KbGNYVmxibU41S1R0Y2JpQWdJQ0JsZUhCbFkzUW9ZWFZrYVc5T2IyUmxMbVJsZEhWdVpTNTJZV3gxWlNrdWRHOUNaU2hrWlhSMWJtVXBPMXh1SUNBZ0lHVjRjR1ZqZENoaGRXUnBiMDV2WkdVdVVTNTJZV3gxWlNrdWRHOUNaU2hSS1R0Y2JpQWdmU2s3WEc1Y2JpQWdhWFFvSjJOeVpXRjBaWE1nUkdWc1lYbE9iMlJsSUhkcGRHZ2dZV3hzSUhaaGJHbGtJSEJoY21GdFpYUmxjbk1uTENBb0tTQTlQaUI3WEc0Z0lDQWdZMjl1YzNRZ1pHVnNZWGxVYVcxbElEMGdNanRjYmlBZ0lDQmpiMjV6ZENCdFlYaEVaV3hoZVZScGJXVWdQU0ExTzF4dVhHNGdJQ0FnWTI5dWMzUWdkbWx5ZEhWaGJFNXZaR1ZRWVhKaGJYTWdQU0JiZTF4dUlDQWdJQ0FnYVdRNklEQXNYRzRnSUNBZ0lDQnViMlJsT2lBblpHVnNZWGtuTEZ4dUlDQWdJQ0FnY0dGeVlXMXpPaUI3WEc0Z0lDQWdJQ0FnSUdSbGJHRjVWR2x0WlN4Y2JpQWdJQ0FnSUNBZ2JXRjRSR1ZzWVhsVWFXMWxMRnh1SUNBZ0lDQWdmU3hjYmlBZ0lDQWdJRzkxZEhCMWREb2dKMjkxZEhCMWRDY3NYRzRnSUNBZ2ZWMDdYRzVjYmlBZ0lDQjJhWEowZFdGc1FYVmthVzlIY21Gd2FDNTFjR1JoZEdVb2RtbHlkSFZoYkU1dlpHVlFZWEpoYlhNcE8xeHVJQ0FnSUdOdmJuTjBJR0YxWkdsdlRtOWtaU0E5SUhacGNuUjFZV3hCZFdScGIwZHlZWEJvTG5acGNuUjFZV3hPYjJSbGMxc3dYUzVoZFdScGIwNXZaR1U3WEc0Z0lDQWdaWGh3WldOMEtHRjFaR2x2VG05a1pTNWpiMjV6ZEhKMVkzUnZjaWt1ZEc5Q1pTaEVaV3hoZVU1dlpHVXBPMXh1SUNBZ0lHVjRjR1ZqZENoaGRXUnBiMDV2WkdVdVpHVnNZWGxVYVcxbExuWmhiSFZsS1M1MGIwSmxLR1JsYkdGNVZHbHRaU2s3WEc0Z0lIMHBPMXh1WEc0Z0lHbDBLQ2RqY21WaGRHVnpJRk4wWlhKbGIxQmhibTVsY2s1dlpHVWdkMmwwYUNCaGJHd2dkbUZzYVdRZ2NHRnlZVzFsZEdWeWN5Y3NJQ2dwSUQwK0lIdGNiaUFnSUNCamIyNXpkQ0J3WVc0Z1BTQXhPMXh1WEc0Z0lDQWdZMjl1YzNRZ2RtbHlkSFZoYkU1dlpHVlFZWEpoYlhNZ1BTQmJlMXh1SUNBZ0lDQWdhV1E2SURBc1hHNGdJQ0FnSUNCdWIyUmxPaUFuYzNSbGNtVnZVR0Z1Ym1WeUp5eGNiaUFnSUNBZ0lIQmhjbUZ0Y3pvZ2UxeHVJQ0FnSUNBZ0lDQndZVzRzWEc0Z0lDQWdJQ0I5TEZ4dUlDQWdJQ0FnYjNWMGNIVjBPaUFuYjNWMGNIVjBKeXhjYmlBZ0lDQjlYVHRjYmx4dUlDQWdJSFpwY25SMVlXeEJkV1JwYjBkeVlYQm9MblZ3WkdGMFpTaDJhWEowZFdGc1RtOWtaVkJoY21GdGN5azdYRzRnSUNBZ1kyOXVjM1FnWVhWa2FXOU9iMlJsSUQwZ2RtbHlkSFZoYkVGMVpHbHZSM0poY0dndWRtbHlkSFZoYkU1dlpHVnpXekJkTG1GMVpHbHZUbTlrWlR0Y2JpQWdJQ0JsZUhCbFkzUW9ZWFZrYVc5T2IyUmxMbU52Ym5OMGNuVmpkRzl5TG01aGJXVXBMblJ2UW1Vb0oxTjBaWEpsYjFCaGJtNWxjazV2WkdVbktUdGNiaUFnSUNCbGVIQmxZM1FvWVhWa2FXOU9iMlJsTG5CaGJpNTJZV3gxWlNrdWRHOUNaU2h3WVc0cE8xeHVJQ0I5S1R0Y2JuMHBPMXh1SWwxOSIsIid1c2Ugc3RyaWN0JztcblxudmFyIF9jcmVhdGVDbGFzcyA9IHJlcXVpcmUoJ2JhYmVsLXJ1bnRpbWUvaGVscGVycy9jcmVhdGUtY2xhc3MnKVsnZGVmYXVsdCddO1xuXG52YXIgX2NsYXNzQ2FsbENoZWNrID0gcmVxdWlyZSgnYmFiZWwtcnVudGltZS9oZWxwZXJzL2NsYXNzLWNhbGwtY2hlY2snKVsnZGVmYXVsdCddO1xuXG52YXIgX3JlcXVpcmUgPSByZXF1aXJlKCdyYW1kYScpO1xuXG52YXIgYW55ID0gX3JlcXVpcmUuYW55O1xudmFyIGFzc29jID0gX3JlcXVpcmUuYXNzb2M7XG52YXIgY29uY2F0ID0gX3JlcXVpcmUuY29uY2F0O1xudmFyIGNvbXBvc2UgPSBfcmVxdWlyZS5jb21wb3NlO1xudmFyIGRpZmZlcmVuY2VXaXRoID0gX3JlcXVpcmUuZGlmZmVyZW5jZVdpdGg7XG52YXIgZXFQcm9wcyA9IF9yZXF1aXJlLmVxUHJvcHM7XG52YXIgZmluZCA9IF9yZXF1aXJlLmZpbmQ7XG52YXIgZmluZEluZGV4ID0gX3JlcXVpcmUuZmluZEluZGV4O1xudmFyIGZvckVhY2ggPSBfcmVxdWlyZS5mb3JFYWNoO1xudmFyIGludGVyc2VjdGlvbldpdGggPSBfcmVxdWlyZS5pbnRlcnNlY3Rpb25XaXRoO1xudmFyIGlzTmlsID0gX3JlcXVpcmUuaXNOaWw7XG52YXIgbWFwID0gX3JlcXVpcmUubWFwO1xudmFyIHBhcnRpdGlvbiA9IF9yZXF1aXJlLnBhcnRpdGlvbjtcbnZhciBwcm9wRXEgPSBfcmVxdWlyZS5wcm9wRXE7XG52YXIgcmVtb3ZlID0gX3JlcXVpcmUucmVtb3ZlO1xuXG52YXIgY2FwaXRhbGl6ZSA9IHJlcXVpcmUoJ2NhcGl0YWxpemUnKTtcbnZhciBOYXRpdmVWaXJ0dWFsQXVkaW9Ob2RlID0gcmVxdWlyZSgnLi92aXJ0dWFsTm9kZUNvbnN0cnVjdG9ycy9OYXRpdmVWaXJ0dWFsQXVkaW9Ob2RlJyk7XG52YXIgQ3VzdG9tVmlydHVhbEF1ZGlvTm9kZSA9IHJlcXVpcmUoJy4vdmlydHVhbE5vZGVDb25zdHJ1Y3RvcnMvQ3VzdG9tVmlydHVhbEF1ZGlvTm9kZScpO1xudmFyIGNvbm5lY3RBdWRpb05vZGVzID0gcmVxdWlyZSgnLi90b29scy9jb25uZWN0QXVkaW9Ob2RlcycpO1xuXG52YXIgZGlzY29ubmVjdEFuZFJlbW92ZVZpcnR1YWxBdWRpb05vZGUgPSBmdW5jdGlvbiBkaXNjb25uZWN0QW5kUmVtb3ZlVmlydHVhbEF1ZGlvTm9kZSh2aXJ0dWFsTm9kZSkge1xuICB2aXJ0dWFsTm9kZS5kaXNjb25uZWN0KCk7XG4gIHRoaXMudmlydHVhbE5vZGVzID0gcmVtb3ZlKGZpbmRJbmRleChwcm9wRXEoJ2lkJywgdmlydHVhbE5vZGUuaWQpKSh0aGlzLnZpcnR1YWxOb2RlcyksIDEsIHRoaXMudmlydHVhbE5vZGVzKTtcbn07XG5cbnZhciBjcmVhdGVWaXJ0dWFsQXVkaW9Ob2Rlc0FuZFVwZGF0ZVZpcnR1YWxBdWRpb0dyYXBoID0gZnVuY3Rpb24gY3JlYXRlVmlydHVhbEF1ZGlvTm9kZXNBbmRVcGRhdGVWaXJ0dWFsQXVkaW9HcmFwaCh2aXJ0dWFsQXVkaW9Ob2RlUGFyYW1zKSB7XG4gIHZhciBuZXdWaXJ0dWFsQXVkaW9Ob2RlUGFyYW1zID0gZGlmZmVyZW5jZVdpdGgoZXFQcm9wcygnaWQnKSwgdmlydHVhbEF1ZGlvTm9kZVBhcmFtcywgdGhpcy52aXJ0dWFsTm9kZXMpO1xuXG4gIHRoaXMudmlydHVhbE5vZGVzID0gY29uY2F0KHRoaXMudmlydHVhbE5vZGVzLCB0aGlzLmNyZWF0ZVZpcnR1YWxBdWRpb05vZGVzKG5ld1ZpcnR1YWxBdWRpb05vZGVQYXJhbXMpKTtcblxuICByZXR1cm4gdmlydHVhbEF1ZGlvTm9kZVBhcmFtcztcbn07XG5cbnZhciByZW1vdmVBdWRpb05vZGVzQW5kVXBkYXRlVmlydHVhbEF1ZGlvR3JhcGggPSBmdW5jdGlvbiByZW1vdmVBdWRpb05vZGVzQW5kVXBkYXRlVmlydHVhbEF1ZGlvR3JhcGgodmlydHVhbEF1ZGlvTm9kZVBhcmFtcykge1xuICB2YXIgdmlydHVhbE5vZGVzVG9CZVJlbW92ZWQgPSBkaWZmZXJlbmNlV2l0aChlcVByb3BzKCdpZCcpLCB0aGlzLnZpcnR1YWxOb2RlcywgdmlydHVhbEF1ZGlvTm9kZVBhcmFtcyk7XG5cbiAgZm9yRWFjaChkaXNjb25uZWN0QW5kUmVtb3ZlVmlydHVhbEF1ZGlvTm9kZS5iaW5kKHRoaXMpLCB2aXJ0dWFsTm9kZXNUb0JlUmVtb3ZlZCk7XG5cbiAgcmV0dXJuIHZpcnR1YWxBdWRpb05vZGVQYXJhbXM7XG59O1xuXG52YXIgdXBkYXRlQXVkaW9Ob2Rlc0FuZFVwZGF0ZVZpcnR1YWxBdWRpb0dyYXBoID0gZnVuY3Rpb24gdXBkYXRlQXVkaW9Ob2Rlc0FuZFVwZGF0ZVZpcnR1YWxBdWRpb0dyYXBoKHZpcnR1YWxBdWRpb05vZGVQYXJhbXMpIHtcbiAgdmFyIF90aGlzID0gdGhpcztcblxuICB2YXIgdXBkYXRlUGFyYW1zID0gaW50ZXJzZWN0aW9uV2l0aChlcVByb3BzKCdpZCcpLCB2aXJ0dWFsQXVkaW9Ob2RlUGFyYW1zLCB0aGlzLnZpcnR1YWxOb2Rlcyk7XG5cbiAgZm9yRWFjaChmdW5jdGlvbiAodmlydHVhbEF1ZGlvTm9kZVBhcmFtKSB7XG4gICAgdmFyIHZpcnR1YWxBdWRpb05vZGUgPSBmaW5kKHByb3BFcSgnaWQnLCB2aXJ0dWFsQXVkaW9Ob2RlUGFyYW0uaWQpKShfdGhpcy52aXJ0dWFsTm9kZXMpO1xuICAgIGlmICh2aXJ0dWFsQXVkaW9Ob2RlUGFyYW0ubm9kZSAhPT0gdmlydHVhbEF1ZGlvTm9kZS5ub2RlKSBkaXNjb25uZWN0QW5kUmVtb3ZlVmlydHVhbEF1ZGlvTm9kZS5jYWxsKF90aGlzLCB2aXJ0dWFsQXVkaW9Ob2RlKTtcbiAgICB2aXJ0dWFsQXVkaW9Ob2RlLnVwZGF0ZUF1ZGlvTm9kZSh2aXJ0dWFsQXVkaW9Ob2RlUGFyYW0ucGFyYW1zKTtcbiAgfSwgdXBkYXRlUGFyYW1zKTtcblxuICByZXR1cm4gdmlydHVhbEF1ZGlvTm9kZVBhcmFtcztcbn07XG5cbnZhciBWaXJ0dWFsQXVkaW9HcmFwaCA9IChmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIFZpcnR1YWxBdWRpb0dyYXBoKCkge1xuICAgIHZhciBwYXJhbXMgPSBhcmd1bWVudHNbMF0gPT09IHVuZGVmaW5lZCA/IHt9IDogYXJndW1lbnRzWzBdO1xuXG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIFZpcnR1YWxBdWRpb0dyYXBoKTtcblxuICAgIHRoaXMuYXVkaW9Db250ZXh0ID0gcGFyYW1zLmF1ZGlvQ29udGV4dCB8fCBuZXcgQXVkaW9Db250ZXh0KCk7XG4gICAgdGhpcy5vdXRwdXQgPSBwYXJhbXMub3V0cHV0IHx8IHRoaXMuYXVkaW9Db250ZXh0LmRlc3RpbmF0aW9uO1xuICAgIHRoaXMudmlydHVhbE5vZGVzID0gW107XG4gICAgdGhpcy5jdXN0b21Ob2RlcyA9IHt9O1xuXG4gICAgdGhpcy5fcmVtb3ZlVXBkYXRlQW5kQ3JlYXRlID0gY29tcG9zZShjcmVhdGVWaXJ0dWFsQXVkaW9Ob2Rlc0FuZFVwZGF0ZVZpcnR1YWxBdWRpb0dyYXBoLmJpbmQodGhpcyksIHVwZGF0ZUF1ZGlvTm9kZXNBbmRVcGRhdGVWaXJ0dWFsQXVkaW9HcmFwaC5iaW5kKHRoaXMpLCByZW1vdmVBdWRpb05vZGVzQW5kVXBkYXRlVmlydHVhbEF1ZGlvR3JhcGguYmluZCh0aGlzKSk7XG4gIH1cblxuICBfY3JlYXRlQ2xhc3MoVmlydHVhbEF1ZGlvR3JhcGgsIFt7XG4gICAga2V5OiAnY3JlYXRlVmlydHVhbEF1ZGlvTm9kZXMnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBjcmVhdGVWaXJ0dWFsQXVkaW9Ob2Rlcyh2aXJ0dWFsQXVkaW9Ob2Rlc1BhcmFtcykge1xuICAgICAgdmFyIF90aGlzMiA9IHRoaXM7XG5cbiAgICAgIHZhciBwYXJ0aXRpb25lZFZpcnR1YWxBdWRpb05vZGVQYXJhbXMgPSBwYXJ0aXRpb24oZnVuY3Rpb24gKF9yZWYpIHtcbiAgICAgICAgdmFyIG5vZGUgPSBfcmVmLm5vZGU7XG4gICAgICAgIHJldHVybiBpc05pbChfdGhpczIuY3VzdG9tTm9kZXNbbm9kZV0pO1xuICAgICAgfSwgdmlydHVhbEF1ZGlvTm9kZXNQYXJhbXMpO1xuXG4gICAgICB2YXIgbmF0aXZlVmlydHVhbEF1ZGlvTm9kZVBhcmFtcyA9IHBhcnRpdGlvbmVkVmlydHVhbEF1ZGlvTm9kZVBhcmFtc1swXTtcbiAgICAgIHZhciBjdXN0b21WaXJ0dWFsQXVkaW9Ob2RlUGFyYW1zID0gcGFydGl0aW9uZWRWaXJ0dWFsQXVkaW9Ob2RlUGFyYW1zWzFdO1xuXG4gICAgICB2YXIgbmF0aXZlVmlydHVhbEF1ZGlvTm9kZXMgPSBtYXAoZnVuY3Rpb24gKHZpcnR1YWxBdWRpb05vZGVQYXJhbXMpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBOYXRpdmVWaXJ0dWFsQXVkaW9Ob2RlKF90aGlzMiwgdmlydHVhbEF1ZGlvTm9kZVBhcmFtcyk7XG4gICAgICB9LCBuYXRpdmVWaXJ0dWFsQXVkaW9Ob2RlUGFyYW1zKTtcbiAgICAgIHZhciBjdXN0b21WaXJ0dWFsQXVkaW9Ob2RlcyA9IG1hcChmdW5jdGlvbiAodmlydHVhbEF1ZGlvTm9kZVBhcmFtcykge1xuICAgICAgICByZXR1cm4gbmV3IEN1c3RvbVZpcnR1YWxBdWRpb05vZGUoX3RoaXMyLCB2aXJ0dWFsQXVkaW9Ob2RlUGFyYW1zKTtcbiAgICAgIH0sIGN1c3RvbVZpcnR1YWxBdWRpb05vZGVQYXJhbXMpO1xuXG4gICAgICByZXR1cm4gY29uY2F0KG5hdGl2ZVZpcnR1YWxBdWRpb05vZGVzLCBjdXN0b21WaXJ0dWFsQXVkaW9Ob2Rlcyk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiAnZGVmaW5lTm9kZScsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGRlZmluZU5vZGUoY3VzdG9tTm9kZVBhcmFtc0ZhY3RvcnksIG5hbWUpIHtcbiAgICAgIGlmICh0aGlzLmF1ZGlvQ29udGV4dFsnY3JlYXRlJyArIGNhcGl0YWxpemUobmFtZSldKSB0aHJvdyBuZXcgRXJyb3IobmFtZSArICcgaXMgYSBzdGFuZGFyZCBhdWRpbyBub2RlIG5hbWUgYW5kIGNhbm5vdCBiZSBvdmVyd3JpdHRlbicpO1xuXG4gICAgICB0aGlzLmN1c3RvbU5vZGVzW25hbWVdID0gY3VzdG9tTm9kZVBhcmFtc0ZhY3Rvcnk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6ICd1cGRhdGUnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB1cGRhdGUodmlydHVhbEF1ZGlvTm9kZVBhcmFtcykge1xuICAgICAgdmFyIF90aGlzMyA9IHRoaXM7XG5cbiAgICAgIGlmIChhbnkocHJvcEVxKCdpZCcsIHVuZGVmaW5lZCksIHZpcnR1YWxBdWRpb05vZGVQYXJhbXMpKSB0aHJvdyBuZXcgRXJyb3IoJ0V2ZXJ5IHZpcnR1YWxBdWRpb05vZGUgbmVlZHMgYW4gaWQgZm9yIGVmZmljaWVudCBkaWZmaW5nIGFuZCBkZXRlcm1pbmluZyByZWxhdGlvbnNoaXBzIGJldHdlZW4gbm9kZXMnKTtcblxuICAgICAgdGhpcy5fcmVtb3ZlVXBkYXRlQW5kQ3JlYXRlKHZpcnR1YWxBdWRpb05vZGVQYXJhbXMpO1xuICAgICAgY29ubmVjdEF1ZGlvTm9kZXMoQ3VzdG9tVmlydHVhbEF1ZGlvTm9kZSwgdGhpcy52aXJ0dWFsTm9kZXMsIGZ1bmN0aW9uICh2aXJ0dWFsQXVkaW9Ob2RlKSB7XG4gICAgICAgIHJldHVybiB2aXJ0dWFsQXVkaW9Ob2RlLmNvbm5lY3QoX3RoaXMzLm91dHB1dCk7XG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIFZpcnR1YWxBdWRpb0dyYXBoO1xufSkoKTtcblxubW9kdWxlLmV4cG9ydHMgPSBWaXJ0dWFsQXVkaW9HcmFwaDtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTlvYjIxbEwySXZaR1YyTDNacGNuUjFZV3d0WVhWa2FXOHRaM0poY0dndmMzSmpMMVpwY25SMVlXeEJkV1JwYjBkeVlYQm9MbXB6SWwwc0ltNWhiV1Z6SWpwYlhTd2liV0Z3Y0dsdVozTWlPaUk3T3pzN096dGxRVU0yUkN4UFFVRlBMRU5CUVVNc1QwRkJUeXhEUVVGRE96dEpRVVIwUlN4SFFVRkhMRmxCUVVnc1IwRkJSenRKUVVGRkxFdEJRVXNzV1VGQlRDeExRVUZMTzBsQlFVVXNUVUZCVFN4WlFVRk9MRTFCUVUwN1NVRkJSU3hQUVVGUExGbEJRVkFzVDBGQlR6dEpRVUZGTEdOQlFXTXNXVUZCWkN4alFVRmpPMGxCUVVVc1QwRkJUeXhaUVVGUUxFOUJRVTg3U1VGQlJTeEpRVUZKTEZsQlFVb3NTVUZCU1R0SlFVRkZMRk5CUVZNc1dVRkJWQ3hUUVVGVE8wbEJRVVVzVDBGQlR5eFpRVUZRTEU5QlFVODdTVUZEYmtZc1owSkJRV2RDTEZsQlFXaENMR2RDUVVGblFqdEpRVUZGTEV0QlFVc3NXVUZCVEN4TFFVRkxPMGxCUVVVc1IwRkJSeXhaUVVGSUxFZEJRVWM3U1VGQlJTeFRRVUZUTEZsQlFWUXNVMEZCVXp0SlFVRkZMRTFCUVUwc1dVRkJUaXhOUVVGTk8wbEJRVVVzVFVGQlRTeFpRVUZPTEUxQlFVMDdPMEZCUTNwRUxFbEJRVTBzVlVGQlZTeEhRVUZITEU5QlFVOHNRMEZCUXl4WlFVRlpMRU5CUVVNc1EwRkJRenRCUVVONlF5eEpRVUZOTEhOQ1FVRnpRaXhIUVVGSExFOUJRVThzUTBGQlF5eHJSRUZCYTBRc1EwRkJReXhEUVVGRE8wRkJRek5HTEVsQlFVMHNjMEpCUVhOQ0xFZEJRVWNzVDBGQlR5eERRVUZETEd0RVFVRnJSQ3hEUVVGRExFTkJRVU03UVVGRE0wWXNTVUZCVFN4cFFrRkJhVUlzUjBGQlJ5eFBRVUZQTEVOQlFVTXNNa0pCUVRKQ0xFTkJRVU1zUTBGQlF6czdRVUZGTDBRc1NVRkJUU3h0UTBGQmJVTXNSMEZCUnl4VFFVRjBReXh0UTBGQmJVTXNRMEZCWVN4WFFVRlhMRVZCUVVVN1FVRkRha1VzWVVGQlZ5eERRVUZETEZWQlFWVXNSVUZCUlN4RFFVRkRPMEZCUTNwQ0xFMUJRVWtzUTBGQlF5eFpRVUZaTEVkQlFVY3NUVUZCVFN4RFFVRkRMRk5CUVZNc1EwRkJReXhOUVVGTkxFTkJRVU1zU1VGQlNTeEZRVUZGTEZkQlFWY3NRMEZCUXl4RlFVRkZMRU5CUVVNc1EwRkJReXhEUVVGRExFbEJRVWtzUTBGQlF5eFpRVUZaTEVOQlFVTXNSVUZCUlN4RFFVRkRMRVZCUVVVc1NVRkJTU3hEUVVGRExGbEJRVmtzUTBGQlF5eERRVUZETzBOQlF6bEhMRU5CUVVNN08wRkJSVVlzU1VGQlRTeHBSRUZCYVVRc1IwRkJSeXhUUVVGd1JDeHBSRUZCYVVRc1EwRkJZU3h6UWtGQmMwSXNSVUZCUlR0QlFVTXhSaXhOUVVGTkxIbENRVUY1UWl4SFFVRkhMR05CUVdNc1EwRkJReXhQUVVGUExFTkJRVU1zU1VGQlNTeERRVUZETEVWQlFVVXNjMEpCUVhOQ0xFVkJRVVVzU1VGQlNTeERRVUZETEZsQlFWa3NRMEZCUXl4RFFVRkRPenRCUVVVelJ5eE5RVUZKTEVOQlFVTXNXVUZCV1N4SFFVRkhMRTFCUVUwc1EwRkJReXhKUVVGSkxFTkJRVU1zV1VGQldTeEZRVUZGTEVsQlFVa3NRMEZCUXl4MVFrRkJkVUlzUTBGQlF5eDVRa0ZCZVVJc1EwRkJReXhEUVVGRExFTkJRVU03TzBGQlJYWkhMRk5CUVU4c2MwSkJRWE5DTEVOQlFVTTdRMEZETDBJc1EwRkJRenM3UVVGRlJpeEpRVUZOTERCRFFVRXdReXhIUVVGSExGTkJRVGRETERCRFFVRXdReXhEUVVGaExITkNRVUZ6UWl4RlFVRkZPMEZCUTI1R0xFMUJRVTBzZFVKQlFYVkNMRWRCUVVjc1kwRkJZeXhEUVVGRExFOUJRVThzUTBGQlF5eEpRVUZKTEVOQlFVTXNSVUZCUlN4SlFVRkpMRU5CUVVNc1dVRkJXU3hGUVVGRkxITkNRVUZ6UWl4RFFVRkRMRU5CUVVNN08wRkJSWHBITEZOQlFVOHNRMEZCUXl4dFEwRkJiVU1zUTBGQlF5eEpRVUZKTEVOQlFVTXNTVUZCU1N4RFFVRkRMRVZCUVVVc2RVSkJRWFZDTEVOQlFVTXNRMEZCUXpzN1FVRkZha1lzVTBGQlR5eHpRa0ZCYzBJc1EwRkJRenREUVVNdlFpeERRVUZET3p0QlFVVkdMRWxCUVUwc01FTkJRVEJETEVkQlFVY3NVMEZCTjBNc01FTkJRVEJETEVOQlFXRXNjMEpCUVhOQ0xFVkJRVVU3T3p0QlFVTnVSaXhOUVVGTkxGbEJRVmtzUjBGQlJ5eG5Ra0ZCWjBJc1EwRkJReXhQUVVGUExFTkJRVU1zU1VGQlNTeERRVUZETEVWQlFVVXNjMEpCUVhOQ0xFVkJRVVVzU1VGQlNTeERRVUZETEZsQlFWa3NRMEZCUXl4RFFVRkRPenRCUVVWb1J5eFRRVUZQTEVOQlFVTXNWVUZCUXl4eFFrRkJjVUlzUlVGQlN6dEJRVU5xUXl4UlFVRk5MR2RDUVVGblFpeEhRVUZITEVsQlFVa3NRMEZCUXl4TlFVRk5MRU5CUVVNc1NVRkJTU3hGUVVGRkxIRkNRVUZ4UWl4RFFVRkRMRVZCUVVVc1EwRkJReXhEUVVGRExFTkJRVU1zVFVGQlN5eFpRVUZaTEVOQlFVTXNRMEZCUXp0QlFVTjZSaXhSUVVGSkxIRkNRVUZ4UWl4RFFVRkRMRWxCUVVrc1MwRkJTeXhuUWtGQlowSXNRMEZCUXl4SlFVRkpMRVZCUTNSRUxHMURRVUZ0UXl4RFFVRkRMRWxCUVVrc1VVRkJUeXhuUWtGQlowSXNRMEZCUXl4RFFVRkRPMEZCUTI1RkxHOUNRVUZuUWl4RFFVRkRMR1ZCUVdVc1EwRkJReXh4UWtGQmNVSXNRMEZCUXl4TlFVRk5MRU5CUVVNc1EwRkJRenRIUVVOb1JTeEZRVUZGTEZsQlFWa3NRMEZCUXl4RFFVRkRPenRCUVVWcVFpeFRRVUZQTEhOQ1FVRnpRaXhEUVVGRE8wTkJReTlDTEVOQlFVTTdPMGxCUlVrc2FVSkJRV2xDTzBGQlExUXNWMEZFVWl4cFFrRkJhVUlzUjBGRFN6dFJRVUZpTEUxQlFVMHNaME5CUVVjc1JVRkJSVHM3TUVKQlJIQkNMR2xDUVVGcFFqczdRVUZGYmtJc1VVRkJTU3hEUVVGRExGbEJRVmtzUjBGQlJ5eE5RVUZOTEVOQlFVTXNXVUZCV1N4SlFVRkpMRWxCUVVrc1dVRkJXU3hGUVVGRkxFTkJRVU03UVVGRE9VUXNVVUZCU1N4RFFVRkRMRTFCUVUwc1IwRkJSeXhOUVVGTkxFTkJRVU1zVFVGQlRTeEpRVUZKTEVsQlFVa3NRMEZCUXl4WlFVRlpMRU5CUVVNc1YwRkJWeXhEUVVGRE8wRkJRemRFTEZGQlFVa3NRMEZCUXl4WlFVRlpMRWRCUVVjc1JVRkJSU3hEUVVGRE8wRkJRM1pDTEZGQlFVa3NRMEZCUXl4WFFVRlhMRWRCUVVjc1JVRkJSU3hEUVVGRE96dEJRVVYwUWl4UlFVRkpMRU5CUVVNc2MwSkJRWE5DTEVkQlFVY3NUMEZCVHl4RFFVTnVReXhwUkVGQmFVUXNRMEZCUXl4SlFVRkpMRU5CUVVNc1NVRkJTU3hEUVVGRExFVkJRelZFTERCRFFVRXdReXhEUVVGRExFbEJRVWtzUTBGQlF5eEpRVUZKTEVOQlFVTXNSVUZEY2tRc01FTkJRVEJETEVOQlFVTXNTVUZCU1N4RFFVRkRMRWxCUVVrc1EwRkJReXhEUVVOMFJDeERRVUZETzBkQlEwZzdPMlZCV2tjc2FVSkJRV2xDT3p0WFFXTkhMR2xEUVVGRExIVkNRVUYxUWl4RlFVRkZPenM3UVVGRGFFUXNWVUZCVFN4cFEwRkJhVU1zUjBGQlJ5eFRRVUZUTEVOQlFVTXNWVUZCUXl4SlFVRk5PMWxCUVV3c1NVRkJTU3hIUVVGTUxFbEJRVTBzUTBGQlRDeEpRVUZKTzJWQlEzaEVMRXRCUVVzc1EwRkJReXhQUVVGTExGZEJRVmNzUTBGQlF5eEpRVUZKTEVOQlFVTXNRMEZCUXp0UFFVRkJMRVZCUVVVc2RVSkJRWFZDTEVOQlFVTXNRMEZCUXpzN1FVRkZNVVFzVlVGQlRTdzBRa0ZCTkVJc1IwRkJSeXhwUTBGQmFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJRenRCUVVNeFJTeFZRVUZOTERSQ1FVRTBRaXhIUVVGSExHbERRVUZwUXl4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRE96dEJRVVV4UlN4VlFVRk5MSFZDUVVGMVFpeEhRVUZITEVkQlFVY3NRMEZCUXl4VlFVRkRMSE5DUVVGelFqdGxRVU42UkN4SlFVRkpMSE5DUVVGelFpeFRRVUZQTEhOQ1FVRnpRaXhEUVVGRE8wOUJRVUVzUlVGQlJTdzBRa0ZCTkVJc1EwRkJReXhEUVVGRE8wRkJRekZHTEZWQlFVMHNkVUpCUVhWQ0xFZEJRVWNzUjBGQlJ5eERRVUZETEZWQlFVTXNjMEpCUVhOQ08yVkJRM3BFTEVsQlFVa3NjMEpCUVhOQ0xGTkJRVThzYzBKQlFYTkNMRU5CUVVNN1QwRkJRU3hGUVVGRkxEUkNRVUUwUWl4RFFVRkRMRU5CUVVNN08wRkJSVEZHTEdGQlFVOHNUVUZCVFN4RFFVRkRMSFZDUVVGMVFpeEZRVUZGTEhWQ1FVRjFRaXhEUVVGRExFTkJRVU03UzBGRGFrVTdPenRYUVVWVkxHOUNRVUZETEhWQ1FVRjFRaXhGUVVGRkxFbEJRVWtzUlVGQlJUdEJRVU42UXl4VlFVRkpMRWxCUVVrc1EwRkJReXhaUVVGWkxGbEJRVlVzVlVGQlZTeERRVUZETEVsQlFVa3NRMEZCUXl4RFFVRkhMRVZCUTJoRUxFMUJRVTBzU1VGQlNTeExRVUZMTEVOQlFVa3NTVUZCU1N3NFJFRkJNa1FzUTBGQlF6czdRVUZGY2tZc1ZVRkJTU3hEUVVGRExGZEJRVmNzUTBGQlF5eEpRVUZKTEVOQlFVTXNSMEZCUnl4MVFrRkJkVUlzUTBGQlF6dEJRVU5xUkN4aFFVRlBMRWxCUVVrc1EwRkJRenRMUVVOaU96czdWMEZGVFN4blFrRkJReXh6UWtGQmMwSXNSVUZCUlRzN08wRkJRemxDTEZWQlFVa3NSMEZCUnl4RFFVRkRMRTFCUVUwc1EwRkJReXhKUVVGSkxFVkJRVVVzVTBGQlV5eERRVUZETEVWQlFVVXNjMEpCUVhOQ0xFTkJRVU1zUlVGRGRFUXNUVUZCVFN4SlFVRkpMRXRCUVVzc1EwRkJReXh6UjBGQmMwY3NRMEZCUXl4RFFVRkRPenRCUVVVeFNDeFZRVUZKTEVOQlFVTXNjMEpCUVhOQ0xFTkJRVU1zYzBKQlFYTkNMRU5CUVVNc1EwRkJRenRCUVVOd1JDeDFRa0ZCYVVJc1EwRkJReXh6UWtGQmMwSXNSVUZCUlN4SlFVRkpMRU5CUVVNc1dVRkJXU3hGUVVGRkxGVkJRVU1zWjBKQlFXZENPMlZCUXpWRkxHZENRVUZuUWl4RFFVRkRMRTlCUVU4c1EwRkJReXhQUVVGTExFMUJRVTBzUTBGQlF6dFBRVUZCTEVOQlFVTXNRMEZCUXpzN1FVRkZla01zWVVGQlR5eEpRVUZKTEVOQlFVTTdTMEZEWWpzN08xTkJPVU5ITEdsQ1FVRnBRanM3TzBGQmFVUjJRaXhOUVVGTkxFTkJRVU1zVDBGQlR5eEhRVUZITEdsQ1FVRnBRaXhEUVVGRElpd2labWxzWlNJNklpOW9iMjFsTDJJdlpHVjJMM1pwY25SMVlXd3RZWFZrYVc4dFozSmhjR2d2YzNKakwxWnBjblIxWVd4QmRXUnBiMGR5WVhCb0xtcHpJaXdpYzI5MWNtTmxjME52Ym5SbGJuUWlPbHNpWTI5dWMzUWdlMkZ1ZVN3Z1lYTnpiMk1zSUdOdmJtTmhkQ3dnWTI5dGNHOXpaU3dnWkdsbVptVnlaVzVqWlZkcGRHZ3NJR1Z4VUhKdmNITXNJR1pwYm1Rc0lHWnBibVJKYm1SbGVDd2dabTl5UldGamFDeGNiaUFnYVc1MFpYSnpaV04wYVc5dVYybDBhQ3dnYVhOT2FXd3NJRzFoY0N3Z2NHRnlkR2wwYVc5dUxDQndjbTl3UlhFc0lISmxiVzkyWlgwZ1BTQnlaWEYxYVhKbEtDZHlZVzFrWVNjcE8xeHVZMjl1YzNRZ1kyRndhWFJoYkdsNlpTQTlJSEpsY1hWcGNtVW9KMk5oY0dsMFlXeHBlbVVuS1R0Y2JtTnZibk4wSUU1aGRHbDJaVlpwY25SMVlXeEJkV1JwYjA1dlpHVWdQU0J5WlhGMWFYSmxLQ2N1TDNacGNuUjFZV3hPYjJSbFEyOXVjM1J5ZFdOMGIzSnpMMDVoZEdsMlpWWnBjblIxWVd4QmRXUnBiMDV2WkdVbktUdGNibU52Ym5OMElFTjFjM1J2YlZacGNuUjFZV3hCZFdScGIwNXZaR1VnUFNCeVpYRjFhWEpsS0NjdUwzWnBjblIxWVd4T2IyUmxRMjl1YzNSeWRXTjBiM0p6TDBOMWMzUnZiVlpwY25SMVlXeEJkV1JwYjA1dlpHVW5LVHRjYm1OdmJuTjBJR052Ym01bFkzUkJkV1JwYjA1dlpHVnpJRDBnY21WeGRXbHlaU2duTGk5MGIyOXNjeTlqYjI1dVpXTjBRWFZrYVc5T2IyUmxjeWNwTzF4dVhHNWpiMjV6ZENCa2FYTmpiMjV1WldOMFFXNWtVbVZ0YjNabFZtbHlkSFZoYkVGMVpHbHZUbTlrWlNBOUlHWjFibU4wYVc5dUlDaDJhWEowZFdGc1RtOWtaU2tnZTF4dUlDQjJhWEowZFdGc1RtOWtaUzVrYVhOamIyNXVaV04wS0NrN1hHNGdJSFJvYVhNdWRtbHlkSFZoYkU1dlpHVnpJRDBnY21WdGIzWmxLR1pwYm1SSmJtUmxlQ2h3Y205d1JYRW9YQ0pwWkZ3aUxDQjJhWEowZFdGc1RtOWtaUzVwWkNrcEtIUm9hWE11ZG1seWRIVmhiRTV2WkdWektTd2dNU3dnZEdocGN5NTJhWEowZFdGc1RtOWtaWE1wTzF4dWZUdGNibHh1WTI5dWMzUWdZM0psWVhSbFZtbHlkSFZoYkVGMVpHbHZUbTlrWlhOQmJtUlZjR1JoZEdWV2FYSjBkV0ZzUVhWa2FXOUhjbUZ3YUNBOUlHWjFibU4wYVc5dUlDaDJhWEowZFdGc1FYVmthVzlPYjJSbFVHRnlZVzF6S1NCN1hHNGdJR052Ym5OMElHNWxkMVpwY25SMVlXeEJkV1JwYjA1dlpHVlFZWEpoYlhNZ1BTQmthV1ptWlhKbGJtTmxWMmwwYUNobGNWQnliM0J6S0NkcFpDY3BMQ0IyYVhKMGRXRnNRWFZrYVc5T2IyUmxVR0Z5WVcxekxDQjBhR2x6TG5acGNuUjFZV3hPYjJSbGN5azdYRzVjYmlBZ2RHaHBjeTUyYVhKMGRXRnNUbTlrWlhNZ1BTQmpiMjVqWVhRb2RHaHBjeTUyYVhKMGRXRnNUbTlrWlhNc0lIUm9hWE11WTNKbFlYUmxWbWx5ZEhWaGJFRjFaR2x2VG05a1pYTW9ibVYzVm1seWRIVmhiRUYxWkdsdlRtOWtaVkJoY21GdGN5a3BPMXh1WEc0Z0lISmxkSFZ5YmlCMmFYSjBkV0ZzUVhWa2FXOU9iMlJsVUdGeVlXMXpPMXh1ZlR0Y2JseHVZMjl1YzNRZ2NtVnRiM1psUVhWa2FXOU9iMlJsYzBGdVpGVndaR0YwWlZacGNuUjFZV3hCZFdScGIwZHlZWEJvSUQwZ1puVnVZM1JwYjI0Z0tIWnBjblIxWVd4QmRXUnBiMDV2WkdWUVlYSmhiWE1wSUh0Y2JpQWdZMjl1YzNRZ2RtbHlkSFZoYkU1dlpHVnpWRzlDWlZKbGJXOTJaV1FnUFNCa2FXWm1aWEpsYm1ObFYybDBhQ2hsY1ZCeWIzQnpLQ2RwWkNjcExDQjBhR2x6TG5acGNuUjFZV3hPYjJSbGN5d2dkbWx5ZEhWaGJFRjFaR2x2VG05a1pWQmhjbUZ0Y3lrN1hHNWNiaUFnWm05eVJXRmphQ2hrYVhOamIyNXVaV04wUVc1a1VtVnRiM1psVm1seWRIVmhiRUYxWkdsdlRtOWtaUzVpYVc1a0tIUm9hWE1wTENCMmFYSjBkV0ZzVG05a1pYTlViMEpsVW1WdGIzWmxaQ2s3WEc1Y2JpQWdjbVYwZFhKdUlIWnBjblIxWVd4QmRXUnBiMDV2WkdWUVlYSmhiWE03WEc1OU8xeHVYRzVqYjI1emRDQjFjR1JoZEdWQmRXUnBiMDV2WkdWelFXNWtWWEJrWVhSbFZtbHlkSFZoYkVGMVpHbHZSM0poY0dnZ1BTQm1kVzVqZEdsdmJpQW9kbWx5ZEhWaGJFRjFaR2x2VG05a1pWQmhjbUZ0Y3lrZ2UxeHVJQ0JqYjI1emRDQjFjR1JoZEdWUVlYSmhiWE1nUFNCcGJuUmxjbk5sWTNScGIyNVhhWFJvS0dWeFVISnZjSE1vSjJsa0p5a3NJSFpwY25SMVlXeEJkV1JwYjA1dlpHVlFZWEpoYlhNc0lIUm9hWE11ZG1seWRIVmhiRTV2WkdWektUdGNibHh1SUNCbWIzSkZZV05vS0NoMmFYSjBkV0ZzUVhWa2FXOU9iMlJsVUdGeVlXMHBJRDArSUh0Y2JpQWdJQ0JqYjI1emRDQjJhWEowZFdGc1FYVmthVzlPYjJSbElEMGdabWx1WkNod2NtOXdSWEVvWENKcFpGd2lMQ0IyYVhKMGRXRnNRWFZrYVc5T2IyUmxVR0Z5WVcwdWFXUXBLU2gwYUdsekxuWnBjblIxWVd4T2IyUmxjeWs3WEc0Z0lDQWdhV1lnS0hacGNuUjFZV3hCZFdScGIwNXZaR1ZRWVhKaGJTNXViMlJsSUNFOVBTQjJhWEowZFdGc1FYVmthVzlPYjJSbExtNXZaR1VwWEc0Z0lDQWdJQ0JrYVhOamIyNXVaV04wUVc1a1VtVnRiM1psVm1seWRIVmhiRUYxWkdsdlRtOWtaUzVqWVd4c0tIUm9hWE1zSUhacGNuUjFZV3hCZFdScGIwNXZaR1VwTzF4dUlDQWdJSFpwY25SMVlXeEJkV1JwYjA1dlpHVXVkWEJrWVhSbFFYVmthVzlPYjJSbEtIWnBjblIxWVd4QmRXUnBiMDV2WkdWUVlYSmhiUzV3WVhKaGJYTXBPMXh1SUNCOUxDQjFjR1JoZEdWUVlYSmhiWE1wTzF4dVhHNGdJSEpsZEhWeWJpQjJhWEowZFdGc1FYVmthVzlPYjJSbFVHRnlZVzF6TzF4dWZUdGNibHh1WTJ4aGMzTWdWbWx5ZEhWaGJFRjFaR2x2UjNKaGNHZ2dlMXh1SUNCamIyNXpkSEoxWTNSdmNpQW9jR0Z5WVcxeklEMGdlMzBwSUh0Y2JpQWdJQ0IwYUdsekxtRjFaR2x2UTI5dWRHVjRkQ0E5SUhCaGNtRnRjeTVoZFdScGIwTnZiblJsZUhRZ2ZId2dibVYzSUVGMVpHbHZRMjl1ZEdWNGRDZ3BPMXh1SUNBZ0lIUm9hWE11YjNWMGNIVjBJRDBnY0dGeVlXMXpMbTkxZEhCMWRDQjhmQ0IwYUdsekxtRjFaR2x2UTI5dWRHVjRkQzVrWlhOMGFXNWhkR2x2Ymp0Y2JpQWdJQ0IwYUdsekxuWnBjblIxWVd4T2IyUmxjeUE5SUZ0ZE8xeHVJQ0FnSUhSb2FYTXVZM1Z6ZEc5dFRtOWtaWE1nUFNCN2ZUdGNibHh1SUNBZ0lIUm9hWE11WDNKbGJXOTJaVlZ3WkdGMFpVRnVaRU55WldGMFpTQTlJR052YlhCdmMyVW9YRzRnSUNBZ0lDQmpjbVZoZEdWV2FYSjBkV0ZzUVhWa2FXOU9iMlJsYzBGdVpGVndaR0YwWlZacGNuUjFZV3hCZFdScGIwZHlZWEJvTG1KcGJtUW9kR2hwY3lrc1hHNGdJQ0FnSUNCMWNHUmhkR1ZCZFdScGIwNXZaR1Z6UVc1a1ZYQmtZWFJsVm1seWRIVmhiRUYxWkdsdlIzSmhjR2d1WW1sdVpDaDBhR2x6S1N4Y2JpQWdJQ0FnSUhKbGJXOTJaVUYxWkdsdlRtOWtaWE5CYm1SVmNHUmhkR1ZXYVhKMGRXRnNRWFZrYVc5SGNtRndhQzVpYVc1a0tIUm9hWE1wWEc0Z0lDQWdLVHRjYmlBZ2ZWeHVYRzRnSUdOeVpXRjBaVlpwY25SMVlXeEJkV1JwYjA1dlpHVnpJQ2gyYVhKMGRXRnNRWFZrYVc5T2IyUmxjMUJoY21GdGN5a2dlMXh1SUNBZ0lHTnZibk4wSUhCaGNuUnBkR2x2Ym1Wa1ZtbHlkSFZoYkVGMVpHbHZUbTlrWlZCaGNtRnRjeUE5SUhCaGNuUnBkR2x2Ymlnb2UyNXZaR1Y5S1NBOVBseHVJQ0FnSUNBZ2FYTk9hV3dvZEdocGN5NWpkWE4wYjIxT2IyUmxjMXR1YjJSbFhTa3NJSFpwY25SMVlXeEJkV1JwYjA1dlpHVnpVR0Z5WVcxektUdGNibHh1SUNBZ0lHTnZibk4wSUc1aGRHbDJaVlpwY25SMVlXeEJkV1JwYjA1dlpHVlFZWEpoYlhNZ1BTQndZWEowYVhScGIyNWxaRlpwY25SMVlXeEJkV1JwYjA1dlpHVlFZWEpoYlhOYk1GMDdYRzRnSUNBZ1kyOXVjM1FnWTNWemRHOXRWbWx5ZEhWaGJFRjFaR2x2VG05a1pWQmhjbUZ0Y3lBOUlIQmhjblJwZEdsdmJtVmtWbWx5ZEhWaGJFRjFaR2x2VG05a1pWQmhjbUZ0YzFzeFhUdGNibHh1SUNBZ0lHTnZibk4wSUc1aGRHbDJaVlpwY25SMVlXeEJkV1JwYjA1dlpHVnpJRDBnYldGd0tDaDJhWEowZFdGc1FYVmthVzlPYjJSbFVHRnlZVzF6S1NBOVBseHVJQ0FnSUNBZ2JtVjNJRTVoZEdsMlpWWnBjblIxWVd4QmRXUnBiMDV2WkdVb2RHaHBjeXdnZG1seWRIVmhiRUYxWkdsdlRtOWtaVkJoY21GdGN5a3NJRzVoZEdsMlpWWnBjblIxWVd4QmRXUnBiMDV2WkdWUVlYSmhiWE1wTzF4dUlDQWdJR052Ym5OMElHTjFjM1J2YlZacGNuUjFZV3hCZFdScGIwNXZaR1Z6SUQwZ2JXRndLQ2gyYVhKMGRXRnNRWFZrYVc5T2IyUmxVR0Z5WVcxektTQTlQbHh1SUNBZ0lDQWdibVYzSUVOMWMzUnZiVlpwY25SMVlXeEJkV1JwYjA1dlpHVW9kR2hwY3l3Z2RtbHlkSFZoYkVGMVpHbHZUbTlrWlZCaGNtRnRjeWtzSUdOMWMzUnZiVlpwY25SMVlXeEJkV1JwYjA1dlpHVlFZWEpoYlhNcE8xeHVYRzRnSUNBZ2NtVjBkWEp1SUdOdmJtTmhkQ2h1WVhScGRtVldhWEowZFdGc1FYVmthVzlPYjJSbGN5d2dZM1Z6ZEc5dFZtbHlkSFZoYkVGMVpHbHZUbTlrWlhNcE8xeHVJQ0I5WEc1Y2JpQWdaR1ZtYVc1bFRtOWtaU0FvWTNWemRHOXRUbTlrWlZCaGNtRnRjMFpoWTNSdmNua3NJRzVoYldVcElIdGNiaUFnSUNCcFppQW9kR2hwY3k1aGRXUnBiME52Ym5SbGVIUmJZR055WldGMFpTUjdZMkZ3YVhSaGJHbDZaU2h1WVcxbEtYMWdYU2xjYmlBZ0lDQWdJSFJvY205M0lHNWxkeUJGY25KdmNpaGdKSHR1WVcxbGZTQnBjeUJoSUhOMFlXNWtZWEprSUdGMVpHbHZJRzV2WkdVZ2JtRnRaU0JoYm1RZ1kyRnVibTkwSUdKbElHOTJaWEozY21sMGRHVnVZQ2s3WEc1Y2JpQWdJQ0IwYUdsekxtTjFjM1J2YlU1dlpHVnpXMjVoYldWZElEMGdZM1Z6ZEc5dFRtOWtaVkJoY21GdGMwWmhZM1J2Y25rN1hHNGdJQ0FnY21WMGRYSnVJSFJvYVhNN1hHNGdJSDFjYmx4dUlDQjFjR1JoZEdVZ0tIWnBjblIxWVd4QmRXUnBiMDV2WkdWUVlYSmhiWE1wSUh0Y2JpQWdJQ0JwWmlBb1lXNTVLSEJ5YjNCRmNTZ25hV1FuTENCMWJtUmxabWx1WldRcExDQjJhWEowZFdGc1FYVmthVzlPYjJSbFVHRnlZVzF6S1NsY2JpQWdJQ0FnSUhSb2NtOTNJRzVsZHlCRmNuSnZjaWduUlhabGNua2dkbWx5ZEhWaGJFRjFaR2x2VG05a1pTQnVaV1ZrY3lCaGJpQnBaQ0JtYjNJZ1pXWm1hV05wWlc1MElHUnBabVpwYm1jZ1lXNWtJR1JsZEdWeWJXbHVhVzVuSUhKbGJHRjBhVzl1YzJocGNITWdZbVYwZDJWbGJpQnViMlJsY3ljcE8xeHVYRzRnSUNBZ2RHaHBjeTVmY21WdGIzWmxWWEJrWVhSbFFXNWtRM0psWVhSbEtIWnBjblIxWVd4QmRXUnBiMDV2WkdWUVlYSmhiWE1wTzF4dUlDQWdJR052Ym01bFkzUkJkV1JwYjA1dlpHVnpLRU4xYzNSdmJWWnBjblIxWVd4QmRXUnBiMDV2WkdVc0lIUm9hWE11ZG1seWRIVmhiRTV2WkdWekxDQW9kbWx5ZEhWaGJFRjFaR2x2VG05a1pTa2dQVDVjYmlBZ0lDQWdJSFpwY25SMVlXeEJkV1JwYjA1dlpHVXVZMjl1Ym1WamRDaDBhR2x6TG05MWRIQjFkQ2twTzF4dVhHNGdJQ0FnY21WMGRYSnVJSFJvYVhNN1hHNGdJSDFjYm4xY2JseHViVzlrZFd4bExtVjRjRzl5ZEhNZ1BTQldhWEowZFdGc1FYVmthVzlIY21Gd2FEdGNiaUpkZlE9PSIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL1ZpcnR1YWxBdWRpb0dyYXBoJyk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk5b2IyMWxMMkl2WkdWMkwzWnBjblIxWVd3dFlYVmthVzh0WjNKaGNHZ3ZjM0pqTDJsdVpHVjRMbXB6SWwwc0ltNWhiV1Z6SWpwYlhTd2liV0Z3Y0dsdVozTWlPaUk3TzBGQlFVRXNUVUZCVFN4RFFVRkRMRTlCUVU4c1IwRkJSeXhQUVVGUExFTkJRVU1zY1VKQlFYRkNMRU5CUVVNc1EwRkJReUlzSW1acGJHVWlPaUl2YUc5dFpTOWlMMlJsZGk5MmFYSjBkV0ZzTFdGMVpHbHZMV2R5WVhCb0wzTnlZeTlwYm1SbGVDNXFjeUlzSW5OdmRYSmpaWE5EYjI1MFpXNTBJanBiSW0xdlpIVnNaUzVsZUhCdmNuUnpJRDBnY21WeGRXbHlaU2duTGk5V2FYSjBkV0ZzUVhWa2FXOUhjbUZ3YUNjcE95SmRmUT09IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgX3JlcXVpcmUgPSByZXF1aXJlKCdyYW1kYScpO1xuXG52YXIgZmluZCA9IF9yZXF1aXJlLmZpbmQ7XG52YXIgZm9yRWFjaCA9IF9yZXF1aXJlLmZvckVhY2g7XG52YXIgcHJvcEVxID0gX3JlcXVpcmUucHJvcEVxO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChDdXN0b21WaXJ0dWFsQXVkaW9Ob2RlLCB2aXJ0dWFsQXVkaW9Ob2Rlcykge1xuICB2YXIgaGFuZGxlQ29ubmVjdGlvblRvT3V0cHV0ID0gYXJndW1lbnRzWzJdID09PSB1bmRlZmluZWQgPyBmdW5jdGlvbiAoKSB7fSA6IGFyZ3VtZW50c1syXTtcbiAgcmV0dXJuIGZvckVhY2goZnVuY3Rpb24gKHZpcnR1YWxBdWRpb05vZGUpIHtcbiAgICBmb3JFYWNoKGZ1bmN0aW9uIChjb25uZWN0aW9uKSB7XG4gICAgICBpZiAoY29ubmVjdGlvbiA9PT0gJ291dHB1dCcpIHtcbiAgICAgICAgaGFuZGxlQ29ubmVjdGlvblRvT3V0cHV0KHZpcnR1YWxBdWRpb05vZGUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIGRlc3RpbmF0aW9uVmlydHVhbEF1ZGlvTm9kZSA9IGZpbmQocHJvcEVxKCdpZCcsIGNvbm5lY3Rpb24pKSh2aXJ0dWFsQXVkaW9Ob2Rlcyk7XG4gICAgICAgIGlmIChkZXN0aW5hdGlvblZpcnR1YWxBdWRpb05vZGUgaW5zdGFuY2VvZiBDdXN0b21WaXJ0dWFsQXVkaW9Ob2RlKSB7XG4gICAgICAgICAgZm9yRWFjaCh2aXJ0dWFsQXVkaW9Ob2RlLmNvbm5lY3QuYmluZCh2aXJ0dWFsQXVkaW9Ob2RlKSwgZGVzdGluYXRpb25WaXJ0dWFsQXVkaW9Ob2RlLmlucHV0cyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmlydHVhbEF1ZGlvTm9kZS5jb25uZWN0KGRlc3RpbmF0aW9uVmlydHVhbEF1ZGlvTm9kZS5hdWRpb05vZGUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSwgdmlydHVhbEF1ZGlvTm9kZS5vdXRwdXQpO1xuICB9LCB2aXJ0dWFsQXVkaW9Ob2Rlcyk7XG59O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklpOW9iMjFsTDJJdlpHVjJMM1pwY25SMVlXd3RZWFZrYVc4dFozSmhjR2d2YzNKakwzUnZiMnh6TDJOdmJtNWxZM1JCZFdScGIwNXZaR1Z6TG1weklsMHNJbTVoYldWeklqcGJYU3dpYldGd2NHbHVaM01pT2lJN08yVkJRV2RETEU5QlFVOHNRMEZCUXl4UFFVRlBMRU5CUVVNN08wbEJRWHBETEVsQlFVa3NXVUZCU2l4SlFVRkpPMGxCUVVVc1QwRkJUeXhaUVVGUUxFOUJRVTg3U1VGQlJTeE5RVUZOTEZsQlFVNHNUVUZCVFRzN1FVRkZOVUlzVFVGQlRTeERRVUZETEU5QlFVOHNSMEZCUnl4VlFVRkRMSE5DUVVGelFpeEZRVUZGTEdsQ1FVRnBRanROUVVGRkxIZENRVUYzUWl4blEwRkJSeXhaUVVGSkxFVkJRVVU3VTBGRE5VWXNUMEZCVHl4RFFVRkRMRlZCUVVNc1owSkJRV2RDTEVWQlFVczdRVUZETlVJc1YwRkJUeXhEUVVGRExGVkJRVU1zVlVGQlZTeEZRVUZMTzBGQlEzUkNMRlZCUVVrc1ZVRkJWU3hMUVVGTExGRkJRVkVzUlVGQlJUdEJRVU16UWl4blEwRkJkMElzUTBGQlF5eG5Ra0ZCWjBJc1EwRkJReXhEUVVGRE8wOUJRelZETEUxQlFVMDdRVUZEVEN4WlFVRk5MREpDUVVFeVFpeEhRVUZITEVsQlFVa3NRMEZCUXl4TlFVRk5MRU5CUVVNc1NVRkJTU3hGUVVGRkxGVkJRVlVzUTBGQlF5eERRVUZETEVOQlFVTXNhVUpCUVdsQ0xFTkJRVU1zUTBGQlF6dEJRVU4wUml4WlFVRkpMREpDUVVFeVFpeFpRVUZaTEhOQ1FVRnpRaXhGUVVGRk8wRkJRMnBGTEdsQ1FVRlBMRU5CUVVNc1owSkJRV2RDTEVOQlFVTXNUMEZCVHl4RFFVRkRMRWxCUVVrc1EwRkJReXhuUWtGQlowSXNRMEZCUXl4RlFVRkZMREpDUVVFeVFpeERRVUZETEUxQlFVMHNRMEZCUXl4RFFVRkRPMU5CUXpsR0xFMUJRVTA3UVVGRFRDd3dRa0ZCWjBJc1EwRkJReXhQUVVGUExFTkJRVU1zTWtKQlFUSkNMRU5CUVVNc1UwRkJVeXhEUVVGRExFTkJRVU03VTBGRGFrVTdUMEZEUmp0TFFVTkdMRVZCUVVVc1owSkJRV2RDTEVOQlFVTXNUVUZCVFN4RFFVRkRMRU5CUVVNN1IwRkROMElzUlVGQlJTeHBRa0ZCYVVJc1EwRkJRenREUVVGQkxFTkJRVU1pTENKbWFXeGxJam9pTDJodmJXVXZZaTlrWlhZdmRtbHlkSFZoYkMxaGRXUnBieTFuY21Gd2FDOXpjbU12ZEc5dmJITXZZMjl1Ym1WamRFRjFaR2x2VG05a1pYTXVhbk1pTENKemIzVnlZMlZ6UTI5dWRHVnVkQ0k2V3lKamIyNXpkQ0I3Wm1sdVpDd2dabTl5UldGamFDd2djSEp2Y0VWeGZTQTlJSEpsY1hWcGNtVW9KM0poYldSaEp5azdYRzVjYm0xdlpIVnNaUzVsZUhCdmNuUnpJRDBnS0VOMWMzUnZiVlpwY25SMVlXeEJkV1JwYjA1dlpHVXNJSFpwY25SMVlXeEJkV1JwYjA1dlpHVnpMQ0JvWVc1a2JHVkRiMjV1WldOMGFXOXVWRzlQZFhSd2RYUWdQU0FvS1QwK2UzMHBJRDArWEc0Z0lHWnZja1ZoWTJnb0tIWnBjblIxWVd4QmRXUnBiMDV2WkdVcElEMCtJSHRjYmlBZ0lDQm1iM0pGWVdOb0tDaGpiMjV1WldOMGFXOXVLU0E5UGlCN1hHNGdJQ0FnSUNCcFppQW9ZMjl1Ym1WamRHbHZiaUE5UFQwZ0oyOTFkSEIxZENjcElIdGNiaUFnSUNBZ0lDQWdhR0Z1Wkd4bFEyOXVibVZqZEdsdmJsUnZUM1YwY0hWMEtIWnBjblIxWVd4QmRXUnBiMDV2WkdVcE8xeHVJQ0FnSUNBZ2ZTQmxiSE5sSUh0Y2JpQWdJQ0FnSUNBZ1kyOXVjM1FnWkdWemRHbHVZWFJwYjI1V2FYSjBkV0ZzUVhWa2FXOU9iMlJsSUQwZ1ptbHVaQ2h3Y205d1JYRW9YQ0pwWkZ3aUxDQmpiMjV1WldOMGFXOXVLU2tvZG1seWRIVmhiRUYxWkdsdlRtOWtaWE1wTzF4dUlDQWdJQ0FnSUNCcFppQW9aR1Z6ZEdsdVlYUnBiMjVXYVhKMGRXRnNRWFZrYVc5T2IyUmxJR2x1YzNSaGJtTmxiMllnUTNWemRHOXRWbWx5ZEhWaGJFRjFaR2x2VG05a1pTa2dlMXh1SUNBZ0lDQWdJQ0FnSUdadmNrVmhZMmdvZG1seWRIVmhiRUYxWkdsdlRtOWtaUzVqYjI1dVpXTjBMbUpwYm1Rb2RtbHlkSFZoYkVGMVpHbHZUbTlrWlNrc0lHUmxjM1JwYm1GMGFXOXVWbWx5ZEhWaGJFRjFaR2x2VG05a1pTNXBibkIxZEhNcE8xeHVJQ0FnSUNBZ0lDQjlJR1ZzYzJVZ2UxeHVJQ0FnSUNBZ0lDQWdJSFpwY25SMVlXeEJkV1JwYjA1dlpHVXVZMjl1Ym1WamRDaGtaWE4wYVc1aGRHbHZibFpwY25SMVlXeEJkV1JwYjA1dlpHVXVZWFZrYVc5T2IyUmxLVHRjYmlBZ0lDQWdJQ0FnZlZ4dUlDQWdJQ0FnZlZ4dUlDQWdJSDBzSUhacGNuUjFZV3hCZFdScGIwNXZaR1V1YjNWMGNIVjBLVHRjYmlBZ2ZTd2dkbWx5ZEhWaGJFRjFaR2x2VG05a1pYTXBPMXh1SWwxOSIsIid1c2Ugc3RyaWN0JztcblxudmFyIGNhcGl0YWxpemUgPSByZXF1aXJlKCdjYXBpdGFsaXplJyk7XG5cbnZhciBuYW1lc1RvUGFyYW1zS2V5ID0ge1xuICBkZWxheTogJ21heERlbGF5VGltZSdcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGF1ZGlvQ29udGV4dCwgbmFtZSwgY29uc3RydWN0b3JQYXJhbXMpIHtcbiAgdmFyIGNvbnN0cnVjdG9yUGFyYW1zS2V5ID0gbmFtZXNUb1BhcmFtc0tleVtuYW1lXTtcbiAgdmFyIGF1ZGlvTm9kZSA9IGNvbnN0cnVjdG9yUGFyYW1zS2V5ID8gYXVkaW9Db250ZXh0WydjcmVhdGUnICsgY2FwaXRhbGl6ZShuYW1lKV0oY29uc3RydWN0b3JQYXJhbXNbY29uc3RydWN0b3JQYXJhbXNLZXldKSA6IGF1ZGlvQ29udGV4dFsnY3JlYXRlJyArIGNhcGl0YWxpemUobmFtZSldKCk7XG4gIGlmIChuYW1lID09PSAnb3NjaWxsYXRvcicpIHtcbiAgICBhdWRpb05vZGUuc3RhcnQoKTtcbiAgfVxuICByZXR1cm4gYXVkaW9Ob2RlO1xufTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTlvYjIxbEwySXZaR1YyTDNacGNuUjFZV3d0WVhWa2FXOHRaM0poY0dndmMzSmpMM1J2YjJ4ekwyTnlaV0YwWlVGMVpHbHZUbTlrWlM1cWN5SmRMQ0p1WVcxbGN5STZXMTBzSW0xaGNIQnBibWR6SWpvaU96dEJRVUZCTEVsQlFVMHNWVUZCVlN4SFFVRkhMRTlCUVU4c1EwRkJReXhaUVVGWkxFTkJRVU1zUTBGQlF6czdRVUZGZWtNc1NVRkJUU3huUWtGQlowSXNSMEZCUnp0QlFVTjJRaXhQUVVGTExFVkJRVVVzWTBGQll6dERRVU4wUWl4RFFVRkRPenRCUVVWR0xFMUJRVTBzUTBGQlF5eFBRVUZQTEVkQlFVY3NWVUZCUXl4WlFVRlpMRVZCUVVVc1NVRkJTU3hGUVVGRkxHbENRVUZwUWl4RlFVRkxPMEZCUXpGRUxFMUJRVTBzYjBKQlFXOUNMRWRCUVVjc1owSkJRV2RDTEVOQlFVTXNTVUZCU1N4RFFVRkRMRU5CUVVNN1FVRkRjRVFzVFVGQlRTeFRRVUZUTEVkQlFVY3NiMEpCUVc5Q0xFZEJRM0JETEZsQlFWa3NXVUZCVlN4VlFVRlZMRU5CUVVNc1NVRkJTU3hEUVVGRExFTkJRVWNzUTBGQlF5eHBRa0ZCYVVJc1EwRkJReXh2UWtGQmIwSXNRMEZCUXl4RFFVRkRMRWRCUTJ4R0xGbEJRVmtzV1VGQlZTeFZRVUZWTEVOQlFVTXNTVUZCU1N4RFFVRkRMRU5CUVVjc1JVRkJSU3hEUVVGRE8wRkJRemxETEUxQlFVa3NTVUZCU1N4TFFVRkxMRmxCUVZrc1JVRkJSVHRCUVVONlFpeGhRVUZUTEVOQlFVTXNTMEZCU3l4RlFVRkZMRU5CUVVNN1IwRkRia0k3UVVGRFJDeFRRVUZQTEZOQlFWTXNRMEZCUXp0RFFVTnNRaXhEUVVGRElpd2labWxzWlNJNklpOW9iMjFsTDJJdlpHVjJMM1pwY25SMVlXd3RZWFZrYVc4dFozSmhjR2d2YzNKakwzUnZiMnh6TDJOeVpXRjBaVUYxWkdsdlRtOWtaUzVxY3lJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYkltTnZibk4wSUdOaGNHbDBZV3hwZW1VZ1BTQnlaWEYxYVhKbEtDZGpZWEJwZEdGc2FYcGxKeWs3WEc1Y2JtTnZibk4wSUc1aGJXVnpWRzlRWVhKaGJYTkxaWGtnUFNCN1hHNGdJR1JsYkdGNU9pQW5iV0Y0UkdWc1lYbFVhVzFsSnl4Y2JuMDdYRzVjYm0xdlpIVnNaUzVsZUhCdmNuUnpJRDBnS0dGMVpHbHZRMjl1ZEdWNGRDd2dibUZ0WlN3Z1kyOXVjM1J5ZFdOMGIzSlFZWEpoYlhNcElEMCtJSHRjYmlBZ1kyOXVjM1FnWTI5dWMzUnlkV04wYjNKUVlYSmhiWE5MWlhrZ1BTQnVZVzFsYzFSdlVHRnlZVzF6UzJWNVcyNWhiV1ZkTzF4dUlDQmpiMjV6ZENCaGRXUnBiMDV2WkdVZ1BTQmpiMjV6ZEhKMVkzUnZjbEJoY21GdGMwdGxlU0EvWEc0Z0lDQWdZWFZrYVc5RGIyNTBaWGgwVzJCamNtVmhkR1VrZTJOaGNHbDBZV3hwZW1Vb2JtRnRaU2w5WUYwb1kyOXVjM1J5ZFdOMGIzSlFZWEpoYlhOYlkyOXVjM1J5ZFdOMGIzSlFZWEpoYlhOTFpYbGRLU0E2WEc0Z0lDQWdZWFZrYVc5RGIyNTBaWGgwVzJCamNtVmhkR1VrZTJOaGNHbDBZV3hwZW1Vb2JtRnRaU2w5WUYwb0tUdGNiaUFnYVdZZ0tHNWhiV1VnUFQwOUlDZHZjMk5wYkd4aGRHOXlKeWtnZTF4dUlDQWdJR0YxWkdsdlRtOWtaUzV6ZEdGeWRDZ3BPMXh1SUNCOVhHNGdJSEpsZEhWeWJpQmhkV1JwYjA1dlpHVTdYRzU5TzF4dUlsMTkiLCIndXNlIHN0cmljdCc7XG5cbnZhciBfY3JlYXRlQ2xhc3MgPSByZXF1aXJlKCdiYWJlbC1ydW50aW1lL2hlbHBlcnMvY3JlYXRlLWNsYXNzJylbJ2RlZmF1bHQnXTtcblxudmFyIF9jbGFzc0NhbGxDaGVjayA9IHJlcXVpcmUoJ2JhYmVsLXJ1bnRpbWUvaGVscGVycy9jbGFzcy1jYWxsLWNoZWNrJylbJ2RlZmF1bHQnXTtcblxudmFyIF9yZXF1aXJlID0gcmVxdWlyZSgncmFtZGEnKTtcblxudmFyIGNvbnRhaW5zID0gX3JlcXVpcmUuY29udGFpbnM7XG52YXIgZmlsdGVyID0gX3JlcXVpcmUuZmlsdGVyO1xudmFyIGZvckVhY2ggPSBfcmVxdWlyZS5mb3JFYWNoO1xudmFyIGtleXMgPSBfcmVxdWlyZS5rZXlzO1xudmFyIHBpY2sgPSBfcmVxdWlyZS5waWNrO1xudmFyIHBsdWNrID0gX3JlcXVpcmUucGx1Y2s7XG52YXIgcHJvcEVxID0gX3JlcXVpcmUucHJvcEVxO1xudmFyIG9taXQgPSBfcmVxdWlyZS5vbWl0O1xudmFyIHppcFdpdGggPSBfcmVxdWlyZS56aXBXaXRoO1xuXG52YXIgY29ubmVjdEF1ZGlvTm9kZXMgPSByZXF1aXJlKCcuLi90b29scy9jb25uZWN0QXVkaW9Ob2RlcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIEN1c3RvbVZpcnR1YWxBdWRpb05vZGUodmlydHVhbEF1ZGlvR3JhcGgsIF9yZWYpIHtcbiAgICB2YXIgbm9kZSA9IF9yZWYubm9kZTtcbiAgICB2YXIgaWQgPSBfcmVmLmlkO1xuICAgIHZhciBvdXRwdXQgPSBfcmVmLm91dHB1dDtcbiAgICB2YXIgcGFyYW1zID0gX3JlZi5wYXJhbXM7XG5cbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgQ3VzdG9tVmlydHVhbEF1ZGlvTm9kZSk7XG5cbiAgICBwYXJhbXMgPSBwYXJhbXMgfHwge307XG4gICAgdGhpcy5hdWRpb0dyYXBoUGFyYW1zRmFjdG9yeSA9IHZpcnR1YWxBdWRpb0dyYXBoLmN1c3RvbU5vZGVzW25vZGVdO1xuICAgIHRoaXMubm9kZSA9IG5vZGU7XG4gICAgdGhpcy52aXJ0dWFsTm9kZXMgPSB0aGlzLmF1ZGlvR3JhcGhQYXJhbXNGYWN0b3J5KHBhcmFtcyk7XG4gICAgdGhpcy52aXJ0dWFsTm9kZXMgPSB2aXJ0dWFsQXVkaW9HcmFwaC5jcmVhdGVWaXJ0dWFsQXVkaW9Ob2Rlcyh0aGlzLnZpcnR1YWxOb2Rlcyk7XG4gICAgY29ubmVjdEF1ZGlvTm9kZXMoQ3VzdG9tVmlydHVhbEF1ZGlvTm9kZSwgdGhpcy52aXJ0dWFsTm9kZXMpO1xuICAgIHRoaXMuaWQgPSBpZDtcbiAgICB0aGlzLm91dHB1dCA9IEFycmF5LmlzQXJyYXkob3V0cHV0KSA/IG91dHB1dCA6IFtvdXRwdXRdO1xuICB9XG5cbiAgX2NyZWF0ZUNsYXNzKEN1c3RvbVZpcnR1YWxBdWRpb05vZGUsIFt7XG4gICAga2V5OiAnY29ubmVjdCcsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGNvbm5lY3QoZGVzdGluYXRpb24pIHtcbiAgICAgIHZhciBvdXRwdXRWaXJ0dWFsTm9kZXMgPSBmaWx0ZXIoZnVuY3Rpb24gKF9yZWYyKSB7XG4gICAgICAgIHZhciBvdXRwdXQgPSBfcmVmMi5vdXRwdXQ7XG4gICAgICAgIHJldHVybiBjb250YWlucygnb3V0cHV0Jywgb3V0cHV0KTtcbiAgICAgIH0sIHRoaXMudmlydHVhbE5vZGVzKTtcbiAgICAgIGZvckVhY2goZnVuY3Rpb24gKGF1ZGlvTm9kZSkge1xuICAgICAgICByZXR1cm4gYXVkaW9Ob2RlLmNvbm5lY3QoZGVzdGluYXRpb24pO1xuICAgICAgfSwgcGx1Y2soJ2F1ZGlvTm9kZScsIG91dHB1dFZpcnR1YWxOb2RlcykpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ2Rpc2Nvbm5lY3QnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBkaXNjb25uZWN0KCkge1xuICAgICAgZm9yRWFjaChmdW5jdGlvbiAodmlydHVhbE5vZGUpIHtcbiAgICAgICAgcmV0dXJuIHZpcnR1YWxOb2RlLmRpc2Nvbm5lY3QoKTtcbiAgICAgIH0sIHRoaXMudmlydHVhbE5vZGVzKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6ICd1cGRhdGVBdWRpb05vZGUnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB1cGRhdGVBdWRpb05vZGUocGFyYW1zKSB7XG4gICAgICB6aXBXaXRoKGZ1bmN0aW9uICh2aXJ0dWFsTm9kZSwgX3JlZjMpIHtcbiAgICAgICAgdmFyIHBhcmFtcyA9IF9yZWYzLnBhcmFtcztcbiAgICAgICAgcmV0dXJuIHZpcnR1YWxOb2RlLnVwZGF0ZUF1ZGlvTm9kZShwYXJhbXMpO1xuICAgICAgfSwgdGhpcy52aXJ0dWFsTm9kZXMsIHRoaXMuYXVkaW9HcmFwaFBhcmFtc0ZhY3RvcnkocGFyYW1zKSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiAnaW5wdXRzJyxcbiAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICAgIHJldHVybiBwbHVjaygnYXVkaW9Ob2RlJywgZmlsdGVyKHByb3BFcSgnaW5wdXQnLCAnaW5wdXQnKSwgdGhpcy52aXJ0dWFsTm9kZXMpKTtcbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gQ3VzdG9tVmlydHVhbEF1ZGlvTm9kZTtcbn0pKCk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk5b2IyMWxMMkl2WkdWMkwzWnBjblIxWVd3dFlYVmthVzh0WjNKaGNHZ3ZjM0pqTDNacGNuUjFZV3hPYjJSbFEyOXVjM1J5ZFdOMGIzSnpMME4xYzNSdmJWWnBjblIxWVd4QmRXUnBiMDV2WkdVdWFuTWlYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklqczdPenM3TzJWQlFUaEZMRTlCUVU4c1EwRkJReXhQUVVGUExFTkJRVU03TzBsQlFYWkdMRkZCUVZFc1dVRkJVaXhSUVVGUk8wbEJRVVVzVFVGQlRTeFpRVUZPTEUxQlFVMDdTVUZCUlN4UFFVRlBMRmxCUVZBc1QwRkJUenRKUVVGRkxFbEJRVWtzV1VGQlNpeEpRVUZKTzBsQlFVVXNTVUZCU1N4WlFVRktMRWxCUVVrN1NVRkJSU3hMUVVGTExGbEJRVXdzUzBGQlN6dEpRVUZGTEUxQlFVMHNXVUZCVGl4TlFVRk5PMGxCUVVVc1NVRkJTU3haUVVGS0xFbEJRVWs3U1VGQlJTeFBRVUZQTEZsQlFWQXNUMEZCVHpzN1FVRkRNVVVzU1VGQlRTeHBRa0ZCYVVJc1IwRkJSeXhQUVVGUExFTkJRVU1zTkVKQlFUUkNMRU5CUVVNc1EwRkJRenM3UVVGRmFFVXNUVUZCVFN4RFFVRkRMRTlCUVU4N1FVRkRRU3hYUVVSVExITkNRVUZ6UWl4RFFVTTVRaXhwUWtGQmFVSXNSVUZCUlN4SlFVRXdRaXhGUVVGRk8xRkJRVE5DTEVsQlFVa3NSMEZCVEN4SlFVRXdRaXhEUVVGNlFpeEpRVUZKTzFGQlFVVXNSVUZCUlN4SFFVRlVMRWxCUVRCQ0xFTkJRVzVDTEVWQlFVVTdVVUZCUlN4TlFVRk5MRWRCUVdwQ0xFbEJRVEJDTEVOQlFXWXNUVUZCVFR0UlFVRkZMRTFCUVUwc1IwRkJla0lzU1VGQk1FSXNRMEZCVUN4TlFVRk5PenN3UWtGRWNFTXNjMEpCUVhOQ096dEJRVVY2UXl4VlFVRk5MRWRCUVVjc1RVRkJUU3hKUVVGSkxFVkJRVVVzUTBGQlF6dEJRVU4wUWl4UlFVRkpMRU5CUVVNc2RVSkJRWFZDTEVkQlFVY3NhVUpCUVdsQ0xFTkJRVU1zVjBGQlZ5eERRVUZETEVsQlFVa3NRMEZCUXl4RFFVRkRPMEZCUTI1RkxGRkJRVWtzUTBGQlF5eEpRVUZKTEVkQlFVY3NTVUZCU1N4RFFVRkRPMEZCUTJwQ0xGRkJRVWtzUTBGQlF5eFpRVUZaTEVkQlFVY3NTVUZCU1N4RFFVRkRMSFZDUVVGMVFpeERRVUZETEUxQlFVMHNRMEZCUXl4RFFVRkRPMEZCUTNwRUxGRkJRVWtzUTBGQlF5eFpRVUZaTEVkQlFVY3NhVUpCUVdsQ0xFTkJRVU1zZFVKQlFYVkNMRU5CUVVNc1NVRkJTU3hEUVVGRExGbEJRVmtzUTBGQlF5eERRVUZETzBGQlEycEdMSEZDUVVGcFFpeERRVUZETEhOQ1FVRnpRaXhGUVVGRkxFbEJRVWtzUTBGQlF5eFpRVUZaTEVOQlFVTXNRMEZCUXp0QlFVTTNSQ3hSUVVGSkxFTkJRVU1zUlVGQlJTeEhRVUZITEVWQlFVVXNRMEZCUXp0QlFVTmlMRkZCUVVrc1EwRkJReXhOUVVGTkxFZEJRVWNzUzBGQlN5eERRVUZETEU5QlFVOHNRMEZCUXl4TlFVRk5MRU5CUVVNc1IwRkJSeXhOUVVGTkxFZEJRVWNzUTBGQlF5eE5RVUZOTEVOQlFVTXNRMEZCUXp0SFFVTjZSRHM3WlVGV2IwSXNjMEpCUVhOQ096dFhRVmx1UXl4cFFrRkJReXhYUVVGWExFVkJRVVU3UVVGRGNFSXNWVUZCVFN4clFrRkJhMElzUjBGQlJ5eE5RVUZOTEVOQlFVTXNWVUZCUXl4TFFVRlJPMWxCUVZBc1RVRkJUU3hIUVVGUUxFdEJRVkVzUTBGQlVDeE5RVUZOTzJWQlFVMHNVVUZCVVN4RFFVRkRMRkZCUVZFc1JVRkJSU3hOUVVGTkxFTkJRVU03VDBGQlFTeEZRVUZGTEVsQlFVa3NRMEZCUXl4WlFVRlpMRU5CUVVNc1EwRkJRenRCUVVNdlJpeGhRVUZQTEVOQlFVTXNWVUZCUXl4VFFVRlRPMlZCUVVzc1UwRkJVeXhEUVVGRExFOUJRVThzUTBGQlF5eFhRVUZYTEVOQlFVTTdUMEZCUVN4RlFVRkZMRXRCUVVzc1EwRkJReXhYUVVGWExFVkJRVVVzYTBKQlFXdENMRU5CUVVNc1EwRkJReXhEUVVGRE8wdEJRMmhIT3pzN1YwRkZWU3h6UWtGQlJ6dEJRVU5hTEdGQlFVOHNRMEZCUXl4VlFVRkRMRmRCUVZjN1pVRkJTeXhYUVVGWExFTkJRVU1zVlVGQlZTeEZRVUZGTzA5QlFVRXNSVUZCUlN4SlFVRkpMRU5CUVVNc1dVRkJXU3hEUVVGRExFTkJRVU03UzBGRGRrVTdPenRYUVUxbExIbENRVUZETEUxQlFVMHNSVUZCUlR0QlFVTjJRaXhoUVVGUExFTkJRVU1zVlVGQlF5eFhRVUZYTEVWQlFVVXNTMEZCVVR0WlFVRlFMRTFCUVUwc1IwRkJVQ3hMUVVGUkxFTkJRVkFzVFVGQlRUdGxRVUZOTEZkQlFWY3NRMEZCUXl4bFFVRmxMRU5CUVVNc1RVRkJUU3hEUVVGRE8wOUJRVUVzUlVGQlJTeEpRVUZKTEVOQlFVTXNXVUZCV1N4RlFVRkZMRWxCUVVrc1EwRkJReXgxUWtGQmRVSXNRMEZCUXl4TlFVRk5MRU5CUVVNc1EwRkJReXhEUVVGRE8wdEJRMnhKT3pzN1UwRk9WU3hsUVVGSE8wRkJRMW9zWVVGQlR5eExRVUZMTEVOQlFVTXNWMEZCVnl4RlFVRkZMRTFCUVUwc1EwRkJReXhOUVVGTkxFTkJRVU1zVDBGQlR5eEZRVUZGTEU5QlFVOHNRMEZCUXl4RlFVRkZMRWxCUVVrc1EwRkJReXhaUVVGWkxFTkJRVU1zUTBGQlF5eERRVUZETzB0QlEyaEdPenM3VTBGMlFtOUNMSE5DUVVGelFqdEpRVFJDTlVNc1EwRkJReUlzSW1acGJHVWlPaUl2YUc5dFpTOWlMMlJsZGk5MmFYSjBkV0ZzTFdGMVpHbHZMV2R5WVhCb0wzTnlZeTkyYVhKMGRXRnNUbTlrWlVOdmJuTjBjblZqZEc5eWN5OURkWE4wYjIxV2FYSjBkV0ZzUVhWa2FXOU9iMlJsTG1weklpd2ljMjkxY21ObGMwTnZiblJsYm5RaU9sc2lZMjl1YzNRZ2UyTnZiblJoYVc1ekxDQm1hV3gwWlhJc0lHWnZja1ZoWTJnc0lHdGxlWE1zSUhCcFkyc3NJSEJzZFdOckxDQndjbTl3UlhFc0lHOXRhWFFzSUhwcGNGZHBkR2g5SUQwZ2NtVnhkV2x5WlNnbmNtRnRaR0VuS1R0Y2JtTnZibk4wSUdOdmJtNWxZM1JCZFdScGIwNXZaR1Z6SUQwZ2NtVnhkV2x5WlNnbkxpNHZkRzl2YkhNdlkyOXVibVZqZEVGMVpHbHZUbTlrWlhNbktUdGNibHh1Ylc5a2RXeGxMbVY0Y0c5eWRITWdQU0JqYkdGemN5QkRkWE4wYjIxV2FYSjBkV0ZzUVhWa2FXOU9iMlJsSUh0Y2JpQWdZMjl1YzNSeWRXTjBiM0lnS0hacGNuUjFZV3hCZFdScGIwZHlZWEJvTENCN2JtOWtaU3dnYVdRc0lHOTFkSEIxZEN3Z2NHRnlZVzF6ZlNrZ2UxeHVJQ0FnSUhCaGNtRnRjeUE5SUhCaGNtRnRjeUI4ZkNCN2ZUdGNiaUFnSUNCMGFHbHpMbUYxWkdsdlIzSmhjR2hRWVhKaGJYTkdZV04wYjNKNUlEMGdkbWx5ZEhWaGJFRjFaR2x2UjNKaGNHZ3VZM1Z6ZEc5dFRtOWtaWE5iYm05a1pWMDdYRzRnSUNBZ2RHaHBjeTV1YjJSbElEMGdibTlrWlR0Y2JpQWdJQ0IwYUdsekxuWnBjblIxWVd4T2IyUmxjeUE5SUhSb2FYTXVZWFZrYVc5SGNtRndhRkJoY21GdGMwWmhZM1J2Y25rb2NHRnlZVzF6S1R0Y2JpQWdJQ0IwYUdsekxuWnBjblIxWVd4T2IyUmxjeUE5SUhacGNuUjFZV3hCZFdScGIwZHlZWEJvTG1OeVpXRjBaVlpwY25SMVlXeEJkV1JwYjA1dlpHVnpLSFJvYVhNdWRtbHlkSFZoYkU1dlpHVnpLVHRjYmlBZ0lDQmpiMjV1WldOMFFYVmthVzlPYjJSbGN5aERkWE4wYjIxV2FYSjBkV0ZzUVhWa2FXOU9iMlJsTENCMGFHbHpMblpwY25SMVlXeE9iMlJsY3lrN1hHNGdJQ0FnZEdocGN5NXBaQ0E5SUdsa08xeHVJQ0FnSUhSb2FYTXViM1YwY0hWMElEMGdRWEp5WVhrdWFYTkJjbkpoZVNodmRYUndkWFFwSUQ4Z2IzVjBjSFYwSURvZ1cyOTFkSEIxZEYwN1hHNGdJSDFjYmx4dUlDQmpiMjV1WldOMElDaGtaWE4wYVc1aGRHbHZiaWtnZTF4dUlDQWdJR052Ym5OMElHOTFkSEIxZEZacGNuUjFZV3hPYjJSbGN5QTlJR1pwYkhSbGNpZ29lMjkxZEhCMWRIMHBJRDArSUdOdmJuUmhhVzV6S0NkdmRYUndkWFFuTENCdmRYUndkWFFwTENCMGFHbHpMblpwY25SMVlXeE9iMlJsY3lrN1hHNGdJQ0FnWm05eVJXRmphQ2dvWVhWa2FXOU9iMlJsS1NBOVBpQmhkV1JwYjA1dlpHVXVZMjl1Ym1WamRDaGtaWE4wYVc1aGRHbHZiaWtzSUhCc2RXTnJLQ2RoZFdScGIwNXZaR1VuTENCdmRYUndkWFJXYVhKMGRXRnNUbTlrWlhNcEtUdGNiaUFnZlZ4dVhHNGdJR1JwYzJOdmJtNWxZM1FnS0NrZ2UxeHVJQ0FnSUdadmNrVmhZMmdvS0hacGNuUjFZV3hPYjJSbEtTQTlQaUIyYVhKMGRXRnNUbTlrWlM1a2FYTmpiMjV1WldOMEtDa3NJSFJvYVhNdWRtbHlkSFZoYkU1dlpHVnpLVHRjYmlBZ2ZWeHVYRzRnSUdkbGRDQnBibkIxZEhNZ0tDa2dlMXh1SUNBZ0lISmxkSFZ5YmlCd2JIVmpheWduWVhWa2FXOU9iMlJsSnl3Z1ptbHNkR1Z5S0hCeWIzQkZjU2duYVc1d2RYUW5MQ0FuYVc1d2RYUW5LU3dnZEdocGN5NTJhWEowZFdGc1RtOWtaWE1wS1R0Y2JpQWdmVnh1WEc0Z0lIVndaR0YwWlVGMVpHbHZUbTlrWlNBb2NHRnlZVzF6S1NCN1hHNGdJQ0FnZW1sd1YybDBhQ2dvZG1seWRIVmhiRTV2WkdVc0lIdHdZWEpoYlhOOUtTQTlQaUIyYVhKMGRXRnNUbTlrWlM1MWNHUmhkR1ZCZFdScGIwNXZaR1VvY0dGeVlXMXpLU3dnZEdocGN5NTJhWEowZFdGc1RtOWtaWE1zSUhSb2FYTXVZWFZrYVc5SGNtRndhRkJoY21GdGMwWmhZM1J2Y25rb2NHRnlZVzF6S1NrN1hHNGdJSDFjYm4wN1hHNGlYWDA9IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgX2NyZWF0ZUNsYXNzID0gcmVxdWlyZSgnYmFiZWwtcnVudGltZS9oZWxwZXJzL2NyZWF0ZS1jbGFzcycpWydkZWZhdWx0J107XG5cbnZhciBfY2xhc3NDYWxsQ2hlY2sgPSByZXF1aXJlKCdiYWJlbC1ydW50aW1lL2hlbHBlcnMvY2xhc3MtY2FsbC1jaGVjaycpWydkZWZhdWx0J107XG5cbnZhciBjcmVhdGVBdWRpb05vZGUgPSByZXF1aXJlKCcuLi90b29scy9jcmVhdGVBdWRpb05vZGUnKTtcblxudmFyIF9yZXF1aXJlID0gcmVxdWlyZSgncmFtZGEnKTtcblxudmFyIGZvckVhY2ggPSBfcmVxdWlyZS5mb3JFYWNoO1xudmFyIGtleXMgPSBfcmVxdWlyZS5rZXlzO1xudmFyIHBpY2sgPSBfcmVxdWlyZS5waWNrO1xudmFyIG9taXQgPSBfcmVxdWlyZS5vbWl0O1xuXG52YXIgY29uc3RydWN0b3JQYXJhbXNLZXlzID0gWydtYXhEZWxheVRpbWUnXTtcblxubW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBOYXRpdmVWaXJ0dWFsQXVkaW9Ob2RlKHZpcnR1YWxBdWRpb0dyYXBoLCB2aXJ0dWFsTm9kZVBhcmFtcykge1xuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBOYXRpdmVWaXJ0dWFsQXVkaW9Ob2RlKTtcblxuICAgIHZhciBub2RlID0gdmlydHVhbE5vZGVQYXJhbXMubm9kZTtcbiAgICB2YXIgaWQgPSB2aXJ0dWFsTm9kZVBhcmFtcy5pZDtcbiAgICB2YXIgaW5wdXQgPSB2aXJ0dWFsTm9kZVBhcmFtcy5pbnB1dDtcbiAgICB2YXIgb3V0cHV0ID0gdmlydHVhbE5vZGVQYXJhbXMub3V0cHV0O1xuICAgIHZhciBwYXJhbXMgPSB2aXJ0dWFsTm9kZVBhcmFtcy5wYXJhbXM7XG5cbiAgICBwYXJhbXMgPSBwYXJhbXMgfHwge307XG4gICAgdmFyIGNvbnN0cnVjdG9yUGFyYW1zID0gcGljayhjb25zdHJ1Y3RvclBhcmFtc0tleXMsIHBhcmFtcyk7XG4gICAgcGFyYW1zID0gb21pdChjb25zdHJ1Y3RvclBhcmFtc0tleXMsIHBhcmFtcyk7XG4gICAgdGhpcy5hdWRpb05vZGUgPSBjcmVhdGVBdWRpb05vZGUodmlydHVhbEF1ZGlvR3JhcGguYXVkaW9Db250ZXh0LCBub2RlLCBjb25zdHJ1Y3RvclBhcmFtcyk7XG4gICAgdGhpcy5ub2RlID0gbm9kZTtcbiAgICB0aGlzLnVwZGF0ZUF1ZGlvTm9kZShwYXJhbXMpO1xuICAgIHRoaXMuaWQgPSBpZDtcbiAgICB0aGlzLmlucHV0ID0gaW5wdXQ7XG4gICAgdGhpcy5vdXRwdXQgPSBBcnJheS5pc0FycmF5KG91dHB1dCkgPyBvdXRwdXQgOiBbb3V0cHV0XTtcbiAgICB0aGlzLnBhcmFtcyA9IHBhcmFtcztcbiAgfVxuXG4gIF9jcmVhdGVDbGFzcyhOYXRpdmVWaXJ0dWFsQXVkaW9Ob2RlLCBbe1xuICAgIGtleTogJ2Nvbm5lY3QnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBjb25uZWN0KGRlc3RpbmF0aW9uKSB7XG4gICAgICB0aGlzLmF1ZGlvTm9kZS5jb25uZWN0KGRlc3RpbmF0aW9uKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6ICdkaXNjb25uZWN0JyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gZGlzY29ubmVjdCgpIHtcbiAgICAgIHRoaXMuYXVkaW9Ob2RlLnN0b3AgJiYgdGhpcy5hdWRpb05vZGUuc3RvcCgpO1xuICAgICAgdGhpcy5hdWRpb05vZGUuZGlzY29ubmVjdCgpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ3VwZGF0ZUF1ZGlvTm9kZScsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHVwZGF0ZUF1ZGlvTm9kZShwYXJhbXMpIHtcbiAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgIHBhcmFtcyA9IG9taXQoY29uc3RydWN0b3JQYXJhbXNLZXlzLCBwYXJhbXMpO1xuICAgICAgZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgIHN3aXRjaCAoa2V5KSB7XG4gICAgICAgICAgY2FzZSAndHlwZSc6XG4gICAgICAgICAgICBfdGhpcy5hdWRpb05vZGVba2V5XSA9IHBhcmFtc1trZXldO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICBfdGhpcy5hdWRpb05vZGVba2V5XS52YWx1ZSA9IHBhcmFtc1trZXldO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9LCBrZXlzKHBhcmFtcykpO1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBOYXRpdmVWaXJ0dWFsQXVkaW9Ob2RlO1xufSkoKTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTlvYjIxbEwySXZaR1YyTDNacGNuUjFZV3d0WVhWa2FXOHRaM0poY0dndmMzSmpMM1pwY25SMVlXeE9iMlJsUTI5dWMzUnlkV04wYjNKekwwNWhkR2wyWlZacGNuUjFZV3hCZFdScGIwNXZaR1V1YW5NaVhTd2libUZ0WlhNaU9sdGRMQ0p0WVhCd2FXNW5jeUk2SWpzN096czdPMEZCUVVFc1NVRkJUU3hsUVVGbExFZEJRVWNzVDBGQlR5eERRVUZETERCQ1FVRXdRaXhEUVVGRExFTkJRVU03TzJWQlEzaENMRTlCUVU4c1EwRkJReXhQUVVGUExFTkJRVU03TzBsQlFUZERMRTlCUVU4c1dVRkJVQ3hQUVVGUE8wbEJRVVVzU1VGQlNTeFpRVUZLTEVsQlFVazdTVUZCUlN4SlFVRkpMRmxCUVVvc1NVRkJTVHRKUVVGRkxFbEJRVWtzV1VGQlNpeEpRVUZKT3p0QlFVVm9ReXhKUVVGTkxIRkNRVUZ4UWl4SFFVRkhMRU5CUXpWQ0xHTkJRV01zUTBGRFppeERRVUZET3p0QlFVVkdMRTFCUVUwc1EwRkJReXhQUVVGUE8wRkJRMEVzVjBGRVV5eHpRa0ZCYzBJc1EwRkRPVUlzYVVKQlFXbENMRVZCUVVVc2FVSkJRV2xDTEVWQlFVVTdNRUpCUkRsQ0xITkNRVUZ6UWpzN1VVRkZjRU1zU1VGQlNTeEhRVUVyUWl4cFFrRkJhVUlzUTBGQmNFUXNTVUZCU1R0UlFVRkZMRVZCUVVVc1IwRkJNa0lzYVVKQlFXbENMRU5CUVRsRExFVkJRVVU3VVVGQlJTeExRVUZMTEVkQlFXOUNMR2xDUVVGcFFpeERRVUV4UXl4TFFVRkxPMUZCUVVVc1RVRkJUU3hIUVVGWkxHbENRVUZwUWl4RFFVRnVReXhOUVVGTk8xRkJRVVVzVFVGQlRTeEhRVUZKTEdsQ1FVRnBRaXhEUVVFelFpeE5RVUZOT3p0QlFVTndReXhWUVVGTkxFZEJRVWNzVFVGQlRTeEpRVUZKTEVWQlFVVXNRMEZCUXp0QlFVTjBRaXhSUVVGTkxHbENRVUZwUWl4SFFVRkhMRWxCUVVrc1EwRkJReXh4UWtGQmNVSXNSVUZCUlN4TlFVRk5MRU5CUVVNc1EwRkJRenRCUVVNNVJDeFZRVUZOTEVkQlFVY3NTVUZCU1N4RFFVRkRMSEZDUVVGeFFpeEZRVUZGTEUxQlFVMHNRMEZCUXl4RFFVRkRPMEZCUXpkRExGRkJRVWtzUTBGQlF5eFRRVUZUTEVkQlFVY3NaVUZCWlN4RFFVRkRMR2xDUVVGcFFpeERRVUZETEZsQlFWa3NSVUZCUlN4SlFVRkpMRVZCUVVVc2FVSkJRV2xDTEVOQlFVTXNRMEZCUXp0QlFVTXhSaXhSUVVGSkxFTkJRVU1zU1VGQlNTeEhRVUZITEVsQlFVa3NRMEZCUXp0QlFVTnFRaXhSUVVGSkxFTkJRVU1zWlVGQlpTeERRVUZETEUxQlFVMHNRMEZCUXl4RFFVRkRPMEZCUXpkQ0xGRkJRVWtzUTBGQlF5eEZRVUZGTEVkQlFVY3NSVUZCUlN4RFFVRkRPMEZCUTJJc1VVRkJTU3hEUVVGRExFdEJRVXNzUjBGQlJ5eExRVUZMTEVOQlFVTTdRVUZEYmtJc1VVRkJTU3hEUVVGRExFMUJRVTBzUjBGQlJ5eExRVUZMTEVOQlFVTXNUMEZCVHl4RFFVRkRMRTFCUVUwc1EwRkJReXhIUVVGSExFMUJRVTBzUjBGQlJ5eERRVUZETEUxQlFVMHNRMEZCUXl4RFFVRkRPMEZCUTNoRUxGRkJRVWtzUTBGQlF5eE5RVUZOTEVkQlFVY3NUVUZCVFN4RFFVRkRPMGRCUTNSQ096dGxRV0p2UWl4elFrRkJjMEk3TzFkQlpXNURMR2xDUVVGRExGZEJRVmNzUlVGQlJUdEJRVU53UWl4VlFVRkpMRU5CUVVNc1UwRkJVeXhEUVVGRExFOUJRVThzUTBGQlF5eFhRVUZYTEVOQlFVTXNRMEZCUXp0TFFVTnlRenM3TzFkQlJWVXNjMEpCUVVjN1FVRkRXaXhWUVVGSkxFTkJRVU1zVTBGQlV5eERRVUZETEVsQlFVa3NTVUZCU1N4SlFVRkpMRU5CUVVNc1UwRkJVeXhEUVVGRExFbEJRVWtzUlVGQlJTeERRVUZETzBGQlF6ZERMRlZCUVVrc1EwRkJReXhUUVVGVExFTkJRVU1zVlVGQlZTeEZRVUZGTEVOQlFVTTdTMEZETjBJN096dFhRVVZsTEhsQ1FVRkRMRTFCUVUwc1JVRkJSVHM3TzBGQlEzWkNMRmxCUVUwc1IwRkJSeXhKUVVGSkxFTkJRVU1zY1VKQlFYRkNMRVZCUVVVc1RVRkJUU3hEUVVGRExFTkJRVU03UVVGRE4wTXNZVUZCVHl4RFFVRkRMRlZCUVVNc1IwRkJSeXhGUVVGTE8wRkJRMllzWjBKQlFWRXNSMEZCUnp0QlFVTlVMR1ZCUVVzc1RVRkJUVHRCUVVOVUxHdENRVUZMTEZOQlFWTXNRMEZCUXl4SFFVRkhMRU5CUVVNc1IwRkJSeXhOUVVGTkxFTkJRVU1zUjBGQlJ5eERRVUZETEVOQlFVTTdRVUZEYkVNc2JVSkJRVTg3UVVGQlFTeEJRVU5VTzBGQlEwVXNhMEpCUVVzc1UwRkJVeXhEUVVGRExFZEJRVWNzUTBGQlF5eERRVUZETEV0QlFVc3NSMEZCUnl4TlFVRk5MRU5CUVVNc1IwRkJSeXhEUVVGRExFTkJRVU03UVVGRGVFTXNiVUpCUVU4N1FVRkJRU3hUUVVOV08wOUJRMFlzUlVGQlJTeEpRVUZKTEVOQlFVTXNUVUZCVFN4RFFVRkRMRU5CUVVNc1EwRkJRenRMUVVOc1FqczdPMU5CY0VOdlFpeHpRa0ZCYzBJN1NVRnhRelZETEVOQlFVTWlMQ0ptYVd4bElqb2lMMmh2YldVdllpOWtaWFl2ZG1seWRIVmhiQzFoZFdScGJ5MW5jbUZ3YUM5emNtTXZkbWx5ZEhWaGJFNXZaR1ZEYjI1emRISjFZM1J2Y25NdlRtRjBhWFpsVm1seWRIVmhiRUYxWkdsdlRtOWtaUzVxY3lJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYkltTnZibk4wSUdOeVpXRjBaVUYxWkdsdlRtOWtaU0E5SUhKbGNYVnBjbVVvSnk0dUwzUnZiMnh6TDJOeVpXRjBaVUYxWkdsdlRtOWtaU2NwTzF4dVkyOXVjM1FnZTJadmNrVmhZMmdzSUd0bGVYTXNJSEJwWTJzc0lHOXRhWFI5SUQwZ2NtVnhkV2x5WlNnbmNtRnRaR0VuS1R0Y2JseHVZMjl1YzNRZ1kyOXVjM1J5ZFdOMGIzSlFZWEpoYlhOTFpYbHpJRDBnVzF4dUlDQW5iV0Y0UkdWc1lYbFVhVzFsSnl4Y2JsMDdYRzVjYm0xdlpIVnNaUzVsZUhCdmNuUnpJRDBnWTJ4aGMzTWdUbUYwYVhabFZtbHlkSFZoYkVGMVpHbHZUbTlrWlNCN1hHNGdJR052Ym5OMGNuVmpkRzl5SUNoMmFYSjBkV0ZzUVhWa2FXOUhjbUZ3YUN3Z2RtbHlkSFZoYkU1dlpHVlFZWEpoYlhNcElIdGNiaUFnSUNCc1pYUWdlMjV2WkdVc0lHbGtMQ0JwYm5CMWRDd2diM1YwY0hWMExDQndZWEpoYlhOOUlEMGdkbWx5ZEhWaGJFNXZaR1ZRWVhKaGJYTTdYRzRnSUNBZ2NHRnlZVzF6SUQwZ2NHRnlZVzF6SUh4OElIdDlPMXh1SUNBZ0lHTnZibk4wSUdOdmJuTjBjblZqZEc5eVVHRnlZVzF6SUQwZ2NHbGpheWhqYjI1emRISjFZM1J2Y2xCaGNtRnRjMHRsZVhNc0lIQmhjbUZ0Y3lrN1hHNGdJQ0FnY0dGeVlXMXpJRDBnYjIxcGRDaGpiMjV6ZEhKMVkzUnZjbEJoY21GdGMwdGxlWE1zSUhCaGNtRnRjeWs3WEc0Z0lDQWdkR2hwY3k1aGRXUnBiMDV2WkdVZ1BTQmpjbVZoZEdWQmRXUnBiMDV2WkdVb2RtbHlkSFZoYkVGMVpHbHZSM0poY0dndVlYVmthVzlEYjI1MFpYaDBMQ0J1YjJSbExDQmpiMjV6ZEhKMVkzUnZjbEJoY21GdGN5azdYRzRnSUNBZ2RHaHBjeTV1YjJSbElEMGdibTlrWlR0Y2JpQWdJQ0IwYUdsekxuVndaR0YwWlVGMVpHbHZUbTlrWlNod1lYSmhiWE1wTzF4dUlDQWdJSFJvYVhNdWFXUWdQU0JwWkR0Y2JpQWdJQ0IwYUdsekxtbHVjSFYwSUQwZ2FXNXdkWFE3WEc0Z0lDQWdkR2hwY3k1dmRYUndkWFFnUFNCQmNuSmhlUzVwYzBGeWNtRjVLRzkxZEhCMWRDa2dQeUJ2ZFhSd2RYUWdPaUJiYjNWMGNIVjBYVHRjYmlBZ0lDQjBhR2x6TG5CaGNtRnRjeUE5SUhCaGNtRnRjenRjYmlBZ2ZWeHVYRzRnSUdOdmJtNWxZM1FnS0dSbGMzUnBibUYwYVc5dUtTQjdYRzRnSUNBZ2RHaHBjeTVoZFdScGIwNXZaR1V1WTI5dWJtVmpkQ2hrWlhOMGFXNWhkR2x2YmlrN1hHNGdJSDFjYmx4dUlDQmthWE5qYjI1dVpXTjBJQ2dwSUh0Y2JpQWdJQ0IwYUdsekxtRjFaR2x2VG05a1pTNXpkRzl3SUNZbUlIUm9hWE11WVhWa2FXOU9iMlJsTG5OMGIzQW9LVHRjYmlBZ0lDQjBhR2x6TG1GMVpHbHZUbTlrWlM1a2FYTmpiMjV1WldOMEtDazdYRzRnSUgxY2JseHVJQ0IxY0dSaGRHVkJkV1JwYjA1dlpHVWdLSEJoY21GdGN5a2dlMXh1SUNBZ0lIQmhjbUZ0Y3lBOUlHOXRhWFFvWTI5dWMzUnlkV04wYjNKUVlYSmhiWE5MWlhsekxDQndZWEpoYlhNcE8xeHVJQ0FnSUdadmNrVmhZMmdvS0d0bGVTa2dQVDRnZTF4dUlDQWdJQ0FnYzNkcGRHTm9JQ2hyWlhrcElIdGNiaUFnSUNBZ0lDQWdZMkZ6WlNBbmRIbHdaU2M2WEc0Z0lDQWdJQ0FnSUNBZ2RHaHBjeTVoZFdScGIwNXZaR1ZiYTJWNVhTQTlJSEJoY21GdGMxdHJaWGxkTzF4dUlDQWdJQ0FnSUNBZ0lISmxkSFZ5Ymp0Y2JpQWdJQ0FnSUNBZ1pHVm1ZWFZzZERwY2JpQWdJQ0FnSUNBZ0lDQjBhR2x6TG1GMVpHbHZUbTlrWlZ0clpYbGRMblpoYkhWbElEMGdjR0Z5WVcxelcydGxlVjA3WEc0Z0lDQWdJQ0FnSUNBZ2NtVjBkWEp1TzF4dUlDQWdJQ0FnZlZ4dUlDQWdJSDBzSUd0bGVYTW9jR0Z5WVcxektTazdYRzRnSUgxY2JuMDdYRzRpWFgwPSJdfQ==
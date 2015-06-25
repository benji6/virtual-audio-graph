(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var _util = require("./util");

var util = _interopRequireWildcard(_util);

var _utilEnumerator = require("./util/Enumerator");

var _utilEnumerator2 = _interopRequireDefault(_utilEnumerator);

var _AudioNode2 = require("./AudioNode");

var _AudioNode3 = _interopRequireDefault(_AudioNode2);

var AnalyserNode = (function (_AudioNode) {
  function AnalyserNode(admission, context) {
    _classCallCheck(this, AnalyserNode);

    _get(Object.getPrototypeOf(AnalyserNode.prototype), "constructor", this).call(this, admission, {
      name: "AnalyserNode",
      context: context,
      numberOfInputs: 1,
      numberOfOutputs: 1,
      channelCount: 1,
      channelCountMode: "explicit",
      channelInterpretation: "speakers"
    });

    this._.fftSize = 2048;
    this._.minDecibels = -100;
    this._.maxDecibels = 30;
    this._.smoothingTimeConstant = 0.8;
    this._.JSONKeys = AnalyserNode.$JSONKeys.slice();
  }

  _inherits(AnalyserNode, _AudioNode);

  _createClass(AnalyserNode, [{
    key: "getFloatFrequencyData",
    value: function getFloatFrequencyData(array) {
      this._.inspector.describe("getFloatFrequencyData", function (assert) {
        assert(util.isInstanceOf(array, Float32Array), function (fmt) {
          throw new TypeError(fmt.plain(_taggedTemplateLiteral(["\n          ", ";\n          ", "\n        "], ["\n          ", ";\n          ", "\n        "]), fmt.form, fmt.butGot(array, "array", "Float32Array")));
        });
      });
    }
  }, {
    key: "getByteFrequencyData",
    value: function getByteFrequencyData(array) {
      this._.inspector.describe("getByteFrequencyData", function (assert) {
        assert(util.isInstanceOf(array, Uint8Array), function (fmt) {
          throw new TypeError(fmt.plain(_taggedTemplateLiteral(["\n          ", ";\n          ", "\n        "], ["\n          ", ";\n          ", "\n        "]), fmt.form, fmt.butGot(array, "array", "Uint8Array")));
        });
      });
    }
  }, {
    key: "getByteTimeDomainData",
    value: function getByteTimeDomainData(array) {
      this._.inspector.describe("getByteTimeDomainData", function (assert) {
        assert(util.isInstanceOf(array, Uint8Array), function (fmt) {
          throw new TypeError(fmt.plain(_taggedTemplateLiteral(["\n          ", ";\n          ", "\n        "], ["\n          ", ";\n          ", "\n        "]), fmt.form, fmt.butGot(array, "array", "Uint8Array")));
        });
      });
    }
  }, {
    key: "fftSize",
    get: function get() {
      return this._.fftSize;
    },
    set: function set(value) {
      this._.inspector.describe("fftSize", function (assert) {
        var enumFFTSize = new _utilEnumerator2["default"]([32, 64, 128, 256, 512, 1024, 2048]);

        assert(enumFFTSize.contains(value), function (fmt) {
          throw new TypeError(fmt.plain(_taggedTemplateLiteral(["\n          ", ";\n          ", "\n        "], ["\n          ", ";\n          ", "\n        "]), fmt.form, fmt.butGot(value, "fftSize", enumFFTSize.toString())));
        });
      });

      this._.fftSize = value;
    }
  }, {
    key: "frequencyBinCount",
    get: function get() {
      return this.fftSize >> 1;
    },
    set: function set(value) {
      this._.inspector.describe("frequencyBinCount", function (assert) {
        assert.throwReadOnlyTypeError(value);
      });
    }
  }, {
    key: "minDecibels",
    get: function get() {
      return this._.minDecibels;
    },
    set: function set(value) {
      this._.inspector.describe("minDecibels", function (assert) {
        assert(util.isNumber(value), function (fmt) {
          throw new TypeError(fmt.plain(_taggedTemplateLiteral(["\n          ", ";\n          ", "\n        "], ["\n          ", ";\n          ", "\n        "]), fmt.form, fmt.butGot(value, "minDecibels", "number")));
        });
      });

      this._.minDecibels = value;
    }
  }, {
    key: "maxDecibels",
    get: function get() {
      return this._.maxDecibels;
    },
    set: function set(value) {
      this._.inspector.describe("maxDecibels", function (assert) {
        assert(util.isNumber(value), function (fmt) {
          throw new TypeError(fmt.plain(_taggedTemplateLiteral(["\n          ", ";\n          ", "\n        "], ["\n          ", ";\n          ", "\n        "]), fmt.form, fmt.butGot(value, "maxDecibels", "number")));
        });
      });

      this._.maxDecibels = value;
    }
  }, {
    key: "smoothingTimeConstant",
    get: function get() {
      return this._.smoothingTimeConstant;
    },
    set: function set(value) {
      this._.inspector.describe("smoothingTimeConstant", function (assert) {
        assert(util.isNumber(value), function (fmt) {
          throw new TypeError(fmt.plain(_taggedTemplateLiteral(["\n          ", ";\n          ", "\n        "], ["\n          ", ";\n          ", "\n        "]), fmt.form, fmt.butGot(value, "smoothingTimeConstant", "number")));
        });
      });

      this._.smoothingTimeConstant = value;
    }
  }]);

  return AnalyserNode;
})(_AudioNode3["default"]);

exports["default"] = AnalyserNode;

AnalyserNode.$JSONKeys = ["fftSize", "minDecibels", "maxDecibels", "smoothingTimeConstant"];
module.exports = exports["default"];

},{"./AudioNode":7,"./util":41,"./util/Enumerator":37}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var _util = require("./util");

var util = _interopRequireWildcard(_util);

var _utilInspector = require("./util/Inspector");

var _utilInspector2 = _interopRequireDefault(_utilInspector);

var AudioBuffer = (function () {
  function AudioBuffer(admission, context, numberOfChannels, length, sampleRate) {
    _classCallCheck(this, AudioBuffer);

    util.immigration.check(admission, function () {
      throw new TypeError("Illegal constructor");
    });

    Object.defineProperty(this, "_", {
      value: {
        inspector: new _utilInspector2["default"](this)
      }
    });

    this._.inspector.describe("constructor", function (assert) {
      assert(util.isPositiveInteger(numberOfChannels), function (fmt) {
        throw new TypeError(fmt.plain(_taggedTemplateLiteral(["\n          ", ";\n          ", "\n        "], ["\n          ", ";\n          ", "\n        "]), fmt.form, fmt.butGot(numberOfChannels, "numberOfChannels", "positive integer")));
      });

      assert(util.isPositiveInteger(length), function (fmt) {
        throw new TypeError(fmt.plain(_taggedTemplateLiteral(["\n          ", ";\n          ", "\n        "], ["\n          ", ";\n          ", "\n        "]), fmt.form, fmt.butGot(length, "length", "positive integer")));
      });

      assert(util.isPositiveInteger(sampleRate), function (fmt) {
        throw new TypeError(fmt.plain(_taggedTemplateLiteral(["\n          ", ";\n          ", "\n        "], ["\n          ", ";\n          ", "\n        "]), fmt.form, fmt.butGot(sampleRate, "sampleRate", "positive integer")));
      });
    });

    this._.context = context;
    this._.numberOfChannels = numberOfChannels;
    this._.length = length;
    this._.sampleRate = sampleRate;
    this._.data = new Array(numberOfChannels);

    for (var i = 0; i < numberOfChannels; i++) {
      this._.data[i] = new Float32Array(length);
    }
  }

  _createClass(AudioBuffer, [{
    key: "getChannelData",
    value: function getChannelData(channel) {
      var _this = this;

      this._.inspector.describe("getChannelData", function (assert) {
        assert(util.isPositiveInteger(channel), function (fmt) {
          throw new TypeError(fmt.plain(_taggedTemplateLiteral(["\n          ", ";\n          ", "\n        "], ["\n          ", ";\n          ", "\n        "]), fmt.form, fmt.butGot(channel, "channel", "positive integer")));
        });

        assert(channel < _this._.data.length, function (fmt) {
          throw new TypeError(fmt.plain(_taggedTemplateLiteral(["\n          ", ";\n          channel index (", ") exceeds number of channels (", ")\n        "], ["\n          ", ";\n          channel index (", ") exceeds number of channels (", ")\n        "]), fmt.form, channel, _this._.data.length));
        });
      });

      return this._.data[channel];
    }
  }, {
    key: "toJSON",
    value: function toJSON() {
      var json = {
        name: this.$name,
        sampleRate: this.sampleRate,
        length: this.length,
        duration: this.duration,
        numberOfChannels: this.numberOfChannels
      };

      if (this.$context.VERBOSE_JSON) {
        json.data = this._.data.map(function (data) {
          return Array.prototype.slice.call(data);
        });
      }

      return json;
    }
  }, {
    key: "sampleRate",
    get: function get() {
      return this._.sampleRate;
    },
    set: function set(value) {
      this._.inspector.describe("sampleRate", function (assert) {
        assert.throwReadOnlyTypeError(value);
      });
    }
  }, {
    key: "length",
    get: function get() {
      return this._.length;
    },
    set: function set(value) {
      this._.inspector.describe("length", function (assert) {
        assert.throwReadOnlyTypeError(value);
      });
    }
  }, {
    key: "duration",
    get: function get() {
      return this.length / this.sampleRate;
    },
    set: function set(value) {
      this._.inspector.describe("duration", function (assert) {
        assert.throwReadOnlyTypeError(value);
      });
    }
  }, {
    key: "numberOfChannels",
    get: function get() {
      return this._.numberOfChannels;
    },
    set: function set(value) {
      this._.inspector.describe("numberOfChannels", function (assert) {
        assert.throwReadOnlyTypeError(value);
      });
    }
  }, {
    key: "$name",
    get: function get() {
      return "AudioBuffer";
    }
  }, {
    key: "$context",
    get: function get() {
      return this._.context;
    }
  }]);

  return AudioBuffer;
})();

exports["default"] = AudioBuffer;
module.exports = exports["default"];

},{"./util":41,"./util/Inspector":40}],3:[function(require,module,exports){
(function (global){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x5, _x6, _x7) { var _again = true; _function: while (_again) { var object = _x5, property = _x6, receiver = _x7; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x5 = parent; _x6 = property; _x7 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var _util = require("./util");

var util = _interopRequireWildcard(_util);

var _AudioNode2 = require("./AudioNode");

var _AudioNode3 = _interopRequireDefault(_AudioNode2);

var _AudioParam = require("./AudioParam");

var _AudioParam2 = _interopRequireDefault(_AudioParam);

var _Event = require("./Event");

var _Event2 = _interopRequireDefault(_Event);

var AudioBufferSourceNode = (function (_AudioNode) {
  function AudioBufferSourceNode(admission, context) {
    var _this = this;

    _classCallCheck(this, AudioBufferSourceNode);

    _get(Object.getPrototypeOf(AudioBufferSourceNode.prototype), "constructor", this).call(this, admission, {
      name: "AudioBufferSourceNode",
      context: context,
      numberOfInputs: 0,
      numberOfOutputs: 1,
      channelCount: 2,
      channelCountMode: "max",
      channelInterpretation: "speakers"
    });

    this._.buffer = null;
    this._.playbackRate = util.immigration.apply(function (admission) {
      return new _AudioParam2["default"](admission, _this, "playbackRate", 1, 0, 1024);
    });
    this._.loop = false;
    this._.loopStart = 0;
    this._.loopEnd = 0;
    this._.onended = null;
    this._.startTime = Infinity;
    this._.stopTime = Infinity;
    this._.firedOnEnded = false;
    this._.JSONKeys = AudioBufferSourceNode.$JSONKeys.slice();
  }

  _inherits(AudioBufferSourceNode, _AudioNode);

  _createClass(AudioBufferSourceNode, [{
    key: "start",
    value: function start() {
      var when = arguments[0] === undefined ? 0 : arguments[0];

      var _this2 = this;

      var offset = arguments[1] === undefined ? 0 : arguments[1];
      var duration = arguments[2] === undefined ? 0 : arguments[2];

      this._.inspector.describe("start", ["when", "offset", "duration"], function (assert) {
        assert(util.isPositiveNumber(when), function (fmt) {
          throw new TypeError(fmt.plain(_taggedTemplateLiteral(["\n          ", ";\n          ", "\n        "], ["\n          ", ";\n          ", "\n        "]), fmt.form, fmt.butGot(when, "when", "positive number")));
        });

        assert(util.isPositiveNumber(offset), function (fmt) {
          throw new TypeError(fmt.plain(_taggedTemplateLiteral(["\n          ", ";\n          ", "\n        "], ["\n          ", ";\n          ", "\n        "]), fmt.form, fmt.butGot(offset, "offset", "positive number")));
        });

        assert(util.isPositiveNumber(duration), function (fmt) {
          throw new TypeError(fmt.plain(_taggedTemplateLiteral(["\n          ", ";\n          ", "\n        "], ["\n          ", ";\n          ", "\n        "]), fmt.form, fmt.butGot(duration, "duration", "positive number")));
        });

        assert(_this2._.startTime === Infinity, function (fmt) {
          throw new Error(fmt.plain(_taggedTemplateLiteral(["\n          ", ";\n          cannot start more than once\n        "], ["\n          ", ";\n          cannot start more than once\n        "]), fmt.form));
        });
      });

      this._.startTime = when;
    }
  }, {
    key: "stop",
    value: function stop() {
      var _this3 = this;

      var when = arguments[0] === undefined ? 0 : arguments[0];

      this._.inspector.describe("stop", ["when"], function (assert) {
        assert(util.isPositiveNumber(when), function (fmt) {
          throw new TypeError(fmt.plain(_taggedTemplateLiteral(["\n          ", ";\n          ", "\n        "], ["\n          ", ";\n          ", "\n        "]), fmt.form, fmt.butGot(when, "when", "positive number")));
        });

        assert(_this3._.startTime !== Infinity, function (fmt) {
          throw new Error(fmt.plain(_taggedTemplateLiteral(["\n          ", ";\n          cannot call stop without calling start first\n        "], ["\n          ", ";\n          cannot call stop without calling start first\n        "]), fmt.form));
        });

        assert(_this3._.stopTime === Infinity, function (fmt) {
          throw new Error(fmt.plain(_taggedTemplateLiteral(["\n          ", ";\n          cannot stop more than once\n        "], ["\n          ", ";\n          cannot stop more than once\n        "]), fmt.form));
        });
      });

      this._.stopTime = when;
    }
  }, {
    key: "$stateAtTime",
    value: function $stateAtTime(time) {
      time = util.toSeconds(time);

      if (this._.startTime === Infinity) {
        return "UNSCHEDULED";
      }
      if (time < this._.startTime) {
        return "SCHEDULED";
      }

      var stopTime = this._.stopTime;

      if (!this.loop && this.buffer) {
        stopTime = Math.min(stopTime, this._.startTime + this.buffer.duration);
      }

      if (time < stopTime) {
        return "PLAYING";
      }

      return "FINISHED";
    }
  }, {
    key: "_process",
    value: function _process() {
      if (!this._.firedOnEnded && this.$stateAtTime(this.context.currentTime) === "FINISHED") {
        this.dispatchEvent(new _Event2["default"]("ended", this));
        this._.firedOnEnded = true;
      }
    }
  }, {
    key: "buffer",
    get: function get() {
      return this._.buffer;
    },
    set: function set(value) {
      this._.inspector.describe("buffer", function (assert) {
        assert(util.isNullOrInstanceOf(value, global.AudioBuffer), function (fmt) {
          throw new TypeError(fmt.plain(_taggedTemplateLiteral(["\n          ", ";\n          ", "\n        "], ["\n          ", ";\n          ", "\n        "]), fmt.form, fmt.butGot(value, "buffer", "AudioBuffer")));
        });
      });

      this._.buffer = value;
    }
  }, {
    key: "playbackRate",
    get: function get() {
      return this._.playbackRate;
    },
    set: function set(value) {
      this._.inspector.describe("playbackRate", function (assert) {
        assert.throwReadOnlyTypeError(value);
      });
    }
  }, {
    key: "loop",
    get: function get() {
      return this._.loop;
    },
    set: function set(value) {
      this._.inspector.describe("loop", function (assert) {
        assert(util.isBoolean(value), function (fmt) {
          throw new TypeError(fmt.plain(_taggedTemplateLiteral(["\n          ", ";\n          ", "\n        "], ["\n          ", ";\n          ", "\n        "]), fmt.form, fmt.butGot(value, "loop", "boolean")));
        });
      });

      this._.loop = value;
    }
  }, {
    key: "loopStart",
    get: function get() {
      return this._.loopStart;
    },
    set: function set(value) {
      this._.inspector.describe("loopStart", function (assert) {
        assert(util.isPositiveNumber(value), function (fmt) {
          throw new TypeError(fmt.plain(_taggedTemplateLiteral(["\n          ", ";\n          ", "\n        "], ["\n          ", ";\n          ", "\n        "]), fmt.form, fmt.butGot(value, "loopStart", "positive number")));
        });
      });

      this._.loopStart = value;
    }
  }, {
    key: "loopEnd",
    get: function get() {
      return this._.loopEnd;
    },
    set: function set(value) {
      this._.inspector.describe("loopEnd", function (assert) {
        assert(util.isPositiveNumber(value), function (fmt) {
          throw new TypeError(fmt.plain(_taggedTemplateLiteral(["\n          ", ";\n          ", "\n        "], ["\n          ", ";\n          ", "\n        "]), fmt.form, fmt.butGot(value, "loopEnd", "positive number")));
        });
      });

      this._.loopEnd = value;
    }
  }, {
    key: "onended",
    get: function get() {
      return this._.onended;
    },
    set: function set(value) {
      this._.inspector.describe("onended", function (assert) {
        assert(util.isNullOrFunction(value), function (fmt) {
          throw new TypeError(fmt.plain(_taggedTemplateLiteral(["\n          ", ";\n          ", "\n        "], ["\n          ", ";\n          ", "\n        "]), fmt.form, fmt.butGot(value, "onended", "function")));
        });
      });

      this._.onended = value;
    }
  }, {
    key: "$state",
    get: function get() {
      return this.$stateAtTime(this.context.currentTime);
    }
  }]);

  return AudioBufferSourceNode;
})(_AudioNode3["default"]);

exports["default"] = AudioBufferSourceNode;

AudioBufferSourceNode.$JSONKeys = ["buffer", "playbackRate", "loop", "loopStart", "loopEnd"];
module.exports = exports["default"];

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./AudioNode":7,"./AudioParam":8,"./Event":17,"./util":41}],4:[function(require,module,exports){
(function (global){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x5, _x6, _x7) { var _again = true; _function: while (_again) { var object = _x5, property = _x6, receiver = _x7; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x5 = parent; _x6 = property; _x7 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var _util = require("./util");

var util = _interopRequireWildcard(_util);

var _EventTarget2 = require("./EventTarget");

var _EventTarget3 = _interopRequireDefault(_EventTarget2);

var _AnalyserNode = require("./AnalyserNode");

var _AnalyserNode2 = _interopRequireDefault(_AnalyserNode);

var _AudioBuffer = require("./AudioBuffer");

var _AudioBuffer2 = _interopRequireDefault(_AudioBuffer);

var _AudioBufferSourceNode = require("./AudioBufferSourceNode");

var _AudioBufferSourceNode2 = _interopRequireDefault(_AudioBufferSourceNode);

var _AudioDestinationNode = require("./AudioDestinationNode");

var _AudioDestinationNode2 = _interopRequireDefault(_AudioDestinationNode);

var _AudioListener = require("./AudioListener");

var _AudioListener2 = _interopRequireDefault(_AudioListener);

var _BiquadFilterNode = require("./BiquadFilterNode");

var _BiquadFilterNode2 = _interopRequireDefault(_BiquadFilterNode);

var _ChannelMergerNode = require("./ChannelMergerNode");

var _ChannelMergerNode2 = _interopRequireDefault(_ChannelMergerNode);

var _ChannelSplitterNode = require("./ChannelSplitterNode");

var _ChannelSplitterNode2 = _interopRequireDefault(_ChannelSplitterNode);

var _ConvolverNode = require("./ConvolverNode");

var _ConvolverNode2 = _interopRequireDefault(_ConvolverNode);

var _DelayNode = require("./DelayNode");

var _DelayNode2 = _interopRequireDefault(_DelayNode);

var _DynamicsCompressorNode = require("./DynamicsCompressorNode");

var _DynamicsCompressorNode2 = _interopRequireDefault(_DynamicsCompressorNode);

var _GainNode = require("./GainNode");

var _GainNode2 = _interopRequireDefault(_GainNode);

var _MediaElementAudioSourceNode = require("./MediaElementAudioSourceNode");

var _MediaElementAudioSourceNode2 = _interopRequireDefault(_MediaElementAudioSourceNode);

var _MediaStreamAudioDestinationNode = require("./MediaStreamAudioDestinationNode");

var _MediaStreamAudioDestinationNode2 = _interopRequireDefault(_MediaStreamAudioDestinationNode);

var _MediaStreamAudioSourceNode = require("./MediaStreamAudioSourceNode");

var _MediaStreamAudioSourceNode2 = _interopRequireDefault(_MediaStreamAudioSourceNode);

var _OscillatorNode = require("./OscillatorNode");

var _OscillatorNode2 = _interopRequireDefault(_OscillatorNode);

var _PannerNode = require("./PannerNode");

var _PannerNode2 = _interopRequireDefault(_PannerNode);

var _PeriodicWave = require("./PeriodicWave");

var _PeriodicWave2 = _interopRequireDefault(_PeriodicWave);

var _ScriptProcessorNode = require("./ScriptProcessorNode");

var _ScriptProcessorNode2 = _interopRequireDefault(_ScriptProcessorNode);

var _StereoPannerNode = require("./StereoPannerNode");

var _StereoPannerNode2 = _interopRequireDefault(_StereoPannerNode);

var _WaveShaperNode = require("./WaveShaperNode");

var _WaveShaperNode2 = _interopRequireDefault(_WaveShaperNode);

var AudioContext = (function (_EventTarget) {
  function AudioContext() {
    var _this = this;

    _classCallCheck(this, AudioContext);

    _get(Object.getPrototypeOf(AudioContext.prototype), "constructor", this).call(this);

    this._.destination = util.immigration.apply(function (admission) {
      return new _AudioDestinationNode2["default"](admission, _this);
    });
    this._.sampleRate = global.WebAudioTestAPI.sampleRate;
    this._.listener = util.immigration.apply(function (admission) {
      return new _AudioListener2["default"](admission, _this);
    });
    this._.microCurrentTime = 0;
    this._.processedSamples = 0;
    this._.tick = 0;
  }

  _inherits(AudioContext, _EventTarget);

  _createClass(AudioContext, [{
    key: "createBuffer",
    value: function createBuffer(numberOfChannels, length, sampleRate) {
      var _this2 = this;

      return util.immigration.apply(function (admission) {
        return new _AudioBuffer2["default"](admission, _this2, numberOfChannels, length, sampleRate);
      });
    }
  }, {
    key: "decodeAudioData",
    value: function decodeAudioData(audioData, successCallback) {
      var _this3 = this;

      var errorCallback = arguments[2] === undefined ? function () {} : arguments[2];

      this._.inspector.describe("decodeAudioData", ["audioData", "successCallback", "errorCallback"], function (assert) {
        assert(util.isInstanceOf(audioData, global.ArrayBuffer), function (fmt) {
          throw new TypeError(fmt.plain(_taggedTemplateLiteral(["\n          ", ";\n          ", "\n        "], ["\n          ", ";\n          ", "\n        "]), fmt.form, fmt.butGot(audioData, "audioData", "ArrayBuffer")));
        });

        assert(util.isFunction(successCallback), function (fmt) {
          throw new TypeError(fmt.plain(_taggedTemplateLiteral(["\n          ", ";\n          ", "\n        "], ["\n          ", ";\n          ", "\n        "]), fmt.form, fmt.butGot(successCallback, "successCallback", "function")));
        });

        assert(util.isFunction(errorCallback), function (fmt) {
          throw new TypeError(fmt.plain(_taggedTemplateLiteral(["\n          ", ";\n          ", "\n        "], ["\n          ", ";\n          ", "\n        "]), fmt.form, fmt.butGot(errorCallback, "errorCallback", "function")));
        });
      });

      setTimeout(function () {
        if (_this3.DECODE_AUDIO_DATA_FAILED) {
          errorCallback();
        } else {
          successCallback(_this3.DECODE_AUDIO_DATA_RESULT || util.immigration.apply(function (admission) {
            return new _AudioBuffer2["default"](admission, _this3, 2, 1024, _this3.sampleRate);
          }));
        }
      }, 0);
    }
  }, {
    key: "createBufferSource",
    value: function createBufferSource() {
      var _this4 = this;

      return util.immigration.apply(function (admission) {
        return new _AudioBufferSourceNode2["default"](admission, _this4);
      });
    }
  }, {
    key: "createMediaElementSource",
    value: function createMediaElementSource(mediaElement) {
      var _this5 = this;

      return util.immigration.apply(function (admission) {
        return new _MediaElementAudioSourceNode2["default"](admission, _this5, mediaElement);
      });
    }
  }, {
    key: "createMediaStreamSource",
    value: function createMediaStreamSource(mediaStream) {
      var _this6 = this;

      return util.immigration.apply(function (admission) {
        return new _MediaStreamAudioSourceNode2["default"](admission, _this6, mediaStream);
      });
    }
  }, {
    key: "createMediaStreamDestination",
    value: function createMediaStreamDestination() {
      var _this7 = this;

      return util.immigration.apply(function (admission) {
        return new _MediaStreamAudioDestinationNode2["default"](admission, _this7);
      });
    }
  }, {
    key: "createScriptProcessor",
    value: function createScriptProcessor(bufferSize, numberOfInputChannels, numberOfOutputChannels) {
      var _this8 = this;

      return util.immigration.apply(function (admission) {
        return new _ScriptProcessorNode2["default"](admission, _this8, bufferSize, numberOfInputChannels, numberOfOutputChannels);
      });
    }
  }, {
    key: "createAnalyser",
    value: function createAnalyser() {
      var _this9 = this;

      return util.immigration.apply(function (admission) {
        return new _AnalyserNode2["default"](admission, _this9);
      });
    }
  }, {
    key: "createGain",
    value: function createGain() {
      var _this10 = this;

      return util.immigration.apply(function (admission) {
        return new _GainNode2["default"](admission, _this10);
      });
    }
  }, {
    key: "createDelay",
    value: function createDelay() {
      var _this11 = this;

      var maxDelayTime = arguments[0] === undefined ? 1 : arguments[0];

      return util.immigration.apply(function (admission) {
        return new _DelayNode2["default"](admission, _this11, maxDelayTime);
      });
    }
  }, {
    key: "createBiquadFilter",
    value: function createBiquadFilter() {
      var _this12 = this;

      return util.immigration.apply(function (admission) {
        return new _BiquadFilterNode2["default"](admission, _this12);
      });
    }
  }, {
    key: "createWaveShaper",
    value: function createWaveShaper() {
      var _this13 = this;

      return util.immigration.apply(function (admission) {
        return new _WaveShaperNode2["default"](admission, _this13);
      });
    }
  }, {
    key: "createPanner",
    value: function createPanner() {
      var _this14 = this;

      return util.immigration.apply(function (admission) {
        return new _PannerNode2["default"](admission, _this14);
      });
    }
  }, {
    key: "createConvolver",
    value: function createConvolver() {
      var _this15 = this;

      return util.immigration.apply(function (admission) {
        return new _ConvolverNode2["default"](admission, _this15);
      });
    }
  }, {
    key: "createChannelSplitter",
    value: function createChannelSplitter() {
      var _this16 = this;

      var numberOfOutputs = arguments[0] === undefined ? 6 : arguments[0];

      return util.immigration.apply(function (admission) {
        return new _ChannelSplitterNode2["default"](admission, _this16, numberOfOutputs);
      });
    }
  }, {
    key: "createChannelMerger",
    value: function createChannelMerger() {
      var _this17 = this;

      var numberOfInputs = arguments[0] === undefined ? 6 : arguments[0];

      return util.immigration.apply(function (admission) {
        return new _ChannelMergerNode2["default"](admission, _this17, numberOfInputs);
      });
    }
  }, {
    key: "createDynamicsCompressor",
    value: function createDynamicsCompressor() {
      var _this18 = this;

      return util.immigration.apply(function (admission) {
        return new _DynamicsCompressorNode2["default"](admission, _this18);
      });
    }
  }, {
    key: "createOscillator",
    value: function createOscillator() {
      var _this19 = this;

      return util.immigration.apply(function (admission) {
        return new _OscillatorNode2["default"](admission, _this19);
      });
    }
  }, {
    key: "createPeriodicWave",
    value: function createPeriodicWave(real, imag) {
      var _this20 = this;

      return util.immigration.apply(function (admission) {
        return new _PeriodicWave2["default"](admission, _this20, real, imag);
      });
    }
  }, {
    key: "createStereoPanner",
    value: function createStereoPanner() {
      var _this21 = this;

      return util.immigration.apply(function (admission) {
        return new _StereoPannerNode2["default"](admission, _this21);
      });
    }
  }, {
    key: "toJSON",
    value: function toJSON() {
      return this.destination.toJSON([]);
    }
  }, {
    key: "$process",
    value: function $process(time) {
      this._process(util.toMicroseconds(time));
    }
  }, {
    key: "$processTo",
    value: function $processTo(time) {
      time = util.toMicroseconds(time);
      if (this._.microCurrentTime < time) {
        this._process(time - this._.microCurrentTime);
      }
    }
  }, {
    key: "$reset",
    value: function $reset() {
      this._.microCurrentTime = 0;
      this._.processedSamples = 0;
      this.destination.$inputs.forEach(function (node) {
        node.disconnect();
      });
    }
  }, {
    key: "_process",
    value: function _process(microseconds) {
      var nextMicroCurrentTime = this._.microCurrentTime + microseconds;

      while (this._.microCurrentTime < nextMicroCurrentTime) {
        var _nextMicroCurrentTime = Math.min(this._.microCurrentTime + 1000, nextMicroCurrentTime);
        var _nextProcessedSamples = Math.floor(_nextMicroCurrentTime / (1000 * 1000) * this.sampleRate);
        var inNumSamples = _nextProcessedSamples - this._.processedSamples;

        this._.microCurrentTime = _nextMicroCurrentTime;
        this._.processedSamples = _nextProcessedSamples;

        this.destination.$process(inNumSamples, ++this._.tick);
      }
    }
  }, {
    key: "destination",
    get: function get() {
      return this._.destination;
    },
    set: function set(value) {
      this._.inspector.describe("destination", function (assert) {
        assert.throwReadOnlyTypeError(value);
      });
    }
  }, {
    key: "sampleRate",
    get: function get() {
      return this._.sampleRate;
    },
    set: function set(value) {
      this._.inspector.describe("sampleRate", function (assert) {
        assert.throwReadOnlyTypeError(value);
      });
    }
  }, {
    key: "currentTime",
    get: function get() {
      return this._.microCurrentTime / (1000 * 1000);
    },
    set: function set(value) {
      this._.inspector.describe("currentTime", function (assert) {
        assert.throwReadOnlyTypeError(value);
      });
    }
  }, {
    key: "listener",
    get: function get() {
      return this._.listener;
    },
    set: function set(value) {
      this._.inspector.describe("listener", function (assert) {
        assert.throwReadOnlyTypeError(value);
      });
    }
  }, {
    key: "$name",
    get: function get() {
      return "AudioContext";
    }
  }, {
    key: "$context",
    get: function get() {
      return this;
    }
  }], [{
    key: "WEB_AUDIO_TEST_API_VERSION",
    get: function get() {
      return util.getAPIVersion();
    }
  }]);

  return AudioContext;
})(_EventTarget3["default"]);

exports["default"] = AudioContext;
module.exports = exports["default"];

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./AnalyserNode":1,"./AudioBuffer":2,"./AudioBufferSourceNode":3,"./AudioDestinationNode":5,"./AudioListener":6,"./BiquadFilterNode":10,"./ChannelMergerNode":11,"./ChannelSplitterNode":12,"./ConvolverNode":13,"./DelayNode":14,"./DynamicsCompressorNode":15,"./EventTarget":18,"./GainNode":19,"./MediaElementAudioSourceNode":22,"./MediaStreamAudioDestinationNode":24,"./MediaStreamAudioSourceNode":25,"./OscillatorNode":28,"./PannerNode":29,"./PeriodicWave":30,"./ScriptProcessorNode":31,"./StereoPannerNode":32,"./WaveShaperNode":34,"./util":41}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _AudioNode2 = require("./AudioNode");

var _AudioNode3 = _interopRequireDefault(_AudioNode2);

var AudioDestinationNode = (function (_AudioNode) {
  function AudioDestinationNode(admission, context) {
    _classCallCheck(this, AudioDestinationNode);

    _get(Object.getPrototypeOf(AudioDestinationNode.prototype), "constructor", this).call(this, admission, {
      name: "AudioDestinationNode",
      context: context,
      numberOfInputs: 1,
      numberOfOutputs: 0,
      channelCount: 2,
      channelCountMode: "explicit",
      channelInterpretation: "speakers"
    });

    this._.maxChannelCount = 2;
  }

  _inherits(AudioDestinationNode, _AudioNode);

  _createClass(AudioDestinationNode, [{
    key: "maxChannelCount",
    get: function get() {
      return this._.maxChannelCount;
    },
    set: function set(value) {
      this._.inspector.describe("maxChannelCount", function (assert) {
        assert.throwReadOnlyTypeError(value);
      });
    }
  }]);

  return AudioDestinationNode;
})(_AudioNode3["default"]);

exports["default"] = AudioDestinationNode;
module.exports = exports["default"];

},{"./AudioNode":7}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var _util = require("./util");

var util = _interopRequireWildcard(_util);

var _utilInspector = require("./util/Inspector");

var _utilInspector2 = _interopRequireDefault(_utilInspector);

var AudioListener = (function () {
  function AudioListener(admission, context) {
    _classCallCheck(this, AudioListener);

    Object.defineProperty(this, "_", {
      value: {
        inspector: new _utilInspector2["default"](this)
      }
    });

    this._.context = context;
    this._.dopplerFactor = 1;
    this._.speedOfSound = 343.3;

    util.immigration.check(admission, function () {
      throw new TypeError("Illegal constructor");
    });
  }

  _createClass(AudioListener, [{
    key: "setPosition",
    value: function setPosition(x, y, z) {
      this._.inspector.describe("setPosition", function (assert) {
        assert(util.isNumber(x), function (fmt) {
          throw new TypeError(fmt.plain(_taggedTemplateLiteral(["\n          ", ";\n          ", "\n        "], ["\n          ", ";\n          ", "\n        "]), fmt.form, fmt.butGot(x, "x", "number")));
        });

        assert(util.isNumber(y), function (fmt) {
          throw new TypeError(fmt.plain(_taggedTemplateLiteral(["\n          ", ";\n          ", "\n        "], ["\n          ", ";\n          ", "\n        "]), fmt.form, fmt.butGot(y, "y", "number")));
        });

        assert(util.isNumber(z), function (fmt) {
          throw new TypeError(fmt.plain(_taggedTemplateLiteral(["\n          ", ";\n          ", "\n        "], ["\n          ", ";\n          ", "\n        "]), fmt.form, fmt.butGot(z, "z", "number")));
        });
      });
    }
  }, {
    key: "setOrientation",
    value: function setOrientation(x, y, z, xUp, yUp, zUp) {
      this._.inspector.describe("setOrientation", function (assert) {
        assert(util.isNumber(x), function (fmt) {
          throw new TypeError(fmt.plain(_taggedTemplateLiteral(["\n          ", ";\n          ", "\n        "], ["\n          ", ";\n          ", "\n        "]), fmt.form, fmt.butGot(x, "x", "number")));
        });

        assert(util.isNumber(y), function (fmt) {
          throw new TypeError(fmt.plain(_taggedTemplateLiteral(["\n          ", ";\n          ", "\n        "], ["\n          ", ";\n          ", "\n        "]), fmt.form, fmt.butGot(y, "y", "number")));
        });

        assert(util.isNumber(z), function (fmt) {
          throw new TypeError(fmt.plain(_taggedTemplateLiteral(["\n          ", ";\n          ", "\n        "], ["\n          ", ";\n          ", "\n        "]), fmt.form, fmt.butGot(z, "z", "number")));
        });

        assert(util.isNumber(xUp), function (fmt) {
          throw new TypeError(fmt.plain(_taggedTemplateLiteral(["\n          ", ";\n          ", "\n        "], ["\n          ", ";\n          ", "\n        "]), fmt.form, fmt.butGot(xUp, "xUp", "number")));
        });

        assert(util.isNumber(yUp), function (fmt) {
          throw new TypeError(fmt.plain(_taggedTemplateLiteral(["\n          ", ";\n          ", "\n        "], ["\n          ", ";\n          ", "\n        "]), fmt.form, fmt.butGot(yUp, "yUp", "number")));
        });

        assert(util.isNumber(zUp), function (fmt) {
          throw new TypeError(fmt.plain(_taggedTemplateLiteral(["\n          ", ";\n          ", "\n        "], ["\n          ", ";\n          ", "\n        "]), fmt.form, fmt.butGot(zUp, "zUp", "number")));
        });
      });
    }
  }, {
    key: "setVelocity",
    value: function setVelocity(x, y, z) {
      this._.inspector.describe("setVelocity", function (assert) {
        assert(util.isNumber(x), function (fmt) {
          throw new TypeError(fmt.plain(_taggedTemplateLiteral(["\n          ", ";\n          ", "\n        "], ["\n          ", ";\n          ", "\n        "]), fmt.form, fmt.butGot(x, "x", "number")));
        });

        assert(util.isNumber(y), function (fmt) {
          throw new TypeError(fmt.plain(_taggedTemplateLiteral(["\n          ", ";\n          ", "\n        "], ["\n          ", ";\n          ", "\n        "]), fmt.form, fmt.butGot(y, "y", "number")));
        });

        assert(util.isNumber(z), function (fmt) {
          throw new TypeError(fmt.plain(_taggedTemplateLiteral(["\n          ", ";\n          ", "\n        "], ["\n          ", ";\n          ", "\n        "]), fmt.form, fmt.butGot(z, "z", "number")));
        });
      });
    }
  }, {
    key: "dopplerFactor",
    get: function get() {
      return this._.dopplerFactor;
    },
    set: function set(value) {
      this._.inspector.describe("dopplerFactor", function (assert) {
        assert(util.isNumber(value), function (fmt) {
          throw new TypeError(fmt.plain(_taggedTemplateLiteral(["\n          ", ";\n          ", "\n        "], ["\n          ", ";\n          ", "\n        "]), fmt.form, fmt.butGot(value, "dopplerFactor", "number")));
        });
      });

      this._.dopplerFactor = value;
    }
  }, {
    key: "speedOfSound",
    get: function get() {
      return this._.speedOfSound;
    },
    set: function set(value) {
      this._.inspector.describe("speedOfSound", function (assert) {
        assert(util.isNumber(value), function (fmt) {
          throw new TypeError(fmt.plain(_taggedTemplateLiteral(["\n          ", ";\n          ", "\n        "], ["\n          ", ";\n          ", "\n        "]), fmt.form, fmt.butGot(value, "speedOfSound", "number")));
        });
      });

      this._.speedOfSound = value;
    }
  }, {
    key: "$name",
    get: function get() {
      return "AudioListener";
    }
  }, {
    key: "$context",
    get: function get() {
      return this._.context;
    }
  }]);

  return AudioListener;
})();

exports["default"] = AudioListener;
module.exports = exports["default"];

},{"./util":41,"./util/Inspector":40}],7:[function(require,module,exports){
(function (global){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x4, _x5, _x6) { var _again = true; _function: while (_again) { var object = _x4, property = _x5, receiver = _x6; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x4 = parent; _x5 = property; _x6 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var _util = require("./util");

var util = _interopRequireWildcard(_util);

var _utilEnumerator = require("./util/Enumerator");

var _utilEnumerator2 = _interopRequireDefault(_utilEnumerator);

var _EventTarget2 = require("./EventTarget");

var _EventTarget3 = _interopRequireDefault(_EventTarget2);

var AudioNode = (function (_EventTarget) {
  function AudioNode(admission, spec) {
    _classCallCheck(this, AudioNode);

    _get(Object.getPrototypeOf(AudioNode.prototype), "constructor", this).call(this);

    util.immigration.check(admission, function () {
      throw new TypeError("Illegal constructor");
    });

    this._.context = spec.context;
    this._.name = util.defaults(spec.name, "AudioNode");
    this._.numberOfInputs = util.defaults(spec.numberOfInputs, 1);
    this._.numberOfOutputs = util.defaults(spec.numberOfOutputs, 1);
    this._.channelCount = util.defaults(spec.channelCount, 2);
    this._.channelCountMode = util.defaults(spec.channelCountMode, "max");
    this._.channelInterpretation = util.defaults(spec.channelInterpretation, "speakers");
    this._.JSONKeys = [];
    this._.inputs = [];
    this._.outputs = [];
    this._.tick = -1;
  }

  _inherits(AudioNode, _EventTarget);

  _createClass(AudioNode, [{
    key: "connect",
    value: function connect(destination) {
      var _this = this;

      var output = arguments[1] === undefined ? 0 : arguments[1];
      var input = arguments[2] === undefined ? 0 : arguments[2];

      this._.inspector.describe("connect", function (assert) {
        assert(util.isInstanceOf(destination, global.AudioNode) || util.isInstanceOf(destination, global.AudioParam), function (fmt) {
          throw new TypeError(fmt.plain(_taggedTemplateLiteral(["\n          ", ";\n          ", "\n        "], ["\n          ", ";\n          ", "\n        "]), fmt.form, fmt.butGot(destination, "destination", "AudioNode or an AudioParam")));
        });

        assert(_this.$context === destination.$context, function (fmt) {
          throw new TypeError(fmt.plain(_taggedTemplateLiteral(["\n          ", ";\n          cannot connect to a destination belonging to a different audio context\n        "], ["\n          ", ";\n          cannot connect to a destination belonging to a different audio context\n        "]), fmt.form));
        });

        assert(util.isPositiveInteger(output), function (fmt) {
          throw new TypeError(fmt.plain(_taggedTemplateLiteral(["\n          ", ";\n          ", "\n        "], ["\n          ", ";\n          ", "\n        "]), fmt.form, fmt.butGot(output, "output", "positive integer")));
        });

        assert(util.isPositiveInteger(input), function (fmt) {
          throw new TypeError(fmt.plain(_taggedTemplateLiteral(["\n          ", ";\n          ", "\n        "], ["\n          ", ";\n          ", "\n        "]), fmt.form, fmt.butGot(input, "input", "positive integer")));
        });

        assert(output < _this.numberOfOutputs, function (fmt) {
          throw new TypeError(fmt.plain(_taggedTemplateLiteral(["\n          ", ";\n          output index (", ") exceeds number of outputs (", ")\n        "], ["\n          ", ";\n          output index (", ") exceeds number of outputs (", ")\n        "]), fmt.form, output, _this.numberOfOutputs));
        });

        assert(input < (destination.numberOfInputs || 1), function (fmt) {
          throw new TypeError(fmt.plain(_taggedTemplateLiteral(["\n          ", ";\n          input index (", ") exceeds number of inputs (", ")\n        "], ["\n          ", ";\n          input index (", ") exceeds number of inputs (", ")\n        "]), fmt.form, input, destination.numberOfInputs || 1));
        });
      });

      var index = this._.outputs.indexOf(destination);

      if (index === -1) {
        this._.outputs.push(destination);
        destination.$inputs.push(this);
      }
    }
  }, {
    key: "disconnect",
    value: function disconnect() {
      var _this2 = this;

      var output = arguments[0] === undefined ? 0 : arguments[0];

      this._.inspector.describe("disconnect", function (assert) {
        assert(util.isPositiveInteger(output), function (fmt) {
          throw new TypeError(fmt.plain(_taggedTemplateLiteral(["\n          ", ";\n          ", "\n        "], ["\n          ", ";\n          ", "\n        "]), fmt.form, fmt.butGot(output, "output", "positive integer")));
        });

        assert(output < _this2.numberOfOutputs, function (fmt) {
          throw new TypeError(fmt.plain(_taggedTemplateLiteral(["\n          ", ";\n          output index (", ") exceeds number of outputs (", ")\n        "], ["\n          ", ";\n          output index (", ") exceeds number of outputs (", ")\n        "]), fmt.form, output, _this2.numberOfOutputs));
        });
      });

      this._.outputs.splice(0).forEach(function (dst) {
        var index = dst.$inputs.indexOf(_this2);
        if (index !== -1) {
          dst.$inputs.splice(index, 1);
        }
      });
    }
  }, {
    key: "toJSON",
    value: function toJSON(memo) {
      function toJSON(obj, memo) {
        if (obj && typeof obj.toJSON === "function") {
          return obj.toJSON(memo);
        }
        return obj;
      }

      return util.toJSON(this, function (node, memo) {
        var json = {};

        json.name = util.name(node);

        node._.JSONKeys.forEach(function (key) {
          json[key] = toJSON(node[key], memo);
        });

        if (node.$context.VERBOSE_JSON) {
          json.numberOfInputs = node.numberOfInputs;
          json.numberOfOutputs = node.numberOfOutputs;
          json.channelCount = node.channelCount;
          json.channelCountMode = node.channelCountMode;
          json.channelInterpretation = node.channelInterpretation;
        }

        json.inputs = node.$inputs.map(function (node) {
          return node.toJSON(memo);
        });

        return json;
      }, memo);
    }
  }, {
    key: "$process",
    value: function $process(inNumSamples, tick) {
      var _this3 = this;

      if (this._.tick !== tick) {
        this._.tick = tick;
        this.$inputs.forEach(function (src) {
          src.$process(inNumSamples, tick);
        });
        Object.keys(this._).forEach(function (key) {
          if (_this3[key] instanceof global.AudioParam) {
            _this3[key].$process(inNumSamples, tick);
          }
        });
        if (this._process) {
          this._process(inNumSamples);
        }
      }
    }
  }, {
    key: "context",
    get: function get() {
      return this._.context;
    },
    set: function set(value) {
      this._.inspector.describe("context", function (assert) {
        assert.throwReadOnlyTypeError(value);
      });
    }
  }, {
    key: "numberOfInputs",
    get: function get() {
      return this._.numberOfInputs;
    },
    set: function set(value) {
      this._.inspector.describe("numberOfInputs", function (assert) {
        assert.throwReadOnlyTypeError(value);
      });
    }
  }, {
    key: "numberOfOutputs",
    get: function get() {
      return this._.numberOfOutputs;
    },
    set: function set(value) {
      this._.inspector.describe("numberOfOutputs", function (assert) {
        assert.throwReadOnlyTypeError(value);
      });
    }
  }, {
    key: "channelCount",
    get: function get() {
      return this._.channelCount;
    },
    set: function set(value) {
      this._.inspector.describe("channelCount", function (assert) {
        assert(util.isPositiveInteger(value), function (fmt) {
          throw new TypeError(fmt.plain(_taggedTemplateLiteral(["\n          ", ";\n          ", "\n        "], ["\n          ", ";\n          ", "\n        "]), fmt.form, fmt.butGot(value, "channelCount", "positive integer")));
        });
      });

      this._.channelCount = value;
    }
  }, {
    key: "channelCountMode",
    get: function get() {
      return this._.channelCountMode;
    },
    set: function set(value) {
      this._.inspector.describe("channelCountMode", function (assert) {
        var enumChannelCountMode = new _utilEnumerator2["default"](["max", "clamped-max", "explicit"]);

        assert(enumChannelCountMode.contains(value), function (fmt) {
          throw new TypeError(fmt.plain(_taggedTemplateLiteral(["\n          ", ";\n          ", "\n        "], ["\n          ", ";\n          ", "\n        "]), fmt.form, fmt.butGot(value, "channelCountMode", enumChannelCountMode.toString())));
        });
      });

      this._.channelCountMode = value;
    }
  }, {
    key: "channelInterpretation",
    get: function get() {
      return this._.channelInterpretation;
    },
    set: function set(value) {
      this._.inspector.describe("channelInterpretation", function (assert) {
        var enumChannelInterpretation = new _utilEnumerator2["default"](["speakers", "discrete"]);

        assert(enumChannelInterpretation.contains(value), function (fmt) {
          throw new TypeError(fmt.plain(_taggedTemplateLiteral(["\n          ", ";\n          ", "\n        "], ["\n          ", ";\n          ", "\n        "]), fmt.form, fmt.butGot(value, "channelInterpretation", enumChannelInterpretation.toString())));
        });
      });

      this._.channelInterpretation = value;
    }
  }, {
    key: "$name",
    get: function get() {
      return this._.name;
    }
  }, {
    key: "$context",
    get: function get() {
      return this._.context;
    }
  }, {
    key: "$inputs",
    get: function get() {
      return this._.inputs;
    }
  }]);

  return AudioNode;
})(_EventTarget3["default"]);

exports["default"] = AudioNode;
module.exports = exports["default"];

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./EventTarget":18,"./util":41,"./util/Enumerator":37}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var _util = require("./util");

var util = _interopRequireWildcard(_util);

var _utilInspector = require("./util/Inspector");

var _utilInspector2 = _interopRequireDefault(_utilInspector);

function insertEvent(_this, event) {
  var time = event.time;
  var events = _this.$events;
  var replace = 0;
  var i = undefined,
      imax = events.length;

  for (i = 0; i < imax; ++i) {
    if (events[i].time === time && events[i].type === event.type) {
      replace = 1;
      break;
    }

    if (events[i].time > time) {
      break;
    }
  }

  events.splice(i, replace, event);
}

function linTo(v, v0, v1, t, t0, t1) {
  var dt = (t - t0) / (t1 - t0);
  return (1 - dt) * v0 + dt * v1;
}

function expTo(v, v0, v1, t, t0, t1) {
  var dt = (t - t0) / (t1 - t0);
  return 0 < v0 && 0 < v1 ? v0 * Math.pow(v1 / v0, dt) : v;
}

function setTarget(v0, v1, t, t0, timeConstant) {
  return v1 + (v0 - v1) * Math.exp((t0 - t) / timeConstant);
}

function setCurveValue(v, t, t0, t1, curve) {
  var dt = (t - t0) / (t1 - t0);

  if (dt <= 0) {
    return util.defaults(curve[0], v);
  }

  if (1 <= dt) {
    return util.defaults(curve[curve.length - 1], v);
  }

  return util.defaults(curve[curve.length * dt | 0], v);
}

var AudioParam = (function () {
  function AudioParam(admission, node, name, defaultValue, minValue, maxValue) {
    _classCallCheck(this, AudioParam);

    util.immigration.check(admission, function () {
      throw new TypeError("Illegal constructor");
    });

    Object.defineProperty(this, "_", {
      value: {
        inspector: new _utilInspector2["default"](this)
      }
    });

    this._.value = defaultValue;
    this._.name = name;
    this._.defaultValue = defaultValue;
    this._.minValue = minValue;
    this._.maxValue = maxValue;
    this._.context = node.context;
    this._.node = node;
    this._.inputs = [];
    this._.events = [];
    this._.tick = -1;
  }

  _createClass(AudioParam, [{
    key: "setValueAtTime",
    value: function setValueAtTime(value, startTime) {
      this._.inspector.describe("setValueAtTime", function (assert) {
        assert(util.isNumber(value), function (fmt) {
          throw new TypeError(fmt.plain(_taggedTemplateLiteral(["\n          ", ";\n          ", "\n        "], ["\n          ", ";\n          ", "\n        "]), fmt.form, fmt.butGot(value, "value", "number")));
        });

        assert(util.isNumber(startTime), function (fmt) {
          throw new TypeError(fmt.plain(_taggedTemplateLiteral(["\n          ", ";\n          ", "\n        "], ["\n          ", ";\n          ", "\n        "]), fmt.form, fmt.butGot(startTime, "startTime", "number")));
        });
      });

      insertEvent(this, {
        type: "SetValue",
        value: value,
        time: startTime
      });
    }
  }, {
    key: "linearRampToValueAtTime",
    value: function linearRampToValueAtTime(value, endTime) {
      this._.inspector.describe("linearRampToValueAtTime", function (assert) {
        assert(util.isNumber(value), function (fmt) {
          throw new TypeError(fmt.plain(_taggedTemplateLiteral(["\n          ", ";\n          ", "\n        "], ["\n          ", ";\n          ", "\n        "]), fmt.form, fmt.butGot(value, "value", "number")));
        });

        assert(util.isNumber(endTime), function (fmt) {
          throw new TypeError(fmt.plain(_taggedTemplateLiteral(["\n          ", ";\n          ", "\n        "], ["\n          ", ";\n          ", "\n        "]), fmt.form, fmt.butGot(endTime, "endTime", "number")));
        });
      });

      insertEvent(this, {
        type: "LinearRampToValue",
        value: value,
        time: endTime
      });
    }
  }, {
    key: "exponentialRampToValueAtTime",
    value: function exponentialRampToValueAtTime(value, endTime) {
      this._.inspector.describe("exponentialRampToValueAtTime", function (assert) {
        assert(util.isNumber(value), function (fmt) {
          throw new TypeError(fmt.plain(_taggedTemplateLiteral(["\n          ", ";\n          ", "\n        "], ["\n          ", ";\n          ", "\n        "]), fmt.form, fmt.butGot(value, "value", "number")));
        });

        assert(util.isNumber(endTime), function (fmt) {
          throw new TypeError(fmt.plain(_taggedTemplateLiteral(["\n          ", ";\n          ", "\n        "], ["\n          ", ";\n          ", "\n        "]), fmt.form, fmt.butGot(endTime, "endTime", "number")));
        });
      });

      insertEvent(this, {
        type: "ExponentialRampToValue",
        value: value,
        time: endTime
      });
    }
  }, {
    key: "setTargetAtTime",
    value: function setTargetAtTime(target, startTime, timeConstant) {
      this._.inspector.describe("setTargetAtTime", function (assert) {
        assert(util.isNumber(target), function (fmt) {
          throw new TypeError(fmt.plain(_taggedTemplateLiteral(["\n          ", ";\n          ", "\n        "], ["\n          ", ";\n          ", "\n        "]), fmt.form, fmt.butGot(target, "target", "number")));
        });

        assert(util.isNumber(startTime), function (fmt) {
          throw new TypeError(fmt.plain(_taggedTemplateLiteral(["\n          ", ";\n          ", "\n        "], ["\n          ", ";\n          ", "\n        "]), fmt.form, fmt.butGot(startTime, "startTime", "number")));
        });

        assert(util.isNumber(timeConstant), function (fmt) {
          throw new TypeError(fmt.plain(_taggedTemplateLiteral(["\n          ", ";\n          ", "\n        "], ["\n          ", ";\n          ", "\n        "]), fmt.form, fmt.butGot(timeConstant, "timeConstant", "number")));
        });
      });

      insertEvent(this, {
        type: "SetTarget",
        value: target,
        time: startTime,
        timeConstant: timeConstant
      });
    }
  }, {
    key: "setValueCurveAtTime",
    value: function setValueCurveAtTime(values, startTime, duration) {
      this._.inspector.describe("setValueCurveAtTime", function (assert) {
        assert(util.isInstanceOf(values, Float32Array), function (fmt) {
          throw new TypeError(fmt.plain(_taggedTemplateLiteral(["\n          ", ";\n          ", "\n        "], ["\n          ", ";\n          ", "\n        "]), fmt.form, fmt.butGot(values, "values", "Float32Array")));
        });

        assert(util.isNumber(startTime), function (fmt) {
          throw new TypeError(fmt.plain(_taggedTemplateLiteral(["\n          ", ";\n          ", "\n        "], ["\n          ", ";\n          ", "\n        "]), fmt.form, fmt.butGot(startTime, "startTime", "number")));
        });

        assert(util.isNumber(duration), function (fmt) {
          throw new TypeError(fmt.plain(_taggedTemplateLiteral(["\n          ", ";\n          ", "\n        "], ["\n          ", ";\n          ", "\n        "]), fmt.form, fmt.butGot(duration, "duration", "number")));
        });
      });

      insertEvent(this, {
        type: "SetValueCurve",
        time: startTime,
        duration: duration,
        curve: values
      });
    }
  }, {
    key: "cancelScheduledValues",
    value: function cancelScheduledValues(startTime) {
      this._.inspector.describe("cancelScheduledValues", function (assert) {
        assert(util.isNumber(startTime), function (fmt) {
          throw new TypeError(fmt.plain(_taggedTemplateLiteral(["\n          ", ";\n          ", "\n        "], ["\n          ", ";\n          ", "\n        "]), fmt.form, fmt.butGot(startTime, "startTime", "number")));
        });
      });

      var events = this.$events;

      for (var i = 0, imax = events.length; i < imax; ++i) {
        if (events[i].time >= startTime) {
          return events.splice(i);
        }
      }
    }
  }, {
    key: "toJSON",
    value: function toJSON(memo) {
      return util.toJSON(this, function (node, memo) {
        var json = {};

        json.value = node.value;

        json.inputs = node.$inputs.map(function (node) {
          return node.toJSON(memo);
        });

        return json;
      }, memo);
    }
  }, {
    key: "$valueAtTime",
    value: function $valueAtTime(time) {
      time = util.toSeconds(time);

      var value = this._.value;
      var events = this.$events;
      var t0 = undefined;

      for (var i = 0; i < events.length; i++) {
        var e0 = events[i];
        var e1 = events[i + 1];

        if (time < e0.time) {
          break;
        }
        t0 = Math.min(time, e1 ? e1.time : time);

        if (e1 && e1.type === "LinearRampToValue") {
          value = linTo(value, e0.value, e1.value, t0, e0.time, e1.time);
        } else if (e1 && e1.type === "ExponentialRampToValue") {
          value = expTo(value, e0.value, e1.value, t0, e0.time, e1.time);
        } else {
          switch (e0.type) {
            case "SetValue":
            case "LinearRampToValue":
            case "ExponentialRampToValue":
              value = e0.value;
              break;
            case "SetTarget":
              value = setTarget(value, e0.value, t0, e0.time, e0.timeConstant);
              break;
            case "SetValueCurve":
              value = setCurveValue(value, t0, e0.time, e0.time + e0.duration, e0.curve);
              break;
          }
        }
      }

      return value;
    }
  }, {
    key: "$process",
    value: function $process(inNumSamples, tick) {
      if (this._.tick !== tick) {
        this._.tick = tick;
        this.$inputs.forEach(function (src) {
          src.$process(inNumSamples, tick);
        });
      }
    }
  }, {
    key: "value",
    get: function get() {
      this._.value = this.$valueAtTime(this.$context.currentTime);
      return this._.value;
    },
    set: function set(value) {
      this._.inspector.describe("value", function (assert) {
        assert(util.isNumber(value), function (fmt) {
          throw new TypeError(fmt.plain(_taggedTemplateLiteral(["\n          ", ";\n          ", "\n        "], ["\n          ", ";\n          ", "\n        "]), fmt.form, fmt.butGot(value, "value", "number")));
        });
      });

      this._.value = value;
    }
  }, {
    key: "name",
    get: function get() {
      return this._.name;
    },
    set: function set(value) {
      this._.inspector.describe("name", function (assert) {
        assert.throwReadOnlyTypeError(value);
      });
    }
  }, {
    key: "defaultValue",
    get: function get() {
      return this._.defaultValue;
    },
    set: function set(value) {
      this._.inspector.describe("defaultValue", function (assert) {
        assert.throwReadOnlyTypeError(value);
      });
    }
  }, {
    key: "$name",
    get: function get() {
      return "AudioParam";
    }
  }, {
    key: "$context",
    get: function get() {
      return this._.context;
    }
  }, {
    key: "$node",
    get: function get() {
      return this._.node;
    }
  }, {
    key: "$inputs",
    get: function get() {
      return this._.inputs;
    }
  }, {
    key: "$events",
    get: function get() {
      return this._.events;
    }
  }]);

  return AudioParam;
})();

exports["default"] = AudioParam;
module.exports = exports["default"];

},{"./util":41,"./util/Inspector":40}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _util = require("./util");

var util = _interopRequireWildcard(_util);

var _Event2 = require("./Event");

var _Event3 = _interopRequireDefault(_Event2);

var AudioProcessingEvent = (function (_Event) {
  function AudioProcessingEvent(admission, node) {
    _classCallCheck(this, AudioProcessingEvent);

    _get(Object.getPrototypeOf(AudioProcessingEvent.prototype), "constructor", this).call(this, "audioprocess", node);

    util.immigration.check(admission, function () {
      throw new TypeError("Illegal constructor");
    });

    this._.node = node;
  }

  _inherits(AudioProcessingEvent, _Event);

  _createClass(AudioProcessingEvent, [{
    key: "$name",
    get: function get() {
      return "AudioProcessingEvent";
    }
  }, {
    key: "$node",
    get: function get() {
      return this._.node;
    }
  }]);

  return AudioProcessingEvent;
})(_Event3["default"]);

exports["default"] = AudioProcessingEvent;
module.exports = exports["default"];

},{"./Event":17,"./util":41}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var _util = require("./util");

var util = _interopRequireWildcard(_util);

var _utilEnumerator = require("./util/Enumerator");

var _utilEnumerator2 = _interopRequireDefault(_utilEnumerator);

var _AudioNode2 = require("./AudioNode");

var _AudioNode3 = _interopRequireDefault(_AudioNode2);

var _AudioParam = require("./AudioParam");

var _AudioParam2 = _interopRequireDefault(_AudioParam);

var BiquadFilterNode = (function (_AudioNode) {
  function BiquadFilterNode(admission, context) {
    var _this = this;

    _classCallCheck(this, BiquadFilterNode);

    _get(Object.getPrototypeOf(BiquadFilterNode.prototype), "constructor", this).call(this, admission, {
      name: "BiquadFilterNode",
      context: context,
      numberOfInputs: 1,
      numberOfOutputs: 1,
      channelCount: 2,
      channelCountMode: "max",
      channelInterpretation: "speakers"
    });

    this._.type = "lowpass";
    this._.frequency = util.immigration.apply(function (admission) {
      return new _AudioParam2["default"](admission, _this, "frequency", 350, 10, context.sampleRate / 2);
    });
    this._.detune = util.immigration.apply(function (admission) {
      return new _AudioParam2["default"](admission, _this, "detune", 0, -4800, 4800);
    });
    this._.Q = util.immigration.apply(function (admission) {
      return new _AudioParam2["default"](admission, _this, "Q", 1, 0.0001, 1000);
    });
    this._.gain = util.immigration.apply(function (admission) {
      return new _AudioParam2["default"](admission, _this, "gain", 0, -40, 40);
    });
    this._.JSONKeys = BiquadFilterNode.$JSONKeys.slice();
  }

  _inherits(BiquadFilterNode, _AudioNode);

  _createClass(BiquadFilterNode, [{
    key: "getFrequencyResponse",
    value: function getFrequencyResponse(frequencyHz, magResponse, phaseResponse) {
      this._.inspector.describe("getFrequencyResponse", function (assert) {
        assert(util.isInstanceOf(frequencyHz, Float32Array), function (fmt) {
          throw new TypeError(fmt.plain(_taggedTemplateLiteral(["\n          ", ";\n          ", "\n        "], ["\n          ", ";\n          ", "\n        "]), fmt.form, fmt.butGot(frequencyHz, "frequencyHz", "Float32Array")));
        });

        assert(util.isInstanceOf(magResponse, Float32Array), function (fmt) {
          throw new TypeError(fmt.plain(_taggedTemplateLiteral(["\n          ", ";\n          ", "\n        "], ["\n          ", ";\n          ", "\n        "]), fmt.form, fmt.butGot(magResponse, "magResponse", "Float32Array")));
        });

        assert(util.isInstanceOf(phaseResponse, Float32Array), function (fmt) {
          throw new TypeError(fmt.plain(_taggedTemplateLiteral(["\n          ", ";\n          ", "\n        "], ["\n          ", ";\n          ", "\n        "]), fmt.form, fmt.butGot(phaseResponse, "phaseResponse", "Float32Array")));
        });
      });
    }
  }, {
    key: "type",
    get: function get() {
      return this._.type;
    },
    set: function set(value) {
      this._.inspector.describe("type", function (assert) {
        var enumBiquadFilterType = new _utilEnumerator2["default"](["lowpass", "highpass", "bandpass", "lowshelf", "highshelf", "peaking", "notch", "allpass"]);

        assert(enumBiquadFilterType.contains(value), function (fmt) {
          throw new TypeError(fmt.plain(_taggedTemplateLiteral(["\n          ", ";\n          ", "\n        "], ["\n          ", ";\n          ", "\n        "]), fmt.form, fmt.butGot(value, "type", enumBiquadFilterType.toString())));
        });
      });

      this._.type = value;
    }
  }, {
    key: "frequency",
    get: function get() {
      return this._.frequency;
    },
    set: function set(value) {
      this._.inspector.describe("frequency", function (assert) {
        assert.throwReadOnlyTypeError(value);
      });
    }
  }, {
    key: "detune",
    get: function get() {
      return this._.detune;
    },
    set: function set(value) {
      this._.inspector.describe("detune", function (assert) {
        assert.throwReadOnlyTypeError(value);
      });
    }
  }, {
    key: "Q",
    get: function get() {
      return this._.Q;
    },
    set: function set(value) {
      this._.inspector.describe("Q", function (assert) {
        assert.throwReadOnlyTypeError(value);
      });
    }
  }, {
    key: "gain",
    get: function get() {
      return this._.gain;
    },
    set: function set(value) {
      this._.inspector.describe("gain", function (assert) {
        assert.throwReadOnlyTypeError(value);
      });
    }
  }]);

  return BiquadFilterNode;
})(_AudioNode3["default"]);

exports["default"] = BiquadFilterNode;

BiquadFilterNode.$JSONKeys = ["type", "frequency", "detune", "Q", "gain"];
module.exports = exports["default"];

},{"./AudioNode":7,"./AudioParam":8,"./util":41,"./util/Enumerator":37}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var _util = require("./util");

var util = _interopRequireWildcard(_util);

var _AudioNode2 = require("./AudioNode");

var _AudioNode3 = _interopRequireDefault(_AudioNode2);

var ChannelMergerNode = (function (_AudioNode) {
  function ChannelMergerNode(admission, context, numberOfInputs) {
    _classCallCheck(this, ChannelMergerNode);

    _get(Object.getPrototypeOf(ChannelMergerNode.prototype), "constructor", this).call(this, admission, {
      name: "ChannelMergerNode",
      context: context,
      numberOfInputs: numberOfInputs,
      numberOfOutputs: 1,
      channelCount: 2,
      channelCountMode: "max",
      channelInterpretation: "speakers"
    });

    this._.inspector.describe("constructor", function (assert) {
      assert(util.isPositiveInteger(numberOfInputs), function (fmt) {
        throw new TypeError(fmt.plain(_taggedTemplateLiteral(["\n          ", ";\n          ", "\n        "], ["\n          ", ";\n          ", "\n        "]), fmt.form, fmt.butGot(numberOfInputs, "numberOfInputs", "positive integer")));
      });
    });
  }

  _inherits(ChannelMergerNode, _AudioNode);

  return ChannelMergerNode;
})(_AudioNode3["default"]);

exports["default"] = ChannelMergerNode;
module.exports = exports["default"];

},{"./AudioNode":7,"./util":41}],12:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var _util = require("./util");

var util = _interopRequireWildcard(_util);

var _AudioNode2 = require("./AudioNode");

var _AudioNode3 = _interopRequireDefault(_AudioNode2);

var ChannelSplitterNode = (function (_AudioNode) {
  function ChannelSplitterNode(admission, context, numberOfOutputs) {
    _classCallCheck(this, ChannelSplitterNode);

    _get(Object.getPrototypeOf(ChannelSplitterNode.prototype), "constructor", this).call(this, admission, {
      name: "ChannelSplitterNode",
      context: context,
      numberOfInputs: 1,
      numberOfOutputs: numberOfOutputs,
      channelCount: 2,
      channelCountMode: "max",
      channelInterpretation: "speakers"
    });

    this._.inspector.describe("constructor", function (assert) {
      assert(util.isPositiveInteger(numberOfOutputs), function (fmt) {
        throw new TypeError(fmt.plain(_taggedTemplateLiteral(["\n          ", ";\n          ", "\n        "], ["\n          ", ";\n          ", "\n        "]), fmt.form, fmt.butGot(numberOfOutputs, "numberOfOutputs", "positive integer")));
      });
    });
  }

  _inherits(ChannelSplitterNode, _AudioNode);

  return ChannelSplitterNode;
})(_AudioNode3["default"]);

exports["default"] = ChannelSplitterNode;
module.exports = exports["default"];

},{"./AudioNode":7,"./util":41}],13:[function(require,module,exports){
(function (global){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var _util = require("./util");

var util = _interopRequireWildcard(_util);

var _AudioNode2 = require("./AudioNode");

var _AudioNode3 = _interopRequireDefault(_AudioNode2);

var ConvolverNode = (function (_AudioNode) {
  function ConvolverNode(admission, context) {
    _classCallCheck(this, ConvolverNode);

    _get(Object.getPrototypeOf(ConvolverNode.prototype), "constructor", this).call(this, admission, {
      name: "ConvolverNode",
      context: context,
      numberOfInputs: 1,
      numberOfOutputs: 1,
      channelCount: 2,
      channelCountMode: "clamped-max",
      channelInterpretation: "speakers"
    });

    this._.buffer = null;
    this._.normalize = true;
    this._.JSONKeys = ConvolverNode.$JSONKeys.slice();
  }

  _inherits(ConvolverNode, _AudioNode);

  _createClass(ConvolverNode, [{
    key: "buffer",
    get: function get() {
      return this._.buffer;
    },
    set: function set(value) {
      this._.inspector.describe("buffer", function (assert) {
        assert(util.isNullOrInstanceOf(value, global.AudioBuffer), function (fmt) {
          throw new TypeError(fmt.plain(_taggedTemplateLiteral(["\n          ", ";\n          ", "\n        "], ["\n          ", ";\n          ", "\n        "]), fmt.form, fmt.butGot(value, "buffer", "AudioBuffer")));
        });
      });

      this._.buffer = value;
    }
  }, {
    key: "normalize",
    get: function get() {
      return this._.normalize;
    },
    set: function set(value) {
      this._.inspector.describe("normalize", function (assert) {
        assert(util.isBoolean(value), function (fmt) {
          throw new TypeError(fmt.plain(_taggedTemplateLiteral(["\n          ", ";\n          ", "\n        "], ["\n          ", ";\n          ", "\n        "]), fmt.form, fmt.butGot(value, "normalize", "boolean")));
        });
      });

      this._.normalize = value;
    }
  }]);

  return ConvolverNode;
})(_AudioNode3["default"]);

exports["default"] = ConvolverNode;

ConvolverNode.$JSONKeys = ["normalize"];
module.exports = exports["default"];

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./AudioNode":7,"./util":41}],14:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var _util = require("./util");

var util = _interopRequireWildcard(_util);

var _AudioNode2 = require("./AudioNode");

var _AudioNode3 = _interopRequireDefault(_AudioNode2);

var _AudioParam = require("./AudioParam");

var _AudioParam2 = _interopRequireDefault(_AudioParam);

var DelayNode = (function (_AudioNode) {
  function DelayNode(admission, context, maxDelayTime) {
    var _this = this;

    _classCallCheck(this, DelayNode);

    _get(Object.getPrototypeOf(DelayNode.prototype), "constructor", this).call(this, admission, {
      name: "DelayNode",
      context: context,
      numberOfInputs: 1,
      numberOfOutputs: 1,
      channelCount: 2,
      channelCountMode: "max",
      channelInterpretation: "speakers"
    });

    this._.inspector.describe("constructor", function (assert) {
      assert(util.isPositiveNumber(maxDelayTime), function (fmt) {
        throw new TypeError(fmt.plain(_taggedTemplateLiteral(["\n          ", ";\n          ", "\n        "], ["\n          ", ";\n          ", "\n        "]), fmt.form, fmt.butGot(maxDelayTime, "maxDelayTime", "positive number")));
      });
    });

    this._.delayTime = util.immigration.apply(function (admission) {
      return new _AudioParam2["default"](admission, _this, "delayTime", 0, 0, maxDelayTime);
    });
    this._.maxDelayTime = maxDelayTime;
    this._.JSONKeys = DelayNode.$JSONKeys.slice();
  }

  _inherits(DelayNode, _AudioNode);

  _createClass(DelayNode, [{
    key: "delayTime",
    get: function get() {
      return this._.delayTime;
    },
    set: function set(value) {
      this._.inspector.describe("delayTime", function (assert) {
        assert.throwReadOnlyTypeError(value);
      });
    }
  }, {
    key: "$maxDelayTime",
    get: function get() {
      return this._.maxDelayTime;
    }
  }]);

  return DelayNode;
})(_AudioNode3["default"]);

exports["default"] = DelayNode;

DelayNode.$JSONKeys = ["delayTime"];
module.exports = exports["default"];

},{"./AudioNode":7,"./AudioParam":8,"./util":41}],15:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _util = require("./util");

var util = _interopRequireWildcard(_util);

var _AudioNode2 = require("./AudioNode");

var _AudioNode3 = _interopRequireDefault(_AudioNode2);

var _AudioParam = require("./AudioParam");

var _AudioParam2 = _interopRequireDefault(_AudioParam);

var DynamicsCompressorNode = (function (_AudioNode) {
  function DynamicsCompressorNode(admission, context) {
    var _this = this;

    _classCallCheck(this, DynamicsCompressorNode);

    _get(Object.getPrototypeOf(DynamicsCompressorNode.prototype), "constructor", this).call(this, admission, {
      name: "DynamicsCompressorNode",
      context: context,
      numberOfInputs: 1,
      numberOfOutputs: 1,
      channelCount: 2,
      channelCountMode: "explicit",
      channelInterpretation: "speakers"
    });

    this._.threshold = util.immigration.apply(function (admission) {
      return new _AudioParam2["default"](admission, _this, "threshold", -24, -100, 0);
    });
    this._.knee = util.immigration.apply(function (admission) {
      return new _AudioParam2["default"](admission, _this, "knee", 30, 0, 40);
    });
    this._.ratio = util.immigration.apply(function (admission) {
      return new _AudioParam2["default"](admission, _this, "ratio", 12, 1, 20);
    });
    this._.reduction = util.immigration.apply(function (admission) {
      return new _AudioParam2["default"](admission, _this, "reduction", 0, -20, 0);
    });
    this._.attack = util.immigration.apply(function (admission) {
      return new _AudioParam2["default"](admission, _this, "attack", 0.003, 0, 1.0);
    });
    this._.release = util.immigration.apply(function (admission) {
      return new _AudioParam2["default"](admission, _this, "release", 0.250, 0, 1.0);
    });
    this._.JSONKeys = DynamicsCompressorNode.$JSONKeys.slice();
  }

  _inherits(DynamicsCompressorNode, _AudioNode);

  _createClass(DynamicsCompressorNode, [{
    key: "threshold",
    get: function get() {
      return this._.threshold;
    },
    set: function set(value) {
      this._.inspector.describe("threshold", function (assert) {
        assert.throwReadOnlyTypeError(value);
      });
    }
  }, {
    key: "knee",
    get: function get() {
      return this._.knee;
    },
    set: function set(value) {
      this._.inspector.describe("knee", function (assert) {
        assert.throwReadOnlyTypeError(value);
      });
    }
  }, {
    key: "ratio",
    get: function get() {
      return this._.ratio;
    },
    set: function set(value) {
      this._.inspector.describe("ratio", function (assert) {
        assert.throwReadOnlyTypeError(value);
      });
    }
  }, {
    key: "reduction",
    get: function get() {
      return this._.reduction;
    },
    set: function set(value) {
      this._.inspector.describe("reduction", function (assert) {
        assert.throwReadOnlyTypeError(value);
      });
    }
  }, {
    key: "attack",
    get: function get() {
      return this._.attack;
    },
    set: function set(value) {
      this._.inspector.describe("attack", function (assert) {
        assert.throwReadOnlyTypeError(value);
      });
    }
  }, {
    key: "release",
    get: function get() {
      return this._.release;
    },
    set: function set(value) {
      this._.inspector.describe("release", function (assert) {
        assert.throwReadOnlyTypeError(value);
      });
    }
  }]);

  return DynamicsCompressorNode;
})(_AudioNode3["default"]);

exports["default"] = DynamicsCompressorNode;

DynamicsCompressorNode.$JSONKeys = ["threshold", "knee", "ratio", "reduction", "attack", "release"];
module.exports = exports["default"];

},{"./AudioNode":7,"./AudioParam":8,"./util":41}],16:[function(require,module,exports){
(function (global){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _util = require("./util");

var util = _interopRequireWildcard(_util);

var _EventTarget2 = require("./EventTarget");

var _EventTarget3 = _interopRequireDefault(_EventTarget2);

global.Element = global.Element || (function (_EventTarget) {
  function Element() {
    _classCallCheck(this, Element);

    _get(Object.getPrototypeOf(Element.prototype), "constructor", this).call(this);
    throw new TypeError("Illegal constructor");
  }

  _inherits(Element, _EventTarget);

  return Element;
})(_EventTarget3["default"]);

var Element = (function (_util$preventSuperCall) {
  function Element() {
    _classCallCheck(this, Element);

    _get(Object.getPrototypeOf(Element.prototype), "constructor", this).apply(this, arguments);
  }

  _inherits(Element, _util$preventSuperCall);

  return Element;
})(util.preventSuperCall(global.Element));

exports["default"] = Element;
module.exports = exports["default"];

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./EventTarget":18,"./util":41}],17:[function(require,module,exports){
(function (global){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _util = require("./util");

var util = _interopRequireWildcard(_util);

global.Event = global.Event || function Event() {
  _classCallCheck(this, Event);

  throw new TypeError("Illegal constructor");
};

var Event = (function (_util$preventSuperCall) {
  function Event(name, target) {
    _classCallCheck(this, Event);

    _get(Object.getPrototypeOf(Event.prototype), "constructor", this).call(this);

    Object.defineProperty(this, "_", { value: {} });

    this._.type = name;
    this._.target = util.defaults(target, null);
    this._.timeStamp = Date.now();
  }

  _inherits(Event, _util$preventSuperCall);

  _createClass(Event, [{
    key: "type",
    get: function get() {
      return this._.type;
    }
  }, {
    key: "target",
    get: function get() {
      return this._.target;
    }
  }, {
    key: "timestamp",
    get: function get() {
      return this._.timestamp;
    }
  }]);

  return Event;
})(util.preventSuperCall(global.Event));

exports["default"] = Event;
module.exports = exports["default"];

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./util":41}],18:[function(require,module,exports){
(function (global){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var _util = require("./util");

var util = _interopRequireWildcard(_util);

var _utilInspector = require("./util/Inspector");

var _utilInspector2 = _interopRequireDefault(_utilInspector);

global.EventTarget = global.EventTarget || function EventTarget() {
  _classCallCheck(this, EventTarget);

  throw new TypeError("Illegal constructor");
};

var EventTarget = (function (_util$preventSuperCall) {
  function EventTarget() {
    _classCallCheck(this, EventTarget);

    _get(Object.getPrototypeOf(EventTarget.prototype), "constructor", this).call(this);

    Object.defineProperty(this, "_", {
      value: {
        inspector: new _utilInspector2["default"](this)
      }
    });

    this._.listeners = {};
  }

  _inherits(EventTarget, _util$preventSuperCall);

  _createClass(EventTarget, [{
    key: "addEventListener",
    value: function addEventListener(type, listener) {
      this._.inspector.describe("addEventListener", function (assert) {
        assert(util.isString(type), function (fmt) {
          throw new TypeError(fmt.plain(_taggedTemplateLiteral(["\n          ", ";\n          ", "\n        "], ["\n          ", ";\n          ", "\n        "]), fmt.form, fmt.butGot(type, "type", "string")));
        });

        assert(util.isFunction(listener), function (fmt) {
          throw new TypeError(fmt.plain(_taggedTemplateLiteral(["\n          ", ";\n          ", "\n        "], ["\n          ", ";\n          ", "\n        "]), fmt.form, fmt.butGot(listener, "listener", "function")));
        });
      });

      this._.listeners[type] = this._.listeners[type] || [];
      this._.listeners[type].push(listener);
    }
  }, {
    key: "removeEventListener",
    value: function removeEventListener(type, listener) {
      this._.inspector.describe("removeEventListener", function (assert) {
        assert(util.isString(type), function (fmt) {
          throw new TypeError(fmt.plain(_taggedTemplateLiteral(["\n          ", ";\n          ", "\n        "], ["\n          ", ";\n          ", "\n        "]), fmt.form, fmt.butGot(type, "type", "string")));
        });

        assert(util.isFunction(listener), function (fmt) {
          throw new TypeError(fmt.plain(_taggedTemplateLiteral(["\n          ", ";\n          ", "\n        "], ["\n          ", ";\n          ", "\n        "]), fmt.form, fmt.butGot(listener, "listener", "function")));
        });
      });

      this._.listeners[type] = this._.listeners[type] || [];
      var index = this._.listeners[type].indexOf(listener);
      if (index !== -1) {
        this._.listeners[type].splice(index, 1);
      }
    }
  }, {
    key: "dispatchEvent",
    value: function dispatchEvent(event) {
      var _this = this;

      this._.inspector.describe("dispatchEvent", function (assert) {
        assert(util.isInstanceOf(event, global.Event), function (fmt) {
          throw new TypeError(fmt.plain(_taggedTemplateLiteral(["\n          ", ";\n          ", "\n        "], ["\n          ", ";\n          ", "\n        "]), fmt.form, fmt.butGot(event, "event", "Event")));
        });
      });

      var type = event.type;

      if (typeof this["on" + type] === "function") {
        this["on" + type].call(this, event);
      }

      this.$listeners(type).forEach(function (listener) {
        listener.call(_this, event);
      }, this);

      return true;
    }
  }, {
    key: "$listeners",
    value: function $listeners(type) {
      return (this._.listeners[type] || []).slice();
    }
  }]);

  return EventTarget;
})(util.preventSuperCall(global.EventTarget));

exports["default"] = EventTarget;
module.exports = exports["default"];

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./util":41,"./util/Inspector":40}],19:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _util = require("./util");

var util = _interopRequireWildcard(_util);

var _AudioNode2 = require("./AudioNode");

var _AudioNode3 = _interopRequireDefault(_AudioNode2);

var _AudioParam = require("./AudioParam");

var _AudioParam2 = _interopRequireDefault(_AudioParam);

var GainNode = (function (_AudioNode) {
  function GainNode(admission, context) {
    var _this = this;

    _classCallCheck(this, GainNode);

    _get(Object.getPrototypeOf(GainNode.prototype), "constructor", this).call(this, admission, {
      name: "GainNode",
      context: context,
      numberOfInputs: 1,
      numberOfOutputs: 1,
      channelCount: 2,
      channelCountMode: "max",
      channelInterpretation: "speakers"
    });

    this._.gain = util.immigration.apply(function (admission) {
      return new _AudioParam2["default"](admission, _this, "gain", 1.0, 0.0, 1.0);
    });
    this._.JSONKeys = GainNode.$JSONKeys.slice();
  }

  _inherits(GainNode, _AudioNode);

  _createClass(GainNode, [{
    key: "gain",
    get: function get() {
      return this._.gain;
    },
    set: function set(value) {
      this._.inspector.describe("gain", function (assert) {
        assert.throwReadOnlyTypeError(value);
      });
    }
  }]);

  return GainNode;
})(_AudioNode3["default"]);

exports["default"] = GainNode;

GainNode.$JSONKeys = ["gain"];
module.exports = exports["default"];

},{"./AudioNode":7,"./AudioParam":8,"./util":41}],20:[function(require,module,exports){
(function (global){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _util = require("./util");

var util = _interopRequireWildcard(_util);

var _Element2 = require("./Element");

var _Element3 = _interopRequireDefault(_Element2);

global.HTMLElement = global.HTMLElement || (function (_Element) {
  function HTMLElement() {
    _classCallCheck(this, HTMLElement);

    _get(Object.getPrototypeOf(HTMLElement.prototype), "constructor", this).call(this);
    throw new TypeError("Illegal constructor");
  }

  _inherits(HTMLElement, _Element);

  return HTMLElement;
})(_Element3["default"]);

var HTMLElement = (function (_util$preventSuperCall) {
  function HTMLElement() {
    _classCallCheck(this, HTMLElement);

    _get(Object.getPrototypeOf(HTMLElement.prototype), "constructor", this).apply(this, arguments);
  }

  _inherits(HTMLElement, _util$preventSuperCall);

  return HTMLElement;
})(util.preventSuperCall(global.HTMLElement));

exports["default"] = HTMLElement;
module.exports = exports["default"];

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./Element":16,"./util":41}],21:[function(require,module,exports){
(function (global){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _util = require("./util");

var util = _interopRequireWildcard(_util);

var _HTMLElement2 = require("./HTMLElement");

var _HTMLElement3 = _interopRequireDefault(_HTMLElement2);

global.HTMLMediaElement = global.HTMLMediaElement || (function (_HTMLElement) {
  function HTMLMediaElement() {
    _classCallCheck(this, HTMLMediaElement);

    _get(Object.getPrototypeOf(HTMLMediaElement.prototype), "constructor", this).call(this);
    throw new TypeError("Illegal constructor");
  }

  _inherits(HTMLMediaElement, _HTMLElement);

  return HTMLMediaElement;
})(_HTMLElement3["default"]);

var HTMLMediaElement = (function (_util$preventSuperCall) {
  function HTMLMediaElement() {
    _classCallCheck(this, HTMLMediaElement);

    _get(Object.getPrototypeOf(HTMLMediaElement.prototype), "constructor", this).apply(this, arguments);
  }

  _inherits(HTMLMediaElement, _util$preventSuperCall);

  return HTMLMediaElement;
})(util.preventSuperCall(global.HTMLMediaElement));

exports["default"] = HTMLMediaElement;
module.exports = exports["default"];

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./HTMLElement":20,"./util":41}],22:[function(require,module,exports){
(function (global){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var _util = require("./util");

var util = _interopRequireWildcard(_util);

var _AudioNode2 = require("./AudioNode");

var _AudioNode3 = _interopRequireDefault(_AudioNode2);

var MediaElementAudioSourceNode = (function (_AudioNode) {
  function MediaElementAudioSourceNode(admission, context, mediaElement) {
    _classCallCheck(this, MediaElementAudioSourceNode);

    _get(Object.getPrototypeOf(MediaElementAudioSourceNode.prototype), "constructor", this).call(this, admission, {
      name: "MediaElementAudioSourceNode",
      context: context,
      numberOfInputs: 0,
      numberOfOutputs: 1,
      channelCount: 2,
      channelCountMode: "max",
      channelInterpretation: "speakers"
    });

    this._.inspector.describe("constructor", function (assert) {
      assert(util.isInstanceOf(mediaElement, global.HTMLMediaElement), function (fmt) {
        throw new TypeError(fmt.plain(_taggedTemplateLiteral(["\n          ", ";\n          ", "\n        "], ["\n          ", ";\n          ", "\n        "]), fmt.form, fmt.butGot(mediaElement, "mediaElement", "HTMLMediaElement")));
      });
    });
  }

  _inherits(MediaElementAudioSourceNode, _AudioNode);

  return MediaElementAudioSourceNode;
})(_AudioNode3["default"]);

exports["default"] = MediaElementAudioSourceNode;
module.exports = exports["default"];

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./AudioNode":7,"./util":41}],23:[function(require,module,exports){
(function (global){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _util = require("./util");

var util = _interopRequireWildcard(_util);

var _EventTarget2 = require("./EventTarget");

var _EventTarget3 = _interopRequireDefault(_EventTarget2);

global.MediaStream = global.MediaStream || (function (_EventTarget) {
  function MediaStream() {
    _classCallCheck(this, MediaStream);

    _get(Object.getPrototypeOf(MediaStream.prototype), "constructor", this).call(this);
    throw new TypeError("Illegal constructor");
  }

  _inherits(MediaStream, _EventTarget);

  return MediaStream;
})(_EventTarget3["default"]);

var MediaStream = (function (_util$preventSuperCall) {
  function MediaStream() {
    _classCallCheck(this, MediaStream);

    _get(Object.getPrototypeOf(MediaStream.prototype), "constructor", this).apply(this, arguments);
  }

  _inherits(MediaStream, _util$preventSuperCall);

  return MediaStream;
})(util.preventSuperCall(global.MediaStream));

exports["default"] = MediaStream;
module.exports = exports["default"];

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./EventTarget":18,"./util":41}],24:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _AudioNode2 = require("./AudioNode");

var _AudioNode3 = _interopRequireDefault(_AudioNode2);

var MediaStreamAudioDestinationNode = (function (_AudioNode) {
  function MediaStreamAudioDestinationNode(admission, context) {
    _classCallCheck(this, MediaStreamAudioDestinationNode);

    _get(Object.getPrototypeOf(MediaStreamAudioDestinationNode.prototype), "constructor", this).call(this, admission, {
      name: "MediaStreamAudioDestinationNode",
      context: context,
      numberOfInputs: 1,
      numberOfOutputs: 0,
      channelCount: 2,
      channelCountMode: "explicit",
      channelInterpretation: "speakers"
    });
  }

  _inherits(MediaStreamAudioDestinationNode, _AudioNode);

  return MediaStreamAudioDestinationNode;
})(_AudioNode3["default"]);

exports["default"] = MediaStreamAudioDestinationNode;
module.exports = exports["default"];

},{"./AudioNode":7}],25:[function(require,module,exports){
(function (global){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var _util = require("./util");

var util = _interopRequireWildcard(_util);

var _AudioNode2 = require("./AudioNode");

var _AudioNode3 = _interopRequireDefault(_AudioNode2);

var MediaStreamAudioSourceNode = (function (_AudioNode) {
  function MediaStreamAudioSourceNode(admission, context, mediaStream) {
    _classCallCheck(this, MediaStreamAudioSourceNode);

    _get(Object.getPrototypeOf(MediaStreamAudioSourceNode.prototype), "constructor", this).call(this, admission, {
      name: "MediaStreamAudioSourceNode",
      context: context,
      numberOfInputs: 0,
      numberOfOutputs: 1,
      channelCount: 2,
      channelCountMode: "max",
      channelInterpretation: "speakers"
    });

    this._.inspector.describe("constructor", function (assert) {
      assert(util.isInstanceOf(mediaStream, global.MediaStream), function (fmt) {
        throw new TypeError(fmt.plain(_taggedTemplateLiteral(["\n          ", ";\n          ", "\n        "], ["\n          ", ";\n          ", "\n        "]), fmt.form, fmt.butGot(mediaStream, "mediaStream", "MediaStream")));
      });
    });
  }

  _inherits(MediaStreamAudioSourceNode, _AudioNode);

  return MediaStreamAudioSourceNode;
})(_AudioNode3["default"]);

exports["default"] = MediaStreamAudioSourceNode;
module.exports = exports["default"];

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./AudioNode":7,"./util":41}],26:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _util = require("./util");

var util = _interopRequireWildcard(_util);

var _Event2 = require("./Event");

var _Event3 = _interopRequireDefault(_Event2);

var OfflineAudioCompletionEvent = (function (_Event) {
  function OfflineAudioCompletionEvent(admission, node) {
    _classCallCheck(this, OfflineAudioCompletionEvent);

    _get(Object.getPrototypeOf(OfflineAudioCompletionEvent.prototype), "constructor", this).call(this, "complete", node);

    util.immigration.check(admission, function () {
      throw new TypeError("Illegal constructor");
    });

    this._.node = node;
  }

  _inherits(OfflineAudioCompletionEvent, _Event);

  _createClass(OfflineAudioCompletionEvent, [{
    key: "$name",
    get: function get() {
      return "OfflineAudioCompletionEvent";
    }
  }, {
    key: "$node",
    get: function get() {
      return this._.node;
    }
  }]);

  return OfflineAudioCompletionEvent;
})(_Event3["default"]);

exports["default"] = OfflineAudioCompletionEvent;
module.exports = exports["default"];

},{"./Event":17,"./util":41}],27:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var _util = require("./util");

var util = _interopRequireWildcard(_util);

var _AudioContext2 = require("./AudioContext");

var _AudioContext3 = _interopRequireDefault(_AudioContext2);

var _AudioBuffer = require("./AudioBuffer");

var _AudioBuffer2 = _interopRequireDefault(_AudioBuffer);

var _OfflineAudioCompletionEvent = require("./OfflineAudioCompletionEvent");

var _OfflineAudioCompletionEvent2 = _interopRequireDefault(_OfflineAudioCompletionEvent);

var OfflineAudioContext = (function (_AudioContext) {
  function OfflineAudioContext(numberOfChannels, length, sampleRate) {
    _classCallCheck(this, OfflineAudioContext);

    _get(Object.getPrototypeOf(OfflineAudioContext.prototype), "constructor", this).call(this);

    this._.inspector.describe("constructor", function (assert) {
      assert(util.isPositiveInteger(numberOfChannels), function (fmt) {
        throw new TypeError(fmt.plain(_taggedTemplateLiteral(["\n          ", ";\n          ", "\n        "], ["\n          ", ";\n          ", "\n        "]), fmt.form, fmt.butGot(numberOfChannels, "numberOfChannels", "positive integer")));
      });

      assert(util.isPositiveInteger(length), function (fmt) {
        throw new TypeError(fmt.plain(_taggedTemplateLiteral(["\n          ", ";\n          ", "\n        "], ["\n          ", ";\n          ", "\n        "]), fmt.form, fmt.butGot(length, "length", "positive integer")));
      });

      assert(util.isPositiveInteger(sampleRate), function (fmt) {
        throw new TypeError(fmt.plain(_taggedTemplateLiteral(["\n          ", ";\n          ", "\n        "], ["\n          ", ";\n          ", "\n        "]), fmt.form, fmt.butGot(sampleRate, "sampleRate", "positive integer")));
      });
    });

    this._.sampleRate = sampleRate;
    this._.oncomplete = null;
    this._.numberOfChannels = numberOfChannels;
    this._.length = length;
    this._.rendering = false;
  }

  _inherits(OfflineAudioContext, _AudioContext);

  _createClass(OfflineAudioContext, [{
    key: "startRendering",
    value: function startRendering() {
      var _this = this;

      this._.inspector.describe("startRendering", function (assert) {
        assert(!_this._.rendering, function (fmt) {
          throw new Error(fmt.plain(_taggedTemplateLiteral(["\n          ", ";\n          must only be called one time\n        "], ["\n          ", ";\n          must only be called one time\n        "]), fmt.form));
        });
      });

      this._.rendering = true;
    }
  }, {
    key: "_process",
    value: function _process(microseconds) {
      var _this2 = this;

      if (!this._.rendering || this._.length <= this._.processedSamples) {
        return;
      }

      var nextMicroCurrentTime = this._.microCurrentTime + microseconds;

      while (this._.microCurrentTime < nextMicroCurrentTime) {
        var _nextMicroCurrentTime = Math.min(this._.microCurrentTime + 1000, nextMicroCurrentTime);
        var _nextProcessedSamples = Math.floor(_nextMicroCurrentTime / (1000 * 1000) * this.sampleRate);
        var inNumSamples = _nextProcessedSamples - this._.processedSamples;

        this.destination.$process(inNumSamples, ++this._.tick);

        this._.microCurrentTime = _nextMicroCurrentTime;
        this._.processedSamples = _nextProcessedSamples;

        if (this._.length <= this._.processedSamples) {
          break;
        }
      }

      if (this._.length <= this._.processedSamples) {
        var _event = util.immigration.apply(function (admission) {
          return new _OfflineAudioCompletionEvent2["default"](admission, _this2);
        });

        _event.renderedBuffer = util.immigration.apply(function (admission) {
          return new _AudioBuffer2["default"](admission, _this2, _this2._.numberOfChannels, _this2._.length, _this2.sampleRate);
        });

        this.dispatchEvent(_event);
      }
    }
  }, {
    key: "oncomplete",
    get: function get() {
      return this._.oncomplete;
    },
    set: function set(value) {
      this._.inspector.describe("oncomplete", function (assert) {
        assert(util.isNullOrFunction(value), function (fmt) {
          throw new TypeError(fmt.plain(_taggedTemplateLiteral(["\n          ", ";\n          ", "\n        "], ["\n          ", ";\n          ", "\n        "]), fmt.form, fmt.butGot(value, "value", "function")));
        });
      });

      this._.oncomplete = value;
    }
  }, {
    key: "$name",
    get: function get() {
      return "OfflineAudioContext";
    }
  }]);

  return OfflineAudioContext;
})(_AudioContext3["default"]);

exports["default"] = OfflineAudioContext;
module.exports = exports["default"];

},{"./AudioBuffer":2,"./AudioContext":4,"./OfflineAudioCompletionEvent":26,"./util":41}],28:[function(require,module,exports){
(function (global){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x3, _x4, _x5) { var _again = true; _function: while (_again) { var object = _x3, property = _x4, receiver = _x5; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x3 = parent; _x4 = property; _x5 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var _util = require("./util");

var util = _interopRequireWildcard(_util);

var _utilEnumerator = require("./util/Enumerator");

var _utilEnumerator2 = _interopRequireDefault(_utilEnumerator);

var _AudioNode2 = require("./AudioNode");

var _AudioNode3 = _interopRequireDefault(_AudioNode2);

var _AudioParam = require("./AudioParam");

var _AudioParam2 = _interopRequireDefault(_AudioParam);

var _Event = require("./Event");

var _Event2 = _interopRequireDefault(_Event);

var OscillatorNode = (function (_AudioNode) {
  function OscillatorNode(admission, context) {
    var _this = this;

    _classCallCheck(this, OscillatorNode);

    _get(Object.getPrototypeOf(OscillatorNode.prototype), "constructor", this).call(this, admission, {
      name: "OscillatorNode",
      context: context,
      numberOfInputs: 0,
      numberOfOutputs: 1,
      channelCount: 2,
      channelCountMode: "max",
      channelInterpretation: "speakers"
    });

    this._.type = "sine";
    this._.frequency = util.immigration.apply(function (admission) {
      return new _AudioParam2["default"](admission, _this, "frequency", 440, 0, 100000);
    });
    this._.detune = util.immigration.apply(function (admission) {
      return new _AudioParam2["default"](admission, _this, "detune", 0, -4800, 4800);
    });
    this._.onended = null;
    this._.custom = null;
    this._.startTime = Infinity;
    this._.stopTime = Infinity;
    this._.firedOnEnded = false;
    this._.JSONKeys = OscillatorNode.$JSONKeys.slice();
  }

  _inherits(OscillatorNode, _AudioNode);

  _createClass(OscillatorNode, [{
    key: "start",
    value: function start() {
      var _this2 = this;

      var when = arguments[0] === undefined ? 0 : arguments[0];

      this._.inspector.describe("start", function (assert) {
        assert(util.isPositiveNumber(when), function (fmt) {
          throw new TypeError(fmt.plain(_taggedTemplateLiteral(["\n          ", ";\n          ", "\n        "], ["\n          ", ";\n          ", "\n        "]), fmt.form, fmt.butGot(when, "when", "positive number")));
        });

        assert(_this2._.startTime === Infinity, function (fmt) {
          throw new Error(fmt.plain(_taggedTemplateLiteral(["\n          ", ";\n          cannot start more than once\n        "], ["\n          ", ";\n          cannot start more than once\n        "]), fmt.form));
        });
      });

      this._.startTime = when;
    }
  }, {
    key: "stop",
    value: function stop() {
      var _this3 = this;

      var when = arguments[0] === undefined ? 0 : arguments[0];

      this._.inspector.describe("stop", function (assert) {
        assert(util.isPositiveNumber(when), function (fmt) {
          throw new TypeError(fmt.plain(_taggedTemplateLiteral(["\n          ", ";\n          ", "\n        "], ["\n          ", ";\n          ", "\n        "]), fmt.form, fmt.butGot(when, "when", "positive number")));
        });

        assert(_this3._.startTime !== Infinity, function (fmt) {
          throw new Error(fmt.plain(_taggedTemplateLiteral(["\n          ", ";\n          cannot call stop without calling start first\n        "], ["\n          ", ";\n          cannot call stop without calling start first\n        "]), fmt.form));
        });

        assert(_this3._.stopTime === Infinity, function (fmt) {
          throw new Error(fmt.plain(_taggedTemplateLiteral(["\n          ", ";\n          cannot stop more than once\n        "], ["\n          ", ";\n          cannot stop more than once\n        "]), fmt.form));
        });
      });

      this._.stopTime = when;
    }
  }, {
    key: "setPeriodicWave",
    value: function setPeriodicWave(periodicWave) {
      this._.inspector.describe("setPeriodicWave", function (assert) {
        assert(util.isInstanceOf(periodicWave, global.PeriodicWave), function (fmt) {
          throw new TypeError(fmt.plain(_taggedTemplateLiteral(["\n          ", ";\n          ", "\n        "], ["\n          ", ";\n          ", "\n        "]), fmt.form, fmt.butGot(periodicWave, "periodicWave", "PeriodicWave")));
        });
      });

      this._.type = "custom";
      this._.custom = periodicWave;
    }
  }, {
    key: "$stateAtTime",
    value: function $stateAtTime(time) {
      time = util.toSeconds(time);

      if (this._.startTime === Infinity) {
        return "UNSCHEDULED";
      }
      if (time < this._.startTime) {
        return "SCHEDULED";
      }
      if (time < this._.stopTime) {
        return "PLAYING";
      }

      return "FINISHED";
    }
  }, {
    key: "_process",
    value: function _process() {
      if (!this._.firedOnEnded && this.$stateAtTime(this.context.currentTime) === "FINISHED") {
        this.dispatchEvent(new _Event2["default"]("ended", this));
        this._.firedOnEnded = true;
      }
    }
  }, {
    key: "type",
    get: function get() {
      return this._.custom ? "custom" : this._.type;
    },
    set: function set(value) {
      this._.inspector.describe("type", function (assert) {
        var enumOscillatorType = new _utilEnumerator2["default"](["sine", "square", "sawtooth", "triangle"]);

        assert(enumOscillatorType.contains(value), function (fmt) {
          throw new TypeError(fmt.plain(_taggedTemplateLiteral(["\n          ", ";\n          ", "\n        "], ["\n          ", ";\n          ", "\n        "]), fmt.form, fmt.butGot(value, "type", enumOscillatorType.toString())));
        });
      });

      this._.type = value;
    }
  }, {
    key: "frequency",
    get: function get() {
      return this._.frequency;
    },
    set: function set(value) {
      this._.inspector.describe("frequency", function (assert) {
        assert.throwReadOnlyTypeError(value);
      });
    }
  }, {
    key: "detune",
    get: function get() {
      return this._.detune;
    },
    set: function set(value) {
      this._.inspector.describe("detune", function (assert) {
        assert.throwReadOnlyTypeError(value);
      });
    }
  }, {
    key: "onended",
    get: function get() {
      return this._.onended;
    },
    set: function set(value) {
      this._.inspector.describe("onended", function (assert) {
        assert(util.isNullOrFunction(value), function (fmt) {
          throw new TypeError(fmt.plain(_taggedTemplateLiteral(["\n          ", ";\n          ", "\n        "], ["\n          ", ";\n          ", "\n        "]), fmt.form, fmt.butGot(value, "onended", "function")));
        });
      });

      this._.onended = value;
    }
  }, {
    key: "$state",
    get: function get() {
      return this.$stateAtTime(this.context.currentTime);
    }
  }, {
    key: "$custom",
    get: function get() {
      return this._.custom;
    }
  }]);

  return OscillatorNode;
})(_AudioNode3["default"]);

exports["default"] = OscillatorNode;

OscillatorNode.$JSONKeys = ["type", "frequency", "detune"];
module.exports = exports["default"];

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./AudioNode":7,"./AudioParam":8,"./Event":17,"./util":41,"./util/Enumerator":37}],29:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var _util = require("./util");

var util = _interopRequireWildcard(_util);

var _utilEnumerator = require("./util/Enumerator");

var _utilEnumerator2 = _interopRequireDefault(_utilEnumerator);

var _AudioNode2 = require("./AudioNode");

var _AudioNode3 = _interopRequireDefault(_AudioNode2);

var PannerNode = (function (_AudioNode) {
  function PannerNode(admission, context) {
    _classCallCheck(this, PannerNode);

    _get(Object.getPrototypeOf(PannerNode.prototype), "constructor", this).call(this, admission, {
      name: "PannerNode",
      context: context,
      numberOfInputs: 1,
      numberOfOutputs: 1,
      channelCount: 2,
      channelCountMode: "clamped-max",
      channelInterpretation: "speakers"
    });

    this._.panningModel = "HRTF";
    this._.distanceModel = "inverse";
    this._.refDistance = 1;
    this._.maxDistance = 10000;
    this._.rolloffFactor = 1;
    this._.coneInnerAngle = 360;
    this._.coneOuterAngle = 360;
    this._.coneOuterGain = 0;
    this._.JSONKeys = PannerNode.$JSONKeys.slice();
  }

  _inherits(PannerNode, _AudioNode);

  _createClass(PannerNode, [{
    key: "setPosition",
    value: function setPosition(x, y, z) {
      this._.inspector.describe("setPosition", function (assert) {
        assert(util.isNumber(x), function (fmt) {
          throw new TypeError(fmt.plain(_taggedTemplateLiteral(["\n          ", ";\n          ", "\n        "], ["\n          ", ";\n          ", "\n        "]), fmt.form, fmt.butGot(x, "x", "number")));
        });

        assert(util.isNumber(y), function (fmt) {
          throw new TypeError(fmt.plain(_taggedTemplateLiteral(["\n          ", ";\n          ", "\n        "], ["\n          ", ";\n          ", "\n        "]), fmt.form, fmt.butGot(y, "y", "number")));
        });

        assert(util.isNumber(z), function (fmt) {
          throw new TypeError(fmt.plain(_taggedTemplateLiteral(["\n          ", ";\n          ", "\n        "], ["\n          ", ";\n          ", "\n        "]), fmt.form, fmt.butGot(z, "z", "number")));
        });
      });
    }
  }, {
    key: "setOrientation",
    value: function setOrientation(x, y, z) {
      this._.inspector.describe("setOrientation", function (assert) {
        assert(util.isNumber(x), function (fmt) {
          throw new TypeError(fmt.plain(_taggedTemplateLiteral(["\n          ", ";\n          ", "\n        "], ["\n          ", ";\n          ", "\n        "]), fmt.form, fmt.butGot(x, "x", "number")));
        });

        assert(util.isNumber(y), function (fmt) {
          throw new TypeError(fmt.plain(_taggedTemplateLiteral(["\n          ", ";\n          ", "\n        "], ["\n          ", ";\n          ", "\n        "]), fmt.form, fmt.butGot(y, "y", "number")));
        });

        assert(util.isNumber(z), function (fmt) {
          throw new TypeError(fmt.plain(_taggedTemplateLiteral(["\n          ", ";\n          ", "\n        "], ["\n          ", ";\n          ", "\n        "]), fmt.form, fmt.butGot(z, "z", "number")));
        });
      });
    }
  }, {
    key: "setVelocity",
    value: function setVelocity(x, y, z) {
      this._.inspector.describe("setVelocity", function (assert) {
        assert(util.isNumber(x), function (fmt) {
          throw new TypeError(fmt.plain(_taggedTemplateLiteral(["\n          ", ";\n          ", "\n        "], ["\n          ", ";\n          ", "\n        "]), fmt.form, fmt.butGot(x, "x", "number")));
        });

        assert(util.isNumber(y), function (fmt) {
          throw new TypeError(fmt.plain(_taggedTemplateLiteral(["\n          ", ";\n          ", "\n        "], ["\n          ", ";\n          ", "\n        "]), fmt.form, fmt.butGot(y, "y", "number")));
        });

        assert(util.isNumber(z), function (fmt) {
          throw new TypeError(fmt.plain(_taggedTemplateLiteral(["\n          ", ";\n          ", "\n        "], ["\n          ", ";\n          ", "\n        "]), fmt.form, fmt.butGot(z, "z", "number")));
        });
      });
    }
  }, {
    key: "panningModel",
    get: function get() {
      return this._.panningModel;
    },
    set: function set(value) {
      this._.inspector.describe("panningModel", function (assert) {
        var enumPanningModelType = new _utilEnumerator2["default"](["equalpower", "HRTF"]);

        assert(enumPanningModelType.contains(value), function (fmt) {
          throw new TypeError(fmt.plain(_taggedTemplateLiteral(["\n          ", ";\n          ", "\n        "], ["\n          ", ";\n          ", "\n        "]), fmt.form, fmt.butGot(value, "panningModel", enumPanningModelType.toString())));
        });
      });

      this._.panningModel = value;
    }
  }, {
    key: "distanceModel",
    get: function get() {
      return this._.distanceModel;
    },
    set: function set(value) {
      this._.inspector.describe("distanceModel", function (assert) {
        var enumDistanceModelType = new _utilEnumerator2["default"](["linear", "inverse", "exponential"]);

        assert(enumDistanceModelType.contains(value), function (fmt) {
          throw new TypeError(fmt.plain(_taggedTemplateLiteral(["\n          ", ";\n          ", "\n        "], ["\n          ", ";\n          ", "\n        "]), fmt.form, fmt.butGot(value, "distanceModel", enumDistanceModelType.toString())));
        });
      });

      this._.distanceModel = value;
    }
  }, {
    key: "refDistance",
    get: function get() {
      return this._.refDistance;
    },
    set: function set(value) {
      this._.inspector.describe("refDistance", function (assert) {
        assert(util.isNumber(value), function (fmt) {
          throw new TypeError(fmt.plain(_taggedTemplateLiteral(["\n          ", ";\n          ", "\n        "], ["\n          ", ";\n          ", "\n        "]), fmt.form, fmt.butGot(value, "refDistance", "number")));
        });
      });

      this._.refDistance = value;
    }
  }, {
    key: "maxDistance",
    get: function get() {
      return this._.maxDistance;
    },
    set: function set(value) {
      this._.inspector.describe("maxDistance", function (assert) {
        assert(util.isNumber(value), function (fmt) {
          throw new TypeError(fmt.plain(_taggedTemplateLiteral(["\n          ", ";\n          ", "\n        "], ["\n          ", ";\n          ", "\n        "]), fmt.form, fmt.butGot(value, "maxDistance", "number")));
        });
      });

      this._.maxDistance = value;
    }
  }, {
    key: "rolloffFactor",
    get: function get() {
      return this._.rolloffFactor;
    },
    set: function set(value) {
      this._.inspector.describe("rolloffFactor", function (assert) {
        assert(util.isNumber(value), function (fmt) {
          throw new TypeError(fmt.plain(_taggedTemplateLiteral(["\n          ", ";\n          ", "\n        "], ["\n          ", ";\n          ", "\n        "]), fmt.form, fmt.butGot(value, "rolloffFactor", "number")));
        });
      });

      this._.rolloffFactor = value;
    }
  }, {
    key: "coneInnerAngle",
    get: function get() {
      return this._.coneInnerAngle;
    },
    set: function set(value) {
      this._.inspector.describe("coneInnerAngle", function (assert) {
        assert(util.isNumber(value), function (fmt) {
          throw new TypeError(fmt.plain(_taggedTemplateLiteral(["\n          ", ";\n          ", "\n        "], ["\n          ", ";\n          ", "\n        "]), fmt.form, fmt.butGot(value, "coneInnerAngle", "number")));
        });
      });

      this._.coneInnerAngle = value;
    }
  }, {
    key: "coneOuterAngle",
    get: function get() {
      return this._.coneOuterAngle;
    },
    set: function set(value) {
      this._.inspector.describe("coneOuterAngle", function (assert) {
        assert(util.isNumber(value), function (fmt) {
          throw new TypeError(fmt.plain(_taggedTemplateLiteral(["\n          ", ";\n          ", "\n        "], ["\n          ", ";\n          ", "\n        "]), fmt.form, fmt.butGot(value, "coneOuterAngle", "number")));
        });
      });

      this._.coneOuterAngle = value;
    }
  }, {
    key: "coneOuterGain",
    get: function get() {
      return this._.coneOuterGain;
    },
    set: function set(value) {
      this._.inspector.describe("coneOuterGain", function (assert) {
        assert(util.isNumber(value), function (fmt) {
          throw new TypeError(fmt.plain(_taggedTemplateLiteral(["\n          ", ";\n          ", "\n        "], ["\n          ", ";\n          ", "\n        "]), fmt.form, fmt.butGot(value, "coneOuterGain", "number")));
        });
      });

      this._.coneOuterGain = value;
    }
  }]);

  return PannerNode;
})(_AudioNode3["default"]);

exports["default"] = PannerNode;

PannerNode.$JSONKeys = ["panningModel", "distanceModel", "refDistance", "maxDistance", "rolloffFactor", "coneInnerAngle", "coneOuterAngle", "coneOuterGain"];
module.exports = exports["default"];

},{"./AudioNode":7,"./util":41,"./util/Enumerator":37}],30:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var _util = require("./util");

var util = _interopRequireWildcard(_util);

var _utilInspector = require("./util/Inspector");

var _utilInspector2 = _interopRequireDefault(_utilInspector);

var PeriodicWave = (function () {
  function PeriodicWave(admission, context, real, imag) {
    _classCallCheck(this, PeriodicWave);

    util.immigration.check(admission, function () {
      throw new TypeError("Illegal constructor");
    });

    Object.defineProperty(this, "_", {
      value: {
        inspector: new _utilInspector2["default"](this)
      }
    });

    this._.inspector.describe("constructor", function (assert) {
      assert(util.isInstanceOf(real, Float32Array), function (fmt) {
        throw new TypeError(fmt.plain(_taggedTemplateLiteral(["\n          ", ";\n          ", "\n        "], ["\n          ", ";\n          ", "\n        "]), fmt.form, fmt.butGot(real, "real", "Float32Array")));
      });

      assert(real.length <= 4096, function (fmt) {
        throw new TypeError(fmt.plain(_taggedTemplateLiteral(["\n          ", ";\n          length of \"real\" array (", ") exceeds allow maximum of 4096\n        "], ["\n          ", ";\n          length of \"real\" array (", ") exceeds allow maximum of 4096\n        "]), fmt.form, real.length));
      });

      assert(util.isInstanceOf(imag, Float32Array), function (fmt) {
        throw new TypeError(fmt.plain(_taggedTemplateLiteral(["\n          ", ";\n          ", "\n        "], ["\n          ", ";\n          ", "\n        "]), fmt.form, fmt.butGot(imag, "imag", "Float32Array")));
      });

      assert(imag.length <= 4096, function (fmt) {
        throw new TypeError(fmt.plain(_taggedTemplateLiteral(["\n          ", ";\n          length of \"imag\" array (", ") exceeds allow maximum of 4096\n        "], ["\n          ", ";\n          length of \"imag\" array (", ") exceeds allow maximum of 4096\n        "]), fmt.form, imag.length));
      });

      assert(real.length === imag.length, function (fmt) {
        throw new TypeError(fmt.plain(_taggedTemplateLiteral(["\n          ", ";\n          length of real array (", ") and length of imaginary array (", ") must match\n        "], ["\n          ", ";\n          length of real array (", ") and length of imaginary array (", ") must match\n        "]), fmt.form, real.length, imag.length));
      });
    });

    this._.context = context;
    this._.real = real;
    this._.imag = imag;
  }

  _createClass(PeriodicWave, [{
    key: "$name",
    get: function get() {
      return "PeriodicWave";
    }
  }, {
    key: "$context",
    get: function get() {
      return this._.context;
    }
  }, {
    key: "$real",
    get: function get() {
      return this._.real;
    }
  }, {
    key: "$imag",
    get: function get() {
      return this._.imag;
    }
  }]);

  return PeriodicWave;
})();

exports["default"] = PeriodicWave;
module.exports = exports["default"];

},{"./util":41,"./util/Inspector":40}],31:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x3, _x4, _x5) { var _again = true; _function: while (_again) { var object = _x3, property = _x4, receiver = _x5; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x3 = parent; _x4 = property; _x5 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var _util = require("./util");

var util = _interopRequireWildcard(_util);

var _utilEnumerator = require("./util/Enumerator");

var _utilEnumerator2 = _interopRequireDefault(_utilEnumerator);

var _AudioNode2 = require("./AudioNode");

var _AudioNode3 = _interopRequireDefault(_AudioNode2);

var _AudioBuffer = require("./AudioBuffer");

var _AudioBuffer2 = _interopRequireDefault(_AudioBuffer);

var _AudioProcessingEvent = require("./AudioProcessingEvent");

var _AudioProcessingEvent2 = _interopRequireDefault(_AudioProcessingEvent);

var ScriptProcessorNode = (function (_AudioNode) {
  function ScriptProcessorNode(admission, context, bufferSize) {
    var numberOfInputChannels = arguments[3] === undefined ? 2 : arguments[3];
    var numberOfOutputChannels = arguments[4] === undefined ? 2 : arguments[4];

    _classCallCheck(this, ScriptProcessorNode);

    _get(Object.getPrototypeOf(ScriptProcessorNode.prototype), "constructor", this).call(this, admission, {
      name: "ScriptProcessorNode",
      context: context,
      numberOfInputs: 1,
      numberOfOutputs: 1,
      channelCount: numberOfInputChannels,
      channelCountMode: "max",
      channelInterpretation: "speakers"
    });

    this._.inspector.describe("constructor", function (assert) {
      var enumBufferSize = new _utilEnumerator2["default"]([256, 512, 1024, 2048, 4096, 8192, 16384]);

      assert(enumBufferSize.contains(bufferSize), function (fmt) {
        throw new TypeError(fmt.plain(_taggedTemplateLiteral(["\n          ", ";\n          ", "\n        "], ["\n          ", ";\n          ", "\n        "]), fmt.form, fmt.butGot(bufferSize, "bufferSize", enumBufferSize.toString())));
      });

      assert(util.isPositiveInteger(numberOfInputChannels), function (fmt) {
        throw new TypeError(fmt.plain(_taggedTemplateLiteral(["\n          ", ";\n          ", "\n        "], ["\n          ", ";\n          ", "\n        "]), fmt.form, fmt.butGot(numberOfInputChannels, "numberOfInputChannels", "positive integer")));
      });

      assert(util.isPositiveInteger(numberOfOutputChannels), function (fmt) {
        throw new TypeError(fmt.plain(_taggedTemplateLiteral(["\n          ", ";\n          ", "\n        "], ["\n          ", ";\n          ", "\n        "]), fmt.form, fmt.butGot(numberOfOutputChannels, "numberOfOutputChannels", "positive integer")));
      });
    });

    this._.bufferSize = bufferSize;
    this._.onaudioprocess = null;
    this._.numberOfInputChannels = numberOfInputChannels;
    this._.numberOfOutputChannels = numberOfOutputChannels;
    this._.numSamples = 0;
  }

  _inherits(ScriptProcessorNode, _AudioNode);

  _createClass(ScriptProcessorNode, [{
    key: "_process",
    value: function _process(inNumSamples) {
      var _this = this;

      this._.numSamples -= inNumSamples;

      if (this._.numSamples <= 0) {
        this._.numSamples += this.bufferSize;

        var _event = util.immigration.apply(function (admission) {
          return new _AudioProcessingEvent2["default"](admission, _this);
        });

        _event.playbackTime = this.context.currentTime + this.bufferSize / this.context.sampleRate;
        _event.inputBuffer = util.immigration.apply(function (admission) {
          return new _AudioBuffer2["default"](admission, _this.context, _this._.numberOfInputChannels, _this.bufferSize, _this.context.sampleRate);
        });
        _event.outputBuffer = util.immigration.apply(function (admission) {
          return new _AudioBuffer2["default"](admission, _this.context, _this._.numberOfOutputChannels, _this.bufferSize, _this.context.sampleRate);
        });

        this.dispatchEvent(_event);
      }
    }
  }, {
    key: "bufferSize",
    get: function get() {
      return this._.bufferSize;
    },
    set: function set(value) {
      this._.inspector.describe("bufferSize", function (assert) {
        assert.throwReadOnlyTypeError(value, "bufferSize");
      });
    }
  }, {
    key: "onaudioprocess",
    get: function get() {
      return this._.onaudioprocess;
    },
    set: function set(value) {
      this._.inspector.describe("onaudioprocess", function (assert) {
        assert(util.isNullOrFunction(value), function (fmt) {
          throw new TypeError(fmt.plain(_taggedTemplateLiteral(["\n          ", ";\n          ", "\n        "], ["\n          ", ";\n          ", "\n        "]), fmt.form, fmt.butGot(value, "onaudioprocess", "function")));
        });
      });

      this._.onaudioprocess = value;
    }
  }]);

  return ScriptProcessorNode;
})(_AudioNode3["default"]);

exports["default"] = ScriptProcessorNode;
module.exports = exports["default"];

},{"./AudioBuffer":2,"./AudioNode":7,"./AudioProcessingEvent":9,"./util":41,"./util/Enumerator":37}],32:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _util = require("./util");

var util = _interopRequireWildcard(_util);

var _AudioNode2 = require("./AudioNode");

var _AudioNode3 = _interopRequireDefault(_AudioNode2);

var _AudioParam = require("./AudioParam");

var _AudioParam2 = _interopRequireDefault(_AudioParam);

var StereoPannerNode = (function (_AudioNode) {
  function StereoPannerNode(admission, context) {
    var _this = this;

    _classCallCheck(this, StereoPannerNode);

    _get(Object.getPrototypeOf(StereoPannerNode.prototype), "constructor", this).call(this, admission, {
      name: "StereoPannerNode",
      context: context,
      numberOfInputs: 1,
      numberOfOutputs: 1,
      channelCount: 2,
      channelCountMode: "clamped-max",
      channelInterpretation: "speakers"
    });

    this._.pan = util.immigration.apply(function (admission) {
      return new _AudioParam2["default"](admission, _this, "pan", 0, -1, 1);
    });
    this._.JSONKeys = StereoPannerNode.$JSONKeys.slice();
  }

  _inherits(StereoPannerNode, _AudioNode);

  _createClass(StereoPannerNode, [{
    key: "pan",
    get: function get() {
      return this._.pan;
    },
    set: function set(value) {
      this._.inspector.describe("pan", function (assert) {
        assert.throwReadOnlyTypeError(value);
      });
    }
  }]);

  return StereoPannerNode;
})(_AudioNode3["default"]);

exports["default"] = StereoPannerNode;

StereoPannerNode.$JSONKeys = ["pan"];
module.exports = exports["default"];

},{"./AudioNode":7,"./AudioParam":8,"./util":41}],33:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = "0.3.0";
module.exports = exports["default"];

},{}],34:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var _util = require("./util");

var util = _interopRequireWildcard(_util);

var _utilEnumerator = require("./util/Enumerator");

var _utilEnumerator2 = _interopRequireDefault(_utilEnumerator);

var _AudioNode2 = require("./AudioNode");

var _AudioNode3 = _interopRequireDefault(_AudioNode2);

var WaveShaperNode = (function (_AudioNode) {
  function WaveShaperNode(admission, context) {
    _classCallCheck(this, WaveShaperNode);

    _get(Object.getPrototypeOf(WaveShaperNode.prototype), "constructor", this).call(this, admission, {
      name: "WaveShaperNode",
      context: context,
      numberOfInputs: 1,
      numberOfOutputs: 1,
      channelCount: 2,
      channelCountMode: "max",
      channelInterpretation: "speakers"
    });

    this._.curve = null;
    this._.oversample = "none";
    this._.JSONKeys = WaveShaperNode.$JSONKeys.slice();
  }

  _inherits(WaveShaperNode, _AudioNode);

  _createClass(WaveShaperNode, [{
    key: "curve",
    get: function get() {
      return this._.curve;
    },
    set: function set(value) {
      this._.inspector.describe("curve", function (assert) {
        assert(util.isNullOrInstanceOf(value, Float32Array), function (fmt) {
          throw new TypeError(fmt.plain(_taggedTemplateLiteral(["\n          ", ";\n          ", "\n        "], ["\n          ", ";\n          ", "\n        "]), fmt.form, fmt.butGot(value, "curve", "Float32Array")));
        });
      });

      this._.curve = value;
    }
  }, {
    key: "oversample",
    get: function get() {
      return this._.oversample;
    },
    set: function set(value) {
      this._.inspector.describe("oversample", function (assert) {
        var enumOverSampleType = new _utilEnumerator2["default"](["none", "2x", "4x"]);

        assert(enumOverSampleType.contains(value), function (fmt) {
          throw new TypeError(fmt.plain(_taggedTemplateLiteral(["\n          ", ";\n          ", "\n        "], ["\n          ", ";\n          ", "\n        "]), fmt.form, fmt.butGot(value, "oversample", enumOverSampleType.toString())));
        });
      });

      this._.oversample = value;
    }
  }]);

  return WaveShaperNode;
})(_AudioNode3["default"]);

exports["default"] = WaveShaperNode;

WaveShaperNode.$JSONKeys = ["oversample"];
module.exports = exports["default"];

},{"./AudioNode":7,"./util":41,"./util/Enumerator":37}],35:[function(require,module,exports){
(function (global){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = {
  AnalyserNode: global.AnalyserNode,
  AudioBuffer: global.AudioBuffer,
  AudioBufferSourceNode: global.AudioBufferSourceNode,
  AudioContext: global.AudioContext || global.webkitAudioContext,
  AudioDestinationNode: global.AudioDestinationNode,
  AudioListener: global.AudioListener,
  AudioNode: global.AudioNode,
  AudioParam: global.AudioParam,
  AudioProcessingEvent: global.AudioProcessingEvent,
  BiquadFilterNode: global.BiquadFilterNode,
  ChannelMergerNode: global.ChannelMergerNode,
  ChannelSplitterNode: global.ChannelSplitterNode,
  ConvolverNode: global.ConvolverNode,
  DelayNode: global.DelayNode,
  DynamicsCompressorNode: global.DynamicsCompressorNode,
  GainNode: global.GainNode,
  MediaElementAudioSourceNode: global.MediaElementAudioSourceNode,
  MediaStreamAudioDestinationNode: global.MediaStreamAudioDestinationNode,
  MediaStreamAudioSourceNode: global.MediaStreamAudioSourceNode,
  OfflineAudioCompletionEvent: global.OfflineAudioCompletionEvent,
  OfflineAudioContext: global.OfflineAudioContext || global.webkitOfflineAudioContext,
  OscillatorNode: global.OscillatorNode,
  PannerNode: global.PannerNode,
  PeriodicWave: global.PeriodicWave,
  ScriptProcessorNode: global.ScriptProcessorNode,
  StereoPannerNode: global.StereoPannerNode,
  WaveShaperNode: global.WaveShaperNode
};
module.exports = exports["default"];

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],36:[function(require,module,exports){
(function (global){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

var _util = require("./util");

var util = _interopRequireWildcard(_util);

var _WebAudioAPI = require("./WebAudioAPI");

var _WebAudioAPI2 = _interopRequireDefault(_WebAudioAPI);

var _VERSION = require("./VERSION");

var _VERSION2 = _interopRequireDefault(_VERSION);

var _AnalyserNode = require("./AnalyserNode");

var _AnalyserNode2 = _interopRequireDefault(_AnalyserNode);

var _AudioBuffer = require("./AudioBuffer");

var _AudioBuffer2 = _interopRequireDefault(_AudioBuffer);

var _AudioBufferSourceNode = require("./AudioBufferSourceNode");

var _AudioBufferSourceNode2 = _interopRequireDefault(_AudioBufferSourceNode);

var _AudioContext = require("./AudioContext");

var _AudioContext2 = _interopRequireDefault(_AudioContext);

var _AudioDestinationNode = require("./AudioDestinationNode");

var _AudioDestinationNode2 = _interopRequireDefault(_AudioDestinationNode);

var _AudioListener = require("./AudioListener");

var _AudioListener2 = _interopRequireDefault(_AudioListener);

var _AudioNode = require("./AudioNode");

var _AudioNode2 = _interopRequireDefault(_AudioNode);

var _AudioParam = require("./AudioParam");

var _AudioParam2 = _interopRequireDefault(_AudioParam);

var _AudioProcessingEvent = require("./AudioProcessingEvent");

var _AudioProcessingEvent2 = _interopRequireDefault(_AudioProcessingEvent);

var _BiquadFilterNode = require("./BiquadFilterNode");

var _BiquadFilterNode2 = _interopRequireDefault(_BiquadFilterNode);

var _ChannelMergerNode = require("./ChannelMergerNode");

var _ChannelMergerNode2 = _interopRequireDefault(_ChannelMergerNode);

var _ChannelSplitterNode = require("./ChannelSplitterNode");

var _ChannelSplitterNode2 = _interopRequireDefault(_ChannelSplitterNode);

var _ConvolverNode = require("./ConvolverNode");

var _ConvolverNode2 = _interopRequireDefault(_ConvolverNode);

var _DelayNode = require("./DelayNode");

var _DelayNode2 = _interopRequireDefault(_DelayNode);

var _DynamicsCompressorNode = require("./DynamicsCompressorNode");

var _DynamicsCompressorNode2 = _interopRequireDefault(_DynamicsCompressorNode);

var _Element = require("./Element");

var _Element2 = _interopRequireDefault(_Element);

var _Event = require("./Event");

var _Event2 = _interopRequireDefault(_Event);

var _EventTarget = require("./EventTarget");

var _EventTarget2 = _interopRequireDefault(_EventTarget);

var _GainNode = require("./GainNode");

var _GainNode2 = _interopRequireDefault(_GainNode);

var _HTMLElement = require("./HTMLElement");

var _HTMLElement2 = _interopRequireDefault(_HTMLElement);

var _HTMLMediaElement = require("./HTMLMediaElement");

var _HTMLMediaElement2 = _interopRequireDefault(_HTMLMediaElement);

var _MediaElementAudioSourceNode = require("./MediaElementAudioSourceNode");

var _MediaElementAudioSourceNode2 = _interopRequireDefault(_MediaElementAudioSourceNode);

var _MediaStream = require("./MediaStream");

var _MediaStream2 = _interopRequireDefault(_MediaStream);

var _MediaStreamAudioDestinationNode = require("./MediaStreamAudioDestinationNode");

var _MediaStreamAudioDestinationNode2 = _interopRequireDefault(_MediaStreamAudioDestinationNode);

var _MediaStreamAudioSourceNode = require("./MediaStreamAudioSourceNode");

var _MediaStreamAudioSourceNode2 = _interopRequireDefault(_MediaStreamAudioSourceNode);

var _OfflineAudioCompletionEvent = require("./OfflineAudioCompletionEvent");

var _OfflineAudioCompletionEvent2 = _interopRequireDefault(_OfflineAudioCompletionEvent);

var _OfflineAudioContext = require("./OfflineAudioContext");

var _OfflineAudioContext2 = _interopRequireDefault(_OfflineAudioContext);

var _OscillatorNode = require("./OscillatorNode");

var _OscillatorNode2 = _interopRequireDefault(_OscillatorNode);

var _PannerNode = require("./PannerNode");

var _PannerNode2 = _interopRequireDefault(_PannerNode);

var _PeriodicWave = require("./PeriodicWave");

var _PeriodicWave2 = _interopRequireDefault(_PeriodicWave);

var _ScriptProcessorNode = require("./ScriptProcessorNode");

var _ScriptProcessorNode2 = _interopRequireDefault(_ScriptProcessorNode);

var _StereoPannerNode = require("./StereoPannerNode");

var _StereoPannerNode2 = _interopRequireDefault(_StereoPannerNode);

var _WaveShaperNode = require("./WaveShaperNode");

var _WaveShaperNode2 = _interopRequireDefault(_WaveShaperNode);

var sampleRate = 44100;

var WebAudioTestAPI = {
  VERSION: _VERSION2["default"],
  util: util,
  sampleRate: sampleRate,
  AnalyserNode: _AnalyserNode2["default"],
  AudioBuffer: _AudioBuffer2["default"],
  AudioBufferSourceNode: _AudioBufferSourceNode2["default"],
  AudioContext: _AudioContext2["default"],
  AudioDestinationNode: _AudioDestinationNode2["default"],
  AudioListener: _AudioListener2["default"],
  AudioNode: _AudioNode2["default"],
  AudioParam: _AudioParam2["default"],
  AudioProcessingEvent: _AudioProcessingEvent2["default"],
  BiquadFilterNode: _BiquadFilterNode2["default"],
  ChannelMergerNode: _ChannelMergerNode2["default"],
  ChannelSplitterNode: _ChannelSplitterNode2["default"],
  ConvolverNode: _ConvolverNode2["default"],
  DelayNode: _DelayNode2["default"],
  DynamicsCompressorNode: _DynamicsCompressorNode2["default"],
  Element: _Element2["default"],
  Event: _Event2["default"],
  EventTarget: _EventTarget2["default"],
  GainNode: _GainNode2["default"],
  HTMLElement: _HTMLElement2["default"],
  HTMLMediaElement: _HTMLMediaElement2["default"],
  MediaElementAudioSourceNode: _MediaElementAudioSourceNode2["default"],
  MediaStream: _MediaStream2["default"],
  MediaStreamAudioDestinationNode: _MediaStreamAudioDestinationNode2["default"],
  MediaStreamAudioSourceNode: _MediaStreamAudioSourceNode2["default"],
  OfflineAudioCompletionEvent: _OfflineAudioCompletionEvent2["default"],
  OfflineAudioContext: _OfflineAudioContext2["default"],
  OscillatorNode: _OscillatorNode2["default"],
  PannerNode: _PannerNode2["default"],
  PeriodicWave: _PeriodicWave2["default"],
  ScriptProcessorNode: _ScriptProcessorNode2["default"],
  StereoPannerNode: _StereoPannerNode2["default"],
  WaveShaperNode: _WaveShaperNode2["default"],
  use: function use() {
    global.AnalyserNode = WebAudioTestAPI.AnalyserNode;
    global.AudioBuffer = WebAudioTestAPI.AudioBuffer;
    global.AudioBufferSourceNode = WebAudioTestAPI.AudioBufferSourceNode;
    global.AudioContext = WebAudioTestAPI.AudioContext;
    global.AudioDestinationNode = WebAudioTestAPI.AudioDestinationNode;
    global.AudioListener = WebAudioTestAPI.AudioListener;
    global.AudioNode = WebAudioTestAPI.AudioNode;
    global.AudioParam = WebAudioTestAPI.AudioParam;
    global.AudioProcessingEvent = WebAudioTestAPI.AudioProcessingEvent;
    global.BiquadFilterNode = WebAudioTestAPI.BiquadFilterNode;
    global.ChannelMergerNode = WebAudioTestAPI.ChannelMergerNode;
    global.ChannelSplitterNode = WebAudioTestAPI.ChannelSplitterNode;
    global.ConvolverNode = WebAudioTestAPI.ConvolverNode;
    global.DelayNode = WebAudioTestAPI.DelayNode;
    global.DynamicsCompressorNode = WebAudioTestAPI.DynamicsCompressorNode;
    global.GainNode = WebAudioTestAPI.GainNode;
    global.MediaElementAudioSourceNode = WebAudioTestAPI.MediaElementAudioSourceNode;
    global.MediaStreamAudioDestinationNode = WebAudioTestAPI.MediaStreamAudioDestinationNode;
    global.MediaStreamAudioSourceNode = WebAudioTestAPI.MediaStreamAudioSourceNode;
    global.OfflineAudioCompletionEvent = WebAudioTestAPI.OfflineAudioCompletionEvent;
    global.OfflineAudioContext = WebAudioTestAPI.OfflineAudioContext;
    global.OscillatorNode = WebAudioTestAPI.OscillatorNode;
    global.PannerNode = WebAudioTestAPI.PannerNode;
    global.PeriodicWave = WebAudioTestAPI.PeriodicWave;
    global.ScriptProcessorNode = WebAudioTestAPI.ScriptProcessorNode;
    global.StereoPannerNode = WebAudioTestAPI.StereoPannerNode;
    global.WaveShaperNode = WebAudioTestAPI.WaveShaperNode;
    global.WebAudioTestAPI = WebAudioTestAPI;
  },
  unuse: function unuse() {
    global.AnalyserNode = _WebAudioAPI2["default"].AnalyserNode;
    global.AudioBuffer = _WebAudioAPI2["default"].AudioBuffer;
    global.AudioBufferSourceNode = _WebAudioAPI2["default"].AudioBufferSourceNode;
    global.AudioContext = _WebAudioAPI2["default"].AudioContext;
    global.AudioDestinationNode = _WebAudioAPI2["default"].AudioDestinationNode;
    global.AudioListener = _WebAudioAPI2["default"].AudioListener;
    global.AudioNode = _WebAudioAPI2["default"].AudioNode;
    global.AudioParam = _WebAudioAPI2["default"].AudioParam;
    global.AudioProcessingEvent = _WebAudioAPI2["default"].AudioProcessingEvent;
    global.BiquadFilterNode = _WebAudioAPI2["default"].BiquadFilterNode;
    global.ChannelMergerNode = _WebAudioAPI2["default"].ChannelMergerNode;
    global.ChannelSplitterNode = _WebAudioAPI2["default"].ChannelSplitterNode;
    global.ConvolverNode = _WebAudioAPI2["default"].ConvolverNode;
    global.DelayNode = _WebAudioAPI2["default"].DelayNode;
    global.DynamicsCompressorNode = _WebAudioAPI2["default"].DynamicsCompressorNode;
    global.GainNode = _WebAudioAPI2["default"].GainNode;
    global.MediaElementAudioSourceNode = _WebAudioAPI2["default"].MediaElementAudioSourceNode;
    global.MediaStreamAudioDestinationNode = _WebAudioAPI2["default"].MediaStreamAudioDestinationNode;
    global.MediaStreamAudioSourceNode = _WebAudioAPI2["default"].MediaStreamAudioSourceNode;
    global.OfflineAudioCompletionEvent = _WebAudioAPI2["default"].OfflineAudioCompletionEvent;
    global.OfflineAudioContext = _WebAudioAPI2["default"].OfflineAudioContext;
    global.OscillatorNode = _WebAudioAPI2["default"].OscillatorNode;
    global.PannerNode = _WebAudioAPI2["default"].PannerNode;
    global.PeriodicWave = _WebAudioAPI2["default"].PeriodicWave;
    global.ScriptProcessorNode = _WebAudioAPI2["default"].ScriptProcessorNode;
    global.StereoPannerNode = WebAudioTestAPI.StereoPannerNode;
    global.WaveShaperNode = _WebAudioAPI2["default"].WaveShaperNode;
  }
};

exports["default"] = WebAudioTestAPI;
module.exports = exports["default"];

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./AnalyserNode":1,"./AudioBuffer":2,"./AudioBufferSourceNode":3,"./AudioContext":4,"./AudioDestinationNode":5,"./AudioListener":6,"./AudioNode":7,"./AudioParam":8,"./AudioProcessingEvent":9,"./BiquadFilterNode":10,"./ChannelMergerNode":11,"./ChannelSplitterNode":12,"./ConvolverNode":13,"./DelayNode":14,"./DynamicsCompressorNode":15,"./Element":16,"./Event":17,"./EventTarget":18,"./GainNode":19,"./HTMLElement":20,"./HTMLMediaElement":21,"./MediaElementAudioSourceNode":22,"./MediaStream":23,"./MediaStreamAudioDestinationNode":24,"./MediaStreamAudioSourceNode":25,"./OfflineAudioCompletionEvent":26,"./OfflineAudioContext":27,"./OscillatorNode":28,"./PannerNode":29,"./PeriodicWave":30,"./ScriptProcessorNode":31,"./StereoPannerNode":32,"./VERSION":33,"./WaveShaperNode":34,"./WebAudioAPI":35,"./util":41}],37:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Enumerator = (function () {
  function Enumerator() {
    var list = arguments[0] === undefined ? [] : arguments[0];

    _classCallCheck(this, Enumerator);

    this.list = list;
  }

  _createClass(Enumerator, [{
    key: "contains",
    value: function contains(value) {
      return this.list.indexOf(value) !== -1;
    }
  }, {
    key: "toString",
    value: function toString() {
      return "enum { " + this.list.join(", ") + " }";
    }
  }]);

  return Enumerator;
})();

exports["default"] = Enumerator;
module.exports = exports["default"];

},{}],38:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _ = require("./");

var util = _interopRequireWildcard(_);

function getFunctionDeclaration(fn) {
  return /^function (\w+\([^)]*\))/.exec(fn.toString())[1];
}

var Formatter = (function () {
  function Formatter(instance, methodName, args) {
    _classCallCheck(this, Formatter);

    this.instance = instance;
    this.methodName = methodName;
    this.args = args;
  }

  _createClass(Formatter, [{
    key: "plain",
    value: function plain(strings) {
      var msg = strings[0];

      for (var _len = arguments.length, values = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        values[_key - 1] = arguments[_key];
      }

      for (var i = 0; i < values.length; i++) {
        msg += values[i] + strings[i + 1];
      }

      return msg.trim().replace(/\s+/g, " ");
    }
  }, {
    key: "butGot",
    value: function butGot(value, name, type) {
      return "\"" + name + "\" should be " + util.article(type) + " " + type + ", but got: " + util.pp(value);
    }
  }, {
    key: "form",
    get: function get() {
      var result = this.instance.constructor.name;

      if (this.methodName === "constructor") {
        if (this.args) {
          result = "new " + result + "(" + this.args.join(", ") + ")";
        } else {
          result = "new " + getFunctionDeclaration(this.instance.constructor);
        }
      } else if (this.methodName) {
        if (this.args) {
          result += "#" + this.methodName + "(" + this.args.join(", ") + ")";
        } else {
          var descriptor = Object.getOwnPropertyDescriptor(this.instance, this.methodName) || Object.getOwnPropertyDescriptor(Object.getPrototypeOf(this.instance), this.methodName);
          if (descriptor && typeof descriptor.value === "function") {
            result += "#" + getFunctionDeclaration(descriptor.value);
          }
        }
      }

      return result;
    }
  }]);

  return Formatter;
})();

exports["default"] = Formatter;
module.exports = exports["default"];

},{"./":41}],39:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Immigration = (function () {
  function Immigration() {
    _classCallCheck(this, Immigration);

    this._admissions = [];
  }

  _createClass(Immigration, [{
    key: "apply",
    value: function apply(fn) {
      var admission1 = { token: {}, count: 0 };

      this._admissions.push(admission1);

      var result = fn(admission1.token);

      var admission2 = this._admissions.pop();

      if (admission1 !== admission2 || admission2.count !== 1) {
        throw new Error("invalid admission");
      }

      return result;
    }
  }, {
    key: "check",
    value: function check(token, errorCallback) {
      var lastAdmission = this._admissions.pop();

      if (!lastAdmission || lastAdmission.token !== token || lastAdmission.count++ !== 0) {
        errorCallback();
      }

      this._admissions.push(lastAdmission);
    }
  }]);

  return Immigration;
})();

exports["default"] = Immigration;
module.exports = exports["default"];

},{}],40:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var _Formatter = require("./Formatter");

var _Formatter2 = _interopRequireDefault(_Formatter);

var Inspector = (function () {
  function Inspector(instance) {
    _classCallCheck(this, Inspector);

    this.instance = instance;
  }

  _createClass(Inspector, [{
    key: "describe",
    value: function describe(methodName, args, callback) {
      var _this = this;

      if (typeof args === "function") {
        var _ref = [null, args];
        args = _ref[0];
        callback = _ref[1];
      }

      var formatter = new _Formatter2["default"](this.instance, methodName, args);
      var assert = function assert(test, callback) {
        if (test) {
          return;
        }

        callback.call(_this.instance, formatter);
      };

      assert.throwReadOnlyTypeError = function () {
        throw new TypeError(formatter.plain(_taggedTemplateLiteral(["\n        ", ";\n        attempt to write a readonly property: \"", "\"\n      "], ["\n        ", ";\n        attempt to write a readonly property: \"", "\"\n      "]), formatter.form, methodName));
      };

      callback.call(this.instance, assert);
    }
  }]);

  return Inspector;
})();

exports["default"] = Inspector;
module.exports = exports["default"];

},{"./Formatter":38}],41:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.article = article;
exports.defaults = defaults;
exports.getAPIVersion = getAPIVersion;
exports.isBoolean = isBoolean;
exports.isFunction = isFunction;
exports.isInstanceOf = isInstanceOf;
exports.isNullOrFunction = isNullOrFunction;
exports.isNullOrInstanceOf = isNullOrInstanceOf;
exports.isNumber = isNumber;
exports.isInteger = isInteger;
exports.isPositiveNumber = isPositiveNumber;
exports.isPositiveInteger = isPositiveInteger;
exports.isString = isString;
exports.name = name;
exports.pp = pp;
exports.preventSuperCall = preventSuperCall;
exports.toJSON = toJSON;
exports.toMicroseconds = toMicroseconds;
exports.toSeconds = toSeconds;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _Immigration = require("./Immigration");

var _Immigration2 = _interopRequireDefault(_Immigration);

var _VERSION = require("../VERSION");

var _VERSION2 = _interopRequireDefault(_VERSION);

var MIN_MICRO_SECONDS = 0;
var MAX_MICRO_SECONDS = 24 * 60 * 60 * 1000 * 1000;

function article(str) {
  return /[aeiou]/i.test(str.charAt(0)) ? "an" : "a";
}

function defaults(value, defaultValue) {
  return typeof value !== "undefined" ? value : defaultValue;
}

function getAPIVersion() {
  return _VERSION2["default"];
}

function isBoolean(value) {
  return typeof value === "boolean";
}

function isFunction(value) {
  return typeof value === "function";
}

function isInstanceOf(value, klass) {
  return value instanceof klass;
}

function isNullOrFunction(value) {
  return value === null || isFunction(value);
}

function isNullOrInstanceOf(value, klass) {
  return value === null || isInstanceOf(value, klass);
}

function isNumber(value) {
  return !isNaN(value) && typeof value === "number";
}

function isInteger(value) {
  return isNumber(value) && value === (value | 0);
}

function isPositiveNumber(value) {
  return isNumber(value) && 0 <= value;
}

function isPositiveInteger(value) {
  return isPositiveNumber(value) && isInteger(value);
}

function isString(value) {
  return typeof value === "string";
}

function name(obj) {
  if (obj.hasOwnProperty("$id")) {
    return obj.$name + "#" + obj.$id;
  }
  return obj.$name;
}

function pp(value) {
  if (value == null) {
    return String(value);
  }
  var type = typeof value;

  if (type === "number" || type === "boolean") {
    return String(value);
  }

  if (type === "string") {
    return "'" + value + "'";
  }

  if (Array.isArray(value)) {
    return "[ " + value.map(pp).join(", ") + " ]";
  }

  if (value.constructor === ({}).constructor) {
    return "{ " + Object.keys(value).map(function (key) {
      return key + ": " + pp(value[key]);
    }).join(", ") + "}";
  }

  var name = value.constructor.name || Object.prototype.toString.call(value).slice(8, -1);

  return article(name) + " " + name;
}

function preventSuperCall(superClass) {
  if (!superClass) {
    superClass = function () {};
  }
  function ctor() {}
  ctor.prototype = Object.create(superClass.prototype, {
    constructor: { value: ctor, enumerable: false, writable: true, configurable: true }
  });
  return ctor;
}

function toJSON(node, func, memo) {
  var result = undefined;

  memo = memo || [];

  if (memo.indexOf(node) !== -1) {
    return "<circular:" + name(node) + ">";
  }
  memo.push(node);

  result = func(node, memo);

  memo.pop();

  return result;
}

function toMicroseconds(time) {
  var value = 0;

  if (typeof time === "number") {
    // seconds -> microseconds
    value = Math.floor(time * 1000 * 1000) || 0;
    return Math.max(MIN_MICRO_SECONDS, Math.min(value, MAX_MICRO_SECONDS));
  }

  var matches = /^([0-5]\d):([0-5]\d)\.(\d\d\d)$/.exec(time);
  if (matches) {
    value += +matches[1]; // minutes
    value *= 60;
    value += +matches[2]; // seconds
    value *= 1000;
    value += +matches[3]; // milliseconds
    value *= 1000;
    return Math.max(MIN_MICRO_SECONDS, Math.min(value, MAX_MICRO_SECONDS));
  }

  return value;
}

function toSeconds(time) {
  return toMicroseconds(time) / (1000 * 1000);
}

var immigration = new _Immigration2["default"]();
exports.immigration = immigration;

},{"../VERSION":33,"./Immigration":39}],42:[function(require,module,exports){
(function (global){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _WebAudioTestAPI = require("./WebAudioTestAPI");

var _WebAudioTestAPI2 = _interopRequireDefault(_WebAudioTestAPI);

if (!global.WEB_AUDIO_TEST_API_IGNORE) {
  _WebAudioTestAPI2["default"].use();
}

exports["default"] = _WebAudioTestAPI2["default"];
module.exports = exports["default"];

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./WebAudioTestAPI":36}]},{},[42]);

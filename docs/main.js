'use strict';

var capitalize = function (a) { return a.charAt(0).toUpperCase() + a.substring(1); };
var equals = function (a, b) {
    if (a === b)
        return true;
    var typeA = typeof a;
    if (typeA !== typeof b || typeA !== 'object')
        return false;
    if (Array.isArray(a)) {
        if (a.length !== b.length)
            return false;
        for (var i = 0; i < a.length; i++)
            if (!equals(a[i], b[i]))
                return false;
        return true;
    }
    var keysA = Object.keys(a);
    var keysB = Object.keys(b);
    if (keysA.length !== keysB.length)
        return false;
    for (var i = 0; i < keysA.length; i++) {
        var key = keysA[i];
        if (!equals(a[key], b[key]))
            return false;
    }
    return true;
};
var forEach = function (f, xs) { for (var i = 0; i < xs.length; i++)
    f(xs[i]); };
var filter = function (f, xs) {
    var ys = [];
    for (var i = 0; i < xs.length; i++)
        f(xs[i]) && ys.push(xs[i]);
    return ys;
};
var find = function (f, xs) { for (var i = 0; i < xs.length; i++)
    if (f(xs[i]))
        return xs[i]; };
var mapObj = function (f, o) {
    var p = {};
    for (var key in o)
        if (Object.prototype.hasOwnProperty.call(o, key))
            p[key] = f(o[key]);
    return p;
};
var values = function (obj) {
    var keys = Object.keys(obj);
    var ret = [];
    for (var i = 0; i < keys.length; i++)
        ret[i] = obj[keys[i]];
    return ret;
};

var connectAudioNodes = function (virtualGraph, handleConnectionToOutput) {
    return forEach(function (id) {
        var virtualNode = virtualGraph[id];
        var output = virtualNode.output;
        if (virtualNode.connected || output == null)
            return;
        forEach(function (output) {
            if (output === 'output')
                return handleConnectionToOutput(virtualNode);
            if (Object.prototype.toString.call(output) === '[object Object]') {
                var key_1 = output.key, destination = output.destination, inputs = output.inputs, outputs_1 = output.outputs;
                if (key_1 == null) {
                    throw new Error("id: " + id + " - output object requires a key property");
                }
                if (inputs) {
                    if (inputs.length !== outputs_1.length) {
                        throw new Error("id: " + id + " - outputs and inputs arrays are not the same length");
                    }
                    return forEach(function (input, i) { return virtualNode.connect(virtualGraph[key_1].audioNode, outputs_1[i], input); }, inputs);
                }
                return virtualNode.connect(virtualGraph[key_1].audioNode[destination]);
            }
            var destinationVirtualAudioNode = virtualGraph[output];
            if (destinationVirtualAudioNode.isCustomVirtualNode) {
                return forEach(function (node) { return node.input === 'input' && virtualNode.connect(node.audioNode); }, values(destinationVirtualAudioNode.virtualNodes));
            }
            virtualNode.connect(destinationVirtualAudioNode.audioNode);
        }, Array.isArray(output) ? output : [output]);
    }, Object.keys(virtualGraph));
};

var audioParamProperties = [
    'attack',
    'delayTime',
    'detune',
    'frequency',
    'gain',
    'knee',
    'pan',
    'playbackRate',
    'ratio',
    'reduction',
    'release',
    'threshold',
    'Q',
];
var constructorParamsKeys = [
    'maxDelayTime',
    'mediaElement',
    'mediaStream',
    'numberOfOutputs',
];
var setters = [
    'position',
    'orientation',
];
var startAndStopNodes = [
    'oscillator',
    'bufferSource',
];

var connect = function () {
    var connectArgs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        connectArgs[_i] = arguments[_i];
    }
    var audioNode = this.audioNode;
    var filteredConnectArgs = filter(Boolean, connectArgs);
    audioNode.connect && audioNode.connect.apply(audioNode, filteredConnectArgs);
    this.connections = this.connections.concat(filteredConnectArgs);
    this.connected = true;
};
var createAudioNode = function (audioContext, name, constructorParam, _a) {
    var offsetTime = _a.offsetTime, startTime = _a.startTime, stopTime = _a.stopTime;
    offsetTime = offsetTime || 0;
    var audioNode = constructorParam
        ? audioContext["create" + capitalize(name)](constructorParam)
        : audioContext["create" + capitalize(name)]();
    if (startAndStopNodes.indexOf(name) !== -1) {
        if (startTime == null)
            audioNode.start(audioContext.currentTime, offsetTime);
        else
            audioNode.start(startTime, offsetTime);
        if (stopTime != null)
            audioNode.stop(stopTime);
    }
    return audioNode;
};
var disconnect = function (node) {
    var _this = this;
    var audioNode = this.audioNode;
    if (node) {
        if (node.isCustomVirtualNode) {
            forEach(function (key) {
                var childNode = node.virtualNodes[key];
                if (!_this.connections.some(function (x) { return x === childNode.audioNode; }))
                    return;
                _this.connections = filter(function (x) { return x !== childNode.audioNode; }, _this.connections);
            }, Object.keys(node.virtualNodes));
        }
        else {
            if (!this.connections.some(function (x) { return x === node.audioNode; }))
                return;
            this.connections = filter(function (x) { return x !== node.audioNode; }, this.connections);
        }
    }
    audioNode.disconnect && audioNode.disconnect();
    this.connected = false;
};
var disconnectAndDestroy = function () {
    var _a = this, audioNode = _a.audioNode, stopCalled = _a.stopCalled;
    if (audioNode.stop && !stopCalled)
        audioNode.stop();
    audioNode.disconnect && audioNode.disconnect();
    this.connected = false;
};
var update = function (params) {
    var _this = this;
    if (params === void 0) { params = {}; }
    forEach(function (key) {
        if (constructorParamsKeys.indexOf(key) !== -1)
            return;
        var param = params[key];
        if (_this.params && _this.params[key] === param)
            return;
        if (audioParamProperties.indexOf(key) !== -1) {
            if (Array.isArray(param)) {
                if (_this.params && !equals(param, _this.params[key])) {
                    _this.audioNode[key].cancelScheduledValues(0);
                }
                var callMethod = function (_a) {
                    var methodName = _a[0], args = _a.slice(1);
                    return (_b = _this.audioNode[key])[methodName].apply(_b, args);
                    var _b;
                };
                Array.isArray(param[0]) ? forEach(callMethod, param) : callMethod(param);
                return;
            }
            _this.audioNode[key].value = param;
            return;
        }
        if (setters.indexOf(key) !== -1) {
            (_a = _this.audioNode)["set" + capitalize(key)].apply(_a, param);
            return;
        }
        _this.audioNode[key] = param;
        var _a;
    }, Object.keys(params));
    this.params = params;
    return this;
};
var createStandardVirtualAudioNode = function (audioContext, _a) {
    var node = _a[0], output = _a[1], params = _a[2], input = _a[3];
    var paramsObj = params || {};
    var offsetTime = paramsObj.offsetTime, startTime = paramsObj.startTime, stopTime = paramsObj.stopTime;
    var constructorParam = paramsObj[find(function (key) { return constructorParamsKeys.indexOf(key) !== -1; }, Object.keys(paramsObj))];
    var virtualNode = {
        audioNode: createAudioNode(audioContext, node, constructorParam, { offsetTime: offsetTime, startTime: startTime, stopTime: stopTime }),
        connect: connect,
        connected: false,
        connections: [],
        disconnect: disconnect,
        disconnectAndDestroy: disconnectAndDestroy,
        input: input,
        isCustomVirtualNode: false,
        node: node,
        output: output,
        stopCalled: stopTime !== undefined,
        update: update,
    };
    return virtualNode.update(paramsObj);
};

var connect$1 = function () {
    var connectArgs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        connectArgs[_i] = arguments[_i];
    }
    forEach(function (childVirtualNode) {
        var output = childVirtualNode.output;
        if (output === 'output' ||
            Array.isArray(output) && output.indexOf('output') !== -1)
            childVirtualNode.connect.apply(childVirtualNode, filter(Boolean, connectArgs));
    }, values(this.virtualNodes));
    this.connected = true;
};
var disconnect$1 = function () {
    var keys = Object.keys(this.virtualNodes);
    for (var i = 0; i < keys.length; i++) {
        var virtualNode = this.virtualNodes[keys[i]];
        var output = virtualNode.output;
        if (output === 'output' ||
            Array.isArray(output) && output.indexOf('output') !== -1)
            virtualNode.disconnect();
    }
    this.connected = false;
};
var disconnectAndDestroy$1 = function () {
    var keys = Object.keys(this.virtualNodes);
    for (var i = 0; i < keys.length; i++)
        this.virtualNodes[keys[i]].disconnectAndDestroy();
    this.connected = false;
};
var update$1 = function (params) {
    if (params === void 0) { params = {}; }
    var audioGraphParamsFactoryValues = values(this.node(params));
    var keys = Object.keys(this.virtualNodes);
    for (var i = 0; i < keys.length; i++) {
        this.virtualNodes[keys[i]].update(audioGraphParamsFactoryValues[i][2]);
    }
    this.params = params;
    return this;
};
var createCustomVirtualAudioNode = function (audioContext, _a) {
    var node = _a[0], output = _a[1], params = _a[2];
    var virtualNodes = mapObj(function (virtualAudioNodeParam) { return createVirtualAudioNode(audioContext, virtualAudioNodeParam); }, node(params));
    connectAudioNodes(virtualNodes, function () { });
    return {
        connect: connect$1,
        connected: false,
        disconnect: disconnect$1,
        disconnectAndDestroy: disconnectAndDestroy$1,
        isCustomVirtualNode: true,
        node: node,
        output: output,
        params: params || {},
        update: update$1,
        virtualNodes: virtualNodes,
    };
};

var createVirtualAudioNode = function (audioContext, virtualAudioNodeParam) { return typeof virtualAudioNodeParam[0] === 'function'
    ? createCustomVirtualAudioNode(audioContext, virtualAudioNodeParam)
    : createStandardVirtualAudioNode(audioContext, virtualAudioNodeParam); };

/* global AudioContext */
var disconnectParents = function (virtualNode, virtualNodes) { return forEach(function (key) { return virtualNodes[key].disconnect(virtualNode); }, Object.keys(virtualNodes)); };
var createVirtualAudioGraph = function (_a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.audioContext, audioContext = _c === void 0 ? new AudioContext() : _c, _d = _b.output, output = _d === void 0 ? audioContext.destination : _d;
    return {
        audioContext: audioContext,
        get currentTime() { return audioContext.currentTime; },
        getAudioNodeById: function (id) { return this.virtualNodes[id].audioNode; },
        update: function (newGraph) {
            var _this = this;
            forEach(function (id) {
                if (newGraph.hasOwnProperty(id))
                    return;
                var virtualAudioNode = _this.virtualNodes[id];
                virtualAudioNode.disconnectAndDestroy();
                disconnectParents(virtualAudioNode, _this.virtualNodes);
                delete _this.virtualNodes[id];
            }, Object.keys(this.virtualNodes));
            forEach(function (key) {
                if (key === 'output')
                    throw new Error('"output" is not a valid id');
                var newNodeParams = newGraph[key];
                var paramsNodeName = newNodeParams[0], paramsOutput = newNodeParams[1], paramsParams = newNodeParams[2];
                if (paramsOutput == null && paramsNodeName !== 'mediaStreamDestination') {
                    throw new Error("output not specified for node key " + key);
                }
                var virtualAudioNode = _this.virtualNodes[key];
                if (virtualAudioNode == null) {
                    _this.virtualNodes[key] = createVirtualAudioNode(audioContext, newNodeParams);
                    return;
                }
                if ((paramsParams && paramsParams.startTime) !==
                    (virtualAudioNode.params && virtualAudioNode.params.startTime) ||
                    (paramsParams && paramsParams.stopTime) !==
                        (virtualAudioNode.params && virtualAudioNode.params.stopTime) ||
                    paramsNodeName !== virtualAudioNode.node) {
                    virtualAudioNode.disconnectAndDestroy();
                    disconnectParents(virtualAudioNode, _this.virtualNodes);
                    _this.virtualNodes[key] = createVirtualAudioNode(audioContext, newNodeParams);
                    return;
                }
                if (!equals(paramsOutput, virtualAudioNode.output)) {
                    virtualAudioNode.disconnect();
                    disconnectParents(virtualAudioNode, _this.virtualNodes);
                    virtualAudioNode.output = paramsOutput;
                }
                virtualAudioNode.update(paramsParams);
            }, Object.keys(newGraph));
            connectAudioNodes(this.virtualNodes, function (virtualNode) { return virtualNode.connect(output); });
            return this;
        },
        virtualNodes: {},
    };
};

var audioContext = new AudioContext();
var virtualAudioGraph = createVirtualAudioGraph({
    audioContext: audioContext,
    output: audioContext.destination,
});
var example1 = function () {
    var currentTime = virtualAudioGraph.currentTime;
    virtualAudioGraph.update({
        0: ['gain', 'output', { gain: 0.2 }],
        1: ['oscillator', 0, {
                frequency: 440,
                stopTime: currentTime + 1,
                type: 'square',
            }],
        2: ['oscillator', 0, {
                detune: 4,
                frequency: 660,
                startTime: currentTime + 0.5,
                stopTime: currentTime + 1.5,
                type: 'sawtooth',
            }],
    });
};
var example2 = function () {
    var currentTime = virtualAudioGraph.currentTime;
    virtualAudioGraph.update({
        0: ['gain', 'output', { gain: 0.2 }],
        1: ['oscillator', 0, { stopTime: currentTime + 3 }],
        2: ['gain', { destination: 'frequency', key: 1 }, { gain: 10 }],
        3: ['oscillator', [2, 'output'], { frequency: 1, type: 'triangle' }],
    });
};
var example3 = function () {
    var chromaticScale = function (n) { return 440 * Math.pow(2, n / 12); };
    var pingPongDelay = function (_a) {
        var decay = _a.decay, delayTime = _a.delayTime;
        return ({
            0: ['stereoPanner', 'output', { pan: -1 }],
            1: ['stereoPanner', 'output', { pan: 1 }],
            2: ['delay', [1, 'five'], { delayTime: delayTime, maxDelayTime: delayTime }],
            3: ['gain', 2, { gain: decay }],
            4: ['delay', [0, 3], { delayTime: delayTime, maxDelayTime: delayTime }],
            five: ['gain', 4, { gain: decay }, 'input'],
        });
    };
    var oscillators = function (_a) {
        var _b = _a.currentTime, currentTime = _b === void 0 ? virtualAudioGraph.currentTime : _b, notes = _a.notes, noteLength = _a.noteLength;
        return notes.reduce(function (acc, frequency, i) {
            var startTime = currentTime + noteLength * 2 * i;
            acc[i] = ['oscillator', 'output', {
                    frequency: frequency,
                    startTime: startTime,
                    stopTime: startTime + noteLength,
                }];
            return acc;
        }, {});
    };
    var noteLength = 0.075;
    var up = Array.apply(null, { length: 16 }).map(function (_, i) { return chromaticScale(i); });
    var down = up.slice().reverse();
    virtualAudioGraph.update({
        0: ['gain', 'output', { gain: 0.2 }],
        1: [pingPongDelay, 0, {
                decay: 1 / 2,
                delayTime: noteLength * 3 / 2,
            }],
        2: ['gain', [0, 1], { gain: 1 / 4 }],
        3: [oscillators, [0, 1], {
                noteLength: noteLength,
                notes: up.concat(down),
            }],
    });
};
document.getElementById('example1').onclick = example1;
document.getElementById('example2').onclick = example2;
document.getElementById('example3').onclick = example3;

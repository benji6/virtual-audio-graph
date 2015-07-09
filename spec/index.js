require('web-audio-test-api');
WebAudioTestAPI.setState("AudioContext#createStereoPanner", "enabled");
require('./VirtualAudioGraph');
require('./virtualAudioGraph.defineNode');
require('./virtualAudioGraph.update');

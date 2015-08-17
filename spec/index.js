/* global WebAudioTestAPI */
require('web-audio-test-api');
WebAudioTestAPI.setState({
  'AudioContext#createStereoPanner': 'enabled',
  'AnalyserNode#getFloatTimeDomainData': 'enabled',
});
require('./VirtualAudioGraph');
require('./defineNode/index');
require('./update/index');

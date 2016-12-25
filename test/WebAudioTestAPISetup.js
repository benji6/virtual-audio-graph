/* global WebAudioTestAPI */
require('web-audio-test-api')

WebAudioTestAPI.setState({
  'AnalyserNode#getFloatTimeDomainData': 'enabled',
  'AudioContext#createStereoPanner': 'enabled',
})

/* global WebAudioTestAPI */
require('web-audio-test-api')

WebAudioTestAPI.setState({
  'AudioContext#createStereoPanner': 'enabled',
  'AnalyserNode#getFloatTimeDomainData': 'enabled'
})

import 'web-audio-test-api'

declare const WebAudioTestAPI: any

WebAudioTestAPI.setState({
  'AnalyserNode#getFloatTimeDomainData': 'enabled',
  'AudioContext#createStereoPanner': 'enabled',
})

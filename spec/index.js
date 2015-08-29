/* global WebAudioTestAPI */
import 'web-audio-test-api';
WebAudioTestAPI.setState({
  'AudioContext#createStereoPanner': 'enabled',
  'AnalyserNode#getFloatTimeDomainData': 'enabled',
});
import './VirtualAudioGraph';
import './defineNode/index';
import './update/index';

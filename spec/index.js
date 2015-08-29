/* global WebAudioTestAPI */
import 'web-audio-test-api';
WebAudioTestAPI.setState({
  'AudioContext#createStereoPanner': 'enabled',
  'AnalyserNode#getFloatTimeDomainData': 'enabled',
});
import './VirtualAudioGraph';
import './defineNode/errorThrowing';
import './defineNode/expectedBehaviour';
import './update/creatingAudioNodes';
import './update/errorThrowing';
import './update/expectedBehaviour';
import './update/scheduling';

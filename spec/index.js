/* global WebAudioTestAPI */
import 'web-audio-test-api';
WebAudioTestAPI.setState({
  'AudioContext#createStereoPanner': 'enabled',
  'AnalyserNode#getFloatTimeDomainData': 'enabled',
});
import createVirtualAudioGraphSrc from '../src/index.js';
import createVirtualAudioGraphDist from '../dist/index.js';
import VirtualAudioGraph from './VirtualAudioGraph';
import defineNodeErrorThrowing from './defineNode/errorThrowing';
import defineNodeExpectedBehaviour from './defineNode/expectedBehaviour';
import updateAudioParamMethods from './update/audioParamMethods';
import updateCreatingAudioNodes from './update/creatingAudioNodes';
import updateErrorThrowing from './update/errorThrowing';
import updateExpectedBehaviour from './update/expectedBehaviour';
import updateScheduling from './update/scheduling';

const specs = [VirtualAudioGraph,
               defineNodeErrorThrowing,
               defineNodeExpectedBehaviour,
               updateAudioParamMethods,
               updateCreatingAudioNodes,
               updateErrorThrowing,
               updateExpectedBehaviour,
               updateScheduling];

specs.forEach(spec => spec((createVirtualAudioGraphSrc)));
specs.forEach(spec => spec((createVirtualAudioGraphDist)));

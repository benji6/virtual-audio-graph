const VirtualAudioGraph = require('../src/index.js');
const audioContext = new AudioContext();

const button = document.body.appendChild(document.createElement("button"));
button.innerHTML = "test button";

const virtualAudioGraph = new VirtualAudioGraph({
  audioContext,
  destination: audioContext.destination,
});

button.onclick = (() => {
  var isOn = false;

  return () => {
    var virtualNodeParams;
    if (isOn) {
      virtualNodeParams = [{
        id: 1,
        name: 'gain',
        connections: 0,
      }];
    } else {
      virtualNodeParams = [{
        id: 1,
        name: 'gain',
        connections: 0,
      },
      {
        id: 2,
        name: 'oscillator',
        connections: 1,
      }];
    }
    isOn = !isOn;
    virtualAudioGraph.update(virtualNodeParams);
  }
}());
const React = require('react');
const VirtualAudioGraph = require('../src/index.js');
const audioContext = new AudioContext();

const virtualAudioGraph = new VirtualAudioGraph({
  audioContext,
  destination: audioContext.destination,
});

const View = React.createClass({
  changeVol: function (e) {
    this.props.gain = Number(e.target.value);
  },

  componentDidMount: function() {
    this.props.oscillatorType = 'sine';
    this.props.gain = 0.2;
  },

  handleClick: (() => {
    var isOn = false;

    return function () {
      var virtualNodeParams;
      if (isOn) {
        virtualNodeParams = [{
          id: 1,
          name: 'gain',
          connections: 0,
        }];
      } else {
        virtualNodeParams = [
          {
            connections: [0],
            id: 1,
            name: 'gain',
            params: {
              gain: 0.2,
            },
          },
          {
            connections: [1],
            id: 2,
            name: 'oscillator',
            params: {
              type: 'square',
              frequency: 440,
            },
          },
          {
            connections: [1],
            id: 3,
            name: 'oscillator',
            params: {
              type: 'sawtooth',
              frequency: 220,
              detune: 4,
            },
          },
        ];
      }
      isOn = !isOn;
      virtualAudioGraph.update(virtualNodeParams);
    };
  }()),

  onSelect: function (e) {
    this.props.oscillatorType = e.target.value;
  },

  render: function () {
    return <div>
      <br></br>
      <h2 className="text-center">Manual Tests</h2>
      <br></br>
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-2"></div>
          <div className="col-sm-2">
            <button className="btn btn-lg btn-primary" onClick={this.handleClick}>Test</button>
          </div>
          <div className="col-sm-2">
            <select defaultValue="sine" onChange={this.onSelect}>>
              <option value="sawtooth">sawtooth</option>
              <option value="sine">sine</option>
              <option value="square">square</option>
              <option value="triangle">triangle</option>
            </select>
          </div>
          <div className="col-sm-6">
            <p>Toggle simple tone</p>
          </div>
          <div className="col-sm-6">
            <p>volume</p>
            <input type="range" min="0" max="1" step="0.01" onChange={this.changeVol}></input>
          </div>
        </div>
      </div>
    </div>
  },
});

const ViewFactory = React.createFactory(View);
const container = document.body.appendChild(document.createElement("div"));

React.render(
  ViewFactory(),
  container
);

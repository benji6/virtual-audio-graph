const React = require('react');
const VirtualAudioGraph = require('../src/index.js');
const audioContext = new AudioContext();

const virtualAudioGraph = new VirtualAudioGraph({
  audioContext,
  destination: audioContext.destination,
});

const View = React.createClass({
  handleClick: (() => {
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
    };
  }()),

  render: function () {
    return <div>
      <br></br>
      <h2 className="text-center">Manual Tests</h2>
      <br></br>
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-2"></div>
          <div className="col-sm-2">
            <button className="btn btn-lg btn-primary" onClick={this.handleClick}>Test 1</button>
          </div>
          <div className="col-sm-8">
            <p>Toggle simple tone</p>
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

class Noise extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [
      { name: "amplitude", defaultValue: 0.25, minValue: 0, maxValue: 1 },
    ];
  }

  process(inputs, [output], { amplitude }) {
    for (const outputChannel of output) {
      for (let i = 0; i < outputChannel.length; i++) {
        outputChannel[i] = 2 * (Math.random() - 0.5) * amplitude[i];
      }
    }

    return true;
  }
}

registerProcessor("noise", Noise);

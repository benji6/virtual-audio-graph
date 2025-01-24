class BitCrusher extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [
      { name: "bitDepth", defaultValue: 12, minValue: 1, maxValue: 16 },
      {
        name: "frequencyReduction",
        defaultValue: 0.5,
        minValue: 0,
        maxValue: 1,
      },
    ];
  }

  constructor(options) {
    super(options);
    this.lastSampleValue = 0;
    this.phase = 0;
  }

  process([input], [output], parameters) {
    const bitDepth = parameters.bitDepth[0];
    const frequencyReduction = parameters.frequencyReduction[0];
    for (let channel = 0; channel < input.length; channel++) {
      const inputChannel = input[channel];
      const outputChannel = output[channel];
      for (let i = 0; i < inputChannel.length; ++i) {
        this.phase += frequencyReduction;
        if (this.phase >= 1) {
          const step = Math.pow(0.5, bitDepth);
          this.phase -= 1;
          this.lastSampleValue =
            step * Math.floor(inputChannel[i] / step + 0.5);
        }
        outputChannel[i] = this.lastSampleValue;
      }
    }

    return true;
  }
}

registerProcessor("bitCrusher", BitCrusher);

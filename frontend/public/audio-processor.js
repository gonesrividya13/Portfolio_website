// audio-processor.js
class PCMProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.bufferSize = 2048;
    this._bytesWritten = 0;
    this._buffer = new Float32Array(this.bufferSize);
  }

  process(inputs, outputs, parameters) {
    const input = inputs[0];
    if (input.length > 0) {
      const channelData = input[0];
      
      for (let i = 0; i < channelData.length; i++) {
        this._buffer[this._bytesWritten++] = channelData[i];
        
        if (this._bytesWritten >= this.bufferSize) {
          this.port.postMessage(this._buffer);
          this._bytesWritten = 0;
        }
      }
    }
    return true;
  }
}

registerProcessor('pcm-processor', PCMProcessor);

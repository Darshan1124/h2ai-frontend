class AudioProcessor extends AudioWorkletProcessor {
    constructor() {
      super();
      this.bufferSize = 4096; // Send ~250ms chunks (at 16kHz)
      this.buffer = new Int16Array(this.bufferSize);
      this.bufferIndex = 0;
    }
  
    // Convert Float32 (-1.0 to 1.0) to Int16 (-32768 to 32767)
    convertFloat32ToInt16(float32Array) {
      const int16Array = new Int16Array(float32Array.length);
      for (let i = 0; i < float32Array.length; i++) {
        let s = Math.max(-1, Math.min(1, float32Array[i]));
        int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
      }
      return int16Array;
    }
  
    process(inputs, outputs, parameters) {
      const inputChannel = inputs[0][0];
  
      if (inputChannel && inputChannel.length > 0) {
        // 1. Convert to PCM
        const pcmChunk = this.convertFloat32ToInt16(inputChannel);
        
        // 2. Buffer Logic
        let dataToCopy = pcmChunk;
        let offset = 0;

        while (offset < dataToCopy.length) {
            const spaceRemaining = this.bufferSize - this.bufferIndex;
            const chunkToCopy = dataToCopy.subarray(offset, offset + spaceRemaining);
            
            this.buffer.set(chunkToCopy, this.bufferIndex);
            this.bufferIndex += chunkToCopy.length;
            offset += chunkToCopy.length;

            // If buffer is full, send it
            if (this.bufferIndex >= this.bufferSize) {
                // Clone buffer to send (important for transfer)
                const bufferToSend = new Int16Array(this.buffer);
                this.port.postMessage(bufferToSend.buffer, [bufferToSend.buffer]);
                
                // Reset
                this.bufferIndex = 0;
            }
        }
      }
  
      return true;
    }
  }
  
  registerProcessor('audio-processor', AudioProcessor);
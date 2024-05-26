const { Transform } = require('stream');

class BatchTransformer extends Transform {
  constructor(options) {
    super({ objectMode: true, ...options });
    this.buffer = [];
    this.bufferSize = 100;
  }

  _transform(chunk, encoding, callback) {
    const jsonString = Array.isArray(chunk) || typeof chunk === 'object' ? JSON.stringify(chunk) : chunk.toString();
    const json = JSON.parse(jsonString);
    this.buffer.push(json);

    if (this.buffer.length >= this.bufferSize) {
      this.push(JSON.stringify({ batch: this.buffer }));
      this.buffer = [];
    }
    callback();
  }

  _flush(callback) {
    console.log("BatchTransformer flush", Date.now());
    if (this.buffer.length > 0) {
      this.push(JSON.stringify({batch: this.buffer }));
    }
    callback();
  }
}

module.exports = {
  BatchTransformer
};

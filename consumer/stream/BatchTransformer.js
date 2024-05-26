const { Readable, Transform, pipeline } = require('stream');
const https = require('https');

// Assuming BatchTransformer is defined as before...

// Custom Transform Stream class
class BatchTransformer extends Transform {

  constructor(options) {
    super({ objectMode: true, ...options });
  }

  _transform(chunk, encoding, callback) {
    // console.log('BatchTransformer -----> ', chunk, ' time: -----> ', Date.now());
    // Example transformation: Filter and modify the JSON data
    // Assuming each chunk is an object
    console.log("last chunk", chunk)
    if (chunk === 'transformEnd') {
      console.log('end of the chunk', chunk);
    }
    const jsonString = Array.isArray(chunk) || typeof chunk === 'object' ? JSON.stringify(chunk) : chunk.toString();
    // Parse JSON
    const obj = JSON.parse(jsonString);
    this.doBatching(obj);
    return callback();
  }

  doBatching(data, cb) {
    if(this.data?.length > 0) {
      this.data.push(data);
    }else {
      this.data = [data];
    }

    if(this.data?.length === 5) {
      console.log('local buffer full');
      this.push(JSON.stringify({batch: this.data}));
      this.data = [];
    }
    return;
  }
}

module.exports = {
  BatchTransformer
}
const { Transform } = require('stream');

// Assuming ExcelWriterTransform is defined as before...

// Custom Transform Stream class
class ExcelWriterTransform extends Transform {

  constructor(options) {
    super({ objectMode: true, ...options });
  }

  _transform(chunk, encoding, callback) {
    // Example transformation: Filter and modify the JSON data
    // Assuming each chunk is an object
    console.log("excel writer ---->", chunk);
    this.push(chunk);
    return callback();
  }

}

module.exports = {
  ExcelWriterTransform
}

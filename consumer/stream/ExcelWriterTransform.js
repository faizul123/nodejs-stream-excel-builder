const { Transform } = require('stream');
const ExcelWriter = require('../excel/ExcelWriter');

class ExcelWriterTransform extends Transform {
  constructor(options) {
    super({ objectMode: true, ...options });
    this.excelWriter = new ExcelWriter();
  }

  _transform(chunk, encoding, callback) {
   // console.log("excel writer ---->", chunk);

    if (chunk === null) {
      return callback();
    }

    let batch;
    try {
      ({ batch } = JSON.parse(chunk));
    } catch (err) {
      return callback(err);
    }

    this.excelWriter.addRow(batch);
    callback();
  }

  _flush(callback) {
    console.log('end of excel transform', Date.now());
    this.excelWriter.commit()
    .then(() => { console.log("success "); callback() })
     .catch((error) => { console.log(error);  callback() });
  }
}

module.exports = {
  ExcelWriterTransform
};

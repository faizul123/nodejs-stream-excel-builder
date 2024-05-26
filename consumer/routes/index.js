const { pipeline } = require('stream');
const through2 = require('through2');
var express = require('express');
var router = express.Router();
const { JSONResponseStream, BatchTransformer, ExcelWriterTransform } = require('../stream');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/download', function (req, res, next) {
  // Example usage with the pipeline method
  const jsonStream = new JSONResponseStream('http://localhost:3000/transactions');
  const transformStreamObject = new BatchTransformer({
    highWaterMark: 4 * 1024
  });
  const excelWriterTransformer = new ExcelWriterTransform({
    highWaterMark: 4 * 1024
  })

  function flush(cb) {
    this.push('transformEnd');
    return cb();
  }
  const transformer = through2(
    { objectMode: true, allowHalfOpen: true },
    transformStreamObject._transform.bind(transformStreamObject),
    flush
  );

  pipeline(
    jsonStream,
    transformStreamObject,
    excelWriterTransformer,
    process.stdout, // For demonstration, replace with a more suitable writable stream if needed
    (err) => {
      if (err) {
        console.error('Pipeline failed.', err);
      } else {
        console.log('Pipeline completed successfully.');
      }
    }
  );
  res.status(200).send({ 'processed': true });
});

module.exports = router;

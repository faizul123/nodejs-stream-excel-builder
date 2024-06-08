const { pipeline } = require('stream');
const through2 = require('through2');
var express = require('express');
var router = express.Router();
const { JSONResponseStream, BatchTransformer, ExcelWriterTransform, PrintStream,  } = require('../stream');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/download', function (req, res, next) {
  // Example usage with the pipeline method
  const jsonStream = new JSONResponseStream('http://localhost:3000/transactions',3);
  const batchTransformer = new BatchTransformer({
    highWaterMark: 4 * 1024
  });
  const excelWriterTransformer = new ExcelWriterTransform({
    highWaterMark: 4 * 1024
  })

  console.log("start of pipeline");
  pipeline(
    jsonStream,
   batchTransformer,
    excelWriterTransformer,
   // uploadExcelStream
    (err) => {
      if (err) {
        console.error('Pipeline failed.', err);
      } else {
        // update file generated completion status
        console.log('Pipeline completed successfully.');
      }
    }
  )
  console.log('end of pipeline');

  res.status(200).send({ 'processed': true });
});

module.exports = router;

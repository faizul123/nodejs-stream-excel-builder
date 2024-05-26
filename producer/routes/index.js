const fs = require('fs');
const ndJSON = require('ndjson');
const path = require('path');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/transactions', function (req, res, next) {
  const stream = fs.createReadStream('transactions.txt', {
    highWaterMark: 4 * 1024 // 4 K.B
  });
  
  stream.on('data', (chunk) => {
    // Send each chunk as it's read
    // console.log('JSON as Chunks...');
    res.write(chunk);
  });

  stream.on('end', () => {
    // Signal the end of the response
    // console.log('transactions end of file');
    res.end();
  });

});

module.exports = router;

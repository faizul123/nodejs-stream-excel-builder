const fs = require('fs');
const {Readable} = require('stream');
const ndJSON = require('ndjson');
const path = require('path');
const axios = require('axios');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/transactions', function (req, res, next) {
  // const stream = fs.createReadStream('transactions.txt', {
  //   highWaterMark: 4 * 1024 // 4 K.B
  // });
  let i =0;
  let string = "";
  while(i < 500) {
    string += `{"accountNumber": "101342342342", "accountType": "s", "rcCode": "23423", "routingCode": "ENBX00AD", "transactionDate": 342242422432, "updatedAt": 2342424242, "name": "corporate user", "instrumentId": 3484208342 }\n`;
    i++;
  }
  string += `{"accountNumber": "FAIZUL", "accountType": "s", "rcCode": "i=${i}", "routingCode": "ENBX00AD", "transactionDate": 342242422432, "updatedAt": 2342424242, "name": "corporate user", "instrumentId": 3484208342 }\n`;
  fs.writeFileSync('data.txt', string);
  const strBuff = Buffer.from(string, 'utf-8');
  const stream = new Readable({
    highWaterMark: 4 * 10124
  });
  console.log("total size in kb ", strBuff.length/1024)
  const chunkSize = 1024;

  stream.on('data', (chunk) => {
    // Send each chunk as it's read
    // console.log('JSON as Chunks...');
    console.log('writing chunks');
    res.write(chunk);
  });

  stream.on('end', () => {
    // Signal the end of the response
    console.log('transactions end of file');
    res.end();
  });
  
  // Split the buffer into smaller chunks and push them into the stream
  for (let j = 0; j < strBuff.length; j += chunkSize) {
    const chunk = strBuff.slice(j, j + chunkSize);
    stream.push(chunk);
  }
  stream.push(null);

});

module.exports = router;

const { Readable } = require('stream');
const http = require('http');
const ndJSON = require('ndjson');

// Custom Readable Stream class
class JSONResponseStream extends Readable {
  constructor(url) {
    super({ objectMode: true });
    this.url = url;
  }

  _read() {
    http.get(this.url, (res) => {
      res.pipe(ndJSON.parse())
      .on('data', (chunk) => {
        // console.log('chunk received');
        // console.log(chunk);
        this.push(JSON.stringify(chunk))
      });
      res.on('end', () => {
        try {
          // const jsonData = JSON.parse(data);
          // console.log(typeof jsonData);
          // this.push(jsonData); // Push the JSON data into the stream
          // console.log('time: ------> ', Date.now());
        } catch (error) {
          this.emit('error', error);
        }
        this.push(null); // No more data to read
      });
    }).on('error', (error) => {
      this.emit('error', error);
    });
  }
}

module.exports = {
  JSONResponseStream
}

// Using the custom stream
// const jsonStream = new JSONResponseStream('https://api.example.com/data');
// jsonStream.on('data', (data) => {
//   console.log('Received data:', data);
// });
// jsonStream.on('end', () => {
//   console.log('No more data.');
// });
// jsonStream.on('error', (error) => {
//   console.error('Error:', error);
// });

const { Readable } = require('stream');
const http = require('http');
const ndJSON = require('ndjson');

// Custom Readable Stream class
class JSONResponseStream extends Readable {
  constructor(url) {
    super({ objectMode: true, highWaterMark: 4 * 1024 });
    this.url = url;
    this.counter = 1;
  }

  _read() {
    if (!this.request) {
      this.request = http.get(this.url, (res) => {
        const parsedStream = res.pipe(ndJSON.parse());
        parsedStream.on('data', (chunk) => {
          this.push(JSON.stringify(chunk));
        });
        parsedStream.on('end', () => {
          console.log('End of parsed JSON stream');
          this.push(null); // No more data to read
        });
      });
      this.request.on('error', (error) => {
        this.emit('error', error);
      });
    }
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

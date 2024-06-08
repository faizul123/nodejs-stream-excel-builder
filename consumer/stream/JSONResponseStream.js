const { Readable } = require('stream');
const axios = require('axios');
const ndJSON = require('ndjson');

// Custom Readable Stream class with pagination
class JSONResponseStream extends Readable {
  constructor(url, totalPages) {
    super({ objectMode: true, highWaterMark: 12 * 1024 });
    this.url = url;
    this.totalPages = totalPages;
    this.currentPage = 1;
    this.activeRequests = 0; // Counter to track active HTTP requests
    this.processing = false; // Flag to indicate if the current page is being processed
  }

  _fetchPage(page) {
    this.activeRequests++;
    const apiUrl = `${this.url}?page=${page}`;
    const response = axios.default.get(apiUrl, {
      responseType: 'stream'
    }).then((res) => {
      res.data.pipe(ndJSON.parse())
        .on('data', (chunk) => {
          this.push(JSON.stringify(chunk));
        })
        .on('end', () => {
          this.activeRequests--;
          this.processing = false; // Reset the processing flag
          if (this.currentPage < this.totalPages && this.activeRequests === 0) {
            this.currentPage++;
            this._fetchNextPage();
          } else if (this.activeRequests === 0) {
            this.push(null);
          }
        })
        .on('error', (error) => {
          this.emit('error', error);
        });
    }).catch((error) => {
      this.emit('error', error);
    });
  }

  _fetchNextPage() {
    if (!this.processing && this.currentPage <= this.totalPages) {
      this.processing = true;
      this._fetchPage(this.currentPage);
    }
  }

  _read() {
    if (!this.processing) {
      this._fetchNextPage();
    }
  }
}

module.exports = {
  JSONResponseStream
};

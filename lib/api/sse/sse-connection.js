class SSEConnection {
  constructor(response) {
    this.response = response;
    this.response.writeHead(200, this.sseHeaders());
  }

  sseHeaders() {
    return {
      'Content-Type': 'text/event-stream',
      'Connection': 'keep-alive',
      'Cache-Control': 'no-cache'
    };
  }
}

module.exports = SSEConnection;
class SSEConnection {
  constructor(request, response) {
    this.request = request;
    this.response = response;
    this.establishConnection();
  }

  send(data) {
    this.response.write(`data: ${JSON.stringify(data)}\n\n`);
  }

  establishConnection() {
    this.response.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Connection': 'keep-alive',
      'Cache-Control': 'no-cache'
    });
  }
}

module.exports = SSEConnection;
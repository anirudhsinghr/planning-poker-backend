const { RoomRepository, VoterRepository } = require("../repositories");
const { initializeContext } = require("./adapters");
const server = require("./server");
const SSEBroadcaster = require("./sse/broadcaster");
const SSEConnection = require("./sse/connection");

class ExpressApiServer {

  constructor(overrides) {
    const dependencies =  {
      roomRepository: new RoomRepository(),
      voterRepository: new VoterRepository(),
      eventBroadcaster: new SSEBroadcaster(),
      generateRandomId: () => Date.now().toString(),
      createConnection: (request, response) => new SSEConnection(request, response),
    };
    
    initializeContext({...dependencies, ...overrides});
  }
  
  start(overrides) {
    server.start(overrides);
  }

  stop() {
    server.stop();
  }
};

module.exports = ExpressApiServer;
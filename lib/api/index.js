const { RoomRepository, VoterRepository } = require("../repositories");
const { initializeContext } = require("./adapters");
const server = require("./server");
const Broadcaster = require("./websocket/broadcaster");
const Connection = require("./websocket/connection");

class ExpressApiServer {

  constructor(overrides) {
    const dependencies =  {
      roomRepository: new RoomRepository(),
      voterRepository: new VoterRepository(),
      eventBroadcaster: new Broadcaster(),
      generateRandomId: () => Date.now().toString(),
      createConnection: (socket) => new Connection(socket),
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
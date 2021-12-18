const { RoomRepository, VoterRepository } = require("../repositories");
const { initializeContext } = require("./adapters");
const server = require("./server");

class ExpressApiServer {

  constructor(overrides) {
    const dependencies =  {
      roomRepository: new RoomRepository(),
      voterRepository: new VoterRepository(),
      generateRandomId: () => Date.now().toString(),
      eventBroadcaster: {},
      createConnection: () => ({}),
    };
    
    initializeContext({...dependencies, ...overrides});
  }
  
  start() {
    server.start();
  }

  stop() {
    server.stop();
  }
};

module.exports = ExpressApiServer;
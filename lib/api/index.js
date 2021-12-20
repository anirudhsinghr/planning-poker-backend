const { RoomRepository, VoterRepository } = require("../repositories");
const { initializeContext } = require("./adapters");
const { io } = require("./server");
const server = require("./server");
const Channel = require("./websocket/channel");
const Connection = require("./websocket/connection");

class ExpressApiServer {

  constructor(overrides) {
    const dependencies =  {
      roomRepository: new RoomRepository(),
      voterRepository: new VoterRepository(),
      generateRandomId: () => Date.now().toString(),
      createConnection: (roomId, socket) => new Connection(roomId, socket),
      createChannel: (id) => new Channel(id, io)
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
const { expect } = require("chai");
const axios = require("axios").default;
const EventSource = require("eventsource");

const { start, stop } = require("../../lib/api");
const { createRoom } = require("./fixtures");
const { createRoomUrl } = require("./fixtures")

describe("Room Api", function () {
  beforeEach(() => start());

  it("a room can be created", async function () {
    const response = await axios.post(createRoomUrl());
    expect(response.status).to.equal(201);
    expect(response.data).to.not.be.undefined;
    expect(response.data.roomId).to.not.be.undefined;
  });

  it("a room can be connected to", async function() {
    const { roomId } = await createRoom();
    
    const connection = new EventSource(`http://localhost:3000/room/${roomId}`);
    expect(connectingToRoom(connection)).to.be.true;
    
    connection.onopen = () => expect(connectedToRoom(connection)).to.be.true;
    
    connection.close();
    expect(connectionClosed(connection)).to.be.true;
  });

  afterEach(() => stop());

  function connectingToRoom(event) {
    return event.readyState == EventSource.CONNECTING;
  }

  function connectionClosed(event) {
    return event.readyState == EventSource.CLOSED;
  }

  function connectedToRoom(event) {
    return event.readyState == EventSource.CLOSED;
  }
})
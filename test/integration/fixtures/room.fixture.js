const axios = require("axios").default;
const EventSource = require("eventsource");
const { createRoomUrl, connectToRoomUrl } = require("./urls");

async function createRoom() {
  const response = await axios.post(createRoomUrl());
  return response.data;
}

function connectToRoom({ roomId }) {
  return new EventSource(connectToRoomUrl({ roomId }));
}

module.exports = { createRoom, connectToRoom };